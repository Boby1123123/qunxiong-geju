#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31 追加选项按钮增强和模态框容器CSS"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

additional_css = '''
/* ============ v31 选项按钮增强 ============ */
#options .opt{
  display:flex;
  align-items:flex-start;
  gap:10px;
  width:100%;
  text-align:left;
  background:linear-gradient(90deg,rgba(15,26,46,.92) 0%,rgba(21,34,56,.85) 100%);
  border:1px solid var(--border);
  border-left:3px solid var(--border-light);
  border-radius:0 8px 8px 0;
  color:var(--text-primary);
  padding:13px 16px;
  margin:7px 0;
  cursor:pointer;
  font-size:14px;
  line-height:1.65;
  transition:all .2s ease;
  position:relative;
  overflow:hidden;
}
#options .opt::before{
  content:'\\25B8';
  color:var(--text-muted);
  font-size:11px;
  margin-top:4px;
  flex-shrink:0;
  transition:all .2s ease;
}
#options .opt:hover{
  background:linear-gradient(90deg,rgba(21,34,56,.98) 0%,rgba(29,46,74,.92) 100%);
  border-left-color:var(--text-gold);
  border-color:var(--border-light);
  padding-left:20px;
  box-shadow:0 2px 12px rgba(0,0,0,.3),inset 0 0 20px rgba(240,214,138,.03);
  transform:translateX(3px);
}
#options .opt:hover::before{
  content:'\\25B6';
  color:var(--text-gold);
  transform:translateX(4px);
}
#options .opt:active{
  transform:translateX(1px);
}
#options .opt .od{
  display:none;
}
#options .opt .oh{
  color:var(--text-muted);
  font-size:12px;
  margin-left:6px;
}
#options .opt.opt-gold{
  border-left-color:var(--text-gold);
  background:linear-gradient(90deg,rgba(240,214,138,.1) 0%,rgba(21,34,56,.9) 100%);
}
#options .opt.opt-gold::before{
  color:var(--text-gold);
}
#options .opt.opt-gold:hover{
  background:linear-gradient(90deg,rgba(240,214,138,.15) 0%,rgba(29,46,74,.92) 100%);
  box-shadow:0 2px 16px rgba(240,214,138,.15);
}
#options .opt.opt-combat{ border-left-color:var(--danger); }
#options .opt.opt-combat::before{ color:var(--danger); }
#options .opt.opt-dialog{ border-left-color:var(--info); }
#options .opt.opt-dialog::before{ color:var(--info); }
#options .opt.opt-cultivate{ border-left-color:var(--purple); }
#options .opt.opt-cultivate::before{ color:var(--purple); }
#options .opt.opt-explore{ border-left-color:var(--success); }
#options .opt.opt-explore::before{ color:var(--success); }
#options .opt.opt-leave{ border-left-color:var(--text-muted); }

/* ============ v31 模态框容器 ============ */
.v31-modal-container{
  background:linear-gradient(160deg,#0f1a2e 0%,#152238 50%,#0d1626 100%);
  border:1px solid rgba(240,214,138,.18);
  border-radius:12px;
  box-shadow:
    0 0 0 1px rgba(0,0,0,.5),
    0 20px 60px rgba(0,0,0,.6),
    inset 0 1px 0 rgba(255,255,255,.05);
  max-height:85vh;
  overflow-y:auto;
  animation:v31ModalIn .3s cubic-bezier(.34,1.56,.64,1);
  position:relative;
}
@keyframes v31ModalIn{
  from{ opacity:0; transform:scale(.92) translateY(20px); }
  to{ opacity:1; transform:scale(1) translateY(0); }
}
.v31-modal-footer{
  margin-top:14px;
  padding-top:12px;
  border-top:1px solid rgba(240,214,138,.12);
  display:flex;
  justify-content:flex-end;
  gap:10px;
}
/* 模态框遮罩 */
#modal.show{
  background:rgba(5,10,20,.75);
  backdrop-filter:blur(6px);
  -webkit-backdrop-filter:blur(6px);
}
#modal{
  transition:background .2s ease;
}

/* ============ v31 滚动条增强 ============ */
.v31-modal-container::-webkit-scrollbar{ width:6px; }
.v31-modal-container::-webkit-scrollbar-track{ background:transparent; }
.v31-modal-container::-webkit-scrollbar-thumb{
  background:rgba(240,214,138,.2);
  border-radius:3px;
}
.v31-modal-container::-webkit-scrollbar-thumb:hover{
  background:rgba(240,214,138,.35);
}
'''

# 在</style>前插入
html = html.replace('</style>', additional_css + '\n</style>')

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("v31 选项按钮增强和模态框容器CSS追加完成")
print(f"文件大小: {len(html)} 字符")
