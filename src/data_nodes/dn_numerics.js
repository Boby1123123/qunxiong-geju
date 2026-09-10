/* /g3inj:data/ G-N3 数值台阶：区域难度分级 + 战力评级参考（纯数据，只读参考层，不参与判定） */
const REGION_TIER_V92 = {
  "free":    {tier:1, name:"青铜",  cities:{"jiaohui":1,"jishi":1,"gonghui":1,"huigang":1}, desc:"中立之地，什么都能买到，也什么都能丢掉。新手起步区。"},
  "north":   {tier:2, name:"黑铁",  cities:{"aierda":2,"hewan":1,"kuangshan":2,"senlin":2,"tiebi":2,"beijing":3,"disanshao":3,"haigang":2}, desc:"七公国联邦。越往北越冷，越靠近战争越硬。"},
  "south":   {tier:2, name:"黑铁",  cities:{"huangjin":2,"moxie":2,"xueshu":2,"shangzhan":2,"gangkou":2}, desc:"金钱联邦。账本比刀剑更锋利，商路即是战场。"},
  "church":  {tier:2, name:"黑铁",  cities:{"shengcheng":2}, desc:"神权国度。圣光之下有审判庭，也有异端牢房。"},
  "west":    {tier:3, name:"白银",  cities:{"xingsheng":3,"youxia":3,"huangyuan":4}, desc:"元素荒原。风暴与兽潮之下，只有老手和疯子讨生活。"},
  "east":    {tier:3, name:"白银",  cities:{"chengtian":3,"tiemen":4}, desc:"东方帝国。科举取士，边关兵甲森森。"},
  "desert":  {tier:3, name:"白银",  cities:{"bianyuan":2,"lvzhou":3,"tuoduo":3,"yiji":4,"shendian":5}, desc:"死亡沙漠。越往南越深，深处埋着深渊的七号封印。"},
  "elf":     {tier:4, name:"黄金",  cities:{"wangting":4}, desc:"精灵王国。迷雾封锁三百年，世界树根须直抵深渊边缘。"},
  "dwarf":   {tier:4, name:"黄金",  cities:{"wangdu":4}, desc:"矮人王国。石门沉重，矿脉枯竭，熔炉仍在山腹轰鸣。"},
  "orc":     {tier:4, name:"黄金",  cities:{"heishi":4,"shengshan":5}, desc:"兽人草原。马蹄与战鼓声中，一个统一的大汗正在崛起。"}
};
const TIER_NAMES_V92 = {
  1: {name:"青铜",   ref:"初出茅庐：能在中立之地接活、跑商、混口饭吃。",   min:0},
  2: {name:"黑铁",   ref:"小有名声：可以在公国与商路间来去，敢看大城的眼色。", min:60},
  3: {name:"白银",   ref:"一方好手：边疆与帝国的门槛。荒原的风、东方的兵，都认得你。", min:120},
  4: {name:"黄金",   ref:"国之栋梁：精灵与矮人的古老门槛，深渊裂隙边的常客。", min:200},
  5: {name:"秘银",   ref:"传奇之资：圣山、故都、封印深处。与你同行的，只剩传说。", min:260},
  6: {name:"龙晶",   ref:"大陆顶点：七锚之约的终局，与诸神同席的一步之遥。", min:330}
};
const TIER_REF_V92 = [
  {tier:1, atk:5,  def:5,  note:"村口恶狼的水平。铁器、粗布、旧药，够用。"},
  {tier:2, atk:12, def:10, note:"职业佣兵的门槛。要开始挑装备与同伴。"},
  {tier:3, atk:22, def:18, note:"精锐哨骑。普通刀剑已留不下什么疤。"},
  {tier:4, atk:36, def:30, note:"骑士团长的战力。魔法与血脉开始比力气更值钱。"},
  {tier:5, atk:55, def:45, note:"王国柱石。寻常军队见了你，会先敬礼再让路。"},
  {tier:6, atk:80, def:65, note:"传说本身。与深渊对话，替大陆做决定。"}
];
window.REGION_TIER_V92 = REGION_TIER_V92;
window.TIER_NAMES_V92 = TIER_NAMES_V92;
window.TIER_REF_V92 = TIER_REF_V92;
