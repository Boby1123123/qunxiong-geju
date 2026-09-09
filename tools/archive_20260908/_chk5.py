# -*- coding: utf-8 -*-
"""查看 v53_strongBody 中 隐世/散人/兽王 占位引用"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

for kw in ['lv_隐世', 'lv_散人', 'lv_兽王', 'lv_hermit', 'lv_drift', 'lv_beast', '隐世', '散人', '兽王']:
    print(kw, '->', s.count(kw))
print('===')
# 看 strongBody 里引用上下文
i = s.find('window.v53_strongBody')
seg = s[i:i+4500]
print(seg)
