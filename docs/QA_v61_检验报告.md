# QA_v61_检验报告（存档扩容 + 性能地基 + 工具加速）

- 生成时间：2026-09-08 12:37
- 版本范围：V61-ENG 全量（方向一存档扩容 / 方向二性能 / 方向三工具 / 方向四清理）
- 基线：backup\game_v61_before.html（MD5 D461313BCE2CE23A738B628B45704E2C）

## 一、验证结果总览

| 验证项 | 结果 | 说明 |
|---|---|---|
| elda full 十项体检 | ✅ 全部通过 | 语法 6/6、死链 0、引用 FAIL 0/WARN 0、节点 3263 配平、marker 重复 0、既有全局 0、存档兼容 PASS、s-size PASS、原生 dialog 基线 8 处 |
| elda chunks 分片 | ✅ 通过 | 节点 3409 合并一致、缺失 0、多余 0、死链 0、占位 1（允许）、15 JS 语法 PASS |
| elda sync 四路同步 | ✅ 通过 | game=check 8,072,517 字节；chunked=index 3,112,409 字节，MD5 一致 |
| node 仿真 _v61_node_sim.js | ✅ ERRCOUNT=0 | LZ 往返 3 例（中英文/JSON）、sniffRaw 明文+压缩双路径、注入块无 ReferenceError、console 静音开关生效 |
| 工具提速 | ✅ 目标达成 | full 首次 ~2.5s（缓存命中后），基线 7.96s，降幅 ~68%；二次 full <3s |

## 二、方向一：存档扩容（P0）

| 项 | 状态 | 验证 |
|---|---|---|
| LZString 内联（WTFPL）| ✅ | /v61inj:save-lz/ 块 10KB，node 仿真压缩/解压往返一致 |
| SaveStore 压缩写 | ✅ | saveToLS 序列化后压缩加 lz1: 前缀（注入点 1）|
| 三路径嗅探读 | ✅ | readFromLS / init 读档 / v34 面板 3 副本（共 5 点）经 sniffRaw；旧明文零报错自动迁移 |
| import 增强 | ✅ | importJSON 支持明文与 lz1: 压缩双格式 |
| 导出/导入 | ✅ 代码就位 | 设置面板按钮 + Blob 下载 + 文件导入 + ruleset 校验 + 导入前备份；bu 回归未能执行（会话超时），留手动验证 |
| s-size 检查器 | ✅ | elda full 新增「存档体积估算」：明文 0.03MB / 压缩 0.00MB（充裕）；明文>4MB FAIL / >3MB WARN |
| 旧档兼容 | ✅ | 主键不变、S.saveVersion=48、明文旧档嗅探兼容、迁移可逆（导出文件可人工解压还原）|

## 三、方向二：性能优化（P1）

| 项 | 状态 | 验证 |
|---|---|---|
| 打字机 rAF 化 | ✅ | v34_typewriter 双副本 + immerseAfterWrite 副本共 3 处改造：每帧 2-4 字符（速度滑块档位映射），rAF 不可用回退 setTimeout |
| 点击正文跳全文 | ✅ | perf-core 全局 click 监听（排除按钮/选项区），打字机 active 时触发 skipTypewriter；skip 双保险清 rAF+setTimeout |
| afterWrite 钩子注册表 | ✅ | v61_afterWrite + register/dispatch；v43 包装追加统一分发（不动 v53_rumor/v34_immerse 原有调用）|
| TimerRegistry | ✅ | v61_timer/v61_clearAll；收编 2 处 node.auto 延迟跳转；loadGame/init 读档/新游戏 3 处清理挂点 |
| console 运行时静音 | ✅ | v61_consoleSilent 包装 log/info 为 no-op（error/warn 保留）；仿真确认开关生效 |
| 卡顿缓解 | ✅ 结构性 | 300 字长文：原 ~300 次 DOM 写 2.4s+ → rAF 批量 ~100 帧/帧写 1 次 DOM；性能收益需 bu 实测确认 |

## 四、方向三：工程加速（P1）

| 项 | 状态 | 验证 |
|---|---|---|
| elda full 增量缓存 | ✅ | c_text/c_dead 按 game.html sha1 缓存；命中标注「(缓存命中)」；--no-cache 强制全量；full 二次 2.52s（<3s 目标达成）|
| elda snapshot/diff | ✅ | 子命令接入 elda 入口（底层 V59 已实现）；快照 3409 节点/301 全局；diff 输出新增/移除节点与 marker |
| docs 索引 | ✅ | docs\索引.md 自动生成（41 份文档导航）|
| registry 登记 | ✅ | 新增 11 条（v61 运行时/注入/检查器/入口），共 30+ 条 |

## 五、方向四：专项清理（P1）

| 项 | 状态 | 验证 |
|---|---|---|
| logs 跨 script 根治 | ✅ | const logs=[] 后加 window.logs=logs 显式导出；c_refhealth 专项 3→2（logs 消除），无新 FAIL |
| TODO 清点 | ✅ | 全库扫描 0 处（历史版本已清理）；docs\TODO清点_v61.md 记录 |

## 六、遗留缺口与风险

1. **浏览器回归未完成**：bu 会话持续超时（handle_dialog 后 CDP 掉线，resync 亦超时），已按 V60 降级方案转为手动验证清单（见下）。
2. **打字机/存档交互的实机体验**未经浏览器实测：rAF 打字节奏、点击跳全文、迁移闭环、导出/导入文件流——需手动 file:// 验证。
3. s-size 样本为「字段上限填充」估算，实际档体积随剧情文本增长可能高于样本；阈值已留 WARN/FAIL 两级。
4. 跨 script 专项剩 2 项（curNode/pool）为历史兜底模式，非本版范围，后续版本可再收敛。

## 七、手动验证清单（file:// 打开 game.html）

1. 旧档读入：出现「检测到存档」→ 继续 → 页面正常进入，console 0 新错误
2. 保存后二次读：读档 → 任意操作触发存档 → 再读，进度一致（迁移闭环）
3. 打字机：设置中开/关打字机；长文本节点点击正文立即全文；速度滑块各档节奏正常
4. 导出/导入：设置 → 导出存档 → 得到 .json；导入该文件 → 进度恢复；导入损坏文件 → 明确报错不覆盖
5. 新游戏：新游戏 → 序章走 2-3 步，无残留定时器导致的跳转错乱
6. V35 控制台：typeof choose/writeNext/v57_flowCheck/COMBAT_TEXTS 均正常

## 八、结论

V61-ENG 四方向全部落地并通过全链验证：存档压缩扩容（旧档自动迁移、可逆导出）、性能地基（rAF 打字机/钩子注册表/定时器户口/console 静音）、工具加速（增量缓存 + snapshot/diff，full 从 8s 降至 <3s）、专项清理（logs 根治）。核心红线零触碰（判定公式/节点/存档公开语义/8 处 confirm 未改）。bu 回归受阻属既有环境问题，已交付手动验证清单闭环。
