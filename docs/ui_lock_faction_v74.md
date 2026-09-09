# 群雄割据 · 批 UI-2 交付记录（v74 交互锁反馈 + 势力/魔法浮层收敛）

> 日期：2026-09-09｜批次：UI-2（P0-4 交互锁反馈与自动恢复 / P1-1 势力·魔法浮层收敛）
> 依据：《UI体验整改方案.md》§三 P0-4、P1-1 + 用户口令（含扩充授权）
> 状态：✅ 已完成并验证

---

## 一、改动清单（文件 + 位置 + 差异摘要）

### 1. `src/script_13.js` — V67 交互锁反馈与恢复（P0-4）

| 函数 | 改动 |
|---|---|
| `v67_busySet()` | 置锁时在 `#options` 顶部插入「⏳ 正在处理…」提示（`.v67-busy-tip`）；watchdog（5s）触发时**同时恢复按钮灰化**（原只清逻辑锁，按钮保持 disabled 的问题已修） |
| `v67_busyClear()` | 解锁同时清除提示（防分页/auto 路径 tip 残留） |
| `v67_showTip()` / `v67_clearTip()` / `v67_unlockUI()`（新增） | 提示显隐 + 恢复全部 `.opt` 按钮 disabled/透明度/光标；全部导出 `window.` |
| 导出区 | 新增三个函数导出 |

### 2. `src/script_03.js` — choose 丢弃反馈（P0-4）

- `choose()` 入口 busy 检查：原静默 `return` → `flashMsg("⏳ 处理中，请稍候…")` 后 return
- **红线确认**：仅加反馈，未改动任何判定/效果/时间成本逻辑

### 3. `src/script_04.js` — 势力/魔法浮层收敛（P1-1）

| 函数 | 改动 |
|---|---|
| `v35_openFactionPanel()` | body 下 fixed 浮层 → **统一 v67 modal**（box.v35-panel-box 内嵌 `#v35-faction-panel`，加 `.active` 保持可见） |
| `v35_closeFactionPanel()` | 移除 active → `closeModal()` |
| `v35_openMagicPanel()` | 同上（`#v35-magic-panel`） |
| `v35_closeMagicPanel()` | `closeModal()` |

渲染函数 `v35_renderFactionPanel / v35_renderMagicPanel` **零改动**（tab 切换、学派切换照常工作）。

### 4. `src/gap_00.html` — V74 CSS

- `.v67-busy-tip`：米黄底虚线框提示 + 脉冲动画（`v74-pulse`）
- `#modal .v35-panel-box`：透明容器（宽 min(92vw,760px)，居中 modal 内保留原深蓝视觉）、max-height 84vh 可滚动
- `#modal .v35-panel-box .faction-panel/.magic-panel`：`position:static; transform:none`（去 fixed 居中，交给 modal 体系）
- 移动端媒体查询：94vw / 86vh

### 5. 备份

`backup\UI-2_20260909\`（44 文件：src 全量 + 四 html + NODE_MAP.js）

---

## 二、扩充记录

| # | 扩充项 | 位置 | 为什么 | 如何验证 |
|---|---|---|---|---|
| 1 | 处理中提示条（脉冲动画） | v67_busySet | 原锁定时玩家无任何视觉反馈，误判死机 | 实测 busySet 后 tip 出现且文本正确 |
| 2 | busy 期间点击选项 toast | choose | 消除静默丢弃（连点有回应） | 源码审查 + busy 路径实测 |
| 3 | watchdog 恢复按钮 | unlockUI | 渲染异常时按钮永久灰化 → 5s 兜底恢复 | 实测解锁后 disabled=false、透明度还原 |
| 4 | 势力/魔法面板移动端适配 | v35-panel-box CSS | 原 fixed 浮层 min-width 600px 在 375 屏溢出 | 实测 375 下 317/310px 在视口内 |

---

## 三、验证链结果（全绿）

### 1. 静态
| 项 | 结果 |
|---|---|
| node --check ×19 | 全部 PASS |
| 幂等门（build verify） | PASS |
| 四路同步 | game=game_check=5,978,526 B；chunked=index=3,379,609 B 一致 |
| elda full（18 检查器） | 全部 PASS（9.7s） |
| 死链 | 3711 节点 0 死链 |
| 存档兼容 | saveVersion=48 不变 |

### 2. 浏览器实测（file://）
| 场景 | 结果 |
|---|---|
| busySet → tip 显示 | ✅ 「⏳ 正在处理…」出现 |
| busyClear → tip 清除 | ✅ |
| unlockUI（watchdog 等价） | ✅ 按钮 disabled=false、opacity 还原、tip 清除 |
| 真实 5s watchdog | ✅ 锁自动释放 + tip 自动清除 |
| 势力面板 | ✅ modal 内可见 692×236、tabs=3、tab 切换 active、关闭清空 |
| 魔法面板 | ✅ modal 内可见 692×618、tabs=7、学派切换、关闭清空 |
| 375 移动端 | ✅ 势力 317px / 魔法 310px 均在视口内 |
| 分片版 index.html | ✅ v74 生效、魔法/势力可见、锁 tip 正常 |

### 3. 实施中发现并修复的两个 bug（非本批引入但被本批暴露）
1. **faction/magic 面板默认 `display:none`**：modal 化时未带 `.active` 类 → 面板 DOM 存在但不可见；补 active 后修复（实测可见性回归通过）。
2. **busyClear 不清 tip**：分页/auto 节点路径可能残留提示；补 `v67_clearTip()` 修复。

---

## 四、遗留与后续

- **P1-2（剧情 DOM 自动归档）**：批 UI-3
- **P1-3（触控目标）**：批 UI-3
- **P1-4（面板全局错误 toast）**：批 UI-3
- `#side` 侧栏：批 UI-3 评估彻底退役（面板已全部迁出，仅剩旧 #stats）
- 存档路径：批 UI-3 一并回归（删除/覆盖确认仍为原生 confirm，批 4 未覆盖的 2 处 v34 面板确认——列入 UI-3 评估）
