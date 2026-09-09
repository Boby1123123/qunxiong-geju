# U2 · 模块边界治理（A5 孤岛甄别 + A6 裸引用清零）

> 批次：U2 | 日期：2026-09-09 | 依据：docs\状态Schema_v70 / budget_deadcode_v76 / U1-U9 口令
> 前置：备份 backup\U2_20260909\（53 文件：四路 html + budget.json + _build_authority.py + src_backup 全量）

## 一、A5 孤岛节点治理

### 1.1 方法学突破：单文件版 ≠ 全量视图

- game.html（6,026,261B）仅含 **1,939** 个 `N["id"]=` 节点定义 + **1,807** 处「N["xxx"] 已移入 chunks」注释占位（v62 时代把大节点块外置到 chunks\v62_*.js）
- **全量 3,744 节点** = game.html 1,939 定义 + chunks 独有 1,806（分片 14 片）
- 全量视图 = `merge_v62` 产物 **game_v62_full.html**（8,858,168B）——孤岛甄别的唯一正确分析基线
- 孤岛普查、分类、处置均以全量视图为准（此前以 game.html 统计的口径已废弃）

### 1.2 c_dead 检查器升级（孤岛判定口径）

原 c_dead 只认：静态 `go:"x"`（仅双引号）+ writeNext/curNode/startNode 硬编码。升级新增（tools\eldacheck\checks\c_dead.py）：

| 新增识别 | 说明 |
|---|---|
| 单引号 go | `go:\s*["\']` 双/单引号统一 |
| 动态机制调用 | travelTo/openModal/openNode/gotoNode/setNode/v66_contFor/startTravel 参数 |
| 前缀拼接引用 | `"arrive_"+x`、`'battle_'+id` 等（travel/battle/attr 机制按前缀拼节点 id） |
| 字段引用 | passNode/failNode/successNode/nextNode/entryNode/returnNode |
| NODE_MAP 分片加载清单 | chunks\NODE_MAP.js 中列出的节点 = 分片运行时入口 |
| 字符串级引用 | 节点 id 以字符串出现次数 > 定义次数（隐藏入口/条件/存档恢复点） |

### 1.3 孤岛数字变化（全量视图 3,744 节点）

| 口径 | 数字 |
|---|---|
| 口令基线（旧口径，game.html 视角） | 475 |
| 升级前（全量视图，仅静态 go） | 773 |
| 升级后（全量视图，动态+字段+NODE_MAP+字符串） | **112** |
| 处置后剩余 | 112（全部保留，逐项记录） |

**验收对照**：孤岛数 475 → **112**（下降 76%），每项有处置记录（docs\_u2_a5_处置记录.md，112 条全分类）。

### 1.4 处置原则与记录

- 铁律"内容零损失"优先 → **全部保留，不删不改任何节点**
- 112 个真孤岛分类：隐藏线 fsh 19 / 神性职业线 deity 9 / 伏笔线 foreshadow 4 / 旧结局变体 v36 3 / 战斗遭遇 battle 3 / 势力内容 faction 1 / 魔法内容 magic 1 / 其他内容线 72
- 判定：无静态 go / 无动态函数 / 无前缀拼接 / 无字段引用 / 无 NODE_MAP / 无字符串级引用 → 记录为"真孤岛（无任何可识别入口）"
- **全部处置=保留+记录**；后续如需给隐藏线补入口，从处置记录取 id（见 docs\_u2_a5_处置记录.md）

### 1.5 扩充记录（本批扩充了什么 / 为什么 / 如何验证）

- **扩充**：c_dead 检查器判定口径升级（6 类动态引用识别）
- **为什么**：原口径把 661 个有动态入口的节点误报为孤岛（假孤岛），无法指导内容治理；升级后孤岛清单才是"真无入口"的高质量清单
- **如何验证**：game.html 口径孤岛 496→354；全量视图 773→112；elda full 全绿（FAIL 0，死链 0）

## 二、A6 跨 script 裸引用修复（4 项 → 0）

### 2.1 现状与风险

c_refhealth 专项 4 项（跨 script 裸引用顶层 let/const）：

| 名字 | 声明位置 | 兜底 | 风险级 |
|---|---|---|---|
| CITY_ACTIONS | src\script_03.js:4001（const） | 无 | k（真风险：加载顺序变化即 ReferenceError） |
| UI_STATE | src\script_02f.js:629（let） | 无 | k（真风险） |
| pool | src\script_03.js:4196（let pool=300） | 隐式赋值 8 次 | k2（有兜底） |
| curNode | 原无声明（纯隐式全局） | 隐式赋值 60 次 | k2（有兜底） |

### 2.2 修复方案（方案 A：定义处显式导出，与 v60 52 项同款）

- **CITY_ACTIONS**：块尾追加 `/* /u2inj:winx-bare/ */ window.CITY_ACTIONS = CITY_ACTIONS;`
- **UI_STATE**：块尾追加 `window.UI_STATE = UI_STATE;`
- **pool**：`let pool=300;` 后追加 `window.pool = pool;`（全局 pool 唯一，函数内同名局部不受影响）
- **curNode**：script_00 引擎区加 `var curNode;`（原隐式全局 → 显式 var 声明，行为零变化；修复过程中曾因注释闭合后中文外露触发 SyntaxError，已修复注释结构）

引用处 **零改动**（裸引用优先解析全局词法绑定，回退 window 属性，无 TDZ）。

### 2.3 检查器配套升级

c_refhealth 专项分支新增 k4 规则：跨 script 裸引用 + 顶层 var 声明（挂 window，显式全局接口）→ 健康 PASS。

### 2.4 结果

专项跨 script 引用：**4 → 0**。FAIL 0。

## 三、验证链结果（elda ci 全绿）

```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=6025261B game_check=6025261B / chunked=3393546B index=3393546B）
[PASS] elda full 18 检查器（FAIL 0 / 专项 0 / 孤岛 120 全量 112 / 死链 0）
[PASS] 性能预算门 6 项（game ≤ 6050000B / chunked ≤ 3500000B / 节点 3744 ≥ 2618 / 死链 0 / 总耗时）
[PASS] 冒烟测试（建号→主线→结局可达，节点完整性通过）
[PASS] 浏览器回归 file://：分片版 index.html + 单文件版 game.html 双版加载成功，
       标题/正文/HUD 完整，console 0 错误（1280 视口）
```

## 四、改动清单

| 文件 | 改动 | 行号 |
|---|---|---|
| src\script_03.js | CITY_ACTIONS 块尾 window 导出 | ~4001 块尾 |
| src\script_03.js | pool 声明后 window 导出 | 4196 后 |
| src\script_02f.js | UI_STATE 块尾 window 导出 | ~629 块尾 |
| src\script_00.js | 新增 `var curNode;` 显式全局声明 | 281 |
| tools\eldacheck\checks\c_dead.py | 孤岛判定升级（6 类动态引用） | run() |
| tools\eldacheck\checks\c_refhealth.py | 专项新增 k4（顶层 var = 显式接口） | 专项分支 |
| game.html / game_check.html / game_chunked.html / index.html | 四路重新生成（字节一致） | — |

## 五、回滚

- 全部改动带幂等 marker（/u2inj:winx-bare/），重跑构建即覆盖
- 备份 backup\U2_20260909\（src_backup 全量）可直接恢复
- 检查器改动独立文件（c_dead.py / c_refhealth.py），备份内含原版

## 六、未决/后续

- 112 个真孤岛为"无入口内容"——后续批（U8 NPC 生态 / 内容工具）可为其补入口或做正式清理决策
- game.html 的 1,807 个「已移入 chunks」注释占位为 v62 设计（单文件版非全量），本批未动；如需单文件版全量需另立方案
- 临时脚本 _u2_*.py 已归档 backup\scripts_archive\tmp\
