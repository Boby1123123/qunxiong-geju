
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

/* /u1inj:data-nodes/ */
/* /u1inj:data-nodes:dn_causality.js/ */
/* ===== /v91inj:ledger/ CM-3 因果/伏笔账本（纯数据；elda content causality 读取核销；不改引擎） =====
 * 字段：id / type(伏笔|设定|人物|地点|事件) / desc / plant(埋设锚点) / reap(回收锚点) / status(open|closed) / world(所属卷/域)
 * 锚点语法：flag:<flag名> = 该 flag 在 src 中被 effects 写入；node:<节点id> = 节点存在且被 go/then 引用；其余按关键词词频。
 */
window.CAUSALITY_LEDGER = [
  {id:"led_01", type:"设定", desc:"金秤家族血脉与隐秘历史，贯穿全书的核心家族线", plant:"金秤", reap:"node:tm_negotiate", status:"open", world:"金秤线"},
  {id:"led_02", type:"设定", desc:"晨天城为东境故都，地图标准中的东境中枢（BD-4 经 east_chengtian_old 故都线核销）", plant:"晨天", reap:"node:east_chengtian_old", status:"closed", world:"东境"},
  {id:"led_03", type:"人物", desc:"鬃吼为兽王，兽人草原的最高意志", plant:"鬃吼", reap:"node:orc_deep_totem", status:"open", world:"兽人草原"},
  {id:"led_04", type:"人物", desc:"腐光为暗蚀会首领，净化令阴影后的操盘者", plant:"腐光", reap:"node:tm_ruins", status:"open", world:"暗蚀线"},
  {id:"led_05", type:"人物", desc:"秦·长风，北境名将/东境系关键人物，铁门关对峙主角", plant:"秦·长风", reap:"node:tm_negotiate", status:"open", world:"铁门关"},
  {id:"led_06", type:"设定", desc:"七枚锚，精灵与矮人共守的古老封印体系", plant:"七枚锚", reap:"node:elf_deep_council", status:"open", world:"精灵线"},
  {id:"led_07", type:"道具", desc:"铁牌，七枚锚的钥匙/凭证线，跨卷收集", plant:"铁牌", reap:"node:elf_deep_tower_entry", status:"open", world:"七锚线"},
  {id:"led_08", type:"伏笔", desc:"兽人神谕真伪，黑石部族与圣山信仰的核心悬念", plant:"神谕", reap:"flag:oracle_fake", status:"open", world:"兽人草原"},
  {id:"led_09", type:"人物", desc:"灰鬃，黑石部族狼骑兵长，挚友支线主角", plant:"node:orc_w_enter", reap:"node:orc_w_end", status:"open", world:"兽人草原"},
  {id:"led_10", type:"人物", desc:"林歌，银月祭坛见习祭司，挚友支线主角", plant:"node:elf_w_enter", reap:"node:elf_w_end", status:"open", world:"精灵线"},
  {id:"led_11", type:"地点", desc:"银月祭坛，精灵月池所在，净根仪式主场", plant:"银月", reap:"node:elf_deep_altar", status:"open", world:"精灵线"},
  {id:"led_12", type:"事件", desc:"铁门关战争，东境与北境的前线对峙", plant:"铁门关", reap:"node:tm_negotiate", status:"open", world:"铁门关"},
  {id:"led_13", type:"地点", desc:"圣山图腾林，兽人祖灵信仰之地", plant:"圣山", reap:"node:orc_deep_totem", status:"open", world:"兽人草原"},
  {id:"led_14", type:"势力", desc:"狼旗，兽人草原部族联盟的旗帜", plant:"狼旗", reap:"node:orc_deep_gate", status:"open", world:"兽人草原"},
  {id:"led_15", type:"地点", desc:"月池，精灵祭坛核心，树根腐化的观测点", plant:"月池", reap:"node:elf_deep_altar", status:"open", world:"精灵线"},
  {id:"led_16", type:"伏笔", desc:"世界树根腐化，银月祭坛异变的源头", plant:"树根", reap:"node:elf_w_end", status:"open", world:"精灵线"},
  {id:"led_17", type:"地点", desc:"祖灵洞，兽人圣山深处的传承之地", plant:"祖灵", reap:"node:orc_w_end", status:"open", world:"兽人草原"},
  {id:"led_18", type:"人物", desc:"大汗，黑石部族之主，草原权力顶点", plant:"大汗", reap:"flag:khan_aware", status:"open", world:"兽人草原"},
  {id:"led_19", type:"人物", desc:"青叶长老，林歌师父，树根真相的知情者", plant:"青叶", reap:"node:elf_w_step2", status:"open", world:"精灵线"},
  {id:"led_20", type:"事件", desc:"净化令，光明教会清扫异端的法令与暗蚀线总纲", plant:"净化令", reap:"node:tm_refugee", status:"open", world:"净化令线"},
  {id:"led_21", type:"势力", desc:"白袍教会，圣光信仰与净化令的执行者", plant:"白袍", reap:"node:tm_frontline", status:"open", world:"净化令线"},
  {id:"led_22", type:"伏笔", desc:"铁门关和谈，秦·长风与东军的终局抉择", plant:"node:tm_frontline", reap:"node:tm_negotiate", status:"open", world:"铁门关"},
  {id:"led_23", type:"伏笔", desc:"识破假神谕，巫医帐信任与草原变革的钥匙", plant:"node:orc_deep_witch", reap:"flag:oracle_fake", status:"open", world:"兽人草原"},
  {id:"led_24", type:"因果", desc:"放过劫匪，善念在矮人王都的余响", plant:"flag:spared_robber", reap:"node:dwarf_deep_bard", status:"open", world:"矮人线"},
  {id:"led_25", type:"因果", desc:"手刃匪首，杀伐之名传遍前线", plant:"flag:bandit_leader_killed", reap:"node:tm_ruins", status:"open", world:"铁门关"},
  {id:"led_26", type:"因果", desc:"散尽家财济难民，关南难民营记得这张脸", plant:"flag:gave_all_to_refugees", reap:"node:tm_refugee", status:"open", world:"铁门关"},
  {id:"led_27", type:"因果", desc:"拒绝父亲给出的真相，身世线走向独自承担", plant:"flag:father_truth_denied", reap:"node:tm_watchtower", status:"open", world:"身世线"},
  {id:"led_28", type:"因果", desc:"违抗预言，命运线与圣山神谕的对抗", plant:"flag:prophecy_defied", reap:"node:orc_deep_totem", status:"open", world:"兽人草原"},
  {id:"led_29", type:"因果", desc:"背叛同窗，学院线的代价与割裂", plant:"flag:betrayed_classmate", reap:"node:elf_deep_council", status:"open", world:"学院线"},
  {id:"led_30", type:"因果", desc:"解放水岸，南方水岸线的高光转折", plant:"flag:aquan_liberated", reap:"node:tm_negotiate", status:"open", world:"南方线"},
  {id:"led_31", type:"因果", desc:"放走信使，情报线上的一次仁慈", plant:"flag:let_mercury_go", reap:"node:tm_courier", status:"open", world:"铁门关"},
  {id:"led_32", type:"地点", desc:"东境晨天城，帝京文脉与铁门关外的故土（BD-4 经 east_chengtian_old 故都线核销）", plant:"node:tm_refugee", reap:"node:east_chengtian_old", status:"closed", world:"东境"},
  {id:"led_33", type:"事件", desc:"兽人草原入局，外乡人踏进黑石部族", plant:"node:orc_deep_gate", reap:"node:orc_deep_leave", status:"open", world:"兽人草原"},
  {id:"led_34", type:"事件", desc:"精灵王庭入局，银叶集市的第一印象", plant:"node:elf_deep_market", reap:"node:elf_deep_council", status:"open", world:"精灵线"},
  {id:"led_35", type:"地点", desc:"矮人王都铁砧议会，八百年的锤声", plant:"node:dwarf_deep_hall", reap:"node:dwarf_deep_mine2", status:"open", world:"矮人线"},
  {id:"led_36", type:"伏笔", desc:"西境元素风暴异常：风暴间隔缩短、风暴眼蓝光游走、枯井泉水与地下裂缝相通，与元素行者/封魔之战旧史呼应（BD-1 新埋）。", plant:"node:west_storm_observatory", reap:"future", status:"open", world:"西境"},
  {id:"led_37", type:"伏笔", desc:"死亡沙漠第七封印柱松动：盐湖渗水、夜车取水、遗迹壁画的凿柱笔记，与 seal 深渊封印松动（day200）同源呼应（BD-2 新埋）。", plant:"node:desert_seal_watch", reap:"future", status:"open", world:"死亡沙漠"},
  {id:"led_38", type:"伏笔", desc:"圣城圣痕司地基下发现与沙漠第七柱同源的石柱（艾德蒙叔叔遗信），圣城与沙漠压在一条封印线上（BD-3 新埋）。", plant:"node:church_doubter2", reap:"future", status:"open", world:"光明教会"}
];
/* ===== /v91inj:ledger:end/ ===== */

/* ===== /v91inj:ledgerwords/ CM-3 设定词冻结表（elda ci 第 19 检查器：每词必须在其所属域出现） ===== */
window.CAUSALITY_WORDS = [
  {word:"金秤", world:"金秤线", file:"script_02a.js"},
  {word:"晨天", world:"东境", file:"script_02.js"},
  {word:"鬃吼", world:"兽人草原", file:"dn_orc_deep.js"},
  {word:"腐光", world:"暗蚀线", file:"script_02b.js"},
  {word:"秦·长风", world:"铁门关", file:"script_02d.js"},
  {word:"七枚锚", world:"精灵线", file:"dn_elf_dwarf.js"},
  {word:"铁牌", world:"七锚线", file:"script_02.js"},
  {word:"神谕", world:"兽人草原", file:"script_02.js"},
  {word:"灰鬃", world:"兽人草原", file:"dn_orc_deep.js"},
  {word:"林歌", world:"精灵线", file:"dn_elf_dwarf.js"},
  {word:"银月", world:"精灵线", file:"script_02.js"},
  {word:"铁门关", world:"铁门关", file:"script_02.js"},
  {word:"圣山", world:"兽人草原", file:"script_02.js"},
  {word:"狼旗", world:"兽人草原", file:"script_02d.js"},
  {word:"月池", world:"精灵线", file:"dn_elf_dwarf.js"},
  {word:"树根", world:"精灵线", file:"script_02e.js"},
  {word:"祖灵", world:"兽人草原", file:"script_02a.js"},
  {word:"大汗", world:"兽人草原", file:"script_02a.js"},
  {word:"青叶", world:"精灵线", file:"dn_elf_dwarf.js"},
  {word:"净化令", world:"净化令线", file:"script_02g.js"}
];
/* ===== /v91inj:ledgerwords:end/ ===== */

/* /u1inj:data-nodes:dn_chapters.js/ */
/* ============================================================
 * dn_chapters.js — I1-2 章节标题卡映射表（纯数据，无引擎逻辑）
 * 引擎钩子：script_03.js sceneTitle() 内 1 处（/t12inj:chapter/）
 * 未命中此表的节点零变化。
 * 结构：{ 节点id: {vol:"卷名", title:"标题", sub:"副题(可空)"} }
 * ============================================================ */
window.CHAPTERS_I12 = {

  /* ===== 第一卷 · 自由城邦 ===== */
  "arrive_free_huigang":  {vol:"第一卷 · 自由城邦", title:"灰港 · 序章", sub:"你从渡船上走下来，身无长物，唯有一身尚未定型的天资"},
  "arrive_free_jiaohui":  {vol:"第一卷 · 自由城邦", title:"交汇城 · 市井", sub:"清晨从叫卖声开始，你在这条街上长大"},
  "arrive_free_jishi":    {vol:"第一卷 · 自由城邦", title:"集市城 · 货海", sub:"白昼是货物的海洋，入夜是另一片海洋"},
  "arrive_free_gonghui":  {vol:"第一卷 · 自由城邦", title:"冒险者之城", sub:"刀口舔血的营生，在这里明码标价"},

  /* ===== 第二卷 · 圣光与阴影 ===== */
  "arrive_church_shengcheng": {vol:"第二卷 · 圣光与阴影", title:"圣城 · 钟声", sub:"白袍、圣歌与净化令的阴影"},
  "world_purge":              {vol:"第二卷 · 圣光与阴影", title:"净化令 · 异端之火", sub:"'异端'一词，如今能烧死任何人"},

  /* ===== 第三卷 · 铁门关的风 ===== */
  "arrive_east_tiemen":  {vol:"第三卷 · 铁门关的风", title:"铁门关 · 兵甲", sub:"关内是粮仓，关外是烽火"},
  "arrive_north_aierda": {vol:"第三卷 · 铁门关的风", title:"艾尔达城 · 旧都", sub:"北方公国联盟的中心，沉默而耐寒"},
  "arrive_north_beijing":{vol:"第三卷 · 铁门关的风", title:"北境城 · 雪线", sub:"冰原与铁甲之地"},
  "arrive_north_haigang":{vol:"第三卷 · 铁门关的风", title:"海港城 · 冰港", sub:"船是摇篮，冰是门槛"},
  "arrive_north_hewan":  {vol:"第三卷 · 铁门关的风", title:"河湾城 · 水关", sub:"银穗河的支流在这里拐了个弯"},
  "arrive_north_kuangshan":{vol:"第三卷 · 铁门关的风", title:"矿山城 · 铁脉", sub:"锤声昼夜不息，矿石养活了半座北境"},
  "arrive_north_senlin": {vol:"第三卷 · 铁门关的风", title:"森林城 · 木墙", sub:"林木深处有猎人的火塘"},
  "arrive_north_tiebi":  {vol:"第三卷 · 铁门关的风", title:"铁壁城 · 要塞", sub:"北境最硬的一道墙"},
  "world_silver":        {vol:"第三卷 · 铁门关的风", title:"银穗商路危机", sub:"北方的麦价一夜涨了三成"},
  "faction_orc_intro":   {vol:"第三卷 · 铁门关的风", title:"兽人南下", sub:"狼旗南指，北境烽火已燃"},

  /* ===== 第四卷 · 东部王国 ===== */
  "arrive_east_chengtian": {vol:"第四卷 · 东部王国", title:"晨天城 · 帝京", sub:"墙与科举的墨，兵甲与诏书的影"},

  /* ===== 第五卷 · 死亡沙漠 ===== */
  "arrive_desert_bianyuan": {vol:"第五卷 · 死亡沙漠", title:"边缘绿洲", sub:"黄沙与绿洲之间，水是唯一的真理"},
  "arrive_desert_shendian": {vol:"第五卷 · 死亡沙漠", title:"深渊神殿", sub:"黄沙之下的古老石殿，壁画上画着七道封印"},
  "battle_seal1_intro":     {vol:"第五卷 · 死亡沙漠", title:"深渊封印 · 松动", sub:"某个被遗忘的封印正在哭"},

  /* ===== 第六卷 · 种族之地 ===== */
  "arrive_elf_wangting": {vol:"第六卷 · 种族之地", title:"迷雾边界 · 精灵", sub:"森林之民的长寿与疏离"},
  "arrive_dwarf_wangdu": {vol:"第六卷 · 种族之地", title:"石门 · 矮人王都", sub:"山腹中的锤声与熔炉"},
  "arrive_orc_heishi":   {vol:"第六卷 · 种族之地", title:"黑石部族营地", sub:"狼旗与马蹄下的草原部族"},
  "arrive_orc_shengshan":{vol:"第六卷 · 种族之地", title:"兽人圣山", sub:"草原的信仰钉在高处的石台上"},

  /* ===== 第七卷 · 学院与南境 ===== */
  "branch_academy_join": {vol:"第七卷 · 学院与南境", title:"艾尔达魔法学院", sub:"弱者握卷，强者握法，最强者握法则"},
  "arrive_south_gangkou": {vol:"第七卷 · 学院与南境", title:"港口城 · 汽笛", sub:"商船与汽笛是这里的摇篮曲"},
  "arrive_south_huangjin":{vol:"第七卷 · 学院与南境", title:"黄金城 · 金库", sub:"金钱联邦的心脏，算盘声比摇篮曲更催人安眠"},
  "arrive_south_moxie":   {vol:"第七卷 · 学院与南境", title:"魔械城 · 齿轮", sub:"炼金与魔械的轰鸣从不停歇"},
  "arrive_south_shangzhan":{vol:"第七卷 · 学院与南境", title:"商栈城 · 货栈", sub:"契约丈量人心，黄金撬动国运"},
  "arrive_south_xueshu":  {vol:"第七卷 · 学院与南境", title:"学术城 · 书海", sub:"墨水比血更贵的地方"},

  /* ===== 终章 · 命运落定 ===== */
  "ending_check":           {vol:"终章", title:"命运落定 · 抉择", sub:""},
  "ending_choose":          {vol:"终章", title:"命运落定 · 岔路", sub:""},
  "ending_v24_become":      {vol:"终章", title:"登临 · 成为", sub:""},
  "ending_v24_coexist":     {vol:"终章", title:"共存 · 万灵", sub:""},
  "ending_v24_free":        {vol:"终章", title:"自由 · 无拘", sub:""},
  "ending_v24_no_succession":{vol:"终章", title:"无嗣之终", sub:""},
  "ending_v24_seal":        {vol:"终章", title:"封印 · 永镇", sub:""},
  "ending_v24_succession":  {vol:"终章", title:"传承 · 薪火", sub:""},
  "ending_v36_church":      {vol:"终章", title:"圣座 · 高处", sub:""},
  "ending_v36_eclipse":     {vol:"终章", title:"日蚀 · 吞光", sub:""},
  "ending_v36_review":      {vol:"终章", title:"回望 · 一生", sub:""},
  "ending_v36_watcher":     {vol:"终章", title:"守望者 · 灯火", sub:""},
  "ending_watcher":         {vol:"终章", title:"守望者 · 灯火", sub:""},
  "ending_after_watcher":   {vol:"终章", title:"守望之后 · 晨光", sub:""},
  "ending_all_races":       {vol:"终章", title:"万族 · 同辉", sub:""},
  "ending_classmates":      {vol:"终章", title:"同窗 · 故人", sub:""},
  "ending_eclipse":         {vol:"终章", title:"日蚀 · 吞光", sub:""},
  "ending_elder_memoir":    {vol:"终章", title:"回忆录 · 落笔", sub:""},
  "ending_prelude_hub":     {vol:"终章", title:"序章回响", sub:""},
  "ending_seal_chain":      {vol:"终章", title:"封印之链 · 七环", sub:""}
};

/* /u1inj:data-nodes:dn_church.js/ */
/* /bd3inj:church/ BD-3 光明教会辖区包（三大路线 · 线二 内容包 3）
   圣城解锁：审判庭 / 异端牢房 / 圣痕司·圣物司 / 大教堂侧廊
   与 purge 净化令（day60）强联动——净化令波及玩家时可玩三路（藏匿/抗争/作证），
   不改变 purge 主线判定；不触碰神谕与教会根基设定（大审判长 judge_ally 线沿用）。
   pace 全覆盖；治理词清零（V66 高频词表逐词核对）。 */
N["arrive_church_tribunal"] = {
  tag:"main",
  place:"光明教会 · 圣城 · 审判庭", where:"白昼", pace:"deep",
  text:[
    "圣城的净化令张贴在城门口时，正是春末。羊皮纸上的火漆还新，落款是圣痕司大审判长的花押。",
    "告示上列着三条：凡修炼『灵魂』『深渊』『血术』者，限期到圣痕司自陈；凡收容『异端』者，同罪；凡知情不报者，视为同谋。",
    "你站在告示前，人群挤在身后。有人念出声，有人沉默。一个灰袍执事走过来，看了你一眼：「这位朝圣者，你的文牒上写的是『自由城邦』？」他顿了顿，「自由城邦的人，见过的东西多。见过，就要说清楚。」",
    "他看了看你腰间——那里，挂着一枚旧铜牌。"
  ],
  options:[
    {t:"（自陈：坦然承认与『黑暗』打过交道）",go:"church_testify"},
    {t:"（避其锋芒：转身离开，另寻落脚处）",go:"church_hide"},
    {t:"（面陈：求见大审判长，当面说清楚）",check:{a:"CHA",sk:"persu",label:"面陈"},tier:{
      ok:["你递上名帖，执事认得你的名字——上一回在圣痕司偏厅，大审判长见过你。执事犹豫片刻，放你进去。","大审判长放下手中的卷宗：「净化令是教宗的意思，我执行。」他抬眼看你，「你若是来求情，省一省。你若是来说『真话』，坐下。」"],
      fail:["执事没有放行：「净化令期间，非召不见。」你碰了钉子，退出来，另寻出路。"],
      crit:["你不仅见到大审判长，还从他对面那叠卷宗里，瞥见一个名字：『银月商会』。「你在看这个？」大审判长不动声色地把卷宗翻过去，「净化令查的是异端，不是商会。」他顿了顿，「至少，现在不是。」"]
    },effects:{xp:30,infl:{church:5}},go:"church_resist"}
  ]
};
N["church_hide"] = {
  tag:"branch",
  place:"光明教会 · 圣城 · 下水道", where:"黑暗", pace:"normal",
  text:[
    "你绕开大路，从城东的排水渠钻进城下的暗沟。水很浅，苔藓没到脚踝，空气里有一股发酵的潮味。",
    "暗沟里不止你一个人。你听见前方拐角处有动静——火折子擦亮，一个佝偻的身影蹲在那里，面前摊着一叠纸，正在烧。",
    "「谁？」那人声音沙哑。火光照出一张老脸——是烛台书店的老者。他看清你，松了一口气：「是你。」",
    "他把最后一页纸扔进火里，看着它蜷曲、发黑：「净化令的名单，今天贴出来了。上面有几个名字，是书店的老主顾。」他站起身，「我一把火烧了联络册。你也是来躲的？」"
  ],
  options:[
    {t:"（帮老者烧完纸，一起躲过这阵风）",check:{a:"AGI",sk:"stealth",label:"潜藏"},tier:{
      ok:["你和老者把最后几页纸烧净，灰烬扫进水流冲走。你们在暗沟里蹲了一夜，听着头顶圣骑士的靴声来来去去，直到天亮才分开。","老者临走时塞给你一张纸条：「明天午后，老地方。」"],
      fail:["你蹲在暗沟里，一夜没合眼。圣骑士的靴声几次从头顶掠过，好在没停下来。天亮时你钻出来，腰酸背痛。"],
      crit:["你不仅躲过搜查，还从老者口中套出一个细节：「名单是圣痕司排的，但墨迹是新的——名单贴出来之前，有人已经『预知』了内容。」他压着嗓门，「圣城里有内鬼，比名单更早。」"]
    },effects:{xp:25,infl:{church:3},flag:"church_hidden"},go:"church_tribunal_end"},
    {t:"（不躲了，出去面对）",go:"church_testify"}
  ]
};
N["church_resist"] = {
  tag:"branch",
  place:"光明教会 · 圣痕司 · 偏厅", where:"白昼", pace:"deep",
  text:[
    "大审判长让你在偏厅等了一个时辰。窗外的钟声敲过三遍，他才推门进来，手里端着一杯茶——不是给你的。",
    "他坐下，吹了吹茶面：「净化令的事，你大概觉得不近人情。」他没抬头，「我在圣痕司二十年，见过一千种『黑暗』。九成是装的，一成是真的。」",
    "他抬起眼：「你是哪一种？」",
    "你站在他面前，能感觉到他眉间那道深痕里压着的东西。偏厅的墙上，挂着一幅旧画：一个披袍的人影，双手按地，地下的裂缝合拢——和沙漠遗迹壁画上的一模一样。"
  ],
  options:[
    {t:"（直言：真正的黑暗在沙漠，不在圣城）",check:{a:"INT",sk:"lore",label:"陈词"},tier:{
      ok:["你把沙漠遗迹的第七柱、盐湖渗水、夜车取水的事说了。大审判长听完，沉默了很久。他放下茶杯：「你说的事，我信一半。」他起身走到那幅旧画前，「这一半，已经够要命了。」","他转回身：「净化令的事，我替你在教宗面前说一句话。但你要答应我一件事——」他盯着你，「去沙漠，把第七柱的事，查清楚。」"],
      fail:["大审判长摇了摇头：「你说的事太玄，没有实证。」他起身送客，「净化令的事，我帮不了你。自证清白，是圣城给每个人的机会。」"],
      crit:["你不仅陈词，还拿出盐湖边捡到的七杠铜牌。大审判长盯着铜牌，瞳孔一缩：「这牌子……你在哪拿到的？」他接过铜牌，翻来覆去看了很久，「这是『骨』部的信物。」他压着嗓门，「上一任大审判长，就是追着这牌子，走进沙漠的。」"]
    },effects:{xp:35,infl:{church:5},flag:"church_resisted"},go:"church_tribunal_end"},
    {t:"（退一步：表明自己愿意配合清查）",check:{a:"CHA",sk:"persu",label:"周旋"},tier:{
      ok:["你避重就轻，表示愿意配合圣痕司的清查，也愿意为净化令『出力』。大审判长看了你一眼，没有拆穿：「配合就好。圣城需要人手。」","他给你一枚灰袍执事的临时徽章：「拿着。在圣城走动，方便些。」"],
      fail:["你的话术在大审判长面前太浅。他淡淡说：「配合，不是嘴上说说。」你只得告退。"],
      crit:["你不仅拿到临时徽章，还听出他话里的弦外之音：「圣城需要人手——但『真话』比人手更缺。」他顿了顿，「你若是想查什么，就去圣物司看看。最近，圣物失窃的事，闹得厉害。」"]
    },effects:{xp:20,infl:{church:3},item:"灰袍临时徽章"},go:"church_relic"}
  ]
};
N["church_testify"] = {
  tag:"branch",
  place:"光明教会 · 圣痕司 · 陈情厅", where:"白昼", pace:"deep",
  text:[
    "陈情厅的采光很好，好得让人无所遁形。圣痕司的三位执事坐在长桌后，面前摊着你的文牒。",
    "「姓名。」「……」「籍贯。」「自由城邦。」「职业。」「旅者。」",
    "主审执事抬起头：「旅者。」他重复了一遍这个词，「『旅者』这个说法，最近在圣城很流行。」他翻到文牒下一页，「你到过的地方不少——草原、沙漠、西境。」他顿了顿，「你见过『黑暗』吗？」",
    "厅里安静下来。窗外的钟声敲响，惊起一群白鸽。"
  ],
  options:[
    {t:"（如实作证：见过沙漠封印柱，但没碰过）",check:{a:"INT",sk:"lore",label:"作证"},tier:{
      ok:["你如实讲述沙漠第七柱的见闻。执事们互相对视，主审执事在册子上记了几笔：「证词记录在案。你说你没碰过封印柱——」他抬眼，「那我们暂且记下。」","他合上册子：「净化令是防『异端』，不是防旅人。你可以走了。」"],
      fail:["你的证词前后有破绽。主审执事敲了敲桌面：「『见过黑暗』的人，说话往往颠三倒四。」他示意执事，「请这位旅者，去异端牢房冷静两天。」"],
      crit:["你的证词详尽而扎实，甚至提供了盐湖取水点的具体位置。主审执事沉吟良久，在册子上盖了一枚印章：「『清白的旅者』。名字会从名单上划掉。」","他顿了顿，压着嗓门：「不过，提醒你一句——名单划掉之后，『看名单的人』，会记住你的名字。」"]
    },effects:{xp:30,infl:{church:5},flag:"church_cleared"},go:"church_tribunal_end"},
    {t:"（拒绝作证：沉默是唯一的回答）",check:{a:"AGI",sk:"stealth",label:"沉默"},tier:{
      ok:["你一言不发。执事们问了半个时辰，问不出什么，最终挥手放行：「没有实证，圣痕司不扣人。」","你走出陈情厅时，主审执事的声音从背后传来：「沉默，也是一种回答。我们记下了。」"],
      fail:["你的沉默被解读为心虚。执事们扣下你的文牒：「留档三日，查清了再还你。」你在圣城失去了凭证，只能绕道行动。"],
      crit:["你不仅保持沉默，还注意到主审执事桌角压着一封信，信封上画着一枚极淡的竖瞳。「他在看暗蚀会的信。」你把这一幕记在心里，走出陈情厅时，脊背发凉。"]
    },effects:{xp:20,infl:{church:3},flag:"church_silent"},go:"church_tribunal_end"}
  ]
};
N["church_tribunal_end"] = {
  tag:"branch",
  place:"光明教会 · 圣城 · 广场", where:"白昼", pace:"light",
  text:[
    "审判的风波过去，圣城恢复了表面的平静。白鸽重新落在钟楼上，朝圣者排着队进大教堂。",
    "你站在广场中央，看着那些虔诚的身影。净化令还在城门口贴着，羊皮纸边角被风掀起，像一只翻白的眼睛。",
    "你摸了摸怀里——铜牌、徽章、或者那片断裂的衣角，都在。圣城是一座会记住人的城。",
    "你决定下一步的去向。"
  ],
  options:[
    {t:"去异端牢房，看看关着什么人",run:function(){ curNode="arrive_church_prison"; writeNext(); }},
    {t:"去圣物司，查圣物失窃案",run:function(){ curNode="church_relic"; writeNext(); }},
    {t:"去大教堂侧廊，找那位质疑者修士",run:function(){ curNode="church_doubter1"; writeNext(); }},
    {t:"离开圣城",run:function(){ travelTo("free_jiaohui"); }}
  ]
};
N["arrive_church_prison"] = {
  tag:"main",
  place:"光明教会 · 圣城 · 异端牢房", where:"地下", pace:"deep",
  text:[
    "异端牢房在圣痕司的地下一层。石阶向下，空气越来越凉，墙上的圣光符文亮着惨白的光。",
    "看守牢房的老狱卒认得你的临时徽章：「圣物司的人？不对……执事？」他摆摆手，「算了，要看就看。别逗留太久。」",
    "牢房一共七间，现在关着五个人。你挨个看过去：一个疯疯癫癫的老修士，在墙角的圣光符文前念念有词；一个年轻的铁匠，靠墙坐着，眼神空洞；一个蒙着面的女人，背对牢门，纹丝不动。",
    "第五间牢房里，一个孩子蜷在草堆上，听见脚步声，抬起头——他有一双银色的眼睛，在昏暗的牢房里，像两枚发亮的钉子。",
    "老狱卒压着嗓门：「那孩子，是『看见了不该看的』。圣痕司说他『见黑暗』，关进来等净化。都三个月了。」"
  ],
  options:[
    {t:"（走近牢门，问孩子看见了什么）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
      ok:["孩子往牢门边挪了挪，压着嗓门：「我看见了……墙里有东西。」他指着牢房后墙，「那面墙，后面是空的。夜里，有人从墙里走过去。」","你蹲下细看——墙根有一条极细的接缝，不仔细看根本看不出。这是暗门的边缘。"],
      fail:["孩子怯生生地缩回草堆，不肯说话。老狱卒催你：「走吧走吧，别吓着他。」"],
      crit:["孩子告诉你更多：「每隔七天，就有个穿灰袍的人进来，往墙里送东西。」他顿了顿，「上回，他进来时，袖子里掉出一枚铜牌——跟你的，一模一样。」","你心头一震。他指的是七杠铜牌。暗门、灰袍人、七杠铜牌——圣城的牢房下面，藏着一条通往别处的路。"]
    },effects:{xp:30,infl:{church:3},flag:"church_cell_vision"},go:"church_tribunal_end"},
    {t:"（不惊动任何人，记住暗门的位置）",check:{a:"AGI",sk:"stealth",label:"观察"},tier:{
      ok:["你把暗门接缝的位置牢牢记下：后墙第三块砖，距地面约一人高，接缝处有新鲜的刮痕——最近有人移动过。","你记完位置，若无其事地走出牢房。老狱卒没起疑。"],
      fail:["你在牢房里停留太久，老狱卒起了疑：「执事大人，今天怎么这么有空？」你只得匆匆离开。"],
      crit:["你不仅记住暗门位置，还发现墙根有一小片干涸的蓝白色沙粒——和盐湖边的盐沙一模一样。「牢房的暗门，通到盐湖方向。」这个念头让你脊背发凉。"]
    },effects:{xp:25,infl:{church:3},flag:"church_prison_secret"},go:"church_tribunal_end"}
  ]
};
N["church_relic"] = {
  tag:"branch",
  place:"光明教会 · 圣物司", where:"白昼", pace:"normal",
  text:[
    "圣物司在大教堂东翼，一排玻璃柜里陈列着圣物：初代教宗的手杖、殉道者的指骨、一截据说是『圣临之树』的枝干。",
    "你进门时，圣物司的司务正急得团团转：「不见了……真的不见了……」他看见你胸前的徽章，像抓住救命稻草，「执事大人！『圣临之枝』丢了！昨晚还在柜里的！」",
    "他带你到空柜前。柜门完好，锁扣无损，玻璃上只有一层薄灰——柜里的圣物，却凭空消失了。",
    "「圣痕司说是我监守自盗！」司务急得直跺脚，「我在这干了三十年，连圣物的一粒灰都没碰过！」"
  ],
  options:[
    {t:"（勘查现场，找失窃的痕迹）",check:{a:"INT",sk:"detect",label:"勘查"},tier:{
      ok:["你蹲下细看：柜门锁扣完好，但柜顶的灰尘有一道极淡的擦痕——有人从柜顶掀开玻璃取走圣物。柜顶，是天窗的方向。","「天窗。」你抬头看。圣物司的天窗开着一条缝，缝边卡着一小片灰白色的布丝。"],
      fail:["现场干净得不像失窃现场。你看了半天，只确认柜门锁扣无损。"],
      crit:["你不仅发现天窗布丝，还在布丝上找到几粒蓝白色的细沙。「盐沙。」又是盐沙。取走圣物的人，来自沙漠方向——或者，常去沙漠。"], 
    },effects:{xp:30,infl:{church:5},flag:"church_relic_trail"},go:"church_relic_trail"},
    {t:"（问司务：最近谁来过圣物司）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
      ok:["司务想了想：「上个月，圣痕司来『盘点』过一次。带队的是个灰袍执事，很年轻，话不多。他看过圣临之枝的柜子。」","「还有……」司务压着嗓门，「前天，大审判长的亲随，也来过一趟。说是『例行查看』。」"],
      fail:["司务急得语无伦次，什么有用信息也没给出来。"],
      crit:["司务想起一个细节：「那年轻执事盘点时，手边一直放着个皮囊——像是装沙的。」他比划着，「我当时还纳闷，圣痕司的人，带沙子干什么。」"]
    },effects:{xp:25,infl:{church:3}},go:"church_relic_trail"}
  ]
};
N["church_relic_trail"] = {
  tag:"branch",
  place:"光明教会 · 圣城 · 城头", where:"黄昏", pace:"deep",
  text:[
    "你循着线索摸上圣物司的天窗，沿着屋脊走到城头。黄昏的光把圣城染成金色，钟声在远处响起。",
    "城头哨塔的阴影里，你找到一个灰袍的年轻执事。他背对着你，手里捧着一截泛着微光的枝干——正是圣临之枝。",
    "「你不该追到这里。」他头也不回，「追到这里的，都『看见了不该看的』。」他转过身，你看见他左眼角有一道旧疤——沙漠遗迹暗廊里，那个领头的人。",
    "「是你。」你说。「是我。」他承认，「沙漠的第七柱，圣城的圣临之枝，盐湖的水——都是一条线上的。」他顿了顿，「这条线，比你想象的深。」"
  ],
  options:[
    {t:"（对峙：要他把圣物交回来）",check:{a:"STR",sk:"martial",label:"对峙"},tier:{
      ok:["你上前一步，气势压住他。年轻执事退后半步，掂了掂手里的圣临之枝：「你很强。但我手里的东西，比你更值钱。」他忽然一笑，「圣痕司丢了圣物，追查的是我。你猜，他们会信谁？」","他纵身跳下城头，消失在暮色里。你手里只留下一截断裂的灰袍衣角——和那道伤疤的清晰记忆。"],
      fail:["你扑了个空。年轻执事轻巧地躲开，消失在城头。你只追到一片衣角。"],
      crit:["你不仅逼退他，还在他跳下城头时，看清他腰间挂着一枚铜牌——七道杠，和你的一模一样。「『骨』部的信物。」你想起烛台书店老者的话。这条线，真的比他说的更深。"]
    },effects:{xp:30,infl:{church:5},flag:"church_scar_trace"},go:"church_doubter1"},
    {t:"（不动手，先记下这条线）",check:{a:"INT",sk:"detect",label:"记住"},tier:{
      ok:["你退开一步，让出道路。年轻执事多看了你一眼：「识趣。」他转身离去前，留下一句话，「圣临之枝只是引子。真正的东西，在沙漠底下。」","你站在原地，把他这句话、那道伤疤、那枚铜牌，全部记进心里。"],
      fail:["你犹豫的片刻，他已经消失在城头。你只记住他的背影。"],
      crit:["你不仅记住这条线，还在他跳下城头的落点，找到一小撮被匆忙踩碎的蓝白沙粒。「他往盐湖方向去了。」这条线索，和异端牢房的暗门，指向同一个地方。"]
    },effects:{xp:25,infl:{church:3}},go:"church_doubter1"}
  ]
};
/* ---- BD-3 支线：质疑者修士（教团内的低阶修士 · 好感闭环） ---- */
N["church_doubter1"] = {
  tag:"branch",
  place:"光明教会 · 大教堂 · 侧廊", where:"黄昏", pace:"normal",
  text:[
    "大教堂的侧廊比主殿冷清得多。石柱间的长椅上，坐着一个年轻的修士，正对着一卷圣典出神。他听见脚步声，抬起头——你认得他，是刚才在广场上，唯一没有跟着人群划十字的那个人。",
    "「你不是朝圣者。」他直截了当，「朝圣者的步子，没有你这么稳。」他合上圣典，「我叫艾德蒙，大教堂的抄经修士。」",
    "「净化令贴出来那天，我抄了三天三夜的名单。」他顿了顿，「名单上的名字，我一个个对过——没有一个，是真正的『异端』。」",
    "他望着你：「你信光明吗？」没等你回答，他自嘲地笑了笑：「你不用回答。我自己都不太信了。」"
  ],
  options:[
    {t:"（不急着回答，先听他讲）",check:{a:"CHA",sk:"persu",label:"倾听"},tier:{
      ok:["你在长椅另一头坐下，听他讲了一下午：他抄了十年圣典，把每一个『圣迹』都对照过年份与地点。「圣迹是真的。」他说，「但圣痕司用圣迹做的『标记』，是假的。」","「他们把『见过黑暗』的人标记为异端，是因为——」他压着嗓门，「『见过黑暗』的人，会看见圣痕司不想让人看见的东西。」"],
      fail:["艾德蒙张了张嘴，最终摇摇头：「算了。跟陌生人说这些，没什么用。」他抱起圣典走了。"],
      crit:["你不仅听他讲完，还追问了一个关键问题：「谁在圣痕司背后？」艾德蒙沉默了很久：「圣痕司管『净化』，但『名单』不是圣痕司排的。」他声音很轻，「名单，是从『上边』下来的。」"]
    },effects:{xp:25,infl:{church:3},relation:{npc:"church_edmond",delta:20,reason:"侧廊倾听"}},go:"church_doubter2"},
    {t:"（亮出你的见闻：沙漠第七柱）",check:{a:"INT",sk:"lore",label:"交底"},tier:{
      ok:["你把沙漠第七柱、盐湖渗水、圣物失窃的事告诉了他。艾德蒙听完，握着圣典的手收紧：「第七柱……」他喃喃，「我在一份旧抄本里，见过七根柱子的图。」","他起身去书架深处翻出一卷发黄的抄本，摊开——正是七柱封印图，与沙漠遗迹壁画如出一辙。","「这是百年前的抄本。」他压着嗓门，「圣痕司若是知道我有这个，我就是下一个『异端』。」"],
      fail:["艾德蒙将信将疑：「沙漠的事，离圣城太远了。」他摇了摇头，没有深谈。"],
      crit:["你不仅交底，还提到大审判长说过的『上一任大审判长追着骨部信物走进沙漠』。艾德蒙脸色一变：「上一任……他是我叔叔。」他声音发颤，「他走进沙漠那年，我十二岁。他再也没有回来。」","他沉默了很久，说：「你查的这条线，也是我叔叔查的线。」"]
    },effects:{xp:30,infl:{church:5},relation:{npc:"church_edmond",delta:25,reason:"七柱交底"}},go:"church_doubter2"}
  ]
};
N["church_doubter2"] = {
  tag:"branch",
  place:"光明教会 · 大教堂 · 藏书室", where:"夜", pace:"deep",
  text:[
    "入夜后，艾德蒙带你进了大教堂的藏书室。烛台的火光下，他翻出一沓旧信：「这是我叔叔留下的。他进沙漠之前，把信都寄给了我。」",
    "你接过信，一封封看下去。信里写的是一个圣痕司执事的日常：清查、巡逻、记录。直到最后一封，字迹突然潦草起来：",
    "「……圣痕司的地基下面，挖出过一样东西。长老们封了消息。我偷偷去看过——是一截石柱，和沙漠神殿壁画上的一模一样。圣城，也压在封印上。」",
    "「我今天，把这事写进了给大审判长的信里。可信还没寄出，就有人来问我：你最近，是不是去了圣痕司的地基？」",
    "「他们要来搜我的房间了。这封信，我只能寄给你。我的孩子，如果你看到这封信——离开圣城。去沙漠，把真相带回来。」",
    "信纸在烛火下泛着黄。艾德蒙的声音有些哑：「这是我叔叔最后一封信。」"
  ],
  options:[
    {t:"（把叔叔的信郑重收好）",check:{a:"CHA",sk:"persu",label:"托付"},tier:{
      ok:["你接过那叠信，郑重收进怀里：「等我把沙漠的事查清楚，这封信，会有个交代。」艾德蒙看着你，点了点头。","「叔叔信里说，圣城也压在封印上。」他压着嗓门说，「圣痕司的地基……我想去看看。」"],
      fail:["艾德蒙看着你把信收好，声音很低：「你要小心。这封信，是叔叔用命换来的。」"],
      crit:["你不仅收下信，还从信纸夹层里摸出一片东西——一枚极薄的金色薄片，刻着半枚竖瞳。「这是……叔叔说的『地基里的东西』？」艾德蒙倒吸一口凉气，「他把它也寄出来了。」"]
    },effects:{xp:30,infl:{church:5},relation:{npc:"church_edmond",delta:25,reason:"收下遗信"},item:"圣痕司旧信",flag:"church_edmond_letter"},go:"church_doubter3"},
    {t:"（问他：圣痕司的地基，怎么进去）",check:{a:"INT",sk:"detect",label:"探查"},tier:{
      ok:["艾德蒙想了想：「圣痕司地基的入口，在旧钟楼底下。我是抄经修士，有钟楼的钥匙。」他顿了顿，「但是，进去之后被人发现，我们俩都会变成『异端』。」"],
      fail:["艾德蒙摇了摇头：「圣痕司地基的入口，连大审判长都未必知道。我只有抄经修士的钥匙，进不了那里。」"],
      crit:["艾德蒙告诉你一个细节：「叔叔的信里写过，地基里的石柱，和沙漠的第七柱『同源』——柱身上刻的纹路，连成一条线。」他压着嗓门，「圣城的封印，和沙漠的封印，是同一根线上的两颗珠子。」"]
    },effects:{xp:25,infl:{church:3},flag:"church_twin_seal"},go:"church_doubter3"}
  ]
};
N["church_doubter3"] = {
  tag:"branch",
  place:"光明教会 · 大教堂 · 侧廊", where:"黎明", pace:"normal",
  text:[
    "天将亮时，艾德蒙把你叫醒。他站在侧廊的窗边，晨光把他的影子拉得很长。",
    "「我昨晚想了一夜。」他转过身，「净化令、名单、圣物失窃、我叔叔的信——这些事串在一起，只有一个解释：圣痕司里面，有人不想让『封印』的事被查下去。」",
    "「而你，是这么多年来，第一个拿着七杠铜牌走到圣城来的人。」他顿了顿，「我叔叔进沙漠之前，也拿着一枚这样的铜牌。」",
    "他望着你，眼神里有种决绝的东西：「我抄了十年经，从来没做过一件『不正经』的事。这一次，我想做一件。」"
  ],
  options:[
    {t:"（邀请他同行，一起去沙漠）",check:{a:"CHA",sk:"persu",label:"同行"},tier:{
      ok:["艾德蒙听完，沉默了很久，最终点了点头：「好。」他回身收拾了一个小包袱，里面只有一卷圣典、一沓信，「我没什么值钱的东西。这些，是全部了。」","他站在晨光里，放低了声音：「如果这次能活着回来，我想把真相，写进新的圣典里。」"],
      fail:["艾德蒙摇了摇头：「我不能走。圣痕司盯着大教堂，我一走，他们就会查到我叔叔的信。」他顿了顿，「你带着信走。我在圣城，替你打掩护。」"],
      crit:["你不仅说服他同行，还约定好掩护计划：他留在圣城，以抄经修士的身份替你盯着圣痕司的动向，每隔七日，往烛台书店留一封『抄经进度』——实为暗号。","「你在沙漠里，我在圣城里。」他说，「咱们这条线，两头都有人守着。」"]
    },effects:{xp:30,relation:{npc:"church_edmond",delta:25,reason:"同行之约"},flag:"church_edmond_ally"},go:"church_doubter4"},
    {t:"（让他留下，独自去沙漠）",check:{a:"CHA",sk:"persu",label:"托付"},tier:{
      ok:["艾德蒙明白你的意思：「你要我一个人，在圣城替你守着这条线。」他点头，「好。我在圣城等你。」","他把叔叔的信郑重地交给你：「带着它。见到沙漠里的真相，让叔叔的信，有个落处。」"],
      fail:["艾德蒙犹豫再三，最终接下了你的托付，但看得出他有些不甘：「你一个人去沙漠，太冒险了。」"],
      crit:["你不仅托付他留守，还教会他一套传信暗号：每七日一封『抄经进度』，信中某页某行的字，就是消息。艾德蒙学得很快：「我抄了十年经，最会的，就是写字。」"]
    },effects:{xp:25,relation:{npc:"church_edmond",delta:20,reason:"圣城守望"},flag:"church_edmond_watch"},go:"church_doubter4"}
  ]
};
N["church_doubter4"] = {
  tag:"branch",
  place:"光明教会 · 圣城 · 城门", where:"白昼", pace:"deep",
  text:[
    "你在城门口与艾德蒙道别。晨光把圣城的白墙照得发亮，他站在城门的阴影里，逆着光，看不清表情。",
    "「有件事，我一直没告诉你。」他开口，「我叔叔进沙漠那年，留给我一句遗言。」",
    "你站住。他压着嗓门说：「他说：『如果有一天，有人拿着七杠铜牌来圣城，告诉他——沙漠里的封印，不是锁着深渊，是锁着『门』。』」",
    "「锁着门。」你重复道。「锁着门。」他点头，「门后面是什么，叔叔也不知道。但他知道，那扇门，不能被打开。」",
    "他后退一步，回到阴影里：「去吧。圣城这边，有我。」"
  ],
  options:[
    {t:"（郑重道别，踏上旅程）",check:{a:"CHA",sk:"persu",label:"道别"},tier:{
      ok:["你向艾德蒙点了点头，转身走出城门。身后，钟声敲响，白鸽惊飞。","你知道，圣城多了一个守望者——一个抄了十年经，终于决定『不正经』一次的修士。","你摸了摸怀里的七杠铜牌。沙漠里的封印，锁着一扇门。这趟旅程，你带着这条线，走向那扇门。"],
      fail:["你与艾德蒙道别时，他张了张嘴，最终只说了一句：「保重。」你走出城门，回头看了一眼——他还站在阴影里。"],
      crit:["道别之际，艾德蒙忽然叫住你：「等一下。」他追上来，从袖子里摸出一枚小小的银质徽章——大教堂的抄经章，「拿着这个。圣城各处的门，抄经修士都能进。」","「万一你还要回来。」他说。你收下徽章，没有多问，转身走进了晨光里。"]
    },effects:{xp:40,infl:{church:8},relation:{npc:"church_edmond",delta:25,reason:"城门道别"},item:"抄经修士徽章"},go:"church_leave2"}
  ]
};
N["church_leave2"] = {
  tag:"branch",
  place:"光明教会 · 圣城 · 郊外", where:"白昼", pace:"light",
  text:[
    "圣城的白墙在你身后越来越远，最终缩成地平线上的一条白线。",
    "你摸了摸怀里的东西：七杠铜牌、圣痕司旧信、抄经修士的徽章。圣城这座城，把太多秘密压在了地底。",
    "你想起艾德蒙的话：沙漠里的封印，锁着一扇门。你决定，沿着这条线，继续走下去。"
  ],
  options:[
    {t:"前往沙漠，追查封印",run:function(){ travelTo("desert_bianyuan"); }},
    {t:"前往西境，找游侠学院",run:function(){ travelTo("west_huangyuan"); }},
    {t:"返回自由城邦休整",run:function(){ travelTo("free_jiaohui"); }}
  ]
};

/* /u1inj:data-nodes:dn_demo.js/ */
// U1 内容外置化 · 数据节点文件 dn_demo.js
// 铁律：本文件只含节点数据（N["id"]=对象），不含引擎逻辑。
// 约定：节点本体存放于 src/data_nodes/，与引擎文件分离；构建时自动内联进 game.html 最后 script 块。
N["u1_demo"]={place:"交汇城 · 外置数据演示点",where:"白昼",text:[
"（U1 内容外置化验证节点——本节点本体存放在 src/data_nodes/dn_demo.js，与引擎文件完全分离。）",
"这条走廊是后来搭的。石墙上嵌着一块新铭牌，刻着三行字：",
"“内容与引擎分离。新增剧情只写数据，不改引擎。一切从此开始。”"
],pace:"light",options:[
{t:"返回市井",go:"fc_streets"}
]};

/* /u1inj:data-nodes:dn_desert.js/ */
/* /bd2inj:desert/ BD-2 死亡沙漠深化包（三大路线 · 线二 内容包 2）
   沙漠从 2 城扩至 5 城：边缘绿洲 bianyuan / 深渊神殿 shendian + 新增
   绿洲集市 lvzhou / 古代遗迹 yiji / 驼队驿站 tuoduo
   世界观约束：与 seal 深渊封印松动（day200）主线联动——封印观察节点给出玩家可介入的线索，
   但不改变 seal 主线判定；与 desert_born 沙漠出身 flag、韩水手/贝壳线（script_02 既有）呼应。
   pace 全覆盖；治理词清零（V66 高频词表逐词核对）。 */
N["arrive_desert_lvzhou"] = {
  tag:"main",
  place:"死亡沙漠 · 绿洲集市城", where:"白昼", pace:"deep",
  text:[
    "绿洲集市城藏在三道沙丘的环抱里，城墙是夯土与棕榈木的混合体，城门口立着一座被风磨得发白的石像——一个背水罐的妇人，面朝沙漠。",
    "你进城时，正午的日头把空气烤得发颤。街上的人不多，但每一个都带着水——腰间的皮囊、背上的陶壶、甚至手里攥着的湿布。在这里，水比钱更硬。",
    "城中心的广场上有一口大井，井沿围了一圈人。你挤过去看：井绳垂下去，拉上来的木桶却是空的，桶底只有一层湿泥。人群里有人骂了一声，更多的人沉默。",
    "一个拄着拐的老驼夫在井边蹲着，抬头看了看你：「外乡人，别看了。这口井，三天前开始见底了。」他指了指城南，「要去，去黑市——那里有人卖水。价钱？」他嗤笑一声，「够你心疼的。」"
  ],
  options:[
    {t:"去城南黑市看看水的行情",go:"desert_lvzhou_market"},
    {t:"打听水源危机的来龙去脉",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
      ok:["你在城里转了一圈，拼出个大概：绿洲集市的水，一半靠大井，一半靠商队从北方驼来。大井三天前开始干涸——不是枯了，是『被抽的』。","「城南那个老盐商，上月买下了城北三眼井的地。」驼夫压着嗓门，「井水一夜之间浅了一半。有人说他装了水车，夜里往城外拉水。」"],
      fail:["城里的人对水的事讳莫如深，你只打听到大井三天前开始见底。老驼夫不愿多说，摆摆手让你自己去黑市看。"],
      crit:["你打听到更深处：那口井不是枯了，是『见了底下的东西』——打水的工人说，第三天夜里，井底露出半块石板，石板上刻着花纹，像某种古老的封印。「工人吓得不敢再打。可第二天，井水就回来了——只回来一半。」","「封印。」你想起黑沙区那条石路。这座城，底下也压着什么。"]
    },effects:{xp:25,infl:{desert:3}},go:"desert_lvzhou_market"},
    {t:"不逗留，去驼队驿站休整",go:"desert_tuoduo_inn"}
  ]
};
N["desert_lvzhou_market"] = {
  tag:"branch",
  place:"死亡沙漠 · 绿洲集市城 · 黑市", where:"白昼", pace:"normal",
  text:[
    "黑市在城南一条窄巷的尽头，一间没挂牌子的土屋里。屋里的空气又闷又潮——地上摆着几十个陶罐，罐口塞着湿布，每一罐都是水。",
    "守摊的是个独眼胖子，坐在水罐中间，手里攥着一串钥匙，叮当作响：「买水？一罐三十铜星，不讲价。」他朝你咧嘴笑了笑，缺了颗门牙，「外乡人，这价钱够你心疼，但够你活命。」",
    "「井见底了，水价涨了三倍。」他抱起一罐水，晃了晃，「要我说，涨价还是小事。真正麻烦的是——」他压着嗓门，「有人开始『卖』井的消息了。谁先知道水从哪来，谁就发财。」"
  ],
  options:[
    {t:"买一罐水（30铜星）",check:{a:"CHA",sk:"bargain",label:"议价"},tier:{
      ok:["你蹲下来，用行话跟他磨了几句：南边的水价、驼队的运价、井见底之后谁家先涨的价。独眼胖子听着听着，松了口：「行，懂行的。二十铜星，拿走。」","他递罐子时压着嗓门：「给你句实在话：别在城里抢水。北边驿站那边，有条商队路子，水便宜一半——但得跟人走。」"],
      fail:["独眼胖子寸步不让：「三十铜星，一个子儿不少。水在沙漠里是命，命不讲价。」你付了钱，抱着水罐出了门。"],
      crit:["你不仅买到水，还套出关键消息：黑市的水，有一部分来自城北的『夜车』——有人夜里用蒙布的车拉水进城，车辙在沙地上朝北，通到驼队驿站方向。","「夜车的水，比井水甜。」独眼胖子意味深长，「甜的水，不像是沙里打出来的。」"]
    },effects:{gold:-2,infl:{desert:3}},go:"desert_tuoduo_inn"},
    {t:"追问『夜车』的事",check:{a:"INT",sk:"detect",label:"追查"},tier:{
      ok:["你顺着夜车的线索查下去，在黑市后巷找到一个打更的老头。他告诉你：夜车每三天来一次，车上的人蒙着面，从不说话，水卸在城北的仓库里。","「那水，我尝过。」老头咂咂嘴，「甜的，带着一股……凉气。不像井水，像山泉。」他顿了顿，「沙漠里，哪来的山泉？」"],
      fail:["夜车的线索断在黑市后巷。打更的老头收了你的钱，却只说一句「不该问的别问」，转身走了。"],
      crit:["你不仅摸到夜车的规律，还发现一个细节：夜车走后，车辙里有细碎的蓝白色沙粒——不是黄沙，是发白的细沙，像盐。「盐沙。」你记下这个特征。沙漠里有盐湖的地方，才有这种沙。"]
    },effects:{xp:25,infl:{desert:3},flag:"desert_nightcar"},go:"desert_water_crisis"}
  ]
};
N["desert_water_crisis"] = {
  tag:"branch",
  place:"死亡沙漠 · 绿洲集市城 · 水井广场", where:"夜", pace:"deep",
  text:[
    "夜里的水井广场比白天更挤。井沿的火把把每个人的影子拉得很长，人群里有人喊：「又见底了！」井绳吱呀吱呀地响，拉上来的木桶，还是空的。",
    "人群骚动起来。有人开始推搡，有人往井边挤。一个抱着孩子的妇人被挤得踉跄，差点跌进井口——旁边一个黑瘦的汉子一把拽住她，吼了一声：「别挤！挤翻了井，谁也喝不上！」",
    "汉子跳上井台，扫了一圈人群：「水没了，事在人为。城北有夜车的水，我认得路。想去的，跟我走。」",
    "人群安静了一瞬。有人在暗处喊：「夜车的水，是『那个人』的。你敢动？」",
    "汉子盯着那个方向：「沙漠里，水就是命。命都保不住了，还怕『那个人』？」"
  ],
  options:[
    {t:"站出来，帮黑瘦汉子稳住局面",check:{a:"CHA",sk:"persu",label:"立威"},tier:{
      ok:["你跳上井台，三言两语把局面压了下来：先排老弱取水、再议夜车的事、不许挤踏。人群在你的安排下渐渐有序。","黑瘦汉子看了你一眼，点点头：「外乡人，有把式。」他压着嗓门说，「我叫石驼，跑北线的。你帮了忙，这份情我记着。」"],
      fail:["人群太乱，你的话被淹没在争吵里。有人推了你一把，你踉跄着退出人群。黑瘦汉子自己稳住了局面，但看你的眼神里没有多少热络。"],
      crit:["你不仅稳住局面，还当场指出夜车水的来源问题——发白的盐沙、甜凉的口感、城北仓库。「那水不是井水。」你高声说，「是盐湖深层的渗水。取盐湖的水，会动湖底的沙层。」","人群里懂行的驼夫倒吸一口凉气：「盐湖底……那下面压着的东西，可不能动。」石驼盯着你，眼神变了：「你是什么人？」"]
    },effects:{xp:30,infl:{desert:5},relation:{npc:"desert_shituo",delta:20,reason:"井台立威"}},go:"desert_caravan1"},
    {t:"跟着人群，去城北探夜车的水",check:{a:"AGI",sk:"stealth",label:"尾随"},tier:{
      ok:["你混在人群里，一路摸到城北仓库。夜车果然在——三辆蒙布的车，车夫蒙着面，正往仓库里卸水。你借着阴影蹲在墙根，看清了车上的记号：一只竖瞳，画在车板上。","「竖瞳。」你想起韩水手说过的话。这个记号，跟神殿有关。"],
      fail:["夜车的守卫很警觉，你刚靠近就被喝退。你退回城里，只在远处看见三辆蒙布的车影。"],
      crit:["你不仅摸到夜车，还看见车夫腰间挂着一枚铜牌——铜牌上刻着七道杠，像七道封印的简笔。「七。」你默数了一遍。七个封印，这里的水，是从第七道封印的方向来的。"]
    },effects:{xp:25,infl:{desert:3},flag:"desert_eye_mark"},go:"desert_tuoduo_inn"}
  ]
};
N["desert_sandstorm"] = {
  tag:"branch",
  place:"死亡沙漠 · 荒丘", where:"白昼", pace:"deep",
  text:[
    "你离开绿洲集市往北走，日头正当空。风忽然停了——沙漠里的静，比喧嚣更让人发毛。",
    "你抬头看天：北方的地平线上，一道暗黄色的幕墙正在升起，遮住了半片天。沙暴。不是远处那种，是正冲着你来的那种。",
    "你四下看：沙丘起伏，没有一处避风的地方。不远处有一截半塌的石墙，是旧商路的遗迹，墙根被沙埋了半截。",
    "沙暴越来越近，风里开始裹着细沙，打在脸上生疼。你有两个选择：冲进石墙的阴影里躲着，或者迎着风，找一条活路。"
  ],
  options:[
    {t:"冲进石墙阴影，死死贴住墙根",check:{a:"CON",sk:"survive",label:"避风"},tier:{
      ok:["你扑进石墙的阴影里，扯起衣领护住口鼻，整个人贴紧墙根。沙暴呼啸而至，沙粒像刀一样刮过你的后背，你咬着牙，一寸一寸地稳住身形。","不知过了多久，风停了。你从沙堆里钻出来，抖落满身的沙——墙根护住了你，只呛了几口沙，胳膊被磨破了一层皮（-3 HP）。"],
      fail:["石墙的阴影不够深。沙暴把你整个人埋了半截，你挣扎着爬出来时，脸上、耳朵里全是沙，呼吸像拉风箱（-5 HP）。好在没伤到筋骨。"],
      crit:["你冲进墙根时，发现石墙下有一道半塌的拱门——旧商路的驿站遗迹。你钻进去，沙暴在门外呼啸，你却在里面找到了一个完整的石室，还有半罐没喝完的水。","「运气，也是沙漠教的一种本事。」你在石室里歇到风停，揣上那半罐水，继续上路。"]
    },effects:{xp:25,infl:{desert:3}},go:"desert_tuoduo_inn"},
    {t:"迎着风走，找驼队的烽火台",check:{a:"AGI",sk:"survive",label:"求生"},tier:{
      ok:["你判断出沙暴的中心在偏移，迎着风往东偏北走——那是驼队驿站烽火台的方向。你顶着风沙走了一个时辰，终于在风沙的缝隙里，看见烽火台上那一点昏黄的火光。","你连滚带爬地摸到烽火台下，一个守台的驼夫把你拽进去：「不要命了？这天气还赶路！」他递给你一袋水，你灌了半袋，缓过气来。"],
      fail:["你判断错了风向，被沙暴裹挟着跑了小半个时辰，最后晕头转向地撞上一截断墙。好在沙暴很快过去，你从沙里爬出来，水袋见了底（-4 HP）。"],
      crit:["你不仅找到烽火台，还在半路上发现一支被沙暴掀翻的驼队——货物散了一地，人已经撤了。你捡起两袋完好的水，还有一枚掉在沙里的铜牌，牌上刻着七道杠。","「又是这个记号。」你攥紧铜牌，心里那根弦绷得更紧了。"]
    },effects:{xp:30,infl:{desert:5},item:"七杠铜牌",go:"desert_tuoduo_inn"}}
  ]
};
N["arrive_desert_tuoduo"] = {
  tag:"main",
  place:"死亡沙漠 · 驼队驿站", where:"白昼", pace:"normal",
  text:[
    "驼队驿站是沙漠里少有的热闹地方：一圈夯土墙围出个大院子，院里拴着几十匹骆驼，货物堆得像小山。驿站的掌柜是个胖妇人，嗓门大得能盖过驼铃：「住店？吃饭？还是找商队捎货？」",
    "她上下打量你一眼：「住店三十铜星一晚，吃饭另算。找商队的话——」她朝院里努努嘴，「那帮人，都在等北线开道。井见底的事，把半个沙漠的驼队都堵在驿站里了。」",
    "院角的凉棚下，一个黑瘦的汉子正蹲在地上喂骆驼，听见动静抬起头——正是井台边那位。他朝你点了点头：「外乡人，又见面了。我叫石驼。北线的驼队，我熟。」"
  ],
  options:[
    {t:"跟石驼攀谈，打听北线商路",go:"desert_caravan1"},
    {t:"先住店，歇一晚再打算",check:{a:"CON",sk:"survive",label:"休整"},tier:{
      ok:["你花三十铜星住进驿站的土房，睡了个踏实觉。第二天精神饱满地起来，水袋灌满，干粮备足，整个人像换了副筋骨。"],
      fail:["驿站的床板太硬，隔壁的驼夫打呼噜响了一夜。你醒来时头昏脑涨，只歇回了半口气。"],
      crit:["你不仅歇好了，还在半夜醒来时听见院里的动静：一队蒙面的车夫正往仓库里卸水，车板上画着一只竖瞳。「夜车的水，果然通到驿站。」你把这个发现记在心里。"]
    },effects:{hp:10,xp:15},go:"desert_tuoduo_inn"}
  ]
};
N["desert_tuoduo_inn"] = {
  tag:"branch",
  place:"死亡沙漠 · 驼队驿站 · 酒馆", where:"夜", pace:"normal",
  text:[
    "驿站的酒馆入夜后最热闹。驼夫们围着火塘喝酒吹牛，话题绕不开三件事：水、沙暴、还有黑沙区那座神殿。",
    "靠窗的桌上坐着个白袍的商人，面前摆着一壶茶，手里转着一枚骰子。他听见隔壁桌提起神殿，忽然开口：「神殿的事，我劝各位少打听。」他转着骰子，声音不高不低，「打听的人多了，水就更少了。」",
    "火塘边安静了一瞬。老驼夫们你看看我，我看看你，没人接话。白袍商人喝完茶，起身走了，骰子留在桌上，六点朝上。",
    "石驼凑过来，压着嗓门：「那人是南线的行商，叫白驼。他手里的货，从来没人见过全貌。有人说他贩水，有人说他贩消息。」他顿了顿，「他刚才那话，不是吓唬人。」"
  ],
  options:[
    {t:"跟出去，追上白袍商人",go:"desert_caravan1"},
    {t:"问石驼：白驼到底是什么人",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
      ok:["石驼想了想：「白驼在南线跑了二十年，从来只做一件事：把水从『有』的地方，运到『没有』的地方。」他压着嗓门，「但上个月，他运了一批不一样的东西——不是水，是『人』。」","「人？」你问。「三个人，蒙着脸，连夜往黑沙区去了。」石驼摇摇头，「从那以后，白驼就常来驿站，像是在等什么人。」"],
      fail:["石驼口风紧：「白驼的底细，我知道的也不多。你自己去问吧，他就在门口。」"],
      crit:["石驼告诉你一个关键细节：「白驼的车队里，有个哑巴车夫，腰上挂着一枚铜牌，七道杠。」他盯着你，「那铜牌，我见过一次——在黑沙区的沙地上，捡到过一模一样的。」"]
    },effects:{xp:20,infl:{desert:3}},go:"desert_caravan1"}
  ]
};
/* ---- BD-2 支线：白驼（南线行商 · 好感闭环） ---- */
N["desert_caravan1"] = {
  tag:"branch",
  place:"死亡沙漠 · 驼队驿站 · 院门", where:"夜", pace:"normal",
  text:[
    "白驼站在驿站院门外，正往骆驼背上搭货。他听见脚步声，回头看了你一眼，手里那枚骰子又转了起来：「是你。井台上那位。」",
    "他笑了一下：「外乡人，你白天那番话，我听见了。盐湖底的东西不能动——这话，沙漠里二十年没人说了。」他把骰子收进怀里，「说吧，找我什么事？」",
    "「我运水，也运消息。」他直截了当，「你要是想买消息，得先告诉我：你一个外乡人，为什么对沙漠的井、沙漠的水、沙漠的神殿，这么上心？」"
  ],
  options:[
    {t:"（坦诚：你在追查封印的线索）",check:{a:"CHA",sk:"persu",label:"坦诚"},tier:{
      ok:["你把黑沙区石路、七道杠铜牌、井底石板的事说了。白驼听完，沉默了一会儿，从怀里摸出一样东西——一枚旧铜牌，七道杠，边缘磨得发亮。","「你追的这条线，我追了二十年。」他把铜牌放在你手心，「第七道封印，在神殿底下。井水见底、夜车运水、盐湖发白——都是同一个源头：封印在松。」"],
      fail:["白驼听完，摇了摇头：「外乡人，追封印的人，我见过太多。活下来的没几个。」他把铜牌收回去，「你走吧，水价我算你便宜点，就当没听过这话。」"],
      crit:["你不仅说了，还拿出沙暴里捡到的那枚七杠铜牌给他看。白驼盯着铜牌，手顿了一下——他摘下自己那枚，两枚并排：纹路完全一致，连磨损的缺口都对得上。","「二十年了。」他声音有些哑，「我一直在等，等第二枚铜牌出现。」他抬头看你，「你愿意跟我走一趟北线吗？」"]
    },effects:{xp:30,infl:{desert:5},relation:{npc:"desert_baituo",delta:25,reason:"铜牌相认"}},go:"desert_caravan2"},
    {t:"（以行商身份，谈一笔运水的生意）",check:{a:"CHA",sk:"bargain",label:"论商"},tier:{
      ok:["你报出南边铁价粮价，又说了几处水源的行情。白驼听了一会儿，点了点头：「懂行。」他松口，「行，这笔生意可以谈。水，我有路子；路，得你走一趟。」","「我北线的驼队缺个押货的。」他说，「你肯押，水价我给你七折，外加一趟消息。」"],
      fail:["白驼不置可否：「生意是生意，交情是交情。你连货都拿不出来，谈什么运水。」他转身继续理货，不再接话。"],
      crit:["你不仅谈下生意，还从他话里听出弦外之音：「北线的水，最近不好运了——黑沙区那边，有人在『看路』。」他压着嗓门，「看路的人，蒙面，腰上挂七道杠的铜牌。跟你打听的事，是一个来路。」"]
    },effects:{xp:20,infl:{desert:3},relation:{npc:"desert_baituo",delta:15,reason:"生意相谈"}},go:"desert_caravan2"}
  ]
};
N["desert_caravan2"] = {
  tag:"branch",
  place:"死亡沙漠 · 北线商路", where:"白昼", pace:"deep",
  text:[
    "第二天清晨，你跟着白驼的驼队出发。八匹骆驼，六袋水，三车货，加上你，一行十一个人，沿着北线官道走。",
    "出了驿站，沙漠的景色单调得让人发困：沙丘、沙丘、还是沙丘。白驼走在队首，偶尔停下来看看沙面，像在读一本书。",
    "「骆驼认得路，但认不得『新路』。」他忽然开口，指着左侧一片沙地，「你看那里——车辙是新的，蒙布车，七道杠。夜车昨晚又过去了。」他顿了顿，「夜车的水，不走官道。它们从盐湖方向来，往绿洲集市去。」",
    "「盐湖的水，为什么要偷偷运？」你问。白驼沉默了片刻：「因为盐湖的水，是封印渗出来的。取那种水，等于在封印上开一道口子。」"
  ],
  options:[
    {t:"主动请缨，走在队尾押货",check:{a:"AGI",sk:"survive",label:"押货"},tier:{
      ok:["你走在队尾，盯着货物和水袋。中途一头骆驼踩进流沙，货担歪了——你一个箭步上去稳住驼鞍，重新绑好绳结。白驼回头看了一眼：「手稳。沙漠里，手稳的人值钱。」"],
      fail:["你押货的活儿干得手忙脚乱，一头骆驼的绳结松了，水袋差点滚下去。白驼过来重新绑好，没说什么，但脚步快了几分。"],
      crit:["你不仅稳住驼队，还在队尾发现一个细节：三车货里，有一车用油布裹得严严实实，车板上画着一道极淡的竖瞳。「白驼的车队里，也有竖瞳的货。」你把这个发现记在心里，没有声张。"]
    },effects:{xp:25,relation:{npc:"desert_baituo",delta:15,reason:"押货得力"}},go:"desert_caravan3"},
    {t:"问白驼：盐湖下面，到底压着什么",check:{a:"INT",sk:"lore",label:"追问"},tier:{
      ok:["白驼沉默了很久，说：「盐湖下面是第七道封印的『根』。封印不是一块石板，是七根柱子，一根压着一段深渊。」他指着南方的天际，「神殿里的，是封印的『心』；盐湖下的，是封印的『根』。」","「水从封印的根里渗出来，带着凉气，带着盐。」他说，「取那种水的人，不知道自己在动什么。」"],
      fail:["白驼摇摇头：「有些话，说了也没用。你不知道，反而活得久。」他拍了拍骆驼，不再接话。"],
      crit:["你追问到了关键：「那『夜车』取水，是想要封印松？」白驼没有直接回答，只说了一句：「取水的人，以为水是财。可他们不知道，每取一桶水，封印的根就薄一分。」","「薄到什么时候？」你问。他望着南方的天际：「薄到神殿里那颗星，亮得压不住的时候。」"]
    },effects:{xp:30,infl:{desert:5},flag:"desert_root_secret"},go:"desert_caravan3"}
  ]
};
N["desert_caravan3"] = {
  tag:"branch",
  place:"死亡沙漠 · 北线 · 风口", where:"白昼", pace:"deep",
  text:[
    "北线走到第三天，风突然变了方向。白驼勒住骆驼，抬头看天：「不对。这不是正常的季风。」",
    "他翻身下驼，蹲下抓了一把沙，搓了搓，又闻了闻：「沙是湿的。风从南边来，带着水汽——」他脸色变了，「盐湖方向，起风了。」",
    "话音刚落，南边的地平线上，一道灰白色的雾气正在升起。雾气里有东西在动——不是沙暴，是水汽裹着沙尘，像一条活着的蛇。",
    "「封印的根在喘气。」白驼声音发紧，「这口气要是吹到绿洲，那口井就真的没了。」他转向你，「驼队要掉头，我护货。你要是想追那条线索——」他指指雾气深处，「夜车的路，就在那边。」"
  ],
  options:[
    {t:"帮白驼护住驼队，先避过这阵风",check:{a:"STR",sk:"survive",label:"护队"},tier:{
      ok:["你指挥驼夫们把水袋卸下、骆驼围成圈、货物压上沙袋——一套动作行云流水。灰雾扑到的时候，驼队已经缩成一团，只损失了两袋水。","白驼拍了拍你的肩：「外乡人，你这一手，够在沙漠里吃一辈子饭了。」"],
      fail:["风来得太快，你被吹得睁不开眼，一头骆驼受惊脱缰，拖着货跑出去半里地。好在大家合力追了回来，只丢了一袋干粮。"],
      crit:["你不仅稳住驼队，还在风里看见一个东西：雾气深处，夜车的三辆车正在仓皇南撤，车夫蒙面，腰上挂着七道杠的铜牌——铜牌在雾里反着光。","「他们也在跑。」你盯着那个方向，「取水的人，知道风要来了。」"]
    },effects:{xp:30,infl:{desert:5},relation:{npc:"desert_baituo",delta:20,reason:"风口护队"}},go:"desert_caravan4"},
    {t:"循着夜车的痕迹，追进雾气",check:{a:"AGI",sk:"stealth",label:"追踪"},tier:{
      ok:["你脱离驼队，循着夜车的车辙追进雾气。雾里视线极差，你靠着沙面上的车辙和蹄印，跟了半个时辰，终于在雾气最浓处，看见夜车停在一道盐湖边。","车夫们正在往湖里下桶——桶是银色的，沉下去，拉上来，满满一桶发白的盐水。「封印的根。」你默念着，记住了他们取水的确切位置。"],
      fail:["雾太浓，你追丢了车辙，在盐湖边缘转了两圈，差点迷路。最后循着驼铃声摸回北线，白驼已经等了你半个时辰：「回来了就好。」"],
      crit:["你不仅摸到取水位置，还看见一个意想不到的东西：湖边有一截露出的石柱，柱身刻着盘绕的纹路——跟黑沙区石路上的封印纹一模一样。「第七道封印的根，就在这里。」你蹲下，拂开柱上的盐霜，看见柱脚有一个新凿的凹槽，像有人撬过。","「有人动过这根柱子。」你把凹槽的形状记在心里，决定回头告诉白驼。"]
    },effects:{xp:35,infl:{desert:5},flag:"desert_root_touched"},go:"desert_caravan4"}
  ]
};
N["desert_caravan4"] = {
  tag:"branch",
  place:"死亡沙漠 · 北线 · 盐湖边缘", where:"白昼", pace:"deep",
  text:[
    "风停之后，白驼带着驼队赶到了盐湖边缘。他蹲在湖边，看着那截露出的石柱，沉默了很久。",
    "「你看见的那个凹槽，是新的。」他抬起头，眼神里有什么东西沉了下去，「二十年了，我一直以为取水的人只是贪财。没想到——他们已经动了封印的根。」",
    "他从怀里摸出那枚七道杠铜牌，放在柱脚边，像放下一件旧物：「我追这条线追了二十年。追到现在，我明白了：我一个人，追不动了。」",
    "他站起来，看着你：「外乡人，你愿意替我追下去吗？」他从货车上取下一只银色的水壶，「这是我压箱底的东西——盐湖深层的水，封印根上渗出来的第一缕。带上它，你遇到神殿里的人，他们会认得这水。」"
  ],
  options:[
    {t:"（郑重接过银水壶，接下这条线）",check:{a:"CHA",sk:"persu",label:"承诺"},tier:{
      ok:["你接过银水壶，壶身冰凉，带着一股说不清的凉气。白驼看着你，点了点头：「好。」","「记住：封印的事，查得越深，越要沉住气。」他拍了拍你的肩，「查清楚了，回来告诉我。我白驼在南线，等你一句话。」","你握着银水壶，心里那根弦绷得更紧，也更深了。北线的风从盐湖上吹来，带着湿意，像封印在呼吸。"],
      fail:["白驼看着你犹豫的神色，把银水壶收了回去：「外乡人，追封印不是逛集市。你还没想好，就别接。」他转身去理货，「想好了，再来找我。」"],
      crit:["你不仅接过银水壶，还把风暴里看到的『夜车也在跑』、盐湖边新凿的凹槽一并告诉了他。白驼听完，沉默良久，忽然笑了：「……行。你比我想的，看得深。」","「这条线交给你，我放心。」他从货车上取下一卷旧地图，「北线二十年，我画的地图。沙漠里每一口井、每一条路、每一处封印的位置，都在这上面。带上它。」"]
    },effects:{xp:40,infl:{desert:8},relation:{npc:"desert_baituo",delta:25,reason:"接下封印线"},item:"银水壶",flag:"desert_baituo_line"},go:"desert_seal_watch"},
    {t:"（收下银水壶，先去神殿看看）",effects:{xp:30,relation:{npc:"desert_baituo",delta:15,reason:"接下封印线"},item:"银水壶",flag:"desert_baituo_line"},go:"arrive_desert_shendian"}
  ]
};
/* ---- BD-2 遗迹与封印观察 ---- */
N["arrive_desert_yiji"] = {
  tag:"main",
  place:"死亡沙漠 · 古代遗迹 · 入口", where:"白昼", pace:"normal",
  text:[
    "古代遗迹在黑沙区东缘的一处洼地里，半座石城从沙里露出来，像一具搁浅的巨兽骨架。城墙塌了大半，门洞却还立着，门楣上刻着一行字，被风沙磨得只剩轮廓。",
    "你俯身拂去门楣上的沙，勉强辨认出几个古老的字符——和黑沙区石路上的字一样：『第七封印。守望者立。勿启。』",
    "门洞内，是一道向下延伸的石阶，黑黢黢的，看不见底。风从下面吹上来，带着一股干冷的、像旧墓穴的气息。",
    "石阶旁的石壁上，刻着一幅壁画：一个披袍的人影，双手按地，地下的裂缝合拢——和你在西境风暴沟里看见的画面，几乎一模一样。"
  ],
  options:[
    {t:"点亮火把，沿石阶而下",go:"desert_ruins"},
    {t:"先在入口仔细勘察",check:{a:"INT",sk:"detect",label:"勘察"},tier:{
      ok:["你在入口处仔细勘察，发现石阶旁有一串脚印——不是你的，是新的，靴印很深，像是有人最近来过。脚印在石阶第三级处转弯，消失在壁画的阴影里。","你顺着脚印的方向看，发现壁画角落有一块石砖松动，像被人反复摸过。"],
      fail:["入口处风沙太大，你没发现什么特别的东西，只确定门楣上的字是封印警告。"],
      crit:["你发现壁画底部有一个凹槽——不仔细看根本注意不到，凹槽的形状，正好放得下一枚铜牌。「七道杠的铜牌。」你想起怀里那枚，试着比了比，尺寸吻合。你没有放进去，先把位置记死了。"]
    },effects:{xp:25,infl:{desert:3}},go:"desert_ruins"}
  ]
};
N["desert_ruins"] = {
  tag:"branch",
  place:"死亡沙漠 · 古代遗迹 · 大厅", where:"黑暗", pace:"deep",
  text:[
    "石阶尽头是一间空旷的大厅。火把的光照不到四壁，只能看见正中一块巨大的石板——石板表面光滑如镜，映着火光的影子，像一汪凝固的水。",
    "大厅的四壁刻满了壁画，一圈一圈，像一本摊开的书。你举着火把绕着看：最外圈是沙漠与商队，往里是战争与火焰，再往里——是七根柱子，柱间有锁链相连，锁链的尽头，压着一扇门。",
    "壁画的最后一幅，在门的位置：一个披袍的人影站在门前，手里捧着一只银色的壶，正在往门缝里倒水。水顺着门缝渗进去，门上的锁链，隐隐泛着光。",
    "你下意识摸了摸白驼给你的银水壶。壶身冰凉。壁画的顺序，像在说：水，是锁链的粮食。"
  ],
  options:[
    {t:"对照银水壶，细看壁画细节",check:{a:"INT",sk:"lore",label:"研读"},tier:{
      ok:["你举着银水壶凑近壁画，发现一个惊人细节：壁画里人影手中的壶，壶身上刻着的纹路，跟白驼给你的银水壶一模一样——连壶口的那道磕痕都对得上。","「白驼的壶，是照着壁画里的样子做的？」你愣在原地，「还是说——这壶，就是壁画里那把？」"],
      fail:["火把的光不够亮，壁画又太大，你只认出七根柱子和锁链的构图，细节看不真切。"],
      crit:["你不仅认出银水壶，还在壁画最角落发现一行小字，被后人用刀刻过——刻痕很新：「第七柱松。水已取。七日后，星亮。」","「七日后。」你算了算日子，脊背一阵发凉。那行字留下的时间，就在前几天。"]
    },effects:{xp:35,infl:{desert:5},flag:"desert_ruin_note"},go:"desert_seal_watch"},
    {t:"不深入，先退出去喘口气",go:"desert_leave"}
  ]
};
N["desert_seal_watch"] = {
  tag:"branch",
  place:"死亡沙漠 · 古代遗迹 · 封印节点", where:"黑暗", pace:"epic",
  text:[
    "大厅深处，有一道向下的裂缝，宽约一人。裂缝边缘的岩石呈黑色，像被烧过，隐隐泛着幽光。你站在裂缝边，能感觉到一股极轻的、像心跳一样的东西——从地底传上来。",
    "你蹲下，把火把探进裂缝：光落到约两丈深的地方，被一片黑暗吞没。但就在光与暗交界的地方，你看见一根石柱——柱身刻着盘绕的纹路，正是封印的第七柱。",
    "石柱的根部，有一圈新凿的凹槽，跟你盐湖边看见的一模一样。凹槽边缘的岩石很新，断口发白，像是最近几天才凿的。",
    "你摸出银水壶，壶身在这片黑暗里，竟隐隐亮了起来——像在回应什么。地底的心跳声，似乎重了一拍。"
  ],
  options:[
    {t:"仔细观察封印柱，记录松动迹象",check:{a:"INT",sk:"detect",label:"观察"},tier:{
      ok:["你借着火把光，把第七柱的每一处细节都记下来：柱身纹路完整，但根部凹槽已凿到第三道纹；柱脚有一片细密的裂纹，像干裂的河床；柱顶有一层白霜，像盐。","「封印在松。」你对照西境风暴沟的蓝光，心里有了一个模糊的图景：第七柱松一寸，盐湖的水就渗一分；盐湖的水被取走，封印的根就薄一分。","你把观察结果牢牢记下。这一趟，你没有动那根柱子——有些东西，看明白就够了。"],
      fail:["裂缝太深，火把的光够不到柱底。你只隐约看见一根刻着纹路的石柱，根部似乎有凹槽，但看不真切。"],
      crit:["你不仅看清封印柱，还发现柱底压着一片东西——一片衣角，灰白色，被柱石压着，像是有人趴在这里留下的。你拽了拽，衣角是新断的。","「有人来过这里，而且，就在最近。」你攥着那片衣角，心里那根线绷到了极限。"]
    },effects:{xp:40,infl:{desert:8},flag:"desert_seal_watched"},go:"desert_cultist"},
    {t:"（谨慎后退，不惊动封印）",check:{a:"AGI",sk:"stealth",label:"撤退"},tier:{
      ok:["你放轻脚步，一寸一寸退出大厅。地底的心跳声没有变化，你安全回到地面。","你回头看了一眼门洞里的黑暗，把银水壶揣好。有些东西，知道在哪里，比碰它更重要。"],
      fail:["你退得太急，踩落一块碎石。碎石滚进裂缝，半晌才传来一声闷响——裂缝比你想的深。地底的心跳声，似乎重了一拍。你不敢再停留，快步退出遗迹。"],
      crit:["你不仅全身而退，还在出口处发现一串新鲜的脚印——和入口处那串一样，往黑沙区深处去了。你循着脚印的方向看了一眼：那是深渊神殿的方向。","「去神殿的人。」你把脚印的细节记在心里，决定沿着这条线，去神殿看看。"]
    },effects:{xp:30,infl:{desert:5}},go:"arrive_desert_shendian"}
  ]
};
N["desert_cultist"] = {
  tag:"branch",
  place:"死亡沙漠 · 古代遗迹 · 暗廊", where:"黑暗", pace:"deep",
  text:[
    "你退出封印大厅时，听见暗廊里传来脚步声——不止一个，很轻，像踩在沙上。你闪身贴进墙角的阴影里，看见三个人影从暗廊另一头走来。",
    "他们都蒙着面，穿着灰褐色的袍子，腰上挂着七道杠的铜牌。领头的人走在最前，手里提着一盏铜灯，灯芯燃着一种发蓝的火。",
    "「第七柱，凿到第三道纹了。」领头的人压着嗓门说，「水已经取走三批。盐湖的根，松得比预想快。」",
    "「神殿那边呢？」后面的人问。「先知说，七日后，星亮之时，动最后一凿。」领头的人顿了顿，「到时候，这沙漠里的水，就都是我们的了。」",
    "三个人影消失在暗廊尽头。你在阴影里屏住呼吸，把那句话记进了骨头里：七日。星亮。最后一凿。"
  ],
  options:[
    {t:"（尾随三人，摸清他们的去向）",check:{a:"AGI",sk:"stealth",label:"尾随"},tier:{
      ok:["你借着阴影，一路尾随三人出了遗迹。他们往南走，穿过黑沙区，最终消失在深渊神殿的方向。","你确认了：取水的人、凿柱的人、都跟深渊神殿有关。那条线，从井台一路通到神殿。"],
      fail:["三人在暗廊拐角处忽然停住，你险些暴露。你缩回阴影里，等他们走远才敢出来——只确认了他们往南走，通向神殿方向。"],
      crit:["你不仅摸清去向，还看见领头人掀开面罩的一角——一张被风沙磨粗的脸，左眼角有一道旧疤。你把这个特征牢牢记住。以后在神殿里，你也许能认出他。"]
    },effects:{xp:30,infl:{desert:5},flag:"desert_cult_trace"},go:"desert_guardian"},
    {t:"（不跟了，先去见见守墓人）",go:"desert_guardian"}
  ]
};
N["desert_guardian"] = {
  tag:"branch",
  place:"死亡沙漠 · 古代遗迹 · 墓园", where:"黄昏", pace:"deep",
  text:[
    "遗迹外的沙丘下，有一片小小的墓园——几十块石碑，半埋在沙里，碑上没有名字，只刻着一只水罐。一个佝偻的老人正蹲在碑前，用一把铜壶往碑脚浇水，动作极慢，像在举行什么仪式。",
    "你走近时，老人头也不抬，声音却传了过来：「外乡人，你身上带着两样东西：一样是银水壶，一样是封印的气息。」他放下铜壶，直起身，看着你，「你是白驼派来的？」",
    "「白驼那小子，二十年前在我这儿讨过水。」老人说，「他追封印的线，追了二十年，如今把这条线交给你了。」他顿了顿，「我是这墓园的守墓人。这里埋的，都是追封印追到最后一刻的人。」",
    "他指了指最边上的一块新碑：「那底下埋的，是上个月的一个疯子水手。他说他来找『门』。他找到了。」"
  ],
  options:[
    {t:"问守墓人：『门』在哪里",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
      ok:["守墓人沉默了一会儿，指了指南边：「『门』就在神殿底下，第七封印的『心』。」他顿了顿，「但那扇门，不是给人进的。它是用来『压』的——压住门后面那个东西。」","「可有人不信。」他摇头，「总有人觉得，门后面是宝藏，是答案，是『以前的世界』。他们打开门，然后……」他没有说完，指了指那片墓园。","「你自己掂量。」他说完，蹲下继续浇水。"],
      fail:["守墓人摇摇头：「『门』的事，我说了你也未必信。你要真想知道，去神殿看。」他不再接话。"],
      crit:["你问出了一个关键细节：「二十年前那封竖瞳火漆的信，是送到神殿的？」守墓人手里的铜壶顿了顿：「……你也知道那封信。」他沉默了很久，「送信的人，就埋在这里。」他指着墓园中央那块最老的碑，「信送到了，人没走出来。」","「那封信，是『先知』的引路信。收到信的人，都会走进神殿，再也没出来。」他抬头看你，「你是第三个问起那封信的外乡人。」"]
    },effects:{xp:30,infl:{desert:5}},go:"desert_leave"},
    {t:"谢过守墓人，去深渊神殿看看",go:"arrive_desert_shendian"}
  ]
};
N["desert_leave"] = {
  tag:"branch",
  place:"死亡沙漠 · 边缘绿洲", where:"白昼", pace:"light",
  text:[
    "你回到边缘绿洲。那口浑浊的井还在，井边的骨片旗杆还在风里响。你蹲在井边，掬起一捧水，洗了把脸。",
    "水是凉的。你想起盐湖的银水壶、遗迹的第七柱、墓园的新碑。沙漠里的每一口井，底下都压着一条线。",
    "你站起身，望了望南方的天际。深渊神殿的方向，那颗暗红色的星，今晚似乎又亮了一点。",
    "你收拾行装，决定下一步的去向。"
  ],
  options:[
    {t:"前往深渊神殿，追查封印",run:function(){ travelTo("desert_shendian"); }},
    {t:"返回驼队驿站，把线索告诉白驼",run:function(){ travelTo("desert_tuoduo"); }},
    {t:"离开沙漠，回大陆腹地",run:function(){ travelTo("free_jiaohui"); }}
  ]
};

/* /u1inj:data-nodes:dn_east.js/ */
/* /bd4inj:east/ BD-4 东部承天城包（三大路线 · 线二 内容包 4 · 收尾包）
   承天城展开：东境官署 / 银穗商路危机（silver day120 联动）/ 晨天故都（回收 led_02/led_32）/
   秦·长风线（落第书生支线闭环）/ 边关传令兵
   silver 主线判定零改动；秦·长风为既有设定（east_smoke 线）。
   pace 全覆盖；治理词清零（V66 高频词表逐词核对）。 */
N["east_gov"] = {
  tag:"branch",
  place:"东部王国 · 承天城 · 东境官署", where:"白昼", pace:"normal",
  text:[
    "东境官署在承天城东街，朱门石狮，门前立着两排执戟的兵士。这里管着整个东境的税赋、兵籍与商路。",
    "你递上特科举子的名帖，被引到一间偏厅。厅里坐着一个穿青袍的吏目，正在核对一叠账册。他头也不抬：「什么事？」",
    "「银穗商路的事。」你说。他手里的笔顿了一下，这才抬起头：「银穗河的水路，是东境的命脉。北边一乱，商路就断。」他压着嗓门，「可断了商路的，不光是北边。」",
    "他翻出一页账册，推到你面前：「你看这个——上个月的商税，比上上月少了三成。粮价却涨了一倍。粮从哪来？不知道。税去哪了？也不知道。」"
  ],
  options:[
    {t:"（细看账册，追查税银去向）",check:{a:"INT",sk:"detect",label:"查账"},tier:{
      ok:["你逐页核对账册，发现一个破绽：官署的『漕运』条目下，有一笔数目惊人的『运费』，收款方是一个陌生的商号。","「『长风号』。」吏目看见你圈出的名字，脸色微变，「那是……秦将军家的商号。」"],
      fail:["账册条目繁多，你一时看不出端倪。吏目催你：「看完了？看完就请回吧，官署重地。」"],
      crit:["你不只发现长风号，还注意到账册夹页里有一张泛黄的便笺，字迹潦草：「银穗河改道，旧漕渠已废。水下的东西，比粮值钱。」","「水下的东西。」你默默记下这句话，与秦·长风将军的名字连在一起。"]
    },effects:{xp:30,infl:{east:5},flag:"east_ledger"},go:"east_silver"},
    {t:"（问他：秦·长风将军是什么人）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
      ok:["吏目压低声音：「秦将军……是东境守将，铁门关外的军功，一半是他挣的。」他顿了顿，「但他跟大皇子的关系，说不清。有人说他站大皇子，有人说他谁都不站。」","「他家的长风号，跑的是银穗河的漕运。」吏目说，「漕运这条线，油水厚，水深。」"],
      fail:["吏目立刻警觉：「秦将军的事，不是我这等小吏能议论的。请回吧。」"],
      crit:["吏目告诉你一个关键细节：「秦将军上月回京述职，带回来一船东西，说是『军需』。可那船的吃水线，深得不像军需。」他压着嗓门，「船在承天码头卸了一夜。第二天，钦天监的人去验过船仓。」"]
    },effects:{xp:25,infl:{east:3}},go:"east_silver"}
  ]
};
N["east_silver"] = {
  tag:"branch",
  place:"东部王国 · 银穗河 · 码头", where:"白昼", pace:"deep",
  text:[
    "银穗河在承天城外汇入平野，码头上樯桅如林。可今天的码头，安静得反常——货船少了一半，卸货的工人三三两两蹲在岸边，抽着旱烟。",
    "你拦住一个老船工：「河上怎么了？」他吐了口烟：「北边战事一起，银穗河的水路就断了三成。加上上个月，河上出了怪事——」他压着嗓门，「有两条船，夜里过青鲤滩，船底像被什么东西顶了一下，翻了。」",
    "「翻船的人说，船底蹭到的东西，是硬的，凉的，像石头。」老船工磕了磕烟杆，「可青鲤滩那一段，水浅得很，哪来的石头？」",
    "码头的管事正在岸边踱步，手里攥着一叠票据，嘴里念叨：「商路断、税银没、粮价涨……这买卖，没法做了。」"
  ],
  options:[
    {t:"（下水查看青鲤滩的『石头』）",check:{a:"CON",sk:"survive",label:"下水"},tier:{
      ok:["你雇了条小船，趁夜划到青鲤滩。水浅处，你潜下去，摸到一块坚硬的东西——不是石头，是打磨过的石面，边缘齐整，像某座建筑的顶。","「水下的建筑。」你浮上来，喘了口气。银穗河的河底，沉着一座建筑。"],
      fail:["青鲤滩的水比想象中冷。你潜了两回，什么也没摸到，只冻得嘴唇发紫。"],
      crit:["你不仅摸到石面，还在石缝里抠出一片东西——一枚锈蚀的铜牌，上面刻着半个字，依稀是『晨』。","「晨……」你心头一动。晨天城。东境的故都，据说就沉在银穗河的某一段河床下。"]
    },effects:{xp:30,infl:{east:5},flag:"east_river_secret"},go:"east_chengtian_old"},
    {t:"（沿河打听，摸清河底之物的传闻）",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
      ok:["码头的老人告诉你：「河底的东西，老辈人都知道——那是『旧城』的顶。」他指了指河心，「银穗河改道那年，淹了半座城。老辈人说，淹的是晨天故都。」","「故都说沉了就沉了。」老人摇摇头，「可这些年，河底的『顶』越来越浅了——水退下去不少。」"],
      fail:["码头上的人对河底的事讳莫如深。你只打听到银穗河改道时淹过一座旧城。"],
      crit:["你从老人口中套出关键信息：「河底那座旧城的『顶』，前些年还离水面两丈。这几年，一年比一年浅。」他压着嗓门，「有人说是水退了，也有人说是——『城在往上浮』。」"]
    },effects:{xp:25,infl:{east:3}},go:"east_chengtian_old"}
  ]
};
N["east_chengtian_old"] = {
  tag:"main",
  place:"东部王国 · 银穗河 · 晨天故都遗址", where:"白昼", pace:"deep",
  text:[
    "银穗河在青鲤滩拐了个弯，露出大片浅滩。枯水季节，河床上浮出一座城的轮廓——墙基、石阶、半截沉在水里的牌坊，都蒙着一层青灰的河泥。",
    "你站在河滩上，望着那座沉默的故都。牌坊上的字被水磨得模糊，你凑近了，才辨认出两个字：「晨天。」",
    "「晨天城。」你默念着这个地名。东境的故都，帝京文脉的源头。据说百年前银穗河改道，一夜之间，这座城沉入水底。城里的人，只逃出来三成。",
    "一个赶羊的老人路过河滩，看见你，喊了一声：「后生，别往河心里走！故都的地基是空的，踩塌了，神仙都捞不上你！」",
    "你站在河滩边，望着那座半沉半浮的故都。水退下去的地方，露出城门口的一角——黑洞洞的，像一只睁着的眼睛。"
  ],
  options:[
    {t:"（沿故都城门口，进去看看）",check:{a:"AGI",sk:"survive",label:"探城"},tier:{
      ok:["你踩着露出的石阶，摸进故都的城门洞。城内的街道被淤泥填了大半，墙塌屋倒，只有几座石质建筑还立着——官署、学宫、还有一座钟楼。","你在学宫的残墙上，看见刻着的字：「晨天学宫，立学百年。文脉所系，帝京之源。」","「晨天……帝京的文脉源头。」你默默记下。这里，就是账本上说的『东境中枢』。"],
      fail:["故都的地基确实不稳。你刚踩上城门洞的石阶，脚下的石板就裂了一道缝。你连忙退回河滩，只远远看了几眼。"],
      crit:["你不仅进到故都内部，还在官署残址的案台下，挖出一只密封的陶罐。罐里是一叠防水油布裹着的文书——银穗河改道那年的官署档案。","你展开最上面一份：「……河水异动，晨天城地基下陷。城中老幼已迁，钟楼不可弃。楼内封存之物，当世世相传，待『持牌人』来取。」"]
    },effects:{xp:35,infl:{east:8},flag:"east_chengtian_visited"},go:"east_chengtian_ruins"},
    {t:"（不进城，先在故都外围仔细勘察）",check:{a:"INT",sk:"detect",label:"勘察"},tier:{
      ok:["你在故都外围绕了一圈，发现河滩上散落着不少旧物：碎瓷、铜钱、半截石碑。石碑上刻着故都的旧志：「晨天城，东境之枢。商通七地，文开一脉。」","「东境之枢。」你把这些细节记下。这座沉没的故都，正是东境的地脉中枢。"],
      fail:["河滩上的旧物大多风化严重，你只捡到几枚锈蚀的铜钱。"],
      crit:["你不仅勘察了外围，还在故都北门外的河滩上，发现一块新翻的泥土——有人最近在这里挖过什么。泥土里夹着一小片灰白色的布丝，和圣城圣物司天窗上卡住的那片，一模一样。","「圣痕司的人，来过这里。」你攥紧布丝，脊背一阵发凉。"]
    },effects:{xp:30,infl:{east:5},flag:"east_chengtian_probe"},go:"east_chengtian_ruins"}
  ]
};
N["east_chengtian_ruins"] = {
  tag:"branch",
  place:"东部王国 · 晨天故都 · 钟楼遗址", where:"黄昏", pace:"deep",
  text:[
    "故都的钟楼立在城中央，是整座废墟里最完整的一座建筑。铜钟还在，悬在残破的楼架上，蒙着厚厚的河泥。",
    "你爬上钟楼。从高处望下去，故都的街道格局依稀可辨：官署居中，学宫在东，市井在西，城墙环抱——标准的帝京布局。",
    "「东境的帝京文脉，从这里起源。」你想起承天城的朱墙，两座城隔着百年的时光，隔着一条改道的河，却是一样的格局。",
    "你伸手拂去铜钟上的河泥。钟身上刻着字：「晨天钟鸣，文脉不绝。」铜钟的年代，比承天城的城墙还要久远。"
  ],
  options:[
    {t:"（敲响铜钟，听故都的回声）",check:{a:"SPR",sk:"will",label:"敲钟"},tier:{
      ok:["你握住钟槌，敲了一下。铜钟发出一声低沉的嗡鸣，在废墟间回荡。钟声落处，几只水鸟从河滩上惊起，飞过暮色的天空。","「晨天钟鸣，文脉不绝。」你默念着钟身上的字。这座沉没百年的故都，还在守着它的文脉。"],
      fail:["铜钟蒙着河泥，声音发闷，像一声叹息。你没有再敲。"],
      crit:["你敲响铜钟时，钟楼的地板下传来一阵异响——像有什么东西在回应。你蹲下，撬开一块松动的木板，露出一个暗格。","暗格里放着一只木匣，匣盖刻着一枚纹章：七道杠。「又是七道杠。」你打开木匣——里面是一卷泛黄的丝帛，写着一篇祭文：「……晨天故都，沉于庚申之年。帝京文脉，由此而东。持牌人若至，当知此城之沉，非天灾，乃人祸。」"]
    },effects:{xp:35,infl:{east:8},flag:"east_chengtian_secret"},go:"east_exam"},
    {t:"（不敲钟，记住这座故都）",check:{a:"INT",sk:"lore",label:"铭记"},tier:{
      ok:["你在钟楼里站了很久，把故都的格局、钟上的铭文、河滩的旧物，一一记在心里。","「晨天城。」你默念着这个地名。它不是一座死城。它是一座被河水埋着、仍在呼吸的旧都。"],
      fail:["黄昏的光很快暗下来。你只记住钟楼的轮廓，就下了楼。"],
      crit:["你不仅记住故都，还在钟楼二层的墙缝里，发现一枚旧铜钱——正面铸着『晨天通宝』，背面铸着『改道之年』。「改道之年的铸币。」你掂了掂这枚铜钱。银穗河改道那年，晨天城在沉没前，还在铸钱。"]
    },effects:{xp:25,infl:{east:5}},go:"east_exam"}
  ]
};
N["east_exam"] = {
  tag:"branch",
  place:"东部王国 · 承天城 · 特科考场", where:"白昼", pace:"deep",
  text:[
    "特科科举的术试在贡院西院举行。你赶到时，台上正有一个考生当众施法——火光在他掌心跳跃，钦天监的官员们端坐评分。",
    "你混在人群里看了一会儿。台上的考生一个个上去，一个个下来。有人得意，有人黯然。",
    "忽然，人群一阵骚动。一个灰袍的考生走上台，没有施法，只是从怀里摸出一枚铜牌，放在案上。钦天监的新监正看见那枚铜牌，手里的笔顿住了。",
    "他站起身，走到案前，拿起铜牌仔细端详，又抬眼打量那个考生：「这牌子，你从哪来的？」",
    "灰袍考生笑了笑：「故都河里捡的。」",
    "监正沉默片刻，忽然宣布：「此考生，术试免试，直接入『待选』。」"
  ],
  options:[
    {t:"（留意那个灰袍考生，散场后跟上）",check:{a:"AGI",sk:"stealth",label:"尾随"},tier:{
      ok:["散场后，你跟上灰袍考生。他在贡院后巷停下，回头：「跟了一路了，出来吧。」你现身。他打量你：「你也有铜牌？」他问。","「你也去过故都？」他笑了笑，「晨天故都，知道的人不多。你我是同路人。」"],
      fail:["灰袍考生走得很快，你在人群里跟丢了。只记得他腰间铜牌的形状——七道杠。"],
      crit:["你不仅跟上他，还看清了他铜牌上的纹路——七道杠，边缘磨损，和你怀里那枚几乎一样。「你这牌子，是『骨』部的吧？」灰袍考生眼神微动，「……看来你知道的，比我想的多。」"]
    },effects:{xp:30,infl:{east:5},flag:"east_gray_exam"},go:"east_scholar1"},
    {t:"（不追。去贡院侧廊，找落第的书生）",go:"east_scholar1"}
  ]
};
/* ---- BD-4 支线：落第书生（晨天文脉守护 · 好感闭环） ---- */
N["east_scholar1"] = {
  tag:"branch",
  place:"东部王国 · 承天城 · 贡院侧廊", where:"黄昏", pace:"normal",
  text:[
    "贡院侧廊的墙根下，蹲着一个年轻书生，面前摊着一卷写了一半的文章，墨迹被泪水洇开。他听见脚步声，连忙用袖子擦了擦眼角，抬起头——是个清瘦的年轻人，眉宇间有股不服气的劲。",
    "「你是考官？」他问。「不是。」你说。「那你是来看笑话的？」他苦笑一声，「策论写得再好有什么用，术试不过，一样落榜。」",
    "他站起来，把文章卷了卷塞进怀里：「我叫沈砚，晨天旧族的后人。」他顿了顿，「我家祖上，是从故都逃出来的。」",
    "「故都。」你心头一动。「银穗河底下那座？」「就是那座。」沈砚说，「祖上说，故都没了，但晨天的文脉不能断。我考特科，就是想用『文』重新立起来。」"
  ],
  options:[
    {t:"（听他讲晨天旧族的故事）",check:{a:"CHA",sk:"persu",label:"倾听"},tier:{
      ok:["沈砚讲了一下午：晨天旧族，百年前从故都逃到承天城，靠着祖传的书稿与学问，在帝京立了脚。可这些年，族里衰败了，书稿也散了大半。","「我手里只剩一卷祖传的《晨天志》，是故都的旧志。」他压低声音，「我考特科，一半为功名，一半为——让这卷书，有个传承。」"],
      fail:["沈砚讲了几句，自嘲地笑了笑：「跟你说这些干什么。落第书生，谁听呢。」他不肯再说了。"],
      crit:["你不仅听他讲完，还提到故都钟楼上的铭文「晨天钟鸣，文脉不绝」。沈砚的眼睛一亮：「你知道钟楼？那铭文，是我们晨天旧族的祖训！」他激动得声音发抖，「你……你去过故都？」"]
    },effects:{xp:25,infl:{east:3},relation:{npc:"east_shenyan",delta:20,reason:"侧廊倾听"}},go:"east_scholar2"},
    {t:"（问他：落第之后打算怎么办）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
      ok:["沈砚沉默了一会儿：「族里指着我光宗耀祖。落第的消息传回去，大概又是一顿冷眼。」他攥紧怀里的文章，「可我总得做点什么。故都沉了，晨天的文脉不能断在我这一代。」"],
      fail:["沈砚摇摇头：「走一步看一步吧。落第书生，还能怎么办。」"],
      crit:["沈砚告诉你一个计划：「我想去故都一趟。祖上留下的《晨天志》里记载，故都官署的地基下，埋着一座『藏书阁』——晨天学宫的藏书，都在那里。」他压着嗓门，「我想把它们挖出来，誊抄成册。」"]
    },effects:{xp:20,infl:{east:3},relation:{npc:"east_shenyan",delta:15,reason:"落第相询"}},go:"east_scholar2"}
  ]
};
N["east_scholar2"] = {
  tag:"branch",
  place:"东部王国 · 银穗河 · 晨天故都", where:"白昼", pace:"deep",
  text:[
    "几天后，你在故都河滩遇见了沈砚。他挽着裤腿，正蹲在河滩上，对着一块露出的石面描摹。看见你，他直起身：「你也来了。」",
    "「《晨天志》上说，故都官署的地基下，是晨天学宫的藏书阁。」他指着河心，「学宫在官署东侧。按旧志的布局，藏书阁应该就在那片水下面。」",
    "「我水性不好。」他苦笑，「祖上是读书人，我连狗刨都不会。可这卷书，是我唯一能做的事了。」",
    "他望着河心那片沉在水里的故都，眼神里有一种固执的光：「故都沉了一百年。可我总觉得，它还在等着谁来开那座藏书阁的门。」"
  ],
  options:[
    {t:"（帮他下水，找藏书阁的入口）",check:{a:"CON",sk:"survive",label:"下水"},tier:{
      ok:["你按《晨天志》的布局，在官署遗址东侧的水下摸索，终于摸到一道石门——门楣上刻着「藏书阁」三个字。","你浮上来，告诉沈砚位置。他激动得手都在抖：「找到了……真的找到了……」","「门上刻着字：『文脉所系，持书者开。』」你说。沈砚怔了怔，从怀里摸出一枚旧印章——晨天旧族的藏书印。","「持书者。」他喃喃，「我家的印章，就是钥匙。」"],
      fail:["水下光线太暗，你摸索了一个时辰，只摸到淤泥与碎石。沈砚安慰你：「不急。故都沉了一百年，不差这一天。」"],
      crit:["你不仅找到藏书阁石门，还在门缝里发现一枚卡住的铜牌——七道杠。「有人来过这里。」你拿起铜牌，「而且，他知道这道门。」沈砚脸色一变：「这牌子……祖上说过，是『持牌人』的信物。」"]
    },effects:{xp:35,infl:{east:5},relation:{npc:"east_shenyan",delta:25,reason:"共探藏书阁"}},go:"east_scholar3"},
    {t:"（提醒他小心，别打草惊蛇）",check:{a:"INT",sk:"detect",label:"提醒"},tier:{
      ok:["你劝沈砚先别急着开藏书阁：「你刚才说，河滩上有人挖过土。故都的事，可能已经有人盯上了。」沈砚冷静下来，点了点头：「你说得对。藏书阁的门，不能轻开。」","「我先回去查查《晨天志》的记载。」他说，「等摸清了门里的机关，再作打算。」"],
      fail:["沈砚坚持要先下水看看：「我祖上的藏书阁，等了一百年了。」你劝不住，只得陪他再探了一次。"],
      crit:["你不仅提醒他，还在河滩上找到一串新鲜的脚印——靴印，来自承天城的方向。「有人来过。」你顺着脚印的方向看，「而且，是这两天的事。」沈砚的脸色凝重起来：「会是谁……也在找故都的藏书阁？」"]
    },effects:{xp:25,infl:{east:3},relation:{npc:"east_shenyan",delta:15,reason:"谨慎提醒"}},go:"east_scholar3"}
  ]
};
N["east_scholar3"] = {
  tag:"branch",
  place:"东部王国 · 晨天故都 · 藏书阁", where:"白昼", pace:"deep",
  text:[
    "藏书阁的门在枯水期露了出来。沈砚用祖传的藏书印按在门上的凹槽里，石门发出一声沉闷的响动，缓缓裂开一道缝。",
    "门后是一条向下的石阶，干燥得出奇——百年的水，竟没有渗进这座藏书阁。",
    "你举着火把走下去。石阶尽头，是一间巨大的石室，四壁的架子上，摆着一排排经防水处理的竹简与书卷。晨天学宫的藏书，都在这里。",
    "沈砚站在石室中央，仰头看着满室的藏书，声音有些哽咽：「……这就是晨天文脉的根。」",
    "他转过身，郑重地对你行了一礼：「这一路，多亏有你。这些书，我不会让它再沉进水里。」"
  ],
  options:[
    {t:"（帮他把藏书分批运出去）",check:{a:"STR",sk:"survive",label:"搬运"},tier:{
      ok:["你和沈砚花了两天，用油布把藏书分批运出故都，藏到沈家在承天城的旧宅地窖里。","「这些书，誊抄成册，就能让晨天的文脉重续。」沈砚站在地窖口，眼里有光，「等书抄完，我要重开晨天学宫——哪怕只是城西一间小书院。」"],
      fail:["故都的水路比想象中难走。你们只运出两箱书，沈砚便累得直不起腰。他摆摆手：「不急。书在，阁在，文脉就在。」"],
      crit:["你不仅运出藏书，还在藏书阁最深处发现一册特殊的书——封皮上没写字，翻开第一页，只有一行字：「持牌人若至，当知晨天城之沉，非天灾，乃人祸。」","和钟楼暗格里那卷祭文，一字不差。你把这句话记在心里。晨天城的沉没，藏着更大的秘密。"]
    },effects:{xp:40,infl:{east:8},relation:{npc:"east_shenyan",delta:25,reason:"共护文脉"}},go:"east_scholar4"},
    {t:"（让他自己处理，你不插手）",check:{a:"CHA",sk:"persu",label:"托付"},tier:{
      ok:["沈砚郑重地点头：「藏书阁的事，我来办。你放心。」他顿了顿，「等晨天学宫重开那天，我要在门口立一块碑，刻上你的名字。」","你笑了笑，没有推辞。这座沉没百年的故都，终于有人来续它的文脉了。"],
      fail:["沈砚看着满室藏书，有些无措：「这么多书……我一个人，怎么搬得完。」你最终还是帮了他一把。"],
      crit:["你放手让他自己处理，只叮嘱了一句：「故都的事，别声张。河滩上有人盯着。」沈砚记下你的提醒，压着嗓门：「我知道。书阁的门，我会封好，等风头过去再取。」"]
    },effects:{xp:30,infl:{east:5},relation:{npc:"east_shenyan",delta:20,reason:"托付文脉"}},go:"east_scholar4"}
  ]
};
N["east_scholar4"] = {
  tag:"branch",
  place:"东部王国 · 承天城 · 城西旧宅", where:"夜", pace:"light",
  text:[
    "几天后的夜里，沈砚在城西旧宅的地窖里点起油灯，把第一卷誊抄好的《晨天志》摆在你面前。",
    "「这是故都的旧志，我连夜抄的。」他翻开书页，字迹工整，「祖上说，晨天文脉，重在『传』。」他看着你，「你是第一个，让我觉得文脉能传下去的人。」",
    "他从怀里摸出一方旧砚，递给你：「这是我家祖传的砚台，晨天学宫的东西。我没什么能谢你的——这方砚，替我送给你。」",
    "你接过砚台。砚底刻着一行小字：「晨天文脉，代代相传。持书者，亦是持火者。」"
  ],
  options:[
    {t:"（郑重收下砚台，与他道别）",check:{a:"CHA",sk:"persu",label:"道别"},tier:{
      ok:["你收下砚台，向沈砚点了点头：「文脉不断。等你的书院开张，我来讨杯茶。」沈砚笑了：「一言为定。」","你走出旧宅，回头看了一眼。地窖的灯火透过窗缝，映出一张伏案抄书的背影。晨天文脉，又续上了一盏灯。"],
      fail:["沈砚把砚台塞进你手里：「拿着。别推辞。」你收下，与他道别时，他低声道：「保重。故都的事，我记下了。」"],
      crit:["道别时，沈砚忽然叫住你：「还有一件事。」他从怀里摸出一卷旧丝帛，「这是《晨天志》里夹着的——银穗河改道那年的河工档案。」","「档案上写着：改道，非天时，乃『人为』。」他压着嗓门，「有人，是故意让银穗河改道，淹了晨天城的。」"]
    },effects:{xp:40,infl:{east:8},relation:{npc:"east_shenyan",delta:25,reason:"砚台之约"},item:"晨天旧砚"},go:"east_after2"}
  ]
};
N["east_after2"] = {
  tag:"branch",
  place:"东部王国 · 承天城 · 城门", where:"白昼", pace:"light",
  text:[
    "你站在承天城的城门口，回望这座帝京。朱墙、飞檐、特科考场的烟火、银穗河的船影、河底那座沉没的故都——都在你身后。",
    "你摸了摸怀里的东西：晨天旧砚、故都的铜钱、那卷祭文的抄录。东境的这条线，从帝京文脉一路通到河底故都。",
    "你决定，沿着这条线，继续走下去。"
  ],
  options:[
    {t:"前往铁门关，追查银穗商路",run:function(){ travelTo("east_tiemen"); }},
    {t:"前往圣城，找艾德蒙",run:function(){ travelTo("church_shengcheng"); }},
    {t:"返回自由城邦休整",run:function(){ travelTo("free_jiaohui"); }}
  ]
};

/* /u1inj:data-nodes:dn_elf_dwarf.js/ */
/* /pe2inj:elf-dwarf/ PE-2 种族之地扩展包（精灵王国日常层 + 矮人王国补强）
   全对象式纯数据节点；世界观约束：精灵女王/长老会/世界树封印线沿用既有设定（elf_court/elf_root），
   本包写日常探索层，不碰主线核心；矮人沿用至高王/大锻造师/老矿道声音设定 */
N["elf_deep_market"] = {
  place:"精灵王国 · 王庭 · 银叶集市", where:"白昼",
  text:[
    "精灵集市藏在世界树西侧的一片树冠下。没有叫卖声，只有树叶的响动和偶而一两声清脆的风铃。货物摆在铺开的银叶上：干果、草织、琉璃小瓶、刻着符文的木片。",
    "一个戴银环的精灵摊主看你走近，没有招呼，只是把面前一只木碗往前推了推。碗里盛着几颗淡蓝色的浆果。",
    "「外来者。」他终于开口，声音不冷不热，「世界树的果子，不收钱——只收故事。讲一个值得听的，果子归你。」",
    "旁边的摊主插了一句：「别理他。他就是想听外面的消息。」"
  ],pace:"normal",
  options:[
    {t:"讲一个你在铁门关的故事，换浆果",check:{a:"CHA",sk:"交涉",label:"讲古"},tier:{
      ok:["你讲了铁门关外那场夜战——风声、断刃、被雪埋住的马蹄印。戴银环的精灵听完，沉默半晌，把木碗推到你面前：「值。」他补了一句，「铁门关的风，三百年前吹到过我们这里。现在它又响了。」"],
      fail:["你讲了个干巴巴的赶路见闻。精灵摊主把木碗收了回去：「这个故事，三片落叶就能换。」"],
      crit:["你讲到一半，周围几个摊主都停下了手里的活。你讲完铁门关的夜，又讲了自由城邦下水道里的黑烟和竖瞳。集市安静了一会儿。戴银环的精灵把浆果碗推过来，又加了一小瓶银色的液体：「世界树的露水，治外伤。」他压轻声音，「你查的东西，王庭里有人也在查——去找议会，找一个叫『青叶』的长老。」"]
    },effects:{gold:5,xp:20,item:"世界树浆果",flag:"elf_leaf_tip"},go:"elf_deep_council"},
    {t:"用钱买，不占便宜",effects:{gold:-10},tier:{ok:["你把几枚银月放在碗边。戴银环的精灵看了半天，最终把银月推回来：「世界树的集市，不收人类的钱。」他顿了顿，「……但你可以欠我一个人情。改天，把你查到的真相，讲给我听。」"]},go:"elf_deep_grove"},
    {t:"（不买东西，打听世界树的传闻）",check:{a:"INT",sk:"侦察",label:"探听"},tier:{
      ok:["你蹲在集市边缘听了一会儿。精灵们说话轻，但消息不少：「北边的雾，这三天又浓了一截。」「长老会已经开了两次会。」「有人看见，王庭的地窖里，搬进去了几筐新土——不知道做什么用。」"],
      fail:["精灵们聊着家常，你听不出门道。倒是有一句飘进耳朵：「今年的银月祭，怕是要提前。」"],
      crit:["你把零碎的消息拼起来：雾在变浓、长老会连着开会、王庭地窖进了新土——而你想起树根下那些黑色裂纹。三件事放在一起，像三根手指，慢慢收拢成拳。「世界树在疼。」一个老精灵的声音忽然从背后响起——他不知什么时候站到了你身后，又转身走了。"]
    },effects:{xp:20,flag:"elf_rumor"},go:"elf_deep_altar"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 60, "yes": ["银叶集市上，有精灵认出你是林歌的朋友。摆摊的老精灵朝你颔首，把一包干果推到摊沿——在精灵的规矩里，不收林歌朋友的钱。"]}};
N["elf_deep_altar"] = {
  place:"精灵王国 · 银月祭坛", where:"夜",
  text:[
    "银月祭坛建在世界树东侧一片开阔的高台上。没有殿宇，只有一圈十二根银白的石柱，围着中央一方月池。",
    "入夜后，月光从树冠的缝隙漏下来，落在池面上，碎成一片流动的银。两个精灵祭司跪在池边，低声念着祷词。",
    "你走近时，年长的那个祭司睁开眼，目光平静地落向你：",
    "「外来者。银月祭坛不拒生客——但祭坛之下的事，生客最好别问。」",
    "她身旁的见习祭司——一个面容稚嫩的精灵少女——偷偷看了你一眼，又飞快低下头。"
  ],pace:"normal",
  options:[
    {t:"询问银月祭坛的来历",check:{a:"INT",sk:"lore",label:"请教"},tier:{
      ok:["年长祭司徐徐开口：「银月是精灵的祖光。十二柱，象征十二支古老的部族。月池映照的是世界树的影子——树安稳，水就平；树疼了，水就会皱。」她看着池面，「这三个月，水皱得越来越勤。」"],
      fail:["祭司摇摇头：「祭坛的事，不是给外人听的。」她重新闭上眼。"],
      crit:["年长祭司沉默良久，忽然说了句超出她身份的话：「你身上，带着铁门关的黑烟味，和树根下同一种『渗』。」她看着你，「三百年前，我曾在封印前值守。那个味道，我认得。」她不再多说，只留下一个名字：「青叶。」"]
    },effects:{xp:25,flag:"elf_altar_name"},go:"elf_deep_council"},
    {t:"与见习祭司攀谈",check:{a:"CHA",sk:"说服",label:"攀谈"},tier:{
      ok:["见习祭司先是紧张，后来话渐渐多了：「我叫林歌。我……我负责每天给月池换水。」她压低声音，「水是真的皱了。长老们说是月光不好——可月光好好的呀。」她抬起头，眼睛里有种认真的困惑。"],
      fail:["见习祭司红着脸摇头，怎么也不肯多说话。年长祭司看了你们一眼，她更紧张了。"],
      crit:["你问起她有没有见过『青叶』长老。她的眼睛忽然亮了：「青叶长老！他是我师父的师父……他十年前就不管王庭的事了，住在迷雾边界的旧塔里。」她顿了顿，声音更轻，「但他上个月回来过一趟，跟女王关着门说了很久的话。出来的时候，他手里攥着一片发黑的树叶。」"]
    },effects:{xp:15,flag:"elf_linge_tip"},go:"elf_deep_mist"},
    {t:"（入夜后，单独来找见习祭司林歌）",go:"elf_w_enter"},
    {t:"（在祭坛边静立片刻，感受银月之力）",check:{a:"SPR",sk:"冥想",label:"静心"},tier:{
      ok:["你在月池边站定，闭上眼。银色的光透过眼皮渗进来，凉丝丝的。恍惚间，你听见池水轻轻响了一声——像有什么东西，在水下翻了个身。"],
      fail:["你站了一会儿，只觉得夜风凉。月池平静如镜。"],
      crit:["你静立良久，忽然看见月池水面泛起一圈极细的涟漪——没有风，没有虫。涟漪从池心散开，又缓缓收拢，像呼吸。你睁开眼，池面已恢复平静。但你知道，这池水，是活的。"]
    },effects:{xp:20,flag:"elf_pool_live"},go:"elf_deep_market"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 60, "yes": ["月光下的祭坛边，林歌已经在等你了。她听见脚步声，回头笑了笑：「我就知道你会来。」夜风把这句话送得很轻，月池的水面晃了晃。"]}};
N["elf_deep_council"] = {
  place:"精灵王国 · 王庭 · 长老议会厅", where:"白昼",
  text:[
    "长老议会厅是王庭深处一间圆形石室，屋顶开着圆孔，一束光垂直落下，照在中央的环形石桌上。",
    "七个席位，坐了五位长老。你走进来时，他们的交谈声像被风吹断的琴弦，齐齐一静。",
    "坐在东首的是一位青袍精灵——他的袍角磨得发白，袖口沾着一点泥土。他看了你一眼，目光温和得不像议会里的人：",
    "「外来者。议会不常接待生客。你能走到这里——是有人指点你来的？」",
    "他指尖轻轻敲着石桌。桌上，摊着一片发黑的树叶。"
  ],pace:"normal",
  options:[
    {t:"说是『青叶』长老指点，并出示你查到的线索",check:{a:"CHA",sk:"说服",label:"陈词"},tier:{
      ok:["青袍精灵——青叶长老——看着你，慢慢笑了：「我指点你来，是想看看，外面的人对这件事，知道多少。」他示意你坐：「说说看。你查到什么，就说什么。议会今天，只听真话。」"],
      fail:["青叶长老摇摇头：「凭一个名字就进议会，外来者，你太天真了。」但他还是示意你坐下，「不过你能说出这个名字——坐下听听也好。」"],
      crit:["你不仅报了名字，还说了树根下的裂纹、乌黑铁牌、自由城邦的竖瞳。议会厅静了半晌。青叶长老缓缓开口：「三百年了。封印的七枚『锚』，已经被人拔走四枚。第五枚——」他摊开手，掌心里躺着一枚乌黑的铁牌，「昨晚，从迷雾边界的地里，自己冒了出来。」","他盯着你：「你知道这意味着什么吗？『锚』会自己出土——说明封印的另一头，已经开始使劲了。」"]
    },effects:{xp:30,flag:"elf_council_secret"},go:"elf_deep_altar"},
    {t:"先听长老们说什么，不急着开口",check:{a:"INT",sk:"侦察",label:"旁听"},tier:{
      ok:["五位长老的争执渐渐清晰：北边长老主张增派人手守住迷雾边界；西边长老主张提前召开银月祭；南边长老主张派使节去人类联盟求援。「树根在渗，光封没有用。」青叶长老的声音不大，却让所有人安静下来，「得找到『锚』的来路。」"],
      fail:["长老们用精灵语交谈，你只听懂了零星几句。但他们的表情说明了一切：忧色比王庭外的雾还浓。"],
      crit:["你听出了弦外之音：长老们对『封印』的担忧，比对『世界树』本身更多。青叶长老有一句话你没听漏——「第五枚锚出土的位置，正是三百年前，精灵与人类第一次并肩的地方。」"]
    },effects:{xp:20,flag:"elf_anchor_info"},go:"elf_deep_market"},
    {t:"（不打扰议会，退出石室）",go:"elf_deep_grove"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 80, "yes": ["你走进议会厅时，五位长老的视线在你身上停了一瞬——你帮林歌查树根的事，青叶长老已经提过了。首席长老抬手示意：「坐。精灵记得每一份善意。」"]}};
N["elf_deep_mist"] = {
  place:"精灵王国 · 迷雾边界", where:"晨",
  text:[
    "迷雾边界是精灵王国东北角一条肉眼看不见的界线——那边，灰白色的雾凝成一道缓动的墙，树影在雾里若隐若现。",
    "雾墙边缘，立着一座半塌的旧塔。塔门虚掩，门楣上刻着一枚银月，月面已经风化得模糊了。",
    "你在塔前站定，听见塔里传来缓慢的、磨东西的声音。",
    "一个声音从门内飘出来：「要么进来，要么走。在雾边站久了，雾会记住你。」"
  ],pace:"normal",
  options:[
    {t:"推开塔门，见塔中人",check:{a:"INT",sk:"lore",label:"拜访"},tier:{
      ok:["塔里坐着一个独臂的老精灵，正用左手慢慢磨一块石头。他没有抬头：「青叶那小子，跟你说过这里？」他顿了顿，「还是说，你自己找到的？」","他把磨好的石头搁在窗台——那是一枚月牙形的白石。「雾墙这三个月，往外扩了三里。我每天磨一块石头，往雾里扔一块。不是驱雾——是给雾里的东西，留个记号。」"],
      fail:["塔中人没有应声。磨石头的声音停了半晌，又继续响起来——像是默认你可以留下，但不想说话。"],
      crit:["你提到树根下的黑色裂纹。磨石声彻底停了。独臂老精灵缓缓抬起头：「你看见了那些『纹』。」他沉默良久，「三百年前，我在封印前值守。封印下的东西，我比谁都清楚。」他指着雾墙，「雾不是雾。是封印漏出来的『气』。树根渗到哪，雾就漫到哪——它们是同一件事的两张脸。」"]
    },effects:{xp:30,flag:"elf_tower_old"},go:"elf_deep_council"},
    {t:"在雾墙边缘查看异状",check:{a:"AGI",sk:"侦察",label:"勘察"},tier:{
      ok:["你在雾墙边蹲了半晌，发现一个细节：雾不是均匀地漫，而是每隔一段距离，就有一道『雾柱』——像喷泉一样，从地底涌出来。你数了数，一共七道，排成一条弧线——像是围着一个看不见的中心。"],
      fail:["雾太浓，你什么也看不清。只感觉皮肤上凉丝丝的，像被什么东西隔着雾舔了一下。"],
      crit:["你顺着七道雾柱走了一圈，在地图心里画出一个圆——圆心处，土是焦黑的，寸草不生，但中间插着一根半埋的乌黑铁条。铁条上的纹路，和树根下那块铁牌如出一辙。「第六枚锚，也快出土了。」独臂老精灵不知何时站在你身后，「昨晚，它自己顶开了土。」"]
    },effects:{xp:25,flag:"elf_sixth_anchor"},go:"elf_deep_tower_entry"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 60, "yes": ["雾墙边的独臂老精灵看见你，放下手里的石头。「林歌那孩子提过你。」他说，语气比上次软了些，「能让那孩子开口的人，这三百年来不多。」"]}};
N["elf_deep_tower_entry"] = {
  place:"精灵王国 · 迷雾边界 · 旧塔", where:"黄昏",
  text:[
    "黄昏的雾墙泛起一层暗金色。独臂老精灵把磨好的石头搁在窗台上，望着雾墙出神。",
    "「三百年前，精灵和人类在这条边界上并肩站过一次。」他忽然开口，「那时候雾还没这么浓。树根还干干净净。」",
    "他转头看你：「你身上有铁门关的风，有沙漠的沙，有下水道的烟味——你走过的路，比议会里所有人都多。」",
    "他把那枚月牙白石抛给你：「拿着。雾里的东西，认得这石头。」",
    "「下次你再来——或者，当你找到第七枚锚的时候——带着它。旧塔的门，永远为你开。」"
  ],pace:"normal",
  options:[
    {t:"收下月牙石，谢过老精灵",effects:{xp:15,item:"月牙白石",infl:{elf:10}},run:function(){changeRelation('elf_tower_old',10,'迷雾边界旧塔之约'); curNode='elf_deep_market'; writeNext();}},
    {t:"问他：第七枚锚在哪里",check:{a:"INT",sk:"lore",label:"询问"},tier:{
      ok:["独臂老精灵沉默了很久：「七枚锚，环绕封印而立。四枚已失，两枚将出——最后一枚……」他望向东南方，「在你们人类的地盘上。具体在哪，我不知道。但我知道它埋在那里，已经三百年了。」","他不再多说，转身继续磨石头。"],
      fail:["「第七枚？」他摇摇头，「知道它位置的人，三百年前就都死在封印前了。」"],
      crit:["他压低声音，说出一个模糊的方位：「东南——顺着当年人类与精灵并肩的足迹找。那枚锚，埋在一座旧城的废墟下。」他顿了顿，「那座城，如今的名字，叫……承天。」"]
    },effects:{xp:30,flag:"elf_seventh_hint"},go:"elf_deep_market"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 60, "yes": ["独臂老精灵把磨好的石头搁下，看着雾墙出神：「林歌说，你是她信得过的人。」他顿了顿，「三百年前并肩站过的，如今又多了一个。」"]}};
N["elf_deep_grove"] = {
  place:"精灵王国 · 世界树外围 · 林间空地", where:"白昼",
  text:[
    "离开王庭，世界树外围的林子安静得能听见自己的心跳。阳光透过层层树叶，洒成一片碎金。",
    "你走到一片林间空地时，看见一只银白色的小兽蹲在树根边——半尺来长，毛茸茸的，尾巴像一小团月光。它歪着头看你，既不跑，也不靠近。",
    "空地中央，一株老树的树皮上，刻着一行浅浅的精灵文。你凑近看，翻译过来是：『树记住每一个过客。』",
    "小兽忽然竖起耳朵，朝树林深处叫了一声——那声音清亮得像铃铛。"
  ],pace:"normal",
  options:[
    {t:"跟着小兽走，看它要带你去哪",check:{a:"AGI",sk:"生存",label:"跟随"},tier:{
      ok:["小兽带着你穿过几片树丛，停在一棵老橡树前。橡树根部有一个树洞，洞里放着一只石碗——碗里盛着清水，水面上浮着几片银叶。你明白了：这是精灵的『饮兽处』，给林间生灵饮水的地方。你帮它添了些水。小兽绕着你的脚转了两圈，蹭了蹭，才跑开。"],
      fail:["小兽跑得太快，你在树丛里跟丢了。只听见远处传来一声铃铛似的叫声，像是在说再见。"],
      crit:["小兽带你到老橡树后，用爪子刨了刨土——土里露出一小截银色的、卷曲的东西。你挖出来看：是一枚巴掌大的银环，环上刻着十二个月亮。你想起集市上的说法：『月环』是精灵古物，失传已久。「拿着吧。」一个声音从头顶传来——是树上的猫头鹰在说话？不，是风穿过树洞的声响。你捏紧银环，心里记下这棵树的位置。"]
    },effects:{xp:20,item:"精灵月环",flag:"elf_moonring"},go:"elf_deep_market"},
    {t:"细读树皮上的精灵文",check:{a:"INT",sk:"lore",label:"解读"},tier:{
      ok:["你读了半天，发现『树记住每一个过客』下面还有一行更浅的字，被青苔盖住了一半：「……也记住每一个承诺。」你拨开青苔，第三行字露出来——刻痕很新：「他答应过，会回来。」不知说的是谁，但那一刻，风停了。"],
      fail:["精灵文的花体你认不全，只读出了『树』和『记住』两个词。"],
      crit:["你把整段文字读通了。那是三百年前，一位精灵战士刻下的告别——下方有一道浅浅的、人类的签名，笔迹已经模糊，但你认出了一个轮廓：那是一个早已消失的名字的开头。你默念那个读音，整棵老树忽然落了一阵叶雨，像在回应。"]
    },effects:{xp:25,flag:"elf_grove_oath"},go:"elf_deep_altar"},
    {t:"（在空地坐一会儿，然后离开林子）",go:"elf_deep_market"}
  ]
,
  ifRelation: {"npc": "elf_linge", "op": ">=", "val": 60, "yes": ["林间空地的树皮上，你看见一道浅浅的新刻痕——是林歌留下的记号，指向银月祭坛的方向。她没说出口的话，这片林子替你记住了。"]}};
/* ===== PE-2 支线 · 林歌之疑（npc=elf_linge，银月祭坛见习祭司，4 节点 65 挚友） ===== */
N["elf_w_enter"] = {
  place:"精灵王国 · 银月祭坛", where:"入夜",
  text:[
    "入夜后的银月祭坛格外安静。见习祭司林歌正独自跪在月池边，手里攥着一片发黑的树叶，眉头拧得紧紧的。",
    "她听见脚步声，惊了一下，看清是你，又松了口气：「是你呀。」她压低声音，「我……我有件事，想问问你。」",
    "她把那片树叶摊开在月光下——叶脉是黑的，像被墨浸过：「这是我昨天在祭坛后面的树根下捡的。我没敢告诉师父——她最近已经够烦了。」",
    "她抬起头，眼睛里有认真又忐忑的光：「你是外面来的，见得多。你说——树叶子变黑，真的是长老说的『天气不好』吗？」"
  ],pace:"normal",
  options:[
    {t:"如实告诉她：不是天气，是树根在渗",run:function(){changeRelation('elf_linge',10,'月池边的坦白'); curNode='elf_w_step1'; writeNext();}},
    {t:"先不吓她，只说『会帮她留意』",check:{a:"CHA",sk:"说服",label:"安抚"},tier:{ok:["林歌认真地点点头：「那说好了。」她把黑叶子小心收进怀里，「要是你再看到这样的叶子，也告诉我。」她顿了顿，声音轻得像风，「我总觉得，树在疼。可没人愿意听一个见习祭司说话。」"]},run:function(){changeRelation('elf_linge',10,'银月祭坛的约定'); curNode='elf_w_step1'; writeNext();}},
    {t:"（不多说，告辞离开）",go:"elf_deep_altar"}
  ]
};
N["elf_w_step1"] = {
  place:"精灵王国 · 银月祭坛 · 树根下", where:"夜",
  text:[
    "林歌带着你绕到祭坛后面——世界树一条老根从土里隆起来，像一条沉默的脊背。月光照在根皮上，你看见几道细小的黑色裂纹，正顺着根须的方向蔓延。",
    "林歌蹲下来，用手指轻轻碰了碰裂纹：「三天前，这里还没有。」她声音发颤，「我每天来换水，这条路我走了三年。树的变化，我记得比谁都清楚。」",
    "她忽然想起什么，从怀里掏出一块叠得整整齐齐的银叶：「还有这个——是青叶长老给我的。他说，要是发现新的裂纹，就把银叶贴在旁边。」她递给你看，「可银叶贴上去，第二天就变成黑色的了。」",
    "银叶的边缘，确实泛着一圈焦色。"
  ],pace:"normal",
  options:[
    {t:"帮她把银叶贴上，观察变化",run:function(){changeRelation('elf_linge',15,'同守树根之夜'); curNode='elf_w_step2'; writeNext();}},
    {t:"建议她把发现告诉青叶长老",check:{a:"INT",sk:"说服",label:"建言"},tier:{ok:["林歌犹豫了一会儿：「青叶长老……他上次从议会出来，脸色很不好看。我怕给他添麻烦。」但最终她点点头，「你说得对。黑叶子的事，不该瞒着。」她攥紧银叶，「明天一早，我就去找他。」"]},run:function(){changeRelation('elf_linge',15,'献叶青叶之议'); curNode='elf_w_step2'; writeNext();}},
    {t:"（在树根下仔细查看裂纹走向）",check:{a:"INT",sk:"侦察",label:"查看"},tier:{ok:["你顺着裂纹的走向爬了一段，发现它们不是乱长的——它们都朝着同一个方向：东南，正对着迷雾边界。你把这个发现告诉林歌。她怔了怔：「东南……旧塔那边？」她忽然想起什么，「青叶长老说，他年轻时在旧塔值守过。」"]},run:function(){changeRelation('elf_linge',15,'裂纹走向的发现'); curNode='elf_w_step2'; writeNext();}}
  ]
};
N["elf_w_step2"] = {
  place:"精灵王国 · 王庭 · 青叶长老居所", where:"晨",
  text:[
    "第二天一早，你陪林歌去找青叶长老。长老的居所是王庭边上一间不起眼的木屋，门口种着几丛药草。",
    "青叶长老听完林歌的话，又看了那片焦黑的银叶，沉默了很久。",
    "「你说得对，孩子。」他开口，声音比在议会上温和得多，「不是天气。是树根在渗。」",
    "他走到屋角，翻开一只木箱，取出一只旧的陶瓶：「这是三百年前，封印前值守的萨满留下的『净根药』——只剩这一瓶了。涂在裂纹上，能暂缓渗透。」",
    "他把陶瓶递给林歌：「去涂吧。这件事，你比议会里任何人都上心——树会记住你的。」",
    "林歌接过陶瓶，眼眶红了，却用力点头。"
  ],pace:"normal",
  options:[
    {t:"陪林歌一起去涂药",run:function(){changeRelation('elf_linge',20,'净根涂药之行'); curNode='elf_w_end'; writeNext();}},
    {t:"问青叶长老：净根药能撑多久",check:{a:"INT",sk:"lore",label:"询问"},tier:{ok:["青叶长老摇摇头：「三百年的药，效力剩不下多少——顶多压住一个月。」他望着东南方，「一个月，够我们找到『锚』的来路了。孩子，你查到的那些铁牌——它们出土的位置，一个比一个靠近承天城。那里，是收网的地方。」"]},run:function(){changeRelation('elf_linge',20,'青叶长老的嘱托'); curNode='elf_w_end'; writeNext();}},
    {t:"（在屋外等林歌涂药）",run:function(){changeRelation('elf_linge',10,'静候林歌'); curNode='elf_w_end'; writeNext();}}
  ]
};
N["elf_w_end"] = {
  place:"精灵王国 · 银月祭坛 · 月池边", where:"夜",
  text:[
    "涂过净根药的裂纹，颜色淡了一层。林歌蹲在月池边，把最后一滴药抹在树根上，长长地吐出一口气。",
    "「师父说，药只能撑一个月。」她看着月池水面——水面的褶皱，确实比昨天浅了一些，「但一个月，够我做很多事了。」",
    "她从怀里摸出一枚小小的银叶别针，递给你：「这是我入祭坛时，师父给的。我一直舍不得戴。」她认真地看着你，「你帮我守过树根，帮我找过青叶长老——这个，给你。」",
    "她笑了笑，月光落在她脸上：「等树的病好了，我再跟你说——我们精灵的『树语』。」",
    "（获得：银叶别针 · 50 金币 · 40 历练 · 林歌好感升至挚友）"
  ],pace:"normal",
  options:[
    {t:"收下银叶别针，与她道别",effects:{gold:50,xp:40,infl:{elf:15}},run:function(){changeRelation('elf_linge',0,'支线完结（累计65）'); curNode='elf_deep_market'; writeNext();}},
    {t:"问她：『树语』是什么",check:{a:"INT",sk:"lore",label:"询问"},tier:{ok:["林歌歪着头想了想：「树语就是——树想说的话呀。」她指着世界树，「它不说话，可它的叶子会黄，根会疼，风会替它叹气。听懂了这些，就是会树语了。」她笑了笑，「你好像，已经会了一点。」"]},go:"elf_deep_market"}
  ]
};
/* ===== PE-2 矮人王国补强（日常层 3 节点） ===== */
N["dwarf_deep_bard"] = {
  place:"矮人王国 · 王都 · 老巴德铁匠铺", where:"白昼",
  text:[
    "老巴德的铁匠铺在矮人王都第三道街的转角，门口挂着一块被炉烟熏黑的木牌：『巴德·锻与修』。",
    "铺子里，一个白胡子的老矮人正用一只放大镜片端详一把断剑的刃口。他听见脚步声，头也不抬：",
    "「修刀，右边排队。打刀，左边等料。买酒——隔壁。打听事——」他终于抬眼，目光在炉火映照下亮得惊人，「坐。老巴德今天心情好，可以聊两句。」",
    "他面前的案台上，摆着一排长短不一的成品刀剑，刃口都磨得可以照人。"
  ],pace:"normal",
  options:[
    {t:"请老巴德看看你的兵器",check:{a:"AGI",sk:"锻造",label:"求鉴"},tier:{
      ok:["老巴德接过你的兵器，翻来覆去看了三遍，哼了一声：「学院派的料子，手艺还行，就是淬火差了点火候。」他转身从炉边取来一小罐油，用布蘸了，细细擦过你的刃口，「北境雪松油，抹过之后，刃口三天不生锈。」"],
      fail:["老巴德看了一眼就递回来：「好刀。别让我糟蹋了。」"],
      crit:["老巴德看了半天，忽然说：「这把刀，跟过你不少年了吧？」他指了指刃口一处极细的旧痕，「这里，是挡过一剑——力道很重，你手都震麻了。」他送你一卷上好的磨石，「好刀配好石。老巴德认刀，也认人。」"]
    },effects:{xp:15,infl:{dwarf:5}},go:"dwarf_deep_hall"},
    {t:"问他矿脉和『地底声音』的事",check:{a:"INT",sk:"lore",label:"询问"},tier:{
      ok:["老巴德的锤子顿了顿：「地底声音。」他重复了一遍，声音沉下来，「三个月前开始，最深的老矿道里，有东西在『磨牙』。」他压低声音，「老矿工们说，那声音不是矿脉在动——矿脉动，是有节拍的。那声音，没有节拍。」"],
      fail:["「矿脉？」老巴德摇摇头，「矿脉的事，找王都的矿务官。我只管铁。」"],
      crit:["老巴德把铺子的门关了半扇，才压低声音说：「我有个老伙计，上个月下老矿道检修，回来之后，一句话不说，把手里的矿灯摔了。」他盯着你，「他跟我说了一句话：『巴德，矿道最深处，有灯照不到的地方。』」","他拍拍你的肩：「你要是真下老矿道——带上两盏灯。一盏照路，一盏照你背后。」"]
    },effects:{xp:25,flag:"dwarf_deep_hint"},go:"dwarf_deep_mine2"},
    {t:"（买点铁料，告辞）",effects:{gold:-15},go:"dwarf_deep_hall"}
  ]
,
  ifFlag: {"spared_robber": ["老巴德听说你放过那个强盗的事，砸了砸嘴：「心软不是毛病，在这世道，心软不折本钱才算本事。」他往炉子里添了块炭，没再多说。"]}};
N["dwarf_deep_hall"] = {
  place:"矮人王国 · 王都 · 铁砧议会厅", where:"白昼",
  text:[
    "铁砧议会厅是矮人王都的中心建筑——整座厅堂用整块的黑石凿成，穹顶高得能装下三座熔炉。正中的铁砧是议会的象征，已经有八百年没被敲响过了——除非有大事发生。",
    "此刻，铁砧周围围着一圈矮人长老，正激烈地争着什么。你听了几句：",
    "「矿脉枯了三十年，现在老矿道又闹『声音』——王都的铁价，已经涨了三成了！」",
    "「涨就涨。矮人的铁，从来只认锤子认不认人，不认价钱。」",
    "「可东边那帮『顾问』，开价是市场价的两倍！他们要多少，我们就卖多少？」",
    "争论声在你耳畔回荡。你注意到，铁砧边缘，摆着一块焦黑的矿石——像是刚从矿道深处挖出来的。"
  ],pace:"normal",
  options:[
    {t:"旁听议会，收集情报",check:{a:"INT",sk:"侦察",label:"旁听"},tier:{
      ok:["你听出门道：长老们吵的不是卖不卖铁——是『顾问』要的铁太多了，多到不像做兵器，像是要『填什么东西』。一个老矮人嘟囔了一句：「他们要的铁，够铸三千面盾——可谁见过三千面盾一起用的仗？」"],
      fail:["矮人们用方言吵得飞快，你只抓住几个词：『顾问』『铁价』『老矿道』。"],
      crit:["你注意到焦黑矿石上的痕迹：不是天然矿脉——是烧过的，边缘有整齐的切口，像被什么热力十足的东西『切』下来的。你趁没人注意，用手指蹭了一下：指尖沾上一丝极淡的、油性的黑。和自由城邦下水道的气味，隐隐对上了。"]
    },effects:{xp:20,flag:"dwarf_council_ore"},go:"dwarf_deep_bard"},
    {t:"上前询问铁砧上的矿石",check:{a:"CHA",sk:"交涉",label:"询问"},tier:{
      ok:["一个长老瞥了你一眼：「人类也关心矮人的矿？」但他还是说了，「这块矿，是三天前从老矿道第七层挖出来的——那里的矿石，从来都是灰白色的。这块，黑得像炭。」他压低声音，「我们正为这事开会。老矿道，怕是要封了。」"],
      fail:["长老摆摆手：「议会的桌上，不谈给外人听的事。」"],
      crit:["你问到了关键：这块黑矿，被『顾问』的人出高价收过——「他们不收整块，只收『带黑纹的』，一筐一筐地收。」老矮人皱眉，「可我们查过，黑矿炼不出好铁。他们要它做什么？」"]
    },effects:{xp:25,flag:"dwarf_blackore_sale"},go:"dwarf_deep_mine2"},
    {t:"（不打扰议会，去矿道看看）",go:"dwarf_deep_mine2"}
  ]
};
N["dwarf_deep_mine2"] = {
  place:"矮人王国 · 王都 · 老矿道第七层", where:"地底",
  text:[
    "老矿道第七层早已废弃——矿灯的光照过去，只能照亮身边几尺。岩壁上挂着陈年的水痕，空气里有一股铁锈和霉味。",
    "你走了一刻钟，在一条支道尽头停下。这里的光线暗得奇怪——矿灯的光，像是被什么东西吸走了一截。",
    "你想起老巴德的话：『两盏灯。一盏照路，一盏照你背后。』",
    "远处，矿道深处传来一声极轻的、缓慢的声响——像是石头在很深的地方，翻了个身。"
  ],pace:"normal",
  options:[
    {t:"朝声音的方向小心前进",check:{a:"AGI",sk:"潜行",label:"潜行"},tier:{
      ok:["你贴着岩壁前进，拐过两个弯后，看见一处塌方——碎石堆里，露出一角乌黑的东西。你扒开石头，是一截半埋在岩层里的铁柱，柱身上刻着模糊的纹路——七纹竖瞳。你心里一沉：这种柱子，你见过——在深渊神殿，在树根下。"],
      fail:["矿道太黑，你踩到一块松动的碎石，声音在黑暗里传得很远。那『翻身』的声响停了。你屏住呼吸等了一刻钟，它才重新响起来——但似乎，离得更远了。"],
      crit:["你不仅找到了铁柱，还发现铁柱周围的岩壁是滚烫的——即使在废弃矿道里，那股热意也格外反常。你想起议会上那块焦黑的矿石：矿脉不是枯了，是被『烧』了。有人在矿道最深处，埋了一根会发热的柱子。"]
    },effects:{xp:30,flag:"dwarf_pillar"},go:"dwarf_deep_bard"},
    {t:"不深入，记下位置后退出",check:{a:"INT",sk:"侦察",label:"标记"},tier:{
      ok:["你在支道口的岩壁上刻了一个矮人数字『七』——这是矿工记路的老办法。你记下坐标：第七层，西三支道，尽头塌方。这个信息，将来或许值一条命。"],
      fail:["矿道太黑，你记不清方向。只得原路退回。"],
      crit:["你不仅记了位置，还在地上捡了一块掉落的焦黑矿石——和议会上那块一模一样。你把它收好。这矿石，是『顾问』高价收的东西。现在你明白了：他们收的，是『锚』周围烧过的石头。"]
    },effects:{xp:20,item:"焦黑矿石"},go:"dwarf_deep_bard"}
  ]
,
  ifFlag: {"bandit_leader_killed": ["矿灯的光晃过岩壁，你的手在剑柄上停了一下。铁门关外的血，在这地底七百层的安静里忽然翻上来——你不再是从前那个只听过传说的人了。"]}};

/* /u1inj:data-nodes:dn_memory_tpl.js/ */
/* ===== /v91inj:memtpl/ CM-1 记忆注入模板库（纯数据；v66 文风；治理词合规） =====
 * 占位符：{n}=天数，{name}=NPC 名
 * 触发：① place_first/place_revisit 地点切换（首访/重访，会话内区分）
 *       ② time_gap 时间跨距 >7 天
 *       ③ npcs+friend/enemy 好感回指（≥60 挚友 / ≤-20 敌对）
 *       ④ echo flag 回响池（延迟触发，每 flag 至多一次）
 */
window.MEMORY_TPL = {
  place_first: [
    "头一回站上这片地界。风把尘土和陌生的气味一起灌进衣领，路人都拿余光扫你——新面孔在这里是藏不住的。",
    "这地方你只听人提过。真到了跟前，比传闻里矮三分、糙三分，也实三分。",
    "初到贵地，你放缓了步子。街巷的走向、招牌的颜色、巡逻兵的步伐，样样都得先看两眼再迈腿。",
    "旅店掌柜把钥匙拍在柜台上时多看了你一眼。他记得住每张生面孔，这是吃这碗饭的手艺。",
    "城门口的告示还带着浆糊味儿。你站了一会儿，把该记的都记下了——地方生，规矩不能生。",
    "你沿着主街走了一趟。这里的石缝里嵌着旧刀痕，墙根堆着草料车，是个常备刀兵的地方。",
    "入夜前你进了城。更夫还没敲头遍锣，巷子里已经飘起炊烟——落脚之后，得先弄清楚谁说了算。",
    "脚底板还带着上一站的风尘，人已经站在新地界上了。你吐了口气：又是从头认路的一天。"
  ],
  place_revisit: [
    "再回到这里，街还是那条街，只是你认路的底气比上次足了。",
    "这地方你熟门熟路——连哪家铺子换了幌子都看得出来。",
    "旧地重游。上次在这里盘桓的印记还在，人却已经不是当时的你了。",
    "回到此处，你径直穿过主街，没有多绕一步。有些地方，走过一次就够了。",
    "城门口那棵老树还在。你朝它点了点头，算是打过招呼。",
    "又到了这里。上次没办完的事、没见着的人，这回你心里有数了。",
    "熟悉的房檐、熟悉的叫卖声。你脚步没停，直接往里走。",
    "故地重来，风物未改，人心已变——至少你自己是变了。"
  ],
  time_gap: [
    "从你上次停在这里算起，已过了{n}天。日头还是那个日头，世道却不是那个世道了。",
    "一晃{n}天。再抬头时，节令都换了模样。",
    "这{n}天里，你没有回过这里。再踏进来，灰尘都落了两层。",
    "{n}天前的事还像昨天，可路上的车辙已经换过几茬了。",
    "隔了{n}天再想这件事，你心里又多了几层掂量。",
    "日子过了{n}天。有些账，是该清算的时候了。",
    "你数了数，自己离开这里已经{n}天。时间这东西，赶路时过得最快。",
    "这{n}天里发生了不少事。此刻站在这里，倒像是上一世的事。"
  ],
  friend: [
    "{name}看见你，眼睛先于嘴亮了一下。这人的情分，是用一件件事攒出来的。",
    "{name}没多话，只是把位置给你让了半边——熟人的默契，不用寒暄。",
    "你走近时，{name}正要开口，又改成了点头。有些交情，言语反而见外。",
    "{name}拍了拍你的肩头，力道不大，分量不轻。",
    "在{name}面前，你不必端着了。对方也看得出来，懒得拆穿。",
    "{name}把你让到火边坐下。这待遇，不是谁都有的。",
    "你开口前，{name}已经把你的话接了过去——你们之间，省了这一道。",
    "{name}把新打的猎物分了你一份，没问缘由。这就是情分该有的样子。"
  ],
  enemy: [
    "{name}看见你，脸侧的线绷了一下，随即移开。那一眼里的东西，比骂人还冷。",
    "你与{name}照面，谁都没先开口。中间的空气像绷紧的弓弦。",
    "{name}见你走近，手不动声色地按上了刀柄。",
    "你和{name}之间的账，还没清。彼此都记得，只是不提。",
    "{name}侧过身，把背对着你——比瞪你更直白的表态。",
    "你开口叫{name}，对方脚步没停。话头就这么晾在了半空。",
    "{name}脸上没什么表情，但你分明看见对方指节发白。",
    "这一次照面，{name}连招呼都省了。你们之间，早没了那个必要。"
  ],
  npcs: [
    {id:"orc_graymane", name:"灰鬃", word:"灰鬃"},
    {id:"elf_linge", name:"林歌", word:"林歌"}
  ],
  echo: [
    {flag:"khan_aware", name:"黑石大汗", minDays:45, tpl:[
      "你想起黑石大汗那夜的沉默。有些察觉，一旦种下，就再也收不回去了。",
      "草原的风里，你总觉得有人在远处望着这边。那眼神未必有敌意，但一定有人在算。"
    ]},
    {flag:"oracle_fake", name:"神谕的真相", minDays:30, tpl:[
      "你见过神谕的另一面。再听见祭司念诵时，你的耳朵会不自觉地找那些字缝。",
      "有些真相知道得越深，越难装回无知。你试着不去想那晚的事，可惜没用。"
    ]},
    {flag:"spared_robber", name:"那个被放走的劫匪", minDays:30, tpl:[
      "你想起那个跪在泥里求饶的劫匪。当时刀悬着没落下去，如今倒有些记挂这人的下落。",
      "放过的人，未必会记你的恩；可杀过的人，一定不会再醒。你偶尔会想，那条命如今在哪。"
    ]},
    {flag:"bandit_leader_killed", name:"那个倒在刀下的匪首", minDays:30, tpl:[
      "匪首倒下的那一幕，偶尔还会在夜里闪过。你亲手了结的，不只是一个人，还是一段恩怨。",
      "你杀过的那个人，名字已经模糊了，可他最后那口气的眼神，你记到现在。"
    ]},
    {flag:"father_truth_denied", name:"父亲的事", minDays:40, tpl:[
      "关于父亲的事，你选了不去深究。可那道门只是关着，锁还挂在那里。",
      "你常常在岔路口想起那个答案——你亲手把它推远了，如今倒分不清是躲还是悔。"
    ]},
    {flag:"prophecy_defied", name:"那道被违抗的预言", minDays:35, tpl:[
      "那道预言，你没有照着走。路是你自己踩出来的，至于预言会不会等在前头，你不想知道。",
      "你违抗过命运一回。那之后，再听见「命」这个字，你都会多留一个心眼。"
    ]},
    {flag:"gave_all_to_refugees", name:"那次倾囊", minDays:25, tpl:[
      "你把口袋都倒给了难民营的那天，不少人记住了你。钱袋空了，可有些东西反而装满了。",
      "那次倾囊之后，你路过集市时偶尔会被人认出——不是麻烦，是一声招呼。"
    ]},
    {flag:"betrayed_classmate", name:"那个被你辜负的同窗", minDays:30, tpl:[
      "同窗的事，你不愿多想。可每次遇见穿学院袍的年轻人，你的脚步都会快半拍。",
      "你辜负过一个人。这件事像鞋里的一粒沙，不碍走路，但走远了总会硌一下。"
    ]},
    {flag:"aquan_liberated", name:"水城的事", minDays:35, tpl:[
      "水城的事已经了结。可夜里听见水声，你还是会想起那座城的铁闸与灯火。",
      "你放走过一座城。城里人的笑脸你还记得几张，这就够了。"
    ]},
    {flag:"let_mercury_go", name:"被你放走的墨丘利", minDays:40, tpl:[
      "墨丘利走的那天，你松了手。这个人欠你的、你欠这个人的，从此都算不清了。",
      "你偶尔会在人群里找一张相似的脸。明知道不该等，还是忍不住看第二眼。"
    ]}
  ]
};
/* /v91inj:memtpl:end/ */

/* /u1inj:data-nodes:dn_orc_deep.js/ */
/* /pe1inj:orc-deep/ PE-1 兽人草原深度包（P2 剩余 + 大幅方向内容展开）
   兽人草原日常探索层：黑石部族营地生活 / 圣山信仰 / 狼骑兵营
   全对象式纯数据节点，零引擎改动；判定走既有 check/tier/effects/changeRelation
   世界观约束：不与「神谕被操纵」主线冲突（orc_sacred 已立）；兽王鬃吼/大萨满/黑石大汗沿用既有设定 */
N["orc_deep_gate"] = {
  place:"兽人草原 · 黑石部族营地 · 营地门", where:"白昼",
  text:[
    "黑石营地的木门由两根整棵的灰杉并排做成，门楣上挂着一串褪色的狼牙。守门的两个兽人战士抱着手臂打量你——目光从你的靴子扫到发顶，像在掂一块肉的斤两。",
    "「人类。」左边那个用生硬的大陆语开口，「大汗说了，黑石营地的门，认刀不认人。你有刀吗？」",
    "他说这话时，右边那个已经让开半边身子——营地里飘出烤肉和马奶酒的香气，还有一声接一声的、闷雷似的战鼓。"
  ],pace:"normal",
  options:[
    {t:"亮出你的兵器，表明来意",check:{a:"STR",sk:"martial",label:"亮刀"},tier:{
      ok:["你拔出兵器，随手挽了个利落的刀花。守门兽人的眼睛亮了一下：「嗯，是见过血的手。」他侧身放行，「进去吧。别惹事——黑石的规矩，惹事的人会被挂上图腾柱。」"],
      fail:["你握刀的手势让兽人皱了皱眉：「你这刀，是切肉用的吧。」他哼了一声，还是放你进去了——但一路都有几道视线跟着你。"],
      crit:["你把刀掷出去，刀尖钉进门柱三寸。两个兽人对视一眼，忽然一起咧嘴笑了：「好！黑石营地认你这把刀！」他们让开路，甚至有人朝你喊了声什么——那是兽人语里的『兄弟』。"],
      critfail:["你拔刀时手一滑，刀差点掉进泥里。守门的兽人看你的眼神变成了怜悯：「……进去吧，人类。黑石不杀没有威胁的东西。」"]
    },effects:{infl:{orc:5}},go:"orc_deep_market"},
    {t:"不亮刀，只说是来谈生意的",check:{a:"CHA",sk:"persu",label:"论商"},tier:{
      ok:["你摊开手，报出商队的名字。守门兽人哼了一声，但兽人草原的规矩确实认货不认人：「谈生意？带够盐和铁了？」他挥手放行，"],
      fail:["「谈生意？」守门兽人上下打量你空荡荡的双手，「你拿什么谈？空手？」你被晾在门口，半天才等到一个路过的老兽人给你递了句话："],
      crit:["你报出银月商会的名头，又随口说了两句北境的铁价。守门兽人眨了眨眼：「……你懂行情。」他侧身放行，压低声音，「进去右转第三个帐篷，找『灰鬃』。草原的刀，快生锈了。」"]
    },go:"orc_deep_market"},
    {t:"跟着一队猎手出营，去草原上打猎",go:"orc_deep_hunt"},
    {t:"（先退开，观察营门动静）",check:{a:"INT",sk:"侦察",label:"观察"},tier:{
      ok:["你退到拴马桩旁，看了小半个时辰。营门进出的兽人各色各样：背弓的猎手、扛铁坯的匠人、被母亲拎着耳朵的兽人崽子。你注意到一个细节——三个不同帐篷出来的兽人战士，腰间的刀鞘上，都缠着同一色的红绳。","你问一个路过的老兽人那红绳是什么意思。他看了你一眼：「那是『南边来的顾问』赏的。说绑上红绳，祖灵就认得自家兄弟。」他嗤了一声，「祖灵认不认得，我不知道。那绳子，倒是会认人的钱袋。」"],
      fail:["你蹲了半天，除了马粪和烟尘，什么也没看出来。营门那头的战鼓声倒是越来越密——听久了，心里莫名发闷。"],
      crit:["你不仅看清了红绳，还数出了数量：半个时辰，七十七个绑红绳的战士进营。这数字比你预想的多。老兽人告诉你，「南边的顾问」三个月前带着两车盐铁进草原，从那以后，红绳一天比一天多。","你把这数字记在心里。草原的战鼓，恐怕比黑石大汗想敲的，更急。"]
    },go:"orc_deep_market"},
    {t:"（在营地盘桓几日，然后收拾行装离开草原）",go:"orc_deep_leave"}
  ]
,
  ifFlag: {"khan_aware": ["守门的兽人认出了你——你见过大汗的消息，在营地里传得比风还快。这次他们没抱臂，只把门让开一肩宽。"]}};
N["orc_deep_market"] = {
  place:"兽人草原 · 黑石部族营地 · 兽人集市", where:"白昼",
  text:[
    "兽人的集市没有摊位，只有一圈圈围着火堆或石台的人。货换货，偶尔夹几枚叮当作响的银月——在草原上，银月不如一把好刀值钱。",
    "一个独眼兽人婆子守着半张兽皮，上面摆着干肉、草药、几颗发灰的兽牙。她冲你扬了扬下巴：",
    "「人类，你来得正好。草原的盐要见底了，铁器也锈得厉害——你要是能弄来这两样，整个黑石营地都欠你人情。」",
    "旁边一个年轻兽人猎人凑过来：「别听她的。她去年拿三颗假牙换了我一张狼皮。」",
    "独眼婆子抄起骨杖作势要打他：「那叫开价！」"
  ],pace:"normal",
  options:[
    {t:"跟婆子做一笔以物易物的买卖",check:{a:"CHA",sk:"bargain",label:"议价"},tier:{
      ok:["你用身上带着的盐块和一小卷铁皮，换了一袋风干狼肉和一捆止血草。婆子数了三遍盐，终于满意地点点头：「草原人说话算话。你要是缺落脚的地方，去宴火那边——报我的名号，『独眼婆子』。」"],
      fail:["你开出的价，婆子眼皮都没抬：「盐是好盐，可你只要这点东西？人类，你亏了，我看不下去。」她多塞给你一小包磨刀石，「拿着，别让人说我欺负生客。」"],
      crit:["你不仅换到了东西，还套出了消息：婆子压低声音，「南边的顾问」这三个月，用盐铁换走了草原上几乎所有的大型兽骨——「说是要建什么『骨塔』。谁知道呢，祖灵从不让活人往地上堆骨头。」","你记下『骨塔』这个词。它和铁门关方向传来的消息，对得上。"],
      critfail:["你掏盐的时候，口袋破了，盐撒了一地。婆子看了你半天，摇摇头，反而递给你一碗水：「先喝口水。草原的规矩，不笑话落难的人。」"]
    },effects:{gold:10,xp:15},go:"orc_deep_smith"},
    {t:"打听草原最近的传闻",check:{a:"INT",sk:"lore",label:"打听"},tier:{
      ok:["你蹲在火堆旁，听了半下午的闲话。消息杂而多：北边狼群提前南迁了；赤峰矿的矮人工头欠了兽人三车铁；大汗的幼子昨天徒手拧断了一头雪狼的脖子——「草原的刀，一茬比一茬快。」"],
      fail:["兽人们的闲话用部族语居多，你只听懂了零星几个词。唯一确认的是：草原上的盐，真的快没了。"],
      crit:["你把几个版本的传闻拼在一起，拼出一条线：『南边的顾问』三个月前进草原 → 带来盐铁 → 收走兽骨 → 红绳一天比一天多 → 大汗的信徒和长老们，越来越听『神谕』的话。","而这把刀指向的方向，是大萨满说的那句——『去沙漠』。你隐约觉得，草原的事，和铁门关、和自由城邦下水道里的黑烟，是同一张网。"]
    },effects:{xp:20,infl:{orc:5}},go:"orc_deep_smith"},
    {t:"（买碗马奶酒，坐下歇脚）",effects:{gold:-2},tier:{ok:["一碗浑浊的马奶酒下肚，你整个人被那股冲劲顶得打了个激灵。卖酒的老兽人哈哈大笑：「好！能喝马奶酒的人类，不算孬种！」他多给你添了半碗——「喝了黑石的酒，就是黑石的半个客人。」"]},go:"orc_deep_witch"}
  ]
,
  ifRelation: {"npc": "orc_graymane", "op": ">=", "val": 60, "yes": ["你一到集市，几处火堆边的兽人都朝你点头——灰鬃的朋友，在草原上算半个自家人。有个老兽人把一块熏肉塞进你手里，说这是上回你帮的忙。"]}};
N["orc_deep_smith"] = {
  place:"兽人草原 · 黑石部族营地 · 铁匠帐", where:"白昼",
  text:[
    "铁匠帐里热浪扑面。一个膀大腰圆的兽人女铁匠正抡着锤子敲一块通红的铁坯，火星四溅。她听见脚步声，头也不抬：",
    "「要打刀，排队。要修刀，放下。要是来打听事儿——」她终于抬眼，目光锐利，「先把你的来意说清楚。」",
    "她面前的砧板上，躺着一把半成品的长刀，刀脊上隐约有暗红色的纹路。旁边矮几上，整整齐齐码着几卷北境铁、一捆灰白色的——那是雪狼牙，磨到发亮。"
  ],pace:"normal",
  options:[
    {t:"请她帮你保养武器",check:{a:"AGI",sk:"锻造",label:"求锻"},tier:{
      ok:["她接过你的兵器，翻来覆去看了两遍，哼了一声：「手艺还行，就是开刃太糙。」她随手在磨石上走了几道，再递回来时，刃口寒光逼人——「草原的规矩，帮你磨刀，你得欠我一顿好酒。」"],
      fail:["她看了你的兵器一眼：「这种货色，也配叫刀？」但还是帮你紧了紧柄绳，「下次带块北境铁来，我教你什么叫刀。」"],
      crit:["她不仅帮你磨了刃，还看出你的兵器是学院派的制式：「魔法学院的手艺，中看不中用——在草原上，一刀就是一刀。」她送你一小卷雪狼皮裹刀，「北境狼的皮，刃口不生锈。算是投缘。」"],
      critfail:["她手一滑，磨石把你的刃口磕了个豁。她面不改色：「……意外。草原的规矩，意外不算数。你过两天再来，我赔你一把新的。」"]
    },effects:{xp:15,infl:{orc:5}},go:"orc_deep_wolf"},
    {t:"问她『骨塔』的事",check:{a:"INT",sk:"说服",label:"询问"},tier:{
      ok:["她的锤子顿了一下。「骨塔。」她重复了一遍这个词，声音沉下来，「『南边的顾问』收走的兽骨，确实都运去北边荒原了。说是要建什么塔，祭祖灵。」她嗤笑，「祖灵住在骨头里？我从没听过这样的说法。」"],
      fail:["「骨塔？」她皱眉，「草原上骨头多得是，谁有空管什么塔。」她似乎不愿多谈，低头继续敲铁，"],
      crit:["她把锤子放下，压低声音：「我悄悄跟过一车兽骨。它们没去祖灵山——它们往东走了，越过草原，去了铁门关方向。」她看着你，「人类，我知道你在查什么。草原的刀要出鞘，可握着刀柄的那只手，不一定是黑石大汗的。」"]
    },effects:{xp:20,flag:"bone_tower_hint"},go:"orc_deep_feast"},
    {t:"（告辞，去狼骑兵营看看）",go:"orc_deep_wolf"}
  ]
,
  ifFlag: {"bandit_leader_killed": ["女铁匠认出了你——你在铁门关外杀过匪首的事，跟着商队传进了草原。她盯着你看了两息，把锤子往砧上一放：「能杀那种货色的人，铁器上不能含糊。要什么，我亲手打。」"]}};
N["orc_deep_wolf"] = {
  place:"兽人草原 · 黑石部族营地 · 狼骑兵营", where:"白昼",
  text:[
    "狼骑兵营是营地北角的一片开阔地，木桩围栏里拴着十几头灰狼——每一头都有小马驹那么大，绿油油的眼睛盯着你。",
    "一个脸上横着一道旧疤的兽人战士正在给一头狼梳理鬃毛。他听见你走近，拍了拍狼背，那狼低吼一声，退到栏边。",
    "「狼骑兵营，不接待闲人。」他直起身，比你高出一个头，「除非——你有事找灰鬃。」",
    "他的目光落在他腰间的刀上。那把刀，刀鞘缠着红绳。"
  ],pace:"normal",
  options:[
    {t:"直接说明来意，想结识灰鬃队长",check:{a:"CHA",sk:"说服",label:"求见"},tier:{
      ok:["他盯着你看了半晌，忽然咧嘴：「行。灰鬃这几天正烦着——部落里没几个人愿意听他说话，一个人类倒是来了。」他冲营地深处一扬下巴，「他在那边。去吧。」"],
      fail:["「灰鬃不见人类。」他转身继续梳狼毛，「草原的刀，快出鞘了。你一个人类，在这时候凑上来，要么是傻，要么是别有用心。」"],
      crit:["他顿了一下：「你是那个在集市上换盐的人类？独眼婆子跟我提过你——她说你懂行情。」他侧身让路，「去吧。灰鬃的帐篷在狼栏后面。记住：跟他说人话，别绕弯子。草原人不喜欢绕弯。」"]
    },go:"orc_w_enter"},
    {t:"打听狼骑兵的传闻",check:{a:"INT",sk:"侦察",label:"打听"},tier:{
      ok:["你靠在围栏边，跟他有一搭没一搭地聊。他话不多，但信息量不小：狼骑兵一共七个狼栏；灰鬃是黑石大汗的义子；最近三个月，狼骑兵的巡逻路线往北移了——「狼的鼻子，闻到了铁味。」"],
      fail:["他不太搭理你，只给狼添了两次水。你唯一听清的是他对一头狼说的话：「别急。快了。」"],
      crit:["他压低声音，告诉你一件怪事：「上个月，灰鬃在草原深处巡夜，撞见一队『顾问』的马车——车辙很深，压过的地方，草都枯了。」他盯着你，「黑石的人不信这个。灰鬃信。所以他最近很烦。」"]
    },effects:{xp:15},go:"orc_w_enter"},
    {t:"（退出狼骑兵营，去宴火那边）",go:"orc_deep_feast"}
  ]
};
N["orc_deep_feast"] = {
  place:"兽人草原 · 黑石部族营地 · 宴火", where:"入夜",
  text:[
    "入夜后，营地中央的宴火燃起来。那是三根原木架成的大火堆，火舌舔着夜色，把周围兽人的脸映得忽明忽暗。",
    "宴火是黑石部族的议事场，也是酒场。几坛马奶酒被搬出来，肉香混着汗味，粗野而热烈。",
    "你看见几个兽人长老围坐在火边，低声交谈。他们的腰间，也有红绳——但系得很随意，不像刻意彰显。",
    "一个喝到微醺的老兽人看见你，招手：「人类！过来坐！草原的宴火，不拒绝任何一个客人——只要你说得出一个值得听的道理。」"
  ],pace:"normal",
  options:[
    {t:"坐过去，陪老兽人喝酒听事",check:{a:"CHA",sk:"交涉",label:"陪酒"},tier:{
      ok:["你坐下来，接过一碗马奶酒。老兽人话匣子一开就收不住：他年轻时参加过铁门关外的围猎，见过「人族的城墙像铁罐头」；他说草原的狼老了会自己走进雪里；他说最近大汗的脾气越来越急，「像是被什么催着」。"],
      fail:["马奶酒太冲，你喝了一口就呛住。老兽人乐了：「人类，酒量不行，道理总行吧？」他给你换了碗清水，"],
      crit:["老兽人喝到兴起，凑近你，压低声音：「我跟你说个事——三个月前那『神谕』第一次来，我正好在祖灵洞外。那声音……不像祖灵。」他眯起眼，「祖灵说话，是山的声音。那声音，是刀的声音。」","他拍了拍你的肩：「人类，你听过的道理多。你告诉我——草原的刀，该不该信一把不是自己人的手？」"]
    },effects:{xp:15,infl:{orc:5}},go:"orc_deep_trail"},
    {t:"注意长老们的交谈，收集情报",check:{a:"INT",sk:"侦察",label:"旁听"},tier:{
      ok:["你坐在火堆下风处，断断续续听到一些词：「北境城」「围城」「狼群先走」「铁门关的求援信鸽」。长老们压着嗓子，但宴火边的耳朵，从来不止一双。"],
      fail:["宴火太吵，战鼓声又起，你什么也听不清。只看见长老们说到一半，被一个传令的兽人战士叫走——那个战士腰间，红绳系得很正。"],
      crit:["你拼出关键情报：黑石大汗三天前已经点了兵，狼骑兵先行，猎手殿后——「南下」不是传闻，是军令。但长老们真正担心的是另一件事：他们不知道大汗为什么这么急。「神谕说要南下，可神谕没说为什么南下。」"]
    },effects:{xp:25,flag:"orc_war_moving"},go:"orc_deep_trail"},
    {t:"（起身告辞，趁夜离开营地）",go:"orc_deep_trail"}
  ]
,
  ifRelation: {"npc": "orc_graymane", "op": ">=", "val": 60, "yes": ["宴火最旺的那一圈，给你留着位置。灰鬃朝你扬了扬下巴，有兽人把烤好的羊腿递过来——在草原，能坐进火圈中央的人，是被人放进眼里的。"]}};
N["orc_deep_witch"] = {
  place:"兽人草原 · 黑石部族营地 · 巫医帐", where:"白昼",
  text:[
    "巫医帐里弥漫着草药和焚香的味道。一个佝偻的老兽人坐在帐角，面前摆着一排陶罐。她的眼睛很浑浊，却总让人觉得自己被看透了。",
    "「坐。」她开口，声音干涩，「巫医帐里，不问来历，只问伤病。你哪里不舒服？」",
    "她的手指轻轻叩着最近的一个陶罐——罐里发出沉闷的回响，像是有什么活物。"
  ],pace:"light",
  options:[
    {t:"请她看看你的旧伤",check:{a:"CON",sk:"医疗",label:"问诊"},tier:{
      ok:["她让你脱了上衣，枯瘦的手在你肩胛的旧伤上按了按：「陈年寒伤，北边的风钻进骨头里了。」她调了一碗黑乎乎的糊药敷上，凉意透进骨缝，「三日后即愈。草原的药，比学院的符咒实在。」"],
      fail:["她看了半天：「……你这伤，我治不了。」你心头一紧，她又慢悠悠补了一句，「因为根本没好利索过。多喝热水，别逞强。」"],
      crit:["她不仅治了你的旧伤，还顺手点拨了你一个运气法门——你感觉四肢百骸暖洋洋的，像是被草原的日头晒透了。她意味深长地补了一句：「你这趟来草原，沾的东西不干净。记着，黑气怕日光。」"]
    },effects:{hp:15,xp:20},go:"orc_deep_market"},
    {t:"问陶罐里装着什么",check:{a:"INT",sk:"lore",label:"询问"},tier:{
      ok:["她沉默了一会儿：「那是祖灵的『旧声音』。」她掀开罐盖，里面是一捧灰烬——「三个月前，祖灵洞的圣火突然熄灭了一瞬。我接住了落下来的火星，养在罐里。」她盯着你，「它还在烧。只是，烧得很慢，很暗。」"],
      fail:["「陶罐里？」她摇摇头，「装的是药。你打听这个做什么？」她不肯再多说,"],
      crit:["她让你凑近看。灰烬深处，确实有一点极暗的红光，像将熄未熄的炭。「祖灵的圣火，是我这一脉萨满的命。它暗下去那天，我就知道——有别的眼睛，在看草原了。」她看着你，「你见过那种眼神吗？黑的，竖瞳。」"]
    },effects:{xp:25,flag:"witch_secret"},go:"orc_deep_gate"},
    {t:"（谢过巫医，离开巫医帐）",go:"orc_deep_gate"}
  ]
,
  ifFlag: {"oracle_fake": ["巫医帐里，老兽人抬起浑浊的眼睛，看了你很久。她没提神谕的事——你识破假神谕那晚，火堆边的争吵她都听见了。她只把一只陶罐往你面前推了推：「喝吧，草原不欠识破谎言的人。」"]}};
N["orc_deep_hunt"] = {
  place:"兽人草原 · 黑石部族营地外 · 草原猎场", where:"白昼",
  text:[
    "出了营地往北，草原辽阔得像是没有尽头。风从草尖上滚过去，带来远方的腥气。",
    "你跟着一队年轻的兽人猎手出来打猎——这是草原的规矩：外来者想被接纳，最好的办法是跟着打一次猎。",
    "带队的猎手是个沉默的年轻兽人，他指了指远处一群灰影：「野羊群。今天风往北吹，我们绕到下风头。」",
    "他的眼神忽然一凝：「等等。」",
    "他蹲下身，摸了摸地上的草。草叶上，有一道焦黑的痕迹——像是什么滚烫的东西碾过去，把草尖烫死了。"
  ],pace:"normal",
  options:[
    {t:"查看那道焦痕",check:{a:"INT",sk:"侦察",label:"勘察"},tier:{
      ok:["你蹲下来细看：焦痕笔直，延伸向东北方向，草叶不是烧焦，而是枯萎——像是被抽干了生机。年轻猎手脸色变了：「这不是火。是『死』。」","他低声说：「三个月前开始，草原上时不时出现这种痕迹。长老们说是旱灾。可旱灾不会只死一条线。」"],
      fail:["你看了半天，只看出草确实枯了。猎手没多说，带队绕开了那道痕迹。"],
      crit:["你顺着焦痕走了半里，在尽头发现半枚蹄印——马蹄铁是北境军制的，但蹄印周围的草同样枯萎。你心里一沉：这东西，不是从草原来的。","你回头，把『北境马蹄印+枯萎痕迹』记在心上。草原的『旱灾』，恐怕有另一头。"]
    },effects:{xp:20,flag:"dead_trail"},go:"orc_deep_feast"},
    {t:"专心打猎，射下一头野羊",check:{a:"AGI",sk:"弓术",label:"射猎"},tier:{
      ok:["你拉弓的手稳得不像话，一箭放倒一头公羊。年轻猎手吹了声口哨：「好箭！今晚的宴火，有你一份肉！」草原上，猎物是最硬的身份证明。"],
      fail:["你一箭射空，箭插在草里。猎手没笑话你，只是补了一箭：「草原的猎手，第一箭都是喂风的。」"],
      crit:["你一箭双雕，两头野羊倒地。猎手们轰然叫好，几个年轻兽人把你扛起来抛了两下——你听见有人用部族语喊：「这个人类，是狼养大的！」"],
      critfail:["你的弓弦在关键时刻崩断了。猎手默默递给你一把备用的：「草原的弓，认主人的手。你的手，还差一点。」"]
    },effects:{gold:15,xp:15,infl:{orc:10}},go:"orc_deep_feast"}
  ]
,
  ifRelation: {"npc": "orc_graymane", "op": ">=", "val": 60, "yes": ["猎手们听说你跟灰鬃出过猎，一路上没人拿你当外人。一个年轻兽人甚至把追猎的位置让给你——在草原，这份让，是把命交到你手上的意思。"]}};
N["orc_deep_trail"] = {
  place:"兽人草原 · 圣山脚下 · 猎人小道", where:"晨",
  text:[
    "圣山脚下有一条猎人踩出来的小道，曲曲折折通向山腰。清晨的雾气还没散，草叶上挂着露珠。",
    "你沿着小道往上走，忽然听见路边灌木丛里有响动。你拨开草叶——一个兽人少年蹲在灌木后，正小心翼翼地用石片刮一块树皮。",
    "他抬头看见你，先是警惕地往后缩，然后又想起什么似的，眼睛亮起来：「你是那个会打猎的人类！」",
    "他压低声音：「我想问个事……他们说，山下集市里的『顾问』会发盐。可我妈说，不能拿。」",
    "「为什么不能拿？」你问。",
    "少年认真地说：「我妈说，草原的盐，该从草原的土地里长出来。别人给的盐，是要拿刀还的。」"
  ],pace:"normal",
  options:[
    {t:"告诉少年，他母亲说得对",check:{a:"CHA",sk:"说服",label:"教诲"},tier:{
      ok:["你蹲下来，认真地对他说：「你母亲说得对。草原的刀，不该为了别人的盐出鞘。」少年似懂非懂地点点头，把树皮收进怀里，「那我跟阿妈说，今天不去领盐了。」"],
      fail:["少年眨眨眼：「可是……阿妈说归说，部落里好多人都去领了。」他有点困惑，「要是大家都不领，是不是就没人跟顾问说话了？」"],
      crit:["你不仅告诉他不要领盐，还教了他一个道理：「真正值钱的东西，从来不用别人施舍。草原的狼，自己捕食。」少年若有所思，忽然咧嘴笑了：「你说话，像大萨满。」"]
    },effects:{xp:15,infl:{orc:5}},go:"orc_deep_totem"},
    {t:"（不多说，继续往圣山走）",go:"orc_deep_totem"}
  ]
};
N["orc_deep_totem"] = {
  place:"兽人草原 · 圣山 · 图腾林", where:"白昼",
  text:[
    "祖灵洞下方有一片图腾林。几十根图腾柱立在那里，每一根都刻着不同的兽纹——狼、熊、鹰、蟒……柱脚堆着祭品：兽骨、干肉、磨亮的兽牙。",
    "一个年轻的萨满学徒正在给一根新柱子上色。他看见你，停下手里的活，语气平淡：",
    "「外人很少走到这里。祖灵洞在上面，萨满的修行在下边——你走错路了，还是故意来的？」",
    "他的手腕上，也系着一根细绳。不是红绳——是灰白色的，像是某种骨制的。"
  ],pace:"normal",
  options:[
    {t:"问那根灰白细绳的来历",check:{a:"INT",sk:"lore",label:"询问"},tier:{
      ok:["学徒低头看了看手腕：「这是『旧绳』——大萨满亲手编的，萨满一脉每人一根，从祖灵洞的圣火边取来。」他顿了顿，「红绳是『顾问』发的。旧绳是祖灵给的。草原的萨满，认得清哪个是哪个。」"],
      fail:["「这个？」学徒摇头，「不告诉你。萨满的事，不能随便说给外人听。」"],
      crit:["学徒犹豫了一下，压低声音：「大萨满说，旧绳要是断了一根，就说明有一个萨满，倒向了『顾问』那边。上个月，北边猎手部族的老萨满，绳子断了。」","他盯着图腾柱，「草原的萨满，快要站队了。」"]
    },effects:{xp:20,flag:"shaman_rope"},go:"orc_deep_gate"},
    {t:"在图腾林静立片刻，感受祖灵的气息",check:{a:"SPR",sk:"冥想",label:"静思"},tier:{
      ok:["你在图腾柱间站定，闭上眼。风穿过柱子发出呜呜的声响——像某种古老的共鸣。恍惚间，你听见一声极远的狼嚎，然后是很多很多声音叠在一起，最后汇成一个念头：『别让刀出鞘。』"],
      fail:["你站了半天，只觉得风大。图腾柱上的兽纹，沉默地看着你。"],
      crit:["你站得越久，听得越清楚。那声音比风声更近，像贴着耳朵说：『山还醒着。火还亮着。草原的根，扎在土里。告诉大汗——』声音在这里断了，像被什么东西掐断。","你睁开眼，后背出了一层冷汗。你知道那不是幻觉。"]
    },effects:{xp:25,flag:"totem_vision"},go:"orc_deep_gate"},
    {t:"（离开图腾林，回营地）",go:"orc_deep_gate"}
  ]
,
  ifFlag: {"oracle_fake": ["图腾林里的风比上次更沉。你识破假神谕的事传到了圣山——柱子上的兽纹在日光里一动不动，可你总觉得，它们这次是在打量你，而不是盯着一个外乡人。"]}};
/* ===== PE-1 支线 · 灰鬃之刀（npc=orc_graymane，狼骑队长，4 节点 65 挚友） ===== */
N["orc_w_enter"] = {
  place:"兽人草原 · 黑石部族营地 · 狼骑兵营", where:"白昼",
  text:[
    "狼栏后面有一顶不起眼的帐篷。你掀帘进去，一个兽人正坐在矮凳上，用一块油布反复擦拭一把长刀。",
    "他的脸比门外那个战士还多一道疤，横过鼻梁，把整张脸分成两半。但他抬眼时，目光却出人意料地平静。",
    "「灰鬃。」他开口，声音低沉，「黑石大汗的义子，狼骑兵的队长。」他打量你，「独眼婆子说，你懂行情。集市上那半日，你把草原的盐价问了个遍——你在查什么？」",
    "他把刀横在膝上。刀鞘上，红绳系得很紧。"
  ],pace:"normal",
  options:[
    {t:"直言相告：你在查『南边的顾问』和红绳",run:function(){changeRelation('orc_graymane',10,'狼骑营坦诚相见'); curNode='orc_w_step1'; writeNext();}},
    {t:"反问他：狼骑兵为什么也系红绳",check:{a:"CHA",sk:"说服",label:"反问"},tier:{ok:["灰鬃低头看了看刀鞘上的红绳，忽然伸手，把绳子解下来，扔进火盆。绳子在火里卷曲，发出一股焦味。「红绳是『顾问』发的，系上的人，能领盐和铁。」他看着火焰，「可狼骑兵的刀，不系别人的绳子。」","他重新看向你，「看来你是真在查。坐吧——我也有事要问你。」"]},run:function(){changeRelation('orc_graymane',10,'狼骑营试探'); curNode='orc_w_step1'; writeNext();}},
    {t:"（暂不深谈，告辞离开）",go:"orc_deep_wolf"}
  ]
,
  ifRelation: {"npc": "orc_graymane", "op": ">=", "val": 60, "yes": ["你掀帘进去，灰鬃没抬头就知道是你。「坐。」他把油布往旁边一推，长刀搁在膝上，语气比上次熟稔得多——那是把你看成自己人的口吻。"]}};
N["orc_w_step1"] = {
  place:"兽人草原 · 黑石部族营地 · 狼骑兵营", where:"入夜",
  text:[
    "入夜后，灰鬃带你到狼栏后的空地上。月光下，十几头灰狼静静蹲着，绿眼睛齐刷刷转向你们。",
    "「三个月前，我带队巡逻到草原北缘，撞见一队『顾问』的马车。」灰鬃的声音很平，「车辙很深。我让人跟着车辙走——走到一片焦黑的荒地，草都枯死了，车辙消失的地方，立着半截没建完的石塔。」",
    "「不是骨塔。」他强调，「是石塔。石头是北境的青石，运到草原北缘，只为了建半截塔。」",
    "他转头看着你：「大汗不信。长老们说那是旱灾。可我的狼，从那片荒地路过时，不肯再往前走一步。」",
    "「狼的鼻子，比萨满的耳朵更诚实。」"
  ],pace:"normal",
  options:[
    {t:"提出陪他去北缘实地查探",run:function(){changeRelation('orc_graymane',15,'同赴北缘查探'); curNode='orc_w_step2'; writeNext();}},
    {t:"问他：那石塔是什么人建的",check:{a:"INT",sk:"lore",label:"追问"},tier:{ok:["灰鬃摇头：「不知道。但青石上刻着一个印记——一个竖瞳。」他顿了顿，「我见过那个印记。三个月前，『顾问』第一次进草原时，马车的帘子被风吹起一角，我看见了——马车里那个黑袍人，袖口上就绣着这个印记。」","他盯着你，「自由城邦的下水道，铁门关的黑烟，草原北缘的石塔——都是同一个印记。你们人族管它叫什么？」"]},run:function(){changeRelation('orc_graymane',15,'交换竖瞳情报'); curNode='orc_w_step2'; writeNext();}},
    {t:"（沉吟片刻，说改日再来）",go:"orc_deep_wolf"}
  ]
};
N["orc_w_step2"] = {
  place:"兽人草原 · 草原北缘 · 枯地石塔", where:"夜",
  text:[
    "你随灰鬃策狼北行大半日，在夜幕降临时抵达那片枯地。",
    "月光下，半截石塔立在荒草中央。青石垒成，塔身没到一人高，顶面平整——像是被什么硬生生拦腰截断的。",
    "塔基周围，你看见几个深深的、焦黑的印记——和猎场上那道枯痕一模一样。",
    "灰鬃跳下狼背，蹲在塔前，用手指抹了一下塔身的青石。他凑近闻了闻，眉头拧起来：",
    "「有血味。很淡，但很旧——像是这座塔，用血浇过地基。」",
    "他抬起头，月光在他脸上的刀疤上投下阴影：「你说，草原的刀该不该出鞘？我现在有点怀疑——刀出鞘之前，握着刀的人，是不是已经被人换了。」"
  ],pace:"normal",
  options:[
    {t:"劝他先不要声张，把证据带回去给大萨满",run:function(){changeRelation('orc_graymane',20,'北缘取证·信任'); curNode='orc_w_end'; writeNext();}},
    {t:"提议直接去铁门关方向，追查石塔的来路",check:{a:"AGI",sk:"生存",label:"追踪"},tier:{ok:["你蹲下身，在塔基周围找到半枚向北的蹄印——马蹄铁是北境军制的。你把这个发现指给灰鬃看。他沉默片刻：「北境的军马，草原的塔，『顾问』的红绳……这盘棋，比我想的大。」","他最终点头：「先回去。证据在手，大汗面前，我还能说上一句话。」"]},run:function(){changeRelation('orc_graymane',20,'追踪北境蹄印'); curNode='orc_w_end'; writeNext();}},
    {t:"（保持沉默，等他做决定）",run:function(){changeRelation('orc_graymane',10,'并肩静默'); curNode='orc_w_end'; writeNext();}}
  ]
};
N["orc_w_end"] = {
  place:"兽人草原 · 黑石部族营地 · 狼骑兵营", where:"晨",
  text:[
    "天亮时你们回到营地。灰鬃没有立刻去找大汗，而是先去了祖灵洞。",
    "你在洞外等了很久。他出来时，脸上没什么表情，但腰间的刀鞘——红绳不见了，换上了一根灰白色的旧绳。",
    "「大萨满说，绳子接上了。」他简短地说，「草原的萨满，还认旧绳。」",
    "他把一枚狼牙挂饰抛给你：「狼骑兵认人的信物。草原上，你随时可以来找我——带着它，没人拦你。」",
    "他顿了顿，难得地露出一丝笑意：「人类。草原的刀，暂时还不会出鞘。你功劳不小。」",
    "远处，营地的战鼓声依旧在响——但这一次，那节拍里少了点什么，像是绷紧的弦，松了一丝。",
    "（获得：灰鬃狼牙 · 50 金币 · 40 历练 · 灰鬃好感升至挚友）"
  ],pace:"normal",
  options:[
    {t:"收下狼牙，与灰鬃道别",effects:{gold:50,xp:40,infl:{orc:15}},run:function(){changeRelation('orc_graymane',0,'支线完结（累计65）'); curNode='orc_deep_gate'; writeNext();}},
    {t:"问他：草原接下来会怎样",check:{a:"INT",sk:"lore",label:"询问"},tier:{ok:["灰鬃望着北方：「刀还挂在墙上。但握刀的手，已经知道刀不能乱出了。」他沉默了一会儿，「大萨满说，草原的根还扎在土里。只要根不断，风再大，草也倒不了。」","你离开狼骑兵营时，天已大亮。草原的风，带着晨露的味道。"]},go:"orc_deep_gate"}
  ]
};
N["orc_deep_leave"] = {
  place:"兽人草原 · 黑石部族营地 · 营地门", where:"晨",
  text:[
    "你收拾行装，走到黑石营地的门口。守门的还是那两个兽人战士——这回他们没拦你，只是抱臂站着，冲你点了点头。",
    "「要走了？」左边那个问，「草原的规矩：来过的客人，草原记得。」",
    "右边那个补了一句：「要是哪天你再来——带盐，带铁，带刀。黑石都认。」",
    "你走出营地大门。身后，战鼓声还在响，但草原的风已经换了方向，带着青草和晨露的气息，迎面扑来。"
  ],pace:"normal",
  options:[
    {t:"（离开兽人草原）",run:function(){ travelTo("orc_heishi"); }}
  ]
};

/* /u1inj:data-nodes:dn_u8.js/ */
/* /u8inj:nodes/ U8 · NPC 生态 + 事件池扩充（C3/C4）
   新支线 D/E/F + 3 空白 NPC 线（free_lord / north_king / academy_head）
   全部对象式节点，纯数据，不改引擎；好感度走 changeRelation（既有 API） */
/* ===== 支线 D · 星落海求星（奥薇恩·星语 lv_mage1） ===== */
N["u8_d_enter"]={place:"星落海 · 观星台",where:"夜",text:[
"星落海的观星台上，夜风带着海水的咸味。一个披着星蓝斗篷的女子独自坐着，指尖捻着一枚发亮的星屑——奥薇恩·星语，北地最负盛名的星象师。",
"她没有回头，却先开口：「你走路的步子很轻，像怕惊动什么。」她指了指身边的石凳，「坐。星子今晚话多，一个人听，浪费了。」",
"你坐下来。她指着海天交界处一颗轻发颤的星：「那颗星，叫“迷途”。它已经三年没有按星图走了。有人说它要坠落，可它一直在那里。」",
"她侧过头看你，眼神清亮如星：「你相信星辰从不说谎吗？」"
],pace:"normal",options:[
{t:"相信——星辰只说还没说完的话",run:function(){changeRelation('lv_mage1',10,'星落海结识奥薇恩'); curNode='u8_d_riddle'; writeNext();}},
{t:"不太信——星象不过是人编的",go:"u8_d_skeptic"},
{t:"（先告辞，改日再来）",go:"arrive_south_xueshu"}
]};
N["u8_d_riddle"]={place:"星落海 · 观星台",where:"夜",text:[
"奥薇恩闻言笑了笑了：「好，那你替我解一道星谜。」她指尖一划，星屑在夜空中连成一线，「“无翼而飞，无足而行，无口而鸣”——这是星图第三卷上的旧谜。解开了，我把那枚星屑送给你。」",
"你盯着那道由星屑连成的线，冥思苦想。海风卷起斗篷的边角，远处传来灯塔的雾号。"
],pace:"light",options:[
{t:"（凝神推演，以智破谜）",check:{a:"INT",sk:"星象"},then:"u8_d_riddle_ok",go:"u8_d_riddle_ok"},
{t:"（凭直觉作答）",check:{a:"CHA",sk:"说服"},then:"u8_d_riddle_ok",go:"u8_d_riddle_ok"},
{t:"（承认解不开，请教于她）",go:"u8_d_riddle_hint"}
]};
N["u8_d_riddle_ok"]={place:"星落海 · 观星台",where:"夜",text:[
"你心头灵光一闪：「是潮汐。潮水无翼而飞、无足而行、无口而鸣——它日夜奔涌，从不问岸。」",
"奥薇恩的眼中亮起真正的光：「……潮汐。星图第三卷写的是“海”，可一百年来无人往海里想。」她将那枚星屑郑重放在你掌心，「你解开了它。这枚星屑，是你的了。」",
"「我在星落海等一颗星等了三年，今天终于等到一个能听懂星辰的人。」她的声音比刚才柔和了许多。"
],pace:"normal",options:[
{t:"（接下星屑，与她同观一夜星）",run:function(){changeRelation('lv_mage1',15,'解开星谜'); curNode='u8_d_sea'; writeNext();}},
{t:"（谢过她，告辞离去）",go:"u8_d_leave"}
]};
N["u8_d_riddle_hint"]={place:"星落海 · 观星台",where:"夜",text:[
"你坦然摇头：「我解不开。」",
"奥薇恩没有笑话你：「知道解不开还肯说出来，比假装明白的人强。」她指着海面，「答案不在天上，在海里。潮汐——无翼而飞，无足而行，无口而鸣。」",
"「记住这个答案。星谜最难的地方不是谜面，是解谜的人肯不肯往没想过的地方看。」她望向你，眼底多了些东西。"
],pace:"light",options:[
{t:"（受教，谢过她）",run:function(){changeRelation('lv_mage1',15,'受教于奥薇恩'); curNode='u8_d_sea'; writeNext();}}
]};
N["u8_d_leave"]={place:"星落海 · 观星台",where:"夜",text:[
"你起身告辞。奥薇恩没有挽留，只是望着海天交界处那颗“迷途”之星：「你走后，星子又要一个人说话了。」",
"走出几步，你听见身后传来她极轻的叹息。那声叹息，像一根细弦，指尖一拨了一下你的心。"
],pace:"light",options:[
{t:"（转身回来，陪她看这一夜）",run:function(){changeRelation('lv_mage1',15,'回头陪她望星'); curNode='u8_d_sea'; writeNext();}},
{t:"（继续离开）",go:"arrive_south_xueshu"}
]};
N["u8_d_sea"]={place:"星落海 · 观星台",where:"夜",text:[
"你留下来，陪她看了一夜的星。她讲星图，讲潮汐，讲那些陨落的、被遗忘的星的名字——每一颗星，她都记得。",
"天快亮时，她说：「三年前，我师父在这里望星，说要等一颗“新生之星”。他没等到，就走了。」她把斗篷的领子拢了拢，「我替他接着等。」",
"你忽然明白，她等的不是星，是一个让她相信「等待有意义」的理由。"
],pace:"light",options:[
{t:"「那我们一起等。」",run:function(){changeRelation('lv_mage1',20,'同观一夜星'); curNode='u8_d_end'; writeNext();}},
{t:"「也许那颗星，要的是你自己去找。」",run:function(){changeRelation('lv_mage1',20,'赠她一句话'); curNode='u8_d_end'; writeNext();}}
]};
N["u8_d_end"]={place:"星落海 · 观星台",where:"黎明",text:[
"奥薇恩怔了一下，随即笑了——那笑容比星屑还亮。她从怀中取出一枚银色的指环，戒面嵌着一粒碎星：「这枚“星语”，是我师父留给我的。它认人——你替我守着它，比守在我这里有用。」",
"她将指环套进你的手指，指尖微凉：「潮汐不会停，星子不会说谎。你走你的路，迷路的时候，看看它。」",
"晨光中，她朝你挥了挥手。你低头看那枚指环，碎星在戒面里轻流转——仿佛那夜所有的星光，都被收进了这一粒里。"
],pace:"normal",options:[
{t:"（戴上星语指环，告别星落海）",run:function(){changeRelation('lv_mage1',20,'星语指环之约'); S.gold=(S.gold||0)+50; S.exp=(S.exp||0)+40; if(!S.items)S.items={}; S.items['star_ring']=(S.items['star_ring']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.d=4; curNode='u8_d_finish'; writeNext();}}
]};
N["u8_d_finish"]={place:"星落海 · 观星台",where:"黎明",text:[
"你走下观星台，海风迎面吹来，带着新一天的味道。指间的星语指环发出淡光，像一盏不会熄灭的灯。",
"（获得：星语指环 · 50 金币 · 40 历练 · 奥薇恩·星语好感升至挚友）"
],pace:"light",options:[
{t:"（返回星落海市集）",go:"arrive_south_xueshu"}
]};
N["u8_d_skeptic"]={place:"星落海 · 观星台",where:"夜",text:[
"奥薇恩没有生气，只是望着星空：「人编的星象，编不出这样的潮汐。三百年了，潮汐从没有误过一天。」",
"「你不信星辰，没关系。可你今晚来了这里——来听星子说话的人，心里总有一块地方，是信着什么的。」她笑了笑，「那块地方，藏不住。」"
],pace:"light",options:[
{t:"（被她看穿，默然片刻）",go:"u8_d_sea"}
]};
/* ===== 支线 E · 铜夜枭（杜·夜枭 lv_thief1） ===== */
N["u8_e_enter"]={place:"帝京 · 夜枭巷",where:"夜",text:[
"帝京的夜枭巷是这座城最深的影子——没有灯，只有脚步声。你在巷口站定，一个身影无声地从檐上落下来，斗篷边缘绣着一只铜色的夜枭。",
"「外乡人？」杜·夜枭的声音听不出年纪，「这条巷子，白天没人来，夜里来的人，不是来找死的，就是来找夜枭的。你是哪一种？」",
"月光照不到他的脸，只有那枚铜夜枭在他领口泛着冷光。"
],pace:"light",options:[
{t:"「我是来学规矩的。」",run:function(){changeRelation('lv_thief1',10,'夜枭巷结识'); curNode='u8_e_note'; writeNext();}},
{t:"「我是来谈生意的。」",go:"u8_e_business"},
{t:"（告辞，离开夜枭巷）",go:"arrive_east_chengtian"}
]};
N["u8_e_business"]={place:"帝京 · 夜枭巷",where:"夜",text:[
"「谈生意？」夜枭低低笑了一声，「这条巷子的生意，只有两种：偷来的，和不该知道的。你想做哪一种？」",
"他偏了偏头：「我不管你怎么找到我的。规矩先讲清楚——影子里的规矩，比阳光下的更严。坏了规矩的人，会从这条巷子里消失。」"
],pace:"light",options:[
{t:"「规矩我懂。先替你做一件事。」",run:function(){changeRelation('lv_thief1',10,'夜枭巷定约'); curNode='u8_e_note'; writeNext();}},
{t:"（放弃生意，告辞）",go:"arrive_east_chengtian"}
]};
N["u8_e_note"]={place:"帝京 · 夜枭巷",where:"夜",text:[
"夜枭沉默了片刻，从怀里取出一封封着黑蜡的信：「城南的旧钟楼，三更，把这封信塞进钟楼底层西侧第三块砖的缝里。不许看，不许问，不许回头。」",
"「做完这件事，你就入了影子的门。」他把信递过来，「当然——你也可以现在就走，当今晚没见过我。」"
],pace:"light",options:[
{t:"（接下信，依言送往旧钟楼）",check:{a:"AGI",sk:"潜行"},then:"u8_e_note_ok",go:"u8_e_note_ok"},
{t:"（接下信，但偷看了封蜡）",check:{a:"INT",sk:"侦察"},then:"u8_e_peek",go:"u8_e_peek"},
{t:"（把信还给他，告辞）",go:"arrive_east_chengtian"}
]};
N["u8_e_note_ok"]={place:"帝京 · 城南旧钟楼",where:"夜",text:[
"你穿过帝京的夜，把信塞进了旧钟楼第三块砖的缝里。你走得很快，没有回头。",
"回巷子时，夜枭坐在原来的位置，像一直没动过：「做得干净。影子需要你这样的人。」他从怀里摸出一枚铜夜枭——和你在他领口看到的一模一样，「拿着。从今天起，夜枭巷认你。」",
"你接过那枚铜夜枭，沉甸甸的，冰凉的，像一枚印。"
],pace:"light",options:[
{t:"（收下铜夜枭）",run:function(){changeRelation('lv_thief1',15,'送信入影'); curNode='u8_e_job'; writeNext();}},
{t:"（婉拒，只问一个消息）",run:function(){changeRelation('lv_thief1',15,'夜枭巷问讯'); curNode='u8_e_job'; writeNext();}}
]};
N["u8_e_peek"]={place:"帝京 · 城南旧钟楼",where:"夜",text:[
"你借着月色偷看了封蜡下的一角——只来得及看清一个名字：“塞壬”。你压下心跳，把信塞进砖缝。",
"回到夜枭巷，夜枭静静看着你：「你看了。」不是问句。",
"「但这封信本来就不是秘密——真正要紧的，是看完之后，你还肯不肯把它送出去。」他递过一枚铜夜枭，「影子容得下好奇的人，容不下谎话的人。你刚才没有说谎。」"
],pace:"light",options:[
{t:"（收下铜夜枭，心里记下'塞壬'这个名字）",run:function(){changeRelation('lv_thief1',15,'窥信仍守信'); curNode='u8_e_job'; writeNext();}}
]};
N["u8_e_job"]={place:"帝京 · 夜枭巷",where:"夜",text:[
"「入门的规矩你过了。」夜枭站起身，「现在有一桩正事——城南的丝绸商会明晚有一批“灰货”要走水路。商会的人以为没人知道。我们得在船离港前，把消息递到金衡商会手里。」",
"「为什么帮商会？」他像是看出你的疑问，「因为影子也有底线——走私的盐和铁，会害死边境的人。规矩不是用来保命的，是用来让这城不至于烂透的。」"
],pace:"normal",options:[
{t:"（接下递信的任务）",run:function(){changeRelation('lv_thief1',20,'截灰货保北境'); curNode='u8_e_trust'; writeNext();}},
{t:"（问清楚再答应）",run:function(){changeRelation('lv_thief1',20,'问明原委再应'); curNode='u8_e_trust'; writeNext();}}
]};
N["u8_e_trust"]={place:"帝京 · 金衡商会分号",where:"夜",text:[
"你把消息送进了金衡商会分号的后门。半个时辰后，那批“灰货”被拦在了船坞——商会的人连夜查了账，抓了三个内鬼。",
"天快亮时，夜枭在巷口等你：「消息成了。你救的，是北境几千个等着过冬粮的百姓——那批灰货里混的是私盐，掺了沙的毒盐。」",
"他难得地认真：「我在这条巷子里混了二十年，见过太多人。你——能处。」他从怀里摸出那枚铜夜枭，「这个，本该是入门的信物。但我现在改主意了——它是“朋友”的信物。」"
],pace:"normal",options:[
{t:"（郑重收下铜夜枭）",run:function(){changeRelation('lv_thief1',20,'铜夜枭为凭'); S.gold=(S.gold||0)+50; S.exp=(S.exp||0)+40; if(!S.items)S.items={}; S.items['copper_owl']=(S.items['copper_owl']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.e=4; curNode='u8_e_end'; writeNext();}}
]};
N["u8_e_end"]={place:"帝京 · 夜枭巷",where:"拂晓",text:[
"你接过铜夜枭。它比夜更深，比铁更沉。",
"夜枭背过身，声音像从很远的地方传来：「这条巷子，白天是空的。但你要是有事，巷口第三根柱子底下，留一枚铜板——我就会知道。」",
"「影子里的朋友，是不用名字的。」他顿了顿，「不过你可以叫我——夜枭。」",
"晨光爬上巷口，他消失在阴影里。你低头看掌心那枚铜夜枭——它在晨光里，泛着极淡的、温暖的光。",
"（获得：铜夜枭信物 · 50 金币 · 40 历练 · 杜·夜枭好感升至挚友）"
],pace:"normal",options:[
{t:"（把铜夜枭收进怀里，离开夜枭巷）",go:"arrive_east_chengtian"}
]};
/* ===== 支线 F · 白盾之誓（罗兰·白盾 lv_knight1） ===== */
N["u8_f_enter"]={place:"帝京 · 圣盾广场",where:"白昼",text:[
"圣盾广场中央，一名银甲骑士正在独自练剑。剑光起落，干净利落，不带一丝多余——罗兰·白盾，帝京骑士团里唯一一个名字里没有家族前缀的骑士。",
"他收剑回鞘，朝你走来：「你来看了很久了。练剑的人不怕人看，怕的是看的人有心。」他把剑横在身前，「要不要试试？」"
],pace:"light",options:[
{t:"（接过练习剑，与他比试）",check:{a:"STR",sk:"剑术"},then:"u8_f_duel",go:"u8_f_duel"},
{t:"（摇头，说自己不擅长武艺）",go:"u8_f_ask"},
{t:"（告辞，离开广场）",go:"arrive_east_chengtian"}
]};
N["u8_f_ask"]={place:"帝京 · 圣盾广场",where:"白昼",text:[
"「不擅长武艺，也看得出来你在练什么。」罗兰收剑入鞘，「剑是人的影子。你站在那里看剑，像在看一个人的影子——你有想问的事。」",
"他指了指广场尽头那面斑驳的盾墙：「我的誓约，都刻在那上面。要不要看看？」"
],pace:"light",options:[
{t:"（随他去看盾墙）",run:function(){changeRelation('lv_knight1',25,'圣盾广场结识（含初识）'); curNode='u8_f_oath'; writeNext();}},
{t:"（婉拒，告辞）",go:"arrive_east_chengtian"}
]};
N["u8_f_duel"]={place:"帝京 · 圣盾广场",where:"白昼",text:[
"你接过练习剑。罗兰摆了个起手式：「盾不在手上，在心里。你只管攻来。」",
"剑锋相触的瞬间，你才明白他这句话——他的剑像一面墙，无论你怎么攻，都破不开那层分寸。三招之后，他收剑：「够了。你出手的时候，肩膀先动了——那是心先动了。」",
"「心先动，剑就慢。练剑先练心。」他难得地笑了一下，「你根子不坏。」"
],pace:"light",options:[
{t:"（受教，向他行骑士礼）",run:function(){changeRelation('lv_knight1',25,'剑下受教（含初识）'); curNode='u8_f_oath'; writeNext();}}
]};
N["u8_f_oath"]={place:"帝京 · 圣盾广场 · 盾墙",where:"白昼",text:[
"盾墙上刻着密密麻麻的誓约——有的刻得深，有的已经风化得看不清了。罗兰站在墙前，像站在一面镜子前。",
"「我师父的誓约在这里：“守城，守人，守诺”。他守了一辈子，最后死在南墙下——没有违约，也没有投降。」他顿了顿，「有人说他蠢。可我觉得，这世上总得有人，相信誓言比命重。」",
"他转向你：「我明天要去北境——铁门关外有个村子，被人屠了。骑士团派我去查。你要不要，一起？」"
],pace:"normal",options:[
{t:"（愿随行）",run:function(){changeRelation('lv_knight1',20,'同赴铁门关'); curNode='u8_f_road'; writeNext();}},
{t:"（问他为何选我同去）",go:"u8_f_why"}
]};
N["u8_f_why"]={place:"帝京 · 圣盾广场 · 盾墙",where:"白昼",text:[
"「为什么选你？」罗兰想了想，「因为你站在盾墙前看誓约的时候，没有像别人一样念出来——你在读，在读一个死人留下的东西。读誓约的人，才守得住誓约。」",
"「再说了——」他拍了拍剑柄，「能跟我过三招的人，不多。」"
],pace:"light",options:[
{t:"（同意随行）",run:function(){changeRelation('lv_knight1',20,'应下同行'); curNode='u8_f_road'; writeNext();}}
]};
N["u8_f_road"]={place:"北境 · 铁门关外",where:"暮色",text:[
"你们赶了三天的路，来到那个被屠的村子。火已经灭了，灰还在。罗兰蹲下来，一具一具地看尸体的伤口——「不是盗匪。是正规军的手法，利落、干净、不留活口。」",
"他站起来，望着北边：「这活，不是骑士团的人干的，就是有人穿着骑士团的甲干的。我得查清楚——盾牌不能被脏手碰。」",
"那一夜，他坐在村口的磨盘上擦盾，擦了一夜。晨光里，他说：「要是查到最后，是骑士团里的人——我也会把他揪出来。誓约不认亲戚。」"
],pace:"normal",options:[
{t:"（把干粮和水递给他）",run:function(){changeRelation('lv_knight1',20,'白盾誓印之约'); S.gold=(S.gold||0)+50; S.exp=(S.exp||0)+40; if(!S.items)S.items={}; S.items['oath_seal']=(S.items['oath_seal']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.f=4; curNode='u8_f_end'; writeNext();}}
]};
N["u8_f_end"]={place:"北境 · 铁门关外",where:"黎明",text:[
"罗兰接过干粮，怔了一下，随即笑了：「你这个人，会看剑，会读誓约，还知道给人递干粮——骑士团里缺你这样的人。」",
"他从盾内侧取下一枚小银牌，上面刻着一面白盾：「这枚“誓印”，是骑士团的信物。它不认家族，不认出身——只认誓言。你拿着。将来你若要人帮你守什么，凭它，帝京骑士团会应你一次。」",
"「铁门关的风真大。」他望着关墙，「但风再大，也吹不动刻在石头上的字。走吧——回帝京，查那笔烂账。」",
"你收好誓印。晨光落在他的银甲上，那面白盾亮得耀眼。",
"（获得：白盾誓印 · 50 金币 · 40 历练 · 罗兰·白盾好感升至挚友）"
],pace:"normal",options:[
{t:"（随他踏上回帝京的路）",go:"arrive_east_chengtian"}
]};
/* ===== NPC 线 G · 北境之王（north_king） ===== */
N["u8_nk_enter"]={place:"北境 · 王庭",where:"白昼",text:[
"北境王庭不像帝京的宫殿那样金碧辉煌——它是用灰石砌的，墙上挂着猎来的兽皮和旧战旗。王座上坐着一个头发花白的老人，正是北境之王。",
"他抬起眼，眼神像鹰一样锐利：「铁门关外的信，是你带来的？」他指了指案上那封被雪水浸皱的信，「边境的村子，已经有三个月没有粮种了。你是从南边来的——南边的人，还记不记得北境？」"
],pace:"normal",options:[
{t:"「记得。我就是为这个来的。」",run:function(){changeRelation('north_king',15,'觐见北境王'); curNode='u8_nk_plea'; writeNext();}},
{t:"「北境的苦，南边确实知道得少。」",go:"u8_nk_truth"},
{t:"（行礼告辞）",go:"arrive_north_aierda"}
]};
N["u8_nk_truth"]={place:"北境 · 王庭",where:"白昼",text:[
"北境之王沉默了一会儿，点了点头：「你说了实话。南边不知道北境的苦——这不是谁的错，是雪把路隔断了。但路断了，人心不能断。」",
"他站起身，走到地图前，手指按在铁门关：「粮种要从这里过。可这条路上，有山贼、有雪崩、有不愿意放行的关卡。你要是有心，替我走一趟。」"
],pace:"light",options:[
{t:"（接下运粮种的任务）",run:function(){changeRelation('north_king',15,'领下粮种之托'); curNode='u8_nk_plea'; writeNext();}}
]};
N["u8_nk_plea"]={place:"北境 · 王庭",where:"白昼",text:[
"「粮种。」北境之王重复了一遍这个词，声音沉下来，「去年冬天，北境饿死了三千人。三千——南边一个城一天的生意的数目。我数不过来。」",
"他走到你面前，那双鹰一样的眼睛直直看着你：「我老了，这把剑提不动了。但北境不能没有粮。你替我走一趟河湾城，把粮种带回来——路上的人情世故，你自己应付。」",
"「你愿意吗？这一路，可能要拿命去换。」"
],pace:"normal",options:[
{t:"「愿意。」",run:function(){changeRelation('north_king',15,'应下护粮'); curNode='u8_nk_road'; writeNext();}},
{t:"「王上，可有人能护送粮种？」",go:"u8_nk_escort"}
]};
N["u8_nk_escort"]={place:"北境 · 王庭",where:"白昼",text:[
"「护送的人？」北境之王笑了笑，笑得有些苦，「北境的兵，都在铁门关。能腾出来护粮的，只有几个老卒——和一把老骨头。」",
"他拍了拍自己的腿：「要是年轻三十年，我自己去。」他望着你，「你肯问这一句，说明你心里已经把这事当成了自己的事。去吧——粮种在河湾城，路在脚下。」"
],pace:"light",options:[
{t:"（领命出发）",run:function(){changeRelation('north_king',15,'领命出王庭'); curNode='u8_nk_road'; writeNext();}}
]};
N["u8_nk_road"]={place:"北境 · 风雪路",where:"风雪",text:[
"你带着粮种车队，在风雪里走了七天。第八天夜里，车队在铁门关外的山谷里被堵住了——十几名山贼拦在路中间，火把在风雪里明灭不定。",
"领头的山贼看着车队：「粮？往北边送粮？你们北境人，自己都快饿死了，还送粮给别人？」他大笑起来，「这车粮，我们收了。」"
],pace:"light",options:[
{t:"（拔剑护粮，寸步不让）",check:{a:"STR",sk:"战斗"},then:"u8_nk_fight",go:"u8_nk_fight"},
{t:"（上前与他讲道理）",check:{a:"CHA",sk:"说服"},then:"u8_nk_talk",go:"u8_nk_talk"}
]};
N["u8_nk_fight"]={place:"北境 · 风雪路",where:"风雪",text:[
"你拔剑挡在车队前。风雪里，剑光和火把的光绞在一起。你身上添了几道口子，但山贼也倒下了几个——剩下的，看着你的眼神变了。",
"领头的山贼吐了一口血沫：「……硬骨头。为了几袋粮，值得吗？」",
"你擦掉嘴角的血：「北境人死了三千。这几袋粮，是让活下来的人活下去的。你说值不值？」",
"山贼们沉默了一阵，领头的挥了挥手：「让开。让他过。」他最后看了你一眼，「北境，有你这样的人，死不了。」"
],pace:"normal",options:[
{t:"（拱手谢过，护粮过关）",run:function(){changeRelation('north_king',35,'风雪护粮（含过路）'); S.gold=(S.gold||0)+80; S.exp=(S.exp||0)+60; if(!S.items)S.items={}; S.items['north_king_令']=(S.items['north_king_令']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.g=4; curNode='u8_nk_end'; writeNext();}}
]};
N["u8_nk_talk"]={place:"北境 · 风雪路",where:"风雪",text:[
"你走上前，没有拔剑，先解下腰间的酒囊递过去：「兄弟，喝口热的。这是河湾城的上好麦酒。」",
"领头的山贼愣了愣，接过酒囊喝了一口：「……好酒。你一个送粮的，哪来的这心思？」",
"你看着他：「我看得出来，你们不是天生的山贼——是饿的。北境的粮，是给活人吃的。你们要是愿意，粮到了铁门关，我替你们跟北境王说一句：山上的兄弟，也有一份。」",
"领头的山贼盯着你看了很久，最后把酒囊扔回来：「……带着你的粮，滚。记住你说的话。」"
],pace:"normal",options:[
{t:"（护粮过关，心里记下这份约定）",run:function(){changeRelation('north_king',35,'风雪护粮守信（含过路）'); S.gold=(S.gold||0)+80; S.exp=(S.exp||0)+60; if(!S.items)S.items={}; S.items['north_king_令']=(S.items['north_king_令']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.g=4; curNode='u8_nk_end'; writeNext();}}
]};
N["u8_nk_end"]={place:"北境 · 王庭",where:"白昼",text:[
"粮种车队抵达铁门关的那天，全城的钟都响了。北境之王站在王庭门口，亲自迎你。",
"他看着车队，看着你身上的伤，半晌没说话。最后他解下腰间一枚铁令，塞进你手里：「北境令。凭它，北境的城门永远为你开。」",
"「你让北境想起了——还有人记得我们。」他用力拍了拍你的肩，声音有些哑，「好孩子。北境欠你一条命。」",
"你攥紧那枚冰凉的铁令。风雪还在吹，但王庭里的炉火，烧得很旺。",
"（获得：北境令 · 80 金币 · 60 历练 · 北境之王的好感）"
],pace:"normal",options:[
{t:"（谢过北境王，走出王庭）",go:"arrive_north_aierda"}
]};
/* ===== NPC 线 H · 学院院长（academy_head） ===== */
N["u8_ah_enter"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"学院的藏书塔是北境最高的建筑。院长室在塔顶——你敲门时，里面传来一个温和的声音：「门没锁。进来吧。」",
"奥雷利安·晨曦坐在堆满书的桌前，银发如雪，视线却清澈得不像老人。他是学院院长，也是北境最博学的人——有人说，他脑子里装着一座图书馆。",
"他放下羽毛笔，看着你：「你来，是问学，还是问路？」"
],pace:"light",options:[
{t:"「问学。」",run:function(){changeRelation('academy_head',15,'藏书塔求问'); curNode='u8_ah_question'; writeNext();}},
{t:"「问路。」",go:"u8_ah_way"},
{t:"（行礼告辞）",go:"north_academy_gate"}
]};
N["u8_ah_way"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"「问路。」奥雷利安笑了，「路是这世上最有趣的东西——每条路都通向一个答案，但走的人不同，答案就不同。」",
"他指了指窗外：「北境的雪每年都落，但雪下面的路，年年都在变。你要走的路，我不能替你走——但我可以告诉你，路上哪里有一块石头，哪里有一眼泉。」",
"他从书架上抽出一卷羊皮纸，递给你：「北境的路志，抄本。上面标了河湾城到铁门关的每一处歇脚点。拿去用。」"
],pace:"normal",options:[
{t:"（收下路志，谢过他）",run:function(){changeRelation('academy_head',15,'受赠路志'); curNode='u8_ah_task'; writeNext();}}
]};
N["u8_ah_question"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"「问学。」奥雷利安的视线亮了亮，「好。那我问你三个问题。」他竖起一根手指——",
"「第一：天为什么是蓝的？」",
"「第二：雪为什么是白的？」",
"「第三：一个人，为什么要读书？」"
],pace:"light",options:[
{t:"（一一作答）",check:{a:"INT",sk:"学识"},then:"u8_ah_answer",go:"u8_ah_answer"},
{t:"（诚实承认自己答不全）",go:"u8_ah_honest"}
]};
N["u8_ah_answer"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"你想了想，答道：「天是蓝的，因为光穿过大气，蓝光散得最远；雪是白的，因为冰晶把所有光都折回来了。至于为什么读书——」你顿了顿，「读书，是让一个人在没有路的地方，也能看见路。」",
"奥雷利安安静地看了你很久。然后他笑了——那笑容让满屋的书都亮了一瞬。",
"「我在这座塔里教了四十年书，你是第三个能答上第三问的人。」他从抽屉里取出一枚银色的书签，「这个，给你。」"
],pace:"normal",options:[
{t:"（收下书签）",run:function(){changeRelation('academy_head',30,'三问皆答（含问学）'); curNode='u8_ah_task'; writeNext();}}
]};
N["u8_ah_honest"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"你坦然道：「天为什么蓝、雪为什么白，我可以去书里查。但人为什么读书——我答不全，我只知道，不读书的时候，人容易糊涂。」",
"奥雷利安点了点头：「答不全，比答错好。我见过太多人，用一句漂亮的答案，把真问题盖住。」",
"他站起身，从书架上抽出一本旧书递给你：「这本《星落海志》，是我年轻时写的。你拿去看——看不懂的地方，再来问我。」",
"「肯说“不知道”的人，才读得进书。」"
],pace:"normal",options:[
{t:"（收下书，谢过他）",run:function(){changeRelation('academy_head',15,'诚答三问'); curNode='u8_ah_task'; writeNext();}}
]};
N["u8_ah_task"]={place:"北境 · 学院藏书塔",where:"白昼",text:[
"「你学问上过得去，路志也拿走了——那我托你一件事。」奥雷利安的神色认真起来，「半年前，藏书塔丢了一卷书：《深渊谱系·残卷》。它不是最值钱的书，但它是唯一一本记录了深渊封印地形的书。」",
"「有人在铁门关外见过它。我不问你怎么拿到——只要它回到塔里，深渊的封印就不会被人拿来当筹码。」他把一枚学院信物放在你手里，「凭它，学院的仓库任你取用。」"
],pace:"normal",options:[
{t:"（接下信物，答应寻书）",run:function(){changeRelation('academy_head',20,'接下寻书之托'); S.exp=(S.exp||0)+40; if(!S.items)S.items={}; S.items['academy_token']=(S.items['academy_token']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.h=4; curNode='u8_ah_end'; writeNext();}}
]};
N["u8_ah_end"]={place:"北境 · 学院藏书塔",where:"黄昏",text:[
"你离开藏书塔前，奥雷利安叫住你：「等一下。」他从书架上取下一册薄薄的手稿，塞进你手里，「这是我四十年来整理的《北境异闻录》抄本——不算珍贵，但路上解闷。」",
"他站在塔顶的窗前，夕阳把他的影子拉得很长：「学问这条路，我走了四十年，越走越觉得自己知道得少。你年轻——你替我再多走几年。」",
"你握着手稿和信物走下塔。风从塔顶吹下来，带着墨水和旧纸的味道。",
"（获得：学院信物 · 《北境异闻录》抄本 · 40 历练 · 学院院长奥雷利安的好感）"
],pace:"normal",options:[
{t:"（走出学院大门）",go:"north_academy_gate"}
]};
/* ===== NPC 线 I · 自由港执政官（free_lord） ===== */
N["u8_fl_enter"]={place:"自由城邦 · 执政厅",where:"白昼",text:[
"自由城邦没有王，只有执政厅——七位商会代表轮流执政，每一任三年。这一任的执政官，是个鬓角花白的中年人，据说年轻时跑过商、出过海、赔光过三次身家。",
"他坐在堆满账册的桌后，抬头看你：「来自由城邦的人，十有八九是来做生意的。你看着不像——你像是来问“自由城邦到底自由在哪”的。」他笑了，「问得好。坐下说。」"
],pace:"light",options:[
{t:"「我想知道，城邦靠什么活。」",run:function(){changeRelation('free_lord',15,'执政厅拜会'); curNode='u8_fl_proposal'; writeNext();}},
{t:"「我想看看执政厅怎么运转。」",go:"u8_fl_view"},
{t:"（行礼告辞）",go:"arrive_free_gonghui"}
]};
N["u8_fl_view"]={place:"自由城邦 · 执政厅",where:"白昼",text:[
"执政官领你看了一圈执政厅——没有王座，只有七把围成一圈的椅子，每把椅子背后挂着一面不同的商会旗。",
"「七把椅子，谁也不能说了算。」他指了指中间那把空椅子，「那是给“提新约的人”留的。自由城邦的规矩是：只要你的提议能让六家商会点头，你就是这七把椅子的第八把。」",
"他看你一眼：「怎么样，想不想试试坐那把椅子？」"
],pace:"normal",options:[
{t:"「想。」",run:function(){changeRelation('free_lord',15,'想坐那把空椅'); curNode='u8_fl_proposal'; writeNext();}}
]};
N["u8_fl_proposal"]={place:"自由城邦 · 执政厅",where:"白昼",text:[
"「好。」执政官把一份卷宗推到你面前，「这是城邦今年最大的麻烦：河湾城到自由港的商路，今年被抢了十七次。镖局要加价，商队要改道，再这样下去，城邦的粮价要翻。」",
"「你要是能拿出一个让六家商会都点头的章程——」他敲了敲卷宗，「这把空椅子，就是你的。」"
],pace:"light",options:[
{t:"（通读卷宗，草拟章程）",check:{a:"INT",sk:"商道"},then:"u8_fl_deal",go:"u8_fl_deal"},
{t:"（坦言自己不善文墨，请他指点）",go:"u8_fl_advice"}
]};
N["u8_fl_advice"]={place:"自由城邦 · 执政厅",where:"白昼",text:[
"「不善文墨？」执政官哈哈大笑，「你以为商路是靠笔墨通的？是靠跑——靠一双脚，把每一家商号的门都敲一遍。」",
"他站起来：「章程我来拟，你去跑。河湾城的老铁匠、港口城的船行、金衡商会的账房——你挨个去问一句：“路要通，得怎么办？”把答案带回来。」",
"「跑回来的答案，比写出来的章程值钱。」"
],pace:"light",options:[
{t:"（依言去跑商号）",run:function(){changeRelation('free_lord',15,'跑遍七家商号'); curNode='u8_fl_deal'; writeNext();}}
]};
N["u8_fl_deal"]={place:"自由城邦 · 执政厅",where:"夜",text:[
"你把七家商号的答案带回了执政厅：老铁匠说路要修、船行说要护、账房说要记账、镖局说要分利……每一家，都有自己的道理。",
"执政官听完，久久没有说话。最后他开口：「七家商号，七个答案。但你把它们带回来了——这就是章程。」",
"他走到那把空椅子前，拍了拍椅背：「明天，我在执政厅宣布：自由城邦的新商约，由你来提。」他压轻声音，「做好准备——六家商会，会把你问个底朝天。你要是撑得住，从明天起，你就不只是外乡人了。」"
],pace:"normal",options:[
{t:"（吸了口气，答应下来）",run:function(){changeRelation('free_lord',35,'立新商约（含跑商号）'); S.gold=(S.gold||0)+60; S.exp=(S.exp||0)+50; if(!S.items)S.items={}; S.items['freeport_token']=(S.items['freeport_token']||0)+1; if(!S.p12Quest)S.p12Quest={a:0,b:0,c:0}; S.p12Quest.i=4; curNode='u8_fl_end'; writeNext();}}
]};
N["u8_fl_end"]={place:"自由城邦 · 执政厅",where:"白昼",text:[
"第二天，七家商会的代表坐在执政厅里，把新商约一条一条地过。你站在那把空椅子旁边，一条一条地答。答到最后一条时，六家商会里最挑剔的银穗商会代表，把笔搁下了：",
"「章程写得不算漂亮——但他是跑过路的。这一条，我们认。」",
"执政官笑了。他把一枚铜质徽章别在你胸前——徽章上刻着一艘张满帆的船：「自由港商会凭证。凭它，自由城邦的城门、船坞、账房，永远对你开。」",
"「你是这把椅子第八位坐上它的人——也是第一位“跑”上来的。」",
"（获得：自由港商会凭证 · 60 金币 · 50 历练 · 自由港执政官的好感）"
],pace:"normal",options:[
{t:"（谢过执政官，走出执政厅）",go:"arrive_free_gonghui"}
]};
/* /u8inj:nodes-end/ */

/* /u1inj:data-nodes:dn_warfront.js/ */
/* /pe3inj:warfront/ PE-3 铁门关战争前线包（政治与战争可玩层）
   全对象式纯数据节点；世界观约束：铁门关主线（新地基/第七枚锚/镇北军秦·长风）已存在，
   本包写战争前线日常/介入层，不碰主线判定；枢机选举/战争阶段沿用 v64 世界设定 */
N["tm_frontline"] = {
  place:"东部王国 · 铁门关外 · 东军前线营地", where:"白昼",
  text:[
    "铁门关东侧的山谷里，东军的营地绵延三里。帐篷与旗帜之间，辎重车碾出深深的车辙。",
    "你在营地边缘站定，一个披甲的东军校尉走过来，上下打量你：",
    "「站住。前线重地，闲人免进。」他顿了顿，「……除非你是军需官要找的『识货人』。」",
    "他朝营地深处努努嘴：「北边来的铁料商、南边来的粮贩子，都往那边帐篷走。你要是有货，有路子，那边谈。」",
    "营地远处，铁门关的城头，隐约可见镇北军的旗帜——两军隔关对峙，战鼓声一阵一阵地传来。"
  ],pace:"normal",
  options:[
    {t:"以商人身份混进军需帐篷",check:{a:"CHA",sk:"bargain",label:"扮商"},tier:{
      ok:["军需帐篷里，一个精瘦的书记官正对着一摞账本皱眉。他看你一眼：「什么货？」你报了个铁料的名头，他眼睛一亮：「北境铁？来得正好——军里收，比市价高两成。」他压低声音，「不过丑话说前头：铁料送到，得先让『顾问』的人过目。」"],
      fail:["书记官翻了翻账本，头也不抬：「铁料？上月刚收过一批。下个月再说。」"],
      crit:["你报出铁料，又随口说了两句南边粮价。书记官抬头多看了你两眼：「行家。」他让左右退开，压低声音，「说实话，军里不缺铁——缺的是『不出声的铁』。你要是认识那种路子，直接去铁门关北坡，找一支挂黑旗的车队。」"]
    },effects:{gold:20,xp:20,flag:"tm_courier_hint"},go:"tm_courier"},
    {t:"假装征夫，混进营里听消息",check:{a:"AGI",sk:"潜行",label:"混营"},tier:{
      ok:["你混在运送辎重的民夫里进了营地，蹲在伙房边听了一下午。消息不少：「镇北军那个秦统领，三个月没露过面了——说是病，可城里有人说不是病。」「东军的粮道，最近老出事。运粮的车队，十天里有三趟到不了。」"],
      fail:["营里盘查比你想的严，你被拦在栅栏外。只得远远听了几句：「围城三个月了……城里的烟囱，冒烟越来越少了。」"],
      crit:["你听到一则关键情报：东军的大营里，来了一队『顾问』的人——「他们不进兵帐，只进粮仓。每回去，都带着一口黑箱子。」一个老民夫压低声音，「粮仓的耗子都往外跑。军里说，是耗子怕黑箱子。」"]
    },effects:{xp:25,flag:"tm_counselor_blackbox"},go:"tm_watchtower"},
    {t:"（不接近，退到关外高地观察）",go:"tm_watchtower"}
  ]
,
  ifFlag: {"bandit_leader_killed": ["你走过营地时，几个老兵盯着你看了好几眼。你杀匪首的事跟着溃兵传到了前线——有士官朝你点了点头，没说话。在这种地方，能被点头认下，是拿血换来的。"]}};
N["tm_watchtower"] = {
  place:"东部王国 · 铁门关外 · 北坡烽火台", where:"黄昏",
  text:[
    "铁门关北坡有一座废弃的烽火台，半截石台还立在风里。你攀上去，视野豁然开朗——铁门关、东军营地、通往北境的山道，尽收眼底。",
    "黄昏的光把关城染成暗金色。你数了数：东军营地的帐篷，比三个月前多了一倍不止；而关城头，镇北军的旗帜依旧猎猎——但旗杆下，换防的士兵脚步，明显比城墙上的砖缝还稀疏。",
    "风从北境方向吹来，带着雪的味道。远处山道上，一队小小的黑点在移动——是商队？还是援军？"
  ],pace:"normal",
  options:[
    {t:"留在烽火台，观察那队黑点",check:{a:"AGI",sk:"侦察",label:"瞭望"},tier:{
      ok:["你蹲到天黑，看清了：那是一队北境装束的骑兵，约百骑，正沿山道往铁门关方向疾驰——马背上驮着东西，用灰布盖着。你数了数，六辆驮车。这个数量，既不是商队，也不是大军——像是『先遣』。"],
      fail:["天很快黑了，那队黑点消失在暮色里。你只记得：他们走的是一条少有人知的猎道。"],
      crit:["你用烽火台的旧镜片看清了：那队骑兵的旗号——是北境王都的『雪狼旗』。六辆驮车，车辙很深，压着北境的冻土。更关键的是，队尾有一匹空马，鞍上插着一面小白旗——那是『求见』的信号。北境，派人来谈事了。"]
    },effects:{xp:25,flag:"tm_north_vanguard"},go:"tm_ruins"},
    {t:"检查烽火台残留的烽火痕迹",check:{a:"INT",sk:"侦察",label:"勘察"},tier:{
      ok:["烽火台的灶膛里，积着厚厚的灰。你拨开灰，发现最底下一层不是柴灰——是松脂和铁屑混着烧过的残渣。你捻了捻：这是『烽火信标』的用料，只有边关急报才用。但灶膛壁上，没有第二次使用的痕迹——这座烽火台，已经很久没被点过了。"],
      fail:["灰太厚，你拨了半天也没看出门道。只得拍拍手作罢。"],
      crit:["你在灶膛最深处摸到一枚烧变形的铁环——像是从什么东西上熔下来的。铁环内壁，刻着半枚纹路，被火燎得模糊，但你认得那个轮廓：竖瞳。这座废弃的烽火台，曾经被用来传过某种『非军情』的信号。"]
    },effects:{xp:20,flag:"tm_signal_ring"},go:"tm_ruins"}
  ]
};
N["tm_ruins"] = {
  place:"东部王国 · 铁门关外 · 旧战场废墟", where:"晨",
  text:[
    "铁门关外三里，有一片被战火烧过的废墟——十年前那场拉锯战留下的。断墙半埋在土里，焦黑的梁木横七竖八，偶尔露出半截生锈的枪尖。",
    "晨雾还没散尽。你在废墟里穿行，脚下一步小心——这里的土，被翻过很多次，松软得像流沙。",
    "一个拾荒的老兵坐在断墙上，面前摆着一排东西：断刀、铜扣、半块磨盘的瓦当、几枚锈死的箭镞。他看见你，咧嘴一笑，缺了一颗门牙：",
    "「小兄弟，来捡漏？还是来——找东西？」他眯起眼，「这地方，十年前埋了三千条命。你要找的东西，说不定就埋在他们底下。」"
  ],pace:"normal",
  options:[
    {t:"向老兵打听废墟里的门道",check:{a:"CHA",sk:"交涉",label:"打听"},tier:{
      ok:["老兵的话匣子打开了：「废墟里值钱的东西不多，可识货的人专找一样——铁门关十年战的『信物』，刀柄、军牌、旗角，都有人收。」他压低声音，「东军收，镇北军也收。一块军牌，能换半个月的酒钱。」"],
      fail:["老兵摇摇头：「你这样的生面孔，我不做你生意。怕惹麻烦。」"],
      crit:["老兵压低声音：「你要真想找东西，去东边那片塌墙下。昨晚我起夜，看见有人摸黑在那刨了半夜——天亮前走了，埋回去的土，还是湿的。」他盯着你，「那片墙下，埋着的东西，可不止十年前的那批。」"]
    },effects:{xp:20,flag:"tm_ruins_hint"},go:"tm_frontline"},
    {t:"在废墟里仔细搜寻",check:{a:"AGI",sk:"侦察",label:"搜寻"},tier:{
      ok:["你翻了半日，找到几枚箭镞和一块残缺的军牌——牌面刻着『镇北·戊』。你收好。这种东西，在承天城能换几个钱，在有心人手里，能换一个故事。"],
      fail:["你翻了半天，只找到半截锈钉和一片碎陶。废墟比你想的，干净得多——有人比你更勤快。"],
      crit:["你在塌墙下挖到一只铁匣，匣子锈死，你撬开——里面是一卷油布包着的羊皮纸，字迹被血渍洇得模糊，但还能认出几行：「……粮仓地基下……第七日……换……不可声张。」落款处，一个模糊的姓氏：秦。"]
    },effects:{xp:30,item:"旧军牌（镇北·戊）",flag:"tm_ledger_scroll"},go:"tm_refugee"},
    {t:"（不多停留，去难民营看看）",go:"tm_refugee"}
  ]
,
  ifFlag: {"bandit_leader_killed": ["你站在废墟前，手不自觉地按了按腰间。铁门关外那场搏杀的余味还在——你杀过人了，这件事从此长在你身上，像这片焦土一样，风一吹就露出来。"]}};
N["tm_courier"] = {
  place:"东部王国 · 铁门关外 · 军情驿站", where:"白昼",
  text:[
    "军情驿站是铁门关外一座灰扑扑的石屋，门口拴着几匹喘着粗气的驿马。驿丞是个干瘦的中年人，正对着一叠文书发愁。",
    "他看见你，招招手：「来得正好！人手不够了——北边山道送一封信，南边谷口送一封信，还有关城根下，给守军捎一包药。」他上下打量你，「你认路吗？跑得动吗？跑得动，一封三十铜。」"
  ],pace:"light",
  options:[
    {t:"接下山道送信的任务",check:{a:"AGI",sk:"athletic",label:"送信"},tier:{
      ok:["你沿着山道跑了两个时辰，把信送到北坡的哨点。哨长验了火漆，点点头：「利索。」他多给了你几个铜板，「顺道的事——回去跟驿丞说，北坡的狼烟堆，该修了。」"],
      fail:["半路遇到一队运粮车，堵了半个时辰。你赶到时，哨长脸色不好看：「迟了半刻。军情这种事，误一刻就是误一命。」"],
      crit:["你送完信，哨长压低声音多说了两句：「你跑得快，人又机灵——有件私事托你。关城根下那段新墙，你路过时别多看。最近，有人专盯着那地方。」他补了一句，「记住，就当没听见。」"]
    },effects:{gold:30,xp:20,flag:"tm_courier_done"},go:"tm_frontline"},
    {t:"接下去关城根下送药的差事",check:{a:"CHA",sk:"交涉",label:"送药"},tier:{
      ok:["关城根下的守军收下药包，一个老兵拉着你多说了两句：「代我们谢过驿丞——城里缺药，缺得厉害。」他压低声音，「还有，你要是回承天，帮我带句话给……算了，不带了。这世道，话越少越安全。」"],
      fail:["守军盘问了你好几句，才收下药包。你出来时，背后几道视线跟了很远。"],
      crit:["老兵收了药，忽然压低声音：「你面生，看着不像东军的人。跟你透个风——城里有位将军，三个月没出过帅府了。外头说病，里头说……」他做了个噤声的手势，「话到这儿。」"]
    },effects:{gold:30,xp:20,flag:"tm_medicine_done"},go:"tm_refugee"},
    {t:"（不接活，在驿站歇脚喝水）",go:"tm_watchtower"}
  ]
};
N["tm_refugee"] = {
  place:"东部王国 · 铁门关外 · 关南难民营", where:"白昼",
  text:[
    "关南的难民营，是铁门关外最大的一片帐篷群。被战火赶出家园的人，从东境各地涌到这里，等一条往北的路。",
    "营地入口，一个披着破旧斗篷的女人正给几个孩子分黑面饼。她抬头看你，目光平静：",
    "「过路的？还是——来找人的？」她顿了顿，「你要是带得起人，往北的路，我可以替你指。」",
    "她身后的帐篷群，炊烟稀稀落落。空气里，是煮野菜和湿柴的味道。"
  ],pace:"normal",
  options:[
    {t:"向她打听难民里的消息",check:{a:"CHA",sk:"说服",label:"打听"},tier:{
      ok:["她分完饼，在衣摆上擦了擦手：「消息不值钱，可也不免费。」她压低声音，「你往北走的话——听我一句，别走官道。官道上的盘查，一日严过一日。走猎道，翻过北坡，有接应。」"],
      fail:["她摇摇头：「难民营里的消息，换不来一块饼。我不知道。」"],
      crit:["她看了你很久，忽然说：「三天前，营里来了一家人——他们不是难民。他们的靴子太干净。」她指着营地西角一座帐篷，「他们不跟人说话，也不领粮。今早天没亮，他们往铁门关方向走了。」她顿了顿，「我见过那种靴子。东军的探子，穿那种靴子。」"]
    },effects:{xp:20,flag:"tm_spy_sighting"},go:"tm_negotiate"},
    {t:"掏出干粮分给孩子们",effects:{gold:-5},tier:{ok:["你掏出一包干粮，几个孩子围上来，眼睛亮得像星星。分完饼，一个扎着歪辫的小姑娘塞给你一颗光滑的小石头：「哥哥，这个给你——是我从河边捡的，会发光。」你捏着石头，掌心微凉。那颗石头，在日光下，确实泛着一丝极淡的、银色的光。"]},go:"tm_negotiate"},
    {t:"（不逗留，去战前斡旋的营地看看）",go:"tm_negotiate"}
  ]
,
  ifFlag: {"gave_all_to_refugees": ["难民营入口，一个妇人认出了你——你把家财散给难民的那天，她排在你面前。她没说话，只是把怀里最后一块干粮塞进你手里，退回了人群。"]}};
N["tm_negotiate"] = {
  place:"东部王国 · 铁门关外 · 两军之间的空场", where:"黄昏",
  text:[
    "铁门关外两军之间的空场，是这片土地上最安静的二百步。两侧的旗帜遥遥相对，中间的地带，连草都不怎么长——被马蹄和靴子踩实了。",
    "今晚，空场上多了一顶帐篷：灰白色的，两军都不挂旗。帐篷前，站着两个护卫——一个东军装束，一个镇北军装束，隔着三丈，谁也不看谁。",
    "一个文士模样的人从帐篷里走出来，朝你拱手：「阁下是路过的？还是——来旁听一场和谈的？」他笑了笑，「今日谈的，是铁门关外三千难民的去路。两军都嫌他们碍事，又都怕他们倒向对方。」"
  ],pace:"normal",
  options:[
    {t:"旁听和谈，看两军交锋",check:{a:"INT",sk:"交涉",label:"旁听"},tier:{
      ok:["你坐在帐篷一角，看两边的使者你来我往：东军要难民往南迁，「免得碍了军粮」；镇北军要难民往北，「过了关，你们管不着」。谈了一个时辰，谁也没让谁。你注意到一个细节：两边的话，都说得很大声，但眼睛，都时不时往帐篷外瞟——像在等什么人。"],
      fail:["和谈的内容枯燥，两边翻来覆去都是那几句话。你坐不住，先退了出来。"],
      crit:["你听出门道：两边的使者都在拖时间——他们在等一个人。半个时辰后，一个披斗篷的人没带随从，走进帐篷，两边的使者同时站起来。那人落座，开口第一句：「难民往哪走，不重要。重要的是——铁门关，谁来守。」你心里一凛：这话，不是谈难民，是谈关城。"]
    },effects:{xp:25,flag:"tm_truce_insight"},go:"tm_frontline"},
    {t:"（把这些天的见闻收拢成一条线，站在高地复盘）",go:"tm_warwatch"},
    {t:"以中间人身份，提出一个方案",check:{a:"CHA",sk:"说服",label:"斡旋"},tier:{
      ok:["你提出：难民不走官道，走北坡猎道，由两军各派一队『护送』——名义上是押送，实际上是两边都看着。文士想了想，点头：「法子不算高明，但两头都下得了台。」他朝你拱了拱手，「阁下，是个会办事的人。」"],
      fail:["你刚开口，两边的使者同时看过来，又同时别开眼。文士轻咳一声：「这个……阁下还是先听听就好。」"],
      crit:["你的方案不仅解决了难民去路，还顺带提出了『两军共同修北坡烽火台』——理由冠冕堂皇，实则让两边在铁门关外有了一处不能动手的『共管之地』。文士深深看了你一眼：「这一手，不是寻常人想得出的。」他递给你一枚铜牌，「北坡烽火台修成之日，凭此牌，两军都给你行个方便。」"]
    },effects:{gold:40,xp:35,rep:5,infl:{east:10},item:"和谈铜牌",flag:"tm_mediator"},go:"tm_watchtower"}
  ]
,
  ifFlag: {"khan_aware": ["空场两边的旗帜在你眼里变了味道——你亲眼见过兽人草原的大汗，知道对面那些号称蛮族的骑兵，背后也有完整的规矩和算计。谈判桌上的话，你听得比旁人深了一层。"]}};
N["tm_warwatch"] = {
  place:"东部王国 · 铁门关外 · 北坡高地", where:"夜",
  text:[
    "你站在北坡高地，夜风灌满衣袍。铁门关方向的灯火，像一条绷紧的金线。",
    "你想起这些天在关外的见闻：东军营地多了一倍的帐篷、镇北军城头稀疏的换防、军需帐篷里那口『黑箱子』、废墟下带血的羊皮纸、两军之间那场等人来谈的和谈。",
    "这条战线，表面上是两军对峙——可你越看越清楚，真正的线，不在两军之间。",
    "它在粮仓地基下，在军需帐篷的黑箱子里，在北坡那枚烧变形的铁环上。",
    "铁门关，正在被从里面，一点一点地『换』掉。"
  ],pace:"normal",
  options:[
    {t:"（把这条战线的真相记在心底，转身离开）",effects:{xp:30,rep:3,infl:{east:5}},go:"east_tiemen_after"}
  ]
};

/* /u1inj:data-nodes:dn_west.js/ */
/* /bd1inj:west/ BD-1 西境内容包（三大路线 · 线二：新势力地域内容包）
   西境：大陆西端元素荒原——元素风暴频发之地，游侠学院与西境行省会的势力角力。
   全对象式纯数据节点，零引擎改动；判定走既有 check/tier/effects/changeRelation
   世界观约束：与五主线不冲突（seal 深渊封印/spring 泉水为呼应伏笔，不改主线判定）；
   与 EVENT_POOL_EXT 事件 hstorm（元素风暴）/spring（发光枯井）文本前后呼应；
   新增设定词（元素荒原/游侠学院/西境行省会）不入冻结表（冻结表管既有关键设定），
   但西境风暴异常已登记 CM-3 账本（led_33 西境风暴伏笔，plant=west_storm_observatory）。
   文本遵守 V66 文风与 T0-2 治理词约束。 */
N["arrive_west_huangyuan"] = {
  tag:"main",
  place:"西境 · 元素荒原 · 入境隘口", where:"白昼", pace:"deep",
  text:[
    "官道在西边断了。你脚下最后一块石板裂着焦黑的纹路，再往前，是起伏到天边的灰褐色荒原——风从那边来，带着烧焦的金属气味，还有细碎的、刺在脸上的沙砾。",
    "隘口的界碑半埋在土里，碑文被风蚀得只剩两个字：「西境」。碑脚下坐着个裹皮袍的老人，怀里抱着一根磨得发亮的铁杖，浑浊的眼睛在你身上停了停。",
    "「人类，来错地方了。」他开口，声音像砂纸磨铁，「三个月前那场风暴，把荒原上的商路全卷断了。往西走半日，你就能看见风暴留下的沟——宽得能埋下一座房子。」",
    "他抬手指向远处地平线上一道灰蒙蒙的裂缝：「那边是元素荒原的腹地。游侠学院在西北角的山坡上，行省会再往南。你若是来发财的，去集市；来学本事的，去学院；来送死的——」他咧嘴，「风暴眼就在前面等着你。」"
  ],
  options:[
    {t:"谢过老人，先往荒原集市去看看",go:"west_market"},
    {t:"往西北，去游侠学院",go:"west_academy_gate"},
    {t:"往南，去西境行省会拜会",go:"west_governor"},
    {t:"（原路返回，离开西境）",go:"west_leave"}
  ]
};
N["west_market"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 风暴集市", where:"白昼", pace:"normal",
  text:[
    "集市搭在一道干涸的河床上，棚屋歪歪斜斜，顶上压着防风的铁网。摊子上摆的东西和别处不一样：发蓝光的碎石、装在陶罐里的细沙、用皮绳拴着的、不断变换颜色的羽毛。",
    "一个独臂的摊主正把一块蓝石头凑到眼前端详，头也不抬：「元素结晶，荒原上的风喂出来的。三枚银月一块，要拿趁早——昨儿又来了批商队，把好货都扫走了。」",
    "他放下石头，忽然凑近了些，声音压得很低：「你要是胆子大，往风暴沟那边去碰碰运气。前几天的风暴，卷出来的东西可比集市上的货色好得多——当然，死人也不少。行省会的人前两天还去收了一具尸体，说是什么『采集人』。」",
    "远处，一队驮着铁笼的商队正穿过集市，笼子里的兽低低地吼。摊主啐了一口：「军阀的货。西境的兽潮，又要来了。」"
  ],
  options:[
    {t:"买一块元素结晶（3银月）",check:{a:"CHA",sk:"bargain",label:"议价"},tier:{
      ok:["你蹲下来，挑了三块结晶，用行话跟他磨了几句价。摊主松口，三块算你两枚银月，还搭了一小袋风暴沙：「行，懂行的。荒原上，识货的人少，能说话的人更少。」你收起结晶，感觉掌心一阵温热——这是元素之力在流动。","你顺口问起西境的局势。摊主看了看四周，凑近说：「行省会的老爷们想收编游侠学院，学院不买账。两边为风暴观测塔的归属，吵了大半年了。」"],
      fail:["你开价太低，摊主嗤了一声，把蓝石头收进怀里：「外乡人，荒原上的货，一分钱一分货。」他不再理你。"],
      crit:["你把价压到了一块结晶一枚银月，摊主摇头苦笑，还是卖了：「你这种人，在荒原上活得下去。」他指着西边那道灰蒙蒙的裂缝说，「记住：风暴前，元素结晶会变得比平时亮。看到哪块石头突然发光，躲远点。」"]
    },effects:{gold:-2,infl:{west:3}},go:"west_storm_observatory"},
    {t:"打听兽潮和军阀的事",check:{a:"INT",sk:"lore",label:"打听"},tier:{
      ok:["你在集市里蹲了半个时辰，拼出个大概：西境的兽潮，近几年一年比一年早。老辈人说，兽潮跟元素风暴是一个来路——「荒原在发脾气。」","行省会的老爷们认为兽潮是发财的机会：兽皮、兽骨、兽核，都能换钱。他们组织猎队，也收「采集人」的税。游侠学院则认为兽潮是征兆——「荒原在说什么，只是你们不听。」"],
      fail:["集市上的话东一句西一句，你只听出西境不太平。远处那队铁笼商队又吼了一声，人群散开，又聚拢。"],
      crit:["你注意到一个细节：集市上所有摊主提到兽潮，都会下意识看一眼那队铁笼商队。你循着线索问下去，一个老妇人小声告诉你：「军阀的商队运的不是兽，是兽核——上等的元素兽核。行省会新来的那位老爷，在囤这东西。」","囤兽核。你想起铁门关方向传来的消息，心里把这条线记下了。"]
    },effects:{xp:20,infl:{west:3}},go:"west_garrison"},
    {t:"不逗留，直接去游侠学院",go:"west_academy_gate"}
  ]
};
N["west_academy_gate"] = {
  tag:"branch",
  place:"西境 · 游侠学院 · 山门", where:"白昼", pace:"normal",
  text:[
    "游侠学院建在荒原西北角的山坡上，一圈石墙围出几座灰顶的建筑。山门前没有牌匾，只在一块原石上刻着一行字：「箭矢不指向无辜。」",
    "门廊下，一个背弓的年轻游侠正在给箭羽缠线，抬眼看了看你：「来学箭的？还是来躲风暴的？」他的语气平平，手却一直按在弓臂上，「学院不收外人过夜，这是规矩。荒原上，来路不明的人，比风暴更危险。」",
    "他顿了一下：「不过你运气好——导师今天在。『灰袍』若耶，西境最有名的游侠。你要是真有来意，可以去演武场找他。」"
  ],
  options:[
    {t:"说明来意，求见『灰袍』若耶",go:"west_ranger1"},
    {t:"先在演武场边上看看",go:"west_academy_hall"},
    {t:"去档案室看看风暴记录",go:"west_academy_archive"}
  ]
};
N["west_academy_hall"] = {
  tag:"branch",
  place:"西境 · 游侠学院 · 演武场", where:"白昼", pace:"normal",
  text:[
    "演武场是一块压实的土坪，边角立着十几个草靶。几个年轻游侠正在对练，箭矢破空声、木剑相击声混成一片。场边坐着个灰袍老人，正用一块磨石不紧不慢地磨一把猎刀，刀身映着天光，像一泓浅水。",
    "一个对练的年轻人收弓走过来，朝你扬了扬下巴：「外地人？导师说，来学院的，要么有求于箭，要么有求于西境。你是哪种？」他回头看了一眼灰袍老人，「导师还说，要是你连来意都说不清，就让你喝碗风汤再走。」"
  ],
  options:[
    {t:"请教箭术，下场比试一番",check:{a:"AGI",sk:"athletic",label:"比试"},tier:{
      ok:["你借了把练习弓，跟那年轻人对射了三轮。他赢了两轮，但最后一轮你射中了靶心，他收了弓，眼里有了点真东西：「还行，手不抖。荒原上，手不抖就能活。」他把你引到场边，「去跟导师说句话吧。」"],
      fail:["你三箭偏了两箭，年轻人摇头：「外乡人，你的手在城里待久了，忘了风的方向。」他倒没笑话你，递来一碗水，「喝口水，听听导师怎么说。」"],
      crit:["你接过弓，连珠三箭，正中靶心——第一箭钉进旧箭的箭尾，把上一箭劈成了两半。演武场静了一瞬，年轻人愣住，回头喊：「导师！这个人是练过的！」","灰袍老人终于抬起头，视线在你身上落定：「……有点意思。过来坐。」"]
    },effects:{xp:25,infl:{west:5}},go:"west_ranger1"},
    {t:"打听学院的立场",check:{a:"CHA",sk:"persu",label:"问询"},tier:{
      ok:["你从年轻游侠嘴里问出学院的处境：行省会三次派人来，要学院交出风暴观测塔的钥匙，理由是「西境的安危归行省管」。学院没交。","「观测塔是我们守了六十年的地方。」年轻人说，声音里有火气，「风暴的记录、兽潮的规律，全在那塔里。交给行省会？他们只想着怎么把兽核卖出价。」"],
      fail:["年轻人口风很紧，只说学院的事学院自己管。远处灰袍老人磨刀的声音一直没停。"],
      crit:["你问出了更深一层：行省会最近收编了一批「采集人」，专门在风暴沟里搜刮元素造物——「他们搜出来的东西，没一样登记过。老话说，荒原上不该拿的东西，拿了会招风暴。行省会不信这个。」"]
    },effects:{xp:15,infl:{west:5}},go:"west_academy_archive"}
  ]
};
N["west_academy_archive"] = {
  tag:"branch",
  place:"西境 · 游侠学院 · 档案室", where:"白昼", pace:"deep",
  text:[
    "档案室在学院主楼的地下，点着两盏油灯。木架上一排排卷轴按年份码着，最旧的已经发脆，一碰就掉渣。看守档案室的老妇人坐在灯下抄书，头也不抬：「西境的每一场风暴，都在这里留了名。你要查哪一场？」",
    "你翻了翻近年的记录：三年前风暴渐频，两年前开始有兽潮，一年前——某一页用朱笔圈着：「4037年春，枯井涌泉，温如春水，泉边野草一夜抽芽。学院派人看护，泉眼附近元素之力异常活跃。」",
    "你想起行省集市上听来的话，又想起更早的传闻：有人看见风暴眼里有蓝色的电光，像有什么东西在行走。档案上有一条旧注：「风暴眼深处的光，与古卷记载的『元素行者』相合。失考。」"
  ],
  options:[
    {t:"细查『元素行者』的记录",check:{a:"INT",sk:"lore",label:"研读"},tier:{
      ok:["你在积灰的古卷里翻出零星几段：「元素行者，荒原的旧民，传说能在风暴眼中行走。最后一次记载，在三百年前的封魔之战。」","「封魔之战后，元素行者绝迹。有人说他们死了，有人说他们走进了风暴眼深处。」","你合上古卷，心里那个念头落定了：西境的元素风暴，不是天灾那么简单。"],
      fail:["古卷的墨迹大多模糊，你只辨认出「元素行者」四个字和一个失考的标记。档案室的老妇人提醒你：「卷轴脆，别碰坏了——学院的规矩，查不到的东西，不硬查。」"],
      crit:["你把散碎的记载拼在一起，拼出一条暗线：三百年前的封魔之战 → 元素行者绝迹 → 三年前元素风暴渐频 → 如今风暴眼里出现蓝光。","「跟封印有关。」你压着嗓门说。老妇人的笔顿了一下，没有抬头，只淡淡道：「年轻人，有些话，说出来是要担责任的。」"]
    },effects:{xp:30,infl:{west:5}},go:"west_storm_observatory"},
    {t:"查近十年的兽潮记录",check:{a:"INT",sk:"survive",label:"研读"},tier:{
      ok:["兽潮记录显示：近十年兽潮频率逐年上升，且每次都紧跟元素风暴之后，间隔从两个月缩短到半个月。老妇人在旁边添了一句：「风暴一来，兽就往南跑。跑的方向，从来没变过。」","「往南？」你问。「往南，往人烟稠密的地方。」她抬起眼，「学院试过拦，拦不住。荒原的兽，认风暴的路。」"],
      fail:["记录太多太杂，你只翻到最近一条：兽潮时间表，和风暴记录对得上。老妇人打了个哈欠，没再理你。"],
      crit:["你发现一条被铅笔划掉的旧注：「兽潮的方向，与元素结晶的分布重合。兽不是躲风暴——兽是追着风暴的『馈赠』走。若有人在风暴沟里大量收集元素结晶，兽潮将不会南下，而会折向西北。」","划掉这条注的人，把笔迹压得很重。你记下了「西北」两个字。"]
    },effects:{xp:30,infl:{west:5}},go:"west_garrison"}
  ]
};
N["west_storm_observatory"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 风暴观测塔", where:"白昼", pace:"deep",
  text:[
    "观测塔立在荒原最高处的一座石丘上，塔身灰黑，被风暴磨得发亮。塔顶的平台上有架黄铜望远镜，还有一个裹着厚皮袍的观测员，正往一本册子上记着什么。",
    "「风向西北偏西，风速……嗯？」他抬头看见你，愣了愣，「外乡人？学院放你上来的？」他上下打量你，「上来可以，别碰仪器。上个月有个人乱动罗盘，被风卷走半条命。」",
    "他顺着你的视线望向荒原深处：「你看那道裂缝——三个月前的风暴，就是从那里刮出来的。风暴眼里有蓝光，看见过的人说，蓝光会走，像个人影。」",
    "「学院的老说法是：风暴眼里的光，是荒原的眼睛。它在看着什么。」观测员缩了缩脖子，「反正，塔上的规矩是：蓝光亮的时候，所有人下塔。」"
  ],
  options:[
    {t:"仔细观察风暴眼的方向与规律",check:{a:"INT",sk:"detect",label:"观测"},tier:{
      ok:["你在塔顶待了一个时辰，记下风向、云层和远处裂缝的变化。观测员对照他的册子，点头：「你的记录跟我们的对上了——风暴的间隔在缩短，从三个月到两个月，如今是一个半月。」","「而且，每次风暴前，荒原上的元素结晶都会发亮。」他压着嗓门，「学院长老说，这不是天象，是『回应』。荒原在回应什么。」"],
      fail:["风向太乱，你看不出规律。观测员拍拍你的肩：「第一次上来都这样。荒原的风，要蹲上三年才认得。」"],
      crit:["你发现一个观测员没注意到细节：每次风暴前，西南方向的云层都会出现一道竖直的缝隙——不是云的纹理，像是什么东西从天上撕开的。你把望远镜对准那道缝隙，看见缝隙深处，有一点极淡的蓝光，一闪而没。","「记下来。」你说，「风暴前，西南天顶有缝隙，缝后有蓝光。」观测员瞪大眼睛，低头飞速书写，「你……你是第一个在塔上看见这个的外乡人。」"]
    },effects:{xp:35,infl:{west:8}},go:"west_storm_core"},
    {t:"问观测员关于枯井泉水的事",check:{a:"CHA",sk:"persu",label:"问询"},tier:{
      ok:["观测员点头：「你说的是那口井——学院派人看着，不许人靠近。泉水温度如春，井边的草疯长，连枯树都抽了新芽。」他声音压得很低，「有个采药人偷偷舀了一壶去卖，第二天，那壶水在摊上发了一夜的光。」","「后来呢？」你问。「后来行省会知道了，把采药人带走了，水也没了。学院跟行省会吵了一架——学院说那泉水是荒原的脉，动不得；行省会说，泉水是西境的财。」"],
      fail:["观测员口风紧：「泉水的事，学院有令，不对外说。」他低头继续记录，不再接话。"],
      crit:["你从观测员那里套出关键一句：「长老说，那口井的位置，正好在风暴裂缝的正下方——地下有条缝，风暴从缝里来，泉水从缝里涌。地上的风暴和地下的水，是同一件事的两张脸。」","同一件事的两张脸。你把这个说法记在心里，决定去那口井看看。"]
    },effects:{xp:25,infl:{west:5}},go:"west_well"}
  ]
};
N["west_storm_core"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 风暴沟", where:"白昼", pace:"epic",
  text:[
    "风暴沟是三个月前那场大风暴留下的伤疤：一道宽得能埋下房子的裂缝，从地平线一直延伸到脚下。沟底的岩石被烧成琉璃色，在日光下泛着幽蓝。",
    "你沿着沟沿走了小半个时辰，风越来越紧，沙砾打在脸上生疼。沟底有一片被翻过的碎石堆——那是「采集人」的痕迹。碎石堆旁，有一具半埋在沙里的尸体，皮袍、背篓，背篓里散出几块发光的蓝石头。",
    "风突然停了。荒原在一瞬间静得可怕。你看见沟底的琉璃岩石面上，有一条细细的蓝光，像血管一样，爬过。",
    "然后你听见了声音——很远，像有人在你耳边吹了一口气。不是风。蓝光顺着岩石爬向你，在离你三步远的地方停住了。"
  ],
  options:[
    {t:"蹲下来，仔细观察那道蓝光",check:{a:"SPR",sk:"soul",label:"感知"},tier:{
      ok:["你蹲下来，屏住呼吸。蓝光在你面前盘桓了片刻，忽然散开，像受惊的鱼群，钻进岩石的缝隙里。你感到一股凉意从脊椎爬上来——不是恐惧，是某种古老的东西在回应你。","你在蓝光停留过的地方，发现一枚半埋在沙里的徽章：铜制，刻着一道盘旋的闪电，边缘已经发黑。这是旧时代的东西——封魔之战的遗物。"],
      fail:["你靠得太近，蓝光猛地炸开，一阵强风把你掀得倒退三步。等你站稳，沟里已经恢复死寂。你捡起一枚被吹出来的元素结晶，塞进口袋，决定不再深入。"],
      crit:["你伸出手，蓝光没有躲开。它在你的指尖停了一瞬，像一滴水落进掌心——你看见了一幅画面：灰袍的人影站在风暴眼中，双手按地，地下的裂缝合拢。三百年前的封魔之战，元素行者用自己的命，封住了西境的风暴源头。","「风暴眼里的蓝光，是他们在守着封印。」你压着嗓门说完这句话，蓝光散了。沟底恢复了死寂，只有风重新呜咽起来。"]
    },effects:{xp:50,infl:{west:10},flag:"west_storm_secret"},go:"west_academy_archive"},
    {t:"（谨慎后退，不惊动蓝光）",check:{a:"AGI",sk:"stealth",label:"撤退"},tier:{
      ok:["你放轻脚步，一步步退出风暴沟。蓝光没有追来——它只是停在原地，像在目送你。你走出沟口时，回头看见那道蓝光沉入岩石深处，像一盏灯被吹熄。","你在沟口捡到一块被风暴刮出来的元素结晶，品质比集市上的好得多。"],
      fail:["你退得太急，踩翻了一块碎石。蓝光猛地一涨，一阵风暴掀沙而起，你被吹得滚下沟沿，磕破了膝盖（-4 HP）。好在没有伤到筋骨。你灰头土脸地退出风暴沟，决定先回集市休整。"],
      crit:["你悄无声息地退出风暴沟，蓝光毫无察觉。你不仅全身而退，还在沟口一个隐蔽的岩缝里，发现一小堆被人藏起来的元素结晶——品质极高，像是某个人私藏的「收获」。你数了数，足够卖个好价钱。"]
    },effects:{xp:20,infl:{west:5}},go:"west_market"}
  ]
};
N["west_governor"] = {
  tag:"branch",
  place:"西境 · 西境行省会 · 行省厅", where:"白昼", pace:"normal",
  text:[
    "行省会是一座灰石砌成的堡垒，城头上插着黑底金狼旗。门口站岗的卫兵披着铁叶甲，看见你，手按上刀柄：「行省厅重地，闲人免进。」",
    "你报出来意后，卫兵上下打量你半天，进去通报。片刻后，他出来：「老爷同意见你。进去别乱看，别乱说。」",
    "行省厅的正厅里，一个中年男人坐在高背椅上，手里把玩着一块发蓝光的结晶。他穿着剪裁考究的锦袍，与荒原的粗粝格格不入。他抬眼看了看你，把结晶放在桌上：",
    "「外乡人，你是来做生意的，还是来打听事的？」他笑了笑，「西境这地方，两种人都多。第一种人，我欢迎；第二种人——」他拿起结晶，「学院那边的人，最近越来越多了。」"
  ],
  options:[
    {t:"以行商身份，试探西境的局势",check:{a:"CHA",sk:"bargain",label:"论商"},tier:{
      ok:["你报出商队的名头，又说了几句南边铁价和粮价的行情。行省官的眼神松动了一些：「懂行的。坐。」","他给你倒了杯茶，话匣子打开：「西境的生意，说白了就两样：元素结晶，和兽核。结晶是学院的人在收，兽核是我在收。你若是能两头跑，西境的钱，有你一份。」","「学院那帮人，守着个破塔，当宝贝。」他嗤笑，「荒原上的东西，本来就该归西境人管。你说是不是？」"],
      fail:["你的话术在行省官面前不够看，他听了几句就打断：「行了，商队的人我见得多了。要谈生意，拿货来谈。没货，就请吧。」他低头继续把玩结晶，不再看你。"],
      crit:["你不仅套出了行省会收兽核的内情，还注意到桌上的地图——行省会的地图上，风暴观测塔的位置被红笔圈着，旁边写着一行小字：「学院不交，便换人守。」","「换人守」三个字，让你意识到行省会的手段不只是施压。你把这个细节记在心里，告辞离开。"]
    },effects:{xp:20,infl:{west:5},flag:"west_governor_tension"},go:"west_garrison"},
    {t:"直言西境风暴异常，试探行省会的打算",check:{a:"CHA",sk:"persu",label:"直谏"},tier:{
      ok:["你直言：风暴间隔在缩短，兽潮提前，荒原在「回应」什么。行省官脸上的笑意淡了：「外乡人，你这些话，是从学院听来的吧？」","他站起身，踱到窗边：「学院说风暴是征兆，我说风暴是机会。荒原上的东西，不管它是怎么来的，落在我手里，就是西境的财。」他回头，眼神锐利，「至于『征兆』——等征兆真来了，西境自有西境的打法。用不着学院指手画脚。」"],
      fail:["行省官脸色一沉：「你这些话，是学院教的吧？来人，送客。」两个卫兵上前，把你客气而坚决地请出了行省厅。"],
      crit:["你不仅说了，还递上你在集市和风暴沟看到的事实：行省会在囤兽核，采药人带走的泉水会发光。行省官沉默了很久，忽然开口：「……你说的泉水，不是第一批。」","「第一批被带走的泉水，在一个月前。送去帝京了。」他闭上眼，「有人要那水。出价的人，你惹不起，我也惹不起。」"]
    },effects:{xp:30,infl:{west:5},flag:"west_spring_trace"},go:"west_well"}
  ]
};
N["west_garrison"] = {
  tag:"branch",
  place:"西境 · 行省军营地", where:"白昼", pace:"normal",
  text:[
    "军营扎在行省会西边的一片空地上，帐篷排列整齐，刀枪架在帐外，擦得发亮。你混在送粮的商队里进了营地，看见一队士兵正往笼车里装兽核，码得整整齐齐，像装粮食一样。",
    "一个老兵蹲在帐边磨刀，看见你，咧嘴笑了笑：「外乡人，看新鲜？」他朝笼车努努嘴，「那些兽核，是要往东边运的。东边的人，出价高。」",
    "「东边？铁门关方向？」你问。老兵摇摇头：「再往东。帝京。听说帝京的老爷们，拿兽核炼一种新东西——」他声音压得很低，「炼『兵器』。能自己走路的兵器。」"
  ],
  options:[
    {t:"追问『能自己走路的兵器』",check:{a:"INT",sk:"lore",label:"追问"},tier:{
      ok:["老兵话匣子一开就收不住：「我听押车的兄弟说，帝京的工坊里，兽核嵌进铁人里，铁人就能动——像活的一样。第一批已经造出来了，运往铁门关方向了。」","「铁门关。」你重复这个词。兽核兵器，元素结晶，被带走的泉水——西境的每一件东西，都在往东边流。","老兵看着笼车，叹了口气：「荒原上的东西，本该留在荒原上。可这年头，谁说了算呢。」"],
      fail:["老兵见你追问得紧，警觉起来：「你问这么多干什么？行省会的军务，外乡人少打听。」他磨刀的动作快了几分，不再理你。"],
      crit:["你不仅问出了铁人兵器的消息，还注意到一个细节：老兵刀柄上缠着的红绳，跟你在兽人草原见过的、『南边顾问』赏的那种红绳，一模一样。","「这绳子……哪来的？」你问。老兵低头看了看刀柄：「哦，行省会发的。说是绑上，祖灵认路。谁知道呢，图个吉利。」","你心里那根弦绷紧了。同样的红绳，在草原是『南边的顾问』，在西境是『行省会』。两条线，指向同一个方向。"]
    },effects:{xp:30,infl:{west:5},flag:"west_redrope"},go:"west_governor"},
    {t:"离开军营，去那口发光枯井看看",go:"west_well"}
  ]
};
N["west_well"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 发光枯井", where:"白昼", pace:"deep",
  text:[
    "枯井在荒原南缘的一处洼地里，四周用木栅栏围着，栅栏上挂着一块木牌：「学院重地，闲人止步」。",
    "你走近时，空气里浮着一股温润的气息，像春天——在这片被风暴刮了三个月的荒原上，格外扎眼。井沿上长着几丛嫩草，绿得发亮，与周围的灰褐截然两样。",
    "你探头往井里看：水面离井口不远，泛着极淡的光，像一块温热的玉。井壁上，老苔与细芽纠缠，一簇簇地向上爬。",
    "「那水，温的。」身后忽然有人说话。你回头，一个背弓的年轻游侠站在栅栏边，「学院的人隔三天来看一次。行省会的人隔两天来看一次。两边看的是同一口井，想的不是一回事。」",
    "他顿了顿：「导师说，泉水是荒原的脉。脉要是有个好歹——西境的天，就要变了。」"
  ],
  options:[
    {t:"仔细观察泉水的流向与异状",check:{a:"INT",sk:"detect",label:"探查"},tier:{
      ok:["你顺着井沿蹲下，仔细看：泉水不从地下涌，而是从井壁的一处裂缝渗出来，细细的一线，沿着一道黑线向下淌。那黑线在井壁上蜿蜒，像一条血管。","你顺着黑线向上看——它延伸的方向，正对着西北方风暴观测塔的位置。","「地上的风暴，地下的水，同一件事的两张脸。」你想起观测员的话，心里明白了：这口井，是西境脉动的一个窗口。"],
      fail:["你只看出泉水确实温热，井壁上的草确实疯长。井水的光很淡，看不出什么门道。年轻游侠提醒你：「别靠太近。上次有人想打水，被学院的人请走了。」"],
      crit:["你注意到一个细节：井壁黑线的底部，有一处苔藓的颜色不同——深得发黑，像被什么东西浸润过。你伸手试了试：那一小片岩石，是凉的，比周围的井壁凉得多。","「井水是温的，这里却是凉的。」你压着嗓门说，「凉的这一块，对应着地下——有什么东西在往下渗，不是水。」你把这个发现记在心里，决定告诉游侠导师。"]
    },effects:{xp:35,infl:{west:8},flag:"west_well_secret"},go:"west_ranger1"},
    {t:"不打扰，去学院找导师谈谈",go:"west_ranger1"}
  ]
};
/* ---- BD-1 支线：西境游侠导师（灰袍若耶，好感闭环） ---- */
N["west_ranger1"] = {
  tag:"branch",
  place:"西境 · 游侠学院 · 导师居所", where:"白昼", pace:"normal",
  text:[
    "导师居所是学院角落一间不起眼的石屋，门前晾着几张兽皮。『灰袍』若耶坐在门槛上，手里拿着一支箭，正用刀尖细细地剔箭羽。他抬头看见你，没说话，先把你从头到脚看了一遍。",
    "「荒原上的规矩，客人进门，先喝一碗风汤。」他起身，从炉上端下一碗灰绿色的汤，递给你，「喝了，再说你来干什么。」",
    "你接过碗，汤是温的，带着一股说不清的草香，入口微苦，回甘。若耶看着你喝完，点点头：「嗯，喝得下风汤的人，不矫情。」他重新坐下，「说吧，你一个外乡人，跑到西境来，图什么？」"
  ],
  options:[
    {t:"（坦诚来意：西境的风暴与泉水有异，你追查至此）",check:{a:"CHA",sk:"persu",label:"坦诚"},tier:{
      ok:["你把风暴沟的蓝光、档案室的记载、枯井的凉意一五一十说了。若耶听完，沉默了很久，把箭插回箭囊：「……你看到的这些，学院里一半人不信，另一半人装作没看见。」","「但你说对了。」他站起来，「西境的风暴不正常。三十年前我初到这里，风暴一年一场。如今——」他看向西北方，「一个半月一场，还在变快。」","「你愿意追查下去，说明你不是来发财的。」他伸出手，「西境需要一个明白人。我若耶，交你这个朋友。」"],
      fail:["若耶听完，没什么表情：「这些事，学院自己会查。外乡人，风暴的事，沾上了就脱不开身。你走吧，喝过风汤，我们两清。」他转身进屋，门在身后合上。"],
      crit:["你不仅说了所见，还把风暴沟蓝光「回应你」的细节也说了。若耶的刀尖顿住了：「……蓝光在你面前停住，没有散？」他盯着你看了很久，「三十年了，蓝光从不亲近外人。你是第一个。」","他收了刀，语气里多了一层东西：「你身上有荒原认得的东西。这件事，我陪你查。」"]
    },effects:{xp:20,infl:{west:5},relation:{npc:"west_ranger",delta:30}},go:"west_ranger2"},
    {t:"（请教西境的生存之道，不提追查）",check:{a:"AGI",sk:"survive",label:"求教"},tier:{
      ok:["若耶教你在荒原上辨认风向、寻找水源、躲避风暴的窍门。他讲得不多，但每句都有用：「风暴来前，兽先跑。兽跑的方向，就是安全的方向。」","「元素结晶发亮的时候，别贪。荒原上，贪心的人活不过三场风暴。」他拍了拍你的肩，「记住这两条，西境你就能走。」"],
      fail:["若耶讲得简短，你记了三条就乱了。他也不恼：「记不住就算了。荒原的规矩，本来就是要用命去记的。」"],
      crit:["若耶看出你学得认真，多讲了一条：「还有——若你有一天在风暴眼里看见蓝光，别怕，也别躲。蓝光不伤人，它只是在看。」他顿了顿，「它在看，来的人是不是荒原认得的人。」","你后来才知道，这是游侠学院代代相传的密语，他只对少数人讲过。"]
    },effects:{xp:15,infl:{west:5},relation:{npc:"west_ranger",delta:15}},go:"west_ranger2"}
  ]
};
N["west_ranger2"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 猎径", where:"白昼", pace:"deep",
  text:[
    "若耶带你走了一条猎径——荒原上一道几乎看不出痕迹的路，只有他这种老游侠才认得出来。他边走边指：「这条径，我走了三十年。荒原上的兽、风、水，都认得这条径。」",
    "走到一处风口，他停下来，蹲下身，拨开沙土，露出一串新鲜的爪印：「兽潮前锋。昨晚过的。」他直起身，眼神锐利，「比去年早了十二天。」",
    "「十二天。」他重复了一遍，像在跟自己确认什么，「三十年来，兽潮一年早过一年。早到如今这个份上——荒原，真的在出什么事。」",
    "他回头看你：「你愿意跟我走这条径，就说明你信得过荒原的规矩。那我也不瞒你：学院守的观测塔，行省会要收走。塔里的记录，是西境六十年的眼睛。塔要是落在行省会手里——」他没有说完，但意思已经明了。"
  ],
  options:[
    {t:"（主动提出帮忙守住观测塔）",check:{a:"CHA",sk:"persu",label:"表态"},tier:{
      ok:["你表态：观测塔的记录，不该落在只想着卖兽核的人手里。若耶看了你一眼，难得地笑了笑：「好。有你这句话，学院的事，算你一份。」","「不过，守塔不是靠嘴。」他递给你一把猎刀，「荒原上，说话的分量，看的是手里有没有真东西。走，我教你两招。」"],
      fail:["若耶摆摆手：「塔的事，学院自己扛。你一个外乡人，别卷进来。」他转身继续走猎径，但脚步放缓了些——你在身后，他到底是留了一份心。"],
      crit:["你不仅表态，还说出了行省会「换人守」的打算和红绳的发现。若耶的脸色沉下来：「红绳……行省会也在发红绳？」他停下脚步，视线投向远方，「这条线，比我想的长。」","「你说得对，塔不能丢。」他握住你的手，「从今天起，你是我若耶的朋友。学院的门，随时为你开。」"]
    },effects:{xp:25,relation:{npc:"west_ranger",delta:25},flag:"west_tower_ally"},go:"west_ranger3"},
    {t:"（请教追踪术，沿猎径练练手）",check:{a:"AGI",sk:"survive",label:"习术"},tier:{
      ok:["若耶教你在沙地上辨认兽迹：新旧爪印的差别、风向对气味的偏折、兽群转向的痕迹。你学得认真，他教得耐心，一个上午，你在猎径上辨出了三种兽的踪迹。","「不错。」他难得夸人，「荒原上，看得懂痕迹的人，活得久。」"],
      fail:["沙地上的痕迹你认了半天，还是分不清新旧。若耶倒不生气：「第一次都这样。荒原的学问，是拿脚量出来的。」"],
      crit:["你不仅学会了辨迹，还顺着爪印追出一段，发现兽潮前锋的路线确实绕过了行省军的营地——「兽不傻。」若耶压着嗓门说，「它们认得危险的地方。行省会在囤兽核，兽也认得。」"]
    },effects:{xp:20,relation:{npc:"west_ranger",delta:15},go:"west_ranger3"}},
  ]
};
N["west_ranger3"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 观测塔下", where:"白昼", pace:"deep",
  text:[
    "这天傍晚，你与若耶在观测塔下碰头。塔顶的观测员远远朝你们招手，喊声被风撕得断断续续：「风暴……提前了……明早……」",
    "若耶的脸色变了：「明早？」他抬头看天——西方的云层正在变厚，边缘透着不祥的青灰色，「不对。这风向，不是自然的风暴。」",
    "他转向你，语气第一次带上郑重：「行省会的人，今天下午来塔下转了三圈。他们请了『采集人』的头目——那人在风暴沟里干了大半年，知道怎么把蓝光引出来。」",
    "「如果他们把蓝光引向塔基——」他握紧了弓，「观测塔挡不住风暴。塔一倒，六十年的记录，连同西境的『眼睛』，就全没了。」",
    "风越来越紧。塔顶的旗在风里猎猎作响，像一面被撕扯的战旗。"
  ],
  options:[
    {t:"（与若耶并肩，守住观测塔）",check:{a:"STR",sk:"martial",label:"守塔"},tier:{
      ok:["你与若耶在塔下列阵。夜里，风向果然变了——一道不该出现的风暴，裹着沙尘，从西边直扑观测塔。","风暴逼近时，你看见沙幕里有人影晃动：「采集人」引着蓝光，想把风暴推向塔基。你冲上去，用弓、用刀、用身体挡在塔前。","蓝光在离你三步远的地方停住了——像在风暴沟里那样，它认得你。沙幕里的人影咒骂着退去。风暴失去牵引，在塔前散成一团无力的风。","天光透亮时，观测塔完好无损。若耶喘着粗气，看着你，忽然笑了：「……行。荒原认得你，我若耶也认得你。」"],
      fail:["风暴太猛。你被沙尘掀翻，磕在塔基的石阶上，肩头撞出一片淤青（-5 HP）。若耶一把把你拖进塔内，顶着门直到风暴过去。","「傻小子。」他喘着气，声音哑了，「守塔，不是拿命填的。你得先学会在风暴里站住，再谈守塔。」"],
      crit:["你不仅挡下了风暴，还借着蓝光认出了引风的人——那个「采集人」头目，手腕上缠着红绳，跟行省老兵刀柄上的一模一样。","「红绳，行省会，南边的顾问。」你在风暴里把这些词串在一起，像一根线穿过三颗珠子，「他们是一伙的。」","若耶听了，沉默很久：「西境的账，记下了。」他拍了拍你的肩，「这条线，我们一起查到底。」"]
    },effects:{xp:50,infl:{west:10},relation:{npc:"west_ranger",delta:30},flag:"west_tower_saved"},go:"west_ranger4"},
    {t:"（引开采集人，给若耶争取时间）",check:{a:"AGI",sk:"stealth",label:"引敌"},tier:{
      ok:["你在风暴里绕到采集人侧翼，学了两声兽嚎，把他们的注意力引向沟壑方向。他们追了你半里地，等发现上当，若耶已经带着学院的人封住了塔门。","你在沟壑里躲到天明，灰头土脸地爬回来，若耶在塔门口等着你，手里端着一碗热气腾腾的风汤：「喝。荒原的规矩，出生入死的人，先喝汤。」"],
      fail:["你引敌不成，反被沙尘迷了眼，摔进一条浅沟，膝盖磕破了皮（-3 HP）。好在采集人忙着引风暴，没顾上追你。天亮时你摸回塔下，若耶已经一个人扛过了风暴。","「下次别逞能。」他把一碗风汤塞进你手里，「活着回来，比什么都强。」"],
      crit:["你不仅引开了采集人，还在他们的营地边沿发现了一辆蒙着油布的车——车上装着一箱箱兽核，箱子角上烙着一个徽记：金秤的纹样，被涂黑了一半。","「金秤家族。」你把这个发现记在心里。西境的兽核，最终流向的，不只是帝京。"]
    },effects:{xp:45,infl:{west:8},relation:{npc:"west_ranger",delta:25},flag:"west_tower_saved"},go:"west_ranger4"}
  ]
};
N["west_ranger4"] = {
  tag:"branch",
  place:"西境 · 游侠学院 · 导师居所", where:"白昼", pace:"normal",
  text:[
    "风暴过后的第二天，若耶把你叫到居所。他正在把一柄旧猎刀擦亮——刀身不长，刀柄缠着褪色的皮绳，刀鞘上刻着一道盘旋的闪电。",
    "「这把刀，跟了我二十三年。」他抬头看你，「荒原上，我不轻易送人东西。但这把刀，我打算交给你。」",
    "「不是谢礼。」他说，「是认人。荒原认你，学院认你，我若耶也认你。往后你在西境，有事，报我的名号。」",
    "他把刀递过来，刀柄温热：「带上它。西境的风暴还长，我们这些认得荒原的人，得站在一起。」"
  ],
  options:[
    {t:"（郑重接过猎刀，与若耶结为挚友）",effects:{gold:0,xp:40,relation:{npc:"west_ranger",delta:15},item:"西境猎刀"},tier:{
      ok:["你双手接过猎刀，刀入手，沉甸甸的。若耶看着你的眼睛，点了点头：「好。」","他顿了顿，又说：「学院的事，你不必都管。但你记住——西境若是再起风暴，观测塔的灯，会为你亮着。」","你走出导师居所，荒原的风迎面吹来。你握紧了刀，心里第一次觉得，这片风暴之地，有了一个可以回来的地方。","（与西境游侠导师·灰袍若耶的好感已达到挚友之境。）"]
    },go:"west_market"},
    {t:"（郑重接过猎刀，并约定继续追查红绳线）",check:{a:"INT",sk:"lore",label:"约定"},tier:{
      ok:["你接过猎刀，又提起红绳、兽核、金秤半涂的徽记。若耶沉默片刻：「这些线，你比我查得深。」","「我不拦你。但你记住：无论查到谁头上，西境的门，始终为你开着。」他伸出手，「查清楚了，回来，跟我说一声。」","你握了握他的手，转身走进荒原的风里。猎刀在腰间晃动，像西境欠你的一个回答。"],
      crit:["你不仅接过刀，还把红绳→兽核→金秤徽记这条线完整讲给了他。若耶听完，起身从箱底翻出一卷旧地图：「这是学院六十年的风暴图。塔的记录可以抄，这张图——你带上。」","「西境的账，查到底的时候，用得上。」他拍了拍你的肩，难得地笑了笑。"]
    },effects:{xp:50,relation:{npc:"west_ranger",delta:20},item:"西境猎刀",flag:"west_ledger_map"},go:"west_market"}
  ]
};
N["west_leave"] = {
  tag:"branch",
  place:"西境 · 元素荒原 · 出境隘口", where:"白昼", pace:"light",
  text:[
    "你回到入境时的隘口。界碑还是那座界碑，裹皮袍的老人还在，铁杖横在膝上，像一截枯木。",
    "他抬眼看了看你：「活着回来了？」他闻了闻空气，「身上带着风暴的味道。还带着学院的味道。」他点点头，「西境这地方，来过的人，多少会留下点东西。你留下的是好东西。」",
    "他让开一步，指向东方的官道：「去吧。西境的风，认得你了。」"
  ],
  options:[
    {t:"离开西境，返回大陆腹地",run:function(){ travelTo("free_jiaohui"); }}
  ]
};

/* /u1inj:data-nodes-end/ */
