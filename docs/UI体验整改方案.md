# 群雄割据 · UI 体验整改方案（大型）

> 类型：技术改进方案（只读诊断 + 分阶段实施蓝图）｜日期：2026-09-09
> 依据：全量实测（浏览器 1280×960 复现、DOM 注入压力、函数级调用链）+ 源码证据（src 提取层 / gap_00 界面结构 / head CSS）
> 与主计划关系：本方案为阶段二 8 批主计划之外的 UI 专项，实施批次以「UI-1~UI-4」命名，验证链与主计划共用（elda full → node --check → 死链 0 → 浏览器回归）

---

## 一、现状诊断（实测证据）

### 1.1 修为 / 行囊 / 日志面板：右侧窄栏 + 小字号（用户核心抱怨）

**实测复现**（浏览器 1280×960，点击「🎒 行囊」后）：
- `#side` 容器几何：**x=950 → right=1280，宽 330px**（占屏 25.8%），y=178 → bottom=960（顶栏之下右侧全高）
- 面板内容字号：**h3=14px、.row=13px、.mini=12px**（正文为 16.5px，面板比正文小 25%~35%）
- 行囊内容：金币/道具/材料/典籍四行文字 + 游历足迹，全部 12-13px

**代码证据**：
| 位置 | 内容 |
|---|---|
| `head.html` `#side{width:330px;border-left:1px solid #a09070;...}` | 侧栏 330px 固定在右 |
| `head.html` `#panels .mini{font-size:12px}` / `.row{font-size:13px}` / `h3{font-size:14px}` | 面板字号体系偏小 |
| `src/gap_00.html` L892-899 `#main > #side > #panels > #pack/#realm/#log` | 面板嵌在右侧栏 |
| `src/script_03.js` L4159 `togglePanel()` / L4182 `renderPack()` | 打开逻辑：仅切换 `#panels.show` |

**影响**：面板在角落、信息密度低、字号小 → 玩家"看不清"，且与正文阅读区（42em 居中）割裂。

### 1.2 移动端 / 窄窗口：修为行囊点了没反应（"UI 不响应"根因之一）

**代码证据**：
- `src/gap_00.html` L563：`@media (max-width:768px){ ... #side{display:none} ... }` —— **≤768px 时侧栏整个隐藏**
- 但 `#topbar` 的 `btn-pack / btn-realm / btn-log` 按钮仍在（gap_00 L855-857）
- 点击 → `togglePanel("pack")` → `#panels` 加 `show` → **容器 `#side` 是 `display:none` → 面板不可见 → 玩家判定"点了没反应"**

**影响**：手机 / 窄窗口玩家**完全无法查看行囊、修炼、日志**，且无任何提示，表现为"UI 不响应"。

### 1.3 选项交互锁：点击后 5 秒全灰 + 无提示（"UI 不响应"根因之二）

**代码证据**（`src/script_13.js` V67 交互锁定）：
- L7-16 `v67_busySet()`：置 `__v67Busy=true` + 注册 **5 秒 watchdog**
- L23-43 `v67_uiFeedback(opt)`：点击后**所有 `.opt` 按钮 `disabled=true + opacity:0.4`**（仅选中项高亮）
- `src/script_03.js` L3331 `choose()` 入口：`if(window.__v67Busy){ return; }` —— **锁定期间任何选项点击直接丢弃**

**缺陷链**：
1. 玩家点击选项 → 全部按钮灰化（视觉上"死了"）→ 5 秒内连点全部无效且**无任何"处理中"提示**；
2. **watchdog 只清逻辑锁（`__v67Busy`），不清按钮 `disabled`** —— 若 writeNext 渲染异常（节点数据损坏等），按钮**永久灰化**；
3. 实测分页节点 / auto 跳转节点有 `v67_busyClear` 兜底，但普通节点渲染异常时无兜底。

**影响**：节点切换稍有延迟（分片加载、长文本）或异常时，玩家体验为"卡死、点了没反应"。

### 1.4 三套面板体系并存，体验割裂

| 体系 | 面板 | 载体 | 关闭方式 |
|---|---|---|---|
| 右侧栏 | 修为 / 行囊 / 日志 | `#side > #panels`（窄栏） | 再次点击 / ✕ 按钮 |
| v67 modal | 任务 / 强者 / 编年史 / 存档 / 设置 / 成就 | `#modal`（居中弹窗） | 返回游戏 / ESC / 遮罩 |
| v35 浮层 | 势力 / 魔法 | `#v35-*-panel`（fixed 居中） | 面板内关闭按钮 |

**实测**：势力面板 600×257px、魔法面板 640×709px，均为 fixed 居中——与 modal 视觉接近但交互不同（无 ESC、无遮罩关闭）。
**影响**：字号、边框、关闭方式、动画各不相同，玩家需要适应三套交互，误操作率高。

### 1.5 剧情正文无限累积（长期卡顿隐患）

**代码证据**：
- `writePar()` 向 `#story` 追加（`src/script_03.js`）；**正常流程无清空点**，仅 console 跳转命令（`src/script_00.js` L946）清空
- 实测：139KB DOM（约 1500 段）下点击响应 3ms、writeNext 9.9ms —— **当前规模不卡**
- 但长局（数十万字）DOM 达 1MB+ 后，滚动、重排、点击命中率将显著劣化，移动端尤甚

### 1.6 持续定时器与动画开销

- `src/script_18.js` `UI.startRotate()`：**12 秒轮询**刷新世界纪闻
- `src/script_18.js` `UI.statusBar()`：**3 秒 setInterval** 刷新状态行
- `v34` 粒子 / 天气 / 氛围动画（`head.html`）
- 影响：低端机 / 移动端持续 CPU 占用（当前 1280×960 桌面实测无感，但需预算化）

### 1.7 触控目标偏小（移动端）

- `gap_00.html` 移动端适配：`#topbar .nav .btn{padding:8px 4px;font-size:12px}`——部分按钮高度不足 44px 触控标准
- v68 主题 `btn-v68-mini{padding:3px 6px;font-size:11px}` —— 成就/魔法/AI 润色三按钮 11px，极难点中

### 1.8 面板打开失败静默（无错误反馈）

- `v35_openFactionPanel` / `v35_openMagicPanel` 等函数内部渲染逻辑异常时无 toast，表现为"点了没反应"
- 已实测：按钮绑定全部正常（inline + JS onclick 双绑定），排除绑定缺失；问题在于**失败无反馈**

### 排除项（已实测证伪）

- ❌ 全局按钮绑定缺失：12 个导航按钮全部有绑定，点击正常
- ❌ 渲染性能：139KB story DOM 下选项点击 3ms、writeNext 9.9ms
- ❌ alert/prompt 阻塞：源码无残留
- ❌ ChunkLoader 永久挂起：失败路径有重试 + 兜底回调

---

## 二、目标体验（验收口径）

1. **一套面板**：修为 / 行囊 / 日志 / 势力 / 魔法 / 任务 / 强者 / 编年史全部统一为同一弹窗体系（v67 modal），关闭方式一致（ESC / 遮罩 / 返回按钮）
2. **可读**：面板正文 ≥14px、行高 ≥1.7、信息分区 + 图标引导；任意窗口宽度（≥360px）面板不裁切、可滚动
3. **有反馈**：任何点击 100ms 内有视觉反馈；异步处理有"处理中"提示；失败有 toast
4. **不卡死**：交互锁定 ≤2s 自动恢复且恢复按钮；剧情 DOM 自动归档，正文区 DOM ≤500KB
5. **可验证**：elda full 全绿 + 节点内容零损失 + 旧档兼容 + 四路字节一致

---

## 三、改造清单（P0 / P1 / P2）

### P0 —— 本次必改（对应 1.1 / 1.2 / 1.3，直接解决用户抱怨）

#### P0-1 面板容器统一：修为/行囊/日志 改为 modal 弹窗
- **改动范围**：`src/script_03.js`（togglePanel 改造 + renderPack/renderRealm/renderLog 输出适配）；`src/gap_00.html`（`#side > #panels` 结构保留为 stats 容器，panels 退役或保留兼容）
- **做法**：`togglePanel(name)` 改为 `openModal(renderXxxPanel())`（复用 v67_ui 弹窗）；顶部导航按钮 onclick 不变；`renderPack/renderRealm/renderLog` 内容函数复用，输出适配 modal 宽度
- **风险**：低（纯展示层改造，不触判定公式）；`togglePanel("map")` 分支保留 v67_map
- **回滚**：backup\UI-1\ 全量备份 src + game.html；改回 togglePanel 旧实现
- **验证**：elda full → node --check → 浏览器点开四面板断言 modal 出现且内容完整

#### P0-2 面板字号与可读性提升
- **改动范围**：`head.html` CSS（`#panels .mini/.row/h3` 迁移到 modal 场景字号 ≥14px）；renderPack/renderRealm 内容加分区图标与留白
- **风险**：低（纯 CSS + 展示）
- **验证**：getComputedStyle 断言 ≥14px；对比度检查

#### P0-3 移动端面板可用（≤768px 不再隐藏）
- **改动范围**：`gap_00.html` 移除 `@media (max-width:768px){ #side{display:none} }` 或改为隐藏仅 stats 保留；面板走 modal 后天然全屏可用
- **风险**：低；需回归桌面端（#side 不再承担面板，stats 保留）
- **验证**：375px / 768px / 1280px 三档实测按钮 → 面板可见

#### P0-4 交互锁反馈与恢复
- **改动范围**：`src/script_13.js`（uiFeedback 增加"处理中…"占位提示；watchdog 触发时恢复按钮 disabled）；`src/script_03.js` choose/writeNext 增加 busy 期间的视觉状态
- **做法**：busySet 时在 #options 顶部插入 `<div class="v67-busy-tip">⏳ 处理中…</div>`（或 flashMsg 持久化）；watchdog 解锁时同步 `btns[i].disabled=false` 恢复
- **风险**：中（涉及交互主链 choose，需守住"判定公式/writeNext 语义不碰"红线——只加反馈，不改判定）
- **验证**：实测点击后出现提示、节点渲染后提示消失；模拟 writeNext 异常 → 5s 内按钮恢复可点

### P1 —— 体验收敛（对应 1.4 / 1.5 / 1.7 / 1.8）

#### P1-1 势力/魔法浮层收敛为统一弹窗样式
- **改动范围**：`src/script_04.js`（v35_openFactionPanel / v35_openMagicPanel 改走 openModal 或套用 modal 容器样式）；对应 CSS
- **风险**：中（v35 面板有独立交互，需保功能）
- **验证**：势力/魔法打开、切换 tab、关闭全流程回归

#### P1-2 剧情正文归档（DOM 上限控制）
- **改动范围**：`src/script_03.js`（writePar / v45 分页处增加自动归档：正文超阈值后旧段落折叠进 `<details>` 或移入隐藏容器，可回看）
- **做法**：阈值 500KB（或 400 段）；提供"↑ 回顾"按钮展开历史
- **风险**：中（影响渲染主链，需保住 writeNext 语义）；**不触碰判定公式**
- **验证**：注入 1MB DOM → 自动归档生效 → 滚动流畅 + 旧档回看可用

#### P1-3 触控目标与字号（移动端按钮）
- **改动范围**：`gap_00.html` 移动端 CSS（`.btn` min-height 44px、字号 ≥13px；btn-v68-mini 扩大热区）
- **风险**：低
- **验证**：375px 下按钮矩形 ≥44×44 或点击热区达标

#### P1-4 面板打开全局错误 toast
- **改动范围**：v35_open*/v34_open*/UI.openPanel 统一 try/catch → `flashMsg("面板打开失败")` + console 明细
- **风险**：低
- **验证**：人为触发异常 → toast 出现

### P2 —— 深度打磨（对应 1.6 / 无障碍）

#### P2-1 低性能模式（已有 simple-mode 扩展）
- **改动范围**：`head.html` v34 粒子/氛围 + `script_18.js` 轮询降频（3s→10s、12s→30s 或页面不可见时暂停）
- **验证**：低端机 / 移动端 CPU 占用下降

#### P2-2 键盘 / 无障碍
- 面板焦点管理（打开聚焦、关闭还原）、aria-label、快捷键提示条（M/B/T/L 已有，补齐 Q/G/C/F）
- **验证**：纯键盘可完成建号→选项→面板全流程

#### P2-3 面板内容增强
- 行囊分类（道具/材料/典籍/贵重）；修炼进度条（经验/条件可视化）；日志筛选（剧情/战斗/事件）
- **验证**：内容正确性对照 S 状态

---

## 四、实施计划（分 4 批，每批独立可交付）

### 批 UI-1：P0-1 + P0-2 + P0-3（面板容器 + 可读性 + 移动端）
1. 备份 `backup\UI-1_20260909\`（src 全量 + game.html + chunked + index）
2. togglePanel → modal 化；CSS 字号提升；移除移动端 #side 隐藏
3. 验证链：elda full → node --check → 死链 0 → 浏览器四面板实测（1280/768/375 三档）
4. 交付 `docs\ui_panel_v73.md`

### 批 UI-2：P0-4 + P1-1（锁反馈 + 浮层收敛）
1. 备份 → script_13/script_04 改造
2. 验证链同上 + 交互锁异常模拟回归

### 批 UI-3：P1-2 + P1-3 + P1-4（归档 + 触控 + 错误 toast）
1. 备份 → writePar 归档 / CSS 触控 / try-catch 统一
2. 验证链同上 + 1MB DOM 压力回归

### 批 UI-4：P2（性能模式 + 无障碍 + 内容增强）
1. 备份 → 降频 / 焦点管理 / 面板增强
2. 验证链 + 移动端全流程回归

---

## 五、验收标准（对照）

| # | 验收项 | 口径 |
|---|---|---|
| 1 | 面板可用性 | 1280 / 1024 / 768 / 390 四档窗口，修为行囊日志势力魔法任务强者编年史全部可开可关 |
| 2 | 可读性 | 面板正文 ≥14px、行高 ≥1.7；与正文区对比无裁切 |
| 3 | 响应反馈 | 点击 100ms 内视觉反馈；处理中有提示；失败有 toast |
| 4 | 防卡死 | 交互锁定 ≤5s 自动恢复（目标 ≤2s）；恢复后按钮可点 |
| 5 | DOM 控制 | 剧情正文 ≤500KB 自动归档；归档可回看 |
| 6 | 内容零损失 | 2618+ 节点内容零损失；elda full 全绿；旧存档兼容（saveVersion 不变） |
| 7 | 字节一致 | game=game_check、chunked=index 四路一致 |

## 六、红线与回滚

- **不触碰**：判定公式 / writeNext 语义 / choose 判定链 / 存档结构（沿用 v64 铁律）——P0-4 只加反馈不改判定
- **备份**：每批开工前 `backup\UI-XX_日期\` 全量（src + 四个 html + 脚本）
- **同步**：src 改动 → build → verify → sync 四路 → elda full
- **偏差即停**：任何验证链红灯立即停止报告，不回退重试绕行
