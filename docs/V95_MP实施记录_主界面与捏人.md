# V95 主界面与捏人 P0/P1/P2 全量实施 — MP-1~MP-11 逐批记录

> 批次：V95 MP-1~MP-11（三层十一批）｜实施日期：2026-09-12｜基线：节点 5,636 / ci 41 检查器 / saveVersion=48
> 蓝图：`docs\V95_主界面与捏人P0-P2全量实施.md`｜备份：`backup\snap_20260912_181303_V95-P0-P2全量.zip`

## 总览

本批把"主界面与捏人 P0/P1/P2"三层（入口顺手 / 创角与剧情联动 / 世界感与进阶体验）全部深度落地：

- **主界面**：有档时置顶"▶ 继续旅程"一键续玩；"开始新旅"分槽覆盖确认；"读取存档"进槽位面板；成就册分类页签 + 进度条；设定册升级为可搜索词条库。
- **捏人**：出身×职业适配联动（★★★/★★/★）；伍步终审卡十项可回跳；名字随机（7 种族 ×12 西幻名）；5 个一键属性模板；步骤/选卡/启程三音效；出生微叙事卡。
- **流程**：无档 → ts-new → 4 屏世界导入（世界大势/九域/五主线/灰港）→ 捏人五步 → 终审 → 出生卡 → 正文。

## 逐批改动与验证

### MP-1 · 继续旅程主入口
- **改动**：`src\script_03.js` v94_titleScreen 新增 `#ts-continue`（有档时渲染）；点击直接走读档逻辑（`v94_loadSave`），无确认框；ts-new 保持覆盖确认。
- **验证**：bu 实测——存档后强制 title，`#ts-continue` 出现（文本"▶ 继续旅程"）；点击后 title 移除、`confirmVisible:0`、直接进入正文「交汇城·市井」（第1日 / 125 金龙）。

### MP-2 · 存档槽位系统
- **改动**：ts-load 路由到既有 `v34_openSavePanel`（5 槽 + autosave + session，双备份：本地 + IndexedDB）；ts-new 前新增 `v94_askSlot` 槽位选择弹层（槽1 读旧键 `RULESET_ID+"-save"`，槽2-3 读 `elda-save-slot-slotN`），`__v95_newSlot` 在 v94_startNew 应用。
- **口径出入**：口令写"3 槽"，实际复用既有 5 槽面板（未新增第三套），旧档自动兼容出现在槽位一。
- **验证**：bu 实测——`v34_openSavePanel()` 打开"存档管理"面板：槽位1 · 加雷斯 · free_jiaohui · 第1日，含"保存到此槽/读取/🗑"，顶部提示"旧版存档自动兼容 · 写入自动双备份"；会话快照可恢复。

### MP-3 · 出身 × 职业联动
- **改动**：新增 `src\data_nodes\dn_fit.js`（`window.FIT_MATRIX` 9 出身 × 9 职业，`{star:1-3, why}`）；出身卡加 `.fit-badge`；职业卡按已选出身显示 ★★★契合/★★尚可/★冷门 + 未选出身引导。
- **口径出入**：蓝图"9×12 职业"实为 9 职业，按 9 写全。
- **验证**：bu 实测——`.fit-badge` 18 个渲染；选"自由城邦"出身进职业页，徽章文本"适配：盗贼 ★★★ · 商人 ★★★ ·"正确；判定/go 零改动。

### MP-4 · 确认终审页
- **改动**：伍步顶部新增 `#v95-final` 终审卡（名讳/性别/种族/亚种/出身/谱系/职业/天资/爱好/理想 十项 + 一句后果），点击任一行跳对应步骤（`v94_renderFinalCheck`，data-go → `v94_showStep`）；btn-start 文案改"确认并踏入4037年 · 开始旅程"。
- **验证**：bu 实测——终审卡输出"✦ 终审 · 十项｜名讳 加雷斯｜性别 男｜种族 人类｜亚种 未定｜出身 自由城邦｜决定序章开场与初始金币｜…职业 魔法师｜一生唯一，含戒律｜理想 富甲天下｜决定结局归宿"；btn-start 文案正确；结算链（:6894-6961）零改动。

### MP-5 · 世界导入屏
- **改动**：新增 `v94_introFlow`（#v95-intro 全屏层，4 屏：LOREBOOK 世界大势 / REGIONS 九域卡 / WORLD_EVENTS 五主线 / 灰港开局 + 五维意义）；前进/后退/进度点/跳过；老玩家（有成就/存档）"跳过 >>（老旅人）"高亮；ts-new 无档路径接入。
- **验证**：bu 实测——overlay 存在（z 9800、rect 967x883）；4 屏依次推进（"世界大势/诸神远去之后"→"大陆舆图/九域并立"→"时代洪流/命运的五根线"→"旅程起点/灰港的渡船"）；第 4 屏 fwd 变"开始捏人 →"→ 点击进入捏人向导。

### MP-6 · 成就册增强
- **改动**：`src\script_04.js` v34_renderAchievements 增强为成就卡（`v34_achCard`）+ 分类（story/combat/growth/bond 四类 + 全部）+ 进度条 + 解锁时间戳（`v34_unlockAchievement` 写入 Date.now()，`!!` 兼容旧布尔）。
- **验证**：bu 实测——"成就墙"面板：已解锁 0/10、页签 全部/剧情/战斗/成长/羁绊、进度条存在、未解锁占位卡；解锁判定（:504）零改动。

### MP-7 · 设定册增强
- **改动**：v94_settingPanel 重写为"设定册·世界一览"多分类词条库：搜索框 `#v95-set-search` + 7 个分类块（世界大势/人物志/关键地点/术语与神器/势力矩阵/五条主线/职业与戒律），`#v95-set-entry` 即时过滤；动态生成自 LOREBOOK/账本/REGIONS。
- **验证**：bu 实测——"设定册·世界一览"标题 + 搜索框"搜索词条（人物/地名/术语）" + `.v95-set-entry` 107 条 + details 7 块；首条"九域格局…"正确。

### MP-8 · 捏人预览卡增强
- **改动**：v94_creationPreview 扩展——顶部实时属性行（6 属性 + 余点 + "已定 N/8"），侧栏 sticky 可用。
- **验证**：bu 实测——`.pv-attr` 6 项渲染；每步选择后即时刷新（gender/homeland/job/talent/hobby/ideal 选择均回调 v94_creationPreview）。

### MP-9 · 名字随机 + 属性模板
- **改动**：新增 `src\data_nodes\dn_namegen.js`（`window.NAME_POOL` 7 种族 ×12 西幻名）；壹步姓名框旁"🎲 随机"按钮（`v94_rollName`，3 候选点击填充）；伍步 5 个一键属性模板（均衡/力量/敏捷/法师/魅力，与剩余点数联动）。
- **验证**：bu 实测——点 🎲 出候选"加雷斯/埃德温/艾拉"，点候选填充姓名"加雷斯"；`.v95-tpls button` 5 个；结算链零改动。

### MP-10 · 捏人音效
- **改动**：新增 `v94_sfx(type)`（WebAudio：step 330Hz/0.07s、click 520Hz/0.05s、start 220→440Hz/0.5s、triangle、gain 0.05×sfxVolume）；步骤切换/选卡（委托 .sel-card）/启程按钮接入；`!audioEnabled` 静默；无 AC 时 acInit 兜底。
- **验证**：bu 实测——v94_sfx 三型调用无异常；audioEnabled=false 时静默返回（开关生效）；既有判定音效零改动。

### MP-11 · 出生微叙事过渡
- **改动**：新增 `v94_birthCardText`（按出身 identity / 职业 job_sight / 理想 ideal_reaction 拼装 200-400 字）+ `v94_birthCard`（全屏出生卡：灰港启程 + "启程 →"）；btn-start 结算链尾端 writeNext 包进出生卡回调（S 状态零回滚）。
- **验证**：bu 实测——点"确认并踏入4037年"后 `#v95-birth` 出现，正文 115 字（"商路的十字路口养出来的孩子，见人三分笑…你第一眼看的不是街市，是屋顶与屋顶之间魔网的纹路…"）；点"启程 →"→ writeNext 渲染正文「交汇城·市井」+ 记忆注入/伏笔注入句。

## 验证链（全绿）

- `node --check`（26 块 src）PASS
- `_build_authority.py build` OK → Copy game_built.html → game.html
- `elda chunks`（43 文件）PASS
- `elda sync` 四路字节一致（game=game_check=19,025,725B；chunked=index 一致）
- `elda budget --reason "V95 MP1-11 主界面与捏人增强(修订)" / "V95 MP5 导入屏CSS补齐"` → baseline.game_html 19,023,459 → 19,025,725
- `elda ci` 41 检查器全绿（"门禁结果：全部通过（可发布）"）
- `smoke_test.py` PASS
- bu 桌面 1280/967×883 实测：主界面五按钮 → ts-new 导入屏 4 屏 → 捏人五步 → 终审卡 → 随机名 → 出生卡 → 正文；成就册/设定册/存档面板/继续旅程全链路可用

## 踩坑记录

1. **导入屏 CSS 初版缺失**：v94_introFlow 使用 `.v95-intro` 系列类但 gap_00.html 未定义 → overlay 在 DOM 但不可见。补齐 `.v95-intro/.v95-intro-inner/.v95-intro-top/.v95-region-grid/.v95-dot/.v95-slot-card` 等样式后重建生效。
2. **bu 截图与 DOM 合成不一致**：overlay 已存在（computedStyle 确认）但截图 OCR 仍显示下层界面；以 DOM/JS 状态为准（项目已记录此工具行为）。
3. **结算链拦截校验**：btn-start 在亚种未选时 flashMsg 拦截——属既有校验，补选亚种后正常（证明结算链守卫完好）。
4. **marker 前缀撞车**：bindCreation 内注释 `/v95inj:mp10` 与 mp9 前缀冲突 → 改 `/v95inj:mp9a//v95inj:mp9b//v95inj:mp10a` 后 ci 全绿。

## 红线遵守

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：零改动；saveVersion=48 不变；applyDefaults 兜底链不变。
- 移动端永久禁止：本批未新增任何移动端适配。
- 节点只增不降（5,636 保持）；文本不删句不改选项语义。
- 旧档兼容：全部独立键/独立 DOM（S.slotId 沿用既有兜底）。
