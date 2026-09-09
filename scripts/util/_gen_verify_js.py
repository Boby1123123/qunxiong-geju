# -*- coding: utf-8 -*-
"""生成 bu.js 批量验证脚本的JS"""
ids = [l.strip() for l in open('_rewritten_ids.txt', encoding='utf-8').read().split('\n') if l.strip()]

js_lines = ['(function(){', '  var out = [];', '  var bad = [];']
for i in ids:
    js_lines.append('  try { var n=N["%s"](); var t=(typeof n.text==="function")?n.text():n.text; if(!t||t.length<2||!n.options||n.options.length<1){ bad.push("%s:结构异常"); } } catch(e){ bad.push("%s: "+e.message); }' % (i, i, i))
js_lines.append('  out.push("检查节点: %d个");' % len(ids))
js_lines.append('  out.push("异常数: " + bad.length);')
js_lines.append('  for(var k=0;k<bad.length && k<10;k++){ out.push("  " + bad[k]); }')
js_lines.append('  return out.join("\\n");')
js_lines.append('})()')
open('_verify_nodes.js.txt','w',encoding='utf-8').write('\n'.join(js_lines))
print('JS生成完毕，节点数:', len(ids))
