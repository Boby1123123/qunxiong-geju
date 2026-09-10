# A-N 演出层（环境音 / 氛围主题 / 专名高亮）

> 批次：A-N1~A-N3（六方向 16 批 · 演出层）｜v92 ｜git 见提交记录
> 状态：引擎完成，验证链全绿，bu 实测通过

## 一、做了什么（扩了什么）

### A-N1 场景环境音（ambScene）
- `src\script_04.js`：新增 `window.ambScene(place)`——用 Web Audio（白噪 + 滤波器 + LFO 振荡）**零外部文件**合成 7 类场景环境声：`forest 森林 / snow 雪原 / desert 沙漠 / steppe 草原 / church 教堂 / tavern 酒馆 / city 市集`。
- 改造既有 `syncAmbient`：夜间虫鸣（ambNight）保留，其后追加 `ambScene` 按当前节点 place 匹配场景；place 未命中时弱化到中性背景。
- 独立开关：`S.settings.ambience`（默认 true，applyDefaults 兜底）——关闭后不创建 AudioContext，零音频零开销。

### A-N2 氛围主题（ambCSS / applyAmbience）
- `src\script_03.js`：新增 `window.v92_ambClass()`（时间×地点 → CSS 类）与 `window.v92_applyAmbience()`（给 `#story` 容器加 `story-amb amb-<时段>` 类）。
- `window.v92_ambCSS()`：注入 `#v92-amb-css` style——按 7 类场景（森林/雪原/沙漠/草原/教堂/酒馆/市集）分别定义正文区背景底色、边框色、文本微色差，按 4 时段（morning/noon/dusk/night）调亮度。深色夜晚场景带微弱金色描边，贴合西幻基调。
- 时段来源：S 现有时间系统（`申时`→noon 等），只读不改状态。

### A-N3 专名高亮（highlightNames）
- 数据源：`LOREBOOK`（dn_lorebook.js，29 条世界书条目）的 `triggers` 词表 → 构建去重专名表 124 条（`v92_hlNames`）+ 世界书标题映射（`v92_hlDesc`，如 `金秤 → 金秤家族`）。
- 渲染层：`writePar` 内对正文 DOM 用 TreeWalker 遍历文本节点，命中专名即包 `<span class='v92-name' title='世界书标题'>`，悬浮显示世界书解释。
- 幂等：重复渲染不重复包裹；`v92_hlDisable` 可整体关闭。

### 引擎挂点（自动调用）
- `writeNext` 主分支（script_03.js:4750-4752）：`RenderBatch.flush()` 后依次 `hlInit → ambCSS → applyAmbience → ambScene`。
- **v45 分页渲染分支**（script_03.js:3232 后）：分页节点走 `v45_renderPage` 早退、不经过主分支，故在该分支 flush 后挂同样四段钩子——**这是 bu 实测发现的必修点**（见下方踩坑）。

## 二、为什么（动机）
- 西幻文字 MUD 的沉浸短板：纯文本无音画氛围，专名密集处读者需记忆。
- 与既有沉浸模式（I1-4）、天气系统（TQ-1）互补：天气句管文本层，演出层管感官层，专名高亮管认知层。

## 三、如何验证（实测数据）
1. `elda ci`：25 检查器全绿；四路字节一致 `game=game_check=8,497,645B / chunked=index=5,729,933B`；预算门 6 项 PASS。
2. `smoke_test.py`：PASS。
3. bu 桌面 1280 实测：
   - 手动调用 `v92_hlInit()` → `v92_hlNames` 124 条，`v92_hlDesc['金秤']='金秤家族'`。
   - 推进剧情 → "自由城邦"被包裹为 `span.v92-name`（title=世界书条目）。
   - 驱动 `writeNext('fc_jiaohui_entry')` → `#story.className = "story-amb amb-morning"`、`#v92-amb-css` 已注入、正文 198 字渲染正常。
   - `S.settings.ambience=true / nameHighlight=true` 兜底生效。

## 四、踩坑记录（固化进 elda-ci-guard）
1. **jsscan strip_equal 引号配对错乱**：`highlightNames` 原写法 `String(window.v92_hlDesc[nm]||"").replace(/"/g,"&quot;")` 中，`||""` 与正则 `/"/g` 相邻使 strip_equal 的字符串扫描吞掉后续代码（v92_ambCSS 定义整段被空格化）→ `c_refhealth` 报"v92_ambCSS 读×1 无写"。修复：逐行拼接 `var _hl="<span class='v92-name' title='"; _hl+=String(...||''); _hl+="'>"+nm+"</span>";`（单引号空串、无正则字面量）。
2. **v45 分页早退绕过主分支钩子**：分页节点（v45_shouldPaginate 命中）走 `v45_renderPage` 并在 writeNext 中 return，主分支 4750 的钩子不执行 → 首屏 amb 类缺失。修复：钩子复制到 v45_renderPage 的 flush 后。
3. **"占位符状态"误导**：无存档时 story 显示"【此处剧情尚未展开】"，该渲染不走 writeNext，amb 类为空属正常——验证自动钩子须驱动真实节点渲染。

## 五、涉及文件
- `src\script_03.js`：v92_ambClass / v92_applyAmbience / v92_ambCSS / v92_hlInit / v92_highlightNames；writeNext 主分支钩子；v45_renderPage 钩子。
- `src\script_04.js`：ambScene 合成环境音；syncAmbient 改造。
- 构建产物：game.html / game_built.html / game_check.html / game_chunked.html / index.html / chunks\*（四路一致）。
- 临时脚本：scripts\tmp_patch_an.py / tmp_fix_anhl.py / tmp_fix_anv45.py（归档 backup\scripts_archive\tmp\）。
