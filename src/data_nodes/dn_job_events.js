/* /u1inj:data-nodes:dn_job_events.js/ UPG-16 职业事件池（数据驱动）
 * JOB_EVENTS：职业专属世界事件（CoffeeMud 职业权重差异的落地——按职业过滤触发）。
 * 每条 {job, day, cls, text, cond}；由 v92_scanJobEvents 扫描（并入 v92_scanHooks 调用链）：
 *   S.job 匹配 + day 到达 + S.world['ev_'+id] 未触发 → 播报。与 EVENT_POOL_EXT 176 事件互不干扰。
 * 铁律：day 与五主线错开；数组末项无尾逗号（此文件末尾一项）；不触碰现有事件触发逻辑。
 */
const JOB_EVENTS = [
  { id: "je_mage_mana", job: "魔法师", day: 72, cls: "奇遇", text: "奥术潮汐漫过北境，法师塔的灯整夜不熄。元素结晶在集市上被抢购一空——正是懂行的人出手的时候。" },
  { id: "je_mage_archive", job: "魔法师", day: 156, cls: "奇遇", text: "学院禁书区传来异响，图书馆长闭馆三日。有传言说，是某本古书的封印松动了。" },
  { id: "je_soul_spirit", job: "灵魂法师", day: 88, cls: "奇遇", text: "墓园的烛火无风自动。守墓人说，最近亡者的低语比往年密——灵魂法师能听见别人听不见的。" },
  { id: "je_soul_echo", job: "灵魂法师", day: 214, cls: "人祸", text: "老莫里茨生前留下的账册，被人在旧书店里翻了出来。上面记着一些不该记的名字。" },
  { id: "je_sor_wild", job: "术士", day: 96, cls: "天灾", text: "元素风暴在荒原上空盘旋三日。术士的血脉在躁动——混沌之力离得更近了。" },
  { id: "je_sor_omen", job: "术士", day: 240, cls: "奇遇", text: "有术士梦见七枚铁牌在黑暗中互相叩击。醒来时，枕边多了一片焦黑的铁屑。" },
  { id: "je_war_levy", job: "战士", day: 68, cls: "人祸", text: "铁门关发出征兵令，北境联军四处征召壮丁。老兵说，这一仗怕是躲不掉了。" },
  { id: "je_war_tourney", job: "战士", day: 148, cls: "商机", text: "自由城邦举办比武大会，赏金丰厚。各路的刀客剑客，都往斗兽场赶。" },
  { id: "je_knight_oath", job: "骑士", day: 82, cls: "奇遇", text: "圣城骑士团重开誓约仪式，老骑士们检验新一代的忠诚与剑术。" },
  { id: "je_knight_crusade", job: "骑士", day: 208, cls: "人祸", text: "教会发布圣战令，号召骑士南下清剿异端。教廷的旗帜，第一次越过银穗河。" },
  { id: "je_ranger_wild", job: "游侠", day: 70, cls: "天灾", text: "狼群大规模南迁，猎人们说它们是被什么东西赶出来的。草原上的兽人部族也动了。" },
  { id: "je_ranger_path", job: "游侠", day: 176, cls: "奇遇", text: "林间古道被藤蔓封死，有人在里面听见了精灵的号角声。" },
  { id: "je_thief_guild", job: "盗贼", day: 78, cls: "商机", text: "地下黑市放出风声：有人出高价收购铁牌残片。不问来路。" },
  { id: "je_thief_heist", job: "盗贼", day: 184, cls: "人祸", text: "美第奇商会的金库失窃，陆昭亲自督办。城里的暗巷一夜之间搜了个遍。" },
  { id: "je_priest_mass", job: "牧师", day: 74, cls: "奇遇", text: "圣城大教堂举行大弥撒，圣痕司的执事在人群里挑选「受印者」。" },
  { id: "je_priest_inq", job: "牧师", day: 206, cls: "人祸", text: "审判官带着异端名单进了城。名单上的人，一夜之间全部消失了。" },
  { id: "je_merch_market", job: "商人", day: 66, cls: "商机", text: "银穗商路短暂复通，第一批商队赚得盆满钵满。消息灵通的人已经开始囤货。" },
  { id: "je_merch_blockade", job: "商人", day: 162, cls: "天灾", text: "商路被军阀切断，货物积压在驿站。商会紧急开会，商量绕道西境的路线。" }
];
if (typeof window !== 'undefined') { window.JOB_EVENTS = JOB_EVENTS; }
