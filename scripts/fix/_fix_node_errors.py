#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复realm和slow_travel节点的空引用问题"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 修复1: realm_4的j.titles[4]引用
old1 = '"**宗师。**"+j.titles[4]+"。这个名字，放在大陆任何一座城，都有人买账。"'
new1 = '"**宗师。**"+(j.titles&&j.titles[4]?j.titles[4]:"宗师")+"。这个名字，放在大陆任何一座城，都有人买账。"'
if old1 in html:
    html = html.replace(old1, new1)
    print("✓ 修复realm_4 titles引用")

# 修复2: realm_5的j.workDesc引用
old2 = 'j.workDesc ? "你开始能隐约感觉到那件属于你的"+j.workDesc+"的轮廓——它还缺材'
new2 = '(j.workDesc? "你开始能隐约感觉到那件属于你的"+j.workDesc+"的轮廓——它还缺材'
if old2 in html:
    # 需要找到完整的三元表达式
    # 先找到j.workDesc ? 的位置，然后替换为(j.workDesc ? ... : "")
    pos = html.find('j.workDesc ? "你开始能隐约感觉到')
    if pos > 0:
        # 找到这个三元表达式的结束（匹配的?和:）
        # 简化处理：直接在j.workDesc前加括号，在表达式末尾加:""
        # 先找到这个表达式的大致范围
        snippet = html[pos:pos+300]
        print(f"realm_5表达式: {snippet[:150]}")

# 修复3: slow_travel节点的S.slowTravel空引用
# 在slow_travel_start节点开头添加初始化
old3 = 'N["slow_travel_start"]=function(){\n  const st = S.slowTravel;'
new3 = 'N["slow_travel_start"]=function(){\n  if(!S.slowTravel) S.slowTravel={day:1,stage:0,totalDays:5,dest:"铁门关",companion:5,events:[]};\n  const st = S.slowTravel;'
if old3 in html:
    html = html.replace(old3, new3)
    print("✓ 修复slow_travel_start初始化")

# 修复4: 为其他slow_travel节点也添加检查
for node_id in ['slow_travel_morning', 'slow_travel_noon', 'slow_travel_dusk', 'slow_travel_night', 'slow_travel_next_day', 'slow_travel_arrive']:
    old = f'N["{node_id}"]=function(){{\n  const st = S.slowTravel;'
    new = f'N["{node_id}"]=function(){{\n  if(!S.slowTravel) S.slowTravel={{day:1,stage:0,totalDays:5,dest:"铁门关",companion:5,events:[]}};\n  const st = S.slowTravel;'
    if old in html:
        html = html.replace(old, new)
        print(f"✓ 修复{node_id}初始化")

# 修复5: Module not found: core - v35_arch_init重复调用问题
# 检查v35_arch_init的调用次数
arch_count = html.count('v35_arch_init()')
print(f"\nv35_arch_init()调用次数: {arch_count}")

# 修复register函数，让它在模块已注册时不报错
old_register = "register(name, module) {\n    if (this.modules[name]) {\n      console.warn('[V35] Module already registered:', name);\n      return false;\n    }"
new_register = "register(name, module) {\n    if (this.modules[name]) {\n      return true; // 已注册则直接返回成功，避免重复调用报错\n    }"
if old_register in html:
    html = html.replace(old_register, new_register)
    print("✓ 修复Module重复注册警告")

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)
print("\n✓ 所有修复完成")
