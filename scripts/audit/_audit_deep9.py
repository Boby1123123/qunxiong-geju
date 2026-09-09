# -*- coding: utf-8 -*-
"""v41：带空格 { text: 上下文分析"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

# 审计用的正则 { text: 匹配 292 处——先复现并抽样
pat = re.compile(r'\{\s*text\s*:')
ms = list(pat.finditer(html))
print('【P】{ text: 总出现: %d 处' % len(ms))
# 上下文分类：前看是否在 options:[ 内，或 event/choices 内
opt_ctx = 0
evt_ctx = 0
other = []
for m in ms[:150]:
    p = m.start()
    pre = html[max(0,p-300):p]
    if re.search(r'options\s*:\s*\[[^\]]*$', pre):
        opt_ctx += 1
    elif re.search(r'choices\s*:', pre):
        evt_ctx += 1
    else:
        other.append(p)
print('  前150处中：options数组内: %d, choices(事件)内: %d, 其他: %d' % (opt_ctx, evt_ctx, len(other)))
print('  其他上下文样例:')
for p in other[:8]:
    print('    @%d: %s' % (p, html[p-70:p+50].replace('\n',' ')))
# 全量判定：是否都在 options 数组内（即节点选项）
all_opt = 0
for m in ms:
    p = m.start()
    pre = html[max(0,p-400):p]
    if re.search(r'options\s*:\s*\[[^\]]*$', pre):
        all_opt += 1
print('  全量：options数组内: %d / %d' % (all_opt, len(ms)))
