# 艾尔达大陆：群雄割据 - 架构文档 v38

## 一、项目概述

单文件HTML文字MUD游戏，基于原生JavaScript实现，无外部依赖。

- **主交付物**: `game.html`（约3MB，5个script）
- **构建系统**: `build_elda.py`（从数据卷组装）
- **校验系统**: `static_check_elda.py`（静态检查）
- **存档键**: `elda-qunxiong-v3`（localStorage）

## 二、架构层次

### 2.1 数据层（N对象）
- 所有游戏节点存储在全局对象 `N` 中
- 节点格式: `N["node_id"] = function() { return { place, text, options } }`
- v38节点总数: **2343个**
- 节点分类: 序章/学院/大陆/战斗/系统/UI等

### 2.2 状态层（S对象）
- 所有游戏状态存储在全局对象 `S` 中
- 主要字段:
  - `S.player`: 玩家信息（姓名/种族/出身/职业/属性/境界）
  - `S.time`: 时间系统（年/月/日/时段/季节/天气）
  - `S.inventory`: 背包系统（物品/金币/装备）
  - `S.relations`: 关系系统（NPC/势力/声望）
  - `S.quests`: 任务系统（进行中/已完成/失败）
  - `S.flags`: 全局标记
  - `S.foreshadowing`: 伏笔状态
  - `S.academy`: 学院系统（年级/课程/成绩/室友/社团）
  - `S.world`: 世界系统（计时器/事件/并行事件/城市状态）

### 2.3 引擎层
- `engine_elda.py`: 核心引擎（节点渲染/选项处理/存档/读档）
- `mech_elda.py`: 机制系统（修炼/战斗/经济/旅行）
- 主要函数:
  - `writeNext()`: 渲染当前节点
  - `choose(opt)`: 处理选项选择
  - `go(nodeId)`: 跳转到指定节点
  - `saveGame()`/`loadGame()`: 存档/读档

### 2.4 ELDA框架层（v38新增）
- `ELDA` 全局命名空间，封装所有框架功能
- `ELDA.utils`: 工具函数
  - `getNodes()`: 获取节点对象
  - `nodeExists(nodeId)`: 检查节点是否存在
  - `safeGo(nodeId)`: 安全跳转（死链自动跳转到安全节点）
  - `debounce(fn, delay)`: 防抖
  - `throttle(fn, limit)`: 节流
  - `deepClone(obj)`: 深拷贝
- `ELDA.events`: 事件总线
  - `on(eventName, callback)`: 监听事件
  - `off(eventName, callback)`: 取消监听
  - `emit(eventName, data)`: 触发事件
- `ELDA.ui`: UI工具
  - `toggleDebugPanel()`: 切换调试面板（按F12）
  - `updateDebugPanel()`: 更新调试面板内容
- `ELDA.errors`: 错误记录数组
- `ELDA.performance`: 性能监控

## 三、Script结构

game.html包含5个script标签：

| Script | 大小 | 内容 |
|--------|------|------|
| 0 | ~50KB | v35架构 + v38框架初始化 |
| 1 | ~110KB | 引擎核心函数 |
| 2 | ~2.3MB | 主体剧情节点（序章/学院/大陆） |
| 3 | ~73KB | 机制系统 |
| 4 | ~200KB | v35战斗/魔法/势力 + v36/v37新增内容 |

## 四、数据卷结构

构建系统从以下Python数据卷组装game.html：

- `story_elda_a.py` ~ `story_elda_bk.py`: v1-v28剧情数据卷（共64个）
- `engine_elda.py`: 引擎卷
- `mech_elda.py`: 机制卷

**注意**: v30-v38的UI和系统修改是直接修改game.html，没有通过build_elda.py重新构建（因为build会从数据卷覆盖修改）。

## 五、时间系统（v26）

- 每天4时段: 清晨(06-12)/正午(12-18)/黄昏(18-24)/深夜(00-06)
- 每时段可做1个大行动 + 任意个小行动
- 所有消耗时间的选项加 `timeCost` 字段
- 时段过渡有叙事化开场/收尾描写

## 六、多学院体系（v28）

- 人类三大顶尖学院: 艾尔达大陆学院/圣光神学院/帝国军事学院
- 种族顶尖学院: 银叶学院(精灵)/铁峰锻造学院(矮人)/战神学院(兽人)/绿野学院(半身人)
- 普通学院8所 + 乡村学院体系
- 玩家可选择报考不同学院，每所学院有完全不同的课程/教授/同学/秘密

## 七、UI系统（v30-v34）

- 配色: 方案D微暗羊皮纸渐变（#e0d4b8→#d4c8a8）
- 字体: 正文Noto Sans SC font-weight:500/700/900，标题Noto Serif SC font-weight:900
- 故事文本: 17px，行高2.0
- 选项: 16px，font-weight:700
- 所有面板有明确的关闭方式（✕按钮+底部返回按钮+ESC键）

## 八、调试工具

### 8.1 调试面板
- 按 **F12** 开启/关闭
- 显示: 节点总数/当前节点/错误数/最近错误

### 8.2 命令行工具
- `python tools/dead_link_check.py`: 死链检测
- `python tools/find_node.py <关键词>`: 节点搜索
- `python tools/ui_check.py`: UI专项检查
- `python tools/elda.py <命令>`: 统一CLI入口（14个子命令）

## 九、存档兼容

- 所有新字段有默认值
- 旧存档不报错（检测到无对应字段时自动初始化）
- localStorage键保持 `elda-qunxiong-v3` 不变
- 回滚方案: `backup/game_v37_backup.html`（v38重构前完整备份）

## 十、版本历史

| 版本 | 主要内容 | 节点数 |
|------|----------|--------|
| v1-v20 | 基础系统 | ~1000 |
| v21 | 日历节日/修炼/经济/声望 | ~1100 |
| v22 | 慢旅行/感官沉浸 | ~1200 |
| v23 | 十大贯穿框架/深渊倒计时/大陆编年史/因果之网 | 1385 |
| v24 | 气候天灾/语言文字 | ~1450 |
| v25 | 随机化叙事架构/世界时钟/动态世界 | 1488 |
| v26 | 实时时间系统 | ~1550 |
| v27 | 序章全量深度开发（9条出身线） | 1599 |
| v28 | 多学院体系（16+所学院） | ~1700 |
| v29 | 工具链统一 | ~1720 |
| v30-v34 | UI美化与配色字体系统重构 | ~1800 |
| v35 | 核心系统革命（V35_ModuleManager模块化6模块） | ~1850 |
| v36 | 系统深度集成 | 1878 |
| v37 | 第一批连续叙事工程 | 2075 |
| v38 | 框架重构与死链清理 | **2343** |
