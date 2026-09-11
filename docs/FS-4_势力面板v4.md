# FS-4 势力面板 v4（势力系统超大型更新 · 第 4 批）

批次日期：2026-09-11 · 项目：D:\1pao tuan\群雄割据

## 一、扩了什么（为什么）

FS-1~3 解决了"怎么加入"，FS-4 让加入后的**面板体验闭环**（总览/任务/外交/战争四 tab 完整化）：

1. **V35_FACTION_QUESTS 补齐两新阵营任务**（script_04.js:2734 起，watchers 后追加）：
   - north 北境联军 4 条：no_1 雪原巡逻（combat / rep+15 gold+40）、no_2 军械清点（diplomacy / rep+15 gold+60）、no_3 兽潮预警（exploration / rep+25 gold+80）、no_4 新兵教习（training / rep+30 gold+100）
   - desert 沙漠诸部 4 条：de_1 商路护卫（travel / rep+15 gold+50）、de_2 水源测绘（exploration / rep+20 gold+60）、de_3 部族调停（diplomacy / rep+25 gold+80）、de_4 沙暴先知（ritual / rep+30 item sand_charm）
2. **总览 tab 新增"退出势力"按钮**（script_04.js v35_renderFactionTab，晋升职位按钮后）：confirm 提示 → v35_leaveFaction() + 重渲 overview——加入不再是单向不可逆。
3. 面板 tab 结构确认：总览 / 势力列表 / 势力任务 / 外交 / 战争。

## 二、如何验证

- node --check 26 块全 PASS；elda ci 38 检查器全绿；smoke PASS；四路字节一致（最终基线 game=game_check=8,919,689B / chunked=index=6,157,428B，蓝图补登记后）。
- bu 桌面 1280 实测：入伙暗蚀会后——总览显示已加入（晋升职位 + 退出势力按钮均在）；势力任务 tab 显示"情报收集 剩余26天 / 收集教会的情报 / 完成任务"；接取/完成任务按钮可用。

## 三、修复记录（关键）

- **v35_startJoinPath curNode 修复**：FS-2 遗留根因（writeNext 未设 curNode → 渲染旧节点），script_04.js:2881 加 `curNode = jp.pathStart;` 前置赋值。修复后浏览器实测入伙链完整可走（见 FS-2/FS-3 文档）。备份 backup\FS4_20260911\script_04_preCurFix.js。
- 备份：backup\FS1_20260911\script_04_preFS2.js / script_04_preFS4.js / script_03 与 dn_faction 快照。

## 四、验收对照（docs\N-4_势力系统超大型实施.md 五）

- 11 势力全部"知晓→申请→入伙链→加入"闭环（watchers 被邀请制例外，设计如此）；S.faction 对象 + V35_FACTION_STATE 双语义统一；总览/任务/外交/战争四 tab 可用；退出势力可逆；saveVersion=48 不变、旧档兼容（applyDefaults 对象默认 + 字符串迁移）、四路一致、elda ci 全绿、smoke PASS、bu 实测无回归。
