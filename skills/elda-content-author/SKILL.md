---
name: elda-content-author
description: 群雄割据（艾尔达大陆）专属内容创作技能。当用户要求为《艾尔达大陆·群雄割据》游戏新增/扩充剧情节点、世界事件、好感支线、新势力地域内容包，或批量生产游戏内容时使用。封装该游戏的节点数据 schema（N["id"]={tag,place,pace,text,options}）、选项判定格式（check/tier/effects/changeRelation）、状态感知变体（ifFlag/ifRelation）、事件池注入（EVENT_POOL_EXT）、区域入口挂载、V66 文风与 30 个 AI 高频治理词约束、CM-3 因果账本登记/核销、以及从 node --check 到 elda ci 的完整验证链。触发词：群雄割据、艾尔达大陆、内容包、写节点、加剧情、新事件、支线、新势力、节点、故事扩充。不用于：引擎逻辑改造（判定公式/writeNext/choose/存档语义）、UI 改造、纯设置类咨询。
---

# 群雄割据内容创作（elda-content-author）

为《艾尔达大陆·群雄割据》（单文件西幻文字 MUD，项目根 `D:\1pao tuan\群雄割据`）创作合规内容的专用流程。目标是：**新增内容零引擎改动、过全部 21 检查器、不违背既有设定**。

## 铁律（每次写作前默念）

1. **不触碰**：判定公式 / writeNext 核心语义 / choose / 存档结构语义；saveVersion=48 不变。
2. **备份**：改动 src 前先备份 `backup\<批次>_<日期>\`（如 `BD5_20260909\`）。
3. **设定一致**：新内容与 8 势力、五主线（purge day60 / silver 120 / seal 200 / academy 250 / orc 280）、金秤家族、晨天城、七锚/铁牌、神谕、账本 38 项严格一致；涉及伏笔必须同步账本。
4. **文本规范**：遵守 V66 文风；30 个治理词每词全书 ≤30 处；中文引号“”成对；连续标点豁免“？！”。
5. **验证链**：每个批次完成跑 `node --check` → `elda ci` → `smoke_test.py` → bu 浏览器实测。
6. **数量基准**：节点数只增不降（当前 3,877）；文本不删句不改既有选项语义。

## 标准流程

### 1. 定位写作对象
- 新节点 → 放进 `src\data_nodes\dn_<主题>.js`（新建文件或追加现有）；**不要**写进 script_02*.js（那是引擎区）。
- 新事件 → 追加进 `src\script_01.js` 的 `EVENT_POOL_EXT` 数组（约 :19 起）。
- 新区域入口 → `src\script_02.js` 对应城市选项块挂 go。
- 新支线 → 独立 dn 文件，闭环 ≥4 节点。

### 2. 按 schema 写节点
先读 `references/node-schema.md`（节点/选项/变体/pace 全格式）。脚手架可用：
```
python -X utf8 tools\elda\elda.py content new --type main|branch|event|ending --id <id> --vol <卷>
```
生成 `src\data_nodes\dn_scaffold.js` 模板后改写（注意：**dn_scaffold.js 不进构建**，写完必须另存为正式 dn 文件名）。

### 3. 注入事件 / 挂入口
按 `references/events-gates.md`：事件 day 与五主线错开、cls 四类、数组末项补逗号；入口挂 script_02.js 对应选项块。

### 4. 文风与词表自查
按 `references/style-words.md`：V66 白描、禁治理词、战斗四段式（蓄势/交锋/受创/转折）。写完后跑 `elda text guard` 复核。

### 5. 账本衔接
新伏笔/回收 → 在 `src\data_nodes\dn_causality.js` 补/改账本项（语法见 `references/ledger.md`）；涉及设定词确保出现在所属卷域（`elda content causality` 校验）。

### 6. 验证与交付
按 `references/verify-chain.md` 全链执行。全部通过后交付：改动清单（文件+行号）+ 验证结果 + docs 文档。

## 内容包铁律（新势力/地域包通用）
- 每包：节点 10-16 + 事件 3-6（并入 EVENT_POOL_EXT，day 与五主线错开）+ 支线 0-1（闭环 ≥4 节点，好感里程碑 60 挚友 / 80 恋人 / -60 死敌）。
- 全部节点带 `pace` 字段（normal/deep 为主；受 ci 叙事卷 light≤20% 门禁约束）。
- 全部入边修复（0 孤儿）；与五主线不冲突（可呼应不可改判定）。
- 世界事件与区域文本前后呼应（参考 BD-1 西境 hstorm/spring 呼应先例）。

## 必读引用（按需，勿全读）
| 引用 | 何时读 |
|---|---|
| `references/node-schema.md` | 写任何节点前 |
| `references/events-gates.md` | 注入事件或挂区域入口时 |
| `references/style-words.md` | 写正文前（文风/词表/战斗模板） |
| `references/ledger.md` | 涉及伏笔/设定词时 |
| `references/verify-chain.md` | 完成改动后跑验证链时 |

## 常见坑（已实证，勿重试）
- PowerShell 5.1 禁 `&&`；Grep 工具会失败→用 `Select-String`；内联 python 中文必炸→写 .py 文件执行。
- **事件数组末项缺逗号**是反复出现的 SyntaxError 根因。
- **V66 设定深度检查器会扫注释文本**——文件头注释里禁止写治理词清单原文（如"目光/低声"）。
- python 注入 JS 时 `\n` 字面量会变真实换行断裂字符串 → 写 `\\n`。
- 改完 src 必须重跑构建（`_build_authority.py build` → Copy game_built.html → game.html），只改 src 不改 game.html 不会被玩家看到。
