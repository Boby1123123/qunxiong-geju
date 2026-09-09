# -*- coding: utf-8 -*-
"""检查 v53 注入后结构：STRONG/WILL/图鉴/引擎对象"""
import io, re
s = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()

checks = {
    'PEERS_V53': 'window.PEERS_V53 = {',
    'RACE_MOD_V53': 'window.RACE_MOD_V53 = {',
    'FACTION_PEERS_V53': 'window.FACTION_PEERS_V53 = {',
    'THEOMACHY_V53': 'window.THEOMACHY_V53 = {',
    'NAME_GEN_V53': 'window.NAME_GEN_V53 = {',
    'STRONG_V53': 'window.STRONG_V53 = {',
    'WILL_TO_ASCEND_V53': 'window.WILL_TO_ASCEND_V53 = {',
    'v53_ensureDefaults': 'function v53_ensureDefaults',
    'v53_strongBody': 'function v53_strongBody',
    'v53_peekStrong': 'function v53_peekStrong',
    'v53_runTheomachy': 'function v53_runTheomachy',
    'v53_genName': 'function v53_genName',
    'v53_meetStrong': 'function v53_meetStrong',
    'v53_rumorAfterWrite': 'v53_rumorAfterWrite',
    'strong tab': "['strong','强者谱']",
    'atlasTab strong': "case 'strong'",
}
for k, v in checks.items():
    print(k, '->', s.count(v))

# STRONG 职业键
m = re.search(r'window\.STRONG_V53 = \{(.*?)\n\};', s, re.S)
if m:
    keys = re.findall(r'^\s*"([^"]+)": \{', m.group(1), re.M)
    print('STRONG keys:', keys)

# WILL 键
m2 = re.search(r'window\.WILL_TO_ASCEND_V53 = \{(.*?)\n\};', s, re.S)
if m2:
    keys2 = re.findall(r'^\s*"([^"]+)": \{', m2.group(1), re.M)
    print('WILL keys count:', len(keys2))
    print('WILL keys:', keys2)

# PEERS 键
m3 = re.search(r'window\.PEERS_V53 = \{(.*?)\n\};', s, re.S)
if m3:
    keys3 = re.findall(r'^\s*"([^"]+)": \{', m3.group(1), re.M)
    print('PEERS keys:', keys3)
