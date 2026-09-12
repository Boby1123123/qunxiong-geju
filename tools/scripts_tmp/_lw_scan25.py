import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_19.js", encoding="utf-8").read()
i = t.find("LW_factionShift")
print(t[i:i+700])
