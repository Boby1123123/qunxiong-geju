#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v33 第三步：全面修复所有硬编码深色背景为方案D浅色"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # #options 选项区背景
    ('#options{padding:12px 18px;border-top:1px solid var(--line);background:#0d1830;max-height:38%;overflow-y:auto}',
     '#options{padding:12px 18px;border-top:1px solid var(--line);background:linear-gradient(180deg,#e0d4b8,#d8ccb0);max-height:38%;overflow-y:auto}'),
    
    # #options .opt 基础样式（覆盖v31的）
    ('#options .opt{display:block;width:100%;text-align:left;background:var(--panel);border:1px solid var(--line);color:var(--text);padding:10px 14px;border-radius:6px;margin:6px 0;cursor:pointer;font-size:14px;line-height:1.6;transition:all .12s}',
     '#options .opt{display:block;width:100%;text-align:left;background:linear-gradient(135deg,#ede4cc,#e4d8bc);border:2px solid #b0a080;color:var(--text);padding:12px 16px;border-radius:8px;margin:8px 0;cursor:pointer;font-size:16px;font-weight:600;line-height:1.7;transition:all .15s}'),
    
    ('#options .opt:hover{border-color:var(--gold);background:var(--panel2);transform:translateX(3px)}',
     '#options .opt:hover{border-color:#7a5a10;background:linear-gradient(135deg,#f2e8d0,#e8dcc0);transform:translateX(4px);box-shadow:0 4px 12px rgba(0,0,0,.1)}'),
    
    # #side 右侧面板背景
    ('#side{width:330px;border-left:1px solid var(--line);background:rgba(12,23,40,.92);display:flex;flex-direction:column;min-height:0}',
     '#side{width:330px;border-left:1px solid #a09070;background:linear-gradient(180deg,#e0d4b8,#d4c8a8);display:flex;flex-direction:column;min-height:0}'),
    
    # #stats 进度条背景
    ('#stats .bar{height:7px;background:#0c1626;border:1px solid var(--line);border-radius:4px;overflow:hidden;margin:2px 0 6px}',
     '#stats .bar{height:10px;background:#c8bca0;border:1px solid #a09070;border-radius:5px;overflow:hidden;margin:4px 0 8px}'),
    
    # #stats .kv span 标签背景
    ('#stats .kv span{background:var(--panel2);border:1px solid var(--line);border-radius:3px;padding:2px 8px;font-size:12px;color:var(--cyan)}',
     '#stats .kv span{background:#ede4cc;border:1px solid #b0a080;border-radius:4px;padding:3px 10px;font-size:13px;font-weight:600;color:#3a5a3a}'),
    
    # #map svg 地图背景
    ('#map svg{width:100%;height:auto;background:#0b1424;border:1px solid var(--line);border-radius:6px}',
     '#map svg{width:100%;height:auto;background:#e8dcc0;border:1px solid #a09070;border-radius:8px}'),
    
    # .btn.gold 金色按钮
    ('.btn.gold{background:linear-gradient(180deg,#2a2240,#1c1830);border-color:var(--gold);color:var(--gold2)}',
     '.btn.gold{background:linear-gradient(180deg,#c0b090,#a89878);border-color:#7a5a10;color:#3a2e10;font-weight:700}'),
    
    # #story .dice.crit 大成功
    ('#story .dice.crit{background:#2a2410;border:1px solid var(--gold);color:var(--gold2)}',
     '#story .dice.crit{background:rgba(42,90,42,.1);border:2px solid #4a7a3a;color:#2a5a2a}'),
    
    # #story .dice.extreme
    ('#story .dice.extreme{background:#232b3a;border:1px solid var(--cyan);color:var(--cyan)}',
     '#story .dice.extreme{background:rgba(42,74,106,.1);border:2px solid #3a6a8a;color:#2a4a6a}'),
    
    # #story .dice.hard
    ('#story .dice.hard{background:#1d2a36;border:1px solid #4a7a9a;color:#a8cfe8}',
     '#story .dice.hard{background:rgba(42,74,106,.08);border:1px solid #5a8aaa;color:#2a4a6a}'),
    
    # #story .dice.normal
    ('#story .dice.normal{background:#16202e;border:1px solid #33506b;color:var(--text)}',
     '#story .dice.normal{background:rgba(180,160,120,.15);border:1px solid #a09070;color:var(--text)}'),
    
    # #story .dice.fail
    ('#story .dice.fail{background:#241820;border:1px solid #6b3340;color:#d99aa4}',
     '#story .dice.fail{background:rgba(180,140,40,.1);border:2px solid #8a7a20;color:#6a5a10}'),
    
    # #story .dice.critfail
    ('#story .dice.critfail{background:#260f0f;border:1px solid #a33;color:#e8a0a0}',
     '#story .dice.critfail{background:rgba(122,42,26,.1);border:2px solid #8a3a2a;color:#6a2a1a}'),
    
    # #story .res 结果块
    ('#story .res{font-family:Georgia,serif;font-size:13px;color:var(--gold);background:#1a1428;border-left:3px solid var(--gold);padding:6px 12px;margin:8px 0;text-indent:0}',
     '#story .res{font-family:Georgia,serif;font-size:14px;font-weight:600;color:#5a4a10;background:rgba(122,90,16,.08);border-left:3px solid #7a5a10;padding:8px 14px;margin:10px 0;text-indent:0}'),
    
    # #story blockquote 引用块
    ('#story blockquote{border-left:3px solid var(--gold);background:#141c2e;padding:8px 14px;margin:10px 0;color:var(--gold2);font-style:italic;text-indent:0}',
     '#story blockquote{border-left:3px solid #7a5a10;background:rgba(122,90,16,.06);padding:10px 16px;margin:12px 0;color:#5a4a10;font-style:italic;text-indent:0}'),
    
    # #story .where 地点信息
    ('#story .where{color:var(--dim);font-size:13px;text-indent:0;margin-bottom:12px;border-left:3px solid var(--line);padding-left:10px}',
     '#story .where{color:#5a4a30;font-size:14px;font-weight:600;text-indent:0;margin-bottom:14px;border-left:3px solid #a09070;padding-left:12px}'),
    
    # #story .place 地点标题
    ('#story .place{color:var(--gold2);font-size:17px;font-weight:700;text-indent:0;letter-spacing:1px;margin-bottom:4px}',
     '#story .place{color:#5a4a10;font-family:"Noto Serif SC",serif;font-size:20px;font-weight:900;text-indent:0;letter-spacing:3px;margin-bottom:6px;text-align:center}'),
    
    # .char-info-row 角色信息行
    ('.char-info-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #2a3a4a;}',
     '.char-info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #c0b090;}'),
    
    # #modal 遮罩（保持深色但稍微透明一点）
    ('#modal{position:fixed;inset:0;background:rgba(4,8,16,.88);display:none;align-items:center;justify-content:center;z-index:50;overflow-y:auto}',
     '#modal{position:fixed;inset:0;background:rgba(20,16,8,.7);display:none;align-items:center;justify-content:center;z-index:50;overflow-y:auto;backdrop-filter:blur(4px)}'),
]

count = 0
for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1
        print(f"✓ {old[:45]}...")
    else:
        print(f"✗ 未找到: {old[:45]}...")

print(f"\n共替换 {count}/{len(replacements)} 处")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
