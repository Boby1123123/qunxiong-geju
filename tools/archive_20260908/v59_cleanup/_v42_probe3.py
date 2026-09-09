# -*- coding: utf-8 -*-
"""v42 探查3：存档槽位现状/writePar原实现/script2引擎段"""
import io, sys, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

print('=== v34_renderSaveSlots 实现 ===')
m = re.search(r'function\s+v34_renderSaveSlots', html)
print('@', m.start() if m else '未找到')
if m: print(html[m.start():m.start()+2000])

print()
print('=== writePar 原始定义（_v21_orig 赋值前） ===')
for pat in ['writePar = function', 'function writePar', '_v21_orig_writePar = writePar']:
    ms = list(re.finditer(re.escape(pat), html))
    for m in ms[:3]:
        print('  %s @%d' % (pat, m.start()))
# 找 _v21 包装块整体
m = re.search(r'_v21_orig_writePar', html)
if m:
    s = max(0, m.start()-600)
    print(html[s:m.start()+400])

print()
print('=== script2 中非N定义代码规模 ===')
s2 = html[247477:2730890]
# 找出所有 N["..."]= 定义块（宽松正则）
defs = list(re.finditer(r'N\["([^"]+)"\]\s*=\s*(?:function\b|\{)', s2))
print('script2 内 N 定义块数:', len(defs))
# 估算 N 定义总长度（每个定义从匹配起点到最近 '};' 或 '}};'）
# 用简单近似：定义起点分布
import bisect
starts = [d.start() for d in defs]
total_def = 0
for i, d in enumerate(defs):
    end = starts[i+1] if i+1 < len(defs) else len(s2)
    total_def += end - d.start()
print('N 定义近似总长: %d (script2 总长 %d, 占比 %.0f%%)' % (total_def, len(s2), total_def*100.0/len(s2)))
