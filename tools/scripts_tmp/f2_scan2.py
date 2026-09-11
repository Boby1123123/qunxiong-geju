# -*- coding: utf-8 -*-
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
t = open(r'D:\1pao tuan\群雄割据\src\data_nodes\dn_failpath2.js', encoding='utf-8').read()
print('BOM count:', t.count('\ufeff'))
i = t.find('组9')
print('part2 comment at:', i)
print('before part2:', repr(t[i-40:i]))
# brace-in-string scan
hits = [m.group(0) for m in re.finditer(r'"([^"]*[{}][^"]*)"', t)]
for h in hits:
    print('brace-in-string:', h[:70])
# check for doubled node-close or stray tokens: every '});' etc
print('N[" count:', t.count('N["'))
print('}; count:', t.count('};'))
print('};\\nN[" count:', len(re.findall(r'};\\nN\["', t)))
