/* /lwinj:data/ LW 活的世界模拟层 · 纯数据（只读；不改判定/存档语义）
   键：LW_DATA。供 window.LW_* 旁路模块读取。
   设计文档：docs/LW_活的世界模拟层_方向设计_20260912.md
   约束：势力/城市/NPC 与既有设定一致；不新增冲突设定；saveVersion=48 不变 */
window.LW_DATA = {
  /* 势力中文名与基线（与 S.infl 初始值一致；free 起步 10） */
  factions: {
    free:  {cn:"自由城邦", base:10, desc:"中立地带。法律宽松，金币至上。"},
    north: {cn:"北方公国联盟", base:0, desc:"七公国共治。冰原、铁甲与魔法学院。"},
    south: {cn:"南方商盟", base:0, desc:"五大城邦的钱邦。金币是唯一通用语。"},
    church:{cn:"光明教会", base:0, desc:"圣城神权国度。净化令的阴影。"},
    elf:   {cn:"精灵王国", base:0, desc:"幽闭森林。迷雾封锁三百年。"},
    dwarf: {cn:"矮人王国", base:0, desc:"山腹古国。熔炉不熄，矿脉渐枯。"},
    orc:   {cn:"兽人草原", base:0, desc:"游牧部族。黑石大汗正在崛起。"},
    east:  {cn:"东部王国", base:0, desc:"东端庞大帝国。铁门关外兵甲森森。"},
    abyss: {cn:"深渊教团", base:-40, desc:"潜伏的暗流。七印之下。"}
  },
  /* 势力状态机初值（稳定/备战/战争/衰落/重整/潜伏） */
  factionState: {
    free:"稳定", north:"备战", south:"稳定", church:"稳定",
    elf:"稳定", dwarf:"稳定", orc:"备战", east:"备战", abyss:"潜伏"
  },
  /* 城市默认归属（region 控制权；铁门关按设定已被东军据守） */
  cityOwn: {
    free:["jiaohui","jishi","gonghui","huigang"],
    north:["aierda","tiebi","beijing","kuangshan","hewan","senlin","haigang","disanshao"],
    south:["huangjin","moxie","xueshu","shangzhan","gangkou"],
    elf:["wangting"],
    dwarf:["wangdu"],
    orc:["heishi","shengshan"],
    east:["chengtian"],
    church:["shengcheng"],
    desert:["bianyuan","shendian","lvzhou","yiji","tuoduo"],
    west:["huangyuan","youxia","xingsheng"],
    special:{tieren:"east"}
  },
  /* 关键 NPC 日程（id -> 时段×地点；loc 用 region_city，符合 S.loc 格式）
     只覆盖 NPC_NET 已有角色（人设已知）；大势力角色日程留给内容作者按设定扩展 */
  npcSchedule: {
    rock: [
      {phase:"晨", loc:"free_jiaohui", text:"在城门口帮商队卸货，额角全是汗。"},
      {phase:"午", loc:"free_jishi", text:"蹲在集市口啃干粮，眼睛却盯着来往的兽人商队。"},
      {phase:"昏", loc:"free_gonghui", text:"在公会大厅外徘徊，想找人搭伙接活儿。"}
    ],
    kain: [
      {phase:"晨", loc:"north_tiebi", text:"在城墙上巡了一夜的班，眼下乌青。"},
      {phase:"午", loc:"north_tiebi", text:"在校场教新兵握矛。"},
      {phase:"昏", loc:"north_tiebi", text:"在军营账房里对着舆图发呆。"}
    ],
    alice: [
      {phase:"晨", loc:"north_aierda", text:"在法师塔的晨课里打瞌睡，火苗一跳一跳。"},
      {phase:"午", loc:"north_aierda", text:"在禁书区外被教授叫住盘问。"},
      {phase:"昏", loc:"north_aierda", text:"一个人在塔顶放火烧云玩。"}
    ],
    ata: [
      {phase:"晨", loc:"free_jiaohui", text:"在铁匠铺打听狼骨的消息。"},
      {phase:"午", loc:"free_gonghui", text:"接了个护送活计，正和人讨价还价。"},
      {phase:"昏", loc:"free_huigang", text:"在码头边望着北方的天出神。"}
    ],
    loka: [
      {phase:"晨", loc:"free_jishi", text:"在药铺后院翻晒草药。"},
      {phase:"午", loc:"free_jishi", text:"给学徒们讲‘这味药不能多放’。"},
      {phase:"昏", loc:"free_jiaohui", text:"在酒馆角落记药方，杯里的酒没动过。"}
    ],
    cecy: [
      {phase:"晨", loc:"east_chengtian", text:"在府邸花园里练习仪态，眉头却皱着。"},
      {phase:"午", loc:"east_chengtian", text:"在书院门口远远看男学生们争执。"},
      {phase:"昏", loc:"east_chengtian", text:"在窗边写信，写到一半又撕了。"}
    ],
    mori: [
      {phase:"晨", loc:"dwarf_wangdu", text:"在熔炉边拉风箱，脸被火映得通红。"},
      {phase:"午", loc:"dwarf_wangdu", text:"在铁砧上锻一枚戒指，边打边叹气。"},
      {phase:"昏", loc:"dwarf_wangdu", text:"在矿道口数今天出矿的筐数。"}
    ],
    elena: [
      {phase:"晨", loc:"elf_wangting", text:"在世界树下的溪边采草药。"},
      {phase:"午", loc:"elf_wangting", text:"给受伤的幼鹿缠绷带。"},
      {phase:"昏", loc:"free_jiaohui", text:"难得出了森林，在客栈替人治旧伤。"}
    ],
    tie: [
      {phase:"晨", loc:"east_tiemen", text:"在关城头擦拭那柄旧刀，刀鞘裂了也没换。"},
      {phase:"午", loc:"east_tiemen", text:"在城门洞里和换防的东军士兵说话，语气硬邦邦。"},
      {phase:"昏", loc:"east_tiemen", text:"对着南边的方向喝闷酒。"}
    ],
    ferman: [
      {phase:"晨", loc:"north_aierda", text:"在学院档案室核对一册旧书。"},
      {phase:"午", loc:"north_aierda", text:"在讲堂上讲‘魔法的边界’，板书写了一黑板。"},
      {phase:"昏", loc:"north_aierda", text:"在藏书塔的顶层点灯夜读。"}
    ],
    li: [
      {phase:"晨", loc:"free_huigang", text:"在码头盘账，算盘珠子拨得飞快。"},
      {phase:"午", loc:"free_huigang", text:"在商行里见客，笑脸迎人。"},
      {phase:"昏", loc:"free_huigang", text:"在仓库门口看着货船卸货，一言不发。"}
    ],
    tavern_owner: [
      {phase:"晨", loc:"free_jiaohui", text:"在客栈后院劈柴，袖子卷得老高。"},
      {phase:"午", loc:"free_jiaohui", text:"在柜台后擦杯子，顺便听客人们嚼舌根。"},
      {phase:"昏", loc:"free_jiaohui", text:"在灶间掌勺，喊小二端菜。"}
    ]
  },
  /* 五主线倒计时预热（主线事件前 N 天全图传闻；符合 WORLD_EVENTS 设定） */
  omens: [
    {ev:"purge",  before:3, text:"街上多了几个穿灰袍的人，逢人便问‘你听过圣痕司吗’。北境的风忽然紧了几分。"},
    {ev:"silver", before:3, text:"粮行的掌柜们连夜改了价牌，有商队索性把银穗商路的高价货收进了库。铁门关方向，尘土扬得老高。"},
    {ev:"seal",   before:3, text:"占星师们的灯一夜没熄。有人说地底传来哭声，有人说那是封印在打哈欠。"},
    {ev:"academy",before:3, text:"学院的访问学者们忽然都不露面了。门房说，禁书区的钥匙换了一把新的。"},
    {ev:"orc",    before:3, text:"北境的猎户说，草原上的狼群在往南跑。狼旗的影子，已经压到了地平线上。"}
  ],
  /* 回响锚点表（flag 变更 -> 世界回响；LW-A2 扩到 30 条：账本伏笔 10 + 主线账户 5 + 既有 flag 6 + 双面回响 5 + 首批 4）
     delay: 延迟天数（day+）；at: 地点条件；flip: 双面回响（登记同一条，触发时按 flip.flag 是否成立分支渲染） */
  echoMap: [
    {flag:"lw_help_harbor", echoId:"echo_harbor_debt", delay:6, at:"free_huigang", text:"码头上那个你帮过的水手，托人捎来一句话：欠你的人情，我记着。城东的货栈，有你的东西。"},
    {flag:"lw_betray_guild", echoId:"echo_guild_grudge", delay:8, at:"free_gonghui", text:"公会大厅里，你出卖过的那位佣兵长没有露面。他的旧部下看你的眼神，像淬过火。"},
    {flag:"lw_church_favor", echoId:"echo_church_eye", delay:5, at:"church_shengcheng", text:"圣城的告解室里，神父在你离开后翻开了一本灰皮册子，添了一笔。"},
    {flag:"lw_orc_truce", echoId:"echo_orc_whisper", delay:7, at:"orc_heishi", text:"黑石部族的营火边，有人压着嗓门说起你的名字，用的是敬语。"},
    /* LW-A2 账本伏笔转回响（10 条；flag 用 CAUSALITY_LEDGER plant 既有 flag） */
    {flag:"oracle_fake", echoId:"echo_oracle_ash", delay:9, at:"north_aierda", text:"占星塔的灰烬里，有人用指尖画了一只眼睛，正对着你常坐的位置。"},
    {flag:"khan_aware", echoId:"echo_khan_eye", delay:7, at:"orc_heishi", text:"黑石大汗的斥候混在人群里看了你很久，走时留下一个狼头骨做的记号。"},
    {flag:"spared_robber", echoId:"echo_robber_repay", delay:10, at:"free_huigang", text:"你放走的那伙人，把一件偷来的羊皮斗篷连夜挂在你住的客栈窗下，压着一块石头。"},
    {flag:"bandit_leader_killed", echoId:"echo_bandit_grudge", delay:8, at:"north_tiebi", text:"铁门关外新立了一块碑，碑上刻着盗贼头目的名字，底下还有一行小字——记住这张脸。"},
    {flag:"gave_all_to_refugees", echoId:"echo_refugee_altar", delay:11, at:"church_shengcheng", text:"圣城外的难民棚里，有人给你供了一盏油灯。灯芯是用你旧斗篷的线搓的。"},
    {flag:"father_truth_denied", echoId:"echo_father_ghost", delay:12, at:"north_tiebi", text:"铁门关老屋的锁孔里，塞着一封没写完的信。字迹到一半，像是被风停了笔。"},
    {flag:"prophecy_defied", echoId:"echo_prophecy_crack", delay:9, at:"north_aierda", text:"学院的占星镜上多了一道裂纹，从镜心一直裂到边框，像一句被抹掉的预言。"},
    {flag:"betrayed_classmate", echoId:"echo_classmate_gaze", delay:13, at:"north_aierda", text:"旧课室的角落还留着那个空位。每当有人推门，你总觉得有一道目光先你一步落下来。"},
    {flag:"aquan_liberated", echoId:"echo_aquan_people", delay:8, at:"north_hewan", text:"阿奎的渔民在船头刻了你的名字，用朱漆。他们说，等风平浪静的那天，要请你喝头一碗酒。"},
    {flag:"let_mercury_go", echoId:"echo_mercury_parting", delay:10, at:"free_huigang", text:"水银走的那天夜里，码头系缆桩上多了半块银币，缺的那半，正好嵌进你旧怀表的豁口。"},
    /* LW-A2 主线账户 flag 回响（5 条；五主线密档感知） */
    {flag:"purge_account", echoId:"echo_purge_account", delay:6, at:"church_shengcheng", text:"圣痕司的密档室里，你的卷宗比旁人的厚了三倍。有人夜里翻它，翻得很慢。"},
    {flag:"silver_account", echoId:"echo_silver_account", delay:7, at:"south_gangkou", text:"银穗商路的往来账册里，你的名字被红笔勾了又勾。掌柜们关起门来，谁也不肯先说。"},
    {flag:"seal_talisman", echoId:"echo_seal_talisman", delay:8, at:"desert_yiji", text:"你身上那道封印符咒，夜里会自己发烫。烫痕的位置，正好压着第一印的方向。"},
    {flag:"academy_vault", echoId:"echo_academy_vault", delay:9, at:"north_aierda", text:"学院地库的访客名册里，你那一页被人折了角。折角处，正对着你的名字。"},
    {flag:"orc_ledger", echoId:"echo_orc_ledger", delay:10, at:"orc_shengshan", text:"狼旗的萨满在皮卷上添了你的名字，蘸的是狼血。写完后，他把皮卷对着火烤了烤，字迹渗进皮里。"},
    /* LW-A2 既有 flag 回响（6 条；v92/v93 系列重大选择） */
    {flag:"watchmen_invited", echoId:"echo_watchmen_trust", delay:6, at:"free_jiaohui", text:"守夜人换班的火把，在你家门口停了一停。火光一闪，像是打了个招呼。"},
    {flag:"giant_helper", echoId:"echo_giant_wave", delay:12, at:"orc_heishi", text:"巨人氏族的孩子远远看见你，朝你挥了挥手，用的还是你教的那个手势。"},
    {flag:"seal3_queen_freed", echoId:"echo_seal_queen", delay:9, at:"desert_lvzhou", text:"绿洲的旅人说起第三印的女王——她在晨光里站了很久，最后朝南方点了点头。"},
    {flag:"thieves_guild_member", echoId:"echo_guild_badge", delay:7, at:"free_jishi", text:"公会的暗号换了新的一套，可集市口那个老伙计，还是先认出了你的步伐。"},
    {flag:"f_f2_heretic_ledger", echoId:"echo_heretic_book", delay:11, at:"church_shengcheng", text:"圣痕司的灰皮册子上，你的名字被人用炭笔圈了两道。圈痕很新，像是昨天才画的。"},
    {flag:"dragon_companion", echoId:"echo_dragon_wing", delay:8, at:"dwarf_wangdu", text:"龙裔同伴蹲在矮人王都的城墙上等你，鳞片映着晚霞，见你来了，先咧了咧嘴。"},
    /* LW-A2 双面回响（5 条；同一旧账，按后续选择分支报答/反噬） */
    {flag:"gold_scale_blacklisted", echoId:"echo_goldscale_ledger", delay:9, at:"free_huigang", text:"金秤家的账房远远看见你，把账本往怀里一拢，绕道走了。他记得你，也记得你欠的那笔账。", flip:{flag:"thieves_guild_member", text:"金秤家的账房远远看见你，脚步一顿，却还是拱了拱手。他听说你在公会里混出了名堂——这笔账，他要重新掂量掂量。"}},
    {flag:"east_wanted", echoId:"echo_east_wanted", delay:7, at:"north_tiebi", text:"铁门关的告示栏上贴着你的画像，画得不太像，可守关的兵卒还是一眼认出了你。", flip:{flag:"beijing_saved", text:"铁门关的告示栏上贴着你的画像。可你救过的那家北京城百姓，趁着换岗把告示撕了下来，卷成一卷塞进了怀里。"}},
    {flag:"council_support_purification", echoId:"echo_purge_ledger", delay:8, at:"church_shengcheng", text:"圣痕司的功劳簿上，你的名字被誊在头一页，用的是金漆。", flip:{flag:"council_oppose_purification", text:"圣痕司的功劳簿上本有你的名字，又被人拿刀刮掉了。刮痕很深，像是不肯忘记。"}},
    {flag:"floating_tower_blessed", echoId:"echo_tower_bless", delay:10, at:"north_aierda", text:"浮空塔顶的法师往你的旧物里放了一枚银叶书签——塔上的人，记得你的名字。", flip:{flag:"floating_tower_banished", text:"浮空塔的结界在你面前嗡地响了一声。塔门开着，可你知道，那扇门不是为你开的了。"}},
    {flag:"mercury_ally", echoId:"echo_mercury_ally", delay:9, at:"free_gonghui", text:"水银商会在码头给你留了一间房，钥匙放在窗台上，钥匙穗是新编的。", flip:{flag:"mercury_disappointed", text:"水银商会的伙计在码头见了你，话到嘴边又咽回去。他掌柜说过：这个人，不能再深交了。"}}
  ],
  /* 编年史世界册自动成册规则（LW-C1/C3；match 为可监控事件类型） */
  chronAuto: [
    { match:"season",    kind:"season",    tag:"季节", tpl:"时令入{season}。{line}" },
    { match:"mainEvent", kind:"main",      tag:"主线", tpl:"{cn}爆发——{text}" },
    { match:"cityOwner", kind:"war",       tag:"城市易主", tpl:"{city}落入{owner}之手。" },
    { match:"echo",      kind:"echo",      tag:"回响", tpl:"{text}" },
    { match:"omen",      kind:"omen",      tag:"传闻", tpl:"{text}" },
    { match:"festival",  kind:"festival",  tag:"节日", tpl:"今日{name}：{desc}" }
  ],
  /* 季节氛围句（advanceDays 换季时播报；V66 白描） */
  seasonLine: {
    "春":"河面的冰裂了，城里到处是潮湿的土腥气。",
    "夏":"白昼被拉得很长，蝉鸣从正午一直响到入夜。",
    "秋":"粮车把城门堵了个严实，空气里全是新麦的味道。",
    "冬":"呵气成霜。巡夜人的脚步声在空旷的街上格外清楚。"
  },
  /* 时段氛围句（进入新时段时播报） */
  phaseLine: {
    "晨":"天刚亮，城里的炊烟比城门开得还早。",
    "午":"日头正毒，集市上的吆喝声一阵高过一阵。",
    "昏":"暮色压下来，酒馆的灯一盏盏亮起。",
    "夜":"夜禁之后，街上只剩下巡夜人的梆子声。"
  },
  /* 战局模型（WARFRONTS）：首批 5 战场；atk/def ∈ factions；cities ∈ 城市表；
     goods = 该战场敏感商品（易主时物价偏移，联动 TRADE_GOODS/w64 市场） */
  warfronts: [
    { id:"wf_tiebigate", cn:"铁门关拉锯", atk:"east", def:"north",
      cities:["tiebi","beijing"], goods:["iron","weapon"],
      winAt:100, loseAt:-100, weight:1.0,
      desc:"东军与北方公国的拉锯，铁门关是咽喉。" },
    { id:"wf_silverroad", cn:"银穗商路", atk:"east", def:"south",
      cities:["shangzhan","gangkou"], goods:["grain","silk"],
      winAt:100, loseAt:-100, weight:0.8,
      desc:"东部王国提高银穗商路税收，商盟在备钱备粮。" },
    { id:"wf_abyss", cn:"封印七节点", atk:"abyss", def:"church",
      cities:["shengcheng","shendian","yiji"], goods:["book","potion"],
      winAt:100, loseAt:-100, weight:0.7,
      desc:"深渊教团在七处封印节点试探。教会圣战军枕戈待旦。" },
    { id:"wf_orc", cn:"北境狼旗", atk:"orc", def:"north",
      cities:["aierda","disanshao"], goods:["fur","iron"],
      winAt:100, loseAt:-100, weight:1.0,
      desc:"黑石大汗整合半数部族，狼旗南指。" },
    { id:"wf_purge", cn:"净化令", atk:"church", def:"free",
      cities:["jiaohui","jishi"], goods:["potion","book"],
      winAt:100, loseAt:-100, weight:0.6,
      desc:"圣痕司审判官在各城邦搜查奥术痕迹，自由城首当其冲。" }
  ],
  /* 战争事件模板（WAR_EVENTS）：玩家身处战区城市时按权重抽取触发；
     warDelta 偏移 warfront.progress；infl 影响势力关系；后果可促成城市易主 */
  warEvents: [
    { id:"we_besiege",  cls:"人祸", front:"wf_tiebigate", weight:30,
      text:"铁门关下，东军的营火连成一条火龙，围了三天三夜。城头的守军把滚油烧得冒烟，就等天亮那一仗。",
      warDelta:8, infl:{east:2,north:-2} },
    { id:"we_grain",    cls:"商机", front:"wf_silverroad", weight:25,
      text:"银穗商路上，三支粮队被拦在税卡外。粮价闻风而动，几个大掌柜连夜改了价牌，手都在抖。",
      warDelta:4, infl:{east:1,south:-1} },
    { id:"we_spy",      cls:"人祸", front:"wf_purge", weight:25,
      text:"自由城夜里抓了几个穿灰袍的探子。第二天一早，城门口贴出告示，悬赏翻了三倍。",
      warDelta:5, infl:{church:2,free:-2} },
    { id:"we_fire",     cls:"天灾", front:"wf_orc", weight:20,
      text:"北境的草场起了大火，烧了三天三夜。狼旗的先锋军绕过火场，从更北的荒原压了下来。",
      warDelta:6, infl:{orc:2,north:-2} },
    { id:"we_rite",     cls:"奇遇", front:"wf_abyss", weight:20,
      text:"圣辉城郊的封印节点夜里渗出了黑雾。教会的圣战军在雾外扎营，火把点了一整夜，没人敢靠近。",
      warDelta:6, infl:{abyss:2,church:-2} },
    { id:"we_siege_relief", cls:"人祸", front:"wf_tiebigate", weight:20,
      text:"北方公国的援军到了。铁门关的城门开了一条缝，送进去的粮车让守军的号子都喊得响了几分。",
      warDelta:-6, infl:{north:2,east:-2} },
    { id:"we_truce_rumor", cls:"商机", front:"wf_silverroad", weight:15,
      text:"商路上有人传，东部王国要放宽税则。消息没坐实，货价已经先软了两成。",
      warDelta:-4, infl:{south:1,east:-1} },
    { id:"we_defector", cls:"奇遇", front:"wf_purge", weight:15,
      text:"一个灰袍审判官深夜逃出圣城，浑身是伤。他说自己看见了不该看的东西——话没说完，人就没了声息。",
      warDelta:4, infl:{free:1,church:-1,abyss:1} }
  ]
};
