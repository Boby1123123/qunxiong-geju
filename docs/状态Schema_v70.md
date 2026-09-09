# S 状态 Schema（批 2 / P0-4）— 自动生成于 elda schema report

> 本文件由 `schema_elda.py report` 自动生成 + 手工综述两部分构成。
> 统计口径：扫描 `src\script_00..18.js` 中所有 `S.<field>` 顶层引用。

## 一、统计概览

| 指标 | 数值 |
|---|---|
| S 顶层字段总数 | 235 |
| emptyState 基础字段 | 45 |
| 动态初始化字段（含守卫） | 233 |
| 真裸引用风险字段 | 0 |
| 带 || 兜底字段 | 2 |

## 二、基础字段（emptyState，script_03.js:5-24）

| 字段 | 说明 |
|---|---|
| `attrs` | 六维属性 {SPR,STR,AGI,INT,CHA,CON} |
| `aura` | 气质 |
| `background` | 背景（可空） |
| `books` | 书籍 |
| `choices` | 选择历史（存读档时清空防超限） |
| `conds` | 修行条件 {mat,kno,pra,rit,anc,work} |
| `date` | 日期文本 |
| `day` | 天数（第 N 日） |
| `dead` | 死亡标记 |
| `dice` | 骰子记录 |
| `disease` | 疾病标记 |
| `ending` | 结局（可空） |
| `fatigue` | 疲劳 |
| `flags` | 剧情标记集合 |
| `gender` | 性别 |
| `gold` | 金币 |
| `hobby` | 爱好（可空） |
| `homeland` | 出生地 |
| `hp` | 生命 |
| `ideal` | 理想（可空） |
| `infl` | 九地影响力 {free,north,south,church,elf,dwarf,orc,east,abyss} |
| `items` | 背包物品 |
| `job` | 职业（可空） |
| `job2` | 副职（可空） |
| `karma` | 业力 |
| `loc` | 地点 ID |
| `mats` | 材料 |
| `maxSan` | 理智上限 |
| `name` | 角色名 |
| `race` | 种族 |
| `realm` | 境界 0=凡人境 |
| `region` | 区域 ID |
| `rep` | 名望 |
| `ruleset` | 规则集 ID（elda-qunxiong-v3） |
| `san` | 理智 |
| `silver` | 银币 |
| `skills` | 技能 |
| `subrace` | 亚种/出身 |
| `talent` | 天赋 |
| `travelFatigue` | 旅途疲劳 |
| `v` | 存档结构版本（2） |
| `visited` | 已访问地点集合 |
| `world` | 世界事件标记 {purge,silver,seal,academy,orc} |
| `wound` | 伤势 |
| `xp` | 经验 |

## 三、动态初始化字段（ensureDefaults 系 / 运行时守卫）

| 字段 | 首次出现 |
|---|---|
| `_btCrisis` | script_02.js:16575 |
| `_lastMoralConsequence` | script_02.js:32552 |
| `_vused` | script_03.js:94 |
| `abyssCorruption` | script_04.js:2408 |
| `abyssCountdown` | script_02.js:32747 |
| `abyssPath` | script_02.js:29299 |
| `academy` | script_02.js:42514 |
| `academyForeshadowing` | script_02.js:42532 |
| `academyPolitics` | script_02.js:42529 |
| `academySecrets` | script_02.js:42530 |
| `academyYear` | script_02.js:19428 |
| `achievements` | script_02.js:30145 |
| `activeEvents` | script_02.js:38536 |
| `affixRolls` | script_04.js:749 |
| `afterWorld` | script_02.js:2665 |
| `aftermath` | script_02.js:29600 |
| `apprentice` | script_02.js:21549 |
| `arcProgress` | script_03.js:463 |
| `arcV55` | script_02.js:19238 |
| `army` | script_02.js:21760 |
| `artifact` | script_02.js:18489 |
| `attributeUnlocks` | script_02.js:38966 |
| `attrs` | script_00.js:889 |
| `aura` | script_03.js:178 |
| `axisDaily` | script_02.js:17313 |
| `axisMilestones` | script_02.js:17314 |
| `background` | script_02.js:11343 |
| `battlesWon` | script_02.js:30080 |
| `books` | script_02.js:311 |
| `brandLog` | script_02.js:21550 |
| `breakthrough` | script_03.js:892 |
| `btGuardian` | script_02.js:16468 |
| `btHistory` | script_02.js:16646 |
| `btPlace` | script_02.js:16476 |
| `careerMark` | script_03.js:893 |
| `cargo` | script_02.js:16221 |
| `cargoWeight` | script_02.js:16215 |
| `challenged` | script_02.js:19573 |
| `choices` | script_03.js:1180 |
| `chronicle` | script_02.js:34977 |
| `classmateChronicle` | script_02.js:34107 |
| `classmateStories` | script_02.js:42531 |
| `climate` | script_02.js:36295 |
| `codex` | script_02.js:30089 |
| `coin` | script_02.js:19704 |
| `collectedDocuments` | script_02.js:31909 |
| `conds` | script_02.js:3003 |
| `corruption` | script_02.js:17312 |
| `council` | script_02.js:36665 |
| `curNode` | script_03.js:55 |
| `date` | script_03.js:3410 |
| `day` | script_02.js:11346 |
| `dayPeriod` | script_03.js:2838 |
| `deified` | script_02.js:18483 |
| `deity` | script_02.js:22302 |
| `demi` | script_02.js:19574 |
| `desert_done` | script_02.js:2430 |
| `dice` | script_03.js:3354 |
| `disease` | script_03.js:126 |
| `divinity` | script_02.js:20529 |
| `eclipseFaces` | script_02.js:33437 |
| `encounterHistory` | script_02.js:38568 |
| `ending` | script_03.js:54 |
| `endingFlags` | script_02.js:17972 |
| `endingHistory` | script_03.js:465 |
| `entryHits` | script_02.js:30249 |
| `equipAffix` | script_04.js:748 |
| `equipment` | script_02.js:16052 |
| `exp` | script_00.js:920 |
| `faction` | script_04.js:2721 |
| `factionPower` | script_02.js:21548 |
| `factionRep` | script_02.js:21547 |
| `faithBoard` | script_02.js:34489 |
| `fatigue` | script_02.js:39705 |
| `featPoints` | script_02.js:17309 |
| `feats` | script_02.js:17310 |
| `flags` | script_01.js:1684 |
| `flow` | script_02.js:21545 |
| `flowOld` | script_02.js:24788 |
| `flowPts` | script_02.js:21551 |
| `foreshadowing` | script_02.js:40727 |
| `gameLog` | script_02.js:30243 |
| `gender` | script_03.js:246 |
| `godRival` | script_02.js:17972 |
| `godTrial` | script_02.js:18488 |
| `gold` | script_02.js:9814 |
| `graduation` | script_02.js:42533 |
| `guardianActive` | script_02.js:19685 |
| `guardianLog` | script_02.js:19575 |
| `heardRumors` | script_02.js:31764 |
| `hiddenRoutes` | script_02.js:38922 |
| `hljLetters` | script_02.js:33038 |
| `hobby` | script_02.js:82 |
| `homeland` | script_02.js:12 |
| `hp` | script_00.js:912 |
| `ideal` | script_02.js:123 |
| `infl` | script_03.js:179 |
| `inventory` | script_02.js:16085 |
| `item` | script_02.js:22091 |
| `items` | script_02.js:2258 |
| `job` | script_02.js:104 |
| `job2` | script_03.js:3744 |
| `jobBrand` | script_02.js:21546 |
| `karma` | script_02.js:30331 |
| `karmaWeb` | script_02.js:34117 |
| `knowledge` | script_02.js:31983 |
| `knownStrong` | script_02.js:19571 |
| `languages` | script_02.js:36270 |
| `learnedSpells` | script_02.js:30088 |
| `level` | script_02.js:16178 |
| `loc` | script_02.js:11514 |
| `locationMemory` | script_02.js:32180 |
| `loreDiscovered` | script_09.js:12 |
| `magic` | script_04.js:2228 |
| `mainBranch` | script_02.js:37776 |
| `materials` | script_02.js:29790 |
| `mats` | script_02.js:310 |
| `maxCargo` | script_02.js:16215 |
| `maxHp` | script_00.js:912 |
| `maxMp` | script_00.js:913 |
| `maxSan` | script_00.js:914 |
| `memories` | script_09.js:10 |
| `mercenary` | script_02.js:21763 |
| `militaryCareer` | script_02.js:21758 |
| `missedEvents` | script_02.js:20463 |
| `moralChoices` | script_02.js:32311 |
| `mount` | script_02.js:30102 |
| `mp` | script_00.js:913 |
| `name` | script_02.js:15979 |
| `ngPlus` | script_02.js:30194 |
| `notoriety` | script_04.js:1021 |
| `npcFates` | script_02.js:38167 |
| `npcLedger` | script_09.js:11 |
| `npcRelations` | script_02.js:16264 |
| `npcSchedules` | script_02.js:39706 |
| `orgDone` | script_02.js:18486 |
| `orgRank` | script_02.js:18480 |
| `orgRep` | script_02.js:18479 |
| `originPrologue` | script_02.js:40745 |
| `parallelEvents` | script_02.js:39703 |
| `pastTravel` | script_02.js:35930 |
| `path` | script_03.js:1093 |
| `peak` | script_02.js:18482 |
| `peakPts` | script_02.js:17372 |
| `persona` | script_03.js:894 |
| `pets` | script_02.js:30117 |
| `piety` | script_02.js:17311 |
| `primordial` | script_02.js:35412 |
| `prologueState` | script_03.js:3687 |
| `prologueTime` | script_02.js:40861 |
| `prophecy` | script_02.js:35946 |
| `protector` | script_03.js:896 |
| `purity` | script_02.js:23539 |
| `questDeadlines` | script_04.js:2845 |
| `quickSlots` | script_02.js:30245 |
| `race` | script_02.js:9899 |
| `raceFates` | script_02.js:34479 |
| `raceSub` | script_03.js:1096 |
| `readings` | script_03.js:44 |
| `realm` | script_02.js:314 |
| `realmCn` | script_02.js:24206 |
| `region` | script_03.js:3414 |
| `relations` | script_02.js:36680 |
| `rep` | script_03.js:176 |
| `reputation` | script_02.js:22085 |
| `ripples` | script_02.js:38208 |
| `rivalDone` | script_02.js:18487 |
| `san` | script_00.js:914 |
| `saveTime` | script_03.js:3470 |
| `saveVersion` | script_03.js:51 |
| `schoolExp` | script_02.js:29724 |
| `schoolLevels` | script_02.js:29719 |
| `sealChain` | script_02.js:32740 |
| `settings` | script_02.js:30246 |
| `shopStates` | script_02.js:39707 |
| `silver` | script_03.js:4016 |
| `skillCd` | script_02.js:19343 |
| `skillLog` | script_02.js:19239 |
| `skillPrep` | script_02.js:19305 |
| `skills` | script_02.js:11681 |
| `slotId` | script_03.js:39 |
| `slowTravel` | script_02.js:31204 |
| `storyLines` | script_02.js:37805 |
| `strongBond` | script_02.js:19572 |
| `strongChat` | script_02.js:20356 |
| `strongDeeds` | script_02.js:20357 |
| `strongLife` | script_02.js:20354 |
| `strongRel` | script_02.js:20355 |
| `sub` | script_02.js:129 |
| `subclass` | script_03.js:1094 |
| `subclassCn` | script_03.js:1095 |
| `subrace` | script_02.js:9899 |
| `succession` | script_02.js:36996 |
| `talent` | script_03.js:250 |
| `theomachy` | script_02.js:19576 |
| `time` | script_02.js:19013 |
| `title` | script_02.js:24016 |
| `titles` | script_02.js:21973 |
| `trainStreak` | script_03.js:4177 |
| `travelFatigue` | script_03.js:143 |
| `unevenStep` | script_03.js:895 |
| `v65Heard` | script_02.js:21764 |
| `v66Flags` | script_09.js:13 |
| `v67CostLog` | script_16.js:8 |
| `visited` | script_02.js:30090 |
| `w64Aftermath` | script_02.js:21587 |
| `w64Camp` | script_02.js:21586 |
| `w64Heard` | script_02.js:21583 |
| `w64Karma` | script_02.js:21584 |
| `w64Side` | script_02.js:21585 |
| `w65Battle` | script_02.js:21765 |
| `wanted` | script_02.js:39907 |
| `wantedLevel` | script_02.js:30016 |
| `warFame` | script_02.js:21761 |
| `warGrudges` | script_02.js:21759 |
| `warScars` | script_02.js:21762 |
| `watcherChronicle` | script_02.js:33054 |
| `weakness` | script_03.js:897 |
| `willShift` | script_02.js:19577 |
| `works` | script_02.js:3012 |
| `world` | script_02.js:29957 |
| `worldChronicle` | script_02.js:19029 |
| `worldClock` | script_02.js:39270 |
| `worldFame` | script_02.js:21582 |
| `worldGoals` | script_02.js:21581 |
| `worldHeard` | script_02.js:20460 |
| `worldQueue` | script_03.js:3431 |
| `worldSeed` | script_02.js:14692 |
| `worldState` | script_02.js:14695 |
| `worldTimeline` | script_02.js:37513 |
| `worldTimers` | script_02.js:39704 |
| `wound` | script_03.js:125 |
| `xp` | script_02.js:22082 |

## 四、真裸引用风险字段（audit 结果）

无 — 所有被引用字段均有默认值或初始化点。

## 四·补、带 || 兜底的防御引用（可接受）

| 字段 | 引用次数 |
|---|---|
| `currentCity` | 1 |
| `learnedSkills` | 3 |

## 五、保存/读档链路（现状，v64 铁律语义未动）

```text
保存: saveGame() script_03:3464
  S.choices=[] (防超限) → S.curNode → S.saveVersion=48 → S.slotId
  → S.saveTime → StorageKit.save(S) script_04:8298
  → saveToLS(slot, data) 多槽位 localStorage

读档: init() script_03:4430（启动探测 v61_lzstring.sniffRaw）
  → loadGame() script_03:38（StorageKit.load(slotId)）
  → applyDefaults(d) script_03:25（补默认字段）
  → S.readings / v46/v55/v56/v57/w64 ensureDefaults
  → S.saveVersion ||= 48 → 渲染
```

## 六、校验命令

```text
python tools\elda\schema_elda.py audit   # 裸引用风险清单
python tools\elda\schema_elda.py extract # 全字段统计 JSON
elda schema                                # 同上（统一入口）
```

---
## 七、手工综述

### 7.1 字段治理结论
- 基础字段 29 个 + 动态字段（ensureDefaults 体系）共同构成 S 的全集。
- 动态字段按版本分批注入：v46/v51/v52/v53/v54/v55/v56/v57/w64/v65/v66，读档时按 `if(window.X_ensureDefaults)` 防御式串联调用。
- 存档语义（saveVersion=48、choices 清空、StorageKit 多槽位）完全沿用 v64 铁律，未作任何改动。

### 7.2 本批改动面
- 新增 `tools\elda\schema_elda.py`（只读分析器）。
- 新增 `elda schema` 命令（统一入口）。
- 新增本 Schema 文档。
- **未修改** game.html / src\ / 存档逻辑 / 判定公式。

### 7.3 后续批衔接
- 批 3（存档层 SaveStore）将以此 Schema 为字段白名单，实现导出/导入与 IndexedDB 迁移时的字段校验。
- 批 4（节点数据化）不改 S 结构，S 字段保持现状。
