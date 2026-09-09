#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v33 第二步：删除多主题 + 统一面板按钮背景 + 放大字体"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ========== 1. 删除v32多主题CSS ==========
import re
# 找到v32多主题系统的CSS块并删除
theme_css_start = html.find('/* ============ v32 多主题系统 ============ */')
if theme_css_start >= 0:
    # 找到.theme-btn样式结束的位置
    theme_css_end = html.find('/* 主题切换按钮 */', theme_css_start)
    if theme_css_end >= 0:
        # 找到.theme-btn的结束}
        theme_css_end = html.find('}', theme_css_end + 100)
        if theme_css_end >= 0:
            html = html[:theme_css_start] + html[theme_css_end+1:]
            print("✓ v32多主题CSS删除完成")
else:
    print("ℹ 未找到v32多主题CSS标记，尝试其他方式...")

# 删除body.theme-*的CSS规则
html = re.sub(r'body\.theme-(classic|purple|parchment)\{[^}]+\}', '', html)
print("✓ body.theme-* CSS规则删除")

# 删除.theme-btn CSS
html = re.sub(r'\.theme-btn\{[^}]+\}', '', html)
html = re.sub(r'\.theme-btn:hover\{[^}]+\}', '', html)
html = re.sub(r'\.theme-btn\.active\{[^}]+\}', '', html)
print("✓ .theme-btn CSS删除")

# ========== 2. 删除v32主题切换JS ==========
theme_js_start = html.find('/* v32 多主题切换系统 */')
if theme_js_start >= 0:
    theme_js_end = html.find('</script>', theme_js_start)
    if theme_js_end >= 0:
        html = html[:theme_js_start] + html[theme_js_end+9:]
        print("✓ v32主题切换JS删除")
else:
    print("ℹ 未找到v32主题切换JS")

# ========== 3. 删除设置面板中的主题切换按钮 ==========
old_settings_theme = """  h += "<div class='setting-row'><label>界面主题</label><div>";
  h += "<button class='theme-btn' data-theme='warm' onclick='setTheme(\\"warm\\")'>温暖棕褐</button>";
  h += "<button class='theme-btn' data-theme='classic' onclick='setTheme(\\"classic\\")'>经典深蓝</button>";
  h += "<button class='theme-btn' data-theme='purple' onclick='setTheme(\\"purple\\")'>深蓝紫</button>";
  h += "<button class='theme-btn' data-theme='parchment' onclick='setTheme(\\"parchment\\")'>羊皮纸</button>";
  h += "</div></div>";
  h += "<h4>AI 文笔增强</h4>";"""

new_settings_theme = '  h += "<h4>AI 文笔增强</h4>";'

if old_settings_theme in html:
    html = html.replace(old_settings_theme, new_settings_theme)
    print("✓ 设置面板主题切换按钮删除")
else:
    print("ℹ 未找到设置面板主题按钮（可能已被修改）")

# ========== 4. 统一修改面板/按钮/选项背景为方案D ==========
replacements = [
    # #modal .box 建号框
    ('#modal .box{background:linear-gradient(180deg,#251e15,#1c1710);',
     '#modal .box{background:linear-gradient(180deg,#e0d4b8,#d4c8a8);'),
    
    # .v31-modal-container
    ('.v31-modal-container{\n  background:linear-gradient(160deg,#221b12 0%,#1a150e 50%,#16120c 100%);',
     '.v31-modal-container{\n  background:linear-gradient(160deg,#e8dcc0 0%,#e0d4b8 50%,#d8ccb0 100%);'),
    
    # 选项按钮
    ('#options .opt{\n  display:flex;\n  align-items:flex-start;\n  gap:10px;\n  width:100%;\n  text-align:left;\n  background:linear-gradient(90deg,rgba(30,24,18,.92) 0%,rgba(38,30,22,.85) 100%);',
     '#options .opt{\n  display:flex;\n  align-items:flex-start;\n  gap:10px;\n  width:100%;\n  text-align:left;\n  background:linear-gradient(90deg,rgba(237,228,204,.95) 0%,rgba(228,216,188,.9) 100%);'),
    
    ('#options .opt:hover{\n  background:linear-gradient(90deg,rgba(38,30,22,.98) 0%,rgba(46,37,28,.92) 100%);',
     '#options .opt:hover{\n  background:linear-gradient(90deg,rgba(242,232,208,.98) 0%,rgba(232,220,192,.95) 100%);'),
    
    ('#options .opt.opt-gold{\n  border-left-color:var(--text-gold);\n  background:linear-gradient(90deg,rgba(201,162,39,.12) 0%,rgba(30,24,18,.9) 100%);',
     '#options .opt.opt-gold{\n  border-left-color:var(--text-gold);\n  background:linear-gradient(90deg,rgba(122,90,16,.12) 0%,rgba(237,228,204,.95) 100%);'),
    
    ('#options .opt.opt-gold:hover{\n  background:linear-gradient(90deg,rgba(201,162,39,.18) 0%,rgba(38,30,22,.92) 100%);',
     '#options .opt.opt-gold:hover{\n  background:linear-gradient(90deg,rgba(122,90,16,.18) 0%,rgba(242,232,208,.98) 100%);'),
    
    # 行动按钮
    ('.btn.act{\n  flex:1 1 auto;\n  min-width:110px;\n  padding:10px 12px;\n  font-size:13px;\n  text-align:center;\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);',
     '.btn.act{\n  flex:1 1 auto;\n  min-width:110px;\n  padding:12px 14px;\n  font-size:15px;\n  font-weight:700;\n  text-align:center;\n  background:linear-gradient(135deg,#d4c8a8 0%,#c8bca0 100%);'),
    
    ('.btn.act:hover{\n  background:linear-gradient(135deg,#382e20 0%,#423728 100%);',
     '.btn.act:hover{\n  background:linear-gradient(135deg,#e0d4b8 0%,#d4c8a8 100%);'),
    
    # 次按钮
    ('.btn-secondary{\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);',
     '.btn-secondary{\n  background:linear-gradient(135deg,#d4c8a8 0%,#c8bca0 100%);font-weight:700;'),
    
    ('.btn-secondary:hover{\n  background:linear-gradient(135deg,#332a1e 0%,#3d3325 100%);',
     '.btn-secondary:hover{\n  background:linear-gradient(135deg,#e0d4b8 0%,#d4c8a8 100%);'),
    
    # 返回按钮
    ('.btn-back{\n  display:inline-flex;\n  align-items:center;\n  gap:8px;\n  padding:10px 22px;\n  min-width:130px;\n  justify-content:center;\n  background:linear-gradient(135deg,#2a2218 0%,#332a1e 100%);',
     '.btn-back{\n  display:inline-flex;\n  align-items:center;\n  gap:8px;\n  padding:12px 24px;\n  min-width:140px;\n  justify-content:center;\n  font-size:15px;font-weight:700;\n  background:linear-gradient(135deg,#c0b090 0%,#b0a080 100%);'),
    
    ('.btn-back:hover{\n  background:linear-gradient(135deg,#332a1e 0%,#3d3325 100%);',
     '.btn-back:hover{\n  background:linear-gradient(135deg,#d0c0a0 0%,#c0b090 100%);'),
    
    # 顶部导航按钮
    ('.top-btn{\n  padding:7px 14px;\n  background:linear-gradient(135deg,rgba(42,34,24,.85) 0%,rgba(51,42,30,.85) 100%);',
     '.top-btn{\n  padding:8px 16px;\n  font-size:14px;font-weight:700;\n  background:linear-gradient(135deg,rgba(200,184,144,.9) 0%,rgba(184,168,128,.9) 100%);'),
    
    ('.top-btn:hover{\n  background:linear-gradient(135deg,rgba(51,42,30,.9) 0%,rgba(61,51,37,.9) 100%);',
     '.top-btn:hover{\n  background:linear-gradient(135deg,rgba(210,194,154,.95) 0%,rgba(194,178,138,.95) 100%);'),
    
    # 输入框
    ('input[type=text]{background:#2a2218;border:1px solid var(--border-light);color:var(--text-primary);padding:8px 12px;border-radius:6px;width:220px;font-size:14px}',
     'input[type=text]{background:#ede4cc;border:1px solid var(--border-light);color:var(--text-primary);padding:10px 14px;border-radius:6px;width:220px;font-size:16px;font-weight:600}'),
    
    # job-card和sel-card
    ('.job-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(42,34,24,.85),rgba(34,28,20,.9));',
     '.job-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(237,228,204,.95),rgba(228,216,188,.9));font-size:15px;font-weight:600;'),
    
    ('.job-card:hover,.job-card.sel{border-color:var(--gold);background:linear-gradient(135deg,rgba(51,42,30,.9),rgba(42,34,24,.95))}',
     '.job-card:hover,.job-card.sel{border-color:var(--gold);background:linear-gradient(135deg,rgba(242,232,208,.98),rgba(232,220,192,.95))}'),
    
    ('.sel-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(42,34,24,.85),rgba(34,28,20,.9));',
     '.sel-card{display:block;width:100%;text-align:left;background:linear-gradient(135deg,rgba(237,228,204,.95),rgba(228,216,188,.9));font-size:15px;font-weight:600;'),
    
    ('.sel-card:hover{border-color:var(--gold);background:linear-gradient(135deg,rgba(51,42,30,.9),rgba(42,34,24,.95))}',
     '.sel-card:hover{border-color:var(--gold);background:linear-gradient(135deg,rgba(242,232,208,.98),rgba(232,220,192,.95))}'),
]

count = 0
for old, new in replacements:
    if old in html:
        html = html.replace(old, new)
        count += 1
    else:
        print(f"  ✗ 未找到: {old[:40]}...")

print(f"✓ 面板/按钮/选项背景替换完成（{count}/{len(replacements)}处）")

# ========== 5. 放大故事文本字体 ==========
# #story 字体
old_story = '#story{'
if old_story in html:
    # 找到#story的CSS规则
    story_start = html.find('#story{')
    story_end = html.find('}', story_start)
    if story_end > 0:
        old_story_css = html[story_start:story_end+1]
        new_story_css = '#story{\n  color:var(--text-primary);\n  font-size:17px;\n  line-height:2.0;\n  font-weight:500;\n  padding:16px 20px;\n}'
        html = html[:story_start] + new_story_css + html[story_end+1:]
        print("✓ #story字体放大到17px")

# #story p 段落
old_story_p = '#story p{'
if old_story_p in html:
    p_start = html.find('#story p{')
    p_end = html.find('}', p_start)
    if p_end > 0:
        html = html[:p_start] + '#story p{\n  margin-bottom:14px;\n  text-indent:2em;\n  line-height:2.0;\n}' + html[p_end+1:]
        print("✓ #story p行高调整为2.0")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n第二步完成！文件大小: {len(html)} 字符")
