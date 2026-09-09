# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
# STRONG_V53 定义与引用位置
for name in ['STRONG_V53','READINGS_V45','PEERS_V53']:
    print('=====', name, '=====')
    # 定义处
    for mm in list(re.finditer(r'(?:window\.)?' + name + r'\s*=\s*\{', d))[:3]:
        print('定义:', d[max(0,mm.start()-80):mm.start()+60].replace('\n',' ')[:180])
    # 引用处样例
    cnt = 0
    for mm in re.finditer(r'window\.' + name + r'\b', d):
        print('window引用:', d[max(0,mm.start()-90):mm.start()+70].replace('\n',' ')[:170])
        cnt += 1
        if cnt >= 5: break
    # 裸引用出现次数（可能读不到）
    bare = len(re.finditer(r'(?<![.\w$])' + name + r'(?![\w$])', d))
    print('总提及(含window):', bare)
