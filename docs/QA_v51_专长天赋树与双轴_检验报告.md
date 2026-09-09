# QA_v51 检验报告 · 专长天赋树 + 神性/深渊双轴

版本：v51（在 v50 破境后专属剧情基础上）
日期：2026-09-07
范围：方向一（专长天赋树）+ 方向五（神性/深渊双轴）全量深度开发

## 一、开发范围与交付内容

### 1. 引擎层（game.html 新增，IIFE 封装，不污染 S 命名空间之外）
- `FEATS_V51` 数据对象 + 注入锚点 `/*v51inj:feats*/`
- `v51_ensureDefaults()`：S.featPoints / S.feats / S.piety / S.corruption / S.axisDaily / S.axisMilestones 旧档兜底
- `v51_axisStatus()`：双轴实时状态 + 道路称号（天平行者 / 圣辉初显 / 圣辉长明 / 深渊低语 / 深渊凝视）
- `v51_checkMilestones()`：神性/深渊跨 40/70 阈值时触发里程碑提示（flashMsg + ToastCenter，单次去重）
- `v51_axisAct('piety'|'abyss')`：践行戒律（神性+5）/ 冥思镇渊（深渊-3），按游戏日（S.day）限一次
- `v51_onBreakthrough(realm)`：破境成功 +1 专长点（挂接 v49_finish 成功分支，v50_aftermath 之后）
- `v51_featPanel()`：修行面板（三段式 modal，双轴进度条 + 专长点 + 三树总览 + 双轴行动 + 返回）
- `v51_treeView(bid)`：单树视图（6 级节点、已习得 ✓、前置/毕业门槛提示）
- `v51_pickFeat(bid, lv)`：习得/卸下（1 点/级，卸下返还；跳级拒绝；前置链校验）
- 入口：顶栏新增「🧭修行」按钮（renderTopBar）

### 2. 内容层（162 个专长节点，9 职业 × 3 树 × 6 级）
树名与 SUBSYSTEM_V48.general 前三分支对齐，每节点含 lv/cn/desc/eff：
- 魔法师：元素使 / 咒法者 / 秘法学者
- 灵魂法师：通灵者 / 催眠师 / 缚魂者
- 术士：炼金术士 / 锻造师 / 魔械师
- 战士：狂战士 / 武器大师 / 盾卫
- 骑士：圣武士 / 护教骑士 / 巡游骑士
- 游侠：猎人 / 巡林者 / 哨探
- 盗贼：刺客 / 夜盗 / 密探
- 牧师：治疗师 / 审判官 / 圣战士
- 商人：商贾 / 钱庄主 / 拍卖师

效果设计：1-5 级按属性/资源成长（INT/STR/AGI/SPR/CON/CHA + maxHp/maxMp/maxSan），每节点写入 `S.flags['v51_<职业>_<树id>_<lv>']`；第 6 级毕业专长需前五级圆满 **且**（神性≥40 或深渊≥40），双轴门槛落地。

### 3. 双轴设计
- 神性：践行戒律（按日限 1 次，+5）；深渊：冥思镇渊（按日限 1 次，-3，与 v48.8 S.corruption 复用同一字段）
- 里程碑：40 圣辉初显 / 70 圣辉长明；40 深渊低语 / 70 深渊凝视
- 与专长树联动：毕业专长门槛；与 v47 结局合成、v48.8 深渊线（need:60）后续可对接

## 二、存档兼容（硬约束核对）
- localStorage 主键 `elda-qunxiong-v3-save` 未改动
- 新增 S 字段全部走 `v51_ensureDefaults()` 兜底（旧档 loadGame 后首次调用即初始化）
- S.saveVersion 未升（保持 48，与 v50 一致）
- v49/v50 所有行为不受影响（挂点追加在 v50_aftermath 之后，try/catch 包裹）

## 三、构建验证（全量，顺序执行）
1. 开工备份：`backup\game_v51_before_feats.html` ✓
2. `python _v39_extract.py`：6 个 script 抽取成功 ✓
3. `node --check _chk_0..5.js`：6/6 PASS ✓
4. `python _check_dead_links.py`：节点 2840 / go 6357 / **死链 0** ✓
5. 占位检查：仅 writeNext 兜底 1 处（允许）✓
6. `python _v42_build_chunks.py`：8 分片 + NODE_MAP(2189 条) 重建 ✓
7. `python _v42_verify_chunks.py`：0 缺失 / 0 多余 / 死链 0 / 占位 1（允许）✓
8. `python _v42_chk_syntax.py`：15 JS 全 PASS ✓
9. 三路同步：game.html = game_check.html = 7,056,273 字节；index.html = 2,504,571 字节 ✓

## 四、浏览器回归（bu 平面，file:// 真实运行）
| 用例 | 结果 |
|---|---|
| FEATS_V51 数据完整性 | ✓ 9 职业 / 27 树 / 162 专长 / allSix / 162 eff 函数 |
| 引擎函数存在性 | ✓ 7/7 |
| 默认值兜底 | ✓ featPoints=0, piety=0, corruption=0 |
| 破境加点 | ✓ v51_onBreakthrough → +1 专长点 |
| 习得专长 | ✓ 消耗 1 点、S.feats 记录、INT+2、flag 置位 |
| 跳级拒绝 | ✓ lv4 在 lv2 未习得时被拒 |
| 卸下返还 | ✓ 专长点 +1 |
| 双轴行动 | ✓ 神性 +5×2、深渊 -3（0 下限） |
| 当日限制 | ✓ 同一游戏日第二次被拒 |
| 毕业专长 | ✓ 前五级圆满 + 神性 40 → arcane_6 可习得 |
| 面板渲染 | ✓ 双轴条 + 树总览 + 树视图（1级/前置提示） |
| console | 仅 3 条既有日志 `[V35] Module not found: core`（v50 备份中已存在，上下文一致，非 v51 引入；file:// 下 V35 模块系统加载未注册模块的既有行为） |

## 五、问题处理记录
- 无新增问题。PowerShell 内联 python 中文引号转义失败 1 次（既有已知坑），改用临时脚本文件解决。
- 未使用全文宽松正则替换（v50 教训遵守），内容注入全部经锚点 `/*v51inj:feats*/` 精确 str.replace。

## 六、验收结论
- 专长天赋树：9 职业 × 3 分支 × 6 级全量落地，主动构筑层闭环（专长点获取→树选择→习得/卸下→属性生效）
- 双轴：神性/深渊字段、行动、里程碑、毕业专长门槛、HUD 展示闭环
- 存档兼容：旧档零报错，新字段兜底
- 全链验证绿、分片版同步、四路一致（game.html / game_check.html / index.html / chunks\）

## 七、后续方向（v52+ 预留）
- 专长对判定公式的实际影响（读 S.flags 进入现有技能/检定钩子，使专长从"属性成长"升级为"玩法构筑"）
- 双轴与 v48.8 深渊线（corruption≥60 触发深渊转职）、v47 结局合成（endingFlags 读 piety/corruption）深度对接
- 职业组织线（方向二）、兼职融合（方向三）、职业命运宿敌（方向四）、职业专属装备（方向六）
- 主线/大事件奖励专长点（当前仅破境 +1）
