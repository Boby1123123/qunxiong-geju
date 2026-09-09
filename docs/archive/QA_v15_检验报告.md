# QA_v15 检验报告 — 序章全量深度开发

## 版本信息
- **版本**: v15 序章全量深度开发
- **构建时间**: 2026-09-06
- **主交付物**: `game.html` (2,179,809 字节)
- **节点总数**: 714 (v14.5: 690, +24)
- **选项总数**: 1223
- **RULESET_ID**: `elda-qunxiong-v3`

## 本次新增内容

### 新建文件
- `story_elda_q.py` — 序章全量数据卷+节点 (44,528字节)

### 方向一：出身谱系深度系统 ✅
- 21种细分出身（人类7/精灵4/矮人3/兽人4/半身人1/龙裔1/混血1）
- 每种出身含：初始金币(0-200金龙)、属性修正、技能、入学标签、隐藏线索、起始地点、序章天数
- 捏人界面新增"出身谱系"选择卡，按种族筛选
- 出身效果在建号时自动应用

### 方向二：天赋觉醒事件链 ✅
- 七大职业各有觉醒数据定义
- 通用觉醒节点 `prologue_awakening`：主动拥抱/被动接受/拒绝三种方式
- 觉醒后节点 `prologue_after_awakening` / `prologue_awakening_truth` / `prologue_refuse_awakening`
- 觉醒方式影响属性增益、技能、SAN、教授关注

### 方向三：机遇事件池 ✅
- 12个机遇事件定义（旅行教授/地方比武/突发事件/家族推荐/守望者密探/暗蚀会招募/净化令难民/商路危机/魔法物品共鸣/治愈奇迹/地下世界/老兵导师）
- 每个事件关联可触发的学院
- 在自由探索中通过打听/接近等判定触发

### 方向四：多学院录取抉择系统 ✅
- 6所学院录取数据（艾尔达/承天/圣光/银叶/熔炉/守望者秘密）
- `prologue_admission`节点：根据属性/职业/出身动态显示可用学院
- 每所学院有独立确认节点（prologue_choose_elda等6个）
- 录取通知附带：奖学金/宿舍/导师/入学标签

### 方向五：序章自由探索区域 ✅
- 6个起始地点（交汇城/铁门关/圣城/银叶/铁峰堡/兽人草原）
- 每地5个可交互地点（家/集市/教堂或对应/酒馆/郊外/导师家）
- 非线性探索，每个地点2-3个判定选项
- 序章7-14天时间限制

### 方向六：童年回忆碎片系统 ✅
- 孤儿/没落贵族/默认三套回忆碎片
- 通过"翻找旧物"等判定触发
- 回忆中藏后续剧情伏笔

### 方向七：序章人际关系网 ✅
- 6名序章NPC定义（导师/发小/神秘旅人/酒馆老板/邻家孩子/债主）
- 每人含学院线身份伏笔
- 初始关系值带入后续

### 方向八：序章危机事件 ✅
- 8种危机事件定义（孤儿/商人/贵族/军人/教会/精灵放逐/兽人奴隶/默认）
- `prologue_crisis`节点：四种解决方式（战斗/谈判/逃跑/求助）
- 每种方式tier化判定（crit/ok/fail/critfail）
- 危机结果影响声望/HP/物品/隐藏flag

### 方向九：入学前最后选择 ✅
- `prologue_final`节点：4种选择（正常出发/推迟入学/结伴告别/放弃入学）
- 每种选择有独立后续节点
- 放弃入学可直接进入大陆线（city_free）

### 方向十：序章物品传承系统 ✅
- 6件特殊物品定义（家族传家宝/导师推荐信/神秘钥匙/危机纪念物/古老地图/奇异护符）
- 含觉醒条件和稀有度

### 方向十一：序章世界事件暗线 ✅
- 4大事件×3个地方线索（净化令/银穗商路/深渊封印/学院暗流）
- 在探索地点的文本中自然透露

### 方向十二：多周目差异化 ✅
- 随机种子系统定义（天气/NPC心情/机遇数量/危机强度/隐藏路线概率）

### 引擎改造
- `showOptions()`支持函数式options（`options:function(){return[...]}`），可根据状态动态生成选项
- `emptyState`新增`background:null`字段
- `applyDefaults`新增background默认值
- 建号流程改为从`prologue_start`开始（原`pro_arrive`）
- 建号时自动应用出身谱系效果

## 校验结果

### 构建校验
```
build OK -> game.html bytes: 2,179,809
==================================================
节点总数: 714 | 选项数: 1223 | go 目标: 508
ERRORS: 0
WARNS: 2 (city_free/travel 为既有节点，非新增问题)
RESULT: PASS
```

### JS语法校验
```
node --check _check_0.js  PASS
node --check _check_1.js  PASS
node --check _check_2.js  PASS
node --check _check_3.js  PASS
ALL PASS
```

### 浏览器回归
- **测试1**: 贫民窟孤儿出身序章开始 → 正确显示出身描述，金币=5 ✅
- **测试2**: 没落贵族出身序章开始 → 正确显示出身描述 ✅
- **测试3**: 集市探索 → 正确显示地点和选项 ✅
- **测试4**: 录取抉择节点 → 6个学院选项正确显示（函数式options） ✅
- **测试5**: 每日检查节点 → 危机/录取/继续三选项正确显示 ✅
- **控制台错误**: 0 ✅

## 节点清单（24个新节点）
| 节点ID | 功能 |
|---|---|
| prologue_start | 序章入口 |
| prologue_home | 家（休息/翻找旧物） |
| prologue_market | 集市（打听/打工） |
| prologue_tavern | 酒馆（套话/接近灰袍人） |
| prologue_wild | 郊外（采集/修炼/探索） |
| prologue_mentor | 导师家（指导/询问学院/询问过去） |
| prologue_mentor_past | 导师过去 |
| prologue_daily_check | 每日检查（事件触发） |
| prologue_awakening | 天赋觉醒 |
| prologue_after_awakening | 觉醒后 |
| prologue_awakening_truth | 觉醒真相 |
| prologue_refuse_awakening | 拒绝觉醒 |
| prologue_crisis | 危机事件 |
| prologue_after_crisis | 危机后 |
| prologue_admission | 录取抉择 |
| prologue_choose_elda/chengtian/holy/silverleaf/forge/watcher | 6学院确认 |
| prologue_final | 入学前最后选择 |
| prologue_enroll_normal/delay/companion | 3种入学方式 |
| prologue_status | 序章状态面板 |
| academy_start | 衔接学院线 |

## 剩余缺口
1. **学院线衔接**：`academy_start`目前指向`city_free`，学院线完整内容待v12/k.py的节点与序章对接
2. **机遇事件具体节点**：12个机遇事件目前只有数据定义，部分需在探索中增加具体触发节点
3. **危机事件出身差异化**：目前`prologue_crisis`是通用危机，8种出身专属危机的具体剧情节点待展开
4. **回忆碎片全出身覆盖**：目前只有孤儿/贵族/默认三套，其余出身待补充
5. **多周目继承**：随机种子系统已定义但未完全接入事件抽取逻辑
6. **守望者秘密学院路线**：需要`watcher_invited` flag触发，具体触发条件待细化

## 文件清单
| 文件 | 修改内容 |
|---|---|
| game.html | 主交付物（2,179,809字节，714节点） |
| story_elda_q.py | 新建：序章全量数据+24节点 |
| build_elda.py | 引入NODES_Q |
| static_check_elda.py | 引入NODES_Q校验 |
| engine_elda.py | showOptions支持函数式options+出身谱系+序章开局 |
