-- 在 Supabase SQL Editor 完整执行本文件。
-- 允许小朋友设备使用匿名账号兑换；请先在 Authentication -> Providers 开启 Anonymous Sign-Ins。

create table if not exists public.daily_checkins (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  check_date date not null,
  checks jsonb not null default '{}'::jsonb,
  done_count integer not null default 0 check (done_count >= 0),
  total_count integer not null default 0 check (total_count >= 0),
  is_full boolean not null default false,
  last_synced_at timestamptz not null default now(),
  constraint daily_checkins_user_date_unique unique (user_id, check_date),
  constraint daily_checkins_progress_valid check (done_count <= total_count)
);

create index if not exists daily_checkins_user_date_idx on public.daily_checkins (user_id, check_date desc);

create table if not exists public.family_groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  code_hash text not null unique,
  code_value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint family_groups_code_value_valid check (code_value is null or code_value ~ '^\d{6}$')
);
-- 兼容已创建的表：家长页需要显示当前兑换码，因此仅在服务端保存一份可读取值。
alter table public.family_groups add column if not exists code_value text;

create table if not exists public.family_devices (
  id bigint generated always as identity primary key,
  family_id uuid not null references public.family_groups(id) on delete cascade,
  device_user_id uuid not null unique references auth.users(id) on delete cascade,
  reward jsonb,
  linked_at timestamptz not null default now()
);
alter table public.family_devices add column if not exists reward jsonb;

alter table public.daily_checkins enable row level security;
alter table public.family_groups enable row level security;
alter table public.family_devices enable row level security;

revoke all on table public.daily_checkins from anon, authenticated;
revoke all on table public.family_groups from anon, authenticated;
revoke all on table public.family_devices from anon, authenticated;

grant select on table public.daily_checkins to authenticated;

drop policy if exists "owner can read own checkins" on public.daily_checkins;
create policy "owner can read own checkins" on public.daily_checkins
  for select to authenticated using ((select auth.uid()) = user_id);

-- family_groups 与 family_devices 只由 Edge Function 的 service role 写入；浏览器不直接读取。

-- V1.5：日常奖励码。设备关联码仍保存于 family_groups；日常奖励码与领取账本完全独立。
create table if not exists public.reward_codes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family_groups(id) on delete cascade,
  code_hash text not null unique,
  code_value text not null,
  reward jsonb not null,
  message text not null default '',
  expires_at timestamptz not null,
  max_uses integer not null default 1 check (max_uses between 1 and 10),
  used_count integer not null default 0 check (used_count >= 0 and used_count <= max_uses),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint reward_codes_code_value_valid check (code_value ~ '^\d{6}$'),
  constraint reward_codes_reward_valid check (
    (reward->>'type' = 'stars' and (reward->>'stars')::integer in (1, 3, 5))
    or (reward->>'type' = 'card' and reward->>'rarity' in ('R', 'SR') and length(coalesce(reward->>'cardId', '')) > 0)
  )
);

create table if not exists public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  reward_code_id uuid not null references public.reward_codes(id) on delete cascade,
  device_user_id uuid not null references auth.users(id) on delete cascade,
  reward jsonb not null,
  claimed_at timestamptz not null default now(),
  constraint reward_claims_code_device_unique unique (reward_code_id, device_user_id)
);

create index if not exists reward_codes_family_created_idx on public.reward_codes (family_id, created_at desc);
create index if not exists reward_codes_active_idx on public.reward_codes (expires_at) where revoked_at is null;
create index if not exists reward_claims_device_claimed_idx on public.reward_claims (device_user_id, claimed_at desc);

alter table public.reward_codes enable row level security;
alter table public.reward_claims enable row level security;
revoke all on table public.reward_codes from anon, authenticated;
revoke all on table public.reward_claims from anon, authenticated;

-- 领取在数据库事务中完成：同一码的并发请求只会生成一条领取记录。
create or replace function public.claim_reward_code(p_code_hash text, p_device_user_id uuid)
returns table (result text, claim_id uuid, reward jsonb, message text, claimed_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.reward_codes%rowtype;
  v_claim public.reward_claims%rowtype;
  v_device_family uuid;
begin
  select family_id into v_device_family from public.family_devices where device_user_id = p_device_user_id;
  if v_device_family is null then
    return query select 'not_linked'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;

  select * into v_code from public.reward_codes where code_hash = p_code_hash for update;
  if not found then
    return query select 'not_found'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;
  if v_code.family_id <> v_device_family then
    return query select 'not_eligible'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;

  select * into v_claim from public.reward_claims
    where reward_code_id = v_code.id and device_user_id = p_device_user_id;
  if found then
    return query select 'already_claimed'::text, v_claim.id, v_claim.reward, v_code.message, v_claim.claimed_at;
    return;
  end if;
  if v_code.revoked_at is not null then
    return query select 'revoked'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;
  if v_code.expires_at <= now() then
    return query select 'expired'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;
  if v_code.used_count >= v_code.max_uses then
    return query select 'used_up'::text, null::uuid, null::jsonb, null::text, null::timestamptz;
    return;
  end if;

  insert into public.reward_claims (reward_code_id, device_user_id, reward)
    values (v_code.id, p_device_user_id, v_code.reward)
    returning * into v_claim;
  update public.reward_codes set used_count = used_count + 1 where id = v_code.id;
  return query select 'claimed'::text, v_claim.id, v_claim.reward, v_code.message, v_claim.claimed_at;
end;
$$;

revoke all on function public.claim_reward_code(text, uuid) from public;

-- V1.6：家长端按日期调整课表。历史打卡仍以 daily_checkins.checks.tasks 快照为准。
create table if not exists public.schedule_overrides (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family_groups(id) on delete cascade,
  schedule_date date not null,
  tasks jsonb not null default '[]'::jsonb,
  version integer not null default 1 check (version >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint schedule_overrides_family_date_unique unique (family_id, schedule_date),
  constraint schedule_overrides_tasks_is_array check (jsonb_typeof(tasks) = 'array'),
  constraint schedule_overrides_task_limit check (jsonb_array_length(tasks) between 0 and 24)
);

create index if not exists schedule_overrides_family_date_idx on public.schedule_overrides (family_id, schedule_date);
alter table public.schedule_overrides enable row level security;
revoke all on table public.schedule_overrides from anon, authenticated;
