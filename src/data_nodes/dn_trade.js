/* /g1inj:trade/ G-N1 商路经营小循环 —— 商品表 / 城市行情系数 / 事件价格扰动（纯数据，无逻辑） */
const TRADE_GOODS_V92 = {
  "iron": {"cn":"铁锭","base":8,"unit":"块","desc":"矿山城的炉火里出来的硬通货，铁匠与军需都离不开。"},
  "grain": {"cn":"粮袋","base":6,"unit":"袋","desc":"河湾的麦子。商路一断，它是第一批涨价的。"},
  "salt": {"cn":"盐","base":5,"unit":"石","desc":"海港晒出来的白金子，内陆价高。"},
  "fur": {"cn":"皮毛","base":12,"unit":"张","desc":"北境雪原的狼皮熊皮，裁缝与贵人的衣橱都要。"},
  "herb": {"cn":"药材","base":10,"unit":"捆","desc":"森林城晒干的草药，瘟疫之年比命值钱。"},
  "spice": {"cn":"香料","base":25,"unit":"匣","desc":"沙漠驼队背来的紫檀匣，贵妇人的香料柜。"},
  "crys": {"cn":"元素结晶","base":40,"unit":"颗","desc":"西境荒原风暴眼里刮出来的蓝光，炼金炉的燃料。"},
  "rune": {"cn":"符文纸","base":30,"unit":"刀","desc":"学术城魔法作坊的墨线纸，法师们抢着要。"},
  "wine": {"cn":"麦酒","base":7,"unit":"桶","desc":"码头边的廉价快乐，灰港的船工一天两桶。"},
  "silk": {"cn":"丝绸","base":35,"unit":"匹","desc":"东境织坊的云锦，一匹顶小户人家半年嚼用。"}
};
window.TRADE_GOODS_V92 = TRADE_GOODS_V92;
const TRADE_MARKET = {
  "jiaohui": {"mul":1.00,"hot":["spice","silk"],"prod":[],"cn":"交汇城"},
  "jishi": {"mul":0.95,"hot":[],"prod":[],"cn":"集市城"},
  "gonghui": {"mul":1.10,"hot":["rune","herb"],"prod":[],"cn":"冒险者之城"},
  "huigang": {"mul":0.90,"hot":["wine","salt"],"prod":[],"cn":"灰港"},
  "huangjin": {"mul":1.15,"hot":["silk","spice"],"prod":[],"cn":"黄金城"},
  "shangzhan": {"mul":0.85,"hot":[],"prod":[],"cn":"商栈城"},
  "kuangshan": {"mul":1.00,"hot":["iron"],"prod":["iron"],"cn":"矿山城"},
  "hewan": {"mul":1.00,"hot":["grain"],"prod":["grain"],"cn":"河湾城"},
  "aierda": {"mul":1.20,"hot":["rune","herb"],"prod":[],"cn":"艾尔达城"},
  "tiebi": {"mul":1.05,"hot":["iron","fur"],"prod":[],"cn":"铁壁城"},
  "beijing": {"mul":1.10,"hot":["fur"],"prod":["fur"],"cn":"北境城"},
  "bianyuan": {"mul":1.30,"hot":["spice"],"prod":[],"cn":"沙漠边缘"},
  "chengtian": {"mul":1.10,"hot":["silk"],"prod":["silk"],"cn":"承天城"},
  "huangyuan": {"mul":1.25,"hot":["crys"],"prod":["crys"],"cn":"元素荒原"}
};
window.TRADE_MARKET = TRADE_MARKET;
/* 事件价格扰动：{事件id:{商品:倍率}} —— 事件 day 起 20 日内生效（只读查 day，不改事件池） */
const TRADE_EVENTS = {
  "bandit": {"iron":1.3,"grain":1.2},
  "grain": {"grain":1.4},
  "sflood": {"grain":1.5,"salt":1.2},
  "silverbank": {"spice":1.2,"silk":1.3},
  "hstorm": {"crys":1.6},
  "meteor": {"iron":1.2},
  "silver": {"grain":1.3,"salt":1.1},
  "seal": {"crys":1.3,"rune":1.2}
};
window.TRADE_EVENTS = TRADE_EVENTS;
