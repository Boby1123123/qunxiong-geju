# -*- coding: utf-8 -*-
import io, re
for f in ['src/data_nodes/dn_elf_dwarf.js', 'src/data_nodes/dn_orc_deep.js', 'src/data_nodes/dn_faction2.js']:
    t = io.open(f, encoding='utf-8').read()
    ids = re.findall(r'N\[["\']([\w]+)["\']\]', t)
    print(f, len(ids), ids[:8], '...', ids[-6:])
