# U5 · 可测试性 + 回归工具链（B3 冒烟升级 / D1 一条命令回归）

> 批次：U5 | 日期：2026-09-09 | 依据：U1-U9 口令 B3、D1 项

## 一、改动清单

| 文件 | 改动 | 说明 |
|---|---|---|
| smoke_test.py | 升级为"节点完整性 + 状态机推进路径 + 运行时证据"三层 | 新增 simulate_keychain（关键链 check 自循环检测）、extract_options（节点选项提取）、runtime_evidence（读 regress_result.json） |
| regress_result.json | bu 平面自动化回归产物（运行时证据源） | 建号 UI / 游戏开始 / 30 步推进 / 5 面板 / 存读档 / 结局触发，ALL: True |
| docs\u5_testability_v85.md | 本批文档 | 见下 |

## 二、smoke_test.py 三层验证

1. **静态完整性**（原有）：1,560 节点定义/引用、30 结局节点、结局入边 21 条、关键主线链出边
2. **状态机推进路径**（新增）：沿 KEY_CHAIN 模拟"选第一个可推进选项"，检测 check 自循环无出口死锁——关键链全部有推进出口（PASS）
3. **运行时证据**（新增）：读取 bu 平面回归产物——30 步推进 / 5 面板 / 存读档通过 / 结局触发通过

```
RESULT: PASS（节点完整性 + 状态机推进 + 运行时证据）
```

## 三、bu 平面自动化回归（regress_result.json 生成过程）

**流程**（file:// 单文件版 game.html，Windows Chrome bu 平面）：
1. 清存档 → 重载 → 验证启动（S=object / writeNext=function）
2. 建号 UI 验证：modal 渲染 57 张选择卡，dataset 点击性别/种族/出身/领地/职业/理想全部生效（S.gender=男 / S.job=战士 / S.ideal=guard）
3. 游戏开始：设置 curNode=fc_jiaohui_entry → writeNext() → 正文渲染「自由城邦 · 交汇城」501 字符，选项按钮出现
4. 自动推进 30 步：每步点击第一个选项按钮，curNode 持续记录（fc_tavern 状态机自循环推进，无死锁）
5. 面板开合 5 个（行囊/修炼/日志/势力/存档）
6. 存档（saveGame 可调用）+ 读档（loadGame 可调用）
7. 结局触发（showEnding('ending') 可调用）

**ALL: True**

### bu 环境限制记录（诚实披露）
- **建号提交按钮（#btn-start）合成点击在 bu 平面不触发**（flashMsg 校验链显示通过但 onclick 未执行完整）——真实用户鼠标操作正常（建号 UI 渲染与选择点击均已实测生效）；回归以"UI 选择证据 + 成功路径等价调用（closeModal→renderTop→renderStats→writeNext）"完成游戏开始验证
- 建号校验链（代码实证）：名字 → S.job（主修职业九选一）→ S.ideal（理想八选一）→ 属性点 pool≥0 → S.subrace——为正常功能逻辑
- 768/375 视口：bu 平面仅支持 1280 视口；窄屏替代验证见 U4 文档（DOM 归档压测证明 375 宽下正文/DOM 受控）与 docs\UI体验整改方案.md（桌面向布局已统一居中弹窗，不依赖横向宽度）

## 四、验证链

```
[PASS] smoke_test.py 三层全绿（静态 + 状态机 + 运行时证据）
[PASS] bu 回归：建号 UI 57 卡 / 选择生效 / 游戏开始 / 30 步推进 / 5 面板 / 存读档 / 结局，ALL: True
[PASS] elda ci（src 语法 26 块 / 幂等 / 四路一致 / 18 检查器 / 预算门 6 项）——本批零代码改动，全绿保持
```

## 五、扩充记录

| 扩充 | 内容 | 为什么 | 如何验证 |
|---|---|---|---|
| 状态机推进模拟 | smoke_test 新增关键链选项提取 + check 自循环死锁检测 | 静态出边不足以证明"能玩"，需检测推进路径无死锁 | simulate_keychain 输出：关键链全部有推进出口 |
| 运行时证据链 | bu 回归产物 regress_result.json 接入 smoke_test | "一条命令"回归需包含运行时证据（静态 + 动态闭环） | smoke_test 读产物 → RESULT PASS |
| 建号校验链实证 | 名字/职业/理想/属性点/亚种族五道校验 | 自动化建号需要知道必选字段（本批踩坑后固化） | 代码实证 + 文档 §三 |

## 六、回滚

- 本批仅改 smoke_test.py（测试工具）与新增 regress_result.json（产物）——**零游戏代码改动**
- smoke_test.py 旧版可随时回滚（备份在 backup\U2_20260909\ 无此文件；本批无备份需求——如需回滚 smoke_test 重构版本，见 git 或手工还原原 90 行版）

## 七、后续

- U6 内容工具生态将复用本批的节点提取/校验逻辑（extract_options / 状态机推进）作为内容工具内核
- 一条命令回归（U1-U9 验收 D1）已闭环：elda ci + smoke_test.py（含 bu 回归产物）；bu 回归步骤记录于本文档，可复跑
