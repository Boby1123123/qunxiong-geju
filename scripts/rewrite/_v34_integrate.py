#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v34 第三步：集成v34功能到现有系统"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

count = 0

# 1. 集成判定演出：在rollDice函数后调用v34_rollDice
# 找到现有的rollDice或判定函数，在结果显示后添加v34演出
old_roll = "function rollDice(attr, mod){"
if old_roll in html:
    # 在rollDice函数末尾添加v34演出调用（如果函数存在）
    print("✓ 找到rollDice函数")
else:
    print("ℹ 未找到rollDice函数，判定演出将通过其他方式触发")

# 2. 修改设置面板：添加v34设置入口
old_settings_btn = "openSettings()"
if old_settings_btn in html:
    # 检查设置面板函数是否存在，修改它使用v34_renderSettings
    old_settings_func = "function openSettings(){"
    if old_settings_func in html:
        # 找到函数结束位置，替换内容
        start = html.find(old_settings_func)
        if start > 0:
            # 找到函数的第一个{
            brace_start = html.find('{', start)
            depth = 0
            end = brace_start
            for i in range(brace_start, len(html)):
                if html[i] == '{': depth += 1
                elif html[i] == '}':
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            old_func = html[start:end+1]
            new_func = """function openSettings(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderSettings();
  modal.classList.add('show');
}"""
            html = html[:start] + new_func + html[end+1:]
            print("✓ 设置面板已替换为v34版本")
            count += 1

# 3. 修改世界地图按钮：使用v34_openMap
old_map_btn = "openMap()"
if old_map_btn in html:
    old_map_func = "function openMap(){"
    if old_map_func in html:
        start = html.find(old_map_func)
        if start > 0:
            brace_start = html.find('{', start)
            depth = 0
            end = brace_start
            for i in range(brace_start, len(html)):
                if html[i] == '{': depth += 1
                elif html[i] == '}':
                    depth -= 1
                    if depth == 0:
                        end = i
                        break
            old_func = html[start:end+1]
            new_func = """function openMap(){
  v34_openMap();
}"""
            html = html[:start] + new_func + html[end+1:]
            print("✓ 世界地图已替换为v34版本")
            count += 1

# 4. 在writeNext函数中添加选项动画
old_writenext = "function writeNext(){"
if old_writenext in html:
    # 在writeNext函数末尾添加v34_animateOptions调用
    # 找到函数中渲染选项的位置，在之后添加动画
    # 简单方式：在函数末尾添加setTimeout调用
    idx = html.find(old_writenext)
    if idx > 0:
        brace_start = html.find('{', idx)
        depth = 0
        end = brace_start
        for i in range(brace_start, len(html)):
            if html[i] == '{': depth += 1
            elif html[i] == '}':
                depth -= 1
                if depth == 0:
                    end = i
                    break
        # 在函数末尾的}之前添加动画调用
        insert_pos = end
        animation_code = "\n  setTimeout(function(){ if(typeof v34_animateOptions === 'function') v34_animateOptions(); }, 50);\n"
        html = html[:insert_pos] + animation_code + html[insert_pos:]
        print("✓ writeNext已集成选项动画")
        count += 1

# 5. 在剧情文字渲染中集成打字机效果（可选，默认关闭以避免影响现有逻辑）
# 暂时不修改writePar，保持现有渲染方式，打字机效果可通过设置开启

# 6. 添加成就解锁钩子（在关键事件处）
# 暂时不修改剧情逻辑，成就系统预留接口

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n集成完成，共修改 {count} 处")
print(f"文件大小: {len(html)} 字符")
