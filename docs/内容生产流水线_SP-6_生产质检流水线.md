# 内容生产流水线 SP-6 · 生产质检流水线（三检查器）

> 批次：SP-6 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，elda ci 24 检查器全绿 + smoke PASS

## 一、本批目标

把"内容生产流水线"的质检从命令级提升为**门禁级**：叙事骨架 / 弧线覆盖 / 生产报表三检查器接入 elda ci（21→24），任何破坏蓝图结构或弧线标注的内容变更在发布前被拦下。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `tools\eldacheck\checks\c_skeleton.py` | 新增 | **叙事骨架门**：STORY_BLUEPRINT 完整性（幕≥5/卷≥10/章≥36/弧≥79/索引≥3877）+ 章锚点可达（>3 缺失 FAIL） |
| `tools\eldacheck\checks\c_arc.py` | 新增 | **弧线覆盖门**：弧归属率 ≥88%（当前 91.0%）、未归属 ≤400（当前 347）、空弧 ≤5 容差（当前 3，骨架先行弧） |
| `tools\eldacheck\checks\c_report.py` | 新增 | **生产报表**：每卷节点数 / 每弧 Top10 / pace 分布；light/deep 占比仅提示（硬门禁归 c_pace，避免口径打架） |
| `tools\eldacheck\eldacheck.py` | 修改 | import + full 列表注册三项（21→24） |
| `tools\elda\elda.py` | 修改 | ci 文案 21→24 |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp6_apply*×3 / probe*×2 |

## 三、实测数据

```
✓ 叙事骨架门 [PASS] 幕5 卷10 章36 弧79 索引3877 锚点35/36 — 全部通过
✓ 弧线覆盖门 [PASS] 覆盖 3530/3877 (91.0%)·未归属 347·空弧 3（≤5 容差）
✓ 生产报表 [PASS] light 33.3% deep 7.8% · 卷 vol_academy=1570, vol_abyss=658, vol_war=503 …
    [提示] light 占比 >20%（参考 c_pace 口径）
```

## 四、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块） | PASS |
| `elda ci` | **全绿：24 检查器** / 四路一致（game=game_check=6786993B）/ 死链 0 / 节点 3877 |
| `smoke_test.py` | PASS |

## 五、坑记录

1. **蓝图对象含 `/* */` 注释** → JSON 解析必须先剥注释（三个检查器的 `_parse_obj` 统一加 `re.sub(r'/\*.*?\*/', '', seg, re.S)`）。
2. **c_arc 空弧误判**：弧 id 不在 nodeIndex 键里，`aid not in idx` 恒真 → 79 弧全报空弧；改为只检查 `any(v.get('arc')==aid)`。
3. **c_report 逐节点 re.search 太慢（6.7s > 5s 阈值）** → 改一次 `finditer` + `[^{}]` 限域（pace 在 tag/place 后、text 数组前，限域防跨节点误配），降到 1s 内。
4. **节奏阈值口径冲突**：c_report 与 c_pace 扫描口径不同会打架 → c_report 阈值降为信息提示，硬门禁归 c_pace 单一权威。

## 六、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；节点数 3877 零损失；文本零改动
- 新增检查器只读（不改 game.html / src / 存档）

## 七、下一批

SP-7 玩家叙事体验：弧线进度面板 / 目标指引 / 卷章手记 / 章节卡增强（把骨架从"生产端资产"变成"玩家可见体验"）。
