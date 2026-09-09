---
name: elda-story-guard
description: 群雄割据（艾尔达大陆）专属设定一致性守护技能。当用户要求检查新剧情/新节点/新内容是否与既有世界设定冲突、核对伏笔账本（CM-3）、校验设定词覆盖率、审查人物行为是否符合人设（OOC）、检查时间线与势力立场连续性，或在新内容写作前后做设定一致性把关时使用。封装该游戏的世界设定 bible（8 势力/五主线 day/五类天灾/教廷政治/7 商品市场/因果链/金秤家族/关键人物与地点）、因果账本核销规则（dn_causality.js 38 项 + 20 设定词冻结 + flag:/node:/关键词锚点语法）、以及 elda content causality 等机器校验命令。触发词：设定一致、设定冲突、OOC、人设、账本、伏笔、核销、设定词、时间线矛盾、检查剧情。不用于：写新内容本身（用 elda-content-author）、引擎/UI 改造。
---

# 群雄割据设定一致性守护（elda-story-guard）

在**写作前**（预检）与**写作后**（终检）两道关口，确保新内容与《艾尔达大陆·群雄割据》既有世界设定严格一致。核心原则与用户 AGENTS.md 一致：**不能遗忘设定、不能修改已定设定、不违背人设**。

## 两道关口

### 关口 1 · 写作前预检（Pre-flight）
新内容动笔前，对照以下四问，发现潜在冲突先停下：
1. **人物**：涉及既有角色（金秤家族/鬃吼/腐光/秦·长风/灰鬃/林歌/灰袍若耶/艾德蒙/沈砚/白驼/大汗/青叶/枢机·克莱门特/枢机·奥黛拉 等）时，行为/口吻/立场是否符合其人设档案（读 `references/setting-bible.md` 人物表）？
2. **地点**：地名是否用既有名（自由港/铁门关/北境王都/圣辉城/晨天城/西境三城/死亡沙漠五城/银月祭坛/铁砧议会/圣山/祖灵洞）？新地点必须先登记 REGIONS 或按内容包流程补挂，不得凭空出现。
3. **时间线**：day/季节/五主线触发日（purge 60 / silver 120 / seal 200 / academy 250 / orc 280）是否冲突？事件 day 是否与五主线 ±5 天内撞车？
4. **势力立场**：8 势力关系矩阵（敌对 <-60 / 同盟 >60）是否被新剧情扭曲？教会/学院/深渊的基线立场不可反转。

### 关口 2 · 写作后终检（Post-flight）
内容完成后跑机器校验 + 人工清单：
1. **账本**：`python -X utf8 tools\elda\elda.py content causality`——新伏笔是否登记（plant/reap/status/world 四字段合法）、open 项是否有意保留、设定词覆盖率是否 100%。
2. **设定词**：20 冻结词每词必须出现在所属卷域文件（CAUSALITY_WORDS 的 file 字段）；新关键设定入冻结表须谨慎（仅跨卷防遗忘级）。
3. **全文一致性扫描**：对新增文本跑 `elda text guard`（治理词）+ `elda content chain`（死链）+ `elda content dup`（节点 id 唯一）。
4. **人工清单**：按 `references/consistency-rules.md` 逐项打勾（OOC/地名/时间/势力/经济/存档字段）。

## 必读引用（按需）
| 引用 | 何时读 |
|---|---|
| `references/setting-bible.md` | 任何涉及既有设定/人物/地点的新内容（预检与写作中） |
| `references/consistency-rules.md` | 终检人工清单 + 常见违规样例 |
| `references/ledger-check.md` | 账本登记/核销/设定词冻结的操作细节 |

## 机器校验命令速查
```powershell
cd D:\1pao tuan\群雄割据
python -X utf8 tools\elda\elda.py content causality   # 账本核销 + 设定词覆盖率
python -X utf8 tools\elda\elda.py content chain       # 死链（0 孤儿）
python -X utf8 tools\elda\elda.py content dup         # 节点 id 唯一（重复 0）
python -X utf8 tools\elda\elda.py text guard          # 治理词/引号/标点
python -X utf8 tools\elda\elda.py ci                  # 21 检查器全量门禁
```

## 铁律
- **不得删改既有账本项**；open 项只能由新内容核销为 closed（reap 锚点成立才改）。
- **不得自创新设定与账本冲突**（如新势力违反 8 势力矩阵、新人物顶替关键角色）。
- 冻结词缺失 = ci FAIL（c_causality）；遇 FAIL 立即停止修复，不绕行。
- 新地域专有地名（如西境元素荒原）默认不入冻结表，登记账本即可（先例：dn_west.js 头注释）。
