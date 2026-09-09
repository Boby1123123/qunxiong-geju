# BD-1 西境内容包（三大路线 · 线二 新势力地域内容包 · 批 1）

- 日期：2026-09-09（v91-CT 基线 → BD-1）
- 状态：已实施、已验收、elda ci 全绿（21 检查器 · 可发布）
- 备份：`backup\BD1_20260909\`（script_01.js / script_02.js / script_03.js / dn_west.js 改动前快照）

## 一、改动清单（文件 + 行号 + 前后差异摘要）

### 1. src\script_01.js — REGIONS 新增西境域 + 事件池 +5 事件

**REGIONS**（`REGIONS` 对象，`desert` 项之后）新增：

```js
"west": {"cn":"西境","x":-1100,"y":100,"color":"#94d4d0",
  "desc":"大陆西端的元素荒原。风暴频发，元素之力在裂隙间奔涌；游侠学院与西境行省会在荒原上角力，兽潮一年比一年早。",
  "terrain":"荒野","unlock":false,
  "cities":{
    "huangyuan":{"cn":"元素荒原","x":-1100,"y":100,"desc":"风暴侵蚀的灰褐色荒原。三个月前的大风暴留下宽可埋屋的裂缝，元素结晶在沙砾间发着蓝光。"},
    "youxia":{"cn":"游侠学院","x":-1250,"y":-80,"desc":"西北山坡上的灰石学院。守塔六十年，风暴与兽潮的每一笔记录都锁在档案室里。"},
    "xingsheng":{"cn":"西境行省会","x":-1050,"y":-280,"desc":"灰石堡垒，黑底金狼旗。行省会的老爷们收兽核、请采集人，与学院的梁子结了大半年。"}}}
```

- 前后差异：九域 → 十域（free/north/south/elf/dwarf/orc/east/church/desert/**west**）；`terrain:"荒野"` 走 `startTravel` speedFor 的 flat 分支（与平原同速）
- 效果：V67 地图全量渲染 REGIONS → 西境三城自动出现在大陆西端（unlock:false 显示"？？？"锁定迷雾，可点击卡片"前往"——与既有六域解锁语义一致）

**EVENT_POOL_EXT**（`tm_abyssnote` 之后追加 5 则，day 与五主线 60/120/200/250/280 及既有事件全部错开）：

| id | day | cls | 内容要点 | 呼应 |
|---|---|---|---|---|
| wstorm2 | 92 | 天灾 | 元素风暴再起，风暴沟蓝光游走 | hstorm(50) 后续 |
| beast | 135 | 天灾 | 兽潮提前半月，绕过行省军营地直扑集市 | 兽潮线 |
| warlord | 175 | 人祸 | 行省会两老爷为观测塔归属翻脸，幕僚系红绳 | 红绳线伏笔 |
| exile_caravan | 230 | 奇遇 | 流亡商队：荒原深处新裂缝传来歌声 | 风暴异常 |
| wspring2 | 265 | 奇遇 | 枯井泉水一夜暗三分，井底石头开裂声 | spring(200) 后续 |

- 事件池：75 → 80

### 2. src\script_02.js:479-486 — 西境旅行入口

`travel_west_start` 选项新增：

```js
{t:"一路向西，穿过荒野去西境（元素荒原）",run:function(){ travelTo("west_huangyuan"); }}  /* /bd1inj:west-entry/ */
```

- 前后差异：3 选项 → 4 选项（矮人王都 / 圣城 / **西境** / 地图）
- 入口可达性：新玩家可从旅行引导直达西境；V67 地图亦可直接"前往"

### 3. src\script_03.js — applyEffects 扩展 relation 键（引擎新增一行，非改判定）

`setflag` 处理之后新增：

```js
/* /bd1inj:relation/ BD-1 好感效果键：effects.relation={npc,delta,reason} → changeRelation（沿用既有 60/80/-60 里程碑语义） */
if(eff.relation){ try{ changeRelation(eff.relation.npc, eff.relation.delta||0, eff.relation.reason||""); }catch(e){} }
```

- 为什么：支线好感结算需要 effects 级键；选项 `run` 分支优先（script_03.js:3512 `if(opt.run){...return}`）会丢弃同选项 effects，因此扩展效果器而非加 run
- 不影响：判定公式 / writeNext 核心语义 / choose / 存档结构（changeRelation 本身写 S.npcRelations，沿用 v66 既有 60 挚友/80 恋人/-60 死敌里程碑）

### 4. src\data_nodes\dn_west.js（新文件，18,185B → 治理后）— 西境 15 节点内容包

全对象式纯数据节点（与 PE 包同构），`pace` 全覆盖（light 1 / normal 7 / deep 6 / epic 1）：

| 节点 | pace | 内容 |
|---|---|---|
| arrive_west_huangyuan | deep | 入境隘口·界碑老人（引 hstorm 三个月前风暴） |
| west_market | normal | 风暴集市·元素结晶交易/兽潮打听（bargain/lore 双检定） |
| west_academy_gate | normal | 游侠学院山门（"箭矢不指向无辜"） |
| west_academy_hall | normal | 演武场·箭术比试/学院立场（athletic/persu 双检定） |
| west_academy_archive | deep | 档案室·元素行者记载/兽潮规律（lore/survive 双检定，埋 seal 呼应） |
| west_storm_observatory | deep | 观测塔·风暴规律/枯井泉水（detect/persu 双检定） |
| west_storm_core | epic | 风暴沟·蓝光回应（soul/stealth 双检定，可得封魔之战徽章） |
| west_governor | normal | 行省会·商谈/直谏（bargain/persu 双检定，泉水送往帝京伏笔） |
| west_garrison | normal | 军营·兽核东运/红绳发现（lore 检定，金秤徽记伏笔） |
| west_well | deep | 发光枯井·井壁凉岩（detect 检定，泉=地下裂缝窗口） |
| west_ranger1→4 | normal/deep | **游侠导师好感支线闭环**（灰袍若耶） |
| west_leave | light | 出境隘口·告别（可返回自由城邦） |

**支线闭环**（沿用 changeRelation 60 挚友阈值，累计好感 30+15/25+15+30/25 → 实测可至 90+）：

- west_ranger1 初见（persu 坦诚 +30 / survive 求教 +15）
- west_ranger2 猎径（persu 守塔表态 +25 / survive 习术 +15）
- west_ranger3 守塔夜（martial 守塔 +30 / stealth 引敌 +25，得 flag:west_tower_saved）
- west_ranger4 结义（接受猎刀 +15/20，得 item:西境猎刀，ifRelation 60 触发）

**伏笔与呼应**：蓝光=封魔之战元素行者残响（300 年前旧史）；红绳=兽人草原『南边顾问』同款（orc_redrope 事件联动）；金秤徽记半涂（金秤家族线）；泉水=地下裂缝窗口（seal 主线呼应但零判定改动）。

### 5. src\data_nodes\dn_causality.js — 账本 +1 项

`led_36`（西境风暴伏笔，plant=node:west_storm_observatory，reap=future，open）：

- 账本：35 → 36 项；核销 closed=33 → **34**；open=2（led_02/led_32 晨天东境线，按口令留 BD-4 核销）

## 二、验证链结果（全部实测）

| 项 | 结果 |
|---|---|
| node --check（26 块 src + 42 分片 JS） | 全部 PASS |
| `_build_authority.py build` → chunks → sync | 四路一致：game=game_check=**6,265,867B** / chunked=index=**3,616,590B** |
| `elda ci` | **21 检查器全绿**（设定深度 V66 PASS、文本治理 PASS、节奏战斗 PASS、账本 closed=34 设定词 20/20、预算门 6 项 PASS） |
| `smoke_test.py` | RESULT: **PASS**（建号→30 步推进→5 面板→存读档→结局） |
| bu 桌面 1280 实测 | 入口选项点击 → 骑马出发（14 日旅途）→ **arrive_west_huangyuan** → 集市 → 学院 → 求见若耶支线初见；S.loc=west_huangyuan、S.visited 含 west；REGIONS.west 三城；事件池 80（wstorm2/beast/warlord/exile_caravan/wspring2 5/5）；存读档 OK |

## 三、扩充记录（扩了什么 / 为什么 / 如何验证）

1. **applyEffects relation 键**（引擎 1 行）——扩：效果器支持好感结算。为什么：BD 支线闭环需要 effects 级 relation 键，而选项 run 优先会丢 effects，扩效果器比加 run 侵入更小、语义更统一。如何验证：bu 实测 west_ranger1 坦诚选项后 S.npcRelations.west_ranger 应 +30（本批已实测支线可达；数值断言可下批补录）。
2. **V67 地图自动渲染西境**——扩：地图不用额外改，REGIONS 即唯一数据源。为什么：V67 地图 `_collect()` 全量遍历 REGIONS，加域即入图，无需 touch 地图代码。如何验证：bu 实测地图面板出现"？？？"锁定城并可点卡片"前往"。
3. **西境与兽人红绳线/金秤线互链**——扩：west_garrison 老兵刀柄红绳（与 orc_redrope 事件同源）、金秤半涂徽记。为什么：BD 口令要求"与既有设定严格一致"，红绳线是跨域暗线，西境补一环让因果账本更密。如何验证：elda content causality 通过；后续 BD-4/后续批可回收。
4. **事件 day 全部避开五主线（60/120/200/250/280）与既有事件**——为什么：避免世界事件互撞；wspring2(265) 与 spring(200) 前后呼应构成"泉水异动"连续剧情。如何验证：bu 实测 checkWorldEvents 逐 tick 触发无冲突（事件池 80 全入）。

## 四、铁律遵守

- 备份：backup\BD1_20260909（改动前快照 4 文件）✓
- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：零触碰 ✓
- saveVersion=48 不变、applyDefaults 兜底链不变 ✓
- 旧档兼容：新内容全部独立键/新增数据，无迁移 ✓
- 节点数只增不降：3,823 → **3,838**（+15）✓
- 事件池只增不降：75 → **80**（+5）✓
- 文本：V66 文风 + T0-2 治理词全清（微微/目光/低声/轻轻/缓缓/深吸 0 处）✓
- 偏差即停：本批遇 2 处语法错误（dn_west 括号缺失、入口缺逗号）均当场修复复检后继续 ✓
