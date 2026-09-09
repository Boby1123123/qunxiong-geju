# QA_v60eng 检验报告

> V60-ENG 全局契约 + 回归健壮性工程 · 2026-09-08
> 权威源：game.html（8,143,355 字节，注入后）｜备份：backup\game_v60eng_before.html（8,140,357 字节）

## 一、方向一：跨 script 52 项 window 显式导出 — 完成

| 项 | 结果 |
|---|---|
| 前置扫描确认表 | docs\winx_确认表_v60.md（52 项明细 + 3 项保留裁决） |
| 批1（script0） | 3 项全部注入（V35_DevConsole / V35_EventBus / V35_ModuleManager） |
| 批2（script1-3） | 46 项全部注入，0 错误 |
| 合计 | 49 项注入成功；专项 52 → 3 |
| marker | /v60inj:winx1:N / /v60inj:winx2:N（每项唯一）；0 重复、0 悬挂 |
| 引用处 | 零改动（仅定义闭合后追加导出语句） |
| 保留专项 | curNode / logs / pool（同名重复声明或定义前裸引用，注入有覆盖风险，保留在专项待后续收敛） |

注入算法说明：本版修复了两处注入偏移漂移 bug——①前项注入改变同 script 偏移导致后续项绝对 pos 失效；②多 script 连续注入累积漂移。现改为**每项注入前基于当前文件重新扫描定位**（jsscan 等长 strip + 全括号配平 + 顶层 let/const 声明），单项目注入、逐项写回，彻底消除偏移问题。

## 二、方向二：bu 回归健壮性 — 完成

| 项 | 结果 |
|---|---|
| 4.1 存档分支确认 | askConfirm 存档恢复：**accept → 读档**；**cancel / 无档 → showCreation() 新游戏**（实测代码确认） |
| 4.2 c_dialog 检查器 | 已建并注册进 elda full（第 10 个检查器）+ registry.json；8 处 confirm 去重 4 签名白名单 → INFO；非白名单 → WARN；本次疑似新增 0 |
| 4.3 elda regress 模板 | tools\elda\regression_template.py + `elda regress [--brief]` 子命令；段1 探测 / 段2 dialog 分支 / 段3-7 分步回归 |
| 4.4 存档数据操作 | 回归默认 cancel（零清档零改游戏）；旧档兼容验证用 accept；均不动游戏逻辑 |
| 4.5 手册更新 | docs\bu会话超时排查与解决手册.md 追加第八章（V60 落地状态 + 确认版急救流程） |

## 三、全链验证

| 检查 | 结果 |
|---|---|
| eldacheck --full（10 检查器） | 全部通过；FAIL 0；专项 3（保留）；原生 dialog 白名单 8 INFO / 新增 0；耗时 7.89s |
| 语法 node --check ×6 | PASS |
| vm 仿真（注入前后对比） | ref 1 / other 3 前后一致，**无新增 ReferenceError** |
| elda chunks | 分片多余节点 0、死链 0、占位 1（允许）、15 JS 语法 PASS |
| elda sync | game.html = game_check.html = 8,143,355 字节；game_chunked.html = index.html = 3,097,376 字节；字节校验一致 |

## 四、浏览器回归（bu 平面）— 部分阻塞，已降级

- **成功**：段1 探测秒回，确认 dialog 阻塞态（message: 检测到存档（第1日，测试角色v58））；list_tabs / switch_tab 正常。
- **阻塞**：handle_dialog 报 "Not attached to an active page"（既有 bu session 同步缺陷，历史已诊断）；resync 挂起（COMMAND_TIMEOUT，手册 R3 根因）；用户跳过接管（browserControl），dialog 未能清除，bu 持续不可用。
- **降级结论**：命令行全链验证（语法/引用/死链/节点/marker/文本/存档/原生 dialog/vm 仿真/分片/四路同步）全部通过，替代浏览器回归的功能正确性验证；注入仅追加导出语句、引用零改动、vm 仿真无新增错误，方向一风险已由四层守护覆盖。
- **请用户手动确认**：file:// 打开 D:\1pao tuan\群雄割据\game.html（或 index.html），出现存档恢复框时点「取消」进入新游戏，确认：①创建角色正常；②序章可玩；③职业之路七轨面板渲染正常；④无 console 报错。如有异常反馈，按 QA 报告追查。

## 五、风险与缺口

| 项 | 评级 | 说明 |
|---|---|---|
| 方向一注入 | 中低 | 纯追加导出 + 引用零改动；前置扫描 / node --check / eldacheck / vm 仿真四层守护；异常可回滚备份 |
| 方向二 | 低 | 纯工具 / 模板 / 文档 / 存档数据操作；游戏核心流程（判定公式 / 节点 / 存档逻辑 / 8 处 confirm）零触碰 |
| bu 会话缺陷 | 已知 | 非本工程引入；c_dialog + elda regress + 手册已固化规避流程，等待环境侧修复 session 同步 |
| 3 项保留专项 | 低 | curNode / logs / pool 不注入，语义不变；后续命名空间收敛时处理 |

## 六、交付物清单

- game.html / game_check.html / game_chunked.html / index.html（四路同步）
- docs\winx_确认表_v60.md（含执行结果与 3 项裁决）
- docs\bu会话超时排查与解决手册.md（第八章 V60 更新）
- tools\eldacheck\checks\c_dialog.py + eldacheck.py（full 注册）
- tools\elda\regression_template.py + elda.py（regress 子命令）
- tools\registry.json（+3 项：c_dialog / v60_winx_scan / v60_winx_inject）
- _v60_winx_scan.py / _v60_winx_inject.py / _v60_vm_sim.py
