# 地基修复 · GR 全量实施（F2 / F3 / R5）

> 批次：GR-1~GR-4（2026-09-11）
> 蓝图：`docs\地基体检报告_v94.md`（F1 已于前轮完成；本批做 F2 / F3 / R5）
> 依据口令：《群雄割据 地基修复全量实施（单文件全量化 + V35 清理 + 双检查器）》
> 基线：v94（节点 5,580 / 事件池 589 / saveVersion=48 / 四路 game=10,066,529B、chunked=7,337,737B）

---

## 一、GR-1 · 单文件版全量化（F2）

### 问题
- 根因：`_build_authority.py` 的 `build()` 只拼接 `src\script_00~18.js` + gap + `_collect_data_nodes()`（`src\data_nodes\dn_*.js`），**不含根目录 `chunks\*.js` 分片**。
- 后果：单文件版 `game.html` 的 `window.N` 仅 3,883 键；分片版 5,593 键（学院 academy_ 等 1,710 节点在分片里）。**单文件版缺全部分片节点**，玩家打开 game.html 玩不到学院/序章分片内容。

### 改动
| 文件 | 行号（改后） | 改动 |
|---|---|---|
| `_build_authority.py` | `build()` 内新增 `_collect_root_chunks()` | 扫描根目录 `chunks\*.js`（排除 NODE_MAP.js，按文件名序），以 CH 段标记 `/* /u1inj:chunks-root/ */` … `/* /u1inj:chunks-root:<文件名>/ */` … `/* /u1inj:chunks-root-end/ */` 追加进最后 script 块 |

### 连锁修复（CH 段三处共用标记）
| 文件 | 改动 |
|---|---|
| `tools\elda\chunks_impl.py` | 新增 `_strip_chunks_root()`；`merge_v62` 与 `build_chunks` 读取 game.html 时剥离 CH 段，防止分片版膨胀/重复 |
| `tools\eldacheck\eldacheck.py` | 新增 `read_game_checks()`（正则一次剥离 CH 段）；`main()` 全检查器循环改用，消除 V66 风格锁/节点分区/性能计时的重复统计误报 |

### 验证结果
- 单文件版 `window.N`：3,883 → **5,689**（academy=269，全量超集）
- 四路字节：game=game_check=**18,371,707B**；chunked=index=7,337,738B（分片回归正常）
- 预算：`elda budget --reason "GR-1 单文件全量化"` → game_html_bytes_max 10,120,739 → **18,421,707**
- elda ci 39 检查器全绿；smoke PASS

---

## 二、GR-2 · V35 控制台噪音清理（F3）

### 问题
- `src\script_00.js` 与 `src\script_04.js` 各有一份 `v35_arch_init()` 重复定义。
- `script_04.js` 中 battle/magic/faction 模块在 `v35_arch_init()` 调用**之前**注册并立即 `load('battle')`，其 `dependencies:['core']` 触发对未注册 core 的递归 load → 每次加载报 9 条 `[V35] Module not found: core`（实测 27 条含重复）。模块最终全部 `loaded=true`，无功能影响，但控制台噪音污染。

### 改动
| 文件 | 行号（改后） | 改动 |
|---|---|---|
| `src\script_00.js` | 删除重复 `v35_arch_init()` 定义（1,041 字符；保留 `V35_ModuleManager` 定义） | 全 src 仅剩 1 处定义 |
| `src\script_04.js` | battle 模块注册前注入首次 `v35_arch_init()` 调用 | core/ui/save 先注册 → battle/magic/faction 的 load 不再缺 core；DOMContentLoaded 机制保留（幂等，v35_initMagic/v35_initFaction 时序与现状一致） |

### 验证结果
- bu 实测：单文件版 + 分片版 console error **0**（V35 报错清零）；模块 6 个全部 loaded=true
- 四路字节：game=game_check=**18,370,663B**；chunked=index=7,336,694B（删冗余后体积略降，合法）
- elda ci 39 检查器全绿（16.3s）；smoke PASS

---

## 三、GR-3 · 双检查器 + 分片序章补齐（R5）

### 问题
- 分片版（game_chunked.html）缺 **96 个 origin_\* 序章节点**（v62_origin.js 历史 IIFE 分片未被引用）——**线上版（GitHub Pages = 分片版）建号链不完整**（GR-1 前即存在的缺陷）。
- ci 无发布文件行尾门、无两版节点覆盖门。

### 改动
| 文件 | 改动 |
|---|---|
| `tools\elda\chunks_impl.py` | `build_chunks` 引用列表追加 `chunks\v62_origin.js`（story_* 之后），分片版补齐序章全量 |
| `tools\eldacheck\checks\c_crlf.py`（新增） | 扫 5 个发布文件（game.html/game_check.html/game_built.html/game_chunked.html/index.html），检出 CRLF 即 FAIL（报每文件计数） |
| `tools\eldacheck\checks\c_nodecover.py`（新增） | 统计单文件版 game.html 与分片版（chunked 内联 + chunks\*.js）节点键数，要求单文件 ≥ 分片且差 ≤1%，超阈值 FAIL 报缺失量 |
| `tools\eldacheck\eldacheck.py` | 注册两检查器（**39 → 41 项**），不改变既有 39 项行为 |

### 验证结果
- bu 实测：单文件版 = 分片版 = **5,689** 节点（origin 161 全量、academy 269）——分片序章缺陷修复
- elda ci **41 检查器全绿**（CRLF行尾门 5 文件全 LF；节点覆盖门 单文件=分片=5,676 差 0）
- **FAIL 路径实测**：① game_built.html 尾部注入 CRLF → c_crlf FAIL（报 game_built.html 1 处）→ 还原 PASS；② 临时改名 v62_origin.js → c_nodecover FAIL（差 96 / 1.72% >1%）→ 还原 PASS
- 四路字节：game=game_check=18,370,663B；chunked=index=7,336,739B

---

## 四、GR-4 · 整合回归

### 验证链（全绿）
```
node --check（26 块）PASS
_build_authority.py build → Copy game_built.html → game.html  OK
elda chunks（43 文件 node --check 全 PASS，分片引用含 v62_origin.js）
elda sync 四路字节一致（game=game_check=18,370,663B / chunked=index=7,336,739B）
elda budget（GR-1 已更新，超限自动过）
elda ci 41 检查器全绿（16.75s）
smoke_test.py RESULT: PASS
bu 桌面实测：console error 0（两版）；单文件/分片节点 5,689 一致；v93_refreshAfterAct 存在；模块 6 全 loaded
```

### 扩容记录（扩了什么 / 为什么 / 如何验证）
| 扩充 | 为什么 | 如何验证 |
|---|---|---|
| 分片版补 v62_origin.js 引用 | 分片版缺 96 个序章节点，线上建号链不完整（历史缺陷，非 GR 引入） | bu 两版 N 键一致 5,689；verify_chunks miss=0 |
| CH 段剥离（chunks_impl/eldacheck 共用） | 单文件内嵌分片后，分片构建与 ci 统计会双重计入 | 分片版体积不膨胀（7.34MB）；ci 检查器无重复统计误报 |
| c_crlf / c_nodecover 双检查器 | 行尾漂移与两版节点漂移此前无门禁 | FAIL 路径实测（CRLF 注入 / 分片缺口均正确 FAIL 后还原） |

### 红线确认
- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：**零触碰**
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（本批全为构建层/引擎声明层改动，存档零改动）
- 节点只增不降（ci 节点 5,580 不变）；分片版/单文件版节点覆盖一致

---

## 五、后续建议
- 内容节奏恢复（R3）：budget 已随 GR-1 上调，可恢复超大型内容生产（新节点/事件按 elda-content-author 流水线）。
- 分片版体积余量：chunked 8,500,000 - 7,336,739 = 1.16MB；单文件版余量 18,421,707 - 18,370,663 = 51KB（单文件版接近预算上限，后续大批量内容将主要靠分片版承载；如需单文件版同步扩容，用 `elda budget --reason` 更新）。
