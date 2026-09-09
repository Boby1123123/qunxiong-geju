---
name: elda-ci-guard
description: 群雄割据文字游戏的一键验证门禁与踩坑固化。当需要对《艾尔达大陆·群雄割据》（D:\1pao tuan\群雄割据）执行构建验证、全量回归、发布前检查，或任何会改动 src/data/docs 的开发任务开工/收尾时使用——也用于新会话接手项目时快速建立"怎么验证、怎么发布、别踩什么坑"的共识。触发词：跑验证链、elda ci、smoke、门禁、全绿、发布、回归、构建、备份、四路一致、node --check。
---

# elda-ci-guard：群雄割据一键门禁

把项目验证链 + 已踩坑固化为一键脚本与共识文档。**任何改动 src/data/发布文件后，收尾必须过本门禁；新会话接手先跑一遍 `--quick` 建立基线。**

## 快速开始

```bat
:: 快速门禁（改动后必跑）：node --check + elda ci + smoke + 四路字节 + git 状态
python -X utf8 <skill_dir>\scripts\ci_guard.py --quick

:: 完整构建链：build -> copy -> chunks -> sync -> ci -> smoke -> 字节校验
python -X utf8 <skill_dir>\scripts\ci_guard.py --build

:: 附加：把报告写入 docs\ci_guard_report_latest.md
python -X utf8 <skill_dir>\scripts\ci_guard.py --quick --report
```

`<skill_dir>` = `C:\Users\Administrator\AppData\Local\Doubao\User Data\Default\.doubao\agent_mode\workspace\.user_skills\elda-ci-guard`。退出码 0 = 全绿。

## 标准开发流程（每次改动）

1. **备份**：`copy 目标文件 backup\<批次>_<日期>\`（如 `P0-1_20260909`）。
2. **改动**：只动点名范围；不触碰红线（判定公式 / writeNext 核心语义 / choose / 存档语义 / saveVersion=48）。
3. **验证**：`python ci_guard.py --quick` 全绿。
4. **发布**：`git add -A && git commit -m "..." && git push`（GitHub Pages 自动部署，等 5-15 分钟）。
5. **偏差即停**：任何检查 FAIL 或与基线不符，立即停止报告，不绕行不降级。

## 必须读的参考

| 文件 | 何时读 |
|---|---|
| `references/baselines.md` | 每次开工前对照基线（节点 3877 / 事件 95 / 账本 38 / 四路字节 / saveVersion=48） |
| `references/pitfalls.md` | 动手前必读——PowerShell 5.1 禁 &&、Grep 不可用、Monaco 丢字符、Pages 部署慢等 30 条已实证坑 |
| `references/verify-chain.md` | 需要手动分步执行验证链（不跑一键脚本）时 |

## 命令对照（不想用一键脚本时）

```bat
python -X utf8 _build_authority.py build        :: 重建
copy /Y game_built.html game.html               :: 提升权威发布版
python -X utf8 tools\elda\elda.py chunks        :: 分片
python -X utf8 tools\elda\elda.py sync          :: 四路同步
python -X utf8 tools\elda\elda.py ci            :: 21 检查器门禁
python -X utf8 smoke_test.py                    :: 冒烟
```

## 红线（任何情况不触碰）

- 判定公式、`writeNext` 核心语义、`choose`、存档结构语义
- `saveVersion=48`、旧档兼容（applyDefaults 兜底链不变）
- 节点数只增不降；文本不删句、不改选项语义
- 不自创与账本冲突的设定（8 势力 / 五主线 / 七锚 / 铁牌 / 神谕 / 金秤 / 晨天）
- 移动端适配内容已删除，禁止再做

## 其他

- 项目专属内容创作规范见 `.user_skills/elda-content-author`；设定一致性见 `.user_skills/elda-story-guard`。
- 云存档/部署基线见 `references/baselines.md` §5。
