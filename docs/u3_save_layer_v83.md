# U3 · 存档层强化（B1 超限迁移 + 一键备份 + CloudProvider 契约留门）

> 批次：U3 | 日期：2026-09-09 | 依据：U1-U9 口令 B1 项、docs\存档层_v71.md
> 铁律遵守：S 结构 / saveVersion 语义 / ruleset 校验 / applyDefaults 兜底链 **全部未动**

## 一、改动清单

| 文件 | 改动 | 行号 | 差异摘要 |
|---|---|---|---|
| src\script_04.js | exportJSON 文件名加时间戳（时分秒） | ~8349 | `elda-save-day{day}-{YYYYMMDD}.json` → `elda-save-day{day}-{YYYYMMDD-HHmmss}.json`（防覆盖，一键备份语义） |
| src\script_04.js | CloudProvider 接口契约正式化 | ~8374（原 v63.5 注释区） | v63.5 预留注释升级为 U3 契约：load/save/exportAll/importAll 四签名 + 失败/回退语义 + 配置读取点 |
| src\script_04.js | StorageKit.cloud 槽位 | return 对象尾 | `cloud: null`——未注入云端实现时本地存储行为完全不变 |
| src\script_00.js | **移除** U2 注入的 `var curNode;` | 281 | 纠正 U2 错误：与引擎 `let storyEl, optEl, curNode=null` 冲突致 SyntaxError（详见 §三 回归修复） |
| src\script_03.js | 真实声明处补 window 导出 | 305 | `let storyEl, optEl, curNode=null; ... window.curNode = curNode;`（跨 script 裸引用显式接口，语义零变化） |
| budget.json | baseline 更新 v79 | — | game 6,026,253B / chunked 3,394,538B（U3 功能增长，U9 将自动化此流程） |

## 二、CloudProvider 接口契约（本次不接任何云端实现）

> 写入位置：src\script_04.js v63.5 注释区（/u3inj:cloud-contract/）——正式化，留门不装门。

```
接入点：window.v83_cloudProvider = { ... }（由外部注入；未注入时 StorageKit.cloud === null）
契约签名（异步回调式，与 StorageKit 既有风格一致）：
  load(slot, cb)        -> cb(null | {ok:true, data})；失败必须 cb(null) 或 {ok:false,msg}
  save(slot, data)      -> cb(null | {ok:true})；成功后才更新本地副本（云为第三副本）
  exportAll(cb)         -> cb(null | {ok:true, data:{slot, data, exportedAt}})；全槽位导出
  importAll(payload, cb)-> cb(null | {ok:true, imported:n})；全槽位导入
失败语义：网络/鉴权失败必须走 cb({ok:false, msg}) 且不得抛异常
回退语义：load 失败自动回退 localStorage → IndexedDB（StorageKit.loadSmart 不变）
配置读取：window.v83_cloudConfig = {url, anonKey}（用户提供后启用，本次不启用）
```

## 三、回归修复（U2 引入，本批发现并纠正）

**症状**：浏览器实测游戏不启动——console 报 `Identifier 'curNode' has already been declared`，连锁 `N is not defined` / `applyEffects is not defined`，引擎核心与机制卷全链中断。

**根因**：U2-A6 在 script_00 注入 `var curNode;`，但引擎真实声明为 script_03.js:305 `let storyEl, optEl, curNode=null`——同一全局作用域 `var` 与 `let` 同名 = **SyntaxError**，整块解析失败。

**修复**：
1. 移除 script_00 的错误注入（U2 当时未找到真实声明——`let storyEl, optEl, curNode` 多变量声明形式未被检索正则覆盖，属方法学教训）
2. 在真实声明处补 `window.curNode = curNode;`（与 optEl/storyEl 的 v60 导出风格一致，跨 script 裸引用获得 window 兜底，c_refhealth 专项保持清零）

**验证**：修复后浏览器实测 S=object / StorageKit=object / writeNext=function / saveGame=function，正文动态渲染完整（"4037年·春一月·一日…世界暂无大事"），console 0 错误。

**教训记录**：① 给全局变量加导出前必须全库检索真实声明（含多变量 let 形式）；② 浏览器回归必须验证**游戏动态启动**（S 对象存在 + 正文为 JS 渲染），不能只查静态文本。

## 四、实测数据（bu 浏览器平面，file:// 分片版）

### 4.1 超限迁移（B1）
- 构造 6,291,613 字符存档（> 3.6M big 阈值）→ `StorageKit.save()`：localStorage 不写入（big 分支），自动写入 IndexedDB
- `StorageKit.loadSmart()`：LS 无 → IDB 回读 → `_test_u3=true, day=42, marker='u3-idb-migrate', bigField=6,291,455 字符完整`
- **结论：超限存档自动迁移 IndexedDB 成功，可完整回读**（saveReturn=false 符合 big 语义——LS 跳过）

### 4.2 一键导出/导入
- 导出：`S.day=77, gold=1234.5, _u3mark='export-test'` → exportJSON → 下载文件名 **`elda-save-day77-20260909-125544.json`**（时间戳含时分秒 ✓）
- 文件内容：JSON 完整（ruleset=elda-qunxiong-v3，day=77，gold=1234.5，_u3mark=export-test，saveVersion=42）
- 导入：importJSON 解析 → ok=true，day/gold/mark 全还原 ✓；规则集不匹配文件 → ok=false "存档规则集不匹配" ✓

## 五、验证链结果

```
[PASS] src 语法 node --check（26 块）
[PASS] 权威源幂等 verify（src→game.html 闭环）
[PASS] 四路字节一致（game=6026210B game_check=6026210B / chunked=3394495B index=3394495B）
[PASS] elda full 18 检查器（FAIL 0 / 专项 0 / 死链 0 / 预算门 6 项）
[PASS] 冒烟测试（节点完整性 + 结局可达）
[PASS] 浏览器实测：超限迁移 / 导出时间戳 / 导入还原 / 规则集拒绝 / 游戏启动（console 0 错误）
```

## 六、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| 导出文件名时间戳 | 加 HHmmss | 一键备份多次导出不覆盖（原仅日期，同日多次导出覆盖） | 实测下载名 elda-save-day77-20260909-125544.json |
| CloudProvider 契约 | v63.5 注释升级为四签名契约 + cloud:null 槽位 | 云存档"留门不装门"：接口先定死，后续接 Supabase 等零改动 StorageKit | 代码注释 + 本文档 §二；未注入时本地行为回归通过 |
| curNode 显式导出 | 真实声明处 window.curNode | 跨 script 裸引用显式接口（U2 目标），且不引入声明冲突 | 专项 0 + 游戏启动实测 |

## 七、回滚

- 改动带幂等 marker（/u3inj:export-ts/ /u3inj:cloud-contract/ /u3inj:cloud-slot/ /u3fix:curnode-export/），重跑构建即覆盖
- 备份：backup\U2_20260909\src_backup\ 含 U3 改动前 script_04/03/00 原版（改动前基线）；backup\U3_20260909\ 含本批交付状态
- budget.json v78 为改动前版本（v79 更新了 baseline）

## 八、后续

- 云存档启用条件：用户提供 v83_cloudConfig（url+anonKey）→ 实现 v83_cloudProvider 四签名 → 挂 StorageKit.cloud
- U9 将实现 budget.json 自动估算（本次手动更新 baseline 为过渡）
