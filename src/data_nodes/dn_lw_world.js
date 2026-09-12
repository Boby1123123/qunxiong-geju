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
  /* 回响锚点表（flag 变更 -> 世界回响；首批示例，作者可扩展）
     delay: 延迟天数（day+）；at: 地点条件；after: 前置事件 id */
  echoMap: [
    {flag:"lw_help_harbor", echoId:"echo_harbor_debt", delay:6, at:"free_huigang", text:"码头上那个你帮过的水手，托人捎来一句话：欠你的人情，我记着。城东的货栈，有你的东西。"},
    {flag:"lw_betray_guild", echoId:"echo_guild_grudge", delay:8, at:"free_gonghui", text:"公会大厅里，你出卖过的那位佣兵长没有露面。他的旧部下看你的眼神，像淬过火。"},
    {flag:"lw_church_favor", echoId:"echo_church_eye", delay:5, at:"church_shengcheng", text:"圣城的告解室里，神父在你离开后翻开了一本灰皮册子，添了一笔。"},
    {flag:"lw_orc_truce", echoId:"echo_orc_whisper", delay:7, at:"orc_heishi", text:"黑石部族的营火边，有人压着嗓门说起你的名字，用的是敬语。"}
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
  }
};
