import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
for f in ["tools/eldacheck/checks/c_chronicle.py", "tools/eldacheck/checks/c_world.py", "tools/eldacheck/checks/c_war.py", "tools/eldacheck/checks/c_causality.py"]:
    try:
        t = open(f, encoding="utf-8").read()
        doc = re.search(r'"""(.*?)"""', t, re.S)
        print("=== " + f + " ===")
        print((doc.group(1) if doc else t[:400])[:450])
        print()
    except Exception as e:
        print(f, "ERR", e)
