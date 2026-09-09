# 事件注入与区域入口（群雄割据）

## EVENT_POOL_EXT（世界事件池）
- 位置：`src\script_01.js` 约 :19 起，`const EVENT_POOL_EXT = [ ... ];`。
- 事件格式：
```js
{id:"weststorm", day:56, cls:"天灾", text:"西境荒原刮起元素风暴，商路中断，行省会宣布戒严。"}
```
- `cls` 四类：`天灾` / `奇遇` / `商机` / `人祸`（ci 按类统计）。
- 当前规模：95 则（天灾22 / 人祸26 / 奇遇30 / 商机17）；追加即 96+。
- 触发机制：`checkWorldEvents` 每 tick 自动触发一次（day 到达即播报，事件为纯播报文本，无节点跳转）。

### 注入铁律
1. **day 与五主线错开**：purge=60 / silver=120 / seal=200 / academy=250 / orc=280 前后各 ±5 天内不插同主题冲突事件；同一天可多则但避免同主题。
2. **数组末项补逗号**：追加到数组末尾时，原末项 `}` 后必须有逗号（SyntaxError 高发点）。
3. **世界呼应**：新事件文本可与区域节点文本呼应（如 BD-1 西境 hstorm 元素风暴 ↔ dn_west.js 风暴观测节点）；呼应不改变任何主线判定。
4. **账本**：事件若埋设定/伏笔，同步 dn_causality.js 登记。

## 区域入口挂载（让玩家到达新节点）
- 位置：`src\script_02.js` 各城市选项块（如自由城邦/铁门关/圣城等 `place` 与选项）。
- 形式：在目标区域选项数组中加 `{t:"（前往西境）", go:"west_entry"}`，`go` 指向你写的入口节点（tag:"main"）。
- 新区域需在 `REGIONS`（src\script_01.js:15）注册：`{id:"west", name:"西境", cities:[...], unlock:true|false, desc:"..."}`；地图自动渲染。
- 五主线 day 表（勿改）：purge 60 / silver 120 / seal 200 / academy 250 / orc 280。

## 内容包配方（新势力/地域包）
| 项 | 规格 |
|---|---|
| 节点 | 10-16 个，入口 tag:"main" 挂 script_02.js |
| 事件 | 3-6 则入 EVENT_POOL_EXT（day 错开） |
| 支线 | 0-1 条，闭环 ≥4 节点，好感里程碑 60/80/-60 |
| 入边 | 全部修复，0 孤儿 |
| pace | 全部带字段，normal/deep 为主，light 从严 |
| 账本 | 涉及设定补记账本项或核销 open 项 |
| 设定 | 与 8 势力/五主线/七锚/铁牌/神谕/金秤/晨天严格一致 |

## 参考先例（新包可仿写）
- `src\data_nodes\dn_west.js`（西境，15 节点 + 灰袍若耶支线）
- `src\data_nodes\dn_desert.js`（死亡沙漠，16 节点 + 白驼支线）
- `src\data_nodes\dn_church.js`（光明教会，13 节点 + 艾德蒙支线，净化令三路）
- `src\data_nodes\dn_east.js`（东部承天城，10 节点 + 沈砚支线，晨天故都线）
