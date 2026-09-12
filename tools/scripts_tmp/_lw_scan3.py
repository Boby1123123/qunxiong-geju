import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_01.js", encoding="utf-8").read()
i1 = t.find("WORLD_EVENTS"); i2 = t.find("EVENT_POOL_EXT")
print("=== WORLD_EVENTS ==="); print(t[i1-60:i1+700])
print("=== EVENT_POOL_EXT 结构样例 ==="); print(t[i2-40:i2+500])
