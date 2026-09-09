# QA_v62_检验报告（内容分片 ChunkLoader）

- 生成时间：2026-09-08 12:49
- 版本范围：V62 内容分片（机制 + 封印线首片 + 验证链扩展）
- 基线：backup\game_v62_before.html

## 一、方案要点

- 分片策略：按前缀规则分区（manifest {片名: {file, prefix}}），首片 seal 封印线 509 节点（~0.79MB）
- 运行时：ChunkLoader（script 标签动态注入，file:// 可行）——加载中排队、加载后 mark、失败提示不中断
- 跳转衔接：writeNext 单点包装——目标节点在未加载分片时先加载再重放渲染（choose/判定/读档全路径覆盖）
- 片文件格式：chunks/v62_seal.js = IIFE + Object.assign(window.N, nodes)（N 已 window 导出，零新机制）
- 存档：零新字段，S.saveVersion=48 不变；读档后 curNode 属分片时自动按需加载

## 二、验证结果

| 验证项 | 结果 | 说明 |
|---|---|---|
| elda full 十一项 | ✅ 全部通过 | 语法/死链（节点 3409 含分片，死链 0）/引用 FAIL 0/marker 重复 0/分片健康（片 1、节点 509、死链复核 0）/s-size/dialog 基线 |
| elda chunks | ✅ | v62 合并视图（内联 509 片节点）→ v42 构建 → 缺失 0 多余 0 死链 0 占位 1 → 语法全 PASS |
| elda sync | ✅ | game=check 7,279,561 字节；chunked=index 3,151,134 字节，一致 |
| node 仿真 _v62_node_sim.js | ✅ ERRCOUNT=0 | loader 执行/manifest/owner 前缀/片合并 N=509/mark/writeNext 包装/未加载片触发 loadChunk 共 9 项 |
| 体积 | ✅ | game.html 8,072,517 → 7,279,561 字节（-0.79MB）；chunked 版保持全量内联 |

## 三、兼容与边界

1. 旧档兼容：存档零字段变更；读档后若 curNode 为 seal 节点，writeNext 自动加载片后渲染
2. 回归副本：game_chunked.html 为全量版（合并视图构建，含封印线），回归完整
3. 幂等：_v62_build_chunks.py 重复跑安全（marker 防重注入；片文件无 seal 定义段时不重写）
4. 失败兜底：片加载失败显示红色提示，不中断游戏主循环
5. 扩展位：manifest 可追加新片（如 academy/city/npc），每片一个前缀规则 + 一个文件

## 四、手动验证清单（file:// 打开 game.html）

1. 新游戏 → 序章 → 学院：正常游玩（片不涉及学院线，零差异）
2. 进入封印线入口：首次跳转 seal 节点时页面短暂加载后继续（script 注入 chunk），console 无错误
3. 封印线内连续多节点跳转：加载一次后不再重复加载（mark 生效）
4. 读档（存档点在封印线内）：读档后自动加载并渲染该节点
5. 删除 chunks/v62_seal.js 临时测试失败提示（测试后恢复文件）

## 五、遗留与后续

1. 浏览器回归未执行（bu 会话超时），手动清单如上
2. 后续分片候选（按体积）：academy 551KB / city 259KB / ending 237KB / h 231KB / npc 217KB——每片一个构建批次即可
3. v63 网络化预留：elda serve / IndexedDB / Supabase 云存档（SaveStore 后端槽位已留）
4. 跨 script 专项剩 2 项（curNode/pool）历史兜底，非本版范围
