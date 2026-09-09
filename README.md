# 艾尔达大陆 · 群雄割据

单文件西幻文字 MUD（Text MUD）。群雄割据之世，你从灰港渡船走下来，选择种族与出身，在 8 大势力、九域地图与五条主线交织的世界里生存、成长、抉择。

**线上游玩：https://boby1123123.github.io/qunxiong-geju/**

## 规模（v91 基线）

- 3,877 个剧情节点 / 30+ 结局 / 事件池 95（天灾·奇遇·商机·人祸）
- 9 条好感支线闭环 / 多周目继承 / 因果账本 38 项（closed=38）
- 记忆注入（地点·时间·好感·flag 四类回指）/ 状态感知文本变体 / 段落分段阅读 / 章节标题卡 / 冒险手记
- 沉浸模式 / 存档多槽位 / 云存档三副本（本地 LS + IndexedDB + Supabase）

## 技术架构

- 单一 HTML 权威源（game.html，可由 src 重建）+ 分片加载版（index.html + chunks/）
- `src/` 26 块模块化源（script_01~12 + data_nodes）→ 构建链生成发布文件
- 工具链 `tools/elda/elda.py`：`build / chunks / sync / ci / content / text / budget / serve`
- 工程门禁：elda ci 21 检查器（语法·死链·去重·因果账本·节奏字数·文本治理·性能预算）一条命令全绿

## 构建与开发

```bat
python -X utf8 _build_authority.py build   :: 由 src 重建 game_built.html
:: 复制 game_built.html → game.html
python -X utf8 tools\elda\elda.py chunks   :: 生成分片版 index.html + chunks/
python -X utf8 tools\elda\elda.py sync     :: 四路字节同步
python -X utf8 tools\elda\elda.py ci       :: 全量回归门禁
python -X utf8 smoke_test.py               :: 冒烟（建号→主线→结局）
```

## 内容开发

- 节点 Schema / 事件注入 / 文风词表 / 账本核销规则见 `skills/elda-content-author`
- 世界设定圣经（8 势力·五主线·设定词冻结）见 `skills/elda-story-guard`
- 验证链一键门禁 + 踩坑清单见 `skills/elda-ci-guard`（`python skills/elda-ci-guard/scripts/ci_guard.py --quick`）
- 四个技能随仓库版本化（skills/: elda-project-guide 项目入口 / content-author 内容创作 / story-guard 设定守护 / ci-guard 一键门禁），新环境/新会话可直接使用；完整文档族在 `docs/`（世界设定_v64 · 状态Schema_v70 · 存档层_v71 · CM 因果账本 · I1 叙事沉浸等）

## 存档

- 存档键 `elda-qunxiong-v3-save`，saveVersion=48，旧档向前兼容
- 云存档：设置 → 云存档 → 配置云端（粘贴 Supabase URL + anonKey），三副本 + 时间戳冲突裁决

- 工程链 E6（v92+）：elda restore 快照恢复 / elda test branches 支线闭环 / CI 自动生成发布页（docs/release.html）
