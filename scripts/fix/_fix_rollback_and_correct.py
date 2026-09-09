#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""回滚第二次修复，然后正确分离script内的CSS"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 回滚第二步：删除pos=38382附近的</script>\n<style>\n
rollback_marker = '</script>\n<style>\n'
idx = html.find(rollback_marker)
if idx > 0 and idx < 40000:
    html = html[:idx] + html[idx+len(rollback_marker):]
    print(f"✓ 已回滚错误的标签插入 (pos={idx})")

# 将错误的</style>改回</script>（在原script结束位置）
# 找到第一个<script>之后的第一个</style>
script_start = html.find('<script>')
style_end_in_script = html.find('</style>', script_start)
if style_end_in_script > 0 and style_end_in_script < script_start + 200000:
    html = html[:style_end_in_script] + '</script>' + html[style_end_in_script+len('</style>'):]
    print(f"✓ 已将错误的</style>改回</script> (pos={style_end_in_script})")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

# 现在检查script标签内的内容，找到JS结束、CSS开始的位置
with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

script_start = html.find('<script>')
script_end = html.find('</script>', script_start)
script_content = html[script_start:script_end]
print(f"\nscript标签范围: {script_start} - {script_end}, 长度: {len(script_content)}")

# 找到v35战斗系统CSS开始的位置（在script内）
css_marker = '/* ===== v35 战斗系统样式 ===== */'
css_in_script = script_content.find(css_marker)
if css_in_script > 0:
    abs_css_pos = script_start + css_in_script
    print(f"v35战斗系统CSS在script内的位置: 相对={css_in_script}, 绝对={abs_css_pos}")
    print(f"CSS开始前100字符:")
    print(script_content[css_in_script-100:css_in_script])
    
    # 执行正确的修复：在CSS开始位置插入</script><style>，将后面的</script>改为</style>
    html = html[:abs_css_pos] + '</script>\n<style>\n' + html[abs_css_pos:]
    
    # 找到原来的</script>（现在位置变了）
    new_script_end = html.find('</script>', abs_css_pos + len('</script>\n<style>\n'))
    html = html[:new_script_end] + '</style>' + html[new_script_end+len('</script>'):]
    
    with open('game.html','w',encoding='utf-8') as f:
        f.write(html)
    print(f"\n✓ 正确修复完成")
else:
    print("⚠ 未在script内找到v35战斗系统CSS标记")

# 验证最终结构
import re
with open('game.html','r',encoding='utf-8') as f:
    html2 = f.read()
tags = []
for m in re.finditer(r'<(/?)(style|script)[^>]*>', html2, re.IGNORECASE):
    tags.append((m.start(), m.group()))
tags.sort()
print("\n最终标签顺序:")
for pos, tag in tags:
    print(f"  pos={pos}: {tag[:50]}")
