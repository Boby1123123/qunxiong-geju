import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("tools/eldacheck/eldacheck.py", encoding="utf-8").read()
i = t.find("c_refhealth")
print(t[max(0,i-800):i+1200])
