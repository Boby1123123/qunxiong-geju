# FS-1 双系统合一（势力状态对象化 + 统一加入入口）

## 改了什么
- `src\script_03.js:70` applyDefaults：`S.faction` 由字符串默认改为对象默认 `{joined,rank,reputation,quests,...}`，旧档字符串（如 `"free"`）自动迁移为对象（经 `V35_FID_MAP` 映射到 V35 id）。
- `src\script_03.js:6563/6569/6581` 世界状态计算：`S.faction==='church'/'free'/'orc'` → `S.faction.joined==='light_church'/'free_cities'/'orc_horde'`（安全链，防字符串态）。
- `src\script_04.js` v35_initFaction：新增字符串→对象迁移；`window.V35_FID_MAP` 叙事 id→V35 id 映射（free→free_cities / north→north / church→light_church / desert→desert / east→empire / orc→orc_horde / dwarf→dwarf_kingdom / elf→elf_kingdom）；新增 **`window.v35_doJoin(fid)`** 统一加入入口（写 S.faction.joined + V35_FACTION_STATE 同步 + 声望+20 + 事件）。
- `src\script_04.js:11258/11275` 商会分红判断：`S.faction==="guild"` → `S.faction.joined==="free_cities"`。
- `src\data_nodes\dn_faction.js` 4 处 + `dn_faction2.js` 4 处：叙事线加入 run 改为经 `v35_doJoin` 统一入伙（原互斥降声望逻辑保留，字段改 .joined 比较）。

## 为什么
- 双系统并存（V35 面板对象态 vs 叙事线字符串态）互相覆盖：先开面板再走叙事线会字符串覆盖对象，先叙事线加入后面板显示"未加入"。统一后所有路径共用一个状态源 + 一个入口。

## 如何验证
- `node --check` 全绿；`elda ci` 25 检查器全绿（存档兼容仿真 PASS）；四路字节一致（game=8859699B / chunked=6104985B）；smoke PASS。
- 旧档（S.faction="free"）加载 → applyDefaults 迁移为 `joined:"free_cities"` → 世界状态 W.guild 判定生效、面板显示已加入。
