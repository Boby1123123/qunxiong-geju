#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31 按钮系统CSS插入脚本"""

import re

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v31_css = '''
/* ============ v31 按钮系统全面重构 ============ */

/* --- 基础按钮重置 --- */
.btn{
  background:var(--bg-input);
  border:1px solid var(--border);
  color:var(--text-primary);
  padding:10px 16px;
  border-radius:8px;
  cursor:pointer;
  font-size:14px;
  font-family:var(--font-body, 'Microsoft YaHei', sans-serif);
  transition:all .18s cubic-bezier(.4,0,.2,1);
  position:relative;
  overflow:hidden;
  line-height:1.5;
  letter-spacing:.5px;
}
.btn:hover{
  background:var(--bg-panel2);
  border-color:var(--border-light);
  transform:translateY(-1px);
  box-shadow:0 4px 12px rgba(0,0,0,.3);
}
.btn:active{
  transform:translateY(0);
  box-shadow:0 1px 4px rgba(0,0,0,.3);
}
.btn:focus-visible{
  outline:2px solid var(--text-gold);
  outline-offset:2px;
}

/* --- 按钮涟漪效果 --- */
.btn::after{
  content:'';
  position:absolute;
  top:50%;left:50%;
  width:0;height:0;
  background:rgba(255,255,255,.15);
  border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width .4s ease,height .4s ease;
  pointer-events:none;
}
.btn:active::after{
  width:300px;height:300px;
  transition:0s;
}

/* --- 三级按钮层级 --- */

/* 主按钮：金色渐变，最突出 */
.btn-primary{
  background:linear-gradient(135deg,#c9a227 0%,#f0d68a 45%,#e8c468 55%,#c9a227 100%);
  color:#1a1208;
  border:1px solid #f0d68a;
  box-shadow:0 2px 8px rgba(240,214,138,.25),inset 0 1px 0 rgba(255,255,255,.35);
  font-weight:600;
  letter-spacing:1px;
  text-shadow:0 1px 0 rgba(255,255,255,.2);
}
.btn-primary:hover{
  background:linear-gradient(135deg,#d4af37 0%,#f5e0a0 45%,#eed080 55%,#d4af37 100%);
  border-color:#f5e0a0;
  box-shadow:0 4px 16px rgba(240,214,138,.45),inset 0 1px 0 rgba(255,255,255,.45);
  transform:translateY(-2px);
  color:#1a1208;
}
.btn-primary:active{
  transform:translateY(0);
  box-shadow:0 1px 4px rgba(240,214,138,.3);
}

/* 次按钮：深灰边框，低调但清晰 */
.btn-secondary{
  background:linear-gradient(135deg,#1a2a44 0%,#243a5a 100%);
  color:var(--text-secondary);
  border:1px solid var(--border-light);
  box-shadow:0 2px 6px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.06);
  font-weight:500;
}
.btn-secondary:hover{
  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);
  border-color:#5a7ba8;
  color:var(--text-primary);
  box-shadow:0 4px 12px rgba(0,0,0,.4);
}

/* 三级按钮：纯文字+下划线 */
.btn-ghost{
  background:transparent;
  color:var(--text-muted);
  border:none;
  border-bottom:1px solid transparent;
  border-radius:0;
  padding:6px 4px;
  box-shadow:none;
}
.btn-ghost:hover{
  color:var(--text-gold);
  border-bottom-color:var(--text-gold);
  background:transparent;
  transform:none;
  box-shadow:none;
}

/* 危险按钮 */
.btn-danger{
  background:linear-gradient(135deg,#8b2929 0%,#c0392b 100%);
  color:#fff;
  border:1px solid #e74c3c;
  box-shadow:0 2px 8px rgba(231,76,60,.25);
}
.btn-danger:hover{
  background:linear-gradient(135deg,#a03030 0%,#e74c3c 100%);
  box-shadow:0 4px 16px rgba(231,76,60,.4);
}

/* 成功按钮 */
.btn-success{
  background:linear-gradient(135deg,#1e7a3c 0%,#27ae60 100%);
  color:#fff;
  border:1px solid #2ecc71;
  box-shadow:0 2px 8px rgba(46,204,113,.25);
}
.btn-success:hover{
  background:linear-gradient(135deg,#27ae60 0%,#2ecc71 100%);
  box-shadow:0 4px 16px rgba(46,204,113,.4);
}

/* --- 返回按钮专门美化 --- */
.btn-back{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px 22px;
  min-width:130px;
  justify-content:center;
  background:linear-gradient(135deg,#1a2a44 0%,#243a5a 100%);
  color:var(--text-secondary);
  border:1px solid var(--border-light);
  border-radius:8px;
  font-size:14px;
  font-weight:500;
  cursor:pointer;
  transition:all .18s ease;
  position:relative;
  overflow:hidden;
  box-shadow:0 2px 6px rgba(0,0,0,.3);
}
.btn-back::before{
  content:'\\2190';
  font-size:16px;
  transition:transform .18s ease;
  display:inline-block;
}
.btn-back::after{
  content:'';
  position:absolute;
  bottom:0;left:50%;
  width:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--text-gold),transparent);
  transition:width .25s ease;
  transform:translateX(-50%);
}
.btn-back:hover{
  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);
  border-color:var(--text-gold);
  color:var(--text-gold);
  transform:translateY(-1px);
  box-shadow:0 4px 12px rgba(0,0,0,.4),0 0 12px rgba(240,214,138,.15);
}
.btn-back:hover::before{
  transform:translateX(-4px);
}
.btn-back:hover::after{
  width:80%;
}
.btn-back:active{
  transform:translateY(0);
}

/* --- 选项按钮美化（参考Disco Elysium） --- */
.choice-btn{
  display:flex;
  align-items:flex-start;
  gap:12px;
  width:100%;
  text-align:left;
  padding:14px 18px;
  margin-bottom:8px;
  background:linear-gradient(90deg,rgba(15,26,46,.92) 0%,rgba(21,34,56,.85) 100%);
  border:1px solid var(--border);
  border-left:3px solid var(--border-light);
  border-radius:0 8px 8px 0;
  color:var(--text-primary);
  font-size:14px;
  line-height:1.6;
  cursor:pointer;
  transition:all .2s ease;
  position:relative;
  overflow:hidden;
}
.choice-btn::before{
  content:'\\25B8';
  color:var(--text-muted);
  font-size:11px;
  margin-top:4px;
  flex-shrink:0;
  transition:all .2s ease;
}
.choice-btn:hover{
  background:linear-gradient(90deg,rgba(21,34,56,.98) 0%,rgba(29,46,74,.92) 100%);
  border-left-color:var(--text-gold);
  border-color:var(--border-light);
  padding-left:22px;
  box-shadow:0 2px 12px rgba(0,0,0,.3),inset 0 0 20px rgba(240,214,138,.03);
}
.choice-btn:hover::before{
  content:'\\25B6';
  color:var(--text-gold);
  transform:translateX(4px);
}
.choice-btn:active{
  transform:translateX(2px);
}
.choice-btn.visited{
  opacity:.55;
  border-left-color:var(--text-muted);
}
.choice-btn.visited::before{
  content:'\\2713';
  color:var(--success);
  font-size:12px;
}
.choice-btn.visited:hover{
  opacity:.75;
  padding-left:18px;
}
.choice-btn.gold-option{
  border-left-color:var(--text-gold);
  background:linear-gradient(90deg,rgba(240,214,138,.08) 0%,rgba(21,34,56,.9) 100%);
}
.choice-btn.gold-option::before{
  color:var(--text-gold);
}
.choice-btn.danger-option{
  border-left-color:var(--danger);
}
.choice-btn.danger-option::before{
  color:var(--danger);
}

/* --- 行动按钮（面板内） --- */
.btn.act{
  flex:1 1 auto;
  min-width:110px;
  padding:10px 12px;
  font-size:13px;
  text-align:center;
  background:linear-gradient(135deg,#1a2a44 0%,#1f3050 100%);
  border:1px solid var(--border);
  border-radius:8px;
  color:var(--text-secondary);
  transition:all .15s ease;
}
.btn.act:hover{
  background:linear-gradient(135deg,#243a5a 0%,#2d4566 100%);
  border-color:var(--text-gold);
  color:var(--text-gold);
  transform:translateY(-1px);
  box-shadow:0 3px 10px rgba(0,0,0,.35);
}

/* --- 顶部导航按钮 --- */
.top-btn{
  padding:7px 14px;
  background:linear-gradient(135deg,rgba(26,42,68,.8) 0%,rgba(36,58,90,.8) 100%);
  border:1px solid var(--border);
  border-radius:6px;
  color:var(--text-secondary);
  font-size:13px;
  cursor:pointer;
  transition:all .15s ease;
  white-space:nowrap;
}
.top-btn:hover{
  background:linear-gradient(135deg,rgba(36,58,90,.9) 0%,rgba(45,69,102,.9) 100%);
  border-color:var(--text-gold);
  color:var(--text-gold);
  transform:translateY(-1px);
}
.top-btn.active{
  background:linear-gradient(135deg,rgba(240,214,138,.15) 0%,rgba(240,214,138,.08) 100%);
  border-color:var(--text-gold);
  color:var(--text-gold);
  box-shadow:0 0 10px rgba(240,214,138,.2);
}

/* --- 按钮组 --- */
.btn-group{
  display:flex;
  gap:10px;
  justify-content:flex-end;
  flex-wrap:wrap;
}
.btn-group .btn{
  min-width:100px;
}

/* --- 禁用按钮 --- */
.btn:disabled,.btn.disabled{
  opacity:.4;
  cursor:not-allowed;
  transform:none !important;
  box-shadow:none !important;
}
.btn:disabled:hover,.btn.disabled:hover{
  background:var(--bg-input);
  border-color:var(--border);
  color:var(--text-muted);
}
'''

# 在</style>前插入
html = html.replace('</style>', v31_css + '\n</style>')

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("v31 按钮系统CSS插入完成")
print(f"文件大小: {len(html)} 字符")
