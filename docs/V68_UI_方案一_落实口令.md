# V68-UI 西幻手抄圣典界面重构 · 方案一落实口令（含世界旁白栏）

> 基于已选定"案例1·手抄圣典"定稿。两项修改已并入：①角色面板取消头像框；②新增"世界旁白栏"（世界发生的事都在上面可见）。
> 世界观校准：西方奇幻（骑士/牧师/魔法师/精灵/矮人/霜巨人/龙），严禁国风水墨。

## 一、开发范围（全部执行）

在 v67 基础上（17 检查器全绿 / 四路一致），把主界面重构为"西幻手抄圣典"视觉体系，分六方向：

- 方向一：界面框架 V68_UI——哥特圣典布局 + 三层设计令牌（西幻色板）+ 羊皮纸/烫金/哥特边框材质
- 方向二：顶部双排导航——第一排世界信息（游戏名/历法/地点/时间/天气/战事），第二排 10 功能键（两组）
- 方向三：角色面板改造——**取消头像框**，名字+称号排版，状态条+六维+按钮
- 方向四：**世界旁白栏（新增）**——顶部导航下方横贯一条，轮播世界动态（战争/天灾/政治/经济/编年史），点击展开完整列表
- 方向五：底部选项条——Questas 卡片化 + 图标前缀 + 代价标注 + 状态行（金币/行动点/日期，**行动点全界面仅此一处**）
- 方向六：旧元素清理——右下角 top-bar-extra 整组删除、V35 控制台生产隐藏、旧地图双入口收敛、panel-wrap 空壳修复

## 二、核心规则（铁律，延续 v60-v67）

1. 红线：判定公式（writeNext/choose/advanceTime/tierOf/rollD100/applyEffects）、剧情节点 N[id] 正文、存档/读档/删档/新游戏/覆盖存档语义、8 处原生 confirm 调用点一律不动；不得不修改 → 停下请示
2. 权威源 game.html；开工先备份 backup\game_v68_before.html（字节校验一致）
3. 注入一律精确 str.replace 锚点 + 幂等 marker（/v68ui:frame/ /v68ui:nav/ /v68ui:panel/ /v68ui:announce/ /v68ui:options/ /v68ui:cleanup/）；绝不对全文跑宽松正则；重复跑前先 Grep marker 计数
4. 新增全局对象一律 IIFE + try/catch + DOM 判空；S 不新增顶层字段（如确需存 UI 偏好走 v68_ensureDefaults 兜底，链入 v67_ensureDefaults）；S.saveVersion 保持 48
5. file:// 双击可用（禁 CDN/外部库，全部内联；背景材质图内联 base64 或纯 CSS 回退）
6. 文本一律中文引号；文风 doubao-human-signal（物件即记忆、对白半句留白、克制收尾）
7. 世界旁白栏**只读聚合**：S.worldState.activeSituations / S.worldState.wars / v47 chronicle 最近条目 / S.missedEvents 未读——只展示不写入不判定，不参与任何结算
8. 构建验证全绿：elda full（新增 c_v68ui 检查器）+ 死链 0 + 占位 1（允许）+ 分片 0 缺失
9. 完成后四路同步 game.html / game_check.html / game_chunked.html / index.html（字节一致）
10. 每个方向预留 ≥50% 扩展位注释（旁白来源位/导航键位/面板按钮位/选项类型位）

## 三、前置探查（只读，_v68ui_scan.py，输出 docs\v68ui_前置确认表.md）

1. **主题令牌**：:root 现有 46 CSS 变量清单（--bg-main/--text/--gold/--border/--danger 等）——新西幻令牌挂接方式；V67 semantic 层变量现状
2. **顶部栏**：现有顶部导航 DOM 结构（id/class）、旧 13 键清单、右下角 #top-bar-extra 8 键清单（删除目标）、V35 控制台容器 id 与开关方式
3. **右侧面板**：现有角色面板渲染函数（renderRealm/renderChar 等）与 DOM 结构——头像框精确锚点（取消目标）、状态条/六维渲染位置
4. **旁白数据源**：S.worldState.activeSituations / wars / S.missedEvents / v47 chronicleRecord 的实际字段名与调用方式（v64 已落地，现场核对）；broadcast 输出端函数名
5. **选项渲染**：showOptions 现有结构、选项卡片容器、v67 选项锁（__v67Busy）挂点——选项条改造对齐
6. **地图入口**：v67_map 现状、旧地图 v34_openMap 调用点清单（收敛目标）
7. 输出确认表：每项 现象/锚点行号/处置方案（改/删/留）

## 四、方向一：界面框架 V68_UI（P0，marker /v68ui:frame/）

### 4.1 V68_UI 全局对象（IIFE，window.V68_UI）

```js
V68_UI = {
  shell:null, topbar:null, navGroup1:null, navGroup2:null,
  announce:null, announcePanel:null, story:null, sidePanel:null, optionBar:null,
  version:'v68.1', init(), buildShell(), applyTheme(), ...
}
```

### 4.2 西幻三层设计令牌（挂 :root，替代/并置现有变量，不删旧的）

- primitive：--c-parch-50 #f0e2c4 / --c-parch-100 #e6d3a8 / --c-ink-900 #2e1f12 / --c-ink-700 #4a3420 / --c-gold-600 #a67c2e / --c-gold-400 #d4a94f / --c-holy-500 #8a6d3b（圣棕）/ --c-blood-600 #7a2e22 / --c-moss-500 #5a6b3a / --c-night-900 #1a1410
- semantic：--bg-page（parch-100 径向渐变）/ --bg-panel（parch-50，rgba 0.94）/ --bg-input / --border（ink-700 1px）/ --text（ink-900）/ --text-secondary（ink-700）/ --text-gold（gold-600）/ --danger（blood-600）/ --success（moss-500）——正文对比度 ≥4.5:1（#2e1f12 on #e6d3a8 已达标）
- component：.v68-panel / .v68-btn / .v68-card / .v68-opt / .v68-opt-chosen / .v68-announce——只引用 semantic

### 4.3 哥特圣典材质

- 页面背景：羊皮纸质感（CSS：parch-100 底 + 多层 radial-gradient 噪点 + 边缘 vignette；**可选**用 Seedream 5.0 Pro 生成"泛黄羊皮纸纹理，无文字"背景图内联 base64，CSS background 引用，生成失败走纯 CSS 回退）
- 四角圣徽：哥特边框（CSS：双线边框 + 四角 :before/:after 十字圣徽/盾徽字符 ▚◈⚜ 或 5.0 Pro 生成四角纹章 PNG 内联）；边框线 gold-600 1px + ink-700 外线 2px，圆角 4px
- 标题字体：哥特感（file:// 禁 CDN → font-family:"Georgia","Times New Roman",serif + letter-spacing:2px + 字重 700 + text-shadow 1px 1px 0 rgba(0,0,0,.25) 模拟烫金浮雕；中文标题用宋体粗体 + 同 letter-spacing）
- 面板统一 .v68-panel：parch-50 底 rgba .94、边框 1px var(--border)、圆角 4px、阴影 0 2px 8px rgba(46,31,18,.25)

### 4.4 布局结构（967×883 桌面基准）

```
┌───────────────────────────────────────────────────────────────┐
│ 第一排 36px：⚔群雄割据(烫金)  艾尔达大陆·圣历4037年 ｜ 北境·铁门关 · 圣历4037年·寒月·三日 · ❄风雪 · ⚔战事：北境-东境对峙 │
│ 第二排 34px：🗺地图 🎒行囊 ⚡修炼 📜日志 ⚜势力 ✉任务 ⚔强者 📖编年史 ⚙设置 💾存档（10键两组） │
│ 🌍世界旁白栏 34px：〔最新纪闻〕轮播：…… ⚔北境与东境在铁门关外对峙，粮道已断。  [展开] │
├───────────────────────────────────────────────┬──────────────┤
│                                               │ 角色面板 210px │
│  正文区（≥70%）                                │ 名字·称号      │
│  环境提示行 → 标题 → 密集正文 → 事件日志流      │ 职业·种族      │
│                                               │ 生命/心神/圣力/负重│
│                                               │ 六维两列       │
│                                               │ 角色卡/图鉴/传承│
├───────────────────────────────────────────────┴──────────────┤
│ 选项条 96px：⚔披甲上城垛  🔥城门洞烤火  🔍巡夜路（卡片+代价）     │
│ 状态行 22px：🪙85金龙 ⚡行动3/4 圣历4037年·寒月·三日（行动点仅此一处） │
└───────────────────────────────────────────────────────────────┘
```

- 正文区：#story 最大宽 760px，行高 1.8，字号 16.5px；标题 22px gold 粗体
- 容器全部 v68-panel；正文始终可读，面板半透明覆盖不替换

## 五、方向二：顶部双排导航（P0，marker /v68ui:nav/）

### 5.1 第一排（世界信息条）

- 左：游戏名「群雄割据」烫金哥特体 16px + 副题「艾尔达大陆」12px secondary
- 中（可点击展开今日概况）：`地点 · 历法时间 · 天气 · 战事状态`，14px secondary；战事状态红点提示（读 S.worldState.wars）
- 右：设置/存档小键位（若第二排放不下）

### 5.2 第二排（10 功能键，两组）

- 组1 核心：🗺地图 🎒行囊 ⚡修炼 📜日志
- 组2 系统：⚜势力 ✉任务 ⚔强者 📖编年史 ⚙设置 💾存档
- 每键 30×30 圆角小按钮（parch-50 底、ink 描边、hover 金边、active 按压），图标字符 + title 提示
- 快捷键：M/B/T/L/F/Q/G/C/Esc/Ctrl+S（document keydown 统一注册）
- 点击走 v67_ui.open 对应面板（地图=v67_map.open / 行囊=renderPack / 修炼=renderRealm / 日志=renderLog / 势力=势力总览 / 任务=任务面板 / 强者=强者名册 / 编年史=史书面板 / 设置=设置面板 / 存档=存档面板）

### 5.3 清理

- 删除 #top-bar-extra（右下角 8 键）整组 DOM + 相关 JS 引用
- 旧顶部 13 键收编：行动→正文区"⚡行动"按钮；图鉴/成就/魔法→日志下拉；AI润色/潜行→设置

## 六、方向三：角色面板改造（P0，marker /v68ui:panel/）

### 6.1 取消头像框（精确锚点）

- 删除角色面板顶部圆形肖像框元素（探查确认 id/class 后整块移除）
- 替代排版：第一行名字「赛琳·灰羽」16px gold 粗体；第二行「职业：游侠 · 种族：精灵」12px secondary；第三行「称号：北境巡夜人」12px gold（勋章字符 ⚜ 前置，代替头像位置传达身份）
- 若现有渲染函数硬编码头像 DOM，在该函数内精确替换该段（不动其余逻辑）

### 6.2 面板内容（自上而下，v68-panel）

1. 身份区：名字/职业·种族/称号（如上）
2. 状态条 4 条（宽 180px，条带+数值）：红「生命 122/122」蓝「心神 38/38」金「圣力 0/100」绿「负重 12/40」
3. 六维两列小字：力量7 敏捷14 智力9 魅力11 体质8 感知16
4. 按钮行：`角色卡` `图鉴` `传承`（v68-btn 基类，30×22）
5. 扩展位注释：伙伴位/装备位/天赋位

## 七、方向四：世界旁白栏（P0 新增，marker /v68ui:announce/）

### 7.1 位置与形态

- DOM：#v68-announce（顶部第二排导航正下方，横贯全宽，高 34px，v68-panel 底）
- 结构：`🌍` 图标 + 「世界纪闻」标签 + 滚动文本区（最新 1 条常驻）+ `[展开]` 按钮
- 轮播：多条时每 12s 切下一条（setInterval，游戏运行期间持续；暂停条件：弹窗打开时暂停轮播）

### 7.2 数据源与生成 V68_UI.announce()

- 只读聚合以下来源（现场核对字段名，均不写入不判定）：
  1. S.worldState.wars：进行中战争 → `⚔ {a}与{b}在{前线}交战（{阶段}）`
  2. S.worldState.activeSituations：活跃局势 → `◆ {kind}：{a}-{b}（{stage}）`
  3. S.worldState.regions 天灾态 → `🌪 {region}遭{灾种}`
  4. v47 chronicle 最近 3 条 → `📜 {摘要}`
  5. S.missedEvents 未读 → `📣 {事件摘要}`
- 输出：S.worldState 无以上数据时 → 空态文案「世界暂无大事。太安静了，安静得让人不安。」
- 最新纪闻写入 #v68-announce 文本区；历史存 V68_UI.announceHistory（内存数组，不写 S，cap 20）

### 7.3 展开面板 #v68-announce-panel

- 全屏半透明覆盖（v67_ui.open 复用）：标题「世界纪闻」+ ✕
- 列表：最近 20 条，每条 `〔历法时间〕 来源标记 + 摘要`，来源标记色：⚔战争血 / 🌪天灾土 / ⚜政治金 / 💱经济绿 / 📜编年史墨
- 空列表：显示空态文案
- 关闭：✕ / Esc / 遮罩 / 返回游戏（v67_ui.close 统一出口）

### 7.4 触发时机

- advanceTime 结算后调 V68_UI.announce() 刷新（挂 v47 worldTick 输出端/既有世界结算钩子，只读）
- 玩家手动点「展开」随时可看
- 轮播 setInterval 在 v67_ui 弹窗打开时 pause、关闭后 resume

## 八、方向五：底部选项条（P0，marker /v68ui:options/）

### 8.1 选项卡片化（改造 showOptions 渲染层，不动判定与 choose）

- 每选项一张 .v68-opt 卡：图标前缀（◆推进/ℹ情报/💰代价/❤关系/⭐表达/🔓解锁/⚡行动）+ 文字 14.5px + 右下角代价小字（"耗时1时辰""夜路凶险"）；卡片 高 44px、圆角 4px、parch-50 底 ink 描边
- 锁定态：灰化 opacity .45 + disabled + title 原因 + 点击 flashMsg 提示（沿用 v67 选项锁 __v67Busy 与灰化逻辑）
- 选中态：.v68-opt-chosen 金边高亮 800ms + 其余淡出（v67_uiFeedback 升级样式）
- 排列：2-4 张横排，>4 第二行；无选项时「▸继续阅读…」（v45-cg 保留）

### 8.2 状态行（底部栏最下一行，22px）

- `🪙85金龙 ⚡行动3/4 圣历4037年·寒月·三日`
- **行动点全界面仅此一处**（排查删除其他位置的行动点显示，避免重复；角色面板不再显示行动点）

### 8.3 扩展位：快捷键数字 1-9 选选项 / hover 预览后果（注释位）

## 九、方向六：旧元素清理（P0，marker /v68ui:cleanup/）

1. #top-bar-extra 整组删除（DOM+引用）
2. V35 开发者控制台生产隐藏：window.v67Debug 默认 false，仅 ?debug=1 开启（沿用 V68 方案）
3. 地图双入口收敛：仅顶部「🗺地图」+ M 键；v34_openMap 调用点全部改 v67_map.open（函数保留转发）
4. panel-wrap 空壳修复：背包/角色/修行/日志打开即渲染内容（renderPack/renderRealm 等对接 v67_ui.open）
5. 全库按钮核查：面板关闭按钮统一真 `<button>` + onclick=v67_ui.close()

## 十、工程要求

### 10.1 文件清单

1. backup\game_v68_before.html（备份，字节校验）
2. game.html：V68_UI IIFE + 西幻令牌 + 双排导航 + 角色面板改造 + 世界旁白栏 + 选项条 + 清理
3. 注入脚本（幂等 marker）：_v68ui_frame.py / _v68ui_nav.py / _v68ui_panel.py / _v68ui_announce.py / _v68ui_options.py / _v68ui_cleanup.py / _v68ui_scan.py（只读探查）
4. tools\eldacheck\checks\c_v68ui.py + eldacheck.py 注册（17→18 检查器）
5. _v65_sim.js 扩展断言（v68ui 组）
6. docs：v68ui_前置确认表.md / V68UI_令牌与对比度表.md / QA_v68ui_检验报告.md；README_构建验证.md 更新

### 10.2 构建验证（全量，顺序执行）

1. 备份 → 2. 前置探查（确认表）→ 3. 方向一框架（令牌/材质/布局）→ 4. 方向二导航 → 5. 方向三角色面板（去头像）→ 6. 方向四旁白栏 → 7. 方向五选项条 → 8. 方向六清理 → 9. node --check → 10. elda full（18 检查器全绿）→ 11. 死链 0 + 占位 1 → 12. node _v65_sim.js（含 v68ui 断言）→ 13. 分片重建 0 缺失 → 14. elda sync 四路字节一致 → 15. 浏览器回归 → 16. QA_v68ui 报告

### 10.3 仿真断言扩展（_v65_sim.js 追加，≥10 项）

- announceGen：构造 wars+activeSituations+chronicle → announce() 返回 ≥3 条纪闻且文本非空
- announceEmpty：空世界态 → 返回空态文案
- announceRotate：多条轮播切换不崩（调 3 次指针正确）
- announceOnlyRead：调用后 S.worldState 各字段原样（无写入）
- noAvatar：面板 DOM 无头像元素（探针）
- actionPointUnique：全文档"行动点"出现次数 = 1（状态行）
- navKeys：10 键 DOM 存在且各自绑定 onclick
- topbarExtraGone：#top-bar-extra 不存在
- devConsoleHidden：window.v67Debug=false 时控制台容器隐藏
- optionCard：showOptions 渲染出 .v68-opt 卡片（构造节点）

### 10.4 浏览器回归清单

- 打开游戏：西幻手抄圣典界面（羊皮纸/哥特边框/烫金标题），无右下角旧键、无 V35 控制台
- 世界旁白栏：推进 7 天×4 周 → 至少 1 条纪闻出现；点[展开]→列表可见；空档期显示空态
- 角色面板：无头像框，名字/称号/状态条/六维/按钮齐全
- 10 键导航逐一可开可关、Esc 可关；快捷键 M/B/T/L/F/Q/G 生效
- 选项卡片：连点仅一次生效；锁定灰化+原因；行动点仅状态行一处
- 旧档兼容：预置 v67 存档读档零报错；V35 抽查 typeof choose/writeNext/V68_UI/v67_ui 正常
- console 0 新错误，无软锁

### 10.5 存档兼容（硬约束）

- 主键不变；S.saveVersion=48；本工程不新增 S 顶层字段；旁白历史存内存 V68_UI.announceHistory（不写档）；存档体积增量 0

## 十一、开发顺序

1. 备份 + 前置探查 → 2. 框架（令牌/材质/布局）→ 3. 双排导航 + 清理旧导航 → 4. 角色面板去头像 → 5. 世界旁白栏 → 6. 选项条 + 状态行 → 7. c_v68ui 检查器 + 断言 → 8. elda full + 分片 + 四路同步 → 9. 浏览器回归 + QA

## 十二、核心原则

- 故事是唯一主角：正文 ≥70%，一切面板覆盖不替换、可折叠、可关闭
- 世界要能被看见：旁白栏把"世界在动"摆到玩家眼前——战争、天灾、政治、传闻，一眼即知
- 身份不靠头像：取消头像后，名字、称号、职业、种族就是你的脸
- 一套导航、一把出口：10 键收尽所有功能，✕/Esc/遮罩/返回全走 v67_ui.close
- 行动点只此一处：不再重复，不再混淆
- 西幻到底：羊皮纸、哥特体、圣徽、烫金，不做任何国风元素
- 全链路闭环：18 检查器 + 仿真断言 + 四路一致，全绿才交付
