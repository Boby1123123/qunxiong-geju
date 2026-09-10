# CON-2 过渡链补齐 + 决策回响节点（文本本体革命 · 衔接与连续性）

> 批次：CON-2 ｜ 日期：2026-09-10 ｜ 口令：《群雄割据 文本本体革命（五工程十批）》CON 工程
> 状态：✅ 完成（ci 25 检查器全绿 / smoke PASS / 四路字节一致 / bu 分片版复验通过）

## 一、本批做了什么

### 1. 过渡链补齐（elda content transition 新子命令 + 1212 节点注入）

- **新工具**：`tools\elda\p2tools_impl.py` 新增 `elda content transition` 子命令——
  - `_extract_node_fields`：提取节点 id/place/正文；
  - `TRANSITION_HINTS`（31 词：前往/上路/旅途/抵达/穿过/翻过/渡过/赶路/官道/商队/马车/驿站/城门/山道/小径/风雪/夜路/路程/行程/启程/行至/一路/沿途/归来/回到/出了/进了/北行/南下/西行/东去）；
  - `META_PLACE_HINTS`（系统/总览/世界动态/世界状态/新世界的诞生/记忆的回廊/v25/菜单/操作/调试/设置/存档管理/游戏设置——元地点豁免）；
  - `TRANSITION_SKIP_IDS`（8 个 fn_noret 特殊节点：battle_seal1_defeat / i_origin_brothers_unite / i_watchmen_why_me / moral_choice_event / pov_recap_node / prologue_crisis / slow_travel_companion_talk / v47_ledger——正文自带收束）；
  - **hub 豁免逻辑**：跨地点出边 ≥3 的 hub 节点（121 个）豁免，避免向中枢重复注过渡句。
- **注入器** `backup\scripts_archive\tmp\con2_transition.py`：12 条过渡句模板（全部含提示词、V66 白描、治理词 0），按节点 id md5 轮换，`{loc}` 替换为 place 中段短名；三形态注入（fn 函数式 181 + arr 对象式 1008 + var 变体 23 = **1212 节点**）。
- **结果**：`elda content transition` 待补清单 **1949 → 1695 → 265 → 0 条**。

### 2. 决策回响节点（30 个重大 flag 的回响）

- **新文件** `src\data_nodes\dn_echo.js`：30 个回响节点（`echo_` 前缀），全部 **ifFlag 变体**（v91_resolveText 三形态复用、零引擎改动）——有 flag 显示回响正文（30-100 字具体场景白描），无 flag 显示轻过渡（default 段），选项 1 个返回原目标。
- **挂载**：27 处 F 节点 options 插入 `{t:"（此处可稍作停留）", go:"echo_xxx"}`（30 flag 中 3 个 CHAIN 串联：purge_intensified→echo_council_support_purification、beijing_saved→echo_aquan_liberated、eclipse_infiltrator→echo_bandit_leader_killed），另 3 个 flag 已由 DIRECT 覆盖；原 F 节点 go→Y 链保留。
- **账本**：`dn_causality.js` 新增 `led_echo_01~30`（30 条，type=伏笔，plant=flag:xxx，reap=node:echo_xxx，world=回响线）——账本 117 → **147 项**。
- **蓝图**：`dn_story_blueprint.js` nodeIndex 尾部锚点法插入 30 项（arc 归属：fac_dwarf/fac_east/fac_elf/fac_free/arc_academy/fac_orc/arc_frontier）。

### 3. 分片版基础修复（本批发现并修复的既有缺陷）

- **FREE_BOARD 顶层引用报错**（`chunks\story_system.js` board_free 等委托板节点顶层 IIFE 引用 FREE_BOARD，而常量定义在分片加载之后 → ReferenceError，委托板节点定义失败）：
  - `tools\elda\chunks_impl.py` 改进：把 `const X=[...]; window.X=X;` 模式的顶层数据常量（FREE_BOARD/NORTH_BOARD/SOUTH_BOARD/ELF_BOARD/DWARF_BOARD/ORC_BOARD/EAST_BOARD/CHURCH_BOARD 等）**提取到分片加载之前**（`const N` 之后、NODE_MAP 之前），并从尾部内联块移除（防重复定义）。
  - 修复后 bu 实测：FREE_BOARD 错误 0、board_free 节点正常（2 选项）。
- **v62 旧序章死链**（`chunks\v62_origin.js` origin_eastern_1 的"（序章扩充）东境·承天城"选项 go 指向不存在的 origin_expand_eastern_1，单文件版无此残留）：
  - 删除该悬挂选项（166 字符），分片版与新序章对齐，`verify_chunks` 死链归零、chunks exit 0。
- **verify_chunks 正则兼容**：node_ids 正则增加 v62 旧格式 `nodes["id"]=` 匹配。

## 二、扩充记录（扩了什么 / 为什么 / 如何验证）

| 扩充项 | 为什么 | 如何验证 |
|---|---|---|
| `elda content transition` 子命令 | 过渡句补写从人工排查变为命令化定位 | 三迭代待补 1949→0；`elda content transition` 输出 0 条 |
| 1212 节点过渡白描 | 跨地点跳转缺旅途转场，衔接突兀 | 注入后 node --check 72/72、guard 全绿、四路字节一致 |
| 30 决策回响节点 | 重大选择无后续回响，故事完整性弱 | bu 实测 N 含 30 个 echo_*、ifFlag 变体完整；账本 147 项 closed 核销正确 |
| 分片顶层常量提前 | 分片版委托板 FREE_BOARD ReferenceError（既有） | bu 实测错误 0、board_free 可访问 |
| v62 死链选项移除 | 分片版旧序章含悬挂 go（既有） | verify_chunks 死链 0、chunks exit 0 |

## 三、验证链结果

```
node --check:             72/72 PASS（src 26 + data_nodes + chunks 43）
elda text guard:          AI 高频词 30 词全 ≤30 / 引号 左=右=3663 / 连续标点 0 —— 全部通过
elda sync 四路:           game=game_check=8,211,142B；chunked=index=5,478,191B —— 字节校验一致
elda budget:              node_total_min 4581；baseline.game_html 8,211,142；chunked 上限 5,578,191
elda ci:                  25 检查器全部通过（可发布）—— 含账本 147 项核销、叙事骨架、七锚终局、文本治理、性能预算门 6 项
smoke_test.py:            RESULT: PASS（30 步推进 / 5 面板 / 存读档 / 结局触发）
bu 分片版实测:            FREE_BOARD 错误 0；window.N=4644；echo_* 30 个；board_free 2 选项；echo_beijing_saved ifFlag 变体渲染正常
```

## 四、改动清单（文件 + 行级摘要）

| 文件 | 改动 |
|---|---|
| `tools\elda\p2tools_impl.py` | +`cmd_content_transition`/`_extract_node_fields`/`TRANSITION_HINTS`/`META_PLACE_HINTS`/`TRANSITION_SKIP_IDS`/hub 豁免；cmd_content 分发更新 |
| `tools\elda\chunks_impl.py` | +顶层数据常量提前（`_CONST_PAT` 从后往前删除）；verify node_ids 兼容 `nodes["id"]=` 旧格式 |
| `src\data_nodes\dn_echo.js` | 新建：30 回响节点（ifFlag 变体 + default 轻过渡 + 1 返回选项） |
| `src\data_nodes\dn_causality.js` | +30 条 led_echo_*（147 项）；修复数组尾逗号 |
| `src\data_nodes\dn_story_blueprint.js` | nodeIndex 尾部 +30 项；修复尾逗号 |
| 46 个 src 文件 | 过渡句注入（1212 节点：fn 181 / arr 1008 / var 23） |
| 27 个 F 节点所在文件 | options +1 `{t:"（此处可稍作停留）", go:"echo_xxx"}` |
| `chunks\v62_origin.js` | 删除悬挂"（序章扩充）东境·承天城"选项（166 字符） |
| 构建产物 | game.html/game_built.html/game_check.html/game_chunked.html/index.html/budget.json 重建同步 |
| `backup\scripts_archive\tmp\` | con2_transition.py、con2_echoplan*.py、con2_fix_*.py、con2_ci_out*.txt 等临时脚本/输出归档 |

## 五、过程教训（写入技能库）

1. **数组/对象尾逗号**：Python `json.loads` 不允许尾逗号（JS 允许）——账本/蓝图插入后必须检查末项无逗号，这是 ci"检查器异常 'closed'"/"STORY_BLUEPRINT 缺失"的根因。
2. **Edit 失败 → 写 .py 脚本**：PowerShell 5.1 下 Edit 的 old_string 需精确到字节；多次失败直接改 python 正则脚本。
3. **正则迭代中修改字符串**：`for m in finditer: s = s[:m.start()]+s[m.end():]` 会偏移错乱 → 先收集 (start,end,text) 再**从后往前**删。
4. **分片版 ≠ 单文件版**：game_chunked.html = 第3 script 块节点分片 + 第4-19 块原样保留 + v62 旧分片注入（同名覆盖）——分片版节点数（4644）> 单文件版（2934）；bu 实测必须以目标版本为准。
5. **分片顶层常量**：非 N 节点代码（const X=[...]）被分片丢到尾部内联块，被节点顶层 IIFE 引用会 ReferenceError（FREE_BOARD 案例）——已固化进 chunks_impl。

## 六、基线（下一批对照）

- 节点：src 4,631（budget node_total_min 4,581）；分片版运行时 4,644（含 v62 旧注入）
- 账本：147 项（closed 按 plant/reap 核销）
- 事件池：176；五主线 day 未动
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（回响=flag 变体，零存档结构改动）
- 四路：game=game_check=8,211,142B；chunked=index=5,478,191B
