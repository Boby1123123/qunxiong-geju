import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("tools/eldacheck/eldacheck.py", encoding="utf-8").read()
i = t.find("def load_checks")
print("### load_checks 完整")
print(t[i:i+2600])
