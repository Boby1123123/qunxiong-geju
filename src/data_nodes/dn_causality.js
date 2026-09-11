/* ===== /v91inj:ledger/ CM-3 因果/伏笔账本（纯数据；elda content causality 读取核销；不改引擎） =====

 * 字段：id / type(伏笔|设定|人物|地点|事件) / desc / plant(埋设锚点) / reap(回收锚点) / status(open|closed) / world(所属卷/域)

 * 锚点语法：flag:<flag名> = 该 flag 在 src 中被 effects 写入；node:<节点id> = 节点存在且被 go/then 引用；其余按关键词词频。

 */

window.CAUSALITY_LEDGER = [

  {

    "id": "led_01",

    "type": "设定",

    "desc": "金秤家族血脉与隐秘历史，贯穿全书的核心家族线",

    "plant": "金秤",

    "reap": "node:tm_negotiate",

    "status": "open",

    "world": "金秤线",

    "importance": 5,

    "keywords": [

      "金秤",

      "家族",

      "血脉"

    ],

    "irreversible": false

  },

  {

    "id": "led_02",

    "type": "设定",

    "desc": "晨天城为东境故都，地图标准中的东境中枢（BD-4 经 east_chengtian_old 故都线核销）",

    "plant": "晨天",

    "reap": "node:east_chengtian_old",

    "status": "closed",

    "world": "东境",

    "importance": 4,

    "keywords": [

      "晨天城",

      "东境",

      "故都"

    ],

    "irreversible": false

  },

  {

    "id": "led_03",

    "type": "人物",

    "desc": "鬃吼为兽王，兽人草原的最高意志",

    "plant": "鬃吼",

    "reap": "node:orc_deep_totem",

    "status": "open",

    "world": "兽人草原",

    "importance": 5,

    "keywords": [

      "鬃吼",

      "兽王"

    ],

    "irreversible": false

  },

  {

    "id": "led_04",

    "type": "人物",

    "desc": "腐光为暗蚀会首领，净化令阴影后的操盘者",

    "plant": "腐光",

    "reap": "node:tm_ruins",

    "status": "open",

    "world": "暗蚀线",

    "importance": 4,

    "keywords": [

      "腐光",

      "暗蚀会"

    ],

    "irreversible": false

  },

  {

    "id": "led_05",

    "type": "人物",

    "desc": "秦·长风，北境名将/东境系关键人物，铁门关对峙主角",

    "plant": "秦·长风",

    "reap": "node:tm_negotiate",

    "status": "open",

    "world": "铁门关",

    "importance": 4,

    "keywords": [

      "秦·长风",

      "铁门关"

    ],

    "irreversible": false

  },

  {

    "id": "led_06",

    "type": "设定",

    "desc": "七枚锚，精灵与矮人共守的古老封印体系",

    "plant": "七枚锚",

    "reap": "node:elf_deep_council",

    "status": "open",

    "world": "精灵线",

    "importance": 5,

    "keywords": [

      "七锚",

      "封印"

    ],

    "irreversible": false

  },

  {

    "id": "led_07",

    "type": "道具",

    "desc": "铁牌，七枚锚的钥匙/凭证线，跨卷收集",

    "plant": "铁牌",

    "reap": "node:elf_deep_tower_entry",

    "status": "open",

    "world": "七锚线",

    "importance": 5,

    "keywords": [

      "铁牌",

      "钥匙"

    ],

    "irreversible": false

  },

  {

    "id": "led_08",

    "type": "伏笔",

    "desc": "兽人神谕真伪，黑石部族与圣山信仰的核心悬念",

    "plant": "神谕",

    "reap": "flag:oracle_fake",

    "status": "open",

    "world": "兽人草原",

    "importance": 5,

    "keywords": [

      "神谕",

      "圣山"

    ],

    "irreversible": false

  },

  {

    "id": "led_09",

    "type": "人物",

    "desc": "灰鬃，黑石部族狼骑兵长，挚友支线主角",

    "plant": "node:orc_w_enter",

    "reap": "node:orc_w_end",

    "status": "open",

    "world": "兽人草原",

    "importance": 3,

    "keywords": [

      "灰鬃",

      "狼骑兵"

    ],

    "irreversible": false

  },

  {

    "id": "led_10",

    "type": "人物",

    "desc": "林歌，银月祭坛见习祭司，挚友支线主角",

    "plant": "node:elf_w_enter",

    "reap": "node:elf_w_end",

    "status": "open",

    "world": "精灵线",

    "importance": 3,

    "keywords": [

      "林歌",

      "银月祭坛"

    ],

    "irreversible": false

  },

  {

    "id": "led_11",

    "type": "地点",

    "desc": "银月祭坛，精灵月池所在，净根仪式主场",

    "plant": "银月",

    "reap": "node:elf_deep_altar",

    "status": "open",

    "world": "精灵线",

    "importance": 3,

    "keywords": [

      "银月祭坛",

      "月池"

    ],

    "irreversible": false

  },

  {

    "id": "led_12",

    "type": "事件",

    "desc": "铁门关战争，东境与北境的前线对峙",

    "plant": "铁门关",

    "reap": "node:tm_negotiate",

    "status": "open",

    "world": "铁门关",

    "importance": 4,

    "keywords": [

      "铁门关",

      "战争"

    ],

    "irreversible": false

  },

  {

    "id": "led_13",

    "type": "地点",

    "desc": "圣山图腾林，兽人祖灵信仰之地",

    "plant": "圣山",

    "reap": "node:orc_deep_totem",

    "status": "open",

    "world": "兽人草原",

    "importance": 3,

    "keywords": [

      "圣山",

      "图腾林"

    ],

    "irreversible": false

  },

  {

    "id": "led_14",

    "type": "势力",

    "desc": "狼旗，兽人草原部族联盟的旗帜",

    "plant": "狼旗",

    "reap": "node:orc_deep_gate",

    "status": "open",

    "world": "兽人草原",

    "importance": 2,

    "keywords": [

      "狼旗",

      "部族联盟"

    ],

    "irreversible": false

  },

  {

    "id": "led_15",

    "type": "地点",

    "desc": "月池，精灵祭坛核心，树根腐化的观测点",

    "plant": "月池",

    "reap": "node:elf_deep_altar",

    "status": "open",

    "world": "精灵线",

    "importance": 3,

    "keywords": [

      "月池",

      "精灵"

    ],

    "irreversible": false

  },

  {

    "id": "led_16",

    "type": "伏笔",

    "desc": "世界树根腐化，银月祭坛异变的源头",

    "plant": "树根",

    "reap": "node:elf_w_end",

    "status": "open",

    "world": "精灵线",

    "importance": 4,

    "keywords": [

      "树根",

      "腐化"

    ],

    "irreversible": false

  },

  {

    "id": "led_17",

    "type": "地点",

    "desc": "祖灵洞，兽人圣山深处的传承之地",

    "plant": "祖灵",

    "reap": "node:orc_w_end",

    "status": "open",

    "world": "兽人草原",

    "importance": 3,

    "keywords": [

      "祖灵洞",

      "圣山"

    ],

    "irreversible": false

  },

  {

    "id": "led_18",

    "type": "人物",

    "desc": "大汗，黑石部族之主，草原权力顶点",

    "plant": "大汗",

    "reap": "flag:khan_aware",

    "status": "open",

    "world": "兽人草原",

    "importance": 4,

    "keywords": [

      "大汗",

      "黑石部族"

    ],

    "irreversible": false

  },

  {

    "id": "led_19",

    "type": "人物",

    "desc": "青叶长老，林歌师父，树根真相的知情者",

    "plant": "青叶",

    "reap": "node:elf_w_step2",

    "status": "open",

    "world": "精灵线",

    "importance": 4,

    "keywords": [

      "青叶长老",

      "树根"

    ],

    "irreversible": false

  },

  {

    "id": "led_20",

    "type": "事件",

    "desc": "净化令，光明教会清扫异端的法令与暗蚀线总纲",

    "plant": "净化令",

    "reap": "node:tm_refugee",

    "status": "open",

    "world": "净化令线",

    "importance": 5,

    "keywords": [

      "净化令",

      "光明教会"

    ],

    "irreversible": false

  },

  {

    "id": "led_21",

    "type": "势力",

    "desc": "白袍教会，圣光信仰与净化令的执行者",

    "plant": "白袍",

    "reap": "node:tm_frontline",

    "status": "open",

    "world": "净化令线",

    "importance": 4,

    "keywords": [

      "白袍教会",

      "圣光"

    ],

    "irreversible": false

  },

  {

    "id": "led_22",

    "type": "伏笔",

    "desc": "铁门关和谈，秦·长风与东军的终局抉择",

    "plant": "node:tm_frontline",

    "reap": "node:tm_negotiate",

    "status": "open",

    "world": "铁门关",

    "importance": 4,

    "keywords": [

      "铁门关",

      "和谈"

    ],

    "irreversible": false

  },

  {

    "id": "led_23",

    "type": "伏笔",

    "desc": "识破假神谕，巫医帐信任与草原变革的钥匙",

    "plant": "node:orc_deep_witch",

    "reap": "flag:oracle_fake",

    "status": "open",

    "world": "兽人草原",

    "importance": 4,

    "keywords": [

      "神谕",

      "巫医"

    ],

    "irreversible": false

  },

  {

    "id": "led_24",

    "type": "因果",

    "desc": "放过劫匪，善念在矮人王都的余响",

    "plant": "flag:spared_robber",

    "reap": "node:dwarf_deep_bard",

    "status": "open",

    "world": "矮人线",

    "importance": 2,

    "keywords": [

      "劫匪",

      "善念",

      "矮人"

    ],

    "irreversible": false

  },

  {

    "id": "led_25",

    "type": "因果",

    "desc": "手刃匪首，杀伐之名传遍前线",

    "plant": "flag:bandit_leader_killed",

    "reap": "node:tm_ruins",

    "status": "open",

    "world": "铁门关",

    "importance": 3,

    "keywords": [

      "匪首",

      "杀伐"

    ],

    "irreversible": true

  },

  {

    "id": "led_26",

    "type": "因果",

    "desc": "散尽家财济难民，关南难民营记得这张脸",

    "plant": "flag:gave_all_to_refugees",

    "reap": "node:tm_refugee",

    "status": "open",

    "world": "铁门关",

    "importance": 2,

    "keywords": [

      "散财",

      "难民"

    ],

    "irreversible": false

  },

  {

    "id": "led_27",

    "type": "因果",

    "desc": "拒绝父亲给出的真相，身世线走向独自承担",

    "plant": "flag:father_truth_denied",

    "reap": "node:tm_watchtower",

    "status": "open",

    "world": "身世线",

    "importance": 3,

    "keywords": [

      "真相",

      "身世"

    ],

    "irreversible": true

  },

  {

    "id": "led_28",

    "type": "因果",

    "desc": "违抗预言，命运线与圣山神谕的对抗",

    "plant": "flag:prophecy_defied",

    "reap": "node:orc_deep_totem",

    "status": "open",

    "world": "兽人草原",

    "importance": 3,

    "keywords": [

      "预言",

      "神谕"

    ],

    "irreversible": true

  },

  {

    "id": "led_29",

    "type": "因果",

    "desc": "背叛同窗，学院线的代价与割裂",

    "plant": "flag:betrayed_classmate",

    "reap": "node:elf_deep_council",

    "status": "open",

    "world": "学院线",

    "importance": 3,

    "keywords": [

      "背叛",

      "同窗"

    ],

    "irreversible": true

  },

  {

    "id": "led_30",

    "type": "因果",

    "desc": "解放水岸，南方水岸线的高光转折",

    "plant": "flag:aquan_liberated",

    "reap": "node:tm_negotiate",

    "status": "open",

    "world": "南方线",

    "importance": 3,

    "keywords": [

      "解放",

      "水岸"

    ],

    "irreversible": false

  },

  {

    "id": "led_31",

    "type": "因果",

    "desc": "放走信使，情报线上的一次仁慈",

    "plant": "flag:let_mercury_go",

    "reap": "node:tm_courier",

    "status": "open",

    "world": "铁门关",

    "importance": 2,

    "keywords": [

      "信使",

      "仁慈"

    ],

    "irreversible": false

  },

  {

    "id": "led_32",

    "type": "地点",

    "desc": "东境晨天城，帝京文脉与铁门关外的故土（BD-4 经 east_chengtian_old 故都线核销）",

    "plant": "node:tm_refugee",

    "reap": "node:east_chengtian_old",

    "status": "closed",

    "world": "东境",

    "importance": 4,

    "keywords": [

      "晨天城",

      "帝京"

    ],

    "irreversible": false

  },

  {

    "id": "led_33",

    "type": "事件",

    "desc": "兽人草原入局，外乡人踏进黑石部族",

    "plant": "node:orc_deep_gate",

    "reap": "node:orc_deep_leave",

    "status": "open",

    "world": "兽人草原",

    "importance": 3,

    "keywords": [

      "兽人",

      "黑石部族"

    ],

    "irreversible": false

  },

  {

    "id": "led_34",

    "type": "事件",

    "desc": "精灵王庭入局，银叶集市的第一印象",

    "plant": "node:elf_deep_market",

    "reap": "node:elf_deep_council",

    "status": "open",

    "world": "精灵线",

    "importance": 3,

    "keywords": [

      "精灵",

      "银叶集市"

    ],

    "irreversible": false

  },

  {

    "id": "led_35",

    "type": "地点",

    "desc": "矮人王都铁砧议会，八百年的锤声",

    "plant": "node:dwarf_deep_hall",

    "reap": "node:dwarf_deep_mine2",

    "status": "open",

    "world": "矮人线",

    "importance": 3,

    "keywords": [

      "铁砧议会",

      "矮人王都"

    ],

    "irreversible": false

  },

  {

    "id": "led_36",

    "type": "伏笔",

    "desc": "西境元素风暴异常：风暴间隔缩短、风暴眼蓝光游走、枯井泉水与地下裂缝相通，与元素行者/封魔之战旧史呼应（BD-1 新埋）。",

    "plant": "node:west_storm_observatory",

    "reap": "future",

    "status": "open",

    "world": "西境",

    "importance": 5,

    "keywords": [

      "元素风暴",

      "西境",

      "封印柱"

    ],

    "irreversible": false

  },

  {

    "id": "led_37",

    "type": "伏笔",

    "desc": "死亡沙漠第七封印柱松动：盐湖渗水、夜车取水、遗迹壁画的凿柱笔记，与 seal 深渊封印松动（day200）同源呼应（BD-2 新埋）。",

    "plant": "node:desert_seal_watch",

    "reap": "future",

    "status": "open",

    "world": "死亡沙漠",

    "importance": 5,

    "keywords": [

      "第七封印柱",

      "死亡沙漠"

    ],

    "irreversible": false

  },

  {

    "id": "led_38",

    "type": "伏笔",

    "desc": "圣城圣痕司地基下发现与沙漠第七柱同源的石柱（艾德蒙叔叔遗信），圣城与沙漠压在一条封印线上（BD-3 新埋）。",

    "plant": "node:church_doubter2",

    "reap": "future",

    "status": "open",

    "world": "光明教会",

    "importance": 5,

    "keywords": [

      "圣痕司",

      "石柱",

      "封印"

    ],

    "irreversible": false

  },

  {

    "id": "led_sp8_01",

    "type": "设定",

    "desc": "西境游侠学院（院长柯恩，铁木黑弓，鹰牌信物）",

    "plant": "node:sp8_ranger_00",

    "reap": "node:sp8_ranger_14",

    "status": "open",

    "world": "西境",

    "importance": 1,

    "keywords": [

      "led_sp8_02"

    ],

    "irreversible": false

  },

  {

    "id": "led_sp8_02",

    "type": "伏笔",

    "desc": "柯恩身世：军阀火并中失去村子的孤儿收容者",

    "plant": "node:sp8_ranger_00b",

    "reap": "node:sp8_ranger_15",

    "status": "open",

    "world": "西境",

    "importance": 1,

    "keywords": [

      "柯恩身世",

      "军阀火并中失去村子的孤儿收容者"

    ],

    "irreversible": false

  },

  {

    "id": "led_sp8_03",

    "type": "人物",

    "desc": "游侠公会老会长（行省会鹰旗持有者）",

    "plant": "node:sp8_ranger_14",

    "reap": "node:sp8_ranger_15",

    "status": "open",

    "world": "西境",

    "importance": 4,

    "keywords": [

      "游侠公会老会长",

      "行省会鹰旗持有者"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_01",

    "type": "设定",

    "desc": "理想线·富甲天下：商路第一步与第一桶金",

    "plant": "node:goal_intro_wealth",

    "reap": "node:goal_wealth_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "富甲天下",

      "商路第一步与第一桶金"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_02",

    "type": "设定",

    "desc": "理想线·威震四海：老佣兵授艺与第一场硬仗",

    "plant": "node:goal_intro_might",

    "reap": "node:goal_might_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "威震四海",

      "老佣兵授艺与第一场硬仗"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_03",

    "type": "设定",

    "desc": "理想线·守护苍生：孤儿二狗与货栈救火",

    "plant": "node:goal_intro_guard",

    "reap": "node:goal_guard_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "守护苍生",

      "孤儿二狗与货栈救火"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_04",

    "type": "设定",

    "desc": "理想线·探寻真相：《封印前史》残卷与七印草图",

    "plant": "node:goal_intro_truth",

    "reap": "node:goal_truth_3",

    "status": "open",

    "world": "理想线",

    "importance": 5,

    "keywords": [

      "理想线",

      "探寻真相",

      "《封印前史》残卷与七印草图"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_05",

    "type": "设定",

    "desc": "理想线·自由自在：雪原独行与雪崩村守望",

    "plant": "node:goal_intro_free",

    "reap": "node:goal_free_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "自由自在",

      "雪原独行与雪崩村守望"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_06",

    "type": "设定",

    "desc": "理想线·登临神座：符文石板参悟与第一缕微光",

    "plant": "node:goal_intro_god",

    "reap": "node:goal_god_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "登临神座",

      "符文石板参悟与第一缕微光"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_07",

    "type": "设定",

    "desc": "理想线·名留青史：救人扬名与吟游诗人的传唱",

    "plant": "node:goal_intro_fame",

    "reap": "node:goal_fame_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "名留青史",

      "救人扬名与吟游诗人的传唱"

    ],

    "irreversible": false

  },

  {

    "id": "led_a1_08",

    "type": "设定",

    "desc": "理想线·以血还血：旧伤溯源与刀鞘刻名",

    "plant": "node:goal_intro_revenge",

    "reap": "node:goal_revenge_3",

    "status": "open",

    "world": "理想线",

    "importance": 1,

    "keywords": [

      "理想线",

      "以血还血",

      "旧伤溯源与刀鞘刻名"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_01",

    "type": "道具",

    "desc": "钥匙收集线：矿洞铜牌+元素池底黑铁+金库失窃铁牌，皆旧封印之钥（acad_magic_y1_pool / acad_story_vault）",

    "plant": "acad_magic_y1_pool",

    "reap": "acad_magic_y5_choice",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_b5_03"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_02",

    "type": "伏笔",

    "desc": "封印之门位于北境地脉蛇头·第三哨；门缝青光渐亮，封印松动（seal 主线弱呼应）",

    "plant": "acad_magic_y3_seal",

    "reap": "north_road_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "封印之门位于北境地脉蛇头",

      "第三哨",

      "门缝青光渐亮"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_03",

    "type": "人物",

    "desc": "金先生（金秤的金），老莫里茨之师，地脉学派五人小团体领袖，失踪；墓园无字碑即其葬地",

    "plant": "acad_story_oldman",

    "reap": "acad_story_graveyard",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "金先生",

      "金秤的金",

      "老莫里茨之师"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_04",

    "type": "人物",

    "desc": "艾琳·霜叶，北境民谣歌者，旧礼堂歌声、荣誉墙墨叉、档案被涂，与教会异端调查有关",

    "plant": "acad_story_ghost",

    "reap": "acad_story_archives",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_b5_06"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_05",

    "type": "伏笔",

    "desc": "费尔曼与六钥匙：刘矿头死于矿洞、老铁守第三哨失踪；费尔曼手背青纹更深",

    "plant": "acad_magic_y5_ferman",

    "reap": "north_road_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 4,

    "keywords": [

      "费尔曼与六钥匙",

      "刘矿头死于矿洞",

      "老铁守第三哨失踪"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_06",

    "type": "地点",

    "desc": "第三哨铜钟，十年未鸣；守钟人独臂老兵言敲钟会出事",

    "plant": "acad_magic_y4_quiet",

    "reap": "north_road_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 3,

    "keywords": [

      "第三哨铜钟",

      "十年未鸣",

      "守钟人独臂老兵言敲钟会出事"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_07",

    "type": "人物",

    "desc": "陆昭（鸦羽），炼金系偷铁牌者，休学去南，灰楼夜火持铁盒再现，铁盒或已交费尔曼",

    "plant": "acad_story_vault_end",

    "reap": "acad_story_fire_after",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "陆昭",

      "鸦羽",

      "炼金系偷铁牌者"

    ],

    "irreversible": false

  },

  {

    "id": "led_b5_08",

    "type": "人物",

    "desc": "秦策，东境承天城演武场之约；东境动荡避风北上，秦·长风线人物网络延伸",

    "plant": "acad_story_duel_after",

    "reap": "east_chengtian_old",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_frontier_03"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_01",

    "type": "地点",

    "desc": "第三哨城，联盟最北军事要塞。铜钟铭文刻七锚之图，地脉蛇头在此，七锚之约第一环。",

    "plant": "frontier_bell_4",

    "reap": "frontier_bell_5",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "第三哨城",

      "联盟最北军事要塞",

      "铜钟铭文刻七锚之图"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_02",

    "type": "伏笔",

    "desc": "老周之子三十年前在矿洞失踪，尸首未寻；失踪前曾说钟底下那个东西在叫他。",

    "plant": "frontier_old_2",

    "reap": "frontier_old_5",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "老周之子三十年前在矿洞失踪",

      "尸首未寻",

      "失踪前曾说钟底下那个东西在叫他"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_03",

    "type": "伏笔",

    "desc": "矿洞封洞二十年仍传出水声，矿工旧物沉在巷道深处，锚2所在。",

    "plant": "frontier_mine_gate",

    "reap": "frontier_mine_1",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "led_frontier_07"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_04",

    "type": "伏笔",

    "desc": "雪原狼群由黑皮两足人影指挥，狼王悬赏与城门告示同图。",

    "plant": "frontier_infirmary",

    "reap": "frontier_ev_wolves",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "雪原狼群由黑皮两足人影指挥",

      "狼王悬赏与城门告示同图"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_05",

    "type": "人物",

    "desc": "独臂军需官，掌矿洞钥匙与铜钟旧事，知七锚铭文来历。",

    "plant": "frontier_sergeant",

    "reap": "frontier_bell_4",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "独臂军需官",

      "掌矿洞钥匙与铜钟旧事",

      "知七锚铭文来历"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_06",

    "type": "伏笔",

    "desc": "王三失踪于钟楼，雪地留下首枚铁牌，与钟身刻痕同纹（方牌中竖纹），七锚之首。",

    "plant": "frontier_bell_2",

    "reap": "frontier_bell_3",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "王三失踪于钟楼",

      "雪地留下首枚铁牌",

      "与钟身刻痕同纹"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_07",

    "type": "伏笔",

    "desc": "风洞铁皮棺材：黑皮人组织运送，棺内传出敲击声，与矿洞水声同源；风洞深处另有铁门需钥匙。",

    "plant": "frontier_tie_6",

    "reap": "frontier_tie_8",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "led_a3_01"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_08",

    "type": "人物",

    "desc": "老铁：第三哨老兵，其父三十年前死于矿洞，遗物铁牌被矿上收走；手上有风洞铁门钥匙。",

    "plant": "frontier_tie_1",

    "reap": "frontier_tie_7",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "老铁",

      "第三哨老兵",

      "其父三十年前死于矿洞"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_09",

    "type": "伏笔",

    "desc": "黑纹伤病：被咬老兵伤口渗黑纹，做同一个敲击噩梦，指向矿洞方向；军医宋记录在册。",

    "plant": "frontier_medic_2",

    "reap": "frontier_medic_5",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "led_a3_04"

    ],

    "irreversible": false

  },

  {

    "id": "led_frontier_10",

    "type": "地点",

    "desc": "地窖裂缝：第三哨地底深渊地脉，seal 主线 day200 联动；玩家侧加固/观望/上报教会三路影响文本。",

    "plant": "frontier_seal_1",

    "reap": "frontier_seal_after_2",

    "status": "open",

    "world": "vol_north",

    "importance": 3,

    "keywords": [

      "地窖裂缝",

      "第三哨地底深渊地脉",

      "seal"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_01",

    "type": "伏笔",

    "desc": "北境灰烬村废墟之眼（深渊生物窥视）",

    "plant": "origin_expand_north_edge",

    "reap": "origin_expand_north_6",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "led_a3_07"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_02",

    "type": "设定",

    "desc": "南方深海绿光·第七印在海底（商船线）",

    "plant": "origin_expand_south_4",

    "reap": "",

    "status": "open",

    "world": "vol_south",

    "importance": 1,

    "keywords": [

      "led_b1_01"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_03",

    "type": "人物",

    "desc": "杜嬷嬷送阿禾东去承天城投奔姓秦者（教会孤儿线）",

    "plant": "origin_expand_church_4",

    "reap": "",

    "status": "open",

    "world": "vol_church",

    "importance": 1,

    "keywords": [

      "led_b1_02"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_04",

    "type": "设定",

    "desc": "世界树根部封印·晨星之泪可洗蚀痕（精灵线）",

    "plant": "origin_expand_elf_6",

    "reap": "",

    "status": "open",

    "world": "vol_elf",

    "importance": 5,

    "keywords": [

      "世界树根部封印",

      "晨星之泪可洗蚀痕",

      "精灵线"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_05",

    "type": "设定",

    "desc": "矮人南矿洞铁门·七道封印之一（矮人线）",

    "plant": "origin_expand_dwarf_4",

    "reap": "",

    "status": "open",

    "world": "vol_dwarf",

    "importance": 1,

    "keywords": [

      "led_b2_02"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_06",

    "type": "人物",

    "desc": "铁门关斥候托信交汇城李管事·暗蚀会挖地寻物（兽人线）",

    "plant": "origin_expand_orc_7",

    "reap": "",

    "status": "open",

    "world": "vol_orc",

    "importance": 1,

    "keywords": [

      "led_b3_01"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_07",

    "type": "人物",

    "desc": "秦·长风：晨天城秦氏幸存者，居交汇城，官署暗探在找（东境线）",

    "plant": "origin_expand_east_7",

    "reap": "",

    "status": "open",

    "world": "vol_east",

    "importance": 1,

    "keywords": [

      "led_b3_02"

    ],

    "irreversible": false

  },

  {

    "id": "led_a3_08",

    "type": "伏笔",

    "desc": "承天城井水变浑·晨天城覆灭征兆重现",

    "plant": "origin_expand_east_6",

    "reap": "",

    "status": "open",

    "world": "vol_east",

    "importance": 5,

    "keywords": [

      "承天城井水变浑",

      "晨天城覆灭征兆重现"

    ],

    "irreversible": false

  },

  {

    "id": "led_b1_01",

    "type": "设定",

    "desc": "学院入学引导链：自由城/王都/铁门关前线三入口可达学院（acad_road_1~5），开学典礼埋塔灯传说",

    "plant": "acad_road_1",

    "reap": "academy_admission",

    "status": "open",

    "world": "vol_academy",

    "importance": 4,

    "keywords": [

      "学院入学引导链",

      "自由城",

      "王都"

    ],

    "irreversible": false

  },

  {

    "id": "led_b1_02",

    "type": "伏笔",

    "desc": "塔顶之灯数人之说（acad_tower_rumor）与图书馆塔灯呼应，待学院线回收",

    "plant": "acad_road_4",

    "reap": "academy_graduation",

    "status": "open",

    "world": "vol_academy",

    "importance": 3,

    "keywords": [

      "塔顶之灯数人之说",

      "acad_tower_rumor",

      "与图书馆塔灯呼应"

    ],

    "irreversible": false

  },

  {

    "id": "led_b2_01",

    "type": "设定",

    "desc": "学院五学年生活线（acad_life_y1~y5，30 节点：课程ifJob/宿舍/同窗/期中/期末/假期/学年事件），north_academy_gate 生活区入口",

    "plant": "acad_life_y1_open",

    "reap": "academy_graduation",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_grad_05"

    ],

    "irreversible": false

  },

  {

    "id": "led_b2_02",

    "type": "伏笔",

    "desc": "费尔曼教授=席恩（看守者），禁书区夜课、净化令、第七节点钥匙（acad_brass_key）",

    "plant": "acad_life_y2_friend",

    "reap": "academy_elda_forbidden_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "费尔曼教授=席恩",

      "看守者",

      "禁书区夜课"

    ],

    "irreversible": false

  },

  {

    "id": "led_b3_01",

    "type": "人物",

    "desc": "学院人际网：塞西莉娅（东境政务/晨天水）/灰须·莫里（矮人符文/铁门七封印）/伊莲娜（精灵治愈/忘忧草）/老铁（铁门关铁匠），各 4 节点闭环",

    "plant": "acad_people_hub",

    "reap": "academy_graduation",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "学院人际网",

      "塞西莉娅",

      "东境政务"

    ],

    "irreversible": false

  },

  {

    "id": "led_b3_02",

    "type": "人物",

    "desc": "导师四人（墨丘利银叶/戈拉铁门关铁片/特蕾莎枯木/老莫里茨商路），各 2 节点闭环",

    "plant": "acad_mentor_hub",

    "reap": "academy_graduation",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_alumni_04"

    ],

    "irreversible": false

  },

  {

    "id": "led_grad_01",

    "type": "伏笔",

    "desc": "老莫里茨临终托付——北境封印与七锚的真相入口，金秤家守墓人身份初现",

    "plant": "grad_stay_4",

    "reap": "anchor_grave_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "老莫里茨临终托付",

      "北境封印与七锚的真相入口",

      "金秤家守墓人身份初现"

    ],

    "irreversible": false

  },

  {

    "id": "led_grad_02",

    "type": "伏笔",

    "desc": "金秤家信物铁牌（三道弧线围一圆），老莫里茨遗赠，墓园认亲凭证",

    "plant": "grad_stay_4",

    "reap": "anchor_grave_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "金秤家信物铁牌",

      "三道弧线围一圆",

      "老莫里茨遗赠"

    ],

    "irreversible": false

  },

  {

    "id": "led_grad_03",

    "type": "伏笔",

    "desc": "费尔曼第三把锈钥匙——禁书区铁门钥匙，留校线持有",

    "plant": "grad_y3_end_3",

    "reap": "anchor_vault_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 4,

    "keywords": [

      "费尔曼第三把锈钥匙——禁书区铁门钥匙",

      "留校线持有"

    ],

    "irreversible": false

  },

  {

    "id": "led_grad_04",

    "type": "设定",

    "desc": "墓园无字碑·金先生=金秤家守墓人，碑下埋锚（第三哨北）",

    "plant": "grad_stay_5",

    "reap": "anchor_grave_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "墓园无字碑",

      "金先生=金秤家守墓人",

      "碑下埋锚"

    ],

    "irreversible": false

  },

  {

    "id": "led_grad_05",

    "type": "设定",

    "desc": "毕业四去向（留校/从军/游历/回乡），各自独立链与北上汇合点",

    "plant": "grad_choose",

    "reap": "grad_path_stay_north",

    "status": "closed",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "毕业四去向",

      "留校",

      "从军"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_01",

    "type": "伏笔",

    "desc": "狼群南迁与神谕石林枯井水眼干涸，洛克线埋下兽人神谕危机",

    "plant": "alumni_rock_4",

    "reap": "anchor_oracle_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_anchor_01"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_02",

    "type": "伏笔",

    "desc": "铁门关防务疏漏与第三哨异动，凯恩线指向北境战争前兆",

    "plant": "alumni_kain_4",

    "reap": "warphase_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_anchor_03"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_03",

    "type": "伏笔",

    "desc": "《灰烬之书》失窃与圣痕司异动，艾丽丝线指向圣痕与封纹",

    "plant": "alumni_alice_4",

    "reap": "anchor_church_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "《灰烬之书》失窃与圣痕司异动",

      "艾丽丝线指向圣痕与封纹"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_04",

    "type": "伏笔",

    "desc": "神谕枯井井底壁画与波浪纹刻痕，阿塔线标记地底通路",

    "plant": "alumni_ata_3",

    "reap": "anchor_oracle_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "神谕枯井井底壁画与波浪纹刻痕",

      "阿塔线标记地底通路"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_05",

    "type": "伏笔",

    "desc": "东境灰瘟与地底铁门铰链，洛卡线指向沉埋门扉",

    "plant": "alumni_loka_4",

    "reap": "anchor_mine_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "东境灰瘟与地底铁门铰链",

      "洛卡线指向沉埋门扉"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_06",

    "type": "伏笔",

    "desc": "晨天故城与官仓粮印旧账，塞西莉娅线指向东境地下",

    "plant": "alumni_cecy_4",

    "reap": "anchor_chen_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "晨天故城与官仓粮印旧账",

      "塞西莉娅线指向东境地下"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_07",

    "type": "伏笔",

    "desc": "矮人矿洞石室与标路记号，莫里线呼应神谕枯井波浪纹",

    "plant": "alumni_mori_5",

    "reap": "anchor_mine_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "矮人矿洞石室与标路记号",

      "莫里线呼应神谕枯井波浪纹"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_08",

    "type": "伏笔",

    "desc": "圣痕封伤与封纹铁片，艾琳娜线指向净仪与圣痕司隐秘",

    "plant": "alumni_elena_4",

    "reap": "anchor_church_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "圣痕封伤与封纹铁片",

      "艾琳娜线指向净仪与圣痕司隐秘"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_09",

    "type": "伏笔",

    "desc": "铜钟裂口与钟楼铁板地图，老铁线标记北境地下门扉",

    "plant": "alumni_tie_3",

    "reap": "anchor_tower_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 1,

    "keywords": [

      "led_goldscale_04"

    ],

    "irreversible": false

  },

  {

    "id": "led_alumni_10",

    "type": "伏笔",

    "desc": "导师遗物黄铜钥匙与七块铁碑文，指向七锚封镇真相",

    "plant": "grad_mentor_3",

    "reap": "goldscale_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "导师遗物黄铜钥匙与七块铁碑文",

      "指向七锚封镇真相"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_01",

    "type": "伏笔",

    "desc": "七锚之首·哨楼锚：铜叶与半枚铁牌，守钟人传承",

    "plant": "anchor_tower_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "七锚之首",

      "哨楼锚",

      "铜叶与半枚铁牌"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_02",

    "type": "伏笔",

    "desc": "七锚之二·矿洞锚：铁门铁牌与锚形铜印，刘矿头旧线",

    "plant": "anchor_mine_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "七锚之二",

      "矿洞锚",

      "铁门铁牌与锚形铜印"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_03",

    "type": "伏笔",

    "desc": "七锚之三·墓园锚：无字碑下锚形玉印，金秤守门人三代",

    "plant": "anchor_grave_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "七锚之三",

      "墓园锚",

      "无字碑下锚形玉印"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_04",

    "type": "伏笔",

    "desc": "七锚之四·学院金库锚：铁锚印与陆昭失窃铁牌，指向承天城",

    "plant": "anchor_vault_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_academy",

    "importance": 5,

    "keywords": [

      "七锚之四",

      "学院金库锚",

      "铁锚印与陆昭失窃铁牌"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_05",

    "type": "伏笔",

    "desc": "七锚之五·晨天故都锚：天衡殿铜印，陆昭持学院铁牌合印",

    "plant": "anchor_chen_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_east",

    "importance": 5,

    "keywords": [

      "七锚之五",

      "晨天故都锚",

      "天衡殿铜印"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_06",

    "type": "伏笔",

    "desc": "七锚之六·教会圣库锚：圣痕司圣物库铁印，守库人已叛",

    "plant": "anchor_church_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_church",

    "importance": 1,

    "keywords": [

      "led_fac_08"

    ],

    "irreversible": false

  },

  {

    "id": "led_anchor_07",

    "type": "伏笔",

    "desc": "七锚之七·兽人神谕锚：神谕石林石印，白狼低头认主",

    "plant": "anchor_oracle_1",

    "reap": "anchor_finale_1",

    "status": "open",

    "world": "vol_race",

    "importance": 1,

    "keywords": [

      "led_war_02"

    ],

    "irreversible": false

  },

  {

    "id": "led_goldscale_01",

    "type": "设定",

    "desc": "金秤=晨天王朝司秤官金家传世镇器，两头挂一头称天一头称地",

    "plant": "goldscale_1",

    "reap": "goldscale_8",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "金秤=晨天王朝司秤官金家传世镇器",

      "两头挂一头称天一头称地"

    ],

    "irreversible": false

  },

  {

    "id": "led_goldscale_02",

    "type": "设定",

    "desc": "金家守秤三十一代，金望之等持锚人三十一年",

    "plant": "goldscale_2",

    "reap": "goldscale_7",

    "status": "open",

    "world": "vol_north",

    "importance": 1,

    "keywords": [

      "金家守秤三十一代",

      "金望之等持锚人三十一年"

    ],

    "irreversible": false

  },

  {

    "id": "led_goldscale_03",

    "type": "伏笔",

    "desc": "金望之第三十代守秤人临终托付秤账与铁牌",

    "plant": "goldscale_3",

    "reap": "goldscale_8",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "金望之第三十代守秤人临终托付秤账与铁牌"

    ],

    "irreversible": false

  },

  {

    "id": "led_goldscale_04",

    "type": "伏笔",

    "desc": "晨天王朝天衡殿主簿金秤镇界记载：锚足齐则秤稳",

    "plant": "goldscale_5",

    "reap": "goldscale_8",

    "status": "open",

    "world": "vol_east",

    "importance": 5,

    "keywords": [

      "晨天王朝天衡殿主簿金秤镇界记载",

      "锚足齐则秤稳"

    ],

    "irreversible": false

  },

  {

    "id": "led_war_01",

    "type": "伏笔",

    "desc": "北境七阶段战争线：边境摩擦至终战，战火由北向南烧遍大陆",

    "plant": "warphase_1",

    "reap": "warphase_14",

    "status": "open",

    "world": "vol_war",

    "importance": 1,

    "keywords": [

      "led_echo_05"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_01",

    "type": "设定",

    "desc": "四阵营互斥：加入一方后其余阵营声望下降，背叛走惩罚支线",

    "plant": "faction_free_1",

    "reap": "faction_traitor_4",

    "status": "open",

    "world": "vol_war",

    "importance": 1,

    "keywords": [

      "四阵营互斥",

      "加入一方后其余阵营声望下降",

      "背叛走惩罚支线"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_02",

    "type": "伏笔",

    "desc": "教会的铁匠旧案：二十年前渎神罪烧死打钥匙的铁匠，与七锚钥匙线呼应",

    "plant": "faction_church_5",

    "reap": "anchor_tower_1",

    "status": "open",

    "world": "vol_church",

    "importance": 1,

    "keywords": [

      "led_echo_07"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_03",

    "type": "伏笔",

    "desc": "沙漠遗迹玉片：刻痕像半个锚，地缝符号与学院禁书区同源",

    "plant": "faction_desert_5",

    "reap": "anchor_mine_1",

    "status": "open",

    "world": "vol_desert",

    "importance": 1,

    "keywords": [

      "沙漠遗迹玉片",

      "刻痕像半个锚",

      "地缝符号与学院禁书区同源"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_04",

    "type": "设定",

    "desc": "商会盐道：自由城商会以军饷换北境盐道畅通，商会立场成型",

    "plant": "faction_free_5",

    "reap": "faction_free_9",

    "status": "open",

    "world": "vol_free",

    "importance": 1,

    "keywords": [

      "led_echo_09"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_05",

    "type": "设定",

    "desc": "东境承天与晨天故都的旧档呼应（战后 M9）",

    "plant": "faction_east_4",

    "reap": "war_after_26",

    "status": "open",

    "world": "vol_east",

    "importance": 1,

    "keywords": [

      "led_echo_10"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_06",

    "type": "设定",

    "desc": "兽人神谕石林的守秤传说（草原柱根）",

    "plant": "faction_orc_8",

    "reap": "war_epilogue_4",

    "status": "open",

    "world": "vol_orc",

    "importance": 5,

    "keywords": [

      "兽人神谕石林的守秤传说",

      "草原柱根"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_07",

    "type": "伏笔",

    "desc": "矮人山国南矿洞铁门与地底七锚刻痕",

    "plant": "faction_dwarf_3",

    "reap": "war_after_13",

    "status": "open",

    "world": "vol_dwarf",

    "importance": 1,

    "keywords": [

      "led_echo_12"

    ],

    "irreversible": false

  },

  {

    "id": "led_fac_08",

    "type": "伏笔",

    "desc": "精灵林邦晨星之泪与树底封印",

    "plant": "faction_elf_6",

    "reap": "war_after_14",

    "status": "open",

    "world": "vol_elf",

    "importance": 5,

    "keywords": [

      "精灵林邦晨星之泪与树底封印"

    ],

    "irreversible": false

  },

  {

    "id": "led_war_02",

    "type": "设定",

    "desc": "守钟人铁牌与七锚重走（战后收束）",

    "plant": "war_after_4",

    "reap": "war_epilogue_16",

    "status": "open",

    "world": "vol_north",

    "importance": 5,

    "keywords": [

      "守钟人铁牌与七锚重走",

      "战后收束"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_01",

    "type": "伏笔",

    "desc": "放过劫匪的回响——矮人王都卖炭翁磕头报恩（CON-2 回响节点）",

    "plant": "flag:spared_robber",

    "reap": "node:echo_spared_robber",

    "status": "open",

    "world": "回响线",

    "importance": 4,

    "keywords": [

      "放过劫匪的回响",

      "矮人王都卖炭翁磕头报恩",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_02",

    "type": "伏笔",

    "desc": "助过巨人的回响——铁砧议会厅外铁匠提起山岭巨人（CON-2 回响节点）",

    "plant": "flag:giant_helper",

    "reap": "node:echo_giant_helper",

    "status": "open",

    "world": "回响线",

    "importance": 3,

    "keywords": [

      "助过巨人的回响",

      "铁砧议会厅外铁匠提起山岭巨人",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_03",

    "type": "伏笔",

    "desc": "金秤黑名单的回响——银穗河码头老账房修秤摊（CON-2 回响节点）",

    "plant": "flag:gold_scale_blacklisted",

    "reap": "node:echo_gold_scale_blacklisted",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "led_echo_17"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_04",

    "type": "伏笔",

    "desc": "东境通缉的回响——承天街市画像不像、馄饨摊多搁虾皮（CON-2 回响节点）",

    "plant": "flag:east_wanted",

    "reap": "node:echo_east_wanted",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "东境通缉的回响",

      "承天街市画像不像",

      "馄饨摊多搁虾皮"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_05",

    "type": "伏笔",

    "desc": "背叛同窗的回响——精灵长老会案卷与誊书精灵（CON-2 回响节点）",

    "plant": "flag:betrayed_classmate",

    "reap": "node:echo_betrayed_classmate",

    "status": "open",

    "world": "回响线",

    "importance": 4,

    "keywords": [

      "背叛同窗的回响",

      "精灵长老会案卷与誊书精灵",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_06",

    "type": "伏笔",

    "desc": "解放女王艾萨拉的回响——银月祭坛三枚银币（CON-2 回响节点）",

    "plant": "flag:seal3_queen_freed",

    "reap": "node:echo_seal3_queen_freed",

    "status": "open",

    "world": "回响线",

    "importance": 3,

    "keywords": [

      "解放女王艾萨拉的回响",

      "银月祭坛三枚银币",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_07",

    "type": "伏笔",

    "desc": "墨丘利盟友的回响——交汇城钟楼弹银币（CON-2 回响节点）",

    "plant": "flag:mercury_ally",

    "reap": "node:echo_mercury_ally",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "led_echo_21"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_08",

    "type": "伏笔",

    "desc": "令墨丘利失望的回响——药剂铺空瓶与字条（CON-2 回响节点）",

    "plant": "flag:mercury_disappointed",

    "reap": "node:echo_mercury_disappointed",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "令墨丘利失望的回响",

      "药剂铺空瓶与字条",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_09",

    "type": "伏笔",

    "desc": "盗贼公会成员的回响——贫民窟补鞋哑巴的墙根记号（CON-2 回响节点）",

    "plant": "flag:thieves_guild_member",

    "reap": "node:echo_thieves_guild_member",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "led_echo_23"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_10",

    "type": "伏笔",

    "desc": "守夜人邀请的回响——深夜归城铜哨未响（CON-2 回响节点）",

    "plant": "flag:watchmen_invited",

    "reap": "node:echo_watchmen_invited",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "守夜人邀请的回响",

      "深夜归城铜哨未响",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_11",

    "type": "伏笔",

    "desc": "浮空塔祝福的回响——半截塔基灰鸽与袖口烫意（CON-2 回响节点）",

    "plant": "flag:floating_tower_blessed",

    "reap": "node:echo_floating_tower_blessed",

    "status": "open",

    "world": "回响线",

    "importance": 3,

    "keywords": [

      "浮空塔祝福的回响",

      "半截塔基灰鸽与袖口烫意",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_12",

    "type": "伏笔",

    "desc": "放逐浮空塔的回响——塔基刻字『塔走了地还在』（CON-2 回响节点）",

    "plant": "flag:floating_tower_banished",

    "reap": "node:echo_floating_tower_banished",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "放逐浮空塔的回响——塔基刻字『塔走了地还在』",

      "CON-2",

      "回响节点"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_13",

    "type": "伏笔",

    "desc": "塞拉芬替身承诺的回响——学院山门扫雪杂役（CON-2 回响节点）",

    "plant": "flag:seraphine_substitute_promise",

    "reap": "node:echo_seraphine_substitute_promise",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "塞拉芬替身承诺的回响",

      "学院山门扫雪杂役",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_14",

    "type": "伏笔",

    "desc": "绕行学院的回响——多年后重踏学院山门（CON-2 回响节点）",

    "plant": "flag:skip_academy",

    "reap": "node:echo_skip_academy",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "绕行学院的回响",

      "多年后重踏学院山门",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_15",

    "type": "伏笔",

    "desc": "大汗知情的回响——图腾林边牧人孩子与老牧人奶干（CON-2 回响节点）",

    "plant": "flag:khan_aware",

    "reap": "node:echo_khan_aware",

    "status": "open",

    "world": "回响线",

    "importance": 4,

    "keywords": [

      "大汗知情的回响",

      "图腾林边牧人孩子与老牧人奶干",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_16",

    "type": "伏笔",

    "desc": "违抗预言的回响——猎人小道石头上炭画白狼（CON-2 回响节点）",

    "plant": "flag:prophecy_defied",

    "reap": "node:echo_prophecy_defied",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "违抗预言的回响",

      "猎人小道石头上炭画白狼",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_17",

    "type": "伏笔",

    "desc": "揭穿假神谕的回响——兽人集市孩子与老萨满的盐（CON-2 回响节点）",

    "plant": "flag:oracle_fake",

    "reap": "node:echo_oracle_fake",

    "status": "open",

    "world": "回响线",

    "importance": 5,

    "keywords": [

      "揭穿假神谕的回响",

      "兽人集市孩子与老萨满的盐",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_18",

    "type": "伏笔",

    "desc": "放走信使的回响——驿站驿卒转述怪人带话（CON-2 回响节点）",

    "plant": "flag:let_mercury_go",

    "reap": "node:echo_let_mercury_go",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "放走信使的回响",

      "驿站驿卒转述怪人带话",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_19",

    "type": "伏笔",

    "desc": "支持净化令的回响——铁门关茶摊议论与抱孩子妇人（CON-2 回响节点）",

    "plant": "flag:council_support_purification",

    "reap": "node:echo_council_support_purification",

    "status": "open",

    "world": "回响线",

    "importance": 5,

    "keywords": [

      "支持净化令的回响",

      "铁门关茶摊议论与抱孩子妇人",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_20",

    "type": "伏笔",

    "desc": "反对净化令的回响——脚夫顺口溜与卖饼老头的酱（CON-2 回响节点）",

    "plant": "flag:council_oppose_purification",

    "reap": "node:echo_council_oppose_purification",

    "status": "open",

    "world": "回响线",

    "importance": 5,

    "keywords": [

      "反对净化令的回响",

      "脚夫顺口溜与卖饼老头的酱",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_21",

    "type": "伏笔",

    "desc": "折中净化令的回响——布摊老板谢那句『先查账后抓人』（CON-2 回响节点）",

    "plant": "flag:council_compromise_purification",

    "reap": "node:echo_council_compromise_purification",

    "status": "open",

    "world": "回响线",

    "importance": 5,

    "keywords": [

      "折中净化令的回响",

      "布摊老板谢那句『先查账后抓人』",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_22",

    "type": "伏笔",

    "desc": "幼龙同行的回响——铁门关守城老卒想摸又不敢（CON-2 回响节点）",

    "plant": "flag:dragon_companion",

    "reap": "node:echo_dragon_companion",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "幼龙同行的回响",

      "铁门关守城老卒想摸又不敢",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_23",

    "type": "伏笔",

    "desc": "净化令加剧的回响——宵禁提前、客栈窗纸糊三层（CON-2 回响节点）",

    "plant": "flag:purge_intensified",

    "reap": "node:echo_purge_intensified",

    "status": "open",

    "world": "回响线",

    "importance": 5,

    "keywords": [

      "净化令加剧的回响",

      "宵禁提前",

      "客栈窗纸糊三层"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_24",

    "type": "伏笔",

    "desc": "解放水岸的回响——东军老兵阵前军礼（CON-2 回响节点）",

    "plant": "flag:aquan_liberated",

    "reap": "node:echo_aquan_liberated",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "解放水岸的回响",

      "东军老兵阵前军礼",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_25",

    "type": "伏笔",

    "desc": "北境送粮的回响——传令兵私下道谢（CON-2 回响节点）",

    "plant": "flag:beijing_saved",

    "reap": "node:echo_beijing_saved",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "北境送粮的回响",

      "传令兵私下道谢",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_26",

    "type": "伏笔",

    "desc": "散尽家财的回响——难民营瘸腿老妇塞炒面（CON-2 回响节点）",

    "plant": "flag:gave_all_to_refugees",

    "reap": "node:echo_gave_all_to_refugees",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "散尽家财的回响",

      "难民营瘸腿老妇塞炒面",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_27",

    "type": "伏笔",

    "desc": "勒索美第奇的传闻——粥棚老人说拿把柄的人少（CON-2 回响节点）",

    "plant": "flag:medici_blackmailed",

    "reap": "node:echo_medici_blackmailed",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "勒索美第奇的传闻",

      "粥棚老人说拿把柄的人少",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_28",

    "type": "伏笔",

    "desc": "手刃匪首的回响——北坡老卒塞干饼、官道木牌（CON-2 回响节点）",

    "plant": "flag:bandit_leader_killed",

    "reap": "node:echo_bandit_leader_killed",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "手刃匪首的回响",

      "北坡老卒塞干饼",

      "官道木牌"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_29",

    "type": "伏笔",

    "desc": "暗蚀渗透的回响——烽火台下埋过的鸦羽铜牌（CON-2 回响节点）",

    "plant": "flag:eclipse_infiltrator",

    "reap": "node:echo_eclipse_infiltrator",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "暗蚀渗透的回响",

      "烽火台下埋过的鸦羽铜牌",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_echo_30",

    "type": "伏笔",

    "desc": "拒绝父亲真相的回响——烽火台北风与未拆的信（CON-2 回响节点）",

    "plant": "flag:father_truth_denied",

    "reap": "node:echo_father_truth_denied",

    "status": "open",

    "world": "回响线",

    "importance": 1,

    "keywords": [

      "拒绝父亲真相的回响",

      "烽火台北风与未拆的信",

      "CON"

    ],

    "irreversible": false

  },

  {

    "id": "led_f1_purge",

    "type": "伏笔",

    "desc": "净化令三幕：默页书肆牛皮账（金秤老账房旧账）——圣城线伏笔，通向 F-2 代价节点",

    "plant": "flag:purge_account",

    "reap": "node:world_f1_after_purge",

    "status": "open",

    "world": "净化令线",

    "importance": 3,

    "keywords": ["净化令三幕：默页书肆牛皮账（金秤老账房旧账）——圣城线伏笔，通向 F-2 代价节点"],

    "irreversible": false

  },

  {

    "id": "led_f1_silver",

    "type": "伏笔",

    "desc": "银穗商路三幕：柳巷七号银月商会 + 码头姑娘七笔旧账（金秤家）——商路线伏笔",

    "plant": "flag:silver_account",

    "reap": "node:world_f1_after_silver",

    "status": "open",

    "world": "银穗商路线",

    "importance": 3,

    "keywords": ["银穗商路三幕：柳巷七号银月商会 + 码头姑娘七笔旧账（金秤家）——商路线伏笔"],

    "irreversible": false

  },

  {

    "id": "led_f1_seal",

    "type": "伏笔",

    "desc": "深渊封印三幕：南二铁牌 + 灰袍守夜人（南二醒了北七不远）——封印线伏笔",

    "plant": "flag:seal_talisman",

    "reap": "node:world_f1_after_seal",

    "status": "open",

    "world": "深渊封印线",

    "importance": 3,

    "keywords": ["深渊封印三幕：南二铁牌 + 灰袍守夜人（南二醒了北七不远）——封印线伏笔"],

    "irreversible": false

  },

  {

    "id": "led_f1_academy",

    "type": "伏笔",

    "desc": "学院暗流三幕：费尔曼禁书区密道 + 金秤铜钱 + 顾青梧目击——学院线伏笔",

    "plant": "flag:academy_vault",

    "reap": "node:world_f1_after_academy",

    "status": "open",

    "world": "学院暗流线",

    "importance": 3,

    "keywords": ["学院暗流三幕：费尔曼禁书区密道 + 金秤铜钱 + 顾青梧目击——学院线伏笔"],

    "irreversible": false

  },

  {

    "id": "led_f1_orc",

    "type": "伏笔",

    "desc": "兽人南下三幕：狼营地图账字 + 兽人老妇羊皮密信（第七封在学院问费尔曼）——兽人线伏笔",

    "plant": "flag:orc_ledger",

    "reap": "node:world_f1_after_orc",

    "status": "open",

    "world": "兽人南下线",

    "importance": 3,

    "keywords": ["兽人南下三幕：狼营地图账字 + 兽人老妇羊皮密信（第七封在学院问费尔曼）——兽人线伏笔"],

    "irreversible": false

  },

  {

    "id": "led_f2_cost_purge",

    "type": "伏笔",

    "desc": "净化令代价：圣痕司名录记名（书肆街目击者绳结）——F-2 代价节点",

    "plant": "flag:purge_account",

    "reap": "node:world_f_cost_purge",

    "status": "open",

    "world": "净化令线",

    "importance": 2,

    "keywords": ["净化令代价：圣痕司名录记名（书肆街目击者绳结）——F-2 代价节点"],

    "irreversible": false

  },

  {

    "id": "led_f2_cost_silver",

    "type": "伏笔",

    "desc": "银穗商路代价：银月商会开价收七笔账（姑娘与钥匙的线）——F-2 代价节点",

    "plant": "flag:silver_account",

    "reap": "node:world_f_cost_silver",

    "status": "open",

    "world": "银穗商路线",

    "importance": 2,

    "keywords": ["银穗商路代价：银月商会开价收七笔账（姑娘与钥匙的线）——F-2 代价节点"],

    "irreversible": false

  },

  {

    "id": "led_f2_cost_seal",

    "type": "伏笔",

    "desc": "深渊封印代价：灰袍守夜人传信（南二铁牌被多方盯上）——F-2 代价节点",

    "plant": "flag:seal_talisman",

    "reap": "node:world_f_cost_seal",

    "status": "open",

    "world": "深渊封印线",

    "importance": 2,

    "keywords": ["深渊封印代价：灰袍守夜人传信（南二铁牌被多方盯上）——F-2 代价节点"],

    "irreversible": false

  },

  {

    "id": "led_f2_cost_academy",

    "type": "伏笔",

    "desc": "学院暗流代价：教务处查金秤牛皮册（铜钱藏匿升级）——F-2 代价节点",

    "plant": "flag:academy_vault",

    "reap": "node:world_f_cost_academy",

    "status": "open",

    "world": "学院暗流线",

    "importance": 2,

    "keywords": ["学院暗流代价：教务处查金秤牛皮册（铜钱藏匿升级）——F-2 代价节点"],

    "irreversible": false

  },

  {

    "id": "led_f2_cost_orc",

    "type": "伏笔",

    "desc": "兽人南下代价：边关狼牙传信（北境线入网）——F-2 代价节点",

    "plant": "flag:orc_east",

    "reap": "node:world_f_cost_orc",

    "status": "open",

    "world": "兽人南下线",

    "importance": 2,

    "keywords": ["兽人南下代价：边关狼牙传信（北境线入网）——F-2 代价节点"],

    "irreversible": false

  },
  {
    "id": "led_f3_lu",
    "type": "伏笔",
    "desc": "七笔账→石料→北境矿洞（姑娘父亲死因；钥匙/柳巷七号暗屉）",
    "plant": "flag:f3_lu_secret",
    "reap": "node:world_f3_lu_4",
    "status": "open",
    "world": "银穗商路线",
    "importance": 3,
    "keywords": ["七笔账→石料→北境矿洞"],
    "irreversible": false
  },
  {
    "id": "led_f3_qingwu",
    "type": "伏笔",
    "desc": "金秤守门人候选顾长风（血灯/铁盒/密档抄件/费尔曼信）",
    "plant": "flag:f3_qw_goldscale",
    "reap": "node:world_f3_duo_2",
    "status": "open",
    "world": "学院暗流线",
    "importance": 3,
    "keywords": ["金秤守门人候选顾长风"],
    "irreversible": false
  },
  {
    "id": "led_f3_fat",
    "type": "伏笔",
    "desc": "银月商会石料线（程管事卷宗/赵福生疤/铁门关押货）",
    "plant": "flag:f3_fat_offer",
    "reap": "node:world_f3_fat_3",
    "status": "open",
    "world": "银穗商路线",
    "importance": 3,
    "keywords": ["银月商会石料线"],
    "irreversible": false
  },
  {
    "id": "led_f3_duo",
    "type": "伏笔",
    "desc": "双人线合一（矿洞铜钱共鸣/费尔曼书房——金秤之门线索聚合）",
    "plant": "flag:f3_duo1_team",
    "reap": "node:world_f3_duo_1c",
    "status": "open",
    "world": "金秤家族线",
    "importance": 4,
    "keywords": ["双人线合一"],
    "irreversible": false
  },
  {
    "id": "led_f4_blood",
    "type": "伏笔",
    "desc": "美第奇继承人线：黑漆匣/铜钥匙/绢帛石门地图/红绳信（洛伦佐·美第奇亲子=普路托斯，北境矿洞石门之后）",
    "plant": "flag:f4_blood_heir",
    "reap": "node:world_f4_blood_4",
    "status": "open",
    "world": "金秤家族线",
    "importance": 5,
    "keywords": ["美第奇继承人线"],
    "irreversible": false
  },
  {
    "id": "led_f4_echo",
    "type": "伏笔",
    "desc": "重大抉择回响网：圣痕司名录/银月商会账/荒城铁牌/学院牛皮册/狼牙/石门——旧事重提节点聚合",
    "plant": "flag:f4_blood_done",
    "reap": "flag:f4_echo_seen",
    "status": "open",
    "world": "金秤家族线",
    "importance": 4,
    "keywords": ["重大抉择回响网"],
    "irreversible": false
  },
  {
    "id": "led_f5_city",
    "type": "设定",
    "desc": "交汇城生活深描：蜜尔娜丈夫走镖旧怀表/晨市代写家书/镖局木牌——城与人情的底色",
    "plant": "flag:f5_city_done",
    "reap": "flag:f5_city_letter",
    "status": "open",
    "world": "金秤家族线",
    "importance": 3,
    "keywords": ["交汇城生活深描"],
    "irreversible": false
  },
  {
    "id": "led_f5_city",
    "type": "设定",
    "desc": "交汇城生活深描：蜜尔娜丈夫走镖旧怀表/晨市代写家书/镖局木牌——城与人情的底色",
    "plant": "flag:f5_city_done",
    "reap": "flag:f5_city_letter",
    "status": "open",
    "world": "金秤家族线",
    "importance": 3,
    "keywords": ["交汇城生活深描"],
    "irreversible": false
  },
  {
    "id": "led_f6_battle",
    "type": "伏笔",
    "desc": "北境石门战役：东军散兵占门/美第奇家纹章皮箱/洛伦佐遗信——身世线收束入口",
    "plant": "flag:f4_blood_heir",
    "reap": "flag:f6_medici_done",
    "status": "open",
    "world": "金秤家族线",
    "importance": 4,
    "keywords": ["北境石门战役"],
    "irreversible": false
  },
  {
    "id": "led_f6_medici",
    "type": "伏笔",
    "desc": "晨天故都秦氏旧档：洛伦佐末封家书寄北境金秤旧号——双线互锁伏笔",
    "plant": "flag:f6_medici_done",
    "reap": "flag:f6_medici_passed",
    "status": "open",
    "world": "金秤家族线",
    "importance": 3,
    "keywords": ["晨天故都秦氏旧档"],
    "irreversible": false
  },
  {
    "id": "led_fs6_watch",
    "type": "设定",
    "desc": "守望者被邀请制正式化：不招募只认人，主动上门者一律扑空，唯有收到铜哨并赴约者可见灰袍人（fs_watchers_02~join）",
    "plant": "flag:fs_watchers_01_done",
    "reap": "flag:fs_watchers_joined",
    "status": "open",
    "world": "守望者线",
    "importance": 3,
    "keywords": ["守望者", "铜哨", "被邀请制"],
    "irreversible": false
  },
  {
    "id": "led_fs6_orctrial",
    "type": "设定",
    "desc": "兽人王庭三试炼：徒手搏狼王/猎双狼/赤手撑一炷香——王庭认本事不认出身（fs_orc_trial）",
    "plant": "flag:fs_orc_trial_king",
    "reap": "flag:fs_orc_trial_pack",
    "status": "closed",
    "world": "兽人草原",
    "importance": 2,
    "keywords": ["王庭试炼", "狼王"],
    "irreversible": false
  },
  {
    "id": "led_f1_warwall",
    "type": "设定",
    "desc": "铁门关东墙下城边缘通道：伤兵营铁手→私酒铺刘掌柜→独眼辎重兵，军规外的活路网（F-1 failpath_warwall）",
    "plant": "flag:f_failpath_warwall_liu",
    "reap": "",
    "status": "open",
    "world": "vol_north",
    "importance": 4,
    "keywords": [
      "铁门关东墙下城",
      "私酒铺",
      "铁手"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_raid",
    "type": "设定",
    "desc": "雪原冰裂隙逃兵村（跛脚汉）：兽人营地加人、一天一车铁自南运来——缺粮军队不运铁（F-1 failpath_raid）",
    "plant": "flag:f_failpath_raid_iron",
    "reap": "",
    "status": "open",
    "world": "vol_north",
    "importance": 4,
    "keywords": [
      "逃兵村",
      "兽人运铁"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_intel",
    "type": "伏笔",
    "desc": "学院被开除生“耗子”→城东骡马行赵账房递讯切口，暗蚀会黑市情报点（F-1 failpath_intel）",
    "plant": "flag:f_failpath_intel_zhao",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": [
      "耗子",
      "骡马行",
      "暗蚀会"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_action",
    "type": "伏笔",
    "desc": "白事张殡葬行后院地道通城外乱葬岗；城西破庙铁片为暗蚀会收尾人信物（F-1 failpath_action）",
    "plant": "flag:f_failpath_action_tunnel",
    "reap": "flag:f_failpath_action_mark",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": [
      "白事张",
      "殡葬行地道",
      "铁片"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_forbid",
    "type": "伏笔",
    "desc": "禁书区无名旧册“金秤一脉守的不是书，是门。门后有什么，问守夜人”——金秤守门设定在学院图书馆的信息碎片（F-1 failpath_forbid）",
    "plant": "flag:f_failpath_forbid_goldscale",
    "reap": "node:anchor_grave_1",
    "status": "open",
    "world": "vol_academy",
    "importance": 4,
    "keywords": [
      "金秤一脉守门",
      "守夜人"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_ferman7",
    "type": "伏笔",
    "desc": "费尔曼图书馆登记簿备注栏数字“7”；每周三深夜站禁书区门前一盏茶——与第七节点钥匙线同源（F-1 failpath_ferman）",
    "plant": "flag:f_failpath_ferman_seven",
    "reap": "flag:acad_brass_key",
    "status": "open",
    "world": "vol_academy",
    "importance": 3,
    "keywords": [
      "登记簿7",
      "费尔曼",
      "禁书区"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_log",
    "type": "伏笔",
    "desc": "图书馆夹层旧守夜人轮值日志：第七节点雪夜北边有光一明一灭整夜，无人承认，记录未上报（F-1 failpath_winter）",
    "plant": "flag:f_failpath_winter_log",
    "reap": "node:acad_brass_key",
    "status": "open",
    "world": "vol_academy",
    "importance": 3,
    "keywords": [
      "守夜人轮值日志",
      "第七节点"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_blackstone",
    "type": "伏笔",
    "desc": "沙漠黑石符文与古语“井”字：商队黑石为十年前沙中挖出、挖者当夜死，灰袍夜访者仅观石不言（F-1 failpath_visitdesert）",
    "plant": "flag:f_failpath_desert_rune",
    "reap": "",
    "status": "open",
    "world": "vol_desert",
    "importance": 3,
    "keywords": [
      "沙漠黑石",
      "符文",
      "井"
    ],
    "irreversible": false
  },
  {
    "id": "led_f1_column",
    "type": "伏笔",
    "desc": "西境风暴眼石柱柱顶断裂（若耶观测记录：三年前完整，今年断一截）——元素封印线新碎片（F-1 failpath_visitwest）",
    "plant": "flag:f_failpath_west_column",
    "reap": "",
    "status": "open",
    "world": "vol_academy",
    "importance": 3,
    "keywords": [
      "风暴眼石柱",
      "若耶观测"
    ],
    "irreversible": false
  },
  {
    "id": "led_f2_purge",
    "type": "伏笔",
    "desc": "圣痕司追查的牛皮账旁叠出费尔曼名录“7”（F-2 failpath_purge）",
    "plant": "flag:f_f2_purge_ferman",
    "reap": "",
    "status": "open",
    "world": "vol_church",
    "importance": 3,
    "keywords": ["圣痕司追查的牛皮账旁叠出"],
    "irreversible": false
  },
  {
    "id": "led_f2_seal",
    "type": "伏笔",
    "desc": "封印台基被挖动时，深处另有一双“记忆”（F-2 failpath_seal）",
    "plant": "flag:f_f2_seal_touched",
    "reap": "",
    "status": "open",
    "world": "vol_abyss",
    "importance": 3,
    "keywords": ["封印台基被挖动时，深处另"],
    "irreversible": false
  },
  {
    "id": "led_f2_silver",
    "type": "伏笔",
    "desc": "柳巷七号货单：灰袍胖子的货线连着北境（F-2 failpath_silver）",
    "plant": "node:failpath_silver_3",
    "reap": "",
    "status": "open",
    "world": "vol_north",
    "importance": 3,
    "keywords": ["柳巷七号货单：灰袍胖子的"],
    "irreversible": false
  },
  {
    "id": "led_f2_orc",
    "type": "伏笔",
    "desc": "兽人渡口老兵的“狼语”：灰鬃旧部的信物（F-2 failpath_orc）",
    "plant": "flag:f_f2_orc_wolfword",
    "reap": "",
    "status": "open",
    "world": "vol_race",
    "importance": 3,
    "keywords": ["兽人渡口老兵的“狼语”："],
    "irreversible": false
  },
  {
    "id": "led_f2_tribunal",
    "type": "伏笔",
    "desc": "大审判长书案第三格的旧案卷：异端地窖闻姓档案吏手里的金秤家谱抄本（F-2 failpath_tribunal/支线B）",
    "plant": "flag:f_f2_heretic_ledger",
    "reap": "",
    "status": "open",
    "world": "vol_church",
    "importance": 3,
    "keywords": ["大审判长书案第三格的旧案"],
    "irreversible": false
  },
  {
    "id": "led_f2_caravan",
    "type": "伏笔",
    "desc": "沙盗抢货中丢的一只箱子：里头是给北境的信（F-2 failpath_caravan）",
    "plant": "flag:f_f2_caravan_market",
    "reap": "",
    "status": "open",
    "world": "vol_desert",
    "importance": 3,
    "keywords": ["沙盗抢货中丢的一只箱子："],
    "irreversible": false
  },
  {
    "id": "led_f2_keju",
    "type": "伏笔",
    "desc": "灰袍考生袖口的东境官印：晨天旧族后人迹象（F-2 failpath_keju）",
    "plant": "flag:f_f2_keju_chen",
    "reap": "",
    "status": "open",
    "world": "vol_east",
    "importance": 3,
    "keywords": ["灰袍考生袖口的东境官印："],
    "irreversible": false
  },
  {
    "id": "led_f2_westranger",
    "type": "伏笔",
    "desc": "若耶追查的红绳线：西境私线贩货（F-2 failpath_westranger）",
    "plant": "flag:f_f2_west_ruoye",
    "reap": "",
    "status": "open",
    "world": "vol_war",
    "importance": 3,
    "keywords": ["若耶追查的红绳线：西境私"],
    "irreversible": false
  },
  {
    "id": "led_f2_elftower",
    "type": "伏笔",
    "desc": "精灵塔门结界反噬时的“第七枚锚”传闻（F-2 failpath_elftower）",
    "plant": "flag:f_f2_elf_seven",
    "reap": "",
    "status": "open",
    "world": "vol_elf",
    "importance": 3,
    "keywords": ["精灵塔门结界反噬时的“第"],
    "irreversible": false
  },
  {
    "id": "led_f2_dwarfmine",
    "type": "伏笔",
    "desc": "矿道深处的“凿痕”：矮人祖先离开前的标记（F-2 failpath_dwarfmine）",
    "plant": "flag:f_f2_dwarf_mine",
    "reap": "",
    "status": "open",
    "world": "vol_dwarf",
    "importance": 3,
    "keywords": ["矿道深处的“凿痕”：矮人"],
    "irreversible": false
  },
  {
    "id": "led_f2_courier",
    "type": "伏笔",
    "desc": "第三哨换防名单里夹的密条（F-2 failpath_courier）",
    "plant": "flag:f_f2_courier_mark",
    "reap": "",
    "status": "open",
    "world": "vol_north",
    "importance": 3,
    "keywords": ["第三哨换防名单里夹的密条"],
    "irreversible": false
  },
  {
    "id": "led_f2_sewer",
    "type": "伏笔",
    "desc": "下水道阵纹下的旧渠：金秤家旧账的走私通道（F-2 failpath_sewer）",
    "plant": "flag:f_f2_sewer_goldscale",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["下水道阵纹下的旧渠：金秤"],
    "irreversible": false
  },
  {
    "id": "led_f2_bandit",
    "type": "伏笔",
    "desc": "雷击木里的钱庄火漆：弹益盗贼背后的钱路（F-2 failpath_bandit）",
    "plant": "flag:f_f2_bandit_badge",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["雷击木里的钱庄火漆：弹益"],
    "irreversible": false
  },
  {
    "id": "led_f2_realm",
    "type": "伏笔",
    "desc": "破境失败后的丹田旧伤：修行线后续（F-2 failpath_realm）",
    "plant": "flag:f_f2_realm_fail",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["破境失败后的丹田旧伤：修"],
    "irreversible": false
  },
  {
    "id": "led_f2_vault",
    "type": "伏笔",
    "desc": "学院金库失窃的铁牌：莫里茨临终托付的入口（F-2 failpath_vault）",
    "plant": "flag:f_f2_vault_mori",
    "reap": "",
    "status": "open",
    "world": "vol_academy",
    "importance": 3,
    "keywords": ["学院金库失窃的铁牌：莫里"],
    "irreversible": false
  },
  {
    "id": "led_f2_flood",
    "type": "伏笔",
    "desc": "洪水冲出的上游铁箱：渡口老郭的“第一次送货”（F-2 failpath_flood）",
    "plant": "node:failpath_flood_3",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["洪水冲出的上游铁箱：渡口"],
    "irreversible": false
  },
  {
    "id": "led_f2_market",
    "type": "伏笔",
    "desc": "黑市独眼的“金秤旧货”：七锚线索（F-2 支线A）",
    "plant": "flag:f_f2_market_anchor",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["黑市独眼的“金秤旧货”："],
    "irreversible": false
  },
  {
    "id": "led_f2_heretic",
    "type": "伏笔",
    "desc": "异端地窖的闻姓档案吏：金秤家谱抄本（F-2 支线B）",
    "plant": "flag:f_f2_heretic_ledger",
    "reap": "",
    "status": "open",
    "world": "vol_church",
    "importance": 3,
    "keywords": ["异端地窖的闻姓档案吏：金"],
    "irreversible": false
  },
  {
    "id": "led_f2_quay",
    "type": "伏笔",
    "desc": "老郭的黑箱货单：“金秤旧账，故都卷，七页，送北境”（F-2 支线C）",
    "plant": "flag:f_f2_quay_goldscale",
    "reap": "",
    "status": "open",
    "world": "vol_free",
    "importance": 3,
    "keywords": ["老郭的黑箱货单：“金秤旧"],
    "irreversible": false
  },
  {
    "id": "led_f3_cell",
    "desc": "F-3 蒙羞支线甲·狱中故人：何账房的锉刀与老赵铁匠铺的人情（铁门关）",
    "plant": "flag:f_failrep_he_errand",
    "reap": "flag:f_failrep_cell_done",
    "status": "open",
    "world": "vol_war",
    "importance": 2,
    "keywords": ["何账房", "老赵铁匠铺"],
    "irreversible": false
  },
  {
    "id": "led_f3_cove",
    "desc": "F-3 蒙羞支线乙·蒙羞者集会：夜莺的信使与雪原散人结盟（北境）",
    "plant": "flag:f_failrep_cove_letter",
    "reap": "flag:f_failrep_cove_done",
    "status": "open",
    "world": "vol_war",
    "importance": 2,
    "keywords": ["夜莺", "青桐驿", "雪原信使"],
    "irreversible": false
  },
    {
        "id": "led_goal_wealth",
        "type": "伏笔",
        "desc": "富甲天下践行线（南境黄金城→银穗商路→承天账房→铁门关税关）：第一笔买卖、第一课、三倍税钱的记账",
        "plant": "flag:ideal_goal_wealth",
        "reap": "flag:ideal_goal_wealth_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["富甲天下", "黄金城", "银穗", "铁门关"],
        "irreversible": false
  },
    {
        "id": "led_goal_might",
        "type": "伏笔",
        "desc": "威震四海践行线（铁门关→第三哨→北境雪原）：校场立威、半个老兵、冰谷一换五的成名战",
        "plant": "flag:ideal_goal_might",
        "reap": "flag:ideal_goal_might_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["威震四海", "铁门关", "第三哨", "雪原"],
        "irreversible": false
  },
    {
        "id": "led_goal_guard",
        "type": "伏笔",
        "desc": "守护苍生践行线（圣辉城救济堂→西境难民营→南境疫村→东境流民）：一碗粥、一瓢水、隘口独挡五劫匪",
        "plant": "flag:ideal_goal_guard",
        "reap": "flag:ideal_goal_guard_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["守护苍生", "圣辉城", "元素荒原", "疫村"],
        "irreversible": false
  },
    {
        "id": "led_goal_truth",
        "type": "伏笔",
        "desc": "探寻真相践行线（北境旧图书馆→墓园无字碑→晨天故都地下档案室）：路德维希的灯、金秤徽记、『灯会灭账不会』",
        "plant": "flag:ideal_goal_truth",
        "reap": "flag:ideal_goal_truth_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["探寻真相", "无字碑", "晨天故都", "金秤"],
        "irreversible": false
  },
    {
        "id": "led_goal_free",
        "type": "伏笔",
        "desc": "自由自在践行线（北境雪原→元素荒原风眼→西境海崖观星台）：雪原规矩、风眼旧城、观星台刻名、风暴夜救人",
        "plant": "flag:ideal_goal_free",
        "reap": "flag:ideal_goal_free_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["自由自在", "元素荒原", "西境", "海崖"],
        "irreversible": false
  },
    {
        "id": "led_goal_god",
        "type": "伏笔",
        "desc": "登临神座践行线（矮人铁镇→古神遗迹回廊→圣山银月祭坛）：第七块石板、登神三关、第七枚符文",
        "plant": "flag:ideal_goal_god",
        "reap": "flag:ideal_goal_god_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["登临神座", "圣山", "银月祭坛", "古神"],
        "irreversible": false
  },
    {
        "id": "led_goal_fame",
        "type": "伏笔",
        "desc": "名留青史践行线（南境驿站→王都诗人院→承天史官院→铁门关）：皮埃尔正传、陶史官三十年、铁门关一刀",
        "plant": "flag:ideal_goal_fame",
        "reap": "flag:ideal_goal_fame_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["名留青史", "王都", "史官院", "铁门关"],
        "irreversible": false
  },
    {
        "id": "led_goal_revenge",
        "type": "伏笔",
        "desc": "以血还血践行线（东境官道→黑市→灰袍账房→密林对决）：三本账、灰袍翻账、刀鞘内侧划掉名字",
        "plant": "flag:ideal_goal_revenge",
        "reap": "flag:ideal_goal_revenge_pursued",
        "status": "open",
        "world": "vol_free",
        "importance": 1,
        "keywords": ["以血还血", "灰袍", "齐记木行", "旧宅"],
        "irreversible": false
  }
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
,
  {
    "id": "led_c2_hub",
    "desc": "C-2 主线聚合枢纽：多入单出路径变体正文，主线判定零改动",
    "plant": "flag:anchor_1",
    "reap": "flag:anchor_7",
    "status": "open",
    "world": "vol_all",
    "importance": 2,
    "keywords": ["聚合枢纽", "hub_review_1"],
    "irreversible": false
  },
  {
    "id": "led_p1_tie",
    "desc": "老铁与主角的搭档信任线（情感搭档）",
    "plant": "frontier_pt_01",
    "reap": "flag:p_tie_complete",
    "status": "open",
    "world": "vol_north",
    "importance": 3,
    "keywords": ["老铁", "搭档", "frontier_pt_01"],
    "irreversible": false
  },
  {
    "id": "led_p1_son",
    "desc": "铁生矿难真相（替班/炸药/结义兄弟）",
    "plant": "frontier_pt_04",
    "reap": "frontier_pt_18",
    "status": "open",
    "world": "vol_north",
    "importance": 3,
    "keywords": ["铁生", "矿难", "矿洞"],
    "irreversible": false
  },
  {
    "id": "led_w1_goldstamp",
    "desc": "承天城金库失窃（金库失窃官银，守夜人投井——金库线索呼应）",
    "plant": "event:w1_goldstamp",
    "reap": "flag:anchor_4",
    "status": "open",
    "world": "vol_east",
    "importance": 2,
    "keywords": ["金库", "承天城", "失窃"],
    "irreversible": false
  },
  {
    "id": "led_w2_bell2",
    "desc": "第三哨铁牌再现（铜钟被敲三下，钟下留铁牌）",
    "plant": "event:w2_g_bell2",
    "reap": "flag:anchor_1",
    "status": "open",
    "world": "vol_north",
    "importance": 2,
    "keywords": ["铁牌", "第三哨", "铜钟"],
    "irreversible": false
  },
  {
    "id": "led_w2_finaliron",
    "desc": "老铁战后打造七枚铁牌（终局伏笔）",
    "plant": "event:w2_final_iron",
    "reap": "flag:anchor_7",
    "status": "open",
    "world": "vol_north",
    "importance": 2,
    "keywords": ["老铁", "铁牌", "终局"],
    "irreversible": false
  },
  {
    "id": "led_w1_sealwax",
    "desc": "圣辉城封蜡印七枚铁牌纹样（教会与七锚暗连）",
    "plant": "event:w1_sealwax",
    "reap": "flag:anchor_6",
    "status": "open",
    "world": "vol_church",
    "importance": 2,
    "keywords": ["圣辉城", "封蜡", "铁牌"],
    "irreversible": false
  }
];

/* ===== /v91inj:ledgerwords:end/ ===== */
