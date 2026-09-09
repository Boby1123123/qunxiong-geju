# U6 · 内容工具生态（C1 节点校验 / C5 内容工具）

> 批次：U6 | 日期：2026-09-09 | 依据：U1-U9 口令 C1、C5 项

## 一、改动清单

| 文件 | 改动 | 说明 |
|---|---|---|
| tools\elda\nodes_impl.py（新增 7.5KB） | `elda node` 子命令实现：new / check / stats | 内容工具内核（C5） |
| tools\elda\elda.py | main() 注册 `node` 分发 | 一行接入 |
| docs\u6_content_tools_v86.md | 本批文档 | 见下 |

## 二、内容工具三命令

### 1. `elda node new <id>` —— 新增节点只加数据
- 生成合规对象式节点模板到 `src\data_nodes\dn_<id>.js`（含 place/where/text/options 骨架 + 数据注释 + /u6inj:dn 标记）
- **验证口径**：新增 1 节点 = 写一个数据文件，引擎零改动（对象式节点由 writeNext 的 typeof 双兼容直接渲染）

### 2. `elda node check [--file x]` —— 全量/单文件校验
| 校验项 | 口径 | 结果 |
|---|---|---|
| 格式合规 | 对象式 N["id"]={...} / 函数式 N["id"]=function(){...}（含"先执行后 return"形式，本批修正提取正则） | 0 问题 |
| 必填字段 | text 存在（字符串/函数/数组） | 0 问题 |
| 引用完整性 | go/goto/next/target/curNode= 目标必须存在（全量 id 集 = game + chunks + 外置） | 0 问题 |
| travelTo 豁免 | travelTo("south_gangkou") 是 REGIONS 城市 id（非 N 节点），由城市系统校验，不列入节点引用 | 已豁免 |

**结果：全量 3,370 节点（game 1,564 + chunks 独有 1,805 + 外置 1）0 问题**

### 3. `elda node stats` —— 内容量统计
- 3,370 节点：对象式 365 / 函数式 1,199（game.html 内联口径）+ 外置 2 文件
- 选项约 3,461 条、区域 Top10（墨丘利研究室 27 / 学院·西塔楼 16 / 地下图书馆 13 …）

## 三、本批技术修正（C1 校验器打磨）

1. **提取正则缺陷**：原正则只匹配 `function(){return {` 立即返回式，遗漏 `function(){ 先执行; return {...}; }` 形式（如 academy_elda_hub 调 initAcademyV28 后 return）——修正为 `function(...)` 任意函数体，chunk 提取 2,352 → 2,894（+542 节点）
2. **travelTo 误报**：17 个 DANGLING 实为城市 id（south_gangkou/free_jiaohui/east_tiemen 等 REGIONS 城市），非节点引用——豁免后 0 问题
3. **单文件模式**：外置数据文件 check 需加载全量 id 集（引用主游戏节点属正常）

## 四、验证链

```
[PASS] elda node check  全量 3,370 节点 0 问题
[PASS] elda node check --file src\data_nodes\dn_demo.js  单文件校验
[PASS] elda node new test_node1 → 生成模板 → check 0 问题（测试后删除）
[PASS] elda node stats  统计正常
[PASS] elda ci  src 语法 26 块 / 幂等 verify / 四路一致 / 18 检查器 全绿
```

## 五、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| travelTo 豁免机制 | 城市 id 不列入节点引用校验 | REGIONS 城市系统是独立数据域，误报会阻碍内容工具使用 | south_gangkou 等 17 项误报消除 |
| 函数式提取全面化 | 支持"先执行后 return"节点 | 引擎大量节点为 initAcademyV28() 式先执行函数 | chunk 提取 +542 节点 |
| 全量 id 集口径 | check 用 game+chunks+外置 并集 | 消除分片式误报 | 3,370 全量 0 问题 |

## 六、回滚

- 删除 tools\elda\nodes_impl.py + elda.py 中 node 分发行即可回滚（工具层，不影响游戏本体）
- 无游戏内容改动

## 七、后续

- U8 NPC 生态/事件池将用 `node new` 生成合规节点、`node check` 做提交前校验
- "新增 1 节点只加数据不改引擎"已工具化闭环：node new → 写数据 → node check → 构建 → 游戏内可触发
