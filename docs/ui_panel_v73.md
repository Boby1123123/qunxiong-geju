# 群雄割据 · 批 UI-1 交付记录（v73 面板容器统一）

> 日期：2026-09-09｜批次：UI-1（P0-1 面板容器统一 / P0-2 字号可读性 / P0-3 移动端可用）
> 依据：《UI体验整改方案.md》§三 P0-1~P0-3 + 用户口令（含扩充授权）
> 状态：✅ 已完成并验证

---

## 一、改动清单（文件 + 行号 + 差异摘要）

### 1. `src/script_03.js` — togglePanel modal 化（P0-1）

**原实现**（v30 侧栏方案）：
- `togglePanel(name)`：`#panels` 切 `show` 类 + 注入 panel-close-bar，面板显示在右侧 330px 侧栏内

**新实现**：
- `togglePanel(name)`：修为/行囊/日志**统一为 v67 modal 居中弹窗**
  - `map` 分支保留（走 `v67_map.open()`）
  - 面板内容由 `renderPack()/renderRealm()/renderLog()` 返回 HTML，装入 `<div class="box v68-panel-box" data-panel=name>`
  - 打开/关闭语义：modal 中已有同面板 → `closeModal()`；否则打开（支持 pack↔realm↔log 直接切换）
  - footer 自带「关 闭」按钮；ESC/遮罩/返回游戏关闭路径全部兼容（基于 modal 内容检测，不依赖易失的全局变量）
  - 全程 try/catch：异常时 `flashMsg("面板打开失败")` + console 明细（不再静默）

### 2. `src/script_03.js` — 三面板内容函数改造（P0-2 可读性 + 扩充）

| 函数 | 改动 |
|---|---|
| `renderPack()` | 改为返回 HTML（兼容写回 `$("pack")`）；**扩充**：道具/材料/典籍三分区 + 数量徽章 `.p-sec/.cnt`、金币高亮 `.money` |
| `renderRealm()` | 改为返回 HTML（兼容写回）；**扩充**：修为进度条 `.p-bar/.p-fill`（当前 xp/下境需求/百分比）、标题「⚡ 修炼」 |
| `renderLog()` | 改为返回 HTML（兼容写回）；**扩充**：标题「📜 冒险日志」+ 记录条数提示 |

### 3. `src/gap_00.html` — V73 面板 CSS（P0-2）

追加 `#modal .v68-panel-box` 规则（带 `#modal` 前缀以压过 `#modal .box{width:94%}`）：
- 宽度 `min(92vw,560px)` + `min-width` + `flex:0 1 auto`（**修复 flex 收缩到 154px 的 bug**）
- 字号：h3=16px、row=14.5px、mini=13.5px、行高 1.7（**≥14px 验收达标**，mini 13.5 为次要信息）
- 分区徽章/进度条/金币样式
- 移动端 `@media (max-width:768px)`：94vw、86vh

### 4. `src/script_04.js` — 附加修复（既有 bug，非本批引入）

`DebugPanel.init()` 内两处裸调 `toggle()`（Ctrl+Shift+D 快捷键 + 顶栏 5 连击彩蛋）→ `DebugPanel.toggle()`
- **原 bug 影响**：彩蛋触发即 `ReferenceError: toggle is not defined`，console 报错污染 + 调试面板打不开——是"UI 不响应"感知的来源之一

### 5. 备份

`backup\UI-1_20260909\`（43 文件：src 全量 + 四 html）— 开工前快照

---

## 二、扩充记录（用户授权范围内）

| # | 扩充项 | 位置 | 为什么 | 如何验证 |
|---|---|---|---|---|
| 1 | 行囊三分区（道具/材料/典籍）+ 数量徽章 | renderPack | 原单行混排难读；分区+徽章一眼看清存量 | 实测 3 个 .p-sec + 3 个 .cnt |
| 2 | 修为进度条（xp/需求/百分比） | renderRealm | 原仅文字条件列表，无成长可视反馈 | 实测 .p-bar/.p-fill 存在；新档 0% |
| 3 | 日志标题 + 条数提示 | renderLog | 明确面板身份与信息量 | 实测标题与条数文本 |
| 4 | 面板关闭按钮（footer「关 闭」） | togglePanel | 统一 modal 交互语义（与 v67 其他面板一致） | 实测 footer 按钮点击关闭 |
| 5 | 面板打开失败 toast | togglePanel | 消灭静默失败 | 源码 try/catch 审查 |

---

## 三、验证链结果（全绿）

### 1. 静态验证
| 项 | 结果 |
|---|---|
| node --check ×19 | 全部 PASS |
| elda build build → verify（幂等门） | PASS（game_built == game.html 字节级） |
| elda build sync 四路 | game=game_check=5,976,193 B；chunked=index=3,377,219 B 一致 |
| elda full（18 检查器） | 全部 PASS（9.3s） |
| 死链 | go引用=3686 节点=3711 死链=0 |
| 存档兼容 | saveVersion=48 不变；存档仿真 PASS |
| 内容零损失 | 节点全集 3711 = 单文件+分片，0 缺失 0 多余 |

### 2. 浏览器回归（file:// 实测）
| 档位 | 结果 |
|---|---|
| 1280×960 桌面 | 行囊/修为/日志打开 ✅ 宽 515px（修复前 143px）✅ 字号 h3=16/row=14.5/mini=13.5 ✅ 分区徽章 3 组 ✅ 开关闭环 ✅ footer 关闭 ✅ 修为进度条 ✅ |
| 768 边界 | match768=true ✅ 面板 664px 在视口内 ✅ |
| 375 移动端 | 侧栏隐藏（stats 退役）✅ 顶栏按钮 63×47 触控达标 ✅ 三面板 324px 在视口内 ✅ 开关闭环 ✅ |
| 分片版 index.html | v73 生效 ✅ 三面板开→关全通 ✅（分片链 elda chunks 重建后） |

### 3. 附加验证
- DebugPanel 彩蛋：修复后 `DebugPanel.toggle` 存在、不再 ReferenceError
- 多面板切换：pack→realm→log 直接切换正常（openDepth 栈语义正确）

---

## 四、实施中的两个发现与处理

1. **flex 收缩 bug**：`#modal .box{width:94%}`（ID 特异性）压过 `.v68-panel-box{width:min(92vw,560px)}`，且 v31-modal-container 作为 flex 子项被收缩到内容最小宽 154px → 面板只有 143px 宽。
   处理：CSS 全部加 `#modal` 前缀 + `min-width` + `flex:0 1 auto` → 修复后 515px（桌面）/324px（375）。

2. **构建链顺序坑**（文档化，避免后续批次重踩）：
   - `elda build`（无参）与 `elda build verify` 会 **extract(game.html) 覆盖 src**——**有未发布改动时严禁先跑 verify**；
   - 正确发布顺序：改 src → `elda build build`（生成 game_built）→ **人工 `Copy-Item game_built.html game.html`** → `elda build sync` → `elda build verify`（幂等门）→ `elda full`；
   - 分片版需额外：`elda chunks`（重建 game_chunked）→ `elda sync`。

---

## 五、遗留与后续

- **P0-4（交互锁反馈）**：批 UI-2 处理（v67 锁提示 + watchdog 恢复按钮）
- **P1-1（势力/魔法浮层收敛）**：批 UI-2
- **P1-2（剧情 DOM 归档）**：批 UI-3
- `#side` 侧栏现状：面板已迁出，仅剩 `#stats` 旧状态栏（桌面保留，移动端隐藏由 v68-status 替代）——批 UI-2 评估是否彻底退役
- 分片版 `index.html` 打开后 `#modal` 初始无建号面板时 openDepth 归零验证通过；**新档玩家需先完成建号**，建号 modal 与面板弹窗为叠加栈（v67 设计，正常）
