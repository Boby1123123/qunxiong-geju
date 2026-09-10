# P-N1/P-N2 并行叙事线程状态机 + 编织引用

> 批次：P-N1 + P-N2（六大方向升级 · 方向一 叙事结构）
> 日期：2026-09-10
> 基线：v92（saveVersion=48）；elda ci 38 检查器；节点 4,637；四路字节 game=game_check=8,455,111B / chunked=index=5,688,069B
> 对标：inkle/ink 的 threads（并行叙事线）与 weave（编织引用）

## 一、扩了什么

### P-N1 并行叙事线程状态机（引擎 + 数据）

- **新数据文件** `src\data_nodes\dn_threads.js`（1.2KB，CRLF）：
  `window.THREADS` 注册表 6 条叙事线程，每条含 `{name, desc, prefix[], entry}`：
  | 线程 | name | prefix（节点 id 前缀） | entry |
  |---|---|---|---|
  | origin | 序章 · 自由城 | origin_ / fc_ / prologue_ | fc_jiaohui_entry |
  | academy | 学院线 | acad_ / alumni_ / grad_ / branch_academy_ | branch_academy_join |
  | dark | 禁书区暗线 | acad_story_ / acad_secret_ | acad_story_vault |
  | frontier | 北境要塞线 | frontier_ / anchor_ / grad_army_ | frontier_entry |
  | war | 战争阵营线 | warphase_ / faction_ / warfront_ / war_after_ / war_epilogue_ | warphase_1 |
  | east | 东境 · 晨天线 | east_ / chen_ / court_ / messenger_ | east_gov |

- **引擎钩子**（`src\script_03.js`，共 3 处 + 兜底 1 处）：
  - `applyDefaults`（~:66）：`if(!s.threads) s.threads={};` —— 独立键空对象，旧档兼容
  - `window.v92_threadTick(node)`：writeNext 渲染时按节点 id 前缀（或显式 `node.thread`）登记所属线程到 `S.threads[tId]`：`{pos 最近节点, updatedDay 最近活跃日, seen 已读节点数}`；钩子挂在 `v91_arcAdvance` 之后（`/pn1inj:threadhook/`）
  - `window.v92_threadList()`：按最近活跃日倒序返回线程状态（供 UI 展示）
  - 章节卡"卷 · 线 · 章"：`sceneTitle` 内按节点前缀查 THREADS，把线程名拼入副标题（`/pn1inj:scenethread/`），未命中零变化
- **红线**：全部钩子只读 S 状态 / 只写独立键 S.threads；不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义；saveVersion=48 不变。

### P-N2 编织引用（weave，正文段落复用）

- **引擎函数** `window.v92_expandWeave(txt)`（与线程函数同块插入）：text 数组元素以 `§`（U+00A7）开头时，展开为被引用节点 id 的正文：
  - 递归展开深度 ≤3、seen 防环、引用缺失时原样输出 `（引用段落未找到：id）`
  - 被引用节点先走 `v91_resolveText`（兼容函数式 / 数组 / 变体三形态）
- **渲染钩子**：writeNext 内 `v91_sessCount` 之后（`/pn2inj:weavehook/`）对 `_txt` 展开
- **用法**：`text:["§fc_tavern", "然后是新的段落……"]` —— 节点数据层直接复用既有段落，零复制文本、零引擎改动
- **红线**：展开纯渲染层；不改节点文本源、不改判定、不触碰存档。

## 二、为什么

- 学习 ink 的 threads/weave：大型叙事不是单一线性链，而是多条叙事线并行推进（学院线 / 北境线 / 战争线 / 东境线……），玩家在任意时刻应该能感知"有哪些线在进行、各自推进到哪"——这正是超大型文游与小型分支小说的分水岭。
- § 编织引用解决"同一段标志性文本在多处出现"的复制膨胀问题（如回响、回忆杀、书信引用），文本只在权威节点存一份。

## 三、如何验证

- `node --check src\script_03.js` ✅ / `node --check src\data_nodes\dn_threads.js` ✅
- `_build_authority.py build` → Copy → `elda chunks` → `elda sync`：四路字节一致 ✅
- `elda ci`：38 检查器全绿（预算门因 +9.2KB 合法增长已用 `elda budget --reason` 更新 baseline.game_html 8,449,310 → 8,455,111）✅
- `smoke_test.py`：PASS（30 步推进 + 5 面板 + 存读档 + 结局）✅
- 章节卡线程名与线程登记：待 P-N3 的"叙事线"面板在浏览器实测。

## 四、改动清单

| 文件 | 位置 | 前后差异 |
|---|---|---|
| src\data_nodes\dn_threads.js | 新建 | +1205B，THREADS 6 线程注册表 |
| src\script_03.js | applyDefaults ~:66 | +1 行 threads 兜底 |
| src\script_03.js | 函数块（weatherLine 前） | +3 函数（v92_threadTick / v92_threadList / v92_expandWeave）约 9KB |
| src\script_03.js | writeNext sessCount 后 | +1 行 weave 展开钩子 |
| src\script_03.js | writeNext arcAdvance 后 | +1 行线程登记钩子 |
| src\script_03.js | sceneTitle | +线程名查找与副标题拼接 |
| gap_00.html（根目录旧遗留） | 557-572 / 853-855 | 删除 2 处 @media (max-width:768px) 移动端块（用户指令：不做移动端） |
| tools\eldacheck\checks\c_map.py | checks/docstring | 删除移动端适配检查项 3 行（用户指令） |
| docs\文游对标调研与超大型升级建议.md | 5 处 | 移动端条目标注废弃/删除（用户指令） |
| backup\snap_20260910_200040_PN1-PN2线程状态机编织引用.zip | — | 改动前快照 |

## 五、扩充记录

- **扩充**：P-N1 在原始计划（仅线程状态机）基础上补充了"章节卡卷·线·章"与线程注册表 6 线覆盖全部已建成叙事域。
- **为什么**：让并行叙事在标题层面即可感知，玩家不会迷失在单线推进中。
- **如何验证**：章节卡在 academy_/frontier_/warphase_ 节点出现时副标题含线程名；S.threads 在对应前缀节点推进后写入。
