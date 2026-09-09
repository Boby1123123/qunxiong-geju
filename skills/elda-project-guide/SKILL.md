---
name: elda-project-guide
description: 群雄割据（《艾尔达大陆·群雄割据》）项目入口技能——任何涉及该游戏的新会话/新任务第一站。当用户提及群雄割据、艾尔达大陆、qunxiong-geju、elda、游戏改造/开发/更新/发布/排障/口令时使用。提供项目全貌（规模/目录/构建链/命令速查/口令路由/红线/技能分工），让 Agent 一次读懂无需重探。
---

# Elda Project Guide（第 0 技能 · 项目入口）

## 一句话定位

`D:\1pao tuan\群雄割据` —— 单文件西幻文字 MUD《艾尔达大陆·群雄割据》的完整工程，已升级为超大型文游（3,877+ 节点 / 95 事件 / 25+ 结局 / 21 检查器 / 四路字节构建 / CI 双保险 / 云存档已上线 / GitHub Pages 公网可玩）。

## 开工必读（快速抓全貌）

1. **规模与基线**：`README.md`（v91 基线数字）；当前版本见 `version.json`（最新 v92）。
2. **架构**：`docs/权威源与构建链_v69.md` + `docs/状态Schema_v70.md` + `docs/存档层_v71.md`。
3. **世界设定**：`docs/世界设定_v64.md`（8 势力 / 七阶段战争 / 五主线事件 / 七锚 / 铁牌 / 神谕 / 金秤 / 晨天）。
4. **命令与工具链**：`tools/elda/elda.py`（`elda --help` 全命令，含 quick/full/chunks/sync/ci/build/test/release/backup/volume/content/text/schema/budget/serve）。
5. **流程与红线**：`docs/开发工作流.md` + 本技能 `references/red-lines.md`。
6. **四技能分工**：本技能（入口）→ `elda-content-author`（写）→ `elda-story-guard`（守）→ `elda-ci-guard`（验）。

## 口令路由（用户常见诉求 → 启动方式）

| 用户诉求 | 动作 |
|---|---|
| 写新节点/事件/支线/内容包 | 读 `elda-content-author`，按 schema 产出，跑 `elda test all` + ci |
| 检查设定一致性/伏笔/死链 | 读 `elda-story-guard`，跑 `elda content causality` / `chain` |
| 全量验证/发布前门禁 | 读 `elda-ci-guard`，跑 `ci_guard.py --build` |
| 改动前备份 | `elda backup --reason <批次>` |
| 发版（门禁→bump→tag） | `elda release --note "..." [--push]` |
| 回归测试（结局/事件全量） | `elda test all` |
| 体积趋势 | `elda volume` |
| 新会话恢复现场 | 读本 SKILL.md + `docs/开发工作流.md` + `docs/版本发布记录.md` |

## 关键锚点（实测行号，改动前复核）

- REGIONS 九域 = `src/script_01.js:15`；WORLD_EVENTS 五主线 = `:17`；EVENT_POOL_EXT = `:19-124`（95 事件）
- writeNext 正文渲染 = `src/script_03.js:3321`；choose 判定 = `script_02.js` 核心区（**不触碰**）
- 好感 = `S.npcRelations` / `changeRelation`（script_02c.js:425）；flag = `S.flags`；手记 = `elda-journal-v3`
- 存档键 = `elda-qunxiong-v3-save`；saveVersion=48（**不可变**）；云存档配置 = localStorage `elda-cloud-config`
- 构建链：`_build_authority.py build`（src→game_built.html，绝不覆盖 game.html）→ copy → `elda chunks` → `elda sync` → `elda ci`

## 命令速查（完整见 `references/project-map.md`）

```
elda backup --reason X    自动快照 zip 到 backup\（保留 12 份）
elda release [--note][--push]   门禁→版本 bump→ReleaseNotes→tag
elda test all|endings|events    全量回归（结局 25 / 事件 95）
elda volume              体积趋势 + 超上限 FAIL
elda ci                  发布门禁（21 检查器）
elda content new/stat/chain/causality/event/quest   内容工具
elda text guard/freq/norm/len/names/all             文本治理
```

## 环境与发布

- 本地门禁：`.githooks/pre-commit`（src/tools/发布文件变更自动快照+全量校验）
- 云端 CI：`.github/workflows/ci.yml`（push main 自动 `ci_guard --build`，红灯即不可发布）
- 仓库：`Boby1123123/qunxiong-geju`；线上：https://boby1123123.github.io/qunxiong-geju/
- 云存档：Supabase（saves 表，RLS），file:// 与 https 均可直连
