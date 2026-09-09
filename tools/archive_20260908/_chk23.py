# -*- coding: utf-8 -*-
"""调试：解析当前数组，打印 master 条目判断过程"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
idx = s.rfind('window.STRONG_RUMOR_V53 = [')
j = s.find('];', idx)
block = s[idx:j]
entries = re.findall(r'\{"id":"(rm_[^"]+)"(.*?)\}', block, re.S)
print('parsed:', len(entries))
JOBS_PRE = ['mage', 'war', 'trade', 'priest', 'thief', 'ranger', 'knight', 'smith', 'soul']
m = [e for e in entries if e[0].startswith('rm_m_')]
print('master entries:', len(m))
for eid, body in m[:3]:
    sid = eid[3:]
    jb = next((p for p in JOBS_PRE if sid.startswith('m_' + p)), None)
    print(eid, '-> sid:', sid, '-> jb:', jb)
r = [e for e in entries if e[0].startswith('rm_r_')]
print('race entries:', len(r))
a = [e for e in entries if e[0].startswith('rm_ab_')]
print('abyss entries:', len(a))
