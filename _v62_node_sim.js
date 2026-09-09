// v62 ChunkLoader 运行时仿真（node stub，无真实 DOM）
// 验证：loader 块可执行 / manifest 存在 / 片文件合并 N / writeNext 包装存在 / 队列机制
const fs = require('fs');
const path = require('path');

let errs = 0;
const BASE = process.cwd();
const html = fs.readFileSync(path.join(BASE, 'game.html'), 'utf-8');

// ---- stub 环境 ----
const scriptTags = []; // 记录动态注入的 script
let markCalled = null;
const win = { N: {} };
const doc = {
  _head: null,
  head: { appendChild: function(s) { scriptTags.push(s); s.onload && s.onload(); } },
  createElement: function(tag) { return { tag: tag, set src(v) { this._src = v; } }; },
  getElementById: function() { return null; },
};
const ls = { getItem: () => null, setItem: () => {} };
global.window = win;
global.document = doc;
global.localStorage = ls;
global.curNode = undefined;

// ---- 提取 loader 块 ----
function extractLoader(h) {
  const start = h.indexOf('<!-- /v62inj:loader/ -->');
  if (start === -1) { console.log('FAIL: loader 块缺失'); errs++; return null; }
  let end = h.indexOf('</script>', start);
  if (end === -1) { console.log('FAIL: loader 结束缺失'); errs++; return null; }
  let js = h.slice(start, end + 9);
  js = js.replace(/<!-- \/v\d+inj:loader\/ -->\s*/g, '').replace(/<script>\s*/g, '').replace(/<\/script>\s*$/g, '');
  return js;
}

const loaderJs = extractLoader(html);
let origWriteNext = null;
if (loaderJs) {
  // 模拟真实环境存在 writeNext（loader 的包装 IIFE 依赖它）
  win.writeNext = function() { return 'orig-wn'; };
  origWriteNext = win.writeNext;
  try {
    new Function('window', 'document', 'localStorage', loaderJs)(win, doc, ls);
    console.log('PASS: loader 块 stub 执行');
  } catch (e) { console.log('FAIL: loader 块异常: ' + e.message); errs++; }
}

// ---- 验证 manifest + loader 对象 ----
const man = win.v62_manifest || {};
const manKeys = Object.keys(man).sort().join(',');
console.log('manifest 片数: ' + Object.keys(man).length + ' (' + manKeys + ')');
if (Object.keys(man).length >= 11 && man.seal && man.academy && man.city && man.npc) {
  console.log('PASS: v62_manifest 11 片注册');
} else { console.log('FAIL: v62_manifest 异常'); errs++; }
if (win.v62_chunk_loader && typeof win.v62_chunk_loader.loadChunk === 'function' && typeof win.v62_chunk_loader.owner === 'function') {
  console.log('PASS: v62_chunk_loader 暴露');
} else { console.log('FAIL: v62_chunk_loader 未暴露'); errs++; }
if (win.v62_chunk_loader.owner('seal1_0') === 'seal' && win.v62_chunk_loader.owner('origin_1') === 'origin' && win.v62_chunk_loader.owner('arc_mage_1') === 'arc') {
  console.log('PASS: owner 单前缀归属');
} else { console.log('FAIL: owner 单前缀判断错误'); errs++; }
if (win.v62_chunk_loader.owner('cityev_free_refugee') === 'city' && win.v62_chunk_loader.owner('classmate_fates') === 'npc' && win.v62_chunk_loader.owner('academy_entrance') === 'academy') {
  console.log('PASS: owner 多前缀归属 (cityev->city / classmate->npc)');
} else { console.log('FAIL: owner 多前缀判断错误'); errs++; }
if (win.v62_chunk_loader.owner('prologue_start') === null) {
  console.log('PASS: owner 非片节点返回 null');
} else { console.log('FAIL: owner 非片节点误判'); errs++; }

// ---- 片文件执行：合并 N + mark（测 seal 与新片 origin）----
try {
  const sealJs = fs.readFileSync(path.join(BASE, 'chunks', 'v62_seal.js'), 'utf-8');
  new Function('window', 'document', 'localStorage', sealJs)(win, doc, ls);
  const cnt = Object.keys(win.N).length;
  if (cnt === 509) { console.log('PASS: seal 片合并 N=' + cnt); }
  else { console.log('FAIL: seal 片合并节点数=' + cnt + '（期望 509）'); errs++; }
  const originJs = fs.readFileSync(path.join(BASE, 'chunks', 'v62_origin.js'), 'utf-8');
  new Function('window', 'document', 'localStorage', originJs)(win, doc, ls);
  const cnt2 = Object.keys(win.N).length;
  if (cnt2 === 509 + 105) { console.log('PASS: origin 片合并 N=' + cnt2); }
  else { console.log('FAIL: origin 片合并节点数=' + cnt2 + '（期望 614）'); errs++; }
  if (win.v62_chunk_loader.isLoaded('seal') && win.v62_chunk_loader.isLoaded('origin')) { console.log('PASS: 多片 mark 生效'); }
  else { console.log('FAIL: isLoaded 未生效'); errs++; }
  // 新三片：academy(269) / city(161) / npc(155)
  const acaJs = fs.readFileSync(path.join(BASE, 'chunks', 'v62_academy.js'), 'utf-8');
  new Function('window', 'document', 'localStorage', acaJs)(win, doc, ls);
  const cityJs = fs.readFileSync(path.join(BASE, 'chunks', 'v62_city.js'), 'utf-8');
  new Function('window', 'document', 'localStorage', cityJs)(win, doc, ls);
  const npcJs = fs.readFileSync(path.join(BASE, 'chunks', 'v62_npc.js'), 'utf-8');
  new Function('window', 'document', 'localStorage', npcJs)(win, doc, ls);
  const total = Object.keys(win.N).length;
  if (total === 509 + 105 + 269 + 161 + 155) {
    console.log('PASS: 5 片合并 N=' + total);
  } else { console.log('FAIL: 片合并节点数=' + total); errs++; }
  if (win.v62_chunk_loader.isLoaded('academy') && win.v62_chunk_loader.isLoaded('city') && win.v62_chunk_loader.isLoaded('npc')) { console.log('PASS: 新片 mark 生效'); }
  else { console.log('FAIL: 新片 isLoaded 未生效'); errs++; }
} catch (e) { console.log('FAIL: 片文件异常: ' + e.message); errs++; }

// ---- writeNext 包装存在 + 未加载片触发加载 ----
let loadChunkCalled = null;
const origLoad = win.v62_chunk_loader.loadChunk;
win.v62_chunk_loader.loadChunk = function(name, cb) { loadChunkCalled = name; origLoad.call(this, name, cb); };

if (typeof win.writeNext === 'function' && win.writeNext !== origWriteNext) {
  console.log('PASS: writeNext 已 v62 包装');
} else { console.log('FAIL: writeNext 包装异常'); errs++; }

// 触发测试：curNode 指向片节点但 N 无该节点（模拟片未加载）→ writeNext 应触发 loadChunk
win.N = {}; // 清空（片未加载态）
global.N = win.N; // 包装内 typeof N[t] 解析全局 N
let fired = false;
const wrapped = win.writeNext;
win.writeNext = function() { fired = true; return wrapped.apply(this, arguments); };
global.curNode = 'seal1_0';
try { win.writeNext(); } catch (e) {}
if (loadChunkCalled === 'seal') { console.log('PASS: 未加载片节点触发 loadChunk("seal")'); }
else { console.log('FAIL: 未触发 loadChunk，got=' + loadChunkCalled); errs++; }

console.log(errs === 0 ? '仿真全部通过，ERRCOUNT=0' : ('仿真 FAIL 数=' + errs));
process.exitCode = errs === 0 ? 0 : 1;
