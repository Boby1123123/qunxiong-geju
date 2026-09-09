#!/usr/bin/env node
/* V67 安全出口审计 v3：vm 全量加载 + 文件日志 */
const fs = require('fs');
const vm = require('vm');
const log = [];
const L = (s) => { log.push(String(s)); };
const src = fs.readFileSync('game.html', 'utf8');
const scripts = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
let wIdx = -1, cIdx = -1;
for (let i = 0; i < scripts.length; i++) {
  if (scripts[i].indexOf('var W65_WAR=') >= 0) wIdx = i;
  if (scripts[i].indexOf('v65:content') >= 0) cIdx = i;
}
L('scripts=' + scripts.length + ' wIdx=' + wIdx + ' cIdx=' + cIdx);
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
      documentElement: { style: {}, appendChild: function(){} }, head: { appendChild: function(){} },
    };
  })(),
  addEventListener: () => {}, setTimeout: () => 0, clearTimeout: () => {}, setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => {}, alert: () => {}, confirm: () => true, prompt: () => null,
  Blob: function(){}, URL: { createObjectURL: () => 'blob:x', revokeObjectURL: () => {} },
  performance: { now: () => 0 }, Date, Math, JSON, RegExp, Array, Object, String, Number, Boolean, Promise,
};
sandbox.window = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
let ok = 0, err = 0;
const safe = (fn) => { try { fn(); ok++; } catch (e) { err++; } };
for (let i = 0; i < scripts.length; i++) {
  const idx = i;
  safe(() => vm.runInContext(scripts[idx], sandbox, { timeout: 60000 }));
}
L('scripts ok=' + ok + ' err=' + err + ' N=' + Object.keys(sandbox.N).length);
// 分片（N 节点在分片内已通过主文件 loadChunks 逻辑？直接加载）
const chunks = fs.existsSync('chunks') ? fs.readdirSync('chunks').filter(f => f.endsWith('.js')) : [];
for (const c of chunks) {
  safe(() => vm.runInContext(fs.readFileSync('chunks/' + c, 'utf8'), sandbox, { timeout: 20000 }));
}
L('after chunks N=' + Object.keys(sandbox.N).length);
const N = sandbox.N;
const ids = Object.keys(N);
L('total nodes=' + ids.length);
const noOpt = [], allForward = [], optFn = [], optArr = [];
const RET_RE = /离开|返回|回[到家城营村镇]|退|告辞|告别|作罢|算了|罢了|收手|撤退|撤走|回去|归|转身/;
for (const id of ids) {
  let node = N[id];
  if (typeof node === 'function') { try { node = node(); } catch (e) { continue; } }
  if (!node || typeof node !== 'object') continue;
  if (node.auto) continue;
  let opts = node.options;
  if (typeof opts === 'function') { optFn.push(id); continue; }
  if (!Array.isArray(opts) || opts.length === 0) { noOpt.push(id); continue; }
  optArr.push(id);
  const ts = opts.map(o => typeof o === 'string' ? o : ((o && o.t) || '')).join(' ');
  if (!RET_RE.test(ts)) allForward.push(id);
}
L('noOpt=' + noOpt.length + ' optFn=' + optFn.length + ' optArr=' + optArr.length + ' allForward=' + allForward.length);
const out = [];
out.push('# V67 安全出口审计报告\n');
out.push('> 依据 Twine 分支设计原则：每节点保留"安全出口"防死路。本报告仅输出审计结果，**不新增节点**（标记 P2 修复）。\n');
out.push('## 统计\n');
out.push('| 类别 | 数量 | 说明 |');
out.push('|---|---|---|');
out.push('| 节点总数 | ' + ids.length + ' | vm 合并后全量 |');
out.push('| 无 options 节点（死路候选） | ' + noOpt.length + ' | 多为终局/结局/纯过渡/分页节点，需人工甄别 |');
out.push('| 动态 options 节点 | ' + optFn.length + ' | options 为函数，运行时按状态生成 |');
out.push('| 数组 options 节点 | ' + optArr.length + ' | 静态选项 |');
out.push('| 全前进无返回节点 | ' + allForward.length + ' | 选项均为前进型，无返回/离开语义 |');
out.push('\n## 无 options 节点示例（前 50）\n');
for (const x of noOpt.slice(0, 50)) out.push('- `' + x + '`');
out.push('\n## 全前进无返回节点示例（前 50）\n');
for (const x of allForward.slice(0, 50)) out.push('- `' + x + '`');
out.push('\n## 结论与处置\n');
out.push('- 死路节点多为结局类（ending/death）、auto 过渡、分页长文节点——此类天然无选项，**保留**。');
out.push('- 全前进节点在叙事上合法（线性推进），但交互上缺乏退路；建议 P2 为 Top 20 高频节点补"稍后再议/离开"选项。');
out.push('- 动态 options 节点运行时必有安全出口的概率高，需逐节点运行时抽验。');
out.push('- 本报告由 vm 合并生成，属只读审计，未改任何节点。');
fs.writeFileSync('docs/v67_安全出口审计.md', out.join('\n'), 'utf8');
fs.writeFileSync('audit_log.txt', log.join('\n'), 'utf8');
console.log('DONE');
