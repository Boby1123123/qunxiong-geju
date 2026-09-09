# -*- coding: utf-8 -*-
"""探查 game.html 技术现状：script结构/存档/现代特性/初始化"""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()
n = len(html)
print('总大小: %.2f MB (%d 字符)' % (n/1024/1024, n))
print('script开标签: %d / 闭合: %d' % (html.count('<script'), html.count('</script>')))
print('style 开标签: %d / 闭合: %d' % (html.count('<style'), html.count('</style>')))

# 现代特性（固定字符串）
feats = ['indexedDB','new Worker','serviceWorker','fetch(','AudioContext','<canvas','WebSocket','import(','Blob(','FileReader','localStorage','sessionStorage','requestAnimationFrame','setInterval','onerror','defer','async']
for f in feats:
    print('%s: %d' % (f, html.count(f)))

# localStorage 键
from collections import Counter
keys = Counter(re.findall(r'localStorage\.\w+\(\s*["\']([^"\']+)', html))
print('localStorage 键:')
for k,v in keys.most_common(15):
    print('  %-44s %d' % (k, v))

# 存档实现概览
for fn in ['saveGame','loadGame','newGame','writeNext','choose']:
    m = re.search(r'(?:function\s+%s\b|%s\s*=\s*(?:function|\())' % (fn, fn), html)
    if m:
        seg = html[m.start():m.start()+600]
        print('--- %s @%d ---' % (fn, m.start()))
        print('  片段:', seg[:200].replace('\n',' '))
