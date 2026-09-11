# FS-6 考核链深化（兽人三试炼 / 精灵信物 / 守望者被邀请链）

- 批次：FS-6 · 2026-09-11 · 备份：`backup\FS5_20260911\`
- 依据：docs\N-4_势力系统超大型实施.md 验收项③④（未落地部分）
- 改动文件：`src\data_nodes\dn_fs_join.js`（+7 节点、+3 处选项追加、1 处遗留修复）、`src\data_nodes\dn_story_blueprint.js`（+7 登记）、`src\data_nodes\dn_causality.js`（+2 账本）

## 一、改动内容

### 1.1 兽人王庭三试炼（验收项④·兽人线）

`fs_orc_01` 追加选项"不挑对手——问老人草原上最狠的试炼是什么" → 新节点：

| 节点 | 内容 | 判定 |
|---|---|---|
| `fs_orc_trial` | 三择：北坡会狼王 / 山脚猎双狼 / 赤手会三个年轻战士撑一炷香 | 各选项 check 体格+战意，tier ok/fail/crit |
| `fs_orc_trial_done` | ifFlag 三态正文回响（狼王/双狼/赤手不同收尾） | 纯文本变体 |
| → go `fs_orc_03` | 接回原入伙链 | |

**为什么**：王庭认本事不认出身，用"三试炼"把加入过程从一句话变成可玩抉择；三路不同判定让不同 build 有不同最优解。

### 1.2 精灵信物（验收项④·精灵线）

`fs_elf_01` 追加选项"解开腰间旧物递过去" → 新节点 `fs_elf_trial`（母亲缝的布包——信物叙事，扣精灵重传承/信物的族性）→ go `fs_elf_02`。

**为什么**：精灵线入伙原为干巴巴的流程，信物一节点补足情感锚点与人设合理性。

### 1.3 守望者被邀请链（验收项③·核心）

`fs_watchers_01`（打听扑空）追加"在旧钟楼附近客栈住下等门开" → 新链：

| 节点 | 内容 |
|---|---|
| `fs_watchers_02` | 夜半叩窗：铜哨+信"钟楼顶，天亮前，吹三声"；两择：赴约 / 压信错过 |
| `fs_watchers_02b` | 错过支线：信纸自淡不去则错过（可补去），保留"被邀请"真实感 |
| `fs_watchers_03` | 灰袍人三问（SPR/soul 道心判定，tier ok/fail/crit；fail 也放行——守望者"看人"不"筛人"，+30 修为） |
| `fs_watchers_join` | 城西废仓立誓 → `run v35_doJoin("watchers")` → go fc_tavern |

**为什么**：被邀请制是守望者核心设定（led_fs6_watch 账本化），原实现只有"打听扑空"一句，不可玩。新链把"不招募只认人"变成完整可玩剧情：打听扑空 → 被观察 → 收到铜哨 → 赴约受考 → 立誓。

### 1.4 遗留修复

`fs_eclipse_04` 双 run 键（FS-3 时代注入产物，JS 合法但冗余）合并为单 run，消除隐患。

## 二、登记

- 蓝图 nodeIndex +7：fs_orc_trial/fs_orc_trial_done（vol_race+arc_fac_orc）、fs_elf_trial（vol_race+null）、fs_watchers_02/02b/03/join（vol_free+null）
- 账本 +2：`led_fs6_watch`（守望者被邀请制，plant fs_watchers_01_done / reap fs_watchers_joined，open）、`led_fs6_orctrial`（王庭三试炼，plant fs_orc_trial_king / reap fs_orc_trial_pack，closed）

## 三、验证链结果

- `node --check`（dn_fs_join / dn_story_blueprint / dn_causality）PASS
- `elda ci` 38 检查器全绿（含死链 0、节点分区覆盖率 97.80%、账本核销）→"全部通过（可发布）"
- `smoke_test.py` PASS
- 四路字节一致：game=8,948,511B / chunked=6,168,922B
- bu 桌面 1280 实测（新档→自由城）：势力列表？？？未知态 ✅ → 守望者"前往打听"→ 打听扑空 ✅ → 客栈等门开 → 铜哨信 ✅ → 灰袍人三问判定（fail 分支+30修为）✅ → 城西废仓立誓 → 加入守望者 ✅ → 总览"专属能力：soul_sight / soul_mind_read" ✅
- 兽人三试炼/精灵信物节点：以 ci 死链 0 + smoke PASS 覆盖（同批同机制写入，走自由城档无法直达草原，待后续草原档实测）

## 四、红线核查

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：零触碰
- saveVersion=48 不变；applyDefaults 兜底链不变
- 新节点全部对象式 `N["id"]=` 直赋、带 pace、进蓝图、涉设定同步账本
- 中文引号成对、V66 文风、治理词约束；节点数只增不降（4,856）
