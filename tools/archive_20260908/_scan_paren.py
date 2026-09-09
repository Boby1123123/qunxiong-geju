# -*- coding: utf-8 -*-
"""游标配平：报告深度变化位置，定位第一个括号失衡点"""
import io, sys

def strip_code(s):
    out = []
    i = 0
    n = len(s)
    line = 1
    while i < n:
        c = s[i]
        if c == "\n": line += 1
        if c == "/" and i+1 < n and s[i+1] == "/":
            while i < n and s[i] != "\n": i += 1
            continue
        if c == "/" and i+1 < n and s[i+1] == "*":
            i += 2
            while i+1 < n and not (s[i] == "*" and s[i+1] == "/"): 
                if s[i] == "\n": line += 1
                i += 1
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
            out.append((c, line))
        i += 1
    return out

src = io.open(sys.argv[1], "r", encoding="utf-8").read()
toks = strip_code(src)
stack = []
for idx, (ch, line) in enumerate(toks):
    if ch in "({[":
        stack.append((ch, line, idx))
    else:
        if not stack:
            print("EXTRA", ch, "at line", line, "tokidx", idx)
            break
        o, ol, oi = stack.pop()
        if "({[".index(o) != ")}]".index(ch):
            print("MISMATCH", o, "line", ol, "vs", ch, "line", line)
            break
else:
    if stack:
        print("UNCLOSED:", stack[:8])
        print("last unclosed line:", stack[-1][1])
    else:
        print("BALANCED")
