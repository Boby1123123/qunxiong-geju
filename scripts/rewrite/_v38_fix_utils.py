#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复nodeExists函数：简化逻辑，直接检查window.N"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 替换整个ELDA.utils部分，简化逻辑
old_utils_start = "// ============================================================\n// 工具函数\n// ============================================================"
old_utils_end = "// ============================================================\n// 事件总线\n// ============================================================"

# 找到工具函数部分的起始和结束位置
start_pos = html.find(old_utils_start)
end_pos = html.find(old_utils_end)

if start_pos > 0 and end_pos > 0:
    # 替换工具函数部分
    new_utils = """// ============================================================
// 工具函数
// ============================================================

// 获取节点对象（直接引用window.N，确保始终获取最新数据）
ELDA.utils.getNodes = function() {
  return (typeof window.N !== 'undefined') ? window.N : (typeof N !== 'undefined' ? N : {});
};

// 检查节点是否存在
ELDA.utils.nodeExists = function(nodeId) {
  var nodes = ELDA.utils.getNodes();
  return typeof nodes[nodeId] !== 'undefined';
};

// 安全跳转：节点不存在时自动跳转到安全节点
ELDA.utils.safeGo = function(nodeId) {
  var nodes = ELDA.utils.getNodes();
  if (ELDA.utils.nodeExists(nodeId)) {
    return nodeId;
  } else {
    // 记录错误
    ELDA.errors.push({
      time: new Date().toISOString(),
      type: 'dead_link',
      nodeId: nodeId,
      message: '节点不存在，已自动跳转到安全节点'
    });
    // 尝试跳转到安全节点
    if (ELDA.utils.nodeExists('academy_elda_hub')) {
      return 'academy_elda_hub';
    } else if (ELDA.utils.nodeExists('arrive_generic')) {
      return 'arrive_generic';
    } else if (ELDA.utils.nodeExists('fc_jiaohui_entry')) {
      return 'fc_jiaohui_entry';
    } else {
      // 最后兜底：返回第一个可用节点
      var keys = Object.keys(nodes);
      return keys.length > 0 ? keys[0] : nodeId;
    }
  }
};

// 防抖函数
ELDA.utils.debounce = function(fn, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
};

// 节流函数
ELDA.utils.throttle = function(fn, limit) {
  var inThrottle = false;
  return function() {
    var context = this;
    var args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
};

// 深拷贝
ELDA.utils.deepClone = function(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(function(item) { return ELDA.utils.deepClone(item); });
  var cloned = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = ELDA.utils.deepClone(obj[key]);
    }
  }
  return cloned;
};

"""
    html = html[:start_pos] + new_utils + html[end_pos:]
    print('✓ 已替换工具函数部分（简化nodeExists逻辑）')
else:
    print('⚠ 未找到工具函数部分')

# 同时修改ELDA.init函数，简化初始化
old_init = """ELDA.init = function() {
  // 直接引用window.N和window.S，确保始终获取最新数据
  Object.defineProperty(ELDA, 'nodes', {
    get: function() { return (typeof window.N !== 'undefined') ? window.N : {}; },
    configurable: true
  });
  Object.defineProperty(ELDA, 'state', {
    get: function() { return (typeof window.S !== 'undefined') ? window.S : {}; },
    configurable: true
  });
  console.log('[ELDA v38] 框架初始化完成');
  console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.nodes).length);
  console.log('[ELDA v38] 按F12开启调试面板');
};"""
new_init = """ELDA.init = function() {
  console.log('[ELDA v38] 框架初始化完成');
  console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.utils.getNodes()).length);
  console.log('[ELDA v38] 按F12开启调试面板');
};"""
html = html.replace(old_init, new_init)

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print('✓ 已简化ELDA.init函数')
print(f'文件大小: {len(html)} 字符')
