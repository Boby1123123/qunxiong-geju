# UPG-16 西幻体系深化（种族/职业/魔法数据驱动）

> 批次：UPG-16｜优先级：P2｜依赖：UPG-01/04｜状态：✅ 已实施（elda ci 第 37 检查器）

## 做了什么

借鉴 CoffeeMud 48 职业/10 种族数据驱动 + Choice of the Vampire 技能轴，深化西幻体系。

### 种族特长（新文件 `src\data_nodes\dn_races.js`）
`RACE_TRAITS` 6 族（人类/精灵/矮人/兽人/半身人/北境人），每族 `{desc, traits[2], loreKeys}`。引擎 `v92_raceShown()` 建号后首次渲染播报血脉特长（flag 防重复，旧档兼容）。属性修正沿用 PROLOGUES.startBonus（本表不重复加属性，不碰公式）。

### 法术体系（新文件 `src\data_nodes\dn_spells.js`）
`MAGIC_SPELLS` 12 法术四系（元素/神圣/深渊/秘术），每条 `{id, school, name, manaCost, comps, chant, effect}`（成分/吟唱/效果，CoffeeMud 配方模型）。`v92_openSpellbook()` 法术书面板——工具栏「📖 法术」按钮打开，按系分列展示配方与法力消耗，按玩家当前 S.mp 显示可施/不足状态。法力沿用战斗系统既有 S.mp。

### 职业事件池（新文件 `src\data_nodes\dn_job_events.js`）
`JOB_EVENTS` 18 条（9 职业 × 2），`v92_scanJobEvents()` 并入渲染钩子扫描：S.job 匹配 + day 到达 + 未触发 → 播报（职业权重差异落地为职业专属事件，不触碰 EVENT_POOL_EXT 176 事件与 checkWorldEvents）。

### 阵营态度文本变体（新文件 `src\data_nodes\dn_camp.js`）
6 个阵营感知节点（长街/茶馆/集市/旧神殿/行会/夜巷），`v92_campFlags()` 按 S.rep（≥70 民望 / ≤30 恶名）维护 flag，驱动 ifFlag 变体——同一场景按声望看到不同正文。入口挂 fc_tavern（+1 选项，既有选项零改动）。

### 检查器 c_fantasy（elda ci 第 37）
种族表 ≥6 族带 traits / 法术 ≥12 且四系齐 / 职业事件 ≥15 且 day 与五主线错开 ≥5 天 / 阵营节点 6 个 + 入口 / 引擎 4 API + 按钮——不改变既有 36 项行为。

## 为什么

原游戏种族差异仅体现在出身 startBonus 与开头文本；职业仅影响初始技能；魔法散落在战斗技能里没有体系展示。数据驱动后：种族有血脉叙事、职业有专属世界事件、魔法有四系配方书、声望影响 NPC 态度正文——四项均不触碰判定公式，纯数据+渲染层。

## 如何验证（已完成）

- `node --check`（26 块）PASS；build→Copy→chunks→sync 四路一致（game=8,445,317B / chunked=5,678,426B）
- `elda ci` 37 检查器全绿（c_fantasy 首跑发现 je_war_levy=64/je_knight_crusade=198 与五主线冲突 → 修为 68/208 后全绿；预算门 6 项 PASS）
- `smoke_test.py` PASS
- 验证点：建号后种族特长播报 1 次；fc_tavern → 长街变体按 rep 切换；职业事件按 job 触发；法术书按钮开面板

## 扩充记录

- 扩了什么：6 族特长 + 12 法术配方 + 18 职业事件 + 6 阵营变体节点 + 法术书面板 + 第 37 检查器。
- 为什么：CoffeeMud 数据驱动深度——让种族/职业/魔法/阵营成为可感知的系统而非背景设定。
- 如何验证：ci 37 项全绿 + 建号实测种族播报 + fc_tavern 阵营入口实测 + JOB_EVENTS 触发实测 + 法术书面板实测。
