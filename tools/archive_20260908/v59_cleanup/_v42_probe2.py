# -*- coding: utf-8 -*-
"""v42 深入探查：script边界/N节点前缀分布/存档面板/写渲染"""
import io, sys, re
from collections import Counter
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

# 1. script 块边界
print('=== script 块边界 ===')
for m in re.finditer(r'<script>', html):
    end = html.find('</script>', m.end())
    print('  <script> @%d → </script> @%d  (长 %d)' % (m.start(), end, end-m.start()))

# 2. N 节点 ID 前缀分布（script2 内，即所有 N["id"] 定义）
print('=== N 节点前缀分布 ===')
ids = re.findall(r'N\["([^"]+)"\]\s*=\s*(?:function\s*\(\)\s*\{return\s*\{|\{)', html)
print('总节点数:', len(ids))
pre = Counter()
for i in ids:
    p = i.split('_')[0] if '_' in i else i
    pre[p] += 1
for k,v in pre.most_common(30):
    print('  %-24s %d' % (k, v))

# 3. v34_openSavePanel / 设置面板
print('=== v34_openSavePanel ===')
m = re.search(r'function\s+v34_openSavePanel', html)
print('v34_openSavePanel @', m.start() if m else '未找到')
if m:
    print(html[m.start():m.start()+1200])
print('=== 设置面板入口 ===')
for fn in ['openSettings','openSetting','v34_openSettings','settingsPanel']:
    m = re.search(r'function\s+%s\b' % fn, html)
    print('%s: %s' % (fn, m.start() if m else '未找到'))

# 4. _v21_orig_writePar 原实现
print('=== _v21_orig_writePar 定义 ===')
m = re.search(r'_v21_orig_writePar\s*=\s*', html)
if m:
    # 向前找 function writePar 或 writePar =
    s = html.rfind('function writePar', 0, m.start())
    if s < 0: s = html.rfind('writePar =', 0, m.start())
    print(html[s:s+600])
else:
    print('未找到 _v21_orig_writePar 赋值')

# 5. applyDefaults
print('=== applyDefaults ===')
m = re.search(r'function\s+applyDefaults', html)
print('@', m.start() if m else '未找到')
if m: print(html[m.start():m.start()+400])

# 6. RULESET_ID 值
m = re.search(r'RULESET_ID\s*=\s*["\']([^"\']+)', html)
print('RULESET_ID =', m.group(1) if m else '未找到')
