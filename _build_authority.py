# -*- coding: utf-8 -*-
"""《艾尔达大陆·群雄割据》权威源构建闭环（批1 · P0-2 权威源统一 + 批 P0-1 模块化变体）

职责：以 game.html 为唯一内容权威源，建立「提取 → 组装 → 幂等校验」闭环。
  - extract : game.html -> src\\（head.html + script_00~18.js + 变体 a~z + gap_00~18.html + tail.html）
  - build   : src\\ -> game_built.html（绝不覆盖 game.html 权威源）
  - verify  : build(extract(game.html)) 与 game.html 字节级比对（幂等门）
  - sync    : 四路同步 + 字节校验（game.html->game_check, game_chunked->index）

模块化（v76mod）：script_%02d.js 可按职责拆分为变体 script_%02d[a-z].js，
每段变体以 /*v76mod*/ 标记开头；build 按字母序拼回同一 <script>，extract 按标记拆回。
铁律：不修改 game.html；不触碰判定公式/writeNext/choose/存档语义。
用法：
  python _build_authority.py extract|build|verify|sync
"""
import io, os, re, sys, shutil, glob

sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
GAME = os.path.join(HERE, 'game.html')
SRC = os.path.join(HERE, 'src')
BUILT = os.path.join(HERE, 'game_built.html')
MOD_MARK = '/*v76mod*/'
# U1 内容外置化：data-nodes 段（追加在最后 script 块内，按文件 marker 拆分）
DN_DIR = os.path.join(SRC, 'data_nodes')
DN_MARK = '/* /u1inj:data-nodes/ */'
DN_END = '/* /u1inj:data-nodes-end/ */'
DN_FILE = re.compile(r'/\* /u1inj:data-nodes:([\w.]+)/ \*/')


def _read(p):
    with io.open(p, encoding='utf-8', newline='') as f:
        return f.read()


def _write(p, text):
    with io.open(p, 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)


def _variants(i):
    """返回该 script 编号的所有变体路径（script_%02d[a-z].js，字母序）。"""
    return sorted(glob.glob(os.path.join(SRC, 'script_%02d[a-z].js' % i)))


def _split_data_nodes(body):
    """若 body 含 data-nodes 段，返回 (主体, {文件名: 内容}, 段尾)。
    主体=DN_MARK 之前原文（含其前换行）；内容=各文件 marker 之间的原文（规范化 strip 后写回）。"""
    if DN_MARK not in body:
        return body, {}, ''
    idx = body.index(DN_MARK)
    head = body[:idx]
    tail_start = body.find(DN_END, idx)
    if tail_start < 0:
        return body, {}, ''
    tail = body[tail_start + len(DN_END):]
    seg = body[idx:tail_start]
    files = {}
    for m in DN_FILE.finditer(seg):
        start = m.end()
        nm = m.group(1)
        nxt = DN_FILE.search(seg, start)
        end = nxt.start() if nxt else len(seg)
        files[nm] = seg[start:end].strip('\n') + '\n'
    return head, files, tail


def _collect_data_nodes():
    """读 src/data_nodes/*.js（字母序）→ data-nodes 段（无文件时返回空串）。
    段格式：DN_MARK 行 + 每文件(marker 行 + 内容) + DN_END 行；不带前导空行。
    CT-2：dn_scaffold.js 为 dev 脚手架模板（elda content new 产物），不进构建。"""
    fps = sorted(glob.glob(os.path.join(DN_DIR, '*.js')))
    fps = [f for f in fps if os.path.basename(f) not in ('dn_scaffold.js', 'dn_node_templates.js')]
    if not fps:
        return ''
    seg = [DN_MARK]
    for f in fps:
        name = os.path.basename(f)
        content = _read(f).rstrip('\n') + '\n'
        seg.append('/* /u1inj:data-nodes:%s/ */' % name)
        seg.append(content)
    seg.append(DN_END)
    return '\n'.join(seg) + '\n'


def extract():
    """game.html -> src\\，按 <script> 边界切分；含 v76mod 的块拆回主文件+变体。"""
    h = _read(GAME)
    opens = list(re.finditer(r'<script\b[^>]*>', h))
    if not opens:
        print('[FAIL] 未找到任何 <script> 标签')
        return 1
    os.makedirs(SRC, exist_ok=True)
    head = h[:opens[0].start()]
    _write(os.path.join(SRC, 'head.html'), head)
    for i, m in enumerate(opens):
        close = h.find('</script>', m.end())
        if close < 0:
            print('[FAIL] script %d 无闭合标签' % i)
            return 1
        body = h[m.end():close]
        # U1 外置化：若本 script 块含 data-nodes 段，先拆出主体与数据文件
        body, dns, _tail = _split_data_nodes(body)
        # 清理该编号的旧变体（避免残留），再按 v76mod 拆回
        for v in _variants(i):
            os.remove(v)
        parts = body.split(MOD_MARK)
        # parts[0] 主文件；parts[1:] 变体（每个以 \n 开头）
        _write(os.path.join(SRC, 'script_%02d.js' % i), parts[0])
        for k, seg in enumerate(parts[1:]):
            # split 会吃掉标记本身；写回时补回，保持与手动拆分格式一致
            _write(os.path.join(SRC, 'script_%02d%s.js' % (i, chr(97 + k))), MOD_MARK + seg)
        # 写回 data-nodes 数据文件（先清理旧文件，避免残留进入 build）
        if dns:
            if os.path.isdir(DN_DIR):
                for old in glob.glob(os.path.join(DN_DIR, '*.js')):
                    os.remove(old)
            else:
                os.makedirs(DN_DIR)
            for name, content in dns.items():
                _write(os.path.join(DN_DIR, name), content)
        # 块间间隙：本 script 结束到下一 script 开始（或文件尾）
        seg_end = close + len('</script>')
        if i + 1 < len(opens):
            gap = h[seg_end:opens[i + 1].start()]
        else:
            gap = h[seg_end:]
        _write(os.path.join(SRC, 'gap_%02d.html' % i), gap)
    print('extract OK: head %d + %d script 块（含变体）+ 间隙 %d 段' % (len(head), len(opens), len(opens)))
    return 0


def build():
    """src\\ -> game_built.html（不覆盖 game.html）。变体拼入同一 <script>。"""
    if not os.path.isdir(SRC):
        print('[FAIL] 缺少 %s，先运行 extract' % SRC)
        return 1
    head = _read(os.path.join(SRC, 'head.html'))
    parts = [head]
    i = 0
    last_script_idx = None
    while True:
        sp = os.path.join(SRC, 'script_%02d.js' % i)
        gp = os.path.join(SRC, 'gap_%02d.html' % i)
        if not os.path.exists(sp):
            break
        body = _read(sp)
        for v in _variants(i):
            body += _read(v)
        parts.append('<script>' + body + '</script>')
        last_script_idx = len(parts) - 1
        parts.append(_read(gp) if os.path.exists(gp) else '')
        i += 1
    # U1 外置化：data-nodes 段注入最后 script 块（保持幂等：无文件则不注入）
    dn = _collect_data_nodes()
    if dn and last_script_idx is not None:
        parts[last_script_idx] = parts[last_script_idx][:-len('</script>')] + dn + '</script>'
    html = ''.join(parts)
    _write(BUILT, html)
    print('build OK: %d script 块（含 %d 组变体）-> game_built.html (%d 字符)' % (
        i, sum(1 for j in range(i) if _variants(j)), len(html)))
    return 0


def verify():
    """幂等门：build(extract(game.html)) 与 game.html 字节一致。"""
    rc = extract()
    if rc != 0:
        return rc
    rc = build()
    if rc != 0:
        return rc
    orig = _read(GAME)
    got = _read(BUILT)
    if orig == got:
        print('verify PASS: game_built.html 与 game.html 字节级一致（幂等闭环成立）')
        return 0
    else:
        print('verify FAIL: 字节不一致（原始 %d / 重建 %d）' % (len(orig), len(got)))
        for i in range(min(len(orig), len(got))):
            if orig[i] != got[i]:
                print('首个差异 offset %d: ...%s... vs ...%s...' % (
                    i, orig[max(0, i - 40):i + 40], got[max(0, i - 40):i + 40]))
                break
        return 1


def sync():
    """四路同步 + 字节校验。game.html 为权威，game_check 与之一致；game_chunked->index。"""
    pairs = [('game.html', 'game_check.html'), ('game_chunked.html', 'index.html')]
    all_ok = True
    for src, dst in pairs:
        sp = os.path.join(HERE, src)
        dp = os.path.join(HERE, dst)
        if not os.path.exists(sp):
            print('[FAIL] 缺少 %s' % sp)
            all_ok = False
            continue
        shutil.copyfile(sp, dp)
        a = os.path.getsize(sp)
        b = os.path.getsize(dp)
        ok = a == b
        all_ok = all_ok and ok
        print('  %-16s -> %-16s %d 字节 %s' % (src, dst, a, 'OK' if ok else '不一致!'))
    print('四路同步: %s' % ('全部一致' if all_ok else '存在不一致!'))
    return 0 if all_ok else 1


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'verify'
    fn = {'extract': extract, 'build': build, 'verify': verify, 'sync': sync}.get(cmd)
    if not fn:
        print('用法: python _build_authority.py extract|build|verify|sync')
        return 1
    rc = fn()
    print('exit:', rc)
    return rc


if __name__ == '__main__':
    sys.exit(main())
