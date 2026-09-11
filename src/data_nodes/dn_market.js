/* /v93mkt:data/ EC-3 经济闭环：3 商路 + 商会分红档位（纯数据，只被 v93_marketTick / v93_openMarketPanel 读取） */
window.MARKET_ROUTES_V93 = [
  {id:"r1", name:"自由城 ⇄ 北境", desc:"皮毛与铁器北运，北地的矿石换南方的粮。", goods:["iron","fur"], fee:2},
  {id:"r2", name:"自由城 ⇄ 沙漠", desc:"草药与香料经驼队进出，风沙里总藏着行情。", goods:["herb","spice"], fee:3},
  {id:"r3", name:"自由城 ⇄ 西境", desc:"元素结晶在荒原边缘流转，利润与风险同样高。", goods:["crystal","herb"], fee:4}
];
window.MARKET_DIV_V93 = { period:7, base:3, grow:1 };
