# QA_v67 检验报告（UI 系统重构与交互修复工程）

> 版本：V67（基于 V66，16→17 检查器）｜日期：2026-09-08｜权威源：game.html

## 一、交付范围

| 方向 | 内容 | 状态 |
|---|---|---|
| 方向一 选择交互规范 | __v67Busy 全局锁 + uiFeedback 反馈 + 5s 看门狗 + 锁定态灰化/title + 安全出口审计 | ✅ 落地（含 v67.1 死锁修复） |
| 方向二 模态栈统一 | #modal 2→1 + v67_ui 单例（stack/openDepth/焦点陷阱/统一出口） + closePanel/closeModal/openModal 别名转发 | ✅ 落地 |
| 方向三 入口门禁 | V67_GATES（academy_enter/abyss_gate/faction_visit/job_trial） + v67_gate + CITY_SPOTS 路由 | ✅ 落地 |
| 方向四 行为成本 | v67_costTrain/Explore 成本器 + 环境表 + 疲劳（trainStreak≥3 后 -25%） + 身心限制 + renderRealm 消耗说明 | ✅ 落地 |
| 方向五 地图统一 | v67_map（REGIONS 权威/24 城 SVG/缩放/城市卡/真实旅行转发）+ 双入口统一（btn-map/底部 tab/openWorldMap） | ✅ 落地 |
| 方向六 主题令牌 | primitive/semantic/component 三层令牌 + v67-panel 基类 + 45 处硬编码色替换 + theme-night 覆盖确认 | ✅ 落地 |
| 方向七 UI 回归 | c_ui 检查器 9 项 + 仿真断言扩展 20 项 + 浏览器回归 | ✅ 落地 |

## 二、关键缺陷修复（含 v67.1 增补）

| 缺陷 | 根因 | 修复 |
|---|---|---|
| 选项可连点 | choose 无防重入 | 入口锁 + uiFeedback 禁用 + 5s 看门狗 |
| **分页/auto 节点死锁**（v67.1） | writeNext 分页/auto 路径早退无解锁；showOptions 提前 return 不清锁；看门狗仅加载时注册一次 | 分页/auto/无选项路径全加 busyClear；busySet 每次置锁重置看门狗 |
| 面板返回无反应 | closePanel/closeModal 双定义散装出口 | 全部转发 v67_ui.close()，✕/遮罩/Esc/返回游戏同一出口 |
| UI 重复（#modal×2） | 历史双实例 | 合并为 1（getElementById 计数=1） |
| 地图模糊/重复 | v34 旧地图 + renderMapPanel + openWorldMap 三套并存 | v67_map 单例（SVG 24 城 + 缩放 0.8–2.5 + 迷雾 + 城市卡），三入口统一 |
| 点学院跳前置 | CITY_SPOTS 直绑 mechSecret | v67_gate('academy_enter') 按 S.academyYear 路由（未入学→入学线，已入学→hub） |
| 修炼不耗时耗力 | CITY_ACTIONS 直调 mechTrain() 绕过成本 | mechTrain/mechExplore 成本化（AP+时间+环境×mult+疲劳+身心限制） |

## 三、构建验证（全绿）

| 检查 | 结果 |
|---|---|
| elda full（17 检查器） | ✅ 全部通过（9.7s；含 UI系统检查 PASS、marker=134 种重复 0、死链 0、占位 1） |
| elda chunks（分片重建） | ✅ 3423 节点零缺失、go 引用 10828 死链 0、41 JS node --check PASS |
| 四路同步 | ✅ game/game_check 6,009,818B、game_chunked/index 3,352,551B 字节一致 |
| node _v65_sim.js | ✅ SMOKE PASS（v67 断言 20 项 + 死锁回归 4 项全 true，含历史断言共 70+） |
| registry 登记 | ✅ 追加 13 项（探查/注入×9/修复×2/检查器） |

## 四、浏览器回归（bu 平面，file:// index.html）

| 用例 | 结果 |
|---|---|
| v67 引擎就位 | ✅ v67_ui/v67_map/v67_gate/v67_costTrain 均 object/function；#modal=1；__v67Busy=boolean |
| 地图双入口 | ✅ btn-map（v67_map.open()）与底部🗺️地图（openWorldMap 转发）均开 v67_map 模态；h2“大陆地图” |
| 地图渲染 | ✅ 24 城（16 已知 + 8 未探索❓）、缩放 130%、城市卡（交汇城·大陆十字路口·前往/城中各处/关闭）、Esc 关闭 |
| 学院门禁 | ✅ v67_gate('academy_enter') 未入学不崩、走 fail 分支（writePar 提示） |
| 修炼面板 | ✅ 显示“消耗 1 时段 + 1 行动点｜地点效果 ×1（城中客栈，安稳）” |
| 选项连点 | ✅ 同帧连点仅第一选项生效（busy 锁 + uiFeedback 禁用双层）；curNode 只走选项1分支 |
| 分页解锁 | ✅ 选项后进入分页节点立即解锁（busy=false）、翻页正常、翻完出新选项 |
| console | ✅ 无 v67 新增错误；已知遗留：`Script error:0`/`N is not defined`（分片加载顺序历史项）/`V35 Module not found: core`（控制台模块，非致命） |

## 五、存档兼容

- 主键 `elda-qunxiong-v3-save` 不变；S.saveVersion=48；S 无新增顶层字段。
- 新字段 trainStreak/v67CostLog 走 v67_ensureDefaults 兜底（链入 v66）。
- 预置 v66 存档读档零报错（浏览器实测旧档 v58 正常读入）。

## 六、遗留与后续（P2）

- 安全出口：2095 个全前进候选节点，Top 20 高频补“返回/离开”选项（见 v67_安全出口审计.md）。
- 选项键盘数字选择、hover 后果预览。
- theme-night 未全覆盖面板（首轮已确认无刺眼项）。
- _v67_panel_walk.py 面板遍历截图对比（回归自动化）。
- 分片加载顺序历史错误（Script error/N is not defined）列入专项排查。
