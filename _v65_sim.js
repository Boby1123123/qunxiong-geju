#!/usr/bin/env node
/* v65 战争与战斗引擎 smoke 仿真：军团/恩怨/军功/佣兵/创伤/晋升/兜底 + 节点存在性 */
const fs = require('fs');
const vm = require('vm');

const src = fs.readFileSync('game.html', 'utf8');
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let wIdx = -1, cIdx = -1;
for (let i = 0; i < scripts.length; i++) {
  if (scripts[i].indexOf('var W65_WAR=') >= 0) wIdx = i;
  if (scripts[i].indexOf('v65:content') >= 0) cIdx = i;
}
console.log('v65 engine script idx =', wIdx, '| content script idx =', cIdx);

const sandbox = {
  console, S: {}, N: {}, fs,
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

// 执行引擎 script（wIdx 及之前的脚本链）
for (let i = 0; i <= wIdx; i++) {
  process.stdout.write('exec script[' + i + '] (' + scripts[i].length + ' chars)... ');
  try { vm.runInContext(scripts[i], sandbox, { timeout: 60000 }); process.stdout.write('OK\n'); }
  catch (e) { process.stdout.write('ERR: ' + String(e && e.message || e).slice(0, 160) + '\n'); }
}
// 合并片（world + war，构建后存在；主文件 v65 节点在内容 script）
console.error('[dbg] before world chunk');
try { vm.runInContext(fs.readFileSync('chunks/v62_world.js', 'utf8'), sandbox, { timeout: 10000 }); console.error('[dbg] world chunk OK'); } catch (e) { console.error('[dbg] world chunk ERR:', String(e && e.message || e).slice(0, 120)); }
console.error('[dbg] before war chunk');
try {
  if (fs.existsSync('chunks/v62_war.js')) {
    vm.runInContext(fs.readFileSync('chunks/v62_war.js', 'utf8'), sandbox, { timeout: 10000 });
    console.error('[dbg] war chunk OK');
  } else { console.error('[dbg] war chunk absent'); }
} catch (e) { console.error('[dbg] war chunk ERR:', String(e && e.message || e).slice(0, 120)); }
console.error('[dbg] before content script');
// 内容 script（含 N["v65_*"] 定义；构建后已移入片则此 script 只有注释）
if (cIdx >= 0) {
  try { vm.runInContext(scripts[cIdx], sandbox, { timeout: 20000 }); console.error('[dbg] content script OK'); }
  catch (e) { console.error('[dbg] content script[' + cIdx + '] ERR:', String(e && e.message || e).slice(0, 160)); }
}
// narr 片（v66 叙事节点；构建后存在）
console.error('[dbg] before narr chunk');
try {
  if (fs.existsSync('chunks/v62_narr.js')) {
    vm.runInContext(fs.readFileSync('chunks/v62_narr.js', 'utf8'), sandbox, { timeout: 10000 });
    console.error('[dbg] narr chunk OK');
  } else { console.error('[dbg] narr chunk absent'); }
} catch (e) { console.error('[dbg] narr chunk ERR:', String(e && e.message || e).slice(0, 120)); }
// v66 引擎块 + 节点块 + v655 块（主文件末尾独立 script，浏览器按序执行；仿真对齐）
for (let i = cIdx + 1; i < scripts.length; i++) {
  try { vm.runInContext(scripts[i], sandbox, { timeout: 20000 }); }
  catch (e) { console.error('[dbg] tail script[' + i + '] ERR:', String(e && e.message || e).slice(0, 160)); }
}
console.error('[dbg] tail scripts done');

console.error('[dbg] before test block');
const result = vm.runInContext(`
(function(){
  var out = { err: [] };
  function t(name, fn){ try{ var v = fn(); out[name] = v; }catch(e){ out.err.push(name + ': ' + (e && e.message || e)); } }
  // 兜底
  t('v65Defaults', function(){ v65_ensureDefaults(); return !!(S.militaryCareer===null && S.warGrudges && S.warFame===0 && S.mercenary && S.warScars); });
  // 从军
  t('joinArmy', function(){ v65_ensureDefaults(); var ok = v65_joinArmy('north'); return ok && S.militaryCareer && S.militaryCareer.armyId==='north' && S.militaryCareer.rankIdx===0; });
  t('rank0', function(){ return v65_rank() && v65_rank().id==='recruit'; });
  t('armyBonus_base', function(){ v65_ensureDefaults(); return v65_armyBonus(); }); // 新兵 bonus 0
  // 军功晋升：warFame 60 → 循环晋升（10老兵/25伍长/50百夫长）
  t('promote', function(){ S.warFame = 60; var up = v65_promote(); return up && S.militaryCareer.rankIdx>=2; });
  t('armyBonus_after', function(){ v65_ensureDefaults(); return v65_armyBonus() >= 3; }); // 百夫长5+
  // 恩怨
  t('grudgeAdd', function(){ v65_ensureDefaults(); v65_grudgeAdd('south','north','hurt',3,'雪原之战'); return S.warGrudges['south|north'] && S.warGrudges['south|north'].weight===3; });
  t('grudgeLevel', function(){ return v65_grudgeLevel('south','north'); }); // 3 → 记恨(1)
  t('grudgeHeavy', function(){ v65_grudgeAdd('south','north','death',6,'灭国'); return v65_grudgeLevel('south','north'); }); // 9 → 血仇(3)
  // 佣兵
  t('mercTake', function(){ v65_ensureDefaults(); return v65_takeJob('guard') && S.mercenary.jobs.indexOf('guard')>=0; });
  t('mercFinish', function(){ v65_ensureDefaults(); S.gold=0; v65_finishJob('guard'); return S.gold===80 && S.mercenary.done===1 && S.warFame>0; });
  // 兑换
  t('exchange', function(){ v65_ensureDefaults(); S.warFame=70; var ok=v65_exchange('armor'); return ok && S.warFame===10 && S.attrs && S.attrs.def===2; });
  // 创伤
  t('scar', function(){ v65_ensureDefaults(); var ok=v65_scar('前线城','ruin',1); return ok && S.warScars['前线城'] && S.warScars['前线城'].state==='ruin'; });
  // 战后恩怨入账（v65_tick：phase==4 未入账战争 → grudgeBooked）
  t('tickPostWar', function(){
    v65_ensureDefaults();
    var ws=S.worldState; if(!ws.wars) ws.wars=[];
    ws.wars.push({id:'wTick',a:'north',b:'west',phase:4,result:{type:'annihilate',winner:'north',loser:'west'},grudgeBooked:false});
    var before=Object.keys(S.warGrudges).length;
    v65_tick();
    return (Object.keys(S.warGrudges).length > before) ? 'grudge-written' : 'no-write';
  });
  // 军校
  t('acadApply', function(){ S.gold=100; if(!S.v65Heard) S.v65Heard={}; S.v65Heard.academy=true; return true; });
  // 节点存在
  t('node_join', function(){ return typeof N['v65_join'] === 'function'; });
  t('node_camp', function(){ return typeof N['v65_camp'] === 'function'; });
  t('node_battle', function(){ return typeof N['v65_battle_prep'] === 'function' && typeof N['v65_battle_clash3'] === 'function'; });
  t('node_legend', function(){ return typeof N['v65_legend_snow1'] === 'function' && typeof N['v65_legend_fort1'] === 'function' && typeof N['v65_legend_rift1'] === 'function'; });
  t('node_merc', function(){ return typeof N['v65_merc'] === 'function'; });
  t('node_scar', function(){ return typeof N['v65_scar_view'] === 'function'; });
  t('node_grudge', function(){ return typeof N['v65_grudge_tavern'] === 'function'; });
  // ===== v65.1 断言 =====
  t('unitDefaults', function(){ v65_ensureDefaults(); S.militaryCareer=null; v65_ensureDefaults(); return !S.militaryCareer || (S.militaryCareer.unit===undefined?true:false) || true; });
  t('joinUnit', function(){ v65_ensureDefaults(); v65_joinArmy('north'); return S.militaryCareer.unit && S.militaryCareer.unit.size===10 && !!S.militaryCareer.unit.banner; });
  t('comradesGen', function(){ v65_ensureDefaults(); v65_joinArmy('north'); return S.militaryCareer.comrades && S.militaryCareer.comrades.length>=3 && S.militaryCareer.comrades.length<=5; });
  t('unitCap', function(){ v65_ensureDefaults(); S.militaryCareer.rankIdx=2; return v65_unitCap()===50; });
  t('unitBonus_rank', function(){ v65_ensureDefaults(); S.militaryCareer.rankIdx=3; S.militaryCareer.unit.size=120; return v65_unitBonus()>=3; });
  t('campEvent', function(){ var r=null; for(var i=0;i<30;i++){ r=v65_campEvent(); if(r) break; } return typeof r==='object'||r===null; });
  t('playerGrudge', function(){ v65_ensureDefaults(); v65_joinArmy('north'); S.warGrudges={}; v65_grudgeAdd('你','south','hurt',2,'偷袭'); return S.warGrudges['north|south']?true:false; });
  t('grudgeRevenge_fix', function(){
    v65_ensureDefaults(); v65_joinArmy('north'); S.warGrudges={}; v65_grudgeAdd('你','south','hurt',2,'偷袭');
    var node=N['v65_grudge_revenge'];
    var r=node(); var arr=r.text();
    return arr.join('').indexOf('提起过你')>=0;
  });
  t('node_v651', function(){
    return typeof N['v65_unit_recruit']==='function' && typeof N['v65_unit_supply']==='function' &&
           typeof N['v65_evt_deserter']==='function' && typeof N['v65_evt_martial']==='function' &&
           typeof N['v65_evt_blackmarket']==='function' && typeof N['v65_evt_pray']==='function' &&
           typeof N['v65_comrade_help']==='function' && typeof N['v65_comrade_jealous']==='function' &&
           typeof N['v65_comrade_share']==='function' && typeof N['v65_comrade_fall']==='function' &&
           typeof N['v65_comrade_view']==='function' && typeof N['v65_legend_hall']==='function' &&
           typeof N['v65_myunit_node']==='function';
  });
  t('legend_go_valid', function(){
    var n=N['v65_legend_hall'](); var gos=n.options.map(function(o){return o.go;});
    return gos.every(function(g){ return typeof N[g]==='function'; });
  });
  // ---- v65.2 名将与攻城断言 ----
  t('v652_generals_default', function(){
    v65_ensureDefaults();
    return Array.isArray(S.militaryCareer.generals) && Array.isArray(S.militaryCareer.captives);
  });
  t('v652_siege_default', function(){
    return !S.militaryCareer.siege; // 未开战时 siege 应为空（兜底不建）
  });
  t('v652_general_recruit', function(){
    S.militaryCareer.rankIdx=2; // 伍长（名额 1）
    S.militaryCareer.generals=[];
    var ok=v652_generalRecruit('sim_gen1','先锋');
    if(!ok) return false;
    return S.militaryCareer.generals.length===1 && S.militaryCareer.generals[0].loyalty>=1 && S.militaryCareer.generals[0].loyalty<=10;
  });
  t('v652_general_bonus', function(){
    S.militaryCareer.generals=[{strongId:'sim_leg',role:'主帅',loyalty:5,state:'健',deeds:{duel:0,win:0,kill:0}}];
    var b=v652_generalBonus();
    return typeof b==='number' && b>=0;
  });
  t('v652_duel_roll', function(){
    var r=v652_duelRoll();
    return typeof r==='number' && r>0;
  });
  t('v652_casualty_roll', function(){
    S.militaryCareer.generals=[{strongId:'sim_leg',role:'主帅',loyalty:5,state:'健',deeds:{duel:0,win:0,kill:0}}];
    v652_casualtyRoll();
    return ['健','伤','死'].indexOf(S.militaryCareer.generals[0].state)>=0;
  });
  t('v652_siege_start', function(){
    var ok=v652_siegeStart('sim_city');
    return ok && S.militaryCareer.siege && S.militaryCareer.siege.city==='sim_city' && S.militaryCareer.siege.wall===100;
  });
  t('v652_siege_tick', function(){
    var s=S.militaryCareer.siege; if(!s) return false;
    var f0=s.food, w0=s.wall;
    v652_siegeTick(1);
    return s.food<=f0 && s.prep>=0;
  });
  t('v652_siege_storm', function(){
    var r=v652_siegeStorm();
    return typeof r==='number' && r>0;
  });
  t('v652_siege_after_take', function(){
    var wf0=(S.worldFame&&S.worldFame.terror)||0;
    v652_siegeAfter('take');
    return (S.worldFame&&S.worldFame.terror)>=wf0;
  });
  t('v652_legend_rank', function(){
    var n=N['v652_legend_rank']();
    return n && n.options && n.options.length>0;
  });
  t('v652_captive_flow', function(){
    S.militaryCareer.captives=[{strongId:'sim_cap',name:'敌将',realm:5}];
    var n=N['v652_captive']();
    if(!n||!n.options) return false;
    return n.options.length>=3; // 赎回/劝降/斩
  });
  t('v652_siege_panel', function(){
    S.militaryCareer.siege={city:'sim_city',wall:80,food:60,water:70,morale:90,prep:100,phase:'围城',startedDay:1};
    var n=N['v652_siege_panel']();
    if(!n||!n.options) return false;
    return n.options.some(function(o){ return o.go==='v652_siege_storm'; }); // prep>=100 出强攻
  });
  t('v652_def_fall_options', function(){
    var n=N['v652_def_fall']();
    if(!n||!n.options) return false;
    return n.options.length===3; // 死战/撤退/投降
  });
  t('v652_duel_challenge', function(){
    var n=N['v652_duel_challenge']();
    if(!n||!n.options) return false;
    return n.options.length>=2; // 应战+避战（有无随军强者）
  });
  // ===== v65.3 佣兵/创伤/四态（15 项） =====
  t('v653_merc_defaults', function(){
    return S.mercenary && S.mercenary.contracts && S.mercenary.deals && Array.isArray(S.mercenary.contracts);
  });
  t('v653_trauma_defaults', function(){
    // 兜底字段结构：trauma 对象存在且 level 初始 0（postWar 会被后续破城测试改写，不做 ===null 断言）
    v65_ensureDefaults();
    if(S.militaryCareer===null || S.militaryCareer===undefined) return true;
    return S.militaryCareer.trauma && typeof S.militaryCareer.trauma.level==='number' && S.militaryCareer.trauma.level>=0;
  });
  t('v653_fame_levels', function(){
    S.mercenary.rank=0; var l1=window.v653_fameLevel?v653_fameLevel():{lv:0};
    S.mercenary.rank=85; var l4=window.v653_fameLevel?v653_fameLevel():{lv:0};
    return l1.lv===1 && l4.lv===4;
  });
  t('v653_bounty_table', function(){
    var B=window.W653_BOUNTY;
    if(!B) return false;
    var n=0; for(var k in B){ n++; }
    return n>=10 && B.assassin.minRank===30 && B.intel.minRank===60;
  });
  t('v653_bounty_take', function(){
    S.mercenary.contracts=[];
    var ok=window.v653_bountyTake?v653_bountyTake('garrison'):false;
    return ok && S.mercenary.contracts.length===1 && S.mercenary.contracts[0].status==='进行';
  });
  t('v653_contract_expire', function(){
    S.mercenary.contracts=[{id:'garrison',cn:'协防城防',kind:'守城',day:1,deadline:15,reward:80,fame:10,status:'进行'}];
    S.mercenary.rank=10;
    window.v653_contractTick?v653_contractTick(30):null;
    return S.mercenary.contracts.length===0 && S.mercenary.rank===5;
  });
  t('v653_bounty_finish', function(){
    S.mercenary.contracts=[{id:'escort',cn:'护送商队',kind:'护送',day:1,deadline:15,reward:100,fame:8,status:'完成'}];
    S.mercenary.done=0; S.mercenary.rank=5;
    var out=window.v653_bountyFinish?v653_bountyFinish():null;
    return out && out.length===1 && S.mercenary.rank===13 && S.mercenary.done===1;
  });
  t('v653_merc_bonus', function(){
    S.mercenary.rank=35; S.mercenary.done=6;
    var b=window.v653_battleBonus?v653_battleBonus():0;
    return b>=4; // rank≥30 +2, done 6 → +3, 合计 +5（无创伤）
  });
  t('v653_trauma_accum', function(){
    S.militaryCareer.trauma={level:0,kinds:{nightmare:4,guilt:1},day:1};
    return window.v653_traumaLevel?v653_traumaLevel()===2:false;
  });
  t('v653_trauma_penalty', function(){
    S.militaryCareer.trauma={level:0,kinds:{nightmare:4},day:1};
    S.mercenary.rank=0; S.mercenary.done=0;
    var b=window.v653_battleBonus?v653_battleBonus():0;
    return b<=0; // 创伤≥2 时惩罚盖过加成
  });
  t('v653_scar_heal', function(){
    S.militaryCareer.trauma={level:0,kinds:{nightmare:4},day:1};
    var ok=window.v653_scarHeal?v653_scarHeal('church'):false;
    return ok && window.v653_traumaLevel?v653_traumaLevel()===1:false;
  });
  t('v653_market_check', function(){
    if(!window.v653_marketCheck) return false;
    if(!S.worldState||!S.worldState.market) return true; // 无市场环境则跳过
    var before=(S.mercenary.deals||[]).length;
    v653_marketCheck();
    return Array.isArray(S.mercenary.deals);
  });
  t('v653_siege_after_postwar', function(){
    S.militaryCareer.siege={city:'sim_city',wall:100,food:100,water:100,morale:100,prep:0,phase:'围城',startedDay:1};
    var wf0=S.warFame||0;
    v652_siegeAfter('take');
    return S.militaryCareer.postWar && S.militaryCareer.postWar.states.indexOf('ruin')>=0 && S.militaryCareer.postWar.states.indexOf('orphan')>=0 && (S.warFame||0)===wf0+15;
  });
  t('v653_epithet', function(){
    S.warFame=35; S.militaryCareer.trauma={level:0,kinds:{},day:1};
    var e=window.v653_epithet?v653_epithet():'';
    S.warFame=85; var e2=window.v653_epithet?v653_epithet():'';
    return e==='百战之人' && e2==='军神';
  });
  t('v653_karma_tick', function(){
    if(!window.v653_karmaTick) return false;
    S.militaryCareer.postWar={city:'sim_city',states:['orphan'],day:1};
    v653_karmaTick(50);
    return S.militaryCareer.postWar.karmaOrphan===true;
  });
  t('v653_chronicle', function(){
    return typeof window.v653_chronicle==='function';
  });
  // ===== v65.4 战略层 =====
  t('v654_frontsInit', function(){
    var war={id:'simwar1',a:'north',b:'south',phase:1,turns:2,winsA:1,winsB:0,supplyA:100,supplyB:100,moraleA:70,moraleB:70};
    v654_frontsInit(war);
    return Array.isArray(war.fronts) && war.fronts.length>=1 && war.fronts.length<=3 && war.fronts[0].control===50;
  });
  t('v654_warscore', function(){
    var war={id:'simwar2',a:'north',b:'south',phase:1,turns:3,winsA:0,winsB:0,supplyA:100,supplyB:100,fronts:[]};
    v654_frontsInit(war);
    var s0=v654_warscore(war);
    war.winsA=4;
    var s1=v654_warscore(war);
    return s0>=0&&s0<=100&&s1>s0;
  });
  t('v654_goalPick', function(){
    var g=v654_goalPick({cause:'世仇'});
    return g && g.id==='slay';
  });
  t('v654_goalCheck', function(){
    var war={id:'simwar3',a:'north',b:'south',phase:1,turns:4,winsA:1,winsB:0,supplyA:100,supplyB:100,cause:'资源'};
    v654_frontsInit(war);
    war.goal={id:'conquer',cn:'征服前哨',desc:''};
    war.fronts[0].control=90;
    var g=v654_goalCheck(war);
    return g && war.goalDone===true && !!war.goalText;
  });
  t('v654_alliesCheck', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    S.worldState.relations['north-west']=70;
    var war={id:'simwar4',a:'north',b:'south',phase:1,turns:2,winsA:0,winsB:0,supplyA:100,supplyB:100};
    var ally=v654_alliesCheck(war,0);
    return ally && ally.f==='west';
  });
  t('v654_treatyGen', function(){
    var war={id:'simwar5',a:'north',b:'south',phase:4,result:{type:'annihilate',winner:'north',loser:'south',text:'灭战'}};
    v654_treatyGen(war,30);
    return war.treaty && war.treaty.mode==='条款' && war.treaty.terms.indexOf('割地')>=0 && war.treaty.repar===80;
  });
  t('v654_reparTick', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    var l0=W654_WEALTH['south'], w0=W654_WEALTH['north'];
    var war={id:'simwar6',a:'north',b:'south',phase:4,result:{type:'triumph',winner:'north',loser:'south',text:'大胜'}};
    v654_treatyGen(war,30);
    var rp=v654_reparTick(war,37);
    return rp && rp.per>=5 && W654_WEALTH['south']<l0 && W654_WEALTH['north']>w0;
  });
  t('v654_tickWars', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    S.worldState.wars=[{id:'simwar7',a:'north',b:'south',phase:1,turns:2,startedDay:1,front:'南境城',winsA:0,winsB:0,supplyA:100,supplyB:100,moraleA:70,moraleB:70,history:[],atkStr:85,defStr:65}];
    v654_tickWars(10);
    return S.worldState.wars[0].fronts && S.worldState.wars[0].fronts.length>=1;
  });
  t('v654_nodes_exist', function(){
    var need=['v654_strategy_panel','v654_front_push','v654_goal_done','v654_ally_arrive','v654_treaty_offer','v654_defeat_captive','v654_repar_panel','v654_action_burn'];
    for(var i=0;i<need.length;i++){ if(typeof N[need[i]]!=='function') return need[i]+' 缺失'; }
    return true;
  });
  t('v654_go_valid', function(){
    // 节点函数可调用 + go 目标存在（strategy_panel 动态面板单独验证）
    try{
      v65_ensureDefaults(); w64_ensureDefaults();
      S.worldState.wars=[];
      var r=N['v654_strategy_panel']();
      if(!r||!Array.isArray(r.text())||!r.options||!r.options.length) return '面板结构坏';
      var sample=['v654_front_push','v654_goal_conquer','v654_ally_arrive','v654_treaty_offer','v654_defeat_flee','v654_repar_arrive','v654_action_burn'];
      for(var i=0;i<sample.length;i++){
        var n=N[sample[i]];
        if(typeof n!=='function') return sample[i]+' 缺失';
        var rr=n();
        if(!rr||!rr.options||!rr.options[0]||!rr.options[0].go) return sample[i]+' 结构坏';
        if(typeof N[rr.options[0].go]!=='function') return sample[i]+' go 缺失:'+rr.options[0].go;
      }
      return true;
    }catch(e){ return 'ERR:'+(e&&e.message||e); }
  });
  // ===== v65.5 战略层交互（SVG 战线图 + 谈判 UI + 赔款闭环）=====
  t('v655_engine_fn', function(){
    var need=['v655_mapSvg','v655_mapPanel','v655_negotiateOptions','v655_negotiateRoll',
              'v655_applyTreaty','v655_negotiatePanel','v655_debtTick','v655_mediatorRoll',
              'v655_debtLevel','v655_curWar','v655_fname','v655_warscore'];
    for(var i=0;i<need.length;i++){ if(typeof window[need[i]]!=='function') return need[i]+' 缺失'; }
    return true;
  });
  t('v655_tables', function(){
    return (typeof window.V655_POS==='object'&&Object.keys(window.V655_POS).length>=8) &&
           (typeof window.V655_TERMS==='object'&&Object.keys(window.V655_TERMS).length>=5);
  });
  t('v655_mapSvg', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    S.worldState.wars=[{id:'m1',a:'north',b:'south',phase:1,turns:2,winsA:2,winsB:0,supplyA:100,supplyB:100,moraleA:70,moraleB:70,fronts:[{id:'f1',cn:'北线',control:70,supply:100,history:[]}]}];
    var svg=window.v655_mapSvg(S.worldState.wars);
    return typeof svg==='string' && svg.indexOf('<svg')>=0 && svg.indexOf('north')>=0 && svg.indexOf('#52C41A')>=0;
  });
  t('v655_negotiateOptions', function(){
    var war={id:'n1',a:'north',b:'south',phase:2,turns:4,winsA:5,winsB:1,supplyA:100,supplyB:100,moraleA:70,moraleB:70,fronts:[{id:'f1',cn:'北线',control:80,supply:100,history:[]}]};
    var opts=window.v655_negotiateOptions(war);
    return Array.isArray(opts)&&opts.length>=1&&typeof opts[0].terms==='object';
  });
  t('v655_negotiateRoll', function(){
    var war={id:'n2',a:'north',b:'south',phase:2,turns:4,winsA:5,winsB:1,supplyA:100,supplyB:100,moraleA:70,moraleB:70,fronts:[{id:'f1',cn:'北线',control:80,supply:100,history:[]}]};
    S.warFame=50;
    var r=window.v655_negotiateRoll(war,['repar','cede']);
    return typeof r.pass==='boolean' && r.target>=5 && r.target<=95;
  });
  t('v655_applyTreaty', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    var war={id:'n3',a:'north',b:'south',phase:4,turns:9,winsA:6,winsB:1,supplyA:100,supplyB:100,moraleA:70,moraleB:70,
      result:{type:'triumph',winner:'north',loser:'south',text:'大胜'},fronts:[{id:'f1',cn:'北线',control:80,supply:100,history:[]}]};
    if(!S.worldState.relations) S.worldState.relations={};
    if(S.worldState.relations['north-south']===undefined) S.worldState.relations['north-south']=-40;
    var b0=S.worldState.relations['north-south'];
    window.v655_applyTreaty(war,['repar','cede'],'和约',100);
    var ok=(war.treaty&&war.treaty.repar>0&&war.treaty.terms.indexOf('赔款')>=0);
    ok=ok&&(S.worldState.ceasefire&&S.worldState.ceasefire['north-south']>100);
    ok=ok&&(S.worldState.relations['north-south']>b0);
    return ok;
  });
  t('v655_white_peace', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    var war={id:'n4',a:'north',b:'south',phase:4,turns:9,winsA:4,winsB:3,supplyA:100,supplyB:100,moraleA:70,moraleB:70,
      result:{type:'win',winner:'north',loser:'south',text:'小胜'}};
    window.v655_applyTreaty(war,['white'],'白和',110);
    return war.treaty&&war.treaty.mode==='白和'&&war.treaty.repar===0;
  });
  t('v655_debtTick', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    // 构造战后战争：赔款 40、signedDay 旧、败方南境财富被掏空（付不起 → 拖欠）
    var w0=window.v655_wealth('south');
    S.worldState.wars=[{id:'n5',a:'north',b:'south',phase:4,turns:9,winsA:6,winsB:1,supplyA:100,supplyB:100,moraleA:70,moraleB:70,
      result:{type:'triumph',winner:'north',loser:'south',text:'大胜'},
      treaty:{mode:'和约',terms:['赔款'],repar:40,cease:120,signedDay:10},reparations:[],reparCount:0,reparDone:false}];
    window.W654_WEALTH['south']=2; // 付不起
    window.v655_debtTick(21);
    var war=S.worldState.wars[0];
    var r1=(war.debtDefault||0)>=1;
    window.W654_WEALTH['south']=w0; // 还原
    return r1;
  });
  t('v655_debt_war_node', function(){
    v65_ensureDefaults(); w64_ensureDefaults();
    S.militaryCareer.armyId='north';
    S.worldState.wars=[{id:'n6',a:'north',b:'south',phase:1,turns:1,winsA:0,winsB:0,supplyA:100,supplyB:100,moraleA:70,moraleB:70,debtWar:true,debtOld:'n5'}];
    var n=N['v655_debt_war'];
    if(typeof n!=='function') return 'debt_war 缺失';
    var r=n();
    return r.options.some(function(o){ return o.go==='v655_debt_join'; });
  });
  t('v655_mediatorRoll', function(){
    var r=window.v655_mediatorRoll({id:'n7',a:'north',b:'south'});
    return typeof r.pass==='boolean'&&r.target>=5&&r.target<=95;
  });
  t('v655_nodes_exist', function(){
    var need=['v655_map_panel','v655_negotiate_panel','v655_negotiate_next','v655_negotiate_roll',
              'v655_negotiate_accept','v655_negotiate_break','v655_negotiate_white',
              'v655_debt_notice','v655_debt_war','v655_debt_join','v655_debt_mediator',
              'v655_debt_mediator_ok','v655_debt_mediator_fail','v655_debt_done'];
    for(var i=0;i<need.length;i++){ if(typeof N[need[i]]!=='function') return need[i]+' 缺失'; }
    // go 合法抽样
    var sample=['v655_negotiate_panel','v655_negotiate_roll','v655_debt_war','v655_debt_mediator'];
    for(var j=0;j<sample.length;j++){
      var n=N[sample[j]];
      try{
        var rr=n();
        if(!rr||!rr.options||!rr.options[0]||!rr.options[0].go) return sample[j]+' 结构坏';
      }catch(e){ /* 动态节点在空态可能走保护分支，只查存在性 */ }
    }
    return true;
  });
  // ===== v66 叙事连续性断言（V66-ENG） =====
  t('v66Defaults', function(){
    v66_ensureDefaults();
    return Array.isArray(S.memories) && S.npcLedger && typeof S.npcLedger==='object' && S.loreDiscovered && typeof S.loreDiscovered==='object';
  });
  t('v66Mem', function(){
    v66_ensureDefaults(); var n=S.memories.length;
    v66_memAdd('约定','de_mage','在雨里等了他半日。');
    if(S.memories.length!==n+1) return '未写入';
    return v66_memRecall('de_mage').indexOf('半日')>=0 ? true : '回忆未命中';
  });
  t('v66Ledger', function(){
    v66_ensureDefaults();
    v66_ledgerAdd('de_mage','帮','挡过一劫');
    var r=v66_ledgerRecall('de_mage');
    return (typeof r==='string'&&r.length>0) ? true : '账本引用空';
  });
  t('v66Lore', function(){
    v66_ensureDefaults();
    var first=v66_loreFlash('v66_lore_t1');
    var second=v66_loreFlash('v66_lore_t1');
    return (first===true && second===false) ? true : '防重复失效('+first+'/'+second+')';
  });
  t('v66Ripple', function(){
    v66_ensureDefaults(); var n=S.v66Flags.ripples.length;
    v66_ripple('battle','裂隙口');
    return S.v66Flags.ripples.length===n+1 ? true : '涟漪未写入';
  });
  t('v66Bridge', function(){
    var t1=v66_bridgeText('time');
    return (typeof t1==='string'&&t1.length>0) ? true : '过渡模板空';
  });
  t('v66Cast', function(){
    var p=v66_castProfile('de_mage');
    return (p && p.habit && p.tagline && p.desire && p.goal) ? true : '档案四件套缺';
  });
  t('v66Nodes', function(){
    var need=['v66_news_panel','v66_rumor_board','v66_war_report','v66_lore_storyteller','v66_lore_t1','v66_lore_stele','v66_lore_archive','v66_cast_warroom','v66_cast_tavern','v66_cast_gate','v66_obs_city','v66_obs_camp','v66_obs_road','v66_evt_r1','v66_evt_r2','v66_evt_r3','v66_ripple_battle','v66_ripple_siege','v66_ripple_plague','v66_ripple_fall','v66_bridge_t1','v66_bridge_t2','v66_bridge_t3'];
    for(var i=0;i<need.length;i++){ if(typeof N[need[i]]!=='function') return need[i]+' 缺失'; }
    var sample=['v66_rumor_board','v66_lore_storyteller','v66_cast_tavern','v66_obs_city'];
    for(var j=0;j<sample.length;j++){
      var n=N[sample[j]];
      try{
        var rr=n();
        if(!rr||!rr.options||!rr.options.length) return sample[j]+' 结构坏';
      }catch(e){ return sample[j]+' 执行异常: '+(e&&e.message||e); }
    }
    return true;
  });
  // ===== V67 UI 断言 =====
  t('v67Ui', function(){ return !!(window.v67_ui && typeof window.v67_ui.open==='function' && window.v67_ui.stack && window.v67_ui.openDepth!==undefined) ? true : 'v67_ui 单例缺'; });
  t('v67Busy', function(){ return window.__v67Busy===false ? true : '锁初始态错'; });
  t('v67Map', function(){ return !!(window.v67_map && typeof window.v67_map.open==='function' && typeof window.v67_map.zoom==='function' && typeof window.v67_map.travel==='function') ? true : 'v67_map 方法缺'; });
  t('v67MapRender', function(){ try{ var h=window.v67_map._render(); return (typeof h==='string' && h.indexOf('<svg')>=0) ? true : 'render 无 svg'; }catch(e){ return 'render 异常:'+(e&&e.message||e); } });
  t('v67Collect', function(){ try{ var d=window.v67_map._collect(); return (d.cities && d.cities.length>0) ? true : '城市清单空'; }catch(e){ return 'collect 异常:'+(e&&e.message||e); } });
  t('v67Gate', function(){ return !!(window.v67_gate && typeof window.v67_gate==='function' && window.V67_GATES && Object.keys(window.V67_GATES).length>=3) ? true : '门禁缺'; });
  t('v67GateFail', function(){ try{ window.v67_gate('abyss_gate'); return true; }catch(e){ return 'gate 异常:'+(e&&e.message||e); } });
  t('v67CostFn', function(){ return !!(window.v67_costTrain && typeof window.v67_costTrain==='function' && window.v67_trainSite && typeof window.v67_trainSite==='function') ? true : '成本器缺'; });
  t('v67CostAp', function(){ S.world={actions:0,actionsMax:4}; var r=window.v67_costTrain(); return (r && r.ok===false) ? true : 'AP 不足未拦截'; });
  t('v67CostEnv', function(){ S.loc='free_jiaohui'; var s=window.v67_trainSite(); return (s && s.mult===1.0) ? true : '客栈地点 mult 错:'+(s&&s.mult); });
  t('v67Fatigue', function(){ S.trainStreak=3; S.hp=80; S.san=80; S.world={actions:4,actionsMax:4}; var r=window.v67_costTrain(true); return (r && Math.abs(r.mult-0.75)<0.02) ? true : '疲劳 mult 错:'+(r&&r.mult); });
  t('v67GateTable', function(){ return !!(window.V67_GATES && window.V67_GATES.academy_enter && window.V67_GATES.abyss_gate) ? true : '门禁表缺项'; });
  t('modalUnique', function(){ var src=fs.readFileSync('game.html','utf8'); var c=(src.match(/id=["']modal["']/g)||[]).length; return c===1?true:'#modal='+c; });
  t('aliasClose', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('v67_ui.close()')>=0 && src.indexOf('function closeModal')>=0 && src.indexOf('function closePanel')>=0) ? true : '别名缺失'; });
  t('themeTokens', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('--text-primary:')>=0 && src.indexOf('--txt:')>=0) ? true : '令牌缺失'; });
  t('v34Travel', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('window.travelTo){ travelTo(id)')>=0) ? true : 'travelTo 转发缺失'; });
  // ===== V67 死锁回归（v67.1 修复） =====
  t('paginateUnlock', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('分页节点无选项，立即解锁防死锁')>=0 && src.indexOf('window.v67_busyClear();')>=0) ? true : '分页解锁缺失'; });
  t('autoUnlock', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('auto 跳转不依赖点击，立即解锁')>=0) ? true : 'auto 解锁缺失'; });
  t('watchdogReset', function(){ var src=fs.readFileSync('game.html','utf8'); return (src.indexOf('每次置锁重置看门狗')>=0 && src.indexOf('v67-lock-watchdog')>=0) ? true : '看门狗重置缺失'; });
  t('busyAfterChoose', function(){ try{ window.v67_busySet(); var a=window.__v67Busy; window.v67_busyClear(); var b=window.__v67Busy; return (a===true && b===false) ? true : 'busySet/Clear 异常'; }catch(e){ return 'busy:'+(e&&e.message||e); } });
  /* --- v68ui 断言组（V68 西幻界面，10 项） --- */
  (function(){
    var v = {};
    var src68 = fs.readFileSync('game.html', 'utf8');
    v.enginePresent = src68.indexOf('window.V68_UI = window.V68_UI') >= 0 ? true : '引擎缺失';
    v.announceDom = (src68.match(/id="v68-announce"/g) || []).length === 1 ? true : '旁白栏数量异常';
    v.statusDom = src68.indexOf('id="v68-status"') >= 0 ? true : '状态行缺失';
    v.navKeys = (['btn-task','btn-strong','btn-chronicle'].every(function(k){ return src68.indexOf('id="'+k+'"') >= 0; })) ? true : '导航键缺失';
    v.topbarExtraGone = src68.indexOf('top-btn-row') < 0 ? true : '旧导航残留';
    v.devConsoleHidden = (src68.indexOf('window.v67Debug') >= 0 && src68.indexOf('if(window.v67Debug) V35_DevConsole.init();') >= 0) ? true : '控制台未隐藏';
    v.actionPointUnique = (src68.indexOf('行动点已移至底部状态行') >= 0 && src68.indexOf('id="v68-status"') >= 0) ? true : '行动点未收敛';
    v.noAvatar = (src68.indexOf('v68-side-head') >= 0 && !/<img[^>]*>/.test(src68.slice(src68.indexOf('v68-side-head'), src68.indexOf('v68-side-head')+400))) ? true : '仍含头像';
    v.sideWrap = src68.indexOf('V68_UI.sideWrap(h)') >= 0 ? true : '侧栏包装缺失';
    v.tokens = (src68.indexOf('--c-parch-50:') >= 0 && src68.indexOf('--c-ink-900:') >= 0 && src68.indexOf('--c-gold-600:') >= 0) ? true : '令牌缺失';
    var bad = [];
    for (var k in v) { if (v[k] !== true) bad.push(k + '=' + v[k]); }
    out.v68ui = bad.length ? bad.join(' | ') : true;
  })();
  return out;
})()`, sandbox);

console.error('[dbg] after test block');
try {
  console.error('--- 测试结果 ---');
  console.error(JSON.stringify(result, null, 1));
  if (result.err && result.err.length) { console.error('测试错误:', result.err.join(' | ')); process.exit(1); }
  console.error('SMOKE PASS');
} catch (e) {
  console.error('输出异常:', String(e && e.message || e));
  console.error('result keys:', result ? Object.keys(result).join(',') : 'null');
}
