# -*- coding: utf-8 -*-
"""导出 c_refhealth 详细清单，人工甄别真伪。"""
import io, os, sys, json
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tools', 'eldacheck'))
from checks import c_refhealth

html = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
r = c_refhealth.run(html)
d = r['details']
print('FAIL:', len(d['fails']), ' WARN:', len(d['warns']), ' PASS:', len(d['passes']))
print()
print('===== FAIL 全量清单 =====')
for f in d['fails']:
    print('[%s] line=%s %s' % (f['name'], f['line'], f['msg'][:150]))
