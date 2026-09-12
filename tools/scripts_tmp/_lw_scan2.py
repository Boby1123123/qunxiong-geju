import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# elda.py 检查器注册
t = open("tools/elda/elda.py", encoding="utf-8").read()
idx = t.find("def cmd_ci")
print("=== cmd_ci 区域（检查器注册） ===")
seg = t[idx:idx+4000] if idx>=0 else "NOT FOUND"
print(seg[:3000])
