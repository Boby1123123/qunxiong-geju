# NG-2 结局后日谈（v93）

## 扩充了什么

新增结局梦回：`src\data_nodes\dn_ng2.js`（4 节点），零引擎改动、零存档结构改动。

- **触发**：读跨周目 `elda-ngplus-v2` 的 collected 数组，含对应结局 id 即出现梦回入口（req try/catch 兜底）
- **ng2_seal**（守门人结局达成后）：梦见封印之门、七锚沉地脉
- **ng2_open**（解封·混沌纪元）：梦见深渊洞开、旧秩序坍塌
- **ng2_transcend**（超脱归位）：梦见自己成为大地之上的坐标
- **ng2_war**（战争终局·锚碎）：梦见七锚碎裂、四境狼烟
- 蓝图：新弧 arc_ng2 + nodeIndex 4 条

## 为什么

结局图鉴（u7_ngPanel）只有一行记录，达成后没有"情绪余韵"。NG-2 让已达成结局在下一周目的自由城里以"梦回"方式重访，给老玩家奖励性叙事，也让结局的意义沉淀到新周目里——纯数据零引擎。

## 如何验证

- `elda ci` 25 检查器全绿；smoke PASS；四路字节一致；saveVersion=48 不变；旧档兼容
- 治理词自查通过；中文引号成对；死链 0；蓝图 arc_ng2 归属 4/4
- 实测路径：手动置 elda-ngplus-v2.collected 含 ending_anchor_seal → fc_innkeep 出现对应梦回入口
