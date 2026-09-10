# -*- coding: utf-8 -*-
# /user-instr:mobile-purge/ 更新 c_map.py：删除移动端适配检查项（用户指令：不做移动端）
import io

P = r"D:\1pao tuan\群雄割据\tools\eldacheck\checks\c_map.py"
with io.open(P, "r", encoding="utf-8") as f:
    src = f.read()

orig = src

# 1) 删除 checks 里的移动端两项
old_checks = """        ('绉诲姩绔?, "overflow-x:auto", '妯悜婊氬姩'),
        ('绉诲姩绔?, 'zoomReset', '閲嶇疆缂╂斁'),
"""
# 直接匹配 UTF-8 原文（文件是 UTF-8 编码，上面乱码是控制台显示问题；用原始字符匹配）
old_a = "        ('移动端适配', \"overflow-x:auto\", '横向滚动'),\n        ('移动端适配', 'zoomReset', '重置缩放'),\n"
if old_a in src:
    src = src.replace(old_a, "", 1)
    print("OK: 删除移动端检查 2 项")
else:
    # 尝试宽松匹配：按行过滤
    lines = src.split("\n")
    out = []
    removed = 0
    for ln in lines:
        if "overflow-x:auto" in ln or "zoomReset" in ln:
            removed += 1
            continue
        out.append(ln)
    src = "\n".join(out)
    print("OK(宽松): 删除移动端检查行", removed)

# 2) 更新检查器 docstring：移动端适配描述 → 已废弃
old_desc = "4. 移动端适配（overflow-x + 触摸滚动 + zoomReset）"
if old_desc in src:
    src = src.replace(old_desc, "4. （移动端适配已按用户指令废弃，不再检查）", 1)
    print("OK: docstring 更新")

with io.open(P, "w", encoding="utf-8") as f:
    f.write(src)
print("OK: c_map.py", len(orig), "->", len(src), "bytes")
