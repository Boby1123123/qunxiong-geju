#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复v38框架更新中的重复声明和初始化顺序问题"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 问题1：移除var N和var S的重复声明
old_n_declaration = "if (typeof N === 'undefined') { var N = ELDA.nodes; }"
new_n_declaration = "// N和S在后续script中定义，这里不重复声明"
old_s_declaration = "if (typeof S === 'undefined') { var S = ELDA.state; }"
new_s_declaration = "// 向后兼容：通过window引用全局N/S"

html = html.replace(old_n_declaration, new_n_declaration)
html = html.replace(old_s_declaration, new_s_declaration)

# 问题2：修改ELDA.nodes和ELDA.state的初始化，使用window引用
old_nodes_init = "ELDA.nodes = ELDA.nodes || (typeof N !== 'undefined' ? N : {});"
new_nodes_init = "ELDA.nodes = ELDA.nodes || {};"
old_state_init = "ELDA.state = ELDA.state || (typeof S !== 'undefined' ? S : {});"
new_state_init = "ELDA.state = ELDA.state || {};"

html = html.replace(old_nodes_init, new_nodes_init)
html = html.replace(old_state_init, new_state_init)

# 问题3：在框架代码末尾添加初始化函数，在所有script加载完成后执行
old_init_end = "console.log('[ELDA v38] 框架初始化完成');"
new_init_end = """// 在所有script加载完成后初始化ELDA.nodes和ELDA.state
ELDA.init = function() {
  if (typeof window.N !== 'undefined' && Object.keys(window.N).length > 0) {
    ELDA.nodes = window.N;
  }
  if (typeof window.S !== 'undefined') {
    ELDA.state = window.S;
    ELDA.state.migrate();
  }
  console.log('[ELDA v38] 框架初始化完成');
  console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.nodes).length);
  console.log('[ELDA v38] 按F12开启调试面板');
};

// 如果页面已经加载完成，立即初始化；否则等待load事件
if (document.readyState === 'complete') {
  ELDA.init();
} else {
  window.addEventListener('load', ELDA.init);
}"""

html = html.replace(old_init_end, new_init_end)

# 问题4：移除S对象初始化中的migrate调用（因为此时S还没定义）
old_migrate_call = """// 初始化S对象
if (ELDA.state && typeof ELDA.state.migrate === 'function') {
  // 已经初始化过了
} else {
  ELDA.state.migrate();
}"""
new_migrate_call = """// S对象初始化在ELDA.init()中执行"""

html = html.replace(old_migrate_call, new_migrate_call)

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print('✓ 已修复重复声明和初始化顺序问题')
print(f'文件大小: {len(html)} 字符')
