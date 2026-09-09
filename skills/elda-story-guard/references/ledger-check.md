# 因果账本与设定词校验（ledger-check）

## 账本文件
- `src\data_nodes\dn_causality.js`：
  - `window.CAUSALITY_LEDGER`（当前 38 项，closed=38）——账本项
  - `window.CAUSALITY_WORDS`（当前 20 词）——设定词冻结表

## 账本项字段
```js
{ id:"led_39", type:"伏笔|设定|人物|地点|事件|道具|势力|因果",
  desc:"一句话描述",
  plant:"埋设锚点", reap:"回收锚点", status:"open|closed", world:"所属卷/域" }
```

## 锚点语法（检查器 c_causality.py 的实现口径）
| 语法 | 满足条件（=锚点成立） |
|---|---|
| `flag:<名>` | src 中 effects 写过该 flag（`flag:"x"` 或 `eff.flag="x"`） |
| `node:<id>` | 节点 id 存在 且 被 go/then 静态引用 或 运行时 `curNode=<id>` 可达 |
| 纯关键词 | 在 game.html 中词频 >0（弱锚点，慎用） |

核销规则（检查器自动）：`plant 成立 && reap 成立 → closed`；`plant 成立但 reap 未达 → open`（未回收伏笔清单，输出不拦发布）；两者都不成立 → 该账本项无埋设痕迹（应检查是否写错锚点）。

## 设定词冻结（CAUSALITY_WORDS 20 词全表）
金秤 / 晨天 / 鬃吼 / 腐光 / 秦·长风 / 七枚锚 / 铁牌 / 神谕 / 灰鬃 / 林歌 / 银月 / 铁门关 / 圣山 / 狼旗 / 月池 / 树根 / 祖灵 / 大汗 / 青叶 / 净化令

- 每词必须出现在其 `file` 字段指定的文件（所属卷域）中，缺失 = ci FAIL（c_causality 报"设定词冻结 缺失 N 词"）。
- 追加冻结词的决策标准：仅当该词已成为**跨卷、必须防遗忘**的关键设定时（先例：BD-1 西境元素荒原不入表）；新地域专名默认只记账本。

## 操作命令
```powershell
python -X utf8 tools\elda\elda.py content causality
# 输出：账本 N 项·核销 closed=M open=K·设定词 X/20；未回收伏笔清单
```

## 常见操作场景
1. **新埋伏笔**（新内容包）：追加账本项 status:"open"，plant=触发节点/flag，reap="future" 或预计回收点。
2. **核销既有 open**（内容包回收伏笔）：改 status:"closed"，并确保 reap 锚点在 src 成立（如 BD-4 经 `east_chengtian_old` 故都线核销 led_02/led_32）。
3. **禁做**：删账本项；无锚点支撑改 closed（ci 会保持 open 或报错）；自造与既有项冲突的新设定词。

## 与写作流程的衔接
- 写新内容（用 elda-content-author）时，凡涉及"伏笔埋设/回收、关键设定、人物首次登场"，写作完成后必须跑本校验并核对账本 diff：**只增不删、closed 不回退**。
