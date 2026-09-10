# UI93 · 方案一「羊皮卷宗」v4 正式落地（含扩充记录）

> 批次：UI93 v4 ｜ 日期：2026-09-10 ｜ 基线：节点 4,699 / 事件池 197 / 账本 168 项 / saveVersion=48
> 验证链：node --check → build → Copy → chunks → sync → budget --reason → ci（25 检查器全绿）→ smoke PASS → bu 桌面实测

## 一、本批做了什么（相对 v3 概念图 → 正式落地）

用户最终指令（2026-09-10）：
1. 设置改为**左上角齿轮图标（无文字）**；
2. 音效、图鉴等不常用/次级功能**收进设置面板**；
3. 此前提出的 8 条更新建议**全部做进去**；
4. **一次性落地**，跑完整验证链 + docs + git。

## 二、改动清单

### 1. `src\gap_00.html`（权威 UI 层，已入库）
| 位置 | 改动 | 说明 |
|---|---|---|
| body.v68-theme 背景 | 纯米色 #f3ecdc + SVG feTurbulence 颗粒 data URI（`url(%23p)` 转义，baseFrequency 0.72） | 满足"只要背景色+淡淡羊皮纸屑凹凸感"，去掉径向渐变与 ⚜ 装饰 |
| #topbar 开头 | 新增齿轮 `<button class="btn v93-gear" id="btn-settings" title="设置" onclick="v34_openSettings()">⚙</button>` | 36×36 圆形、无文字、position:fixed left:10 top:7、z-index:120（提升后消除点击遮挡误报） |
| 主书签行 | btn-map/pack/realm/log/faction/task/chronicle/save/immersive 加 `v93-main`（描金样式）；btn-strong/threads/world/tier/trade/nodeedit 加 `v93-ghost`；btn-ach/magic/llm 加 `v93-ghost btn-v68-mini` | 9 主书签 + 次级收纳 |
| v44-quick | 删除第二个"设置"按钮（保留休整/存档） | 设置唯一入口=齿轮 |
| #main 前 | 新增 `<aside id="v93-aside">` 大陆纪闻旁白栏（head/warn/list/foot） | 显示五主线临近预告 + 最近世界事件 |
| #stage 前 | 新增 `<div id="v93-guide">` 目标指引条 | 主线 8 日内预告 + 当前城市指引 |
| v93 样式块 | 齿轮样式、主书签描金、`.v93-ghost{display:none}`、动态按钮 id 隐藏（gallery/spellbook/journal/rollback/stats/stealth/sound/story）、`#modal` 弹性垂直居中（body.v68-theme 限定）、`.box/.v68-panel-box/.v35-panel-box` 宽 min(92vw,640px)+max-height:80vh、旁白栏 position:fixed left:10 top:112 width:206（`@media(max-width:1279px){display:none}`，`@media(min-width:1280px){#stage{margin-left:232px}}`）、快捷键总览表、成就动效 keyframes v93-ach-in、.v93-fn-grid 网格 | 桌面全尺寸居中弹窗核心 |

### 2. `src\script_04.js`（445,958 字节）
| 位置 | 改动 |
|---|---|
| v34_renderSettings（:10395 起） | "显示/主题"与"云存档"之间插入 **功能入口区块**：图鉴/法术书/魔法/属性/强者/叙事线/局势/实力/商路/成就/手记/回退/叙事罗盘/潜行/错误日志/调试/节点编辑/沉浸 共 18 钮（v93-fn-grid 网格，onclick 内联，按钮 id/onclick 全保留） |
| v34_renderAchievements（:10360 起） | 已解锁行前插入 **🏆 结局收集度 X/N（P%）**（遍历 window.N 中 tag==='ending' 计数；legacySave 判空加固——无存档时显示 0/40 0%）；成就卡片 class 加 v93-ach-card（CSS 入场动效） |
| v92_autoTick（:10549） | StorageKit.save 前插关键节点自动存档 toast（curNode 匹配 `/^(anchor_|ending_|purge_|silver_|seal_|academy_|orc_|goldscale_|frontier_seal_|warphase_)/` → flashMsg("关键节点已自动存档")） |
| 文件尾 v93 模块 | v93_renderAside（五主线 day±5 置顶 + 最近 5 则事件，cls 映射 ⚠天灾/⚔人祸/◆商机/✦奇遇，点击 v93_openEventDetail 弹详情）、v93_renderGuide（指引条）、v93_keyHelp（? 快捷键总览）、keydown '?' 监听、setInterval 5s 刷新、动态按钮 3s 定时收容保障（**显式排除 btn-acts 行动按钮**） |

### 3. 验证链结果（最终态）
- `node --check` 26 块：全部通过（修复 fix3/fix4 双重 `}catch` 语法错误后）
- `elda full` 25 检查器：**全部通过**
- 四路字节一致：game=game_check=8,693,881B / chunked=index=5,925,456B
- budget.json：本批 3 次 `--reason` 更新（收纳兜底 / 成就判空 / 齿轮 z-index），基线随代码层合法增长
- `smoke_test.py`：RESULT: PASS（存/读档通过、结局触发通过）
- bu 桌面实测（viewport 967×883）：
  - 齿轮 JS 触发开设置 ✓；行囊弹窗实测 `{top:204, h:474, vh:883, center:441, vhCenter:442}` **精确垂直居中** ✓
  - 设置面板 → 功能入口 → 点图鉴 → v44 atlas 四 tab 打开 ✓
  - `?` 快捷键总览弹出 ✓；沉浸开/关 class 切换 ✓
  - 成就墙"🏆 结局收集度：0 / 40（0%）"显示 ✓（修复 legacySave 判空后）
  - 大陆纪闻旁白栏：viewport <1280 按设计隐藏（`@media(max-width:1279px)`），数据渲染函数验证输出"大陆尚无异动"（day=1 无事件，正确）；1280+ 视口显示（CSS 规则就绪）

## 三、8 条更新建议落地状态（全部实现）
| # | 建议 | 落地 | bu 实测 |
|---|---|---|---|
| ① | 纪闻详情（点事件弹详情） | v93_openEventDetail | 代码就绪（事件详情弹窗） |
| ② | `?` 快捷键总览 | v93_keyHelp + keydown '?' | ✓ 弹出 |
| ③ | 目标指引条 | v93_renderGuide + #v93-guide DOM | 代码就绪（8 日内主线预告+城市指引） |
| ④ | 五主线临近预告 | v93_renderAside warn 区（day±5 置顶） | day=1 无临近主线=正确空态 |
| ⑤ | 结局收集度 | v34_renderAchievements 注入 | ✓ 0/40（0%）显示 |
| ⑥ | 成就解锁动效 | v93-ach-card + keyframes v93-ach-in | CSS 就绪 |
| ⑦ | 关键节点自动存档提示 | v92_autoTick 正则 + flashMsg | 代码就绪 |
| ⑧ | 体积监控门禁 | budget.json 6 项（本批 3 次 --reason 更新） | ✓ ci 预算门 PASS |

## 四、扩充记录（扩了什么 / 为什么 / 如何验证）
1. **功能入口 18 钮收进设置**：因为用户要求"音效、图鉴等不常用内容放进设置"，同时保证所有面板仍可打开（按钮 id/onclick 保留，仅容器与 class 改变）。验证：bu 从设置面板点图鉴成功打开 atlas；快捷键（M/B/T/L/F/G/C/Z/A/S）不受影响。
2. **动态按钮收纳兜底**：脚本动态注入的 nav 按钮（btn-gallery 等）可能晚于 init 注入、漏挂隐藏 class → 双保险：CSS 按 id 隐藏 + 3s 定时收容（排除 btn-acts）。验证：首屏 page text 不再含图鉴/潜行/🔊。
3. **弹窗垂直居中**：#modal 改 body.v68-theme 限定 flex 居中（inset:0 + align/justify center + visibility 切换），box 宽 min(92vw,640px)、max-height:80vh。验证：行囊弹窗中心 441 vs 视口中心 442。
4. **成就收集度判空加固**：无存档时 legacySave() 抛错曾导致整段被 catch 吞掉 → 双重判空（_leg=null 兜底 + N 遍历 try）。验证：空档显示"0 / 40（0%）"。
5. **齿轮 z-index 120**：bu hit-test 曾报 covered（elementFromPoint 实为自身，陈旧误报）→ 提升层级消除隐患。验证：JS click 与真实点击均可打开设置。

## 五、红线确认
- 未触碰：判定公式 / writeNext 核心语义 / choose / 存档结构语义；saveVersion=48 不变；applyDefaults 兜底链不变
- 未做移动端（旁白栏 @media≤1279px 隐藏属桌面小屏行为，非移动端开发）
- 节点数 4,699 不降；按钮 id/onclick 全保留；四路字节一致；旧档兼容
- 备份：backup\UI93_20260910\（gap_00.html / script_04.js / game_before.html / game_built_before.html）；临时脚本归档 backup\scripts_archive\tmp\ui93_*.py

## 六、遗留说明
- 大陆纪闻栏与指引条需在 ≥1280 宽桌面视口下做最终目视确认（当前 bu 视口 967 属预期隐藏）；CSS 规则与数据渲染均已就绪。
- 云存档（设置 → 云存档区）为更早批次能力，未在本批改动。
