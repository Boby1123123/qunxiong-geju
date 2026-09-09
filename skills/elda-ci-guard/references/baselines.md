# 群雄割据 · 验证链与基线（elda-ci-guard 参考）

> 数据为 v91 基线实测值（2026-09-09 部署后）。改动前后以 `ci_guard.py` 实测结果为准，本文件用于「预期对照」。

## 1. 完整验证链（按顺序执行）

```bat
python -X utf8 _build_authority.py build            :: 1. 由 src 重建 game_built.html
:: 复制 game_built.html → game.html（构建产物提升为权威发布版）
python -X utf8 tools\elda\elda.py chunks            :: 2. 生成分片版 index.html + chunks\（game_chunked.html）
python -X utf8 tools\elda\elda.py sync              :: 3. 四路字节同步（game→game_check、game_chunked→index）
python -X utf8 tools\elda\elda.py ci                :: 4. 全量门禁（四路一致 + 21 检查器 + 预算门）
python -X utf8 smoke_test.py                        :: 5. 冒烟（建号→主线→结局）
```

等价一键：`python ci_guard.py --build`（含 1-5 + node --check + git 状态）。

## 2. 快速门禁（改动 src 或 data 后必跑）

```bat
python -X utf8 tools\elda\elda.py ci
python -X utf8 smoke_test.py
node --check src\script_01.js   :: 逐块；一键版：python ci_guard.py --quick
```

等价一键：`python ci_guard.py --quick`。

## 3. elda.py 命令族速查

| 命令 | 作用 | 关键注意 |
|---|---|---|
| `ci` | 21 检查器全量门禁 + 四路一致 + 预算门 | 超预算用 `elda budget --reason "..."` 更新 |
| `chunks` | 生成分片版 | **改了 src 后不跑 chunks，分片版就缺新代码** |
| `sync` | 四路字节同步 | 必须与 ci 同批跑 |
| `content event/quest/dup/chain/causality/stat` | 内容侧检查 | causality 核销账本 |
| `text freq/norm/len/names/all/guard` | 文本侧检查 | guard 为防回潮门禁 |
| `budget` | 性能预算更新 | 需人工写明原因 |
| `serve --port 8000` | 本地服务器 | 云存档 serve 模式用 |

## 4. 基线（v91，改动不得低于/偏离）

| 指标 | 基线值 |
|---|---|
| 节点总数 | 3,877（只增不降） |
| 事件池 EVENT_POOL_EXT | 95（天灾22/人祸26/奇遇30/商机17） |
| 因果账本 | 38 项，closed=38（elda content causality） |
| 冻结设定词 | 20 词覆盖率 100% |
| elda ci 检查器 | 21 项全 PASS |
| saveVersion | 48（不可变） |
| game.html / game_check.html | 字节一致（v91=6,382,063B，会随内容增长） |
| game_chunked.html / index.html | 字节一致（v91=3,732,777B） |
| src 语法 | node --check 26 块全过 |
| smoke | PASS（建号→主线→结局） |

## 5. 云端/部署基线

- Supabase 项目：`sqbdsdwaxtzavmwhxaba`；URL `https://sqbdsdwaxtzavmwhxaba.supabase.co`
- 表 `saves`(player_id, slot, data, updated_at)，RLS + policy `app_access`(ALL for public)
- 配置存浏览器 localStorage `elda-cloud-config`（{url, anonKey}），不进代码、不进仓库
- 部署：GitHub Pages `https://boby1123123.github.io/qunxiong-geju/`，git push 后自动部署
