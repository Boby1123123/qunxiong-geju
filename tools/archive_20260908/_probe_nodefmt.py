# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
m = re.search(r'N\["origin_[a-z0-9_]+"\]', d)
i = m.start()
print(d[i:i+800])
print('----- 选项格式样例 -----')
# 找一个 options 数组
mm = re.search(r'options:\s*\[[^\]]{0,300}\]', d)
print(d[mm.start():mm.start()+400])
