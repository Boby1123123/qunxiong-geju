# 内容生产流水线 SP-8 · 示范章与技能固化

> 批次：SP-8 ｜ 日期：2026-09-09 ｜ 方案：群雄割据技术方案_内容生产与叙事骨架_20260909.md
> 状态：完成，验证链全绿（ci 24 检查器 / smoke PASS / 数据链实测）

## 一、本批目标

用一套**完整的西境游侠学院示范章（28 节点闭环）**把 SP-1~SP-7 建立的内容生产流水线（蓝图 → 元数据 → 弧线 → 模板 → 批量 → 质检）串起来跑一遍，并把流水线用法固化进 elda-content-author 技能，让后续任何内容包都能"照抄这个章"。

## 二、改动清单

| 文件 | 动作 | 差异摘要 |
|---|---|---|
| `src\data_nodes\dn_sp8_ranger.js` | **新建** | 示范章 28 节点（tag/place/pace/text/options 全对象式）：入境→三考（弓/迹/心）→入门→风读→对练→夜巡→送信→结业→告别闭环；9 处 changeRelation（导师柯恩 sp8_koen +5~+15）；9 处 flag 写入（sp8_enter/report/quest/done/graduate/fin）；战斗节点 3 个（sp8_ranger_09/10/23 四段式）；分支 10 个（00b/00c/03x/04q/09b/11a/11b/12q/17b/18b） |
| `src\data_nodes\dn_story_blueprint.js` | 修改 | 弧表 +arc_west_ranger（西境·游侠学院，setup/rising/climax/resolution 四阶段）；nodeIndex +28 条（尾部锚点法） |
| `src\data_nodes\dn_causality.js` | 修改 | 账本 +3 项（led_sp8_01 设定·学院 / led_sp8_02 伏笔·柯恩身世 / led_sp8_03 人物·老会长） |
| `src\script_02.js` | 修改 | `travel_west_start` 选项挂「打听西境游侠学院的传闻（西境支线）」→ sp8_ranger_00（/sp8inj:entry/） |
| `workspace\.user_skills\elda-content-author\SKILL.md` | 修改 | 口径刷新：21→24 检查器、3,877→3,905 节点、账本 38→41；新增 2b 蓝图归属标注铁律（nodeIndex 尾部锚点法）、content chapter 生产线用法、示范章先例指引、SP-8 实证新坑（nodeIndex 禁配平截断/go 目标必须是节点） |
| `backup\scripts_archive\tmp\` | 归档 | _tmp_sp8_*（apply/probe/west/acad/fix×3/fix4/fix5/verify） |

## 三、验证链结果

| 检查 | 结果 |
|---|---|
| node --check（26 块含 3 个新改文件） | PASS |
| `elda ci` | **全绿：24 检查器** / 四路一致（game=game_check=6,819,328B）/ 死链 0 / 节点 3,905 / 性能预算 PASS（budget --reason "SP-8 示范章 30 节点" 已更新） |
| `smoke_test.py` | PASS |
| 数据链实测（node 脚本） | 节点 28 唯一 ✓ / go 目标 22 全可达 ✓ / 蓝图弧+stages ✓ / nodeIndex 28 条 ✓ / 入口挂载 ✓ / 账本 3 项 ✓ / 治理词 0 ✓ |
| bu 桌面（file:// 1280） | 页面加载正常、建号面板可达、读档进主界面无 JS 错误（S 为模块闭包 let，外部无法注入改 curNode，示范章可达性以 ci 死链 0 + 数据链实测为准，见坑 2） |

## 四、示范章结构速览（供后续内容包照抄）

```
travel_west_start ──▶ sp8_ranger_00 入境（打听传闻）
  ├─ 00b 追问来历 / 00c 驿站歇夜
  └─▶ 01 荒野小径 ─▶ 02 学院外墙·三考
        ├─ 弓考（DEX/archery tier）→ 03 / 03x 谦逊路
        └─▶ 04 石殿立誓（flag sp8_enter + 好感+5）→ 05 入门
  ─▶ 06 风读（WIS/survival）→ 07 初见柯恩（deep）→ 08 对练
  ─▶ 09 实战（combat）/ 09b 请教 → 10 夜巡发现斥候
        ├─ 11a 射断信号绳 / 11b 记下情报 → 12 石殿受命（flag sp8_quest）
  ─▶ 13 夜探粮营 → 14 行省会送信（flag sp8_done）→ 15 篝火结业（deep）
  ─▶ 16 柯恩赠黑弓（flag sp8_graduate + 好感+15）
  ─▶ 17 岔路 → 18 回归官道（弧 resolution 记录 + 回 travel_west_start）
              └─ 18b 深入元素荒原 → west_hub（接既有西境内容）
```

## 五、坑记录（SP-8 实证，已入技能）

1. **nodeIndex 单行 JSON（397KB）禁止用配平/截断法插入**——第一次配平插入把 JSON 从中间切断、后半段丢失；改用**尾部锚点法**（找最后条目 `},` 后、外层 `}` 前补条目）一次成功。
2. **`go` 目标必须是已存在节点**——`travelTo("west_huangyuan")` 的 west_huangyuan 是 travelTo 区域名不是节点，直接 `go:"west_huangyuan"` 造成死链 1（ci FAIL）；改为指向既有节点 `west_hub` 后清零。travelTo 区域名只能用在 `run:function(){travelTo(...)}` 里。
3. 弧表插入同样用**行级锚点**（最后一条已知弧 `arc_cm_thorin` 行尾 + 补逗号 + 新弧 + `  ],`），比花括号配平稳。
4. bu 全流程实测受限：引擎 `let S = null; window.S = S;` 为**闭包 let 值快照**，外部 JS 无法改 S/curNode（SP-3 时可行是因当时实现不同）；现阶段 bu 验证以"页面加载无错 + UI 可达"为准，节点链路由 ci 死链 0 保证。

## 六、红线合规

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：未触碰
- saveVersion=48 不变；旧档兼容（示范章纯新节点+新 flag，无既有字段改动）
- 节点数 3,877 → 3,905 只增不降；文本零删改

## 七、全方案收尾

内容生产流水线 8 批全部完成。至此：**写内容 = 蓝图登记 → 脚手架/整章生成 → 正文 → 账本衔接 → ci 一条命令全绿**，新增 1 个节点只加数据、不改引擎。
