# -*- coding: utf-8 -*-
"""精确括号配平（处理字符串/注释/模板串）"""
import io

def strip_code(s):
    out = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == "/" and i+1 < n and s[i+1] == "/":
            while i < n and s[i] != "\n": i += 1
            continue
        if c == "/" and i+1 < n and s[i+1] == "*":
            i += 2
            while i+1 < n and not (s[i] == "*" and s[i+1] == "/"): i += 1
            i += 2
            continue
        if c in "'\"":
            q = c
            i += 1
            while i < n:
                if s[i] == "\\": i += 2; continue
                if s[i] == q: break
                i += 1
            i += 1
            continue
        if c == "`":
            i += 1
            while i < n:
                if s[i] == "\\": i += 2; continue
                if s[i] == "`": break
                i += 1
            i += 1
            continue
        if c in "{}()[]":
            out.append(c)
        i += 1
    return "".join(out)

src = io.open(r"D:\1pao tuan\群雄割据\game.html", "r", encoding="utf-8").read()
st = src.find("/*=====v47-eng=====*/")
en = src.find("/*=====v47-eng-end=====*/")
seg = src[st:en+len("/*=====v47-eng-end=====*/")]
clean = strip_code(seg)
print("v47 engine braces:", clean.count("{"), clean.count("}"), clean.count("("), clean.count(")"), clean.count("["), clean.count("]"))

# script3 整体
st3 = src.find("<script>", 55600)
# 找第4个script（55633 附近）
import re
scripts = []
pos = 0
while True:
    stx = src.find("<script>", pos)
    if stx == -1: break
    enx = src.find("</script>", stx)
    if enx == -1: break
    scripts.append(src[stx+8:enx])
    pos = enx + 9
s3 = scripts[3]
c3 = strip_code(s3)
print("script3 braces:", c3.count("{"), c3.count("}"), c3.count("("), c3.count(")"), c3.count("["), c3.count("]"))
