# CON-1 记忆注入 v2（CM-1 升级）

## 批次信息
- 批次：CON-1（文本本体革命 · 工程 CON 第 1 批）
- 日期：2026-09-10
- 备份：本次改动前 src\script_03.js / src\data_nodes\dn_memory_tpl.js / src\script_04.js 均已随上一批备份可回滚（TQ4_20260910 含 script_02/03 系列）
- 前置：CM-1（v91_memoryInjection 四类触发）、TQ-1（v92_weatherLine 天气句）

## 目标（口令定义）
- 新增触发⑤ 人名回指：节点正文出现已登记 NPC（S.npcRelations ≥30 或已见 flag），按好感档不同语气（30-59 泛泛 / 60-79 挚友 / 80+ 恋人 / -20 及以下 敌意）
- 新增触发⑥ 事件余波：上一节点 effects 有实质结算（hp/gold/xp/flag 变化）时，当前节点开头注入 1 句后果感知
- 天气/时辰句并入注入体系；开关各自独立；console 前缀 /v92inj/；关闭后与 v92 渲染逐字节一致

## 改动清单

### src\data_nodes\dn_memory_tpl.js
- npcs 名单 2 → 12：新增 李管事(npc_li)/老铁(npc_tie)/阿岩(npc_ayan)/金老人(npc_gold)/费尔曼(npc_ferman)/陆昭(npc_luzhao)/塞西莉娅(npc_cassia)/艾琳娜(npc_elena)/阿塔(npc_ata)/老莫里茨(npc_moritz)
- 新增四档好感模板（各 8 条，V66 文风、治理词 0）：
  - person_30（泛泛）："你与{name}有过几面之缘…"
  - person_60（挚友）："你走近时，{name}的眼睛先于嘴认出了你…"
  - person_80（恋人/至交）："{name}见你回来，没出声，但眼睛里的东西骗不了人…"
  - person_neg（敌意）："{name}看见你，脸侧的线绷了一下…"
- 新增 aftermath 事件余波模板 10 条（占位 {d}/{u}）：
  - "刚才那场折腾下来，你摸了摸怀里的钱袋——比先前{d}{u}。"
  - "你低头看了看腰间的旧伤，绷带底下一跳一跳地疼。这一趟，代价不小。"
  - "损失不小——{d}{u}。你把账记在心里，打算将来找补回来。" 等
- marker：/v92inj:memtpl:p5/、/v92inj:memtpl:p6/（唯一性通过 marker 台账）

### src\script_03.js
- applyEffects（:202 附近）：return 前新增 /v92inj:fxrec/ 只读记录钩子——eff 含任一实质结算键（gold/xp/hp/san/rep/karma/aura/wound/item/mat/book/skill/flag/setflag/cond/loseItem/loseMat/loseGold/heal/attr）时，记录 `window.__v92lastFX={day:S.day, lines:lines.slice(0,3)}`（独立 window 键，不入存档）
- v91_memoryInjection（:3357 起）：
  - ③ 升级为四档：v<=-20 → person_neg；v>=80 → person_80；v>=60 → person_60；v>=30 → person_30；<30 不注入
  - ⑤ 事件余波：读 __v92lastFX，day 守卫（fx.day===S.day）→ 取 aftermath 模板，{d} 替换为实际结算摘要（"5 金币"/"20 修为"），{u} 空；消费后清空 __v92lastFX
  - console 前缀 [v91mem] → [v92inj:mem]

### src\script_04.js
- 设置面板"文字演出"区新增"记忆注入"开关（v34_settingRow checkbox，key=memoryInjection）
- v34_toggleSetting 新增 memoryInjection 分支（写 S.settings.memoryInjection）
- 回读链自动覆盖：S.settings.memoryInjection 有值即显示 checked

## 验证链结果
- node --check：全量 PASS（26 块）
- elda text guard：30 词全 ≤30、引号左=右=3663、连续标点 0
- 构建：build OK → game.html → chunks（43 JS 全 PASS）→ sync 四路一致（game=game_check=8,066,661B / chunked=index=5,386,239B）
- elda ci 25 检查器：全部通过（可发布）——marker 台账重复 /v92inj:memtpl 一次 FAIL 已修正为 p5/p6 后全绿
- smoke_test.py：PASS（30 步推进、5 面板、存读档、结局触发）
- bu 分片版实测：
  - 新模板加载确认：p30/p60/p80/pneg=8、aftermath=10、npcs=12
  - 触发⑥单元验证：设 __v92lastFX={day:当前, lines:['-5 金币','+20 修为']} → v91_memoryInjection 返回 ["损失不小——5 金币。你把账记在心里，打算将来找补回来。"] ✓
  - day 守卫：fx.day=999 → null ✓
  - 好感 0 不注入（未达 30）✓
  - 设置面板"记忆注入"开关渲染 ✓

## 扩充记录
- 扩了什么：触发⑤ 从 2 NPC（灰鬃/林歌）2 档（friend/enemy）扩为 12 NPC 四档；新增触发⑥ 事件余波（10 模板）；设置面板新增记忆注入开关
- 为什么：CM-1 只有 2 个 NPC 有回指、无结算后果感知；玩家跨节点切换时缺"上件事的余温"，衔接感弱（CON 工程目标）
- 如何验证：单元级（R6/R5/R6_DAY_GUARD）+ 全量验证链 + bu 实测；关闭开关后 v91_memEnabled 返回 false 走零注入路径（与 v92 渲染逐字节一致由"开关短路返回 null"保证）

## 未变
- 判定公式 / writeNext 核心语义 / choose / 存档语义：零触碰
- saveVersion=48、applyDefaults 兜底链：不变（memoryInjection 默认 true 已存在）
- 节点总数 4,601；四路字节一致；旧档兼容（__v92lastFX 为 window 级临时键，不序列化）
