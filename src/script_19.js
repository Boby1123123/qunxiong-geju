/* ============================================================
   /lwinj:engine/ LW 活的世界模拟层（方向一 · 五子系统）
   S1 世界时钟：时段/季节/世界历/主线预热（融合 v93 节日）
   S2 NPC 模拟：日程/自主事件/记忆回显
   S3 世界回响引擎：回响队列/抉择记录册/作者语法
   S4 势力模拟：状态机/关系偏移/城市控制
   S5 叙事门控：cond world.* + 动态文本
   设计文档：docs/LW_活的世界模拟层_方向设计_20260912.md
   红线：只读 S、追加渲染；不触碰判定公式/writeNext 核心/choose/存档语义/saveVersion
   ============================================================ */
(function(){ try{
  var _LWD = function(){ return window.LW_DATA || {}; };
  var _ld = function(){ return (typeof S!=="undefined" && S && S.lw) ? S.lw : null; };
  /* ---- S1 世界时钟 ---- */
  window.LW_season = function(){
    var lw = _ld(); if(!lw) return "春";
    var m = Math.floor(((S.day||1)-1)/30)+1;
    var s = m<=3?"春":m<=6?"夏":m<=9?"秋":"冬";
    lw.season = s; return s;
  };
  window.LW_month = function(){ return Math.floor(((S.day||1)-1)/30)+1; };
  window.LW_dayPhase = function(){
    var lw = _ld(); if(!lw) return "晨";
    var ph = ["晨","午","昏","夜"][((S.day||1)-1)%4];
    lw.dayPhase = ph; return ph;
  };
  window.LW_newsAdd = function(kind, text){
    try{ if(window.v93_newsAdd) v93_newsAdd(kind, text); }
    catch(e){ try{ if(window.logMsg) logMsg(text); }catch(e2){} }
  };
  /* 季节/时段切换播报 */
  window.LW_ambientTick = function(){
    var lw = _ld(); if(!lw || !S) return;
    var oldSeason = lw.season, oldPhase = lw.dayPhase;
    var ns = LW_season(), np = LW_dayPhase();
    var D = _LWD();
    if(ns !== oldSeason && D.seasonLine && D.seasonLine[ns]){
      var line = D.seasonLine[ns];
      try{ if(window.logMsg) logMsg("【"+ns+"】"+line); }catch(e){}
      LW_newsAdd("season", "时令入"+ns+"。"+line);
    }
    if(np !== oldPhase && D.phaseLine && D.phaseLine[np]){
      var pl = D.phaseLine[np];
      try{ if(window.logMsg) logMsg("【"+np+"时】"+pl); }catch(e){}
    }
  };
  /* 主线预热（WORLD_EVENTS 前 N 天传闻） */
  window.LW_omenTick = function(){
    var lw = _ld(); if(!lw || !S || !window.WORLD_EVENTS) return;
    var D = _LWD(), omens = D.omens || [];
    for(var i=0;i<omens.length;i++){
      var o = omens[i], ev = window.WORLD_EVENTS[o.ev];
      if(!ev || (S.world && S.world[o.ev])) continue;
      var left = ev.day - (S.day||0);
      if(left === o.before){
        var key = "omen_"+o.ev;
        if(!lw.worldFlags[key]){
          lw.worldFlags[key] = true;
          try{ if(window.logMsg) logMsg("【传闻】"+o.text); }catch(e){}
          LW_newsAdd("omen", o.text);
        }
      }
    }
  };
  /* S3 回响：登记 flag->echo（tick 轮询 echoMap） */
  window.LW_echoScan = function(){
    var lw = _ld(); if(!lw || !S) return;
    var D = _LWD(), map = D.echoMap || [];
    lw.echoes = lw.echoes || [];
    for(var i=0;i<map.length;i++){
      var c = map[i];
      if(!c || !c.flag || !S.flags || !S.flags[c.flag]) continue;
      var has = false, logHas = false;
      for(var j=0;j<lw.echoes.length;j++){ if(lw.echoes[j].id===c.echoId) has = true; }
      for(var k=0;k<lw.echoLog.length;k++){ if(lw.echoLog[k]===c.echoId) logHas = true; }
      if(!has && !logHas){
        lw.echoes.push({id:c.echoId, at:c.at||null, delay:c.delay||3, dueDay:(S.day||1)+(c.delay||3), text:c.text||""});
        try{ if(window.logMsg) logMsg("【命运的线】一笔旧账，被世界记下了。"); }catch(e){}
      }
    }
  };
  /* 回响触发检查（tick；delay 到期或 at 地点命中） */
  window.LW_echoTick = function(){
    var lw = _ld(); if(!lw || !S) return;
    lw.echoes = lw.echoes || [];
    var due = [];
    for(var i=0;i<lw.echoes.length;i++){
      var e = lw.echoes[i];
      var ok = (S.day||0) >= (e.dueDay||0);
      if(e.at){ var cur = S.loc||""; if(cur.indexOf(e.at) < 0) ok = false; }
      if(ok) due.push(i);
    }
    for(var j=due.length-1;j>=0;j--){
      var idx = due[j], e = lw.echoes[idx];
      lw.echoes.splice(idx,1);
      lw.echoLog = lw.echoLog || [];
      if(lw.echoLog.indexOf(e.id) < 0) lw.echoLog.push(e.id);
      try{ if(window.writePar) writePar("（"+e.text+"）","res"); else if(window.logMsg) logMsg(e.text); }catch(err){}
      LW_newsAdd("echo", e.text);
      window.LW_journalAdd("echo", e.text, null);
    }
  };
  /* 作者语法渲染（writePar 后挂接）：[echo:id:文案] / {{echoCount:id}} / {{npcRecall:角色|记忆id}} / [[if:world.x==v|A|B]] */
  window.LW_render = function(p){
    if(typeof p !== "string") return p;
    var lw = _ld();
    p = p.replace(/\[echo:([\w\-]+):([^\]]+)\]/g, function(m, id, txt){
      var hit = false;
      if(lw && lw.echoLog){ for(var i=0;i<lw.echoLog.length;i++){ if(lw.echoLog[i]===id) hit = true; } }
      return hit ? String(txt) : "";
    });
    p = p.replace(/\{\{echoCount:([\w\-]+)\}\}/g, function(m, id){
      var n = 0;
      if(lw && lw.echoLog){ for(var i=0;i<lw.echoLog.length;i++){ if(lw.echoLog[i]===id) n++; } }
      return String(n);
    });
    p = p.replace(/\{\{npcRecall:([\w\-]+)\|([\w\-]+)\}\}/g, function(m, npc, memId){
      try{
        var nm = (S && S.npcMemory) ? S.npcMemory : null;
        if(nm && nm[npc] && nm[npc][memId]) return String(nm[npc][memId]);
      }catch(e){}
      return "";
    });
    p = p.replace(/\[\[if:world\.([\w]+)==\x27([^\x27]+)\x27\|([^|]+)\|([^\]]+)\]\]/g, function(m, k, v, a, b){
      var cur = "";
      if(k==="season") cur = (S && S.lw && S.lw.season) || LW_season();
      else if(k==="dayPhase") cur = (S && S.lw && S.lw.dayPhase) || LW_dayPhase();
      else if(k==="flag") cur = (S && S.lw && S.lw.worldFlags && S.lw.worldFlags[v]) ? v : "";
      else if(k==="city") cur = (window.LW_cityOwner && LW_cityOwner(S.loc||"")) || "";
      return String(cur)===String(v) ? String(a) : String(b);
    });
    return p;
  };
  /* 抉择记录册 */
  window.LW_journalAdd = function(kind, text, flag){
    var lw = _ld(); if(!lw || !S) return;
    lw.journal = lw.journal || [];
    if(lw.journal.length > 60) lw.journal.shift();
    lw.journal.push({day:S.day||1, date:(S.date||""), kind:kind, text:text, flag:flag||null});
  };
  window.LW_journalUI = function(){
    var lw = _ld();
    var box = document.createElement("div"); box.className = "box";
    var h = "<h3>📜 抉择记录册</h3><div class='mini'>世界记住了你做过的事。</div><div style='max-height:46vh;overflow:auto;margin-top:8px'>";
    var arr = (lw && lw.journal) ? lw.journal.slice().reverse() : [];
    if(!arr.length){ h += "<div style='color:#9a8a68;padding:10px'>命运的线，尚未落笔。</div>"; }
    for(var i=0;i<arr.length;i++){
      var j = arr[i];
      var tag = j.kind==="echo" ? "回响" : j.kind==="faction" ? "立场" : "抉择";
      h += "<div style='border-left:3px solid var(--gold2,#caa);padding:6px 8px;margin:6px 0;background:rgba(0,0,0,.18)'>"+
           "<span style='color:#9a8a68;font-size:12px'>第"+j.day+"日 · "+tag+"</span><br>"+String(j.text||"")+"</div>";
    }
    h += "</div><div style='text-align:center;margin-top:10px'><button class='btn' onclick='closeModal()'>返回</button></div>";
    box.innerHTML = h;
    if(window.openModal) openModal(box); else document.body.appendChild(box);
  };
  /* S1 世界历面板 */
  window.LW_calendarUI = function(){
    var lw = _ld();
    var box = document.createElement("div"); box.className = "box";
    var day = S.day||1, phase = LW_dayPhase(), season = LW_season();
    var h = "<h3>🗓 艾尔达历 · 世界历</h3>";
    h += "<div style='margin:6px 0'><b>"+(S.date||"")+"</b> · "+season+"季 · "+phase+"时</div>";
    h += "<div class='mini'>未来七日</div><div style='margin-top:6px'>";
    for(var d=day+1; d<=day+7; d++){
      var line = "";
      var f = (window.FESTIVAL_V93||[]);
      for(var i=0;i<f.length;i++){ if(f[i].day===d){ line += "🎪 "+f[i].name+"："; line += f[i].desc; } }
      var ev = window.WORLD_EVENTS||{};
      for(var k in ev){ if(ev[k].day===d){ line += (line?"；":"")+"⚑ "+ev[k].cn+"将至"; } }
      if(!line) line = "无大事";
      h += "<div style='padding:3px 6px;border-bottom:1px solid rgba(255,255,255,.06)'>第"+d+"日　"+line+"</div>";
    }
    h += "</div>";
    var todayF = "";
    var fl = (window.FESTIVAL_V93||[]);
    for(var j=0;j<fl.length;j++){ if(fl[j].day===day){ todayF = fl[j].name; } }
    if(todayF){ h += "<div style='margin-top:8px;color:var(--gold2,#caa)'>今日节日："+todayF+"</div>"; }
    h += "<div class='mini' style='margin-top:8px'>世界要闻</div>";
    var nl = (S && S.news && S.news.list) ? S.news.list : [];
    for(var q=nl.length-1; q>=Math.max(0,nl.length-4); q--){ h += "<div style='padding:3px 6px;color:#b8a888'>· "+(nl[q]&&nl[q].t?nl[q].t:String(nl[q]||""))+"</div>"; }
    h += "<div style='text-align:center;margin-top:10px'><button class='btn' onclick='closeModal()'>返回</button></div>";
    box.innerHTML = h;
    if(window.openModal) openModal(box); else document.body.appendChild(box);
  };
  /* S4 势力模拟 */
  window.LW_factionShift = function(id, delta, reason){
    var lw = _ld(); if(!lw || !S || !id) return;
    S.infl = S.infl || {};
    lw.factionRel = lw.factionRel || {};
    if(S.infl[id]===undefined) S.infl[id]=0;
    S.infl[id] += delta;
    lw.factionRel[id] = (lw.factionRel[id]||0) + delta;
    var D = _LWD(), fac = (D.factions&&D.factions[id]) ? D.factions[id].cn : id;
    window.LW_journalAdd("faction", "【"+fac+"】"+(delta>=0?"态度 +"+delta:"态度 "+delta)+(reason?("（"+reason+"）"):""), null);
    try{ if(window.logMsg) logMsg(delta>=0?"【"+fac+"】对你多了几分善意（+"+delta+"）。":"【"+fac+"】对你起了戒心（"+delta+"）。"); }catch(e){}
  };
  window.LW_factionTick = function(){
    var lw = _ld(); if(!lw || !S || !window.WORLD_EVENTS) return;
    lw.factionState = lw.factionState || {};
    var D = _LWD();
    var init = (D && D.factionState) || {};
    for(var id in init){ if(!lw.factionState[id]) lw.factionState[id] = init[id]; }
    if(S.world && S.world.purge && lw.factionState.church==="稳定") lw.factionState.church = "备战";
    if(S.world && S.world.silver && lw.factionState.south==="稳定") lw.factionState.south = "备战";
    if(S.world && S.world.seal && lw.factionState.abyss==="潜伏") lw.factionState.abyss = "战争";
    if(S.world && S.world.orc && lw.factionState.north!=="战争") lw.factionState.north = "战争";
    if(S.world && S.world.orc && lw.factionState.orc!=="战争") lw.factionState.orc = "战争";
    if(S.world && S.world.orc && lw.factionState.east==="备战") lw.factionState.east = "战争";
  };
  window.LW_cityOwner = function(loc){
    if(!loc) return "";
    var parts = String(loc).split("_");
    var city = parts[parts.length-1] || "";
    var D = _LWD(), own = D.cityOwn || {};
    if(own.special && own.special[city]) return own.special[city];
    for(var r in own){
      if(r==="special") continue;
      var arr = own[r]||[];
      for(var i=0;i<arr.length;i++){ if(arr[i]===city) return r; }
    }
    return "";
  };
  window.LW_factionUI = function(){
    var lw = _ld(); if(!lw) return;
    window.LW_factionTick();
    var box = document.createElement("div"); box.className = "box";
    var h = "<h3>🏰 势力与局势</h3><div class='mini'>九大势力的目光，都落在你身上。</div>";
    var D = _LWD(), facs = (D && D.factions) || {};
    var infl = S.infl || {};
    for(var id in facs){
      var f = facs[id];
      var rel = infl[id]||0;
      var st = (lw.factionState && lw.factionState[id]) || "稳定";
      var tone = rel<=-60 ? "#d66" : rel>=60 ? "#6d6" : "#b8a888";
      h += "<div style='padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.06)'>"+
           "<b>"+f.cn+"</b> <span style='color:#9a8a68'>["+st+"]</span> "+
           "<span style='color:"+tone+"'>关系 "+rel+"</span>"+
           "<div style='color:#8a7a5a;font-size:12px'>"+f.desc+"</div></div>";
    }
    h += "<div style='text-align:center;margin-top:10px'><button class='btn' onclick='closeModal()'>返回</button></div>";
    box.innerHTML = h;
    if(window.openModal) openModal(box); else document.body.appendChild(box);
  };
  /* S2 NPC 日程查询：按当前时段返回 NPC 所在与动态文本 */
  window.LW_npcWhere = function(id){
    var lw = _ld(); if(!lw || !S) return null;
    var D = _LWD(), sch = (D.npcSchedule && D.npcSchedule[id]) || [];
    if(!sch.length) return null;
    var ph = LW_dayPhase();
    for(var i=0;i<sch.length;i++){ if(sch[i].phase===ph) return sch[i]; }
    return sch[0];
  };
  /* S5 叙事门控：world 条件（供 v96_optGate cond.world 扩展） */
  window.LW_cond = function(c, Ss){
    if(!c || typeof c!=="object") return {pass:true, reason:""};
    Ss = Ss || {};
    var r = {pass:true, reason:""};
    var lw = Ss.lw || {};
    if(c.season !== undefined){
      var m = Math.floor(((Ss.day||1)-1)/30)+1;
      var s = m<=3?"春":m<=6?"夏":m<=9?"秋":"冬";
      if(s!==c.season){ r.pass=false; r.reason=c.reason||"时节未至。"; return r; }
    }
    if(c.dayPhase !== undefined){
      var ph = ["晨","午","昏","夜"][((Ss.day||1)-1)%4];
      if(ph!==c.dayPhase){ r.pass=false; r.reason=c.reason||"时辰不对。"; return r; }
    }
    if(c.faction && c.faction.id){
      var fid = c.faction.id;
      var rel = (Ss.infl && Ss.infl[fid])||0;
      var op = c.faction.op||">=";
      var ok = op===">" ? rel>c.faction.v : op==="<" ? rel<c.faction.v : op==="<=" ? rel<=c.faction.v : rel>=c.faction.v;
      if(!ok){ r.pass=false; r.reason=c.reason||"那方势力对你还不够信任。"; return r; }
    }
    if(c.city !== undefined){
      var owner = (window.LW_cityOwner && LW_cityOwner(Ss.loc||"")) || "";
      if(owner!==c.city){ r.pass=false; r.reason=c.reason||"此地情形已变。"; return r; }
    }
    if(c.echo !== undefined){
      var hit = false;
      if(lw.echoLog){ for(var i=0;i<lw.echoLog.length;i++){ if(lw.echoLog[i]===c.echo) hit=true; } }
      if(!hit){ r.pass=false; r.reason=c.reason||"那件事尚未了结。"; return r; }
    }
    if(c.flag !== undefined){
      if(!(lw.worldFlags && lw.worldFlags[c.flag])){ r.pass=false; r.reason=c.reason||"世界尚未走到那一步。"; return r; }
    }
    return r;
  };
  /* LW 总 tick（advanceDays 挂接） */
  window.LW_tick = function(n){
    try{
      var lw = _ld(); if(!lw || !S) return;
      lw.tick = (lw.tick||0) + 1;
      window.LW_season(); window.LW_dayPhase();
      window.LW_ambientTick();
      window.LW_omenTick();
      window.LW_echoScan();
      window.LW_echoTick();
      window.LW_factionTick();
    }catch(e){}
  };
  /* LW 自检（轻量检查器） */
  window.LW_selfcheck = function(){
    var out = {pass:true, errors:[]};
    try{
      var lw = _ld();
      if(!lw){ out.pass=false; out.errors.push("S.lw missing"); }
      else {
        ["echoes","echoLog","npcStates","factionRel","factionState","cityControl","worldFlags","journal"].forEach(function(k){
          if(lw[k]===undefined) out.errors.push("lw."+k+" missing");
        });
      }
      var D = _LWD();
      if(D && D.echoMap){
        for(var i=0;i<D.echoMap.length;i++){
          var c = D.echoMap[i];
          if(!c || !c.flag || !c.echoId) out.errors.push("echoMap["+i+"] bad");
        }
      }
      if(D && D.npcSchedule){
        for(var n in D.npcSchedule){
          var arr = D.npcSchedule[n]||[];
          if(!arr.length) out.errors.push("npcSchedule."+n+" empty");
          for(var j=0;j<arr.length;j++){
            if(!arr[j].loc) out.errors.push("npcSchedule."+n+"["+j+"] no loc");
          }
        }
      }
      if(D && D.cityOwn){
        var t = 0;
        for(var r in D.cityOwn){ if(r==="special") continue; t += (D.cityOwn[r]||[]).length; }
        if(t < 30) out.errors.push("cityOwn covers only "+t+" cities");
      }
    }catch(e){ out.pass=false; out.errors.push(String(e)); }
    if(out.errors.length) out.pass = false;
    return out;
  };
  /* LW 综合面板（世界历 + 记录册 + 势力） */
  window.LW_openHub = function(){
    try{
      var box = document.createElement("div"); box.className = "box";
      box.innerHTML = "<h3>🌍 活的世界</h3>"+
        "<div style='text-align:center;margin:10px 0'>"+
        "<button class='btn' onclick='LW_calendarUI()' style='margin:3px'>🗓 世界历</button>"+
        "<button class='btn' onclick='LW_journalUI()' style='margin:3px'>📜 抉择记录</button>"+
        "<button class='btn' onclick='LW_factionUI()' style='margin:3px'>🏰 势力局势</button>"+
        "</div><div style='text-align:center;margin-top:4px'><button class='btn' onclick='closeModal()'>返回</button></div>";
      if(window.openModal) openModal(box); else document.body.appendChild(box);
    }catch(e){}
  };
  /* 初始化：新档/读档后同步派生字段 */
  window.LW_install = function(){
    try{
      if(typeof S==="undefined" || !S) return;
      if(!S.lw) S.lw = {};
      window.LW_season(); window.LW_dayPhase();
    }catch(e){}
  };
  try{ if(window.LW_install && typeof S!=="undefined" && S) window.LW_install(); }catch(e){}
}catch(e){} })();

