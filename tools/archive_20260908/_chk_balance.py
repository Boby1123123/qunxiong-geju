# -*- coding: utf-8 -*-
"""括号配平粗检 + 定位未闭合片段"""
import io, re

for name in ["_chk_3.js"]:
    src = io.open(name, "r", encoding="utf-8").read()
    # 去掉行注释和块注释（简化，块注释不跨字符串处理）
    clean = re.sub(r"//[^\n]*", "", src)
    clean = re.sub(r"/\*[\s\S]*?\*/", "", clean)
    # 去掉字符串字面量（简化：双引号/单引号/模板串）
    clean = re.sub(r"`[^`]*`", '""', clean)
    clean = re.sub(r"'(?:[^'\\]|\\.)*'", '""', clean)
    clean = re.sub(r'"(?:[^"\\]|\\.)*"', '""', clean)
    opens = {"{": 0, "(": 0, "[": 0}
    closes = {"}": 0, ")": 0, "]": 0}
    depth = 0
    stack = []
    line = 1
    for ch in clean:
        if ch == "\n": line += 1
        if ch in "{([":
            stack.append((ch, line))
        elif ch in "})]":
            if not stack:
                print(name, "extra close", ch, "at line", line)
                break
            o = stack.pop()[0]
            if "{[(".index(o) != "})]".index(ch):
                print(name, "mismatch", o, ch, "at line", line)
                break
    print(name, "leftover stack:", stack[-5:] if stack else "balanced-ish", "size=", len(stack))
