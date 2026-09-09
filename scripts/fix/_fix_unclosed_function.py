#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复v35_arch_init函数未闭合的问题"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 找到script 0的结束位置（第一个</script>）
# script 0开始于v35 JS代码，结束于v35战斗系统CSS之前
# 我们需要在v35_initFaction()之后、</script>之前添加}

# 找到v35_initFaction()的位置
marker = "if (typeof v35_initFaction === 'function') v35_initFaction();"
pos = html.find(marker)
if pos > 0:
    print(f"找到v35_initFaction at pos {pos}")
    # 找到之后的第一个</script>
    script_end = html.find('</script>', pos)
    print(f"script结束 at pos {script_end}")
    
    # 检查这之间是否已经有闭合的}
    between = html[pos+len(marker):script_end]
    print(f"之间的内容: {repr(between)}")
    
    # 如果没有}，添加一个
    if '}' not in between.strip():
        # 在</script>之前添加}
        html = html[:script_end] + '\n}\n' + html[script_end:]
        print("✓ 已添加闭合的}")
    else:
        print("已经有闭合的}")
    
    with open('game.html','w',encoding='utf-8') as f:
        f.write(html)
else:
    print("未找到v35_initFaction")
