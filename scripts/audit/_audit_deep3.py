# -*- coding: utf-8 -*-
"""v41 深查2：占位字样上下文/孤立节点抽样/choose实现/入口节点/存档键/eval/S字段"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('='*70)
print('【D】"占位"字样上下文（前12处）')
for m in list(re.finditer(r'占位', html))[:12]:
    p = m.start()
    print('  @%d: %s' % (p, html[p-40:p+20].replace('\n',' ')))

print()
print('='*70)
print('【E】"待补"字样上下文（前12处）')
for m in list(re.finditer(r'待补', html))[:12]:
    p = m.start()
    print('  @%d: %s' % (p, html[p-50:p+30].replace('\n',' ')))

print()
print('='*70)
print('【F】choose() 实现（是否兼容 text: 选项）')
m = re.search(r'function\s+choose\s*\([^)]*\)', html)
if m:
    p = m.start()
    seg = html[p:p+1800]
    # 找选项读取逻辑
    if 'text' in seg and ('o.text' in seg or 'opt.text' in seg):
        print('  ✓ choose 读取 text 字段:', 'o.text' in seg, 'opt.text' in seg)
    else:
        print('  片段中 t/text 相关行:')
        for line in seg.split('\n'):
            if re.search(r'\b(t|text|opt|option)\b', line) and ('||' in line or '=' in line):
                print('   ', line.strip()[:90])
    print('  前300字:', seg[:300].replace('\n',' '))

print()
print('='*70)
print('【G】实际入口节点（newGame 后进入哪里 / 存档读取）')
# newGame 实现
m = re.search(r'function\s+newGame\s*\(', html)
if m:
    seg = html[m.start():m.start()+2500]
    starts = re.findall(r'(?:curNode|goTo|jumpTo|startNode)\s*=\s*"([^"]+)"', seg)
    print('  newGame 内设置起始节点:', starts)
    # 找 N[ 调用
    calls = re.findall(r'N\["([^"]+)"\]\s*\(', seg)
    print('  newGame 内调用节点:', calls[:10])
# saveGame/loadGame 存档键
m = re.search(r'function\s+saveGame\s*\(', html)
if m:
    seg = html[m.start():m.start()+1500]
    keys = re.findall(r'localStorage\.setItem\(\s*["\']([^"\']+)', seg)
    print('  saveGame 键:', keys)
m = re.search(r'function\s+loadGame\s*\(', html)
if m:
    seg = html[m.start():m.start()+2000]
    keys = re.findall(r'localStorage\.getItem\(\s*["\']([^"\']+)', seg)
    print('  loadGame 键:', keys)

print()
print('='*70)
print('【H】eval 上下文')
for m in re.finditer(r'\beval\s*\(', html):
    p = m.start()
    print('  @%d: %s' % (p, html[p-60:p+80].replace('\n',' ')))

print()
print('='*70)
print('【I】S 实际字段（S.xxx 出现>2次的前40个）')
from collections import Counter
fields = Counter(re.findall(r'\bS\.([A-Za-z_]\w*)', html))
for k,v in fields.most_common(40):
    print('  S.%-22s %d' % (k, v))
