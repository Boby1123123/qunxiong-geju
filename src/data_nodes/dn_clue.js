/* ===== /v93n3:clue/ N-3 贯穿线索账（纯数据；图鉴"线索"页 + 结局回响共用） =====
 * CLUE_TRACKS：三条贯穿大陆的线索；probes 为关键 flag（命中越多线索进度越高）
 * ENDING_ECHO：结局节点渲染时，按玩家最近抉择回引 1-2 句（只读注入）
 */
window.CLUE_TRACKS = [
  {
    id:"clue_book", name:"旧书的下落", icon:"书",
    desc:"有人在找一本旧书，出的价够买一条街。从自由城的酒馆到学院的禁书区，这本书的影子一直贴着你的后背走。",
    probes:[
      {flag:"acad_life_y3_course", txt:"你选修过费尔曼的《古代封印史》"},
      {flag:"acad_ferman_pact", txt:"你答应过费尔曼，那张图纸将来用得着"},
      {flag:"acad_life_y4_final", txt:"你接过笔，写下了那篇论文"},
      {flag:"acad_ferman_pact", txt:"你答应过费尔曼，那张图纸将来用得着"},
      {flag:"acad_life_y4_course", txt:"你选了毕业论文的封印专题"},
      {flag:"t_t_academy_bound_done", txt:"你把'知识的边界'想成了心念"},
      {flag:"t_t_chen_old_done", txt:"旧书的下落，指向晨天故都的灰"},
      {flag:"t_t_free_city_done", txt:"自由城的规矩告诉你：书比刀值钱"},
      {flag:"t_t_church_logic_done", txt:"你读懂了审判的纹路——有些书不是不该读，是不能让人知道你读过"},
      {flag:"f_failrep_cove_done", txt:"蒙羞者的集会里，有人提过那本书"},
      {flag:"t_t_seal_danger_done", txt:"深渊的呼吸告诉你：那本书里写着封印的旧账"}
    ]
  },
  {
    id:"clue_eye", name:"深渊之眼", icon:"眼",
    desc:"第七节点是深渊留在这片大陆上的一只眼睛，眼皮已经掀开。谁想封住它，谁想唤醒它，还有谁想把它挖出来——学院里的每一扇门后都站着一种答案。",
    probes:[
      {flag:"acad_ferman_pact", txt:"你成了那个“会闭嘴的人”"},
      {flag:"acad_life_y4_mid", txt:"那一夜，禁书区的灯亮到天明"},
      {flag:"led_anchor_01", txt:"你拿起了第一枚锚"},
      {flag:"led_anchor_07", txt:"七锚在你掌心汇齐"},
      {flag:"t_t_seal_danger_done", txt:"你记住了深渊呼吸的节拍"},
      {flag:"t_t_anchor_true_done", txt:"你悟出七锚不是锁，是门闩"},
      {flag:"t_t_oracle_meaning_done", txt:"神谕的解法让你明白：深渊的事，问神不如问自己"},
      {flag:"t_t_war_view_done", txt:"战争的账本上，有深渊一笔"},
      {flag:"f_failpath_warwall_liu", txt:"你在前线见过地缝里的光"},
      {flag:"anchor_1", txt:"你亲手拿起过第一枚锚"}
    ]
  },
  {
    id:"clue_goldscale", name:"金秤与晨天", icon:"秤",
    desc:"守门人世家、故都地下的档案、墓园里三代人的守望。金秤这两个字，从老人的口中传到你的耳朵里，越来越重。",
    probes:[
      {flag:"goldscale_know", txt:"你知道了金秤的来历"},
      {flag:"goldscale_final", txt:"你站在了使命的抉择前"},
      {flag:"led_b5_07", txt:"你赴了秦策之约"},
      {flag:"led_anchor_03", txt:"你在无字碑前停过脚"},
      {flag:"t_t_goldscale_guard_done", txt:"你把'金秤守门人'想成了心念"},
      {flag:"t_t_chen_old_done", txt:"晨天故都的灰在你心里落了地"},
      {flag:"goldscale_seen", txt:"你见过金先生擦碟子的那双守门人的手"},
      {flag:"t_t_anchor_true_done", txt:"你悟出金秤守着的是七锚"},
      {flag:"t_t_church_logic_done", txt:"你读懂了审判的纹路——金秤避开的，是圣城的眼睛"},
      {flag:"t_t_east_order_done", txt:"你数过承天城官署的台阶，想起故都的档案"}
    ]
  }
];

/* 结局回响映射：S.choices 尾部命中前缀则注入回顾句 */
window.ENDING_ECHO = [
  {pre:"acad_", txt:"你想起学院里那几年：走廊尽头的门、禁书区的灯、费尔曼在窗边写字的背影。如今灯都熄了，路是你自己走完的。"},
  {pre:"frontier_", txt:"你想起第三哨的雪，老铁失踪那夜留在地上的脚印，还有铜钟在风里震出来的嗡鸣。"},
  {pre:"anchor_", txt:"你想起七枚锚先后在掌心发烫的温度。最后那一枚落定的时候，整片大陆的地脉跟着颤了一下。"},
  {pre:"grad_", txt:"你想起毕业那天，四面的路在脚下摊开。你选了现在这条，走了这么远，回头还能看见当初那个站在路口的人。"},
  {pre:"faction_", txt:"你想起自己站进那面旗帜下的那一天。旗子换了颜色，可你扛过的每一仗，都还压在这双肩上。"},
  {pre:"warphase_", txt:"你想起战争从摩擦到围城、从围城到终战的每一步。地图上的红圈越来越多，最后盖住了整块大陆。"},
  {pre:"fc_", txt:"你想起自由城那间酒馆的麦酒味，蜜尔娜擦杯子的姿势，还有你在那张桌子前做过的最初的决定。"},
  {pre:"origin_", txt:"你想起离开故乡那天的天气。那时的你还不知道，这条路会把你带到今天这个位置。"}
];

/* ===== /v93l:assembly/ L 工程 线索拼合（超大型剧情八工程 · 工程 L） =====
 * 拼合枢纽：按三条线索的命中数量给不同正文（0-3 茫然 / 4-7 隐约 / 全齐真相大白）
 * 命中数 ≥7 时置 flag clue_assembled（引擎检测，只读+独立 flag）
 * NPC 按线索进度给不同回应（v93l_npcClue 注入）
 */
window.v93l_clueCount = function(chainId){
  try{
    var chain = null;
    for(var i=0;i<(window.CLUE_TRACKS||[]).length;i++){ if(window.CLUE_TRACKS[i].id===chainId){ chain = window.CLUE_TRACKS[i]; break; } }
    if(!chain) return 0;
    var n = 0;
    for(var j=0;j<(chain.probes||[]).length;j++){ if(S.flags && S.flags[chain.probes[j].flag]) n++; }
    return n;
  }catch(e){ return 0; }
};

window.v93l_assemblyText = function(chainId){
  var n = window.v93l_clueCount(chainId);
  var name = "";
  for(var i=0;i<(window.CLUE_TRACKS||[]).length;i++){ if(window.CLUE_TRACKS[i].id===chainId) name = window.CLUE_TRACKS[i].name; }
  var pct = Math.min(10, n);
  var bar = "█".repeat(pct) + "░".repeat(10-pct);
  var txt;
  if(n <= 3) txt = "你摊开记下的只言片语，怎么也拼不成一张整图。字与字之间隔着太多没走过的路。";
  else if(n <= 7) txt = "碎片开始咬合。你隐约看见一条脊线——那些零散的名字、地点、年月，渐渐指向同一个方向。";
  else txt = "你在心里把那根线彻底扯直了。『" + name + "』的真相在眼前摊开，完整、冰冷、不容置疑。";
  if(n >= 7 && (!S.flags)) S.flags = {};
  if(n >= 7) S.flags["clue_assembled"] = true;
  return "【线索拼合 · " + name + "】" + bar + " " + n + "/" + (window.CLUE_TRACKS&&window.CLUE_TRACKS[0]?10:10) + "\n" + txt;
};

/* 拼合枢纽节点正文动态化（渲染钩子：curNode 为拼合节点时替换首段） */
window.v93l_assemblyLine = function(node){
  try{
    if(!node || !node.id) return null;
    var m = /^clue_assembly_(\w+)$/.exec(node.id);
    if(!m) return null;
    var chainId = m[1] === "book" ? "clue_book" : (m[1] === "eye" ? "clue_eye" : "clue_goldscale");
    return [window.v93l_assemblyText(chainId)];
  }catch(e){ return null; }
};

/* NPC 按线索进度回应（只读；关键人物场景注入 1 句） */
window.v93l_npcClue = function(node){
  try{
    if(!S || !S.flags || !node || !node.place) return null;
    var pl = String(node.place);
    var nTotal = window.v93l_clueCount("clue_book") + window.v93l_clueCount("clue_eye") + window.v93l_clueCount("clue_goldscale");
    if(nTotal < 6) return null;
    if(!window.__l1done) window.__l1done = {};
    var key = pl;
    if(window.__l1done[key]) return null;
    var lines = [];
    if(pl.indexOf("费尔曼") >= 0 || pl.indexOf("图书馆") >= 0 || pl.indexOf("禁书") >= 0){
      lines.push("费尔曼看了你一眼，忽然说：『你好像比上次来的时候，多知道了一些事。』");
    }
    if(pl.indexOf("晨天") >= 0 || pl.indexOf("承天") >= 0){
      lines.push("老档案员把一册账本推到你面前：『听说你在找一根线。这根线，故都地下也有。』");
    }
    if(pl.indexOf("兽人") >= 0 || pl.indexOf("神谕") >= 0 || pl.indexOf("草原") >= 0){
      lines.push("灰鬃盯着你看了许久：『你眼里的东西，比去年多了。好，跟着来。』");
    }
    if(lines.length){
      window.__l1done[key] = 1;
      return lines;
    }
    return null;
  }catch(e){ return null; }
};

/* 三个拼合枢纽节点（tag:main；正文由 v93l_assemblyLine 动态注入；出口按 clue_assembled 变体） */
N["clue_assembly_book"] = {
  tag:"main", place:"学院 · 禁书区 · 尘封的阅览桌", where:"黑夜", pace:"deep",
  text:[
    "禁书区最深处的阅览桌上摊着一册没封皮的书。你坐下，把这几年记下的碎片一页页铺开——费尔曼讲过的话、论文里划掉的句子、图书馆火灾那夜谁都没提的角落。",
    "灯芯爆了一下。你忽然发现，那些碎片不是散落的，它们一直在等一个人把它们拼起来。"
  ],
  options:[
    {t:"（继续前行，把拼好的线索带走）", go:"north_library"},
    {t:"（如果你已拼合出真相——把结论写进论文附录）", ifFlag:{clue_assembled:{go:"acad_life_y4_final"}}}
  ]
};
N["clue_assembly_eye"] = {
  tag:"main", place:"第三哨 · 铜钟楼 · 风雪中的观察位", where:"黑夜", pace:"deep",
  text:[
    "铜钟在风里低鸣。你站在观察位上，把矿洞里带出的旧物、地缝里见过的光、封印松动那晚的震颤一件件摆上窗台。",
    "雪扑进来，落在那些物件上。你忽然看清它们之间的关系——像看一幅被雪水洇开的旧地图。"
  ],
  options:[
    {t:"（把线索收进怀里，走下钟楼）", go:"frontier_city"},
    {t:"（如果你已拼合出真相——连夜去找守钟老卒）", ifFlag:{clue_assembled:{go:"frontier_old_5"}}}
  ]
};
N["clue_assembly_goldscale"] = {
  tag:"main", place:"承天城 · 老官署地窖 · 故都档案架前", where:"任意", pace:"deep",
  text:[
    "故都档案架的灰尘里，你找到半册没来得及烧掉的册子。册页之间夹着干枯的草茎、半枚纽扣、一张写着字的纸边。",
    "你把它们和金秤的名字排在一起，烛火晃了晃——册子上那个被墨涂掉的名字，笔画之间，正是『金』字。"
  ],
  options:[
    {t:"（合上册子，走出地窖）", go:"east_silver"},
    {t:"（如果你已拼合出真相——带着册子去找秦策之约的引路人）", ifFlag:{clue_assembled:{go:"east_silver"}}}
  ]
};
