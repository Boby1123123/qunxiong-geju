# 内容生产流水线 SP-4 · 节点模板工厂

> 批次：SP-4 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 + 工具实测通过

## 一、本批目标

把"写一个合规节点"从凭记忆套格式，变为**填占位即合规**的模板化生产：12 类节点模板单一权威源 + elda content new 脚手架自动带弧/卷/章标注。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_node_templates.js` | 新增（5KB） | `window.NODE_TEMPLATES` 12 类模板：main_advance / main_city / branch_quest / branch_bond / event_world / event_random / ending / combat / explore / trade / transition / variant；每类含 tag/pace/text/options 骨架 + _meta 用途说明 |
| `tools\elda\p2tools_impl.py` | 修改 | `cmd_content_new` 升级：`--tpl`（12 类，缺省按 type 推断）+ `--arc/--vol`（蓝图校验+自动卷）+ 新增 `_load_node_templates`（node eval 提取 JS 模板）+ `_tpl_to_node`（模板→节点字面量） |
| `_build_authority.py` | 修改 | `_collect_data_nodes` 排除 `dn_node_templates.js`（模板为 dev 工具源，不进构建；占位 go 避免被死链检查器误扫） |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp4_apply / _tmp_sp4_probe |

## 三、工具实测

| 命令 | 结果 |
|---|---|
| `elda content new --type branch --tpl branch_bond --id sp4_demo_bond --vol vol_free --arc arc_fsh_primal1` | 生成成功；头注释含"所属弧：arc_fsh_primal1（支线 · 远古一 · 幕act3 · vol_free）"；node --check 即过 |
| `elda content new --type event --id ... --vol vol_west` | 默认推断 tpl=event_world ✓ |
| `elda content new --type main --id ... --arc arc_war` | 弧校验 + **自动推断卷 vol_war** ✓ |
| `--tpl __bad__` | 报错并列出 12 类可用模板 ✓ |

> 坑记录：模板是 JS 对象（键可无引号），json.loads 会失败 → `_load_node_templates` 改用 **node eval 求值 + JSON.stringify** 提取，天然正确。

## 四、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块） | PASS |
| `elda ci` | 全绿：21 检查器 / 四路一致（game=game_check=6786993B）/ 死链 0（模板排除构建后占位 go 不再误扫）/ 节点 3877 |
| `smoke_test.py` | PASS |
| bu 桌面 1280 | 无回归（上一批建号路径已实证） |

## 五、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；旧档兼容
- 节点数 3877 零损失；模板文件不进构建，游戏运行时零影响

## 六、作者工作流（SP-4 后）

```
elda content new --type branch --tpl combat --id bd5_west_fight --arc arc_west --vol vol_west
→ 编辑 src\data_nodes\dn_scaffold.js（替换【】占位）
→ 另存为 src\data_nodes\dn_bd5_west.js（dn_scaffold 不进构建）
→ node --check → elda ci → 浏览器回归
```

## 七、下一批

SP-5 章节批量生产线：elda content chapter——按蓝图卷/章/弧批量生成整节节点骨架（含入边锚点闭环）。
