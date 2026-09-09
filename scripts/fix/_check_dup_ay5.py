# -*- coding: utf-8 -*-
"""检查 academy_year5_intro 两次定义的内容与位置"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
pat = re.compile(r'N\["academy_year5_intro"\]\s*=\s*function\(\)\{return\{.*?\n\}\};', re.S)
ms = list(pat.finditer(html))
print('定义次数:', len(ms))
for i, m in enumerate(ms):
    seg = m.group(0)
    print('--- 定义%d @%d 长度%d ---' % (i+1, m.start(), len(seg)))
    # 提取文本前两句
    txts = re.findall(r'"([^"]{10,60})"', seg)
    print('文本片段:', txts[:3])
    opts = re.findall(r'\{t:"([^"]+)", go:"([^"]+)"\}', seg)
    print('选项:', opts[:6])
    if 'v37占位' in seg or '待补充' in seg:
        print('★含占位标记')
    print()
