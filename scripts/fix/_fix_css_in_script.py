#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复：将script标签内的CSS代码分离出来"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到CSS代码开始的位置
css_marker = '/* ===== v35 战斗系统样式 ===== */'
css_start = html.find(css_marker)
print(f"CSS代码起始位置: {css_start}")

# 检查该位置前后的内容
print(f"\nCSS开始前100字符:")
print(html[css_start-100:css_start])

# 找到当前script 0的结束位置（即之前替换的</script>）
# 它应该在CSS代码之后
script_end = html.find('</script>', css_start)
print(f"\n当前</script>位置: {script_end}")
print(f"</script>前100字符:")
print(html[script_end-100:script_end])

# 修复方案：
# 1. 在CSS开始位置插入 </script>\n<style>
# 2. 将后面的</script>替换为</style>

html = html[:css_start] + '</script>\n<style>\n' + html[css_start:]

# 原来的</script>位置现在变了（因为插入了18字符）
old_script_end = script_end + len('</script>\n<style>\n')
print(f"\n修复后</script>的新位置: {old_script_end}")
print(f"该位置内容: {html[old_script_end:old_script_end+20]}")

# 将</script>替换为</style>
html = html[:old_script_end] + '</style>' + html[old_script_end+len('</script>'):]

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print(f"\n✓ 修复完成")
print(f"文件大小: {len(html)} 字符")

# 验证
import re
with open('game.html','r',encoding='utf-8') as f:
    html2 = f.read()
script_starts = [(m.start()) for m in re.finditer(r'<script[^>]*>', html2, re.IGNORECASE)]
script_ends = [(m.start()) for m in re.finditer(r'</script>', html2, re.IGNORECASE)]
style_starts = [(m.start()) for m in re.finditer(r'<style[^>]*>', html2, re.IGNORECASE)]
style_ends = [(m.start()) for m in re.finditer(r'</style>', html2, re.IGNORECASE)]
print(f"\n修复后: {len(script_starts)} script开始, {len(script_ends)} script结束")
print(f"        {len(style_starts)} style开始, {len(style_ends)} style结束")
