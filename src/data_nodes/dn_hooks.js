/* /u1inj:data-nodes:dn_hooks.js/ UPG-14 事件池全局钩子（Evennia Scripts 模式）
 * 纯数据层：GLOBAL_HOOKS = 全局条件触发器表（不绑定具体节点，挂在游戏主循环）。
 * condition 为 JS 表达式字符串（只允许读 S 状态，引擎层 try/catch 求值，失败即跳过）；
 * 触发机制由 src\script_03.js 的 window.v92_scanHooks 实现（节点切换后扫描）。
 * eventId 用于去重（S.world['ev_'+eventId]），text 为触发播报文本；cooldown 天 / maxTriggers 上限。
 * 铁律：不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义；只新增独立键 S.hooksState。
 */
const GLOBAL_HOOKS = [
  {
    id: "hook_bounty",
    condition: "(typeof S!=='undefined'&&S&&typeof S.rep==='number'&&S.rep<=-30)",
    eventId: "h_bounty",
    cooldown: 30, maxTriggers: 3,
    text: "城门口新贴出一张告示，画着你的脸，写着“悬赏缉拿”。衙役们见了你，视线在你身上多停了片刻——城里的风头，开始不对了。"
  },
  {
    id: "hook_border",
    condition: "(typeof S!=='undefined'&&S&&typeof S.day==='number'&&S.day>50&&S.day%5===0)",
    eventId: "h_border",
    cooldown: 10, maxTriggers: 6,
    text: "边境线上又有动静。一队溃兵从北面撤下来，说军阀的探子已经过了河。商路上的驼队，比昨天少了一半。"
  },
  {
    id: "hook_abyss",
    condition: "(typeof S!=='undefined'&&S&&typeof S.abyssCorruption==='number'&&S.abyssCorruption>30)",
    eventId: "h_abyss",
    cooldown: 40, maxTriggers: 2,
    text: "夜里，大地深处传来一声闷响，像是某种巨大的东西翻了个身。井水泛起黑沫，村人说是“渊气”渗上来了。"
  },
  {
    id: "hook_vendetta",
    condition: "(function(){try{var r=S.npcRelations||{};for(var k in r){if(r[k]<=-60)return true;}return false;}catch(e){return false;}})()",
    eventId: "h_vendetta",
    cooldown: 25, maxTriggers: 2,
    text: "你在暗处被人盯上了。先是旅店的窗纸被捅了个洞，再是有人在你常走的巷口放了一柄带血的短刀——仇家，找上门了。"
  },
  {
    id: "hook_wealth",
    condition: "(typeof S!=='undefined'&&S&&typeof S.gold==='number'&&S.gold>=500)",
    eventId: "h_wealth",
    cooldown: 20, maxTriggers: 1,
    text: "财不露白。你最近出手阔绰，商会那边已经有人递话来“借”你的本金周转。白花花的银子，也引来了红眼的狼。"
  }
];
if (typeof window !== 'undefined') { window.GLOBAL_HOOKS = GLOBAL_HOOKS; }
