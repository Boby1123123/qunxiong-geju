# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
def ctx(pattern, label, k=3, pre=110, post=90):
    print('='*8, label, '='*8)
    hits = 0
    for m in re.finditer(pattern, d):
        print('  ...', d[max(0,m.start()-pre):m.end()+post].replace('\n',' ')[:pre+post+40])
        hits += 1
        if hits >= k: break
    if hits == 0: print('  (未找到)')
    print()

for nm in ['ErrorLog', 'RIVALS_V52', 'ToastCenter', 'curNode', 'unlockReading',
           'v44_floatText', 'v44_toast', 'v47_worldDelta', 'v52_jobCn', 'v44_toastOu']:
    # 定义（声明或 window 写）
    ctx(r'(?:const|var|let|window\.|function\s)\s*%s\s*(?===|\(|\{)' % re.escape(nm), nm + ' 定义', k=2, pre=80)
    # window 读取
    ctx(r'window\.%s\b(?!\s*=)' % re.escape(nm), nm + ' window读', k=2, pre=100)
