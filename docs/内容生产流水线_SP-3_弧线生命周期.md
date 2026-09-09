# 内容生产流水线 SP-3 · 弧线生命周期

> 批次：SP-3 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿 + bu 实测弧线推进生效

## 一、本批目标

让叙事蓝图从"静态数据"变为"运行时状态"：玩家推进节点时，自动记录所属弧线及其所处阶段（setup/rising/climax/resolution），为弧线进度面板、多周目继承、叙事目标指引（SP-7）提供数据源。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\script_03.js` | 修改（3 处注入） | ① applyDefaults 加 `if(!s.arcs) s.arcs={}`（/sp3inj:defaults/）② 新增 `v91_arcState/v91_arcReset/v91_arcAdvance` 三函数（/sp3inj:arcfn/）③ writeNext 记忆注入行后加推进钩子 `try{ window.v91_arcAdvance(node); }catch(e){}`（/sp3inj:archook/） |
| `game.html` 等四路 | 同步 | game=game_check=6,786,993B（SP-3 后） |
| `budget.json` | 更新 | baseline 6785268→6786993（+1.7KB 引擎层合法增长，--reason 记录） |
| `backup\` | 快照 | snap_20260909_220703_SP3-arcs-基线含SP1SP2产物.zip（23,566.6KB） |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp3_apply.py |

## 三、实现机制

**v91_arcAdvance(node)**（writeNext 渲染前调用，只读 node + 写 S.arcs，不触碰判定/选项）：
1. 读 `window.STORY_BLUEPRINT.nodeIndex[curNode]` → rec.arc（无弧则返回）
2. 在 arcs 表中找该弧 → 取 stages{setup,rising,climax,resolution} 锚点数组
3. 按"resolution→climax→rising→setup"优先级判定 curNode 落在哪个阶段 → want(1-4)
4. main/ending/faction 型节点且弧无 stages 时兜底 want=1
5. `S.arcs[arcId] = {s: want, st: 首次进入日, ls: 最近日}`，stage **只增不减**

**S.arcs 兜底**：emptyState 无此字段；applyDefaults 补 `{}`（旧档兼容零迁移）。

**导出**：`v91_arcState()` 返回 S.arcs 全文；`v91_arcReset()` 清空（供新周目调用点接入）。

## 四、bu 桌面 1280 实测

| 步骤 | 结果 |
|---|---|
| 建号（普路托斯/人类/北境人/战士/富甲天下/阅读/凡骨） | 成功进入 origin_free_city_1 |
| 推进 40 步 | `S.arcs={arc_origin:{s:1,...}}`（弧线记录+setup 阶段） |
| 再推进 60 步 | 仍沿 arc_origin 推进（序章弧内），day=1 正常 |
| 钩子健壮性 | 未命中弧节点零写入；异常 try/catch 包裹不阻塞渲染 |

> 卡点记录：`btn-start` 校验姓名/职业/理想/亚种全齐才放行；S.job 用**中文键**（JOBS 键名，如"战士"）不是英文。建号 UI 点击曾因 S.job 未设置被拒，改用"设 S 字段 + 点开始旅程"通过——SP-7 的冒烟驱动可沿用此路径。

## 五、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（src 26 块） | PASS |
| `elda ci` | 全绿：21 检查器 / src 语法 / 权威源幂等 / 四路一致（game=game_check=6786993B，chunked=index=3732777B）/ 预算门（上限 6836993）/ 节点 3877 |
| `smoke_test.py` | PASS |
| bu 桌面 1280 | 弧线推进生效（见上表） |

## 六、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰（推进钩子为 try/catch 只读注入点）
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（S.arcs 缺省补空）
- 节点数 3877 零损失；文本零改动

## 七、下一批

SP-4 节点模板工厂：12 类节点模板（dn_node_templates.js）＋ elda content new 脚手架升级（读蓝图生成带弧/卷/章标注的模板）。
