# 踩坑清单（群雄割据开发 · 已实证）

> 每条都是真实踩过并验证过的坑。新会话/新 agent 接手项目先读本文件，避免重复踩坑。

## A. 环境与执行（最高频）

1. **PowerShell 5.1 不支持 `&&`** —— 串联命令用 `;` 或分多次执行。例：`cd dir ; python x.py`。
2. **Grep 工具在本机 Native execution failed** —— 改用 `Select-String -Path ... -Pattern ...` 或 Read 后人工查。
3. **Read 超长文件被截断**（如 77KB 的引擎文件、6.4MB 的 game.html）—— 用 Read 的 offset/limit 分段，或用 Select-String 定位后再 Read 局部。
4. **内联 `python -X utf8 -c "..."` 带中文/正则必炸** —— 一律写 `.py` 文件再执行，禁止 `-c` 内联长逻辑。
5. **临时脚本跑完归档** `backup\scripts_archive\tmp\`，不留在根目录。
6. **执行模式为完全访问（full_access）** —— 命令直接执行、不请求风险确认，但仍严格围绕用户明示指令，不扩展范围。

## B. 游戏构建与验证链

7. **改了 src/data 后必须跑 `elda chunks`**，否则分片版（index.html + chunks\）缺新代码——四路校验会抓出，但先跑省一轮。
8. **`elda sync` 必须在 `elda ci` 前跑**（或同批）——四路字节一致是 ci 检查项。
9. **预算超限不要硬改代码凑数** —— 用 `elda budget --reason "说明"` 更新，理由要真实。
10. **`_build_authority.py build` 输出 game_built.html**，需手动 copy 为 game.html 才成为权威发布版（ci_guard --build 已内置此步）。
11. **smoke_test.py 是独立进程，耗时长**（建号→主线→结局），耐心等完，不要中途 kill。

## C. 浏览器自动化（bu）

12. **`BU_SESSION_STALE`** → 先 `bu.resync()` 再操作，不要硬续旧 ref。
13. **Monaco 编辑框（Supabase SQL Editor 等）用 `bu.type` 长文本会丢字符** → 用 `monaco.editor.getModels()[0].setValue(repr(sql))` 一次性注入。
14. **`localStorage.clear()` 后必须 `location.reload()`**，否则游戏内状态不同步。
15. **snapshot ref 会随页面变化失效** —— 导航/弹窗/重新渲染后重新 snapshot，不要复用旧 ref。
16. **GitHub 仓库可见性/Pages 设置无 MCP 工具** → 走 bu 浏览器设置页（settings → Danger Zone / Pages），两步确认按钮（"I want to make..."→"I have read and understand..."→"Make ... public"）。
17. **GitHub Pages 首次部署要 5-15 分钟**（22MB 仓库 build 4-5min + deploy 5min）——期间 404 正常，Actions run Success 后再访问。

## D. 存档与云

18. **saveVersion=48 永不可变** —— 新功能用独立键或 applyDefaults 兜底，绝不改存档结构语义。
19. **旧档兼容是硬要求** —— 任何存档相关改动后必须实测读旧档。
20. **云配置在浏览器 localStorage（elda-cloud-config）**，换 origin（file:// vs github.io）各自独立，需要重新配置；anonKey 属 publishable，可公开，但不写进仓库代码。
21. **Supabase MCP `execute_sql` 只读**（DDL 报 25006）——建表/改表必须走 Dashboard SQL Editor（Monaco setValue 注入）。
22. **云存档实测过 file:// 直连 status=200**（真实 Supabase CORS 放行），无需 serve 即可测。

## E. Git 与发布

23. **PowerShell 把 git 提示当 stderr 显示**（exit code 1 但实际成功）——看输出是否含 `main -> main` 判断，别只看 exit code。
24. **git push 前先 `elda ci` 全绿**；push 后 GitHub Pages 自动重新部署（等几分钟）。
25. **备份命名**：`backup\<批次>_<日期>`，如 `P0-1_20260909`、`UI-1_20260909`；改动前必备份。

## F. 内容铁律（用户锁定）

26. **节点数只增不降**（基线 3,877）；文本整改不删句、不改选项语义。
27. **判定公式 / writeNext 核心语义 / choose / 存档语义 = 红线**，任何批次不得触碰。
28. **设定不得自创冲突项**：8 势力 / 五主线(purge60/silver120/seal200/academy250/orc280) / 七锚 / 铁牌 / 神谕 / 金秤 / 晨天——用 elda-story-guard 校验。
29. **不重复剧情**（用户 AGENTS.md）：新增内容前查账本与既有节点，避免同场景/同事件重复。
30. **移动端适配内容已被用户删除**，禁止再做移动端相关工作。

## CI/跨平台坑（2026-09-09 实锤）
- src/gap_00.html 承载 v35 战斗样式 + v68 UI 层（44KB/22 处 UI marker），曾被 .gitignore 排除未入库 → CI/Linux checkout 缺文件 → build 产物缺 UI → elda ci UI 检查器 FAIL。教训：构建链输入文件必须全部入库，.gitignore 只放真正的临时产物。
- 本地 ci 全绿不代表 CI 全绿：本地 --quick 检查现有 game.html，CI --build 会重建并覆盖 → 以 ci_guard.py --build 为最终口径。
- GitHub Actions：checkout@v4 等旧 action 触发 Node20 弃用警告（强制跑 Node24），升级 checkout@v5/setup-python@v6/setup-node@v5/upload-artifact@v5 消除。
- git push 在 PowerShell 下红色 stderr/exit 1 实为成功，以输出含 main -> main 判断。
- ci_guard.py 根定位优先级：ELDA_PROJECT_ROOT 环境变量 > 脚本向上 6 层探测（仓库 skills/ 布局）> 本地默认路径。
