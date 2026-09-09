# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
for nm in ['__v45ct','__v45pag','__v45lastScen','__v52mod','__v52modsT','__v52rerol']:
    print('=====', nm, '=====')
    # 任何形式定义（含 window["x"] 或 var 前置）
    for mm in list(re.finditer(r'(?:var|let|const|window\.|,)\s*' + re.escape(nm) + r'\s*(?===|:)', d))[:3]:
        print('DEF:', d[max(0,mm.start()-70):mm.end()+40].replace('\n',' ')[:150])
    # 读取点
    for mm in list(re.finditer(r'window\.' + re.escape(nm) + r'\b', d))[:2]:
        print('WINR:', d[max(0,mm.start()-90):mm.end()+50].replace('\n',' ')[:160])
    # 裸引用计数
    bare = len(re.findall(r'(?<![.\w$])' + re.escape(nm) + r'(?![\w$])', d))
    print('裸引用计数:', bare)
