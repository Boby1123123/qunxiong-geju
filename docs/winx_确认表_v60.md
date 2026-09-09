# winx 确认表_v60（跨 script 52 项 · 前置扫描只读）

生成时间: 2026-09-08 · 来源: c_refhealth 跨 script 专项（rule k/k2）
说明: 全部无冲突（无重复声明 / 无已有 window.X 写 / 无定义前裸引用）才允许注入 window.X=X；异常项人工裁决。

| # | 名字 | 定义script | 定义形态 | 引用script | 裸引用数 | 已有window.X写 | 重复var/function | 定义前裸引用 | 裁决 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | ATTR_CN | script1 | const | s2,s3,s4 | 10 | 无 | 无 | 无 | 可注入 |
| 2 | ATTR_DESC | script1 | const | s3 | 2 | 无 | 无 | 无 | 可注入 |
| 3 | CHURCH_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 4 | CITY_DAILY_EVENTS | script2 | const | s4 | 3 | 无 | 无 | 无 | 可注入 |
| 5 | CITY_SPOTS | script3 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 6 | CURRENCY | script1 | const | s3 | 3 | 无 | 无 | 无 | 可注入 |
| 7 | ChunkLoader | script4 | const | s3 | 3 | 无 | 无 | 无 | 可注入 |
| 8 | DREAM_EVENTS | script2 | const | s4 | 4 | 无 | 无 | 无 | 可注入 |
| 9 | DWARF_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 10 | EAST_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 11 | ELF_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 12 | ENEMIES | script1 | const | s3,s4 | 2 | 无 | 无 | 无 | 可注入 |
| 13 | ErrorLog | script4 | const | s3 | 12 | 无 | 无 | 无 | 可注入 |
| 14 | FORESHADOWING_V27 | script2 | const | s3 | 1 | 无 | 无 | 无 | 可注入 |
| 15 | FREE_BOARD | script2 | const | s4 | 3 | 无 | 无 | 无 | 可注入 |
| 16 | GALLERY_BONUS | script4 | const | s5 | 2 | 无 | 无 | 无 | 可注入 |
| 17 | HOBBIES | script1 | const | s3 | 4 | 无 | 无 | 无 | 可注入 |
| 18 | HOMELANDS | script1 | const | s2,s3 | 8 | 无 | 无 | 无 | 可注入 |
| 19 | IDEALS | script1 | const | s3 | 12 | 无 | 无 | 无 | 可注入 |
| 20 | ITEM_GALLERY | script4 | const | s5 | 5 | 无 | 无 | 无 | 可注入 |
| 21 | JOBS | script1 | const | s2,s3,s4 | 66 | 无 | 无 | 无 | 可注入 |
| 22 | N | script2 | const | s0,s3,s4 | 3444 | 无 | 无 | 无 | 可注入 |
| 23 | NORTH_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 24 | NPC_LIFE | script1 | const | s4 | 1 | 无 | 无 | 无 | 可注入 |
| 25 | ORC_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 26 | RACES | script1 | const | s3 | 8 | 无 | 无 | 无 | 可注入 |
| 27 | REALMS | script1 | const | s3 | 13 | 无 | 无 | 无 | 可注入 |
| 28 | REGIONS | script1 | const | s3,s4 | 21 | 无 | 无 | 无 | 可注入 |
| 29 | RULESET_ID | script1 | const | s3,s4 | 14 | 无 | 无 | 无 | 可注入 |
| 30 | RenderBatch | script4 | const | s3 | 3 | 无 | 无 | 无 | 可注入 |
| 31 | S | script3 | let | s0,s2,s4,s5 | 5586 | 无 | 无 | 无 | 可注入 |
| 32 | SECRETS | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 33 | SKILLS | script1 | const | s3,s4 | 3 | 无 | 无 | 无 | 可注入 |
| 34 | SKILL_LEVELS | script1 | const | s3 | 1 | 无 | 无 | 无 | 可注入 |
| 35 | SOUTH_BOARD | script2 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 36 | SUBRACES | script1 | const | s3 | 11 | 无 | 无 | 无 | 可注入 |
| 37 | StorageKit | script4 | const | s3 | 12 | 无 | 无 | 无 | 可注入 |
| 38 | TALENTS | script1 | const | s3 | 6 | 无 | 无 | 无 | 可注入 |
| 39 | TRAVEL | script1 | const | s2,s3 | 4 | 无 | 无 | 无 | 可注入 |
| 40 | TRAVEL_EVENTS | script2 | const | s3,s4 | 8 | 无 | 无 | 无 | 可注入 |
| 41 | V35_DevConsole | script0 | const | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 42 | V35_EventBus | script0 | const | s4 | 36 | 无 | 无 | 无 | 可注入 |
| 43 | V35_ModuleManager | script0 | const | s4 | 22 | 无 | 无 | 无 | 可注入 |
| 44 | WORLD_EVENTS | script1 | const | s3 | 5 | 无 | 无 | 无 | 可注入 |
| 45 | choice | script3 | const | s2,s4 | 17 | 无 | 无 | 无 | 可注入 |
| 46 | curNode | script3 | let | s0,s2,s4 | 79 | 无 | 无 | 68143 | 人工裁决 |
| 47 | logs | script3 | const/var | s4 | 3 | 无 | var;var | 无 | 人工裁决 |
| 48 | optEl | script3 | let | s4 | 2 | 无 | 无 | 无 | 可注入 |
| 49 | pool | script3 | const/let/var | s2,s4 | 88 | 无 | var;var;var;var;var;var;var;var;var;var;var;var | 68187;68188 | 人工裁决 |
| 50 | renderPerf | script4 | const | s3 | 5 | 无 | 无 | 无 | 可注入 |
| 51 | rnd | script3 | const | s4 | 11 | 无 | 无 | 无 | 可注入 |
| 52 | storyEl | script3 | let | s2,s4 | 19 | 无 | 无 | 无 | 可注入 |

## 汇总

- 专项总数: 52
- 可注入: 49
- 异常需裁决: 3

### 异常明细

- **curNode**（let）重复:无 window写:0 前置引用:68143
- **logs**（const/var）重复:['var', 'var'] window写:0 前置引用:无
- **pool**（const/let/var）重复:['var', 'var', 'var', 'var', 'var', 'var', 'var', 'var', 'var', 'var', 'var', 'var'] window写:0 前置引用:68187;68188;68188;71079;71079;71081;71083;71083;71083;71977;72078;72135;72147;72151;72161
## 执行结果（2026-09-08 实际执行）

- 注入: 批1(script0) 3 项 + 批2(script1-3) 46 项 = **49 项全部成功**，0 错误
- marker: /v60inj:winx1:N / /v60inj:winx2:N（每项唯一 marker），0 重复 0 悬挂
- 保留专项: **curNode / logs / pool**（3 项，裁决如下）
- 验证: eldacheck full 全绿（语法 6/6、FAIL 0、专项 52 → 3、marker 0 重复）

### 3 项保留裁决（人工确认）

| 名字 | 原因 | 处理 |
|---|---|---|
| curNode | 顶层 let + 定义前裸引用（行 68143），隐式全局赋值 38 次兜底 | 不动：注入 window.curNode 会与既有隐式全局语义冲突，保留在专项 |
| logs | const logs 与 var logs 同名重复声明（2 处 var） | 不动：注入会覆盖 window.logs 的 var 值，行为可能改变；后续改名或重构时处理 |
| pool | const/let/var 同名（var 声明 12 处）+ 定义前裸引用多处 | 不动：同上，注入有覆盖风险；后续收敛命名空间时处理 |
