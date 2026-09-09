# P2 剩余项 · 内容工具生态完善 + 文本治理自动化（v90）

> 批次：P2-R | 日期：2026-09-09 | 依据：《群雄割据技术改进实施方案》P2 剩余项（内容工具生态完善、文本治理自动化；多周目已于 U7 完成、移动端已按用户指令删除）

## 一、改动清单

| 文件 | 改动 |
|---|---|
| tools\elda\p2tools_impl.py（新增 18KB） | 两个命令族：`elda content`（事件/支线模板+插入、节点去重、好感链校验）、`elda text`（高频词/相似段落/标点规范/字数分布/专名一致性/一键全查+报告） |
| tools\elda\elda.py | 注册 `content` / `text` 两个顶层命令 |
| docs\p2_text_report.md（新增） | `elda text all` 自动生成的文本治理报告 |

**零触碰**：src 游戏本体、引擎、判定公式、writeNext/choose、存档语义、saveVersion=48 全部未动（工具层改动，游戏运行时零影响）。

## 二、elda content（内容工具生态完善）

| 命令 | 功能 | 实测 |
|---|---|---|
| `elda content event --id x --day 40 --cls 天灾 --text "…" [--commit]` | 生成/插入世界事件到 EVENT_POOL_EXT（dry-run 默认，--commit 才写 src，写前自动备份到 backup\P2_20260909\） | dry-run 正常；锚点校验防误插 |
| `elda content quest --id u9_x --npc lv_mage1 --slot d --entry arrive_x [--commit]` | 生成支线骨架（4 节点 65 挚友 + 返回节点，run 回调模板），--commit 写入 data_nodes\dn_<id>.js 并尝试注入入口 options | dry-run 正常；commit 骨架 node --check 通过；入口非对象式 options 时安全降级 WARN（不失败） |
| `elda content dup` | 跨全部权威源（src\*.js + data_nodes\*.js）节点 id 重复检测（game.html 构建产物不参与） | 1609 个源定义，0 重复 |
| `elda content chain [--npc id]` | 支线好感链校验：按 npc 统计 changeRelation 次数/终值，标记"挚友达标/不足"（阈值 ≥4 次 & ≥60） | 9 条线全部挚友达标（65-130） |

## 三、elda text（文本治理自动化）

| 命令 | 功能 | 首跑实测（src 权威源 10,733 段 / 41 万字） |
|---|---|---|
| `elda text freq [--top 30]` | 30 词 AI 高频词表统计，输出超标清单与改写建议 | 超标（>30）6 词：目光 92 / 低声 79 / 轻轻 78 / 微微 61 / 缓缓 35 / 深吸 33 |
| `elda text dup [--threshold 0.85]` | 相似段落检测（长度桶 + 2-4 字 shingle Jaccard） | 阈值 0.90 无相似段落（良好） |
| `elda text norm` | 中文标点/全半角规范：半角标点、全角空格、连续标点、英文引号包中文、中文引号配对 | **253 处英文引号包中文**、引号不配对（左 440 右 428）、连续标点 1 |
| `elda text len [--min 1000]` | 节点字数分布 + 超长清单 | 平均 38 字/段；>1000 字 0 段；<100 字 10,663 段（数组多段拆分所致） |
| `elda text names` | 专名一致性：强者/城市/势力零出现清单 | **3 个零出现专名：鬃吼 / 腐光 / 晨天**（兽王、暗蚀会首领、东境城市——疑似拼写变体或漏写，需 grep 核实） |
| `elda text all` | 全量跑 + 自动写 docs\p2_text_report.md | 报告已生成 |

## 四、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| event 插入锚点校验 | 找不到 `]; window.EVENT_POOL_EXT = EVENT_POOL_EXT;` 即中止 | 防误插破坏事件池 | dry-run 锚点打印 + commit 前备份 |
| quest 骨架 65 挚友模板 | +10/+15/+20/+20 + 奖励 + p12Quest 槽位 | 与 P1-2/U8 同阈值，新增支线零思考量 | chain 校验自动统计 |
| dup 排除构建产物 | 只查源文件间重复 | game.html 是产物必然"重复"，否则误报 | 实测 0 重复 |
| chain 阈值判定 | ≥4 次 & 终值 ≥60 = 挚友达标 | 与游戏好感语义一致 | 9 线全达标 |
| 文本治理 5 项 | freq/dup/norm/len/names | 把 v66 文风规范变成可执行检查 | 首跑发现真实问题（引号 253、专名 3、高频词 6） |

## 五、发现的真实问题（供后续整改口令使用）

1. **英文引号包中文 253 处**：JS 字符串内对话用 `\"` 包中文，应统一为中文引号（改 src 时需 node --check + ci 全绿）
2. **AI 高频词超标 6 个（~378 处）**：目光/低声/轻轻/微微/缓缓/深吸，按 v66 文风规范抽样改写
3. **中文引号不配对**（左 440 右 428）
4. **专名零出现 3 个**：鬃吼/腐光/晨天——兽王与暗蚀会首领在正文未出现（可能用别名），晨天城市未出现
5. 上述整改可作为独立"文本治理整改批"（P2-T），工具已就绪，一条命令定位、分批修复、ci 回归

## 六、验证链

```
[PASS] py_compile：elda.py / p2tools_impl.py / nodes_impl.py / budget_impl.py
[PASS] content dup：1609 源定义 0 重复
[PASS] content chain：9 支线全部挚友达标
[PASS] content event/quest：dry-run 模板正确；--commit 实测生成骨架 node --check 通过；入口非对象式安全降级
[PASS] text 五查 + all：全部可运行，报告落盘 docs\p2_text_report.md
[PASS] elda ci：四路一致 + 18 检查器 + 预算门 全绿（游戏零回归）
```

## 七、回滚

- 删除 tools\elda\p2tools_impl.py + elda.py 中 content/text 两段注册（带注释标记）
- 删除 docs\p2_text_report.md
- 无 src 改动，游戏本体不受影响；备份目录 backup\P2_20260909\
