(function () {
  const config = window.SUMMER_CLOUD_CONFIG;
  const SDK_URLS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2'
  ];
  let client = null;
  let initPromise = null;

  function isConfigured() {
    return Boolean(config && config.supabaseUrl && config.supabasePublishableKey && config.tableName && config.functionName);
  }

  function loadSdk() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (initPromise) return initPromise;
    initPromise = new Promise((resolve, reject) => {
      let index = 0;
      const tryNext = () => {
        if (index >= SDK_URLS.length) {
          reject(new Error('服务加载失败，请检查网络后重试。'));
          return;
        }
        const script = document.createElement('script');
        script.src = SDK_URLS[index++];
        script.async = true;
        script.onload = () => window.supabase?.createClient ? resolve() : tryNext();
        script.onerror = () => { script.remove(); tryNext(); };
        document.head.appendChild(script);
      };
      tryNext();
    });
    return initPromise;
  }

  async function getClient() {
    if (!isConfigured()) throw new Error('云端配置缺失。');
    if (client) return client;
    await loadSdk();
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return client;
  }

  async function getSession() {
    const api = await getClient();
    const { data, error } = await api.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function ensureAnonymousSession() {
    const api = await getClient();
    const current = await getSession();
    if (current) return current;
    const { data, error } = await api.auth.signInAnonymously();
    if (error) throw error;
    return data.session;
  }

  async function signIn(email, password) {
    const api = await getClient();
    const { data, error } = await api.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }

  async function signOut() {
    const api = await getClient();
    const { error } = await api.auth.signOut();
    if (error) throw error;
  }

  async function sendPasswordRecovery(email, redirectTo) {
    const api = await getClient();
    const { error } = await api.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
  }

  async function updatePassword(password) {
    const api = await getClient();
    const { error } = await api.auth.updateUser({ password });
    if (error) throw error;
  }

  async function invoke(action, payload) {
    const api = await getClient();
    const { data, error } = await api.functions.invoke(config.functionName, { body: { action, ...(payload || {}) } });
    if (error) {
      let message = data?.error || '';
      // Supabase 在非 2xx 时把函数响应放在 error.context 中；读取后优先展示服务端业务错误。
      const response = error.context;
      if (!message && response && typeof response.clone === 'function') {
        try {
          const details = await response.clone().json();
          message = details?.error || details?.message || '';
        } catch (_) {}
      }
      throw new Error(message || error.message || '请求失败。');
    }
    if (data && data.error) throw new Error(data.error);
    return data || {};
  }

  async function redeemCode(code, reward) {
    await ensureAnonymousSession();
    return invoke('redeem', { code, reward });
  }

  async function redeemRewardCode(code) {
    await ensureAnonymousSession();
    return invoke('redeem_reward_code', { code });
  }

  async function syncCheckin(snapshot) {
    await ensureAnonymousSession();
    return invoke('sync', { snapshot });
  }

  async function getDeviceStatus() {
    await ensureAnonymousSession();
    return invoke('device_status');
  }

  async function setRedeemCode(code) {
    return invoke('set_code', { code });
  }

  async function getRedeemCodeStatus() {
    return invoke('get_code_status');
  }

  async function createRewardCode(rewardKind, message, validDays) {
    return invoke('create_reward_code', { rewardKind, message, validDays });
  }

  async function listRewardCodes() {
    return invoke('list_reward_codes');
  }

  async function revokeRewardCode(id) {
    return invoke('revoke_reward_code', { id });
  }

  async function getSchedule(from, to) {
    const session = await getSession();
    if (!session) await ensureAnonymousSession();
    return invoke('get_schedule', { from, to });
  }

  async function saveScheduleOverrides(overrides) {
    return invoke('save_schedule_overrides', { overrides });
  }

  async function removeScheduleOverrides(dates) {
    return invoke('remove_schedule_overrides', { dates });
  }

  async function fetchCheckins(days) {
    const api = await getClient();
    const session = await getSession();
    if (!session || session.user.is_anonymous) throw new Error('请先登录查看账号。');
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - Math.max((days || 7) - 1, 0));
    const startKey = start.toISOString().slice(0, 10);
    const { data, error } = await api.from(config.tableName)
      .select('check_date, checks, done_count, total_count, is_full, last_synced_at')
      .gte('check_date', startKey)
      .order('check_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  window.SummerCloud = Object.freeze({
    isConfigured,
    getSession,
    ensureAnonymousSession,
    signIn,
    signOut,
    sendPasswordRecovery,
    updatePassword,
    redeemCode,
    redeemRewardCode,
    syncCheckin,
    getDeviceStatus,
    setRedeemCode,
    getRedeemCodeStatus,
    createRewardCode,
    listRewardCodes,
    revokeRewardCode,
    getSchedule,
    saveScheduleOverrides,
    removeScheduleOverrides,
    fetchCheckins
  });
})();
