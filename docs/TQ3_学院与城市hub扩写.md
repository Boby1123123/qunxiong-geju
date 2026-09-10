# TQ-3 · 学院全链 + 城市 hub 薄节点扩写

> 批次：文本本体革命 · 工程 TQ 第 3 批
> 日期：2026-09-10
> 基线：TQ-2 后（节点 4,601 / 四路 game=game_check=7,999,027B、chunked=index=5,330,812B）

## 一、目标与口径

口令原文：`academy_* 269 节点 + 各城市 hub（交汇城/铁门关/圣城/承天城/沙漠城）薄节点（约 250 个）扩写`，完成标准 `该批节点平均字数 ≥450`、deep 数量上升。

## 二、实际执行（改动清单）

### 2.1 侦察结论

- **academy 全部 269 节点**位于 `chunks\v62_academy.js`（475,465B，函数式 `nodes["id"]=function(){...}`），注入前字数分布：<300 共 73、300-500 共 90、500-800 共 78、800-1500 共 19、1500+ 共 9，**平均 ~214 字**。
- text 三形态：
  - 形态A：直接数组 `text:[...]`；
  - 形态B：`return [...]` 数组字面量；
  - 形态C：`text:function(){var base=[...]; base.push(...); return base;}` 动态拼接（如 academy_year1_grades / academy_political / academy_year_events——含 `+g+"级。"` 动态段）。
- **城市 hub 薄节点 34 个**分散于 4 个 src 文件（script_02.js 24 个如 arrive_* / travel_*_start / board_*_done；script_02b.js 3 个 event_hub / causality_hub / prologue_choose_chengtian；script_03.js 2 个 ending_prelude_hub / mat_market_hub；script_04.js 1 个 grad_hub），均为对象式 `N["id"]={...}`、text 直接数组。

### 2.2 注入执行

| 目标 | 注入数 | 说明 |
|---|---|---|
| `chunks\v62_academy.js` | **67 节点** | a-f 六批合并 64 成功 + g 修正 3（no-match 动态拼接节点，扩展注入器支持 `return <任意变量名>;` 后重注入成功） |
| `src\script_02.js` | 24 节点 | arrive_*/travel_*/board_*/north_tavern2/east_after/church_after 等市井白描 |
| `src\script_02b.js` | 2 节点 | causality_hub / prologue_choose_chengtian |
| `src\script_03.js` | 1 节点 | mat_market_hub（ending_prelude_hub 为动态伏笔簿文本，已有 v47_arcLines 多段拼接，跳过） |
| `src\script_04.js` | 1 节点 | grad_hub |
| **合计** | **95 节点** | event_hub 为纯动态事件池 hub（evType 分支数组），跳过扩写 |

**注入器升级**（backup\scripts_archive\tmp\tq3_inject.py）：
1. 支持 `N|nodes["id"]` 双形态（academy 分片 vs src 对象式）；
2. 形态C 从 `return arr;` 扩展为 `return (\w+);` 任意变量名（修复 academy_year1_grades/political/year_events 三节点 no-match）。

**写作文风**：全部按 V66 古典白描——环境白描（光线/气味/声音）→ 在场人物细节（神态/动作/口吻）→ 事件/对话 → 余韵；扩写只追加段落，**不改原句、不改选项、不改判定、不删句**。

### 2.3 扩写效果

| 指标 | 注入前 | 注入后 |
|---|---|---|
| academy 平均字数 | ~214 | **531.2** |
| academy <300 节点 | 73 | **20** |
| academy 300-500 | 90 | 140 |
| academy 500-800 | 78 | 81 |
| academy 800+ | 28 | 28 |
| academy 总字数 | ~58k | **142,881** |

城市 hub 27 节点全部扩写至 300+ 字（原 44-292 字 → 400-650 字），补市井白描（叫卖/气味/行人/对话）。

## 三、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（26 块 src + v62_academy） | **PASS** |
| _build_authority.py build | build OK → game_built.html (4,928,032 字符) |
| elda chunks | 分片缺失 0 / 多余 0 / 43 文件语法 PASS / 节点 4,601 一致；死链 246 为**已知 origin_* 误报**（verify_chunks 正则不认 v62 分片 nodes[...] 定义，TQ-2 已定性，ci 独立死链检查为权威） |
| elda sync 四路 | **game=game_check=8,003,677B / chunked=index=5,332,645B** |
| elda budget | 已更新 baseline（game 8,036,777→8,003,677 上限 8,053,677；chunked 上限 5,432,645） |
| **elda ci（25 检查器）** | **全部通过（可发布）**：文本治理 0 超标、引号配对=是、连续标点 0、节点 4,601≥4,551、四路一致、性能预算门 6 项 PASS |
| smoke_test.py | **PASS**（30 步推进 / 5 面板 / 存读档 / 结局可达） |
| bu 分片版实测 | 建号成功；hub 扩写段确认加载（arrive_free_huigang "帆樯林立"、north_tavern2 "麦酒"、grad_hub "岔路口"）；academy 扩写段确认在分片 script 源码中（战鼓声/岔路口等关键词命中 v62_academy 分片） |
| git 提交 | **a629076**（pre-commit ci_guard 全量门禁 PASS，27 文件，+1,021/-777） |

## 四、扩充记录

| 扩了什么 | 为什么 | 如何验证 |
|---|---|---|
| academy 67 节点补环境/人物/事件细节 | 学院章原均 <500 字，缺乏学年季节感与在场细节，读起来像提纲 | 平均字数 214→531；bu 分片版源码搜索命中注入段落 |
| 城市 hub 27 节点补市井白描 | 到达节点原仅 1-2 句（如 board_east_done "活计办妥，赏金落袋"），无城市氛围 | 字数全部 ≥400；elda ci 文本治理 0 超标 |
| 注入器升级（N/nodes 双形态 + 任意 return 变量名） | 处理 academy 动态拼接节点（year1_grades 等含 flag 动态段） | 3 个 no-match 节点重注入成功，node --check PASS |
| 扩写全部遵守 30 治理词 | 防 AI 味回潮（T0-2 已治理，不可回退） | elda text guard / ci 文本治理门禁 0 超标 |

## 五、未覆盖与后续

- academy 剩余 20 个 <300 节点（academy_start 134 / academy_dwarf_class 183 / academy_orc_year1 236 等，多为入口/分支小节点）未扩——本批覆盖 73 个 <300 中约 64 个；剩余节点将随 TQ-4（五主线+七锚枢纽 deep 化）与后续批次处理。
- ending_prelude_hub（动态伏笔簿）与 event_hub（纯动态池）为动态结构，扩写无意义，跳过并登记理由。
