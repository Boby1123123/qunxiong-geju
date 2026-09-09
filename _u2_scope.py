# -*- coding: utf-8 -*-
import io, re, glob
html = io.open('game.html', encoding='utf-8', errors='replace').read()

# 1) chunks 典型节点 id 在 game.html 中是否存在
probe = ['academy_entrance', 'north_king_audience', 'free_lord_manor', 'u1_demo', 'fc_streets']
for pid in probe:
    print(pid, '在game.html:', pid in html, '| 出现次数:', html.count('"' + pid + '"'))

# 2) game.html 里所有 N[" 定义的 id（宽松：任意 N["id"]= 后任意内容）——用平衡括号难，先数定义行
defs = set(re.findall(r'N\["([^"]+)"\]\s*=', html))
print('\ngame.html N["id"]= 定义去重:', len(defs))

# 3) 分片版 index.html 的节点数
idx = io.open('index.html', encoding='utf-8', errors='replace').read()
idefs = set(re.findall(r'N\["([^"]+)"\]\s*=', idx))
print('index.html N["id"]= 定义去重:', len(idefs))

# 4) chunks 全部节点 id
cid = set()
for f in glob.glob('chunks/*.js'):
    t = io.open(f, encoding='utf-8', errors='replace').read()
    cid |= set(re.findall(r'N\["([^"]+)"\]\s*=', t))
print('chunks N["id"]= 定义去重:', len(cid))

# 5) 交集分析
print('chunks∩game.html:', len(cid & defs))
print('chunks∩index.html:', len(cid & idefs))
print('chunks 独有的(不在game.html):', len(cid - defs))
