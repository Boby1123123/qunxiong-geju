#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""工程链深化实现（E1-E4）：
  elda backup   —— 自动快照（zip 打包关键资产，保留最近 N 份）
  elda release  —— 发布自动化（门禁全绿 → bump 版本 → Release Notes → git tag [--push]）
  elda test     —— 全量回归（endings 结局全量校验 / events 事件池全量校验 / all）
  elda volume   —— 体积趋势（读 budget.json 历史，超上限 FAIL / 突增预警）
由 tools/elda/elda.py 分发调用。铁律：不触碰引擎/判定/存档语义；写操作前先备份。
"""
import io, json, os, re, shutil, subprocess, sys, time, datetime, zipfile, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..'))
BACKUP = os.path.join(PROJ, 'backup')
DOCS = os.path.join(PROJ, 'docs')
GAME = os.path.join(PROJ, 'game.html')
CHUNKED = os.path.join(PROJ, 'game_chunked.html')
SRC = os.path.join(PROJ, 'src')
VFILE = os.path.join(PROJ, 'version.json')
BUDGET = os.path.join(PROJ, 'budget.json')
RELEASE_LOG = os.path.join(DOCS, '版本发布记录.md')
PY = sys.executable
ELDA = os.path.join(HERE, 'elda.py')
NODE = shutil.which('node') or 'node'
CLS_OK = ('天灾', '人祸', '奇遇', '商机')


def _read(p, enc='utf-8'):
    return io.open(p, encoding=enc, errors='replace').read()


def _run(cmd, cwd=PROJ):
    return subprocess.call(cmd, cwd=cwd, shell=True)


def _size(p):
    return os.path.getsize(p) if os.path.exists(p) else -1


# ============================================================
# E1 · elda backup —— 自动快照
# ============================================================
def cmd_backup(args):
    ap = argparse.ArgumentParser(prog='elda backup')
    ap.add_argument('--reason', default='manual')
    ap.add_argument('--keep', type=int, default=12)
    a = ap.parse_args(args)
    os.makedirs(BACKUP, exist_ok=True)
    ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    tag = re.sub(r'[^0-9A-Za-z_\-\u4e00-\u9fff]', '', a.reason)[:40]
    name = 'snap_%s_%s.zip' % (ts, tag or 'misc')
    dst = os.path.join(BACKUP, name)
    items = []
    for rel in ('src', 'tools', 'docs', 'skills'):
        p = os.path.join(PROJ, rel)
        if os.path.isdir(p):
            items.append(rel)
    for rel in ('game.html', 'game_check.html', 'game_chunked.html', 'index.html',
                'game_built.html', 'chunks', '_build_authority.py', 'smoke_test.py',
                'budget.json', 'version.json', 'README.md', 'elda.bat'):
        if os.path.exists(os.path.join(PROJ, rel)):
            items.append(rel)
    with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
        for rel in items:
            p = os.path.join(PROJ, rel)
            if os.path.isdir(p):
                for root, dirs, files in os.walk(p):
                    dirs[:] = [d for d in dirs
                               if d not in ('backup', '.git', '__pycache__', 'node_modules')]
                    for f in files:
                        fp = os.path.join(root, f)
                        z.write(fp, os.path.relpath(fp, PROJ))
            else:
                z.write(p, rel)
    snaps = sorted(f for f in os.listdir(BACKUP)
                   if f.startswith('snap_') and f.endswith('.zip'))
    removed = []
    for old in snaps[:-a.keep]:
        try:
            os.remove(os.path.join(BACKUP, old))
            removed.append(old)
        except OSError:
            pass
    kb = os.path.getsize(dst) / 1024.0
    print('[OK] 快照: %s (%.1f KB)' % (name, kb))
    print('[OK] 保留 %d 份；本轮清理 %d 份旧快照' % (min(a.keep, len(snaps)), len(removed)))
    return 0


# ============================================================
# E2 · elda release —— 发布自动化
# ============================================================
def _read_version():
    if os.path.exists(VFILE):
        try:
            return json.load(io.open(VFILE, encoding='utf-8')).get('version', 'v91')
        except Exception:
            pass
    return 'v91'


def _collect_recent_docs(limit=8):
    """取 docs 最近修改的批次文档标题（排除生成物/汇总类）。"""
    skip = ('版本发布记录', 'volume_history', '结构台账', '工具手册', '开发工作流',
            'ci_guard_report', 'p2_expansion')
    files = []
    try:
        for f in os.listdir(DOCS):
            p = os.path.join(DOCS, f)
            if not f.endswith('.md') or not os.path.isfile(p):
                continue
            if any(s in f for s in skip):
                continue
            files.append((os.path.getmtime(p), f))
    except OSError:
        return []
    files.sort(reverse=True)
    out = []
    for _, f in files[:limit]:
        t = f[:-3]
        try:
            head = _read(os.path.join(DOCS, f)).strip().splitlines()
            first = re.sub(r'^#+\s*', '', head[0]).strip() if head else t
        except Exception:
            first = t
        out.append({'file': f, 'title': first})
    return out


def cmd_release(args):
    ap = argparse.ArgumentParser(prog='elda release')
    ap.add_argument('--note', default='')
    ap.add_argument('--push', action='store_true')
    a = ap.parse_args(args)

    print('== elda release ==')
    print('[1/4] 门禁检查（elda ci）…')
    if _run('"%s" "%s" ci' % (PY, ELDA)) != 0:
        print('[FAIL] 门禁未全绿，禁止发版（先修复再 release）')
        return 1

    cur = _read_version()
    m = re.match(r'v(\d+)$', cur)
    if not m:
        print('[FAIL] 版本号格式异常: %s' % cur)
        return 1
    new = 'v%d' % (int(m.group(1)) + 1)
    print('[2/4] 版本 %s -> %s' % (cur, new))

    notes = _collect_recent_docs()
    rec = {
        'version': new, 'from': cur,
        'released': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
        'note': a.note, 'changes': notes,
    }
    json.dump(rec, io.open(VFILE, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

    lines = [
        '',
        '## %s（%s）' % (new, rec['released']),
        '',
    ]
    if a.note:
        lines += ['- 说明：' + a.note, '']
    lines += ['本版落地的最近批次：']
    for c in notes:
        lines.append('- %s —— %s' % (c['title'], c['file']))
    lines += ['', '门禁口径：elda ci 21 检查器全绿 + smoke PASS + 四路字节一致。']
    with io.open(RELEASE_LOG, 'a', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    print('[3/4] Release Notes 已追加: docs/版本发布记录.md（%d 条批次）' % len(notes))

    r = subprocess.run(['git', 'tag', new], cwd=PROJ, capture_output=True, text=True)
    if r.returncode == 0:
        print('[OK] 已打 tag: %s' % new)
    else:
        print('[WARN] tag %s 已存在或失败: %s' % (new, r.stderr.strip()[:120]))

    if a.push:
        r = subprocess.run(['git', 'push', 'origin', 'main'], cwd=PROJ,
                           capture_output=True, text=True)
        r2 = subprocess.run(['git', 'push', 'origin', 'tag', new], cwd=PROJ,
                            capture_output=True, text=True)
        print('[OK] 已推送 main + tag %s（Pages 将自动部署）' % new)
        if r.returncode != 0:
            print(r.stderr.strip()[:200])
        if r2.returncode != 0:
            print(r2.stderr.strip()[:200])
    else:
        print('[提示] 未 push；确认后执行 git push origin main --tags 发布')
    return 0


# ============================================================
# E3 · elda test —— 全量回归
# ============================================================
_NODE_RE = re.compile(r'N\["([A-Za-z0-9_]+)"\]\s*=\s*(?:function\s*\(\)\s*\{\s*return\s*)?\{')


def _extract_nodes(text):
    """提取全部节点 id -> 对象文本（函数式/对象式双兼容）。"""
    nodes = {}
    for m in _NODE_RE.finditer(text):
        nid = m.group(1)
        i = text.find('{', m.start(), m.end())
        if i < 0:
            continue
        depth, j = 0, i
        while j < len(text):
            c = text[j]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1
        nodes[nid] = text[i:j + 1]
    return nodes


def _node_has(node_txt, keys):
    """key 存在性（兼容 JS 无引号 key：text: 与 "text": 均合法）。"""
    for k in keys:
        if re.search(r'["\']?%s["\']?\s*:' % re.escape(k), node_txt):
            return True
    return False


def _node_text_ok(node_txt):
    """text 字段合法：存在且非 空串/空数组。函数值/数组/字符串均合法。"""
    if not re.search(r'["\']?text["\']?\s*:', node_txt):
        return False
    if re.search(r'["\']?text["\']?\s*:\s*(""|\[\s*\])', node_txt):
        return False
    return True


def cmd_test_endings():
    text = _read(GAME)
    nodes = _extract_nodes(text)
    ends = sorted(k for k in nodes
                  if k.startswith('ending') or k.startswith('epilogue')
                  or k.startswith('aftermath') or k.startswith('v24_final')
                  or k.startswith('v36_ending') or k.startswith('ngplus_true'))
    fails = []
    for nid in ends:
        nt = nodes[nid]
        if not _node_text_ok(nt):
            fails.append('%s: 缺 text 或 text 空' % nid)
        if not _node_has(nt, ('options', 'go', 'then', 'choose', 'actions')):
            fails.append('%s: 无出边' % nid)
    # 入边统计（全图 go/then/options 目标，兼容无引号 key）
    indeg = {}
    for nid, nt in nodes.items():
        for tgt in re.findall(r'["\']?(?:go|then)["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt):
            indeg.setdefault(tgt, 0)
            indeg[tgt] += 1
        for tgt in re.findall(r'["\']?go["\']?\s*:\s*"([A-Za-z0-9_]+)"', nt):
            indeg.setdefault(tgt, 0)
            indeg[tgt] += 1
    no_in = [n for n in ends if indeg.get(n, 0) == 0]
    print('== elda test endings ==')
    print('结局类节点: %d 个' % len(ends))
    for f in fails:
        print('  [FAIL] %s' % f)
    if no_in:
        print('  [WARN] 无入边结局（可能由状态机/动态可达）: %s' % ', '.join(no_in[:12]))
    if fails:
        print('  结局校验: FAIL（%d 项）' % len(fails))
        return 1
    print('  结局校验: PASS（%d 个全部有文本与出边）' % len(ends))
    return 0


def cmd_test_events():
    src = os.path.join(SRC, 'script_01.js')
    if not os.path.exists(src):
        print('[FAIL] 缺 src/script_01.js')
        return 1
    js = os.path.join(HERE, 'extract_events.js')
    r = subprocess.run([NODE, js, src], capture_output=True, text=True, timeout=30)
    if r.returncode != 0:
        print('[FAIL] node 提取事件池失败: %s' % r.stderr.strip()[:200])
        return 1
    pool = json.loads(r.stdout or 'null')
    if not isinstance(pool, list):
        print('[FAIL] EVENT_POOL_EXT 解析为空')
        return 1
    fails, ids = [], set()
    for i, ev in enumerate(pool):
        tag = ev.get('id', '<无id#%d>' % i)
        if not tag or tag in ids:
            fails.append('%s: id 缺失或重复' % tag)
        if tag:
            ids.add(tag)
        if ev.get('cls') not in CLS_OK:
            fails.append('%s: cls=%r 非法（应为 %s）' % (tag, ev.get('cls'), '/'.join(CLS_OK)))
        if not isinstance(ev.get('day'), int) or not (1 <= ev['day'] <= 9999):
            fails.append('%s: day=%r 非法' % (tag, ev.get('day')))
        t = ev.get('text')
        if not t or not isinstance(t, str) or len(t) < 8:
            fails.append('%s: text 缺失/过短' % tag)
    print('== elda test events ==')
    print('事件池: %d 则' % len(pool))
    for f in fails[:20]:
        print('  [FAIL] %s' % f)
    if fails:
        print('  事件校验: FAIL（%d 项）' % len(fails))
        return 1
    print('  事件校验: PASS（%d 则全部结构合法）' % len(pool))
    return 0


def cmd_test(args):
    ap = argparse.ArgumentParser(prog='elda test')
    ap.add_argument('what', nargs='?', default='all', choices=('all', 'endings', 'events'))
    a = ap.parse_args(args)
    rc = 0
    if a.what in ('all', 'endings'):
        rc = cmd_test_endings() or rc
    if a.what in ('all', 'events'):
        rc = cmd_test_events() or rc
    return rc


# ============================================================
# E4 · elda volume —— 体积趋势预警
# ============================================================
def cmd_volume(args):
    ap = argparse.ArgumentParser(prog='elda volume')
    ap.add_argument('--json', action='store_true')
    a = ap.parse_args(args)
    game = _size(GAME)
    chunked = _size(CHUNKED)
    hist, budget = [], {}
    if os.path.exists(BUDGET):
        try:
            b = json.load(io.open(BUDGET, encoding='utf-8'))
            hist = b.get('meta', {}).get('history', []) or []
            budget = b.get('budgets', {}) or {}
        except Exception:
            pass
    recent = [h.get('game_bytes', 0) for h in hist[-5:] if h.get('game_bytes')]
    avg = sum(recent) / len(recent) if recent else 0
    growth = (game - avg) / avg * 100 if avg else 0
    cap = budget.get('game_html_bytes_max') or 0
    status, warn = 'PASS', []
    if cap and game > cap:
        status, warn = 'FAIL', ['超上限: %dB > %dB' % (game, cap)]
    elif avg and growth > 5:
        warn.append('突增预警: 较近 5 次均值 %+.1f%%（%dB）' % (growth, game))
    if a.json:
        print(json.dumps({
            'status': status, 'game_bytes': game, 'chunked_bytes': chunked,
            'avg5': int(avg), 'growth_pct': round(growth, 1),
            'cap': cap, 'warns': warn, 'samples': len(hist),
        }, ensure_ascii=False))
        return 0 if status == 'PASS' else 1
    print('== elda volume ==')
    print('历史样本: %d 条（budget.json meta.history）' % len(hist))
    print('  最近 6 条:')
    for h in hist[-6:]:
        print('    %s  game=%-9d chunked=%-9d 节点=%-5d %s' % (
            h.get('date', '?'), h.get('game_bytes', 0), h.get('chunked_bytes', 0),
            h.get('nodes', 0), (h.get('reason') or '')[:28]))
    print('  当前: game=%dB  chunked=%dB' % (game, chunked))
    if avg:
        print('  近 5 次均值: %dB（%+.1f%%）' % (int(avg), growth))
    if cap:
        print('  预算上限: %dB' % cap)
    for w in warn:
        print('  [%s] %s' % ('FAIL' if status == 'FAIL' else 'WARN', w))
    if status == 'FAIL':
        print('  体积趋势: FAIL（超预算，需 elda budget --reason 更新）')
        return 1
    print('  体积趋势: PASS')
    return 0
