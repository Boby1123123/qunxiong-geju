#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31 修改openModal函数"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

old = '''/* ============ 模态框 ============ */
function openModal(el){
  const m=$("modal");
  m.innerHTML="";
  // v30.1: 为所有弹窗自动添加底部"返回游戏"按钮
  if(el && !el.querySelector(".panel-footer") && !el.querySelector(".modal-actions")){
    if(!el.style.padding) el.style.padding = "4px 2px";
    const footer = document.createElement("div");
    footer.className = "panel-footer";
    footer.style.cssText = "margin-top:12px;padding-top:10px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:10px;";
    footer.innerHTML = "<button onclick='closeModal()' style='padding:8px 18px;border-radius:6px;cursor:pointer;border:1px solid var(--border);background:var(--bg-input);color:var(--text-secondary);font-size:14px;'>返回游戏</button>";
    el.appendChild(footer);
  }
  m.appendChild(el);
  m.classList.add("show");
}'''

new = '''/* ============ 模态框 ============ */
function openModal(el){
  const m=$("modal");
  m.innerHTML="";
  // v31: 标准化模态框容器
  const container = document.createElement("div");
  container.className = "v31-modal-container";
  // v31: 为所有弹窗自动添加底部"返回游戏"按钮（使用美化后的btn-back）
  if(el && !el.querySelector(".panel-footer") && !el.querySelector(".modal-actions")){
    if(!el.style.padding) el.style.padding = "8px 4px 4px";
    const footer = document.createElement("div");
    footer.className = "panel-footer v31-modal-footer";
    footer.innerHTML = "<button class='btn-back' onclick='closeModal()'>返回游戏</button>";
    el.appendChild(footer);
  }
  container.appendChild(el);
  m.appendChild(container);
  m.classList.add("show");
}'''

if old in html:
    html = html.replace(old, new)
    print("openModal函数修改成功")
else:
    print("未找到旧的openModal函数，尝试模糊匹配...")
    # 尝试找到函数开始位置
    idx = html.find('function openModal(el){')
    if idx >= 0:
        # 找到函数结束位置（下一个function或}）
        end_idx = html.find('function closeModal()', idx)
        if end_idx > 0:
            old_func = html[idx:end_idx]
            print(f"找到函数，长度: {len(old_func)}")
            print("函数前100字符:", old_func[:100])
    else:
        print("未找到openModal函数")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)
