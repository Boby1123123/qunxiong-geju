# -*- coding: utf-8 -*-
import io, re
html = io.open('game.html', encoding='utf-8', errors='replace').read()

# 1) academy_entrance 2 次出现的上下文
for m in re.finditer(r'academy_entrance', html):
    seg = html[max(0, m.start() - 60):m.start() + 90].replace('\n', ' ')
    print('academy_entrance @', m.start(), ':', seg[:150])

# 2) ELDA.nodes 注册模式
print('\nELDA.nodes[ 出现:', len(re.findall(r'ELDA\.nodes\[', html)))
print('ELDA.nodes 后跟 .id=', len(re.findall(r'ELDA\.nodes\[["\']', html)))
for m in list(re.finditer(r'ELDA\.nodes\[["\']', html))[:5]:
    seg = html[m.start():m.start() + 60].replace('\n', ' ')
    print('  ', seg)

# 3) 其他节点注册：N = N || {}; N["id"]... 之外？搜 "= function(){" 前 30 字符模式
#    统计所有 N[ 开头的模式种类
kinds = {}
for m in re.finditer(r'N\[["\']([^"\']+)["\']\]', html):
    after = html[m.end():m.end() + 3]
    key = after if after.startswith('=') else ('N[' + repr(after))
    kinds[key] = kinds.get(key, 0) + 1
for k, v in sorted(kinds.items(), key=lambda x: -x[1])[:12]:
    print('模式', repr(k), '=', v)
