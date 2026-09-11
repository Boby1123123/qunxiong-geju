# WS-1 世界状态回路（v93）

批次：WS-1 · 2026-09-11 · 八批大型更新首批
状态：已完成，ci 25 检查器全绿

## 扩了什么

- 新建 `src\data_nodes\dn_worldstate_tpl.js`：`window.V93_WORLD_TPL`，war/church/guild/orc/seal 五维 × 3 档（缓和/紧张/危急）共 15 句回响模板，全部按 V66 文风书写，无治理词。
- `applyDefaults` 新增 `S.settings.worldEcho=true` 与 `S.worldState` 兜底（旧档零影响）。
- writeNext 注入链后挂 `/ws1inj:echohook/`：渲染前调用 `v93_worldEcho()`。
- `src\script_03.js` 文件尾新增：
  - `v93_worldState()`：扫 S.flags 白名单 → 五维连续值 0-100 → 写回 `S.worldState`（只读不改判定）。
  - `v93_worldEcho()`：在五主线枢纽节点（purge_/silver_/seal_/academy_/orc_ 前缀）或差异最大的维度推送 1 句世界回响，注入正文开头。
  - **seal 剧透门槛**：seal 维度仅当 `S.world.seal` 已触发 || seal flag 已置 || `S.anchors>0` 才推送，防开局剧透深渊封印线。

## 为什么

玩家推进主线时世界没有"呼吸感"：战争/教会/商会/兽人/封印的局势变化只存在于 flag，玩家读不到世界在动。WS-1 让主线枢纽节点自动带一句局势回响，把状态变化变成可感知的文本，且零判定干预。

## 如何验证

- ci 引用健康审计通过（v93_worldState/v93_worldEcho 声明与引用匹配）。
- bu 实测：自由城开局未触发 seal 句（门槛生效）；推进主线后回响句出现。
- 开关 `S.settings.worldEcho=false` 时零注入（代码路径返回 null）。
