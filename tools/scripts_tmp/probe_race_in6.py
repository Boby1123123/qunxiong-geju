# -*- coding: utf-8 -*-
import io, re, glob
targets = ['elf_w_enter', 'orc_w_enter', 'dwarf_deep_hall', 'dwarf_deep_mine2']
for tgt in targets:
    for f in glob.glob('src/script_0*.js') + glob.glob('src/data_nodes/dn_*.js'):
        try:
            t = io.open(f, encoding='utf-8').read()
        except Exception:
            continue
        for m in re.finditer(r'go:"(' + tgt + ')"', t):
            # find enclosing N["id"]
            pre = t[:m.start()]
            nids = re.findall(r'N\[["\']([\w]+)["\']\]', pre)
            opt = t[m.start()-70:m.end()+10].replace('\n', ' ')
            print(tgt, '<-', f.split('/')[-1], '::', nids[-1] if nids else '?', '::', opt[-80:])
