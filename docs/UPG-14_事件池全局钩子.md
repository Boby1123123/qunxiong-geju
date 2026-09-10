# UPG-14 事件池全局钩子（Evennia Scripts 模式）

> 批次：UPG-14｜优先级：P2｜依赖：UPG-03/04｜状态：✅ 已实施（elda ci 第 35 检查器）

## 做了什么

借鉴 Evennia Scripts/GLOBAL_SCRIPTS，在事件池之上引入"全局钩子脚本"——不绑定具体节点、挂在游戏主循环上的条件触发器。

### 数据层（新文件 `src\data_nodes\dn_hooks.js`）
`const GLOBAL_HOOKS = [...]`，每条 `{id, condition, eventId, cooldown, maxTriggers, text}`：
| id | condition | 语义 |
|---|---|---|
| hook_bounty | `S.rep<=-30` | 声望过低 → 通缉事件（cooldown 30 / max 3） |
| hook_border | `S.day>50 && S.day%5===0` | 每 5 天边境冲突检查（cooldown 10 / max 6） |
| hook_abyss | `S.abyssCorruption>30` | 深渊腐蚀 → 裂隙异兆（cooldown 40 / max 2） |
| hook_vendetta | 任一 npcRelations<=-60 | 死敌伏击（cooldown 25 / max 2） |
| hook_wealth | `S.gold>=500` | 财露白 → 商会觊觎（cooldown 20 / max 1） |

### 引擎层（src\script_03.js，UPG-14 注释区）
- `window.v92_scanHooks()`：节点切换后由 writeNext 调用；condition 用 `new Function` 求值（try/catch 失败即跳过）；满足 + 冷却结束 + 未超上限 → `S.world['ev_'+eventId]=true` 去重 + `logMsg` 播报 + 计数。
- `window.v92_scanLedgerReminder()`：CAUSALITY_LEDGER 中 status=open 且 importance≥4 的伏笔，每 10 天随机弹 1 条"伏笔回声"（呼应 UPG-03 账本 + 用户"不能遗忘设定"硬约束）。
- 开关 `S.settings.globalHooks` 默认 true（applyDefaults 兜底，旧档兼容）；`S.hooksState` 独立键（不改变存档结构语义）。

### 检查器 c_hooks（elda ci 第 35）
GLOBAL_HOOKS 段切取 → id 唯一 / condition 引用的 S 键已声明 / ev_ 去重键用法 / cooldown·maxTriggers 正整数 / 引擎扫描器与开关兜底存在。不改变既有 34 项行为。

## 为什么

176 事件按 day 到达被动触发，缺"状态条件触发"维度（Evennia Scripts 的核心价值）；钩子让声望/腐蚀/好感/财富等动态状态驱动世界反馈，账本伏笔靠人工记住不现实，改成机器定期提醒。

## 如何验证（已完成）

- `node --check`（26 块）PASS；build→Copy→chunks→sync 四路字节一致（game=game_check=8,410,376B / chunked=index=5,643,897B）
- `elda ci` 35 检查器全绿（含 c_hooks；预算门 6 项 PASS）
- `smoke_test.py` PASS（节点完整性 + 状态机推进）
- 事件池 176 事件零改动（钩子自带 text，不入 EVENT_POOL_EXT，验收③成立）

## 扩充记录

- 扩了什么：5 条全局钩子 + 引擎扫描器 + 账本伏笔回声 + 第 35 检查器 + 独立开关。
- 为什么：让世界对玩家状态产生反应（对标 Evennia Scripts 定时/条件脚本），并把"伏笔不能忘"从人工变为机制。
- 如何验证：condition 满足时事件触发、cooldown/maxTriggers 生效、关闭开关零触发、ci 35 项全绿。
