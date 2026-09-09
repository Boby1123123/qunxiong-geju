#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""修复ELDA.nodes初始化问题：直接使用window.N"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 修改nodeExists函数，直接使用window.N
old_node_exists = """ELDA.utils.nodeExists = function(nodeId) {
  return typeof ELDA.nodes[nodeId] !== 'undefined' && typeof ELDA.nodes[nodeId] === 'function';
};"""
new_node_exists = """ELDA.utils.nodeExists = function(nodeId) {
  var nodes = (typeof window.N !== 'undefined') ? window.N : ELDA.nodes;
  return typeof nodes[nodeId] !== 'undefined' && typeof nodes[nodeId] === 'function';
};"""
html = html.replace(old_node_exists, new_node_exists)

# 修改safeGo函数，直接使用window.N
old_safe_go = """ELDA.utils.safeGo = function(nodeId) {
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
    } else {
      // 最后兜底：返回第一个可用节点
      var firstNode = Object.keys(ELDA.nodes)[0];
      return firstNode || nodeId;
    }
  }
};"""
new_safe_go = """ELDA.utils.safeGo = function(nodeId) {
  var nodes = (typeof window.N !== 'undefined') ? window.N : ELDA.nodes;
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
    } else {
      // 最后兜底：返回第一个可用节点
      var firstNode = Object.keys(nodes)[0];
      return firstNode || nodeId;
    }
  }
};"""
html = html.replace(old_safe_go, new_safe_go)

# 修改ELDA.init函数，确保正确获取window.N
old_init = """ELDA.init = function() {
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
};"""
new_init = """ELDA.init = function() {
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
html = html.replace(old_init, new_init)

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print('✓ 已修复ELDA.nodes初始化问题（使用Object.defineProperty动态获取window.N）')
print(f'文件大小: {len(html)} 字符')
