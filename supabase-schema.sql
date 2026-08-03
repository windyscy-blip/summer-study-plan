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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
