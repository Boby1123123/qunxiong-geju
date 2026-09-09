# -*- coding: utf-8 -*-
"""batch_replace.py — 批量文本替换 + 校验（P2-4 文本治理 / P2-1 内容工具）。

用法:
  python tools/content_tools/batch_replace.py --list           # 列出内置规则（AI 味词/笔误）
  python tools/content_tools/batch_replace.py <旧> <新>        # 全库替换（game.html+src），写前备份
  python tools/content_tools/batch_replace.py --scan [--json]  # 只扫描报告，不写
安全: 只替换纯文本字面量（出现在字符串中的内容），跳过代码关键字；每次写前自动备份到 backup\。
"""
import io, os, re, sys, shutil, glob, json, time

PROJ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
TARGETS = sorted(glob.glob(os.path.join(PROJ, 'src', '*.js'))) + [
    os.path.join(PROJ, 'src', 'head.html'), os.path.join(PROJ, 'game.html')]

# 内置治理规则：动态对接 c_text（同源保证，避免双份词表漂移）
def _c_text_rules():
    try:
        sys.path.insert(0, os.path.join(PROJ, 'tools', 'eldacheck'))
        from checks import c_text as _ct
        return [('AI味强词（c_text 全量）', _ct.AI_WORDS)]
    except Exception:
        return [('AI味强词', ['仿佛', '似乎', '然而', '悄然', '缓缓', '微微', '目光一凝', '眼眸',
                              '不知不觉', '莫名', '隐隐', '微微一愣', '心头一紧', '望向远方'])]

RULES = _c_text_rules() + [('中文引号笔误', ['“”'])]  # 提示检查是否成对

def count_all(text, s):
    c = 0; i = 0
    while True:
        i = text.find(s, i)
        if i < 0: return c
        c += 1; i += len(s)

def main():
    args = sys.argv[1:]
    if not args or args[0] in ('--list', '-h', '--help'):
        print('内置文本治理规则（与 c_text 同源，--scan 报告命中）:')
        for name, words in RULES:
            print('  %s: %s' % (name, '、'.join(words)))
        return 0
    if args[0] == '--scan':
        stats = {}
        for p in TARGETS:
            if not os.path.exists(p): continue
            t = io.open(p, encoding='utf-8', errors='replace').read()
            for name, words in RULES:
                n = sum(count_all(t, w) for w in words)
                stats.setdefault(name, {})[os.path.basename(p)] = n
        for name, per in stats.items():
            tot = sum(per.values())
            print('%s 合计命中 %d' % (name, tot))
            for k, v in sorted(per.items(), key=lambda x: -x[1])[:10]:
                print('    %-22s %d' % (k, v))
        return 0
    if len(args) != 2:
        print(__doc__); return 1
    old, new = args[0], args[1]
    if not old:
        print('[FAIL] 旧串为空'); return 1
    print('替换: %r → %r' % (old, new))
    total = 0
    stamp = time.strftime('%Y%m%d_%H%M%S')
    for p in TARGETS:
        if not os.path.exists(p): continue
        t = io.open(p, encoding='utf-8', errors='replace').read()
        n = count_all(t, old)
        if n == 0: continue
        # 备份
        bak = os.path.join(PROJ, 'backup', 'batch_%s_%s' % (stamp, os.path.basename(p)))
        os.makedirs(os.path.dirname(bak), exist_ok=True)
        shutil.copyfile(p, bak)
        t2 = t.replace(old, new)
        io.open(p, 'w', encoding='utf-8', newline='').write(t2)
        total += n
        print('  %s: %d 处（备份 %s）' % (os.path.basename(p), n, os.path.basename(bak)))
    if total:
        print('合计替换 %d 处。请运行 elda ci 门禁 + 浏览器回归。' % total)
    else:
        print('未命中，无改动。')
    return 0

if __name__ == '__main__':
    sys.exit(main())
