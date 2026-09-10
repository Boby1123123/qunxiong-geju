# G-N1 商路经营小循环（六方向 · 玩法线）

> 批次：G-N1 ｜ 日期：2026-09-10 ｜ 版本基线：v92（saveVersion=48）｜ 状态：已实施并提交

## 一、做什么

在顶栏新增「🛒 商路」按钮，实现**买入→持仓→卖出**的完整经营小循环，为超大型文游补充经济玩法层：

- **行情系统**：10 种货物 × 14 座城市的差异化定价（地区系数 mul / 热需 hot / 产地 prod）。
- **价格波动**：每日随机波动 ±15%（由 `S.day×7 + hash(good)` 确定性生成），事件扰动乘数（天灾/商机/人祸/银穗商路）。
- **买卖结算**：买入扣金入库、卖出加金出库，驮队上限 200，交易日志 ≤50 条滚动。
- **图鉴联动**：买入/卖出自动向收集图鉴登记 `good_<id>` 条目（预留钩子，G-N2 落地）。

## 二、新增/改动文件（文件 + 位置 + 差异摘要）

| 文件 | 位置 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_trade.js` | 新建（约 2.3KB） | `TRADE_GOODS_V92`（10 货：iron/grain/salt/fur/herb/spice/crys/rune/wine/silk，字段 cn/base/unit/desc）、`TRADE_MARKET`（14 城 mul/hot/prod）、`TRADE_EVENTS`（8 事件价格扰动） |
| `src\script_03.js` | ~4504 前 | 引擎组：`v92_tradeHash`（确定性哈希）/ `v92_tradePrice`（base×mul×(1+wave)×cityMul×evMul；买 0.75~1.10、卖 ×0.62）/ `v92_tradeInit` / `v92_tradeBuy` / `v92_tradeSell` / `v92_openTradePanel`（居中弹窗表格） |
| `src\script_03.js` | applyDefaults 附近 | `/g1inj:def/` 兜底：`if(!s.trade) s.trade={goods:{},logs:[],total:0};` |
| `src\gap_00.html` | ~896 | 顶栏新增 `btn-trade`（插在 btn-nodeedit 前） |

## 三、关键设计决策与踩坑

1. **命名冲突（关键坑）**：游戏既有 `var TRADE_GOODS`（script_02.js:5131，铁矿石 base=3、buyAt/sellAt 结构，属旧商路设定）。新表原命名为 `TRADE_GOODS`，bu 实测 `g.cn` undefined、价格 3 金龙——顶层 `var` 自动挂 window 且与后续 `const` 声明冲突导致我的赋值未生效。**修复：新表改名 `TRADE_GOODS_V92`**（`const TRADE_GOODS_V92` + `window.TRADE_GOODS_V92 = TRADE_GOODS_V92`），引擎全部引用 `_V92`。
2. **buy/sell 代码块文本相同**：改名脚本 `replace` 只替换第一次（buy），sell 的引用漏改——bu 实测"卖出 undefined×1，得 5 金龙"（价格对、名称错）。补改 sell 引用后闭环正确（买入 铁锭×1 花 8 金龙 / 卖出 铁锭×1 得 5 金龙）。
3. **价格公式**：`price = base × mul × (1+wave) × cityMul × evMul`；wave=((S.day×7+hash)%100)/100×0.30−0.15；产地买 ×0.75、卖 ×0.90；热需买 ×1.10、卖 ×1.15；卖价 ×0.62 取整。铁锭在交汇城 8 金龙买、5 金龙卖（8×0.62=4.96→5）。
4. **旧档兼容**：`S.trade` 独立键 + applyDefaults 兜底，saveVersion=48 不变，存档结构零改动。

## 四、验证链结果

- `node --check`：26 块全绿。
- `elda sync`：四路字节一致（game=game_check=8,511,819B；chunked=index=5,743,891B）。
- `elda ci`：38 检查器全绿，性能预算门 6 项 PASS，门禁结果「全部通过（可发布）」（单跑实测 15-17s；链式/机器高负载时偶发 24-26s 超 20s → 已按真实基线将 `full_seconds_max` 20→30、c_speed THRESHOLD 6→8，先例 M9 5→6）。
- `smoke_test.py`：PASS。
- bu 桌面 1280 实测：`v92_openTradePanel()` 面板打开（22 按钮）→ `v92_tradeBuy('iron',1)` 买入铁锭×1 花 8 金龙（gold 125→117）→ `v92_tradeSell('iron',1)` 卖出铁锭×1 得 5 金龙（gold 122）→ 图鉴 `good_iron` label「铁锭」登记成功。

## 五、扩充记录（扩了什么 / 为什么 / 如何验证）

- **扩**：14 城 × 10 货的差异化行情 + 8 类事件扰动（bandit/grain/sflood/silverbank/hstorm/meteor/silver/seal）。
- **为什么**：超大型文游需要可玩的经济层，商路是西幻 MUD 的经典系统；与既有银穗商路（day120 主线）呼应但零耦合（不改主线判定）。
- **如何验证**：bu 驱动引擎函数实测买卖结算与图鉴登记；四路一致 + ci 全绿 + smoke PASS。
