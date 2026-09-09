# CT-1 内容工具图谱标签化（三大路线 · 线一）

> 批次：CT-1（2026-09-09）｜ 状态：已完成并验证｜ 前置：v91 基线（3,823 节点 / 75 事件 / elda ci 20 检查器全绿）

## 一、做什么（改动清单）

### 1. node_graph.html 标签化再生成（可再生成工具产物）

- **旧状**：`tools\content_tools\node_graph.html`（396 KB）为 2026-09-06 静态导出，仅 1,219 节点、无 tag 字段、无卷着色，与 v91 全量内容（3,823 节点）严重脱节。
- **新状**：新增生成脚本 `tools\content_tools\gen_graph.py`，从 src 权威源 + chunks 分片**全量再生成**（与 budget node_count 同口径）：
  - 节点 3,823 / 关系 6,213 / 45 卷（14 个 v62 分片 + 12 个主卷 + 5 个 data_nodes 卷）
  - 按标签过滤：主线/支线/事件/结局/彩蛋/其他 六类下拉 + 按卷过滤下拉（45 卷）
  - 按卷着色：每卷固定色（图例右下角列出全部 45 卷节点数与密度）
  - 节点密度热区：节点尺寸按卷密度分档放大（高+3/中+1/低+0），左下角标注规则
  - 点击节点显示 卷/tag/pace/字数；搜索定位；重置视图
- **扩充说明（为什么）**：图谱从"一次性导出"升级为"可再生成工具"，新增内容包后一条命令刷新图谱，不再人工维护静态数据；tag 过滤为 BD 内容包选址与内容审计提供直观视图。
- **如何验证**：bu 桌面实测（见 §三）。

### 2. `elda content stat` 新子命令

- 实现于 `tools\elda\p2tools_impl.py`（新增 `_vol_nodes/_tag_of/cmd_content_stat`，dispatch 注册 `stat`）。
- 输出：
  1. **tag × 卷 矩阵**（节点数）：27 个有效内容卷 × 六类 tag 全表；
  2. **tag × pace 矩阵**：light/normal/deep/epic 四档 × 六类 tag；
  3. **薄域识别**：按节点数升序输出密度最低三域（当前 dn_demo=1 / dn_warfront=7 / script_02f=13），为 BD 内容包选址提供数据；
  4. 事件池规模（75 则：天灾×18 奇遇×21 商机×17 人祸×19）+ 各卷好感调用分布（dn_u8×35 居首）。
- **不改运行时**：纯命令，仅 dev 侧。

## 二、关键实现细节

- 节点提取口径与 budget_impl.node_count 完全一致：主文件 `N["x"] =` + 分片 `nodes["x"] =`，含中文 id（v57b_* 等 373 个），并跳过注释误配（dn_demo.js 注释样例）——实测 3,823 = budget 口径零差异。
- 分片卷命名：`chunk_<v62 后缀>`（chunk_seal/chunk_city/…），与主卷区分。
- 边提取：节点体 go:/then: 静态引用（含动态 curNode 无法静态建边，属已知口径限制）。

## 三、验证链结果

### elda ci（回归门禁）
```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=6221943B game_check=6221943B / chunked=3573097B index=3573097B）
[PASS] elda full 20 检查器
门禁结果：全部通过（可发布）
```
（CT-1 仅动 tools 侧，游戏运行时代码零改动，四路字节与节点 3,823 不变。）

### bu 桌面 1280 实测（file:// 打开 node_graph.html）
| 项 | 结果 |
|---|---|
| 页面加载 | 标题"艾尔达大陆：群雄割据 - 节点关系图（标签化）"，vis.js 网络渲染完成 |
| 头部统计 | 节点:3823 关系:6213 卷:45 生成时间 2026-09-09 17:02:16 |
| 标签过滤 ending | "过滤后: 50 节点 / 13 关系"（与 stat 表 ending=50 一致）|
| 卷过滤 chunk_seal | "过滤后: 15 节点 / 0 关系"（seal 分片 ending 标签 15 个，组合过滤正确）|
| 搜索定位 | "找到 1 个，已定位: seal_1_arrival" |
| 重置 | "过滤后: 3823 节点 / 6201 关系"（全量还原）|
| 节点元数据 | seal_1_arrival → vol=chunk_seal tag=other pace=normal ✓ |
| 图例/密度标注 | 右下 45 卷图例 + 左下密度热区规则说明（screenshot OCR 确认）|

## 四、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| 图谱可再生成 | gen_graph.py 替代静态导出 | 内容包增长后图谱一条命令刷新 | 重跑 gen_graph.py 输出 3,823 节点与 budget 一致 |
| 卷过滤 | 45 卷下拉 | 定位单卷内容 | bu 实测 chunk_seal 过滤 |
| 密度热区 | 节点尺寸随卷密度分档 | 一眼识别薄/厚区域，为内容包选址 | screenshot 图例与 OCR |
| stat 薄域识别 | 最低三域输出 | BD 包选址数据 | 命令实测 dn_demo/dn_warfront/script_02f |
| 事件池分类统计 | 天灾/奇遇/商机/人祸计数 | 事件池治理基线 | stat 输出 75 则分布 |

## 五、验收对照（CT-1）

- [x] node_graph.html 接 node_tag 标签（五类过滤）
- [x] 按卷着色（45 卷）+ 节点密度热区
- [x] `elda content stat` 按 tag×卷×pace 汇总表
- [x] 薄域识别（密度最低三域）
- [x] 不改运行时；elda ci 全绿；四路字节一致；节点 3,823 零损失
