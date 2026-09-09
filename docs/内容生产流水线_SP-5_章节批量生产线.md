# 内容生产流水线 SP-5 · 章节批量生产线

> 批次：SP-5 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 + 工具实测通过

## 一、本批目标

把"写一章"从逐节点手工，变为**一条命令生成整章链式骨架**：读叙事蓝图自动推导卷/章/入边/出口锚点，产出可直接填正文的链式节点数组。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `tools\elda\p2tools_impl.py` | 修改 | 新增 `cmd_content_chapter`：`--vol/--ch/--count/--prefix/--anchor/--exit/--arc`；读蓝图推导卷名/章/锚点；生成链式骨架写 `dn_scaffold_chapter.js`；分发表注册 `chapter` |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp5_apply / _tmp_sp5_probe |

## 三、工具实测

```
elda content chapter --vol vol_war --count 6 --prefix sp5_war_demo --arc arc_war
```
输出：
- 卷=第八卷 · 战争与日蚀 ｜ 章=ch_war_west（西境 · 烽火）
- 入边锚点=travel_west_start（卷首章 anchor）
- 出口锚点=seal1_act1_intro（下一卷 vol_abyss 首章 anchor，自动推导）
- 6 个链式节点 sp5_war_demo_0→…→5→seal1_act1_intro，首节点带"折返入边锚点"选项，node --check 即过

**锚点自动推导规则**：`--anchor` 缺省取章 anchor；`--exit` 缺省取下一卷首章 anchor → 本卷末章 anchor → 弧 resolution 首锚点。

## 四、验证链结果

| 检查 | 结果 |
|---|---|
| p2tools_impl.py 语法 | ast.parse OK |
| node --check（src 26 块） | PASS |
| `elda ci` | 全绿：21 检查器 / 四路一致（game=game_check=6786993B）/ 死链 0 / 节点 3877 |
| 运行时 | 零影响（纯 dev 工具，不进构建） |

## 五、坑记录

1. **Python 源码内 `'\n'` 在 Write 落盘时会变真实换行**导致字符串断裂——写工具脚本时统一用 `'\\n'`（本批两处损坏均为此因，已修复并作为铁律记入后续脚本书写）。
2. 模板/骨架文件统一**不进构建**（dn_scaffold.js / dn_scaffold_chapter.js / dn_node_templates.js 均已排除），占位 go 不会污染死链检查。

## 六、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；节点数 3877 零损失；文本零改动

## 七、作者工作流（SP-5 后）

```
elda content chapter --vol vol_west --count 12 --prefix bd5_west --arc arc_west
→ 拆分 dn_scaffold_chapter.js 节点 → 另存为正式 dn_bd5_west.js
→ 入边锚点节点 options 补 go → node --check → elda ci → 浏览器回归
```

## 八、下一批

SP-6 生产质检流水线：三检查器 c_skeleton / c_arc / c_report 接入 elda ci（21→24）。
