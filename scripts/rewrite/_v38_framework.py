#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v38 框架更新：命名空间统一 + 错误处理增强"""

with open('game.html','r',encoding='utf-8') as f:
    html = f.read()

# 框架更新代码：命名空间统一 + 错误处理增强 + 性能优化
framework_code = '''

// ============================================================
// v38 框架更新：命名空间统一 + 错误处理增强 + 性能优化
// ============================================================

// ELDA全局命名空间
var ELDA = ELDA || {};

// 核心对象挂载
ELDA.nodes = ELDA.nodes || (typeof N !== 'undefined' ? N : {});
ELDA.state = ELDA.state || (typeof S !== 'undefined' ? S : {});
ELDA.utils = ELDA.utils || {};
ELDA.engine = ELDA.engine || {};
ELDA.ui = ELDA.ui || {};
ELDA.events = ELDA.events || {};
ELDA.errors = ELDA.errors || [];

// 向后兼容别名
if (typeof N === 'undefined') { var N = ELDA.nodes; }
if (typeof S === 'undefined') { var S = ELDA.state; }

// ============================================================
// 工具函数
// ============================================================

// 检查节点是否存在
ELDA.utils.nodeExists = function(nodeId) {
  return typeof ELDA.nodes[nodeId] !== 'undefined' && typeof ELDA.nodes[nodeId] === 'function';
};

// 安全跳转：节点不存在时自动跳转到安全节点
ELDA.utils.safeGo = function(nodeId) {
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

// ============================================================
// 事件总线
// ============================================================

ELDA.events._listeners = ELDA.events._listeners || {};

ELDA.events.on = function(eventName, callback) {
  if (!ELDA.events._listeners[eventName]) {
    ELDA.events._listeners[eventName] = [];
  }
  ELDA.events._listeners[eventName].push(callback);
  return function() {
    ELDA.events.off(eventName, callback);
  };
};

ELDA.events.off = function(eventName, callback) {
  if (ELDA.events._listeners[eventName]) {
    ELDA.events._listeners[eventName] = ELDA.events._listeners[eventName].filter(function(cb) {
      return cb !== callback;
    });
  }
};

ELDA.events.emit = function(eventName, data) {
  if (ELDA.events._listeners[eventName]) {
    ELDA.events._listeners[eventName].forEach(function(callback) {
      try {
        callback(data);
      } catch (e) {
        console.error('[ELDA事件错误]', eventName, e);
      }
    });
  }
};

// ============================================================
// 全局错误捕获
// ============================================================

window.addEventListener('error', function(event) {
  ELDA.errors.push({
    time: new Date().toISOString(),
    type: 'global_error',
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    col: event.colno
  });
  console.error('[ELDA全局错误]', event.message, event.filename + ':' + event.lineno);
});

window.addEventListener('unhandledrejection', function(event) {
  ELDA.errors.push({
    time: new Date().toISOString(),
    type: 'unhandled_rejection',
    message: event.reason ? event.reason.message : 'Unknown'
  });
  console.error('[ELDA未处理的Promise拒绝]', event.reason);
});

// ============================================================
// 调试面板（按F12开启/关闭）
// ============================================================

ELDA.ui.debugPanelVisible = false;

ELDA.ui.toggleDebugPanel = function() {
  ELDA.ui.debugPanelVisible = !ELDA.ui.debugPanelVisible;
  var panel = document.getElementById('elda-debug-panel');
  if (panel) {
    panel.style.display = ELDA.ui.debugPanelVisible ? 'block' : 'none';
  }
};

ELDA.ui.createDebugPanel = function() {
  if (document.getElementById('elda-debug-panel')) return;
  var panel = document.createElement('div');
  panel.id = 'elda-debug-panel';
  panel.style.cssText = 'position:fixed;top:10px;right:10px;width:300px;max-height:400px;overflow-y:auto;background:rgba(0,0,0,0.9);color:#0f0;border:1px solid #0f0;border-radius:5px;padding:10px;font-size:12px;font-family:monospace;z-index:99999;display:none;';
  panel.innerHTML = '<div style="font-weight:bold;margin-bottom:5px;">ELDA 调试面板 (F12切换)</div><div id="elda-debug-content"></div>';
  document.body.appendChild(panel);
};

ELDA.ui.updateDebugPanel = function() {
  var content = document.getElementById('elda-debug-content');
  if (!content) return;
  var nodeCount = Object.keys(ELDA.nodes).length;
  var errorCount = ELDA.errors.length;
  var currentNode = typeof curNode !== 'undefined' ? curNode : 'unknown';
  var html = '<div>节点总数: ' + nodeCount + '</div>';
  html += '<div>当前节点: ' + currentNode + '</div>';
  html += '<div>错误数: ' + errorCount + '</div>';
  html += '<div style="margin-top:5px;border-top:1px solid #0f0;padding-top:5px;">最近错误:</div>';
  var recentErrors = ELDA.errors.slice(-5);
  if (recentErrors.length === 0) {
    html += '<div style="color:#0f0;">无错误</div>';
  } else {
    recentErrors.forEach(function(err, i) {
      html += '<div style="color:#f00;margin-top:2px;">[' + err.type + '] ' + (err.message || err.nodeId || 'Unknown') + '</div>';
    });
  }
  content.innerHTML = html;
};

// 按F12切换调试面板
document.addEventListener('keydown', function(e) {
  if (e.key === 'F12') {
    e.preventDefault();
    ELDA.ui.createDebugPanel();
    ELDA.ui.toggleDebugPanel();
    ELDA.ui.updateDebugPanel();
  }
});

// ============================================================
// 性能监控
// ============================================================

ELDA.performance = ELDA.performance || {
  renderTimes: [],
  lastRenderTime: 0
};

ELDA.performance.recordRender = function(timeMs) {
  ELDA.performance.renderTimes.push(timeMs);
  if (ELDA.performance.renderTimes.length > 100) {
    ELDA.performance.renderTimes.shift();
  }
  ELDA.performance.lastRenderTime = timeMs;
};

ELDA.performance.getAverageRenderTime = function() {
  if (ELDA.performance.renderTimes.length === 0) return 0;
  var sum = ELDA.performance.renderTimes.reduce(function(a, b) { return a + b; }, 0);
  return sum / ELDA.performance.renderTimes.length;
};

// ============================================================
// S对象初始化与迁移
// ============================================================

ELDA.state.init = function() {
  var defaults = {
    player: { name: '', gender: '', race: '', origin: '', job: '', attrs: {}, realm: 0, exp: 0, hp: 100, mp: 100, san: 100 },
    time: { year: 1, month: 1, day: 1, period: 'morning', totalDays: 1, season: 'spring', weather: 'sunny' },
    inventory: { items: [], gold: 0, equipment: {} },
    relations: { npcs: {}, factions: {}, reputation: {} },
    quests: { active: [], completed: [], failed: [] },
    flags: {},
    foreshadowing: {},
    academy: { year: 1, courses: [], grades: {}, roommates: [], club: '' },
    world: { timers: {}, events: [], parallelEvents: [], cityStates: {} },
    meta: { playTime: 0, saveVersion: 'v38', achievements: [] }
  };
  // 合并默认值（不覆盖已有字段）
  for (var key in defaults) {
    if (defaults.hasOwnProperty(key) && typeof ELDA.state[key] === 'undefined') {
      ELDA.state[key] = defaults[key];
    }
  }
};

ELDA.state.migrate = function() {
  // 旧存档迁移：把散落的字段迁移到分类结构
  var migrated = false;
  // 检查是否是旧格式（没有player字段但有name字段）
  if (!ELDA.state.player && ELDA.state.name) {
    ELDA.state.player = ELDA.state.player || {};
    ['name', 'gender', 'race', 'origin', 'job', 'realm', 'exp', 'hp', 'mp', 'san'].forEach(function(key) {
      if (typeof ELDA.state[key] !== 'undefined') {
        ELDA.state.player[key] = ELDA.state[key];
        migrated = true;
      }
    });
  }
  if (!ELDA.state.time && ELDA.state.totalDays) {
    ELDA.state.time = ELDA.state.time || {};
    ['year', 'month', 'day', 'period', 'totalDays', 'season', 'weather'].forEach(function(key) {
      if (typeof ELDA.state[key] !== 'undefined') {
        ELDA.state.time[key] = ELDA.state[key];
        migrated = true;
      }
    });
  }
  if (migrated) {
    console.log('[ELDA] 旧存档已迁移到v38格式');
  }
  ELDA.state.init();
};

// 初始化S对象
if (ELDA.state && typeof ELDA.state.migrate === 'function') {
  // 已经初始化过了
} else {
  ELDA.state.migrate();
}

console.log('[ELDA v38] 框架初始化完成');
console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.nodes).length);
console.log('[ELDA v38] 按F12开启调试面板');

'''

# 插入框架更新代码到第一个script的开头
marker = '<script>'
first_script_pos = html.find(marker)
if first_script_pos > 0:
    insert_pos = first_script_pos + len(marker)
    html = html[:insert_pos] + framework_code + html[insert_pos:]
    print(f'✓ 已插入v38框架更新代码（命名空间+错误处理+性能优化+调试面板）')
else:
    print('⚠ 未找到script标签')

with open('game.html','w',encoding='utf-8') as f:
    f.write(html)

print(f'文件大小: {len(html)} 字符')
