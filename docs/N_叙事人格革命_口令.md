# 口令 · 群雄割据 叙事人格革命（五大方向八批）

> 依据：docs\N_叙事人格革命_口令.md（本文件）；基线：节点 4,856 / 事件 176 / ci 38 检查器 / saveVersion=48 / 四路 game=8,961,088B chunked=6,192,298B
> 标杆：极乐迪斯科（对话即人格/失败叙事/100万字）、Choice of Games（统计驱动/文本变量）、Episode（531 冲突密度）、人生重开模拟器（天赋连锁/结局收集/名场面）、北大侠客行（庞大世界）、IF 设计三原则（有意义选择/三线索/结局引用选择/汇合点）
> 引擎锚点：writeNext 注入区 script_03.js:4982（v91_memoryInjection 同区）；applyDefaults script_03.js:75；applyEffects script_03.js:191（eff.gold 结算）；S.choices push script_03.js:5057；图鉴 script_05.js tabs:528 / atlasTab:391；属性面板 v34_openStatsPanel script_04.js:9590；事件池 script_01.js EVENT_POOL_EXT（{id,day,cls,text}）；IDEALS/HOBBIES/TALENTS/SUBRACES = script_01.js

## 铁律（全程）
- 备份 backup\<批>_<日期>\；临时脚本归档 backup\scripts_archive\tmp\
- 不触碰判定公式 / writeNext 核心语义 / choose / 存档结构语义；saveVersion=48 不变；applyDefaults 兜底链不变
- 旧档兼容：新功能全部独立键（S.stance / S.dialogueMem / S.rel5 / S.mood / S.comboFlags）或默认值
- 节点数只增不降；文本不删句不改既有选项语义；V66 文风 + 30 治理词 + 中文引号成对
- 五主线 day 判定零改动；不做移动端；不做 D-6 同伴系统
- 每批验证链：node --check（26 块）→ ci_guard.py --build（build/copy/chunks/sync/ci/smoke/四路）→ bu 桌面 1280 实测 → docs 文档 → git 提交；偏差即停

## 批次与验收

### N-1 立场系统（机制+数据+面板+注入）
- src\data_nodes\dn_stance.js：STANCE_AXES 五轴（order 秩序-自由 / altru 利他-利己 / faith 信仰-怀疑 / trad 传统-变革 / honor 荣誉-生存），每轴 cn/neg/desc + 三档立场句（neg≤-8/平衡/pos≥8，每档 ≥2 句，V66 文风）
- IDEAL_STANCE 映射：8 理想（wealth/might/guard/truth/free/god/fame/revenge）→ 初始立场
- 引擎：applyDefaults 兜底 S.stance；applyEffects 增 eff.stance {axis,v} 结算（不动既有行为）；v93n1_stanceInit/stanceLine（返回 0-1 句立场感知句，注入 writeNext 注入区）；属性面板加"立场"行（显示两轴最高分）
- 首批 ≥8 个既有选项加 stance effects（零判定改动）
- 验收：bu 建号后选"以血还血"理想 → 立场 honor 初始为负、面板显示；节点注入立场句；关闭零回归

### N-2 对话级记忆 + 失败叙事补写（内容批）
- S.dialogueMem 独立键（最近 8 条 {npc,line,day}，applyDefaults 兜底）；v93n2_dialogueLine 读 dialogueMem+npcRelations 注入"你上次说/你曾承诺"引用句（模板追加 dn_memory_tpl.js，≥8 条）
- 失败叙事：扫描既有节点 tier.fail 为空/过短（<40 字）的选项，补写 ≥30 处 fail 分支叙事文本（每处 ≥60 字，失败也推进剧情不惩罚，不改判定）
- 验收：bu 触发一次失败分支见完整叙事；对话引用注入生效；elda text guard 全绿

### N-3 结局引用选择 + 三线索账本 + c_clue 检查器
- src\data_nodes\dn_ending_echo.js：≥15 个结局各配 1 条回响段（引用 ≥3 个玩家早前具体选择，按 S.choices 前缀命中；v93n3_endingEcho 在结局渲染时追加）
- src\data_nodes\dn_clue.js：≥8 个关键真相（七锚/金秤/晨天/神谕/五主线）各配 ≥3 条独立线索路径（{flag|node 前缀}）
- elda.py 新增 c_clue 检查器（38→39）：每真相 ≥3 线索存在性校验，接入 elda ci
- 验收：结局实测含回响段落；elda ci 39 检查器全绿

### N-4 因果时间线 + 结局卡牌册（图鉴增强）
- 图鉴"抉择"tab（v93_choicesBody）升级为因果时间线：读 S.choices + S.flags + 账本状态，渲染"选择 → 后果 → 回响"链
- src\data_nodes\dn_ending_cards.js：≥15 结局卡（解锁线索：属性/flag/立场/关系组合）；图鉴"结局"tab 增强显示卡与线索
- 验收：bu 图鉴两 tab 实测渲染正确

### N-5 NPC 独立近况 + 五维关系（世界人物）
- src\data_nodes\dn_npc_lives.js：≥12 NPC 各按 day 阶段（0-60/61-150/151-280/281+）配近况条目；v93n5_npcLifeLine 事件/节点注入"NPC 不在场时世界也在转"
- S.rel5 独立键（恩义/信任/亏欠/猜疑/爱慕）+ v93n8_rel5Shift（changeRelation 旁路记录，不改变 changeRelation）；图鉴"关系网"tab 增强显示五维
- 验收：bu 图鉴关系网 tab 显示五维；近况句注入

### N-6 世界图书馆 + 历史年表（世界厚度）
- src\data_nodes\dn_library.js：≥8 本可读全书（大陆编年史/圣光教典/地理志/人物志/家族箴言/七锚秘录/金秤家书/学院年鉴），每本 ≥600 字；藏书 tab 增强可翻页阅读
- src\data_nodes\dn_history.js：≥30 条大陆大历史（旧王朝/灾变/战争/王朝更迭，与世界观一致）；编年史 tab 数据并入
- 验收：bu 藏书/编年史 tab 可读全书；设定词覆盖校验通过

### N-7 天赋连锁隐藏线 + 冲突事件层（重玩魔性）
- src\data_nodes\dn_combo.js：≥8 条五维组合（职业×理想×爱好×天资×亚种）→ 隐藏 flag + 线索引；建号后 v93n7_comboCheck 置 flag（纯置位零判定改动）；配 ≥3 条迷你隐藏线（各 ≥3 节点，走 dn_combo_lines.js）
- v93n12_conflictPool：≥12 则高冲突事件（天灾/人祸/奇遇/商机，day 与五主线错开，含 effects 结算，独立注入层不碰 EVENT_POOL_EXT）
- 验收：bu 实测组合触发隐藏线；冲突事件 day 触发正常

### N-8 名场面 + 典故库 + 情绪连续性（文本体量）
- src\data_nodes\dn_scenes.js：≥10 则名场面段落（可截图传播，V66 文风魔性），挂既有场景节点追加段落
- src\data_nodes\dn_allusions.js：≥20 条典故（谚语/地名由来/家族箴言）；v93n15_allusionLine 按 place 注入
- S.mood 独立键（trauma/relief/obsession）+ v93n16_moodLine 注入色调句（重大事件置 mood）
- 整合回归：ci 39 检查器全绿 + smoke PASS + bu 全流程（建号→序章→自由城→学院→立场→事件→面板→图鉴→存读档）
- 验收：全部注入开关可关、关闭零回归；elda text guard 全绿；四路字节一致
