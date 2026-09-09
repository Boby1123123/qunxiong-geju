#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用位置提取script 0的完整内容"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# script 0开始于pos 93311（<script>之后），结束于pos 110019（</script>之前）
script_start = html.find('<script>', 93300)
script_end = html.find('</script>', script_start)
print(f"script 0: {script_start} - {script_end}, 长度: {script_end - script_start}")

# 提取完整内容（跳过<script>标签）
content_start = script_start + len('<script>')
content = html[content_start:script_end]
print(f"内容长度: {len(content)}")

with open('_chk0_full.js','w',encoding='utf-8') as f:
    f.write(content)

# 检查内容中是否有</script>字符串
if '</script>' in content:
    print("⚠ 内容中包含</script>字符串！")
    pos = content.find('</script>')
    print(f"  位置: {pos}")
    print(f"  附近内容: {content[pos-50:pos+50]}")

# 语法检查
import subprocess
result = subprocess.run(['node','--check','_chk0_full.js'], capture_output=True, text=True)
print(f"\n语法检查: {'通过' if result.returncode == 0 else '失败'}")
if result.returncode != 0:
    print(result.stderr[:500])
