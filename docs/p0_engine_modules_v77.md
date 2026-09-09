# 群雄割据 · 批 P0-1 引擎模块化实施记录（v77）

> 口令：《群雄割据 P0+P1 深度实施》批 P0-1（引擎模块化 + 构建链收编）
> 日期：2026-09-09 ｜ 项目根目录：`D:\1pao tuan\群雄割据`
> 状态：✅ 完成（elda ci 全绿、四路一致、三档浏览器回归通过）

---

## 一、目标与范围

- **P0-1a 引擎模块化**：拆分 `src\script_02.js`（2.4MB 巨型文件，世界叙事/战斗/结局/成就/周目/坐骑/数百节点混装）为 8 个独立模块文件，每模块 <1MB、职责可辨识，拼接零损失。
- **P0-1b 构建链收编**：`_v62_merge.py` / `_v42_build_chunks.py` / `_v42_verify_chunks.py` / `_v42_chk_syntax.py` 逻辑并入 `tools\elda\elda.py`（经 `tools\elda\chunks_impl.py`），`elda chunks` 不再依赖根目录历史脚本，消除 SyntaxWarning。

**红线遵守**：未触碰判定公式 / writeNext / choose / 存档语义；saveVersion=48 不变；旧档兼容（elda full 存档兼容仿真 PASS）；备份带版本命名 `backup\P0-1_20260909\`。

---

## 二、改动清单（文件 + 行号 + 差异摘要）

| 文件 | 位置 | 前后差异摘要 |
|---|---|---|
| `src\script_02.js` | 全文（原 1 个文件） | 拆分为 `script_02.js` + `script_02a.js`~`script_02g.js` 共 **8 段**；切点经 JS 平衡扫描器（`_p01_balance.py`）吸附到"栈空 + code 态"位置；每段头部加 `/*v76mod*/` 标记（除首段）；拼接还原与备份原文件字节级一致（零损失）；8 段全部 node --check PASS，每段 <1MB |
| `src\script_02*.js` 切点 | 字符偏移 | 281322 / 676974 / 1075471 / 1274128 / 1841190 / 1897169 / 2023302；段字节 560113 / 832603 / 730138 / 312104 / 905298 / 126404 / 185756 / 650464 —— 全部 <1MB，最大段 02d=905KB（v52~v57~W64 引擎区） |
| `_build_authority.py` | extract / build | 支持 `/*v76mod*/` 变体：extract 按标记拆回主文件 + `script_%02d[a-z].js` 变体（写回变体时补回标记，往返零丢失）；build 按字母序拼入同一 `<script>`；verify 幂等 PASS |
| `tools\elda\elda.py` | cmd_chunks（原调 4 个根目录脚本） | 收编为调用 `tools\elda\chunks_impl.py` 四函数（merge_v62 / build_chunks / verify_chunks / chk_syntax）；临时合并视图生成后自动清理 |
| `tools\elda\elda.py` | cmd_doctor 检查项 | 原检查 `_v42_build_chunks.py` 等 3 个根目录脚本 → 改为检查 `tools\elda\chunks_impl.py`（收编后归档导致原路径缺失） |
| `tools\elda\chunks_impl.py` | 新建（10,947B） | 收编 4 个分片脚本逻辑：合并视图（内联 1806 片节点）、分片构建（8 片 + NODE_MAP.js + game_chunked.html）、合并验证（节点/死链/占位/script 结构）、语法检查（node --check 全部内联 script + chunks）；UTF-8 无 SyntaxWarning |
| `backup\P0-1_20260909\archived_scripts\` | 归档 4 个分支脚本 | `_v62_merge.py`(2712B) / `_v42_build_chunks.py`(7507B) / `_v42_verify_chunks.py`(2202B) / `_v42_chk_syntax.py`(1265B) 移入备份（保留审计，不删除） |
| `game.html` / `game_check.html` / `game_chunked.html` / `index.html` | 全部 | 发布含 7 个 `/*v76mod*/` 标记的新版；四路字节一致（game=5981141B、chunked=3386574B） |
| `budget.json` | baseline | game_html_bytes 5981064→5981141（+77B v76mod 标记）、chunked 3386495→3386574（+79B）；note 注明结构性合法增长 |

---

## 三、验证链结果

### 3.1 `elda ci` 门禁（最终：全部通过，5s）

```
[PASS] src 语法 node --check（26 块）          ← 19 主块 + 7 变体，新变体被 ci 识别
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=5981141B game_check=5981141B / chunked=3386574B index=3386574B）
[PASS] elda full 18 检查器
```

elda full 18 检查器要点（全部 PASS）：
- 节点 = **3711**（≥ 下限 2618，内容零损失红线）｜ 静态 go 死链 = **0**
- 分片健康：片=14、节点=1806、死链复核=0
- 性能预算门 6 项 PASS：game.html ≤ 上限 6,000,000B 且 ≤ baseline；chunked ≤ 3,500,000B；节点 3711 ≥ 2618；死链 0 ≤ 0；总耗时 8.78s ≤ 20s
- 存档兼容仿真 PASS（saveVersion=48、ensureDefaults 链 OK、兜底字段全齐）
- V68-UI / UI 系统 / 世界局势 / 战争战斗 / 叙事连续性 / 群像记忆（16 档案）/ 设定深度 全部健康

### 3.2 `elda chunks` 收编后重建（全链成功）

```
game_v62_full.html 已生成（内联 1806 片节点，5124447 字节）
提取 N 定义: 3236 → 8 个分片（story_misc 1616 / story_academy 352 / story_seal 622 /
  story_mainland 229 / story_system 182 / story_origin 147 / story_travel 74 / story_core 14）
NODE_MAP.js: 3236 条映射；game_chunked.html: 2391435 字符
合并节点总数: 3711；分片版缺失 0 / 多余 0；go 死链 0；占位标记 1（白名单）
检查 42 个 JS 文件 — 全部 node --check PASS
临时合并视图已清理
```

### 3.3 浏览器回归（bu 平面实测）

| 档位 | 结果 |
|---|---|
| 1280（file:// game.html 单文件版） | 加载正常、console 0 错误；主界面 14 功能按钮 + HUD 完整；confirm 已为 DOM Promise 弹窗（批4 产物）；建号全流程（种族/亚种/出身/职业/天赋/爱好/理想/属性/开始旅程）点击响应正常进入游戏；行囊面板居中完整（金币/贵重/道具/材料/典籍分类 + 游历足迹 + 关闭按钮）；日志面板居中（分类标签 + 记录 + 关闭）；意外验证"面板打开失败"toast（批 UI-4 产物） |
| 768（iframe 定宽 768px） | 响应式生效：功能按钮自动换两行；HUD/弹窗正常；无裁切溢出 |
| 375（iframe 定宽 375px） | 响应式生效：信息行压缩、按钮紧凑排列；无横向溢出；核心功能可见 |
| 分片版（http://127.0.0.1:8917/index.html） | 加载正常、console 0 错误；主界面完整渲染 |

---

## 四、扩充记录（与基线方案的差异及理由）

| 扩充项 | 为什么 | 如何验证 |
|---|---|---|
| `/*v76mod*/` 标记（7 处，+77B） | 单文件 <script> 内无法用文件边界区分模块，标记作为 extract/build 的变体切分锚点；是模块化在单文件产物上的结构印记 | verify 幂等 PASS（往返零丢失）；node --check 26 块 PASS |
| 收编载体选择 `chunks_impl.py`（而非直接改写 elda.py 内嵌） | elda.py 是 GBK 历史文件且其余命令不相关，独立实现文件保持收编逻辑可单测、可回滚；elda.py 仅替换 cmd_chunks/cmd_doctor 两个函数体 | elda chunks 全链成功；doctor 存在性检查通过 |
| `budget.json` baseline 更新（+77/+79B） | v76mod 标记为结构性合法增长，非膨胀；上限（6MB/3.5MB）未触及 | ci 性能预算门 6 项 PASS |
| 归档而非删除 4 个分支脚本 | 保留审计与回滚能力（铁律：只移不删） | 归档目录 4 文件齐全；elda 无对根目录脚本的运行时依赖 |

---

## 五、风险与回滚

- **回滚**：`backup\P0-1_20260909\` 含 src 全量（拆分段前的 script_02.js 原文件）+ game/game_check/game_chunked/index.html + _build_authority.py + elda.py 原版；如需回滚，覆盖回对应文件即可，分片重建走原链（归档脚本也在备份内）。
- **已知注意**：elda.py 此前曾被错误以 GBK 方式改写（UnicodeEncodeError 清空文件），已从备份恢复并改用 UTF-8 正确读写（elda.py 实为 UTF-8 编码，顶部 `# -*- coding: utf-8 -*-`）。
- **最大切点偏差**：目标切点 1562314 处无栈空点（v52 引擎大 IIFE 从 1274128 跨至 1841190），自动吸附至 1841190（偏差 278876）——02d 段承载 v52~v57~W64 引擎区，905KB，为后续进一步细分的候选（P0-2 或后续批可再拆）。

---

## 六、验收对照（口令 §验收标准）

| 验收项 | 结果 |
|---|---|
| script_02.js 拆分后每个模块 <1MB、职责单一 | ✅ 8 段全部 <1MB（最大 905KB）；段主题可辨识（02a 大型剧情注入 / 02c 战斗 / 02d 引擎+世界 / 02f 系统 UI / 02g 结局节点等） |
| elda ci 全绿 | ✅ 26 块语法 + 幂等 + 四路一致 + 18 检查器 |
| 游戏功能零回归 | ✅ 三档 + 分片版浏览器回归通过，console 0 错误 |
| 节点 3711 零损失、死链 0 | ✅ elda full PASS |
| 四路字节一致 | ✅ 5981141 / 5981141 / 3386574 / 3386574 |
| 旧档兼容、saveVersion=48 不变 | ✅ 存档兼容仿真 PASS；读档确认弹窗正常（测试存档可检测） |
| 性能预算门 6 项 PASS | ✅ |

**遗留（不阻塞）**：批 P0-2 节点格式统一（1385 函数式→对象式）待开工；02d 段 905KB 可在后续再细分。
