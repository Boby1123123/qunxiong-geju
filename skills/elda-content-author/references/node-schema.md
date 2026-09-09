# 节点数据 Schema（群雄割据）

## 文件位置与格式
- 全部节点在 `src\data_nodes\dn_*.js`（纯数据，`window.N` 或全局 `N` 对象挂载，全对象式）。
- 对象式节点（当前 3,877 个全部为此格式，P0-2 已把函数式迁完）：
```js
N["节点id"] = {
  tag:"main|branch|event|ending|easter",  // 标签（引擎忽略未知字段，安全）
  place:"区域 · 地点",                     // 显示地点，如 西境 · 元素荒原 · 入境隘口
  where:"白昼|黑夜|任意",                  // 时段
  pace:"light|normal|deep|epic",          // 节奏档（CM-4 门禁统计用）
  text:[ "段落1", "段落2" ],               // 或变体对象，见下
  options:[ {t:"选项文案", ...} ]
};
```
- 函数式节点已不新增（writeNext 保留 typeof 双兼容兜底，勿复用旧式写法）。

## text 三形态（CM-2 状态感知变体，全部向后兼容）
1. 字符串数组（默认）：
```js
text:["第一段。","第二段。"]
```
2. flag 变体（按 S.flags 选段）：
```js
text:{ default:["默认正文"], ifFlag:{ "某flag":["持有该flag时的正文"], "另一flag":["..."] } }
```
3. 关系变体（按 S.npcRelations 选段）：
```js
text:{ default:["默认正文"], ifRelation:{ npc:"npc_id", op:">=", val:60, yes:["好感≥60"], no:["好感不足"] } }
```
解析由 `v91_resolveText` 在渲染入口完成；变体不改变选项集/判定/go。

## options 选项格式
```js
options:[
  // 纯跳转
  {t:"（原路返回）", go:"west_leave"},
  // 判定 + 分支（check/tier/effects）
  {t:"买一块元素结晶（3银月）",
   check:{a:"CHA", sk:"bargain", label:"议价"},
   tier:{
     ok:["成功正文1","成功正文2"],
     fail:["失败正文"],
     crit:["大成功正文"]
   },
   effects:{gold:-2, xp:20, infl:{west:3}},
   go:"west_storm_observatory"},
  // 好感变更（支线用）
  {t:"（伸手扶起他）", effects:{relation:{npc:"npc_id", v:5}}, go:"xxx"}
]
```
- `check.a`：属性（STR/CON/AGI/INT/SPR/CHA 六主属性；也见 lv_* 等级键）。
- `check.sk`：技能缩写（常用：bargain 议价 / lore 学识 / persu 说服 / stealth 潜行 / detect 洞察 / survival·survive 生存 / martial 格斗 / athletic 运动 / medic·medicine 医术 / alchemy 炼金 / soul 灵魂 / speech 口才 / animal 驯兽 / will 意志；职业系用 v57q_* 与中文键——以现有节点为准）。
- `effects`：gold/xp/infl（区域声望 `{west:3}`）/relation（`{npc:"id", v:±N}`）/flag 等；applyEffects 在 script_03.js:191 结算（fail 分支也结算选项级 effects，属既有行为）。
- 同一选项 ok/fail/crit 的数组可 1-2 段；go 指向下一节点 id（必须存在，否则死链 FAIL）。

## 状态字段速查（写作时引用的只读状态）
- S.day / S.curCity / S.visited（地点访问）/ S.flags（重大选择）/ S.npcRelations（好感）/ S.settings.pagedReading / S.settings.memoryInjection / S.slotId。
- 好感里程碑：60 挚友 / 80 恋人 / -60 死敌（支线设计基准）。

## 好节点检查清单
- [ ] id 唯一、英文/拼音前缀（如 west_/desert_/church_/east_），无中文 id
- [ ] pace 字段存在且合规
- [ ] text 为数组或变体对象；中文引号成对；无治理词超标
- [ ] 每个 go 指向存在的节点；选项无孤儿
- [ ] 涉及伏笔已在 dn_causality.js 登记
- [ ] node --check 通过
