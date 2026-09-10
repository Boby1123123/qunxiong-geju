# DEEP-2 · 事件池微叙事化 + 战斗受创补齐（v92）

日期：2026-09-10
批次：DEEP-2（文本本体革命 · 工程 DEEP · 内容深化）
前置：TQ-1~4 / CON-1~2 / DEEP-1 已完成，elda ci 25 检查器基线全绿

## 一、176 事件微叙事化（核心扩充）

**扩了什么**：`EVENT_POOL_EXT`（src\script_01.js）全部 176 条世界事件，在原句之后追加 2-3 句微叙事，形成"环境白描 + 在场细节 + 后果感知"的完整短场景。

**为什么**：原事件为单句播报（平均约 35 字），触发时信息密度不足，与节点正文的叙事密度落差大；微叙事化后事件不再是"弹一条公告"，而是可感知的世界切片，提升沉浸感与文本连续性（呼应"文本本体革命"目标）。

**如何验证**：
- 事件平均字数 约 35 → 102.4 字（最短 67 / 最长 141，全部 ≥60）
- 176 条全部注入成功（批 A 60 + 批 B 61 + 批 C 55），零缺失
- 中文引号配对（左=右=3523）、连续标点 0、30 治理词无超标（elda text guard 全绿）
- day/cls/id/触发机制零改动；EVENT_POOL_EXT 数组末项逗号铁律保持

**写作规范**（本次执行，后续沿用）：
- 追加句用具体物象与动作，禁 30 治理词（微微/轻轻/缓缓/低声/目光/嘴角/眼底/片刻/仿佛/似乎/深吸/良久/微叹/不由/下意识/喃喃/沉吟/皱眉/心头/眸光/身形一闪/微微一怔/淡淡道/沉声道/轻声道/若有所思/不动声色/隐隐/隐约/些许）
- 每类事件差异化：天灾写环境异变与人群反应；奇遇写异象细节与旁观者；商机写价格、账房、排队；人祸写冲突现场与气氛
- 与既有节点文本互文（如 bandit↔黑风寨、acad_*↔学院链、frontier_ev_*↔第三哨、aft_*↔战后包、war_news_*↔战争线、anchor_*↔七锚线）

## 二、elda content combat 新子命令 + 受创段补齐

**新增**：`elda content combat [--top N]`（tools\elda\p2tools_impl.py cmd_content_combat）

**口径**（两次迭代后固化）：
- 判定对象：tag=combat 或 id 含 combat_ 的节点
- 合规要求：正文同时含 程度词（30）+ 部位词（25）+ 来源词（42）三类，且含打斗动作词（交战场景）
- 豁免：无打斗动作词（逃跑/谈判/收尾/战后）、id 含收尾语义（flee/deny/mercy/robbed/after/talk/road/symbol/given/fought/leave/exit/end）、<60 字节点
- 第一次误报 22 条 → 修正词表（补 伤/血/浸透/冷汗/发麻/钝痛 等）+ 豁免逻辑 → 5 条 → 再收紧动作词（去"扑来/钉住"误命中）→ 1 条

**补齐**：sp8_ranger_09（游侠学院对练）追加受创段——弓弦磨破虎口渗血 + 箭尾擦过右小臂（来源弓弦/箭尾 + 部位虎口/小臂 + 程度皮破渗血 + 属性影响"明天怕是拉不满弦"）。

**验证**：`elda content combat` 输出"待补 0 条"（全部 combat 26，豁免 20）。

## 三、验证链结果

- node --check（26 块 + 改动文件）：PASS
- _build_authority.py build：OK（game_built 5053579 字符）
- 四路字节一致：game=game_check=8278835B；chunked=index=5539859B
- elda ci 25 检查器：全绿（首跑仅预算 baseline FAIL，属合法增长，elda budget --reason "DEEP-2 176事件微叙事化+combat受创段补齐" 更新后重跑全绿）
- smoke_test.py：PASS（30 步推进 / 5 面板 / 存读档 / 结局触发）
- 文本治理：高频词 0 超标、引号配对、连续标点 0

## 四、变更文件清单

| 文件 | 变更 |
|---|---|
| src\script_01.js | EVENT_POOL_EXT 176 条追加微叙事（批A/B/C） |
| src\data_nodes\dn_sp8_ranger.js | sp8_ranger_09 补受创段 |
| tools\elda\p2tools_impl.py | 新增 cmd_content_combat + COMBAT_* 词表 + 豁免逻辑 |
| budget.json | baseline.game_html 8245104→8278835（elda budget --reason） |
| game.html / game_chunked.html / index.html / game_check.html | 四路重建同步 |

## 五、扩充记录（扩了什么 / 为什么 / 如何验证）

| 扩充 | 为什么 | 如何验证 |
|---|---|---|
| 176 事件微叙事化 | 事件播报太薄，与正文密度落差大 | 平均 35→102 字；text guard 全绿；smoke PASS |
| combat 受创段硬校验 | 战斗节点四段式（受创段必含来源+部位+程度）可机检 | elda content combat 待补 0 |
| 收尾/回避语义豁免 | 逃跑/谈判/宽恕节点本无受创场景，不应误报 | 豁免 20 条，实测清单稳定 |
