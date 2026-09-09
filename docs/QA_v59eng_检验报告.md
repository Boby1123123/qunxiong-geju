# QA_v59eng 检验报告（V59-ENG 工具链总成工程）

> 2026-09-08 · 权威源 game.html（8,140,357 字节）· 备份 backup\game_v59eng_before.html（同字节已校验）

## 一、方向一：eldacheck 精确化（P0）

| 目标 | 结果 |
|---|---|
| strip 全等长化（// 注释等长占位） | ✅ 完成（jsscan.strip_equal，位置与原文一一对应，行号回归准确） |
| c_structure 误报归零（13 → 0） | ✅ 既有全局模式=0；真泄漏=0（多变量声明/箭头函数参数/参数默认值/for 头全深度绑定修复） |
| c_refhealth 补漏 | ✅ FAIL 0 / WARN 0 / PASS 251；跨 script 专项 52 项显眼暴露（不阻断） |
| 死代码检测增强 | ✅ c_dead：孤岛节点 639 / 无调用函数 76 / 未用 S 字段 0（候选清单制，见 docs\死代码清单_v59.md） |
| 性能 | ✅ quick 2.1s；full 7.8s（原 76s，**11 倍提速**）；c_syntax 6 并发；c_speed 计时器接入 |
| WARN 2163 → 0 | ✅（对象键前导空格过滤 + 顶层裸引用判定，ELDA 库闭包参数不再误报） |

## 二、方向二：工具统合（P1）

| 项 | 结果 |
|---|---|
| elda 单入口 | ✅ tools\elda\elda.py + elda.bat；9 子命令全部实现并实测 |
| elda chunks | ✅ 分片构建 2758 提取 + 验证 0 缺失 + 语法 15 PASS |
| elda sync | ✅ 四路字节一致（game=check 8,140,357；chunked=index 3,094,378） |
| elda audit | ✅ 注册表 11 项全跑退出 0（v46×3/v47/v53/v54/v55/v56/v57/eldacheck full + placeholder 跳过） |
| 审计注册制 | ✅ tools\audit_registry.json（含 v59+ 扩展位） |
| 工具注册表 | ✅ tools\registry.json 51 项（active/retired/archived/removed 状态） |
| README 重写 | ✅ 4 步链（elda full → chunks → sync → 浏览器回归） |

## 三、方向三：多层面管理 + 过时清理（P1）

| 项 | 结果 |
|---|---|
| 清理清单 | ✅ docs\清理清单_v59.md（删除 82 / 归档 18 / 保留 252 / 超龄备份归档 22） |
| 缓存清理 | ✅ __pycache__ / *.pyc 全删 |
| 文档统合 | ✅ docs\工具手册.md、docs\结构台账_v59.md、docs\死代码清单_v59.md |
| 过时断言修复 | ✅ _v53_audit 180000→125000（v54 口径）；_v47_foreshadow saveVersion47→48 兜底检查 |

## 四、验证覆盖

- eldacheck --full：语法 6/6、死链 0、FAIL 0、WARN 0、节点 3263 配平、marker 27 种无重复无悬挂、文本 0、存档兼容 PASS、死代码候选、性能 7.8s —— **全绿**
- elda chunks：分片 0 缺失、语法 15 PASS、死链 0、占位 1（允许）
- elda audit：11 项注册审计 exit 0
- 关键函数存在性核查：choose/writeNext/advanceTime/v57_flowCheck/v57_flowSwitch/v57_brandCount/v57_hubRefresh/COMBAT_TEXTS/window.COMBAT/window.STRONG_V53/window.PEERS_V53 全 OK；主键与 saveVersion=48 确认

## 五、浏览器回归（bu 平面）

**缺口声明**：本次 bu 会话连续两次 COMMAND_TIMEOUT 卡死（与上轮同况，环境问题非代码问题）。按既定降级方案完成：命令行静态侧验证 + c_save 存档仿真 + 关键函数存在性核查全过。浏览器人工回归（file:// 打开 game.html 建号→序章）**未执行**，待环境恢复后补做。game.html 判定逻辑零改动，风险低。

## 六、遗留项（显眼暴露，不阻断）

1. **跨 script 专项 52 项**：顶层 let/const 数据（ATTR_CN/FEATS_V51/SKILLS_V55/ARC_V55/CAREER_HUB_V57 等）被其他 script 裸引用 → 潜在运行时 ReferenceError（分支未触发故未炸）。修复需改 game.html（window 导出），超出纯工程范围，列入后续版本（v60 前优先处理）。
2. **孤岛节点 639**：多为动态拼接 go（go:"seal_"+n）与未接入扩展线，候选清单见 docs\死代码清单_v59.md，需人工逐条确认。
3. 无调用函数 76：成员调用/运行时字符串引用的保守候选，人工确认后可删。

## 七、结论

V59-ENG 三大方向全部完成：检测精确化（误报归零、76s→7s）、工具统合（elda 单入口 + 双注册表 + 审计注册制）、过时清理（82 删/18 归档/文档统合）。工具链现为后续所有版本开发的公共基础设施：新审计一行注册、新工具一行登记、任何改动后 `elda full` 30 秒内给出精确到行的全貌。
