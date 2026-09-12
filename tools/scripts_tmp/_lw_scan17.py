import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("tools/eldacheck/eldacheck.py", encoding="utf-8").read()
# 确认 import 行与 full 末尾
i = t.find("from checks import")
print(t[i:i+900])
