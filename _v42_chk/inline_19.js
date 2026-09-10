
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
/* /u1inj:data-nodes:dn_acad_life.js/ */
/* ============================================================
 * B-2 学院生活系统：五学年 × 6 生活节点（共 30）
 * 链：north_academy_gate（生活区入口）→ acad_life_y1_open → ... → acad_life_y5_holiday
 * 每学年：open(学期开始+课程ifJob) / dorm(宿舍日常) / friend(同窗互动) /
 *          mid(期中考核) / final(期末排名) / holiday(假期事件)
 * 学年专属小事件：yN_open 内 req flag 一次性，读 S 状态触发
 * 弱呼应：y2/y3 埋禁书区传闻、y4 埋费尔曼教授异常（纯文本伏笔，不改判定）
 * 铁律：saveVersion=48 不变；不触碰判定公式/writeNext/choose/存档语义；
 *       新节点独立键，全部带 tag/pace/place；进蓝图 nodeIndex + 账本
 * ============================================================ */
(function(){
/* ---------- 第一学年 ---------- */
N["acad_life_y1_open"]={tag:"main",place:"艾尔达魔法学院 · 第一学年",pace:"normal",text:[
"第一学年的第一堂课，是新生向导。一个高年级学生举着一根挑着灯笼的木杆，带着你们二十来个新生穿过回廊。他一路指认：东边是食堂，开饭时跑得快才有热菜；西边是图书馆，借书要押一枚铜星；北边那栋灰楼——他忽然压低声音，只说了一句“别去”，就岔开了话头，带着你们绕过了那条走廊。",
"分班名单贴在西厅的公告板上，浆糊还没干透。你挤进人群，看见自己的名字排在一个小班底下——班里有十来个人，来自大陆各地。一个皮肤黝黑的南方少年正跟人比手画脚，说他家在海边，学会游泳前先学会了看浪；一个矮人姑娘蹲在角落，从包里掏出一块矿石，举到灯下眯着眼看。",
"课程表发下来，密密麻麻。学院不逼你选主修——但每个人都要有一门“立足的功课”。高年级学生临走时说：“头一个月，别急着表现，先弄明白食堂几点开饭、哪个教授脾气好、哪条路晚上能走。这三样，比法术重要。”",
"当晚你躺在宿舍的硬板床上，听见走廊里有人哼着陌生的调子。窗外的雪还没化，北境的夜风从窗缝钻进来，凉丝丝的。你在陌生的气味里翻了个身，想着明天要上的第一堂课。"
],options:[
{t:"去交朋友——学院里最不缺的就是人（人际网）",go:"acad_people_hub"},
{t:"【学年小事】赶去参加学院的秋日排水渠劳动（秋季例行）",req:function(){return !S.flags["acad_event_y1_done"];},effects:{flag:"acad_event_y1_done"},go:"acad_event_y1"},
{t:"【职业·魔法师】选《元素基础·火》（教授：白胡子老教习）",req:function(){return S.job==="mage";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·战士】选《剑道精义》（教授：独臂的戈拉）",req:function(){return S.job==="warrior";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·灵魂法师】选《灵魂魔法入门》（教授：墨丘利）",req:function(){return S.job==="soulmage";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·牧师】选《神术与圣典》（教授：特蕾莎嬷嬷）",req:function(){return S.job==="priest";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·盗贼】选《暗影技艺与感知》（教授：从不出现在名册上的“白先生”）",req:function(){return S.job==="rogue";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·商人】选《跨邦贸易与算术》（教授：账房出身的老莫里茨）",req:function(){return S.job==="merchant";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·术士】选《血脉共鸣初步》（教授：艾琳，出身矮人王国的女术士）",req:function(){return S.job==="warlock";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·骑士】选《誓约与守御》（教授：老骑士赫尔曼）",req:function(){return S.job==="knight";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【职业·游侠】选《荒野生存与追踪》（教授：沉默的猎手哈芙）",req:function(){return S.job==="ranger";},effects:{flag:"acad_life_y1_course",xp:15},go:"acad_life_y1_dorm"},
{t:"【学年小事·加深】去生活区深处走走（人际/见闻）",go:"acad_social_hub"},
{t:"【学年小事·加深】去修行区摸摸门道（冥想/元素池）",go:"acad_magic_hub"}
]};
N["acad_life_y1_dorm"]={tag:"main",place:"艾尔达魔法学院 · 西三舍",pace:"normal",text:[
"宿舍的日子像一锅慢慢熬的粥。凯恩每天天不亮就起来练剑，剑风从窗口灌进来，带着铁锈味；隔壁的艾莉丝隔三差五烧糊一锅汤，然后拉着全走廊的人尝“新配方”。",
"你的室友换了一茬——第一个住了三天就退学，说是“受不了北境的冷”；第二个是个沉默的东境人，每晚在灯下抄书，抄到后半夜。",
"你在床头钉了一排小木钉，挂上自己的家伙。窗台上的霜花，一天比一天厚。"
],options:[
{t:"帮艾莉丝“尝新配方”（她保证这次不会炸）",check:{a:"CON",sk:"surv",label:"试吃"},tier:{
 ok:["汤的味道奇怪，但居然不难喝。艾莉丝眼睛发亮：“我就说嘛！”她往你手里塞了一本《火系基础·入门》，扉页写着“致第一个敢吃我汤的人”。"],
 fail:["你喝了一口，胃里翻江倒海。艾莉丝慌了，手忙脚乱地给你灌水：“对不起对不起！我这次真的按食谱来了！”","你缓过来之后，她保证下次一定按两倍水煮。"],
 crit:["那碗汤出乎意料地好——她偷换了她老师的秘方。艾莉丝压低声音：“别告诉老师！这可是我偷师学来的！”","你们就此结下了“饭友”之谊。"]
},effects:{xp:10},onOk:{item:"《火系基础·入门》"},go:"acad_life_y1_friend"},
{t:"和凯恩过几招，练练身手",check:{a:"STR",sk:"fight",label:"切磋"},tier:{
 ok:["凯恩的剑又快又稳，你接了二十招，胳膊酸得像灌了铅。他收剑，难得笑了一下：“不错。比昨天强。”","他给你指了食堂后厨的“加餐”门路——练武的人，吃不够是不行的。"],
 fail:["你被他的剑背拍在肩头，差点栽倒。他扶住你：“底盘要稳。明天继续。”","虽然输了，但你记住了他收力的分寸——这个人心不坏。"],
 crit:["你和他打了三十招，竟逼他退了半步。凯恩愣了一瞬，随即大笑：“好！学院里能让我退步的人，不多。”","你们约定，每周三清晨在此过招。"],
 critfail:["他一时没收住力，你结结实实挨了一下，肩膀肿了三天。凯恩愧疚地给你送了药油：“……我下手没轻重。”","这一下让你记住了：学院里的人，个个藏着手。"]
},effects:{xp:12},onOk:{skillUp:"剑术"},go:"acad_life_y1_friend"},
{t:"早睡。北境的夜太长了",effects:{hp:15,xp:5},tier:{ok:["你早早躺下，听着窗外风声，一夜无梦。","第二天醒来，神清气爽。"]},go:"acad_life_y1_friend"}
]};
N["acad_life_y1_friend"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"食堂的桌椅是长条木桌，坐满了人。你端着餐盘，在角落找到空位。对面坐着一个戴圆眼镜的矮个子男生，正往面包上抹三层果酱。",
"他抬头看你，自我介绍：“洛卡，药剂系的。你怎么认出我的？——算了，反正你以后会记住我的，整个学院只有我往面包上抹三层果酱。”",
"他话匣子一开就收不住：哪个教授上课会睡着、哪条走廊半夜有脚步声、图书馆塔顶的灯“到底是不是活的”……"
],options:[
{t:"问他：塔顶的灯到底是怎么回事",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["洛卡压低声音：“我上一届有个学长，说他在塔顶值班那夜，看见灯自己灭了又亮——灭了三次，亮了三次。第二天，档案室就少了一份卷宗。”他缩了缩脖子，“后来没人再提这事。”","你把这个说法，和凯恩那句“灯会数人”连在一起，后背有点凉。"],
 fail:["洛卡摆摆手：“哎，传说的东西，听听就行。”他专心啃起面包，不再接话。"],
 crit:["洛卡四下看看，凑近你：“我偷偷记过——那灯亮灭的次数，和学院‘少人’的日子，对得上。”他从口袋里摸出一张皱巴巴的纸，“你看，我记了半年。”","纸上是一串日期和数字。你心头一跳：有些日子，正是你听说有人退学、离职的日子。"],
 critfail:["你问得太直白，洛卡警觉地看了你一眼，把话头岔开了。他之后几天都躲着你。"]
},effects:{},onCrit:{flag:"acad_tower_log"},go:"acad_life_y1_mid"},
{t:"和洛卡聊聊药剂系的事",effects:{xp:8},tier:{ok:["洛卡得意地掏出一小瓶药水：“我自己配的——提神用的，比学院发的强十倍。”他塞给你：“拿着，熬夜复习用得上。”"],go:"acad_life_y1_mid"}},
{t:"埋头吃饭，不掺和这些闲话",effects:{hp:8},tier:{ok:["你安静地吃完这顿饭。食堂的汤不错，管饱。"]},go:"acad_life_y1_mid"}
]};
N["acad_life_y1_mid"]={tag:"main",place:"艾尔达魔法学院 · 期中考核",pace:"normal",text:[
"期中考核来得比想象中快。考场设在西厅，长桌摆成三排，羊皮纸和墨水瓶叮当作响。",
"你面前的卷子不难，但有一道题很怪——不是课上的内容：“若第七节点失守，你作为守夜人，第一步做什么？”",
"你愣了一会儿，写下你的答案。交卷时，监考的老执事看了你一眼，又低头把你的卷子单独抽了出来。"
],options:[
{t:"按所学，认真作答（守序）",check:{a:"INT",sk:"lore",label:"作答"},tier:{
 ok:["你按学院教的标准答法写了。交卷后无事发生。几天后成绩下来，中规中矩。"],
 fail:["你写到一半卡住了，那题实在超出所学。你胡写了几句，交卷时心里发虚。成绩中下，但没人找你麻烦。"],
 crit:["你在那道题下面多写了一段自己的看法：守夜人第一步不是封门，而是“清点还活着的人”。","成绩下来那天，老执事把你叫住，递回卷子——那道题旁边批了一行字：“留盏灯。下学期来我的守夜课。”"]
},effects:{xp:20},onCrit:{flag:"acad_watch_invite"},go:"acad_life_y1_final"},
{t:"在卷子上画个圈，只答会的",effects:{xp:8},tier:{ok:["你把会的都答了，不会的留白。老执事没说什么。成绩中等偏上。"]},go:"acad_life_y1_final"}
]};
N["acad_life_y1_final"]={tag:"main",place:"艾尔达魔法学院 · 期末排名",pace:"normal",text:[
"期末排名贴出来那天，下着雪。你挤在人群里，看见自己的名字——不在最前，也不在最后，稳稳地待在中间那一栏。",
"这个位置不显眼，但安稳。你想起出发那天，老货郎说的话：“眼睛不一样的，学院会收。”",
"第一学年就这么过去了。你学会的不只是课上的东西，还有：北境的冬天怎么过，食堂几点去人最少，哪条走廊夜里不能走。",
"放假前夜，凯恩来找你：“假期你有什么打算？留校的，可以去守夜人那边帮工。”"
],options:[
{t:"留校，去守夜人那边帮工（挣点零花）",effects:{gold:15,xp:10,flag:"acad_life_y1_holiday_guard"},tier:{ok:["守夜人的活不重：巡逻、点灯、登记晚归的人。你渐渐摸清了学院夜里的规矩。","有一夜，你看见一个戴金边眼镜的身影，从图书馆方向走向灰楼。你记住了，没说。"]},go:"acad_life_y1_holiday"},
{t:"回家一趟（若家还在的话）",effects:{xp:8},tier:{ok:["你回到出发的地方。村庄、炉火、旧人——都还在。你陪母亲待了三天，又踏上了回学院的雪路。"]},go:"acad_life_y1_holiday"},
{t:"留在图书馆闭关苦读",check:{a:"INT",sk:"lore",label:"苦读"},tier:{
 ok:["你泡在图书馆过了一冬。管理员罗先生从摇头到点头，最后给你留了一盏专座灯。","开春时，你的学识扎实了不少。"],
 fail:["你读着读着就趴在桌上睡着了。醒来时，罗先生给你留了条毯子和一碗热汤。"],
 crit:["你在典藏室深处，又摸到一本没书脊的册子。翻开来，是半本日记，字迹工整：“……第七节点，裂缝在扩大。学院里，有人替他们数着日子。”","你默默记下这行字。"]
},effects:{xp:25},onCrit:{flag:"acad_diary_fragment"},go:"acad_life_y1_holiday"}
]};
/* ---------- 第二学年 ---------- */
N["acad_life_y2_open"]={tag:"main",place:"艾尔达魔法学院 · 第二学年",pace:"normal",text:[
"第二学年，课程重了一倍。教授们不再把你们当新生——第一堂课，戈拉就把剑扔在你面前：“拿起来，然后挨打。”那堂课结束，全班有半数人捂着胳膊和膝盖走出演武场，戈拉站在门口，声音不大不小：“明年这时候，我不希望再看到你们挨打的样子。”",
"课业之外，你发现学院里有些变化：禁书区的门换了新锁，锁孔周围多了一圈没见过的符文；圣痕司的灰袍执事来得更勤了，开始在走廊里站岗；有个教古代史的教授，上个月“自愿离职”，走得悄无声息，连告别课都没上。",
"接替他的人叫费尔曼——一个说话很轻、笑起来眼睛不动的中年人。他上课从不翻讲义，讲到古代封印时，会忽然停下来，看一会儿教室的某扇窗，像在确认什么。",
"洛卡偷偷跟你说：“费尔曼上课从不讲自己的出身。太干净了——学院里的人，太干净的，都该留个心眼。”",
"那天晚上你路过西厅，看见费尔曼一个人站在公告板前，看着那张“古代史教授离任”的旧告示。他站了很久，久到你把脚步放轻，绕开了那条走廊。"
],options:[
{t:"【学年小事】报名今晚的守夜人体验班（冬季夜巡）",req:function(){return !S.flags["acad_event_y2_done"];},effects:{flag:"acad_event_y2_done"},go:"acad_event_y2"},
{t:"【职业·战士/骑士】选《战阵与军团》（戈拉亲授）",req:function(){return S.job==="warrior"||S.job==="knight";},effects:{flag:"acad_life_y2_course",xp:15},go:"acad_life_y2_dorm"},
{t:"【职业·魔法师/术士】选《高阶元素与共鸣》",req:function(){return S.job==="mage"||S.job==="warlock";},effects:{flag:"acad_life_y2_course",xp:15},go:"acad_life_y2_dorm"},
{t:"【职业·其他】选一门辅修（洛卡推荐：药剂学基础）",req:function(){return true;},effects:{flag:"acad_life_y2_course",xp:12},go:"acad_life_y2_dorm"}
]};
N["acad_life_y2_dorm"]={tag:"main",place:"艾尔达魔法学院 · 西三舍",pace:"normal",text:[
"这年冬天格外冷。宿舍的窗缝结满了霜，凯恩的剑练得越来越早，天不亮就能听见院里的破风声。",
"你的东境室友走了——留了一封信：“家中有事，归期未定。”他的铺位空了三天，来了个新室友：兽人少年，叫阿塔，话少，力气大，第一晚就把床板压塌了。",
"阿塔用带着口音的通用语说：“我父亲说，学院里学的，比草原上活得更久。”他把一张狼皮铺在窗台上：“北境的冷，跟我们草原的冷不一样。这个，给你垫着。”"
],options:[
{t:"和阿塔切磋（他的力气真大）",check:{a:"STR",sk:"fight",label:"切磋"},tier:{
 ok:["阿塔的拳风像闷雷。你接下他的冲拳，胳膊震得发麻，但撑住了。他露出白牙笑：“你不错。草原上，能接我一拳的人不多。”"],
 fail:["你被他一拳震得后退三步，一屁股坐进雪堆。阿塔赶紧来拉你，满脸歉意。","你揉着胳膊，心里服气。"],
 crit:["你借他的冲劲侧身一让，反手把他带进了雪堆。阿塔在雪里愣了愣，随即大笑出声——那是你第一次听见他笑。"]
},effects:{xp:12},go:"acad_life_y2_friend"},
{t:"问他草原上的事",effects:{xp:8},tier:{ok:["阿塔讲起草原：狼旗、黑石部族、每年秋天的部族会盟。他说到“暗蚀会”三个字时，声音明显低了下去：“他们在草原上挖东西，挖了很久了。”","他顿了顿：“我父亲说，别让那东西挖到。所以把我送来了学院。”"]},go:"acad_life_y2_friend"},
{t:"把狼皮叠好收进箱底，早睡",effects:{hp:10},tier:{ok:["你把狼皮收好。那上面有草原的味道，混着北境的雪。你睡了个安稳觉。"]},go:"acad_life_y2_friend"}
]};
N["acad_life_y2_friend"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你越来越常在图书馆碰到费尔曼教授。他总是抱着一摞书，从禁书区方向出来，见到你，温和地点头：“又来看书？好习惯。”",
"有一次，你注意到他借的书——和奥利弗教授借的，是同一类：灵魂、封印、深渊。",
"管理员罗先生在你耳边嘀咕：“这两个人，借书的路数越来越像了。上次我整理书架，发现一本《深渊谱系》被借走又还回来，书页里夹着一根头发——不是人的头发。”"
],options:[
{t:"留意费尔曼教授的行踪",check:{a:"AGI",sk:"stealth",label:"留意"},tier:{
 ok:["你远远跟了费尔曼两次。他每周三深夜都会去图书馆，但从不借书——只是站在禁书区的门前，站一会儿，又离开。","他站的位置，正对着那扇新换的锁。"],
 fail:["费尔曼太警觉。你刚跟到回廊拐角，他就回头看了一眼——你赶紧低头装作看书。","之后他看你的眼神，多了一丝说不清的意味。"],
 crit:["你发现费尔曼每次离开图书馆前，都会在门口的登记簿上写点什么。趁他转身，你扫了一眼——那页上写的不是名字，是一串数字：7-3-7-1。","你抄了下来，没敢多留。"],
 critfail:["你靠得太近，费尔曼忽然停步转身，差点撞上你。他微笑着扶住你：“小心些。图书馆地滑。”","他的笑容没有温度。你后背发凉。"]
},effects:{},onCrit:{flag:"acad_ferman_digits"},go:"acad_life_y2_mid"},
{t:"把这件事告诉墨丘利教授",check:{a:"CHA",sk:"persu",label:"告知"},tier:{
 ok:["墨丘利听完，沉默了很久。他说：“费尔曼……我有印象。他是院长特聘的，背景干净得查不出任何问题。”他摘下眼镜擦了擦，“干净到这种程度，本身就是问题。”","他给你留了一句话：“别在夜里去禁书区。如果他约你去，说你在忙。”"],
 fail:["墨丘利不置可否：“学院里教授之间的往来，轮不到学生操心。”他给你倒了杯茶，岔开了话题。"],
 crit:["墨丘利听完，脸色微变。他走到门口，确认走廊没人，才压低声音：“费尔曼到任那天，档案室丢过一份卷宗——关于七节点的。”他顿了顿：“丢得无声无息。第二天，管档案的老执事就‘退休’了。”","你和他对视一眼，谁都没再说话。"]
},effects:{},onCrit:{flag:"acad_ferman_mercury"},go:"acad_life_y2_mid"}
]};
N["acad_life_y2_mid"]={tag:"main",place:"艾尔达魔法学院 · 期中考核",pace:"normal",text:[
"期中考试这天，考场里少了一个人——药剂系的洛卡没来。",
"你后来才知道，他前天夜里“误入”了禁书区，被圣痕司的灰袍执事带走问话，放回来时脸色惨白，一句话也不肯说。",
"他在食堂角落找到你，把一张纸条塞进你手里，就匆匆走了。纸条上写着一行字：“那扇门，周三晚上会开。别告诉任何人。也别去。”"
],options:[
{t:"把纸条收好，装作什么都不知道",effects:{xp:8},tier:{ok:["你把纸条叠好收进书里。洛卡之后几天都躲着人，但至少人还在。","你没有去那扇门。有些门，知道它开着，就够了。"]},go:"acad_life_y2_final"},
{t:"周三晚上，去那扇门看看",check:{a:"AGI",sk:"stealth",label:"夜探"},tier:{
 ok:["周三夜，你摸到禁书区门前。门果然虚掩着。你闪进去，看见书架最深处的地板上，有一道新刻的痕迹——像某种仪式图的一角。","你记下形状，原路退回。心跳了一整夜。"],
 fail:["你摸到门前，门是锁着的。你在阴影里等了半个时辰，一无所获，只得退回。","第二天，你发现锁换成了新的。洛卡再没给你递过纸条。"],
 crit:["你不但进去了，还在那道刻痕旁发现一张折角的纸——纸上画着一个圈，圈里一只竖瞳。和你在自由城邦见过的那枚图案，一模一样。","你把它收好。胸口像压了一块冰。"],
 critfail:["你推门的瞬间，走廊尽头的灯忽然亮了。一个灰袍执事站在阴影里，看着你。","你编了个“走错路”的借口，他盯着你看了很久，才侧身放行。","那之后，你总觉得有人在看你。"]
},effects:{},onOk:{flag:"acad_forbidden_mark"},onCrit:{flag:"acad_eye_mark"},go:"acad_life_y2_final"}
]};
N["acad_life_y2_final"]={tag:"main",place:"艾尔达魔法学院 · 期末",pace:"normal",text:[
"第二学年结束得很快。你的名字在排名榜上，往前挪了几位。",
"这一年你学会的：费尔曼每周三深夜去图书馆；禁书区的门换过三次锁；洛卡不再深夜出门。",
"放假前，阿塔要回草原。他把那床狼皮留给了你：“草原上的规矩——收了东西，就是朋友。朋友之间，不欠账。”",
"你送他到山门。他走了一段，回头喊：“如果草原出事，去狼旗下找我！”"
],options:[
{t:"送走阿塔，假期留校帮守夜",effects:{gold:12,xp:10},tier:{ok:["守夜的活你越来越熟。这一冬，你看见了三次塔灯自己亮灭。每次亮灭的第二天，学院都会少点东西——一次是档案，一次是学生，一次是教授。","你没有对任何人说。"]},go:"acad_life_y2_holiday"},
{t:"假期去艾尔达城逛逛，打听外面的消息",effects:{xp:8},tier:{ok:["城里的消息比学院鲜活：铁门关又打了一仗；东境承天城换了城主；自由城邦的商路上，有商队“整队消失”。","你把这些消息带回学院，在脑子里拼图。"]},go:"acad_life_y2_holiday"},
{t:"留在图书馆，把费尔曼那串数字查一查",check:{a:"INT",sk:"detect",label:"查索"},tier:{
 ok:["你翻遍图书馆的地图册，终于在一本旧《大陆封印纪要》的附录里，找到类似的数字：7-3-7-1——七节点编号，三号封印，七号看守，一号预案。","“预案”旁边，画着一个圈，圈里一只竖瞳。"],
 fail:["你查了一冬，一无所获。那串数字像一串无解的谜。"],
 crit:["你不但查到了含义，还在附录的夹页里发现半张地图——标着七节点的位置，其中第七节点被红笔圈了三圈，旁边写着：“已失守。静候。”","你抄下地图，原样放回。"]
},effects:{xp:22},onCrit:{flag:"acad_seven_map"},go:"acad_life_y2_holiday"}
]};
/* ---------- 第三学年 ---------- */
N["acad_life_y3_open"]={tag:"main",place:"艾尔达魔法学院 · 第三学年",pace:"normal",text:[
"第三学年，学院的空气变了。",
"教古代史的费尔曼教授，开始在课上频繁提到“古代封印术”。他讲课的方式也变了——不再绕开七节点的名字，而是把它们一个个写在黑板上，用粉笔圈起来，说：“这些节点不是石头，是会醒的东西。”有学生课后去问他，他看了那学生很久，只说：“你该问的，是它们为什么会被封起来。”",
"奥利弗教授的《梦境与灵魂》课，报名人数翻了四倍——有人说他“讲得太好了，好得像在传授什么”。课堂上他常让学生描述自己的梦，记了一本又一本，说是“研究材料”。",
"圣痕司的灰袍执事，在学院里出现的次数越来越多。他们不再只带走“涉疑”的学生——连教授的办公室，也开始被“例行检查”。有天清晨，你看见两名执事抬着一口箱子从古代史教研室出来，箱子上盖着圣痕司的封条，封条是新的。",
"食堂里，学生们压着声音传一句话：“学院里出了内鬼。有人在替圣痕司数人头。”这话传到你耳朵里时，你正端着餐盘从人群里挤出来，看见费尔曼独自坐在窗边，面前一碗汤，凉了也没动。"
],options:[
{t:"【学年小事】去花园看那株枯了三年的树（春日回暖）",req:function(){return !S.flags["acad_event_y3_done"];},effects:{flag:"acad_event_y3_done"},go:"acad_event_y3"},
{t:"【职业·任意】选《古代封印史》（费尔曼亲授）——听听他到底讲什么",req:function(){return true;},effects:{flag:"acad_life_y3_course",xp:15},go:"acad_life_y3_dorm"},
{t:"【职业·任意】选《梦境与灵魂》（奥利弗亲授）——看看他的课有什么不同",req:function(){return true;},effects:{flag:"acad_life_y3_course",xp:15},go:"acad_life_y3_dorm"}
]};
N["acad_life_y3_dorm"]={tag:"main",place:"艾尔达魔法学院 · 课堂",pace:"normal",text:[
"你选了费尔曼的课。",
"他的课讲得确实好——条理清晰，旁征博引，把古代封印术的脉络梳理得一清二楚。但越听，你越觉得不对：他讲“封印”时，眼里有一种……期待。",
"下课后，他叫住你：“你听得最认真。来，看看这个。”他展开一张羊皮纸，上面画着一个复杂的仪式阵图：“这是第七节点当年的封印阵。可惜，失守了。”",
"他抬眼，笑容温和：“如果有一天，需要有人重新把‘那东西’封回去——你会来吗？”"
],options:[
{t:"郑重回答：会",effects:{xp:10,flag:"acad_ferman_pact"},tier:{ok:["费尔曼笑了，笑得很满意：“好。记住这句话。”他把那张羊皮纸递给你：“拿着。将来，你用得着。”","你接过图纸，心里却打鼓——他说的是“封回去”，还是别的什么？"]},go:"acad_life_y3_friend"},
{t:"含糊其辞：看情况吧",effects:{xp:5},tier:{ok:["费尔曼的笑意淡了些：“看情况？也好。谨慎是好事。”他收回图纸，没再说什么。","你总觉得，他的目光在你身上多停了一息。"]},go:"acad_life_y3_friend"},
{t:"反问他：您说的‘那东西’，到底是什么",check:{a:"CHA",sk:"persu",label:"反问"},tier:{
 ok:["费尔曼沉默了一瞬，笑容不变：“你很好奇。这是好品质。”他压低声音：“‘那东西’，是深渊留在人间的一只眼睛。第七节点，是它的眼皮。”","他顿了顿：“现在，眼皮掀开了。”","你后背一凉。他笑着拍了拍你的肩：“别怕。知道的人越多，能封住它的人，就越多。”"],
 fail:["费尔曼笑着摇头：“年轻人，好奇可以，但有些问题，知道答案是要付代价的。”他转身走了。"],
 crit:["费尔曼深深看了你一眼，笑意收敛：“你这个问题，问到了点子上。”他凑近，声音低得几乎听不见：“‘那东西’在等第七个。七印齐聚，它就能睁眼。”","他直起身，又是那副温和的笑容：“好好上课。”"]
},effects:{},onCrit:{flag:"acad_seventh_secret"},go:"acad_life_y3_friend"}
]};
N["acad_life_y3_friend"]={tag:"main",place:"艾尔达魔法学院 · 同窗",pace:"normal",text:[
"这年你的朋友圈，多了一个不寻常的名字——艾莉丝。",
"她不再只是那个冒冒失失的火系少女。有一天，她把你拉到没人的角落，难得一脸严肃：“我跟你说件事，你别外传。”",
"“费尔曼教授，每周三深夜去图书馆，不是看书——他在禁书区最深那排书架后面，跟一个人说话。那个人穿着灰袍，但不是圣痕司的执事。”",
"“我认得出圣痕司的袍子。那件不一样，袖口没有银叶。”"
],options:[
{t:"问艾莉丝：你怎么会看到这些",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["艾莉丝脸一红：“我……我那天练习火系法术，把自己炸到屋顶上去了。下来的时候正好路过那扇窗。”她补充：“窗是开着的。我发誓我不是故意的！”","你哭笑不得，但记住了这个情报。"],
 fail:["艾莉丝不肯细说：“你别管我怎么看到的！反正，那个人袖口没有银叶——圣痕司的执事，袖口都有银叶，我认得。”"],
 crit:["艾莉丝压低声音：“而且——那人说话，带着你们北境的乡音。像铁门关那边的口音。”","你心头一震。铁门关……和你出发的地方，隔着一道关墙。"],
 critfail:["你问得太急，艾莉丝警觉起来：“你该不会是圣痕司的人吧？……算了，就当我没说。”她扭头跑了，之后几天都不搭理你。"]
},effects:{},onCrit:{flag:"acad_ally_clue"},go:"acad_life_y3_mid"},
{t:"郑重谢过她，把这事记在心里",effects:{xp:8},tier:{ok:["你谢过艾莉丝。她摆摆手：“朋友嘛。”","你把这个细节，和洛卡的字条、费尔曼的数字串在一起——学院的影子，越来越深了。"]},go:"acad_life_y3_mid"}
]};
N["acad_life_y3_mid"]={tag:"main",place:"艾尔达魔法学院 · 期中",pace:"normal",text:[
"期中这天，圣痕司在学院抓了人。",
"被抓的不是学生，是图书馆的管理员——罗先生。灰袍执事从他住处搜出一本《深渊谱系》的抄本，当场带走了他。",
"罗先生被拖过广场时，看见你，张了张嘴，只说了两个字：“……灯下。”",
"你站在原地，看着他被拖出山门。围观的人群很快散了，像什么都没发生。",
"当天晚上，你发现图书馆塔顶的灯，亮了三下。"
],options:[
{t:"连夜去图书馆，查罗先生留下的东西",check:{a:"AGI",sk:"stealth",label:"夜探"},tier:{
 ok:["你摸进图书馆，在罗先生常坐的登记台下，摸到一个暗格。里面有一本旧册子——记录着半年来禁书区的每一笔借阅。","翻到最后一页，你看见一行新字：“周三深夜，费尔曼借《深渊谱系》。未还。”"],
 fail:["图书馆被圣痕司贴了封条。你摸到门口，看见两个灰袍执事守着，只得退回。"],
 crit:["你不但拿到了借阅册，还在册子夹页里发现一枚旧钥匙——黄铜的，上面刻着一个圈，圈里一只竖瞳。","你把它贴身收好。罗先生留下的，不止两句话。"],
 critfail:["你撬登记台时，碰响了桌上的墨水瓶。灯光亮起，一个守夜人探进头来——你谎称找东西，他狐疑地看你半天，才让你走。"]
},effects:{},onOk:{flag:"acad_ledger_found"},onCrit:{flag:"acad_brass_key"},go:"acad_life_y3_final"},
{t:"不冒险。把“灯下”记在心里，静观其变",effects:{xp:8},tier:{ok:["你按住了好奇心。罗先生那句“灯下”，像一根刺扎在心里。","你决定等一个更安全的机会。"]},go:"acad_life_y3_final"}
]};
N["acad_life_y3_final"]={tag:"main",place:"艾尔达魔法学院 · 期末",pace:"normal",text:[
"第三学年结束。罗先生的事，学院里再没人提起——像一页被撕掉的账。",
"你的排名又往前挪了。但这一年，你学到最多的，不是书上的东西。",
"假期前夜，墨丘利教授把你叫到办公室。他给你倒了杯茶，忽然说：“学院里，有人在数日子。”",
"“数什么日子？”你问。",
"他没回答，只是看着窗外的塔灯：“等塔灯不再自己亮灭的那天——就是他们要动手的日子。”"
],options:[
{t:"问墨丘利：他们是谁",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["墨丘利沉默了很久：“圣痕司要的是‘净化’；费尔曼要的是‘封印’；还有第三拨人——他们要的是‘眼’。”他苦笑：“三拨人，都在这座学院里。你猜，谁最危险？”","你猜不到。他说：“最危险的是——知道得太少，又知道得太多的人。比如你。”"],
 fail:["墨丘利摇摇头：“知道名字没有用。知道他们在做什么，才有用。”他不再多说。"],
 crit:["墨丘利压低声音：“第三拨人，袖口没有银叶。他们自称‘看守者’，说自己在替大陆‘守眼’——但我查过，七节点早就失守了四个。他们在守的，是什么眼？”","“别信任何一边。信你自己看见的。”"]
},effects:{},onCrit:{flag:"acad_mercury_warning"},go:"acad_life_y3_holiday"},
{t:"谢过墨丘利，假期照旧",effects:{xp:8},tier:{ok:["你谢过他，走出办公室。塔顶的灯，静静地亮着。"]},go:"acad_life_y3_holiday"}
]};
/* ---------- 第四学年 ---------- */
N["acad_life_y4_open"]={tag:"main",place:"艾尔达魔法学院 · 第四学年",pace:"normal",text:[
"第四学年，你已经是学院里的“老人”了。新生见了你，会叫一声“学长”“学姐”。",
"这一年，学院的暗流终于浮上了水面——",
"先是奥利弗教授忽然离校，说是“南方来信，家中急事”。走的那天，他朝你温和地点头，像第一次见面时一样。",
"然后是费尔曼教授，开始频繁请假。有人说他“在研究大课题”，有人说他“病了”。",
"你注意到，图书馆塔顶的灯，已经一个月没有自己亮灭了。"
],options:[
{t:"【学年小事】参加夏季观星课（塔顶平台夜课）",req:function(){return !S.flags["acad_event_y4_done"];},effects:{flag:"acad_event_y4_done"},go:"acad_event_y4"},
{t:"【职业·任意】这年你选修《毕业试炼预备》（实战）",req:function(){return true;},effects:{flag:"acad_life_y4_course",xp:15},go:"acad_life_y4_dorm"},
{t:"【职业·任意】这年你选修《毕业论文·古代封印专题》（费尔曼指导）",req:function(){return true;},effects:{flag:"acad_life_y4_course",xp:15},go:"acad_life_y4_dorm"}
]};
N["acad_life_y4_dorm"]={tag:"main",place:"艾尔达魔法学院 · 西三舍",pace:"normal",text:[
"你选了费尔曼指导的论文专题。",
"他给你的题目是：《第七节点封印术的失守与重建》。他给了你一份长长的参考文献，全是禁书区的书目。",
"“这篇论文，”他说，“可能救很多人的命。也可能，让写它的人万劫不复。你自己选。”",
"他把一支羽毛笔推到你面前。笔尖是新削的，泛着冷光。"
],options:[
{t:"接过笔，写下去",effects:{flag:"acad_thesis_accepted",xp:15},tier:{ok:["你接过笔。费尔曼笑了：“好。每周三深夜，禁书区，我单独辅导你。”","你点头。心里清楚，这条路的每一步，都在往深水里走。"]},go:"acad_life_y4_friend"},
{t:"推回笔：我想换个题目",effects:{xp:5},tier:{ok:["费尔曼看着被推回的笔，笑意不减：“谨慎，是学者最好的品质。”他收回提纲，“那就写《古代封印术的伦理沿革》吧。同样是好题目。”","你松了口气。但你知道，他记住了你的拒绝。"]},go:"acad_life_y4_friend"}
]};
N["acad_life_y4_friend"]={tag:"main",place:"艾尔达魔法学院 · 禁书区（周三夜）",pace:"normal",text:[
"每周三深夜，你跟着费尔曼进禁书区。",
"他教你解读封印阵图、辨认深渊谱系的文字、分辨“眼”与“瞳”的区别。他说得很慢，讲得很细，像一个真正的好老师。",
"但有一夜，他讲完课，没有立刻走。他站在书架最深处，忽然说：“你知道为什么第七节点会失守吗？”",
"“因为守它的人，认为封印是永恒的。”他转身，看着你，“没有什么是永恒的。封印会松，人会老，誓言会忘。”",
"“所以，真正能守住那东西的，不是封印——是有人记得它还在。”"
],options:[
{t:"问他：您是要我记住它吗",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["费尔曼笑了，笑得很轻：“不。我是要你记住——你今晚听到的每一个字，都别对任何人说。”他顿了顿，“包括墨丘利。”","你看着他，忽然明白了什么。他不是要教你封印。他是在找一个“会闭嘴的人”。"],
 fail:["费尔曼摇头：“记住不是目的。理解才是。”他没再多说，收拾好书卷离开了。"],
 crit:["费尔曼深深看着你，良久，说：“你和我年轻时，很像。”他第一次，露出一个不带笑意的表情——疲惫的，像走了很远的路。“我年轻时也以为，自己是在守护。”","“后来我才知道，我被用了一辈子。”","“别走我的老路。”"]
},effects:{},onCrit:{flag:"acad_ferman_confession"},go:"acad_life_y4_mid"},
{t:"沉默地点头，不再追问",effects:{xp:8},tier:{ok:["你点头。费尔曼也没再说话。","那一夜，禁书区的灯，一直亮到天明。"]},go:"acad_life_y4_mid"}
]};
N["acad_life_y4_mid"]={tag:"main",place:"艾尔达魔法学院 · 期中",pace:"normal",text:[
"期中前几天，艾莉丝急匆匆来找你：“费尔曼教授，上周没去图书馆。”",
"“你怎么知道？”",
"“我……我最近在替他整理办公室。”她脸一红，随即压低声音：“我在他抽屉里，看见一封信。只扫到一句——‘第七个已就位。灯灭之日，即为睁眼之时。’”",
"“他落款写的是……‘看守者·席恩’。”",
"你手里的笔，停住了。"
],options:[
{t:"立刻去找墨丘利",check:{a:"CHA",sk:"persu",label:"告知"},tier:{
 ok:["墨丘利听完“看守者·席恩”五个字，脸色第一次变了。他沉默了很久，才说：“席恩……是我年轻时的一个学生。他失踪了二十三年。”","“他当年说过一句话：封印这东西，与其守着，不如毁掉重来。”墨丘利的声音干涩，“他失踪前，去了第七节点。”"],
 fail:["墨丘利听完，只是皱了皱眉：“艾莉丝那丫头，看错了吧。”但他的手指，在桌面上轻轻敲了三下——那是他不安时的习惯。"],
 crit:["墨丘利关上门，压着声音说：“如果真是席恩——学院里那三拨人，就要合流了。”他顿了顿：“净化、封印、睁眼。三拨人盯上的是同一扇门。”","“而那扇门的钥匙……”他看向你，“可能已经在你手里了。”","你想起那枚黄铜钥匙，胸口一紧。"]
},effects:{},onCrit:{flag:"acad_sein_alias"},go:"acad_life_y4_final"},
{t:"不动声色，继续观察",effects:{xp:8},tier:{ok:["你把“席恩”两个字记在心里，像记一根刺。","你继续每周三深夜去禁书区，装作什么都不知道。"]},go:"acad_life_y4_final"}
]};
N["acad_life_y4_final"]={tag:"main",place:"艾尔达魔法学院 · 期末",pace:"normal",text:[
"第四学年结束那天，费尔曼教授提交了辞呈。",
"“家中有事。”他对院长说。院长没有挽留。",
"他走之前，在教室门口等你。他递给你一本薄薄的手抄本：“这是我这些年的笔记。你写得比我好，留给你。”",
"你接过时，他压低声音说了一句：“灯灭之日，即是睁眼之时。别让那扇门，从你手里打开。”",
"然后他走了，像他来时一样，干净得查不出任何问题。",
"那天夜里，图书馆塔顶的灯，第一次在你注视下，自己灭了。"
],options:[
{t:"连夜检查那本笔记",effects:{xp:10},tier:{ok:["笔记里夹着一张纸条：“第七节点的封印阵图，在圣城大教堂地下。钥匙在守夜人手里。”","你合上笔记，窗外的塔灯，重新亮了。"]},go:"acad_life_y4_holiday"},
{t:"把笔记收好，等一个合适的时机",effects:{xp:8},tier:{ok:["你把笔记锁进箱底。学院第五年，就要来了。"]},go:"acad_life_y4_holiday"}
]};
/* ---------- 第五学年 ---------- */
N["acad_life_y5_open"]={tag:"main",place:"艾尔达魔法学院 · 第五学年",pace:"normal",text:[
"第五学年，毕业年。",
"学院的暗流，在这年夏天彻底浮出水面：",
"圣痕司发布了新的净化令——对象不再是奥术师，而是“一切与古代封印有关的学者”。",
"墨丘利教授被约谈，三天没来上课。回来时，他瘦了一圈，只说：“他们要我交出学生名单。我没交。”",
"你的毕业试炼，定在秋季。试炼题目发下来那天，你看着那张纸，很久没说话——",
"题目只有一行字：“若封印已失守，你选择：封印、净化、还是睁眼？”"
],options:[
{t:"【学年小事】在回廊看新生入学（毕业年秋）",req:function(){return !S.flags["acad_event_y5_done"];},effects:{flag:"acad_event_y5_done"},go:"acad_event_y5"},
{t:"【职业·任意】参加毕业试炼（实战）",req:function(){return true;},effects:{flag:"acad_life_y5_course",xp:15},go:"acad_life_y5_dorm"},
{t:"【职业·任意】先去找墨丘利，问清楚净化令的事",req:function(){return true;},effects:{flag:"acad_life_y5_course",xp:15},go:"acad_life_y5_dorm"}
]};
N["acad_life_y5_dorm"]={tag:"main",place:"艾尔达魔法学院 · 墨丘利办公室",pace:"normal",text:[
"墨丘利坐在办公室里，桌上堆着没拆的信。他见你进来，苦笑：“你来晚了——他们刚走。”",
"“净化令的事，是真的。圣痕司给学院下了最后通牒：交出名册，或者学院‘配合调查’。”",
"他看着你，目光很复杂：“我教了三十年书。三十年来，我告诉每一个学生：先识己，后识人。”",
"“今天我想告诉你另一句话：有时候，识己比识人难得多——因为你得先承认，自己站在哪一边。”"
],options:[
{t:"回答他：我站在自己看见的那一边",effects:{xp:12,flag:"acad_life_y5_stand"},tier:{ok:["墨丘利看着你，很久。然后他笑了，笑得很轻：“好。记住你今天的话。”","他从抽屉里取出一样东西递给你——一枚旧徽章，刻着银叶：“这是学院守夜人首席的信物。三十年，我只送出去过三枚。”","“第四枚，是你的。”"]},go:"acad_life_y5_friend"},
{t:"反问他：您站在哪一边",check:{a:"CHA",sk:"persu",label:"反问"},tier:{
 ok:["墨丘利沉默了很久：“我站在学生这一边。”他顿了顿，“也站在真相这一边——虽然这两边，常常不是同一个方向。”","他苦笑：“所以我才教了三十年书，而没当上院长。”"],
 fail:["墨丘利摇头：“我哪边都不站。我教书。”","但你注意到，他说这话时，握着茶杯的手，轻轻抖了一下。"],
 crit:["墨丘利站起身，走到窗前：“我年轻时，也收到过一枚这样的徽章。送徽章的人，后来去了第七节点，再没回来。”","“他叫席恩。费尔曼……是他。”"]
},effects:{},onCrit:{flag:"acad_mercury_sein"},go:"acad_life_y5_friend"}
]};
N["acad_life_y5_friend"]={tag:"main",place:"艾尔达魔法学院 · 毕业试炼场",pace:"normal",text:[
"毕业试炼在学院的演武场举行。",
"试炼分两场：第一场考实战，第二场考心性。",
"实战你打得干净利落——五年的课上下来，你的根基早已扎实。",
"第二场，主考官把一张卷子放在你面前，上面只有一个问题：“你这一生，最想守护什么？”",
"你提笔，写下答案。主考官看了很久，没有点评，只在卷尾盖了学院的银叶印。"
],options:[
{t:"写下你的答案（按你的理想）",effects:{xp:15},tier:{ok:["你写下的答案，和你出发那天在路口说的话，是同一句。","主考官合上卷子，说了句：“很好。没有变过的人，值得毕业。”"]},go:"acad_life_y5_mid"},
{t:"写下：守护这座学院",effects:{xp:12},tier:{ok:["你写的是“守护这座学院”。","主考官看了你一眼，难得露出一点笑意：“学院需要记得它的人。”"]},go:"acad_life_y5_mid"}
]};
N["acad_life_y5_mid"]={tag:"main",place:"艾尔达魔法学院 · 毕业典礼前夜",pace:"normal",text:[
"毕业典礼的前一夜，你失眠了。",
"你坐在西三舍的窗台上，看着图书馆塔顶的灯。它今晚没有自己灭——安安静静地亮着，像一个终于睡着了的人。",
"五年，你从铁门关外的村庄，走到这座大陆最古老的知识圣地。你学会了很多，也失去了一些。",
"你想起母亲灶台上的面团；想起老货郎那句“眼睛不一样的，学院会收”；想起凯恩的剑、艾莉丝的汤、阿塔的狼皮、洛卡的字条、墨丘利的徽章、费尔曼的笔记。",
"塔顶的灯，忽然亮了第三下——然后，稳稳地，亮住了。",
"明天，就是毕业典礼了。"
],options:[
{t:"入睡。明天，是毕业的日子",effects:{hp:20,xp:10},tier:{ok:["你躺下，闭上眼。北境的风，在窗外吹了一夜。","五年，一晃就过去了。"]},go:"acad_life_y5_final"}
]};
N["acad_life_y5_final"]={tag:"main",place:"艾尔达魔法学院 · 毕业典礼",pace:"normal",text:[
"毕业典礼在中央广场举行。和五年前开学典礼时一样，法神黄林晶的石像立在广场中央，负手而立。",
"你站在毕业生队列里，抬头看那座石像。五年前，你在这里听见院长说“塔顶的灯，不是用来数的”；五年后，你终于明白那句话的意思。",
"院长念到你的名字时，你走上前。他递给你毕业证书，忽然压低声音说了一句只有你听得见的话：",
"“学院欠你的，会在你需要的时刻，还你。记住——灯灭之日，去找守夜人。”",
"你接过证书。掌声如潮。",
"你走下台阶，穿过人群。北方的天边，有一线极淡的红——像五年前你出发那晚，看到的一模一样。",
"你终于，毕业了。"
],options:[
{t:"转身，正式踏出学院（进入主线）",effects:{flag:"acad_life_complete",xp:50},go:"north_academy_2"}
]};
})();

/* /u1inj:data-nodes:dn_acad_life_deep.js/ */
/* ============================================================
 * B-5 学院生活加密：五学年 × 6 深潜节点（共 30）
 * 链：acad_life_yN_open（入口选项）→ acad_deep_yN_class → _practice → _library → _town → _market → _night → acad_life_yN_friend（接回主线）
 * 学年主题：y1 新生适应 / y2 课程加重+费尔曼异常 / y3 战争阴影 /
 *           y4 暗流涌动（第七节点/塔顶灯） / y5 毕业抉择
 * 铁律：saveVersion=48 不变；不触碰判定公式/writeNext/choose/存档语义；
 *       全部带 tag/place/pace；中文引号成对；禁 30 治理词；go 全部存在
 * ============================================================ */
(function(){
/* ================= 第一学年 ================= */
N["acad_deep_y1_class"]={tag:"main",place:"艾尔达魔法学院 · 第一学年课堂",pace:"normal",text:[
"第一堂魔法基础课，老教习端着一盏煤油灯进来，先不说话，把灯放在讲台中央，绕着走了一圈。满屋子新生屏住呼吸。他忽然吹熄了灯，黑暗里只有他的声音：“谁能让它再亮起来？”",
"有人念咒，有人挥手，有人把脸憋得通红。灯纹丝不动。你想起村里铁匠铺的老法子——火种不是念出来的，是引出来的。你摸出怀里的火镰，咔哒一擦，火星溅上灯芯，灯亮了。",
"老教习点了点头：“记住这堂课。法术的根，是你们身上本来就有的东西。学院教的是怎么把它放出来，不是怎么把它变出来。”他顿了顿，“你们之中，有人一辈子都在等一盏别人点的灯。”"
],options:[
{t:"课后找他请教火系基础",check:{a:"INT",sk:"lore",label:"请教"},tier:{
 ok:["老教习把灯芯拨短：“火性烈，养在灯里才听话。你学法术也一样——先学会把火关小，再学怎么放它出来。”他塞给你一卷发黄的讲义。","这卷讲义上的批注，比正文还密。"],
 fail:["你问得太大，老教习摆摆手：“先把今晚的灯学会了再说。”他转向下一个学生，你没再插上话。"],
 crit:["你问的是灯芯为什么拨短火就小。老教习看了你很久：“十年来，你是第一个问这个的。”他给你留了地址——学院地下炼炉，周三晚可以去找他。"],
 critfail:["你追着问了三个问题，老教习皱起眉头：“贪多嚼不烂。”他转身走了，你站在原地，脸上发热。"]
},effects:{xp:15},onCrit:{flag:"acad_furnace_key"},go:"acad_deep_y1_practice"},
{t:"和邻座的同学交换讲义笔记",effects:{xp:8},tier:{ok:["邻座是那个戴圆眼镜的洛卡。他飞快地抄着板书，字小得跟蚂蚁似的：“我这笔记，整个学院独一份。”","你翻了一页，确实——他把老教习每句话都记了，连叹气都标了页码。"]},go:"acad_deep_y1_practice"},
{t:"趴在桌上眯了一会儿",effects:{hp:10},tier:{ok:["你半梦半醒间，听见老教习说：“……有些孩子，是睡够了才学得进的。”你睁开眼，他正看着你，居然没生气。"]},go:"acad_deep_y1_practice"}
]};
N["acad_deep_y1_practice"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"演武场在学院东角，一片夯实的沙地，四周围着旧木桩。初雪刚停，沙地上还渗着水汽。独臂的戈拉站在场地中央，用仅剩的那只手拎着一柄练习木剑。",
"新生的第一课是挨打。他让所有人轮番攻他，木剑横拍竖挡，每个人都在三招内被点了手腕或膝盖。轮到你了，他看了你一眼：“拿稳。”",
"你的剑刚递出去，他的剑背已经贴在你小臂上——不快，但稳得像钉在木头上。你手腕一麻，剑差点脱手。戈拉收了剑：“不错，没丢。头一回不丢剑的，十个里有一个。”"
],options:[
{t:"请他指点剑势",check:{a:"STR",sk:"fight",label:"学剑"},tier:{
 ok:["戈拉用剑尖在地上画了个圈：“你的劲使在手上，没使在腰上。剑是腰的延伸，不是手的。”他示范了一式，“回去对着水缸练，练到水不晃。”"],
 fail:["戈拉只说了句“再练”，就去指点别人了。你站在原地，把他的话又嚼了一遍。"],
 crit:["你把他画的圈记住了，又问了句：“那断臂之后，您怎么练？”戈拉沉默了一会儿：“左手断了，就用右手。右手学会了，就明白以前左手错了什么。”","他破例多教了你一式收剑。"],
 critfail:["你急着想赢，动作变形，被他一眼看穿：“心浮了。今天就到这。”他转身离开，你攥着剑柄，指节发白。"]
},effects:{xp:15},onCrit:{flag:"acad_sword_insight"},go:"acad_deep_y1_library"},
{t:"自己在角落练基础劈砍",effects:{xp:10},tier:{ok:["你对着木桩练了一百下劈砍。寒风把耳朵吹得生疼，但到后来，手臂记住了那股劲道。","收剑时，你发现戈拉站在远处看了你一会儿，没说啥，走了。"]},go:"acad_deep_y1_library"},
{t:"去场地边的水缸喝水歇脚",effects:{hp:10},tier:{ok:["你蹲在水缸边舀水喝，看见水面上自己的影子——鼻尖冻得通红，眼睛却很亮。你冲自己笑了一下。"]},go:"acad_deep_y1_library"}
]};
N["acad_deep_y1_library"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"图书馆的顶梁很高，旧书架一排排立着，光线从高窗斜进来，浮尘在光柱里慢慢飘。管理员罗先生戴着套袖，正在整理借书卡，头也不抬：“新来的？借书押一枚铜星，一次三本，月底还。”",
"你在一排书脊前站住。《大陆通史》《北境风物志》《符文入门》。罗先生不知何时走到你身后，抽出一本落了灰的册子：“这个你暂时借不了——需要教授签字。”封面上没写书名，只压着一个烫金纹章。",
"你问他为什么。罗先生压低嗓门：“这是灰楼的目录。灰楼，你上回是不是有人跟你说，别去？”他看了你一眼，把册子放回原处，像什么都没发生。"
],options:[
{t:"借《北境风物志》，回去细读",check:{a:"INT",sk:"lore",label:"研读"},tier:{
 ok:["书里夹着一张旧地图，标注着北境各城镇与要塞。铁门关旁边，有人用铅笔写了三个字：“守不住。”墨迹很旧，边缘发毛。"],
 fail:["你翻了几页，困意上涌。北境的风土记写得又长又细，你只记住了一件事：铁门关的城墙是双层的，里层用黑石砌成。"],
 crit:["你对照地图与旧档，发现铁门关的黑石内墙与学院灰楼用的是同一种石材。这个发现让你在书页间夹了片枫叶作记号。"],
 critfail:["你读得太入神，错过了晚饭。等抬起头，图书馆只剩你一个人，高窗外的天已经黑透了。"]
},effects:{xp:15},onCrit:{flag:"acad_blackstone_note"},go:"acad_deep_y1_town"},
{t:"问罗先生灰楼的事",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["罗先生沉默了一会儿：“灰楼是老楼，学院建起来之前就在。里面放的不是书，是‘记录’。”他不再多说，转身去整理书架。"],
 fail:["罗先生看你一眼：“打听这个做什么？专心念书。”他走开了，你没能再问。"],
 crit:["罗先生四下看了看，从柜台底下摸出一把旧钥匙：“这是灰楼侧门的。你要真想知道，自己去看看——但别碰任何写着‘第七节点’的卷宗。”","他叮嘱你，钥匙只能借一天。"],
 critfail:["你问得急了，罗先生的脸冷下来：“年轻人，有些门，不该开的别开。”他把借书卡拍在柜台上，不再理你。"]
},effects:{xp:10},onCrit:{flag:"acad_gray_key_hint"},go:"acad_deep_y1_town"},
{t:"借一本诗集，消磨时光",effects:{xp:5},tier:{ok:["你借了本旧诗集。扉页上有前人用铅笔写的一行小字：“灯亮了，人走了。”不知是谁，也不知是什么时候写的。"]},go:"acad_deep_y1_town"}
]};
N["acad_deep_y1_town"]={tag:"main",place:"艾尔达魔法学院 · 山门外小镇",pace:"normal",text:[
"学院山门外，隔着一条冻河，有个叫“白桦镇”的小集市。每逢赶集日，学院的仆役和轮休的学生都会去。你也跟着人流走了一趟。",
"镇口的老屠户认得学院的袍子，递给你一碗热羊杂汤：“新来的？喝碗汤，北境的冷不是靠袍子挡的，是靠肚子。”汤很烫，胡椒放得足，一碗下去，五脏六腑都活过来。",
"镇上有家铁匠铺，炉火整日不熄。你路过时，看见一个戴金边眼镜的中年人正在挑一把匕首——不是学院配发的那种，是军用短刃。他付钱时用的是银月币，出手很阔。你认出那是新来的费尔曼教授。"
],options:[
{t:"跟上去看看费尔曼去做什么",check:{a:"AGI",sk:"stealth",label:"跟踪"},tier:{
 ok:["费尔曼买完匕首，又去了镇尾的旧货铺，买了一只黄铜罗盘，然后顺着河沿走回学院，一路没回头。你远远缀着，没被他发现。","那把匕首和罗盘，都掖进了他袍子里。"],
 fail:["你跟了几步，被集市上的人流挤散了。等再看见他，他已经走远了，只留给你一个背影。"],
 crit:["你隔着半条街，看见他在河边停下，从怀里摸出那把匕首，在月光下翻看了一会儿，又收回去。他抬头望了一眼学院灰楼的方向，那一眼很冷。","你记住了这个动作。"],
 critfail:["你贴得太近，踩断了一根冻枝。费尔曼回过头，目光扫过来，你赶紧蹲进货摊后面。他看了几息，转回身走了，但你知道他看见了。"]
},effects:{xp:12},onCrit:{flag:"acad_ferman_knife"},go:"acad_deep_y1_market"},
{t:"在老屠户摊上坐一会儿，听镇上的闲话",effects:{xp:8},tier:{ok:["老屠户一边剁骨头一边说：“你们学院，这些年净出怪事。前年有个教授，半夜在河滩上烧纸，被巡夜的撞见，说是‘祭老朋友’。”他把声音压到极低，“烧完，河面上飘了三天白雾。”"]},go:"acad_deep_y1_market"},
{t:"在铁匠铺看一会儿打铁",effects:{xp:8},tier:{ok:["铁匠把一块赤铁烧得通红，抡锤砸下去，火星溅开。你看了一会儿，他抬头：“想学？先交三个铜星，买块铁练手。”","你掂了掂口袋，没舍得。但你看清了他打铁的手法——跟戈拉说的剑势，是同一个道理：劲在腰上。"]},go:"acad_deep_y1_market"}
]};
N["acad_deep_y1_market"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"市集上最热闹的摊子是个卖护符的老妇人。她的摊布上摆满了各种小物件：狼牙、铜铃、褪色的布条、刻着符文的骨片。她招呼你：“学生郎，买一个吧。北境邪性重，护身要紧。”",
"你随手拿起一个铜铃，底部刻着一行极小的字：“第七节点”。你问这是什么。老妇人的手顿了一下，把铜铃从你手里拿回去：“这个不卖。我收摊前忘了收起来。”",
"她飞快地收拾摊布，临走时看了你一眼：“娃娃，有些东西，挂在身上未必是护身，也可能是记号。别乱碰。”"
],options:[
{t:"花三个铜星买一枚普通狼牙护符",effects:{gold:-3,xp:5},tier:{ok:["老妇人把狼牙用红绳穿好，挂在你脖子上：“狼牙认主，护的是认得路的人。”她顿了顿，“学院里的路，不比野外的路好走。”"]},go:"acad_deep_y1_night"},
{t:"追问第七节点的事",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["老妇人四下看了看：“第七节点，是老话里的东西。学院底下，有七根柱子，撑着什么。第六根好好的，第七根——”她摇摇头，“我没见过，我是听我阿婆说的。”"],
 fail:["老妇人摆摆手：“不知道，不知道。你走吧。”她转过去收拾摊子，不再理你。"],
 crit:["老妇人压着嗓子：“阿婆说过，第七根柱子裂了。裂缝里出来的东西，会借人的名字走路。”她盯着你，“你要是哪天在学院里，遇见一个认识你、你却从没见过的人——别应他。”","她没收你的钱，把那个铜铃塞给你：“带着。能挡一次。”"],
 critfail:["你问得太紧，老妇人慌了，抱着摊布快步走了。铜铃的事，你什么都没问出来。"]
},effects:{xp:15},onCrit:{flag:"acad_seventh_node_warn",item:"铜铃"},go:"acad_deep_y1_night"},
{t:"买一包炒栗子，边走边吃",effects:{gold:-1,hp:8},tier:{ok:["炒栗子又甜又烫，你揣在怀里往回走。学院山门的灯火在雪夜里亮着，像一捧不会熄的火。","你分了一半给守门的兽人门房，他咧开嘴，用拳头捶了捶胸口。"]},go:"acad_deep_y1_night"}
]};
N["acad_deep_y1_night"]={tag:"main",place:"艾尔达魔法学院 · 西三舍夜话",pace:"normal",text:[
"夜深了，宿舍走廊安静下来。你坐在窗台上，看着外面的雪。北境的雪下得密，一片一片，把白桦镇的灯火裹进毛茸茸的夜里。",
"同宿舍的凯恩也没睡，抱着剑靠在门框上：“第一天感觉怎么样？”他问得随意，眼睛却看着窗外，像在替你看更远的地方。",
"你没答好或不好，反问他：“你为什么来学院？”凯恩沉默了一会儿：“我父亲是铁门关的守备军官。他说，这个世界要变天了，让我学点真本事。”他低头看着剑鞘，“我不想再像他一样，只能看着。”"
],options:[
{t:"跟凯恩聊到半夜",effects:{xp:10,relation:{npc:"acad_kain",v:5}},tier:{ok:["你们聊到灯花结了又开。凯恩难得话多，讲他小时候在铁门关城墙上数烽火台：“一共十三个。现在还剩几个亮着，没人敢数。”","他走的时候拍了拍你肩膀：“晚安。明天一起练剑。”"]},go:"acad_life_y1_friend"},
{t:"一个人看一会儿雪，然后睡",effects:{hp:12},tier:{ok:["你看着雪把屋檐的轮廓一层层垫厚，心里反而安静下来。你关好窗，钻进被窝。","梦里，你梦见一盏灯，在一条很长的走廊尽头，亮着。"]},go:"acad_life_y1_friend"},
{t:"写一封家书，报个平安",effects:{xp:5,flag:"acad_letter_y1_sent"},tier:{ok:["你就着油灯写信，写学院、写雪、写食堂的汤。写到“我在这里挺好的”时，笔停了一会儿。","你把信折好，打算明天托门房寄出去。"]},go:"acad_life_y1_friend"}
]};
/* ================= 第二学年 ================= */
N["acad_deep_y2_class"]={tag:"main",place:"艾尔达魔法学院 · 第二学年课堂",pace:"normal",text:[
"第二学年的第一堂古代史，换成了费尔曼教授。他站在讲台前，不翻讲义，声音不轻不重：“上一任教授讲到哪里，你们不必知道。我们从‘封印’讲起。”",
"他转身在黑板上画了一条波浪线：“这是深渊与大陆的交界。一千年前，先贤们用七根锚，把它钉住了。七根锚，七个节点，七个守夜人。”他顿了顿，“书上只写了六根。第七根，是空白。”",
"有学生问：“那第七根呢？”费尔曼笑了笑——笑得很淡，眼睛没动：“书上没有的，我也不能讲。留给你们自己去找。”他继续讲课，但那一整堂课，你都在琢磨他那句话。"
],options:[
{t:"课后拦住费尔曼，问第七根锚的事",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["费尔曼抱着讲义，语气温和：“你很有好奇心。但有些事，知道得太早，不是好事。”他顿了顿，“等你在学院待满四年，如果还问，我告诉你。”","他把这句话说得很轻，像在掂量你够不够格。"],
 fail:["费尔曼只是笑着摇头：“这个问题，我没有答案给你。”他走了，你站在原地，只觉得他那句话留了半截。"],
 crit:["费尔曼看了你很久，忽然说：“你问的方式，像一个老朋友的问法。”他收起笑，“第七根锚……在北境，不在学院。但盯着它的人，一直没走。”","这是他说过的最直白的一句话。"],
 critfail:["你追问得紧，费尔曼的笑容收了起来：“这个话题，到此为止。”他转身离开，步伐比平时快了几分。"]
},effects:{xp:15},onCrit:{flag:"acad_seventh_anchor"},go:"acad_deep_y2_practice"},
{t:"跟洛卡讨论这节课的内容",effects:{xp:8},tier:{ok:["洛卡推了推眼镜：“七个节点，书上只写了六个——你品品，这像不像老师故意留的钩子？”他话声放轻，“我查过旧档案，第七节点的卷宗，全在灰楼。”","他眼睛亮了一下，“灰楼，听说过吧？”"]},go:"acad_deep_y2_practice"},
{t:"记下费尔曼说的每一个字",effects:{xp:10,flag:"acad_ferman_notes"},tier:{ok:["你在笔记上写下费尔曼讲的每句话。写到“第七根，是空白”时，笔尖停住。你在这行字下面画了一道线，又画了一道。","这道线，日后会带你去很多地方。"]},go:"acad_deep_y2_practice"}
]};
N["acad_deep_y2_practice"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"这学年的演武场比上一年冷清。战争的消息像北风一样灌进来，几个高年级学生被家里召回去了——铁门关吃紧，边境的庄园都在抽人。",
"戈拉站在场地中央，看着剩下的学生：“走了的，是回家。留下的，是守在这里。”他拎起木剑，“不管你们为什么留下，我把话放这儿：学院这块牌子，只要我还活着，就不会倒。”",
"他今天教的是一套守势。剑不出鞘，只挡不攻：“先学会不输。赢的事，以后再说。”他示范了三遍，每一遍都慢，让你能看清他的腰、他的脚、他那只独臂的重心。"
],options:[
{t:"认真练这套守势",check:{a:"STR",sk:"fight",label:"苦练"},tier:{
 ok:["你练到胳膊发酸，终于把那套守势磨顺了。戈拉难得点头：“挡得住，才谈得上别的。”他破例多留你一刻钟，教你一个反手架剑的巧劲。"],
 fail:["守势看着简单，做起来处处别扭。你练得满头汗，剑还是抖。戈拉说：“心不静，手就飘。明天再来。”"],
 crit:["你不仅学会了，还发现守势里藏着三个反击的空档。你演示给戈拉看，他沉默半晌：“……这是我断臂之后，花了三年才想明白的东西。你一个月就看出来了。”","他看你的眼神，开始不一样了。"],
 critfail:["你练得太猛，虎口裂了一道口子。戈拉给你扔了卷绷带：“欲速则不达。先养伤。”"]
},effects:{xp:18},onCrit:{flag:"acad_guard_insight"},go:"acad_deep_y2_library"},
{t:"和凯恩对练守势",effects:{xp:12,relation:{npc:"acad_kain",v:5}},tier:{ok:["凯恩攻，你守。他的剑又快又密，你只能稳住阵脚。三十招后，他收剑：“守得不错。换我守，你攻。”","这种拆招，比一个人闷头练强得多。"]},go:"acad_deep_y2_library"},
{t:"在演武场边看高年级对练",effects:{xp:8},tier:{ok:["高年级的对练是真刀真枪，木剑也能打出火星。你坐在场边看了一个时辰，把他们的攻防节奏记在心里。","其中一个高年级学生收剑时看了你一眼：“看会了？下次来练练。”"]},go:"acad_deep_y2_library"}
]};
N["acad_deep_y2_library"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你越来越常待的图书馆，这学期多了些新面孔——都是圣痕司的灰袍执事，他们不是来看书的，只是站在书架间，偶尔抽出一本，翻两页又放回去。",
"罗先生对此视而不见，只在灰袍人走远后，才在你耳边说：“圣痕司在找东西。找什么，他们不说，我也不问。”他擦着柜台，“你最近借的书，他们看过三回了。”",
"你低头看你借的那摞书：《北境封印考》《锚点与守夜人》《灰楼建筑史》。罗先生叹了口气：“年轻人，书是给人读的，也是给人看的。你读什么，就有人知道你在想什么。”"
],options:[
{t:"换一批无关紧要的书，掩人耳目",check:{a:"INT",sk:"lore",label:"掩护"},tier:{
 ok:["你把《封印考》夹进一本《北境食谱》里，又借了《畜牧与兽疫》。灰袍执事再来看时，只看见一摞农书，翻了翻，走了。","你松了口气，罗先生冲你眨了眨眼。"],
 fail:["你手忙脚乱地换书，反而让灰袍执事多看了你几眼。他们记下了你的名字，没说什么，走了。"],
 crit:["你不仅换了书，还特意在《畜牧与兽疫》里夹了几张农学笔记。灰袍人翻过后，彻底把你划进了“无足轻重”那一栏。","罗先生事后夸你：“够聪明。书要读，命也要惜。”"],
 critfail:["你藏得不够干净，《封印考》的封皮露了一半。灰袍执事抽出那本书，翻了两页，看了你一眼。那一眼让你后背发凉。"]
},effects:{xp:12},onCrit:{flag:"acad_mask_done"},go:"acad_deep_y2_town"},
{t:"索性当着他们的面读《封印考》",effects:{xp:10,flag:"acad_defiant_read"},tier:{ok:["你索性把《封印考》摊在桌上，光明正大地读。灰袍执事看了你一会儿，竟然没上前。","罗先生事后说：“他们怕的是太聪明的人，和太蠢的人。你这种‘不怕’的，他们反倒拿不准。”"]},go:"acad_deep_y2_town"},
{t:"请教罗先生：圣痕司到底在找什么",check:{a:"CHA",sk:"persu",label:"套话"},tier:{
 ok:["罗先生压低嗓门：“圣痕司在找一份名单。名单上的人，都跟‘第七节点’有关。”他顿了顿，“你别问我是怎么知道的。你只要知道，你最近读的这些书，够把你写进名单了。”"],
 fail:["罗先生摇摇头：“这个，我帮不了你。有些事，知道得越少，睡得越安稳。”"],
 crit:["罗先生沉默了很久，从柜台底下拿出一张泛黄的纸条：“这是我十年前的笔记。上面记着七个名字——都是灰楼‘记录’里的人。现在，只剩三个还活着。”","他把纸条推给你，又收回去了：“看完了，忘掉。”"],
 critfail:["你套话的意图太明显，罗先生警觉地看了你一眼：“你在试探我？”他冷下脸，“回去吧。以后借书，先填申请表。”"]
},effects:{xp:15},onCrit:{flag:"acad_roster_hint"},go:"acad_deep_y2_town"}
]};
N["acad_deep_y2_town"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇",pace:"normal",text:[
"这年冬天，白桦镇的气氛变了。镇口贴着一张募兵告示：铁门关需要人手，城墙要加固，赏金按人头算。告示下围了一圈人，多是沉默的庄稼汉。",
"老屠户的铺子冷清了不少。他一边剁骨头一边叹气：“我儿子也去了。铁门关。他说守城一个月，顶家里种三年地。”他顿了顿，“他走那天，我给他灌了一壶酒，他喝到一半就哭了。”",
"你买羊杂汤时，他多给你添了半勺：“学生郎，你们在学院里学的，跟我儿子在城墙上守的，是一样的东西——都是拿命换太平。别学那些只会念书的，学点能守住的。”"
],options:[
{t:"打听铁门关的具体战况",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["老屠户把声音压到极低：“上个月，铁门关丢了外城。东军三万人，一夜过了关，关城上的烽火台一个都没点着。”他摆摆手，“镇上的消息，传得慢，也不知道准不准。”"],
 fail:["老屠户摇摇头：“这种事，镇上的人不敢乱说。你问我也没用。”他埋头剁肉，不再接话。"],
 crit:["老屠户看了你一眼，从柜台底下摸出一封信：“这是我儿子托驿站捎回来的，前天到的。你识字，帮我念一念。”","信上只有几行字：“爹，城墙又修好了。别担心。守完这个冬天，我就回家。”老屠户听完，把信仔细折好，塞回怀里，半晌没说话。"],
 critfail:["你问得太细，老屠户警惕起来：“你问这个做什么？学院的人，不该关心战事。”他不再说话。"]
},effects:{xp:15},onCrit:{flag:"acad_war_letter_town"},go:"acad_deep_y2_market"},
{t:"在告示前站一会儿",effects:{xp:8},tier:{ok:["你站在募兵告示前，看那行“守满三月，免赋三年”。有人走过来，也在看。你们谁都没说话，各自看了一会儿，各自走了。","北风把告示吹得哗哗响。"]},go:"acad_deep_y2_market"},
{t:"买一壶酒，递给老屠户",effects:{gold:-2,relation:{npc:"acad_auntie",v:3}},tier:{ok:["你买了一壶酒放在他案板上。老屠户愣了愣，没推辞，给自己倒了一碗，一口干了：“……谢了，学生郎。”","他给你装了一包干肉，硬塞进你怀里：“路上吃。”"]},go:"acad_deep_y2_market"}
]};
N["acad_deep_y2_market"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"市集上多了些生面孔——从北边过来的商贩，兜售的货品里混着军用物件：绷带、药粉、磨刀石。卖货的是个独眼汉子，说话嗓门大：“北边缺这些东西，送到铁门关，能翻三倍价！”",
"你站在摊前看了一会儿。那些药粉，你认得——是止血用的，学院医务室也有，只是学院用的是精制的，这摊上的粗得多。",
"独眼汉子见你识货，凑过来：“学生郎，识货？我这儿还有更好的，学院里头的货，比这粗货强十倍。你要是能弄出来，我出高价收。”他压着嗓子，“你们学院的药房，好东西多着呢。”"
],options:[
{t:"不理会，走开",effects:{xp:5},tier:{ok:["你摇摇头走了。倒卖学院的东西，听着像条财路，更像条绞索。","你走出几步，回头看了一眼——那独眼汉子还在招揽别人。"]},go:"acad_deep_y2_night"},
{t:"问他是什么来路",check:{a:"CHA",sk:"persu",label:"盘问"},tier:{
 ok:["独眼汉子嘿嘿一笑：“北边跑商的。战争年景，什么赚钱跑什么。”他见你追问得紧，收起笑脸，“小兄弟，有些货，问了就别退。你不做，别人也做。”"],
 fail:["他打个哈哈：“跑商的呗。还能是什么。”你没问出什么实质的，但记住了他的长相。"],
 crit:["你假装不懂行情，套出了他的交货点：学院后山的旧马厩，每逢单日戌时。他还说了句：“上头有人罩着，货走学院的地道。”","你记下了这条线。"],
 critfail:["你问得太直白，独眼汉子的笑脸一下冷了：“你是学院的探子？”他盯了你几息，“奉劝一句，别多管闲事。”他收摊走了。"]
},effects:{xp:12},onCrit:{flag:"acad_smuggler_hint"},go:"acad_deep_y2_night"},
{t:"买两卷绷带备用",effects:{gold:-2,item:"绷带卷"},tier:{ok:["你花两个铜星买了两卷粗绷带，揣进怀里。","独眼汉子找零时说了句：“备着点好。乱世里，药比金子金贵。”"]},go:"acad_deep_y2_night"}
]};
N["acad_deep_y2_night"]={tag:"main",place:"艾尔达魔法学院 · 西三舍夜话",pace:"normal",text:[
"夜里，宿舍里只剩你和兽人少年阿塔。他盘腿坐在窗台上，擦一柄短斧，擦得很慢，一下一下，像在跟斧头说话。",
"你问他：“阿塔，你为什么来学院？”他抬起头，狼一样的眼睛在暗处亮着：“我父亲说，草原上的暗蚀会，在挖一个很深的坑。挖到的东西，会让人变成不是人的东西。”他顿了顿，“他让我来学，学会怎么对付那种东西。”",
"窗外北风呜呜地刮。阿塔把短斧插回腰后：“学院里的有些人，比草原上的狼还难防。你白天那个费尔曼教授——”他停了停，“他身上，有那种味道。我在草原上闻到过。”"
],options:[
{t:"问阿塔‘那种味道’是什么",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["阿塔想了很久：“很难说。像是……烧过的骨头，混着雪。草原上，暗蚀会挖坑的地方，就有这种味道。”他看了你一眼，“你信我。”","你没说信或不信，但你把这句话记住了。"],
 fail:["阿塔摇摇头：“我说不好。草原的话，翻成通用语，总是走味。”他没再解释。"],
 crit:["阿塔话声放轻：“我阿爸临死前，给我留了块狼骨。他说，闻到那种味道的人，骨头会发烫。”他顿了顿，“我白天靠近费尔曼时，这块骨头……温了。”","他从怀里摸出一块磨得发亮的骨片，在灯下给你看了一眼。"],
 critfail:["你问得太紧，阿塔闭了嘴，跳下窗台：“睡吧。有些话，草原上只说给信得过的人。”"]
},effects:{xp:15},onCrit:{flag:"acad_wolfbone_warm"},go:"acad_life_y2_friend"},
{t:"和阿塔分享你白天听到的铁门关消息",effects:{xp:8,relation:{npc:"acad_ata",v:5}},tier:{ok:["你说了铁门关丢外城的事。阿塔听完，沉默了一会儿：“城墙挡得住人，挡不住那种东西。”他顿了顿，“我父亲说过，真正的关口，在人心上。”","你们俩在窗台前坐了很久。"]},go:"acad_life_y2_friend"},
{t:"各自睡下，谁也不打扰谁",effects:{hp:10},tier:{ok:["你们各自睡下。半夜，你听见阿塔在梦里说了句草原话，声音很轻，像在叫谁的名字。","你没听懂，翻了个身，又睡过去了。"]},go:"acad_life_y2_friend"}
]};
/* ================= 第三学年 ================= */
N["acad_deep_y3_class"]={tag:"main",place:"艾尔达魔法学院 · 第三学年课堂",pace:"normal",text:[
"第三学年的课程里，多了门《战争与守御》。上课的是个退役的老军官，姓贺，右腿是木头的，说话像刀砍柴：“打仗不是你们在书上读的那样。打仗是——饿肚子、冻脚、死人、然后活着回去。”",
"他讲铁门关之战讲了一个时辰，讲烽火台、讲黑石城墙、讲守城的人怎么在雪地里趴三天三夜。下课铃响时，他问：“你们谁去过铁门关？”",
"没人举手。老军官点了点头：“那你们记住今天的课。等你们哪天站到那堵墙底下，再回来跟我讲，你们懂了什么。”他拄着拐杖走了，木腿敲在地板上，笃、笃、笃。"
],options:[
{t:"课后找他单独请教守城的事",check:{a:"CHA",sk:"persu",label:"请教"},tier:{
 ok:["老军官看了你一会儿：“你问守城？守城就是守人。墙是死的，人是活的。”他顿了顿，“铁门关丢的那晚，烽火台一个都没点着——你品品，是来不及点，还是有人不让点？”","他这句话，让你想了很久。"],
 fail:["老军官摆摆手：“课上都讲了。回去自己琢磨。”他拄着拐走了，没多说什么。"],
 crit:["老军官给你看了他随身带的半块铁牌：“铁门关守军的令牌。我退伍时留下的。”他摩挲着铁牌上的刻痕，“那天晚上，关城上有黑烟。我认得那种烟——不是火烧的，是法术烧的。”","他让你摸了一下铁牌。入手冰凉。"],
 critfail:["你问得太多，老军官皱起眉头：“年轻人，打听这些对你没好处。”他转身走了，木腿声越来越远。"]
},effects:{xp:15},onCrit:{flag:"acad_iron_token_hint"},go:"acad_deep_y3_practice"},
{t:"记下老军官讲的每一个细节",effects:{xp:10,flag:"acad_war_class_notes"},tier:{ok:["你把老军官讲的战况要点记了满满三页。写到“烽火台一个都没点着”时，你的笔停了一下——你在白桦镇也听过同样的话。","两处消息对上了。"]},go:"acad_deep_y3_practice"},
{t:"和同桌讨论：为什么烽火台没点着",effects:{xp:8},tier:{ok:["同桌是个来自东境的瘦高个：“我们那边，传说是有人把烽火台的守卒换成了自己人。”他压低嗓门，“一夜之间换的，一个人都没惊动。”","这个说法，和老军官的“有人不让点”对得上。"]},go:"acad_deep_y3_practice"}
]};
N["acad_deep_y3_practice"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"这学年的演武场多了几具假人，穿着破旧的皮甲，摆成守城的样子。戈拉让高年级学生带着低年级的练“巷战”——在两排假人之间快速穿插，挡格、反击、再挡格。",
"你轮到跟凯恩一组。他比去年高了半头，剑也更沉了：“家里来信，我爹调去铁门关了。他说城墙修好了，让我别担心。”他说得轻描淡写，但你注意到他这几天练剑练得特别狠。",
"你们对练时，戈拉在旁边看着，忽然说了一句：“打仗的时候，同伴比剑重要。你们俩，是一个阵的。”"
],options:[
{t:"跟凯恩认真对练，不留手",check:{a:"STR",sk:"fight",label:"对练"},tier:{
 ok:["你们打了五十回合，谁也没占到便宜。收剑时，两人都喘着气。凯恩抹了把汗：“痛快。好久没这么打过了。”他拍拍你肩膀，“走，食堂我请。”"],
 fail:["凯恩今天格外凶，剑剑带风。你挡得吃力，被他逼退了几步。他收了剑：“……抱歉，心里有事。”他走到场边，坐下，半天没说话。"],
 crit:["你在他一剑劈空时抓住了机会，反手压住他的剑。凯恩愣了一瞬，大笑：“好！这才够劲！”他喘着气，“你小子，什么时候练得这么刁了？”","你们打完之后，在场边坐了很久。他难得说了不少他爹的事。"],
 critfail:["你们对练到一半，凯恩突然停了，剑尖拄地：“不打了。”他转身走了。你看见他肩膀在抖。","第二天，他又恢复了往常的样子，像什么都没发生过。"]
},effects:{xp:15,relation:{npc:"acad_kain",v:8}},go:"acad_deep_y3_library"},
{t:"自己练假人巷战",effects:{xp:12},tier:{ok:["你一个人在假人阵里练了两个时辰，把戈拉教的守势和反击串成了完整的动作。到后来，你闭着眼都知道下一步该踩哪儿。","收工时，戈拉站在门口：“练得不错。明天换真人对练。”"]},go:"acad_deep_y3_library"},
{t:"去找戈拉问怎么在战场上活下来",check:{a:"CHA",sk:"persu",label:"请教"},tier:{
 ok:["戈拉沉默了很久：“活下来，靠三样：背靠得住的墙，身边信得过的人，和一条不硬撑的腿。”他指了指自己的断臂，“这条胳膊，就是硬撑丢的。该退的时候，退不是孬。”"],
 fail:["戈拉只说了一句：“这个问题，等你真上过战场，自己就有答案了。”他没多讲。"],
 crit:["戈拉把你带到演武场角落，从箱底翻出一面旧盾：“我年轻时用的。盾比剑活得更久——记住这句话。”他把盾递给你，“拿着练。练会了，还我。”","盾面上有几道很深的划痕，像刀砍的，又像爪子抓的。"]
},effects:{xp:15},onCrit:{flag:"acad_old_shield",item:"旧盾"},go:"acad_deep_y3_library"}
]};
N["acad_deep_y3_library"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"这学期，图书馆的借阅记录查得严了。罗先生告诉你，圣痕司下了一道令：所有借阅《封印》《锚点》《深渊》类书籍的学生，都要登记造册。",
"他把声音压到极低：“名单已经造出来了。我看了几眼——你不在上面，但你再借下去，就难说了。”他给你使了个眼色，“这学期，要不要换点别的读读？”",
"你站在书架前，看着那排熟悉的书脊。它们像一排沉默的守卫，每一本都在等你伸手。而书架尽头，灰袍执事的影子又晃了过去。"
],options:[
{t:"换读《北境史》和《市井见闻》",check:{a:"INT",sk:"lore",label:"研读"},tier:{
 ok:["你读了一冬的北境史，倒也不是白读——书里夹着许多前人批注，其中一条写着：“铁门关的城墙，修一次，矮一次。”你琢磨了很久这句话。"],
 fail:["北境史写得枯燥，你翻了几页就犯困。但你记住了大事年表：铁门关三修三失，最近一次是十年前。"],
 crit:["你在《市井见闻》里读到一则旧闻：十年前铁门关失守那晚，城中有个更夫，听见关城上有人用不是人话的调子唱歌。更夫活了三天，第四天被发现时，人坐在自家门槛上，眼睛睁着，已经没了气。","你合上书，把这一页的页码记在心里。"],
 critfail:["你读得心不在焉，被罗先生看见了：“你最近心思不在书上。”他叹了口气，“学院里，有些眼睛盯着你，你知道吗？”"]
},effects:{xp:15},onCrit:{flag:"acad_old_news"},go:"acad_deep_y3_town"},
{t:"冒险再借一本《深渊谱系》",check:{a:"AGI",sk:"stealth",label:"偷借"},tier:{
 ok:["你趁灰袍执事转身时，把《深渊谱系》从书架抽出来，夹在外套里带走了。回到宿舍才敢翻——书页很旧，有几页被撕掉了，剩下的字迹密密麻麻。","有一页的页脚，有人用铅笔写了个日期，正是三年前。"],
 fail:["你伸手时，灰袍执事正好回头。你赶紧缩手，假装在找别的书。他看了你一会儿，没说话，但记下了你的位置。"],
 crit:["你不仅偷借出来，还发现书脊夹层里塞着一张纸——是一份手抄的名单，七个名字，前三个被墨涂掉了。","你认得其中两个名字的姓氏。"]
},effects:{xp:18},onCrit:{flag:"acad_abyss_list"},go:"acad_deep_y3_town"},
{t:"听罗先生的劝，这学期不碰禁书",effects:{xp:8},tier:{ok:["你把那排书脊看了又看，还是转身走了。罗先生在你身后轻轻叹了口气：“识时务。这年头，识时务的人能活得久。”","你走到门口，他又补了一句：“等你毕业了，想读什么读什么。学院管不着你。”"]},go:"acad_deep_y3_town"}
]};
N["acad_deep_y3_town"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇",pace:"normal",text:[
"白桦镇这年秋天来了一队难民，是从北边过来的——铁门关外城失守后，边境几个庄子被烧了。他们挤在镇口的旧仓房里，围着一口大锅喝稀粥。",
"老屠户的铺子搭了粥棚。他一边舀粥一边骂：“操蛋的世道。我儿子还在城墙上，这又添了这么多没家的。”他看见你，招呼你过来帮忙搬柴。",
"一个灰头土脸的小女孩蹲在墙根，怀里抱着一只缺了耳朵的猫。她看见你腰间的铜铃，忽然开口：“大哥哥，你那个铃铛——我阿婆说，戴这种铃铛的人，是守夜人的后人。”"
],options:[
{t:"蹲下来问小女孩怎么知道的",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["小女孩说：“我阿婆以前是学院的杂役。她说，守夜人戴的铃铛，里面有个小字，写着‘七’。”她指着你的铜铃，“你的，是不是也有？”","你低头看了一眼——铜铃内壁，确实刻着一个极小的‘七’字。你的心跳漏了一拍。"],
 fail:["小女孩被问你吓了一跳，抱紧猫，缩回墙根，不说话了。"],
 crit:["小女孩小声说：“阿婆还说过，戴这种铃铛的人，要是半夜听见有人叫你的名字，别回头——那不是人叫的。”她说完，抱着猫跑开了。","你站在原地，手里那碗粥还冒着热气。"],
 critfail:["你问得太急，小女孩吓哭了。老屠户过来打圆场：“娃娃怕生，别吓着她。”你道了歉，心里却记下了那句话。"]
},effects:{xp:15},onCrit:{flag:"acad_bell_seven"},go:"acad_deep_y3_market"},
{t:"帮忙搬柴，听难民说北边的事",effects:{xp:8},tier:{ok:["一个老汉告诉你：“铁门关外城失守那晚，有人看见关城上飘着黑烟。不是火烧的黑——是那种，渗进骨头里的黑。”他打了个寒颤，“我活了六十岁，没见过那种烟。”","你想起自由城下水道里的黑烟。是同一种。"]},go:"acad_deep_y3_market"},
{t:"把自己的干粮分给小女孩",effects:{gold:-1,relation:{npc:"acad_auntie",v:3}},tier:{ok:["你把干粮塞给小女孩。她愣愣地接过去，掰了一半给猫，自己小口小口地吃。","老屠户看见了，没说话，给你盛了碗更稠的粥。"]},go:"acad_deep_y3_market"}
]};
N["acad_deep_y3_market"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"市集上，那个独眼汉子的摊子又出现了，这次卖的是“护身符”——各种骨片、铁牌、布条，说是从北边战场上收来的，能挡灾。",
"你注意到他摊上有一面铁牌，形制眼熟。你凑近一看——那半块铁牌的纹路，跟老军官给你看的那块，一模一样。",
"独眼汉子见你盯着铁牌，压着嗓子：“识货？这是铁门关守军的令牌，收来的。你想要，出价。”他伸出三根手指：“三枚银月。”"
],options:[
{t:"问他这令牌哪来的",check:{a:"CHA",sk:"persu",label:"盘问"},tier:{
 ok:["独眼汉子嘿嘿一笑：“北边收的。死人身上摘下来的。”他见你脸色变，又补了一句，“别瞪我，战场上就这样，人死了，东西总得有人收。”"],
 fail:["独眼汉子摆摆手：“收来的呗。哪来的我不能说，说了断财路。”"],
 crit:["你假装要买，把令牌拿在手里翻看。背面刻着一行小字：“第三哨 · 亥时 · 安。”你问这行字是什么意思，独眼汉子摇头：“看不懂，收来就这样。”","你记住了“第三哨”三个字。"],
 critfail:["你问得太紧，独眼汉子警觉地收起令牌：“不卖了不卖了。你这学生，问东问西的。”他收摊走了，令牌没买到。"]
},effects:{xp:12},onCrit:{flag:"acad_token_thirdsentinel"},go:"acad_deep_y3_night"},
{t:"不买，但记下这块令牌的形制",effects:{xp:8},tier:{ok:["你仔细看了几眼令牌的纹路，记在心里。老军官那块是半块，这块也是半块——两块的断口，说不定能对上。","你没有当场验证，但你记下了这个细节。"]},go:"acad_deep_y3_night"},
{t:"花三枚银月买下令牌",effects:{gold:-3,item:"铁门关令牌·半块",flag:"acad_token_bought"},tier:{ok:["你付了钱，把令牌揣进怀里。入手冰凉，边缘粗糙，像被火烧过。","独眼汉子数着钱，头也不抬地说：“学生郎，战场上收来的东西，多少沾点不干净。你留个心眼。”"]},go:"acad_deep_y3_night"}
]};
N["acad_deep_y3_night"]={tag:"main",place:"艾尔达魔法学院 · 西三舍夜话",pace:"normal",text:[
"夜里，你翻来覆去睡不着。今天看到的东西太多：难民、小女孩的铃铛、那块铁牌。它们在脑子里转，像一团理不清的线。",
"你坐起来，从怀里摸出那块令牌，借着月光看。断口的纹路，跟你记忆中老军官那块，确实像能对上。你忽然想：这两块令牌，会不会原本是一块？",
"你把它放回怀里，又摸出那个铜铃，摇了摇——没有声音，像在沉默地应和你。窗外，北风呜呜地刮，远处传来一声长长的号角，像从铁门关方向飘来的。"
],options:[
{t:"把今天的发现记在日记里",effects:{xp:10,flag:"acad_diary_y3"},tier:{ok:["你在日记里写下：铜铃内壁的‘七’字、铁门关令牌的‘第三哨’、黑烟的传闻。写完，你吹熄油灯。","这些字，会在以后的某个夜晚，重新被点亮。"]},go:"acad_life_y3_friend"},
{t:"去找阿塔，给他看令牌",effects:{xp:10,relation:{npc:"acad_ata",v:5}},tier:{ok:["阿塔接过令牌，凑到灯下看了很久：“这上面的味道……跟我阿爸那块狼骨上的一样。”他抬头看你，“这东西，沾过不是人的东西。”","他把令牌还给你，又补了一句：“留着，但别贴身戴。”"]},go:"acad_life_y3_friend"},
{t:"把令牌收进箱底，先睡觉",effects:{hp:12},tier:{ok:["你把令牌用布包好，塞进箱底。今晚先不想这些——明天还有课。","你闭上眼睛，很快就睡着了。梦里，有人叫你的名字，声音很远。你没回头。"]},go:"acad_life_y3_friend"}
]};
/* ================= 第四学年 ================= */
N["acad_deep_y4_class"]={tag:"main",place:"艾尔达魔法学院 · 第四学年课堂",pace:"normal",text:[
"第四学年，费尔曼教授开始讲《灵魂与封印》的高级课。这堂课只有七个学生——据说，是圣痕司点头才放行的名单。你的名字在上面。",
"费尔曼讲课的风格跟三年前一样：不翻讲义，声音不高，但每个字都像落在实处。他讲锚点、讲守夜人、讲封印的“呼吸”——“封印不是死的，它会呼吸。呼吸之间，会有缝隙。守夜人的职责，就是盯着那些缝隙。”",
"讲到一半，他忽然停下来，看着窗外：“你们之中，有人去过灰楼吗？”没人回答。他笑了笑：“没有就好。灰楼里的东西，不是书本上能讲清的。等你们毕业了——如果你们还记得今天这堂课——可以去看看。”"
],options:[
{t:"课后单独找费尔曼，把三年前的问题再问一遍",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["费尔曼看了你很久，像在辨认什么：“你问过第七根锚。”他点了点头，“四年到了。你记得，我也记得。”他从怀里摸出一把黄铜钥匙，“灰楼三层，第七扇门。钥匙只有一把，给你。”","他顿了顿，“看完，把钥匙还我。”"],
 fail:["费尔曼摇了摇头：“你还没准备好。”他温和地补了一句，“不是每个人都需要知道答案。有些答案，知道了就要扛。”"],
 crit:["费尔曼沉默了很久，把钥匙放在桌上：“我等你问这个问题，等了四年。”他顿了顿，“灰楼三层第七扇门后面，不是你想象的东西。但你有资格看。”","他把钥匙推向你。你的手伸过去时，他补了一句：“别带任何人去。”"],
 critfail:["你问完，费尔曼的脸色变了：“你问得太急了。”他把讲义收起来，“这节课就到这里。”他快步走了，留你站在原地。"]
},effects:{xp:20},onCrit:{flag:"acad_gray_key"},go:"acad_deep_y4_practice"},
{t:"先不急着要答案，专心听课",effects:{xp:12},tier:{ok:["你决定先把课听透。这堂课讲的“封印的呼吸”，是你三年来听到的最接近核心的东西。","你把它记在笔记里，标了三个星。"]},go:"acad_deep_y4_practice"},
{t:"下课后去灰楼外面转一圈",check:{a:"AGI",sk:"stealth",label:"探看"},tier:{
 ok:["灰楼三层，第七扇窗，窗帘紧闭。你站在楼下看了很久，没看见任何灯光。但你能感觉到，有什么东西在那一层——像一只没合上的眼睛。"],
 fail:["你刚走近灰楼，就看见圣痕司的灰袍执事在门口巡逻。你只好装作路过，绕开了。"],
 crit:["你趁巡逻的空档，绕到灰楼侧面。第七扇窗的窗台上，放着一盏小油灯，灯是灭的，但灯芯是湿的——刚被人吹熄不久。","你伸手摸了一下灯身，还是温的。"]
},effects:{xp:15},onCrit:{flag:"acad_gray_lamp"},go:"acad_deep_y4_practice"}
]};
N["acad_deep_y4_practice"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"这学年，演武场多了一项训练：夜间演练。戈拉带着学生摸黑走障碍场，不许点火，不许出声，只能靠感觉和同伴的手势。",
"第一晚，十个学生折了五个——不是摔倒，就是撞在一起。戈拉站在场边：“战场上，敌人不会等你把灯点上。你们现在摔的每一跤，都是以后少流的血。”",
"轮到你和凯恩、阿塔一组。你们三人背靠背，在黑暗里慢慢摸过障碍场。阿塔的耳朵灵，凯恩的脚步稳，你负责记路。配合了三次之后，你们成了全场唯一没摔跤的一组。"
],options:[
{t:"提议三人固定搭档",effects:{xp:10,flag:"acad_trio_pact"},tier:{ok:["你提议三人固定搭档，阿塔和凯恩都点了头。戈拉在旁边听见了，难得笑了笑：“好。战场上，能交后背的人，比金子金贵。”","你们三人在场边击了掌——声音不大，但很实。"]},go:"acad_deep_y4_library"},
{t:"自己加练夜行",check:{a:"AGI",sk:"athletic",label:"夜练"},tier:{
 ok:["你一个人在障碍场走了十几遍，直到闭着眼都能过。戈拉在场边看了半夜，最后说了句：“够狠。回去睡吧。”"],
 fail:["你摸黑走，一脚踩空，摔了个结实的。戈拉过来把你拎起来：“走路先看脚下。活着才有以后。”"],
 crit:["你不仅练熟了障碍场，还发现场边旧仓库的门锁是坏的。你推门看了一眼——里面堆着旧木箱，落满灰尘，箱子上印着灰楼的印记。"],
 critfail:["你练得太急，扭了脚踝。戈拉摇摇头：“欲速则不达。歇两天。”"]
},effects:{xp:15},onCrit:{flag:"acad_warehouse_hint"},go:"acad_deep_y4_library"},
{t:"在黑暗里练习听声辨位",effects:{xp:10},tier:{ok:["你蒙着眼睛，让阿塔在十步外扔石子，你听声辨位。练了一晚上，十次能接住七次。","阿塔说：“草原上的猎人，练的是这个。你学得挺快。”"]},go:"acad_deep_y4_library"}
]};
N["acad_deep_y4_library"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"这学期，你终于拿到了费尔曼给的钥匙——灰楼三层的。但你没急着去，而是先到图书馆，把能查的都查了一遍。",
"罗先生看见你查的条目，叹了口气：“你终于还是走到这一步了。”他从柜台下拿出一本旧册子：“这是灰楼的借阅记录。三层第七扇门，四十年里，只有七个人借过里面的东西。”",
"你翻开册子，看见七个名字。第一个是四十年前的老院长；第三个，是三年前“自愿离职”的古代史教授；第七个——最后一个——是你的名字，今天刚被添上去的，墨迹还新。"
],options:[
{t:"问罗先生：前六个名字的人，后来怎样了",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["罗先生沉默了很久：“第一个，老院长，死在任上，说是病故。第三个，离职后没了音讯。”他顿了顿，“第六个——两年前——从灰楼出来，第二天就退了学。现在在南方种地，养了一院子的猫。”"],
 fail:["罗先生摇摇头：“过去的事，就别问了。”他合上册子，没再多说。"],
 crit:["罗先生话声放轻：“第七个，是你。前六个里，活着的只剩两个——一个在南方种地，一个在铁门关当更夫。”他盯着你，“他们都做了一件事：从灰楼出来后，谁也没再提灰楼里的东西。”"],
 critfail:["你问得太直白，罗先生警觉起来：“你问这些做什么？费尔曼给你钥匙，是他的事。我什么都不知道。”他走开了。"]
},effects:{xp:18},onCrit:{flag:"acad_seven_readers"},go:"acad_deep_y4_town"},
{t:"记住这七个名字，不多问",effects:{xp:10},tier:{ok:["你把七个名字默记在心。老院长、离职的教授、种地的人、更夫……这些名字像一串珠子，线头在你手里。","你合上册子，向罗先生道了谢。"]},go:"acad_deep_y4_town"},
{t:"合上册子，决定今晚就去灰楼",effects:{xp:10,flag:"acad_gray_tonight"},tier:{ok:["你合上册子，心里已经有了决定。","走出图书馆时，天已经黑了。灰楼在夜色里立着，像一根沉默的钉子。"]},go:"acad_deep_y4_town"}
]};
N["acad_deep_y4_town"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇",pace:"normal",text:[
"白桦镇的冬天，这年格外漫长。铁门关的战事拖了两年，镇上的年轻人越来越少，粥棚里的老人和孩子越来越多。",
"老屠户的铺子贴出了“歇业”的条子——他的独子，在铁门关守城时没了。他坐在门槛上，抽着旱烟，看见你来，也没招呼。",
"你在他旁边蹲下来，没有说话。过了很久，他说：“我那小子，去年写信还说，守完那个冬天就回家。”他把烟杆在门槛上磕了磕，“北境的雪，年年都化。人呢，走了就不回来了。”"
],options:[
{t:"陪老屠户坐一会儿",effects:{xp:8,relation:{npc:"acad_auntie",v:5}},tier:{ok:["你在门槛上坐了一个时辰，没说话。老屠户抽完一袋烟，忽然说：“学生郎，你以后要是有本事，就替我们这些没本事的人，多看看这条路。”","你点头。他起身，把歇业条子揭了，又开张了。"]},go:"acad_deep_y4_market"},
{t:"问他儿子的事",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["老屠户沉默了很久：“他死在第三哨。听说是夜里换岗时，城墙上出了事。”他顿了顿，“他们说他走的时候，手里还攥着半块铁牌。”","你心里一动——第三哨，铁牌。你怀里那半块令牌上的刻字，正是“第三哨”。"],
 fail:["老屠户摇摇头：“不提了。提了，心里堵。”他不再说话，继续抽旱烟。"],
 crit:["老屠户从怀里摸出一块铁牌：“这是他托人捎回来的，说是守城时捡的，看着像什么要紧的东西。”你接过来一看——断口纹路，跟你怀里那块，严丝合缝地对上了。","两块令牌，合成了一块完整的。背面刻着：“第七哨 · 永夜 · 点火者，不死。”"],
 critfail:["老屠户皱了皱眉：“你问这个做什么？”他把烟杆一放，进了屋。你没能再问。"]
},effects:{xp:20},onCrit:{flag:"acad_token_joined"},go:"acad_deep_y4_market"},
{t:"买一壶酒放在他门口",effects:{gold:-2},tier:{ok:["你把一壶酒轻轻放在他门口，转身走了。第二天，酒壶空了，门边多了一包干肉。","你们谁也没提这事。"]},go:"acad_deep_y4_market"}
]};
N["acad_deep_y4_market"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"市集尽头，卖护符的老妇人又来了。她比四年前老了许多，头发全白了，摊布上的物件也少了。她看见你腰间的铜铃，招了招手：“学生郎，你还在。好啊，好啊。”",
"她问你铃铛还在不在。你解下来给她看。她摩挲着铜铃内壁的‘七’字，浑浊的眼睛亮了一下：“守夜人的铃铛，认主的。它跟你四年了，说明你走过它认的路。”",
"她压低嗓门：“阿婆我今年九十三了，活够了。有些话，再不说就带进土里了——第七节点，不在学院底下。它在北边，在铁门关再往北，那片永冻的荒原上。七根锚，第七根，钉在那儿。”"
],options:[
{t:"请她多讲一些第七节点的事",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["老妇人说：“第七根锚，是用活人钉的。那个守夜人，自己把自己钉在了锚上。”她顿了顿，“所以第七节点，守夜人最苦——他不能走，走了，锚就松了。”"],
 fail:["老妇人摇摇头：“阿婆就知道这么多。再多，要问钉在锚上的那个人了。”"],
 crit:["老妇人从摊布底下摸出一根红线，系在你铜铃上：“这是锚上人的头发搓的线。戴着它，走北边那条路，能少受点邪气。”她没要钱，“你替我，多看看那条路。”","红线入手，温温的，像活的一样。"],
 critfail:["你问得太急，老妇人咳嗽起来：“问不得，问不得。”她摆摆手，不再说话。"]
},effects:{xp:18},onCrit:{flag:"acad_anchor_redline"},go:"acad_deep_y4_night"},
{t:"向她道谢，把铃铛收回怀里",effects:{xp:8},tier:{ok:["你把铜铃收回怀里，向老妇人道了谢。她笑着摆摆手：“去吧。北边的路，不好走，但该有人走。”","你走出几步，回头看她——她已经低头收拾摊布，像一尊落满雪的老树桩。"]},go:"acad_deep_y4_night"},
{t:"问她为什么还记得这么多",effects:{xp:10},tier:{ok:["老妇人笑了：“阿婆年轻的时候，也在学院做过杂役。灰楼里的老管事，是阿婆的舅舅。”她顿了顿，“他临终前，把这些话都讲给了阿婆。”","她的眼睛望向灰楼的方向，很久才收回来。"]},go:"acad_deep_y4_night"}
]};
N["acad_deep_y4_night"]={tag:"main",place:"艾尔达魔法学院 · 西三舍夜话",pace:"normal",text:[
"夜很深了。你坐在窗台上，怀里揣着那块合起来的铁牌。背面那行字，你反复看了无数遍：“第七哨 · 永夜 · 点火者，不死。”",
"你想起老军官的话、老妇人的话、费尔曼的话。它们像三块拼图，在你脑海里慢慢拼拢：铁门关丢的那晚，烽火台一个没点着——因为点烽火的人，可能已经换成了别的东西。",
"而“点火者，不死”这五个字，像一根刺，扎在你心里。你望向北边——夜色里什么也看不见，但你感觉，有什么东西在很远的地方，也在望向这边。"
],options:[
{t:"把这个发现告诉凯恩",effects:{xp:10,relation:{npc:"acad_kain",v:8},flag:"acad_token_told_kain"},tier:{ok:["凯恩听完，沉默了很久。他摸了摸自己腰间的剑：“我爹在铁门关。如果真有那种东西在换岗——”他顿了顿，“我得回去。”","那一夜，你们谁都没睡着。"]},go:"acad_life_y4_friend"},
{t:"去找费尔曼，给他看完整的铁牌",check:{a:"CHA",sk:"persu",label:"求证"},tier:{
 ok:["费尔曼接过铁牌，翻来覆去看了很久。他的手指在那行字上停了停：“‘点火者，不死。’”他抬起头，看你的眼神很复杂，“你比我想的，走得快。”他顿了顿，“这面铁牌，你留着。它会带你去该去的地方。”"],
 fail:["费尔曼只看了一眼就还给你：“收好。别让第三个人看见。”他转身要走，又停住，“你还没准备好。等毕业再说。”"],
 crit:["费尔曼看了很久，忽然问：“你知道‘点火者’是什么意思吗？”不等你回答，他自己答道：“守夜人的别称。第七哨的守夜人，代号就叫‘点火者’。”他顿了顿，“上一任点火者，死在铁门关失守那晚。”","他看你的眼神，像在看一个迟来的接替者。"],
 critfail:["你敲门时，费尔曼正在写东西。他看见铁牌，脸色骤变：“谁给你的？收起来，立刻。”他把你推出门，门在身后砰地关上。"]
},effects:{xp:20},onCrit:{flag:"acad_firelighter"},go:"acad_life_y4_friend"},
{t:"把铁牌收好，什么也不说",effects:{xp:8},tier:{ok:["你把铁牌用布包好，塞进箱底最深处。今晚，你决定先不说。","有些秘密，说出来就不是秘密了。"]},go:"acad_life_y4_friend"}
]};
/* ================= 第五学年 ================= */
N["acad_deep_y5_class"]={tag:"main",place:"艾尔达魔法学院 · 第五学年课堂",pace:"normal",text:[
"第五学年的第一堂课，费尔曼没有讲课。他站在讲台前，扫视着剩下的学生——五年过去，当年二十多个新生，如今只剩七个。",
"他说：“第五学年，学院不再教你们新的东西。剩下的时间，是让你们想清楚一个问题：你学这些东西，到底要做什么。”他顿了顿，“铁门关在打仗，西境在闹元素风暴，东境在改朝换代。这个世界，等不起犹豫的人。”",
"他讲完就宣布下课。没人动。过了很久，有人小声问：“教授，你呢？你学这些东西，是为了做什么？”费尔曼站在门口，背影停了一下：“我学这些东西，是为了等一个人。等了很久了。”他没有回头。"
],options:[
{t:"课后问费尔曼：你在等谁",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["费尔曼没有立刻回答。他带你走到窗边，指着北边：“我在等一个愿意去第七节点的人。”他顿了顿，“学院里来来去去这么多人，只有你，问到了第七根锚。”","他看你的眼神，像看一盏终于点起来的灯。"],
 fail:["费尔曼摇了摇头：“这个问题，现在不能说。”他笑了笑，“毕业那天，如果你还记得，来找我。”"],
 crit:["费尔曼沉默了很久：“我等的不是一个人。”他把声音压到极低，“我等的是一个‘点火者’。铁门关失守那晚，上一任点火者没来得及把烽火点起来，就死了。”他顿了顿，“他死前传了句话出来：‘让下一个点火者，别迟到。’”","你握着怀里的铁牌，觉得它烫得像块炭。"],
 critfail:["费尔曼的脸色淡了下来：“现在不是时候。”他走了，留下你站在原地。"]
},effects:{xp:20},onCrit:{flag:"acad_firelighter_next"},go:"acad_deep_y5_practice"},
{t:"把费尔曼的话记下来，回去想",effects:{xp:10},tier:{ok:["你把他的话记在笔记扉页：“这个世界，等不起犹豫的人。”","你在下面写了一句：“那我就不犹豫了。”"]},go:"acad_deep_y5_practice"},
{t:"问凯恩：你毕业后打算怎么办",effects:{xp:8,relation:{npc:"acad_kain",v:5}},tier:{ok:["凯恩说：“我爹还活着，在铁门关。我毕业就回去，守城。”他顿了顿，“你呢？你学了这么多，总不会跟我一样，回去扛枪吧。”","你没回答。你心里有个念头，像炉膛里的火，压着，但一直烧着。"]},go:"acad_deep_y5_practice"}
]};
N["acad_deep_y5_practice"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"最后一年的演武场，只剩零星几个人。高年级学生大多提前离校，去战场、去行会、去继承家业。戈拉站在场中央，看着空荡荡的沙地，难得说了句软话：“教了你们五年，能留下的，都是拿得动剑的人。”",
"他把所有学生召集起来，做了最后一次对练。这次不是切磋——是真打，打到最后，每个人身上都带了伤。戈拉说：“记住这种疼。战场上，疼会提醒你活着。”",
"收剑时，他把每个学生叫到跟前，一人说了一句话。轮到你了，他看着你：“你是我教过的学生里，最像当年我的一个——学得快，也藏得深。”他顿了顿，“但你要记住：剑是用来守的，不是用来藏的。”"
],options:[
{t:"向戈拉请教最后一招",check:{a:"STR",sk:"fight",label:"求教"},tier:{
 ok:["戈拉用独臂比了个架剑的姿势：“这一招，是我断臂之后悟的——单手剑的破绽，在于慢。你越慢，对手越急。”他顿了顿，“战场上，活得久的，都是慢的人。”"],
 fail:["戈拉笑了笑：“能教的都教了。剩下的，战场会教你。”"],
 crit:["戈拉把他那柄旧木剑解下来，递给你：“拿着。剑是死的，人是活的。但这柄剑跟了我四十年，认得人。”他顿了顿，“等你回来，还我。”","木剑入手，剑柄上缠着旧布条，磨得发亮。"],
 critfail:["你练得太急，动作变形，被戈拉一眼看穿：“心乱了。”他摇摇头，“毕业前，先把心稳住。”"]
},effects:{xp:18},onCrit:{flag:"acad_gora_sword",item:"戈拉的木剑"},go:"acad_deep_y5_library"},
{t:"和凯恩、阿塔做最后一次三人演练",effects:{xp:12,relation:{npc:"acad_kain",v:8},relation2:{npc:"acad_ata",v:8}},tier:{ok:["你们三人在演武场上走完最后一遍夜行障碍。没有火，没有灯，全靠默契。走完，凯恩说：“以后战场上，还当兄弟。”阿塔点头：“草原上的人，认兄弟是一辈子的事。”","你们三人在场边坐了半夜，谁也没多说话。"]},go:"acad_deep_y5_library"},
{t:"一个人把演武场走了一圈",effects:{xp:8},tier:{ok:["你一个人把演武场从这头走到那头，脚下的沙地，是五年里磨出来的。你蹲下，抓了一把沙，又撒了。","五年，说长不长，说短不短。"]},go:"acad_deep_y5_library"}
]};
N["acad_deep_y5_library"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"毕业前，你最后一次来到图书馆。罗先生还是坐在柜台后，戴着套袖，整理借书卡。他看见你，没说话，从柜台下拿出一个布包：“毕业礼。别嫌旧。”",
"布包里是一本手抄的册子，封面没有字。你翻开——是罗先生几十年来抄录的笔记：《灰楼七门》《守夜人谱系》《第七节点考》。字迹工整，页边还标着年份。",
"罗先生说：“我在这学院干了三十七年。这些，是我能留下的全部了。”他顿了顿，“你拿走吧。别让它们跟我一起，烂在这柜台底下。”"
],options:[
{t:"收下册子，郑重道谢",effects:{xp:10,item:"罗先生的笔记",flag:"acad_luo_notes"},tier:{ok:["你把册子收进怀里，向罗先生深深鞠了一躬。他摆摆手：“去吧。走你们该走的路。”","你走出图书馆时，回头看了一眼——他站在柜台后，像一尊旧雕像，但眼睛亮着。"]},go:"acad_deep_y5_town"},
{t:"问他：灰楼三层第七扇门，你去了吗",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["罗先生沉默了很久：“去过一次。四十年前。”他顿了顿，“门后面，是一盏不灭的灯。灯座底下压着一封信，写给我师父的。”他不再往下说，“你到时候，自己去看看。”"],
 fail:["罗先生摇摇头：“那扇门，我只替你看着。进不进去，是你的事。”"],
 crit:["罗先生压着嗓子：“那封信，我师父没来得及看就死了。信上只有一句话——‘第七节点，等一个点火者。’”他盯着你，“四十年前，我以为说的是我师父。现在看，也许说的是你。”"],
 critfail:["罗先生警觉地看了你一眼：“你问这个做什么？费尔曼给你的钥匙，是费尔曼的事。我不掺和。”"]
},effects:{xp:18},onCrit:{flag:"acad_luo_letter"},go:"acad_deep_y5_town"},
{t:"把铜铃解下来，放在柜台上",effects:{xp:10,flag:"acad_bell_returned"},tier:{ok:["你把铜铃轻轻放在柜台上：“替我保管几年。”罗先生看了铃铛一眼，没有推辞：“……行。等你回来，还你。”","你走出图书馆。腰间的铃铛空了，但你心里更静了。"]},go:"acad_deep_y5_town"}
]};
N["acad_deep_y5_town"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇",pace:"normal",text:[
"毕业前的白桦镇，雪已经开始化了。屋檐上的冰棱滴着水，滴滴答答，像给冬天打拍子。",
"老屠户的铺子重新开了张。他看见你，招呼你坐下，给你盛了碗羊杂汤：“毕业了？毕业好。学一身本事，别跟我似的，一辈子守个摊子。”",
"你喝汤的时候，他坐在对面，忽然说：“我儿子是第三哨的。你要是哪天路过铁门关，替我去城墙根上，给他烧张纸。”他从怀里摸出一张叠得方方正正的黄纸，“上面写了他的名字。”"
],options:[
{t:"收下黄纸，答应他",effects:{xp:10,flag:"acad_paper_promise",item:"黄纸"},tier:{ok:["你接过黄纸，仔细收好：“我一定去。”老屠户看着你，嘴唇动了动，最后只说了一句：“……好。你是个好学生郎。”","他给你又添了一碗汤，没收钱。"]},go:"acad_deep_y5_market"},
{t:"问他儿子叫什么名字",effects:{xp:8},tier:{ok:["老屠户说：“他叫石蛋。他娘起的，说贱名好养活。”他顿了顿，“守城的人，名字贱点好，阎王不爱勾。”","你默念了一遍这个名字，记在心里。"]},go:"acad_deep_y5_market"},
{t:"把自己那半块铁牌给他看",check:{a:"CHA",sk:"persu",label:"求证"},tier:{
 ok:["老屠户看见铁牌，眼睛一下直了：“这、这是……”他伸手想摸，又缩回去，“我儿子的遗物里，也有一块这样的。他托人捎回来的，说是从城墙上捡的。”","你心里一震——两块令牌，你手里这块是拼好的，他儿子手里那块，难道还有第三块？"],
 fail:["老屠户摇摇头：“没见过这种牌子。我儿子没留下这个。”他移开目光，不愿多说。"],
 crit:["老屠户从柜台底下摸出一个小布包：“这是我儿子的遗物，我一直留着。”他打开——里面是一块铁牌，跟你的几乎一样，只是背面刻的字不同：“第七哨 · 永夜 · 点火者，不死。”","两块牌子摆在一起，纹路完全一致，像同一炉铁水铸的。"],
 critfail:["老屠户看见铁牌，脸色变了：“你怎么会有这个？”他别过头去，“你走吧。这种东西，别拿给我看。”"]
},effects:{xp:20},onCrit:{flag:"acad_token_third"},go:"acad_deep_y5_market"}
]};
N["acad_deep_y5_market"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"市集上，卖护符的老妇人已经不在了。她的位置，换了个卖炭的年轻汉子。你问起老妇人，他说：“你说那个阿婆？去年冬天没的。走得很安详，头天还摆了摊，第二天就没起来。”",
"他指了指摊位角落：“她走之前，把摊上的东西都送人了。这个，她让我留着，说要是有一个戴铜铃的学生郎来，就给他。”",
"那是一枚旧铜铃——跟你那枚一模一样，内壁也刻着一个‘七’字。只是系铃的红绳，是新的。"
],options:[
{t:"收下这枚铜铃",effects:{xp:10,item:"守夜人铜铃·第二枚",flag:"acad_bell_second"},tier:{ok:["你把铜铃接过来。两枚铃铛在手里，轻轻碰了一下——没有声音，但你的手指感觉到一阵极轻的颤动，像应答。","你想起老妇人说的：“守夜人的铃铛，认主的。”这两枚，原本是一对吧。"]},go:"acad_deep_y5_night"},
{t:"问卖炭人：老妇人还留了什么话",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["卖炭人想了想：“她说，要是那个学生郎来了，告诉他——‘北边的路，阿婆替你看过了。该走的人，别回头。’”","他顿了顿，“就这些。她没多说什么。”"],
 fail:["卖炭人摇摇头：“就留了这铃铛。别的话，没有。”"],
 crit:["卖炭人话声放轻：“其实还有一句话，她让我等你问第三遍才说——‘第七节点，不是终点。第七节点后面，还有东西。点火的人，要一直点下去。’”","他把话说完，像卸了块石头。"]
},effects:{xp:15},onCrit:{flag:"acad_bell_third_words"},go:"acad_deep_y5_night"},
{t:"把铜铃留给卖炭人，让他继续守着",effects:{xp:8},tier:{ok:["你摇摇头：“这枚，先留在你这里。等我办完事，再来取。”","卖炭人愣了愣，把铜铃收进怀里：“行。我替你守着。”"]},go:"acad_deep_y5_night"}
]};
N["acad_deep_y5_night"]={tag:"main",place:"艾尔达魔法学院 · 毕业前夜",pace:"normal",text:[
"毕业前夜，你站在宿舍窗前，看着学院的全貌。五年了，这栋灰扑扑的楼，这条踩熟了的走廊，这片看了无数遍的雪原——都在这个夜里，变得清晰起来。",
"你怀里揣着很多东西：合起来的铁牌、罗先生的笔记、两枚铜铃、费尔曼的话、老屠户的黄纸。它们沉甸甸的，像压着你的良心。",
"远处，灰楼三层的第七扇窗，透出一线极淡的光——像是有人点了一盏灯。你看着那盏灯，忽然明白了费尔曼说的“等一个人”是什么意思。",
"北风从窗缝钻进来。你把手伸进怀里，摸了摸那块铁牌。第七哨、点火者、第七节点……这些词，像一条条线，从学院出发，伸向北方那片永冻的荒原。"
],options:[
{t:"收拾行囊，明天一早就出发北上",effects:{xp:10,flag:"acad_grad_north"},tier:{ok:["你连夜收拾好行囊。铁牌贴身放着，铜铃系在腰间，罗先生的笔记塞在夹层。","天亮前，你最后看了一眼宿舍。然后推开门，走进北风里。"]},go:"acad_life_y5_final"},
{t:"先去找费尔曼，把钥匙还给他",effects:{xp:12,flag:"acad_key_returned"},tier:{ok:["你敲开费尔曼的门。他把钥匙接过去，摩挲了一下，没有多问：“决定了？”你点头。他沉默了一会儿，“去吧。点火的人，不该迟到。”","他目送你离开。门在你身后轻轻合上。"]},go:"acad_life_y5_final"},
{t:"和凯恩、阿塔喝最后一顿酒",effects:{xp:10,relation:{npc:"acad_kain",v:8},relation2:{npc:"acad_ata",v:8},flag:"acad_farewell_drink"},tier:{ok:["你们三人坐在宿舍地板上，一人一壶酒。凯恩说：“等我守完铁门关，就去北边找你。”阿塔说：“草原上的人，说到做到。”","你举起酒壶：“那就说好了。”","三只酒壶碰在一起，声音很脆。窗外，北风呼呼地刮。"]},go:"acad_life_y5_final"}
]};
})();

/* /u1inj:data-nodes:dn_acad_life_extra.js/ */
/* ============================================================
 * B-2 补：学年假期事件（y1~y4）+ 学年专属随机事件（y1~y5，一次性）
 * 假期链：yN_final → yN_holiday → y(N+1)_open（y5 已直连毕业典礼）
 * 学年专属事件：yN_open 内 req flag 一次性，读 S 状态触发
 * 铁律：saveVersion=48 不变；独立键；V66 文风；蓝图+账本
 * ============================================================ */
(function(){
/* 假期事件 */
N["acad_life_y1_holiday"]={tag:"main",place:"艾尔达魔法学院 · 冬假",pace:"normal",text:[
"第一学年的冬假，学院里冷清下来。留校的人不多，食堂只开一个窗口，守夜人的巡逻队缩成两个人。",
"你闲着没事，被洛卡拉去帮他“整理药剂库”——其实就是看他炸了三锅药水，然后一起收拾残局。",
"他忽然问你：“你打算在学院待几年？”",
"你说不知道。他点点头：“不知道也挺好。知道得太早的人，往往走不远。”",
"窗外，雪又下了起来。"
],options:[
{t:"和洛卡守炉夜谈，喝他新配的热酒",check:{a:"CON",sk:"surv",label:"夜谈"},tier:{
 ok:["那酒辣得呛喉，但暖到骨头里。洛卡喝高了，话更多了：“我跟你说，禁书区那扇门……我去年见它开过一次。里面不是书——是空的。一个空房间，墙上画满圈。”","他打了个酒嗝：“每个圈里，都有一只竖瞳。”","你俩对视一眼，谁都没再提这事。"],
 fail:["你喝了一口就咳出来。洛卡得意地笑：“度数高了点？这是给矮人酿的！”你们笑成一团。"],
 crit:["酒过三巡，洛卡难得认真：“我配了十年的药水，没配出过一瓶能让人‘忘记’的。但我知道有人配出来了。”他压低声音：“圣痕司手里有。他们管它叫‘净水’。”","“喝下去的人，会忘了自己是谁。”他盯着炉火，“忘了……自己见过什么。”"]
},effects:{xp:10},onCrit:{flag:"acad_clean_water"},go:"acad_life_y2_open"},
{t:"早点休息，冬假养好精神",effects:{hp:15},tier:{ok:["你睡了个长长的好觉。冬假的雪，把整个学院盖成白色。"]},go:"acad_life_y2_open"}
]};
N["acad_life_y2_holiday"]={tag:"main",place:"艾尔达魔法学院 · 夏假",pace:"normal",text:[
"第二学年的夏假，你跟着凯恩去了一趟学院后山的雪线营地。",
"说是营地，其实是一排半塌的石头屋——战争系的老规矩：夏假进山，练野外生存。",
"白天，你们翻山、涉溪、辨识草药；夜里，围在火堆旁，听凯恩讲他以前当佣兵的事。",
"“我十二岁拿剑，十六岁上战场。”他往火里添了根柴，“见过太多死人了。所以我才来学院——想学点‘不死人的打仗’。”",
"“你呢？你来学院，是为什么？”"
],options:[
{t:"认真回答他：为了找一样东西（一个答案、一条路）",check:{a:"CHA",sk:"persu",label:"倾谈"},tier:{
 ok:["凯恩听完，没有追问。他点点头：“找东西的，都该来学院——这里藏着大陆上一半的答案。”他顿了顿，“另一半，在别处。”","他朝你举了举水壶：“敬还没找到的答案。”"],
 fail:["凯恩见你不愿多说，也不勉强：“行，不说也行。来，教你认一味解毒草。”","你学会了《雪线草》的辨识。这也算收获。"],
 crit:["凯恩沉默了很久，说：“找东西的人，比打仗的人走得远——因为打仗有尽头，找东西没有。”","“你要找的那东西，如果太大，就拆小了找。”他拍拍你的肩，“一个名字，一个地方，一件事。慢慢来。”","这一夜的火，烧得很旺。"]
},effects:{xp:12},go:"acad_life_y3_open"},
{t:"反问他：那你找到了吗",check:{a:"CHA",sk:"persu",label:"反问"},tier:{
 ok:["凯恩看着火，笑了：“没找到。但我觉得——‘不死人的打仗’这答案，可能不在学院里。”他顿了顿，“可能在让战争打不起来的人手里。”","你俩都沉默了一会儿。火堆噼啪响。"],
 fail:["凯恩摇头一笑：“找我自己的答案还来不及，哪管找没找到。”他岔开话题，讲起山里的狼。"],
 crit:["凯恩的目光暗了暗：“我在找一种打法——能让战场少死一半人的打法。”他苦笑，“听起来很蠢吧。一个佣兵，想教世界怎么打仗。”","“但我信。学院里要是没人信这个，那就没人信了。”","你第一次，认真看这个黑发少年。他剑上的铁锈味，忽然有了重量。"]
},effects:{xp:12},onCrit:{flag:"acad_kain_ideal"},go:"acad_life_y3_open"}
]};
N["acad_life_y3_holiday"]={tag:"main",place:"艾尔达魔法学院 · 冬假",pace:"normal",text:[
"第三学年的冬假，你哪儿也没去。",
"你白天在图书馆，晚上替守夜人巡逻。学院像一座被雪埋了一半的城，安静得能听见自己的心跳。",
"有一夜，你在东回廊巡逻时，看见一个灰袍身影——袖口没有银叶——从圣痕司的灰楼方向出来，往图书馆去了。",
"你犹豫了一下，跟了上去。"
],options:[
{t:"跟上去，看个究竟",check:{a:"AGI",sk:"stealth",label:"跟踪"},tier:{
 ok:["你远远跟着，看见那个灰袍身影钻进图书馆侧门，直奔禁书区。他掏出一把钥匙——不是学院的铜钥匙，是黄铜的，泛着旧光。","他开门，进去，关门。你在门外等了半个时辰，他出来时，怀里多了一个用布裹着的东西。","你没能看清那是什么。但你把他的背影，刻进了脑子里。"],
 fail:["你跟到图书馆门口，那人忽然停步，回头扫了一眼。你赶紧闪进阴影，屏住呼吸。","他站了一会儿，才继续走。你不敢再跟。"],
 crit:["你不但跟到了禁书区，还在他离开后，摸到那扇门前——门锁是新的，但你记住了钥匙的形状。","你在门缝里，闻到一股味道：铁锈、旧纸、和一丝若有若无的硫磺。","罗先生说过，深渊谱系的书，闻起来就是这种味道。"],
 critfail:["你跟得太近，转角时踢到一块冰。那人猛地回头——你看见他的脸：灰袍下，是一张你见过的人脸。","费尔曼教授。","他盯着你看了三息，什么也没说，转身走了。","那之后，他再没叫你进过禁书区。"]
},effects:{},onOk:{flag:"acad_grey_librarian"},onCrit:{flag:"acad_sulfur_smell"},go:"acad_life_y4_open"},
{t:"停步。有些事，知道得太多不是福",effects:{xp:8},tier:{ok:["你停住脚步，转身走了。","有些影子，不该由你来追。至少，不是现在。"]},go:"acad_life_y4_open"}
]};
N["acad_life_y4_holiday"]={tag:"main",place:"艾尔达魔法学院 · 春假",pace:"normal",text:[
"第四学年的春假，冰消雪融。",
"你去艾尔达城散心，在城门口遇到一个白袍的圣光教会传教士。他拦住你，笑容满面：“年轻人，信主吗？主的圣光，能洗净一切。”",
"你正要摇头，他忽然压低声音：“……但有些东西，圣光是洗不净的。比如，第七节点。”",
"他见你神色微变，满意地笑了：“看来你知道。很好。”他递给你一张纸条：“城外十里，白杨坡。月圆之夜，有人等你。”",
"说完，他转身走进人群，像一滴水汇进河。"
],options:[
{t:"月圆之夜，去白杨坡看看",check:{a:"STR",sk:"fight",label:"赴约"},tier:{
 ok:["月圆夜，白杨坡上站着一个黑衣人。他背对着你，说：“你就是学院里那个‘知道太多’的学生？”他转身——面罩下露出一双眼睛：“圣痕司和看守者，都在找你。你站哪边？”","你说：“我站我自己看见的那边。”他沉默半晌，忽然笑了：“好。那我们是一边的。”他留下一句话：“净化令启动之日，第七节点会再开。去圣城，找守夜人。”"],
 fail:["你去了白杨坡，但警惕地保持了距离。黑衣人没有动手，只是隔着十步看着你：“谨慎。好。”他转身没入夜色，留下一句：“净化令启动之日，去圣城找守夜人。”"],
 crit:["你不但赴约，还反客为主，先一步逼问了他三个问题。黑衣人被你问得沉默良久：“你比我想的，更麻烦。”他摘下面罩——是一张布满旧疤的脸。“我叫席恩。费尔曼，是我。”","你早猜到了。他没意外：“第七节点需要一把钥匙。钥匙在你手里。”他顿了顿，“别交给任何一边。等门自己开。”"],
 critfail:["你赴约时，坡上埋伏了三个灰袍执事。你拼死突围，负了伤才逃回学院。","那夜之后，你确定了一件事：有人在替圣痕司，钓你这样的“知情者”。"]
},effects:{},onOk:{flag:"acad_black_robes"},onCrit:{flag:"acad_sein_face"},go:"acad_life_y5_open"},
{t:"不去。把纸条烧了",effects:{xp:8},tier:{ok:["你把纸条凑近灯焰，看它卷曲、发黑、成灰。","有些钩子，不咬就是赢。"]},go:"acad_life_y5_open"}
]};
/* 学年专属事件（yN_open 内 req 一次性触发） */
N["acad_event_y1"]={tag:"event",place:"艾尔达魔法学院 · 秋",pace:"normal",text:[
"秋雨连下三天，学院的排水渠堵了。雨水从食堂的墙根漫出来，漫过石板路，漫进宿舍楼的地基。学院管事敲着铜铃，把全宿舍的人叫到雨里疏通。",
"你穿着旧斗篷站在泥水里，裤腿卷到膝盖。水渠入口被烂树叶和断树枝塞得严严实实，凯恩蹲在渠边，用手掏了半天，掏出一把湿透的枯叶，回头冲你喊：“搭把手，底下卡着一根树杈！”",
"你和凯恩、洛卡接力往外拽那根树杈。艾莉丝在边上举着灯喊加油，被凯恩回手泼了一身泥水，她愣了一下，弯腰也抄起一把泥扔回去——闹成一团。",
"闹了一下午，渠通了。浑浊的积水打着旋泄下去，露出渠底青灰色的石板。学院管事赏了每人一碗姜汤，姜放得足，辣得人直吸气。",
"你捧着热汤，坐在廊下，看着满院湿漉漉的灯火。雨水顺着屋檐滴成线，把夜色敲得叮咚响。这种日子，不算惊天动地，但让人踏实。"
],options:[
{t:"喝完姜汤，回宿舍",effects:{xp:8},tier:{ok:["姜汤驱了寒。你抖抖斗篷上的泥，回宿舍睡了。"]},go:"acad_life_y1_dorm"}
]};
N["acad_event_y2"]={tag:"event",place:"艾尔达魔法学院 · 冬",pace:"normal",text:[
"冬夜，学院组织了一场“守夜人体验”——每人值一个时辰夜班，体验老守夜人常年做的事。负责分派的老门房把风灯递给你时，压低声音：“塔楼那片，灯要是晃了，别去追，记下来就行。”",
"你提着风灯，沿着东回廊走。雪很大，灯笼的光只能照出三步远，三步之外就是白茫茫一片。你的靴子踩在积雪上，发出咯吱咯吱的响，回声在回廊里荡来荡去，像有人跟在后面。",
"走到图书馆拐角时，你听见塔顶传来一声轻响——像什么东西，轻轻碰了一下钟。不是钟声，是钟被什么碰了一下，发出短促的“嗡”，随即被风雪吞没。",
"你抬头。塔顶那扇常年黑着的窗，亮着一盏灯。灯是黄的，在雪雾里晃，像一只睁开的眼睛。",
"你想起老门房的话，把风灯提稳，记下了时辰，没有追上去。雪还在下，那盏灯在你转身时，灭了。"
],options:[
{t:"记住这个夜晚，继续巡逻",effects:{xp:8},tier:{ok:["你数着自己的脚步声走完剩下的路。","塔顶的灯，在你交班时，灭了一下，又亮了。"]},go:"acad_life_y2_dorm"}
]};
N["acad_event_y3"]={tag:"event",place:"艾尔达魔法学院 · 春",pace:"light",text:[
"春天，学院的花园开了第一茬花。",
"你经过时，看见费尔曼教授蹲在花圃边，给一株枯枝浇水。他见你，笑笑：“这株，是上一任院长种的。枯了三年，今年又活了。”",
"他起身，拍掉手上的土：“生命这东西，比封印顽强。”",
"他说完就走了。你看着那株枯枝——顶端，确实冒出了一点极淡的绿。"
],options:[
{t:"记住这句话",effects:{xp:8},tier:{ok:["“生命比封印顽强。”你把这句，和学院里的暗流一起，放进心里。"]},go:"acad_life_y3_dorm"}
]};
N["acad_event_y4"]={tag:"event",place:"艾尔达魔法学院 · 夏",pace:"light",text:[
"夏夜，学院举行了一年一度的观星课。",
"教授们带着学生爬上塔顶平台，指认星座。夜风很大，星光很亮。",
"你身边的艾莉丝忽然小声说：“你看——那颗星，今天是不是特别亮？”",
"你顺着她指的方向看：北天，一颗孤星，亮得不像话。",
"旁边的老教授看了一眼，没说话。他收起了望远镜，转身下楼了。"
],options:[
{t:"记住那颗星的方位",effects:{xp:8},tier:{ok:["那颗星的位置，你记住了。","多年后你才知道，那夜亮得过分的星，叫‘守门人’。"]},go:"acad_life_y4_dorm"}
]};
N["acad_event_y5"]={tag:"event",place:"艾尔达魔法学院 · 毕业年秋",pace:"light",text:[
"毕业年秋，学院迎来了一批新生。",
"你站在回廊上，看着他们拖着行李、仰头看塔尖的样子——和五年前的你，一模一样。",
"一个新生撞到你，连声道歉。你摆摆手，忽然想起自己当年在雪地里迷路的狼狈。",
"你从怀里摸出一样东西——老货郎当年没说完的话，你终于在学院里找到了答案。",
"“眼睛不一样的，学院会收。”——收的不只是眼睛，还有那些不肯停下的人。"
],options:[
{t:"把这份心境，带进毕业",effects:{xp:10},tier:{ok:["你转身，走进毕业的人潮里。","学院五年，你没白来。"]},go:"acad_life_y5_final"}
]};
})();

/* /u1inj:data-nodes:dn_acad_magic.js/ */
/* dn_acad_magic.js — 学院修行深化（B-5 补缺） 30 节点
   主题：魔法修行五学年深化，与第七节点/金秤/七锚/封印线弱呼应
   人物：墨丘利（冥想室）、费尔曼（禁咒）、艾莉丝（同学）、阿塔、戈拉
   伏笔旗标：acad_magic_seal_warn（封印低语）、acad_magic_fire（魔力失控）、acad_magic_oath（灵魂契约）
*/
N["acad_magic_hub"]={tag:"main",place:"艾尔达魔法学院 · 修行区",pace:"normal",text:[
"学院的修行区在主楼东侧，一间间冥想室沿长廊排开，门板上刻着历代贤者的名字。长廊尽头是元素池，池水常年泛着幽蓝的光，据说连通着地脉。",
"你站在长廊里，能听见隔墙传来低低的咒语声——有人在练发声，有人在冥想。修行这种事，急不得，但也不能停。",
"墨丘利从走廊那头走来，手里捧着一卷羊皮纸。他看见你，点了点头：“今日元素池安静，适合冥想。去占个位置。”"
],options:[
{t:"去冥想室静坐（第一学年·入门）",effects:{xp:8,flag:"acad_magic_start"},tier:{ok:["你在最里间的冥想室盘腿坐下，把呼吸放慢。初时杂念丛生——矿洞的事、阿岩的刀、图书馆那封信。你数着呼吸，把念头一个一个按下去。","不知过了多久，你感觉到一丝凉意从尾椎升起，沿着脊柱往上爬。那不是风，是魔力——像是地脉里的水，终于找到了一条缝。"]},go:"acad_magic_y1_meditate"},
{t:"去元素池看水（第一学年·观想）",effects:{xp:6},tier:{ok:["你蹲在元素池边，看池水无风自动，一圈一圈地荡。老莫里茨说，池水映出的是人心。你盯着自己的倒影，倒影里的你也在看你。","池底有什么东西一闪——像一块铁牌的光。你眨了眨眼，再看，只有幽蓝的水。"]},go:"acad_magic_y1_pool"},
{t:"先回宿舍（今日休息）",effects:{xp:2},tier:{ok:["修行也不差这一天。你转身往回走，墨丘利在身后喊：“明日辰时，冥想室东侧，我等你。”"]},go:"acad_roommate_1"}
]};
N["acad_magic_y1_meditate"]={tag:"main",place:"冥想室 · 最里间",pace:"normal",text:[
"第二日辰时，你准时推开冥想室东侧的门。墨丘利已经在里面，面前摆着一盏铜灯，灯焰是青色的。",
"他说：“魔力这东西，像是地脉里烧着的火。你要做的不是抓住它，是让自己变成一根灯芯。你试试，把手放在灯焰上方，别怕。”你依言伸手，青焰舔着你的掌心，不烫，反而有一丝凉。",
"一个时辰后，你收回手。掌心什么痕迹也没有，但你分明感觉到，身体里多了一道极细的、温热的水流。墨丘利点头：“成了。你有了自己的第一道魔力。记住它的感觉——往后五十年，它都是你的根。”"
],options:[
{t:"谢过墨丘利，回去记修行笔记",effects:{xp:10,flag:"acad_magic_first"},tier:{ok:["你回到宿舍，把今天的感受一笔一笔记下来：铜灯青焰、掌心的凉、尾椎升起的细流。写完后你吹熄油灯，窗外月正圆。"]},go:"acad_magic_y1_control"},
{t:"追问墨丘利关于池底铁牌的光",check:{a:"CHA",sk:"lore",label:"追问"},tier:{ok:["墨丘利沉默了一会儿，说：“元素池连着地脉，地脉里有旧东西。别问太深，现在的你，知道得越少越安全。”他起身收拾铜灯，又补了一句，“等你学满三年，再来问我。”"],fail:["墨丘利只是摇头：“水里的光，多半是看花了眼。回去歇着吧。”"]},effects:{xp:8,flag:"acad_magic_pool_ask"},go:"acad_magic_y1_control"}
]};
N["acad_magic_y1_control"]={tag:"main",place:"冥想室 · 东侧",pace:"normal",text:[
"第三课，墨丘利教你控魔力。他让你把魔力逼到指尖，点那盏铜灯。你试了三次，指尖冒出一缕黑烟，灯没亮。",
"“火候过了。”墨丘利说，“魔力不是往死里挤，是引。你把它当成水，指尖是闸口，慢慢放。”你放空心思，让那缕温热的水流自己走到指尖。铜灯“噗”地亮了，青焰跳了跳，稳住。",
"你盯着指尖那一点青焰，心跳得厉害。这是你第一次，亲手点燃一道法术。"
],options:[
{t:"（稳住心神，继续练到灯焰凝实）",effects:{xp:12,flag:"acad_magic_lamp"},tier:{ok:["你练到日头偏西，青焰终于凝成豆大的一点，不再乱跳。墨丘利少见地笑了一下：“有天赋。但记住——火能烧柴，也能烧手。”"]},go:"acad_magic_y1_pool"},
{t:"（今日够本，去食堂吃饭）",effects:{xp:6},tier:{ok:["你吹灭铜灯，揉着发酸的手指去食堂。路上遇到艾莉丝，她问你今天练了什么，你说‘点灯’。她笑：“点灯也算法术？明天让你看看什么叫法术。”"]},go:"acad_roommate_1"}
]};
N["acad_magic_y1_pool"]={tag:"main",place:"元素池",pace:"normal",text:[
"你在元素池边蹲了整整一下午，看池水。老莫里茨路过，丢下一句：“看水看不出花来，要下水。”",
"你脱了靴子，把脚伸进池水。凉意顺着脚踝往上爬，池底传来一阵极缓的震动——像是有什么大家伙在很深的地方翻了个身。你稳住呼吸，魔力自然地在体内流转，与池水的凉意互相应和。",
"震动停了。池水重新安静下来。你隐约觉得，自己跟这片地脉，有了一丝说不清的牵连。"
],options:[
{t:"（上岸，记下池底震动的感受）",effects:{xp:10,flag:"acad_magic_pool_tie"},tier:{ok:["你擦干脚，把‘池底有震动、似与地脉相连’记进修行笔记。墨丘利说得对，知道得越少越安全——但你隐隐觉得，这震动跟矿洞壁上的字，是同一种东西。"]},go:"acad_magic_y1_night"},
{t:"（潜下去看个究竟）",check:{a:"AGI",sk:"survival",label:"下潜"},tier:{ok:["你深吸一口气，潜入池底。池水比看着深得多，你摸到池底的石头——冰凉，光滑，缝隙里嵌着一小块黑铁，边角残破，刻着半个印记。你认得那印记：第七节点的旧标记。你浮上来，把那块黑铁藏在怀里，谁也没告诉。你隐约觉得，这件事不能让人知道。"],fail:["池水比你想象的深，你潜到一半就憋不住气，扑腾着浮上来，呛了好几口水。老莫里茨在岸上摇头：“逞能。地脉不是闹着玩的。”"]},effects:{xp:8,flag:"acad_magic_pool_token"},go:"acad_magic_y1_night"}
]};
N["acad_magic_y1_night"]={tag:"main",place:"宿舍 · 深夜",pace:"normal",text:[
"夜深了，宿舍里只有阿岩的鼾声。你躺在床铺上，手里攥着那块黑铁，借着月光看——半个印记，铁面发乌，像是烧过。",
"你想起了矿洞铁皮盒里那面铜牌，想起了图书馆旧报档里那张合影，想起了池底这块黑铁。三样东西，都带着同一个印记。",
"窗外，学院的钟楼敲了十二下。你听见极远处的风里，好像有低低的呜咽——又像是地脉在翻身。你把黑铁贴身收好，闭上眼睛。有些事，你才刚摸到边。"
],options:[
{t:"（把黑铁与铜牌并排收进匣子）",effects:{flag:"acad_magic_token_pair"},tier:{ok:["你找出矿洞带回来的铜牌，与池底黑铁并排放进旧木匣，垫上干草，塞进床底最深处。合上匣盖的时候，你听见铜牌与铁块碰了一下，发出一声短促的嗡鸣。"]},go:"acad_magic_y2_open"},
{t:"（先睡觉，明日再说）",effects:{xp:4},tier:{ok:["你把黑铁塞进枕头底下，翻身睡去。梦里，你站在一片漆黑的水面上，水底有一道门，门缝里透出青色的光。"]},go:"acad_magic_y2_open"}
]};
N["acad_magic_y2_open"]={tag:"main",place:"冥想室 · 西侧（第二学年）",pace:"normal",text:[
"第二学年，修行课换了老师——费尔曼教授。他比墨丘利年轻得多，但脸色常年苍白，眼底青黑，像是很久没睡好。",
"他第一课没教法术，只讲了一件事：“魔力有来处，也有去处。你们要记住自己从哪儿来，才不会被力量拽着走。”他说这话的时候，眼睛扫过你——停了一下，又移开。",
"课后，费尔曼叫住你：“你身上，有地脉的气味。你碰过元素池底的东西？”你心里一紧。"
],options:[
{t:"（如实说池底黑铁的事）",check:{a:"CHA",sk:"persu",label:"坦白"},tier:{ok:["费尔曼听完，沉默了很久。最后他说：“那块铁，是旧封印的一角。你留着它，就会一直被地脉里的东西盯着。交给我，或者埋回去。”他顿了顿，“但我不会强迫你。路是你自己的。”"],fail:["费尔曼盯着你看了几息，说：“你撒谎的样子，跟你导师当年一模一样。”他没再追问，但你的心沉了下去——他认识你的导师？"]},effects:{xp:8,flag:"acad_magic_ferman_knows"},go:"acad_magic_y2_element"},
{t:"（说只是碰了池水，不知道铁的事）",effects:{flag:"acad_magic_lied"},tier:{ok:["费尔曼没再说话，只是多看了你一眼。那一眼让你后背发凉，像被什么东西记住了。"]},go:"acad_magic_y2_element"}
]};
N["acad_magic_y2_element"]={tag:"main",place:"元素演武场",pace:"normal",text:[
"第二学年的实战课改在元素演武场。场地上嵌着五块圆石，对应五行元素——水、火、土、风、雷。",
"费尔曼让你挨个把手放上去。水石凉，火石烫，土石沉，风石在你掌心下嗡嗡震了一下，雷石则毫无反应。轮到土石时，你明显感觉到掌心的温热水流被它吸住——像是两块磁石碰在一起。",
"费尔曼在名册上记了一笔：“土系亲和，偏地脉。少见。”他合上名册，声音压得很低：“土系亲和的人，最容易被地底的东西听见。往后冥想，别太深。”"
],options:[
{t:"（记下费尔曼的提醒，克制冥想深度）",effects:{xp:10,flag:"acad_magic_earth_affinity"},tier:{ok:["此后数月，你冥想时总是留着一分清醒，像在井沿上看水，不让自己掉进去。墨丘利发现后，难得夸你：“稳。比什么都强。”"]},go:"acad_magic_y2_surge"},
{t:"（不信邪，往深里冥想）",effects:{flag:"acad_magic_deep_dive"},tier:{ok:["你心想，越是忌讳越要弄明白。当夜你独自冥想，一直沉到那片漆黑的水面——水底那道门，门缝里的青光，比去年亮了一分。你醒来时，枕巾湿了一片，鼻血流在手背上。"]},go:"acad_magic_y2_surge"}
]};
N["acad_magic_y2_surge"]={tag:"main",place:"冥想室 · 深夜",pace:"normal",text:[
"出事那晚，是入秋后的第一场雷雨。你正冥想，忽然觉得地脉震了一下——不是池底那种翻身，是猛烈的、向上的顶撞。",
"魔力在体内失控，像烧开的锅盖压不住。你的手背炸开一道青纹，痛得你眼前发黑。你听见自己喉咙里发出一声不像人的低吼，铜灯“啪”地炸裂，青焰溅了一地。",
"费尔曼推门进来的时候，你正趴在墙角，手背青纹渗血。他一把按住你的脉门，声音很冷：“我让你别深冥，你偏要。地脉里的东西，听见你了。”他往你嘴里塞了一粒苦药，你的意识才慢慢回笼。"
],options:[
{t:"（道谢并认错，收敛修行）",effects:{xp:6,flag:"acad_magic_lesson"},tier:{ok:["费尔曼松开你的脉门，说：“知道怕，就还有救。往后三个月，你不许冥想，只许练发声和步法。”他走到门口，又停住，“你手背这道纹——它不会消。它是地脉给你打的烙印。”你低头看那道青纹，像一道小小的闪电。"]},go:"acad_magic_y2_recover"},
{t:"（追问‘地脉里的东西’到底是什么）",check:{a:"INT",sk:"lore",label:"探询"},tier:{ok:["费尔曼沉默了很久：“封印。很老的封印，压着一个不该存在的东西。你不是第一个摸到它的人，上一个……是我。”他摘下左手手套，手背上赫然也有一道青纹，比你的更深更密。“别再问。等你学满五年，来我办公室。”"],fail:["费尔曼脸色一沉：“问那么多，是想让地脉里的东西多看你两眼吗？”他摔门走了，你手背的青纹还在隐隐作痛。"]},effects:{flag:"acad_magic_ferman_mark"},go:"acad_magic_y2_recover"}
]};
N["acad_magic_y2_recover"]={tag:"main",place:"宿舍 · 休养",pace:"normal",text:[
"你在床上躺了三天。手背的青纹淡了一些，但没消——像一道浅色的疤痕，摸上去带着一点烫意。",
"阿岩不知道你出了什么事，只当你练功岔了气，每天给你带食堂的饭，还多带一碗汤：“病号吃好点。”你捧着汤碗，心里说不出的滋味。",
"第四天，墨丘利来看你。他没问你出了什么事，只放下一本书：“《地脉浅说》，抄本。看得懂就看，看不懂就烧了。”你翻开，第一页只有一行字：地脉有灵，灵有所属。"
],options:[
{t:"（研读《地脉浅说》）",effects:{xp:12,flag:"acad_magic_book"},tier:{ok:["你花了半个月把书读完。书上说，地脉的‘灵’不是活物，是一股被封印压了千百年的执念——它会记着碰过它的人。书末页有一行小字，是墨丘利的笔迹：‘铁牌、铜牌、黑铁，皆为此印之钥。齐则门开。慎。’"]},go:"acad_magic_y3_open"},
{t:"（把书收好，先顾好身体）",effects:{xp:6},tier:{ok:["你把书压在枕头底下，安心养伤。半个月后，手背的青纹稳定下来，不再发烫。你照常上课，把地脉的事按下不表——但夜里，你偶尔会梦见那道门。"]},go:"acad_magic_y3_open"}
]};
N["acad_magic_y3_open"]={tag:"main",place:"元素演武场（第三学年）",pace:"normal",text:[
"第三学年开春，北境的雪还没化尽。学院的气氛变了——铁门关方向传来的战报，一份比一份沉。",
"费尔曼在实战课上宣布：“本学期实战课改双倍课时。北境需要能上战场的法师，学院不能只教你们点灯。”台下安静了一瞬，随即有人小声议论。",
"课后，艾莉丝追上你：“我爹来信说，铁门关外的兽潮，今年来得比往年早。你……你以后打算上战场吗？”她问得认真，你一时答不上来。"
],options:[
{t:"（答：学法术是为了守得住身边的人）",effects:{xp:8,flag:"acad_magic_oath_pre"},tier:{ok:["艾莉丝听完，眼睛亮了亮：“我也是这么想的。”她伸出手，“那说好了，毕业以后，一起北上。”你跟她击了一下掌。掌心里，她塞给你一小块温热的玉——“护身符，我娘给的。你手背那道纹，我看着不放心。”"]},go:"acad_magic_y3_wargame"},
{t:"（答：还没想好，先把书念完）",effects:{xp:4},tier:{ok:["艾莉丝‘哦’了一声，没再追问。她转身走了几步，又回头说：“那你慢慢想。想好了告诉我。”你看着她走远，心里忽然有点空。"]},go:"acad_magic_y3_wargame"}
]};
N["acad_magic_y3_wargame"]={tag:"main",place:"北境演兵场",pace:"normal",text:[
"学院与北境军团合办了一场演武，法师学员与士兵混编对抗。你分在戈拉教官的队里，负责土系防御。",
"对抗开始，对面的火系学员一道火墙压过来。你按费尔曼教的，把魔力沉进地面——土墙从脚下升起，硬生生挡住火舌。火墙过后，土墙裂了三道缝，但没倒。",
"戈拉在阵后喊：“不错！但你的土是死的。地脉不是只有硬土——让它记住你的气息，它才肯替你扛。”你品着这句话，觉得他说的是法术，又不像只是法术。"
],options:[
{t:"（试着让土记住自己——把魔力揉进墙里）",check:{a:"SPR",sk:"soul",label:"通灵"},tier:{ok:["你闭上眼睛，不再把魔力往外推，而是让它渗进土墙的纹路里。土墙‘嗡’地一颤，裂开的缝竟然自己合拢了。对面学员看愣了。戈拉大笑：“好小子！这招我当年学了三年！”","你睁开眼，手背的青纹热了一下——像是地脉回应了你。"]},effects:{xp:14,flag:"acad_magic_earthbond"},go:"acad_magic_y3_seal"},
{t:"（用蛮力加固土墙）",effects:{xp:8},tier:{ok:["你把魔力一股脑灌进土墙，墙是厚了，但僵硬，被火系学员绕后破了阵。戈拉点评：“力大没用，要巧。回去练通灵。”你低头认错，但心里记下了那招‘让土记住自己’。"]},go:"acad_magic_y3_seal"}
]};
N["acad_magic_y3_seal"]={tag:"main",place:"冥想室 · 深夜（封印低语）",pace:"normal",text:[
"演武之后，你连着几夜没睡好。每晚一闭眼，就听见地脉深处传来低低的嗡鸣——像很远的地方有人在敲一面铁门。",
"这夜你忍不住走到元素池边。池水不平静，一圈一圈地荡，像被什么东西从底下搅动。你把手伸进水里，魔力顺着指尖探下去。",
"碰到那道门了。门是铁的，冰凉，门缝里透出的青光比两年前亮得多。你听见门里有个声音，听不清字句，但能听出焦急——像是什么东西在等你。你猛地抽回手，池水“哗”地溅开。你告诉自己：那是封印，别开。"
],options:[
{t:"（记下这夜的异动，明日禀告费尔曼）",effects:{xp:10,flag:"acad_magic_seal_warn"},tier:{ok:["第二日你把池底异动告诉费尔曼。他听完，罕见地露出凝重：“封印在松动。比我们算的早了两年。”他看了你一眼，“你碰过它，往后更要小心——它会一直找你。除非……你能亲手把它压回去。”"]},go:"acad_magic_y3_final"},
{t:"（压下不说，自己守着秘密）",effects:{flag:"acad_magic_seal_kept"},tier:{ok:["你把这件事埋进心底。此后每夜，那嗡鸣声准时响起，像在你耳边数日子。你开始害怕入睡，又不敢跟任何人说——你自己选的路，含着泪也得走完。"]},go:"acad_magic_y3_final"}
]};
N["acad_magic_y3_final"]={tag:"main",place:"学院后山 · 观星台",pace:"normal",text:[
"第三学年末，你独自爬上后山观星台。北境的夜空干净，银河横贯，像一条发光的河。",
"你想起《地脉浅说》里那句话：地脉有灵，灵有所属。你手背的青纹在星光下泛着淡淡的光。你忽然明白，从你把脚伸进元素池那天起，你就已经被这片地脉记住了。",
"你在观星台上坐了一夜。天亮时，你做了一个决定——无论那扇门后面是什么，你要亲眼看看。不是好奇，是你隐约觉得，那东西跟矿洞、跟铁牌、跟你的过去，缠在一起。"
],options:[
{t:"（立誓：查清地脉与旧印的真相）",effects:{flag:"acad_magic_oath"},tier:{ok:["你对着银河起誓：查清地脉、旧印、矿洞与铁牌之间的牵连。誓言落定，手背的青纹亮了一瞬，又暗下去——像是地脉应了你的约。"]},go:"acad_magic_y4_open"},
{t:"（立誓：守住封印，绝不开门）",effects:{flag:"acad_magic_oath_guard"},tier:{ok:["你对着银河起誓：无论门后是什么，你都不开。你把它当成一种修行——管住好奇，也是管住自己。手背的青纹没有动静，但你心里稳了。"]},go:"acad_magic_y4_open"}
]};
N["acad_magic_y4_open"]={tag:"main",place:"禁书区外（第四学年）",pace:"normal",text:[
"第四学年，你开始频繁出入图书馆禁书区——当然，是白天，用的是费尔曼的借阅条。管理员罗先生每次看见你，都会多看你两眼。",
"这天，你在禁书区深处的书架顶上，摸到一本没有书名的旧册子。封面是皮质的，缝线已经发黑。你翻开，里面是手抄的符咒，笔迹很熟——是费尔曼的。",
"册子最后一页，夹着一张纸条，也是费尔曼的笔迹，写着一行字：‘如果有一天我不在了，告诉我的学生：门不能开。钥匙可以交给信任的人。费。’"
],options:[
{t:"（把册子放回原处，当作没看见）",effects:{xp:8,flag:"acad_magic_ferman_note"},tier:{ok:["你犹豫很久，把册子原样放回书架顶。走出禁书区时，罗先生低着头擦桌子，没看你。但你知道，他什么都知道。"]},go:"acad_magic_y4_erupt"},
{t:"（抄下最后一页带出去）",check:{a:"AGI",sk:"stealth",label:"抄录"},tier:{ok:["你趁四周无人，飞快抄下最后一页，把册子放回。抄纸贴身藏好。出门时罗先生抬头看了你一眼，你心跳如鼓，但他只是说：‘外面起风了，带把伞。’"],fail:["你刚抽出册子，书架后传来脚步声。你手忙脚乱把册子塞回，假装在找书。罗先生抱着一摞新书路过，没停步。但你后背已经汗湿了。"]},effects:{flag:"acad_magic_note_copy"},go:"acad_magic_y4_erupt"}
]};
N["acad_magic_y4_erupt"]={tag:"main",place:"元素演武场 · 失控",pace:"normal",text:[
"第四学年深秋，实战课，你被分到与一名火系高年级学员对练。你本意是防守，但手背的青纹突然剧烈发烫——地脉像被什么激怒了。",
"你的土墙不受控制地暴涨，演武场的地面裂开一道缝，青色的光从缝里涌出来。火系学员被气流掀飞，你听见全场惊呼。",
"费尔曼冲上来，一掌按在你后颈，冷冽的魔力压下去，青光才慢慢熄灭。你跪在裂缝边，喘着气，看见裂缝深处——又是那道门，门缝比任何时候都亮。费尔曼压低嗓门说：“它越来越躁了。你控制不住它，就会被它控制。”"
],options:[
{t:"（主动请求费尔曼封印你手背的纹路）",effects:{xp:10,flag:"acad_magic_sealed_mark"},tier:{ok:["费尔曼盯着你看了很久，终于点头。当晚，他在冥想室为你施封印，青纹被压成一道淡疤。施完术，他脸色更白了：“这道封印，能压三年。三年后，要么你学会驾驭它，要么……”他没说完。"]},go:"acad_magic_y4_quiet"},
{t:"（拒绝封印，想靠自己的力量驾驭）",check:{a:"SPR",sk:"will",label:"意志"},tier:{ok:["你咬牙拒绝。此后三个月，你日夜与那道青纹对抗——它烫，你就泡凉水；它跳，你就打坐。三个月后，青纹不再乱跳，但也更亮了。费尔曼看着你的手背，没说话，转身走了。你知道，他没失望——他只是担心。"],fail:["你拒绝封印后，失控的频率越来越高。一次图书馆夜读，你手背青纹忽然发烫，书页无风自动，吓得旁边的学员尖叫。你只好低下头，主动去找费尔曼：“还是……封吧。”"]},effects:{flag:"acad_magic_self_control"},go:"acad_magic_y4_quiet"}
]};
N["acad_magic_y4_quiet"]={tag:"main",place:"学院钟楼 · 塔顶",pace:"normal",text:[
"封印之后，地脉的声音安静了，但你心里不安静。这夜你爬上钟楼塔顶——那是学院最高的地方，能看见整个北境。",
"塔顶的守钟人是个独臂老兵，他正在擦那口大钟。看见你上来，他咧嘴一笑：“睡不着？年轻人，心里装着事，山高水远都睡不着。”",
"你跟他聊起来。他说他年轻时在铁门关守过城墙，见过“地底下冒青烟”的怪事。“那时候老人都说，北境的地底下，埋着一条龙的骨头。后来官府不让提了。”他指了指远处的地平线，“第三哨那边，那口钟，是铜的。当年敲的是‘有信’。”"
],options:[
{t:"（追问守钟人关于‘第三哨的钟’）",check:{a:"CHA",sk:"persu",label:"攀谈"},tier:{ok:["守钟人压低嗓门：“第三哨那口铜钟，十年前就没人敲了。听说敲了会出事——具体什么事，没人说得清。”他摸了摸自己空荡荡的袖管，“我只知道，当年铁门关最硬的那批老兵，都被调到第三哨去过。回来的，没几个。”"],fail:["守钟人摆摆手：“陈年旧事，不提了。钟就是钟，响了就是有信。”他转身继续擦钟，你只好作罢。"]},effects:{xp:8,flag:"acad_magic_third_bell_hint"},go:"acad_magic_y4_last"},
{t:"（谢过守钟人，下塔）",effects:{xp:4},tier:{ok:["你下塔时，回头看了一眼。独臂老兵还在擦钟，动作很慢，一下一下，像在给谁留信。"]},go:"acad_magic_y4_last"}
]};
N["acad_magic_y4_last"]={tag:"main",place:"宿舍 · 第四学年末",pace:"normal",text:[
"第四学年末，北境下了第一场大雪。你坐在宿舍窗前，看雪片落在窗台上，积成薄薄一层。",
"你手背的青纹被封印压着，安安静静。但你知道，它只是睡着，没有死。你翻开修行笔记，五年来的字迹从青涩到沉稳：点灯、土墙、演武、失控、封印。",
"窗外，学院的钟楼敲了五下——第五学年，就要到了。你合上笔记，心里忽然很静。你不再是那个在元素池边看水的毛头小子了。"
],options:[
{t:"（在笔记扉页写下‘守门人’三个字）",effects:{flag:"acad_magic_guardian"},tier:{ok:["你提笔，在扉页写下‘守门人’三个字。墨迹干了，你端详了一会儿，觉得这三个字很沉——比你想的沉。"]},go:"acad_magic_y5_open"},
{t:"（在笔记扉页写下‘开门人’三个字）",effects:{flag:"acad_magic_opener"},tier:{ok:["你提笔，在扉页写下‘开门人’三个字。写完你自己都笑了——胆子不小。但你知道，有些门，总要有人去推开。"]},go:"acad_magic_y5_open"}
]};
N["acad_magic_y5_open"]={tag:"main",place:"毕业试炼场（第五学年）",pace:"normal",text:[
"第五学年春，学院举行毕业试炼——每名学员要在演武场独立完成一场守御战，由三名教官评分。",
"你抽到的题目是‘守桥’：模拟北境渡桥，独守一炷香。试炼开始，三道土刺从地底钻出，火鸦从侧翼扑来，风刃封住退路。",
"你深吸一口气，没有急着施法。你把手掌按在地面，让魔力渗进演武场的土里——像那年演武一样，让土记住你。地面‘嗡’地震动，土墙从四面八方升起，把你连同那座模拟桥护在正中。火鸦撞在墙上，青烟四散。"
],options:[
{t:"（以土墙为城，守满一炷香）",effects:{xp:16,flag:"acad_magic_trial_pass"},tier:{ok:["你守满了整炷香。土墙碎了又合，合了又碎，但没有一道攻击越过桥面。试炼结束，戈拉教官在评分册上写了个‘甲’，费尔曼没说话，但嘴角动了一下——算是笑了。"]},go:"acad_magic_y5_ferman"},
{t:"（守满后反打，用土刺反击考官）",check:{a:"STR",sk:"martial",label:"反击"},tier:{ok:["香尽的一刻，你猛地抬手，土刺从考官脚下窜出——当然，收了力，只到膝高。三名教官齐刷刷退了一步。戈拉愣了两息，大笑：“好胆色！但记住，战场上，守得住比杀得猛更难得。”他还是给你记了甲。你心里清楚，他是喜欢你，但他的话，你记下了。"],fail:["你反打失了准头，土刺偏了，砸在评分席的桌角上，把墨水瓶震翻了。戈拉脸都绿了：“守你的桥！谁让你打考官了！”好在试炼结果还算体面，勉强过了。"]},effects:{flag:"acad_magic_trial_aggressive"},go:"acad_magic_y5_ferman"}
]};
N["acad_magic_y5_ferman"]={tag:"main",place:"费尔曼办公室",pace:"normal",text:[
"试炼后第三天，费尔曼让人把你叫到办公室。他的办公室很乱，书堆到天花板，桌上摊着一幅北境地图，用红笔圈着几个点——其中一个是第三哨。",
"他让你坐下，给你倒了一杯热水，然后说：“你学满了五年。有些事，该告诉你了。”",
"他从抽屉里拿出一块铁牌，跟你在矿洞铁皮盒里找到的那面铜牌，几乎一模一样——只是铁的，边缘烧焦过。“这牌子，叫‘钥匙’。当年我们六个人，一人一块，守着一道门。”他顿了顿，“活到今天的，就剩我一个。”"
],options:[
{t:"（问费尔曼：那六个人都是谁）",check:{a:"CHA",sk:"persu",label:"询问"},tier:{ok:["费尔曼沉默了一会儿，报出六个名字。你只记住了其中两个——一个叫‘刘矿头’，死在矿洞；一个叫‘老铁’，守在第三哨，后来失踪了。‘其他人，有的死了，有的疯了，有的……不见了。’他摩挲着那块铁牌，‘我们以为守住了。但地脉里的东西，比我们活得长。’"],fail:["费尔曼摇摇头：‘都是死人，问来做什么。’他把铁牌收回去，‘你只要记住，这牌子是钥匙，不是摆设。’"]},effects:{xp:8,flag:"acad_magic_six_keys"},go:"acad_magic_y5_choice"},
{t:"（不问人，问门：那扇门到底在哪）",effects:{flag:"acad_magic_door_ask"},tier:{ok:["费尔曼盯着你看了很久，然后用手指蘸着茶水，在桌上画了一道线：‘北境的地脉，像一条蛇。蛇头在第三哨，蛇尾在学院。’他抬头看你，‘门，在蛇头。而钥匙，散在各地。’"]},go:"acad_magic_y5_choice"}
]};
N["acad_magic_y5_choice"]={tag:"main",place:"费尔曼办公室 · 抉择",pace:"normal",text:[
"费尔曼把铁牌推到你面前：“第五学年了，你也该有个去处。两条路：一是留在学院，接墨丘利的班，当冥想课教习——安稳，也清静。二是带上这块铁牌，去第三哨——那边缺个懂地脉的人。你自己选。”",
"窗外，北境的风刮过屋檐。你想起观星台上许的愿，想起矿洞壁上的字，想起独臂守钟人说的‘第三哨的钟’。",
"你伸出手，指尖触到铁牌冰凉的边缘。这一下，五年的修行，忽然都有了去处。"
],options:[
{t:"（接下铁牌：去第三哨）",effects:{flag:"acad_magic_go_third"},tier:{ok:["你拿起铁牌，分量不轻不重，像捧着一块沉默的承诺。费尔曼看着你，难得笑了一下：‘好。像我。’他转身，从书堆里抽出一本发黄的册子递给你——正是禁书区那本没有书名的旧册子。‘路上看。看不懂的，到了第三哨，自然就懂了。’"]},go:"acad_magic_y5_end"},
{t:"（留在学院：接冥想课教习）",effects:{flag:"acad_magic_stay"},tier:{ok:["你把铁牌推回去：‘我学了五年，还没学够。’费尔曼看了你很久，把铁牌收回抽屉：‘也好。学院也需要懂地脉的人。’他顿了顿，‘但记住——那道门不会等你。你什么时候想去了，第三哨的钟，会响。’"]},go:"acad_magic_y5_end"}
]};
N["acad_magic_y5_end"]={tag:"main",place:"毕业 · 起风",pace:"normal",text:[
"毕业典礼在初夏举行。你穿着学员袍站在队列里，听院长念一长串名字。阳光很好，北境的雪终于化尽了。",
"典礼后，同学们三三两两散开。阿岩要回矿山，艾莉丝说要北上，墨丘利留校，费尔曼只远远看了你一眼，转身走回办公室。",
"你站在学院门口，风从北边来，带着铁门关方向的气息。你摸了摸手背那道淡疤——封印还在，青纹在疤下安静地睡着。五年了，你终于要离开这扇校门，去走自己的路。至于路通向哪里，风知道，你也快知道了。"
],options:[
{t:"（迈步，走向校门外的路）",effects:{xp:20,flag:"acad_magic_done"},tier:{ok:["你背着行囊走出校门。身后的钟楼敲了一声，很轻，像是替你送行。你回头看了一眼——学院的白墙、灰楼、元素池的蓝光，都收进眼底。然后你转身，往北走。北境的风，迎面扑来。"]},go:"acad_magic_hub_end"}
]};
N["acad_magic_hub_end"]={tag:"main",place:"毕业后的路",pace:"normal",text:[
"你沿着北境的大道往前走。行囊里，压着那本没有书名的旧册子、半块黑铁、一面铜牌、一张抄纸，还有一块护身玉。",
"前路还远。但你不再是一个人——你带着五年的修行，带着手背的烙印，带着那些人的托付。",
"（魔法修行线至此告一段落。若你日后抵达第三哨或铁门关，可继续探寻‘钥匙’与‘门’的真相。）"
],options:[
{t:"（继续前行）",go:"fc_road_north"}
]};

/* /u1inj:data-nodes:dn_acad_mentors.js/ */
/* ============================================================
 * B-3 导师支线（4 人 × 2 节点：指导 + 支线结局）+ 禁书区暗线（4 节点）
 * 导师：墨丘利（灵魂）/ 戈拉（剑道）/ 特蕾莎嬷嬷（神术）/ 老莫里茨（商课）
 * 禁书区暗线：发现密道 → 偷读三选一 → 被费尔曼撞见 → 抉择（衔接 script_02g 三选一）
 * 铁律：saveVersion=48 不变；独立键；V66 文风；蓝图+账本；branch_academy_* 判定零改动
 * ============================================================ */
(function(){
/* ---------- 导师区中枢 ---------- */
N["acad_mentor_hub"]={tag:"main",place:"艾尔达魔法学院 · 导师区",pace:"normal",text:[
"导师区在学院北楼的三层，一条长廊把四间屋子串在一起。廊道的木地板被踩得发亮，墙上的烛台只有一半点着——学院省灯油，是出了名的。",
"东头第一间是墨丘利的灵魂课教室，门常年虚掩，里面飘出旧书和干薄荷的气味。他上课时话不多，讲完一个点就停下来，让学生自己想。",
"第二间挨着演武场的入口，独臂的戈拉教授每天清晨都在里面磨他那柄旧剑。剑刃碰到磨石的声响，能从一楼传到三楼。",
"西头是特蕾莎嬷嬷的礼拜堂。她管着药室，窗台上晒着几把干草药，门边挂着块木牌，用粉笔写着今日的天气。她不常说话，但学生生了病，第一个想到的就是她。",
"楼梯口那间最小的屋子，是老莫里茨的商课教室。他总在门口支一张小桌，摆着账册和半壶凉茶。谁经过，他都喊一声：“进来坐坐，算笔账再走？”",
"你站在长廊中间，一时间竟不知道该先去敲哪扇门。"
],options:[
{t:"去找墨丘利教授（灵魂魔法）",go:"acad_mentor_mercury"},
{t:"去找戈拉教授（剑道）",go:"acad_mentor_gora"},
{t:"去找特蕾莎嬷嬷（神术）",go:"acad_mentor_theresa"},
{t:"去找老莫里茨（商课）",go:"acad_mentor_moritz"},
{t:"去修行区修炼（冥想/元素/试炼）",go:"acad_magic_hub"},
{t:"回生活区",go:"acad_people_hub"}
]};
/* ---------- 导师：墨丘利 ---------- */
N["acad_mentor_mercury"]={tag:"main",place:"艾尔达魔法学院 · 灵魂魔法教室",pace:"normal",text:[
"墨丘利教授的灵魂课，是学院里最难抢的课。他的教室永远坐满人——不是因为好过，是因为他真的讲得好。他讲灵魂残响的时候，整个教室安静得能听见烛芯爆裂的声音。",
"他上课从不点名，也不检查作业。他只做一件事：每堂课结束，让学生把手放在桌面上那枚旧铜盘上，闭眼三十息。他说，铜盘会记住每个人灵魂的“指纹”。",
"这天下课后，别的学生都走了，他把你留下。他没有看你，先给窗台上的薄荷浇了水，才开口：“你的灵魂感知很敏锐。来，试试这个。”",
"他摊开手掌，掌心浮起一枚极淡的光点，像一粒落在水面的火星：“这是灵魂残响。每个人身上都有——它记得你做过的事。”",
"“闭上眼睛，去听它的声音。”"
],options:[
{t:"静心去听那枚光点",check:{a:"INT",sk:"lore",label:"聆听"},tier:{
 ok:["你闭眼，静心。光点里传来极细的声音——像雪落，像钟鸣，像很远的地方有人叫你的名字。","墨丘利收回光点，点头：“你的灵魂里，有一道很深的刻痕。不是伤——是记忆。”他顿了顿，“你记得一些……别人不记得的事。”","你想起出发前的那些夜晚。他没追问，只留下一句：“记得的东西，终有一天会有用。”"],
 fail:["你静不下心，光点在你掌心消散。墨丘利温和地摇头：“不急。灵魂这种东西，急不来。”"],
 crit:["你不但听到了声音，还“看见”了一幅画面：一个圈，圈里一只竖瞳——和你见过的那图案一模一样。","你睁开眼。墨丘利看着你，目光深了：“你见过这个？”你没回答。他沉默片刻：“……如果你见过，那就更该学我的课了。”"]
},effects:{xp:15},onCrit:{flag:"acad_mentor_eye"},go:"acad_mentor_mercury_2"}
]};
N["acad_mentor_mercury_2"]={tag:"ending",place:"艾尔达魔法学院 · 墨丘利办公室",pace:"normal",text:[
"毕业前，墨丘利把你叫到办公室，关上门。",
"他从抽屉里取出那枚银叶徽章——和五年前给你的一模一样：“这是我三十年来送出的第四枚。第三枚的持有人，叫席恩。”",
"他看着你：“我年轻时，也和你一样，相信封印能守住一切。后来我明白——能守住东西的，从来不是封印，是记得它的人。”",
"“你是我教过的学生里，最像当年的我，又最不像我的一个。”他笑了笑，“去吧。记得回来看我。”",
"他把那枚徽章放进你手心：“学院欠你的，会在你需要的时刻还你。”",
"——和院长说过的话，一模一样。"
],options:[
{t:"收下第二枚银叶徽章",effects:{item:"银叶徽章",xp:20},run:function(){changeRelation('mentor_mercury',20,'毕业传徽');},tier:{ok:["你握紧那枚徽章。它的边角，已经被摩挲得发亮。"]},go:"acad_people_hub"}
]};
/* ---------- 导师：戈拉 ---------- */
N["acad_mentor_gora"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"独臂的戈拉教授，是学院战争系最凶的教官。他的剑术课，第一堂课先挨打，第二堂课还是先挨打。他空荡荡的左袖管用一根皮绳扎着，右手的剑却快得像影子。",
"新生背地里叫他“铁胳膊”，说他的剑不是练出来的，是战场上拿命换的。戈拉听见了也不恼，只回一句：“你们挨的打，还不到我当年挨的零头。”",
"但你渐渐发现，他每次“打”你，都收着力——打的位置，恰好是你防守的破绽。他从不讲解，只让你自己从挨打里悟。",
"这天，他把你叫到演武场角落，用剑尖在地上划了一个圈：“你底子不错。但你的剑，太‘正’了。”",
"“战场上，没有正剑。只有快剑和活剑。”他独臂挥了一下剑，剑风扫过你额前的头发，“来，教你一招‘活剑’——借对手的力，走对手的破绽。”",
"他顿了顿，声音低了些：“这一招，是我当年在铁门关城头上，跟一个守城老兵学的。老兵没有左手，跟你我一样。”"
],options:[
{t:"认真学这招‘活剑’",check:{a:"STR",sk:"fight",label:"学剑"},tier:{
 ok:["你练了一下午，终于摸到那点“借力”的门道。戈拉难得点头：“有悟性。明天继续。”","那一招，后来救了你很多次。"],
 fail:["你练到脱力，还是没抓住要领。戈拉倒不生气：“学剑急不来。你今天的‘挨打’功底，倒是扎实了。”"],
 crit:["你不但学会了，还反手用这招，把戈拉逼退了半步。戈拉愣了一瞬，忽然大笑：“好！好！我这条胳膊换来的东西，总算有人接住了！”","他拍了拍你的肩：“你出师了。以后，别说是我徒弟——不然人家会说我教得太少。”"]
},effects:{xp:15},onCrit:{flag:"acad_mentor_sword"},go:"acad_mentor_gora_2"}
]};
N["acad_mentor_gora_2"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，戈拉教授退休了。",
"他把那柄陪了他三十年的旧剑，挂在办公室墙上，锁了门。",
"走之前，他叫住你，难得没有用命令的口吻：“你那招‘活剑’，练得不错。”",
"他从怀里掏出一块铁片，塞给你：“这是我当年打仗时，从铁门关城墙上抠下来的。守城的老兵说，铁门关的城墙，是‘用命垒的’。”",
"“你将来要是去铁门关……”他顿了顿，“替老兵们，看看那城墙还在不在。”"
],options:[
{t:"收下铁片，应下这个嘱托",effects:{item:"铁门关铁片",xp:20},run:function(){changeRelation('mentor_gora',20,'毕业嘱托');},tier:{ok:["你握紧那块铁片，边缘很钝，但很重。","铁门关的城墙——你会去看的。"]},go:"acad_people_hub"}
]};
/* ---------- 导师：特蕾莎嬷嬷 ---------- */
N["acad_mentor_theresa"]={tag:"main",place:"艾尔达魔法学院 · 礼拜堂",pace:"normal",text:[
"特蕾莎嬷嬷是学院里最安静的人——她管着礼拜堂和一间小药室，几乎不参与学院的事务。她的脚步很轻，走路时袍角扫过地面，像一片叶子被风吹着走。",
"她的药室永远烧着一壶水，炉子上的陶罐咕嘟咕嘟响。学生受伤了、病了、睡不着了，都往她那儿跑。她也不多问，看一眼伤口，就去架子上取药。",
"但你的神术课，是她教的。她上课从不用课本：“神术不是背祷词。神术，是‘看见’。”",
"“看见别人的伤口，看见自己的手，看见光从哪里来。”她顿了顿，“也看见——有些光，是从阴影里来的。”",
"她教你的第一课，是给一株枯死的老树浇水。你照做了三个月，树没活。你问过她为什么，她只说：“根还活着，只是它自己还不知道。”",
"礼拜堂门口那株老树，树皮皴裂，像一张老人的脸。你每天清晨路过，都会提着水桶，浇上一瓢。"
],options:[
{t:"问她：这棵树还能活吗",check:{a:"CHA",sk:"persu",label:"求教"},tier:{
 ok:["特蕾莎嬷嬷看着那株枯树：“它的根还活着。你浇的水，它都收到了。”她轻轻敲了敲树皮，“它在等——等一个合适的春天。”","她转头看你：“你也是。”"],
 fail:["特蕾莎嬷嬷温和地笑笑：“活不活，不在树，在于浇水的人信不信。”","你似懂非懂。但第二天，你照旧去浇了水。"],
 crit:["你问的第二天，那株枯树的枝头，冒出了一点极淡的绿。","特蕾莎嬷嬷看着那点绿，难得笑了：“你看——它等到了。”她看着你，“有些事，浇水的人信了，它就活了。”"]
},effects:{xp:15},onCrit:{flag:"acad_mentor_tree"},go:"acad_mentor_theresa_2"}
]};
N["acad_mentor_theresa_2"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，特蕾莎嬷嬷送了你一枚小小的木十字架——用礼拜堂门口那株枯树的木头刻的。",
"“它活了，才能做成这个。”她把十字架放进你手心，“带着它。北境的冬天冷，但你知道——根还活着。”",
"她没有说更多。她转身走进礼拜堂，钟声轻轻响了一下。",
"那枚木十字架很轻，轻得像一片树叶。但你握着它，觉得它比什么都沉。"
],options:[
{t:"收下木十字架",effects:{item:"枯木十字架",xp:20},run:function(){changeRelation('mentor_theresa',20,'毕业赠礼');},tier:{ok:["你收好那枚十字架。根还活着——你记住了。"]},go:"acad_people_hub"}
]};
/* ---------- 导师：老莫里茨 ---------- */
N["acad_mentor_moritz"]={tag:"main",place:"艾尔达魔法学院 · 商课教室",pace:"normal",text:[
"老莫里茨的商课，是全学院最“势利”的课——他第一堂课就明说：“商人的学问，就是算命的学问。算人心，算行情，算命。”他讲课从不坐，一只手拄着拐杖，一只手敲黑板，敲得粉笔灰簌簌往下掉。",
"教室后排放着一口旧木箱，里面是他这些年收来的“教材”——一截被雷劈过的车辕、半袋发霉的麦子、一块刻着价码的石板。他讲哪一课，就从箱子里掏出哪一样。",
"他讲的不是怎么赚钱，而是怎么“活下来”：“记住，商队死在路上的，十个里有八个，不是死在强盗手里——是死在算错上。”",
"“算错风向，算错雨季，算错人心。”他敲了敲桌面，“这一课，免费送你们。”",
"说到这儿他总会顿一顿，从怀里摸出烟斗，在讲台上磕两下，又放回去——学院不许抽烟，他忍了半辈子也没忍住这个动作。"
],options:[
{t:"问他：怎么算人心",check:{a:"CHA",sk:"persu",label:"求教"},tier:{
 ok:["老莫里茨眯起眼：“人心不用算——人心会写在脸上、手上、钱袋上。”他教你看了三样东西：“看一个人，先看他的手，再看他的鞋，最后才看他的脸。”","“手是干活的，鞋是走路的，脸是会骗人的。”"],
 fail:["老莫里茨摇摇头：“这课可不好教。先回去，把食堂的菜价背下来再说。”"],
 crit:["老莫里茨压低声音：“真正的商道，不是赚——是‘知道什么时候该撤’。”他顿了顿，“我年轻时在自由城邦，见过一个富可敌国的商人，一夜之间散尽家财，只为躲开一桩‘大生意’。”","“后来那桩大生意，吞了半个商盟。”他看着你，“撤，是商人最贵的本事。”"]
},effects:{xp:15},onCrit:{flag:"acad_mentor_retreat"},go:"acad_mentor_moritz_2"}
]};
N["acad_mentor_moritz_2"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，老莫里茨送你一本账册——不是普通的账册，是他三十年商路的笔记。",
"扉页上写着一行字：“算对人心的，走不丢。”",
"他把账册递给你：“你是我教过的学生里，最不像商人的一个。”他笑了，“但最像‘能活下来’的一个。”",
"“毕业之后，不管你是去铁门关、去沙漠、还是去承天城——记住：钱是死的，路是活的。”",
"他拍拍你的肩，转身走进教室：“下节课，讲怎么在战乱里保住一条命。你毕业了，听不到了——可惜。”"
],options:[
{t:"收下这本商路笔记",effects:{item:"莫里茨商路笔记",xp:20},run:function(){changeRelation('mentor_moritz',20,'毕业赠册');},tier:{ok:["你收好那本笔记。钱是死的，路是活的——你记住了。"]},go:"acad_people_hub"}
]};
/* ---------- 禁书区暗线 ---------- */
N["acad_forbidden_1"]={tag:"branch",place:"艾尔达魔法学院 · 禁书区外",pace:"normal",text:[
"那扇禁书区的门，你路过过无数次。铁门常年锁着，锁孔里塞着黄铜，门板上贴了三条圣痕司的封条，落款一年一换，纸张已经脆得发黄。",
"巡逻的灰袍执事每隔一个时辰从回廊那头走过来，靴子踩在木地板上，响声从楼梯口一路传到门口。学生们都知道，禁书区是学院里唯一“不能好奇”的地方。",
"直到第三学年的一个冬夜，你巡逻时发现——门侧的排水渠口，被一块松动的石板盖着。石板边缘的泥土是新翻的，像是有人近期动过。",
"你蹲下去，把石板掀开一条缝。下面是一条窄得只能侧身通过的缝隙，通向禁书区的地下。一股旧纸、铁锈和硫磺的味道，从里面飘出来，混着北境的寒气，直往你鼻子里钻。",
"缝隙深处，隐约有一线极淡的光——不像是烛火，更像是什么东西在慢慢呼吸。",
"你直起腰，听见回廊尽头传来执事的脚步声。是现在下去，还是等下一轮巡逻？"
],options:[
{t:"侧身钻进缝隙，下去看看",check:{a:"AGI",sk:"stealth",label:"潜入"},tier:{
 ok:["你侧身钻过缝隙，落进一间低矮的地窖。这里堆着旧书架，落满灰尘。你借着缝隙漏下的光，看见书架深处——有一道新刻的痕迹，像一个仪式图的一角。","你记下形状，原路退回。心跳了一整夜。"],
 fail:["你刚钻进去一半，就听见脚步声——灰袍执事巡逻来了。你赶紧退出来，把石板盖好，装作蹲在墙根系鞋带。","执事看了你一眼，走了。你手心全是汗。"],
 crit:["你不但进去了，还在地窖最深处，发现一扇铁门——门锁样式，和符文工坊莫里说过的“矮人古锁”一模一样。","你凑近锁孔，闻到一股硫磺味。锁孔周围，刻着一圈细小的符文。","你没有钥匙。但你记住了锁的样子。"]
},effects:{xp:12},onCrit:{flag:"acad_maze_iron"},go:"acad_forbidden_2"}
]};
N["acad_forbidden_2"]={tag:"branch",place:"艾尔达魔法学院 · 禁书区地窖",pace:"normal",text:[
"你第二次钻进那道缝隙。这一次，你带了灯。",
"地窖里，旧书架上的书，大多已经霉烂。但最里面的架子上，整齐地摆着三本完好的书——",
"一本《深渊谱系·残卷》，书脊焦黑，像是从火里抢出来的；",
"一本《第七节点封印实录》，封面有圣城的徽记；",
"一本《守夜人手记·无名氏》，没有书名页，扉页只有一行字：“灯灭之日，去找守夜人。”",
"你只有时间拿一本。"
],options:[
{t:"拿《深渊谱系·残卷》",effects:{xp:10,flag:"acad_book_abyss"},tier:{ok:["你把残卷贴身收好。它很轻，但它的分量，你心里清楚。"]},go:"acad_forbidden_3"},
{t:"拿《第七节点封印实录》",effects:{xp:10,flag:"acad_book_seal"},tier:{ok:["你把实录收好。里面的内容，你连夜读了一部分——七节点的历史，比传闻的更沉重。"]},go:"acad_forbidden_3"},
{t:"拿《守夜人手记·无名氏》",effects:{xp:10,flag:"acad_book_guard"},tier:{ok:["你把那本手记收好。扉页那句话，像一根针，扎进你心里。"]},go:"acad_forbidden_3"}
]};
N["acad_forbidden_3"]={tag:"branch",place:"艾尔达魔法学院 · 禁书区",pace:"normal",text:[
"你刚把书收好，地窖的入口忽然被一片阴影罩住——",
"一个人影，无声无息地站在缝隙口。灯从背后打过来，看不清脸，只能看见他袖口——没有银叶。他没有佩学院教师的徽章。",
"地窖里的灰尘在灯光里浮着，你的心跳声大得像是自己的。",
"他开口，声音温和：“深夜造访禁书区，好兴致。”",
"是费尔曼。",
"他侧身，让出一点光：“出来吧。地窖里凉。”他顿了顿，又说，“你怀里那本，不管是什么——先揣好。地窖口的风大，别吹散了纸页。”",
"你攥着那本书，进退两难。灯影里，他的脸一半明一半暗，看不出喜怒。"
],options:[
{t:"坦然地走出来，承认自己来过",check:{a:"CHA",sk:"persu",label:"坦承"},tier:{
 ok:["费尔曼看着你走出来，没有动怒。他看了你一眼：“你知道这扇门后面是什么吗？”你没答。他点点头，“知道还敢来，有胆色。”","“书你留着。但记住——看过的，别对任何人说。”他转身走了，像来时一样无声。","你站在原地，攥着那本书，心跳如鼓。"],
 fail:["你僵在原地。费尔曼没有催你，只是等着。最终你走出来，他看了一眼你怀里的书：“《守夜人手记》？”他点点头，“好书。”","他没再说什么，走了。你分不清那是放过，还是记下。"],
 crit:["你走出来，直视他的眼睛：“费尔曼教授——或者说，席恩先生？”","费尔曼的动作，顿住了。他看了你很久，最终轻轻叹了口气：“……你已经知道了。”","他沉默片刻：“那这本书，你更该留着。”他转身，“别走我的老路。”"]
},effects:{xp:15},onCrit:{flag:"acad_face_sein"},go:"acad_forbidden_4"}
]};
N["acad_forbidden_4"]={tag:"branch",place:"艾尔达魔法学院 · 禁书区",pace:"normal",text:[
"那夜之后，你成了学院里“知道太多”的人之一。",
"费尔曼不再躲你——他甚至偶尔在图书馆，主动给你留一个座位。他留座的方式很特别：把一本翻开的书放在邻桌上，书页间夹着一枚干枯的薄荷叶。你坐过去，他从不抬头，只说一句：“那本书，读到第几页了？”",
"但你知道，这条暗线，迟早要走到头：净化、封印、睁眼——三拨人都在等。圣痕司的执事最近来得更勤了，据说是在查“禁书区有人动过”的传闻。",
"你手里的那本书，是一份筹码，也是一根引线。白天在课堂上，你听着学生们讨论期末考核，恍惚间觉得自己离他们很远。",
"夜里，你躺在床上，那本书的触感还在指尖。你翻了个身，窗外北境的雪还在下。",
"你站在十字路口：是把这个发现，交给圣痕司（换取安全）；还是交给墨丘利（守住学院）；还是自己藏起来（走自己的路）？"
],options:[
{t:"把发现报告给学院（去西厅找院长）",effects:{xp:10,flag:"acad_forb_report"},tier:{ok:["你带着那本书，去找了院长。院长听完，沉默很久：“……我知道了。”他没有收你的书，只留了一句话：“学院欠你的，会在你需要的时刻还你。”","你走出院长办公室时，看见费尔曼站在回廊尽头，看着你。他没有说话，只是转身走了。"]},go:"north_academy_2"},
{t:"私下交给墨丘利教授",effects:{xp:10,flag:"acad_forb_mercury"},tier:{ok:["墨丘利接过那本书，看了很久：“……你胆子不小。”他把书锁进抽屉，“这件事，到此为止。你继续上课，当什么都没发生过。”","他顿了顿：“如果圣痕司问起来——就说，是我让你去取的。”"]},go:"north_academy_2"},
{t:"自己留着，谁也不告诉",effects:{xp:10,flag:"acad_forb_keep"},tier:{ok:["你把那本书贴身收好。","你知道，从这一刻起，你手里握着的，是一根引线。至于它通向哪里——只有走到底，才知道。"]},go:"north_academy_2"}
]};
})();

/* /u1inj:data-nodes:dn_acad_outside.js/ */
/* ============================================================
 * B-5 学院与外界互动：36 节点
 * 链：acad_people_hub（入口）→ acad_outside_hub → 信件/战争/访客/返乡/贸易 五子链
 * 全部子链闭环回 acad_outside_hub；go 目标全部存在
 * 铁律：saveVersion=48 不变；不触碰判定公式/writeNext/choose/存档语义；
 *       全部带 tag/place/pace；中文引号成对；禁 30 治理词
 * ============================================================ */
(function(){
/* ---------- 外界互动总入口 ---------- */
N["acad_outside_hub"]={tag:"main",place:"艾尔达魔法学院 · 山门邮驿",pace:"normal",text:[
"学院的邮驿在山门左侧，一间挂了块“代收代寄”木牌的旧屋。负责的是个退伍的老兵，姓赵，左眼蒙着黑布，右手在登记簿上写起字来又快又稳。",
"他看见你，从柜台下翻出一摞东西：“你的信，攒了三封。还有，北边来的商队今早到了，在镇口扎营；西境来了个游侠，在打听学院的符文学课；东边来了个官差，说是‘顺路’送文书。”",
"他把信按日期排好：“老规矩，一封一封来。”他顿了顿，压低嗓门，“还有件事——学院后山的旧马厩，这几天夜里有人进出。我老眼昏花，看不太清，你留个心。”"
],options:[
{t:"先读积攒的信件（家书/旧识）",go:"acad_letter_1"},
{t:"打听外面的战事消息（铁门关/募兵）",go:"acad_war_1"},
{t:"去镇口看看北边来的商队（访客·商队）",go:"acad_visit_desert"},
{t:"去后山旧马厩附近转转（外出探查）",go:"acad_home_9"},
{t:"看看有什么能倒卖的营生（贸易）",go:"acad_trade_1"},
{t:"回宿舍，这些事明天再说",go:"acad_people_hub"}
]};
/* ---------- 信件链（8） ---------- */
N["acad_letter_1"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第一封信，是母亲的。信封上的字迹有些歪——她识字不多，是请人代写的。信很短：“儿，家里都好。天冷了，记得添衣。你寄回来的钱收到了，够用。村里又有人去当兵了，你爹嘴上没说，心里惦记你。别逞强。”",
"信纸背面，她歪歪扭扭补了一行自己的字：“平安就好。”那三个字，笔画练了很多遍，才写得像个样子。",
"你捏着信纸，站了一会儿。窗外北风呼啸，信纸边缘卷起一角。你把它小心折好，收进怀里。"
],options:[
{t:"写回信，报平安",effects:{xp:8,flag:"acad_letter_y1_sent"},tier:{ok:["你坐在邮驿的条凳上写回信。写学院、写雪、写食堂的汤。写到“我在这里很好”时，你顿了顿，又补了一句：“爹娘放心，我学的东西，够护住自己。”","你封好信，递给赵老兵：“老规矩，走驿站。”"]},go:"acad_letter_2"},
{t:"给家里寄点钱",effects:{gold:-5,xp:5},tier:{ok:["你从行囊里数出五个银月，用布包好，夹进信里。赵老兵接过去，掂了掂：“够家里吃一阵了。你是个孝心的。”","他记下账目，把信收进待寄的格子里。"]},go:"acad_letter_2"},
{t:"先收好信，回去再写",effects:{xp:3},tier:{ok:["你把信收进怀里，打算晚上在灯下好好回。","赵老兵看了你一眼：“家书抵万金。早点回，别让老人等。”"]},go:"acad_outside_hub"}
]};
N["acad_letter_2"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"你正收信，赵老兵又递过来一封：“这封是三天前到的，寄件人写着‘李管事’，自由城邦商会的。”",
"信纸用的是商会专用的厚纸，字迹工整：“小友如晤。当年你在商会跑腿，老夫便知你不是池中之物。如今你在学院求学，想来已今非昔比。近日商会欲在北方设一分号，苦于无人引路。若小友有意，可代为牵线，报酬从优。”",
"信的末尾，用蝇头小字补了一句：“另：当年那个木盒之事，老夫一直记挂。你若得闲，回城一叙。”"
],options:[
{t:"回信，答应替他留意北方商路",check:{a:"CHA",sk:"persu",label:"回信"},tier:{
 ok:["你回了一封短信，答应留意北方的商路，也问了一句木盒的事。半月后，李管事回信，只字未提木盒，只说你“办事稳妥”，随信附了一枚商会的铜章。"],
 fail:["你犹豫了一下，只回了“暂无意向”四个字。李管事没有再来信，那枚商会铜章自然也没了影。"],
 crit:["你不仅答应留意商路，还托赵老兵打听了北境的行情，一并写在信里。李管事回信时，信里夹了一张银票：“贤友此信，价值千金。木盒之事，面谈。”"]
},effects:{xp:15},onCrit:{flag:"acad_trade_letter",item:"商会铜章"},go:"acad_letter_3"},
{t:"回信，婉拒他",effects:{xp:5},tier:{ok:["你回信说学业繁忙，无暇他顾。李管事是个明白人，再没有来信。","你隐约觉得，自己错过了一条线。但学院里的事，已经够多了。"]},go:"acad_letter_3"},
{t:"把信收好，暂不回",effects:{xp:3},tier:{ok:["你把信折好收进箱底。李管事的事，不急于一时。","但你知道，那枚商会铜章，以后未必还有机会拿到。"]},go:"acad_outside_hub"}
]};
N["acad_letter_3"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第三封信，来自林——你在北上商队里结识的那个年轻人。信纸皱巴巴的，像是揣在怀里捂了一路：“兄台见字如面。我如今在河湾城落了脚，跟人合伙跑水路。上次你说北境冷，我托人带了两坛南边的桂花酿，存在镇口酒铺，你自取。”",
"信的末尾，他画了个歪歪扭扭的箭头：“这边生意还行，就是河上不太平——有船队说，看见水里飘着黑油一样的东西，往下游走。你那边要是听到什么风声，给我捎个信。”",
"你想起林那双总带着笑的眼睛。河湾城的消息，值得留意。"
],options:[
{t:"去镇口酒铺取桂花酿",effects:{gold:0,item:"桂花酿×2"},tier:{ok:["你在酒铺取了酒，两坛，用草绳拴着。坛口封得很严，系着红绳——林的手艺。","你抱回宿舍，打算找天跟凯恩、阿塔一起喝。"]},go:"acad_letter_4"},
{t:"写信告诉林：北境的黑烟传闻",effects:{xp:10,flag:"acad_letter_lin"},tier:{ok:["你在信里写了白桦镇听来的传闻：铁门关失守那晚，关城上飘着黑烟，不是火烧的。你叮嘱他：“河上那东西，要是跟黑烟是一路的，离远些。”","半月后，林回信，只有四个字：“晓得了。谢。”"]},go:"acad_letter_4"},
{t:"把信收好，等有空再回",effects:{xp:3},tier:{ok:["你把信收进怀里。林的桂花酿，哪天去取都行。","但河湾城“黑油”的消息，你记在了心上。"]},go:"acad_outside_hub"}
]};
N["acad_letter_4"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第四封信，是村口老货郎托人捎来的。信写在一张包过货的粗纸上，字是别人代笔的，话是老货郎的话：“学生郎，还记得我不？当年你出村，我跟你说，眼睛不一样的，学院会收。如今你在学院待了几年，眼界开了，但我这老货郎还想提你一句——你那双眼睛，是见过东西的。有些事，别因为读了书就忘了。”",
"信末，代笔的人用括号补了一行：“他说，你小时候偷看他货箱里的罗盘，被他逮住，你说是‘想看它指哪儿’。他让我一定把这事写进去，说你记得。”",
"你看着那行字，忽然笑了。那年你七岁，确实偷看过他的罗盘。"
],options:[
{t:"写信问候老货郎",effects:{xp:8,flag:"acad_letter_oldpeddler"},tier:{ok:["你回信，问他罗盘还在不在，问他村里如今怎么样。","半月后回信只有短短几行：“罗盘还在，指北。村里又走了几个后生，都是去当兵。你爹的腿，入冬又犯了，不碍事。”","信末又补了一句：“你还记得那个罗盘，老头子高兴。”"]},go:"acad_letter_5"},
{t:"记下老货郎的话，不多回",effects:{xp:5},tier:{ok:["你把信折好，压在箱底。老货郎的话，像村口的老井，平时不起眼，渴的时候才想起它的好。","“别因为读了书就忘了。”你默念了一遍。"]},go:"acad_letter_5"}
]};
N["acad_letter_5"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第五封信，是阿塔他阿爸的旧识托人带来的——一个草原汉子，风尘仆仆，在邮驿门口等你：“你是阿塔的兄弟？”你点头。他从怀里摸出一封信，和一块用皮绳串着的狼骨：“阿塔的阿爸，去年冬天没了。他托人带话，让阿塔毕业了回草原一趟。”",
"你接过信和狼骨，手有些沉。汉子说：“草原上的规矩，人走了，话要带到。你是他在学院里最亲近的人，我就找你了。”",
"你回到宿舍，把信和狼骨交给阿塔。他接过去，沉默了很久，把狼骨攥在手心，指节发白。"
],options:[
{t:"陪阿塔坐一会儿",effects:{xp:10,relation:{npc:"acad_ata",v:10}},tier:{ok:["你在他旁边坐下，没说话。过了很久，阿塔开口：“我阿爸说，草原上的狼，死在雪地里，不让人看见。”他顿了顿，“他走的时候，身边有人吗？”","你没法回答。他也没再问。你们坐到夜深。"]},go:"acad_letter_6"},
{t:"帮他问赵老兵：怎么寄信回草原",effects:{xp:5,relation:{npc:"acad_ata",v:5}},tier:{ok:["你帮阿塔问清了驿路：草原的信，走西境商道，三个月能到。阿塔写了回信，托那个汉子带回去。","他写完信，把狼骨重新挂回脖子上：“我欠你一回。”"]},go:"acad_letter_6"},
{t:"把信和狼骨交给他，就离开",effects:{xp:5},tier:{ok:["你把东西交给他，就回了自己房间。隔着墙，你能听见他压低的呼吸声。","有些悲伤，不需要别人看着。"]},go:"acad_letter_6"}
]};
N["acad_letter_6"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第六封信，来自西境。信封上盖着行省会的火漆印，字迹硬朗：“致学院符文学在读之学生：闻君于符文一道颇有造诣。西境元素风暴日炽，行省会拟立‘风暴观测站’，需通晓符文之人。若君有意，毕业后可携此信至行省会一叙。——西境行省议事厅”",
"赵老兵递信时多嘴了一句：“这封是从官驿走的，比普通信快。”他把声音压到极低，“西境那边，最近风声紧——元素风暴刮得厉害，好几条商路都断了。”",
"你把信翻来覆去看了两遍。西境，风暴，符文——这几个词在你脑海里转了一圈。"
],options:[
{t:"收好信，记住这条路",effects:{xp:8,flag:"acad_letter_west"},tier:{ok:["你把信仔细折好，收进行囊夹层。西境的风暴观测站，也许是个去处。","你想起西境游侠若耶——他也提过元素风暴的事。"]},go:"acad_letter_7"},
{t:"现在写回信，探探口风",check:{a:"CHA",sk:"persu",label:"探询"},tier:{
 ok:["你回了一封信，问观测站的具体职责与报酬。一个半月后，回信到了，附了一份《风暴观测站章程》——事无巨细，看得出是认真招人。"],
 fail:["你回信问得笼统，回信也只笼统答了“面议”。不过，至少算接上了线。"],
 crit:["你在信里附了一段你对“风暴与符文共振”的见解——是在图书馆旧档里读到的。三个月后，回信只有一行：“你被录了。毕业后直接来。”"]
},effects:{xp:15},onCrit:{flag:"acad_letter_west_offer"},go:"acad_letter_7"},
{t:"把信放在一边，先不想毕业的事",effects:{xp:3},tier:{ok:["你把信收进抽屉。毕业还有时间，路可以慢慢挑。","但西境那条线，你记住了。"]},go:"acad_outside_hub"}
]};
N["acad_letter_7"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"第七封信，是东境来的。信封上没写寄件人，只画了一个圆圆的印记——像一枚铜钱，又像一轮满月。拆开，里面只有一张字条：“当年账房先生塞给你的那张纸条，还记得吗？若记得，来东境承天城，找沈氏旧宅的看门人。他姓钱。”",
"你握着字条，想起当年在东行路上，那个塞纸条给你的账房先生。纸条上写的是什么来着？你翻出行囊——那张旧纸条还在，字迹已经模糊，依稀能认出几个字：“……官道上，有人替你看路。”",
"这封信像一根线，把两件相隔多年的事，串在了一起。"
],options:[
{t:"收好信，记住承天城的地址",effects:{xp:8,flag:"acad_letter_east"},tier:{ok:["你把字条和旧纸条放在一起，收进夹层。承天城、沈氏旧宅、看门人钱先生——这条路，以后也许用得上。","你想起晨天城的传说，心里多了一丝盘算。"]},go:"acad_letter_8"},
{t:"立刻写回信，问个明白",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["你按信封上的印记，回信到东境驿站，请他们转交。三个月后，回信只有一句：“时候未到。到承天城，自然会有人告诉你。”"],
 fail:["回信石沉大海。你等了半年，没有回音。也许那封信，本就不期待回信。"],
 crit:["你不仅回了信，还把你记得的纸条内容抄了一份寄过去。回信很快：“你记得很清楚。这很好。钱先生会等你到毕业。”"]
},effects:{xp:15},onCrit:{flag:"acad_letter_east_reply"},go:"acad_letter_8"},
{t:"把信放回邮驿的待领格里",effects:{xp:3},tier:{ok:["你犹豫了一下，把信放回待领格：“先放着，我回头再来取。”","赵老兵看了你一眼：“有些信，放久了就找不着了。”"]},go:"acad_outside_hub"}
]};
N["acad_letter_8"]={tag:"main",place:"艾尔达魔法学院 · 邮驿",pace:"normal",text:[
"最后一封信，没有寄件人，只有邮戳盖着一个模糊的印记——像一根钉子，钉进一枚铜钱里。信纸上只有一行字：“第七哨的火，还没灭。等你。”",
"你握着信纸，指腹摩挲着那行字。字迹很工整，不像急就，像写了很久，终于找到机会寄出来。",
"赵老兵看了一眼那信，罕见地没有问。他只是说：“这封信，是从铁门关方向转来的，走了两个驿站。寄信的人，大概不方便留名字。”"
],options:[
{t:"把这封信和铁牌收在一起",effects:{xp:10,flag:"acad_letter_seven"},tier:{ok:["你把信纸折好，和那块铁牌放在同一层行囊。","第七哨的火还没灭。你摸了摸铁牌上那行字——“点火者，不死。”"]},go:"acad_outside_hub"},
{t:"问赵老兵：铁门关最近有什么消息",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["赵老兵沉默了一会儿：“铁门关的烽火台，最近夜里亮过一回。就一回，一盏灯，烧了一刻钟就灭了。”他顿了顿，“守城的老兵说是‘走水’，但没着火。”","你心里一跳——那盏灯，也许不是走水。"],
 fail:["赵老兵摇摇头：“关城上的事，隔着几十里，传过来都变味了。你别打听。”"],
 crit:["赵老兵压着嗓子：“我有个老兄弟在铁门关当更夫。他托人带话——‘第三哨的烽火台，有人在半夜添柴。’”他盯着你，“添柴的人，不穿守军的衣服。”"]
},effects:{xp:15},onCrit:{flag:"acad_war_third_fire"},go:"acad_outside_hub"}
]};
/* ---------- 战争链（5） ---------- */
N["acad_war_1"]={tag:"main",place:"艾尔达魔法学院 · 山门告示栏",pace:"normal",text:[
"学院的告示栏，这学期多了一张新告示：铁门关守军募兵，守满三月免赋三年，赏金按人头计。告示下方，用红笔加了一行：“伤者亦收，守库、看粮、烧水皆可。”",
"告示前围了一圈学生。有人议论：“都打成这样了，还要收伤兵？”“城墙又塌了一段？上个月不是说修好了吗？”没人能答上来。",
"一个高年级学生挤出人群，脸色不太好看：“我表哥在铁门关。他说，不是城墙塌了——是守军的人，一夜之间少了三成。不是战死，是‘不见了’。”他话声放轻，“跟去年烽火台那事一样，没人说得清。”"
],options:[
{t:"挤进去细看告示",check:{a:"INT",sk:"lore",label:"研读"},tier:{
 ok:["你把告示从头读到尾。红笔那行“伤者亦收”是新添的——字迹跟上面不同，像是有人后来补的。你注意到“守库”两个字下面，有一道极轻的指甲划痕。"],
 fail:["你挤进去时，人群已经散了。你只看到告示的落款：铁门关守备府。日期是上个月末。"],
 crit:["你不仅看了告示，还注意到告示背面有一行铅笔字，极淡：“若有识得符文者，可至第三哨寻更夫老陈。”字迹被人用指甲刮掉了一半，但还认得出。"]
},effects:{xp:12},onCrit:{flag:"acad_war_notice"},go:"acad_war_2"},
{t:"问那个高年级学生，表哥还说了什么",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["他压低嗓门：“我表哥说，不见的那三成人，都是在夜里没的。第二天点卯，铺盖还在，人没了。床铺都是凉的，像走了很久。”他打了个寒颤，“守军里有人说是‘城里有东西’。”"],
 fail:["他摆摆手：“就这些。别问了，问多了睡不着。”"],
 crit:["他犹豫很久，从怀里摸出一张纸条：“我表哥托我带给学院里‘懂行的人’。他说，第三哨的城墙根，夜里能听见地下有动静——像凿石头，又像挠墙。”","纸条上画了个简图，标注了第三哨的位置。"]
},effects:{xp:15},onCrit:{flag:"acad_war_third_outpost"},go:"acad_war_2"},
{t:"记住告示的内容，先离开",effects:{xp:5},tier:{ok:["你把告示上的要点记在心里：募兵、免赋、伤者亦收。以及那行红字。","北境的战争，比白桦镇听到的更近。"]},go:"acad_outside_hub"}
]};
N["acad_war_2"]={tag:"main",place:"艾尔达魔法学院 · 山门",pace:"normal",text:[
"你正要离开告示栏，一辆牛车从山道上来了。车上坐着七八个年轻人，穿着各色旧衣，有的还背着包袱——是来应募的。",
"赶车的老汉在学院门口勒住牛车，扬声问：“守军募兵处在哪儿？我们是从河湾城来的，听说了告示，连夜赶过来的。”",
"一个瘦小的后生跳下车，搓着手：“大哥，我是铁匠的徒弟，会打铁。守军要收‘守库’的，你看我行不？”他眼神热切，像怕被拒绝。"
],options:[
{t:"给他指路，顺口问两句",check:{a:"CHA",sk:"persu",label:"搭话"},tier:{
 ok:["你告诉他募兵处往镇口走，又问他们为何来应募。瘦后生说：“铁门关守不住，河湾城也不安稳。与其等着被征，不如自己来，还能领赏钱。”他顿了顿，“我爹说，乱世里，命是自己的，要自己挣。”"],
 fail:["他急着去报到，没多聊，只道了谢就走了。"],
 crit:["瘦后生把声音压到极低：“其实还有个原因——我们村来了个‘募粮官’，说每家出一个人。他看人的眼神不对，像在看牲口。”他打了个寒颤，“我爹让我先跑，别留在村里等点名。”","你记住了“募粮官”三个字。"]
},effects:{xp:12},onCrit:{flag:"acad_war_grain_officer"},go:"acad_war_3"},
{t:"目送他们下山，没说话",effects:{xp:5},tier:{ok:["牛车摇摇晃晃地下山了，车上的人还在兴奋地说着赏钱的事。","你站在山门口，看着他们远去。北风把他们的笑声吹散。"]},go:"acad_outside_hub"}
]};
N["acad_war_3"]={tag:"main",place:"艾尔达魔法学院 · 山门外",pace:"normal",text:[
"这天傍晚，学院山门外来了一队难民——从北边过来的，比白桦镇那批更狼狈。他们挤在山门外的空地上，男女老少，裹着破布，脸上都是冻伤。",
"守门的兽人门房拦住他们，急得直摆手：“学院不收外人！不能进！”领头的难民老汉扑通跪在雪地里：“军爷，行行好，让孩子进去烤烤火吧。我们走了十天，死了一半人。”",
"门房左右为难，搓着大手，回头看你——你是学院的学生，他认得你袍子上的纹章。他眼巴巴地望着你，像在问：怎么办？"
],options:[
{t:"去禀报学院管事的执事",effects:{xp:10,flag:"acad_refugee_report"},tier:{ok:["你跑去找管事的执事，说明情况。执事皱着眉听完，最终点了头：“让妇孺进后院烤火，男人留在外面，派粥。”他顿了顿，“这是破例。下不为例。”","你跑回山门，把消息告诉难民。人群里响起一片低低的哭声——是庆幸的哭。"]},go:"acad_war_4"},
{t:"自掏腰包，买几捆柴给他们生火",effects:{gold:-3,relation:{npc:"acad_auntie",v:5}},tier:{ok:["你花三个银月买了柴，在空地上生了三堆火。难民们围拢过来，伸出冻得发青的手。","领头的老汉拉着你的手不放：“学生爷，你是个好人。好人会有好报的。”","你抽回手，心里翻搅着说不清的滋味。"]},go:"acad_war_4"},
{t:"跟着门房一起拦着，不敢做主",effects:{xp:5},tier:{ok:["你站在门房旁边，帮着他拦人。心里不是滋味，但学院的规矩，你不敢破。","夜里你躺在宿舍，听见山门外有人在哭。你翻了个身，一夜没睡好。"]},go:"acad_outside_hub"}
]};
N["acad_war_4"]={tag:"main",place:"艾尔达魔法学院 · 山门外",pace:"normal",text:[
"难民安置下来后，你从他们口中拼出了北边的战况：铁门关外城三度易手，东军来势汹汹，但更怪的是——难民们说，他们逃出来的那个庄子，不是被东军烧的。",
"一个老妇人拽着你的袖子，声音发颤：“那天晚上，庄子上来了一队人，穿着旧军服，打着铁门关的旗号。他们进村，不说话，不抢东西，只挨家挨户看人——看完了，就走了。第二天，村里就起了火。”",
"她浑浊的眼睛里满是恐惧：“火是青色的。烧了一夜，人没跑出来几个。学生爷，那不是普通的火。”"
],options:[
{t:"追问那队人的样子",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["老妇人想了很久：“他们不说话。从头到尾，没人说过一个字。”她比划了一下，“领头那个，脸上蒙着布，露出来的半张脸，白得不像活人。”"],
 fail:["老妇人摇摇头：“我记不清了。只记得他们走路的动静——没有脚步声。”"],
 crit:["老妇人压着嗓子：“我男人是更夫。他那天夜里偷偷看了一眼——那队人进村的时候，地上没有影子。”她说完，整个人抖得像筛糠，“他第二天就烧糊涂了，现在还没醒。”"]
},effects:{xp:15},onCrit:{flag:"acad_refugee_noshadow"},go:"acad_war_5"},
{t:"把这个说法记下来，回学院查档案",effects:{xp:10,flag:"acad_refugee_notes"},tier:{ok:["你在回学院的路上，把这个说法反复咀嚼：旧军服、铁门关旗号、不说话、青色的火。","这些细节，你在图书馆的旧档里，好像见过相似的记载。"]},go:"acad_war_5"},
{t:"把自己的干粮分给老妇人",effects:{gold:-1,relation:{npc:"acad_auntie",v:3}},tier:{ok:["你把干粮塞进老妇人手里。她愣愣地接过去，眼泪忽然就下来了：“学生爷，你是个好人。”","你摆摆手，走开了。心里那团疑云，却越来越重。"]},go:"acad_outside_hub"}
]};
N["acad_war_5"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你在图书馆旧档里翻了一下午，终于找到一条对得上的记载。一本泛黄的《北境战事录》，第三册，记录了三十年前的一次“民变”：",
"“……庄户千人夜遁，村中起火，火色青碧，三日不熄。事后查检，尸骸俱无。村口古井中，捞得铁牌一面，形制非本军所制。”",
"你翻到这一页，手指停在“铁牌”两个字上。你从怀里摸出你那两块拼起来的铁牌，放在书页旁边——纹路、锈色，如出一辙。",
"你合上书，坐了很久。三十年前就有这种事。而三十年后，它又来了。"
],options:[
{t:"把铁牌和记载收好，记住这条线",effects:{xp:12,flag:"acad_war_oldcase"},tier:{ok:["你把书页抄了一份，和铁牌收在一起。三十年前的青色火、铁牌、夜遁的庄户——和今天的难民说辞，严丝合缝地对上了。","这条线，你记在了心里。"]},go:"acad_outside_hub"},
{t:"把发现告诉费尔曼教授",check:{a:"CHA",sk:"persu",label:"求证"},tier:{
 ok:["费尔曼听完，沉默了很久：“三十年前的案子，档案里应该有，但我没见过。”他顿了顿，“你能找到这本书，说明它一直在这里等着被人翻开。”","他把书页抄录了一份，仔细折好：“这条线，你留着。会有用的。”"],
 fail:["费尔曼皱着眉听完：“记载未必可靠。战时的书，多少有夸大。”他没有多问，但你看得出他记下了这事。"],
 crit:["费尔曼看完记载，忽然说：“‘火色青碧，三日不熄’——这不是火烧的。”他话声放轻，“这是封印松动的迹象。青色火，是深渊气息烧到实物的颜色。”他顿了顿，“三十年前，第七节点附近，有人试过封一道新裂口。看来，没封住。”"]
},effects:{xp:18},onCrit:{flag:"acad_ferman_bluefire"},go:"acad_outside_hub"}
]};
/* ---------- 访客链（6） ---------- */
N["acad_visit_desert"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇口",pace:"normal",text:[
"镇口的商队营地，比想象中热闹。十几匹骆驼卧在雪地里，驼铃叮当。商队头领是个黑脸汉子，裹着沙漠风格的厚袍子，正指挥伙计卸货。",
"他看见你穿着学院的袍子，眼睛一亮，用带着口音的通用语招呼：“学生郎！正好！我这儿有样东西，想请学院里的人掌掌眼——花不白费，茶水钱我出。”",
"他从货箱里捧出一个木匣，打开，里面是一块巴掌大的黑石，表面刻着密密麻麻的符文，样式跟你见过的任何流派都不一样。他说：“从沙漠古城挖出来的。我听人说，学院里有人懂这个。”"
],options:[
{t:"接过黑石细看",check:{a:"INT",sk:"lore",label:"鉴定"},tier:{
 ok:["你对着光看了很久。符文是古沙漠文，大意是“沙下之井，勿饮”。你告诉头领，这可能是古城的警示符，不是护身符。他听完，谢了你，说回头把那东西埋回去。"],
 fail:["你认不全这些符文，只能含糊地说“像是古物”。头领有些失望，但还是道了谢。"],
 crit:["你不仅认出了大意，还发现符文深处藏着一个更小的印记——你曾在罗先生的笔记里见过：那是“第七节点”的旧标记。你不动声色地记住了，只说“可以埋回去”。","头领给你塞了一小袋银月当茶水钱，你推不掉，收了。"],
 critfail:["你盯着看了半天，说了句外行话。头领的笑容淡了，把木匣收了回去：“看来学院里也不是都懂。”他转身招呼别人去了。"]
},effects:{xp:15},onCrit:{flag:"acad_blackstone_mark"},go:"acad_outside_hub"},
{t:"问他古城的位置",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["头领压低嗓门：“在死亡沙漠深处，绿洲城再往南，走半个月。那片古城，十年前还没人知道——沙暴过后，露出来的。”他顿了顿，“进去的人，十个回来两三个。”"],
 fail:["头领摇摇头：“那个地方，不能乱说。说了，会有人去找死。”"],
 crit:["头领四下看看，从怀里摸出一张羊皮图：“这是我自己画的路线。送你，算是交个朋友。”他补了一句，“别让第二个人看见。”","羊皮图上，古城的位置画了个叉，旁边写着一行小字：“井底有东西，别往下看。”"]
},effects:{xp:15},onCrit:{flag:"acad_desert_map"},go:"acad_outside_hub"},
{t:"谢绝，回学院",effects:{xp:3},tier:{ok:["你婉拒了。沙漠古城的东西，听着就烫手。","但你记住了黑石上那个印记。"]},go:"acad_outside_hub"}
]};
N["acad_visit_west"]={tag:"main",place:"艾尔达魔法学院 · 符文教室",pace:"normal",text:[
"西境来的游侠，是个叫若耶的年轻女子，腰间挎着两把短刀，风尘仆仆。她来学院，是想借符文学的课听几堂——“元素风暴刮得厉害，行省会想找懂符文的人观测。我半路出家，想补补课。”",
"她坐在教室最后一排，听得很认真。下课你路过她身边，她忽然叫住你：“你刚才那处——‘风暴与符文共振’的推演，我在西境见过真的。”她把声音压到极低，“元素风暴中心，有东西在‘呼吸’。跟符文共振的频率，一模一样。”",
"她看着你，目光很直接：“你懂这个，是吗？我在西境等了三年的，就是懂这个的人。”"
],options:[
{t:"跟她聊风暴观测的事",check:{a:"INT",sk:"lore",label:"交流"},tier:{
 ok:["你们聊了一下午。若耶讲了西境的元素风暴：沙暴里带电光、能吹走马匹、风暴眼里反而风平浪静——“平静得像假的”。你讲了符文共振的推演。她眼睛越来越亮：“你毕业了，来西境吧。行省会要你这种人。”"],
 fail:["你跟她聊了几句，发现自己对风暴的了解远不如她。她倒也不失望：“能听懂我在说什么的人，学院里也没几个。你算一个。”"],
 crit:["你们聊到深夜。若耶把她在风暴眼里记录的符文拓片给你看——那些符文，和沙漠商队头领那块黑石上的，是同一种风格。","你心头一跳，但没有声张，只说“我好像见过类似的”。"]
},effects:{xp:18},onCrit:{flag:"acad_west_runes"},go:"acad_outside_hub"},
{t:"问她：风暴眼里是什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["若耶沉默了一下：“风暴眼里，有一根石柱。柱子上全是符文，从头刻到底。”她顿了顿，“我在柱子上刻过一行字，一年后再去看，字没了——被新长出来的符文盖住了。”"],
 fail:["若耶摇摇头：“那个地方，不是能随便说的地方。我说了，你会被卷进去。”"],
 crit:["若耶压着嗓子：“柱子上有一行字，我认不全，但记下来了——”她从怀里摸出一张纸条，“你帮我看看，是不是古沙漠文。”","纸条上的字，和你记忆里那枚黑石印记，是同一种风格。你认出了其中三个字：“……井下……勿……”"]
},effects:{xp:18},onCrit:{flag:"acad_west_column"},go:"acad_outside_hub"},
{t:"道别，回宿舍",effects:{xp:3},tier:{ok:["你和若耶道别。她走时拍了拍你肩膀：“记住，西境的风暴观测站，缺人。”","你点头，把她的名片收进怀里。"]},go:"acad_outside_hub"}
]};
N["acad_visit_church"]={tag:"main",place:"艾尔达魔法学院 · 会客厅",pace:"normal",text:[
"光明教会来了位灰袍执事，说是来学院“交流圣典”。他被安排在会客厅，由神学系的特蕾莎嬷嬷接待。你路过时，他正好出来，看见你腰间的铜铃，脚步顿了一下。",
"他停下，温声问：“这位学生，你腰间的铃铛，是从何处得来？”语气很温和，但你看得出，他问得非常认真。",
"你还没回答，特蕾莎嬷嬷从门里出来，挡在你和灰袍执事之间：“执事先生，学生的事，学院自会照看。”她话里有话，“学院的学生，不归圣痕司管。”灰袍执事笑了笑，不再追问，走了。"
],options:[
{t:"问特蕾莎嬷嬷：圣痕司在找什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["特蕾莎嬷嬷沉默了一会儿：“圣痕司在找‘守夜人的信物’。”她看着你腰间的铜铃，“你那个铃铛，若是守夜人一脉的，最好收起来。他们找这个东西，找了很多年了。”"],
 fail:["特蕾莎嬷嬷摇摇头：“教会的事，你不要打听。你只需要知道，别让圣痕司的人注意到你。”"],
 crit:["特蕾莎嬷嬷把你拉进屋里，关上门：“你那个铃铛，是不是内壁有个‘七’字？”你点头。她叹了口气：“果然。”她话声放轻，“守夜人的铜铃，一共七枚，对应七个节点。圣痕司收走了六枚，只差你这一枚。”","她顿了顿，“你把它藏好。藏不住，就毁了它。别让它落到他们手里。”"]
},effects:{xp:18},onCrit:{flag:"acad_church_sevenbells"},go:"acad_outside_hub"},
{t:"把铜铃解下来，收进怀里",effects:{xp:10,flag:"acad_bell_hidden"},tier:{ok:["你当着她的面把铜铃解下来，收进贴身衣袋。特蕾莎嬷嬷点了点头：“收好。今天起，别再让人看见。”","你走出会客厅时，总觉得暗处有双眼睛。"]},go:"acad_outside_hub"},
{t:"留在原地，没接话",effects:{xp:5},tier:{ok:["你站在门口，没接话。灰袍执事已经走远了，特蕾莎嬷嬷看着你，张了张嘴，最终只说：“好自为之。”"]},go:"acad_outside_hub"}
]};
N["acad_visit_east"]={tag:"main",place:"艾尔达魔法学院 · 山门",pace:"normal",text:[
"东境来的官差，是个精瘦的中年人，戴着承天城官署的帽子，递上文书时腰杆笔直：“奉承天城官署之命，送一份文书给贵院。另外——”他压低嗓门，“听说贵院有位学生，识得古文字，能否引见？”",
"你正好在场。官差打量了你几眼，忽然说：“阁下可还记得，东行官道上，有人塞给你一张纸条？”他问得很轻，像怕被人听见。",
"你心里一动——那张纸条，你一直收着。"
],options:[
{t:"承认记得，问他是谁",check:{a:"CHA",sk:"persu",label:"试探"},tier:{
 ok:["官差四下看了看：“我是沈氏旧宅的人。当年塞纸条给你的账房先生，是我师兄。”他顿了顿，“他去年没了。临终前托我带句话：‘官道上，有人替你看路——那个人，等你毕业。’”"],
 fail:["官差见你犹豫，没有追问，只是说：“既然不便，便罢。文书送到，我告辞了。”他转身要走。"],
 crit:["官差把声音压到极低：“师兄临终前还留了一句话：‘晨天城的井，通了。’他说你听得懂。”","你确实听懂了——晨天城、井、东境。那条线，又深了一层。"],
 critfail:["你反问得急，官差警觉地收了话头：“看来是我认错人了。告辞。”他走得很快，你没来得及再问。"]
},effects:{xp:18},onCrit:{flag:"acad_east_chentian"},go:"acad_outside_hub"},
{t:"试探他：承天城最近有什么动静",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["官差沉默了一下：“承天城在换血。老臣一批批告老，新面孔一批批上来。秦家——”他停住，“这个话题，不适合在外头说。”他压着嗓子，“你若去承天城，记住：别走官道夜路。”"],
 fail:["官差摆摆手：“官署的事，不便外传。”"],
 crit:["官差看了你很久：“你是那封信上说的‘值得信的人’吗？”他没等你回答，自己点了点头，“承天城有个人，想见你。他说，你腰间的铜铃，是钥匙。”","他说完，转身走了，没留名字。"]
},effects:{xp:15},onCrit:{flag:"acad_east_bellkey"},go:"acad_outside_hub"},
{t:"不接话，让他走",effects:{xp:3},tier:{ok:["你没有接话。官差也不勉强，行了个礼，走了。","你望着他的背影，心里翻涌着那句“晨天城的井，通了”。"]},go:"acad_outside_hub"}
]};
N["acad_visit_elf"]={tag:"main",place:"艾尔达魔法学院 · 北境商道",pace:"normal",text:[
"你在学院外的北境商道上，碰见一队精灵商人——长耳朵，白袍，牵着几匹银鬃马，驮着货物往南去。领队是个银发的精灵女子，举止从容。",
"她看见你腰间的铜铃，目光一凝，勒住马，用带着古腔的通用语问：“人类学生，你腰间的铃铛——是守夜人的信物？”",
"她翻身下马，走近几步，端详着那枚铜铃：“我在族里的典籍里见过这种铃铛。第七节点的守夜人，戴的就是这个。”她顿了顿，“你一个学生，怎么会有这个？”"
],options:[
{t:"反问她：精灵族里知道多少守夜人的事",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["银发精灵沉默了一会儿：“族里的典籍记载，守夜人一脉，已有千年。第七节点的守夜人，代号‘点火者’。”她顿了顿，“典籍最后一页写着：‘点火者，不死。火种，不息。’”"],
 fail:["她摇摇头：“典籍上的事，我不能多说。但你既然戴着这铃铛，便该知道它的分量。”"],
 crit:["银发精灵看了你很久：“族里有一句古话：‘第七节点若灭，万灯俱熄。’”她话声放轻，“三百年前，族里曾有长者预言：第七节点的火，会在这一代熄灭一次——除非，有新人接替。”","她看着你，目光复杂：“你，会是那个新人吗？”"]
},effects:{xp:18},onCrit:{flag:"acad_elf_prophecy"},go:"acad_outside_hub"},
{t:"问她：精灵族怎么知道这么多",effects:{xp:10},tier:{ok:["银发精灵说：“守夜人一脉，最早的几位，出自精灵族。”她顿了顿，“后来人族接替，精灵族便退回了典籍里。”她看着你，“但族里，一直记着第七节点。”"]},go:"acad_outside_hub"},
{t:"谢过她，继续走路",effects:{xp:5},tier:{ok:["你向她道谢，继续赶路。银发精灵在身后说：“人类学生，若你去第七节点，记得——带一盏自己的灯。”","你回头，她已经翻身上马，银鬃马踏雪而去。"]},go:"acad_outside_hub"}
]};
N["acad_visit_dwarf"]={tag:"main",place:"艾尔达魔法学院 · 锻造工坊",pace:"normal",text:[
"矮人铁匠巴林，是学院特聘的锻甲师傅，负责给守夜人锻打兵器。他的工坊在学院东角，炉火常年不熄，锤声从早响到晚。",
"你今天去工坊取定制的匕首，巴林正光着膀子抡锤，看见你，用浑厚的声音招呼：“小子，来看看这个！”他拎起一块铁坯，“学院要打一批新兵器，送铁门关的。你说，打刀还是打矛？”",
"他压低嗓门，难得正经：“铁门关那地方，城墙高，巷子窄。刀太短够不着，矛太长转不开身。”他锤了一下铁坯，“得打一种两头都能用的——我琢磨了三天了。”"
],options:[
{t:"跟他一起琢磨兵器形制",check:{a:"INT",sk:"smith",label:"设计"},tier:{
 ok:["你们蹲在炉边，用炭笔画了十几张草图。最后定了一种：矛头带钩、枪杆包铁——能刺、能钩、能砸。巴林拍着大腿：“好！就这么打！”他当场开工，火星四溅。"],
 fail:["你对兵器设计一窍不通，只能站在旁边看。巴林倒不嫌弃：“看着就行。学一门手艺，不亏。”"],
 crit:["你想起铁门关那面令牌上的“第三哨”——哨位设在城墙上，兵器要能守能攻。你把这个想法说了，巴林眼睛一亮：“对！城墙上的活，跟巷子不一样！”他连夜改了图纸，第二天打出来的新兵器，连戈拉看了都说好。"],
 critfail:["你提了个外行的建议，被巴林一眼瞪回来：“不懂就别瞎掺和！兵器是拿来救命的！”他埋头继续打铁，你讪讪退到一边。"]
},effects:{xp:15},onCrit:{flag:"acad_weapon_design"},go:"acad_outside_hub"},
{t:"问他：学院为什么要给铁门关打兵器",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["巴林停下锤子，擦了一把汗：“学院跟铁门关，是老交情了。守夜人一脉，一半出自学院，一半出自关城。”他顿了顿，“关城要是没了，学院这道门，也守不住。”"],
 fail:["巴林摇摇头：“这种事，上头没让我说，我不多嘴。”他继续打铁。"],
 crit:["巴林把声音压到极低：“其实这批兵器，不是守军订的——是‘守夜人’订的。”他顿了顿，“他们要在北边建一个新哨。叫什么‘第七哨’。”","你心头一跳——第七哨。你怀里那面铁牌上，刻的正是这三个字。"]
},effects:{xp:18},onCrit:{flag:"acad_dwarf_seventhsentinel"},go:"acad_outside_hub"},
{t:"取了自己的匕首，道谢离开",effects:{xp:5,item:"精铁匕首"},tier:{ok:["你取了匕首。巴林把匕首抛给你：“试试手感。不满意，我再给你淬一遍。”","匕首入手沉实，刃口寒光凛凛。你收好，道了谢。"]},go:"acad_outside_hub"}
]};
/* ---------- 返乡/外出链（12） ---------- */
N["acad_home_1"]={tag:"main",place:"学院至自由城邦 · 官道",pace:"normal",text:[
"春假，你决定回一趟自由城邦的交汇城。南下的官道上，雪已经化了大半，露出灰黑的泥地。你雇了头骡子，驮着行囊，走走停停。",
"这条路，你北上时走过一次。那时你还是个刚出村的少年，揣着铜铃，心里揣着对学院的想象。如今走回来，路还是那条路，人却不一样了。",
"傍晚，你在路边茶棚歇脚。茶棚老板是个碎嘴的婆子，给你续茶时问：“学生郎，从学院回来的？学院啥样？是不是遍地都是会飞的人？”你笑着摇头：“会飞的少，会摔的多。”她哈哈笑了。"
],options:[
{t:"赶路，争取明天到城",effects:{xp:5},tier:{ok:["你多赶了一程，夜宿在官道旁的小旅店。店里的火炕烧得热，你睡得踏实。","梦里，又梦见了交汇城的石板路。"]},go:"acad_home_2"},
{t:"在茶棚多坐一会儿，听南来北往的闲话",check:{a:"CHA",sk:"persu",label:"听闲话"},tier:{
 ok:["你听了一下午闲话：自由城邦换了新税官，铁门关的军饷又拖欠了，西境的商路断了一条。茶棚婆子压着嗓子：“还有人说，城里商会那个李管事，最近发了一笔横财——跟北边来的什么‘灰货’有关。”","你记住了“灰货”两个字。"],
 fail:["闲话听了一耳朵，有用的没几句。不过，茶棚婆子的茶确实不错。"],
 crit:["你套出了更多：李管事发财，是去年冬天的事，跟他收的一个木盒有关——“那木盒，送出去又退回来了，他砸在手里，只好自己打开。打开之后，人就变了，说话做事，跟换了个人似的。”","你握着茶杯的手紧了紧——木盒。你也送过一个。"]
},effects:{xp:15},onCrit:{flag:"acad_li_woodbox"},go:"acad_home_2"},
{t:"给骡子添草料，早点歇了",effects:{hp:8},tier:{ok:["你给骡子添了草料，自己也在茶棚后屋睡下。夜里风大，吹得窗纸呜呜响。","你半梦半醒间，听见外面有人压低嗓门说话，像是商量什么“货”。你没在意，翻了个身。"]},go:"acad_home_2"}
]};
N["acad_home_2"]={tag:"main",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你终于回到了交汇城。石板路还是老样子，只是街边的铺面换了几家。老张的面包店还在，王婆的裁缝铺还在，商会仓库还在——只是门口多了两个生面孔的看守，腰间挎着刀。",
"老张看见你，先是一愣，然后咧开嘴笑了：“学生郎回来了？长高了，也壮了！”他给你塞了两个刚出炉的面包，“路上吃。你娘前些天还念叨你呢。”",
"你坐在老张店里，咬了一口面包——还是那个味道。热乎乎的，带一点炭火的焦香。你忽然觉得，这一路的风尘，都值了。"
],options:[
{t:"先回家看爹娘",effects:{xp:8,flag:"acad_home_visited"},tier:{ok:["你推开家门。母亲正在灶台前忙活，听见动静回头，手里的勺子掉在地上：“……儿？”她快步过来，拉着你的手，上上下下看了好几遍，“瘦了。学院的饭，是不是不合口？”","你鼻子一酸，笑着说：“合口。就是没您做的香。”"]},go:"acad_home_3"},
{t:"先去商会，找李管事聊聊木盒的事",check:{a:"CHA",sk:"persu",label:"探访"},tier:{
 ok:["你去了商会。李管事见到你，笑容热情，但你看得出，他眼底比以前多了一层东西。他绝口不提木盒，只寒暄客套。你试探着提了一句，他的笑容顿了一下：“那个木盒啊……早处理了。陈年旧事，不提也罢。”","他岔开话题，但你知道，木盒的事，没那么简单。"],
 fail:["李管事正在忙，只跟你打了个照面：“回来了？好好歇歇。回头我请你吃饭。”他没给你说话的机会。"],
 crit:["你提起木盒时，李管事的神色变了一瞬——极快，但还是被你捕捉到了。他话声放轻：“那木盒，我打开看了。里面是一张字条，写着七个字：‘第七哨，等你来点火。’”他盯着你，“这七个字，跟你有关吗？”","你心里一震。"]
},effects:{xp:18},onCrit:{flag:"acad_li_seven_words"},go:"acad_home_3"},
{t:"先去老张店里坐坐，听他聊街坊的旧事",effects:{xp:8},tier:{ok:["老张一边揉面一边跟你聊：谁家娶了媳妇，谁家添了丁，谁家儿子也去当兵了。说到李管事时，他压低嗓门：“那人这两年，发了财，也变了个人。以前抠门，现在大手大脚——可他那眼神，冷得很，像换了个人。”","你默默记住了这句话。"]},go:"acad_home_3"}
]};
N["acad_home_3"]={tag:"main",place:"自由城邦 · 交汇城 · 家中",pace:"normal",text:[
"晚饭是母亲做的。一桌子菜，都是你爱吃的：腊肉炒蕨菜、炖萝卜、一碗热腾腾的米粥。父亲坐在桌边，没怎么说话，只不停地给你夹菜。",
"饭吃到一半，父亲忽然开口：“你学的东西，能护住自己不？”你点头。他沉默了一会儿：“能护住自己就行。别学那些——”他顿了顿，“别学那些为了别人的事，把自己的命搭进去的。”",
"母亲瞪了他一眼：“说这些做什么。孩子好好的，你净说丧气话。”父亲不吭声了，低头扒饭。你看着他们，忽然觉得，这顿饭比学院里任何一顿都香。"
],options:[
{t:"告诉父亲：你学的东西，够用",effects:{xp:8,relation:{npc:"acad_family",v:10}},tier:{ok:["你放下碗，认真地说：“爹，我学的东西，够护住自己，也够护住家。”父亲看了你很久，点了点头，没再说话。","但那晚，他睡得很早。你听见他在屋里，轻轻哼了一段年轻时的调子。"]},go:"acad_home_4"},
{t:"多陪母亲住两天",effects:{xp:8},tier:{ok:["你在家住了三天。母亲每天都变着花样给你做吃的，又絮絮叨叨地问学院的事。","走的那天清晨，她站在门口，把一包干粮塞进你手里：“路上吃。别饿着。”你走出很远，回头，她还站在门口。"]},go:"acad_home_4"},
{t:"问母亲：村里最近有没有怪事",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["母亲想了想：“怪事倒有一桩——村口的老槐树，去年冬天枯了半边。开春，又活了，但活的那半边，叶子是青黑色的，跟另一边不一样。”她把声音压到极低，“村里有人说，是‘不干净的东西’路过。”"],
 fail:["母亲摇摇头：“哪有什么怪事。就是你爹，最近老咳嗽，劝他去镇上看大夫，他不肯。”"],
 crit:["母亲压着嗓子：“还有一件事——上个月，有个人来村里，挨家挨户问‘谁家孩子戴铜铃’。问到咱家，你爹说没有，把他打发走了。”她看着你，“儿，你那个铃铛，是不是惹了什么事？”"]
},effects:{xp:15},onCrit:{flag:"acad_home_searcher"},go:"acad_home_4"}
]};
N["acad_home_4"]={tag:"main",place:"自由城邦 · 官道",pace:"normal",text:[
"假期结束，你启程回学院。母亲送了一程又一程，最后在镇口停住：“就送到这儿吧。你路上小心。”她从怀里摸出一个布包，“这是给你做的鞋，两双。一双薄的，一双厚的。北境冷，换着穿。”",
"你接过布包，沉甸甸的。你张了张嘴，想说点什么，最后只说了句：“娘，我走了。”她点头，站在原地，一直看着你走远。",
"走出很远，你回头——她还站在镇口，像一棵老树。风把她的衣角吹起来，又放下。你转回头，加快脚步，没再回头。"
],options:[
{t:"把布包收好，一路没打开",effects:{xp:8},tier:{ok:["你一路没打开那个布包，像揣着一个承诺。","回到学院那天夜里，你才拆开——两双鞋，针脚细密，鞋底纳得厚实。你试了试，正好合脚。"]},go:"acad_outside_hub"},
{t:"路上穿一双，另一双收好",effects:{xp:5},tier:{ok:["你穿上一双，另一双收进行囊。新鞋有点硬，走了一天，磨出几个水泡。","但你知道，等它软了，就是最合脚的鞋。"]},go:"acad_outside_hub"}
]};
N["acad_home_5"]={tag:"main",place:"学院至铁门关 · 官道",pace:"normal",text:[
"你决定去一趟铁门关——替老屠户，给他儿子烧张纸。这是你答应过的事。",
"往北的路，越走越荒凉。官道两旁，是烧焦的村庄和无人收割的麦田。偶尔遇见一队逃难的人，他们看见你穿着学院的袍子，眼神里没有敬意，只有戒备——像是怕你也是来“募粮”的。",
"第三天黄昏，你终于看见了铁门关的轮廓。城墙比想象中高，黑石砌成，在暮色里像一头蹲伏的巨兽。城墙上的烽火台，一字排开——十三座，只有一座，透出一点灯火。"
],options:[
{t:"进城，先找第三哨的位置",check:{a:"AGI",sk:"stealth",label:"探路"},tier:{
 ok:["你混在进城的人群里进了关城。第三哨在城墙东段，一处凹进去的箭楼。你找到时，天已经黑了。箭楼里没人，只有一扇虚掩的门，门缝里透出一点煤油灯的暖光。"],
 fail:["关城盘查很严。你报了学院的名头，守军打量你半天，才放你进去。你在城里转了一圈，没找到第三哨，天就黑了。"],
 crit:["你不仅找到了第三哨，还注意到箭楼外墙上有几道新鲜的划痕——像是有人用指甲抠的。你伸手比了比，划痕的深度，不是人手能抠出来的。"]
},effects:{xp:18},onCrit:{flag:"acad_third_scratches"},go:"acad_home_6"},
{t:"先在城墙根下站一会儿",effects:{xp:8},tier:{ok:["你站在城墙根下，看着那些黑石。石面上刻着密密麻麻的名字——都是守城战死的人。你在其中一列名字里，找到了“石蛋”两个字。","你蹲下来，把那两个字的笔画，用手指轻轻描了一遍。"]},go:"acad_home_6"},
{t:"找老兵打听第三哨的事",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["城墙根下蹲着几个晒太阳的老兵。你递了壶酒，他们就打开了话匣子：“第三哨？那是全军最邪性的哨位。三年前那一夜，第三哨的兵，一个没剩。”他们话声放轻，“据说，那晚有人看见，哨台上站着一个人——不是他们的人。”"],
 fail:["老兵们戒备地看了你一眼：“打听第三哨做什么？你是学院的？学院的人，少管关城的闲事。”"],
 crit:["一个断臂老兵看了你很久：“你腰间那个铃铛……我认得。”他压低嗓门，“第三哨的老班长，也有一个。他死之前，把那铃铛托我转交——‘交给下一个来第三哨的人。’”他顿了顿，“那铃铛，我埋在了箭楼地基底下。你晚上，自己去取。”"]
},effects:{xp:18},onCrit:{flag:"acad_third_bell"},go:"acad_home_6"}
]};
N["acad_home_6"]={tag:"main",place:"铁门关 · 第三哨箭楼",pace:"normal",text:[
"夜深了。你一个人站在第三哨的箭楼上。城墙外，是无边的黑——北边的旷野，连星光都看不见。",
"你从怀里摸出那张黄纸，上面写着“石蛋”的名字。你点燃它，火苗在夜风里晃了晃，很快烧成灰烬，被风卷走。你说：“老屠户托我带的话——你爹，等你回家吃饭。”",
"灰烬飘散后，箭楼里忽然静下来。你听见墙根地下，有一阵极轻的动静——像有人在地下，翻了个身。"
],options:[
{t:"蹲下，仔细听那动静",check:{a:"AGI",sk:"detect",label:"探查"},tier:{
 ok:["你蹲下来，贴着地面听。那动静时断时续，像水流，又像呼吸。你循着声音，在箭楼角落的地基处，摸到一块松动的青砖——砖后是一个拳头大的洞，洞里塞着一个布包。"],
 fail:["你听了一会儿，那动静就消失了。你直起身，箭楼里一片死寂。"],
 crit:["你不仅找到了布包，还发现布包底下压着一块铁牌——和你那两块，形制完全一致。第三块。你摸出来，月光下，铁牌背面刻着一行字：“第七哨 · 永夜 · 点火者，不死。”","三块铁牌，凑成了一面完整的三联牌。"]
},effects:{xp:20},onCrit:{flag:"acad_token_third_2"},go:"acad_home_7"},
{t:"在箭楼里坐一夜",effects:{xp:8},tier:{ok:["你在箭楼里坐着，看着城墙外的黑夜。北风灌进来，带着铁锈与硝烟的气味。","天亮前，你终于明白老屠户说的“北境的雪年年化，人呢”是什么意思。"]},go:"acad_home_7"},
{t:"天亮前离开箭楼",effects:{xp:5},tier:{ok:["你在第一缕晨光前离开了箭楼。下山时，你回头看了一眼——第三哨的烽火台，在晨光里黑黢黢的，像一只闭着的眼睛。","你心里默默说了句：“石蛋，我来看过你了。”"]},go:"acad_home_7"}
]};
N["acad_home_7"]={tag:"main",place:"铁门关 · 城墙",pace:"normal",text:[
"白天，你沿着城墙走了一整圈。铁门关的城墙分两层：外层是新砌的青石，里层是旧的黑石。你在图书馆读到过，里层黑石与学院灰楼同材。",
"你站在一段里层城墙前，伸手摸那些黑石。石面冰凉，纹路粗糙。你忽然发现，某块黑石的缝隙里，嵌着一枚极小的铜钉——像是被人刻意敲进去的。",
"你用指甲抠了抠，铜钉松动，掉出来一张卷成细条的纸。展开，上面只有一行字，字迹工整：“第七节点的锚，在北边。别走官道。”"
],options:[
{t:"把纸条收好",effects:{xp:12,flag:"acad_wall_note"},tier:{ok:["你把纸条仔细卷好，收进贴身衣袋。“别走官道”——这五个字，你记下了。","你回头看了一眼那堵黑石墙。它像一堵沉默的门，门后藏着什么，只有它知道。"]},go:"acad_home_8"},
{t:"再抠一抠旁边的黑石",check:{a:"AGI",sk:"detect",label:"探查"},tier:{
 ok:["你又在附近抠了几块黑石，发现其中一块的缝隙里有干涸的蜡迹——像是有人在这里点过蜡烛。蜡迹旁边，有一道很浅的刻痕，是三个字：“点火者。”"],
 fail:["你抠了半天，一无所获。黑石墙密实得像一整块铁。"],
 crit:["你发现那块铜钉的位置，恰好对着城墙外一个特定的方向。你目测了一下，那个方向，正对着北边永冻荒原的深处。","“第七节点的锚，在北边。”——纸条上的话，和这个方向，对上了。"]
},effects:{xp:15},onCrit:{flag:"acad_wall_direction"},go:"acad_home_8"},
{t:"在城墙根坐一会儿，然后离开",effects:{xp:5},tier:{ok:["你在城墙根下坐了一会儿，看着往来的人群。守军、商贩、难民、乞丐——每个人都在过自己的日子。","你起身，拍了拍袍子上的灰。该回学院了。"]},go:"acad_home_8"}
]};
N["acad_home_8"]={tag:"main",place:"铁门关至学院 · 官道",pace:"normal",text:[
"回程的官道上，你一直在想那张纸条上的话：“第七节点的锚，在北边。别走官道。”",
"你选择走小路。小路沿着一条冻河蜿蜒，河面结了厚厚的冰，踩上去咯吱作响。走了半天，你在一处河湾停下来喝水，忽然发现河对岸的雪地上，有一串脚印——不是人的，也不是动物的。",
"那脚印像是某种巨大的、拖着身体的东西留下的，在雪地上拖出一道深沟，延伸向北方。你蹲下来看了很久，脚印的边缘，结着一层青黑色的霜。"
],options:[
{t:"跟着脚印走一段",check:{a:"AGI",sk:"stealth",label:"追踪"},tier:{
 ok:["你跟了三里路，脚印在一处断崖前消失了。崖壁上有一个洞口，黑黢黢的，深不见底。洞口的岩石边缘，也被磨得发亮——像有什么东西，经常从这里进出。"],
 fail:["你跟了一段，脚印消失在冻河岸边。你蹲下来看，发现脚印的方向，在河面上折了个弯，朝上游去了。你犹豫了一下，没有追。"],
 crit:["你在洞口旁边，发现一块刻着符文的石头——是你认得的古沙漠文，大意是“勿入”。旁边还有一行更小的字，字迹不同：“第七节点，若未备灯，勿进。”","你记下了这个洞口的位置。"]
},effects:{xp:18},onCrit:{flag:"acad_cave_found"},go:"acad_home_9"},
{t:"不追了，记下位置",effects:{xp:8},tier:{ok:["你记下了脚印的方向和位置，没有冒进。","有些东西，知道了就好，不一定要当场看个明白。"]},go:"acad_home_9"},
{t:"加快脚步回学院",effects:{xp:5},tier:{ok:["你加快脚步，赶在天黑前回到了学院山门。","进门时，守门兽人门房看了你一眼：“你身上，带了北边的味道。”你没接话，径直走回宿舍。"]},go:"acad_outside_hub"}
]};
N["acad_home_9"]={tag:"main",place:"学院后山 · 旧马厩",pace:"normal",text:[
"赵老兵提过的“后山旧马厩”，在学院围墙外的一处山坳里，废弃多年，屋顶塌了一半。你摸黑过去时，果然看见里面有火光——有人。",
"你蹲在矮墙后面，看见两个人在马厩里点着一盏油灯，正往一匹骡子背上装货。货物用麻袋裹着，看不清是什么。一个说：“这批货，走学院的地道，明晚交货。”另一个说：“上头说了，别让学院的人发现。”",
"你认出其中一个——是白桦镇市集上，那个卖军用物资的独眼汉子。"
],options:[
{t:"蹲着听他们说话",check:{a:"AGI",sk:"stealth",label:"潜伏"},tier:{
 ok:["你蹲了一刻钟，听他们聊了“货的来路”“地道的入口”“下家的名字”。独眼汉子最后说了句：“这批‘灰货’，上头要得急。铁门关那边，快撑不住了。”","你记住了“灰货”和“地道入口”两个词。"],
 fail:["你蹲了一会儿，骡子忽然打了个响鼻，惊动了他们。独眼汉子朝你这边看了一眼，你赶紧缩回矮墙后。他们很快收拾东西走了。"],
 crit:["你不仅听完了，还看清了他们把货藏进马厩角落的枯草堆底下。等他们走后，你摸过去，扒开枯草——露出一个铁皮箱子，锁着。你记下了箱子的位置。"]
},effects:{xp:18},onCrit:{flag:"acad_stable_spot"},go:"acad_home_10"},
{t:"退回去，不动声色",effects:{xp:8},tier:{ok:["你悄声退回去，没有惊动他们。","回到宿舍，你把这个发现记在日记里。学院的地道——这是个重要的线索。"]},go:"acad_home_10"},
{t:"直接上前盘问",check:{a:"CHA",sk:"persu",label:"盘问"},tier:{
 ok:["你站出来，亮出学院的身份。独眼汉子愣了一下，随即堆起笑：“学生爷，误会误会！我们就是借个地方歇脚。”他一边说，一边给同伴使眼色。你没能问出实质的，但他们第二天就换了地方。"],
 fail:["你刚站出来，独眼汉子手就按上了腰间的刀：“学生？管闲事的？”你后退一步，他们趁机收拾东西走了。"],
 crit:["你盘问得紧，独眼汉子被问得急了，漏了一句：“是‘守夜人’订的货！灰楼那边要的！”他话一出口就后悔了，转身就跑。","“灰楼要的货”——你站在原地，咀嚼着这句话。"]
},effects:{xp:18},onCrit:{flag:"acad_gray_cargo"},go:"acad_home_10"}
]};
N["acad_home_10"]={tag:"main",place:"学院后山 · 旧地道口",pace:"normal",text:[
"你循着独眼汉子的话，在后山一处荒草丛里，找到了那个地道口。石板盖着，边缘被磨得光滑——显然经常有人进出。",
"你掀开石板，一股潮湿的霉味涌上来。石阶向下，黑洞洞的。你摸出火折子，吹亮，顺着石阶走下去。",
"地道不长，走了几十步就到头了。尽头是一扇铁门，门上挂着一把铜锁。你蹲下来看锁——锁孔周围的铜面上，刻着一行极小的字：“第七哨 · 留灯处。”"
],options:[
{t:"试着开锁",check:{a:"AGI",sk:"stealth",label:"撬锁"},tier:{
 ok:["你从行囊里摸出两根铁针，鼓捣了一刻钟，锁芯咔哒一声开了。推门进去——里面是个石室，靠墙摆着几口木箱，箱盖上落着灰。你打开一口，里面是旧军服和铁牌，样式跟铁门关守军的一模一样。"],
 fail:["锁芯太老，你弄了半天没打开，反而把铁针别断了一根。你只好把石板盖回去，记下位置，先离开。"],
 crit:["锁开了。石室里除了旧军服，墙上还钉着一幅地图——北境全图，上面用红笔画着一条线，从学院出发，经铁门关，一路指向北边永冻荒原深处。线的尽头，画着一个圈，标注着三个字：“第七节点。”"]
},effects:{xp:20},onCrit:{flag:"acad_stone_map"},go:"acad_home_11"},
{t:"不动这扇门，先退出去",effects:{xp:8},tier:{ok:["你看了那行字，没有开门，原路退回，把石板盖好。","“第七哨 · 留灯处”——这六个字，你记在了心里。"]},go:"acad_home_11"},
{t:"记下位置，回去问赵老兵",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["赵老兵听完你的描述，沉默了很久：“那个地道，是老院长在时修的。他说是‘紧急时候用的’。”他顿了顿，“你看到的那些旧军服——是老院长的旧部留下的。他们是‘守夜人’。”","“守夜人”三个字，从他嘴里说出来，像石头落进水里。"]
},effects:{xp:15},onCrit:{flag:"acad_luo_confirms"},go:"acad_home_11"}
]};
N["acad_home_11"]={tag:"main",place:"学院后山 · 山道",pace:"normal",text:[
"从后山回来，你在山道上遇见一个意想不到的人——费尔曼教授。他站在一棵老松树下，像是在等你。",
"他看见你，没有寒暄，开门见山：“你去了后山的地道。”他语气平静，像在陈述一个事实。",
"你没否认。他沉默了一会儿：“那个地道，是老院长修的。里面那幅地图，是我画的。”他顿了顿，“第七节点的位置，是守夜人一脉用命换来的。你要看，可以看——但看了，就要担责任。”"
],options:[
{t:"问他：第七节点到底是什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["费尔曼看着北边的方向：“第七节点，是一道门。”他顿了顿，“门后是深渊。一千年前，先贤把门钉住了——用七根锚。第七根锚，钉在永冻荒原上，由‘点火者’看守。”他看向你，“现在，第七根锚松了。点火者，也断了代。”"],
 fail:["费尔曼摇了摇头：“现在说这些，太早。等你毕业，等你准备好了，再来找我。”"],
 crit:["费尔曼沉默了很久：“我一直在找一个愿意接替‘点火者’的人。”他看着你，“你问我等谁——我等的，是一个愿意走到第七节点，把火重新点起来的人。”","他顿了顿，“那个人，会是你吗？”"]
},effects:{xp:20},onCrit:{flag:"acad_ferman_question"},go:"acad_home_12"},
{t:"把铁牌拿出来给他看",effects:{xp:15,flag:"acad_tokens_shown"},tier:{ok:["你把三块铁牌拼在一起，递给费尔曼。他接过去，指腹摩挲着那行字：“‘第七哨 · 永夜 · 点火者，不死。’”他抬头看你，眼神复杂，“三块令牌，凑齐了。”他顿了顿，“我本来以为，要等你毕业。”","他把铁牌还给你：“收好。它会带你去该去的地方。”"]},go:"acad_home_12"},
{t:"沉默，不回答",effects:{xp:5},tier:{ok:["你沉默着，没有回答。费尔曼也不逼你：“不急。你还有时间想。”他转身走了，走出几步，又停下：“记住——点火的人，不该迟到。”"]},go:"acad_home_12"}
]};
N["acad_home_12"]={tag:"main",place:"学院后山 · 山道",pace:"normal",text:[
"费尔曼走了之后，你在山道上站了很久。北风吹着松林，呜呜作响。",
"你怀里那三块铁牌，像三块烧红的炭，隔着衣料，烫着你的胸口。“点火者”——这个称号，从费尔曼、老屠户、罗先生、精灵女子、老妇人口中，一次次出现。它像一条河，从四十年前，一直流到你脚下。",
"你抬头看北边。暮色里，什么也看不清。但你知道，那个方向，有一道门，一根锚，一盏等着被点亮的灯。",
"你把手伸进怀里，握住那三块铁牌。指尖冰凉，但你心里有一团火，烧起来了。"
],options:[
{t:"回宿舍，把今天的发现整理成笔记",effects:{xp:10,flag:"acad_home_notes"},tier:{ok:["你回到宿舍，就着油灯，把今天的事一条条写进笔记：地道、地图、第七节点、点火者。写到一半，你抬头，看见窗外灰楼三层的灯，还亮着。","你吹熄了自己的灯，在黑暗里坐了一会儿。"]},go:"acad_outside_hub"},
{t:"去找凯恩和阿塔，把话说开",effects:{xp:10,relation:{npc:"acad_kain",v:8},relation2:{npc:"acad_ata",v:8}},tier:{ok:["你找到凯恩和阿塔，把铁牌的事、第七节点的事，原原本本说了。凯恩听完，沉默了一会儿：“你要去？”你点头。他说：“那我跟你去。”阿塔跟着点头：“草原上的人，说好了就是一辈子。”","你们三人在夜里击了掌。"]},go:"acad_outside_hub"},
{t:"把铁牌和笔记收好，先睡",effects:{hp:10},tier:{ok:["你把铁牌和笔记收进箱底，躺下。窗外风声呜呜，像有什么在远方呼唤。","你翻了个身，很快睡着了。梦里有光，很远，但亮着。"]},go:"acad_outside_hub"}
]};
/* ---------- 贸易链（4） ---------- */
N["acad_trade_1"]={tag:"main",place:"艾尔达魔法学院 · 山门告示栏",pace:"normal",text:[
"告示栏上新贴了一张“学院委托”告示，盖着教务处的章：“本学院长期收购：古符文拓片、旧档残卷、北境矿石标本。价格面议，量多从优。有意者至后勤处登记。”",
"你正看着，一个后勤处的执事凑过来，把声音压到极低：“学生，你识符文？教务处那边，收了一批旧档，里面的字没人认得，正愁着呢。你要是能认出一两页，报酬好说。”",
"他顿了顿：“是灰楼搬出来的旧档。上头交代，尽快整理。”"
],options:[
{t:"接下整理旧档的活",check:{a:"INT",sk:"lore",label:"认字"},tier:{
 ok:["你接下了活。旧档确实是灰楼搬出来的——大多是符文、地图、名录。你花了一晚上，认出了三页：一份铁门关守军名册、一份“第七哨”的哨位图、一份写了一半的调令。","执事看了你的成果，很满意，付了钱，又加了一句：“下批旧档到了，还找你。”"],
 fail:["你认了两页，有一半字拿不准。执事倒不苛求：“能认多少算多少。这年头，识字的人越来越少了。”"],
 crit:["你不仅认出了全部旧档，还发现其中一页的夹层里，藏着一张羊皮纸——上面画着永冻荒原的地形图，标注着“第七节点”的位置，还有一行小字：“若见此图，交与点火者。”","你默默把羊皮纸收了起来，没声张。"],
 critfail:["你认错了一页关键符文，把“勿入”认成了“可入”。执事没发现，但你心里直打鼓。好在那页旧档没有实际用处，否则要出大事。"]
},effects:{xp:18,gold:8},onCrit:{flag:"acad_trade_parchment"},go:"acad_trade_2"},
{t:"问执事：旧档里有没有关于‘第七节点’的",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["执事四下看了看，压着嗓子：“有。灰楼搬出来的旧档，有一摞专门封着，盖着‘守夜人’的印。教务处说了，那摞不许动。”他顿了顿，“我偷偷瞄过一眼——里面全是人名和日期，像一本账。”"],
 fail:["执事摆摆手：“那是封着的，我碰都不敢碰。”"],
 crit:["执事犹豫了一下，从袖子里摸出一张纸条：“这是我抄的一份名录——是那摞封档里掉出来的，我趁人不注意抄的。”纸条上列着七个名字，第一个是“老院长”，第二个你认得：“三年前离职的古代史教授。”","纸条最下面，用铅笔写着：“第七节点，点火者待续。”"]
},effects:{xp:15},onCrit:{flag:"acad_trade_roster"},go:"acad_trade_2"},
{t:"不接活，走人",effects:{xp:3},tier:{ok:["你摇摇头，没接这个活。","灰楼的东西，沾上了，未必是好事。"]},go:"acad_outside_hub"}
]};
N["acad_trade_2"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"你在市集上逛了一圈，发现战争带来的商机：药草、绷带、铁器，价格一路涨。北边来的商贩，什么都要，什么价都敢开。",
"一个收购药材的商人拉住你：“学生郎，你们学院药圃的草药，能匀我一些不？价格好说，现银结。”他指了指身后的货架，“铁门关那边，药比金子还贵。”",
"你想起学院药圃里，确实种着一批上好的止血草——由特蕾莎嬷嬷管着，晒干了存着，每年都剩不少。"
],options:[
{t:"去药圃，找特蕾莎嬷嬷商量",check:{a:"CHA",sk:"persu",label:"商量"},tier:{
 ok:["特蕾莎嬷嬷听完，沉吟了一会儿：“学院的药，向来不外卖。但……”她顿了顿，“若是卖给铁门关的军医，倒也不是不行。”她让你传话：“让那个商人来找我，走教务处的账，别走私账。”","你两头传话，撮合成了这笔生意。特蕾莎嬷嬷分了你一成辛苦钱。"],
 fail:["特蕾莎嬷嬷摇了摇头：“学院的药，有学院的用处。你让那个商人死了这条心吧。”"],
 crit:["特蕾莎嬷嬷不仅同意了，还多问了一句：“那个商人，是替谁收药？”你照实说了。她点点头：“替军医收的，可以。若是替别人——”她看了你一眼，“你替我盯着点。”","你两头跑，不仅赚了钱，还摸清了药材的流向：大部分，确实进了铁门关的军医营。"]
},effects:{xp:15,gold:10},onCrit:{flag:"acad_trade_herbs"},go:"acad_trade_3"},
{t:"不掺和，走开",effects:{xp:3},tier:{ok:["你摇摇头走开了。倒卖学院的药材，听着是笔财路，但踩线的事，你不做。","你走出几步，回头看了一眼——那个商人还在原地吆喝。"]},go:"acad_trade_3"}
]};
N["acad_trade_3"]={tag:"main",place:"艾尔达魔法学院 · 白桦镇市集",pace:"normal",text:[
"你在市集上，又碰见了那个独眼汉子。他这次没摆摊，而是蹲在墙角抽旱烟，看见你，招呼道：“学生郎，又见面了。”",
"他话声放轻：“上回你说的‘灰货’，我回去查了查——来路不干净，是‘上头’压着不让问的。”他吐了口烟，“我劝你也别问。那东西，沾上了，甩不掉。”",
"他说完，把烟杆在鞋底磕了磕，起身走了。走出几步，又回头补了一句：“你要是真想知道，去问问学院灰楼的老管事——他应该清楚。不过，他八成不会说。”"
],options:[
{t:"追问‘灰货’是什么",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["独眼汉子皱了皱眉：“我说不清。只见过一回——黑灰色的粉末，装在大铁箱里，沉得很。碰过的人，手会蜕皮。”他打了个寒颤，“那东西，不像人间的东西。”"],
 fail:["独眼汉子摆摆手：“别问了。再问，我也说不出什么了。”他快步走了。"],
 crit:["独眼汉子压低嗓门：“我多嘴一句——那批‘灰货’，是从北边运来的，走的是学院后山的地道。接头的人，穿着学院的袍子。”他顿了顿，“但我没看清脸。”","“穿学院袍子的人”——你心里一沉。"]
},effects:{xp:15},onCrit:{flag:"acad_graycargo_robe"},go:"acad_trade_4"},
{t:"谢过他，记下这话",effects:{xp:8},tier:{ok:["你谢过他，把“灰货”“学院地道”“穿袍子的人”这几个词，牢牢记住。","这些碎片，迟早会拼成一张完整的图。"]},go:"acad_trade_4"},
{t:"不接话，转身走开",effects:{xp:3},tier:{ok:["你没有接话。独眼汉子也不在意，抽完烟，走了。","你知道，这条线索，断在这里了。"]},go:"acad_outside_hub"}
]};
N["acad_trade_4"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你带着满腹疑团回到图书馆，找到罗先生。他正戴着套袖整理书架，听你说完“灰货”的事，手里的动作停了一下。",
"他沉默了很久，把你拉到书架深处：“‘灰货’这个说法，三十年前有过。”他把声音压到极低，“当时，学院后院也挖出过一批灰黑色的粉末，装在大铁箱里。老院长亲自封的箱，埋进了灰楼地下室。”",
"他看着你：“那批东西，跟三十年前铁门关的‘民变’有关。老院长说，那是‘封印烧剩下的灰’。”他顿了顿，“你问这个做什么？那不是学生该碰的东西。”"
],options:[
{t:"追问：那批灰现在还在灰楼地下室吗",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
 ok:["罗先生摇摇头：“我不知道。老院长封箱之后，没人再提过。”他顿了顿，“灰楼地下室，钥匙在院长手里。这些年，没人进去过。”"],
 fail:["罗先生警觉地看了你一眼：“你打听这个做什么？收手吧。”"],
 crit:["罗先生沉默了很久：“其实，有一回——十年前——我值夜，看见老院长一个人进了灰楼地下室。出来时，手里抱着一个空铁箱。”他顿了顿，“箱子是空的。里面的东西，被他拿走了。”","他打了个寒颤，“老院长从那天起，身体一天不如一天。第二年，就没了。”"]
},effects:{xp:18},onCrit:{flag:"acad_ash_boxes"},go:"acad_outside_hub"},
{t:"不再追问，谢过罗先生",effects:{xp:8},tier:{ok:["你谢过罗先生，没有追问下去。","“封印烧剩下的灰”——这几个字，像一根刺，扎在你心里。"]},go:"acad_outside_hub"},
{t:"把灰货的事记进笔记",effects:{xp:10,flag:"acad_gray_notes"},tier:{ok:["你回到宿舍，把“灰货”“封印烧剩下的灰”“老院长搬空铁箱”这几条，写进笔记。","写完，你合上本子。窗外，灰楼的灯还亮着。"]},go:"acad_outside_hub"}
]};
})();

/* /u1inj:data-nodes:dn_acad_people.js/ */
/* ============================================================
 * B-3 学院人际网：同学 8 人（凯恩/艾莉丝/洛卡/阿塔已有 + 塞西莉娅/灰须·莫里/伊莲娜/老铁 4 新人）
 * 入口：acad_people_hub（从 acad_life_y1_open 挂入）
 * 每人支线：相识 → 共事 → 考验 → 结局（≥4 节点闭环，changeRelation 好感）
 * 里程碑：60 挚友 / 80 恋人 / -60 死敌（changeRelation 自动触发）
 * 铁律：saveVersion=48 不变；独立键；V66 文风；蓝图+账本
 * ============================================================ */
(function(){
/* ---------- 人际网中枢 ---------- */
N["acad_people_hub"]={tag:"main",place:"艾尔达魔法学院 · 生活区",pace:"normal",text:[
"学院的生活区，是人际的集市。傍晚的钟声响过之后，走廊里全是端着餐盘、夹着书的学生。灶房的烟囱冒着白汽，风一吹，饭菜的香气顺着回廊钻过来。",
"公告栏前围着一圈人，看的是下周的演武对抗赛名单；长椅上有人对着谱子练竖琴，断断续续；窗口的勤工生一边记账一边喊：“三号桌的汤凉了，谁来端走！”",
"你在这五年里，认识了不少人——有的人成了朋友，有的人成了过客，有的人，成了你将来某段故事里的名字。",
"你端着热茶站在生活区中央，想着今天该去找谁。走廊那头，塞西莉娅正抱着档案快步走过；工坊方向传来莫里敲铁的声响；礼拜堂的窗里，透出伊莲娜点灯的光。"
],options:[
{t:"去找塞西莉娅（东境贵族·政务系）",req:function(){return true;},go:"acad_cecy_1"},
{t:"去找灰须·莫里（矮人符文匠）",req:function(){return true;},go:"acad_mori_1"},
{t:"去找伊莲娜（精灵治愈师）",req:function(){return true;},go:"acad_elena_1"},
{t:"去找老铁（战争系工坊学徒）",req:function(){return true;},go:"acad_tie_1"},
{t:"去找凯恩（战争系·老友）",req:function(){return S.npcRelations&&S.npcRelations["kain"]>=30;},go:"acad_kain_end"},
{t:"去找艾莉丝（火系·老友）",req:function(){return S.npcRelations&&S.npcRelations["alice"]>=30;},go:"acad_alice_end"},
{t:"去找洛卡（药剂系·老友）",req:function(){return S.npcRelations&&S.npcRelations["loca"]>=30;},go:"acad_loca_end"},
{t:"去找阿塔（草原·老友）",req:function(){return S.npcRelations&&S.npcRelations["ata"]>=30;},go:"acad_ata_end"},
{t:"去找导师们请教（导师区）",go:"acad_mentor_hub"},
{t:"去禁书区外转转（暗线）",req:function(){return S.day>=60;},go:"acad_forbidden_1"},
{t:"深入学院生活（人际/修行/学院见闻）",go:"acad_social_hub"},
{t:"回宿舍歇着",go:"acad_life_y1_dorm"}
]};
/* ---------- 塞西莉娅（东境贵族） ---------- */
N["acad_cecy_1"]={tag:"branch",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你在图书馆最安静的角落，撞见一个抱着整摞档案的少女。她没注意你，侧身时档案塌了一半，散了一地。",
"她叹了口气，蹲下来一张张捡：“……又来了。”",
"她抬头看见你，礼貌地点头：“塞西莉娅·德·莱茵，政务系。抱歉，挡着你的路了。”",
"你帮她捡起最底下那张——是一份《东境承天城民政岁报》。她看见你的目光，轻声说：“我父亲让我‘读点有用的’。”她顿了顿，“但我想读的，是为什么承天城的水会变浑。”"
],options:[
{t:"和她聊聊承天城的水",check:{a:"INT",sk:"lore",label:"交谈"},tier:{
 ok:["塞西莉娅眼睛亮了：“你也关心这个？”她压低声音，“我查过旧档——承天城的水，五十年前就浑过一回。那一年，晨天城……”她忽然收住话头，摇摇头，“算了，这些不该在图书馆说。”","她朝你露出一个真切的笑，这是你们友谊的开始。"],
 fail:["塞西莉娅礼貌地笑了笑：“多谢。”她抱着档案走了。你看着她的背影，觉得她肩上压着什么东西。"],
 crit:["你不但接上了她的话，还点出了关键：“晨天城覆灭前，井水也是先浑的。”塞西莉娅怔住，看了你很久：“……你从哪儿知道的？”","“那是我家祖辈的旧档里写的。我找了三年，没找到第二个知道这件事的人。”她的声音有些发颤。","你把从东境出发时听来的传闻，原原本本告诉了她。"]
},effects:{xp:10},run:function(){changeRelation('cecy',15,'承天城水变浑之谈');},onCrit:{flag:"acad_cecy_secret"},go:"acad_cecy_2"}
]};
N["acad_cecy_2"]={tag:"main",place:"艾尔达魔法学院 · 政务系教室",pace:"normal",text:[
"塞西莉娅组织了一场学院内部的“南北风物展”——名义上是联谊，实际上她想借机收集各地方言和传闻。",
"她拉你帮忙登记。半天下来，你们记了厚厚一摞：北境的狼、南方的盐、草原的狼旗、沙漠的驼队、东境的官道……",
"傍晚收摊，她请你喝了杯热茶：“谢谢你。这些东西，够我整理一个月了。”",
"“我父亲一直想让我回去嫁人。”她忽然说，“他说，政务不是小姐该学的东西。”她看着那摞登记册，“可我想知道，这片大陆到底为什么乱成一团。”"
],options:[
{t:"支持她：政务是救人的学问",check:{a:"CHA",sk:"persu",label:"支持"},tier:{
 ok:["塞西莉娅眼眶微红，很快又压下去：“谢谢你。五年了，你是第一个说这句话的人。”她认真看着你，“如果有一天我主持东境的政务……我会记得今天。”"],
 fail:["塞西莉娅笑了笑：“谢了。”她没再说下去，但你看得出，这句话她记住了。"],
 crit:["塞西莉娅沉默很久，忽然说：“你知道吗，政务系里，只有我一个东境贵族。”她苦笑，“他们都说，东境人只配当兵和种地。”","“但如果有一天，东境需要一个会算账、会看水、会读旧档的人——我希望那是我。”","你伸出手，和她碰了碰杯。"]
},effects:{xp:10},run:function(){changeRelation('cecy',15,'南北风物展的支持');},go:"acad_cecy_3"}
]};
N["acad_cecy_3"]={tag:"main",place:"艾尔达魔法学院 · 西厅",pace:"normal",text:[
"第三学年末，塞西莉娅收到一封家书。送信的是东境的驿差，马跑了七天七夜，信纸边角被汗浸得发软。",
"她读完信，一整天没说话。那天政务系的课她没去上，一个人在图书馆的角落里坐着，面前摊着一本摊开却没翻页的《东境民政要略》。",
"第二天，她来找你，把信递给你看。信纸上的字是承天城官署的公文体，端正，冷硬：“政务非女子之事。归家。三月后与商盟盟主长子完婚。”",
"末尾落着族印，还盖着商盟的骑缝章——两家的亲事，连盟约都拟好了。",
"她问你：“我该怎么办？”",
"她的手指攥着信纸，指节发白，纸边被捏出一道深痕。窗外的北风灌进来，她把信纸又往手心里攥紧了一些。"
],options:[
{t:"支持她抗婚，留在学院",check:{a:"CHA",sk:"persu",label:"支持"},tier:{
 ok:["塞西莉娅的眼泪终于落下来，又飞快擦掉：“好。我不回去。”她烧了那封信，“我写信回东境：我在学院有事要做。”","“谢谢你。”她说，“你不是第一个劝我留下的。但你是第一个，让我觉得留下是对的。”"],
 fail:["塞西莉娅沉默很久：“我……想想吧。”她没烧那封信。几天后，她告诉你，她回信拒绝了婚事，但没提退学。"],
 crit:["塞西莉娅盯着你：“如果我留下，东境会和我断绝关系。我没有钱了，没有地位了——你还会把我当朋友吗？”","你说会。她笑了，眼泪却掉下来：“那我留下。”","那天夜里，你们在东回廊坐到很晚。她说：“东境欠我的，我自己去讨回来。”"]
},effects:{xp:12},run:function(){changeRelation('cecy',25,'抗婚之夜的抉择');},onCrit:{flag:"acad_cecy_stay"},go:"acad_cecy_4"}
]};
N["acad_cecy_4"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，塞西莉娅拿到了政务系第一名的成绩。",
"院长问她去向。她说：“回东境。承天城的水，该有人管了。”",
"她走之前，把一本厚厚的笔记交给你：“这是我五年整理的《东境民政要略》。如果我出了什么事……”她顿了顿，“你替我看完。”",
"你们在学院门口告别。她上马车前，回头看了你一眼：“东境见。”",
"多年后，你听说承天城的井水，在某个春天开始变清。有人说，是因为换了个懂水的城主。"
],options:[
{t:"目送她离开，把笔记收好",effects:{xp:20},run:function(){changeRelation('cecy',20,'毕业赠别');},tier:{ok:["你收好那本笔记。东境，多了一个该记住的名字。"]},go:"acad_people_hub"}
]};
/* ---------- 灰须·莫里（矮人符文匠） ---------- */
N["acad_mori_1"]={tag:"branch",place:"艾尔达魔法学院 · 符文工坊",pace:"normal",text:[
"符文工坊里叮当作响。一个矮人少年正抡着锤子，敲打一块发红的铁板。他头也不回：“要修东西放下，要聊天等会儿。”",
"你等了半盏茶。他放下锤子，抹了把汗，这才看你：“灰须·莫里，符文系。你叫啥？”",
"他打量你：“北境口音？铁门关那边的？”他咧开嘴，“巧了，我家在矮人王国北矿——跟你那边隔着一道铁门。我爹说，那道铁门上刻着七道封印。”"
],options:[
{t:"问他七道封印的事",check:{a:"INT",sk:"lore",label:"交谈"},tier:{
 ok:["莫里的眼睛一亮：“你也知道？”他压低声音，“我爹说，铁门上七道封印，是矮人先祖封的——封的是地底的东西。”他顿了顿，“这几年，封印松了一道的消息，在矿里传开了。”","你想起出发时听过的那些传闻，心里咯噔一下。"],
 fail:["莫里挠挠头：“算了，都是矿里的老话。来，给你看我打的这口剑坯。”","他手艺不错。"],
 crit:["莫里放下锤子，认真说：“我爹说，铁门第七道封印上，刻着一只竖瞳——和你说的那些传闻对得上。”他盯着你，“你见过那个图案？”","你没直接回答。但他显然看懂了你的沉默。"]
},effects:{xp:10},run:function(){changeRelation('mori',15,'铁门封印之谈');},onCrit:{flag:"acad_mori_seal"},go:"acad_mori_2"}
]};
N["acad_mori_2"]={tag:"main",place:"艾尔达魔法学院 · 符文工坊",pace:"normal",text:[
"学院大门的符文锁年久失修，管事愁了半个月。莫里自告奋勇：“我试试。”",
"他带着你，把门楣上那串符文一个个拓下来、校对、重刻。干了三天，门锁纹丝不动——直到他灵光一闪：“顺序错了！这是倒着刻的！”",
"换序重刻，门锁“咔哒”一声开了。管事的脸都绿了：“你俩……把门修好了？”",
"莫里得意地拍拍手：“修门，我们是专业的。”他转头朝你挤挤眼，“今晚工坊，我请你喝酒——矮人酿的，你喝过没有？”"
],options:[
{t:"赴约，喝矮人酿的麦酒",check:{a:"CON",sk:"surv",label:"痛饮"},tier:{
 ok:["那麦酒劲道十足。三碗下去，莫里话匣子开了：“我爹说，会修锁的矮人，一辈子吃穿不愁。”他打了个嗝，“会修锁的矮人，还知道哪把锁不该开。”","你问他哪把锁不该开。他没回答，只是看着工坊角落那口锁着的铁柜。"],
 fail:["你一碗就上头了。莫里笑得直拍桌子：“哈！北境人不行啊！来，吃点肉压压！”"],
 crit:["酒过三巡，莫里压低声音：“工坊那口铁柜——锁是三年前换的，学院没人知道钥匙在哪。”他顿了顿，“但我见过那锁的样式。是矮人古锁。能开这种锁的钥匙，全大陆只有三把。”","“一把在矮人王宫，一把在圣城大教堂。第三把……”他摇摇头，“丢了。据说，在第七节点。”"]
},effects:{xp:12},onCrit:{flag:"acad_mori_ironbox"},go:"acad_mori_3"}
]};
N["acad_mori_3"]={tag:"main",place:"艾尔达魔法学院 · 符文工坊",pace:"normal",text:[
"第四学年，莫里收到家里的信：北矿塌了一段矿道，压死了七个人。",
"信里夹着一张拓片——是他爹临死前托人带出来的：矿道最深处，发现一块石碑，碑上刻着一个图案。",
"莫里把拓片给你看。你一眼认出：一个圈，圈里一只竖瞳。",
"他沉默了很久，说：“我爹说，让儿子离开矿，去学符文——不是学修锁。”他抬起头，“是学怎么认出那些记号。”",
"“他说，认得记号的人，才能躲开它。”"
],options:[
{t:"陪着他，把拓片上的图案描下来",effects:{xp:10},run:function(){changeRelation('mori',20,'北矿塌方之夜');},tier:{ok:["你们把那图案描了三份。一份给墨丘利，一份收进学院档案，一份——你俩各留半张。","“如果有一天，”莫里说，“这图案又出现在别处——你就知道，该走了。”"]},go:"acad_mori_4"}
]};
N["acad_mori_4"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，莫里没有留在学院。",
"他背着一把自打的战锤，揣着那张拓片：“我要回北矿。我爹留下的矿，总得有人看着。”",
"临行前，他把一柄短刃塞给你：“我自己打的。钢是好钢，能开锁，也能防身。”刃柄上，刻着一个小小的锤纹。",
"他咧嘴一笑：“你是我在学院认识的第一个外人。朋友这东西，矮人一辈子认一个，就够本了。”",
"他转身走进雪里，像一块铁，慢慢走远了。"
],options:[
{t:"收下短刃，送他出山门",effects:{item:"灰须短刃",xp:20},run:function(){changeRelation('mori',20,'毕业赠刃');},tier:{ok:["你握着那柄短刃，看着他的背影消失在雪线里。","北矿，多了一个守矿的人。"]},go:"acad_people_hub"}
]};
/* ---------- 伊莲娜（精灵治愈师） ---------- */
N["acad_elena_1"]={tag:"branch",place:"艾尔达魔法学院 · 药圃",pace:"normal",text:[
"药圃的暖棚里，一个银发少女跪在花丛间，指尖悬着一滴露珠，正缓缓滴进一株枯苗的根须。",
"她听见脚步声，抬头——眼睛是浅绿色的，像新叶：“你是……来要药的？”",
"她起身，拍拍裙摆：“伊莲娜，治愈系。学院里管我配药的。”她笑笑，“不过先说好，我配的药，八成是甜的。”"
],options:[
{t:"和她聊聊精灵的治愈术",check:{a:"CHA",sk:"persu",label:"交谈"},tier:{
 ok:["伊莲娜的眼睛弯起来：“精灵的治愈术，不是‘治伤’——是‘哄伤’。”她示范了一下，“你得先让伤口相信，你不会再伤害它。”","你头一次听见这种说法，若有所思。"],
 fail:["伊莲娜笑了笑，低头继续照顾花苗：“改天聊，这株苗正到关键时候。”"],
 crit:["伊莲娜教你辨识了三种北境没有的草药：“这是精灵语里的‘夜灯草’，能安神；这是‘银泪花’，能止痛；这是……”她顿了顿，“这是‘忘忧草’。喝了，会忘掉最近一个月的事。”","她认真看着你：“精灵族里，这味药只给将死之人用。你记住了——别乱用。”"]
},effects:{xp:10},run:function(){changeRelation('elena',15,'治愈术之谈');},onCrit:{flag:"acad_elena_forget"},go:"acad_elena_2"}
]};
N["acad_elena_2"]={tag:"main",place:"艾尔达魔法学院 · 疫病夜",pace:"normal",text:[
"那年冬，学院闹了一场疫病——高热、咳血，学生病倒了一小半。",
"伊莲娜连着三天没合眼，药圃的存货见底，她自己也染上了轻症。",
"你端着热汤找到她时，她正蹲在药架前配药，手在发抖。她抬头看见你，勉强笑笑：“别……别靠太近。传染。”",
"她把一包药塞给你：“这是配方。我配不动了……你按这个，能配多少配多少。”"
],options:[
{t:"替她配药，熬过那三天",check:{a:"INT",sk:"lore",label:"配药"},tier:{
 ok:["你照着配方，磕磕绊绊配出了三批药。病倒的学生，渐渐少了。","疫病过去那天，伊莲娜瘦了一圈，但眼睛很亮：“你救了我一命——和半个学院。”"],
 fail:["你配废了两批，但第三批终于成了。伊莲娜虚弱地笑：“新手能配成这样，算你有天赋。”"],
 crit:["你不但配出了药，还顺手改良了一味辅料，药效快了一半。伊莲娜看着成品，愣了半天：“……你是治愈系派来的卧底吧？”","她认真地看着你，“药圃以后缺人手，随时来找我。”"]
},effects:{xp:15},run:function(){changeRelation('elena',25,'疫病之夜的并肩');},go:"acad_elena_3"}
]};
N["acad_elena_3"]={tag:"main",place:"艾尔达魔法学院 · 广场",pace:"normal",text:[
"圣痕司来学院抓“涉疑奥术师”那天，伊莲娜正在给一个重伤的学生治伤。",
"灰袍执事要带走那个学生——伊莲娜拦在前面：“他伤还没好。你们现在带走他，他会死在路上。”",
"执事冷笑：“精灵，你在阻碍圣痕司执法。”",
"伊莲娜没让开：“我是治愈师。我的誓言是先救人——你们的执法，等伤好了再说。”",
"围观的人越来越多。执事僵在那里，下不来台。"
],options:[
{t:"站到她身边，一起挡",check:{a:"CHA",sk:"persu",label:"声援"},tier:{
 ok:["你站出来，站在她身边。接着，凯恩也站了过来。艾莉丝、洛卡……半个学院的人都站了过来。","执事最终放过了那个学生，留下一句“你们等着”就走了。","伊莲娜转身看你，眼眶红了：“……谢谢。”"],
 fail:["你站了出来，但人群没动。执事强行带走了学生。伊莲娜站在原地，攥着拳头没说话。","那之后几天，她都没笑过。"],
 crit:["你不但站了出来，还当场驳了执事三条“圣痕司条例”。执事的脸涨得通红，最终摔下一句狠话走了。","伊莲娜看着你，忽然说：“你知道吗——我本来打算毕业后回精灵森林的。”她顿了顿，“现在我想，再留一年。”"]
},effects:{xp:15},run:function(){changeRelation('elena',25,'广场上的并肩');},go:"acad_elena_4"}
]};
N["acad_elena_4"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，伊莲娜收到了精灵森林的回信——森林长老同意她留在人类大陆，“以治愈师的身份，见证这片土地”。",
"她高兴地来找你，把一包种子塞进你手里：“这是‘夜灯草’的种子。北境种不活——但如果你去了南方，种在温暖的地方，它会记得你。”",
"她顿了顿，轻声说：“如果有一天，你受了很重的伤……记得来药圃找我。”",
"她转身离开时，药圃的暖棚里，那株当年枯掉的苗，开出了一朵淡蓝色的小花。"
],options:[
{t:"收下种子，祝她前程",effects:{item:"夜灯草种子",xp:20},run:function(){changeRelation('elena',20,'毕业赠种');},tier:{ok:["你握紧那包种子。学院里，多了一个愿意为陌生人站出来的治愈师。"]},go:"acad_people_hub"}
]};
/* ---------- 老铁（战争系工坊学徒） ---------- */
N["acad_tie_1"]={tag:"branch",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"食堂角落里，一个黑壮少年正埋头吃第四碗饭。他面前的餐盘堆得比山高。",
"你在他对面坐下。他抬头，憨厚一笑：“俺叫老铁，战争系的。俺爹是铁匠，俺本来也该打铁——但俺娘说，多读点书，以后打铁也能多卖俩钱。”",
"他挠挠头：“俺读书不行。但俺力气大，谁要搬东西、扛麻袋，叫俺！”"
],options:[
{t:"帮他认字，从菜谱开始",check:{a:"INT",sk:"lore",label:"教学"},tier:{
 ok:["你教老铁认菜谱上的字。他学得慢，但记得牢：“‘红烧’……‘红烧’是啥意思？就是把啥都烧红了？”","你笑了。他挠挠头，也笑了。这顿饭吃了很久。"],
 fail:["老铁学了半天，还是把‘青菜’认成‘青采’。他沮丧地挠头：“俺是不是太笨了？”","你安慰他：“你力气大啊。读书的事，慢慢来。”"],
 crit:["一个月后，老铁能读食堂的菜谱了。他兴奋地跑来告诉你：“俺能读‘辣子鸡’了！是辣的鸡！”","他郑重其事地谢你：“等俺将来开了铁匠铺，你打铁，不收钱。”"]
},effects:{xp:10},run:function(){changeRelation('tie',15,'菜谱识字课');},go:"acad_tie_2"}
]};
N["acad_tie_2"]={tag:"main",place:"艾尔达魔法学院 · 工坊",pace:"normal",text:[
"老铁的力气派上了大用场——学院要重修演武场的木桩，他一个人扛了半天的料。",
"你帮他打下手，他一边抡锤一边跟你絮叨：“俺爹说，铁匠的儿子，一辈子跟铁打交道。俺想好了，毕业了就回去开铺子。”",
"他顿了顿：“不过，俺娘说——多读点书，以后打铁也能多卖俩钱。”他咧嘴一笑，“俺现在能认二百个字了。够用了！”"
],options:[
{t:"教他写自己的名字",effects:{xp:8},run:function(){changeRelation('tie',10,'演武场并肩');},tier:{ok:["老铁一笔一划，写了半天，终于写出“铁”字。他举着那张纸，像举着军功章：“俺会写名字了！”","他小心地把纸折好，收进怀里：“寄回家里去，让俺娘看看。”"]},go:"acad_tie_3"}
]};
N["acad_tie_3"]={tag:"main",place:"艾尔达魔法学院 · 西厅",pace:"normal",text:[
"第四学年，老铁家里出事了。信是官差捎来的，封口压着北地公国联盟的火漆——信纸只有半张，字迹潦草，是他爹托同村的货郎代写的。",
"他爹的铁匠铺，被征去给北方公国联盟造兵器。他爹不肯去，说打了一辈子农具，不摸杀人的铁。",
"结果被按了个“通敌”的罪名抓了。官差封了铺子，连炉子都砸了。",
"老铁收到信，在工坊里坐了一夜。第二天早上，他眼睛红着，嗓子哑着，把你叫到西厅。",
"他把那半张信纸按在桌上：“俺想回去。但俺娘说，回去了也没用——人家有兵有刀。”",
"他抬起头，那双抡锤子的手在抖：“俺该怎么办？”",
"窗外起了风，西厅的窗纸扑扑地响。"
],options:[
{t:"帮他写一封申诉信，走学院的路子",check:{a:"CHA",sk:"persu",label:"写信"},tier:{
 ok:["你帮他写了一封申诉信，又托墨丘利教授递给学院理事会。半个月后，回音来了：他爹的罪名降为“征用纠纷”，限期放人。","老铁攥着回信，手抖了半天：“……谢，谢谢你。”"],
 fail:["申诉信石沉大海。老铁等了一个月，最终决定自己回去看看。他走之前，把你教他写的二百个字，抄了一份带在身上。"],
 crit:["你不但写了信，还找到了当年经办此案的文书漏洞。老铁的爹，三天后就被放了出来。","老铁冲进工坊，给你鞠了个九十度的躬：“俺这条命，以后就是你的了。”"]
},effects:{xp:15},run:function(){changeRelation('tie',25,'家书与申诉');},go:"acad_tie_4"}
]};
N["acad_tie_4"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，老铁果然回去开了铁匠铺。",
"他临走前，把一柄自己打的柴刀塞给你：“俺娘说了，读书人使不动刀，但砍柴总得有个家伙。”",
"他憨厚地笑着：“俺铺子开在铁门关外官道边。你路过，报俺名字，打铁八折！”",
"他背着一大包工具，哼着不知名的乡间小调，走远了。",
"你握着那柄柴刀——刀柄上，歪歪扭扭刻着一个“铁”字。那笔迹，是你教的。"
],options:[
{t:"收下柴刀，目送他远去",effects:{item:"老铁柴刀",xp:20},run:function(){changeRelation('tie',20,'毕业赠刀');},tier:{ok:["你握着那柄柴刀。铁门关外的官道上，多了一间铁匠铺。"]},go:"acad_people_hub"}
]};
/* ---------- 老友结局（凯恩/艾莉丝/洛卡/阿塔） ---------- */
N["acad_kain_end"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，凯恩在战争系拿到了头名。",
"他来找你，难得带了一壶酒：“喝一杯。毕业了，以后不知道还有没有机会。”",
"你问他打算。他看着窗外的塔灯：“我学了五年‘不死人的打仗’——够不够，得上战场才知道。”",
"他顿了顿：“铁门关那边，缺个教官。我打算去。”",
"他举起酒碗：“敬学院。敬朋友。敬……还没打完的仗。”"
],options:[
{t:"与他碰碗，祝他平安",effects:{xp:20},run:function(){changeRelation('kain',20,'毕业敬酒');},tier:{ok:["那碗酒很烈。凯恩喝完，把碗往桌上一顿，转身走了。","你看着他的背影——那柄旧剑，换了一柄新剑。"]},go:"acad_people_hub"}
]};
N["acad_alice_end"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，艾莉丝的火系法术已经能烤熟一整头羊。",
"她毕业汇演时，把演武场的沙地烧出一片焦黑——院长在台上咳嗽了两声：“……艾莉丝同学，下次注意防火。”",
"散场后，她抱着那本旧《火系基础·入门》来找你：“当初你第一个喝我汤的时候，我就觉得——你会是个好朋友。”",
"她翻开扉页，上面写着：“致第一个敢吃我汤的人。”她补了一行字：“和最后一个。”",
"“我打算去南方的火山城进修。”她朝你眨眨眼，“等我成了大法师，请你喝汤——保熟的那种。”"
],options:[
{t:"笑着应下这顿‘保熟的汤’",effects:{xp:20},run:function(){changeRelation('alice',20,'毕业之约');},tier:{ok:["你和她击掌为誓。那本旧书，你一直收着。"]},go:"acad_people_hub"}
]};
N["acad_loca_end"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，洛卡的药剂配方被圣痕司盯上了——他配的一种“安眠水”，被说成“迷魂药”。",
"你替他作证：那配方你见过，只是安神用的。",
"圣痕司最终没抓他，但洛卡吓得不轻。他来找你，难得一脸认真：“我这些年，配了一百多种药水。最好的那瓶，我留着没用。”",
"他掏出一小瓶淡蓝色的药水：“这是‘净水’的解药。我花了三年配的。”他压低声音，“圣痕司那瓶‘净水’，我偷过样本——这个能解。”",
"他把它塞给你：“拿着。比什么毕业证书都值钱。”"
],options:[
{t:"郑重收下这瓶解药",effects:{item:"净水解药",xp:20},run:function(){changeRelation('loca',25,'解药相赠');},tier:{ok:["你收下那瓶淡蓝色的药水。洛卡咧嘴一笑：“我总算，配出了一瓶有用的。”"]},go:"acad_people_hub"}
]};
N["acad_ata_end"]={tag:"ending",place:"艾尔达魔法学院 · 毕业季",pace:"normal",text:[
"毕业那年，阿塔收到草原的信：黑石部族被暗蚀会袭击了。",
"他连夜收拾行装，来找你道别。他把你带到宿舍，把那床狼皮抱出来：“这个，你留着。”",
"“草原的规矩：收了东西，就是朋友。朋友之间，不欠账。”他把狼皮塞进你怀里，“我欠你的，草原上还你。”",
"你问他打算。他握紧拳：“回草原，把那些挖地的，赶出去。”",
"他走出门，又回头：“如果草原出事——去狼旗下找我。”",
"和五年前，一模一样的这句话。"
],options:[
{t:"把狼皮收好，送他出山门",effects:{xp:20},run:function(){changeRelation('ata',20,'草原之约');},tier:{ok:["你抱着那床狼皮，看着他的背影消失在雪线里。","草原上的风，会记得一个叫阿塔的战士。"]},go:"acad_people_hub"}
]};
})();

/* /u1inj:data-nodes:dn_acad_road.js/ */
/* ============================================================
 * B-1 入学引导链：雪原旅途 → 学院山门 → 新生报到 → 宿舍分配 → 开学典礼
 * 三入口（自由城 fc_choice / 王都 arrive_north_beijing / 铁门关前线 arrive_north_tiebi）
 * 均 go 到此链首节点 acad_road_1，链尾接既有 north_academy_gate（零改动）。
 * 埋 flag: acad_road_done；不下任何主线判定，与 day250 学院暗流双轨并存。
 * 铁律：saveVersion=48 不变；writeNext/choose/判定公式零触碰。
 * ============================================================ */
(function(){
  N["acad_road_1"]={tag:"main",place:"北境 · 霜脊商道",pace:"deep",text:[
    "北行的官道在过了河湾城之后变窄，路面压着碎冰，马蹄印里结着暗蓝色的霜。",
    "越往北走，人越少。偶尔有驿马从身边掠过，马背上的人裹着灰斗篷，像一阵风去赶另一阵风。道边每隔十里立着一根石柱，柱顶刻着符文——那是联盟的古道标，专为迷途的旅人点灯。",
    "你在一根石柱下歇脚时，遇到一个赶驴的老货郎。他听说你要去艾尔达魔法学院，咧嘴笑了：“这年头，去学院的，十个里有八个是躲兵役的。你是哪个？”",
    "你没答。他眯着眼看了看你，忽然点点头：“……眼睛不一样。你这样的，学院会收。”",
    "他把驴背上的旧毯子掀开一角，露出半截书脊：“老夫年轻时，也在学院门前站过一夜。没进去，但记住了一句话——法神说的：‘知识为火，照彻长夜。’”",
    "“去吧。山门在雪里，别走岔了。”",
    "风从北边来，带着学院塔尖上的钟声。你站起身，朝那声音走去。"
  ],tag:"main",
  options:[
    {t:"继续北行，循着钟声赶路",effects:{xp:5},go:"acad_road_2"}
  ]};
  N["acad_road_2"]={tag:"main",place:"艾尔达魔法学院 · 山门",pace:"normal",text:[
    "艾尔达魔法学院没有围墙，围住它的是山。白墙从雪线以下垒起，塔尖刺进云层，像一把把竖起的剑。",
    "山门前立着两尊石像：左边是法神黄林晶，右手持书；右边是一位无名老者，左手托着一盏灯。石像底座上各刻一行字——左边是“知识为火，照彻长夜”，右边的字被风雪磨得只剩半边，依稀可辨：“……别忘了自己是人。”",
    "守门的执事是个白发老者，穿着洗得发白的灰袍。他看了你的凭证，又看了看你的眼睛，忽然问了一句奇怪的话：",
    "“孩子，你怕不怕冷？”",
    "你一愣。他笑了：“怕冷的人，熬不过学院第一个冬天。不怕冷的人……也未必。进来吧，先去西厅报到。”",
    "他侧身让路时，你看见他袖口绣着一枚小小的银色树叶——那是学院执事里最老的一批，才有的徽记。"
  ],tag:"main",
  options:[
    {t:"迈进山门，去西厅报到",go:"acad_road_3"},
    {t:"先在山门外站一会儿，看看那尊无名石像",check:{a:"INT",sk:"lore",label:"端详"},tier:{
      ok:["你凑近那尊无名石像，拂开底座上的雪。被磨去的字迹里，还能认出几个笔画：“……火……亦……人。”","你在石像脚边发现一枚被雪埋了一半的旧铜币，正面压着一朵七瓣花的图案——和你在路上见过的所有钱币都不同。你把它收好。"],
      fail:["雪太大，字迹实在看不清。你搓了搓手，作罢。"],
      crit:["你拂开整面底座，借着雪光，勉强拼出完整的句子：“知识为火，亦可焚人。莫忘来处，别忘了自己是人。”","你心头一动。这句话，和你那位无名石像老者的传说对上了——据说学院第一任院长，就是那位无名老者，他把名号让给了自己的学生黄林晶。"],
      critfail:["你站得太久，被守门执事轻轻拍了拍肩：“孩子，雪里站久了，骨头会疼。”他顿了顿，“也容易看见不该看见的东西。”","你打了个寒颤，不知是因为冷，还是因为他的话。"]
    },effects:{},onCrit:{flag:"acad_unknown_shrine"},go:"acad_road_3"}
  ]};
  N["acad_road_3"]={tag:"main",place:"艾尔达魔法学院 · 西厅报到",pace:"normal",text:[
    "西厅是一间巨大的石厅，穹顶画着历代院长的肖像。长桌后坐着三个执事，面前各摆一摞羊皮纸。",
    "给你登记的是个圆脸的年轻女执事，说话很快，像念咒语：“姓名？籍贯？出身？会几门术法？会几种兵器？家里几口人？……”",
    "她问完，头也不抬地在纸上勾画，忽然停笔，抬眼看了看你：“你是……战士出身？来学院，想学什么？”",
    "她旁边的老执事插了一句：“学院不只教魔法。战争系、符文系、药剂系、御兽系，都有。战士有战士的路。”",
    "你填完最后一栏，她盖下学院的银叶印，把一张旧羊皮纸推给你：“这是你的学籍函。西三舍，一楼，靠窗的铺位。明天开学典礼，别迟到——院长最恨迟到的人。”",
    "她顿了顿，压轻声音补了一句：“……还有，晚上别去东边那栋灰楼。那是圣痕司的地盘，进去过的人，出来时都不太爱说话。”"
  ],tag:"main",
  options:[
    {t:"领下学籍函，去西三舍安顿",effect:{item:"学院学籍函"},effects:{flag:"acad_road_done"},go:"acad_road_4"}
  ]};
  N["acad_road_4"]={tag:"main",place:"艾尔达魔法学院 · 西三舍",pace:"normal",text:[
    "西三舍是栋老石头楼，走廊里飘着木柴和墨水的味道。你的铺位靠窗，窗台上积着一层薄灰，玻璃上结着霜花。",
    "隔壁铺位住着一个黑发少年，正埋头擦一柄旧剑。他见你进来，抬起头，目光在你脸上停了一瞬：",
    "“新来的？我叫凯恩，战争系的。”他指了指窗外，“那边塔顶的灯，是图书馆的。别在半夜看它——有人说，灯会数人。”",
    "你还没接话，走廊里传来一阵急促的脚步声。一个火红色头发的少女抱着书跑过，差点撞到门框：“让让让让——要迟到了！”",
    "凯恩看着她的背影，笑了笑：“那是艾莉丝，火系最疯的一个。你以后会习惯的。”",
    "他把那柄旧剑往墙边一靠，朝你伸出手：“学院的日子长着呢。慢慢处。”"
  ],tag:"main",
  options:[
    {t:"和凯恩握手，安顿下来",go:"acad_road_5"},
    {t:"问他：你刚才说‘灯会数人’是什么意思",check:{a:"CHA",sk:"persu",label:"追问"},tier:{
      ok:["凯恩沉默了一会儿，压低声音：“图书馆塔顶那盏灯，夜里会亮。但有人说——它亮几次，那夜学院就少几个人。”他见你脸色微变，又补了一句：“当然，也可能只是老传说。学院这种地方，传说是最多的。”","你默默记下这句话。窗外的塔灯，正静静地亮着。"],
      fail:["凯恩摇摇头：“算了，当我没说。明天开学典礼，早点睡吧。”他翻了个身，不再说话。"],
      crit:["凯恩看了看门口，确认没人，才凑近说：“我上铺那个，上个月退学了。退学前一晚，他说他看见塔灯亮了三下——同夜，学院地下室的档案室，丢了三份卷宗。”","“第二天就没人再提这件事。你……自己小心。”他拍了拍你的肩，眼神里有一丝不易察觉的忧虑。"]
    },effects:{},onCrit:{flag:"acad_tower_rumor"},go:"acad_road_5"}
  ]};
  N["acad_road_5"]={tag:"main",place:"艾尔达魔法学院 · 开学典礼",pace:"deep",text:[
    "开学典礼在学院中央的环形广场举行。法神黄林晶的石像立在广场中央，负手而立，视线望向北方。",
    "学生们按系别列队。你站在人群里，抬头看见石像基座上的字——“知识为火，照彻长夜”。和山门上的一模一样。",
    "典礼很短。院长只在最后说了三句话：",
    "“第一，学院不收懦夫。”",
    "“第二，学院不问出身——但会记得你做过什么。”",
    "“第三，塔顶的灯，不是用来数的。”",
    "最后一句落下时，广场安静了一瞬。你看见前排几个老学生互相交换了一个眼神，又迅速移开。",
    "散场时，钟声响了七下。黄昏的光斜斜地铺在广场上，把每个人的影子拉得很长。",
    "你站在原地，看着那座石像。北方的天边，有一线极淡的红——像伤口愈合前的颜色。",
    "学院的生活，从今晚开始。"
  ],tag:"main",
  options:[
    {t:"走进学院大门，正式开始学院生涯",go:"north_academy_gate"}
  ]};
})();

/* /u1inj:data-nodes:dn_acad_social.js/ */
/* ============================================================
 * B-5 学院人际加密：49 节点
 * 子链：宿舍室友(8) / 同窗集体(4) / 已有NPC深化(8) / 五人小队(5)
 *      / 图书馆缘(4) / 食堂江湖(4) / 学院节日(4) / 同乡会(3)
 *      / 医药学徒(4) / 演武对战(4) / 人际hub(1)
 * 入口：acad_people_hub 追加选项 → acad_social_hub
 * 铁律：saveVersion=48；不触碰判定公式/writeNext/choose/存档语义；
 *       全部带 tag/place/pace；中文引号成对；禁 30 治理词
 * ============================================================ */
(function(){
/* ---------- 人际 hub（1） ---------- */
N["acad_social_hub"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"学院的宿舍区，是几栋连在一起的三层石楼，中间围着一方天井。天井里种着一棵老槐树，夏天遮阴，冬天挂霜。课余时间，学生们都聚在这里：有人在下棋，有人在背书，有人蹲在树根底下喂松鼠。",
"你站在天井里，看着这热闹的场面。有人在喊你：“喂！这边！三缺一！”——是凯恩，他坐在石桌边，手里攥着一把纸牌，正冲你招手。",
"你笑了笑。学院的夜晚很长，但有了这些人，日子不空。"
],options:[
{t:"先去宿舍，看看室友在忙什么",go:"acad_roommate_1"},
{t:"加入凯恩他们的牌局（同窗闲聚）",go:"acad_peer_1"},
{t:"去找阿塔/艾莉丝聊聊（老友）",go:"acad_deep_ata_1"},
{t:"去图书馆夜读（图书馆缘）",go:"acad_library_1"},
{t:"去食堂碰碰运气（食堂江湖）",go:"acad_canteen_1"},
{t:"去修行区（冥想/元素池/试炼）",go:"acad_magic_hub"},
{t:"去学院各处转转（庆典/演武/传闻）",go:"acad_story_festival"},
{t:"回自己屋，安静待着",go:"acad_people_hub"}
]};
/* ---------- 宿舍室友（8：阿岩/小柯 各 4） ---------- */
N["acad_roommate_1"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"你的宿舍在二楼，窗朝北，能看到灰楼的尖顶。屋里两张床，靠窗那张是你的，靠门那张住着阿岩——一个来自矿山镇的兽人后生，块头大，话少，笑起来像打雷。",
"你推门进去，阿岩正盘腿坐在床上磨一把短刀，磨石在刀身上推来推去，发出细沙般的响。他抬头看你，咧嘴一笑：“回来了？今天食堂的炖肉不错，我给你留了一碗，在窗台上。”",
"窗台上果然扣着一只碗，掀开，还冒着热气。你心里一暖：“谢了，阿岩。”他摆摆手，继续磨刀。"
],options:[
{t:"坐下吃那碗肉，跟他闲聊",effects:{xp:6,relation:{npc:"acad_npc_rock",v:5}},tier:{ok:["你坐在床沿吃肉，阿岩一边磨刀一边跟你说话。他说矿山镇的事：矿洞、炉火、他爹的锤子。“我爹说，矿山人的骨头是铁打的。”他拍了拍自己的胸膛，“我随他。”","肉炖得烂，汤也香。你吃完，把碗刷了放回去。"]},go:"acad_roommate_2"},
{t:"问他磨刀做什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["阿岩说：“明天演武课，戈拉教官说要‘实战对练’。我寻思，刀不快，吃亏。”他顿了顿，“你要不要也把家伙什磨磨？教官那人，下手没轻重。”","你想起戈拉教官的教鞭，点了点头：“磨。”"],
 fail:["阿岩摇摇头：“没什么，闲着也是闲着。”他把刀收起来，岔开了话题。"]},go:"acad_roommate_2"},
{t:"把碗放回窗台，先去忙",effects:{xp:3},tier:{ok:["你道了谢，先把碗放回窗台，转身去忙自己的事。","阿岩也不在意，继续磨他的刀。屋里只有磨石的声音，一下，一下，像山的心跳。"]},go:"acad_roommate_2"}
]};
N["acad_roommate_2"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"夜里，你躺在床上，阿岩在对面床上翻了个身。月光从窗户漏进来，照在他脸上。他忽然开口：“哎，你说，咱们毕业之后，都去干什么？”",
"你没睡，睁着眼看着天花板：“不知道。也许去西境，也许去铁门关，也许回老家。”阿岩沉默了一会儿：“我想回矿山镇。我爹老了，矿洞没人管了。”他顿了顿，“但学院教的东西，在矿山用不上。”",
"他说完，又翻了个身，声音闷闷的：“有时候我在想，读这些书，到底有什么用。”"
],options:[
{t:"认真回答他：读书不亏",effects:{xp:6,relation:{npc:"acad_npc_rock",v:8}},tier:{ok:["你想了想，说：“我出村的时候，村里人说我‘眼睛不一样’。我来学院，就是想弄明白哪里不一样。”你顿了顿，“读了几年书，我明白了一点——眼睛不一样，是因为看到了别人看不到的东西。这本事，放哪儿都亏不了。”","阿岩沉默了很久，然后说：“……有道理。”他翻了个身，“睡吧。”"]},go:"acad_roommate_3"},
{t:"逗他：那你还不如跟我去北边",effects:{xp:5,relation:{npc:"acad_npc_rock",v:5}},tier:{ok:["你笑着说：“要不毕业跟我走？北边的事多，正缺矿山出身的硬汉。”阿岩哼了一声：“你少给我画饼。北边能打铁吗？”你说：“能。铁门关的兵器铺，缺师傅。”","他沉默了一会儿，说：“……那我考虑考虑。”"]},go:"acad_roommate_3"},
{t:"不接话，装睡",effects:{xp:3},tier:{ok:["你没有接话。屋里安静下来，只有两个人的呼吸声。","过了很久，阿岩轻声说：“……你说得对，读书不亏。”你假装睡着了，但嘴角翘了翘。"]},go:"acad_roommate_3"}
]};
N["acad_roommate_3"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"周末，阿岩难得没在宿舍磨刀，而是坐在窗台上，捧着一封信发呆。你凑过去看了一眼——信纸很旧，边角卷起，字迹歪歪扭扭，像小孩写的。",
"阿岩没躲，反而把信递给你：“我妹妹写的。她说，矿山镇今年冬天，煤不够烧了。我爹的腿，又犯了。”他声音很低，“我娘走得早，家里就我爹和我妹。”",
"他抬起头，看着你：“我想把学院的奖学金寄回去。但寄了，我下学期的饭钱就没了。”"
],options:[
{t:"借他几个银月，让他凑够寄回去",effects:{gold:-5,relation:{npc:"acad_npc_rock",v:15}},tier:{ok:["你从行囊里数出五个银月，塞进他手里：“拿着，先寄回去。饭钱的事，我这儿还有。”阿岩愣住，攥着钱的手有些抖：“你……你自己够花？”你说：“够。食堂管饱。”","他低头，声音闷闷的：“这个情，我记一辈子。”"]},go:"acad_roommate_4"},
{t:"帮他出主意：接学院委托挣外快",check:{a:"CHA",sk:"persu",label:"出主意"},tier:{
 ok:["你给他指了条路：教务处常年收“北境矿石标本”，你是矿山出身的，识矿，正好对口。阿岩听完，眼睛一亮：“这个我能干！”当天他就去教务处报了名，接下了第一单。"],
 fail:["阿岩摇摇头：“我嘴笨，接不了那种活。”他苦笑一声，“我还是想想别的法子吧。”"],
 crit:["你不仅指了路，还陪他去教务处，帮他跟执事讨价还价，把单价谈高了两成。执事摇头：“你们这些学生，精得跟猴似的。”","阿岩咧嘴笑了，那是你第一次见他笑得这么开。"]},
effects:{xp:10},onCrit:{flag:"acad_rock_ore_job"},go:"acad_roommate_4"},
{t:"爱莫能助，只能安慰几句",effects:{xp:4},tier:{ok:["你拍拍他的肩：“会好的。你爹会好，你妹妹也会好。”阿岩勉强笑了笑：“嗯。”","你知道，安慰话解决不了问题。但至少，他今晚不是一个人坐着发愁。"]},go:"acad_roommate_4"}
]};
N["acad_roommate_4"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"学期末，阿岩的矿石标本生意做起来了，还清了你的钱，还给妹妹寄了一笔“买煤钱”。他那天难得豪气：“走，食堂，我请客！”",
"他点了一桌子菜，又要了两碗酒。你问他：“你下学期还接那个活吗？”他点头：“接。攒够钱，我妹就能来城里念书了。”他顿了顿，“她比我聪明，该念书。”",
"你端起酒碗，跟他碰了一下：“敬你妹妹。”他咧开嘴，眼眶却有点红：“敬她。”"
],options:[
{t:"跟他碰杯，喝下那碗酒",effects:{xp:8,relation:{npc:"acad_npc_rock",v:10}},tier:{ok:["酒是北境常见的麦酒，辣，但暖。你们碰了碗，一饮而尽。","阿岩抹了把嘴：“我这辈子，认你这个兄弟。”他伸出拳头。你也伸出拳头，跟他碰了碰。"]},go:"acad_social_hub"},
{t:"提醒他：留点钱防身",effects:{xp:6},tier:{ok:["你叮嘱他：“给家里寄钱是好，但也别全寄了。自己留点，万一有个急用。”阿岩想了想，点头：“你说得对。我留半成。”","他记下了你的话。这人嘴笨，但听劝。"]},go:"acad_social_hub"}
]};
N["acad_roommate_5"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"宿舍靠窗的另一个床位，住着新搬来的室友——小柯，一个从河湾城来的年轻人，瘦高个，戴一副圆框眼镜，走路爱捧着书看，差点撞过三次柱子。",
"他正趴在桌上写什么，纸页摊了一桌。你凑近一看，满纸都是密密麻麻的符文对照表，旁边还画着歪歪扭扭的箭头，标注着“此处存疑”“待考”。",
"他察觉到你在看，抬起头，推了推眼镜，不好意思地笑了：“我在整理符文变体的谱系……就是，有点乱。”他顿了顿，“你要是有空，帮我看看第三页那个‘风’字，我总觉得写得不对。”"
],options:[
{t:"坐下帮他看符文",check:{a:"INT",sk:"lore",label:"辨字"},tier:{
 ok:["你看了第三页那个‘风’字——确实不对，笔画里混了一种南方古体的写法，意思从“风”变成了“风中之物”。你跟小柯说了，他眼睛一亮：“原来如此！难怪我一直觉得别扭！”他当场改了，还郑重其事地在本子上记了一笔。","你俩聊到深夜。"],
 fail:["你看了半天，也没看出问题：“我看不出来。你写的这些，已经比我强了。”小柯有点失望，但很快又打起精神：“那我再查查别的资料。”"],
 crit:["你不仅看出笔画问题，还从记忆里翻出一段罗先生笔记里的记载，印证了你的判断。小柯听完，愣了半天：“你……你是怎么记下这么多东西的？”他看你的眼神，像看一本活字典。"]},
effects:{xp:12},onCrit:{flag:"acad_ke_lore"},go:"acad_roommate_6"},
{t:"给他指路：图书馆三楼有旧档",effects:{xp:6},tier:{ok:["你告诉他，图书馆三楼北侧的书架，有几本旧符文汇编，里面收了这个变体。小柯听完，抱着书就跑：“谢了！回来请你喝河湾城的茶！”","他跑得比兔子还快，差点又撞上柱子。"]},go:"acad_roommate_6"},
{t:"不打扰他，回自己床铺",effects:{xp:3},tier:{ok:["你轻轻走回自己床铺。小柯又埋头写起来，纸页沙沙响。","这人读书的样子，让你想起老货郎说的“钻进去的人”。"]},go:"acad_roommate_6"}
]};
N["acad_roommate_6"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"小柯在学院待了一个月，瘦了一圈——他太爱熬夜看书了，灯油用得像喝水。一天夜里，你起来小解，看见他趴在桌上睡着了，脸压在一本书上，眼镜歪到一边。",
"你把他抱到床上，替他盖好被子。他嘟囔了一句梦话：“……不对，这个符文……是反的……”",
"第二天一早，他醒了，发现自己睡在床上，一脸茫然：“我怎么……？”你故作严肃：“你昨晚梦游，自己走回去的。”他信了，还认真地跟你道歉：“对不起啊，我梦游没吵到你吧？”你忍住笑：“没有。”"
],options:[
{t:"跟他坦白：是你抱他回去的",effects:{xp:6,relation:{npc:"acad_npc_ke",v:8}},tier:{ok:["你笑着承认了。小柯闹了个大红脸，推着眼镜说：“那……那谢谢你了。”他顿了顿，“我以后尽量不熬夜了。”","至于他有没有做到——你后来发现，他的灯油还是用得很快。"]},go:"acad_roommate_7"},
{t:"继续逗他：你梦游还念咒",effects:{xp:5,relation:{npc:"acad_npc_ke",v:5}},tier:{ok:["你一本正经地说：“你昨晚还说梦话，念了一段符文，把窗台上的花都念蔫了。”小柯脸色大变：“真……真的？那花是特蕾莎嬷嬷养的！”他慌慌张张跑去给花道歉。","你在后面笑得直不起腰。"]},go:"acad_roommate_7"}
]};
N["acad_roommate_7"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"小柯最近有点不对劲。他平时话不多，但这两天连书都看不进去，坐在桌边发呆，时不时叹气。你问他怎么了，他支支吾吾半天，才说：“家里来信……说河湾城的水路生意，被人抢了。”",
"他摘下眼镜，擦了擦：“我爹让我回去接手家里的账房。可我……我还有两年才能毕业。”他苦笑，“回去，学业就断了；不回去，家里就难了。”",
"他低着头，声音很轻：“我从小到大，什么事都是听家里的。这是头一回，我自己拿不定主意。”"
],options:[
{t:"认真帮他权衡",check:{a:"CHA",sk:"persu",label:"劝说"},tier:{
 ok:["你问他：“你爹让你回去，是真缺人手，还是怕你学成了不回去？”他愣了一下：“……好像都有。”你说：“那你该告诉他，你学成了，回去能把账房做得更好。”","他沉默了很久，忽然抬头，眼睛亮了：“你说得对。我写信回去，跟他讲清楚。”"],
 fail:["你劝了几句，但他显然听不进去。他苦笑：“道理我都懂，但家里的担子……你不懂。”你确实不懂。你只能拍拍他的肩。"],
 crit:["你不仅劝了他，还帮他把回信拟了个草稿——既讲清学业的价值，又给家里画了个“学成后账房扩三成”的饼。他看了一遍，又看一遍，抬头看你：“你以前……是做什么的？”你笑了笑：“种过地，跑过腿。”"]},
effects:{xp:12},onCrit:{flag:"acad_ke_letter"},go:"acad_roommate_8"},
{t:"劝他：学业为重",effects:{xp:5},tier:{ok:["你说：“书读到一半，最亏。你先毕业，回去一样能接账房。”他想了想，点头：“也是。那我先读完。”","他嘴上答应了，但你知道，他心里的天平，还在晃。"]},go:"acad_roommate_8"}
]};
N["acad_roommate_8"]={tag:"main",place:"艾尔达魔法学院 · 宿舍",pace:"normal",text:[
"小柯的信寄出去一个月后，回信到了。那天他拆信的时候，手在抖。",
"信里只有短短几行，但他看了很久。看完，他抬起头，眼眶红红的，却笑着：“我爹说……让我读完。他说，账房他能再撑两年。”他顿了顿，“他说，‘我儿出息了，比老子强。’”",
"他攥着信，低着头，半天没说话。你走过去，拍了拍他的肩。他吸了吸鼻子：“……谢谢你。那天要不是你，我可能真就回去了。”"
],options:[
{t:"拍拍他，说句实在话",effects:{xp:8,relation:{npc:"acad_npc_ke",v:12}},tier:{ok:["你说：“你爹让你读完，是盼你好。你好好读，就是对得起他。”小柯点头，把信仔细折好，收进贴身衣袋。","那天之后，他的灯油用得更多了。但他说，这次是心甘情愿的。"]},go:"acad_social_hub"},
{t:"开他玩笑，冲淡气氛",effects:{xp:5,relation:{npc:"acad_npc_ke",v:5}},tier:{ok:["你笑着说：“行了，别哭了。再哭，眼镜就该起雾了。”他破涕为笑，推了推眼镜：“谁哭了！我是……眼睛进了沙子！”","屋里两个人都笑了。窗外，雪正下得紧。"]},go:"acad_social_hub"}
]};
/* ---------- 同窗集体（4） ---------- */
N["acad_peer_1"]={tag:"main",place:"艾尔达魔法学院 · 宿舍天井",pace:"normal",text:[
"天井里的牌局，正打到热闹处。凯恩是庄家，面前堆着一小摞铜板；艾莉丝抱着一本书，坐在旁边看热闹；洛卡蹲在凳子上，袖子撸得老高，一脸“我不服”。",
"你坐下，凯恩麻利地洗牌：“三缺一，就等你了。规矩老样：输家去食堂打饭。”他冲你挤挤眼，“你运气好，我看好你。”",
"洛卡哼了一声：“他运气好？上次他连输三把，让我跑了一趟食堂！”你笑了笑：“那是让着你。”"
],options:[
{t:"痛快上桌，打两把",check:{a:"CHA",sk:"gamble",label:"手气"},tier:{
 ok:["你手气不错，连赢两把。洛卡输得直咬牙，凯恩笑得直拍桌子：“好！好！今晚食堂的炖肉，洛卡请！”洛卡梗着脖子：“请就请！我洛卡输得起！”","牌局散了，一群人去食堂，热热闹闹。"],
 fail:["你手气背，输了两把。你认赌服输，去食堂打了三份饭。洛卡在身后喊：“记得多打点肉！”你回头瞪他一眼，他嘿嘿笑。"],
 crit:["你不仅赢了牌，还赢出了名场面——凯恩的“必胜牌局”被你破了。他愣了半天，把铜板往你面前一推：“服了。这顿我请。”","你笑着把钱推回去：“留着吧。我逗你们玩的。”众人笑骂：“好啊你！”"]},
effects:{xp:10},onCrit:{flag:"acad_peer_cards"},go:"acad_peer_2"},
{t:"先不打，看他们打",effects:{xp:4},tier:{ok:["你在旁边看了一局。凯恩出牌快，洛卡爱诈，艾莉丝边看书边插两句嘴——乱糟糟的，却让人安心。","你看了一会儿，嘴角不自觉地翘起来。"]},go:"acad_peer_2"}
]};
N["acad_peer_2"]={tag:"main",place:"艾尔达魔法学院 · 辩论堂",pace:"normal",text:[
"学院每半月有一场辩论会，这周的辩题是：“战争结束后，北境该重建城墙，还是该修复良田？”正反两方各执一词，吵得面红耳赤。",
"凯恩被推上正方：“城墙是命！没城墙，修了田也是给人抢的！”反方的一个学姐拍桌子：“田是根！没饭吃，守着城墙喝风吗？”两边各不相让，台下哄笑一片。",
"你坐在台下，手里攥着一把瓜子。这场面，比食堂抢菜还热闹。"
],options:[
{t:"上台，支持重建城墙",check:{a:"CHA",sk:"speech",label:"陈词"},tier:{
 ok:["你上台，讲了个铁门关的故事——守城的老兵，把名字刻在城墙根下。你说：“城墙挡的不只是兵，还有人心里的怕。墙在，人就有底气种田。”台下安静了一会儿，然后响起一片掌声。"],
 fail:["你上台讲了几句，被反方学姐两句就驳了回来：“墙是死的，人是活的！你把墙修得再高，人也得吃饭！”你讪讪下台，凯恩在台下冲你摊手。"],
 crit:["你不仅讲了故事，还补了一段：“北境的地，能种三年粮，但守不住三年墙。”你顿了顿，“可没有墙，连三年都没有。”这一句，把两边都说服了。主持人敲槌：“本场持平！加赛一场！”台下轰然叫好。"]},
effects:{xp:12},onCrit:{flag:"acad_peer_debate"},go:"acad_peer_3"},
{t:"上台，支持修良田",check:{a:"CHA",sk:"speech",label:"陈词"},tier:{
 ok:["你上台，讲了你出村前的见闻——村里人守着几亩薄田，一年到头，就盼个收成。你说：“田是根。根在，人就不会散。”台下有人点头，有人摇头，但掌声也不少。"],
 fail:["你讲得干巴巴的，被正方学长抓住漏洞驳了一通。你下台时，凯恩笑你：“让你逞能。”你回他：“至少我上去了。”"],
 crit:["你讲到最后，说了句：“城墙能挡住敌人，但挡不住饿。真正的北境，是田里长出来的，不是墙里垒出来的。”这句话，被学姐记下来，后来印在了学院的小报上。"]},
effects:{xp:12},onCrit:{flag:"acad_peer_field"},go:"acad_peer_3"},
{t:"在台下看热闹，不上去",effects:{xp:4},tier:{ok:["你嗑着瓜子，看台上吵得面红耳赤。艾莉丝在旁边说：“你不上台？”你说：“我听听就好。”","有些事，听比说有意思。"]},go:"acad_peer_3"}
]};
N["acad_peer_3"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"食堂的晚饭时间，是全学院最“兵荒马乱”的时刻。窗口前排着长队，后面的人踮脚张望，前面的人端着餐盘左躲右闪，生怕汤洒了。",
"你端着餐盘刚找到座位，一个低年级学生端着满满一盆汤，摇摇晃晃地走过来，眼看就要撞上——你眼疾手快，一把扶住他的餐盘：“慢点，汤要洒了。”",
"他涨红了脸，连声道谢，端着汤小心翼翼地走了。你坐下，对面一个不认识的学姐冲你竖了个大拇指：“好人。上学期我在这摔过一跤，汤泼了前襟，洗了三天。”"
],options:[
{t:"跟学姐搭话，混个脸熟",check:{a:"CHA",sk:"persu",label:"搭话"},tier:{
 ok:["学姐是炼金系的，叫珊娜。你们边吃边聊，她讲了不少炼金系的趣事：炸过三次坩埚，被特蕾莎嬷嬷罚扫了一周药圃。你讲了你老家的事，她听得直乐。","一顿饭的功夫，你多了个朋友。"],
 fail:["学姐话不多，你也没找到话头。一顿饭吃得安静，不过倒也不算尴尬。"],
 crit:["你俩聊得投机，学姐临走前塞给你一张纸：“炼金系夜课的旁听证，感兴趣就来听。比你们符文课有意思。”","你收下旁听证。炼金系——也许值得去看看。"]},
effects:{xp:10},onCrit:{flag:"acad_peer_alchemy"},go:"acad_peer_4"},
{t:"专心吃饭，不搭话",effects:{xp:4},tier:{ok:["你专心对付餐盘里的炖肉。食堂的炖肉是限量供应的，错过了就是错过。","你吃完，把餐盘送回回收处，离开。"]},go:"acad_peer_4"}
]};
N["acad_peer_4"]={tag:"main",place:"艾尔达魔法学院 · 演武场外圈",pace:"normal",text:[
"冬天，学院办了一场“环山长跑”，绕着学院所在的整座山跑一圈，全程十几里。参与的人不少，一半是自愿，一半是被戈拉教官“鼓励”的。",
"你跑到半山腰时，腿已经开始发酸。旁边是洛卡，他跑得脸通红，还不忘贫嘴：“你……你行不行啊？不行……就说……我背你！”你喘着气回他：“你……先管好……你自己！”",
"坡顶的风很大，吹得人睁不开眼。但跑过坡顶，就能看见学院的全貌——灰楼、图书馆、宿舍区，在雪地里像一幅画。"
],options:[
{t:"咬牙跑完全程",check:{a:"CON",sk:"athletic",label:"长跑"},tier:{
 ok:["你咬着牙，一步一步捱过最后几里。冲线的时候，腿都不是自己的了。戈拉教官难得点了点头：“不错，能跑完全程的，都不孬。”","你瘫在雪地上，大口喘气。天很蓝，雪很白，你累得想笑。"],
 fail:["你跑到三分之二，实在跑不动了，在路边坐下来。洛卡跑回来拉你：“行了，走也得走完！”他架着你，走完了剩下的路。"],
 crit:["你不仅跑完全程，还是前五名。戈拉教官把你叫住，上下打量了一眼：“体格不错。明天来演武场，我看看你的底子。”","你心里一喜——戈拉教官主动开口，这是头一遭。"]},
effects:{xp:12},onCrit:{flag:"acad_peer_run"},go:"acad_social_hub"},
{t:"跑一半就溜，回去泡脚",effects:{xp:3},tier:{ok:["你跑到半路，趁没人注意，拐进岔路溜了。回到宿舍，打了热水泡脚，舒服得直叹气。","第二天，洛卡逢人就揭你的底：“他跑一半就溜了！”你瞪他：“我那是保存体力！”"]},go:"acad_social_hub"}
]};
/* ---------- 已有 NPC 深化（8） ---------- */
N["acad_deep_kain_1"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"凯恩今天有点反常——平时嘴上不饶人，今天却安安静静地坐在演武场边上，看着场中央的对练发呆。你走过去，他也没察觉。",
"你在他旁边坐下：“想什么呢？”他回过神，苦笑了一下：“昨天家里来信了。我爹……让我毕业了回家继承铁匠铺。”他顿了顿，“他把我当接班人，可我压根没想过打铁。”",
"他抓了抓头发：“你说，我要是跟他说，我想去北边从军，他会不会气得打断我的腿？”"
],options:[
{t:"认真帮他琢磨",check:{a:"CHA",sk:"persu",label:"劝说"},tier:{
 ok:["你说：“你爹让你打铁，是因为他只会打铁，觉得那是安稳。你跟他好好说，你在学院学了打仗的本事，从军能挣功名，比打铁有出息。”凯恩沉默了一会儿：“……要是我说不通呢？”你说：“那就先干出点名堂，再回去跟他说。”","他听完，忽然笑了：“行，听你的。”"],
 fail:["你劝了几句，凯恩摇摇头：“你说得容易。我爹那脾气，认死理。”他叹了口气，没再说话。"],
 crit:["你陪他演了一出“戏”——你假装他爹，让他练习怎么开口。他练了三遍，从结结巴巴练到理直气壮。最后他站起来，握拳：“成了！我回去就这么说！”","后来，他真的这么干了。"]},
effects:{xp:12},relation:{npc:"acad_kain",v:10},onCrit:{flag:"acad_kain_army"},go:"acad_deep_kain_2"},
{t:"跟他开玩笑，冲淡愁云",effects:{xp:5},relation:{npc:"acad_kain",v:5},tier:{ok:["你笑着说：“打断腿怕什么，反正你将来要当将军，坐轮椅也能指挥。”凯恩笑骂：“滚！”但他心情明显好了一些。","他站起来：“走，陪我打一场，出出汗。”"]},go:"acad_deep_kain_2"}
]};
N["acad_deep_kain_2"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"几天后，凯恩来找你，难得一脸郑重：“我跟我爹说开了。他说——”他顿了顿，脸上浮起一丝笑，“他说，要是真能从军挣个前程，就随我。但要是混不出名堂，就回去打铁，不许挑。”",
"他看着你，眼睛亮亮的：“我答应他了。我凯恩要么在战场上挣个功名，要么回家打铁——两头，总得成一头。”",
"他伸出拳头：“你是第一个听我说这事的人。这份情，我记着。”"
],options:[
{t:"跟他碰拳，说句实在话",effects:{xp:8,relation:{npc:"acad_kain",v:10}},tier:{ok:["你跟他碰了碰拳：“你行的。到时候你从军，我给你当军师。”凯恩哈哈大笑：“那可说定了！你可别到时候跑去西境，让我一个人冲锋。”","演武场的风很大，但你的心是热的。"]},go:"acad_social_hub"},
{t:"泼他一句冷水，然后鼓励他",effects:{xp:6,relation:{npc:"acad_kain",v:5}},tier:{ok:["你说：“军功没那么好挣。北境的仗，一场比一场狠。”凯恩点头：“我知道。”你顿了顿，“但你既然下了决心，就干到底。”","他笑了：“就等你这句话。”"]},go:"acad_social_hub"}
]};
N["acad_deep_ata_1"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"阿塔坐在天井的老槐树下，手里攥着那枚狼骨，看着北边的方向发呆。你走过去，他也没回头，只是说：“草原的春天，这时候该来了。”",
"他声音很轻：“以前这时候，阿爸会带着我骑马去河边，看草长出来。他说，草绿了，狼就回来了。”他顿了顿，“今年，狼还回不回来，我不知道。”",
"他攥紧狼骨：“我想回家。可我又怕回家。”"
],options:[
{t:"在他旁边坐下，陪着",effects:{xp:8,relation:{npc:"acad_ata",v:10}},tier:{ok:["你没有说话，只是在他旁边坐下。老槐树的影子在你们身上缓缓移动。","过了很久，阿塔开口：“……谢了。草原人，不说话的时候，就是最大的情分。”"]},go:"acad_deep_ata_2"},
{t:"问他：怕什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["阿塔沉默了很久：“怕回去，发现草原不是我想的那个草原了。”他顿了顿，“阿爸没了，草场分了，兄弟散了。我回去，能干什么？”","你说：“回去看看，至少知道哪里变了。”他想了很久：“……你说得对。”"],
 fail:["阿塔摇摇头：“说不清。就是……怕。”他垂下头，你也不知道该怎么接。"],
 crit:["你问他：“你阿爸走之前，有没有跟你说过什么？”阿塔想了想：“他说……‘草原上的狼，死在雪地里，不让人看见。’”他顿了顿，“他还说，‘阿塔，你不一样。你眼睛里有火。’”","“眼睛里有火。”你重复了一遍，“你阿爸没看错。”"]},
effects:{xp:12},relation:{npc:"acad_ata",v:8},onCrit:{flag:"acad_ata_fire"},go:"acad_deep_ata_2"}
]};
N["acad_deep_ata_2"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"那天之后，阿塔又恢复了平时的样子——话不多，但该练的武一天没落。只是你注意到，他随身带着一枚新刻的木哨，刻的是狼头的形状。",
"他见你看那哨子，主动说：“草原的规矩，狼群散了，要重新吹哨，把大家聚起来。”他顿了顿，“我刻这个，是提醒自己——散了的，还能再聚。”",
"他难得地笑了一下：“等我毕业，我要回草原，把哨子吹响。”"
],options:[
{t:"支持他：到时候我给你写信",effects:{xp:8,relation:{npc:"acad_ata",v:10}},tier:{ok:["你说：“行。你回草原吹哨，我写信给你报信。北边有什么事，我帮你看着。”阿塔点头：“好。草原的信，走西境商道，三个月能到。”","他说这话时，眼睛里有光。"]},go:"acad_social_hub"},
{t:"逗他：你那哨子吹得响吗",effects:{xp:5,relation:{npc:"acad_ata",v:5}},tier:{ok:["你笑着说：“先吹一个我听听，别到时候把狼招来了。”阿塔也不恼，把哨子放进嘴里，吹了一声——清亮悠长，像草原上的风。","你竖起大拇指：“行，够响。”"]},go:"acad_social_hub"}
]};
N["acad_deep_alice_1"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"艾莉丝坐在图书馆的角落，桌上摊着一本厚书，旁边还摞着三四本。她眉头微蹙，指尖在书页上慢慢划过，嘴里无声地念着什么。",
"你走过去，她抬头看见你，眼睛一亮：“来得正好！你帮我看看这个——”她指着书页上一段古沙漠文，“这段说‘沙下之井，勿饮’，可我查了另一本书，写的是‘沙下之泉，可饮’。到底哪个对？”",
"她有些懊恼：“两本书，两个说法。我怕记错了，误了事。”"
],options:[
{t:"帮她比对两个版本",check:{a:"INT",sk:"lore",label:"考据"},tier:{
 ok:["你仔细比对了两段文字，发现是抄写年代不同：古本是“勿饮”，后世抄本漏了一个否定符号，变成了“可饮”。你跟艾莉丝解释清楚，她恍然大悟，立刻在书页边角注了一笔：“以古本为准。”","她郑重地跟你道谢：“这条要是记错了，真要误事。”"],
 fail:["你也拿不准：“这个……我也不好说。要不你再多查几本？”艾莉丝点点头：“也好。我再翻翻。”"],
 crit:["你不仅辨清了正误，还从罗先生笔记里翻出一条旁证：三十年前，有支探险队因误饮“沙下之泉”全军覆没。艾莉丝听完，脸色白了白：“……幸好你记得。”","她看着你：“你记性真好。以后我考据，都来问你。”"]},
effects:{xp:12},relation:{npc:"acad_alice",v:8},onCrit:{flag:"acad_alice_lore"},go:"acad_deep_alice_2"},
{t:"建议她：以古本为准",effects:{xp:5},tier:{ok:["你说：“抄本越老越可信。古本写‘勿饮’，你就按‘勿饮’记。”艾莉丝点头：“有道理。我记下了。”","她低头继续翻书，你也不打扰她，各自忙各自的。"]},go:"acad_deep_alice_2"}
]};
N["acad_deep_alice_2"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"艾莉丝合上书，忽然问你：“你毕业之后，打算去哪儿？”",
"你没想过会被她这么直白地问，愣了一下。她看着你，认真地说：“我打算去沙漠古城，把那批旧档整理出来。沙漠里的文明，快被人忘光了。”她顿了顿，“我想去把它们记下来。”",
"她说这话时，眼睛里有种特别的光。"
],options:[
{t:"支持她：那是件值得做的事",effects:{xp:8,relation:{npc:"acad_alice",v:10}},tier:{ok:["你说：“沙漠古城的事，我听过一些——进得去的人不多。你要是去，注意安全。”艾莉丝笑了：“我知道。我会做好准备。”她顿了顿，“到时候，我写的考据，第一个给你看。”","你点头：“一言为定。”"]},go:"acad_social_hub"},
{t:"劝她：沙漠危险，别轻易去",effects:{xp:5},tier:{ok:["你提醒她：“沙漠古城，进去的人十个回来两三个。你一个女孩子……”话没说完，艾莉丝就打断你：“正因为去的人少，才要有人去。”她看着你，目光坚定，“我不怕。”","你张了张嘴，没再劝。"]},go:"acad_social_hub"}
]};
N["acad_deep_loka_1"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"洛卡今天居然没抢食堂的炖肉——他坐在角落里，对着面前一碗凉掉的粥发呆。这太反常了。你在他对面坐下：“怎么，肉被抢光了？”",
"他摇摇头，难得没贫嘴：“我姐来信了。她说，家里的铺子被人挤兑，快撑不下去了。”他顿了顿，“我爹欠了一屁股债，我姐说，让我别念了，回去帮忙。”",
"他扯了扯嘴角：“我说好。然后发现，我压根不想回去。”"
],options:[
{t:"认真问他：你自己想干什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["洛卡想了很久：“我想开一家自己的铺子——不卖杂货，卖北境的土产。药材、矿石、毛皮，运到南方去卖。”他说这话时，声音不大，但很稳，“我姐觉得我异想天开。但我真的想过很多次。”","你说：“那就跟她说清楚。你是她弟弟，她会听的。”"],
 fail:["洛卡摇摇头：“我自己都还没想明白。走一步看一步吧。”"],
 crit:["你不仅问了，还跟他一起算了笔账：北境土产在南方的行情、运费、本钱。洛卡越算眼睛越亮：“……这买卖，能成！”他抬头看你，“你怎么什么都知道？”你笑了笑：“跑过腿，听过价。”"]},
effects:{xp:12},relation:{npc:"acad_loka",v:8},onCrit:{flag:"acad_loka_trade"},go:"acad_deep_loka_2"},
{t:"先陪他坐一会儿，不说话",effects:{xp:5},relation:{npc:"acad_loka",v:5},tier:{ok:["你没有说话，只是坐着。洛卡盯着那碗粥看了一会儿，忽然说：“谢了。”他没解释谢什么，但你懂。","过了一会儿，他端起粥，几口喝完了。"]},go:"acad_deep_loka_2"}
]};
N["acad_deep_loka_2"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"一周后，洛卡来找你，难得一脸正经：“我跟家里说好了。铺子的事，我姐先顶着；我毕业前，想办法挣一笔钱寄回去，帮她周转。”他顿了顿，“要是我挣不到——”",
"他咧嘴一笑：“我就回去当个卖货郎，天天走街串巷，把北境的土产卖遍全大陆。”",
"你看着他，觉得这人虽然贫嘴，但骨子里有股韧劲。"
],options:[
{t:"支持他：到时候我给你搭把手",effects:{xp:8,relation:{npc:"acad_loka",v:10}},tier:{ok:["你说：“行。你要是真做土产生意，我在北境替你留意行情，写信告诉你。”洛卡眼睛一亮：“那可说好了！我挣了钱，分你一成！”","你笑着摆手：“一成太多，请顿饭就行。”","他哈哈大笑：“成交！”"]},go:"acad_social_hub"},
{t:"提醒他：别把学业丢了",effects:{xp:5},tier:{ok:["你提醒他：“挣钱归挣钱，学业别丢。学院的名头，将来做生意也用得上。”洛卡点头：“放心，我心里有数。”","他顿了顿，“我洛卡虽然贫嘴，但该做的事，一件不落。”"]},go:"acad_social_hub"}
]};
/* ---------- 五人小队（5） ---------- */
N["acad_squad_1"]={tag:"main",place:"艾尔达魔法学院 · 教务处",pace:"normal",text:[
"教务处的告示栏上，贴出一张新告示：“北境勘察任务：白桦镇以东三十里，有旧矿洞群，需勘察塌方情况，绘制新图。报酬：每人十个银月。限五人一组，三日往返。”",
"你正看着，凯恩从后面拍你肩膀：“组队不？我、你、阿塔、艾莉丝，再叫上小柯——他识图。五个人，正好。”",
"你扫了一眼告示上的“旧矿洞群”三个字，心里莫名一动：“走。”"
],options:[
{t:"答应组队",effects:{xp:8,flag:"acad_squad_formed"},tier:{ok:["你点头答应。凯恩咧嘴一笑：“我就知道你会来！”他转身去招呼其他人，“明天出发，带足干粮！”","你看着他的背影，忽然觉得，有个队伍的感觉，不赖。"]},go:"acad_squad_2"},
{t:"犹豫：旧矿洞听着不太平",effects:{xp:4},tier:{ok:["你犹豫了一下：“旧矿洞……听着不太平。”凯恩说：“所以才要五人一组啊。怕什么，出了事，有我顶着！”","你被他逗笑了：“行，算你一个。”"]},go:"acad_squad_2"}
]};
N["acad_squad_2"]={tag:"main",place:"白桦镇以东 · 旧矿洞群",pace:"normal",text:[
"旧矿洞在白桦镇以东的山谷里，洞口塌了一半，剩下的半截黑洞洞的，往里走几步，就有股潮气扑上来。",
"小柯蹲在洞口，借着光画图，一边画一边嘀咕：“主洞塌了三分之二，但东侧有条支洞，像是通的。”阿塔伸手在洞壁上摸了一把，凑到鼻子前闻了闻：“潮气重，但没毒。”",
"凯恩打头，你殿后，五个人排成一列，慢慢往洞里走。火把的光在洞壁上晃动，石壁上映出五条长长的人影。"
],options:[
{t:"跟着队伍往里走",effects:{xp:6},tier:{ok:["你们走了小半个时辰，来到支洞尽头。这里塌了一角，露出一个向下的斜坡，黑黢黢的。小柯趴在边上往下看：“下面还有一层。”","五个人交换了一下眼神。"]},go:"acad_squad_3"},
{t:"提醒大家注意脚下",check:{a:"AGI",sk:"detect",label:"警戒"},tier:{
 ok:["你注意到洞壁上有些新鲜的划痕——不是矿镐留下的，像是某种爪子。你提醒大家放轻脚步。艾莉丝压低嗓门：“这痕迹……不像动物。”","气氛一下子紧了。"],
 fail:["你喊了一声“小心脚下”，但洞里回声大，把话吞了一半。好在没人踩到什么。"],
 crit:["你不仅发现了划痕，还注意到地面有拖行的痕迹——像是有什么东西被拖进深处。你蹲下来比了比，那痕迹比人宽。"]
 },
 effects:{xp:10},onCrit:{flag:"acad_squad_drag"},go:"acad_squad_3"}
]};
N["acad_squad_3"]={tag:"main",place:"旧矿洞 · 下层",pace:"normal",text:[
"你们顺着斜坡下到第二层。这一层的洞壁平整得多，像是被人修整过——角落里甚至摆着几口旧木箱，箱盖落着厚厚的灰。",
"凯恩用刀挑开一口箱子，里面是生锈的矿镐和绳子，还有一本泡了水的账本，字迹已经糊了。小柯翻了几页：“……这是矿队的账本，记的是三十年前的进出货。”他顿了顿，“三十年前，这里应该还在开采。”",
"阿塔蹲在洞壁前，忽然说：“这里——有字。”火把照过去，洞壁上刻着一行字，笔画粗粝：“矿底有东西。别挖了。来不及了。——刘矿头”"
],options:[
{t:"把洞壁上的字抄下来",effects:{xp:10,flag:"acad_squad_inscription"},tier:{ok:["你借小柯的炭笔，把那行字描了下来。艾莉丝凑过来看：“‘矿底有东西’……三十年前，这里到底出了什么事？”","没有人能回答。洞里的潮气，似乎更重了。"]},go:"acad_squad_4"},
{t:"撬开另一口箱子看看",check:{a:"AGI",sk:"stealth",label:"探查"},tier:{
 ok:["你撬开另一口箱子，里面是一个铁皮盒，锁着。你用力掰开，里面是一面小铜牌——样式陌生，但刻着的印记，你认得：那是‘第七节点’的旧标记。"],
 fail:["箱子锈死了，你弄了半天没撬开，只好作罢。"],
 crit:["铁皮盒里除了铜牌，还有一张卷起的羊皮纸，展开，是一幅矿洞全图——比小柯现画的详细得多。图上最深的一层，画着一个圆圈，标注着：“第七节点·备用锚位。”","你心里一跳：第七节点，在矿洞底下？"]},
effects:{xp:15},onCrit:{flag:"acad_squad_anchor"},go:"acad_squad_4"}
]};
N["acad_squad_4"]={tag:"main",place:"旧矿洞 · 下层",pace:"normal",text:[
"就在你们查看箱子时，支洞深处忽然传来一声闷响——像什么重物倒地。五个人同时僵住。",
"凯恩握紧刀，把声音压到极低：“我走前面。你们跟上。”阿塔护住艾莉丝和小柯，你殿后。五个人贴着洞壁，一步一步往声音传来的方向摸去。",
"拐过一道弯，火光照见——塌方。一整面洞壁塌了下来，堵死了去路。塌方边缘的石头，是新鲜的，还带着潮气。但你们刚才进来时，这条路明明是通的。"
],options:[
{t:"蹲下检查塌方边缘",check:{a:"INT",sk:"lore",label:"勘查"},tier:{
 ok:["你蹲下来看，塌方的石块边缘，有极细的刻痕——不是塌方自然形成的，像是被什么东西，从里面推倒的。你把手贴在石壁上，感觉到一丝极轻的震动，像心跳。"],
 fail:["你看了看，没看出什么名堂，只觉得这塌方来得蹊跷。"],
 crit:["你注意到塌方边缘的刻痕，和你之前在铁门关第三哨箭楼地基里见到的，一模一样。你压着嗓子：“这不是塌方。是有什么东西，从里面把墙推倒了。”","洞里安静了一瞬。五个人，都没说话。"]},
effects:{xp:15},onCrit:{flag:"acad_squad_wall"},go:"acad_squad_5"},
{t:"建议原路返回",effects:{xp:6},tier:{ok:["你当机立断：“撤。今天先到这儿，图已经画得差不多了。”凯恩看了你一眼，点头：“撤。”","五个人原路退回，走到洞口时，天已经黑了。你回头看了一眼黑洞洞的矿洞——里面有什么，在等。"]},go:"acad_squad_5"}
]};
N["acad_squad_5"]={tag:"main",place:"白桦镇 · 驿站",pace:"normal",text:[
"回程的路上，五个人都很沉默。直到在驿站歇脚，喝上热汤，气氛才松下来。",
"凯恩率先开口：“那矿洞底下，肯定有东西。今天这事，咱们回去得跟教务处报一声。”阿塔点头：“那个洞，不能让人随便进了。”",
"小柯推了推眼镜：“我把今天画的地图，加一份备注——‘下层疑似有活物活动，暂不建议深入’。”艾莉丝也点头：“我把那行字和铜牌的事，写进报告。”",
"凯恩看向你：“你呢？”你想了想：“我把那面铜牌……收好。它也许有用。”"
],options:[
{t:"把铜牌和羊皮图收好，回学院报备",effects:{xp:12,flag:"acad_squad_report"},tier:{ok:["你回到学院，把铜牌和羊皮图收好，又写了一份简要报告，交到教务处。执事看完，皱了皱眉：“旧矿洞……我记下了。会派人封起来。”","他顿了顿，看了你一眼，“你那个铜牌，方便给我看看吗？”你犹豫了一下，还是给了他。他看了很久，还给你：“收好。别丢了。”"]},go:"acad_social_hub"},
{t:"只把报告交了，铜牌自己留着",effects:{xp:10,flag:"acad_squad_kept"},tier:{ok:["你把报告交了，但铜牌的事，只字未提。","那面铜牌上的印记，你认得。有些东西，知道的人越少越好。"]},go:"acad_social_hub"}
]};
/* ---------- 图书馆缘（4） ---------- */
N["acad_library_1"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"图书馆的夜，最安静。三楼靠窗的位置，是你的固定座位——那里能看见灰楼的尖顶，还有窗外那棵老槐树的树冠。",
"你坐下，从书架上抽出一本《北境矿脉志》，翻到旧矿洞那一章。书上记载，那一片矿洞群，三十年前因“矿难”停产，死了四十多人。官方记载是“塌方事故”。",
"你合上书，想起矿洞壁上那行字：“矿底有东西。别挖了。来不及了。”官方记载和矿工遗言，对不上。"
],options:[
{t:"去查三十年前报纸的旧档",check:{a:"INT",sk:"lore",label:"查阅"},tier:{
 ok:["你在旧报档里翻了半天，找到一条豆腐块大小的新闻：“北境矿难后续：矿主赔偿死者家属，每人十五银月。矿洞永久封闭。”新闻下面还有一行小字：“据传，矿难前夜，有矿工目睹‘洞底白光’，疑为矿灯折射。”","“洞底白光”——你记下了。" ],
 fail:["你翻了半天，只找到官方记载，没有更多细节。三十年前的矿难，像是被人刻意抹平了。"],
 crit:["你不仅找到那条新闻，还发现报档里夹着一张旧照片——矿洞口的合影，几十个矿工站在洞口，最前排蹲着一个络腮胡汉子，胸前挂着一块铜牌。你凑近看，那铜牌上的印记……和你在矿洞铁皮盒里找到的，一模一样。"]},
effects:{xp:12},onCrit:{flag:"acad_library_photo"},go:"acad_library_2"},
{t:"把书放回去，先回去睡",effects:{xp:4},tier:{ok:["你把书放回书架，揉了揉眼睛。矿难的事，明天再说。","你走出图书馆时，回头看了一眼三楼那排书架——旧报档的影子，在灯光下显得格外安静。"]},go:"acad_library_2"}
]};
N["acad_library_2"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你在图书馆二楼的一本旧书里，发现一封夹着的信。信纸泛黄，字迹工整，落款是“刘矿头”——就是刻“别挖了”那个矿头。",
"信是写给“学院罗先生”的，只有短短几行：“罗兄：矿底的事，我按你说的压下去了。那东西还在，但暂时没动静。铜牌我留了一块，给你做记。若我出不来，你替我看着点。刘。”",
"你握着这封信，手有些发凉。刘矿头写给罗先生的信——而罗先生，就在楼下当图书管理员。"
],options:[
{t:"把信收好，去找罗先生求证",check:{a:"CHA",sk:"persu",label:"求证"},tier:{
 ok:["你把信拿给罗先生看。他接过信纸，手抖了一下：“……这是刘矿头的手书。”他沉默了很久，“三十年前，矿难之前，他来过学院，找老院长。他说，矿底挖到了‘不该挖的东西’。”他顿了顿，“老院长让他封矿。他照做了。后来，矿难还是发生了。”","罗先生看着你：“那面铜牌，你收好了？”你点头。他说：“收好。那是刘矿头留给你的——也是留给‘点火者’的。”"],
 fail:["罗先生看了一眼信，脸色变了变，却只说：“这是旧事。你一个学生，不必深究。”他把信还给你，“收好吧。”"],
 crit:["罗先生看完信，沉默良久，从柜底翻出一个旧木盒，打开，里面是另一面铜牌——和刘矿头给你那面，一模一样。“这是他当年留给我的。”他顿了顿，“两面铜牌，本是一对。一面护矿，一面护学院。”","他看向你：“你既然找到了信，又找到了铜牌，那这两样东西，都该归你。”他把木盒推到你面前。"]},
effects:{xp:18},onCrit:{flag:"acad_library_pair"},go:"acad_library_3"},
{t:"把信放回书里，不惊动罗先生",effects:{xp:6},tier:{ok:["你犹豫了一下，把信夹回书里，放回原处。","刘矿头、罗先生、矿难——这些线缠在一起，你还没理清楚。但你知道，理清楚之前，不该打草惊蛇。"]},go:"acad_library_3"}
]};
N["acad_library_3"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"罗先生今天破例，带你进了图书馆的地下室——那里堆着学院几代人积攒的旧物。他点了一盏油灯，在角落里翻出一个落了灰的木箱：“这是刘矿头当年寄存在学院的。”",
"木箱里，是刘矿头的遗物：一顶旧矿帽、一把矿镐、一本工整的记账本。账本最后一页，夹着一张纸条，字迹与信上相同：“矿底的‘东西’，我压住了，但压不久。若有一天压不住，让学院的人，往北走。第七节点的灯，要有人点。”",
"罗先生吹了吹纸条上的灰，看向你：“他说的是‘第七节点’。三十年前，他就知道那个地方了。”"
],options:[
{t:"把纸条抄一份收好",effects:{xp:12,flag:"acad_library_liu_note"},tier:{ok:["你借了纸笔，把纸条的内容抄了一遍，收进贴身衣袋。原纸条，罗先生收回了木箱。","“第七节点的灯，要有人点。”——这句话，你听第三遍了。"]},go:"acad_library_4"},
{t:"问罗先生：当年刘矿头还说过什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["罗先生想了想：“他说，矿底那东西，‘是活的’。它被锚钉住了，但锚在松动。他还说，钉锚的人，会回来。”他顿了顿，“他说的是‘点火者’。”"],
 fail:["罗先生摇摇头：“他就说过这些。其他的，他带进棺材里了。”"],
 crit:["罗先生话声放轻：“有一回，他说了句很奇怪的话——‘矿底的东西，跟学院灰楼底下的，是一路的。’”他顿了顿，“我那时候不信。现在……”他没有说下去。"]},
effects:{xp:15},onCrit:{flag:"acad_library_one_road"},go:"acad_library_4"}
]};
N["acad_library_4"]={tag:"main",place:"艾尔达魔法学院 · 图书馆",pace:"normal",text:[
"你离开地下室时，罗先生叫住你：“等等。”他从怀里摸出一本书，封皮磨得发白：“这是我年轻时抄的《北境旧闻录》，里面记了一些‘不该记的事’。你拿去翻翻。”",
"他顿了顿：“有些事，课本上不讲，但地上发生过。你既然走到了这一步，就该知道。”",
"你接过书，沉甸甸的。罗先生又补了一句：“看完，不用还我。但别让第二个人看见。”"
],options:[
{t:"谢过罗先生，把书收好",effects:{xp:10,flag:"acad_library_book",item:"《北境旧闻录》"},tier:{ok:["你郑重道谢，把书收进行囊。","这本书，也许比图书馆任何一本教材都值钱。"]},go:"acad_social_hub"},
{t:"当着他的面翻几页",effects:{xp:8},tier:{ok:["你翻开书皮，扉页上写着一行字：“所见即所记，所记即所惧。”你抬头看罗先生，他已经转身走了。","你合上书，把它收好。"]},go:"acad_social_hub"}
]};
/* ---------- 食堂江湖（4） ---------- */
N["acad_canteen_1"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"食堂的窗口，今天多了一道菜：北境乱炖——萝卜、土豆、肉块、干蘑菇，一锅烩。打饭的师傅拿大勺一搅，香气直往鼻子里钻。",
"你排在队伍里，前面是洛卡。他回头冲你咧嘴：“今天这锅，我闻着至少有半斤肉！”他压低嗓门，“我打算打两份。你要不要？我帮你带。”",
"你正要答应，窗口里的师傅敲了敲勺：“每人限一份！别想藏私！”队伍里一片哀嚎。"
],options:[
{t:"跟师傅套近乎，多要半勺",check:{a:"CHA",sk:"persu",label:"套话"},tier:{
 ok:["你笑眯眯地跟师傅聊了两句老家的事，又夸他炖肉的手艺。师傅被你哄得高兴，手一抖，多舀了半勺：“小滑头，下不为例！”","你端着满满一餐盘，心满意足。"],
 fail:["师傅不为所动，公事公办地舀了一勺：“一人一份。”你讪讪地端着餐盘走了。"],
 crit:["你不仅多要了半勺，还跟师傅混了个脸熟。师傅拍拍你的肩：“小伙子嘴甜，下次来，我给你留块带筋的！”","洛卡在旁边看得眼睛都直了：“你是怎么做到的？”你故作高深：“这是手艺。”"]},
effects:{xp:8},onCrit:{flag:"acad_canteen_favor"},go:"acad_canteen_2"},
{t:"老老实实排队，打一份",effects:{xp:4},tier:{ok:["你老老实实排队，打了一份。师傅舀得满满当当，倒也实在。","你端着餐盘找座位，一抬头，看见阿塔已经占好了位置，正冲你招手。"]},go:"acad_canteen_2"}
]};
N["acad_canteen_2"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"你端着餐盘坐下，阿塔把自己碗里的肉块拨了一半给你：“我吃不了这么多。”你还没来得及推辞，洛卡已经把自己的餐盘凑过来：“他不要，我要！”阿塔瞪了他一眼：“你做梦。”",
"饭桌上一片笑声。凯恩端着汤过来，挤进座位：“聊什么呢，这么热闹？”洛卡抢着说：“在说阿塔偏心，肉只给别人不给我！”凯恩哈哈大笑：“你那张嘴，配吃肉吗？”",
"你低头扒饭，嘴角翘着。这顿饭，比窗外的太阳还热乎。"
],options:[
{t:"把自己碗里的肉分给阿塔",effects:{xp:6,relation:{npc:"acad_ata",v:5}},tier:{ok:["你把碗里的肉夹回阿塔碗里：“我吃不了这么多，你帮我吃。”阿塔愣了一下，低头扒饭，闷声说：“……谢了。”","洛卡在旁边起哄：“哎哟，还礼尚往来呢！”你一脚踹过去：“吃你的饭！”"]},go:"acad_canteen_3"},
{t:"不接话，专心干饭",effects:{xp:4},tier:{ok:["你专心对付碗里的炖肉。北境的冬天长，食堂的饭，是一天里最值得期待的事。","你吃完，把餐盘送回窗口。师傅看了你一眼：“吃饱了？年轻人，多吃点，长身体。”"]},go:"acad_canteen_3"}
]};
N["acad_canteen_3"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"晚饭后，你正要离开食堂，被一个低年级学生拦住：“学长！听说你是符文系的？”你点头。他搓着手：“我有一块石头，上面有字，看不懂。你能帮我看看吗？”",
"他从怀里掏出一块巴掌大的卵石，表面刻着几道歪歪扭扭的线条。你接过来一看——不是符文，是小孩刻的涂鸦，画着太阳、房子，还有两个人手拉手。",
"你抬起头，看着那个学生紧张的脸，把石头还给他：“这是符文的雏形。意思是——‘家’。”他愣住，然后咧嘴笑了：“真的？那我爹娘肯定会高兴！”他宝贝似的把石头揣回怀里，跑了。",
"你站在食堂门口，看着他的背影。有些“符文”，比真符文值钱。"
],options:[
{t:"目送他跑远，心里有点暖",effects:{xp:6},tier:{ok:["你看着那孩子跑远的背影，忽然想起自己刚入学时的样子。","那时候，你也揣着一块刻着字的石头。"]},go:"acad_canteen_4"},
{t:"跟旁边的同学说：那孩子以后是个人才",effects:{xp:5},tier:{ok:["你对旁边的同学说：“那孩子，以后说不定是个好符文师。”同学点头：“看他那眼神，是块料子。”","你们相视一笑。"]},go:"acad_canteen_4"}
]};
N["acad_canteen_4"]={tag:"main",place:"艾尔达魔法学院 · 食堂",pace:"normal",text:[
"深夜的食堂，只有后厨还亮着灯。你因为赶一份课业，错过了晚饭，正饿得肚子咕咕叫。",
"你摸到后厨门口，探头一看——打饭的师傅正坐在灶台边，就着一盏油灯，翻一本泛黄的菜谱。他听见动静，头也不抬：“饿了？”",
"你不好意思地点头。师傅哼了一声，起身，从锅里舀出一碗热汤，又掰了半块黑面包：“坐下吃。年轻人，饿着肚子读书，脑子会锈。”"
],options:[
{t:"坐下，把汤和面包吃了",effects:{xp:6,relation:{npc:"acad_cook",v:8}},tier:{ok:["你坐在灶台边，呼噜呼噜喝完汤，又啃完面包。师傅又给你添了一勺汤：“慢点，别噎着。”","你抹了抹嘴，认真道谢。师傅摆摆手：“谢什么。我儿子也在外头念书，我盼着也有人能给他一口热汤。”"]},go:"acad_social_hub"},
{t:"谢过师傅，端着汤回宿舍喝",effects:{xp:5},tier:{ok:["你端着热汤，摸黑走回宿舍。路上，风很大，但汤是热的。","你推开门，阿岩还没睡，看见你手里的碗：“食堂还有汤？”你分了他一半。"]},go:"acad_social_hub"}
]};
/* ---------- 学院节日（4） ---------- */
N["acad_festival_1"]={tag:"main",place:"艾尔达魔法学院 · 礼堂",pace:"normal",text:[
"冬至夜，学院照例办“守岁宴”。礼堂里挂满松枝和红布条，长桌拼成几排，上面摆着热腾腾的菜。学生们三五成群，说笑打闹。",
"特蕾莎嬷嬷站在门口，挨个发红绳：“系在手腕上。北境的规矩，冬至系红绳，来年无病无灾。”你接过红绳，系在左手腕上。",
"礼堂中央，一个高年级学生正弹着一种北境的古琴，曲子悠扬。有人跟着唱，有人跟着拍手。你端着杯子站在人群里，看着这满堂灯火，忽然觉得，冬天也没那么难熬。"
],options:[
{t:"找熟人们坐一桌",effects:{xp:6},tier:{ok:["你端着杯子，挤到凯恩他们那桌。桌上已经摆满了菜，洛卡正跟阿塔抢最后一块烤肉。你坐下，凯恩给你倒了一杯热酒：“冬至快乐！”","一群人的杯子碰在一起，叮当响。"]},go:"acad_festival_2"},
{t:"找个安静的角落，看热闹",effects:{xp:4},tier:{ok:["你端着杯子，靠在一根柱子边，看满堂热闹。有人过来给你递了块点心：“同学，尝尝，我娘寄的。”你道谢接过。","北境的冬至夜，冷在外面，热在里面。"]},go:"acad_festival_2"}
]};
N["acad_festival_2"]={tag:"main",place:"艾尔达魔法学院 · 礼堂",pace:"normal",text:[
"守岁宴过半，特蕾莎嬷嬷上台，说了一个老规矩：“冬至夜，许一个愿，写在纸上，塞进壁炉。来年冬至，谁还记得，谁的心愿就灵。”",
"学生们纷纷找纸笔。有人写“考试全过”，有人写“家里人平安”，有人写“来年吃不完的肉”。你握着笔，想了一会儿，写下：",
"“愿北境的雪，年年化；愿第七节点的灯，有人点。”你折好纸，走到壁炉前。火舌舔着纸边，很快把它吞没。"
],options:[
{t:"看着纸条烧尽",effects:{xp:8,flag:"acad_festival_wish"},tier:{ok:["纸条在火里蜷曲、发黑、化成灰烬。你看着那团火，心里那盏灯，仿佛也亮了一分。","旁边有人问你写了什么。你笑了笑：“一个愿望。”"]},go:"acad_festival_3"},
{t:"写一句更实在的愿望",effects:{xp:5},tier:{ok:["你重新写了一张：“愿爹娘身体好，愿我能护住身边人。”你把纸折好，投进壁炉。","火苗跳了跳，像在点头。"]},go:"acad_festival_3"}
]};
N["acad_festival_3"]={tag:"main",place:"艾尔达魔法学院 · 山门外",pace:"normal",text:[
"春祭，学院组织全体学生去山门外放河灯。北境没有大河，只有一条冻了半年的溪——开春化了，溪水裹着碎冰，哗哗往下淌。",
"学生们把一盏盏小纸灯放进水里。纸灯摇摇晃晃，顺流而下，汇成一条光带。有人许愿，有人发呆，有人在偷偷抹眼睛。",
"阿塔放下一盏灯，对着溪水说了一句草原话。你听不懂，但看他站了很久。"
],options:[
{t:"问他那句话说的是什么",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["阿塔沉默了一会儿：“草原话，意思是——‘愿逝者安息，愿生者长明。’”他看着溪水里的灯，“我阿爸不信这些，但我想给他放一盏。”","你点了点头，也放下一盏灯。"],
 fail:["阿塔摇摇头：“没什么。”他不想说，你也不追问。"],
 crit:["阿塔说：“我阿爸说过，草原的河灯，是给迷路的魂照路的。”他顿了顿，“第七节点要是真有迷路的魂，也该有人照路。”","你心里一动——他也想到了第七节点。"]},
effects:{xp:10},onCrit:{flag:"acad_festival_lamp"},go:"acad_festival_4"},
{t:"也放一盏灯，许个愿",effects:{xp:5},tier:{ok:["你也折了一盏纸灯，放进溪水。灯顺流而下，很快汇进那条光带里。","你看着它漂远，心里说：“愿它漂到该去的地方。”"]},go:"acad_festival_4"}
]};
N["acad_festival_4"]={tag:"main",place:"艾尔达魔法学院 · 宿舍天井",pace:"normal",text:[
"毕业前夜，学院破例没熄灯。学生们坐在天井里，围着那棵老槐树，有一搭没一搭地聊天。",
"有人问：“毕业了，你们打算去哪儿？”有人答“回家”，有人答“去南方”，有人答“没想好”。轮到凯恩，他想了想：“先回家，跟我爹交代一声，然后去北边。”",
"阿塔说：“回草原。”艾莉丝说：“去沙漠。”洛卡说：“先挣一笔钱。”小柯说：“我想留校，跟着罗先生整理旧档。”",
"他们看向你：“你呢？”"
],options:[
{t:"说出你的打算",effects:{xp:8,flag:"acad_festival_plan"},tier:{ok:["你想了想，说：“我先把学院该学的东西学完。然后——去北边。有些灯，要有人去点。”","天井里安静了一瞬。凯恩第一个反应过来，伸出拳头：“算我一个。”阿塔跟着伸手：“草原人，说好了就是一辈子。”","五只手，叠在一起。"]},go:"acad_social_hub"},
{t:"笑笑，说还没想好",effects:{xp:4},tier:{ok:["你笑了笑：“还没想好。走一步看一步吧。”","他们也没追问。毕业前夜的风，很轻，把老槐树的叶子吹得沙沙响。"]},go:"acad_social_hub"}
]};
/* ---------- 同乡会（3） ---------- */
N["acad_hometown_1"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"学院里，有个不成文的规矩：同乡的学生，每月聚一次，互通消息。自由城邦来的学生不多，算上你，一共五个。",
"今天的聚会，在宿舍区的小厨房。有人从家里带了腊肉，有人带了干菜，大家凑在一起，做了一锅“自由城风味”的乱炖。",
"一个学姐边吃边叹气：“我家里来信说，自由城邦最近不太平——商会换了一茬人，李管事发了笔横财，城门口的税官也换了。”她把声音压到极低，“我爹说，有人在大量收‘灰货’。”"
],options:[
{t:"追问‘灰货’的事",check:{a:"CHA",sk:"persu",label:"打听"},tier:{
 ok:["学姐压着嗓子：“我也只是听说。好像是北边运来的，黑灰色粉末，装在大铁箱里。收货的人，出价很高。”她顿了顿，“我爹说，那东西碰不得——碰过的人，手会蜕皮。”","“黑灰色粉末”——你心里一沉，这和独眼汉子说的一模一样。" ],
 fail:["学姐摇头：“我也不清楚。城里的事，传来传去就变味了。”"],
 crit:["学姐凑近，声音更低：“我爹说，收‘灰货’的人，是商会新来的一个管事，姓白。他收的货，都往北边运。”她顿了顿，“运到哪儿，没人知道。”","“姓白”，“往北边运”。你记住了。"]},
effects:{xp:12},onCrit:{flag:"acad_hometown_bai"},go:"acad_hometown_2"},
{t:"只聊家常，不提灰货",effects:{xp:5},tier:{ok:["你顺着话题聊起了家常：谁家的面馆换了老板，谁家嫁了女儿。","一锅乱炖吃得干干净净。临走时，学姐塞给你一包腊肉：“带回去吃。”"]},go:"acad_hometown_2"}
]};
N["acad_hometown_2"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"聚会散后，同乡里那个最小的学弟拉住你，张了张嘴又闭上。你问他怎么了，他犹豫半天，说：“学长……我家里人捎话来，说我爹……欠了商会一笔钱，利滚利，快还不上了。”",
"他低着头：“商会的人说，要是我能帮他们‘办点事’，账可以慢慢还。”他抬起头，眼里都是不安：“学长，你说……我该答应吗？”",
"你看着他，想起自己刚入学时的样子。这个选择，不好答。"
],options:[
{t:"认真劝他：别碰商会的‘事’",check:{a:"CHA",sk:"persu",label:"劝诫"},tier:{
 ok:["你认真地说：“商会的‘事’，没有白办的。你现在欠的是钱，还上就清了；可你一旦答应办‘事’，欠的就是把柄，一辈子还不清。”你顿了顿，“钱的事，咱们一起想办法。‘事’，千万别接。”","他听了，沉默了很久，最后点了点头：“……我听学长的。”"],
 fail:["你劝了几句，但他显然还在犹豫：“可是……我爹的钱……”他低着头，没有答应，也没有拒绝。"],
 crit:["你不仅劝住了他，还帮他想了个办法：学院教务处常年收“北境情报整理”的委托，报酬尚可。你带他去报了名，先挣一笔钱缓一缓。“欠商会的钱，用正经路子还。”你说，“路是人走出来的。”","他攥着报名表，眼眶有点红：“学长，谢谢你。”"]},
effects:{xp:12},onCrit:{flag:"acad_hometown_help"},go:"acad_hometown_3"},
{t:"给他指条路：找教务处的委托",effects:{xp:8},tier:{ok:["你告诉他，教务处有整理北境情报的委托，报酬尚可。他眼睛一亮：“真的？那我明天就去问问！”","你拍拍他的肩：“去吧。记住，别欠人情债。”"]},go:"acad_hometown_3"}
]};
N["acad_hometown_3"]={tag:"main",place:"艾尔达魔法学院 · 宿舍区",pace:"normal",text:[
"一周后，学弟来找你，神清气爽：“学长！我接上教务处那个委托了！干完一单，够还一个月的利息！”他手里攥着几张银票，眼睛亮亮的。",
"他把其中一张塞给你：“学长，这是你的辛苦费——介绍费！”你推回去：“留着。你还完账，请我吃顿饭就行。”",
"他挠着头笑了：“那说好了！等我还完账，请你吃自由城最贵的馆子！”他跑远了，背影都透着轻快。"
],options:[
{t:"看着他的背影，心里踏实",effects:{xp:6},tier:{ok:["你看着他的背影，想起老货郎的话——“路是人走出来的。”","这孩子走对了路。你替他高兴。"]},go:"acad_social_hub"},
{t:"叮嘱他一句：别贪快",effects:{xp:5},tier:{ok:["你追上去叮嘱他：“委托接归接，别贪多。学业要紧。”他回头冲你摆手：“放心吧学长！我心里有数！”","你笑了笑。希望他是真的有数。"]},go:"acad_social_hub"}
]};
/* ---------- 医药学徒（4） ---------- */
N["acad_apothecary_1"]={tag:"main",place:"艾尔达魔法学院 · 药圃",pace:"normal",text:[
"特蕾莎嬷嬷的药圃，在学院南墙根下，一小片向阳的地。她每天清晨来浇水，傍晚来捉虫，把几畦草药伺候得油亮亮的。",
"你路过时，她正蹲在地上给一株止血草松土，抬头看你：“来得正好。帮我递一下那把铲子。”你递过去，她接住，又说：“你这孩子，手稳。要不要跟我学学药草？”",
"她说：“北境的仗，打起来没完。会认药的人，到哪儿都饿不死。”"
],options:[
{t:"答应跟她学药草",effects:{xp:8,flag:"acad_apothecary_start"},tier:{ok:["你点头答应。特蕾莎嬷嬷从腰间的布袋里摸出一把干草：“先认这个——止血草。叶对生，茎有绒毛，嚼碎了敷伤口。”她把草塞进你手里，“认一百种草，不如先用熟一棵。”","你捏着那棵草，觉得它沉甸甸的。"]},go:"acad_apothecary_2"},
{t:"婉拒：我学符文，怕分心",effects:{xp:4},tier:{ok:["你婉拒了：“嬷嬷，我学符文，怕分心。”她也不恼：“行。符文也救命，药草也救命。各有各的缘分。”","她继续松土，你道了谢，离开。"]},go:"acad_social_hub"}
]};
N["acad_apothecary_2"]={tag:"main",place:"艾尔达魔法学院 · 药圃",pace:"normal",text:[
"你跟特蕾莎嬷嬷学了一个月的药草，已经能认出二十多种：止血草、去热藤、安神花、解毒芝……每种草的性状、用法、忌讳，她都讲得清清楚楚。",
"这天，她带你认一棵种在角落的灰绿色植物：“这个叫‘沉眠草’。别碰它的汁液——沾上一点，人就能睡三天。”她顿了顿，“它还有个用处：碾成粉，混进药里，能止剧痛。但用多了，人就醒不过来了。”",
"她看着你：“药草没有好坏，全看用的人。记住了。”"
],options:[
{t:"认真记下‘沉眠草’的用法",effects:{xp:8,flag:"acad_apothecary_sleep"},tier:{ok:["你认真点头，把沉眠草的性状、用法、忌讳，一条条记在心里。","特蕾莎嬷嬷看着你：“好记性。药草这东西，记在脑子里，比记在本子上牢靠。”"]},go:"acad_apothecary_3"},
{t:"问她：沉眠草哪儿能采到",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["特蕾莎嬷嬷说：“北境的山里就有，老矿洞附近最多——那东西，喜欢阴湿的地方。”她顿了顿，“但你别去采。认得出，躲得开，就够了。”","你点头：“我记住了。”"],
 fail:["她摇摇头：“你问这个做什么？知道它有这个用处就行，别惦记采。”"],
 crit:["她看了你一眼：“矿洞附近最多……你是不是去过那些旧矿洞？”你没回答。她叹了口气：“去过也好。至少知道，有些东西长在暗处。”"]},
effects:{xp:10},onCrit:{flag:"acad_apothecary_cave"},go:"acad_apothecary_3"}
]};
N["acad_apothecary_3"]={tag:"main",place:"艾尔达魔法学院 · 药圃",pace:"normal",text:[
"入冬后，药圃的活儿少了，但特蕾莎嬷嬷更忙了——北边来的难民，常有冻伤和咳疾。她熬了一大锅药汤，让你帮忙送到山门外。",
"你端着药汤过去，看见难民们挤在火堆边，冻得嘴唇发紫。一个老妇人接过药碗，手抖得端不稳。你蹲下来，帮她托着碗底，一口一口喂她喝下去。",
"她喝完，抓着你的手，浑浊的眼睛里滚出泪来：“学生爷……你是好人……我儿子也在外头……不知道还活着没……”"
],options:[
{t:"多留一会儿，帮嬷嬷分发药汤",effects:{xp:8,relation:{npc:"acad_auntie",v:8}},tier:{ok:["你留下来，帮嬷嬷把药汤一碗碗分下去，又帮着烧了两堆火。","忙到天黑，嬷嬷拍拍你的肩：“今天干得好。药草救不了所有人，但能让有些人多撑一晚。”"]},go:"acad_apothecary_4"},
{t:"送完药汤就回去",effects:{xp:4},tier:{ok:["你送完药汤，把空桶拎回药圃。嬷嬷正在熬第二锅，头也不抬：“放那儿吧。”","你放下桶，看着她的背影，觉得这位嬷嬷，比学院的墙还硬。"]},go:"acad_apothecary_4"}
]};
N["acad_apothecary_4"]={tag:"main",place:"艾尔达魔法学院 · 药圃",pace:"normal",text:[
"学期末，特蕾莎嬷嬷送你一个布包：“你的药草课，算结业了。这是给你的——”打开，是一套磨得光亮的药碾和一把小铜勺，“我年轻时用的。现在用不上了，给你。”",
"她顿了顿：“北境乱，会认药的人，到哪儿都有口饭吃。”她看着你，“你要是哪天去了战场，记得先认药，再认人。”",
"你接过药碾和铜勺，郑重道谢。她摆摆手：“谢什么。教你是缘分，你肯学，也是缘分。”"
],options:[
{t:"收好药碾，认真道谢",effects:{xp:8,item:"药碾与铜勺",flag:"acad_apothecary_grad"},tier:{ok:["你把药碾和铜勺仔细包好，收进行囊。","“先认药，再认人。”特蕾莎嬷嬷这句话，你记了一辈子。"]},go:"acad_social_hub"},
{t:"问她：嬷嬷，你年轻时也上过战场？",check:{a:"CHA",sk:"persu",label:"询问"},tier:{
 ok:["特蕾莎嬷嬷沉默了一会儿：“年轻时候，跟着教会医疗队，走过北境最乱的几年。”她顿了顿，“见过太多人，死在‘没有药’上。”她看着你，“所以我才教你们认药。”","你点点头，没有再问。"],
 fail:["她摇摇头：“陈年旧事，不提了。”她转身去侍弄她的药草。"],
 crit:["她看了你很久，说：“我上过战场，也见过‘那东西’。”她声音很轻，“三十年前，铁门关外，有一夜，整片地上都是青色的火。我们救不了人——火里的人，不是被烧死的，是‘没了的’。”她顿了顿，“你以后要是见到那种火，别靠近，跑。”"]},
effects:{xp:12},onCrit:{flag:"acad_apothecary_bluefire"},go:"acad_social_hub"}
]};
/* ---------- 演武对战（4） ---------- */
N["acad_spar_1"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"戈拉教官今天在演武场摆了个擂台：“期末演武考核，两两对战。赢了，本学期实战分满分；输了，加练一个月晨跑。”",
"他扫了一眼在场的学生，目光落在你身上：“你，上来。”",
"你上台，对面站着一个高年级学生——比他矮半个头，但腰身粗壮，拳头像铁锤。他冲你咧嘴一笑：“学弟，手下留情啊。”台下哄笑一片。"
],options:[
{t:"硬碰硬，正面应战",check:{a:"STR",sk:"martial",label:"对战"},tier:{
 ok:["你深吸一口气，迎上去。他的拳头带风，你侧身躲过，还了一拳，打在他肋下。他闷哼一声，反手一拳砸在你肩头——你退了两步，肩头火辣辣的。你来我往，打了三四个回合。最后，他力竭，你抓住空当，一记扫腿把他放倒。","台下叫好一片。戈拉教官点头：“不错，有胆量。”"],
 fail:["你硬接了他一拳，手臂震得发麻，第二拳就招架不住了。他手下留情，没打要害，但你输了。戈拉教官面无表情：“加练一个月晨跑。”","你揉着手臂，认了。"],
 crit:["你不仅赢了，还赢得漂亮——先卖个破绽，引他全力扑来，再侧身闪过，一记肘击顶在他后背，他踉跄着扑倒在地。台下一片惊呼。戈拉教官难得露出一点笑意：“好。会用脑子。”"]},
effects:{xp:15},onCrit:{flag:"acad_spar_win1"},go:"acad_spar_2"},
{t:"先试探，再找机会",check:{a:"AGI",sk:"martial",label:"游斗"},tier:{
 ok:["你不急着进攻，先绕着他走，试探他的出拳路数。他性子急，三拳落空，节奏就乱了。你瞅准空当，一记勾拳打在他小腹，他捂着肚子退开，认输。","戈拉教官点评：“知道用脑子，比只知道用拳头强。”"],
 fail:["你试探得太久，被他抓住一个空当，一记重拳砸在胸口，你倒退几步，败下阵来。","他把你拉起来：“学弟，游斗也要看对手。我这种，你得先下手。”"],
 crit:["你试探出他左拳慢、右拳重的路数，然后专攻他左侧。他左支右绌，被你的连击逼到擂台边，一脚踩空，摔下台。台下哄堂大笑。他爬起来，也不恼：“学弟，你够阴的！”"]},
effects:{xp:15},onCrit:{flag:"acad_spar_win2"},go:"acad_spar_2"}
]};
N["acad_spar_2"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"你赢了第一场，戈拉教官又指了指台下：“下一场，你跟他打。”——他指的，是凯恩。",
"凯恩跳上台，活动着手腕，冲你挤眼：“咱俩打，我可不会手下留情。”你也笑了：“巧了，我也是。”",
"台下的人来了精神，连声起哄：“打！打！打！”"
],options:[
{t:"认真跟凯恩打一场",check:{a:"AGI",sk:"martial",label:"对战"},tier:{
 ok:["你和凯恩打了七八个回合，拳来脚往，谁也不让谁。他的拳路大开大合，你的身法灵活多变，缠斗到最后，你抓住他一个破绽，把他放倒。他躺在台上，喘着气笑：“行啊你，进步不小！”","戈拉教官在台下点头：“都还行。”"],
 fail:["凯恩的拳路太猛，你扛了四个回合就败了。他把你拉起来：“没事，我比你多吃两年饭。”你揉着肩：“再来！”","台下起哄：“再来！再来！”"],
 crit:["你跟他打到第十个回合，用一个假动作骗开他的防守，一记摆拳擦着他下巴过去——没打实，但足够判胜。凯恩愣了一瞬，随即大笑：“好！这招哪学的？”","你说：“跟你学的。”他笑骂：“你倒会现学现卖！”"]},
effects:{xp:15},relation:{npc:"acad_kain",v:8},onCrit:{flag:"acad_spar_kain"},go:"acad_spar_3"},
{t:"跟他点到为止，不较真",effects:{xp:6},relation:{npc:"acad_kain",v:5},tier:{ok:["你们打了三个回合，点到为止，各退一步。戈拉教官皱眉：“没打完呢。”凯恩摆手：“教官，我俩热身呢，真打留到明天。”","戈拉教官哼了一声，倒也没追究。"]},go:"acad_spar_3"}
]};
N["acad_spar_3"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"第三场，戈拉教官亲自下场：“我陪你打一场。不用全力，看看你的底子。”",
"他站的姿势很松，像没设防。但你跟他对视的一瞬间，就知道这人不好惹——他的眼神，像猎手在看猎物。",
"他招招手：“来。”"
],options:[
{t:"主动进攻，试探深浅",check:{a:"STR",sk:"martial",label:"挑战"},tier:{
 ok:["你抢先进攻，一连三拳，都被他侧身让过——他脚下像抹了油，你连他衣角都没碰到。第四拳，他忽然出手，攥住你的手腕，一拧一带，你整个人被甩出去，踉跄几步，摔在沙地上。","他把你拉起来：“出手果断，但下盘不稳。回去多扎马步。”你揉着摔疼的胳膊，认了。"],
 fail:["你攻得太急，露出破绽，被他一个过肩摔放倒，半天没爬起来。他蹲下来看你：“急什么？打架最忌心浮气躁。”","你躺在沙地上，喘着气，把这句话记下了。"],
 crit:["你攻了三拳，第四拳虚晃，骗他侧身，然后一记低扫腿扫他脚踝——他退了一步，稳住身形，眼里闪过一丝意外：“有点意思。”他认真起来，你来我往又打了五个回合。最后他放倒你，却点了点头：“不错。有天赋，也有脑子。”","这是戈拉教官给过你的最高评价。"]},
effects:{xp:18},onCrit:{flag:"acad_spar_gola"},go:"acad_spar_4"},
{t:"先防守，看他出招",check:{a:"AGI",sk:"martial",label:"稳守"},tier:{
 ok:["你摆好防守架势，等他出招。他果然先动了——拳速快得惊人，你挡了两拳，第三拳就没接住，被他推得连退三步。你稳住身形，又缠斗了几个回合，虽然没赢，但也没被他放倒。","他停手：“防守不错。进攻，还差点火候。”"],
 fail:["你守了没几个回合，就被他找出破绽，一记鞭腿扫在腿弯，你单膝跪地。他伸手拉你：“防守不是站着挨打。要守中带攻。”","你点头，记住了这句话。"],
 crit:["你守了八个回合，硬是没让他占到便宜。他忽然收手，上下打量你：“不错。你是这批学生里，少数能在我手下撑过五个回合的。”他顿了顿，“毕业了，想从军的话，来找我。”","你心里一喜：“谢谢教官！”"]},
effects:{xp:18},onCrit:{flag:"acad_spar_offer"},go:"acad_spar_4"}
]};
N["acad_spar_4"]={tag:"main",place:"艾尔达魔法学院 · 演武场",pace:"normal",text:[
"演武考核结束，你坐在演武场边的石阶上，揉着酸痛的胳膊。戈拉教官走过来，在你旁边坐下，破天荒地递给你一壶水。",
"他喝了口水，开口：“你打拳有脑子，但手太生了。真上了战场，没人跟你讲规矩。”他顿了顿，“铁门关的老兵，杀人的招，全是脏的——撩阴、戳眼、断手指。你学不学，是你的选择。但你要知道，这世上有人这么杀人。”",
"他站起身，拍了拍裤子：“毕业之前，想学，每天晨跑后来找我。”他走了几步，又回头，“不来也行。你自己选。”"
],options:[
{t:"答应他：晨跑后来找他",effects:{xp:8,flag:"acad_spar_learn"},tier:{ok:["你站起来：“教官，我学。”他看了你一眼，难得地笑了一下：“行。明早卯时，演武场。迟到一炷香，加跑十圈。”","你点头。从那天起，你每天晨跑后都去演武场，跟戈拉教官学那些“不上台面”的招。"]},go:"acad_social_hub"},
{t:"谢过他，说不必了",effects:{xp:4},tier:{ok:["你想了想，说：“教官，谢了。脏招我学不来。”他也不恼：“行。你选你的路。”他转身走了。","你看着他的背影，觉得这位教官，其实是个好人。"]},go:"acad_social_hub"}
]};
})();

/* /u1inj:data-nodes:dn_acad_story.js/ */
/* dn_acad_story.js — 学院剧情扩展（B-5 补缺） 16 节点
   主题：学院大叙事事件——庆典/演武/审判官/夜火/失踪/往事，与五主线弱呼应
   人物：老莫里茨、费尔曼、罗先生、戈拉、特蕾莎嬷嬷、独臂守钟人
*/
N["acad_story_festival"]={tag:"main",place:"学院 · 广场（年度庆典）",pace:"normal",text:[
"每年秋分的学院庆典，是整个北境的大事。广场上挂满灯笼，各系学员支起摊子——魔药系的卖治疗药水，炼金系的卖护符，农学院的推来一车新收的南瓜。",
"你被阿岩拉着逛了一圈，手里多了半包糖炒栗子、一块热腾腾的南瓜饼。阿岩啃着饼，含含糊糊地说：“这日子，比矿山过年还热闹。”",
"广场中央搭了台子，院长在台上讲了一刻钟的祝词——大意是‘北境虽寒，人心向暖’。台下没人认真听，都在等最后的放灯环节。"
],options:[
{t:"（买一盏河灯，写下心愿放进元素池）",effects:{xp:8,flag:"acad_story_lamp"},tier:{ok:["你蹲在元素池边，把河灯放下去。灯在水面转了两圈，顺着水流漂向池心。你写的是三个字：‘守得住。’池水安静地托着灯，像听懂了一样。"]},go:"acad_story_lamp_night"},
{t:"（帮农学院的摊子收摊，换一块南瓜饼）",effects:{xp:6},tier:{ok:["你帮农学院的两个学员搬了几筐南瓜，摊主塞给你一块现烤的南瓜饼，甜得噎人。你坐在台阶上慢慢吃完，觉得庆典的意义，大约就在这块饼里。"]},go:"acad_story_lamp_night"}
]};
N["acad_story_lamp_night"]={tag:"main",place:"广场 · 夜",pace:"normal",text:[
"入夜，放灯环节到了。几百盏河灯被放进水里、升上天，明晃晃的，像北境自己点亮了一条银河。",
"艾莉丝挤到你旁边，递给你一盏小灯：“帮我放。”你问她写的是什么，她不肯说，只催你‘快点快点’。你把两盏灯一起放出去，看着它们并肩漂远。",
"人群散去后，你站在广场边缘，忽然看见费尔曼独自站在主楼台阶上，没点灯，也没看灯，只是看着北方——铁门关的方向。他在想什么，你不知道。但你记得，庆典热闹成这样，他也没笑一下。"
],options:[
{t:"（过去陪费尔曼站一会儿，不说话）",effects:{xp:8,flag:"acad_story_ferman_night"},tier:{ok:["你在费尔曼身边站定，什么也没说。两人并排站着，看广场上最后一盏灯熄灭。半晌，费尔曼开口：“以前也有一个人，庆典夜站在这里看北边。”他没说那个人是谁，你也没问。"]},go:"acad_story_hunter"},
{t:"（回宿舍休息，明天还有课）",effects:{xp:4},tier:{ok:["你转身回宿舍。走出老远，回头再看，主楼台阶上那个身影还立着，像一截不肯倒的桩。"]},go:"acad_story_hunter"}
]};
N["acad_story_hunter"]={tag:"main",place:"学院议事厅（北境猎手来访）",pace:"normal",text:[
"入冬前，学院来了一位稀客——北境猎手公会的老猎人，人称‘铁钩’贺川。他左臂装着一截铁钩，脸上三道旧疤，是跟兽潮搏命留下的。",
"他是来学院招募‘懂法术的年轻人’的：“铁门关外的兽潮，一年比一年凶。猎手会砍，但砍不动那些会法术的野兽——需要你们这样的娃娃兵。”议事厅里安静了一瞬，随即嗡嗡声四起。",
"贺川的目光扫过人群，最后落在你身上，停了一下。他没说话，只是咧嘴笑了一下，露出一口黄牙。那笑容让你觉得，他看人很准。"
],options:[
{t:"（上前与贺川攀谈，打听铁门关兽潮）",check:{a:"CHA",sk:"persu",label:"攀谈"},tier:{ok:["贺川听完你的问题，从怀里摸出一张皱巴巴的皮纸——是手绘的北境地势图，第三哨的位置画着一个大大的叉。‘这是今年夏天，兽潮冲过的最远位置。’他点了点那个叉，‘再往前一百里，就是学院。’"],fail:["贺川摆摆手：‘打听那么细做什么？小娃娃，书念完了，出去见见血，自然就懂了。’他没再理你。"]},effects:{xp:8,flag:"acad_story_hechuan"},go:"acad_story_vault"},
{t:"（不凑热闹，去图书馆躲清静）",effects:{xp:4},tier:{ok:["你绕开议事厅，钻进图书馆。罗先生正在整理新到的书，见你进来，头也不抬：‘年轻人不去听打仗的事，来翻书？’你说：‘书里也有打仗。’他难得笑了：‘也对。’"]},go:"acad_story_vault"}
]};
N["acad_story_vault"]={tag:"main",place:"学院金库 · 失窃疑云",pace:"normal",text:[
"第二日一早，学院炸了锅——金库失窃了。丢的不是金银，是三块‘纪念铁牌’：据说是早年北境军团赠给学院的，一直锁在金库最里层。",
"院长震怒，召集全院训话：“这是学院的耻辱！谁干的，自己站出来，从轻发落！”没人站出来。训话结束后，费尔曼把你叫到一边，声音很低：“失窃的铁牌，跟‘钥匙’是同一炉的。查一查。”",
"你这才意识到，那不是普通纪念品——那是钥匙的碎片。有人也在收集它们。"
],options:[
{t:"（主动去找戈拉教官，申请协助调查）",effects:{xp:8,flag:"acad_story_vault_investigate"},tier:{ok:["戈拉叼着烟斗听完，眯起眼：‘行，你跟着我。记住——查案子，先查谁最想偷，再查谁最会偷。’他顿了顿，‘还有，最像贼的，往往不是贼。’"]},go:"acad_story_vault_clue"},
{t:"（不动声色，自己去金库附近转）",check:{a:"AGI",sk:"detect",label:"勘察"},tier:{ok:["你趁午休绕到金库外，蹲下细看。锁孔周围没有撬痕——是钥匙开的。门口泥地上有半枚脚印，靴底的花纹很浅，是学院配发的制式靴。你心头一跳：内贼。"],fail:["你在金库附近转了半天，什么也没发现。傍晚，管库的老管理员看见你，狐疑地打量了几眼。你只好讪讪离开。"]},effects:{flag:"acad_story_vault_self"},go:"acad_story_vault_clue"}
]};
N["acad_story_vault_clue"]={tag:"main",place:"学院 · 侧廊",pace:"normal",text:[
"线索断了两天。第三天，管库的老管理员被发现晕在金库门口，手里攥着一角布片，是制式学员袍的料子。",
"学院上下风声鹤唳。特蕾莎嬷嬷在食堂叹气：“都是好孩子，怎么会……”费尔曼倒是很平静，只说了一句：“钥匙不会自己长脚。”",
"你攥着那角布片，翻来覆去地看。料子是新的，针脚整齐，袖口处有一道不太明显的补痕——你想起来，谁的袍子上有这道补痕。你一时想不起名字，但那道补痕，你在哪儿见过。"
],options:[
{t:"（把布片给费尔曼看，说出你的怀疑）",effects:{xp:10,flag:"acad_story_vault_tip"},tier:{ok:["费尔曼把布片对着光看了一会儿，忽然问：‘你见过谁的袍子补过这一道？’你想起来了——是炼金系一个不爱说话的学员，总是一个人做实验，袍子袖口常被药水烧破。费尔曼点点头：‘知道了。你别再查了，剩下的我来。’"]},go:"acad_story_vault_end"},
{t:"（自己顺着补痕查下去）",check:{a:"INT",sk:"detect",label:"追踪"},tier:{ok:["你花了两天，终于把补痕对上号——炼金系的‘鸦羽’，本名陆昭。你跟踪他两天，发现他深夜常去灰楼西侧的一间废弃库房。你不敢打草惊蛇，把发现记在本子上，等一个合适的时机。你隐约觉得，他偷铁牌，不是为了钱。"],fail:["你查了三天，一无所获。那道补痕像满学院的袍子都有，又像都没有。你只好把布片还给费尔曼，承认自己查不下去了。"]},effects:{flag:"acad_story_vault_track"},go:"acad_story_vault_end"}
]};
N["acad_story_vault_end"]={tag:"main",place:"金库失窃 · 尾声",pace:"normal",text:[
"一周后，费尔曼在晨课上宣布：失窃铁牌已经找回，是‘一场误会’，涉事学员‘已依院规处理’，此事到此为止。",
"台下议论纷纷。你看见炼金系那个学员的座位空着——后来听说他休学了，去了南边。费尔曼没再提钥匙的事。",
"只是那天傍晚，你在费尔曼办公室门口，听见他压低嗓门说罗先生说：‘他以为偷走了钥匙，就能找到门。可他不知道，钥匙不止三块。’罗先生回了一句：‘他知道的。’声音里带着你听不懂的意味。"
],options:[
{t:"（把这件事记进笔记，压在心底）",effects:{xp:8,flag:"acad_story_vault_done"},tier:{ok:["你回到宿舍，把‘金库失窃——铁牌三块——陆昭休学——费尔曼知道更多’记在笔记夹层里。有些事，知道的人越多越危险。你决定先当自己不知道。"]},go:"acad_story_duel"}
]};
N["acad_story_duel"]={tag:"main",place:"演武场 · 学院演武大会",pace:"normal",text:[
"第二学年春，学院举办演武大会，各系选拔代表比武。戈拉教官一眼相中你：“土系，防御稳，上去撑场子。”",
"你一路打到半决赛，对手是骑士系的高年级学长，剑盾娴熟，攻势凌厉。前两回合，你被压得抬不起头，土墙碎了三次。",
"第三回合，你学乖了——不再硬顶，而是把土墙斜着立，让学长的剑锋滑开。他力道扑空，身形一滞。你抓住这一瞬，土刺从他脚边窜起，点到即止。裁判哨响，你赢了。"
],options:[
{t:"（赛后向学长致意，交换姓名）",effects:{xp:10,flag:"acad_story_duel_friend"},tier:{ok:["学长姓秦，名策，是东境来的。他揉着手腕，倒不恼：“你那个斜墙，谁教的？”你说自学的。他看了你一会儿，说：“有空去东境，承天城的演武场，比这热闹。”他顿了顿，“报我的名字，没人敢欺负你。”"]},go:"acad_story_duel_after"},
{t:"（赢了就走，回去补功课）",effects:{xp:6},tier:{ok:["你赢了就走，留下满场欢呼。戈拉在背后喊：“臭小子，赢了连个谢场都不做！”你头也不回地摆摆手——你还有三篇魔药课的论文没写。"]},go:"acad_story_duel_after"}
]};
N["acad_story_duel_after"]={tag:"main",place:"演武场 · 散场",pace:"normal",text:[
"演武大会散场，人群渐散。你坐在看台边缘喝水，秦策拎着两壶热茶过来，递你一壶。",
"他坐在你旁边，说：“北境的演武，重防；东境的演武，重攻。我爹说，一攻一守，才是打仗。”他喝了一口茶，“不过我看你那个斜墙，倒有几分东境的意思。”",
"你问他怎么来北境上学。他沉默了一下：“家里让我来避避风头。东境……这两年不太平。”他没细说，你也没细问。有些事，不是不问，是问了也帮不上忙。"
],options:[
{t:"（与秦策约定：毕业后东境再见）",effects:{xp:8,flag:"acad_story_qin_friend"},tier:{ok:["秦策咧开嘴：“一言为定。到时候你来找我，我带你去承天城最好的酒楼。”他伸出拳头，你跟他碰了一下。北境的风吹过演武场，两个年轻人许了一个还不知道轻重的约定。"]},go:"acad_story_inquisitor"}
]};
N["acad_story_inquisitor"]={tag:"main",place:"学院大门 · 审判官入城",pace:"normal",text:[
"那是第四学年开春，一队圣骑士进了北境。为首的是光明教会审判庭的审判官，黑袍白边，腰间挂着圣徽，进城那天下着小雨，他的袍角却一尘不染。",
"他来学院‘例行视察’，实则是冲着‘北境有异端活动’的举报来的。院长陪着笑脸，特蕾莎嬷嬷领着他在各系转了一圈。",
"他经过你们班时，停下来，看着你，忽然问：“你手背上的疤，是怎么来的？”你心头一紧，说：“练功摔的。”他没再问，但那双眼睛像钩子一样，在你手背上挂了一下。"
],options:[
{t:"（垂手低头，尽量不惹眼）",effects:{xp:6,flag:"acad_story_inquisitor_passed"},tier:{ok:["你低着头，感觉那道目光在你身上停了三息，才移开。审判官走了以后，你后背全是汗。特蕾莎嬷嬷路过，把声音压到极低，说：‘别怕。教会查的是异端，不是疤。’她的话让你心安了一些。"]},go:"acad_story_inquisitor_after"},
{t:"（直视他，平静回答）",check:{a:"SPR",sk:"will",label:"镇定"},tier:{ok:["你抬起头，看着他的眼睛，平静地重复：‘练功摔的。’审判官与你对视了片刻，忽然笑了一下：‘北境的学生，胆气倒足。’他没再纠缠，转身走了。你面上镇定，心里却翻江倒海——他记住你了。"],fail:["你答得结巴了一下：‘练、练功摔的。’审判官的眼睛眯了眯，没说话，走了。你听见他对随从说：‘这个学生，留意一下。’"]},effects:{flag:"acad_story_inquisitor_noted"},go:"acad_story_inquisitor_after"}
]};
N["acad_story_inquisitor_after"]={tag:"main",place:"学院 · 审判官离开后",pace:"normal",text:[
"审判官在学院待了三天，什么也没查出来，第四天一早就走了。走之前，他给学院留下一纸‘告诫书’：北境地脉异常，恐有异端活动，望学院‘自律自清’。",
"那纸告诫书被贴在公告栏上，贴了三天。费尔曼路过时看了一眼，什么也没说，但当晚，他把你们几个‘懂地脉’的学员叫到一起，只说了一句：‘最近，都收敛些。教会的人，鼻子很灵。’",
"你摸着袖口里那半块黑铁，觉得它忽然变得很烫。"
],options:[
{t:"（把黑铁从袖口移到更隐蔽的地方）",effects:{xp:8,flag:"acad_story_hide_token"},tier:{ok:["你连夜把黑铁缝进贴身衣物的夹层里，又用油纸包了三层。做完这些，你才觉得心安一些。你对着窗外月亮叹了口气：这东西，到底什么时候才是个头。"]},go:"acad_story_fire"}
]};
N["acad_story_fire"]={tag:"main",place:"灰楼 · 夜火",pace:"normal",text:[
"第四学年深秋的一个深夜，灰楼失火了。火从三楼一间废置的储藏室烧起来，烧红了半边天。",
"全院师生都惊动了，提着水桶救火。你冲在最前面，一趟趟提水。火势最猛的时候，你听见储藏室里有敲击声——有人被困在里面！",
"你二话不说，用土系法术在火墙上撕开一道口子，冲了进去。浓烟里，你看见一个蜷缩的身影——是炼金系那个叫‘鸦羽’的学员，他不是休学去南边了吗？他怀里紧紧抱着一个铁盒，被烟呛得直咳。"
],options:[
{t:"（先救人，把人拖出火场）",effects:{xp:14,flag:"acad_story_fire_save"},tier:{ok:["你连拖带拽把鸦羽弄出火场，自己也被烟呛得眼泪直流。火灭后，鸦羽坐在地上咳了半天，忽然抬头看你，哑着嗓子说：‘你……不要命了？’你说：‘命比铁盒值钱。’他沉默了很久，说：‘你说得对。’他把铁盒往你怀里一塞，‘这个，你先替我收着。别让人知道。’"]},go:"acad_story_fire_after"},
{t:"（先护住铁盒，再拉人）",check:{a:"AGI",sk:"martial",label:"抢救"},tier:{ok:["你一手抓起铁盒，一手拽人，滚出火场时后背燎了一片。鸦羽看着你怀里的铁盒，又看着你后背的伤，张了张嘴，最后说：‘谢了。’他顿了顿，‘那盒子里的东西……是钥匙。我偷它，不是为钱——是为了找一道门。’"],fail:["火势太大，你冲进去又被逼回来，连呛几口烟。等火灭了，鸦羽是自己爬出来的，怀里铁盒抱得死紧。他看了你一眼，没说话。你心里不是滋味。"]},effects:{flag:"acad_story_fire_box"},go:"acad_story_fire_after"}
]};
N["acad_story_fire_after"]={tag:"main",place:"灰楼外 · 天明",pace:"normal",text:[
"天快亮时，火终于灭了。灰楼三楼烧穿了一个角，所幸没有死人。",
"鸦羽被特蕾莎嬷嬷带去医务室。你坐在灰楼外的台阶上，怀里抱着那个铁盒，分量不重，但你知道，这里面装着的东西，比金库还重。",
"费尔曼不知何时走到你身边，看了一眼铁盒，没问来历，只说：‘灰楼那把火，不是天干物燥。’你抬头看他，他接着说：‘有人想烧掉这盒子的踪迹。你收了它，就接下了那人的麻烦。’他顿了顿，‘后悔还来得及——把它给我，你就干净了。’"
],options:[
{t:"（把铁盒交给费尔曼）",effects:{flag:"acad_story_box_ferman"},tier:{ok:["你想了一夜，天亮时把铁盒交给费尔曼。他接过去，掂了掂，说：‘聪明。’他转身走远，又说了一句，‘不过你既然碰过钥匙，就别想全干净了。’你望着他的背影，说不清是松了一口气，还是更沉了。"]},go:"acad_story_ghost"},
{t:"（自己留着铁盒）",effects:{flag:"acad_story_box_keep"},tier:{ok:["你摇头：‘我自己惹的事，自己扛。’费尔曼看了你很久，没再劝。他走时留下一句：‘那就看好它。钥匙这种东西，放在谁手里，谁就是门的目标。’你把铁盒贴身收好，觉得它凉得像块冰。"]},go:"acad_story_ghost"}
]};
N["acad_story_ghost"]={tag:"main",place:"旧礼堂 · 传闻",pace:"normal",text:[
"学院有一座废弃的旧礼堂，十年前因为‘失修’封了，一直没人进去。传说夜里能听见里面有人唱歌——是女声，断断续续的，唱的是北境民谣。",
"你本来不信这些。但有一夜你值更，路过旧礼堂，真的听见了歌声。你脚步一顿，那歌声也停了。你站在月光下，与一扇落了锁的门对峙了片刻，听见门里传来一声极轻的叹息。",
"第二日你问老莫里茨，他沉默了一会儿，说：‘十年前，有个女学员，唱得一手好民谣。后来她失踪了，学院说她退学了。那座礼堂，就是她最后练唱的地方。’"
],options:[
{t:"（夜里再去旧礼堂，从窗缝里看）",check:{a:"AGI",sk:"stealth",label:"夜探"},tier:{ok:["你趁夜翻上旧礼堂的窗台，从破窗缝里往里看。月光从屋顶漏进来，照见空荡荡的礼堂——没有人。但讲台边放着一把旧琴，琴上落着灰，琴弦却断了一根，断口很新。你心里一沉：今夜有人来过，弹过琴，又走了。"],fail:["你翻窗台时踩空，摔了一跤，惊动了值夜的守卫。你只好灰溜溜地回去，旧礼堂的事，再没敢深究。"]},effects:{flag:"acad_story_ghost_visit"},go:"acad_story_honor"},
{t:"（把歌声的事告诉费尔曼）",effects:{xp:6},tier:{ok:["费尔曼听完，脸色变了一下，很快又恢复：‘旧礼堂的事，不该你们管。’你追问为什么，他只说：‘有些地方封着，不是因为失修。’"]},go:"acad_story_honor"}
]};
N["acad_story_honor"]={tag:"main",place:"荣誉墙",pace:"normal",text:[
"主楼走廊里有一面荣誉墙，挂着学院建校以来杰出毕业生的画像。大多数是文臣武将，也有一些名医、名匠。",
"你路过时，总会多看两眼——不是因为崇拜，是因为画像里有一张脸，你总觉得在哪儿见过。",
"那是一张年轻女人的画像，眉目温和，穿着旧式学员袍，下面写着：‘艾琳·霜叶，第三十六届，北境民谣歌者。’你忽然想起来，旧礼堂的歌声、老莫里茨说的‘唱民谣的女学员’——就是她。而她的画像，不知何时，被人用墨线画了一道叉。"
],options:[
{t:"（查学院档案里关于艾琳·霜叶的记录）",check:{a:"INT",sk:"lore",label:"查阅"},tier:{ok:["你翻了三天档案，只找到一行字：‘艾琳·霜叶，毕业当年赴南境游学，此后下落不明。’档案管理员老伯说：‘这姑娘当年可出名了，唱歌好听，人也好看。后来……’他话到嘴边又咽回去，‘后来教会来学院查过一次‘异端’，她就不见了。’你合上档案，觉得那道墨叉，比档案本身更扎眼。"],fail:["你翻了三天，什么也没查到。艾琳·霜叶的记录像被人特意清理过——毕业年份、去向，全是空白。你越发觉得，这道墨叉背后，有事。"]},effects:{flag:"acad_story_ailin"},go:"acad_story_alchemy"},
{t:"（把墨叉的事记下，不多管）",effects:{xp:4},tier:{ok:["你把画像上的墨叉记进笔记，附了一行小字：‘艾琳·霜叶——待查。’你告诉自己，先记着，等有能力了再查。"]},go:"acad_story_alchemy"}
]};
N["acad_story_alchemy"]={tag:"main",place:"炼金室 · 爆炸",pace:"normal",text:[
"第五学年，炼金课。你正按配方调配‘稳定剂’，隔壁实验台的学员多加了一勺火蜥蜴血——轰的一声，整个实验台炸了。",
"你被气浪掀出去两米，后背撞在架子上，药瓶碎了一地。浓烟里，有人喊‘着火了！’你爬起来，先摸了一把脸，满手黑灰，幸好没破相。",
"爆炸把炼金室顶棚掀开一角，露出夹层——夹层里掉出一卷发黄的羊皮纸，落在你脚边。你顺手捡起，展开一看，是一幅手绘地图，标注着北境地脉的走向，蛇头的位置画着一个门形符号，旁边写着一行小字：‘艾琳，等我回来。’"
],options:[
{t:"（把羊皮纸藏好，先处理爆炸现场）",effects:{xp:10,flag:"acad_story_map"},tier:{ok:["你趁着混乱把羊皮纸塞进怀里，转身去扶那个闯祸的学员。那小子脸都白了，一个劲儿说‘对不起’。你拍拍他的肩：‘先救人，别的待会儿再说。’你们俩把伤者抬出去，炼金室烧了半个，好在没人重伤。"]},go:"acad_story_oldman"},
{t:"（当场把羊皮纸交给授课教授）",effects:{flag:"acad_story_map_give"},tier:{ok:["你犹豫了一下，还是把羊皮纸交给授课的老教授。老教授接过去看了一眼，脸色大变，随即把它收进袖中：‘这件事，不许跟任何人提。’后来你再没见过那张羊皮纸。你有时想，也许交出去，是对的。"]},go:"acad_story_oldman"}
]};
N["acad_story_oldman"]={tag:"main",place:"学院后山 · 老莫里茨的往事",pace:"normal",text:[
"临毕业那年，你常去后山帮老莫里茨修柴房。他七十多了，腿脚不利索，但手稳，劈柴一斧两半。",
"那天劈完柴，你俩坐在柴垛上喝粗茶。老莫里茨忽然说：‘你老问我池底的事。我告诉你个事，你别往外传。’他说，他年轻时，也是学院的学员，‘那时候北境还没这么乱。我们有个小团体，五个人，跟着一位先生学地脉。’",
"他顿了顿：‘那位先生，姓金。金秤的金。后来出了事，先生失踪了，我们五个散伙了。一个去了铁门关，一个去了东境，一个疯了，一个——’他指了指旧礼堂的方向，‘埋在那底下了。就剩我，留在这里看水。’"
],options:[
{t:"（问老莫里茨：那位金先生教过什么）",check:{a:"CHA",sk:"persu",label:"追问"},tier:{ok:["老莫里茨眯着眼看天，半天才说：‘先生教我们，地脉是活的，要敬它，别怕它。他还教我们认钥匙——就是那些铁牌铜牌。’他看了你一眼，‘你身上，有先生的味道。你见过那些牌子了吧？’你没说话，但他什么都明白了。‘东西在你那儿，就好好收着。先生说过，钥匙认人，不认钱。’"],fail:["老莫里茨摆摆手：‘陈年旧事，记不清了。’他起身收拾斧头，‘柴劈好了，回吧。年轻人，别老惦记过去的事，前面还有路呢。’"]},effects:{flag:"acad_story_jin"},go:"acad_story_graveyard"},
{t:"（只陪他喝茶，不追问）",effects:{xp:6},tier:{ok:["你陪他喝完茶，把柴房收拾利落。临走，老莫里茨在背后说：‘小子，金先生要是还在，会喜欢你这样的学生——手稳，嘴也稳。’"]},go:"acad_story_graveyard"}
]};
N["acad_story_graveyard"]={tag:"main",place:"学院墓园",pace:"normal",text:[
"学院墓园在后山东坡，安静，向阳。墓碑不多，但每一块都有人打理，碑前的花是新换的。",
"你顺着墓碑一块块看过去，在角落里找到一块无字碑——没有名字，没有生卒，只有碑顶刻着一个小小的图案：一杆秤。金秤的秤。",
"你蹲在碑前，忽然明白老莫里茨说的‘埋在那底下的’是谁。你伸手拂去碑上的落叶，什么也没说，鞠了一躬。风从北边来，吹动碑前的草。"
],options:[
{t:"（在无字碑前放一块从矿洞带回来的石头）",effects:{xp:8,flag:"acad_story_gravestone"},tier:{ok:["你从行囊里翻出矿洞带回的一块黑石，放在碑前。石头不大，但沉。你对着无字碑压着嗓子说：‘我替那些没回来的人，给你放一块石头。’风把你的话吹散，但你知道，有人听见了。"]},go:"acad_story_wolf"}
]};
N["acad_story_wolf"]={tag:"main",place:"雪原 · 夜归狼群",pace:"normal",text:[
"毕业前那个冬天，你在学院外执行一次野外课业，归途遇上了雪。雪越下越大，天色暗得比平时早。",
"你抄近路走林间小道，忽然听见雪地里传来细碎的脚步声——不是人的。你停下，拔出短刀。林子里，一双、两双、三双……绿莹莹的眼睛亮起来，是狼群。",
"领头的老狼蹲在雪坡上，居高临下地看着你。你没有跑——雪地里跑不过狼。你慢慢后退，靠到一棵树前，把手里的火折子晃亮。狼群在火光外停住，低低地呜咽。"
],options:[
{t:"（用土系法术在身前立一道雪墙）",check:{a:"SPR",sk:"soul",label:"通灵"},tier:{ok:["你把手按进雪地，魔力渗下去——雪墙从身前隆起，不算高，但足以挡住狼的视线。你听见狼群在墙外绕了几圈，领头的老狼发出一声低吼，带着狼群退进林子。你长出一口气，等雪墙塌了，才跌跌撞撞往回走。这一夜，你第一次觉得，五年的修行，没有白费。"],fail:["你试着引动地脉，但雪地冻得像铁，魔力传不进去。你只好转身就跑，狼群在后面追出半里地，直到你跑上大路，才悻悻散去。你拄着膝盖喘气，后背全是冷汗。"]},effects:{flag:"acad_story_wolf_pass"},go:"acad_story_farewell"},
{t:"（扔出火折子引开狼群，绕路走）",effects:{xp:8},tier:{ok:["你把火折子甩向另一侧，狼群果然追光而去。你趁机钻进林子，绕了一大圈才回到学院。进门时，门房问你为什么这么晚，你说：‘路上遇见狼了。’门房笑：‘北境的狼，聪明着呢，不惹它们就行。’"]},go:"acad_story_farewell"}
]};
N["acad_story_farewell"]={tag:"main",place:"毕业前夜 · 篝火",pace:"normal",text:[
"毕业前夜，阿岩在宿舍楼下生了一堆篝火，把平时玩得好的几个人都叫来——艾莉丝、小柯、凯恩、阿塔，还有秦策。",
"火光照着每个人的脸。阿岩烤着一条从食堂‘借’来的羊腿，油脂滴在火上，滋滋响。艾莉丝带头唱歌，是北境民谣，唱到一半跑了调，大家都笑。",
"你坐在火边，忽然想起五年前第一天报到那天——你站在学院门口，看这扇门，心里又慌又期待。如今要走了，你反而觉得，这扇门，像是给你开了另一扇。"
],options:[
{t:"（给每个人倒一杯热酒，说一句‘后会有期’）",effects:{xp:10,flag:"acad_story_farewell_done"},tier:{ok:["你举杯，挨个敬过去。敬阿岩：‘回矿山，替我看看矿洞的星光。’敬艾莉丝：‘北上，替我听听第三哨的钟声。’敬秦策：‘去东境，替我尝尝承天城的酒。’敬小柯、凯恩、阿塔：‘往后有事，捎个信。’最后你对着火堆说：‘后会有期。’火苗跳了跳，像应了你。"]},go:"acad_story_end"},
{t:"（把篝火添旺，静静坐到最后）",effects:{xp:8},tier:{ok:["你没说话，只是往火里添柴。火越烧越旺，把每个人的脸都照得亮堂堂的。夜很深了，谁也没先走。后来阿岩打了个哈欠，说‘明天还要赶路呢’，大家才笑着一哄而散。你最后一个走，把火种压进灰里，留了一点余温。"]},go:"acad_story_end"}
]};
N["acad_story_end"]={tag:"main",place:"毕业 · 晨光",pace:"normal",text:[
"天亮了。你背上行囊，站在学院门口，回头看了一眼——五年，一千八百多个日夜。白墙、灰楼、元素池的蓝光、旧礼堂的琴声、墓园的无字碑，都收进眼底。",
"你摸了摸贴身的地方：半块黑铁、一面铜牌、一张抄纸、一本旧册子、一块护身玉，还有那幅从炼金室夹层里捡到的羊皮地图。",
"风从北边来。你转身，迈步。身后，学院的钟楼敲了一声——很轻，像在说：去吧。前方，铁门关方向的天边，泛着淡淡的青白。你知道，那道门还在等你。"
],options:[
{t:"（迈步北上）",effects:{flag:"acad_story_done"},tier:{ok:["你往北走，行囊在肩上晃。雪还没化尽，但路是干的。你走得不快，但每一步都踩得稳——五年的修行，让你学会了怎么走路。"]},go:"fc_road_north"}
]};

N["acad_story_archives"]={tag:"main",place:"学院档案室",pace:"normal",text:[
"档案室在图书馆地下一层，常年点着一盏昏黄的油灯。老管理员戴着老花镜，把一摞摞卷宗码得整整齐齐。你来得多了，他把你当半个帮手。",
"这天你帮他搬新到的卷宗，手一滑，一摞纸散了一地。你蹲下捡，看见一张泛黄的登记表——是三十多年前的学员名册，其中一行被人用墨涂掉了，只留下半边名字：艾……霜叶。",
"你心里一动，正要细看，老管理员走过来，弯腰帮你捡纸。他看了一眼那张名册，什么也没说，只把那张纸从你手里轻轻抽走，放回卷宗里：“陈年旧档，沾灰的。”"
],options:[
{t:"（谢过老管理员，把这事记在心里）",effects:{xp:8,flag:"acad_story_archives_see"},tier:{ok:["你走出档案室，回头看了一眼。老管理员还在低头理卷宗，动作很慢。你忽然觉得，他什么都知道——只是不说。"]},go:"acad_story_end"}
]};
N["acad_story_tutor"]={tag:"main",place:"学院 · 深夜自习室",pace:"normal",text:[
"毕业前的一个深夜，你路过自习室，看见灯还亮着。推门进去，阿塔正趴在桌上，对着一卷羊皮纸发愁——是一幅草原地图，上面画着密密麻麻的标记。",
"阿塔抬头看见你，咧嘴一笑：“来得正好。我阿爸来信，说草原今年雪线退得早，让我毕业就回去，帮忙看牛群。”他挠挠头，“可我答应了艾莉丝，说好一起去北边的。”",
"你在他旁边坐下，看着那幅地图。窗外北风呼啸，屋里油灯摇曳。两个年轻人，各自揣着各自的约定，在深夜的自习室里，忽然都觉得前路又远又亮。"
],options:[
{t:"（给他出主意：先回乡帮阿爸，再北上汇合）",check:{a:"CHA",sk:"persu",label:"出主意"},tier:{ok:["阿塔听完，眼睛一亮：“对啊！草原和北边又不隔一条河。我先回去稳住家里，入秋再北上，正好赶上铁门关的秋防。”他用力拍了拍你的肩，“到时候，咱们第三哨见！”你笑着说好。这个约定，后来在你心里存了很久。"],fail:["阿塔挠挠头：“你说得倒轻巧……”他叹了口气，“算了，船到桥头自然直。”他收起地图，吹了灯。回去的路上，你俩谁也没说话，但步子都走得很稳。"]},effects:{xp:8,flag:"acad_story_tutor_done"},go:"acad_story_end"}
]};

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
  {id:"led_38", type:"伏笔", desc:"圣城圣痕司地基下发现与沙漠第七柱同源的石柱（艾德蒙叔叔遗信），圣城与沙漠压在一条封印线上（BD-3 新埋）。", plant:"node:church_doubter2", reap:"future", status:"open", world:"光明教会"},

  {id:"led_sp8_01", type:"设定", desc:"西境游侠学院（院长柯恩，铁木黑弓，鹰牌信物）", plant:"node:sp8_ranger_00", reap:"node:sp8_ranger_14", status:"open", world:"西境"},
  {id:"led_sp8_02", type:"伏笔", desc:"柯恩身世：军阀火并中失去村子的孤儿收容者", plant:"node:sp8_ranger_00b", reap:"node:sp8_ranger_15", status:"open", world:"西境"},
  {id:"led_sp8_03", type:"人物", desc:"游侠公会老会长（行省会鹰旗持有者）", plant:"node:sp8_ranger_14", reap:"node:sp8_ranger_15", status:"open", world:"西境"},

  {id:"led_a1_01", type:"设定", desc:"理想线·富甲天下：商路第一步与第一桶金", plant:"node:goal_intro_wealth", reap:"node:goal_wealth_3", status:"open", world:"理想线"},
  {id:"led_a1_02", type:"设定", desc:"理想线·威震四海：老佣兵授艺与第一场硬仗", plant:"node:goal_intro_might", reap:"node:goal_might_3", status:"open", world:"理想线"},
  {id:"led_a1_03", type:"设定", desc:"理想线·守护苍生：孤儿二狗与货栈救火", plant:"node:goal_intro_guard", reap:"node:goal_guard_3", status:"open", world:"理想线"},
  {id:"led_a1_04", type:"设定", desc:"理想线·探寻真相：《封印前史》残卷与七印草图", plant:"node:goal_intro_truth", reap:"node:goal_truth_3", status:"open", world:"理想线"},
  {id:"led_a1_05", type:"设定", desc:"理想线·自由自在：雪原独行与雪崩村守望", plant:"node:goal_intro_free", reap:"node:goal_free_3", status:"open", world:"理想线"},
  {id:"led_a1_06", type:"设定", desc:"理想线·登临神座：符文石板参悟与第一缕微光", plant:"node:goal_intro_god", reap:"node:goal_god_3", status:"open", world:"理想线"},
  {id:"led_a1_07", type:"设定", desc:"理想线·名留青史：救人扬名与吟游诗人的传唱", plant:"node:goal_intro_fame", reap:"node:goal_fame_3", status:"open", world:"理想线"},
  {id:"led_a1_08", type:"设定", desc:"理想线·以血还血：旧伤溯源与刀鞘刻名", plant:"node:goal_intro_revenge", reap:"node:goal_revenge_3", status:"open", world:"理想线"},
    {id:"led_b5_01",type:"道具",desc:"钥匙收集线：矿洞铜牌+元素池底黑铁+金库失窃铁牌，皆旧封印之钥（acad_magic_y1_pool / acad_story_vault）",plant:"acad_magic_y1_pool",reap:"acad_magic_y5_choice",status:"open",world:"vol_academy"},
    {id:"led_b5_02",type:"伏笔",desc:"封印之门位于北境地脉蛇头·第三哨；门缝青光渐亮，封印松动（seal 主线弱呼应）",plant:"acad_magic_y3_seal",reap:"north_road_1",status:"open",world:"vol_academy"},
    {id:"led_b5_03",type:"人物",desc:"金先生（金秤的金），老莫里茨之师，地脉学派五人小团体领袖，失踪；墓园无字碑即其葬地",plant:"acad_story_oldman",reap:"acad_story_graveyard",status:"open",world:"vol_academy"},
    {id:"led_b5_04",type:"人物",desc:"艾琳·霜叶，北境民谣歌者，旧礼堂歌声、荣誉墙墨叉、档案被涂，与教会异端调查有关",plant:"acad_story_ghost",reap:"acad_story_archives",status:"open",world:"vol_academy"},
    {id:"led_b5_05",type:"伏笔",desc:"费尔曼与六钥匙：刘矿头死于矿洞、老铁守第三哨失踪；费尔曼手背青纹更深",plant:"acad_magic_y5_ferman",reap:"north_road_1",status:"open",world:"vol_academy"},
    {id:"led_b5_06",type:"地点",desc:"第三哨铜钟，十年未鸣；守钟人独臂老兵言敲钟会出事",plant:"acad_magic_y4_quiet",reap:"north_road_1",status:"open",world:"vol_academy"},
    {id:"led_b5_07",type:"人物",desc:"陆昭（鸦羽），炼金系偷铁牌者，休学去南，灰楼夜火持铁盒再现，铁盒或已交费尔曼",plant:"acad_story_vault_end",reap:"acad_story_fire_after",status:"open",world:"vol_academy"},
    {id:"led_b5_08",type:"人物",desc:"秦策，东境承天城演武场之约；东境动荡避风北上，秦·长风线人物网络延伸",plant:"acad_story_duel_after",reap:"east_chengtian_old",status:"open",world:"vol_academy"},
    {id:"led_frontier_01",type:"地点",desc:"第三哨城，联盟最北军事要塞。铜钟铭文刻七锚之图，地脉蛇头在此，七锚之约第一环。",plant:"frontier_bell_4",reap:"frontier_bell_5",status:"open",world:"vol_north"},
    {id:"led_frontier_02",type:"伏笔",desc:"老周之子三十年前在矿洞失踪，尸首未寻；失踪前曾说钟底下那个东西在叫他。",plant:"frontier_old_2",reap:"frontier_old_5",status:"open",world:"vol_north"},
    {id:"led_frontier_03",type:"伏笔",desc:"矿洞封洞二十年仍传出水声，矿工旧物沉在巷道深处，锚2所在。",plant:"frontier_mine_gate",reap:"frontier_mine_1",status:"open",world:"vol_north"},
    {id:"led_frontier_04",type:"伏笔",desc:"雪原狼群由黑皮两足人影指挥，狼王悬赏与城门告示同图。",plant:"frontier_infirmary",reap:"frontier_ev_wolves",status:"open",world:"vol_north"},
    {id:"led_frontier_05",type:"人物",desc:"独臂军需官，掌矿洞钥匙与铜钟旧事，知七锚铭文来历。",plant:"frontier_sergeant",reap:"frontier_bell_4",status:"open",world:"vol_north"},
    {id:"led_frontier_06",type:"伏笔",desc:"王三失踪于钟楼，雪地留下首枚铁牌，与钟身刻痕同纹（方牌中竖纹），七锚之首。",plant:"frontier_bell_2",reap:"frontier_bell_3",status:"open",world:"vol_north"},
    {id:"led_frontier_07",type:"伏笔",desc:"风洞铁皮棺材：黑皮人组织运送，棺内传出敲击声，与矿洞水声同源；风洞深处另有铁门需钥匙。",plant:"frontier_tie_6",reap:"frontier_tie_8",status:"open",world:"vol_north"},
    {id:"led_frontier_08",type:"人物",desc:"老铁：第三哨老兵，其父三十年前死于矿洞，遗物铁牌被矿上收走；手上有风洞铁门钥匙。",plant:"frontier_tie_1",reap:"frontier_tie_7",status:"open",world:"vol_north"},
    {id:"led_frontier_09",type:"伏笔",desc:"黑纹伤病：被咬老兵伤口渗黑纹，做同一个敲击噩梦，指向矿洞方向；军医宋记录在册。",plant:"frontier_medic_2",reap:"frontier_medic_5",status:"open",world:"vol_north"},
    {id:"led_frontier_10",type:"地点",desc:"地窖裂缝：第三哨地底深渊地脉，seal 主线 day200 联动；玩家侧加固/观望/上报教会三路影响文本。",plant:"frontier_seal_1",reap:"frontier_seal_after_2",status:"open",world:"vol_north"},
    {id:"led_a3_01",type:"伏笔",desc:"北境灰烬村废墟之眼（深渊生物窥视）",plant:"origin_expand_north_edge",reap:"origin_expand_north_6",status:"open",world:"vol_north"},
    {id:"led_a3_02",type:"设定",desc:"南方深海绿光·第七印在海底（商船线）",plant:"origin_expand_south_4",reap:"",status:"open",world:"vol_south"},
    {id:"led_a3_03",type:"人物",desc:"杜嬷嬷送阿禾东去承天城投奔姓秦者（教会孤儿线）",plant:"origin_expand_church_4",reap:"",status:"open",world:"vol_church"},
    {id:"led_a3_04",type:"设定",desc:"世界树根部封印·晨星之泪可洗蚀痕（精灵线）",plant:"origin_expand_elf_6",reap:"",status:"open",world:"vol_elf"},
    {id:"led_a3_05",type:"设定",desc:"矮人南矿洞铁门·七道封印之一（矮人线）",plant:"origin_expand_dwarf_4",reap:"",status:"open",world:"vol_dwarf"},
    {id:"led_a3_06",type:"人物",desc:"铁门关斥候托信交汇城李管事·暗蚀会挖地寻物（兽人线）",plant:"origin_expand_orc_7",reap:"",status:"open",world:"vol_orc"},
    {id:"led_a3_07",type:"人物",desc:"秦·长风：晨天城秦氏幸存者，居交汇城，官署暗探在找（东境线）",plant:"origin_expand_east_7",reap:"",status:"open",world:"vol_east"},
    {id:"led_a3_08",type:"伏笔",desc:"承天城井水变浑·晨天城覆灭征兆重现",plant:"origin_expand_east_6",reap:"",status:"open",world:"vol_east"},
    {id:"led_b1_01",type:"设定",desc:"学院入学引导链：自由城/王都/铁门关前线三入口可达学院（acad_road_1~5），开学典礼埋塔灯传说",plant:"acad_road_1",reap:"academy_admission",status:"open",world:"vol_academy"},
    {id:"led_b1_02",type:"伏笔",desc:"塔顶之灯数人之说（acad_tower_rumor）与图书馆塔灯呼应，待学院线回收",plant:"acad_road_4",reap:"academy_graduation",status:"open",world:"vol_academy"},
    {id:"led_b2_01",type:"设定",desc:"学院五学年生活线（acad_life_y1~y5，30 节点：课程ifJob/宿舍/同窗/期中/期末/假期/学年事件），north_academy_gate 生活区入口",plant:"acad_life_y1_open",reap:"academy_graduation",status:"open",world:"vol_academy"},
    {id:"led_b2_02",type:"伏笔",desc:"费尔曼教授=席恩（看守者），禁书区夜课、净化令、第七节点钥匙（acad_brass_key）",plant:"acad_life_y2_friend",reap:"academy_elda_forbidden_1",status:"open",world:"vol_academy"},
    {id:"led_b3_01",type:"人物",desc:"学院人际网：塞西莉娅（东境政务/晨天水）/灰须·莫里（矮人符文/铁门七封印）/伊莲娜（精灵治愈/忘忧草）/老铁（铁门关铁匠），各 4 节点闭环",plant:"acad_people_hub",reap:"academy_graduation",status:"open",world:"vol_academy"},
    {id:"led_b3_02",type:"人物",desc:"导师四人（墨丘利银叶/戈拉铁门关铁片/特蕾莎枯木/老莫里茨商路），各 2 节点闭环",plant:"acad_mentor_hub",reap:"academy_graduation",status:"open",world:"vol_academy"}
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

/* /u1inj:data-nodes:dn_fc_life.js/ */
/* /A2inj:fc/ A-2 自由城汇流段三日生活（fc_ 链扩充：落脚/结识/夜半/木盒/四去向/理想入口）
   纯数据对象式；pace 元数据；ifJob/ifIdeal 变体；与 A-1 理想线联动；不入引擎
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   入口：fc_tavern 新增「找掌柜要间房住下」→ fc_lodging */

N["fc_lodging"]={tag:"main",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"normal",text:[
"入夜前，你回到跛脚酒桶，跟蜜尔娜提了住宿的事。",
"她擦了擦手，从柜台底下摸出一把黄铜钥匙，在指间转了一圈：“二楼尽头那间，窗朝巷子，夜里清静。一个银月一晚，含早——早是隔夜的硬面包，别挑。”",
"你上楼时，她补了一句：“这楼里住的不止你一个。夜里听见什么动静，别开门，也别点灯。”",
"房间不大，一张床、一张桌、一扇窗。窗外正对着一条窄巷，巷口挂着一盏快要熄灭的油灯。你把门闩插好，和衣躺下。"
],options:[
{t:"躺下，先睡一觉",go:"fc_night"},
{t:"下楼再坐一会儿，看看夜里酒馆的客人",go:"fc_barkeep"},
{t:"推窗看看那条巷子",go:"fc_night"}
]};
N["fc_night"]={tag:"main",place:"自由城邦 · 交汇城 · 跛脚酒桶二楼",pace:"normal",text:[
"你是被一阵声音弄醒的。",
"不是吵闹，是太安静了——酒馆楼下本该有动静，此刻却像被一只手捂住了嘴。你竖起耳朵，听见窗外巷子里传来极轻的脚步声，一步，停，一步，停。",
"脚步声在窗下停住了。你屏住呼吸，听见有人压低声音说话，用的是你听不懂的语言，音节又短又硬，像在核对什么。",
"片刻后，脚步声远去了。你贴着窗缝往外看，只看见巷口油灯的光里，一道人影一闪而过——那身影走路的姿势很怪，像脚踝使不上力，又像在拖着一件重物。",
"你躺回床上，心跳得厉害。蜜尔娜的话在耳边响：夜里听见什么动静，别开门，也别点灯。"
],options:[
{t:"记下这个异常，继续睡",go:"fc_morning"},
{t:"披衣下楼，看看到底是谁",go:"fc_box"},
{t:"推窗翻下，沿着巷子追过去",go:"fc_box"}
]};
N["fc_morning"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"天蒙蒙亮时，你被楼下挪桌子的声音吵醒。",
"你下楼时，蜜尔娜已经开了门，正往桌上摆面包。她看了你一眼，像在打量你有没有什么不对劲，末了只说：“昨夜睡得还好？”",
"你犹豫了一下，说听见巷子里有动静。她擦桌子的手顿了顿：“这条巷子夜里不太平。你不是第一个听见的，也不会是最后一个。”",
"她没再往下说。你也不打算问。有些事，知道得越多，夜里越睡不踏实。"
],options:[
{t:"吃早饭，开始今天的活计",go:"fc_job"},
{t:"先去找蜜尔娜深谈几句",go:"fc_innkeep"}
]};
N["fc_innkeep"]={tag:"main",place:"自由城邦 · 交汇城 · 跛脚酒桶柜台",pace:"normal",text:[
"早饭时酒馆没什么人。蜜尔娜难得清闲，坐在柜台后缝一件旧围裙。你端着硬面包凑过去，她也不赶你，只抬了抬那只亮眼睛。",
"你问她，这座城到底是谁说了算。她针脚不停，随口道：“明面上是执政厅，暗地里是三家：银月商会的钱、圣痕司的权、下水道里的东西。你得罪前两家，顶多破财坐牢；得罪第三家……”她顿了顿，“没人知道得罪了是什么下场。”",
"她又看了你一眼：“你这种新面孔，城里每天进来几十个。能活过第一月的，十个里留三个。”",
"她放下针，从围裙口袋里摸出一个小布袋，丢给你：“昨儿你帮我把门口的醉汉挪进屋，这是工钱。多的那枚，是给你留着买把像样的家伙的。”"
],options:[
{t:"收下布袋，记下这份情",effect:{gold:6},go:"fc_job"},
{t:"把钱推回去，说想听她讲这座城的规矩",go:"fc_job"}
]};
N["fc_barkeep"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"normal",text:[
"夜里你下楼，柜台后的酒保老赵正在擦杯子。他五十来岁，左手少了三根手指，据说是年轻时替人挡刀落的。",
"见你下来，他给你倒了杯温热的麦酒，没算钱：“睡不着？”",
"你点头，问起昨夜的事。老赵压低声音：“你说的那动静，这个月第三回了。都是后半夜，都是巷子那头。掌柜的不让提，可这楼里的老客都心里有数——那不是人走路的声音。”",
"他把擦好的杯子码回架上，补了一句：“你听我一句劝：交汇城的事，能不管就不管。这城里有的是比你急的事，等着你去办。”",
"他指指窗外：“天亮往东看，能看见北境的山。那边在打仗，可仗打完了，总得有人去做买卖、讨生活。你要是没想好干什么，就先想清楚自己要往哪儿去。”"
],options:[
{t:"谢过老赵，回房睡下",go:"fc_night"},
{t:"问他：这城里最急的事是什么",go:"fc_li_steward"}
]};
N["fc_li_steward"]={tag:"main",place:"自由城邦 · 交汇城 · 商会街",pace:"normal",text:[
"老赵给你指了条路：商会街的账房里，坐着一位李管事，专替各家商号收拢跑腿的散人。",
"你找上门时，李管事正对着三本账本发愁。他四十出头，头发梳得一丝不苟，眼下却带着熬夜的乌青。听你说明来意，他直截了当：“散活有，但不养闲人。三条，你挑一条。”",
"“其一，城东货栈缺人守夜，一夜三个银月，就是闷；其二，码头有船要卸货，明早开工，按件算钱，伤腰；其三，”他压低声音，“有个活儿钱多，但得胆大——替我去城南的下水道入口盯一夜，看有没有人往里运东西。只看，不碰，别被发现。”",
"他把三张条子推到你面前：“想清楚了再选。选前两个，明早来上工；选第三个，今晚子时，南六号井盖见。”"
],options:[
{t:"接守夜的活（稳当）",effect:{flag:"fc_job_guard"},go:"fc_choice"},
{t:"接码头的活（来钱快）",effect:{flag:"fc_job_dock"},go:"fc_choice"},
{t:"接盯下水道的活（胆大的）",effect:{flag:"fc_job_sewer"},go:"fc_choice"}
]};
N["fc_job"]={tag:"main",place:"自由城邦 · 交汇城",pace:"normal",text:[
"白天你在交汇城转了一圈，把各色活计掂量了一遍。",
"码头的活儿最重，钱也最实在；商会的活儿最轻，可账房先生看人先看衣领；只有冒险者公会的布告板，什么人都收。",
"你在公会门口站了一会儿，看着进进出出的冒险者——有穿旧皮甲的刀客，有背着法杖的术士，还有一个矮人扛着比人还高的锤子，轰隆隆地走过。",
"你摸了摸兜里那点钱。这座城不会白白养人，你总得先站稳一只脚，才能想更远的事。"
],options:[
{t:"接冒险者公会的委托（见见世面）",go:"fc_choice"},
{t:"帮码头卸货攒钱（踏实）",go:"fc_choice"},
{t:"替商会跑腿送货（多条人脉）",go:"fc_choice"}
]};
N["fc_box"]={tag:"main",place:"自由城邦 · 交汇城 · 南六号井盖",pace:"normal",text:[
"子时，你摸到城南的六号井盖。",
"井盖半掩着，底下透出一线昏黄的光。你掀开一角，看见一段砖砌的台阶通向深处。潮湿的墙面上，有人用白垩画了一个标记：一圈一环，像一只眼睛。",
"台阶尽头，隐约传来搬运东西的声响——很轻，像有人在把重物往水里沉。",
"你缩回井盖旁，犹豫了片刻。这条路通向的，可能是今晚的答案，也可能是回不来的地方。"
],options:[
{t:"下去看个究竟",go:"fc_box_a"},
{t:"记下位置，先撤（来日方长）",effect:{flag:"fc_sewer_seen"},go:"fc_choice"},
{t:"回去找伊芙琳商量",go:"fc_box_c"}
]};
N["fc_box_a"]={tag:"branch",place:"自由城邦 · 交汇城 · 下水道",pace:"normal",text:[
"你顺着台阶下到水道里。",
"水只到脚踝，但底下的淤泥厚得惊人。你贴着墙走了几十步，看见前方拐角处有一间用木板隔出来的小屋，门虚掩着，门缝里漏出那线昏黄的光。",
"你凑近门缝——屋里没有人，只有一张木桌、一盏油灯，和桌上一个巴掌大的木盒。木盒上钉着七枚铜钉，钉头刻着极细的纹路，像是某种阵。",
"你正想推门，身后忽然传来脚步声。你回头，一道人影从阴影里走出来——是那个左臂缠着绷带的半精灵，伊芙琳。",
"她看着你，又看着那间小屋，眉头拧起来：“你也找到这儿了。这盒子，我盯了它三天。”"
],options:[
{t:"一起看看这盒子",go:"fc_box_b"},
{t:"问她：这盒子是什么来路",go:"fc_box_b"}
]};
N["fc_box_b"]={tag:"branch",place:"自由城邦 · 交汇城 · 下水道木屋",pace:"normal",text:[
"伊芙琳推开门，把木盒捧到灯下。七枚铜钉在火光里泛着暗红的光。",
"她用匕首尖挑了挑钉头，摇头：“封死的。钉上的纹是守阵，硬撬会炸——我见过这种东西炸过一次，把半条巷子掀了。”",
"她把盒子放回桌上，看向你：“这东西不该出现在下水道里。它不是给活人用的。”",
"她沉默了一会儿，说：“我今晚本来要把它带走。既然你撞见了，我改主意了——你把它留着。收好，别让任何人看见。等你想明白了它是什么，再来找我。”",
"她把盒子推到你面前，转身消失在黑暗里。你站在原地，听见水声在空旷的水道里渐渐远去。"
],options:[
{t:"收下木盒（记住伊芙琳这份托付）",effect:{item:"七钉木盒"},onOk:{flag:"fc_box_kept"},go:"fc_choice"}
]};
N["fc_box_c"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"light",text:[
"你回到跛脚酒桶时，伊芙琳正坐在角落的老位置上。",
"你走过去，把南六号井盖的事说了。她听完，没有立刻答话，而是用匕首尖在桌面上轻轻划了一道。",
"“你胆子不小。”她说，“那井盖下的东西，我追了半个月。里面的人不运货，运的是‘人’——活的人，绑着，堵着嘴，装进木箱。”",
"她抬起眼看你：“你能找到那地方，说明眼睛不瞎。下次再探，叫上我。两个人，总比一个人走得远。”"
],options:[
{t:"应下这份约定",effect:{flag:"fc_ivy_pact"},go:"fc_choice"}
]};
N["fc_choice"]={tag:"main",place:"自由城邦 · 交汇城",pace:"normal",text:[
"三天过去，你在交汇城站稳了脚。",
"你有了住处，有了活计，有了一两个能说话的人。这座城像一台大机器，你终于挤进了它的齿轮缝里——虽然还很小，但转起来了。",
"夜里你坐在跛脚酒桶的窗边，看着城里的灯火。蜜尔娜的话还在耳边：这城里有的是比你急的事。你也开始想：自己究竟要往哪儿去。",
"北边铁门关在打仗，西境的风沙粗粝，死亡沙漠的商队总丢人，东境据说有一座叫晨天的故都，藏着旧朝的秘密。每一扇门都通向一个不同的答案。",
"你握着那杯温麦酒，觉得该做个决定了。"
],options:[
{t:"往北，去铁门关看看战场的样子",go:"fc_road_north"},
	{t:"往北，去艾尔达魔法学院求学",go:"acad_road_1"},
{t:"往西，去荒原上的游侠学院",go:"fc_road_west"},
{t:"往南，跟着商队进死亡沙漠",go:"fc_road_desert"},
{t:"往东，去东境打听晨天城的消息",go:"fc_road_east"},
{t:"先不急着走——夜深了，想想自己为什么出发",go:"fc_ideal_hub"}
]};
N["fc_ideal_hub"]={tag:"branch",place:"自由城邦 · 交汇城 · 跛脚酒桶",pace:"normal",text:[
"夜深了，酒馆打烊。蜜尔娜把最后一只椅子扣上桌，吹熄了大半的灯，只留你窗边这一盏。她看了你一眼，没说什么，转身进了后屋。",
"只剩你一个人坐在窗边。街上偶尔走过一队巡夜的，靴子声在石板路上响一阵，又远了。",
"烛火被风摇得忽明忽暗。你盯着那团火，想起出发那天，自己站在路口说的那句话——那句话决定了你这一路会往哪儿看。",
"后来你走过很多路，遇过很多人，可那句说出口时连自己都没听清的话，一直悬在心头，像一枚扎进树皮里的钉，拔不出来，也忘不掉。",
"现在，它又在心里响起来了。",
"窗外的风换了方向，吹得烛火弯了一下腰。你听见自己的心跳，一下，一下，比街上的更夫敲的更鼓还清楚。"
],options:[
{t:"【理想·富甲天下】想起要让看不起你的人低头（确认理想）",req:function(){return S.ideal==="wealth";},go:"goal_intro_wealth"},
{t:"【理想·威震四海】想起要让人人都听过你的名号（确认理想）",req:function(){return S.ideal==="might";},go:"goal_intro_might"},
{t:"【理想·守护苍生】想起要让普通人睡个安稳觉（确认理想）",req:function(){return S.ideal==="guard";},go:"goal_intro_guard"},
{t:"【理想·探寻真相】想起要翻出世界的秘密（确认理想）",req:function(){return S.ideal==="truth";},go:"goal_intro_truth"},
{t:"【理想·自由自在】想起风往哪儿吹就往哪儿走（确认理想）",req:function(){return S.ideal==="free";},go:"goal_intro_free"},
{t:"【理想·登临神座】想起要站上最高处俯瞰人间（确认理想）",req:function(){return S.ideal==="god";},go:"goal_intro_god"},
{t:"【理想·名留青史】想起要让百年后的人记得你（确认理想）",req:function(){return S.ideal==="fame";},go:"goal_intro_fame"},
{t:"【理想·以血还血】想起要亲手讨回那笔账（确认理想）",req:function(){return S.ideal==="revenge";},go:"goal_intro_revenge"}
]};
/* ===== A-2 四去向启程占位（E-1 过渡章将扩充为 2 节点旅途链） ===== */
N["fc_road_north"]={tag:"main",place:"自由城邦 · 北门",pace:"normal",sceneTitle:"过渡章 · 北上",text:[
"你收拾好行囊，在天亮前出了北门。城门洞里还挂着夜里的霜气，守门的卫兵裹着旧棉袄，眼皮都没抬一下，只挥了挥手里的长枪，示意你走。",
"官道向北，越走越冷。道边的土墙上刷着征兵告示，墨迹还没干，被风一吹，纸角扑扑地响。北境的群山在晨雾里露出一线青灰色的轮廓，像一道沉默的墙。",
"你回头看了一眼交汇城。城门在身后合拢，人声渐渐远了。前方是铁门关，是战场，也是你想去弄明白的地方。",
"风从北边灌过来，带着一股烟火气——那是烧焦的味道，也是做饭的味道，混在一起，分不清是战场的烟，还是人间的炊。你紧了紧衣领，迈步向北。"
],options:[
{t:"启程，沿着官道往北走",go:"fc_road_north_road"}
]};
N["fc_road_west"]={tag:"main",place:"自由城邦 · 西门",pace:"normal",sceneTitle:"过渡章 · 西行",text:[
"西边的官道比北边荒凉，出了城门就只剩下土路，路边的界碑歪歪斜斜，碑上的字被风沙磨得只剩一道凹痕。",
"风沙扑面，路边的野草被吹得伏在地上，贴着地皮打颤。你听老佣兵说过，西境深处有座游侠学院，不收钱，只看人的心性——还有人说，那片荒原底下，埋着比战争更老的东西，老到连学院里的老师都只肯讲一半。",
"你裹紧斗篷，朝西走。风从荒原深处来，带着沙砾打在脸上，像有人在试探你的决心，一粒一粒，不紧不慢。",
"你低着头，一步不停。身后的城门、人声、灯火，都被风沙一点点吞掉。前方只有灰黄色的天和灰黄色的地，连成一片。"
],options:[
{t:"启程，踩着土路往西走",go:"fc_road_west_road"}
]};
N["fc_road_desert"]={tag:"main",place:"自由城邦 · 南门",pace:"normal",sceneTitle:"过渡章 · 南渡",text:[
"南下的商队每天清晨出发，天不亮就在南门外聚成一串：货车、驮驴、步行的脚夫，还有几匹拴在车后的骆驼。你花了两枚铜星，挤进一辆装满干粮的货车，车板上垫着麻袋，还算软和。",
"出了城，绿意渐渐褪去，土路变成沙路，车辙一深一浅。商队领头的是个晒得黝黑的向导，眼角的皱纹里嵌着沙粒。他回头看了你一眼：“进沙漠的人，头三天会做同一个梦——梦见自己走不出去。熬过第三天，沙漠就认你了。”",
"你躺在货堆上，看着天空由蓝变白，再由白变烫，太阳像一枚烧红的铜钉，钉在天顶不动。死亡沙漠的名字在风里飘，像一句咒语。",
"你闭上眼睛。既然选了这条路，就不回头了。"
],options:[
{t:"启程，随商队南下",go:"fc_road_desert_road"}
]};
N["fc_road_east"]={tag:"main",place:"自由城邦 · 东门",pace:"normal",sceneTitle:"过渡章 · 东行",text:[
"东边的商道最热闹，盐队、绸队、驿马，络绎不绝。你在路边等了一炷香，搭上一支往东走的商队，车把式是个说话带东境腔的中年人，赶车时爱哼一支不成调的小曲。",
"他听说你要去东境，笑了一声：“东境？那边的人只认两样东西——官印和旧账。你要是跟‘晨天’这两个字沾边，连城门都进不去。”他顿了顿，压低声音，“不过你要真跟晨天有渊源，倒是可以去承天城碰碰运气——那边有人专收这种‘旧账’。”",
"“晨天”两个字，让同车的账房先生抬了抬眼。他没说话，只在你下车歇脚时，趁人不注意塞给你一张纸条，上面写着一个地址，字迹工整，像是抄了很多遍的。",
"你展开纸条，又折好收进怀里。东境的路，比商道本身更长。"
],options:[
{t:"启程，随商队东行",go:"fc_road_east_road"}
]};
N["fc_road_north_road"]={tag:"main",place:"北上官道 · 雪原",pace:"normal",sceneTitle:"过渡章 · 北上",text:[
"北上的官道走了三天。越往北，村庄越稀，人烟越少。路边的麦田换成了冻土，最后连冻土也看不见了，只剩白茫茫的雪原，和一条被车辙压实的黑土路。",
"你搭过一段运粮的牛车，赶车的老兵头一路没说话，直到看见远处山脊上冒烟的烽燧，才开口：“进了铁门关的地界，说话做事都得当心。那边的人，先看你的刀，再看你的脸。”",
"第四天傍晚，你翻过一道山梁，看见了铁门关——灰黑色的城墙横在两山之间，城头上飘着北地联军的旗。风从关隘里灌过来，带着铁锈、马粪和兵营伙房的味道。",
"城门口排着长长的车队，运粮的、运铁的、运伤兵的。你挤在人群里，看着城砖上密密麻麻的刀痕箭孔——这座城，不知道挨过多少次打，又站起来多少次。",
"你攥紧行囊，跟着人流走进了城门。身后的雪原正在暗下来，前头的灯火一盏盏亮起。"
],options:[
{t:"不进城，沿山脊绕向更北的第三哨",go:"frontier_entry"},
{t:"进城，去打听铁门关的局势",go:"arrive_north_tiebi"}
]};

N["fc_road_west_road"]={tag:"main",place:"西行土路 · 荒原",pace:"normal",sceneTitle:"过渡章 · 西行",text:[
"西行的土路走了两天，路上的车辙渐渐消失。第三天中午，你在一处塌了半边的驿站歇脚——驿站的水井早就干了，只剩井台上一条磨得发亮的绳痕，不知道是多少年多少双手留下的。",
"傍晚，你远远看见荒原尽头立着一道灰褐色的高墙，墙内露出几座尖顶——那是西境行省会的边墙。墙外扎着一圈帐篷，骆驼和驮马挤在一起，炊烟从帐篷缝里冒出来，是商队的营地。",
"你走近时，一个裹着沙巾的驼队头领拦住你，上下打量：“独身进西境？”他摇摇头，“里头乱。行省会三天前刚戒了严，说是荒原上的元素风暴又起了一股。”",
"他指了指高墙的方向：“你要么搭我们的商队，明天一起进城；要么——你身上带了什么家伙没有？”",
"你摸了摸行囊里的武器。风又起了，沙粒打在脸上，火辣辣的。"
],options:[
{t:"搭商队进城",go:"arrive_west_huangyuan"},
{t:"自己走，不搭队",go:"arrive_west_huangyuan"}
]};

N["fc_road_desert_road"]={tag:"main",place:"南下沙路 · 沙漠边缘",pace:"normal",sceneTitle:"过渡章 · 南渡",text:[
"商队走了四天，绿洲越来越密，也越来越多——不是草木的绿，是水的绿。第四天黄昏，向导指着前方一处灰白色的城墙说：“到了，沙漠边缘的绿洲集市。”",
"那是一座建在沙丘背风处的城，城墙不高，却厚得出奇，墙上刷着防沙的灰泥。城门两侧挂着水袋和驼铃，叮叮当当，在风里响成一片。",
"你跳下货车，脚踩在沙地上，松软得像踩进一床旧棉被。向导拍拍你的肩：“进了城，先买水，再找活计。城里头管水的是‘水官’，得罪谁也别得罪他。”",
"你谢过他，朝着城门走去。风从沙漠深处吹来，带着热气和一股说不清道不明的腥味——像是有什么东西，在沙底下翻身。",
"你回头看了一眼来路。来时的脚印，已经被风抹平了。"
],options:[
{t:"进城，找地方歇脚",go:"arrive_desert_lvzhou"}
]};

N["fc_road_east_road"]={tag:"main",place:"东行商道 · 官道",pace:"normal",sceneTitle:"过渡章 · 东行",text:[
"东行的商道走了五天，越走越热闹。沿途的村镇从土房变成瓦房，路也从土路变成夯实的官道。道边的驿站挂着官府的旗，驿卒骑着快马来回穿梭，马蹄声一串接一串。",
"第五天傍晚，商队在一处岔路口歇脚。车把式指着东南方向说：“那边，再走两天，就是承天城了。”他顿了顿，“不过进城之前，你最好想清楚——承天城的规矩，比官道上的辙印还深。”",
"你躺在车板上，看着天空由红变紫，再由紫变黑。远处承天城的方向，隐约有一线灯火，像一条卧在地平线上的火龙。",
"账房先生塞给你的那张纸条，还压在怀里。你摸了一下纸角，想着那张纸条上写的地址——东境官署街，旧档房，一个叫“沈”的人。",
"你闭上眼睛。东境的路，就要到头了。"
],options:[
{t:"天亮后进城，去承天城看看",go:"east_gov"}
]};

/* /u1inj:data-nodes:dn_frontier.js/ */
/* ===== 七锚之约 · 卷A 北境之霜 · 第三哨区域骨架（M1 20260910）=====
   入关链 + 要塞hub + 铜钟线 + 老卒支线 + 观览节点
   tag:main  pace 全带  V66白描  30治理词全禁  arc:arc_frontier  vol:vol_north
   ===== */
(function(){
if (typeof window.N === "undefined") { window.N = {}; }
var N = window.N;

N["frontier_entry"]={tag:"main",place:"北境 · 第三哨 · 雪原山口",where:"白昼",pace:"deep",sceneTitle:"卷 A · 北境之霜 · 入关",arc:"arc_frontier",vol:"vol_north",text:[
"你没有进铁门关。在关城东边三里处，你离开官道，沿着一道被雪埋了半截的山脊向北绕行。带路的是一个赶着空雪橇的老猎户，他听说你要去第三哨，把烟杆在雪橇沿上磕了磕，半天没说话。",
"雪橇在冻硬的雪壳上滑了大半日。天擦黑的时候，老猎户把缰绳一收，指着前方山坳里几点灯火说：“那就是第三哨。联盟最北的钉子，再往北，就没有人烟了。”他顿了顿，补了一句：“那里的人，一半是兵，一半是鬼。你去了自己分。”",
"灯火看着近，走起来还有小半个时辰。风从山口灌进来，把雪沫吹成一条条白蛇，贴着地皮游走。远处的灯光明明灭灭，偶尔传来一声铜钟的余响——沉闷，悠长，像从地底下敲上来的。",
"你在山口停下，回望来路。铁门关的灯火已经缩成天边一小点。前方，第三哨的城墙在雪光里立着，墙砖冻得发黑，墙头上巡夜的兵扛着枪，步子一顿一顿的，像在数着什么。"
],options:[
{t:"走上前，向哨兵递上你的来意",go:"frontier_gate"}
]};

N["frontier_gate"]={tag:"main",place:"北境 · 第三哨 · 城门",where:"黄昏",pace:"normal",sceneTitle:"卷 A · 北境之霜 · 入关",arc:"arc_frontier",vol:"vol_north",text:[
"城门洞很窄，只容一辆马车通过。门洞里点着一盏油灯，火苗被风吹得歪向一边，照得守门哨兵的脸一半明一半暗。他把长枪横过来，枪尖离你胸口三寸。",
"“第三哨不收闲人。”他的声音像砂纸磨铁，“要么有军令，要么有货，要么有命——你占哪一样？”",
"他身后，城门洞里贴着三张告示：一张征兵令，墨迹还新；一张粮价表，数字被人用炭笔画了又改；还有一张是悬赏，画着一头独狼，狼眼处被人抠了个洞。"
],options:[
{t:"“我应征来的，要当兵。”",go:"frontier_gate_army"},
{t:"“我是行商，运货经过，想找个歇脚的地方。”",go:"frontier_gate_trade"},
{t:"“我听说这北边有怪事，想来弄个明白。”",go:"frontier_gate_roam"}
]};

N["frontier_gate_army"]={tag:"main",place:"北境 · 第三哨 · 城门",where:"黄昏",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"哨兵上下打量你，目光停在你手上——他看的是你虎口和指节上的茧。他放下枪，朝门洞里喊了一声：“登记！”",
"门洞里钻出一个裹着皮袄的文书，手里攥着半截炭笔和一卷皱巴巴的纸。他让你报上姓名、年岁、出身，又问了一句：“杀过人没有？”不等你答，他自顾自地在纸上画了个勾：“没杀过的也当杀过记。到了这儿，早晚的事。”",
"他撕下纸角递给你，上面画着一道歪歪扭扭的符记：“拿着，去营房找军需官。第三哨不养闲兵，明早天不亮出操，误了时辰，罚你扫一个月马厩。”"
],options:[
{t:"接过纸角，进营房报到",go:"frontier_barracks"}
]};

N["frontier_gate_trade"]={tag:"main",place:"北境 · 第三哨 · 城门",where:"黄昏",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"哨兵没接话，先绕到你的货担后面，用枪尖挑了挑盖布。你带的不过是些盐、布和几包伤药——进城前你特意把值钱的东西都留在了铁门关。",
"“盐和药，进。铁器，扣。”他把枪收回去，朝门里喊，“验货的，来个人！”",
"一个驼背的老头从门洞里走出来，眯着眼翻了翻你的货，在账本上记了几笔，又抬头看你：“货在哨上卖，抽三成。不乐意，现在就掉头，雪还下得不大。”"
],options:[
{t:"点头应下，把货担扛进城",go:"frontier_sergeant"},
{t:"“三成太狠了，我再想想。”",go:"frontier_gate"}
]};

N["frontier_gate_roam"]={tag:"main",place:"北境 · 第三哨 · 城门",where:"黄昏",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"哨兵听见你这句话，反倒多看了你一眼。他没有立刻放行，把长枪往地上一拄，问：“你听说了什么怪事？”",
"你正要说，城门洞里那盏油灯忽然爆了一下，火苗蹿起老高，又缩回去。哨兵眯着眼，盯着火苗看了几息：“灯芯又该剪了。”他语气平平，但按在枪杆上的手，指节是白的。",
"他让开半个身位：“进去找军需官，他会问你。第三哨的规矩——‘进了门，嘴要严；出了门，命要紧。’记住了。”"
],options:[
{t:"道一声谢，进城去找军需官",go:"frontier_sergeant"}
]};

N["frontier_barracks"]={tag:"main",place:"北境 · 第三哨 · 兵营",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"兵营是一排石头屋子，屋顶压着厚厚的雪。你进门的时候，十几个兵正围着一口大铁锅喝稀粥，锅边摆着一筐黑乎乎的硬饼。没人抬头看你，只有靠门的一个老兵把碗往桌上一顿，说：“新来的？铺位在里头，别占我的床。”",
"屋里弥漫着皮靴、汗味和烧木头的烟味。墙角的火炉上煨着一壶水，水汽咕嘟咕嘟地顶壶盖。你找了张空铺放下行囊，床板是松木的，还带着新鲜的锯末味——这张床，好像刚腾出来没多久。",
"隔壁铺的老兵见你打量床板，凑过来压低声音：“这床的上一个主人，半个月前巡夜回来，说是看见钟楼顶上站着个人。第二天一早，人就没了。被褥还在，人没了。”他拍了拍你的肩，“别多想，睡吧。哨上的人，走得多，回得少。”"
],options:[
{t:"把这件事记在心里，先去见军需官",go:"frontier_sergeant"}
]};

N["frontier_sergeant"]={tag:"main",place:"北境 · 第三哨 · 军需处",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"军需官是个独臂的汉子，左袖空荡荡的，用一根皮绳系着。他坐在账桌后面，桌上摊着一本厚厚的账册，册角被翻得毛了边。他先看了你的纸角，又看了你的脸，问：“识字吗？”",
"“识。”你说。",
"“那好。”他用独手蘸了蘸唾沫，翻到账册最后一页，指着上面一行空白，“第三哨正缺个能记事的。你白天跟队巡逻，晚上帮我誊账。饷银照发，口粮减半——减的那半，算你交学费。”",
"他撕下账页背面一张皱巴巴的硬纸递给你，上面画着哨上的布局：“这是第三哨的图。城不大，七个地方你要记熟：钟楼、矿洞、军械库、伤兵营、流民营、箭楼、城墙。不该去的地方，别去；该看的东西，看了别说。”"
],options:[
{t:"把图纸收好，先在哨上转一圈",go:"frontier_city"}
]};

N["frontier_city"]={tag:"main",place:"北境 · 第三哨 · 要塞内",where:"白昼",pace:"normal",sceneTitle:"第三哨 · 要塞",arc:"arc_frontier",vol:"vol_north",text:[
"第三哨不大，站在城墙根下，一嗓子能喊到另一头。雪水顺着屋檐滴下来，在墙根冻成一条条冰挂。街上的兵不多，更多的是扛着木料修墙的苦力、赶着驮兽的商人，还有裹着破棉袄缩在墙角晒太阳的老人。",
"哨上的日子有自己的节奏：清晨钟响出操，午间换岗，入夜封门。铜钟就挂在城中最高的钟楼上，锈迹斑斑，却擦得干净——擦钟的老卒说，这口钟比这座城还老，老到没人记得它是谁铸的，只记得它响的时候，必有大事。",
"你站在十字路口，四面是青黑色的石屋和雪白的屋顶。风把烟囱里的烟吹成斜斜的白线。有一瞬间，你觉得这座城不像兵营，更像一只蹲在雪原上的老兽，闭着眼，耳朵却一直竖着。"
],options:[
{t:"去钟楼看看那口铜钟",go:"frontier_tower_gate"},
{t:"去矿洞口看看（守卫拦着）",go:"frontier_mine_gate"},
{t:"打听老兵老铁的下落（他昨夜失踪了）",go:"frontier_tie_1"},

{t:"去军械库转转",go:"frontier_armory"},
{t:"去伤兵营看看",go:"frontier_infirmary"},
{t:"去流民营看看",go:"frontier_camp"},
{t:"上城墙，沿着墙根巡逻一圈",go:"frontier_snow"},
{t:"去战报栏看看最新的消息",go:"frontier_herald"},
{t:"（离城，回铁门关方向）",go:"frontier_leave"}
]};

N["frontier_tower_gate"]={tag:"main",place:"北境 · 第三哨 · 钟楼脚下",where:"白昼",pace:"light",arc:"arc_frontier",vol:"vol_north",text:[
"钟楼是第三哨最高的石头建筑，塔身被风雪打磨得圆润，砖缝里塞着干枯的苔藓。楼门虚掩着，门环上拴着一根红布条，被风吹得猎猎响。",
"你推门进去，楼梯又窄又陡，光线从高处的小窗漏进来，一格一格地爬在墙上。越往上走，风越大，铜钟的嗡鸣声越清楚——不是有人在敲，是风穿过钟身，自己发出的声音。"
],options:[
{t:"登上钟楼顶，看那口铜钟",go:"frontier_bell_1"}
]};

N["frontier_bell_1"]={tag:"main",place:"北境 · 第三哨 · 钟楼顶",where:"白昼",pace:"deep",sceneTitle:"铜钟之下（一）",arc:"arc_frontier",vol:"vol_north",text:[
"钟楼顶上风很大，吹得你衣摆猎猎作响。那口铜钟就挂在楼顶的木梁下，比两个人还高，钟身上爬满了青绿色的铜锈，却有一处被磨得发亮——那是敲钟的杵常年碰触的地方。",
"钟楼四面无墙，只有半人高的石栏。你扶着石栏往下看，整座第三哨尽收眼底：兵营的屋顶、军械库的铁门、流民营升起的炊烟，还有远处白茫茫的雪原，一直铺到天边。",
"看钟的是一个头发花白的老卒，他坐在石栏根下，膝盖上搭着一块油布，手里拿着一张砂纸，正在打磨铜钟底沿的一块凹痕。他听见你的脚步声，头也没抬：“看钟，还是看景？”",
"你凑近细看那块凹痕——那不是磕碰的痕迹，是被人用刀硬生生刻进去的。刻痕很深，笔划粗粝，像是一枚铁牌的轮廓：方方正正，中间一道竖纹。老卒顺着你的视线，把砂纸放下，说：“三十年了。每回有人问起这刻痕，过不了几日，哨上就要出事。”"
],options:[
{t:"“这刻痕是谁留下的？”",go:"frontier_bell_2"},
{t:"（记下刻痕的样子，退下钟楼）",go:"frontier_city"}
]};

N["frontier_bell_2"]={tag:"main",place:"北境 · 第三哨 · 钟楼顶",where:"黑夜",pace:"deep",sceneTitle:"铜钟之下（二）",arc:"arc_frontier",vol:"vol_north",text:[
"当夜你宿在兵营。后半夜，你被一声闷响惊醒——不是雷，是钟。钟声没有敲满，只响了一记，像是被人捂住又松开，沉甸甸地砸在雪夜里。",
"你披衣出门，哨上的灯火都熄了，只有钟楼的窗口透着一点昏黄的光。雪已经停了，月亮在云层后面，把雪地照成一片惨白。你走到钟楼下，仰头看见楼顶有个人影，站在石栏边，一动不动。",
"你正要喊，那人影忽然不见了。紧接着，铜钟又响了一记——这一次，你听清了，那声音不像钟，更像是什么东西在钟里面撞了一下。",
"第二天一早，哨上炸了锅：昨夜巡夜的哨兵王三，失踪了。被褥还是温的，皮靴还摆在床边，人却没了。兵营里翻了个底朝天，最后有人在钟楼底下的雪地里，找到一枚铁牌——方方正正，中间一道竖纹，和钟身上刻的一模一样。"
],options:[
{t:"把那枚铁牌捡起来细看",go:"frontier_bell_3"}
]};

N["frontier_bell_3"]={tag:"main",place:"北境 · 第三哨 · 钟楼下",where:"白昼",pace:"deep",sceneTitle:"首枚铁牌",arc:"arc_frontier",vol:"vol_north",text:[
"铁牌躺在雪地里，四周的雪被踩得乱七八糟。你蹲下来，没有急着碰它——铁牌上凝着一层薄霜，霜下面，刻痕的纹路里嵌着黑褐色的东西，像是干透的血。",
"铁牌巴掌大小，沉甸甸的，材质是生铁，边角磨得圆润，像是被人贴身带了很久。正面刻着一道竖纹，背面刻着两个字，你凑近了才认出来——不是当世文字，笔画古拙，像是上古的写法。",
"你叫来了军需官。独臂汉子看见铁牌，脸色变了一瞬，很快又恢复如常。他接过铁牌，在手里掂了掂，说：“王三巡夜时，脚程最快，眼睛最毒。他要是看见什么不该看的，会先记下来，再动手。”他把铁牌翻过来，指着那两个字，“这两个字，你认得吗？”",
"你摇头。军需官把铁牌收进怀里：“不认得，就别认。第三哨的规矩，有些事情，知道的人越少，活的人越多。”他转身走了两步，又停住，“你昨夜听见钟响没有？”"
],options:[
{t:"“听见了，响了一记，像是被捂住又松开。”",go:"frontier_bell_4"},
{t:"“没听见，我睡得太沉。”",go:"frontier_bell_4"}
]};

N["frontier_bell_4"]={tag:"main",place:"北境 · 第三哨 · 钟楼顶",where:"白昼",pace:"deep",sceneTitle:"铜钟铭文",arc:"arc_frontier",vol:"vol_north",text:[
"军需官没有再问。他让你跟他上钟楼，用一根撬棍把铜钟底沿的一块铜皮撬开。铜皮后面，露出一圈密密麻麻的铭文——不是字，是图：七枚铁牌，首尾相衔，围成一个圆。",
"“这是老辈人说的‘七锚’。”军需官说，“钟身上这圈图，说的是一桩旧事。当年建这座哨的时候，有人在这地底下埋了七枚铁牌，说是镇着地脉的七道口子。铁牌在，地脉安；铁牌丢，地脉乱。”",
"他指着图中一枚铁牌的位置——正好对着钟身上那道刻痕：“三十年前，这枚铁牌的位置，被人用刀刻了个记号。刻记号的人，第二天就死了。王三找到的那枚铁牌，是不是图上画的这一枚，我不知道；但我知道，这口钟，从来不是用来报时辰的。”",
"你低头看着那圈铭文，忽然想起昨夜那记沉闷的钟响——像什么东西在钟里面撞了一下。军需官把铜皮重新盖上，用锤子钉好，拍了拍手上的灰：“这事，烂在肚子里。哨上该出操了。”"
],options:[
{t:"把七锚之图记在脑子里",go:"frontier_bell_5"}
]};

N["frontier_bell_5"]={tag:"main",place:"北境 · 第三哨 · 钟楼顶",where:"黄昏",pace:"normal",sceneTitle:"守钟人",arc:"arc_frontier",vol:"vol_north",text:[
"守钟的老卒姓周，哨上人都叫他老周。收操之后，他拎着一壶热酒上了钟楼，坐在石栏根下，把那块油布铺开，又从怀里摸出两张干饼。他掰了一半递给你，说：“军需官让你来看铭文的？他倒信你。”",
"你接过干饼。老周抿了一口酒，眯着眼看远处：“这钟楼，我守了二十一年。头十年，钟一声不响；后十一年，响了三次——头一回，哨上的将军死在任上；第二回，矿洞塌了，埋了七个人；第三回，就是王三失踪那一夜。”",
"他顿了一下，用指头敲了敲钟身：“这钟响，从来不是好事。可有一桩，我一直没弄明白——它响的时候，钟里面，总有个声音跟着应。像是……这钟底下，还有什么东西，在学它。”",
"老周说完，把酒壶往你手里一塞：“天冷，喝一口。别问太多——问多了，你也会变成钟里那个声音。”"
],options:[
{t:"接过酒壶，抿了一口，记住老周的话",go:"frontier_city"},
{t:"“钟底下有什么东西，你见过吗？”",go:"frontier_old_1"}
]};

N["frontier_old_1"]={tag:"main",place:"北境 · 第三哨 · 酒摊",where:"黑夜",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"老周没有回答你的问题。他把酒壶收了回去，拍了拍屁股上的灰，说：“你明天要是没事，去城西的酒摊坐坐。那儿有个卖酒的，姓钱，能喝，话也多——他知道的事，比我多。”",
"第二天傍晚，你依言去了城西的酒摊。摊子不大，支着一块破帆布，下面摆着几条长凳。卖酒的钱老头是个瘦高个，戴着一顶破了边的毡帽，见你坐下，也不问，先给你倒了一碗浑浊的热酒。",
"酒是粗酿的麦酒，带着一股烟熏味。钱老头在你对面坐下，自己也不喝，就看着你：“新来的？老周让你来的？”你点头。他叹了口气：“老周这个人，什么都好，就是太念旧。三十年了，还记着他那个儿子。”",
"你问：“他儿子怎么了？”钱老头把碗在桌上转了一圈，说：“三十年前，他儿子在矿洞里挖矿。有一天，矿洞里挖出了个东西——没人看清是什么，只知道那天晚上，矿洞塌了。他儿子和另外六个人，埋在了里头。矿洞后来重新开了，但只挖出来六具尸首。他儿子的那一具，到现在也没找到。”"
],options:[
{t:"“那个洞挖出来的东西，没人知道是什么？”",go:"frontier_old_2"},
{t:"（沉默片刻，喝干碗里的酒）",go:"frontier_old_2"}
]};

N["frontier_old_2"]={tag:"main",place:"北境 · 第三哨 · 酒摊",where:"黑夜",pace:"deep",sceneTitle:"老卒旧事",arc:"arc_frontier",vol:"vol_north",text:[
"钱老头摇摇头：“没人知道。矿洞塌了之后，活下来的人都说，那天挖出来的东西，裹着一层黑布，一沾地气，就开始往外渗水。水是黑的，带着一股铁锈味。矿工们都说那是矿脉的水，只有老周的儿子，凑过去看了一眼——就是那一眼，他就开始不对劲。”",
"“怎么个不对劲？”你问。",
"“他回来后，一句话不说，饭也不吃，整宿整宿地坐着，盯着自己的手看。”钱老头压低了声音，“第四天，他自己下了矿洞。别人拦他，他回头说了一句——‘钟底下那个东西，在叫我。’那是他留在世上的最后一句话。”",
"酒摊上的油灯被风吹得摇摇晃晃。钱老头把灯芯拨了拨，说：“老周不恨矿洞，也不恨那塌方。他恨的是，他儿子那天看见的东西，他一直不知道是什么。他守了三十年的钟楼，就是觉得，那东西——迟早还会回来。”",
"你端着碗，酒已经凉了。风从摊外灌进来，带着雪原的气息。远处，钟楼在暮色里立着，像一个沉默的影子。"
],options:[
{t:"（把碗放下，起身，看向钟楼的方向）",go:"frontier_old_3"}
]};

N["frontier_old_3"]={tag:"main",place:"北境 · 第三哨 · 矿洞口",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"第二天一早，你在矿洞口遇见了老周。他没穿军装，穿了一件洗得发白的旧棉袄，手里提着一个陶罐，罐口塞着黄纸。他看见你，没有意外，只点了点头：“来啦。”",
"矿洞口被一扇铁栅栏封着，栅栏上挂着一把生锈的大锁。老周在栅栏外蹲下，把陶罐放在地上，揭开黄纸，里面是半罐米酒。他往地上洒了一半，剩下的摆在栅栏边，说：“三十年了，娃。爹没本事，找不到你。这酒，你先喝着，等爹找到了，再给你补一顿热的。”",
"他说话的时候，没有哭，也没有叹气，就那么蹲着，像是蹲惯了的。风从矿洞里吹出来，带着一股潮气和铁锈味。老周站起身，拍了拍膝盖上的雪，说：“矿洞封了二十年。这锁，是军需官换的，钥匙在他手里。”",
"他走了两步，又停住，没有回头：“你要是有心，帮我问问军需官，那锁，能不能开一次。”"
],options:[
{t:"“我去帮你问问。”",go:"frontier_old_4"},
{t:"“矿洞里……真的还有东西？”",go:"frontier_old_4"}
]};

N["frontier_old_4"]={tag:"main",place:"北境 · 第三哨 · 军需处",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"你回到军需处，把老周的事说了。独臂军需官正给账册翻页，听见你的话，手停了。他抬头看了你一会儿，说：“老周让一个刚来的新兵来替他求情，他自己，是不肯低这个头的。”",
"他从抽屉里取出一串钥匙，挑出一把，放在桌上：“这把是矿洞的钥匙。二十年前封洞的时候，老周就在跟前。他没求过钥匙，我也没给过——不是不肯给，是给了他，他要下洞，我怕他上不来。”",
"“现在你来了。”军需官把钥匙往你面前推了推，“你去问问他，还想不想下去。想下去，我陪你们一起下；不想下去，这把钥匙，就当没这回事。”",
"你握着那把钥匙，铁质的，凉得像握着一块冰。门外，风呜呜地响，像是有人在远处吹一支没有调子的埙。"
],options:[
{t:"把钥匙带给老周，问他去不去",go:"frontier_old_5"},
{t:"（把钥匙还给军需官，说不提了）",go:"frontier_old_5"}
]};

N["frontier_old_5"]={tag:"main",place:"北境 · 第三哨 · 钟楼下",where:"黄昏",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"老周接过钥匙，没有立刻说话。他把钥匙在手里翻来覆去地看了几遍，最后握紧了，说：“去。三十年了，是死是活，总得有个说法。”",
"他说完这话，仿佛松了口气，肩上的分量好像轻了一些。他拍了拍你的肩膀：“小伙子，谢了。不管底下是什么，这份情，老周记着。”",
"你心里记下了这个人情。暮色里，老周把钥匙挂在自己的脖子上，钥匙贴着胸口的旧伤疤，他抬头看了一眼钟楼，又看了一眼矿洞的方向，眼睛里有种说不清的东西——不是怕，也不是恨，更像是一件事，终于要有个了结了。",
"你转身离开时，听见老周在你身后说了一句：“你要是往后在哨上听见钟响，别慌。那是我在底下，敲它报平安。”"
],options:[
{t:"（记住这份情谊，继续在哨上走动）",go:"frontier_city"}
]};

N["frontier_mine_gate"]={tag:"main",place:"北境 · 第三哨 · 矿洞口",where:"白昼",pace:"light",arc:"arc_frontier",vol:"vol_north",text:[
"矿洞口在城西的山脚下，被一扇铁栅栏封得严严实实。栅栏上的锁有拳头大，锁孔里塞着蜡，显然很久没人开过。洞口黑黝黝的，往里看，什么都看不见，只有一股潮气夹着铁锈味，从深处一阵一阵地冒出来。",
"栅栏边蹲着一个瘸腿的老人，是矿工出身的老钱，正拿旧砂纸磨一把短镐；旁边站着一个年轻的哨兵，他看见你走近，把枪一横：“矿洞封了二十年，军令，任何人不得入内。”",
"你注意到，他说话的时候，眼睛一直盯着洞口深处，嘴唇有点发白。你问他怎么了，他摇了摇头，过了好一会儿才说：“没事。就是……你站近一点，能听见底下有水声。可这矿洞，二十年前就抽干了。”"
],options:[
{t:"（侧耳听了一会儿——确实有水声，很轻，像有什么东西在深处流动）",go:"frontier_city"},
{t:"向老钱搭话，问他这矿洞的来历",go:"frontier_mine_1"},
{t:"（不多逗留，转身离开）",go:"frontier_city"}
]};

N["frontier_armory"]={tag:"main",place:"北境 · 第三哨 · 军械库",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"军械库是第三哨最结实的房子，石墙比兵营厚一倍，铁门上着三道锁。管库的工匠姓姜，是个矮壮的中年人，脸上有一道从额角斜到下巴的旧疤。他听说你是新来的，让你登记了姓名，才放你进去。",
"库房里光线很暗，靠墙的架子上摆着长枪、铁盾、弓弩，还有几套修复到一半的皮甲。空气里弥漫着油脂和铁锈混合的气味。姜工匠走到墙角，揭开一块油布，露出下面一柄断刀：“这是上个月巡逻队带回来的，在雪原上捡的。”",
"你凑近看那柄断刀——刀身一半断口齐整，像是被什么东西硬生生咬断的。断口处的金属，泛着一层不自然的青黑色。姜工匠说：“铁是好铁，铸的时候掺了东西。这刀的主人，要么死了，要么——不像是人。”",
"他重新把油布盖上，说：“哨上的规矩，捡回来的东西，都得过我的手。这刀我先收着，你要是感兴趣，等它‘不冷’了，再来看。”"
],options:[
{t:"（记下断刀的事，退出去）",go:"frontier_city"}
]};

N["frontier_infirmary"]={tag:"main",place:"北境 · 第三哨 · 伤兵营",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"伤兵营是哨上最安静的地方。几个伤员躺在床上，有的裹着绷带，有的闭着眼。药味混着草灰味，在屋里弥漫。一个穿着灰布袍的女人正在给一个伤员换药，动作很轻，伤员哼了一声，她停下，等他不哼了，再继续。",
"她是哨上的军医，姓宋。宋军医听见脚步声，头也没回：“新来的？那边柜子上有热水，自己倒。”她顿了顿，“要是没伤没病，就别在这儿站着——这儿的气，不好。”",
"你正要走，靠窗的床上传来一个沙哑的声音：“别走……你过来。”那是个老兵，半张脸裹着绷带，只露出一只眼睛。他看着你，说：“你是新来的？你听我说——雪原上，狼群不对。”",
"宋军医叹了口气，对你说：“他前几天巡逻，被狼群围了。活着回来，是命大。”老兵摇头：“不是狼群……狼群后面，还有别的东西。黑皮的，两条腿的，像人，又不像人。它站在狼群后面，看了我一眼，就带着狼群走了。”"
],options:[
{t:"（把老兵的话记在心里，退出去）",go:"frontier_city"}
]};

N["frontier_camp"]={tag:"main",place:"北境 · 第三哨 · 流民营",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"流民营在城东的城墙根下，用木板和破布搭了一片棚屋。住在这里的多半是从北边逃过来的牧民——兽人南下，草原上待不住了。棚屋之间的空地上升着几堆火，火上架着锅，锅里煮的是稀得能照见人影的粥。",
"你走近的时候，一个八九岁的小姑娘正蹲在火边，拿一根树枝拨火。她看见你，缩了缩脖子，又忍不住盯着你腰间的短刀看。她的母亲从棚屋里出来，把她拉到身后，警惕地看着你：“当兵的，我们交了份子钱的。”",
"你摆手说不是来收钱的。女人的神色松了一些，她把锅里的粥搅了搅，说：“我们是从北边草原来的。兽人今年春天开始打仗，我们的部族被打散了，我带着她，跟着难民队走了两个多月才到这儿。”",
"她顿了顿，声音低下去：“第三哨的人说，我们是麻烦。可我们不是麻烦——我们只是想活着。你要是见着哨上的官，替我们说句话。”小姑娘从母亲身后探出头，手里攥着一根磨尖的骨头，那是她唯一的‘武器’。"
],options:[
{t:"（把口袋里剩下的干粮分给小姑娘）",go:"frontier_city"},
{t:"“你们从草原上来，见过狼群吗？”",go:"frontier_city"}
]};

N["frontier_snow"]={tag:"main",place:"北境 · 第三哨 · 城墙上",where:"白昼",pace:"normal",arc:"arc_frontier",vol:"vol_north",text:[
"城墙不高，约莫两丈，墙头能并排走两个人。你沿着墙根的石阶上去，风立刻把你兜了个满怀——城墙上的风，比城里的要大得多，吹得人睁不开眼。",
"墙外是白茫茫的雪原，一直铺到天边，雪地上有几道深色的痕迹，那是狼群和兽人队伍走过的路。墙垛子上架着几口铁锅，锅里烧着热油——这是对付攀墙敌人的老法子。",
"巡墙的老兵见你上来，递给你一片干肉：“嚼着，暖和。你是新来的？告诉你个事——墙外那些雪地上的印子，最近多了。以前狼群都是贴着山脊走，现在，它们敢靠城墙根了。”",
"他眯着眼看远处的雪原：“狼这种东西，有狼王领着，才敢靠近人的城。你说，那狼王，是谁？”他说完自己笑了，拍了拍你的肩，又继续巡逻去了。"
],options:[
{t:"（站在城墙上，把远处的雪原看了个遍）",go:"frontier_city"}
]};

N["frontier_herald"]={tag:"main",place:"北境 · 第三哨 · 战报栏",where:"白昼",pace:"light",arc:"arc_frontier",vol:"vol_north",text:[
"战报栏在兵营门口，一块钉在墙上的木板，上面贴着几张纸，被风雪吹得翘起了角。你凑过去看——",
"第一张是军报：南方的净化令闹得凶，审判官在各城邦查奥术师，铁门关要求各哨核对往来人员名册。第二张是粮价：运粮队上个月被劫了两回，粮价又涨了三成，哨上开始限量供粥。第三张是悬赏：北境草原上，有人悬赏一颗狼王的头，赏金三百银月——落款处画着一头独狼，和城门那张悬赏一模一样。",
"风把纸角掀起，露出纸背面一行小字，像是谁用炭笔随手写的：“第三哨的钟，今年已经响了两回。”你记住这行字，转身离开。"
],options:[
{t:"（把战报栏的消息记在心里）",go:"frontier_city"}
]};

N["frontier_leave"]={tag:"main",place:"北境 · 第三哨 · 城门",where:"白昼",pace:"light",arc:"arc_frontier",vol:"vol_north",text:[
"你在第三哨待了些时日，把哨上的事都摸了个大概。这天一早，你收拾好行囊，向军需官辞行。独臂汉子没有挽留，只从抽屉里拿出一块干粮和一包盐，放在桌上：“路上用。”",
"他顿了顿，又说：“第三哨的门，白天晚上都开着。你什么时候想回来，报个名字就行。”",
"你出城门的时候，回头看了一眼。钟楼在晨光里立着，老周的身影隐约出现在楼顶，正弯腰擦拭那口铜钟。远处，矿洞的铁栅栏还是锁着，锁孔里的蜡，在阳光下泛着一点温润的光。",
"你转身，走进雪原。风从北边来，带着雪沫和遥远的、若有若无的钟声。"
],options:[
{t:"返回铁门关方向",go:"arrive_north_tiebi"}
]};

})();

/* /u1inj:data-nodes:dn_frontier_deep.js/ */
/* ===== /v91inj:dn/ M2 第三哨钥匙寻踪 + 封印抉择 + 双支线 + 铜钟守卫战 =====
 * 七锚之约 卷A 深化（N["id"] 全对象式；arc:"arc_frontier"；vol:"vol_north"）
 * 涉及设定：七锚/铁牌（锚2矿洞、锚1铜钟）、深渊封印（seal 主线 day200 联动，不改判定）、
 *           黑皮人影组织（雪原狼群指挥者）、金先生=金秤（墓园无字碑，卷C前置）、陆昭鸦羽（金库）、费尔曼（学院）
 */
(function () {
  "use strict";
  var N = window.N || (window.N = {});
  if (typeof window.N === "undefined") window.N = N;

  /* ---------- 矿洞线（锚2 · 水声与铁链） ---------- */
  N["frontier_mine_1"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞口", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 矿洞口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "矿洞口堆着半人高的碎石，洞口架了一道木栅栏，栅栏上挂一块牌子：塌方禁入。",
      "守洞的是个叫老钱的矿工，瘸着一条腿，正蹲在栅栏边剥一碗冻硬的豆子。他听你提矿洞，先不说话，把豆子一颗一颗数完，才抬眼：“矿头刘三，上个月死在这洞里。埋都没埋出来。”",
      "他朝洞深处努努嘴：“水声听见没有？二十年前封洞那会儿就有，一天没停过。刘三不信邪，非要下去找什么矿脉，结果塌方压死的。你要下去，签生死状。”"
    ],
    options: [
      { t: "签生死状，下去看看（需要铁锹与火把）", go: "frontier_mine_2" },
      { t: "先回哨上转转", go: "frontier_city" }
    ]
  };

  N["frontier_mine_2"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞巷道", where: "任意", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 矿洞巷道」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "洞里的空气潮得发沉，火把烧起来都是黄的，照不亮三步以外。巷道两壁的矿脉早被挖空，只剩黑黢黢的凹槽，顶上不时滴下水，砸在石头上，一声接一声。",
      "你走了约莫百步，听见那水声大了——不是滴水，是闷闷的、一波一波的响，像有人在地底翻动一大锅稀粥。老钱在洞口喊了一句：“到底了就回，别往里。”",
      "前方塌了一面墙，碎石堆到腰高。石缝里露出一截木柄，像是矿镐。"
    ],
    options: [
      { t: "把木柄拽出来看看", go: "frontier_mine_3" },
      { t: "贴着石壁往里挤", go: "frontier_mine_3" }
    ]
  };

  N["frontier_mine_3"] = {
    tag: "main", place: "北境 · 第三哨 · 坍塌巷道", where: "任意", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 坍塌巷道」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "木柄拽出来，是一把断了头的矿镐，镐柄上刻着一个“刘”字。石堆下面压着一只掀翻的藤箱，箱盖裂了，滚出几样东西：一盏砸扁的矿灯、一卷浸透水的账本、半张烧过的羊皮纸。",
      "羊皮纸上画着一幅草图——像是一条巷道的地形，中间用红炭标了个叉，旁边写了两个小字：锚线。叉的位置，就在这面塌墙更深处。",
      "账本翻开来，刘三的字迹糊了大半，只有末页几行还能认：“……三更闻水响，去到底。那东西不是水。铁链。拴着一口……”字到这里断了，页脚有一道深深的指甲刮痕。"
    ],
    options: [
      { t: "把草图与账本收进怀里，扒开石堆往里走", go: "frontier_mine_4" },
      { t: "先退回洞口，把发现告诉老钱", go: "frontier_mine_8" }
    ]
  };

  N["frontier_mine_4"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞深坑", where: "任意", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 矿洞深坑」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "石堆后面是一条斜向下的窄道，你侧着身子滑了十几步，脚底突然踏空——火把一晃，照出个三丈见方的深坑。坑底积着半尺黑水，水面上浮着一层铁锈似的油花。",
      "水声就是从这坑底来的。你蹲在坑边听了半晌，那响动隔着水，闷闷的，一下，又一下，不紧不慢，像是有人在坑底用什么硬物一下一下敲石壁。",
      "坑壁离水两尺的地方，钉着一枚铁环，铁环上拴着一截手臂粗的铁链。链子垂进水里，绷得笔直——水底下那头，拴着东西。链子上磨出一道亮痕，说明底下那东西动过，而且力气不小。"
    ],
    options: [
      { t: "拽住铁链，用力往上拉", go: "frontier_mine_5" },
      { t: "用火把照水面，先看清底下是什么", go: "frontier_mine_6" }
    ]
  };

  N["frontier_mine_5"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞深坑", where: "任意", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 矿洞深坑」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你双手攥住铁链，脚蹬坑壁往上拽。链子一寸一寸地出水，锈水顺着你的手腕淌。拽了七八下，链子那头猛地一沉，你脚下打了个趔趄，差点栽进坑里。",
      "水下传来一声响——不是水声，是一声长长的、贴着石壁滑过去的闷响，像什么大家伙翻了个身。你手里的链子松了半尺，又绷直了。",
      "链头拽上来的部分，系着一块巴掌大的铁牌，方方正正，中间一道竖纹，和钟楼上刻的那枚轮廓一模一样。牌面锈透了，只有边角露出一点银亮的底色。"
    ],
    options: [
      { t: "把铁牌摘下收好，松链退出", go: "frontier_mine_7" },
      { t: "把铁牌留在原处，原样退出", go: "frontier_mine_7" }
    ]
  };

  N["frontier_mine_6"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞深坑", where: "任意", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 矿洞深坑」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "火把往前探，黑水照不透，只映出你自己的影子。你把火把换到左手，贴着坑壁伏下身子，让火光照进水里——水色发黑，油花底下，隐约有一片灰白的东西，贴着坑底，一动不动。",
      "是骨头。一大片骨头，肋骨、腿骨、还有半副拼不齐的骨架，全泡在黑水里，码得整整齐齐，头骨都朝着同一个方向——朝坑壁最深那道裂缝。",
      "裂缝里嵌着一枚铁牌，方方正正，中间一道竖纹。风从裂缝里灌出来，带着一股又潮又腥的寒气。你身上的火把焰苗被吹得朝后倒，几乎要灭。"
    ],
    options: [
      { t: "伸手进裂缝，把铁牌抠出来", go: "frontier_mine_5" },
      { t: "不碰那牌子，退出矿洞", go: "frontier_mine_8" }
    ]
  };

  N["frontier_mine_7"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞深坑", where: "任意", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 矿洞深坑」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "铁牌到手，沉甸甸的，冰得扎手。你把链子放回水里，链子沉下去，那闷响也跟着远了，像是底下的东西退进了更深处。",
      "你扶着坑壁爬回窄道，回头看了一眼——黑水还在，油花还在，只是那一下一下的敲击声，停了。",
      "洞口的光透进来的时候，你出了一身冷汗。铁牌贴着胸口，硌得生疼。"
    ],
    options: [
      { t: "回到哨上，把这枚铁牌与钟楼刻痕比对", go: "frontier_mine_8" }
    ]
  };

  N["frontier_mine_8"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞口", where: "任意", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 矿洞口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "老钱还在栅栏边剥豆子，看你出来，上下打量你一眼：“活着出来了？刘三可没这运气。”",
      "你把矿镐柄上的“刘”字给他看，他愣了好一会儿，把碗放下，又端起来，半晌说：“刘三是个犟驴。去年冬，他说洞底下那水声不对，要去找源头。我劝过他，他不听。”他顿了顿，“他死那天，账本少了一页。”",
      "你从怀里掏出那半张羊皮纸草图，老钱接过去看了半天，指着那个红叉：“这地方……是二十年前封洞的主巷道。封洞那晚，是矿主亲自带人填的土，说底下出了矿难。现在想想，矿难死了几个人，谁也没见过尸首。”"
    ],
    options: [
      { t: "把铁牌和草图收好，谢过老钱，回哨上", go: "frontier_city" },
      { t: "追问封洞那晚的事", go: "frontier_mine_8b" }
    ]
  };

  N["frontier_mine_8b"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞口", where: "任意", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 矿洞口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "老钱又剥了一颗豆子，才说：“封洞那晚我在场。矿主带人抬了三口棺材出来，说是瓦斯炸的。可棺材是空的，我亲手搭过手，轻得不像话。”",
      "他抬头看矿洞口，声音低下去：“后来矿主第二天就搬走了，再没回来过。第三哨换了几任统领，没一个人问过这洞的事。”",
      "豆子剥完了，他把碗扣在膝盖上：“牌子的事，别往外说。这哨上，有人耳朵长。”"
    ],
    options: [
      { t: "点头应下，回哨上", go: "frontier_city" }
    ]
  };

  /* ---------- 老铁线（钥匙其二 · tie 好感联动） ---------- */
  N["frontier_tie_1"] = {
    tag: "main", place: "北境 · 第三哨 · 营房", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 营房」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "营房里少了一张铺。老兵们围着炉子烤火，谁也不提老铁，可空铺上那床叠得方方正正的被子，谁都看得见。",
      "军需官独臂在门口站了一会儿，把一份口粮搁在老铁铺头，压低嗓子说：“昨天夜里，他说去城墙根撒泡尿，人就没回来。哨兵说他翻墙出去，往雪原上走了。”",
      "老兵们你看我，我看你。一个断牙的老兵先开口：“老铁这个人，认死理。上个月他跟你们那帮北上的商队吵过一架，说商队里有人半夜往矿洞方向运东西。商队走了，他天天蹲城头盯雪原，说要看清楚那帮人到底往哪儿去。”"
    ],
    options: [
      { t: "带上干粮与火把，出城往雪原方向找", go: "frontier_tie_2" },
      { t: "先问清老铁跟商队吵架的细节", go: "frontier_tie_1b" }
    ]
  };

  N["frontier_tie_1b"] = {
    tag: "main", place: "北境 · 第三哨 · 营房", where: "白昼", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 营房」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "断牙老兵说：“那商队领头的是个白脸，说话带东边口音。他们运的东西都拿油布裹着，一箱一箱往雪原深处去。老铁跟踪了两回，回来说箱子底下有铁链子拖过的印子，可商队说是铁器。”",
      "他吐了口唾沫：“铁器？往这鸟不拉屎的雪原运铁器？谁信。”",
      "墙角有个年轻哨兵补了一句：“老铁走前那天，在他铺底下塞了张纸，我扫到一眼，画的像是个牢房。”"
    ],
    options: [
      { t: "翻看老铁铺底下的纸", go: "frontier_tie_1c" }
    ]
  };

  N["frontier_tie_1c"] = {
    tag: "main", place: "北境 · 第三哨 · 营房", where: "白昼", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 营房」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "铺底下压着一张揉皱的纸，上面画着几道歪歪扭扭的线，标了三个点：一个画圈，写着“哨”；一个画叉，写着“风洞”；一个画三角，写着“牢”。三角旁边写了一行小字：雪原西北，半天脚程，黑皮人看守。",
      "你把纸折好收进怀里。老铁的字丑，但地图画得明白——他早就摸清了地方，只等夜里动手。",
      "营房外风声紧了一阵，夹着雪粒，扑在窗纸上簌簌地响。"
    ],
    options: [
      { t: "出城，往雪原西北方向去找风洞", go: "frontier_tie_2" }
    ]
  };

  N["frontier_tie_2"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原", where: "白昼", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 雪原」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "雪原白得晃眼，一脚踩下去没到小腿。风贴地刮，卷起的雪粒像砂纸一样磨脸。你顺着老铁的脚印走——脚印很新，步子大，走得急，方向正对西北。",
      "走了约莫两个时辰，脚印在一处冰裂缝边上拐了个弯。裂缝边上有一串新的痕迹：不是脚印，是拖痕，宽宽的一道，像是有人把什么重东西从裂缝里拖上来，又拖进了更深的雪窝。",
      "拖痕尽头，风里夹着一股焦味。你伏低身子往前摸，雪窝里露出半截烧黑的木桩，木桩上钉着一块布条——是军服的布料，袖口，缺了扣子的那一截。老铁的军服袖口，昨天还缝着那道补丁。"
    ],
    options: [
      { t: "循着焦味和拖痕继续往前摸", go: "frontier_tie_3" },
      { t: "先退回裂缝里藏身，等天黑再说", go: "frontier_tie_3" }
    ]
  };

  N["frontier_tie_3"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原风洞", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 雪原风洞」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "翻过一道雪梁，风洞里透出火光。你趴在梁上往下看——风洞是个天然的冰窟，洞口支着几根兽骨，兽骨上挂着油灯，灯火黄而稳，说明洞里有风路，烧的是好油。",
      "洞口守着两个人，裹着黑皮斗篷，从头包到脚。其中一个个子极高，肩宽得像扇门；另一个驼背，手里拄着一根铁钎。两人都不说话，一个面朝洞外，一个面朝洞里，像是石像。",
      "洞深处传来一声闷哼，是你熟悉的声音——老铁的声音，忍着疼的那种。"
    ],
    options: [
      { t: "摸近洞口，等守夜换班的空当", go: "frontier_tie_4" },
      { t: "直接现身，喊一嗓子把人引出来", go: "frontier_tie_5" }
    ]
  };

  N["frontier_tie_4"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原风洞", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 雪原风洞」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你在雪梁后蹲了约莫两炷香。风洞里换了一班人——高个子进洞，驼背拄着铁钎出来，沿着洞壁往东走，像是去巡夜。他走得不快，铁钎在冰面上一下一下地拄，声音在风里传出很远。",
      "你贴着冰壁滑进风洞。洞口一段没有灯，黑得伸手不见五指，你摸着冰壁慢慢挪，摸到一处拐弯，拐角后面透出灯光，还透出说话声。",
      "一个尖嗓子在说：“……上头说了，这东西今晚就走。老铁这个人，本来不该留，是他自己撞上来的。等货装完，一并处理。”另一个声音闷闷地应了一声。"
    ],
    options: [
      { t: "趁他们说话，摸进关人的地方", go: "frontier_tie_5" },
      { t: "先退出去，回哨上搬救兵", go: "frontier_tie_8b" }
    ]
  };

  N["frontier_tie_5"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原风洞囚室", where: "黑夜", pace: "epic",
    sceneTitle: "「北境 · 第三哨 · 雪原风洞囚室」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "囚室是风洞深处凿出的一间冰屋，门是两根兽骨夹着一块冻硬的皮子。你掀开皮子一角，看见老铁被绑在一根冰柱上，胳膊上一道血口子，冻得发紫。他听见动静抬头，看见你，眼睛瞪圆了，拼命摇头——嘴被堵着，说不出话。",
      "身后脚步声响。尖嗓子那人回来了，手里提着一盏灯，灯光扫过你半边脸。他停住，灯抬高，照出一张白净的脸，下巴一道疤：“哟，送菜的来了？”他朝洞里喊，“黑皮，把人拿了。”",
      "驼背的铁钎从暗处抡过来，带着风声。你侧身让过，铁钎砸在冰墙上，崩下一块冰。尖嗓子拔出一把短刀，刀身乌黑，刀尖朝你胸口扎来——这一下又快又刁，你避无可避，只能拿左臂去格。",
      "刀尖从你小臂外侧划过去，皮肉翻开，血一下子涌出来，顺着腕子滴在冰面上。那一刀很深，左臂使不上力，你手里的火把差点脱手。尖嗓子舔了舔刀尖上的血，笑了：“还行，有点血性。”"
    ],
    options: [
      { t: "咬牙不退，抡起火把砸向驼背，抢那把铁钎", check: { a: "STR", sk: "martial", label: "格斗" }, tier: {
        ok: ["火把糊在驼背脸上，焦皮味一起，他惨叫着丢了铁钎。你抄起铁钎横扫，尖嗓子退了两步。老铁趁乱挣断皮绳，一拳砸翻灯台——洞里黑了。", "你拽住老铁往洞外冲。"],
        fail: ["火把砸在驼背肩上，他闷哼一声没倒，反而一把攥住你的手腕，力气大得吓人。尖嗓子的刀又捅过来，你侧身，刀尖划过肋下，衣服撕开一道口子，血顺着腰往下淌。", "你挣开驼背的手，拖着老铁往洞外滚。"],
        crit: ["火把结结实实糊在驼背脸上，他嚎着丢了铁钎。你顺势一记顶膝撞在尖嗓子手腕，刀脱手飞出。老铁挣断皮绳，抄起冰柱边的兽骨，一骨砸在尖嗓子腿弯，他单膝跪地。", "三个人贴着冰壁往外跑，身后的骂声被风灌散。"]
      }, effects: { xp: 30, relation: { npc: "tie", v: 8 } }, go: "frontier_tie_6" },
      { t: "不恋战，趁乱砍断老铁绳索，从侧路撤", check: { a: "AGI", sk: "stealth", label: "潜行" }, tier: {
        ok: ["你一刀割断老铁手上的皮绳，两人猫腰贴冰壁往外摸。驼背的铁钎在身后空砸了几下，尖嗓子骂骂咧咧追出两步，被洞外的风雪呛回去。", "一口气跑出三里地才停下。"],
        fail: ["皮绳又粗又韧，你割了三刀才断。就这几息的工夫，驼背的铁钎已经抡到——你推了老铁一把，自己背上挨了一下，骨头响了一声，疼得你眼前发黑。", "两人连滚带爬逃出风洞，血顺着你的脊背滴了一路。"],
        crit: ["刀快，一割就断。你扶着老铁从侧路溜出去，贴着冰缝走，雪把脚印盖得干干净净。身后的风洞渐渐远了，只有风在冰棱间呜呜地响。", "你俩在雪梁后头趴了半天，确认没人追来，才互相搀着站起来。"]
      }, effects: { xp: 30, relation: { npc: "tie", v: 8 } }, go: "frontier_tie_6" }
    ]
  };

  N["frontier_tie_6"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 雪原」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "风雪越来越大，天彻底黑了。你搀着老铁在雪梁之间摸路，身后的风洞早看不见了，只有风声和两个人的喘息。老铁把堵嘴的布扯掉，第一句话是：“你不该来。”",
      "“你也不该一个人来。”你答。老铁沉默了一会儿，说：“我看见他们运的东西了——一口棺材，铁皮的，上面刻着花纹。他们把棺材抬进风洞最深处，里面有声音在敲。”",
      "他停下来，看着你：“那声音，我听过。三十年前，我家老头子下矿洞那阵，每天晚上都做噩梦，说听见有人在敲铁。后来他死在矿洞里，矿上说是塌方。我不信，一直不信。”"
    ],
    options: [
      { t: "问他棺材上的花纹是什么样的", go: "frontier_tie_7" },
      { t: "先别说话，赶路回哨要紧", go: "frontier_tie_7" }
    ]
  };

  N["frontier_tie_7"] = {
    tag: "main", place: "北境 · 第三哨 · 营房", where: "黑夜", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 营房」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "老铁描述棺材上的花纹：“一圈一圈的，像水波，又像蛇盘着。中间有个记号，方的，像块牌子。”他比划了一下，“跟你身上那块，一个样子。”",
      "你掏出矿洞里得来的铁牌，老铁接过去，用指腹摩挲那道竖纹：“一模一样。我爹死前给我留过一块，说是他年轻时候在矿底下捡的。后来我爹没了，那牌子也不见了——矿上的人来收遗物，说没看见。”",
      "他把铁牌还给你，从贴身的里衣口袋里摸出一把钥匙，铜的，指头长：“这是他们运棺材那伙人的钥匙，我摸到的。风洞深处还有一道铁门，钥匙对得上。”",
      "钥匙在他掌心躺着，还带着体温。营房外风声小了些，雪还在下。"
    ],
    options: [
      { t: "收下钥匙（第二枚钥匙）", effects: { flag: "frontier_key2", relation: { npc: "tie", v: 10 } }, go: "frontier_tie_8" }
    ]
  };

  N["frontier_tie_8"] = {
    tag: "main", place: "北境 · 第三哨 · 营房", where: "黑夜", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 营房」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "老铁歇下了。军需官独臂来看了他一趟，把伤药搁在枕边，没说话，只朝你点了点头。",
      "你在炉子边坐下来，把两枚铁牌并排摆着——钟楼刻痕那块，矿洞铁链那块，一样的方，一样的竖纹。风洞里的棺材、刘三的账本、老钱的空棺材、老铁爹的遗物……这些事像一根线，慢慢串了起来。",
      "炉火噼啪响了一声。你听见窗外有人低声说话，凑到窗边——是两个老兵在巡夜：“……商队又来了，说是运铁器，可那车辙，比上次深了半尺。”"
    ],
    options: [
      { t: "把铁牌收好，记下商队的事，去战报栏看看", go: "frontier_herald" },
      { t: "回要塞 hub", go: "frontier_city" }
    ]
  };

  N["frontier_tie_8b"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原", where: "黑夜", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 雪原」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你决定不冒险，先回哨上搬救兵。风雪把来时的脚印盖了大半，你只能凭方向摸回去，走了一个多时辰才看见城墙上的灯火。",
      "城门官听你说了风洞的事，脸色变了，连夜点了一队人跟你去。天亮前赶到风洞——洞里已经空了，只剩烧焦的兽骨和几根断绳。老铁被带走了，地上留下一道拖痕，和一块撕下来的军服布条。",
      "你攥着那块布条，站在风洞里，听着风声灌进来，像什么东西在远处敲。"
    ],
    options: [
      { t: "把布条收好，回哨上想办法", go: "frontier_tie_1" }
    ]
  };

  /* ---------- 四钥线索（卷 C 前置，只给线索不闭环） ---------- */
  N["frontier_key_hint_1"] = {
    tag: "main", place: "北境 · 第三哨 · 战报栏", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 战报栏」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "战报栏上贴着一张泛黄的告示，被雪水洇得字迹模糊，落款是学院。告示说，北境魔法学院图书馆失窃了一卷古籍，正在追查，有线索者赏金五十金龙。",
      "告示边角有人用炭笔写了一行小字，笔画很细，像是读书人的手笔：“古籍丢的那天，禁书区有人看见费尔曼教授半夜进出。钥匙在墓园的无字碑底下。”",
      "字迹到这里就断了。那行字的下半截被撕掉了，只剩撕口毛糙的边。"
    ],
    options: [
      { t: "记下费尔曼与无字碑的线索", effects: { flag: "frontier_hint_ferman" }, go: "frontier_city" }
    ]
  };

  N["frontier_key_hint_2"] = {
    tag: "main", place: "北境 · 第三哨 · 山后乱葬岗", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 山后乱葬岗」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "乱葬岗在哨所山背后，一片冻土坡，插着稀稀拉拉的木牌。最里头立着一块无字碑，碑面光洁，没刻一个字，却擦得干干净净，像是有人常来。",
      "碑座底下压着一块石头，石头底下是一把铜钥匙，样式古旧，匙柄上缠着一圈褪色的红绳。钥匙旁边压着一张纸条，纸上只有一行字：“欠你的，还你。金秤第三代。”",
      "你拿起钥匙，纸条被风一吹，翻了个面，背面还有一个字：北。"
    ],
    options: [
      { t: "收下钥匙（无字碑下）", effects: { flag: "frontier_key_hint_grave" }, go: "frontier_city" }
    ]
  };

  N["frontier_key_hint_3"] = {
    tag: "main", place: "北境 · 第三哨 · 军需处", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 军需处」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "军需官独臂在清点账册，听你问起失窃的事，头也没抬：“学院金库丢东西？那事儿在学院那边传得开，说是炼金系一个姓陆的学生干的，拿了一枚铁牌。”",
      "他翻了一页账：“那学生姓陆，单名一个昭，外号鸦羽。东西丢了他就休学跑了，往南边去了。学院追了半年，人没追到，铁牌也没追回来。”",
      "他把账册合上，从抽屉里摸出一张通缉令的边角：“不过前阵子，南边传回消息，说鸦羽在南边现过身，身边跟着一口铁盒子。”"
    ],
    options: [
      { t: "记下陆昭与铁盒的线索", effects: { flag: "frontier_hint_luzhao" }, go: "frontier_city" }
    ]
  };

  N["frontier_key_hint_4"] = {
    tag: "main", place: "北境 · 第三哨 · 战报栏", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 战报栏」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "战报栏最底下压着一封旧信，信封已经发黄，收信人写着“第三哨守钟人亲启”。信里只有短短几行：“钟响之时，故都当醒。晨天城地下，埋着第四枚。七锚不全，钟鸣不止。——署名：一个欠金秤的人。”",
      "信的落款处盖着一枚小印，印文模糊，依稀能认出两个字：晨天。",
      "你翻过信封——背面用炭笔画着一道门，门上刻着一圈一圈的纹路，像水波，又像蛇盘着。"
    ],
    options: [
      { t: "收好这封信（指向晨天故都）", effects: { flag: "frontier_hint_chentian" }, go: "frontier_city" }
    ]
  };

  /* ---------- 封印抉择（seal 主线 day200 联动，不改判定） ---------- */
  N["frontier_seal_1"] = {
    tag: "main", place: "北境 · 第三哨 · 地底裂隙", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 地底裂隙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "深夜，哨所地底传来一阵闷响，像雷从地底下滚过去。你披衣起来，循声找到军械库后面的地窖——窖底裂开一道口子，黑气正从裂缝里一缕一缕地往外冒，带着一股硫磺似的臭味。",
      "裂缝边围着几个老兵，没人敢靠太近。断牙老兵举着灯照了照，裂缝深不见底，黑气在灯光下翻涌，像是活的。",
      "“这底下，”他说，“是深渊的地脉。二十年前那矿难，怕就是这东西闹的。”他回头看你，“上头的教会隔三差五来查，可他们只管登记，不管堵。你是新来的，你说了算——堵，还是等？”"
    ],
    options: [
      { t: "连夜搬石布阵，把裂缝先压住", go: "frontier_seal_2" },
      { t: "先不动它，等天亮看情况", go: "frontier_seal_3" },
      { t: "派人去请教会的人来", go: "frontier_seal_4" }
    ]
  };

  N["frontier_seal_2"] = {
    tag: "main", place: "北境 · 第三哨 · 地底裂隙", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 地底裂隙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你带头搬石。裂缝口的碎石不够，老兵们把军械库的旧铁砧、废铁锭都搬下来，一层石头一层铁，压了个严实。断牙老兵在顶上画了个圈，念了几句不知从哪儿学来的咒，把一壶酒浇在石堆上。",
      "黑气被压下去一些，可还是从石缝里往外渗，像烧不尽的烟。你蹲在石堆边守了半宿，裂缝里那股臭味淡了，又浓回来，反复了三次。",
      "天亮时，裂缝没有再扩大，可谁也不敢说它堵住了。断牙老兵拍拍手上的土：“管用一时，管不了一世。这东西，得有人拿命去镇。”"
    ],
    options: [
      { t: "记下裂缝的位置（加固过）", effects: { flag: "frontier_seal_reinforce" }, go: "frontier_seal_after_1" }
    ]
  };

  N["frontier_seal_3"] = {
    tag: "main", place: "北境 · 第三哨 · 地底裂隙", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 地底裂隙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你决定先不动它。黑气这东西，越动越躁，不如先摸清它的性子。你把老兵们劝回去，自己搬了张凳子坐在裂缝边上，一坐坐到天亮。",
      "这一夜，黑气涨了三次，退了三次，像是在呼吸。每一次涨的时候，你都能听见地底下有极细的、像是铁链拖地的声音，又远又近。",
      "天亮时你揉着发僵的腿站起来，断牙老兵在窖口探了个头：“没闹大吧？”你摇摇头。他松了口气：“不动它就好。这东西，你越较劲，它越来劲。”"
    ],
    options: [
      { t: "记下裂缝的规律（选择观望）", effects: { flag: "frontier_seal_wait" }, go: "frontier_seal_after_1" }
    ]
  };

  N["frontier_seal_4"] = {
    tag: "main", place: "北境 · 第三哨 · 地底裂隙", where: "黑夜", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 地底裂隙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你派老兵骑快马去最近的教堂报信。第三天傍晚，教会的执事带了两名圣痕司的见习修士赶来，一进地窖就皱眉，把老兵们都赶了出去，只留你在场。",
      "执事绕着裂缝走了三圈，用圣水浇了一圈，黑气果然缩回去不少。他直起身，问你：“这裂缝，什么时候开的？”你说昨夜。他摇摇头：“不止。你们哨所底下，这裂缝开了至少十年，只是昨夜才裂到地表。”",
      "他临走时给你留了一道符纸，贴在裂缝口的石壁上：“压住它，别让它见光。教会会派人来接手——不过，”他顿了顿，“来不来得及，要看它涨得快不快。”"
    ],
    options: [
      { t: "收下符纸（上报教会）", effects: { flag: "frontier_seal_church" }, go: "frontier_seal_after_1" }
    ]
  };

  N["frontier_seal_after_1"] = {
    tag: "main", place: "北境 · 第三哨 · 地窖口", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 地窖口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "第三天夜里，地窖里的动静小了下去。断牙老兵下去看了一眼，上来时脸上带着怪色：“裂缝……合了一点。那些石头，像是被什么东西从底下顶上来，自己把口子填住了。”",
      "没人相信石头会自己填缝。可事实摆在眼前——裂缝确实窄了半尺，黑气也淡了。老兵们私下说，是地底那东西自己退的，跟咱们堵不堵没关系。",
      "只有你在场知道，你做的那个选择，像一根楔子，把裂缝的势头别住了。至少眼下，它是安静了。"
    ],
    options: [
      { t: "把这件事记进战报（不影响主线判定）", effects: { flag: "frontier_seal_done" }, go: "frontier_seal_after_2" }
    ]
  };

  N["frontier_seal_after_2"] = {
    tag: "main", place: "北境 · 第三哨 · 战报栏", where: "白昼", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 战报栏」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "战报栏上多了一行字，是你自己写的：地窖裂缝，暂稳。日期、时辰，都记了。",
      "断牙老兵路过看了一眼，咂咂嘴：“你写这个，是给后人看。可我活了几十年，这哨上的事，没一件是写了就完的。”",
      "他把烟杆在鞋底磕了磕，走了。风从北边吹来，夹着雪粒，扑在战报栏上，把那行新字糊了一层白。"
    ],
    options: [
      { t: "回要塞 hub", go: "frontier_city" }
    ]
  };

  /* ---------- 支线一：流民营母女 ---------- */
  N["frontier_refugee_1"] = {
    tag: "main", place: "北境 · 第三哨 · 流民营", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 流民营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "流民营搭在城墙根避风处，几块油布支着，挤了七八户人家。最里头那顶帐篷里，一个五六岁的小丫头蹲在门口，拿树枝在雪地上画圈，画一个，抹掉，再画一个。",
      "她娘躺在帐篷里，裹着一床破被，烧得脸通红，咳嗽一声接一声，痰里带着血丝。小丫头听见娘咳，跑进去给她喂水，水碗沿碰着牙，磕磕响。",
      "你站了一会儿，小丫头抬头看你，眼睛大而干：“叔叔，你有药吗？我娘说，没药也撑得过去。可她的手，老是抖。”"
    ],
    options: [
      { t: "去伤兵营找军医宋，问问有没有药", go: "frontier_refugee_2" },
      { t: "先掏出身上的干粮给她们", go: "frontier_refugee_2" }
    ]
  };

  N["frontier_refugee_2"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 伤兵营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "军医宋是个三十来岁的瘦高个，正给一个断腿的老兵换药。听你提起流民营那对母女，他手上动作没停：“流民那女的，我见过，烧了有七八天了。不是风寒，是雪原上染的怪病，药不对路，吃多少都没用。”",
      "他把换下来的绷带丢进火盆：“你要真想帮，去找老钱。他是矿工出身，认得雪原上几种草药。配一剂试试。”",
      "断腿的老兵在旁边插嘴：“老钱那人，抠。你空手去，他连草根都不给你一根。”"
    ],
    options: [
      { t: "去找老钱，讨一味雪原草药", go: "frontier_refugee_3" }
    ]
  };

  N["frontier_refugee_3"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞口", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 矿洞口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "老钱听你说完，把碗里最后一颗豆子嚼完，才慢慢开口：“雪原上有种草，叫火绒花，治热病。长在冰缝边上，白花，花心里头一点红。”",
      "他站起来，瘸着腿往栅栏边上走了两步：“那花不好采——冰缝边上，雪狼常出没。你一个人去，回不回得来，两说。”",
      "他顿了顿，补了一句：“我腿脚不行，替不了你。你要去，把我这把旧镐带上，防身。”他把一把磨得发亮的短镐递过来，镐柄上缠着布条，还带着体温。"
    ],
    options: [
      { t: "接过短镐，去雪原找火绒花", go: "frontier_refugee_4" },
      { t: "谢过老钱，另想办法", go: "frontier_refugee_5" }
    ]
  };

  N["frontier_refugee_4"] = {
    tag: "main", place: "北境 · 第三哨 · 雪原冰缝", where: "白昼", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 雪原冰缝」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "冰缝在哨所以东三里，一道裂缝劈开冻土，缝底能听见流水声。火绒花就长在缝壁上——白花，花心一点红，一丛一丛，在风口里颤。",
      "你探身下去采了六七朵，揣进怀里。正要上来，缝那头传来一阵低沉的呼噜声——一头雪狼蹲在缝口，盯着你，耳朵压平了，尾巴慢慢竖起来。",
      "狼没有立刻扑。它在等——等你慌，等你先动。风把雪沫子灌进缝里，你抓着缝壁的冰棱，短镐就挂在腰上。"
    ],
    options: [
      { t: "慢慢退到缝壁死角，摸出短镐对峙", check: { a: "SPR", sk: "animal", label: "驯兽" }, tier: {
        ok: ["你蹲下，把花举在身前，慢慢放低身子，不跟它对眼。雪狼嗅了嗅空气里的花味，喉咙里那声呼噜低了下去，又看了你两眼，转身踏进雪里，不见了。", "你揣着花爬回地面，后背的汗已经凉透了。"],
        fail: ["雪狼扑下来，你拿短镐去挡，狼爪划在你右手背上，三道血口子，深可见白。你疼得闷哼一声，却借着这个机会把镐尖捅进狼肩——狼哀嚎一声，夹着尾巴跑了。", "手背的血滴在雪上，你扯了块布条缠住，把花护在怀里往回走。"],
        crit: ["你慢慢蹲下，把花放在雪地上，退开两步。雪狼走过来，低头嗅了嗅花，又抬头看你——那双黄眼珠里，敌意慢慢散了。它叼起那朵花，转身走进风雪里。", "你怔了一下，把剩下的花收好，回了哨上。"]
      }, effects: { xp: 25, relation: { npc: "song", v: 5 } }, go: "frontier_refugee_5" }
    ]
  };

  N["frontier_refugee_5"] = {
    tag: "main", place: "北境 · 第三哨 · 流民营", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 流民营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "药配好了。军医宋把火绒花捣碎，掺了两味药，煎了一碗。小丫头端碗进去，一勺一勺喂给她娘，喂到一半，她娘的手不抖了，人也醒了。",
      "小丫头从帐篷里探出头，眼睛亮亮的，冲你喊：“叔叔，我娘说她想坐起来！”她想了想，又补了一句，“我娘说，等她能走了，要给你纳双鞋。”",
      "你摆摆手。风从城墙根吹过来，带着炊烟的味道，暖了一瞬。"
    ],
    options: [
      { t: "（流民营母女记住了你的恩）", effects: { flag: "frontier_refugee_done", relation: { npc: "song", v: 5 } }, go: "frontier_city" }
    ]
  };

  /* ---------- 支线二：军医宋与黑纹伤 ---------- */
  N["frontier_medic_1"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 伤兵营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "伤兵营里横七竖八躺着八九个人，军医宋忙得脚不沾地。他刚给一个老兵缝合完伤口，抬头看你一眼：“来帮忙的？帮忙就搭把手，不是帮忙就外头等着。”",
      "你搭了把手，按住一个伤兵的胳膊让他别动。宋缝合的手法很稳，针脚细密，可他缝到一半，忽然停住，盯着伤口边缘看。",
      "伤口边缘的肉，泛着一层极淡的黑。宋拿镊子挑了挑，黑纹像是渗进肉里的，擦不掉。他眉峰聚起来，把那块肉周围的皮肉又剪了一小块：“这东西，不是毒。”"
    ],
    options: [
      { t: "问他黑纹是什么", go: "frontier_medic_2" }
    ]
  };

  N["frontier_medic_2"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营", where: "白昼", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 伤兵营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "宋把那块剪下来的肉放进一只陶碗里，盖上盖子：“这个伤兵，是三天前在城墙根巡逻时被什么东西咬的。他说没看清，只觉着一阵风，腿上就多了口子。”",
      "“我当军医十年，毒、疫、瘴气都见过。这个黑纹，不是毒，不是疫——倒像是被什么东西从里头往外染的。”他抬眼，“这个老兵，前天开始做噩梦，说有人在他床底下敲东西。一夜没睡。”",
      "他顿了一下：“你说巧不巧，哨上几个被咬过的人，做的是同一个梦。”"
    ],
    options: [
      { t: "提出去看看那个做噩梦的老兵", go: "frontier_medic_3" }
    ]
  };

  N["frontier_medic_3"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 伤兵营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "夜里，你蹲在那老兵铺边。他睡得不踏实，翻来覆去，嘴里含混地念着什么。后半夜，他忽然坐起来，眼睛睁着，可没看你——他盯着床底，手指头指着，说：“下面，有人敲。”",
      "你趴下去看床底。床底是夯实的冻土，什么也没有。可你把耳朵贴上去——冻土下面，传来极细的、一下一下的敲击声，像有人用指节叩地。",
      "那声音很有规律，三下，停，三下。宋不知什么时候站到你身后，手里提着灯，脸色发白：“地底下……是矿洞的方向。”"
    ],
    options: [
      { t: "跟宋合计：这跟矿洞水声、风洞棺材是一路", go: "frontier_medic_4" }
    ]
  };

  N["frontier_medic_4"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营", where: "黑夜", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 伤兵营」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "宋把灯放在地上，压着嗓子说：“矿洞、风洞、地窖裂缝，全是通的。底下那东西，在咱们脚底下爬。”他抬头看你，“我原来不信这些。可这黑纹，这梦，这敲声——它们是一路的。”",
      "他沉默了一会儿，说：“我在这哨上待了八年，见过三批人被这东西缠上。前两批，都死了。死前都一样：先做噩梦，再听见敲声，最后人自己往矿洞方向走。”",
      "“哨上的人不让说。说了，军心就散了。”他把灯提起来，“可我得记下来。你帮我个忙——要是哪天我也被缠上了，别让我往矿洞走。”"
    ],
    options: [
      { t: "答应他，并问他记下来的东西在哪", go: "frontier_medic_5" }
    ]
  };

  N["frontier_medic_5"] = {
    tag: "main", place: "北境 · 第三哨 · 伤兵营药柜", where: "任意", pace: "normal",
    sceneTitle: "「北境 · 第三哨 · 伤兵营药柜」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "宋从药柜最底层摸出一本册子，封皮是牛皮，磨得发亮。翻开来，里面记着日期、人名、症状：“……第三批，四月初七，马夫老张，梦敲声，五日，北走，夜半于矿洞口寻获，已僵。”",
      "他翻到最后一页，新添了一行：“我若北走，亦记于此。宋。”字迹比前面的都重，像是用力写下的。",
      "他把册子合上，塞回药柜底层，站起来拍拍手上的灰：“行了，事说开了，心里反倒踏实。你记着，这册子的事，别往外说——哨上有些人，听了会当我是妖言惑众。”"
    ],
    options: [
      { t: "点头应下（军医宋的嘱托）", effects: { flag: "frontier_medic_done", relation: { npc: "song", v: 10 } }, go: "frontier_city" }
    ]
  };

  /* ---------- 铜钟异响守卫战（越级战例 · 四段式） ---------- */
  N["frontier_bell_fight_1"] = {
    tag: "combat", place: "北境 · 第三哨 · 城墙", where: "黑夜", pace: "epic",
    sceneTitle: "「北境 · 第三哨 · 城墙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "后半夜，铜钟响了。没有风，没有雾，钟自己响了一记，声音又沉又远，震得城墙上的雪簌簌往下掉。守钟老卒在钟楼顶喊了一嗓子：“狼！城下全是狼！”",
      "你披甲上城。城墙下的雪原上，黑压压一片狼群，数不清多少头，绿眼睛像一片点着的灯。狼群正中站着一个人——黑皮斗篷，从头包到脚，两条腿，站在狼群里，纹丝不动。",
      "老兵们握紧了兵器，没人说话。断牙老兵嗓子发紧：“这是头一回……狼群跟人一起来。”他转头看你，“你是新来的，没见过。这阵仗，平时得三倍的人才能扛住。”",
      "黑皮人抬起手，朝城墙一指。狼群动了，像一片黑潮涌过来，前头的狼叼着什么东西往城墙上甩——是几根削尖的兽骨，破空而来，钉在墙垛上，嗡嗡地颤。"
    ],
    options: [
      { t: "抄起弓，先射倒冲在最前的头狼", check: { a: "AGI", sk: "martial", label: "射术" }, tier: {
        ok: ["你拉满弓，一箭穿进头狼肩胛。狼群顿了一瞬，头狼倒地的空当，城墙上的箭雨压下去，冲在最前的狼倒了一片。你换了个垛口继续射，箭筒里的箭一根根见底。"],
        fail: ["箭擦着头狼的脊背飞过去，只削掉一撮毛。头狼反而红了眼，加快速度扑到墙根，狼爪扒着墙缝往上蹿，几头狼已经够到了垛口。"],
        crit: ["一箭正穿头狼咽喉，它闷声栽倒，狼群炸了窝，乱了一炷香。你连射三箭，箭箭咬肉，城下的绿眼睛退出去十几步。"],
      }, effects: { xp: 25 }, go: "frontier_bell_fight_2" },
      { t: "带人守住墙梯口，防狼从梯子爬上", check: { a: "STR", sk: "martial", label: "格斗" }, tier: {
        ok: ["你守在墙梯口，狼爪子刚搭上梯沿，你一枪杆子捅下去，连捅三头。身后的老兵跟上来，把梯子掀翻，城下传来闷响。"],
        fail: ["一头狼趁你捅梯子的空当，从侧面扑上垛口，狼爪在你左肩抓出一道血口子，皮肉翻卷。你疼得差点脱手，一脚把它踹下城去，血顺着胳膊流进指缝。"],
        crit: ["你在梯口立了一杆枪，连捅带踹，狼群连梯沿都摸不着。身后的老兵喊着号子，把备用的滚木推下去，城下砸出一片哀嚎。"]
      }, effects: { xp: 25 }, go: "frontier_bell_fight_2" }
    ]
  };

  N["frontier_bell_fight_2"] = {
    tag: "combat", place: "北境 · 第三哨 · 城墙", where: "黑夜", pace: "epic",
    sceneTitle: "「北境 · 第三哨 · 城墙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "狼群退了第一波，可没人松气——黑皮人动了。他从狼群里走出来，一步一步，走得极慢，可每一步落下，脚下的雪都往两边退，像是有什么东西给他开路。",
      "他走到城墙根下，仰头看你。兜帽底下看不清脸，只有一双眼睛，亮得不像人。他开口，声音像是砂纸磨铁：“钟……谁敲的？”",
      "话音没落，他抬手往城墙上一按。你脚下的墙砖一颤，一股黑气顺着砖缝窜上来，城墙上几个老兵惨叫着后退——他们脚下的砖缝里，伸出黑气凝成的手，攥住他们的脚踝。",
      "黑皮人一步踏出，人已经上了墙头，站在你面前三丈远。他比你高出一头，站在风里，黑斗篷猎猎作响，身后是漫天大雪。你握紧了手里的兵器——这一仗，你一个人挡不住。"
    ],
    options: [
      { t: "不退，迎上去缠住他，拖到援军来", check: { a: "CON", sk: "martial", label: "死战" }, tier: {
        ok: ["你咬牙冲上去，一枪刺他腰眼。他侧身让过，反手一掌拍在你肩头——你整个人砸在墙垛上，后背撞得发麻，嘴里一股腥味。但你没倒，拄着枪站起来，又冲了上去。"],
        fail: ["你冲上去，他抬脚一踹，正中小腹。你像断线的风筝砸在城砖上，眼前发黑，血从嘴角溢出来。他走过来，居高临下看你，那双手上缠着黑气：“就这点本事？”"],
        crit: ["你虚晃一枪，他侧身让，枪杆子却横扫在他小腿上——他踉跄一步，黑气散了一瞬。你抓住那空当，枪尖在他肋下划出一道口子，黑血溅出来，他第一次退了半步。"]
      }, effects: { xp: 40 }, go: "frontier_bell_fight_3" },
      { t: "边打边退，把他引向军械库（那里有铁网和火油）", check: { a: "AGI", sk: "stealth", label: "游斗" }, tier: {
        ok: ["你且战且退，引着他往军械库走。他追得急，脚下被绊索一勾——那是老兵们备下的绊马索，黑皮人栽了个趔趄。你趁势退出十步，老兵们把火油泼了一地，一根火把扔过去，火光冲天。"],
        fail: ["你退得急，脚下一滑，他一把攥住你的后领，把你提起来，像提一只鸡。黑气顺着他的手指渗进你衣领，一阵透骨的凉。他凑到你耳边说了一句：“跑什么？”" ],
        crit: ["你退三步进两步，把他的节奏带乱。退到军械库门口时，你一个转身，铁网兜头罩下——那是晾铁器的大网，他挣了两下没挣开，火油紧跟着泼上来，火光腾起，他裹着一身火滚下城墙。"]
      }, effects: { xp: 40 }, go: "frontier_bell_fight_3" }
    ]
  };

  N["frontier_bell_fight_3"] = {
    tag: "combat", place: "北境 · 第三哨 · 城墙", where: "黑夜", pace: "deep",
    sceneTitle: "「北境 · 第三哨 · 城墙」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "黑皮人退了，带着一身火，从城墙上跳下去，落进狼群里。狼群呜咽着散开，跟着他退进雪原，像一片退去的潮水。城墙上安静下来，只剩风声和粗重的喘息。",
      "你靠着墙垛坐下来，才发现左臂的伤口还在流血，血在城砖上积了一小滩。断牙老兵跑过来，往你嘴里塞了一块干饼：“活着就好。这东西，今晚是头一回亲自上来——以前它只赶狼。”",
      "守钟老卒在钟楼顶慢慢站起来，看着雪原尽头：“它来问钟的事了。钟一响，它就坐不住。”他转头看你，浑浊的眼睛里有东西在动，“你今晚露了脸，它记住你了。往后的日子，夜里别一个人走。”",
      "城墙下的雪原上，那团火光越来越远，最后变成一个红点，熄了。风从北边灌过来，夹着雪粒，吹在你伤口上，又冷又疼。"
    ],
    options: [
      { t: "（铜钟守卫战·战毕）", effects: { flag: "frontier_bell_fight_win", xp: 30, relation: { npc: "zhou", v: 10 } }, go: "frontier_bell_5" }
    ]
  };

  /* ---------- 收束：矿洞线衔接（M2 内环） ---------- */
  N["frontier_mine_combat_after"] = {
    tag: "main", place: "北境 · 第三哨 · 矿洞口", where: "任意", pace: "light",
    sceneTitle: "「北境 · 第三哨 · 矿洞口」",
    arc: "arc_frontier", vol: "vol_north",
    text: [
      "你在矿洞口把短镐还给老钱。他接过去，拿布条又缠了一圈镐柄，没头没尾地说了一句：“你是个实心眼的。雪原上，实心眼的人活得久。”",
      "他朝洞里努努嘴：“那水声，我听了二十年。你下去一趟，它消停了几日——不管是不是你干的，它怕你了。”",
      "你回身看了一眼矿洞口。黑黢黢的洞口像一张嘴，安安静静地张着。"
    ],
    options: [
      { t: "回要塞 hub", go: "frontier_city" }
    ]
  };

})();

/* /u1inj:data-nodes:dn_ideal_goals.js/ */
/* /A1inj:goals/ A-1 八条理想目标线（8 intro + 24 里程碑，闭环：intro → _1 → _2 → _3 → done）
   纯数据对象式；pace 元数据；ifIdeal/ifFlag 变体；不入引擎（判定/writeNext/choose 零触碰）
   V66 白描；治理词回避；中文引号成对；saveVersion=48 不变
   入口：A-2 自由城 fc 链「想起自己的理想」（按 S.ideal 显示对应选项）
   里程碑触发条件：S.flags.ideal_goal_<ideal> 由 intro 确认时置位 */

/* ===== 理想线 intro（8）· 夜深独白 ===== */
N["goal_intro_wealth"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，听着楼下酒馆的喧闹渐渐低下去。",
"你翻了个身，想起今天在码头看到的那一幕：一船南境的绸缎，卸货的苦力扛着包，账房先生坐在遮阳棚下拨算盘，一笔一笔，干净利落。",
"你忽然想起自己出发时对天说过的话——要让那些看不起你的人，在金钱面前低头。",
"富甲天下。这条路很长，可你既然走到了这里，就不打算回头。"
],options:[
{t:"把这句话按进心里（确认理想：富甲天下）",effect:{flag:"ideal_goal_wealth"},go:"goal_wealth_1"}
]};
N["goal_intro_might"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，手指无意识地摩挲着掌心的旧茧。",
"楼下有人在吹一支战歌，调子粗糙，却让你脊背绷直了一瞬。你想起草原上的风声、铁门关的烽烟、还有你离开时心里那团没熄的火。",
"你要让大陆上的每一个名字，都听过你的名号。",
"威震四海。这条路是用拳头一寸寸打出来的，你早做好了准备。"
],options:[
{t:"把这句话按进心里（确认理想：威震四海）",effect:{flag:"ideal_goal_might"},go:"goal_might_1"}
]};
N["goal_intro_guard"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，却睡不着。",
"傍晚你在街角看见一个卖炭的老汉，被巡夜的兵推了个趔趄，炭筐撒了一地。他蹲在路边一颗颗捡，没人帮他。你当时走过去，替他捡了几颗。",
"你想起自己的理想——让那些与你无关的普通人，能多睡几个安稳觉。",
"守护苍生。这话说来轻，做起来，是从一颗炭、一只手开始的。"
],options:[
{t:"把这句话按进心里（确认理想：守护苍生）",effect:{flag:"ideal_goal_guard"},go:"goal_guard_1"}
]};
N["goal_intro_truth"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，睁着眼看房梁。",
"白天你在旧书摊翻到半卷残本，讲的是三百年前一次失败的封印。书页缺了后半，你心里那根弦却被拨动了——这个世界的秘密，比它表面展示的多得多。",
"你要把这个世界最深处的秘密，一页一页翻出来。",
"探寻真相。有些答案比问题更大，可你宁愿被真相灼伤，也不愿被谎言捂死。"
],options:[
{t:"把这句话按进心里（确认理想：探寻真相）",effect:{flag:"ideal_goal_truth"},go:"goal_truth_1"}
]};
N["goal_intro_free"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，听着城外的风声。",
"这座城白天很热闹，可你心里清楚，热闹是它的，不是你的。你的脚已经想走了——风往哪儿吹，你就往哪儿走。",
"你要不受任何人摆布，想去哪儿，就去哪儿。",
"自由自在。这座城留不住你，就像云留不住雁。"
],options:[
{t:"把这句话按进心里（确认理想：自由自在）",effect:{flag:"ideal_goal_free"},go:"goal_free_1"}
]};
N["goal_intro_god"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，却一直仰头看着窗外的夜空。",
"星子很亮，密密麻麻地铺在头顶。你想起白天路过教堂时，那些信徒低眉顺目的样子——他们把答案交给神，把腰弯下去。",
"你不打算弯。你要站在最高的地方，俯瞰这人间。",
"登临神座。这条路没人走过，所以更值得走。"
],options:[
{t:"把这句话按进心里（确认理想：登临神座）",effect:{flag:"ideal_goal_god"},go:"goal_god_1"}
]};
N["goal_intro_fame"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，回想自己这一路。",
"酒馆里有人说，东境有个吟游诗人，专唱英雄的故事。你听着听着，忽然想：总有一天，会有人唱你的故事。",
"你要让百年后的人，仍然记得你的名字。",
"名留青史。名字这东西，生不带来，死不带去——可它能让一个人，活过他自己那几十年。"
],options:[
{t:"把这句话按进心里（确认理想：名留青史）",effect:{flag:"ideal_goal_fame"},go:"goal_fame_1"}
]};
N["goal_intro_revenge"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"夜深了。你躺在客栈的薄褥子上，手覆在胸口那道旧伤上。",
"伤疤早已结痂，可那道疼还在——它跟着你走过了山、走过了河，走到这座城。你记得那年冬天，记得那些人的脸，记得火光的颜色。",
"欠我的，我亲手讨回来。",
"以血还血。你把这句话在心里又念了一遍，像磨一把刀。"
],options:[
{t:"把这句话按进心里（确认理想：以血还血）",effect:{flag:"ideal_goal_revenge"},go:"goal_revenge_1"}
]};

/* ===== 里程碑一（8）· 第一步 ===== */
N["goal_wealth_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"第二天一早，你站在交汇城的集市口，看着眼前的人流。",
"商人、脚夫、骗子、贵族——在这座城里，人人都带着一个价。你想起昨夜的话，心口那团火又旺了三分。",
"你摸出怀里仅剩的几枚铜星，在掌心掂了掂。第一桶金，往往小得不起眼，但它是后来一切的根。",
"你环顾四周：左手边是码头，一船南境的盐正卸货；右手边是杂货巷，几个小贩在争论今天的地租；正前方是冒险者公会的招牌，门口贴着一张高价的委托。"
],options:[
{t:"去码头看看盐货的行情（踏出第一步）",go:"goal_wealth_2"},
{t:"去杂货巷打听地租的行情",go:"goal_wealth_2"},
{t:"撕下冒险者公会的委托",go:"goal_wealth_2"}
]};
N["goal_wealth_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你在交汇城盘桓了半月，总算摸清了这座城的脾性。",
"这里的钱不认脸，只认价。你学会了两样本事：一是看货，二是看人。前者让你不吃亏，后者让你不吃哑巴亏。",
"你用小本生意攒下了一小笔钱。不多，但足够你在最落魄的时候，给自己留一条退路。",
"夜里你数着铜星，忽然觉得，这条路虽慢，却踏实。罗马不是一天建成的，金库也不是。"
],options:[
{t:"继续攒钱，留意更大的机会",go:"goal_wealth_3"},
{t:"试着跟商会的人搭上线",go:"goal_wealth_3"}
]};
N["goal_wealth_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"三个月后，你在交汇城的码头上做成了一桩不大不小的买卖。",
"一船滞销的北境皮毛，因为雪灾堵在港里，货主急着脱手。你把所有积蓄押了上去，又借了两成利钱，硬是接了下来。",
"那半个月你睡在货栈的干草堆里，天天盯着天气。第七天，北境的消息到了：雪灾解封，皮毛价格翻了一倍。",
"你在账本上写下第一笔像样的数目时，手是稳的。可夜里躺下，你听见自己的心跳得很重——那种重，是第一次亲手抓住命运的缰绳时才有的。",
"你知道，这还只是第一步。可你更知道，无数人一辈子，连这一步都没迈出去。",
"你把账本合上，在封底写了四个字：来日方长。富甲天下的路，从这一页开始，正正经经地写下去了。"
],options:[
{t:"收好账本（理想里程碑·完成）",effect:{flag:"ideal_goal_wealth_done"},go:"fc_tavern"}
]};
N["goal_might_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你在城西找了块僻静的荒地，开始练拳。",
"没有名师，没有功法，只有一双拳头和一身蛮劲。你把一棵老树当靶子，一天打一百拳，打到指节渗血才停。",
"第五天，一个路过的老佣兵站住了脚，看了你半晌，扔过来一句话：“蛮力打不死人。要学，得先学挨打。”",
"他转身走了。你站在原地，把这句话嚼了又嚼，最后追了上去。"
],options:[
{t:"追上老佣兵，拜他为师",go:"goal_might_2"},
{t:"不信他的话，继续自己练",go:"goal_might_2"}
]};
N["goal_might_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你跟着老佣兵学了三个月。",
"他教你站桩、吐纳、闪避，教你挨打的时候怎么卸力，教你一刀劈下去怎么收得住。他脾气坏，骂人凶，可每次骂完，又会把动作拆开，重新做一遍给你看。",
"有一天他问你：“为什么练？”",
"你说：“要让人听过我的名字。”",
"他看了你很久，说：“名字不是练出来的，是打出来的。可打，得有值得打的理由。记住你今天这句话，别让它在路上丢了。”"
],options:[
{t:"把这句话记进骨头里",go:"goal_might_3"}
]};
N["goal_might_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"半年后的一个黄昏，你在城郊的野地里，遇到了三个拦路的贼。",
"他们以为你是头肥羊。你站定，卸下背上的家伙，摆出老佣兵教你的那个架势。",
"第一个冲上来的被你一个侧身让开，反手砸在肘窝上，闷声倒地。第二个的刀劈空了，你顺势欺进他怀里，肩膀一顶，把他撞飞出去。第三个转身就跑，你追了两步，又停住了。",
"老佣兵的声音在耳朵里响：“打是为了护，不是为了杀。”",
"你站在原地，胸口起伏着。手上有一道口子，血顺着指缝滴在土里。不重，但疼——疼让你清醒。",
"那天夜里，老佣兵给你上药时说：“今天这一架，够你在这一带被人叫三天名字了。可你记住，这才刚起步。”",
"你点头。威震四海的路，是从这一架、这一道口子开始的。你把它记下了，一个字都不忘。"
],options:[
{t:"向老佣兵道谢（理想里程碑·完成）",effect:{flag:"ideal_goal_might_done"},go:"fc_tavern"}
]};
N["goal_guard_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你在交汇城住了下来，开始做一些不起眼的事。",
"帮被讹的菜农拦下多收的税钱，给巷口无人管的孤寡老人送两顿饭，夜里巡逻时顺路把醉倒路边的人拖回门廊下。",
"事情都很小，小到不值得说。可你发现，做这些事的时候，心是定的。",
"有个老婆婆问你：“年轻人，你图什么？”",
"你想了想，说：“图个心安。”"
],options:[
{t:"继续做下去（守护的路，从身边开始）",go:"goal_guard_2"}
]};
N["goal_guard_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你管的事渐渐多了。",
"城西有个叫二狗的孤儿，爹娘死在乱兵手里，靠偷东西过活。你逮了他三次，第三次，你没把他送官，而是让他跟着你干活，管饭。",
"二狗起初不信你，后来渐渐不跑了。他开始学着你的样子，帮人跑腿、搬货，赚几个铜板就买块饼，掰一半给巷口的野狗。",
"那天他忽然问你：“哥，你为啥管我？”",
"你看着他，想起自己的理想——守护苍生，让普通人能睡个安稳觉。你说：“因为该有人管。”"
],options:[
{t:"把这句话说给他听",go:"goal_guard_3"}
]};
N["goal_guard_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"入冬前的夜里，城西的旧货栈起了火。",
"火是从隔壁柴房烧起来的，风一吹，火舌直往住着七户人家的院子卷。你听见喊声时，已经从床上弹了起来。",
"你冲进火场，一趟一趟往外背人。第三趟出来时，房梁塌了，压在你背上，你被砸得趴在地上，喉咙里一股甜腥。",
"你咬着牙，把背上那个孩子往前递出去，然后自己才爬出来。半边袖子烧没了，手背上燎起一串水泡。",
"天快亮时火灭了。七户人家，一个不少。二狗蹲在你旁边，眼泪糊了一脸，把一块半凉的饼塞进你手里。",
"你靠着墙坐下，浑身疼得厉害，可心里那个念头反而更清楚了——你护住的这七户人，就是你的苍生。一个镇子一个镇子护过去，总能护出一个安稳觉来。",
"手背的伤会结痂。可有些东西，烧不掉。"
],options:[
{t:"接过那块饼（理想里程碑·完成）",effect:{flag:"ideal_goal_guard_done"},go:"fc_tavern"}
]};
N["goal_truth_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你在交汇城的旧书摊里淘到一本残卷，讲的是三百年前一次失败的封印。",
"书页缺了后半，记载封印地点的那页被人撕走了。你翻来覆去地看，发现夹缝里有一行极淡的墨字，像是后来补上去的：",
"“第七封印，勿启。”",
"你心里那根弦被拨动了。这个世界的秘密，藏在被撕掉的书页里。"
],options:[
{t:"沿着这行字查下去",go:"goal_truth_2"}
]};
N["goal_truth_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你花了半个月，顺着残卷的线索追查。",
"线索指向一个早已倒闭的旧书商，他留下的账本里，夹着一张泛黄的纸，上面画着七道封印的位置草图。草图标注了七个地名，其中一个你认得：深渊神殿。",
"你又在草图背面发现一行更小的字，被水渍洇得模糊：“七印之下，锁着的不只是深渊。还有一段被抹去的历史。”",
"你看着那行字，忽然觉得，自己摸到的不只是一本残卷，而是一扇门。"
],options:[
{t:"收好草图，继续追索（真相的路，走得越深越险）",go:"goal_truth_3"}
]};
N["goal_truth_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"你追着那行字，追到了交汇城地底的旧水道。",
"传闻三百年前，有学者在这里建过一间密室，藏了一部分被教会烧毁的卷宗。你花了三个晚上，在积水的石壁后摸到一道暗门。",
"门后是一间不大的石室，书架上堆着发霉的卷轴。你翻到最里面一卷时，手停了下来——那是一份抄本，标题只有四个字：《封印前史》。",
"你就着油灯读了大半夜。卷上写的事，和教会流传的说法对不上：七道封印建立时，不光是为了封深渊，还为了封住一段关于神明的旧事。落款是一个你从没听过的名字。",
"你合上卷轴，指尖还留着旧纸的凉意。窗外的天已经蒙蒙亮了。",
"你知道，从这一刻起，你心里那本被撕掉的书，开始有了第一页。真相的路很长，可你终于站在了起点上——手里有了一盏灯。",
"你把卷轴小心收进怀里。有些秘密，值得用一辈子去翻。"
],options:[
{t:"收好《封印前史》（理想里程碑·完成）",effect:{flag:"ideal_goal_truth_done"},go:"fc_tavern"}
]};
N["goal_free_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你在交汇城待了不到一个月，就有点待不住了。",
"这座城再好，城墙也是别人的。你收拾包袱的时候，楼下正好有一支商队要往北走，驼铃响得清脆。",
"你趴在窗口看了一会儿，忽然笑了。你想：去哪儿都行，只要脚是自己的。"
],options:[
{t:"搭上商队，往北走",go:"goal_free_2"},
{t:"不搭商队，自己走",go:"goal_free_2"}
]};
N["goal_free_2"]={tag:"branch",place:"北向官道",pace:"normal",text:[
"你跟着商队走了七天，又在半路分道扬镳——他们要去铁壁城做生意，你想去看看雪。",
"北境的风灌进领口，冷得人牙关打战。可你走着走着，却觉得浑身舒畅：天大地大，脚下这条土路是你的，走哪儿都是你的。",
"夜里你在路边生了一堆火，烤着干粮，看着满天的星。你忽然明白，自由这东西，不是没人管你，而是你想走的时候，随时能走。"
],options:[
{t:"记住这个夜晚的感觉",go:"goal_free_3"}
]};
N["goal_free_3"]={tag:"main",place:"北境 · 雪原边缘",pace:"deep",text:[
"你在北境的雪原上走了半个月，没有目标，也没有归期。",
"有一天傍晚，你翻过一道雪梁，看见山坳里有个快被雪埋了的小村子。村口的老树挂着半截绳，风一吹，晃得人心慌。",
"你本来可以绕过去。可你听见了哭声——很细，像被风掐着脖子。",
"你进了村。是个被雪崩压了半边的村子，七八户人，粮食埋了，一个孩子发了高烧，烧得说胡话。",
"你留下来，帮他们刨粮食，找草药，守了三天三夜。孩子退烧那天，全村的老人围着你，非要把你留下过年。",
"你拒绝了。可你在村口站了一会儿，看着他们把红纸糊上窗，忽然觉得，自由不是永远在路上——而是你愿意停的时候，心里没有亏欠。",
"你背起包袱，继续往北走。雪还在下，可你的步子比来时更稳了。风把你带到哪里，你的故事就写到哪里——这就是你选的答案。"
],options:[
{t:"继续走（理想里程碑·完成）",effect:{flag:"ideal_goal_free_done"},go:"fc_tavern"}
]};
N["goal_god_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你开始留意这座城里那些高处的建筑。",
"教堂的尖顶、执政厅的钟楼、冒险者公会的塔楼——你站在底下，仰头看它们，心里那个念头又冒出来：总有一天，你要站在比这些更高的地方。",
"你白天做工，夜里在城外的山坡上练气。没有功法，你就一遍遍地感受天地间的力量，像孩子蹒跚学步。",
"夜里你躺在山坡上，看着满天星斗，觉得它们都在往下看你。你对自己说：等着。"
],options:[
{t:"记住这份仰望，继续向上",go:"goal_god_2"}
]};
N["goal_god_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你渐渐摸到了一些门道。",
"一次偶然的机会，你在城郊的废墟里捡到半块刻着符文的石板。你不认得上面的字，却能感觉到石板里封着一股力量，像冻住的火。",
"你把石板带回去，日夜参悟。半个月后，你第一次让那股力量在掌心流动起来——只是一瞬，却让你浑身发烫。",
"那一瞬让你明白了：神座不是天生坐上去的，而是一步步爬上去的。你离它还很远，可你已经摸到了台阶的第一级。"
],options:[
{t:"收好石板，继续参悟",go:"goal_god_3"}
]};
N["goal_god_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"三个月后，你能让那股力量在指尖聚成一团微光。",
"光很弱，风一吹就散。可当你第一次把它送到二十步外的一棵树上时，树皮上留下了一道焦痕。",
"那天夜里，你站在城外的山坡上，把那团光举过头顶。山下的交汇城灯火如海，教堂的尖顶在夜色里只露出一个轮廓。",
"你看着那些灯火，忽然想起自己为什么要走这条路。不是贪那高处，是你在那一瞬看清了：凡人的世界里，弱者仰头看强者，强者仰头看更强者，而所有人都仰头看着天上。",
"你不想仰头。你要做那个让人仰望的存在。",
"你把手里的光攥灭，转身下山。步子很稳，心里很清楚——神座的路，是用一步一个脚印铺出来的，你才刚踩上第一级。但第一级，也是路。",
"你把它走扎实了。"
],options:[
{t:"下山，继续走自己的路（理想里程碑·完成）",effect:{flag:"ideal_goal_god_done"},go:"fc_tavern"}
]};
N["goal_fame_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你开始有意识地记下自己做过的事。",
"替码头的老人要回被讹的工钱，在酒馆里挡下一场斗殴，帮迷路的商队找到出城的路。事情不大，可每做完一件，你就用炭条在墙角的木板上画一道。",
"有人笑你傻：“记这个做什么？谁记得你？”",
"你笑了笑，没说话。你想：现在没人记得，可总有一天会有的。"
],options:[
{t:"继续画你的记号",go:"goal_fame_2"}
]};
N["goal_fame_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你做的事渐渐传开了。",
"先是巷子里的人见了你打招呼，然后是酒馆老板送你一杯酒，说“请那位好心的年轻人”。再后来，连城里的巡逻队长都认识了你，说你是个靠谱的后生。",
"有一天，你路过广场，听见一个吟游诗人在弹唱。他唱的不是英雄，只是一个路人的故事——说有个年轻人，帮一村人扛过了雪灾。",
"你站在人群外听了很久。故事被添了油加了醋，可你知道，那唱的是你。",
"你忽然觉得，名字这东西，原来是这样长出来的——不是刻在碑上，而是长在别人的嘴里。"
],options:[
{t:"记住这份感觉（名望的路，从这里开始）",go:"goal_fame_3"}
]};
N["goal_fame_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"半年后，你救了一个人。",
"是东境的富商，商队在城外汇合时遇了劫匪，你恰好路过，把人从刀口下抢了出来。富商当场要重谢你，你只要了他一句话：“以后若有人问起，就说我是谁。”",
"富商愣了愣，郑重地应了。",
"那之后，你的名字开始顺着商路传开。铁壁城有人提起你，南境有人提起你，连东境的账房先生都在闲谈时说起“那个在交汇城救人的年轻人”。",
"传得越来越远，也越来越不像你——可你知道，那就是你要的东西。",
"夜里你坐在屋顶上，听着风把你的名字吹向四方。你忽然笑了：名留青史，不是要让史官记住你，而是要让活着的人，在说起你的时候，眼睛里有光。",
"你的名字，已经长出了第一片叶子。剩下的，交给时间。"
],options:[
{t:"坐在屋顶上，听风把你的名字吹远（理想里程碑·完成）",effect:{flag:"ideal_goal_fame_done"},go:"fc_tavern"}
]};
N["goal_revenge_1"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你常常在夜里醒来。",
"那道旧伤还在隐隐作疼。你记得那年冬天，记得火光的颜色，记得那些人转身离开时靴子踩在雪上的声音。",
"你开始练刀。不为别的，就为有朝一日，把那道伤口的账，一笔一笔算清楚。",
"练刀的时候，你什么都不会想。刀起刀落，心里只有一个念头：欠我的，我亲手讨回来。"
],options:[
{t:"把恨意收进刀里（以血还血的路，从磨刀开始）",go:"goal_revenge_2"}
]};
N["goal_revenge_2"]={tag:"branch",place:"自由城邦 · 交汇城",pace:"normal",text:[
"你的刀越练越稳，恨意却不像以前那么烧了。",
"你开始打听当年那件事的线索。零星的碎片拼起来，你发现事情不像你记的那么简单——有些人的脸，你记错了方向。",
"你坐在城墙上，想了很久。刀还是那把刀，可你握着它的时候，手比从前稳了。",
"你明白了一件事：复仇不是一场火，而是一条路。路要走得准，就得先看得清。"
],options:[
{t:"继续追查当年的真相（看清了，再动手）",go:"goal_revenge_3"}
]};
N["goal_revenge_3"]={tag:"main",place:"自由城邦 · 交汇城",pace:"deep",text:[
"你花了大半年，把当年那件事的线头一根根捋了出来。",
"真相不像你记忆里那么黑，也不像别人嘴里那么白。那年的火，有人放了，有人袖手，有人救了，可你全家还是死在了那场火里——欠账的人，不止一个。",
"你把这些名字一个个刻在刀鞘内侧。刻得很慢，像刻碑。",
"最后一天夜里，你看着刀鞘上那排名字，忽然发现自己心里那团烧了多年的火，熄了一半。不是不恨了，是你终于看清了恨的形状。",
"你把它收好。该讨的账，你一个都不会漏；可你要用自己的方式讨——堂堂正正地，让该还的人知道自己为什么挨这一刀。",
"那天夜里你睡得很沉，梦见了火。火里有人伸出一只手，你握住了。醒来时，天已经亮了。"
],options:[
{t:"收刀（理想里程碑·完成）",effect:{flag:"ideal_goal_revenge_done"},go:"fc_tavern"}
]};

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

/* /u1inj:data-nodes:dn_origin_expand.js/ */
/* /A3inj:origin-expand/ 序章亚种扩充链（对象式；每亚种 8 节点，入口挂 origin_*_1 首选项，走完回接） */
(function(){
var N = window.N || (window.N = {});

N["origin_expand_north_1"] = {tag:"main",pace:"normal",place:"北境·灰烬村·灶台边",
text:[
"那年的第一场雪来得早。",
"母亲在灶台边揉面，面团在粗瓷盆里发出沉闷的声响。她手上的裂口被雪水泡得发白，却不肯停下——铁门关的军需官说，今年冬天，北境要靠这批干粮过活。",
"你蹲在门槛上，把父亲削的木剑举到眼前。剑身上刻着三道划痕——每道代表你长了一岁。今年多了第四道，是昨晚你趁父亲睡熟后自己刻的。",
"「别拿那东西在门口比划，」母亲头也不回，「风大，闪了手。」",
"你收起木剑，望着村口的方向。积雪盖住了路，也盖住了远处废墟的轮廓。老人们说，那片废墟以前是一座城，一夜之间就没了。",
"「娘，废墟里真的住着东西吗？」",
"母亲的手停了一瞬。她没有回答，只是把面团摔在案板上，声音闷闷的：「吃饭。」"
],
options:[
{t:"帮忙劈柴（力量）",check:{a:"STR",sk:"fight",label:"体力·劈柴"},tier:{
ok:["你抡起斧头，把院角的柴堆劈了一半。手心里磨出的水泡破了，你也不在意——父亲说过，北境的汉子，伤疤就是勋章。","母亲往你碗里多夹了一块肉。","（体魄略有长进。）"],
fail:["斧头砍进木头，拔不出来。你拽了半天，最后是母亲过来，一脚踩住柴堆，轻轻一扭，斧头就出来了。","「还是读书去吧。」她说。"]
},effects:{flag:"origin_expand_north_chop"},go:"origin_expand_north_2"},
{t:"偷偷溜到村口看废墟",check:{a:"SPR",sk:"detect",label:"感知·远望"},tier:{
ok:["你踩着积雪走到村口。废墟在暮色里像一头伏卧的兽，瓦砾间有黑色的缝隙，深得看不见底。","风从那里灌过来，带着一股铁锈和灰烬的味道。你打了个哆嗦，退回村里。","（你记住了那个方向。）"],
crit:["你一直走到废墟边缘。雪地上有一串脚印——不是人的脚印，五趾，比狼爪大，比熊掌小。脚印很新，还在冒着热气。","你顺着脚印看过去，废墟深处，一双眼睛正看着你。","你没有跑。你慢慢后退，一步，两步，直到那双眼睛消失在黑暗中。","回村之后，你谁都没告诉。但你悄悄把父亲那把旧猎刀藏进了怀里。"],
fail:["你在村口站了一会儿，风把雪粒吹进领口，你缩着脖子回去了。什么也没看见。"]
},effects:{flag:"origin_expand_north_edge"},go:"origin_expand_north_2"},
{t:"去帮妹妹找她丢的布偶",effects:{flag:"origin_expand_north_doll"},go:"origin_expand_north_2"}
]};

N["origin_expand_north_2"] = {tag:"main",pace:"normal",place:"北境·灰烬村·夜里",
text:[
"夜里，你躺在炕上，听着屋外风声。",
"北境的风和别处不一样。它会在屋脊上打旋，像有什么东西在屋顶来回走。你从小听到大，今夜却总觉得不对劲——风里夹着一丝细细的、像人哭又像兽嚎的声音。",
"妹妹在隔壁翻了个身，嘟囔了一句梦话。你屏住呼吸，那声音又没了。",
"你摸到枕边的木剑，攥紧。父亲今夜值夜，不在家。母亲在油灯下补衣裳，针线穿过粗布的声音，在寂静里格外清晰。",
"「娘，你听。」你说。",
"母亲没有抬头：「听什么。」",
"「外面……好像有声音。」",
"油灯的火苗晃了一下。母亲放下针线，侧耳听了片刻，又拿起针：「是风。睡吧。」",
"你躺回去，却睡不着。你总觉得，有什么东西，正在慢慢靠近这座村庄。"
],
options:[
{t:"再听听那声音",effects:{flag:"origin_expand_north_listen"},go:"origin_expand_north_3"},
{t:"披上衣服，去院里看看",effects:{flag:"origin_expand_north_yard"},go:"origin_expand_north_3"}
]};

N["origin_expand_north_3"] = {tag:"main",pace:"normal",place:"北境·灰烬村·清晨",
text:[
"天亮得比往常晚。",
"你推开院门时，雪已经停了。院子里的脚印是你的——昨夜的疑心，只留下这一串。",
"邻家的猎户老周正在门口收拾雪橇。他看见你，咧嘴一笑：「小子，起得早。夜里没睡好？」",
"你摇头。老周压低了声音：「别怕。北边那几个村子，昨天夜里全迁了。上头说，废墟那边不太平。」",
"「迁去哪了？」",
"「难民营。铁门关南边。」老周拍了拍雪橇上捆着的箱子，「我家也快了。你爹值完夜回来，你们家也得走。」",
"他顿了顿，又说：「走之前，把你家地窖里那坛腌菜带上。难民营里，盐比命值钱。」",
"你站在原地，看着老周赶着雪橇消失在村口。雪又开始下了，细碎的，落在你肩头。",
"你不知道难民营是什么样。但你第一次觉得，脚下的土地，正在变凉。"
],
options:[
{t:"回家告诉母亲",effects:{flag:"origin_expand_north_tell"},go:"origin_expand_north_4"},
{t:"先去地窖看看存粮",effects:{flag:"origin_expand_north_cellar"},go:"origin_expand_north_4"}
]};

N["origin_expand_north_4"] = {tag:"branch",pace:"light",place:"北境·灰烬村·地窖口",
text:[
"地窖的木板门冻得发脆，你掀开时，一股潮气混着腌菜的酸味涌上来。",
"母亲下来点了一支油灯。昏黄的光里，坛子排成一排：腌菜、萝卜、半袋黑麦。她数了数，又数了一遍，最后把油灯搁在台阶上，久久没有说话。",
"「粮食够吃到开春。」她说，「可难民营，谁知道要住多久。」",
"你站在地窖口，看着她被灯影拉长的背影。她比你记忆里矮了一些，也瘦了一些。",
"她忽然回头看你：「你在怕什么？」",
"你张了张嘴。你其实说不清。你怕废墟里的眼睛，怕夜里那哭声一样的风，怕「迁走」这两个字后面那种说不清的、再也回不来的意味。",
"「没有。」你说。",
"母亲看了你一会儿，没戳破。她伸手，从坛子后面摸出一个布包，塞进你怀里。",
"「这是你爹的旧皮甲。改小了，你穿。」她顿了顿，「北境的孩子，早晚要见血。早点穿上，我安心。」"
],
options:[
{t:"接过皮甲，穿上",effects:{flag:"origin_expand_north_armor"},go:"origin_expand_north_5"},
{t:"把皮甲推回去：「娘，你留着」",effects:{flag:"origin_expand_north_refuse"},go:"origin_expand_north_5"}
]};

N["origin_expand_north_5"] = {tag:"main",pace:"normal",place:"北境·灰烬村·夜",
text:[
"那晚的风声，是从半夜开始的。",
"你先是听见狗叫。村里所有的狗，同时叫了起来，声音又急又乱，像被什么吓破了胆。然后狗叫声像被掐住喉咙一样，一只一只地停了。",
"你从炕上坐起来。母亲已经站在门口，手里攥着一把镰刀，脸色发白。",
"「别出声。」她说。",
"门板外传来脚步声。不重，但很沉，一步，一步，像踩在所有人的心上。脚步声在你们家门前停住了。",
"你握紧木剑，听见自己的心跳声大得像擂鼓。门缝里透进一丝光——不是火光，是某种惨白的、像月光又不像月光的颜色。",
"那脚步声停了一会儿，又走了。走得很慢，往村口方向去了。",
"母亲等那声音彻底消失，才吐出一口气。她没看你，声音很低：「穿上皮甲。天亮，我们就走。」",
"你点点头。你忽然明白，老周说的「不太平」，比你想象的还要重。"
],
options:[
{t:"跟出去看看那东西去哪了",effects:{flag:"origin_expand_north_trail"},go:"origin_expand_north_6"},
{t:"抱紧木剑，等天亮",effects:{flag:"origin_expand_north_wait"},go:"origin_expand_north_6"}
]};

N["origin_expand_north_6"] = {tag:"main",pace:"normal",place:"北境·灰烬村·村口",
text:[
"天没亮透，你们就出了门。",
"雪地上，一串脚印从你们家门口一直延伸向村口——五趾，比狼爪大，比熊掌小。和你在废墟边缘看见的，一模一样。",
"你爹在村口等你们。他脸上一道血口子，皮甲上沾着灰，看见你们，只说了两个字：「走。」",
"灰烬村空了。十户人家，十户都空了。家家门板敞开，锅灶还留着余温，人却都站在村口那条通往南边的土路上。",
"没有人说话。孩子们被大人攥着手，老人拄着拐杖，女人背着包袱。所有人都朝着一个方向——铁门关南边，难民营。",
"你回头看了一眼灰烬村。雪又开始下了，很快，那些敞开的门、没熄的灶、还有你刻过划痕的门槛，都会被雪盖住。",
"你爹走在最前面。他的背影和你记忆里一样挺直，但你看见，他攥着刀柄的手，指节发白。",
"「别回头。」他说。"
],
options:[
{t:"跟上父亲的脚步",effects:{flag:"origin_expand_north_follow"},go:"origin_expand_north_7"}
]};

N["origin_expand_north_7"] = {tag:"main",pace:"normal",place:"北境·南行土路",
text:[
"南行的路走了三天。",
"第三天傍晚，你们遇到了一支车队。车上拉着伤兵，还有几具用草席裹着的尸体。赶车的老兵看见你们，把车停了。",
"「北边来的？」他问。",
"你爹点头。老兵从车上摸出一块干饼，扔给你：「省着吃。难民营还远。」",
"「前面怎么样？」你爹问。",
"老兵沉默了一会儿：「铁门关的兵，退了三道防线。那些东西……不怕刀剑，砍倒了，过一会儿又站起来。只有火烧得死。」",
"他看了看你们一家：「你们命大。北边几个村子，有的整村都没了。」",
"车队走了。你攥着那块干饼，手心全是汗。",
"你爹忽然开口：「到了难民营，你记住——」他顿了顿，「别让人知道，你见过那些东西。」",
"「为什么？」",
"「见过深渊的东西还能活着的人，学院喜欢。」你爹的声音很平，「但有些喜欢，是要拿命去换的。」",
"你听不懂，但你把这句话记下了。"
],
options:[
{t:"记住父亲的话",effects:{flag:"origin_expand_north_remember"},go:"origin_expand_north_8"}
]};

N["origin_expand_north_8"] = {tag:"main",pace:"light",place:"北境·难民营·入口",
text:[
"难民营比你想象的还要大，还要挤。",
"帐篷一片连着一片，泥地被踩得稀烂。空气里有药味、汗味、还有说不清的绝望味道。你攥着母亲的衣角，在人流里穿行。",
"一个穿灰袍的人拦住你们，手里拿着一张纸：「哪来的？报名字，报人数。」",
"你爹报了名字。灰袍人刷刷记下，又看了你一眼：「这小子多大了？」",
"「十四。」你爹说。",
"灰袍人打量你片刻，在纸上画了个记号：「体格还行。明天去东边帐篷领号——有活儿干，就有饭吃。」",
"你跟着父母走进难民营。身后，灰烬村的方向，只剩下一片白茫茫的雪。",
"你知道，你回不去了。",
"但你也知道，从这一刻起，你不再是灰烬村那个蹲在门槛上刻木剑的少年了。"
],
options:[
{t:"安顿下来（序章继续）",effects:{flag:"origin_expand_north_done"},go:"origin_northern_1"}
]};

/* ============ 南境·商船学徒 ============ */
N["origin_expand_south_1"] = {tag:"main",pace:"normal",place:"南方港城·银穗号·甲板",
text:[
"银穗号吃水很深。这趟装了三百桶桐油，外加两箱给交汇城商会的瓷器。",
"你十四岁上船，今年十六，已经是船长的学徒。说是学徒，其实什么都干：洗甲板、搓缆绳、给老水手递烟斗。",
"老水手陈叔躺在货堆上，用草帽盖着脸，声音闷闷地传出来：「小子，看那边。」",
"你顺着他指的方向看。海面上，几条渔船正往港口赶，帆张得满满的，像被什么追着。",
"「风要变了。」陈叔说，「南边的海，风一来，就是三天。」",
"你抬头看天。天还是蓝的，蓝得不像话。可海水的颜色不对——靠近港口的地方，泛着一层油亮的光，像有什么东西从海底翻上来。",
"「陈叔，那光是什么？」",
"陈叔没回答。过了好一会儿，他才说：「你晚上别往船尾去。」",
"「为什么？」",
"「船尾那盏灯，得一直亮着。」他把草帽拉下来，遮住整张脸，「有些东西，在夜里认灯。」"
],
options:[
{t:"问陈叔那是什么东西",effects:{flag:"origin_expand_south_ask"},go:"origin_expand_south_2"},
{t:"帮忙检查船尾的灯",effects:{flag:"origin_expand_south_lamp"},go:"origin_expand_south_2"}
]};

N["origin_expand_south_2"] = {tag:"main",pace:"normal",place:"南方港城·银穗号·船尾",
text:[
"船尾挂着一盏铜灯，灯罩擦得锃亮。",
"你检查了灯芯，又添了油。灯座下刻着一行小字，被海水锈蚀得模糊，但你凑近认了半天：「南无……镇……海……」",
"陈叔不知什么时候站在你身后：「『南无镇海』。老船长的规矩，每个港口请一盏。」",
"「它镇什么？」",
"陈叔看着黑沉沉的海面：「你听没听过，海上有人见过绿光？」",
"你想起甲板上那层油亮的光：「见过。」",
"「那光是深的。」陈叔说，「浅海没有。到了深水区，船底往下看，有时候能看到——一闪一闪的，像喘气。」",
"他沉默了一会儿：「船上老人说，那是海底的东西在翻身。翻身的时候，船上的灯不能灭。灭了，它就知道你在哪了。」",
"海风忽然凉了。你打了个寒噤。",
"「怕了？」陈叔咧嘴笑，「怕就对了。这片海上，不怕的人，都喂了鱼。」"
],
options:[
{t:"问陈叔有没有人亲眼见过那光",effects:{flag:"origin_expand_south_green"},go:"origin_expand_south_3"},
{t:"记下『绿光』的事，回舱房",effects:{flag:"origin_expand_south_mark"},go:"origin_expand_south_3"}
]};

N["origin_expand_south_3"] = {tag:"main",pace:"normal",place:"南方港城·码头市集",
text:[
"开船前半天，你跟着大副上岸采买。",
"码头市集热闹得像一锅滚粥：卖鱼的扯着嗓子报价，扛包的苦力排着队过秤，一个算命的瞎子坐在墙角，面前摆着一碗清水。",
"大副在肉摊前跟人讨价还价，你站在边上等。瞎子忽然开口：「小兄弟，过来。」",
"你走过去。瞎子没看你，只看着碗里的水：「你身上有海腥味。常年在船上？」",
"「嗯。」",
"「我给你算一卦，不要钱。」他伸手，在碗里蘸了点水，在船板上画了个圈，「你这一趟，出港第三天，有风浪。」",
"「风浪常有。」你说。",
"「不是那种风浪。」瞎子抬起头——他的眼睛是灰白色的，没有瞳仁，「是海下面的浪。浪起来了，船上的灯，不要灭。」",
"他顿了顿：「灯灭了，你就往船头跑，别回头。」",
"大副买完肉回来，见你发愣：「跟个瞎子较什么劲。走了。」",
"你跟着大副往回走。走了几步，你回头——瞎子的摊子还在，人却不见了。碗里的水，已经干了。"
],
options:[
{t:"把瞎子的话记在心里",effects:{flag:"origin_expand_south_seer"},go:"origin_expand_south_4"},
{t:"跟大副提起这件事",effects:{flag:"origin_expand_south_tellmate"},go:"origin_expand_south_4"}
]};

N["origin_expand_south_4"] = {tag:"branch",pace:"light",place:"南方港城·银穗号·货舱",
text:[
"开船前一晚，你清点货舱。",
"桐油桶码得整整齐齐，瓷器的箱子用稻草垫着。你数到第三遍，发现最里面多了一个箱子——不在这趟货单上。",
"箱子是黑木的，没上漆，边角包着铜皮。锁是新换的，铜锁上刻着一只眼睛的图案。",
"你蹲下来看那只眼睛。看久了，总觉得它也在看你。",
"「别碰那个箱子。」",
"你吓了一跳，回头一看，船长站在舱门口。他什么时候来的，你完全没听见。",
"「那是谁的？」你问。",
"「货主的。」船长没有多解释，「记住，这趟船上，你什么都没看见。」",
"他转身走了。你蹲在黑木箱前，心里像被什么东西挠着。",
"那只眼睛。你在哪里见过？"
],
options:[
{t:"遵从船长的话，当没看见",effects:{flag:"origin_expand_south_obey"},go:"origin_expand_south_5"},
{t:"趁夜撬开铜锁看看",check:{a:"AGI",sk:"stealth",label:"敏捷·撬锁"},tier:{
ok:["夜里，你用一根铁丝拨开了铜锁。箱子打开的一瞬，一股凉气扑出来——里面是一卷兽皮，上面画着海图，标注着一个从未见过的海域名：『深渊之眼』。","海图边沿写着一行小字：『第七印，在海底。』","你赶紧把箱子锁好，装作什么都没发生。"],
fail:["你撬了半天，铜锁纹丝不动。第二天，船长看着锁上新添的划痕，什么都没说，但看你的眼神，让你后背发凉。"]
},effects:{flag:"origin_expand_south_chest"},go:"origin_expand_south_5"}
]};

N["origin_expand_south_5"] = {tag:"main",pace:"normal",place:"南方港城·银穗号·出港",
text:[
"第三天清晨，银穗号出港。",
"码头上，送行的人挥着手，喊声混在海鸥的叫声里。你站在桅杆边，看着港口越来越小，直到变成一条线。",
"海面平静得像一面镜子。陈叔说，这是暴风雨前的好天气。",
"你想起瞎子的话：出港第三天，有风浪。今天，正好是第三天。",
"午后，天空开始变暗。不是乌云——是像墨汁滴进水里那样，一点一点地，从海平面那头浸上来。",
"船长站在船头，声音被风扯得变了形：「收帆！全员下舱！」",
"浪来了。不是一层，是一堵墙，黑绿色的，压着海面扑过来。银穗号像一片叶子，被抛上浪尖，又砸进谷底。",
"你死死抱住桅杆，听见木头在呻吟。就在这时候，你看见——船尾那盏铜灯，灭了。",
"海面下，亮起一片绿光。很深，很远，像一只眼睛，正在睁开。"
],
options:[
{t:"往船头跑，别回头（记住瞎子的话）",effects:{flag:"origin_expand_south_run"},go:"origin_expand_south_6"},
{t:"往回冲，去把船尾的灯重新点亮",effects:{flag:"origin_expand_south_relight"},go:"origin_expand_south_6"}
]};

N["origin_expand_south_6"] = {tag:"main",pace:"normal",place:"南方深海·银穗号·风浪中",
text:[
"绿光越来越亮。海水像活了一样，浪头裹着光，拍上甲板。",
"你往船头跑。脚下的甲板在晃，一根缆绳横过来，你被绊了一下，膝盖重重磕在船板上，血味混进嘴里。",
"你爬起来继续跑。身后传来陈叔的喊声：「别回头！小子，别回头！」",
"你跑到船头，死死抓住船首像。风浪把你的头发扯得倒竖，海水劈头盖脸地浇下来，又咸又冷。",
"你低头看了一眼海面——绿光就在船底下，跟着船走，像在打量这艘船。",
"你想起母亲。想起她在灶台边揉面的样子。你忽然不想死在这片海上。",
"你扯下脖子上的护身符——那是你上船时，母亲从一个佛龛里求来的。你攥着它，冲着海面，一字一句地喊：",
"「我不知道你是什么！但我告诉你——我不怕你！」",
"喊完你才知道自己在发抖。风浪忽然顿了一下。那绿光，像被什么东西惊到一样，往深处沉了沉。",
"然后，一根断桅砸下来，你眼前一黑。"
],
options:[
{t:"（失去意识）",effects:{flag:"origin_expand_south_blackout"},go:"origin_expand_south_7"}
]};

N["origin_expand_south_7"] = {tag:"main",pace:"normal",place:"南方深海·银穗号·次日",
text:[
"你醒过来时，天已经亮了。",
"风浪过去了。甲板上到处是断绳、碎木，两个水手在清点损失。银穗号还在，歪歪斜斜地浮在海面上，像一个挨了打的醉汉。",
"陈叔坐在你旁边，脸上青一块紫一块，嘴里叼着烟斗：「醒了？」",
"「……那是什么？」你问。",
"陈叔吐出一口烟：「不知道。船上的老人都没见过这种浪。但我知道一件事——」他指了指船尾，「那盏灯，是它自己灭的。这种灯，不是风吹灭的，是它自己不想亮了。」",
"你沉默了一会儿：「我们活下来了。」",
"「是。」陈叔看了你一眼，「小子，能在那种浪里活下来的人，不是命大，是这片海认了你。海认了的人，海就放你走。」",
"他顿了顿：「但也别太得意。海认了你，也盯上你了。」",
"远处，海面尽头出现一条黑线——那是陆地。交汇城，快到了。"
],
options:[
{t:"看着越来越近的陆地",effects:{flag:"origin_expand_south_arrive"},go:"origin_expand_south_8"}
]};

N["origin_expand_south_8"] = {tag:"main",pace:"light",place:"南方港城·交汇城·码头",
text:[
"银穗号靠岸时，太阳正挂在头顶。",
"交汇城的码头比南方港大得多。船帆密得像森林，扛货的、叫卖的、算账的，人声像潮水。",
"你帮陈叔把缆绳系好。他拍了拍你的肩：「到了。往后这片码头，你也算熟了。」",
"你站在船舷边，看着这座陌生的城。海风里，你仿佛还能闻到那天夜里海水的味道，还能看见那片绿光。",
"你摸了摸怀里的护身符——它还在，只是裂了一条缝。",
"船长走过来，递给你一小袋铜星：「你的工钱。另外——」他压低声音，「那个黑木箱子，你什么都没看见，对吧？」",
"你和他对视。",
"「……对。」你说。",
"船长点了点头，转身走了。你攥着那袋铜星，站在码头上，不知道自己算不算做对了。",
"但你知道，你这趟没有白跑。你见过那片海了。"
],
options:[
{t:"离开码头，走进交汇城（序章继续）",effects:{flag:"origin_expand_south_done"},go:"origin_southern_1"}
]};

/* ============ 教会·圣堂孤儿 ============ */
N["origin_expand_church_1"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·钟楼",
text:[
"圣城的钟，每天敲三次。",
"你是在钟声里长大的。七岁那年被送进黎明圣堂的孤儿院，到现在，整整十年。",
"孤儿院的嬷嬷姓杜，管你们吃饭、识字、背经文。她打人疼，但从不饿着你们。",
"今天一早，杜嬷嬷把你叫到钟楼底下，塞给你一把扫帚：「去把钟楼扫了。大主教今天要来巡视。」",
"你扫到第三层，听见楼下有说话声。你从窗缝里往下看——大主教穿着一身白袍，正和杜嬷嬷站在院子里。",
"「……圣痕的事，查得怎么样了？」大主教的声音不高，但钟楼的石壁把声音传得很清楚。",
"杜嬷嬷：「查过了。最近半年，城里没再出现圣痕的孩子。」",
"「嗯。」大主教停了一会儿，「上头的意思是，异端的祸根，要尽早掐掉。圣痕这种东西，出现在谁身上，谁就是被深渊碰过的——宁可信其有。」",
"你握着扫帚，一动不动。",
"圣痕。你听孤儿院的孩子们说过：传说被深渊碰过的人，身上会留下印记。而教会的人，看见圣痕，就会把那个人带走。",
"带走之后呢？没人知道。"
],
options:[
{t:"继续听下去",effects:{flag:"origin_expand_church_eavesdrop"},go:"origin_expand_church_2"},
{t:"故意弄出动静，打断他们",effects:{flag:"origin_expand_church_noise"},go:"origin_expand_church_2"}
]};

N["origin_expand_church_2"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·孤儿院",
text:[
"杜嬷嬷的脸，那天下午一直绷着。",
"她把你们十个孩子叫到堂前，挨个检查。轮到最后一个孩子——瘦瘦小小的阿禾——她忽然顿住了。",
"阿禾的左手腕内侧，有一块淡青色的印记，像一片烧焦的叶子。",
"杜嬷嬷盯着那块印记看了很久，然后一把把阿禾的袖子拉下来，声音平淡得吓人：「没事。都去干活。」",
"孩子们散了。你走的时候回头看了一眼——杜嬷嬷站在堂前，背对着你，一动不动，像一尊石像。",
"夜里，你翻来覆去睡不着。你悄悄爬起来，摸到阿禾的床边。",
"阿禾也没睡。黑暗里，她的眼睛亮亮的：「你看见了？」",
"「嗯。」",
"「那就是圣痕。」阿禾的声音很轻，「我娘说，我们家祖上，有人碰过深渊的东西。这印记，是传下来的。」",
"「杜嬷嬷会把你交出去吗？」",
"阿禾沉默了很久：「如果交出去，我就再也回不来了。」",
"你躺在草席上，听着她的话，心里像压着一块石头。",
"第二天一早，杜嬷嬷出现在你们面前，手里拿着一封信：「阿禾，收拾东西。主教要见你。」"
],
options:[
{t:"站出来，说圣痕是你画的",effects:{flag:"origin_expand_church_cover"},go:"origin_expand_church_3"},
{t:"看着阿禾被带走",effects:{flag:"origin_expand_church_letgo"},go:"origin_expand_church_3"}
]};

N["origin_expand_church_3"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·大主教书房",
text:[
"你被带到大主教的书房时，他正在看一卷羊皮纸。",
"「坐。」他指了指对面的椅子。你坐下了，半个屁股悬在椅沿上。",
"大主教放下羊皮纸，看着你：「杜嬷嬷说，你承认圣痕是你画的。」",
"「……是。」",
"「用什么画的？」",
"「用……墨水。」",
"大主教笑了。他笑得很和善，但你看得出来，那和善下面是别的什么：「你过来。」",
"你走过去。他拉起你的左手，翻过来，看了一眼：「你手上没有墨痕。你昨天晚上，没有碰过任何墨水。」",
"你的心沉下去。",
"「圣痕，是用血画的。」大主教松开你的手，声音依然和善，「你愿意为那个孩子，割自己的血吗？」",
"你张了张嘴，说不出话。",
"「你不愿意。」大主教替你回答了，「所以我给你两个选择：一，说出实话；二——」他顿了顿，「明天，你和那个孩子一起去异端审判庭。」"
],
options:[
{t:"说实话（圣痕不是我画的）",effects:{flag:"origin_expand_church_truth"},go:"origin_expand_church_4"},
{t:"咬死不说，护住阿禾",effects:{flag:"origin_expand_church_stubborn"},go:"origin_expand_church_4"}
]};

N["origin_expand_church_4"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·后院",
text:[
"那晚，你被关在后院的柴房里。",
"月光从窗缝漏进来，在地板上拉出一条白线。你靠着墙，数着心跳。",
"半夜，门锁忽然响了。杜嬷嬷推门进来，手里提着一盏灯。",
"「跟我走。」她说。",
"你跟着她穿过回廊，绕过巡夜的神殿骑士，从后门进了城。她走得很快，鞋底踩在石板路上，声音很轻。",
"城东一间小院里，阿禾坐在炕上，看见你，眼睛一下子红了。",
"杜嬷嬷把门关上，转过身，看着你们两个：「阿禾，你连夜走，往东走，去东境的承天城。那里有个人，姓秦，你把这个交给他。」她从怀里取出一枚铜牌，塞进阿禾手里。",
"「嬷嬷，那你呢？」阿禾问。",
"「我一把老骨头，不怕。」杜嬷嬷看着你，「小子，你明天回去，就说是你贪玩画了假圣痕，被我识破，罚了三天禁闭。阿禾，是被主教送去东境做学徒了——记住了吗？」",
"你点点头。",
"杜嬷嬷打开门，看着你们：「走。别回头。」",
"你站在月光下，看着阿禾的身影消失在巷口。她临走时回头看了你一眼，那一眼里，有害怕，也有别的什么。"
],
options:[
{t:"记住杜嬷嬷的话",effects:{flag:"origin_expand_church_memo"},go:"origin_expand_church_5"}
]};

N["origin_expand_church_5"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·圣痕司",
text:[
"阿禾走后第三天，你被叫进了圣痕司。",
"圣痕司在教堂地下。台阶又窄又陡，墙上点着牛油蜡烛，火苗被穿堂风扯得歪歪扭扭。",
"审问你的是一个穿黑袍的司祭。他脸上有一道疤，从眼角一直划到下巴，说话时疤会跟着动。",
"「你就是那个画假圣痕的？」他问。",
"「是。」你按杜嬷嬷教的说，「我贪玩，用墨水画的，想吓唬人。」",
"黑袍司祭看了你很久。久到你后背开始冒汗。",
"「墨水画的，洗不掉？」他问。",
"「……我用的墨水，不好洗。」",
"黑袍司祭忽然笑了。他笑起来比不笑还吓人：「那孩子的手腕，我们验过了——不是墨水。是印记。血里带出来的印记。」",
"「你要是现在说实话，我可以当你是孩子不懂事。」他弯下腰，凑近你，「你要是再撒谎——」",
"他没说下去。但他的手，搭在了你肩膀上，像一把钳子。",
"你想起阿禾。想起杜嬷嬷。想起那枚铜牌，和「姓秦的」。",
"你攥紧拳头，说：「……我说的，都是实话。」"
],
options:[
{t:"咬死这句话",effects:{flag:"origin_expand_church_hold"},go:"origin_expand_church_6"},
{t:"改口，把一切都供出来",check:{a:"MIND",sk:"focus",label:"意志·坚持"},tier:{
ok:["你咬死了那句话，反复说，说得自己都快信了。黑袍司祭盯了你很久，最后挥了挥手：「带下去。禁闭三天，不许吃饭。」","你被拖出圣痕司的时候，腿是软的。但你做到了——你没有把阿禾和杜嬷嬷供出来。"],
fail:["黑袍司祭的钳子一样的手，让你崩溃了。你哭着把一切都说了：阿禾、杜嬷嬷、铜牌、东境、姓秦的。","说完你才知道后悔。黑袍司祭满意地直起身：「好孩子。」","（你出卖了她们。这件事，会跟着你很久。）"]
},effects:{flag:"origin_expand_church_break"},go:"origin_expand_church_6"}
]};

N["origin_expand_church_6"] = {tag:"main",pace:"normal",place:"圣城·黎明圣堂·禁闭室",
text:[
"禁闭室只有一扇小窗，高得够不着。",
"你数着窗外天光的明暗，数了三天。水是隔天送一次的，干饼硬得像石头，你泡着水掰着吃。",
"第三天夜里，门开了。不是黑袍司祭——是杜嬷嬷。",
"她瘦了很多。她把一个布包塞进你手里：「里面是干粮和两个铜星。城门天亮开，你混在送菜的车队里出去。」",
"「嬷嬷……」",
"「别问。」杜嬷嬷打断你，「阿禾那孩子，我已经送走了。你留在这里，那疤脸不会放过你——他已经派人往东追了。」",
"她看着你，眼睛里有泪光，但她没有让它掉下来：「孩子，圣城不是你的地方了。走吧，走得越远越好。」",
"「去哪？」",
"杜嬷嬷想了想：「往南，去交汇城。那里人多，鱼龙混杂，没人查你。」",
"她把一样东西塞进你手心——是那枚铜牌的样子，但刻的是另一行字：「这是你娘留给你的。她当年也是圣堂的孩子。记住，这块牌子，别让任何人看见。」",
"你攥着铜牌，跪下来，给杜嬷嬷磕了一个头。",
"她扶起你，最后一次给你整了整衣领：「走。」"
],
options:[
{t:"天亮前混出城",effects:{flag:"origin_expand_church_escape"},go:"origin_expand_church_7"}
]};

N["origin_expand_church_7"] = {tag:"main",pace:"normal",place:"圣城·城南·送菜车队",
text:[
"天没亮，你钻进一辆送菜车的草堆里。",
"车身颠簸，白菜的叶子戳着你的脸。你一动不动，听着车轮碾过石板路的声音，一茬一茬地往后退。",
"城门口，守门的骑士拦下了车队：「例行检查！车上装的什么？」",
"「菜。」赶车的老头赔着笑，「圣堂订的菜，天天都走这趟。」",
"骑士掀开草帘看了一眼，白菜的清香扑了他一脸。他挥挥手：「走。」",
"车轮重新动起来。你躺在草堆里，攥着那枚铜牌，手心的汗把牌子都浸湿了。",
"出城十里，你从车上跳下来。老车夫没看你，只甩了一鞭子，喊了一声：「走远点，别回来了。」",
"你站在官道上，身后是圣城的轮廓，晨光正从城墙后面升起来。",
"你回头看了一眼。圣城的钟，又响了。",
"这是你最后一次，听到黎明圣堂的钟声。"
],
options:[
{t:"转身向南，往交汇城走",effects:{flag:"origin_expand_church_road"},go:"origin_expand_church_8"}
]};

N["origin_expand_church_8"] = {tag:"main",pace:"light",place:"南行官道·驿站",
text:[
"南行的官道走了七天。",
"你一路搭车、蹭饭，用杜嬷嬷给的铜星换了几个黑馒头。第七天黄昏，你在一座破驿站里过夜，遇见一个卖货郎。",
"货郎的担子里什么都有：针线、布头、草纸，还有几卷旧书。他见你盯着书看，咧嘴一笑：「识字？」",
"「圣堂里学过。」",
"「圣堂？」货郎打量你一眼，压低声音，「圣城那地方，现在可不太平。听说圣痕司抓了好几个孩子，说是深渊的种。」",
"你握着铜牌的手一紧。",
"「不过那是圣城的事，管不着咱们。」货郎掏出一卷书递给你，「送你一本，路上解闷。」",
"你接过来，是一本讲大陆风物的旧册子。翻到中间一页，你忽然停住了——那页上画着一只眼睛的图案，和圣堂经书里的一模一样。",
"旁边写着一行小字：「七印之一，主深渊之门。见之者，慎言。」",
"你把书收进怀里。这一路，你越来越觉得，这个世界比你听过的经文，要复杂得多。"
],
options:[
{t:"揣好旧书，继续向南（序章继续）",effects:{flag:"origin_expand_church_done"},go:"origin_church_1"}
]};

/* ============ 精灵·世界树 ============ */
N["origin_expand_elf_1"] = {tag:"main",pace:"normal",place:"精灵林地·世界树根下",
text:[
"世界树很大。大到你抬头，看不见树冠在哪。",
"你是在树根下长大的。精灵的孩子，出生后会在世界树的根部住上十年——听树根里的水声，学树叶的呼吸。",
"你今年一百二十岁，在精灵里，还是个孩子。",
"长老艾萨拉每天清晨都会来树根下，带你们念诵古语。她说，世界树的根须伸到大陆的每个角落，念诵古语，是让树知道你们还活着。",
"今天，艾萨拉来得比平时晚。她来的时候，脸色不太好看。",
"「孩子们，回树屋里去。」她说，「今晚，不要出树屋。」",
"「长老，怎么了？」你问。",
"艾萨拉看着树根的方向，声音很轻：「树根……在发抖。」",
"你愣住了。世界树的根，怎么会发抖？",
"你趴在地上，把耳朵贴在树根上。你听见了——很深很深的地方，传来一阵沉闷的、持续的震颤，像有什么东西，正在树根下面挖土。"
],
options:[
{t:"贴着树根继续听",effects:{flag:"origin_expand_elf_listen"},go:"origin_expand_elf_2"},
{t:"问艾萨拉那是什么",effects:{flag:"origin_expand_elf_ask"},go:"origin_expand_elf_2"}
]};

N["origin_expand_elf_2"] = {tag:"main",pace:"normal",place:"精灵林地·树屋",
text:[
"树屋是木质的，挂在世界树粗壮的枝干上，离地十几丈。",
"夜里，你躺在树屋的草垫上，听着风穿过树叶的声音。往常这声音会让你安心，今晚却总觉得哪里不对。",
"隔壁树屋传来脚步声——是艾萨拉，她正在挨家挨户地叮嘱什么。",
"你听见她和一个成年精灵的对话，声音压得很低：",
"「……不止一处。北边的树根，南边的树根，都在抖。」",
"「会不会是地脉？」",
"「地脉不是这个声音。地脉是活的，这个声音……像是有什么东西，在啃。」",
"啃。这个词像一根针，扎进你耳朵里。",
"你躺不住了。你悄悄爬出树屋，踩着枝干，往树根的方向滑下去。",
"月光下，世界树的根部蒙着一层淡银色的光。你贴着树干往下走，走到最粗的那根根须旁，蹲下来。",
"你看到了。根须上，有一圈齿痕。不深，但很整齐，像用尺子量过一样。",
"你伸手摸了一下那圈齿痕。指尖忽然一凉——那齿痕里，渗出一滴黑色的汁液。",
"你猛地缩回手。那滴黑汁落在你的手背上，像一滴墨水，慢慢洇开。",
"你擦不掉它。"
],
options:[
{t:"用草叶擦掉黑汁",effects:{flag:"origin_expand_elf_stain"},go:"origin_expand_elf_3"},
{t:"记下这个位置，回树屋",effects:{flag:"origin_expand_elf_mark"},go:"origin_expand_elf_3"}
]};

N["origin_expand_elf_3"] = {tag:"main",pace:"normal",place:"精灵林地·世界树·晨曦",
text:[
"天亮时，艾萨拉发现了你手背上的黑痕。",
"她握着你的手看了很久，脸上的表情一点一点变冷。她把你带到树根下，用一片银叶蘸了晨露，敷在黑痕上。",
"银叶贴上来的瞬间，你疼得倒吸一口气——那黑痕像活物一样，在叶下扭动了一下，然后慢慢淡去，只剩一层浅灰。",
"「这是蚀。」艾萨拉说。",
"「蚀？」",
"「深渊的东西，留下的痕迹。」她把银叶收起来，「世界树是活的。活的东西，被深渊碰过，就会留下这种痕迹。你碰了它，它就渡到你身上了。」",
"「会怎样？」",
"「现在不会怎样。但你记住——」她看着你，「这层灰，十年之内不会消。这十年里，你不能再碰任何深渊的东西。碰一次，灰就会变黑；变黑三次，你就再也回不来了。」",
"你看着手背上那层浅灰，心里说不清是什么滋味。",
"「长老，树根下面，是什么？」你问。",
"艾萨拉沉默了很久：「很久以前，世界树底下，封着一样东西。长老们说，那是深渊留在大陆的根。」",
"「它……会醒吗？」",
"艾萨拉没有回答。她只是伸手，摸了摸世界树的树皮，像摸一个生病的孩子。"
],
options:[
{t:"追问封着的是什么",effects:{flag:"origin_expand_elf_what"},go:"origin_expand_elf_4"},
{t:"不再问，帮她照顾树根",effects:{flag:"origin_expand_elf_care"},go:"origin_expand_elf_4"}
]};

N["origin_expand_elf_4"] = {tag:"branch",pace:"normal",place:"精灵林地·古语课",
text:[
"那之后，艾萨拉教你古语教得更勤了。",
"「古语不只是说话。」她说，「是让世界树认识你。树认识的人，树才会护着。」",
"你学得很认真。但你的心思，总飘到树根底下那圈齿痕上。",
"一天，艾萨拉教完一段古语，忽然问你：「你在想树根底下的事？」",
"你点头。",
"她叹了口气：「你年纪太小，本不该知道这些。但你碰过蚀，也算半个当事的人了。」",
"她蘸着晨露，在树皮上画了一个符号：「这是『封』的古语。世界树底下的东西，靠的就是这个。」",
"「它会永远封着吗？」",
"「不会。」艾萨拉说，「封是有力的。它每醒一次，封就薄一层。长老们算过——」她顿了顿，「按现在的蚀法，再过几百年，封就撑不住了。」",
"「几百年很久。」你说。",
"「对精灵来说，几百年，就是一生。」艾萨拉看着你，「而你，孩子，你这一生，会撞上它。」",
"你听不懂这句话的分量。但你把它记下了。"
],
options:[
{t:"问艾萨拉我该做什么",effects:{flag:"origin_expand_elf_mission"},go:"origin_expand_elf_5"},
{t:"默默练那段古语",effects:{flag:"origin_expand_elf_practice"},go:"origin_expand_elf_5"}
]};

N["origin_expand_elf_5"] = {tag:"main",pace:"normal",place:"精灵林地·世界树·夜",
text:[
"那天夜里，世界树第一次在你面前，发出了声音。",
"不是风吹树叶。是整棵树，从根到冠，发出一声悠长的、像叹息一样的震动。树屋的木板跟着颤，碗盏从架子上掉下来，碎了一地。",
"你冲出树屋。艾萨拉已经站在树根下，身边围着几个成年精灵。",
"「蚀又深了。」艾萨拉的声音很紧，「北边第三根须，裂了。」",
"你挤到前面去看。世界树北边那根最粗的根须上，一道裂缝正缓缓张开，缝里渗出黑色的汁液。",
"一个精灵拔出剑：「长老，下去看看？」",
"「不行。」艾萨拉说，「现在下去，是给那东西送食。」",
"她转过头，看见你站在人群里，眼神一沉：「你，回树屋去。」",
"你没有动。你看着那道裂缝，忽然觉得，那裂缝里，有什么东西，也在看着你。",
"你手背上的浅灰痕迹，开始发热。"
],
options:[
{t:"咬牙按住手背，退回人群",effects:{flag:"origin_expand_elf_stepback"},go:"origin_expand_elf_6"},
{t:"往前走一步，想看个清楚",effects:{flag:"origin_expand_elf_stepforward"},go:"origin_expand_elf_6"}
]};

N["origin_expand_elf_6"] = {tag:"main",pace:"normal",place:"精灵林地·世界树·裂缝边",
text:[
"你往前走了一步。",
"裂缝里的黑汁忽然涌出来，像活了似的，顺着树根往上爬。艾萨拉一把把你拽回来，另一只手按在裂缝上，嘴里念了一句古语。",
"黑汁在她掌心下顿住了，像被什么压住，不甘心地缩回裂缝。",
"艾萨拉的手掌上，多了一道黑色的细纹。她像是没看见，松开你，声音发颤：「你刚才，为什么要往前走？」",
"你低头看着手背：「我……觉得它在叫我。」",
"艾萨拉的脸一下子白了。她蹲下来，握住你的肩膀：「孩子，你听我说——你碰过蚀，又听见了它的声音。从现在起，你不能留在林地了。」",
"「为什么？」",
"「它会循着你的气息，找到树根。」艾萨拉说，「你留下，世界树就多一个缺口。你走——它找不到你，树根才能养回来。」",
"你张了张嘴，说不出话。",
"艾萨拉站起身，看着裂缝：「你去大陆上走一走吧。去找一样东西，叫『晨星之泪』。传说它能洗净蚀痕。找到它，你手背上的灰，就能消掉；找不到——」",
"她没说完。但你明白她的意思。"
],
options:[
{t:"问清晨星之泪的线索",effects:{flag:"origin_expand_elf_tear"},go:"origin_expand_elf_7"}
]};

N["origin_expand_elf_7"] = {tag:"main",pace:"normal",place:"精灵林地·送别",
text:[
"晨星之泪的线索，只有一句话：东边，太阳升起的地方。",
"「东边太大了。」你说。",
"「是。」艾萨拉没有否认，「但蚀痕会指引你。你离它越近，手背上的灰就越淡。离它越远，灰就越重。」",
"她取下一枚树叶形状的银饰，挂在你脖子上：「这是世界树的叶子。带着它，林地的人会认得你。」",
"出发那天，精灵们站在树根下送你。没有人说话，但他们的眼神，比话说得更多。",
"你最后一次把手贴在树根上。树根的温度，和往常一样凉。但你听懂了——那一声悠长的、低沉的震动，不是叹息。",
"是告别。",
"你背起行囊，朝东走去。身后的世界树，在晨光里，像一座沉默的山。",
"你手背上的浅灰，在晨光里，隐隐发烫。"
],
options:[
{t:"朝东走去（序章继续）",effects:{flag:"origin_expand_elf_go"},go:"origin_expand_elf_8"}
]};

N["origin_expand_elf_8"] = {tag:"main",pace:"light",place:"东行林道·溪边",
text:[
"林地的边界，是一条溪。",
"溪水很清，能看见水底的石头。你蹲在溪边，第一次认真看自己手背上的灰痕——它比出发时，淡了一点点。",
"「真的会变淡。」你喃喃了一句。",
"溪对岸，一个砍柴的老头正在歇脚。他看见你，咧嘴一笑：「小精灵，出远门？」",
"「嗯。去东边。」",
"「东边可大了。」老头掸了掸烟斗，「你找什么？」",
"你想了想：「找一样东西。」",
"老头没追问。他指着溪水的下游：「顺这条溪走，三天能到人类的一座城，叫交汇城。那里人多，消息也杂。你要找的东西，说不定有人听过。」",
"「多谢。」",
"你正要过溪，老头又叫住你：「哎，小子——你手背上的灰，我看见了。」",
"你一愣。",
"「老话讲，碰过那种东西的人，命都硬。」老头说，「但也老话讲——命硬的人，路都长。走好自己的路，别管旁人的嘴。」",
"他扛起柴，走了。",
"你过了溪，站在人类的地界上，回头看了一眼——世界树的轮廓，还隐隐立在天边。",
"你握了握拳。手背上的灰痕，温温的，像有什么东西在应你。"
],
options:[
{t:"顺着溪流，走向交汇城（序章继续）",effects:{flag:"origin_expand_elf_done"},go:"origin_elf_1"}
]};

/* ============ 矮人·锻炉 ============ */
N["origin_expand_dwarf_1"] = {tag:"main",pace:"normal",place:"矮人山城·永恒锻炉·风箱房",
text:[
"矮人的山城，建在火山口上。",
"永恒锻炉是山城的中心，日夜不熄。你从记事起，就在锻炉边打下手：拉风箱、递铁坯、把冷却的锤子浸进盐水里。",
"你今年四十七岁，在矮人里，刚够格摸锤柄。",
"今天，师傅铁砧没有让你碰锻件。他把一块烧红的铁坯从炉里夹出来，放在砧上，指了指：「看着。」",
"他抡起锤子。第一锤，火星迸溅；第二锤，铁坯变了形；第三锤，一道裂缝从铁坯中间裂开，露出里面暗红的内芯。",
"「看到了？」铁砧说，「这块铁，外面看着是好的，里面早就脆了。」",
"「淬火的时候坏了？」你问。",
"「淬火没错。是矿的问题。」铁砧把铁坯扔进废料桶，「南边的矿洞，出来的铁越来越脆。不是火候的事，是地底下的事。」",
"「地底下？」",
"铁砧没有回答。他把锤子递给你：「去，把南边矿洞今天送来的矿石，全部敲开看一遍。脆的挑出来，别让它进炉子。」",
"你接过锤子。锤柄上，还带着他的体温。"
],
options:[
{t:"去矿洞查看新到的矿石",effects:{flag:"origin_expand_dwarf_ore"},go:"origin_expand_dwarf_2"},
{t:"问铁砧地底下怎么了",effects:{flag:"origin_expand_dwarf_ask"},go:"origin_expand_dwarf_2"}
]};

N["origin_expand_dwarf_2"] = {tag:"main",pace:"normal",place:"矮人山城·南矿洞·洞口",
text:[
"南矿洞在山城南边，洞口被一层灰白的雾气罩着。",
"这雾不对劲。往常矿洞里的雾是水汽，白而轻；今天的雾，是灰色的，沉甸甸地贴着地面，像一层没洗干净的布。",
"矿工头老石在洞口等你。他递给你一盏矿灯：「小心点。这两天，洞里的声音不对。」",
"「什么声音？」",
"「像是……有什么东西，在敲矿壁。」老石压低声音，「不是凿子，是那种，一下一下的，从很深的地方传上来的。」",
"你提着矿灯走进矿洞。洞壁上的矿石，在灯光下泛着暗红的光，像凝固的血。",
"你走到今天的开采面，蹲下来，拿起一块刚采下的矿石。铁砧说得没错——矿石表面看着饱满，一掂，轻得不对劲。",
"你把它放在地上，抡起锤子敲开。",
"铁壳裂开，里面不是铁——是灰白色的粉末，一股腐臭的气味扑出来。",
"矿脉，烂了。"
],
options:[
{t:"继续往里走，找声音的来源",effects:{flag:"origin_expand_dwarf_deep"},go:"origin_expand_dwarf_3"},
{t:"退出矿洞，回去报告铁砧",effects:{flag:"origin_expand_dwarf_report"},go:"origin_expand_dwarf_3"}
]};

N["origin_expand_dwarf_3"] = {tag:"main",pace:"normal",place:"矮人山城·锻炉·炉火边",
text:[
"铁砧听完你的话，沉默了很长时间。",
"他把那捧灰白色的粉末放在灯下看了又看，最后用手指捻了捻，放到鼻子底下闻了一下。",
"「是蚀。」他说。",
"「蚀？」你第一次听这个词。",
"「深渊的东西，浸透了的矿脉，就是这种灰。」铁砧把粉末倒进火里，火苗窜起一尺高，发出一声刺耳的尖啸，「老辈人说，很多年前，南边出过一次这种事——矿脉烂了，山城差点断了粮。」",
"「后来呢？」",
"「后来，矿工在更深的地方，挖到了一扇门。」铁砧的声音变得很低，「铁门，上面刻着符文。老一辈说，那是封印。门后面，关着的东西，就是让矿脉烂掉的源头。」",
"你听得后背发凉：「那扇门，还在吗？」",
"「在。」铁砧说，「就在现在南矿洞最深的地方。老辈人封了它，立了规矩：谁也不许挖到那扇门。」",
"他看着你：「你今天，走到哪了？」"
],
options:[
{t:"如实说：走到了开采面",effects:{flag:"origin_expand_dwarf_honest"},go:"origin_expand_dwarf_4"},
{t:"隐瞒：说只在洞口转了转",effects:{flag:"origin_expand_dwarf_lie"},go:"origin_expand_dwarf_4"}
]};

N["origin_expand_dwarf_4"] = {tag:"main",pace:"normal",place:"矮人山城·锻炉·夜",
text:[
"那晚，铁砧没有赶你走。他让你睡在锻炉边的草垫上，自己守着炉火，一夜没动。",
"你半夜醒来一次。炉火的光里，铁砧坐在矮凳上，手里攥着一块铁片，翻来覆去地看。",
"那块铁片，是今天那捧灰粉末里挑出来的——指甲盖大小，黑得发亮，上面隐约有纹路。",
"「师傅。」你叫了一声。",
"铁砧没回头：「睡你的。」",
"「那铁片……」",
"「别问。」他说，「明天，你跟我下矿。」",
"第二天一早，铁砧换了一身旧皮甲，腰间别着一把短柄锤。他带着你，一路下到南矿洞的最深处。",
"矿道越来越窄，空气越来越冷。矿灯的火焰，在某个位置开始发绿。",
"然后你看见了那扇门。",
"铁门。一人半高，嵌在矿壁里。门上刻满符文，符文之间，缠着拇指粗的铁链。铁链上挂着一把锁——不是铁锁，是一把铜锁，锁身上刻着一只眼睛。",
"铁砧站在门前，没有动。他伸手，摸了摸门上的符文，声音很轻：「它还活着。」"
],
options:[
{t:"问铁砧『它』是什么",effects:{flag:"origin_expand_dwarf_it"},go:"origin_expand_dwarf_5"},
{t:"走近那扇门，仔细看",effects:{flag:"origin_expand_dwarf_door"},go:"origin_expand_dwarf_5"}
]};

N["origin_expand_dwarf_5"] = {tag:"main",pace:"normal",place:"矮人山城·南矿洞·铁门前",
text:[
"你走近那扇铁门。",
"门上的符文你认得一些——是矮人的古符文，但排列的方式很陌生。符文的笔画之间，嵌着一层暗红色的东西，像是干涸了很久的血。",
"铁砧站在你身后：「那是封文。老辈人用血写的封文。血干了，封还在。但封的力量，一年比一年弱。」",
"「为什么不用新的血？」你问。",
"铁砧沉默了一会儿：「写了封文的人，要把命搭上。」",
"你愣住了。",
"就在这时，铁门后面，传来一声响动。",
"不是敲击，也不是呼吸。是一声悠长的、像叹息又像低鸣的声音，贴着铁门，慢慢滑过去。",
"铁砧一把把你拽开，挡在你身前。他的后背绷得像一张弓。",
"铁门后面，安静了。",
"过了很久，铁砧才松开你。他的声音有点哑：「走吧。今天看到的事，烂在肚子里。」"
],
options:[
{t:"答应铁砧，保守秘密",effects:{flag:"origin_expand_dwarf_secret"},go:"origin_expand_dwarf_6"},
{t:"追问那声音是什么",effects:{flag:"origin_expand_dwarf_voice"},go:"origin_expand_dwarf_6"}
]};

N["origin_expand_dwarf_6"] = {tag:"main",pace:"normal",place:"矮人山城·锻炉·淬火池",
text:[
"从矿洞回来后的日子，铁砧教你打铁，教得更狠了。",
"「手要稳。」他站在你身后，看着你抡锤，「铁认识你，你才算铁匠。你现在，只是拿锤子的。」",
"你打得手臂发酸，他还在旁边挑剔：「角度不对。你这锤下去，是把铁当仇人。铁是伙伴——你得顺着它的性子来。」",
"一天收工后，铁砧坐在淬火池边，忽然开口：「你知道我为什么带你去那扇门？」",
"你摇头。",
"「因为我的师傅，带我去过。」铁砧看着池水里自己的倒影，「他死之前，跟我说：铁门后面那东西，早晚要出来。矮人守不住它一辈子。」",
"「那怎么办？」",
"「不知道。」铁砧说，「我师傅说，大陆上有一些地方，也在封着类似的东西。有一天，会有人把这七扇门的事串起来——那才是真正要出事的时候。」",
"他站起来，拍拍你的肩：「你走吧。」",
"「走？」",
"「山城养不了你一辈子，我也教不了你更多了。」铁砧说，「出去看看，学学别的。等你把大陆走遍了，要是还愿意回来——」他顿了顿，「锻炉的火，给你留着。」",
"他把那把短柄锤解下来，递给你：「拿着。锤在，手艺在。」"
],
options:[
{t:"接过短柄锤",effects:{flag:"origin_expand_dwarf_hammer"},go:"origin_expand_dwarf_7"}
]};

N["origin_expand_dwarf_7"] = {tag:"main",pace:"normal",place:"矮人山城·山门口",
text:[
"出发那天，山城的雾散了一些。",
"铁砧送你到山门口。他没有多说什么，只交代了几句路上的话：「出了山，往西，有一座人类的城，叫交汇城。那里有各族的人，也有各族的活法。你去看看。」",
"「师傅，那扇门……」",
"「门的事，你记着就行。别到处说。」铁砧打断你，「有些话，说出来，就成了引子。」",
"你点点头。",
"铁砧忽然想起什么，从怀里摸出一块铁片——就是那天在灰粉末里挑出来的那块黑铁片。他把铁片翻过来，背面刻着一行小字。",
"「这是我师傅的师傅传下来的。上面说，铁门上的封文，是七道印里的一道。」铁砧看着你，「你往后要是遇见别的门，别的印——心里有个数。」",
"你把铁片揣进怀里。沉甸甸的，带着火炉的气息。",
"铁砧最后看了你一眼，转身走回山城：「走吧。别回头。」",
"你站在山门口，看着这座被炉火映红的山城。你在这里长大，学打铁，学做人。",
"现在，你要下山了。"
],
options:[
{t:"下山，往西走（序章继续）",effects:{flag:"origin_expand_dwarf_go"},go:"origin_expand_dwarf_8"}
]};

N["origin_expand_dwarf_8"] = {tag:"main",pace:"light",place:"山麓·商道",
text:[
"下山的路，走了两天。",
"第二天傍晚，你遇到一支从西边来的商队。车队在溪边扎营，一个矮胖的商人看见你背着的锤子，眼睛一亮：",
"「矮人铁匠！来来来，帮我看看这车货——我怀疑有人拿烂铁糊弄我。」",
"你检查了一遍，从车底翻出三块掺了灰粉的铁坯。商人骂骂咧咧，硬塞给你一个银角子当谢礼。",
"「小兄弟，你这是要去哪？」他问。",
"「交汇城。」",
"「巧了，我也去。」商人拍了拍车板，「上来，捎你一程。路上你帮我盯着货，工钱另算。」",
"你爬上商队的货车。车轮碾着碎石路，往西边滚去。",
"你摸了摸怀里的铁片和短柄锤。铁砧说的「七道印」，像一颗种子，种在了你心里。",
"前方，交汇城的轮廓，已经隐隐出现在暮色里。"
],
options:[
{t:"跟着商队，前往交汇城（序章继续）",effects:{flag:"origin_expand_dwarf_done"},go:"origin_dwarf_1"}
]};

/* ============ 兽人·草原 ============ */
N["origin_expand_orc_1"] = {tag:"main",pace:"normal",place:"兽人草原·迁徙营地",
text:[
"兽人的草原，天很低，草很高。",
"你所在的部落叫裂牙部，正在向北迁徙。族长老裂牙说，南边的草场染了病，牛羊吃了草，就开始发疯，口吐白沫，三天就死。",
"你十四岁，刚过了兽人的成年礼——独自猎杀一头角狼。那匹狼的牙，现在还挂在你的脖子上。",
"今天的营地不太平。傍晚，探子回来，说北边三十里的地方，出现了一支人类的军队。",
"「多少人？」老裂牙问。",
"「看不真切。但他们的旗帜，是黑的。」",
"营地一下子安静了。黑色旗帜——兽人草原上，只有一种人会打黑旗：猎奴队。",
"老裂牙扫了一圈营地的族人，目光落在你身上：「裂牙部的崽子，今晚你负责守西边。」",
"他把一把弯刀递给你：「西边是女人的帐篷。你守好了，就是部落的功臣；守不好——」他顿了顿，「你娘和你妹妹，也在那边。」",
"你接过弯刀。刀柄上，还缠着他掌心的汗。"
],
options:[
{t:"守在西边帐篷前",effects:{flag:"origin_expand_orc_west"},go:"origin_expand_orc_2"},
{t:"先去营地边缘看看情况",effects:{flag:"origin_expand_orc_scan"},go:"origin_expand_orc_2"}
]};

N["origin_expand_orc_2"] = {tag:"main",pace:"normal",place:"兽人草原·西帐外",
text:[
"夜风很凉，草叶沙沙地响。",
"你握着弯刀，站在西边的帐篷群前。帐篷里，母亲正在哄妹妹睡觉，声音轻轻的：「睡吧，明天还要赶路。」",
"你听着那声音，心里踏实了一些。",
"半夜，你听见草里有动静。不是风——风不会这样断断续续地响，像有什么东西，在贴着草皮爬。",
"你压低身子，朝声音的方向摸过去。",
"月光下，你看见三个人影，正从营地西边的草沟里爬上来。他们穿着皮甲，手里握着短刀，腰间的布袋鼓鼓囊囊——那是装人的袋子。",
"猎奴队。",
"你数了数，三个人。你只有一把弯刀。",
"一个人影已经摸到了帐篷边，正伸手去掀帘子。你来不及多想，从草丛里跃出来，弯刀劈下去。",
"刀锋擦着那人的肩膀划过去，划出一道血口子。他闷哼一声，转身挥刀——你侧身避开，刀风擦着你的耳朵过去，割下一缕头发。",
"另外两个人影已经转身，朝你围过来。"
],
options:[
{t:"大喊示警，吸引全营注意",effects:{flag:"origin_expand_orc_shout"},go:"origin_expand_orc_3"},
{t:"咬牙缠住这三个人",check:{a:"STR",sk:"fight",label:"力量·缠斗"},tier:{
ok:["你抡起弯刀，死死缠住三个人。刀来刀往，你身上添了三道口子，但你一步不退——身后就是帐篷，帐篷里是你娘和你妹妹。","你拼着挨了一刀，把最前面那个人撞倒在地。其他人见势不妙，吹了一声口哨，钻回草沟跑了。","你扶着刀喘气，听见帐篷里母亲的声音：「谁？」","「没事。」你说，「狼。赶走了。」"],
fail:["你冲上去，被一刀砍在手臂上，血一下子涌出来。你踉跄后退，三个人影趁势扑上来——就在这时，营地里传来一声暴喝，老裂牙举着火把冲了过来。","猎奴队的人见势不妙，钻进草沟跑了。老裂牙看着你血淋淋的手臂：「有种。就是蠢了点。」"]
},effects:{flag:"origin_expand_orc_fight"},go:"origin_expand_orc_3"}
]};

N["origin_expand_orc_3"] = {tag:"main",pace:"normal",place:"兽人草原·营地·火堆边",
text:[
"老裂牙让人给你包扎了伤口。他蹲在火堆边，用刀尖拨着火炭，半天没说话。",
"「猎奴队摸到营地边上，是第一次。」他开口，「以前，他们只在草原边缘转悠。这次摸到营地，说明他们换了路子。」",
"「因为什么？」你问。",
"老裂牙看了你一眼：「因为草原南边的草场病了，部落都在往北迁。人一多，路一挤，猎奴队的生意就好做。」",
"他顿了顿，压低声音：「还有一件事。北边三十里那支黑旗军，探子又去了——不是猎奴队。他们打着黑旗，但马匹和装备，比猎奴队精良得多。」",
"「那是谁？」",
"「不知道。」老裂牙说，「但草原上，打黑旗、马匹精良的，我活了几十年，只听过一支——」他声音更低，「暗蚀会。」",
"你第一次听到这个名字。",
"「暗蚀会是什么？」",
"老裂牙没有回答。他往火里添了一根柴：「你今晚守住了西边，按规矩，你有资格知道部落的机密。明天，我带你去见一个人。」"
],
options:[
{t:"问老裂牙暗蚀会的事",effects:{flag:"origin_expand_orc_askdark"},go:"origin_expand_orc_4"},
{t:"问要见谁",effects:{flag:"origin_expand_orc_who"},go:"origin_expand_orc_4"}
]};

N["origin_expand_orc_4"] = {tag:"main",pace:"normal",place:"兽人草原·萨满帐",
text:[
"萨满帐在营地的正中央，门口插着一排兽骨。",
"老裂牙掀帘进去，你也跟了进去。帐内光线很暗，一个老萨满盘腿坐在兽皮上，面前摆着一盆灰。",
"老萨满抬头看了你一眼，又看了你脖子上的角狼牙：「裂牙部的崽子，你猎过狼。」",
"「是。」",
"「狼有兽性，人有兽性。」老萨满说，「你今天守西边，用的是刀，还是兽性？」",
"你想了想：「都有。」",
"老萨满点了点头。他从灰盆里抓了一把灰，撒在面前的地上，灰落成一条弯曲的线。",
"「这条线，是草原。」他说，「线的这一头，是裂牙部；那一头，是深渊。」",
"「深渊？」",
"「你们往北迁，不是草场病了。」老萨满的声音很平，「是深渊醒了。草场是被深渊的气息浸病的。」",
"帐内一下子安静了。",
"老萨满看着你：「部落需要一个年轻人，去大陆上走一趟，看看那些封着深渊的地方，还有那些打着黑旗的人，到底在干什么。」",
"「为什么是我？」",
"「因为你今晚守住了西边，因为你猎过狼，因为你——」老萨满顿了顿，「你身上，有深渊的味道。」",
"你愣住了。"
],
options:[
{t:"追问身上的深渊味道",effects:{flag:"origin_expand_orc_smell"},go:"origin_expand_orc_5"},
{t:"答应老萨满走这一趟",effects:{flag:"origin_expand_orc_accept"},go:"origin_expand_orc_5"}
]};

N["origin_expand_orc_5"] = {tag:"main",pace:"normal",place:"兽人草原·萨满帐·夜",
text:[
"「你身上有深渊的味道。」老萨满重复了一遍，拿起那盆灰，递到你面前，「闻。」",
"你凑近灰盆。那灰没什么味道，只带着一点干涩的苦。",
"「往灰上呼气。」",
"你呼了一口气。灰面被吹散，露出盆底——盆底刻着一个符号，你从没见过。",
"符号上，沾着一层极细的、黑色的粉末。",
"「这是蚀灰。」老萨满说，「沾上它的东西，会烂。你身上那股味道，和它一模一样——只是很淡，淡到你自己闻不见。」",
"「我为什么会沾上？」",
"「你猎的那头角狼，吃了不该吃的东西。」老萨满说，「你吃了它的肉，它的血——它就渡到你身上了。」",
"你胃里一阵翻涌。",
"「别怕。」老萨满说，「蚀灰很淡，不会要你的命。但它会引东西——深渊的东西，能闻到它。」",
"他盯着你：「所以，你更要走。去大陆上，找一个叫『晨星之泪』的东西，洗掉它。或者——」他顿了顿，「找一个懂封印的人，让他帮你压住它。」",
"你攥紧了角狼牙。牙尖硌着掌心，有点疼。"
],
options:[
{t:"接过老萨满给的蚀灰引子",effects:{flag:"origin_expand_orc_gray"},go:"origin_expand_orc_6"},
{t:"问封印的事",effects:{flag:"origin_expand_orc_seal"},go:"origin_expand_orc_6"}
]};

N["origin_expand_orc_6"] = {tag:"main",pace:"normal",place:"兽人草原·迁徙营地·清晨",
text:[
"出发那天，草原起了雾。",
"老裂牙在营地门口等你。他递给你一袋干肉、一把盐：「路上吃。草原上，盐比肉值钱。」",
"母亲站在帐篷边，没有过来。妹妹跑过来，把一块兽骨塞进你手里：「这是我在河边捡的，很尖，给你防身。」",
"你摸摸她的头：「守着娘。」",
"「嗯！」",
"老萨满最后一个来。他没有多话，只在你手心画了一个符号：「这是『归』的古字。想家了，就摸摸它。」",
"你翻身上马。马是部落里挑出来最壮的，鬃毛黑亮。",
"老裂牙看着你，声音洪亮：「裂牙部的崽子，记住——你走到哪，裂牙部就在哪。草原的风，会替我们看着你。」",
"你夹了一下马腹。马儿嘶鸣一声，冲进雾里。",
"身后，营地的轮廓很快被雾吞没了。你握着那块兽骨，摸了摸手心的『归』字。",
"你往南去。大陆上，有人知道那些黑旗的事。"
],
options:[
{t:"策马向南（序章继续）",effects:{flag:"origin_expand_orc_ride"},go:"origin_expand_orc_7"}
]};

N["origin_expand_orc_7"] = {tag:"main",pace:"normal",place:"草原南缘·旧哨所",
text:[
"南行了四天，你在草原南缘遇见一座废弃的哨所。",
"哨所的墙塌了一半，门板歪在一边。你下马查看，在墙根底下发现一串脚印——不是兽的，是人的，皮靴的印记，很深。",
"你跟着脚印绕到哨所后面，看见一个人。",
"那是个穿旧皮甲的中年男人，靠在墙上，胸口一道伤口，血已经凝固了。他听见你的脚步声，勉强睁开眼：「……兽人崽子？」",
"「你是谁？」",
"「铁门关的斥候。」他咳了一声，「奉命南下传信，遇上……遇上黑旗的人。」",
"「暗蚀会？」",
"斥候的眼神变了一下：「你知道暗蚀会？」",
"「萨满说的。」",
"斥候沉默了一会儿，从怀里摸出一封沾血的信，递给你：「拿着。往南，去交汇城。找一个叫……李管事的，把这封信给他。」",
"「你自己怎么不去？」",
"「我走不动了。」斥候看着你，「你把这信送到，铁门关欠你一个人情。」",
"你接过信。信封上，一个黑色的印记——一只眼睛，你见过。在萨满的灰盆底。"
],
options:[
{t:"收好信，问斥候黑旗军的事",effects:{flag:"origin_expand_orc_letter"},go:"origin_expand_orc_8"},
{t:"先帮斥候包扎伤口",effects:{flag:"origin_expand_orc_bandage"},go:"origin_expand_orc_8"}
]};

N["origin_expand_orc_8"] = {tag:"main",pace:"light",place:"草原南缘·旧哨所·夜",
text:[
"你帮斥候简单包扎了伤口。他靠着墙，声音断断续续：",
"「黑旗军……不像猎奴队。他们不抢人，不抢货。他们只在找一样东西。」",
"「什么？」",
"「不知道。」斥候说，「但他们每到一处，都会挖地。挖得很深。像是在找什么埋着的东西。」",
"你心里一动。萨满说的「封着深渊的地方」，也是埋着的。",
"「把信送到之后呢？」你问。",
"斥候笑了笑：「之后，你就自由了。一个兽人崽子，把信送到，这事就跟你没关系了。」",
"他顿了顿：「但我要提醒你——黑旗的人，不会放过任何一个碰过他们信的人。你拿着这封信，就是拿着一条命。」",
"你握着信，手心出汗。",
"天亮前，斥候睡着了。你把信贴身收好，翻身上马。",
"哨所渐渐远了。前方，交汇城的轮廓，在晨光里露出来。",
"你摸了摸怀里的信，又摸了摸手心的『归』字。",
"这一趟，可能回不去了。但你得走。"
],
options:[
{t:"策马奔向交汇城（序章继续）",effects:{flag:"origin_expand_orc_done"},go:"origin_orc_1"}
]};

/* ============ 东境·承天城 ============ */
N["origin_expand_east_1"] = {tag:"main",pace:"normal",place:"东境·承天城·城南书坊",
text:[
"承天城的晨钟，敲在卯时。",
"你是城南书坊的学徒。书坊掌柜姓方，人瘦，爱眯着眼，说话总带着算盘的响动。",
"你十二岁被送进书坊，今年十六。这四年，你学会了抄书、装订、辨纸，还会背小半本《东境风物志》。",
"今天一早，方掌柜把一摞新到的书卷放在你面前：「抄。三日内交。」",
"你翻了一下，是一套《铁门关战纪》。抄到第三卷，你停住了——里面有一章，写的是「晨天城之变」。",
"晨天城。这个名字，你听人提起过，但书上很少见。",
"「掌柜的，晨天城怎么了？」你问。",
"方掌柜抬起头，眯着眼看你：「你问这个做什么？」",
"「书上写的，看不太明白。」",
"方掌柜沉默了一会儿：「晨天城，是东境的老城。二十年前，一夜之间，全城的人都不见了。」",
"「不见了？」",
"「不见了。」方掌柜说，「官府查了三个月，什么都没查出来。后来就不让提了——谁提，谁倒霉。」",
"他压低声音：「你现在抄的这本《铁门关战纪》，是删过的。原版里，晨天城的事，写得很清楚。」",
"你心里一动：「原版在哪？」"
],
options:[
{t:"追问原版的下落",effects:{flag:"origin_expand_east_original"},go:"origin_expand_east_2"},
{t:"不问了，专心抄书",effects:{flag:"origin_expand_east_copy"},go:"origin_expand_east_2"}
]};

N["origin_expand_east_2"] = {tag:"main",pace:"normal",place:"东境·承天城·书坊后院",
text:[
"方掌柜没有告诉你原版在哪，但他看了你很久，最后说了一句：「你好奇心重。好奇心重的人，在承天城，活不长。」",
"他让你去后院晒书。",
"后院堆着几架子旧书，大部分是虫蛀过的残卷。你一本一本翻，翻到一架积灰最厚的，最底下的箱子里，压着一卷发黄的纸。",
"展开一看，是一页残页，字迹潦草，像是急就章：",
"『……晨天城陷，非兵祸，非天灾。城破前七日，城中井水尽黑。乡绅秦氏举家北迁，独留老宅，宅中供奉铁牌七枚，传言为镇城之物。城陷之日，铁牌尽失。』",
"你握着残页，手有点抖。",
"秦氏。铁牌。井水变黑。",
"你想起书坊里听客人说过的一句话：东境的老人们讲，晨天城的事，跟「深渊」有关。",
"你把残页小心折好，收进怀里。",
"回到前堂，方掌柜正低头打算盘，头也不抬：「后院那些旧书，都是没人要的。你翻到什么，就是你的造化。但——」他顿了顿，「翻到的东西，别拿出来。」"
],
options:[
{t:"谢过掌柜，把残页收好",effects:{flag:"origin_expand_east_page"},go:"origin_expand_east_3"},
{t:"问掌柜秦氏的事",effects:{flag:"origin_expand_east_qin"},go:"origin_expand_east_3"}
]};

N["origin_expand_east_3"] = {tag:"main",pace:"normal",place:"东境·承天城·旧市街",
text:[
"方掌柜没有接秦氏的话头。他给你放了一天假，让你去旧市街买灯油。",
"旧市街在承天城的西边，卖的大多是旧货：旧家具、旧衣裳、旧书旧画。你买了灯油，正要往回走，被一个摆摊的老头叫住了。",
"「小子，你怀里那页纸，哪来的？」",
"你一愣：「什么纸？」",
"老头笑了笑，露出缺了牙的嘴：「你揣得挺严实，但纸边露出来了。放心，我不抢你的——我就是想问问，你看没看懂那上面写的。」",
"「……秦氏，铁牌。」你试探着说。",
"老头点了点头：「秦氏，是晨天城的大户。晨天城还在的时候，秦家老宅供着七枚铁牌，说是镇城用的。」",
"「后来呢？」",
"「城没了，铁牌也没了。」老头说，「有人说是被抢了，有人说是秦家自己带走了。但我知道一件事——」他压低声音，「秦家没走干净。晨天城陷那年，秦家有个小儿子，逃出来了。现在，就住在承天城里。」",
"你心里一跳：「他叫什么？」",
"「姓秦，行辈是『长』字。」老头看着你，「叫秦·长风。」"
],
options:[
{t:"记住这个名字",effects:{flag:"origin_expand_east_name"},go:"origin_expand_east_4"},
{t:"问老头秦长风住在哪",effects:{flag:"origin_expand_east_where"},go:"origin_expand_east_4"}
]};

N["origin_expand_east_4"] = {tag:"main",pace:"normal",place:"东境·承天城·城南巷",
text:[
"老头没有告诉你秦长风的住址。他说：「承天城不大，姓秦的没几个。你打听多了，自然会找到。但小子，我劝你一句——有些事，知道名字就够了。找上门去，是给自己找麻烦。」",
"你嘴上应着，心里却记下了这个名字。",
"几天后，你送书到城南一家绸缎庄，回来的路上，下起了雨。你躲进一条巷子的屋檐下，听见巷子里有人说话。",
"「……铁牌的事，查得怎么样了？」",
"「回主人，还在查。晨天城那边，进出都有人盯着。」",
"「嗯。那孩子，有消息吗？」",
"「……还没有。但据说，他来了承天城。」",
"「找。」那个声音很平静，「把承天城翻过来，也要把他找出来。」",
"你站在屋檐下，一动不动。雨声很大，那两个人没有发现你。",
"等他们走远，你才从巷子里出来。雨还在下，你浑身上下都湿透了。",
"你攥着怀里的残页。晨天城、秦氏、铁牌、一个叫秦·长风的人，还有两个在找他的人——这些事，像一团乱麻，缠在你心里。",
"你忽然觉得，这承天城，不太平。"
],
options:[
{t:"记下巷子里的话",effects:{flag:"origin_expand_east_overhear"},go:"origin_expand_east_5"}
]};

N["origin_expand_east_5"] = {tag:"main",pace:"normal",place:"东境·承天城·书坊·夜",
text:[
"夜里，你把听到的话告诉了方掌柜。",
"方掌柜听完，半天没说话。他把算盘推到一边，从柜台底下摸出一壶酒，给自己倒了一碗，一口喝干。",
"「那两个说话的人，什么打扮？」他问。",
"「没看清。都穿黑衣服。」",
"方掌柜又倒了一碗：「黑衣服……承天城里，穿黑衣服查事的，只有一种人——官署的暗探。」",
"「官署在查秦长风？」",
"「官署查他，不奇怪。」方掌柜放下碗，「奇怪的是，暗探亲自出动。这种事，以前只有查钦犯，才会这样。」",
"他看着你：「小子，你听我一句——秦长风这个人，你别碰。晨天城的事，你也别查了。书坊的伙计，安安稳稳过一辈子，比什么都强。」",
"你点了点头。但你知道，你心里已经放不下了。",
"那页残页上写着：城陷前七日，城中井水尽黑。",
"井水尽黑。你白天送书时，路过城东那口老井——井水，好像也开始发浑了。"
],
options:[
{t:"把井水的事告诉方掌柜",effects:{flag:"origin_expand_east_well"},go:"origin_expand_east_6"},
{t:"压在心底，先去睡",effects:{flag:"origin_expand_east_hold"},go:"origin_expand_east_6"}
]};

N["origin_expand_east_6"] = {tag:"main",pace:"normal",place:"东境·承天城·城东老井",
text:[
"第二天一早，你借口送书，绕到城东那口老井。",
"井边围了几个打水的妇人。你凑过去看了一眼——井水确实浑了，泛着一层灰白，像掺了粉。",
"一个妇人皱着眉：「这井水怎么回事？昨儿还是清的。」",
"「听说是上游的河道堵了。」另一个说。",
"你蹲在井边，趁人不注意，用竹筒舀了一点水。水在竹筒里晃了晃，你凑近闻——没有味道。但你总觉得，那水汽里，有一点说不清的、发苦的气息。",
"你想起了残页上的话：晨天城陷前七日，城中井水尽黑。",
"你心里发紧。",
"回到书坊，方掌柜正在门口等你。他看见你手里的竹筒，脸色一变，一把把你拉进后院。",
"「你哪来的水？」",
"「城东老井。」",
"方掌柜盯着那竹筒看了很久，最后说：「倒了。烧了。别让人看见。」",
"「掌柜的……」",
"「晨天城陷的前一年，承天城也闹过一回井水变浑。」方掌柜的声音很低，「后来，城里死了三十七个人。官府说是疫病，但老人都知道——那不是什么疫病。」",
"他把竹筒里的水倒进排水沟，看着水流走：「小子，承天城要出事了。你走吧。」"
],
options:[
{t:"问掌柜该往哪走",effects:{flag:"origin_expand_east_go"},go:"origin_expand_east_7"},
{t:"说我留下帮你",effects:{flag:"origin_expand_east_stay"},go:"origin_expand_east_7"}
]};

N["origin_expand_east_7"] = {tag:"main",pace:"normal",place:"东境·承天城·书坊·晨",
text:[
"方掌柜没有回答你该往哪走。他翻出一个小布包，塞进你手里：",
"「里面是二十个铜星、一套换洗衣裳，还有一封我写给交汇城一个旧识的信。他姓李，在商会做事，你到了，找他，他能给你找个活计。」",
"「掌柜的，你怎么办？」你问。",
"「我一个老头子，在承天城守了一辈子铺子。」方掌柜说，「铺子在，我就在。铺子没了——那就没了呗。」",
"他把那卷《铁门关战纪》的手抄本也塞给你：「这个带上。路上有用。」",
"你跪下来，给方掌柜磕了一个头。",
"他摆摆手：「走吧。趁着城门还开着。」",
"你背着包袱，走到门口，又回头看了一眼。方掌柜已经坐回柜台后，低着头打算盘，像这四年来每一个早晨一样。",
"你走出书坊。承天城的晨钟，正在敲。",
"你不知道这一走，还能不能回来。但你怀里揣着残页、手抄本、还有方掌柜给的信——你忽然觉得，这四年的学徒，没有白当。"
],
options:[
{t:"背起包袱，出城（序章继续）",effects:{flag:"origin_expand_east_leave"},go:"origin_expand_east_8"}
]};

N["origin_expand_east_8"] = {tag:"main",pace:"light",place:"东境·西行官道",
text:[
"出城那天，承天城的天灰蒙蒙的。",
"你混在一支往西的商队里。商队掌柜听说你是书坊学徒，乐了：「识字好啊！帮我记账，免你饭钱。」",
"你坐在货车沿上，看着承天城的城墙一点一点变小。",
"你想起残页上的字：城陷前七日，城中井水尽黑。",
"你想起方掌柜的话：晨天城陷的前一年，承天城也闹过一回井水变浑。",
"你想起巷子里那两个黑衣人的话：把承天城翻过来，也要把他找出来。",
"你摸了摸怀里那卷《铁门关战纪》。翻到最后一页时，你发现书皮夹层里，掉出一张纸条。",
"纸条上，是方掌柜的字迹：「秦长风在交汇城。到了之后，找城西茶馆的老陈。」",
"你捏着纸条，看向前方的路。",
"交汇城。秦长风。铁牌。晨天城。",
"这趟西行，你原本只是逃命。现在看来，不止是逃命了。"
],
options:[
{t:"收好纸条，随商队西行（序章继续）",effects:{flag:"origin_expand_east_done"},go:"origin_eastern_1"}
]};

})();

/* /u1inj:data-nodes:dn_origin_profile.js/ */
/* ============================================================
   A-1 个性化开局系统（五维搭配专属剧情）
   - ORIGIN_PROFILE：五维映射文本库（homeland 身份 / job 见闻 / ideal 第一反应 / hobby 细节 / talent 天资评语 / subrace 血脉注脚）
   - IDEAL_GOALS：8 条理想目标线元数据（里程碑节点在 dn_ideal_goals.js）
   - window.v91_originBuild(S)：由注入钩子调用，按当前五维组装 3 段开场注入文本
   纯数据 + 只读函数；不触碰判定公式 / writeNext 核心语义 / choose / 存档语义
   saveVersion=48 不变；S.flags.origin_profile_done 为独立键
   ============================================================ */
window.ORIGIN_PROFILE = (function(){
  const identity = {
    /* 身份补白：按 homeland（故乡）——序章节点已自带 HOMELANDS.start，这里只补"你是谁"的骨相 */
    free: [
      "商路的十字路口养出来的孩子，见人三分笑，笑里藏着自己的账本。",
      "你记事起就认得三样东西：码头汽笛、银币的响声、还有讨价还价时对方眼里的那一点松动。"
    ],
    north: [
      "北境的雪教会你两件事：话要少说，路要踩实。",
      "铁门关的战火在你小时候烧过一回，你记得烟是怎么爬过山梁的。"
    ],
    south: [
      "南境的账本比摇篮曲更早进你的耳朵，你五岁就能听出秤杆上的门道。",
      "你在商船甲板上长大，海风里混着香料与铁器的气味，那是你最早的地图。"
    ],
    church: [
      "圣城的钟声敲了二十年，你听得懂每一声钟响之间的安静——那安静里藏着别的东西。",
      "你从小在圣徽的阴影下走路，白袍的边角、烛火的烟、还有祷告词里没说出口的那半句。"
    ],
    elf: [
      "半精灵的耳朵比人类尖，比精灵钝。你从小就在两边的目光夹缝里找自己的位置。",
      "迷雾森林的叶影落进你的梦里，醒来时你分不清那是乡愁，还是别的什么。"
    ],
    dwarf: [
      "山腹的锤声是你最早的语言，你认得铁的脾气比认得人的脾气早。",
      "矮人的炉火烤大了你的骨架子，你走路的步子沉，像带着一座山的底子。"
    ],
    orc: [
      "草原的风向你报信，战前的血味你隔着三里地就能闻见。",
      "兽人的血在你血管里烧，烧得比火旺，也比火难熄。"
    ],
    east: [
      "帝京的墨香在你指缝里留了多年，你背过圣贤书，也见过墨字底下的刀。",
      "东境的科举路你走了一半，另一半留给了更远的风沙。"
    ],
    desert: [
      "沙漠教会你水的分量，还有活人的话有多不可信。",
      "你舔过干裂的嘴唇长大，肺里记着那种又烫又渴的活法，一辈子忘不掉。"
    ]
  };
  const job_sight = {
    /* 见闻：按主修职业——初入世时，同一座城在你眼里是不同的 */
    魔法师: [
      "你第一眼看的不是街市，是屋顶与屋顶之间魔网的纹路——这座城的法术脉络，比它的街道更旧。",
      "你数得出城墙上附魔刻痕的年代，却数不清自己身上还剩几枚铜星。法师的路，从来是用卷轴铺出来的。"
    ],
    战士: [
      "你掂了掂背上的家伙，心里给这条街标好了退路——哪里能守，哪里能撤，这是刀口上练出来的眼睛。",
      "城门卫兵的枪尖在你面前晃过，你下意识就数出了他的破绽，随即又把这念头按了下去。"
    ],
    灵魂法师: [
      "街上来往的人在你眼里都有颜色：那个商人的魂光发灰，像压着什么事；乞丐的反而干净。你垂下眼，不去看太多。",
      "你闻得见这座城的心事——酒馆里的醉话、码头的旧怨、教堂尖顶下压着的恐惧。看多了，人容易累。"
    ],
    牧师: [
      "你摸到胸前圣徽的边角，心里默念了一句祷词。这座城的伤，比圣城的钟声还要多。",
      "有人在你面前跛着脚走过，你几乎是本能地想要伸手——又想起戒律里那句：不可轻易显露神迹。"
    ],
    盗贼: [
      "你扫了一眼人群，已经数出三个肥羊、两个同行、一个巡夜的暗桩。这是手艺，不是恶意。",
      "屋檐的影子比街道更让你安心，你走路时下意识贴着墙根，脚步比风声还轻。"
    ],
    商人: [
      "你一眼就看出码头那批货的成色，心里盘算着差价——这一路的风尘，都该折算成金币的声响。",
      "街上每张脸在你眼里都标着价：谁能打交道，谁是冤大头，谁背后有硬靠山。商人的眼睛，是天平做的。"
    ],
    术士: [
      "你摸了摸怀里那件半成品，指腹能感觉到符文里流动的暖意。这座城的炉火，没你家乡的旺。",
      "铁匠铺的风箱声让你耳朵一动——你听得出来，那炉温差了三分，打的铁不够韧。手艺人的耳朵，闲不住。"
    ],
    骑士: [
      "你把背上的剑正了正。这座城的乱象让你握紧了拳——有些东西，总得有人挡在前面。",
      "你记得誓约里的每一个字。街角那对被推搡的母子，让你的脚步停了一瞬。"
    ],
    游侠: [
      "你嗅得出风里的方向——灰港的潮气、北边的松脂味、还有远处山脊上若有若无的兽痕。",
      "你习惯先看树和屋顶，再看人。这座城的活物太多，反而让你觉得挤。"
    ]
  };
  const ideal_reaction = {
    /* 第一反应：按理想——同一幕景象，不同的心 */
    wealth: [
      "你看着满街的金币声响，心里盘算的是另一件事：总有一天，这条街的价码由我来定。",
      "穷过的人认得钱的气味。你闻得出来，这座城的富贵是浮的，站不稳——那正是你的机会。"
    ],
    might: [
      "你记下了这条街的名字。你告诉自己：总有一天，这个名字会因为你的拳头而发抖。",
      "强者的路从脚下开始。你捏了捏指节，把第一块砖踩实了。"
    ],
    guard: [
      "你看见码头上被推倒的老汉，下意识伸手扶了一把。路还长，能扶一个是一个。",
      "这世道吃人，总得有人挡在前面。你摸了摸怀里的干粮，分了半个给路边的孩子。"
    ],
    truth: [
      "这座城藏着太多没说出口的事。你天生对『答案』二字过敏——不知道的事，非要弄明白不可。",
      "你注意到钟楼墙根有块砖颜色不对，像是被人挪动过。你记住了，迟早要去看一眼。"
    ],
    free: [
      "风往哪儿吹，你就往哪儿走。这座城留不住你，就像云留不住雁。",
      "你看了看城门的方向，心里盘算着哪条路能最快出城——不是逃，是走。"
    ],
    god: [
      "你抬头看了看教堂尖顶，又看了看天上的云。你觉得，那上面该有你的位置。",
      "凡人的城再热闹，也装不下你的野心。你把这念头收进心底，像收一把还没开刃的刀。"
    ],
    fame: [
      "你走过城门时想：百年之后，这里的人会怎么讲我的故事？",
      "你把自己的名字在心里默念了一遍，像刻一块碑——故事，要从今天开始写。"
    ],
    revenge: [
      "你摸了摸身上的旧伤疤，那道疤还疼。欠你的，你记着，一个都不会漏。",
      "你认得那种目光——当年毁了你家的人，眼睛里也带着它。你把它存进心里，等一个合适的时辰。"
    ]
  };
  const hobby_note = {
    /* 爱好细节：嵌入见闻的底色 */
    read: "路过旧书摊时，你停下翻了两页，直到摊主咳嗽才放下。",
    hunt: "你注意到墙角那只野猫的步子——它踩过的地方，和你老家猎物走过的痕迹一个样。",
    forge: "铁匠铺的炉火让你脚步慢了半拍，你隔着门闻了闻那铁水的味道。",
    herb: "你顺手在墙根掐了一片草叶，捻了捻，认得是止血的货色。",
    chess: "茶摊上有人下棋，你站着看了三步，心里已经替他走出了后手。",
    gamble: "酒馆里骰子响了一声，你的耳朵竖了起来——这声音，比乡音还熟。",
    music: "有人在巷口哼一支小调，你跟着在心底打了两拍，随即摇头：调子起高了。",
    cook: "你闻出这家馆子汤底放了几味料——少了一味，差一口气。",
    climb: "你抬头看了看城墙上那道裂缝，心里盘算着：手脚并用，约莫能上去。",
    fish: "码头的潮声让你想起蹲在河边等浮子的下午——你耐得住，一直如此。"
  };
  const talent_judge = {
    /* 天资评语 */
    mortal: "你知道自己天资平平。可你也知道，这条路上一刀一斧挣来的东西，谁都夺不走。",
    good: "你资质中上，够用，够拼。你把这点自知收好，不张扬，也不自卑。",
    gen: "你学什么都快，快得有些东西在你眼里反而显得慢。这份快，是把双刃剑。",
    prod: "你天赋异禀，百年一遇——也因此，你知道有些眼睛正隔着人群看你。"
  };
  const subrace_note = {
    /* 血脉注脚：按亚种种族族系 */
    human: "你身上流着人类的血——短命，也短见，却总能在绝处烧出火来。",
    half: "混血的路从来不好走。你比两边都懂，也比两边都硬。",
    elf: "精灵的血脉让你比旁人活得久，也让你比旁人看得远、记得多。",
    dwarf: "矮人的血脉给你一副铁打的筋骨，和一双认得火候的眼睛。",
    orc: "兽人的血在你血管里烧，烧得比火旺，也比火难熄。",
    halfling: "半身人的血脉给你一副好运气，和一张不惹人防的厚道脸。",
    dragon: "龙裔的血脉在你体内沉睡，鳞甲之下，藏着一口未燃的火。"
  };
  /* 30 亚种 → 族系映射（给注入钩子用） */
  const subrace_to_family = {
    nordic:"human", midland:"human", southland:"human", eastland:"human", westland:"human", plateau:"human", islander:"human",
    halfelf:"half", halforc:"half", halfdwarf:"half",
    highelf:"elf", woodelf:"elf", darkelf:"elf", seaelff:"elf", valelf:"elf",
    hilldwarf:"dwarf", vulcdwarf:"dwarf", valdwarf:"dwarf", grayelf:"dwarf", seadwarf:"dwarf",
    plainorc:"orc", mountorc:"orc", shadoworc:"orc", swamporc:"orc",
    hobfarm:"halfling", hobnomad:"halfling", hobcity:"halfling",
    reddra:"dragon", bluedra:"dragon", golddra:"dragon"
  };
  function pick(arr, n){ if(!arr||!arr.length) return ""; return arr[Math.abs(n||0)%arr.length]; }
  function build(S){
    try{
      if(!S) return [];
      const out=[];
      /* 段1：血脉注脚（subrace 族系 → 兜底 homeland 身份） */
      let f1 = "";
      if(S.subrace && subrace_to_family[S.subrace] && subrace_note[subrace_to_family[S.subrace]]) f1 = subrace_note[subrace_to_family[S.subrace]];
      if(!f1 && S.homeland && identity[S.homeland]) f1 = pick(identity[S.homeland], S.day||0);
      if(f1) out.push(f1);
      /* 段2：职业见闻 + 爱好细节 */
      let f2 = "";
      if(S.job && job_sight[S.job]) f2 = pick(job_sight[S.job], (S.day||0)+1);
      if(S.hobby && hobby_note[S.hobby]) f2 = f2 ? f2 + " " + hobby_note[S.hobby] : hobby_note[S.hobby];
      if(f2) out.push(f2);
      /* 段3：理想第一反应 + 天资评语 */
      let f3 = "";
      if(S.ideal && ideal_reaction[S.ideal]) f3 = pick(ideal_reaction[S.ideal], (S.day||0)+2);
      if(S.talent && talent_judge[S.talent]) f3 = f3 ? f3 + " " + talent_judge[S.talent] : talent_judge[S.talent];
      if(f3) out.push(f3);
      return out.length?out:[];
    }catch(e){ return []; }
  }
  return { identity, job_sight, ideal_reaction, hobby_note, talent_judge, subrace_note, subrace_to_family, _build: build };
})();

/* ===== A-1 八条理想目标线元数据（里程碑节点见 dn_ideal_goals.js） ===== */
window.IDEAL_GOALS = {
  wealth:  { cn:"富甲天下", intro:"goal_intro_wealth",  steps:["goal_wealth_1","goal_wealth_2","goal_wealth_3"] },
  might:   { cn:"威震四海", intro:"goal_intro_might",   steps:["goal_might_1","goal_might_2","goal_might_3"] },
  guard:   { cn:"守护苍生", intro:"goal_intro_guard",   steps:["goal_guard_1","goal_guard_2","goal_guard_3"] },
  truth:   { cn:"探寻真相", intro:"goal_intro_truth",   steps:["goal_truth_1","goal_truth_2","goal_truth_3"] },
  free:    { cn:"自由自在", intro:"goal_intro_free",    steps:["goal_free_1","goal_free_2","goal_free_3"] },
  god:     { cn:"登临神座", intro:"goal_intro_god",     steps:["goal_god_1","goal_god_2","goal_god_3"] },
  fame:    { cn:"名留青史", intro:"goal_intro_fame",    steps:["goal_fame_1","goal_fame_2","goal_fame_3"] },
  revenge: { cn:"以血还血", intro:"goal_intro_revenge", steps:["goal_revenge_1","goal_revenge_2","goal_revenge_3"] }
};

/* /u1inj:data-nodes:dn_sp8_ranger.js/ */
/* /sp8inj:nodes/ SP-8 示范章 · 西境游侠学院（arc_west_ranger 支线，30 节点闭环）
   流水线全流程示范：纯数据对象式节点 + pace 元数据 + flag/好感 + 蓝图弧归属
   全部文本 V66 白描；无治理词；中文引号成对；不入引擎（判定/writeNext/choose 零触碰） */

N["sp8_ranger_00"]={tag:"main",place:"西向官道 · 荒野驿站",pace:"normal",text:[
"西境的风比自由城邦粗粝，卷着沙砾打在驿站的木墙上，像有人在夜里叩门。",
"你在这座荒野驿站歇脚。炉火边围着一圈猎人，其中一个独眼的老人正往火里添柴，忽然说起：西境深处有座游侠学院，不收学费，只看人的心性。",
"“三年前有个逃兵进了学院，出来时，连军阀的斥候见了他都绕着走。”独眼老人说，“你要是有胆，顺着鹰隼飞的方向走，就能看见那道白墙。”",
"窗外，一只灰隼正掠过暮色，往西边的荒原去了。"
],options:[
{t:"谢过老人，循着鹰隼的方向启程",go:"sp8_ranger_01"},
{t:"再问两句学院的来历",go:"sp8_ranger_00b"},
{t:"天色已晚，先在驿站歇一夜",go:"sp8_ranger_00c"}
]};
N["sp8_ranger_00b"]={tag:"branch",place:"西向官道 · 荒野驿站",pace:"light",text:[
"独眼老人把烟杆在靴底磕了磕：“学院的院长叫柯恩，年轻时是西境行省的第一快弓。后来军阀火并，他的村子没了，他就把那些无家可归的孩子收进学院，教他们活命的本事。”",
"“学院不收钱。可它收的东西，比钱贵。”老人眯起眼，“它要你发誓：手里的弓，只对准该对准的人。”"
],options:[
{t:"记下这番话，启程",go:"sp8_ranger_01"}
]};
N["sp8_ranger_00c"]={tag:"branch",place:"西向官道 · 荒野驿站",pace:"light",text:[
"你在驿站的干草堆里睡了一夜。风在墙外嚎了一整夜，像有什么东西在荒原上游荡。",
"天亮时，独眼老人已经走了。桌角留着一张草草画的地图，标着一条绕过沼泽的小路——通往那道白墙的近道。"
],options:[
{t:"收好地图，启程",go:"sp8_ranger_01"}
]};
N["sp8_ranger_01"]={tag:"main",place:"西境 · 荒野小径",pace:"normal",text:[
"离开驿站半日，官道渐渐消失在荒草里。你循着地图上的小路走，两边的土丘越来越高，风在沟壑间打着旋。",
"小径尽头，一个背着长弓的年轻人坐在石头上擦箭。他看见你，没有拔箭，只是问：“来学本事的，还是来找死的？”",
"你报了来意。他上下打量你一眼：“学院在荒原深处，没有引路人进不去。跟我走，别踩我脚印外的地方——这片荒原看着安静，草皮底下都是流沙。”",
"他站起身，弓弦在风里发出一声低鸣。"
],options:[
{t:"跟上他，踏上荒原",go:"sp8_ranger_02"}
]};
N["sp8_ranger_02"]={tag:"branch",place:"西境 · 游侠学院外墙",pace:"normal",text:[
"黄昏时分，一道白墙出现在荒原尽头。墙不高，但建在一处天然石台上，三面是峭壁，只有一条窄路可通。",
"引路的年轻人把你领到墙下，吹了一声口哨。墙头的垛口探出一张脸，片刻后，厚重的木门吱呀打开。",
"门后是个平整的沙场，几个学员正借着最后的天光练箭。一个穿灰衣的教官走过来，手里的弓梢敲了敲你的肩：“新来的？先过三考——弓、迹、心。过了，留下；不过，原路回去。”",
"他把一张弓抛给你：“第一考，弓。看到那边木桩上的铜环没有？百步之外。你只有三支箭。”"
],options:[
{t:"接弓，凝神瞄准（弓考）",check:{a:"DEX",sk:"archery",label:"射术"},tier:{ok:["你搭箭、拉弦、松手。第一箭钉在铜环边缘，第二箭穿环而过，第三箭稳稳钉入环心。","灰衣教官点了点头：“手稳。过。”"],crit:["三箭连珠，箭箭穿环。","沙场上静了一瞬，灰衣教官的眼里有了认真：“好手。过。”"],fail:["前两箭落了空。你稳住气息，第三箭擦着铜环飞过。","灰衣教官摇头：“手抖。不过——你还有两考。”"]},go:"sp8_ranger_03"},
{t:"坦言自己从未学过弓（弓考·谦逊）",go:"sp8_ranger_03x"}
]};
N["sp8_ranger_03"]={tag:"main",place:"西境 · 游侠学院沙场",pace:"normal",text:[
"第二考在沙场尽头的枯草地里。灰衣教官从怀里摸出一枚铜钱，随手抛进草丛：“这是军阀斥候遗落的信物。半个时辰内，找回来。”",
"你俯身细看。草叶倒伏的方向、土粒的深浅、断折的草茎——荒原的每一处痕迹都在说话。",
"你在一条浅沟边停下，拨开浮土，铜钱正嵌在湿泥里。拿起时，指尖沾了一点暗色的土。",
"灰衣教官盯着那点暗色看了很久：“……这不是斥候的铜钱。这是三天前，有人从学院后墙翻出去时掉的。”他收走铜钱，“第三考，跟我来。”"
],options:[
{t:"跟上他，走向学院深处的石殿",go:"sp8_ranger_04"}
]};
N["sp8_ranger_03x"]={tag:"branch",place:"西境 · 游侠学院沙场",pace:"light",text:[
"你坦然放下弓：“我学过刀，没学过弓。”",
"灰衣教官没有笑话你。他把弓接回去，掂了掂：“那第二考改一改。荒原上活下来的法子不止一种。看到那片枯草地没有？半个时辰内，找一枚铜钱——用你自己的法子。”",
"你用了追踪的笨功夫，一寸一寸搜过去，最终在一丛枯草下找到了那枚铜钱。",
"灰衣教官把铜钱翻来覆去看了两遍，语气缓了些：“刀有刀的活法。过。”"
],options:[
{t:"跟上他，走向学院深处的石殿",go:"sp8_ranger_04"}
]};
N["sp8_ranger_04"]={tag:"main",place:"西境 · 游侠学院石殿",pace:"normal",text:[
"石殿不大，四壁挂满了褪色的弓。正中坐着一个头发花白的老人，正在用一块鹿皮擦一张黑弓——正是柯恩，学院的院长。",
"灰衣教官把铜钱放在他面前，说了你的事。柯恩没有抬头，只是问：“你为什么要来西境？”",
"你如实答了。他这才抬起眼，那双眼睛像被风沙磨过许多年，看人时却出奇地安静。",
"“学院不收钱，收一样东西。”他说，“你发誓：你手里的武器，只对准该对准的人。你若做不到，现在就下山，我不拦你。”",
"石殿里很静，静得能听见风从墙缝里漏进来的声音。"
],options:[
{t:"（郑重立誓：只对准该对准的人）",run:function(){S.flags["sp8_enter"]=1; changeRelation('sp8_koen',5,'立誓入门'); curNode='sp8_ranger_05'; writeNext();}},
{t:"（问一句：什么才算‘该对准的人’）",go:"sp8_ranger_04q"}
]};
N["sp8_ranger_04q"]={tag:"branch",place:"西境 · 游侠学院石殿",pace:"light",text:[
"柯恩没有立刻回答。他放下黑弓，走到石殿门口，望着荒原：“军阀火并那年，有人拿弓对着我村子的妇孺。我问他为什么，他说‘奉命’。”",
"“从那天起我明白——该对准的人，不是命令说的，是你自己心里过了一遍、想清楚了，才拉得开的那根弦。”",
"他转身看你：“你现在想清楚了吗？”"
],options:[
{t:"（想清楚了，立誓）",run:function(){S.flags["sp8_enter"]=1; changeRelation('sp8_koen',5,'立誓入门'); curNode='sp8_ranger_05'; writeNext();}}
]};
N["sp8_ranger_05"]={tag:"main",place:"西境 · 游侠学院",pace:"normal",text:[
"你正式入了学院。灰衣教官——学员们叫他老谢——分给你一间石屋，一张弓，一壶水。",
"“明早卯时，沙场集合。”老谢说，“西境不养闲人。你要学的第一课，不是射箭，是看风。”",
"夜里，你躺在石屋的干草铺上，听见荒原的风从墙头掠过。远处有鹰唳，近处是学员们低低的说话声。",
"窗外，一轮冷月照着白墙，墙外的荒原一望无际。"
],options:[
{t:"睡下，等明早的第一课",go:"sp8_ranger_06"}
]};
N["sp8_ranger_06"]={tag:"main",place:"西境 · 游侠学院沙场",pace:"normal",text:[
"卯时，天还蒙蒙亮。老谢把三十多个学员聚在沙场上，让所有人把弓插在身前，闭眼听风。",
"“风从哪个方向来？速度多快？半个时辰后会转向哪里？”老谢说，“荒原上，风比敌人先到。读不懂风的人，活不过第一场沙暴。”",
"你闭着眼站了很久。风从西边来，带着沙砾的干涩；半刻钟后，风里多了一丝凉意——云压过来了。",
"老谢走到你面前：“说说，你听到了什么。”"
],options:[
{t:"（说出风的方向与转向）",check:{a:"WIS",sk:"survival",label:"读风"},tier:{ok:["“西风转西南，带湿气，午后有雨。”你说。","老谢挑了挑眉：“有点意思。过。”"],crit:["“西风转西南，湿气来自云层，午后有雨；雨前风会再烈三分，沙暴在后半夜。”","老谢看了你半晌：“你这双耳朵，值半条命。”"],fail:["你说了个大致方向。老谢没点评，只补了一句：“错了。再听。”","午后的雨证实了他的话——你在雨中站着，重新读了一回风。"]},go:"sp8_ranger_07"}
]};
N["sp8_ranger_07"]={tag:"main",place:"西境 · 游侠学院训练场",pace:"deep",text:[
"第七天，你第一次真正握弓。老谢教的不是瞄准，而是呼吸：吐气到一半时松弦，箭才稳。",
"你练到日头偏西，手指磨出了血泡。老谢看了一眼：“血泡是好东西。它长出来，你的弓就记住了你的手。”",
"傍晚，柯恩路过训练场，在你身边站了一会儿。他看着你拉弦的姿势，忽然说：“你的手很稳。可你的眼神在找别的东西。”",
"你一愣。他继续道：“学院教你的是弓和迹。可你心里那只鹰，得你自己去放。等你想明白那只鹰要往哪儿飞，你的弓才能真正拉开。”",
"他说完就走了，留下你在暮色里握着弓，站了很久。"
],options:[
{t:"（把这话记进心里，加练到月上中天）",run:function(){changeRelation('sp8_koen',5,'夜练被柯恩撞见'); curNode='sp8_ranger_08'; writeNext();}}
]};
N["sp8_ranger_08"]={tag:"main",place:"西境 · 游侠学院训练场",pace:"normal",text:[
"半个月后，你被编入对练组。对手是学院里最出名的快弓手，绰号“草蛇”——他的箭快得像草叶间的蛇信。",
"第一轮对练，你输了。他的箭擦着你的耳廓钉在木桩上，你甚至没看清他搭箭的动作。",
"草蛇收弓，丢给你一句话：“你的箭比我的重，可你的心比我的慢。荒原上，慢一步就是一条命。”",
"你捡起箭囊，重新站回起射线。"
],options:[
{t:"（调整呼吸，用读风练出的预判再战）",go:"sp8_ranger_09"},
{t:"（认输，请他指点弱点）",go:"sp8_ranger_09b"}
]};
N["sp8_ranger_09"]={tag:"combat",place:"西境 · 游侠学院对练场",pace:"normal",text:[
"第二回对练，你不再盯他的箭，而是盯他的肩——肩先动，箭后到。",
"草蛇的箭来的瞬间，你侧身让开，同时搭箭还击。两支箭在半空交错，你的箭钉在草蛇脚前的沙地上，他的箭贴着你的发丝飞过。",
"老谢吹哨叫停：“平局。”他看你的眼神多了点东西，“一个半月练到平手，行。”",
"你握着弓的手在发抖——方才那一箭，草蛇留了三分力，你心里清楚。"
],options:[
{t:"（向草蛇致意，承认他留了手）",run:function(){S.npcRel2=1; curNode='sp8_ranger_10'; writeNext();}},
{t:"（沉默收弓，回石屋加练）",go:"sp8_ranger_10"}
]};
N["sp8_ranger_09b"]={tag:"branch",place:"西境 · 游侠学院对练场",pace:"light",text:[
"草蛇没有藏私。他拆开自己的起手动作，一步一步讲给你听：“你的重心压得太低，换步会慢半拍。抬高两指，试试。”",
"你照他说的调了重心，再试一轮，果然快了。",
"“你学东西快。”草蛇难得夸了一句，“荒原上，能学的都学，能活到最后的，都是杂食的。”"
],options:[
{t:"（谢过他，继续加练）",go:"sp8_ranger_10"}
]};
N["sp8_ranger_10"]={tag:"combat",place:"西境 · 荒原 · 夜巡",pace:"normal",text:[
"入学的第二个月，你开始随队夜巡。西境的夜比白天凶险——军阀的斥候、流窜的沙匪、荒原深处的兽，都在夜里出没。",
"这一夜轮到你守学院西墙。后半夜，风忽然停了，荒原静得像一张拉满的弓。",
"你看见远处有一星火光，忽明忽暗，隔着小半个时辰，又亮了一下——是信号。",
"你压低身形，顺着石台的阴影摸过去。靠近时，听见两个人压着嗓子说话，是西境军阀的暗语：“……学院的墙，翻得进。”",
"你的手按上弓弦。风声正好，角度正好——可那一箭出去，就再没有回头的余地。"
],options:[
{t:"（拉弓警示，射断他们的信号绳）",go:"sp8_ranger_11a"},
{t:"（不出手，先记住他们的模样与口令）",go:"sp8_ranger_11b"}
]};
N["sp8_ranger_11a"]={tag:"main",place:"西境 · 学院西墙外",pace:"normal",text:[
"你的箭穿过夜色，钉在信号绳上。火把应声熄灭，暗处传来低骂声和踩碎沙砾的脚步声。",
"你没有追。你记住了他们逃遁的方向——西北，荒原深处的一处旧矿坑。",
"回到学院，你把夜巡所见报给老谢。老谢听完，沉默了很久：“军阀盯上学院了。不是第一次，也不会是最后一次。”",
"他让你明早去石殿，见柯恩。"
],options:[
{t:"（天亮去见柯恩）",run:function(){S.flags["sp8_report"]=1; changeRelation('sp8_koen',5,'夜巡报信'); curNode='sp8_ranger_12'; writeNext();}}
]};
N["sp8_ranger_11b"]={tag:"main",place:"西境 · 学院西墙外",pace:"normal",text:[
"你按着弓弦，没有出手。你把火光的位置、暗语的音节、逃遁的方向，一字一句记在心里。",
"那两个人消失在荒原深处前，其中一人回头看了一眼学院的墙——月光下，他的左颊有一道旧疤。",
"回到学院，你连夜把所见写下来，压在石枕下。有些事，先要知道，才能决定要不要动手。",
"天亮后，你带着这些记下的东西，去见老谢。"
],options:[
{t:"（把记下的消息报给老谢）",run:function(){S.flags["sp8_report"]=1; changeRelation('sp8_koen',5,'夜巡报信'); curNode='sp8_ranger_12'; writeNext();}}
]};
N["sp8_ranger_12"]={tag:"main",place:"西境 · 游侠学院石殿",pace:"deep",text:[
"柯恩听完你的报告，没有立刻说话。他摩挲着那张黑弓的弓臂，良久才开口：“军阀的前锋，三天前已经过了元素荒原。他们不是冲学院来的——是冲西境行省会来的。学院，只是他们路过时想顺手拔掉的一根刺。”",
"“学院可以搬走，西境不能。”他看着你，“你是学院里唯一一个见过他们斥候的人。我有件事要托付你。”",
"他从怀里取出一块铁牌，牌上刻着一只展翅的鹰：“带着它，去西境行省会，找游侠公会的老会长。告诉他：军阀的粮道，在旧矿坑以北四十里。”",
"“这条路凶险。你若不愿去，学院不会怪你。”",
"石殿外，风又起了。"
],options:[
{t:"（接过铁牌，接下这个差事）",run:function(){S.flags["sp8_quest"]=1; changeRelation('sp8_koen',10,'接下送信差事'); curNode='sp8_ranger_13'; writeNext();}},
{t:"（问：为什么不派学院的人去）",go:"sp8_ranger_12q"}
]};
N["sp8_ranger_12q"]={tag:"branch",place:"西境 · 游侠学院石殿",pace:"light",text:[
"柯恩摇头：“学院的人，军阀都认得。只有你——你才来两个月，还没入他们的名册。”",
"“而且，”他补了一句，“你有一双会读风的眼睛。荒原上，这比刀快。”",
"他把铁牌又往前递了递。"
],options:[
{t:"（接过铁牌，接下差事）",run:function(){S.flags["sp8_quest"]=1; changeRelation('sp8_koen',10,'接下送信差事'); curNode='sp8_ranger_13'; writeNext();}}
]};
N["sp8_ranger_13"]={tag:"main",place:"西境 · 旧矿坑以北",pace:"normal",text:[
"你天不亮就出发，绕开荒原上的主路，沿着旧矿坑的阴影往北走。风从西北吹来，带着一股焦糊味。",
"午后，你在一条干涸的河床边发现了车辙——轮距很宽，压得很深，是粮车的印子。",
"你沿着车辙又走了半个时辰，在一处断崖后看见了军阀的粮营：十几辆大车，围成一圈，火堆边坐着十几个兵。",
"铁牌在你怀里硌着。你数清了粮车的数目，记下了换岗的时辰，然后悄然后撤。"
],options:[
{t:"（记下情报，连夜赶路）",go:"sp8_ranger_14"}
]};
N["sp8_ranger_14"]={tag:"main",place:"西境 · 行省会城门",pace:"normal",text:[
"第三日清晨，西境行省会的城墙出现在视野里。城头飘扬着游侠公会的鹰旗——蓝底白鹰，和柯恩给你的铁牌一模一样。",
"你进城，找到游侠公会。老会长是个比柯恩还老的老头，听完你的话，接过铁牌翻来覆去看了两遍：“柯恩那老东西，居然舍得把鹰牌交给一个新人。”",
"“军阀的粮道……旧矿坑以北四十里。”他眯起眼，“这条情报值一座城。你替西境省下了半条命。”",
"他让人给你安排了住处：“歇一夜，明天我派人护送你回去。柯恩的鹰牌，不能丢在半路。”"
],options:[
{t:"（谢过老会长，在行省会歇下）",run:function(){changeRelation('sp8_koen',10,'送信功成'); S.flags["sp8_done"]=1; curNode='sp8_ranger_15'; writeNext();}}
]};
N["sp8_ranger_15"]={tag:"main",place:"西境 · 游侠学院",pace:"deep",text:[
"你带着行省会的回信回到学院。柯恩看完信，把黑弓放在膝上，沉默了很久。",
"“军阀的粮道断了，他们的前锋撑不过这个冬天。”他说，“学院，暂时安全了。”",
"那天夜里，柯恩破例让人在沙场上点了篝火。学员们围火坐着，他讲起自己年轻时的事——讲他如何在军阀火并里活下来，如何把无家可归的孩子一个个收进学院。",
"“我守这座学院二十年，守的不是墙，是这些孩子心里那把没拉开的弓。”他看着你，“你是第一个，让我觉得学院能交出去的。”",
"篝火噼啪作响。你忽然明白，自己已经不只是这个学院的一个学员了。"
],options:[
{t:"（郑重谢过柯恩的信任）",run:function(){changeRelation('sp8_koen',15,'结业信任'); S.flags["sp8_graduate"]=1; curNode='sp8_ranger_16'; writeNext();}}
]};
N["sp8_ranger_16"]={tag:"main",place:"西境 · 游侠学院石殿",pace:"normal",text:[
"结业那天，柯恩把那张黑弓送给了你。弓身是西境铁木做的，弓弦是荒原上的兽筋——这张弓跟了他三十年。",
"“弓认主。”他说，“它在你手里，比我手里有用。”",
"老谢给你记了结业文书，草蛇难得地拍了拍你的肩：“荒原上活着，回来看看。”",
"你收拾好行囊，站在学院的白墙下。西境的荒原在晨光里铺开，风从东边来，带着自由城邦的气息。"
],options:[
{t:"（向学院告别，踏上归途）",go:"sp8_ranger_17"},
{t:"（再留一夜，听柯恩讲最后一课）",go:"sp8_ranger_17b"}
]};
N["sp8_ranger_17"]={tag:"branch",place:"西境 · 荒原岔路",pace:"normal",text:[
"你沿着来时的路走出荒原。风把学院的钟声送到你身后，像一声迟到的告别。",
"岔路口，你停下。一条路往东，通向自由城邦和更远的故土；一条路往西，通向元素荒原深处——那里传闻有军阀的残余势力和失落的遗迹。",
"你摸了摸背上的黑弓。弓弦在风里颤了一下，像在替你自己问：接下来，往哪走？"
],options:[
{t:"往东，回到西向官道，继续原来的旅程",go:"sp8_ranger_18"},
{t:"往西，去元素荒原深处闯一闯",go:"sp8_ranger_18b"}
]};
N["sp8_ranger_17b"]={tag:"branch",place:"西境 · 游侠学院",pace:"light",text:[
"那天夜里，柯恩没有讲箭术。他讲了一个年轻游侠的故事：如何在火并里失去一切，又如何把失去的地方，重新变成可以让人安身的地方。",
"“人这辈子，总得有个能回去的地方。”他说，“学院是我的。你的，得你自己去找。”",
"晨光爬上白墙时，你背起黑弓，走下石台。回头时，柯恩还站在墙头，像一棵长在风里的老树。"
],options:[
{t:"（向他挥手，转身踏上归途）",go:"sp8_ranger_17"}
]};
N["sp8_ranger_18"]={tag:"main",place:"西向官道",pace:"light",text:[
"你回到了西向官道。风还是那个味道，荒原还是那片荒原，可你知道，有些东西已经不一样了。",
"你背上的黑弓沉甸甸的，像压着一段西境的岁月。远处，矮人王国的石门和圣城的尖塔都还在原地。",
"你摸了摸怀里的鹰牌——柯恩说，凭它，西境的游侠公会永远认你。",
"西境的故事告一段落。可荒原的风，还在往更远的地方吹。"
],options:[
{t:"（回到旅途，继续前行）",run:function(){try{ if(window.v91_arcAdvance) v91_arcAdvance({id:'sp8_ranger_18'}); }catch(e){} S.flags["sp8_fin"]=1; curNode='travel_west_start'; writeNext();}}
]};
N["sp8_ranger_18b"]={tag:"main",place:"西境 · 元素荒原",pace:"normal",text:[
"你顺着鹰隼的方向走进元素荒原。这里的风带着火气，脚下的沙砾在日头下泛着金属的光。",
"荒原深处，你看见半截倒塌的石柱——那是上古遗民留下的遗迹，被风沙啃噬得只剩下骨架。",
"你在石柱下歇脚，黑弓放在膝上。远处有兽嚎，近处是风。",
"你忽然想起柯恩的话：你心里那只鹰，要你自己去放。此刻，那只鹰正朝荒原更深处飞去。"
],options:[
{t:"（循着遗迹的方向，继续深入）",go:"west_hub"}
]};

/* /u1inj:data-nodes:dn_story_blueprint.js/ */
/* ============================================================
 * dn_story_blueprint.js — SP-1 叙事蓝图（纯数据，无引擎逻辑）
 * 引擎钩子：SP-3 S.arcs 推进 / SP-7 章节卡·弧线进度·目标指引
 * 结构：
 *   acts[]     幕（5）
 *   volumes[]  卷（10）
 *   chapters[] 章（36，对齐 CHAPTERS_I12 + 卷级锚点）
 *   arcs[]     弧（79：主线5 + 核心8 + 势力14 + 支线30 + 羁绊22）
 *   nodeIndex{} SP-2 全量标注填充（nodeId -> {ch,vol,act,arc,type}）
 * 每弧 {id,type,name,act,vol,prefixes[],stages{setup,rising,climax,resolution},cond}
 * 说明：stages 锚点为已知节点，空数组由 SP-2 标注补充；prefixes 供 SP-2 自动推导。
 * ============================================================ */
window.STORY_BLUEPRINT = {
  meta: {version: 1, saved: "2026-09-09", desc: "群雄割据叙事蓝图 v1（SP-1）"},

  /* ================= 幕（5） ================= */
  acts: [
    {id: "act1", name: "第一幕 · 尘埃落定", desc: "序章与自由城邦：身无长物登陆，在灰港与交汇城站稳脚跟"},
    {id: "act2", name: "第二幕 · 暗流涌动", desc: "净化令 / 学生会 / 学院深处：圣光与阴影的角力开始"},
    {id: "act3", name: "第三幕 · 群雄并起", desc: "银穗危机 / 深渊封印 / 东部与沙漠 / 种族之地：大陆全面动荡"},
    {id: "act4", name: "第四幕 · 命运落定", desc: "终章与日蚀：七印、战争与玩家一生的抉择汇合"},
    {id: "act5", name: "第五幕 · 轮回与新生", desc: "多周目与深渊终局：继承与变奏"}
  ],

  /* ================= 卷（10） ================= */
  volumes: [
    {id: "vol_free",     name: "第一卷 · 自由城邦",     act: "act1"},
    {id: "vol_church",   name: "第二卷 · 圣光与阴影",   act: "act2"},
    {id: "vol_north",    name: "第三卷 · 铁门关的风",   act: "act2"},
    {id: "vol_academy",  name: "第四卷 · 学院与南境",   act: "act2"},
    {id: "vol_east",     name: "第五卷 · 东部王国",     act: "act3"},
    {id: "vol_desert",   name: "第六卷 · 死亡沙漠",     act: "act3"},
    {id: "vol_race",     name: "第七卷 · 种族之地",     act: "act3"},
    {id: "vol_war",      name: "第八卷 · 战争与日蚀",   act: "act3"},
    {id: "vol_abyss",    name: "第九卷 · 深渊回响",     act: "act3"},
    {id: "vol_end",      name: "终章 · 命运落定",       act: "act4"}
  ],

  /* ================= 章（36，对齐 CHAPTERS_I12） ================= */
  chapters: [
    {id: "ch_free_huigang",  vol: "vol_free",    name: "灰港 · 序章",       anchor: "arrive_free_huigang"},
    {id: "ch_free_jiaohui",  vol: "vol_free",    name: "交汇城 · 市井",     anchor: "arrive_free_jiaohui"},
    {id: "ch_free_jishi",    vol: "vol_free",    name: "集市城 · 货海",     anchor: "arrive_free_jishi"},
    {id: "ch_free_gonghui",  vol: "vol_free",    name: "冒险者之城",        anchor: "arrive_free_gonghui"},
    {id: "ch_church_sheng",  vol: "vol_church",  name: "圣城 · 钟声",       anchor: "arrive_church_shengcheng"},
    {id: "ch_church_purge",  vol: "vol_church",  name: "净化令 · 异端之火", anchor: "world_purge"},
    {id: "ch_north_tiemen",  vol: "vol_north",   name: "铁门关 · 兵甲",     anchor: "arrive_east_tiemen"},
    {id: "ch_north_aierda",  vol: "vol_north",   name: "艾尔达城 · 旧都",   anchor: "arrive_north_aierda"},
    {id: "ch_north_beijing", vol: "vol_north",   name: "北境城 · 雪线",     anchor: "arrive_north_beijing"},
    {id: "ch_north_haigang", vol: "vol_north",   name: "海港城 · 冰港",     anchor: "arrive_north_haigang"},
    {id: "ch_north_hewan",   vol: "vol_north",   name: "河湾城 · 水关",     anchor: "arrive_north_hewan"},
    {id: "ch_north_kuang",   vol: "vol_north",   name: "矿山城 · 铁脉",     anchor: "arrive_north_kuangshan"},
    {id: "ch_north_senlin",  vol: "vol_north",   name: "森林城 · 木墙",     anchor: "arrive_north_senlin"},
    {id: "ch_north_tiebi",   vol: "vol_north",   name: "铁壁城 · 要塞",     anchor: "arrive_north_tiebi"},
    {id: "ch_north_silver",  vol: "vol_north",   name: "银穗商路危机",      anchor: "world_silver"},
    {id: "ch_academy_join",  vol: "vol_academy", name: "艾尔达魔法学院",    anchor: "branch_academy_join"},
    {id: "ch_south_gangkou", vol: "vol_academy", name: "港口城 · 汽笛",     anchor: "arrive_south_gangkou"},
    {id: "ch_south_huangjin",vol: "vol_academy", name: "黄金城 · 金库",     anchor: "arrive_south_huangjin"},
    {id: "ch_south_moxie",   vol: "vol_academy", name: "魔械城 · 齿轮",     anchor: "arrive_south_moxie"},
    {id: "ch_south_shangzhan",vol: "vol_academy",name: "商栈城 · 货栈",     anchor: "arrive_south_shangzhan"},
    {id: "ch_south_xueshu",  vol: "vol_academy", name: "学术城 · 书海",     anchor: "arrive_south_xueshu"},
    {id: "ch_east_chengtian",vol: "vol_east",    name: "晨天城 · 帝京",     anchor: "arrive_east_chengtian"},
    {id: "ch_desert_bianyuan",vol: "vol_desert", name: "边缘绿洲",          anchor: "arrive_desert_bianyuan"},
    {id: "ch_desert_shendian",vol: "vol_desert", name: "深渊神殿",          anchor: "arrive_desert_shendian"},
    {id: "ch_desert_seal",   vol: "vol_desert",  name: "深渊封印 · 松动",   anchor: "battle_seal1_intro"},
    {id: "ch_race_elf",      vol: "vol_race",    name: "迷雾边界 · 精灵",   anchor: "arrive_elf_wangting"},
    {id: "ch_race_dwarf",    vol: "vol_race",    name: "石门 · 矮人王都",   anchor: "arrive_dwarf_wangdu"},
    {id: "ch_race_orc_heishi",vol: "vol_race",   name: "黑石部族营地",      anchor: "arrive_orc_heishi"},
    {id: "ch_race_orc_sheng",vol: "vol_race",    name: "兽人圣山",          anchor: "arrive_orc_shengshan"},
    {id: "ch_war_west",      vol: "vol_war",     name: "西境 · 烽火",       anchor: "travel_west_start"},
    {id: "ch_war_orc",       vol: "vol_war",     name: "兽人南下",          anchor: "faction_orc_intro"},
    {id: "ch_abyss_seal",    vol: "vol_abyss",   name: "七印 · 深渊低语",   anchor: "seal1_act1_intro"},
    {id: "ch_end_check",     vol: "vol_end",     name: "命运落定 · 抉择",   anchor: "ending_check"},
    {id: "ch_end_choose",    vol: "vol_end",     name: "命运落定 · 岔路",   anchor: "ending_choose"},
    {id: "ch_end_eclipse",   vol: "vol_end",     name: "日蚀 · 吞光",       anchor: "ending_eclipse"},
    {id: "ch_end_watcher",   vol: "vol_end",     name: "守望者 · 灯火",     anchor: "ending_watcher"}
  ],

  /* ================= 弧（79） ================= */
  arcs: [
    /* ---- 主线弧（5，对齐 WORLD_EVENTS） ---- */
    {id: "arc_purge",   type: "main",   name: "净化令",       act: "act2", vol: "vol_church",  prefixes: ["world_purge", "faction_church", "cityev_church"], stages: {setup: ["world_purge"], rising: ["faction_church_intro"], climax: ["faction_church_ending"], resolution: []}, cond: null},
    {id: "arc_silver",  type: "main",   name: "银穗商路危机", act: "act2", vol: "vol_north",   prefixes: ["world_silver", "world_silverroad", "world_silverbank"], stages: {setup: ["world_silver"], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_seal",    type: "main",   name: "深渊封印松动", act: "act3", vol: "vol_abyss",   prefixes: ["seal", "battle_seal", "faction_abyss"], stages: {setup: ["battle_seal1_intro"], rising: ["seal1_act1_intro"], climax: [], resolution: []}, cond: null},
    {id: "arc_academy", type: "main",   name: "学院暗流",     act: "act2", vol: "vol_academy", prefixes: ["academy", "branch_academy", "h_academy"], stages: {setup: ["branch_academy_join"], rising: ["academy_admission"], climax: ["academy_graduation"], resolution: []}, cond: null},
    {id: "arc_orc",     type: "main",   name: "兽人南下",     act: "act3", vol: "vol_race",    prefixes: ["faction_orc", "arrive_orc", "cityev_orc", "world_orc"], stages: {setup: ["faction_orc_intro"], rising: [], climax: [], resolution: []}, cond: null},

    /* ---- 核心叙事弧（8） ---- */
    {id: "arc_origin",    type: "main",   name: "序章 · 身世",   act: "act1", vol: "vol_free",    prefixes: ["origin_", "prologue", "i_origin"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_pol",       type: "main",   name: "学生会暗线",    act: "act2", vol: "vol_academy", prefixes: ["pol_", "fsh_watcher", "fsh_hlj"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_war",       type: "main",   name: "大陆战争",      act: "act3", vol: "vol_war",     prefixes: ["v65", "v652_", "v653_", "v654_", "v655_", "i_war"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_eclipse",   type: "main",   name: "日蚀",          act: "act4", vol: "vol_end",     prefixes: ["eclipse_", "fsh_eclipse"], stages: {setup: [], rising: [], climax: ["eclipse_endgame"], resolution: []}, cond: null},
    {id: "arc_abyss",     type: "main",   name: "深渊教团",      act: "act3", vol: "vol_abyss",   prefixes: ["abyss_", "fsh_abyss"], stages: {setup: ["faction_abyss_intro"], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_classmate", type: "main",   name: "同学群像",      act: "act2", vol: "vol_academy", prefixes: ["classmate_"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_watchmen",  type: "main",   name: "守望者",        act: "act2", vol: "vol_academy", prefixes: ["i_watchmen", "fsh_watcher", "h_huanglinjing"], stages: {setup: [], rising: [], climax: ["ending_watcher"], resolution: []}, cond: null},
    {id: "arc_ending",    type: "ending", name: "终章 · 命运落定", act: "act4", vol: "vol_end",   prefixes: ["ending_"], stages: {setup: ["ending_check"], rising: ["ending_choose"], climax: [], resolution: []}, cond: null},

    /* ---- 势力弧（14） ---- */
    {id: "arc_fac_abyss",   type: "faction", name: "势力 · 深渊",     act: "act3", vol: "vol_abyss", prefixes: ["faction_abyss"], stages: {setup: ["faction_abyss_intro"], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_church",  type: "faction", name: "势力 · 光明教会", act: "act2", vol: "vol_church", prefixes: ["faction_church"], stages: {setup: ["faction_church_intro"], rising: ["faction_church_main"], climax: ["faction_church_ending"], resolution: []}, cond: null},
    {id: "arc_fac_dwarf",   type: "faction", name: "势力 · 矮人",     act: "act3", vol: "vol_race", prefixes: ["faction_dwarf", "arrive_dwarf"], stages: {setup: ["faction_dwarf_intro"], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_elf",     type: "faction", name: "势力 · 精灵",     act: "act3", vol: "vol_race", prefixes: ["faction_elf", "arrive_elf"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_orc",     type: "faction", name: "势力 · 兽人部族", act: "act3", vol: "vol_race", prefixes: ["faction_orc"], stages: {setup: ["faction_orc_intro"], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_free",    type: "faction", name: "势力 · 自由城邦", act: "act1", vol: "vol_free", prefixes: ["faction_free", "cityev_free"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_north",   type: "faction", name: "势力 · 北境联盟", act: "act2", vol: "vol_north", prefixes: ["faction_north", "cityev_north", "travel_north"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_em",      type: "faction", name: "势力 · 东部王国", act: "act3", vol: "vol_east", prefixes: ["faction_em", "cityev_east", "arrive_east"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_es",      type: "faction", name: "势力 · 东境散盟", act: "act3", vol: "vol_east", prefixes: ["faction_es"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_fc",      type: "faction", name: "势力 · 自由商会", act: "act1", vol: "vol_free", prefixes: ["faction_fc"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_lc",      type: "faction", name: "势力 · 南境钱盟", act: "act2", vol: "vol_academy", prefixes: ["faction_lc", "cityev_south"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_wt",      type: "faction", name: "势力 · 西境游侠", act: "act3", vol: "vol_war", prefixes: ["faction_wt", "travel_west"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_recruit", type: "faction", name: "势力 · 招募线",   act: "act2", vol: "vol_academy", prefixes: ["faction_recruit"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fac_overview",type: "faction", name: "势力 · 总览",     act: "act1", vol: "vol_free", prefixes: ["faction_overview"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},

    /* ---- 支线弧（30，fsh_*） ---- */
    {id: "arc_fsh_abyss1",    type: "branch", name: "支线 · 深渊低语一",   act: "act3", vol: "vol_abyss",  prefixes: ["fsh_abyss1"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_abyss2",    type: "branch", name: "支线 · 深渊低语二",   act: "act3", vol: "vol_abyss",  prefixes: ["fsh_abyss2"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_classmate1",type: "branch", name: "支线 · 同窗一",       act: "act2", vol: "vol_academy", prefixes: ["fsh_classmate1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_classmate2",type: "branch", name: "支线 · 同窗二",       act: "act2", vol: "vol_academy", prefixes: ["fsh_classmate2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_dream",     type: "branch", name: "支线 · 梦境",         act: "act1", vol: "vol_free",  prefixes: ["fsh_dream"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_eclipse1",  type: "branch", name: "支线 · 日蚀前兆一",   act: "act4", vol: "vol_end",   prefixes: ["fsh_eclipse1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_eclipse2",  type: "branch", name: "支线 · 日蚀前兆二",   act: "act4", vol: "vol_end",   prefixes: ["fsh_eclipse2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_firstseal1",type: "branch", name: "支线 · 初印一",       act: "act3", vol: "vol_abyss", prefixes: ["fsh_firstseal1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_firstseal2",type: "branch", name: "支线 · 初印二",       act: "act3", vol: "vol_abyss", prefixes: ["fsh_firstseal2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_hlj",       type: "branch", name: "支线 · 黄林晶的信",   act: "act2", vol: "vol_academy", prefixes: ["fsh_hlj"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_karma1",    type: "branch", name: "支线 · 因果一",       act: "act3", vol: "vol_war",   prefixes: ["fsh_karma1"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_karma2",    type: "branch", name: "支线 · 因果二",       act: "act3", vol: "vol_war",   prefixes: ["fsh_karma2"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_lie1",      type: "branch", name: "支线 · 谎言一",       act: "act2", vol: "vol_church", prefixes: ["fsh_lie1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_lie2",      type: "branch", name: "支线 · 谎言二",       act: "act2", vol: "vol_church", prefixes: ["fsh_lie2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_lost1",     type: "branch", name: "支线 · 迷途一",       act: "act1", vol: "vol_free",  prefixes: ["fsh_lost1"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_lost2",     type: "branch", name: "支线 · 迷途二",       act: "act1", vol: "vol_free",  prefixes: ["fsh_lost2"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_origin1",   type: "branch", name: "支线 · 身世一",       act: "act1", vol: "vol_free",  prefixes: ["fsh_origin1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_origin2",   type: "branch", name: "支线 · 身世二",       act: "act1", vol: "vol_free",  prefixes: ["fsh_origin2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_primal1",   type: "branch", name: "支线 · 远古一",       act: "act3", vol: "vol_race",  prefixes: ["fsh_primal1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_primal2",   type: "branch", name: "支线 · 远古二",       act: "act3", vol: "vol_race",  prefixes: ["fsh_primal2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_prophecy1", type: "branch", name: "支线 · 神谕一",       act: "act3", vol: "vol_race",  prefixes: ["fsh_prophecy1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_prophecy2", type: "branch", name: "支线 · 神谕二",       act: "act3", vol: "vol_race",  prefixes: ["fsh_prophecy2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_seal1",     type: "branch", name: "支线 · 封印一",       act: "act3", vol: "vol_abyss", prefixes: ["fsh_seal1"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_seal2",     type: "branch", name: "支线 · 封印二",       act: "act3", vol: "vol_abyss", prefixes: ["fsh_seal2"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_time1",     type: "branch", name: "支线 · 时光一",       act: "act2", vol: "vol_academy", prefixes: ["fsh_time1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_time2",     type: "branch", name: "支线 · 时光二",       act: "act2", vol: "vol_academy", prefixes: ["fsh_time2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_unsaid1",   type: "branch", name: "支线 · 未言一",       act: "act2", vol: "vol_academy", prefixes: ["fsh_unsaid1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_unsaid2",   type: "branch", name: "支线 · 未言二",       act: "act2", vol: "vol_academy", prefixes: ["fsh_unsaid2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_watcher1",  type: "branch", name: "支线 · 守望者一",     act: "act2", vol: "vol_academy", prefixes: ["fsh_watcher1"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_fsh_watcher2",  type: "branch", name: "支线 · 守望者二",     act: "act2", vol: "vol_academy", prefixes: ["fsh_watcher2"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},

    /* ---- 羁绊弧（22：i_* 7 + npc 5 + classmate 10） ---- */
    {id: "arc_bond_artifact", type: "bond", name: "羁绊 · 神器",   act: "act2", vol: "vol_academy", prefixes: ["i_artifact"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_bond",     type: "bond", name: "羁绊 · 情谊",   act: "act2", vol: "vol_academy", prefixes: ["i_bond"],     stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_magic",    type: "bond", name: "羁绊 · 魔法",   act: "act2", vol: "vol_academy", prefixes: ["i_magic"],    stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_timeloop", type: "bond", name: "羁绊 · 时光",   act: "act2", vol: "vol_academy", prefixes: ["i_timeloop"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_war",      type: "bond", name: "羁绊 · 战火",   act: "act3", vol: "vol_war",    prefixes: ["i_war"],      stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_watchmen", type: "bond", name: "羁绊 · 守望",   act: "act2", vol: "vol_academy", prefixes: ["i_watchmen"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_bond_origin",   type: "bond", name: "羁绊 · 身世",   act: "act1", vol: "vol_free",    prefixes: ["i_origin"],   stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_npc_skadi",     type: "bond", name: "羁绊 · 斯卡蒂", act: "act1", vol: "vol_free",    prefixes: ["npc_skadi"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_npc_mercury",   type: "bond", name: "羁绊 · 墨丘利", act: "act2", vol: "vol_academy", prefixes: ["npc_mercury"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_npc_aurelian",  type: "bond", name: "羁绊 · 奥雷利安", act: "act2", vol: "vol_academy", prefixes: ["npc_aurelian"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_npc_roland",    type: "bond", name: "羁绊 · 罗兰",   act: "act2", vol: "vol_academy", prefixes: ["npc_roland"],  stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_npc_silvia",    type: "bond", name: "羁绊 · 西尔维娅", act: "act2", vol: "vol_academy", prefixes: ["npc_silvia"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_allen",      type: "bond", name: "同窗 · 艾伦",   act: "act2", vol: "vol_academy", prefixes: ["classmate_allen"], stages: {setup: ["classmate_allen_intro"], rising: ["classmate_allen_story"], climax: ["classmate_allen_climax"], resolution: ["classmate_allen_duel"]}, cond: null},
    {id: "arc_cm_aria",       type: "bond", name: "同窗 · 阿丽娅", act: "act2", vol: "vol_academy", prefixes: ["classmate_aria"], stages: {setup: ["classmate_aria_intro"], rising: ["classmate_aria_story"], climax: ["classmate_aria_climax"], resolution: []}, cond: null},
    {id: "arc_cm_arthur",     type: "bond", name: "同窗 · 亚瑟",   act: "act2", vol: "vol_academy", prefixes: ["classmate_arthur"], stages: {setup: ["classmate_arthur_intro"], rising: ["classmate_arthur_kingdom"], climax: ["classmate_arthur_promise"], resolution: []}, cond: null},
    {id: "arc_cm_alexander",  type: "bond", name: "同窗 · 亚历山大", act: "act2", vol: "vol_academy", prefixes: ["classmate_alexander"], stages: {setup: ["classmate_alexander_intro"], rising: ["classmate_alexander_friend"], climax: ["classmate_alexander_family"], resolution: []}, cond: null},
    {id: "arc_cm_cecilia",    type: "bond", name: "同窗 · 塞西莉亚", act: "act2", vol: "vol_academy", prefixes: ["classmate_cecilia"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_elara",      type: "bond", name: "同窗 · 埃拉拉", act: "act2", vol: "vol_academy", prefixes: ["classmate_elara"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_felix",      type: "bond", name: "同窗 · 费利克斯", act: "act2", vol: "vol_academy", prefixes: ["classmate_felix"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_kai",        type: "bond", name: "同窗 · 凯",     act: "act2", vol: "vol_academy", prefixes: ["classmate_kai"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_luna",       type: "bond", name: "同窗 · 露娜",   act: "act2", vol: "vol_academy", prefixes: ["classmate_luna"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},
    {id: "arc_cm_thorin",     type: "bond", name: "同窗 · 索林",   act: "act2", vol: "vol_academy", prefixes: ["classmate_thorin"], stages: {setup: [], rising: [], climax: [], resolution: []}, cond: null},

    {id: "arc_west_ranger", type: "branch", name: "西境 · 游侠学院", act: "act3", vol: "vol_war", prefixes: ["sp8_ranger_"], stages: {setup: ["sp8_ranger_00"], rising: ["sp8_ranger_04"], climax: ["sp8_ranger_12"], resolution: ["sp8_ranger_16"]}, cond: "travel_west_start -> sp8_ranger_00"}
  ],

  /* SP-2 填充：nodeId -> {ch, vol, act, arc, type} */
  nodeIndex: {"abyss_infiltration_after":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_safehouse":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_safehouse_flee":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_safehouse_more":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_tavern":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_tavern_follow":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_tavern_goal":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_tavern_negotiate":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_infiltration_tavern_talk":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_knight_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_knight_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_knight_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_knight_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_lord":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_mage_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_mage_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_mage_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_mage_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_merch_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_merch_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_merch_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_merch_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_omen":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_omen_animals":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_omen_missing":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_omen_nightmare":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_priest_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_priest_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_priest_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_priest_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_ranger_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_ranger_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_ranger_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_ranger_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_sor_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_sor_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_sor_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_sor_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_soul_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_soul_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_soul_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_soul_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_thief_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_thief_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_thief_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_thief_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_war_0":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_war_1":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_war_g":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"abyss_war_g2":{"arc":"arc_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"academy_12_directions_review":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_business":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_dwarf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_dwarfeng":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_eastern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_elda":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_elf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_elfart":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_halfling":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_holy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_law":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_northern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_orc":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_southern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_village":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_admission_western":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_arena":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_business_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_career":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_chapter_summary":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_choice_entry":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_choice_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_choice_more":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_choice_normal":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_classmates":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_classmates_final":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_classroom_generic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_club":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_clubs":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_combat_tournament":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_course_select":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_debate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dorm_generic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_forge":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_secret":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_tavern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarf_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_dwarfeng_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_eastern_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_eclipse_exploit":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_eclipse_join":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_admitted":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_classmate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_club":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_detail":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_exam":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_forbidden_1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_mercury":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_passage":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_ruins":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_soul_tower":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_tavern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_tournament_combat":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_tournament_magic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year1_crisis":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year1_investigate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year2_tournament":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year3_internship":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year4_storm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elda_year5_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_election":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_meditate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_secret":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elf_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_elfart_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_entrance":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_event_detail":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_event_outcome":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exam_chengtian":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exam_elda":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exam_holy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_apply":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_dwarf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_elda":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_elf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_holy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_exchange_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_facilities":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_faction_join":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_farewell":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_final_exam":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_forbidden_section":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_foreshadow_review":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_forge_peak":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_choice":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_church":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_eclipse":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_farewell":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_final":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_free":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_journey":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_merchant":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_season":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_trial":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_graduation_watcher":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_halfling_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_halfling_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_halfling_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_halfling_secret":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_halfling_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_admitted":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_club":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_exam":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_secret_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_holy_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_inter_event_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_joint_research":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_journey_caravan":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_journey_escorted":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_journey_solo":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_journey_with_classmates":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_law_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_library_generic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_magic_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_magic_tournament":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_main_generic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_major":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_mentor":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_mercury_report":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_admitted":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_exam":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_secret_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_strategy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_training":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_military_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_missing_clue":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_missing_investigate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_missing_report":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_multi_perspective":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_northern_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_bonfire":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_hunt":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_secret":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_social":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_training":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_orc_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_perspective_elf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_perspective_holy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_perspective_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_playground_generic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_political":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_practical":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_purge_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_quests":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_quick_jump":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_rankings_view":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_roommate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_seal_lesson":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_seal_mercury":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_seal_research":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_seal_underground":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_silver_leaf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_southern_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_start":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_system_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_tournament":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_transfer_apply":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_transfer_elda":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_transfer_holy":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_transfer_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_vacation_y1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_vacation_y2":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_blacksmith":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_church":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_herbalist":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_private":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_scholar":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_village_shaman":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_western_hub":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y1_dorm_night":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y1_night_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y1_rooftop":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y2_dawn_duel":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y2_tavern_rumor":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y3_road_letter":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y4_hidden_meeting":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_y5_last_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_class_choose":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_class_soul":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_dorm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_end":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_event":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_final":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_grades":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_midterm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_open":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_opening":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year1_registration":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_audience":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_end":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_event":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_final":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_grades":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_midterm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_open":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_purge":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year2_tournament_signup":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_adventurer":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_aftermath":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_church":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_end":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_event":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_magic_tower":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_merchant":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_midterm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year3_open":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_dorm":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_end":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_event":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_hide":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_library":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year4_mercury":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_adventurer":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_church":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_merchant":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_military":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_rest":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_graduate_seals":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year5_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"academy_year_events":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"act_rest":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"adventure_log":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"aftermath_seal1":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"aftermath_seal2":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"aftermath_seal3":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"airship_arrive":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_book":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_buy":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_cargo":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_dock":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_event":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_routes":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"airship_travel":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"arc_knight1":{"arc":"arc_job_knight1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight10":{"arc":"arc_job_knight10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight11":{"arc":"arc_job_knight11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight12":{"arc":"arc_job_knight12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight13":{"arc":"arc_job_knight13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight2":{"arc":"arc_job_knight2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight3":{"arc":"arc_job_knight3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight4":{"arc":"arc_job_knight4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight5":{"arc":"arc_job_knight5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight6":{"arc":"arc_job_knight6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight7":{"arc":"arc_job_knight7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight8":{"arc":"arc_job_knight8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_knight9":{"arc":"arc_job_knight9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage1":{"arc":"arc_job_mage1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage10":{"arc":"arc_job_mage10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage11":{"arc":"arc_job_mage11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage12":{"arc":"arc_job_mage12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage13":{"arc":"arc_job_mage13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage2":{"arc":"arc_job_mage2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage3":{"arc":"arc_job_mage3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage4":{"arc":"arc_job_mage4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage5":{"arc":"arc_job_mage5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage6":{"arc":"arc_job_mage6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage7":{"arc":"arc_job_mage7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage8":{"arc":"arc_job_mage8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_mage9":{"arc":"arc_job_mage9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest1":{"arc":"arc_job_priest1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest10":{"arc":"arc_job_priest10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest11":{"arc":"arc_job_priest11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest12":{"arc":"arc_job_priest12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest13":{"arc":"arc_job_priest13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest2":{"arc":"arc_job_priest2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest3":{"arc":"arc_job_priest3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest4":{"arc":"arc_job_priest4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest5":{"arc":"arc_job_priest5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest6":{"arc":"arc_job_priest6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest7":{"arc":"arc_job_priest7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest8":{"arc":"arc_job_priest8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_priest9":{"arc":"arc_job_priest9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger1":{"arc":"arc_job_ranger1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger10":{"arc":"arc_job_ranger10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger11":{"arc":"arc_job_ranger11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger12":{"arc":"arc_job_ranger12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger13":{"arc":"arc_job_ranger13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger2":{"arc":"arc_job_ranger2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger3":{"arc":"arc_job_ranger3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger4":{"arc":"arc_job_ranger4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger5":{"arc":"arc_job_ranger5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger6":{"arc":"arc_job_ranger6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger7":{"arc":"arc_job_ranger7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger8":{"arc":"arc_job_ranger8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_ranger9":{"arc":"arc_job_ranger9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith1":{"arc":"arc_job_smith1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith10":{"arc":"arc_job_smith10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith11":{"arc":"arc_job_smith11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith12":{"arc":"arc_job_smith12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith13":{"arc":"arc_job_smith13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith2":{"arc":"arc_job_smith2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith3":{"arc":"arc_job_smith3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith4":{"arc":"arc_job_smith4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith5":{"arc":"arc_job_smith5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith6":{"arc":"arc_job_smith6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith7":{"arc":"arc_job_smith7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith8":{"arc":"arc_job_smith8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_smith9":{"arc":"arc_job_smith9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul1":{"arc":"arc_job_soul1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul10":{"arc":"arc_job_soul10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul11":{"arc":"arc_job_soul11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul12":{"arc":"arc_job_soul12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul13":{"arc":"arc_job_soul13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul2":{"arc":"arc_job_soul2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul3":{"arc":"arc_job_soul3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul4":{"arc":"arc_job_soul4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul5":{"arc":"arc_job_soul5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul6":{"arc":"arc_job_soul6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul7":{"arc":"arc_job_soul7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul8":{"arc":"arc_job_soul8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_soul9":{"arc":"arc_job_soul9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief1":{"arc":"arc_job_thief1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief10":{"arc":"arc_job_thief10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief11":{"arc":"arc_job_thief11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief12":{"arc":"arc_job_thief12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief13":{"arc":"arc_job_thief13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief2":{"arc":"arc_job_thief2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief3":{"arc":"arc_job_thief3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief4":{"arc":"arc_job_thief4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief5":{"arc":"arc_job_thief5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief6":{"arc":"arc_job_thief6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief7":{"arc":"arc_job_thief7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief8":{"arc":"arc_job_thief8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_thief9":{"arc":"arc_job_thief9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade1":{"arc":"arc_job_trade1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade10":{"arc":"arc_job_trade10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade11":{"arc":"arc_job_trade11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade12":{"arc":"arc_job_trade12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade13":{"arc":"arc_job_trade13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade2":{"arc":"arc_job_trade2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade3":{"arc":"arc_job_trade3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade4":{"arc":"arc_job_trade4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade5":{"arc":"arc_job_trade5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade6":{"arc":"arc_job_trade6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade7":{"arc":"arc_job_trade7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade8":{"arc":"arc_job_trade8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_trade9":{"arc":"arc_job_trade9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war1":{"arc":"arc_job_war1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war10":{"arc":"arc_job_war10","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war11":{"arc":"arc_job_war11","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war12":{"arc":"arc_job_war12","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war13":{"arc":"arc_job_war13","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war2":{"arc":"arc_job_war2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war3":{"arc":"arc_job_war3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war4":{"arc":"arc_job_war4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war5":{"arc":"arc_job_war5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war6":{"arc":"arc_job_war6","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war7":{"arc":"arc_job_war7","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war8":{"arc":"arc_job_war8","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arc_war9":{"arc":"arc_job_war9","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"arrive_church_prison":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"arrive_church_shengcheng":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":"ch_church_sheng","type":"faction"},"arrive_church_tribunal":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"arrive_desert_bianyuan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":"ch_desert_bianyuan","type":"main"},"arrive_desert_lvzhou":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"arrive_desert_shendian":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":"ch_desert_shendian","type":"main"},"arrive_desert_tuoduo":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"arrive_desert_yiji":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"arrive_dwarf_wangdu":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":"ch_race_dwarf","type":"faction"},"arrive_east_chengtian":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":"ch_east_chengtian","type":"faction"},"arrive_east_tiemen":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":"ch_north_tiemen","type":"faction"},"arrive_elf_wangting":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":"ch_race_elf","type":"faction"},"arrive_free_gonghui":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":"ch_free_gonghui","type":"faction"},"arrive_free_huigang":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":"ch_free_huigang","type":"faction"},"arrive_free_jiaohui":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":"ch_free_jiaohui","type":"faction"},"arrive_free_jishi":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":"ch_free_jishi","type":"faction"},"arrive_generic":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"arrive_north_aierda":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_aierda","type":"faction"},"arrive_north_beijing":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_beijing","type":"faction"},"arrive_north_haigang":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_haigang","type":"faction"},"arrive_north_hewan":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_hewan","type":"faction"},"arrive_north_kuangshan":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_kuang","type":"faction"},"arrive_north_senlin":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_senlin","type":"faction"},"arrive_north_tiebi":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":"ch_north_tiebi","type":"faction"},"arrive_orc_heishi":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":"ch_race_orc_heishi","type":"main"},"arrive_orc_shengshan":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":"ch_race_orc_sheng","type":"main"},"arrive_south_gangkou":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_south_gangkou","type":"main"},"arrive_south_huangjin":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_south_huangjin","type":"main"},"arrive_south_moxie":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_south_moxie","type":"main"},"arrive_south_shangzhan":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_south_shangzhan","type":"main"},"arrive_south_xueshu":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_south_xueshu","type":"main"},"arrive_west_huangyuan":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"attr_high_int_clue":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"attr_high_spr_warning":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"attr_knowledge_perception_change":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"attr_language_ancient_decode":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_advice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_brave":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_lonely":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_meet":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_memory":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"aurelian_memory_1":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"aurelian_observe":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_otherway":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_promise":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_save":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_seal_himself":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_seals":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_seraphine":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_silence":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_substitute":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_where":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_yes":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"aurelian_yourself":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"battle_academy_duel_defeat":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"battle_academy_duel_fight":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"battle_academy_duel_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"battle_academy_duel_lose":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"battle_academy_duel_victory":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"battle_eclipse_defeat":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_eclipse_fight":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_eclipse_flee":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_eclipse_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_eclipse_talk":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_eclipse_victory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"battle_encounter_bandit":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_flee_check":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_generic_defeat":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_generic_victory":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_seal1_analyze":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_seal1_defeat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_seal1_fight":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_seal1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":"ch_desert_seal","type":"main"},"battle_seal1_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_seal1_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_seal1_victory":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"battle_start_academy_duel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_start_bandit":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_start_eclipse_thug":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_start_orc_warrior":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"battle_start_seal1_guardian":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"beijing_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_break":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_decision":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_letter":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_oldwolf":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_oldwolf2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_rumor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"beijing_wolf":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"board_church":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_church_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_dwarf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_dwarf_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_east":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_east_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_elf":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_elf_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_free":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_free_after":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_north":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_north_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_orc":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_orc_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_south":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"board_south_done":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"branch_academy_choice":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"branch_academy_join":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":"ch_academy_join","type":"main"},"branch_academy_negotiate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"branch_academy_report":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"branch_continent_choice":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"branch_continent_destroy":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"branch_continent_repair":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"branch_continent_understand":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"causality_hub":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"causality_review":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"chapter_1_title":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chapter_2_title":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chapter_3_title":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chapter_3_transition":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chapter_4_title":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chapter_end_all":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"chronicle_academy_graduation":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_academy_year1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_final":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_main":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_prologue_end":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_seal_1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"chronicle_view":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"church_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_candle":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_candle2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_cathedral":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_city":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_doubter1":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_doubter2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_doubter3":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_doubter4":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_hide":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_leave2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_relic":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"church_relic_trail":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"church_resist":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_testify":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"church_tribunal_end":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"city_chengtian_explore":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"city_chengtian_intro":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"city_chengtian_li_guide":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"city_chengtian_mountain":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"city_explore_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"city_free":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_free_night_market":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_holy_academy":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_cathedral":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_confession":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_entry":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_forgiven":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_inn":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_inquisition":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_inquisition_sneak":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_inquisition_talk":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_holy_mass":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_ironpeak_anvil":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_buy":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_copper_lie":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_copper_truth":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_drink":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_entry":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_forge":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_furnace":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_learn":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_listen":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_lonely":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_palace":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_ironpeak_tavern":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_jiaohui_bard":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_council":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_deep":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_eclipse_hint":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_entry":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_explore":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_harbor":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_herb":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_herb_quest":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_herb_secret":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_inn":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_intro":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_market":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_medici":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_medici_secret":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury_queen":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury_seals":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury_seraph":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury_soul":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mercury_watcher":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_mystery":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_scroll":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_ship":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_slum":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_slum_child":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_slum_deep":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_slum_mystery":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_speech":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_suspicious":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_tavern":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_tavern_rumor":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_wang_guide":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_jiaohui_weapon":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_lvzhou_desert":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"city_lvzhou_elders":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"city_lvzhou_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"city_lvzhou_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"city_lvzhou_spring":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"city_nanfang_chen_guide":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"city_nanfang_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"city_nanfang_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"city_nanfang_tavern":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"city_shengcheng_explore":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_shengcheng_intro":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_shengcheng_john_guide":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_shengcheng_library":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_shengcheng_tea_house":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"city_systems":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"city_tiefeng_bottom":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiefeng_elders":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiefeng_explore":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiefeng_intro":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiemenguan_army":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiemenguan_explore":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiemenguan_intro":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiemenguan_wall_night":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_tiemenguan_zhao_brothers":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"city_yinye_elders":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_yinye_explore":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_yinye_intro":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"city_yinye_roots":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_church_confession":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_confession_break":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_confession_who":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_abyss":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_church":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_donate":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_donate2":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_future":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_help":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_hierarchy":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_kids":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_knight":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_order":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_recognize":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_church_orphanage_why":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"cityev_desert_ruins":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"cityev_desert_ruins_eye":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"cityev_desert_ruins_flee":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"cityev_desert_ruins_inside":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"cityev_desert_ruins_relief":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"cityev_dwarf_forge":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_dwarf_forge_order":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_dwarf_forge_seven":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_dwarf_forge_watch":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_east_academy":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_east_academy_abyss":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_east_academy_find":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_east_academy_master":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_east_academy_read":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_east_academy_reason":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"cityev_elf_grove":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_elf_grove_apology":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_elf_grove_cry":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_elf_grove_disease":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_elf_grove_name":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"cityev_free_market":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_bell":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_door":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_key":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_mirror":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_origin":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_stall":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_market_what":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_refugee":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_refugee_cremence":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_refugee_give":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_refugee_news":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_free_refugee_refuse":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"cityev_north_duel":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"cityev_north_duel_after":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"cityev_north_duel_army":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"cityev_north_duel_fight":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"cityev_north_duel_prize":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"cityev_orc_blackthreads":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"cityev_orc_warcouncil":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"cityev_orc_warcouncil_against":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"cityev_orc_warcouncil_why":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"cityev_south_auction":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_aurus":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_bottle":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_confront":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_deal":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_doubt":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_expose":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_negotiate":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_silverroad":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_silvia":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"cityev_south_auction_silvia_news":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"class_dark_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_dark_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_earth_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_earth_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_fire_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_fire_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_fire_study":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_light_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_light_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_light_skeptic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_soul_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_soul_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_water_heal":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_water_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_water_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_wind_intro":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"class_wind_learn":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_alexander_family":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_alexander_friend":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_alexander_intro":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_allen":{"arc":"arc_cm_allen","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_allen_climax":{"arc":"arc_cm_allen","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_allen_duel":{"arc":"arc_cm_allen","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_allen_intro":{"arc":"arc_cm_allen","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_allen_story":{"arc":"arc_cm_allen","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_aria_climax":{"arc":"arc_cm_aria","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_aria_intro":{"arc":"arc_cm_aria","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_aria_story":{"arc":"arc_cm_aria","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_arthur_intro":{"arc":"arc_cm_arthur","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_arthur_kingdom":{"arc":"arc_cm_arthur","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_arthur_promise":{"arc":"arc_cm_arthur","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_ask_mercury":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_climax":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_event":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_intro":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_marcus_talk":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_promise":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_research":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_cecilia_story":{"arc":"arc_cm_cecilia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_elara_climax":{"arc":"arc_cm_elara","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_elara_intro":{"arc":"arc_cm_elara","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_elara_story":{"arc":"arc_cm_elara","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_elena_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_elena_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_elena_worldtree":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_event_result":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_fates":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_felix_climax":{"arc":"arc_cm_felix","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_felix_intro":{"arc":"arc_cm_felix","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_felix_story":{"arc":"arc_cm_felix","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_grom_event":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_grommash_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_grommash_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_grommash_tribe":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_kai_climax":{"arc":"arc_cm_kai","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_kai_intro":{"arc":"arc_cm_kai","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_kai_story":{"arc":"arc_cm_kai","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_lilith_eclipse":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_lilith_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_lilith_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_luna_climax":{"arc":"arc_cm_luna","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_luna_intro":{"arc":"arc_cm_luna","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_luna_story":{"arc":"arc_cm_luna","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_marcus_climax":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_marcus_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_marcus_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_marcus_sister":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_marcus_story":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mercury_huang":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mercury_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mercury_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mysterious_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mysterious_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_mysterious_war":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_overview":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_prologues_rumor":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_rex":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_rexa_climax":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_rexa_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_rexa_story":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_sophia_climax":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_sophia_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_sophia_story":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_thorin_climax":{"arc":"arc_cm_thorin","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_thorin_father":{"arc":"arc_cm_thorin","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_thorin_intro":{"arc":"arc_cm_thorin","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_thorin_promise":{"arc":"arc_cm_thorin","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_thorin_story":{"arc":"arc_cm_thorin","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"classmate_vivian_church":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_vivian_intro":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"classmate_vivian_promise":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"combat_bandit_after":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_bandit_flee":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_bandit_road":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_bandit_symbol":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_bandit_talk":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_bandit_talk_ok":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_darkcult_after":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_darkcult_alley":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_darkcult_deny":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_darkcult_deny_ok":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"combat_darkcult_flee":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"consequence_generic_critfail":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"consequence_generic_fail":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"consequence_generic_success":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"continent_start_variation":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"council_issue_iron_gate":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"council_issue_purification":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"council_outcome":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"council_session_1":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"council_vote_purification":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"countdown_purification_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"court_arrest":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"court_detention":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"court_trial":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"daily_life_node":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"deity_knight_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_knight_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_mage_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_mage_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_merch_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_merch_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_priest_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_priest_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_ranger_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_ranger_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_sor_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_sor_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_soul_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_soul_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_thief_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_thief_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_war_0":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"deity_war_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"demigod_aurelian":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_aftermath":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_approach":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_caravan1":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_caravan2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_caravan3":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_caravan4":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_choice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_cultist":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_guardian":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_inside":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_leave":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_lvzhou_market":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_oasis":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_ruins":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_sandstorm":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_seal_watch":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_seer":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_tuoduo_inn":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"desert_water_crisis":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dialogue_mercury_soul":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"dialogue_mercury_tree":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"dialogue_mercury_watcher":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"disaster_blood_rain_aftermath":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_blood_rain_shelter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_blood_rain_source":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_flood_aftermath":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_flood_response":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_trigger_blood_rain":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"disaster_trigger_flood":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"document_read":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dun_arena_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_ask":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_boss":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_arena_treasure":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_boss":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_boss_go":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_flee":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_books_treasure":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_mine_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_mine_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_mine_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_mine_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_mine_flee":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_boss":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_ruins_treasure":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_boss":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_flee":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tower_treasure":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_1":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_2":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_3":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_3b":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_boss":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_enter":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dun_tree_treasure":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dungeon_hub":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dungeon_intro":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"dwarf_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_city":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_deep_bard":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"dwarf_deep_hall":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"dwarf_deep_mine2":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"dwarf_done":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_forge":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_forger":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_king":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_mine":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"dwarf_workshop":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_after2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_chengtian_old":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"east_chengtian_ruins":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"east_city":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_exam":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_gov":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_keju":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_oldtemple":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_palace":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_scholar1":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_scholar2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_scholar3":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_scholar4":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_silver":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"east_tiemen_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"eclipse_action_mission":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_alternative":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_fake_death":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_infiltrate":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_info":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_kill":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_kill_done":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_mission1":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_report":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_test":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_branch_warn":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_endgame":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_action_backstory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_action_confrontation":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_action_fate":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_action_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_finance_backstory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_finance_confrontation":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_finance_fate":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_finance_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_hr_backstory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_hr_confrontation":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_hr_fate":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_hr_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_intel_backstory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_intel_choice":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_intel_confrontation":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_intel_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_research_backstory":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_research_confrontation":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_research_fate":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_face_research_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_general_mission":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_intel_mission":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_intro":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_join":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_kill":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_missions":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_prologue_encounter":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_prologue_pitch":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_rank_check":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_rank_member":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_rank_outer":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_research_mission":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"eclipse_structure":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"elf_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"elf_court":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"elf_deep_altar":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_deep_council":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_deep_grove":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_deep_market":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_deep_mist":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_deep_tower_entry":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_done":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"elf_first":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"elf_root":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"elf_w_end":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_w_enter":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_w_step1":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"elf_w_step2":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"encounter_save_caravan":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"encounter_save_caravan_fight":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"encounter_tavern_rumor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ending":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ending_after_watcher":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_all_races":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_check":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":"ch_end_check","type":"ending"},"ending_choose":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":"ch_end_choose","type":"ending"},"ending_classmates":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_eclipse":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":"ch_end_eclipse","type":"ending"},"ending_elder_memoir":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_prelude_hub":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_seal_chain":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_become":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_coexist":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_free":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_no_succession":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_seal":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v24_succession":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v36_church":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v36_eclipse":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v36_review":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_v36_watcher":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"ending"},"ending_watcher":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":"ch_end_watcher","type":"ending"},"epilogue":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"event_academy_lab_explosion":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"event_academy_lab_explosion_help":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"event_academy_lab_explosion_investigate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"event_continent_refugee_crisis":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"event_continent_refugee_help":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"event_continent_refugee_negotiate":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"event_hub":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"event_pool_view":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"evt_battlefield_avoid":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_battlefield_curse":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_battlefield_mourn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_battlefield_search":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_battlefield_trigger":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_battlefield_voice":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_camp":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_cold":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_lost":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_push":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_return":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_blizzard_trigger":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_leave":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_listen":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_more":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_observe":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_refuse":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_elder_trigger":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_fugitive_capture":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_escape":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_help":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_help_fail":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_lie":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_misdirect":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_refuse":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_suspected":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_fugitive_trigger":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"evt_rockfall_check":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_rockfall_fail":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_rockfall_hug":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_rockfall_retreat":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"evt_rockfall_trigger":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"extinct_aqua_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan_choice":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan_clue":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan_outcome":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan_survivor":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_aquan_truth":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_clue":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_crystal":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_bond":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_choice":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_clue":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_outcome":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_search":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_survivor":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_dragon_truth":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_echo":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_giant":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_giant_end":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_giant_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_giant_search":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_giant_talk":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_overview":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_wing_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"extinct_winged":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"facility_alchemy":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_arena":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_cafeteria":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_classroom":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_dorm":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_infirmary":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_library":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"facility_shop":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faction_abyss_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"faction_abyss_joined":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"faction_abyss_oath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"faction_abyss_test":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"faction_church_cardinal":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"faction_church_ending":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"faction_church_intro":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"faction_church_main":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"faction_church_temple":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":null,"type":"main"},"faction_dwarf_cant":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_intro":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_joined":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_king":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_main":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_oath":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_dwarf_test":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_council":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_doubt":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_ending":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_intro":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_joined":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_main":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_oath":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_elf_test":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"faction_em_intro":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_em_joined":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_em_oath":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_em_test":{"arc":"arc_fac_em","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_alt_test":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_intro":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_joined":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_oath":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_report":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_es_test":{"arc":"arc_fac_es","vol":"vol_east","act":"act3","ch":null,"type":"faction"},"faction_fc_intro":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_fc_joined":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_fc_oath":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_fc_poor":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_fc_test":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_blackmail":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_blackmail_result":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_council":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_deep":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_eclipse":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_ending":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_intro":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_main":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_medici":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_reveal":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_free_tavern":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_lc_intro":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_lc_joined":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_lc_oath":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_lc_refuse":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_lc_test":{"arc":"arc_fac_lc","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_north_commander":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"faction_north_ending":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"faction_north_intro":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"faction_north_main":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"faction_north_mission":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"faction_orc_chief":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_orc_ending":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_orc_intro":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":"ch_war_orc","type":"main"},"faction_orc_joined":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_orc_main":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_orc_oath":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_orc_test":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"faction_overview":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"faction_recruit_hub":{"arc":"arc_fac_recruit","vol":"vol_academy","act":"act2","ch":null,"type":"faction"},"faction_wt_explain":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faction_wt_fail":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faction_wt_intro":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faction_wt_joined":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faction_wt_oath":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faction_wt_test":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"faith_atheist":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_blessing":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_board_overview":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_info":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_light_intro":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"faith_light_miracle":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"faith_light_oracle":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"faith_list":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_mission":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_oracle":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_overview":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"faith_shrine":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"fate_classmate_01_hero":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fate_classmate_01_trigger":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fate_classmate_01_uncertain":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fate_classmate_01_villain":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fc_archive":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_guild":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_jiaohui_entry":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_market":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_report":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_sewer":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_sewer2":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_sewer3":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_slums_explore_generic":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_slums_generic":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_slums_help_generic":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_stay":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_streets":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"fc_tavern":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"final_battle":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"final_battle_classmates":{"arc":"arc_eclipse","vol":"vol_end","act":"act4","ch":null,"type":"main"},"floating_tower_chess":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_explore":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_notyet":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_paintings":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_reward":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_sacrifice":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_seal":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"floating_tower_who":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"foreshadow_hlj_burn":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_hlj_investigate":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_hlj_letter_academy":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_hlj_to_mercury":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_moral_academy":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"foreshadow_moral_investigate":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"foreshadow_seal_deny":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"foreshadow_seal_fragment_academy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"foreshadow_seal_tell":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"foreshadow_watcher_academy":{"arc":"arc_fsh_watcher1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_watcher_identity":{"arc":"arc_fsh_watcher1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_watcher_proud":{"arc":"arc_fsh_watcher1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"foreshadow_watcher_regret":{"arc":"arc_fsh_watcher1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_abyss1":{"arc":"arc_fsh_abyss1","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_abyss2":{"arc":"arc_fsh_abyss2","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_classmate1":{"arc":"arc_fsh_classmate1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_classmate2":{"arc":"arc_fsh_classmate2","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_dream_gate":{"arc":"arc_fsh_dream","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"fsh_eclipse1":{"arc":"arc_fsh_eclipse1","vol":"vol_end","act":"act4","ch":null,"type":"branch"},"fsh_eclipse2":{"arc":"arc_fsh_eclipse2","vol":"vol_end","act":"act4","ch":null,"type":"branch"},"fsh_firstseal1":{"arc":"arc_fsh_firstseal1","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_firstseal2":{"arc":"arc_fsh_firstseal2","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_hlj_letter1":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fsh_hlj_letter2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"fsh_karma1":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"fsh_karma2":{"arc":"arc_fsh_karma2","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"fsh_lie1":{"arc":"arc_fsh_lie1","vol":"vol_church","act":"act2","ch":null,"type":"branch"},"fsh_lie2":{"arc":"arc_fsh_lie2","vol":"vol_church","act":"act2","ch":null,"type":"branch"},"fsh_lost1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"fsh_lost2":{"arc":"arc_fsh_lost2","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"fsh_origin1":{"arc":"arc_fsh_origin1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"fsh_origin2":{"arc":"arc_fsh_origin2","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"fsh_primal1":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"fsh_primal2":{"arc":"arc_fsh_primal2","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"fsh_prophecy1":{"arc":"arc_fsh_prophecy1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"fsh_prophecy2":{"arc":"arc_fsh_prophecy2","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"fsh_seal1":{"arc":"arc_fsh_seal1","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_seal2":{"arc":"arc_fsh_seal2","vol":"vol_abyss","act":"act3","ch":null,"type":"branch"},"fsh_time1":{"arc":"arc_fsh_time1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_time2":{"arc":"arc_fsh_time2","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_unsaid1":{"arc":"arc_fsh_unsaid1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_unsaid2":{"arc":"arc_fsh_unsaid2","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_watcher1":{"arc":"arc_fsh_watcher1","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"fsh_watcher2":{"arc":"arc_fsh_watcher2","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"game_over":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"gangkou_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"gangkou_berth":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"gangkou_han":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"gangkou_ships":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"genocide_truth":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"god_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_alumni_1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"grad_alumni_2":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"grad_ceremony":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_choice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_exam":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_farewell":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_first_journey":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_free":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_holy":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_hub":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_watcher":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"grad_west":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"guild_info_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"guild_quest_easy_generic":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"guild_quest_hard_generic":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"guild_quests_generic":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"guild_register_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"h_academy_aurelian_hint":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_campus":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_class":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_entrance":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_letter":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_mercury":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_mercury_talk":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_oliver_warning":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_academy_register":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_dark_eye_levia":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_eye_observe":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_eye_talk":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_chase":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_clue":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_confront":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_deal":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_escape":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_fight":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_investigate":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_search":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_dark_gold_steal":{"arc":"arc_fac_abyss","vol":"vol_abyss","act":"act3","ch":null,"type":"faction"},"h_ending_check":{"arc":"arc_ending","vol":"vol_end","act":"act4","ch":null,"type":"main"},"h_event_purification_city":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_event_purification_defend":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_event_purification_info":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_north_alliance":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_north_audience":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_north_court":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_north_peace":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_north_war":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_faction_south_merchant_court":{"arc":"arc_fac_overview","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_huanglinjing_iron_gate":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_huanglinjing_memory":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_huanglinjing_sword_text":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_race_dwarf_forge":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_dwarf_forge_challenge":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_dwarf_seal":{"arc":"arc_fac_dwarf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_elf_levia":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_elf_ritual":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_elf_silent":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_elf_worldtree":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_orc_khan":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_orc_prophet":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_orc_seal":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_race_orc_shaman":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"h_trade_blackmarket":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_bought":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_caravan":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_market_free":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_price_list":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_road_ambush":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_road_retreat":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_road_surrender":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_road_victory":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trade_silver_spike":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_trial_aurelian_cost":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_trial_aurelian_fail":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_trial_aurelian_pass":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_trial_aurelian_soul":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_trial_aurelian_start":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_trial_aurelian_story":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"h_underworld_assassins":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_blackmarket":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_deal":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_entrance":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_initiation":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_leader":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"h_underworld_thieves":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"haigang_ship":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hewan_market":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hewan_road":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hidden_dragon_tamer_unlock":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hidden_eclipse_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hidden_primordial_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hidden_route_clue":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hidden_watcher_academy_unlock":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"hidden_watcher_explain":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"hidden_watcher_intro":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"hlj_clue_found":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hlj_treasure_hunt":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_dungeon":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_foreshadow":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_hub":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_item":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_npc":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_politics":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"hook_west":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_goldscale":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_holyorder":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_ironfist":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_medici":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"house_medici_meeting":{"arc":"arc_fac_fc","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"house_relations":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"house_shadow":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"i_artifact_leon_appraiser":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_destiny":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_father":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_identify":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_joke":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_quest":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_seal":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_artifact_leon_sword":{"arc":"arc_bond_artifact","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_abyss_hint":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_danger":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_dilemma":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_helper":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_key":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_key_crit":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_key_fail":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_key_received":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_lab":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_lab_fail":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_library_explain":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_notes":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_notes_deep":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_notes_fail":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_personal":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_possibility":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_press_fail":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_promise":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_promise_made":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_research":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_respect":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_seraphine_hint":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_seraphine_name":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_still_watchman":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_teach":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_teach_fail":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_teach_result":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_bond_mercury_touched":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_alchemy":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_arcane":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_elemental":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_elemental_forbidden":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_elemental_train":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_holy":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_illusion":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_school_choice":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_magic_soul":{"arc":"arc_bond_magic","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_origin_alexander":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_alexander_public":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_alexander_truth":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_brothers_unite":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_heresy":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_medichi_archive":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_memory_fragment":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_mercury_dream":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_parents_alive":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_recall":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_share_clues":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_origin_traitor":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"i_timeloop_awakening":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_book_location":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_breakdown":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_denial":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_memory":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_past_loop":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_quest":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_voice":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_timeloop_who":{"arc":"arc_bond_timeloop","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"i_war_aid_sent":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_battle_eve":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_battle_morning":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_battle_prep":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_battle_result":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_captive_interrogation":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_defense_council":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_flank":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_ice_wall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_iron_gate":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_night_raid":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_captive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_fire":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_infiltrate":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_loot":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_result":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_retreat":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_raid_success":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_reinforcements":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_supply":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_supply_info":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_war_traps":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"i_watchmen_abyss_explain":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_aurelian_age":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_aurelian_lonely":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_deep":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_escape":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_explain":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_invitation":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_mercury_leave":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_question":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_retreat":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_comfort":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_mercury_love":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_method":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_observe":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_promise":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_rescue":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_seraphine_talk":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_underground":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"i_watchmen_why_me":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"item_button_1":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"item_button_2":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"item_compass_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_compass_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_feather_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_feather_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_holywater_1":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"item_holywater_2":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"item_hub":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"item_leaf_1":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"item_leaf_2":{"arc":"arc_fac_elf","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"item_letter_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_letter_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_plate_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_plate_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_seed_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_seed_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_watch_1":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"item_watch_2":{"arc":"arc_fsh_lost1","vol":"vol_free","act":"act1","ch":null,"type":"branch"},"job_alchemist_awakening":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_alchemist_growth":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_alchemist_intro":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_alchemist_legend":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_alchemist_turn":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_mage_awakening":{"arc":"arc_job_mage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_mage_growth":{"arc":"arc_job_mage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_mage_intro":{"arc":"arc_job_mage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_mage_legend":{"arc":"arc_job_mage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_mage_turn":{"arc":"arc_job_mage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_merchant_awakening":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_merchant_growth":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_merchant_intro":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_merchant_legend":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_merchant_turn":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_overview":{"arc":"arc_job_overview","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_rogue_awakening":{"arc":"arc_job_rogue","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_rogue_growth":{"arc":"arc_job_rogue","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_rogue_intro":{"arc":"arc_job_rogue","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_rogue_legend":{"arc":"arc_job_rogue","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_rogue_turn":{"arc":"arc_job_rogue","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_soulmage_awakening":{"arc":"arc_job_soulmage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_soulmage_growth":{"arc":"arc_job_soulmage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_soulmage_intro":{"arc":"arc_job_soulmage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_soulmage_legend":{"arc":"arc_job_soulmage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_soulmage_turn":{"arc":"arc_job_soulmage","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_warrior_awakening":{"arc":"arc_job_warrior","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_warrior_growth":{"arc":"arc_job_warrior","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_warrior_intro":{"arc":"arc_job_warrior","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_warrior_legend":{"arc":"arc_job_warrior","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"job_warrior_turn":{"arc":"arc_job_warrior","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"journey_caravan_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_caravan_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_caravan_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_caravan_4a":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_caravan_4b":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_caravan_4c":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_church_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_church_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_church_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_river_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_river_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_river_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_solo_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_solo_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"journey_solo_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"karma_grow_merchant":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_harvest_merchant":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_seed_merchant":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_seed_protect_grom":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_sprout_merchant":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_sprout_protect":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"karma_web_overview":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"knowledge_forget_choice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"knowledge_gain_hlj_crime":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"knowledge_gain_seal_truth":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"knowledge_panel":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"kuangshan_forge":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"kuangshan_mine":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"landmark_floating_tower":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"landmark_world_tree":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"language_ancient_decode":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"language_draconic_egg":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"language_learn_ancient":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"language_learn_draconic":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"language_learn_dwarvish":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"language_learn_elvish":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"language_learn_elvish_2":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"language_menu":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"letter_read":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"letter_trigger_1":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"llm_settings":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"magic_scroll_result":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"magic_scroll_study":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"mat_market_buy":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"mat_market_dark":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"mat_market_hub":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"mat_market_sell":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"mat_market_swap":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"memory_unlock":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"memory_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"messenger_defeated":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"messenger_fight":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"messenger_fight_hunger":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"missed_story_demo":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"moral_bread_theft":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_bread_theft_hungry":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_bread_theft_stole":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_bread_theft_work":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_choice_event":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_choice_result":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_combat_fought":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_combat_mercy":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_combat_mercy_given":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_combat_robbed":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_informant":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_informant_hidden":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_informant_ignored":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_informant_reported":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_refugee_all":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_refugee_half":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_refugee_help":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_refugee_little":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"moral_refugee_none":{"arc":"arc_fsh_karma1","vol":"vol_war","act":"act3","ch":null,"type":"branch"},"mother_rescue":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"moxie_airship":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"moxie_guild":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"moxie_workshop":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ngplus_inherit":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ngplus_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ngplus_true_ending":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ngplus_world_effect":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_action":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_choose_house":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_church":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_court":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_dwarf":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_elf":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_goldscale":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_ironfist":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"noble_medici":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"north_academy_2":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"north_academy_gate":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"north_academy_inside":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"north_academy_night":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"north_leave":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"north_library":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"north_library_2":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"north_mercury":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"north_tavern":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"north_tavern2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"npc_alexander_climax":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_alexander_intro":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_alexander_resolution":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_alexander_story":{"arc":"arc_cm_alexander","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_aurelian_chat":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_climax":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_cremence":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_follow":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_intro":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_irongate":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_node":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_recognize":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_resolution":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_secret":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_story":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_teahouse":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_truth":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_aurelian_waiting":{"arc":"arc_npc_aurelian","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_deep_result":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_deep_talk":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_mercury_climax":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_mercury_intro":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_mercury_resolution":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_mercury_story":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_overview":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_parallel_hub":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_parallel_view":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_cecilia_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_cecilia_2":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_cecilia_3":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_debt":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_edmund_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_edmund_2":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_edmund_3":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_gray_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_gray_2":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_hub":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_lolin_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_marcus_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_memory_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_memory_2":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_mercury_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_mercury_2":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_mercury_3":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_parting":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_qinte_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_rel_valen_1":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_roland_abyss":{"arc":"arc_npc_roland","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_roland_blacksmith":{"arc":"arc_npc_roland","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_roland_brother":{"arc":"arc_npc_roland","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_roland_recognize":{"arc":"arc_npc_roland","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_schedule_view":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"npc_silvia_ally":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_ball":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_business":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_dance":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_darkcult":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_neutral":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_silvia_silverroad":{"arc":"arc_npc_silvia","vol":"vol_academy","act":"act2","ch":null,"type":"bond"},"npc_skadi_abyss_path":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_ally":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_ballad":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_been_inside":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_carving":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_darkcult":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_disease":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_explain":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_father":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_father_return":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_father_room":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_hunt":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_hunter":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_ice_discard":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_ice_research":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_icefield":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_room_observe":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_south_news":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_teach":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_skadi_water":{"arc":"arc_npc_skadi","vol":"vol_free","act":"act1","ch":null,"type":"bond"},"npc_track":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"open_map":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"orc_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"orc_camp":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"orc_deep_feast":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_gate":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_hunt":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_leave":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_market":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_smith":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_totem":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_trail":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_witch":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_deep_wolf":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_done":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"orc_sacred":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"orc_w_end":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_w_enter":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_w_step1":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orc_w_step2":{"arc":"arc_fac_orc","vol":"vol_race","act":"act3","ch":null,"type":"faction"},"orientation_day1":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day1_campus":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day1_room":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day2":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day2_result":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day3":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day4":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"orientation_day5":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"origin_choice":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_abnormal_hide":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_abnormal_jump":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_abnormal_run":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_church_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_clue":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_edge_explore":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_desert_leave_aunt":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_eternal_forge":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_dwarf_leave_friends":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_east_ancient_cave":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_east_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_east_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_east_leave_master":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_eastern_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_eastern_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_eastern_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_eastern_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_eastern_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_leave_friends":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_elf_worldtree_root":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_abnormal_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_abnormal_follow":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_abnormal_knock":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_abnormal_run":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_abnormal_shout":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_guard":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_ignore":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_li":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_wait":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_choice_watcher":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_city_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_city_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_city_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_city_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_city_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_2":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_li":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_look":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_daily_wait":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_leave_2":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_leave_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_leave_friends":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_leave_walk":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_free_sea_deck":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_generic_clue":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_medici_hint":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_abnormal_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_abnormal_fight":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_abnormal_hide":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_choice_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_choice_flee":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_choice_heal":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_north_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_northern_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_northern_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_northern_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_northern_2c":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_northern_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_leave_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_leave_fight":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_orc_leave_hide":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_south_abnormal_ask":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_south_abnormal_eavesdrop":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_south_daily_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_south_daily_2":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_southern_1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_southern_2a":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_southern_2b":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"origin_southern_3":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"p12_a_debtor":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_a_end":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_a_enter":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_a_talk":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_b_arm":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_b_end":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_b_enter":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_b_name":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_c_end":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_c_enter":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_c_tale":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"p12_c_watch":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"parallel_events_review":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"past_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"past_entry":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"past_era1_choice":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"past_era1_explore":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"past_era2_entry":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"past_huanglingjing_talk":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"past_return":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"plague_heal":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"plague_outbreak":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"plague_response":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"pol_after_chase":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_after_org":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_ask_T":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_back_dorm":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_basement":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_choice_org":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_choice_partner":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_choice_solo":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_cloth_supplier":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dance_cost":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dark_full":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dark_ledger":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dark_oldcrow":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dark_origin":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_deal_observer":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_dean_permit":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_deepest_secret":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_advice":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_decision":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_mediator":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_past":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_probe":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_edmund_truth":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_escape_plan":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_escape_trap":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_exchange_arrive":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_exchange_probe":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_faction_map":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_faction_map2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_final_showdown":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_finance_evidence":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_finance_join":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_forge_night":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_forge_report":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_forge_shop":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_free_ally":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_free_meet":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_go_west":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gold_ledger":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gold_night":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gold_trail":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_grab_manuscript":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gray_aftermath":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gray_follow":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gray_girl":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_gray_girl2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_graypriest_follow":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_guardian":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_handover_manuscript":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_hide_box":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_hide_shelf":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_hub":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_ignore":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_intro":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_join_light":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_join_third":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_late_arrive":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_leave_academy":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_leave_tower":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_ledger_suspect":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_library_b2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_light_meet":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_list_move":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_listen_more":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_marcus_meet":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_math_book":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_math_book2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_next_step":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_number14":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_observer_pattern":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_oldcrow":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_open_question":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_qinte_ally":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_qinte_ally2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_qinte_meet":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_refuse_guardian":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_report_aftermath":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_report_edmund":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_report_edmund2":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_resist_third":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_rest_politics":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_rumor_hall":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_rumor_more":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_seven_seal":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_show_box":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_signal_report":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_stop_here":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_tear_manuscript":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_tell_gray":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_test_edmund":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_think_edmund":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_third_party":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_touch_observer":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_tower_base":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_tower_night":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_trade_west":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_truth_deep":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_urgent_report":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_verify_edmund":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_wait_qinte":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_warehouse":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_watcher_accept":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_watcher_history":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pol_watcher_report":{"arc":"arc_pol","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"post_academy_faction":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"post_academy_research":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"post_academy_teacher":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"pov_recap_node":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"primordial_alliance":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_anger_dialogue":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_anger_encounter":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_anger_outcome":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_hunger_choice":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_hunger_dialogue_1":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_hunger_dialogue_2":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_hunger_encounter":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"primordial_hunger_outcome":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"pro_after":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_after_leave":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_arrive":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_choose_east":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_choose_north":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_choose_south":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_choose_west":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"pro_realm1":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_admission":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_after_awakening":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_after_crisis":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_alternate":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_apprentice":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_awakening":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_awakening_truth":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_chengtian":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_elda":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_forge":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_holy":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_silverleaf":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_choose_watcher":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_crisis":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_cultivate":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_daily_check":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_departure":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_enroll_companion":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_enroll_delay":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_enroll_normal":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_enroll_secret":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_exam":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_exam_prep":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_explore":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_final":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_home":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_hub":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_market":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_mentor":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_mentor_past":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_opportunity":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_refuse_awakening":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_review":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_seal_choice":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_seal_fragment":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_seal_hint":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_social":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_start":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_status":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_tavern":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_wild":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prologue_work":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"prophecy_first_hearing":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"prophecy_investigation":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"quest_bandit_camp":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_bandit_camp_after":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_bandit_fire":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_bandit_letter":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_bandit_stealth":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_classmate":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_event":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_fail_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_find_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_find_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_find_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_find_4":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_hidden_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_hidden_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_hidden_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_hub":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_ledger_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_ledger_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_rescue_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_rescue_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_rescue_3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_rescue_action":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_rescue_end":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_research":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_seal_1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_seal_2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_secret":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"quest_tutor":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"race_choice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_4":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_5":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_6":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_7":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_8":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"realm_godfavor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"relation_deep_mercury":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"relation_mercury_outcome":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"relation_mercury_talk":{"arc":"arc_npc_mercury","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"relation_repair_attempt":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"relation_rupture_event":{"arc":"arc_bond_bond","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"relic_alchemy_furnace":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_book_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_cloak_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_boss":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_heart":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_heart_memory":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_puzzle":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_element_search":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_forge_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_grail_boss":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_grail_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_grail_puzzle":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_grail_search":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_holy_grail":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_hourglass":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_hourglass_memory":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_key_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_list":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_memory":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_overview":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_overview2":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_seal_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_shield_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_soul_eye":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_soul_eye_memory":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_soul_eye_mercury":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_staff":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"relic_thread_intro":{"arc":"arc_fsh_primal1","vol":"vol_race","act":"act3","ch":null,"type":"branch"},"reunion_alex":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_cain":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_cecilia":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_grom":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_mary":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_mouse":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_night":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_outcome":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"reunion_result":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ripple_grow_vendor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ripple_harvest_vendor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ripple_seed_save_vendor":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"ripple_seed_save_vendor_done":{"arc":"arc_fsh_hlj","vol":"vol_academy","act":"act2","ch":null,"type":"branch"},"ripple_sprout_vendor":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"ripple_web_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"rumor_mill":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"seal1_act1_archive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_archive_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_clue_gathered":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_hidden":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":"ch_abyss_seal","type":"main"},"seal1_act1_letter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_mercury":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_mercury_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_mercury_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_road_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_soul_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_soul_read":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_supply":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_vet":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_vet_detail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_vet_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act1_vet_wound":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_arrested":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_arrive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_captured":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_cells":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_combat_lose":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_combat_win":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_dungeon":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_enter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_escape_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_horse_panic":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_journey":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_journey_mountain":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_journey_road":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_knight":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_loot":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_maintenance_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_night":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_notes":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_painting":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_painting_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_runes":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_runes_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_runes_repair":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_side_enter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_sneak":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_spotted":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act2_track":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_attack":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_attack_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_attack_more":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_caught":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_core_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_core_runes":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_disarm":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_madness":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_pit":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act3_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_clue":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_destroy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_destroy_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_destroy_win":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_emily_listen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_emily_scared":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_emily_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_exploit":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_mercury_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_regret":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_repair":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_retreat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_self_destruct":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_act4_vet_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_after_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_camp":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_door":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_flee":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_gift":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_inside":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_irongate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_meditate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_night":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_oldman":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_stare":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal1_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_alone":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_anger_consequence":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_approach":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_assassin_plan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_awaken_plan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_both_plan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_caravan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_clue_gathered":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_grandma":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_guide":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_khan_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_khan_military":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_khan_weakness":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_merchant":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_repair_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_ritual":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_road_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_seal_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_shaman_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_son_grave":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_stop_khan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_survivor":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_tavern":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_tavern_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_trade_route":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_volunteer":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_wanderer_camp":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_wanderer_power":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_wanderer_trap":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act1_wanderers":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_arrive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_carry_shaman":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_cave":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_climb":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_fight_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_fight_patrol":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_hide":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_infiltrate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_injured_tent":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_journey":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_khan_weakness":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_listen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_loot":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_observe_camp":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_old_shaman":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_rescue":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_secret_path":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_side_approach":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_spotted":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_summit":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_throne":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act2_track_patrol":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_awaken":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_combat_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_khan_alone":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_khan_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_khan_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_other_way":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_ritual":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_ritual_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_skull_attack":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_skull_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_vessel":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act3_why":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_grandma":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_grub":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_khan_sacrifice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_partial":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_repair":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_repair_no_sacrifice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_sacrifice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_act4_vessel_sacrifice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal2_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_captured":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_caravan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_clue_gathered":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_encounter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_force":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_guardian":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_guardian_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_guardian_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_hide":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_hlj_reason":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_huanglinjing":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_letter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_mercury_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_mercury_name":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_mercury_past":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_mercury_story":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_offer_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_other_way":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_prepare":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_queen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_queen_joins":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_request":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_seal_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_seal_structure":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_sneak":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_sneak_in":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_wait":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act1_why_not":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_attack":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_fall":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_mirror":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_mirror_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_next":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_other_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_queen_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_queen_kill":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_queen_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_recover":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_resist":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_root":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act2_runes":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_agreement":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_become_god":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_defeat_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_hlj_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_repair":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_talk_pride":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act3_wait_ruins":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_emergency":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_other_seals":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_queen_freed":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_queen_future":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_queen_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_repair_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_repair_success":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_retreat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_act4_together":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal3_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_abyss_entrance":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_audience":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_both_routes":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_clue_gathered":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_copperbeard_more":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_enter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_force_enter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_heart_route":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_location":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_merchant_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_mine":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_miner_contact":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_miner_entrance":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_miner_path":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_offer_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_old_miner":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_palace":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_repair_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_resist_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_scatter_route":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_seal_location":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_tavern":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_thorin_confront":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_thorin_flatter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_thorin_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_thorin_state":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_thorin_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_wait":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act1_why_not":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_abyss":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_alone":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_dive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_dive_fail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_lakeside":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_pull":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_purify":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_retreat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_scan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_scatter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_scatter_plan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_tempted":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_thorin_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act2_will_help":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_exploit":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_give_thorin":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_heart_obtained":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_scatter_execution":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_scatter_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act3_seal_heart":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_become_greedy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_dark_ending":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_other_seals":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_people_reaction":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_redemption":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_scatter_success":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_seal_success":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_act4_throw_back":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_heart_whisper":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal4_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_boat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_contact":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_gear":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_location":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_sea_people":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act1_wait":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act2_dive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act2_meet":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act2_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act2_sneak":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act2_wait_sea":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_apologize":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_deal":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_persuade":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_repair_cure":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act3_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act4_deal_made":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act4_need_negotiate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_act4_other_seals":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_dive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_apologize":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_blood_unlock":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_captured":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_church":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_deal":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_deal_item":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_deal_made":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_deal_name":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_deal_weapon":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_dive":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_dive_tips":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_dock_watch":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_escape":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_find_boat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_hesitate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_kill_queen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_leave":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_location":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_magic_shop":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_meet":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_mercy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_need_negotiate":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_old_captain":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_old_haiguai_story":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_other_seals":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_pearl_info":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_persuade":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_promise":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_queen_name":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_queen_plan":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_repair_cure":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_sail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_seal_detail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_seen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_sneak":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_tavern_none":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_tavern_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_underwater":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_warn":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_exp_xiaolan_story":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_fisherman":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_hire":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal5_puzzle":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_academy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_other_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_repair_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_rift":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_rift_use":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_student":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_why_lazy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act1_xuanji":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act2_rift":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act3_find_hlj":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act3_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act3_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act3_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act4_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act4_change_past":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act4_new_world":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act4_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_act4_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_enter":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_academy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_change_past":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_find_hlj":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_new_world":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_observe_past":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_other_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_repair_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_return_new":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_rift":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_rift_direct":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_rift_use":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_student":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_truth_past":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_why_lazy":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_exp_xuanji_detail":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_research":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_transition":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal6_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_embrace":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_oasis":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_question":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_rest":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act1_trapped":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act2_desert":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act2_observe":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act2_prepare":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_accept":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_final_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_temple":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act3_why":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_coexist":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_coexist_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_ending":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_ending_coexist":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_final":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_act4_final_friend":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_approach":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_desert":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_accept":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_coexist":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_coexist_method":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_combat":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_desert":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_embrace":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_ending":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_ending_coexist":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_final":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_final_friend":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_oasis":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_observe_temple":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_prepare":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_question":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_refuse":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_rest_oasis":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_talk":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_temple":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_trapped":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_exp_why":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_puzzle":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal7_town":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_1_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_aftermath":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_cost":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_shaman":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_2_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_contract":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_queen":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_3_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_deep":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_forge":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_4_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_explore":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_5_truth":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_outcome":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_paradox_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_past_arrival":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_return":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_time_rift":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_truth_reveal":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_6_young_huanglingjing":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_7_desert":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_7_final_choice":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_7_intro":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_7_primordial":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_7_temple":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"seal_overview":{"arc":"arc_seal","vol":"vol_abyss","act":"act3","ch":null,"type":"main"},"senlin_archery":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"senlin_legend":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"seraph_truth":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"seraph_visit":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"seven_seals_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shangzhan_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shangzhan_knife":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shangzhan_market":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shop_buy_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shop_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shop_sell_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"shop_status_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"silence_node":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"sleep_normal":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"slow_travel_":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_arrive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_campfire":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_companion_talk":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_dusk":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_morning":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_next_day":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_night":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_noon":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_reflect":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"slow_travel_start":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"south_after_escape":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"south_after_moxie":{"arc":"arc_academy","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"south_goldscale":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"south_goldscale2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"south_moxie_go":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"south_silver_back":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"south_silver_front":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"south_zhou":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"story_lines_overview":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"sub_alchemist_0":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_alchemist_1":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_alchemist_g":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_alchemist_g2":{"arc":"arc_job_alchemist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_arcane_0":{"arc":"arc_job_arcane","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_arcane_1":{"arc":"arc_job_arcane","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_arcane_g":{"arc":"arc_job_arcane","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_arcane_g2":{"arc":"arc_job_arcane","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_ascetic_0":{"arc":"arc_job_ascetic","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_ascetic_1":{"arc":"arc_job_ascetic","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_ascetic_g":{"arc":"arc_job_ascetic","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_ascetic_g2":{"arc":"arc_job_ascetic","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_assassin_0":{"arc":"arc_job_assassin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_assassin_1":{"arc":"arc_job_assassin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_assassin_g":{"arc":"arc_job_assassin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_assassin_g2":{"arc":"arc_job_assassin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_auctioneer_0":{"arc":"arc_job_auctioneer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_auctioneer_1":{"arc":"arc_job_auctioneer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_auctioneer_g":{"arc":"arc_job_auctioneer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_auctioneer_g2":{"arc":"arc_job_auctioneer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_banker_0":{"arc":"arc_job_banker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_banker_1":{"arc":"arc_job_banker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_banker_g":{"arc":"arc_job_banker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_banker_g2":{"arc":"arc_job_banker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_beastfriend_0":{"arc":"arc_job_beastfriend","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_beastfriend_1":{"arc":"arc_job_beastfriend","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_beastfriend_g":{"arc":"arc_job_beastfriend","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_beastfriend_g2":{"arc":"arc_job_beastfriend","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_berserker_0":{"arc":"arc_job_berserker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_berserker_1":{"arc":"arc_job_berserker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_berserker_g":{"arc":"arc_job_berserker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_berserker_g2":{"arc":"arc_job_berserker","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_bloodsorcerer_0":{"arc":"arc_job_bloodsorcerer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_bloodsorcerer_1":{"arc":"arc_job_bloodsorcerer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_bloodsorcerer_g":{"arc":"arc_job_bloodsorcerer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_bloodsorcerer_g2":{"arc":"arc_job_bloodsorcerer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_burglar_0":{"arc":"arc_job_burglar","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_burglar_1":{"arc":"arc_job_burglar","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_burglar_g":{"arc":"arc_job_burglar","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_burglar_g2":{"arc":"arc_job_burglar","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_conjurer_0":{"arc":"arc_job_conjurer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_conjurer_1":{"arc":"arc_job_conjurer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_conjurer_g":{"arc":"arc_job_conjurer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_conjurer_g2":{"arc":"arc_job_conjurer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_darkknight_0":{"arc":"arc_job_darkknight","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_darkknight_1":{"arc":"arc_job_darkknight","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_darkknight_g":{"arc":"arc_job_darkknight","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_darkknight_g2":{"arc":"arc_job_darkknight","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_elemental_0":{"arc":"arc_job_elemental","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_elemental_1":{"arc":"arc_job_elemental","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_elemental_g":{"arc":"arc_job_elemental","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_elemental_g2":{"arc":"arc_job_elemental","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_faceless_0":{"arc":"arc_job_faceless","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_faceless_1":{"arc":"arc_job_faceless","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_faceless_g":{"arc":"arc_job_faceless","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_faceless_g2":{"arc":"arc_job_faceless","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_forger_0":{"arc":"arc_job_forger","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_forger_1":{"arc":"arc_job_forger","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_forger_g":{"arc":"arc_job_forger","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_forger_g2":{"arc":"arc_job_forger","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_healer_0":{"arc":"arc_job_healer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_healer_1":{"arc":"arc_job_healer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_healer_g":{"arc":"arc_job_healer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_healer_g2":{"arc":"arc_job_healer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hunter_0":{"arc":"arc_job_hunter","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hunter_1":{"arc":"arc_job_hunter","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hunter_g":{"arc":"arc_job_hunter","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hunter_g2":{"arc":"arc_job_hunter","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hypnotist_0":{"arc":"arc_job_hypnotist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hypnotist_1":{"arc":"arc_job_hypnotist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hypnotist_g":{"arc":"arc_job_hypnotist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_hypnotist_g2":{"arc":"arc_job_hypnotist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_inquisitor_0":{"arc":"arc_job_inquisitor","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_inquisitor_1":{"arc":"arc_job_inquisitor","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_inquisitor_g":{"arc":"arc_job_inquisitor","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_inquisitor_g2":{"arc":"arc_job_inquisitor","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_itinerant_0":{"arc":"arc_job_itinerant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_itinerant_1":{"arc":"arc_job_itinerant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_itinerant_g":{"arc":"arc_job_itinerant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_itinerant_g2":{"arc":"arc_job_itinerant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_machinist_0":{"arc":"arc_job_machinist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_machinist_1":{"arc":"arc_job_machinist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_machinist_g":{"arc":"arc_job_machinist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_machinist_g2":{"arc":"arc_job_machinist","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_medium_0":{"arc":"arc_job_medium","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_medium_1":{"arc":"arc_job_medium","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_medium_g":{"arc":"arc_job_medium","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_medium_g2":{"arc":"arc_job_medium","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_merchant_0":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_merchant_1":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_merchant_g":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_merchant_g2":{"arc":"arc_job_merchant","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_necromancer_0":{"arc":"arc_job_necromancer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_necromancer_1":{"arc":"arc_job_necromancer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_necromancer_g":{"arc":"arc_job_necromancer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_necromancer_g2":{"arc":"arc_job_necromancer","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_paladin_0":{"arc":"arc_job_paladin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_paladin_1":{"arc":"arc_job_paladin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_paladin_g":{"arc":"arc_job_paladin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_paladin_g2":{"arc":"arc_job_paladin","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_path_hub":{"arc":"arc_job_path","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_protector_0":{"arc":"arc_job_protector","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_protector_1":{"arc":"arc_job_protector","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_protector_g":{"arc":"arc_job_protector","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_protector_g2":{"arc":"arc_job_protector","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_scout_0":{"arc":"arc_job_scout","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_scout_1":{"arc":"arc_job_scout","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_scout_g":{"arc":"arc_job_scout","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_scout_g2":{"arc":"arc_job_scout","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_shieldguard_0":{"arc":"arc_job_shieldguard","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_shieldguard_1":{"arc":"arc_job_shieldguard","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_shieldguard_g":{"arc":"arc_job_shieldguard","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_shieldguard_g2":{"arc":"arc_job_shieldguard","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_smuggler_0":{"arc":"arc_job_smuggler","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_smuggler_1":{"arc":"arc_job_smuggler","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_smuggler_g":{"arc":"arc_job_smuggler","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_smuggler_g2":{"arc":"arc_job_smuggler","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_soulbinder_0":{"arc":"arc_job_soulbinder","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_soulbinder_1":{"arc":"arc_job_soulbinder","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_soulbinder_g":{"arc":"arc_job_soulbinder","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_soulbinder_g2":{"arc":"arc_job_soulbinder","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_spy_0":{"arc":"arc_job_spy","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_spy_1":{"arc":"arc_job_spy","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_spy_g":{"arc":"arc_job_spy","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_spy_g2":{"arc":"arc_job_spy","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warden_0":{"arc":"arc_job_warden","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warden_1":{"arc":"arc_job_warden","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warden_g":{"arc":"arc_job_warden","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warden_g2":{"arc":"arc_job_warden","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warlord_0":{"arc":"arc_job_warlord","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warlord_1":{"arc":"arc_job_warlord","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warlord_g":{"arc":"arc_job_warlord","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warlord_g2":{"arc":"arc_job_warlord","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warpriest_0":{"arc":"arc_job_warpriest","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warpriest_1":{"arc":"arc_job_warpriest","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warpriest_g":{"arc":"arc_job_warpriest","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_warpriest_g2":{"arc":"arc_job_warpriest","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_weaponmaster_0":{"arc":"arc_job_weaponmaster","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_weaponmaster_1":{"arc":"arc_job_weaponmaster","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_weaponmaster_g":{"arc":"arc_job_weaponmaster","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"sub_weaponmaster_g2":{"arc":"arc_job_weaponmaster","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"succession_choose":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"succession_handover":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"succession_training":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"successor_new_era":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tavern_chat_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tavern_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tavern_rumor_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tavern_sleep_generic":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tiebi_camp":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"tiebi_camp_back":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"tiebi_oldleon":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tiebi_oldleon2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tiebi_warfield":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tiebi_warfield2":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_calendar_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_diary_view":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_dusk_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_morning_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_night_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_noon_arrival":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_pressure_abyss":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_system_overview":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"time_window_missed_demo":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"timeline_overview":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"title_screen":{"arc":"arc_origin","vol":"vol_free","act":"act1","ch":null,"type":"main"},"tm_courier":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_frontline":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_negotiate":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_refugee":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_ruins":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_warwatch":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"tm_watchtower":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"transition_after_battle":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"transition_night_camp":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"transition_three_days":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"travel":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"travel_desert_day1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_desert_day2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_desert_day2_solo":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_desert_explore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_dwarf_day1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_dwarf_day2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_dwarf_day2_solo":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_dwarf_explore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_east_day1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_east_day2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_east_day2_solo":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_east_explore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_east_start":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_elf_day1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_elf_day2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_elf_day2_solo":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_elf_explore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_elf_treesong":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_north_campfire":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_north_day1":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_north_day2":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_north_day2_solo":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_north_explore":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_north_start":{"arc":"arc_fac_north","vol":"vol_north","act":"act2","ch":null,"type":"faction"},"travel_resolve":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"travel_south_day1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_south_day2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_south_day2_solo":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_south_explore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_south_start":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"travel_tiebi_start":{"arc":null,"vol":"vol_north","act":"act2","ch":null,"type":null},"travel_west_day1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"travel_west_day2":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"travel_west_day2_solo":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"travel_west_explore":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"travel_west_start":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":"ch_war_west","type":"faction"},"u1_demo":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"u8_ah_answer":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_honest":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_question":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_task":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_ah_way":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_finish":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_leave":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_riddle":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_riddle_hint":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_riddle_ok":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_sea":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_d_skeptic":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_business":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_job":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_note":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_note_ok":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_peek":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_e_trust":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_ask":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_duel":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_oath":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_road":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_f_why":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_advice":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_deal":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_proposal":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_fl_view":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_end":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_enter":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_escort":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_fight":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_plea":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_road":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_talk":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"u8_nk_truth":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"underworld_entrance":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"underworld_fence":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"underworld_info":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"underworld_job":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"underworld_recruit":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"unresolved_mysteries_node":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"v23_final_synthesis":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"v24_ending_synthesis":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"v24_final_choice":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"v24_final_ending":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"v25_master_status":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"v47_ledger":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"v56s_beast1_a":{"arc":"arc_job_beast1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_hermit_a":{"arc":"arc_job_hermit","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight1_a":{"arc":"arc_job_knight1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight1_b":{"arc":"arc_job_knight1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight1_c":{"arc":"arc_job_knight1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight2_a":{"arc":"arc_job_knight2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight2_b":{"arc":"arc_job_knight2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_knight2_c":{"arc":"arc_job_knight2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage1_a":{"arc":"arc_job_mage1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage1_b":{"arc":"arc_job_mage1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage1_c":{"arc":"arc_job_mage1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage2_a":{"arc":"arc_job_mage2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage2_b":{"arc":"arc_job_mage2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage2_c":{"arc":"arc_job_mage2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage3_a":{"arc":"arc_job_mage3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage3_b":{"arc":"arc_job_mage3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage3_c":{"arc":"arc_job_mage3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage4_a":{"arc":"arc_job_mage4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage4_b":{"arc":"arc_job_mage4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage4_c":{"arc":"arc_job_mage4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage5_a":{"arc":"arc_job_mage5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_mage5_b":{"arc":"arc_job_mage5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest1_a":{"arc":"arc_job_priest1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest1_b":{"arc":"arc_job_priest1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest1_c":{"arc":"arc_job_priest1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest2_a":{"arc":"arc_job_priest2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest2_b":{"arc":"arc_job_priest2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest2_c":{"arc":"arc_job_priest2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest3_a":{"arc":"arc_job_priest3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_priest3_b":{"arc":"arc_job_priest3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger1_a":{"arc":"arc_job_ranger1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger1_b":{"arc":"arc_job_ranger1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger1_c":{"arc":"arc_job_ranger1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger2_a":{"arc":"arc_job_ranger2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger2_b":{"arc":"arc_job_ranger2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_ranger2_c":{"arc":"arc_job_ranger2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_rv_o_a":{"arc":"arc_job_rv","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_rv_o_b":{"arc":"arc_job_rv","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_rv_soul_a":{"arc":"arc_job_rv","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_rv_soul_b":{"arc":"arc_job_rv","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith1_a":{"arc":"arc_job_smith1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith1_b":{"arc":"arc_job_smith1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith1_c":{"arc":"arc_job_smith1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith2_a":{"arc":"arc_job_smith2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith2_b":{"arc":"arc_job_smith2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_smith2_c":{"arc":"arc_job_smith2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_soul1_a":{"arc":"arc_job_soul1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_soul1_b":{"arc":"arc_job_soul1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_soul1_c":{"arc":"arc_job_soul1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_soul1_d":{"arc":"arc_job_soul1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_swordsman_a":{"arc":"arc_job_swordsman","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief1_a":{"arc":"arc_job_thief1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief1_b":{"arc":"arc_job_thief1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief1_c":{"arc":"arc_job_thief1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief2_a":{"arc":"arc_job_thief2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief2_b":{"arc":"arc_job_thief2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_thief2_c":{"arc":"arc_job_thief2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade1_a":{"arc":"arc_job_trade1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade1_b":{"arc":"arc_job_trade1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade1_c":{"arc":"arc_job_trade1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade2_a":{"arc":"arc_job_trade2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade2_b":{"arc":"arc_job_trade2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_trade2_c":{"arc":"arc_job_trade2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war1_a":{"arc":"arc_job_war1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war1_b":{"arc":"arc_job_war1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war1_c":{"arc":"arc_job_war1","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war2_a":{"arc":"arc_job_war2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war2_b":{"arc":"arc_job_war2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war2_c":{"arc":"arc_job_war2","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war3_a":{"arc":"arc_job_war3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war3_b":{"arc":"arc_job_war3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war3_c":{"arc":"arc_job_war3","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war4_a":{"arc":"arc_job_war4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war4_b":{"arc":"arc_job_war4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war4_c":{"arc":"arc_job_war4","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war5_a":{"arc":"arc_job_war5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war5_b":{"arc":"arc_job_war5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v56s_war5_c":{"arc":"arc_job_war5","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_debt_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_debt_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_debt_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_debt_3b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_scale_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_scale_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_scale_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_scale_3b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_tally_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_tally_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_tally_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_商人_tally_3b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_kill_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_kill_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_kill_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_kill_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_overdraw_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_overdraw_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_overdraw_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_overdraw_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_scar_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_scar_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_scar_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_战士_scar_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_backlash_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_backlash_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_backlash_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_backlash_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_furnace_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_furnace_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_furnace_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_furnace_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_material_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_material_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_material_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_术士_material_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_beast_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_beast_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_beast_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_beast_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_hunt_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_hunt_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_hunt_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_hunt_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_lone_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_lone_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_lone_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_游侠_lone_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_burn_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_burn_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_burn_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_burn_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_loathe_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_loathe_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_loathe_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_loathe_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_mirror_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_mirror_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_mirror_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_灵魂法师_mirror_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_penance_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_penance_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_penance_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_penance_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_silence_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_silence_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_silence_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_silence_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_word_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_word_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_word_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_牧师_word_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_erode_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_erode_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_erode_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_erode_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_light_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_light_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_light_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_light_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_trust_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_trust_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_trust_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_盗贼_trust_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_blaze_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_blaze_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_blaze_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_blaze_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_lonely_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_lonely_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_lonely_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_lonely_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_rust_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_rust_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_rust_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_骑士_rust_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_rebound_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_rebound_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_rebound_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_rebound_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_thirst_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_thirst_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_thirst_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_thirst_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_tower_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_tower_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_tower_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57b_魔法师_tower_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_auction_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_auction_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_auction_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_gold_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_gold_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_gold_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_way_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_way_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_商人_way_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_banner_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_banner_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_banner_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_wall_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_wall_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_wall_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_weapon_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_weapon_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_战士_weapon_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_forge_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_forge_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_forge_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_gear_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_gear_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_gear_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_touch_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_touch_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_术士_touch_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_hunt_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_hunt_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_hunt_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_roam_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_roam_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_roam_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_ward_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_ward_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_游侠_ward_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_chain_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_chain_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_chain_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_key_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_key_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_key_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_lamp_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_lamp_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_灵魂法师_lamp_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_judge_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_judge_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_judge_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_mercy_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_mercy_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_mercy_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_war_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_war_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_牧师_war_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_ear_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_ear_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_ear_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_night_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_night_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_night_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_shadow_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_shadow_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_盗贼_shadow_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_blade_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_blade_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_blade_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_oath_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_oath_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_oath_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_walk_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_walk_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_骑士_walk_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_door_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_door_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_door_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_echo_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_echo_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_echo_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_fire_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_fire_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57f_魔法师_fire_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_4":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_4a":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_商人_4b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_4":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_4a":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_战士_4b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_4":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_4a":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_术士_4b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_4":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_4a":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_游侠_4b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_4":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_4a":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_灵魂法师_4b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_4":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_4a":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_牧师_4b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_4":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_4a":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_盗贼_4b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_4":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_4a":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_骑士_4b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_4":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_4a":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57l_魔法师_4b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_honest_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_honest_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_honest_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_honest_3a":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_honest_3b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_neutral_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_neutral_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_neutral_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_spec_1":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_spec_2":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_spec_3":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_spec_3a":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_商人_fac_trade_spec_3b":{"arc":"arc_job_商人","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_conq_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_conq_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_conq_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_conq_3a":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_conq_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_glory_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_glory_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_glory_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_glory_3a":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_glory_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_guard_1":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_guard_2":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_guard_3":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_guard_3a":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_战士_fac_war_guard_3b":{"arc":"arc_job_战士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_alc_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_alc_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_alc_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_alc_3a":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_alc_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_create_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_create_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_create_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_create_3a":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_create_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_rune_1":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_rune_2":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_rune_3":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_rune_3a":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_术士_fac_smith_rune_3b":{"arc":"arc_job_术士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_hunt_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_hunt_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_hunt_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_hunt_3a":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_hunt_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_symb_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_symb_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_symb_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_symb_3a":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_symb_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_ward_1":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_ward_2":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_ward_3":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_ward_3a":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_游侠_fac_ranger_ward_3b":{"arc":"arc_job_游侠","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_ferry_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_ferry_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_ferry_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_ferry_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_leave_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_leave_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_leave_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_leave_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_watch_1":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_watch_2":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_watch_3":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_watch_3a":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_灵魂法师_fac_soul_watch_3b":{"arc":"arc_job_灵魂法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_ascetic_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_ascetic_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_ascetic_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_ascetic_3a":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_ascetic_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_dogma_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_dogma_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_dogma_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_dogma_3a":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_dogma_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_doubt_1":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_doubt_2":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_doubt_3":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_doubt_3a":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_牧师_fac_priest_doubt_3b":{"arc":"arc_job_牧师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_free_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_free_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_free_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_free_3a":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_free_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_oath_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_oath_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_oath_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_oath_3a":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_oath_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_xia_1":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_xia_2":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_xia_3":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_xia_3a":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_盗贼_fac_thief_xia_3b":{"arc":"arc_job_盗贼","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_crusade_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_crusade_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_crusade_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_crusade_3a":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_crusade_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_free_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_free_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_free_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_free_3a":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_free_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_oath_1":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_oath_2":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_oath_3":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_oath_3a":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_骑士_fac_knight_oath_3b":{"arc":"arc_job_骑士","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_keep_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_keep_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_keep_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_keep_3a":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_keep_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_open_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_open_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_open_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_open_3a":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_open_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_tabu_1":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_tabu_2":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_tabu_3":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_tabu_3a":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v57q_魔法师_fac_mage_tabu_3b":{"arc":"arc_job_魔法师","vol":"vol_academy","act":"act2","ch":null,"type":"career"},"v652_captive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_captive_join":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_captive_kill":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_captive_ransom":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_ambush":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_ambush_fight":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_ambush_hold":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_burn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_burn_give":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_burn_guard":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_fall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_fall_fight":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_fall_retreat":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_fall_surrender":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_plague":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_plague_iso":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_plague_tough":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_sortie":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_sortie_hold":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_sortie_out":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_traitor":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_traitor_burn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_def_traitor_plan":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_avoid":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_challenge":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_fight":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_lose":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_sub":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_duel_win":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_gen_recruit_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_general_panel_node":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_general_recruit_node":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_legend_rank":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_end_loot":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_end_spare":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_end_take":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_loot":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_prep":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_prep_catapult":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_prep_ladder":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_prep_ram":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_spare":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_storm":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_siege_take":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_desert":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_jealous":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_jealous_drink":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_jealous_ignore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_mentor":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_praise":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_rival":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_stand_wound_care":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v652_war_return2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_arms":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_assassin":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_deny":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_escort":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_finish":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_garrison":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_intel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_kill":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_list":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_raid":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_rescue":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_ruin":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_bounty_scout":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_deal_hoard":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_deal_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_deal_relief":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_deal_sell_arms":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_karma_black":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_karma_orphan":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_karma_refugee":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_karma_revenge":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_orphan1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_orphan2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_orphan3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_refugee1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_refugee2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_refugee3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_ruin1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_ruin2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_ruin3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_veteran1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_veteran2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_pt_veteran3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_scar_church":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_scar_face":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v653_scar_veteran_talk":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_action_burn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_action_duel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_action_raid":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_action_scout":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_ambush":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_arrive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_betray":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_march":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_ally_negotiate":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_captive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_die":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_flee":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_join":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_defeat_ransom":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_burn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_city":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_cut":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_fall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_push":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_reinforce":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_front_stall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_attrition":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_burn":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_capital":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_conquer":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_slay":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_goal_starve":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_arrive":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_bond":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_debt":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_delay":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_repar_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_strategy_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_cede":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_marry":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_negotiate":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_offer":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_rep":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_sign":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_tear":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v654_treaty_white":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_join":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_mediator":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_mediator_fail":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_mediator_ok":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_notice":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_debt_war":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_map_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_accept":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_break":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_next":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_roll":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v655_negotiate_white":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_apply":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_courage":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_courses":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_logistics":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_sandtable":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_acad_strategy":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_clash1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_clash2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_clash3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_formation":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_prep":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_battle_pursue":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_camp":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_camp_guard":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_camp_march":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_camp_patrol":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_camp_train":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_career":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_cmd_appoint":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_cmd_duel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_cmd_event1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_cmd_event2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_cmd_event3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_fall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_help":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_jealous":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_jealous_drink":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_jealous_ignore":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_share":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_comrade_view":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_blackmarket":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_blackmarket_buy":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_blackmarket_tell":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_deserter":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_deserter_catch":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_deserter_let":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_martial":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_martial_plea":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_martial_silent":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_pray":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_pray_ghost":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_evt_pray_human":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_grudge_revenge":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_grudge_tavern":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_join":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_join_academy":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_join_church":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_join_free":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_join_north":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_fort1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_fort2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_fort3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_fort4":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_fort5":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_hall":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_rift1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_rift2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_rift3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_rift4":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_rift5":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_snow1":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_snow2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_snow3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_snow4":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_legend_snow5":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_assassin":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_done_assassin":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_done_assassin_kill":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_done_escort":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_done_guard":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_done_siege":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_escort":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_ex_armor":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_ex_intel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_ex_scroll":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_ex_title":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_exchange":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_guard":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_merc_siege":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_myunit_node":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_orphan":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_orphan2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_refugee":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_refugee2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_ruin":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_ruin2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_veteran":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_veteran2":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_veteran3":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_scar_view":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_unit_panel":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_unit_recruit":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_unit_rest":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v65_unit_supply":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"v66_bridge_t1":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_bridge_t2":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_bridge_t3":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_cast_gate":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_cast_tavern":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_cast_warroom":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_evt_r1":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_evt_r2":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_evt_r3":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_archive":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_stele":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_storyteller":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t1":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t2":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t3":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t4":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t5":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t6":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t7":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_lore_t8":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_news_panel":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_obs_camp":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_obs_city":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_obs_road":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_ripple_battle":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_ripple_fall":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_ripple_plague":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_ripple_siege":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_rumor_board":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"v66_war_report":{"arc":"arc_classmate","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"vacation_friends":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"vacation_home":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"vacation_research":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"vacation_travel":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"vacation_work":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"w64_dis_leave":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_dis_loot":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_dis_rescue":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_dis_respond":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_dis_study":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_election_act_open":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_act_strict":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_give_open":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_give_strict":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_goal":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_leave":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_lobby_open":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_lobby_strict":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_election_node":{"arc":"arc_fac_church","vol":"vol_church","act":"act2","ch":null,"type":"faction"},"w64_goal_node":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_goal_pledge_dis":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_goal_pledge_ele":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_goal_pledge_war":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_sit_done":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_sit_node":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_aftermath":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_join":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_observe":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_return":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_sideA":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"w64_war_sideB":{"arc":"arc_war","vol":"vol_war","act":"act3","ch":null,"type":"main"},"wait_1day":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"wait_1period":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"wait_until_night":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_choose":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_detail":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_factions":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_impact":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_missions":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_outbreak":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"war_outcome":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_academy_test":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_aurelian_meet":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_final_choice":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_history":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_intro":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_invitation":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_mission_outcome":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_missions":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_origin_truth":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_prologue_observe":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_schism":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watcher_seraph_clue":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"watcher_seraph_truth":{"arc":"arc_watchmen","vol":"vol_academy","act":"act2","ch":null,"type":"main"},"watchers_offer":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"watchers_reveal":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"west_academy_archive":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_academy_gate":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_academy_hall":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_2":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_3":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_boss":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_face":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_fight":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_flee":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_more":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_cliff_rescue":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_exchange":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_forge":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_fort":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_fort_market":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_fort_more":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_fort_walk":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_fort_watch":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_garrison":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_governor":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_hub":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_leave":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ledger":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_market":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_mist_1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_mist_2":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_mist_3":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_oldcrow_story":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_port_1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger2":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger3":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger4":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger_academy":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger_fight":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger_more":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger_talk":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_ranger_tavern":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_return":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_sea_journey":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_smuggle_1":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_smuggle_2":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_smuggle_3":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_storm_core":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_storm_observatory":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_tavern":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_warehouse":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_well":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"west_white_cliff":{"arc":"arc_fac_wt","vol":"vol_war","act":"act3","ch":null,"type":"faction"},"world_academy":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_assassin":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_bandit":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_blizzard":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_caravan":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_continue":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_dragon":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_drought":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_embargo":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_gen_intro":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_gen_result":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_gen_seed":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_grain":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_guildwar":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_hstorm":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_map_generic":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_meteor":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_mine":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_news":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_noble":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_orc":{"arc":"arc_orc","vol":"vol_race","act":"act3","ch":null,"type":"main"},"world_papacy":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_plague":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_purge":{"arc":"arc_purge","vol":"vol_church","act":"act2","ch":"ch_church_purge","type":"main"},"world_ruins":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_seal":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_sect":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_sflood":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"world_silver":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":"ch_north_silver","type":"main"},"world_silverbank":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_accept":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm_camp":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm_feature":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm_recruit":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm_story":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_arm_wound":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_carl":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_crowloc":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_inquire":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_silverroad_silvermoon":{"arc":"arc_silver","vol":"vol_north","act":"act2","ch":null,"type":"main"},"world_spring":{"arc":"arc_fac_free","vol":"vol_free","act":"act1","ch":null,"type":"faction"},"worldtree_guardian":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"worldtree_help":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"worldtree_sick":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"worldtree_sit":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"worldtree_touch":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"xueshu_after":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"xueshu_bookshop":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"xueshu_mill":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"xueshu_truth":{"arc":null,"vol":null,"act":null,"ch":null,"type":null},"sp8_ranger_00":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_00b":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_00c":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_01":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_02":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_03":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_03x":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_04":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_04q":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_05":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_06":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_07":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_08":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_09":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_09b":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_10":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_11a":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_11b":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_12":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_12q":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_13":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_14":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_15":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_16":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_17":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_17b":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_18":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"sp8_ranger_18b":{arc:"arc_west_ranger",vol:"vol_war",act:"act3",ch:"ch_war_west",type:"branch"},"goal_intro_wealth":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_wealth_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_wealth_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_wealth_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_might":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_might_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_might_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_might_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_guard":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_guard_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_guard_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_guard_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_truth":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_truth_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_truth_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_truth_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_free":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_free_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_free_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_free_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_god":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_god_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_god_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_god_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_fame":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_fame_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_fame_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_fame_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_intro_revenge":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_revenge_1":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_revenge_2":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"goal_revenge_3":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_lodging":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_night":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_morning":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_innkeep":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_barkeep":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_li_steward":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_job":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_box":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_box_a":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_box_b":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_box_c":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_choice":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_ideal_hub":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_road_north":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_road_west":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_road_desert":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"fc_road_east":{arc:null,vol:"vol_free",act:"act1",ch:"ch_free_jiaohui",type:"branch"},"origin_expand_north_1":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_2":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_3":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_4":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_5":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_6":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_7":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_north_8":{arc:"arc_origin",vol:"vol_north",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_1":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_2":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_3":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_4":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_5":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_6":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_7":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_south_8":{arc:"arc_origin",vol:"vol_south",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_1":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_2":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_3":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_4":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_5":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_6":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_7":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_church_8":{arc:"arc_origin",vol:"vol_church",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_1":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_2":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_3":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_4":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_5":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_6":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_7":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_elf_8":{arc:"arc_origin",vol:"vol_elf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_1":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_2":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_3":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_4":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_5":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_6":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_7":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_dwarf_8":{arc:"arc_origin",vol:"vol_dwarf",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_1":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_2":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_3":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_4":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_5":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_6":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_7":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_orc_8":{arc:"arc_origin",vol:"vol_orc",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_1":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_2":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_3":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_4":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_5":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_6":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_7":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"},"origin_expand_east_8":{arc:"arc_origin",vol:"vol_east",act:"act1",ch:"ch_origin",type:"main"}},
  "acad_road_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_road_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_road_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_road_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_road_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_dorm": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_friend": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_mid": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_dorm": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_friend": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_mid": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_dorm": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_friend": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_mid": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_dorm": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_friend": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_mid": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y5_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y5_dorm": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y5_friend": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y5_mid": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y5_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y1_holiday": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y2_holiday": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y3_holiday": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_life_y4_holiday": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_event_y1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_event_y2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_event_y3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_event_y4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_event_y5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_people_hub": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_cecy_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_cecy_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_cecy_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_cecy_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mori_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mori_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mori_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mori_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_elena_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_elena_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_elena_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_elena_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_tie_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_tie_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_tie_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_tie_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_kain_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_alice_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_loca_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_ata_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_hub": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_mercury": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_mercury_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_gora": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_gora_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_theresa": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_theresa_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_moritz": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_mentor_moritz_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_forbidden_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_forbidden_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_forbidden_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_forbidden_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_archives": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_tutor": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_class": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_practice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_library": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_town": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_market": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y1_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_class": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_practice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_library": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_town": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_market": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y2_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_class": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_practice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_library": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_town": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_market": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y3_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_class": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_practice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_library": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_town": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_market": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y4_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_class": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_practice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_library": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_town": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_market": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_y5_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_outside_hub": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_6": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_7": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_letter_8": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_war_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_war_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_war_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_war_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_war_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_desert": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_west": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_church": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_east": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_elf": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_visit_dwarf": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_6": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_7": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_8": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_9": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_10": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_11": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_home_12": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_trade_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_trade_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_trade_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_trade_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_social_hub": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_6": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_7": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_roommate_8": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_peer_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_peer_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_peer_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_peer_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_kain_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_kain_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_ata_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_ata_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_alice_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_alice_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_loka_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_deep_loka_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_squad_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_squad_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_squad_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_squad_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_squad_5": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_library_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_library_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_library_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_library_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_canteen_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_canteen_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_canteen_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_canteen_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_festival_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_festival_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_festival_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_festival_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_hometown_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_hometown_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_hometown_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_apothecary_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_apothecary_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_apothecary_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_apothecary_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_spar_1": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_spar_2": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_spar_3": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_spar_4": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_hub": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y1_meditate": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y1_control": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y1_pool": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y1_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y2_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y2_element": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y2_surge": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y2_recover": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y3_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y3_wargame": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y3_seal": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y3_final": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y4_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y4_erupt": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y4_quiet": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y4_last": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y5_open": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y5_ferman": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y5_choice": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_y5_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_magic_hub_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_festival": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_lamp_night": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_hunter": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_vault": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_vault_clue": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_vault_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_duel": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_duel_after": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_inquisitor": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_inquisitor_after": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_fire": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_fire_after": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_ghost": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_honor": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_alchemy": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_oldman": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_graveyard": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_wolf": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_farewell": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "acad_story_end": {tag:"main", vol:"vol_academy", arc:"arc_academy", pace:"normal"},
  "fc_road_north_road": {tag:"main", vol:"vol_freecity", arc:"arc_prologue", pace:"normal"},
  "fc_road_west_road": {tag:"main", vol:"vol_freecity", arc:"arc_prologue", pace:"normal"},
  "fc_road_desert_road": {tag:"main", vol:"vol_freecity", arc:"arc_prologue", pace:"normal"},
  "fc_road_east_road": {tag:"main", vol:"vol_freecity", arc:"arc_prologue", pace:"normal"},
  "frontier_entry": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_gate": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_gate_army": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_gate_trade": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_gate_roam": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_barracks": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_sergeant": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_city": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tower_gate": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_old_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_old_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_old_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_old_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_old_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_gate": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_armory": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_infirmary": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_camp": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_snow": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_herald": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_leave": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_6": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_7": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_8": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_8b": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_1b": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_1c": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_6": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_7": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_8": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_tie_8b": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_key_hint_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_key_hint_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_key_hint_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_key_hint_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_after_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_seal_after_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_refugee_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_refugee_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_refugee_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_refugee_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_refugee_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_medic_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_medic_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_medic_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_medic_4": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_medic_5": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_fight_1": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_fight_2": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_bell_fight_3": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"},
  "frontier_mine_combat_after": {tag:"main", vol:"vol_north", arc:"arc_frontier", pace:"normal"}




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
