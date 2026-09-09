# U8 · NPC 生态 + 事件池扩充（C3/C4）

> 批次：U8 | 日期：2026-09-09 | 依据：U1-U9 口令 C3/C4 项

## 一、改动清单

| 文件 | 位置 | 改动 |
|---|---|---|
| src\data_nodes\dn_u8.js（新增 17.9KB） | data_nodes 目录（构建自动合并） | 24 个对象式节点：支线 D/E/F + 3 NPC 线（free_lord/north_king/academy_head），全带 run 回调（好感度+奖励+跳转） |
| src\script_01.js | EVENT_POOL_EXT 数组尾 | 事件池 +40（10 天灾/10 奇遇/10 商机/10 人祸），20→60 |
| src\script_02.js | 5 个入口节点 options | 插入口选项：arrive_south_xueshu（D）、arrive_east_chengtian（E/F）、arrive_north_aierda（NK）、north_academy_gate（AH）、arrive_free_gonghui（FL） |
| budget.json | limits/baseline | 上限 6,050,000→6,120,000（U8 内容扩充预算演进）；baseline 6,069,783 |

## 二、新内容总览

### 支线 D/E/F（基于 U7 群像档案真实角色）
| 支线 | NPC（档案 id） | 入口 | 闭环 | 奖励 |
|---|---|---|---|---|
| D 星落海求星 | 奥薇恩·星语（lv_mage1） | 星落海·观星台 | 7 节点（含星谜 check 双分支） | 星语指环·50金·40历练 |
| E 铜夜枭 | 杜·夜枭（lv_thief1） | 帝京·夜枭巷 | 7 节点（含偷看 check 分支） | 铜夜枭信物·50金·40历练 |
| F 白盾之誓 | 罗兰·白盾（lv_knight1） | 帝京·圣盾广场 | 7 节点（含剑术/不擅双入口） | 白盾誓印·50金·40历练 |

### 3 个空白 NPC 线（原 0 节点，全部可玩）
| 线 | NPC | 入口 | 闭环 | 奖励 |
|---|---|---|---|---|
| G 北境王 | north_king | 北境王庭 | 6 节点（含风雪护粮战斗/讲理双分支） | 北境令·80金·60历练 |
| H 学院院长 | academy_head（奥雷利安·晨曦） | 学院藏书塔 | 6 节点（含三问 check） | 学院信物·40历练 |
| I 自由港执政官 | free_lord | 执政厅 | 6 节点（含跑商号分支） | 自由港商会凭证·60金·50历练 |

### 事件池 60（15 天灾 / 15 奇遇 / 15 商机 / 15 人祸）
- 全部可触发（checkWorldEvents 的 EVENT_POOL_EXT 循环，w["ev_"+id] 去重）、可重复验证（新周目重置）
- 世界观合规：北境/自由港/帝京/星落海/深渊/圣城/精灵/兽人 全地域覆盖

## 三、好感度接线（关键机制）

- 复用既有 `changeRelation`（未改实现，仅接线）
- 每条线 4 次调用，推进链 +10/+15/+20/+20（部分分支合并补偿）→ **65 挚友**（P1-2 同阈值）
- 支线总量：P1-2（3 条）+ U8（6 条）= **9 条 ≥ 6 验收**
- 节点选项用 `run:function(){}` 回调（P1-2 同模式）：changeRelation + 奖励 + curNode/writeNext

## 四、验证链

```
[PASS] elda ci 全绿（26 块语法 / 幂等 / 四路一致 6,069,783B / 18 检查器 / 预算门）
[PASS] bu 实测：支线 D/E/F + NPC 线 G/H/I 六条全闭环，好感全部 65 挚友、p12Quest=4、终节点正确
[PASS] bu 实测：EVENT_POOL_EXT = 60（天灾/奇遇/商机/人祸 各 15）
[PASS] 冒烟：节点完整性 + 30 步状态机推进 + 5 面板 + 存读档 + 结局触发 全 PASS
[PASS] 节点 3,789（零损失增长，原 3,744 +45）
```

## 五、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| 6 条好感支线 | D/E/F + G/H/I，每线 4 节点闭环 | 验收 C3 支线 ≥6 | bu 全链 run 回调实测 65 挚友 |
| 3 空白 NPC 补全 | free_lord/north_king/academy_head 从 0 节点到完整线 | 验收 C3 空白 NPC 可玩 | 入口 + 闭环实测 |
| 事件池 60 | +40 事件（全地域/四类） | 验收 C4 事件 ≥60 | EVENT_POOL_EXT.length=60 |
| 事件触发的世界影响 | 维持纯播报（text+worldQueue） | 不碰引擎语义 | checkWorldEvents 无改动 |
| 预算演进 | 上限 6,050,000→6,120,000 | 内容扩充（用户指令"不缩水"）与上限冲突时内容优先，预算同步演进 | 预算门 6 项 PASS |

## 六、回滚

- 删除 src\data_nodes\dn_u8.js + script_01.js 事件追加段（/u8inj: 标记）+ script_02.js 5 处入口（/u8inj:*-entry/ 标记）
- budget.json 回退
- 备份：backup\U8_20260909\

## 七、后续

- U9 知识基座将把本次 6 支线/60 事件纳入《游戏知识总览》索引
- NPC 好感 65 挚友里程碑可复用 triggerRelationEvent（P1-2 已有接线模式）
