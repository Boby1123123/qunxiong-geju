# -*- coding: utf-8 -*-
"""v41 清理：删除重复定义的靠前版本（保留实际生效的靠后版）+ 末尾空script残留"""
import re, io, sys, shutil, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

shutil.copyfile('game.html', 'backup\\game_v41_before_dedup2.html')
html = open('game.html', encoding='utf-8').read()
orig_len = len(html)

def scan_block_end(html, start):
    """从 N["id"]=function(){ 开始，括号配对扫描到闭合 }; 返回结束位置(含)"""
    i = html.find('{', start)
    if i < 0: return None
    depth = 0
    j = i
    while j < len(html):
        c = html[j]
        if c == '{': depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # 后面可能跟着 ;
                k = j+1
                while k < len(html) and html[k] in ' \t\r\n': k += 1
                if k < len(html) and html[k] == ';': k += 1
                return k
        j += 1
    return None

# 1. 重复 function 定义清理（保留最后一个）
dup_ids = ['faction_elf_intro','faction_dwarf_intro','faction_orc_intro',
           'academy_year1_intro','academy_year2_intro','academy_year3_intro','academy_year4_intro',
           'classmate_cecilia_intro','classmate_marcus_intro','classmate_thorin_intro']
removed = 0
for nid in dup_ids:
    pat = re.compile(r'N\["%s"\]\s*=\s*function\s*\(' % nid)
    poss = [m.start() for m in pat.finditer(html)]
    if len(poss) <= 1: continue
    # 保留最后一个，删除前面的
    for p in poss[:-1]:
        end = scan_block_end(html, p)
        if end is None:
            print('✗ 无法定位 %s @%d' % (nid, p)); continue
        # 检查删除内容是否包含另一个定义
        if any(p < q < end for q in poss):
            print('✗ %s @%d 删除区间包含其他定义，跳过' % (nid, p)); continue
        # 往前找这一定义开始处的换行
        seg_start = p
        html = html[:seg_start] + html[end:]
        removed += 1
        print('✓ 删除 %s 靠前定义 @%d' % (nid, p))

# 2. arrive_generic 重名：删除 function 版（靠前），保留对象版（靠后）
pat = re.compile(r'N\["arrive_generic"\]\s*=\s*function\s*\(')
m = pat.search(html)
if m:
    end = scan_block_end(html, m.start())
    if end:
        html = html[:m.start()] + html[end:]
        removed += 1
        print('✓ 删除 arrive_generic function 版')

# 3. 末尾空 script 残留： </script> <script> </body>
pat2 = re.compile(r'</script>\s*<script>\s*</body>', re.S)
m2 = pat2.search(html)
if m2:
    html = html[:m2.start()] + '</script>\n</body>'
    print('✓ 清理末尾空 script 残留')
else:
    print('· 未找到末尾空 script 模式')

open('game.html','w',encoding='utf-8').write(html)
print('完成：删除 %d 处，体积 %d → %d' % (removed, orig_len, len(html)))
