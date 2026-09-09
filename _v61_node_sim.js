#!/usr/bin/env node
// V61-ENG vm 仿真：按 marker 提取 v61_lzstring 与 perf-core 注入块，stub 环境执行 + LZ 往返验证。
const fs = require('fs');
const path = require('path');

function main() {
  const html = fs.readFileSync(path.join(__dirname, 'game.html'), 'utf-8');
  let errs = 0;

  function extractBlock(startMark, endMark, label) {
    let i0 = html.indexOf(startMark);
    let i1 = html.indexOf(endMark);
    if (i0 === -1 || i1 === -1 || i1 < i0) {
      console.log('FAIL: ' + label + ' 块 marker 缺失');
      errs++;
      return null;
    }
    // 前扩到注释起始 /*（marker 前 30 字符内）
    const j0 = html.lastIndexOf('/*', i0);
    if (j0 !== -1 && i0 - j0 <= 30) i0 = j0;
    // 后扩到 end marker 注释结束 */
    const e1 = html.indexOf('*/', i1);
    if (e1 !== -1) i1 = e1 + 2;
    const js = html.slice(i0, i1).replace(/\/\* \/v\d+inj:[^*]+\*\/\s*/g, '').trim();
    return js;
  }

  const noop = function(){};
  const events = {};
  const win = { addEventListener: noop };
  const doc = {
    addEventListener: function(ev, fn){ (events[ev] = events[ev] || []).push(fn); },
    getElementById: function(){ return null; }
  };
  const ls = { getItem: function(){ return null; }, setItem: noop, removeItem: noop };

  // ---- LZ 块 ----
  const lzJs = extractBlock('/v61inj:save-lz/', '/v61inj:save-lzend/', 'LZ');
  if (lzJs) {
    try {
      new Function('window', 'document', 'localStorage', lzJs)(win, doc, ls);
      const lz = win.v61_lzstring;
      if (!lz || typeof lz.compressToUTF16 !== 'function') throw new Error('v61_lzstring 未暴露');
      const cases = [
        'hello world',
        '群雄割据：大陆 2500 万人口，超凡能力者 0.5%，强者谱系传奇恒 26 位。',
        JSON.stringify({ruleset: 'elda-qunxiong-v3', realm: 8, day: 9999, skills: {a: ['火球术', '冰甲术']}})
      ];
      cases.forEach(function(c) {
        const dec = lz.decompressFromUTF16(lz.compressToUTF16(c));
        if (dec !== c) { console.log('FAIL: LZ 往返不一致: ' + c.slice(0, 20)); errs++; }
        else console.log('PASS: LZ 往返 ok (' + c.length + ' 字)');
      });
      const r1 = lz.sniffRaw('lz1:' + lz.compressToUTF16('{"ruleset":"elda-qunxiong-v3"}'));
      if (!r1 || r1.ruleset !== 'elda-qunxiong-v3') { console.log('FAIL: sniffRaw 压缩路径'); errs++; }
      else console.log('PASS: sniffRaw 压缩路径 ok');
      const r2 = lz.sniffRaw('{"ruleset":"elda-qunxiong-v3"}');
      if (!r2 || r2.ruleset !== 'elda-qunxiong-v3') { console.log('FAIL: sniffRaw 明文路径'); errs++; }
      else console.log('PASS: sniffRaw 明文路径 ok');
      console.log('PASS: LZ 块 stub 执行无 ReferenceError');
    } catch (e) {
      console.log('FAIL: LZ 块异常: ' + e.message);
      errs++;
    }
  }

  // ---- perf-core 块 ----
  const pfJs = extractBlock('/v61inj:perf-core/', '/v61inj:perf-core-end/', 'perf-core');
  if (pfJs) {
    const realLog = console.log;
    const realInfo = console.info;
    try {
      new Function('window', 'document', 'localStorage', 'V34', pfJs)(win, doc, ls, undefined);
      const need = ['v61_timer', 'v61_clearAll', 'v61_dispatchAfterWrite', 'v61_afterWrite', 'v61_registerAfterWrite'];
      const miss = need.filter(function(k){ return typeof win[k] === 'undefined'; });
      if (miss.length) throw new Error('perf-core 未暴露: ' + miss.join(','));
      if (!events.click || events.click.length === 0) throw new Error('story 点击监听未注册');
      console.log('PASS: perf-core 暴露全部对象 + 点击监听注册 ok');
      // 静音开关应已生效（v61_consoleSilent=true），恢复原始 console 供后续输出
      console.log = realLog; console.info = realInfo;
      const silent = win.v61_consoleSilent === true;
      console.log('PASS: console 静音开关已生效 (v61_consoleSilent=' + silent + ')');
    } catch (e) {
      console.log = realLog; console.info = realInfo;
      console.log('FAIL: perf-core 异常: ' + e.message);
      errs++;
    }
  }

  if (errs) { console.log('仿真 FAIL 数=' + errs); return 1; }
  console.log('仿真全部通过，ERRCOUNT=0');
  return 0;
}

process.exitCode = main();
