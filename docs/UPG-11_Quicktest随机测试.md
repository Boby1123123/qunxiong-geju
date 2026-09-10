# UPG-11 Quicktest/Randomtest 自动化质检（路径覆盖）

> 批次：UPG-11｜优先级：P2｜依赖：UPG-04（节点 tag 通道）｜状态：✅ 已实施（elda test 子命令）

## 做了什么

新增 `tools\elda\test_impl.py` + `elda.py test` 分发（`elda test static / random / all`）：

### 静态分析器 `elda test static`
基于 **game.html（唯一内容权威源）+ chunks/*.js（运行时按需分片）并集**提取全部节点定义（对象式 + 函数式 `return {}` 兼容），输出：
1. **go 目标存在性**：静态 go 指向全集不存在且非动态前缀 → 死链（FAIL）
2. **flag 引用声明检查**：`S.flags.x` 引用 vs 声明并集（`S.flags.x=true` / `setflag:` / `effects.flag` / `flags["x"]=true`）——warn 登记（动态 flag 合法）
3. **完全无引用节点**：定义外全文出现 ≤1 次 → 真死代码（FAIL）
4. **无静态入边节点**：动态入口/条件解锁（travelTo 变量拼接、好感/flag 解锁、事件触发）静态无法建模 → warn 登记
5. **S 键引用**：`S.xxx` 未知键 → warn 登记

动态生成前缀白名单（模板/建号/面板节点，运行时会构造，go 指向不算死链）：`origin_` / `echo_` / `v65_war` / `v655_` / `v34_` / `ending_` / `mem_` / `dyn_` / `panel_` / `v69_`。

### 随机游走 `elda test random [局数] [步数]`
多种子（入口 + 无入边节点共 851 种子）+ 10% 随机重启防 hub 回环偏置，输出**命中报告**：命中节点数 / 0 命中候选清单（供人工复核）/ TOP12 高命中节点。报告性质，门禁由 static 承担（完全无引用 FAIL）。

## 为什么（口径说明）

- **权威源选择**：本项目架构为「game.html 唯一内容权威源 + 渐进式分片（chunks 按需 fetch）」，故分析全集 = game.html + chunks 并集，才反映玩家运行时可用的全部节点。
- **不可达不设 FAIL**：4257 节点中 782 个无静态入边，全部有动态引用（条件解锁/变量 travelTo），静态图无法建模状态累积；门禁只对"完全无引用"（真死代码，当前 0）FAIL，避免误杀内容包深链。
- **random 不设 FAIL**：0 命中 70.8% 是深链解锁型内容池的正常分布，作为人工复核清单使用。

## 首跑结果（game.html + chunks 并集）

```
[UPG-11 static] 节点=4257 go边=6859 死链=0 动态目标=40 完全无引用=0 无静态入边=782  → PASS
[UPG-11 random] 局数=50 步数=300 种子=851 命中=1251/4257 0命中=3012（报告性质）
```

## 如何验证

```
python -X utf8 tools\elda\elda.py test static   # 门禁：死链 0 + 完全无引用 0
python -X utf8 tools\elda\elda.py test random   # 命中报告
python -X utf8 tools\elda\elda.py test all      # 两者一次跑
```

## 扩充记录

- 扩了什么：elda CLI 新增 test 命令族；静态死链/死代码门禁 + 随机命中报告。
- 为什么：ChoiceScript quicktest（系统性遍历）+ randomtest（随机游玩命中报告）对标；现有 `content chain` 只查死链，未覆盖 flag 声明/真死代码/命中分布。
- 如何验证：static 在已知死链上正确报错（origin_clue 等动态目标被识别为动态而非误报）；random 输出命中分布可复核。
