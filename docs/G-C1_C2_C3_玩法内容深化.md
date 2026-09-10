# G-C1/C2/C3 玩法内容深化（六方向 · G 批内容补完）

> 批次：G-C1/C2/C3 ｜ 日期：2026-09-10 ｜ 版本基线：v92（saveVersion=48）｜ 状态：已实施

## 一、做什么

在 G-N1/N2/N3 三套面板（商路 / 图鉴 / 实力）基础上**补齐玩法内容**，让系统从"能用"到"有得玩"：

### G-C1 商路内容扩充（dn_trade.js）
- 货物 **10 → 16 种**：新增 兽皮(hide) / 兽核(core) / 古籍(tome) / 兵刃(blade) / 玉料(jade) / 香木(wood)，全部按世界观设定写 desc（北境鞣皮、魔兽晶核、禁书区抄本、矮人兵刃、承天官玉、圣城香木）。
- 市场 **14 → 15 城**：新增 圣城(shengcheng mul1.05 hot wood/tome)；矿山城/北境城/元素荒原补 hot/prod（兵刃产地矿山、兽皮产地北境、兽核产地荒原）。
- 事件扰动 **8 → 12 则**：新增 战争征粮(war grain/iron/blade 涨) / 地动(quake crys/jade) / 丰收节(fest grain/wine 跌) / 古物出土(relic tome/rune)。
- 价格公式与字段结构零改动（只加条目）。

### G-C2 图鉴触点扩充（script_03.js）
- **到达自动收集**：`startTravel` 到达目的地后自动 `v92_galleryMark("place_<loc>", 城市名)`——去过的城市进图鉴。
- **事件自动收集**：`checkWorldEvents` 触发 EVENT_POOL_EXT 事件后自动 `v92_galleryMark("event_<id>", id)`——经历的世界事件进图鉴。
- 与既有 npc_（专名高亮）/ good_（交易）触点合并为五类完整覆盖：place_ / event_ / npc_ / good_ / other_。

### G-C3 实力评级入状态面板（script_04.js）
- `renderStats` 侧栏面板新增「实力」行，实时显示当前评级（青铜~龙晶），与「图鉴」行并列——玩家随时可见成长台阶。

## 二、改动清单

| 文件 | 位置 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_trade.js` | 货物/市场/事件三段 | +6 货（hide/core/tome/blade/jade/wood）、+1 城（shengcheng）、+3 城 hot/prod、+4 事件（war/quake/fest/relic） |
| `src\script_03.js` | ~5834（startTravel） | 到达后 place_ 图鉴收集 |
| `src\script_03.js` | ~5158（checkWorldEvents） | 事件触发后 event_ 图鉴收集 |
| `src\script_04.js` | ~1123（renderStats） | 「实力」评级行 |

## 三、验证链结果

- `node --check`：26 块全绿。
- `elda sync`：四路字节一致（game=game_check=8,521,717B；chunked=index=5,753,681B）。
- `elda ci`：38 检查器全绿（总耗时 18.75s——G-CI1 优化后含死代码 1.52s 仍在 24s 预算内）、性能预算门 6 项 PASS、门禁「全部通过（可发布）」。
- `smoke_test.py`：PASS。
- bu 桌面 1280 实测：
  - 商路：`TRADE_GOODS_V92` 16 货 / `TRADE_MARKET` 15 城 / `TRADE_EVENTS` 12 则；
  - 事件触点：`S.day=35 → checkWorldEvents()` → `S.gallery["event_bandit"]` 存在；
  - 到达触点：`startTravel('free_jiaohui','walk',0)` → `place_free_jiaohui` 收集（placeDelta=1）；
  - 实力行：挂 `#stats` 容器后 `renderStats()` → 面板含「实力 白银」（占位状态无 #stats 面板属既有行为，非回归）。

## 四、扩充记录

- **扩了什么**：商路品种/市场/事件、图鉴三类新触点、实力行。
- **为什么**：三套面板若只有框架没有内容会很快空转——补足内容后形成"跑商→到城→遇事→集图鉴"的正反馈闭环；实力行让评级常驻可见。
- **如何验证**：bu 实测四类触点（good/place/event/npc）+ 评级面板；ci/smoke/四路全绿；零判定公式、零存档结构改动。
