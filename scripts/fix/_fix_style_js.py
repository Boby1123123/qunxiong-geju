#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复：将style标签内的JS代码移到script标签中"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到JS代码在style内的起始位置
# 标记是 "// ========== 事件总线 ==========" 或 "const V35_EventBus"
js_marker = '// ========== 事件总线 =========='
js_start = html.find(js_marker)
print(f"JS代码起始位置: {js_start}")

# 找到原来的</style>位置
style_end = html.find('</style>', js_start)
print(f"原</style>位置: {style_end}")

# 找到第一个<script>位置
script_start = html.find('<script>', style_end)
print(f"第一个<script>位置: {script_start}")

# 修复方案：
# 1. 在JS代码起始位置插入 </style><script>
# 2. 将原来的</style>替换为</script>

# 先检查JS代码起始位置之前的内容，确保是CSS的结尾
before_js = html[js_start-200:js_start]
print(f"\nJS代码前200字符:")
print(before_js[-150:])

# 执行修复
# 在js_start位置插入 </style>\n<script>\n
html = html[:js_start] + '</style>\n<script>\n' + html[js_start:]

# 原来的</style>现在位置变了，重新找到它（现在它在script标签内，需要替换为</script>）
# 注意：插入了23字符（</style>\n<script>\n），所以style_end位置要+23
old_style_end = style_end + len('</style>\n<script>\n')
print(f"\n修复后原</style>的新位置: {old_style_end}")
print(f"该位置的内容: {html[old_style_end:old_style_end+20]}")

# 将原来的</style>替换为</script>
html = html[:old_style_end] + '</script>' + html[old_style_end+len('</style>'):]

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print(f"\n✓ 修复完成")
print(f"文件大小: {len(html)} 字符")

# 验证修复
with open('game.html','r',encoding='utf-8') as f:
    html2 = f.read()
import re
script_starts = [(m.start(), m.group()) for m in re.finditer(r'<script[^>]*>', html2, re.IGNORECASE)]
script_ends = [(m.start(), m.group()) for m in re.finditer(r'</script>', html2, re.IGNORECASE)]
print(f"\n修复后: {len(script_starts)} 个<script开始, {len(script_ends)} 个</script>结束")
for i, (start, _) in enumerate(script_starts):
    end = script_ends[i][0] if i < len(script_ends) else '?'
    print(f"  script {i}: pos {start} - {end}")
