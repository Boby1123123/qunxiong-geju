# UPG-17 编年史系统（世界史自适应叙事）

> 批次：UPG-17｜优先级：P2｜依赖：UPG-03/04｜状态：✅ 已实施（elda ci 第 36 检查器）

## 做了什么

借鉴 Heaven's Vault 知识模型（按发现顺序自适应叙事）+ Pendragon 篝火故事，建立编年史系统。

### 数据层（新文件 `src\data_nodes\dn_chronicle.js`）
`const CHRONICLE_RULES = [...]` 20 条自动记录规则（出身/自由城/学院/毕业/金秤真相/七锚/铁牌/封印/神谕/战争/净化令/银穗商路/深渊封印/兽人战争/教会/沙漠/西境/东境/羁绊/终章），每条 `{match, kind(prefix|exact), eventType, desc, importance(1-5)}`，desc 支持 `{n}`/`{homeland}` 占位。

### 引擎层（src\script_03.js，UPG-17 注释区）
- `v92_chronicleAdd(eventType, description, importance)`：写入 `{date, eventType, description, importance, discoveredBy}`，容量 200 滚动。
- `v92_chronicleCheck(node)`：writeNext 渲染节点时按规则表前缀匹配 → 近 30 条去重 → 写入。**玩家没到过的节点不记录**（Heaven's Vault 知识模型核心）。
- `v92_chronicleReview()`：ending_* 节点渲染时生成"艾尔达大陆编年史·片段"，按玩家发现顺序（S.chronicle 数组序）输出 importance≥2 条目，注入正文开头。非结局节点零注入。
- 独立键 `S.chronicle`（applyDefaults 兜底，旧档兼容）。

### 面板（src\script_04.js，v74_openJournal 扩展）
手记面板新增"📜 编年史"分页 tab：按发现顺序列出全部条目（第 N 日 · 类型 · 重要度 + 描述），空态提示；原"手记"分页功能零回归。

### 检查器 c_chronicle（elda ci 第 36）
规则表存在且 eventType 非空 / 三个引擎 API / 记录钩子与结局回顾钩子 / applyDefaults 兜底 / 面板分页——7 项检测，不改变既有 35 项行为。

## 为什么

原 chronicle_main 是静态文本节点（不读任何玩家状态）；战争/天灾/重大抉择结果无人记录。编年史把"世界记住了什么"从固定文案变为**玩家亲历事件的动态回放**，结局回顾按发现顺序叙事强化沉浸与重玩价值。

## 如何验证（已完成）

- `node --check`（26 块）PASS；build→Copy→chunks→sync 四路一致（game=8,419,115B / chunked=5,652,536B）
- `elda ci` 36 检查器全绿（含 c_chronicle；预算门 6 项 PASS）
- `smoke_test.py` PASS
- 验证点：goldscale_/anchor_/warphase_ 等节点推进后 S.chronicle 自动累计；ending_* 渲染注入回顾；手记面板双 tab 切换正常

## 扩充记录

- 扩了什么：20 条编年史规则 + 3 个引擎 API + 结局回顾注入 + 手记面板编年史分页 + 第 36 检查器。
- 为什么：世界史应随玩家发现自适应（Heaven's Vault），而非静态文案；结局回顾强化闭环感。
- 如何验证：规则命中即写入、去重正确、结局注入、面板分页、ci 36 项全绿。
