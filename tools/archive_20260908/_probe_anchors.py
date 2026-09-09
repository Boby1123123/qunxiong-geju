# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
# v45 引擎导出区附近
print('=== v45 引擎结构 ===')
i = d.find('/*=====v45-eng=====*/')
print(d[i:i+300].replace('\n', ' '))
print('...')
# 找 function unlockReading 定义结尾
m = re.search(r'function unlockReading\(id\)\{', d)
if m:
    print('unlockReading 定义:', d[m.start():m.start()+200].replace('\n',' '))
    # 配平找结尾
    start = m.start()
    j = m.end()
    depth = 0
    while j < len(d):
        c = d[j]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                print('定义结束于偏移', j, ':', d[j:j+80].replace('\n',' '))
                break
        j += 1
print()
print('=== v52 引擎 ===')
i = d.find('function v52_jobCn(){')
print(d[i:i+180].replace('\n',' '))
j = i + 18
depth = 0
while j < len(d):
    c = d[j]
    if c == '{': depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            print('v52_jobCn 结尾:', d[j:j+120].replace('\n',' '))
            break
    j += 1
print()
print('=== v45 引擎导出行样例 ===')
for m in list(re.finditer(r'window\.v45\w*\s*=\s*\w+;', d))[:8]:
    print('  ', d[m.start():m.end()])
