/* /u1inj:data-nodes:dn_chronicle.js/ UPG-17 编年史系统（世界史自适应叙事）
 * 纯数据层：CHRONICLE_RULES = 编年史自动记录规则表。
 * 每条 {match, kind(prefix|exact), eventType, desc, importance(1-5)}：
 *   writeNext 渲染节点时，v92_chronicleCheck 按 kind 匹配 node.id，
 *   命中且该 eventType 尚未记录（S.chronicle 最近 200 条内去重）→ v92_chronicleAdd 写入。
 * desc 支持 {n} 占位（游戏名/主角名），由引擎替换。
 * 玩家不知道的事件不出现：只有玩家实际到达的节点才会触发记录（Heaven's Vault 知识模型）。
 */
const CHRONICLE_RULES = [
  {match:"origin_", kind:"prefix", eventType:"出身", desc:"{n} 自 {homeland} 出发，踏上了流浪之路。", importance:1},
  {match:"fc_", kind:"prefix", eventType:"自由城", desc:"{n} 抵达自由城邦，在这座灰与金的城市里谋生。", importance:1},
  {match:"acad_", kind:"prefix", eventType:"学院", desc:"{n} 进入艾尔达魔法学院，成为一名学生。", importance:2},
  {match:"grad_", kind:"prefix", eventType:"毕业", desc:"{n} 完成学业，选择了毕业后的道路。", importance:3},
  {match:"goldscale_", kind:"prefix", eventType:"金秤真相", desc:"金秤家族的真相传到了 {n} 耳中——守门人世家的秘密。", importance:5},
  {match:"anchor_", kind:"prefix", eventType:"七锚", desc:"{n} 触及了七锚之一的秘密。", importance:5},
  {match:"frontier_bell", kind:"prefix", eventType:"铁牌", desc:"第三哨的铜钟铭文，把 {n} 引向铁牌之谜。", importance:4},
  {match:"frontier_seal", kind:"prefix", eventType:"封印", desc:"{n} 在第三哨参与了封印抉择。", importance:4},
  {match:"alumni_ata", kind:"prefix", eventType:"神谕", desc:"{n} 从狼骨与神谕之地，听到了兽人的古老声音。", importance:4},
  {match:"warphase_", kind:"prefix", eventType:"战争", desc:"七阶段战争推进，{n} 亲历了战局变化。", importance:4},
  {match:"purge_", kind:"prefix", eventType:"净化令", desc:"教会净化令的风暴刮过，{n} 身在局中。", importance:3},
  {match:"silver_", kind:"prefix", eventType:"银穗商路", desc:"银穗商路的风波波及 {n}。", importance:3},
  {match:"seal_", kind:"prefix", eventType:"深渊封印", desc:"深渊封印的松动，让 {n} 看到了裂隙。", importance:4},
  {match:"orc_", kind:"prefix", eventType:"兽人战争", desc:"兽人诸部的战争逼近，{n} 见证了大潮。", importance:4},
  {match:"church_", kind:"prefix", eventType:"教会", desc:"{n} 深入光明教会的核心事务。", importance:3},
  {match:"dn_desert", kind:"prefix", eventType:"沙漠", desc:"{n} 穿行死亡沙漠，与沙海中的秘密相遇。", importance:2},
  {match:"dn_west", kind:"prefix", eventType:"西境", desc:"{n} 踏足西境荒原，见识了元素风暴。", importance:2},
  {match:"dn_east", kind:"prefix", eventType:"东境", desc:"{n} 来到东境承天城，卷入帝京风云。", importance:3},
  {match:"i_bond_", kind:"prefix", eventType:"羁绊", desc:"{n} 与一位重要之人结下羁绊。", importance:2},
  {match:"ending_", kind:"prefix", eventType:"终章", desc:"{n} 的故事走到了终点。", importance:5}
];
if (typeof window !== 'undefined') { window.CHRONICLE_RULES = CHRONICLE_RULES; }
