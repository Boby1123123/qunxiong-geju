# CP-1 内容补足 · 深写三区（自由城深巷 / 第三哨雪原 / 学院四季）

> 批次：CP-1 ｜ 日期：2026-09-11 ｜ 前置：X-1~X-4（行动系统收编/日志持久化/后果感知/预算提限）已完成
> 目标：补足"超大型剧情八工程（F/E/C/S/T/L/P/W）+ 文本本体革命"的验收缺口——节点深度与总量

## 一、扩充了什么（34 个 deep 节点）

| 包 | 节点 | 数量 | 挂载入口 | 主题 |
|---|---|---|---|---|
| 包 A · 自由城深巷 | fc_deep_01~08 | 8 | fc_tavern（script_02.js，蜜尔娜打听） | 深巷鬼市、佝偻老人、引路人灰袍、下水道铁门、女祭司纸条、城墙影子、老陈铺子、归巷自省 |
| 包 B · 第三哨雪原 | frontier_deep_01~12 | 12 | frontier_city（dn_frontier.js，城墙看雪） | 城外脚印、冰裂隙（封印呼应）、地窖秤记木箱、老卒铜钟故事、守夜人、伤兵营、雪原晨巡、矿洞骸骨、老铁故居账册、商队驿站、哨长营帐、归营串联 |
| 包 C · 学院四季 | acad_deep_01~14 | 14 | acad_life_y1_open（dn_acad_life.js，四季纪事） | 正门枫道、西楼报到、公告栏红笔启事、东楼老莫里茨、食堂火塘、禁书区费尔曼、七圆点图纸、后山泉眼刻字、夏夜萤火、老槐树棋盘、四季回廊、尘封阅览室古籍 |

三包合计 **34 节点，全部 pace:"deep"**（单节点 400-800 字），文本增量约 **1.9 万字**。

## 二、为什么这么扩（动机与缺口定位）

1. **深度缺口**：v92 基线"新内容节点中位 ~193 字"、deep 占比 5.2%——内容量有了但厚度不足。本次三区各写一条"深巷/雪原/学院"可反复进入的深度链，单节点 400-800 字，直接拉高 deep 占比（当前 deep 占比升至 18.9%，生产报表 PASS）。
2. **衔接缺口**：自由城汇流段（fc_）此前 2-3 节点即北迁，城市质感薄；第三哨只有主线链，无"城市生活"层；学院生活节点少、四季感弱。三包分别补城市质感、边境氛围、学院生活。
3. **伏笔织网**：包 A 引路人·灰袍与既有"圣城名单/铁门关军官"线互文；包 B 冰裂隙/地窖木箱/老铁账册/七个圆点铺向七锚与封印线；包 C 费尔曼图纸、后山刻字『门在第七座城下』、尘封阅览室《古代封印考》批注与 CM-3 账本/CLUE_TRACKS 线索互挂——为后续 CP 批（线索拼合/聚合枢纽）铺料。
4. **与既有节点零冲突**：不改任何既有节点选项与判定；五主线 day 判定零触碰；存档结构零改动（S 零新增字段）。

## 三、改动清单

| 文件 | 改动 |
|---|---|
| src\data_nodes\dn_expand_story.js | **新增**：34 节点（fc_deep_01~08 / frontier_deep_01~12 / acad_deep_01~14） |
| src\script_02.js | fc_tavern options 追加 1 项：`{t:"（向蜜尔娜打听，深巷里可有什么去处——她在这城里待得最久）",go:"fc_deep_01"}` |
| src\data_nodes\dn_frontier.js | frontier_city options 追加 1 项：`{t:"（夜里睡不着，上城墙看看雪——守夜兵说，城外雪原上有一行脚印）",go:"frontier_deep_01"}` |
| src\data_nodes\dn_acad_life.js | acad_life_y1_open options 追加 1 项：`{t:"【学年小事·加深】在学院里四处走走，认识这个地方（四季纪事）",go:"acad_deep_01"}` |
| src\data_nodes\dn_story_blueprint.js | nodeIndex 尾部锚点追加 34 条登记（fc_deep→vol_free/arc_fac_free；frontier_deep→vol_north/arc_frontier；acad_deep→vol_academy/arc_academy，全 pace:"deep"） |
| game.html / game_chunked.html / index.html / game_check.html | 构建产物，四路字节一致 |

## 四、治理词处理（扩充记录：修正了什么、为什么、如何验证）

- 首轮写入含治理词 8 处：低声×6（含"压低声音"子串）、目光×1、隐约×1 → 触发 ci 文本治理 FAIL（低声 34/隐约 31）与 V66 风格锁防回潮 FAIL（低声 74→83/隐约 52→55）。
- 修正：逐处按语境替换为具体动作/感官描写（"把嗓门放低""声音压成一线""压着嗓子""按着算盘珠子""隔着烛光看见"等），不删句、不改语义。
- 验证：`scan_all_words.py` 复核 dn_expand_story.js 30 治理词计数 = 0；重跑 elda ci 文本治理/V66 风格锁双 PASS。

## 五、验证链结果

| 项 | 结果 |
|---|---|
| node --check（src 全量 26 块） | PASS |
| _build_authority.py build | OK（game_built.html 5,810,008 字符） |
| Copy → game.html | OK |
| elda chunks | 分片构建完成，go 引用 13,052，**死链 0** |
| elda sync 四路字节一致 | **一致**：game=game_check=9,418,482B；chunked=index=6,599,393B |
| elda budget --reason | 自动更新：baseline.game_html 9,418,482；node_total_min 5,001 |
| elda ci（39 检查器） | **全部通过（可发布）**；性能预算门 6 项 PASS |
| smoke_test.py | 后台运行（见交付时结果） |

## 六、如何验证（玩家侧）

1. 自由城·跛脚酒桶 → 找蜜尔娜 → "深巷里可有什么去处" → 进入 fc_deep_01 深巷链（8 节点闭环可回）。
2. 北境·第三哨城中心 → "夜里睡不着，上城墙看看雪" → 进入 frontier_deep_01 雪原链（12 节点，链回 frontier_city / frontier_tie_1）。
3. 学院·学年开始 → "【学年小事·加深】在学院里四处走走（四季纪事）" → 进入 acad_deep_01 四季链（14 节点，链回学院日常/北门）。
4. 三链均为可反复进入的深度内容，不消耗行动点、不推进 day（纯节点跳转）。
