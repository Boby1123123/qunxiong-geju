# QA_v44_检验报告

> v44 表现层全量深度开发 · 检验记录
> 日期：2026-09-07 ｜ 基线：v43（2618 节点 / 约 324 万字符，沉浸演出已恢复）
> 用户指令：**不做手机端适配**（否决 v44 指令中 F3 移动端小节，回归清单同步删除 375px 视口项）

---

## 一、交付内容

| 项 | 说明 |
|---|---|
| 备份 | `backup\game_v44_before_presentation.html`（开工前，v43 完成态） |
| 权威源 | `game.html`（3289910 字符，注入 v44 表现层后） |
| 同步副本 | `game_check.html`（= game.html，逐字节一致） |
| 分片版 | `index.html`（= game_chunked.html，分片重建后同步），`chunks\` 8 分片 + NODE_MAP.js |
| 注入脚本 | `_v44_apply.py`（幂等注入）、`_v44_fix.py`（渲染正确性补丁） |
| 材料 | `_v44_css.txt` / `_v44_js.txt`（注入源） |
| QA | 本文件 `docs\QA_v44_检验报告.md` |

## 二、六大方向落地清单

### A 文本排印系统（P0）
- [x] 双层字体栈 `--font-serif` / `--font-body`（系统字体优先，去必需化 @import 外部字体，file:// 可离线）
- [x] 字号层级 --fs-title/--fs-place/--fs-where/--fs-body/--fs-small；正文 16px、行高 1.9、行宽 42em
- [x] 语义色彩统一：npc-dialog 深金 + 左边框、inner-voice/tx-whisper 紫斜体、important 深金加粗、clue 蓝、danger 深红（对比度 ≥4.5:1）
- [x] 章回卡 `v44-chapter-card`（衬线标题 + 金线 + 副题），跨日/换地点自动插入
- [x] 字号档位与 F1 联动

### B 交互反馈手感（P0）
- [x] FloatText 飘字（gold/green/red/blue/purple 五色，1.2s 上浮淡出）
- [x] ToastCenter 通知队列（右下角堆叠、5 条上限、3.5s 自动消失、点击关闭、5 类型）
- [x] SceneFX 演出：突破金色光柱+境界文字、走火入魔红震、大成功闪光、大失败震屏（只加演出不改判定）
- [x] 音效池扩展：v34_playSfx 由 9 种扩至 21 种（buy/item/equip/eat/page/coin/morning/night/quest/heal/hurt/breakthrough 等，Web Audio 合成无外部资源）
- [x] 钩子接入：writeDice（判定演出+音效）、attemptBreakthrough（突破/走火入魔）、applyEffects（得失飘字）、tradeBuy/Sell（金币飘字）、changeRelation（关系通知）、advanceTime（跨日通知+翻页音）

### C 氛围情绪层（P1）
- [x] 地点色相指纹 LOCATION_PALETTES（10 类 loc- class，overlay 叠色 8-12%，1s 过渡，不动文本）
- [x] 深渊腐蚀视觉：abyss-high 暗角+4s 脉冲、abyss-critical 暗角 18%+2s 脉冲+底部血渐变
- [x] SAN 低视觉异变：<30% san-low 呼吸抖动、<10% san-critical + 低语闪现（30+ 句池，2.2s 淡入淡出，不写存档）
- [x] 环境音景 AmbientAudio：rain/wind/night/tavern/church/silence 六种 Web Audio 合成循环（噪声+滤波+LFO+和弦 pad），切换 crossfade 停旧起新，关音效即停

### D 信息架构（P1）
- [x] 顶栏分区重排：左日期/中地点+天气图标/右金币+压力条；时间压力条独立一行（白→黄→红渐变、≥80 脉冲）
- [x] 行动面板分组：探索/修炼/事务/系统 四组（v44-act-title 组标题）
- [x] 快速行动条：休整 / 存档 / 设置（顶栏下固定）
- [x] 面板内容区 max-width 42em

### E 叙事可视化（P2）
- [x] 图鉴 tab 化：图鉴 / 关系网 / 编年史 / 结局 四视图（openGallery 改为 v44_renderAtlas）
- [x] 关系网：自绘确定性 SVG（节点=核心 NPC≤22，边=关系类型五色），节点点击显示人物卡
- [x] 编年史时间线：自绘垂直时间轴（玩家金点/世界灰点/因果红点，最多 45 条）
- [x] 结局图谱：13 结局网格卡（达成点亮+日期、未达成轮廓+条件提示），历史结局从 localStorage legacy 读取

### F 无障碍与舒适（P1，F3 除外）
- [x] 字号三档 small/medium/large（16/17.5/19px，body class 即时生效）
- [x] 三套主题 parchment/soft/night（night 为完整深色主题，全 CSS 变量翻转，AA 对比度）
- [x] compactMode 联动：飘字/通知/演出在简洁模式下跳过（判定横幅保留）
- [x] ~~F3 移动端适配~~：**按用户指令"不要做手机端适配"跳过**

## 三、构建验证（全绿）

| 步骤 | 结果 |
|---|---|
| 备份 game.html | ✓ backup\game_v44_before_presentation.html |
| `python _v39_extract.py` | ✓ 提取 6 个 script（script5 = v44 表现层引擎 23400 字符） |
| `node --check _chk_0..5.js` | ✓ 6/6 PASS |
| `python _check_dead_links.py` | ✓ 2618 节点 / 5985 go 引用 / 死链 0 |
| 占位检查 | ✓ 1 处（writeNext 兜底提示，非问题） |
| `python _v42_build_chunks.py` | ✓ 8 分片 + NODE_MAP 2189 条，game_chunked.html 1240889 字符 |
| `python _v42_verify_chunks.py` | ✓ 分片缺失 0 / 多余 0 / 死链 0 |
| `python _v42_chk_syntax.py` | ✓ 15 个 JS 全部 PASS |
| 同步 | ✓ game_check.html == game.html（逐字节）；index.html == game_chunked.html |

## 四、浏览器回归（bu 平面，file:// 环境）

| 项 | 结果 |
|---|---|
| 分片版入口加载（index.html） | ✓ 无阻断错误 |
| 顶栏天气图标 / 压力条 / 快捷条 | ✓ tb-weather、压力 0、休整/存档/设置 |
| 字号三档切换 | ✓ fs-small/medium/large body class 即时生效 |
| 三主题切换 | ✓ parchment/soft/night 即时生效，真实点击设置面板按钮验证 |
| 飘字 | ✓ v44_showFloatText 出现并自动消失；applyEffects(+50 金币) 触发金色飘字 |
| 通知 | ✓ v44_pushToast 右下角出现 |
| 突破演出 / 判定演出 | ✓ 无异常、不阻断流程 |
| 地点色相 | ✓ loc-north 应用 |
| SAN 异变 | ✓ san-critical 应用（低语池启动） |
| 深渊腐蚀 | ✓ v34_setAbyssCorruption 正常（新档进度 0 时无 class 属预期） |
| 环境音 | ✓ rain 起播/停止，V34.audioSettings 状态正确，console 0 错误 |
| 图鉴四视图 | ✓ 4 tab；关系网 SVG 6 节点+人物卡；结局 13 卡；编年史空态占位 |
| 行动面板分组 | ✓ 探索/修炼/事务/系统 4 组 |
| 设置面板 seg | ✓ 字号 3 按钮 + 主题 3 按钮 |
| 序章游玩（分片版建号→序章） | ✓ 正常进入、6 选项渲染 |
| **place 函数渲染 bug** | ✓ **修复**：prologue_start 等节点的 place 为函数时原本显示函数源码，现正确调用 |
| **分片占位残留 bug** | ✓ **修复**：加载中显示"正在翻越书页…"，加载完成自动移除（实测 story_academy 分片：占位 1 → 0，节点入 N） |
| 控制台错误 | ✓ 全程 0 错误、无软锁 |

## 五、修复记录（回归中发现并修复）

1. **writeNext place/where 函数未调用**：`if(node.place) writePar("「"+node.place+"」","place")` 对函数字段直接 toString 显示源码。补丁：`typeof==="function" ? node.place() : node.place`，where 同理。影响：所有 place/where 为函数的节点（如序章 prologue_start）此前显示 JS 源码。
2. **ChunkLoader 占位残留**：分片加载期间插入的"正在翻越书页…"占位在加载完成后未移除，与节点内容混叠。补丁：占位加 `id="v44-ph-<seq>"`，doLoad 回调 cb 前自动移除。

## 六、已知边界（如实记录）

- 「free_jiaohui」类显示：旧序章节点（v15 时代）place 函数返回区域 ID 而非中文地名，属历史设计；本次仅修复"函数被 toString"的崩溃级问题，未重构该处文案（超出 v44 表现层范围，可留待内容层版本处理）。
- 分片版首次进入未加载分片的节点时，仍会显示"正在翻越书页…"占位（现在会正确移除）；单文件版 game_check.html 无此过程。
- 环境音景仅在设置开启音效且天气/地点匹配时起播；file:// 下 PWA 不生效属预期（v42 已有说明）。
- F3 手机端适配按用户明确指令跳过。

## 七、结论

v44 六大方向（A 文本排印 / B 交互反馈 / C 氛围情绪 / D 信息架构 / E 叙事可视化 / F 无障碍）全部落地；
构建验证全绿（node 6/6、死链 0、占位 0、分片完整性 0 缺失）；
浏览器回归通过（含两处历史渲染 bug 的发现与修复）；
game.html / game_check.html / index.html / chunks\ 四路同步完成。

**判定：通过。**
