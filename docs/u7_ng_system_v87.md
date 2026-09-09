# U7 · 多周目系统（C2 多周目）

> 批次：U7 | 日期：2026-09-09 | 依据：U1-U9 口令 C2 项

## 一、改动清单

| 文件 | 位置 | 改动 |
|---|---|---|
| src\script_10.js（新增 4.7KB） | 新文件（第 27 个 src 块） | u7 多周目模块：u7_ngRecord / u7_ngInherit / u7_ngPanel |
| src\script_03.js | showEnding（L3815 后 / 结局按钮区） | 挂载 u7_ngRecord(id) + 「周目回顾」按钮 |
| src\script_03.js | newGame（S=emptyState() 后） | 挂载 u7_ngInherit() |
| src\script_09.js | v66inj:cast 锚点 | 群像档案 16 条（W66_PROFILES 四件套，数据来自 STRONG_V53 真实强者名录） |
| tools\eldacheck\checks\c_cast.py | 正则 | 支持 window.W66_PROFILES 前缀 |
| budget.json | baseline | 6,026,253 → 6,029,422（两轮 U7 合法增长） |

## 二、多周目系统设计（C2）

### 字段（v76 已预留，本次接通）
- `S.ngPlus`：周目号（新周目 +1）
- `S.endingsCollected`：结局图鉴（去重）
- `S.runHistory`：往世快照（上限 12 条，只存小字段：name/job/ending/day/gold/rep/realm/ideal）

### 三函数
| 函数 | 触发 | 行为 |
|---|---|---|
| u7_ngRecord(id) | showEnding 结局时 | 结局入图鉴（去重）+ 本局快照入 runHistory + **持久化跨周目档案 elda-ngplus-v2**（collected/history/ng） |
| u7_ngInherit() | newGame 时 | 从档案恢复图鉴/历史，ngPlus+1；**不继承**属性/金钱/物品/势力（新周目从零开始，保持玩法） |
| u7_ngPanel() | 结局页「周目回顾」按钮 | 弹窗显示：周目号、已收集结局数、结局图鉴徽章、往世足迹列表 |

### 关键设计（踩坑修复）
- **继承权威源 = localStorage 档案**（非旧 S 对象）：newGame 流程 `S=emptyState()` 会先清空 S，旧 S 对象不可用——故结局时写盘档案，新周目从档案恢复（跨刷新/清档仍可靠）
- **不改变**：结局判定（computeEnding）、存档结构、saveVersion=48、applyDefaults 兜底链

## 三、群像档案补全（历史欠账修复）

- **背景**：v66 设计 16 档案（W66_PROFILES 四件套）**从未落地**（window.W66_PROFILES 恒空），eldacheck c_cast 检查器持续验收——本次补全
- **数据来源**：STRONG_V53 真实强者名录（13 职业组 40+ 角色）精选 16 位：文森·金秤/秦·长风/罗·断江（P1-2 三支线对象）+ 各职业领衔强者 + 两位初代神（寂光/戈）
- **每档四件套**：habit（习惯）/ tagline（口头禅）/ desire（渴望）/ goal（目标）——世界观合规
- **验证**：检查器 16 条全匹配（含 window. 前缀正则兼容）

## 四、验证链

```
[PASS] elda ci 全绿（26 块语法 / 幂等 / 四路一致 / 18 检查器 / 预算门 6 项）
[PASS] bu 实测：结局记录 → 图鉴 ['seal'] + runHistory 1
[PASS] bu 实测：newGame → ngPlus=2 + endingsCollected=['seal'] 跨周目继承
[PASS] bu 实测：结局页「周目回顾」按钮存在 + 面板可开（周目号/图鉴/往世显示）
[PASS] W66_PROFILES 16 条全匹配（c_cast 检查器）
```

## 五、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| 跨周目档案持久化 | elda-ngplus-v2 localStorage 档案 | emptyState 先清 S，继承需可靠权威源 | 清档重载后继承仍正确 |
| 往世快照 | runHistory 只存小字段（上限 12） | 防存档膨胀 | 快照字段白名单 |
| 结局图鉴徽章 | 面板以 ENDINGS.cn 显示中文结局名 | 可读性 | 面板实测 |
| 群像 16 档案 | STRONG_V53 真实角色四件套 | 修复 v66 历史欠账，检查器验收 | c_cast 16 条匹配 |

## 六、回滚

- 删除 src\script_10.js + script_03.js 三处挂载（/u7inj: 标记）+ script_09.js cast 块（/u7inj:cast/ 标记）
- 检查器正则与 budget.json 回退
- 备份参考：backup\U7_20260909\（如有需要可重建）

## 七、后续

- U8 NPC 生态将复用 W66_PROFILES 16 档案（v66_castProfile 查询）做好感支线深化
- 多周目继承策略（图鉴/历史）为后续"周目奖励/难度递增"预留扩展点
