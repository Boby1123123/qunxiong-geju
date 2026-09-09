# QA_v66 检验报告（叙事连续性 + 文风沉浸感质量工程）

> 版本：V66-ENG｜日期：2026-09-08｜基线：v65.5（13 片 1776 节点）
> 结论：**16 检查器全绿 / 分片 14 片 1806 节点 / 仿真 SMOKE PASS / 四路同步字节一致**

---

## 一、交付清单

| 项 | 内容 | 状态 |
|---|---|---|
| 备份 | backup\game_v66_before.html（MD5 6a65ad3faea75d40681afb00e703a9d5） | ✅ 字节一致已验 |
| 引擎 | v66 引擎 IIFE（NARR/IMM/CAST/LORE/DENS 全套 API，独立 script 块，marker /v66inj:narr/） | ✅ |
| 节点 | v66 节点块 30 节点 + W66_PROFILES 16 档四件套（marker /v66inj:nodes/ + /v66inj:blockend/） | ✅ |
| 档案 | W66_PROFILES：de_mage/de_war/de_priest/de_thief/de_ranger/de_knight/de_smith/de_trade/de_soul + lv_mage1/lv_war1/lv_priest1 + pope/north_king/free_lord/academy_head | ✅ 16 条 |
| 传说 | v66_lore_t1-t8（太吾剑谱/教皇沉眠/裂隙源起/北境世仇/学院禁书/城邦密约/失踪的第九层/焚书广场）+ 碑林/藏书阁 | ✅ 8 则 |
| 情绪精修 | 4 处直白情绪词 → 外化写法（"你很害怕"→"你整夜点着灯睡"等） | ✅ |
| 分片 | chunks/v62_narr.js（30 节点，前缀 [v66]）；主文件 3,430,092 字符 → 构建后 5,716,521 字节（game.html） | ✅ |
| 检查器 | c_narr / c_cast / c_lore 三个新检查器注册（13→16） | ✅ |
| registry | tools/registry.json 追加 6 项（3 检查器 + 3 注入/修复脚本） | ✅ |
| 文档 | V66_文风规范.md / 情绪外化替换表.md / 本报告 | ✅ |

## 二、验证结果（全链）

| 步骤 | 结果 |
|---|---|
| 1. 前置扫描 | S.memories/npcLedger/loreDiscovered 现引用 0 处可安全新增；直白情绪词 9 处（4 处精修，5 处语境可保留）；长文无选项节点 0；高流量入口 fc_jiaohui_entry 207 次、arrive_generic 288 次 |
| 2. elda full（16 检查器） | **全绿**：FAIL 0 项；c_narr（引擎=30 节点/接续=6/挂载含 v66_contFor）、c_cast（档案 16 条）、c_lore（传说 8 则/入口 3）均 PASS |
| 3. 语法 | 内联 script 12 块全部 node --check PASS；script 标签 12:12 配对（历史残留 13:9 已修复） |
| 4. 分片 | 14 片 / 1806 节点 / 死链复核 0 / 片缺失 0 |
| 5. 仿真 | node _v65_sim.js：原有 46 断言 + 新增 v66 8 断言（v66Defaults/v66Mem/v66Ledger/v66Lore/v66Ripple/v66Bridge/v66Cast/v66Nodes）**SMOKE PASS** |
| 6. 四路同步 | game.html / game_check.html / game_chunked.html / index.html 字节一致（5,716,521 / 3,107,732） |
| 7. 性能 | elda full 约 9s（16 检查器），无超阈值慢检查器 |

## 三、修复记录（本次执行中发现并修复）

| # | 问题 | 修复 |
|---|---|---|
| 1 | c_narr 挂载检查用 html.find 误取 v43 旧包装 → 误报"未含 v66_contFor" | 改用 `r'window\.writeNext\s*=\s*function'` 正则取最后一个定义（@3408611 引擎包装，兼容有无空格） |
| 2 | game.html script 标签 13 开 9 闭失衡（v655 战略层游离块 4 个孤立 `<script>` + v64 尾段 curRegionName 游离于 `</body>` 前，历史遗留） | _v66_fixscripts.py：折叠连续开标签 + `</body>` 前补闭标签 → 12:12；浏览器解析尾部异常消除 |
| 3 | marker 台账重复：节点块注释含 /v66inj:cast/ 与块尾 /v66inj:nodes/（子串冲突） | 节点块档案注释去掉 marker；块尾改 /v66inj:blockend/ |
| 4 | v66_loreFlash 防重复用值判断：仿真环境 S.day=0（falsy）时失效（true/true） | 改用 `Object.prototype.hasOwnProperty.call(S.loreDiscovered, lid)`，健壮性修复（不动核心流程） |
| 5 | 引擎原插 loader 块内 → 分片构建 _rm_loader 整块删除导致引擎消失 | 引擎/节点改为**独立 `<script>` 块**插在最后一个 `</script>` 后；loader 注入位置改为引擎 marker 前最后一个 `</script>` 后（writeNext 包装顺序 v43→v62→v66，引擎最后生效） |

## 四、浏览器回归要点（bu 可用时 / 用户手动 file:// 抽查）

- [ ] 酒馆 → 出城 → 进城三段：接续句 / 过渡句出现，无夹断感
- [ ] 触发 1 个世界事件（战争广播 / 天灾）：传闻 → 目睹 → 介入三层入叙，非裸插
- [ ] 与 2 名 NPC 两次对话：第二次出现记忆引用（账本 / 物件）
- [ ] 说书人入口 → 传说 1 则 → 史书可读（v66_lore_storyteller → v66_lore_t1）
- [ ] 战役前后各 1 句对峙 / 后果文本（v66_battleFlavor）
- [ ] 旧档兼容：预置 v65.5 存档读档零报错（memories/npcLedger/loreDiscovered 兜底，v66_ensureDefaults 链入 v65）
- [ ] V35 抽查：typeof choose/writeNext/v66_contFor/v66_castProfile/v57_flowCheck 正常；console 0 新错误

## 五、存档兼容（硬约束确认）

- 主键 `elda-qunxiong-v3-save` 不变；S.saveVersion=48；8 处原生 confirm 未动
- 仅新增 S.memories / S.npcLedger / S.loreDiscovered / S.v66Flags（全部 v66_ensureDefaults 兜底，链入 v65_ensureDefaults）
- 存档体积增量预估 ≤0.05MB（压缩后）；判定公式（writeNext/choose/advanceTime）零改动

## 六、扩展位（≥50% 预留）

- V66_ENTRY_CONT / V66_HOOKS：接续 / 尾钩映射可继续追加
- V66_BRIDGES：time/travel/scene 三系 15 句模板可扩
- V66_ATMOS：氛围表可按区域 / 节庆新增
- W66_PROFILES：档案 16 → 24+ 名
- v66_lore_t9+：传说可继续追加
- v66_ripple：涟漪可按 kind 新增种类
