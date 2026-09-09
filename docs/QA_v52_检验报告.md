# QA_v52 职业系统深化工程 · 检验报告

版本：v52（在 v51 基础上：2840 节点 / 专长树 162 / 双轴已落地）
日期：2026-09-07
权威源：`game.html`（7,237,666 字节）
开工备份：`backup\game_v52_before_deep.html`（= v51 完成态 7,056,273 字节）

---

## 一、开发范围（v52 口令四方向）

| 方向 | 内容 | 状态 |
|------|------|------|
| A 专长实战化 | 判定钩子 + FEAT_EFFECT_V52 映射表 + 判定横幅 | ✅ 完成 |
| B 职业组织线 | ORG_V52 九组织 × 5 任务链 + 声望/晋升/面板 | ✅ 完成 |
| C 神位争夺 | RIVALS_V52 九职业竞争者（2名/职业）+ 四重试炼链 + 结局对接 | ✅ 完成 |
| D 巅峰盘+神器 | PEAK_V52 27 树×5 节点 + ARTIFACT_V52 九件神器 + 联动 | ✅ 完成 |

用户硬约束执行确认：
- ✅ 禁止扮演度/扮演法：未引入任何"践行信条积累扮演值"机制；JOBS.criterion 仅描述文本
- ✅ 禁止兼职/双职业：未引入第二职业槽；种族转职/深渊变体为职业形态，保留
- ✅ 只有神明可改变职业：S.deified 登神是唯一职业变更通道（本版仅设神座归属，未做换职玩法）

---

## 二、方向明细

### A 专长实战化
- `v52_featApply(opt, t)`：包装 effTarget，按场景（战斗/社交/探索/修炼/交易）叠加修正
- 修正类型：bonus（±骰值）/ floor（保底）/ reroll（重掷取高，choose 判定段消费）
- FEAT_EFFECT_V52：93 条（66 专长 + 27 巅峰），每职业 7-8 条专长映射
- `v52_breakthroughBonus(part)`：修炼场景 mind/root 两路成功率修正
- writeDice 追加"【专长】"金色横幅行（200ms 窗口，不改变原判定数字格式）
- 验证：带专长 50→52（+2 修正+label）；无专长 50 不变；修炼 root+4；巅峰映射命中（40→43）

### B 职业组织线
- ORG_V52 九组织：元素学院/晨曦圣殿/锻造公会/战神团/誓约骑士团/荒野巡守/暗影阁/圣辉教会/金衡商会
- 每组织：motto/power/leader/ranks（学徒/执事/席主/首席 5 阶）/entry/5 任务链
- 声望门槛：rank2=30（b 任务）、rank3=40（c 任务）、rank4=60（d 任务首席）
- 晋升奖励：b→rank2 +1 专长点；c→rank3 +1 巅峰点；e 任务→神器线索（pt:1）
- 组织面板：顶栏「🏛组织」按钮 + 修行面板「⛰巅峰盘」「⚔神器」按钮
- 验证：入会（rank1/rep10）→ 任务 a 走通（rep 10→34，S.orgDone 标记）→ 任务列表按位阶显示

### C 神位争夺
- RIVALS_V52：9 职业 × 2 名竞争者（contentC 首名 + contentC2 次名，含 trial_text/t/defeat）
- 试炼四重：力量（3 重多重判定）→ 心性（双轴分支：神性/深渊影响）→ 对决（每位竞争者一关，rollD100 vs t）→ 登神
- 登神成功：S.deified=1、S.godTrial[job]="deified"、endingFlags 写入（v52_deified/v52_deifiedJob/v52_orgRank/v52_godRivalFate）
- 竞争者对决独立入口 `v52_rivalFight(rivalId)`（境界≥5 后剧情触发用）
- 验证：资格（orgRank≥3）→ 5 阶段走通（clicks=5）→ deified=1、godRival 两胜、endingFlags 全部写入、巅峰点 1→6
- 修复记录：contentC2 闭包 bug（var 共享循环末 rv → 全职业对决都写商人 id）→ IIFE-per-iteration 重写；contentC3 自动补齐首名竞争者对决 stage

### D 巅峰盘 + 神器
- PEAK_V52：27 树（9 职业 × 3 路线，与三专长树一一对应），每树 5 节点（lv/cn/desc/eff）
- 解锁：境界≥4 且组织 rank≥1；巅峰点来源：破境+1、组织 rank3 晋升+1、试炼每阶段+1
- 加点：pickPeak 前置校验（需先研习上一节）、可放下返还、eff 写属性并置 `S.peak[树id_lv]`
- 27 条巅峰判定映射（src:"peak"）接入 FEAT_EFFECT_V52
- ARTIFACT_V52 九件：碎星法杖/招魂铃/雷锤/战神断矛/白誓之盾/风语弓/夜影短刃/圣辉权杖/称心如意
- 神器任务链 5-8 步（含纯文本步与 opts 步），解锁线索=组织 rank3 奖励；获得后 `S.artifact=职业名` 并进入判定钩子
- 验证：巅峰加点 lv1→lv3 链式通过、前置阻断生效、pts 5→2；神器任务链走通（S.artifact="魔法师"）

---

## 三、构建验证结果（最终版，全部通过）

| 检查项 | 结果 |
|--------|------|
| `python _v39_extract.py` + `node --check _chk_0..5.js` | ✅ 6/6 PASS |
| `python _check_dead_links.py` | ✅ 节点 2840 / go 6357 / 死链 0 |
| 占位检查 | ✅ 仅 writeNext 兜底 1 处（允许） |
| `python _v42_build_chunks.py` | ✅ 8 分片 + NODE_MAP 2189 条 + game_chunked.html 1,707,342 字符 |
| `python _v42_verify_chunks.py` | ✅ 缺失 0 / 多余 0 / 死链 0 |
| `python _v42_chk_syntax.py` | ✅ 15 JS 全部 PASS |
| 三路同步 | ✅ game.html = game_check.html = 7,237,666 B；index.html = 2,684,464 B |

## 四、浏览器回归结果（bu 平面，file:// 环境）

| 回归项 | 结果 |
|--------|------|
| 页面加载 | ✅ 0 新错误（仅既有 3 条 [V35] Module not found: core，v50 备份已有） |
| v52 数据完整性 | ✅ FEAT_EFFECT_V52=93；九组织齐；竞争者 9×2；巅峰 27 树/135 节点；神器 9 件 |
| 专长判定 | ✅ 带/不带专长同判定对比正确 + "【专长】"横幅 |
| 组织线 | ✅ 入会→任务 a 走通→声望/位阶/任务完成标记正确 |
| 竞争者 | ✅ 境界/资格后试炼对决逐位出现，胜败写入 S.godRival |
| 神座试炼 | ✅ 资格校验→四重试炼全通→S.deified=1、endingFlags 正确 |
| 巅峰盘 | ✅ 面板/树/加点/前置阻断/放下返还正常 |
| 神器 | ✅ 面板/任务链/S.artifact 生效 |
| 旧档兼容 | ✅ v52_ensureDefaults 全字段兜底（orgRep/orgRank/peakPts/peak/deified/godRival/endingFlags/godTrial/orgDone/rivalDone） |

## 五、存档兼容
- localStorage 主键 `elda-qunxiong-v3-save` 不变
- S.saveVersion 保持 48（与 v50/v51 一致）
- 新字段全部由 v52_ensureDefaults（先调 v51_ensureDefaults）兜底，旧档零报错

## 六、修复记录（本轮）
1. contentA 注入裸对象缺 `FEAT_EFFECT_V52.push(...)` → _v52_fixA.py 包裹 66 条
2. PEAK_V52 职业对象未初始化 → _v52_fixB.py 27 处加 `|| (PEAK_V52[job]={})`
3. contentC 生成时 rivals 参数为空 → 首名竞争者缺对决 stage → _v52_contentC3.py 自动补齐
4. contentC2 闭包共享循环末 rv（全职业对决误写商人）→ _v52_fixC4.py IIFE 重写
5. v52_ensureDefaults 缺 endingFlags/orgDone/rivalDone/godTrial 兜底 → _v52_engine3.py
6. 破境+1 巅峰点、试炼每阶段+1 巅峰点 → _v52_engine2.py

## 七、扩展位（预留）
- 组织任务链每组织可再扩 5-8 任务（rank4 首席后续）
- 竞争者每职业可扩至 3-4 名（RIVALS_V52[j].rivals 数组追加即可，对决 stage 由 contentC3 逻辑自动补）
- 巅峰每树可扩至 8-10 节点（PEAK_V52[job][bid].nodes 追加）
- 神器 quest 可扩展多分支结局

## 八、结论
v52 四方向全部深度落地，构建验证全绿、浏览器回归 0 新错误、存档兼容。九条职业之路已具备"专长改变打法 + 组织归属与晋升 + 唯一神座争夺 + 巅峰构筑与神器"的完整纵深。
