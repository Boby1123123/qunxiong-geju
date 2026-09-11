# NM-6 NPC 记忆 v2（v93）

批次：NM-6 · 2026-09-11 · 八批大型更新第六批
状态：已完成，ci 全绿

## 扩了什么

- 新建 `src\data_nodes\dn_npc_memory.js`：`window.NPC_MEMORY_V93`，16 个登记 NPC × 4 记忆槽。
- `src\script_02c.js` changeRelation 函数尾注入 `/v93npc:relhook/`：好感变动时调 `v93_npcRemember(npcId, delta, reason)`，写入 `S.npcMemory`（独立键，每 NPC 最近 4 条 {day,v,note}）。
- `applyDefaults` 新增 `s.npcMemory={}` + `s.settings.npcMemory=true`。
- `src\script_03.js` writeNext 注入 `v93_npcMemoryHook(node)`：节点文本出现已登记 NPC 且有好感/记忆时，注入 1 句关系回指，按好感档（-60 敌意 / 0 泛泛 / 60 挚友 / 80 恋人）不同语气；`S.settings.npcMemory===false` 时返回 null 零注入。
- `src\script_04.js` `/v93npc/` IIFE（:11485，哨兵 `__v93npcLoaded`）+ `v93_openMemoryPanel()` 记忆面板。

## 为什么

原好感只存数字，玩家记不住"和谁在何时发生过什么"。记忆 v2 把每次好感变动变成可回看的记忆条目，并在后续节点自然回指（"你想起上回见他……"），让关系发展有前史、有温度，强化连续性机制（CM-1/NM 体系）。

## 如何验证

- bu 实测：记忆面板打开显示"尚未与任何人建立值得一提的关系"占位；推进后出现 NPC 记忆条目。
- 好感变动触发 relhook（代码路径 v93_npcRemember）；节点回指句按好感档切换。
- 踩坑记录：注入锚文本必须从 Read 的 UTF-8 原文复制（GBK 乱码锚 assert 必炸）；按钮注入条件用哨兵 `window.__v93npcLoaded` 而非按钮字符串（曾致 IIFE 未写盘 → ci 引用健康 FAIL，修复后重注重建全绿）。
