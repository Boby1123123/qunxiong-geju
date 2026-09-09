#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""逐段解析找到语法错误位置"""

with open('_chk0.js','r',encoding='utf-8') as f:
    content = f.read()

# 尝试逐行增加，找到第一个出错的行
lines = content.split('\n')
import subprocess
import tempfile
import os

for i in range(1, len(lines)+1, 10):
    test_code = '\n'.join(lines[:i])
    with open('_test_syntax.js','w',encoding='utf-8') as f:
        f.write(test_code)
    result = subprocess.run(['node','--check','_test_syntax.js'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"第{i}行开始出错: {result.stderr[:200]}")
        # 细化
        for j in range(max(1,i-10), i+1):
            test_code = '\n'.join(lines[:j])
            with open('_test_syntax.js','w',encoding='utf-8') as f:
                f.write(test_code)
            result = subprocess.run(['node','--check','_test_syntax.js'], capture_output=True, text=True)
            if result.returncode != 0:
                print(f"  精确到第{j}行: {result.stderr[:200]}")
                print(f"  该行内容: {lines[j-1][:80]}")
                if j > 1:
                    print(f"  上一行: {lines[j-2][:80]}")
                break
        break
else:
    print("所有行都通过了语法检查")
