import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_03.js", encoding="utf-8").read()
i = t.find("s.lw")
while i>=0:
    seg = t[max(0,i-80):i+200]
    if "season" in seg and "lw" in seg and "echoes" in seg:
        print("### @", i)
        print(seg)
        print()
        break
    i = t.find("s.lw", i+1)
# v96_optGate effects 处理
j = t.find("effects")
print("### 首个 effects 出现 @", j)
print(t[max(0,j-200):j+600])
