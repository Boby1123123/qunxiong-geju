# v29 高效开发工具链使用指南

## 概述

v29 工具链包含 12 个工具，旨在将《艾尔达大陆：群雄割据》的开发效率提升 500%。核心目标：消灭语法错误、自动发现死链、用 YAML 替代手写 JS、可视化节点关系、一键发布。

## 工具清单

| # | 工具 | 用途 | 常用命令 |
|---|------|------|----------|
| 1 | VSCode Snippets | 代码片段自动补全 | 输入 `node`/`tier`/`opt` 等触发 |
| 2 | build_enhanced.py | 增强构建+错误定位 | `python tools/build_enhanced.py` |
| 3 | check_references.py | 引用检查（发现死链） | `python tools/check_references.py` |
| 4 | generate_index.py | 节点ID索引生成 | `python tools/generate_index.py` |
| 5 | yaml_to_js.py | YAML→JS编译器 | `python tools/yaml_to_js.py input.yaml -o output.js` |
| 6 | js_to_yaml.py | JS→YAML反向转换 | `python tools/js_to_yaml.py story_elda_be.py -o output.yaml` |
| 7 | restructure.py | 项目结构重组 | `python tools/restructure.py --dry-run` |
| 8 | traverse_test.py | 自动化节点遍历测试 | `python tools/traverse_test.py --quick` |
| 9 | save_test.py | 存档兼容性测试 | `python tools/save_test.py` |
| 10 | visualize.py | 节点关系可视化 | `python tools/visualize.py` |
| 11 | dev_panel.py | 开发者面板（游戏内调试） | `python tools/dev_panel.py --inject` |
| 12 | release.py | 一键发布 | `python tools/release.py --quick` |

---

## 工具1：VSCode 代码片段

**文件**: `.vscode/elda.code-snippets`

**触发词**:
- `node` → 完整节点模板（place/text/options）
- `tier` → tier化选项（crit/ok/fail/critfail四档）
- `tier2` → 简化tier（ok/fail两档）
- `opt` → 快速选项（t/go/effect/timeCost）
- `const` → const数据结构（带_V29版本后缀）
- `func` → 辅助函数
- `ifflag` → 条件文本（if(S.flags.xxx)）
- `ifelif` → 多条件分支
- `init` → 系统初始化函数
- `nodetime` → 带timeCost的多选项节点
- `volhead` → 数据卷文件头

**用法**: 在 VSCode 中打开 `.py` 或 `.js` 文件，输入触发词后按 Tab 自动补全。

---

## 工具2：增强构建脚本

**文件**: `tools/build_enhanced.py`

**功能**:
- 构建时记录每个数据卷在最终 HTML 中的行号偏移
- 保存行号映射到 `_build_map.json`
- 构建后自动运行 `node --check` 语法检查
- 语法错误时自动定位到源文件和行号

**命令**:
```bash
# 完整构建+检查
python tools/build_enhanced.py

# 只检查语法（不重新构建）
python tools/build_enhanced.py --check

# 定位HTML某行对应的源文件
python tools/build_enhanced.py --locate 41346

# 显示行号映射表
python tools/build_enhanced.py --map
```

**输出示例**:
```
错误在 story_elda_be.py 第699行: relation:"cecilia:-10 缺少闭合引号
    ┌─ 源文件上下文（story_elda_be.py JS代码块）:
    │    697: ...
    │ →  699:       critfail:[...
    └──────────────────────────────────────
```

---

## 工具3：引用检查工具

**文件**: `tools/check_references.py`

**功能**:
- 扫描所有数据卷，收集所有节点ID
- 扫描所有选项的 `go:` 目标
- 对比找出死链（go到不存在的节点）
- 自动识别动态拼接目标（如 `go:"slow_travel_"+st.stage`）
- 预存例外（引擎动态节点）自动忽略

**命令**:
```bash
# 完整检查
python tools/check_references.py

# 严格模式（预存例外也当错误）
python tools/check_references.py --strict

# JSON格式输出
python tools/check_references.py --json
```

**预存例外**（自动忽略）:
- `city_free` - 城市自由行动动态节点
- `travel` - 旅行系统动态节点
- `arrive_generic` - 城市到达通用节点
- `act_rest` - 休息节点
- `title_screen` - 标题画面
- `ending_check` / `ending_choose` - 结局系统

---

## 工具4：节点ID索引生成器

**文件**: `tools/generate_index.py`

**功能**:
- 扫描所有数据卷，收集所有节点ID
- 按节点ID前缀分类（34个分类）
- 生成 `docs/NODE_INDEX.md` 索引文件
- 每个节点带地点、选项数、源文件行号

**命令**:
```bash
# 生成索引文件
python tools/generate_index.py

# 搜索节点
python tools/generate_index.py --search "seal1"

# 只显示统计
python tools/generate_index.py --stats

# 按文件分类显示
python tools/generate_index.py --by-file
```

**输出示例**:
```
按分类（前15）:
  其他                    491 个
  七印                    330 个
  学院章                   185 个
  NPC                    60 个
  ...
```

---

## 工具5：YAML→JS 节点编译器

**文件**: `tools/yaml_to_js.py`

**功能**:
- 用 YAML 写剧情，自动生成正确格式的 JS
- 自动处理 text 字段（简单文本→arr.push，复杂文本→函数）
- 自动处理 tier 选项（正确嵌套结构）
- 自动处理 effect 字段（数字不加引号，字符串加引号）
- 自动处理 timeCost（放在 effect 外面）
- 支持批量编译和 watch 模式

**YAML 格式示例**:
```yaml
- id: node_id
  place: 地点名
  text: |
    第一行文本
    第二行文本
  text_func: |  # 复杂文本用函数（优先级高于text）
    const arr=[];
    if(S.flags.xxx) arr.push("条件文本");
    return arr;
  options:
    - t: 选项文本
      go: 目标节点
      effect: {gold: 10, san: -5}
      timeCost: 1period
      check: INT
      tier:
        crit:
          text: 大成功文本
          effect: {reputation: 10}
        ok:
          text: 成功文本
          effect: {reputation: 5}
        fail:
          text: 失败文本
          effect: {san: -5}
        critfail:
          text: 大失败文本
          effect: {san: -10}
```

**命令**:
```bash
# 编译单个文件
python tools/yaml_to_js.py input.yaml -o output.js

# 批量编译（通配符）
python tools/yaml_to_js.py src/story/academy/*.yaml -o story_elda_academy.js

# watch模式（文件变化自动重新编译）
python tools/yaml_to_js.py input.yaml -o output.js --watch

# 只检查YAML语法
python tools/yaml_to_js.py input.yaml --check
```

---

## 工具6：JS→YAML 反向转换器

**文件**: `tools/js_to_yaml.py`

**功能**:
- 将现有的 `story_elda_*.py` 数据卷转换为 YAML 格式
- 简单 text（只有 arr.push）自动转换为纯文本
- 复杂 text（有条件判断）保留为 text_func
- 选项的 effect/tier 正确解析
- 支持批量转换和全量转换

**命令**:
```bash
# 转换单个文件
python tools/js_to_yaml.py story_elda_be.py -o output.yaml

# 全量转换（所有数据卷）
python tools/js_to_yaml.py --all --output-dir src/story/converted

# 只检查解析（不输出）
python tools/js_to_yaml.py story_elda_be.py --check
```

**往返一致性**: JS→YAML→JS，生成的JS语法正确（已验证）。

---

## 工具7：项目结构重组工具

**文件**: `tools/restructure.py`

**功能**:
- 自动分析现有数据卷的节点ID前缀
- 按主题分类到对应目录（prologue/academy/seals/cities/...）
- 转换文件为 YAML 格式
- 备份原 build_elda.py
- 支持预览模式（只显示计划，不实际执行）
- 支持回滚

**目标目录结构**:
```
src/story/
├── prologue/      # 序章
├── academy/       # 学院章
├── seals/         # 七印
├── cities/        # 城市
├── factions/      # 势力
├── races/         # 种族
├── characters/    # NPC
├── travel/        # 旅行
├── combat/        # 战斗
├── economy/       # 经济
├── items/         # 物品
├── quests/        # 任务
├── abyss/         # 深渊
├── ending/        # 结局
├── timeline/      # 时光回溯
└── systems/       # 系统剧情
```

**命令**:
```bash
# 预览重组计划（不实际执行）
python tools/restructure.py --dry-run

# 执行重组
python tools/restructure.py --execute

# 回滚到原结构
python tools/restructure.py --rollback

# 显示当前结构状态
python tools/restructure.py --status
```

---

## 工具8：自动化节点遍历测试

**文件**: `tools/traverse_test.py`

**功能**:
- 从 game.html 提取所有节点ID
- 检查每个节点的基本结构（place/text/options）
- 检查所有 go: 目标是否存在
- 检查选项格式是否正确（t/go/effect）
- 检查 tier 选项格式
- 检查括号匹配
- 生成测试报告 `docs/TEST_REPORT_v29.json`

**命令**:
```bash
# 完整测试
python tools/traverse_test.py

# 快速测试（只检查死链，跳过结构检查）
python tools/traverse_test.py --quick

# 详细输出（显示每个节点的检查结果）
python tools/traverse_test.py --verbose

# 测试单个节点
python tools/traverse_test.py --node "seal1_intro"
```

---

## 工具9：存档兼容性测试

**文件**: `tools/save_test.py`

**功能**:
- 检查 S 对象的所有字段是否有默认值
- 分析所有初始化函数
- 检查 v28+ 新字段是否有显式初始化
- 检查 localStorage 键名
- 生成兼容性报告 `docs/SAVE_COMPATIBILITY_v29.json`

**命令**:
```bash
# 运行兼容性测试
python tools/save_test.py

# 列出所有S对象字段
python tools/save_test.py --fields
```

---

## 工具10：节点关系可视化器

**文件**: `tools/visualize.py`

**功能**:
- 扫描所有节点，收集 go: 跳转关系
- 生成交互式 HTML 关系图（使用 vis.js）
- 按主题着色（30+主题颜色）
- 支持搜索、高亮、缩放、拖拽
- 支持物理引擎开关

**命令**:
```bash
# 生成关系图（默认输出 docs/node_graph.html）
python tools/visualize.py

# 指定输出路径
python tools/visualize.py --output my_graph.html
```

**使用**: 用浏览器打开生成的 HTML 文件，即可查看交互式关系图。

---

## 工具11：内容创作辅助面板（开发者模式）

**文件**: `tools/dev_panel.py`

**功能**:
- 生成独立的开发者面板 HTML
- 可注入到 game.html 中
- 按 F12 或输入 `devmode` 激活
- 功能包括：
  - 节点跳转（输入节点ID直接跳转）
  - 属性修改（金币/生命/理智/经验）
  - 快速跳转（标题/学院/七印）
  - 标记管理（查看所有 S.flags）
  - 存档管理（快速存档/读档/重置/导出）

**命令**:
```bash
# 生成独立的开发者面板
python tools/dev_panel.py

# 注入到 game.html
python tools/dev_panel.py --inject

# 从 game.html 移除
python tools/dev_panel.py --remove
```

**激活方式**: 游戏中按 F12，或在任意位置输入 `devmode`。

---

## 工具12：一键发布工具

**文件**: `tools/release.py`

**功能**: 串联所有工具，执行完整的发布流程

**发布流程（9步）**:
1. 引用检查
2. 构建 game.html
3. 语法检查（node --check）
4. 自动化节点遍历测试
5. 存档兼容性测试（快速模式跳过）
6. 生成节点索引
7. 生成节点关系图（快速模式跳过）
8. 备份当前版本到 releases/
9. 生成发布报告

**命令**:
```bash
# 完整发布流程
python tools/release.py

# 快速发布（跳过存档测试和关系图）
python tools/release.py --quick

# 指定版本号
python tools/release.py --version v30
```

**产物**:
- `game.html`（最新构建）
- `docs/NODE_INDEX.md`（节点索引）
- `docs/node_graph.html`（关系图，非快速模式）
- `docs/RELEASE_<version>.json`（发布报告）
- `releases/game_<version>_<timestamp>.html`（备份）

---

## 推荐工作流

### 日常开发
1. 用 YAML 写新剧情（工具5）
2. 编译为 JS 并加入构建链
3. 用增强构建检查语法（工具2）
4. 用引用检查发现死链（工具3）
5. 用开发者面板在游戏中测试（工具11）

### 版本发布
1. 运行一键发布（工具12）
2. 查看发布报告
3. 如有问题，用工具2定位错误源文件
4. 修复后重新发布

### 代码重构
1. 用工具6将现有 JS 转换为 YAML
2. 用工具7按主题重组目录结构
3. 用工具5编译回 JS 验证
4. 用工具8运行完整测试

---

## 常见问题

**Q: YAML 编译后的 JS 和手写的格式一样吗？**
A: 是的，编译器生成的 JS 完全符合现有格式规范，node --check 可通过。

**Q: 转换现有数据卷会丢失内容吗？**
A: 不会。JS→YAML 转换是无损的，简单文本转为纯文本，复杂逻辑保留为 text_func。往返一致性已验证。

**Q: 引用检查发现很多死链，需要全部修复吗？**
A: 不一定。有些死链是预留的扩展节点位（用户要求每个方向预留50%扩展位），有些是引擎动态生成的节点（已自动忽略）。建议优先修复核心剧情线的死链。

**Q: 开发者面板会影响普通玩家吗？**
A: 不会。面板默认隐藏，需要按 F12 或输入密码激活。发布时可以用 `--remove` 移除。

**Q: 一键发布需要多长时间？**
A: 快速模式约 1-2 秒，完整模式约 3-5 秒（取决于节点数量）。

---

## 版本信息

- 工具链版本: v29
- 生成时间: 2026-09-06
- 兼容游戏版本: v28+
- 依赖: Python 3.10+, PyYAML, Node.js（语法检查用）
