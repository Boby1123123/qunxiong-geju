# QA_v58eng2 检验报告

> 版本：V58-ENG 收尾工程（AI 味去味 + 全局模式收敛）
> 日期：2026-09-08 · 执行环境：Windows + Python 3 + eldacheck
> 基线：game.html 8,139,227 字节（备份 `backup\game_v58eng2_before.html`，开工前校验一致）

---

## 一、任务一：AI 味去味（P0）

| 项 | 结果 |
|---|---|
| 执行脚本 | `_v58eng_aifresh01~05.py`（4+1 个幂等脚本，精确锚点 + 块级 marker `/v58eng:aifresh:*`） |
| 替换总量 | **37 处**文本（11+8+4+12+2） |
| 覆盖节点 | 17 个 Top 节点全部触及（序章 3 / 封印线 4 / 圣辉城 3 / 其余 7） |
| 替换标准 | 只改腔调不改语义：似乎/微微/缓缓/莫名 → 具体动作、物件、可感知信号；按钮与选项分支文本（pickV 内）同步处理；不删剧情事实/数值/对话 |
| 复扫验证 | c_text 复扫 Top17 命中全部清零（seal_3_intro 保留 1 处「缓缓旋转」= 节点唯一抽象词，符合 ≤1 标准）；eldacheck --full「AI味 Top 节点 = **0**」 |
| 幂等性 | 脚本重跑安全：批3/批4 采用「节点块内分组替换 + marker 后注入」，容忍 c==0 skip |

## 二、任务二：28 项既有全局模式收敛（P1）

| 项 | 结果 |
|---|---|
| 甄别 | 28 项中 15 项为**真顶层隐式全局**，13 项为 c_structure **误报**（详见结构台账第六节） |
| 包裹 | **15 项 / 15 个 IIFE**（marker `/v58eng:iife/`），IIFE 70 → **85** |
| 模板 | `(function(){ /*v58eng:iife*/ <原语句>; window.X = X; })();`——原地放置、不移动代码、不加 'use strict'、不动函数体/调用点/内联事件引用 |
| 排除项 | curNode/sfxOn/ambNodes（let 多变量声明）、id/n/arr（箭头参数）、skillId/isAoe/reason/success（参数默认值）、type（SVG data-URI）、target/tab（局部/HTML）——包裹会破坏功能，明确不包 |
| 收敛效果 | c_structure「既有全局模式」28 → **13**（剩余 13 项全部为误报，已甄别记录）；引用健康 FAIL 0 / WARN 0 / PASS **253** |

## 三、构建验证（全量）

| 序号 | 检查 | 结果 |
|---|---|---|
| 1 | 备份 `backup\game_v58eng2_before.html` | 8,139,227 字节 ✓ |
| 2 | 任务一 4 批 + 补修 | 37 处替换完成 ✓ |
| 3 | 任务二 15 IIFE 包裹 | 完成 ✓ |
| 4 | `eldacheck --quick`（任务一后） | 6 script PASS / 死链 0 / 引用 FAIL 0 / 节点 3263 配平 0 / marker 27 无重复悬挂 ✓ |
| 5 | `eldacheck --full`（收尾后） | **十项全 PASS**（语法 6/6、死链 0、引用 FAIL 0 PASS 253、节点 0 问题、marker 0 悬挂、结构真泄漏 0、AI味 Top 0、引号/标点/口径 0、存档仿真通过）✓ |
| 6 | `_v42_build_chunks.py` | 分片 2758 条映射 / 死链 0 / 占位 1（writeNext 兜底，允许）✓ |
| 7 | `_v42_verify_chunks.py` | 多余节点 0 / 死链 0 ✓ |
| 8 | `_v42_chk_syntax.py` | 15 JS 全 PASS ✓ |
| 9 | 四路同步 | game=game_check=**8,140,357** 字节；chunked=index=**3,094,378** 字节 ✓ |

## 四、浏览器回归（bu 平面，file://）

> ⚠️ **会话中断说明**：回归中途浏览器自动化会话卡死（`bu.resync`/`snapshot` 连续 COMMAND_TIMEOUT），战斗判定横幅与读档后状态的实机观察未完成；已完成的项目如下，未完成项以静态验证覆盖。

| 项 | 结果 |
|---|---|
| 建号 → 序章 | ✓ 男/北境人/北方公国联盟/魔法师/凡骨之资/阅读/探寻真相 → 序章「铁门关·边境村庄」正常进入，行动面板/属性/金币/行动点正常 |
| console | ✓ 仅 3 条 `[V35] Module not found: core`（既有白名单日志），0 新错误 |
| V35 抽查（window 可见性） | ✓ choose/writeNext/advanceDays/renderTop/renderStats/writePar/showEnding/newGame/loadGame/applyEffects/effTarget 全部 `function`；COMBAT_TEXTS/ENDINGS/COMBAT 全部 `object`；v57_flowCheck/v57_flowSwitch/v57_brandCount/worldDelta/v44_showFloatText/v45_unlockReading 全部 `function` |
| 职业之路面板 | ✓ 七轨完整渲染（境界/技艺/流派/烙印/派系/传承/神位）+ 副 tab（流派/烙印/派系/传承/修行总览/巅峰盘/技能/组织/神器） |
| 存档 | ✓ 点存档按钮出现「已存档」提示 |
| 战斗判定横幅 | ⚠️ 未实机触发（会话中断）；判定链函数（choose/applyEffects/effTarget）window 可见且判定公式未动，静态验证覆盖 |
| 读档恢复 | ⚠️ 刷新读档观察被中断；存档仿真（c_save）通过、saveVersion=48、ensureDefaults 链 OK，静态验证覆盖 |

## 五、存档兼容

- localStorage 主键 `elda-qunxiong-v3-save` 不变 ✓
- S.saveVersion = 48（唯一写点）✓
- 本轮不新增 S 字段，无新增兜底需求；c_save 仿真通过（主键 OK / ensureDefaults 链 OK / 兜底字段全齐）✓

## 六、结论

**PASS**。两任务全部落地：AI 味 Top 节点 17 → 0；顶层隐式全局 15 项收敛为 window 显式导出；eldacheck --full 十项全绿；四路同步字节一致；引擎判定逻辑零改动（writeNext/choose/advanceTime/判定公式原样保留）。唯一缺口：浏览器回归的战斗判定与读档实机观察因自动化会话中断未完成，建议下次会话补做 1 次实机战斗 + 刷新读档抽查。
