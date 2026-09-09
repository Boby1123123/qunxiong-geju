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
