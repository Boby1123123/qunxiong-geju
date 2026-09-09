#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

nodes = ['academy_magic_class', 'faction_recruit_hub', 'battle_seal1_intro', 'class_fire_intro', 'faction_lc_intro']
for n in nodes:
    count = html.count(f'N["{n}"]')
    print(f'{n}: {count} occurrences')

scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f'\nTotal scripts: {len(scripts)}')
for i, s in enumerate(scripts):
    v36_count = s.count('v36') + s.count('V36')
    print(f'  script {i}: {len(s)} chars, v36 count: {v36_count}')
