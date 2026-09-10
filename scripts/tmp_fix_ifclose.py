# -*- coding: utf-8 -*-
# 修复 v92_openWorldPanel：4218 for 闭合后补 if(npcs) 闭合 "    }"
import io

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P3, "r", encoding="utf-8", newline="").read()
crlf = raw.count("\r\n") > 0
lines = raw.split("\r\n" if crlf else "\n")

out = []
i = 0
fixed = False
while i < len(lines):
    out.append(lines[i])
    # 找 for 闭合行（6 空格 }），其下一行是 close_btn 且行内含"大陆人物动态"
    if (not fixed and lines[i].strip() == "}"
            and i+1 < len(lines) and "关闭</button>" in lines[i+1]
            and "pn3:panel:err" not in "".join(lines[max(0,i-12):i])):
        # 检查上方 12 行内出现过"大陆人物动态"（说明是 wn1 面板的 for 闭合）
        ctx = "\n".join(lines[max(0,i-12):i])
        if "大陆人物动态" in ctx:
            out.append("    }")  # 补 if 闭合
            fixed = True
    i += 1

if not fixed:
    print("FAIL: 未定位需要补闭合的位置"); raise SystemExit(1)
res = ("\r\n" if crlf else "\n").join(out)
io.open(P3, "w", encoding="utf-8", newline="").write(res)
print("OK: if(npcs) 闭合已补")
