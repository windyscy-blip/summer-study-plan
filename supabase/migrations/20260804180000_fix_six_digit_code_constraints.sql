-- 修复 V1.5 已执行迁移中的六位数字正则。
-- 使用 [0-9] 避免 PostgreSQL 与 SQL 字符串转义差异。
-- 本迁移尚未部署；仅在用户确认发布 V1.6 后，随正式迁移执行。

alter table public.family_groups
  drop constraint if exists family_groups_code_value_valid;
alter table public.family_groups
  add constraint family_groups_code_value_valid
  check (code_value is null or code_value ~ '^[0-9]{6}$');

alter table public.reward_codes
  drop constraint if exists reward_codes_code_value_valid;
alter table public.reward_codes
  add constraint reward_codes_code_value_valid
  check (code_value ~ '^[0-9]{6}$');
