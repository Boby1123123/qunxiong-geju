# -*- coding: utf-8 -*-
import io, re
html = io.open('game.html', encoding='utf-8', errors='replace').read()
checks = {
    'dbl_fn': len(re.findall(r'N\["[^"]+"\]\s*=\s*function', html)),
    'dbl_obj': len(re.findall(r'N\["[^"]+"\]\s*=\s*\{', html)),
    'sgl_fn': len(re.findall(r"N\['[^']+'\]\s*=\s*function", html)),
    'sgl_obj': len(re.findall(r"N\['[^']+'\]\s*=\s*\{", html)),
    'dbl_other': len(re.findall(r'N\["[^"]+"\]\s*=\s*(?!function|\{)', html)),
    'N[ 双引号总出现': len(re.findall(r'N\["', html)),
    'nodes_push': html.count('nodes.push'),
    'N_push': html.count('N.push'),
    'Object_assign_N': html.count('Object.assign(N'),
    'window_N': html.count('window.N'),
}
for k, v in checks.items():
    print(k, '=', v)
# 找 ELDA.nodes / window.ELDA 节点注册
for pat in ['ELDA.nodes', 'N = {', 'var N', 'let N', 'const N']:
    i = html.find(pat)
    print(pat, '@', i)
