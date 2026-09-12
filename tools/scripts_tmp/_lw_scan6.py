import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
t = open("src/script_03.js", encoding="utf-8").read()
# 找 lwinj 挂接点
for tag in ["/lwinj:tick/", "/lwinj:render/", "/lwinj:cond/"]:
    i = t.find(tag)
    print("###", tag, "@", i)
    if i>=0:
        print(t[max(0,i-350):i+250])
        print()
