#!/usr/bin/env python3
# -*- coding: utf-8 -*-
with open('_chk0_full.js','r',encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')
print(f'总行数: {len(lines)}')
print(f'最后15行:')
for i, line in enumerate(lines[-15:], len(lines)-14):
    print(f'  {i}: {repr(line[:80])}')
print(f'\n括号统计:')
print(f'  (: {content.count("(")}, ): {content.count(")")}')
print(f'  {{: {content.count("{")}, }}: {content.count("}")}')
print(f'  [: {content.count("[")}, ]: {content.count("]")}')
print(f'  反引号: {content.count(chr(96))}')
