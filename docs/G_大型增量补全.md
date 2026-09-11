# G 批 · 大型增量补全（伤口系统 / 技能熟练度 / 城市作息 / 渐进教学 / 世界事件连锁 / NPC 关系网回指 / 抉择回顾）

> 批次：G-1~G-7 ｜ 日期：2026-09-11 ｜ 备份：`backup\G_20260911\`
> 口令背景：用户要求将 D 系列 10 个大型方向（除 D-6 同伴/队伍系统外）全部做进游戏。经存量盘点发现 7-8 个方向已有工程地基（v35 回合制战斗 / AU-5 Web Audio 音景 / dn_festival 节日历 / dn_rel_letter 跨城书信 / dn_ng2/ng3 多周目 / AFFIX 词缀锻造 / S.equipment 战斗结算 / openAtlas 图鉴 tab / S.choices 记录 / worldState 城市风味），为避免"故事内容不能多次重复"红线，本批按**缺口定向补全 + 既有系统翻新**落地为 7 个子系统（G-1~G-7）。

---

## 一、扩了什么（数据 + 引擎 + UI 三层）

### G-1 伤口系统（新增，此前全库无 wounds）
- 数据：`S.wounds` 数组（新键，applyDefaults 兜底为 `[]`），每条 `{id, src, part, lvl(轻伤2日/重伤5日/致命10日), days, pen{str,agi,con}}`
- 引擎：`v93g1_addWound(src,part,lvl)`（≤8 条滚动淘汰）、`v93g1_woundTick`（advanceDays 每日递减，到期自动移除）、`v93g1_woundLine`（writeNext 注入"【伤势】"行）、`v93g1_healWound(idx)`（预留治疗接口）
- UI：属性总览面板新增"伤口：重伤·左臂(来源，尚需 N 日)"明细行；教学提示 day60 伤势条目
- 未接：战斗受创自动挂钩点留待战斗内容批次（接口已就位，判定零改动）

### G-2 技能熟练度（新增，此前无 skillProg 系统）
- 数据：`S.skillProg` 对象（新键，`{技能: {lvl, xp, next}}`，xp 满 lvl*10 升级）
- 引擎：`v93g2_gainProg(sk,v)`（熟练度结算）、`eff.prog`（applyEffects 新结算格式 `{sk,v}`，走既有 effects 管道，判定零改动）、ELDA.notify 推导扩展
- UI：属性总览面板新增"技能：bargain Lv3 (6/10) · survival Lv2 (5/10)"行
- 未接：现有选项暂无 prog 字段——后续内容批次在选项 effects 中加 `prog:{sk,v}` 即自动结算

### G-3 城市作息句（新增）
- 数据：`src\data_nodes\dn_hours.js` → `window.CITY_HOURS`，9 城 × 4 句市井白描（自由城/北境/东境/南境/西境/沙漠/教会/矮人/精灵/兽人）
- 引擎：`v93g3_hoursLine(node)`，仅 arrive_* 节点渲染时注入一句（按 S.region/S.loc 选城），只读注入零判定
- 实测：自由城"春雾罩着自由城，酒馆的灯笼在雾里晕成一片暖黄。"、交汇城"清晨是从叫卖声开始的"均生效

### G-4 渐进教学（新增，此前无独立 tutorial）
- 数据：`src\data_nodes\dn_tips.js` → `window.PROGRESS_TIPS`，10 条 day 阈值提示（2 行动/3 行囊/4 修炼/6 地图/8 势力/12 图鉴/20 存档/30 云存档/45 学院/60 伤势）
- 引擎：`v93g4_tipLine(node)`，day 达标且未见过时置 `S.flags["v93tip_<key>"]` 只提醒一次；`S.settings.progressiveTips` 开关（默认 true，关闭零注入）
- 实测：day2 触发"【提示】行动：顶栏的「行动」面板可探索、打听、修炼、采矿、锻造……"✓

### G-5 世界事件连锁（新增，比既有 EVENT_POOL 更重的多段链）
- 数据：`src\data_nodes\dn_wind_chains.js` → `window.WIND_CHAINS`，5 链 15 则（狼群南迁 52/90/130、商队带病 58/100/150、银号挤兑 108/140/180、禁书异响 170/220/260、边境摩擦 190/240/300），day 与五主线（60/120/200/250/280）全部错开 ≥15 天
- 引擎：`v93g5_chainTick`（advanceDays 钩子），满足 day 且未 done 时置 `S.flags["v93chain_<id>_done"]` + worldQueue 推送 + v46_maybeMissed 区域提醒；每链末则置 `v93chain_<链>_final` 供后续内容挂载
- 语义：只加 flag/事件文本，不改任何主线判定与存档结构

### G-6 NPC 关系网回指（新增玩家侧关系网，与既有 HOUSE_RELATIONS 家族网互补）
- 数据：`src\data_nodes\dn_npc_net.js` → `window.NPC_NET`，12 角色（rock/kain/alice/ata/loka/cecy/mori/elena/tie/ferman/li/tavern_owner，各含 cn 中文名 + friends/rivals + desc），兼容 NPCS/PROLOGUE_NPCS 的 cn 字段
- 引擎：`v93g6_npcNetLine(node)`，节点文本命中角色名/id 且 |npcRelations|≥30 时注入关系回指句（好友/仇敌不同语气）；只读注入，不写好感
- 用途：为后续"关系网面板 + 好感驱动支线"提供数据基座

### G-7 抉择回顾（新增玩家侧面板，此前仅注释 + S.choices 记录）
- 数据：`src\data_nodes\dn_choice_map.js` → `window.CHOICE_MAP`，11 前缀映射（origin_/fc_/branch_academy_/frontier_/grad_/anchor_/goldscale_/faction_/fs_/sp8_/ending_，各带展示名）
- 引擎：`v93_choicesBody()`（读 S.choices 按前缀分组渲染"抉择回顾 · 此生关键岔路"）+ 图鉴新 tab `['choices','抉择']`（script_05.js 两处同步：tabs 数组 + atlasTab 三元分支）
- 实测：CHOICE_MAP 11 键加载 ✓、v93_choicesBody 渲染 443 字符内容 ✓

## 二、为什么（缺口依据）
- 全库盘点（探针脚本）：`S.wounds` 0 命中、`skillProg` 无系统、无独立 tutorial、玩家侧关系网缺失、战斗胜利/掉落/野遇无独立挂钩 → 上述 7 项为**真缺口**，非重复建设
- 已有地基未重复建：战斗/音景/节日/书信/多周目/词缀/装备结算/图鉴/choices 记录/城市风味 → 本次只翻新不重造（防"多次重复"红线）

## 三、如何验证（验证链实测结果）
- `node --check` 26 块全绿
- `ci_guard.py --build`：build/copy/chunks/sync PASS → elda ci **38 检查器全绿**（含预算门，game.html=8,961,088B ≤ 9,022,353B 上限）→ smoke_test PASS → 四路字节一致（game=game_check=8,961,088B；chunked=index=6,192,298B）
- bu 桌面 1280 实测：建号全流程 → 序章推进 → 自由城日常；实测生效：行动日志容器、城市作息句、day2 教学提示、G-1 伤口接口 + 属性面板"伤口："明细、G-2 熟练度接口 + "技能："行、G-7 抉择回顾数据与渲染；旧"伤势 N 级"行共存无冲突

## 四、红线遵守
- saveVersion=48 不变；判定公式 / writeNext 核心语义 / choose / 存档结构语义零触碰
- 旧档兼容：全部新功能独立键（S.wounds / S.skillProg / S.settings.progressiveTips）+ applyDefaults 兜底
- 节点数只增不降（4,856）；五主线 day 判定零改动；V66 文风 + 30 治理词；不做移动端；不做 D-6 同伴/队伍系统（用户明确暂缓）
- 改动前备份 `backup\G_20260911\`；临时脚本归档 `backup\scripts_archive\tmp\`

## 五、改动清单（文件 + 关键位置）
| 文件 | 改动 |
|---|---|
| `src\data_nodes\dn_npc_net.js` | 新增（G-6 数据，12 角色） |
| `src\data_nodes\dn_hours.js` | 新增（G-3 数据，9 城作息句） |
| `src\data_nodes\dn_tips.js` | 新增（G-4 数据，10 条渐进教学） |
| `src\data_nodes\dn_choice_map.js` | 新增（G-7 数据，11 前缀映射） |
| `src\data_nodes\dn_wind_chains.js` | 新增（G-5 数据，5 链 15 则） |
| `src\script_03.js` | applyDefaults 兜底（wounds/skillProg/progressiveTips）；writeNext 注入 4 钩子（伤口/作息/教学/关系回指）；advanceDays 2 钩子（伤口递减/事件连锁）；ELDA.notify eff.prog；applyEffects eff.prog 结算；renderStats 伤势+技能行 |
| `src\script_04.js` | 尾部追加 v93g 模块 IIFE（G-1~G-7 全部引擎函数）；属性总览面板 9619 行后新增伤口明细 + 技能行 |
| `src\script_05.js` | 图鉴 tabs 数组加 `['choices','抉择']`；atlasTab 分支加 choices 渲染 |
| `budget.json` | 基线更新（reason：G-1~G-7 大型增量） |
