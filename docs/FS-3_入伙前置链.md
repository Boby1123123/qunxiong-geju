# FS-3 入伙前置链（势力系统超大型更新 · 第 3 批）

批次日期：2026-09-11 · 项目：D:\1pao tuan\群雄割据

## 一、扩了什么（为什么）

FS-2 只解决"知晓势力 + 申请入口"，FS-3 把"申请"落成**可玩的入伙前置剧情链**——11 阵营各一条"考核/引荐/仪式/投名状"链，走完链尾选项才真正入伙（run 调 v35_doJoin），彻底消灭"点击即加入"。

- 新文件 **src\data_nodes\dn_fs_join.js**（43 节点，全对象式 `N["id"]={...}`、带 pace normal）：
  - fs_free_01~04（公开招聘→码头告示→李管事面试→入会）
  - fs_empire_01~04（军功考核四步）
  - fs_church_01~04（信徒考核→礼拜→信仰检定→圣痕司受洗）
  - fs_orc_01~04（力量试炼→猎狼献礼→阿岩引荐判定）
  - fs_dwarf_01~04（工艺考核→献兵刃）
  - fs_elf_01~04（自然亲和仪式，ifFlag 变体：flag_hunt_blood 拒 / fs_elf_kind 迎）
  - fs_desert_01~03（商路利益→驼队首领引荐）
  - fs_north_01~04（铁门关应征→校场军考→新兵营夜哨→授衔入伙，补写轮）
  - fs_eclipse_01~04（秘密接头→观察期→投名状→戴面具入会）
  - fs_abyss_01~03（深渊接触→效忠）
  - fs_watchers_01（被邀请制打听扑空，回 fc_tavern）
- 链尾 go：free→faction_free_1、empire→faction_east_1、church→faction_church_1、orc→faction_orc_1、dwarf→faction_dwarf_1、elf→faction_elf_1、desert→faction_desert_1、eclipse→faction_free_1（借商会线）、abyss→faction_desert_1（借沙漠线）、north→faction_north_1、watchers→fc_tavern；每链尾选项注入 run 调 `v35_doJoin(<fid>)`。
- 状态感知变体：兽人线 ifRelation（阿岩 a_yan 好感 ≥40 免引荐）、精灵线 ifFlag。
- **dn_registry.js 注册**：ci 第 38 检查器"节点物理分区"要求前缀覆盖率 ≥97%，在 system 域 prefixes `"faction"` 后插入 `"fs"`（覆盖率 97.80%，4441/4541）。

## 二、写作与修复史（脚本归档 backup\scripts_archive\tmp\）

1. 中文引号转义炸 → fix_fs3_quotes.py 奇偶配对替换为中文“”（127 左/127 右）+ 治理词替换（微微→发起热来、轻轻→拿指节敲门、低声→压着嗓门、目光→视线、片刻→一阵）。
2. reg() 封装不被工具链识别 → fs3_toN.py 转 `N["id"]={...}`；fs3_fix_close.py `});`→`};`。
3. 首次验证暴露死链 36（fs_* 全死链）→ 补齐入边。
4. north 链缺口 → fs3_north.py 补 fs_north_01~04。
5. 链尾 run 注入（fs3_run_inject.py，36 节点）。
6. fs_watchers_01 被锚点替换截断缺闭合 → 修复。
7. 蓝图登记 39 项（fs3_blueprint.py + fs3_blueprint_fix.py，尾部锚点法）；**fs_north_01~04 补写后补登记（fs3_blueprint_north.py）**。
8. 节点分区 FAIL → fs3_registry.py 注册 fs 前缀 → 全绿。

## 三、如何验证

- 全链验证：node --check 26 块 → build（19 script 块，game_built.html 5,496,185 字符）→ Copy → chunks（43 个 JS 全 PASS）→ sync 四路一致（game=game_check=8,916,372B / chunked=index=6,157,088B）→ budget 自动更新（game_max 8,966,372 / chunked_max 6,257,088 / node_min 4,799）→ elda ci 38 检查器全绿（节点分区 97.80%、死链 0、预算门 6 项 PASS）→ smoke_test.py PASS（节点完整性 + 30 步推进 + 5 面板 + 存读档 + 结局触发）。
- bu 桌面 1280 实测（修复 curNode 后）：暗蚀会链完整闭环——点"前往打听"→ fs_eclipse_01 黑市接头 → 推门进后间（观察期）→ 接下投名状 → 戴面具入会 → `S.faction.joined=eclipse_society`、`V35_FACTION_STATE.joined=eclipse_society`、声望 +20。按钮禁用态正常。
