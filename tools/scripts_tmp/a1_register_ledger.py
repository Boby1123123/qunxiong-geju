# -*- coding: utf-8 -*-
"""账本登记：led_goal_wealth/might/guard（数组末项补逗号，]; 前插入）。"""
import io, re

ROOT = r'D:\1pao tuan\群雄割据'
p = ROOT + r'\src\data_nodes\dn_causality.js'
with io.open(p, encoding='utf-8') as f:
    src = f.read()

# 确认尾部锚点
end_marker = '/* ===== /v91inj:ledgerwords:end/ ===== */'
assert end_marker in src, '结尾标记缺失'

# 最后一项 "irreversible": false\n  }\n];  ->  补逗号 + 插条目
old = '    "irreversible": false\n  }\n];'
assert old in src, '账本尾部锚点未找到'

new_items = [
    {
        'id': 'led_goal_wealth',
        'type': '伏笔',
        'desc': '富甲天下践行线（南境黄金城→银穗商路→承天账房→铁门关税关）：第一笔买卖、第一课、三倍税钱的记账',
        'plant': 'flag:ideal_goal_wealth',
        'reap': 'flag:ideal_goal_wealth_pursued',
        'status': 'open',
        'world': 'vol_free',
        'importance': 1,
        'keywords': ['富甲天下', '黄金城', '银穗', '铁门关'],
        'irreversible': False
    },
    {
        'id': 'led_goal_might',
        'type': '伏笔',
        'desc': '威震四海践行线（铁门关→第三哨→北境雪原）：校场立威、半个老兵、冰谷一换五的成名战',
        'plant': 'flag:ideal_goal_might',
        'reap': 'flag:ideal_goal_might_pursued',
        'status': 'open',
        'world': 'vol_free',
        'importance': 1,
        'keywords': ['威震四海', '铁门关', '第三哨', '雪原'],
        'irreversible': False
    },
    {
        'id': 'led_goal_guard',
        'type': '伏笔',
        'desc': '守护苍生践行线（圣辉城救济堂→西境难民营→南境疫村→东境流民）：一碗粥、一瓢水、隘口独挡五劫匪',
        'plant': 'flag:ideal_goal_guard',
        'reap': 'flag:ideal_goal_guard_pursued',
        'status': 'open',
        'world': 'vol_free',
        'importance': 1,
        'keywords': ['守护苍生', '圣辉城', '元素荒原', '疫村'],
        'irreversible': False
    },
]

def fmt(item):
    return ('    {\n'
            '        "id": "%s",\n'
            '        "type": "%s",\n'
            '        "desc": "%s",\n'
            '        "plant": "%s",\n'
            '        "reap": "%s",\n'
            '        "status": "%s",\n'
            '        "world": "%s",\n'
            '        "importance": %d,\n'
            '        "keywords": [%s],\n'
            '        "irreversible": %s\n'
            '  }') % (
                item['id'], item['type'], item['desc'], item['plant'], item['reap'],
                item['status'], item['world'], item['importance'],
                ', '.join('"%s"' % k for k in item['keywords']),
                'true' if item['irreversible'] else 'false')

block = ',\n' + ',\n'.join(fmt(i) for i in new_items) + '\n];'
src2 = src.replace(old, '    "irreversible": false\n  }' + block, 1)
with io.open(p, 'w', encoding='utf-8', newline='') as f:
    f.write(src2)

# 校验
for it in new_items:
    assert ('"%s"' % it['id']) in src2, it['id'] + ' 未插入'
print('账本登记 3 条完成；', end='')
# 简单配平
print('尾部样例:', repr(src2[-180:]))
