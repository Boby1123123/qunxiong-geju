# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
ids = ['realm_godfavor','event_hub','letter_read','disaster_trigger_blood_rain']
for nid in ids:
    m = re.search(r'N\["%s"\]\s*=\s*function\(\)\s*\{\s*return\s*\{' % nid, d)
    print('='*12, nid, '='*12)
    if not m:
        print('  未找到定义（或格式不同）')
        # 宽松找
        m2 = re.search(r'N\["%s"\]' % nid, d)
        print('  宽松:', d[m2.start():m2.start()+220].replace('\n',' ') if m2 else '无')
        continue
    seg = d[m.start():m.start()+600]
    # 提取前 400 字符看 text 形态
    print('  ', seg[:420].replace('\n', ' '))
    print()
