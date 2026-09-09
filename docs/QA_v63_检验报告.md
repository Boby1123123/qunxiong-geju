# QA_v63_检验报告（多片扩容 + 容量评估）

- 生成时间：2026-09-08 13:35
- 基线：backup\game_v63_before.html

## 一、本轮改动

1. 分片扩容：新增 7 片（origin 105 / arc 117 / west 36 / abyss 50 / dun 40 / relic 30 / evt 32 = 410 节点）
2. 构建脚本泛化：_v62_build_chunks.py 多片配置（CHUNKS 表）+ manifest 动态生成 + loader 自动重注入
3. c_markers 白名单泛化（/v62inj:chunk-* 批量替换注释合法）
4. 容量评估文档（docs\容量评估_v63.md）

## 二、验证结果

| 验证项 | 结果 |
|---|---|
| elda full 十一项 | ✅ 全部通过（死链 0 / 引用 FAIL 0 / 分片 8 片 919 节点死链复核 0 / marker 重复 0）|
| elda chunks | ✅ 合并 3409 节点，缺失 0 多余 0 死链 0 占位 1，语法全 PASS |
| elda sync | ✅ game=check 6,673,758 字节；chunked=index 2,980,752 字节 |
| node 仿真 | ✅ 10 项全 PASS（manifest 8 片/owner 多前缀/seal+origin 合并 614/mark 多片/writeNext 包装/按需加载触发）|
| 体积 | ✅ game.html 8.07→6.67MB（累计 -1.4MB，主文件 -17%）；chunked 2.98MB |

## 三、风险与遗留

1. 浏览器回归未执行（bu 会话超时），手动清单：新游戏序章/学院零差异；进入封印线/起源线/西域/深渊任一线首次跳转短暂加载后继续
2. 后续可继续移：academy(344节点 338KB)/city(161节点 152KB)/npc(80节点 86KB)/classmate——移完主文件 ~4-5MB
3. v57 数据结构命名偏差（CAREER_HUB_V57/APPRENTICE_V57）待后续对齐
4. 跨 script 专项剩 2 项（curNode/pool）历史兜底，非本轮范围
