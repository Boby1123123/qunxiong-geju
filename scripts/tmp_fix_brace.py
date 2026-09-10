# -*- coding: utf-8 -*-
# 删除 v92_openThreadPanel 内残留的孤立 "    }"（4112 行）
import io

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P3, "r", encoding="utf-8", newline="").read()
crlf = raw.count("\r\n") > 0
lines = raw.split("\r\n" if crlf else "\n")

# 定位：pn3 面板关闭按钮前的连续两个 "    }"，删一个
out = []
i = 0
removed = False
while i < len(lines):
    if (not removed and i+1 < len(lines)
            and lines[i].strip() == "}"
            and lines[i+1].strip() == "}"
            and "关闭</button>" in lines[i+2] and "pn3:panel:err" in lines[i+5]):
        # 删第一个（for 循环的闭合保留，删多余的）
        i += 1  # skip this line
        removed = True
        continue
    out.append(lines[i])
    i += 1

if not removed:
    print("FAIL: 未找到残留块"); raise SystemExit(1)
res = ("\r\n" if crlf else "\n").join(out)
io.open(P3, "w", encoding="utf-8", newline="").write(res)
print("OK: 孤立 } 已删除")
