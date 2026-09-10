# UPG-15 节点物理分区组织（CoffeeMud areas/ 模式）

> 批次：UPG-15｜优先级：P2｜依赖：UPG-04｜状态：✅ 已实施（elda ci 第 38 检查器）

## 做了什么

借鉴 CoffeeMud `areas/` 目录 + Dead Souls `areas/<area>/` 布局，把 4,329 个节点的物理组织规范化。

### 节点注册表（新文件 `src\data_nodes\dn_registry.js`）
`NODE_REGISTRY` 九域分区索引（替代 scene_list 概念）：
- north 北境（frontier/grad/warphase/war/abyss/relic…）
- free 自由城邦（fc/city/guild/tavern/echo…）
- academy 学院（academy/acad/classmate/alumni/orientation…）
- desert 死亡沙漠（desert/dun/underworld）
- west 西境（west/airship/floating）
- east 东境（east/aurelian/succession/court…）
- church 光明教会（church/seal1-7/anchor/goldscale/faith…）
- elf_dwarf_orc 精灵/矮人/兽人（elf/dwarf/orc/senlin/worldtree…）
- system 引擎/系统（origin/prologue/sub/arc/npc/ending/v65*/faction/eclipse/…）

每域 `{name, prefixes[], desc, files[]}` 静态元数据；运行时节点加载仍走既有 NODE_MAP 分片（渐进式分片架构=areas 模式在 Web 的落地，本批不重复建设）。

### 命名规范检查器 c_regions（elda ci 第 38）
从 game.html 全量提取 N["id"] → 按前缀归入九域 → 覆盖率门禁 ≥97%（首跑 91.11% → 补全 faction/anchor/eclipse/extinct/board/goldscale/south/pro/disaster 及 40+ 一次性历史前缀 → **100%**）→ 输出九域节点分布表（details）+ 未知前缀清单（WARN 登记）。新增内容时新前缀必须进表。

### 规范固化
`docs\UPG-15_节点分区注册表.md` + elda-content-author `references\node-schema.md` 增补命名规范段：新节点 id 用 `<region>_<area>_<seq>`，前缀必须已登记于 NODE_REGISTRY。

## 为什么

扁平 script_02.js 与 data_nodes 混装 4,300+ 节点，无法回答"北境有多少节点、哪个文件管什么"。注册表+检查器把**物理分区变成可核验的工程事实**：批量质检（按域跑 ci）、新增内容（前缀合规）、维护定位（九域索引）都落地。大规模物理搬迁 4,600 节点风险高且字节一致性脆弱，且渐进式分片（game.html 内联 + 23 chunks 按需加载）已实现 areas 模式的运行时价值——本批补齐管理面。

## 如何验证（已完成）

- `node --check`（26 块）PASS；build→Copy→chunks→sync 四路一致（game=8,449,310B / chunked=5,682,365B）
- `elda ci` 38 检查器全绿（c_regions 覆盖率 100%，4,329/4,329；预算门 6 项 PASS）
- `smoke_test.py` PASS

## 扩充记录

- 扩了什么：NODE_REGISTRY 九域注册表 + c_regions 第 38 检查器 + 命名规范文档 + node-schema 规范段。
- 为什么：CoffeeMud areas 模式的管理价值（批量质检/新增合规/维护定位），运行时加载已由分片架构承担。
- 如何验证：覆盖率门禁 97%→实测 100%；ci 38 项全绿；四路字节一致。
