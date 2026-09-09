# CS 线 云存档灰度（三大路线 · 线三 三批完成）

- 日期：2026-09-09（BD-4 → CS-1 → CS-2 → CS-3）
- 状态：已实施、已验收、elda ci 全绿（21 检查器 · 可发布）
- 备份：`backup\CS1_20260909\`（script_04.js 改动前快照）；临时脚本用后删除
- 全部 fetch 原生实现，零外部库（契约：v635「全部 fetch 原生实现」）

## 一、CS-1 加密导出/导入 + 槽位对齐

### 改动清单
| 位置 | 内容 |
|---|---|
| src\script_04.js StorageKit | `_keyStream`（djb2 口令哈希 → mulberry32 PRNG）/ `_encStr`（TextEncoder → XOR 密钥流 → btoa，魔数前缀 `eldaENC1:`）/ `_decStr`（atob → XOR → TextDecoder） |
| exportJSON(pass) | 新增可选口令参数：传口令加密导出（.elda 扩展），不传走明文 JSON（旧行为零回归）；加密失败自动降级明文并提示 |
| importJSON(file, cb, pass) | 自动识别三格式：`eldaENC1:` 加密（需口令，错误口令报"解密失败"）→ `lz1:` 压缩 → 明文 JSON；ruleset 校验不变 |
| 存档面板 UI | 新增「🔐 加密导出」按钮（两次口令确认）；导入遇加密存档自动弹口令重试（v34_importSaveDo） |

### 验证
- 往返实测：`_encStr(S)` → 魔数 `eldaENC1:` 正确 → 正确口令解密 name/day/ruleset 完整（沙漠行者/26日/elda-qunxiong-v3）；错误口令解出乱码 JSON.parse 抛错（导入路径报"解密失败"）；明文/lz1 双格式兼容未回归
- 存档面板：加密导出按钮 + 导入口令重试入口渲染正常

## 二、CS-2 v63_cloud 实现 + 设置面板三按钮

### 改动清单
| 位置 | 内容 |
|---|---|
| src\script_04.js v63_cloud | `save(slot,data,cb)`：POST `?on_conflict=player_id,slot` upsert（第三副本：成功不回滚本地）；`load(slot,cb)`：GET 按 player_id+slot，返回 data+updated_at；`list(cb)`：GET 全槽位按 updated_at 倒序 |
| StorageKit.cloud | 指向 window.v63_cloud（StorageKit 既有 API 签名不动） |
| v63_cfg / v63_configure | 读 `elda-cloud-config`（localStorage 键 {url, anonKey}）；配置入口 prompt 填 URL+anonKey |
| 设置面板「云存档」区 | 上传/下载/列表/配置四按钮 + 状态栏 + 消息区；未配置时云按钮置灰（disabled+0.45 透明度）+ 提示文案 |

### 行为契约遵守
- 云为第三副本：save 成功后仍写 LS+IDB（StorageKit.save 调用方不变）
- load 失败回退 LS（StorageKit.loadSmart 不变；v63_download 失败仅提示不破坏本地）
- StorageKit API 签名不动；存档格式不变（payload 内嵌明文 JSON）
- 配置信息仅存本地键，不传任何密钥

### 验证
- bu 实测：设置面板云存档区渲染正常；未配置时三按钮 disabled + 状态"未配置（点击「配置云端」启用）"；点上传提示"云存档未配置"
- v63_cloud 三函数 typeof 全部 function；StorageKit.cloud === window.v63_cloud

## 三、CS-3 冲突处理 + 灰度验证

### 改动清单
| 位置 | 内容 |
|---|---|
| v63_upload | 上传前强制确认「最近保存时间」（S.saveTime → 本地化时间串），取消则中断 |
| v63_download | 冲突裁决：`updatedAt > saveTime`（远端更新）→ 覆盖前先把本地备份为 `elda-save-slot-<slot>--conflict-<ts>` 冲突副本再确认；`saveTime > updatedAt`（本地更新）→ 提示"本地比云端新，建议先上传"，确认后仍可覆盖 |
| v63_listUI / v63_dlSlot | 云端列表（槽位+更新时间）+ 逐槽位下载 |

### serve 下完整流程实测（mock PostgREST，本地可复现）
1. **配置 + mock**：注入 `elda-cloud-config` + mock fetch 拦截 `/rest/v1/saves`（内存 store）
2. **上传**：`v63_cloud.save('slot1', ...)` → `{ok:true}`，store 出现 `p-无名旅者:slot1`
3. **清档**：删除 `elda-qunxiong-v3-save`（本地丢失模拟）
4. **下载恢复**：`v63_cloud.load` → `{ok:true, day 恢复, updatedAt 存在}`
5. **远端更新**：cloud updated_at 设为未来 → v63_download confirm 提示"本地旧档已备份为冲突副本"
6. **本地更新**：本地 saveTime 设为未来 → v63_download confirm 提示"本地存档……比云端……更新，建议先上传"

### file:// 降级说明
- file:// 下 `fetch` 至 Supabase 受 CORS 限制 → 云功能仅 http（elda serve）或部署后可用；未配置/网络失败时按钮置灰或提示，本地存档读写路径零影响

### RLS 行级安全说明（部署注意）
- Supabase 表 `saves`（player_id/slot/data/updated_at）建议启用 RLS：`player_id = auth.uid()` 或自管理 player_id 由应用层派生（当前实现用存档角色名派生 `p-<name>`，多端同步时 player_id 需一致；正式多用户部署建议换成服务端签发的 player_id）

## 四、铁律遵守
- 备份 backup\CS1_20260909 ✓；临时脚本用后删除 ✓
- 判定公式 / writeNext / choose / 存档结构语义：零触碰 ✓
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容 ✓
- 节点数不降：3,877 保持 ✓；elda ci 21 检查器全绿 ✓；smoke PASS ✓
- 四路字节一致：game=game_check=**6,382,063B** / chunked=index=**3,732,777B** ✓
- 不引入任何外部库（加密自实现 + fetch 原生）✓
