# -*- coding: utf-8 -*-
import io, re
t = io.open('src/script_01.js', encoding='utf-8').read()
i = t.find('REGIONS')
print(t[max(0, i-200):i+1800])
