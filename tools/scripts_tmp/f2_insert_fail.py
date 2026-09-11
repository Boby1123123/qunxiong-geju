# -*- coding: utf-8 -*-
"""F-2: insert fail:"<entry>" into 16 chosen check-options of 16 nodes."""
import re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
ROOT = r"D:\1pao tuan\群雄割据\src"

# (file, nodeId, failValue, anchorTStart) — anchor limits to one specific option by t-text prefix
JOBS = [
 ("data_nodes\\dn_f_mainline.js","world_purge_m2","failpath_purge_1","{t:\"\u9547\u5b9a\u56de\u8bdd"),
 ("data_nodes\\dn_f_mainline.js","world_seal_m1","failpath_seal_1","{t:\"\u6316\u5f00\u53f0\u57fa"),
 ("data_nodes\\dn_f_mainline.js","world_silver_m2","failpath_silver_1","{t:\"\u5192\u9669\u9760\u8fd1"),
 ("data_nodes\\dn_f_mainline.js","world_orc_m1","failpath_orc_1","{t:\"\u6df7\u8fc7\u6cb3"),
 ("data_nodes\\dn_church.js","arrive_church_tribunal","failpath_tribunal_1","{t:\"\uff08\u9762\u9648\uff1a\u6c42\u89c1\u5927\u5ba1\u5224\u957f"),
 ("data_nodes\\dn_desert.js","desert_caravan2","failpath_caravan_1","{t:\"\u4e3b\u52a8\u8bf7\u7f28"),
 ("data_nodes\\dn_east.js","east_exam","failpath_keju_1","{t:\"\uff08\u7559\u610f\u90a3\u4e2a\u7070\u888d\u8003\u751f"),
 ("data_nodes\\dn_west.js","west_ranger3","failpath_westranger_1","{t:\"\uff08\u4e0e\u82e5\u8036\u5e76\u80a9"),
 ("data_nodes\\dn_elf_dwarf.js","elf_deep_mist","failpath_elftower_1","{t:\"\u63a8\u5f00\u5854\u95e8"),
 ("data_nodes\\dn_elf_dwarf.js","dwarf_deep_mine2","failpath_dwarfmine_1","{t:\"\u671d\u58f0\u97f3\u7684\u65b9\u5411"),
 ("data_nodes\\dn_warfront.js","tm_courier","failpath_courier_1","{t:\"\u63a5\u4e0b\u5c71\u9053\u9001\u4fe1"),
 ("script_02.js","fc_sewer2","failpath_sewer_1","{t:\"\u4e0d\u9000\u53cd\u8fdb"),
 ("script_02.js","world_bandit","failpath_bandit_1","{t:\"\u5929\u4eae\u524d\u6284\u5c0f\u8def"),
 ("script_02.js","pro_realm1","failpath_realm_1","{t:\"\u51dd\u795e\u9759\u6c14"),
 ("data_nodes\\dn_acad_story.js","acad_story_vault","failpath_vault_1","{t:\"\uff08\u4e0d\u52a8\u58f0\u8272\uff0c\u81ea\u5df1\u53bb\u91d1\u5e93\u9644\u8fd1\u8f6c"),
 ("script_02.js","world_sflood","failpath_flood_1","{t:\"\u6258\u5546\u884c\u5e2e\u4f60\u56e4\u8d27"),
]

def find_node_seg(txt, nid):
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*\{', txt)
    if not m:
        return None, None, None
    seg_start = m.start()
    nm = re.search(r'\nN\["', txt[seg_start + 5:])
    seg_end = (seg_start + 5 + nm.start()) if nm else len(txt)
    return txt[seg_start:seg_end], seg_end, seg_start

def add_fail(seg, failv, anchor):
    om = seg.find('options')
    if om < 0:
        return None, 'no options'
    head = seg[:om]
    tail = seg[om:]
    pat = re.compile(r'\{\s*t\s*:\s*"[^"]*"\s*,', re.S)
    changed = 0
    out = []
    last = 0
    for m in pat.finditer(tail):
        opt_start = m.start()
        nm = pat.search(tail, opt_start + 5)
        opt_end = nm.start() if nm else len(tail)
        option = tail[opt_start:opt_end]
        if 'check:' in option and anchor in option:
            gm = re.search(r'(go\s*:\s*"[^"]+")', option)
            if gm:
                option = option[:gm.start()] + 'fail:"' + failv + '",' + option[gm.start():]
                changed += 1
        out.append((opt_start, opt_end, option))
    if not changed:
        return None, 'no matching anchored check-option'
    pieces = []
    pos = 0
    for (ost, oend, opt) in out:
        pieces.append(tail[pos:ost])
        pieces.append(opt)
        pos = oend
    pieces.append(tail[pos:])
    return head + ''.join(pieces), changed

results = []
for f, nid, failv, anchor in JOBS:
    p = ROOT + '\\' + f
    t = open(p, encoding='utf-8').read()
    seg, seg_end, seg_start = find_node_seg(t, nid)
    if seg is None:
        results.append((nid, 'NODE NOT FOUND'))
        continue
    new_seg, n_changed = add_fail(seg, failv, anchor)
    if new_seg is None:
        results.append((nid, n_changed))
        continue
    t2 = t[:seg_start] + new_seg + t[seg_end:]
    open(p, 'w', encoding='utf-8').write(t2)
    results.append((nid, 'OK changed=%d' % n_changed))

for r in results:
    print(r)
