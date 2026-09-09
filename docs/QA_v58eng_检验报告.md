# QA_v58eng 检验报告（工程质量工程）

> 日期：2026-09-08 · 权威源 `game.html`（4,443,887 字符）· 命令 `python tools\eldacheck\eldacheck.py --full`

## 一、本版目标

把分散的历史验证链合并为一条命令、30 秒内给出全绿或精确到行号的失败清单；根治"检测工具过时、问题无法快速反应"。

## 二、执行结果

| 检查项 | 结果 | 关键数据 |
|---|---|---|
| 1. 语法（node --check） | ✅ PASS | 6/6 script |
| 2. 死链 | ✅ PASS | go=7052 / 节点=3409 / 死链=0 |
| 3. 引用健康 | ✅ PASS | FAIL=0 / WARN=0 / PASS=241 |
| 4. 节点格式 | ✅ PASS | 配平=3263 / 问题=0 |
| 5. marker 台账 | ✅ PASS | 27 种 / 重复=0 / 悬挂=0 |
| 6. 结构健康 | ✅ PASS | 真泄漏=0 / 既有全局模式 28（建议收敛，非阻塞） |
| 7. 文本质量 | ✅ PASS | AI味Top=17（清单化）/ 引号=0 / 半角=0 / 口径=0 |
| 8. 存档兼容 | ✅ PASS | 主键OK / saveVersion=48 / 兜底字段全齐 |

耗时：--quick 约 2s，--full 约 10s。

## 三、本版修复的引用健康问题（12 项真实 bug）

1. `window.S&&S.worldState` ×7 → typeof 兜底（**v53 will 触发条件此前全部静默失效**）
2. `window.v47_worldDelta` → `window.worldDelta`（**势力事件效果此前不落地**）
3. `window.v44_floatText` → `window.v44_showFloatText`（**v55 施放飘字此前从未显示**）
4. `window.v44_toast` → `window.v44_pushToast`（**v55 技能习得提示 toast 此前从未弹出**）
5. `window.ErrorLog` → typeof 兜底（catch 错误记录恢复）
6. `window.ToastCenter` → typeof 兜底（未实现对象，行为不变）
7. `window.unlockReading` → `window.v45_unlockReading`（v53 可读物解锁桥恢复）
8. `window.v52_jobCn` 补导出（v57 桥优先路径恢复）
9. ELDA.getNodes `window.N` → 裸 N 优先（行为不变，消隐患）
10. RIVALS_V52 读取 → 裸引用优先（行为不变）
11. `S.saveVersion = 46` ×4 → 48（存档版本号与现行一致）
12. （工具层）c_refhealth 白名单 + 隐式全局识别 + 兜底识别

## 四、检查器精度改进（消除假阳性）

| 检查器 | 改进 | 效果 |
|---|---|---|
| c_refhealth | 修正则防截断、作用域深度、隐式全局赋值识别、typeof 兜底识别、音频 API 白名单 | FAIL 254→148→12→0 |
| c_nodes | 括号配平 depth 从 1 起算（函数体 `{` 计入）、text/options 键存在性判定 | 14 假阳性→0 |
| c_markers | 子名 marker（`-sub` / `:sub`）识别 | 重复 2→0 |
| c_structure | 顶层作用域泄漏判定 + 有引用/无引用分级 | 265 误报→真泄漏 0 |
| c_text | "炼金术士"合法语境豁免 | 口径 2→0 |
| c_save | ensureDefaults 双形式提取 + 全文字段引用核对 | 覆盖判定修正 |

## 五、浏览器回归（bu 平面 file:// · 已执行 2026-09-08）

- [x] `eldacheck --full` 全绿（10s）
- [x] 建号（男/人类/北境人/自由城邦/魔法师/凡骨/阅读/探寻真相）→ 序章 → 行动面板：console 0 错误，ELDA 调试面板错误数 0
- [x] 职业之路面板七轨渲染正常：流派 flow_mage_door(1/3) / 烙印 无 / 派系 未站队 / 传承 未收徒 / 神位 组织Lv0·未登神 / 底部九功能按钮可用
- [x] V35 控制台抽查：`typeof v57_flowCheck / v57_flowSwitch / v57_brandCount / window.v57_flowCheck` 全部 `"function"`（v57 引擎导出健康）
- [x] 刷新读档：console 0 错误，页面正常渲染
- [x] game.html 与 game_check.html / game_chunked.html 与 index.html 字节一致（8,139,227 / 3,093,341）

## 六、遗留建议（非阻塞）

1. 28 项既有全局模式（script2/3/4 顶层 `X = function`）建议后续版本包 IIFE 收敛。
2. 4 个字段（worldChronicle / arcProgress / foreshadowing / saveVersion）兜底在 initState/读档路径而非 ensureDefaults，已人工确认为合法，可后续迁入 ensureDefaults 统一。
3. AI 味 Top 17 节点修复清单见 `文本修复清单_v58.md`，按节点分批精确修复。

## 七、验证链执行状态

- 备份 `backup\game_v58eng_before.html`（8,138,863 字节）✅
- `eldacheck --full` 十项全 PASS（10s）✅
- `_v42_build_chunks.py` 分片重建（game_chunked.html 1,974,062 字符）✅
- `_v42_verify_chunks.py` 占位 1（允许）/ 0 缺失 ✅
- `_v42_chk_syntax.py` 15 JS 全 PASS ✅
- 四路同步：game.html=game_check.html=8,139,227 字节；game_chunked.html=index.html=3,093,341 字节 ✅
- 临时调试脚本 73 个归档至 `tools\archive_20260908\` ✅
- 文档：结构台账_v58.md / 文本修复清单_v58.md / QA_v58eng_检验报告.md / README_构建验证.md（重写）✅
