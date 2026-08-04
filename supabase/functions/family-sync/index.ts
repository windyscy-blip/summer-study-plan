import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
const CARD_POOL = {
  R: ['r-apple-glow', 'r-cloud-bubble', 'r-mint-hop', 'r-sea-star', 'r-candy-book', 'r-rain-step', 'r-lemon-note', 'r-peach-dew', 'r-kite-sky', 'r-berry-bell', 'r-shell-sugar', 'r-star-bookmark', 'r-blueberry-spin', 'r-vanilla-breeze'],
  SR: ['sr-rainbow-dash', 'sr-purple-magic', 'sr-moon-berry', 'sr-aurora-glow', 'sr-glass-comet', 'sr-garland-aria', 'sr-sugar-aurora', 'sr-starlight-post']
} as const;
type Reward = { type: 'stars'; stars: 1 | 3 | 5 } | { type: 'card'; rarity: 'R' | 'SR'; cardId: string };

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}
async function hashCode(value: string) {
  const bytes = new TextEncoder().encode(value.trim().toUpperCase());
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map((item) => item.toString(16).padStart(2, '0')).join('');
}
function normalizeCode(value: unknown) { return String(value || '').trim().toUpperCase().replace(/\s+/g, ''); }
function validCode(code: string) { return /^\d{6}$/.test(code); }
function randomCode() { return String(Math.floor(100000 + crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * 900000)); }
function randomItem<T>(items: readonly T[]): T { return items[crypto.getRandomValues(new Uint32Array(1))[0] % items.length]; }
function randomReward(): Reward {
  const roll = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32 * 100;
  if (roll < 60) return { type: 'card', rarity: 'R', cardId: randomItem(CARD_POOL.R) };
  if (roll < 80) return { type: 'card', rarity: 'SR', cardId: randomItem(CARD_POOL.SR) };
  return roll < 95 ? { type: 'stars', stars: 3 } : { type: 'stars', stars: 1 };
}
function makeReward(value: unknown): Reward | null {
  const kind = String(value || 'surprise');
  if (kind === 'stars_1') return { type: 'stars', stars: 1 };
  if (kind === 'stars_3') return { type: 'stars', stars: 3 };
  if (kind === 'stars_5') return { type: 'stars', stars: 5 };
  if (kind === 'card_r') return { type: 'card', rarity: 'R', cardId: randomItem(CARD_POOL.R) };
  if (kind === 'card_sr') return { type: 'card', rarity: 'SR', cardId: randomItem(CARD_POOL.SR) };
  return kind === 'surprise' ? randomReward() : null;
}
function expiryFor(days: unknown) {
  const allowed = [1, 3, 7];
  const safeDays = allowed.includes(Number(days)) ? Number(days) : 1;
  const expires = new Date();
  expires.setHours(23, 59, 59, 999);
  expires.setDate(expires.getDate() + safeDays - 1);
  return expires.toISOString();
}
const PERIODS = ['morning', 'afternoon', 'evening'] as const;
const SUBJECTS = ['cn', 'en', 'ma', 'other'] as const;
type ScheduleTask = { id: string; name: string; detail: string; period: typeof PERIODS[number]; subject: typeof SUBJECTS[number] };
function validScheduleDate(value: unknown) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || ''));
}
function normalizeScheduleTasks(value: unknown): ScheduleTask[] | null {
  if (!Array.isArray(value) || value.length > 24) return null;
  const ids = new Set<string>();
  const tasks: ScheduleTask[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return null;
    const item = raw as Record<string, unknown>;
    const id = String(item.id || '').trim();
    const name = String(item.name || '').trim();
    const detail = String(item.detail || '').trim();
    const period = String(item.period || '');
    const subject = String(item.subject || 'other');
    if (!/^[a-zA-Z0-9_-]{2,64}$/.test(id) || !name || name.length > 40 || detail.length > 120 || !PERIODS.includes(period as typeof PERIODS[number]) || !SUBJECTS.includes(subject as typeof SUBJECTS[number]) || ids.has(id)) return null;
    ids.add(id);
    tasks.push({ id, name, detail, period: period as ScheduleTask['period'], subject: subject as ScheduleTask['subject'] });
  }
  return tasks;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return reply({ error: '只支持 POST 请求。' }, 405);
  const authHeader = request.headers.get('Authorization') || '';
  const url = Deno.env.get('SUPABASE_URL') || '';
  const publishableKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  const userClient = createClient(url, publishableKey, { global: { headers: { Authorization: authHeader } } });
  const admin = createClient(url, serviceRoleKey);
  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) return reply({ error: '登录状态无效。' }, 401);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return reply({ error: '请求格式错误。' }, 400); }
  const action = body.action;
  const userId = authData.user.id;
  const isParent = !authData.user.is_anonymous;

  if (action === 'set_code') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const code = normalizeCode(body.code);
    if (!validCode(code)) return reply({ error: '兑换码需为 6 位数字。' }, 400);
    const codeHash = await hashCode(code);
    const { data: oldFamily } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    const query = oldFamily
      ? admin.from('family_groups').update({ code_hash: codeHash, code_value: code, updated_at: new Date().toISOString() }).eq('id', oldFamily.id)
      : admin.from('family_groups').insert({ owner_id: userId, code_hash: codeHash, code_value: code });
    const { error } = await query;
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, code });
  }
  if (action === 'get_code_status') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const { data, error } = await admin.from('family_groups').select('code_value, updated_at').eq('owner_id', userId).maybeSingle();
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, configured: Boolean(data), code: data?.code_value || null, updatedAt: data?.updated_at || null });
  }

  if (action === 'create_reward_code') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const { data: family, error: familyError } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    if (familyError || !family) return reply({ error: '请先设置设备兑换码。' }, 400);
    const reward = makeReward(body.rewardKind);
    if (!reward) return reply({ error: '奖励类型无效。' }, 400);
    const message = String(body.message || '').trim().slice(0, 50);
    const expiresAt = expiryFor(body.validDays);
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = randomCode();
      const { error } = await admin.from('reward_codes').insert({ family_id: family.id, code_hash: await hashCode(code), code_value: code, reward, message, expires_at: expiresAt });
      if (!error) return reply({ ok: true, code, reward, message, expiresAt });
      if (error.code !== '23505') return reply({ error: error.message }, 400);
    }
    return reply({ error: '兑换码生成繁忙，请再试一次。' }, 503);
  }
  if (action === 'list_reward_codes') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const { data: family } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    if (!family) return reply({ ok: true, codes: [] });
    const { data, error } = await admin.from('reward_codes').select('id, code_value, reward, message, expires_at, max_uses, used_count, revoked_at, created_at, reward_claims(id, claimed_at)').eq('family_id', family.id).order('created_at', { ascending: false }).limit(30);
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, codes: data || [] });
  }
  if (action === 'revoke_reward_code') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const id = String(body.id || '');
    const { data: family } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    if (!family || !id) return reply({ error: '奖励码不存在。' }, 400);
    const { error } = await admin.from('reward_codes').update({ revoked_at: new Date().toISOString() }).eq('id', id).eq('family_id', family.id).eq('used_count', 0);
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true });
  }
  if (action === 'redeem_reward_code') {
    const code = normalizeCode(body.code);
    if (!validCode(code)) return reply({ error: '兑换码是 6 位数字。' }, 400);
    const { data, error } = await admin.rpc('claim_reward_code', { p_code_hash: await hashCode(code), p_device_user_id: userId }).maybeSingle();
    if (error || !data) return reply({ error: error?.message || '领取失败，请再试一次。' }, 400);
    const result = String(data.result);
    const messages: Record<string, string> = { not_linked: '请先使用设备兑换码领取第一份惊喜。', not_found: '兑换码不正确，请再试一次。', not_eligible: '这份奖励不是给这台设备的。', revoked: '这份奖励暂时无法领取。', expired: '这份惊喜已经过期啦。', used_up: '这份奖励已经领完啦。' };
    if (messages[result]) return reply({ error: messages[result] }, 400);
    return reply({ ok: true, alreadyClaimed: result === 'already_claimed', claimId: data.claim_id, reward: data.reward, message: data.message || '', claimedAt: data.claimed_at });
  }

  if (action === 'get_schedule') {
    const { data: device } = await admin.from('family_devices').select('family_id').eq('device_user_id', userId).maybeSingle();
    const familyId = isParent
      ? (await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle()).data?.id
      : device?.family_id;
    if (!familyId) return reply({ error: isParent ? '请先设置设备兑换码。' : '请先使用设备兑换码领取第一份惊喜。' }, 403);
    const from = validScheduleDate(body.from) ? String(body.from) : new Date().toISOString().slice(0, 10);
    const to = validScheduleDate(body.to) ? String(body.to) : from;
    const { data, error } = await admin.from('schedule_overrides').select('schedule_date, tasks, version, updated_at').eq('family_id', familyId).gte('schedule_date', from).lte('schedule_date', to).order('schedule_date');
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, overrides: data || [] });
  }
  if (action === 'save_schedule_overrides') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const { data: family } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    if (!family) return reply({ error: '请先设置设备兑换码。' }, 400);
    const items = Array.isArray(body.overrides) ? body.overrides : [];
    if (!items.length || items.length > 31) return reply({ error: '请选择 1 至 31 个日期。' }, 400);
    const rows = [];
    for (const raw of items) {
      const item = raw as Record<string, unknown>;
      const scheduleDate = String(item?.scheduleDate || '');
      const tasks = normalizeScheduleTasks(item?.tasks);
      if (!validScheduleDate(scheduleDate) || !tasks) return reply({ error: '课表内容格式不正确。' }, 400);
      rows.push({ family_id: family.id, schedule_date: scheduleDate, tasks, updated_at: new Date().toISOString() });
    }
    if (new Set(rows.map((row) => row.schedule_date)).size !== rows.length) return reply({ error: '日期不能重复。' }, 400);
    const { error } = await admin.from('schedule_overrides').upsert(rows, { onConflict: 'family_id,schedule_date' });
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, savedDates: rows.map((row) => row.schedule_date) });
  }
  if (action === 'remove_schedule_overrides') {
    if (!isParent) return reply({ error: '请先登录家长账号。' }, 403);
    const { data: family } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    const dates = Array.isArray(body.dates) ? body.dates.map((item) => String(item)) : [];
    if (!family || !dates.length || dates.length > 31 || dates.some((item) => !validScheduleDate(item))) return reply({ error: '日期格式不正确。' }, 400);
    const { error } = await admin.from('schedule_overrides').delete().eq('family_id', family.id).in('schedule_date', dates);
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true });
  }

  if (action === 'redeem') {
    const code = normalizeCode(body.code);
    if (!validCode(code)) return reply({ error: '兑换码是 6 位数字。' }, 400);
    const codeHash = await hashCode(code);
    const { data: family, error: familyError } = await admin.from('family_groups').select('id').eq('code_hash', codeHash).maybeSingle();
    if (familyError || !family) return reply({ error: '兑换码不正确，请再试一次。' }, 400);
    const { data: existing } = await admin.from('family_devices').select('family_id, reward').eq('device_user_id', userId).maybeSingle();
    if (existing?.reward) return reply({ ok: true, familyId: existing.family_id, reward: existing.reward });
    const candidate = body.reward as Record<string, unknown> | undefined;
    const type = candidate?.type;
    const isCard = type === 'card' && ['R', 'SR', 'SSR'].includes(String(candidate.rarity)) && typeof candidate.cardId === 'string';
    const isStars = type === 'stars' && [1, 3].includes(Number(candidate.stars));
    if (!isCard && !isStars) return reply({ error: '奖励数据格式错误。' }, 400);
    const reward = isCard ? { type: 'card', rarity: String(candidate.rarity), cardId: String(candidate.cardId) } : { type: 'stars', stars: Number(candidate.stars) };
    const { error: linkError } = await admin.from('family_devices').upsert({ family_id: family.id, device_user_id: userId, reward, linked_at: new Date().toISOString() }, { onConflict: 'device_user_id' });
    if (linkError) return reply({ error: linkError.message }, 400);
    return reply({ ok: true, familyId: family.id, reward });
  }
  if (action === 'device_status') {
    const { data, error } = await admin.from('family_devices').select('reward').eq('device_user_id', userId).maybeSingle();
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, redeemed: Boolean(data), reward: data?.reward || null });
  }
  if (action === 'sync') {
    const snapshot = body.snapshot as Record<string, unknown> | undefined;
    if (!snapshot || !/^\d{4}-\d{2}-\d{2}$/.test(String(snapshot.checkDate || ''))) return reply({ error: '打卡数据格式错误。' }, 400);
    const { data: device, error: deviceError } = await admin.from('family_devices').select('family_id, family_groups(owner_id)').eq('device_user_id', userId).maybeSingle();
    const ownerId = (device?.family_groups as { owner_id?: string } | null)?.owner_id;
    if (deviceError || !ownerId) return reply({ error: '请先兑换奖励。' }, 403);
    const row = { user_id: ownerId, check_date: String(snapshot.checkDate), checks: snapshot.checks || {}, done_count: Number(snapshot.doneCount || 0), total_count: Number(snapshot.totalCount || 0), is_full: Boolean(snapshot.isFull), last_synced_at: new Date().toISOString() };
    const { error } = await admin.from('daily_checkins').upsert(row, { onConflict: 'user_id,check_date' });
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true });
  }
  return reply({ error: '未知操作。' }, 400);
});
