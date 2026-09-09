# QA_v56 检验报告 · 强者活态生态工程

- 版本：v56（在 v55 基础上；S.saveVersion 保持 48）
- 日期：2026-09-07
- 权威源：`D:\1pao tuan\群雄割据\game.html`
- 开工备份：`backup\game_v56_before_living.html`（7,599,018 字节，已确认）
- 交付态：game.html / game_check.html = 7,768,049 字节（同步）；index.html / game_chunked.html = 3,019,766 字节（同步）；chunks\ 8 分片 + NODE_MAP.js（2384 映射）

## 一、交付内容

### 方向一：强者活态档案（85 位 ≥ 60 达标）
- STRONG_LIFE_V56：9 神（不涉世俗档案）+ 20 半神/挑战者 + 27 传奇（含兽王/隐世/散人）+ 12 大宗师 + 4 种族特殊 + 12 深渊变体 + 3 theo = **85 条**
- 字段：personality（2-4 词）/ hobby（1-3 项）/ faith / motto / routine / baseWhere / mood / traits
- 性格全部从 STRONG_V53 story 提炼（洛·晨雾=克制/歉疚/守诺·观星·"这道法则，还能不能再刻一层"；玛格达=三百年守夜；凯·青焰=寻火等）
- 心境系统：平和/忧虑/激昂/沉郁/暴戾 五档，随 worldTick 微动；传奇层 2 套语气变体（对话前缀）

### 方向二：行踪与时间系统
- StrongLifeKit：v56_tickStrong 挂 worldTick（advanceTime 内 2 处），每 7 天结算全部强者行踪（常驻/巡游/闭关/征战/布道/经商/隐居 状态机，按 personality 分配）
- v56_where / v56_meetChance：城市级定位 + 同城偶遇入口（9 城市别名表）
- 行踪可见性：人物卡"此刻在 X"；行踪传闻 12 条入酒馆池（STRONG_RUMOR_V53.push）

### 方向三：强者间关系网
- RELATIONS_V56：**60 条关系边**（师徒/挚友/宿敌/恋人/同门/世仇，每条含 note + rumorLine + weight），人物引用与 STRONG_V53 story 一致（洛×奥伦同门、瑟琳收奥薇恩为徒、玛格达×太阳神恋人、罗兰×克莱门宿敌等）
- STRONG_EVENTS_V56：**16 条动态事件**（红鬃×断江决斗、克莱门×炽言反目、洛×秦联手、格姆寻仇、澜放灯、凯烧哨站、第七印松动等），worldTick 触发 → S.missedEvents（v46 补偿器酒馆回收）+ v47_worldDelta 效果落地
- 关系偏置 v56_bondBias：玩家与 A 交好 → A 的宿敌对玩家初始冷淡

### 方向四：强者与主角深度互动
- v56_talk 交谈：27 组对话（传奇层全量），4 主题（理念/传闻/修行/闲聊）× 心境前缀 × 记忆回响（"你上次帮过我"），理念相合 ±好感
- v56_gift 赠礼：按 hobby 命中 +2（80 金），送错 0 效果
- QUEST_V56 委托 27 条：完成 bond+3 + 专属奖励（reward.reading 预留，信件解锁）
- v56s_* 专属剧情节点 **78 个定义**（60-75 目标段）：洛·晨雾星徽、凯·青焰旧灯、秦·长风木臂名字、玛格达烛芯等，全部基于 story 展开，go 引用零死链
- 挑战/护法/交好复用 v53 体系（window 挂载确认）

### 方向五：理念/信仰/心境联动
- v56_faithBias：职业理念 × 强者信仰 × 玩家双轴（神性/深渊），faith 标"游离"者（克莱门/薇·灰雾）返回 0
- 深渊联动：S.corruption 高 → 深渊变体强者好感↑正常强者↓；深渊强者行踪只在腐化区域
- 神座意志：WILL_TO_ASCEND_V53 强者 will 影响 theomachy 态度（执念=竞争者 -3 起，淡泊=引路人）

### 方向六：强者记忆与间接回响
- S.strongDeeds 四计数（help/harm/challenge/bondGift）+ lastDay，人物卡"他（她）记得：…"
- 来信 12 封：READINGS_V45 扩展 r_v56_1~12（bond≥5 解锁，走 v53_unlockStrongReading）
- 传闻提及池 18 条 + 行踪传闻 12 条（STRONG_RUMOR_V53 扩展共 30 条）
- NOTICE_V56 告示板 5 条（秦·长风/文森/罗兰/艾琳/克莱门），挂 v53_strongBody"现世动态"栏

### 方向七：人物志图鉴
- v56_livingBtn 入口挂 v53_strongBody（强者谱面板，人物志按钮 + 现世动态栏）
- 人物卡 v56_peekCard：档案区（性格/爱好/信仰/口头禅/行踪/心境/神座意志）→ 互动区（交谈/赠礼/挑战/护法/听委托/交好/离去）→ 恩怨列表
- 关系网 SVG 子视图 v56_relsSvg：自绘确定性 SVG（中心+关联节点、边色按类型、虚线宿敌/世仇、图例），人物卡内嵌
- 未听说者剪影（knownStrong 判定，未听说提示"你还没听说过这位强者"）

## 二、构建验证（全量）

| 项目 | 结果 |
|---|---|
| _v39_extract.py + node --check 6/6 | PASS（script2 3,221,381 字符） |
| _check_dead_links.py | 节点 3035 / go 6580 / **死链 0** |
| 占位检查 | 1（writeNext 兜底提示，允许） |
| _v56_audit.py | **ALL AUDIT PASS**（85 档案/60 边/16 事件/27 对话/27 委托/78 专属节点/12 来信/30 传闻/4 兜底字段/图鉴挂点） |
| _v42_build_chunks.py | 8 分片 + NODE_MAP（2384 映射） |
| _v42_verify_chunks.py | 0 缺失 / 0 多余 / 死链 0 |
| _v42_chk_syntax.py | 15 JS 全部 PASS |
| 四路同步 | game.html = game_check.html；index.html = game_chunked.html |

## 三、浏览器回归（bu 平面，file:// 环境）

| 回归项 | 结果 |
|---|---|
| 页面加载 | 正常（艾尔达大陆·群雄割据，节点 3049，console 无错误） |
| 核心常量 | STRONG_LIFE_V56=85 / RELATIONS_V56=60 / STRONG_EVENTS_V56=16 / TALK_V56=27 / QUEST_V56=27 / NOTICE=5 |
| 查找强者 | v56_findStrong 传奇（洛·晨雾）与竞争者（奥伦·星弦）均命中 |
| 人物卡渲染 | 姓名/称号/性格/爱好/信仰/口头禅/行踪/心境/神座意志/互动按钮/恩怨 全在 |
| 关系网 SVG | 4 节点 4 边 + 图例 + 恩怨列表（洛·晨雾） |
| 行踪结算 | v56_tickStrong 跑通（模拟 21 天）；动态事件入 S.missedEvents（se56_ev56_duel_north） |
| 交谈 | 写入 story（心境前缀"眉间压着事" + 理念回复 human-signal） |
| 旧档兜底 | 无 v56 字段的 v55 存档 → strongLife/strongRel/strongChat/strongDeeds 全 object 兜底；读档链 v46→v55→v56 ensureDefaults 确认 |
| 图鉴挂载 | v53_strongBody 含人物志入口 + 现世动态 + 金字塔数据 |
| console | 0 新错误（既有 [V35] 白名单日志除外） |

## 四、修复记录（开发中问题）

1. `N["v56s_*"]]=function` 双右括号笔误 ×20 → 统一修复
2. `]"options:` 多余引号 ×3 → 修复
3. text 数组尾部缺失闭合引号 ×2（smith1_a / trade2_a）→ 修复
4. v56_findStrong 依赖 v53_findStrong（v53 IIFE 内纯函数，window 不可见）→ **自实现查找**（遍历 STRONG_V53 legend/master/raceSp/abyss/special/deity + RIVALS_V52 + THEOMACHY_V53）
5. v53_esc 同样 IIFE 内不可见 → v56_esc 自备 + 引擎段替换
6. v56_tickStrong 事件去重依赖 S.worldHeard → 局部初始化保护

## 五、存档兼容（硬约束确认）

- localStorage 主键 `elda-qunxiong-v3-save` 不变
- S.saveVersion 保持 48
- 新增字段 S.strongLife / S.strongRel / S.strongChat / S.strongDeeds 全部 v56_ensureDefaults 兜底（链入 v55/v54/v46）
- 行踪/心境/关系动态不写分页内存变量

## 六、已知说明

- 半神/神"不涉世俗"：人物志可见但无行踪显示（不进入日常传闻），符合 v53 口径
- 玩家声望（S.reputation）+ 强者交集 → 传闻提及池条目；未满足条件时传闻池按既有机制随机
- 专属剧情节点入口依赖 knownStrong + bond≥2 + 位置匹配（行踪系统），走 v46 TransitionKit + v45 分页续读
