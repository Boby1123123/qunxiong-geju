# README_构建验证.md

> 本文件说明《群雄割据》的现行验证链与工具用途（2026-09-08 V59-ENG 重写版）。
> 工作目录：`D:\1pao tuan\群雄割据` · 权威源：`game.html` · 统一入口：`elda`

## 一、核心交付物（勿删）

| 文件 | 用途 |
|---|---|
| `game.html` | **主游戏**（单文件 HTML，全部剧情/引擎/UI 内联），唯一权威源 |
| `game_check.html` | 浏览器回归测试副本（`elda sync` 同步） |
| `game_chunked.html` / `index.html` | 分片版与部署版（`elda chunks` 后 `elda sync`） |
| `tools/elda/elda.py` | **工具链统一入口**（V59-ENG 新增） |
| `tools/eldacheck/` | 一键体检 CLI（10 检查器） |
| `tools/audit_registry.json` / `tools/registry.json` | 审计注册表 / 工具注册表 |
| `backup/` | 各版本开工备份（保留最近 5 版） |

## 二、现行验证链（任何改动后的标准顺序）

```
1. elda full                 # 一键体检（含存档体积 s-size + 世界局势 c_world；文本/死代码走增量缓存，二次 <3s）
2. elda chunks               # 分片构建 + 完整性 + 语法
3. elda sync                 # 四路同步 game→check、chunked→index + 字节校验
4. node _v64_sim.js          # W64 世界引擎 smoke 仿真（vm 合并 scripts + world 片：势力/战争结算/天灾/市场/因果）
4b. node _v64b_sim.js        # v64.1 引擎仿真（战争五变体三态/游说门槛/休战期/兜底字段/新节点存在性）
4c. node _v65_sim.js         # v65 战争引擎仿真（从军/军衔/部队/同袍/军营事件/恩怨/佣兵/创伤/长廊/grudge 修复/名将/攻城，46 断言）
4d. node _v66_sim（并入 _v65_sim） # v66 叙事引擎仿真（记忆/账本/传说防重复/涟漪/过渡/档案/节点存在性，新增 8 断言，SMOKE PASS）
5. 浏览器回归（file:// 打开 game.html）：建号→序章→行动面板→职业之路七轨
   → 世界面板"🌍世界"推进数周看局势/关系/行情变化；有战争时"奔赴前线"
   → v64.1 三入口：世界面板底部"枢机团会场 / 立下目标 / 战后结算"（战后结算仅在参战结算后出现）
   → v65 战争入口：世界面板"⚔战争"按钮 → 投军/军旅日程/军事学院/恩怨簿/伤城/佣兵公会（框架先行：各线走通核心路径）
   → 存档：旧档读零报错→保存→二次读；打字机点击跳全文；V35 抽查 v57_flowCheck
   → 0 console 新错误
6. （可选）elda serve --open  # 本地 HTTP 服务 → http://127.0.0.1:8000/index.html 回归（V63.5）
```

### elda 子命令

| 命令 | 内容 | 耗时 |
|---|---|---|
| `elda quick` | 语法 + 死链 + 引用 + 节点 + marker + 结构 六项 | ~2s |
| `elda full` | quick + 文本质量 + 死代码 + 存档兼容(含 s-size) + 性能计时（增量缓存） | 首次 ~8s / 二次 <3s |
| `elda chunks` | 分片构建 + 验证 + 语法（收编 _v42 三脚本） | — |
| `elda sync` | 四路同步 + 字节校验 | — |
| `elda audit` | 按审计注册表跑全部版本审计 | — |
| `elda stale` | 过时文件检测 → 清理候选 | — |
| `elda doctor` | 环境自检（python/node/文件/一致性） | — |
| `elda ledger` | 自动生成结构台账 docs\结构台账_<日期>.md | — |
| `elda registry` | 打印工具注册表 | — |
| `elda snapshot` / `elda diff` | 结构快照 / 与最近快照对比影响面（V61 接入 elda 入口） | — |
| `elda regress` | 打印 bu 回归模板（dialog 分支 + 分步动作，V60 落地） | — |
| `elda serve [--port N] [--open]` | 本地 HTTP 服务（V63.5：http://127.0.0.1:N/index.html，与 file:// 双轨并存） | — |

## 三、检查器清单（tools/eldacheck/checks/）

| 检查器 | 职责 |
|---|---|
| c_syntax.py | 6 script node --check **并发** 6/6 |
| c_links.py | go 引用死链（节点/引用/死链统计） |
| c_refhealth.py | 引用健康（判定矩阵 + 顶层隐式全局 + 跨 script 专项 52 项不阻断） |
| c_nodes.py | N[id] 节点格式（括号配平、text/options、重复 id） |
| c_markers.py | 注入 marker 台账（重复/悬挂检测） |
| c_structure.py | 结构健康（V59：误报归零，多变量/箭头函数/参数列表隔离） |
| c_text.py | 文本质量（AI味/引号笔误/半角标点/口径）——只读清单 |
| c_dead.py | 死代码候选（孤岛节点/无调用函数/未用S字段，不阻断） |
| c_save.py | 存档兼容仿真（主键/saveVersion/ensureDefaults 链） |
| c_speed.py | 性能计时（超阈值 WARN） |
| c_world.py | 世界局势健康（v64：W64 引擎存在性 / 5 个 S 字段兜底 / w64_tickWorld 挂载 / w64 节点死链 / 市场数值合法） |
| c_war.py | 战争与战斗健康（v65/v652/v653/v654：引擎函数 / 兜底字段 / 军衔兵种表 / 悬赏表 10 / v654 战略层引擎表节点死链 tick 入口；V65.4 扩展） |
| jsscan.py | 共享 JS 静态扫描器（等长 strip + 深度 + 多变量声明） |

## 四、注册表与工具状态

- **审计注册**：新版本审计只需在 `tools/audit_registry.json` 加一行 `{auditId,path,args,expect,desc}`，`elda audit` 自动纳入（当前含 v46/v47/v53/v54/v55/v56/v57 + eldacheck full）。
- **工具注册**：`tools/registry.json` 全工具登记（113 项，含外部连接器）；status 区分 active/retired/archived/removed。
- **归档**：历史一次性脚本在 `tools/archive_20260908/`（v59_cleanup 子目录为 V59 归档）。

## 五、备份与文档

| 路径 | 内容 |
|---|---|
| `backup/` | 各版本开工备份（保留最近 5 版） |
| `docs/` | QA 报告、结构台账_v59、工具手册、死代码清单_v59、清理清单_v59、ARCHITECTURE.md、STYLE_GUIDE.md |
| `tools/` | elda（入口）/ eldacheck（体检）/ archive_20260908（归档） |
| `releases/` | 发布版 |

## 六、注意事项（沿用）

- 写含中文的 .py 脚本前，先查「」笔误；PowerShell 下 `python -c` 带中文/引号必报错，一律写临时 .py 文件执行（`python -X utf8`）。
- 所有剧情节点格式：`N["id"]=function(){return{place,text:[],options:[{t,go}]}};`（选项用 `t:`，不用 `text:`）。
- localStorage 存档键：`elda-qunxiong-v3-save`（勿改）；S.saveVersion=48（勿改）。
- 注入新内容：精确 str.replace 锚点 + 幂等 marker（`/vXXinj:名称`），**禁止全文宽松正则替换**（历史教训：误伤 167 处）。
- 新增全局对象：IIFE + try/catch + DOM 判空；数据块 const 前置 + 尾部 `window.X = X` 显式导出，禁混用（见 结构台账_v59.md 第三节）。
- 工具规范：新检查器 = checks\ 建文件 + eldacheck.py 注册；新审计 = audit_registry.json 加行；新工具 = registry.json 登记。

## V65.5 验证链（战线地图 + 谈判 UI + 赔款闭环）
注入：_v655_engine.py -> _v655_hooks.py -> _v655_nodes.py -> _v655_prefix.py（war 行加 v655）-> python -X utf8 _v62_build_chunks.py
验证：node --check 7/7 -> node _v65_sim.js（84 断言 SMOKE PASS）-> elda full（13 检查器含 c_war v655 块）-> elda chunks -> elda sync（四路字节一致）
报告：docs\QA_v655_检验报告.md

## V67 验证链（UI 系统重构与交互修复工程）

注入：_v67_scan.py（前置探查）-> _v67_lock.py -> _v67_modal.py -> _v67_gate.py -> _v67_cost.py -> _v67_cost2.py -> _v67_map.py/_v67_map_patch.py/_v67_map_patch2.py -> _v67_theme.py -> _v67_fix.py（elda 4 FAIL 修复）-> _v67_fix_deadlock.py（v67.1 死锁修复）
验证：python -X utf8 tools\elda\elda.py chunks（3423 节点零缺失）-> full（17 检查器含 c_ui 全绿）-> sync（四路字节一致：game/game_check 6,009,818B、game_chunked/index 3,352,551B）-> node _v65_sim.js（v67 断言 20 项 + 死锁回归 4 项，SMOKE PASS）
文档：docs\QA_v67_检验报告.md / docs\v67_前置确认表.md / docs\V67_选项规范.md / docs\V67_对比度验证表.md / docs\v67_安全出口审计.md
注：v67.1 修复了分页/auto/无选项节点死锁（writeNext 早退路径 + 看门狗重置）；改动后必须重跑 chunks -> full -> sync。
## V68-UI 西幻手抄圣典界面重构（2026-09-08）
注入：_v68ui_apply.py（11 项，特征串幂等，marker /v68ui:frame|nav|panel|announce|options|cleanup/）
内容：西幻令牌+哥特组件 / 顶部双排导航（10 主键+快捷键）/ 世界旁白栏 #v68-announce / 底部状态行 #v68-status（行动点唯一）/ 角色面板西幻卷轴（无头像）/ top-bar-extra 退役 / V35 控制台生产隐藏
验证：python -X utf8 tools\elda\elda.py full（18 检查器含 c_v68ui 全绿）-> sync（四路一致：game/game_check 6,029,547B、game_chunked/index 3,352,551B）-> node _v65_sim.js（v68ui 断言组 10 项，SMOKE PASS）
文档：docs\QA_v68_检验报告.md / docs\V68_UI_方案一_落实口令.md
注：engine 注入锚点必须保留被替换串中的既有 </script>（v67_map 闭合）；GUI 回归通道本轮不可用，已降级 elda+node+file:// 手动抽查。
