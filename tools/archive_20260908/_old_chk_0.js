

// ============================================================
// v38 框架更新：命名空间统一 + 错误处理增强 + 性能优化
// ============================================================

// ELDA全局命名空间
var ELDA = ELDA || {};

// 核心对象挂载
ELDA.nodes = ELDA.nodes || {};
ELDA.state = ELDA.state || {};
ELDA.utils = ELDA.utils || {};
ELDA.engine = ELDA.engine || {};
ELDA.ui = ELDA.ui || {};
ELDA.events = ELDA.events || {};
ELDA.errors = ELDA.errors || [];

// 向后兼容别名
// N和S在后续script中定义，这里不重复声明
// 向后兼容：通过window引用全局N/S

// ============================================================
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

// S对象初始化在ELDA.init()中执行

// 在所有script加载完成后初始化ELDA.nodes和ELDA.state
ELDA.init = function() {
  console.log('[ELDA v38] 框架初始化完成');
  console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.utils.getNodes()).length);
  console.log('[ELDA v38] 按F12开启调试面板');
};

// 如果页面已经加载完成，立即初始化；否则等待load事件
if (document.readyState === 'complete') {
  ELDA.init();
} else {
  window.addEventListener('load', ELDA.init);
}
console.log('[ELDA v38] 节点总数:', Object.keys(ELDA.nodes).length);
console.log('[ELDA v38] 按F12开启调试面板');


// ========== 事件总线 ==========
const V35_EventBus = {
  listeners: {},
  on(event, callback, priority = 10) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push({ callback, priority });
    this.listeners[event].sort((a, b) => a.priority - b.priority);
  },
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l.callback !== callback);
  },
  emit(event, data = {}) {
    if (!this.listeners[event]) return true;
    let propagate = true;
    for (const listener of this.listeners[event]) {
      const result = listener.callback(data);
      if (result === false) { propagate = false; break; }
    }
    return propagate;
  },
  once(event, callback) {
    const wrapper = (data) => { this.off(event, wrapper); return callback(data); };
    this.on(event, wrapper);
  },
  clear(event) {
    if (event) delete this.listeners[event];
    else this.listeners = {};
  }
};

// ========== 模块化系统 ==========
const V35_ModuleManager = {
  modules: {},
  register(name, module) {
    if (this.modules[name]) {
      return true; // 已注册则直接返回成功，避免重复调用报错
    }
    this.modules[name] = { ...module, loaded: false, initialized: false };
    return true;
  },
  load(name) {
    const mod = this.modules[name];
    if (!mod) { console.error('[V35] Module not found:', name); return false; }
    if (mod.loaded) return true;
    if (mod.dependencies) {
      for (const dep of mod.dependencies) {
        if (!this.modules[dep] || !this.modules[dep].loaded) {
          this.load(dep);
        }
      }
    }
    if (mod.onLoad) mod.onLoad();
    mod.loaded = true;
    V35_EventBus.emit('module:loaded', { module: name });
    return true;
  },
  unload(name) {
    const mod = this.modules[name];
    if (!mod || !mod.loaded) return false;
    if (mod.onUnload) mod.onUnload();
    mod.loaded = false;
    V35_EventBus.emit('module:unloaded', { module: name });
    return true;
  },
  init(name) {
    const mod = this.modules[name];
    if (!mod || !mod.loaded) return false;
    if (mod.initialized) return true;
    if (mod.onInit) mod.onInit();
    mod.initialized = true;
    V35_EventBus.emit('module:initialized', { module: name });
    return true;
  },
  get(name) { return this.modules[name]; },
  isLoaded(name) { return this.modules[name] && this.modules[name].loaded; }
};

// ========== 数据注册表 ==========
const V35_DataRegistry = {
  data: {},
  register(key, value, schema = null) {
    if (schema && !this.validate(value, schema)) {
      console.error('[V35] Data validation failed for:', key);
      return false;
    }
    this.data[key] = value;
    V35_EventBus.emit('data:registered', { key });
    return true;
  },
  get(key) { return this.data[key]; },
  update(key, updater) {
    if (!this.data[key]) return false;
    if (typeof updater === 'function') this.data[key] = updater(this.data[key]);
    else this.data[key] = { ...this.data[key], ...updater };
    V35_EventBus.emit('data:updated', { key });
    return true;
  },
  validate(data, schema) {
    if (!schema) return true;
    for (const key in schema) {
      const rule = schema[key];
      if (rule.required && data[key] === undefined) return false;
      if (data[key] !== undefined && rule.type && typeof data[key] !== rule.type) return false;
    }
    return true;
  },
  keys() { return Object.keys(this.data); }
};

// ========== 组件系统 ==========
const V35_Component = {
  components: {},
  register(name, definition) {
    this.components[name] = definition;
  },
  create(name, props = {}) {
    const def = this.components[name];
    if (!def) { console.error('[V35] Component not found:', name); return null; }
    const instance = {
      ...def,
      props,
      state: def.initialState ? { ...def.initialState } : {},
      el: null,
      setState(newState) {
        this.state = { ...this.state, ...newState };
        if (this.el && this.render) {
          this.el.innerHTML = this.render(this.state, this.props);
        }
      },
      mount(container) {
        this.el = document.createElement('div');
        this.el.className = 'v35-component v35-' + name;
        if (this.render) this.el.innerHTML = this.render(this.state, this.props);
        if (this.onMount) this.onMount(this.el);
        container.appendChild(this.el);
        return this.el;
      },
      destroy() {
        if (this.onDestroy) this.onDestroy();
        if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
      }
    };
    return instance;
  }
};

// ========== 开发者控制台 ==========
const V35_DevConsole = {
  open: false,
  history: [],
  historyIndex: -1,
  
  init() {
    const panel = document.createElement('div');
    panel.id = 'v35-dev-console';
    panel.className = 'v35-dev-console';
    panel.innerHTML = `
      <div class="v35-dev-header">
        <span class="v35-dev-title">V35 开发者控制台</span>
        <div class="v35-dev-tabs">
          <button class="v35-dev-tab active" data-tab="console">控制台</button>
          <button class="v35-dev-tab" data-tab="vars">变量</button>
          <button class="v35-dev-tab" data-tab="nodes">节点</button>
          <button class="v35-dev-tab" data-tab="events">事件</button>
        </div>
        <button class="v35-dev-close" onclick="V35_DevConsole.toggle()">✕</button>
      </div>
      <div class="v35-dev-body">
        <div class="v35-dev-tab-content active" id="v35-dev-tab-console">
          <div class="v35-dev-output" id="v35-dev-output"></div>
          <div class="v35-dev-input-row">
            <input type="text" id="v35-dev-input" placeholder="输入命令 (help查看帮助)" />
            <button onclick="V35_DevConsole.execute()">执行</button>
          </div>
        </div>
        <div class="v35-dev-tab-content" id="v35-dev-tab-vars">
          <div id="v35-dev-vars-content"></div>
        </div>
        <div class="v35-dev-tab-content" id="v35-dev-tab-nodes">
          <div class="v35-dev-node-tools">
            <input type="text" id="v35-dev-node-input" placeholder="节点ID" />
            <button onclick="V35_DevConsole.jumpNode()">跳转</button>
            <button onclick="V35_DevConsole.listNodes()">列出节点</button>
          </div>
          <div id="v35-dev-nodes-content"></div>
        </div>
        <div class="v35-dev-tab-content" id="v35-dev-tab-events">
          <div id="v35-dev-events-content"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    
    // Tab切换
    panel.querySelectorAll('.v35-dev-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.v35-dev-tab').forEach(t => t.classList.remove('active'));
        panel.querySelectorAll('.v35-dev-tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('v35-dev-tab-' + tab.dataset.tab).classList.add('active');
        if (tab.dataset.tab === 'vars') this.refreshVars();
        if (tab.dataset.tab === 'events') this.refreshEvents();
      });
    });
    
    // 输入框回车
    const input = panel.querySelector('#v35-dev-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.execute();
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          input.value = this.history[this.history.length - 1 - this.historyIndex];
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          input.value = this.history[this.history.length - 1 - this.historyIndex];
        } else {
          this.historyIndex = -1;
          input.value = '';
        }
      }
    });
    
    // ~键打开
    document.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        const tag = document.activeElement.tagName;
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
          e.preventDefault();
          this.toggle();
        }
      }
    });
    
    this.log('开发者控制台已就绪。输入 help 查看命令。');
  },
  
  toggle() {
    this.open = !this.open;
    document.getElementById('v35-dev-console').classList.toggle('open', this.open);
    if (this.open) document.getElementById('v35-dev-input').focus();
  },
  
  log(msg, type = 'info') {
    const output = document.getElementById('v35-dev-output');
    if (!output) return;
    const line = document.createElement('div');
    line.className = 'v35-dev-log v35-dev-log-' + type;
    line.textContent = '> ' + msg;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  },
  
  execute() {
    const input = document.getElementById('v35-dev-input');
    const cmd = input.value.trim();
    if (!cmd) return;
    this.history.push(cmd);
    this.historyIndex = -1;
    this.log(cmd, 'cmd');
    input.value = '';
    
    try {
      const parts = cmd.split(' ');
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);
      
      switch (command) {
        case 'help':
          this.log('命令列表:');
          this.log('  help - 显示帮助');
          this.log('  clear - 清空控制台');
          this.log('  jump <nodeId> - 跳转到节点');
          this.log('  set <attr> <value> - 设置属性 (如 set gold 9999)');
          this.log('  get <attr> - 查看属性');
          this.log('  list nodes - 列出所有节点');
          this.log('  list modules - 列出所有模块');
          this.log('  list events - 列出所有事件监听器');
          this.log('  heal - 恢复满HP/MP/SAN');
          this.log('  exp <amount> - 增加经验');
          this.log('  eval <code> - 执行JS代码');
          break;
        case 'clear':
          document.getElementById('v35-dev-output').innerHTML = '';
          break;
        case 'jump':
          this.jumpNode(args[0]);
          break;
        case 'set':
          if (args[0] && args[1] !== undefined) {
            const val = isNaN(args[1]) ? args[1] : Number(args[1]);
            if (S.attrs && args[0].toUpperCase() in S.attrs) {
              S.attrs[args[0].toUpperCase()] = val;
            } else {
              S[args[0]] = val;
            }
            this.log(`已设置 ${args[0]} = ${val}`);
            if (typeof renderStats === 'function') renderStats();
          }
          break;
        case 'get':
          if (args[0]) {
            const val = S.attrs && args[0].toUpperCase() in S.attrs 
              ? S.attrs[args[0].toUpperCase()] 
              : S[args[0]];
            this.log(`${args[0]} = ${JSON.stringify(val)}`);
          }
          break;
        case 'list':
          if (args[0] === 'nodes') this.listNodes();
          else if (args[0] === 'modules') this.listModules();
          else if (args[0] === 'events') this.listEvents();
          break;
        case 'heal':
          if (S.hp !== undefined) S.hp = S.maxHp || 100;
          if (S.mp !== undefined) S.mp = S.maxMp || 100;
          if (S.san !== undefined) S.san = S.maxSan || 100;
          this.log('已恢复满HP/MP/SAN');
          if (typeof renderStats === 'function') renderStats();
          break;
        case 'exp':
          const amount = Number(args[0]) || 100;
          S.exp = (S.exp || 0) + amount;
          this.log(`增加 ${amount} 经验，当前: ${S.exp}`);
          break;
        case 'eval':
          const code = args.join(' ');
          const evalResult = eval(code);
          this.log(`结果: ${JSON.stringify(evalResult)}`);
          break;
        default:
          const defaultResult = eval(cmd);
          if (defaultResult !== undefined) this.log(`结果: ${JSON.stringify(defaultResult)}`);
      }
    } catch (err) {
      this.log('错误: ' + err.message, 'error');
    }
  },
  
  jumpNode(nodeId) {
    if (!nodeId) {
      nodeId = document.getElementById('v35-dev-node-input').value.trim();
    }
    if (!nodeId) return;
    if (typeof N !== 'undefined' && N[nodeId]) {
      curNode = nodeId;
      if (typeof writeNext === 'function') {
        const story = document.getElementById('story');
        if (story) story.innerHTML = '';
        writeNext();
      }
      this.log(`已跳转到节点: ${nodeId}`);
    } else {
      this.log(`节点不存在: ${nodeId}`, 'error');
    }
  },
  
  listNodes() {
    if (typeof N !== 'undefined') {
      const nodes = Object.keys(N);
      this.log(`共 ${nodes.length} 个节点`);
      const content = document.getElementById('v35-dev-nodes-content');
      if (content) {
        content.innerHTML = nodes.map(id => 
          `<div class="v35-dev-node-item" onclick="V35_DevConsole.jumpNode('${id}')">${id}</div>`
        ).join('');
      }
    }
  },
  
  listModules() {
    const modules = Object.keys(V35_ModuleManager.modules);
    this.log(`共 ${modules.length} 个模块`);
    modules.forEach(name => {
      const mod = V35_ModuleManager.modules[name];
      this.log(`  ${name}: ${mod.loaded ? '已加载' : '未加载'} ${mod.initialized ? '/已初始化' : ''}`);
    });
  },
  
  listEvents() {
    const events = Object.keys(V35_EventBus.listeners);
    this.log(`共 ${events.length} 个事件类型`);
    const content = document.getElementById('v35-dev-events-content');
    if (content) {
      content.innerHTML = events.map(ev => 
        `<div class="v35-dev-event-item"><b>${ev}</b>: ${V35_EventBus.listeners[ev].length} 个监听器</div>`
      ).join('');
    }
  },
  
  refreshVars() {
    const content = document.getElementById('v35-dev-vars-content');
    if (!content || typeof S === 'undefined') return;
    const vars = Object.keys(S).filter(k => typeof S[k] !== 'function');
    content.innerHTML = vars.map(key => {
      const val = S[key];
      const display = typeof val === 'object' ? JSON.stringify(val).substring(0, 100) : String(val);
      return `<div class="v35-dev-var-item"><b>${key}</b>: ${display}</div>`;
    }).join('');
  },
  
  refreshEvents() { this.listEvents(); }
};

// ========== 性能监控 ==========
const V35_Performance = {
  fps: 0,
  frameCount: 0,
  lastTime: performance.now(),
  renderTimes: [],
  
  startFrame() { this.frameStart = performance.now(); },
  endFrame() {
    if (!this.frameStart) return;
    const elapsed = performance.now() - this.frameStart;
    this.renderTimes.push(elapsed);
    if (this.renderTimes.length > 60) this.renderTimes.shift();
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
    }
  },
  getStats() {
    const avgRender = this.renderTimes.length 
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length 
      : 0;
    return {
      fps: this.fps,
      avgRenderTime: avgRender.toFixed(2),
      nodes: typeof N !== 'undefined' ? Object.keys(N).length : 0,
      memory: performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + 'MB' : 'N/A'
    };
  }
};

// ========== 存档版本迁移 ==========
const V35_SaveMigration = {
  currentVersion: 35,
  migrate(saveData) {
    if (!saveData.version) saveData.version = 21;
    let version = saveData.version;
    
    while (version < this.currentVersion) {
      const migration = this['migrate_' + version + '_to_' + (version + 1)];
      if (migration) {
        saveData = migration(saveData);
      }
      version++;
    }
    saveData.version = this.currentVersion;
    return saveData;
  },
  migrate_34_to_35(data) {
    if (!data.battle) data.battle = { active:false, turn:0, enemies:[], allies:[] };
    if (!data.magic) data.magic = { knownSpells:[], magicLevel:{}, materials:{} };
    if (!data.faction) data.faction = { joined:null, rank:0, reputation:{}, quests:[] };
    return data;
  }
};

// ========== 初始化 ==========
function v35_arch_init() {
  // 注册核心模块
  V35_ModuleManager.register('core', {
    name: '核心引擎',
    version: '1.0',
    onLoad() { V35_EventBus.emit('core:loaded'); },
    onInit() { V35_EventBus.emit('core:initialized'); }
  });
  
  V35_ModuleManager.register('ui', {
    name: 'UI系统',
    version: '2.0',
    dependencies: ['core'],
    onLoad() { V35_EventBus.emit('ui:loaded'); }
  });
  
  V35_ModuleManager.register('save', {
    name: '存档系统',
    version: '1.0',
    dependencies: ['core'],
    onLoad() { V35_EventBus.emit('save:loaded'); }
  });
  
  // 加载核心模块
  V35_ModuleManager.load('core');
  V35_ModuleManager.load('ui');
  V35_ModuleManager.load('save');
  V35_ModuleManager.init('core');
  
  // 初始化开发者控制台
  V35_DevConsole.init();
  
  // 事件日志（开发模式）
  V35_EventBus.on('*', (data) => {
    // 可以在这里记录所有事件
  });
  
  console.log('[V35] 技术架构基础已加载');
  if (typeof v35_initMagic === 'function') v35_initMagic();
  if (typeof v35_initFaction === 'function') v35_initFaction();



}
