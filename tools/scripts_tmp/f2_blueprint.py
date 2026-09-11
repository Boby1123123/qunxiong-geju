# -*- coding: utf-8 -*-
"""F-2: register 61 new nodes into blueprint flat nodeIndex (tail-anchor)."""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
p = r'D:\1pao tuan\群雄割据\src\data_nodes\dn_story_blueprint.js'
t = open(p, encoding='utf-8').read()

# id -> vol
vols = {}
for grp, v in [
    ('purge', 'vol_church'), ('seal', 'vol_abyss'), ('silver', 'vol_north'), ('orc', 'vol_race'),
    ('tribunal', 'vol_church'), ('caravan', 'vol_desert'), ('keju', 'vol_east'),
    ('westranger', 'vol_war'), ('elftower', 'vol_elf'), ('dwarfmine', 'vol_dwarf'),
    ('courier', 'vol_north'), ('sewer', 'vol_free'), ('bandit', 'vol_free'),
    ('realm', 'vol_free'), ('vault', 'vol_academy'), ('flood', 'vol_free'),
    ('market', 'vol_free'), ('heretic', 'vol_church'), ('quayside', 'vol_free'),
]:
    for i in (1, 2, 3):
        vols['failpath_%s_%d' % (grp, i)] = v
vols['failpath_market_4'] = 'vol_free'
vols['failpath_heretic_4'] = 'vol_church'
vols['failpath_quayside_4'] = 'vol_free'
vols['failpath_quayside_5'] = 'vol_free'

# build insertion block
lines = []
for nid, v in sorted(vols.items()):
    lines.append('  "%s": {tag:"branch", vol:"%s", arc:null, pace:"normal"},' % (nid, v))

# tail-anchor: insert before the final "};" that closes the flat object
anchor = '"failpath_winter_3": {tag:"branch", vol:"vol_academy", arc:null, pace:"normal"}};'
assert anchor in t, 'anchor not found'
block = '\n'.join(lines)
new = t.replace(anchor, '"failpath_winter_3": {tag:"branch", vol:"vol_academy", arc:null, pace:"normal"},\n' + block + '};', 1)
open(p, 'w', encoding='utf-8').write(new)
print('inserted entries:', len(lines))
print('new len:', len(new))
