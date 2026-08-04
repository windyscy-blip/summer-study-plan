-- V1.6：家长端按日期调整课表。历史打卡继续以 daily_checkins.checks.tasks 快照为准。
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
