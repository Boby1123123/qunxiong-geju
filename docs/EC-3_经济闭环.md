# EC-3 经济闭环（v93）

批次：EC-3 · 2026-09-11 · 八批大型更新第三批
状态：已完成，ci 全绿

## 扩了什么

- 新建 `src\data_nodes\dn_market.js`：
  - `MARKET_ROUTES_V93` 三条商路：自由城⇄北境（皮毛铁器/矿石换粮）、自由城⇄沙漠（草药香料）、自由城⇄西境（元素结晶）。
  - `MARKET_DIV_V93` 分红参数：period 7 天 / base 3 金龙 / grow 1。
- `applyDefaults` 新增 `s.market={lastDiv:0, divTotal:0}`（独立键，旧档兼容）。
- `advanceDays` 尾部挂 `v93_marketTick(n)`：每 7 天且（guild 势力 or merchant_saved flag）发红利 `S.gold += div`，同步 v93_actLog + logMsg。
- `src\script_04.js` `/v93mkt/` IIFE：`v93_openMarketPanel()` 调 `v92_openTradePanel()` 后插入商路 + 分红信息块；mechTrade 加商路按钮。

## 为什么

原经济只有"打工→花钱"单向流，商路/商会势力无实质收益。EC-3 把三条商路变成周期性分红来源（每 7 天），玩家加入商会或经营后 gold 有被动增长曲线，经济系统形成闭环；交易面板同时展示商路行情，信息密度提升。

## 如何验证

- bu 实测：交易面板显示三条商路（自由城⇄北境/沙漠/西境）与分红说明。
- 时间推进跨 7 天倍数时 logMsg 出现分红播报、gold 增加（代码路径 v93_marketTick）。
- 存档兼容：s.market 为 applyDefaults 兜底键，旧档读入零异常。
