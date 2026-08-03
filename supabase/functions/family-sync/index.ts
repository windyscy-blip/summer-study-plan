import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function reply(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function hashCode(value: string) {
  const normalized = value.trim().toUpperCase();
  const bytes = new TextEncoder().encode(normalized);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash)).map((item) => item.toString(16).padStart(2, '0')).join('');
}

function normalizeCode(value: unknown) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
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
  try {
    body = await request.json();
  } catch {
    return reply({ error: '请求格式错误。' }, 400);
  }

  const action = body.action;
  const userId = authData.user.id;

  if (action === 'set_code') {
    if (authData.user.is_anonymous) return reply({ error: '请先登录家长账号。' }, 403);
    const code = normalizeCode(body.code);
    if (!/^\d{6}$/.test(code)) return reply({ error: '兑换码需为 6 位数字。' }, 400);
    const codeHash = await hashCode(code);
    const { data: oldFamily } = await admin.from('family_groups').select('id').eq('owner_id', userId).maybeSingle();
    const query = oldFamily
      ? admin.from('family_groups').update({ code_hash: codeHash, updated_at: new Date().toISOString() }).eq('id', oldFamily.id)
      : admin.from('family_groups').insert({ owner_id: userId, code_hash: codeHash });
    const { error } = await query;
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, code });
  }

  if (action === 'get_code_status') {
    if (authData.user.is_anonymous) return reply({ error: '请先登录家长账号。' }, 403);
    const { data, error } = await admin.from('family_groups').select('updated_at').eq('owner_id', userId).maybeSingle();
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true, configured: Boolean(data), updatedAt: data?.updated_at || null });
  }

  if (action === 'redeem') {
    const code = normalizeCode(body.code);
    if (!/^\d{6}$/.test(code)) return reply({ error: '兑换码是 6 位数字。' }, 400);
    const codeHash = await hashCode(code);
    const { data: family, error: familyError } = await admin.from('family_groups').select('id, owner_id').eq('code_hash', codeHash).maybeSingle();
    if (familyError || !family) return reply({ error: '兑换码不正确，请再试一次。' }, 400);

    const { data: existing } = await admin.from('family_devices').select('reward').eq('device_user_id', userId).maybeSingle();
    if (existing?.reward) return reply({ ok: true, familyId: family.id, reward: existing.reward });

    const candidate = body.reward as Record<string, unknown> | undefined;
    const type = candidate?.type;
    const isCard = type === 'card' && ['R', 'SR', 'SSR'].includes(String(candidate.rarity)) && typeof candidate.cardId === 'string';
    const isStars = type === 'stars' && [1, 3].includes(Number(candidate.stars));
    if (!isCard && !isStars) return reply({ error: '奖励数据格式错误。' }, 400);
    const reward = isCard
      ? { type: 'card', rarity: String(candidate.rarity), cardId: String(candidate.cardId) }
      : { type: 'stars', stars: Number(candidate.stars) };
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
    if (!snapshot || !/^\d{4}-\d{2}-\d{2}$/.test(String(snapshot.checkDate || ''))) {
      return reply({ error: '打卡数据格式错误。' }, 400);
    }
    const { data: device, error: deviceError } = await admin
      .from('family_devices')
      .select('family_id, family_groups(owner_id)')
      .eq('device_user_id', userId)
      .maybeSingle();
    const ownerId = (device?.family_groups as { owner_id?: string } | null)?.owner_id;
    if (deviceError || !ownerId) return reply({ error: '请先兑换奖励。' }, 403);

    const row = {
      user_id: ownerId,
      check_date: String(snapshot.checkDate),
      checks: snapshot.checks || {},
      done_count: Number(snapshot.doneCount || 0),
      total_count: Number(snapshot.totalCount || 0),
      is_full: Boolean(snapshot.isFull),
      last_synced_at: new Date().toISOString()
    };
    const { error } = await admin.from('daily_checkins').upsert(row, { onConflict: 'user_id,check_date' });
    if (error) return reply({ error: error.message }, 400);
    return reply({ ok: true });
  }

  return reply({ error: '未知操作。' }, 400);
});
