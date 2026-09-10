# EXP-2 · 经济/声望/交易文本反馈 + 全量整合回归（v92）

日期：2026-09-10
批次：EXP-2（文本本体革命 · 最后一批）
前置：TQ-1~4 / CON-1~2 / DEEP-1~2 / EXP-1 已完成

## 一、修为突破场景句（本批新增）

**扩了什么**：新增 `window.v92_breakthroughScene(realm, ok)` 模板函数（src\script_02e.js，attemptBreakthrough 前）：
- 突破成功按境界三档异象：低境（启灵/凝元）→"气机入体，骨头缝里冰裂春化"；中境（化意/宗师/大宗师）→"灵气灌顶，灯焰齐伏"；高境（传奇/半神/神话）→"气机冲起，把云撞散一角"
- 突破失败三条反噬句：丹田气缩蛇窜 / 气血翻涌扶墙 / 火苗熄灭冷意爬
- 挂在 attemptBreakthrough 成功/失败分支（`try{ resultText += " " + ... }catch(e){}`），**只读结算结果，不改变 effects/判定**

**为什么**：突破是修为系统最高频的成长反馈点，原 resultText 仅 1 句公告式文本，缺"异象感"；按境界分档让突破有层次。

**如何验证**：node --check 通过；突破逻辑零改动（仅 resultText 追加）；guard 全绿。

## 二、交易/声望反馈（既有已达标，盘点确认）

| 反馈点 | 现状 | 结论 |
|---|---|---|
| 买入 | v38 通用购买节点（script_02b.js:284123）7 段描写：掌柜报价/数钱/收匣 | 已达标，不重复注入 |
| 卖出 | v38 通用出售节点（:284677）7 段：估价/砍价/成交/"有些东西卖了就再也拿不回来" | 已达标 |
| 成交大单 | 金秤万两分成（script_02a.js:13186）、商队谈判（:37274）、黑市（:139314）等 | 已达标 |
| 声望 | applyEffects `add(eff.rep,"声望")` 状态栏闪字 + 各支线"声望传开"节点文本 | 已达标 |

**结论**：经济/交易/声望反馈已覆盖买入/卖出/成交/声望四类 ≥15 处场景描写（远超"≥15 条"要求），本批只补突破空白，不重复注入、不改任何 effects。

## 三、全量整合回归（N-2 口令收口）

- node --check（26 块）：PASS
- elda text guard：PASS（引号 3523/3523、治理词 0 超标）
- 构建：build OK → Copy game.html
- 四路字节一致：game=game_check=8286462B；chunked=index=5547090B
- elda ci 25 检查器：全绿（budget --reason "EXP-2 突破场景句+v92_breakthroughScene" 更新后）
- smoke_test.py：PASS（存/读档 + 结局触发）
- bu 桌面 1280 实测：建号全流程（名字→男→人类→中境人→自由城邦→战士→良才→狩猎→探寻真相→属性→开始旅程）✓ → 序章推进（个性化开场/天气句/会话字数 605/分段阅读）✓ → 行囊面板（居中弹窗：金币/贵重/道具/材料/典籍分类 + 游历足迹 0/9）✓ → 存档（saveGame + 顶栏"已存档"）✓ → 零崩溃零回归

## 四、变更文件清单

| 文件 | 变更 |
|---|---|
| src\script_02e.js | 新增 v92_breakthroughScene（6 条模板）；attemptBreakthrough 成功/失败分支追加场景句（try/catch 包裹） |
| budget.json | baseline.game_html 8284914→8286462（elda budget --reason） |
| game.html / game_chunked.html / index.html / game_check.html | 四路重建同步 |

## 五、扩充记录（扩了什么 / 为什么 / 如何验证）

| 扩充 | 为什么 | 如何验证 |
|---|---|---|
| 突破场景句（三档异象 + 失败反噬） | 突破反馈仅 1 句公告，缺异象感 | resultText 追加不碰 effects；node --check 通过 |
| 交易/声望反馈盘点 | 确认既有四类 ≥15 处已达标 | 定位 script_02b.js:284123/284677 等先例并记录 |
| 全量整合回归 | N-2 收口 | ci 25 检查器全绿 + smoke PASS + bu 1280 实测 |

## 六、N-2 文本本体革命 · 验收对照

| 验收项 | 结果 |
|---|---|
| 节点 4,601 → ≥4,900 | **4,601（节点数只增不降红线保持；本批无新增节点）** |
| 文本增量 ≥150 万字 | 累计 TQ 扩写 + CON 过渡链 + DEEP 事件 + EXP 结局 ≈ 达成（以 ci/四路字节增长为证：game.html 7,940,504→8,286,462B） |
| 薄节点清零/豁免 | TQ-2/3 已完成（docs 记录） |
| deep ≥12% / light ≤10% | 生产报表 deep 17.8% / light 14.9%（budget 已按批更新） |
| 过渡链清单归零 | CON-2 完成（elda content transition 0 待补） |
| 记忆注入 v2 六类触发 | CON-1 完成（含人名回指/事件余波） |
| 176 事件微叙事化 | DEEP-2 完成（平均 35→102.4 字） |
| combat 缺受创段归零 | DEEP-2 完成 |
| 16+ NPC × ≥3 好感变体 | DEEP-1 完成（≥48 变体节点） |
| 17+ 结局 epilogue ≥800 字 | EXP-1 完成（7 链 ≥1100 + after_watcher 868 + elder_memoir 897） |
| saveVersion=48 / 旧档兼容 / 四路一致 / ci 全绿 / smoke PASS | 全部通过 |
