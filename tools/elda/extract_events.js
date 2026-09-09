// 提取 src/script_01.js 的 EVENT_POOL_EXT 数组并输出 JSON（elda test events 用）
const fs = require('fs');
const file = process.argv[2];
const s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('EVENT_POOL_EXT = [');
const b = s.indexOf(']; window.EVENT_POOL_EXT', a);
if (a < 0 || b < 0) { process.stdout.write('null'); process.exit(0); }
const t = s.slice(a + 'EVENT_POOL_EXT = '.length, b + 1);
let p = null;
try { p = Function('return ' + t)(); } catch (e) { p = null; }
process.stdout.write(JSON.stringify(p));
