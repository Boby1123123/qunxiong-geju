#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v32 在设置面板添加主题切换按钮"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

old = """  h += "<div class='setting-row'><label>难度</label><select id='set-difficulty' onchange='saveSetting(\\"difficulty\\",this.value)'><option value='easy'>简单</option><option value='normal' selected>普通</option><option value='hard'>困难</option><option value='nightmare'>噩梦</option></select></div>";
  h += "<h4>AI 文笔增强</h4>";"""

new = """  h += "<div class='setting-row'><label>难度</label><select id='set-difficulty' onchange='saveSetting(\\"difficulty\\",this.value)'><option value='easy'>简单</option><option value='normal' selected>普通</option><option value='hard'>困难</option><option value='nightmare'>噩梦</option></select></div>";
  h += "<div class='setting-row'><label>界面主题</label><div>";
  h += "<button class='theme-btn' data-theme='warm' onclick='setTheme(\\"warm\\")'>温暖棕褐</button>";
  h += "<button class='theme-btn' data-theme='classic' onclick='setTheme(\\"classic\\")'>经典深蓝</button>";
  h += "<button class='theme-btn' data-theme='purple' onclick='setTheme(\\"purple\\")'>深蓝紫</button>";
  h += "<button class='theme-btn' data-theme='parchment' onclick='setTheme(\\"parchment\\")'>羊皮纸</button>";
  h += "</div></div>";
  h += "<h4>AI 文笔增强</h4>";"""

if old in html:
    html = html.replace(old, new)
    print("✓ 设置面板主题切换按钮添加完成")
else:
    print("✗ 未找到目标文本，尝试模糊匹配...")
    # 找到难度那行
    idx = html.find("set-difficulty")
    if idx > 0:
        # 找到这行结束
        line_end = html.find(";", idx)
        # 找到下一个h4
        h4_idx = html.find("<h4>AI", line_end)
        if h4_idx > 0:
            old_block = html[idx-100:h4_idx+30]
            print(f"找到目标区域: {old_block[:100]}...")
            # 替换
            html = html[:line_end+1] + "\n" + new.split("\n")[1] + "\n" + html[h4_idx:]
            print("✓ 模糊匹配替换完成")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"完成！文件大小: {len(html)} 字符")
