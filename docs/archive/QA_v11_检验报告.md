# 《艾尔达大陆：群雄割据》v11 检验报告

**版本**: v11「八大系统深度扩展」
**日期**: 2026-09-06
**构建产物**: game.html (1,881,494 字节)

---

## 一、新增内容

### 1. 方向二十五：黄林晶遗产全大陆寻宝线
- **数据**: `HLJ_TREASURES` — 12件遗产（断剑·诛邪/萨满鼓/精灵之友徽章/锻造锤/航海罗盘/时光沙漏/封印笔记/怀表/空间戒指/法神之冠/隐形斗篷/铸印核心），每件有线索/描述/能力/位置
- **数据**: `HLJ_CLUES` — 12条对应线索
- **节点**: `hlj_clue_found`（发现线索，tier化判定）、`hlj_treasure_hunt`（寻宝总览，动态显示已找到数量）
- **机制**: 集齐9件触发法神之冠幻影，集齐11件解锁铸印核心位置

### 2. 方向二十六：十大神系信仰系统
- **数据**: `FAITHS` — 16个信仰（10大主神系+4小信仰+2半神信仰），每个有信徒人数/领域/联盟/敌对/祝福/诅咒
- **数据**: `PIETY_TIERS` — 5档供奉等级（无名/初信/虔信/狂信/神眷）
- **节点**: `faith_shrine`（神庙供奉，tier化祈祷判定）、`faith_blessing`（神恩反馈）、`faith_overview`（信仰总览）、`faith_info`（信仰介绍）
- **机制**: 供奉值0-100，对应区域判定加成，对立神系降低供奉值

### 3. 方向二十七：家族与贵族政治博弈网
- **数据**: `NOBLE_HOUSES` — 12大家族（铁拳/北风/石墙/金鳞/丝织/通商/美第奇/智者/圣光/银叶/熔炉/血牙），每个有权力/财富/军力/影响力/格言/联盟/敌对/联姻/族长/继承人/秘密
- **数据**: `HOUSE_RELATIONS` — 联姻网/血仇/秘密同盟三层关系
- **节点**: `noble_court`（贵族社交场，tier化观察判定）、`noble_action`（情报运用）、`noble_choose_house`（家族选择）、6个家族专属节点（noble_ironfist/medici/goldscale/church/elf/dwarf）
- **机制**: 情报可换金钱/好感，家族秘密可用于勒索或结盟

### 4. 方向二十九：地下世界犯罪帝国经营
- **数据**: `CRIME_EMPIRE` — 等级/地盘/收入/热度/手下/生意/声望
- **数据**: `CRIME_RANKS` — 5级（街卒→打手→头目→掌柜→教父），每级解锁不同生意和手下上限
- **数据**: `CRIME_BUSINESSES` — 7种生意（扒手团/保护费/赌场/酒馆/走私/青楼/洗钱）
- **节点**: `underworld_entrance`（地下入口，tier化接头）、`underworld_job`（执行委托）、`underworld_info`（购买情报）、`underworld_fence`（销赃）、`underworld_recruit`（招募手下）

### 5. 方向三十：法律与司法审判辩护系统
- **数据**: `LEGAL_SYSTEM` — 犯罪等级/通缉等级/记录/辩护技能/证据
- **数据**: `CRIME_DEFINITIONS` — 8种罪名（盗窃/伤人/走私/谋杀/异端/叛国/欺诈/亡灵魔法），每种有等级/罚金/刑罚/辩护方向
- **数据**: `TRIAL_STAGES` — 5阶段（逮捕→羁押→庭审→判决→执行）
- **节点**: `court_arrest`（逮捕，tier化反抗/逃跑判定）、`court_detention`（羁押，越狱判定）、`court_trial`（庭审，tier化自行辩护判定）
- **机制**: 配合逮捕保留辩护空间，越狱成功但通缉等级上升

### 6. 方向三十一：医疗与大陆疫病线
- **数据**: `PLAGUES` — 4种疫病（灰死病/赤热疫/黑腐病/白盲症），每种有源头/传播途径/死亡率/潜伏期/症状/5阶段/治疗方法/传播区域/传播率
- **数据**: `MEDICAL_SKILLS` — 6种医疗技能（诊断/药剂学/外科/隔离防疫/神圣治愈/民间偏方）
- **节点**: `plague_outbreak`（疫病爆发，tier化调查判定）、`plague_heal`（治疗，tier化配药判定）、`plague_response`（防疫响应）
- **机制**: 黑腐病与深渊封印松动关联，白盲症失明但获得特殊感知

### 7. 方向三十二：交通与飞空艇航线经营
- **数据**: `AIRSHIP_ROUTES` — 9条航线（交汇城-圣城/北境/金鳞城/精灵王庭/铁峰堡/兽人草原/承天书院/深渊神殿/精灵-矮人），每条有距离/票价/货运价/航程/危险度
- **数据**: `AIRSHIP_TYPES` — 5种飞空艇（小型/商用/军用/豪华/巨舰），每种有载客/载货/速度/价格/升级槽
- **数据**: `AIRSHIP_EVENTS` + `SKY_EVENTS_POOL` — 6种天空事件（风暴/空盗/巨兽/故障/偷渡者/神迹之风）
- **节点**: `airship_dock`（码头）、`airship_routes`（航线表）、`airship_book`（购票）、`airship_cargo`（货运）、`airship_buy`（购艇）、`airship_travel`（飞行，tier化感知判定）、`airship_event`（天空事件，tier化应对）、`airship_arrive`（到达）
- **机制**: 500金龙可购小型飞空艇，深渊神殿航线危险度80%

### 8. 综合系统入口
- **节点**: `city_systems` — 城市系统菜单，统一入口访问以上全部系统

---

## 二、v10.5 剧情动态化全量推广（本轮完成收尾）

### i文件 tier 化改造完成
- **63/63 check选项全部tier化**（分4批：i1=11神器+守望者 / i2=10战争 / i3=16战争+强盗 / i4=17身世+循环+魔法+墨丘利）
- 修复3处`function:{`缺括号
- 修复127对中文文本嵌套ASCII双引号→「」
- 全文件check选项tier化总完成：f=61/g=18/h=106/i=63 + b/c/d/e约195 = **全部440+选项**

---

## 三、校验结果

| 校验项 | 结果 |
|--------|------|
| `python build_elda.py` | ✅ 1,881,494 字节 |
| `python static_check_elda.py` | ✅ ERRORS: 0 / WARNS: 2（city_free/travel为引擎动态节点） |
| `node --check _s0.js` | ✅ PASS |
| `node --check _s1.js` | ✅ PASS |
| `node --check _s2.js` | ✅ PASS |
| `node --check _s3.js` | ✅ PASS |
| 节点总数 | 563（+35） |
| 选项总数 | 1223 |
| 浏览器回归（faith_shrine/noble_court/airship_dock） | ✅ 0控制台错误，文本正常显示 |

---

## 四、已测路径

1. **建号 → 信仰系统**: 设置角色→跳转faith_shrine→显示当前信仰和供奉值→选项正常
2. **贵族社交场**: 跳转noble_court→文本显示→观察判定选项显示成功率
3. **飞空艇码头**: 跳转airship_dock→码头文本显示→航线/购票/货运/购艇选项
4. **i文件战争线**: 跳转i_war_iron_gate→大成功判定演出正常→自然衔接i_war_defense_council

---

## 五、文件结构

```
群雄割据/
├── game.html              # 主交付物（1.88MB，563节点，1223选项）
├── build_elda.py          # 权威组装源
├── engine_elda.py         # 引擎卷（含v10.5 pickV/tierArr/text函数化/effect归一化）
├── mech_elda.py           # 机制卷（NPC离线生活/六动作/图鉴/锻造/世界时钟）
├── static_check_elda.py   # 校验链
├── STYLE_GUIDE.md         # 综合性文笔风格指南
├── story_elda_a.py        # 基础数据卷（种族/职业/境界/货币/坐标/交通）
├── story_elda_b.py        # 序章/自由城邦
├── story_elda_c.py        # 北方/南方/精灵/矮人
├── story_elda_d.py        # 兽人/东部/教会/沙漠/世界事件
├── story_elda_e.py        # 秘密/仪式/结局/旅行事件/战斗文本
├── story_elda_f.py        # 战斗/NPC支线/城市事件/暗蚀会线
├── story_elda_g.py        # 七印/地标/神系/半神/四邪神/七使者
├── story_elda_h.py        # 派系/学院/种族/半神试炼/地下世界/结局
├── story_elda_i.py        # NPC羁绊/神器/战争/守望者/身世/魔法学派/时间循环
├── story_elda_j.py        # ★v11新增：黄林晶遗产/信仰/家族/地下世界/法律/疫病/飞空艇
├── docs/
│   ├── QA_v6~v10_检验报告.md
│   ├── DESIGN_v9.md
│   └── game_full.md
└── backups/
    └── game_v1_backup.html
```

---

## 六、剩余缺口

1. **city_systems入口**: 需在城市自由行动节点中添加「系统菜单」选项，让玩家可从正常游戏流程访问新系统
2. **c/d文件少量未tier化**: c约8个/d约7个check选项尚未tier化（优先级低）
3. **LLM文笔增强层**: 设计已形成但未实现（需用户指定API endpoint/key）
4. **飞书GDD**: v10/v11日志和game.html附件待更新
5. **新系统深度剧情**: 当前为系统骨架+基础节点，每个方向可继续扩充专属剧情线和判定链

---

## 七、构建命令

```bash
python build_elda.py          # 构建 game.html
python static_check_elda.py   # 静态校验（目标0错误0警告）
```
