# confirm 改造 · v72

> 批次：阶段二 · 批 4（P1-1）｜日期：2026-09-09｜状态：✅ 已实施并验证
> 目标：消除 8 处原生 `confirm()`（自动化与移动端阻塞根因），统一为 Promise 式 DOM 确认弹窗。

## 一、背景与依据

- docs/bu会话超时手册 认定原生 `confirm()` 是自动化回归的阻塞根因（阻塞页面主线程、无法被脚本驱动）。
- 方案《群雄割据技术改进实施方案.md》P1 第 1 项：8 处原生 confirm → Promise 式 DOM 弹窗。
- 红线遵守：**未触碰**判定公式 / writeNext / choose / 存档语义；旧存档兼容（saveVersion=48 不变）；备份带版本命名；验证链全绿。

## 二、改动前诊断（证据）

| 项 | 位置（批4 开工前） | 说明 |
|---|---|---|
| askConfirm 包装器 | game.html L53858 | `try{ return window.confirm(msg); }catch(e){ return true; }` |
| askConfirm 调用① | "重开新旅"按钮 onclick（script_03） | `b.onclick = ()=>{ if(askConfirm(...)) newGame(); }` |
| askConfirm 调用② | newGame() | `if(!askConfirm("确定开始新的旅程？...")) return;` |
| askConfirm 调用③ | init() 读档确认 | `if(askConfirm("检测到存档...是否继续？"))` |
| confirmNewGame | script_02 | 原生 confirm("确定要开始新游戏吗？...") |
| v34_deleteSlot 生效套 | script_04 | 原生 confirm 删档确认 |
| v34_importSave 生效套 | script_04 | 原生 confirm 覆盖确认 |
| 死代码 confirm ×4 | game.html L2530/2554（head 文本区）、script_04 套2 | 非运行时代码，保留待批 8 清理 |
| 弹窗基础设施 | v67_ui 单例（script_14，open/close + stack） | openModal/closeModal 走 v67_ui |

elda full「原生 dialog 扫描」白名单 8 处 → **批4 后 4 处（仅死代码）**，疑似新增 0 处。

## 三、实施内容（8 处替换）

### 1. askConfirm 本体 → Promise 式独立 overlay

```js
function askConfirm(msg){
  return new Promise(function(resolve){
    try{
      // 独立 fixed overlay（#b3-confirm-overlay），不依赖 #modal / v67_ui 栈
      // box 内：⚠ 确认 + 消息（esc 转义）+ 确定/取消 双按钮
      // 关闭路径：确定→resolve(true)；取消/ESC/点遮罩→resolve(false)
    }catch(e){ resolve(true); }
  });
}
```

**关键设计（含修复）**：
- **独立 overlay**：不调用 openModal/closeModal。实测发现 v67_ui.open() 会先清空 `#modal.innerHTML`，在建号界面等**已有 modal 之上**调用时会破坏下层界面内容；overlay 方案彻底隔离。
- **ESC 捕获阶段监听 + stopPropagation**：游戏全局 ESC 监听（关 modal）注册在前；若不加隔离，按 ESC 关确认弹窗会连带关闭下层建号/面板 modal。捕获阶段先于冒泡执行并阻断传播，确认弹窗关闭时下层界面完好。
- **遮罩 mousedown 同样 stopPropagation**：防游戏全局"点击 modal 外关闭"逻辑误关下层。
- **无轮询**：ESC/遮罩均有直接监听，关闭即 `ov.remove()`，无 250ms 定时器残留。

### 2. 三处 askConfirm 调用 async/await 化

| 调用点 | 改动 |
|---|---|
| "重开新旅"按钮 | `b.onclick = async ()=>{ if(await askConfirm(...)) newGame(); };` |
| newGame() | `async function newGame(){ if(!(await askConfirm(...))) return; ... }` |
| init() 读档 | `async function init(){ ... if(await askConfirm(...)) ... }`（init 仅由 `window.addEventListener("load",init)` 注册，async 化安全） |

### 3. confirmNewGame → async + await askConfirm

```js
async function confirmNewGame(){
  if(await askConfirm("确定要开始新游戏吗？当前存档将被清除。")){ ... location.reload(); }
}
```

### 4. v34_deleteSlot / v34_importSave 生效套 async + await askConfirm

- 生效套经 `rfind` 定位（head 文本区 + script_04 套2 为死代码，未动）。
- `StorageKit.importJSON` 回调改 async，覆盖确认改 await。

## 四、验证链（全绿）

| 检查 | 结果 |
|---|---|
| 内容零损失 | 归一化（\r\n→\n）diff：当前 vs 批3备份仅含批4 预期改动（+2313 字符=批3增量990+批4增量1323，逐块自洽）；字节减少全部来自批3 起 build 统一换行符 CRLF→LF，无内容丢失 |
| node --check | script_02/03/04 全部 PASS |
| 构建闭环 | `_build_authority.py build→verify` 字节级一致（幂等） |
| 四路同步 | game=game_check=5,974,855 B；chunked=index=3,374,977 B，字节校验一致 |
| elda full | 18 检查器全部 PASS（原生 dialog 8→4 仅死代码，疑似新增 0） |
| 浏览器回归（file://） | 单文件版：弹窗渲染 ✅ 确定→true ✅ 取消→false ✅ ESC→false ✅ 遮罩→false ✅ 建号界面完好（depth=1、15393 字符）✅ |
| 端到端真实流程 | 注入存档→刷新→init 读档弹窗"检测到存档（第5日）是否继续"→确定→进入游戏 ✅；存档面板→删档弹窗"确定删除槽位1"→取消档保留→确定档删除（LS 键同步删除）✅ |
| 分片版回归 | index.html：askConfirm/confirmNewGame/v34_deleteSlot/v34_importSave/init 全部 async 化 ✅ 弹窗渲染+resolve ✅ |

## 五、改动文件

- `src/script_02.js`：confirmNewGame → async
- `src/script_03.js`：askConfirm 独立 overlay Promise 式；onclick/newGame/init async+await
- `src/script_04.js`：v34_deleteSlot/v34_importSave 生效套 async+await
- `game_chunked.html`：同串同步（分片版）
- 构建产物：game.html / game_check.html / index.html（经 build + sync 再生成）
- 备份：`backup\batch4_20260909\`（73 文件，开工前完整快照）

## 六、遗留与后续

- 死代码 confirm ×4（head 文本区 L2530/2554、script_04 套2）保留，规划批 8 文本治理统一清理。
- v67_ui.open() 清空 #modal 的行为属既有设计（上层 modal 会覆盖下层）；批4 以独立 overlay 规避，未改 v67_ui 本体。
- 自动化回归可用性：确认弹窗现为 DOM 元素（#b3-confirm-overlay），可被脚本直接驱动（点击/断言），原生 dialog 阻塞已消除。
