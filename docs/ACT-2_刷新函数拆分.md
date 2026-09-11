# ACT-2 刷新函数拆分.md

> 批次：行动系统 P0 根治 · 批 ACT-2（2026-09-11）
> 改动文件：`src/script_04.js`（7 行动函数末尾替换 + `v93_refreshAfterAct` 定义）
> 备份：`backup\ACT1_20260911\`；注入脚本：`backup\scripts_archive\tmp\act_p0_inject.py`、`backup\scripts_archive\tmp\act_rm_showopts.py`

## 目标

`mechAct` 各行动分支末尾的 `writeNext()` 替换为轻量刷新 `v93_refreshAfterAct()`，消除整节点重绘。

## 扩充了什么（相对口令）

1. **新增引擎级轻量刷新函数 `window.v93_refreshAfterAct()`**（script_04.js 尾部 /v93act/ IIFE），按序执行：
   ① `renderTop()` + `renderStats()`（顶栏/状态/行动点刷新）
   ② `v92_scanHooks()` / `v92_scanLedgerReminder()`（事件与账本扫描不因不重绘而丢失）
   ③ `curNode` 以 `arrive_` 开头时 `renderCityActs()`（城市行动按钮重建，含行动点显示）
   ④ `v34_animateOptions()`（选项动画，50ms 延迟）
   ⑤ `v93_renderAside()`（旁白栏刷新）
   ⑥ `S.worldQueue` 非空时日志提示世界事件
2. **7 类行动函数全部分支替换**（共 107 处）：
   - `mechQuest`（告示板，独立判定链）：`writeNext()` → `v93_refreshAfterAct()`
   - `mechExplore` / `mechHear` / `mechTrain`（含失败/打断早退分支）/ `mechMine` / `mechForge` / `mechPatrol`
   - 区间内 `writeDice(` → `window.v93_actDice(`、`writePar(` → `window.v93_actLog(`
3. **实测修正（相对口令第 ② 条）**：`v93_refreshAfterAct` **不调用 `showOptions(curNode)`**——v22 覆写版 showOptions（script_02f.js:1822）会在每次调用时渲染感官段 + 35% 概率渲染"思想内阁"心声段（【战意】等）到正文，导致行动后正文仍 +1~2 段。行动不改变节点选项集（选项是节点级数据），行动点扣减由 `renderTop/renderStats` 刷新，`arrive_*` 行动按钮由 `renderCityActs` 重建，故移除 showOptions 调用，**正文零污染**。

## 为什么

- 整节点重绘的根因：行动函数末尾直接 `writeNext()`（script_03.js:4932）→ 重新渲染地点→正文→选项 + 全部 v9x 注入钩子 + showOptions（其 v22 覆写又加感官/心声段）。
- 轻量刷新只更新**状态显示层**（顶栏/状态/行动点/城市行动按钮/旁白），不重绘正文与节点注入，玩家不再看到剧情重复。

## 如何验证

- bu 桌面 1280 实测（真实游戏态，读档后 `prologue_explore`）：
  - `mechExplore()`：`#story` 子节点 9 → 9，日志 12 → 15
  - `mechHear()`：`#story` 9 → 9，日志 8 → 12
  - `mechTrain()`：判定文本全部进日志（"◆ 结果：+24修为"），日志 15 → 20；`#story` 9 → 15 的 +6 段为 `tryAdvance()` 推进时间产生的**世界事件/破境剧情播报**（属正常剧情流，非行动结果重复，见下）
- 验证链：`node --check`（26 块 fail=0）→ `_build_authority.py build` → Copy → `elda chunks` → `elda sync`（四路字节一致：game=game_check=8,715,314B / chunked=index=5,945,553B）→ `elda budget --reason`（game_html baseline 8,715,201→8,715,314，+113B 合法）→ **`elda ci` 25 检查器全绿，门禁结果：全部通过（可发布）**

## 已知边界（如实记录）

- `mechTrain` 成功分支的 `tryAdvance()` 属既有机制：推进时间 → `advanceDays` → 世界事件/破境检查 → 若触发事件节点或破境流程，会渲染**新剧情节点正文**（如"冲击启灵境"突破场景）。这是正常剧情推进，不是行动结果重复；本批不触碰该链路。
- 行动日志为内存 DOM（`__v93ActLog` 上限 50 条），刷新页面后清空；如需持久化可后续接入手记/编年史（未做，属可选）。

## 边界与红线

- `writeNext` 本体（script_03.js:4932）零改动；`choose()`（:5009）判定路径零改动；所有节点跳转渲染路径零改动；存档结构零改动；`saveVersion=48` 不变；`applyDefaults` 兜底链不变；S 零新增字段。
- rest 与 board 分支维持现状（rest 无 writeNext 调用，board 走独立面板）。
