import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_03.js", encoding="utf-8").read()
i = t.find("eff.loseGold")
print(t[max(0,i-200):i+1500])
