# -*- coding: utf-8 -*-
"""删除125个重名节点的 function 格式定义（保留 = { 精修版）"""
import re

html = open('game.html', encoding='utf-8').read()

# 重名节点列表（占位/早期function定义 + 精修= {定义同时存在）
DUP_IDS = ["act_rest","arrive_free_gonghui","arrive_free_huigang","arrive_free_jiaohui","arrive_free_jishi","beijing_after","beijing_break","beijing_decision","beijing_letter","beijing_oldwolf","beijing_oldwolf2","beijing_rumor","beijing_wolf","board_church_done","board_dwarf_done","board_east_done","board_elf_done","board_free","board_free_after","board_north_done","board_orc_done","board_south_done","church_after","church_candle","church_candle2","church_cathedral","church_city","desert_aftermath","desert_approach","desert_choice","desert_inside","desert_oasis","desert_seer","dwarf_after","dwarf_city","dwarf_done","dwarf_forge","dwarf_forger","dwarf_king","dwarf_mine","dwarf_workshop","east_after","east_city","east_keju","east_oldtemple","east_palace","east_tiemen_after","elf_after","elf_court","elf_done","elf_first","elf_root","ending_choose","fc_archive","fc_guild","fc_jiaohui_entry","fc_report","fc_sewer","fc_sewer2","fc_sewer3","fc_stay","fc_tavern","gangkou_after","gangkou_berth","gangkou_han","gangkou_ships","haigang_ship","hewan_market","hewan_road","kuangshan_forge","kuangshan_mine","moxie_airship","moxie_guild","moxie_workshop","north_academy_2","north_academy_gate","north_academy_inside","north_academy_night","north_leave","north_library","north_library_2","north_mercury","north_tavern","north_tavern2","open_map","orc_after","orc_camp","orc_done","orc_sacred","pro_after","pro_after_leave","pro_choose_east","pro_choose_north","pro_choose_south","pro_choose_west","pro_realm1","senlin_archery","senlin_legend","shangzhan_after","shangzhan_knife","shangzhan_market","south_after_escape","south_after_moxie","south_goldscale","south_goldscale2","south_moxie_go","south_silver_back","south_silver_front","south_zhou","tiebi_camp","tiebi_camp_back","tiebi_oldleon","tiebi_oldleon2","tiebi_warfield","tiebi_warfield2","travel_east_start","travel_north_start","travel_south_start","travel_tiebi_start","travel_west_start","world_continue","xueshu_after","xueshu_bookshop","xueshu_mill","xueshu_truth"]

def find_func_block_end(html, start):
    """从 N["id"]=function(){ 之后寻找块结束位置（return{...}}; 结束）"""
    i = html.index('{', start)  # function 体的 {
    depth = 0
    while i < len(html):
        c = html[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # 找到 return 对象结束的 }，接着应匹配 function 外层 } 和 ;
                j = i + 1
                while j < len(html) and html[j] in ' \r\n\t':
                    j += 1
                if j < len(html) and html[j] == '}':
                    j += 1
                    while j < len(html) and html[j] in ' \r\n\t':
                        j += 1
                    if j < len(html) and html[j] == ';':
                        return j + 1
                return i + 1
        i += 1
    return len(html)

removed = 0
for nid in DUP_IDS:
    # 匹配所有 N["id"]=function(){ 格式（不匹配 = { 精修版）
    pat = re.compile(r'N\["%s"\]\s*=\s*function\s*\(\s*\)\s*\{' % re.escape(nid))
    for m in list(pat.finditer(html)):
        end = find_func_block_end(html, m.start())
        if end > m.start():
            html = html[:m.start()] + html[end:]
            removed += 1

print('已删除 function 格式定义块数:', removed)

# 验证：重名节点现在只剩 = { 定义
left_dup = 0
for nid in DUP_IDS:
    func_cnt = len(re.findall(r'N\["%s"\]\s*=\s*function' % re.escape(nid), html))
    obj_cnt = len(re.findall(r'N\["%s"\]\s*=\s*\{' % re.escape(nid), html))
    if func_cnt > 0:
        print('  警告: %s 仍有 %d 处 function 定义' % (nid, func_cnt))
    if obj_cnt == 0:
        left_dup += 1
        print('  警告: %s 无精修版定义!' % nid)

open('game.html','w',encoding='utf-8').write(html)
print('完成。无精修版的节点数:', left_dup)
