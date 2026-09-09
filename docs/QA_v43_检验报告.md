# QA_v43 检验报告 — 沉浸演出恢复 + 分片默认入口

- 日期：2026-09-07
- 基线：v42 技术层完成态（2618 节点 / game.html ≈ 324.3 万字符）
- 本次改动：恢复 v34 沉浸演出系统（此前其 JS 被埋在 `<style>` 区从未执行）+ 将分片版设为默认入口

---

## 一、交付清单

| 文件 | 说明 | 状态 |
|---|---|---|
| `game.html` | 单文件完整版（含 v43 沉浸演出） | ✅ 324.4 万字符 |
| `game_check.html` | 同步副本（Copy-Item） | ✅ 已同步 |
| `index.html` | **分片版默认入口**（= game_chunked.html 副本） | ✅ 新建 |
| `game_chunked.html` | 分片版（重建，含 v43） | ✅ 119.4 万字符 |
| `chunks\` | 8 分片 + NODE_MAP.js（2189 条） | ✅ 重建 |
| `start_server.bat` | 双击起服，打开 **index.html**（分片版） | ✅ 入口已改 |
| `manifest.webmanifest` | start_url → `./index.html` | ✅ 已改 |
| `backup\game_v43_before_immerse.html` | 开工前备份（v42 完成态） | ✅ |
| `docs\QA_v43_检验报告.md` | 本报告 | ✅ |

---

## 二、v34 沉浸演出恢复内容（全部已接入引擎钩子）

### 2.1 场景氛围动态系统
- `#atmosphere-overlay` 氛围叠层 + 时段/天气/深渊 body class 自动应用
- 接入点：writeNext 完成后自动按 `S.time.period` / `S.time.weather` 更新
- **亮色主题适配**：夜间 filter 由 `brightness(0.82)` 调亮至 `brightness(0.96)`（避免破坏用户选择的亮色羊皮纸主题）
- 粒子效果：雨天 40 滴 / 雪天 25 片 / 雾天 8 团（设置面板可关）

### 2.2 文字演出
- **打字机**：默认开启，速度 8ms/字（原 25ms 调快）；仅对纯文本段落（无格式子元素）逐字显示；段落 >500 字自动直出；点击任意处立即跳过
- **段落渐显**：`par-enter` 动画（0.4s 上滑淡入，逐段 0.05s 错峰）——修复：非打字机段与打字机段均有效果
- 文字特效/自动滚动/场景过渡函数保留

### 2.3 判定演出
- **骰子动画**：`v34_rollDice` 3D 骰子旋转 overlay（显示点数 + 结果横幅 + 连击计数），1.8s 自动关闭/点击立即关闭
- 接入点：writeDice 包装（判定时先播动画，v30 结果横幅同步显示，互不冲突）
- **判定音效**：crit→高音 / critfail→低音 / fail→失败音 / 其余→成功音

### 2.4 音效系统
- Web Audio 振荡器合成（无外部资源），设置面板"启用音效"开启后创建 AudioContext
- 默认关闭（符合浏览器自动播放策略，等用户主动开启）

### 2.5 设置面板（完整版恢复）
- 文字演出：打字机/速度/文字特效/自动滚动
- 场景氛围：粒子效果/判定动画
- 音效：启用音效/音量
- 界面：简洁模式
- 数据与调试：存档管理/错误日志/调试面板

---

## 三、默认入口切换

- **双击 `index.html`**（file://）→ 分片版（相对路径动态 script 加载，file:// 可用）
- **双击 `start_server.bat`** → `http://localhost:8080/index.html`（分片版 + PWA）
- `game.html` / `game_check.html` 保留为单文件完整版（无网络依赖、零配置）
- manifest start_url 已指向 index.html

---

## 四、历史遗留 bug 修复（v34 恢复过程中发现）

| Bug | 现象 | 修复 |
|---|---|---|
| `v34_openAchievements` .box 依赖 | 点"成就"面板无法打开（closeModal 清空 #modal 后 querySelector('.box') 失效） | 改为 `openModal(box)` 标准入口 |
| `v34_openMap` .box 依赖 | 点"世界地图"面板无法打开 | 同上 |
| v34_init 音效按钮重复创建 | 页面上会出现第二个音效按钮 | 删除创建段，复用引擎 🔊 按钮 |

---

## 五、验证结果

### 5.1 静态验证
- `python build_elda.py`：不适用（本项目以 game.html 为权威源，v42 起改走 `_v39_extract.py` 提取链）
- `_v39_extract.py` + `node --check`：**5/5 PASS**
- `_check_dead_links.py`：节点 2618 / go 5985 / **死链 0**
- 占位：仅 writeNext 兜底提示 1 处（"此处剧情尚未展开"），其余 21 处"占位"字样均为历史批处理注释
- 分片版（`_v42_verify_chunks.py`）：合并 2618 节点零缺失/零多余，死链 0；14 个 JS `node --check` 全 PASS

### 5.2 浏览器回归（file:// 单文件版 + http:// 分片版）

| 项目 | 结果 |
|---|---|
| v43 钩子加载（V34/afterFlush/immerseWrite/immerseDice） | ✅ 全部就绪 |
| 氛围自动应用（body.time-noon weather-clear） | ✅ |
| 段落渐显（8/8 纯文本段 par-enter） | ✅ |
| 打字机（纯文本段逐字，8ms，点击跳过） | ✅ |
| 判定骰子动画（overlay 出现→显示点数"成功"→1.8s 自动消失） | ✅ |
| 判定音效（audioEnabled 开启 + AudioContext 创建 + playSfx 无异常） | ✅ |
| 设置面板完整（9 个输入控件，5 个分区） | ✅ |
| 成就面板打开 | ✅ |
| 世界地图面板打开 | ✅ |
| 行动面板→探索城区→判定→返回游戏（无卡死） | ✅ |
| 分片按需加载（loadChunk story_academy → +337 节点） | ✅ |
| 控制台错误 | **0** |

---

## 六、已知说明

1. 打字机默认开启（8ms/字）。长段落（>500 字）自动直出避免等待；点击页面任意处立即跳过。
2. 音效默认关闭——浏览器自动播放策略限制，需玩家在设置面板手动开启；开启后仅影响 v34 合成音效，与引擎自带 🔊 按钮互不干扰。
3. 分片版 PWA（sw.js）仅在 http:// 环境生效，file:// 双击打开时静默跳过属预期行为。
4. 骰子动画每次判定弹出（约 1.8s），可在设置面板"判定动画"关闭。
5. 简色模式（compactMode）开关已接入 v34_setCompactMode（关闭全部动画）。

---

## 七、回滚

- 单文件版回滚：`Copy-Item backup\game_v43_before_immerse.html game.html -Force`
- 分片版回滚：删除 index.html 改用 game_chunked.html 旧版或重跑 `_v42_build_chunks.py` 前先备份

---

## 八、核心结论

v34 沉浸演出（氛围/打字机/判定动画/音效/设置）已完整恢复并接入引擎钩子，同时完成亮色主题适配与两处历史面板 bug 修复；分片版已成为默认入口（index.html），单文件版保留备用。双环境（file:// 与 http://）验证全绿，0 控制台错误。
