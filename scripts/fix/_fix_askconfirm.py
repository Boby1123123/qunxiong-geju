# -*- coding: utf-8 -*-
"""修复：补 askConfirm 函数（确认对话框，同步返回布尔）"""
html = open('game.html', encoding='utf-8').read()

anchor = 'function newGame(){'
assert anchor in html, '未找到 newGame 定义锚点'

add = '''function askConfirm(msg){
  try{ return window.confirm(msg); }catch(e){ return true; }
}
'''
# 在 newGame 定义前插入
html = html.replace(anchor, add + anchor, 1)
open('game.html','w',encoding='utf-8').write(html)
print('✓ askConfirm 已补充')
