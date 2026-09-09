# -*- coding: utf-8 -*-
"""检测：369个占位节点中哪些存在 = { 格式的真实定义（重名节点）"""
import re

html = open('game.html', encoding='utf-8').read()

# 1. 收集所有含"v38自动生成占位"标记的节点（占位格式 =function(){return{）
ph_pat = re.compile(r'N\["([^"]+)"\]=function\(\)\{return\{')
ph_ids = set()
for m in ph_pat.finditer(html):
    ph_ids.add(m.group(1))

print('占位格式节点总数:', len(ph_ids))

# 2. 检查每个占位ID是否有 = { 格式的真实定义（等号后空格+花括号，无 function）
real_ids = []
real_set = set()
for m in re.finditer(r'N\["([^"]+)"\]\s*=\s*\{', html):
    real_set.add(m.group(1))

dup = sorted(ph_ids & real_set)
print('重名节点数:', len(dup))
print('重名列表:', ', '.join(dup))
