# QA_v57 职业体系总成工程 · 检验报告

- 版本：v57（在 v56 基础上）
- 权威源：`game.html`（8,110,202 字节）
- 开工备份：`backup\game_v57_before_career.html`（干净基线，语法校验通过）
- 报告日期：2026-09-08
- 验收结论：**通过（ALL PASS）**

## 一、交付内容总览

| 方向 | 交付物 | 数量 |
|---|---|---|
| 方向零 · 职业中枢 | CAREER_HUB_V57 + v57_careerPanel 七轨面板 + 联动结算 | 1 套（境界/技艺/流派/烙印/派系/传承/神位） |
| 方向一 · 流派 | FLOW_V57 27 流派 + 54 圣地节点（v57f_*）+ 成型判定 | 27 / 54 |
| 方向二 · 烙印 | JOB_BRAND_V57 27 烙印 + 108 危机节点（v57b_*）+ 计数/风险/抉择 | 27 / 108 |
| 方向三 · 派系 | ORDER_FACTION_V57 27 派系 + 131 任务节点（v57q_*）+ 22 派系事件 | 27 / 131 / 22 |
| 方向四 · 传承 | APPRENTICE_V57 9 条收徒线 + 54 收徒节点（v57l_*）+ 徒弟生成 | 9 / 54 |
| 强者扩展 | STRONG_EXTRA_V57 新登记 7 位命名 NPC（乌·森/雷·娜/火克/艾·德/霜辉/乌·黛/灰·珊） | 7 |

节点总数：**3,236**（指令要求 ≥3,035）
新增 S 字段：S.flow / S.jobBrand / S.factionRep / S.factionPower / S.apprentice / S.brandLog / S.flowPts（全部 v57_ensureDefaults 兜底）

## 二、引擎与钩子

- v57_ensureDefaults：链入 v56 兜底链，旧档零报错
- v57_featApply：判定链第 3 环（FEAT_EFFECT_V52 → v55_skillApply → v57_featApply → clamp），流派被动 / 烙印 gain / 烙印计数 / 烙印风险骰（level≥2 时 10%×level）均在此叠加，总修正封顶 +8 不变
- v57_breakthroughBonus：挂入 v52_breakthroughBonus，修炼场景烙印加成生效
- v57_factionEventTick：挂入 worldTick 两处（每周 5% 概率触发当前职业派系事件，入 S.missedEvents）
- 面板入口：顶栏「🗺职业之路」按钮；子面板 v57_flowPanel / v57_brandPanel / v57_factionPanel / v57_legacyPanel

## 三、构建验证（全量）

| 环节 | 结果 |
|---|---|
| 备份 | ✓ backup\game_v57_before_career.html |
| node --check 6/6（_v39_extract.py） | ✓ 全 PASS |
| 死链（_check_dead_links.py） | ✓ 0（节点 3382 / go 引用 6998） |
| 占位检查 | ✓ 仅 writeNext 兜底 1 处（允许） |
| _v57_audit.py | ✓ ALL PASS（27/27/27/22/54/108/131/54/引用/注入） |
| _v42_build_chunks.py | ✓ 分片 2731 节点，game_chunked.html 1,969,684 字符 |
| _v42_verify_chunks.py | ✓ 缺失 0 / 多余 0 / 死链 0 |
| _v42_chk_syntax.py | ✓ 15 JS 全 PASS |
| 四路同步 | ✓ game.html = game_check.html（8,110,202 字节）；game_chunked.html = index.html（3,086,691 字节） |

## 四、浏览器回归（bu 平面，file://）

| 回归项 | 结果 |
|---|---|
| 引擎运行 | ✓ 0 报错（v57 engine 无异常） |
| 职业之路面板 | ✓ 七轨渲染 + 职业身份卡（魔法师·human·「焰语者」）+ 子 tab |
| 流派成型 | ✓ 构造专长+技能+巅峰 → 成型度 80% → S.flow stage1 → 称号「焰语者」 |
| 流派子面板 | ✓ 三流派/成型度/核心技/圣地入口 |
| 烙印计数升级 | ✓ count 5→Lv1，15→Lv2 |
| 派系入派/站队/声望 | ✓ S.factionPower['魔法师']=fac_mage_keep，声望 +10 |
| 收徒生成 | ✓ v57_genApprentice → 林·德（敏锐，bond 10）→ apBond 35 |
| 危机节点 | ✓ v57b_魔法师_rebound_1 渲染（掌心裂痕，human-signal 达标） |
| 圣地节点 | ✓ v57f_魔法师_fire_1 渲染（星落塔·洛·晨雾联动） |
| 收徒节点 | ✓ v57l_魔法师_1 渲染（学院东廊初遇） |
| 派系事件 tick | ✓ v57_factionEventTick 可调用（本次未触发为概率未命中，正常） |
| 旧档字段兜底 | ✓ 清空 v57 字段 → ensureDefaults 重建 flow/jobBrand/factionRep/factionPower |
| console | ✓ 0 新错误，无软锁 |

## 五、开发中修复的关键问题（根因与处置）

1. **v57l_商人_4b 括号缺失**：节点结尾 `};` 应为 `};};`，导致 script2 语法错误（node --check 41681 行）。以唯一 marker 上下文精确 str.replace 修复。
2. **数据对象声明顺序颠倒（致命）**：FLOW_V57 / JOB_BRAND_V57 / ORDER_FACTION_V57 均为"先点属性赋值、后 const 声明"。引擎 IIFE 为 `"use strict"`，赋值未声明变量直接 ReferenceError，整个引擎 IIFE 崩溃 → window.v57_* 全部未定义、顶栏按钮失效。修复：在 data 占位块首插入 `const X = {};` 真声明，原 const 数据块改 `Object.assign(X, {...});` 合并。
3. **window.X 引用失效**：引擎函数内 `window.FLOW_V57` 等判断（const 在 IIFE 作用域不挂 window）导致 v57_flowCheck 恒 return。修复：引擎段内 `window.FLOW_V57` → `FLOW_V57`（闭包直接引用，共替换 11 处）。
4. **误伤教训**：`'],\n options:['` 宽松替换曾误伤 167 处既有代码，已全部按备份上下文恢复；后续一律精确锚点替换。

## 六、v57 三缺口收尾（已补齐，2026-09-08 追加）

| 缺口 | 状态 | 实现 |
|---|---|---|
| skillForm 技能形态 | ✅ 已落地 | 27 流派全部注入 `skillForm:{技能id:"形态描述"}`；flowPanel 新增"形态"渲染行（如"业火球：命中后，火星留在伤口里烧三息"）；顺手修复 flowPanel 内 `window.SKILLS_V55` 引用（顶层 const 不挂 window）3 处 |
| 圣地 stage 2/3 | ✅ 已落地 | 27 个 `v57f_XX_2` 节点函数体 return 前自动 `v57_flowStage(flowId,2)`（圣地剧情完成）；options 追加条件项"接受流派大师的认可"（`req:S.orgRank>=2`）→ 新增 27 个 `v57f_XX_3` 大师认可节点 → stage3；orgRank 不足时选项不显示（已实测 req0=false） |
| 流派切换 | ✅ 已落地 | 新全局函数 `v57_flowSwitch(flowId)`：500 金 + 1 巅峰点（S.peakPts），`S.flowOld` 暂存旧流派进度（可切回）；flowPanel 非当前流派卡片显示"改修此流派（500金+1巅峰点）"按钮；四种场景仿真全过（金不足拦截/巅峰不足拦截/正常切换扣减/切回再扣） |

补充说明：
- 烙印风险骰"代价失控"分支入口（v57_brandRisk 返回值）已具备，由节点侧挂载读取，属设计内。
- 注入 marker：`/v57inj:fix:skillform`、`/v57inj:fix:sanctuary`、`/v57inj:fix:flowswitch`，全部幂等。
- 收尾后节点总数 3,409（新增 27 个 _3 节点）；死链 0；_v57_audit ALL PASS；四路同步完成（game.html 8,138,863 字节 / game_chunked.html 3,092,979 字节）。

## 七、存档兼容

- localStorage 主键 `elda-qunxiong-v3-save` 不变
- S.saveVersion 保持 48（与 v50-v56 一致）
- 新增字段全部 v57_ensureDefaults 兜底（链入 v56_ensureDefaults），旧档读档零报错（已实测：清空 v57 字段后重建成功）

## 八、验证方式说明

- 语法：`python _v39_extract.py` 提取 6 script + `node --check _chk_0..5.js` 6/6
- 死链/分片：`python _check_dead_links.py` / `_v42_verify_chunks.py` / `_v42_chk_syntax.py`
- 内容审计：`python _v57_audit.py`
- 浏览器回归：`computer_use_tool`（bu 平面）file:// 加载 + V35 开发者控制台 eval 构造存档档，逐项验证引擎函数与节点渲染
- 四路同步：`Copy-Item game.html game_check.html -Force; python _v42_build_chunks.py; Copy-Item game_chunked.html index.html -Force`
