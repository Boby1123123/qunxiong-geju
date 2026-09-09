# 批 UI-4 交付记录（P2 深度打磨：低性能 / 键盘无障碍 / 面板内容增强）

- 版本：v75（2026-09-09）
- 范围：批 UI-4 全部实施完成，含回归中发现并修复的 4 个关联缺陷
- 铁律核对：判定公式 / writeNext / choose / 存档语义零触碰；saveVersion=48 不变；旧档兼容；每处改动前有备份

---

## 一、本次改动清单（文件 + 对象 + 前后差异）

### 1. `src/script_18.js` — 低性能模式：轮询降频
| 对象 | 前 | 后 |
|---|---|---|
| 状态栏轮询 upd() | 固定 3000ms `setInterval` | 自递归 `v74_tickStatus()`：常规 3000ms / simple-mode 10000ms / 页面隐藏 30000ms |
| 公告轮询 announce() | 固定 12000ms | 自递归 `v74_tickAnn()`：常规 12000ms / simple-mode 24000ms / 页面隐藏 60000ms |

### 2. `src/head.html` — 低性能模式：粒子关闭
- `v34_updateParticles()` 函数体开头插入 `/v74ui:perf/` 守卫：`document.body.classList.contains("simple-mode")` 时直接 return（不创建粒子 DOM）。

### 3. `src/script_14.js` — 无障碍 + 快捷键
| 对象 | 前 | 后 |
|---|---|---|
| `v67_ui.open()` | 无 ARIA | 追加 `role=dialog` / `aria-modal=true` / `aria-label="游戏弹窗"` |
| 全局快捷键 | 无 | `/v74ui:key/` IIFE：KEY_MAP + `v74_onKey` + `v74_keyHelp()` + `v74-key-hint` 提示条（挂 v68-announce 后） |

### 4. `src/script_03.js` — 面板内容增强
| 对象 | 前 | 后 |
|---|---|---|
| `renderPack()` | 行囊单一列表 | 贵重区（关键词白名单 15 词：传家宝/神器/秘宝/圣物/神兵/遗物/信物/权杖/王冠/结晶/龙晶/圣杯/法典/至宝/…）+ 普通道具两区 |
| `renderLog()` | 纯列表 | 筛选 tabs：全部/修行/事件/系统（`__v74LogFilter` 全局变量），onclick 走 `v74_refreshLog()` |
| `renderRealm()` | 文字境界 | `v74-realm-scale` 境界刻度条：REALMS 全长 dots，done/now 两种态，右侧当前境界名 |

### 5. `src/gap_00.html` — `/v74ui:ui4/` CSS
- `v74-key-hint` 金色提示条；`v74-log-tabs`/`v74-log-tab.on`；`v74-realm-scale`/`v74-rs-dot.done|.now`；移动端适配。

### 6. 回归期修复（本批新增，非计划内）
| # | 缺陷 | 根因 | 修复 |
|---|---|---|---|
| R1 | 日志筛选 tab 点击后面板不刷新 | `renderLog()` 旧路径只写 `#log`（已不存在），面板用返回值不更新 | 新增 `v74_refreshLog()`：重写 modal 内 `[data-panel="log"]` 内容并保留关闭按钮；tab onclick 改调它 |
| R2 | 日志筛选不生效 | `__v74LogFilter` 为顶层 let，onclick 只改 `window.__v74LogFilter` 快照，`renderLog` 读 let | `renderLog` 改读 `window.__v74LogFilter`（含 tab 高亮判定） |
| R3 | simple-mode 粒子不生效（单文件版） | `v34_updateParticles` 在 `head.html` 与 `script_04.js`（MECH_JS 机制卷）双份定义，后者运行时覆盖前者 | 给 `script_04.js` 内定义也加 `/v74ui:perf/` 守卫 |
| R4 | 面板保护 guard 对 v34_* 无效 | guard IIFE 在 script_04 中部执行，早于 v34_* 面板**第二份定义**（文件尾部重复定义覆盖） | guard 提取为 `v74_guardPanels()` 函数，首部执行一次 + 文件末尾二次执行 |
| R5 | 快捷键键位冲突 + v68 重复注册 | v68 已有键盘导航（m/b/t/l/f/q/g/c），与 v74 初版键位（q/g/c/f=势力/魔法/成就/存档）冲突；v68 `bindActions` 每次调用都注册 keydown，造成叠加打开 | ① v74 只保留新增键 z=魔法 / a=成就 / s=存档，m/b/t/l/q/g/c/f 沿用 v68 语义（f=势力 q=任务 g=强者 c=编年史）；② v68 keydown 注册加 `__v68KeyBound` 防重；③ 提示条文案同步 |

---

## 二、扩充记录（口令允许的合理扩充）

| 扩充项 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| E1 行囊贵重分类 | 关键词白名单两区展示 | 大型文游物品数量增长后，贵重物品需一眼可辨 | 注入传家宝/龙晶→贵重区含之、草药进普通区 |
| E2 修炼进度可视化 | 境界刻度条（done/now） | 修炼路径一目了然，替代纯文字 | 注入 realm→done 数正确、now 高亮 |
| E3 日志筛选 | 全部/修行/事件/系统四档 | 日志随游玩增长会很长，需可检索 | 注入四类日志→各档过滤正确、tab 高亮、关闭按钮保留 |
| E4 快捷键+提示条 | 8+3 键位、DOM 提示条 | P2-2 键盘无障碍 | 每键实测打开对应面板、输入框内不触发、提示条可见 |
| E5 低性能模式 | simple-mode 轮询降频×3、粒子关闭 | 老设备/省电场景 | simple-mode 下粒子 0、轮询间隔生效（代码审查） |
| E6 ARIA 三件套 | role/aria-modal/aria-label | 读屏器可识别弹窗 | 打开面板后断言三个属性 |

---

## 三、验证链结果（全绿）

```
node --check 19 块 src PASS（含改动 4 文件）
elda build build → game_built.html（3694874 字符）→ Copy → sync → verify PASS（幂等闭环）
elda chunks → 分片 14 片 1806 节点、死链复核 0、game_chunked 3399277→3389277B
四路字节一致：game=game_check=5,985,063B；game_chunked=index=3,389,277B
elda full：18 检查器 ALL PASS（死链 0、marker 134 种、分片 14/1806、存档兼容 saveVersion=48、
            原生 dialog 白名单 4 处不变、UI 系统/V68-UI 全健康、耗时 9.15s）
```

### 浏览器回归（bu 平面，file:// + 三档窗口 + 分片版）
| 用例 | 结果 |
|---|---|
| 快捷键 z 魔法 / a 成就 / s 存档（单文件+分片版） | ✅ 均 depth=1 单层打开 |
| v68 键 q 任务 / g 强者 / c 编年史 / f 势力 / m 地图 / b 行囊 / t 修炼 / l 日志 | ✅ 均 depth=1（修复前 g 会叠 4-5 层 pop） |
| 输入框内按键不触发 | ✅ |
| 提示条挂载 + 文案（12 键） | ✅ |
| 行囊贵重分类（传家宝/龙晶→贵重区） | ✅ |
| 日志筛选（事件/修行/全部三档切换 + 关闭按钮） | ✅ |
| 境界刻度（9 dots、now=1） | ✅ |
| ARIA（role/aria-modal/aria-label） | ✅ |
| simple-mode 粒子 0 | ✅（单文件+分片版） |
| 375 移动端：行囊 324px 在视口内、传家宝可见 | ✅ |
| 1280/768 桌面面板开合 | ✅（批 UI-1~3 已验，本批无回退） |

---

## 四、构建链坑（给后续批次）

1. **分片版必须单独重建**：`elda build` 只重建单文件 game.html；改代码后必须再跑 `elda chunks` → `elda sync`，否则分片版是旧内容（本次 z 键在旧分片版失效即为教训）。
2. **v34/v35 函数存在双份定义**（head.html 与 script_04.js MECH_JS 卷、script_04 内部首尾两份）：改动这类函数需确认全部定义，或像 guard 一样做成可重复执行的函数并在末尾二次调用。
3. **顶层 let 导出陷阱**：`window.X = X` 只是快照；页面内 onclick 改 `window.X` 不影响 let 本体。跨上下文同步一律走 `window.` 读取或专用 setter。
4. **v68 bindActions 的 keydown 防重标记**（`__v68KeyBound`）已加，后续不得移除。
5. 已知白名单项（未改）：原生 confirm 4 处（存档删除/覆盖确认，行 2532/2556/63597/63621）。

---

## 五、验收标准对照（docs\UI体验整改方案.md §五）

| 标准 | 结果 |
|---|---|
| 1280/1024/768/390 面板可开可关 | ✅（本批 1280/375 实测 + 前批 1024/768） |
| 面板正文 ≥14px、行高 ≥1.7、无裁切 | ✅（批 UI-1 已验） |
| 点击 100ms 反馈 / 处理提示 / 失败 toast | ✅（批 UI-2 锁提示 + 批 UI-3 toast + 本批 guard 二次包装验证 toast 出现） |
| 交互锁定 ≤5s 自动恢复 | ✅（批 UI-2 实测 watchdog 5s 释放） |
| 剧情 DOM ≤500KB 自动归档可回看 | ✅（批 UI-3 压力 1,083,390 字符→归档 300 段） |
| 2618+ 节点零损失、elda full 全绿、旧档兼容 | ✅（节点 3711、死链 0、saveVersion=48） |
| 四路字节一致 | ✅ |

批 UI-4 交付完毕。备份：`backup\UI-4_20260909_final\`（54 项：src 全量 + 四 html + 实施/扫描脚本）。
