# 群雄割据 · 批 UI-3 交付记录（v74b 剧情归档 + 触控目标 + 面板错误保护）

> 日期：2026-09-09｜批次：UI-3（P1-2 剧情正文自动归档 / P1-3 触控目标与字号 / P1-4 面板打开全局错误 toast）
> 依据：《UI体验整改方案.md》§三 P1-2、P1-3、P1-4 + 用户口令（含扩充授权）
> 状态：✅ 已完成并验证

---

## 一、改动清单（文件 + 位置 + 差异摘要）

### 1. `src/script_04.js` — 剧情归档 + 面板保护

| 位置 | 改动 |
|---|---|
| `RenderBatch.flush()` | appendChild 后调用 `v74_archiveIfNeeded(el)`（渲染主链加一行，writeNext 语义零触碰） |
| 新增 `v74_archiveIfNeeded(el)` | **DOM 上限自动归档**：段落 >400 或 textContent >500,000 字符时，将最旧段落移入 story 顶部可折叠 `<details class="v74-archive">`（"↑ 回顾历史"），**保留最新 200 段可见**，其余可展开回看；已导出 `window.` |
| 新增面板保护 IIFE（`/v74ui:guard/`） | 对 `v34_openSettings / v34_openSavePanel / v34_openErrorLog / v34_openAchievements / v34_openMap / v35_openFactionPanel / v35_openMagicPanel` 及 `DebugPanel.openPanel` 统一 try/catch：异常 → `flashMsg("⚠ 面板打开失败，请查看控制台")` + `console.error` 明细 |

### 2. `src/gap_00.html` — V74 CSS

- `.v74-archive`：折叠历史样式（金色 summary、正文 40vh 内滚动、半透明）
- 移动端触控（≤768px 追加媒体查询）：
  - `.btn` → min-height **44px**（原 40px）
  - `input[type=text]` → min-height **44px**（原 40px）
  - `body.v68-theme #topbar .nav .btn-v68-mini` → padding 5px 8px、font-size 12px、min-height **36px**（原 3px 6px/11px/23px 高，热区 +56%）
  - `.v74-archive summary` → padding 10px 4px（移动端可点热区）

### 3. 备份

`backup\UI-3_20260909\`（src 全量 + 四 html）

---

## 二、扩充记录

| # | 扩充项 | 位置 | 为什么 | 如何验证 |
|---|---|---|---|---|
| 1 | 归档标签带段数 | summary | 玩家一眼知道有多少历史可看 | 实测「↑ 回顾历史（300 段）」 |
| 2 | 双阈值（段数 400 + 字符 500k） | v74_archiveIfNeeded | 长段节点也可能撑爆 DOM，字符阈值兜底 | 500 段 1,083,390 字符注入实测 |
| 3 | 保留最新 200 段可见 | 归档逻辑 | 近景剧情始终在眼前，只折叠远端历史 | 实测可见 children=201（200+归档框） |
| 4 | 7 个面板 + Debug 统一保护 | guard IIFE | 比方案列的单点 try/catch 覆盖面更大，杜绝白屏 | 人为抛错实测 toast 出现 |

---

## 三、验证链结果（全绿）

### 1. 静态
| 项 | 结果 |
|---|---|
| node --check ×19 | 全部 PASS |
| 幂等门（build verify） | PASS |
| 四路同步 | game=game_check=5,981,750 B；chunked=index=3,382,833 B 一致 |
| elda full（18 检查器） | 全部 PASS（9.0s） |
| 死链 | 3711 节点 0 死链 |
| 存档兼容 | saveVersion=48 不变 |

### 2. 浏览器实测（file://）
| 场景 | 结果 |
|---|---|
| 1MB+ DOM 压力（500 段 / 1,083,390 字符） | ✅ 自动归档 300 段、保留 200 可见、标签带段数 |
| 历史回看 | ✅ details 展开 300 段全部可读 |
| 触控（375 移动端） | ✅ .btn=44px、input=44px、顶栏 nav .btn=47px、mini 热区 36px（原 23px） |
| 错误 toast（人为抛错） | ✅ 「⚠ 面板打开失败，请查看控制台」出现（flashMsg .show 动画），modal 安全无白屏 |
| 分片版 index.html | ✅ v74 生效、归档触发（420 段→220 段入档）、标签正确 |

### 3. 说明
- 归档阈值按方案口径"500KB 或 400 段"取双条件；500,000 指 textContent 字符数（中文 1 字≈3 字节，即约 1.4MB 实际 DOM 文本，大于方案下限）。
- mini 顶栏按钮为图标级次按钮，热区 36px 为折中（主按钮/导航/选项全部 ≥44px），符合方案"≥44 或热区达标"验收。

---

## 四、遗留与后续

- **批 UI-4（P2）**：低性能模式（head.html 粒子 + script_18 轮询降频）、键盘/无障碍（焦点管理 + aria + 快捷键补齐 Q/G/C/F）、面板内容增强（行囊分类 / 修炼进度可视化 / 日志筛选）
- 原生 confirm 4 处（存档删除/覆盖）仍为白名单已知项，UI-4 评估是否纳入无障碍改造
- `#side` 侧栏：UI-4 一并评估彻底退役
