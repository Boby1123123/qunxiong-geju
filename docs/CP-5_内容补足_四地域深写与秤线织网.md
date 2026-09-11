# CP-5 内容补足：四地域深写（承天 / 绿洲 / 圣辉 / 北境）+ 事件再扩

## 一、扩了什么（新增 40 节点 + 25 事件）

| 模块 | 文件 | 内容 |
|---|---|---|
| 东境承天深写 | `src\data_nodes\dn_expand_regions2.js` | east_life2_01~12：官署街→旧档房（沈砚接头·铁片合拢）→市集（说书人七柱传说）→建城录卷七"地宫之门以秤为钥"→夜市秤环→漕运码头长风号→北城烫秤纹箱子→城楼晨天秤响→沈砚赠黄铜钥匙→西门外出发 |
| 死亡沙漠深写 | 同上 | desert_life2_01~10：水市→大井井底秤纹石板→茶馆"秤在，水在"→守墓人三杆秤传说→七星夜空→黑市第七柱线索→守库人半卷建城录→沙丘望故都 |
| 光明教会深写 | 同上 | church_life2_01~10：圣辉城晨祷→大教堂涂掉圣典段→审判庭告示→烛台书店《晨天纪事》→守库人旧木箱（地宫图）→灰袍守秤人赠秤砣→圣痕司→广场"秤响是示警"→异端牢房抄经人→夜祷堂收束 |
| 北境王都深写 | 同上 | beijing_life2_01~08：冰狼集市→收旧铁怪人（"七杆秤砣还差一杆"）→酒馆雪化消息→城头雪下城传说（七颗星的门）→深夜数秤砣→雪原发现秤纹旧墙→客栈手记→南门出发 |
| 世界事件 | `src\script_01.js` EVENT_POOL_EXT | +25 则（cp5_1~25，day 37~577 全避开五主线 60/120/200/250/280 ±5） |

## 二、为什么（七杆秤砣·主线织网收束）

- **七杆秤砣体系正式立起**：量水的秤（绿洲大井）→量账的秤（自由城商会）→量命的秤（晨天钟楼）→守秤人/守库人/旧档房/收铁怪人四方持有者，四地域全部指向晨天故都地宫。
- **旧档房铁片合拢**：李管事铁片（CP-4）与沈砚半块合拢成完整秤纹，接建城录卷七"地宫之门，以秤为钥。秤在，门在"——与旧剧院唱词、守钟老卒"秤在门在"三方互证。
- **新道具链**：秤纹铁片 + 黄铜钥匙 + 暗红秤砣 + 羊皮纸地图（地宫图）四件套逐步集齐，晨天故都线（east_chengtian_ruins 现有节点）的可达入口大增。
- **跨地域互文**：七圆点石板 ↔ 夜空七颗星 ↔ 门楣七颗星；"压低声音"→"压着嗓门"统一人物口吻；雪下城 ↔ 霜狼山脉 ↔ 晨天残墙夜秤响。
- **与五主线零冲突**：只补可玩入口与线索文本，不改 purge/silver/seal/academy/orc 任何判定。

## 三、改动清单

| 文件 | 改动 |
|---|---|
| `src\data_nodes\dn_expand_regions2.js` | 新增（east_life2_01~12 / desert_life2_01~10 / church_life2_01~10 / beijing_life2_01~08，40 节点，全 pace:"normal"） |
| `src\data_nodes\dn_east.js` | east_gov options 末尾追加 → east_life2_01 |
| `src\data_nodes\dn_desert.js` | arrive_desert_lvzhou options 末尾追加 → desert_life2_01 |
| `src\data_nodes\dn_church.js` | arrive_church_tribunal options 末尾追加 → church_life2_01 |
| `src\script_02.js` | arrive_north_beijing options 末尾追加 → beijing_life2_01 |
| `src\data_nodes\dn_story_blueprint.js` | nodeIndex 尾部锚点法登记 40 条（east_life2→vol_east / desert_life2→vol_desert / church_life2→vol_church / beijing_life2→vol_north，arc:null） |
| `src\script_01.js` | EVENT_POOL_EXT 尾部追加 25 则（原末项 cp4_20 补逗号） |

## 四、治理词处理

- 首扫 12 处（压低声音×9 / 缓缓×2 / 片刻×1）→ 全部替换为"压着嗓门 / 不紧不慢地流 / 得歇歇 / 一会儿"。
- 终检 `elda text guard`：高频词 0 超标、引号配对、连续标点 0。

## 五、验证链结果

- node --check：26 块全部通过
- 构建：build OK → Copy → chunks（合并 5,257 / 分片缺失 0 / go 13,265 死链 0）→ sync 四路一致（game=9,596,919B）
- budget：bytes_max 9,581,087→9,646,919；node_total_min 5,071→5,111
- elda ci：39 检查器全部通过（账本 199 closed=150、设定词 27/27、light 13.5%、deep 373、文本治理 0 超标）
- smoke_test.py：RESULT PASS（30 步推进、5 面板、存读档、结局触发）
- bu 桌面实测：40 新节点全部存在；四 hub 尾选项 go 正确；事件池 409

## 六、如何验证（玩家视角）

1. 承天城 east_gov → "在承天城里走走"→ 旧档房铁片合拢 → 建城录 → 钥匙入手 → 城楼晨天秤响
2. 绿洲城 arrive_desert_lvzhou → "在绿洲城里走走"→ 大井秤纹石板 → 守墓人三杆秤 → 黑市第七柱线索
3. 圣辉城 arrive_church_tribunal → "在圣辉城里走走"→ 烛台书店地宫图 → 灰袍守秤人秤砣 → 异端牢房抄经人
4. 北境城 arrive_north_beijing → "在北境城里走走"→ 收铁怪人"还差一杆"→ 雪下城七颗星的门
5. 事件池随机触发 cp5_1~25（day 37~577，与五主线错开）
