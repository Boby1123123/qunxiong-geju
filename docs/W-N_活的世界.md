# W-N 活的世界（世界局势快照 + NPC 状态机 + 状态回指）

> 批次：W-N1/W-N2/W-N3（六大方向升级 · 方向二 活的世界）
> 日期：2026-09-10
> 基线：v92；elda ci 38 检查器；四路 game=game_check=8,478,184B / chunked=index=5,710,821B

## 一、扩了什么

### W-N1 世界局势快照
- 数据文件 `src\data_nodes\dn_world.js`（新建）：九域（北境/东部/南方/西境/沙漠/精灵/矮人/教会/兽人）× 三阶段（early<60日 / mid 60-199 / late≥200）局势模板 + 五主线事件（净化令60/银穗120/封印200/学院250/兽人280）完整文本
- 引擎 `v92_worldSnapshot()`：只读 S.day 生成九域局势 + 已到日期的主线事件播报
- UI：顶栏新增「🌍 局势」按钮 + `v92_openWorldPanel()` 弹窗

### W-N2 NPC 独立状态机（推导式）
- 数据文件 `src\data_nodes\dn_npc_state.js`（新建）：20 名大陆人物（李管事/老铁/阿岩/金先生/费尔曼/艾琳/塞西莉娅/洛卡/阿塔/洛克/凯恩/艾丽斯/莫里茨/沈砚/艾德蒙/若耶/白驼/秦·长风/陆昭/艾丽斯等）按 day 分段的所在与动向
- 引擎 `v92_npcStatus(npcId)` / `v92_npcStatusList()`：纯推导（读 S.day + S.npcRelations），零状态写入、零存档改动；好感 ≥60 标"与你是挚交"、≤-20 标"与你结过梁子"
- 局势面板底部新增「大陆人物动态」区块（前 8 位 + 总数标注）

### W-N3 NPC 状态回指注入
- 引擎 `v92_npcWeave(node)`：正文提及某 NPC（好感 <30，与 CM-1 记忆注入互斥）时注入 1 句"他此刻在 X：doing"——玩家在正文里遇到名字，引擎补充其当下动向
- 独立开关 `S.settings.npcWeave`（默认 true，applyDefaults 兜底，旧档兼容）；关闭后零注入
- 注入前缀 `/w3inj:npc/`，可审计

## 二、为什么

- **A Dark Room 式"世界感"**：游戏世界不该围着玩家转。局势面板让玩家随时看到九域各自走向；NPC 动态让"认识的每个人都在过日子"。
- **推导式而非存储式**：NPC 状态全部由 day/好感/flag 实时推导，不新增任何存档字段——红线零触碰，且永远与当前世界一致。
- **回指注入与 CM-1 互斥**：高好感（≥30）由记忆注入管关系回指，低好感由 W-N3 管状态播报，避免同节点双注入冗长。

## 三、如何验证

- `node --check`（26 块）✅
- 完整验证链：build → Copy → chunks → sync 四路字节一致（8,478,184B / 5,710,821B）✅
- `elda ci` 38 检查器全绿（预算门 +8.6KB 合法增长已更新）✅
- `smoke_test.py` PASS ✅
- 浏览器实测：顶栏出现「🌍 局势」→ 打开显示九域局势 + 主线事件 + 人物动态；推进 day 后局势阶段变化（bu 实测见批次记录）

## 四、改动清单

| 文件 | 位置 | 差异 |
|---|---|---|
| src\data_nodes\dn_world.js | 新建 | WORLD_SNAPSHOT 九域×三阶段 + majors 五主线 + WORLD_PHASE |
| src\data_nodes\dn_npc_state.js | 新建 | NPC_STATE 20 名人物按 day 动态 |
| src\script_03.js | v92_worldSnapshot 前 | +v92_npcStatus +v92_npcStatusList +v92_npcWeave |
| src\script_03.js | v92_openWorldPanel 内 | +大陆人物动态区块 |
| src\script_03.js | writeNext memhook 后 | +/wn3inj:npchook/ 注入钩子 |
| src\script_03.js | applyDefaults | +S.settings.npcWeave 默认 true |
| src\gap_00.html | btn-threads 后 | +「🌍 局势」按钮 |

## 五、扩充记录

- **扩充**：原计划仅"世界局势快照"，本轮叠加 NPC 状态机 + 状态回指注入，形成"世界在动 + 人物在动 + 正文呼应"三层活世界体验。
- **为什么**：快照是静态的，NPC 动态是活的；回指注入让正文本身"活"起来。
- **如何验证**：v92_npcStatus 推导结果与 day 推进一致（bu 实测）；v92_npcWeave 注入文本带 /w3inj:npc/ 前缀可在 console 审计。
