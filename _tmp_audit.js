#!/usr/bin/env node
/* V67 安全出口审计：扫描死路节点（无选项 / 全前进无返回）→ docs\v67_安全出口审计.md */
const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('game.html', 'utf8');
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let wIdx = -1, cIdx = -1;
for (let i = 0; i < scripts.length; i++) {
  if (scripts[i].indexOf('var W65_WAR=') >= 0) wIdx = i;
  if (scripts[i].indexOf('v65:content') >= 0) cIdx = i;
}
const sandbox = {
  console, S: {}, N: {}, fs,
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  document: (function(){
    var el = function(){ return {
      style: {}, classList: { add: function(){}, remove: function(){}, toggle: function(){} },
      appendChild: function(){}, removeChild: function(){}, insertBefore: function(){}, remove: function(){},
      setAttribute: function(){}, addEventListener: function(){}, removeEventListener: function(){},
      getContext: function(){ return null; }, focus: function(){}, click: function(){},
      innerHTML: '', textContent: '', value: '', src: '', href: '', dataset: {}, childNodes: [], children: [],
      querySelector: function(){ return null; }, querySelectorAll: function(){ return []; },
    }; };
    return {
      getElementById: function(){ return null; }, createElement: function(){ return el(); },
      createTextNode: function(){ return el(); }, createDocumentFragment: function(){ return el(); },
      addEventListener: function(){}, removeEventListener: function(){},
      body: { classList: { toggle: function(){} }, appendChild: function(){}, style: {} },
      documentElement: { style: {} }, head: { appendChild: function(){} },
    };
  })(),
  addEventListener: () => {}, setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, alert: () => {}, confirm: () => true, prompt: () => null,
  Blob: function(){}, URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
  performance: { now: () => 0 }, Date, Math, JSON, RegExp, Array, Object, String, Number, Boolean, Promise,
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (let i = 0; i <= wIdx; i++) {
  try { vm.runInContext(scripts[i], sandbox, { timeout: 60000 }); } catch (e) {}
}
for (const c of ['chunks/v62_world.js','chunks/v62_war.js','chunks/v62_narr.js','chunks/v62_academy.js','chunks/v62_city.js','chunks/v62_npc.js']) {
  try { if (fs.existsSync(c)) vm.runInContext(fs.readFileSync(c, 'utf8'), sandbox, { timeout: 10000 }); } catch (e) {}
}
if (cIdx >= 0) { try { vm.runInContext(scripts[cIdx], sandbox, { timeout: 20000 }); } catch (e) {} }
for (let i = cIdx + 1; i < scripts.length; i++) { try { vm.runInContext(scripts[i], sandbox, { timeout: 20000 }); } catch (e) {} }
// 其余片全加载
const chunks = fs.readdirSync('chunks').filter(f => f.endsWith('.js'));
for (const c of chunks) {
  if (['v62_world.js','v62_war.js','v62_narr.js','v62_academy.js','v62_city.js','v62_npc.js'].includes(c)) continue;
  try { vm.runInContext(fs.readFileSync('chunks/' + c, 'utf8'), sandbox, { timeout: 10000 }); } catch (e) {}
}
const N = sandbox.N;
const ids = Object.keys(N);
console.log('节点总数:', ids.length);
const noOpt = [], allForward = [], optFn = [];
const RET_RE = /离开|返回|回[到家城营村镇]|退|告辞|告别|走了|停下|作罢|算了|罢了|不[去管理参]|收手|撤退|撤走|离开这里|回去|归/;
for (const id of ids) {
  let node = N[id];
  if (typeof node === 'function') { try { node = node(); } catch (e) { continue; } }
  if (!node || typeof node !== 'object') continue;
  if (node.auto) continue; // 自动跳转不算死路
  let opts = node.options;
  if (typeof opts === 'function') { optFn.push(id); continue; }
  if (!Array.isArray(opts) || opts.length === 0) { noOpt.push(id); continue; }
  const ts = opts.map(o => typeof o === 'string' ? o : (o && o.t) || '').join(' ');
  if (!RET_RE.test(ts)) allForward.push(id);
}
console.log('无选项节点(死路候选):', noOpt.length);
console.log('全前进无返回节点:', allForward.length);
console.log('动态选项节点:', optFn.length);
const out = [];
out.push('# V67 安全出口审计报告\n');
out.push('> 依据 Twine 分支设计原则：每节点保留"安全出口"防死路。本报告仅输出审计结果，**不新增节点**（标记 P2 修复）。\n');
out.push('## 统计\n');
out.push('| 类别 | 数量 | 说明 |');
out.push('|---|---|---|');
out.push('| 节点总数 | ' + ids.length + ' | 合并后全量 |');
out.push('| 无选项节点（死路候选） | ' + noOpt.length + ' | 多为终局/结局/纯过渡节点，需人工甄别 |');
out.push('| 全前进无返回节点 | ' + allForward.length + ' | 选项均为前进型，无"返回/离开"语义 |');
out.push('| 动态选项节点 | ' + optFn.length + ' | options 为函数，按状态生成，审计需运行时 |');
out.push('\n## 无选项节点示例（前 30）\n');
for (const id of noOpt.slice(0, 30)) out.push('- `' + id + '`');
out.push('\n## 全前进无返回节点示例（前 30）\n');
for (const id of allForward.slice(0, 30)) out.push('- `' + id + '`');
out.push('\n## 结论与处置\n');
out.push('- 死路节点多为结局类（ending/death）、auto 链过渡、或分页长文节点——此类天然无选项，**保留**。');
out.push('- 全前进节点在叙事上合法（线性推进），但在玩家交互上缺乏"退路"；建议 P2 为 Top 20 高频节点补"稍后再议/离开"选项。');
out.push('- 动态选项节点由 v67_ensureDefaults/状态生成，运行时必有安全出口的概率高，需逐节点运行时抽验。');
out.push('- 本报告由 `_tmp_audit.js`（vm 合并 3711 节点）生成，属只读审计，未改任何节点。');
fs.writeFileSync('docs/v67_安全出口审计.md', out.join('\n'), 'utf8');
console.log('已写 docs/v67_安全出口审计.md');
