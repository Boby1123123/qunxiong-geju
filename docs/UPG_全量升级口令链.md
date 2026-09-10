# UPG 文游升级 · 全量口令链（UPG-01 ~ UPG-18）

> **日期**：2026-09-10｜**基线**：v92（节点 4,601 / 事件 176 / 账本 147 / saveVersion=48 / ci 25 检查器 / 四路字节一致）
> **执行要求**：一次全部完成，不停等、不缩水。每批：备份 backup\UPGxx_20260910\ → 改动 → node --check → 构建 → 四路 → budget → ci → smoke → docs → git 提交 → 进入下一批。

## 阶段一 · P0 架构基石（UPG-03 → 04 → 01 → 02）

| 批 | 内容 | 验证 |
|---|---|---|
| UPG-03 因果账本四字段 | 147 项加 importance(1-5)/keywords[]/lastReferencedTurn/irreversible；伏笔超期提醒 | ci 通过；抽样评级合理；不可逆项与死亡/背叛节点交叉验证 |
| UPG-04 节点 tag 通道 | 节点对象加 tags[]；事件池按标签筛选；结局/战斗/势力节点 tags 非空校验 | ci 新检查器；事件池标签筛选单测 |
| UPG-01 设定词世界书 | 设定词加 triggers[]/constant/recursive/depth；渲染节点前扫描命中注入；核心设定 constant | 命中/未命中断言；渲染对比 20→3-8 条；ci 校验 triggers 非空 |
| UPG-02 记忆注入 v3 | 世界规则层 constant + 事件记忆层 importance×recency Top-K(3-5) 注入 | 模拟 100 节点断言；账本字段无遗漏；触发率 >80% |

## 阶段二 · P1 体验升级（UPG-05 → 06 → 07 → 08 → 10 → 09）

| 批 | 内容 | 验证 |
|---|---|---|
| UPG-05 回退系统 | historyStack 限长 50-100 环形；block_rollback 不可逆清栈；同节点操作后刷新 moment | 回退 10 次状态正确；死亡后禁用；环形覆盖 |
| UPG-06 结局图鉴+成就 | 独立 key elda_achievements；结局节点 endingId；成就定义；标题页/手记展示；云同步 | 刷新后图鉴仍在；重开不丢；ci 校验 endingId |
| UPG-07 ObserveVariable | ELDA.observe(varName, cb)；attrs/infl/worldFame/npcRelations/realm/gold 订阅刷新 | 测试节点改 infl.north 自动刷新；手动刷 UI 点移除 >80% |
| UPG-08 属性总览面板 | renderStatsPanel()：角色卡/六维/势力矩阵/infl+worldFame/关键状态 | 面板正确显示；移动端适配 |
| UPG-10 三级持久化 | sessionStorage 恢复 + autosave 每 10 节点/5 分钟 + JSON 导出导入 | 刷新恢复；自动存档触发；导出导入一致 |
| UPG-09 九域地图可视化 | SVG 地图：已访问高亮/解锁条件/当前位置/事件标记；移动端缩放 | 九域正确绘制；访问后高亮；解锁一致 |

## 阶段三 · P2 内容与工具链（UPG-13 → 18 → 12 → 11 → 14 → 17 → 16 → 15）

| 批 | 内容 | 验证 |
|---|---|---|
| UPG-13 V66 风格锁 | 风格锚点块固化进 elda-content-author；ci 加排比/否定煽情检测 | 抽检符合度 >90%；治理词 ≤30 |
| UPG-18 人味标注器 | AI 生成后标注情感太平/反转 predictable/NPC 雷同三段 | 样本正确标记 >80%；误标 <20% |
| UPG-12 口令流水线 | 生成前注入 GameState+世界书+账本 Top-K+上节点摘要；四段质检+反 AI 六维 | 注入命中 >80%；检出 OOC 样本 |
| UPG-11 Quicktest/Randomtest | 静态遍历 goto/flag/不可达；随机 1000 局命中报告；集成 ci | 死链正确报错；0 命中列表合理 |
| UPG-14 事件池全局钩子 | 钩子表 {id,condition,eventId,cooldown,maxTriggers}；节点切换后扫描 | 条件满足触发；cooldown 生效；不影响 176 事件 |
| UPG-17 编年史系统 | chronicle 扩展 {date,eventType,desc,discoveredBy,importance}；结局按发现顺序回顾 | 战争/天灾写入；回顾按发现顺序 |
| UPG-16 西幻体系深化 | 种族特长世界书条目；职业事件池权重；魔法四系 requires mana；阵营阈值变体 | 种族特长生效；职业权重可测；ci 字段完整 |
| UPG-15 节点物理分区 | 九域命名规范 <region>_<area>_<seq>；按域分文件；渐进迁移；注册表索引 | 分区后四路一致；全量回归；ci 命名校验 |

## 铁律（全程）
- 备份 backup\UPGxx_20260910\；saveVersion=48 不变；旧档兼容（applyDefaults 兜底）；不触碰判定公式/writeNext/choose/存档语义；节点只增不降；V66+30 治理词+中文引号成对+战斗四段式；四路字节一致；ci 全绿；smoke PASS；bu 实测；每批 docs+git。
