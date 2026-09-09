# QA_v47 检验报告 — 大陆世界状态模拟 + 主线四弧终局收束

## 一、版本与基线
- 基线：v46（2638 节点 / 6,582,558 字节）
- 交付：v47（2640 节点 / 6,612,444 字节，+2 节点：`v47_ledger`、`ending_prelude_hub`）
- 备份：`backup\game_v47_before_worldstate.html`（纯 v46 基线）
- 三路同步：`game.html` = `game_check.html`（6,612,444 字节）、`index.html`（分片版 2,063,994 字节）

## 二、方向一：大陆章世界状态模拟（已完成）
### 引擎
- `WORLD_STATE_V47`：9 大势力常量（教会/暗蚀会/守望者/自由商会/北方公国/南方城邦/精灵/矮人/兽人，各含 influence/stance/color）
- `EVENT_TIMELINE_V47`：15 条势力时间线事件（day 60~460），5 条重点事件已扩充为 3 段叙事
- `CHRONICLE_POOL_V47`：10 条纪事模板 + 每周拼接器
- `v47_worldTick`（advanceTime/advanceTimeV26 双挂钩）、`v47_fireEvent`（在场 logMsg / 不在场 v46_maybeMissed 入队）、`v47_weeklyChronicle`（周纪事，上限 40 条）
- `worldDelta(force, inf, stance)`：玩家行为反馈势力（影响 applyEffects `eff.world` 支持）
- 图鉴第六 tab「大陆纪事」（`v47_chronicleBody`）
- `S.worldState / S.worldChronicle`，旧档兜底（v46_ensureDefaults → v47_ensureDefaults）

### 内容
- 15 条势力事件文本、10 条纪事模板、rumor 消费（`v47_rumorCompensation` 在 tavern/rumor/board 节点自动追加"你听说……"）
- worldDelta 挂点：pol_hub（政治站队→守望者/暗蚀会）、quest_seal_1（守印→守望者）、quest_hub（守印推进）

## 三、方向二：主线四弧终局收束（已完成）
### 引擎
- `revealForeshadowV47(id)` + `v47_autoReveal`（FORESHADOW_REVEAL_MAP 节点→伏笔自动回收钩子）
- `FINAL_FORESHADOWING_V47`：15 条伏笔终局揭示文本（每条 2 段，human-signal 风格）
- `v47_foreshadowStatus()`：伏笔回收统计（recovered/planted/total）
- `v47_arcProgressCalc()`：四弧完成度（origin/academy/seal/faction，0-3 级）
- `v47_endingEpilogue(id)` 增强：按伏笔回收率/弧进度/势力立场/结局类型/多周目/理想动态拼接结局段落
- `v47_endingRecord(id)`：结局记录（S.endingHistory + elda-legacy-v2 结局图谱数据）
- `S.arcProgress / S.endingFlags / S.endingHistory / S.foreshadowing.stage` 兜底

### 内容
- 伏笔簿节点 `v47_ledger`：列出未解/已解伏笔 →「逐页回想」一键回收全部未解伏笔（揭示文本入册）→ 回收率聚合分支
- 四弧合流枢纽 `ending_prelude_hub`：决战前夜，按弧完成度/伏笔回收/同伴/封印进度生成分支文本 + 走向深渊之门/回伏笔簿/篝火休整
- `ending_choose` 新增两个入口：「伏笔簿·回望未解的线」「决战前夜·四方合流」

## 四、构建验证（全量绿）
| 项 | 结果 |
|---|---|
| node --check（6 script） | 6/6 PASS |
| 死链检查 | 0（节点 2640 / go 引用 6009） |
| 占位检查 | 1（writeNext 兜底，允许） |
| 分片构建 | game_chunked.html 1,353,275 字符 / 8 script / NODE_MAP 2189 条 |
| 分片验证 | 0 缺失 / 15 JS 全 PASS |
| 三路同步 | game.html = game_check.html = index.html(分片) 已同步 |

## 五、浏览器回归（bu 平面，file:// 环境）
| 回归项 | 结果 |
|---|---|
| 页面加载 / 首页渲染 | OK，console 0 错误 |
| 世界纪事（advanceTime 推进） | OK，每周生成纪事（"第N周·大陆纪事"） |
| 势力事件·不在场 | OK，w_north_fall 入 S.missedEvents（"你听说守将亲自上了墙头…"） |
| 势力事件·在场 | OK，curNode 匹配前缀 → seen=true + logMsg |
| 周纪事 + 事件入纪事 | OK（上限 40 条截断） |
| worldDelta 影响力变化 | OK（church 45→50、eclipse +8/ally、north -10） |
| rumor 补偿 | OK（tavern 节点自动追加"你听邻桌的人又说起——"） |
| 伏笔簿节点 | OK（列出未解/已解，3 选项） |
| 逐页回想回收 | OK（recovered 1→3，揭示文本入册） |
| 四弧合流枢纽 | OK（4 选项，弧完成度文本） |
| 结局动态段落 | OK（按伏笔回收率/势力/结局类型生成） |
| 结局记录 | OK（S.endingHistory + elda-legacy-v2） |
| 旧档兼容 | OK（删除 v47 字段后 v46_ensureDefaults 兜底重建 worldState/Chronicle/arcProgress） |
| 存档键 | elda-qunxiong-v3-save 不变，S.saveVersion=47 |

## 六、过程中发现并修复的问题
1. **v47 引擎 IIFE 缺 `})();` 闭括号**（初版引擎注入后 chk_3 FAIL）→ `_v47_fix_iife.py` 修复。教训：IIFE 注入段末尾必须闭合。
2. **content03 正则越界损坏**：EV 扩展正则 `"]\},` 要求逗号结尾，而 TIMELINE 最后一项 `w_abyss_grow` 无逗号 → 非贪婪匹配跨越引擎段，吞掉 `];` 与一条 READINGS 前缀，导致节点数 2640→2620、chk_3 FAIL。已从备份恢复并重跑全部注入；正则改为 `"\]\},?`（逗号可选）。教训：**数组末项正则必须考虑无逗号**。
3. **v47 引擎核心函数未导出**：`v47_initState/v47_worldTick/v47_fireEvent/v47_weeklyChronicle/v47_nowDay` 定义于 IIFE 内但未挂 window，advanceTime 挂钩调用被 catch 静默吞掉 → 世界 tick 从未执行。已补 `window.xxx` 导出（`_v47_fix_exports.py`，marker `v47inj:export-fix`）。教训：**IIFE 内的引擎函数必须显式导出**，否则挂钩静默失败。

## 七、已知限制与扩展位
- `FORESHADOW_REVEAL_MAP` 目前为空表（`v47inj:reveal-EXTEND`）——后续可按"节点ID→伏笔ID"自动 reveal 挂更多现有节点
- 势力时间表 15 条中 10 条仍为单段，可继续扩为 3 段（`v47inj:chronicle-EXTEND` / TIMELINE 内直接扩展）
- 结局动态段落分支有限（`v47inj:epilogue-EXTEND`）——可继续按更多结局类型/flag 组合扩充
- 大陆纪事视图未读红点消费逻辑简化（rumor 补偿时标记 seen）
- 浏览器回归为 file:// 环境；http:// 环境（分片版）建议用 start_server.bat 另行冒烟

## 八、结论
v47 两大模块（世界状态模拟 + 终局收束）全部落地：世界每周在呼吸、事件会找到不在场的玩家、15 条伏笔有回收机制与聚合节点、四弧在决战前夜合流、结局按一生所为动态生成。全链验证绿、浏览器回归 0 错误、存档兼容。
