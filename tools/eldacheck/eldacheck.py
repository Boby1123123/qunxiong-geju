#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""eldacheck — 群雄割据一键体检 CLI。

用法:
  python tools/eldacheck/eldacheck.py [--quick]         # 五项快速体检（默认）
  python tools/eldacheck/eldacheck.py --full            # 十项全量体检
  python tools/eldacheck/eldacheck.py --snapshot        # 保存当前结构快照
  python tools/eldacheck/eldacheck.py --diff <新文件>   # 对比最近快照输出影响面
"""
import io, os, re, sys, time, json, argparse

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(os.path.join(HERE, '..', '..'))
GAME = os.path.join(PROJ, 'game.html')
SNAP_DIR = os.path.join(HERE, 'snapshots')
CACHE_DIR = os.path.join(HERE, 'cache')

# 终端颜色
def C(code, s):
    return '\033[%sm%s\033[0m' % (code, s) if sys.stdout.isatty() else s


def load_checks():
    sys.path.insert(0, HERE)
    from checks import c_syntax, c_links, c_refhealth, c_nodes, c_markers, c_structure, c_text, c_save, c_dead, c_speed, c_dialog, c_chunks, c_world, c_war, c_narr, c_cast, c_lore, c_ui, c_v68ui, c_causality, c_pace, c_textguard, c_skeleton, c_arc, c_report
    return {
        'quick': [
            ('语法检查', c_syntax.run),
            ('死链检查', c_links.run),
            ('引用健康', c_refhealth.run),
            ('节点格式', c_nodes.run),
            ('marker台账', c_markers.run),
            ('结构健康', c_structure.run),
        ],
        'full': [
            ('语法检查', c_syntax.run),
            ('死链检查', c_links.run),
            ('引用健康', c_refhealth.run),
            ('节点格式', c_nodes.run),
            ('marker台账', c_markers.run),
            ('结构健康', c_structure.run),
            ('文本质量', c_text.run),
            ('死代码检测', c_dead.run),
            ('存档兼容', c_save.run),
            ('原生dialog', c_dialog.run),
            ('分片健康', c_chunks.run),
            ('世界局势', c_world.run),
            ('战争与战斗', c_war.run),
            ('叙事连续性', c_narr.run),
            ('群像记忆', c_cast.run),
            ('设定深度', c_lore.run),
            ('UI系统', c_ui.run),
            ('V68-UI西幻界面', c_v68ui.run),
            ('因果/伏笔账本', c_causality.run),
            ('节奏与战斗', c_pace.run),
            ('文本治理门禁', c_textguard.run),
            ('叙事骨架门', c_skeleton.run),
            ('弧线覆盖门', c_arc.run),
            ('生产报表', c_report.run),
        ],
    }



def _file_sig(path=GAME):
    import hashlib
    try:
        with open(path, 'rb') as f:
            return hashlib.sha1(f.read()).hexdigest()
    except Exception:
        return None


def _cache_get(key, sig):
    p = os.path.join(CACHE_DIR, key + '.json')
    if not os.path.exists(p):
        return None
    try:
        with io.open(p, encoding='utf-8') as f:
            d = json.load(f)
        if d.get('sig') == sig:
            return d.get('result')
    except Exception:
        pass
    return None


def _cache_put(key, sig, result):
    try:
        os.makedirs(CACHE_DIR, exist_ok=True)
        with io.open(os.path.join(CACHE_DIR, key + '.json'), 'w', encoding='utf-8') as f:
            json.dump({'sig': sig, 'result': result}, f, ensure_ascii=False, default=str)
    except Exception:
        pass


def read_game(path=GAME):
    with io.open(path, encoding='utf-8') as f:
        return f.read()


def snapshot(html):
    os.makedirs(SNAP_DIR, exist_ok=True)
    from checks import find_node_ids
    nodes = sorted(find_node_ids(html).keys())
    markers = sorted(set(re.findall(r'/v\d+inj:[A-Za-z0-9_]+', html)))
    globals_ = sorted(set(re.findall(r'window\.([A-Za-z_$][\w$]*)\s*=', html)))
    ts = time.strftime('%Y%m%d_%H%M%S')
    data = {'ts': ts, 'bytes': len(html), 'nodes': len(nodes),
            'node_sample': nodes[:3000], 'markers': markers, 'window_globals': globals_}
    p = os.path.join(SNAP_DIR, ts + '.json')
    with io.open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    return p, data


def diff_latest(html, path=None):
    snaps = sorted(f for f in os.listdir(SNAP_DIR) if f.endswith('.json'))
    if not snaps:
        return '无快照，先运行 eldacheck --snapshot'
    latest = os.path.join(SNAP_DIR, snaps[-1])
    with io.open(latest, encoding='utf-8') as f:
        old = json.load(f)
    from checks import find_node_ids
    new_nodes = find_node_ids(html)
    old_set = set(old.get('node_sample', []))
    new_set = set(new_nodes.keys())
    added = sorted(new_set - old_set)
    removed = sorted(old_set - new_set)
    markers_now = sorted(set(re.findall(r'/v\d+inj:[A-Za-z0-9_]+', html)))
    markers_old = set(old.get('markers', []))
    lines = []
    lines.append('快照: %s (%s 字节)' % (latest, old.get('ts')))
    lines.append('节点: %d → %d  (新增 %d / 移除 %d)' % (len(old_set), len(new_set), len(added), len(removed)))
    if added:
        lines.append('新增节点(%d): %s' % (len(added), ', '.join(added[:30])))
    if removed:
        lines.append('移除节点(%d): %s' % (len(removed), ', '.join(removed[:30])))
    new_mk = sorted(set(markers_now) - markers_old)
    if new_mk:
        lines.append('新增marker(%d): %s' % (len(new_mk), ', '.join(new_mk)))
    return '\n'.join(lines)


def main():
    ap = argparse.ArgumentParser(description='eldacheck 一键体检')
    ap.add_argument('--quick', action='store_true', help='快速体检（默认）')
    ap.add_argument('--full', action='store_true', help='全量体检')
    ap.add_argument('--snapshot', action='store_true', help='保存结构快照')
    ap.add_argument('--diff', nargs='?', const='', metavar='FILE', help='对比最近快照')
    ap.add_argument('--no-cache', action='store_true', help='禁用增量缓存（强制全量）')
    args = ap.parse_args()

    if args.snapshot:
        p, data = snapshot(read_game())
        print(C('32', '[snapshot]') + ' 已保存 %s（节点 %d / marker %d / 全局 %d）' % (
            p, data['nodes'], len(data['markers']), len(data['window_globals'])))
        return

    if args.diff is not None:
        target = args.diff if args.diff else GAME
        html = read_game(target)
        print(diff_latest(html))
        return

    t0 = time.time()
    html = read_game(GAME)
    print(C('1', '═' * 60))
    print(C('1', '  eldacheck — 群雄割据一键体检  (%s 字节, %s)' % (len(html), time.strftime('%H:%M:%S'))))
    print(C('1', '═' * 60))
    checks = load_checks()
    groups = 'full' if args.full else 'quick'
    sig = _file_sig() if (not args.no_cache and groups == 'full') else None
    CACHEABLE = {'文本质量': 'c_text', '死代码检测': 'c_dead'}
    all_ok = True
    timings = {}
    for name, fn in checks[groups]:
        t_check = time.time()
        from_cache = False
        try:
            if sig and name in CACHEABLE:
                cached = _cache_get(CACHEABLE[name], sig)
                if cached is not None:
                    r = cached
                    from_cache = True
                else:
                    r = fn(html)
                    _cache_put(CACHEABLE[name], sig, r)
            else:
                r = fn(html)
        except Exception as e:
            print(C('31', '  ✗ %s: 检查器异常 %s' % (name, e)))
            all_ok = False
            continue
        timings[name] = 0.0 if from_cache else (time.time() - t_check)
        head = C('32', '  ✓ %s' % r['name']) if r['ok'] else C('31', '  ✗ %s' % r['name'])
        if from_cache:
            head += C('33', '  (缓存命中)')
        print(head)
        for sub in r['results']:
            flag = C('32', 'PASS') if sub['ok'] else C('31', 'FAIL')
            msg = (sub['msg'] or '—')
            if len(msg) > 220:
                msg = msg[:220] + '…'
            print('      [%s] %s — %s' % (flag, sub['name'], msg))
        if not r['ok']:
            all_ok = False
    # 性能计时汇总（主程序统一计时，c_speed 不参与检查器循环）
    if timings:
        sys.path.insert(0, HERE)
        from checks import c_speed as _cspeed
        r = _cspeed.run(html, timings)
        head = C('32', '  ✓ %s' % r['name']) if r['ok'] else C('31', '  ✗ %s' % r['name'])
        print(head)
        for sub in r['results']:
            flag = C('32', 'PASS') if sub['ok'] else C('31', 'FAIL')
            msg = (sub['msg'] or '—')
            if len(msg) > 220:
                msg = msg[:220] + '…'
            print('      [%s] %s — %s' % (flag, sub['name'], msg))
        if not r['ok']:
            all_ok = False
    print(C('1', '─' * 60))
    dur = time.time() - t0
    if all_ok:
        print(C('32', '  全部通过 (%ds)' % dur))
    else:
        print(C('31', '  存在 FAIL 项，详见上方清单 (%ds)' % dur))
        sys.exit(1)


if __name__ == '__main__':
    main()
