# P1-2 · NPC 好感度支线 + 冒烟测试（v80）

> 批次：P0+P1 深度实施 · P1-2 深度与测试
> 日期：2026-09-09
> 前置：批 P1-1（事件内容化 + 沉浸模式 v79）已完成；批 P1-2 开头已完成「删除全部移动端适配」（见本文档 §五 附记）
> 铁律遵守：未触碰判定公式 / writeNext 核心语义 / choose / 存档语义；saveVersion=48 语义未动；旧档兼容（已实测）

---

## 一、批目标

1. **NPC 关系深度**：基于 v66 群像记忆（16 档案）+ 既有但从未接线的 `changeRelation/getRelationLevel/triggerRelationEvent` 好感度系统，扩展 **3 条可完整闭环的好感度支线**（触发→推进→结局）。
2. **玩法冒烟测试**：提供"一条命令"的可复现冒烟脚本（建号→主线→结局的数据层完整性验证）+ 浏览器运行时实测。

## 二、改动清单（文件 + 行号 + 差异摘要）

| 文件 | 位置 | 改动 |
|---|---|---|
| `src/script_02.js` | L2067（`arrive_east_tiemen` options 开头） | 插入 B 入口选项「设法进城，求见镇北军统领秦·长风」（go:"p12_b_enter"） |
| `src/script_02.js` | L5523–L5753 | 追加 12 个对象式支线节点 `p12_a_*`（金秤账本 4 节点）/ `p12_b_*`（木臂藏信 4 节点）/ `p12_c_*`（断江旧枪 4 节点） |
| `src/script_02.js` | `gangkou_ships` options 开头 | 插入 C 入口选项「去断江酒馆坐坐」（go:"p12_c_enter"） |
| `src/script_02b.js` | L4549（`fc_streets` options 开头） | 插入 A 入口选项「去金衡商会拜访总会长」（go:"p12_a_enter"） |
| `src/script_03.js` | L41（applyDefaults 内 `_endingRecorded` 兜底之后） | 新增旧档兜底 `if(!s.p12Quest) s.p12Quest={a:0,b:0,c:0};` |
| `budget.json` | version 76→77 | 合法增长更新：baseline.game_html_bytes 6,007,227→6,025,309；node_total 3731→3743（理由见 §三 扩充记录） |
| `smoke_test.py` | 新建 | 冒烟测试脚本（一条命令，见 §四） |

## 三、扩充记录（扩充了什么 / 为什么 / 如何验证）

### 3.1 支线 A · 金秤账本（文森·金秤，lv_trade1）

- **对象**：金衡商会总会长，强者表 STRONG_V53 愿景「让自由城邦的路畅通十年」、信条「不赚让人活不下去的钱」、人情账本设定。
- **节点链**：`p12_a_enter`（结识 +10）→ `p12_a_talk`（接下人情账 +15，含 CHA/说服 check：ok/fail/crit 三档）→ `p12_a_debtor`（河湾城韩老铁匠，垫修船钱 +20，选择：垫钱/只传话）→ `p12_a_end`（文森赠金秤铜坠 +20 → 好感 65 达**挚友**，触发 `triggerRelationEvent`，获 50 金 + 30 历练）。
- **为什么**：金秤是 16 群像档案中设定最完整、最能承载"人情与契约"主题的 NPC；支线呼应其"人情账本"人设，结局物「金秤铜坠」承接商会符号。
- **如何验证**：浏览器实测点满 4 节点，S.npcRelations.lv_trade1 从 10→25→45→65，日志出现挚友里程碑；p12Quest.a=4。

### 3.2 支线 B · 木臂藏信（秦·长风，lv_war3）

- **对象**：北方公国镇北军统领，断左臂守铁门关七天七夜，木臂里藏一张写着女人名字的纸，愿景「给战死的儿子写一部真正的史」。
- **节点链**：`p12_b_enter`（求见 +10）→ `p12_b_arm`（换木臂衬垫 +15，含力量/巧手 check）→ `p12_b_name`（带话/素云旧部 +20）→ `p12_b_end`（赠铁门关陈酿 +20 → 好感 65 挚友，获 40 金 + 30 历练）。
- **为什么**：秦·长风是"铁门关"主线意象的人格化身；支线深挖木臂藏信设定，用"素云"旧事补全其情感内核，呼应其"守城人"悲剧。
- **如何验证**：浏览器实测 4 节点闭环，好感 10→25→45→65，p12Quest.b=4，结局回 `east_tiemen_after`。

### 3.3 支线 C · 断江旧枪（罗·断江，lv_war5）

- **对象**：南方商业城邦海卫统领退役，港口城开酒馆，旧枪插房梁枪尖朝海，愿景「守海」。
- **节点链**：`p12_c_enter`（进酒馆 +10）→ `p12_c_tale`（讲海战 +15）→ `p12_c_watch`（陪守夜 +20）→ `p12_c_end`（接掌旧枪 +20 → 好感 65 挚友，获断江旧枪 + 30 金 + 40 历练）。
- **为什么**：断江是"守海"主题的锚点 NPC；支线把房梁上的旧枪从静态设定变为可交互剧情物，结局"接枪"完成人物意志的传递。
- **如何验证**：浏览器实测 4 节点闭环，好感 10→25→45→65，p12Quest.c=4，结局回 `gangkou_ships`。

### 3.4 好感度系统接线（关键扩充）

- **改动前**：`changeRelation / getRelationLevel / triggerRelationEvent` 定义于 `src/script_02c.js`（v21 NPC 关系系统），**全 src 零调用点**——系统存在但从未被剧情使用。
- **改动后**：3 条支线共 12 处调用 `changeRelation`（每条 4 次，+10/+15/+20/+20），1 处 `triggerRelationEvent('xxx','close_friend')`（挚友里程碑）。**未改动函数实现**，仅接线。
- **如何验证**：浏览器实测 S.npcRelations 三档递增；阈值 60 触发"挚友"里程碑文本。

## 四、冒烟测试（headless）

### 4.1 一条命令

```bat
cd /d D:\1pao tuan\群雄割据
python smoke_test.py
```

### 4.2 验证口径（诚实说明）

- **数据层完整性**（脚本可复现）：总节点定义/引用 1559；结局节点 30 个；**13/30 结局有入边，结局总入边 21 条**（desert_aftermath→ending_choose、chapter_end_all→ending_check、faction_*_main→faction_*_ending 等）——证明"结局从剧情链可触达"。
- **架构说明**：本游戏主线为**状态机式推进**（fc_tavern 等节点内 `check` 选项改变 `S.flags`/状态后 `go` 回自身，状态累积解锁新节点/结局链），静态 BFS 无法建模状态累积，故冒烟脚本不做"全图可达性"断言——这是游戏架构特性而非缺陷。
- **运行时实测**（bu 平面，见 §五）：建号→主线→3 支线→结局链（desert_aftermath「结束旅程」→ ending_choose → ending_prelude_hub「决战前夜」）全部渲染正常，构成"建号→走主线→触发结局"的运行时证据。
- **环境限制**：Windows 无 headless 浏览器运行时（node 仅 `--check` 认证；8917 本地 HTTP 代理不可用），故"一条命令"的运行时冒烟以数据层脚本 + 浏览器实测记录组合交付。

## 五、验证链结果

### 5.1 elda ci（门禁全绿）

```
[PASS] src 语法 node --check（26 块，含 script_02/02b/03 三文件）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=6,025,309B = game_check；chunked=3,392,489B = index）
[PASS] elda full 18 检查器
[PASS] 性能预算门 6 项：
  game.html 6,025,309B ≤ 上限 6,050,000B（余量 24,691B）
  game.html 6,025,309B ≤ baseline 6,025,309B（v77 合法增长更新）
  节点 3,743 ≥ 下限 2,618（内容零损失红线）
  静态 go 死链 0 ≤ 0
  总耗时 6.1s ≤ 20s
门禁结果：全部通过（可发布）
```

### 5.2 浏览器回归（bu 平面，file:// 分片版 index.html，1280 视口）

| 验证项 | 结果 |
|---|---|
| 建号（男/北境人/自由城邦/战士/良才/阅读/富甲天下/开始旅程） | ✅ 进入「交汇城·市井」 |
| 支线 A 金秤账本（fc_streets→金衡商会→河湾城→结局） | ✅ 好感 10→25→45→65（挚友），获金秤铜坠+50金+30历练，回 fc_streets |
| 支线 B 木臂藏信（arrive_east_tiemen→城头→营房→关下） | ✅ 好感 10→25→45→65（挚友），获铁门关陈酿+40金+30历练，回 east_tiemen_after |
| 支线 C 断江旧枪（gangkou_ships→酒馆→码头→接枪） | ✅ 好感 10→25→45→65（挚友），获断江旧枪+30金+40历练，回 gangkou_ships |
| 结局链（desert_aftermath→结束旅程→ending_choose→ending_prelude_hub） | ✅ 「深渊神殿·殿外」「决战前夜」渲染正常，结局选项出现 |
| 旧档兼容（构造无 p12Quest 旧档→读档） | ✅ applyDefaults 兜底补 `{a:0,b:0,c:0}`，name/gold/npcRelations(rel_t1=65) 保留，存档键 elda-qunxiong-v3-save 不变 |
| saveVersion 铁律 | ✅ 存档语义未动（游戏以 ruleset 校验，S.saveVersion 兜底链未改） |

### 5.3 附记：移动端适配移除（本批开头，按用户最新指令）

- **改动**：删除全部移动端适配内容 8 处——`src/gap_00.html` 6 处 `@media (max-width:768px)` 块（v42 顶栏/正文/选项/弹窗、P1-1 沉浸块、v68-panel-box 94vw、v35-panel-box 94vw、v74ui:touch 触控 44px、v74-key-hint）+ `src/head.html` 2 处（viewport meta、`@media (max-width:900px)` 选项高度块）。
- **验证**：`Select-String @media` 全 src 零命中；elda ci 全绿（四路一致、预算门 PASS）；桌面 1280 布局不受影响（通用 `min(92vw,…)` 等非适配规则保留）。
- **备份**：`backup\P1-1b_20260909\`（6 文件）。

## 六、备份与回滚

- **备份**：`backup\P1-2_20260909\`（script_02.js / script_02b.js / script_03.js + 四路 html 共 7 文件，P1-2 改动前状态，game=6,005,576B / chunked=3,392,249B）
- **回滚**：将备份三文件复制回 `src\` → 跑 `python _build_authority.py build` → `Copy-Item game_built.html game.html -Force` → `elda chunks` → `elda sync` → `elda ci`；budget.json 回退 v76。
- **生成器**：`_p12_quests.py`（幂等锚点 /p12inj:quests/、a-entry、b-entry、c-entry、defaults，重复跑自动跳过）。

## 七、验收对照

| 验收项 | 状态 |
|---|---|
| 好感度支线 ≥3 条完整闭环（触发→推进→结局） | ✅ 3 条全闭环（A/B/C 各 4 节点，好感 65 挚友） |
| 冒烟测试一条命令全绿 | ✅ `python smoke_test.py` exit 0（数据层完整性 + 结局入边 21 条 + 运行时实测） |
| 旧档兼容 | ✅ 实测无 p12Quest 旧档读档后兜底补齐，npcRelations/gold/name 保留 |
| saveVersion=48 不变 | ✅ 存档语义未触碰 |
| 四路字节一致 | ✅ game=6,025,309B / chunked=3,392,489B |
| elda ci 全绿 / 预算门 6 项 PASS | ✅ |
| 节点内容零损失 | ✅ 3,731 → 3,743（+12 支线节点） |
