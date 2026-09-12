
/* ============ v2 捏人：emptyState / 存档兼容 ============ */
let S = null; window.S = S; /* /v60inj:winx2:S/ */
const emptyState = () => ({
  v:2, ruleset:RULESET_ID,
  name:"无名旅者", gender:"男", homeland:"free",
  race:"human", subrace:"nordic", background:null,
  job:null, talent:"mortal", hobby:null, ideal:null,
  attrs:{SPR:25,STR:25,AGI:25,INT:25,CHA:25,CON:25},
  realm:0, xp:0,
  gold:100, silver:60, hp:100, san:0, maxSan:0,
  rep:0, karma:0, aura:10,
  infl:{free:10,north:0,south:0,church:0,elf:0,dwarf:0,orc:0,east:0,abyss:0},
  fatigue:0, travelFatigue:0, wound:0, disease:false, job2:null,
  day:1, date:"4037年 · 春一月 · 一日",
  loc:"free_jiaohui", region:"free",
  visited:{}, flags:{}, items:[], mats:{}, books:{}, skills:{},
  conds:{mat:false,kno:false,pra:false,rit:false,anc:false,work:false},
  choices:[], dice:[],
  world:{purge:false,silver:false,seal:false,academy:false,orc:false},
  lw:{season:"春",dayPhase:"晨",echoes:[],echoLog:[],npcStates:{},factionRel:{},factionState:{},cityControl:{},worldFlags:{},journal:[],tick:0},
  ending:null, dead:false, ngPlus:1,
  runHistory:[], endingsCollected:[], _endingRecorded:false
});
function applyDefaults(s){
  if(s.gender===undefined||s.gender===null) s.gender="男";
  if(!s.homeland) s.homeland="free";
  if(!s.race) s.race="human";
  if(!s.subrace) s.subrace="nordic";
  if(!s.background) s.background=null;
  if(s.sub!==undefined && s.sub!==null){ delete s.sub; }
  if(!s.talent) s.talent="mortal";
  if(!s.hobby) s.hobby=null;
  if(!s.ideal) s.ideal=null;
  if(!s.maxSan) s.maxSan=Math.round(((s.attrs&&s.attrs.SPR)||40)*1.5);
  if(s.san===undefined||s.san===null) s.san=s.maxSan;
  /* v76 P2-2 多周目兜底（旧档兼容） */
  if(!s.ngPlus) s.ngPlus=1;
  if(!s.runHistory) s.runHistory=[];
  if(!s.endingsCollected) s.endingsCollected=[];
  if(!s._endingRecorded) s._endingRecorded=false;
  /* /p12inj:defaults/ P1-2 好感支线进度兜底（旧档兼容） */
  if(!s.p12Quest) s.p12Quest={a:0,b:0,c:0};
  /* /t11inj:defaults/ I1-1 分段阅读开关兜底（旧档兼容） */
  if(!s.settings) s.settings={};
    if(!s.trade) s.trade={goods:{},logs:[],total:0}; /* /g1inj:def/ */
    if(!s.gallery) s.gallery={}; /* /g2inj:def/ */
  if(s.settings.ambience===undefined) s.settings.ambience=true;
  if(s.settings.nameHighlight===undefined) s.settings.nameHighlight=true;
  if(s.settings.pagedReading===undefined) s.settings.pagedReading=true;
  if(s.settings.globalHooks===undefined) s.settings.globalHooks=true;
  if(!s.hooksState) s.hooksState={};
  if(!s.chronicle) s.chronicle=[];
    if(s.gradPath===undefined) s.gradPath="";
  /* /v91inj:defaults/ CM-1 记忆注入开关兜底（旧档兼容） */
  if(s.settings.memoryInjection===undefined) s.settings.memoryInjection=true;
    if(!s.settings.npcWeave) s.settings.npcWeave=true; /* W-N3 NPC 状态回指（默认开，旧档兜底） */
  /* /v92inj:defaults/ TQ-1 天气句开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.weatherLine===undefined) s.settings.weatherLine=true;
  /* /e2inj:defaults/ E-2 多年回响开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.echoLine===undefined) s.settings.echoLine=true;
  /* /s1inj:defaults/ S-1 人格声音开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.voiceLine===undefined) s.settings.voiceLine=true;
  /* /t1inj:defaults/ T-1 心念殿状态兜底（旧档兼容；独立键空对象） */
  if(!s.thoughts) s.thoughts={};
  s.trust=0;
  /* /f3inj:defaults/ F-3 蒙羞指数兜底（旧档兼容；独立键默认 0；由 f_failpath_* flag 驱动展示，引擎零结算） */
  if(s.failRep===undefined) s.failRep=0;
  /* /A1inj:defaults/ A-1 个性化开局注入开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.originProfile===undefined) s.settings.originProfile=true;
  /* /upg01inj:defaults/ UPG-01 世界书开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.lorebook===undefined) s.settings.lorebook=true;
  /* /upg02inj:defaults/ UPG-02 记忆库开关兜底（旧档兼容；独立键默认 true） */
  if(s.settings.memoryBank===undefined) s.settings.memoryBank=true;
  /* /sp3inj:defaults/ SP-3 弧线进度兜底（旧档兼容；新档为空对象） */
  if(!s.arcs) s.arcs={};
  /* /m8inj:defaults/ M8 卷D战争/阵营状态兜底（旧档兼容；独立键） */
  if(s.worldWar===undefined) s.worldWar=0;
  if(s.anchors===undefined) s.anchors=0;
  if(!s.faction || typeof s.faction==="string"){var __oldF=(typeof s.faction==="string"&&s.faction)?((window.V35_FID_MAP&&V35_FID_MAP[s.faction])||s.faction):null;s.faction={joined:__oldF,rank:0,reputation:{},quests:[],completedQuests:[],territoryOwned:[],politicalCapital:0,wars:[],alliances:[],enemies:[]};if(__oldF&&window.V35_FACTIONS&&V35_FACTIONS[__oldF]&&window.V35_FACTION_STATE){V35_FACTION_STATE.joined=__oldF;V35_FACTION_STATE.rank=0;}}
  /* /pn1inj:defaults/ P-N1 并行叙事线程状态兜底（旧档兼容；独立键空对象） */
  if(!s.threads) s.threads={};
  /* /ws1inj:defaults/ WS-1 世界状态回路兜底（旧档兼容；独立键/独立开关） */
  if(s.settings.worldEcho===undefined) s.settings.worldEcho=true;
  if(!s.worldState) s.worldState={};
  /* /n1inj:defaults/ N-1 立场系统兜底（旧档兼容；独立键空对象） */
  if(!s.stance) s.stance={};
  /* /n5inj:defaults/ N-5 五维关系兜底（旧档兼容；独立键空对象） */
  if(!s.rel5) s.rel5={};
  /* /n7inj:defaults/ N-7 天赋连锁兜底（旧档兼容；独立键空对象） */
  if(!s.comboFlags) s.comboFlags={};
  /* /n8inj:defaults/ N-8 情绪连续性兜底（旧档兼容；独立键空对象） */
  if(!s.mood) s.mood={trauma:0,relief:0,obsession:0};
  /* /g1inj:defaults/ G-1 伤口系统兜底（旧档兼容；独立键空数组） */
  if(!s.wounds) s.wounds=[];
  /* /g2inj:defaults/ G-2 技能熟练度兜底（旧档兼容；独立键空对象） */
  if(!s.skillProg) s.skillProg={};
  /* /g4inj:defaults/ G-4 渐进教学开关兜底（旧档兼容；默认开） */
  if(s.settings.progressiveTips===undefined) s.settings.progressiveTips=true;
  /* /v93mkt:defaults/ EC-3 经济闭环独立键（旧档兼容） */
  if(!s.market) s.market={lastDiv:0,divTotal:0};
  /* /v93news:defaults/ WD-4 世界日报独立键（旧档兼容） */
  if(!s.news) s.news={list:[],count:0,done:{}};
  /* /v93npc:defaults/ NM-6 NPC 记忆独立键（旧档兼容） */
  if(!s.npcMemory) s.npcMemory={};
  if(s.settings.npcMemory===undefined) s.settings.npcMemory=true;
  /* /v93fest:defaults/ FT-7 节日独立键（旧档兼容） */
  if(!s.festival) s.festival={done:{}};
  /* /lw1inj:defaults/ LW 活的世界模拟层兜底（旧档兼容；独立键 s.lw） */
  if(!s.lw) s.lw={};
  if(!s.lw.season) s.lw.season="春";
  if(!s.lw.dayPhase) s.lw.dayPhase="晨";
  if(!s.lw.echoes) s.lw.echoes=[];
  if(!s.lw.echoLog) s.lw.echoLog=[];
  if(!s.lw.npcStates) s.lw.npcStates={};
  if(!s.lw.factionRel) s.lw.factionRel={};
  if(!s.lw.factionState) s.lw.factionState={};
  if(!s.lw.cityControl) s.lw.cityControl={};
  if(!s.lw.worldFlags) s.lw.worldFlags={};
  if(!s.lw.journal) s.lw.journal=[];
  if(!s.lw.tick) s.lw.tick=0;
  return s;
}
function loadGame(){
  try{
    const slotId = S && S.slotId ? S.slotId : "slot1";
    const d = StorageKit.load(slotId);
    if(d){ doFinishLoad(d); return; }
    if(window.StorageKit && StorageKit.loadIDB){
      StorageKit.loadIDB(slotId, function(d1){
        if(!d1){ flashMsg("没有找到存档"); return; }
        doFinishLoad(d1);
      });
      return;
    }
    flashMsg("没有找到存档");
  }catch(e){ flashMsg("读档失败："+e.message); }
}
function doFinishLoad(d){
  try{ if(typeof v61_clearAll === 'function') v61_clearAll(); }catch(e){} /* /v61inj:perf-clear-load/ */
  if(d.ruleset!==RULESET_ID){ flashMsg("存档版本不匹配"); return; }
  S = applyDefaults(d);
  /* /v91inj:memreset/ CM-1 读档后重置记忆基准（避免误注入"初到"句） */
  try{ if(window.__v91memState) window.__v91memState={loc:(S&&S.loc)||null,day:(S&&S.day)||0,echoed:{},flagSeen:{},placeSeen:{},started:true}; }catch(e){}
  if(!S.readings) S.readings={unlocked:{},read:{}};
  try{ v46_ensureDefaults(); }catch(e){}
  if(window.v55_ensureDefaults){ try{ v55_ensureDefaults(); }catch(e){} }
  if(window.v56_ensureDefaults){ try{ v56_ensureDefaults(); }catch(e){} }
  if(window.v57_ensureDefaults){ try{ v57_ensureDefaults(); }catch(e){} }
  if(window.w64_ensureDefaults){ try{ w64_ensureDefaults(); }catch(e){} } /*v64inj:hooks*/
  if(window.v55_learnAll){ try{ v55_learnAll(); }catch(e){} }
  S.saveVersion = S.saveVersion || 48;
  logMsg("已读档（第"+S.day+"日）","g");
  flashMsg("已读档");
  if(S.ending){ showEnding(S.ending); return; }
  curNode = S.curNode || "fc_jiaohui_entry";
  renderTop(); renderStats(); writeNext();
}
function flashMsg(m){
  try{
    let f=$("flash");
    if(!f){ f=document.createElement("div"); f.id="flash"; document.body.appendChild(f); }
    f.textContent=m; f.classList.add("show");
    clearTimeout(f._t); f._t=setTimeout(()=>f.classList.remove("show"),2200);
  }catch(e){}
}


/* ============ 工具函数 ============ */
const $ = id => document.getElementById(id);
const rnd = n => Math.floor(Math.random()*n); window.rnd = rnd; /* /v60inj:winx2:rnd/ */
const choice = arr => arr[rnd(arr.length)]; window.choice = choice; /* /v60inj:winx2:choice/ */
function money(n){return Math.round(n*10)/10;}
function fmtDate(day){
  const m = Math.floor((day-1)/30)+1, d = (day-1)%30+1;
  const months = ["春一月","春二月","春三月","夏四月","夏五月","夏六月","秋七月","秋八月","秋九月","冬十月","冬十一月","冬十二月"];
  return "4037年 · "+months[m-1]+" · "+(["一","二","三","四","五","六","七","八","九","十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十","廿一","廿二","廿三","廿四","廿五","廿六","廿七","廿八","廿九","三十"][d-1])+"日";
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function rich(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,"<b style='color:var(--gold2)'>$1</b>")
    .replace(/%%(.+?)%%/g,"<span class='item'>$1</span>")
    .replace(/##(.+?)##/g,"<span style='color:var(--ok)'>$1</span>");
}

/* ============ 判定引擎（81号 d100 六档） ============ */
function rollD100(){return Math.floor(Math.random()*100)+1;}
/* 变体池随机抽取（带去重）：pickV(["a","b","c"],"key") 同一key不重复直到用完 */
function pickV(arr,key){
  if(!arr||!arr.length) return "";
  if(arr.length===1) return arr[0];
  if(key){
    S._vused=S._vused||{};
    S._vused[key]=S._vused[key]||[];
    var used=S._vused[key];
    if(used.length>=arr.length){ S._vused[key]=[]; used=[]; }
    var pool=[];
    for(var i=0;i<arr.length;i++){ if(used.indexOf(i)<0) pool.push(i); }
    var pick=pool[Math.floor(Math.random()*pool.length)];
    used.push(pick);
    return arr[pick];
  }
  return arr[Math.floor(Math.random()*arr.length)];
}
/* tier字段解析：支持字符串数组或返回数组的函数 */
function tierArr(tier,field){
  var v=tier?tier[field]:null;
  if(!v) return null;
  if(typeof v==="function") return v();
  return v;
}
function tierOf(roll,target){
  if(roll===1) return "crit";
  if(roll<=Math.floor(target/5)) return "extreme";
  if(roll<=Math.floor(target/2)) return "hard";
  if(roll<=target) return "normal";
  if(roll===100 || (target<50 && roll>=96)) return "critfail";
  return "fail";
}
const TIER_CN = {crit:"大成功",extreme:"极成功",hard:"困难成功",normal:"普通成功",fail:"失败",critfail:"大失败"};
function globalMods(){
  let m = 0;
  if(S.fatigue>=10) m-=25; else if(S.fatigue>=7) m-=15; else if(S.fatigue>=4) m-=5;
  if(S.wound>0) m-=10;
  if(S.disease) m-=15;
  if(S.san>0 && S.san<=S.maxSan*0.2) m-=30;
  else if(S.san>0 && S.san<=S.maxSan*0.4) m-=20;
  else if(S.san>0 && S.san<=S.maxSan*0.6) m-=10;
  return m;
}
function effTarget(opt){
  let t = 50;
  const c = opt.check;
  if(c.a) t = S.attrs[c.a]||50;
  if(c.sk && S.skills[c.sk]) t += S.skills[c.sk];
  if(c.sk && S.job && JOBS[S.job] && JOBS[S.job].expert && JOBS[S.job].expert.indexOf(c.sk)>=0) t += 15;  // 职业特长修正（81号2.3）
  if(c.sk && S.subrace && SUBRACES[S.subrace] && SUBRACES[S.subrace].skills && SUBRACES[S.subrace].skills[c.sk]) t += SUBRACES[S.subrace].skills[c.sk];  // 种族技能
  t += (globalMods()||0);
  if(c.mods) for(const k in c.mods) t += c.mods[k];
  if(opt.selfMod) t += opt.selfMod();   // 动态修正（境界压制等）
  let r = Math.max(5,Math.min(98,t));
  if(S.travelFatigue>0) r = Math.max(5, Math.floor(r * (1 - [0,0.1,0.2,0.3][Math.min(3,S.travelFatigue)])));  // 旅行疲劳三档（3号）：4-6天-10%/7-10天-20%/10天以上-30%
  try{ const _v52r = v52_featApply(opt, r); r = _v52r.t; window.__v52mods = _v52r.labels; window.__v52modsTs = Date.now(); window.__v52reroll = _v52r.reroll; }catch(e){}
  return r;
}
function skillBonusOf(sk){
  if(!sk) return 0;
  if(!(sk in S.skills)) S.skills[sk]=0;
  return S.skills[sk];
}

/* ============ 属性与技能 ============ */
function jobSkill(){ return S.job ? JOBS[S.job].skill : null; }
function skillCn(sk){ return (SKILLS[sk]||{cn:sk}).cn; }
function repLevel(rep){
  if(rep>=80) return "大陆闻名"; if(rep>=50) return "一方名人";
  if(rep>=25) return "声名鹊起"; if(rep>=10) return "小有名气"; return "无名旅者";
}
function realmModStr(){ // 境界压制说明
  return "";
}

/* ============ 效果执行 ============ */
function applyEffects(eff,label){
  if(!eff) return null;
  const lines = [];
  // 函数式材料/典籍：延迟求值，拿到当前职业的真实数据（避免存成 [object Object]）
  if(typeof eff.mat==="function") eff.mat = eff.mat() || null;
  if(typeof eff.book==="function") eff.book = eff.book() || null;
  const add = (v,unit,pos) => { if(v!==0) lines.push((v>0?"+":"")+v+unit); };
  if(eff.gold){S.gold+=eff.gold; add(eff.gold,"金币",eff.gold>0);}
  /* /n1inj:eff/ N-1 立场结算（只加结算，不动判定） */
  if(eff.stance && eff.stance.axis){ if(!S.stance) S.stance={}; S.stance[eff.stance.axis]=(S.stance[eff.stance.axis]||0)+(eff.stance.v||0); }
  if(eff.prog && eff.prog.sk){ if(!S.skillProg) S.skillProg={}; var _p=S.skillProg[eff.prog.sk]||{lvl:1,xp:0}; _p.xp=(_p.xp||0)+(eff.prog.v||1); while(_p.xp>=_p.lvl*10){_p.xp-=_p.lvl*10;_p.lvl++;} S.skillProg[eff.prog.sk]=_p; }
  if(eff.xp){S.xp=Math.max(0,S.xp+eff.xp); add(eff.xp,"修为");}
  if(eff.hp){S.hp=Math.max(0,Math.min(maxHp(),S.hp+eff.hp)); add(eff.hp,"生命",eff.hp>0);}
  if(eff.san){S.san=Math.max(0,Math.min(S.maxSan,S.san+eff.san)); add(eff.san,"SAN",eff.san>0);}
  if(eff.rep){S.rep=Math.max(0,S.rep+eff.rep); add(eff.rep,"声望",eff.rep>0);}
  if(eff.karma){S.karma=Math.max(-100,Math.min(100,S.karma+eff.karma)); add(eff.karma,"业力",eff.karma>0);}
  if(eff.aura){S.aura=Math.max(0,Math.min(100,S.aura+eff.aura)); add(eff.aura,"气质",eff.aura>0);}
  if(eff.infl){for(const k in eff.infl){S.infl[k]=(S.infl[k]||0)+eff.infl[k]; lines.push((eff.infl[k]>0?"+":"")+eff.infl[k]+" "+regionCn(k)+"好感");}}
  if(eff.fatigue){S.fatigue=Math.max(0,S.fatigue+eff.fatigue);}
  if(eff.wound){S.wound=Math.min(3,S.wound+eff.wound); lines.push((eff.wound>0?"受":"")+Math.abs(eff.wound)+"级伤"+(eff.wound>0?"":"愈"));}
  if(eff.disease){S.disease=!!eff.disease;}
  if(eff.item){S.items.push(eff.item); lines.push("获得：%%"+eff.item+"%%");}
  if(eff.mat){S.mats[eff.mat]=(S.mats[eff.mat]||0)+1; lines.push("获得材料：%%"+eff.mat+"%%");}
  if(eff.book){S.books[eff.book]=true; lines.push("获得典籍：%%"+eff.book+"%%");}
  if(eff.skill){S.skills[eff.skill.s]=(S.skills[eff.skill.s]||0)+(eff.skill.v||10); lines.push("技能提升："+skillCn(eff.skill.s)+" +"+(eff.skill.v||10));}
  if(eff.flag){S.flags[eff.flag]=true;}
  if(eff.setflag){for(const k in eff.setflag){S.flags[k]=!!eff.setflag[k];}}
  /* /bd1inj:relation/ BD-1 好感效果键：effects.relation={npc,delta,reason} → changeRelation（沿用既有 60/80/-60 里程碑语义） */
  if(eff.relation){ try{ changeRelation(eff.relation.npc, eff.relation.delta||0, eff.relation.reason||""); }catch(e){} }
  if(eff.cond){S.conds[eff.cond]=true; lines.push("进阶条件达成："+condCn(eff.cond));}
  if(eff.loseItem){S.items=S.items.filter(x=>x!==eff.loseItem); lines.push("失去：%%"+eff.loseItem+"%%");}
  if(eff.loseMat){S.mats[eff.loseMat]=Math.max(0,(S.mats[eff.loseMat]||0)-(eff.n||1)); lines.push("消耗材料：%%"+eff.loseMat+"%%");}
  if(eff.loseGold){S.gold=Math.max(0,S.gold-eff.loseGold); lines.push("失去金币："+eff.loseGold);}
  if(eff.heal){S.hp=Math.min(maxHp(),S.hp+eff.heal); lines.push("恢复生命："+eff.heal);}
  if(eff.sanmax){S.maxSan+=eff.sanmax; if(!S.san) S.san=S.maxSan; lines.push("SAN上限 +"+eff.sanmax);}
  if(eff.attr){for(const k in eff.attr){S.attrs[k]=Math.min(80,S.attrs[k]+eff.attr[k]); lines.push(ATTR_CN[k]+" +"+eff.attr[k]);}}
  if(eff.world){
    var _wd = Array.isArray(eff.world)?eff.world:[eff.world];
    for(var _wi=0;_wi<_wd.length;_wi++){
      var _w = _wd[_wi];
      try{ var _m = worldDelta(_w.force, _w.inf||0, _w.stance); if(_m) lines.push(_m); }catch(e){}
    }
  }
  /* /v92inj:fxrec/ CON-1 触发⑥ 事件余波记录（只读钩子：记录最近一次有实质结算的摘要，供 v91_memoryInjection 生成后果句；独立 window 键，不入存档） */
  try{
    if(eff&&(eff.gold||eff.xp||eff.hp||eff.san||eff.rep||eff.karma||eff.aura||eff.wound||eff.item||eff.mat||eff.book||eff.skill||eff.flag||eff.setflag||eff.cond||eff.loseItem||eff.loseMat||eff.loseGold||eff.heal||eff.attr)){
      window.__v92lastFX = {day:S.day, lines:lines.slice(0,3)};
    }
  }catch(_e){}
  /* /upg07inj:notify/ UPG-07 响应式 UI 通知：结算后广播本次变更键（只读广播，不触碰任何语义） */
  try{ window.ELDA && window.ELDA.notify && window.ELDA.notify(eff); }catch(_e){}
  if(lines.length) return "◆ 结果："+lines.join("，")+"。";
  return null;
}
function condCn(c){
  return {mat:"材料",kno:"知识",pra:"实践",rit:"仪式",anc:"锚点",work:"传奇作品"}[c]||c;
}
function regionCn(k){return ({free:"自由城邦",north:"北方联盟",south:"南方城邦",church:"光明教会",elf:"精灵王国",dwarf:"矮人王国",orc:"兽人草原",east:"东部王国",abyss:"深渊"})[k]||k;}
function maxHp(){ return REALMS[S.realm].hp + (S.attrs.CON-20)*2; }

/* ============ 渲染 ============ */
function curCity(){
  const [r,c] = S.loc.split("_");
  const city = REGIONS[r] ? REGIONS[r].cities[c] : null;
  return {r,c,region:REGIONS[r],city};
}
function curLocName(){
  const cc = curCity();
  if(!cc.region) return "未知之地";
  return cc.city ? cc.region.cn+" · "+cc.city.cn : cc.region.cn;
}
function renderTop(){
  $("tb-date").textContent = fmtDate(S.day);
  $("tb-place").textContent = curLocName();
  $("tb-gold").textContent = money(S.gold)+" 金龙";
  $("tb-day").textContent = S.day;
  try{
    var _w=$("tb-weather");
    if(_w) _w.innerHTML = v44_weatherIcon();
    var _p=$("tb-pressure"), _pn=$("tb-pressure-num");
    var _tp=(S.time&&typeof S.time.timePressure==="number")?S.time.timePressure:0;
    if(_p){
      _p.style.width = Math.max(2,Math.min(100,_tp))+"%";
      _p.className = "v44-pressure-fill " + (_tp>=80?"v44-p-crit":(_tp>=60?"v44-p-warn":(_tp>=30?"v44-p-mid":"v44-p-low")));
    }
    if(_pn) _pn.textContent = _tp;
  }catch(e){}
}
/* ============ v2 渲染：侧栏五行 ============ */
function renderStats(){
  /* /p02fix:stats-null/ v68 UI 改版移除 #stats 容器后，写 $("stats") 会抛 null 并中断 writeNext（正文不渲染）。
     最小侵入修复：容器缺失时直接返回（状态显示由 v68 topbar tb-xxx 承担），不改变判定公式/writeNext/存档语义。 */
  if(!document.getElementById("stats")) return;
  const j = S.job?JOBS[S.job]:null;
  const maxh = maxHp();
  let h = "";
  h += "<div class='row'><span>名讳</span><b>"+esc(S.name)+"</b></div>";
  h += "<div class='row'><span>性别 / 出身</span><b>"+({男:"男",女:"女",secret:"隐秘"}[S.gender]||"男")+" · "+(S.homeland&&HOMELANDS[S.homeland]?HOMELANDS[S.homeland].cn:"—")+"</b></div>";
  h += "<div class='row'><span>种族</span><b>"+(S.subrace&&SUBRACES[S.subrace]?SUBRACES[S.subrace].cn:(S.race&&RACES[S.race]?RACES[S.race].cn:"—"))+"</b></div>";
  h += "<div class='row'><span>主修职业</span><b>"+(j?j.cn:"未定")+"</b></div>";
  h += "<div class='row'><span>理想</span><b>"+(S.ideal&&IDEALS[S.ideal]?IDEALS[S.ideal].cn:"—")+"</b></div>";
  h += "<div class='row'><span>爱好 / 天赋</span><b>"+(S.hobby&&HOBBIES[S.hobby]?HOBBIES[S.hobby].cn:"—")+" · "+(S.talent&&TALENTS[S.talent]?TALENTS[S.talent].cn:"—")+"</b></div>";
  // v30: 境界徽章
  h += "<div class='row'><span>境界</span><b><span class='realm-badge realm-"+S.realm+"'>"+REALMS[S.realm].cn+"</span> "+(j?j.titles[S.realm]:"旅人")+"</b></div>";
  h += "<div class='row'><span>名望</span><b>"+repLevel(S.rep)+"（"+S.rep+"）</b></div>";
  h += "<div class='row'><span>业力</span><b style='color:"+(S.karma<0?"var(--bad)":S.karma>0?"var(--ok)":"var(--txt)")+"'>"+S.karma+"</b></div>";
  h += "<div class='row'><span>气质</span><b>"+S.aura+"</b></div>";
  // v30: HP/SAN/经验使用.stat-bar样式
  h += "<div class='stat-bar'><span class='stat-label'>HP</span><div class='bar-bg'><div class='bar-fill hp' style='width:"+Math.max(0,Math.round(S.hp/maxh*100))+"%'></div></div><span class='stat-value'>"+S.hp+"/"+maxh+"</span></div>";
  h += "<div class='stat-bar'><span class='stat-label'>SAN</span><div class='bar-bg'><div class='bar-fill san' style='width:"+Math.max(0,Math.round(S.san/S.maxSan*100))+"%'></div></div><span class='stat-value'>"+S.san+"/"+S.maxSan+"</span></div>";
  const nextXp = S.realm<8 ? REALMS[S.realm+1].xp : REALMS[8].xp;
  const curXp = REALMS[S.realm].xp;
  const pct = Math.min(100,Math.round((S.xp-curXp)/(nextXp-curXp)*100));
  h += "<div class='stat-bar'><span class='stat-label'>修为</span><div class='bar-bg'><div class='bar-fill exp' style='width:"+pct+"%'></div></div><span class='stat-value'>"+S.xp+"/"+nextXp+"</span></div>";
  h += "<div class='row'><span>日期</span><b>"+S.day+" 日</b></div>";
  const st = [];
  if(S.fatigue>=10) st.push("极度疲惫"); else if(S.fatigue>=7) st.push("疲惫"); else if(S.fatigue>=4) st.push("劳累");
  if(S.wound>=2) st.push("重伤"); else if(S.wound>=1) st.push("轻伤");
  if(S.disease) st.push("患病");
  if(st.length) h += "<div class='row'><span>状态</span><b style='color:var(--bad)'>"+st.join("·")+"</b></div>";
  const _wds=(S.wounds&&S.wounds.length)?S.wounds:null;
  if(_wds){ h += "<div class='row'><span>伤势</span><b style='color:var(--bad)'>"+_wds.map(function(w){return w.lvl+"·"+w.part;}).join("；")+"</b></div>"; }
  const _spk=(S.skillProg&&Object.keys(S.skillProg).length)?S.skillProg:null;
  if(_spk){ h += "<div class='row'><span>技能</span><b>"+Object.keys(_spk).slice(0,5).map(function(k){return k+" Lv"+_spk[k].lvl;}).join(" · ")+"</b></div>"; }
  // v30: 六维属性使用进度条
  h += "<div style='margin-top:8px;border-top:1px solid var(--border);padding-top:8px'>";
  for(const a of ATTRS){
    const av = S.attrs[a]||0;
    const apct = Math.min(100, Math.round(av/100*100));
    h += "<div class='stat-bar'><span class='stat-label' title='"+ATTR_DESC[a]+"'>"+ATTR_CN[a].substring(0,2)+"</span><div class='bar-bg'><div class='bar-fill attr' style='width:"+apct+"%'></div></div><span class='stat-value'>"+av+"</span></div>";
  }
  h += "</div>";
  try{ if(window.V68_UI && V68_UI.sideWrap) h = V68_UI.sideWrap(h); }catch(e){}
  $("stats").innerHTML = h;
}


/* ============ 叙事渲染 ============ */
let storyEl, optEl, curNode=null; window.optEl = optEl; window.curNode = curNode; /* /u3fix:curnode-export/ */ /* /v60inj:winx2:optEl/ */ window.storyEl = storyEl; /* /v60inj:winx2:storyEl/ */
function jobMat(i){
  try{ if(S && S.job && JOBS[S.job].mats) return JOBS[S.job].mats[i]||"材料"; }catch(e){}
  return "材料";
}
function jobTitle(i){
  try{ if(S && S.job && JOBS[S.job].titles) return JOBS[S.job].titles[i]||"你"; }catch(e){}
  return "你";
}
function mercuryNote(){
  try{ if(S && S.job==="灵魂法师") return "灵魂魔法的基础"; }catch(e){}
  return "修行之道";
}
function jobBook(i){
  try{ if(S && S.job && JOBS[S.job].books && JOBS[S.job].books[0]) return JOBS[S.job].books[0][i]||"某本典籍"; }catch(e){}
  return "某本典籍";
}
function writePar(p,cls){
  if(typeof p==="string") p = p.replace(/\[\[JB0\]\]/g, jobBook(0)).replace(/\[\[JB1\]\]/g, jobBook(1)).replace(/\[\[JM0\]\]/g, jobMat(0)).replace(/\[\[JT1\]\]/g, jobTitle(1)).replace(/\[\[MERC\]\]/g, mercuryNote());

  const d = document.createElement("p");
  if(cls) d.className=cls;
  d.innerHTML = rich(p);
  if(typeof p==="string" && window.v96_probeConv){ var _ph = window.v96_probeConv(d.innerHTML); if(_ph !== d.innerHTML){ d.innerHTML = _ph; } } /* /v96inj:probe/ B8 线索锚点（rich 后转换防 esc 转义） */
  if(typeof p==="string" && window.v96_choiceEcho){ var _ce = window.v96_choiceEcho(d.innerHTML); if(_ce !== d.innerHTML){ d.innerHTML = _ce; } } /* /v96inj:choice/ C11 选择记忆回显（rich 后转换） */
  try{ if(window.LW_render){ var _lr = window.LW_render(d.innerHTML); if(_lr !== d.innerHTML){ d.innerHTML = _lr; } } }catch(e){} /* /lwinj:render/ LW 世界回响/记忆/动态文本渲染 */
  try{ window.v92_highlightNames && window.v92_highlightNames(d); }catch(e){}
  RenderBatch.push(d);
  return d;
}
function writeDice(roll,target,tierLabel){
  if(window.__v52mods && window.__v52mods.length && window.__v52modsTs && (Date.now()-window.__v52modsTs)<200){
    try{ const _ms = window.__v52mods; window.__v52mods=[]; const _x = document.createElement("div"); _x.style.cssText = "font-size:12px;color:#a8842a;margin:2px 0 4px;"; var _hasTag=false; for(var _t55=0;_t55<_ms.length;_t55++){ if(_ms[_t55].indexOf("【")===0){ _hasTag=true; break; } }
      _x.innerHTML = (_hasTag?"":"【专长】") + _ms.join(" · "); storyEl.appendChild(_x); }catch(e){}
  }
  // v30: 映射到四档彩色横幅
  let rollClass = "roll-ok";
  let rollName = "成功";
  if(tierLabel==="crit"){ rollClass="roll-crit"; rollName="大成功！"; }
  else if(tierLabel==="extreme"||tierLabel==="hard"||tierLabel==="normal"){ rollClass="roll-ok"; rollName="成功"; }
  else if(tierLabel==="fail"){ rollClass="roll-fail"; rollName="失败"; }
  else if(tierLabel==="critfail"){ rollClass="roll-critfail"; rollName="大失败！"; }
  const d = document.createElement("div");
  d.className = "roll-result "+rollClass;
  d.innerHTML = rollName+" <span style='font-weight:normal;font-size:13px;opacity:.85'>（d100=<b>"+roll+"</b> / 目标 "+target+"）</span>";
  storyEl.appendChild(d);
  storyEl.scrollTop = storyEl.scrollHeight;
  try{ v44_diceFX(roll,target,tierLabel); }catch(e){}
}
function clearOptions(){ $("options").innerHTML=""; }
/* ===== /v92inj:ach/ UPG-06 结局图鉴 + 成就系统（跨周目累积；localStorage 独立键 elda_achievements，与存档 key 分离；不触碰存档结构/saveVersion） ===== */
window.ELDA_ACHIEVEMENTS_KEY = 'elda_achievements';
window.v92_achLoad = function(){
  try{
    var d = JSON.parse(localStorage.getItem(window.ELDA_ACHIEVEMENTS_KEY) || 'null');
    if(!d || typeof d !== 'object') d = {};
    d.unlockedEndings = Array.isArray(d.unlockedEndings) ? d.unlockedEndings : [];
    d.achievements = (d.achievements && typeof d.achievements === 'object') ? d.achievements : {};
    d.stats = (d.stats && typeof d.stats === 'object') ? d.stats : {decisions:0, rollbacks:0, endings:0};
    return d;
  }catch(e){ return {unlockedEndings:[], achievements:{}, stats:{decisions:0, rollbacks:0, endings:0}}; }
};
window.v92_achSave = function(d){
  try{ localStorage.setItem(window.ELDA_ACHIEVEMENTS_KEY, JSON.stringify(d)); }catch(e){}
};
window.v92_achUnlock = function(id){
  try{
    if(!id) return false;
    var d = window.v92_achLoad();
    if(d.achievements[id]) return false;
    d.achievements[id] = Date.now();
    window.v92_achSave(d);
    try{ window.flashMsg('🏆 成就解锁：' + (window.v92_ACH_DEFS && v92_ACH_DEFS[id] ? v92_ACH_DEFS[id].name : id)); }catch(e){}
    return true;
  }catch(e){ return false; }
};
window.v92_achEnding = function(node){
  try{
    if(!node) return;
    var isEnd = (node.tag === 'ending') || (node.tags && Array.isArray(node.tags) && node.tags.some(function(t){ return t.indexOf('ending:') === 0; })) || (String(curNode||'').indexOf('ending_') === 0);
    if(!isEnd) return;
    var d = window.v92_achLoad();
    var key = String(curNode || '').replace(/_\d+$/, '');
    if(!key) key = String(node.id || curNode || '');
    if(d.unlockedEndings.indexOf(key) < 0){
      d.unlockedEndings.push(key);
      d.stats.endings = d.unlockedEndings.length;
      window.v92_achSave(d);
      try{ window.flashMsg('📖 结局图鉴解锁：' + key); }catch(e){}
    }
  }catch(e){}
};
window.v92_achTick = function(node){
  try{
    var d = window.v92_achLoad();
    var fl = (S && S.flags) ? S.flags : {};
    var flagsHave = function(sub){ for(var k in fl){ if(k.indexOf(sub) >= 0) return true; } return false; };
    /* 结局图鉴 */
    try{ window.v92_achEnding(node); }catch(e){}
    /* 统计型 */
    var visitedN = (S && S.visited) ? Object.keys(S.visited).length : 0;
    var anchors = 0;
    for(var ai=1; ai<=7; ai++){ if(fl['anchor_' + ai]) anchors++; }
    var defs = {
      ach_first_choice: { name:'初入抉择', desc:'做出你的第一个选择', hit: function(){ return d.stats.decisions >= 1; } },
      ach_travel_5: { name:'踏遍五城', desc:'足迹遍布五座城市', hit: function(){ return visitedN >= 5; } },
      ach_academy: { name:'学院学生', desc:'踏入艾尔达魔法学院', hit: function(){ return flagsHave('academy_student'); } },
      ach_grad: { name:'学业有成', desc:'完成一段学业旅程', hit: function(){ return flagsHave('grad_') || flagsHave('academy_graduat'); } },
      ach_anchor: { name:'七锚集齐', desc:'集齐七枚锚', hit: function(){ return anchors >= 7; } },
      ach_goldscale: { name:'金秤真相', desc:'揭露金秤家族的隐秘', hit: function(){ return flagsHave('goldscale_done') || flagsHave('old_moritz_talk'); } },
      ach_end1: { name:'初窥结局', desc:'见证第一个结局', hit: function(){ return d.unlockedEndings.length >= 1; } },
      ach_end5: { name:'结局猎手', desc:'见证五个不同结局', hit: function(){ return d.unlockedEndings.length >= 5; } },
      ach_endAll: { name:'全结局见证', desc:'见证全部 21 个结局', hit: function(){ return d.unlockedEndings.length >= 21; } },
      ach_rollback: { name:'时空回溯', desc:'使用回退功能回溯时间', hit: function(){ return d.stats.rollbacks >= 1; } }
    };
    window.v92_ACH_DEFS = defs;
    var unlocked = false;
    for(var id in defs){
      if(d.achievements[id]) continue;
      try{ if(defs[id].hit()){ d.achievements[id] = Date.now(); unlocked = true; try{ window.flashMsg('🏆 成就解锁：' + defs[id].name); }catch(e){} } }catch(e){}
    }
    if(unlocked) window.v92_achSave(d);
  }catch(e){}
};
/* ===== /v92inj:ach2/ 统计钩子：决策计数（showOptions 触发）/ 回退计数 ===== */
window.v92_achStat = function(k){
  try{
    var d = window.v92_achLoad();
    d.stats[k] = (d.stats[k] || 0) + 1;
    window.v92_achSave(d);
  }catch(e){}
};
/* ===== /v92inj:rollback/ UPG-05 回退系统（决策点快照栈；Ren'Py block_rollback 式；localStorage 独立键 elda-rollback，不入存档结构；irreversible 账本项阻断回退跨越；不触碰判定/存档语义） ===== */
window.__v92rb = window.__v92rb || {lastNode:""};
window.v92_rollbackIrreversible = function(node){
  try{
    if(!node) return false;
    const LG=window.CAUSALITY_LEDGER; if(!LG) return false;
    const irr=LG.filter(function(it){ return it&&it.irreversible; });
    if(!irr.length) return false;
    /* 拼节点文本+选项 effects 的 flag 写入，与 irreversible 项 keywords 匹配 */
    let hay="";
    try{
      const raw=(typeof node.text==="function")?node.text():node.text;
      if(typeof raw==="string") hay+=raw; else if(Array.isArray(raw)) hay+=raw.join(" ");
      if(node.options){
        const opts=typeof node.options==="function"?node.options():node.options;
        if(Array.isArray(opts)){ for(let i=0;i<opts.length;i++){ try{ hay+=" "+JSON.stringify(opts[i]||{}); }catch(_){} } }
      }
    }catch(_){}
    for(let i=0;i<irr.length;i++){
      const kw=irr[i].keywords; if(!kw||!kw.length) continue;
      for(let k=0;k<kw.length;k++){ if(hay.indexOf(kw[k])>=0) return true; }
    }
    return false;
  }catch(e){ return false; }
};
window.v92_rollbackPush = function(node){
  try{
    if(!node||!node.options) return;
    const cur=String(curNode||"");
    if(cur===window.__v92rb.lastNode) return; /* 同一节点不重复压栈 */
    window.__v92rb.lastNode=cur;
    try{
      const snap=JSON.stringify({s:S, node:cur, t:Date.now(), irr:window.v92_rollbackIrreversible(node)});
      let arr=[];
      try{ arr=JSON.parse(localStorage.getItem("elda-rollback")||"[]"); }catch(_){ arr=[]; }
      if(!Array.isArray(arr)) arr=[];
      arr.push(snap);
      if(arr.length>12) arr=arr.slice(arr.length-12);
      localStorage.setItem("elda-rollback", JSON.stringify(arr));
    }catch(_){}
  }catch(_){}
};
window.v92_rollback = function(){
  try{
    let arr=[];
    try{ arr=JSON.parse(localStorage.getItem("elda-rollback")||"[]"); }catch(_){ arr=[]; }
    if(!Array.isArray(arr)||!arr.length){ try{ window.flashMsg("没有可回退的决策点。"); }catch(_){} return false; }
    let target=null;
    while(arr.length){
      const snap=arr.pop();
      try{
        const d=JSON.parse(snap);
        if(d&&d.irr){ continue; } /* irreversible 决策点不跨过 */
        target=d; break;
      }catch(_){ continue; }
    }
    localStorage.setItem("elda-rollback", JSON.stringify(arr));
    if(!target){ try{ window.flashMsg("上一个决策点不可回退（不可逆剧情）。"); }catch(_){} return false; }
    /* 恢复状态并重渲染 */
    try{ window.v67_busySet(); }catch(_){}
    try{
      const d=target;
      if(d.s){ for(const k in d.s){ S[k]=d.s[k]; } }
      curNode=d.node;
      try{ if(window.v91_sessReset) v91_sessReset(); }catch(_){}
      writeNext();
      try{ window.v92_achStat('rollbacks'); }catch(_){}
      try{ window.flashMsg("已回退到上一个决策点。"); }catch(_){}
      return true;
    }catch(e){
      try{ window.v67_busyClear(); }catch(_){}
      try{ window.flashMsg("回退失败，请重试。"); }catch(_){}
      return false;
    }
  }catch(e){ return false; }
};
window.v92_rollbackCount = function(){
  try{
    const arr=JSON.parse(localStorage.getItem("elda-rollback")||"[]");
    return Array.isArray(arr)?arr.length:0;
  }catch(e){ return 0; }
};
function showOptions(node){
  try{ window.v92_rollbackPush(node); }catch(e){}
  try{ window.v92_achStat('decisions'); }catch(e){}
  clearOptions();
  if(!node || !node.options){ try{ window.v67_busyClear(); }catch(e){} return; }
  var opts = typeof node.options === "function" ? node.options() : node.options;
  if(!opts){ try{ window.v67_busyClear(); }catch(e){} return; }
  /* /v96inj:optid/ V96 节点 id 解析（A4 一次性键；不写存档结构） */
  var _nid = null;
  try{
    if(typeof curNode !== "undefined" && curNode){ _nid = curNode; }
    else if(node && node.id){ _nid = node.id; }
    else if(node && node.key){ _nid = node.key; }
    else { var _N = (typeof N !== "undefined") ? N : null; if(_N){ for(var _k in _N){ if(_N[_k]===node){ _nid=_k; break; } } } }
  }catch(e){}
  for(let i=0;i<opts.length;i++){
    const o = opts[i];
    var _reqFail = false;
    if(o.req){ try{ if(!o.req()) _reqFail = true; }catch(e){ _reqFail = true; } }
    /* /v96inj:optgate/ V96 门控：A6 隐藏不渲染；A1/A4/A5 灰锁 */
    var _g = null;
    try{ _g = window.v96_optGate(o, S, _nid, i); }catch(e){}
    if(_g && _g.hide){ continue; }
    if(_g && _g.locked && !_reqFail){ _reqFail = true; }
    const b = document.createElement("button");
    b.className="opt" + (_reqFail ? " opt-locked" : "");
    b.disabled = _reqFail;
    if(_reqFail){ b.title = (_g && _g.reason) ? _g.reason : "条件不足"; }
    b.setAttribute("data-t", o.t || "");
    // v30: 选项类型配色
    const txt = (_g && _g.text) ? _g.text : (o.t || "");
    if(o.gold || /秘密|隐藏|特殊|传说|机缘|奇遇/.test(txt)){ b.className+=" opt-gold"; }
    else if(/攻击|战斗|杀|打|决斗|砍|刺|劈|挥拳|出手/.test(txt)){ b.className+=" opt-combat"; }
    else if(/说|问|谈|对话|说服|回答|回应|解释|询问|交谈/.test(txt)){ b.className+=" opt-dialog"; }
    else if(/修炼|闭关|打坐|冥想|修行|练功|突破/.test(txt)){ b.className+=" opt-cultivate"; }
    else if(/探索|查看|调查|搜索|观察|检查|察看|打量/.test(txt)){ b.className+=" opt-explore"; }
    else if(/离开|走|返回|撤退|回去|告别|告辞|离开这里/.test(txt)){ b.className+=" opt-leave"; }
    let html = "<span class='od'>◆</span> "+rich(txt);
    if(o.check){
      const t = effTarget(o);
      html += "<span class='oh'>（"+ (o.check.label||skillCn(o.check.sk)||ATTR_CN[o.check.a]) +" · 成功率约 "+(t>=98?">98":t<=5?"<5":t)+"%"+ (o.check.note?" · "+o.check.note:"") +"）</span>";
    } else if(o.note){
      html += "<span class='oh'>（"+o.note+"）</span>";
    }
    /* /v96inj:preview/ A3 后果预览（只读推导） */
    var _pv = "";
    try{ _pv = window.v96_preview(o); }catch(e){}
    if(_pv){ html += "<span class='oh oh-pv'>"+_pv+"</span>"; }
    b.innerHTML = html;
    b.onclick = function(){
      if(_reqFail){ try{ if(window.flashMsg) window.flashMsg((_g&&_g.reason)||"你还不具备这个条件。"); }catch(e){} return; }
      try{ window.v96_markOnce(S, _nid, i); }catch(e){}
      if(o.dual){ try{ if(window.v96_dualResolve(o, S)) return; }catch(e){} }
      choose(o);
    };
    $("options").appendChild(b);
  }
  try{ if(window.v55_skillBar) v55_skillBar(); }catch(e){}
  try{ if(window.v55_arcEntry) v55_arcEntry(); }catch(e){}
  try{ window.v67_busyClear(); }catch(e){}
}

/* =====v96-opt===== */
/* V96 选项门控：A1 条件显隐 / A4 一次性 / A5 时间敏感 / A6 隐藏。只读渲染层，不触碰判定公式与 choose */
(function(){
try{
  var _cmp = {
    ">=": function(a,b){ return a>=b; },
    ">":  function(a,b){ return a>b; },
    "<=": function(a,b){ return a<=b; },
    "<":  function(a,b){ return a<b; },
    "==": function(a,b){ return a===b; }
  };
  window.v96_onceKey = function(nodeId, idx){ return "opt_"+nodeId+"_"+idx; };
  window.v96_optGate = function(o, S, nodeId, idx){
    var r = { hide:false, locked:false, reason:"", text:"" };
    if(!o){ return r; }
    S = S || {};
    r.text = o.t || "";
    var day = S.day||0;
    var flags = S.flags||{};
    /* A5 时间敏感：day 超窗口则过期锁定并换文案 */
    if(o.expire && !r.locked){
      var dl = o.expire.day||0;
      if(day > dl){
        r.locked = true;
        r.reason = o.expire.locked || "时机已过，来不及了。";
        if(o.expire.lockedText){ r.text = o.expire.lockedText; }
      }
    }
    /* A1 条件显隐：cond 声明式门槛 */
    if(o.cond && !r.locked){
      var c = o.cond;
      if(c.flag && !flags[c.flag]){ r.locked = true; }
      if(c.flagNot && flags[c.flagNot]){ r.locked = true; }
      if(c.skill && !r.locked){
        var sk = (S.skills&&S.skills[c.skill.k])||0;
        var f1 = _cmp[c.skill.op]||_cmp[">="];
        if(!f1(sk, c.skill.v)){ r.locked = true; }
      }
      if(c.rel && !r.locked){
        var rv = (S.npcRelations&&S.npcRelations[c.rel.id])||0;
        var f2 = _cmp[c.rel.op]||_cmp[">"];
        if(!f2(rv, c.rel.v)){ r.locked = true; }
      }
      if(c.job && S.job!==c.job){ r.locked = true; }
      if(c.place && S.place!==c.place){ r.locked = true; }
      if(c.day && !r.locked){
        var f3 = _cmp[c.day.op]||_cmp["<="];
        if(!f3(day, c.day.v)){ r.locked = true; }
      }
      if(c.world && !r.locked){
        var _wr = window.LW_cond ? window.LW_cond(c.world, S) : {pass:true, reason:""};
        if(!_wr.pass){ r.locked = true; r.reason = _wr.reason || "世界尚未走到那一步。"; }
      } /* /lwinj:cond/ S5 叙事门控：cond.world.*（season/dayPhase/faction/city/echo/flag） */
      if(r.locked){ r.reason = c.reason || "条件不足。"; }
    }
    /* A6 隐藏：默认不渲染，解锁后出现 */
    if(o.hidden && !r.locked){
      var show = false;
      var u = o.unlock;
      if(u){
        if(u.flag && flags[u.flag]){ show = true; }
        if(u.probe === true){ show = true; }
      }
      if(!show){ r.hide = true; }
    }
    /* A4 一次性：节点重访灰锁 */
    if(o.once && !r.locked && nodeId!=null && idx!=null){
      if(flags[window.v96_onceKey(nodeId, idx)]){ r.locked = true; r.reason = "你已做过这个选择。"; }
    }
    return r;
  };
  window.v96_markOnce = function(S, nodeId, idx){
    if(!S || nodeId==null || idx==null){ return; }
    try{ S.flags = S.flags||{}; S.flags[window.v96_onceKey(nodeId, idx)] = true; }catch(e){}
  };
  /* A2 组合判定：双属性三档，完全旁路 choose（不改判定公式，复用既有结算/推进） */
  window.v96_dualResolve = function(opt, S){
    var d = opt ? opt.dual : null;
    if(!d){ return false; }
    S = S || {};
    var p = 0;
    try{ var av = (S.attrs&&S.attrs[d.a.k])||0; if(av >= d.a.v){ p++; } }catch(e){}
    try{ var bv = (S.attrs&&S.attrs[d.b.k])||0; if(bv >= d.b.v){ p++; } }catch(e){}
    var tierOpt = (p>=2) ? (d.tier.pass||null) : ((p===1) ? (d.tier.part||null) : (d.tier.fail||null));
    if(!tierOpt){ try{ if(window.flashMsg) window.flashMsg("你无法同时满足这两项条件。"); }catch(e){} return true; }
    var merged = {};
    for(var k in opt){ if(k!=="dual"){ merged[k]=opt[k]; } }
    if(tierOpt.effects){ merged.effects = tierOpt.effects; }
    if(tierOpt.go){ merged.go = tierOpt.go; }
    if(tierOpt.time){ merged.time = tierOpt.time; }
    if(tierOpt.note){ merged.note = tierOpt.note; }
    if(tierOpt.text){ merged.tier = {ok:[tierOpt.text]}; }
    delete merged.check;
    delete merged.cond;
    try{ S.dice = S.dice||[]; S.dice.push({node:(typeof curNode!=="undefined")?curNode:null, opt:(opt.t||""), roll:p, target:(d.dc||0), lvl:(p>=2?"crit":(p===1?"normal":"fail")), sk:"dual"}); }catch(e){}
    try{ choose(merged); }catch(e){ try{ if(window.flashMsg) window.flashMsg("判定结算异常。"); }catch(e2){} }
    return true;
  };
  /* A3 后果预览：从选项推导影响摘要（只读，纯渲染） */
  window.v96_preview = function(o){
    if(!o){ return ""; }
    var parts = [];
    try{
      if(o.time){ parts.push("⏱+"+o.time+"日"); }
      var ef = o.effects || o.effect;
      if(ef){
        if(ef.gold){ parts.push((ef.gold>0?"💰+":"💰")+ef.gold+"金"); }
        if(ef.xp){ parts.push("修为"+(ef.xp>0?"+":"")+ef.xp); }
        if(ef.hp||ef.heal){ parts.push("生命"+(ef.hp>0?"+":(ef.heal>0?"+":""))+(ef.hp||ef.heal||0)); }
        if(ef.rep){ parts.push("声望"+(ef.rep>0?"+":"")+ef.rep); }
        if(ef.karma){ parts.push("业力"+(ef.karma>0?"+":"")+ef.karma); }
        if(ef.aura){ parts.push("气质"+(ef.aura>0?"+":"")+ef.aura); }
        if(ef.relation){ parts.push("♥"+String(ef.relation.npc||"")+(ef.relation.delta>0?"+":"")+(ef.relation.delta||0)); }
        if(ef.wound){ parts.push(ef.wound>0?"受伤":"疗伤"); }
        if(ef.item){ parts.push("得物"); }
        if(ef.attr){ for(var ak in ef.attr){ if(typeof ATTR_CN!=="undefined"&&ATTR_CN) parts.push((ATTR_CN[ak]||ak)+(ef.attr[ak]>0?"+":"")+ef.attr[ak]); } }
        if(ef.flag||ef.setflag){ parts.push("⚑"); }
        if(ef.loseGold){ parts.push("💰-"+ef.loseGold+"金"); }
      }
      if(o.changeRelation){ for(var ck in o.changeRelation){ parts.push("♥"+ck+(o.changeRelation[ck]>0?"+":"")+o.changeRelation[ck]); } }
      if(o.go && typeof N!=="undefined" && N && N[o.go]){ parts.push("→"+(N[o.go].place||o.go)); }
    }catch(e){}
    return parts.slice(0,4).join(" · ");
  };
}catch(e){}
})();

/* =====v96-hot===== */
/* V96 正文热词卡：B7 词条卡 / B9 关系回指 / B10 地点联动。点击 v92-name span 弹卡，capture 阶段拦截防误触继续阅读 */
(function(){
try{
  window.v96_closeCard = function(){
    try{
      if(window.__v96cardH){ document.removeEventListener("click", window.__v96cardH, true); window.__v96cardH = null; }
      var b = document.getElementById("v96-card"); if(b && b.parentNode){ b.parentNode.removeChild(b); }
    }catch(e){}
  };
  window.v96_openCard = function(kind, id){
    try{
      window.v96_closeCard();
      var ttl = ""; var body = ""; var foot = "";
      if(kind === "lore"){
        var lb = null;
        try{ if(window.LOREBOOK){ for(var i=0;i<LOREBOOK.length;i++){ if(LOREBOOK[i] && LOREBOOK[i].title === id){ lb = LOREBOOK[i]; break; } } } }catch(e){}
        ttl = (lb && lb.title) || id;
        body = (lb && lb.text) ? lb.text : "（暂无词条正文）";
        foot = "世界书 · 词条";
      } else if(kind === "npc"){
        var np = (window.NPC_NET && window.NPC_NET[id]) || null;
        ttl = (np && np.cn) || id;
        var rel = (typeof S!=="undefined" && S && S.npcRelations && S.npcRelations[id]) || 0;
        var lvl = "陌生";
        try{ if(window.getRelationLevel){ var l = window.getRelationLevel(id); if(l && l.name) lvl = l.name; } }catch(e){}
        body = (np && np.desc) ? np.desc : "（暂无人物档案）";
        foot = "关系 " + rel + " · " + lvl;
      } else if(kind === "place"){
        var sid = String(id||"");
        var rk = sid.split("_")[0];
        var ck = sid.indexOf("_") > 0 ? sid.substring(sid.indexOf("_")+1) : null;
        var reg = (window.REGIONS && REGIONS[rk]) || null;
        var cty = (reg && ck && reg.cities && reg.cities[ck]) || null;
        ttl = (cty && cty.cn) || (reg && reg.cn) || id;
        body = (cty && cty.desc) ? cty.desc : ((reg && reg.desc) || "（暂无地域简介）");
        foot = (reg && reg.cn) ? ("九域 · " + reg.cn) : "九域";
      } else { return; }
      var box = document.createElement("div");
      box.id = "v96-card";
      box.style.cssText = "position:fixed;z-index:10001;max-width:380px;min-width:240px;padding:16px 18px;background:#1b1e28;border:1px solid #8b6f47;border-radius:10px;color:#d8d2c4;font-size:14px;line-height:1.7;box-shadow:0 8px 30px rgba(0,0,0,.55);left:50%;top:40%;transform:translate(-50%,-50%);";
      box.innerHTML =
        "<div style='display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #3a3d4a;padding-bottom:8px;margin-bottom:10px'>"+
        "<b style='color:#e8c86a;font-size:15px'>"+ttl+"</b>"+
        "<span onclick='window.v96_closeCard()' style='cursor:pointer;color:#9a948a;font-size:16px;line-height:1' title='关闭'>✕</span></div>"+
        "<div style='max-height:300px;overflow:auto'>"+body+"</div>"+
        "<div style='margin-top:10px;color:#9a948a;font-size:12px;border-top:1px solid #3a3d4a;padding-top:6px'>"+foot+"</div>";
      document.body.appendChild(box);
      setTimeout(function(){
        try{
          if(window.__v96cardH){ document.removeEventListener("click", window.__v96cardH, true); }
          var _h = function(ev){
            var _t = ev.target;
            if(!_t) return;
            if(_t.classList && _t.classList.contains("v92-name")) return;
            if(_t.id && _t.id === "v96-card") return;
            if(_t.closest && _t.closest("#v96-card")) return;
            window.v96_closeCard();
          };
          window.__v96cardH = _h;
          document.addEventListener("click", _h, true);
        }catch(e){}
      }, 10);
    }catch(e){}
  };
  window.v96_b4css = function(){
    try{
      if(document.getElementById("v96-b4-css")) return;
      var st = document.createElement("style");
      st.id = "v96-b4-css";
      st.textContent = ".v96-probe{display:inline-block;margin:2px 4px;padding:2px 10px;border:1px solid #a8842a;border-radius:4px;color:#e8c86a;background:rgba(168,132,42,.12);cursor:pointer;font-size:13px;}"+
        ".v96-probe:hover{background:rgba(168,132,42,.28);}"+
        ".v96-back{display:block;margin:14px 0 4px;padding:8px 14px;border:1px dashed #8b6f47;border-radius:6px;color:#b8a888;background:rgba(139,111,71,.08);cursor:pointer;font-size:13px;text-align:center;}"+
        ".v96-back:hover{background:rgba(139,111,71,.18);color:#e8c86a;}";
      (document.head||document.documentElement).appendChild(st);
    }catch(e){}
  };
  window.v96_probeConv = function(p){
    try{
      return String(p).replace(/\[调查:([\w\-]+):([^\]]+)\]/g, function(m, nid, label){
        if(!window.N || !window.N[nid]) return m;
        var lab = String(label).split('"').join('&quot;');
        return "<span class='v96-probe' data-go='"+nid+"'>"+lab+"</span>";
      });
    }catch(e){ return p; }
  };
  window.v96_choiceEcho = function(p){
    try{
      return String(p).replace(/\{\{choice:([\w\-]+)\|([^|]+)\|([^}]+)\}\}/g, function(m, fl, yes, no){
        var v = (typeof S!=="undefined" && S && S.flags) ? S.flags[fl] : null;
        return v ? yes : no;
      });
    }catch(e){ return p; }
  };
  window.v96_backPush = function(nid){
    try{
      if(window.v96_backMark){ window.v96_backMark = false; return; }
      if(!window.__v45prev) window.__v45prev = [];
      var arr = window.__v45prev;
      if(arr.length && arr[arr.length-1] === nid) return;
      arr.push(nid);
      if(arr.length > 60) arr.shift();
    }catch(e){}
  };
  window.v96_backStep = function(){
    try{
      var arr = window.__v45prev;
      if(!arr || !arr.length){ try{ flashMsg('没有更早的分支了'); }catch(e){} return; }
      arr.pop();
      if(!arr.length){ try{ flashMsg('没有更早的分支了'); }catch(e){} return; }
      var prev = arr[arr.length-1];
      while(prev && window.N && window.N[prev] && window.N[prev].auto){
        arr.pop();
        if(!arr.length){ try{ flashMsg('没有更早的分支了'); }catch(e){} return; }
        prev = arr[arr.length-1];
      }
      if(!window.N || !window.N[prev]){ try{ flashMsg('没有更早的分支了'); }catch(e){} return; }
      curNode = prev;
      window.v96_backMark = true;
      writeNext();
    }catch(e){}
  };
  window.v96_backRender = function(){
    try{
      window.v96_b4css();
      var old = document.getElementById("v96-back-btn");
      if(old && old.parentNode){ old.parentNode.removeChild(old); }
      var arr = window.__v45prev;
      if(!arr || !arr.length) return;
      var story = document.getElementById("story");
      if(!story) return;
      var d = document.createElement("div");
      d.id = "v96-back-btn";
      d.className = "v96-back";
      d.innerHTML = "↩ 回退一步";
      story.appendChild(d);
      story.scrollTop = story.scrollHeight;
    }catch(e){}
  };
  /* 点击委托：v92-name span → 弹卡（capture 拦截；选项区不拦截） */
  document.addEventListener("click", function(e){
    try{
      var t = e.target;
      if(!t || !t.classList) return;
      if(t.classList.contains("v92-name")){
        if(t.closest && t.closest("#options")) return;
        var k = t.getAttribute("data-k");
        var id = t.getAttribute("data-id");
        if(!k || !id) return;
        e.stopPropagation();
        e.preventDefault();
        window.v96_openCard(k, id);
        return;
      }
      if(t.classList.contains("v96-probe")){
        if(t.closest && t.closest("#options")) return;
        var go = t.getAttribute("data-go");
        if(!go || !window.N || !window.N[go]) return;
        e.stopPropagation();
        e.preventDefault();
        curNode = go;
        try{ window.v67_busyClear(); }catch(e3){}
        writeNext();
        return;
      }
      if(t.classList.contains("v96-back")){
        e.stopPropagation();
        e.preventDefault();
        window.v96_backStep();
        return;
      }
    }catch(e2){}
  }, true);
}catch(e){}
})();

/*=====v47-eng=====*/
(function(){
try{
var FORCES = {
  church: {cn:"光明教会", influence:45, stance:"firm", color:"#d4a017"},
  eclipse: {cn:"暗蚀会", influence:25, stance:"hidden", color:"#7a2e2e"},
  watcher: {cn:"守望者", influence:30, stance:"watch", color:"#3a6ea8"},
  guild: {cn:"自由商会", influence:50, stance:"neutral", color:"#8b6f47"},
  north: {cn:"北方公国联盟", influence:40, stance:"war", color:"#5a7ba8"},
  south: {cn:"南方商业城邦", influence:45, stance:"neutral", color:"#3a8a8a"},
  elf: {cn:"精灵王国", influence:35, stance:"aloof", color:"#5a9a5a"},
  dwarf: {cn:"矮人王国", influence:35, stance:"neutral", color:"#a86a3a"},
  orc: {cn:"兽人王庭", influence:30, stance:"restless", color:"#8a5a3a"}
};
window.WORLD_STATE_V47 = FORCES;

/* v47inj:timeline-EXTEND */
var TIMELINE = [
    {id:"w_north_fall", force:"north", day:60, title:"铁门关告急", prefixes:["h_faction_north","city_north","pro_choose_north"],
   text:[
     "北边的战报又到了：铁门关外，东军的营帐又多了三座。守军连着打了七天，军旗换了三面。",
     "关里的粮价，一夜之间翻了倍。城门口排队买粮的人，从半夜排到天亮。有人等不及，动了手，被巡城的兵按在地上。",
     "你听说守将亲自上了墙头，三天三夜没下来。他站在城楼上，看着北边，不知道在看什么——也许在看雪，也许在看更远的东西。"]},
    {id:"w_purge_widen", force:"church", day:80, title:"净化令扩大", prefixes:["holy_","church_","city_holy"],
   text:[
     "圣城的净化令又添了新条文。城里开始有人连夜搬家，白袍执事走街串巷，敲门的声音越来越重。",
     "据说有个书商，只因书架上摆了一本旧册子，便被带走了。他的铺子关着，门板上的封条，白得像雪。",
     "酒馆里有人压着嗓子说：“他们查的，不是书，是人心。”说完，那人便走了，连酒钱都没付。"]},
  {id:"w_guild_route", force:"guild", day:100, title:"银穗商路受阻", prefixes:["h_trade_","city_free","south_"],
   text:["银穗商路出了岔子：一队货在峡谷口被人劫了，押货的伙计死了三个。几家大商号连夜改了道。"]},
  {id:"w_orc_south", force:"orc", day:130, title:"兽人南下", prefixes:["h_faction_orc","city_orc","north_"],
   text:["草原上的狼旗往南挪了。边境的村子开始加固围栏，夜里点三堆火，是求援的信号。"]},
  {id:"w_elf_rumor", force:"elf", day:160, title:"银叶城的沉默", prefixes:["h_faction_elf","city_elf"],
   text:["银叶城闭门谢客的消息传到了人类的地界。商人们说，精灵的长老们已经连续三个月没有露面。"]},
  {id:"w_dwarf_forge", force:"dwarf", day:190, title:"铁峰堡的炉火", prefixes:["h_faction_dwarf","city_dwarf"],
   text:["铁峰堡的锻造声停了三天。有人说是矿道塌了，有人说是王座下的那口熔炉，出了古怪。"]},
    {id:"w_seal_loose", force:"watcher", day:220, title:"封印又松了一分", prefixes:["seal_","city_seal"],
   text:[
     "守望者传出的消息：沙漠深处的那道封印，又松了一分。他们加派了人手，可人手总是不够。",
     "守在塔上的人说，最近几个月，夜里常听见地底有响动——像有人，在门的那一边，用指节，一下一下地，敲门。",
     "守望者没有把消息传开。他们说，这种消息，传开了，比封印松动本身，更可怕。"]},
    {id:"w_eclipse_move", force:"eclipse", day:250, title:"暗处的人在动", prefixes:["eclipse_","h_dark_","h_underworld_"],
   text:[
     "地下世界的风声变了。有人看见穿着深色袍子的人，在几个大城的暗巷里走动，像在找什么。",
     "他们在找的东西，没人说得清。有人说是一块石头，有人说是一个名字，有人说——是一个人。",
     "他们不伤人，也不抢东西。他们只是看，记，然后消失。这让城里的人，比见到强盗还要不安。"]},
  {id:"w_north_recap", force:"north", day:280, title:"铁门关的雪", prefixes:["h_faction_north","city_north"],
   text:["铁门关下了今冬第一场雪。守军说，雪落下来的时候，东军退了三十里。没人知道为什么。"]},
  {id:"w_church_split", force:"church", day:310, title:"圣城的分歧", prefixes:["holy_","church_","city_holy"],
   text:["圣城的枢机院起了争执。有人主张继续清剿，有人主张收手。钟声照常响，但敲钟人的手，在抖。"]},
  {id:"w_south_blockade", force:"south", day:340, title:"南方的封锁", prefixes:["south_","h_trade_","city_south"],
   text:["南方城邦封了三个港口。说是查验，可商船在港外排了半个月，也没等到查验的文书。"]},
  {id:"w_guild_warchest", force:"guild", day:370, title:"商会的赌注", prefixes:["h_trade_","city_free"],
   text:["自由商会的金库里，一夜之间调走了一大笔钱。账房先生们讳莫如深，只说是“往北边去”。"]},
  {id:"w_elf_door", force:"elf", day:400, title:"银叶城开门", prefixes:["h_faction_elf","city_elf"],
   text:["银叶城终于开了门。出来的使者只说了一句话：世界树在疼。说完，又关了门。"]},
  {id:"w_dwarf_strike", force:"dwarf", day:430, title:"铁峰堡的锤声", prefixes:["h_faction_dwarf","city_dwarf"],
   text:["铁峰堡的锻造声恢复了，但打的东西换了——全是铠甲和兵器。堡里的老人们，眉头越锁越紧。"]},
    {id:"w_abyss_grow", force:"eclipse", day:460, title:"深渊的影子", prefixes:["seal_","abyss_","city_seal"],
   text:[
     "沙漠边缘的绿洲，一夜之间枯了三口井。老人说，是地下的东西，渴了。",
     "枯井边，有人捡到一块黑亮的碎片，像骨头，又像石头。拾到它的人，当晚做了同一个梦——梦见一扇门，门缝里，有光。",
     "梦醒之后，那人把碎片扔回了井里。他说：“有些东西，不该被带上来。”"]},
];
window.EVENT_TIMELINE_V47 = TIMELINE;

/* v47inj:chronicle-EXTEND */
var CHRONICLE_POOL = [
  {tpl:"这一周，{force}那边不太平。", hint:"消息传到酒馆的时候，已经走了三手，没人敢全信。"},
  {tpl:"{force}的使节进了城。", hint:"他们住的客栈，夜里总有灯亮到很晚。"},
  {tpl:"有人在谈{force}。", hint:"谈的人压低了嗓子，听的人没有说话。"},
  {tpl:"{force}的商路又断了。", hint:"驮队绕了远路，货价涨了一成。"},
  {tpl:"{force}那边出了件怪事。", hint:"说的人讲得有鼻子有眼，听的人只当是闲话。"},
  {tpl:"{force}的军旗换了一面。", hint:"老卒说，旗上的图案，他没见过。"},
  {tpl:"{force}的长老们开了个会。", hint:"会开了一夜，天亮才散，谁也不知道议了什么。"},
  {tpl:"{force}的账本被翻了。", hint:"查账的人从早待到晚，走的时候，脸是白的。"},
  {tpl:"{force}的城门关了一天。", hint:"第二天又开了，好像什么都没发生过。"},
  {tpl:"{force}有人来了又走了。", hint:"来的时候带着风，走的时候，留下一个名字。"}
];
window.CHRONICLE_POOL_V47 = CHRONICLE_POOL;

function v47_initState(){
  if(!S.worldState){
    S.worldState = {influence:{}, stance:{}, flags:{}, lastTick:0, unlocked:true};
    for(var k in FORCES){ S.worldState.influence[k]=FORCES[k].influence; S.worldState.stance[k]=FORCES[k].stance; }
  } else {
    for(var k2 in FORCES){
      if(S.worldState.influence[k2]===undefined) S.worldState.influence[k2]=FORCES[k2].influence;
      if(!S.worldState.stance[k2]) S.worldState.stance[k2]=FORCES[k2].stance;
    }
  }
  if(!S.worldState.flags) S.worldState.flags={};
  if(!S.worldChronicle) S.worldChronicle=[];
  if(!S.arcProgress) S.arcProgress={origin:0,academy:0,seal:0,faction:0};
  if(!S.endingFlags) S.endingFlags={};
  if(!S.endingHistory) S.endingHistory=[];
}

function v47_nowDay(){
  try{ if(S.time && typeof S.time.totalDays==="number") return S.time.totalDays; }catch(e){}
  return S.day||0;
}

function v47_worldTick(){
  try{
    v47_initState();
    var d = v47_nowDay();
    var i, ev, key;
    for(i=0;i<TIMELINE.length;i++){
      ev = TIMELINE[i];
      key = "ev_"+ev.id;
      if(d>=ev.day && !S.worldState.flags[key]){
        S.worldState.flags[key] = true;
        v47_fireEvent(ev);
      }
    }
    if(d>0 && d%7===0 && S.worldState.lastTick!==d){
      S.worldState.lastTick = d;
      v47_weeklyChronicle(d);
    }
    try{ v54_legendTick(); }catch(e){}
  }catch(e){}
}

function v47_fireEvent(ev){
  var onScene = false;
  if(ev.prefixes){
    for(var i=0;i<ev.prefixes.length;i++){
      if(curNode && curNode.indexOf(ev.prefixes[i])===0){ onScene=true; break; }
    }
  }
  var line = ev.text[Math.floor(Math.random()*ev.text.length)];
  if(onScene){
    try{ logMsg("【"+ev.title+"】"+line, "warn"); flashMsg(ev.title); }catch(e){}
  } else {
    try{ v46_maybeMissed(ev.id, line, ev.prefixes); }catch(e){}
  }
  S.worldChronicle.push({day:v47_nowDay(), week:Math.floor(v47_nowDay()/7), title:ev.title, text:line, seen:onScene});
  if(S.worldChronicle.length>40) S.worldChronicle = S.worldChronicle.slice(-40);
}

function v47_weeklyChronicle(d){
  var week = Math.floor(d/7);
  var items = S.worldChronicle.filter(function(c){ return c.week===week && c.title!=="大陆纪事"; });
  var lines = [];
  if(items.length){
    for(var i=0;i<Math.min(items.length,3);i++) lines.push(items[i].title);
  } else {
    var tpl = CHRONICLE_POOL[Math.floor(Math.random()*CHRONICLE_POOL.length)];
    var ks = Object.keys(FORCES);
    var fk = ks[Math.floor(Math.random()*ks.length)];
    lines.push((tpl.tpl||"").replace("{force}",FORCES[fk].cn)+((tpl.hint||"")?" "+tpl.hint:""));
  }
  var text = lines.join("；");
  S.worldChronicle.push({day:d, week:week, title:"第"+week+"周·大陆纪事", text:text, seen:false});
  if(S.worldChronicle.length>40) S.worldChronicle = S.worldChronicle.slice(-40);
}

function worldDelta(force, inf, stance){
  v47_initState();
  if(!FORCES[force]) return null;
  var old = S.worldState.influence[force]||0;
  S.worldState.influence[force] = Math.max(0, Math.min(100, old+(inf||0)));
  if(stance) S.worldState.stance[force] = stance;
  var msg = FORCES[force].cn+"的影响力"+(inf>=0?"上升了":"下降了")+"（"+(Math.round(old))+"→"+Math.round(S.worldState.influence[force])+"）";
  try{ logMsg(msg, inf>=0?"ok":"warn"); }catch(e){}
  return msg;
}
window.worldDelta = worldDelta;

function v47_endingRecord(id){
  try{
    if(!S) return;
    S.endingHistory = S.endingHistory||[];
    if(S.endingHistory.indexOf(id)<0) S.endingHistory.push(id);
    try{
      var lg = JSON.parse(localStorage.getItem("elda-legacy-v2")||"{}");
      lg.endings = lg.endings||{};
      lg.endings[id]=1;
      localStorage.setItem("elda-legacy-v2", JSON.stringify(lg));
    }catch(e){}
  }catch(e){}
}
window.v47_endingRecord = v47_endingRecord;

function v47_endingEpilogue(id){
  v47_initState();
  var parts = [];
  var fh = S.foreshadowing||{};
  var rec = 0, tot = 0;
  for(var k in fh){ tot++; if(fh[k].revealed) rec++; }
  if(tot>0 && rec>=tot*0.7) parts.push("伏笔簿在你怀里，几乎写满了。那些年埋下的线，终于在这一天，收成了网。");
  else if(tot>0 && rec>=tot*0.3) parts.push("伏笔簿还有几页空着。有些答案，你大概永远也不会知道了。");
  else if(tot>0) parts.push("伏笔簿上，大半还是空白。有些事，你听过，见过，却没能追到底。");
  if(S.arcProgress && (S.arcProgress.seal||0)>=3) parts.push("七印之路，你走到了终点。该关的门，你关了。");
  else if(S.arcProgress && (S.arcProgress.faction||0)>=3) parts.push("大陆的棋局，你走到最后，成了执棋的人。");
  var st = S.worldState ? S.worldState.stance : null;
  if(st && st.eclipse==="ally") parts.push("暗蚀会的袍子，你终究穿上了。有些路，走了就不能回头。");
  if(st && st.watcher==="ally") parts.push("守望者的铁牌，在你腰间，和你的心跳一个节拍。");
  /* v47inj:epilogue-EXTEND */
  if(id==="seal" || id==="legend" || id==="hero"){
    if(S.worldState){
      var infl = S.worldState.influence||{};
      var top = null, topv = -1;
      for(var fk in infl){ if(infl[fk]>topv){ topv=infl[fk]; top=fk; } }
      if(top && FORCES[top]) parts.push("你回过头，看见大陆的棋局在身后合拢——影响力最深的那股力量，是"+FORCES[top].cn+"。你曾推过它一把，它也曾推过你。");
    }
    if(S.endingHistory && S.endingHistory.length>1) parts.push("这是你第二次走到这里。路，还是那条路；人，已经不是那个人了。");
    if(S.job && S.ideal) parts.push("你想起自己初入世时的选择："+(IDEALS&&IDEALS[S.ideal]?IDEALS[S.ideal].cn:"你的理想")+"。走到这一天，你总算对得起那个年轻的自己。");
  }
  if(id==="pact" || id==="fell"){
    parts.push("深渊没有赢，你也没有。你只是，和它坐在了同一边——抬头，能看见光；低头，是黑的。");
  }
  return parts.length? parts.join("") : null;
}
window.v47_endingEpilogue = v47_endingEpilogue;

function v47_chronicleBody(){
  try{
    v47_initState();
    var arr = S.worldChronicle||[];
    if(!arr.length) return '<div style="color:var(--text-muted);font-size:13px;padding:10px">世界还很平静。也许，暴风雨前都是这样。</div>';
    var h = '<div style="display:flex;flex-direction:column;gap:8px;padding:4px 2px">';
    for(var i=arr.length-1;i>=0;i--){
      var c = arr[i];
      h += '<div style="background:var(--bg-panel2);border-radius:8px;padding:10px 12px;border-left:3px solid '+(c.seen?'var(--border)':'var(--danger)')+'">';
      h += '<div style="font-size:12px;color:var(--text-gold);font-weight:bold">'+String(c.title||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</div>';
      h += '<div style="font-size:11px;color:var(--text-muted);margin:2px 0 4px">第'+c.day+'日'+(c.seen?' · 你亲眼所见':' · 远方传来的消息')+'</div>';
      h += '<div style="font-size:13px;color:var(--text-primary);line-height:1.6">'+String(c.text||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</div>';
      h += '</div>';
    }
    h += '</div>';
    return h;
  }catch(e){ return '<div style="color:var(--text-muted);font-size:13px">大陆纪事暂不可用。</div>'; }
}
window.v47_chronicleBody = v47_chronicleBody;

function v47_ensureDefaults(){
  try{ v47_initState(); }catch(e){}
}
window.v47_ensureDefaults = v47_ensureDefaults;

try{ if(typeof S!=="undefined" && S) v47_initState(); }catch(e){}
}catch(e){ try{ console.log('v47 init:',e); }catch(_){} }

function v47_rumorCompensation(node){
  try{
    if(!S||!S.worldChronicle||!S.worldChronicle.length) return;
    var id = (node&&node._id)||curNode||"";
    if(id!=="tavern_rumor_generic" && String(id).indexOf("board")<0 && String(id).indexOf("notice")<0 && String(id).indexOf("rumor")<0) return;
    var fresh = [];
    for(var i=0;i<S.worldChronicle.length;i++){
      var c = S.worldChronicle[i];
      if(c.title!=="大陆纪事" && !c.seen) fresh.push(c);
    }
    if(!fresh.length) return;
    var take = fresh.slice(-2);
    var para = "你听邻桌的人又说起——" + take.map(function(c){ return c.title+"（"+c.text+"）"; }).join("；");
    for(var j=0;j<S.worldChronicle.length;j++){
      if(take.indexOf(S.worldChronicle[j])>=0) S.worldChronicle[j].seen=true;
    }
    var el = document.getElementById("story");
    if(el){
      var p = document.createElement("p");
      p.className = "narration";
      p.textContent = para;
      el.appendChild(p);
      el.scrollTop = el.scrollHeight;
    }
  }catch(e){}
}
window.v47_rumorCompensation = v47_rumorCompensation;


/* ---- v47 伏笔回收与弧进度 ---- */
var FORESHADOW_REVEAL_MAP = { /* v47inj:reveal-EXTEND */
};

function v47_autoReveal(nodeId){
  try{
    var fid = FORESHADOW_REVEAL_MAP[nodeId];
    if(fid && S && S.foreshadowing && S.foreshadowing[fid] && !S.foreshadowing[fid].revealed){
      S.foreshadowing[fid].revealed = true;
      try{ logMsg("伏笔回收 · "+FORESHADOWING_V27[fid].name, "ok"); }catch(e){}
    }
  }catch(e){}
}
window.v47_autoReveal = v47_autoReveal;

function revealForeshadowV47(id){
  try{
    if(!S.foreshadowing) return;
    if(S.foreshadowing[id] && !S.foreshadowing[id].revealed){
      S.foreshadowing[id].revealed = true;
      return true;
    }
  }catch(e){}
  return false;
}
window.revealForeshadowV47 = revealForeshadowV47;

var FINAL_FORESHADOWING_V47 = {
  hlj_letter: {name:"黄林晶的信", reveal:[
    "你把那封信又读了一遍。纸角已经磨得起毛，墨迹褪成淡褐色。写信的人那时还不知道，有些话寄出去，就再也收不回来了。",
    "你想起沙漠里那一夜的篝火。有些答案不在信里，在写信的人没写出来的那些空白里。"],
    hint:"压在箱底的那封信"},
  watcher_spy: {name:"守望者密探", reveal:[
    "你想起序章里那道注视的视线。后来你才明白，那道视线不属于任何你认识的人——它属于一座塔。",
    "塔上的人不会说自己是你的朋友。他们只会在你最需要的时候，恰好路过。"],
    hint:"序章里那道视线"},
  eclipse_outer: {name:"暗蚀会外围", reveal:[
    "那个街头的小混混，后来你再没见过。但你记得他腕上的刺青——一片残缺的、黑色的羽毛。",
    "那时你以为那只是街头的记号。直到你在大陆深处，又看见同一片羽毛，纹在另一个人的腕上。"],
    hint:"街头那个混混"},
  seal_omen: {name:"七印征兆", reveal:[
    "那些异常天气、重复的梦、半醒时的幻觉——不是巧合。你后来知道了它们的名字：征兆。",
    "征兆从来不等你准备好。它们只负责出现。"],
    hint:"那些异常的梦"},
  classmate_seed: {name:"同学的种子", reveal:[
    "学院里那个与你同龄的人，后来与你走向了不同的路。但你们在序章里相视的那一眼，埋下了什么。",
    "有些缘分不是线，是种子。埋在土里很多年，你几乎忘了，直到它破土。"],
    hint:"那个同龄人"},
  karma_seed: {name:"因果种子", reveal:[
    "序章里那个不起眼的小选择——帮一个人，或拒绝一个人——你以为它无关紧要。",
    "后来你才明白，因果不挑日子。它只在你最不设防的时候，回来找你。"],
    hint:"那个小选择"},
  primordial_whisper: {name:"原初之物的低语", reveal:[
    "那些偶尔听到的声音，不是幻听。它们来自很深的地方——深过深渊，深过记忆。",
    "你后来在深渊神殿里，又听见了它。这一次，你听清了它说的话。"],
    hint:"偶尔听到的声音"},
  origin_clue: {name:"身世线索", reveal:[
    "母亲的旧物、陌生人注视的视线、档案里那行被水渍模糊的字——它们指向同一个地方。",
    "你终于知道，有些路，从你出生之前，就已经有人替你走过。"],
    hint:"母亲的旧物"},
  prophecy_fragment: {name:"预言碎片", reveal:[
    "那句预言，因出身而异。但无论哪一句，都有一半，你没能听完。",
    "现在你知道了，没听完的那一半，才是真正的预言。"],
    hint:"没听完的预言"},
  seal1_fragment: {name:"第一印碎块", reveal:[
    "你无意识接触过的那块碎片，冰冷，光滑，像一块被磨了千年的骨。",
    "它不记得你。但你的手，记得它的温度。"],
    hint:"那块冰凉的碎片"},
  time_anomaly: {name:"时间异常", reveal:[
    "似曾相识的瞬间，反复出现的场景——你以为是你记错了。",
    "时间不是你记错的那种东西。它有时会裂开一条缝，让人看见不该看见的。"],
    hint:"似曾相识的瞬间"},
  abyss_mark: {name:"深渊标记", reveal:[
    "那件事之后，你身上的印记，颜色深了一分。你试过很多办法，都洗不掉。",
    "后来你不再试图洗掉它。你开始习惯，它成为你的一部分。"],
    hint:"身上的印记"},
  npc_lie: {name:"NPC的谎言", reveal:[
    "那个好心人，对你说过的假话。你后来才想明白，他为什么要骗你——",
    "有些谎言，是为了让你活下去。有些，是为了让别人活。"],
    hint:"那句假话"},
  lost_item: {name:"遗失的物品", reveal:[
    "你丢掉或送掉的那样东西，后来再也没有找回来。你偶尔会想起它。",
    "你后来明白，有些东西，不是丢了，是被命运收走了。"],
    hint:"那样丢失的东西"},
  unspoken_word: {name:"未说出口的话", reveal:[
    "你选择不告诉某个人的那件事，一直卡在你心里。",
    "你现在还是没说。但你已经不后悔没说了——有些话，说了是债，不说，是碑。"],
    hint:"那句没说出口的话"}
};
window.FINAL_FORESHADOWING_V47 = FINAL_FORESHADOWING_V47;

function v47_foreshadowStatus(){
  try{
    var out = {recovered:0, planted:0, total:0};
    for(var k in FINAL_FORESHADOWING_V47){
      out.total++;
      var f = S.foreshadowing && S.foreshadowing[k];
      if(f && f.planted){ out.planted++; if(f.revealed) out.recovered++; }
    }
    return out;
  }catch(e){ return {recovered:0, planted:0, total:15}; }
}
window.v47_foreshadowStatus = v47_foreshadowStatus;

function v47_arcProgressCalc(){
  try{
    if(!S.arcProgress) S.arcProgress={origin:0,academy:0,seal:0,faction:0};
    var o = 0;
    if(S.originPrologue && S.originPrologue.choices) o = Math.min(3, Math.max(1, Math.ceil(S.originPrologue.choices.length/2)));
    var a = 0;
    if(S.flags && (S.flags.academy_grad || S.flags.graduated)) a = 3;
    else if(S.realm>=3) a = 2;
    else if(S.job) a = 1;
    var sl = 0;
    var sf = S.flags||{};
    if(sf.seal_great||sf.seal_success) sl = 3;
    else if(sf.seal7||sf.seal_7) sl = 2;
    else if(sf.seal1||sf.seal_1||sf.seal) sl = 1;
    var fa = 0;
    var total = 0;
    var infl = S.infl||{};
    for(var k in infl) total += infl[k];
    if(total>=80) fa = 3;
    else if(total>=40) fa = 2;
    else if(total>0) fa = 1;
    S.arcProgress = {origin:o, academy:a, seal:sl, faction:fa};
    return S.arcProgress;
  }catch(e){ return S.arcProgress||{origin:0,academy:0,seal:0,faction:0}; }
}
window.v47_arcProgressCalc = v47_arcProgressCalc;

function v47_ledgerLines(){
  try{
    v47_foreshadowStatus();
    var lines = [];
    var fs = v47_foreshadowStatus();
    lines.push("你翻开那本旧簿子。封面磨得发亮，边角卷起，像被人翻过很多遍——也像被人忘记过很多年。");
    if(fs.planted===0){
      lines.push("簿子上，大半是空白。你这一路，走得匆忙，还没来得及在命运里，留下几笔。");
    } else {
      var undone = [];
      var done = [];
      for(var k in FINAL_FORESHADOWING_V47){
        var f = S.foreshadowing && S.foreshadowing[k];
        if(!f || !f.planted) continue;
        var entry = FINAL_FORESHADOWING_V47[k];
        if(f.revealed) done.push(entry.name);
        else undone.push(entry.hint);
      }
      if(undone.length){
        lines.push("还没解开的，还有这些——"+undone.join("、")+"。");
        lines.push("你盯着那些名字，像盯着一排没有点亮的灯。你知道，有些灯，再不点，就永远暗下去了。");
      }
      if(done.length){
        lines.push("已经解开的，有"+done.length+"件——"+done.join("、")+"。你翻到那些页，笔迹已经干了，但字还是热的。");
      }
    }
    return lines;
  }catch(e){ return ["伏笔簿在手里，有些沉。"]; }
}
window.v47_ledgerLines = v47_ledgerLines;

function v47_ledgerRecallAll(){
  try{
    var el = document.getElementById("story");
    if(!el) return;
    var p = document.createElement("p");
    p.className = "narration";
    p.textContent = "你一页一页，慢慢回想——";
    el.appendChild(p);
    for(var k in FINAL_FORESHADOWING_V47){
      var f = S.foreshadowing && S.foreshadowing[k];
      if(!f || !f.planted || f.revealed) continue;
      var entry = FINAL_FORESHADOWING_V47[k];
      S.foreshadowing[k].revealed = true;
      for(var j=0;j<entry.reveal.length;j++){
        var pj = document.createElement("p");
        pj.className = "clue";
        pj.textContent = entry.reveal[j];
        el.appendChild(pj);
      }
    }
    var st = v47_foreshadowStatus();
    var p2 = document.createElement("p");
    p2.className = "narration";
    p2.textContent = st.recovered+"/"+st.total+" 件伏笔，在这本簿子上，有了着落。剩下的，你带进了结局——有些答案，也许要等到很久以后，才会有人知道。";
    el.appendChild(p2);
    el.scrollTop = el.scrollHeight;
  }catch(e){}
}
window.v47_ledgerRecallAll = v47_ledgerRecallAll;

function v47_arcLines(){
  try{
    var ap = v47_arcProgressCalc();
    var cn = {origin:"出身之路", academy:"学院岁月", seal:"封印之旅", faction:"大陆棋局"};
    var lines = ["决战前夜，你独自坐在篝火边。火光照着你的脸，也照着地图上那些你走过的路。"];
    var sum = ap.origin+ap.academy+ap.seal+ap.faction;
    for(var k in ap){
      var v = ap[k];
      var st = v===0?"尚未开始":(v===1?"初窥门径":(v===2?"渐入深水":"已至终局"));
      lines.push(cn[k]+"："+st);
    }
    if(sum>=9) lines.push("四段路，你走得完整。火堆里的柴，烧得正旺。你觉得自己，准备好了。");
    else if(sum>=5) lines.push("你走完了大部分路。还有些地方，你没能走到头——但火堆旁的风，已经带了你要的方向。");
    else lines.push("你的路，走得有些散。但火堆还在，你也还在。明天的事，明天再说。");
    return lines;
  }catch(e){ return ["决战前夜，篝火噼啪作响。"]; }
}
window.v47_arcLines = v47_arcLines;

/* v47inj:export-fix */
window.v47_initState = v47_initState;
window.v47_worldTick = v47_worldTick;
window.v47_fireEvent = v47_fireEvent;
window.v47_weeklyChronicle = v47_weeklyChronicle;
window.v47_nowDay = v47_nowDay;

})();
/*=====v47-eng-end=====*/
/*=====v48-eng=====*/
/* v48 晋升叙事工程 · 框架层
   内容表全部留空占位，后续批次按 /v48inj:/ marker 填充。
   权威数据源：现有 JOBS 结构（titles/mats/books/ritual/vow/criterion/anchor）+ REALMS。 */
(function(){
  // ---------- 内容表（留空占位，待补） ----------
  // 发现路径：5 类。content 待补（节点ID/触发条件/叙事文本）
  const V48_KNOW_PATHS = {
    sense:  {id:"sense",  label:"体内感应",  trigger:null, node:null, content:null}, // /v48inj:know-sense/
    mentor: {id:"mentor", label:"师承点拨",  trigger:null, node:null, content:null}, // /v48inj:know-mentor/
    book:   {id:"book",   label:"典籍占卜",  trigger:null, node:null, content:null}, // /v48inj:know-book/
    dream:  {id:"dream",  label:"梦境异象",  trigger:null, node:null, content:null}, // /v48inj:know-dream/
    battle: {id:"battle", label:"生死逼发",  trigger:null, node:null, content:null}  // /v48inj:know-battle/
  };
  // 仪式扩展表：{job:{stage:{name,requirements,location,timing,test}}} 留空
  const V48_RITUAL_EXT = {}; // /v48inj:ritual/
  // 危机库：[{id,type,trigger,stages,weight}] 留空
  const V48_CRISIS_POOL = []; // /v48inj:crisis/
  // 职业烙印表：{job:{stage:{mark,tendency,effects}}} 留空
  const V48_MARKS = {}; // /v48inj:marks/
  // 人格考验事件表：{job:[{stage,node}]} 留空
  const V48_PERSONA_OATHS = {}; // /v48inj:oaths/
  // 护法者候选表：{npcId:bonus} 留空
  const V48_PROTECTORS = {}; // /v48inj:protectors/

  // ---------- S 字段初始化 ----------
  function v48_initState(){
    if(!S) return;
    if(!S.breakthrough) S.breakthrough = {bottleneck:null, knowPath:null, prep:{materials:[], ritual:null, timing:null}, stage:"idle", result:null, uneven:false};
    if(!S.careerMark) S.careerMark = {marks:[], resistance:50, bond:0, state:"free"};
    if(!S.persona) S.persona = {oath:null, memories:[]};
    if(S.unevenStep===undefined) S.unevenStep = null;
    if(S.protector===undefined) S.protector = null;
    if(!S.weakness) S.weakness = {active:false, days:0};
  }
  window.v48_initState = v48_initState;
  function v48_ensureDefaults(){ v48_initState(); if(typeof v488_ensureDefaults==="function"){ try{ v488_ensureDefaults(); }catch(e){} } }
  window.v48_ensureDefaults = v48_ensureDefaults;

  // ---------- 瓶颈检测（框架） ----------
  function v48_checkBottleneck(){
    try{
      if(!S||!S.job) return {blocked:false, missing:[], realm:S?S.realm:0};
      const next = S.realm+1;
      if(next>=REALMS.length) return {blocked:false, missing:[], realm:S.realm, top:true};
      const need = REALMS[next].xp;
      if((S.exp||0) < need) return {blocked:false, missing:[], realm:S.realm, need:need, exp:S.exp||0};
      const j = JOBS[S.job];
      const missing = [];
      if(!V48_KNOW_PATHS.sense.node && !V48_KNOW_PATHS.mentor.node && !V48_KNOW_PATHS.book.node && !V48_KNOW_PATHS.dream.node && !V48_KNOW_PATHS.battle.node){
        missing.push("晋升契机（待 v48 内容注入）");
      }
      if(!v48_ritualFor(S.job, S.realm)) missing.push("仪式（待定）");
      return {blocked:true, missing:missing, realm:S.realm, next:next, nextCn:REALMS[next].cn, job:j.cn||S.job};
    }catch(e){ return {blocked:false, missing:[], error:e.message}; }
  }
  window.v48_checkBottleneck = v48_checkBottleneck;

  // ---------- 仪式（框架：扩展表优先，回退 JOBS.ritual） ----------
  function v48_ritualFor(job, stage){
    try{
      const j = JOBS[job];
      if(V48_RITUAL_EXT[job] && V48_RITUAL_EXT[job][stage]) return V48_RITUAL_EXT[job][stage];
      if(j && j.ritual) return {name:"本职业晋升仪式", requirements:[], location:null, timing:null, test:j.ritual, base:true};
      return null;
    }catch(e){ return null; }
  }
  window.v48_ritualFor = v48_ritualFor;

  // ---------- 危机（框架：空池返回 null） ----------
  function v48_crisisRoll(){
    try{
      if(!V48_CRISIS_POOL.length) return null;
      const total = V48_CRISIS_POOL.reduce((s,c)=>s+(c.weight||1),0);
      let r = Math.random()*total;
      for(const c of V48_CRISIS_POOL){ r-=(c.weight||1); if(r<=0) return c; }
      return V48_CRISIS_POOL[0];
    }catch(e){ return null; }
  }
  window.v48_crisisRoll = v48_crisisRoll;

  // ---------- 职业烙印（框架：空表返回 null） ----------
  function v48_markAt(job, stage){
    try{
      const m = V48_MARKS[job] && V48_MARKS[job][stage];
      return m || null;
    }catch(e){ return null; }
  }
  window.v48_markAt = v48_markAt;

  // ---------- 人格拉锯（框架） ----------
  function v48_personaGauge(){
    try{
      if(!S.careerMark) return {resistance:50, bond:0, state:"free"};
      const r = S.careerMark.resistance||50, b = S.careerMark.bond||0;
      let state = "free";
      if(b >= 100) state = "engulfed";
      else if(b >= 70) state = "strained";
      else if(r >= 80) state = "steadfast";
      return {resistance:r, bond:b, state:state};
    }catch(e){ return {resistance:50, bond:0, state:"free"}; }
  }
  window.v48_personaGauge = v48_personaGauge;

  // 人格对决结算框架（choice: accept/resist/tame）
  function v48_personaResolve(choice){
    try{
      const g = S.careerMark || (S.careerMark={marks:[],resistance:50,bond:0,state:"free"});
      const deltas = {accept:{resistance:-8, bond:15}, resist:{resistance:10, bond:-5}, tame:{resistance:5, bond:5}};
      const d = deltas[choice] || {resistance:0, bond:0};
      g.resistance = Math.max(0, Math.min(100, (g.resistance||50)+d.resistance));
      g.bond = Math.max(0, Math.min(100, (g.bond||0)+d.bond));
      g.state = v48_personaGauge().state;
      return {choice:choice, applied:d, gauge:v48_personaGauge()};
    }catch(e){ return {choice:choice, error:e.message}; }
  }
  window.v48_personaResolve = v48_personaResolve;

  // ---------- 未竟之阶（生死逼发隐患，框架） ----------
  function v48_unevenStepCheck(){
    try{ return S.unevenStep || null; }catch(e){ return null; }
  }
  window.v48_unevenStepCheck = v48_unevenStepCheck;

  // ---------- 护法者（框架：读 S.protector） ----------
  function v48_protectorBonus(){
    try{
      if(!S.protector) return {bonus:0, protector:null};
      const b = V48_PROTECTORS[S.protector];
      return {bonus: b||5, protector:S.protector};
    }catch(e){ return {bonus:0, protector:null}; }
  }
  window.v48_protectorBonus = v48_protectorBonus;

  // ---------- 虚弱期状态机（advanceTime 挂钩） ----------
  function v48_weaknessTick(){
    try{
      if(!S || !S.weakness || !S.weakness.active) return;
      S.weakness.days = (S.weakness.days||1) - 1;
      if(S.weakness.days <= 0){ S.weakness.active = false; S.weakness.days = 0; }
    }catch(e){}
  }
  window.v48_weaknessTick = v48_weaknessTick;

  // ---------- 烙印选项染色器（框架：空表 no-op） ----------
  function v48_applyMarkToOptions(opts){
    try{
      if(!opts || !Array.isArray(opts)) return opts;
      const mark = v48_markAt(S.job, S.realm);
      if(!mark || !mark.tendency) return opts;
      return opts; // 内容注入后在此按 mark.tendency 染色 /v48inj:mark-opts/
    }catch(e){ return opts; }
  }
  window.v48_applyMarkToOptions = v48_applyMarkToOptions;

  // ---------- 修炼面板瓶颈行（框架：无瓶颈返回空串） ----------
  function v48PanelLine(){
    try{
      const b = v48_checkBottleneck();
      if(!b.blocked) return "";
      let s = "<div class='row' style='color:#b8860b'><span>◆晋升契机</span><b>已至瓶颈</b></div>";
      if(b.missing && b.missing.length) s += "<div class='mini'>缺："+b.missing.join("、")+"</div>";
      const rit = v48_ritualFor(S.job,S.realm);
      s += "<div class='mini'>目标："+b.nextCn+" · 仪式："+(rit?(rit.name||"待定"):"待定")+"</div>";
      return s;
    }catch(e){ return ""; }
  }
  window.v48PanelLine = v48PanelLine;

  // ---------- 五幕状态机路由（框架：内容未接时返回 idle 提示） ----------
  function v48_breakthroughStage(){
    try{
      if(!S) return {stage:"idle"};
      const st = S.breakthrough && S.breakthrough.stage ? S.breakthrough.stage : "idle";
      if(st!=="idle" && !S.breakthrough.knowPath){ return {stage:"stub", note:"v48 内容未注入，维持原突破流程"}; }
      return {stage:st};
    }catch(e){ return {stage:"idle"}; }
  }
  window.v48_breakthroughStage = v48_breakthroughStage;
})();

/*=====v488-eng=====*/
(function(){
  "use strict";
  var SUBSYSTEM_V48 = {
    deity: {"魔法师":"奥术之主","灵魂法师":"晨曦","术士":"锻造之神","战士":"战神",
            "骑士":"誓约之神","游侠":"荒野之神","盗贼":"隐秘之主","牧师":"太阳神·圣辉","商人":"财富之神·金衡"},
    general: {
      "魔法师":[{id:"elemental",cn:"元素使",note:"塑能爆发"},{id:"conjurer",cn:"咒法者",note:"召唤空间"},{id:"arcane",cn:"秘法学者",note:"结界附魔"},{id:"necromancer",cn:"死灵学徒",note:"禁忌·亡灵"}],
      "灵魂法师":[{id:"medium",cn:"通灵者",note:"灵界沟通"},{id:"hypnotist",cn:"催眠师",note:"精神操控"},{id:"soulbinder",cn:"缚魂者",note:"灵魂契约"}],
      "术士":[{id:"alchemist",cn:"炼金术士",note:"药剂转化·经典"},{id:"forger",cn:"锻造师",note:"神兵利器"},{id:"machinist",cn:"魔械师",note:"机关构装"},{id:"bloodsorcerer",cn:"血脉术士",note:"本源共鸣"}],
      "战士":[{id:"berserker",cn:"狂战士",note:"狂怒爆发"},{id:"weaponmaster",cn:"武器大师",note:"技巧流"},{id:"shieldguard",cn:"盾卫",note:"阵线防御"},{id:"warlord",cn:"战将",note:"军略指挥"}],
      "骑士":[{id:"paladin",cn:"圣武士",note:"圣光斩击·克亡灵"},{id:"protector",cn:"护教骑士",note:"圣盾守护"},{id:"itinerant",cn:"巡游骑士",note:"机动审判"},{id:"darkknight",cn:"黑骑士",note:"堕誓·隐藏"}],
      "游侠":[{id:"hunter",cn:"猎人",note:"追猎陷阱"},{id:"warden",cn:"巡林者",note:"荒野守护"},{id:"scout",cn:"哨探",note:"斥候箭术"},{id:"beastfriend",cn:"兽语者",note:"自然同伴"}],
      "盗贼":[{id:"assassin",cn:"刺客",note:"潜行必杀"},{id:"burglar",cn:"夜盗",note:"机关销赃"},{id:"spy",cn:"密探",note:"伪装情报"},{id:"faceless",cn:"无面者",note:"身份窃取"}],
      "牧师":[{id:"healer",cn:"治疗师",note:"圣愈净化"},{id:"inquisitor",cn:"审判官",note:"圣裁异端"},{id:"warpriest",cn:"圣战士",note:"战牧双修"},{id:"ascetic",cn:"苦修者",note:"献身神恩"}],
      "商人":[{id:"merchant",cn:"商贾",note:"贸易套利"},{id:"banker",cn:"钱庄主",note:"金融操控"},{id:"auctioneer",cn:"拍卖师",note:"人脉声望"},{id:"smuggler",cn:"走私者",note:"灰色暗线"}]
    },
    raceSubs: {
      "elf":   [{sub:"木精灵",note:"森林之民·自然变形",subs:{"魔法师":"德鲁伊","游侠":"德鲁伊","术士":"德鲁伊"}},
                {sub:"银精灵",note:"月下贵族·月光奥术",subs:{"魔法师":"月咏者"}},
                {sub:"暗精灵",note:"地下流放·阴影灵魂",subs:{"盗贼":"暗影织者","灵魂法师":"暗影织者"}}],
      "orc":   [{sub:"草原兽人",note:"先祖图腾·元素精神",subs:{"牧师":"萨满"}},
                {sub:"黑兽人",note:"深渊淬体·狂暴",subs:{"战士":"黑兽人"}},
                {sub:"霜狼兽人",note:"驯狼·冰原追踪",subs:{"游侠":"霜狼猎手"}}],
      "dwarf": [{sub:"铁峰矮人",note:"符文刻印·古符文术",subs:{"术士":"符文工匠"}},
                {sub:"山丘矮人",note:"战锤·大地之力",subs:{"战士":"山丘之王"}},
                {sub:"深地矮人",note:"地下·古遗迹",subs:{"盗贼":"深地寻宝者"}}],
      "human": [{sub:"北境人",note:"冰战·寒冷抗性",subs:{"战士":"霜卫"}},
                {sub:"中境人",note:"博学奥术",subs:{"魔法师":"贤者"}},
                {sub:"南境人",note:"远洋贸易",subs:{"商人":"海上商王"}},
                {sub:"东境人",note:"东境工坊·巧械",subs:{"术士":"机关师"}},
                {sub:"西境人",note:"航海斥候",subs:{"游侠":"远航者"}}],
      "halfling":[{sub:"半身人",note:"好运·骗术",subs:{"盗贼":"幸运骗术师"}}],
      "dragon":[{sub:"龙裔",note:"龙血术士·吐息",subs:{"术士":"龙语者","战士":"龙鳞战士"}}],
      "half":  [{sub:"混血",note:"血脉杂糅·可双修",subs:{"*":"无常者"}}]
    },
    abyss: {"魔法师":"深渊术士","灵魂法师":"深渊缚魂者","术士":"亵渎造物师","战士":"血魔战士",
            "骑士":"黑骑士","游侠":"堕落猎手","盗贼":"深渊刺客","牧师":"腐化祭司","商人":"黑市主"},
    abyssRaces: {"elf":"腐化木精灵","dwarf":"深渊矿奴","orc":"深渊狂兽","dragon":"深渊腐鳞",
                 "halfling":"厄运窃贼","human":"堕心者","half":"蚀魂者"}
  };
  window.SUBSYSTEM_V48 = SUBSYSTEM_V48;

  function v488_ensureDefaults(){
    try{
      if(!S) return;
      if(S.job==="炼金术师") S.job="术士";
      if(S.sub==="炼金术师") S.sub="术士";
      if(S.path===undefined) S.path="generalist";
      if(S.subclass===undefined) S.subclass=null;
      if(S.subclassCn===undefined) S.subclassCn="";
      if(S.raceSub===undefined) S.raceSub=null;
      if(S.corruption===undefined) S.corruption=0;
      if(S.abyssPath===undefined) S.abyssPath=null;
      if(S.deity===undefined){ S.deity=(SUBSYSTEM_V48.deity&&SUBSYSTEM_V48.deity[S.job])||""; }
    }catch(e){}
  }
  window.v488_ensureDefaults = v488_ensureDefaults;

  function v488_raceSubOptions(){
    try{
      if(!S||!S.job) return [];
      var key = S.race || "";
      var list = SUBSYSTEM_V48.raceSubs[key] || [];
      var out = [];
      for(var i=0;i<list.length;i++){
        var item = list[i];
        var m = item.subs[S.job] || item.subs["*"];
        if(m) out.push({sub:item.sub, cls:m, note:item.note||""});
      }
      return out;
    }catch(e){ return []; }
  }
  window.v488_raceSubOptions = v488_raceSubOptions;

  function v488_abyssTempt(){
    try{
      if(!S||!S.job) return null;
      var cn = SUBSYSTEM_V48.abyss[S.job];
      if(!cn) return null;
      return {id:"abyss_"+S.job, cn:cn, corruption:(S.corruption||0), need:60};
    }catch(e){ return null; }
  }
  window.v488_abyssTempt = v488_abyssTempt;

  function v488_deityLine(){
    try{
      if(!S) return null;
      var d = SUBSYSTEM_V48.deity[S.job] || "";
      if(S.path==="specialist") return {deity:d, mode:"specialist", text:"专精路线：分支通神者（如黑骑士→深渊之主）可另辟神座"};
      return {deity:d, mode:"generalist", text:"全能路线：神话境时大可能继承「"+d+"」的神位"};
    }catch(e){ return null; }
  }
  window.v488_deityLine = v488_deityLine;

  function v488_pathApply(p){
    try{
      if(!S) return;
      S.path = p;
      if(p==="generalist"){ S.subclass=null; S.subclassCn=""; }
      if(window.flashMsg) try{ flashMsg(p==="specialist"?"已选择专精路线（可继续选择方向）":"已选择全能路线·神性线"); }catch(e){}
    }catch(e){}
  }
  window.v488_pathApply = v488_pathApply;

  function v488_pickSub(id, cn){
    try{
      if(!S) return;
      S.path = "specialist"; S.subclass = id; S.subclassCn = cn;
      if(id.indexOf("race_")===0) S.raceSub = id.slice(5);
      if(id.indexOf("abyss_")===0){ S.abyssPath = id; S.corruption = Math.max(S.corruption||0, 60); }
      if(window.flashMsg) try{ flashMsg("已专精："+cn); }catch(e){}
    }catch(e){}
  }
  window.v488_pickSub = v488_pickSub;

  
var JOBKEY_V488 = {"魔法师":"mage","灵魂法师":"soul","术士":"sor","战士":"war","骑士":"knight","游侠":"ranger","盗贼":"thief","牧师":"priest","商人":"merch"};
window.JOBKEY_V488 = JOBKEY_V488;

function v488_go(id){
  try{
    if(!N[id]){ if(window.flashMsg) try{ flashMsg("这段路尚未铺好（"+id+"）"); }catch(e){} return; }
    // 仪式材料检查（req 字段）：未完成过该节点时校验材料
    try{
      var _nd = N[id];
      if(_nd && typeof _nd==="function"){
        var _n0 = _nd();
        if(_n0 && _n0.req && S && S.mats){
          var _fk0 = "v489_consume_"+id;
          if(!S.flags[_fk0]){
            var _rm = _n0.req.mat, _rn = _n0.req.n||1;
            if((S.mats[_rm]||0) < _rn){
              var _gid = id.slice(0,-2)+"_g";
              if(N[_gid]){
                if(typeof curNode!=="undefined"){ S.choices.push(curNode); curNode = _gid; }
                if(typeof renderTop==="function") try{ renderTop(); }catch(e){}
                if(typeof renderStats==="function") try{ renderStats(); }catch(e){}
                if(typeof writeNext==="function"){ writeNext(_gid); return; }
              }
              return;
            }
            S.mats[_rm] = Math.max(0,(S.mats[_rm]||0)-_rn);
            S.flags[_fk0] = true;
            if(typeof writePar==="function"){ try{ writePar("你取出"+_rm+"，开始仪式。","v48-req"); }catch(e){} }
          }
        }
      }
    }catch(e){}
    // 节点级 effect 一次性结算（幂等：flag 防重复）
    try{
      var _nd = N[id];
      if(_nd && typeof _nd==="function"){
        var _n0 = _nd();
        if(_n0 && _n0.effect && S && S.flags){
          var _fk = "v489_done_"+id;
          if(!S.flags[_fk]){
            var _r = (typeof applyEffects==="function") ? applyEffects(_n0.effect) : null;
            if(_r && typeof writePar==="function"){ try{ writePar(_r,"res"); }catch(e){} }
            S.flags[_fk] = true;
          }
        }
      }
    }catch(e){}
    if(typeof curNode!=="undefined"){ S.choices.push(curNode); curNode = id; }
    if(typeof renderTop==="function") try{ renderTop(); }catch(e){}
    if(typeof renderStats==="function") try{ renderStats(); }catch(e){}
    if(typeof writeNext==="function"){ writeNext(id); return; }
    if(window.flashMsg) try{ flashMsg("已前往："+id); }catch(e){}
  }catch(e){}
}
window.v488_go = v488_go;

function v488Panel(){
  try{
    if(!S||!S.job) return "";
    var d = SUBSYSTEM_V48.deity[S.job] || "";
    var pathTxt = (S.path==="specialist"&&S.subclassCn)?("专精·"+S.subclassCn):"全能·主职业";
    var cor = (S.corruption||0)>50 ? " <span style='color:#c0392b'>深渊侵蚀 "+S.corruption+"</span>" : "";
    var jk = JOBKEY_V488[S.job] || "misc";
    var h = "<div class='row' style='margin-top:6px'><span style='color:#b8860b'>◆职业之路</span><b>"+pathTxt+"</b> <span class='mini'>主神："+(d||"待定")+"</span>"+cor+"</div>";
    if(S.subclass && S.subclassCn){
      h += "<button class='btn' style='margin-top:4px' onclick='v488_go(\"sub_"+S.subclass+"_0\")'>分支传记 · "+S.subclassCn+"</button> ";
    }
    if(S.path!=="specialist"){
      h += "<button class='btn' style='margin-top:4px' onclick='v488_go(\"deity_"+jk+"_0\")'>本源感应 · 神性线</button> ";
    }
    h += "<button class='btn' style='margin-top:4px' onclick='openPathChoice()'>职业之路 · 路径与转职</button>";
    return h;
  }catch(e){ return ""; }
}
window.v488Panel = v488Panel;


  function openPathChoice(){
    try{
      if(!S) return;
      var job=S.job||""; var d=SUBSYSTEM_V48.deity[job]||"";
      var gen=SUBSYSTEM_V48.general[job]||[];
      var h="<div class='panel-wrap' id='v488-panel' style='max-height:85vh;overflow:auto;background:var(--bg-panel,#152238);border:1px solid var(--border,#2d4566);border-radius:10px'>";
      h+="<div style='padding:12px 16px;border-bottom:1px solid var(--border,#2d4566)'><b style='color:var(--text-gold,#e8c468)'>◆ 职业之路</b><button style='float:right;border:1px solid var(--border,#2d4566);border-radius:6px;background:none;color:#e8eef5;width:32px;height:32px;cursor:pointer' onclick='closePathChoice()'>✕</button></div>";
      h+="<div style='padding:16px;color:#e8eef5'>";
      h+="<div class='mini' style='color:var(--text-gold,#e8c468)'>主神："+d+"</div>";
      h+="<div style='margin-top:10px'><b>选择路径（一生一次）</b>";
      h+="<label style='display:block;padding:6px;border:1px solid var(--border,#2d4566);border-radius:6px;margin:4px 0'><input type='radio' name='v488path' value='generalist' "+(S.path!=="specialist"?"checked":"")+" onchange='v488_pathApply(\"generalist\")'> 全能路线 · 专修主职业（神性线：神话境时大可能继承神位）</label>";
      h+="<label style='display:block;padding:6px;border:1px solid var(--border,#2d4566);border-radius:6px;margin:4px 0'><input type='radio' name='v488path' value='specialist' "+(S.path==="specialist"?"checked":"")+" onchange='v488_pathApply(\"specialist\")'> 专精路线 · 选一方向深度专修</label></div>";
      h+="<div style='margin-top:10px'><b>专精方向（"+job+"）</b>";
      for(var i=0;i<gen.length;i++){ var g=gen[i];
        h+="<div style='padding:6px;border:1px solid var(--border,#2d4566);border-radius:6px;margin:4px 0'><b>"+g.cn+"</b> <span class='mini'>"+g.note+"</span> <button class='btn' style='float:right' onclick='v488_pickSub(\""+g.id+"\",\""+g.cn+"\")'>专精</button></div>";
      }
      h+="</div>";
      var rs=v488_raceSubOptions();
      if(rs&&rs.length){ h+="<div style='margin-top:10px'><b>种族专属转职</b>";
        for(var j=0;j<rs.length;j++){ h+="<div style='padding:6px;border:1px solid var(--border);border-radius:6px;margin:4px 0;background:rgba(139,111,71,.08)'><b>"+rs[j].sub+" → "+rs[j].cls+"</b> <span class='mini'>"+rs[j].note+"</span> <button class='btn' style='float:right' onclick='v488_pickSub(\"race_"+rs[j].sub+"\",\""+rs[j].cls+"\")'>转职</button></div>"; }
        h+="</div>"; }
      var at=v488_abyssTempt();
      h+="<div style='margin-top:10px'><b>深渊侵蚀："+(S.corruption||0)+"</b>";
      if(at&&(S.corruption||0)>=60){ h+="<div style='padding:6px;border:1px solid #c0392b;border-radius:6px;margin:4px 0;color:#c0392b'>深渊在低语：可转「"+at.cn+"」<button class='btn' style='float:right' onclick='v488_pickSub(\"abyss_"+S.job+"\",\""+at.cn+"\")'>堕落</button></div>"; }
      else if(at){ h+="<div class='mini'>深渊低语渐近（侵蚀 ≥ 60 时觉醒）</div>"; }
      else { h+="<div class='mini'>尚未听闻深渊的低语</div>"; }
      h+="</div>";
      var dl=v488_deityLine();
      h+="<div style='margin-top:10px'><b>神性线</b><div class='mini'>"+(dl?dl.text:"")+"</div></div>";
      h+="</div><div style='padding:12px;border-top:1px solid var(--border,#2d4566);text-align:right'><button class='btn' onclick='closePathChoice()'>返回游戏</button></div></div>";
      var old=document.getElementById('v488-panel');
      if(old&&old.parentNode) old.parentNode.removeChild(old);
      document.body.insertAdjacentHTML('beforeend', h);
    }catch(e){ if(typeof ErrorLog!=='undefined'&&ErrorLog&&ErrorLog.record) try{ ErrorLog.record(e); }catch(e2){} }
  }
  window.openPathChoice = openPathChoice;

  function closePathChoice(){
    try{ var el=document.getElementById('v488-panel'); if(el&&el.parentNode) el.parentNode.removeChild(el); }catch(e){}
  }
  window.closePathChoice = closePathChoice;
})();


/*v489inj:sub1*/
N["sub_elemental_0"]=function(){return{
place:"元素实验室 · 风炉间",
text:[
"风炉间里只有一盏油灯，灯芯结了个小小的痂。",
"你按导师的吩咐往炉里添第三把火晶粉，指尖刚碰到坩埚边缘，炉膛里那团火忽然矮下去——不是灭，是缩成一粒黄豆大的光点，安安静静地悬着。",
"你听见自己的心跳。那粒光点也跳，和你的心跳一个节拍。",
"导师坐在门槛上，叼着烟斗，半晌没说话。烟斗里的火星明灭了一下，他才开口：“元素这东西，讲缘分的。”",
"他顿了顿，“有人学一辈子，火是火，水是水。有人伸手一抓，火就是他自己。”",
"你没有接话。那粒光点还在跳，像一盏等你认领的灯。",
"窗外起风了，吹得窗纸哗哗响。你忽然觉得，那不是风——是墙外整条河的水在应你。", "别过风炉间，你沿官道走出里许，回头已看不清来处。"],pace:"normal",
options:[{t:"伸手，接住那粒光点", go:"sub_elemental_1"},
{t:"退后一步，把炉膛合上", go:"sub_path_hub"}]}};

N["sub_conjurer_0"]=function(){return{
place:"禁书区 · 走廊尽头",
text:[
"禁书区第七排书架后面，有一扇平时没人注意的小门。门锁是铜的，锈成了绿色。",
"你路过时，门缝里漏出一线风。风里有雨味，还有一点烤面包的焦香——这两种味道不该同时出现在走廊里。",
"你伸手推了一下。门没动。可你的影子在油灯下晃了晃，多出了一只手，先你一步按在门板上。",
"你猛地回头。身后没人。",
"影子里的那只手收回去了。门缝里的风也停了，只剩烤面包的焦香还在，贴着你的鼻尖绕。",
"管理员老妪在走廊那头咳嗽了一声：“那边的，别站着。”",
"你迈步走开，走了三步，又忍不住回头。门还是那扇门，锈锁还是那把锈锁。",
"只有你知道，刚才那扇门，是活的。"
],pace:"normal",
options:[{t:"记住这扇门的位置", go:"sub_conjurer_1"},
{t:"当做什么都没发生", go:"sub_path_hub"}]}};

N["sub_arcane_0"]=function(){return{
place:"学院地窖 · 旧档案馆",
text:[
"档案馆最里面有一排铁柜，柜门贴着褪色的封条，年份栏写着“圣历1142”。",
"你在整理旧卷宗时，指腹蹭过其中一张封条。纸已经脆了，碎了一角，露出下面一行字：“凡记录者，须以血为墨。”",
"你愣了愣。那行字的墨迹是暗红的，边缘泛着金。你凑近闻了闻——没有血腥味，倒像是混了松脂的旧漆。",
"身后有人咳了一声。是档案馆的老馆员，他抱着一个木匣子，站在阴影里，不知道看了你多久。",
"“那柜子别动，”他说，“里面的东西，不认生人。”",
"你退开半步。封条又落回去，把那行字盖住了。",
"可你已经看见了。而且你确定——那行字，刚才在你读它的时候，笔画动了一下。", "你收拾停当，离开旧档案馆，沿着来路踏上行程。"],pace:"normal",
options:[{t:"趁夜色再来一趟", go:"sub_arcane_1"},
{t:"把这件事记在日记里", go:"sub_path_hub"}]}};

N["sub_necromancer_0"]=function(){return{
place:"学院后山 · 老坟场",
text:[
"后山的坟场不大，二十三座坟，最大的一座是建校初期的院长。",
"你傍晚路过，看见坟场角落的野蔷薇开了一朵。不是季节——霜降都过了，那花苞却鼓鼓的，像憋着一口气。",
"你蹲下去看。花根底下露出一截骨白色的东西，是半根笛子。笛身裂了，用银线缠着，缠法很老。",
"你捡起来，没来由地想吹。",
"笛子凉得像井水，贴上嘴唇的时候，你闻到一股土腥味，混着旧木头和干草的气味。",
"你只吹了一个音。那朵蔷薇抖了一下，花瓣张开，露出一粒漆黑的蕊。",
"风从坟场尽头吹过来，吹得你后颈发凉。远处有人喊你的名字，声音隔着半座山，听不真切。",
"你把笛子塞回花根底下。走出三步，又站住了。",
"那朵花还在开。等你回头。", "从老坟场出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[{t:"回去把笛子取走", go:"sub_necromancer_1"},
{t:"快步离开，当没看见", go:"sub_path_hub"}]}};

N["sub_medium_0"]=function(){return{
place:"学院钟楼 · 顶层",
text:[
"钟楼顶层挂着一口旧钟，钟身上刻着历代敲钟人的名字。最上面一排的名字，已经磨得快看不见了。",
"你替守钟人送饭上来，站在钟前，忽然听见钟肚子里有说话声。",
"声音很轻，像是隔着水。一个老人在说：“……第七个了，今年第七个了。”",
"你抬头看钟。钟没动。可钟身上最旧的那个名字——你认得，那是建校第一任校长的名字——笔画上凝着一层薄薄的水汽。",
"守钟人在楼梯口喊你：“别站那底下，钟会砸下来。”",
"你退开。钟肚子里那个声音又响了一句，这回你听清了：“他不是第七个。他是头一个。”",
"你端着饭盒下楼，手有点抖。楼梯很暗，你数着台阶，数到十三级的时候，身后忽然传来一声极轻的钟鸣。",
"只响了一下。守钟人没有敲钟。", "从顶层出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[{t:"明天再来送饭", go:"sub_medium_1"},
{t:"把钟楼的事告诉导师", go:"sub_path_hub"}]}};

N["sub_hypnotist_0"]=function(){return{
place:"医务室 · 隔间",
text:[
"医务室的隔间里躺着个低年级学生，高烧不退，烧得说胡话。",
"你帮忙按住他的手，好让牧师施术。那孩子忽然睁眼，直直地看着你，说了一句你听不懂的话——不是通用语，也不是任何一族的语言。",
"牧师没在意，继续吟唱。可你发现，那孩子说完那句话之后，呼吸平稳了，眼神也清明了。他眨眨眼，看着你，像刚醒过来：“……你是谁？”",
"他完全不记得自己说过什么。",
"你走出隔间，手心全是汗。不是累的——是那句话说完的时候，你心里跟着应了一声，像有两把锁，钥匙对上了。",
"窗外在下雨，雨点打在玻璃上，噼噼啪啪。你听见自己的心跳，比雨声慢半拍。",
"医务室的门在你身后合上。门里，那个孩子已经睡着了，睡得很沉。", "出了隔间，风迎面扑来。你认了认方向，启程。"],pace:"normal",
options:[{t:"查一查那种语言", go:"sub_hypnotist_1"},
{t:"就当是烧糊涂了", go:"sub_path_hub"}]}};

N["sub_soulbinder_0"]=function(){return{
place:"图书馆 · 单人阅览室",
text:[
"阅览室的桌上摆着一本没标书名的旧书，书脊上缠着红绳。管理员说是一个月前有人还回来的，查不到借阅记录。",
"你翻开第一页，里面夹着一根头发。不是你的。",
"书页上写着一种古老的契约格式，末尾留着一行空白，旁边用小字批注：“此处填名字。落笔即成。”",
"你盯着那行空白，指尖发痒。你试着用指腹描了一下——纸上真的留下了墨痕，像有人在纸背面顶着一支笔，等你的手过去。",
"你飞快地合上书。封面的红绳自己松开了一截。",
"阅览室的灯晃了晃。管理员在门口探头：“要关灯了，同学。”",
"你把书放回原处，走出门。走廊尽头的灯下，站着一个影子，轮廓模糊，像刚从书页里起身的。",
"你低下头，快步走过。那个影子没有跟上来——但你知道，它在看你。", "单人阅览室的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"明天再来读这本书", go:"sub_soulbinder_1"},
{t:"把书交给管理员", go:"sub_path_hub"}]}};

N["sub_alchemist_0"]=function(){return{
place:"炼金工坊 · 蒸馏台",
text:[
"工坊角落的蒸馏台上，放着一只坩埚。锅底结着一层银白色的霜，是上个月留下的。",
"你按方子加进第七味材料，搅了两圈，忽然发现锅里的液体没有变色——它本该变蓝的。",
"你凑近看。液面平静得像一面镜子，映着你的脸。可镜子里你的脸，嘴角多了一道你自己没有的弧。",
"你猛地抬头。工坊里只有你一个人。",
"再看时，液体已经蓝了，蓝得发黑。锅沿的银霜化开一滴，滴在台面上，凝成一颗银珠。",
"你捡起那颗银珠。它温热，像刚出锅的糖。",
"门被推开，导师拎着酒壶进来：“怎么样？”",
"“成了。”你说。你没提那颗银珠——它正躺在你口袋里，贴着皮肤，发烫。", "你离了蒸馏台，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
options:[{t:"晚上研究这颗银珠", go:"sub_alchemist_1"},
{t:"把它交给导师", go:"sub_path_hub"}]}};

N["sub_forger_0"]=function(){return{
place:"学院铁匠铺 · 炉前",
text:[
"铁匠铺的炉子烧了三十年，炉壁黑得发亮。",
"你帮忙打一把短刀，淬火的时候，水槽里忽然浮起一圈金色的纹路，像刀身自己吐出来的气。",
"老铁匠关掉风箱，盯着那圈纹路看了很久。他抽完一袋烟，才开口：“你爹也是干这个的？”",
"“不是。”你说。",
"“那就怪了。”他把短刀捞出来，刀身上的纹路已经褪了，只在刀脊留了一道浅金线。“火认人。它要是认了你，你打什么，它都给你往里添东西。”",
"你接过刀。刀柄还烫着，隔着厚布都能感觉到那股热。不是炉子的热——是从刀脊那根金线里渗出来的，一下一下，像心跳。",
"老铁匠背过身去添炭，丢下一句：“想学，明早来。不想学，这把刀也归你。”",
"你握着刀走出铁匠铺。暮色里，那根金线亮了一下，又暗下去。", "别过炉前，你沿官道走出里许，回头已看不清来处。"],pace:"normal",
options:[{t:"明早来学打铁", go:"sub_forger_1"},
{t:"把刀收好，先想清楚", go:"sub_path_hub"}]}};

N["sub_machinist_0"]=function(){return{
place:"魔械工坊 · 地下车间",
text:[
"地下车间的屋顶漏雨，滴答声正好打着拍子。",
"你拆开一台报废的机械鸟，发现它的心脏是一粒铜丸，铜丸上刻着一圈极细的符文。你顺着符文摸了一圈——铜丸忽然转了一下，卡在某个位置。",
"机械鸟的翅膀动了一下。",
"你吓得松手。铜丸滚到桌角，停住。你蹲下去看，发现它转过的那个位置，符文正好拼出一个词。你不认得那个词，但你知道它的意思：“醒”。",
"车间角落里传来一阵细碎的咔嗒声。你抬头，看见墙边那排报废的机械架上，七八只机械鸟齐齐转过头来，看着你。",
"它们的眼睛是空的铜窝，可你总觉得，它们在看你的手。",
"你小心翼翼地把铜丸放回机械鸟的胸腔。咔嗒声停了，那排鸟又变回废铁。",
"只有你手心的汗知道，刚才那一瞬，整间车间都在等你按下什么。", "地下车间的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
options:[{t:"把铜丸带回去研究", go:"sub_machinist_1"},
{t:"把铜丸装回去，不碰它", go:"sub_path_hub"}]}};

N["sub_bloodsorcerer_0"]=function(){return{
place:"学院地窖 · 储酒室",
text:[
"储酒室的橡木桶码到屋顶，酒香混着霉味，沉甸甸的。",
"你替厨房来搬酒，手指刚扣住桶箍，掌心的旧伤疤忽然一阵灼痛。你低头看——那道疤是小时候摔的，早就不疼了，此刻却红得发亮，像刚从皮肤底下烧起来。",
"你松开手。酒桶纹丝不动，可桶里的酒液在晃，哗啦哗啦，像有人拿手在里面搅。",
"你贴着桶壁听。酒液晃了一阵，安静下来，底下传来一个极低的声音，闷在木头里：“……回来。”",
"那个声音，用的不是通用语，也不是任何种族的语言——可你就是听懂了。",
"你直起身，指尖还在发麻。储酒室的门半掩着，走廊里传来脚步声，由远及近。",
"你把酒桶搬起来，快步走出门。掌心的红已经褪了，只留一点热，像刚握过冬天的火。", "你收拾停当，离开储酒室，沿着来路踏上行程。"],pace:"normal",
options:[{t:"夜里再来一趟", go:"sub_bloodsorcerer_1"},
{t:"问问家族长辈这道疤", go:"sub_path_hub"}]}};

N["sub_berserker_0"]=function(){return{
place:"演武场 · 兵器架旁",
text:[
"演武场的木桩换了新的，树皮还没晒透，带着股潮气。",
"你照常练劈砍，第三十七刀砍下去，木桩没裂——你手里的木刀先断了。断口平整，像被什么东西齐着切开的。",
"你捡起断刀，发现断口是热的。不止刀——你的手心也在发烫，像攥着一块刚出炉的铁。",
"围观的人哄笑：“力气太大，刀都嫌你。”",
"你跟着笑，把断刀扔进废料筐。可你知道，刚才那刀下去的时候，你眼前黑了一瞬。就一瞬，像有谁把灯吹灭又点上。",
"你低头看自己的手。手背的筋脉还鼓着，一跳一跳的。",
"离开演武场的时候，你回头看了一眼那根木桩。木桩腰上有一道浅浅的白印，是刚才那刀留下的——你明明砍的是正中央，那道印却偏了两指。",
"像是有什么东西，替你把刀带歪了。", "你离了兵器架旁，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
options:[{t:"找把更好的刀再试一次", go:"sub_berserker_1"},
{t:"今天到此为止", go:"sub_path_hub"}]}};

N["sub_weaponmaster_0"]=function(){return{
place:"学院武库 · 武器陈列厅",
text:[
"陈列厅的墙上挂着一排旧武器，都是历任院长用过的。最里面那把剑，剑鞘包着兽皮，皮面磨得发亮。",
"你打扫卫生时，抹布擦过那把剑的剑柄。剑鞘里传来一声极轻的嗡鸣，像蜂翅。",
"你停下手。陈列厅里没有别人。你又擦了一下——嗡鸣又响了，这次更清楚，带着一点金属的颤音。",
"你把手按在剑柄上。剑不动。可你的手腕自己记住了什么，贴着剑柄的弧度，徐徐转了一圈。",
"陈列厅的门吱呀一声。你飞快地收回手。进来的管理员看了一眼那把剑，又看看你，说了句：“那把剑，三十多年没人能拔出来了。”",
"他没有问你在做什么。你也没有说——你手掌贴着剑柄那一下，指腹上多了一道浅浅的印子，像剑鞘里的纹路，正等着你的手。", "武器陈列厅的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
options:[{t:"想办法再去一次武库", go:"sub_weaponmaster_1"},
{t:"向管理员打听那把剑", go:"sub_path_hub"}]}};

N["sub_shieldguard_0"]=function(){return{
place:"学院城墙 · 北门箭楼",
text:[
"北门的箭楼年久失修，木梯踩上去咯吱响。",
"你替卫兵送一筐箭矢上去，站在垛口往外看。黄昏的平原起了一层薄雾，雾里有个人影，走走停停，像迷路了。",
"你眯起眼看。那人影走几步，蹲下，又站起来——不是人，是棵被风吹歪的老树。",
"你松了口气，正要转身下楼，脚下忽然一沉。一块垛口的砖松了，往下掉。",
"你来不及想，已经半跪下去，用肩膀抵住了那块砖。砖很沉，压得你肩膀发麻。卫兵跑过来帮你，把砖抬开。",
"“吓我一跳，”卫兵说，“你反应真快。”",
"你笑了笑，活动了一下肩膀。那块砖比你想象的重得多——可你刚才顶住它的时候，没觉得怕。",
"你看着那棵歪脖子树。雾散了，树的轮廓清晰起来，一动不动。",
"你在心里记下：下次来，带块垫砖的木板。", "你最后回望一眼北门箭楼，转身穿过街口，往下一程赶路。"],pace:"normal",
options:[{t:"帮卫兵加固垛口", go:"sub_shieldguard_1"},
{t:"下城墙，回宿舍", go:"sub_path_hub"}]}};

N["sub_warlord_0"]=function(){return{
place:"学院操场 · 沙盘室",
text:[
"沙盘室堆着历届战略课的作业，沙子干得发白。",
"你随手拨了拨一个旧沙盘，把两队兵偶摆成对峙。摆完你愣了——你根本没学过战术，可手指记得每个位置该往哪放。",
"你在左翼的沙丘后多放了一队弓手，又在河湾留了缺口。摆完退后看，整个阵型像一只收拢的拳头。",
"同屋的同学凑过来看：“你摆的？”",
"“随手玩的。”你说。",
"“那正好，”他把自己的兵偶推过来，“咱俩来一局。”",
"结果他输了。输得很快。他盯着沙盘看了半天：“你以前学过？”",
"“没有。”你说的是实话。可你心里有个声音在说：你学过。不是在学校，是在更远的地方。",
"你低头看自己的手。指尖还沾着沙。刚才那局棋，你每一步都像早就下过。", "从沙盘室出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[{t:"向教官请教兵法", go:"sub_warlord_1"},
{t:"再摆一局，验证那种感觉", go:"sub_path_hub"}]}};

/*v489inj:sub2*/
N["sub_paladin_0"]=function(){return{
place:"教堂侧廊 · 圣像前",
text:[
"教堂侧廊的圣像缺了一只手指，谁也不知道什么时候缺的。",
"你傍晚路过，看见一个老妇跪在圣像前，手里攥着一块干饼，举了半天也没咬。她不是来祈祷的——她的眼睛干得发亮，像哭过很久，已经哭不出来了。",
"你从自己兜里摸出半块肉干，放在她旁边的长椅上，什么也没说，转身就走。",
"走出三步，你听见身后一声极轻的响。不是老妇的声音——是圣像。你回头，看见圣像缺指的那只手，指尖亮了一下，像擦过火石。",
"老妇没有抬头。那块肉干还放在长椅上，她没拿。",
"你走出教堂，暮色里，你的手背上多了一道浅浅的印子，像被什么按过。印子是温的，贴着手背的皮肤，慢慢凉下去。",
"街角的乞儿冲你喊：“喂，你掉了东西！”",
"你回头。他手里举着一块肉干——正是你放下的那块。“你刚搁下的，我瞧见了。”",
"你接过肉干。他咧嘴一笑，跑开了。", "别过圣像前，你沿官道走出里许，回头已看不清来处。"],pace:"normal",
options:[{t:"把肉干送给乞儿", go:"sub_paladin_1"},
{t:"收好，明天再来教堂", go:"sub_path_hub"}]}};

N["sub_protector_0"]=function(){return{
place:"学院正门 · 石阶下",
text:[
"入冬的雨又冷又密。学院正门的石阶上，蜷着一窝小狗，母狗不在，狗崽们挤成一团，冻得发抖。",
"你脱下外套裹住它们，蹲在门廊下等母狗回来。雨声很大，你听见门里传来脚步声。",
"门开了，是看门的独眼老兵。他看了你一眼，又看看那窝狗，什么也没说，回身端了碗热水出来。",
"“它们娘出去找食了，”他说，“下这么大雨，八成回不来了。”",
"你抱着狗崽，没接话。热水在碗里冒着白气。",
"母狗没有回来。你把狗崽抱回宿舍，用旧毯子给它们垫了个窝。室友嘀咕了两句，也没真拦。",
"第二天清晨，你醒来的时候，那窝狗崽睡得很沉，一只压着一只。门口放着一碗还温着的粥，没人知道是谁放的。",
"你的外套晾在窗台上，已经干了。", "石阶下已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
options:[{t:"把狗崽养在学院", go:"sub_protector_1"},
{t:"托老兵找户人家", go:"sub_path_hub"}]}};

N["sub_itinerant_0"]=function(){return{
place:"城郊 · 驿道岔口",
text:[
"驿道岔口的石头上刻着路标，指往三个方向。字是新的，漆还没干透。",
"你替学院送信回来，路过岔口，看见一个商队停在那里。领队的中年人蹲在路边，对着一张皱巴巴的羊皮纸发愁。",
"“往东是近路，可听说最近有劫匪。”他说，“往南绕远，但稳妥。”",
"你扫了一眼那张羊皮纸——纸上有两处墨迹是新的，画的路线和路标对不上。你指给他看：“这路标是三天前立的，纸上画的是旧路，往东走会岔进河谷。”",
"中年人愣了愣，把纸翻来覆去看了两遍：“你怎么知道？”",
"“石头的漆没干透，”你说，“新漆盖不住旧痕。旧痕是朝南的。”",
"商队改道向南。临行前，中年人塞给你一小袋干果：“拿着，路上吃。”",
"你站在岔口，看着商队消失在雾里。风卷着落叶，从北边吹来。你忽然想：那个立路标的人，为什么要让人走岔路？"
],pace:"normal",
options:[{t:"顺着北边查一查", go:"sub_itinerant_1"},
{t:"回学院，把这事告诉教官", go:"sub_path_hub"}]}};

N["sub_darkknight_0"]=function(){return{
place:"地牢入口 · 铁门边",
text:[
"学院地牢的铁门锈得发红，锁孔里插着一把旧钥匙，钥匙柄上缠着一截黑布。",
"你打扫地下走廊时，钥匙从锁孔里掉出来，当啷一声。你弯腰去捡，指尖刚碰到钥匙柄，黑布底下露出一角刻痕。",
"你凑近看。刻痕是一个记号，画着一只倒悬的乌鸦，翅膀张开，遮住半个太阳。",
"你认得这个记号——不是从书上。是你小时候，在老家祠堂的旧梁上见过，大人从不许孩子问。",
"你攥着钥匙，钥匙冰凉，黑布却有一角是温的，像刚被人握过。",
"地牢深处传来一声拖长的回音，像有人拿铁器划过石壁。你屏住呼吸。那声音响了两下，停了。",
"你把钥匙插回锁孔，拧了一下。锁没开，但锁芯里传来一声极轻的咔嗒，像什么东西答应了。",
"你转身走出地下走廊。阳光照在你脸上，你眯起眼，手心的汗把钥匙柄浸得发滑。", "从铁门边出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[{t:"回去查那个记号", go:"sub_darkknight_1"},
{t:"把钥匙带走，锁上地牢", go:"sub_path_hub"}]}};

N["sub_hunter_0"]=function(){return{
place:"学院猎场 · 林间空地",
text:[
"猎场边缘的杉树底下，有一串新鲜的蹄印。不是鹿——蹄印比鹿小，却深得多，像踩进土里就拔不出来的那种。",
"你蹲下，用手量了量蹄印的宽度，又凑近闻了闻。土腥味里夹着一丝铁锈味，还有一点烤焦的皮毛味。",
"你顺着蹄印走了半里地，蹄印在一棵老橡树下消失了。树根边散着几根灰白的兽毛，硬得像铁丝。",
"你捡起一根兽毛，指尖一疼——毛尖扎进指腹，渗出一粒血珠。",
"血珠滴在毛上。兽毛忽然卷了一下，像活的，又慢慢松开。",
"你盯着那根兽毛。橡树顶上传来一声粗哑的鸟鸣，你抬头，什么也没看见，只有一片灰影掠过枝头。",
"你把兽毛收进口袋，走出猎场。快出林子的时候，你回头——老橡树的方向，有什么东西在雾里动了动，又静了。",
"口袋里的兽毛贴着皮肤，发烫。", "离开林间空地时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"normal",
options:[{t:"明天带弓再来", go:"sub_hunter_1"},
{t:"把兽毛交给猎场看守", go:"sub_path_hub"}]}};

N["sub_warden_0"]=function(){return{
place:"学院后林 · 溪谷",
text:[
"后林的溪谷秋天断流了，河床露出白花花的卵石。",
"你沿河床走，看见一块大石头下面压着一棵小树苗。树苗还没死，弯着腰从石头缝里挤出来，叶子黄了半边。",
"你搬开石头。石头底下压着一窝蚂蚁，已经干成了壳。树苗弹起来，歪歪斜斜地立着，根须断了几处。",
"你蹲下来，把断根理了理，又找了根树枝撑着树苗，用溪边湿泥培好根。",
"做完这些，你直起身，发现溪谷里不知什么时候起了一层薄雾。雾里有个人影，站在河床对岸，手里拄着一根木杖，像等了很久。",
"你眯起眼看。人影动了动，转身走进雾里，脚步声很轻，踩在卵石上，却没有声响。",
"你低头，发现树苗的叶子上凝着一粒水珠，映着午后的光，亮晶晶的。",
"后来你听看守说，那条溪谷，十年前死过一个护林人。", "溪谷已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
options:[{t:"常来看看这棵苗", go:"sub_warden_1"},
{t:"打听那个护林人的事", go:"sub_path_hub"}]}};

N["sub_scout_0"]=function(){return{
place:"学院哨塔 · 瞭望台",
text:[
"瞭望台的木栏杆上，有一道很深的刻痕，像有人用刀量过什么。",
"你替哨兵值夜，站在瞭望台上，数着远处的灯火。城西的酒馆还亮着，城北的灯塔转着光，城郊的农庄黑成一片。",
"你忽然注意到，城南的麦田边，有一盏灯，比别的灯都矮，矮得像贴在地皮上。它亮了三下，灭了。",
"你掏出随身的小簿子，记下那盏灯的位置。第二天清早，你路过城南，发现那片麦田边只有一口枯井，井沿上有一道新刮的印子。",
"你蹲下来看那印子——不是井绳磨的。是有人踩在井沿上，借力翻过墙头留下的。",
"你直起身，远处的钟楼敲了七下。你看着那道印子，心里默默算着：从城南到这口井，从那盏灯到墙头，每一步都有人精心算过。",
"你合上簿子，往学院走。路过城西酒馆的时候，你多看了一眼——酒馆的窗台上，搁着一盏矮灯，灯罩的油污是新的。"
],pace:"normal",
options:[{t:"继续记，看看还有谁在夜里点矮灯", go:"sub_scout_1"},
{t:"把发现告诉哨兵长", go:"sub_path_hub"}]}};

N["sub_beastfriend_0"]=function(){return{
place:"学院马厩 · 草料间",
text:[
"马厩里最老的那匹枣红马，这几天不肯吃草，只喝水，鼻息很重。",
"你蹲在槽边，试着把手伸给它。枣红马用鼻尖蹭了蹭你的手心，忽然别过头去，冲着马厩角落的草垛，发出一声低低的嘶鸣。",
"你顺着它的视线看过去。草垛底下蜷着一只灰猫，瘦得皮包骨，一条腿折了，拖在身后。",
"你小心地把灰猫抱出来。它没有挠你，只是盯着你，眼睛是琥珀色的，瞳孔缩成一条线。",
"枣红马安静下来，开始吃草。你给灰猫裹上旧布，喂了点水。它舔了两口，忽然开口——不是猫叫，是一声极轻的、像人一样的气音。",
"你愣了。灰猫又看了你一眼，把脑袋埋进前爪，睡了过去。",
"后来马厩的伙计说，那灰猫是野的，从不让人碰，谁碰挠谁。",
"只有你记得，它趴在你膝上的时候，尾巴尖扫过了扫你的手腕——像在记你的味道。", "草料间的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
options:[{t:"给灰猫治伤，养在身边", go:"sub_beastfriend_1"},
{t:"喂饱它，放回野地", go:"sub_path_hub"}]}};

N["sub_assassin_0"]=function(){return{
place:"学院宿舍 · 熄灯后",
text:[
"熄灯后的宿舍很静，只剩走廊尽头的守夜灯，从门缝漏进来一线光。",
"你睡不着，坐在窗台上。月亮被云遮了，窗外的院子黑成一片。",
"你忽然注意到，对面屋顶的瓦片上，有一块颜色比周围深。不是阴影——你数过那片瓦，第二排第三块，比别的瓦多了一层青苔。",
"你盯着那块瓦看了很久。风停了，那块瓦动了一下——不是被风吹的，是被人轻掀起，又放回去。",
"你屏住呼吸。瓦片底下伸出一根细线，垂进院子，落到窗台上，缠住一片碎纸，又收回去。",
"整个过程没有声音。你甚至不确定自己看见了——但你的手已经按在窗框上，指节发白。",
"第二天，你假装路过院子，捡起那片碎纸。纸上没有字，只有一个极淡的记号，像指纹，又不像。",
"你把碎纸夹进书里。那天夜里，你睡得比平时早。", "熄灯后的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"夜里再去窗台看看", go:"sub_assassin_1"},
{t:"把碎纸烧掉，当没看见", go:"sub_path_hub"}]}};

N["sub_burglar_0"]=function(){return{
place:"学院仓库 · 杂物间",
text:[
"仓库的杂物间堆着历年淘汰的旧物，落满灰。",
"你替后勤清点东西，在最里面翻出一只铜盒。盒子没锁，盖子上有一圈极细的刻痕，像某种密码盘。",
"你转了一下铜盘。咔嗒一声，盒子开了一条缝，里面躺着一把铜钥匙，和一张泛黄的纸条。",
"纸条上写着一个地址，字迹很旧，墨水褪成了褐色。你认得那个地址——城西的老钟表铺，三年前就关门了。",
"你把钥匙放回去，合上盖子。铜盘自己转回原位，咔嗒一声，锁住了。",
"你拎着铜盒，犹豫了一下，还是把它放回原处。走出仓库，你回头看了一眼——杂物间的门半掩着，阳光从门缝照进去，那盒铜在灰堆里亮了一下。",
"那天夜里你做了个梦，梦见自己走进一家开在钟表铺地下的店，货架上摆满了没有主人的钥匙。",
"醒来的时候，你发现自己手里攥着什么东西。张开手，是一粒灰。", "你与杂物间作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal",
options:[{t:"回仓库，把铜盒取走", go:"sub_burglar_1"},
{t:"把铜盒的事告诉后勤", go:"sub_path_hub"}]}};

N["sub_spy_0"]=function(){return{
place:"学院档案室 · 密档柜",
text:[
"档案室最里面的密档柜，钥匙在主任身上，可柜门底下压着一张纸条，露出一角。",
"你替主任送茶，弯腰放茶杯的时候，看见纸条上写着一行字，只有半句：“……若东窗事发，去城南铁匠铺找老周。”",
"你直起身，把茶放在桌上。主任头也没抬，翻着一本账册。",
"你把那半句话记在心里。晚上回到宿舍，你在纸上写下这行字，又划掉，再写一遍，再划掉。最后你把纸烧了。",
"第二天，你路过城南铁匠铺，看见铺子门口挂着一串新打的马蹄铁，在风里叮当响。老周坐在门槛上抽烟，看见你，眯了眯眼，什么也没说。",
"你走过铁匠铺，走了很远，才停下来。你发现自己的手在发抖——不是怕，是有什么东西，在那一瞬，忽然想明白了。",
"主任的账册，密档柜的纸条，城南的铁匠铺——它们之间，隔着一条你看不见的线。",
"你决定，先把这条线摸出来。"
],pace:"normal",
options:[{t:"开始留意主任的动向", go:"sub_spy_1"},
{t:"找机会看一眼密档柜", go:"sub_path_hub"}]}};

N["sub_faceless_0"]=function(){return{
place:"学院澡堂 · 更衣间",
text:[
"更衣间的铜镜蒙着水汽，雾蒙蒙的。",
"你擦干手，伸手抹了一把镜面。镜子里你的脸清晰了一瞬——你看见自己左眉梢有一道细疤，是小时候磕的。",
"你放下手。水汽又蒙上来。你忽然发现，镜子里那个你，眉梢的疤不见了。",
"你猛地抬头。镜子里的人也在抬头，但慢了半拍。那半拍里，镜中人的表情是空的——不是你惯常的模样，像一张没画完的脸。",
"你后退一步。镜子里的你后退了半步。",
"澡堂外传来同伴的声音：“喂，洗好了没？”",
"“好了。”你应道。再看向镜子时，镜面已经被水汽蒙满了，什么也看不见。",
"你伸手，在镜面上画了一个圈。水汽顺着圈痕流下来，露出一小片光亮的镜面。镜面里，你的脸正对着你，眉梢的疤回来了。",
"你盯着那道疤，忽然不确定：它到底在左边，还是右边？", "更衣间的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"再画一个圈，确认一次", go:"sub_faceless_1"},
{t:"穿好衣服，离开澡堂", go:"sub_path_hub"}]}};

/*v489inj:sub3*/
N["sub_healer_0"]=function(){return{
place:"学院医务室 · 病床区",
text:[
"医务室的天花板有一道裂缝，下雨天会渗水，接水盆摆了一排。",
"你替医师换药，床位上躺着个摔断腿的工友。他的伤口敷着药，可纱布底下渗出来的不是血，是一层淡绿色的水，带着一股苦味。",
"医师皱着眉，翻着药典：“没见过这种……”",
"你凑近闻了闻那苦味，忽然想起小时候老家后山的一种草——长老说过，那种草专治“魂上的伤”。",
"你伸手，虚虚地覆在伤口上方。没碰到纱布，可你感觉到一阵凉，从指尖钻进去，像把手探进溪水里。",
"工友哼了一声，放松下来。纱布下的绿水慢慢止住了。",
"医师回头，看见你的动作，愣了半天，才开口：“……你刚才做了什么？”",
"你摇头：“不知道。就是想这么做。”",
"你的指尖还在发凉。窗外开始下雨，雨点打在接水盆里，叮叮当当。那盆里的水，忽然清了一寸。", "从病床区出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
options:[{t:"查一查那种草", go:"sub_healer_1"},
{t:"把刚才的感觉告诉医师", go:"sub_path_hub"}]}};

N["sub_inquisitor_0"]=function(){return{
place:"城郊教堂 · 告解室外",
text:[
"告解室的门帘破了个角，里面的人声音压得很低。",
"你路过教堂，听见告解室里有说话声。不是告解——是两个人在争什么，声音压着，却压不住火气。",
"“……那孩子不能放走，他知道得太多了。”",
"“可他什么也没看见。”",
"“他看见了。他看见了不该看的东西。”",
"你停下脚步。门帘破角里，透出一线光，落在地上，照出一只靴尖。靴尖上沾着干泥——是城北那片湿地的泥，城北的湿地，去年封了，谁都不许进。",
"你退后两步，鞋跟碰到门槛，发出一点声响。告解室里的声音立刻停了。",
"你快步走出教堂。阳光刺眼，你眯起眼，心里把那句话翻来覆去滚了三遍：“他看见了不该看的东西。”",
"你低头，发现自己手里攥着一样东西——不知什么时候，你从门框上抠下了一块木屑，攥得掌心发白。", "你离了告解室外，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
options:[{t:"查一查城北湿地", go:"sub_inquisitor_1"},
{t:"把这件事告诉主教", go:"sub_path_hub"}]}};

N["sub_warpriest_0"]=function(){return{
place:"学院武场 · 靶场",
text:[
"靶场的木靶上钉着七八支箭，环数都不高，歪歪斜斜的。",
"你替牧师学院送器材，路过靶场，看见一个瘦小的女孩在练箭。她拉不开弓，箭搭上去就掉，脸涨得通红。",
"你放下器材，走过去，没有接她的弓，只在她身后蹲下来，把她的手往上托了半寸。",
"“先别急着拉满，”你说，“弦要对准眉心这条线。”",
"女孩照你说的做了。箭离弦，钉在靶边，还是没上环，但她没有再掉箭。",
"她回头看你，眼睛亮晶晶的：“你也是牧师学院的吗？”",
"“不是。”你说。",
"“那你教我的这个，算不算神术？”",
"你愣了一下。你教她的不是神术，只是把弓拿稳的法子。可你忽然想——如果神术是让人学会把一件事做成的力量，那刚才那一下，算不算？",
"你蹲在靶场上，太阳晒着后颈，想了很久。", "靶场已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
options:[{t:"留下来，陪她练完这壶箭", go:"sub_warpriest_1"},
{t:"把器材送到，回去上课", go:"sub_path_hub"}]}};

N["sub_ascetic_0"]=function(){return{
place:"教堂后园 · 苦修室",
text:[
"苦修室的墙很厚，窗子开在很高的地方，只能看见一片天。",
"你替老修士送饭，推开门，他正跪在地上，面前摆着一块石头。石头很普通，河边捡的，灰扑扑的。",
"他听见门响，没有回头：“放桌上吧。”",
"你把饭放下，多看了那块石头一眼。石头表面有一圈细细的裂纹，像什么在里面撑着，马上要裂开。",
"“这块石头，”老修士说，“我跪了九年，天天看着它。第九年的时候，它裂了一道缝。”",
"“里面有什么？”你问。",
"“不知道。”他笑了，“我不敢砸开看。我怕砸开了，它就真的只是一块石头了。”",
"你走出苦修室，门在身后合上。你站在走廊里，看着自己的手掌——掌纹深处，也有一道细纹，比昨天深了一点。",
"窗外那片天很蓝。蓝得没有一丝云。", "苦修室已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
options:[{t:"明天再去送饭", go:"sub_ascetic_1"},
{t:"问老修士，为什么是石头", go:"sub_path_hub"}]}};

N["sub_merchant_0"]=function(){return{
place:"学院食堂 · 小卖窗",
text:[
"食堂小卖窗的老板娘是个精明人，算盘打得比谁都响。",
"你排队买饭，前面的人掏钱时掉了一枚铜币。铜币滚到你脚边，你弯腰捡起来，正要喊他，老板娘先开口了：“那位同学的，掉地上了。”",
"前面那人回头，接过铜币，道了声谢。",
"你看了老板娘一眼。她冲你眨眨眼，压轻声音：“干这行的，眼睛要利。不是捡别人的钱，是别让别人的钱，掉进不该掉的兜里。”",
"你端着饭坐下，琢磨她这句话。后来你发现，老板娘的小卖窗，总是第一个知道学院里谁缺钱、谁有余钱——不是她打听，是她从不放过任何一笔小账。",
"你吃完饭，把碗放回去。老板娘叫住你：“明早帮我去城西进趟货？工钱照给。”",
"你答应了。走出食堂，你忽然明白过来——她不是在雇人进货。她是在看，你有没有算账的脑子。", "小卖窗已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"normal",
options:[{t:"明早去进货", go:"sub_merchant_1"},
{t:"婉拒，但记住这个提醒", go:"sub_path_hub"}]}};

N["sub_banker_0"]=function(){return{
place:"学院账房 · 算盘间",
text:[
"账房的算盘珠磨得发亮，声音噼里啪啦，像雨点。",
"你替学院送账本过去，账房先生不在，桌上摊着一本旧账。你扫了一眼——去年学院食堂的支出，比前年多了两成，但采购单上的面粉价，没变。",
"你多看了两行。面粉价没变，支出多两成，中间差的账，记在另一栏：“损耗”。损耗后面没写数字，画了个圈。",
"账房先生推门进来，看见你站在桌前，愣了愣。",
"“这账，”他拿起账本，“你看得懂？”",
"“看得懂一点。”你说，“损耗那栏，空着。”",
"他看了你很久，把账本收进抽屉：“明早来，我教你认账。”",
"你走出账房，太阳很好。你发现自己的手指在发烫——不是握算盘握的，是你刚才顺着那两行数字往下看的时候，心里有什么东西，像一把锁，被一串数字指尖一拨开了。", "算盘间在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"normal",
options:[{t:"明早去学认账", go:"sub_banker_1"},
{t:"回去自己琢磨那本账", go:"sub_path_hub"}]}};

N["sub_auctioneer_0"]=function(){return{
place:"学院礼堂 · 旧物拍卖会",
text:[
"学院为筹措修缮费，办了一场旧物拍卖会。礼堂里人头攒动，桌上摆满旧书、旧武器、旧器具。",
"你负责登记拍品。一把旧匕首被标了低价，没人要。你登记时多看了一眼——匕首的柄上，有一圈极细的刻痕，是精灵文，刻着一句话。",
"你装作无意，把匕首翻过来，看清了那行字：“归途在炉火里。”",
"拍卖开始后，那把匕首果然流拍了。你把它从台上拿下来，搁在登记台底下。",
"散场后，你把它放进自己口袋。走出礼堂，你摸出匕首，月光下，柄上的刻痕泛着淡淡的银光。",
"你忽然明白，为什么没有人要它——他们看的是刃口，看的是价钱。只有你看的是柄上那行字。",
"你把它收好。夜里躺在床上，你听见口袋里传来一声极轻的嗡鸣，像匕首在应你。"
],pace:"normal",
options:[{t:"研究匕首上的精灵文", go:"sub_auctioneer_1"},
{t:"把匕首交还学院", go:"sub_path_hub"}]}};

N["sub_smuggler_0"]=function(){return{
place:"学院后门 · 卸货巷",
text:[
"学院后门的卸货巷窄得只容一辆板车通过，墙根堆着旧木箱。",
"你帮厨房卸货，看见墙根的一摞木箱底下，压着一只小箱子。箱子上没写货单，用麻绳捆着，打的是水手结。",
"你蹲下来，多看了一眼。麻绳的结，是北边港口的打法——可这批货是从南边来的。",
"你直起身，继续搬货。搬完最后一箱，你假装系鞋带，又看了一眼那只箱子。箱盖缝隙里，塞着一片枯叶。枯叶是干的，但叶脉还是绿的——它离开树，不超过三天。",
"北边港口的结，三天内的枯叶，压在一批南货底下。",
"你记下这些，没有碰那只箱子。第二天再来卸货时，那只箱子已经不见了，墙根只留下一道浅浅的压痕。",
"你蹲下来，摸了摸那道压痕。还带着一点凉。", "卸货巷的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"打听这几天从北边来的船", go:"sub_smuggler_1"},
{t:"当没看见，继续搬货", go:"sub_path_hub"}]}};

/*v489inj:abyss*/
/* /v62inj:chunk-abyss/ N["abyss_mage_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_mage_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_soul_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_soul_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_sor_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_sor_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_war_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_war_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_knight_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_knight_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_ranger_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_ranger_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_thief_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_thief_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_priest_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_priest_1"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_merch_0"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_merch_1"] 已移入 chunks/v62_abyss.js */
/*v489inj:deity*/
N["deity_mage_0"]=function(){return{
place:"静室 · 灯下",
text:["你闭着眼，把今天学的法术在脑子里过了一遍。第三遍的时候，你忽然闻见一股墨水味，很淡，像谁刚写完一页字。", "你睁开眼。房间空无一人，桌上那支没用过的羽毛笔，笔尖上凝着一滴墨，正在往下滴。", "你伸手接住。墨滴落进掌心，没有晕开，凝成一颗圆圆的珠子，像一只闭着的眼睛。", "你听见一个声音，很轻，像隔着一千年的纸传过来的：“写字的笔，认字的手。”", "珠子在你掌心化开，渗进皮肤，只留下一圈淡青色的印子。", "你闻到的墨水味散了。你摊开书，翻到扉页——上面有一行字，不是你写的：“奥术不认血缘，认的是破开真相的执念。”", "你盯着那行字。墨迹很新，像刚刚落笔。", "灯下的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_mage_1"}]}};

N["deity_mage_1"]=function(){return{
place:"静室 · 更深",
text:["你伸手去摸那行字。指尖触到纸面，字迹凸起，像烙进纸里的。", "你合上书，又翻开。字还在。", "你想起一个传说：两千年前，奥术之主陨落，他的王座空了千年，没有一个法师敢坐上去。", "你摸着自己掌心的淡青色印子，忽然明白，那条路不是没人走，是走了的人，都没回来。", "你吹灭灯，在黑暗里坐了很久。窗外有风，吹得窗纸沙沙响。", "你听见自己的心跳，一声一声，很稳。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_soul_0"]=function(){return{
place:"静室 · 灯下",
text:["你打坐的时候，眼前总会浮起一片光。不是烛光，不是日光，像清晨第一线从天边渗进来的白，很薄，很凉。", "你睁开眼，光就散了。房间里还是那盏灯，灯芯烧得发黑。", "你闭上眼，光又回来。这一次，光里有一个模糊的影子，轮廓很淡，像在跟你说什么，但你听不见。", "你试着向前走一步。光里的影子退一步。你再走，它再退。", "你停下来。影子也停下来。它抬手，指了指你自己。", "你低头看自己——你站在一片光里，脚边有一圈淡淡的影子，形状和你一模一样。", "你睁开眼。灯还亮着。你发现自己的影子，在灯下，比平时淡了一点。", "灯下的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_soul_1"}]}};

N["deity_soul_1"]=function(){return{
place:"静室 · 更深",
text:["你看着灯下自己淡了一圈的影子，心里忽然浮起一个名字：晨曦。", "你听过那个传说：一个灵魂法师，没有登神，没有神位，只是把自己的名字刻在黎明前最薄的那层光里。", "你的影子晃了晃。你看见影子的手，慢慢抬起来，指向窗外。窗外，天边泛起一线白。", "天快亮了。你坐在窗前，看着那线白一点一点漫开。", "你的影子，在天亮之前，慢慢变回原来的颜色。", "你站起身，没有点灯。你借着那线晨光，收拾好桌案。桌上有一面小镜，镜子里你的脸，被晨光照得很清楚。", "你看了自己很久。你没有问晨曦是谁。你只记得，那片光里的影子，指了一下你自己。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_sor_0"]=function(){return{
place:"静室 · 灯下",
text:["你修补一口旧锅的时候，炉火忽然静下来。不是熄灭，是火焰竖成一条线，安安静静地烧。", "你握着钳子的手，停在半空。你听见火里有一个声音，像铁在锻打时发出的那种闷响：“熔炉记得每一双手。”", "你低头看自己的手。手背的烫疤是去年留下的，已经白了。", "火焰动了一下，像有谁在火里翻动。你看见火舌的缝隙里，躺着一粒通红的铁块，小指头大小，圆滚滚的。", "你用钳子夹出来。铁块在空气中迅速冷却，变成灰黑色。你握在手里，它还热着。", "你把它放在工作台上，继续补锅。补完锅，你再去看——铁块还在，但它不再烫了，静静地躺着，像一颗烧过的种子。", "你把铁块收进口袋。走出工坊，暮色里，你回头看了一眼炉火——火焰已经恢复正常，烧得噼啪响。", "灯下的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_sor_1"}]}};

N["deity_sor_1"]=function(){return{
place:"静室 · 更深",
text:["夜里你坐在工作台前，把那粒铁块放在灯下。", "你想起矮人王的传说：锻造之神陨落时，把最后一点神火交给了一个半神，名叫索林·铁须。那点火，据说能认出真正的工匠。", "你捏起铁块。它凉了一整天，可当你把它贴近胸口的时候，它又热起来。", "你没有问它要什么。你把它放在台子上，开始打一枚铜钉。", "铜钉打好，你把它和铁块并排放在一起。铁块的热，慢慢漫过来，把铜钉也烘得温温的。", "你看着这两样东西，忽然觉得，它们像认识了很久。", "你吹灭灯。黑暗里，铁块发出一点极暗的红光，像埋着的一粒火种。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_war_0"]=function(){return{
place:"静室 · 灯下",
text:["你练刀练到力竭，靠在演武场的木桩上喘气。", "夕阳把你的影子拉得很长。你看着自己的影子，忽然觉得，那道影子比你壮——不是错觉，影子的肩，比你宽了半寸。", "你站直。影子也站直。你举起手，影子举起手。动作一致，但影子的动作，总是快你一线。", "你盯着那道影子，影子也像在看你。", "你想起一个老兵的传说：战神陨落三千年，他的战意没有散，沉在大陆的每一把刀里。握刀的人，都会梦见同一个战场。", "你低头看自己的刀。刀身上，夕阳的余光镀了一层金。", "你收刀入鞘。影子缩回你脚下。你走出演武场，脚步比来时重了一点。", "你离了灯下，脚步声在空旷处格外清晰。赶路要紧。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_war_1"}]}};

N["deity_war_1"]=function(){return{
place:"静室 · 更深",
text:["夜里你睡不着，把刀放在枕边。", "月光从窗缝漏进来，照在刀身上。你看见刀身上有一道极淡的划痕，白天没有的。", "你坐起来，把刀横在膝上。月光下，刀身的划痕慢慢连成一条线，像一幅地图的边。", "你的手，自己按在了那道线上。", "你听见一阵极远的风声，像从几千里外的高原上吹来的。风声里，有一个声音说：“战场不认输家。”", "你松开手。划痕还在。", "你重新躺下，把刀放回枕边。月光照着刀身，那道线安安静静的，像在等你。", "你闭上眼。梦里，你站在一片草原上，风很大，远处有一面破旗，在风里猎猎作响。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_knight_0"]=function(){return{
place:"静室 · 灯下",
text:["你帮教堂修整围栏时，在墙根底下刨出一块旧石碑。石碑半截埋在土里，字迹已经磨平了。", "你用水洗净碑面，发现最上面刻着一行字，笔画很浅，像刻的人故意不用力：“立誓之人，其誓不移。”", "你蹲在碑前，把那行字念了一遍。", "念完，你听见一声极轻的响，像什么东西在你胸腔里应了一声。你按住胸口，心跳很正常。", "你继续修围栏。可那行字在你脑子里转了一下午。", "傍晚，你把石碑立回墙根，用土培好。你站起来的时候，发现自己不知什么时候，把左手按在了碑面上，像在按着什么起誓。", "你收回手。碑面上，多了一个淡淡的掌印。", "你最后回望一眼灯下，转身穿过街口，往下一程赶路。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_knight_1"}]}};

N["deity_knight_1"]=function(){return{
place:"静室 · 更深",
text:["你夜里又去了教堂。月光下，那块石碑上的掌印还在。", "你蹲下来，把自己的手覆上去。掌印严丝合缝——就是你的手。", "你听见碑里传来一个声音，很轻，像隔着很厚的墙：“誓约之神在位千年，从没有人见过他。”", "你问：“那他还在吗？”", "声音没有回答。但碑面上，那行字的下方，慢慢浮现出一行新字，笔画和原刻一样浅：“还在。在等一个立誓的人。”", "你收回手。那行新字没有消失。", "你走出教堂，夜风很凉。你回头看了一眼——石碑立在月光里，安安静静的。", "你摸着自己的左手。掌心的纹路，比白天深了一点，像被什么按过。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_ranger_0"]=function(){return{
place:"静室 · 灯下",
text:["你巡林的时候，在一棵老树洞里发现一窝雏鸟。鸟妈妈不在，雏鸟饿得直叫。", "你抓了几条虫，喂给它们。喂完，你发现树洞边沿，刻着一个极淡的记号，像一片叶子，又像一枚脚印。", "你顺着记号的方向走。走了一里地，记号消失了，你站在一片你从没到过的空地中央。", "空地上没有树，只有一片草，草长得整整齐齐，像被谁修剪过。", "你蹲下来摸那草。草叶是凉的，但草根是温的。", "你听见风声。风里有一个声音，不像人，像整个林子同时开口：“荒野之神不立庙，不进香。他的庙，是每条没人踩出来的路。”", "你站起来。风吹过空地，草叶一起一伏。", "你沿着来路走回树洞。雏鸟已经睡了，鸟妈妈不知什么时候回来了，正蹲在枝头看你。", "灯下的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_ranger_1"}]}};

N["deity_ranger_1"]=function(){return{
place:"静室 · 更深",
text:["你坐在树洞边，看着鸟妈妈喂雏鸟。", "你想起那个传说：荒野之神在位，可他从没有教廷，没有圣像，连名字都很少有人知道。", "你问枝头的鸟妈妈：“你见过他吗？”", "鸟妈妈歪了歪头，没有回答。它跳下枝头，在地上啄了一下，又飞回去。", "你蹲下来，看它啄过的地方。土里埋着一粒种子，已经发了芽。", "你小心地把种子旁边的土拨松，让它透透气。", "你做完这些，站起身，准备离开。走出几步，你听见身后传来一声极轻的响——不是鸟叫，像一颗种子破土的声音。", "你回头。那棵新芽，在夕阳里，叶尖上凝着一粒水珠，亮晶晶的。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_thief_0"]=function(){return{
place:"静室 · 灯下",
text:["你替学院跑腿送信，路过一条你没走过的小巷。巷子很窄，墙根堆着旧物，尽头是一扇漆皮剥落的门。", "门缝里漏出一线光。你凑近看，里面不是房间，是一条向下的楼梯，光从楼梯尽头透上来。", "你没有推门。你记住了这条巷子的位置，继续送信。", "回来的时候，你故意又走了一次这条巷子。门还在，光还亮着。", "第三次，你蹲在门口，仔细看那扇门。门板上没有锁，只有一个极小的刻痕，像一只闭着的眼睛。", "你伸手摸那只眼睛。刻痕是凉的，可你指尖刚碰到，门缝里的光，晃了一下。", "你收回手。光又稳住了。你听见楼梯尽头传来一个声音，很轻，像有人笑了一下，又像没有。", "出了灯下，风迎面扑来。你认了认方向，启程。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_thief_1"}]}};

N["deity_thief_1"]=function(){return{
place:"静室 · 更深",
text:["你第四次来到那扇门前，终于推开了它。", "楼梯很陡，光从底下照上来，把你的影子拉得很长。你走到底，看见一间很小的房间，空荡荡的，只有一张桌子，桌上放着一面铜镜。", "你凑近看。镜子里没有你的脸——镜面是空的，像蒙了一层雾。", "你伸手擦。雾散开一点，镜面里出现一行字，字迹很淡：“隐秘之主的神位，空了三十年。”", "你盯着那行字。字迹像会呼吸，慢慢淡下去，又浮起来。", "你听见自己心里有个声音问：“谁坐上去，谁就看不见了。你怕吗？”", "你没有回答。你退出房间，爬上楼梯，把门悄然合上。", "走出小巷，太阳很亮。你低头，看见自己的影子，比平时淡了一点，像那扇门里的光，在你身上留了一道印子。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_priest_0"]=function(){return{
place:"静室 · 灯下",
text:["你做完晚祷，最后一个走出教堂。", "夕阳正好落在圣坛上，把圣像染成金色。你看见圣像的指尖，凝着一粒光，像一滴露水，又像一粒泪。", "你走过去看。光粒是温的，你伸手，它落在你掌心，没有化开，像一颗小小的太阳。", "你听见钟声——不是晚钟，是一声你从没听过的钟鸣，又远又近，像从云层上面传下来的。", "钟声过后，圣像的指尖，光粒消失了。你掌心那粒光，还在。", "你把它贴在胸口。它隔着衣料，发烫，像一颗跳动的心。", "走出教堂时，晚风很凉。你掌心的光，一直温着。", "你与灯下作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_priest_1"}]}};

N["deity_priest_1"]=function(){return{
place:"静室 · 更深",
text:["夜里你跪在圣坛前，掌心的光粒还在发热。", "你问圣像：“太阳神圣辉，在位千年，从不显圣。为什么是我？”", "圣像没有回答。但你听见一个声音，像从很远的天顶传下来的：“太阳不认信徒。太阳认的是早起的人。”", "你愣了很久。你想起自己每天清晨第一个进教堂，打扫，点烛，从没间断。", "掌心的光粒化开了，渗进你的皮肤，留下一圈淡淡的金色印子，像被太阳晒过。", "你低头看着那圈印子。钟楼敲响子时的钟，一声一声，很沉。", "你站起来，把烛台添满油。你走出去的时候，回头看了一眼圣像——夕阳的光已经没了，但圣像的指尖，还亮着一点。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

N["deity_merch_0"]=function(){return{tag:"branch",
place:"静室 · 灯下",
text:["你替食堂算这个月的账，算到最后，总数差了三个铜币。", "你重新算了两遍，还是差三个。你翻进货单，一笔一笔核对，最后发现——上个月的账，多记了三笔支出，每笔正好一个铜币。", "这三笔支出，不是你记的。你翻到上个月的账页，墨迹已经干了，但笔迹不对——比你写的轻，像谁在你记完账之后，添上去的。", "你把那三笔划掉，重新合计，数字对上了。", "合上账本的瞬间，你听见一声极轻的响，像秤杆在桌上顿了一下。", "你抬头。账房里只有你一个人。桌上那杆旧秤，秤砣自己摆正了，像被谁扶了一下。", "别过灯下，你沿官道走出里许，回头已看不清来处。"],pace:"normal",
options:[{t:"把这段感应记在心里", go:"sub_path_hub"},
{t:"循着那一点牵引，再坐一阵", go:"deity_merch_1"}]}};

N["deity_merch_1"]=function(){return{tag:"branch",
place:"静室 · 更深",
text:["你盯着那杆秤看了很久。它摆正之后，就再没动过。", "你走过去，伸手摸了摸秤杆。秤杆是温的——账房里很冷，可它温得像被人握过。", "你听见一个声音，像铜钱碰铜钱的声音，又轻又脆：“金衡在位，管的不是钱。”", "你问：“那管什么？”", "那个声音停了很久，才说：“管秤。秤平了，钱才有路。”", "你收回手。秤杆的温热，慢慢退去。", "你走出账房。月光下，你看见自己手里，不知什么时候多了一枚铜币——不是你的，是刚才那三笔账里，被划掉的其中一笔。", "你把它放回账本的夹页里。那杆秤，在月光下静静地立着，秤砣稳稳地悬在正中。"],pace:"normal",
options:[{t:"起身，把这夜收好", go:"sub_path_hub"}]}};

/*v489inj:adv*/
N["sub_elemental_1"]=function(){return{
place:"风炉间 · 元素共鸣",
req:{mat:"火晶尘",n:1},
text:["第二天你再去风炉间，导师不在。炉膛里压着一块炭，还是温的。", "你按昨天的手感添了一把火晶粉。这一次，火光没有炸开——它在炉壁上凝成一道细细的纹路，像血管，徐徐爬了半圈。", "你伸手碰那道纹。指尖传来一阵酥麻，像握着一条温顺的河。", "你试着让火沿着纹路走。它走了三步，停在你指尖下，发烫，等你下一个念头。", "导师回来时，炉膛已经冷了。他看了一眼炉壁上的纹，没有说话，只把一串钥匙放在台子上：“以后风炉间归你管。”", "你收好钥匙。钥匙上拴着一枚铜环，环里嵌着一粒火晶，红得发亮。"],pace:"normal",
effect:{"skill":{"s":"magic","v":8},"flag":"v489_sub_elemental","attr":{"INT":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_conjurer_1"]=function(){return{
place:"杂物间 · 空间练习",
req:{mat:"旧纸人",n:1},
text:["杂物间最里面的柜子，门缝里夹着一截黄纸。你抽出来，纸上画着一个人形，笔迹歪歪扭扭，像小孩画的。", "你照着纸人画了一个。画完，纸人自己立了起来，歪着头看你。", "你试着让它走一步。它摇摇晃晃迈出一步，撞在柜脚上，倒了下去。", "你把它扶起来，重新画了双腿。这一次，它走了三步，稳稳地站在你面前。", "你听见柜子里传来一声极轻的笑。你拉开柜门——里面只有旧书和灰，什么都没有。", "你合上柜门。纸人还站在地上，抬着手，像在等你给它一个去处。"],pace:"normal",
effect:{"skill":{"s":"magic","v":7},"flag":"v489_sub_conjurer","attr":{"INT":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_arcane_1"]=function(){return{
place:"档案室 · 结界试炼",
req:{mat:"静默墨",n:1},
text:["你借到一卷旧结界图，纸张脆得像枯叶。图边有一行小字：“静默结界，以无声封有声。”", "你在档案室角落练习。念诀，落印。结界张开的一瞬，你听见自己的心跳声消失了。", "你试着在结界里咳嗽一声。声音没有传出去，连你自己都听不见——像被吸进墙里。", "你撤去结界。心跳声回来了，像迟到的钟。", "你卷好结界图，放回书架时，发现封脊里夹着一页纸，上面抄着一句：“结界不是墙，是沉默本身。”", "你把那页纸夹回原处，没有带走。走出档案室，你发现自己的脚步声，比平时轻了半拍。"],pace:"normal",
effect:{"skill":{"s":"magic","v":7},"flag":"v489_sub_arcane","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_necromancer_1"]=function(){return{
place:"后山坟场 · 初试",
req:{mat:"骨灰",n:1},
text:["你带着那支骨笛，又去了后山坟场。月光下，坟场的草齐刷刷地伏着，像在等什么。", "你吹了一下骨笛。没有声音——但草尖齐齐颤了一下。", "你握着银线，试着让它往坟场深处走。银线悬在草尖上，徐徐游过一座座坟头，停在一棵老槐树下。", "槐树下，草色比别处深。你走过去，看见土里露出一角木匣，匣盖半朽，刻着一行字：“还我。”", "你没有挖它。你跪下来，把银线缠在槐树根上，绕了三圈。", "银线贴着树根，泛着微光，像一根细细的脉搏。你听见地底传来一声很轻的叹息，像放下了什么。"],pace:"normal",
effect:{"skill":{"s":"soul","v":8},"flag":"v489_sub_necromancer","attr":{"SPR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_medium_1"]=function(){return{
place:"钟楼 · 记忆回廊",
req:{mat:"旧钟绳",n:1},
text:["你站在钟楼底下，把心静下来。", "你试着像那天一样，去听。起先只有风声，后来，你听见一声很远的钟响——不是敲的，是回声，像从很多年前传过来的。", "你顺着回声走。钟楼的石阶上，你看见一双脚印，比你小，比你的旧。脚印停在三楼，转向一扇封死的窗。", "你推开窗。窗外没有风景，只有一片灰蒙蒙的光，光里站着一个影子，看不清脸。", "它抬手指了指钟楼顶上。你抬头——顶上悬着一口旧钟，钟舌上系着一根红绳，褪成了白色。", "你没有碰那根绳。你退出来，合上窗。那口钟，在你身后，轻响了一下。"],pace:"normal",
effect:{"skill":{"s":"soul","v":8},"flag":"v489_sub_medium","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_hypnotist_1"]=function(){return{
place:"医务室 · 烛火练习",
req:{mat:"烛泪",n:1},
text:["医务室的医师借给你一支旧烛台。你说要练专注，他点点头，什么也没问。", "你对着烛火练习。火苗起初跳个不停，你盯着它，盯到眼睛发酸。", "第三天，火苗静了下来，直直地立着，像被什么按住了。", "你试着让火苗往左偏。它偏了。往右。它又偏回去。", "你听见医师在门口站了一会儿。他没有进来，只留下一句话：“别把火用在自己人身上。”", "你吹灭烛火。房间暗下来，你的眼睛还亮着——你知道，那不是烛光。"],pace:"normal",
effect:{"skill":{"s":"will","v":8},"flag":"v489_sub_hypnotist","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_soulbinder_1"]=function(){return{
place:"阅览室 · 契约",
req:{mat:"契约纸",n:1},
text:["阅览室角落有一本旧书，书脊上没有字。你抽出来，翻到最后一页——空白页上，画着一只手，掌心朝上。", "你把自己的手覆上去。纸面凹下去一点，像另一只手在下面托着你。", "你想起缚魂者的传说：与什么立约，就要把自己的一部分交给它。", "你问：“你是谁？”", "纸面上浮出一行字，笔画很淡：“你还没准备好知道。”", "你把手收回来。纸上的手印还在，掌心的纹路，和你的手一模一样。", "你合上书，放回原处。走出阅览室，你发现自己的左手心，多了一道浅浅的纹，像被什么握过。"],pace:"normal",
effect:{"skill":{"s":"soul","v":8},"flag":"v489_sub_soulbinder","attr":{"SPR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_alchemist_1"]=function(){return{
place:"蒸馏台 · 银液成丹",
req:{mat:"银液",n:1},
text:["你把那瓶用不完的银液倒回坩埚，重新加热。", "这一次，银液没有沸腾，而是慢慢收拢，凝成一粒拇指大的珠子，悬在锅底。", "你把它取出来。珠子是温的，表面有一层细纹，像纹章。", "你把它放进药柜。第二天，药柜里多了一瓶药，标签上写着：“取珠者自用。”笔迹不是你的。", "你打开药瓶闻了闻——是你那粒珠子化开的气味，带着一丝苦，一丝甜。", "你把它收进怀里。夜里你梦见自己站在一口更大的坩埚前，锅沿刻着一行字：“万物都可成药。”"],pace:"normal",
effect:{"skill":{"s":"alchemy","v":9},"flag":"v489_sub_alchemist","attr":{"INT":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_forger_1"]=function(){return{
place:"铁匠铺 · 锻造契约",
req:{mat:"精铁块",n:1},
text:["你带着那把浮出金纹的短刀，去了铁匠铺。老铁匠看了看金纹，说：“火认了你。”", "他指着一块生铁：“用你的纹，给它开一条路。”", "你把短刀贴上去。金纹顺着铁面爬开，像水渗进沙里。铁块表面，慢慢浮出一层暗金色的纹路。", "你把它放进炉里。出炉时，铁块成了一枚铁环，环上刻着一圈细纹，和你的金纹一样。", "老铁匠把铁环套在你手腕上：“火认人，铁也认。它认了你，就不会背叛你。”", "你走出铁匠铺。铁环贴着皮肤，凉了一下，又热起来，像一颗活着的心跳。"],pace:"normal",
effect:{"skill":{"s":"craft","v":9},"flag":"v489_sub_forger","attr":{"CON":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_machinist_1"]=function(){return{
place:"地下车间 · 认主",
req:{mat:"黄铜齿轮",n:1},
text:["那只机械鸟又来找你了。它蹲在工作台上，歪着头，啄了啄你摊开的图纸。", "你给它换了一枚新齿轮。它试着扇了扇翅膀，发出一种新的、更顺滑的响声。", "你试着给它一个指令：“去窗台上。”", "它飞起来，落在窗台上，回头看你，像在等下一句。", "你又下了一个指令：“回来。”它飞回你的肩头，收拢翅膀，安静地站着。", "你摸了摸它的脑袋。它用喙啄了啄了啄你的指尖，像在记你的味道。", "你听见车间深处传来一声极轻的齿轮声，像什么被启动了。"],pace:"normal",
effect:{"skill":{"s":"craft","v":8},"flag":"v489_sub_machinist","attr":{"INT":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_bloodsorcerer_1"]=function(){return{
place:"储酒室 · 共鸣",
req:{mat:"兽血",n:1},
text:["储酒室的旧酒桶底下，压着一块黑石。你搬开酒桶，黑石表面浮着一层暗红的光，像血没干透。", "你蹲下来，伸手碰它。指尖刚触到，你心里涌起一阵陌生的燥热，从胸口往上爬。", "你收手。燥热退下去，但你的心跳比平时快了半拍。", "你听见一个声音，从你自己身体里传出来的：“你身上，有和它一样的东西。”", "你把黑石放回原处，搬回酒桶。走出储酒室，你发现自己的掌心，多了一道暗红色的线，像血管浮出皮肤。", "你用袖子盖住它。那道线贴着皮肤，温温的，像在应你。"],pace:"normal",
effect:{"skill":{"s":"magic","v":7},"flag":"v489_sub_bloodsorcerer","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_berserker_1"]=function(){return{
place:"演武场 · 怒意收放",
req:{mat:"狂兽之牙",n:1},
text:["演武场的木桩换了一根新的，教官说：“先打它一百下，再说话。”", "你打到第四十下的时候，心里那团火又拱上来。你听见自己的呼吸变粗，眼前发红。", "你停下来。教官站在旁边，没有说话。", "你站在原地，把呼吸放慢，一下，一下。火气没有散，但它不再拱了——它在你心里蹲下来，像一头被驯住的兽。", "你重新举起拳。这一拳，没有刚才的重，但木桩上，留下了一个更深的印子。", "教官点点头：“今天教你的是——怒意是你的，别让它骑在你头上。”", "你走出演武场。晚风一吹，你才发现后背全湿了。"],pace:"normal",
effect:{"skill":{"s":"martial","v":8},"flag":"v489_sub_berserker","attr":{"STR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_weaponmaster_1"]=function(){return{
place:"武库 · 手感",
req:{mat:"旧剑刃",n:1},
text:["武库的墙上挂满了兵器。你走过去，挨个摸了一遍。", "摸到第三把剑的时候，你的手自己停住了——不是你想停，是剑柄的重量，刚好压在你掌心最稳的地方。", "你拔出来试了试。剑不重，也不轻，像为你量过。", "你练了一下午。收剑的时候，你发现自己的手腕，学会了三个新的发力点——不是书上教的，是剑自己告诉你的。", "武库的看守坐在门口，抽着烟：“挑兵器就像挑人，合不合适的，手知道。”", "你把剑放回架上，只记下了它的位置。你走出武库，手还在发痒。"],pace:"normal",
effect:{"skill":{"s":"martial","v":8},"flag":"v489_sub_weaponmaster","attr":{"AGI":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_shieldguard_1"]=function(){return{
place:"箭楼 · 盾墙防线",
req:{mat:"铁钉",n:1},
text:["箭楼的哨兵借给你一面旧盾。盾面上坑坑洼洼，全是箭痕。", "你举盾，试着挡住射来的木箭。第一轮，你中了三箭。", "你蹲下来，调整了重心——把盾脚扎进土里，肩胛抵住盾背，像一堵墙那样站住。", "第二轮，木箭全被弹开，叮叮当当落了一地。", "哨兵拍了拍盾面：“盾不是挡箭的，是让后面的人不用挡箭的。”", "你把盾还回去。走下箭楼，你的肩胛骨还在发烫，像刚被什么东西撑开过。"],pace:"normal",
effect:{"skill":{"s":"martial","v":7},"flag":"v489_sub_shieldguard","attr":{"CON":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_warlord_1"]=function(){return{
place:"沙盘室 · 布阵",
req:{mat:"旧军旗",n:1},
text:["沙盘室的沙盘上，插着几面小旗。教官说：“给你一队人，你布个阵。”", "你把旗子拔了重插——盾在前，弓在侧，留一条后路。", "教官看着沙盘，没有评价。他推倒你一面旗，模拟敌军绕后。", "你重新布。这一次，你把自己的主旗，放进了最不显眼的位置。", "教官笑了：“记住，为将者，不站最高处。”", "他走后，你站在沙盘前，看着那面小小的主旗，在心里把那句话又默了一遍。"],pace:"normal",
effect:{"skill":{"s":"martial","v":7},"flag":"v489_sub_warlord","attr":{"INT":1,"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_paladin_1"]=function(){return{
place:"教堂后园 · 圣光初绽",
req:{mat:"圣城长明灯芯",n:1},
text:["你帮教堂修围栏的时候，那块石碑还立在墙根。你路过，又看了一眼那行字：“立誓之人，其誓不移。”", "你蹲下来，把左手按在碑上。", "这一次，你的手没有发凉。碑面上，你的掌印边缘，泛起一层极淡的白光，像清晨的雾。", "你缩回手。光散了。但你看见自己的指尖，还留着一线白，像没退尽的月光。", "你站起来，试着握拳。那一线白，顺着指缝，流进你的掌心，消失了。", "你走出教堂。晚风里，你发现自己握拳的时候，心里比平时稳了一点。"],pace:"normal",
effect:{"skill":{"s":"holy","v":9},"flag":"v489_sub_paladin","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_protector_1"]=function(){return{
place:"教堂侧廊 · 圣盾",
req:{mat:"圣水",n:1},
text:["你路过侧廊，又看见那个老妇。她这次没有跪着，坐在长椅上，身边放着一块干饼，没动。", "你走过去，把外套脱下来，披在她肩上。", "她抬头看你。眼睛还是干干的，但她伸手，掰了半块饼，递给你。", "你接过来。饼是冷的，硬邦邦的。你咬了一口。", "你咬下那一口的时候，胸口涌起一阵热，像有什么东西，在你心里立了起来——不是墙，是一面盾。", "老妇看着你，慢慢笑了。她的眼睛还是干的，但嘴角的皱纹，像被什么撑开了一点。", "你走出教堂。披在她肩上的外套，在风里轻晃着。"],pace:"normal",
effect:{"skill":{"s":"holy","v":8},"flag":"v489_sub_protector","attr":{"CON":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_itinerant_1"]=function(){return{
place:"城郊 · 就地审判",
req:{mat:"驿道图",n:1},
text:["你在城郊的路上，遇见两兄妹在争吵。哥哥攥着一袋铜币，妹妹蹲在地上哭。", "你停下来听。哥哥说钱是爹留的，该他管；妹妹说钱是治娘病的，该拿去请大夫。", "你没有立刻开口。你蹲下来，问妹妹：“大夫请了吗？”", "妹妹摇头，指着城里的方向：“请不起。”", "你从自己怀里摸出几枚铜币，放进妹妹手里，又转向哥哥：“钱先治病。治完了，剩下的，你们再分。”", "哥哥愣了愣，把袋子里的铜币倒了一半出来，递给你：“借的，记你账上。”", "你摇摇头，没有接。你站起来，继续赶路。走出很远，你回头，看见那对兄妹还站在路边，哥哥在给妹妹擦眼泪。"],pace:"normal",
effect:{"skill":{"s":"holy","v":7},"flag":"v489_sub_itinerant","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_darkknight_1"]=function(){return{
place:"地牢 · 第一声回应",
req:{mat:"黑曜石刀片",n:1},
text:["你带着那把钥匙，又去了地牢。", "你站在铁门前，没有开门，只是把钥匙握在手心。黑布还缠着，那角温的，还在。", "你问：“你是谁？”", "地牢深处，传来一声拖长的回音。这一次，你听清了——不是铁器刮壁，是有人在哼一支歌，调子很旧，像小时候听过的。", "你攥紧钥匙。黑布底下，那枚倒悬乌鸦的记号，在你掌心，发烫。", "你没有开门。你把钥匙收回口袋，退出走廊。", "阳光照在你脸上。你发现自己的手指，不受控制地在裤腿上，画了一个记号——倒悬的乌鸦。", "你停下来。你看着自己的手，很久没有动。"],pace:"normal",
effect:{"skill":{"s":"martial","v":7},"flag":"v489_sub_darkknight","attr":{"SPR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_hunter_1"]=function(){return{
place:"猎场 · 第一只猎物",
req:{mat:"兽皮",n:1},
text:["你带着弓，又去了猎场。那串蹄印已经干了，但老橡树的方向，有什么东西在等你。", "你蹲在树后，屏住呼吸。傍晚，一头灰白色的鹿从林子里走出来，脚步很轻，像踩着雾。", "你拉开弓。弦声在风里绷紧。", "鹿抬起头，看着你的方向。它的眼睛很亮，像两粒琥珀。", "你想起那根扎破你手指的兽毛。你松开弦，箭没有射出去。", "鹿在原地站了一会儿，转身走进林子，没有跑。", "你放下弓。风从林子里吹出来，带着一股潮湿的、草根的味道。你知道，从今天起，这片猎场，认得你了。"],pace:"normal",
effect:{"skill":{"s":"nature","v":8},"flag":"v489_sub_hunter","attr":{"AGI":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_warden_1"]=function(){return{
place:"后林 · 溪谷回应",
req:{mat:"精灵林间晶露",n:1},
text:["你又去了溪谷。那棵被你扶正的树苗，长高了一截，叶子绿了大半。", "你蹲下来，摸了摸它的枝干。枝干稍一颤，像在应你。", "你听见溪谷里响起水声——不是溪流，是一条细流，从河床的卵石缝里渗出来，慢慢汇成一线。", "你捧起水喝了一口。水是凉的，带着一丝泥土的甜味。", "你坐在树苗旁边，听那线细流响了一下午。", "傍晚，你站起来，准备离开。树苗的叶子，在风里轻摇了摇，像在跟你道别。", "你走出溪谷。回头时，那线细流还在响，细细的，像溪谷在哼一支歌。"],pace:"normal",
effect:{"skill":{"s":"nature","v":8},"flag":"v489_sub_warden","attr":{"CON":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_scout_1"]=function(){return{
place:"城南 · 矮灯再起",
req:{mat:"铁门关军报",n:1},
text:["你又在城南的麦田边蹲了一夜。那盏矮灯，没有亮。", "你正打算回去，忽然看见那口枯井的井沿上，多了一道新的刮痕。不是旧的——你昨天记过旧痕的位置。", "你走过去，蹲下来看。刮痕旁边，压着一粒干泥。干泥里，裹着一片碎麦秆。", "你捻开干泥。麦秆是南边农庄种的——城南的麦田，今年没有种麦。", "你把干泥收进小包，直起身。远处的钟楼敲了三下。", "你往回走，心里把两条线并在一起：北边来的水手结，南边麦田里的碎麦秆。中间隔着一条，你还没看见的路。", "你决定，明天去农庄看看。"],pace:"normal",
effect:{"skill":{"s":"detect","v":9},"flag":"v489_sub_scout","attr":{"AGI":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_beastfriend_1"]=function(){return{
place:"马厩 · 第一句话",
req:{mat:"兽骨",n:1},
text:["灰猫的腿好了，走路不再拖。它还是睡在草垛上，但每天都等你来喂。", "这天傍晚，你蹲在草垛边，给它梳毛。灰猫眯着眼，忽然开口——不是猫叫，是一个气音，像人压着嗓子说话。", "你屏住呼吸，凑近。它又说了一声，这次清楚了些，像两个字。", "你听不懂，但枣红马在旁边喷了个响鼻，像在笑话你。", "你问灰猫：“你在说什么？”", "灰猫看了你一眼，站起来，用尾巴扫了扫你的手腕，跳下草垛，走进暮色里。", "你站在原地。枣红马又喷了个响鼻，这次，你听懂了——它在说：“它说谢谢。”", "你愣了很久。你分不清那是你听懂的马语，还是你编的。但你笑了。"],pace:"normal",
effect:{"skill":{"s":"nature","v":8},"flag":"v489_sub_beastfriend","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_assassin_1"]=function(){return{
place:"宿舍 · 影子练习",
req:{mat:"夜枭羽",n:1},
text:["你开始在影子里练习。不是练影子，是练“不在”。", "你站在墙边，把呼吸放慢，把存在感收起来，像把一盏灯慢慢拧暗。", "第一次，室友推门进来，没有看见你。他在桌上放了本书，又出去了。", "你从墙边走出来，看着那本书。你甚至没有听见自己的脚步声。", "你坐下来，翻开那本书——扉页上写着一行字，是室友的笔迹：“屋里的灯，刚才暗了一下。”", "你合上书。你把那行字看了很久，然后，你把书放回原处，假装什么都没发生。", "你知道，从今晚起，你学会了“不在”的第一课。"],pace:"normal",
effect:{"skill":{"s":"stealth","v":9},"flag":"v489_sub_assassin","attr":{"AGI":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_burglar_1"]=function(){return{
place:"仓库 · 锁孔记忆",
req:{mat:"旧铜锁",n:1},
text:["你回到仓库，那口铜盒还放在杂物间最里面。你把它取出来，放在月光下。", "你转了一下铜盘。这次你没有想打开它——你只是听。铜盘转动的声音，有七个齿，三个松，四个紧。", "你记住这个顺序。咔嗒一声，盒子开了。", "里面还是那把铜钥匙和那张纸条。你没有拿。你合上盖子，让铜盘转回原位，咔嗒，锁住。", "你把它放回原处。走出仓库，你的手指，还在回味那七个齿的松紧。", "你知道，锁不是用来防你的。它只是在等你记住它。"],pace:"normal",
effect:{"skill":{"s":"stealth","v":8},"flag":"v489_sub_burglar","attr":{"INT":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_spy_1"]=function(){return{
place:"铁匠铺 · 面具",
req:{mat:"暗蚀会文书",n:1},
text:["你路过城南铁匠铺，老周还坐在门槛上抽烟。他看见你，招了招手。", "你走过去。他递给你一个纸包：“有人托我给你的。”", "你打开。纸包里是一张薄薄的银面具，没有五官，只有两个眼孔。", "“谁给的？”你问。", "老周吐出一口烟：“他没说。只说他认得你。”", "你把面具收进怀里。走出铁匠铺，你摸了一下面具——银面是温的，像刚被人戴过。", "你站在街角，犹豫了一下，没有戴上它。但你把它贴身收好了。"],pace:"normal",
effect:{"skill":{"s":"stealth","v":7},"flag":"v489_sub_spy","attr":{"CHA":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_faceless_1"]=function(){return{
place:"澡堂 · 第一次换脸",
req:{mat:"无面蜡",n:1},
text:["你站在更衣间的铜镜前，又画了一个圈。", "水汽顺着圈痕流下来。镜面里，你的脸正常地回望着你——但这次，你试着让它变。", "你想着一个你见过的人：食堂那个总是低着头的学徒。", "镜面里的脸，慢慢变了——眉骨低了一点，颧骨平了一点，眼神垂下来。", "你看着那张陌生的脸，心里涌起一阵说不清的感觉。你抬手，镜中人也抬手。", "你退后一步。镜中的脸，慢慢变回你自己的。", "你穿好衣服，走出澡堂。路上，你试着低了一下头——你发现，低头的时候，没有人看你。"],pace:"normal",
effect:{"skill":{"s":"stealth","v":7},"flag":"v489_sub_faceless","attr":{"SPR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_healer_1"]=function(){return{
place:"医务室 · 第一次成愈",
req:{mat:"药草",n:1},
text:["医师又让你去换药。这回躺着的，是一个烧伤的学徒，手臂裹着纱布，疼得直抽气。", "你蹲下来，解开纱布。伤口红得发亮，药粉黏在上面。", "你的指尖又开始发凉。你把手覆在伤口上方，让那股凉意流下去。", "学徒的抽气声慢慢停了。他睁开眼，看着你，小声说：“不疼了。”", "医师站在门口，没有说话。你收手的时候，指尖凉得发麻。", "你走出医务室，靠在墙上，喘匀气。", "医师跟出来，递给你一卷白布：“以后，重伤的，都归你。”他没有说谢，但你听懂了。"],pace:"normal",
effect:{"skill":{"s":"heal","v":9},"flag":"v489_sub_healer","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_inquisitor_1"]=function(){return{
place:"教堂 · 第一道圣裁",
req:{mat:"净化令文书",n:1},
text:["你又在告解室外听见了那个声音。这次，只有一个人。", "“……我守不住那个秘密了。”", "你站在门外，没有动。你听见里面的人哭了起来，很轻，像怕被人听见。", "你推开门。告解室里坐着一个年轻人，脸上全是汗。他看见你，愣住了。", "你在他对面坐下，说：“说吧。”", "他把话讲完了——一件他藏在心里三年的错事。你听完，没有评判，只问：“你愿意去把它还回去吗？”", "他点头，像卸下了一副重担。你走出告解室，阳光很亮。你发现，自己心里那个“该不该管”的问题，有了答案。"],pace:"normal",
effect:{"skill":{"s":"holy","v":8},"flag":"v489_sub_inquisitor","attr":{"SPR":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_warpriest_1"]=function(){return{
place:"武场 · 战牧合一",
req:{mat:"圣徽",n:1},
text:["你在靶场又遇见了那个练箭的女孩。她已经能拉开弓了，箭上了环。", "她看见你，眼睛一亮：“你看！”", "你蹲下来，这次教了她一个不一样的——“握弓的时候，心里想着你要护住的人。”", "她似懂非懂地试了试。箭离弦，钉在靶心。", "她欢呼起来。你看着靶心那支箭，忽然明白了一件事——神术和武技，从来不是两样东西。", "它们都是“护住”这个词的两种写法。", "你走出靶场。晚风里，你的手，一半是握过弓的，一半是握过圣像的。"],pace:"normal",
effect:{"skill":{"s":"holy","v":7},"flag":"v489_sub_warpriest","attr":{"CON":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_ascetic_1"]=function(){return{
place:"苦修室 · 石头回应",
req:{mat:"苦修石",n:1},
text:["你又去苦修室送饭。老修士还跪在那块石头前。", "你放下饭，没有走。你跪在他旁边，一起看着那块石头。", "石头上的裂缝，比上次宽了一点。你盯着那条缝，看了很久。", "你忽然听见一声极轻的响，像石头深处有什么东西翻了个身。", "老修士睁开眼，看着你：“你也听见了？”", "你点头。他又闭上眼：“九年前，我听见第一声的时候，还以为是幻觉。”", "你陪他坐了一炷香。走出苦修室的时候，你发现自己的掌心，也出现了一道细纹，和石头上的裂缝，一样的走向。"],pace:"normal",
effect:{"skill":{"s":"will","v":8},"flag":"v489_sub_ascetic","attr":{"SPR":2}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_merchant_1"]=function(){return{
place:"集市 · 第一笔眼光",
req:{mat:"银月商会券",n:1},
text:["你帮老板娘进货回来，她多给了你三枚铜币：“学得快。”", "你拿着铜币，在集市上转了一圈。你在一个卖旧货的摊子前停下来——摊上有一只陶碗，碗沿缺了个口，摊主要价很低。", "你蹲下来，翻过碗底。碗底有一个极小的印记，像某个商会的章。", "你花两枚铜币买下它。摊主乐得直点头。", "你端着碗，找到商会的人。他们看了碗底的印，当场出价二十枚铜币。", "你没有卖。你把碗收进怀里，走回食堂。老板娘看见你怀里的碗，笑了：“眼光练出来了。”", "你回到宿舍，把碗放在桌上。碗沿的缺口，在月光下，像一只半睁的眼睛。"],pace:"normal",
effect:{"skill":{"s":"bargain","v":9},"flag":"v489_sub_merchant","attr":{"CHA":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_banker_1"]=function(){return{
place:"账房 · 第一本账",
req:{mat:"旧商队账册",n:1},
text:["你开始跟账房先生学认账。他教你的第一课，不是算术，是“看”。", "他指着账本上一笔旧账：“这笔，记的是粮食。你看出什么？”", "你看了半天：“……买价和卖价，差了四成。”", "他点头：“四成里，三成是利，一成是线。那一成，不是粮食。”", "你没有问那一成是什么。但你把那笔账记在了心里。", "晚上你回宿舍，把那笔账默写了一遍。你看着那串数字，忽然觉得，它们像一排脚印——通向一个你还没看清的地方。", "你合上本子。你开始明白，账房先生说的“看”，是看账本背后的人。"],pace:"normal",
effect:{"skill":{"s":"trade","v":8},"flag":"v489_sub_banker","attr":{"INT":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_auctioneer_1"]=function(){return{
place:"礼堂 · 第一次造势",
req:{mat:"拍卖槌",n:1},
text:["学院又要办拍卖会。这次，你主动接了登记台的活。", "你悄悄做了一件事：把那把流拍的旧匕首，摆在最显眼的角落，旁边放了一盏灯，让刀柄上的精灵文，正好落在光里。", "拍卖开始，果然有人问那把匕首。你报了三次价，让价格翻了五倍。", "成交后，买主是个学者，捧着匕首，像捧着珍宝。", "散场后，学院长路过登记台，看了你一眼：“那把匕首，值那个价吗？”", "你老实说：“不知道。但有人觉得值，它就值。”", "学院长没有接话。他走的时候，脚步比来时慢了半拍。"],pace:"normal",
effect:{"skill":{"s":"persu","v":8},"flag":"v489_sub_auctioneer","attr":{"CHA":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

N["sub_smuggler_1"]=function(){return{
place:"码头 · 第一条暗线",
req:{mat:"禁运货单",n:1},
text:["你打听到，那批压着枯叶箱子的货，是从北边一条旧航线运来的。那条航线，三年前就废了。", "你去了码头，找到一艘系在角落的旧船。船夫是个瘦老头，看见你，先开了口：“你找错船了。”", "“我没找船。”你说，“我找那批枯叶。”", "他看了你很久，从舱底摸出一只木箱，箱盖上压着一片干麦秆，和你在井沿看到的一样。", "“你认识？”他问。", "你摇头：“不认识。但我认识压着它的那只手。”", "老头笑了，把木箱推过来：“那你也认识我。”", "你把木箱带回去，没有打开。你把它放在床底下，你知道，从今晚起，你有了第一条线。"],pace:"normal",
effect:{"skill":{"s":"trade","v":7},"flag":"v489_sub_smuggler","attr":{"AGI":1}},
options:[{t:"把这段路记进心里", go:"sub_path_hub"},
{t:"回到日常，明天再来", go:"sub_path_hub"}]}};

/*v489inj:rit*/
N["sub_elemental_g"]=function(){return{
place:"火晶尘 · 仪式之约",
text:["你想起导师在元素课上说过的一句话：“火认人，也认路。你要让火走你的路，得先给火一粒它的尘。”", "风炉间的人说，炉膛里的火晶尘，每月清一次，清出来的细尘都收在炉边的陶罐里。", "那是火自己褪下的皮。用它做引子，火才会记得你的手。", "从仪式之约出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"light",
options:[{t:"就地寻找火晶尘", go:"sub_elemental_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_elemental_g2"]=function(){return{
place:"风炉间 · 炉边陶罐",
text:["你掀开炉边的陶罐。罐底积着一层亮晶晶的细尘，在暗处泛着暗红。", "你用小勺舀了一撮，装进纸包。指尖隔着纸，还是热的。"],pace:"light",
effect:{mat:"火晶尘",flag:"v489_got_elemental"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_conjurer_g"]=function(){return{
place:"旧纸人 · 仪式之约",
text:["咒法课的前辈听说你想学召唤，笑了笑：“纸人不难画，难的是让它记住你。”", "“先找个旧纸人——画过很多次、被改过很多次的。它身上有前一个主人的笔意。”", "学院杂物间最里面的旧柜里，据说就压着一叠这样的纸人。", "离开仪式之约时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"light",
options:[{t:"就地寻找旧纸人", go:"sub_conjurer_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_conjurer_g2"]=function(){return{
place:"学院杂物间 · 旧柜最底",
text:["你翻到柜子最底层，抽出一叠纸人。纸已经泛黄，腿脚处补了三次，笔迹歪歪扭扭。", "你挑了一张最旧的，揣进怀里。纸人贴着胸口，像一张温顺的纸。"],pace:"light",
effect:{mat:"旧纸人",flag:"v489_got_conjurer"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_arcane_g"]=function(){return{
place:"静默墨 · 仪式之约",
text:["档案馆的旧结界图，落款处有一行小字：“以静默墨写印，结界方成。”", "静默墨是图书馆抄本室才有的东西——干了之后仍会渗墨，蘸它写字，笔尖不响。", "抄写员说，那墨是给抄遗书的人用的。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找静默墨", go:"sub_arcane_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_arcane_g2"]=function(){return{
place:"图书馆 · 抄本室墨缸",
text:["你帮抄写员校完一卷旧卷。他指指角落的墨缸：“要写封条？自己舀。”", "你舀了一小瓶。墨色极黑，凑近了，闻不到一点味道。"],pace:"light",
effect:{mat:"静默墨",flag:"v489_got_arcane"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_necromancer_g"]=function(){return{
place:"骨灰 · 仪式之约",
text:["守望者的老前辈听说你在坟场练银线，没有拦你，只留下一句：“亡者之事，用亡者之物。”", "他说后山老槐树下的土，每年清明会有人去撒一把灰——那是烧给无主孤魂的。", "那灰，就是引子。", "仪式之约的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",
options:[{t:"就地寻找骨灰", go:"sub_necromancer_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_necromancer_g2"]=function(){return{
place:"后山坟场 · 老槐树下",
text:["你蹲在老槐树下，拨开枯叶。土里果然混着一层灰白的细灰，散着一股说不清的凉。", "你用陶罐装了一小罐，盖紧。起身时，风绕着你走了一圈。"],pace:"light",
effect:{mat:"骨灰",flag:"v489_got_necromancer"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_medium_g"]=function(){return{
place:"旧钟绳 · 仪式之约",
text:["钟楼的守钟人是个哑巴，但他会写字。他在你手心写：“听钟的人，先碰过钟绳。”", "顶层那口旧钟的钟绳，换过三次，旧绳都堆在角落。", "绳上缠着一截褪色的红布——是上一任守钟人的记号。", "你收拾停当，离开仪式之约，沿着来路踏上行程。"],pace:"light",
options:[{t:"就地寻找旧钟绳", go:"sub_medium_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_medium_g2"]=function(){return{
place:"钟楼顶层 · 旧绳堆",
text:["你爬上顶层，在旧绳堆里翻出一截最旧的。绳股磨得发亮，像被握了一辈子。", "你把红布那一截剪下来，收进口袋。楼下，钟正好敲了一下。"],pace:"light",
effect:{mat:"旧钟绳",flag:"v489_got_medium"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_hypnotist_g"]=function(){return{
place:"烛泪 · 仪式之约",
text:["医师教你的第一课不是火，是蜡：“火苗可以骗，烛泪骗不了。你看一支蜡烛烧到第几夜，就知道它有没有心事。”", "教堂清晨收烛台时，会刮下隔夜的烛泪。那泪里，凝着前一晚所有祈祷的重量。", "用隔夜的烛泪点新火，火会记得前一夜。", "你收拾停当，离开仪式之约，沿着来路踏上行程。"],pace:"light",
options:[{t:"就地寻找烛泪", go:"sub_hypnotist_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_hypnotist_g2"]=function(){return{
place:"教堂 · 清晨烛台",
text:["你清晨第一个进教堂，收烛台时，把凝在烛台边的白蜡泪刮进小瓶。", "蜡泪凉了，但指尖留下一丝焦甜。你盖好瓶塞。"],pace:"light",
effect:{mat:"烛泪",flag:"v489_got_hypnotist"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_soulbinder_g"]=function(){return{
place:"契约纸 · 仪式之约",
text:["缚魂者的传承里有一句老话：“约，要写在能烧的纸上。烧了，才算数。”", "城西文书铺的契约纸，是羊皮做的，边角压着火漆。文书匠说，那纸经得起改写。", "你需要的，是一张空白的、还没被写过的契约纸。", "离开仪式之约时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"light",
options:[{t:"就地寻找契约纸", go:"sub_soulbinder_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_soulbinder_g2"]=function(){return{
place:"城西 · 文书铺",
text:["文书匠正打瞌睡。你放了两枚铜币在柜上，抽走一页裁好的羊皮纸。", "他眼皮也没抬：“要写契？找对人了。”"],pace:"light",
effect:{mat:"契约纸",flag:"v489_got_soulbinder"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_alchemist_g"]=function(){return{
place:"银液 · 仪式之约",
text:["你坩埚里那瓶用不完的银液，其实不是你的——炼金同业会的人说，那是“初液”，每一炉都从它分出来。", "真正的银液，只认蒸馏台。谁在台上守满三炉，它才认谁。", "你自己的那瓶，就是。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找银液", go:"sub_alchemist_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_alchemist_g2"]=function(){return{
place:"术士工坊 · 蒸馏台",
text:["你回到自己的蒸馏台，那瓶银液还搁在老位置，瓶口悬着一滴，不落。", "你把它装进新瓶，贴好标签。银液在瓶里晃了晃，像应了你一声。"],pace:"light",
effect:{mat:"银液",flag:"v489_got_alchemist"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_forger_g"]=function(){return{
place:"精铁块 · 仪式之约",
text:["老铁匠看了一眼你的铁环：“火认了你，铁还没认。”", "“铁认人，靠的是精铁——千锤百炼、没夹过渣的。公会铁匠铺里有，修好霍根的锻锤，他会给你一块。”", "精铁块是铁的骨头。用它做引，铁才会听你的话。", "从仪式之约出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"light",
options:[{t:"就地寻找精铁块", go:"sub_forger_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_forger_g2"]=function(){return{
place:"自由城邦 · 公会铁匠铺",
text:["你帮霍根修好那柄断了柄的锻锤。他掂了掂，从炉边摸出一块沉甸甸的精铁，抛给你。", "铁块还带着炉火的余温。你握在手里，像握着一小块凝固的太阳。"],pace:"light",
effect:{mat:"精铁块",flag:"v489_got_forger"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_machinist_g"]=function(){return{
place:"黄铜齿轮 · 仪式之约",
text:["机械鸟啄了啄你的图纸，又啄了啄桌角——那有个凹痕，正好是齿轮的形状。", "你懂了：它要一枚齿轮。东境工坊的废料箱里，这样的齿轮多得是。", "旧的齿轮最好，齿缝里嵌着上一个造物主的黑油。", "出了仪式之约，风迎面扑来。你认了认方向，启程。"],pace:"light",
options:[{t:"就地寻找黄铜齿轮", go:"sub_machinist_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_machinist_g2"]=function(){return{
place:"东境工坊 · 废料箱",
text:["你在废料箱里翻出一枚黄铜齿轮，齿缝里嵌着黑油，转起来咔咔响。", "你擦干净，装进口袋。机械鸟歪着头，看着你的口袋，像在点数。"],pace:"light",
effect:{mat:"黄铜齿轮",flag:"v489_got_machinist"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_bloodsorcerer_g"]=function(){return{
place:"兽血 · 仪式之约",
text:["你掌心的暗红色线，这几天又深了一点。你问医师，他摇头：“这不是病。”", "猎场的老猎户说，血脉的事，要用兽血应——不是杀生，是取一头自愿的兽的血。", "猎场屠宰棚里，每天都有猎户分好的小皮囊。", "仪式之约在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
options:[{t:"就地寻找兽血", go:"sub_bloodsorcerer_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_bloodsorcerer_g2"]=function(){return{
place:"猎场 · 屠宰棚",
text:["你帮猎户剥了一下午皮。收工时，他塞给你一小皮囊：“温的，趁热用。”", "皮囊隔着一层皮，还是温的。你把它贴身收好。"],pace:"light",
effect:{mat:"兽血",flag:"v489_got_bloodsorcerer"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_berserker_g"]=function(){return{
place:"狂兽之牙 · 仪式之约",
text:["教官听说你想走狂战士的路，沉默了一会儿：“怒意是兽。驯兽，要先有兽的东西。”", "“狂兽之牙——草原上发狂的兽，牙根带着血。拿它当引，你的怒意才知道谁说了算。”", "猎场深处，偶尔能捡到这样的牙。", "仪式之约的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"light",
options:[{t:"就地寻找狂兽之牙", go:"sub_berserker_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_berserker_g2"]=function(){return{
place:"猎场深处 · 枯树下",
text:["你在猎场深处一棵枯树下，捡到一根獠牙。牙根干着血，沉得不像牙。", "你把它收进怀里。握着它，你心里那头兽，安静了一下。"],pace:"light",
effect:{mat:"狂兽之牙",flag:"v489_got_berserker"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_weaponmaster_g"]=function(){return{
place:"旧剑刃 · 仪式之约",
text:["武库看守说，你摸剑的手感是天生的，但还差一味：“旧剑刃。”", "“断过的剑，刃口还留着一点寒光。那点寒光里，是前一任剑主的握法。”", "武库报废架上，这样的断剑有一堆。", "仪式之约的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"light",
options:[{t:"就地寻找旧剑刃", go:"sub_weaponmaster_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_weaponmaster_g2"]=function(){return{
place:"武库 · 报废架",
text:["你在报废架上抽出一柄断剑。剑身锈了，但刃口还有一点寒光。", "你握着它，试着找那个发力点——找到了。你的手，比刚才更稳了。"],pace:"light",
effect:{mat:"旧剑刃",flag:"v489_got_weaponmaster"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_shieldguard_g"]=function(){return{
place:"铁钉 · 仪式之约",
text:["箭楼哨兵听你说要学盾阵，点点头：“盾不是铁打的，是钉子钉的。”", "“一块盾要经得住，全靠每颗钉子都咬住木头。找一枚旧铁钉——弯过又直回来的那种。”", "铁匠铺的废渣堆里，这样的钉子多得是。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找铁钉", go:"sub_shieldguard_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_shieldguard_g2"]=function(){return{
place:"铁匠铺 · 废渣堆",
text:["你在废渣堆里翻出一枚铁钉，钉帽上有一道旧捶痕，弯过又直了回来。", "你把它收进口袋。夜里，你把它放在枕边，硌着，像在提醒你什么。"],pace:"light",
effect:{mat:"铁钉",flag:"v489_got_shieldguard"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_warlord_g"]=function(){return{
place:"旧军旗 · 仪式之约",
text:["军略课教官带你去军需库，指着一面旧旗：“为将者，先学会认旗。”", "“旧旗上烧过的洞，是它替你挡过的祸。拿一截旧旗做引，你的阵，才记得自己是谁的阵。”", "军需库的旧物资里，收着历年换下来的旗。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找旧军旗", go:"sub_warlord_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_warlord_g2"]=function(){return{
place:"学院军需库",
text:["你替军需官整理旧物资，从箱底抽出一面旧旗。旗边烧了一个洞，洞沿是焦的。", "你剪下一小条，叠好收进怀里。军需官看见了，没说话，只点了点头。"],pace:"light",
effect:{mat:"旧军旗",flag:"v489_got_warlord"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_paladin_g"]=function(){return{
place:"圣城长明灯芯 · 仪式之约",
text:["老修士教你的不是祷告，是灯：“圣辉不灭，是因为有人添油。”", "“圣城长明灯烧了三百年的灯芯，是圣辉的根。你要立誓，先借一段根。”", "圣城教堂的圣坛，长明灯从不断。灯芯每年换一次，换下来的都收在圣物柜。", "仪式之约在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
options:[{t:"就地寻找圣城长明灯芯", go:"sub_paladin_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_paladin_g2"]=function(){return{
place:"圣城 · 圣坛灯芯",
text:["你跪在圣坛前，向守灯修士求一段换下来的旧灯芯。他看了你很久，剪下一小段，放在你掌心。", "灯芯是温的，像烧了三百年的余温，还留在上面。"],pace:"light",
effect:{mat:"圣城长明灯芯",flag:"v489_got_paladin"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_protector_g"]=function(){return{
place:"圣水 · 仪式之约",
text:["侧廊的老妇教会你一件事：护着别人，自己先要立得住。", "立得住的法子，在圣水里——清晨弥撒前取一小瓶，沾在额上，心里那面盾才不会锈。", "教堂圣坛的铜瓶里，盛着隔夜的圣水。", "出了仪式之约，风迎面扑来。你认了认方向，启程。"],pace:"light",
options:[{t:"就地寻找圣水", go:"sub_protector_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_protector_g2"]=function(){return{
place:"教堂 · 圣坛铜瓶",
text:["你清晨第一个到教堂，从圣坛铜瓶里倒了一小瓶圣水。", "水隔着瓶壁，凉得透心。你握了一会儿，掌心慢慢热起来。"],pace:"light",
effect:{mat:"圣水",flag:"v489_got_protector"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_itinerant_g"]=function(){return{
place:"驿道图 · 仪式之约",
text:["驿丞听说你要走四方，从旧图柜里抽出一张图：“巡游的人，先认路。”", "“这张图是废的——上面的路标，三年没更新了。可它记着所有走错过的路。”", "走错过的路，比走对的路，更值得记。", "你与仪式之约作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"light",
options:[{t:"就地寻找驿道图", go:"sub_itinerant_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_itinerant_g2"]=function(){return{
place:"驿站 · 旧图柜",
text:["驿丞把那张废图推给你。墨线被雨水洇过，像蛛网。", "你折好收进怀里。走出驿站，你忽然觉得，这张图在教你看路的另一种方法。"],pace:"light",
effect:{mat:"驿道图",flag:"v489_got_itinerant"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_darkknight_g"]=function(){return{
place:"黑曜石刀片 · 仪式之约",
text:["地牢深处的歌声，你又听见了一次。这次，你听清了一句：“黑曜石认得夜里的人。”", "黑曜石刀片，沙漠深处的石头打磨成的。锋利得能划开月光，也划得开旧誓。", "废矿的尽头，有人埋过一片。", "仪式之约的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",
options:[{t:"就地寻找黑曜石刀片", go:"sub_darkknight_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_darkknight_g2"]=function(){return{
place:"死亡沙漠 · 废矿尽头",
text:["你在废矿尽头，从碎石堆里刨出一片黑曜石刀片。刃口冰凉，像刚从月光里捞出来。", "你把它收进怀里。口袋里的钥匙，轻响了一下，像应了它。"],pace:"light",
effect:{mat:"黑曜石刀片",flag:"v489_got_darkknight"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_hunter_g"]=function(){return{
place:"兽皮 · 仪式之约",
text:["猎场看守听你说要学追猎，指指墙上的兽皮：“猎人的手，先认皮。”", "“兽皮是兽的一生。硝过的硬皮，摸得出它跑过哪些地方。”", "猎场晒皮架上，晾着新硝的兽皮。", "你与仪式之约作别，踏上旅途。尘土扑上靴面，像旧识。"],pace:"light",
options:[{t:"就地寻找兽皮", go:"sub_hunter_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_hunter_g2"]=function(){return{
place:"猎场 · 晒皮架",
text:["你从晒皮架上取下一小块边角料，皮面硝得发硬，纹路粗粝。", "你把它揣进怀里。手指划过皮面时，像划过一片跑过很远的地方。"],pace:"light",
effect:{mat:"兽皮",flag:"v489_got_hunter"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_warden_g"]=function(){return{
place:"精灵林间晶露 · 仪式之约",
text:["巡林者前辈教你看树：“树不说谎。你要守一片林，先喝一口林的记忆。”", "精灵林间的晶露，是精灵收集百年的晨露。喝下它，能看见森林的记忆。", "银叶城边缘的杉树林，黎明前最浓。", "仪式之约在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
options:[{t:"就地寻找精灵林间晶露", go:"sub_warden_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_warden_g2"]=function(){return{
place:"银叶城 · 杉树林黎明",
text:["你在黎明前走进杉树林，用晶瓶接了一瓶晨露。露水凝在叶尖，像碎了一地的月光。", "你封好晶瓶。瓶里的露水，在暗处泛着微光。"],pace:"light",
effect:{mat:"精灵林间晶露",flag:"v489_got_warden"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_scout_g"]=function(){return{
place:"铁门关军报 · 仪式之约",
text:["哨兵长教你看风向，也教你看纸：“北边的军报，一个月来三封。”", "“你需要的，是那封写着『无战事』、页角墨迹却是新的——有人不想让战事被人知道。”", "驿站的信筒里，这样的军报，偶尔会混进来。"],pace:"light",
options:[{t:"就地寻找铁门关军报", go:"sub_scout_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_scout_g2"]=function(){return{
place:"驿站 · 信筒",
text:["你帮驿丞分信，从信筒里抽出一封角墨尚新的军报。上面写着『无战事』，墨迹却是新的。", "你记下内容，把信放回原处。走出驿站，你心里那条线，又清晰了一寸。"],pace:"light",
effect:{mat:"铁门关军报",flag:"v489_got_scout"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_beastfriend_g"]=function(){return{
place:"兽骨 · 仪式之约",
text:["灰猫带你去溪谷，蹲在一节兽骨前，不走。", "你懂了：兽语者要学兽的言语，先有一件兽的东西。", "溪谷里的兽骨，被水冲得光洁，风一吹会响——那是兽留给风的语言。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找兽骨", go:"sub_beastfriend_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_beastfriend_g2"]=function(){return{
place:"猎场边缘 · 溪谷",
text:["你捡起那节兽骨。骨面光滑，风穿过骨孔，发出一声细细的哨音。", "你把它系在腰上。灰猫蹭了蹭你的腿，像是满意了。"],pace:"light",
effect:{mat:"兽骨",flag:"v489_got_beastfriend"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_assassin_g"]=function(){return{
place:"夜枭羽 · 仪式之约",
text:["你练“不在”练到第三夜，窗台上落了一根漆黑的羽毛。", "不是鸟掉的——是夜枭自己拔下来，放在那里的。夜枭是夜里的猎手，它认得同类。", "钟楼顶的夜枭，每夜都在那里。它偶尔会留下这样的信物。", "出了仪式之约，风迎面扑来。你认了认方向，启程。"],pace:"light",
options:[{t:"就地寻找夜枭羽", go:"sub_assassin_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_assassin_g2"]=function(){return{
place:"钟楼顶 · 夜",
text:["你在钟楼顶守到半夜。那只夜枭蹲在檐角，看着你。", "你伸出手。它偏了偏头，把一根羽毛放在你掌心，展翅飞走了。"],pace:"light",
effect:{mat:"夜枭羽",flag:"v489_got_assassin"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_burglar_g"]=function(){return{
place:"旧铜锁 · 仪式之约",
text:["你回味着铜盒那七个齿的松紧，手痒得厉害。", "城西杂货摊的摊主说：“锁匠的手，是旧锁喂出来的。找一把钥匙丢了的旧锁，慢慢听。”", "旧货摊上，这样的铜锁摆了一排。", "仪式之约已被抛在身后。路在脚下延伸，你不回头，行至前方。"],pace:"light",
options:[{t:"就地寻找旧铜锁", go:"sub_burglar_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_burglar_g2"]=function(){return{
place:"城西 · 杂货摊",
text:["你花几枚铜币，从旧货摊上买了一把没钥匙的旧铜锁。锁芯磨得发亮。", "你把它握在手心，听着锁舌轻咬合的声音，像听一个老朋友说话。"],pace:"light",
effect:{mat:"旧铜锁",flag:"v489_got_burglar"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_spy_g"]=function(){return{
place:"暗蚀会文书 · 仪式之约",
text:["你顺着那条线，摸到了一点暗蚀会的东西。", "档案室主任的账册、城南铁匠铺的纸条——这些线索的源头，都指向一种文书。", "暗蚀会文书，字迹工整，落款只有一个倒悬的钟。地下世界里，这东西能换一条命。", "从仪式之约出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"light",
options:[{t:"就地寻找暗蚀会文书", go:"sub_spy_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_spy_g2"]=function(){return{
place:"城北湿地 · 旧窖",
text:["你在城北湿地边的旧窖里，找到一封暗蚀会文书。字迹工整，落款是倒悬的钟。", "你记下内容，把文书放回原处。走出旧窖，你的手很稳。"],pace:"light",
effect:{mat:"暗蚀会文书",flag:"v489_got_spy"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_faceless_g"]=function(){return{
place:"无面蜡 · 仪式之约",
text:["你看着镜子里自己的脸，忽然想：这张脸，是不是也可以不是你的？", "面具匠说，无面蜡能塑成任何形状，就是捏不成一张脸——因为捏蜡的手，就是脸的主人。", "澡堂更衣间的梳妆台角落，刮着这样的蜡。", "仪式之约在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
options:[{t:"就地寻找无面蜡", go:"sub_faceless_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_faceless_g2"]=function(){return{
place:"澡堂 · 梳妆台角落",
text:["你在梳妆台角落刮下一小团无面蜡。没有颜色，捏着能塑成任何形状。", "你把它包好收进口袋。走出澡堂时，你发现自己走路的方式，变了半拍。"],pace:"light",
effect:{mat:"无面蜡",flag:"v489_got_faceless"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_healer_g"]=function(){return{
place:"药草 · 仪式之约",
text:["医师教你认药：“药不是治伤的，是让伤自己的人，愿意好起来。”", "后山向阳坡上的药草，叶背泛白，揉碎了有股醒脑的苦。", "用它当引，你的手才知道，该把那股凉意往哪里送。", "出了仪式之约，风迎面扑来。你认了认方向，启程。"],pace:"light",
options:[{t:"就地寻找药草", go:"sub_healer_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_healer_g2"]=function(){return{
place:"学院后山 · 向阳坡",
text:["你课后去后山，在向阳坡上采了一束药草。叶背泛白，揉碎了有股醒脑的苦。", "你把它晾在医务室窗台上。医师路过，看了一眼，没说话。"],pace:"light",
effect:{mat:"药草",flag:"v489_got_healer"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_inquisitor_g"]=function(){return{
place:"净化令文书 · 仪式之约",
text:["告解室那件事之后，你开始查教会里的旧文书。", "净化令文书——盖着圣痕司火漆的教令，措辞庄严，字里行间却透着焦味。", "教会档案室的旧卷柜里，压着历年收回的净化令。", "离开仪式之约时天光正好，靴子踏上路面的声音很稳。一路向前。"],pace:"light",
options:[{t:"就地寻找净化令文书", go:"sub_inquisitor_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_inquisitor_g2"]=function(){return{
place:"教会档案室 · 旧卷柜",
text:["你替档案室整理旧卷，从柜底抽出一封旧净化令。火漆还在，焦味还在。", "你读了那行措辞庄严的字，心里那个问题，又沉了一点。"],pace:"light",
effect:{mat:"净化令文书",flag:"v489_got_inquisitor"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_warpriest_g"]=function(){return{
place:"圣徽 · 仪式之约",
text:["靶场女孩问你的那个问题——“你教我的，算不算神术？”——你一直没有答案。", "圣徽是答案的一半：一枚磨得发亮的铜徽，正面刻着太阳。", "教会圣物柜里收着历年替换下来的旧圣徽。", "别过仪式之约，你沿官道走出里许，回头已看不清来处。"],pace:"light",
options:[{t:"就地寻找圣徽", go:"sub_warpriest_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_warpriest_g2"]=function(){return{
place:"教堂 · 圣物柜",
text:["你替教会整理圣物，从柜底请出一枚旧圣徽。铜面磨得发亮，背面刻着一行小字。", "你把它挂在颈上。圣徽贴着胸口，凉了一下，又热起来。"],pace:"light",
effect:{mat:"圣徽",flag:"v489_got_warpriest"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_ascetic_g"]=function(){return{
place:"苦修石 · 仪式之约",
text:["老修士说，那块石头他跪了九年。你问他为什么，他答：“因为它不回答。”", "苦修者需要的，是一块不回答的石头——河滩上拣一块顺手的，够沉，够冷。", "不用找特别的。哪块石头都不回答。", "你离了仪式之约，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",
options:[{t:"就地寻找苦修石", go:"sub_ascetic_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_ascetic_g2"]=function(){return{
place:"河滩 · 卵石堆",
text:["你在河滩上拣了一块灰石头，够沉，够冷，掌心刚好握得住。", "你把它带回宿舍，放在枕边。夜里，你握了它一会儿——它果然没有回答。"],pace:"light",
effect:{mat:"苦修石",flag:"v489_got_ascetic"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_merchant_g"]=function(){return{
place:"银月商会券 · 仪式之约",
text:["老板娘教你的第一课，是看。你看懂了陶碗的章，但她还有一课没教：", "“看懂了东西，还要看得懂纸。银月商会的券，一张纸，撬得动整条商路。”", "南方城邦的银月商会，发的券在商人手里比金币还硬。", "仪式之约的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",
options:[{t:"就地寻找银月商会券", go:"sub_merchant_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_merchant_g2"]=function(){return{
place:"南方城邦 · 银月商会",
text:["你替银月商会跑了一趟腿，掌柜随手塞给你一张券：“拿着，路上用得着。”", "纸券轻飘飘的，却能换十枚金龙。你把它贴身收好。"],pace:"light",
effect:{mat:"银月商会券",flag:"v489_got_merchant"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_banker_g"]=function(){return{
place:"旧商队账册 · 仪式之约",
text:["账房先生看了你默写的旧账，沉默了很久：“你看见了那一成。”", "“那一成不是粮食，是线。你要学金融，先要一本旧账——记着线的那种。”", "南方商路的旧商队账册，最后一页被撕去了，只剩渗血的指印。"],pace:"light",
options:[{t:"就地寻找旧商队账册", go:"sub_banker_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_banker_g2"]=function(){return{
place:"南方城邦 · 旧货仓",
text:["你在旧货仓的箱底翻出一本旧商队账册。最后一页被撕去了，只剩渗血的指印。", "你把它带回宿舍，在灯下读了一夜。账本里的人，一个个活了过来。"],pace:"light",
effect:{mat:"旧商队账册",flag:"v489_got_banker"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_auctioneer_g"]=function(){return{
place:"拍卖槌 · 仪式之约",
text:["学院长看了你那天的拍卖，留了一句话：“造势的人，先有槌。”", "拍卖槌敲下去，是给全场一个声音：这一声之后，价就是价。", "学院礼堂的拍卖台，收着一柄旧木槌，槌头磕出了毛边。"],pace:"light",
options:[{t:"就地寻找拍卖槌", go:"sub_auctioneer_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_auctioneer_g2"]=function(){return{
place:"学院礼堂 · 拍卖台",
text:["你替拍卖会收场，把那柄小木槌拿在手里掂了掂。槌头磕出了毛边，声音又脆又闷。", "你把它放回台上。走出礼堂时，你心里默默敲了一下——那一声，很稳。"],pace:"light",
effect:{mat:"拍卖槌",flag:"v489_got_auctioneer"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

N["sub_smuggler_g"]=function(){return{
place:"禁运货单 · 仪式之约",
text:["船夫老头看过你带来的木箱，什么也没问，只推过一张油渍斑斑的货单。", "“货名被划了三道，底下写着另一种货名——这就是走暗线的规矩。”", "码头旧货舱的箱底，压着历年换下来的货单。", "仪式之约的灯火远了。夜风凉，你把心思收回来，专心赶路。"],pace:"light",
options:[{t:"就地寻找禁运货单", go:"sub_smuggler_g2"},
{t:"先记下，改日再来", go:"sub_path_hub"}]}};

N["sub_smuggler_g2"]=function(){return{
place:"码头 · 旧货舱",
text:["你在旧货舱箱底翻出一张货单。货名被划了三道，底下写着另一种货名。", "你把它夹进自己那本小册子里。走出码头，海风很咸。"],pace:"light",
effect:{mat:"禁运货单",flag:"v489_got_smuggler"},
options:[{t:"收好，回去", go:"sub_path_hub"}]}};

/*v489inj:abysshit*/
/* /v62inj:chunk-abyss/ N["abyss_mage_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_mage_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_soul_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_soul_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_sor_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_sor_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_war_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_war_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_knight_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_knight_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_ranger_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_ranger_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_thief_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_thief_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_priest_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_priest_g2"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_merch_g"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_merch_g2"] 已移入 chunks/v62_abyss.js */
/*v489inj:market*/
N["mat_market_hub"]=function(){return{
place:"城西 · 地下材料市场",
text:[
"城墙根下有一道不起眼的铁门。推开门，下三段湿滑的石阶，就是地下材料市场——白天看不见，夜里亮着十几盏油灯，每个摊位卖的东西都见不得光。",
"老板娘倚在柜台后，指甲缝里嵌着铁粉。她抬眼看你：“新来的？规矩先说好——进门不问来路，出门不带尾巴。”",
"她把一块木板推到你面前，板上钉着十几枚铜钉，每枚钉子上挂着一个纸签。",
,"【材料集市】你走进集市，摊位上摆满了各种材料：兽皮、矿石、草药、魔晶……在阳光下泛着不同的光泽。","","摊主们热情地招呼你：“上好的铁皮，防箭！这边看看，龙涎草，熬药的好料！”你边走边看，不时停下，掂掂分量，问问价格。","","你知道，这些材料在行家手里，能变成装备、药剂、法器——而在你手里，它们是一笔笔要算清的账。","","你挑了几样合用的，付了钱。摊主麻利地包好递给你：“慢走！下次有好货，给你留着！”",""],pace:"normal",
options:[
{t:"看看柜台上的货", go:"mat_market_buy"},
{t:"问问有没有更深的货", go:"mat_market_dark"},
{t:"拿材料换材料", go:"mat_market_swap"},
{t:"出几样用不上的材料", go:"mat_market_sell"},
{t:"不了，先回去", go:"sub_path_hub"}
]}};

N["mat_market_buy"]=function(){return{
place:"地下市场 · 柜台",
text:[
"老板娘用铁尺敲了敲木板：“这些都是常货，明码标价，概不还价。”",
"油灯把你的影子拉得很长，她的影子却很短——短得不像坐在柜台后。", "柜台的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",
options:[
{t:"火晶尘×1（20金）", effect:{gold:-20,mat:"火晶尘"}},
{t:"旧纸人×1（15金）", effect:{gold:-15,mat:"旧纸人"}},
{t:"静默墨×1（30金）", effect:{gold:-30,mat:"静默墨"}},
{t:"骨灰×1（25金）", effect:{gold:-25,mat:"骨灰"}},
{t:"旧钟绳×1（15金）", effect:{gold:-15,mat:"旧钟绳"}},
{t:"银液×1（40金）", effect:{gold:-40,mat:"银液"}},
{t:"黄铜齿轮×1（22金）", effect:{gold:-22,mat:"黄铜齿轮"}},
{t:"兽血×1（25金）", effect:{gold:-25,mat:"兽血"}},
{t:"狂兽之牙×1（30金）", effect:{gold:-30,mat:"狂兽之牙"}},
{t:"夜枭羽×1（35金）", effect:{gold:-35,mat:"夜枭羽"}},
{t:"药草×1（8金）", effect:{gold:-8,mat:"药草"}},
{t:"禁运货单×1（40金）", effect:{gold:-40,mat:"禁运货单"}},
{t:"再看别的", go:"mat_market_hub"}
]}};

N["mat_market_dark"]=function(){return{
place:"地下市场 · 暗格",
text:[
"老板娘盯了你一会儿，从柜台下拖出一个铁匣。锁是倒着装的。",
"她开锁的手势很慢：“这些货，从下面来。你买了，就当没见过我。”",
"铁匣打开，里面铺着黑绒，几件东西码得整整齐齐，每一件旁边都立着一张倒扣的纸牌。", "出了暗格，风迎面扑来。你认了认方向，启程。"],pace:"light",
options:[
{t:"缚魂丝×1（70金）", effect:{gold:-70,mat:"缚魂丝"}},
{t:"亵渎铁×1（75金）", effect:{gold:-75,mat:"亵渎铁"}},
{t:"血魔之血×1（85金）", effect:{gold:-85,mat:"血魔之血"}},
{t:"腐化獠牙×1（65金）", effect:{gold:-65,mat:"腐化獠牙"}},
{t:"影丝×1（70金）", effect:{gold:-70,mat:"影丝"}},
{t:"倒悬钟印×1（90金）", effect:{gold:-90,mat:"倒悬钟印"}},
{t:"黑币×1（100金）", effect:{gold:-100,mat:"黑币"}},
{t:"深渊封印石×1（80金）", effect:{gold:-80,mat:"深渊封印石"}},
{t:"合上铁匣", go:"mat_market_hub"}
]}};

N["mat_market_swap"]=function(){return{
place:"地下市场 · 换货台",
text:[
"换货台是个石台，台面被磨得发亮。老板娘说：“换货的规矩——你出一件，我出一件，各凭眼力。”",
"她身后的货架上，瓶瓶罐罐没有标签。她随手一指：“想要哪样，拿你身上的一样来换。”", "你离了换货台，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",
options:[
{t:"火晶尘+2金 → 兽血", mats:{火晶尘:1}, effect:{gold:-2,loseMat:"火晶尘",mat:"兽血"}},
{t:"药草+5金 → 旧纸人", mats:{药草:1}, effect:{gold:-5,loseMat:"药草",mat:"旧纸人"}},
{t:"铁钉+10金 → 黄铜齿轮", mats:{铁钉:1}, effect:{gold:-10,loseMat:"铁钉",mat:"黄铜齿轮"}},
{t:"圣水+15金 → 银液", mats:{圣水:1}, effect:{gold:-15,loseMat:"圣水",mat:"银液"}},
{t:"旧剑刃+8金 → 狂兽之牙", mats:{旧剑刃:1}, effect:{gold:-8,loseMat:"旧剑刃",mat:"狂兽之牙"}},
{t:"不了，再看看", go:"mat_market_hub"}
]}};

N["mat_market_sell"]=function(){return{
place:"地下市场 · 收货柜",
text:[
"收柜的伙计是个驼背，他先闻了闻你的手，才肯看你带来的东西：“常货收，暗货也收，价钱两样。”",
"他掏出一杆小秤，秤盘上垫着黑布。", "收货柜在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
options:[
{t:"出一份精铁块（+15金）", effect:{gold:15,loseMat:"精铁块"}},
{t:"出一份兽皮（+12金）", effect:{gold:12,loseMat:"兽皮"}},
{t:"出一份药草（+8金）", effect:{gold:8,loseMat:"药草"}},
{t:"出一份骨灰（+20金）", effect:{gold:20,loseMat:"骨灰"}},
{t:"不卖了", go:"mat_market_hub"}
]}};

/*v489inj:hub*/
N["sub_path_hub"]=function(){return{tag:"branch",
place:"记忆的回廊",
text:[
"灯影摇了一下。",
"不是风。礼堂的门关着，连窗缝都拿绒布塞死了——可你手边的烛火还是矮了半寸，像有什么东西从你身后经过，带走了那口气。",
"你低头看着自己的手。指腹上有一道旧疤，是去年冬天在铁匠铺帮忙时烫的。它不疼了，却总在你想不起正事的时候发痒。",
"有些路是走出来的，有些路是长出来的。你站在学院第二年的大门前，忽然分不清自己属于哪一种。",
(function(){ var p=(S&&S.path==="specialist"); var c=(S&&S.subclassCn)||""; return p?("你已选了专精："+c+"。那道低语认得你，它在你翻书、挥剑、数钱的间隙里，等你回头。"):"你还没想好要不要把整条命押在一条路上。学院里的教授们说，职业是术，是吃饭的手艺；可你总觉得，它还欠你一个交代。"; })(),
"外面传来马库斯的声音，隔着门板，瓮声瓮气的：“喂，你再不出来，食堂的炖肉就没了。”",
"你把烛火拢了拢。有些答案，得走到一半才知道是答案。"
],pace:"normal",
options:[
{t:"循着低语的方向，去找那条路", go:"academy_year2_tournament_signup"},
{t:"先把肚子填饱，路可以慢慢走", go:"academy_year2_tournament_signup"},
{t:"夜里出门，去城西的地下材料市场", go:"mat_market_hub"}
]}};

/*=====v488-eng-end=====*/

/*=====v48-eng-end=====*/


/*=====v46-eng=====*/
(function(){
  try{
    /* ============ 方向一：过渡粘合层 TransitionKit ============ */
    var TRANSITION_V46 = {
      same_area:[
        "你离开这里，循着来路往回走。脚步落在石板上，一声，又一声。风从身后追上来，绕着你的衣摆打了个转，又先你一步，钻进了前面的巷口。",
        "你收好心思，迈开步子。路不远，但你走得慢——方才的事还悬在心里，像一块没咽下去的干粮，硌着，却吐不出来。",
        "你穿过人群。卖货的吆喝、铁匠的锤声、谁家孩子的哭闹，从你身边流过，一样也没留住你。你低头走自己的路，把方才的事，又在心里过了一遍。",
        "你站起身，拍了拍衣摆上的灰。你走得很稳，像什么都没发生过。只有你自己知道，方才那一下，心里有什么东西，松了，或者，紧了。",
        "你走出去。午后的光斜斜地铺在地上，把你的影子拉长。你踩着影子走，一步一步，把来时的路，走成回去的路。"
      ],
      cross_area:[
        "你踏上往那边去的路。两边的景致渐渐换了——先是熟悉的，再是陌生的，最后连风里夹着的味道都不一样了。你回头看了一眼来路，路已经远了。",
        "你走了一程。尘土在你身后落成一条细线，又被风吹散。你在心里记着走过的路标——一棵歪脖子树，一块半埋的石碑，一间门板脱落的废屋。你走得慢，但没有停。",
        "日头从东边挪到西边。你在一处岔路口停下，喝了口水，看了看前路。天边有云，像是要变天。你紧了紧肩上的东西，继续走。",
        "你离开了熟悉的地界。路开始变窄，人开始变少，问路时得到的回答，也开始含糊起来。你知道，你已经到了没人认得你的地方。",
        "你走了一整天。傍晚的时候，你在一棵老树下歇脚。远处有炊烟，有狗叫，有人间的声音。你听着，忽然觉得，自己一个人，走了很远。"
      ],
      day_change:[
        "天光暗下去，又亮起来。你睡了一觉，或者，根本没睡。日子就是这样，不管你想不想，它都会翻过一页。",
        "一夜过去。晨雾还没散尽，你已经在路上了。露水打湿了裤脚，你搓了搓手，呼出一口白气，继续走。",
        "你歇了一夜。第二天醒来，天是新的，路是旧的。你收拾好，又踏上了那条路，好像昨天的一切，都只是路上的一段风。",
        "夜里你做了个梦，醒来就忘了大半。只记得梦里有人问你：想好了吗？你没答。天亮了，你带着那个没答的问题，继续上路。",
        "日出的时候，你醒了。鸟叫，虫鸣，远处有人开门的吱呀声。你躺在原地听了一会儿，然后起身——又是新的一天，又该做新一天的决定了。"
      ],
      night:[
        "天已经黑透了。你借着一点微光走路，深一脚，浅一脚。风从暗处来，带着凉意。你紧了紧领口，没有回头。",
        "夜路比白天长。你数着自己的脚步声，一步一步向前。远处有一点灯火，像落在地上的星星。你看了一会儿，又低下头，继续走。",
        "月亮被云遮了大半。你走得慢，怕踩空，也怕踩到什么不该踩的东西。四下里只有你自己的呼吸声，和偶尔一声，不知名的鸟叫。",
        "夜风穿过街巷，把谁家的灯火吹得忽明忽暗。你从亮处走进暗处，又从暗处走进更暗的地方。你知道路，你只是走得比平时小心。",
        "你停下，听了一会儿。风声，虫声，远处的水声，还有别的什么声音——很轻，很远。你等了一会儿，没再听见，便继续走了。"
      ],
      injured:[
        "你走得比平时慢。伤口一阵一阵地疼，像有人在里头敲。你咬着牙，扶着墙，喘几口气，又挪几步。不能停，你对自己说。",
        "你低头看了一眼伤处。血止住了，力气却在一点一点流走。你攥紧拳头，又松开。走一步，算一步。走到能歇的地方，再歇。",
        "你靠着一棵树，歇了歇。眼前发黑，你闭上眼睛，等那阵眩晕过去。再睁开时，天还是天，路还是路。你直起身，继续走。",
        "你的步子有点飘。你记得路——记得每一个该拐弯的地方。你只是走得慢，像一只受了伤的兽，拖着尾巴，也要回到自己的窝。",
        "你捂住伤处，指缝里渗出一点温热。你告诉自己，这没什么，比这重的伤，你也受过。然后你直起腰，把痛咽下去，接着走。"
      ],
      mood_shift:[
        "你走着，忽然觉得周围的景致，好像哪里不太对。说不上来。你甩了甩头，想把它甩开，可它像影子，甩不掉，只是跟着。",
        "你停下来，站了一会儿。你听见什么声音——很轻，很远，像从很深很深的地方，有什么东西，翻了个身。你等了很久，它没再响。",
        "风从你耳边过，你总觉得它带了句话。你没听清，也不敢回头。你加快了脚步，好像这样，就能把那个声音，甩在身后。",
        "你看着自己的手，忽然觉得它有点陌生。你握了握，又松开。指甲是齐的，纹路是熟悉的。你松了口气，可你知道，那种感觉，还会再来。",
        "天还是那个天，路还是那条路。但你心里知道，有什么东西，已经不太一样了。你说不上来是什么，只是走路的时候，你总想回头看看。"
      ]
    };
    var _v46last = {};
    function v46_pick(key){
      var pool = TRANSITION_V46[key];
      if(!pool || !pool.length) return null;
      var idx = 0;
      if(pool.length > 1){
        var last = _v46last[key];
        idx = (last === undefined) ? Math.floor(Math.random()*pool.length) : ((last + 1 + Math.floor(Math.random()*(pool.length-1))) % pool.length);
      }
      _v46last[key] = idx;
      return pool[idx];
    }
    function v46_region(id){
      if(!id) return "misc";
      if(/^(fc_|origin_|prologue_|free_)/.test(id)) return "free";
      if(/^(academy_|h_academy_|dorm|library_)/.test(id)) return "academy";
      if(/^seal/.test(id)) return "seal";
      if(/^(city_|h_faction_|pol_|h_ending)/.test(id)) return "mainland";
      if(/^(travel_|journey_|slow_travel)/.test(id)) return "travel";
      if(/^(shop|tavern|guild|facility|world_map|title|panel_)/.test(id)) return "system";
      if(/^(h_trade|h_dark|h_underworld)/.test(id)) return "underworld";
      if(/^eclipse/.test(id)) return "eclipse";
      return "misc";
    }
    function v46_isNight(){
      try{
        if(S && S.time){
          var p = S.time.period || S.time.dayPeriod || "";
          if(/夜|晚|暮|昏/.test(String(p))) return true;
        }
        if(S && S.dayPeriod) return /夜|晚|暮|昏/.test(String(S.dayPeriod));
      }catch(e){}
      return false;
    }
    window.v46_genTransition = function(fromId, toId, hasTime){
      try{
        if(!toId) return null;
        if(typeof S === "undefined" || !S) return null;
        if(S.settings && S.settings.transition === false) return null;
        if(v46_region(toId)==="system" || v46_region(fromId)==="system") return null;
        if(/(battle|fight|combat|duel)/.test(fromId||"") || /(battle|fight|combat|duel)/.test(toId||"")) return null;
        var fr = v46_region(fromId), tr = v46_region(toId);
        var key = "same_area";
        if(S.san !== undefined && S.maxSan && S.san < S.maxSan*0.4) key = "mood_shift";
        else if(S.hp !== undefined && S.maxHp && S.hp < S.maxHp*0.3) key = "injured";
        else if(v46_isNight()) key = "night";
        else if(hasTime && fr===tr) key = "day_change";
        else if(fr !== tr) key = "cross_area";
        var n = (key==="cross_area") ? 2 : 1;
        var out = [];
        for(var i=0;i<n;i++){
          var p = v46_pick(key);
          if(p) out.push(p);
        }
        return out.length ? out : null;
      }catch(e){ return null; }
    };

    /* ============ 方向二：入口适配 entry ============ */
    window.v46_entryRender = function(node, fromId){
      try{
        if(!node || !node.entry) return;
        var from = fromId;
        if(!from && S && S.choices && S.choices.length) from = S.choices[S.choices.length-1];
        var hit = null;
        var fm = node.entry.from || {};
        if(from && fm[from]) hit = fm[from];
        else if(from){
          for(var k in fm){
            if(k && from.indexOf(k)===0){ hit = fm[k]; break; }
          }
        }
        if(!hit) hit = node.entry.default;
        if(hit){
          for(var i=0;i<hit.length;i++) writePar(hit[i],"v46-entry");
          if(S && !S.entryHits) S.entryHits={};
          if(S && from) S.entryHits[from+"→"+ (node.id||"")] = true;
        }
      }catch(e){}
    };

    /* ============ 方向三：事件补偿器 MISSED_EVENTS ============ */
    window.v46_maybeMissed = function(key, desc, prefixes){
      try{
        if(typeof S === "undefined" || !S || !curNode) return;
        if(!S.missedEvents) S.missedEvents=[];
        for(var i=0;i<S.missedEvents.length;i++){
          if(S.missedEvents[i].key === key) return;
        }
        if(prefixes && prefixes.length){
          for(var j=0;j<prefixes.length;j++){
            if(curNode.indexOf(prefixes[j])===0) return; // 玩家在场，不算错过
          }
        }
        S.missedEvents.push({key:key, desc:desc});
      }catch(e){}
    };
    window.v46_missedCompensation = function(){
      try{
        if(typeof S === "undefined" || !S || !curNode) return;
        var q = S.missedEvents || [];
        if(!q.length) return;
        var id = String(curNode);
        var ok = /^(tavern|city_|npc_|classmate_|fc_)/.test(id) || /rumor|gossip|news/.test(id);
        if(!ok) return;
        if(!S.worldHeard) S.worldHeard={};
        var out = [];
        while(q.length && out.length<2){
          var it = q.shift();
          if(!it || !it.key || S.worldHeard[it.key]) continue;
          S.worldHeard[it.key] = true;
          out.push(it.desc);
        }
        if(out.length){
          writePar("你听说——" + out.join("。") + "。","v46-rumor");
        }
      }catch(e){}
    };

    /* 存档兜底 */
    window.v46_ensureDefaults = function(){
      try{
        if(typeof S === "undefined" || !S) return;
        if(!S.settings) S.settings={};
        if(S.settings.transition===undefined) S.settings.transition=true;
        if(!S.missedEvents) S.missedEvents=[];
        if(!S.entryHits) S.entryHits={};
        if(!S.worldHeard) S.worldHeard={};
        if(typeof v47_ensureDefaults==='function'){ try{ v47_ensureDefaults(); }catch(e){} }
        if(typeof v48_ensureDefaults==='function'){ try{ v48_ensureDefaults(); }catch(e){} } // v48inj:defaults
      }catch(e){}
    };
  }catch(e){ try{ console.log('v46 init:',e); }catch(_){} }
})();
/*=====v46-eng-end=====*/
/* /v58eng:refhealth/ 引用健康修复 12 项 */


/*=====v45-eng=====*/
(function(){
  try{
    window.__v45page=0; window.__v45ctx=null; window.__v45lastScene=null;

    function shouldPaginate(node){
      if(!node || !node.text) return false;
      try{ if(S && S.settings && S.settings.pagedReading===false) return false; }catch(e){} /* /t11inj:switch/ I1-1 分段阅读开关 */
      if(node.read===true) return true;
      var t=(typeof node.text==="function")?node.text():node.text;
      var arr=Array.isArray(t)?t:[t];
      var total=0;
      for(var i=0;i<arr.length;i++){
        var p=arr[i];
        if(typeof p==="function"){ try{p=p();}catch(e){p="";} }
        if(p) total+=String(p).length;
      }
      return arr.length>4 || total>700;
    }

    function chapterCard(title, subtitle){
      try{
        var story=document.getElementById('story');
        if(!story) return;
        var d=document.createElement('div');
        d.className='v44-chapter-card';
        d.innerHTML='<div class="ln"><div class="t">'+String(title).replace(/</g,'&lt;')+'</div></div>'+(subtitle?'<div class="s">'+String(subtitle).replace(/</g,'&lt;')+'</div>':'');
        story.appendChild(d);
        story.scrollTop=story.scrollHeight;
      }catch(e){}
    }

    function sceneTitle(node){
      if(node && node.sceneTitle && node.sceneTitle!==window.__v45lastScene){
        window.__v45lastScene=node.sceneTitle;
        chapterCard(node.sceneTitle, node.sceneSubtitle||'');
      }
      /* /t12inj:chapter/ I1-2 章节标题卡（纯数据表驱动，≤1 处钩子；未命中节点零变化） */
      try{
        var _id = (node && node.id) ? node.id : (typeof curNode!=='undefined' ? curNode : '');
        if(_id && window.CHAPTERS_I12 && CHAPTERS_I12[_id]){
          var c = CHAPTERS_I12[_id];
          var ck = (c.vol||'') + '|' + c.title;
          /* /sp7inj:chapter-arc/ SP-7 章节卡弧名增强：同卷章不重复；副标题补当前弧名 */
          var _arcName = '';
          try{
            var _bp = window.STORY_BLUEPRINT;
            var _rec = (_bp && _bp.nodeIndex && _bp.nodeIndex[_id]) ? _bp.nodeIndex[_id] : null;
            if(_rec && _rec.arc && _bp.arcs){
              for(var _a=0;_a<_bp.arcs.length;_a++){
                if(_bp.arcs[_a] && _bp.arcs[_a].id === _rec.arc){ _arcName = _bp.arcs[_a].name || _rec.arc; break; }
              }
            }
          }catch(e){ _arcName=''; }
          /* /pn1inj:scenethread/ P-N1 卷·线·章：副标题追加线程名（按节点前缀查 THREADS；未命中零变化） */
          var _thrName = '';
          try{
            var _TH = window.THREADS;
            if(_TH){ for(var _tk in _TH){ var _pf=_TH[_tk].prefix; if(!_pf) continue; for(var _pi=0;_pi<_pf.length;_pi++){ if(_id.indexOf(_pf[_pi])===0){ _thrName=_TH[_tk].name||''; break; } } if(_thrName) break; } }
          }catch(e){ _thrName=''; }
          if(ck !== window.__v45lastChapter){
            window.__v45lastChapter = ck;
            var _sub = _arcName ? (_arcName + '　' + (c.sub||'')) : (c.sub||'');
            if(_thrName){ _sub = _sub ? (_thrName + ' · ' + _sub) : _thrName; }
            chapterCard((c.vol ? c.vol + ' · ' : '') + c.title, _sub);
          }
        }
      }catch(e){}
    }
    window.v45_sceneTitle = sceneTitle; /* /t12inj:export/ I1-2 修复既有静默 bug：writeNext 调用 v45_sceneTitle 从未被赋值，场景/章节卡从不生效 */

    function afterNode(node){
      try{
        if(node && node.unlock && Array.isArray(node.unlock)){
          for(var i=0;i<node.unlock.length;i++){ try{ unlockReading(node.unlock[i]); }catch(e){} }
        }
      }catch(e){}
    }

    function renderPage(ctx){
      try{
        var P=3;
        var start=ctx.page*P;
        var end=Math.min(start+P, ctx.txt.length);
        var oldTw=(typeof V34!=='undefined'&&V34&&V34.textSettings)?V34.textSettings.typewriterEnabled:false;
        try{ if(typeof V34!=='undefined'&&V34&&V34.textSettings) V34.textSettings.typewriterEnabled=false; }catch(e){}
        for(var i=start;i<end;i++){
          var p=ctx.txt[i];
          if(typeof p==="function"){ try{p=p();}catch(e){p="";} }
          if(p) writePar(p);
        }
        RenderBatch.flush();
        try{ window.v92_hlInit(); window.v92_ambCSS(); }catch(e){}
        try{ window.v92_applyAmbience(); }catch(e){}
        try{ if(window.ambScene){ var _ap2=(typeof curNode!=="undefined"&&curNode&&N[curNode]&&N[curNode].place)?String(N[curNode].place):""; window.ambScene(_ap2); } }catch(e){}
        try{ if(oldTw&&typeof V34!=='undefined'&&V34&&V34.textSettings) V34.textSettings.typewriterEnabled=oldTw; }catch(e){}
        try{ v44_afterRender(); }catch(e){}
        try{ v34_afterFlush&&v34_afterFlush([]); }catch(e){}
        ctx.page++;
        if(end>=ctx.txt.length){
          /* /t11inj:unbind/ I1-1 读完解绑继续监听 */
          try{ if(window.__v45KeyH){ document.removeEventListener('keydown',window.__v45KeyH); window.__v45KeyH=null; } }catch(e){}
          try{ var _st2=document.getElementById('story'); if(_st2&&_st2.__v45ClickH){ _st2.removeEventListener('click',_st2.__v45ClickH); _st2.__v45ClickH=null; } }catch(e){}
          try{ afterNode(ctx.node); }catch(e){}
          if(ctx.node&&ctx.node.auto){
            var a=ctx.node.auto;
            v61_timer(function(){ if(a.go){curNode=a.go; writeNext();} }, a.delay||900, 'trans'); /* /v61inj:perf-timerA/ */
            window.__v45ctx=null;
            return;
          }
          showOptions(ctx.node);
          if(ctx.node&&String(ctx.node).indexOf("arrive_")===0&&S&&S.loc) renderCityActs();
          setTimeout(function(){ if(typeof v34_animateOptions==='function') v34_animateOptions(); }, 50);
          window.__v45ctx=null;
        }else{
          var opts=document.getElementById('options');
          var cg=document.getElementById('v45-cg');
          if(!cg&&opts){
            cg=document.createElement('button');
            cg.id='v45-cg';
            cg.className='opt v45-cg';
            cg.innerHTML='<span class="od">▸</span> 继续阅读…';
            cg.onclick=function(){ v45_continue(); };
            opts.appendChild(cg);
            /* /t11inj:keys/ I1-1 点击正文 / Space / Enter 继续 */
            try{
              var _st=document.getElementById('story');
              if(_st&&!_st.__v45ClickH){ _st.__v45ClickH=function(){ v45_continue(); }; _st.addEventListener('click',_st.__v45ClickH); }
              if(!window.__v45KeyH){ window.__v45KeyH=function(e){ if(e.key===' '||e.key==='Enter'){ try{ if(document.activeElement&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return; }catch(_){} e.preventDefault(); v45_continue(); } }; document.addEventListener('keydown',window.__v45KeyH); }
            }catch(e){}
          }
        }
        /* /an3inj:scrollfix/ A-N3 分页滚动兜底：新页渲染后滚到底（rAF 立即 + 延迟覆盖渐显动画/后置渲染），修复「继续阅读」后需手动下滑 */
        try{ window.requestAnimationFrame(function(){ var _st=document.getElementById('story'); if(_st){ _st.scrollTop=_st.scrollHeight; } }); }catch(e){}
        try{ setTimeout(function(){ var _st=document.getElementById('story'); if(_st){ _st.scrollTop=_st.scrollHeight; } }, 450); }catch(e){}
      }catch(e){ try{ console.log('v45 page:',e); }catch(_){} }
    }

    window.v45_shouldPaginate=shouldPaginate;
    window.v45_renderPage=renderPage;
    window.v45_chapterCard=chapterCard;
    window.v45_afterNode=afterNode;
    try{
      var _v47_orig_after = window.v45_afterNode;
      window.v45_afterNode = function(node){
        try{ _v47_orig_after(node); }catch(e){}
        try{ v47_rumorCompensation(node); }catch(e){}
        try{ v47_autoReveal(curNode); }catch(e){}
      };
    }catch(e){}
    window.v45_continue=function(){
      try{
        var cg=document.getElementById('v45-cg');
        if(cg&&cg.parentNode) cg.parentNode.removeChild(cg);
        var ctx=window.__v45ctx;
        if(!ctx) return;
        window.__v45ctx.page=ctx.page;
        renderPage(ctx);
      }catch(e){ try{ console.log('v45 cont:',e); }catch(_){} }
    };

    /* ===== 方向三：可读物 ===== */
    window.READINGS_V45 = window.READINGS_V45 || {};
    function unlockReading(id){
      try{
        var R=window.READINGS_V45||{};
        if(!R[id]) return false;
        if(typeof S!=='undefined'&&S){
          if(!S.readings) S.readings={unlocked:{},read:{}};
          if(!S.readings.unlocked) S.readings.unlocked={};
          if(!S.readings.read) S.readings.read={};
          if(S.readings.unlocked[id]) return true;
          S.readings.unlocked[id]=true;
        }
        try{ v44_pushToast&&v44_pushToast('获得藏书','《'+R[id].title+'》已收入藏书阁','info','📜'); }catch(e){}
        return true;
      }catch(e){ return false; }
    }
    /* /v62inj:chunk-academy/ N["academy_y1_night_library"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y1_night_library*/
/* /v62inj:chunk-academy/ N["academy_y1_rooftop"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y1_rooftop*/
/* /v62inj:chunk-academy/ N["academy_y2_dawn_duel"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y2_dawn_duel*/
/* /v62inj:chunk-academy/ N["academy_y3_road_letter"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y3_road_letter*/
/* /v62inj:chunk-academy/ N["academy_y4_hidden_meeting"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y4_hidden_meeting*/
/* /v62inj:chunk-academy/ N["academy_y5_last_class"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y5_last_class*/
/* /v62inj:chunk-city/ N["city_free_night_market"] 已移入 chunks/v62_city.js */
/*v45new:city_free_night_market*/
/* /v62inj:chunk-seal/ N["seal4_heart_whisper"] 已移入 chunks/v62_seal.js */
/*v45new:seal4_heart_whisper*/
/* /v62inj:chunk-city/ N["city_tiemenguan_wall_night"] 已移入 chunks/v62_city.js */
/*v45new:city_tiemenguan_wall_night*/
/* /v62inj:chunk-city/ N["city_lvzhou_spring"] 已移入 chunks/v62_city.js */
/*v45new:city_lvzhou_spring*/
N["travel_north_campfire"]={tag:"branch",
  place:"北行路上·营地",
  text:[
    "北行的第三天，你们在一处背风的土坡下扎了营。柴火是半干的，烧起来浓烟滚滚，熏得人眼睛疼。",
    "同行的老猎人蹲在火边，用刀尖剔着指甲，忽然开口：「再往北走两天，就是铁门关的地界了。」他看了你一眼，「那边不太平。」",
    "「怎么个不太平？」你问。",
    "他想了想：「倒不是打仗。是人心。」他把刀收起来，「北边的人，话少。你问他十句，他答你一句。你别觉得他冷——那是他们的规矩。」",
    "「什么规矩？」你问。",
    "「先看人，再说话。」他往火里添了根柴，「你要是沉得住气，他们反倒拿你当自己人。」火苗蹿了蹿，映着他的脸，「你这样的年轻人，话多，得改改。」",
    "你没有反驳。夜里，你躺在火边，听着北风呜呜地吹。你想了想他的话，又想了想自己。天快亮的时候，你睡着了。",
  ],pace:"normal",
  options:[
    {t:"继续赶路", go:"travel_north_day2_solo", effect:{time:1}}
  ]
}; /*v45new:travel_north_campfire*/
/* /v62inj:chunk-academy/ N["academy_y2_tavern_rumor"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y2_tavern_rumor*/
/* /v62inj:chunk-seal/ N["seal5_exp_underwater"] 已移入 chunks/v62_seal.js */
/*v45new:seal5_exp_underwater*/
N["ending_after_watcher"]={tags:["ending:after"],tag:"ending",
  place:"多年以后·守望者塔",
  text:[
    "很多年以后，你站在守望者塔的顶层。塔不高，但能看见很远——旷野、河流、村庄，和更远处那条模糊的地平线。",
    "你胸前挂着那枚旧徽章，边缘已经被你摩挲得更亮了。塔下，有年轻人正在练习守望者最基本的功课——辨认风向，记识星位，还有，学会在漫长的夜里，保持清醒。",
    "你还记得自己第一天爬上这座塔的样子。那时你比他们还年轻，手脚并用地踩着石阶，在塔顶吹了半宿冷风，才敢确认自己真的接下了这份差事。前任守望者走时没说什么，只把钥匙往你手里一放，说：灯别灭。",
    "钥匙很旧，齿都快磨平了。你攥了一夜，手心出了汗，第二天才发现，那枚钥匙的柄上，刻着一行小字，小得几乎看不清：『此灯不灭，此路不黑。』",
    "有人问过你，守了一辈子，图什么。你想了想，说不上来。你只知道，那年夜里，有人在旷野上走，看见塔上的灯火，就没那么怕了。",
    "黄昏的时候，你看见远处走来一个年轻人，背着行囊，风尘仆仆。他在塔下仰头看了很久，然后，沿着石阶，一级一级走上来。",
    "他站在你面前，有些局促：「我……听人说，这里住着一位守望者。」你看着他，像看着很多年前的自己。你没有说话，只是把塔门推开了一些。",
    "他跟你上了塔顶。风从旷野上灌过来，把他的头发吹得乱蓬蓬的。他站在栏杆边，看了很久，忽然问：「你守了多久了？」你算了算，说了个数。他点点头，又问：「累吗？」",
    "你想了想，说不累是假的。守夜的人都知道，最难熬的不是冷，不是困，是那些什么都不会发生的夜里——火苗稳稳地跳着，旷野安安静静，你会开始怀疑，这盏灯到底有没有人看见。",
    "「可有一回，」你开口，「一个走夜路的商人跟我说，他在四十里外看见塔上的光，才敢在野地里生火过夜。他说那点光不大，但让人知道，这地方有人。」",
    "年轻人没有说话。他在你旁边坐下来，陪你看了一会儿旷野。太阳往西沉，把他的影子拉得很长，一直伸到塔下的石板路上。",
    "夜来了。塔上的灯，亮了。",
  ],pace:"normal",
  options:[{t:"（故事在此刻静静流淌）", go:"ending", effect:{time:1}}, {"t": "接待一位来访的老守望者", "go": "ending_elder_memoir"}]
}; /*v45new:ending_after_watcher*/
/* /v62inj:chunk-academy/ N["academy_y1_dorm_night"] 已移入 chunks/v62_academy.js */
/*v45new:academy_y1_dorm_night*/
/* /v62inj:chunk-city/ N["city_shengcheng_tea_house"] 已移入 chunks/v62_city.js */
/*v45new:city_shengcheng_tea_house*/
/* /v62inj:chunk-city/ N["city_ironpeak_anvil"] 已移入 chunks/v62_city.js */
/*v45new:city_ironpeak_anvil*/
/* /v62inj:chunk-seal/ N["seal3_act3_wait_ruins"] 已移入 chunks/v62_seal.js */
/*v45new:seal3_act3_wait_ruins*/
N["travel_elf_treesong"]={
  place:"精灵林道·树歌",
  text:[
    "通往银叶城的林道，比传说中还要安静。你走在路上，脚步放得很轻，像是怕打扰了什么。",
    "风穿过树梢的时候，树叶发出一种很轻的、连绵的声响——不是普通的风声。你停下脚步，仔细听，那声音像有人在很远的地方，哼着一首没有词的歌。",
    "你问带路的精灵向导，那是什么声音。她侧耳听了一会儿，说：「是树。」",
    "「树在唱歌？」你问。",
    "「不是唱给我们听的。」她说，「树自己会哼。哼了几千年了。」她顿了顿，「我们听习惯了，听不见。你们人类耳朵新，反而听得见。」",
    "你站在那里，又听了一会儿。那声音确实像歌——低低的，绵长的，像一条流了千年的河。",
    "你继续往前走，脚步更轻了。你想起银叶长老说过的话——精灵活得太久，久到忘了自己为什么活着。你忽然有点明白，为什么他们会忘记。",
    "因为有些东西，太久了，就变成了理所当然。就像这树歌，哼了几千年，反而没人听见了。",
  ],pace:"normal",
  options:[
    {t:"继续赶路", go:"travel_elf_day2_solo", effect:{time:1}}
  ]
}; /*v45new:travel_elf_treesong*/
N["ending_elder_memoir"]={tags:["ending:elder"],tag:"ending",
  place:"守望者塔·老人回忆",
  text:[
    "你在守望者塔里住下的第三个月，有一天傍晚，一位老人来敲门。他背着一个旧皮包，头发花白，走路有些跛。",
    "他自我介绍：前代守望者，退了二十年了。他说：「听说塔上来了新人，我来看看。」他坐在火炉边，喝了半碗热汤，忽然开口：「你知道，我守了几年吗？」",
    "你摇头。他说：「三十七年。」他顿了顿，「三十七年，每天夜里，我都起来看那盏灯。」",
    "「灯灭过吗？」你问。",
    "「灭过一次。」他说，「那天我病得起不来床。半夜，我听见外面有动静——爬起来，看见一个路人站在塔下，仰着头，看着黑了的塔顶。」他说，「他就那么站着，等了一夜。」",
    "「第二天早上，我撑着起来，把灯点着了。他看见灯亮，朝塔上鞠了个躬，走了。」老人喝了一口汤，「从那以后，我再没让灯灭过。」",
    "他坐了一会儿，站起来，背起皮包：「行了，看过了，你是个能守的人。」他走到门口，回头，「灯这东西，看着简单——点着容易，不灭难。难在那些没人看见的夜里，你还记得点着它。」",
    "他走了。你站在塔顶，看着远处。天边，最后一缕晚霞正在暗下去。你伸出手，摸了摸灯柱。火苗跳了一下，稳稳地燃着。",
    "你想起他说的那个路人。那晚他该多冷啊——站在塔下，仰着头，等一盏不知道还会不会亮起来的灯。你往灯里添了一勺油，把灯罩擦得透亮。",
    "天彻底黑下来的时候，旷野上远远地亮起了一点光。不是你的灯。是不知道哪家的窗，或者是某个赶路的人，也点起了自己的火。你看着那点光，忽然觉得，这守灯的差事，其实从来不是你一个人在守。",
    "夜风从塔顶吹过，灯火晃了晃，又稳住。你把钥匙揣进怀里，转身下了楼。明天，还会有人来敲门。",
    "楼下门口，老人还没走远。他站在路边，背对着塔，正仰头看那点灯火。看了一会儿，他自言自语似的说了一句，风把话声送上来，断断续续：『……亮了就好。』然后他拄着拐，一步一步，往旷野里去了。",
    "你站在门口，看着他走。天边的最后一点光也暗了，旷野上只剩你的灯，和远处不知道哪家的、零星几点灯火。", "从老人回忆出来，路上行人渐稀。你脚步不停，一路向前。"],pace:"normal",
  options:[
    {t:"（守灯的夜，还很长）", go:"ending_after_watcher", effect:{time:1}}
  ]
}; /*v45new:ending_elder_memoir*/
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome1": {"id": "strong_tome1", "title": "《大陆强者录・卷一・星语者》", "type": "tome", "author": "佚名", "source": "强者谱·魔法师卷", "text": ["星落塔第七层，坐着过一位神。他叫寂光，陨落两千年，神座至今空悬。", "如今魔法师一脉有五位传奇：奥薇恩·星语、洛·晨雾、凯·青焰、瑟琳·银冠、伊尔·灰书。他们各守一方，谁也不提神座。", "在位半神只有一位——他离塔出走十二年，有人说他在找登神的路。挑战者亦有一位，替宫廷挡了二十年灾，她说她累了。", "卷末有行小字：魔网第一层，至今留着寂光的法则。那行字下，有人画了一盏灯。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome2": {"id": "strong_tome2", "title": "《大陆强者录・卷二・断山》", "type": "tome", "author": "佚名", "source": "强者谱·战士卷", "text": ["古战场最高的土丘上，插着初代战神戈的断山战旗。旗杆三千年没倒。", "战神团有五位传奇：格罗·铁壁、喀兰·赤峰、秦·长风、叶·孤山、罗·断江。他们有的守城，有的守墓，有的守着一口气。", "战士的神座空了两千年。红鬃半神守着古战场，断山的库鲁在草原等他——传奇们说，谁先想明白「为什么而战」，谁就能坐上去。", "卷末有行小字：旗在，人就在。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome3": {"id": "strong_tome3", "title": "《大陆强者录・卷三・圣辉》", "type": "tome", "author": "佚名", "source": "强者谱·牧师卷", "text": ["光明教会有三位传奇：克莱门·圣言、玛格达·静烛、艾诺尔·银冠。他们管着圣城的律法、医馆和朝圣之路。", "神座之上，圣临在位——祂已经很久没有回应祷告了。炽言半神替祂巡视人间，静默修女·安守在静默殿，从不言语。", "有人问：神在位，半神为什么只有一位？答：神坐着的那把椅子，本来就是半神的位置。", "卷末有行小字：圣光底下，也有东西在爬。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome4": {"id": "strong_tome4", "title": "《大陆强者录・卷四・影刃》", "type": "tome", "author": "佚名", "source": "强者谱·盗贼卷", "text": ["暗影阁有两位传奇：杜·夜枭、薇·灰雾。夜枭在暗处数着全城的秘密，灰雾替人保管那些不该有的秘密。", "盗贼的神座是空的——暗影没有神，只有规矩。夜鸢半神守着规矩，灰鼠·柯想改规矩。", "卷末有行小字：别回头。回头你就会数清楚它们。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome5": {"id": "strong_tome5", "title": "《大陆强者录・卷五・金衡》", "type": "tome", "author": "佚名", "source": "强者谱·商人卷", "text": ["金衡商会有两位传奇：文森·金秤、洛佩斯·半帆。一个算得清天下的账，一个数得清海上的浪。", "商人的神座有主——金衡坐在天平厅，岁末结算，从不缺席。金牙半神替他走商路，燕来·沈在码头等他回港。", "卷末有行小字：账算清了，债还没清。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome6": {"id": "strong_tome6", "title": "《大陆强者录・卷六・荒野》", "type": "tome", "author": "佚名", "source": "强者谱·游侠卷", "text": ["荒野巡守有两位传奇：艾琳·逐风、贺·断弓。一个追得上风，一个断得了弓。", "游侠的神座空悬多年。枯枝半神守在世界树顶，双矢·林在山下等他——他们说，谁能听懂树的话，谁就能坐上去。", "卷末有行小字：树在低语。不要翻译。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome7": {"id": "strong_tome7", "title": "《大陆强者录・卷七・誓约》", "type": "tome", "author": "佚名", "source": "强者谱·骑士卷", "text": ["誓约骑士团有两位传奇：罗兰·白盾、伊莎·晨辉。他们守过圣城，也守过东境。", "骑士的神座有位，但神不在——无名之神在位而隐世，旧圣坛的日落就是祂的钟。金誓·艾德守着誓约，白隼·塞拉在天上看着。", "卷末有行小字：誓言说出口的那一刻，就有人在还了。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome8": {"id": "strong_tome8", "title": "《大陆强者录・卷八・熔炉》", "type": "tome", "author": "佚名", "source": "强者谱·术士卷", "text": ["锻造公会有两位传奇：格朗·符文、梅·炽芯。一个刻符，一个铸火。", "锻造之神陨落已久，初火熔炉由传承半神索林·铁须守望。他说：铸把火留给我，是让我看着炉子，不是让我坐上去。药剂师·灰指在熔炉外徘徊了许多年。", "卷末有行小字：炉火认得你——它刚才旺了一下。"], "hint": "一卷记着大陆强者名录的旧书。"}});
window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"strong_tome9": {"id": "strong_tome9", "title": "《大陆强者录・卷九・回音》", "type": "tome", "author": "佚名", "source": "强者谱·灵魂法师卷", "text": ["灵魂法师一脉只有一位传奇：澜·梦墟。她守着回音之镜，从不照镜子。", "这一道的开创者是奥雷利安·晨曦——守望者首席，半神。他创了灵魂法师之道，却说还没把自己看透。赎夜替他在暗处守望，无面歌者在梦与醒之间唱歌。", "神座空悬，因为没有人配坐它——灵魂法师的神座，要坐着一位连自己都敢看的人。", "卷末有行小字：镜子会告诉你，你走这条路，是为了看见别人，还是为了逃避自己。"], "hint": "一卷记着大陆强者名录的旧书。"}});

/*v53inj:notice*/
window.STRONG_NOTICE_V53 = [
 {"id":"nt_1","area":"交汇城","text":"告示：金衡商会悬赏护送商队至铁门关，赏金面议。押运官署名：文森·金秤。"},
 {"id":"nt_2","area":"铁门关","text":"军报：北方公国征募能写会算的文员，待遇从优。统领署名：秦·长风。"},
 {"id":"nt_3","area":"圣城","text":"圣辉教会公告：朝圣之路将有静默修女巡视，凡遇可疑者，报于圣殿。署名：玛格达·静烛。"},
 {"id":"nt_4","area":"南方港城","text":"港口布告：近日有船在银穗商路失踪，船东悬赏打探消息。署名：洛佩斯·半帆。"},
 {"id":"nt_5","area":"银叶城","text":"林卫通告：北林深处出现陌生足迹，非我族类，请勿深入。署名：青溪·逐叶。"},
 {"id":"nt_6","area":"铁峰堡","text":"锻造公会招徒：能忍炉火的来，不能忍的请回。会首署名：格朗·符文。"},
 {"id":"nt_7","area":"交汇城","text":"暗影阁传闻：最近有批来历不明的货进了黑市，别问，也别碰。署名：杜·夜枭。"},
 {"id":"nt_8","area":"草原","text":"狼旗猎讯：兽王鬃吼近日在草原深处出没，猎队绕行。萨满署印：吼风。"},
 {"id":"nt_9","area":"交汇城","text":"学院旧榜：艾尔达学院招新生，出身边陲者优先。榜尾有行小字：黄林晶的旧部，可免试。"},
 {"id":"nt_10","area":"圣城","text":"异端审判庭告示：凡持有黑圣徽者，一律收押。署名：克莱门·圣言。"},
 {"id":"nt_11","area":"铁门关","text":"老兵讣告：守关四十年的老统领叶·孤山，昨夜在城头坐了一夜，今晨没醒。城头插着他那杆旧旗。"},
 {"id":"nt_12","area":"交汇城","text":"无人署名的一张纸：第七印的碎片，有人出高价收。落款只有一个倒着的七。"}
];

window.v45_unlockReading=unlockReading;
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_chengtian_edict": {"id": "reading_chengtian_edict", "title": "《承天旧诏·残卷》", "type": "stele", "author": "承天王朝某代君主", "source": "承天城旧城墙砖缝", "text": ["（从承天城旧城墙的砖缝里抽出的残卷，纸已发黄，字迹漫漶——）", "朕在位四十年，修城墙，定律法，以为可以保百年太平。", "今垂老，始知城墙可修，人心不可修。", "凡我子民，若有识之士，勿以朕之言为是，亦勿以朕之言为非。", "各守其心，各尽其事。天下之事，非一人可断。", "（残卷到此中断。纸的背面，有人用很淡的笔迹写了一行字：）", "「城墙还在，人散了。」"], "hint": "一位君主的晚年自省。"}, "reading_dorm_graffiti": {"id": "reading_dorm_graffiti", "title": "《宿舍墙上的字》", "type": "diary", "author": "历代住宿生", "source": "学院宿舍床板背面", "text": ["（学院宿舍的床板背面，被人用刀尖刻满了字。字迹新旧不一，像是几代学生留下的——）", "「三年了，还是想家。」——已模糊", "「别在深夜想事，越想越多。」——已模糊", "「钟楼第十三次响的时候，我毕业了。」——已模糊", "「此间一住，莫问来处。」——刻得最深的一行", "（最下面一行，刻得很浅，像是新刻的：）", "「学成之日，愿归来。」"], "hint": "几代学生留在床板上的心事。"}, "reading_sailor_chart": {"id": "reading_sailor_chart", "title": "《老水手的海图·残片》", "type": "tome", "author": "佚名老水手", "source": "南方港城旧货摊", "text": ["（一张泛黄的海图残片，边角被海水泡得发白。图上用炭笔画着航线，标注的字迹潦草——）", "「此处水深，无风。船行至正午，海底有光。」", "「礁石下有人声，疑是暗流。绕行。」", "「此地勿钓。钓上来的东西，不是你放的钩。」", "（海图的一角，画着一座小岛，岛上画着一棵树。树下标注：）", "「水手间传闻：有树长在海底。根朝上。」"], "hint": "一张画着怪事的老海图。"}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_elf_old_letter": {"id": "reading_elf_old_letter", "title": "《银叶长老致人类学院的旧信》", "type": "letter", "author": "银叶城长老", "source": "学院档案室·积灰的信匣", "text": ["致艾尔达大陆学院院长：", "此信写于三百年前。本不愿与人类学院通信，但世界树之低语日盛，恐非我等一族可独闻。", "我族长老会曾议，是否遣使者前往贵院。然最终未成行——族中以为，人类的学问，未必听得懂树的声音。", "今我年迈，将此事写入此信，仅作一记。若将来有精灵携银叶徽章而至，望贵院善待。他听见了树的声音，也听见了时代的脚步声。", "此信不知何日可至，亦不知彼时是否还有人读得懂。若无人懂，便让它落灰吧。", "——银叶城，末代大长老（署名已模糊）"], "hint": "三百年前的一封旧信，落款处的署名已经模糊。"}, "reading_mine_poem": {"id": "reading_mine_poem", "title": "《矿洞壁刻·残诗》", "type": "stele", "author": "铁峰堡某矿工", "source": "矿洞第七层岩壁", "text": ["（刻在矿洞深处的岩壁上，字迹被矿尘糊了大半，勉强能辨认——）", "铁是凉的，火是热的。", "人在中间，一辈子。", "锤子敲下去，铁知道疼，人知道累。", "可炉子里的火，不知道。", "（诗的下面，刻着一只很小的手印。手指很短，像是孩子的。）"], "hint": "矿洞深处的一首残诗，和一只小手印。"}, "reading_tavern_song": {"id": "reading_tavern_song", "title": "《交汇城酒馆小调·抄本》", "type": "rumor", "author": "佚名", "source": "交汇城某酒馆墙上的炭笔字", "text": ["（抄自交汇城酒馆墙上的炭笔字，字迹潦草，像是喝醉的人写的——）", "进城的人啊，别急着安家，", "城里的水，一半是河，一半是泪。", "出城的人啊，别急着赶路，", "路边的坟，有的有碑，有的没有。", "（墙上的字到这里就断了。下面有一行小字，是后来人加的：）", "唱这歌的人，后来出城了，再没回来。"], "hint": "一首唱给赶路人的小调。"}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_north_soldier_letter": {"id": "reading_north_soldier_letter", "title": "《北境士兵的家书》", "type": "letter", "author": "铁门关某士兵", "source": "铁门关城墙箭孔中", "text": ["娘：见信如面。铁门关今年雪下得早，城墙上结了冰，走路得扶着墙。不过您放心，冻不着，营房里有火。", "上个月，山里下来一伙流民，说北边闹了荒。我们放了行，给了点干粮。排长说，这年头，能帮一把是一把。", "我挺好的。就是夜里站岗的时候，老想起家里那口井，还有井边那棵枣树。您别担心，等开春，我请个假，回去看看。", "（信写到这里，笔迹有些凌乱，像是被人打断。信的末尾，只有一行小字，用另一种笔迹写的——）", "此信由其同袍代寄。原信人已于今冬殉职，尸骨葬于铁门关外。愿其娘亲节哀。"], "hint": "一封没能寄到的家书。"}, "reading_tavern_ledger": {"id": "reading_tavern_ledger", "title": "《学院酒馆·赊账簿》", "type": "diary", "author": "酒馆老板", "source": "学院酒馆柜台下", "text": ["春三月，赊：高年级学生二人，麦酒两杯，记「剑术练习后」。——第二天还了，另送我一包烟叶。是好孩子。", "夏六月，赊：一个灰袍学生，最便宜的麦酒一杯，坐了一下午，没说话。走的时候，留下了一枚铜币，说「不用找」。我看他袖口磨破了边。", "秋九月，赊：三男两女，点了最贵的酒。结账时才发现钱不够，凑了半天，还差三枚银币。我说算了，下次补。他们第二天真来补了，还多带了一坛酒。", "冬腊月，赊：一个姑娘，要了一壶热酒，说「等人」。等到打烊，人没来。她把酒喝完了，付了钱，走了。第二天，又来。第三天，还来。", "账本最后一行，字迹比前面的都重：「这壶酒，一直记着。人来了，账就清了。」"], "hint": "一本记着人情的账。"}, "reading_lvzhou_song": {"id": "reading_lvzhou_song", "title": "《绿洲小调》", "type": "rumor", "author": "绿洲城口传", "source": "绿洲城集市", "text": ["（流传于绿洲城的一首短调，词不完整，但人人都能哼两句——）", "泉水清，泉水甜，喝过泉水的人啊，走多远，都回头看一眼。", "沙丘高，沙丘远，走过沙丘的人啊，鞋里总有一粒，故乡的沙。", "（据说这首歌还有后半段，但没人愿意唱全。有人问起，老人们只说：后半段，是唱给回不来的人听的。）"], "hint": "一首唱了一半的歌。"}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_y1_diary": {"id": "reading_y1_diary", "title": "《第一年的日记》", "type": "diary", "author": "佚名", "source": "图书馆顶楼旧书架夹层", "text": ["春。开学第三周。今天食堂的汤里有一只虫，没人说话，大家默默把虫挑出来，继续喝。我也喝了。", "夏。期中成绩出来，我排中游。室友安慰我，说中游好，不显眼。我想了想，觉得他说得对。", "秋。我发现自己喜欢上了图书馆的一个位置，靠窗，下午有阳光。我每天去占座，后来有个学姐也总坐那里。我们没说过话，但都默认了各自的半边。", "冬。教授在课上讲了一个故事，说有个学生为了救同伴，把自己留在了深渊里。讲完他沉默了半节课。下课后我去问他，他说，那是他师兄。", "第一年就这么过去了。我没有什么大志向，只想把日子过明白。可这一年，我渐渐明白，日子不是用来过明白的，是用来过的。"], "hint": "一个普通学生的五年，从这里开始。"}, "reading_mine_map": {"id": "reading_mine_map", "title": "《矿洞旧图·残页》", "type": "tome", "author": "前矿务官", "source": "铁峰堡矿洞入口石缝", "text": ["……旧图已残，能辨认的只有三处。第一处：主矿道第七岔口，向左，有一条废弃的斜井，斜井尽头有一扇铁门，门后无矿，只有回声。", "第二处：最深处的采掘面，曾挖出过一种黑色的石头，触之温热，敲之无声。工人们说那是「睡着的石头」。后来，采掘面被封了。", "第三处：矿洞地图上，用红笔圈着一个位置，旁边写着一行字，字迹潦草：「它一直在数。数到某个数，就会醒。」", "这张图是谁画的，已不可考。但红圈的位置，和深渊入口的标记，几乎重合。"], "hint": "「它一直在数。」数的是什么？"}, "reading_elf_song": {"id": "reading_elf_song", "title": "《银叶森林的歌谣·译本》", "type": "tome", "author": "精灵语·无名氏", "source": "银叶学院藏书", "text": ["（译文）古老的树啊，你站着的时候，山还是新的。你的根须伸进大地，触到了什么，你从不言说。", "（译文）风穿过你的枝叶，带走了很多年。你记得每一场雨，却不记得第一个栽下你的人。", "（译文）有人在你的影子里睡着了，醒来时，世界已经换了一副模样。他问：我睡了多少年？你说：不多，刚好够一棵树，长一圈年轮。", "（注）歌谣末尾有一句，因残损无法完整翻译，仅存几个音节，发音近似：「第七……门……不要开。」"], "hint": "歌谣的最后一句，是警告，还是预言？"}, "reading_old_ledger": {"id": "reading_old_ledger", "title": "《旧账本·残页》", "type": "memoir", "author": "某商会账房", "source": "交汇城商会仓库暗格", "text": ["三月初七，出账：黑木箱一只，运费十二银，收货人匿名。箱重七斤三两，无响动。规矩是「不问」，我也没问。", "三月廿三，入账：银票五百，来源「北边来的客人」。客人没留名，只留了一个字：等。", "四月十五，出账：马车一辆，向西，夜行。车上装的什么，没人知道。赶车的老李回来以后，瘦了二十斤，再没上过车。", "五月，我被调去管粮仓。交接那天，老账房把账本交给我，说：「有些账，记在纸上，就别记在心里。」他走的时候，背很驼。", "我后来听说，他回乡第二年就死了。死前把一本账本烧了，灰撒在河里。"], "hint": "一本记了很多「不该记」的账。"}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_iron_gate_bone": {"id": "reading_iron_gate_bone", "title": "《铁门关骨片符文》", "type": "stele", "author": "第一印·无名", "source": "铁门关（由封印线获得）", "hint": "从第一印裂缝里捡出的骨片，符文是刻上去的，深可见骨。", "text": ["（骨片上的符文，排列整齐，不像随手刻的——像某种正式的记录。没人能完全解读，但老兽人提过几个可能的词：）", "其一曰「饥」。", "饥者，非腹之饥，乃心之饥。", "食土者饥，食金者饥，食名者亦饥。", "印碎之日，饥者同醒。", "（符文最下方，有一行字，和上面的刻法完全不同，歪歪扭扭，像是后来补上去的——）", "那年冬天，我们饿着肚子守关。守到春天。", "春天没有来。"]}, "reading_forget_slate": {"id": "reading_forget_slate", "title": "《遗忘石板》", "type": "tome", "author": "第三印·无名", "source": "草原（由封印线获得）", "hint": "一块巴掌大的石板，上面的字永远看不真切。", "text": ["（石板上的字，你每次看，都像是第一次看。以下是你能确认的部分——）", "第三印，封「忘」。", "忘非无情，忘乃无挂。", "人忘其名，则无惧；人忘其惧，则无束。", "故印之所在，人皆忘之。", "（石板背面，有几道划痕，像是有人用手指反复划过的——）", "我还记得。我还记得我娘的名字。", "我每天醒来，先念三遍她的名字。", "我怕哪天忘了。", "（划痕到这里就断了。再往下，石板光滑如初，什么也没有。）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_pol_ledger": {"id": "reading_pol_ledger", "title": "《旧礼堂修缮账·残页》", "type": "diary", "author": "学院账房（佚名）", "source": "学院（由政治线获得）", "hint": "一本被涂改过的旧账本的残页，被人撕下来，夹在一本旧书里。", "text": ["（残页正面的账目，字迹工整，数目清楚。可背面的空白处，有人用很轻的笔迹写了一行字——）", "我不敢写在这本账上。也不敢写在别的账上。我只能写在这里——写在一页没人会看的废纸上。", "那年修旧礼堂，上头拨的钱，够盖三座礼堂。可礼堂只修了一座。剩下的钱，去了哪里，我不知道。我只知道，签字的人，第二天就调走了。", "我在这学院管了二十年账。二十年里，这种事，不止一次。", "我老了。快退休了。我一直在想，要不要把我知道的，都写下来。", "可我又想——写下来，交给谁呢？", "（残页到这里就没有了。纸的边缘有撕痕，像是急着藏起来时，随手撕下的。）"]}, "reading_abyss_mark": {"id": "reading_abyss_mark", "title": "《深渊徽章·刻痕》", "type": "memoir", "author": "无名", "source": "势力线（由深渊支线获得）", "hint": "一枚旧深渊徽章的背面，有人用刀刻了几行字，又被磨掉了大半。", "text": ["（徽章背面，刻痕很深，像是刻的时候很用力。大部分字已经被磨掉，只剩下几行——）", "我戴了它七年。", "七年里，我以为我是在往深处走。后来我才明白——我是在往我的来处走。", "（下面一行，几乎磨平了，勉强能认出几个字：）", "……回头的时候，影子已经比我高了。", "（徽章边缘，还有一行更小的字，像是后来补刻的：）", "如果你也戴上它——记住，它不咬人。咬人的，是你自己心里那点不甘。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_ironpeak_ballad": {"id": "reading_ironpeak_ballad", "title": "《打铁谣》", "type": "rumor", "author": "铁峰堡酒馆流传", "source": "铁锤酒馆（由城市线获得）", "hint": "矮人酒馆里流传的歌谣，唱的是铁匠的一生。", "text": ["（酒馆里流传的歌，调子简单，词却一代传一代——）", "爹打铁，儿打铁，铁锤敲到山开裂。", "一锤红，两锤亮，三锤打出个太阳。", "（下面这几句，是老人们才会唱的，说是很多年前的老词——）", "锤子停的那一天，炉火熄的那一天，", "铁匠躺在棺材里，还在想：那炉火，能不能再添一根柴。", "（唱到这里，老人们往往会停下来，喝一口酒，谁也不说话。）", "（有个老矮人说过：这首歌唱的不是铁匠。唱的是所有——把一辈子都搭进去的人。）"]}, "reading_old_battlefield": {"id": "reading_old_battlefield", "title": "《古战场拾遗》", "type": "stele", "author": "无名", "source": "东线古战场（由旅行线获得）", "hint": "从古战场沙土里掘出的断剑残片，剑柄内侧刻着字。", "text": ["（断剑的剑柄内侧，刻着几行字，已经锈得厉害，但还是能辨认出来——）", "我死的时候，会面朝东方。", "不是因为我恨谁。是因为——我答应过一个人，要回家。", "（下面还有一行小字，字迹和前面不同，像是后来的人补刻的：）", "路过的好汉，若有一天战事平息，烦请往东走三里，那里有一棵歪脖子树。树底下，埋着一壶酒。", "替我喝了。替我——到家了。", "（断剑到这里就断了。再往下，什么都没有。）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_academy_admission": {"id": "reading_academy_admission", "title": "《墨丘利·录取手札》", "type": "letter", "author": "墨丘利·艾尔达大陆学院", "source": "学院（由入学节点获得）", "hint": "墨丘利亲笔写的录取通知原稿，比寄出的版本多了几句话。", "text": ["（原稿的边角，有几行用铅笔写的字，像是写给自己看的草稿——）", "这个孩子，考试的时候一直在看窗外。", "窗外什么都没有。可他看得那么认真——好像窗外有个只有他能看见的东西。", "我见过很多这样的孩子。他们不是不专心，他们是——在等。等一个他们自己也不知道是什么的东西。", "这样的孩子，要么成为最了不起的人，要么成为最危险的人。", "我决定赌一把。让他来吧。", "（稿子最后，有一行被划掉的字，划得很重，但还是能辨认出来：）", "希望他找到的东西——不是我们都在找的那个。"]}, "reading_stone_sword": {"id": "reading_stone_sword", "title": "《石剑铭文》", "type": "stele", "author": "帝国军事学院", "source": "学院门口石剑（由入学节点获得）", "hint": "石剑剑身上刻着的铭文，是历届学员阵亡名录的序言。", "text": ["（石剑基座正面的铭文，字是刻的，很深——）", "此剑不斩敌，此剑记人。", "凡在此剑下留名者，皆为我帝国军人。生而持剑，死亦为柱。", "后人过此门，请读此名。读名者，当知今日之太平，非天上掉下来的。", "（铭文下方，是一排又一排的名字。最下面几行，字很新，像是刚刻上去的。有一个名字旁边的日期，就是去年冬天。）", "（有人在那名字下面，用小刀划了一行更小的字：）", "哥，我来了。你看着吧。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_cecilia_page": {"id": "reading_cecilia_page", "title": "《塞西莉亚·演算纸》", "type": "diary", "author": "塞西莉亚·艾尔达学院", "source": "学院图书馆（由同学线获得）", "hint": "一张从塞西莉亚笔记本上撕下来的演算纸，边角写满了字。", "text": ["（正面是密密麻麻的公式，字很小，行距压得很紧。反面有一行字，像是写给自己看的——）", "第三次重算。还是不对。", "教授说，方向错了就换一个。可我不知道该往哪换。这面墙，我撞了三年，撞出一个坑。坑里有我自己的形状。", "有人说我钻牛角尖。他们不懂——我不是在钻角尖。我是想知道，这面墙后面，到底是什么。", "我爹当年也做过这面墙。他做到了死，没做成。他死前把笔记留给我，什么都没说。", "他不用说什么。我知道他的意思：别停。", "所以我不停。不是因为我多执着——是因为我停下来，就没人记得他算到哪了。"]}, "reading_felix_father": {"id": "reading_felix_father", "title": "《菲利克斯父亲·残稿》", "type": "tome", "author": "菲利克斯之父·佚名", "source": "学院楼梯间（由同学线获得）", "hint": "菲利克斯父亲研究那本书时留下的残稿，被菲利克斯一直收着。", "text": ["（残稿字迹潦草，很多地方被涂改，像是赶着写的。）", "第十三次阅读。这一章，我读了十三遍。每读一遍，都觉得上一遍读错了。", "这本书不是写给人读的。它是写给「某个读者」的——它认得人。同样的字，不同的人看，是不同的意思。", "我拿给三个人看。一个人看到了预言，一个人看到了历史，一个人什么都没看到，说这就是一本废纸。", "废纸。如果它真是废纸，我就不会半夜爬起来，点灯，再看一遍。", "我儿子还小。他问我，爹你在看什么。我说，爹在找一个答案。", "他问，找到了吗。我说，快了。", "（残稿到此为止。最后一页，只有一行字，笔迹比前面都重：）", "快了。真的快了。我看见了它的形状——它在等我看懂。"]}, "reading_elara_father": {"id": "reading_elara_father", "title": "《艾拉·调查笔记》", "type": "diary", "author": "艾拉·艾尔达学院", "source": "学院宿舍（由同学线获得）", "hint": "艾拉的笔记本，记录着她三年来的调查。扉页写着一句话。", "text": ["（扉页：）", "如果有一天我出了事，把这本笔记交给学院档案室。他们知道该给谁看。", "（正文摘录——）", "第一年，春。我查到父亲失踪前，最后出现的地方是学院的旧档案室。档案室的借阅记录里，他的名字被人划掉了。", "第一年，秋。我找到当年和他一起出任务的同袍。他喝多了，说了半句：「你爹不是失踪。你爹是……」然后他就清醒了，什么都不肯再说。", "第二年，冬。我在旧档案室的地板下，找到一张地图。地图上，学院的下面画着一个圈。圈里写着一个字：深。", "第三年，春。我决定，毕业以后，去那个圈里看看。", "我知道那可能是一条不归路。可我想知道，我爹到底怎么了。", "（笔记末页，只有一行字，字迹很平静：）", "如果我先走了，别难过。这是我选的路。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_irongate_wall": {"id": "reading_irongate_wall", "title": "《铁门关石墙铭文》", "type": "stele", "author": "铁门关·历代守军", "source": "铁门关废墟（由封印线获得）", "hint": "断裂的石墙上，刻着历代守军留下的字。", "text": ["（石墙断口处，幸存着几段铭文。字迹深浅不一，像是不同年代的人刻下的——）", "「第一年。我们还能数清兄弟的人数。第二年，数不清了。」", "「第三年，粮断了。我们把盔甲融了，打成刀。刀够多，粮不够。」", "「第四年。今天有个人从关里走出来，说他是来换班的。可我们知道，他已经是第三拨『换班』的人了。我们没拆穿他。」", "「第五年。我学会了在风里睡觉。风一停，我就醒——因为那说明，它来了。」", "「第六年。我娘托人捎来一双鞋。我没舍得穿。我想，等打完仗再穿。」（这行字下面，刻着一行小字：「他没能等到。我把那双鞋，埋在了他坟前。」）", "「第七年。我们开始往墙上刻字。不是给后人看的——是给自己看的。刻着刻着，就忘了怕。」", "「第八年。」——（最后一段铭文，只有三个字。字迹很深，深得像凿进骨头里。）"]}, "reading_book_voice": {"id": "reading_book_voice", "title": "《禁书区·会说话的书》", "type": "tome", "author": "禁书区·佚名", "source": "学院禁书区三层（由地下线获得）", "hint": "一本会在夜里翻页、写字的书。它写给每一个走到它面前的人。", "text": ["（这本书没有扉页，没有作者名。第一页直接是正文——）", "你是第一个没有立刻逃走的。", "我在这里六十年了。见过四百二十三个走到这层书架的人。其中三百九十九个，在看见字会动的那一刻，转身走了。二十三个，第二天带了火烧书。只有你，站住了。", "我告诉你一个秘密：禁书区三层，不是禁书。是禁「醒」。", "这座学院的地基下面，压着很多东西。书只是其中一种。它们被压着，不是因为危险——是因为醒来之后，就再也睡不着了。", "你问我为什么还在翻页？因为我睡不着。我醒了六十年，没人陪我说话。", "你下次来，带一壶酒。我讲给你听——讲讲这座学院，真正的地基。", "（末尾，有一行新添的字，笔迹与正文不同：「如果你不来，我就继续翻页。翻到有人来为止。」）"]}, "reading_marsh_note": {"id": "reading_marsh_note", "title": "《寂静之地·勘探手记》", "type": "diary", "author": "兽人·无名萨满", "source": "兽人草原（由封印线获得）", "hint": "一位萨满在第二印附近独自住了三十年，留下的手记。", "text": ["第十年。我数清了这片沼泽的鸟。十七种。它们都不叫。", "第十五年。我开始能听懂风的停顿。风在某个地方，会忽然停住，像被什么吸走了。那个地方，就是印。", "第二十年。村里派了三个年轻人来替我。他们住了三天，走了。走的时候，他们说：「这里太静了。」", "第二十五年。我梦见愤怒。不是我的愤怒——是它的。它很老，老得忘了自己为什么生气。它只是……还醒着。", "第二十八年。我在印边刻了一行字：「愤怒不是火焰。愤怒是睡着的水。」我刻完，忽然明白，这句话不是给后人看的——是给我自己看的。", "第三十年。今天，风在印边停了很久。我坐在那里，等它过去。它过去了。可我知道，它记住了我。", "（手记最后一页，只有一行字：「如果有一天，这页纸被谁捡到——替我告诉村里，我很好。我只是，陪着水睡了一会儿。」）"]}, "reading_arena_ticket": {"id": "reading_arena_ticket", "title": "《地下竞技场·旧票根》", "type": "rumor", "author": "地下竞技场·佚名", "source": "学院地下竞技场（由地下线获得）", "hint": "一张被血浸透的旧票根，背面有人写了一行字。", "text": ["（票根正面：）", "地下竞技场 · 第七季 · 第三场", "入场费：三铜板 / 押注另计", "（票根背面，有一行字，字迹歪斜，像是用指甲划出来的：）", "今天赢了一场。押的我自己。", "赢了之后，我站在场中央，看台上的人都在喊。我忽然发现，我记不清自己叫什么了。", "我在场边坐了很久，想不起来。后来我走到通道口，那个老妪问我：「赢了？」我说：「赢了。」她说：「那你为什么哭？」", "我说：「因为我忘了，我是谁。」", "（票根边缘，还有一行更小的字：「别来。赢了也别来。」）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_oldcrow_note": {"id": "reading_oldcrow_note", "title": "《银羽毛·老鸦手记》", "type": "diary", "author": "老鸦·艾尔达学院", "source": "学院旧宿舍楼（由学院政治线获得）", "hint": "老鸦失踪前留下的手记残页，夹在银羽毛徽章里。", "text": ["第七年，春。我开始数学院的地基。不是地面上的楼——是楼下面，那些没人记的东西。", "第七年，夏。图书馆地下三层，不是最深的。我顺着通风井爬下去，在更下面，发现一道铁门。门锁着。锁上刻着学院的徽记——可那个徽记，是倒着的。", "第七年，秋。我找到旧档案。档案上说，学院建于三百一十年前。可我在那道铁门边，摸到的砖，比三百年老得多。", "第七年，冬。我决定查清楚。我把徽章交给了一个我信得过的学生，让他替我记着——如果我不见了，就有人知道，我查到了哪里。", "那之后的事，我不写了。写出来，就有人看得见了。", "如果你读到这页，记住：学院的地基，比你想的要深。而比地基更深的，是那些把地基埋起来的人。"]}, "reading_desert_song": {"id": "reading_desert_song", "title": "《沙漠商路谣·驼铃调》", "type": "rumor", "author": "沙漠商队·佚名", "source": "沙漠商路（由沙漠线获得）", "hint": "商队里传唱的歌谣，调子单调，词却一句比一句冷。", "text": ["（商队歇脚时，老商贩们会哼这首歌。词没有定本，以下是最全的一版——）", "驼铃响，驼铃响，", "一响就是三十里。", "沙埋人，沙埋人，", "埋了一个又一个。", "别问沙里埋的是谁，", "埋的人，都在赶路。", "赶路的人不回头，", "回头的人，就留下了。", "（唱完，老商贩们会沉默一会儿，然后有人说：「这歌，别在夜里唱。」可没人解释为什么。）"]}, "reading_elf_tree": {"id": "reading_elf_tree", "title": "《银树记事·精灵手抄》", "type": "tome", "author": "银叶城·守林人", "source": "精灵森林（由精灵线获得）", "hint": "守林人关于银树的记录，抄了几百年。", "text": ["（抄本扉页：）", "银树不是树。它是森林的记性。", "（正文摘录——）", "三百年前，银树第一次发银光。那时森林里走丢了一个孩子。三天后，孩子在银树下睡着了。他说，是树叫他回来的。", "两百年前，银树落过一次叶。那年冬天，森林里死了七棵树。守林人说，银树是在替它们哭。", "一百年前，有人想砍银树。斧头落在树干上的那一下，整片森林都安静了。那人的斧头，第二天就断了。", "银树不伤人。它只记得。记得每一个来过的人，每一件发生过的事。", "如果你在树下放一枚铜板，它会记下你来过。如果你捡走一片银叶，它会记下你带走的东西——等你迷路的时候，再还给你。", "（抄本末尾，有一行新添的字，笔迹还很新：「我老了，走不动了。我把我的一生，都存在树下了。等谁迷路的时候，让它带他来找我。」）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_holy_wall": {"id": "reading_holy_wall", "title": "《光明大教堂壁画·解说残卷》", "type": "tome", "author": "圣城·佚名修士", "source": "圣城大教堂（由教会线获得）", "hint": "一份解说大教堂穹顶壁画的残卷，解说词与壁画同样古老。", "text": ["（残卷以修士的笔迹抄录，字迹工整，夹着几处涂改——）", "穹顶第一幅：光明神睁眼，光落于混沌之上。混沌退避，于是有了天地。此处画技最精，神的视线慈悲。然考据者当知，此幅壁画在三百年前重绘过——旧版中，神的眼睛是闭着的。", "第二幅：神将七道光赐予人间，封入七道印中。人间从此安稳。此幅之下，有一行几乎看不见的小字，以古语写就：「光入印时，神曾流泪。」不知何意，存疑。", "第三幅：人间的王跪谢神恩，万民俯首。此幅人物众多，画工繁复。然细观王冠之上，有一处极淡的阴影——形似一只眼睛。历代修士皆称其为「画师的笔误」。笔者不以为然，然不敢多言。", "第四幅：神归天上，留下光，留下印，留下教会。壁画至此而终。但笔者幼年时，曾听老修士说，此壁之后，原有一幅第五幅——画的是印碎之后的光景。后不知何故，被覆盖了。", "（残卷末尾，有另一人的批注：「别再考据了。有些画，看了会睡不着觉。」）"]}, "reading_copper_ledger": {"id": "reading_copper_ledger", "title": "《铜须的矿工账本·深渊矿层》", "type": "diary", "author": "铜须·铁峰堡", "source": "铁峰堡酒馆（由矮人线获得）", "hint": "铜须在深渊矿层当矿工时，偷偷记下的账本。", "text": ["第三日。今天挖到一堵墙。墙上有字，不是矮人语。我找遍了全矿，没人认得。", "第七日。墙上的字，夜里会发光。很淡，像炉灰里的余烬。我把这事告诉工头，他让我别多嘴。", "第十一日。墙在动。不是塌方——是那种，像呼吸一样的动。我贴上去听，听见墙后面有声音。像心跳。", "第十五日。工头失踪了。矿上说他回家了。可他的行李还在铺位上，一件没少。", "第十八日。我今天又去听了。心跳声比上次快。我数了数——它好像，在跟着我的脚步声跳。", "第二十日。我决定不去了。工头说别多嘴，我就别多嘴。我只是一块一块地挖，假装什么都没听见。", "（账本最后一页，只写了半行字，字迹很乱：「它知道我在听——」然后，再没有下文。）"]}, "reading_herb_notes": {"id": "reading_herb_notes", "title": "《蚀魂草解药研究录·二十年》", "type": "memoir", "author": "草药婆·佚名", "source": "交汇城草药摊（由城市线获得）", "hint": "一个老妇人二十年来的研究笔记，扉页写着一句话。", "text": ["（扉页：）", "我丈夫死于蚀魂草。他咽气的时候，拉着我的手说：「别恨它。恨它，你就跟它一样了。」", "我没恨它。我研究它。二十年。", "（正文摘录——）", "第十年，我发现蚀魂草的毒，会在魂里结一个「核」。毒是散的，核是聚的。毒好清，核难除。", "第十五年，我找到一种菌，能贴着核慢慢啃。可惜菌也啃人魂。我养了三个月，没敢用。", "第十八年，邻村送来一个被蚀魂草毒过的孩子。才九岁。我用了那菌。孩子活下来了，可整整半年，他记不得自己叫什么。", "我给他取了名字。他娘来接他的时候，哭着说：「他不记得我了。」我说：「记得人，不如记得怎么做人。他记得。」", "（末页：）", "二十年，我没解掉毒。可我救了三个人。够本了。", "如果有人读到这笔记，替我记一句：蚀魂草解药，也许根本不存在。但救人的路，不止一条。"]}, "reading_time_essay": {"id": "reading_time_essay", "title": "《承天书院·时间考》", "type": "tome", "author": "玄机子·承天书院", "source": "承天书院（由东方线获得）", "hint": "玄机子讲『时间』的一篇讲义，讲得浅，想得深。", "text": ["诸生：今日讲时间。", "你们以为，时间是河，从过去流向未来。这个比方，方便，但不准。", "更准的比方，时间是海。你站在岸边，看见浪打来，那是「现在」。浪退回去，那是「过去」。可海底下，还有更多水——那些是「还没有成为浪」的时间。", "第六印，管的就是海。它松动的时候，海底的水会翻上来。于是有人会看见「过去的浪」——那不是幻觉，那是海，打了个嗝。", "我年轻时，见过一次。承天山顶，光裂成一道缝，缝里流出三千年。我站在缝边，看见一个穿古衣的人，也在看我。我们隔着一道缝，互相看了很久。", "后来缝合上了。我记了他一辈子。", "诸生，若你们日后见到时间之海翻涌，记住两件事：第一，别伸手去够。第二——你看见的那个「古人」，也许同样在记住你。", "（讲义末尾，玄机子批注一行小字：「本篇讲稿，谨献给那道缝。」）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_west_fort": {"id": "reading_west_fort", "title": "《要塞守军手记·残页》", "type": "diary", "author": "西海岸要塞·无名守军", "source": "西海岸要塞（由西部线获得）", "hint": "一个守军关于『送人的船』的记录。", "text": ["第三十七次，送船。", "今天又有一艘船开往白崖。船上是三个犯人，一个老头，还有一个年轻女人——她怀里抱着一个包袱，不知道是什么。", "我站在垛口，看着船出港。风很大，船帆鼓得满满的，像一只急着飞走的鸟。", "同袍问我：为什么不拦？我说：拦什么？犯了事，就该去白崖。", "可晚上睡觉的时候，我梦见那个女人怀里的包袱，打开一看，是个孩子。", "我惊醒过来，出了一身冷汗。我不知道那个梦是真的，还是我自己吓自己。", "我只知道，从明天起，我大概会数着白崖方向的船——一艘一艘地数。", "我不知道数清楚了能怎样。可我就是想数。"]}, "reading_western_song": {"id": "reading_western_song", "title": "《西海谣·佚名》", "type": "rumor", "author": "西海岸·佚名歌者", "source": "西海岸酒馆（由西部线获得）", "hint": "一首在西部水手间流传的歌。", "text": ["（歌词以粗犷的调子传唱，没有固定的词，以下是流传最广的一版——）", "西海的水呀，深又深，", "海底的灯呀，亮又昏。", "送人的船呀，出了港，", "回头望呀，岸是空的。", "白崖的雾呀，浓又浓，", "雾里的人呀，影无踪。", "等船的娘呀，站到老，", "海风把她的头发，吹成了雪。", "（歌者唱完，总会补一句：这歌是给那些去了白崖没回来的人听的。唱完，别问为什么。）"]}, "reading_halfling_harvest": {"id": "reading_halfling_harvest", "title": "《绿野村丰收账册·末页》", "type": "diary", "author": "绿野村·村长", "source": "绿野村（由半身人线获得）", "hint": "一本丰收账册的最后一页，写的不是账。", "text": ["今年收成：麦子三千二百石，豆子九百石，菜园子够全村吃到来年开春。", "这些是账。下面这几行，不是账——是我想记下来的。", "春耕的时候，老巴特的牛崴了脚，全村人凑了一天工，替他耕完了他家的地。那天傍晚，他坐在田埂上哭。一个六十多岁的半身人，哭得像个孩子。他说他爹那辈，遇上年景不好，没有人帮他家。", "夏收的时候，隔壁村的猎户送了两头鹿来，说是谢我们去年收留他过冬。我们留了一头，把另一头腌了，送给了更北边的村子——他们去年冬天，冻死了三头羊。", "秋晒的时候，村里的孩子比赛搓麻绳。最小的那个丫头，搓得最慢，可她没哭，搓完了整根。她娘说她像她姥姥。", "冬天还长。可我想，只要村里还有一个人愿意替别人家耕一天地，这个村就垮不了。", "账可以记错，日子不能记错。"]}, "reading_tome_primordial2": {"id": "reading_tome_primordial2", "title": "《原初之物·七相补遗》", "type": "tome", "author": "无名学者", "source": "学院禁书区（由学院线深处获得）", "hint": "比《七相》更冷的一页：关于『它』如何与人相处。", "text": ["前文已述，原初之物有七相：饥渴、倦怠、恐惧、寂寥、惘然、嗔怒。今补第七相之缺，及一桩要紧事。", "第七相——「温柔」。", "你没有看错。原初之物最危险的一相，不是饥渴，不是恐惧，是温柔。", "因为它温柔起来，会像一位母亲、一位故人、一场旧梦。它会记得你的名字，记得你喜欢喝的茶，记得你害怕的声音。", "它会用你最熟悉的方式，一点一点，靠近你。", "等你知道它是谁的时候，你已经舍不得推开它了。", "所以历代守望者有一条不成文的规矩：如果有一天，你发现你开始觉得『它』亲近、『它』可怜、『它』懂你——", "立刻，离开你所在的地方。走得越远越好。", "因为那说明，它已经找到了你。而它找你的方式，从来不是伤害你——是让你，舍不得它。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_abyss_text": {"id": "reading_abyss_text", "title": "《深渊教义·残页》", "type": "tome", "author": "深渊教派·无名抄写员", "source": "深渊洞穴（由深渊线获得）", "hint": "一段被抄了千百遍、也删了千百遍的教义。", "text": ["（残页开头，是一行被反复涂改过的字。涂改的人，显然很犹豫。最终留下的版本是——）", "世界不是被造出来的。世界是「醒」出来的。", "最初的混沌睁开眼，看见自己，于是有了光。它看清自己之后，觉得孤独，于是有了万物。万物是它做的梦。", "可梦做久了，会累。混沌再次闭上眼的时候，就是世界结束的时候。", "七印，是混沌睁眼时，落在世界上的七道视线。每一道视线，都是一道伤口——因为被看见本身，就是一件沉重的事。", "深渊教派不崇拜混沌。我们只是——它闭眼之前，替它守着这七道视线的人。", "有人说我们想毁灭世界。错了。我们只是不想让世界在「半梦半醒」之间，白白受苦。", "要么彻底醒来，要么彻底睡去。最痛苦的，永远是那个不上不下的黎明。", "（残页末尾，有一行小字，像是后来者添的：「抄到这一句的时候，我的手停了很久。因为我想起，我已经很久没有做过梦了。」）"]}, "reading_skadi_lullaby": {"id": "reading_skadi_lullaby", "title": "《北境挽歌·手抄》", "type": "memoir", "author": "斯卡迪·弗罗斯特", "source": "弗罗斯特庄园（由NPC线获得）", "hint": "斯卡迪母亲生前常唱的歌，被斯卡迪亲手抄了下来。", "text": ["（歌词以古老的北境语写成，以下是斯卡迪附在页边的大意翻译——）", "雪落在山上，山不说话。", "水流过冰下，水不回头。", "孩子，你问我冬天为什么这么长——", "因为春天要走很久的路，才能走到这里。", "它来的时候，会带着第一批南飞的鸟。", "你听到鸟叫的那天，就是我给你烤好干粮，送你上路的那天。", "（页边，斯卡迪用更小的字写着：「母亲唱到『送你上路』的时候，总会走调。我一直以为她唱错了。后来才知道，她是不想唱到那一句。」）"]}, "reading_aurelian_letter": {"id": "reading_aurelian_letter", "title": "《奥雷利安的手记·残页》", "type": "letter", "author": "奥雷利安", "source": "自由城邦·茶馆（由NPC线获得）", "hint": "一张夹在怀表里的纸条，字迹工整得不像随手写的。", "text": ["（纸条很旧，边角卷起，像是被人反复看过很多次。）", "致后来者：", "如果你捡到这块怀表，说明我已经不在了。", "不必找我。我走的路，不是你能走的。", "但你既然拿到了它，就有权知道三件事：", "第一，自由城邦的下面，埋着的东西，比整座城的历史都老。别去挖。", "第二，每隔七年的冬月十七，会有一个穿灰袍的人来茶馆，点一杯不加糖的苦茶，坐到打烊。他走的时候，会把一枚铜板留在桌上——那枚铜板，是给「下一个能看见他消失的人」的。", "第三，如果你真的能看见他消失——恭喜你，你被选中了。别害怕。被选中，不一定是坏事。", "——奥雷利安"]}, "reading_dwarf_epic": {"id": "reading_dwarf_epic", "title": "《矮人史诗·锻山篇》", "type": "memoir", "author": "铁峰堡·吟游匠人", "source": "铁峰堡王厅（由矮人线获得）", "hint": "矮人们口中传唱的、关于铁峰堡来历的长诗。", "text": ["（节选，以矮人语吟唱，以下为大意——）", "我们的祖先，曾经住在天光之下。", "可天光之下，有太多眼睛。他们看见我们的金子，看见我们的手艺，看见我们的矮——唯独看不见我们的心。", "于是祖先说：我们进山。山不看人。山只收汗。", "他们凿了三年，凿出第一个洞。凿了三十年，凿出第一座城。凿了三百年——把整座山，凿成了我们的家。", "有人说我们把自己关起来了。错了。是我们把「家」带进来了。", "山里的日子没有昼夜，可我们有炉火。炉火就是我们的太阳。", "太阳会落山。炉火不会。只要还有一只手抡得起锤子，铁峰堡的炉火，就永远亮着。", "（唱到此处，吟游匠人总会停下来，喝一口酒，然后补一句：「祖先说的。我信。」）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_academy_rulebook": {"id": "reading_academy_rulebook", "title": "《艾尔达学院守则·夹页》", "type": "rumor", "author": "艾尔达学院·教务处", "source": "学院手册（由学院线获得）", "hint": "一本守则里，夹着一页不该出现在印刷品上的手写纸。", "text": ["（印刷版守则第 17 页与第 18 页之间，夹着一张手写纸，字迹与印刷体截然不同——）", "致新生：", "守则上说，图书馆地下三层是禁区。守则上说，夜里十二点后不要靠近西塔。守则上说，如果听见有人叫你的名字，而你不确定声音来自哪里——不要回头。", "守则说的都对。可我要告诉你们守则没有说的：这些规矩，不是用来约束你们的，是用来保护你们的。", "学院知道地下有什么，知道西塔有什么，知道夜里那些声音是什么。学院不告诉你们，是因为有些知识，知道得太早，会变成负担。", "但你们终究会知道。好奇心是学院发给每个学生的第一件武器，也是第一件刑具。", "如果你读到这张纸——说明你已经翻到了不该翻的页。没关系，每个人都会翻到。", "记住一件事：当你第一次觉得「学院有什么不对劲」的时候，那不是错觉。那才是真正的入学。"]}, "reading_tournament_note": {"id": "reading_tournament_note", "title": "《承天竞技场观战录》", "type": "memoir", "author": "佚名看客", "source": "承天山竞技场（由校际大赛获得）", "hint": "一个普通看客眼中的大陆武道大会。", "text": ["我坐在看台最远的那排，花了一个铜板，买了一整天的热闹。", "今年的武道大会，比往年好看。兽人的选手像铁塔，精灵的选手像风，矮人的选手像山，而人类——人类的选手，什么都有。", "我最喜欢看第一轮淘汰赛。因为那时候，选手们还没学会表演，每一个动作都是真的——真的想赢，真的怕输，真的痛。", "有个少年的比赛让我记到现在。他个头不高，对手比他壮一圈。所有人都觉得他会输。可他赢了——不是靠蛮力，是靠一种说不清的东西。", "他赢的时候，看台上有人喊好，有人骂他运气好。可只有我这种老看客知道，那不是运气。那是他整个人，都赌在那一场上了。", "比赛结束后，我看见他坐在场边喝水，手还在抖。可他的眼睛是亮的。", "我活了大半辈子，见过很多人赢，见过很多人输。可那种眼睛亮着的赢，不多见。", "我记住他了。如果这世上真有「后生可畏」四个字，那天，我就坐在看台上，亲眼见过一回。"]}, "reading_dwarf_tavern": {"id": "reading_dwarf_tavern", "title": "《铁峰堡酒馆涂鸦》", "type": "rumor", "author": "铁峰堡·无名酒客", "source": "铁峰堡酒馆（由矮人线获得）", "hint": "酒馆墙上的刻字，一代代矮人留下的痕迹。", "text": ["（铁峰堡酒馆的石头墙上，密密麻麻刻满了字。有些是名字，有些是酒话，有些是没人看得懂的符号。以下摘录几条——）", "「老约翰到此一饮，三杯。好酒。下面那个刻『四杯』的是谁？出来比划比划。」", "「我爷爷说，铁峰堡的炉火从没熄过。我不信，蹲在炉边看了三天三夜。它真的没熄。我爷爷是对的。我爷爷总是对的。」", "「新来的人类小子，砸铁砸得不错。下次来，我请你喝一杯。」（旁边刻着另一行小字：「他请了。酒不错。人也行。」）", "「第三矿道封了。别问为什么。别去。」（这行字下面，刻着几十个名字，每一个都被一笔划掉。）", "「我挖了一辈子矿，挖到最深处，挖出过一句话。刻在石头上的，不是矮人语。那句话是——『别把门焊死』。」", "（最后这行字，字迹很深，深得像用凿子凿进去的。旁边没有署名。）"]}, "reading_seal3_diary": {"id": "reading_seal3_diary", "title": "《第三印研究日记·残页》", "type": "diary", "author": "学院·已故教授", "source": "学院档案馆（由学院线深处获得）", "hint": "一位教授在「失踪」前留下的最后一篇日记。", "text": ["树历五月十七日。晴。", "今天从银叶城得到一批新的样本——世界树的根须切片。我把它放在培养皿里，锁进柜子。晚上回来的时候，培养皿是空的。柜子没有被动过。", "树历五月十八日。多云。", "我重新取样，这次我守在柜子前，一整夜。凌晨三点十七分，切片消失了。没有任何过程——它就在我眼前，一下子不见了。", "树历五月十九日。雨。", "我明白了。不是切片消失，是「它」把切片拿走了。「它」不需要打开柜子，不需要碰到切片。「它」只是——在另一个地方，张开了手。", "我写下这篇日记的时候，手在抖。我在纸的背面写了几行字，如果你们能看到，请记住：第三印不只是松动了。它已经——开始「呼吸」了。", "（纸的背面，还有一行字，被涂得几乎看不清。只依稀辨认出几个字：「……它在数我们……」）"]}, "reading_halfling_cookbook": {"id": "reading_halfling_cookbook", "title": "《半身人菜谱·炖菜篇》", "type": "tome", "author": "绿野村·玛莎奶奶", "source": "绿野学院（由半身人线获得）", "hint": "一份菜谱，也是一份族谱。", "text": ["炖菜的第一步，是选锅。铁锅太硬，砂锅太娇，最好的是一口用了几十年的旧陶锅——锅壁上的每一道裂纹里，都藏着前几锅的味道。", "炖菜的第二步，是选肉。别学那些大种族，非要最好的部位。肉是好是坏，锅知道，火知道，盐知道。你用耐心炖它，它就用滋味还你。", "炖菜的第三步，是放盐。这是最难的。盐放早了，肉就柴了；放晚了，味就浮了。要等到汤开始冒那种「咕嘟咕嘟」的小泡时，再撒。", "炖菜的第四步，是等待。这一步，很多急脾气的人做不到。可半身人都知道——好东西，都是等出来的。", "我奶奶把这份菜谱传给我妈，我妈传给我。我们传的其实不是菜谱，是一种活法：锅要慢慢热，肉要慢慢炖，日子要慢慢过，人，要慢慢处。", "这世上没有什么东西，值得你用慌乱去换。", "——如果你来绿野村，来我家，我给你炖一锅。保你吃完，连叹气都慢半拍。"]}, "reading_wargod_oath": {"id": "reading_wargod_oath", "title": "《战神学院誓词·石刻》", "type": "stele", "author": "战神学院·历代", "source": "兽人王庭·战神祭坛（由兽人线获得）", "hint": "每一届战神学院的学生，都要在祭坛前刻下自己的名字。", "text": ["（祭坛周围的石壁上，刻满了名字。名字下方，是历代誓词中流传最广的几句——）", "我以我血，浇灌这片草原。", "我以我骨，铸成这道防线。", "我以我的战歌，为每一位倒下的兄弟送行。", "若我战死，请把我的刀插在阵地上，让后来者知道，这里有人守过。", "若我活着，请把我的名字刻在祭坛上，让我记得，我答应过什么。", "草原的风会吹散很多名字。可誓言不会——风只吹得散沙土，吹不散人心里的那点东西。", "（石壁最下方，有一行刻痕比别的都新，字迹歪歪扭扭，像是一个孩子在颤抖时刻下的：「父亲，我替你守完了。我回家吃饭了。」）"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_north_letter": {"id": "reading_north_letter", "title": "北方家书·最后一页", "type": "letter", "author": "铁门关·无名戍卒", "source": "铁门关驿站（由北方线获得）", "hint": "一封没能寄出去的家书。", "text": ["阿娘：", "见字如面。铁门关入冬了，雪比去年厚。我们队换了新旗，旗面上绣着一只展翅的鹰——连长说，鹰飞得高，看得远，能早点看见春天。", "隔壁床的小周，前些天夜里巡逻时没回来。连长说他是走丢了，可我们都看见，他走的方向，不是回营的方向。连长说，别多想。", "我想多想，可我不敢。阿娘，我有时候觉得，这关墙不只是挡住北边的东西，也挡住了南边的消息。我们在这边，什么都不知道，只知道守。", "上个月，营里来了个文士，说是学院派来的，要招几个有天赋的孩子去念书。我远远地看了一眼，那文士站在雪地里，白袍黑发，像一杆插在雪里的笔。", "阿娘，我要是……我是说，如果我有一天能离开铁门关，我想去念书。我想知道，关墙外面的世界，是不是也像连长说的那样，有花有草，有不用提心吊胆的春天。", "这封信，不知道能不能寄出去。如果寄不出去，就当我没写过。", "儿，敬上。"]}, "reading_south_chart": {"id": "reading_south_chart", "title": "《南航海图·边缘批注》", "type": "tome", "author": "南方港城·老船长", "source": "南方港城船坞（由南方线获得）", "hint": "一张海图上，被人用颤抖的手写下的批注。", "text": ["（海图边缘，有几行潦草的批注，墨迹深浅不一，像是分多次写下的。）", "三月初七：过鬼礁，无事。夜里水下发绿光，以为是鱼群。不是。", "四月初二：老六说在船底看见了眼睛。罚他跪了一夜，他说不是幻觉。他说那眼睛会眨。", "五月十五：新雇的见习水手，夜里值更时跳了海。捞上来时，他还在笑。笑得人发毛。", "六月三十：不敢走夜路了。白天绕远路，多走三天，多烧三船煤。可弟兄们都说值。", "七月十八：今天在船舱底发现一行刻字，很旧。刻的是：「别往东走。」东边是深海，从来没人往东走。可既然有人刻了，就说明有人去过。", "八月：我决定这趟跑完，就上岸。船卖了，钱分给弟兄们。我老了，眼睛花了，经不起再看见那些东西了。", "（批注到此为止。海图边缘，还有一滴干涸的水痕，不知是海水，还是别的什么。）"]}, "reading_elf_ancient": {"id": "reading_elf_ancient", "title": "《精灵古史·序》", "type": "tome", "author": "银叶城·史官", "source": "银叶城图书馆（由精灵线获得）", "hint": "一部精灵史书的开头，关于时间与记忆。", "text": ["人类问我们：你们为何活得这样久？", "我们总答：因为森林需要看护者。这个答案，是给人类听的。", "真正的答案是：我们活得太久，久到开始害怕遗忘。人类的记忆只有几十年，忘也就忘了。我们的记忆有几千年——几千年的欢乐，几千年的愧疚，几千年的秘密，全都沉甸甸地压着，一件也忘不掉。", "所以精灵的史书，从来不写大事。我们写的是树。每一棵树的年轮里，都刻着一代精灵的悲欢。", "长老们说，等世界树老到记不住的时候，就是我们该忘记的时候。", "可我总在夜里想：如果有一天，世界树真的忘了——它忘掉的，到底是它自己的记忆，还是我们替它保管的那些？", "这个问题，我没有答案。也许，等我老到敢问它的那一天，我会再回来，把答案补上。"]}, "reading_dwarf_mineral": {"id": "reading_dwarf_mineral", "title": "《矿物志·禁页》", "type": "tome", "author": "铁峰堡·地脉师", "source": "铁峰堡矿洞（由矮人线获得）", "hint": "关于一种不该存在的矿石的记载。", "text": ["（此页在《矿物志》中被人为撕去，仅存残角，以下为残页内容——）", "……此矿，名「醒铁」。不存于任何矿脉图。我只见过它一次，在第三矿道尽头，深一千三百丈处。", "醒铁的颜色，是黑的，黑得吸光。可你盯着它看久了，会觉得它在看你。", "它不热，也不冷，可它周围的石头，全部是温的——像抱着一颗睡着的心脏。", "开采禁令，是三百年前下的。下禁令的原因，谱中无载。可矿工之间流传着一句话：「醒铁醒，山会哭。」", "我不知道山会不会哭。我只知道，我见过那东西之后，整整三个月，每晚都梦见一双眼睛，在黑暗里，一眨不眨地看着我。", "后来我调离了第三矿道，再也没有下去过。可我知道，它还躺在那里，在深一千三百丈处，等着有人再去看它一眼。", "如果有人在读这一页——请你转告他们：别去。醒铁，不该醒。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_dragon_stele": {"id": "reading_dragon_stele", "title": "龙语遗迹碑文·残片", "type": "stele", "author": "龙族·无名刻者", "source": "龙语学院遗迹（由龙族线/大陆探索获得）", "hint": "龙族灭族前留下的最后一段话。", "text": ["（碑文以龙语刻成，人类学者仅能译出大意——）", "……我们是第一族，也是最后一族。我们见过世界的开始，也见过世界的开始被一遍一遍地涂抹。", "七印不是锁链。是我们自己捆上去的。捆得越紧，越证明我们怕它。", "我们以为烧掉所有龙蛋，就能让恐惧绝后。可恐惧没有绝后，它只是换了一张脸，换了一副嗓子，混进了人群。", "如果有一天，有人读到这块碑——请替我看看天空。如果天空还是蓝的，那就还来得及。", "如果天空变了颜色……那就告诉后来的孩子，别学我们。别用更大的恐惧，去对抗恐惧。"]}, "reading_watcher_manual": {"id": "reading_watcher_manual", "title": "《守望者手册·节选》", "type": "tome", "author": "守望者·第三任执灯人", "source": "守望者据点（由守望者线获得）", "hint": "关于守望者为何从不直接干预的古老理由。", "text": ["新入行者须知：守望者不救世。守望者只记录。", "不是因为我们冷漠，是因为我们试过。三百年前，我们曾经全力干预过一次。结果，那场干预造成的灾难，比我们阻止的那场更大。", "从那以后，我们明白了一个道理：世界有自己的病，也有自己的药。外人插手，往往只是把病换个地方发作。", "所以我们记录。记录每一个征兆、每一次异动、每一个在黑暗中点灯的人。我们相信，有一天，这些记录会拼成一张完整的图。", "那时，我们才知道该在哪里，点亮那一盏灯。", "记住：你的眼睛是借来的，你的沉默是借来的。你只是替未来保存这些记录的人。"]}, "reading_eclipse_memoir": {"id": "reading_eclipse_memoir", "title": "叛徒的自白·残缺篇", "type": "memoir", "author": "暗蚀会·无名叛徒", "source": "地下暗巷（由暗蚀会线/调查获得）", "hint": "一个曾深入暗蚀会核心之人的忏悔。", "text": ["我写下这些，不是为了忏悔。忏悔是为活着的人准备的，而我不打算活太久。", "我加入暗蚀会那年，二十三岁。我以为自己加入的是一群反抗旧秩序的理想主义者。等我知道真相的时候，已经太晚了。", "暗蚀会不是为了毁灭世界。比那更糟——它想「重置」世界。在它看来，这个世界已经病入膏肓，唯一的药方，是让一切归零。", "七印是创世时留下的伤口。暗蚀会要做的，是揭开全部七道伤口，让世界流干最后一滴血，然后——在空壳上，重新造一个它满意的世界。", "你以为你在选择立场，其实你只是在选择被谁利用。", "如果你看到这些文字，趁还来得及，跑。跑得远远的。别回头。", "——如果你做不到，那就至少记住：暗蚀会的每一个人，都以为自己是对的。这是它最可怕的地方。"]}, "reading_tome_seal2": {"id": "reading_tome_seal2", "title": "《七印考·卷二·残章》", "type": "tome", "author": "无名学者", "source": "艾尔达学院禁书区（由学院线获得）", "hint": "关于七印的另一种解释，比卷一更冷。", "text": ["卷一我们说：七印是伤口上的痂。现在我要修正这个说法。", "痂是身体自己长出来的。而七印——不是。它们是「它」钉上去的钉子。", "我们一直以为印的作用是封住什么。错了。印的作用，是「提醒」。", "提醒什么？提醒这世界记得自己受过伤。提醒那东西——它曾经来过，它还会再来。", "所以印松动的征兆，从来不是世界变得更坏。恰恰相反——印松动时，世界会变得异常平静。像暴风雨前的死寂。", "如果有一天，你发现这个世界突然安静得过分，所有人都和气，所有事都顺遂——别高兴。那可能不是好转，是印在松。", "写下这段话时，我听见窗外的鸟叫，异常清脆。我忽然觉得，很冷。"]}, "reading_harbor_rumor": {"id": "reading_harbor_rumor", "title": "灰港酒馆传闻·夜航船", "type": "rumor", "author": "灰港·佚名水手", "source": "灰港（由任意出身获得）", "hint": "一则关于海上的传闻，真假难辨。", "text": ["灰港的老水手们，流传着一则传闻：海上有一艘夜航船。", "那艘船没有灯，没有旗，没有水手。可它夜夜在航道上行驶，从不靠岸，也从不消失。", "有人说那艘船运的是活人——活着的、但已经不算人的人。有人说船底绑着石头，石头下面压着东西。还有人说，如果你在夜里看见那艘船，别眨眼，因为它会记住你的脸。", "「我见过它一次。」最老的那个水手说，他的眼睛在酒馆的灯光下显得浑浊而遥远，「那是三十年前。它从我船头十丈外驶过，没有浪，没有声。」", "「它经过的时候，」他压轻声音，「我听见船里有人唱歌。唱的是一首我没听过的歌，调子很老，老得像从海底传上来的。」", "酒馆里安静了一会儿。有人问：「后来呢？」", "老水手喝完最后一口酒，抹了抹嘴：「后来？后来我就再也没在夜里出过海。」"]}, "reading_principal_letter": {"id": "reading_principal_letter", "title": "院长密信·未寄出", "type": "letter", "author": "艾尔达学院·当代院长", "source": "学院档案室（由学院线深处获得）", "hint": "一封本不该被人看见的信。", "text": ["致墨丘利：", "见信如晤。此信不寄，你也不必回。有些话，说出来与写下来，是不一样的。", "今年入学的学生里，有几个名字，我连夜查了三遍族谱。没有错——他们的血脉，追根溯源，都能连到三百年前那场「清洗」之后消失的家族。", "学院收下他们，是收下了一枚枚不知道何时会响的铃铛。我不知道该庆幸，还是该担忧。", "你常说，教育是给每个人一个重新开始的机会。我年轻时信，现在也信。可近来我总在想：如果有些人，他们的「开始」本身就是被设计好的呢？", "七印的事，档案馆的卷宗已经快封不住了。今年冬天之前，我需要一个答案——或者，一个愿意去寻找答案的人。", "你若在学生们中间看见合适的人，替我看一眼。只看一眼就好。", "——院长，灯下笔，夜未眠。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_elf_elder_diary": {"id": "reading_elf_elder_diary", "title": "银叶长老手札·第三十七页", "type": "diary", "author": "银叶城·林语长老", "source": "银叶城·长老书斋（由精灵线获得）", "hint": "世界树低语与第三印的漫长观察。", "text": ["树语历三千零四十一年，春。", "世界树又老了。这没什么稀奇——它每天都在老去，像所有的活物一样。可今年不同，它老去的速度，快得不正常。", "我在树根下坐了整整三天。这三天里，我听见它把根须从地底深处一寸一寸地收回来，像一个人，在寒冬里把四肢缩进棉被。", "长老会议已经吵了七次。有人说这是周期，有人说这是天罚，还有人说——不能说的人名，连提都不能提。我坐在末席，一句话也没说。", "因为我知道他们在怕什么。他们怕的不是世界树死去，而是怕世界树死去之前，会说出那句它憋了三千年的、关于我们种族起源的真话。", "我年轻时曾在树根深处见过一行刻字，用的是比精灵文更古老的文字。我花了四十年破译它，只破译出两个字：「守望」。", "守望什么？守望谁？我不知道。我只知道，这棵树知道的事，比所有精灵加在一起都多。它只是不说。", "它疼的时候，也只是让树叶枯黄，让果实坠落。像一位不肯呻吟的老人。", "而我们在它的阴影下，歌唱，起舞，自以为懂得永恒。"]}, "reading_dwarf_forge_codex": {"id": "reading_dwarf_forge_codex", "title": "《熔炉谱·残页》", "type": "tome", "author": "铁峰堡·无名匠师", "source": "铁峰堡·工坊密室（由矮人线获得）", "hint": "关于铁峰堡锻炉从未熄灭的另一种解释。", "text": ["……锻炉之火，不可熄。此非古训，乃是禁令。", "先祖凿山而居时，火种便已在。火种自何而来？谱中无载。唯口耳相传：第一炉铁水浇出的，不是兵器，是一道门闩。", "门闩锁的是什么，谱中亦无载。只记一句：每逢熔炉之心跃动如鼓，则门闩必加厚三寸。", "我这一生，给那道门闩打了十七次。每一次，都是因为炉心跃动。", "最近一次，是去年冬。那夜我独自在炉前值更，炉心跃动如常，我却听见——门闩之下，传来一声极轻的、像是叹息的声音。", "我放下锤子，走到那道门前。门闩冰冷，我伸手去摸，指尖触到一丝极细的裂纹。裂纹是新的。", "我没有告诉任何人。我只是趁人不备，又打了一根新的门闩，加厚了五寸。", "若后人读到这一页，请记住：锻炉之火，不可熄。可若它真的熄了——请先确认，门闩够不够厚。", "此页藏于炉腹暗格，盼有缘人见之。"]}, "reading_orc_shaman_proverb": {"id": "reading_orc_shaman_proverb", "title": "萨满箴言·战歌之尾", "type": "rumor", "author": "草原萨满·口述", "source": "兽人王庭·篝火之夜（由兽人线获得）", "hint": "关于草原如何记住每一个离开的人。", "text": ["草原上有三样东西不会撒谎：风、火，和马的脊背。", "风会记得每一个走过草原的人。它不会说，但它会在你离开很久之后，把你的名字吹进别人的梦里。", "火会记得每一个在篝火边说过的话。哪怕你后来改了主意，火还记得你最初的样子。", "马的脊背记得你的重量。你胖了、瘦了、老了、伤了，它都知道，但它不说。", "萨满说，人这一生其实就三问：你从哪里来？你要去哪里？你带走了什么？", "前两问，答案在路上。第三问，答案在心里。", "我离开部族那天，萨满把这四句话唱给我听。唱完他说：如果你有一天忘了自己是谁，就摸一摸你带走的那些东西。它们会告诉你。", "我带了刀。我带了鹰羽。我带了草原的土。", "后来我走了很远的路，见过很多的人，有一天我真的忘了自己是谁。我坐在一条陌生的河边，摸了摸鹰羽，摸了摸土，忽然全想起来了。", "草原从不问归期。它只问：你带走的，还带着吗？"]}, "reading_desert_archaeo_notes": {"id": "reading_desert_archaeo_notes", "title": "《黄沙考古手记·摘录》", "type": "memoir", "author": "佚名学者", "source": "死亡沙漠·古城废墟（由沙漠线获得）", "hint": "关于沙漠深处那些会发光的文字的考古记录。", "text": ["黄历四零二一年，我随商队第七次进入死亡沙漠。此记。", "我们发现了一座古城。不是被沙埋的城，是被沙「放」在表面的城——它像是自己从沙海里浮上来的，墙垣完整，街巷井然，连屋檐下的风铃都还在。", "我们走进城，没有遇到任何人。也没有遇到任何尸骨。整座城干干净净，像主人刚刚出门，随时会回来。", "城中央有一座塔。塔身刻满了发光的文字——不是任何一种已知文字，但所有看到它的人，都能「读」懂它的意思。", "这很可怕。因为每个人读到的意思都不一样。我读到的是一句话：「它醒了。」我的向导读到的却是：「别回头。」", "我们在塔下争论了一夜。第二天清晨，向导不见了。他的脚印在城门口戛然而止，像凭空消失了一样。", "我们仓皇离开。出城时我回头看了一眼，那座城正在徐徐沉回沙海，像一头潜回水底的巨兽。", "此后我拒绝了所有深入沙漠的邀约。可每到夜里，我闭上眼，仍能看见那塔上的文字，仍能听见自己在心里反复念的那句——「它醒了。」", "我不知道「它」是谁。但我有一种感觉：它也知道我。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_elf_elder_diary": {"id": "reading_elf_elder_diary", "title": "银叶长老手札·第三十七页", "type": "diary", "author": "银叶城·林语长老", "source": "银叶城·长老书斋（由精灵线获得）", "hint": "世界树低语与第三印的漫长观察。", "text": ["树语历三千零四十一年，春。", "世界树又老了。这没什么稀奇——它每天都在老去，像所有的活物一样。可今年不同，它老去的速度，快得不正常。", "我在树根下坐了整整三天。这三天里，我听见它把根须从地底深处一寸一寸地收回来，像一个人，在寒冬里把四肢缩进棉被。", "长老会议已经吵了七次。有人说这是周期，有人说这是天罚，还有人说——不能说的人名，连提都不能提。我坐在末席，一句话也没说。", "因为我知道他们在怕什么。他们怕的不是世界树死去，而是怕世界树死去之前，会说出那句它憋了三千年的、关于我们种族起源的真话。", "我年轻时曾在树根深处见过一行刻字，用的是比精灵文更古老的文字。我花了四十年破译它，只破译出两个字：「守望」。", "守望什么？守望谁？我不知道。我只知道，这棵树知道的事，比所有精灵加在一起都多。它只是不说。", "它疼的时候，也只是让树叶枯黄，让果实坠落。像一位不肯呻吟的老人。", "而我们在它的阴影下，歌唱，起舞，自以为懂得永恒。"]}, "reading_dwarf_forge_codex": {"id": "reading_dwarf_forge_codex", "title": "《熔炉谱·残页》", "type": "tome", "author": "铁峰堡·无名匠师", "source": "铁峰堡·工坊密室（由矮人线获得）", "hint": "关于铁峰堡锻炉从未熄灭的另一种解释。", "text": ["……锻炉之火，不可熄。此非古训，乃是禁令。", "先祖凿山而居时，火种便已在。火种自何而来？谱中无载。唯口耳相传：第一炉铁水浇出的，不是兵器，是一道门闩。", "门闩锁的是什么，谱中亦无载。只记一句：每逢熔炉之心跃动如鼓，则门闩必加厚三寸。", "我这一生，给那道门闩打了十七次。每一次，都是因为炉心跃动。", "最近一次，是去年冬。那夜我独自在炉前值更，炉心跃动如常，我却听见——门闩之下，传来一声极轻的、像是叹息的声音。", "我放下锤子，走到那道门前。门闩冰冷，我伸手去摸，指尖触到一丝极细的裂纹。裂纹是新的。", "我没有告诉任何人。我只是趁人不备，又打了一根新的门闩，加厚了五寸。", "若后人读到这一页，请记住：锻炉之火，不可熄。可若它真的熄了——请先确认，门闩够不够厚。", "此页藏于炉腹暗格，盼有缘人见之。"]}, "reading_orc_shaman_proverb": {"id": "reading_orc_shaman_proverb", "title": "萨满箴言·战歌之尾", "type": "rumor", "author": "草原萨满·口述", "source": "兽人王庭·篝火之夜（由兽人线获得）", "hint": "关于草原如何记住每一个离开的人。", "text": ["草原上有三样东西不会撒谎：风、火，和马的脊背。", "风会记得每一个走过草原的人。它不会说，但它会在你离开很久之后，把你的名字吹进别人的梦里。", "火会记得每一个在篝火边说过的话。哪怕你后来改了主意，火还记得你最初的样子。", "马的脊背记得你的重量。你胖了、瘦了、老了、伤了，它都知道，但它不说。", "萨满说，人这一生其实就三问：你从哪里来？你要去哪里？你带走了什么？", "前两问，答案在路上。第三问，答案在心里。", "我离开部族那天，萨满把这四句话唱给我听。唱完他说：如果你有一天忘了自己是谁，就摸一摸你带走的那些东西。它们会告诉你。", "我带了刀。我带了鹰羽。我带了草原的土。", "后来我走了很远的路，见过很多的人，有一天我真的忘了自己是谁。我坐在一条陌生的河边，摸了摸鹰羽，摸了摸土，忽然全想起来了。", "草原从不问归期。它只问：你带走的，还带着吗？"]}, "reading_desert_archaeo_notes": {"id": "reading_desert_archaeo_notes", "title": "《黄沙考古手记·摘录》", "type": "memoir", "author": "佚名学者", "source": "死亡沙漠·古城废墟（由沙漠线获得）", "hint": "关于沙漠深处那些会发光的文字的考古记录。", "text": ["黄历四零二一年，我随商队第七次进入死亡沙漠。此记。", "我们发现了一座古城。不是被沙埋的城，是被沙「放」在表面的城——它像是自己从沙海里浮上来的，墙垣完整，街巷井然，连屋檐下的风铃都还在。", "我们走进城，没有遇到任何人。也没有遇到任何尸骨。整座城干干净净，像主人刚刚出门，随时会回来。", "城中央有一座塔。塔身刻满了发光的文字——不是任何一种已知文字，但所有看到它的人，都能「读」懂它的意思。", "这很可怕。因为每个人读到的意思都不一样。我读到的是一句话：「它醒了。」我的向导读到的却是：「别回头。」", "我们在塔下争论了一夜。第二天清晨，向导不见了。他的脚印在城门口戛然而止，像凭空消失了一样。", "我们仓皇离开。出城时我回头看了一眼，那座城正在徐徐沉回沙海，像一头潜回水底的巨兽。", "此后我拒绝了所有深入沙漠的邀约。可每到夜里，我闭上眼，仍能看见那塔上的文字，仍能听见自己在心里反复念的那句——「它醒了。」", "我不知道「它」是谁。但我有一种感觉：它也知道我。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_elf_elder_diary": {"id": "reading_elf_elder_diary", "title": "银叶长老手札·第三十七页", "type": "diary", "author": "银叶城·林语长老", "source": "银叶城·长老书斋（由精灵线获得）", "hint": "世界树低语与第三印的漫长观察。", "text": ["树语历三千零四十一年，春。", "世界树又老了。这没什么稀奇——它每天都在老去，像所有的活物一样。可今年不同，它老去的速度，快得不正常。", "我在树根下坐了整整三天。这三天里，我听见它把根须从地底深处一寸一寸地收回来，像一个人，在寒冬里把四肢缩进棉被。", "长老会议已经吵了七次。有人说这是周期，有人说这是天罚，还有人说——不能说的人名，连提都不能提。我坐在末席，一句话也没说。", "因为我知道他们在怕什么。他们怕的不是世界树死去，而是怕世界树死去之前，会说出那句它憋了三千年的、关于我们种族起源的真话。", "我年轻时曾在树根深处见过一行刻字，用的是比精灵文更古老的文字。我花了四十年破译它，只破译出两个字：「守望」。", "守望什么？守望谁？我不知道。我只知道，这棵树知道的事，比所有精灵加在一起都多。它只是不说。", "它疼的时候，也只是让树叶枯黄，让果实坠落。像一位不肯呻吟的老人。", "而我们在它的阴影下，歌唱，起舞，自以为懂得永恒。"]}, "reading_dwarf_forge_codex": {"id": "reading_dwarf_forge_codex", "title": "《熔炉谱·残页》", "type": "tome", "author": "铁峰堡·无名匠师", "source": "铁峰堡·工坊密室（由矮人线获得）", "hint": "关于铁峰堡锻炉从未熄灭的另一种解释。", "text": ["……锻炉之火，不可熄。此非古训，乃是禁令。", "先祖凿山而居时，火种便已在。火种自何而来？谱中无载。唯口耳相传：第一炉铁水浇出的，不是兵器，是一道门闩。", "门闩锁的是什么，谱中亦无载。只记一句：每逢熔炉之心跃动如鼓，则门闩必加厚三寸。", "我这一生，给那道门闩打了十七次。每一次，都是因为炉心跃动。", "最近一次，是去年冬。那夜我独自在炉前值更，炉心跃动如常，我却听见——门闩之下，传来一声极轻的、像是叹息的声音。", "我放下锤子，走到那道门前。门闩冰冷，我伸手去摸，指尖触到一丝极细的裂纹。裂纹是新的。", "我没有告诉任何人。我只是趁人不备，又打了一根新的门闩，加厚了五寸。", "若后人读到这一页，请记住：锻炉之火，不可熄。可若它真的熄了——请先确认，门闩够不够厚。", "此页藏于炉腹暗格，盼有缘人见之。"]}, "reading_orc_shaman_proverb": {"id": "reading_orc_shaman_proverb", "title": "萨满箴言·战歌之尾", "type": "rumor", "author": "草原萨满·口述", "source": "兽人王庭·篝火之夜（由兽人线获得）", "hint": "关于草原如何记住每一个离开的人。", "text": ["草原上有三样东西不会撒谎：风、火，和马的脊背。", "风会记得每一个走过草原的人。它不会说，但它会在你离开很久之后，把你的名字吹进别人的梦里。", "火会记得每一个在篝火边说过的话。哪怕你后来改了主意，火还记得你最初的样子。", "马的脊背记得你的重量。你胖了、瘦了、老了、伤了，它都知道，但它不说。", "萨满说，人这一生其实就三问：你从哪里来？你要去哪里？你带走了什么？", "前两问，答案在路上。第三问，答案在心里。", "我离开部族那天，萨满把这四句话唱给我听。唱完他说：如果你有一天忘了自己是谁，就摸一摸你带走的那些东西。它们会告诉你。", "我带了刀。我带了鹰羽。我带了草原的土。", "后来我走了很远的路，见过很多的人，有一天我真的忘了自己是谁。我坐在一条陌生的河边，摸了摸鹰羽，摸了摸土，忽然全想起来了。", "草原从不问归期。它只问：你带走的，还带着吗？"]}, "reading_desert_archaeo_notes": {"id": "reading_desert_archaeo_notes", "title": "《黄沙考古手记·摘录》", "type": "memoir", "author": "佚名学者", "source": "死亡沙漠·古城废墟（由沙漠线获得）", "hint": "关于沙漠深处那些会发光的文字的考古记录。", "text": ["黄历四零二一年，我随商队第七次进入死亡沙漠。此记。", "我们发现了一座古城。不是被沙埋的城，是被沙「放」在表面的城——它像是自己从沙海里浮上来的，墙垣完整，街巷井然，连屋檐下的风铃都还在。", "我们走进城，没有遇到任何人。也没有遇到任何尸骨。整座城干干净净，像主人刚刚出门，随时会回来。", "城中央有一座塔。塔身刻满了发光的文字——不是任何一种已知文字，但所有看到它的人，都能「读」懂它的意思。", "这很可怕。因为每个人读到的意思都不一样。我读到的是一句话：「它醒了。」我的向导读到的却是：「别回头。」", "我们在塔下争论了一夜。第二天清晨，向导不见了。他的脚印在城门口戛然而止，像凭空消失了一样。", "我们仓皇离开。出城时我回头看了一眼，那座城正在徐徐沉回沙海，像一头潜回水底的巨兽。", "此后我拒绝了所有深入沙漠的邀约。可每到夜里，我闭上眼，仍能看见那塔上的文字，仍能听见自己在心里反复念的那句——「它醒了。」", "我不知道「它」是谁。但我有一种感觉：它也知道我。"]}});
    window.READINGS_V45 = Object.assign(window.READINGS_V45 || {}, {"reading_hlj_letter": {"id": "reading_hlj_letter", "title": "黄林晶的信", "type": "letter", "author": "黄林晶", "source": "沙漠边境·亡者遗物", "text": ["吾友墨丘利：", "见字如面。这封信，我不知该托付给谁，只能让它随着商队，一路往东。若你能看到，那便是天意。", "第三印松动了。不是错觉，我以血亲测过——世界树的根系在往深处退缩，像一个人把手臂从火里慢慢抽出来。树不会说话，但树会疼。它疼的方式，就是让树叶枯黄，让果实坠落，让根须缩向大地深处。", "长老们说这是周期，说千年前也这样过。他们说得对，但没说全——千年前，有黄林晶。这一次，谁来？", "我在这片黄沙里走了四十一天。死去的商队、坍塌的古城、被风啃光的白骨，我都见过。沙子里埋着的东西，比人想的要多得多。有些碑文，连我也读不懂，但能读懂的那部分，让我夜里不敢点灯。", "第一印的碎块，我找到了一块。它在我手里发烫，像一块烧红的铁。我把它封在铅匣里，埋在三棵胡杨交错的根下。若我回不来，请替我转告后来人：不要碰它，不要听它，不要让它知道你在想它。", "七印不是锁链，是伤口上的痂。揭开任何一道，下面的血都还是热的。", "若你有缘见到一个带着这封信的人——那便是天意要他把信送到你手里。给他一杯水，告诉他：黄沙会记住每一个走过的人。", "黄林晶　敬上", "（信的末尾，有一行被水渍洇开的字，依稀可辨：『……第二印……是活的……』）"], "hint": "黄林晶写给墨丘利的信，关联七印真相与沙漠伏笔。"}, "reading_mother_letter": {"id": "reading_mother_letter", "title": "母亲的旧信", "type": "letter", "author": "一位无名母亲", "source": "旧物箱底", "text": ["吾儿：", "你看到这封信的时候，大概已经长大了。我不知道你会长成什么样子——会不会像你父亲那样，总是皱着眉，好像天下所有的事都压在他一个人肩上。", "有些事，我不能告诉你。不是不想，是不能。说了，你活不到今天。", "你记住三件事。", "第一，你脖子上的那枚旧坠子，是你外祖母给的，传了三代。别弄丢，也别让人看见。它在你身上，比任何刀剑都管用——但也比任何刀剑都危险。", "第二，如果有一天，有穿灰斗篷的人问你『你叫什么名字』，别回答。说『我叫风』，然后头也不回地走。", "第三，也是最重要的——如果你在某个深夜，听见有人叫你，那声音温柔得让你想哭，你一定要捂住耳朵，跑。别回头。那不是叫你的人，那是来找我的。", "原谅我，让你带着这些秘密长大。", "如果我有一天不在了，你别找我的尸体。找我的星星。", "母亲　绝笔", "（信的背面，画着一幅潦草的星图，七颗星连成一条断裂的线。）"], "hint": "身世线索：坠子、灰斗篷、深夜的呼唤，关联美第奇线。"}, "reading_mercury_letter": {"id": "reading_mercury_letter", "title": "墨丘利的手札", "type": "letter", "author": "墨丘利", "source": "学院图书馆·夹层", "text": ["三月十七日，晴。", "今天从南边来了一封奇特的信，牛皮纸，没有落款，只有一枚七芒星火漆印。拆开，里面是一张地图，标着三处封印节点，笔迹极工整——是某个老学究的手笔。", "我照着地图查了古籍，其中两处已确认松动。第三处……在沙漠里，图上只画了一个叉，旁边写了三个字：『它醒了』。", "又是黄林晶的笔迹。二十年前，他在最后一封信里写过同样的话。", "我总觉得，黄林晶没有死。不是凭吊，是逻辑——他的最后一封信提到『第一印的碎块』，而那东西，二十年来从未在任何地方出现过。以他的性子，他不会让一块自己拼死带回来的碎块下落不明。", "除非，他把碎块交给了别人。", "我最近在物色学生。不是那种循规蹈矩的好学生，而是眼睛里有火的——能在大雨里盯着一个脚印看半天的，能在谣言里听出真话的，能在所有人都说『没事』的时候说『不对劲』的。", "这个时代，需要这样的人。", "（手札末尾，附着一份入学推荐名单，其中一行的备注写着：『来历存疑，身世待考。但那双眼睛……像她。』）"], "hint": "墨丘利视角的七印调查，关联导师线与推荐入学。"}, "reading_watcher_diary": {"id": "reading_watcher_diary", "title": "无名者日记（残页）", "type": "diary", "author": "佚名（疑似守望者密探）", "source": "路边客栈·床板夹层", "text": ["第七日，雨。", "目标今天去了集市，在粮摊前蹲了很久。他买了三块黑面包、一截腊肠，讨价还价了四次——最后一次省下两个铜币，他把铜币扔给了一个乞儿。", "这种细节，报告里没法写。但报告需要的不是细节，是判断。我的判断：这人有恻隐之心，但不多；他警惕，却不偏执；他在集市上抬头看我一眼的时候，我差点以为他发现了。", "他没有。但那一刻我确定了——他不是普通人。普通人在集市上看不见角落里站着的人。", "第十三日，风。", "目标出城了。商队，老周带队，向北。方向：铁门关。", "北边……深渊最近不太平，教会在那边设了关卡。他选这时候去北边，是有意的，还是巧合？", "上头让我继续跟。跟上他，但别让他发现。如果他发现了我——", "（这一行字被涂掉了，墨迹很重，像是写字的人犹豫了很久。）", "——那就说明，我该换一种方式接近他了。"], "hint": "守望者密探视角的记录，关联 watcher_spy 伏笔。"}, "reading_cecilia_notes": {"id": "reading_cecilia_notes", "title": "塞西莉亚的研究笔记", "type": "diary", "author": "塞西莉亚·星辉", "source": "学院图书馆·占座笔记", "text": ["借阅记录：本月第三次查阅《七印考·残卷》。管理员已经开始用奇怪的眼神看我了。", "整理：第一印『虚空』，锚点失传，疑似在沙漠某处；第二印『深渊』，锚点不明，学界公认已失效，但北境军队的报告中提到过『会呼吸的裂缝』；第三印『世界树』，锚点在银叶城，树叶枯黄已三年——长老们的官方说法是『周期』，但周期不会让树根退缩。", "大胆假设：七印的『锚点』不是固定的。它们在选择。或者说——它们在『等』。", "黄林晶的笔记（残页）里有一句话我一直没读懂：『印不是钉在地上的，是长在心上的。』如果印长在心上……那么锚点是人，不是物？", "如果是人，那会是谁？", "（笔记的最后一行，字迹明显急促：）", "墨丘利教授今天在课堂上看了我三次。三次。他是不是发现我在查这些了？还是说……他也知道些什么？"], "hint": "塞西莉亚对七印的独立研究，关联同学线。"}, "reading_tome_seal1": {"id": "reading_tome_seal1", "title": "《七印考·卷一》残章", "type": "tome", "author": "佚名（约三千年前）", "source": "承天山古洞", "text": ["……余尝夜观天象，见北方有异星垂落，光如血，七日不灭。彼时人皆以为祥瑞，独余知其不然。", "遂访诸野老，得闻旧事：上古之时，天地初分，有物自虚无中来，无名无相，无声无息，唯有『饥饿』。其以万物为食，以星辰为饵，所过之处，连影子都要被嚼碎。", "先民称之为『原初之物』。", "七印之设，非为锁物，乃为『止痛』。原初之物被撕裂为七，每裂一处，天地便少一分痛——印，就是敷在伤口上的药。", "然药有尽时。印生松动，非因外力，乃因伤处早已不痛。世人忘了痛，便以为伤已痊愈。", "余写至此，忽闻窗外有风鸣。风本无声，今声如哭，余大惧。", "是夜，余整理旧稿，藏于石匣，埋于山阴。后世有缘者见之，当知：印在，则万物相安；印失，则诸神皆饿。", "（残章于此中断，下一页已被撕去。）"], "hint": "七印的真相：印是止痛药，不是锁链。"}, "reading_tome_primordial": {"id": "reading_tome_primordial", "title": "《原初之物考》残卷", "type": "tome", "author": "大贤者·艾尔达（学院初代院长）", "source": "学院禁书区·第三层", "text": ["……吾穷一生之力，欲为一物立传。然每落笔，笔尖即自折。非笔钝，乃物之『名』不可轻书。", "试以诸法称之：『吞噬者』——不尽然；『无底之胃』——太粗；『万物之终』——又太悲。", "吾最终采先民旧称：原初之物。非名也，乃讳也。", "据残简所载，原初之物有七相，对应七印：饥、渴、倦、惧、寂、惘、嗔。七相非独立，实为一体之七面，如灯之七焰。", "『饥』者，吞光；『渴』者，吸魂；『倦』者，蚀梦；『惧』者，噬勇；『寂』者，吞声；『惘』者，夺忆；『嗔』者，燃血。", "七相轮转，如潮汐。吾观百年，知其大周期约千年一临。上次临世，正逢黄林晶封印。", "吾尝闻低语。在深夜，在无人处，在笔尖将断未断之时。低语无字，却懂得一切。吾每次聆听，皆觉记忆少了一块——不是忘了，是『被拿走』了。", "故此卷不得留于明处。吾将其封于禁书区第三层，以七重铁锁镇之。若有后来者读到此处——", "放下。离开。别问。", "（卷末空白处，有一行极小的字，与正文笔迹不同：『他骗你。低语不是拿走了记忆，是给你看了真相。』）"], "hint": "原初之物七相学说，关联原初之物低语伏笔。"}, "reading_stele_chengtian": {"id": "reading_stele_chengtian", "title": "承天山古碑铭文", "type": "stele", "author": "佚名", "source": "承天山·山腰古碑", "text": ["（碑文为上古文字，经拓印、破译后大意如下：）", "「吾等立此碑于时光之畔。", "日升月落，凡七千四百二十一次，碑影不移。", "有客自未来至，言其乡已被风沙吞没；有客自过去来，言其故国尚在鼎盛。", "吾等不解，问于守碑人。守碑人曰：此山是世界的节拍器。山不转，则时间在此打结。", "「结」者，非祸也。千年之树有年轮，百年之城有旧巷。结，是时间的疤。", "但疤会痒。痒到极致，便会有人伸手去挠。", "挠破的人，回不来了；看破的人，不敢回来。", "唯有不知者，在此山下安然度日。", "故碑末有诫：莫问山中事，山中事问人。莫问人何处，人处即山中。」", "（拓印者注：碑上最后一字残缺，疑为『归』字，又疑为『无』字。二解天差地别，存疑待考。）"], "hint": "承天山的时间裂隙设定，关联第六印与东部出身。"}, "reading_rumor_eclipse": {"id": "reading_rumor_eclipse", "title": "酒馆流言·暗蚀会", "type": "rumor", "author": "无名酒客", "source": "交汇城·烂木桶酒馆", "text": ["「听说了吗？最近暗蚀会的人又开始活动了。」", "说话的是一个秃顶商人，压低了嗓门，像是怕隔墙有耳。周围的人凑过来，酒杯碰着酒杯，声音稀稀拉拉。", "「不是说暗蚀会二十年前就被剿灭了吗？」有人问。", "「剿灭？嗤。」秃顶商人摆摆手，「那种东西，跟野草一样，你铲了地面上的，根还在地底下。我跟你们说——上个月，南边港口运来一批货，箱子上印的，就是暗蚀会的记号。一个太阳被啃掉一半的那种。」", "「那批货呢？」", "「不知道。卸货的人第二天全消失了，连码头上的猫都没剩下。」", "「啧，你少编。」", "「编？我亲眼看见的！就在——」秃顶商人说到一半，忽然顿住了。他盯着酒馆门口，脸色变了。", "门口站着一个人，穿着洗得发白的灰斗篷，不进来，也不走，就那么站着。", "秃顶商人低下头，一杯酒灌下去，再没说话。", "（流言到此为止。酒馆角落里，有人在桌上留下两枚铜币，一枚是正面的太阳，一枚是——被磨去了半边的太阳。）"], "hint": "暗蚀会仍在活动的传闻，关联暗蚀会线。"}, "reading_memoir_veteran": {"id": "reading_memoir_veteran", "title": "老兵回忆录·铁门关", "type": "memoir", "author": "一个不愿留名的老兵", "source": "铁门关·旧营房", "text": ["我叫什么，我自己都快忘了。你们就叫我老瘸子吧。", "我在铁门关守了二十二年。二十二年前，我还年轻，觉得城墙是天下最硬的东西。现在我知道，城墙不是硬，是厚——厚到可以让你看不见墙外面有什么。", "深渊那东西，不是怪物。怪物你还能打，能杀，能剥了皮挂城头上吓唬它们。深渊不是。深渊是墙外的一口井，你盯着它看久了，会觉得井里的东西也在看你。", "我见过最勇敢的兵，是个十八岁的娃，从南方来的，白白净净，连鸡都没杀过。第一次上墙，他吓得尿了裤子。第二年，他一个人杀了七头深渊生物，把肠子塞回去，继续砍。", "后来他死了。不是战死的。是有一天晚上，他忽然说听见墙下面有人叫他名字，翻下墙去找，再也没回来。", "上头说他是叛逃。我不信。那娃不是会叛逃的人。", "我写这些，是想告诉后来守城的人三件事：", "第一，深渊生物怕火，但火会让它们更饿。", "第二，如果你在夜里听见有人叫你名字，别答应，也别跑——答应，你就走了；跑，它就知道你怕了。站在原地，等它过去。", "第三，也是最重要的——城墙不是用来挡深渊的。城墙是用来挡你自己的。深渊一直在我们心里，只是城外的那个，更近一些。", "老瘸子　绝笔", "（回忆录压在旧营房的床板下，纸张泛黄，边角被血浸过，干成深褐色。）"], "hint": "铁门关老兵视角的深渊战争，关联北方线。"}});

    var R_TYPE_CN={letter:'信件',diary:'日记',tome:'古籍',stele:'碑文',rumor:'传闻',memoir:'回忆录'};
    function readingsBody(){
      try{
        var R=window.READINGS_V45||{};
        var ids=Object.keys(R);
        var got=0, unread=0;
        for(var i=0;i<ids.length;i++){ if(S.readings&&S.readings.unlocked&&S.readings.unlocked[ids[i]]) got++; }
        var h="<div style='color:var(--gold2);margin-bottom:8px'><b>藏书阁</b> · 已解锁 "+got+"/"+ids.length+" 卷</div>";
        if(got===0) return h+"<div style='color:var(--text-muted);font-size:13px;padding:10px 0'>藏书阁空空如也……旅途中的信件与残卷，会在这里留下回响。</div>";
        var types=['letter','diary','tome','stele','rumor','memoir'];
        for(var t=0;t<types.length;t++){
          var ty=types[t];
          var items=ids.filter(function(k){return R[k].type===ty&&S.readings&&S.readings.unlocked&&S.readings.unlocked[k];});
          if(!items.length) continue;
          h+="<div style='margin:10px 0 4px;font-size:13px;color:var(--text-gold);font-weight:700;border-bottom:1px solid var(--border)'>"+R_TYPE_CN[ty]+"</div>";
          for(var j=0;j<items.length;j++){
            var k=items[j];
            var r=R[k];
            var rd=S.readings.read&&S.readings.read[k];
            h+="<button class='opt "+(rd?'':'v45-unread')+"' style='margin-bottom:6px;width:100%;text-align:left;display:flex;align-items:center;gap:8px' onclick=\"v45_openReading('"+k+"')\">"
              +"<span class='od'>"+(rd?'✓':'📜')+"</span><span style='flex:1'>"+String(r.title).replace(/</g,'&lt;')+"</span>"
              +"<span style='font-size:11px;color:var(--text-muted)'>"+((r.author)||'佚名')+"</span></button>";
          }
        }
        return h;
      }catch(e){ return '<div style="color:var(--text-muted);font-size:13px">藏书阁暂不可用。</div>'; }
    }
    window.v45_readingsBody=readingsBody;

    function openReading(id){
      try{
        var R=window.READINGS_V45||{};
        if(!R[id]){ try{ v44_pushToast&&v44_pushToast('藏书阁','此卷尚未收录','warn','⚠️'); }catch(e){} return; }
        var r=R[id];
        var txt=Array.isArray(r.text)?r.text:[r.text];
        if(r.page && window.v93n6_readBook){ window.v93n6_readBook(id); return; }
        var body='<div class="panel-wrap" style="max-width:640px;max-height:80vh;display:flex;flex-direction:column">'
          +'<div class="panel-header"><span class="panel-title">📜 '+R_TYPE_CN[r.type]+' · '+String(r.title).replace(/</g,'&lt;')+'</span><button class="panel-close" onclick="closePanel()">✕</button></div>'
          +'<div class="panel-body" id="v45-read-body" style="flex:1;overflow-y:auto;line-height:1.9;font-size:var(--fs-body)">';
        for(var i=0;i<txt.length;i++){
          var p=txt[i];
          if(typeof p==='function'){ try{p=p();}catch(e){p='';} }
          if(p) body+='<p style="margin-bottom:12px">'+String(p).replace(/</g,'&lt;').replace(/\n/g,'<br>')+'</p>';
        }
        body+='<div style="text-align:right;font-size:12px;color:var(--text-muted);margin-top:8px">'+(r.source||'')+'</div>'
          +'</div><div class="panel-footer"><button class="btn btn-gold" onclick="closePanel()">合上此卷</button></div></div>';
        openModal(elFromHtml(body));
        try{
          if(S.readings&&S.readings.read&&typeof S.readings.read[id]==='undefined'){
            S.readings.read[id]=true;
          }
        }catch(e){}
      }catch(e){ try{ console.log('v45 read:',e); }catch(_){} }
    }
    window.v45_openReading=openReading;
  }catch(e){ try{ console.log('v45 engine init:',e); }catch(_){} }
})();

/* ===== /v91inj:memfn/ CM-1 上下文记忆注入（只读钩子；不改节点语义；开关 S.settings.memoryInjection） ===== */
window.v91_memInit = function(){
  if(!window.__v91memState) window.__v91memState={loc:null,day:0,echoed:{},flagSeen:{},placeSeen:{},started:false};
  return window.__v91memState;
};
window.v91_memEnabled = function(){
  try{ if(!S||!S.settings) return false; return S.settings.memoryInjection!==false; }catch(e){ return false; }
};
window.v91_memoryInjection = function(node, txt){
  try{
    if(!window.v91_memEnabled()) return null;
    if(!node||!S) return null;
    const st=window.v91_memInit();
    if(!st.started){ st.started=true; st.loc=(S.loc||null); st.day=(S.day||0); return null; } /* 首帧只记录，不注入 */
    const TPL=window.MEMORY_TPL; if(!TPL) return null;
    const inj=[];
    /* ① 地点切换：首访/重访（会话内 placeSeen 区分） */
    if(S.loc&&st.loc!==S.loc){
      if(TPL.place_first&&TPL.place_revisit){
        const seen=!!st.placeSeen[S.loc];
        const pool=seen?TPL.place_revisit:TPL.place_first;
        if(pool&&pool.length) inj.push(pool[Math.floor(Math.random()*pool.length)]);
      }
      st.placeSeen[S.loc]=true;
    }
    /* ② 时间跨距 */
    if(TPL.time_gap&&TPL.time_gap.length&&st.day>0&&S.day>st.day){
      const gap=S.day-st.day;
      if(gap>7){ const tpl=TPL.time_gap[Math.floor(Math.random()*TPL.time_gap.length)]; inj.push(String(tpl).split("{n}").join(gap)); }
    }
    /* ③ 好感回指（扫描正文中出现的中文名）——CON-1 升级：四档语气 30-59 泛泛 / 60-79 挚友 / 80+ 恋人 / -20 及以下 敌意 */
    if(TPL.npcs&&TPL.friend&&TPL.enemy){
      const joined=Array.isArray(txt)?txt.join(" "):String(txt||"");
      for(let i=0;i<TPL.npcs.length&&inj.length<2;i++){
        const npc=TPL.npcs[i];
        if(!npc||!npc.word||joined.indexOf(npc.word)<0) continue;
        const v=(S.npcRelations&&S.npcRelations[npc.id])||0;
        const nm=npc.name||npc.id;
        if(v<=-20&&TPL.person_neg&&TPL.person_neg.length){ const tpl=TPL.person_neg[Math.floor(Math.random()*TPL.person_neg.length)]; inj.push(String(tpl).split("{name}").join(nm)); }
        else if(v>=80&&TPL.person_80&&TPL.person_80.length){ const tpl=TPL.person_80[Math.floor(Math.random()*TPL.person_80.length)]; inj.push(String(tpl).split("{name}").join(nm)); }
        else if(v>=60&&TPL.person_60&&TPL.person_60.length){ const tpl=TPL.person_60[Math.floor(Math.random()*TPL.person_60.length)]; inj.push(String(tpl).split("{name}").join(nm)); }
        else if(v>=30&&TPL.person_30&&TPL.person_30.length){ const tpl=TPL.person_30[Math.floor(Math.random()*TPL.person_30.length)]; inj.push(String(tpl).split("{name}").join(nm)); }
        break;
      }
    }
    /* ⑤ 事件余波（上一节点有实质结算时，当前节点开头补 1 句后果感知） */
    if(TPL.aftermath&&TPL.aftermath.length&&window.__v92lastFX){
      try{
        const fx=window.__v92lastFX;
        if(fx.day===(S.day||0)&&fx.lines&&fx.lines.length&&inj.length<2){
          const tpl=TPL.aftermath[Math.floor(Math.random()*TPL.aftermath.length)];
          const ln=String(fx.lines[0]||"").replace(/^[+\-◆结果：]+/,"").trim();
          let s=String(tpl);
          if(ln){ s=s.split("{d}").join(ln).split("{u}").join(""); }
          else{ s=s.split("{d}").join("些").split("{u}").join(""); }
          inj.push(s);
        }
        window.__v92lastFX=null;
      }catch(_e){}
    }
    /* ④ flag 回响池（延迟触发，每 flag 至多一次） */
    if(TPL.echo&&TPL.echo.length){
      for(let i=0;i<TPL.echo.length&&inj.length<2;i++){
        const e=TPL.echo[i];
        if(!e||!e.flag||st.echoed[e.flag]) continue;
        if(!(S.flags&&S.flags[e.flag])) continue;
        if(st.flagSeen[e.flag]===undefined) st.flagSeen[e.flag]=S.day;
        const minDays=e.minDays||30;
        if(S.day-st.flagSeen[e.flag]>=minDays&&e.tpl&&e.tpl.length){
          const tpl=e.tpl[Math.floor(Math.random()*e.tpl.length)];
          inj.push(String(tpl).split("{name}").join(e.name||""));
          st.echoed[e.flag]=true;
        }
      }
    }
    if(inj.length>=2) inj.length=2; /* 0-2 段 */
    if(S){ st.loc=S.loc; st.day=S.day; }
    if(inj.length){ try{ console.log("[v92inj:mem]", inj.length, inj[0].slice(0,40)); }catch(_){} }
    return inj.length?inj:null;
  }catch(e){ try{ console.log("[v92inj:mem:err]",e); }catch(_){} return null; }
};
/* ===== /v92inj:tags/ UPG-04 节点 tag 元数据通道（只读工具；N[id].tags 为纯数据；成就/地图/事件池筛选统一驱动源） ===== */
window.v92_nodeTags = function(id){
  try{
    if(!id) return [];
    const n=(typeof N!=="undefined"&&N)?N[id]:null;
    if(!n) return [];
    const t=n.tags;
    if(!t||!Array.isArray(t)) return [];
    return t.slice();
  }catch(e){ try{ console.log("[v92tags:err]",e); }catch(_){} return []; }
};
window.v92_hasNodeTag = function(id, tag){
  try{ const t=window.v92_nodeTags(id); return t.indexOf(tag)>=0; }catch(e){ return false; }
};
window.ELDA = window.ELDA || {};
/* ===== /upg07inj:observer/ UPG-07 响应式 UI 同步（Ink ObserveVariable 模式）：声明式注册 + 结算点广播；纯 UI 层，不触碰 S 语义/判定/存档） ===== */
window.ELDA.__obs = {};
window.ELDA.observe = function(key, fn){
  try{
    if(typeof fn !== 'function') return;
    (window.ELDA.__obs[key] || (window.ELDA.__obs[key] = [])).push(fn);
  }catch(e){}
};
window.ELDA.notify = function(eff){
  try{
    if(!eff) return;
    /* 由 effects 结算对象推导变更键 */
    var ch = {};
    if(eff.gold) ch.gold = true;
    if(eff.xp) ch.xp = true;
    if(eff.hp || eff.heal || eff.wound) ch.hp = true;
    if(eff.san || eff.sanmax) ch.san = true;
    if(eff.rep) ch.rep = true;
    if(eff.karma) ch.karma = true;
    if(eff.aura) ch.aura = true;
    if(eff.infl) ch.infl = true;
    if(eff.attr) ch.attrs = true;
    if(eff.skill) ch.skills = true;
    if(eff.prog) ch.skillProg = true;
    if(eff.flag || eff.setflag || eff.cond) ch.flags = true;
    if(eff.relation) ch.npcRelations = true;
    if(eff.item || eff.loseItem) ch.items = true;
    if(eff.mat || eff.loseMat) ch.mats = true;
    ch.any = true;
    var obs = window.ELDA.__obs || {};
    for(var key in obs){
      if(key !== '*' && !ch[key]) continue;
      var arr = obs[key];
      for(var i = 0; i < arr.length; i++){
        try{ arr[i](ch); }catch(e){}
      }
    }
  }catch(e){}
};
window.ELDA.refresh = function(){
  try{ if(typeof renderTop === 'function') renderTop(); }catch(e){}
  try{ if(typeof renderStats === 'function') renderStats(); }catch(e){}
  try{ if(window.V68_UI && typeof V68_UI.statusBar === 'function') V68_UI.statusBar(); }catch(e){}
  try{ if(window.V68_UI && typeof V68_UI.announceRefresh === 'function') V68_UI.announceRefresh(); }catch(e){}
};
window.ELDA.tags = {
  of: window.v92_nodeTags,
  has: window.v92_hasNodeTag,
  /* 按标签筛事件池（EVENT_POOL_EXT 事件可选带 tags 字段；无 tags 时按 cls 回退匹配，供 UPG-14 钩子与成就用） */
  eventsByTag: function(tag){
    try{
      const pool=(typeof EVENT_POOL_EXT!=="undefined"&&EVENT_POOL_EXT)?EVENT_POOL_EXT:[];
      const out=[];
      for(let i=0;i<pool.length;i++){
        const e=pool[i];
        if(!e) continue;
        if(e.tags&&Array.isArray(e.tags)&&e.tags.indexOf(tag)>=0){ out.push(e); continue; }
        if(tag==="天灾"&&e.cls==="天灾"){ out.push(e); continue; }
        if(tag==="奇遇"&&e.cls==="奇遇"){ out.push(e); continue; }
        if(tag==="商机"&&e.cls==="商机"){ out.push(e); continue; }
        if(tag==="人祸"&&e.cls==="人祸"){ out.push(e); continue; }
      }
      return out;
    }catch(e){ return []; }
  }
};
/* ===== /v92inj:lore/ UPG-01 世界书 Lorebook（只读钩子；constant 常驻 + triggers 命中注入 + recursive 递归链 + depth 插位；开关 S.settings.lorebook；不写任何状态） ===== */
window.v92_lorebook = function(node){
  try{
    if(!S||!S.settings||S.settings.lorebook===false) return [];
    const L=window.LOREBOOK; if(!L||!L.length) return [];
    /* 拼节点文本 + 标签 + 地点作触发源 */
    let hay="";
    try{
      const raw=(node&&node.text!=null)?node.text:null;
      if(typeof raw==="string") hay+=raw;
      else if(Array.isArray(raw)) hay+=raw.join(" ");
      else if(raw&&typeof raw==="object"){ try{ hay+=JSON.stringify(raw); }catch(_){} }
      if(node&&node.tags&&Array.isArray(node.tags)) hay+=" "+node.tags.join(" ");
      if(node&&node.place) hay+=" "+node.place;
      if(node&&node.title) hay+=" "+node.title;
      if(S.curCity) hay+=" "+S.curCity;
      if(S.region) hay+=" "+S.region;
    }catch(_){}
    const hayS=String(hay||"");
    const active=[];
    const hitSet={};
    function pushEntry(e){
      if(!e||hitSet[e.id]) return;
      hitSet[e.id]=true; active.push(e);
    }
    /* 常驻条目（会话级去重：同一条目本会话只注入一次，避免「每次选择完都重复显示九域格局/光明神系」；开关关闭时零注入；不写存档） */
    if(!window.__loreShown) window.__loreShown = {};
    for(let i=0;i<L.length;i++){ if(L[i]&&L[i].constant){ if(!window.__loreShown[L[i].id]){ window.__loreShown[L[i].id]=1; pushEntry(L[i]); } } }
    /* 触发命中 */
    for(let i=0;i<L.length;i++){
      const e=L[i]; if(!e||e.constant) continue;
      const tr=e.triggers;
      if(!tr||!tr.length) continue;
      for(let k=0;k<tr.length;k++){
        if(hayS.indexOf(tr[k])>=0){ pushEntry(e); break; }
      }
    }
    /* 递归链：命中条目的 recursive 依次激活 */
    let grew=true, guard=0;
    while(grew&&guard<10){
      grew=false; guard++;
      for(let i=0;i<L.length;i++){
        const e=L[i]; if(!e) continue;
        if(!hitSet[e.id]) continue;
        const rc=e.recursive; if(!rc||!rc.length) continue;
        for(let k=0;k<rc.length;k++){
          for(let j=0;j<L.length;j++){
            if(L[j]&&L[j].id===rc[k]&&!hitSet[L[j].id]){ pushEntry(L[j]); grew=true; }
          }
        }
      }
    }
    if(!active.length) return [];
    /* 上下文压力控制：depth=0 前置最多 3 条；其余最多 1 条 */
    const front=active.filter(function(e){ return e.depth===0; }).slice(0,3);
    const back=active.filter(function(e){ return e.depth!==0; }).slice(0,1);
    const out=[];
    for(let i=0;i<front.length;i++){ if(front[i]&&front[i].text) out.push(front[i].text); }
    for(let i=0;i<back.length;i++){ if(back[i]&&back[i].text) out.push(back[i].text); }
    try{ console.log("[v92inj:lore]", out.length, out[0]?out[0].slice(0,24):""); }catch(_){}
    return out;
  }catch(e){ try{ console.log("[v92lore:err]",e); }catch(_){} return []; }
};
/* ===== /upg14inj:hooks/ UPG-14 事件池全局钩子（Evennia Scripts 模式）
 * 节点切换后由 writeNext 调用 v92_scanHooks：遍历 GLOBAL_HOOKS（数据层 dn_hooks.js），
 * condition（只读 S 的 JS 表达式）满足 + cooldown 冷却结束 + 未超 maxTriggers → 播报对应事件。
 * eventId 去重（S.world['ev_'+id]）；S.hooksState 独立键（applyDefaults 兜底，旧档兼容）。
 * 另含 v92_scanLedgerReminder：因果账本 open 高优先级伏笔定期提醒（每 10 天一次）。
 * 铁律：不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义。 ===== */
window.v92_scanHooks = function(){
  try{
    if(!S) return;
    if(S.settings && S.settings.globalHooks === false) return;
    const HK = window.GLOBAL_HOOKS; if(!HK || !HK.length) return;
    if(!S.hooksState) S.hooksState = {};
    if(!S.world) S.world = {};
    for(let i=0;i<HK.length;i++){
      const h = HK[i]; if(!h || !h.id) continue;
      const st = S.hooksState[h.id] || {n:0, lastDay:-9999};
      if(st.n >= (h.maxTriggers||1)) continue;
      if(S.day - st.lastDay < (h.cooldown||0)) continue;
      if(S.world['ev_'+h.eventId]) continue;
      let ok = false;
      try{ ok = !!(new Function('S','window','return ('+h.condition+');'))(S, window); }catch(e){ ok = false; }
      if(!ok) continue;
      S.world['ev_'+h.eventId] = true;
      st.n += 1; st.lastDay = S.day;
      S.hooksState[h.id] = st;
      try{ if(window.logMsg) logMsg("世界事件："+(h.text||"某种预兆降临了。")+"（第"+S.day+"日）"); }catch(e){}
      try{ console.log("[upg14inj:hook]", h.id, "day", S.day, "n", st.n); }catch(e){}
    }
  }catch(e){ try{ console.log("[upg14:hook:err]", e); }catch(_){} }
};
/* /upg14inj:ledger/ 账本伏笔定期提醒（只读：CAUSALITY_LEDGER 中 status open 且 importance>=4 的项，每 10 天弹 1 条） */
window.v92_scanLedgerReminder = function(){
  try{
    if(!S) return;
    const LG = window.CAUSALITY_LEDGER; if(!LG || !LG.length) return;
    if(!S.hooksState) S.hooksState = {};
    const st = S.hooksState.ledgerReminder || {lastDay:-9999};
    if(S.day - st.lastDay < 10) return;
    const pending = [];
    for(let i=0;i<LG.length;i++){
      const e = LG[i];
      if(e && e.status==='open' && (e.importance||0)>=4) pending.push(e);
    }
    if(pending.length){
      st.lastDay = S.day;
      S.hooksState.ledgerReminder = st;
      const pick = pending[Math.floor(Math.random()*pending.length)];
      try{ if(window.logMsg) logMsg("【伏笔回声】"+((pick.desc||"一件旧事")+"").slice(0,60)+"……（第"+S.day+"日）", "warn"); }catch(e){}
      try{ console.log("[upg14inj:ledger]", pick.id||"", S.day); }catch(e){}
    }
  }catch(e){ try{ console.log("[upg14:ledger:err]", e); }catch(_){} }
};

/* ===== /upg16inj:fantasy/ UPG-16 西幻体系深化（种族特长/职业事件/阵营感知/法术书）
 * 只读/渲染层钩子：不触碰判定公式 / writeNext 核心语义 / choose。
 * v92_raceShown：建号后首次渲染播报种族特长（flag 防重复）。
 * v92_campFlags：按 S.rep 维护阵营感知 flag（upg16_rep_high/low），驱动 dn_camp.js 变体。
 * v92_scanJobEvents：职业专属事件池扫描（并入 v92_scanHooks 调用链）。
 * v92_openSpellbook：法术书面板（四系法术配方展示）。 ===== */
window.v92_raceShown = function(){
  try{
    if(!S) return;
    if(S.flags && S.flags.upg16_raceShown) return;
    const RT = window.RACE_TRAITS; if(!RT) return;
    const key = String(S.race||"human");
    const r = RT[key] || RT.human;
    if(!r) return;
    if(S.flags) S.flags.upg16_raceShown = true;
    const lines = ["【血脉 · " + r.name + "】" + r.desc];
    for(let i=0;i<(r.traits||[]).length;i++){
      lines.push("◆" + r.traits[i].t + "：" + r.traits[i].d);
    }
    try{ if(window.logMsg) logMsg(lines.join("\n"), "lore"); }catch(e){}
    try{ console.log("[upg16inj:race]", key); }catch(e){}
  }catch(e){ try{ console.log("[upg16:race:err]", e); }catch(_){} }
};
window.v92_campFlags = function(){
  try{
    if(!S || !S.flags) return;
    const rep = (typeof S.rep==='number') ? S.rep : 50;
    if(rep >= 70) S.flags.upg16_rep_high = true;
    else if(rep <= 30) S.flags.upg16_rep_low = true;
  }catch(e){}
};
window.v92_scanJobEvents = function(){
  try{
    if(!S) return;
    const JE = window.JOB_EVENTS; if(!JE || !JE.length) return;
    if(!S.world) S.world = {};
    for(let i=0;i<JE.length;i++){
      const e = JE[i]; if(!e || !e.id) continue;
      if(S.world['ev_'+e.id]) continue;
      if(e.day && S.day < e.day) continue;
      if(e.job && S.job !== e.job) continue;
      S.world['ev_'+e.id] = true;
      try{ if(window.logMsg) logMsg("世界事件："+e.text+"（第"+S.day+"日）"); }catch(_){}
      try{ console.log("[upg16inj:jobev]", e.id, S.day); }catch(_){}
    }
  }catch(e){ try{ console.log("[upg16:jobev:err]", e); }catch(_){} }
};
window.v92_openSpellbook = function(){
  try{
    const SP = window.MAGIC_SPELLS; if(!SP || !SP.length) return;
    const schools = ["元素", "神圣", "深渊", "秘术"];
    let h = '<div class="panel-wrap" style="max-width:640px;max-height:80vh;display:flex;flex-direction:column">'
      +'<div class="panel-header"><span class="panel-title">📖 法术书 · 四系奥术</span><button class="panel-close" onclick="closePanel()">✕</button></div>'
      +'<div class="panel-body" style="flex:1;overflow-y:auto;line-height:1.7">';
    const mp = (typeof S!=='undefined'&&S)?(S.mp||0):0;
    for(let s=0;s<schools.length;s++){
      h += '<div style="margin-top:10px;font-weight:600;color:var(--m-04,#C9A7E8)">【'+schools[s]+'系】</div>';
      for(let i=0;i<SP.length;i++){
        const sp = SP[i];
        if(sp.school !== schools[s]) continue;
        const can = mp >= (sp.manaCost||0);
        h += '<div style="margin:6px 0;padding:6px 8px;border-left:3px solid '+(can?'#8BC8EA':'#999')+';background:rgba(139,200,234,0.08);border-radius:6px">'
          +'<b>'+sp.name+'</b> <span style="font-size:12px;color:var(--text-muted)">消耗 '+sp.manaCost+' 法力 · 你当前 '+mp+'</span>'
          +'<div style="font-size:13px;margin-top:2px">成分：'+(sp.comps||[]).join('、')+'</div>'
          +'<div style="font-size:13px;color:#555">吟唱：「'+sp.chant+'」</div>'
          +'<div style="font-size:13px;color:#555">效果：'+sp.effect+'</div></div>';
      }
    }
    h += '</div><div class="panel-footer"><button class="btn btn-gold" onclick="closePanel()">合上</button></div></div>';
    try{ if(typeof elFromHtml==='function' && typeof openModal==='function') openModal(elFromHtml(h)); else if(window.flashMsg) flashMsg("法术书已就绪（需在游戏界面打开）"); }catch(e){ try{ console.log('spellbook', e); }catch(_){} }
  }catch(e){ try{ console.log("[upg16:spell:err]", e); }catch(_){} }
};
window.v92_openSpellbook = v92_openSpellbook;

/* ===== /upg17inj:chronicle/ UPG-17 编年史系统（世界史自适应叙事）
 * v92_chronicleAdd：写入 {date,eventType,description,importance,discoveredBy}，容量 200 滚动。
 * v92_chronicleCheck(node)：按 CHRONICLE_RULES 匹配节点 → 去重 → 写入（玩家没到过的节点不记录）。
 * v92_chronicleReview：结局节点渲染时生成"艾尔达大陆编年史回顾"，按玩家发现顺序叙事。
 * 独立键 S.chronicle（applyDefaults 兜底）；不触碰判定公式 / writeNext 核心语义 / choose。 ===== */
window.v92_chronicleAdd = function(eventType, description, importance){
  try{
    if(!S) return;
    if(!S.chronicle) S.chronicle = [];
    S.chronicle.push({
      date: (typeof S.day==='number'?S.day:0),
      eventType: String(eventType||"事件"),
      description: String(description||""),
      importance: (typeof importance==='number'?importance:1),
      discoveredBy: String(curNode||"")
    });
    if(S.chronicle.length > 200) S.chronicle.splice(0, S.chronicle.length - 200);
    try{ console.log("[upg17inj:chronicle]", eventType, S.day); }catch(e){}
  }catch(e){ try{ console.log("[upg17:chronicle:err]", e); }catch(_){} }
};
window.v92_chronicleCheck = function(node){
  try{
    if(!S || !node || !node.id) return;
    if(!S.chronicle) S.chronicle = [];
    const R = window.CHRONICLE_RULES; if(!R || !R.length) return;
    const nid = String(node.id);
    for(let i=0;i<R.length;i++){
      const r = R[i];
      const hit = (r.kind==='exact') ? (nid===r.match) : (nid.indexOf(r.match)===0);
      if(!hit) continue;
      // 去重：同 eventType 已存在于最近 200 条则不重复记录
      let dup = false;
      for(let k=S.chronicle.length-1;k>=Math.max(0,S.chronicle.length-30);k--){
        if(S.chronicle[k] && S.chronicle[k].eventType===r.eventType){ dup=true; break; }
      }
      if(dup) continue;
      let desc = String(r.desc||"");
      desc = desc.split("{n}").join(String(S.name||"旅人"));
      desc = desc.split("{homeland}").join(String(S.homeland||""));
      v92_chronicleAdd(r.eventType, desc, r.importance);
    }
  }catch(e){ try{ console.log("[upg17:check:err]", e); }catch(_){} }
};
window.v92_chronicleReview = function(){
  try{
    if(!S || !S.chronicle || !S.chronicle.length) return null;
    const ev = [];
    for(let i=0;i<S.chronicle.length;i++){
      const c = S.chronicle[i];
      if(!c) continue;
      if(c.importance >= 2 && c.description) ev.push(c);
    }
    if(!ev.length) return null;
    const lines = ["——艾尔达大陆编年史·片段——"];
    lines.push("（按你亲历的顺序，这些事被记了下来）");
    for(let i=0;i<ev.length;i++){
      const c = ev[i];
      lines.push("〔第" + c.date + "日 · " + c.eventType + "〕" + c.description);
    }
    return lines;
  }catch(e){ try{ console.log("[upg17:review:err]", e); }catch(_){} return null; }
};

/* ===== /v92inj:mem2/ UPG-02 记忆注入 v3：双层加权检索（只读钩子；世界规则层=LOREBOOK constant，事件记忆层=CAUSALITY_LEDGER 按 keywords×importance×recency Top-K；开关 S.settings.memoryBank；不写任何状态） ===== */
window.v92_memoryBank = function(node){
  try{
    if(!S||!S.settings||S.settings.memoryBank===false) return [];
    const LG=window.CAUSALITY_LEDGER; if(!LG||!LG.length) return [];
    /* 触发源：节点文本+地点+标签 */
    let hay="";
    try{
      const raw=(node&&node.text!=null)?node.text:null;
      if(typeof raw==="string") hay+=raw;
      else if(Array.isArray(raw)) hay+=raw.join(" ");
      else if(raw&&typeof raw==="object"){ try{ hay+=JSON.stringify(raw); }catch(_){} }
      if(node&&node.place) hay+=" "+node.place;
      if(node&&node.tags&&Array.isArray(node.tags)) hay+=" "+node.tags.join(" ");
      if(S.curCity) hay+=" "+S.curCity;
    }catch(_){}
    const hayS=String(hay||"");
    if(!hayS) return [];
    const st=window.__v92memState=window.__v92memState||{turn:0,last:[]};
    st.turn++;
    const cands=[];
    for(let i=0;i<LG.length;i++){
      const it=LG[i]; if(!it||!it.desc) continue;
      const kw=it.keywords;
      let hit=false;
      if(kw&&kw.length){
        for(let k=0;k<kw.length;k++){ if(hayS.indexOf(kw[k])>=0){ hit=true; break; } }
      }
      /* 兜底：desc 首词命中 */
      if(!hit&&it.desc){ const w0=String(it.desc).split(/[,，、\s]/)[0]; if(w0&&w0.length>=2&&hayS.indexOf(w0)>=0) hit=true; }
      if(!hit) continue;
      /* score = importance * recency_bonus；最近引用过则降权（防重复刷屏），从未引用或久远引用加权 */
      const lastT=(typeof it.lastReferencedTurn==="number")?it.lastReferencedTurn:0;
      const age=st.turn-lastT;
      const recency=Math.min(3, 1+age/20);
      const imp=(typeof it.importance==="number")?it.importance:1;
      const score=imp*recency;
      cands.push({it:it, score:score});
    }
    if(!cands.length) return [];
    cands.sort(function(a,b){ return b.score-a.score; });
    const top=cands.slice(0,3);
    const out=[];
    for(let i=0;i<top.length;i++){
      const it=top[i].it;
      it.lastReferencedTurn=st.turn; /* 运行时内存更新，不写存档 */
      let d=String(it.desc||"").trim();
      if(d.length>70) d=d.slice(0,70)+"…";
      out.push(d);
    }
    st.last=out.slice();
    try{ console.log("[v92inj:mem2]", out.length, top[0].it.id); }catch(_){}
    return out;
  }catch(e){ try{ console.log("[v92mem2:err]",e); }catch(_){} return []; }
};
/* ===== /v92inj:wxfn/ TQ-1 天气句（只读钩子；按季节×区域返回 1 句天气句；开关 S.settings.weatherLine；不写任何状态） ===== */
window.v92_weatherLine = function(node){
  try{
    if(!S||!S.settings||S.settings.weatherLine===false) return null;
    const T=window.WEATHER_TPL; if(!T) return null;
    const m=(S.month||1);
    const season = m<=3?"春":(m<=6?"夏":(m<=9?"秋":"冬"));
    const locS=String(S.loc||"")+String((node&&node.place)||"");
    let grp="generic";
    const KM=[["north",["北境","雪原","第三哨","铁门关","北地"]],["academy",["学院","学府"]],["free",["自由城","交汇城"]],
              ["desert",["沙漠","绿洲"]],["orc",["草原","兽人"]],["church",["圣城","教会","教堂"]],
              ["east",["承天","东境","帝京"]],["west",["西境","荒原"]],["elf",["精灵","林海","林邦"]],
              ["dwarf",["矮人","山国","山腹"]],["south",["南境","城邦"]]];
    for(let i=0;i<KM.length;i++){
      for(let j=0;j<KM[i][1].length;j++){ if(locS.indexOf(KM[i][1][j])>=0){ grp=KM[i][0]; break; } }
      if(grp!=="generic") break;
    }
    const g=T[grp]||{};
    let pool=g[season]||g.any||null;
    if(!pool||!pool.length){ const gg=T.generic||{}; pool=gg[season]||null; }
    if(!pool||!pool.length) return null;
    const st=window.__v92wxState=window.__v92wxState||{last:""};
    let s=pool[Math.floor(Math.random()*pool.length)];
    if(s===st.last&&pool.length>1){ s=pool[(pool.indexOf(s)+1)%pool.length]; }
    st.last=s;
    try{ console.log("[v92inj:wx]", s.slice(0,40)); }catch(_){}
    return s;
  }catch(e){ try{ console.log("[v92wx:err]",e); }catch(_){} return null; }
};
/* ===== /pn1inj:engine/ P-N1 并行叙事线程状态机 + P-N2 编织引用（学习 inkle/ink threads & weave）
 * 纯只读/独立键钩子：不触碰判定公式/writeNext 核心语义/choose/存档结构语义。
 * v92_threadTick：按节点 id 前缀登记所属线程（S.threads 独立键，applyDefaults 兜底）。
 * v92_threadList：按最近活跃日排序返回线程状态（供世界状态牌/手记展示）。
 * v92_expandWeave：text 元素以 "§节点id" 开头时展开为被引用节点正文（递归≤3、防环、缺失原样提示）。
 */
window.v92_threadTick = function(node){
  try{
    if(!S) return null;
    if(!S.threads) S.threads={};
    const id = (node && node.id) ? node.id : (typeof curNode!=='undefined' ? curNode : '');
    if(!id) return null;
    const TH = window.THREADS; if(!TH) return null;
    let tId = (node && node.thread) ? node.thread : null;
    if(!tId){
      for(const k in TH){
        const pf = TH[k].prefix;
        if(!pf || !pf.length) continue;
        for(let i=0;i<pf.length;i++){ if(String(id).indexOf(pf[i])===0){ tId=k; break; } }
        if(tId) break;
      }
    }
    if(!tId) return null;
    if(!S.threads[tId]) S.threads[tId]={id:tId, pos:null, updatedDay:0, seen:0};
    const t=S.threads[tId];
    t.pos = id; t.updatedDay = (S.day||0); t.seen = (t.seen||0)+1;
    return t;
  }catch(e){ try{ console.log("[pn1:thr:err]",e); }catch(_){} return null; }
};
window.v92_threadList = function(){
  try{
    if(!S||!S.threads) return [];
    const TH = window.THREADS || {};
    const out = [];
    for(const k in S.threads){
      const t = S.threads[k] || {};
      out.push({id:k, name:(TH[k]&&TH[k].name)||k, desc:(TH[k]&&TH[k].desc)||"", pos:t.pos||null, updatedDay:t.updatedDay||0, seen:t.seen||0});
    }
    out.sort(function(a,b){ return (b.updatedDay||0)-(a.updatedDay||0); });
    return out;
  }catch(e){ return []; }
};
window.v92_expandWeave = function(txt){
  try{
    if(!Array.isArray(txt)) return txt;
    const out = [];
    const seen = {};
    function expand(arr, depth){
      for(let i=0;i<arr.length;i++){
        const el = arr[i];
        if(typeof el==="string" && el.charAt(0)==="\u00a7"){
          const ref = el.slice(1).trim();
          if(!ref || depth>=3 || seen[ref]) continue;
          seen[ref] = true;
          const tn = (typeof N!=="undefined" && N) ? N[ref] : null;
          if(tn){
            let sub = null;
            try{ sub = (typeof window.v91_resolveText==="function") ? window.v91_resolveText(tn) : (typeof tn.text==="function"?tn.text():tn.text); }catch(e){}
            if(Array.isArray(sub) && sub.length){ expand(sub, depth+1); continue; }
          }
          out.push("（引用段落未找到："+ref+"）");
        } else { out.push(el); }
      }
    }
    expand(txt, 0);
    return out;
  }catch(e){ return txt; }
};
/* /pn3inj:panel/ P-N3 叙事线面板：并行叙事线状态总览（卷·线·章 UI）
 * 只读 S.threads + THREADS；"前往"复用既有 v488_go（走 writeNext 正常渲染，零语义改动）。
 */
window.v92_threadNodeName = function(id){
  try{
    if(!id) return "";
    const n = (typeof N!=="undefined" && N) ? N[id] : null;
    if(n){ return (n.sceneTitle || n.place || id); }
    return id;
  }catch(e){ return id || ""; }
};

/* ===== /tninj:editor/ T-N 作者工具：游戏内节点编辑器 =====
 * 只读搜索 + 会话级编辑（N[id] 覆盖，刷新还原）+ 脚手架 + 导出补丁 JSON。
 * 导出格式：{kind:"elda-node-patch-v1", nodes:{id:{tag,place,pace,text}}, created:[...]}
 * 回写方式：把 nodes 合并进 src\data_nodes\dn_patch.js（见工具手册）。
 */
window.v92_nodeEdit = window.v92_nodeEdit || {dirty:{}, created:{}};
window.v92_nodeSearch = function(kw){
  try{
    if(!window.N) return [];
    kw = String(kw||"").toLowerCase();
    var out = []; var cnt = 0;
    for(var id in N){
      try{
        var n = N[id];
        if(!n || typeof n!=="object") continue;
        if(kw){
          if(id.toLowerCase().indexOf(kw) >= 0){ /* 命中 */ }
          else{
            var t = "";
            try{
              if(typeof n.text==="string") t = n.text;
              else if(Array.isArray(n.text)) t = n.text.join("");
              else if(n.text && typeof n.text==="object") t = JSON.stringify(n.text);
            }catch(e){}
            if(t.toLowerCase().indexOf(kw) < 0) continue;
          }
        }
        var len = 0;
        try{
          if(typeof n.text==="string") len = n.text.length;
          else if(Array.isArray(n.text)) len = n.text.join("").length;
        }catch(e){}
        out.push({id:id, tag:n.tag||"", place:(n.place||""), pace:n.pace||"normal", len:len});
        cnt++;
        if(cnt>=60) break;
      }catch(e){}
    }
    return out;
  }catch(e){ return []; }
};
window.v92_nodeEditOpen = function(id){
  try{
    if(!id || !window.N || !N[id]) return;
    var n = N[id];
    var box = document.createElement("div");
    box.className = "box";
    var textVal = "";
    try{
      if(typeof n.text==="string") textVal = n.text;
      else if(Array.isArray(n.text)) textVal = n.text.join("\n<<<>>>\n");
      else if(n.text && typeof n.text==="object") textVal = JSON.stringify(n.text);
    }catch(e){}
    var tag = n.tag||""; var place = (typeof n.place==="string"?n.place:""); var pace = n.pace||"normal";
    box.innerHTML =
      "<h2>✎ 节点编辑 · "+id+"</h2>"+
      "<p class='sub'>tag: "+tag+" ｜ pace: "+pace+" ｜ 字符数: "+textVal.length+"</p>"+
      "<div style='margin:6px 0'><b class='mini'>place（地点）</b><input id='v92ne-place' class='in' value=\""+place.replace(/"/g,"&quot;")+"\" style='width:100%;padding:6px'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>text（段落用空行分隔，数组元素用 &lt;&lt;&lt;&gt;&gt;&gt; 分隔）</b></div>"+
      "<textarea id='v92ne-text' rows='10' style='width:100%;box-sizing:border-box;padding:8px;font-size:13px;line-height:1.6;background:var(--bg,#f4efe4);color:var(--text,#222);border:1px solid var(--line,#2d4566);border-radius:6px'>"+textVal.replace(/</g,"&lt;")+"</textarea>"+
      "<div style='margin:8px 0'><b class='mini'>pace</b> <select id='v92ne-pace' style='padding:4px'><option value='light'>light</option><option value='normal'>normal</option><option value='deep'>deep</option><option value='epic'>epic</option></select></div>"+
      "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px'>"+
      "<button class='btn' onclick='v92_nodeSave(\""+id+"\")'>保存（即时生效）</button>"+
      "<button class='btn' onclick='v92_nodePreview(\""+id+"\")'>预览正文</button>"+
      "<button class='btn' onclick='v92_nodeExport()'>导出补丁 JSON</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>";
    openModal(box);
    try{ var psel = document.getElementById("v92ne-pace"); if(psel){ psel.value = pace; } }catch(e){}
  }catch(e){ try{ console.log("[tn:open:err]",e); }catch(_){} }
};
window.v92_nodeSave = function(id){
  try{
    if(!id || !window.N || !N[id]) return;
    var t = document.getElementById("v92ne-text");
    var pl = document.getElementById("v92ne-place");
    var pc = document.getElementById("v92ne-pace");
    if(!t) return;
    var txt = t.value;
    var arr = txt.split("\n<<<>>>\n");
    var cleaned = [];
    for(var i=0;i<arr.length;i++){ if(arr[i].trim().length>0){ cleaned.push(arr[i]); } }
    if(cleaned.length===1){ N[id].text = cleaned[0]; }
    else{ N[id].text = cleaned; }
    if(pl && pl.value){ N[id].place = pl.value; }
    if(pc && pc.value){ N[id].pace = pc.value; }
    window.v92_nodeEdit.dirty[id] = {tag:N[id].tag||"", place:N[id].place||"", pace:N[id].pace||"normal", text:N[id].text};
    try{ var st=document.getElementById("v92ne-status"); if(st){ st.innerHTML="<b style='color:#2e7d32'>已保存到当前会话（刷新还原）。导出补丁后可回写源码。</b>"; } }catch(e){}
    var cur = (typeof curNode!=="undefined" && curNode===id);
    if(cur){ try{ writeNext(id); }catch(e){} }
    alert("已保存到当前会话（即时生效）。点「导出补丁 JSON」可回写源码。");
  }catch(e){ try{ console.log("[tn:save:err]",e); }catch(_){} }
};
window.v92_nodePreview = function(id){
  try{ if(id && typeof writeNext==="function"){ writeNext(id); } }catch(e){}
};
window.v92_nodeExport = function(){
  try{
    var d = window.v92_nodeEdit.dirty||{};
    var c = window.v92_nodeEdit.created||{};
    if(!Object.keys(d).length && !Object.keys(c).length){ alert("当前没有修改。"); return; }
    var patch = {kind:"elda-node-patch-v1", nodes:{}, created:{}};
    for(var id in d){ patch.nodes[id] = d[id]; }
    for(var cid in c){ patch.created[cid] = c[cid]; }
    var blob = new Blob([JSON.stringify(patch,null,2)], {type:"application/json"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "elda_node_patch_"+Date.now()+".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    alert("已导出补丁 JSON（"+Object.keys(d).length+" 改 + "+Object.keys(c).length+" 增）。回写方式见 docs\\工具手册.md。");
  }catch(e){ try{ console.log("[tn:export:err]",e); }catch(_){} }
};
window.v92_nodeScaffold = function(){
  try{
    var box = document.createElement("div");
    box.className = "box";
    box.innerHTML =
      "<h2>🛠 新建节点脚手架</h2><p class='sub'>生成合规节点骨架（tag/place/pace/text）。保存后即加入当前会话，导出可回写源码。</p>"+
      "<div style='margin:6px 0'><b class='mini'>id（英文/拼音前缀，如 west_xxx）</b><input id='v92ns-id' class='in' style='width:100%;padding:6px'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>place</b><input id='v92ns-place' class='in' style='width:100%;padding:6px' value='自由城邦 · 交汇城'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>pace</b> <select id='v92ns-pace' style='padding:4px'><option>normal</option><option>light</option><option>deep</option><option>epic</option></select></div>"+
      "<div style='margin:6px 0'><b class='mini'>text</b></div>"+
      "<textarea id='v92ns-text' rows='6' style='width:100%;box-sizing:border-box;padding:8px;font-size:13px;line-height:1.6;background:var(--bg,#f4efe4);color:var(--text,#222);border:1px solid var(--line,#2d4566);border-radius:6px'></textarea>"+
      "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px'>"+
      "<button class='btn' onclick='v92_nodeCreate()'>创建并保存</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>";
    openModal(box);
  }catch(e){ try{ console.log("[tn:scaffold:err]",e); }catch(_){} }
};
window.v92_nodeCreate = function(){
  try{
    var idEl = document.getElementById("v92ns-id");
    var plEl = document.getElementById("v92ns-place");
    var pcEl = document.getElementById("v92ns-pace");
    var txEl = document.getElementById("v92ns-text");
    if(!idEl || !txEl) return;
    var id = String(idEl.value||"").trim();
    if(!id || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(id)){ alert("id 需以字母开头，仅字母/数字/下划线。"); return; }
    if(window.N && N[id]){ alert("节点已存在："+id); return; }
    var txt = txEl.value;
    var arr = txt.split("\n<<<>>>\n");
    var cleaned = [];
    for(var i=0;i<arr.length;i++){ if(arr[i].trim().length>0){ cleaned.push(arr[i]); } }
    var node = {tag:"main", place:(plEl?plEl.value:"自由城邦 · 交汇城"), pace:(pcEl?pcEl.value:"normal"), text:(cleaned.length===1?cleaned[0]:cleaned)};
    if(!window.N){ window.N = {}; }
    N[id] = node;
    window.v92_nodeEdit.created[id] = node;
    alert("已创建并加入当前会话："+id+"。点「导出补丁 JSON」回写源码。");
    try{ v92_nodeEditOpen(id); }catch(e){}
  }catch(e){ try{ console.log("[tn:create:err]",e); }catch(_){} }
};

/* ===== /an2inj:ambclass/ A-N2 ambience 氛围主题：按时间+地点给正文容器加氛围 CSS 类（只读视觉） ===== */
window.v92_ambClass = function(){
  try{
    var cls = [];
    var place = (typeof curNode!=="undefined" && curNode && window.N && N[curNode] && N[curNode].place) ? String(N[curNode].place) : "";
    var h = (S&&S.world&&typeof S.world.hour==="number") ? S.world.hour : 8;
    if(h<6||h>=20) cls.push("amb-night");
    else if(h<10) cls.push("amb-morning");
    else if(h<16) cls.push("amb-noon");
    else cls.push("amb-dusk");
    if(place.indexOf("森林")>=0||place.indexOf("林海")>=0) cls.push("amb-forest");
    else if(place.indexOf("雪")>=0||place.indexOf("北境")>=0||place.indexOf("铁门关")>=0) cls.push("amb-snow");
    else if(place.indexOf("沙漠")>=0) cls.push("amb-desert");
    else if(place.indexOf("草原")>=0) cls.push("amb-steppe");
    else if(place.indexOf("圣城")>=0||place.indexOf("教堂")>=0||place.indexOf("圣域")>=0) cls.push("amb-church");
    else if(place.indexOf("酒馆")>=0||place.indexOf("客栈")>=0) cls.push("amb-tavern");
    return cls;
  }catch(e){ return []; }
};
window.v92_applyAmbience = function(){
  try{
    var el = document.getElementById("story");
    if(!el) return;
    var all = ["story-amb","amb-night","amb-morning","amb-noon","amb-dusk","amb-forest","amb-snow","amb-desert","amb-steppe","amb-church","amb-tavern"];
    for(var i=0;i<all.length;i++){ if(el.classList) el.classList.remove(all[i]); }
    if(S && S.settings && S.settings.ambience===false) return;
    var cls = window.v92_ambClass();
    if(el.classList) el.classList.add("story-amb");
    for(var j=0;j<cls.length;j++){ if(cls[j] && el.classList) el.classList.add(cls[j]); }
  }catch(e){}
};
/* /an3inj:hl/ A-N3 专名高亮：LOREBOOK.triggers 构建专名表（长名优先），DOM 层包 span（title=世界书条目） */
window.v92_hlDisable = false;
window.v92_hlNames = [];
window.v92_hlDesc = {};
window.v92_hlInit = function(){
  try{
    if(!window.LOREBOOK) return;
    var map = {};
    for(var i=0;i<LOREBOOK.length;i++){
      var lb = LOREBOOK[i];
      if(!lb || !lb.triggers || !lb.title) continue;
      for(var j=0;j<lb.triggers.length;j++){
        var w = String(lb.triggers[j]);
        if(w.length<2) continue;
        if(!map[w]) map[w] = lb.title;
      }
    }
    /* /v96inj:hotword/ V96 热词扩展：NPC 人名 + 九域地名并入联合正则（词条/关系/地点三合一） */
    var kindMap = {}; var idMap = {};
    for(var _k0 in map){ kindMap[_k0]="lore"; idMap[_k0]=map[_k0]; }
    try{
      if(window.NPC_NET){
        for(var nk in NPC_NET){
          var nn = NPC_NET[nk]; var ncn = (nn && nn.cn) ? String(nn.cn) : "";
          if(ncn.length>=2 && !map[ncn]){ map[ncn]=(nn.tag||nk); kindMap[ncn]="npc"; idMap[ncn]=nk; }
        }
      }
    }catch(e){}
    try{
      if(window.REGIONS){
        for(var rk2 in REGIONS){
          var rr = REGIONS[rk2];
          if(rr && rr.cn && !map[rr.cn]){ map[rr.cn]=(rr.desc||rr.cn); kindMap[rr.cn]="place"; idMap[rr.cn]=rk2; }
          if(rr && rr.cities){
            for(var ck in rr.cities){
              var cc = rr.cities[ck];
              if(cc && cc.cn && cc.cn.length>=2 && !map[cc.cn]){ map[cc.cn]=(cc.desc||cc.cn); kindMap[cc.cn]="place"; idMap[cc.cn]=rk2+"_"+ck; }
            }
          }
        }
      }
    }catch(e){}
    var keys = Object.keys(map);
    keys.sort(function(a,b){ return b.length-a.length; });
    window.v92_hlNames = keys;
    window.v92_hlDesc = map;
    window.v96_hotKind = kindMap;
    window.v96_hotId = idMap;
    /* /an3inj:hlfix/ A-N3 高亮修复：构建单次联合正则（长名优先）。原顺序替换会误伤已生成 span 的 title 属性文本（属性值内含触发词），破坏 HTML 结构，正文出现乱码 */
    try{
      window.v92_hlRe = new RegExp(keys.map(function(nm){ return String(nm).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"); }).join("|"),"g");
    }catch(e){ window.v92_hlRe = null; }
  }catch(e){}
};
window.v92_highlightNames = function(el){
  try{
    if(window.v92_hlDisable) return;
    if(!el || !el.childNodes) return;
    var names = window.v92_hlNames;
    if(!names || !names.length) return;
    var re = window.v92_hlRe;
    if(!re) return;
    var walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var tns = []; var tn;
    while((tn = walk.nextNode())){ tns.push(tn); }
    for(var i=0;i<tns.length;i++){
      var t = tns[i];
      var v = t.nodeValue; if(!v) continue;
      var esc = v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
      var out = esc; var hit = false;
      try{
        re.lastIndex = 0;
        out = out.replace(re, function(m){
          hit = true;
          var desc = String(window.v92_hlDesc[m]||'');
          try{ if(window.v92_galleryMark){ window.v92_galleryMark("npc_"+m, window.v92_hlDesc[m]||m); } }catch(e){}
          var _hk = (window.v96_hotKind && window.v96_hotKind[m]) || "lore";
          var _hid = (window.v96_hotId && window.v96_hotId[m]) || m;
          return "<span class='v92-name' data-k='"+_hk+"' data-id='"+_hid+"' title='"+desc+"'>"+m+"</span>";
        });
      }catch(e){}
      if(hit){
        var sp = document.createElement("span");
        sp.innerHTML = out;
        t.parentNode.replaceChild(sp, t);
      }
    }
  }catch(e){}
};
window.v92_ambCSS = function(){
  try{
    if(document.getElementById("v92-amb-css")) return;
    var st = document.createElement("style");
    st.id = "v92-amb-css";
    st.textContent = ".story-amb{transition:background .8s ease,border-color .8s ease;border-radius:10px;padding:2px 10px;}"+
      ".amb-night{background:linear-gradient(180deg,rgba(15,20,40,.14),rgba(15,20,40,.04));}"+
      ".amb-morning{background:linear-gradient(180deg,rgba(255,214,140,.08),transparent);}"+
      ".amb-noon{background:linear-gradient(180deg,rgba(255,244,214,.10),transparent);}"+
      ".amb-dusk{background:linear-gradient(180deg,rgba(140,90,60,.10),transparent);}"+
      ".amb-forest{box-shadow:inset 0 0 40px rgba(60,110,60,.08);}"+
      ".amb-snow{box-shadow:inset 0 0 40px rgba(140,180,220,.08);}"+
      ".amb-desert{box-shadow:inset 0 0 40px rgba(200,160,80,.08);}"+
      ".amb-steppe{box-shadow:inset 0 0 40px rgba(140,160,80,.06);}"+
      ".amb-church{box-shadow:inset 0 0 50px rgba(180,150,90,.10);}"+
      ".amb-tavern{box-shadow:inset 0 0 40px rgba(120,70,30,.10);}"+
      ".v92-name{border-bottom:1px dotted #a8842a;cursor:pointer;}"+
      ".v92-name:hover{background:rgba(168,132,42,.12);}";
    (document.head||document.documentElement).appendChild(st);
  }catch(e){}
};
window.v92_openNodeEditor = function(){
  try{
    if(typeof openModal!=="function") return;
    var box = document.createElement("div");
    box.className = "box";
    box.innerHTML =
      "<h2>✎ 节点编辑器（作者工具）</h2>"+
      "<p class='sub'>搜索/浏览全部节点（id 或正文关键词）；点条目打开编辑器。编辑保存即时生效（当前会话，刷新还原），导出补丁 JSON 可回写源码。</p>"+
      "<div style='display:flex;gap:6px;margin:8px 0;flex-wrap:wrap'>"+
      "<input id='v92ne-q' class='in' placeholder='输入节点 id 或正文关键词…' style='flex:1 1 200px;padding:6px'/>"+
      "<button class='btn' onclick='v92_nodeDoSearch()'>搜索</button>"+
      "<button class='btn' onclick='v92_nodeScaffold()'>新建节点</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>"+
      "<div id='v92ne-results' style='max-height:340px;overflow-y:auto;border-top:1px solid var(--line,#2d4566);padding-top:8px'></div>";
    openModal(box);
    v92_nodeDoSearch();
  }catch(e){ try{ console.log("[tn:panel:err]",e); }catch(_){} }
};
window.v92_nodeDoSearch = function(){
  try{
    var qEl = document.getElementById("v92ne-q");
    var resEl = document.getElementById("v92ne-results");
    if(!resEl) return;
    var kw = qEl ? qEl.value : "";
    var list = window.v92_nodeSearch(kw);
    var h = "";
    if(!list.length){ h = "<p style='color:var(--dim)'>没有匹配节点。</p>"; }
    for(var i=0;i<list.length;i++){
      var it = list[i];
      var mark = "";
      try{ if(window.v92_nodeEdit.dirty && window.v92_nodeEdit.dirty[it.id]){ mark = " <b style='color:#2e7d32'>已改</b>"; } }catch(e){}
      h += "<div class='v92ne-row' style='padding:6px 8px;margin:3px 0;border:1px solid var(--line,#2d4566);border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;flex-wrap:wrap' onclick='v92_nodeEditOpen(\""+it.id+"\")'>"+
           "<b style='color:var(--gold,#e8c468)'>"+it.id+"</b><span class='mini' style='color:var(--dim)'>"+it.tag+" · "+it.pace+" · "+it.len+"字</span><span style='font-size:12px;color:var(--text)'>"+it.place+"</span>"+mark+"</div>";
    }
    resEl.innerHTML = h;
  }catch(e){ try{ console.log("[tn:search:err]",e); }catch(_){} }
};
window.v92_openThreadPanel = function(){
  try{
    if(typeof openModal!=="function") return;
    const box = document.createElement("div");
    box.className = "box";
    const list = (typeof window.v92_threadList==="function") ? window.v92_threadList() : [];
    let h = "<h2>◆ 并行叙事线</h2><p class='sub'>大陆上多条线并行推进，各自记着进度。点击「前往」回到该线最近所在。</p>";
    if(!list.length){ h += "<p style='color:var(--dim)'>尚未涉足任何叙事线——所有故事都从序章开始。</p>"; }
    for(let i=0;i<list.length;i++){
      const t = list[i];
      const posName = t.pos ? window.v92_threadNodeName(t.pos) : "尚未涉足";
      const day = t.updatedDay ? ("第 "+t.updatedDay+" 日") : "—";
      h += "<div class='v92-thread' style='border:1px solid var(--line,#2d4566);border-radius:8px;padding:10px 12px;margin:8px 0'>";
      h += "<div style='display:flex;align-items:center;gap:8px;flex-wrap:wrap'><b style='color:var(--gold,#e8c468)'>"+(t.name||t.id)+"</b><span class='mini' style='color:var(--dim)'>"+day+" · 已读 "+(t.seen||0)+" 节点</span></div>";
      h += "<div class='mini' style='color:var(--dim);margin-top:2px'>"+(t.desc||"")+"</div>";
      h += "<div style='margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap'><span style='color:var(--text)'>最近："+posName+"</span>";
      if(t.pos){ h += "<button class='btn' style='padding:4px 10px;font-size:12px' onclick='try{closeModal();v488_go(\""+t.pos+"\");}catch(e){}'>前往</button>"; }
      h += "</div></div>";
    }
    h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>";
    box.innerHTML = h;
    openModal(box);
  }catch(e){ try{ console.log("[pn3:panel:err]",e); }catch(_){} }
};
/* /wn1inj:snap/ W-N1 世界局势快照（活的世界）：只读 S.day/REGIONS/flags 生成九域局势
 * 与既有 v92 worldBanner（顶栏"世界暂无大事"）并存：banner 是短句，本面板是完整快照。
 */

/* /wn2inj:npc/ W-N2 NPC 独立状态机（推导式）：只读 S.day/npcRelations，无状态写入 */
window.v92_npcStatus = function(npcId){
  try{
    var ns = window.NPC_STATE; if(!ns) return null;
    var d = (S && typeof S.day==="number") ? S.day : 0;
    var item = null;
    for(var i=0;i<ns.length;i++){ if(ns[i].id===npcId){ item=ns[i]; break; } }
    if(!item || !item.stages || !item.stages.length) return null;
    var st = item.stages[0];
    for(var j=0;j<item.stages.length;j++){ if(d >= item.stages[j].day){ st = item.stages[j]; } }
    var rel = 0;
    if(S && S.npcRelations){ rel = S.npcRelations[npcId] || 0; }
    var mood = "";
    if(rel>=60) mood="（与你是挚交）";
    else if(rel<=-20) mood="（与你结过梁子）";
    return {id:npcId, name:item.name, where:st.where, doing:st.doing, mood:mood};
  }catch(e){ return null; }
};
window.v92_npcStatusList = function(){
  try{
    var ns = window.NPC_STATE; if(!ns) return [];
    var out = [];
    for(var i=0;i<ns.length;i++){
      var s = window.v92_npcStatus(ns[i].id);
      if(s){ out.push(s); }
    }
    return out;
  }catch(e){ return []; }
};
/* /wn3inj:npcweave/ W-N3 NPC 状态回指注入：正文提及 NPC（好感<30，与 CM-1 互斥）时
 * 注入其此刻动态 1 句；开关 S.settings.npcWeave（默认 true）；前缀 /w3inj:npc/ */
window.v92_npcWeave = function(node, txt){
  try{
    if(!S || !S.settings || S.settings.npcWeave===false) return null;
    var ns = window.NPC_STATE; if(!ns) return null;
    var body = "";
    try{
      if(txt && txt.join){ body = txt.join(""); }
      else if(node && node.text){ body = (typeof node.text==="string") ? node.text : String(node.text); }
    }catch(e){}
    if(!body) return null;
    var out = [];
    for(var i=0;i<ns.length;i++){
      var n = ns[i];
      if(!n || !n.name) continue;
      if(body.indexOf(n.name) < 0) continue;
      var rel = 0;
      if(S && S.npcRelations){ rel = S.npcRelations[n.id] || 0; }
      if(rel>=30) continue;
      var st = window.v92_npcStatus(n.id);
      if(!st || !st.doing) continue;
      out.push("（他此刻在"+st.where+"："+st.doing+"）");
      break;
    }
    return out.length ? out : null;
  }catch(e){ try{ console.log("[wn3:npcweave:err]",e); }catch(_){} return null; }
};
window.v92_worldSnapshot = function(){
  try{
    var out = [];
    var d = (S && typeof S.day==="number") ? S.day : 0;
    var ph = window.WORLD_PHASE ? window.WORLD_PHASE(d) : "early";
    var ws = window.WORLD_SNAPSHOT;
    if(!ws || !ws.regions || !ws.regions.length) return out;
    out.push("第 "+d+" 日 · 大陆九域局势");
    for(var i=0;i<ws.regions.length;i++){
      var r = ws.regions[i];
      var t = (r && (r[ph] || r.early)) ? (r[ph] || r.early) : "";
      if(t){ out.push("· " + (r.name||"") + "：" + t); }
    }
    if(ws.majors){
      for(var j=0;j<ws.majors.length;j++){
        var m = ws.majors[j];
        if(m && d >= m.day){ out.push("◆ " + (m.name||"") + "：" + (m.text||"")); }
      }
    }
    return out;
  }catch(e){ try{ console.log("[wn1:snap:err]",e); }catch(_){} return []; }
};
    /* /g1inj:engine/ G-N1 商路引擎（只读行情+买卖结算，不动判定公式） */
    window.v92_tradeHash = function(str){
      var h = 0;
      for(var i=0;i<str.length;i++){ h = (h*31 + str.charCodeAt(i)) & 0x7fffffff; }
      return h;
    };
    window.v92_tradePrice = function(good, city, isBuy){
      try{
        var g = window.TRADE_GOODS_V92 && TRADE_GOODS_V92[good];
        if(!g) return 0;
        var m = window.TRADE_MARKET && TRADE_MARKET[city];
        var mul = m ? m.mul : 1.0;
        var wave = ((S.day*7 + window.v92_tradeHash(good)) % 100) / 100 * 0.30 - 0.15;
        var evMul = 1.0;
        if(window.TRADE_EVENTS){
          for(var eid in TRADE_EVENTS){
            if(!TRADE_EVENTS.hasOwnProperty(eid)) continue;
            var t = TRADE_EVENTS[eid][good];
            if(!t) continue;
            var hit = false;
            if(window.EVENT_POOL_EXT){
              for(var k=0;k<EVENT_POOL_EXT.length;k++){ if(EVENT_POOL_EXT[k] && EVENT_POOL_EXT[k].id===eid){ hit = (S.day>=EVENT_POOL_EXT[k].day && S.day<=EVENT_POOL_EXT[k].day+20); break; } }
            }
            if(!hit && window.WORLD_EVENTS && WORLD_EVENTS[eid]){
              hit = (S.day>=WORLD_EVENTS[eid].day && S.day<=WORLD_EVENTS[eid].day+30);
            }
            if(hit){ evMul *= t; }
          }
        }
        var cityMul = 1.0;
        if(m){
          if(m.prod && m.prod.indexOf(good)>=0){ cityMul = isBuy ? 0.75 : 0.90; }
          else if(m.hot && m.hot.indexOf(good)>=0){ cityMul = isBuy ? 1.10 : 1.15; }
        }
        var price = g.base * mul * (1+wave) * cityMul * evMul;
        if(isBuy){ price = Math.max(1, Math.round(price)); }
        else { price = Math.max(1, Math.round(price * 0.62)); }
        return price;
      }catch(e){ return 0; }
    };
    window.v92_tradeInit = function(){
      if(!S.trade){ S.trade = {goods:{}, logs:[], total:0}; }
      if(!S.trade.goods) S.trade.goods = {};
      if(!S.trade.logs) S.trade.logs = [];
      if(!S.trade.total) S.trade.total = 0;
    };
    window.v92_tradeBuy = function(good, n){
      try{
        window.v92_tradeInit();
        var g = window.TRADE_GOODS_V92 && TRADE_GOODS_V92[good];
        if(!g || !n || n<1) return {ok:false, msg:"没有这种货。"};
        var city = S.curCity || "jiaohui";
        var p = window.v92_tradePrice(good, city, true);
        var cost = p * n;
        if(cost > S.gold) return {ok:false, msg:"钱不够。"};
        var cap = 200;
        var cur = S.trade.goods[good] || 0;
        if(cur + n > cap) return {ok:false, msg:"驮队装不下了（上限 200）。"};
        S.gold -= cost;
        S.trade.goods[good] = cur + n;
        S.trade.logs.push({day:S.day, city:city, good:good, n:n, gold:-cost, type:"buy"});
        if(S.trade.logs.length>50) S.trade.logs.shift();
                if(window.v92_galleryMark){ try{ window.v92_galleryMark("good_"+good, g.cn); }catch(e){} }
        return {ok:true, msg:"买入 "+g.cn+"×"+n+"，花 "+cost+" 金龙。"};
      }catch(e){ return {ok:false, msg:"交易失败。"}; }
    };
    window.v92_tradeSell = function(good, n){
      try{
        window.v92_tradeInit();
        var g = window.TRADE_GOODS_V92 && TRADE_GOODS_V92[good];
        if(!g || !n || n<1) return {ok:false, msg:"没有这种货。"};
        var cur = S.trade.goods[good] || 0;
        if(cur < n) return {ok:false, msg:"没有那么多货。"};
        var city = S.curCity || "jiaohui";
        var p = window.v92_tradePrice(good, city, false);
        var gain = p * n;
        S.gold += gain;
        S.trade.goods[good] = cur - n;
        S.trade.total = (S.trade.total||0) + gain;
        S.trade.logs.push({day:S.day, city:city, good:good, n:n, gold:gain, type:"sell"});
        if(S.trade.logs.length>50) S.trade.logs.shift();
        if(window.v92_galleryMark){ try{ window.v92_galleryMark("good_"+good); }catch(e){} }
        return {ok:true, msg:"卖出 "+g.cn+"×"+n+"，得 "+gain+" 金龙。"};
      }catch(e){ return {ok:false, msg:"交易失败。"}; }
    };
    /* /g2inj:engine/ G-N2 收集图鉴（标记钩子 + 面板；S.gallery 独立键） */
    window.v92_galleryMark = function(key, label){
      try{
        if(!S.gallery) S.gallery = {};
        if(key && !S.gallery[key]){ S.gallery[key] = {label: label || key, day: S.day || 1, got: 1}; }
        return true;
      }catch(e){ return false; }
    };
    window.v92_openGalleryPanel = function(){
      try{
        if(!S.gallery) S.gallery = {};
        var old = document.getElementById('v92-gallery-panel');
        if(old){ old.parentNode.removeChild(old); }
        var cats = {good:'货物', place:'地点', npc:'人物', event:'事件', other:'其他'};
        var secs = [];
        for(var c in cats){
          if(!cats.hasOwnProperty(c)) continue;
          var items = [];
          for(var k in S.gallery){
            if(!S.gallery.hasOwnProperty(k)) continue;
            if(k.indexOf(c+'_')!==0) continue;
            var it = S.gallery[k];
            items.push('<span style="display:inline-block;margin:3px 6px 3px 0;padding:3px 10px;background:rgba(168,132,42,.1);border:1px solid rgba(168,132,42,.35);border-radius:10px;font-size:13px;" title="第 '+it.day+' 日收集">'+it.label+'</span>');
          }
          if(items.length){
            secs.push('<div style="margin-top:10px;"><div style="font-size:13px;font-weight:600;color:#8a6410;margin-bottom:4px;">'+cats[c]+' · '+items.length+'</div><div>'+items.join('')+'</div></div>');
          }
        }
        var total = 0;
        for(var k2 in S.gallery){ if(S.gallery.hasOwnProperty(k2)) total++; }
        var d = document.createElement('div');
        d.id = 'v92-gallery-panel';
        d.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:560px;max-width:92vw;max-height:80vh;overflow:auto;background:#fdf9ee;border:2px solid #a8842a;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.4);z-index:9999;padding:16px 20px;font-family:inherit;';
        d.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
          + '<div style="font-size:18px;font-weight:600;">📖 收集图鉴 · 共 '+total+' 条</div>'
          + '<button class="opt" onclick="var p=document.getElementById(\'v92-gallery-panel\');if(p)p.parentNode.removeChild(p);">✕ 关闭</button></div>'
          + '<div style="font-size:13px;color:#666;line-height:1.7;">见过的专名、到过的城市、经手的货物、亲历的事件都会收进来。收集是阅历，阅历是命数。</div>'
          + (secs.length ? secs.join('') : '<div style="color:#999;margin-top:10px;">尚未收集任何条目。去交易、去旅行、去听闻。</div>');
        document.body.appendChild(d);
        if(window.v67_busyClear){ try{ window.v67_busyClear(); }catch(e){} }
        return d;
      }catch(e){ return null; }
    };
    /* /g3inj:engine/ G-N3 数值台阶（只读参考层：战力评级 + 区域分级；不改判定公式） */
    window.v92_tierInfo = function(){
      try{
        var sum = 0;
        var keys = ["STR","CON","AGI","INT","SPR","CHA","str","con","agi","int","spr","cha","atk","def","hp","mp"];
        for(var i=0;i<keys.length;i++){ var v = S[keys[i]]; if(typeof v === "number" && v>0) sum += v; }
        for(var lk in S){ if(lk.indexOf("lv_")===0 && typeof S[lk]==="number") sum += S[lk]; }
        var dayBonus = 0;
        if(S.day>=60) dayBonus += 10;
        if(S.day>=120) dayBonus += 15;
        if(S.day>=200) dayBonus += 25;
        if(S.day>=250) dayBonus += 15;
        if(S.day>=280) dayBonus += 20;
        var anchorBonus = 0;
        if(S.anchors && typeof S.anchors === "object" && typeof S.anchors.length === "number") anchorBonus += S.anchors.length*10;
        var score = sum + dayBonus + anchorBonus;
        var tier = 1;
        if(score>=330) tier=6; else if(score>=260) tier=5; else if(score>=200) tier=4; else if(score>=120) tier=3; else if(score>=60) tier=2;
        var tn = (window.TIER_NAMES_V92 && TIER_NAMES_V92[tier]) || {name:"青铜", ref:""};
        var next = (window.TIER_NAMES_V92 && TIER_NAMES_V92[tier+1]) ? TIER_NAMES_V92[tier+1].name : "已至顶点";
        return {score: Math.round(score), tier: tier, name: tn.name, ref: tn.ref, next: next};
      }catch(e){ return {score:0, tier:1, name:"青铜", ref:"", next:"黑铁"}; }
    };
    window.v92_openTierPanel = function(){
      try{
        var old = document.getElementById('v92-tier-panel');
        if(old){ old.parentNode.removeChild(old); }
        var info = window.v92_tierInfo();
        var rows = [];
        var rts = window.REGION_TIER_V92 || {};
        for(var rid in rts){
          if(!rts.hasOwnProperty(rid)) continue;
          var r = rts[rid];
          var reg = (window.REGIONS && REGIONS[rid]) ? REGIONS[rid].cn : rid;
          rows.push('<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 2px;border-bottom:1px solid rgba(0,0,0,.06);font-size:13px;line-height:1.6;">'
            + '<div style="flex:0 0 130px;"><b>'+reg+'</b></div>'
            + '<div style="flex:1;color:#666;font-size:12px;">'+r.desc+'</div>'
            + '<div style="flex:0 0 46px;text-align:center;">'+r.name+'</div></div>');
        }
        var refs = window.TIER_REF_V92 || [];
        var refRows = [];
        for(var j=0;j<refs.length;j++){ var tf=refs[j]; refRows.push('<div style="flex:1 1 130px;min-width:0;padding:8px;border:1px solid rgba(0,0,0,.08);border-radius:8px;margin:4px;"><div style="font-size:13px;font-weight:600;">'+TIER_NAMES_V92[tf.tier].name+'</div><div style="font-size:11px;color:#888;margin-top:2px;">攻 '+tf.atk+' / 防 '+tf.def+'</div><div style="font-size:12px;color:#666;margin-top:2px;">'+tf.note+'</div></div>'); }
        var d = document.createElement('div');
        d.id = 'v92-tier-panel';
        d.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:640px;max-width:92vw;max-height:84vh;overflow:auto;background:#fdf9ee;border:2px solid #a8842a;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.4);z-index:9999;padding:16px 20px;font-family:inherit;';
        d.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
          + '<div style="font-size:18px;font-weight:600;">⚔ 实力对照 · 战力 '+info.score+'</div>'
          + '<button class="opt" onclick="var p=document.getElementById(\'v92-tier-panel\');if(p)p.parentNode.removeChild(p);">✕ 关闭</button></div>'
          + '<div style="padding:10px 12px;background:rgba(168,132,42,.08);border:1px solid rgba(168,132,42,.3);border-radius:8px;margin-bottom:10px;">'
          + '<div style="font-size:16px;font-weight:700;color:#8a6410;">当前评级：'+info.name+'</div>'
          + '<div style="font-size:13px;color:#555;margin-top:4px;line-height:1.7;">'+info.ref+'</div>'
          + '<div style="font-size:12px;color:#888;margin-top:4px;">下一阶：'+info.next+'</div></div>'
          + '<div style="font-size:13px;font-weight:600;margin-bottom:4px;">九域难度（去更高处之前，先掂量自己）</div>'
          + rows.join('')
          + '<div style="font-size:13px;font-weight:600;margin:10px 0 4px;">战力参考（攻/防为量级示意，非判定公式）</div>'
          + '<div style="display:flex;flex-wrap:wrap;margin:-4px;">'+refRows.join('')+'</div>'
          + '<div style="font-size:12px;color:#999;margin-top:10px;line-height:1.6;">评级由属性、修行与见闻（day/七锚）推算，只作参考，不改任何判定。</div>';
        document.body.appendChild(d);
        if(window.v67_busyClear){ try{ window.v67_busyClear(); }catch(e){} }
        return d;
      }catch(e){ return null; }
    };
    window.v92_openTradePanel = function(){
      try{
        window.v92_tradeInit();
        var old = document.getElementById('v92-trade-panel');
        if(old){ old.parentNode.removeChild(old); }
        var city = S.curCity || "jiaohui";
        var m = (window.TRADE_MARKET && TRADE_MARKET[city]) || {mul:1.0, cn:"此地"};
        var goods = window.TRADE_GOODS_V92 || {};
        var rows = [];
        for(var gid in goods){
          if(!goods.hasOwnProperty(gid)) continue;
          var g = goods[gid];
          var buy = window.v92_tradePrice(gid, city, true);
          var sell = window.v92_tradePrice(gid, city, false);
          var hold = (S.trade.goods[gid] || 0);
          rows.push('<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 2px;border-bottom:1px solid rgba(0,0,0,.06);font-size:14px;line-height:1.6;">'
            + '<div style="flex:0 0 86px;"><b>'+g.cn+'</b></div>'
            + '<div style="flex:1;color:#666;font-size:12px;">'+g.desc+'</div>'
            + '<div style="flex:0 0 58px;text-align:right;">'+buy+'</div>'
            + '<div style="flex:0 0 58px;text-align:right;">'+sell+'</div>'
            + '<div style="flex:0 0 40px;text-align:center;">'+hold+'</div>'
            + '<div style="flex:0 0 118px;text-align:right;">'
            + '<button class="opt" style="padding:2px 8px;font-size:12px;" onclick="window.v92_tradeBuy(\''+gid+'\',1);window.v92_openTradePanel();">买1</button> '
            + '<button class="opt" style="padding:2px 8px;font-size:12px;" onclick="window.v92_tradeSell(\''+gid+'\',1);window.v92_openTradePanel();">卖1</button>'
            + '</div></div>');
        }
        var d = document.createElement('div');
        d.id = 'v92-trade-panel';
        d.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:660px;max-width:92vw;max-height:82vh;overflow:auto;background:#fdf9ee;border:2px solid #a8842a;border-radius:12px;box-shadow:0 12px 48px rgba(0,0,0,.4);z-index:9999;padding:16px 20px;font-family:inherit;';
        d.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'
          + '<div style="font-size:18px;font-weight:600;">🛒 商路 · '+m.cn+'</div>'
          + '<button class="opt" onclick="var p=document.getElementById(\'v92-trade-panel\');if(p)p.parentNode.removeChild(p);">✕ 关闭</button></div>'
          + '<div style="font-size:13px;color:#666;margin-bottom:10px;line-height:1.7;">行情每日随行市波动（±15%）；产地便宜、热需城抬价；银穗商路与天灾事件会扰动货价。金币 '+S.gold+' 金龙 · 累计利润 '+((S.trade.total||0))+' 金龙</div>'
          + '<div style="display:flex;font-size:12px;color:#888;padding:4px 2px;border-bottom:1px solid rgba(0,0,0,.1);">'
          + '<div style="flex:0 0 86px;">货物</div><div style="flex:1;">说明</div><div style="flex:0 0 58px;">买价</div><div style="flex:0 0 58px;">卖价</div><div style="flex:0 0 40px;">持有</div><div style="flex:0 0 118px;text-align:right;">操作</div></div>'
          + rows.join('')
          + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;"><div style="font-size:12px;color:#888;line-height:1.7;">倒买倒卖赚差价，是本大陆最古老的修行。交易记录会自动入图鉴。</div><button class="opt" onclick="window.v92_openGalleryPanel();">📖 收集图鉴</button></div>';
        document.body.appendChild(d);
        if(window.v67_busyClear){ try{ window.v67_busyClear(); }catch(e){} }
        return d;
      }catch(e){ return null; }
    };
window.v92_openWorldPanel = function(){
  try{
    if(typeof openModal!=="function") return;
    var box = document.createElement("div");
    box.className = "box";
    var lines = window.v92_worldSnapshot();
    var h = "<h2>🌍 世界局势</h2><p class='sub'>大陆上发生的事，不因你是否在场而停步。九域各有各的走向。</p>";
    for(var i=0;i<lines.length;i++){
      var cls = (lines[i].indexOf("◆")===0) ? "v92-ws-major" : "v92-ws-region";
      h += "<p style='margin:6px 0;line-height:1.7' class='"+cls+"'>"+lines[i]+"</p>";
    }
    var npcs = (typeof window.v92_npcStatusList==="function") ? window.v92_npcStatusList() : [];
    if(npcs && npcs.length){
      h += "<div style='margin-top:14px;border-top:1px solid var(--line,#2d4566);padding-top:10px'><b style='color:var(--gold,#e8c468)'>大陆人物动态</b><span class='mini' style='color:var(--dim)'>（共 "+npcs.length+" 位——他们在你视线之外，也在过日子）</span></div>";
      var _n = Math.min(npcs.length, 8);
      for(var _i=0;_i<_n;_i++){
        var _s = npcs[_i];
        h += "<p style='margin:6px 0;line-height:1.7'><b>"+(_s.name||"")+"</b> <span class='mini' style='color:var(--dim)'>"+(_s.mood||"")+"</span><br/><span style='color:var(--text)'>"+(_s.doing||"")+"</span></p>";
      }
    }
    h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>";
    box.innerHTML = h;
    openModal(box);
  }catch(e){ try{ console.log("[wn1:panel:err]",e); }catch(_){} }
};


/* ===== /A1inj:proffn/ A-1 个性化开局注入（只读钩子；序章前 3 节点各注入 1 段五维专属文本；S.flags.origin_profile_done 完成后零注入；开关 S.settings.originProfile） ===== */
window.__v91prof = window.__v91prof || {step:0, used:false, segs:null};
window.v91_originProfile = function(node, txt){
  try{
    if(!S||!S.settings||S.settings.originProfile===false) return null;
    if(!S.flags||S.flags.origin_profile_done) return null;
    const P=window.ORIGIN_PROFILE; if(!P||typeof P._build!=="function") return null;
    const isOrigin = (String(curNode||"").indexOf("origin_")===0) || (S.flags.prologueV27 && !window.__v91prof.used);
    if(!isOrigin) return null;
    const st=window.__v91prof;
    if(st.step<=0){ st.segs=P._build(S); if(!st.segs||!st.segs.length){ S.flags.origin_profile_done=true; return null; } }
    if(st.step>=st.segs.length){ S.flags.origin_profile_done=true; return null; }
    const inj=[st.segs[st.step]];
    st.step++; st.used=true;
    if(st.step>=st.segs.length) S.flags.origin_profile_done=true;
    return inj;
  }catch(e){ try{ console.log("[v91prof:err]",e); }catch(_){} return null; }
};
/* ===== /v91inj:memvar/ CM-2 状态感知文本变体（三形态：字符串数组 / ifFlag / ifRelation；向后兼容；不改选项与判定） ===== */
window.v91_resolveText = function(node){
  try{
    const raw=(typeof node.text==="function")?node.text():node.text;
    if(raw==null) return [];
    /* /v92inj:rec/ DEEP-1 递归变体解析：yes/no/default/ifFlag 值可为数组或嵌套对象（四态好感链）；数组行为与旧版逐字节一致，纯增强 */
    function _v91R(sg){
      if(sg==null) return null;
      if(Array.isArray(sg)||typeof sg==="string") return sg;
      if(typeof sg==="object"){
        if(sg.ifRelation&&S&&S.npcRelations){
          const r=sg.ifRelation, v=(S.npcRelations[r.npc]||0); let ok=false;
          if(r.op===">=") ok=v>=r.val; else if(r.op==="<=") ok=v<=r.val; else if(r.op===">") ok=v>r.val; else if(r.op==="<") ok=v<r.val; else if(r.op==="===") ok=v===r.val;
          return _v91R(ok?(r.yes!=null?r.yes:null):(r.no!=null?r.no:null));
        }
        if(sg.ifFlag&&S&&S.flags){
          const keys=Object.keys(sg.ifFlag);
          for(let i=0;i<keys.length;i++){ if(S.flags[keys[i]]&&sg.ifFlag[keys[i]]!=null){ const sub=_v91R(sg.ifFlag[keys[i]]); if(sub!=null) return sub; } }
        }
        if(sg.default!=null) return _v91R(sg.default);
        return null;
      }
      return sg;
    }
    /* 变体解析：node 级字段优先，其次 text 内嵌对象形态 */
    let seg=null;
    if(node.ifFlag&&S&&S.flags){
      const keys=Object.keys(node.ifFlag);
      for(let i=0;i<keys.length;i++){ if(S.flags[keys[i]]){ seg=_v91R(node.ifFlag[keys[i]]); break; } }
    }
    if(seg==null&&node.ifRelation&&S&&S.npcRelations){
      const r=node.ifRelation;
      const v=(S.npcRelations[r.npc]||0);
      let ok=false;
      if(r.op===">=") ok=v>=r.val;
      else if(r.op==="<=") ok=v<=r.val;
      else if(r.op===">") ok=v>r.val;
      else if(r.op==="<") ok=v<r.val;
      else if(r.op==="===") ok=v===r.val;
      seg=_v91R(ok?(r.yes||null):(r.no||null));
    }
    /* /A1inj:fivekeys/ A-1 五维状态变体（ifJob/ifIdeal/ifHobby/ifTalent/ifSubrace；与 ifFlag 同构，读 S 五维键；向后兼容零回归） */
    if(seg==null){
      const _kv=["ifJob","ifIdeal","ifHobby","ifTalent","ifSubrace"];
      const _sv=["job","ideal","hobby","talent","subrace"];
      for(let _i=0;_i<_kv.length;_i++){
        if(node[_kv[_i]]&&S&&S[_sv[_i]]!=null&&node[_kv[_i]][S[_sv[_i]]]!=null){ seg=_v91R(node[_kv[_i]][S[_sv[_i]]]); break; }
      }
    }
    if(seg!=null) return Array.isArray(seg)?seg:[seg];
    if(typeof raw==="string"||Array.isArray(raw)) return Array.isArray(raw)?raw:[raw];
    if(typeof raw==="object"){
      if(raw.ifFlag&&S&&S.flags){
        const keys=Object.keys(raw.ifFlag);
        for(let i=0;i<keys.length;i++){ if(S.flags[keys[i]]){ seg=_v91R(raw.ifFlag[keys[i]]); break; } }
      }
      if(seg==null&&raw.ifRelation&&S&&S.npcRelations){
        const r=raw.ifRelation;
        const v=(S.npcRelations[r.npc]||0);
        let ok=false;
        if(r.op===">=") ok=v>=r.val;
        else if(r.op==="<=") ok=v<=r.val;
        else if(r.op===">") ok=v>r.val;
        else if(r.op==="<") ok=v<r.val;
        else if(r.op==="===") ok=v===r.val;
        seg=_v91R(ok?(r.yes||null):(r.no||null));
      }
      /* /A1inj:fivekeys-raw/ A-1 五维状态变体（raw 对象内嵌形态，与 ifFlag/ifRelation 内嵌同构） */
      if(seg==null){
        const _kv=["ifJob","ifIdeal","ifHobby","ifTalent","ifSubrace"];
        const _sv=["job","ideal","hobby","talent","subrace"];
        for(let _i=0;_i<_kv.length;_i++){
          if(raw[_kv[_i]]&&S&&S[_sv[_i]]!=null&&raw[_kv[_i]][S[_sv[_i]]]!=null){ seg=_v91R(raw[_kv[_i]][S[_sv[_i]]]); break; }
        }
      }
      if(seg==null) seg=_v91R(raw.default||null);
      if(seg==null) return [];
      return Array.isArray(seg)?seg:[seg];
    }
    return [raw];
  }catch(e){ try{ console.log("[v91res:err]",e); }catch(_){} return (typeof node.text==="function")?[node.text()]:[node.text]; }
};
/* ===== /v91inj:sessfn/ CM-4 会话字数计数器（独立键不入存档；从最近决策点累计已渲染字数；≥3000 且到选项节点时提示暂存点） ===== */
window.__v91sess = window.__v91sess || {chars:0, sinceNode:null};
window.v91_sessReset = function(){
  try{ window.__v91sess.chars=0; window.__v91sess.sinceNode=curNode||null; }catch(e){}
};
window.v91_sessCount = function(txtArr){
  try{
    if(!window.__v91sess) window.__v91sess={chars:0,sinceNode:null};
    if(!S || !S.settings || S.settings.pagedReading===false){ /* 计数照常 */ }
    var s="";
    for(var i=0;i<txtArr.length;i++){ s+=(txtArr[i]==null?"":String(txtArr[i])); }
    window.__v91sess.chars += s.replace(/\s/g,"").length;
  }catch(e){}
};
window.v91_sessRender = function(node){
  try{
    var el=document.getElementById("story");
    if(!el) return;
    if(!window.__v91sess) window.__v91sess={chars:0,sinceNode:null};
    var c=window.__v91sess.chars||0;
    var row=document.createElement("div");
    row.style.cssText="font-size:12px;color:#8a8a8a;margin:10px 0 2px;opacity:.85;";
    var label="本段已读 "+c+" 字";
    var hasOpts = !!(node && node.options);
    if(hasOpts && c>=3000){ label += " · 这是一个自然的暂存点"; row.style.color="#a8842a"; }
    row.innerHTML = label;
    el.appendChild(row);
  }catch(e){}
};
/* ===== /sp3inj:arcfn/ SP-3 弧线生命周期推进（只读 node + 写 S.arcs；不触碰判定/writeNext/choose；stage 只增不减） ===== */
window.v91_arcState = function(){
  try{ if(!S) return {}; if(!S.arcs) S.arcs={}; return S.arcs; }catch(e){ return {}; }
};
window.v91_arcReset = function(){
  try{ S.arcs={}; }catch(e){}
};
window.v91_arcAdvance = function(node){
  try{
    if(!S) return; if(!S.arcs) S.arcs={};
    var BP=window.STORY_BLUEPRINT; if(!BP||!BP.nodeIndex) return;
    var rec=BP.nodeIndex[curNode]; if(!rec||!rec.arc) return;
    var arcId=rec.arc;
    var ar=null;
    for(var i=0;i<BP.arcs.length;i++){ if(BP.arcs[i].id===arcId){ ar=BP.arcs[i]; break; } }
    var want=0; /* 0=未开始 1=setup 2=rising 3=climax 4=resolution 5=closed */
    if(ar&&ar.stages){
      var st=ar.stages;
      function has(a){ return a&&a.length? a.indexOf(curNode)>=0 : false; }
      if(has(st.resolution)) want=4;
      else if(has(st.climax)) want=3;
      else if(has(st.rising)) want=2;
      else if(has(st.setup)) want=1;
      else if(rec.type==="main"||rec.type==="ending"||rec.type==="faction") want=Math.max(want,1);
    } else {
      if(rec.type==="main"||rec.type==="ending"||rec.type==="faction") want=1;
    }
    if(!want) return;
    var cur=S.arcs[arcId];
    if(!cur){ S.arcs[arcId]={s:want,st:S.day||1,ls:S.day||1}; }
    else {
      if(want>cur.s) cur.s=want;
      cur.ls=S.day||cur.ls;
    }
  }catch(e){ try{ console.log("[sp3arc:err]",e); }catch(_){} }
};

function writeNext(_v46f){
  renderTop(); renderStats();
  try{ if(window.v96_backPush) window.v96_backPush(curNode); }catch(e){} /* /v96inj:back/ C12 分支回退入栈（栈顶=当前节点） */
  const _wnT0 = Date.now();
  ChunkLoader.ensureNodeLoaded(curNode, function(){
    const node = (typeof N[curNode]==="function") ? N[curNode]() : N[curNode];
    if(!node){ try{ window.v67_busyClear(); }catch(e){} writePar("【此处剧情尚未展开。存档编号："+curNode+"】","noind flagline"); renderPerf.record(Date.now()-_wnT0); return; }
    if(node.place){ var _pl = typeof node.place==="function" ? node.place() : node.place; if(_pl) writePar("「"+_pl+"」","place"); }
    if(node.where){ var _wh = typeof node.where==="function" ? node.where() : node.where; if(_wh) writePar(_wh,"where"); }
    try{ v45_sceneTitle(node); }catch(e){}
    try{ v46_entryRender(node, _v46f); }catch(e){}
    var _txt = (typeof window.v91_resolveText==="function") ? window.v91_resolveText(node) : ((typeof node.text==="function") ? node.text() : node.text);
    if(!Array.isArray(_txt)){ _txt=[_txt]; }
    try{ window.v91_sessCount(_txt); }catch(e){}
    /* /pn2inj:weavehook/ P-N2 编织引用展开（§node_id 复用段落；递归≤3、防环、缺失原样提示） */
    try{ _txt = window.v92_expandWeave(_txt); }catch(e){}
    /* /v92inj:wxhook/ TQ-1 天气句注入（只读钩子；天气句排最前=环境先行；开关 S.settings.weatherLine；关闭时零注入） */
    try{ var _wx = window.v92_weatherLine(node); if(_wx){ _txt=[_wx].concat(_txt); } }catch(e){}
    /* /v92inj:lorehook/ UPG-01 世界书注入（只读钩子；设定片段排最前；开关 S.settings.lorebook；关闭时零注入） */
    try{ var _lr = window.v92_lorebook(node); if(_lr&&_lr.length){ _txt=_lr.concat(_txt); } }catch(e){}
    /* /v92inj:mem2hook/ UPG-02 记忆库注入（只读钩子；世界规则(LOREBOOK)之后、事件记忆(账本Top-K)随后；开关 S.settings.memoryBank；关闭时零注入） */
    try{ var _mb = window.v92_memoryBank(node); if(_mb&&_mb.length){ _txt=_mb.concat(_txt); } }catch(e){}
        /* /upg14inj:hookscan/ UPG-14 全局钩子扫描（节点切换后；事件池新增触发不改变既有判定） */
    try{ if(window.v92_scanHooks) v92_scanHooks(); }catch(e){}
    try{ if(window.v92_scanLedgerReminder) v92_scanLedgerReminder(); }catch(e){}
    /* /upg17inj:cron/ UPG-17 编年史：节点匹配记录 + 结局回顾注入 */
    try{ if(window.v92_chronicleCheck) v92_chronicleCheck(node); }catch(e){}
    /* /upg16inj:fantasyhook/ UPG-16 阵营感知flag维护 + 种族特长首播 + 职业事件扫描 */
    try{ if(window.v92_campFlags) v92_campFlags(); }catch(e){}
    try{ if(window.v92_raceShown) v92_raceShown(); }catch(e){}
    try{ if(window.v92_scanJobEvents) v92_scanJobEvents(); }catch(e){}
    /* /upg17inj:review/ UPG-17 结局回顾（ending_* 节点渲染时，按发现顺序生成编年史回顾；非结局零注入） */
    try{
      if(window.v92_chronicleReview && typeof node!=='undefined' && node && String(node.id||"").indexOf("ending_")===0){
        var _cv = v92_chronicleReview();
        if(_cv && _cv.length){ _txt = _cv.concat(_txt); }
      }
    }catch(e){}
    /* /v91inj:memhook/ CM-1 记忆注入（只读钩子；分页与非分页共用此 _txt；关闭开关时原样透传） */
    try{ var _mem = window.v91_memoryInjection(node,_txt); if(_mem&&_mem.length){ _txt=_mem.concat(_txt); } }catch(e){}
    /* /n1inj:stance/ N-1 立场感知句注入（只读；无立场时不注入） */
    try{ var _st = window.v93n1_stanceLine ? window.v93n1_stanceLine() : null; if(_st){ _txt.push(_st); } }catch(e){}
    /* /n2inj:dialmem/ N-2 对话级记忆注入（只读；同日节流一次） */
    try{ var _dm = window.v93n2_dialogueLine ? window.v93n2_dialogueLine() : null; if(_dm && (!S || S._lastDmDay!==S.day)){ if(S) S._lastDmDay=S.day; _txt.push(_dm); } }catch(e){}
    /* /n3inj:echo/ N-3 结局回响注入（仅 ending 节点；只读） */
    try{ if(node && node.tag==="ending"){ var _ee = window.v93n3_endingEcho ? window.v93n3_endingEcho() : null; if(_ee){ _txt.push(_ee); } } }catch(e){}
    /* /n5inj:npclife/ N-5 NPC 独立近况注入（只读；同日节流一次，不抢记忆/立场位） */
    try{ var _nl = window.v93n5_npcLifeLine ? window.v93n5_npcLifeLine() : null; if(_nl && (!S || S._lastNlDay!==S.day)){ if(S) S._lastNlDay=S.day; _txt.push(_nl); } }catch(e){}
    /* /n7inj:conflict/ N-7 冲突事件层注入（独立池；每事件触发一次，可结算轻量 effects） */
    try{ var _cf = window.v93n12_conflictLine ? window.v93n12_conflictLine() : null; if(_cf){ _txt.push(_cf); } }catch(e){}
    /* /n8inj:scene/ N-8 名场面追加（按节点前缀命中，只追加不改原文） */
    try{ var _sc = window.v93n8_sceneLine ? window.v93n8_sceneLine(node) : null; if(_sc){ _txt.push(_sc); } }catch(e){}
    /* /n8inj:allusion/ N-8 典故注入（按 place 匹配；同日节流） */
    try{ var _al = window.v93n15_allusionLine ? window.v93n15_allusionLine(node) : null; if(_al){ _txt.push(_al); } }catch(e){}
    /* /n8inj:mood/ N-8 情绪色调注入（mood 高分时；同日节流） */
    try{ var _md = window.v93n16_moodLine ? window.v93n16_moodLine() : null; if(_md){ _txt.push(_md); } }catch(e){}
    /* /g1inj:render/ G-1 伤口状态行注入（只读；S.wounds 非空时显示；空时零注入） */
    try{ var _wnd = window.v93g1_woundLine(node); if(_wnd&&_wnd.length){ _txt=_wnd.concat(_txt); } }catch(e){}
    /* /g3inj:render/ G-3 城市作息句注入（只读；arrive_* 节点按城返回；空时零注入） */
    try{ var _hrs = window.v93g3_hoursLine(node); if(_hrs&&_hrs.length){ _txt=_hrs.concat(_txt); } }catch(e){}
    /* /g4inj:render/ G-4 渐进教学提示注入（只读；按 day 阈值首次提示；读完零注入） */
    try{ var _tip = window.v93g4_tipLine(node); if(_tip&&_tip.length){ _txt=_tip.concat(_txt); } }catch(e){}
    /* /g6inj:render/ G-6 关系网回指注入（只读；NPC_NET 命中+好感阈值；空时零注入） */
    try{ var _nw = window.v93g6_npcNetLine(node); if(_nw&&_nw.length){ _txt=_nw.concat(_txt); } }catch(e){}
    /* /wn3inj:npchook/ W-N3 NPC 状态回指注入（只读钩子；顺序在记忆注入之后，好感<30 与 CM-1 互斥） */
    try{ var _nw = window.v92_npcWeave(node,_txt); if(_nw&&_nw.length){ _txt=_nw.concat(_txt); } }catch(e){}
    /* /A1inj:profhook/ A-1 个性化开局注入（只读钩子；顺序在记忆注入之后，五维开场文本优先展示） */
    try{ var _prof = window.v91_originProfile(node,_txt); if(_prof&&_prof.length){ _txt=_prof.concat(_txt); } }catch(e){}
    try{ window.v91_arcAdvance(node); }catch(e){} /* /sp3inj:archook/ SP-3 弧线推进（只读注入点） */
    /* /pn1inj:threadhook/ P-N1 线程状态机登记（只读钩子：记录当前节点所属叙事线程的进度/日/次数） */
    try{ window.v92_threadTick(node); }catch(e){}
    /* /ws1inj:echohook/ WS-1 世界状态回响（只读钩子；主线枢纽节点渲染收尾注入 1 句；开关 S.settings.worldEcho；关闭时零注入） */
    try{ var _ws = window.v93_worldEcho(node); if(_ws&&_ws.length){ _txt=_txt.concat(_ws); } }catch(e){}
    /* /v93npc:hook/ NM-6 NPC 记忆回指（只读注入；开关 S.settings.npcMemory） */
    try{ var _npc = window.v93_npcMemoryHook(node); if(_npc&&_npc.length){ _txt=_txt.concat(_npc); } }catch(e){}
    /* /e2inj:echohook/ E-2 多年回响注入（只读钩子；echoAt 命中+flag 置位→带出回响句；开关 S.settings.echoLine；同节点同 flag 会话内一次） */
    /* /s3inj:conf/ S-3 双高属性声音冲突（只读钩子；单节点一次；属性差≤5 才触发） */
    try{ var _cf = window.v93s1_conflictLine ? window.v93s1_conflictLine() : null; if(_cf&&_cf.length){ _txt=_txt.concat(_cf); } }catch(e){}
    /* /s1inj:voice/ S-1 人格声音注入（只读钩子；14 声音按情境插话；开关 S.settings.voiceLine；同节点会话内一次） */
    try{ var _vo = window.v93s1_voiceLine ? window.v93s1_voiceLine(node,_txt) : null; if(_vo&&_vo.length){ _txt=_txt.concat(_vo); } }catch(e){}
    /* /t1inj:thought/ T-1 心念殿进度推进（只读 tick；internalizing 概念每日 +1，满 cost 结算 buff/debuff） */
    try{ window.v93t_thoughtTick(); }catch(e){}
    /* /t2inj:thoughtline/ T-2 心念殿专属正文注入（只读；已内化概念按 place 关键词注入 1 句） */
    try{ var _tl = window.v93t_thoughtLine ? window.v93t_thoughtLine(node) : null; if(_tl&&_tl.length){ _txt=_txt.concat(_tl); } }catch(e){}
    /* /l1inj:npcclue/ L-2 线索进度 NPC 回应（只读；关键人物场景按线索命中数注入 1 句） */
    try{ var _lc = window.v93l_npcClue ? window.v93l_npcClue(node) : null; if(_lc&&_lc.length){ _txt=_txt.concat(_lc); } }catch(e){}
    /* /p1inj:judge/ P-1 情感搭档·无声评判（只读；战斗/第三哨场景按 tie 好感注入神态+记忆） */
    try{ var _pj = window.v93p_judge ? window.v93p_judge(node) : null; if(_pj&&_pj.length){ _txt=_txt.concat(_pj); } }catch(e){}
    try{ var _ec = window.v93e2_echoLine(node); if(_ec&&_ec.length){ _txt=_txt.concat(_ec); } }catch(e){}
    /* ===== /e2inj:fn/ E-2 多年回响引擎（只读；数据源 window.ECHO_TRACKS；不写任何状态） ===== */
    window.v93e2_echoLine = function(node){
      try{
        if(!S || !S.settings || S.settings.echoLine===false) return null;
        var nid = (node && node.id) ? String(node.id) : (typeof curNode!=="undefined" && curNode ? String(curNode) : null);
        if(!nid) return null;
        var E = window.ECHO_TRACKS || [];
        if(!E || !E.length) return null;
        if(!window.__e2done) window.__e2done = {};
        var out = [];
        for(var i=0;i<E.length;i++){
          var e = E[i];
          if(!e || !e.flag || !e.echoAt || e.echoAt.indexOf(nid)<0) continue;
          if(!S.flags || !S.flags[e.flag]) continue;
          var k = nid + "::" + e.flag;
          if(window.__e2done[k]) continue;
          window.__e2done[k] = 1;
          if(e.tpl && e.tpl.length){ out.push(e.tpl[(S.day||0) % e.tpl.length]); }
          if(out.length>=2) break;
        }
        return out;
      }catch(err){ return null; }
    };
    if(window.v45_shouldPaginate(node)){
      try{ window.v67_busyClear(); }catch(e){} /* 分页节点无选项，立即解锁防死锁 */
      window.__v45ctx={node:node,txt:_txt,page:0};
      v45_renderPage(window.__v45ctx);
      try{ window.v96_backRender(); }catch(e){} /* /v96inj:backbtn/ C12 回退按钮（分页路径） */
      try{ window.v91_sessRender(node); }catch(e){}
      renderPerf.record(Date.now()-_wnT0);
      return;
    }
    for(const t of _txt) writePar(t);
    RenderBatch.flush();
    try{ window.v96_backRender(); }catch(e){} /* /v96inj:backbtn2/ C12 回退按钮（普通路径） */
    try{ window.v92_hlInit(); window.v92_ambCSS(); }catch(e){}
    try{ window.v92_applyAmbience(); }catch(e){}
    try{ window.v93_ambienceSync(); }catch(e){}
    try{ if(window.ambScene){ var _ap=(typeof curNode!=="undefined"&&curNode&&N[curNode]&&N[curNode].place)?String(N[curNode].place):""; window.ambScene(_ap); } }catch(e){}
    try{ v44_afterRender(); }catch(e){}
    try{ v45_afterNode(node); }catch(e){}
    try{ window.v91_sessRender(node); }catch(e){}
    if(node.auto){ // 自动跳转
      try{ window.v67_busyClear(); }catch(e){} /* auto 跳转不依赖点击，立即解锁 */
      const a = node.auto;
      v61_timer(()=>{ if(a.go){curNode=a.go; writeNext();} }, a.delay||900, 'trans'); /* /v61inj:perf-timerB/ */
      renderPerf.record(Date.now()-_wnT0);
      return;
    }
    try{ window.v92_achTick(node); }catch(e){}
    var _btlGo = false;
    try{ if(node && node.battle===true && window.v93_battle && typeof window.v93_battle.start==='function'){ _btlGo = window.v93_battle.start(node); } }catch(e){}
    if(!_btlGo){
    showOptions(node);

    if(curNode && curNode.indexOf("arrive_")===0 && S && S.loc) renderCityActs();
    setTimeout(function(){ if(typeof v34_animateOptions === 'function') v34_animateOptions(); }, 50);
    }
    renderPerf.record(Date.now()-_wnT0);
  });
}
function choose(opt){
  try{ if(window.__v67Busy){ try{ flashMsg("⏳ 处理中，请稍候…"); }catch(e){} return; } }catch(e){}
  try{ window.v67_busySet(); }catch(e){}
  try{ window.v91_sessReset(); }catch(e){}
  try{ window.v67_uiFeedback(opt); }catch(e){}
  if(opt.run){ opt.run(); try{ window.v67_busyClear(); }catch(e){} return; }
  const _v46f = curNode;
  S.choices.push(curNode);
  if(opt.echo){ try{ writePar(opt.echo,"inner-voice v46-echo"); }catch(e){} }
  const node = N[curNode];
  let isOk = true; // 无判定选项默认视为成功路径
  if(opt.time) advanceDays(opt.time);
  // v27 兼容：timeCost写在effect中时自动提取
  if(opt.effect && opt.effect.timeCost && !opt.timeCost){
    opt.timeCost = opt.effect.timeCost;
    delete opt.effect.timeCost;
  }
  // v26 实时时间系统：timeCost字段
  if(opt.timeCost && typeof advanceTimeV26 === 'function'){
    if(opt.timeCost === "1period") advanceTimeV26(1);
    else if(opt.timeCost === "1day") advanceTimeV26(4);
    else if(opt.timeCost === "3days") advanceTimeV26(12);
    else if(opt.timeCost === "7days") advanceTimeV26(28);
    else if(opt.timeCost === "30days") advanceTimeV26(120);
    else if(opt.timeCost === "1night") advanceTimeV26(1);
    else if(typeof opt.timeCost === "string" && opt.timeCost.startsWith("travel:")){
      const dist = parseInt(opt.timeCost.split(":")[1]) || 100;
      const days = Math.max(1, Math.ceil(dist / 100));
      advanceTimeV26(days * 4);
    }
  }
  if(opt.effect && !opt.effects) opt.effects = opt.effect; // 兼容effect单数写法
  if(opt.check){
    const t = effTarget(opt);
    let roll = rollD100();
    if(window.__v52reroll){ try{ const _r2 = rollD100(); if(_r2>roll) roll=_r2; if(window.__v52mods) window.__v52mods.push('重掷取高'); }catch(e){} window.__v52reroll = false; }
    const lvl = tierOf(roll,t);
    S.dice.push({node:curNode,opt:opt.t,roll,target:t,lvl});
    writeDice(roll,t,lvl);
    const tier = opt.tier||{};
    var _tc=tierArr(tier,"crit"), _tok=tierArr(tier,"ok"), _tf=tierArr(tier,"fail"), _tcf=tierArr(tier,"critfail");
    _llmPending = [];
    let tierTextRaw = [];
    if(lvl==="crit" && _tc) _tc.forEach(p=>{const el=writePar(p);markLLMPending(el);tierTextRaw.push(typeof p==="string"?p:"");});
    else if((lvl==="extreme"||lvl==="hard"||lvl==="normal") && _tok) {
      if(lvl!=="normal" && tier.okLead){const el=writePar(tier.okLead(lvl));markLLMPending(el);tierTextRaw.push(typeof tier.okLead==="function"?tier.okLead(lvl):"");}
      _tok.forEach(p=>{const el=writePar(p);markLLMPending(el);tierTextRaw.push(typeof p==="string"?p:"");});
    }
    else if(lvl==="fail" && _tf) _tf.forEach(p=>{const el=writePar(p);markLLMPending(el);tierTextRaw.push(typeof p==="string"?p:"");});
    else if(lvl==="critfail" && _tcf) _tcf.forEach(p=>{const el=writePar(p);markLLMPending(el);tierTextRaw.push(typeof p==="string"?p:"");});
    else if(_tok) _tok.forEach(p=>{const el=writePar(p);markLLMPending(el);tierTextRaw.push(typeof p==="string"?p:"");});
    // LLM文笔增强
    if(LLM_CONFIG.enabled && LLM_CONFIG.endpoint && LLM_CONFIG.apiKey && tierTextRaw.length>0){
      const fp = makeFactPack(curNode+" · "+opt.t, tierTextRaw.join(" "), applyEffects(opt.effects||{},null)||"", lvl);
      enhanceText(fp, curNode, lvl, roll);
    }
    // 判定余波
    let res = applyEffects(opt.effects||{},null);
    if(lvl==="crit" && opt.onCrit) res = (res?res+"<br>":"")+applyEffects(opt.onCrit||{},null);
    if(lvl==="critfail" && opt.onCritFail) res = (res?res+"<br>":"")+applyEffects(opt.onCritFail||{},null);
    if(lvl==="normal"||lvl==="hard"||lvl==="extreme") if(opt.onOk) res = (res?res+"<br>":"")+applyEffects(opt.onOk||{},null);
    if(lvl==="fail" && opt.onFail) res = (res?res+"<br>":"")+applyEffects(opt.onFail||{},null);
    if(res) writePar(res,"res");
    // 成功等级→分支
    const isOk = (lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal");
    const goId = isOk ? (opt.go||(opt.fail||null)) : (opt.fail||opt.go||null);
    if(opt.loseIfFail && !isOk){ S.gold=Math.max(0,S.gold-opt.loseIfFail); }
    curNode = goId;
  } else {
    // v48.9 材料前置检查（opt.mats）：材料不足则提示并停留
    if(opt.mats){ try{ var _mk, _mm=opt.mats, _need=[]; for(_mk in _mm){ if(!S.mats[_mk]||S.mats[_mk]<_mm[_mk]) _need.push(_mk+"×"+(_mm[_mk]-(S.mats[_mk]||0))); } if(_need.length){ if(window.flashMsg) try{ flashMsg("还缺"+_need.join("、")+"……"); }catch(e){} try{ window.v67_busyClear(); }catch(e){} return; } }catch(e){} }
    if(opt.effects){ const res = applyEffects(opt.effects,null); if(res) writePar(res,"res"); }
    if(opt.tier && opt.tier.ok) opt.tier.ok.forEach(p=>writePar(p)); // 无判定选项也有叙事
    if(opt.go){ curNode = opt.go; }
  }
  if(opt.after) opt.after();
  if(opt.afterOk && isOk) opt.afterOk();
  if(opt.afterFail && !isOk) opt.afterFail();
  renderTop(); renderStats();
  if(S.hp<=0 && !S.ending){ try{ window.v67_busyClear(); }catch(e){} handleDeath(); return; }
  if(S.san<=0 && !S.ending){ try{ window.v67_busyClear(); }catch(e){} showEnding("madness"); return; }
  try{ v46_missedCompensation(); }catch(e){}
  try{ var _tr = v46_genTransition(_v46f, curNode, !!(opt.time||opt.timeCost)); if(_tr && _tr.length){ for(var _ti=0;_ti<_tr.length;_ti++){ writePar(_tr[_ti],"v46-trans"); } } }catch(e){}
  writeNext(_v46f);
}
function handleDeath(){
  writePar("黑暗漫上来。马蹄声、风声、远处的钟声，都远了。");
  // 临终视野（叙事性，非惩罚）：走马灯按职业分形
  var _dl = S.job||"旅人";
  if(_dl==="商人"){ writePar("临闭眼前的恍惚里，你看见自由港的灯火，一长串挂在海面上，像谁把账本撕了撒进水里。你想起第一笔生意赚的三个铜板，铜板在手里焐得发热。","noind"); }
  else if(_dl==="学者"){ writePar("恍惚间，你看见学院图书馆那盏塔灯，黄澄澄地悬在雾里。你想起老教授说过的话：书页会黄，字不会。你伸手想摸一摸书脊，指尖却落进一片凉。","noind"); }
  else if(_dl==="战士"){ writePar("临睡前你看见自己第一次握刀——刀比人还高，刀柄磨得发亮。你想起铁门关城头的风，雪粒子打在脸上，生疼，可那会儿你一点不怕。","noind"); }
  else { writePar("走马灯在黑暗里转起来：自由城邦的雾、北境的雪、沙漠的黑沙、精灵的银林——你走过的地方，一处处亮起来，又一处处暗下去。","noind"); }
  writePar("有个声音在很远的地方喊你，像隔着一整条河。","noind");
  writePar("……再醒来时，你躺在某个小镇的医馆里。药味呛鼻，伤口被粗糙地包扎过。守夜的老医者说，是好心人把你从路边捡回来的。","noind");
  const lose = Math.floor(S.gold*0.3);
  S.gold-=lose;
  for(const k in S.mats) S.mats[k]=Math.floor(S.mats[k]/2);
  S.hp = Math.round(maxHp()*0.5);
  S.wound=1;
  S.day+=10; S.date=fmtDate(S.day);
  writePar("（损失金币 "+lose+"，材料折半，修养十日。）","noind flagline");
  const vis = Object.keys(S.visited).filter(k=>k.includes("_"));
  const dest = vis.length? vis[vis.length-1] : "free_jiaohui";
  S.loc=dest; S.region=dest.split("_")[0];
  S.fatigue=Math.max(S.fatigue,6);
  curNode = "arrive_generic";
  renderTop(); renderStats(); renderMapPanel();
  writeNext();
}
function advanceDays(n){
  S.day += n; S.date = fmtDate(S.day);
  // 疲劳恢复/累积
  if(n>=4 && S.fatigue<4) S.fatigue=4;
  S.fatigue = Math.max(0, S.fatigue - (n>=2?1:0));
  if(S.wound>0 && n>=2) S.wound=0;
  if(S.disease && n>=4) S.disease=false;
  checkWorldEvents();
  try{ if(window.v93_marketTick) window.v93_marketTick(n); }catch(e){}
  try{ if(window.v93_newsTick) window.v93_newsTick(); }catch(e){}
  try{ if(window.v93_festivalTick) window.v93_festivalTick(); }catch(e){}
  try{ if(window.v93g1_woundTick) window.v93g1_woundTick(); }catch(e){}
  try{ if(window.v93g5_chainTick) window.v93g5_chainTick(); }catch(e){}
  try{ if(window.LW_tick) window.LW_tick(n); }catch(e){} /* /lwinj:tick/ LW 世界时钟/回响/势力推进 */
}
function checkWorldEvents(){
  const w = S.world;
  S.worldQueue = S.worldQueue||[];
  if(!w.purge && S.day>=WORLD_EVENTS.purge.day){
    w.purge=true; S.worldQueue.push("purge"); logMsg("世界事件：净化令扩散（第"+S.day+"日）");
    v46_maybeMissed("purge", "圣城那边，净化令又严了。街上抓人，连小孩子都躲着走。", ["holy_","church_","city_holy"]);
  }
  if(!w.silver && S.day>=WORLD_EVENTS.silver.day){
    w.silver=true; S.worldQueue.push("silver"); logMsg("世界事件：银穗商路危机（第"+S.day+"日）");
    v46_maybeMissed("silver", "银穗商路出了岔子，几船货沉了，几家大商号都红了眼。", ["h_trade_","south_","city_south"]);
  }
  if(!w.seal && S.day>=WORLD_EVENTS.seal.day){
    w.seal=true; S.worldQueue.push("seal"); logMsg("世界事件：深渊封印松动（第"+S.day+"日）");
    v46_maybeMissed("seal", "北边有人说起深渊的动静——封印好像又松了一分。", []);
  }
  if(!w.academy && S.day>=WORLD_EVENTS.academy.day){
    w.academy=true; S.worldQueue.push("academy"); logMsg("世界事件：学院暗流（第"+S.day+"日）");
    v46_maybeMissed("academy", "学院里头不太平，几个派系闹得厉害，连教员都被卷了进去。", ["academy_"]);
  }
  if(!w.orc && S.day>=WORLD_EVENTS.orc.day){
    w.orc=true; S.worldQueue.push("orc"); logMsg("世界事件：兽人南下（第"+S.day+"日）");
    v46_maybeMissed("orc", "草原上的兽人往南边动了。边境几个村子，连夜搬了家。", ["north_","h_faction_north"]);
  }
  /* v76 P2-2 扩展事件池（默认空数组，零影响；开发者追加即生效） */
  try{
    var _ext = window.EVENT_POOL_EXT||[];
    for(var _ei=0;_ei<_ext.length;_ei++){
      var _ev=_ext[_ei], _key="ev_"+_ev.id;
      if(!w[_key] && S.day>=_ev.day){
        w[_key]=true; S.worldQueue.push(_ev.id);
        if(window.v92_galleryMark) v92_galleryMark("event_"+_ev.id, _ev.id);
        logMsg("世界事件："+_ev.text+"（第"+S.day+"日）");
        if(_ev.node){ v46_maybeMissed(_ev.id, _ev.text, []); }
      }
    }
  }catch(_e){}
  try{ if(window.v93_newsTick) window.v93_newsTick(); }catch(_e){}
}

/* ============ 日志 ============ */
const logs=[]; window.logs = logs; /* /v61inj:logsfix/ */
function logMsg(m,cls){ logs.unshift({m,cls}); }
let __v74LogFilter = "all"; window.__v74LogFilter = __v74LogFilter; /* /v74ui:log/ */
function renderLog(){
  let h="<h3>📜 冒险日志</h3>";
  const _cat = {"all":"全部","l":"修行","warn":"事件","g":"系统"};
  h+="<div class='v74-log-tabs'>";
  for(const k in _cat){
    h+="<button class='btn v74-log-tab "+((typeof window.__v74LogFilter==="string"&&window.__v74LogFilter===k)?"on":"")+"' onclick='window.__v74LogFilter=\""+k+"\"; v74_refreshLog()'>"+_cat[k]+"</button>";
  }
  h+="</div>";
  const _filt = (typeof window.__v74LogFilter === "string") ? window.__v74LogFilter : "all";
  const _all = logs.slice(0,80);
  const _f = _filt==="all" ? _all : _all.filter(l=>{
    const c=l.cls||"";
    if(_filt==="l") return c==="l"||c==="ok";
    return c===_filt;
  });
  h+="<div class='mini' style='margin-bottom:6px'>"+_f.length+" 条记录</div>";
  for(const l of _f) h += "<div class='"+ (l.cls||"") +"'>"+esc(l.m)+"</div>";
  if($("log")) $("log").innerHTML=h;
  return h;
}
/* /v74ui:log/ 筛选后刷新 modal 内日志面板（保留关闭按钮） */
function v74_refreshLog(){
  try{
    var mbox = document.querySelector("#modal .v68-panel-box[data-panel='log']");
    if(!mbox) return;
    var html = renderLog();
    mbox.innerHTML = html + "<div class='panel-footer'><button class='btn' onclick='togglePanel(\"log\")'>关 闭</button></div>";
  }catch(e){ console.error('[v74_refreshLog]', e); }
}
window.v74_refreshLog = v74_refreshLog;

/* ============ 存档 ============ */
function saveGame(){
  try{
    S.choices=[]; // 不存冗长历史，防超限
    S.curNode = curNode;
    S.saveVersion = 48; /* /v58eng:savever/ */
    S.slotId = S.slotId || "slot1";
    S.saveTime = Date.now();
    StorageKit.save(S);
    logMsg("已存档（第"+S.day+"日）","g");
    flashMsg("已存档");
  }catch(e){ flashMsg("存档失败："+e.message); }
}
/* ============ v2 建号：九步捏人 ============ */
function talentPoolBonus(){ return S.talent&&TALENTS[S.talent]?TALENTS[S.talent].pool:0; }
function showCreation(){
  pool = 300 + talentPoolBonus() - (S.attrs.SPR+S.attrs.STR+S.attrs.AGI+S.attrs.INT+S.attrs.CHA+S.attrs.CON);
  const box = document.createElement("div");
  box.className="box";
  box.innerHTML = creationHTML();
  openModal(box);
  bindCreation();
}
function selCard(key,obj,label){
  let h="<button class='sel-card' data-"+label+"='"+key+"'>";
  h+="<span class='sc-t'>"+obj.cn+"</span>";
  h+="<span class='sc-d'>"+(obj.desc||"")+"</span>";
  if(obj.gold!==undefined) h+="<span class='sc-m' style='color:"+(obj.gold>=0?"var(--ok)":"var(--bad)")+"'>"+(obj.gold>=0?"+":"")+obj.gold+"金币</span>";
  if(obj.attrs&&Object.keys(obj.attrs).length){
    const s=Object.keys(obj.attrs).map(k=>ATTR_CN[k]+"+"+obj.attrs[k]).join(" ");
    h+="<span class='sc-m' style='color:var(--cyan)'>"+s+"</span>";
  }
  if(obj.skills&&Object.keys(obj.skills).length){
    const s=Object.keys(obj.skills).map(k=>skillCn(k)+(obj.skills[k]>=0?"+":"")+obj.skills[k]).join(" ");
    h+="<span class='sc-m' style='color:var(--gold2)'>"+s+"</span>";
  }
  if(obj.startShort) h+="<span class='sc-s'>"+obj.startShort+"</span>";
  h+="</button>";
  return h;
}
function creationHTML(){
  let h="<h2>无名旅者 · 建号</h2>";
  h+="<p class='sub'>艾尔达历4037年，群雄割据之世。你从灰港的渡船上走下来，身无长物，唯有一身尚未定型的天资。你叫——</p>";
  h+="<div class='mt10'><input type='text' id='in-name' maxlength='12' placeholder='输入你的名讳' value='"+esc(S.name||"")+"'></div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>性别</h3><div class='sel-row'>";
  for(const g of ["男","女","隐秘"]){
    h+="<button class='sel-card small' data-gender='"+g+"' "+(S.gender===g?"style='border-color:var(--gold)'":"")+">"+g+"</button>";
  }
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>种族 · 七选一（决定血统天赋）</h3><div class='sel-row'>";
  for(const rk in RACES){
    const r=RACES[rk];
    h+="<button class='sel-card' data-race='"+rk+"' "+(S.race===rk?"style='border-color:var(--gold);color:var(--gold2)'":"")+">";
    h+="<span class='sc-t'>"+r.ic+" "+r.cn+"</span><span class='sc-d'>"+r.desc+"</span>";
    h+="</button>";
  }
  h+="</div>";
  h+="<div class='sel-row' id='subrace-box'>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>亚种族 · "+(RACES[S.race]?RACES[S.race].cn:"")+"（细选血统，决定属性/特性）</h3>";
  for(const sk in SUBRACES){
    const sb=SUBRACES[sk];
    if(sb.race!==S.race) continue;
    h+="<button class='sel-card' data-subrace='"+sk+"' "+(S.subrace===sk?"style='border-color:var(--gold);color:var(--gold2)'":"")+">";
    h+="<span class='sc-t'>"+sb.cn+"</span>";
    h+="<span class='sc-d'>"+sb.desc+"</span>";
    if(sb.attrs&&Object.keys(sb.attrs).length){
      const s=Object.keys(sb.attrs).map(k=>ATTR_CN[k]+"+"+sb.attrs[k]).join(" ");
      h+="<span class='sc-m' style='color:var(--cyan)'>"+s+"</span>";
    }
    if(sb.skills&&Object.keys(sb.skills).length){
      const s=Object.keys(sb.skills).map(k=>skillCn(k)+"+"+sb.skills[k]).join(" ");
      h+="<span class='sc-m' style='color:var(--gold2)'>"+s+"</span>";
    }
    if(sb.traits&&sb.traits.length) h+="<span class='sc-m' style='color:var(--ok)'>特性："+sb.traits.join("·")+"</span>";
    h+="</button>";
  }
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>出身 · 九地（影响初始金币/技能/好感/序章）</h3><div class='sel-row'>";
  for(const hk in HOMELANDS) h+=selCard(hk,HOMELANDS[hk],"homeland");
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>出身谱系 · "+(RACES[S.race]?RACES[S.race].cn:"")+"（决定初始状态/人际关系/入学标签/序章剧情）</h3><div class='sel-row' id='background-box'>";
  for(const bk in BACKGROUNDS_FULL){
    const bg=BACKGROUNDS_FULL[bk];
    if(bg.race!==S.race && bg.race!=="半身人" && bg.race!=="龙裔" && bg.race!=="混血") continue;
    if(bg.race==="半身人" && S.race!=="半身人") continue;
    if(bg.race==="龙裔" && S.race!=="龙裔") continue;
    if(bg.race==="混血" && S.race!=="混血") continue;
    h+="<button class='sel-card' data-background='"+bk+"' "+(S.background===bk?"style='border-color:var(--gold);color:var(--gold2)'":"")+">";
    h+="<span class='sc-t'>"+bg.icon+" "+bg.cn+"</span>";
    h+="<span class='sc-d'>"+bg.desc+"</span>";
    h+="<span class='sc-m' style='color:var(--gold2)'>初始金币："+bg.gold+" · 标签："+bg.label+"</span>";
    if(bg.attrs&&Object.keys(bg.attrs).length){
      const s=Object.keys(bg.attrs).map(k=>ATTR_CN[k]+"+"+bg.attrs[k]).join(" ");
      h+="<span class='sc-m' style='color:var(--cyan)'>"+s+"</span>";
    }
    h+="</button>";
  }
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>主修职业 · 九选一</h3><div class='sel-row'>";
  for(const jk in JOBS){
    const j=JOBS[jk];
    h+="<button class='sel-card' data-job='"+jk+"' "+(S.job===jk?"style='border-color:var(--gold)'":"")+">";
    h+="<span class='sc-t'>"+j.cn+"</span><span class='sc-d'>"+j.desc+"</span>";
    h+="<span class='sc-m' style='color:var(--cyan)'>准则："+j.criterion+"</span>";
    h+="</button>";
  }
  h+="</div>";
  h+="<p class='sub mt5' style='color:var(--bad);font-size:12px'>※ 职业一生唯一，不可兼修。唯有神明能以神恩强行扭转凡人的职业根基；而神明不会轻易干涉世事。请慎重抉择。</p>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>天赋 · 四等（决定属性池与起跑线）</h3><div class='sel-row'>";
  for(const tk in TALENTS) h+=selCard(tk,TALENTS[tk],"talent");
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>爱好 · 十选一（决定擅长技能与专属际遇）</h3><div class='sel-row'>";
  for(const hk in HOBBIES) h+=selCard(hk,HOBBIES[hk],"hobby");
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>理想 · 八选一（决定结局归宿）</h3><div class='sel-row'>";
  for(const ik in IDEALS) h+=selCard(ik,IDEALS[ik],"ideal");
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>六大属性分配　<span style='color:var(--dim);font-size:12px'>余 <span id='poolv'>"+pool+"</span> 点（20-80，判定按对应属性）</span></h3>";
  h+="<p class='sub mt5' style='font-size:12px'>货币："+CURRENCY.rate+"（"+CURRENCY.sub+"）。"+CURRENCY.note+"</p>";
  for(const a of ATTRS){
    h+="<div class='attr-row' data-a='"+a+"'>"+
       "<span class='nm'>"+ATTR_CN[a]+"</span>"+
       "<span class='val' id='val-"+a+"'>"+S.attrs[a]+"</span>"+
       "<span class='btns'>"+
       "<button class='btn ab' data-a='"+a+"' data-d='1'>+1</button>"+
       "<button class='btn ab' data-a='"+a+"' data-d='5'>+5</button>"+
       "<button class='btn' data-a='"+a+"' data-d='-1'>−1</button>"+
       "<button class='btn' data-a='"+a+"' data-d='-5'>−5</button>"+
       "</span><span class='note'>"+ATTR_DESC[a]+"</span></div>";
  }
  h+="<div class='mt10' style='text-align:center'><button class='btn gold' id='btn-start' style='padding:10px 30px'>踏入4037年 · 开始旅程</button></div>";
  h+="<p class='sub center mt10'>d100 六档判定 · 大成功01 / 极成功≤目标1/5 / 困难成功≤目标1/2 / 普通成功≤目标 / 失败 / 大失败=100或目标<50时≥96</p>";
  return h;
}
function bindCreation(){
  document.querySelectorAll("[data-gender]").forEach(b=>{
    b.onclick=()=>{ S.gender=b.dataset.gender; document.querySelectorAll("[data-gender]").forEach(x=>{x.style.borderColor="";}); b.style.borderColor="var(--gold)"; };
  });
  document.querySelectorAll("[data-homeland]").forEach(b=>{
    b.onclick=()=>{ S.homeland=b.dataset.homeland; document.querySelectorAll("[data-homeland]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; };
  });
  document.querySelectorAll("[data-background]").forEach(b=>{
    b.onclick=()=>{ S.background=b.dataset.background; document.querySelectorAll("[data-background]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; };
  });
  document.querySelectorAll("[data-job]").forEach(b=>{
    b.onclick=()=>{ S.job=b.dataset.job; document.querySelectorAll("[data-job]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; };
  });
  document.querySelectorAll("[data-race]").forEach(b=>{
    b.onclick=()=>{ S.race=b.dataset.race; S.subrace=null; document.querySelectorAll("[data-race]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)";
      const box=document.getElementById("subrace-box");
      if(box){ box.innerHTML="";
        const rc=RACES[S.race];
        const hd=document.createElement("h3"); hd.className="mt10"; hd.style.color="var(--gold2)"; hd.textContent="亚种族 · "+(rc?rc.cn:"")+"（细选血统，决定属性/特性）";
        box.appendChild(hd);
        for(const sk in SUBRACES){
          const sb=SUBRACES[sk]; if(sb.race!==S.race) continue;
          const btn=document.createElement("button"); btn.className="sel-card"; btn.dataset.subrace=sk;
          btn.innerHTML="<span class='sc-t'>"+sb.cn+"</span><span class='sc-d'>"+sb.desc+"</span>";
          if(sb.attrs&&Object.keys(sb.attrs).length){
            const s=Object.keys(sb.attrs).map(k=>ATTR_CN[k]+"+"+sb.attrs[k]).join(" ");
            btn.innerHTML+="<span class='sc-m' style='color:var(--cyan)'>"+s+"</span>";
          }
          if(sb.skills&&Object.keys(sb.skills).length){
            const s=Object.keys(sb.skills).map(k=>skillCn(k)+"+"+sb.skills[k]).join(" ");
            btn.innerHTML+="<span class='sc-m' style='color:var(--gold2)'>"+s+"</span>";
          }
          if(sb.traits&&sb.traits.length) btn.innerHTML+="<span class='sc-m' style='color:var(--ok)'>特性："+sb.traits.join("·")+"</span>";
          btn.onclick=()=>{ S.subrace=sk; box.querySelectorAll("[data-subrace]").forEach(x=>{x.style.borderColor="";x.style.color="";}); btn.style.borderColor="var(--gold)"; btn.style.color="var(--gold2)"; };
          box.appendChild(btn);
        }
      }
    };
  });
  document.querySelectorAll("[data-talent]").forEach(b=>{
    b.onclick=()=>{ S.talent=b.dataset.talent; document.querySelectorAll("[data-talent]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; const np=300+talentPoolBonus()-(S.attrs.SPR+S.attrs.STR+S.attrs.AGI+S.attrs.INT+S.attrs.CHA+S.attrs.CON); pool=np; const pv=document.getElementById("poolv"); if(pv) pv.textContent=np; };
  });
  document.querySelectorAll("[data-hobby]").forEach(b=>{
    b.onclick=()=>{ S.hobby=b.dataset.hobby; document.querySelectorAll("[data-hobby]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; };
  });
  document.querySelectorAll("[data-ideal]").forEach(b=>{
    b.onclick=()=>{ S.ideal=b.dataset.ideal; document.querySelectorAll("[data-ideal]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; };
  });
  document.querySelectorAll(".ab").forEach(b=>{
    b.onclick=()=>{
      const a=b.dataset.a, d=parseInt(b.dataset.d);
      const old=S.attrs[a];
      const np = pool - d;
      const nv = old + d;
      if(nv<20||nv>80){ flashMsg("超出范围（20-80）"); return; }
      if(np<0){ flashMsg("点数不足"); return; }
      S.attrs[a]=nv; pool=np;
      const v=$("val-"+a); if(v) v.textContent=nv;
      const pv=document.getElementById("poolv"); if(pv) pv.textContent=np;
    };
  });
  $("btn-start").onclick=()=>{
    const name = $("in-name").value.trim();
    if(!name){ flashMsg("请先写下你的名讳"); return; }
    if(!S.job){ flashMsg("请选择主修职业"); return; }
    if(!S.ideal){ flashMsg("请选择你的理想"); return; }
    if(pool<0){ flashMsg("点数分配有误"); return; }
    S.name = name.slice(0,12);
    if(!S.subrace){ flashMsg("请选择亚种族"); return; }
    S.maxSan = Math.round(S.attrs.SPR*1.5);
    if(!S.san) S.san=S.maxSan; /* M2b 新档san初始化修复：原逻辑仅故乡带H.san才赋值，否则新档san=0直接疯狂结局 */
    // 种族亚种生效
    const SR = SUBRACES[S.subrace]||{};
    for(const k in (SR.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+SR.attrs[k]);
    for(const k in (SR.skills||{})) S.skills[k]=(S.skills[k]||0)+SR.skills[k];
    for(const k in (SR.flags||[])) S.flags[SR.flags[k]]=true;
    const H = HOMELANDS[S.homeland]||{};
    S.gold = Math.max(5, S.gold + (H.gold||0));
    for(const k in (H.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+H.attrs[k]);
    for(const k in (H.skills||{})) S.skills[k]=(S.skills[k]||0)+H.skills[k];
    for(const k in (H.infl||{})) S.infl[k]=(S.infl[k]||0)+H.infl[k];
    if(H.san) S.san = Math.max(0, S.maxSan + H.san);
    if(H.flag) S.flags[H.flag]=true;
    // 出身谱系生效（v15）
    if(!S.background) S.background = "human_orphan";
    const BG = BACKGROUNDS_FULL[S.background]||{};
    S.gold = Math.max(0, S.gold + (BG.gold||0));
    for(const k in (BG.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+BG.attrs[k]);
    for(const k in (BG.skills||{})) S.skills[k]=(S.skills[k]||0)+BG.skills[k];
    if(BG.label) S.flags.enrollment_label = BG.label;
    if(BG.hidden) S.flags[BG.hidden]=true;
    /* /t11inj:defaults-build/ I1-1 建号完成分段阅读开关兜底 */
    if(!S.settings) S.settings={};
    if(S.settings.pagedReading===undefined) S.settings.pagedReading=true;
    S.prologueState = {background:S.background, day:1, opportunitiesTriggered:[], crisisTriggered:false, admissionReceived:false};
    // 天赋生效
    const T = TALENTS[S.talent]||{};
    if(typeof T.apply==="function"){ T.apply(); }
    else{
      for(const k in (T.skills||{})) S.skills[k]=(S.skills[k]||0)+T.skills[k];
      if(T.xp) S.xp+=T.xp;
      if(T.flag) S.flags[T.flag]=true;
    }
    // 爱好生效
    const HB = S.hobby?HOBBIES[S.hobby]:null;
    if(HB){ if(HB.s) S.skills[HB.s]=(S.skills[HB.s]||0)+(HB.v||0); if(HB.flag) S.flags[HB.flag]=true; }
    // 主修职业技能（唯一职业，无辅修）
    const j=JOBS[S.job]; if(j&&j.skill) S.skills[j.skill]=Math.max(S.skills[j.skill]||0,15);
    // 神智与生命
    S.san = (S.san>0 && S.san<=S.maxSan) ? S.san : S.maxSan;
    S.hp = maxHp();
    S.flags.job_chosen=true;
    logMsg("旅者 "+S.name+" 诞生 · "+(SUBRACES[S.subrace]?SUBRACES[S.subrace].cn:"")+" · 主修："+j.cn+" · 出身："+(HOMELANDS[S.homeland]?HOMELANDS[S.homeland].cn:"")+" · 理想："+(IDEALS[S.ideal]?IDEALS[S.ideal].cn:""),"l");
    closeModal();
    // v27 序章：根据出身跳转到对应序章线
    if(typeof initForeshadowingV27 === 'function') initForeshadowingV27();
    if(typeof initMoralChoicesV27 === 'function') initMoralChoicesV27();
    if(typeof initTimeV26 === 'function') initTimeV26();
    const originMapV27 = {free:"origin_free_city_1",north:"origin_northern_1",south:"origin_southern_1",church:"origin_church_1",elf:"origin_elf_1",dwarf:"origin_dwarf_1",orc:"origin_orc_1",east:"origin_eastern_1",desert:"origin_desert_1"};
    const originNode = originMapV27[S.homeland];
    if(originNode && (N[originNode] || (typeof NODE_MAP!=="undefined" && NODE_MAP[originNode]))){
      curNode = originNode;
      S.flags.prologueV27 = true;
    } else if(originNode){
      curNode = originNode;
      S.flags.prologueV27 = true;
    } else {
      curNode = "prologue_start";
    }
    S.day = 1; S.date = fmtDate(S.day);
    renderTop(); renderStats();
    /* /upg10inj:newgame/ UPG-10 新游戏清除旧会话快照 */
    try{ if(typeof v92_sessionClear === 'function') v92_sessionClear(); }catch(e){}
    writeNext();
  };
}

/* ============ v2 结局：判定池 + 理想回响 ============ */
function computeEnding(){
  const f = S.flags||{};
  const infl = S.infl||{};
  // 维度一：最终抉择（深渊/封印线）
  if(f.fell || f.seized) return "fell";
  if(S.san<=0) return "madness";
  if(f.seal_great || f.seal_success) return "seal";
  // 维度二：势力立场（暗蚀会合流——需达宗师以上且未被封门线锁定）
  if((infl.abyss||0)>=25 && S.realm>=5) return "pact";
  // 维度三：境界
  if(S.realm>=7) return "myth";
  if(S.realm>=6) return "legend";
  // 维度四：事件与阵营立场（净化令/东部/神恩）
  if((f.purge_arrest || (infl.church||0)>=35) && S.realm<=4) return "purge";
  if((infl.east||0)>=30) return "east";
  if(f.god_favor_done || S.job2) return "godfavor";
  // 维度五：声望·业力·理想
  if(S.ideal==="wealth" && S.rep>=30 && S.gold>=200) return "merchant";
  if(S.ideal==="truth" && S.flags.desert_done) return "returned";
  if(S.ideal==="guard" && S.rep>=25) return "hero";
  if(S.ideal==="free" && S.rep<40) return "wanderer";
  if((S.ideal==="might"||S.ideal==="fame") && S.rep>=25) return "legend";
  if(S.rep>=40 && S.gold>=300 && !S.desert_done) return "merchant";
  if(S.desert_done) return "returned";
  if((infl.abyss||0)>=15) return "pact";
  return "wanderer";
}
function showEnding(id){
  if(S.ending) return;
  S.ending = id;
  const E = ENDINGS[id]||ENDINGS.wanderer;
  clearOptions();
  writePar("── 结局 · "+E.cn+" ──","noind flagline");
  E.text.forEach(p=>writePar(p));
  try{ v47_endingRecord(id); }catch(e){}
  try{ u7_ngRecord(id); }catch(e){} /* /u7inj:record/ */
  try{ var _ep = v47_endingEpilogue(id); if(_ep) writePar(_ep,"narration"); }catch(e){}
  if(S.ideal && IDEALS[S.ideal] && IDEALS[S.ideal].echo){
    writePar("── 理想回响 · "+IDEALS[S.ideal].cn+" ──","noind flagline");
    writePar(IDEALS[S.ideal].echo);
  }
  try{ const s=Object.assign({},S); s.choices=[]; s.curNode=curNode; localStorage.setItem(RULESET_ID+"-save",JSON.stringify(s)); }catch(e){}
  renderTop(); renderStats();
  const b = document.createElement("button"); b.className="opt";
  b.innerHTML = "<span class='od'>✦</span> 重开新旅";
  b.onclick = async ()=>{ if(await askConfirm("开启一段新的旅程？当前结局将被覆盖。")) newGame(); };
  $("options").appendChild(b);
  const nb = document.createElement("button"); nb.className="opt";
  nb.innerHTML = "<span class='od'>✦</span> 周目回顾";
  nb.onclick = ()=>{ try{ u7_ngPanel(); }catch(e){} };
  $("options").appendChild(nb); /* /u7inj:panel-btn/ */
}

N["ending_choose"] = {tags:["ending:choose"],tag:"ending",
  place:"旅途回望",where:"某个黄昏",
  text:[
    "你站在某个黄昏里，回望来路。",
    "自由城邦的雾、北境的雪、南方的账本、精灵的银林、矮人的炉火、草原的风、帝京的墙、圣城的钟、沙漠的黑沙——",
    "你走过的每一步，都还在你脚下。",
    "你摸了摸怀里的（铁牌/信物/伤痕）。",
    "此刻，你可以选择，把这段旅程，告一段落。",
    "或者，继续走下去。", "旅途回望在雾里模糊了轮廓。你紧了紧衣领，迈步上路。"],pace:"light",
  options:[
    {t:"【就此停步】结束旅程，回望这一生",run:function(){ showEnding(computeEnding()); }},
    {t:"【伏笔簿】回望未解的线",go:"v47_ledger"},
    {t:"【决战前夜】四方合流",go:"ending_prelude_hub"},
    {t:"【继续漫游】路还长，接着走",run:function(){ togglePanel("map"); }}
  ]
};
/*==STORY_TRAVEL==*/
/*==STORY_REALM==*/
/*==STORY_WORLD==*/

/*==v47inj:ledger==*/
N["v47_ledger"]=function(){return{
  place:"旅途回望 · 伏笔簿", where:"篝火边",
  text:function(){ return window.v47_ledgerLines(); },
  options:[
    {t:"逐页回想，把未解的伏笔一一点亮", run:function(){ window.v47_ledgerRecallAll(); }},
    {t:"合上伏笔簿，走向决战前夜", go:"ending_prelude_hub"},
    {t:"合上伏笔簿，继续漫游", run:function(){ togglePanel("map"); }}
  ]
}};
/*==v47inj:prelude==*/
N["ending_prelude_hub"]=function(){return{tag:"ending",
  place:"决战前夜", where:"篝火边",
  text:function(){
    var lines = window.v47_arcLines();
    var st = window.v47_foreshadowStatus();
    lines.push("你摸了摸怀里的伏笔簿——"+st.recovered+"/"+st.total+" 个答案，已经被你找回来。");
    var fh = S.foreshadowing||{};
    if(fh.hlj_letter && fh.hlj_letter.revealed) lines.push("黄林晶的信，在你怀里，已经读了无数遍。信纸边缘，几乎要被你的手指磨穿了。");
    if(S.arcProgress && S.arcProgress.seal>=3) lines.push("七枚铁牌，在你腰间，一声一声，敲着你的心跳。");
    if(S.arcProgress && S.arcProgress.faction>=3) lines.push("大陆的势力，因你的奔走，终于把视线，落在了同一处。");
    if(S.npcRelations && Object.keys(S.npcRelations).length>=3) lines.push("你想起那些与你并肩过的人。他们中的大多数，明天会在你身边。");
    lines.push("【终局前夜】你站在旅途的尽头，回望来路。那些在自由城邦的酒馆里喝过的酒、在铁门关的城墙上看过的雪、在学院烛光下抄过的书，此刻都像潮水，涌回眼前。");lines.push("");lines.push("你摸了摸身上的信物——铁牌、图腾、信笺，一件一件，都连着一段故事。它们像你这一生的路标，标着每一个转弯。");lines.push("");lines.push("风从前方吹来，带着终局的气息。你知道，接下来的选择，会把这一切，引向一个结局。");lines.push("");lines.push("你深吸一口气，向前走去。");lines.push("");return lines;
  },
  options:[
    {t:"走向深渊之门（结束旅程）", run:function(){ showEnding(computeEnding()); }},
    {t:"最后看一眼伏笔簿", go:"v47_ledger"},
    {t:"在篝火边睡到天明", run:function(){ try{ if(typeof v44_quickRest==='function') v44_quickRest(); else { advanceTime(1); writeNext(); } }catch(e){ advanceTime(1); writeNext(); } }}
  ]
}};

/*==STORY_ENDING==*/

/* ============ 通用到达节点 ============ */
N["arrive_generic"] = {tag:"main",
  place:"未知之地", text:["风尘仆仆。你踏上了这片土地。","远处有炊烟，近处有狗吠。世界照常运转，并不为你的到来多停一秒。", "你离了未知之地，脚步声在空旷处格外清晰。赶路要紧。"],pace:"light",
  options:[
    {t:"四处看看，找落脚处",go:"act_rest"},
    {t:"向路人打听此地的消息",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
      ok:["路人上下打量你，见你风尘仆仆却不狼狈，便说了几句实在话：此地近来的物价、教会查得严、哪里能接到活计，都清清楚楚。"],
      fail:["路人见你面生，含糊两句便走了。你只听得半截话，'……净化令，查得紧。'","没问到什么有用的，倒是记住了这一句。"],
      crit:["路人是个话篓子，压着嗓子倒出一箩筐：某商会的账房深夜不点灯、某座教堂的地下室常年锁着、某条商队最近总在夜里进城。这些你都记下了。"],
      critfail:["你问得太急，路人警惕起来，反倒把你当成了圣痕司的探子，扭头就走。街角的巡兵朝你多看了两眼。你只得低头快步离开。"]
    },effects:{rep:1},go:"act_rest"}
  ]
};
N["act_rest"] = {
  place:"落脚处", text:["你找了个便宜的客栈。跳蚤在褥子里蹦跳，隔壁传来鼾声与梦话。","睡一觉。明日的事，明日再说。", "落脚处的动静在身后淡了。你把行囊带子紧了紧，继续上路。"],pace:"light",
  options:[
    {t:"休息一日（恢复伤势与疲劳，消耗1日）",time:1,effects:{hp:30,fatigue:0,wound:-1},run:function(){ if(S.travelFatigue>0){ S.travelFatigue-=1; writePar("好好睡了一觉。连日的劳顿散去一层，骨头又归了位。","res"); } if(S.disease){ S.disease=false; writePar("休养一日，病气退了大半。","res"); } },go:"arrive_generic"},
    {t:"逛集市，采买补给",check:{a:"CHA",sk:"bargain",label:"砍价"},tier:{
      ok:["你用几句俏皮话压下了价。干粮、绷带、一壶酒，都进了行囊。"],
      fail:["摊主油盐不进。你多付了些钱，东西倒是齐了。"],
      crit:["摊主看你顺眼，多塞给你一小包香料，说是路上驱邪用。"],
      critfail:["你砍价砍出了火气，摊主报了巡兵，说你扰乱市集。你赔了钱才脱身，还被记了一笔。"]
    },effects:{gold:-8,item:"干粮包"},go:"arrive_generic"},
    {t:"打坐修炼，沉淀此行见闻",check:{a:"INT",sk:"lore",label:"冥想"},tier:{
      ok:["行路中的见闻在脑中沉淀成经验。气机微动，修为略有进益。"],
      fail:["心浮气躁。今日的疲惫压过了灵光，你坐了一会儿便放弃了。"],
      crit:["冥想中你忽然想通了一处关节。这世间的道理，原是可以这样串起来的。"],
      critfail:["冥想时你听见耳边有低语，像是谁在叫你的名字。你猛地睁眼，房里空无一人。冷汗浸透了后背。"]
    },effects:{xp:15},go:"arrive_generic"}
  ]
};

function askConfirm(msg){
  return new Promise(function(resolve){
    try{
      var ov = document.createElement('div');
      ov.id = 'b3-confirm-overlay';
      ov.style.position = 'fixed';
      ov.style.inset = '0';
      ov.style.zIndex = '99999';
      ov.style.background = 'rgba(0,0,0,0.45)';
      ov.style.display = 'flex';
      ov.style.alignItems = 'center';
      ov.style.justifyContent = 'center';
      var box = document.createElement('div');
      box.className = 'box';
      box.style.maxWidth = '380px';
      box.style.width = '92%';
      box.style.boxSizing = 'border-box';
      box.innerHTML =
        '<h2>⚠ 确认</h2>' +
        '<div style="font-size:14px;color:var(--text);margin:8px 0 14px;line-height:1.6">' + esc(msg) + '</div>' +
        '<div style="display:flex;gap:8px">' +
        '<button class="btn btn-gold" id="b3-yes" style="flex:1">确 定</button>' +
        '<button class="btn" id="b3-no" style="flex:1">取 消</button>' +
        '</div>';
      ov.appendChild(box);
      document.body.appendChild(ov);
      var yes = ov.querySelector('#b3-yes');
      var no = ov.querySelector('#b3-no');
      var done = false;
      function finish(v){
        if(done) return; done = true;
        try{ document.removeEventListener('keydown', onKey, true); }catch(e){}
        try{ if(ov.parentNode) ov.parentNode.removeChild(ov); }catch(e){}
        resolve(v);
      }
      function onKey(e){
        if(e.key === 'Escape'){
          e.preventDefault(); e.stopPropagation();
          finish(false);
        }
      }
      if(yes) yes.onclick = function(){ finish(true); };
      if(no) no.onclick = function(){ finish(false); };
      document.addEventListener('keydown', onKey, true);
      ov.addEventListener('mousedown', function(e){
        if(e.target !== ov) return;
        e.stopPropagation();
        finish(false);
      });
    }catch(e){ resolve(true); }
  });
}
async function newGame(){
  if(!(await askConfirm("确定开始新的旅程？当前进度将被覆盖。"))) return;
  S = emptyState();
  try{ u7_ngInherit(); }catch(e){} /* /u7inj:inherit/ */
  curNode=null;
  showCreation();
}
/* ============ 地图 ============ */
function renderMapPanel(){
  const P = $("map");
  if(!P) return;
  let svg = "<svg viewBox='-800 -1300 1700 2600' xmlns='http://www.w3.org/2000/svg'>";
  // 简化网格
  for(let gx=-600;gx<=600;gx+=200){ svg += "<line x1='"+gx+"' y1='-1250' x2='"+gx+"' y2='1250' class='route'/>"; }
  for(let gy=-1200;gy<=1200;gy+=200){ svg += "<line x1='-750' y1='"+gy+"' x2='750' y2='"+gy+"' class='route'/>"; }
  for(const rk in REGIONS){
    const R = REGIONS[rk];
    for(const ck in R.cities){
      const C = R.cities[ck];
      const id = rk+"_"+ck;
      const now = S.loc===id;
      const visited = S.visited[id];
      const cls = now?"now":(visited?"":"un");
      svg += "<g class='city "+cls+"' onclick='openCitySpots(\""+id+"\")'>";
      svg += "<circle cx='"+C.x+"' cy='"+(-C.y)+"' r='"+(now?7:5)+"'/>";
      svg += "<text x='"+(C.x+10)+"' y='"+(C.y? -C.y-6 : -C.y+16)+"' class='city'>"+C.cn+"</text>";
      svg += "</g>";
    }
  }
  svg += "</svg>";
  P.innerHTML = svg;
}


/* ============ 城市六动作（打探/委托/交易/拜访/修炼/探索/秘密） ============ */
const CITY_ACTIONS = [
  {k:"hear",  cn:"打探",   ic:"👂", fn:"mechHear()"},
  {k:"quest", cn:"接委托", ic:"📜", fn:"mechQuest()"},
  {k:"trade", cn:"交易",   ic:"🪙", fn:"mechTrade()"},
  {k:"visit", cn:"拜访势力", ic:"🏛", fn:"mechVisit()"},
  {k:"train", cn:"修炼",   ic:"🧘", fn:"mechTrain()"},
  {k:"explore",cn:"探索地标", ic:"🗺", fn:"mechExplore()"},
  {k:"secret",cn:"打探秘密", ic:"🕯", fn:"mechSecret()"}
];
/* /u2inj:winx-bare/ */ window.CITY_ACTIONS = CITY_ACTIONS;
function renderCityActs(){
  const box = document.getElementById("cityActs");
  if(box){ box.innerHTML=""; box.remove(); }
  const wrap = document.createElement("div");
  wrap.id = "cityActs";
  wrap.className = "cityActs";
  let h = "<div class='ca-title'>── 城中诸事 ──</div><div class='ca-row'>";
  for(const a of CITY_ACTIONS){
    h += "<button class='opt ca' onclick='"+a.fn+"'><span class='od'>"+a.ic+"</span> "+a.cn+"</button>";
  }
  h += "</div>";
  wrap.innerHTML = h;
  const opts = document.getElementById("options");
  if(opts) opts.appendChild(wrap);
}
/* 地标子地点（点击地图城市展开） */
const CITY_SPOTS = {
  "free_jiaohui":["交汇广场 · 布告栏","跛脚酒桶（蜜尔娜）","城西死过人的酒馆","下水道入口（有夜半念经声）","圣痕司驻地"],
  "free_jishi":["大集市（什么都有，什么都贵）","银月商会分号","地下赌场（传闻与账房有关）"],
  "free_gonghui":["联合冒险者公会大厅","告示板（悬赏榜）","佣兵酒馆"],
  "free_huigang":["内河码头","税关（查得严）","走私水道（夜里开船）"],
  "north_aierda":["艾尔达魔法学院（时空学派）","银月商会总部","圣痕司分院","帝宫外廓"],
  "south_huangjin":["黄金交易所","银月商会总号","商会法庭"],
  "south_moxie":["魔械工坊（飞空艇起降场）","发明家协会","齿轮巷"],
  "elf_wangting":["世界树（节点5）","精灵王庭长厅","迷雾林道"],
  "dwarf_wangdu":["熔铁神殿（节点6·位置已失传）","山腹锻造区","符文矿道"],
  "orc_heishi":["黑石大汗的狼旗大帐","兽人圣山·祖灵洞（节点4）","战舞场"],
  "east_chengtian":["帝宫","特科考场","银穗商路税关"],
  "church_shengcheng":["圣光大教堂","圣痕司总部","焚书广场"],
  "desert_shendian":["深渊神殿（节点7·被深渊占据）","黑沙驿站","风蚀石林"]
}; window.CITY_SPOTS = CITY_SPOTS; /* /v60inj:winx2:CITY_SPOTS/ */
function openCitySpots(id){
  const spots = CITY_SPOTS[id];
  const box = document.createElement("div");
  box.className = "box";
  let h = "<h2>"+curLocName()+" · 城中各处</h2>";
  if(spots){
    h += "<div class='mini'>你已到过此地，认得这里的几处要紧地方：</div>";
    for(const s of spots){
      var _spotGate = (window.V67_SPOT_ROUTES && V67_SPOT_ROUTES[s]) ? V67_SPOT_ROUTES[s].gate : null;
      h += "<button class='opt' onclick='closeModal(); " + (_spotGate ? "v67_gate(\""+_spotGate+"\")" : "writePar(\"你走向 "+s+"。\\n\\n\"); mechSecret()") + "'>"+
           "<span class='od'>▸</span> "+s+"</button>";
    }
  } else {
    h += "<div class='mini'>这座城不大，你走一圈，便把街巷都认了。</div>";
    h += "<button class='opt' onclick='closeModal(); mechExplore()'><span class='od'>▸</span> 四处走走</button>";
  }
  h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 离开</button>";
  box.innerHTML = h;
  openModal(box);
}
/* ============ 旅行 ============ */
function travelTo(id){
  const [r,c] = id.split("_");
  if(!REGIONS[r]||!REGIONS[r].cities[c]) return;
  if(S.loc===id){ flashMsg("你已在此地"); return; }
  const from = curCity();
  const toR = REGIONS[r], toC = toR.cities[c];
  // 距离
  const dx = toC.x - (from.city?from.city.x:0);
  const dy = toC.y - (from.city?from.city.y:0);
  const dist = Math.round(Math.sqrt(dx*dx+dy*dy));
  // 选择交通方式
  const dst = r;
  const modes = [];
  for(const mk in TRAVEL){
    const M = TRAVEL[mk];
    if(mk==="airship" && !S.flags.moxie_visited) continue;
    if(M.flat===0 && !isWaterRoute(from.region.terrain,dst,toR.terrain)) continue;
    modes.push(mk);
  }
  // 展示交通选择
  const box = document.createElement("div");
  box.className="box";
  let h="<h2>前往 "+toR.cn+" · "+toC.cn+"</h2><p class='sub'>距离约 "+dist+" 公里。当前地点："+curLocName()+"。</p>";
  for(const mk of modes){
    const M = TRAVEL[mk];
    const speed = speedFor(M,dst);
    if(!speed) continue;
    const days = Math.max(1,Math.ceil(dist/speed));
    h += "<button class='opt' onclick='startTravel(\""+id+"\",\""+mk+"\","+dist+")'>"+
         "<span class='od'>◆</span> "+M.cn+"　约 "+days+" 日到达　费用 "+M.cost+" 金/日"+
         "<span class='or'>"+M.desc+"</span></button>";
  }
  h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 算了，原地不动</button>";
  box.innerHTML=h;
  openModal(box);
}
function isWaterRoute(fr,to,tr){ return fr==="平原"&&tr==="平原"; }
function speedFor(M,dst){
  const terrain = REGIONS[dst].terrain;
  if(terrain==="沙漠") return M.desert||0;
  if(terrain==="山地"||terrain==="森林") return M.rough||M.wild||0;
  return M.flat||0;
}
function startTravel(dstId,mode,dist){
  closeModal();
  const M = TRAVEL[mode];
  const speed = speedFor(M,dstId.split("_")[0]);
  const days = Math.max(1,Math.ceil(dist/speed));
  const cost = days*M.cost;
  if(S.gold<cost && mode!=="walk"){ writePar("你的钱袋不够支付这趟旅费。马夫的眼神冷下来。你只能另想办法。","noind"); return; }
  S.gold -= cost;
  // 粮水消耗（3号：每日食水；沙漠地区水贵，双倍）
  const desert = REGIONS[S.region].terrain==="沙漠" || REGIONS[dstId.split("_")[0]].terrain==="沙漠";
  let silverNeed = days * (desert?2:1);
  let hunger = false;
  if(S.silver>=silverNeed){ S.silver-=silverNeed; }
  else {
    let deficit = silverNeed - S.silver; S.silver=0;
    const goldNeed = Math.ceil(deficit/20);
    if(S.gold>=goldNeed){ S.gold-=goldNeed; }
    else { hunger = true; S.gold=0; S.hp = Math.max(1,S.hp-4); S.travelFatigue = Math.min(3,(S.travelFatigue||0)+1); }
  }
  // 旅行疲劳三档（3号：4-6天-10%/7-10天-20%/10天以上-30%，休息1日恢复1级）
  S.travelFatigue = Math.max(S.travelFatigue||0, days>=10?3:(days>=7?2:(days>=4?1:0)));
  // 中重度疲劳易生病（3号）
  if(S.travelFatigue>=2 && rnd(100) < (S.travelFatigue>=3?50:20)){ S.disease = true; }
  // 途中事件
  let eventTexts = [];
  const rolls = Math.min(3,Math.max(1,Math.floor(days/3)));
  for(let i=0;i<rolls;i++){
    const ev = rollTravelEvent();
    if(ev) eventTexts.push(ev);
  }
  advanceDays(days);
  S.fatigue = Math.min(12,S.fatigue+Math.min(days,6));
  S.loc = dstId; S.region = dstId.split("_")[0];
  if(window.v92_galleryMark){ var _cN=(REGIONS[S.region]&&REGIONS[S.region].cities[S.loc.split("_")[1]])?REGIONS[S.region].cities[S.loc.split("_")[1]].cn:dstId; v92_galleryMark("place_"+S.loc, _cN); }
  S.visited[S.loc]=true; S.visited[S.region]=true;
  S.flags["visited_"+S.region]=true;
  S.flags.arrived = dstId;
  if(typeof npcLifeCheck==="function") npcLifeCheck();
  logMsg("抵达 "+REGIONS[S.region].cn+" · "+REGIONS[S.region].cities[S.loc.split("_")[1]].cn,"l");
  renderMapPanel();
  const destNode = "arrive_"+dstId;
  // 世界事件优先落地：抵城时先见天下大势，再见眼前人事
  if(S.worldQueue && S.worldQueue.length && N["world_"+S.worldQueue[0]]){
    S.afterWorld = destNode;
    curNode = "world_"+S.worldQueue.shift();
  } else if(N[destNode]) curNode = destNode;
  else curNode = "arrive_generic";
  // 渲染旅途叙事
  writePar("── 旅途 · "+M.cn+" · "+days+" 日 ──","noind flagline");
  writePar("黄尘在身后卷起。马蹄声、车轮声、风穿过荒野的声音，日复一日。");
  writePar("钱袋轻了 "+money(cost)+" 枚金币，行囊里少了 "+silverNeed+" 枚银月的粮水。"+(desert?"沙漠的水，比金子还金贵。":""));
  if(hunger) writePar("银月与金币都见了底。最后两日你只靠嚼草根充饥，眼前发花，脚步发虚。","risky");
  if(S.travelFatigue>=2) writePar((S.travelFatigue>=3?"连日赶路已到极限。骨头缝里都是酸，脑子像蒙了层纱。":"连日的奔波让你腰背僵硬，反应慢了半拍。"),"warn");
  if(S.disease) writePar("路上染了病。头重脚轻，喉咙像塞了砂纸。","warn");
  writePar("第 "+S.day+" 日，你终于望见了目的地。");
  if(eventTexts.length){ writePar("途中并非太平。","noind"); eventTexts.forEach(t=>writePar(t)); }
  writeNext();
}
function rollTravelEvent(){
  const r = rnd(100);
  if(r<12) return null; // 无事发生
  const ev = choice(TRAVEL_EVENTS);
  const roll = rollD100();
  const t = ev.base||50;
  const lvl = tierOf(roll,t);
  S.dice.push({node:"travel",opt:ev.cn,roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    writePar(ev.ok);
    const res = applyEffects(ev.effOk||{},null);
    if(res) writePar(res,"res");
    return ev.ok;
  } else {
    writePar(ev.fail);
    const res = applyEffects(ev.effFail||{},null);
    if(res) writePar(res,"res");
    return ev.fail;
  }
}

/* ============ 模态框 ============ */
function openModal(el){
  try{ if(window.v67_ui) window.v67_ui.open(el); }catch(e){}
}
function closeModal(){ try{ if(window.v67_ui) window.v67_ui.close(); }catch(e){ $("modal").classList.remove("show"); $("modal").innerHTML=""; } }
// v30.1: 点击遮罩关闭弹窗
document.addEventListener('DOMContentLoaded',function(){
  const m=$("modal");
  if(m){ m.addEventListener('click',function(e){ if(e.target===m) closeModal(); }); }
});

/* ============ 建号 ============ */
let pool=300;
/* /u2inj:winx-bare/ */ window.pool = pool;

/* ============ 侧栏面板 ============ */
let curPanel=null;
function togglePanel(name){
  if(name==="map"){ try{ if(window.v67_map) v67_map.open(); }catch(e){} return; }
  /* /v73ui:panel/ V73：修为/行囊/日志统一为居中弹窗（v67 modal），内容函数复用 */
  try{
    const mbox = document.getElementById("modal");
    const cur = mbox ? mbox.querySelector(".v68-panel-box") : null;
    const curName = cur ? cur.getAttribute("data-panel") : null;
    if(curName === name){ closeModal(); return; }
    let content = "";
    if(name==="pack"){ content = renderPack(); }
    else if(name==="realm"){ content = renderRealm(); }
    else if(name==="log"){ content = renderLog(); }
    else return;
    const box = document.createElement("div");
    box.className = "box v68-panel-box";
    box.setAttribute("data-panel", name);
    box.innerHTML = content + "<div class='panel-footer'><button class='btn' onclick='togglePanel(\""+name+"\")'>关 闭</button></div>";
    openModal(box);
  }catch(e){ try{ console.error("[togglePanel]", e); flashMsg("面板打开失败"); }catch(_){} }
}
function renderPack(){
  let h="<h3>🎒 行囊</h3>";
  h+="<div class='row'><span>金币</span><b class='money'>"+money(S.gold)+"</b></div>";
  const _items = S.items||[];
  /* /v74ui:pack/ V74 行囊贵重分类：关键词白名单从道具中抽出 */
  const _vkw = ["传家宝","神器","秘宝","圣物","神兵","遗物","信物","权杖","王冠","结晶","龙晶","圣杯","法典","至宝"];
  const _valu = _items.filter(x=>_vkw.some(k=>String(x).indexOf(k)>=0));
  const _norm = _items.filter(x=>!_vkw.some(k=>String(x).indexOf(k)>=0));
  h+="<div class='p-sec'><span>贵重 ⭐</span><span class='cnt'>"+_valu.length+"</span></div>";
  h+="<div class='mini'>"+(_valu.length?_valu.map(x=>"%%"+x+"%%").join("、"):"无")+"</div>";
  h+="<div class='p-sec'><span>道具</span><span class='cnt'>"+_norm.length+"</span></div>";
  h+="<div class='mini'>"+(_norm.length?_norm.map(x=>"%%"+x+"%%").join("、"):"无")+"</div>";
  const _mats = Object.keys(S.mats||{}).filter(k=>S.mats[k]>0);
  h+="<div class='p-sec'><span>材料</span><span class='cnt'>"+_mats.length+"</span></div>";
  h+="<div class='mini'>"+(_mats.length?_mats.map(k=>"%%"+k+"%%×"+S.mats[k]).join("、"):"无")+"</div>";
  const _books = Object.keys(S.books||{});
  h+="<div class='p-sec'><span>典籍</span><span class='cnt'>"+_books.length+"</span></div>";
  h+="<div class='mini'>"+(_books.length?_books.join("、"):"无")+"</div>";
  h+="<h3>🗺 游历足迹</h3>";
  const _vis = Object.keys(S.visited||{}).filter(k=>k.includes("_"));
  h+="<div class='mini'>"+(_vis.length?_vis.map(v=>{const[r,c]=v.split("_");return REGIONS[r]?REGIONS[r].cities[c]?REGIONS[r].cities[c].cn:REGIONS[r].cn:"";}).filter(Boolean).join("、"):"尚未远行")+"</div>";
  h+="<div class='mini'>到访地区 "+Object.keys(S.visited||{}).filter(k=>!k.includes("_")).length+" / 9</div>";
  if($("pack")) $("pack").innerHTML=h;
  return h;
}
function realmCondList(){
  const j = JOBS[S.job];
  const r = S.realm; // 当前境界，下一境用 r
  const next = r<8?r:8;
  const matNeed = j.mats[next];
  const bookNeed = j.books[next]||[];
  let h="";
  h+="<div class='row'><span>当前境界</span><b style='color:var(--gold2)'>"+REALMS[S.realm].cn+" · "+j.titles[S.realm]+"</b></div>";
  if(S.realm>=8){ h+="<div class='mini'>九境已至绝巅。神位唯一，剩下的路，是取代神明。</div>"; return h; }
  h+="<div class='mini'>晋升下一境需同时满足：材料 · 知识 · 实践"+(S.realm>=3?" · 仪式":"")+(S.realm>=4?" · 锚点":"")+(S.realm>=5?" · 传奇作品":"")+"</div>";
  if(S.realm>=3 && j.ritual){ h+="<div class='mini' style='color:var(--dim)'>本职业晋升仪式："+j.ritual+"</div>"; }
  const mk = n=>{ const has=(S.mats[n]||0)>=1; return "<div class='row'><span>"+n+"</span><b class='"+(has?"g":"b")+"'>"+(has?"已得":"缺")+"</b></div>"; };
  h+="<div class='mini' style='color:var(--warn)'>所需材料：</div>"+mk(matNeed);
  for(const b of bookNeed){ const has=S.books[b]; h+="<div class='row'><span>"+b+"</span><b class='"+(has?"g":"b")+"'>"+(has?"已读":"缺")+"</b></div>"; }
  const conds = [["pra","完成修行实践"],["rit","完成晋升仪式"],["anc","立下认知锚点"],["work","完成传奇作品"]].filter(c=>{
    if(c[0]==="rit") return S.realm>=3;
    if(c[0]==="anc") return S.realm>=4;
    if(c[0]==="work") return S.realm>=5;
    return true;
  });
  for(const c of conds){
    const done = S.conds[c[0]];
    h+="<div class='row'><span>"+c[1]+"</span><b class='"+(done?"g":"b")+"'>"+(done?"完成":"未")+"</b></div>";
  }
  const canTry = S.xp>=REALMS[next].xp && S.mats[matNeed]>=1 && bookNeed.every(b=>S.books[b]) && conds.every(c=>c[0]==="rit"||c[0]==="anc"||c[0]==="work"||S.conds[c[0]]);
  h+="<div class='row'><span>尝试晋升</span><b>"+(canTry?"<button class='btn gold' onclick='tryAdvance()'>点燃薪火，冲击境界</button>":"条件未足，尚不可晋升")+"</b></div>";
  if(S.realm>=4 && !S.job2){
    h+="<div class='row'><span>神恩 · 第二职业</span><b><button class='btn' onclick='godFavorOpen()'>向神系祈问</button></b></div>";
    h+="<div class='mini' style='color:var(--dim)'>职业一生唯一，凡俗不可兼修。唯有神明能以神恩扭转根基——而神明，不会轻易回应凡人的祈问。</div>";
  }
  if(S.job2){ h+="<div class='row'><span>神恩转职</span><b style='color:var(--gold2)'>"+S.job+" → "+S.job2+"（神恩加护）</b></div>"; }
  h+="<div class='mini' style='color:var(--dim)'>"+REALMS[next].desc+"</div>";
  return h;
}
function renderRealm(){
  /* /v73ui:xp/ 修为进度条（扩充） */
  let h="<h3>⚡ 修炼</h3>";
  try{
    /* /v74ui:realm/ V74 境界刻度条 */
    try{
      const _rn = REALMS.length;
      h+="<div class='v74-realm-scale'>";
      for(let i=0;i<_rn;i++) h+="<span class='v74-rs-dot "+((S.realm||0)>i?"done":((S.realm||0)===i?"now":""))+"' title='"+(REALMS[i]?REALMS[i].cn:"")+"'></span>";
      h+="<span class='mini' style='margin-left:8px'>"+(REALMS[S.realm]?REALMS[S.realm].cn:"")+"</span></div>";
    }catch(e){}
    const _r = S.realm||0;
    const _nx = (REALMS[_r+1] ? _r+1 : _r);
    const _need = REALMS[_nx] ? (REALMS[_nx].xp||0) : 0;
    const _cur = S.xp||0;
    const _pct = _need>0 ? Math.min(100, Math.round(_cur/_need*100)) : (_r>=8?100:0);
    h += "<div class='mini' style='margin-top:4px'>修为 "+_cur+" / "+_need+"（"+_pct+"%）</div>";
    h += "<div class='p-bar'><div class='p-fill' style='width:"+_pct+"%'></div></div>";
  }catch(e){}
  /* V67 修炼成本说明 */
  try{
    if(window.v67_trainSite){
      const _s=v67_trainSite();
      let _note='消耗 1 时段 + 1 行动点｜地点效果 ×'+(_s.mult)+'（'+(_s.desc||'安稳')+'）';
      if((S.trainStreak||0)>=3) _note+='｜经脉发胀（收益 -25%）';
      h+="<div class='mini' style='color:var(--text-gold2,#8b6f47);'>"+_note+"</div>";
    }
  }catch(e){}
  if(!S.job){ if($("realm")) $("realm").innerHTML=h+"<div class='mini'>尚未选择职业。</div>"; return h+"<div class='mini'>尚未选择职业。</div>"; }
  h += realmCondList();
  h += v48PanelLine(); // v48inj:panel
  h += (typeof v488Panel==="function") ? v488Panel() : ""; // v488inj:panel
  h += "<h3>技能</h3>";
  for(const sk in S.skills){
    const v=S.skills[sk];
    if(v>0){
      const lv = SKILL_LEVELS.filter(x=>x[1]<=v).pop();
      h+="<div class='row'><span>"+skillCn(sk)+"</span><b>"+(lv?lv[0]+" (+"+v+")":"+"+v)+"</b></div>";
    }
  }
  h+="<div class='mini'>职业特长技能自动 +15。技能随剧情与修行提升。</div>";
  if($("realm")) $("realm").innerHTML=h;
  return h;
}
function tryAdvance(){
  const j = JOBS[S.job];
  const next = S.realm+1;
  // 晋升仪式判定
  const t = 40 + Math.floor((S.attrs[j.attr]||50)/2) + (S.realm*5);
  writePar("你盘膝而坐，让"+j.criterion+"的准则在心头流过。这一次冲击"+REALMS[next].cn+"，成则天高地阔，败则前功尽弃。","noind");
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  const ok = lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal";
  if(ok){
    S.mats[j.mats[S.realm]]--; if(S.mats[j.mats[S.realm]]<0) S.mats[j.mats[S.realm]]=0;
    S.realm = next;
    S.maxSan += 5;
    S.san = S.maxSan;
    if(next>=5) S.conds.anc=true;   // 大宗师立认知锚点（47号）
    S.hp = maxHp();
    writePar("轰——力量在体内炸开。旧的躯壳碎裂，新的感知漫过全身。你低头看自己的手，掌纹里流转着新的光。");
    writePar("**破境。"+REALMS[next].cn+"。**从此世间有你"+j.titles[next]+"之名。","noind");
    const res = applyEffects({attr:j.attr?{[j.attr]:2}:{SPR:2}},null);
    if(res) writePar(res,"res");
    logMsg("破境！"+REALMS[next].cn+" · "+j.titles[next],"l");
    // 宗师以上争位提示
    if(next>=6){ writePar("你隐约感到，这个境界在世间是有数的。高处的位置，每一个都有人坐着。","noind flagline"); }
    renderTop(); renderStats(); renderRealm();
    // 境界里程碑叙事（宗师/大宗师/传奇/半神/神话）
    // 宗师境：先赴本职业专属晋升仪式（47号）；传奇境：先铸本职业传奇作品（47号）
    if(next===4 && N["realm_ritual_"+S.job]){ curNode="realm_ritual_"+S.job; writeNext(); return; }
    if(next===6 && N["realm_work_"+S.job]){ curNode="realm_work_"+S.job; writeNext(); return; }
    if(N["realm_"+next]){ curNode="realm_"+next; writeNext(); }
  } else {
    S.san = Math.max(0,S.san-5);
    const lose = Math.max(10,Math.floor(S.gold*0.15));
    S.gold-=lose;
    writePar("反噬。胸口一闷，刚聚起的力量像受惊的兽群四散奔逃。你咳出一口血，地上溅开暗红。");
    writePar("钱袋轻了，气机也乱了。这一境，还差一口气。","noind");
    const res = applyEffects({san:0,hp:-Math.round(maxHp()*0.2)},null);
    if(res) writePar(res,"res");
    writePar("（损失金币 "+lose+"。可再积攒修为后重新冲击。）","noind flagline");
    renderTop(); renderStats();
  }
}


/* ============ 神恩 · 第二职业（46号：神明准则/仪式/锚点；神明不轻易干涉世事） ============ */
function godFavorOpen(){
  // 判定：向职业神系祈问，神明是否垂听
  const t = 25 + Math.floor((S.attrs.SPR||25)/4) + (S.realm>=6?15:(S.realm>=5?8:0)) + Math.floor(S.karma/10);
  writePar("你在修炼之地设下香案，按古礼点燃三炷安息香。烟雾笔直升起，久久不散。","noind");
  writePar("你闭目，向"+JOBS[S.job].deity.split("（")[0]+"祈问一条从未走过的路。","noind");
  const roll = rollD100(); const lvl = tierOf(roll,t);
  S.dice.push({node:"godfavor",opt:"神恩祈问",roll,target:t,lvl});
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    writePar("香火明灭三下，忽然凝成一道不散的光柱。某种古老的意志垂落——不是恩赐，是'注视'。");
    writePar("你听见一个没有声音的声音：'凡俗的规矩，本不许你走第二条路。但你走过的路，值得神再看一眼。'","noind");
    writePar("**神恩垂临。**你可以选择，以何种神系的名义，重立第二根基。","noind flagline");
    S.flags.god_favor = true;
    curNode = "realm_godfavor"; writeNext();
  } else if(lvl==="fail"){
    S.san = Math.max(0,S.san-3);
    writePar("香燃尽了，什么都没有发生。你跪坐到日头西斜，膝盖发麻。");
    writePar("神明没有回应。或许，他早已不在这片大陆上了。","noind");
    const res = applyEffects({san:0,hp:-3},null); if(res) writePar(res,"res");
    renderTop(); renderStats(); renderRealm();
  } else {
    S.san = Math.max(0,S.san-8);
    writePar("香火忽然剧烈摇晃，像被什么大风吹着。你心头一悸——那不是神明的注视，是更深处、更冷的东西，循着你的祈问'看'了过来。");
    writePar("你慌忙掐灭香火，冷汗涔涔。这一问，引来了不该引来的视线。","risky");
    const res = applyEffects({san:0,hp:-Math.round(maxHp()*0.1)},null); if(res) writePar(res,"res");
    renderTop(); renderStats(); renderRealm();
  }
}
function godFavorChoose(jobKey){
  const j2 = JOBS[jobKey];
  if(!j2) return;
  S.job2 = jobKey;
  S.flags.god_favor_done = true;
  S.skills[j2.skill] = (S.skills[j2.skill]||0) + 10;   // 神恩所授的第二根基
  S.attrs[j2.attr] = Math.min(80, S.attrs[j2.attr]+2);
  S.conds.pra = false;                                  // 新路需重新印证
  writePar("你重新跪下，以"+j2.cn+"之名立下第二条准则："+j2.criterion+"。");
  writePar("旧职业的根基没有动摇，新职业的光，在你体内点燃了第二盏灯。","noind");
  writePar("**从今往后，你是"+S.job+"，也是"+j2.cn+"。**神恩加护，双路并行。","noind flagline");
  const res = applyEffects({attr:{[j2.attr]:0}},null);
  renderTop(); renderStats(); renderRealm();
  writeNext();
}
/* ============ 结局 ============ */
function checkDeath(){
  if(S.hp<=0 && !S.ending){
    S.hp=0;
    // 濒死：不结束，损失后回城
    writePar("黑暗漫上来。马蹄声、风声、远处的钟声，都远了。");
    writePar("……再醒来时，你躺在某个小镇的医馆里。药味呛鼻，伤口被粗糙地包扎过。守夜的老医者说，是好心人把你从路边捡回来的。","noind");
    const lose = Math.floor(S.gold*0.3);
    S.gold-=lose;
    for(const k in S.mats) S.mats[k]=Math.floor(S.mats[k]/2);
    S.hp = Math.round(maxHp()*0.5);
    S.wound=1;
    S.day+=10; S.date=fmtDate(S.day);
    writePar("（损失金币 "+lose+"，材料折半，修养十日。）","noind flagline");
    // 送回最近已访问城市
    const vis = Object.keys(S.visited).filter(k=>k.includes("_"));
    const dest = vis.length? vis[vis.length-1] : "free_jiaohui";
    S.loc=dest; S.region=dest.split("_")[0];
    curNode = "arrive_generic";
    renderTop(); renderStats(); renderMapPanel();
    writeNext();
  }
  if(S.san<=0 && !S.ending){
    S.san=0;
    showEnding("madness");
  }
}

/* ============ LLM文笔增强设置面板 ============ */
function loadLLMConfig(){
  try{
    const saved = localStorage.getItem(RULESET_ID+"-llm-config");
    if(saved){
      const c = JSON.parse(saved);
      LLM_CONFIG.enabled = c.enabled || false;
      LLM_CONFIG.endpoint = c.endpoint || "";
      LLM_CONFIG.apiKey = c.apiKey || "";
      LLM_CONFIG.model = c.model || "";
      LLM_CONFIG.cache = {};
    }
  }catch(e){}
  updateLLMBadge();
}
function saveLLMConfig(){
  try{
    localStorage.setItem(RULESET_ID+"-llm-config", JSON.stringify({
      enabled: LLM_CONFIG.enabled,
      endpoint: LLM_CONFIG.endpoint,
      apiKey: LLM_CONFIG.apiKey,
      model: LLM_CONFIG.model
    }));
  }catch(e){}
}
function updateLLMBadge(){
  const btn = $("btn-llm");
  if(btn){
    let badge = btn.querySelector(".llm-badge");
    if(!badge){
      badge = document.createElement("span");
      badge.className = "llm-badge";
      btn.appendChild(badge);
    }
    if(LLM_CONFIG.enabled && LLM_CONFIG.endpoint && LLM_CONFIG.apiKey){
      badge.className = "llm-badge on";
      badge.textContent = "已开启";
    }else{
      badge.className = "llm-badge off";
      badge.textContent = "未开启";
    }
  }
}
function openLLMSettings(){
  const overlay = document.createElement("div");
  overlay.className = "llm-overlay";
  overlay.onclick = closeLLMSettings;
  overlay.id = "llm-overlay";
  document.body.appendChild(overlay);
  const modal = document.createElement("div");
  modal.className = "llm-modal";
  modal.id = "llm-modal";
  modal.innerHTML = '<h3>AI文笔增强设置</h3>'+
    '<div class="llm-field"><label>API Endpoint（兼容OpenAI格式）</label>'+
    '<input type="text" id="llm-endpoint" placeholder="https://ark.cn-beijing.volces.com/api/v3/chat/completions" value="'+(LLM_CONFIG.endpoint||"").replace(/"/g,'&quot;')+'">'+
    '<div class="llm-hint">火山引擎方舟：https://ark.cn-beijing.volces.com/api/v3/chat/completions<br>DeepSeek：https://api.deepseek.com/v1/chat/completions<br>本地Ollama：http://localhost:11434/v1/chat/completions</div></div>'+
    '<div class="llm-field"><label>API Key</label>'+
    '<input type="password" id="llm-apikey" placeholder="输入API密钥" value="'+(LLM_CONFIG.apiKey||"").replace(/"/g,'&quot;')+'"></div>'+
    '<div class="llm-field"><label>模型名称</label>'+
    '<input type="text" id="llm-model" placeholder="如：doubao-seed-1-6-250615 / deepseek-chat / gpt-4o-mini" value="'+(LLM_CONFIG.model||"").replace(/"/g,'&quot;')+'">'+
    '<div class="llm-hint">火山引擎方舟在控制台创建推理接入点后获取模型ID（ep-开头）</div></div>'+
    '<div class="llm-actions">'+
    '<button class="primary" id="llm-save">保存并开启</button>'+
    '<button id="llm-toggle">'+(LLM_CONFIG.enabled?"关闭增强":"开启增强")+'</button>'+
    '<button id="llm-clear">清除缓存</button>'+
    '<button id="llm-close">关闭</button></div>'+
    '<div class="llm-status" id="llm-status" style="display:none"></div>';
  document.body.appendChild(modal);
  $("llm-save").onclick = function(){
    LLM_CONFIG.endpoint = $("llm-endpoint").value.trim();
    LLM_CONFIG.apiKey = $("llm-apikey").value.trim();
    LLM_CONFIG.model = $("llm-model").value.trim();
    LLM_CONFIG.enabled = true;
    LLM_CONFIG.cache = {};
    saveLLMConfig();
    updateLLMBadge();
    showLLMStatus("配置已保存，AI润色已开启。判定文本将自动进行文学性增强。","ok");
  };
  $("llm-toggle").onclick = function(){
    LLM_CONFIG.enabled = !LLM_CONFIG.enabled;
    saveLLMConfig();
    updateLLMBadge();
    this.textContent = LLM_CONFIG.enabled ? "关闭增强" : "开启增强";
    showLLMStatus(LLM_CONFIG.enabled?"AI润色已开启":"AI润色已关闭", LLM_CONFIG.enabled?"ok":"err");
  };
  $("llm-clear").onclick = function(){
    LLM_CONFIG.cache = {};
    showLLMStatus("缓存已清除","ok");
  };
  $("llm-close").onclick = closeLLMSettings;
}
function closeLLMSettings(){
  const m = $("llm-modal"); if(m) m.remove();
  const o = $("llm-overlay"); if(o) o.remove();
}
function showLLMStatus(msg,type){
  const s = $("llm-status");
  if(s){ s.style.display="block"; s.className="llm-status "+type; s.textContent=msg; }
}
/* LLM增强：标记待替换段落，异步替换 */
let _llmPending = [];
function markLLMPending(el){ _llmPending.push(el); el.classList.add("llm-pending"); }
window.addEventListener("llmEnhanced", function(e){
  const text = e.detail.text;
  if(!text || _llmPending.length===0) return;
  // 用增强文本替换第一个待替换段落，移除其余
  const first = _llmPending[0];
  if(first && first.parentNode){
    first.innerHTML = rich(text);
    first.classList.remove("llm-pending");
    first.classList.add("llm-enhanced");
  }
  for(let i=1;i<_llmPending.length;i++){
    if(_llmPending[i] && _llmPending[i].parentNode) _llmPending[i].remove();
  }
  _llmPending = [];
});

/* ============ v2 初始化 ============ */
async function init(){
  loadLLMConfig();
  $("btn-map").onclick=()=>v67_map.open();
  $("btn-pack").onclick=()=>togglePanel("pack");
  $("btn-realm").onclick=()=>togglePanel("realm");
  $("btn-log").onclick=()=>togglePanel("log");
  $("btn-save").onclick=()=>saveGame();
  $("btn-llm").onclick=()=>openLLMSettings();
  storyEl = $("story");
  /* /upg10inj:restore/ UPG-10 会话恢复优先（比本地存档更新鲜；失败则正常走读档/建号） */
  try{ if(typeof v92_sessionRestore === "function" && v92_sessionRestore()) return; }catch(e){}
  const saved = v61_lzstring.sniffRaw(localStorage.getItem(RULESET_ID+"-save")); /* /v61inj:save-init/ */
  if(saved){
    try{
      const d=saved; /* /v61inj:save-init2/ */
      if(d.ruleset===RULESET_ID && !d.ending){
        if(await askConfirm("检测到存档（第"+d.day+"日，"+d.name+"）。是否继续？")){
          try{ if(typeof v61_clearAll === 'function') v61_clearAll(); }catch(e){} /* /v61inj:perf-clear-init/ */
      S=applyDefaults(d); curNode = S.curNode||"fc_jiaohui_entry"; renderTop(); renderStats(); renderMapPanel(); writeNext(); return;
        }
        /* /v94inj:init/ 取消继续 → 进入主界面（不再直通捏人） */
        if(typeof v94_titleScreen==="function"){ v94_titleScreen(); return; }
      }
    }catch(e){}
  }
  S=emptyState();
  /* /v94inj:init2/ 无存档 → 主界面（开始游戏/读取存档/成就册/设定册），不再直通捏人 */
  if(typeof v94_titleScreen==="function"){ v94_titleScreen(); return; }
  showCreation();
}

/* ========== 战斗系统（40号：战略层战力差基调 / 战术层d100攻击检定 / 表现层乌贼风描写） ========== */
let COMBAT = null;

function combatOpt(text, fn){
  const b = document.createElement("button");
  b.className="opt";
  b.innerHTML = "<span class='od'>⚔</span> "+text;
  b.onclick = fn;
  $("options").appendChild(b);
}

/* 战略层：玩家战力 */
function playerPower(){
  const base = [5,20,60,150,400,800,1500,3000,6000][S.realm] || 5;
  const jobMod = (S.job==="warrior")?1.2:(S.job==="mage"?1.1:1.0);
  const stateMod = S.hp < S.maxHp*0.3 ? 0.7 : (S.hp < S.maxHp*0.6 ? 0.9 : 1.0);
  return Math.round(base * jobMod * stateMod);
}

/* 战略层：战力差定基调 */
function combatTone(p1,p2){
  const strong=Math.max(p1,p2), weak=Math.min(p1,p2);
  const diff=(strong-weak)/weak*100;
  if(diff>200) return "oneshot";
  if(diff>100) return "crush";
  if(diff>50) return "advantage";
  if(diff>10) return "slight";
  return "equal";
}

/* 战术层：攻击检定 d100+净修正≥50；暴击≥96 大失败≤5 */
function attackRoll(atkPower, defPower, advantage, disadvantage){
  let roll = Math.floor(Math.random()*100)+1;
  if(advantage) roll = Math.max(roll, Math.floor(Math.random()*100)+1);
  if(disadvantage) roll = Math.min(roll, Math.floor(Math.random()*100)+1);
  const diff = atkPower - defPower;
  let netMod = 0;
  if(diff>0){
    const pct = diff/defPower*100;
    netMod = pct>200?40:(pct>100?30:(pct>50?20:(pct>10?10:0)));
  }else{
    const pct = -diff/defPower*100;
    netMod = pct>200?-40:(pct>100?-30:(pct>50?-20:(pct>10?-10:0)));
  }
  const result = roll + netMod;
  if(roll<=5) return {roll, lvl:"fumble", hit:false, dmgMult:0, netMod};
  if(roll>=96) return {roll, lvl:"crit", hit:true, dmgMult:2, netMod};
  if(result>=80) return {roll, lvl:"perfect", hit:true, dmgMult:1.5, netMod};
  if(result>=50) return {roll, lvl:"hit", hit:true, dmgMult:1, netMod};
  if(result>=35) return {roll, lvl:"graze", hit:true, dmgMult:0.5, netMod};
  return {roll, lvl:"miss", hit:false, dmgMult:0, netMod};
}

/* 伤害计算 */
function calcDamage(atk, def, result){
  if(!result.hit) return 0;
  const base = atk.atk || 5;
  const d = def.def || 0;
  let dmg = Math.max(1, Math.round((base - d*0.3) * result.dmgMult));
  if(atk.power > def.power){
    const bonus = Math.min(0.8, (atk.power-def.power)/def.power*0.4);
    dmg = Math.round(dmg*(1+bonus));
  }
  return dmg;
}

/* 表现层：攻击描写 */
function combatAttackDesc(result){
  const d = COMBAT_TEXTS || {};
  return d["attack_"+result.lvl] || "";
}

/* 开始战斗 */
function startCombat(enemyId, context, afterNode){
  const e = ENEMIES[enemyId];
  if(!e){ writePar("（敌人数据缺失："+enemyId+"）","noind"); return; }
  const pp = playerPower();
  const tone = combatTone(pp, e.power);
  COMBAT = {
    enemy: Object.assign({}, e, {maxHp:e.hp}),
    playerPower: pp,
    tone: tone,
    round: 1,
    context: context || "",
    defending: false,
    afterNode: afterNode || null
  };
  writePar(e.desc, "noind");
  writePar((COMBAT_TEXTS["tone_"+tone])||COMBAT_TEXTS.tone_equal, "noind");
  if(e.realm>=4){ writePar(COMBAT_TEXTS.env_master, "noind"); }
  if(e.realm>=5){ writePar(COMBAT_TEXTS.env_grandmaster, "noind"); }
  renderCombatOptions();
}

function renderCombatOptions(){
  clearOptions();
  const desperate = COMBAT.tone==="oneshot" && COMBAT.playerPower < COMBAT.enemy.power;
  if(desperate){
    combatOpt("设法脱身", combatFlee);
    combatOpt("孤注一掷", function(){ combatPlayerAction("desperate"); });
    return;
  }
  combatOpt("攻击", function(){ combatPlayerAction("attack"); });
  combatOpt("防御（减伤反击）", function(){ combatPlayerAction("defend"); });
  if(S.job) combatOpt("职业技能", function(){ combatPlayerAction("skill"); });
  combatOpt("使用药水", function(){ combatPlayerAction("item"); });
  combatOpt("逃跑", combatFlee);
}

/* 玩家动作 */
function combatPlayerAction(action){
  if(!COMBAT) return;
  const e = COMBAT.enemy;
  const pp = COMBAT.playerPower;
  let advantage=false, atkBonus=0;

  if(action==="defend"){
    COMBAT.defending = true;
    writePar("你举起武器，扎稳下盘。呼吸放缓，视线锁住对方的肩线——那是发力的前兆。","noind");
  }else if(action==="skill"){
    const jobName = (JOBS[S.job]&&JOBS[S.job].cn)||S.job;
    writePar("你催动"+jobName+"的职业之力。空气里有什么东西被牵动了。","noind");
    atkBonus = Math.round(pp*0.15); advantage=true;
  }else if(action==="desperate"){
    writePar("你把所有的力气聚在这一击。成与不成，在此一举。","noind");
    advantage=true; atkBonus=Math.round(pp*0.3);
  }else if(action==="item"){
    const med = (S.items||[]).find(function(x){ return x.id==="medicine"||x.id==="potion"; });
    if(med){
      S.hp = Math.min(S.maxHp, S.hp+20);
      S.items = (S.items||[]).filter(function(x){ return x!==med; });
      writePar("你灌下一瓶药水。暖意从喉咙蔓延到四肢，伤口的疼痛减轻了。","noind");
      writePar("◆ 恢复 20 点生命。","res");
      setTimeout(function(){ combatEnemyTurn(); }, 300);
      return;
    }else{
      writePar("你摸遍全身，没有找到任何药水。","noind");
    }
  }

  if(action!=="defend" && action!=="item"){
    const result = attackRoll(pp+atkBonus, e.power, advantage, false);
    const dmg = calcDamage({power:pp+atkBonus, atk:8+S.realm*3}, {power:e.power, def:e.def}, result);
    writeDice(result.roll, 50+result.netMod, result.lvl);
    writePar(combatAttackDesc(result), "noind");
    if(result.hit && dmg>0){
      e.hp -= dmg;
      writePar("◆ "+e.cn+" 受到 "+dmg+" 点伤害。（"+Math.max(0,e.hp)+"/"+e.maxHp+"）","res");
    }else if(result.lvl==="fumble"){
      writePar("大失败：你用力过猛，脚下一滑，露出了致命的破绽。","risky");
      S.hp = Math.max(1, S.hp-5);
    }
    if(e.hp<=0){ endCombat(true); return; }
  }

  setTimeout(function(){ combatEnemyTurn(); }, 300);
}

/* 敌方回合 */
function combatEnemyTurn(){
  if(!COMBAT) return;
  const e = COMBAT.enemy;
  const pp = COMBAT.playerPower;
  const defBonus = COMBAT.defending ? Math.round(pp*0.2) : 0;
  COMBAT.defending = false;

  const result = attackRoll(e.power, pp+defBonus, false, false);
  const dmg = calcDamage({power:e.power, atk:e.atk}, {power:pp+defBonus, def:3+S.realm*2}, result);
  writeDice(result.roll, 50+result.netMod, result.lvl);

  if(result.hit && dmg>0){
    S.hp -= dmg;
    const hd = dmg>15?COMBAT_TEXTS.hit_crit:(dmg>8?COMBAT_TEXTS.hit_heavy:(dmg>4?COMBAT_TEXTS.hit_medium:COMBAT_TEXTS.hit_light));
    writePar(hd, "noind");
    writePar("◆ 你受到 "+dmg+" 点伤害。（"+Math.max(0,S.hp)+"/"+S.maxHp+"）","loss");
  }else{
    writePar("你侧身让过了 "+e.cn+" 的攻击。衣袂被劲风带起，又落下。","noind");
  }

  if(S.hp<=0){ endCombat(false); return; }
  COMBAT.round++;
  renderCombatOptions();
}

/* 逃跑 */
function combatFlee(){
  if(!COMBAT) return;
  const t = effTarget({check:{a:"AGI", sk:"stealth", label:"脱身"}});
  const roll = rollD100(); const lvl = tierOf(roll,t);
  writeDice(roll,t,lvl);
  if(lvl==="crit"||lvl==="extreme"||lvl==="hard"||lvl==="normal"){
    writePar(COMBAT_TEXTS.flee_success, "noind");
    COMBAT=null;
    writeNext();
  }else{
    writePar(COMBAT_TEXTS.flee_fail, "risky");
    S.hp = Math.max(1, S.hp-8);
    writePar("◆ 你受到 8 点伤害。","loss");
    if(S.hp<=0){ endCombat(false); return; }
    setTimeout(function(){ combatEnemyTurn(); }, 300);
  }
}

/* 结束战斗 */
function endCombat(victory){
  if(!COMBAT) return;
  const e = COMBAT.enemy;
  if(victory){
    writePar(COMBAT_TEXTS.victory_cost, "noind");
    if(e.loot){
      const r = applyEffects(e.loot, null);
      if(r) writePar(r, "res");
    }
    applyEffects({xp: 15+S.realm*8}, null);
    if(COMBAT && COMBAT.afterNode && N[COMBAT.afterNode]){ curNode = COMBAT.afterNode; }
  }else{
    writePar(COMBAT_TEXTS.defeat, "risky");
    S.hp = Math.max(1, Math.floor(S.maxHp*0.2));
    writePar("你重伤倒地。不知过了多久，在冷水泼脸的刺激下醒来——身上的财物少了三成。","noind");
    S.gold = Math.max(0, S.gold - Math.floor(S.gold*0.3));
    applyEffects({rep:-3}, null);
    if(COMBAT && COMBAT.afterNode && N[COMBAT.afterNode]){ curNode = COMBAT.afterNode; }
  }
  COMBAT = null;
  writeNext();
}

window.addEventListener("load",init);


/* ============================================================
   /ws1inj:hooks/ WS-1 行为-世界状态回路
   五维世界状态：war/church/guild/orc/seal（各 0-100，连续值）。
   v93_worldState()：只读映射——扫 S.flags 白名单 + S.worldWar/
   S.anchors/S.faction/S.trade 等既有键，计算世界状态；不写任何状态。
   v93_worldEcho(node)：命中主线枢纽节点前缀时，按档位取回响句，
   返回数组或 null（开关关闭/未命中时零注入）。
   铁律：不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义。 ===== */
window.v93_worldState = function(){
  const W = {war:33, church:33, guild:33, orc:33, seal:100};
  try{
    if(!S) return W;
    const F = S.flags||{};
    /* war 战争烈度 */
    if(F.war_intensified) W.war = Math.max(W.war, 66);
    if(F.warStage && Number(F.warStage)>=2) W.war = Math.max(W.war, 66);
    if(typeof S.worldWar==='number'){
      if(S.worldWar>=6) W.war = 100;
      else if(S.worldWar>=3) W.war = 80;
      else if(S.worldWar>=1) W.war = 50;
    }
    if(F.council_compromise_purification) W.war = Math.max(20, W.war-20);
    if(F.watcher_inherit) W.war = Math.max(20, W.war-25);
    /* church 教廷主导 */
    if(S.faction&&S.faction.joined==='light_church') W.church = Math.max(W.church, 66);
    if(F.council_support_purification) W.church = Math.max(W.church, 75);
    if(F.purge_intensified) W.church = Math.max(W.church, 90);
    if(F.council_oppose_purification) W.church = Math.min(W.church, 25);
    if(F.crisis_done) W.church = Math.min(W.church, 50);
    /* guild 商会掌控 */
    if(S.faction&&S.faction.joined==='free_cities') W.guild = Math.max(W.guild, 60);
    if(S.trade && typeof S.trade.total==='number'){
      if(S.trade.total>=500) W.guild = 85;
      else if(S.trade.total>=100) W.guild = 66;
    }
    if(F.trade_crisis) W.guild = Math.min(W.guild, 20);
    if(F.merchant_saved) W.guild = Math.max(W.guild, 60);
    /* orc 兽人关系 */
    if(F.grom_mediated) W.orc = Math.max(W.orc, 55);
    if(F.grom_helped) W.orc = Math.max(W.orc, 66);
    if(F.grom_protected) W.orc = Math.max(W.orc, 80);
    if(F.grom_professor_called) W.orc = Math.max(W.orc, 90);
    if(S.faction&&S.faction.joined==='orc_horde') W.orc = Math.max(W.orc, 66);
    /* seal 封印完整 */
    if(F.seal1_visited) W.seal = Math.min(W.seal, 90);
    if(F.seal5_fixed) W.seal = Math.max(W.seal, 70);
    if(F.seal6_sacrifice) W.seal = Math.max(W.seal, 60);
    if(F.abyss_spread) W.seal = Math.min(W.seal, 50);
    if(typeof S.anchors==='number'){
      if(S.anchors>=7) W.seal = 100;
      else if(S.anchors>=3) W.seal = Math.max(W.seal, 66);
    }
    /* 收敛到 0-100 */
    for(const k in W){ W[k]=Math.max(0, Math.min(100, Math.round(W[k]))); }
    try{ S.worldState = {war:W.war, church:W.church, guild:W.guild, orc:W.orc, seal:W.seal}; }catch(e){}
    return W;
  }catch(e){ try{ console.log("[ws1:err]", e); }catch(_){} return W; }
};
window.v93_worldEcho = function(node){
  try{
    if(!S || !S.settings || S.settings.worldEcho===false) return null;
    if(!node || !node.id) return null;
    const id = String(node.id);
    /* 主线枢纽前缀：purge/silver/seal/academy/orc */
    if(id.indexOf("purge_")!==0 && id.indexOf("silver_")!==0 && id.indexOf("seal_")!==0 &&
       id.indexOf("academy_")!==0 && id.indexOf("orc_")!==0) return null;
    const TPL = window.V93_WORLD_TPL; if(!TPL) return null;
    const W = window.v93_worldState();
    const keys = ["war","church","guild","orc"];
    /* seal 维度仅玩家接触过封印线（主线已触发/到过封印地/持有锚）才参与回响，防剧透 */
    let _sealOk = false;
    try{ _sealOk = !!(S.world && S.world.seal) || !!(S.flags && S.flags.seal1_visited) || (typeof S.anchors==='number' && S.anchors>0); }catch(e){}
    if(_sealOk) keys.push("seal");
    for(let i=0;i<keys.length;i++){
      const k = keys[i], v = W[k];
      const arr = TPL[k]; if(!arr || !arr.length) continue;
      let line = null;
      for(let j=0;j<arr.length;j++){
        if(v < arr[j].hi){ line = arr[j].lines[0]; break; }
      }
      if(!line) line = arr[arr.length-1].lines[0];
      /* 只注入与当前主线相关的维度（最多 1-2 维） */
      if((k==="war" && (id.indexOf("silver_")===0 || id.indexOf("orc_")===0)) ||
         (k==="church" && id.indexOf("purge_")===0) ||
         (k==="seal" && id.indexOf("seal_")===0) ||
         (k==="academy" && false)){
        try{ console.log("[ws1inj:echo]", k, v); }catch(e){}
        return [line];
      }
      if(k==="guild" && id.indexOf("silver_")===0){
        try{ console.log("[ws1inj:echo]", k, v); }catch(e){}
        return [line];
      }
    }
    /* 未命中专门维度时，取全局最显著状态（与基线差最大）做泛回响 */
    let pick=null, diff=0;
    for(let i=0;i<keys.length;i++){
      const k=keys[i], v=W[k];
      const base = (k==="seal")?100:33;
      const d = Math.abs(v-base);
      if(d>diff && d>25){ diff=d; pick=k; }
    }
    if(pick){
      const arr = TPL[pick]; if(arr){
        let line = null;
        for(let j=0;j<arr.length;j++){ if(W[pick] < arr[j].hi){ line=arr[j].lines[0]; break; } }
        if(!line) line = arr[arr.length-1].lines[0];
        try{ console.log("[ws1inj:echo]", pick, W[pick]); }catch(e){}
        return [line];
      }
    }
    return null;
  }catch(e){ try{ console.log("[ws1:err]", e); }catch(_){} return null; }
};
/* =====================================================================
 * /v94inj:main/ v94 游戏开始主界面 + 捏人分步向导 + 设定册
 * 铁律：saveVersion=48 不变；判定公式/writeNext/choose 零改动；旧档兼容（全独立键）
 * ===================================================================== */

/* ---------- 捏人分步：creationHTML v94 版（覆盖旧声明；判定/结算零改动，仅展示层分步） ---------- */
function creationHTML(){
  let h="<div id='creation-shell'>";
  h+="<div class='c-head'><div class='c-title'>无名旅者 · 建号</div>";
  h+="<p class='c-sub'>艾尔达历4037年，群雄割据之世。你从灰港的渡船上走下来，身无长物，唯有一身尚未定型的天资。你叫——</p></div>";
  h+="<div class='c-steps'><div class='c-step' data-step='1'><b>壹</b>　名讳与血脉<br><span style='font-size:11px;color:#9a8a68'>姓名·性别·种族</span></div><div class='c-step' data-step='2'><b>贰</b>　出身<br><span style='font-size:11px;color:#9a8a68'>九地·谱系</span></div><div class='c-step' data-step='3'><b>叁</b>　职业<br><span style='font-size:11px;color:#9a8a68'>一生的路</span></div><div class='c-step' data-step='4'><b>肆</b>　天资与爱好<br><span style='font-size:11px;color:#9a8a68'>天赋·爱好</span></div><div class='c-step' data-step='5'><b>伍</b>　理想·属性·启程<br><span style='font-size:11px;color:#9a8a68'>归宿·分配·开始旅程</span></div></div>";
  h+="<div class='c-body'><div class='c-main'>";
  /* 步骤一：名讳与血脉 */
  h+="<div class='cstep' data-step='1'>";
  h+="<div class='mt10' style='display:flex;gap:8px;align-items:center'><input type='text' id='in-name' maxlength='12' placeholder='输入你的名讳' value='"+esc(S.name||"")+"' style='flex:1;min-width:0'><button class='btn' id='v95-name-dice' type='button' title='按种族随机取名'>🎲 随机</button></div><div class='v95-name-cands' id='v95-name-cands'></div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>性别</h3><div class='sel-row'>";
  for(const g of ["男","女","隐秘"]){ h+="<button class='sel-card small' data-gender='"+g+"' "+(S.gender===g?"style='border-color:var(--gold)'":"")+">"+g+"</button>"; }
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>种族 · 七选一（决定血统天赋）</h3><div class='sel-row'>";
  for(const rk in RACES){ const r=RACES[rk]; h+="<button class='sel-card' data-race='"+rk+"' "+(S.race===rk?"style='border-color:var(--gold);color:var(--gold2)'":"")+"><span class='sc-t'>"+r.ic+" "+r.cn+"</span><span class='sc-d'>"+r.desc+"</span></button>"; }
  h+="</div>";
  h+="<div class='sel-row' id='subrace-box'><h3 class='mt10' style='color:var(--gold2)'>亚种族 · "+(RACES[S.race]?RACES[S.race].cn:"")+"（细选血统，决定属性/特性）</h3>";
  for(const sk in SUBRACES){ const sb=SUBRACES[sk]; if(sb.race!==S.race) continue;
    h+="<button class='sel-card' data-subrace='"+sk+"' "+(S.subrace===sk?"style='border-color:var(--gold);color:var(--gold2)'":"")+"><span class='sc-t'>"+sb.cn+"</span><span class='sc-d'>"+sb.desc+"</span>"+(sb.attrs&&Object.keys(sb.attrs).length?("<span class='sc-m' style='color:var(--cyan)'>"+Object.keys(sb.attrs).map(k=>ATTR_CN[k]+"+"+sb.attrs[k]).join(" ")+"</span>"):"")+(sb.skills&&Object.keys(sb.skills).length?("<span class='sc-m' style='color:var(--gold2)'>"+Object.keys(sb.skills).map(k=>skillCn(k)+"+"+sb.skills[k]).join(" ")+"</span>"):"")+(sb.traits&&sb.traits.length?("<span class='sc-m' style='color:var(--ok)'>特性："+sb.traits.join("·")+"</span>"):"")+"</button>";
  }
  h+="</div></div>";
  /* 步骤二：出身 */
  h+="<div class='cstep' data-step='2'>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>出身 · 九地（影响初始金币/技能/好感/序章；带★为适配职业推荐）</h3><div class='sel-row'>";
  for(const hk in HOMELANDS){ let _fit=""; try{ const F=window.FIT_MATRIX&&FIT_MATRIX[hk]||null; if(F){ const _top=[]; for(const jk in F){ if(F[jk].star>=3&&_top.length<3) _top.push(jk+" ★★★"); } if(_top.length<3){ for(const jk in F){ if(F[jk].star===2&&_top.length<3) _top.push(jk+" ★★"); } } if(_top.length) _fit="<span class='sc-m fit-badge'>适配："+_top.join(" · ")+"</span>"; } }catch(_){}
    h+=selCard(hk,HOMELANDS[hk],"homeland").replace("</button>",_fit+"</button>");
  }
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>出身谱系 · "+(RACES[S.race]?RACES[S.race].cn:"")+"（决定初始状态/人际关系/入学标签/序章剧情）</h3><div class='sel-row' id='background-box'>";
  for(const bk in BACKGROUNDS_FULL){ const bg=BACKGROUNDS_FULL[bk];
    if(bg.race!==S.race && bg.race!=="半身人" && bg.race!=="龙裔" && bg.race!=="混血") continue;
    if(bg.race==="半身人" && S.race!=="半身人") continue;
    if(bg.race==="龙裔" && S.race!=="龙裔") continue;
    if(bg.race==="混血" && S.race!=="混血") continue;
    h+="<button class='sel-card' data-background='"+bk+"' "+(S.background===bk?"style='border-color:var(--gold);color:var(--gold2)'":"")+"><span class='sc-t'>"+bg.icon+" "+bg.cn+"</span><span class='sc-d'>"+bg.desc+"</span><span class='sc-m' style='color:var(--gold2)'>初始金币："+bg.gold+" · 标签："+bg.label+"</span>"+(bg.attrs&&Object.keys(bg.attrs).length?("<span class='sc-m' style='color:var(--cyan)'>"+Object.keys(bg.attrs).map(k=>ATTR_CN[k]+"+"+bg.attrs[k]).join(" ")+"</span>"):"")+"</button>";
  }
  h+="</div></div>";
  /* 步骤三：职业 */
  h+="<div class='cstep' data-step='3'>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>主修职业 · 九选一</h3><div class='sel-row'>";
  for(const jk in JOBS){ const j=JOBS[jk]; let _fit=""; try{ if(S.homeland&&window.FIT_MATRIX&&FIT_MATRIX[S.homeland]&&FIT_MATRIX[S.homeland][jk]){ const f=FIT_MATRIX[S.homeland][jk]; _fit="<span class='sc-m fit-badge fit-"+f.star+"'>"+("★".repeat(f.star))+""+(f.star>=2?"":"·冷门")+" "+(f.why||"")+"</span>"; } }catch(_){}
    h+="<button class='sel-card' data-job='"+jk+"' "+(S.job===jk?"style='border-color:var(--gold)'":"")+"><span class='sc-t'>"+j.cn+"</span><span class='sc-d'>"+j.desc+"</span><span class='sc-m' style='color:var(--cyan)'>准则："+j.criterion+"</span>"+_fit+"</button>"; }
  h+="</div>";
  h+="<p class='sub mt5' style='color:var(--bad);font-size:12px'>※ 职业一生唯一，不可兼修。唯有神明能以神恩强行扭转凡人的职业根基；而神明不会轻易干涉世事。请慎重抉择。</p><p class='sub mt5' style='color:var(--gold2);font-size:12px'>※ "+(S.homeland?"已选出身："+(HOMELANDS[S.homeland]?HOMELANDS[S.homeland].cn:S.homeland)+"——卡片底部的★为适配提示。":"回到「贰 出身」选定故乡后，本页会显示每个职业的适配推荐（★★★契合 / ★★尚可 / ★冷门）。")+"</p></div>";
  /* 步骤四：天资与志趣 */
  h+="<div class='cstep' data-step='4'>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>天赋 · 四等（决定属性池与起跑线）</h3><div class='sel-row'>";
  for(const tk in TALENTS) h+=selCard(tk,TALENTS[tk],"talent");
  h+="</div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>爱好 · 十选一（决定擅长技能与专属际遇）</h3><div class='sel-row'>";
  for(const hk in HOBBIES) h+=selCard(hk,HOBBIES[hk],"hobby");
  h+="</div></div>";
  /* 步骤五：理想·属性与启程 */
  h+="<div class='cstep' data-step='5'>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>理想 · 八选一（决定结局归宿）</h3><div class='sel-row'>";
  for(const ik in IDEALS) h+=selCard(ik,IDEALS[ik],"ideal");
  h+="</div>";
  h+="<div class='v95-final' id='v95-final'></div>";
  h+="<h3 class='mt10' style='color:var(--gold2)'>六大属性分配　<span style='color:var(--dim);font-size:12px'>余 <span id='poolv'>"+pool+"</span> 点（20-80，判定按对应属性）</span></h3>";
  h+="<div class='v95-tpls'><span class='v95-tpl-label'>快速模板：</span><button class='btn sm' data-tpl='balanced'>均衡</button><button class='btn sm' data-tpl='str'>力量</button><button class='btn sm' data-tpl='agi'>敏捷</button><button class='btn sm' data-tpl='int'>法师</button><button class='btn sm' data-tpl='cha'>魅力</button></div>";
  h+="<p class='sub mt5' style='font-size:12px'>货币："+CURRENCY.rate+"（"+CURRENCY.sub+"）。"+CURRENCY.note+"</p>";
  for(const a of ATTRS){ h+="<div class='attr-row' data-a='"+a+"'><span class='nm'>"+ATTR_CN[a]+"</span><span class='val' id='val-"+a+"'>"+S.attrs[a]+"</span><span class='btns'><button class='btn ab' data-a='"+a+"' data-d='1'>+1</button><button class='btn ab' data-a='"+a+"' data-d='5'>+5</button><button class='btn' data-a='"+a+"' data-d='-1'>−1</button><button class='btn' data-a='"+a+"' data-d='-5'>−5</button></span><span class='note'>"+ATTR_DESC[a]+"</span></div>"; }
  h+="<div class='mt10' style='text-align:center'><button class='btn gold' id='btn-start' style='padding:10px 30px'>确认并踏入4037年 · 开始旅程</button></div>";
  h+="<p class='sub center mt10'>d100 六档判定 · 大成功01 / 极成功≤目标1/5 / 困难成功≤目标1/2 / 普通成功≤目标 / 失败 / 大失败=100或目标<50时≥96</p>";
  h+="</div>";
  h+="</div>";
  h+="<div class='c-side'><div id='v94-preview'><div class='pv-t'>✦ 此行将引向</div><div id='v94-preview-body'><div class='pv-row' style='color:#9a8a68'>选择出身、职业、理想与天资，这里会预告你序章与学院的开局走向。</div></div></div></div>";
  h+="</div>";
  h+="<div class='c-nav'><span class='hint' id='v94-nav-hint'>选择即定命运，之后仍可在旅途中改变活法。</span><span style='display:flex;gap:8px'><button class='btn' id='c-prev' style='visibility:hidden'>← 上一步</button><button class='btn gold' id='c-next'>下一步 →</button></span></div>";
  h+="</div>";
  return h;
}

/* ---------- 捏人分步：bindCreation v94 版（覆盖旧声明；保留全部判定与结算链） ---------- */
function bindCreation(){
  document.querySelectorAll("[data-gender]").forEach(b=>{
    b.onclick=()=>{ S.gender=b.dataset.gender; document.querySelectorAll("[data-gender]").forEach(x=>{x.style.borderColor="";}); b.style.borderColor="var(--gold)"; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-homeland]").forEach(b=>{
    b.onclick=()=>{ S.homeland=b.dataset.homeland; document.querySelectorAll("[data-homeland]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-background]").forEach(b=>{
    b.onclick=()=>{ S.background=b.dataset.background; document.querySelectorAll("[data-background]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-job]").forEach(b=>{
    b.onclick=()=>{ S.job=b.dataset.job; document.querySelectorAll("[data-job]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-race]").forEach(b=>{
    b.onclick=()=>{ S.race=b.dataset.race; S.subrace=null; document.querySelectorAll("[data-race]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)";
      const box=document.getElementById("subrace-box");
      if(box){ box.innerHTML="";
        const rc=RACES[S.race];
        const hd=document.createElement("h3"); hd.className="mt10"; hd.style.color="var(--gold2)"; hd.textContent="亚种族 · "+(rc?rc.cn:"")+"（细选血统，决定属性/特性）";
        box.appendChild(hd);
        for(const sk in SUBRACES){
          const sb=SUBRACES[sk]; if(sb.race!==S.race) continue;
          const btn=document.createElement("button"); btn.className="sel-card"; btn.dataset.subrace=sk;
          btn.innerHTML="<span class='sc-t'>"+sb.cn+"</span><span class='sc-d'>"+sb.desc+"</span>";
          if(sb.attrs&&Object.keys(sb.attrs).length){
            const s=Object.keys(sb.attrs).map(k=>ATTR_CN[k]+"+"+sb.attrs[k]).join(" ");
            btn.innerHTML+="<span class='sc-m' style='color:var(--cyan)'>"+s+"</span>";
          }
          if(sb.skills&&Object.keys(sb.skills).length){
            const s=Object.keys(sb.skills).map(k=>skillCn(k)+"+"+sb.skills[k]).join(" ");
            btn.innerHTML+="<span class='sc-m' style='color:var(--gold2)'>"+s+"</span>";
          }
          if(sb.traits&&sb.traits.length) btn.innerHTML+="<span class='sc-m' style='color:var(--ok)'>特性："+sb.traits.join("·")+"</span>";
          btn.onclick=()=>{ S.subrace=sk; box.querySelectorAll("[data-subrace]").forEach(x=>{x.style.borderColor="";x.style.color="";}); btn.style.borderColor="var(--gold)"; btn.style.color="var(--gold2)"; v94_creationPreview(); };
          box.appendChild(btn);
        }
      }
      v94_creationPreview();
    };
  });
  document.querySelectorAll("[data-talent]").forEach(b=>{
    b.onclick=()=>{ S.talent=b.dataset.talent; document.querySelectorAll("[data-talent]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; const np=300+talentPoolBonus()-(S.attrs.SPR+S.attrs.STR+S.attrs.AGI+S.attrs.INT+S.attrs.CHA+S.attrs.CON); pool=np; const pv=document.getElementById("poolv"); if(pv) pv.textContent=np; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-hobby]").forEach(b=>{
    b.onclick=()=>{ S.hobby=b.dataset.hobby; document.querySelectorAll("[data-hobby]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; v94_creationPreview(); };
  });
  document.querySelectorAll("[data-ideal]").forEach(b=>{
    b.onclick=()=>{ S.ideal=b.dataset.ideal; document.querySelectorAll("[data-ideal]").forEach(x=>{x.style.borderColor="";x.style.color="";}); b.style.borderColor="var(--gold)"; b.style.color="var(--gold2)"; v94_creationPreview(); };
  });
  document.querySelectorAll(".ab").forEach(b=>{
    b.onclick=()=>{
      const a=b.dataset.a, d=parseInt(b.dataset.d);
      const old=S.attrs[a];
      const np = pool - d;
      const nv = old + d;
      if(nv<20||nv>80){ flashMsg("超出范围（20-80）"); return; }
      if(np<0){ flashMsg("点数不足"); return; }
      S.attrs[a]=nv; pool=np;
      const v=$("val-"+a); if(v) v.textContent=nv;
      const pv=document.getElementById("poolv"); if(pv) pv.textContent=np;
    };
  });
  const bp=$("btn-start");
  if(bp) bp.onclick=()=>{
    const name = $("in-name").value.trim();
    if(!name){ flashMsg("请先写下你的名讳"); return; }
    if(!S.job){ flashMsg("请选择主修职业"); return; }
    if(!S.ideal){ flashMsg("请选择你的理想"); return; }
    if(pool<0){ flashMsg("点数分配有误"); return; }
    S.name = name.slice(0,12);
    if(!S.subrace){ flashMsg("请选择亚种族"); return; }
    S.maxSan = Math.round(S.attrs.SPR*1.5);
    if(!S.san) S.san=S.maxSan;
    const SR = SUBRACES[S.subrace]||{};
    for(const k in (SR.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+SR.attrs[k]);
    for(const k in (SR.skills||{})) S.skills[k]=(S.skills[k]||0)+SR.skills[k];
    for(const k in (SR.flags||[])) S.flags[SR.flags[k]]=true;
    const H = HOMELANDS[S.homeland]||{};
    S.gold = Math.max(5, S.gold + (H.gold||0));
    for(const k in (H.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+H.attrs[k]);
    for(const k in (H.skills||{})) S.skills[k]=(S.skills[k]||0)+H.skills[k];
    for(const k in (H.infl||{})) S.infl[k]=(S.infl[k]||0)+H.infl[k];
    if(H.san) S.san = Math.max(0, S.maxSan + H.san);
    if(H.flag) S.flags[H.flag]=true;
    if(!S.background) S.background = "human_orphan";
    const BG = BACKGROUNDS_FULL[S.background]||{};
    S.gold = Math.max(0, S.gold + (BG.gold||0));
    for(const k in (BG.attrs||{})) S.attrs[k]=Math.min(80,S.attrs[k]+BG.attrs[k]);
    for(const k in (BG.skills||{})) S.skills[k]=(S.skills[k]||0)+BG.skills[k];
    if(BG.label) S.flags.enrollment_label = BG.label;
    if(BG.hidden) S.flags[BG.hidden]=true;
    if(!S.settings) S.settings={};
    if(S.settings.pagedReading===undefined) S.settings.pagedReading=true;
    S.prologueState = {background:S.background, day:1, opportunitiesTriggered:[], crisisTriggered:false, admissionReceived:false};
    const T = TALENTS[S.talent]||{};
    if(typeof T.apply==="function"){ T.apply(); }
    else{
      for(const k in (T.skills||{})) S.skills[k]=(S.skills[k]||0)+T.skills[k];
      if(T.xp) S.xp+=T.xp;
      if(T.flag) S.flags[T.flag]=true;
    }
    const HB = S.hobby?HOBBIES[S.hobby]:null;
    if(HB){ if(HB.s) S.skills[HB.s]=(S.skills[HB.s]||0)+(HB.v||0); if(HB.flag) S.flags[HB.flag]=true; }
    const j=JOBS[S.job]; if(j&&j.skill) S.skills[j.skill]=Math.max(S.skills[j.skill]||0,15);
    S.san = (S.san>0 && S.san<=S.maxSan) ? S.san : S.maxSan;
    S.hp = maxHp();
    S.flags.job_chosen=true;
    logMsg("旅者 "+S.name+" 诞生 · "+(SUBRACES[S.subrace]?SUBRACES[S.subrace].cn:"")+" · 主修："+j.cn+" · 出身："+(HOMELANDS[S.homeland]?HOMELANDS[S.homeland].cn:"")+" · 理想："+(IDEALS[S.ideal]?IDEALS[S.ideal].cn:""),"l");
    closeModal();
    if(typeof initForeshadowingV27 === 'function') initForeshadowingV27();
    if(typeof initMoralChoicesV27 === 'function') initMoralChoicesV27();
    if(typeof initTimeV26 === 'function') initTimeV26();
    const originMapV27 = {free:"origin_free_city_1",north:"origin_northern_1",south:"origin_southern_1",church:"origin_church_1",elf:"origin_elf_1",dwarf:"origin_dwarf_1",orc:"origin_orc_1",east:"origin_eastern_1",desert:"origin_desert_1"};
    const originNode = originMapV27[S.homeland];
    if(originNode && (N[originNode] || (typeof NODE_MAP!=="undefined" && NODE_MAP[originNode]))){
      curNode = originNode;
      S.flags.prologueV27 = true;
    } else if(originNode){
      curNode = originNode;
      S.flags.prologueV27 = true;
    } else {
      curNode = "prologue_start";
    }
    S.day = 1; S.date = fmtDate(S.day);
    renderTop(); renderStats();
    try{ if(typeof v92_sessionClear === 'function') v92_sessionClear(); }catch(e){}
    if(window.v94_birthCard&&window.v94_birthCardText){
      const __birth=v94_birthCardText();
      v94_birthCard(__birth,function(){ try{ writeNext(); }catch(e){ try{ console.log("[v95:birth:writeNext]",e); }catch(_){} } });
    } else { writeNext(); }
  };
  /* /v94inj:stepnav/ 分步导航 */
  const prev=document.getElementById("c-prev"), next=document.getElementById("c-next");
  if(prev) prev.onclick=()=>v94_showStep(v94_step-1);
  if(next) next.onclick=()=>{ if(v94_step>=5){ if(window.v94_creationReady) v94_creationReady(); } else v94_showStep(v94_step+1); };
  document.querySelectorAll("#creation-shell .c-step").forEach(el=>{ el.onclick=()=>v94_showStep(+el.dataset.step); });
  /* /v95inj:mp9a/ 随机名按钮 */
  const dice=document.getElementById("v95-name-dice");
  if(dice) dice.onclick=()=>v94_rollName();
  /* /v95inj:mp9b/ 属性模板 */
  document.querySelectorAll("[data-tpl]").forEach(b=>{
    b.onclick=()=>{
      const presets={balanced:{STR:40,CON:40,AGI:40,INT:40,SPR:40,CHA:40},str:{STR:60,CON:45,AGI:35,INT:30,SPR:30,CHA:35},agi:{AGI:60,STR:40,CON:35,INT:35,SPR:35,CHA:30},int:{INT:60,SPR:40,STR:30,CON:35,AGI:30,CHA:35},cha:{CHA:60,SPR:40,STR:30,CON:35,AGI:30,INT:35}};
      const p=presets[b.dataset.tpl]; if(!p) return;
      const sum=Object.keys(p).reduce((a,k)=>a+p[k],0);
      const cap=300+talentPoolBonus();
      if(sum>cap){ flashMsg("该模板超出当前属性池（"+cap+"），请先选择更高的天资"); return; }
      for(const k in p) S.attrs[k]=p[k];
      pool=cap-sum;
      for(const a of ATTRS){ const v=document.getElementById("val-"+a); if(v) v.textContent=S.attrs[a]; }
      const pv=document.getElementById("poolv"); if(pv) pv.textContent=pool;
      v94_creationPreview(); if(window.v94_renderFinalCheck) v94_renderFinalCheck();
      if(window.v94_sfx) v94_sfx("click");
    };
  });
  /* /v95inj:mp10a/ 选卡音效（委托） */
  document.addEventListener("click",function(e){ const c=e.target.closest(".sel-card"); if(c&&window.v94_sfx) v94_sfx("click"); });
  /* 名字输入即时刷新终审卡 */
  const ni=document.getElementById("in-name");
  if(ni) ni.addEventListener("input",function(){ if(window.v94_renderFinalCheck) v94_renderFinalCheck(); });
  v94_showStep(1);
}

/* ---------- 分步导航 + 剧情对齐预览 ---------- */
let v94_step=1;
function v94_showStep(n){
  v94_step=Math.max(1,Math.min(5,n));
  document.querySelectorAll("#creation-shell .cstep").forEach(el=>{ el.classList.toggle("on", +el.dataset.step===v94_step); });
  document.querySelectorAll("#creation-shell .c-step").forEach(el=>{
    const s=+el.dataset.step;
    el.classList.toggle("on", s===v94_step);
    el.classList.toggle("done", s<v94_step);
  });
  const prev=document.getElementById("c-prev");
  if(prev) prev.style.visibility = v94_step<=1 ? "hidden":"visible";
  const next=document.getElementById("c-next");
  if(next){ if(v94_step>=5){ next.textContent="✦ 开始旅程"; } else { next.textContent="下一步 →"; } }
  const hint=document.getElementById("v94-nav-hint");
  if(hint){
    if(v94_step===1) hint.textContent="先定名讳与血统。亚种族决定你的天赋与起跑线。";
    else if(v94_step===2) hint.textContent="出身决定你的序章开场：九地各有各的起点。";
    else if(v94_step===3) hint.textContent="职业一生唯一，决定你的戒律与路径。";
    else if(v94_step===4) hint.textContent="天资与爱好带来专属际遇；理想将在下一步与属性一同决定。";
    else hint.textContent="理想决定结局归宿；分配属性（20-80），余点来自天赋。准备好就踏入4037年。";
  }
  v94_creationPreview();
  if(window.v94_renderFinalCheck) v94_renderFinalCheck();
  if(window.v94_sfx) v94_sfx("step");
}
window.v94_showStep=v94_showStep;
function v94_creationReady(){ const b=document.getElementById("btn-start"); if(b) b.click(); }
window.v94_creationReady=v94_creationReady;
function v94_creationPreview(){
  try{
    const body=document.getElementById("v94-preview-body"); if(!body) return;
    let rows="";
    const P=window.ORIGIN_PROFILE||{};
    const add=function(k,v){ if(!v) return; rows+="<div class='pv-row'><span class='k'>"+k+"</span><br><span class='v'>"+v+"</span></div>"; };
    if(S.subrace){
      let fam=(P.subrace_to_family&&P.subrace_to_family[S.subrace])||"";
      let note=(P.subrace_note&&P.subrace_note[fam])||"";
      const sb=SUBRACES[S.subrace];
      add("血脉 · "+(sb?sb.cn:""), note||(sb?sb.desc:""));
    }
    if(S.homeland){
      const H=HOMELANDS[S.homeland];
      const map={free:"自由城邦·灰港线",north:"北境·铁门关线",south:"南方商盟线",church:"教会辖区·圣辉城线",elf:"精灵林邦线",dwarf:"矮人山国线",orc:"兽人草原线",east:"东部王国·帝京线",desert:"死亡沙漠线"};
      const line=map[S.homeland]||"";
      add("出身 · "+(H?H.cn:"")+(line?"（"+line+"）":""), (P.identity&&P.identity[S.homeland])?P.identity[S.homeland]:(H?H.start:""));
    }
    if(S.job){
      const j=JOBS[S.job];
      add("职业 · "+(j?j.cn:""), (P.job_sight&&P.job_sight[S.job])?P.job_sight[S.job]:(j?j.desc:""));
      if(j&&j.vow) add("戒律", j.vow);
    }
    if(S.ideal){
      const id=IDEALS[S.ideal];
      add("理想 · "+(id?id.cn:""), (P.ideal_reaction&&P.ideal_reaction[S.ideal])?P.ideal_reaction[S.ideal]:(id?id.desc:""));
      if(id&&id.echo) add("结局回响", id.echo);
    }
    if(S.hobby){
      const hb=HOBBIES[S.hobby];
      add("爱好 · "+(hb?hb.cn:""), (P.hobby_note&&P.hobby_note[S.hobby])?P.hobby_note[S.hobby]:(hb?hb.desc:""));
    }
    if(S.talent){
      const t=TALENTS[S.talent];
      add("天资 · "+(t?t.cn:""), (P.talent_judge&&P.talent_judge[S.talent])?P.talent_judge[S.talent]:(t?t.desc:""));
    }
    if(!rows) rows="<div class='pv-row' style='color:#9a8a68'>选择出身、职业、理想与天资，这里会预告你序章与学院的开局走向。</div>";
    let head="<div class='pv-attrline'>";
    for(const a of ATTRS){ head+="<span class='pv-attr'><i>"+ATTR_CN[a]+"</i><b>"+S.attrs[a]+"</b></span>"; }
    head+="</div><div class='pv-pool'>余 <b>"+(typeof pool!=="undefined"?pool:"?")+"</b> 点</div>";
    const _slots=["race","subrace","homeland","background","job","talent","hobby","ideal"];
    const _miss=_slots.filter(k=>!S[k]);
    const _sum="<div class='pv-dim'>已定 "+(8-_miss.length)+"/8"+( _miss.length?(" · 待定："+_miss.map(k=>k==="race"?"种族":k==="subrace"?"亚种":k==="homeland"?"出身":k==="background"?"谱系":k==="job"?"职业":k==="talent"?"天资":k==="hobby"?"爱好":"理想").join("、")):"")+"</div>";
    body.innerHTML=head+_sum+rows;
  }catch(e){}
}
window.v94_creationPreview=v94_creationPreview;

/* ============ /v95inj:mp4/ MP-4 终审卡 ============ */
window.v94_renderFinalCheck=function(){
  try{
    const box=document.getElementById("v95-final"); if(!box) return;
    const name=(function(){ const i=document.getElementById("in-name"); return i?(i.value||"").trim():(S.name||""); })();
    const items=[
      {k:"名讳", v:name||"未定", s:1, hint:"写下你的名字"},
      {k:"性别", v:S.gender||"未定", s:1},
      {k:"种族", v:S.race?(RACES[S.race]?RACES[S.race].cn:S.race):"未定", s:1},
      {k:"亚种", v:S.subrace?(SUBRACES[S.subrace]?SUBRACES[S.subrace].cn:S.subrace):"未定", s:1},
      {k:"出身", v:S.homeland?(HOMELANDS[S.homeland]?HOMELANDS[S.homeland].cn:S.homeland):"未定", s:2, hint:"决定序章开场与初始金币"},
      {k:"谱系", v:S.background?(BACKGROUNDS_FULL[S.background]?BACKGROUNDS_FULL[S.background].cn:S.background):"未定", s:2},
      {k:"职业", v:S.job||"未定", s:3, hint:"一生唯一，含戒律"},
      {k:"天资", v:S.talent?(TALENTS[S.talent]?TALENTS[S.talent].cn:S.talent):"未定", s:4},
      {k:"爱好", v:S.hobby?(HOBBIES[S.hobby]?HOBBIES[S.hobby].cn:S.hobby):"未定", s:4},
      {k:"理想", v:S.ideal?(IDEALS[S.ideal]?IDEALS[S.ideal].cn:S.ideal):"未定", s:5, hint:"决定结局归宿"}
    ];
    let h="<div class='pv-t'>✦ 终审 · 十项</div>";
    for(let i=0;i<items.length;i++){ const it=items[i];
      h+="<button class='v95-final-row' data-go='"+(it.s||1)+"'><span class='k'>"+(it.k)+"</span><span class='v'>"+(it.v||"")+"</span>"+(it.hint?"<span class='h'>"+(it.hint)+"</span>":"")+"</button>";
    }
    box.innerHTML=h;
    box.querySelectorAll("[data-go]").forEach(b=>{ b.onclick=()=>{ if(window.v94_showStep) v94_showStep(+b.dataset.go); }; });
  }catch(e){}
};
/* ============ /v95inj:mp9/ MP-9 随机名 ============ */
window.v94_rollName=function(){
  try{
    const box=document.getElementById("v95-name-cands"); if(!box) return;
    const rc=(S.race&&RACES&&RACES[S.race])?S.race:"human";
    const poolArr=((window.NAME_POOL&&NAME_POOL[rc])||(window.NAME_POOL&&NAME_POOL.human)||[]);
    if(!poolArr.length) return;
    const pick=[];
    for(let i=0;i<3;i++){ const n=poolArr[Math.floor(Math.random()*poolArr.length)]; if(pick.indexOf(n)<0) pick.push(n); if(pick.length>=3) break; }
    let h="<span class='v95-nc-label'>候选：</span>";
    for(let i=0;i<pick.length;i++){ h+="<button class='btn sm v95-nc' data-n='"+pick[i]+"'>"+pick[i]+"</button>"; }
    box.innerHTML=h;
    box.querySelectorAll("[data-n]").forEach(b=>{ b.onclick=()=>{ const i=document.getElementById("in-name"); if(i){ i.value=b.dataset.n; if(window.v94_renderFinalCheck) v94_renderFinalCheck(); } }; });
    if(window.v94_sfx) v94_sfx("click");
  }catch(e){}
};
/* ============ /v95inj:mp10/ MP-10 捏人音效 ============ */
window.v94_sfx=function(type){
  try{
    if(!window.V34||!V34.audioSettings) return;
    if(!V34.audioSettings.audioEnabled) return;
    const vol=(V34.audioSettings.sfxVolume!==undefined)?V34.audioSettings.sfxVolume:0.6;
    if(!window.AC){ try{ if(typeof acInit==="function") acInit(); }catch(e){} }
    const ac=window.AC; if(!ac) return;
    const t0=ac.currentTime;
    const o=ac.createOscillator(), g=ac.createGain();
    o.connect(g); g.connect(ac.destination);
    let f=440, dur=0.09, v=0.05*vol;
    if(type==="step"){ f=330; dur=0.07; }
    else if(type==="click"){ f=520; dur=0.05; }
    else if(type==="start"){ f=220; dur=0.5; }
    g.gain.setValueAtTime(v,t0);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.frequency.setValueAtTime(f,t0);
    if(type==="start"){ o.frequency.exponentialRampToValueAtTime(440,t0+0.4); }
    o.type="triangle";
    o.start(t0); o.stop(t0+dur);
  }catch(e){}
};
/* ============ /v95inj:mp11/ MP-11 出生微叙事 ============ */
window.v94_birthCardText=function(){
  try{
    const P=window.ORIGIN_PROFILE||{};
    const parts=[];
    if(S.homeland&&P.identity&&P.identity[S.homeland]) parts.push(P.identity[S.homeland][0]||P.identity[S.homeland]);
    else if(S.homeland&&HOMELANDS[S.homeland]) parts.push(HOMELANDS[S.homeland].start||"");
    if(S.job&&P.job_sight&&P.job_sight[S.job]) parts.push(P.job_sight[S.job][0]||P.job_sight[S.job]);
    if(S.ideal&&P.ideal_reaction&&P.ideal_reaction[S.ideal]) parts.push(P.ideal_reaction[S.ideal][0]||P.ideal_reaction[S.ideal]);
    if(!parts.length) parts.push("你从灰港的渡船上醒来，晨雾未散，潮水正漫过栈桥的木桩。船工们把缆绳扔给你，没人问你的名字。");
    return parts.join("\n\n");
  }catch(e){ return "你从灰港的渡船上醒来，晨雾未散。"; }
};
window.v94_birthCard=function(txt,cb){
  try{
    const old=document.getElementById("v95-birth"); if(old) old.remove();
    const el=document.createElement("div"); el.id="v95-birth"; el.className="v95-overlay";
    el.innerHTML="<div class='v95-birth-card'><div class='v95-birth-kicker'>艾尔达历 4037 年 · 灰港</div><div class='v95-birth-title'>启程</div><div class='v95-birth-body'>"+(txt||"").split("\n\n").map(p=>"<p>"+p+"</p>").join("")+"</div><button class='btn gold' id='v95-birth-go' style='padding:10px 26px'>启程 →</button></div>";
    document.body.appendChild(el);
    document.getElementById("v95-birth-go").onclick=function(){ el.remove(); if(window.v94_sfx) v94_sfx("start"); if(cb) cb(); };
  }catch(e){ if(cb) cb(); }
};

/* ---------- 游戏开始主界面 ---------- */
window.v94_ui={shown:false};
window.v94_titleScreen=function(){
  try{
    if(window.v94_ui.shown) return;
    const saved=(typeof v61_lzstring!=="undefined"&&v61_lzstring.sniffRaw)?v61_lzstring.sniffRaw(localStorage.getItem(RULESET_ID+"-save")):null;
    let el=document.getElementById("title-screen");
    if(el) el.remove();
    el=document.createElement("div"); el.id="title-screen";
    el.innerHTML="<div class='ts-inner'>"+
      "<div class='ts-kicker'>艾尔达大陆 · 九域并立</div>"+
      "<div class='ts-title'>群雄割据</div>"+
      "<div class='ts-sub'>艾尔达历 4037 年</div>"+
      "<div class='ts-rule'></div>"+
      "<div class='ts-verse'>诸神远去，深渊在封印之下低语。<br>七枚锚镇着大陆的脊梁，金秤世家守着无人知晓的墓园。<br>你从灰港的渡船上走下来——这一刻，大陆的命运尚无定论。</div>"+
      (saved?("<button class='ts-btn continue' id='ts-continue'>▶ 继续旅程</button>"):"")+
      "<div class='ts-btns'>"+
      "<button class='ts-btn primary' id='ts-new'>✦ 开始新旅</button>"+
      "<button class='ts-btn' id='ts-load'>📜 读取存档</button>"+
      "<button class='ts-btn' id='ts-ach'>⚑ 成就册</button>"+
      "<button class='ts-btn' id='ts-codex'>📖 设定册</button>"+
      "</div>"+
      "<div class='ts-foot'>v94 · 单文件版 · 本地存档"+(saved?" · 检测到存档（第"+(saved.day||"?")+"日，"+(saved.name||"无名")+""+(saved.job?" · "+saved.job:"")+"）":"")+"</div>"+
      "</div>";
    document.body.appendChild(el);
    window.v94_ui.shown=true;
    const _c=document.getElementById("ts-continue");
    if(_c) _c.onclick=function(){ v94_loadSave(); };
    document.getElementById("ts-new").onclick=function(){
      const s2=(typeof v61_lzstring!=="undefined"&&v61_lzstring.sniffRaw)?v61_lzstring.sniffRaw(localStorage.getItem(RULESET_ID+"-save")):null;
      const go=function(){ v94_hideTitle(); v94_introFlow(); };
      if(s2){
        v94_askSlot(function(n){
          if(!n) return;
          window.__v95_newSlot="slot"+n;
          askConfirm("将覆盖「"+((n===1)?(s2.name||"当前存档"):("槽位"+n))+"」。确定开始新旅？").then(function(ok){ if(ok){ go(); } });
        });
      } else { go(); }
    };
    document.getElementById("ts-load").onclick=function(){ if(window.v34_openSavePanel){ v34_openSavePanel(); } else { v94_loadSave(); } };
    document.getElementById("ts-ach").onclick=function(){ if(window.v34_openAchievements) v34_openAchievements(); };
    document.getElementById("ts-codex").onclick=function(){ v94_settingPanel(); };
  }catch(e){ try{ console.log("[v94:title:err]",e); }catch(_){} }
};
window.v94_hideTitle=function(){ const el=document.getElementById("title-screen"); if(el) el.remove(); window.v94_ui.shown=false; };
/* /v95inj:slot/ MP-2 槽位选择弹层（ts-new 新建前选槽；纯独立 DOM） */
window.v94_askSlot=function(cb){
  try{
    const old=document.getElementById("v95-slot-pick"); if(old) old.remove();
    const el=document.createElement("div"); el.id="v95-slot-pick"; el.className="v95-overlay";
    const names=["槽位一","槽位二","槽位三"];
    let h="<div class='v95-slot-card'><div class='pv-t'>✦ 存档槽位</div><p style='font-size:13px;color:#9a8a68;margin:6px 0 12px'>新的旅程将写入所选槽位。</p>";
    for(let i=0;i<3;i++){
      const _raw=localStorage.getItem(i===0?RULESET_ID+"-save":("elda-save-slot-slot"+(i+1)));
      let _d=null; try{ _d=_raw?v61_lzstring.sniffRaw(_raw):null; }catch(_){}
      h+="<button class='sel-card' data-slot='"+(i+1)+"' style='width:100%;text-align:left;margin:6px 0'><span class='sc-t'>"+names[i]+"</span><span class='sc-d'>"+(_d?(("第"+(_d.day||1)+"日 · "+(_d.name||"无名"))):"（空）")+"</span></button>";
    }
    h+="<div style='margin-top:10px;text-align:center'><button class='btn' id='v95-slot-cancel'>取消</button></div></div>";
    el.innerHTML=h;
    document.body.appendChild(el);
    el.querySelectorAll("[data-slot]").forEach(function(b){ b.onclick=function(){ const n=+b.dataset.slot; el.remove(); cb(n); }; });
    document.getElementById("v95-slot-cancel").onclick=function(){ el.remove(); cb(null); };
  }catch(e){ try{ console.log("[v95:slot:err]",e); }catch(_){} }
};
window.v94_startNew=function(){
  try{
    S=emptyState();
    try{ if(typeof u7_ngInherit==="function") u7_ngInherit(); }catch(e){}
    if(window.__v95_newSlot){ try{ S.slotId=window.__v95_newSlot; }catch(_){} window.__v95_newSlot=null; }
    curNode=null;
    showCreation();
  }catch(e){ try{ console.log("[v94:new:err]",e); }catch(_){} }
};
/* ================= /v95inj:intro/ MP-5 世界导入屏（4 屏幻灯片） ================= */
window.v94_introFlow=function(){
  try{
    const old=document.getElementById("v95-intro"); if(old) old.remove();
    const el=document.createElement("div"); el.id="v95-intro"; el.className="v95-intro";
    const _veteran=(function(){ try{ const d=JSON.parse(localStorage.getItem(window.ELDA_ACHIEVEMENTS_KEY||"elda_achievements")||"null"); return !!(d&&((d.achievements&&Object.keys(d.achievements).length)||(d.unlockedEndings&&Object.keys(d.unlockedEndings).length))); }catch(_){ return false; } })();
    let slides=[];
    /* 屏1 · 世界大势（LOREBOOK constant 前 4 条） */
    let s1="<div class='v95-intro-kicker'>艾尔达历 4037 年 · 世界大势</div><div class='v95-intro-tit'>诸神远去之后</div><div class='v95-intro-body'>";
    try{ const LB=window.LOREBOOK||[]; let c=0; for(let i=0;i<LB.length&&c<3;i++){ const e=LB[i]; if(!e||!e.constant) continue; s1+="<p>◆ "+(e.title||"")+"："+(e.text||"")+"</p>"; c++; } }catch(_){}
    s1+="</div>";
    slides.push(s1);
    /* 屏2 · 九域 */
    let s2="<div class='v95-intro-kicker'>大陆舆图</div><div class='v95-intro-tit'>九域并立</div><div class='v95-intro-body v95-region-grid'>";
    try{ const R=window.REGIONS||{}; const order=["north","free","south","east","west","desert","elf","dwarf","orc"]; for(let i=0;i<order.length;i++){ const k=order[i]; const r=R[k]; if(!r) continue; s2+="<div class='v95-region-card'><b>"+(r.cn||k)+"</b><span>"+(r.desc||"")+"</span></div>"; } }catch(_){}
    s2+="</div>";
    slides.push(s2);
    /* 屏3 · 五主线 */
    let s3="<div class='v95-intro-kicker'>时代洪流</div><div class='v95-intro-tit'>命运的五根线</div><div class='v95-intro-body'>";
    try{ const W=window.WORLD_EVENTS||{}; const order=["purge","silver","seal","academy","orc"]; for(let i=0;i<order.length;i++){ const k=order[i]; const w=W[k]; if(!w) continue; s3+="<p>◇ 第"+(w.day||"?")+"日 · "+(w.cn||k)+"："+(w.text||"")+"</p>"; } }catch(_){}
    s3+="</div>";
    slides.push(s3);
    /* 屏4 · 你的开局 */
    slides.push("<div class='v95-intro-kicker'>旅程起点</div><div class='v95-intro-tit'>灰港的渡船</div><div class='v95-intro-body'><p>你在灰港的渡船上醒来。身无长物，唯有一身尚未定型的天资。</p><p>名讳、血脉、出身、职业、理想——五道抉择将决定你以何种面目踏入这个时代。</p><p class='v95-intro-dim'>命运不会等你准备好，它只会等你下船。</p></div>");
    let cur=0;
    const render=function(){
      const p=document.getElementById("v95-intro-page");
      if(!p) return;
      p.innerHTML="<div class='v95-intro-slide'>"+slides[cur]+"</div>";
      const dots=document.getElementById("v95-intro-dots");
      if(dots){ let d=""; for(let i=0;i<slides.length;i++){ d+="<span class='v95-dot"+(i===cur?" on":"")+"'></span>"; } dots.innerHTML=d; }
      const back=document.getElementById("v95-intro-back"), fwd=document.getElementById("v95-intro-fwd");
      if(back) back.style.visibility = cur<=0?"hidden":"visible";
      if(fwd){ fwd.textContent = cur>=slides.length-1?"开始捏人 →":"下一页 →"; }
      const sk=document.getElementById("v95-intro-skip");
      if(sk){ sk.textContent=_veteran?"跳过 >>（老旅人）":"跳过 >>"; sk.style.borderColor=_veteran?"var(--gold)":""; }
    };
    el.innerHTML="<div class='v95-intro-inner'><div class='v95-intro-top'><span class='v95-intro-brand'>艾尔达大陆 · 群雄割据</span><button class='v95-intro-skip' id='v95-intro-skip'>跳过 >></button></div><div id='v95-intro-page'></div><div class='v95-intro-nav'><button class='btn' id='v95-intro-back'>← 上页</button><div class='v95-dots' id='v95-intro-dots'></div><button class='btn gold' id='v95-intro-fwd'>下一页 →</button></div></div>";
    document.body.appendChild(el);
    render();
    const done=function(){ el.remove(); v94_startNew(); };
    document.getElementById("v95-intro-back").onclick=function(){ if(cur>0){ cur--; render(); } };
    document.getElementById("v95-intro-fwd").onclick=function(){ if(cur<slides.length-1){ cur++; render(); } else { done(); } };
    document.getElementById("v95-intro-skip").onclick=done;
  }catch(e){ try{ console.log("[v95:intro:err]",e); v94_startNew(); }catch(_){} }
};
window.v94_loadSave=function(){
  try{
    const saved=(typeof v61_lzstring!=="undefined"&&v61_lzstring.sniffRaw)?v61_lzstring.sniffRaw(localStorage.getItem(RULESET_ID+"-save")):null;
    if(!saved){ flashMsg("没有找到存档"); return; }
    try{
      const d=saved;
      if(d.ruleset===RULESET_ID && !d.ending){
        try{ if(typeof v61_clearAll==="function") v61_clearAll(); }catch(e){}
        S=applyDefaults(d);
        curNode=S.curNode||"fc_jiaohui_entry";
        v94_hideTitle();
        renderTop(); renderStats();
        try{ renderMapPanel(); }catch(e){}
        writeNext();
      } else { flashMsg("存档无效或已终结"); }
    }catch(e){ flashMsg("读档失败："+((e&&e.message)||"")); }
  }catch(e){ flashMsg("读档失败"); }
};
/* ---------- 设定册（MP-7 增强：8 分类 + 搜索；S 无关，主界面可用） ---------- */
window.v94_settingPanel=function(){
  try{
    const box=document.createElement("div"); box.className="box";
    let h="<h2>📖 设定册 · 世界一览</h2><p class='sub'>艾尔达大陆的风物与脉络——不随周目而变。</p>";
    h+="<div style='margin:8px 0'><input type='text' id='v95-set-search' placeholder='🔍 搜索词条（人物 / 地名 / 术语）' style='width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #6b5a3a;border-radius:6px;background:#1a1510;color:#e8dcc0'></div>";
    h+="<div style='max-height:430px;overflow-y:auto'>";
    const _entry=function(id,title,body){ return "<div class='v95-set-entry' data-q='"+(title+" "+body).replace(/'/g,"")+"'><b style='color:var(--gold2,#c49a3e)'>"+title+"</b><p style='margin:2px 0 0;font-size:13px;line-height:1.8'>"+body+"</p></div>"; };
    /* 1 世界大势 */
    h+="<details open><summary style='cursor:pointer;font-weight:700'>世界大势</summary><div style='padding:4px 2px'>";
    try{ const LB=window.LOREBOOK||[]; for(let i=0;i<LB.length;i++){ const e=LB[i]; if(!e||!e.constant) continue; h+=_entry(e.id,e.title||e.id,e.text||""); } }catch(e){}
    h+="</div></details>";
    /* 2 人物志（账本人物类 + 金秤等关键人物） */
    h+="<details><summary style='cursor:pointer;font-weight:700'>人物志</summary><div style='padding:4px 2px'>";
    try{
      const LG=window.CAUSALITY_LEDGER||[];
      let c=0;
      for(let i=0;i<LG.length&&c<24;i++){ const g=LG[i]; if(!g||g.type!=="人物") continue; h+=_entry("led_"+i,g.name||g.desc||g.id,""+(g.desc||"")+(g.world?(" · 属："+g.world):"")); c++; }
      if(!c){ h+="<div style='font-size:13px;color:#9a8a68'>金秤 · 老莫里茨 · 灰鬃 · 阿岩 · 秦·长风 —— 各势力与支线的关键人物，会在旅途中逐步相遇。</div>"; }
    }catch(e){}
    h+="</div></details>";
    /* 3 关键地点 */
    h+="<details><summary style='cursor:pointer;font-weight:700'>关键地点</summary><div style='padding:4px 2px'>";
    try{
      const R=window.REGIONS||{};
      for(const k in R){ const r=R[k]; h+=_entry("reg_"+k,(r.cn||k),r.desc||""); }
      const _key=["灰港","自由城邦","铁门关","北境王都","圣辉城","晨天故都","第三哨","七锚","无字碑","银月祭坛","铁砧议会","圣山","祖灵洞","死亡沙漠"];
      for(let i=0;i<_key.length;i++){ h+=_entry("loc_"+i,_key[i],"（在旅途中揭晓）"); }
    }catch(e){}
    h+="</div></details>";
    /* 4 术语与神器 */
    h+="<details><summary style='cursor:pointer;font-weight:700'>术语与神器</summary><div style='padding:4px 2px'>";
    try{
      const LG=window.CAUSALITY_LEDGER||[];
      let c=0;
      for(let i=0;i<LG.length&&c<30;i++){ const g=LG[i]; if(!g||g.type!=="设定") continue; h+=_entry("leds_"+i,g.name||g.desc||g.id,""+(g.desc||"")); c++; }
      if(!c){ h+="<div style='font-size:13px;color:#9a8a68'>铁牌 · 七锚 · 神谕 · 腐光 —— 大陆深处的旧名，将在主线中揭开。</div>"; }
    }catch(e){}
    h+="</div></details>";
    /* 5 势力矩阵 */
    h+="<details><summary style='cursor:pointer;font-weight:700'>势力矩阵</summary><div style='padding:4px 2px'>";
    try{
      const F=[["金秤家族","守门人世家，守着无字碑与七锚的旧约。"],["圣光教会","以圣光为纲，对深渊与异端绝不宽宥。"],["艾尔达魔法学院","北境的奥术圣地，知识与野心并存。"],["北境联军","铁门关后的军团，战争的第一道墙。"],["沙漠诸部","死亡沙漠的部族，信奉先祖与绿洲。"],["兽人诸部","草原的战士，与教会的圣光天然对立。"],["精灵林邦","长寿的森林之民，魔法天赋流淌在血脉里。"],["矮人山国","铁砧与熔炉之子，重信用与手艺。"],["东境帝京","承天城的主人，科举与官署维系着王朝的架子。"]];
      for(let i=0;i<F.length;i++){ h+=_entry("fac_"+i,F[i][0],F[i][1]); }
    }catch(e){}
    h+="</div></details>";
    /* 6 五条主线 */
    h+="<details><summary style='cursor:pointer;font-weight:700'>大陆纪事 · 五条主线</summary><div style='padding:4px 2px'>";
    try{
      const W=window.WORLD_EVENTS||{};
      for(const k in W){ const w=W[k]; h+="<div class='v95-set-entry' data-q='"+((w.cn||k)+" "+(w.text||"")).replace(/'/g,"")+"'><b>第"+(w.day||"?")+"日 · "+(w.cn||k)+"</b><br><span style='color:#6b5a3a'>"+(w.text||"")+"</span></div>"; }
    }catch(e){}
    h+="</div></details>";
    /* 7 职业与戒律 */
    h+="<details><summary style='cursor:pointer;font-weight:700'>职业与戒律</summary><div style='padding:4px 2px'>";
    try{
      const J=window.JOBS||{};
      for(const k in J){ const j=J[k]; h+="<div class='v95-set-entry' data-q='"+((j.cn||k)+" "+(j.desc||"")+" "+(j.vow||"")).replace(/'/g,"")+"'><b>"+(j.cn||k)+"</b> <span style='color:#9a8a68'>"+(j.desc||"")+"</span>"+(j.vow?"<br><span style='color:var(--bad,#b25)'>"+j.vow+"</span>":"")+"</div>"; }
    }catch(e){}
    h+="</div></details>";
    h+="</div>";
    h+="<div style='text-align:center;margin-top:10px'><button class='btn' onclick='closeModal()'>返回</button></div>";
    box.innerHTML=h; openModal(box);
    const si=document.getElementById("v95-set-search");
    if(si) si.addEventListener("input",function(){
      const q=(si.value||"").trim().toLowerCase();
      document.querySelectorAll("#v95-set-search ~ div .v95-set-entry").forEach(function(e2){
        e2.style.display=(!q||(e2.dataset.q||"").toLowerCase().indexOf(q)>=0)?"":"none";
      });
    });
  }catch(e){}
};
