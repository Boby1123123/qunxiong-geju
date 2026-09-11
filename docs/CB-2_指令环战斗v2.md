# CB-2 指令环战斗 v2（v93）

批次：CB-2 · 2026-09-11 · 八批大型更新第二批
状态：已完成，6 个战斗节点接入，ci 全绿

## 扩了什么

- `src\gap_00.html` 新增 `#v93-battle` 容器 + 羊皮纸战斗样式（与 UI v5 一致）。
- `src\script_04.js` mechAct 开头加战斗锁（战斗进行中锁定普通行动），文件尾 `/v93btl/` IIFE：
  - `window.v93_battle` 状态机：active/round/charged/defensing + player/enemy 双方数据。
  - 指令：charge（蓄势）/attack（攻击）/defend（防御）/cast（施法，耗 san）/retreat（撤退）。
  - 命中公式：55 + (AGI 差)×2，限幅 25-95。
  - 受创句模板池：PART（部位）× DEG（程度）组合，按来源（敌兵种）生成受创描写。
  - 蓄势×2 伤害、防御减半、施法耗 san；结束回写 S.hp、恢复 options、renderStats/renderTop/v34_animateOptions。
- `src\script_03.js` writeNext 尾部 showOptions 分支加 `_btlGo` 判断（战斗结束后选项恢复）。
- 6 个战斗节点加 `battle:true` + `enemy` 字段：anchor_tower_4（无面异影）、anchor_mine_4（铁灰鳞）、world_f6_battle（疤脸头目）、grad_army_4（流寇头子）、sp8_ranger_09（草蛇）、anchor_chen_5（陆昭）。

## 为什么

旧战斗为纯文本判定（点选项→掷骰→读结果），无操作感。v2 引入指令环：蓄势/攻/防/施法/撤退五指令交互，命中公式 + 受创部位描写，让越级战有"回合操作 + 血量拉锯"的紧张感，且全部走独立战斗状态机，不碰 writeNext/choose 核心语义。

## 如何验证

- node --check 全绿（含 6 个 battle 节点）。
- ci 战斗四段校验：tone6/attack6/hit4/end5/bad_hits0。
- bu 实测：进入战斗节点后战斗容器出现，指令可点，受创句含部位/程度，结算回写 S.hp。
- 踩坑记录：python 注入 JS 的 onclick 引号需 `\\\"` 转义（曾 SyntaxError，恢复备份后重注成功）。
