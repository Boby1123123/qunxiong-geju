#!/usr/bin/env node
/* v64 引擎 smoke 仿真 v2：只执行含 W64 引擎的 script + world 片，测核心结算函数。 */
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('game.html', 'utf8');
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
// 找含 W64_WorldState 的 script
let idx = -1;
for (let i = 0; i < scripts.length; i++) {
  if (scripts[i].indexOf('window.W64_WorldState') >= 0) { idx = i; break; }
}
console.log('w64 script idx =', idx);

const sandbox = {
  console, S: {}, N: {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: { getElementById: () => null, addEventListener: () => {}, body: { classList: { toggle: () => {} } } },
  setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
  alert: () => {}, confirm: () => true, prompt: () => null,
  Blob: function () {}, URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
  performance: { now: () => 0 },
  Date, Math, JSON, RegExp, Array, Object, String, Number, Boolean, Promise,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

try {
  vm.runInContext(scripts[idx], sandbox, { timeout: 60000 });
  console.log('script[' + idx + '] executed OK');
} catch (e) {
  console.log('script[' + idx + '] ERR:', String(e && e.message || e).slice(0, 200));
}
// 内容层节点/全局函数在最后一个 script（含 w64_fname）
const last = scripts.length - 1;
if (last !== idx) {
  try {
    vm.runInContext(scripts[last], sandbox, { timeout: 30000 });
    console.log('script[' + last + '] executed OK');
  } catch (e) {
    console.log('script[' + last + '] ERR:', String(e && e.message || e).slice(0, 200));
  }
}
try {
  vm.runInContext(fs.readFileSync('chunks/v62_world.js', 'utf8'), sandbox, { timeout: 10000 });
  console.log('world chunk OK');
} catch (e) {
  console.log('world chunk ERR:', String(e && e.message || e).slice(0, 200));
}

const result = vm.runInContext(`
(function(){
  var out = { err: [] };
  function t(name, fn){ try{ var v = fn(); out[name] = v; }catch(e){ out.err.push(name + ': ' + (e && e.message || e)); } }
  t('factions', function(){ return Object.keys(W64_WorldState.factions).length; });
  t('marketDefs', function(){ return Object.keys(W64_WorldState.marketDef).length; });
  t('disasters', function(){ return W64_WorldState.disasters.length; });
  t('sitSeeds', function(){ return W64_WorldState.situSeeds.length; });
  t('relLevel', function(){ return w64_relLevel(-70) + '/' + w64_relLevel(0) + '/' + w64_relLevel(70); });
  t('ensureDefaults', function(){ w64_ensureDefaults(); return !!(S.worldState && Array.isArray(S.worldGoals) && S.worldFame); });
  t('tickRelations', function(){ w64_tickRelations(7); return Object.keys(S.worldState.relations).length; });
  t('tickMarket', function(){ w64_tickMarket(7); return S.worldState.market && S.worldState.market.grain ? S.worldState.market.grain.price : 'no-market'; });
  t('disRespond', function(){ w64_disRespond('rescue'); return S.worldFame.mercy; });
  t('addGoal', function(){ w64_addGoal('goal_war_sim', '测试', 100); return S.worldGoals.length; });
  t('tickGoals', function(){ w64_tickGoals(99999); return S.worldGoals.length; });
  t('karma', function(){ w64_karma('karma_bandit', 2); w64_tickKarma(3); return Object.keys(S.w64Karma).length; });
  t('battle', function(){ var w = S.worldState; if(!w.wars) w.wars = []; w.wars.push({id:'sim',a:'north',b:'south',front:'边境',phase:1,atkStr:50,defStr:50,moraleA:60,moraleB:60,supplyA:1,supplyB:1,history:[]}); S.w64Side='sim'; return w64_battle(w.wars[0], 50, 50); });
  t('fname', function(){ return w64_fname('north') + '/' + w64_fname('no_such'); });
  return out;
})()`, sandbox);

console.log('--- 测试结果 ---');
console.log(JSON.stringify(result));
if (result.err && result.err.length) { console.log('测试错误:', result.err.join(' | ')); process.exit(1); }
console.log('SMOKE PASS');
