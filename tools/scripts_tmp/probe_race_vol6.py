# -*- coding: utf-8 -*-
import io, re
t = io.open('src/data_nodes/dn_story_blueprint.js', encoding='utf-8').read()
for nid in ['elf_deep_altar', 'dwarf_deep_hall', 'orc_deep_wolf', 'orc_deep_gate', 'elf_w_enter']:
    m = re.search('"' + nid + r'":\s*\{[^}]*\}', t)
    print(nid, '->', m.group(0)[:130] if m else 'NOT FOUND')
