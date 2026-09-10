# G-N2 收集图鉴引擎（六方向 · 玩法线）

> 批次：G-N2 ｜ 日期：2026-09-10 ｜ 版本基线：v92（saveVersion=48）｜ 状态：已实施并提交

## 一、做什么

实现**收集图鉴引擎**——把玩家的"见识"沉淀为可回看的收集面板：

- **标记钩子 `v92_galleryMark(key, label)`**：幂等写入 `S.gallery[key] = {label, day, got}`（独立键，applyDefaults 兜底）。
- **三类自动触点**：
  1. 商路买卖成功 → `good_<id>`（G-N1 预留钩子兑现）；
  2. 专名高亮命中（v92_highlightNames）→ `npc_<专名>`（见过即收）；
  3. 面板操作与渲染管线内 try/catch 保护，任何触点失败不影响主流程。
- **展示面板 `v92_openGalleryPanel()`**：居中弹窗，按 `good_/place_/npc_/event_/other_` 五类前缀分组，显示条目数与收集日；商路面板底部有「📖 收集图鉴」按钮入口。

## 二、新增/改动文件（文件 + 位置 + 差异摘要）

| 文件 | 位置 | 差异摘要 |
|---|---|---|
| `src\script_03.js` | ~4520 前 | `/g2inj:engine/`：`v92_galleryMark`（幂等收集）+ `v92_openGalleryPanel`（五类分组弹窗） |
| `src\script_03.js` | applyDefaults 附近 | `/g2inj:def/` 兜底：`if(!s.gallery) s.gallery={};` |
| `src\script_03.js` | 高亮命中处 | 专名命中自动 `v92_galleryMark("npc_"+nm, hlDesc||nm)` |
| `src\script_03.js` | 买入成功处 | `v92_galleryMark("good_"+good, g.cn)` |
| `src\script_03.js` | 商路面底部 | 新增「📖 收集图鉴」按钮 |

## 三、关键设计决策

1. **独立键、零存档结构改动**：`S.gallery` 不进存档 schema，saveVersion=48 不变，旧档兼容（缺省空对象）。
2. **幂等写入**：同 key 只记首次（`if(key && !S.gallery[key])`），专名高亮每渲染触发也不重复记账。
3. **五类前缀分组**：`good_/place_/npc_/event_/other_`，为后续内容批（城市访问 place_、事件经历 event_）预留挂载点。
4. **零回归约束**：标记钩子全部 try/catch + `if(window.v92_galleryMark)` 存在性检查，不改变任何判定/渲染语义。

## 四、验证链结果

- `node --check`：26 块全绿。
- `elda sync`：四路字节一致（game=8,511,819B / chunked=5,743,891B）。
- `elda ci`：38 检查器全绿、性能预算门 6 项 PASS、门禁结果「全部通过（可发布）」。
- `smoke_test.py`：PASS。
- bu 桌面 1280 实测：买入铁锭 → 图鉴 `good_iron` label「铁锭」day1 登记；`v92_openGalleryPanel()` 打开且分类显示正常。

## 五、扩充记录

- **扩**：五类前缀分类展示 + 收集日标注 + 空态文案（"尚未收集任何条目"）。
- **为什么**：收集系统让世界观名词（124 专名）从"被动读到"变成"主动集邮"，强化沉浸与重玩价值。
- **如何验证**：bu 驱动买卖→图鉴登记；专名高亮渲染→npca 类自动收集；ci/smoke/四路全绿。
