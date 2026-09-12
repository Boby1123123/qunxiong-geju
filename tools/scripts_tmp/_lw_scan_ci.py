import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("tools/elda/elda.py", encoding="utf-8").read()
# 找检查器注册
m = re.findall(r"['\"]?(c_\w+)['\"]?\s*[:=]", t)
seen = []
for x in m:
    if x not in seen: seen.append(x)
print("checkers:", seen[:60])
