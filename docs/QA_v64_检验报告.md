# QA v64 检验报告

> 版本：v64 世界局势动态工程
> 日期：2026-09-08
> 基线：v63.5（backup\game_v64_before.html，MD5 8F1B600CDC73305D4CFCB771E3E8B31E）
> 现状：game.html 5,592,044 字节（四路同步一致）/ 12 分片 / 总 1516 节点（含 w64 12 节点）/ 7 script

## 一、验证结果总览

| 项目 | 结果 | 说明 |
|---|---|---|
| elda full（含 c_world） | ✅ 全部通过 | FAIL 0 / WARN 0，6s |
| 语法 node --check | ✅ 7/7 | 注入前后各验 |
| 死链 | ✅ 0 | go 引用全覆盖 |
| 分片检查 | ✅ 12 片 1516 节点 死链复核 0 | world 片含 12 个 w64 节点 |
| 四路同步 | ✅ 字节一致 | game.html = game_check.html；game_chunked.html = index.html |
| 存档兼容仿真（c_save） | ✅ PASS | v63 旧档零报错，w64 字段兜底 |
| w64 引擎 smoke（vm 仿真） | ✅ PASS | 见下 |

## 二、w64 引擎 smoke 仿真（_v64_sim.js，vm 合并 scripts + world 片）

| 项 | 结果 |
|---|---|
| 势力 | 8 ✓ |
| 市场商品 | 7 ✓ |
| 天灾类型 | 5 ✓ |
| 局势种子 | 6 ✓ |
| 关系等级 | 敌对/中立/同盟 ✓ |
| ensureDefaults | S.worldState/S.worldGoals/S.worldFame 兜底 ✓ |
| tickRelations | 28 对关系 ✓ |
| tickMarket | 粮食现价更新 ✓ |
| disRespond(rescue) | mercy+8 ✓ |
| addGoal → tickGoals(超期) | 达成判定与搁浅移除 ✓ |
| karma 延迟触发 | 挂载 → 到期移除 ✓ |
| battle 结算 | 大捷/大败分层、丢城 drop、士气变化 ✓ |
| w64_fname | north/no_such 兜底 ✓ |

## 三、工程过程记录（本次修复）

1. 首次 elda full script2 语法 FAIL → 根因：引擎字符串内 JS 注释写作 `/* marker */` 双星号块注释，被三引号内的注释提前闭合 → 统一改行注释 `// v64inj:engine` 后通过。
2. 存档安全设计：目标/因果原设计存函数（JSON 会丢）→ 改 ID 规则判定表（w64_goalOk/w64_goalReward/w64_karmaFire），函数不入 S。
3. 内容层两坑：`w64_fname(war?a:'')` 引用未定义变量 a（删）；注入点 B 缺闭合引号（逐字符定位修复）。
4. **分片构建误删内容块（重要教训）**：内容层曾注入到最后 `</script>` 前，而 v62 构建的 loader 正是最后一个 script；构建时 `_rm_loader` 整段删除 loader → 连累 NODES 块（w64_fname 定义 + marker）一并消失。修复：
   - w64_fname 移入引擎块（script2，不会被分片构建删）
   - 内容层注入锚点改为 `<!-- /v62inj:loader/ -->` 之前（loader 段外）
   - 重建后 elda full 全绿 + smoke PASS
5. 本版未实施（预留扩展位）：教廷选举节点入口、行情面板 tab 入口、立目标 UI 入口——引擎已实现（w64_vote / w64_marketPanel / w64_addGoal 由战争自动挂 goal_war_*），内容入口待下版按口令 4.x/5.x/7.1/8.1 补全。

## 四、浏览器回归（本次：命令行 + 仿真替代）

- bu 会话历史频繁超时，按 V60 起"先处理 dialog + 模板 + 清档"操作侧方案执行；本次以 vm 仿真 + elda 全链替代浏览器回归。
- 建议用户 file:// 手动抽查：建号 → 修行面板点"🌍世界" → 时间推进数周看局势/关系/行情变化 → 有战争时点"奔赴前线"。
- console 0 新错误预期（引擎全部 try/catch + DOM 判空）。

## 五、遗留与下一步

- 内容入口补全（政治选举 / 行情 tab / 立目标 UI）——下版 v64.1 或并入 v65
- 世界纪事（chronicleRecord）已接入，玩家回看编年史可见世界事件
- 存档体积增量：s-size 实测 0.03MB（压缩后），远低于阈值
