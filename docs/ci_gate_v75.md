# 批 5 交付记录（回归流水线 elda ci 一键门禁）+ UI 收尾 #side 退役

- 版本：v75.1（2026-09-09）
- 范围：阶段二 P1-2 回归流水线 + UI 专项遗留收尾
- 铁律核对：判定公式 / writeNext / choose / 存档语义零触碰；saveVersion=48 不变；改动前备份

---

## 一、elda ci 一键门禁（P1-2 回归流水线）

### 目标
验收标准「自动化回归一条命令全绿」——任何改动后，跑一条命令即可判定仓库是否可发布。

### 实现（`tools\elda\elda.py` 新增 `cmd_ci()` + main 分发 + 文档串）
验证链（全部只读，不写任何文件）：
1. **src 语法**：`node --check` 19 块 script_*.js
2. **权威源幂等**：`elda build verify`（src build 产物 == game.html 当前内容，闭环成立）
3. **四路字节一致**：game=game_check 且 chunked=index
4. **elda full**：18 检查器（死链/分片/存档兼容/marker/UI 系统/V68-UI/世界局势等）

任一步失败 → 汇总表标 FAIL → 退出码 1（禁止发布）。

### 实测输出（全绿）
```
[PASS] src 语法 node --check（19 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=5,979,415B game_check=5,979,415B / chunked=3,383,629B index=3,383,629B）
[PASS] elda full 18 检查器
门禁结果：全部通过（可发布）
```

### 用法
```
python tools\elda\elda.py ci        # 发布前门禁（≈15s）
```

---

## 二、UI 收尾：#side 空壳侧栏彻底退役

### 诊断结论
- `#side`（含 #stats/#panels/#map/#pack/#realm/#log）为**零 JS 引用空壳**：全 src JS 无 `getElementById("side")`/`#side` 选择器；修为/行囊/日志/地图自批 UI-1 起全部走 `#modal` 居中弹窗。
- `.v68-side-head` 是独立类（script_18 仍在渲染角色信息头），**保留**。

### 改动（`src/gap_00.html` + `src/head.html`）
| 文件 | 内容 | 净效果 |
|---|---|---|
| gap_00.html | 移除 `<div id="side">…</div>` DOM 空壳；移除移动端 `#side{display:none}`；移除 v68 主题 `body.v68-theme #side #stats…` 系列 507 字符 | DOM 更干净 |
| head.html | 移除桌面 `#side{width:330px…}` 侧栏样式块 4,949 字符；`@media (max-width:900px)` 保留 `#options` 部分 | 样式无死码 |

### 验证
- 单文件版 + 分片版浏览器实测：`#side` 不存在、main/stage/story/modal 均在、行囊/魔法快捷键照常打开
- elda ci 门禁全绿；分片版重建后节点 3711 / 死链 0 / 四路一致

---

## 三、验证链汇总
```
node --check 19 块 src PASS
elda build build → game_built.html → Copy → sync → verify PASS（幂等闭环）
elda chunks → 分片 14 片 1806 节点、合并 3711 节点、死链 0、分片语法 42 文件 PASS
elda ci → 4 步全 PASS（门禁结果：全部通过）
浏览器回归：单文件 + 分片版 #side 已退役、面板/快捷键无回归
```

---

## 四、构建链/工具链备注（给后续批次）
1. **ci 是只读门禁**：不重建、不 sync、不落盘；先改 src → `elda build build` → copy → sync → chunks → sync → `elda ci` 才是完整发布流程（ci 做最终把关）。
2. 改动涉及 body 骨架（gap_*.html）后，分片版必须重建（`elda chunks`），否则分片版仍含旧 DOM。
3. 原生 confirm 白名单 4 处（存档删除/覆盖）保持不动（elda full 仍 PASS）。

备份：`backup\P5_20260909\`（50 项：src 全量 + 四 html + elda.py + 实施/扫描脚本）。
