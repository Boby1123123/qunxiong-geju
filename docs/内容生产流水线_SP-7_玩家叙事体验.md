# 内容生产流水线 SP-7 · 玩家叙事体验

> 批次：SP-7 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 + bu 桌面实测通过

## 一、本批目标

把叙事骨架从"生产端资产"变成"玩家可见体验"：玩家随时知道自己在哪里、在走哪条故事线、当前处于什么阶段、下一段往哪走。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\script_04.js` | 修改 | ①手记入库标注卷/章（/sp7inj:journal-vol/ 从 STORY_BLUEPRINT.nodeIndex 取 vol/ch，兼容无蓝图/旧数据）；②手记展示"第 N 天 · 卷名 · 章"（卷名映射蓝图 volumes）；③新增 `v91_storyPanel()` 叙事罗盘（/sp7inj:story-panel/：当前位置卷·章·弧 + 进行中弧线列表含阶段名/启程天数 + 当前指引）+ 工具栏「🗺 叙事」按钮注入 |
| `src\script_03.js` | 修改 | 章节卡弧名增强（/sp7inj:chapter-arc/）：sceneTitle 命中 CHAPTERS_I12 时，副标题补当前弧名（蓝图 nodeIndex→arcs 映射），同卷章不重复 |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp7_apply ×2 |

## 三、bu 桌面实测（file:// game.html，1280）

| 验证点 | 结果 |
|---|---|
| 建号（普路托斯/战士）→ 推进 6 步 | S.arcs={arc_origin} 已推进 ✓ |
| 「🗺 叙事」按钮注入 | btn-story 存在 ✓ |
| 叙事罗盘打开 | "当前位置：卷 · 第一卷 · 自由城邦 ｜ 弧 · 序章 · 身世" ✓ |
| 进行中的故事线 | "序章 · 身世 阶段1 ｜ 第 1 天启" ✓ |
| 当前指引 | "继续推进当前故事线（阶段 1/4）" ✓ |
| 手记按钮 | btn-journal 存在（卷章标签注入后待玩家推进自然产生数据）✓ |

## 四、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块） | PASS |
| `elda ci` | **全绿：24 检查器** / 四路一致（game=game_check=6793639B）/ 死链 0 / 节点 3877 |
| `smoke_test.py` | PASS |

## 五、坑记录

1. **PowerShell 内联 python 三引号含 `--gold2`（CSS 变量）会被 PowerShell 解析器打断** → 一律写 .py 文件执行（再次确认铁律）。
2. 卷/章 id 与中文名映射：蓝图 volumes/arcs 各带 name 字段，面板与手记均须映射显示（首次实测显示 id，已优化为中文名）。

## 六、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；手记仍独立 localStorage 键（elda-journal-v3）
- 节点数 3877 零损失；文本零改动

## 七、下一批

SP-8 示范章 + 技能固化：西境游侠学院示范章（30-50 节点，走模板工厂 + 章节生产线全流程）+ elda-content-author 技能按新蓝图流程更新 + 全方案收尾文档。
