import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_03.js", encoding="utf-8").read()
# S.lw 兜底块
i = t.find("lw:")
print("### S.lw 兜底 @", i)
print(t[max(0,i-500):i+700])
