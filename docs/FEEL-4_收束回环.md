# FEEL-4 收束回环（v93）

## 扩充了什么

新增节奏收束节点 + 全批整合：

- **feel_note**（收束）：夜记册子，把集市干果、河边纸船、屋顶晚风、雪原一战、草原篝火串成一页——"日子就是这样，有大动干戈的时候，也有坐在河边看纸船的时候"
- 触发链：三插曲任一完成 → 记册子 → feel_note_done 关闭插曲线
- 蓝图：新弧 arc_feel + nodeIndex 10 条

## 为什么

FEEL 批的最后一环：让插曲有"归档"的落点，而不是无限刷的氛围碎片。feel_note 把整批的节奏体验收拢成一句人生感悟，也标记玩家完成了一个完整的"张弛周期"。

## 如何验证

- `elda ci` 25 检查器全绿（含 c_tags/c_combat/c_pace 战斗与节奏校验）；smoke PASS；四路字节一致
- budget 更新记录：+10 节点后 game.html 增 48B（8871721→8871769），`elda budget --reason` 合法更新后 ci 全绿
- 修复记录：挂载脚本首次在 options 数组右括号后插入产生 `}}` 语法错 → 回滚（git checkout）→ 改为数组 `]` 前插入；tiebi_camp 在 script_02.js 引擎区 → 战斗入口改挂 fc_innkeep 规避红线
- 蓝图 arc_feel 归属 10/10；实测：三插曲 → feel_note → 插曲线关闭
