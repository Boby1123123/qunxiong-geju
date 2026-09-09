#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31.1 修复建号界面背景太暗的问题"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 提亮#modal .box背景（建号框）
old_box = "#modal .box{background:linear-gradient(180deg,#12203a,#0d1728);border:1px solid var(--gold);border-radius:10px;max-width:760px;width:94%;max-height:92vh;overflow-y:auto;padding:24px 28px}"
new_box = "#modal .box{background:linear-gradient(180deg,#1a2d4d,#14223a);border:1px solid var(--gold);border-radius:12px;max-width:760px;width:94%;max-height:92vh;overflow-y:auto;padding:24px 28px;box-shadow:0 0 40px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.05)}"

if old_box in html:
    html = html.replace(old_box, new_box)
    print("✓ 提亮#modal .box背景")
else:
    print("✗ 未找到#modal .box")

# 2. 确保#modal内文字颜色足够亮
old_p = "#modal p{font-size:14px;line-height:1.8;margin:8px 0;color:var(--text)}"
new_p = "#modal p{font-size:14px;line-height:1.8;margin:8px 0;color:var(--text-primary)}"

if old_p in html:
    html = html.replace(old_p, new_p)
    print("✓ #modal p文字颜色改为--text-primary")
else:
    print("✗ 未找到#modal p")

# 3. 提亮#modal .sub次级文字
old_sub = "#modal .sub{color:var(--dim);font-size:13px}"
new_sub = "#modal .sub{color:var(--text-secondary);font-size:13px}"

if old_sub in html:
    html = html.replace(old_sub, new_sub)
    print("✓ #modal .sub文字颜色改为--text-secondary")
else:
    print("✗ 未找到#modal .sub")

# 4. 提亮输入框背景
old_input = "input[type=text]{background:#0c1626;border:1px solid var(--line);color:var(--text);padding:8px 12px;border-radius:4px;width:220px;font-size:14px}"
new_input = "input[type=text]{background:#16243d;border:1px solid var(--border-light);color:var(--text-primary);padding:8px 12px;border-radius:6px;width:220px;font-size:14px}"

if old_input in html:
    html = html.replace(old_input, new_input)
    print("✓ 提亮输入框背景和文字")
else:
    print("✗ 未找到input[type=text]")

# 5. 提亮.job-card和.sel-card背景
old_job = ".job-card{display:block;width:100%;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:10px 14px;margin:8px 0;cursor:pointer;transition:all .15s}"
new_job = ".job-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(26,45,77,.8),rgba(20,34,58,.9));border:1px solid var(--border);border-radius:8px;padding:10px 14px;margin:8px 0;cursor:pointer;transition:all .15s}"

if old_job in html:
    html = html.replace(old_job, new_job)
    print("✓ 提亮.job-card背景")
else:
    print("✗ 未找到.job-card")

old_sel = ".sel-card{display:block;width:100%;text-align:left;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:8px 12px;margin:5px 0;cursor:pointer;transition:all .15s;font-size:13px}"
new_sel = ".sel-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(26,45,77,.8),rgba(20,34,58,.9));border:1px solid var(--border);border-radius:8px;padding:8px 12px;margin:5px 0;cursor:pointer;transition:all .15s;font-size:13px}"

if old_sel in html:
    html = html.replace(old_sel, new_sel)
    print("✓ 提亮.sel-card背景")
else:
    print("✗ 未找到.sel-card")

# 6. 提亮.attr-row .note文字
old_note = ".attr-row .note{font-size:12px;color:var(--dim);width:150px}"
new_note = ".attr-row .note{font-size:12px;color:var(--text-secondary);width:150px}"

if old_note in html:
    html = html.replace(old_note, new_note)
    print("✓ 提亮.attr-row .note文字")
else:
    print("✗ 未找到.attr-row .note")

# 7. 提亮.job-card .jd文字
old_jd = ".job-card .jd{font-size:13px;color:var(--dim);margin-top:4px;line-height:1.6}"
new_jd = ".job-card .jd{font-size:13px;color:var(--text-secondary);margin-top:4px;line-height:1.6}"

if old_jd in html:
    html = html.replace(old_jd, new_jd)
    print("✓ 提亮.job-card .jd文字")
else:
    print("✗ 未找到.job-card .jd")

# 8. 提亮.sel-card .jd文字
old_seljd = ".sel-card .jd{font-size:12px;color:var(--dim);margin-top:2px;line-height:1.5}"
new_seljd = ".sel-card .jd{font-size:12px;color:var(--text-secondary);margin-top:2px;line-height:1.5}"

if old_seljd in html:
    html = html.replace(old_seljd, new_seljd)
    print("✓ 提亮.sel-card .jd文字")
else:
    print("✗ 未找到.sel-card .jd")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n完成！文件大小: {len(html)} 字符")
