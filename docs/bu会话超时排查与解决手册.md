# bu 会话超时排查与解决手册

> 2026-09-08 实测编制 · 适用：computer_use_tool plane="bu"（seed_browser_use / CNGC Browser Use stack）操作 file:// 单文件大页面（game.html 8.1MB）

## 一、症状识别（先分清是哪一种）

| 形态 | 表现 | 判断 |
|---|---|---|
| 快速失败 | 秒回 `CDP protocol error -32000: Not attached` / `-32001: Session with given id not found` | **session 失效**（R2），不是超时 |
| 挂起超时 | COMMAND_TIMEOUT，无任何输出 | 命令被**阻塞**（R1 dialog 或 R4 大页面） |
| 连环超时 | 一次超时后，后续连续几次全部超时 | **排队积压**（R3） |

## 二、根因（本轮实测确认）

### R1：未处理的 JS modal dialog 阻塞渲染进程（最常见、最隐蔽）

- 游戏有 **8 处原生 `confirm(`**（存档恢复 / 删除存档 / 覆盖存档 / 新游戏确认等），其中"检测到存档（第1日，测试角色v58）。是否继续？"已实测从上次会话一直挂到本次（`dialog.is_open: True`）。
- 机制：modal dialog 打开时，Chrome 渲染进程阻塞 → 所有需要进渲染进程的 CDP 命令（DOM 读取、JS 执行、输入、navigate、resync）挂起直至超时；**只有浏览器级命令（list_tabs / page_info 的部分字段）能返回**。
- 证据链：page_info 能秒回且显示 dialog → handle_dialog 报 Not attached → cdp 报 Session not found → resync 挂起。

### R2：bu target session 失效

- switch_tab 返回了新 page id，但 bu 内部 CDP sessionId 未同步 → 页面级命令全部失败（Not attached / Session not found）。
- resync 是重建 session 的唯一手段，但它的内部实现在本环境挂起（连环超时下尤其如此）。

### R3：连环超时排队

- COMMAND_TIMEOUT **只杀掉调用方，不取消已派发的动作**（工具机制）→ daemon 仍被旧命令占着 → 新命令排队 → 再超时 → 恶性循环。

### R4：环境资源

- 8.1MB 单文件 + 3409 节点，Chrome 加载/渲染重；navigate 后立即操作易超时。

## 三、急救流程（按顺序照做）

```
第 1 步  遇超时立即停手，Wait 10-20 秒（让 daemon 消化已派发命令），禁止连环重试
第 2 步  短 timeout（15-30s）单命令探测 bu.page_info()
        ├─ 能返回 → daemon 活着 → 看 dialog 字段
        │     ├─ dialog.is_open=True → 进入第 3 步
        │     └─ dialog 关闭 → 直接继续正常操作
        └─ 超时 → daemon 假死 → 进入第 5 步（环境级）
第 3 步  处理 dialog（阻塞源，最高优先）：
        bu.list_tabs() → switch_tab(含 game.html 的 tab) → handle_dialog(accept=True)
        ├─ 成功 → dialog 解除，继续
        └─ 报 Not attached / Session not found → session 已失效 → 进入第 4 步
第 4 步  重建 session：
        bu.resync()（单命令、短 timeout）
        ├─ 成功 → 回到第 3 步处理 dialog
        └─ 挂起超时 → bu 无法自愈 → 进入第 5 步
第 5 步  环境级恢复（bu 无法自行重启 Chrome）：
        方案 A：重启浏览器环境 / 重启本应用会话（最有效，daemon + Chrome 一起复位）
        方案 B：请用户接管浏览器（interaction_request_action type=browserControl）
                手动处理页面上的存档确认框后交回控制权
        方案 C：降级验证（见第五节）
```

**铁律**：dialog 未处理前，不要 navigate / 不要 resync / 不要堆叠多个命令——全都会挂。

## 四、预防规范（日常操作习惯）

1. **进入页面后第一件事检查 dialog**：每个 bu cell 开头 `print(bu.page_info())`，见到 `is_open: True` 立即处理，绝不让 dialog 过夜。
2. **单 cell 单动作**：一个 cell 只做"探测"或"一个动作 + 验证"，不组合多步（组合调用是超时放大器）。
3. **短 timeout 起步**：探测用 15-30s；确认稳定后再放宽。
4. **超时后先 Wait 再继续**：一次超时 = 停手 10-20s，等 daemon 消化。
5. **console_messages 定期 drain**：console 缓冲不 drain 会累积，定期 `bu.console_messages()` 清空。
6. **不写大段 bu.js**：必要 CSS-only 场景用窄 scope，用完回到 ref-first。
7. **navigate 后等加载**：8MB 页面 navigate 后先 `wait_for_load(timeout)` + 短 sleep，再操作。
8. **固定 bu 平面**：本项目回归固定 plane="bu"，不切 cu（切平面会使已学到的页面状态失效）。

## 五、根因级修复（推荐，游戏代码层）

原生 `confirm(` 是 bu 自动化的天敌——弹窗即阻塞。game.html 已有 `askConfirm(msg)` 包装（内部仍调 window.confirm），**建议后续版本把 8 处原生 confirm 改造为游戏内 DOM UI 确认弹窗**（游戏已有 flashMsg / 自绘 UI 体系）：

- 改造点：`askConfirm` 改为 Promise 式非阻塞确认（返回 Promise，UI 按钮 resolve true/false），8 处调用点改 `await askConfirm(...)`（注意调用链需支持 async）。
- 收益：
  - bu 自动化从此**永不被 dialog 阻塞**——回归测试可全自动跑完（读档/删档/新游戏全程无阻塞点）
  - 玩家体验提升：弹窗与游戏画风统一，不再有浏览器原生对话框
  - 存档流程可加"稍后再说"等选项
- 风险：涉及存档/新游戏/删档核心流程，需分批复用 + 逐项浏览器回归；改动前备份。
- 优先级：P1（非紧急但强烈建议，v60 或 v61 并入）。

## 六、降级验证方案（bu 持续不可用时）

已建成体系，浏览器回归可整体降级为命令行 + 仿真：

| 原项 | 降级替代 | 覆盖度 |
|---|---|---|
| 页面加载无致命错误 | Node vm 逐 script 仿真（0 ReferenceError） | 顶层脚本执行 |
| 存档兼容 | c_save 存档仿真（主键/saveVersion/ensureDefaults） | 读档兜底 |
| 引用健康/死链/节点 | eldacheck full（10 项） | 静态全量 |
| 关键函数存在性 | 正则核查 choose/writeNext/v57_* 等 | 引擎挂载 |
| 交互流程 | 用户手动打开 file:// 回归，或环境恢复后 bu 补跑 | 交互层 |

## 七、建议动作清单

| 动作 | 责任方 | 时机 |
|---|---|---|
| 8 处原生 confirm → 游戏内 UI 确认 | 游戏版本开发（v60+） | 下一内容版本 |
| bu daemon 稳定性排查（resync/session 同步 bug） | 环境侧 | 持续 |
| 会话前清残留 dialog（打开页面先处理存档框） | 自动化规范 | 每次回归 |
| 超时后 Wait + 短 timeout 规范 | 自动化规范 | 每次回归 |

## 八、V60-ENG 更新（2026-09-08 已落地）

1. **elda regress 模板就绪**：elda regress 输出 bu cell 模板（段1 探测 / 段2 dialog 分支 / 段3-7 分步回归），每次回归照抄不再现想。
2. **存档恢复分支已实测确认**：accept → 读档；cancel → showCreation() 新游戏。回归默认 cancel（零清档、零改游戏）；旧档兼容验证用 accept。
3. **c_dialog 检查器已内置**：原生 confirm/alert/prompt 全扫描，8 处去重 4 签名白名单（INFO 已知风险点），非白名单新增 → WARN。elda full 自动执行。
4. **确认版急救流程**（简化后）：
   - 超时 → Wait 10-20s → 单命令 page_info 探测
   - dialog 存在 → list_tabs → switch_tab → handle_dialog（accept 读档 / cancel 新游戏）
   - bu 无法自愈（resync 挂起 / Session not found）→ 环境重启 → 用户接管（interaction_request_action browserControl）→ 降级命令行
5. **标准动作固化**：任何 bu 操作前先处理 dialog；单 cell 单动作；console 定期 drain。
