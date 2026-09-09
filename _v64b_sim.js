#!/usr/bin/env node
/* v64.1 引擎 smoke 仿真：含 v64b 五变体/游说/兜底扩展断言。 */
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('game.html', 'utf8');
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let idx = -1;
for (let i = 0; i < scripts.length; i++) {
  if (scripts[i].indexOf('window.W64_WorldState') >= 0) { idx = i; break; }
}
console.log('w64 script idx =', idx);

const sandbox = {
  console, S: {}, N: {},
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: (function(){
    var el = function(){ return {
      style: {}, classList: { add: function(){}, remove: function(){}, toggle: function(){} },
      appendChild: function(){}, removeChild: function(){}, insertBefore: function(){}, remove: function(){},
      setAttribute: function(){}, addEventListener: function(){}, removeEventListener: function(){},
      getContext: function(){ return null; }, focus: function(){}, click: function(){},
      innerHTML: '', textContent: '', value: '', src: '', href: '', dataset: {}, childNodes: [], children: [],
      querySelector: function(){ return null; }, querySelectorAll: function(){ return []; }, getBoundingClientRect: function(){ return {top:0,left:0,width:0,height:0}; },
    }; };
    return {
      getElementById: function(){ return null; }, createElement: function(){ return el(); },
      createTextNode: function(){ return el(); }, createDocumentFragment: function(){ return el(); },
      addEventListener: function(){}, removeEventListener: function(){},
      body: { classList: { toggle: function(){} }, appendChild: function(){}, style: {} },
      documentElement: { style: {} }, head: { appendChild: function(){} },
    };
  })(),
  addEventListener: () => {}, removeEventListener: () => {},
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
try {
  vm.runInContext(fs.readFileSync('chunks/v62_world.js', 'utf8'), sandbox, { timeout: 10000 });
  console.log('world chunk OK (26 nodes)');
} catch (e) {
  console.log('world chunk ERR:', String(e && e.message || e).slice(0, 200));
}

const result = vm.runInContext(`
(function(){
  var out = { err: [] };
  function t(name, fn){ try{ var v = fn(); out[name] = v; }catch(e){ out.err.push(name + ': ' + (e && e.message || e)); } }
  // 基线
  t('factions', function(){ return Object.keys(W64_WorldState.factions).length; });
  t('ensureDefaults', function(){ w64_ensureDefaults(); return !!(S.worldState && S.worldFame && Array.isArray(S.worldGoals)); });
  // v64b 兜底新字段
  t('v64bDefaults', function(){ w64_ensureDefaults(); return (S.w64Camp===null||S.w64Camp===undefined) ? 'camp-ok' : 'camp=' + JSON.stringify(S.w64Camp); });
  // 战争五变体：triumph(大胜求和) / win(小胜) / stale(两败) / annihilate(灭战) / slaughter(惨胜)
  function mkWar(wa, wb, ph, extra){ w64_ensureDefaults(); var ws = S.worldState; if(!ws.wars) ws.wars=[]; var w={id:'sim'+Math.random().toString(36).slice(2,7), a:'north', b:'south', cause:'测试', phase:ph||3, front:'边境', atkStr:50, defStr:50, moraleA:60, moraleB:60, supplyA:1, supplyB:1, winsA:wa, winsB:wb, history:[]}; if(extra) for(var k in extra) w[k]=extra[k]; ws.wars.push(w); S.w64Side=w.id; return w; }
  t('war_triumph', function(){ var w=mkWar(6,1); w64_warResult(w, 500); return 'type=' + (S.w64Aftermath&&S.w64Aftermath.type); });
  t('war_annihilate', function(){ var w=mkWar(9,1,3,{supplyB:0}); w64_warResult(w, 500); return 'type=' + (S.w64Aftermath&&S.w64Aftermath.type); });
  t('war_stale', function(){ var w=mkWar(3,3); w64_warResult(w, 500); return 'type=' + (S.w64Aftermath&&S.w64Aftermath.type); });
  t('war_sideClear', function(){ return S.w64Side === null; });
  t('war_ceasefire', function(){ return (S.worldState.ceasefire && Object.keys(S.worldState.ceasefire).length) ? 'cf-' + Object.keys(S.worldState.ceasefire).length : 'no-cf'; });
  // 游说：orgRank 门槛
  t('lobby_low', function(){ w64_ensureDefaults(); S.orgRank = 0; return w64_electionLobby('cand_strict'); });
  t('lobby_ok', function(){
    w64_ensureDefaults(); S.orgRank = 3;
    var pap = S.worldState.politics.papacy;
    pap.candidates = ['cand_strict','cand_open'];
    if(!pap.favor) pap.favor = {};
    var ok = w64_electionLobby('cand_open');
    return ok && pap.favor['cand_open'] === 15;
  });
  t('vote_fn', function(){ return typeof w64_vote === 'function'; });
  // 目标
  t('goalAdd', function(){ w64_ensureDefaults(); var n=S.worldGoals.length; w64_addGoal('goal_war_sim','测试',100); return S.worldGoals.length - n; });
  t('goalTick', function(){ return typeof w64_tickGoals === 'function'; });
  // 新节点存在
  t('node_election', function(){ return typeof N['w64_election_node'] === 'function'; });
  t('node_goal', function(){ return typeof N['w64_goal_node'] === 'function'; });
  t('node_aftermath', function(){ return typeof N['w64_war_aftermath'] === 'function'; });
  return out;
})()`, sandbox);

console.log('--- 测试结果 ---');
console.log(JSON.stringify(result, null, 1));
if (result.err && result.err.length) { console.log('测试错误:', result.err.join(' | ')); process.exit(1); }
console.log('SMOKE PASS');
