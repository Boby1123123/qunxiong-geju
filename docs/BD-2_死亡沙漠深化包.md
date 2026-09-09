# BD-2 死亡沙漠深化包（三大路线 · 线二 内容包 2）

- 日期：2026-09-09（BD-1 → BD-2）
- 状态：已实施、已验收、elda ci 全绿（21 检查器 · 可发布）
- 备份：`backup\BD2_20260909\`（script_01.js 改动前快照）

## 一、改动清单（文件 + 行号 + 前后差异摘要）

### 1. src\script_01.js — REGIONS.desert 2 城 → 5 城 + 事件池 +5

**REGIONS.desert.cities**（`shendian` 之后）新增：

| 城 | 坐标 | 说明 |
|---|---|---|
| lvzhou 绿洲集市城 | (150,-1000) | 三道沙丘环抱的集市城，水比钱硬，井见底三天 |
| yiji 古代遗迹 | (-100,-1050) | 黑沙区东缘半座石城，『第七封印·守望者立·勿启』 |
| tuoduo 驼队驿站 | (50,-960) | 北线枢纽，几十匹骆驼堵在院里等北线开道 |

- 前后差异：`bianyuan/shendian` → `bianyuan/shendian/lvzhou/yiji/tuoduo`
- V67 地图自动渲染（REGIONS 即数据源），无地图代码改动

**EVENT_POOL_EXT**（wspring2 之后追加 5 则，day 与五主线 60/120/200/250/280 及全部既有事件错开）：

| id | day | cls | 内容要点 |
|---|---|---|---|
| sand_drought | 108 | 天灾 | 绿洲集市大井三天见底，黑市夜车水一夜比一夜多 |
| sand_veil | 148 | 奇遇 | 海市蜃楼般商队——封印的『影子』 |
| sand_tomb | 188 | 奇遇 | 疯子水手石碑一夜裂缝，守墓人浇水缝又合上 |
| sand_ritual | 236 | 人祸 | 深渊神殿方向夜半鼓声，黑沙区沙面出现圆形痕迹 |
| sand_wellcolor | 274 | 奇遇 | 集市井水发白带咸——盐湖的水渗过来了 |

- 事件池：80 → **85**
- 与 seal 主线联动：全部事件是"封印松动的征兆"文本，**零判定改动**（seal 主线 day200 逻辑不变）

### 2. src\data_nodes\dn_desert.js（新文件，17,889B）— 沙漠 16 节点内容包

全对象式纯数据节点，pace 全覆盖（light 1 / normal 4 / deep 10 / epic 1）：

| 节点 | 内容 |
|---|---|
| arrive_desert_lvzhou | 绿洲集市城入境（deep，缺水氛围 + 封印石板伏笔） |
| desert_lvzhou_market | 黑市·水价/夜车线索（bargain/detect 双检定） |
| desert_water_crisis | 水井广场夜乱·石驼立威（persu/stealth 双检定） |
| desert_sandstorm | 沙暴·避风/求生（CON/AGI 生存双检定） |
| arrive_desert_tuoduo | 驼队驿站入境 |
| desert_tuoduo_inn | 驿站酒馆·白驼现身 |
| desert_caravan1→4 | **白驼支线闭环**（初见/北线/风口/银水壶托付） |
| arrive_desert_yiji | 古代遗迹入口（第七封印石刻 + 西境风暴沟壁画呼应） |
| desert_ruins | 遗迹大厅·壁画（银水壶与壁画同源细节） |
| desert_seal_watch | 封印节点观察（epic，玩家记录松动迹象，不动封印） |
| desert_cultist | 深渊教团三人在暗廊（尾随/撤离，标志性伤疤伏笔） |
| desert_guardian | 守墓人·墓园（疯子水手/先知信伏笔） |
| desert_leave | 离开沙漠（三向出口） |

**白驼支线闭环**（好感 85 实测）：初见坦诚/论商（+25/+15）→ 北线押货/追问（+15/+flag）→ 风口护队/追夜车（+20/+flag）→ 银水壶托付（+25，得 item:银水壶、flag:desert_baituo_line）→ 直达封印观察节点。NPC id=`desert_baituo`（白驼）。

**伏笔与呼应**：第七封印柱松动（seal 主线同源呼应零判定改动）；夜车竖瞳记号（韩水手线呼应）；银水壶=壁画里那把（封印旧史）；盐湖渗水=西境枯井泉水（wspring2 呼应）；疯子水手（韩水手线收束）；先知信/竖瞳火漆（desert_oasis 既有蒙面行者线呼应）。

### 3. src\data_nodes\dn_causality.js — 账本 +1 项

`led_37`（沙漠第七柱松动伏笔，plant=node:desert_seal_watch，reap=future，open）：

- 账本：36 → **37** 项；closed=34；open=3（led_02/led_32 待 BD-4 + led_37 新埋）

### 4. src\script_02.js:2280 — 沙漠入口挂载

`arrive_desert_bianyuan` 选项前新增：

```js
{t:"先去北边的驼队驿站歇脚",run:function(){ travelTo("desert_tuoduo"); }}  /* /bd2inj:desert-entry/ */,
{t:"去绿洲集市城看看水的行情",run:function(){ travelTo("desert_lvzhou"); }},
```

- 前后差异：3 选项 → 5 选项（出身沙漠/打听消息/直进黑沙区 + **驿站/集市**）
- 沙漠出生玩家与外来玩家均可在边缘绿洲直达新内容

## 二、验证链结果（全部实测）

| 项 | 结果 |
|---|---|
| node --check（26 块 src + 42 分片 JS） | 全部 PASS |
| `_build_authority.py build` → chunks → sync | 四路一致：game=game_check=**6,307,273B** / chunked=index=**3,658,085B** |
| `elda ci` | **21 检查器全绿**（设定深度 V66 PASS、账本 37 项 closed=34、文本治理 PASS、预算门 6 项 PASS） |
| `smoke_test.py` | RESULT: **PASS**（建号→状态机推进→存读档→结局触发） |
| bu 桌面 1280 实测 | 建号（人类/中境人/自由城邦/战士/良才/狩猎/探寻真相）→ 骆驼 25 日旅途 → **arrive_desert_tuoduo**（S.loc=desert_tuoduo）→ 酒馆 → 白驼初见 → 北线押货 → 风口护队 → **银水壶托付（好感 85 > 60 挚友）** → 封印节点观察（desert_seal_watched flag）→ 遗迹入口（第七封印石刻）→ 存档 2455B ✓；REGIONS.desert 5 城、事件池 85（sand_ 5 则 day/cls 正确）、REGIONS.west 3 城不回归 |

## 三、扩充记录（扩了什么 / 为什么 / 如何验证）

1. **沙漠 3 新城市 + 16 节点**——扩：口令要求 4-5 城，实现 5 城（含原有 2 城）；节点上限内做满。为什么：沙漠原只有"边缘绿洲→黑沙区→神殿"单线，缺乏中转与支线空间。如何验证：bu 实测驿站/遗迹/封印观察全可达。
2. **白驼支线 4 节点闭环 + 银水壶道具**——扩：口令要求商队首领/守墓人支线，实现商队首领完整闭环 + 守墓人互动节点。为什么：商队首领线承载"封印根"关键设定，闭环后直达封印观察节点形成叙事回路。如何验证：bu 实测好感 85、flag 与道具落位。
3. **applyEffects relation 键沿用**（BD-1 引擎扩展）——支线好感全走 effects.relation；实测 fail 分支也结算选项级 effects（引擎既有行为：effects 与 tier 结果无关）。已记录：若后续要求"失败不给好感"，需在选项 run 内按 tier 分支（本次不改，避免触碰选项语义）。
4. **封印脉动事件 5 则（天灾/奇遇/人祸交错）**——扩：口令要求 4-6 则，实现 5 则；day 与五主线全部错开。为什么：让沙漠在 108-274 日持续有"封印在松"的世界感，与 seal day200 主线构成"征兆→爆发"节奏。如何验证：bu 实测事件池 85 全入、day/cls 正确。
5. **遗迹壁画/银水壶/西境风暴沟壁画互文**——扩：三处视觉记忆串联（西境蓝光=元素行者、沙漠壁画=封印根、银水壶=壁画同源）。为什么：呼应 CM 连续性机制，让跨域文本产生"读者记得"的回响。如何验证：elda content causality 通过；文本中显式互引。

## 四、铁律遵守

- 备份：backup\BD2_20260909 ✓；临时脚本（_bd2_inject.py）用后删除 ✓
- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：零触碰 ✓
- saveVersion=48 不变、applyDefaults 兜底链不变 ✓
- 旧档兼容：新内容全独立键/新增数据 ✓
- 节点数只增不降：3,838 → **3,854**（+16）✓
- 事件池只增不降：80 → **85**（+5）✓
- seal 主线判定零改动：bu 实测主线 day 触发路径未触碰 ✓
- 文本：V66 文风、治理词清零（正文 6 词 0 处；注释已去掉词表避免检查器误扫）✓
- 偏差即停：本批遇 2 处问题（事件注入缺逗号 / 注释治理词表被 V66 检查器扫到）均当场修复复检后继续 ✓
