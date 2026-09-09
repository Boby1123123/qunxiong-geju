# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for nm in ['v44_floatText', 'v44_toast', 'v47_worldDelta', 'ErrorLog', 'ToastCenter', 'curNode']:
    print('='*10, nm, '='*10)
    # 所有出现形式
    for m in re.finditer(re.escape(nm), d):
        s = d[max(0,m.start()-70):m.end()+50].replace('\n', ' ')
        print('   ...', s[:150])
    print()
