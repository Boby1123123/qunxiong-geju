# QA_v14.5 检验报告

## 版本信息
- **版本**: v14.5 收尾+主角身份修正
- **构建时间**: 2026-09-06
- **主交付物**: `game.html` (2,103,041 字节)
- **节点总数**: 690 (v14: 688, +2)
- **选项总数**: 1223
- **RULESET_ID**: `elda-qunxiong-v3`

## 本次修改内容

### 任务一：c/d文件check选项tier补全（9处）
**story_elda_c.py**（7处）：
1. xueshu_bookshop 阅读选项 - 补全fail/critfail
2. shangzhan_knife 买刀选项 - 补全fail/critfail
3. shangzhan_knife 盘问选项 - 补全fail/critfail
4. shangzhan_market 挑材料选项 - 补全fail/critfail
5. gangkou_ships 勘查空船选项 - 补全fail/critfail
6. gangkou_ships 打听内幕选项 - 补全fail/critfail
7. gangkou_han 约定同行选项 - 补全crit/fail/critfail

**story_elda_d.py**（2处）：
1. dwarf_workshop 观摩锻打选项 - 补全fail/critfail
2. dwarf_workshop 淘材料选项 - 补全fail/critfail

每处补全均包含：判定过程演出 + 得失明细（HP/金币/声望/SAN/线索）+ 自然过渡，失败有意义不羞辱，大失败有补救路径。

### 任务二：主角身份全量修正（核心）

**问题**：v14中ORIGIN_FULL写死主角=普路托斯·德·美第奇，但实际主角是玩家捏人的角色。

**修正范围**：

**story_elda_p.py**：
- `ORIGIN_FULL` → 重命名为`MEDICI_HEIR_DATA`，标注为条件触发数据
- 新增`ORIGIN_GENERIC`：6种通用出身线索池（孤儿/平民/贵族/商人/军人/学者）
- `MEMORY_FRAGMENTS` → 重命名为`MEDICI_MEMORY_FRAGMENTS`
- `origin_clue`节点：text/options全部函数化，根据`S.flags.medici_heir`条件显示
  - 非继承人：显示通用出身线索+调查选项
  - 继承人：显示美第奇记忆碎片系统
- 新增`origin_generic_clue`节点：6种出身各有独特线索
- 新增`origin_medici_hint`节点：非继承人可通过调查发现美第奇传闻，确认身份后激活继承人线
- `memory_view`/`memory_unlock`：增加medici_heir前置检查
- `mother_rescue`/`origin_choice`：增加medici_heir前置检查
- `reunion_alex`：text函数化，非继承人时亚历山大以同学身份对话，继承人时以弟弟身份对话

**story_elda_i.py**（关键节点条件化）：
- `i_origin_recall`：text函数化，非继承人显示通用梦境，继承人显示美第奇徽章梦境
- `i_origin_memory_fragment`：crit函数条件化，非继承人显示通用记忆
- `i_origin_alexander_truth`：text函数化，非继承人中亚历山大讲述自己的故事，继承人时以"我们的父亲"讲述
- `i_origin_brothers_unite`：text函数化，非继承人时为"朋友"，继承人时为"兄弟"
- `i_watchmen_why_me`：text函数化，非继承人时奥雷利安给出"特质/选择"的通用理由，继承人时点明美第奇预言

**story_elda_j.py**：
- 美第奇家族secret字段：从"主角普路托斯是..."改为"洛伦佐有一个亲生儿子（普路托斯）...若玩家激活美第奇继承人线则与玩家重合"

**修复的bug**：
- p.py中11处重复`effect`字段（`effect:{flag}, go, effect:{time}`）导致flag/rep/sanLoss效果被time覆盖，已全部合并为单effect
- origin_medici_hint节点tier闭合括号错误（多一个`}`）

### 验收结果
- ✅ 非美第奇出身角色：origin_clue不出现"普路托斯"，显示通用出身线索
- ✅ 美第奇继承人角色：origin_clue正常显示普路托斯身世线
- ✅ 非美第奇角色i_origin_recall梦境不出现"美第奇家族的徽章"
- ✅ 世界线旁白（七印/深渊/战争）不依赖主角特定身份

## 校验结果

### 构建校验
```
build OK -> game.html bytes: 2,103,041
==================================================
节点总数: 690 | 选项数: 1223 | go 目标: 508
ERRORS: 0
WARNS: 2 (city_free/travel 为既有节点，非新增问题)
RESULT: PASS
```

### JS语法校验
```
node --check _check_0.js  PASS
node --check _check_1.js  PASS
node --check _check_2.js  PASS
node --check_3.js  PASS
ALL PASS
```

### 浏览器回归
- **控制台错误**: 0
- **测试1**: 非美第奇角色origin_clue → 不含"普路托斯" ✅
- **测试2**: 美第奇继承人origin_clue → 含"普路托斯" ✅
- **测试3**: 非美第奇角色i_origin_recall → 不含"美第奇家族的徽章" ✅

## 剩余缺口
1. **i.py深层美第奇节点**：i_origin_medichi_archive、i_origin_alexander_public、i_origin_heresy、i_origin_traitor等约8个节点仍假设玩家是美第奇后裔。这些节点在亚历山大羁绊线深处，非继承人玩家进入时会看到亚历山大的故事（可接受），但部分"你/我们"的称谓仍需进一步条件化。
2. **飞书GDD更新**：v10-v14.5日志待更新（本次执行中完成）
3. **捏人界面出身选择**：当前捏人界面尚未明确提供"美第奇家族出身"选项，玩家需通过origin_medici_hint调查线激活继承人身份。后续可在捏人界面增加出身选择。

## 文件清单
| 文件 | 修改内容 |
|---|---|
| game.html | 主交付物（2,103,041字节） |
| story_elda_c.py | 7处tier补全 |
| story_elda_d.py | 2处tier补全 |
| story_elda_p.py | 主角身份条件化+2新节点+11处effect合并修复 |
| story_elda_i.py | 5处关键节点text条件化 |
| story_elda_j.py | 美第奇secret字段修正 |
| build_elda.py | 无变化（已集成m/n/o/p） |
| static_check_elda.py | 无变化 |
