# 批 7 交付记录（P1-3 性能预算门 + P1-4 命名对齐与死代码清理）

- 版本：v76（2026-09-09）
- 范围：阶段二 P1-3 性能预算门（budget.json + c_speed FAIL 级）+ P1-4 命名对齐 / 死代码清理
- 铁律核对：判定公式 / writeNext / choose / 存档语义零触碰；saveVersion=48 不变；节点内容零损失

---

## 一、P1-3 性能预算门（budget.json + c_speed 升级 FAIL 级）

### 新建 `budget.json`（根目录）
```json
budgets:
  game_html_bytes_max   6000000   （≤6MB 红线）
  chunked_html_bytes_max 3500000
  node_total_min         2618      （内容零损失红线）
  dead_links_max         0
  full_seconds_max       20.0
baseline: 2026-09-09 v75.1 实测（game 5,979,415B / chunked 3,383,629B / 节点 3711 / full 9.2s）
```

### `tools/eldacheck/checks/c_speed.py` 升级
- 保留原有耗时计时项（慢检查器 >5s WARN）
- 新增**性能预算门**（FAIL 级）：6 项核验
  1. game.html 字节 ≤ 6MB
  2. game.html ≤ baseline（逐版防膨胀；合法增长需人工更新 budget.json 并写明理由）
  3. game_chunked 字节 ≤ 3.5MB
  4. 节点数 ≥ 2618（口径与 c_links/c_chunks 完全一致：单文件 N[id] 定义 ∪ chunks 分片定义）
  5. 静态 go 死链 = 0（`go:"id"` 静态引用口径与 c_links 一致；动态拼接如 `"slow_travel_"+` 不计入）
  6. full 总耗时 ≤ 20s
- 任一 FAIL → 本检查器 FAIL → elda full / elda ci 拦截发布（退出码 1）

### `tools/eldacheck/eldacheck.py`（一行）
- `_cspeed.run(None, timings)` → `_cspeed.run(html, timings)`（预算门需 html 统计节点/死链）

### 实测与拦截实验（验收）
- 正常：6 项全 PASS，elda full 全绿
  ```
  [PASS] game.html=5979415B ≤ 上限 6000000B
  [PASS] game.html=5979415B ≤ baseline 5979415B
  [PASS] game_chunked=3383629B ≤ 上限 3500000B
  [PASS] 节点=3711 ≥ 下限 2618
  [PASS] 静态 go 死链=0 ≤ 0
  [PASS] 总耗时=5.8s ≤ 20.0s
  ```
- **拦截实验**：临时将 game_html_bytes_max 改为 1 → `[FAIL] game.html=5979415B ≤ 上限 1B` + 整体 FAIL + 退出码 1（验证后已恢复 6000000）

---

## 二、P1-4 命名对齐核查

| 目标 | 核查结果 | 处置 |
|---|---|---|
| CAREER_HUB_V57 / APPRENTICE_V57 对齐 | game.html 与 src 全量扫描 = 0 处残留 | 已自然对齐（v68 重构/权威源统一时无残留），无需改动 |
| v61_timer 命名统一 | `v61_timer`（单数=注册函数）×7、`v61_timers`（复数=注册表 {list:{}}）×6、`v61_clearAll`（清理）×7 | 单/复分离是规范设计，非混用，无需改动 |

结论：命名对齐无实际改动需求（无残留、无混用），已逐项记录核查证据。

---

## 三、P1-4 死代码清理（安全子集）

### 已执行：build 双轨脚本归档（移动，未删除）
- `build_elda.py` + `story_elda_*.py`（64 卷）共 **65 个文件** → `backup\archived\20260909_P7\`
- 依据：QA_v43 起权威源=game.html；v69 起权威源=src/；该链与 v30+ 实际内容脱节；elda.py / _build_authority.py / eldacheck.py 均无引用（已逐一核实）
- 附 `_ARCHIVED_README.txt` 归档说明；如需还原直接移回根目录

### 明确不清理（记录理由）
- **孤岛节点**（c_dead 候选 639/475）：动态拼接 go（如 `"slow_travel_"+`、`"seal_"+`）会误报为孤岛；删除有违"2618+ 节点内容零损失"红线，收益与风险不成比例 → **保持现状**，c_dead 为候选清单制不阻断验证链
- **根目录 _vXX 历史脚本（约 180 个）**：不动（elda stale 已列入候选清理清单；不在构建链，移动无收益）

---

## 四、验证链汇总（elda ci 全绿）
```
src 语法 node --check（19 块）        PASS
权威源幂等 verify                    PASS
四路字节一致（5,979,415B / 3,383,629B）PASS
elda full 18 检查器 + 性能预算门 6 项   PASS
拦截实验：预算超限 → FAIL + 退出码 1   通过
```

备份：`backup\P7_20260909\`（budget.json / c_speed.py / eldacheck.py / elda.py / 实施脚本 + 归档说明）
