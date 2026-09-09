# P2 畅玩增强 · 四批交付汇总（v76）

- 版本：v76（2026-09-09）
- 范围：P2-1 内容工具生态 / P2-2 多周目系统 / P2-3 移动端与无障碍 / P2-4 文本治理自动化
- 铁律核对：判定公式 / writeNext / choose / 存档语义零触碰；saveVersion=48 不变；节点 3711 零损失；旧档兼容（applyDefaults 兜底）

---

## P2-2 多周目系统（运行时，已发布）

### 新状态字段（script_03 emptyState + applyDefaults 兜底）
- `S.ngPlus:1`（显式默认）、`S.runHistory:[]`（周目记录，≤50 条滚动）、`S.endingsCollected:[]`（结局收集）、`S._endingRecorded:false`（幂等标志）
- 旧档自动兜底补默认（saveVersion=48 不变，c_save 仿真通过）

### 结局记录（script_02 `N["ending"]`）
- 结局展示时幂等记录：{ending, days, realm, ng, ts} 入 runHistory；结局名入 endingsCollected；即时 saveGame()

### 结局图鉴（openNGPlusPanel 扩展）
- 多周目面板新增"结局图鉴（已收集 x / y）"：ENDINGS_ABYSS（深渊线 7）+ TRUE_ENDINGS（真结局 6）全集
- 每结局显示 ✅已达成 / 🔒未达成 + 达成条件 + 描述

### 成就扩展（ACHIEVEMENTS_DATA +5）
| id | 名称 | 条件 |
|---|---|---|
| ending_1 | 走向终点 | 收集 ≥1 结局 |
| ending_3 | 命运多舛 | 收集 ≥3 结局 |
| ending_seal | 封印者之途 | 达成封印者结局 |
| ng_2 | 轮回者 | 二周目（runHistory≥2 或 ngPlus≥2） |
| ng_5 | 百世轮回 | 五周目 |

### 随机事件池扩展位（P2-2 标准化）
- `EVENT_POOL_EXT = []`（script_01，window 导出）+ checkWorldEvents 末尾循环（script_03）
- 规范：`{id, day, text, node}` 追加即自动触发（day 到点 + 未重复标志 + worldQueue + 日志）；默认空数组零影响

### 验证
- 发布链全绿（节点 3711 / 死链 0 / 四路一致 / budget 门禁 6 项 PASS）
- 浏览器回归（真实代码路径）：emptyState 新字段 ✅ / 旧档兜底 ✅ / N["ending"] 记录 runHistory=1+endingsCollected=1+幂等 ✅ / 周目面板+结局图鉴 ✅ / 新成就 ending_1/ending_seal/ng_2 解锁（ending_3 待收集 3 种，正确）✅

---

## P2-1 内容工具生态（dev 侧，不进运行时）

`tools\content_tools\`（5 个工具 + 自测）：

| 工具 | 作用 | 用法 |
|---|---|---|
| node_editor.html | 节点可视化编辑器：加载 game.html/chunks\*.js → 搜索节点 → 表单编辑 text/options/place/where → 导出补丁 JSON | 浏览器打开 file:// |
| node_graph.html | go 引用关系图（复刻自 docs\archive，vis-network） | 浏览器打开 file:// |
| node_apply.py | 应用补丁 JSON 到 src 权威源（定位 N[id] 定义 → 只改数据字段 → node --check） | `python tools/content_tools/node_apply.py 补丁.json [--dry-run]` |
| batch_replace.py | 批量文本替换 + 检查（写前自动备份到 backup\） | `--list` / `--scan [--json]` / `<旧> <新>` |
| node_tag.py | 内容标签系统（main/branch/event/ending/easter，前缀规则自动判定） | `--scan` / `--apply`（写前备份） |

- node_apply 干跑实测：fc_jiaohui_entry 定位 + 字段替换验证通过（未写盘）
- node_tag 扫描：1634 可解析节点中 368 个可自动打标（branch 277 / main 47 / ending 28 / event 9 / easter 7）
- 说明：tag 为可选元数据字段，引擎 writeNext 忽略未知字段（新增节点只加数据不改引擎的红线不受影响）；**应用 tag 前建议先用 --scan 评估**（本批未 apply，保持零风险）

---

## P2-3 移动端与无障碍（双端验证）

- file:// 端：单文件版 + 分片版此前已全绿（UI 专项 375/768/1280 三档 + 本轮回归）
- http:// 端（elda serve 实测）：1280 桌面 main/story/行囊面板可开 ✅；375 移动视口行囊面板打开且完全在视口内（宽 324px ≤ 375）✅
- 无障碍（UI 专项已交付）：v67_ui.open 带 role=dialog/aria-modal/aria-label、触控 ≥44px、无 hover 依赖、对比度 v67 表、键位无冲突

---

## P2-4 文本治理自动化

- `batch_replace.py --scan` 对接 c_text 全量词表（同源保证，26 词）：报告 AI 味词 1,788 处（game.html 894 / script_02 705 / script_04 124 / script_03 52 …），**只报告不自动改**（文风属内容决策）
- 批量替换通道：`batch_replace.py <旧> <新>` 带自动备份（backup\batch_<时间戳>_*），替换后可跑 elda ci 门禁
- 中文标点笔误规则已内置（“”成对提示）

---

## 门禁终态
```
elda ci：src 语法 19 块 / 权威源幂等 / 四路一致（5,981,064B / 3,384,495B）/ full 18 检查器 + 预算门 6 项 —— 全部 PASS
budget.json baseline 已更新至 v76（P2-2 功能性新增 1,649B，预算门按设计先拦截、确认合法后更新基线）
```

备份：`backup\P2-2_20260909\`（43 项：src 全量 + 四 html）
