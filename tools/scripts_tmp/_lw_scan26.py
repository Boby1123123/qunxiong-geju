import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("game.html", encoding="utf-8", errors="replace").read()
i = t.find("Math.min(1000")
print("pos", i)
print(t[max(0,i-160):i+120].replace(chr(10)," ") if i>=0 else "NOT FOUND")
j = t.find("LW_deed = function")
print("LW_deed @", j)
print(t[j:j+420].replace(chr(10)," ") if j>=0 else "NOT FOUND")
