# -*- coding: utf-8 -*-
# /user-instr:mobile-purge/ 清理建议文档中的移动端条目（用户指令：不做移动端）
import io

P = r"D:\1pao tuan\群雄割据\docs\文游对标调研与超大型升级建议.md"
with io.open(P, "r", encoding="utf-8") as f:
    src = f.read()

orig = src
reps = [
    ("| 移动端 | ChoiceScript/Ren'Py 移动端成熟 | 移动端 UI 批 1-4 已做 | 持续优化；地图面板需移动端适配 |",
     "| 移动端 | （已按用户指令废弃：不做移动端，仅桌面端） | — | — |"),
    ("- **验证方式**：①面板在各节点正确显示当前状态；②移动端适配；③与现有手记/面板不冲突。",
     "- **验证方式**：①面板在各节点正确显示当前状态；②与现有手记/面板不冲突。"),
    ("  - 移动端适配（缩放/拖拽）。\n", ""),
    ("- **验证方式**：①九域全部正确绘制；②访问新区域后地图高亮更新；③解锁条件与实际节点逻辑一致；④移动端可正常缩放。",
     "- **验证方式**：①九域全部正确绘制；②访问新区域后地图高亮更新；③解锁条件与实际节点逻辑一致。"),
    ("**验收**：回退 10 次状态正确；结局图鉴跨周目累积；属性面板自动刷新；九域地图移动端可用；刷新页面从 session 恢复。",
     "**验收**：回退 10 次状态正确；结局图鉴跨周目累积；属性面板自动刷新；九域地图可用；刷新页面从 session 恢复。"),
]
n = 0
for old, new in reps:
    if old in src:
        src = src.replace(old, new, 1)
        n += 1
    else:
        print("WARN not found:", old[:30])
with io.open(P, "w", encoding="utf-8") as f:
    f.write(src)
print("OK: 替换", n, "处；", len(orig), "->", len(src), "bytes")
