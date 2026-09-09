# -*- coding: utf-8 -*-
"""node_apply.py — 将 node_editor.html 导出的补丁 JSON 应用到 src 权威源。

用法: python tools/content_tools/node_apply.py <补丁.json> [--dry-run]
只改节点数据（text/options/place/where），不碰引擎；应用后自动 node --check 并提示跑 elda ci。
"""
import io, json, os, re, sys, glob, subprocess

PROJ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(PROJ, 'src')
DRY = '--dry-run' in sys.argv

def find_node_file(nid):
    """在 src 中定位 N[id] 定义所在文件与偏移。返回 (path, start, end) 或 None。"""
    for p in sorted(glob.glob(os.path.join(SRC, '*.js'))):
        t = io.open(p, encoding='utf-8', errors='replace').read()
        # 函数式：N["id"] = function(){ return {...}; }
        m = re.search(r'N\["%s"\]\s*=\s*function\s*\([^)]*\)\s*\{\s*return\s*(\{[\s\S]*?\})\s*;?\s*\}' % re.escape(nid), t)
        if m:
            return p, m.start(1), m.end(1), t
        # 对象式：N["id"] = {...}
        m = re.search(r'N\["%s"\]\s*=\s*(\{[\s\S]*?\})\s*;' % re.escape(nid), t)
        if m:
            return p, m.start(1), m.end(1), t
    return None

def patch_field(body, field, newval):
    """替换节点体中的 `field:...`（支持数组/字符串/对象）。返回 (新体, 是否改动)。"""
    # 精确匹配 field: <值>，值到下一个顶层逗号/花括号（简化：数组与字符串字面量）
    if field == 'text' and isinstance(newval, list):
        repl = 'text:' + json.dumps(newval, ensure_ascii=False)
        # 覆盖 text:[...]（数组字面量）
        m = re.search(r'text\s*:\s*\[[\s\S]*?\]', body)
        if m:
            return body[:m.start()] + repl + body[m.end():], True
        return body, False
    if field == 'options' and isinstance(newval, list):
        repl = 'options:' + json.dumps(newval, ensure_ascii=False)
        m = re.search(r'options\s*:\s*\[[\s\S]*?\]', body)
        if m:
            return body[:m.start()] + repl + body[m.end():], True
        return body, False
    if field in ('place', 'where'):
        repl = '%s:%s' % (field, json.dumps(newval, ensure_ascii=False))
        m = re.search(r'%s\s*:\s*"[^"]*"' % field, body)
        if m:
            return body[:m.start()] + repl + body[m.end():], True
        return body, False
    return body, False

def main():
    if len(sys.argv) < 2:
        print(__doc__); return 1
    patch_path = sys.argv[1]
    if not os.path.exists(patch_path):
        print('[FAIL] 补丁文件不存在: %s' % patch_path); return 1
    with io.open(patch_path, encoding='utf-8') as f:
        patch = json.load(f)
    print('补丁节点数: %d（%s）' % (len(patch), 'DRY-RUN 不写盘' if DRY else '将写盘'))
    applied = 0; failed = []
    # 按文件聚合，避免重复读写
    by_file = {}
    for nid, new in patch.items():
        loc = find_node_file(nid)
        if not loc:
            failed.append('%s（未找到定义）' % nid); continue
        p, s, e, t = loc
        body = t[s:e]
        changed = False
        for field in ('text', 'options', 'place', 'where'):
            if field in new and new[field] is not None:
                body, c = patch_field(body, field, new[field])
                changed = changed or c
        if changed:
            by_file.setdefault(p, []).append((nid, s, e, body))
            applied += 1
        else:
            failed.append('%s（字段无改动或格式不匹配）' % nid)
    for p, edits in by_file.items():
        t = io.open(p, encoding='utf-8', errors='replace').read()
        for nid, s, e, body in sorted(edits, key=lambda x: -x[1]):
            t = t[:s] + body + t[e:]
        if not DRY:
            io.open(p, 'w', encoding='utf-8', newline='').write(t)
            print('已写入 %s（%d 节点）' % (os.path.basename(p), len(edits)))
    print('应用成功: %d / %d' % (applied, len(patch)))
    if failed:
        print('跳过/失败:')
        for f in failed:
            print('  -', f)
    if not DRY and applied:
        # 语法检查
        for p in by_file:
            rc = subprocess.call(['node', '--check', p], shell=True)
            if rc != 0:
                print('[FAIL] 语法错误: %s' % p); return 1
        print('node --check PASS；请运行 elda ci 全量门禁')
    return 0 if not failed else 2

if __name__ == '__main__':
    sys.exit(main())
