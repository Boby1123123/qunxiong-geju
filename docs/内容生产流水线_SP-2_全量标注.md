# 内容生产流水线 SP-2 · 全量元数据标注

> 批次：SP-2 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 ｜ WARN 清单待用户人工确认（347 节点，9%）

## 一、本批目标

将 **3,877 节点全量标注**到叙事蓝图的 nodeIndex（`nodeId → {arc, vol, act, ch, type}`），使每个节点可被"弧线/卷/章"定位。自动推导 + WARN 人工确认双轨。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_story_blueprint.js` | 修改 | nodeIndex 空表 → **3,877 条全量标注**（91.0% 弧 / 91.1% 卷）；文件 22.7KB → 397KB |
| `game.html`（权威源） | 更新 | build → 提升，纳入 nodeIndex（+374KB，6,785,268B） |
| `game_check.html` / `game_chunked.html` / `index.html` | 四路同步 | 字节一致 |
| `budget.json` | 更新 | baseline 6406889 → 6785268（合法内容层增长，--reason 记录） |
| `docs\内容生产流水线_SP-2_WARN清单.md` | 新增 | 347 个未自动标注节点清单（人工确认） |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp2_annotate / _tmp_sp2_probe / _tmp_sp2_warn / _tmp_sp2_check |

## 三、标注规则（三层推导）

1. **79 弧 prefixes 最长匹配**（蓝图 arcs.prefixes，按前缀长度降序）→ 命中即归属弧/卷/幕/类型
2. **弧兜底规则表 ARC_FALLBACK（~130 组）**：city_* 城市映射、h_* 隐藏线、dun_* 地下城、u8_* 群像、v66_* 记忆系统、west_* 西境、relic_/extinct_/primordial_ 远古线、moral_/karma_/consequence_ 因果线、foreshadow_* 伏笔线、npc_rel/relation_ 关系线等
3. **职业弧派生**：sub_/arc_/v56s_/v57*_/job_ → `arc_job_<职业>`（职业名含中文，统一 vol_academy）

卷归属 = 弧 vol 优先 → VOL_RULES 前缀表 → travel_/city_/world_/h_ 动态规则。

## 四、标注结果

| 维度 | 覆盖 | 占比 |
|---|---|---|
| 弧归属 | 3,530 / 3,877 | **91.0%** |
| 卷归属 | 3,531 / 3,877 | **91.1%** |
| 章归属（anchor 前缀） | 36 章锚点全覆盖 | — |

**弧分布 Top 12**：arc_seal 541 / arc_war 409 / arc_academy 377 / arc_origin 168 / arc_fac_free 157 / arc_classmate 129 / arc_pol 106 / arc_fsh_primal1 70 / arc_fac_abyss 61 / arc_fac_wt 61 / arc_eclipse 54 / arc_fac_church（其余 67 弧）

**未标注 347 节点（9%）**：均为 1-2 节点/组的散孤（如 item_* 用途节点、act_rest 幕间、adventure_log 系统、parting 告别等），不影响运行时（SP-3 对 null 弧节点降级处理）。

## 五、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块 + 蓝图 3877 条 JSON） | PASS |
| `elda ci` | 全绿：21 检查器 / src 语法 / 权威源幂等 / 四路一致（game=game_check=6785268B）/ 预算门（上限 6835268） |
| `smoke_test.py` | PASS（30 步 / 5 面板 / 存读档 / 结局） |
| bu 桌面 1280 实测 | `window.STORY_BLUEPRINT.nodeIndex` 运行时 **3,877 条**；抽样 seal1_act1_intro→arc_seal/vol_abyss/act3/ch_abyss_seal ✓、arrive_free_huigang→arc_fac_free/vol_free/act1/ch_free_huigang ✓ |

## 六、关键坑记录（供后续批次）

1. **nodeIndex 写回必须用位置切片**（`find('nodeIndex:')` + `rfind('\n};')` 重组），不能用 `re.sub` 匹配 `nodeIndex: {}`——重复写回时键已是 JSON，正则匹配失败且打印不报错（误导）。SP-3+ 修改蓝图文件时留意。
2. **内联 Python 验证大 JSON 会因 PowerShell 转义误读**（读到旧缓存），改走 .py 文件脚本验证。
3. **`_vol_nodes()` 权威口径 = 3,877**（src 3,339 + chunks 546 中无重复）；自定义收集会漏 v57q/b/f/l 等分片前缀（374 个），必须复用 `_vol_nodes()`。
4. 职业弧派生第二段可为中文（v57b_战士_*），正则需含 `[\u4e00-\u9fa5]`。

## 七、WARN 清单确认指引

`docs\内容生产流水线_SP-2_WARN清单.md` 列出 347 个未自动标注节点（分"未归属弧 / 未归属卷"两节）。确认方式：
- 可接受现状（null 弧降级）→ 无需操作
- 需归属 → 将节点 id 与目标弧/卷告知，后续批次补入 ARC_FALLBACK 后重跑标注脚本

## 八、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（nodeIndex 为纯数据，零存档依赖）
- 节点数 3877 零损失；文本零改动；移动端未做新增

## 九、下一批

SP-3 弧线生命周期：S.arcs 运行时推进（writeNext 渲染前钩子读 nodeIndex → 推进所属弧 stage）、applyDefaults 兜底、弧线状态面板数据源。
