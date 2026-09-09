# QA_v41 检验报告 · 全面核查与占位清零

> 日期：2026-09-07 · 范围：v41 超大型核查 + 占位节点全量重写
> 工作目录：`D:\1pao tuan\群雄割据` · 主交付：`game.html`（5.75MB / 2618 节点）

## 一、本轮核查结论

### 1. 结构性清理（已执行，备份 `backup\game_v41_before_dedup2.html`）
- 11 处 function 格式"重复定义"：确认为两代精修叠加（靠后版本生效），删除靠前版本。
- `arrive_generic` function 版 vs 对象精修版：删除前者，保留生效精修版。
- **文件末尾空 `<script>` 残留已清理**：原 script 开标签 6 / 闭标签 5 不匹配 → 现正常。
- 验证：`node --check` 0 错误；死链 0（go 引用 6028 → 5988）。

### 2. 重大发现与修复：v37 占位节点 152 个 → **0 个**
- 此前 `_probe_ph4.py` 仅统计 v38 标记（0），漏报 v37 标记（"（此节点为v37占位节点…）" / "（待补充内容）。"）。
- 核查确认 152 个占位中 **147 个可达**（玩家会遇到）+ **5 个孤立**（无入边）。
- 本轮五批全部重写，累计 **153 个节点**替换为 300-500 字连续叙事（含 city 批 48 个，其中一处同 ID 二次覆盖，最终仍为完整叙事）。

| 批次 | 脚本 | 数量 | 覆盖模块 |
|---|---|---|---|
| 第一批 | `_v41_rw_origin.py` | 38 | 9 条出身序章线 |
| 第二批 | `_v41_rw_travel.py` | 21 | 7 段旅行路线（day2/day2_solo/explore） |
| 第三批 | `_v41_rw_city.py` | 48 | 8 大城市探索 |
| 第四批 | `_v41_rw_ay.py` | 22 | 学院五年年度主线 |
| 第五批 | `_v41_rw_cm.py` | 24 | 11 名同学支线（含墨丘利/神秘人） |
| **合计** | | **153** | |

### 3. 核查通过项
- **选项格式**：292 处 `{ text:` 均为节点正文换行误报；节点选项全部 `t:`；渲染端 `showOptions` 用 `o.t || rich(o.t)`，`choose()` 兼容 timeCost/effect/run。
- **存档键一致**：读/写均为 `elda-qunxiong-v3-save`；newGame 有 `ensureMechInit` 装饰器包装。
- **孤立节点 417 个**：抽样核查为模板/事件池/面板函数动态引用/子串误报，**未判定为 bug**。
- **引擎函数**：核心函数（writeNext/choose/newGame/saveGame/loadGame/advanceTime/startCombat/openModal/closePanel/renderStats/renderTop/writePar/doCultivate/worldTick…）均有定义；`openRealmPanel/showRollResult/renderInventory/openMap` 调用次数为 0，判定为旧版改名误报。
- **eval** 仅存在于调试 REPL 模块，非游戏逻辑。
- **主线链路**：经 bu 浏览器轮验证建号→序章→渲染全流程正常；部分"缺失"为入口命名差异（如 `academy_main`、`seal1_act1_intro`）。

## 二、本轮修复的死链（共 4 处）

| 死链 ID | 修复为 | 说明 |
|---|---|---|
| origin_north_3 | origin_northern_3 | 北方线主线第 3 幕 |
| origin_orc_2c | origin_orc_2a | 兽人线主线第 2a 幕 |
| origin_southern_2c | origin_southern_2a | 南方线主线第 2a 幕 |
| city_holy_intro | city_shengcheng_intro | 圣城实际入口 |
| city_ironpeak_intro | city_tiefeng_intro | 铁峰堡实际入口 |
| seal_choose | seal1_act1_intro | 七印线实际入口 |

## 三、验证链（每批通过）

```
python _chk_quotes_gen.py <脚本>   → 笔误 0（中文「」笔误预检）
python _v41_rw_*.py               → 全部 ✓ 已替换
python _v39_extract.py            → 提取 5 个 script
node --check _chk_2.js            → 语法 PASS
python _check_dead_links.py       → 死链 0
python _audit_deep4.py            → v37 占位 0
python _audit_deep13.py           → 可达占位 0 / 孤立占位 0
```

## 四、当前状态

| 指标 | 值 |
|---|---|
| 文件大小 | 5,753,427 字节（5.75MB） |
| 节点总数 | 2618 |
| go 引用 | 5988 |
| 死链 | 0 |
| v38 占位 | 0 |
| v37 占位 | **0（153 个全部重写）** |
| localStorage 键 | elda-qunxiong-v3-save（不变，存档兼容） |

## 五、遗留说明

1. **5 个孤立占位已一并重写**（cecilia_marcus_talk / marcus_promise / marcus_sister / thorin_father / thorin_promise），虽无入边，内容完整可用。
2. 417 个"孤立节点"判定为动态引用/模板节点，不构成阻断；如需逐个确认可复用 `_audit_deep13.py`。
3. 浏览器回归（bu）建议路径：新建角色→任一序章线→学院→城市/旅行/同学支线抽样，确认渲染与选项跳转正常。
