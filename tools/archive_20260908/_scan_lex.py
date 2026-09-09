# -*- coding: utf-8 -*-
"""精确 JS 词法扫描：定位第一个未闭合的字符串/模板串/注释"""
import io, sys

def scan(path):
    s = io.open(path, "r", encoding="utf-8").read()
    i = 0
    n = len(s)
    line = 1
    while i < n:
        c = s[i]
        if c == "\n": line += 1
        # 注释
        if c == "/" and i+1 < n and s[i+1] == "/":
            while i < n and s[i] != "\n": i += 1
            continue
        if c == "/" and i+1 < n and s[i+1] == "*":
            st = line
            i += 2
            closed = False
            while i+1 < n:
                if s[i] == "\n": line += 1
                if s[i] == "*" and s[i+1] == "/":
                    closed = True
                    i += 2
                    break
                i += 1
            if not closed:
                print("UNCLOSED BLOCK COMMENT starting line", st)
                return
            continue
        # 字符串
        if c in "'\"":
            q = c
            st = line
            i += 1
            closed = False
            while i < n:
                if s[i] == "\\": i += 2; continue
                if s[i] == "\n" and q != "`": break  # 未闭合
                if s[i] == q:
                    closed = True
                    i += 1
                    break
                i += 1
            if not closed:
                print("UNCLOSED STRING", q, "starting line", st, "char", i)
                return
            continue
        # 模板串
        if c == "`":
            st = line
            i += 1
            closed = False
            while i < n:
                if s[i] == "\\": i += 2; continue
                if s[i] == "`":
                    closed = True
                    i += 1
                    break
                i += 1
            if not closed:
                print("UNCLOSED TEMPLATE starting line", st)
                return
            continue
        i += 1
    print("OK: no unclosed string/comment/template in", path)

scan(sys.argv[1])
