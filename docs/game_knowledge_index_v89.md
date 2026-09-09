# 《艾尔达大陆·群雄割据》游戏知识总览（可检索索引 + 摘要）

> 版本：v89 | 日期：2026-09-09 | 批次：U9（D2 知识基座，补历史遗留）
> 定位：一句话到一段话的世界观/势力/人物/节点体系/引擎架构/工具链索引，供后续内容创作与开发检索复用。

---

## 〇、快速索引（一句话定位）

| 想查什么 | 去哪 |
|---|---|
| 游戏是什么 | §一 一句话与玩法核心 |
| 世界地图与七大地域 | §二 世界观 → 地图/地域 |
| 八/九大势力与关系 | §三 势力表（含信仰/立场/关系） |
| 重要人物/NPC/强者 | §四 人物（STRONG_V53 40+ 强者、16 群像档案、9 支线） |
| 剧情节点体系 | §五 节点体系（id 前缀/格式/规模） |
| 引擎核心函数 | §六 引擎架构（状态/推进/判定/存档/世界事件） |
| 构建与工具链 | §七 工具链（src 权威源/elda 命令/验证链） |
| 存档结构 | §八 存档层（键/字段/迁移/云接口） |
| 历次大版本 | §九 版本史（v46→v89） |
| 技术文档全集 | §十 docs 索引 |

---

## 一、游戏一句话与玩法核心

- **一句话**：单文件西幻文字 MUD（HTML+JS，file:// 双击即玩），玩家在《艾尔达大陆·群雄割据》中自由扮演冒险者，在八/九大势力与七大地域间选择行动、累积状态、触发剧情与结局。
- **玩法核心**：状态机式推进——每个节点是一段叙事 + 若干选项；选项带 check（属性判定三档/暴击）、run 回调（改变 S 状态/好感/物品）、go（跳转）；`S.flags` 累积解锁新节点与结局链。
- **规模（v89）**：节点 3,789+、结局 30+、事件池 60、支线 9 条、存档 ~5MB 上限（超限 IndexedDB 迁移）。

---

## 二、世界观

### 2.1 核心设定
- **七印/深渊**：黄林晶三千年前加固七道封印；深渊封印松动是主线悬念（W46 伏笔：purge/silver/seal/academy/orc 五大世界事件）。
- **初代神**：元素神·寂光（星落海）、战神·戈、太阳神·圣临、誓约之神·无名、锻造神·铸、财富神·金衡；灵魂法师"无神明·自创"。
- **枢机选举**：教皇沉眠十年，枢机团三十日内选新教皇（papacy 事件）。
- **兽人南下**：草原兽人南迁，边境告急（orc 事件 + 兽王鬃吼）。

### 2.2 地图与七大地域（12+ 城市入口 arrive_*）
| 地域 | 代表城市/地点 | arrive 入口 |
|---|---|---|
| 北境 | 艾尔达/帝京/河湾城/铁门关/赤峰 | arrive_north_*（7 个） |
| 自由城邦 | 自由港/工会/集市/下水道 | arrive_free_*（5 个）+ fc_*（14 个） |
| 东境 | 晨天/铁门关 | arrive_east_*（2 个） |
| 南境 | 港口城/黄金/星落海/商战/学术城 | arrive_south_*（5 个） |
| 荒漠 | 边缘/深渊神殿 | arrive_desert_*（2 个） |
| 精灵/矮人/兽人 | 王庭/王都/圣山 | arrive_elf/dwarf/orc_* |
| 圣城 | 圣辉教堂/学院 | city_holy_* + academy_*（269） |

### 2.3 世界事件系统
- WORLD_EVENTS（5 大主线事件，day 触发）+ EVENT_POOL_EXT（60 个扩展：天灾/奇遇/商机/人祸各 15，day 触发，`w["ev_"+id]` 去重防重复）。
- checkWorldEvents 每日检查 → logMsg 播报 + worldQueue 入队 + v46_maybeMissed 影响相关节点。

---

## 三、势力表（9+）

| 势力 | 头目/核心 | 立场 | 关系/备注 |
|---|---|---|---|
| 金衡商会 | 文森·金秤（lv_trade1） | 中立商业 | 自由城邦支柱，人情账本 |
| 北方公国 | 北境王（north_king） | 守土 | 铁门关/长城防线 |
| 圣辉教廷 | 教皇（沉睡）/枢机团 | 宗教 | 净化令（purge）扩张 |
| 学院联邦 | 院长奥雷利安·晨曦（academy_head） | 求知 | 学城/藏书塔，派系暗流 |
| 骑士团 | 罗兰·白盾（lv_knight1） | 守誓 | 帝京圣盾广场 |
| 暗蚀会 | 腐光·塞尔等 6 人 | 反派 | 深渊线，与兽人密约 |
| 冒险者工会 | — | 中立 | 悬赏/任务 |
| 帝国（东境） | 贵族/军部 | 扩张 | 铁门关税权之争 |
| 兽人诸部 | 鬃吼 | 南下 | 与暗蚀会协议 |

---

## 四、人物（NPC 生态）

### 4.1 STRONG_V53 强者名录（13 职业组 40+ 角色，按职业）
魔法师（奥薇恩·星语/洛·晨雾/凯·青焰/瑟琳·银冠/伊尔·灰书）、战士（格罗·铁壁/喀兰·赤峰/秦·长风/叶·孤山/罗·断江）、牧师、盗贼（杜·夜枭/薇·灰雾）、游侠、骑士（罗兰·白盾/伊莎·晨辉）、术士、商人（文森·金秤/洛佩斯·半帆）、灵魂法师（澜·梦墟/奥雷利安·晨曦）、隐世、散人、兽王、暗蚀会 6 人。

### 4.2 群像档案（W66_PROFILES 16 条，四件套 habit/tagline/desire/goal）
文森·金秤、秦·长风、罗·断江、奥薇恩·星语、凯·青焰、格罗·铁壁、喀兰·赤峰、克莱门·圣言、杜·夜枭、艾琳·逐风、罗兰·白盾、格朗·符文、洛佩斯·半帆、澜·梦墟、初代元素神·寂光、初代战神·戈。

### 4.3 好感度支线（9 条闭环，全部 65 挚友）
- P1-2：A 金秤账本（文森）、B 木臂藏信（秦·长风）、C 断江旧枪（罗·断江）
- U8：D 星落海求星（奥薇恩）、E 铜夜枭（杜·夜枭）、F 白盾之誓（罗兰）、G 北境王、H 学院院长、I 自由港执政官
- 机制：changeRelation + 4 节点递增（+10/+15/+20/+20）→ 65 挚友 → triggerRelationEvent 里程碑

---

## 五、节点体系

### 5.1 规模与格式
- 总节点 3,789+（口径：game.html 1,564 + chunks 2,894 + data_nodes 外置）
- **双格式**：对象式 `N["id"]={place,where,text,options}` 与函数式 `N["id"]=function(){return {...}}`（含"先执行后 return"）
- writeNext 用 `typeof N[curNode]==="function"` 双兼容

### 5.2 id 前缀语义（节选）
arrive_（城市到达）、fc_（自由城邦）、city_、academy_（269）、north_/south_/east_、ending_（结局 21+）、faction_（75）、p12_/u8_（支线）、hlj_（黄林晶遗产线）、pro_（序章）等。

### 5.3 内容工具（U6）
`elda node new/check/stats`——新增 1 节点=只加数据不改引擎；check 全量节点格式/必填/引用完整性；stats 内容量统计。

---

## 六、引擎架构（src/script_03.js 核心）

| 函数 | 职责 |
|---|---|
| emptyState | S 全字段基础形态 |
| applyDefaults | 旧档兜底（不覆盖已有值） |
| loadGame | 读 localStorage + applyDefaults |
| writeNext | 渲染当前节点（全局 curNode） |
| choose | 选项处理：check 判定/run/effects/timeCost/go |
| showEnding | 结局展示（+ 结局记录 + 周目记录） |
| newGame | 新旅程（+ 跨周目继承） |
| checkWorldEvents | 五类世界事件按 day 触发 |
| renderStats/renderMapPanel 等 | UI 面板渲染 |
| 十二时辰/任务/交易/拜访/探秘/深渊低语/巡逻/冥想/采矿 | 机制函数 |

### 引擎铁律（不可触碰）
判定公式 / writeNext 核心语义 / choose / 存档语义 / saveVersion=48 / applyDefaults 兜底链。

---

## 七、工具链

### 7.1 权威源与构建
- **权威源**：`src\script_*.js`（26 块 + data_nodes\ 外置数据 + head/tail/gap）→ `_build_authority.py build` → game_built.html → game.html（四路同步）
- **四路**：game.html = game_check.html；game_chunked.html = index.html（字节一致）
- **分片**：`elda chunks`（从 game.html 提取 v62_*.js 到 chunks\）

### 7.2 elda 命令
quick/full/chunks/sync/audit/stale/doctor/ledger/registry/snapshot/diff/build/ci/schema/node/budget/regress/serve

### 7.3 验证链（elda ci）
src 语法 node --check（26 块）→ 权威源幂等 verify → 四路字节一致 → elda full 18 检查器 → 性能预算门（6 项：体积上限/baseline/节点下限/死链/耗时）

### 7.4 冒烟测试
`python -X utf8 smoke_test.py`——静态完整性 + 状态机推进（simulate_keychain）+ 运行时证据（regress_result.json）。

---

## 八、存档层

- **主键**：`elda-qunxiong-v3-save`（RULESET_ID=elda-qunxiong-v3）；saveVersion=48
- **StorageKit**（v60）：多槽位（v34 UI）、LZ 压缩（v61_lzstring）、超限迁移（>3,600,000 字符 → IndexedDB `elda-saves/saves`）、导出导入（文件名含时间戳）
- **跨周目**：`elda-ngplus-v2`（结局图鉴/往世/周目号）；legacy 结局键 `elda-legacy-v2`
- **云接口**：CloudProvider 契约（v63.5 注释区，U3 文档化，未启用服务端）

---

## 九、版本史（v46→v89）

| 版本 | 内容 |
|---|---|
| v46 | 世界事件系统（checkWorldEvents + maybeMissed） |
| v47 | 结局记录/尾声 |
| v50-57 | 破境/专属剧情/大版本节点体系 |
| v60 | StorageKit 多槽位 |
| v61 | LZ 压缩 |
| v62 | 分片构建链 |
| v63 | 容量评估（节点 3,409/存档 5MB 瓶颈） |
| v64 | 世界模拟层（8 势力/七阶段战争/5 天灾/7 市场/枢机选举/因果链） |
| v65 | 战争系统（v65_career/warPanel） |
| v66 | 文风规范 + 群像记忆（16 档案——U7 补齐） |
| v67 | 对比度 |
| v68 | UI 重构（面板居中/字号） |
| v69 | 权威源与构建链（src 唯一权威源） |
| v70 | 状态 Schema |
| v71 | 存档层 |
| v76 | P2 特性（ngPlus 预留/EVENT_POOL_EXT/预算门） |
| v77-80 | 引擎模块化（script_02 拆分）/节点格式/事件池/好感支线/沉浸模式 |
| v81-88 | U1 体积预算/U2 模块边界/U3 存档层/U4 性能基线/U5 可测试性/U6 内容工具/U7 多周目/U8 NPC+事件 |
| v89 | 知识总览 + 预算自动化 |

---

## 十、docs 技术文档全集（可检索）

| 文档 | 主题 |
|---|---|
| u1_volume_buildchain_v81.md | 体积预算+构建链收编 |
| u2_boundary_governance_v82.md / _u2_a5_处置记录.md | 模块边界/112 孤岛 |
| u3_save_layer_v83.md | 存档层强化 |
| u4_perf_pipeline_v84.md | 性能基线 |
| u5_testability_v85.md | 可测试性+回归工具链 |
| u6_content_tools_v86.md | 内容工具（node 三命令） |
| u7_ng_system_v87.md | 多周目系统 |
| u8_npc_events_v88.md | NPC 生态+事件池 |
| 权威源与构建链_v69.md / 状态Schema_v70.md / 存档层_v71.md / budget_deadcode_v76.md | P0 系列 |
| p1_2_quests_v80.md / p2_features_v76.md | 内容/特性清单 |
| UI体验整改方案.md | UI 8 项诊断 |
| QA_*.md（v50-v66 系列） | 各版本检验报告 |

---

## 十一、给后续创作的口令模板（复用）

1. **加内容**：`elda node new <id>` → 填对象式节点 → `elda node check` → build → sync → ci
2. **加事件**：EVENT_POOL_EXT 追加 {id,day,cls,text}（天灾/奇遇/商机/人祸）
3. **加支线**：对象式节点 + 入口注入（/u8inj:*-entry/ 标记）+ run 回调（changeRelation 4 次 65 挚友）
4. **全量验证**：`elda ci` → `python -X utf8 smoke_test.py` → bu 浏览器回归
