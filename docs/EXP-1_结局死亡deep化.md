# EXP-1 · 结局与死亡 deep 化（v92）

日期：2026-09-10
批次：EXP-1（文本本体革命 · 工程 EXP · 体验收束）
前置：TQ-1~4 / CON-1~2 / DEEP-1~2 已完成

## 一、结局 epilogue deep 化

**扩了什么**（保持各自文体，全部结局链 epilogue ≥800 字）：

| 结局链 | 处理 | 链合计 |
|---|---|---|
| ending_anchor_seal（守门人） | 尾节点补史家注/民间传/后世轶事 | 384+424+434+318 ≈ 1560 |
| ending_anchor_open（解封） | 同上 | 378+432+398+308 ≈ 1516 |
| ending_anchor_transcend（超脱） | 同上 | 396+390+360 ≈ 1146 |
| ending_anchor_war（战争终局） | 同上 | 409+411+424+332 ≈ 1576 |
| ending_anchor_goldscale（金秤传承） | 同上 | 436+467+366 ≈ 1269 |
| ending_after_watcher（守塔人） | 追加 3 段：初登塔回忆/钥匙刻字/年轻人问答 | 421 → 868 |
| ending_elder_memoir（老人回忆） | 追加 3 段：老人回头望灯/『亮了就好』/旷野灯火 | 556 → 897 |

**为什么**：结局是玩家数百节点旅程的收束点，原尾节点（163-225 字）只有"编年史补录"式的一句话留白，情感落点不足；扩写让结局从"公告"变成"可回味的尾声"，同时保持编年史体的克制笔法（未破坏文体）。

**如何验证**：21 个 ending 节点全部存在、node --check 通过；每条结局链合计 ≥1100 字；elda text guard 全绿（引号配对 3523/3523、治理词 0 超标）。

## 二、死亡/濒死临终视野

**扩了什么**：script_03.js `handleDeath()`（濒死回城路径）在"黑暗漫上来"与"再醒来时"之间，插入 3-5 句临终视野：
- 按职业分形走马灯：商人→自由港灯火与第一笔生意；学者→图书馆塔灯与"书页会黄，字不会"；战士→第一次握刀与铁门关风雪；其他→走过的地域一处处亮起又暗下
- 收尾句："有个声音在很远的地方喊你，像隔着一整条河。"

**为什么**：原濒死仅 2 句（黑暗→医馆），缺失"临终视野"的叙事层；补写为叙事性描写（非惩罚），呼应"死亡/重伤节点补临终视野"验收项。

**如何验证**：handleDeath 逻辑零改动（仅追加 writePar 文本）；node --check 通过；smoke PASS（存读档/结局触发正常）。

## 三、验证链结果

- node --check（26 块）：PASS
- 构建：build OK（game_built 5056034 字符）
- 四路字节一致：game=game_check=8284914B；chunked=index=5545659B
- elda ci 25 检查器：全绿（首跑预算 baseline FAIL 属合法增长，budget --reason "EXP-1 结局deep化+临终视野" 更新后全绿）
- smoke_test.py：PASS

## 四、变更文件清单

| 文件 | 变更 |
|---|---|
| src\script_03.js | handleDeath 临终视野 3-5 句；ending_after_watcher 421→868；ending_elder_memoir 556→897 |
| src\data_nodes\dn_endings.js | 5 个 anchor 尾节点各补史家注/民间传/后世轶事 3 段（编年史体保持） |
| budget.json | baseline.game_html 8278835→8284914（elda budget --reason） |
| game.html / game_chunked.html / index.html / game_check.html | 四路重建同步 |

## 五、扩充记录（扩了什么 / 为什么 / 如何验证）

| 扩充 | 为什么 | 如何验证 |
|---|---|---|
| 结局尾节点史笔加厚 | 结局收束太单薄，缺回味 | 链合计 ≥1100 字；node --check 通过 |
| 守塔人/老人回忆结局扩写 | 非锚结局 epilogue 未达 800 | 868 / 897 字；guard 全绿 |
| 临终视野（职业分形） | 濒死缺叙事层 | handleDeath 逻辑零改动；smoke PASS |
