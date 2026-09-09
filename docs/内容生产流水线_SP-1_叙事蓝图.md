# 内容生产流水线 SP-1 · 叙事蓝图数据层

> 批次：SP-1 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 ｜ 备份：`backup\snap_20260909_212726_SP1-blueprint.zip`

## 一、本批目标

建立叙事结构的**规划层（蓝图数据）**，把"幕 → 卷 → 章 → 弧 → 节点"五层模型落成纯数据文件，并配套检查器与导出命令。为 SP-2 全量标注（nodeIndex）与 SP-5 章节批量生产线提供数据地基。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_story_blueprint.js` | 新增（22,755 B） | `window.STORY_BLUEPRINT` 蓝图 v1：幕 5 / 卷 10 / 章 36 / 弧 79 + nodeIndex 空表（SP-2 填） |
| `tools\elda\p2tools_impl.py` | 修改 | 新增 `cmd_content_skeleton`（v1 检查器）与 `cmd_content_blueprint`（导出）+ `_load_blueprint` / `_collect_node_ids` 辅助；分发表注册 `skeleton` / `blueprint` |
| `game.html`（权威源） | 更新 | 经 `_build_authority.py build` → 提升 `game_built.html` → game.html，纳入蓝图（+24.8KB，6406889B） |
| `game_check.html` / `game_chunked.html` / `index.html` | 四路同步 | 字节一致 |
| `budget.json` | 更新 | baseline.game_html 6382063 → 6406889（合法内容层增长，--reason 记录） |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp1_stats / _tmp_sp1_pref / _tmp_sp1_groups / _tmp_sp1_anchors |

## 三、蓝图内容设计

### 三层结构（对齐既有体系）
- **幕（5）**：第一幕 尘埃落定 → 第二幕 暗流涌动 → 第三幕 群雄并起 → 第四幕 命运落定 → 第五幕 轮回与新生（多周目/深渊终局）
- **卷（10）**：与 CHAPTERS_I12 七卷 + 终章对齐并扩为 10 卷（补 第八卷 战争与日蚀 / 第九卷 深渊回响，第五幕挂卷待 SP-8 内容包填充）
- **章（36）**：以 dn_chapters.js 章节标题卡为锚点（36 章全部 anchor 对齐真实节点 id，含 travel_west_start / seal1_act1_intro 修正）

### 弧线注册表（79 弧，达标 ≥60）
| 类型 | 数量 | 说明 |
|---|---|---|
| main 主线 | 5 | 对齐 WORLD_EVENTS：purge / silver / seal / academy / orc（day 60/120/200/250/280） |
| main 核心叙事 | 7 | origin / pol / war / eclipse / abyss / classmate / watchmen |
| ending 终章 | 1 | ending（终章五节点） |
| faction 势力 | 14 | abyss / church / dwarf / elf / orc / free / north / em / es / fc / lc / wt / recruit / overview |
| branch 支线 | 30 | fsh_* 全部 30 组（深渊/同窗/梦境/日蚀/初印/黄林晶/因果/谎言/迷途/身世/远古/神谕/封印/时光/未言/守望者 各 1-2） |
| bond 羁绊 | 22 | i_* 7（artifact/bond/magic/timeloop/war/watchmen/origin）+ npc 5（skadi/mercury/aurelian/roland/silvia）+ classmate 10（allen/aria/arthur/alexander/cecilia/elara/felix/kai/luna/thorin） |

每弧字段：`{id, type, name, act, vol, prefixes[], stages{setup,rising,climax,resolution}, cond}` —— prefixes 供 SP-2 自动推导；stages 锚点（已知 15 处，如 world_purge / faction_church_intro / ending_check 等）供 SP-3 运行时首版推进；空阶段由 SP-2 标注补充。

### 弧线-节点映射（关键）
- 主线弧按 WORLD_EVENTS 事件 id + 势力节点前缀收敛（arc_purge ← world_purge/faction_church/cityev_church）
- seal 七印线（seal1~seal7 共 457 节点）归入 arc_seal + arc_fac_abyss
- 职业弧（sub_* 36 职业 + arc_* 117）与 v56s 组（28）、v65 系（39）由 SP-2 通过 prefixes 自动推导挂入 arc_war / arc_origin 等，检查器报告层展开（不写入蓝图，避免重复维护）

## 四、新增命令

```
elda content skeleton          # v1 蓝图结构检查：语法/规模下限(幕≥5 卷≥9 章≥30 弧≥60)/id唯一/锚点存在/vol·act引用/前缀命中率
elda content blueprint         # 导出蓝图汇总（幕卷章弧 + 卷密度）；--json 输出完整结构
```

## 五、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块 + 蓝图） | PASS |
| `elda content skeleton` | 全绿：幕5 卷10 章36 弧79，类型分布 bond×22 branch×30 ending×1 faction×14 main×12；节点集 3877；前缀命中 79/79 |
| `elda content blueprint` | 正常导出（5 幕卷列表 + 36 章 + 79 弧按类型） |
| `elda ci` | 全绿：21 检查器 PASS / src 语法 26 块 / 权威源幂等 verify / 四路字节一致（game=game_check=6406889B，chunked=index=3732777B）/ 预算门 6 项 PASS |
| `smoke_test.py` | PASS（30 步推进 / 5 面板 / 存读档 / 结局） |
| bu 桌面 1280 实测 | 游戏加载正常、存档弹窗正常、建号界面完整；`window.STORY_BLUEPRINT` 运行时可用：`{acts:5, vols:10, chs:36, arcs:79, idx:0}` |

## 六、关键发现（重要，供后续批次引用）

1. **口径澄清**：src 权威源内 `N["id"]=` 定义 **3,339 个**；含 chunks 分片后完整节点集 **3,877**。验收标准"3,877 节点"与 elda ci 的 node_total 口径一致（含 chunks），SP-2 标注以 3,877 为全量基线，src 3,339 为"主权威源"基线。
2. **权威源机制实锤**：`_build_authority.py verify` 会先 `extract`（把 src 重置为 game.html 的拆分视图，**删除 game.html 中不存在的 data_nodes 文件**）。因此**新增数据文件的正确流程是：写 src → `_build_authority.py build` → 用 `game_built.html` 覆盖 `game.html` → 之后 verify/ci 幂等成立**。本次即因先跑 ci（verify）导致蓝图文件被重置删除一次，已按正确流程修复并验证。SP-2~SP-8 新增 dn_*.js 一律照此执行。
3. **脚本块数**：_build_authority build 为 19 script 块（script_00~18 + 变体），node --check 26 块含 data_nodes 12 个。

## 七、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（蓝图为新增全局数据，零存档依赖）
- 节点数 3877 零损失；文本零改动
- 移动端适配：未做任何新增

## 八、下一批

SP-2 全量元数据标注：以 3,877 节点为基线，按 79 弧 prefixes + id 前缀推导规则自动标注 nodeIndex（预计 60-80% 自动），未推导节点进 WARN 清单交付用户人工确认。
