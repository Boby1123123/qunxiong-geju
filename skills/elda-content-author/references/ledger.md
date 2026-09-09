# CM-3 因果/伏笔账本（设定一致性的机器门禁）

## 文件与用途
- `src\data_nodes\dn_causality.js`：`window.CAUSALITY_LEDGER`（账本项）+ `window.CAUSALITY_WORDS`（设定词冻结表）。
- 检查器：`elda content causality`（ci 第 19 检查器）——扫描 src 全量自动核销 open 项、校验设定词覆盖率。
- 目标：把"不能遗忘设定"从人工记忆变成机器账本；当前 38 项 closed=38。

## 账本项字段
```js
{ id:"led_39", type:"伏笔|设定|人物|地点|事件|道具|势力|因果",
  desc:"一句话描述",
  plant:"埋设锚点", reap:"回收锚点", status:"open|closed", world:"所属卷/域" }
```

## 锚点语法（plant/reap）
| 语法 | 含义 |
|---|---|
| `flag:<flag名>` | 该 flag 在 src 中被 effects 写入（满足 = 核销） |
| `node:<节点id>` | 该节点存在且被 go/then 引用（满足 = 核销） |
| 纯关键词 | 按词频在 src 出现（弱锚点，慎用） |

## 使用规则
1. **埋设**：新内容埋了伏笔/引入关键设定 → 追加账本项，status:"open"，plant 写触发它的节点/flag，reap 写将来回收点（未知可写 "future"）。
2. **核销**：内容包回收了既有 open 项 → 改 status:"closed"（如 BD-4 经 east_chengtian_old 故都线把 led_02/led_32 核销）。
3. **禁止**：不得删既有账本项；不得把 open 悄悄改 closed 却无对应节点/flag 满足（ci 校验会 FAIL）。
4. 追加格式照抄现文件（数组项逗号、注释块）。

## 设定词冻结表（CAUSALITY_WORDS）
```js
{word:"金秤", world:"金秤线", file:"script_02a.js"}
```
- 当前 ≥20 词：金秤/晨天/鬃吼/腐光/秦·长风/七枚锚/铁牌/神谕/灰鬃/林歌/银月/铁门关/圣山/狼旗/月池/树根/祖灵/大汗/青叶/净化令/白袍/银月祭坛 等。
- 校验：每个词必须出现在其 `file` 字段指定文件（所属卷域）内，缺失即 FAIL。
- **新增冻结词**：只在"该词已成为跨卷关键设定、必须防遗忘"时追加；新地域专有地名（如西境元素荒原）不入冻结表（见 dn_west.js 头注释先例）。

## 自检
- `python -X utf8 tools\elda\elda.py content causality` → 输出"未回收伏笔清单 + 设定词覆盖率"，open 项应均为有意识保留的伏笔（如各线终局回收点）。
- 期望状态：账本只增不删；新增内容必须让"账本 38 → 38+N（新埋）且既有 closed 不回退"。
