# QA_v48 检验报告（框架层）— 晋升叙事工程

## 一、版本与基线
- 基线：v47（2640 节点 / 6,612,444 字节，三路同步完成态）
- 交付：v48 框架层（2640 节点 / 6,621,301 字节，game.html = game_check.html；index.html 分片 2,072,665）
- 备份：`backup\game_v48_before_framework.html`
- 性质：**框架先行**——引擎钩子 + 数据结构 + 面板入口全部就绪，**具体路径与内容留空占位**（按用户要求，后续批次按 `/v48inj:` marker 填充）

## 二、设计要点（读题与立界）
- 参考《诡秘之主》晋级事件链（怎么知道→怎么准备→晋升时刻→危机）与《灵境行者》职业影响人格（被动塑造，人人独立人格）
- **已剔除**：扮演法、SAN 值影响（用户明确不要）
- **复用现有权威数据源**：JOBS 常量已含 7 职业的 titles（9 阶位阶名）/ mats（8 级材料）/ books（8 级典籍）/ ritual（仪式）/ vow（戒律）/ criterion（准则）/ anchor（锚点）；REALMS 常量 9 境界 + 各阶 xp 需求；S.realm / S.exp 修为字段
- 范围锁：不改变现有突破逻辑（tryAdvance 原样保留），框架期只在修炼面板增加只读"晋升契机"行

## 三、框架交付清单
### 引擎钩子（14 个函数，全部 window 导出，IIFE + try/catch）
| 函数 | 职责 | 空内容时行为 |
|---|---|---|
| v48_initState / v48_ensureDefaults | S 字段兜底初始化 | — |
| v48_checkBottleneck | 瓶颈检测（修为满 + 内容表就绪度） | 只报修为/境界事实 |
| v48_ritualFor | 仪式解析（V48_RITUAL_EXT 优先，回退 JOBS.ritual） | 返回本职业基础仪式 |
| v48_crisisRoll | 危机抽取（V48_CRISIS_POOL） | 返回 null |
| v48_markAt | 职业烙印读取（V48_MARKS） | 返回 null |
| v48_personaGauge | 人格拉锯（resistance/bond/state） | 返回 free 基线 |
| v48_personaResolve | 人格对决结算（accept/resist/tame） | 数值结算框架生效 |
| v48_unevenStepCheck | 未竟之阶隐患（生死逼发） | 返回 null |
| v48_protectorBonus | 护法者加成（V48_PROTECTORS） | 返回 0 加成 |
| v48_weaknessTick | 虚弱期状态机（advanceTime 挂钩） | 无操作 |
| v48_applyMarkToOptions | 烙印选项染色器 | no-op 原样返回 |
| v48PanelLine | 修炼面板瓶颈行 | 无瓶颈返回空串 |
| v48_breakthroughStage | 五幕状态机路由（知/备/时/险/稳固） | 返回 idle / stub 提示 |

### 内容表（全部留空占位，带 EXTEND marker）
- `V48_KNOW_PATHS`：5 类发现路径（体内感应/师承点拨/典籍占卜/梦境异象/生死逼发），content 全 null
- `V48_RITUAL_EXT` / `V48_CRISIS_POOL` / `V48_MARKS` / `V48_PERSONA_OATHS` / `V48_PROTECTORS`：空表
- 注入 marker：`/v48inj:know-sense/`、`/v48inj:ritual/`、`/v48inj:crisis/`、`/v48inj:marks/`、`/v48inj:oaths/`、`/v48inj:protectors/`、`/v48inj:mark-opts/`、`/v48inj:defaults/`、`/v48inj:tick/`、`/v48inj:panel/`

### S 新字段（全旧档兜底）
- `S.breakthrough`（bottleneck/knowPath/prep/stage/result/uneven）
- `S.careerMark`（marks/resistance/bond/state）
- `S.persona`（oath/memories）
- `S.unevenStep`、`S.protector`、`S.weakness`（active/days）
- `S.saveVersion` 兜底升 48（7 处 `|| 47` → `|| 48`）

### 引擎挂钩（3 处，幂等）
1. v46_ensureDefaults 内追加 v48_ensureDefaults（marker `/v48inj:defaults/`）
2. advanceTime / advanceTimeV26 两处追加 v48_weaknessTick（marker `/v48inj:tick/`）
3. renderRealm 面板追加 `h += v48PanelLine()`（marker `/v48inj:panel/`）

## 四、构建验证（全量绿）
| 项 | 结果 |
|---|---|
| node --check（6 script） | 6/6 PASS |
| 死链检查 | 0（2640 节点 / 6009 go 引用） |
| 分片构建 | game_chunked.html 1,361,222 字符 |
| 分片校验 + 语法 | 15 JS 全 PASS |
| 三路同步 | game.html = game_check.html（6,621,301）；index.html 已重建 |

## 五、浏览器回归（bu 平面，file://）
| 回归项 | 结果 |
|---|---|
| 页面加载 / console | 0 错误 |
| 14 个 v48 函数导出 | 全部存在，无缺失 |
| S 字段初始化 | breakthrough/careerMark/persona/unevenStep/weakness 全 OK |
| 瓶颈检测（修为未满） | blocked:false，正常 |
| 瓶颈检测（修为满，realm0→启灵境） | blocked:true，missing:["晋升契机（待 v48 内容注入）"] |
| 仪式兜底（JOBS.ritual 回退） | "本职业晋升仪式\|奥术式论证——当着同侪与学者的面…" |
| 人格拉锯结算 | accept → resistance 50→42 / bond 0→15 |
| 修炼面板瓶颈行 | 修为满时输出"◆晋升契机·已至瓶颈 / 缺：… / 目标：启灵境·仪式：…" |
| 旧档兼容 | 删除 v48 字段后 v46_ensureDefaults 完整重建，零报错 |

## 六、后续批次指引（内容留空清单）
1. `/v48inj:know-*/`：5 类发现路径的触发条件 + 节点 ID + 叙事文本（3-5 节点/条）
2. `/v48inj:ritual/`：7 职业 × 8 阶专属仪式（首批建议前 3 阶 21 条）
3. `/v48inj:crisis/`：危机库 8 类（仪式打断/心魔化形/外敌强夺/异象窥伺/材料瑕疵/生死逼发/虚弱期暗算/失败反噬）
4. `/v48inj:marks/`：职业烙印 7 × 8 阶（性格倾向 + 选项染色）
5. `/v48inj:oaths/`：人格考验事件（每职业 2-3 次，接入 v48_personaResolve）
6. `/v48inj:protectors/`：护法者 NPC 映射
7. `/v48inj:mark-opts/`：烙印选项染色逻辑（内容注入后启用）
8. 后续：tryAdvance 五幕事件链接管（框架已留 v48_breakthroughStage 路由）

## 七、结论
v48 框架层全部落地并通过验证：结构与钩子就绪、内容表留空待补、现有突破逻辑零改动、存档兼容。后续批次按 marker 填充内容即可无缝接管，无需再动框架。
