# QA_v68 检验报告 · V68-UI 西幻手抄圣典界面重构

- 版本：V68.1（在 V67 UI 重构全量完成后叠加）
- 权威源：`game.html`（6,029,547 字节）
- 备份：`backup\game_v68_before.html`（MD5 20A0D2D07301819DC88542A3380CE1B7，与注入前一致）
- 主题：方案一·手抄圣典（羊皮纸/哥特/烫金，西幻，已锁定不再改）
- 日期：2026-09-08

## 一、本轮注入清单（11 项，幂等 marker 精确锚点，全部成功）

| # | 注入项 | marker | 说明 |
|---|--------|--------|------|
| 1 | 西幻设计令牌 + 组件 CSS | /v68ui:frame/ | 羊皮纸三层令牌（--c-parch/--c-ink/--c-gold/--c-blood/--c-moss）、哥特⚜角饰、topbar/nav/旁白栏/状态行/选项卡片/弹窗/角色面板全部西幻化 |
| 2 | 顶部双排导航重构 | /v68ui:nav/ | 三组：①地图/行囊/修炼/日志 ②势力/任务/强者/编年史/存档/设置 ③成就/魔法/AI润色（小图标），10 主键 + 快捷键 |
| 3 | 世界旁白栏容器 | /v68ui:announce/ | `#v68-announce` 横贯 topbar 之下，默认空态文案"世界暂无大事。太安静了，安静得让人不安。" |
| 4 | 底部状态行容器 | /v68ui:options/ | `#v68-status`：🪙金龙/⚡行动点/📅日期/📍地点，行动点全界面唯一 |
| 5 | renderTopBar 退役 | /v68ui:cleanup/ | 右下角 8 键 top-bar-extra 整组退役（不再创建 DOM），并清理 V21_CSS 中旧导航样式 |
| 6 | V35 控制台生产隐藏 | /v68ui:cleanup/ | `window.v67Debug` 默认 false（?debug=1 开启），两处 `V35_DevConsole.init()` 条件化 |
| 7 | renderStats 行动点重复移除 | /v68ui:options/ | 右侧 #stats 不再显示行动点（收敛到底部状态行） |
| 8 | renderStats 西幻卷轴包装 | /v68ui:panel/ | `v68_sideWrap`：名字(烫金)+职业·种族+⚜称号行，无头像（按用户要求取消头像区） |
| 9 | renderTop 尾部挂旁白/状态刷新 | /v68ui:announce/ | 每次渲染自动刷新纪闻与状态行 |
| 10 | V68_UI 引擎 | /v68ui:frame/ | IIFE 单例：导航重绑+快捷键、任务/强者/编年史三面板、纪闻聚合/轮播/展开、状态行更新器、侧栏包装 |

## 二、世界旁白栏数据源（只读聚合，不改任何判定）

- ⚔ 战争：`S.worldState.wars[]`（a/b/front/phase → 阶段文案）
- ◆ 局势：`S.worldState.activeSituations[]`（cn/stage）
- 🌪 天灾/区域：`S.worldState.disasters[]` + `S.worldState.regions{}`（state≠正常）
- 📜 编年史：`S.worldChronicle`（末条）
- 📣 传闻：`S.missedEvents[]`（未读）
- 轮播：12s/条；弹窗开启时暂停；[展开] → v67_ui.open 世界纪闻面板（历史存内存 cap20）

## 三、验证结果

| 验证项 | 结果 |
|--------|------|
| elda full（18 检查器，含新增 c_v68ui） | ✅ 全部通过（结构/死链 0/占位 1/语法 19 script PASS/存档兼容 saveVersion=48/世界/战争/叙事/群像/设定/UI） |
| c_v68ui 检查器 | ✅ 引擎/旁白栏唯一且位置正确/状态行/导航 10 键/旧导航退役/控制台隐藏/行动点唯一/无头像/令牌齐全 |
| _v65_sim.js 仿真（含 v68ui 断言组 10 项） | ✅ SMOKE PASS（enginePresent/announceDom/statusDom/navKeys/topbarExtraGone/devConsoleHidden/actionPointUnique/noAvatar/sideWrap/tokens 全 true） |
| 四路同步 | ✅ game.html = game_check.html（6,029,547 字节），game_chunked.html = index.html（3,352,551 字节），字节校验一致 |
| 存档兼容 | ✅ 不新增 S 顶层字段；S.saveVersion=48；全部走既有 EnsureDefaults 兜底链 |

## 四、工程事故记录与修复（供后续参考）

1. **引擎注入吞掉 v67_map 的 `</script>`**：锚点 `</script>\n\n</body>` 被整体替换导致 v67_map 缺闭合标签，elda 语法检查 FAIL（script17 报 `<script>` Unexpected token）。修复：补回 `</script>` + 去重复闭合；注入脚本锚点改为保留原闭合标签（`</script>\n\n` + ENGINE + `</script>\n\n</body>`）。**教训：file 结尾锚点必须保留被替换串中的既有标签。**
2. **幂等 marker 复用时误跳**：同 marker 多 repl 时首个成功即全局 SKIP。改为"注入特征串"幂等（每个 repl 独立特征），可安全重跑。
3. **PowerShell 5.1 内联 python 中文/引号/正则**：一律写 .py 文件 + `python -X utf8` 执行。

## 五、遗留与后续（v68.2 候选）

- 浏览器回归：本轮 GUI 通道（bu daemon / cu PIP）均不可用，已降级为 elda 全链 + node 仿真 + 请用户 file:// 手动抽查（四路已同步，用户浏览器刷新 index.html 即可看到新界面）。
- 面板联动微调：任务/强者/编年史三面板为只读聚合版，后续可按用户反馈深化（任务详情、强者列传、编年史分章）。
- 地图可读性、选项锁定提示等 V67 已落地项保持现状，如实测发现问题再修。


## 追加：白屏事故根因与修复（当日复验）

### 现象
- 桌面入口（index.html 分片版）打开白屏；实测完整版 game.html 同样白屏（body innerHTML=0）。

### 根因（浏览器解析层）
- V68 注入 CSS 时**吞掉了既有 </style> 闭合标签**（与上次 </script> 同款事故模式）：
  - <style> 5 处 vs </style> 仅 2 处；
  - V67 选项锁样式块与 V68 西幻样式块均未闭合，HTML 解析器从 V67 选项锁样式起进入 RCDATA，一直吞到文末，**整个 <body> 被当作 CSS 文本**，故 body 空、页面白屏（背景色正常）。
- 二次错误：V68 双排导航后 mechBindUI（v58）用 `nav.insertBefore(b, btn-map)` 插入"行动/图鉴"按钮，而 btn-map 已不是 nav 直接子节点 → NotFoundError（仅 console 报错，不影响主流程）。

### 修复
1. 补回两个 </style>（V67 选项锁样式后 + V68 西幻样式在 </head> 前），4 真 style 全部闭合。
2. mechBindUI 插入目标改为按钮父容器 `(_r?_r.parentNode:nav).insertBefore(b,_r)`，兼容双排分组。
3. 验证：bu 实测完整版 + 分片版（index.html）正文/旁白栏/状态行/角色面板全部渲染；elda chunks→full(18 检查器全绿)→sync 四路字节一致（game.html=game_check.html 6029639B；game_chunked.html=index.html 3371968B）；node _v65_sim.js SMOKE PASS。

### 教训（已记 README）
- 注入 HTML/CSS 锚点替换时，被替换串中的闭合标签（</script>、</style>）必须显式保留在替换串中，或新块自带闭合；交付前用"开/闭标签计数配对"做解析层冒烟。
