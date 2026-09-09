# 群雄割据 · 项目地图（详细锚点与文档索引）

## 目录结构

```
D:\1pao tuan\群雄割据\
├── game.html           权威源（6,382,063B，勿手工改，从 src 构建）
├── game_check.html     与 game.html 字节一致（elda sync 维护）
├── game_chunked.html   分片版（3,732,777B）
├── index.html          分片版默认入口（= game_chunked.html）
├── _build_authority.py src → game_built.html 权威构建（绝不覆盖 game.html）
├── smoke_test.py       冒烟测试（headless，节点完整性+结局入边统计）
├── budget.json         性能预算（上限/baseline/历史 31+ 条）
├── version.json        版本权威源（v92）
├── src\                26 块源（script_00~18 + 变体 + data_nodes）
│   ├── script_01.js    REGIONS / WORLD_EVENTS / EVENT_POOL_EXT
│   ├── script_02*.js   战斗/结局/成就/多周目/坐骑（巨型，已模块化）
│   ├── script_03.js    writeNext 渲染（:3321）
│   ├── data_nodes\     dn_causality(38账本) dn_memory_tpl dn_chapters 等 12 个数据文件
├── tools\elda\
│   ├── elda.py         统一入口（quick/full/chunks/sync/audit/stale/doctor/ledger/registry/regress/serve/ci/build/schema/node/budget/content/text/backup/release/test/volume）
│   ├── eng_impl.py     工程链实现（backup/release/test/volume）
│   ├── p2tools_impl.py 内容/文本工具（content/text 族）
│   ├── chunks_impl.py / nodes_impl.py / budget_impl.py / eldacheck\
│   └── extract_events.js  事件池 node 提取器
├── docs\               文档族（世界设定/状态Schema/存档层/各批次文档/版本发布记录）
├── skills\             四技能仓库副本（project-guide/content-author/story-guard/ci-guard）
├── backup\             自动快照（snap_*.zip 保留 12 份）+ 手工批次备份
├── .githooks\pre-commit    本地门禁（自动快照+全量校验）
├── .github\workflows\ci.yml  云端 CI
└── chunks\             分片产物（23 文件，NODE_MAP 等）
```

## 关键行号锚点

| 对象 | 位置 | 说明 |
|---|---|---|
| REGIONS 九域 | src/script_01.js:15 | 六域（elf/dwarf/orc/east/church/desert）+ west 等 |
| WORLD_EVENTS | src/script_01.js:17 | purge60/silver120/seal200/academy250/orc280 |
| EVENT_POOL_EXT | src/script_01.js:19-124 | 95 事件（天灾/人祸/奇遇/商机） |
| writeNext | src/script_03.js:3321 | 正文渲染入口（含 v45_sceneTitle） |
| choose/判定 | script_02.js 核心 | **红线：不触碰** |
| changeRelation | script_02c.js:425 | 好感变化 |
| 分段阅读 | S.settings.pagedReading | I1-1 落地 |
| 沉浸模式 | UI.immersive | P1-1 落地 |
| StorageKit | script_04.js | 三层存储 + 云存档 |
| 手记 | elda-journal-v3 | I1-3 冒险手记 |

## 验证链（每批必跑）

```
elda backup --reason <批次>      # 改动前快照
node --check（26 块）            # src 语法
elda test all                    # 结局 25 + 事件 95 全量回归
elda ci                          # 21 检查器（含四路字节、预算门、账本 38、设定词 20）
smoke_test.py                    # 冒烟
ci_guard.py --build --report     # 一键全链（CI 同款）
```

## 红线（所有批次铁律）

1. 判定公式 / writeNext 核心语义 / choose / 存档结构语义：**不触碰**；saveVersion=48 **不变**。
2. 节点数只增不降（当前 3,877）；文本不删句、不改既有选项语义。
3. 设定不冲突：8 势力 / 五主线 / 七锚 / 铁牌 / 神谕 / 金秤 / 晨天；因果账本 38 项只核销不删改。
4. 移动端适配内容已删除，禁止再做。
5. 改动前备份（backup\），出现偏差立即停止报告，不绕行不降级。

## docs 索引（按主题）

- 世界/设定：`世界设定_v64.md`、`p2_expansion_v91.md`
- 架构：`权威源与构建链_v69.md`、`状态Schema_v70.md`、`存档层_v71.md`
- 流程：`开发工作流.md`、`工具手册.md`、`版本发布记录.md`
- 连续性：`CM-1_记忆注入.md`、`CM-2_状态变体.md`、`CM-3_因果账本.md`、`CM-4_节奏字数.md`
- 沉浸：`I1-1_分段阅读渲染.md`、`I1-2_章节标题卡.md`、`I1-3_冒险手记.md`
- 内容包：`BD-1~4`、`PE-*`、`U6~U9` 系列
- 云存档：`云存档方案_v635.md`、`云存档灰度验证.md`
- 验收口径：`p2_features_v76.md`、`p2_tools_v90.md`、`budget_deadcode_v76.md`

## 常见操作 SOP

| 任务 | 命令/步骤 |
|---|---|
| 加一个节点 | `elda content new --type <main|branch|event|ending> --id x --vol <卷>` → 填 text（带 pace）→ 账本登记 → `elda test all` |
| 加一批事件 | `elda content event --id x --day N --cls <天灾|人祸|奇遇|商机> --text "..." --commit` |
| 检查伏笔 | `elda content causality`（38 项核销 + 设定词 20/20） |
| 查死链 | `elda content chain`（9 线达标） |
| 发版 | `elda release --note "..."`（门禁→v92→Notes→tag） |
| 排 CI 红灯 | 先本地 `ci_guard.py --build --report` 复现；报告在 docs/ci_guard_report_latest.md |
