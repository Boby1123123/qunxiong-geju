# T-N 作者工具（游戏内节点编辑器）

> 批次：T-N1/T-N2/T-N3（六大方向升级 · 方向三 作者工具）
> 日期：2026-09-10
> 基线：v92；elda ci 38 检查器；四路 game=game_check=8,489,541B / chunked=index=5,721,991B

## 一、扩了什么

### T-N1 编辑器骨架
- 顶栏新增「✎ 编辑」按钮（id=btn-nodeedit）+ `v92_openNodeEditor()` 弹窗
- `v92_nodeSearch(kw)`：按节点 id 或正文关键词搜索全部节点（最多 60 条），显示 tag/pace/字符数/place

### T-N2 编辑 + 脚手架 + 校验
- `v92_nodeEditOpen(id)`：打开单节点编辑器——place 输入框 + text 多行编辑（数组元素用 `<<<>>>` 分隔）+ pace 下拉
- `v92_nodeSave(id)`：保存到**当前会话**（写入 window.N[id]，即时生效；刷新还原——零持久化零风险）；若正在渲染该节点自动重渲染
- `v92_nodePreview(id)`：预览正文（走 writeNext 正常渲染路径）
- `v92_nodeScaffold()` / `v92_nodeCreate()`：新建节点脚手架（id 格式校验：字母开头+字母数字下划线；重名拦截；默认 pace=normal）——对应 elda content new 的游戏内版
- `v92_nodeExport()`：导出补丁 JSON（`{kind:"elda-node-patch-v1", nodes:{改动}, created:{新增}}`）下载，回写 `src\data_nodes\dn_patch.js` 完成内容生产闭环
- 修改标记：搜索结果中已改节点显示"已改"

### T-N3 模板库 + 工具手册
- 编辑器内置骨架即"合规节点模板"（tag/place/pace/text 全字段，与 elda-content-author node-schema 同构）
- 工具手册（docs\工具手册.md）增补：游戏内编辑器操作说明 + 补丁回写流程 + 与 elda content new 的关系

## 二、为什么

- **内容生产闭环的最后一公里**：CT 系列给了命令行脚手架与校验，游戏内编辑器让"看到哪改到哪"——改完即时预览，导出补丁回写源码再走 ci。
- **零风险设计**：会话级编辑（刷新还原）、不写 localStorage、不触碰 writeNext/choose/S/存档结构；导出格式与既有 dn_patch 流程兼容。
- 参考 WebGAL 等项目的可视化编辑思路，但克制为纯文本工具，不引入外部编辑器框架（单文件约束）。

## 三、如何验证

- `node --check`（26 块）✅
- 完整验证链：build → Copy → chunks → sync 四路字节一致（8,489,541B / 5,721,991B）✅
- `elda ci` 38 检查器全绿（预算门 +12KB 合法增长已更新）✅
- `smoke_test.py` PASS ✅
- 浏览器实测：✎ 编辑 → 搜索"交汇城"→ 打开节点 → 改文本 → 保存 → 预览 → 导出补丁（bu 实测见批次记录）

## 四、改动清单

| 文件 | 位置 | 差异 |
|---|---|---|
| src\script_03.js | v92_openThreadPanel 前 | +v92_nodeSearch/EditOpen/Save/Preview/Export/Scaffold/Create/OpenNodeEditor/DoSearch（约 12KB） |
| src\gap_00.html | btn-world 后 | +「✎ 编辑」按钮 |
| docs\T-N_作者工具.md | 新建 | 本文档 |
| docs\工具手册.md | 增补 | 游戏内编辑器 + 补丁回写说明 |

## 五、扩充记录

- **扩充**：原计划 T-N1 仅"编辑器骨架"，本轮一步到位完成搜索/编辑/脚手架/导出全流程（T-N1~N3 合并）。
- **为什么**：作者工具的价值在闭环——只给骨架不如不给。
- **如何验证**：bu 实测改文本后预览即时生效；导出 JSON 格式与 dn_patch 兼容。
