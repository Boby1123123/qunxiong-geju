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
   text:["北边的战报又到了：铁门关外，东军的营帐又多了三座。守军连着打了七天，军旗换了三面。"]},
  {id:"w_purge_widen", force:"church", day:80, title:"净化令扩大", prefixes:["holy_","church_","city_holy"],
   text:["圣城的净化令又添了新条文。城里开始有人连夜搬家，白袍执事走街串巷，敲门的声音越来越重。"]},
  {id:"w_guild_route", force:"guild", day:100, title:"银穗商路受阻", prefixes:["h_trade_","city_free","south_"],
   text:["银穗商路出了岔子：一队货在峡谷口被人劫了，押货的伙计死了三个。几家大商号连夜改了道。"]},
  {id:"w_orc_south", force:"orc", day:130, title:"兽人南下", prefixes:["h_faction_orc","city_orc","north_"],
   text:["草原上的狼旗往南挪了。边境的村子开始加固围栏，夜里点三堆火，是求援的信号。"]},
  {id:"w_elf_rumor", force:"elf", day:160, title:"银叶城的沉默", prefixes:["h_faction_elf","city_elf"],
   text:["银叶城闭门谢客的消息传到了人类的地界。商人们说，精灵的长老们已经连续三个月没有露面。"]},
  {id:"w_dwarf_forge", force:"dwarf", day:190, title:"铁峰堡的炉火", prefixes:["h_faction_dwarf","city_dwarf"],
   text:["铁峰堡的锻造声停了三天。有人说是矿道塌了，有人说是王座下的那口熔炉，出了古怪。"]},
  {id:"w_seal_loose", force:"watcher", day:220, title:"封印又松了一分", prefixes:["seal_","city_seal"],
   text:["守望者传出的消息：沙漠深处的那道封印，又松了一分。他们加派了人手，可人手总是不够。"]},
  {id:"w_eclipse_move", force:"eclipse", day:250, title:"暗处的人在动", prefixes:["eclipse_","h_dark_","h_underworld_"],
   text:["地下世界的风声变了。有人看见穿着深色袍子的人，在几个大城的暗巷里走动，像在找什么。"]},
  {id:"w_north_recap", force:"north", day:280, title:"铁门关的雪", prefixes:["h_faction_north","city_north"],
   text:["铁门关下了今冬第一场雪。守军说，雪落下来的时候，东军退了三十里。没人知道为什么。"]},
  {id:"w_church_split", force:"church", day:310, title:"圣城的分歧", prefixes:["holy_","church_","city_holy"],
   text:["圣城的枢机院起了争执。有人主张继续清剿，有人主张收手。钟声照常响，但敲钟人的手，在抖。"]},
  {id:"w_south_blockade", force:"south", day:340, title:"南方的封锁", prefixes:["south_","h_trade_","city_south"],
   text:["南方城邦封了三个港口。说是查验，可商船在港外排了半个月，也没等到查验的文书。"]},
  {id:"w_guild_warchest", force:"guild", day:370, title:"商会的赌注", prefixes:["h_trade_","city_free"],
   text:["自由商会的金库里，一夜之间调走了一大笔钱。账房先生们讳莫如深，只说是'往北边去'。"]},
  {id:"w_elf_door", force:"elf", day:400, title:"银叶城开门", prefixes:["h_faction_elf","city_elf"],
   text:["银叶城终于开了门。出来的使者只说了一句话：世界树在疼。说完，又关了门。"]},
  {id:"w_dwarf_strike", force:"dwarf", day:430, title:"铁峰堡的锤声", prefixes:["h_faction_dwarf","city_dwarf"],
   text:["铁峰堡的锻造声恢复了，但打的东西换了——全是铠甲和兵器。堡里的老人们，眉头越锁越紧。"]},
  {id:"w_abyss_grow", force:"eclipse", day:460, title:"深渊的影子", prefixes:["seal_","abyss_","city_seal"],
   text:["沙漠边缘的绿洲，一夜之间枯了三口井。老人说，是地下的东西，渴了。"]}
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
/*=====v47-eng-end=====*/