const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const schema = fs.readFileSync(path.join(root, 'supabase-schema.sql'), 'utf8');
const edge = fs.readFileSync(path.join(root, 'supabase/functions/family-sync/index.ts'), 'utf8');
const cloud = fs.readFileSync(path.join(root, 'cloud-sync.js'), 'utf8');
const childPage = fs.readFileSync(path.join(root, '每日打卡.html'), 'utf8');
const parentPage = fs.readFileSync(path.join(root, '家长查看.html'), 'utf8');

function test(name, fn) {
  try { fn(); console.log(`PASS ${name}`); }
  catch (error) { console.error(`FAIL ${name}\n${error.stack}`); process.exitCode = 1; }
}

test('数据库包含日常奖励码和领取账本', () => {
  assert.match(schema, /create table if not exists public\.reward_codes/i);
  assert.match(schema, /create table if not exists public\.reward_claims/i);
  assert.match(schema, /reward_claims_code_device_unique unique \(reward_code_id, device_user_id\)/i);
  assert.match(schema, /create or replace function public\.claim_reward_code/i);
  assert.match(schema, /for update/i);
});

test('数据库奖励类型约束不允许 SSR 日常奖励', () => {
  assert.match(schema, /reward->>'rarity' in \('R', 'SR'\)/);
  assert.doesNotMatch(schema, /reward_codes_reward_valid[\s\S]*'SSR'/);
});

test('云函数在服务端固化日常奖励并支持幂等领取', () => {
  assert.match(edge, /if \(action === 'create_reward_code'\)/);
  assert.match(edge, /if \(action === 'redeem_reward_code'\)/);
  assert.match(edge, /claim_reward_code/);
  assert.match(edge, /alreadyClaimed: result === 'already_claimed'/);
  assert.match(edge, /const CARD_POOL/);
  assert.doesNotMatch(edge, /redeem_reward_code[\s\S]{0,500}body\.reward/);
});

test('前端云端接口覆盖创建、查询、撤销、领取', () => {
  for (const method of ['redeemRewardCode', 'createRewardCode', 'listRewardCodes', 'revokeRewardCode']) assert.match(cloud, new RegExp(`async function ${method}`));
  assert.match(cloud, /redeem_reward_code/);
  assert.match(cloud, /create_reward_code/);
});

test('小朋友端奖励账本按 claimId 去重并兼容 v4', () => {
  assert.match(childPage, /summer_reward_center_v5/);
  assert.match(childPage, /const PREVIOUS_REWARD_KEY = 'summer_reward_center_v4'/);
  assert.match(childPage, /redeemClaims: \{\}/);
  assert.match(childPage, /hasRedeemClaim\(claimId\)/);
  assert.match(childPage, /legacy-link-reward/);
  assert.doesNotMatch(childPage, /rewardState\.redeemReward/);
});

test('家长端可发放、查看和撤销日常奖励', () => {
  for (const id of ['rewardKind', 'rewardDays', 'rewardMessage', 'rewardList']) assert.match(parentPage, new RegExp(`id="${id}"`));
  for (const fn of ['createRewardCode', 'loadRewardCodes', 'revokeRewardCode']) assert.match(parentPage, new RegExp(`async function ${fn}`));
});

if (!process.exitCode) console.log('V1.5 日常奖励码静态单元测试全部通过。');
