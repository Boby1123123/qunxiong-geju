#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v32 统一修改硬编码颜色为暖棕色调"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # #modal .box 建号框背景
    ('#modal .box{background:linear-gradient(180deg,#1a2d4d,#14223a);',
     '#modal .box{background:linear-gradient(180deg,#251e15,#1c1710);'),
    
    # .v31-modal-container 模态框容器
    ('.v31-modal-container{\n  background:linear-gradient(160deg,#0f1a2e 0%,#152238 50%,#0d1626 100%);',
     '.v31-modal-container{\n  background:linear-gradient(160deg,#221b12 0%,#1a150e 50%,#16120c 100%);'),
    
    # 选项按钮背景
    ('#options .opt{\n  display:flex;\n  align-items:flex-start;\n  gap:10px;\n  width:100%;\n  text-align:left;\n  background:linear-gradient(90deg,rgba(15,26,46,.92) 0%,rgba(21,34,56,.85) 100%);',
     '#options .opt{\n  display:flex;\n  align-items:flex-start;\n  gap:10px;\n  width:100%;\n  text-align:left;\n  background:linear-gradient(90deg,rgba(30,24,18,.92) 0%,rgba(38,30,22,.85) 100%);'),
    
    ('#options .opt:hover{\n  background:linear-gradient(90deg,rgba(21,34,56,.98) 0%,rgba(29,46,74,.92) 100%);',
     '#options .opt:hover{\n  background:linear-gradient(90deg,rgba(38,30,22,.98) 0%,rgba(46,37,28,.92) 100%);'),
    
    ('#options .opt.opt-gold{\n  border-left-color:var(--text-gold);\n  background:linear-gradient(90deg,rgba(240,214,138,.1) 0%,rgba(21,34,56,.9) 100%);',
     '#options .opt.opt-gold{\n  border-left-color:var(--text-gold);\n  background:linear-gradient(90deg,rgba(201,162,39,.12) 0%,rgba(30,24,18,.9) 100%);'),
    
    ('#options .opt.opt-gold:hover{\n  background:linear-gradient(90deg,rgba(240,214,138,.15) 0%,rgba(29,46,74,.92) 100%);',
     '#options .opt.opt-gold:hover{\n  background:linear-gradient(90deg,rgba(201,162,39,.18) 0%,rgba(38,30,22,.92) 100%);'),
    
    # 行动按钮背景
    ('.btn.act{\n  flex:1 1 auto;\n  min-width:110px;\n  padding:10px 12px;\n  font-size:13px;\n  text-align:center;\n  background:linear-gradient(135deg,#1a2a44 0%,#1f3050 100%);',
     '.btn.act{\n  flex:1 1 auto;\n  min-width:110px;\n  padding:10px 12px;\n  font-size:13px;\n  text-align:center;\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);'),
    
    ('.btn.act:hover{\n  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);',
     '.btn.act:hover{\n  background:linear-gradient(135deg,#382e20 0%,#423728 100%);'),
    
    # 次按钮背景
    ('.btn-secondary{\n  background:linear-gradient(135deg,#1a2a44 0%,#243a5a 100%);',
     '.btn-secondary{\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);'),
    
    ('.btn-secondary:hover{\n  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);',
     '.btn-secondary:hover{\n  background:linear-gradient(135deg,#332a1e 0%,#3d3325 100%);'),
    
    # 返回按钮背景
    ('.btn-back{\n  display:inline-flex;\n  align-items:center;\n  gap:8px;\n  padding:10px 22px;\n  min-width:130px;\n  justify-content:center;\n  background:linear-gradient(135deg,#1a2a44 0%,#243a5a 100%);',
     '.btn-back{\n  display:inline-flex;\n  align-items:center;\n  gap:8px;\n  padding:10px 22px;\n  min-width:130px;\n  justify-content:center;\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);'),
    
    ('.btn-back:hover{\n  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);',
     '.btn-back:hover{\n  background:linear-gradient(135deg,#332a1e 0%,#3d3325 100%);'),
    
    # 顶部导航按钮
    ('.top-btn{\n  padding:7px 14px;\n  background:linear-gradient(135deg,rgba(26,42,68,.8) 0%,rgba(36,58,90,.8) 100%);',
     '.top-btn{\n  padding:7px 14px;\n  background:linear-gradient(135deg,rgba(42,34,24,.85) 0%,rgba(51,42,30,.85) 100%);'),
    
    ('.top-btn:hover{\n  background:linear-gradient(135deg,rgba(36,58,90,.9) 0%,rgba(45,69,102,.9) 100%);',
     '.top-btn:hover{\n  background:linear-gradient(135deg,rgba(51,42,30,.9) 0%,rgba(61,51,37,.9) 100%);'),
    
    # 输入框
    ('input[type=text]{background:#16243d;border:1px solid var(--border-light);color:var(--text-primary);padding:8px 12px;border-radius:6px;width:220px;font-size:14px}',
     'input[type=text]{background:#2a2218;border:1px solid var(--border-light);color:var(--text-primary);padding:8px 12px;border-radius:6px;width:220px;font-size:14px}'),
    
    # job-card和sel-card
    ('.job-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(26,45,77,.8),rgba(20,34,58,.9));',
     '.job-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(42,34,24,.85),rgba(34,28,20,.9));'),
    
    ('.job-card:hover,.job-card.sel{border-color:var(--gold);background:var(--panel2)}',
     '.job-card:hover,.job-card.sel{border-color:var(--gold);background:linear-gradient(135deg,rgba(51,42,30,.9),rgba(42,34,24,.95))}'),
    
    ('.sel-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(26,45,77,.8),rgba(20,34,58,.9));',
     '.sel-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(42,34,24,.85),rgba(34,28,20,.9));'),
    
    ('.sel-card:hover{border-color:var(--gold);background:var(--panel2)}',
     '.sel-card:hover{border-color:var(--gold);background:linear-gradient(135deg,rgba(51,42,30,.9),rgba(42,34,24,.95))}'),
]

count = 0
for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1
        print(f"✓ 替换: {old[:50]}...")
    else:
        print(f"✗ 未找到: {old[:50]}...")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n完成！共替换 {count}/{len(replacements)} 处，文件大小: {len(html)} 字符")
