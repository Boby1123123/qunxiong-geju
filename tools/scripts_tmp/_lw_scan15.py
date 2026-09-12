import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_03.js", encoding="utf-8").read()
i = t.find("/lw1inj:defaults/")
print(t[i:i+1200])
