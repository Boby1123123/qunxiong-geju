# -*- coding: utf-8 -*-
"""Fix: wrap part2 in its own IIFE."""
p = r'D:\1pao tuan\群雄割据\src\data_nodes\dn_failpath2.js'
t = open(p, encoding='utf-8').read()
marker = '/* ============ \u7ec49'
i = t.find(marker)
assert i > 0, 'marker not found'
# The part1 ends with "})();\n" right before marker? Verify previous non-space chars
prev = t[i-10:i]
print('before marker:', repr(prev))
# Insert (function(){ right before marker
new = t[:i] + '(function(){\n' + t[i:]
open(p, 'w', encoding='utf-8', newline='\n').write(new)
print('inserted IIFE open; new len:', len(new))
