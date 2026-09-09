# P2 剩余项完成 + 大幅方向内容展开（PE 批次）· v91

> 版本：v91（2026-09-09）· 批号：PE-1 / PE-2 / PE-3
> 依据：《p2_features_v76.md》《p2_tools_v90.md》《budget_deadcode_v76.md》《世界设定_v64.md》
> 铁律遵守：不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义；saveVersion=48 不变；applyDefaults 兜底链不变；每批备份 backup\PE*_20260909\；验证链 = node --check → build → elda ci（18 检查器 + 预算门）→ smoke_test.py → bu 桌面 1280 实测；预算超限用 `elda budget --reason` 更新基线后重跑。

## 一、P2 剩余项闭环

| 剩余项 | 状态 | 说明 |
|---|---|---|
| P2-1 内容工具生态 · node_tag 打标 | **完成** | `node_tag.py --apply` 已执行：368 节点自动打标（branch/main/ending/event/easter 五类），写前自动备份 backup\tags_*；29 文件 node --check 全过；tag 字段插入位置验证正确（对象式与函数式双兼容） |
| P2-2 多周目系统 | 已完成（v76） | 本批不重复 |
| P2-3 移动端 | 用户已要求删除全部移动端适配，已执行，本批不碰 | |
| P2-4 文本治理自动化 | **达标闭环** | `elda text freq --top 30` 实测：26 词表当前最高「隐约 20」，**全部单词 ≤30 达标**（目标 0.5 次/千字 ≈ 205 次/词，远低于阈值）。T0-2 已处理 6 个超标词，其余词本就低于阈值——不做过度改写（避免破坏 v66 文风，符合 human-signal 低误报原则） |

## 二、大幅方向内容展开：种族之地 + 战争前线内容包

### PE-1 兽人草原深度包（src\data_nodes\dn_orc_deep.js 新增，16 节点 + 5 事件）

**为什么**：节点密度分析显示兽人草原仅 6 个主线节点（黑石营地/圣山），是九域中除沙漠/教会外最薄区域；而「兽人南下」是五大主线事件之一（day280）——战争矛盾最大、可玩空间最大。

**扩了什么**（世界观约束：不与「神谕被操纵」主线冲突，沿用黑石大汗/大萨满/兽王鬃吼设定）：
- 营地生活层：`orc_deep_gate`（营地门·认刀不认人）/ `orc_deep_market`（兽人集市·以物易物）/ `orc_deep_smith`（女铁匠·骨塔线索）/ `orc_deep_wolf`（狼骑兵营·灰鬃引荐）/ `orc_deep_feast`（宴火·长老旁听）/ `orc_deep_witch`（巫医帐·圣火灰烬）/ `orc_deep_hunt`（草原猎场·焦痕勘察）/ `orc_deep_trail`（圣山小道·兽人少年）/ `orc_deep_totem`（图腾林·旧绳与红绳）/ `orc_deep_leave`（离营）
- 支线：**灰鬃之刀**（orc_graymane 狼骑队长，4 节点 65 挚友闭环：结识→北缘查探→石塔取证→结义狼牙）
- 事件 5 则（day 152-178）：红绳骤增/狼群南迁/兽骨车队/部族内斗/兽王异动

**如何验证**：node --check 通过 → 入边分析 0 孤儿 → ci 18 检查器全绿 → smoke PASS → bu 实测节点全部注册。

### PE-2 精灵/矮人扩展包（src\data_nodes\dn_elf_dwarf.js 新增，10 节点 + 4 事件）

**为什么**：精灵王庭仅 6 节点（主线），缺日常探索层；矮人 9 节点但缺市井生活。

**扩了什么**：
- 精灵日常层：`elf_deep_market`（银叶集市·故事换浆果）/ `elf_deep_altar`（银月祭坛·月池）/ `elf_deep_council`（长老议会·青叶长老·第五枚锚）/ `elf_deep_mist`（迷雾边界·独臂老精灵旧塔）/ `elf_deep_tower_entry`（旧塔之约·第七枚锚线索）/ `elf_deep_grove`（世界树外围·月环古物）
- 精灵支线：**林歌之疑**（elf_linge 见习祭司，4 节点 65 挚友：黑叶疑云→净根药→涂药→银叶别针）
- 矮人补强：`dwarf_deep_bard`（老巴德铁匠铺）/ `dwarf_deep_hall`（铁砧议会·黑矿）/ `dwarf_deep_mine2`（老矿道第七层·发热铁柱）
- 事件 4 则（day 184-203）：迷雾外扩/月环现世/黑矿收购/矿道磨牙

**如何验证**：同上（ci 全绿 + 入边 0 孤儿 + bu 注册验证）。

### PE-3 铁门关战争前线包（src\data_nodes\dn_warfront.js 新增，7 节点 + 6 事件）

**为什么**：铁门关主线已深（新地基/第七枚锚/秦·长风），但缺「战争可玩层」——v64 七阶段战争模拟是引擎层（tick），本包把战争前线变成玩家可介入的探索节点。

**扩了什么**：
- `tm_frontline`（东军前线营地·军需帐篷黑箱子）/ `tm_watchtower`（北坡烽火台·雪狼旗先遣）/ `tm_ruins`（旧战场废墟·血渍羊皮纸）/ `tm_courier`（军情驿站·送信）/ `tm_refugee`（关南难民营·东军探子）/ `tm_negotiate`（两军空场·和谈斡旋·和谈铜牌）/ `tm_warwatch`（北坡夜观·战线真相收束→回主线 east_tiemen_after）
- 事件 6 则（day 209-239）：东军增兵/枢机选举周/商路封锁/难民潮/北境雪狼旗/废墟铁匣
- 与 v64 世界模拟联动：枢机选举（克莱门特/奥黛拉）、战争阶段均沿用既有设定，本包只加内容不碰引擎

**如何验证**：同上。

## 三、入口连通修复（关键质量动作）

入边分析发现 4 个新节点 0 入边 + 3 处主入口缺失，已全部修复：
| 修复 | 位置 |
|---|---|
| arrive_east_tiemen + 「绕到东军前线营地」→ tm_frontline | src\script_02.js |
| elf_first + 「去银叶集市」→ elf_deep_market | src\script_02.js |
| orc_camp + 「去营地集市」→ orc_deep_market | src\script_02.js |
| orc_deep_gate + 「跟猎手打猎」→ orc_deep_hunt / 「离开草原」→ orc_deep_leave | dn_orc_deep.js |
| elf_deep_altar + 「入夜找林歌」→ elf_w_enter | dn_elf_dwarf.js |
| tm_negotiate + 「收拢线索」→ tm_warwatch | dn_warfront.js |

修复后重跑入边分析：PE 全部节点有入边（剩余孤儿均为系统节点：面板/标题卡/结局/世界事件池节点，由引擎动态调用）。

## 四、验证链结果（v91 终态）

```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=game_check=6,177,367B / chunked=index=3,538,588B）
[PASS] elda full 18 检查器
[PASS] 性能预算门（baseline 更新至 6,177,367B，6 项全过）
[PASS] smoke_test.py RESULT: PASS（建号→30步→5面板→存读档→结局）
[PASS] bu 桌面 1280 实测：游戏启动正常、14 面板齐全、23 新节点全部注册、事件池 75 个、HOMELANDS 九地完整
```

## 五、内容增量总览（v90 → v91）

| 指标 | v90 | v91 | 增量 |
|---|---|---|---|
| 节点数 | 3,789 | 3,823 | +34（PE 内容包） |
| 事件池 EVENT_POOL_EXT | 60 | 75 | +15（PE 三包） |
| 好感 NPC 支线 | 9 | 11 | +2（灰鬃/林歌，均 65 挚友闭环） |
| 新地图区域探索层 | — | 兽人草原/精灵王庭/矮人王都/铁门关 | 4 区域日常层 |
| game.html | 6,089,100B | 6,177,367B | +88,267B（内容，非代码膨胀） |

## 六、备份

- `backup\PE1_20260909\`（script_01.js 事件追加前）
- `backup\tags_*`（node_tag.py 自动生成）
- `backup\scripts_archive\tmp\`（全部 PE 探查/修复脚本）

## 七、后续方向建议（供参考）

1. **新势力/新地域内容包**：西境（v64 有 west 势力但地图无西境区域）、死亡沙漠深化（当前仅 2 城）
2. **内容工具生态完善**：node_graph.html 可视化图谱已存在，可接 node_tag 标签做区域过滤
3. **云存档灰度**：IndexedDB 已就位（elda-saves），可做导出/导入加密 + 多设备
4. **文本治理自动化**：26 词表已达标，可将 `elda text freq` 接入 ci 做持续门禁
