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
