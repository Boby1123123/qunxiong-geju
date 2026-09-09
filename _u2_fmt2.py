# -*- coding: utf-8 -*-
import io, re
html = io.open('game.html', encoding='utf-8', errors='replace').read()

# 1) dbl_other 抽样
others = list(re.finditer(r'N\["([^"]+)"\]\s*=\s*(?!function|\{)', html))
print('dbl_other 总数:', len(others))
shown = 0
for m in others:
    seg = html[m.end():m.end()+80].replace('\n', ' ')
    print(' ', m.group(1), '=>', seg[:70])
    shown += 1
    if shown >= 12:
        break

# 2) ELDA.nodes 注册
i = html.find('ELDA.nodes')
print('\nELDA.nodes 上下文:', html[i-200:i+200].replace('\n', ' ')[:400])

# 3) 另一种可能：N["id"] 定义在 game.html 里分片节点以何种形式存在？
#    检查 chunks 文件里的定义格式
import glob
for f in glob.glob('chunks/*.js')[:3]:
    t = io.open(f, encoding='utf-8', errors='replace').read()
    print('\n', f, '长度', len(t))
    print('  N[".."]=function:', len(re.findall(r'N\["[^"]+"\]\s*=\s*function', t)))
    print('  N[".."]={:', len(re.findall(r'N\["[^"]+"\]\s*=\s*\{', t)))
    print('  其他:', len(re.findall(r'N\["[^"]+"\]\s*=\s*(?!function|\{)', t)))
    print('  总N["出现:', len(re.findall(r'N\["', t)))
    # 看第一个节点定义长啥样
    m = re.search(r'N\["[^"]+"\]\s*=\s*(?!function|\{)', t)
    if m:
        print('  首其他格式:', t[m.start():m.start()+120].replace('\n', ' ')[:110])
