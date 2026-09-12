import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
# 1. c_world.py 完整（市场商品 + W64）
t = open("tools/eldacheck/checks/c_world.py", encoding="utf-8").read()
print("### c_world.py")
print(t[:2200])
