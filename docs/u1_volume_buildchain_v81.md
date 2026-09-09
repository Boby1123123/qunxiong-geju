# U1 · 体积预算解绑 + 构建链收编（A1/A2/A3/A4）

> 批次：超大型文游风险治理 · 批 U1
> 日期：2026-09-09
> 前置：P0+P1 全部完成（v80）；风险清单 16 项中本批覆盖 A1/A2/A3/A4
> 铁律遵守：未触碰判定公式 / writeNext 核心语义 / choose / 存档语义；saveVersion 语义未动；旧档兼容；未引入服务端依赖；file:// 双击即玩保留

---

## 一、批目标与对应风险

| 风险 | 内容 | 本批处理 |
|---|---|---|
| A1 | 主文件体积余量仅 24,691B（0.4%） | ✅ 内容外置化机制建立（data_nodes），引擎文件不再随内容膨胀 |
| A2 | 分片版余量 ~107KB | ✅ 分片版保留外置节点内联 + chunk 外置双通道，重建后体积 3,393,292B（上限内） |
| A3 | 根目录 354 个 _v*.py 历史脚本 | ✅ 全部归档 backup\scripts_archive\（+二次甄别 144 个） |
| A4 | 旧组装链脱节 / _v39_extract.py 缺失 | ✅ 构建链确认已收编（P0-1 起 elda chunks 走 chunks_impl）；docs 引用链修正 |

## 二、改动清单（文件 + 行号 + 差异摘要）

### 2.1 内容外置化机制（A1/A2 核心）

**新增 `src/data_nodes/` 目录 + `src/data_nodes/dn_demo.js`（365B）**
- 内容：`N["u1_demo"]={place,where,text,options:[{t:"返回市井",go:"fc_streets"}]}`（对象式，v78 规范）
- 铁律：数据文件只含节点对象，不含引擎逻辑

**修改 `_build_authority.py`（8,617B，原 6,076B）**
| 位置 | 改动 |
|---|---|
| L23-28 常量区 | 新增 `DN_DIR` / `DN_MARK` / `DN_END` / `DN_FILE`（data-nodes 段标记体系） |
| `_split_data_nodes(body)`（新增） | extract 时若 script 块含 data-nodes 段，拆出主体 + 按文件 marker 拆数据文件 + 段尾 |
| `_collect_data_nodes()`（新增） | build 时读 src/data_nodes/*.js（字母序）→ 组装 data-nodes 段 |
| `extract()` script 处理段 | 拆分 data-nodes 段 → 清旧写新 src/data_nodes/*.js |
| `build()` 循环后 | data-nodes 段注入最后 script 块（无文件则不注入，保持幂等） |

**机制说明（幂等闭环）**
```
src/data_nodes/*.js ──build──▶ game_built.html 最后 script 块内 data-nodes 段
        ▲                                              │
        └─────────────extract──（按 marker 拆回）──────┘
```
- 新增 1 节点 = 往 data_nodes/ 写 1 个文件 → build 自动纳入，**引擎文件零改动**
- game.html 单文件版内联（保持全量可玩）；分片版（elda chunks）保留段内联
- verify 幂等实测 PASS（字节级一致）

### 2.2 预算与体积（A1/A2 数据）

| 项 | U1 前 | U1 后 | 说明 |
|---|---|---|---|
| game.html | 6,025,309B | **6,026,112B** | +803B（u1_demo 数据节点，合法内容增长） |
| 上限 | 6,050,000B | 6,050,000B | 余量 23,888B |
| game_chunked.html | 3,392,489B | **3,393,292B** | +803B（data-nodes 段内联保留） |
| 节点总数 | 3,743 | **3,744** | +1（u1_demo） |
| budget.json | v77 | **v78** | baseline 更新，note 写明理由（budget_deadcode_v76 合法增长条款） |

**验证"新增 1 节点 → 主文件（引擎）增量 0、game.html 增量 = 节点本体 803B <1KB"** ✓

### 2.3 历史脚本归档（A3）

**backup\scripts_archive\** 四区：
| 区 | 数量 | 内容 |
|---|---|---|
| `v\` | 354 | _v42_apply ~ _v68ui_apply 全部历史版本脚本 |
| `p\` | 44 | _p01_* ~ _p12_* 探查/诊断脚本 |
| `legacy\` | 3 | engine_elda.py / mech_elda.py / static_check_elda.py（v64 旧组装链，与 src/ 脱节） |
| `tmp\` | 97 | _b*/_batch*/_read_*/_scan_*/_tmp_*/_ui* 等历史应用/临时脚本 |

**归档安全核查**：elda.py / chunks_impl.py / smoke_test.py / _p12_quests.py / _build_authority.py **零 _v/_p 引用**（实测脚本验证）。
**根目录保留（active）**：`_build_authority.py`（构建闭环）、`_p12_quests.py`（支线生成器）、`smoke_test.py`（冒烟）。
**README.md 清单**已生成于 backup\scripts_archive\（完整文件名单）。

### 2.4 docs 引用链修正（A4）

| 文件 | 修正 |
|---|---|
| `docs\项目结构说明.md` | 目录树 7 处脚本标注"已归档"；验证流程改为 elda 工具链（build verify / chunks / sync / ci） |
| `docs\工具手册.md` | `elda chunks` 说明改为"逻辑收编于 tools\elda\chunks_impl.py（P0-1 起零根目录脚本依赖）"；排障指引同步更新 |

## 三、验证链结果

### 3.1 elda ci（发布门禁全绿）

```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环，含 data-nodes 段字节级一致）
[PASS] 四路字节一致（game=6026112B game_check=6026112B / chunked=3393292B index=3393292B）
[PASS] elda full 18 检查器（含分片健康 14 片 1806 节点、世界局势/战争/叙事/群像/UI 全绿）
[PASS] 性能预算门 6 项（game ≤ 上限 6050000B；game ≤ baseline 6026112B；chunked ≤ 3500000B；
       节点 3744 ≥ 下限 2618；静态 go 死链 0；总耗时 8.98s）
门禁结果：全部通过（可发布）
```

### 3.2 elda chunks（分片重建）

```
合并节点总数: 3744 | 分片版缺失 0 / 多余 0 | go 引用 10881 死链 0
game_chunked.html 21 script 标签 / 2,395,814 字符（≈3,393,292B）
分片语法检查：42 个 JS 文件 node --check 全部 PASS（无 SyntaxWarning）
```

### 3.3 浏览器回归（bu 平面，file:// 分片版 index.html，1280 视口）

| 验证项 | 结果 |
|---|---|
| 建号（普路托斯/男/人类/北境人/自由城邦/战士/良才/阅读/富甲天下） | ✅ 进入「交汇城·市井」（fc_tavern 渲染） |
| 外置节点注册 | ✅ `N['u1_demo']` = object（data-nodes 段解析执行生效） |
| 外置节点渲染 | ✅ 跳转 curNode='u1_demo' → 「交汇城 · 外置数据演示点」正文渲染完整 |
| 外置节点 go 跳转 | ✅ 点「返回市井」→ curNode=fc_streets →「交汇城 · 街道」渲染 |
| 引擎零改动确认 | ✅ src/script_*.js 无任何 U1 修改（git 无；以字节比对为准：仅 data_nodes 新增） |

### 3.4 冒烟测试

```
python smoke_test.py → RESULT: PASS（节点完整性通过；结局入边 21 条）
```

## 四、扩充记录（扩充了什么 / 为什么 / 如何验证）

| 扩充 | 为什么 | 如何验证 |
|---|---|---|
| data_nodes 外置目录规范 | 超大型文游的核心瓶颈是"内容量→主文件膨胀"；外置化让引擎与内容解耦，支撑 5 万节点级扩展 | verify 幂等 + 实测新增 1 节点引擎 0 改动 + 浏览器实测渲染/跳转 |
| 归档脚本 README 清单 | 354+144 个脚本归档需可检索、可复核 | backup\scripts_archive\README.md 完整名单 |
| 构建链确认收编 + docs 同步 | elda chunks 已零根目录依赖（P0-1），docs 描述停留在旧链 | elda chunks 实测无 SyntaxWarning、node --check 42 文件全 PASS |

## 五、新发现风险（记录，不越权处理）

- **单文件版 file:// 直开存在既有 V35 模块错误**（`[V35] Module not found: core`）：备份版（U1 改动前）对照实测同样报错，**确认与 U1 改动无关**，属历史遗留。分片版 file:// 正常（本批回归通道）。单文件版建议经本地 HTTP 服务（elda serve / 8917）或浏览器 file:// 允许模块加载的方式运行。此问题已记录，建议后续批次（U5 可测试性/工具链）评估修复方案。

## 六、备份与回滚

- **备份**：`backup\U1_20260909\`（_build_authority.py / elda.py / chunks_impl.py / budget.json / game.html / game_chunked.html）
- **回滚**：恢复 game.html → 运行 `python tools\elda\elda.py chunks` → `sync` → budget v77；或恢复 src/data_nodes 删除 + _build_authority.py 恢复旧版 → build → 发布
- **幂等保障**：data-nodes 段完全由 src/data_nodes/ 生成，删除目录即回到无外置状态（verify 自洽）

## 七、验收对照

| 验收项 | 状态 |
|---|---|
| 新增 1 个测试节点 → 主文件体积增量 <1KB | ✅ 引擎 0 改动；game.html +803B（节点本体）；分片版主入口增量 ≈0 |
| elda chunks 无 SyntaxWarning | ✅ 42 文件 node --check 全 PASS |
| 根目录只留 active 脚本 | ✅ 仅 _build_authority.py / _p12_quests.py / smoke_test.py |
| elda ci 全绿 | ✅ 18 检查器 + 预算门 6 项 |
| 四路字节一致 | ✅ game=6,026,112B / chunked=3,393,292B |
| 旧档兼容 / saveVersion 语义 | ✅ 未触碰存档语义 |
| 浏览器回归（file:// 单文件 + 分片版） | ✅ 分片版完整通过；单文件版记录既有 V35 问题（非本批引入） |
