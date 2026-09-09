#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""验证4所学院骨架完整性"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

academies = {
    '圣光神学院': ['academy_holy_hub','academy_holy_class','academy_holy_social','academy_holy_explore','academy_holy_library','academy_holy_exam','academy_holy_graduation','academy_holy_year1'],
    '帝国军事学院': ['academy_military_hub','academy_military_class','academy_military_social','academy_military_explore','academy_military_training','academy_military_exam','academy_military_graduation','academy_military_year1'],
    '精灵银叶学院': ['academy_elf_hub','academy_elf_class','academy_elf_social','academy_elf_explore','academy_elf_library','academy_elf_meditate','academy_elf_graduation','academy_elf_year1'],
    '矮人铁峰学院': ['academy_dwarf_hub','academy_dwarf_class','academy_dwarf_social','academy_dwarf_explore','academy_dwarf_forge','academy_dwarf_tavern','academy_dwarf_graduation','academy_dwarf_year1'],
}

for name, nodes in academies.items():
    found = 0
    missing = []
    for n in nodes:
        if f'N["{n}"]' in html:
            found += 1
        else:
            missing.append(n)
    print(f"{name}: {found}/{len(nodes)} 节点存在" + (f"，缺失: {missing}" if missing else " ✓"))
