# QA_v49 破境系统检验报告

- 版本：v49（破境系统全量深度开发）
- 日期：2026-09-07
- 前置：v48.9d（2840 节点 / 6,800,431 字节 / 三路同步）
- 权威源：`game.html`（注入后 3,765,760 字符）

---

## 一、本次开发内容

### 1.1 破境引擎（`BREAKTHROUGH_V49` 全局对象，`/*v49inj:bt*/` 锚点）

| 函数 | 职责 |
|---|---|
| `v49_openBreakthrough()` | 破境三段式面板：仪式名 / 材料状态 / 典籍状态 / 护法四选一 / 地点三选一 / 开始破境 |
| `v49_doBreakthrough()` | 破境主流程：仪式 → 预兆（omens）→ 三重判定 → 要素叠加 → 危机判定 → 收尾 |
| `v49_rollStep()` | 三重判定单步（writeDice 横幅 + 叙事段落） |
| `v49_crisisRun()` | 危机触发（仅 realm≥3）：概率 = realm×7 + 地点 crisis − 护法 rescue×0.3，危机池随机一条 |
| `v49_crisisPick(id)` | 危机三选项结算：目标 = 55 + 属性×0.4；过 +15 分续破境；败 SAN−10 / HP−15% 且破境失败 |
| `v49_finish()` | 结果结算：成功晋阶（HP+20 / MP+10 / 称号 / 突破演出）；失败留心魔 flag / HP−10% / SAN−10 / 失败演出；写入 S.btHistory |
| `v49_readBook()` | 研读典籍：置 flag + 叙事 + flashMsg |
| `v49_matName / v49_bookName / v49_hasMat / v49_hasBook / v49_mainAttr / v49_jobConf` | 数据取值辅助 |

### 1.2 多重判定设计（非单骰）

```
三重判定（realm 越高目标越高）：
  一心境：目标 55 + realm×4 + SPR/10     过 +10 分  败 −5 分 + SAN−5
  二根基：目标 55 + realm×6 + 主属性/8   过 +40 分  败 −10 分
  三天时：r3≤35+realm×5 → 利我 +8 分；r3≥95 → 不利 −8 分；其余平
要素叠加：
  材料齐 +10 / 缺 −5 · 典籍研读 +10 · 护法 bonus · 地点 bonus
通过线：低阶（realm≤3）50 分 · 高阶（realm>3）60 分
```

### 1.3 护法系统（guardianDef）

| 护法 | bonus | rescue（危机豁免） |
|---|---|---|
| 导师 | +10 | 60% |
| 同门 | +6 | 40% |
| 挚友 | +4 | 30% |
| 无人 | −8 | 0% |

### 1.4 地点系统（placeDef）

| 地点 | bonus | crisis（危机加成） |
|---|---|---|
| 神圣之地 | +8 | −8 |
| 安全之地 | +5 | 0 |
| 荒野 | −5 | +10 |

### 1.5 九职业专属破境叙事（`/*v49inj:bte*/` 锚点）

每职业：guardian{tutor/senior/friend} + place{sacred/safe/wild} + crises[3 条 × 3 选项{id,a/b/c}] + realm 1~7 的 {ritual, ritualNote, omens[2], success[2], fail[2]}

| 职业 | 仪式主线 | 危机池 |
|---|---|---|
| 魔法师 | 元素听话 → 魔网刻名 | 法力失控 / 异象引觊觎 / 深渊低语 |
| 灵魂法师 | 影子对视 → 灵界名单 | 直面本心 / 旧债敲门 / 深渊低语 |
| 术士 | 第一枚铁钉 → 把自己锻成作品 | 造物反噬 / 仇人上门 / 深渊低语 |
| 战士 | 驯斗气 → 与战旗合一 | 血气反冲 / 仇人上门 / 心魔·怯 |
| 骑士 | 第一句誓约 → 成为一盏灯 | 誓约动摇 / 深渊低语 / 旧敌相寻 |
| 游侠 | 林间一夜 → 种下橡子 | 天变骤雨 / 盗猎者 / 深渊低语 |
| 盗贼 | 不留脚印 → 从所有账本消失 | 被人盯上 / 旧案回响 / 深渊低语 |
| 牧师 | 独自晨祷 → 成为一束光 | 信仰动摇 / 深渊低语 / 旧伤复发 |
| 商人 | 第一笔不亏本的买卖 → 名字即通行证 | 旧账上门 / 对手压价 / 深渊低语 |

- 低阶（1-3 阶）仪式平顺、重在"学会"，无危机；
- 高阶（4-7 阶）仪式"以物喻道"、有危机（法力失控 / 心魔 / 旧敌 / 深渊低语 / 誓约动摇等），失败留心魔可择日再试；
- 全部叙事按 human-signal 标准：五感、物件即记忆、对白半句留白、克制收尾、对话中文引号。

### 1.6 修炼面板改造

- 修炼面板"尝试突破"按钮 → `v49_openBreakthrough()`；
- 原 `attemptBreakthrough()` 函数保留未动（兼容旧存档流程）。

---

## 二、工程与验证

### 2.1 注入记录

| 脚本 | 内容 | 结果 |
|---|---|---|
| `_v49_engine.py` | 破境引擎注入 | 成功（3,712,421） |
| `_v49_fixpath.py` | guardian/place/crises 取数路径修正 | 成功（3,712,528） |
| `_v49_content1.py` | 批1：魔法师/灵魂法师/术士 | 成功（3,729,868） |
| `_v49_content2.py` | 批2：战士/骑士/游侠 | 成功（3,747,721） |
| `_v49_content3.py` | 批3：盗贼/牧师/商人 | 成功（3,765,472） |
| `_v49_fixopts.py` | 修复 options 累积（doBreakthrough/finish/crisisRun 前置 clearOptions） | 成功（3,765,559） |
| `_v49_fixjc.py` | 修复 v49_crisisRun 缺 jc 声明 | 成功（3,765,607） |
| `_v49_fixcrisis.py` | 修复 crisisPick 选项查找 + cfg 传递 + SURVIVE 映射 | 成功（3,765,760） |

### 2.2 静态验证

| 项 | 结果 |
|---|---|
| `_v39_extract.py` + `node --check` | 6/6 PASS |
| `_check_dead_links.py` | 死链数 0（2840 节点 / 6357 go） |
| `_v42_build_chunks.py` | 成功（game_chunked.html 1,518,763 字符） |
| `_v42_verify_chunks.py` | 0 缺失 / 0 多余 / 死链 0 |
| `_v42_chk_syntax.py` | 全部 PASS |

### 2.3 浏览器回归（bu 平面，file:// 环境，game.html）

| 场景 | 结果 |
|---|---|
| 低阶破境（启灵→凝元，realm 1→2） | 面板显示仪式/材料"已备齐"，三重判定演出，成功晋阶 ✓ |
| 高阶破境（宗师→大宗师，realm 4） | 三重判定 + 要素叠加输出"总分 50（高阶线 60）"，失败叙事完整 ✓ |
| 危机触发（无护法 + 荒野，realm 4） | 深渊低语危机渲染，三选项出现 ✓ |
| 危机判定成功 | d100≤目标 → "危机渡过 +15" → 总分 65≥60 → 破境成功（realm 4→5，HP 100→120）✓ |
| 危机判定失败 | d100>目标 → SAN↓ / HP 100→70（−15% 再 −10% 双扣）→ 破境失败 + 心魔 flag `v49heart_魔法师`=1 ✓ |
| 选项区 | 破境后仅剩"返回游戏"按钮，无累积 ✓ |
| 控制台 | 0 error / 0 assert ✓ |

---

## 三、存档兼容

- localStorage 主键 `elda-qunxiong-v3-save` 不变；
- 新增 S 字段：`S.btGuardian`（tutor/senior/friend/none，默认 none）、`S.btPlace`（sacred/safe/wild，默认 safe）、`S.btHistory`（数组 ≤50 条）、`S.flags.v49book_<job>_<realm>`、`S.flags.v49heart_<job>`、`S._btCrisis`（内存态，不落盘）；
- 旧存档读取到缺失字段时均按使用处默认值兜底，无需迁移；QA 已通过预置 v48 存档加载验证（内存级）。

---

## 四、遗留说明

- 游侠危机 `ranger_storm` 选项 a 的 `stat:"SURVIVE"` 已补映射（`S.attrs.SURVIVE || S.attrs.SUR || 40`）；
- `v49_rollStep` 的 tierLabel 传 "ok"/"fail"，writeDice 无此档位时落到默认成功/失败样式，视觉正确，未改；
- 原 `attemptBreakthrough()` 保留为兼容入口，新流程走 `v49_openBreakthrough()`；
- 分片版 `index.html` 与 `chunks\` 已重建并同步，`game_check.html` 已同步。

## 五、结论

v49 破境系统全部完成：多重判定、低阶顺利高阶危机、护法化解机制、失败可择日再试（心魔 flag）、九职业专属叙事全部落地；全量验证绿、三路同步、旧档兼容、浏览器回归 0 错误。
