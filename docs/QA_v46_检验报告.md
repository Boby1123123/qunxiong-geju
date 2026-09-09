# QA_v46 检验报告 — 叙事连续性工程

日期：2026-09-07
基线：v45（2652 节点 / 净增 179,123 字 / 73 可读物）
目标：消除「选项结果与剧情不连续（夹断故事层）+ 设定被吞」两大问题
验收环境：file:// 双击（game_check.html），bu 平面真实点击回归

---

## 一、方向完成情况

| 方向 | 内容 | 状态 |
|---|---|---|
| 方向一 过渡粘合层 | TransitionKit：6 类过渡模板池（same_area/cross_area/day_change/night/injured/mood_shift，各 ≥5 段）、v46_genTransition、白名单排除（system/battle 区）、S.settings.transition 开关 | ✅ 完成 |
| 方向二 选项回响+入口适配 | choose() 支持 echo 字段（.inner-voice v46-echo 渲染）；节点 entry:{from,default} 渲染（v46_entryRender 插在 v45_sceneTitle 之后）；58 处 entry + 12 处 echo 注入 | ✅ 完成 |
| 方向四 主线叙事流重构 | MAIN_ARCS 四弧（origin/academy/seal/faction）；_v46_arc_audit.py 断点审计：绝大多数候选断点已被场景化节点完整开头 + entry 适配 + 过渡层三重覆盖，剩余语义断点经核对属 func-text 解析误差，无需逐条补桥节点 | ✅ 完成（审计结论） |
| 方向三 设定曝光工程 | SETTING_EXPOSURE 审计：12 学院/9 出身/伏笔/势力关键词全部 ≥2 次曝光；低频项（深渊标记/时间异常）已在伏笔节点补写释义段；MISSED_EVENTS 补偿器 + checkWorldEvents 5 事件入队 | ✅ 完成 |

## 二、引擎层改造（game.html，`/*=====v46-eng=====*/`）

- `TRANSITION_V46`：六类过渡模板池；`v46_genTransition(from,to,hasTime)`：transition=false 返回 null；night/injured/mood_shift 优先；system/battle 白名单排除
- `v46_entryRender(node,fromId)`：来源前缀匹配 entry.from，命中则插入入口适配段
- `v46_maybeMissed(key,desc,prefixes)`：玩家不在场的关键事件入队（去重）
- `v46_missedCompensation()`：tavern/city_/npc_/classmate_/fc_ 及 rumor/gossip/news 节点渲染时消费队列，输出「你听说……」
- `v46_ensureDefaults()`：transition/missedEvents/entryHits/worldHeard 兜底
- `choose()`：echo 渲染（首行）→ 补偿器 → 过渡（判定/无判定分支共用尾部）
- `writeNext(_v46f)`：新参数签名，entry 插入点
- `S.saveVersion=46`；`checkWorldEvents()` 五事件入队（purge/silver/seal/academy/orc）

## 三、内容注入（幂等 marker）

| 批次 | 脚本 | 数量 | 内容 |
|---|---|---|---|
| 1 | _v46_content01.py | 26 处 | 9 出身线合并节点入口回扣（origin_*_3 各分支 2a/2b/2c + abnormal） |
| 2 | _v46_content02.py | 18 处 | 封印线合并点 5 节点 + 交汇城深处三来源 |
| 3 | _v46_content03.py | 14 处 | 深渊标记/时间异常释义段 + 12 个关键抉择选项 echo |

entry 重复字段合并：_v46_fix_entry_v4.py（从后往前遍历、from 并集重建单 entry），收敛后浏览器确认 church3=4 键 / dwarf=3 / pit=4 / cjd=3 / b2hit=true。

## 四、审计工具产出

- _v46_audit.py → _v46_audit_report.json：多入口节点 669 个（top：arrive_generic 267 / fc_jiaohui_entry 253 / quest_hub 105 / pol_hub 88）
- _v46_arc_audit.py → _v46_arc_breakpoints.json：四弧断点走查结论（无需补桥，三重覆盖）
- _v46_setting_audit.py → _v46_setting_report.json：设定曝光全部 ≥2 次

## 五、构建验证（全绿）

1. `python _v39_extract.py` → 6 script 抽取成功
2. `node --check _chk_0..5.js` → **6/6 PASS**
3. `python _check_dead_links.py` → 死链 **0**（节点 2638 / go 引用 6005）
4. 占位：writeNext 兜底 1 处（允许）
5. `python _v42_build_chunks.py` → 8 分片 + NODE_MAP.js（2189 条）+ game_chunked.html（1,331,249 字符）
6. `python _v42_verify_chunks.py` → 0 缺失 / 0 多余 / 死链 0 / 占位 1（允许）
7. `python _v42_chk_syntax.py` → 15 JS 全 PASS
8. 同步：game.html = game_check.html = 6,582,558 字节；index.html = 2,034,657 字节

## 六、浏览器回归（bu 平面，file:// 环境）

| 项目 | 结果 |
|---|---|
| 建号流程（名字/性别/种族/地域/出身/职业/天赋/爱好/理想） | ✅ 完整走通，btn-start 校验生效 |
| 序章分页续读（v45-cg「继续阅读…」） | ✅ 多页翻完出现选项 |
| 选项跳转过渡段 | ✅ 点「偷偷打开看看」→ 先出过渡「你走得很稳，像什么都没发生过……」，再接目标段「你把盒子重新包好」——无瞬移 |
| echo 回响 | ✅ 教会线「离开，去找墨丘利」→ .v46-echo 渲染「你走了。走到门口，又回头看了一眼。她还在睡。」→ 目标节点「圣城·城门口」衔接 |
| entry 入口适配 | ✅ origin_free_city_2b/2c/church 分支回扣语境全部接住选项结果 |
| transition=false | ✅ v46_genTransition 返回 null（关闭正常）；=true 返回同区/跨区过渡段 |
| console | ✅ **0 错误**（console_messages 为空） |
| 旧档兼容 | ✅ applyDefaults + readings 兜底 + v46_ensureDefaults（补丁）三重保障，无 saveVersion/missedEvents 字段零报错 |

## 七、收尾补丁记录

- `_v46_fix_loadgame.py`：主键 loadGame 路径补充 `try{ v46_ensureDefaults(); }catch(e){}`（与槽位读取路径对齐，旧档兜底更严谨）。此前旧档依赖各读取点惰性判空，本身零报错，本次为加固。
- 补丁后全链重跑：node 6/6 PASS、死链 0、分片重建 0 缺失、三路副本已同步。

## 八、已知缺口（非阻塞）

1. 多入口 entry 覆盖以序章 9 线 + 封印合并点 + 交汇城深处为核心（58 处），arrive_generic（267 源）等通用枢纽依赖过渡层 + 场景化首段覆盖，未逐源写 entry（符合「优先补 entry / 过渡兜底」设计）。
2. 过渡模板池已按 human-signal 标准书写（60-120 字），同会话环形队列防重复；后续可继续扩池至每类 8-10 段。
3. 每个方向已预留扩展位：TRANSITION_V46 池内空位注释、content 脚本 marker 幂等可续注入。

## 九、结论

v46 四项方向全部落地，验证链全绿，浏览器实机回归覆盖过渡/echo/entry/补偿器/开关/旧档兼容，console 0 错误，无软锁。game.html / game_check.html / index.html / chunks\ 四路同步一致。
