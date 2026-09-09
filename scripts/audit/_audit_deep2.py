# -*- coding: utf-8 -*-
"""v41 深查B2：11个重复 function 定义的实际内容"""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

for nid in ['faction_elf_intro','faction_dwarf_intro','faction_orc_intro','academy_year1_intro','classmate_cecilia_intro']:
    pat = re.compile(r'N\["%s"\]\s*=\s*function\s*\(' % nid)
    poss = [m.start() for m in pat.finditer(html)]
    print('='*70)
    print('## %s  定义数:%d' % (nid, len(poss)))
    for i, p in enumerate(poss):
        seg = html[p:p+1200]
        # 提取文本形式：t.push / text: / return "xxx"
        push = re.findall(r't\.push\("([^"]{0,50})"\)', seg)
        textarr = re.findall(r'text\s*:\s*\[\s*"([^"]{0,50})', seg)
        rstr = re.findall(r'return\s*"([^"]{0,50})"', seg)
        print('  定义[%d] @%d: t.push×%d text-arr×%d return×%d' % (i, p, len(push), len(textarr), len(rstr)))
        head = push[:1] + textarr[:1] + rstr[:1]
        if head:
            print('    首段: %s' % head[0][:60])
        else:
            print('    首60字: %s' % seg[:60].replace('\n',' '))
