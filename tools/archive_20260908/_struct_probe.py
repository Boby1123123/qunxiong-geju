# -*- coding: utf-8 -*-
import io, re
d = io.open(r'D:\1pao tuan\群雄割据\game.html', encoding='utf-8').read()
print('总字节:', len(d))
print('<script> 标签:', d.count('<script'), ' </script>:', d.count('</script>'))
print('IIFE (function(){ 次数:', len(re.findall(r'\(function\(\)\{', d)))
# 注入 marker
for m in sorted(set(re.findall(r'/v\d+inj:[a-z0-9_]+', d))):
    print(m, d.count(m))
# 顶层对象声明情况
print('---- const 顶层 ----')
for name in ['FLOW_V57','JOB_BRAND_V57','ORDER_FACTION_V57','FACTION_EVENTS_V57','SKILLS_V55','FEATS_V51','STRONG_V53','PEAK_V52','ARTIFACT_V52','ORG_V52','RIVALS_V52','ACADEMIES_V28','READINGS_V45','PEERS_V53','ARC_V55']:
    c1 = len(re.findall(r'\bconst\s+' + name + r'\b', d))
    c2 = len(re.findall(r'\bvar\s+' + name + r'\b', d))
    c3 = len(re.findall(r'(?<![.\w])' + name + r'\s*=\s*\{', d))
    c4 = len(re.findall(r'window\.' + name + r'\b', d))
    print(name, 'const:', c1, 'var:', c2, '赋值=', c3, 'window引用:', c4)
# N 节点定义数
print('N["..."] 节点定义:', len(re.findall(r'N\["', d)))
