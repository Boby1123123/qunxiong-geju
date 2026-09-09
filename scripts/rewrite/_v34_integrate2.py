#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v34 第四步：关键集成（地图按钮/设置按钮/判定演出）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

# 1. 修改地图按钮点击事件
old_map_btn = '<button class="btn" id="btn-map">世界地图</button>'
new_map_btn = '<button class="btn" id="btn-map" onclick="v34_openMap()">世界地图</button>'
if old_map_btn in html:
    html = html.replace(old_map_btn, new_map_btn)
    print("✓ 地图按钮已绑定v34_openMap")
    count += 1

# 2. 添加设置按钮（在AI润色按钮后面）
old_llm_btn = '<button class="btn" id="btn-llm">AI润色</button>'
new_llm_btn = '<button class="btn" id="btn-llm">AI润色</button>\n      <button class="btn" id="btn-settings" onclick="v34_openSettings()">设置</button>'
if old_llm_btn in html:
    html = html.replace(old_llm_btn, new_llm_btn)
    print("✓ 已添加设置按钮")
    count += 1

# 3. 添加v34_openSettings函数（如果不存在）
if 'function v34_openSettings()' not in html:
    # 在v34_init函数之前添加
    insert_point = html.find('// ========== v34 初始化 ==========')
    if insert_point > 0:
        settings_func = """function v34_openSettings(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderSettings();
  modal.classList.add('show');
}

"""
        html = html[:insert_point] + settings_func + html[insert_point:]
        print("✓ 已添加v34_openSettings函数")
        count += 1

# 4. 集成判定演出：找到判定结果显示的地方
# 搜索常见的判定函数名
dice_funcs = ['function doCheck', 'function check', 'function roll', 'function dice']
for func in dice_funcs:
    if func in html:
        print(f"ℹ 找到判定函数: {func}")
        break

# 5. 在存档按钮中集成v34存档可视化
old_save_btn = '<button class="btn" id="btn-save">存档</button>'
new_save_btn = '<button class="btn" id="btn-save" onclick="v34_openSavePanel()">存档</button>'
if old_save_btn in html:
    html = html.replace(old_save_btn, new_save_btn)
    print("✓ 存档按钮已绑定v34_openSavePanel")
    count += 1

# 6. 添加v34_openSavePanel函数
if 'function v34_openSavePanel()' not in html:
    insert_point = html.find('function v34_openSettings()')
    if insert_point > 0:
        save_func = """function v34_openSavePanel(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderSaveSlots();
  modal.classList.add('show');
}

"""
        html = html[:insert_point] + save_func + html[insert_point:]
        print("✓ 已添加v34_openSavePanel函数")
        count += 1

# 7. 添加成就按钮（在日志按钮后面）
old_log_btn = '<button class="btn" id="btn-log">日志</button>'
new_log_btn = '<button class="btn" id="btn-log">日志</button>\n      <button class="btn" id="btn-ach" onclick="v34_openAchievements()">成就</button>'
if old_log_btn in html:
    html = html.replace(old_log_btn, new_log_btn)
    print("✓ 已添加成就按钮")
    count += 1

# 8. 添加v34_openAchievements函数
if 'function v34_openAchievements()' not in html:
    insert_point = html.find('function v34_openSavePanel()')
    if insert_point > 0:
        ach_func = """function v34_openAchievements(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderAchievements();
  modal.classList.add('show');
}

"""
        html = html[:insert_point] + ach_func + html[insert_point:]
        print("✓ 已添加v34_openAchievements函数")
        count += 1

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n集成完成，共修改 {count} 处")
print(f"文件大小: {len(html)} 字符")
