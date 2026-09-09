#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v33 第四步：修复v21暮色金蓝主题覆盖方案D的问题"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # v21 body背景（覆盖方案D的元凶）
    ('body{background:radial-gradient(1200px 600px at 30% -10%, #1b2a4a 0%, #0d1321 55%, #080b14 100%);}',
     'body{background:radial-gradient(ellipse at 20% 10%, rgba(180,150,80,.12) 0%, transparent 50%),radial-gradient(ellipse at 80% 90%, rgba(100,130,90,.08) 0%, transparent 50%),linear-gradient(180deg, #e0d4b8 0%, #d4c8a8 50%, #c8bca0 100%);}'),
    
    # v21 body.night 夜间背景
    ('body.night{background:radial-gradient(1200px 600px at 70% 110%, #0a1a33 0%, #060913 60%, #03050c 100%);}',
     'body.night{background:radial-gradient(ellipse at 20% 10%, rgba(120,100,60,.15) 0%, transparent 50%),radial-gradient(ellipse at 80% 90%, rgba(60,80,100,.1) 0%, transparent 50%),linear-gradient(180deg, #d4c8a8 0%, #c8bca0 50%, #bcb094 100%);}'),
    
    # v21 #topbar 背景
    ('#topbar{background:linear-gradient(90deg, rgba(13,19,33,.96), rgba(27,42,74,.9));border-bottom:1px solid #2a3b5e;}',
     '#topbar{background:linear-gradient(90deg, rgba(200,184,144,.95), rgba(184,168,128,.9));border-bottom:1px solid #a09070;}'),
    
    # v21 .title 文字阴影
    ('.title{color:var(--gold);text-shadow:0 0 12px rgba(201,162,39,.35);}',
     '.title{color:var(--gold);text-shadow:0 1px 0 rgba(255,255,255,.3);}'),
    
    # v21 #flash 提示框
    ('#flash{position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:99;background:rgba(20,30,52,.96);\n  border:1px solid var(--gold);color:var(--gold2);padding:6px 18px;border-radius:20px;font-size:13px;\n  opacity:0;pointer-events:none;transition:opacity .35s;}',
     '#flash{position:fixed;top:52px;left:50%;transform:translateX(-50%);z-index:99;background:rgba(237,228,204,.98);\n  border:1px solid #7a5a10;color:#5a4a10;padding:8px 20px;border-radius:20px;font-size:14px;font-weight:600;\n  opacity:0;pointer-events:none;transition:opacity .35s;box-shadow:0 4px 16px rgba(0,0,0,.15);}'),
    
    # .g-card 卡片
    ('.g-card{background:#141d33;border:1px solid #2a3b5e;border-radius:8px;padding:8px;font-size:12px;}',
     '.g-card{background:#ede4cc;border:1px solid #b0a080;border-radius:8px;padding:10px;font-size:13px;color:#241a08;}'),
    
    # .board-job 告示板任务
    ('.board-job{border:1px solid #2a3b5e;border-radius:8px;padding:8px;margin:6px 0;background:#10182c;}',
     '.board-job{border:1px solid #b0a080;border-radius:8px;padding:10px;margin:8px 0;background:linear-gradient(135deg,#ede4cc,#e4d8bc);color:#241a08;}'),
    
    # .llm-modal input
    ('.llm-modal input{width:100%;padding:8px 10px;background:#0d1321;border:1px solid #2a3b5e;',
     '.llm-modal input{width:100%;padding:10px 12px;background:#ede4cc;border:1px solid #b0a080;color:#241a08;'),
    
    # v21 模态框系统（.modal-overlay等）
    ('.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:1000;display:flex;align-items:center;justify-content:center;}',
     '.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(20,16,8,.6);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}'),
    
    ('.panel-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #3a5a7a;background:rgba(0,0,0,0.2);}',
     '.panel-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #a09070;background:rgba(184,168,128,.3);}'),
    
    # v21 各种深色面板
    ('.tab-btn{flex:1;padding:6px;background:#1a2a3a;border:1px solid #3a5a7a;color:#8fa8c8;cursor:pointer;border-radius:4px;font-size:12px;}',
     '.tab-btn{flex:1;padding:8px;background:#d4c8a8;border:1px solid #a09070;color:#3a2e10;cursor:pointer;border-radius:4px;font-size:13px;font-weight:600;}'),
    
    ('.attr-cell{background:#1a2a3a;border:1px solid #3a5a7a;border-radius:4px;padding:8px;text-align:center;}',
     '.attr-cell{background:#ede4cc;border:1px solid #b0a080;border-radius:4px;padding:10px;text-align:center;color:#241a08;font-weight:600;}'),
    
    ('.cat-btn{padding:4px 10px;background:#1a2a3a;border:1px solid #3a5a7a;color:#8fa8c8;cursor:pointer;border-radius:4px;font-size:11px;}',
     '.cat-btn{padding:6px 12px;background:#d4c8a8;border:1px solid #a09070;color:#3a2e10;cursor:pointer;border-radius:4px;font-size:12px;font-weight:600;}'),
    
    ('.inv-item{background:#1a2a3a;border:1px solid #3a5a7a;border-radius:4px;padding:6px;text-align:center;cursor:pointer;position:relative;}',
     '.inv-item{background:#ede4cc;border:1px solid #b0a080;border-radius:4px;padding:8px;text-align:center;cursor:pointer;position:relative;color:#241a08;}'),
    
    ('.setting-row input,.setting-row select{flex:1;padding:6px;background:#1a2a3a;border:1px solid #3a5a7a;color:#e0e8f0;border-radius:4px;font-size:12px;}',
     '.setting-row input,.setting-row select{flex:1;padding:8px;background:#ede4cc;border:1px solid #b0a080;color:#241a08;border-radius:4px;font-size:14px;font-weight:600;}'),
    
    ('.top-btn{padding:4px 10px;background:#1a2a3a;border:1px solid #3a5a7a;color:#c8d8e8;cursor:pointer;border-radius:4px;font-size:12px;}',
     '.top-btn{padding:6px 14px;background:#c8bca0;border:1px solid #a09070;color:#241a08;cursor:pointer;border-radius:4px;font-size:13px;font-weight:700;}'),
    
    ('.quick-slot{width:40px;height:40px;background:#1a2a3a;border:1px solid #3a5a7a;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;}',
     '.quick-slot{width:44px;height:44px;background:#ede4cc;border:1px solid #b0a080;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;}'),
    
    ('.rep-bar-bg{flex:1;height:8px;background:#1a2a3a;border-radius:4px;overflow:hidden;}',
     '.rep-bar-bg{flex:1;height:10px;background:#c8bca0;border-radius:5px;overflow:hidden;}'),
    
    ('.skill-card{background:#1a2a3a;border:1px solid #3a5a7a;border-radius:4px;padding:10px;margin-bottom:8px;}',
     '.skill-card{background:#ede4cc;border:1px solid #b0a080;border-radius:6px;padding:12px;margin-bottom:10px;color:#241a08;}'),
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
