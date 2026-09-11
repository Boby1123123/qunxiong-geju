# FS-2 加入路径机制（势力系统超大型更新 · 第 2 批）

批次日期：2026-09-11 · 项目：D:\1pao tuan\群雄割据 · 基线与 FS-1 衔接（FS-1 commit `dd0cf2a` 已 push）

## 一、扩了什么（为什么）

用户痛点：**"加入一个势力直接点击加入就可以，这是不可能的——需要知晓这个势力，通过公开招聘或成员引荐等各自独特的方式加入。"**

FS-2 在 FS-1（双系统合一，S.faction 对象化 + v35_doJoin 统一入伙）之上，为全部 11 个阵营建立"加入路径"机制：

1. **V35_FACTIONS 补齐两阵营**（src\script_04.js:2598 起）：`north` 北境联军（铁门关应征，joinRequirement military:20，色 #6ab8ff）、`desert` 沙漠诸部（绿洲集市，gold:50，色 #d8a860）——11 阵营全量对齐叙事线 8 势力 + V35 面板 9 势力。
2. **新增 `window.V35_JOIN_PATHS`**（script_04.js:2857，11 键）：每条 `{joinPath 文案, knownFlag, pathStart 链首节点}`：
   - light_church：信徒考核 / 礼拜 → 信仰检定 → 圣痕司受洗（fs_church_01）
   - eclipse_society：秘密接头 / 黑市暗号 → 观察期 → 投名状（fs_eclipse_01）
   - watchers：被邀请制，无 pathStart 链（打听完回 fc_tavern，不入伙——设计如此）
   - empire：军功考核（fs_empire_01）
   - free_cities：公开招聘 / 码头告示 → 李管事面试（fs_free_01）
   - orc_horde：力量试炼 / 猎狼献礼，阿岩引荐可免难（fs_orc_01）
   - dwarf_kingdom：工艺考核献兵刃（fs_dwarf_01）
   - elf_kingdom：自然亲和仪式（fs_elf_01）
   - abyss_cult：深渊接触 → 效忠（fs_abyss_01）
   - north：军功考核 / 铁门关应征（fs_north_01）
   - desert：商路利益 / 驼队首领引荐（fs_desert_01）
3. **新增 `window.v35_startJoinPath(fid)`**（script_04.js:2870）：已加入 → toast 拒绝；未加入 → 置 `fs_known_<id>` 旗标（"知晓势力"），关面板后若有 pathStart 节点则**跳转入伙链**，否则回退 v35_joinFaction（属性门槛）。
4. **面板势力卡按钮**（v35_renderFactionTab :3157，factions tab :3206 区）：按 `S.flags[knownFlag]` 切换——未打听到显示"前往打听"，已打听到显示"申请加入"。

## 二、如何验证

- node --check 全 26 块 PASS；四路字节一致（修复前基线 game=8,916,360B）；elda ci 38 检查器全绿（节点分区 97.80%、死链 0、性能预算门 6 项 PASS）；smoke_test.py PASS。
- bu 桌面 1280 实测：势力列表 11 张卡渲染（每卡声望条/盟友敌对/✦ 加入路径文案/按钮）；点"前往打听"后 `S.flags.fs_known_<id>` 置位、按钮切换为"申请加入"。

## 三、修复记录（关键）

- **根因**：`v35_startJoinPath` 调 `writeNext(jp.pathStart)` 但未先设置 `curNode`，writeNext 渲染的是旧节点（writeNext 用闭包变量 curNode，见 script_03.js:359；跳转必须先 `curNode = id; writeNext();`，与调试面板 jump script_04.js:8980 同款写法）。
- **修复**：script_04.js:2881 改为 `curNode = jp.pathStart; writeNext();`。备份 backup\FS4_20260911\script_04_preCurFix.js。
- 修复后实测：点"前往打听"（eclipse_society）→ curNode=fs_eclipse_01、正文渲染黑市接头场景、fs_known_eclipse 置位。
