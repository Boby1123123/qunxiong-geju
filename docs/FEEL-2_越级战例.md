# FEEL-2 越级战例（v93）

## 扩充了什么

新增 3 个越级战斗节点（tag:"combat" + tags:["combat"]，战斗四段式全合规）：

- **feel_battle_desert**（沙漠商路）：独眼沙盗头目，身手高玩家一截——示弱卖破绽，腋下撩刀反杀（入口挂 desert_caravan2）
- **feel_battle_wolf**（北境冻林）：雪原头狼，绕侧偷袭咬住右小臂（受创：来源狼牙/部位右小臂/程度獠牙陷肉/力量流失 hp-15）——靴刀扎肩胛退狼（入口挂 fc_innkeep 北境线，不碰 script_02.js 引擎区）
- **feel_battle_acad**（学院演武场）：高年级学长科班剑术，剑脊抽腕虎口开裂——单膝跪地不丢剑，下路扫脚踝反胜（入口挂 acad_life_y1_open）
- 每战四段式：蓄势（架势/环境/杀意）→ 交锋（2-3 回合攻防）→ 受创（来源+部位+程度+对属性影响）→ 转折（越级先示弱后爆发）

## 为什么

战斗系统已有四段式门禁，但越级战例偏少。FEEL-2 补 3 个不同地貌/身份的越级战例，覆盖沙漠刀客、雪原野兽、学院剑术三种打法，让战斗手感有差异化，也满足"越级挑战需先示弱卖破绽再爆发"的文风要求。

## 如何验证

- `elda ci` 25 检查器全绿（c_tags 战斗 tag 校验 PASS）；smoke PASS；四路字节一致；saveVersion=48 不变
- 修复记录：初版缺 tags:["combat"] 字段 → c_tags FAIL → 补齐后全绿；go 目标曾指向不存在的 desert_caravan_route/north_snowfield → 改为 desert_caravan2/tiebi_camp 存在节点
- 实测路径：desert_caravan2 → 沙盗战；fc_innkeep 北境入口 → 狼战；acad_life_y1_open → 演武场
