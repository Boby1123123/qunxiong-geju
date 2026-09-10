/* /u1inj:data-nodes:dn_registry.js/ UPG-15 节点物理分区注册表（CoffeeMud areas/ 模式）
 * NODE_REGISTRY：九域 × 前缀组 —— 节点 ID 命名规范 `<prefix>_<area>_<seq>` 的域索引，
 * 替代 scene_list 概念；供 elda ci c_regions 检查器核验"每个节点 id 可归入已知域"。
 * 本表为静态分区元数据（只读）；运行时节点加载仍走 NODE_MAP 分片（渐进式分片架构）。
 * 新增内容时：新节点前缀必须已在此表登记，否则 ci WARN。
 */
const NODE_REGISTRY = {
  north: {
    name: "北境", prefixes: ["north", "frontier", "tiebi", "beijing", "tm", "grad", "warphase", "war", "abyss", "relic", "slow"],
    desc: "铁门关/第三哨/学院周边/战争前线；毕业去向-参军线",
    files: ["dn_frontier.js", "dn_graduate.js", "dn_warphase.js", "dn_anchor.js"]
  },
  free: {
    name: "自由城邦", prefixes: ["fc", "city", "cityev", "guild", "tavern", "gangkou", "hewan", "shop", "house", "echo"],
    desc: "交汇城/自由城汇流段/行会/夜巷/下水道",
    files: ["dn_camp.js"]
  },
  academy: {
    name: "学院", prefixes: ["academy", "acad", "classmate", "alumni", "orientation", "facility", "xueshu"],
    desc: "艾尔达魔法学院五学年/同学/导师/禁书区/毕业四去向",
    files: ["dn_alumni.js", "dn_graduate.js"]
  },
  desert: {
    name: "死亡沙漠", prefixes: ["desert", "dun", "underworld"],
    desc: "沙漠边缘/深渊神殿/绿洲集市/古代遗迹/驼队驿站",
    files: ["dn_desert.js"]
  },
  west: {
    name: "西境", prefixes: ["west", "airship", "floating"],
    desc: "元素荒原/游侠学院/西境行省会",
    files: ["dn_west.js"]
  },
  east: {
    name: "东境", prefixes: ["east", "aurelian", "chen", "shangzhan", "succession", "court", "messenger"],
    desc: "承天城/帝京/科举特科/铁门关呼应/晨天故都",
    files: ["dn_east.js"]
  },
  church: {
    name: "光明教会", prefixes: ["church", "seal", "seal1", "seal2", "seal3", "seal4", "seal5", "seal6", "seal7", "faith", "judge", "seraph", "crusade", "anchor", "goldscale"],
    desc: "圣城/大教堂/审判庭/圣痕司/异端牢房/七锚封印线",
    files: ["dn_church.js", "dn_anchor.js"]
  },
  elf_dwarf_orc: {
    name: "精灵/矮人/兽人", prefixes: ["elf", "dwarf", "orc", "senlin", "kuangshan", "worldtree", "genocide"],
    desc: "精灵林邦/矮人山国/兽人草原诸部/神谕之地",
    files: []
  },
  system: {
    name: "引擎/系统/全局", prefixes: ["origin", "prologue", "sub", "arc", "npc", "ending", "travel", "arrive", "branch", "evt", "world", "event", "quest", "job", "goal", "deity", "class", "pol", "moral", "karma", "attr", "realm", "item", "battle", "combat", "foreshadow", "memory", "chronicle", "hook", "fsh", "p12", "sp8", "w64", "ngplus", "u8", "wait", "dialogue", "past", "hidden", "ripple", "chapter", "transition", "consequence", "aftermath", "encounter", "plague", "vacation", "relation", "mat", "council", "knowledge", "landmark", "prophecy", "magic", "letter", "fate", "time", "journey", "reunion", "watcher", "watchers", "primordial", "noble", "house", "language", "v65", "v652", "v653", "v654", "v655", "v56s", "v24", "v25", "v47", "i", "h", "faction", "eclipse", "extinct", "board", "south", "pro", "disaster", "moxie", "post", "final", "dungeon", "causality", "hlj", "missed", "game", "haigang", "mother", "rumor", "silence", "timeline", "adventure", "u1", "v23", "sleep", "act", "open", "document", "successor", "unresolved", "title", "pov", "id", "god", "story", "daily", "llm", "seven", "continent", "parallel", "demigod", "race", "epilogue", "countdown"],
    desc: "建号/序章/职业分支/好感/结局/事件池/系统检查前缀；v65* 为历史版本遗留前缀（WARN 豁免）",
    files: []
  }
};
if (typeof window !== 'undefined') { window.NODE_REGISTRY = NODE_REGISTRY; }
