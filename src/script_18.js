
/* /v68ui:frame/ V68_UI 西幻界面引擎：导航/旁白栏/状态行/三面板/侧栏包装 */
(function(){
try{
window.V68_UI = window.V68_UI || {};
var UI = window.V68_UI;
UI.version = "v68.1";
UI.announceHistory = [];
UI._annIdx = 0;
UI._timer = null;

UI.init = function(){
  try{ document.body.classList.add("v68-theme"); }catch(e){}
  try{ UI.bindNav(); }catch(e){}
  try{ UI.statusBar(); }catch(e){}
  try{ UI.announceRefresh(); }catch(e){}
  try{ UI.startRotate(); }catch(e){}
};

UI.bindNav = function(){
  var defs = {
    "btn-pack": function(){ try{ if(window.togglePanel) togglePanel("pack"); else if(window.renderPack) renderPack(); }catch(e){} },
    "btn-realm": function(){ try{ if(window.togglePanel) togglePanel("realm"); else if(window.renderRealm) renderRealm(); }catch(e){} },
    "btn-log": function(){ try{ if(window.togglePanel) togglePanel("log"); else if(window.renderLog) renderLog(); }catch(e){} },
    "btn-task": UI.taskPanel,
    "btn-strong": UI.strongPanel,
    "btn-chronicle": UI.chroniclePanel
  };
  for(var id in defs){
    var el = document.getElementById(id);
    if(el && !el.getAttribute("data-v68b")){
      el.setAttribute("data-v68b","1");
      (function(fn){ el.onclick = function(){ try{ fn(); }catch(e){} }; })(defs[id]);
    }
  }
  if(window.__v68KeyBound) return;
  window.__v68KeyBound = 1;
  document.addEventListener("keydown", function(e){
    try{
      if(e.ctrlKey && (e.key.toLowerCase()==="s")){ e.preventDefault(); try{ if(window.saveGame) saveGame(); }catch(_){} return; }
      if(e.target && (e.target.tagName==="INPUT" || e.target.tagName==="TEXTAREA")) return;
      var k = e.key.toLowerCase();
      var m = {m:"btn-map", b:"btn-pack", t:"btn-realm", l:"btn-log", f:"btn-faction", q:"btn-task", g:"btn-strong", c:"btn-chronicle", i:"btn-immersive"};
      if(m[k]){
        var el = document.getElementById(m[k]);
        if(el && typeof el.click==="function") el.click();
      }
      /* /p11ui:immersive/ 沉浸模式快捷键：Esc 退出；空格/Enter 推进剧情 */
      if(k==="escape" && document.body.classList.contains("v68-immersive")){
        e.preventDefault();
        try{ if(window.V68_UI && V68_UI.immersive) V68_UI.immersive(); }catch(_){}
      }
      if((k===" "||k==="enter") && document.body.classList.contains("v68-immersive")){
        e.preventDefault();
        try{ if(window.V68_UI && V68_UI.immersiveNext) V68_UI.immersiveNext(); }catch(_){}
      }
    }catch(_){}
  });
};

/* /p11ui:immersive/ 剧情沉浸模式：一键隐藏全部 HUD 只留正文+选项+前进条；可逆、可快捷键退出 */
UI.immersive = function(){
  try{
    var on = document.body.classList.toggle("v68-immersive");
    if(on){
      /* /t14inj:paged/ I1-4 沉浸自动启用分段阅读（退出还原用户设置） */
      try{ if(typeof S!=='undefined'&&S){ if(!S.settings) S.settings={}; UI.__prevPaged = S.settings.pagedReading; S.settings.pagedReading = true; } }catch(e){}
      try{ if(window.v67_ui && v67_ui.close) v67_ui.close(); }catch(_){}
      var bar = document.getElementById("v68-immersive-bar");
      if(!bar){
        bar = document.createElement("div");
        bar.id = "v68-immersive-bar";
        bar.setAttribute("role","toolbar");
        bar.setAttribute("aria-label","沉浸模式控制");
        bar.innerHTML = "<button id='v68-immersive-next' title='推进剧情（空格 / Enter）' onclick='V68_UI.immersiveNext()'>继续阅读 ▸</button>" +
                        "<button id='v68-immersive-exit' title='退出沉浸（Esc / I）' onclick='V68_UI.immersive()'>退出</button>";
        document.body.appendChild(bar);
      }
      bar.style.display = "flex";
    } else {
      /* /t14inj:paged/ I1-4 退出还原分段阅读开关 */
      try{ if(typeof S!=='undefined'&&S&&S.settings){ S.settings.pagedReading = (UI.__prevPaged===undefined)?true:UI.__prevPaged; } }catch(e){}
      var bar2 = document.getElementById("v68-immersive-bar");
      if(bar2) bar2.style.display = "none";
    }
    var b = document.getElementById("btn-immersive");
    if(b) b.classList.toggle("on", on);
  }catch(_){}
};
UI.immersiveNext = function(){
  try{
    var m = document.getElementById("modal");
    if(m && m.classList.contains("show")){
      try{ if(window.v67_ui && v67_ui.close) v67_ui.close(); }catch(_){}
    }
    /* /t14inj:next/ I1-4 分段阅读联动：未读完 → 前进按钮=段落「继续」 */
    try{
      var cg = document.getElementById('v45-cg');
      if(cg && typeof v45_continue === 'function'){ v45_continue(); return; }
    }catch(e){}
    /* 选项已显示且无分页 → 不重复渲染当前节点 */
    try{
      var opts = document.getElementById('options');
      if(opts && opts.children && opts.children.length){ return; }
    }catch(e){}
    if(typeof writeNext === "function") writeNext();
  }catch(_){}
};

UI.openPanel = function(html, title){
  try{
    var m = document.createElement("div");
    m.className = "v68-pop";
    m.innerHTML = "<div class='v68-pop-head'><span class='v68-pop-title'>"+(title||"")+"</span><button class='v68-pop-close' onclick='v67_ui.close()'>✕</button></div><div class='v68-pop-body'>"+html+"</div>";
    if(window.v67_ui && v67_ui.open) v67_ui.open(m);
  }catch(e){}
};

UI.taskPanel = function(){
  var h = "";
  try{
    var goals = (S && S.worldGoals) ? S.worldGoals : [];
    h += "<div class='v68-sec'>世界目标</div>";
    if(goals.length){
      for(var i=0;i<goals.length;i++){
        var g = goals[i];
        h += "<div class='v68-line'>◆ "+(g.target||g.id||"未名目标")+(g.deadline?("（限 "+g.deadline+" 日内）"):"")+"</div>";
      }
    } else {
      h += "<div class='v68-line muted'>你尚未立下世界目标。路还长，可以想清楚再走。</div>";
    }
    var ev = (S && S.missedEvents) ? S.missedEvents : [];
    var unread = [];
    for(var j=0;j<ev.length && unread.length<6;j++){
      var m = ev[j];
      if(m && !m._read && (m.desc||m.text)) unread.push(m);
    }
    if(unread.length){
      h += "<div class='v68-sec'>未读传闻</div>";
      for(var k=0;k<unread.length;k++){
        h += "<div class='v68-line'>📣 "+(unread[k].desc||unread[k].text||"")+"</div>";
      }
    }
    h += "<div class='v68-hint'>世界目标由因果与抉择汇聚；传闻来自你不在场时，世界仍在发生的事。</div>";
  }catch(e){ h += "<div class='v68-line muted'>任务簿暂不可用。</div>"; }
  UI.openPanel(h, "✉ 任务与目标");
};

UI.strongPanel = function(){
  var h = "";
  try{
    var M = window.STRONG_V53 || {};
    var ids = Object.keys(M);
    var list = [];
    for(var i=0;i<ids.length;i++){
      var s = M[ids[i]];
      if(!s) continue;
      var cn = s.cn || ids[i];
      var extra = [];
      if(s.realm!==undefined) extra.push("境界 "+(typeof s.realm==="number" ? (REALMS&&REALMS[s.realm]?REALMS[s.realm].cn:s.realm) : s.realm));
      if(s.faction) extra.push(s.faction);
      if(s.job) extra.push(s.job);
      if(s.city) extra.push("驻 " + (typeof s.city==="string"?s.city:(s.city.cn||s.city)));
      list.push("<div class='v68-line'>⚔ "+cn+(extra.length?(" · "+extra.join(" · ")):"")+"</div>");
    }
    if(list.length){
      h = "<div class='v68-sec'>大陆强者</div>" + list.slice(0,40).join("");
      if(list.length>40) h += "<div class='v68-line muted'>……共 "+list.length+" 人，名册余页略。</div>";
    } else {
      h = "<div class='v68-line muted'>名册尚空。你还没结识到足以记名的人。</div>";
    }
    h += "<div class='v68-hint'>强者会随行踪与恩怨改变处境——酒馆里的传闻，往往比名册更新鲜。</div>";
  }catch(e){ h = "<div class='v68-line muted'>名册暂不可用。</div>"; }
  UI.openPanel(h, "⚔ 强者名册");
};

UI.chroniclePanel = function(){
  var h = "";
  try{
    var chr = (S && S.worldChronicle) ? S.worldChronicle : [];
    if(chr.length){
      h = "<div class='v68-sec'>世界编年史（倒序）</div>";
      for(var i=chr.length-1;i>=Math.max(0,chr.length-30);i--){
        var c = chr[i];
        var t = "";
        if(typeof c==="string") t = c;
        else if(c) t = c.text||c.title||c.desc||(c.day?("第"+c.day+"日 · "+JSON.stringify(c)):"");
        if(t) h += "<div class='v68-line'>"+(c&&c.day?("〔第"+c.day+"日〕 "):"")+t+"</div>";
      }
    } else {
      h = "<div class='v68-line muted'>史书尚白。世界的大事，正等着被写进去。</div>";
    }
    h += "<div class='v68-hint'>战争、天灾、政变、破城、强者陨落，都会在这里留下一笔。</div>";
  }catch(e){ h = "<div class='v68-line muted'>编年史暂不可用。</div>"; }
  UI.openPanel(h, "📖 编年史");
};

UI.gatherAnnounce = function(){
  var out = [];
  try{
    var ws = (S && S.worldState) ? S.worldState : {};
    var wars = ws.wars || [];
    for(var i=0;i<wars.length;i++){
      var w = wars[i];
      if(!w) continue;
      var a = w.aCn || (typeof w.a==="string" ? w.a : "");
      var b = w.bCn || (typeof w.b==="string" ? w.b : "");
      var ph = (w.phase===0?"集结":w.phase===1?"拉锯":w.phase===2?"转折":w.phase===3?"终局":"交战");
      var front = w.front || "前线";
      out.push({tag:"⚔", cls:"w", txt:(a&&b)?(a+"与"+b+"在"+front+"交战（"+ph+"）"):("一场战争正在进行（"+ph+"）")});
    }
    var sits = ws.activeSituations || [];
    for(var j=0;j<Math.min(sits.length,4);j++){
      var s = sits[j];
      if(s && s.cn) out.push({tag:"◆", cls:"s", txt:s.cn+(s.stage>=2?("（"+(["萌芽","发酵","爆发","收尾"][s.stage]||"进行中")+"）"):"")});
    }
    var dis = ws.disasters || [];
    for(var k=0;k<Math.min(dis.length,4);k++){
      var d = dis[k];
      if(d && (d.cn||d.kind)) out.push({tag:"🌪", cls:"d", txt:(d.cn||d.kind)+(d.region?(" · "+d.region):"")});
    }
    var reg = ws.regions || {};
    for(var r in reg){
      if(Object.prototype.hasOwnProperty.call(reg,r)){
        var rv = reg[r];
        if(rv && rv.state && rv.state!=="正常") out.push({tag:"🌪", cls:"d", txt:r+"："+rv.state});
      }
    }
    var chr = (S && S.worldChronicle) ? S.worldChronicle : [];
    if(chr.length){
      var last = chr[chr.length-1];
      var ltxt = typeof last==="string" ? last : (last ? (last.text||last.title||last.desc) : "");
      if(ltxt) out.push({tag:"📜", cls:"c", txt:ltxt});
    }
    var ev = (S && S.missedEvents) ? S.missedEvents : [];
    for(var e2=0;e2<Math.min(ev.length,4);e2++){
      var m = ev[e2];
      if(m && (m.desc||m.text)) out.push({tag:"📣", cls:"m", txt:(m.desc||m.text||"")});
    }
  }catch(e){}
  return out;
};

UI.renderAnnounceItem = function(el){
  if(!el) return;
  try{
    var items = UI.announceHistory || [];
    if(!items.length){
      el.innerHTML = "<span class='va-ic'>🌍</span><span class='va-txt muted'>世界暂无大事。太安静了，安静得让人不安。</span><span class='va-btn' onclick='V68_UI.announceOpen()'>展开</span>";
      return;
    }
    var it = items[UI._annIdx % items.length];
    el.innerHTML = "<span class='va-ic'>🌍</span><span class='va-tag "+it.cls+"'>"+it.tag+"</span><span class='va-txt'>"+it.txt+"</span><span class='va-btn' onclick='V68_UI.announceOpen()'>展开</span>";
  }catch(e){}
};

UI.announceRefresh = function(){
  try{
    var el = document.getElementById("v68-announce");
    if(!el) return;
    UI.announceHistory = UI.gatherAnnounce();
    UI._annIdx = 0;
    UI.renderAnnounceItem(el);
  }catch(e){}
};

UI.startRotate = function(){
  try{
    if(UI._timer) clearInterval(UI._timer);
    UI._timer = (function v74_tickAnn(){
        var _b=12000;
        try{ if(document.body&&document.body.classList.contains("simple-mode")) _b=24000; if(document.hidden) _b=60000; }catch(e){}
        setTimeout(function(){
          try{
            var m = document.getElementById("modal");
            if(m && m.classList.contains("show")) return;
            var items = UI.announceHistory || [];
            if(items.length>1){
              UI._annIdx++;
              UI.renderAnnounceItem(document.getElementById("v68-announce"));
            }
          }catch(e){}
          v74_tickAnn();
        }, _b);
      })()
  }catch(e){}
};

UI.announceOpen = function(){
  var items = UI.announceHistory || [];
  var h = "";
  if(!items.length){
    h = "<div class='v68-line muted'>世界暂无大事。太安静了，安静得让人不安。</div>";
  } else {
    for(var i=0;i<items.length;i++){
      var it = items[i];
      h += "<div class='v68-line'><span class='va-tag "+it.cls+"'>"+it.tag+"</span> "+it.txt+"</div>";
    }
  }
  h += "<div class='v68-hint'>世界纪闻由战争、局势、天灾、编年史与传闻汇集而成。你不在场，世界也在动。</div>";
  UI.openPanel(h, "🌍 世界纪闻");
};

UI.statusBar = function(){
  var el = document.getElementById("v68-status");
  if(!el || el.getAttribute("data-v68")) return;
  el.setAttribute("data-v68","1");
  var upd = function(){
    try{
      var g = (S && typeof S.gold==="number") ? S.gold : 0;
      var acts = (S && S.world) ? (S.world.actions||0) : 0;
      var amax = (S && S.world) ? (S.world.actionsMax||4) : 4;
      var day = (S && typeof S.day==="number") ? S.day : 1;
      var dateStr = "";
      try{ if(window.fmtDate) dateStr = fmtDate(day); }catch(e){}
      var wk = "";
      try{ if(window.curLocName) wk = curLocName(); }catch(e){}
      el.innerHTML = "<span class='vs-gold'>🪙 "+g+" 金龙</span><span class='vs-act'>⚡ 行动 "+acts+"/"+amax+"</span><span class='vs-date'>📅 "+dateStr+"</span><span class='vs-place'>📍 "+(wk||"")+"</span>";
    }catch(e){}
  };
  try{ upd(); (function v74_tickStatus(){ var _b=3000; try{ if(document.body&&document.body.classList.contains("simple-mode")) _b=10000; if(document.hidden) _b=30000; }catch(e){} setTimeout(function(){ try{ upd(); }catch(e){} v74_tickStatus(); }, _b); })(); }catch(e){}
};

UI.sideWrap = function(h){
  try{
    var nm = (S && S.name) ? S.name : "旅人";
    var job = "";
    try{ if(S && S.job && window.JOBS && JOBS[S.job]) job = JOBS[S.job].cn; }catch(e){}
    var race = "";
    try{
      if(S && S.subrace && window.SUBRACES && SUBRACES[S.subrace]) race = SUBRACES[S.subrace].cn;
      else if(S && S.race && window.RACES && RACES[S.race]) race = RACES[S.race].cn;
    }catch(e){}
    var realm = "";
    try{ if(S && typeof S.realm==="number" && window.REALMS && REALMS[S.realm]) realm = REALMS[S.realm].cn; }catch(e){}
    var title = "";
    try{ if(S && S.job && window.JOBS && JOBS[S.job] && JOBS[S.job].titles) title = JOBS[S.job].titles[S.realm||0]||""; }catch(e){}
    var aura = "";
    try{ if(S && S.aura) aura = S.aura; }catch(e){}
    var head = "<div class='v68-side-head'><div class='v68-side-name'>"+nm+"</div><div class='v68-side-sub'>"+(job||"未定职业")+(race?(" · "+race):"")+"</div><div class='v68-side-title'>⚜ "+(title||realm||"旅人")+(aura?(" · "+aura):"")+"</div></div>";
    return head + h;
  }catch(e){ return h; }
};

try{
  if(document.readyState==="complete" || document.readyState==="interactive"){ UI.init(); }
  else document.addEventListener("DOMContentLoaded", function(){ try{ UI.init(); }catch(e){} });
}catch(e){}
}catch(e){ try{ console.error("[v68ui]", e); }catch(_){} }
})();

