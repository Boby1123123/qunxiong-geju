#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复switch语句中重复的const result声明"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

old = """        case 'eval':
          const code = args.join(' ');
          const result = eval(code);
          this.log(`结果: ${JSON.stringify(result)}`);
          break;
        default:
          const result = eval(cmd);
          if (result !== undefined) this.log(`结果: ${JSON.stringify(result)}`);"""

new = """        case 'eval':
          const code = args.join(' ');
          const evalResult = eval(code);
          this.log(`结果: ${JSON.stringify(evalResult)}`);
          break;
        default:
          const defaultResult = eval(cmd);
          if (defaultResult !== undefined) this.log(`结果: ${JSON.stringify(defaultResult)}`);"""

if old in html:
    html = html.replace(old, new)
    with open('game.html','w',encoding='utf-8') as f:
        f.write(html)
    print("✓ 已修复重复的const result声明")
else:
    print("⚠ 未找到匹配文本")
