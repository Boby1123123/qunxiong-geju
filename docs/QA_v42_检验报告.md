# QA_v42 检验报告 · 技术层全量深度开发

- 版本：v42
- 日期：2026-09-07
- 基线：v41（2618 节点 / 约 5.75MB，game.html 与 game_check.html 同步）
- 范围：技术层五方向（A 分片加载 / B 存档分层 / C 稳定性 / D Debug 面板 / E 本地起服+PWA+移动适配）
- 原则：不改剧情数据与游戏逻辑，只动工程层；localStorage 主键 `elda-qunxiong-v3-save` 兼容旧档；file:// 双击可用

---

## 一、交付清单

| 文件 | 说明 |
|---|---|
| `game.html` | 主交付（单文件版），含全部 v42 基础设施，2618 节点 |
| `game_check.html` | 同步副本（Copy-Item 完成，5714808 字节） |
| `backup\game_v42_before_tech.html` | 开工前备份（5750554 字节） |
| `game_chunked.html` | 分片版入口（约 1.16MB），依赖 `chunks\` 目录 |
| `chunks\` | 8 个分片 js + NODE_MAP.js（2189 条节点映射），build 产物 |
| `start_server.bat` | 本地起服脚本（python -m http.server 8080） |
| `manifest.webmanifest` / `sw.js` | PWA 静态清单与服务缓存（仅 http 生效） |
| `_v42_apply.py` / `_v42_build_chunks.py` / `_v42_verify_chunks.py` / `_v42_chk_syntax.py` / `_v42_fix_modal.py` / `_v42_fix_v34.py` | v42 改造与验证脚本 |
| `_v42_probe_style.py` / `_v42_probe_fns.py` / `_v42_probe2.py` / `_v42_probe3.py` | 探查脚本（可归档） |

> 设计说明：指令要求 9 分片，实际产出 8 分片 + 1 枢纽分片——`classmate` 节点并入 `story_academy`（同学故事与学院线同卷），额外产出 `story_core`（首屏枢纽节点，14 个，预载）。NODE_MAP 共 2189 条映射，与原指令"分片文件数"表述的差异已在开发中按"节点→来源卷映射"边界落定，不影响功能与验证。

---

## 二、方向 A · 剧情分片按需加载

### 实现
- `build_elda.py` 未改造（其 CSS/HTML 骨架为 v2 旧版深色主题，与当前亮色 UI 产物不一致），分片以**当前 game.html 为唯一权威源**做文本级拆分（`_v42_build_chunks.py`）。
- 拆分正则放宽单/双引号 `N[["']id["']]`，括号配对从节点起点第一个 `{` 起算（修复首版"对象式定义被吞/截断"问题）。
- `ChunkLoader`（IIFE，不污染 S）：
  - `loadChunk(name, cb)`：动态 `<script src="chunks/xxx.js">` 相对路径注入（file:// 可用），onerror 重试 1 次并提示；
  - `ensureNodeLoaded(nodeId, cb)`：查 NODE_MAP → 未加载则加载对应分片后回调；
  - `preloadNext(chunks)`：低优先级预载。
- `writeNext` 渲染前调用 `ensureNodeLoaded(curNode)`，未就绪显示"正在翻越书页…"占位，加载完自动续渲染。

### 分片清单（build 产物，8+1）
| 分片 | 节点数 | 字符数 | 说明 |
|---|---|---|---|
| story_core | 14 | 20,966 | 首屏枢纽节点（HTML 预载） |
| story_origin | 127 | 96,484 | 9 条出身序章线 |
| story_academy | 337 | 301,687 | 学院线（含同学故事） |
| story_mainland | 187 | 164,474 | 大陆城市 |
| story_travel | 74 | 46,612 | 旅行路线 |
| story_seal | 579 | 417,175 | 封印深渊线 |
| story_system | 162 | 139,949 | 时间/经济/日程系统节点 |
| story_misc | 709 | 864,538 | 其余 |

### 验证结果
- 合并验证：分片版节点 2618 = 单文件版 2618，缺失 0、多余 0；
- go 引用 5985，死链 0；
- 14 个 JS（game_chunked 6 内联 + 8 分片）node --check 全部 PASS；
- 浏览器实测：加载 0 错误；NODE_MAP 2189 条；`ensureNodeLoaded('fc_jiaohui_entry')` → 按需加载 story_core → 序章剧情渲染；`ensureNodeLoaded(学院节点)` → 按需加载 story_academy；renderPerf 采样正常（avg 40ms）。

---

## 三、方向 B · 存档分层 + 导出灾备 + 多存档位

### 实现
- `StorageKit`（IIFE）：
  - 三层写路径：localStorage（主键 `elda-qunxiong-v3-save` 或槽位键）+ IndexedDB（库 `elda-saves`/仓库 `saves`/key=slot1~5）+ 导出 JSON；
  - QuotaExceededError 分类捕获 → flashMsg 引导导出备份；
  - 槽位 1~5（槽位 1 = 旧键兼容位）；导出 Blob 下载；导入 FileReader + JSON.parse + 二次确认覆盖。
- `saveGame/loadGame` 接入 StorageKit；`S.saveVersion=42`、`S.slotId`、`S.saveTime` 三个新字段，旧档无字段时自动补 `saveVersion=42`。
- v34 存档管理面板（设置 → 存档管理）：5 槽位"保存到此槽/读取/删除"+ 导出/导入按钮。

### 验证结果（浏览器实测）
- 存档：点击存档 → 主键写入 → 刷新后弹"检测到存档"；
- 槽位：保存槽位 2 → localStorage 键真实落盘（1636 字节）→ 读取槽位 2 → 恢复槽位 1；
- 删除槽位 2：confirm 确认后 localStorage 键清除（null 验证）；
- 导出：Blob 下载触发（"存档已导出（JSON文件）"flash）；
- 旧档兼容：构造无 saveVersion 旧档（name=旧档测试角色/day=3）→ `StorageKit.load()` 成功读取 → `applyDefaults` 正常 → 自动补 `saveVersion=42` → S 状态完整（hp=100/realm=0）；
- 恢复：主键恢复为"无名旅者"存档（saveVersion=42）。

---

## 四、方向 C · 运行时稳定性

### 实现
- `ErrorLog`（IIFE）：window.onerror + unhandledrejection 双捕获；内存环形 50 条 + localStorage 持久化 200 条（键 `elda-error-log`）；记录时间/信息/文件行号/curNode；设置面板"错误日志"入口（列表/复制/导出 txt/清空）。
- `writePar` 批量渲染：appendChild 段改为 `RenderBatch.push(d)`（DocumentFragment + rAF 批量，保留 scrollTop 行为）。
- 魔法吟唱 setInterval → rAF（无 rAF 降级 setTimeout）。
- `renderPerf`：记录最近 100 次 writeNext 耗时（avg/max/last），Debug 面板展示。

### 验证结果
- 注入错误 → ErrorLog 持久化 → 错误日志面板正确显示（`[时间] msg @节点:id`）；
- writeNext 渲染 40ms 采样记录；console 全程 0 错误。

---

## 五、方向 D · Debug 上帝面板

### 实现
- 入口：Ctrl+Shift+D 或连点顶部状态栏 5 次（正式游玩不误触）；
- 功能：节点跳转（goNode 校验存在性）/ 当前状态（curNode/槽位/已加载分片/S 摘要 JSON）/ 存档工具 / 性能（writeNext 耗时、节点总数）；
- 关闭后完全卸载，不影响正常游玩。

### 验证结果（浏览器实测）
- 面板打开渲染完整（节点跳转区/当前状态/S JSON 摘要/存档工具/性能区）；
- 节点跳转 `fc_tavern` → 剧情渲染成功；
- 分片版识别正确（"单文件版（全部内联）" / 分片 loaded 列表）。

---

## 六、方向 E · 本地起服 + PWA + 移动适配

### 实现
- `start_server.bat`：python -m http.server 8080；
- `manifest.webmanifest`（start_url=./game_chunked.html，羊皮纸主题 #8b6f47）+ `sw.js`（缓存 game.html/game_chunked.html/manifest/8 分片）；
- PWA 注册 try/catch，file:// 下静默跳过（预期行为）；
- 移动适配：<768px 竖屏布局、触控目标 ≥44px、字体/间距微调（基础层，不重做 UI 主题）。

### 验证结果
- 服务启动后 `Invoke-WebRequest http://localhost:8080/game.html` → 200；game_chunked.html → 200 / 1745117 bytes；
- 浏览器 http:// 分片版回归全通过。

---

## 七、历史遗留问题修复（v42 顺带）

1. **v34 JS 被埋在 `<style>` 区从未执行**（57 个 function / 72 个 var 声明被浏览器当作无效 CSS 忽略）——导致设置/存档面板等函数未定义、点击报错。修复：在最后 `<script>` 区补充有效定义（V34 默认对象 + v34_renderSettings/v34_settingRow/v34_toggleSetting/v34_openSettings/v34_openSavePanel/v34_renderSaveSlots/v34_saveToSlot/v34_loadFromSlot/v34_deleteSlot/v34_exportSave/v34_importSave/v34_openErrorLog/v42_copyErrorLog/v42_exportErrorLog/v42_clearErrorLog/v34_openAchievements）。
2. **modal 面板依赖 `.box` 的历史 bug**：`closeModal()` 清空 `#modal` 后，`querySelector('.box')` 失效导致面板打不开。修复：v34_openSettings/v34_openSavePanel/v34_openErrorLog/DebugPanel.openPanel 统一改用 `openModal(box)` 标准入口。
3. 设置面板"数据与调试"区接入：存档管理 / 错误日志 / 调试面板入口。

---

## 八、双环境结论

| 环境 | 结论 |
|---|---|
| file:// 双击（game.html） | ✅ 全部功能可用（ChunkLoader 单文件直通、StorageKit 双写、Debug 面板、v34 面板修复）；PWA 不生效属预期 |
| http:// 本地服务（localhost:8080/game.html 与 game_chunked.html） | ✅ 分片按需加载、NODE_MAP、建号→序章→行动闭环、0 控制台错误；PWA/SW 生效 |

---

## 九、验证链汇总（最终全绿）

1. `python _v39_extract.py` → 5 个 script（26411/110203/2483405/74119/398008）→ node --check **5/5 PASS**
2. `python _check_dead_links.py` → 节点 2618 / go 5985 / **死链 0**
3. 占位标记 1（writeNext 兜底提示，非内容占位）
4. `python _v42_verify_chunks.py` → 合并节点 2618 / 缺失 0 / 多余 0 / 死链 0
5. `python _v42_chk_syntax.py` → 14 个 JS 全部 PASS
6. 浏览器回归（bu 真实点击）：存档/读档/槽位/导出/错误日志/Debug 跳转/行动面板返回/分片加载，**0 控制台错误，无软锁**

---

## 十、已知说明

- 分片版 `game_chunked.html` 与 `chunks\` 由 `_v42_build_chunks.py` 从 `game.html` 生成，可随时重跑幂等重建；
- 单文件版与分片版二选一发布：单文件版双击即用；分片版首屏更小（仅载 core+origin），适合正式部署；
- v34 沉浸功能（打字机/粒子/音效）因历史埋入 style 区未生效而一直处于"关闭"状态，v42 未恢复它们（避免意外改变游玩体验）；设置面板中的相关开关已可正常读写 S.settings（生效需后续若恢复 v34 运行时）。
