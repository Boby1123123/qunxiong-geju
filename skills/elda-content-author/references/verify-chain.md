# 验证链与发布（每次内容改动必须全跑）

## 环境注意（Windows PowerShell 5.1）
- 禁 `&&`（用 `;` 或分行）；Grep 工具会 Native execution failed → 用 `Select-String`。
- 内联 `python -X utf8 -c "..."` 带中文/正则必炸 → 一律写 .py 文件执行。
- 长命令用 `Bash(run_in_background=true)` 后台跑，再 TaskOutput 取结果。

## 完整验证链（顺序执行）
```powershell
cd D:\1pao tuan\群雄割据

# 1) 语法：26 块 src
node --check src\script_01.js   # 逐个或脚本批量

# 2) 构建权威源（src → game.html）
python -X utf8 _build_authority.py build      # 生成 game_built.html（data_nodes 自动内联，排除 dn_scaffold.js）
Copy-Item game_built.html game.html -Force    # game.html 是玩家实际运行文件

# 3) 分片重建（chunks 目录 → 分片版）
python -X utf8 tools\elda\elda.py chunks

# 4) 四路同步（game→game_check；chunked→index + 字节校验）
python -X utf8 tools\elda\elda.py sync

# 5) 预算门（超限时自动更新，带 reason）
python -X utf8 tools\elda\elda.py budget --reason "BD-5 新增内容：说明"

# 6) 发布门禁（语法26块 → 幂等verify → 四路 → full 21检查器 → 预算门）
python -X utf8 tools\elda\elda.py ci

# 7) 冒烟测试（自动建号→主线→结局）
python -X utf8 smoke_test.py
```
- `elda ci` 输出"门禁结果：全部通过（可发布）"才算过；出现 FAIL 立即停止修复，不绕行。

## 专项检查（内容批必跑）
```powershell
python -X utf8 tools\elda\elda.py content stat      # tag×卷×pace 汇总 + 薄域识别
python -X utf8 tools\elda\elda.py content dup       # 节点 id 唯一性（重复 0）
python -X utf8 tools\elda\elda.py content chain     # 死链（0 孤儿）
python -X utf8 tools\elda\elda.py content causality # 账本核销 + 设定词覆盖率
python -X utf8 tools\elda\elda.py text guard        # 治理词/引号/标点
python -X utf8 tools\elda\elda.py text freq         # 高频词定位
python -X utf8 tools\elda\elda.py text length       # 按卷字数与 pace 分布
```

## 浏览器回归（bu，桌面 1280）
用 `computer_use_tool(plane="bu")`：建号序列（填名→男→人类→中境人→自由城邦→战士→良才→狩猎→探寻真相→开始）→ 推进到新区域/新事件/新支线 → 面板/存读档/沉浸开合 → 截图留证。
- 注意：`localStorage.clear()` 后须 `location.reload()`；snapshot 的 ref 点击后会 stale，需重新 snapshot。
- file:// 打开 game.html 测单文件；http://127.0.0.1:8000（elda serve）测分片版与云存档。

## 备份规范
- 每批改动前：`backup\<批次>_<日期>\`（如 `BD5_20260909\`），把将要改的 src 文件与 game.html 快照进去。
- 临时脚本跑完归档 `backup\scripts_archive\tmp\` 或删除。

## 当前基线（改动前对照）
- 节点 3,877；事件池 95；账本 38 closed=38；elda ci 21 检查器；saveVersion=48。
- 四路字节：game=game_check=6,382,063B；chunked=index=3,732,777B（CS-3d 后）。
- 通过标准：四路一致、21 检查器全绿、smoke PASS、bu 实测无回归、节点数不降。
