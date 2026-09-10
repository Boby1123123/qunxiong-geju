# DEEP-1 · 好感关系文本变体（文本本体革命·内容深化工程）

批次：DEEP-1 ｜ 日期：2026-09-10 ｜ 口令：《文本本体革命（五工程十批）》工程 DEEP 批 1

## 一、扩了什么（What）

为 16 个已登记 NPC 的 48 个既有节点，将 `text` 从纯字符串数组升级为**递归四态 ifRelation 变体**，同一场景按好感四档渲染不同正文：

| 好感档 | 条件 | 正文风格 |
|---|---|---|
| 恋人 | `npcRelations[npc] >= 80` | 亲昵、私密、承诺感（夜间授课、牵手、同行誓言） |
| 挚友 | `>= 60` | 交心、共谋、议事口吻（把玩家当可议论朝局/同行的自己人） |
| 死敌 | `<= -60` | 冷拒、提防、划清界限 |
| 默认 | 其余 | 原正文（逐字保留） |

**覆盖节点分布（48 个，13 文件）**：
- 学院 8 同学：elena×3 / cecy×3 / kain×3 / alice×3 / ata×3 / mori×3 / loca×3 / tie×3（fc_tavern 起始场景 + alumni 第二幕）
- 导师 4 人：mentor_mercury×3 / mentor_gora×3 / mentor_theresa×3 / mentor_moritz×3
- 势力/地域 NPC：orc_graymane×3 / sp8_koen×3 / free_lord×3 / elf_linge×3

## 二、为什么（Why）

1. **满足"同一人物关系不同阶段应有不同对话"的文游标准**：此前 NPC 对话与好感度完全脱钩，60 挚友和 -60 死敌看到的是同一句客套话，关系发展缺乏文本反馈。
2. **零引擎风险的体验增强**：复用 CM-2 已落地的 `v91_resolveText` 三形态，只改节点数据层。
3. 李管事 / 阿岩 / 金老人因无 `relation` id（探测脚本 con2_idprobe.py 确认 li_*/aye*/jin* 均为空），无法挂 ifRelation，本次弃用——不硬造 id，避免污染好感体系。

## 三、引擎增强（唯一引擎改动，纯增强向后兼容）

`src\script_03.js` — `v91_resolveText` 新增递归辅助 `_v91R(sg)`：
- 支持 `yes/no/default/ifFlag` 的值为**数组或嵌套对象**（原实现仅支持单层两态）
- 五维键 `ifJob/ifIdeal/ifHobby/ifTalent/ifSubrace` 与 `ifFlag/ifRelation` 同构走 `_v91R`（为后续 A 批五维开局变体铺路）
- 优先级链：ifRelation → ifFlag → default；同级多键按对象键序
- 数组/字符串行为与旧实现逐字节一致（headless 测试 48 节点 4 态全过）

## 四、如何验证（How）

1. `node --check`：26 块 src + data_nodes 全 PASS，0 失败
2. `elda text guard`：30 治理词全 ≤30 处、中文引号配对（左=右=3519）、连续标点 0
3. headless 四态测试（con2_deep1_test.py → deep1_headless_test.js）：48/48 节点四态 distinct ≥3 且各态非空
4. `elda ci`：25 检查器全部通过（可发布）
5. `smoke_test.py`：RESULT: PASS
6. bu 桌面实测（1280 档）：建号（普路托斯/男/人类/中境人/自由城邦/战士/良才/狩猎/探寻真相）→ 正文渲染正常 → 行囊/存档面板开合 → Escape 关闭，console 无新增错误

## 五、扩充记录

| 项 | 说明 |
|---|---|
| 递归变体支持 | 原 v91_resolveText 只支持单层两态，现支持任意嵌套（多档好感链即递归实现），引擎向后兼容 |
| 治理词规避 | 注入正文 4 处"压低声音"（含"低声"子串）改写为"低语/低语道"，guard 复核达标 |
| 未创建节点 | 本批零新增节点（4,631 基线不变），纯文本层升级 |

## 六、红线核验

- 判定公式 / writeNext 核心语义 / choose / 存档结构语义：零触碰
- saveVersion=48 不变；applyDefaults 兜底链不变；旧档兼容（变体仅存于节点数据层）
- 节点数 4,631 不降；既有选项集/判定/go 全部不变（headless 测试验证 text 解析不影响 options）
