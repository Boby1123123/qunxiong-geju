# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
def show(pattern, label, k=1):
    print('=====', label, '=====')
    for m in list(re.finditer(pattern, d))[:k]:
        s = max(0, m.start()-150)
        print(d[s:m.end()+150].replace('\n', ' ')[:330])
    print()
# 1) window.S 读取上下文
show(r'window\.S\b(?!\.)', 'window.S 读取')
# 2) S 定义
m = re.search(r'(?:let|var|const|window\.)\s*S\s*=', d)
print('S 定义处:', d[max(0,m.start()-100):m.start()+200].replace('\n',' ')[:320])
print()
# 3) N 定义
m = re.search(r'(?:let|var|const|window\.)\s*N\s*=\s*\{', d)
if m:
    print('N 定义处:', d[max(0,m.start()-80):m.start()+150].replace('\n',' ')[:240])
for mm in list(re.finditer(r'window\.N\b', d))[:3]:
    print('window.N 读:', d[max(0,mm.start()-120):mm.end()+80].replace('\n',' ')[:220])
print()
# 4) READINGS_V4 读取
for mm in list(re.finditer(r'window\.READINGS_V4\b', d))[:2]:
    print('window.READINGS_V4 读:', d[max(0,mm.start()-120):mm.end()+80].replace('\n',' ')[:230])
m = re.search(r'(?:const|var|let|window\.)\s*READINGS_V4\s*=', d)
if m:
    print('READINGS_V4 定义:', d[max(0,m.start()-80):m.start()+120].replace('\n',' ')[:220])
print()
# 5) __v45ct 定义
for mm in list(re.finditer(r'__v45ct\s*=', d))[:3]:
    print('__v45ct 定义:', d[max(0,mm.start()-100):mm.start()+60].replace('\n',' ')[:170])
for mm in list(re.finditer(r'window\.__v45ct\b', d))[:2]:
    print('window.__v45ct 读:', d[max(0,mm.start()-120):mm.end()+80].replace('\n',' ')[:230])
