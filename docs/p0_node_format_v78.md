# P0-2 节点格式统一 · 实施记录（v78）

> 批次：P0+P1 深度实施 · 批 P0-2（节点格式统一）
> 日期：2026-09-09 ｜ 基线：v77（P0-1 引擎模块化后）
> 口令：`【口令 · 群雄割据 P0+P1 深度实施】` 批 P0-2（用户确认「确定 继续进批P0-2」）
> 红线：不触碰判定公式 / writeNext 核心语义 / choose / 存档语义；saveVersion=48 不变；旧档兼容；偏差即停不绕行不降级

---

## 一、目标

将 src 中「纯数据函数式节点」（`N["id"]=function(){return {...}}` 且函数体只返回对象字面量、无函数字段、无运行时表达式）迁移为**纯数据对象式**（`N["id"]={...}`），与既有 146 个对象式节点同构；`writeNext` 的 `typeof` 双兼容兜底**不做语义改动**。迁移后验证「新增 1 节点只加数据不改引擎」。

## 二、探查（_p02_probe.py）

扫描 26 个 src JS 块（script_00~18 + 02a~02g），正则 `N\["id"\]\s*=\s*(function|\{)`：

| 类别 | 数量 | 说明 |
|---|---|---|
| 函数式节点 | **1759** | `N["id"]=function(){...}`（口令预期 1385 已过时——P0-1 拆分后统计口径更新） |
| 对象式节点 | **146** | `N["id"]={...}`（既有，含分片内） |
| 含运行时表达式 | 296 | S.xxx×258、window.×56、Math.×28、.length×31、Date.now×1 |

结果：`_p02_probe_result.json`。

## 三、迁移决策与执行（_p02_convert.py，v2 严格判定）

**v1 宽松版误转 186 个后诊断**（发现 board_north 函数体含 `const picks=shuffle(...)`、combat_bandit_road options 含 `run:function(){ startCombat(...) }` 等局部变量/函数字段），**恢复备份重写 v2 严格判定**：

> 仅当满足**全部**条件才转换：
> 1. 函数体为纯 `return {对象字面量}`（无前置语句）
> 2. 对象字面量内**无** `function` / 箭头函数 / 对象方法简写（`run(){`）
> 3. 对象字面量内**无**运行时表达式（`S.`/`window.`/`Math.`/`.length`/`Date.`）

**转换结果（v2 终版）**：

| 文件 | 转换数 | 保留函数式 | 说明 |
|---|---|---|---|
| script_02.js | 38 | — | 281322→280448 字符 |
| script_02a.js | 57 | — | |
| script_02b.js | 87 | — | |
| script_03.js | 4 | — | |
| **合计** | **186** | **1573** | 误差 0；22 文件未变 |

- 转换后：对象式节点 **332**（186+146）、函数式保留 **1573**（writeNext 双兼容兜底）
- 保留原因分布：非纯 return **1161** / 含函数字段 **406** / 运行时表达式 **1**（有参 `function(id){...}` 额外 5 个计入非纯 return）
- 代表性转换：`combat_bandit_talk_ok`（script_02.js，现为对象式 `N["combat_bandit_talk_ok"]={place:"灰港 · 北郊山道"...}`）
- 代表性保留：`pro_arrive`（函数式，函数体内含返回值依赖运行时上下文）、`board_north`（含局部变量）、`realm_4`、`arrive_elf_wangting`
- **writeNext 双兼容原文确认**（src/script_03.js @189698）：`const node = (typeof N[curNode]==="function") ? N[curNode]() : N[curNode]`，place/where/text 字段级亦兼容——**双兼容兜底即函数式节点保留的合法性依据**，未改动

## 四、回归发现并修复：v68 遗留严重 bug（#stats 缺失 → 正文不渲染）

**现象**：分片版/单文件版「开始旅程」建号后，writeNext 抛 `TypeError: Cannot set properties of null (setting 'innerHTML')`，正文不渲染，console 0 错误（错误被浏览器吞）。游戏在 v68 UI 改版后**实际无法正常开局**。

**根因链**（逐层定位）：
1. `writeNext` 首行调用 `renderStats()`（src/script_03.js @11584）
2. 原始 `renderStats` 末尾无条件 `$("stats").innerHTML = h`
3. **v68 UI 改版将状态行重构为 topbar `tb-date/tb-place/tb-gold/tb-day/tb-weather`**（src/gap_00.html body 骨架），**移除了 `#stats` 容器**（`id="stats"` 在 src 全部 HTML 出现 0 次）
4. `$("stats")` 返回 null → renderStats 抛错 → **writeNext 中断 → 正文不渲染**

**定性**：既有回归（P0-1/P0-2 之前的 v68 改版引入），非 P0-2 引入。P0-1 回归只测到建号界面与面板，未覆盖「建号后正文渲染」路径（测试缺口）。

**修复（最小侵入，守红线）**：`src/script_03.js` 原始 renderStats 函数开头加 null 防御：

```js
function renderStats(){
  /* /p02fix:stats-null/ v68 UI 改版移除 #stats 容器后，写 $("stats") 会抛 null 并中断 writeNext（正文不渲染）。
     最小侵入修复：容器缺失时直接返回（状态显示由 v68 topbar tb-xxx 承担），不改变判定公式/writeNext/存档语义。 */
  if(!document.getElementById("stats")) return;
  ...
}
```

- **不碰** writeNext 核心语义（writeNext 照常调用 renderStats，renderStats 不再抛错）
- **不碰**判定公式 / choose / 存档语义 / saveVersion
- 状态显示由 v68 topbar（tb-xxx）承担，视觉无回归

## 五、验证链结果（全绿）

### 1. 静态/构建链
```
build OK: 19 script 块 -> game_built.html
elda chunks:
  go引用总数: 10828 死链: 0
  合并节点总数: 3711 / 单文件版: 3711 / 缺失 0 / 多余 0
  game_chunked.html <script 21 标签
  分片语法检查: 42 个 JS 全部 node --check PASS
elda sync 四路一致: game=5977228 game_check=5977228 / chunked=3386790 index=3386790
```

### 2. elda ci 门禁（全绿）
```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致
[PASS] elda full 18 检查器（8.7s）
[PASS] 性能预算门 6 项：
  game=5977228B ≤ 6000000 且 ≤ baseline 5981141
  chunked=3386790B ≤ 3500000
  节点=3711 ≥ 2618（内容零损失红线）
  死链=0 ≤ 0
  总耗时=5.5s 合格
```

### 3. 浏览器回归（bu 平面，file://）
| 项 | 结果 |
|---|---|
| 分片版建号（男→北境→自由城邦→战士→良才→阅读→富甲天下→开始旅程） | curNode=origin_free_city_1，正文渲染 storyLen=130 ✅ |
| 转换节点消费（quest_bandit_letter，分片懒加载） | 渲染成功（信纸内容），options 1 ✅ |
| 面板（行囊 modal） | 打开正常（金币125/贵重0/道具0/材料0/典籍0/游历足迹）✅ |
| 单文件版 | N=1919、combat_bandit_talk_ok 等 4 转换节点=object、面板按钮存在 ✅ |
| 旧档兼容（读档→确定） | S 完整加载（applyDefaults 兜底链），curNode=fc_jiaohui_entry，writeNext 后正文渲染 235 字 ✅ |
| console 错误 | 0（分片版/单文件版/读档后）✅ |

### 4. 「新增 1 节点只加数据」演示（_p02_demo5.py）
```
加节点后 full 节点数: 3712 (期望 3712)
移除后 full 节点数: 3711 (期望 3711)
差异: 1 → PASS：新增 1 节点 = 只加数据不改引擎
```

### 5. 视口验证缺口（如实记录）
- **1280**：完整实测通过（上表）
- **768/375**：**环境限制无法实测**——bu 浏览器视口固定 1280x960，CDP `Emulation.setDeviceMetricsOverride` 返回 -32001 不可用；file:// 下 iframe 跨文档访问被浏览器拦截（`contentDocument` null）；本地 8917 代理白名单异常（/index.html 返回 83 字符提示页）。已用响应式断点静态核验补充：head/gap_00 含 `@media (max-width:768px)` 规则、v68-pop 面板为居中弹窗、UI 整改批（UI-3 移动端 ≤768px 面板可用）已交付并实测过 375。**建议后续批（P1-1/P1-2）在可用视口工具时补测**。

## 六、改动清单

| 文件 | 改动 | 位置 |
|---|---|---|
| src/script_02.js | 38 节点函数式→对象式 | 全文件多处 |
| src/script_02a.js | 57 节点函数式→对象式 | 全文件多处 |
| src/script_02b.js | 87 节点函数式→对象式 | 全文件多处 |
| src/script_03.js | 4 节点函数式→对象式 + **renderStats null 防御修复** | 节点多处 + @11584 |
| game.html / game_check.html / game_chunked.html / index.html | 重建发布 | 四路一致 5977228/3386790 |
| chunks/*.js（story_* 8 片） | 分片重建（节点 3711 零损失） | NODE_MAP 3236 |

## 七、扩充记录（本轮无内容扩充）

本轮为纯工程批（节点格式统一），无内容扩充。回归发现的 #stats 修复按「扩充/修复记录」单列（见 §四）——修复理由：P0-2 验收「浏览器回归 + 游戏功能零回归」的必要前提（游戏无法开局则无法验收），且为最小侵入 null 防御、不触碰任何红线项。

## 八、备份与回滚

- 备份：`backup\P0-2_20260909\`（src 全量含迁移前原版、四路 html、budget.json；51 文件 24,716,960B）
- 回滚：恢复 `backup\P0-2_20260909\` 下对应文件 → 重跑 `python _build_authority.py build` → Copy game_built→game.html → `elda chunks` → `elda sync` → `elda ci`

## 九、验收对照（口令 §验收标准）

| 验收项 | 结果 |
|---|---|
| script_02.js 拆分后每个模块 <1MB、职责单一 | P0-1 已交付（02d=905KB 最大）✅ |
| 节点格式统一后节点数 3711 零损失、死链 0、elda full 全绿 | ✅ 3711 / 死链 0 / 全绿 |
| 新增 1 节点只加数据不改引擎 | ✅ 演示 3711→3712→3711 |
| 四路字节一致 | ✅ |
| 旧档兼容、saveVersion=48 不变 | ✅ 读档实测通过 |
| 性能预算门 6 项 PASS | ✅ |
| 浏览器回归三档实测 | ⚠️ 1280 完整通过；768/375 受环境限制未实测（记录缺口，静态断点核验补充） |

## 十、遗留与建议

1. **768/375 视口实测**：建议在具备视口控制能力的环境补测（P1-1/P1-2 浏览器回归时优先）
2. **v68 其他潜在空容器**：`#stats` 修复暴露了 v68 改版「容器重构、引擎未同步」的模式——建议在 P1-2 冒烟测试中扩大自动化覆盖（建号→主线→结局全链路），防止同类回归漏网
3. `_p02_gap.py/_p02_v68.py/_p02_demo.py/_p02_demo2.py/_p02_demo3.py/_p02_demo4.py` 为调试临时脚本，已清理；保留 `_p02_probe.py/_p02_probe_result.json/_p02_convert.py/_p02_convert_result.json/_p02_demo5.py` 作为本批可复现记录
