# ACT 行动系统 P0 根治（行动结果独立流 + 刷新函数拆分）

> 批次：ACT-1 / ACT-2 · 日期：2026-09-11 · 口令：《行动系统 P0 根治》

## 问题根因

各行动分支（mechExplore/mechHear/mechTrain/mechMine/mechForge/mechPatrol/mechQuest）末尾调用 `writeNext()` 触发**整节点重绘**——行动判定后当前节点正文被完整重绘一遍，玩家看到"故事文本再输入一遍"的重复渲染。

## 方案（两批）

### ACT-1 · 行动结果独立流（行动日志区）

- 新增固定「行动日志」容器 `#v93-actlog`（`src\gap_00.html:1107-1110`，正文与选项之间、v68-status 上方）：
  - 头栏「✦ 行动日志（今日）」+ 折叠按钮（`v93-actlog-toggle`）+ 条目计数（`v93-actlog-count`）
  - 羊皮纸样式（`src\gap_00.html` CSS #v93-actlog 区，max-width:76em / 94% 宽，与 UI v5 一致）
- 日志引擎（`src\script_04.js:11120-11203` /v93act/ 区）：
  - `window.__v93ActLog` 数组，MAX=50 条滚动淘汰（最旧优先）
  - `v93_actLog(text, cls)`：按 `S.day` 分组渲染（「第 N 日」），当天条目置顶；同步 `#act-out` 最近一条
  - `v93_actDice(roll, target, tierLabel)`：d100 骰面条目（大成功/成功/失败/大失败 + 数值）
  - `bindLog`：head 点击折叠/展开
- 行动结果文本**不再混入正文流**——判定叙事从正文剥离，正文只承载剧情节点文本
- 与 I1-3 冒险手记区分：手记=剧情节点快照（localStorage elda-journal-v3），行动日志=操作结果流水（内存），并存不互写、不入存档结构（S 零新增字段，旧档兼容）
- 全部分支已改用 `v93_actLog/v93_actDice` 输出：mechQuest / mechExplore / mechHear / mechTrain / mechMine / mechForge / mechPatrol

### ACT-2 · 刷新函数拆分（消除整节点重绘）

- 新增引擎级轻量刷新 `window.v93_refreshAfterAct()`（`script_04.js:11171`）：
  ① renderTop() + renderStats()（顶栏/状态/行动点刷新）
  ② v92_scanHooks() + v92_scanLedgerReminder()（事件/账本扫描不因不重绘而丢失）
  ③ curNode 以 arrive_ 开头 → renderCityActs()（城市行动按钮重建）
  ④ setTimeout(v34_animateOptions, 50)（选项动画）
  ⑤ v93_renderAside()（纪闻侧栏刷新）
  ⑥ worldQueue 非空 → 世界事件**以日志提示**（pushLog '── 世界事件已至'，不展开正文、不重复渲染）
  - **不重绘正文、不渲染地点/场景标题、不重复执行节点注入钩子**（v91_memoryInjection/v92_weatherLine 等只随节点切换跑一次）
  - 注释明确不重调 showOptions：其 v22 覆写会渲染感官/心声段污染正文
- 行动分支末尾替换：mechQuest(:384) / mechExplore(:596) / mechHear(:649) / mechTrain(:656/:670/:708 含失败/打断早退分支) → `window.v93_refreshAfterAct()`
- **本轮收尾**：mechMine / mechForge / mechPatrol 三函数末补 `try{ window.v93_refreshAfterAct(); }catch(e){ renderTop(); renderStats(); }`（此前只靠 mechAct 尾部 renderTop/renderStats 兜底，缺 v92 扫描/事件提示/城市按钮重建）
- writeNext 本体语义零改动；choose() 判定路径零改动；存档结构零改动；saveVersion=48 不变

## 验证链结果

- `node --check`（26 块）全过
- `elda ci` 39 检查器全绿（含四路字节一致 game=game_check=9,374,173B、chunked=index=6,552,348B；budget 二次校准）
- `smoke_test.py` PASS；bu 桌面 1280 实测：

| 步骤 | 正文段落数 | 日志条数 | 行动点 |
|---|---|---|---|
| 建号完成 | 29 | 0 | 4 |
| 探索×1 | 29 | 4 | 3 |
| 打听×1 | 29 | 7 | 2 |
| 修炼×1 | 29 | 12 | 1 |
| 采矿×1（无矿） | 29 | 12 | 0 |
| 休整至天明 | 29 | 12 | 4 |
| 夜巡×1 | 29 | 14 | 2 |
| 锻造×1（无料） | 29 | 14 | 1 |

**正文段落数全程零增长，日志条目递增，行动点正确扣减，世界事件走日志提示不污染正文。**

## 扩充记录

- **扩了什么**：行动日志容器/引擎、v93_refreshAfterAct 轻量刷新、7 个行动分支全部接入。
- **为什么**：消除"行动判定后正文重绘一遍"的重复渲染——正文只承载剧情，行动结果进日志流，符合"正文段落数不增"验收。
- **如何验证**：bu 实测正文段落数恒定 + 日志递增 + 行动点扣减；四路字节一致；elda ci 全绿。

## 涉及文件

- `src\gap_00.html`（容器 + CSS）
- `src\script_04.js`（/v93act/ 区 + 7 行动分支）
- 构建产物：game.html / game_built.html / game_check.html / game_chunked.html / index.html（四路重建同步）
- `budget.json`（二次校准）
- 备份：`backup\ACT2_20260911\script_04.js.bak`
