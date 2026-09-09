# -*- coding: utf-8 -*-
html = open('game.html', encoding='utf-8').read()
targets = ['pol_hub','west_hub','dungeon_intro','quest_hub','world_continue','act_rest','academy_elda_hub','dungeon_hub','fc_hub','north_hub','elf_hub','dwarf_hub','orc_hub','church_hub','desert_hub','east_hub','south_hub','travel_hub','north_tavern','north_library','seal2_intro','seal2_hub','slow_travel_','world_map_generic','arrive_generic','academy_main']
for t in targets:
    print('%s: %s' % (t, 'N["%s"]' % t in html))
