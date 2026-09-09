# -*- coding: utf-8 -*-
"""分片构建实现（批 P0-1 收编）：_v62_merge / _v42_build_chunks / _v42_verify_chunks / _v42_chk_syntax
统一入口，供 elda.py cmd_chunks 调用；不再依赖根目录历史脚本。UTF-8，无 SyntaxWarning。
"""
import io, os, re, subprocess, sys
from collections import Counter


def _read(p, enc='utf-8'):
    return io.open(p, encoding=enc, errors='replace').read()


def _write(p, text):
    io.open(p, 'w', encoding='utf-8', newline='\n').write(text)


# ---------------- 1. 合并视图（v62） ----------------

def _extract_chunk_nodes(text):
    """提取 chunks/v62_*.js 中 nodes["id"]=function(){...} 定义 → N["id"] = 形式。"""
    out = []
    pat = re.compile(r'nodes\["([^"]+)"\]\s*=\s*function\b')
    for m in pat.finditer(text):
        br = text.find('{', m.start())
        if br < 0:
            continue
        depth = 0
        i = br
        in_str = None
        while i < len(text):
            c = text[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
            else:
                if c in ('"', "'", '`'):
                    in_str = c
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        while end < len(text) and text[end] in ' \t\n;':
                            end += 1
                        body = text[m.start():end]
                        body = re.sub(r'^nodes\["([^"]+)"\]\s*=\s*', r'N["\1"] = ', body, count=1)
                        out.append(body)
                        break
            i += 1
    return out


def merge_v62(proj):
    """game.html + chunks/v62_*.js 片节点 → game_v62_full.html（临时）。"""
    os.chdir(proj)
    full = os.path.join(proj, 'game_v62_full.html')
    html = _read(os.path.join(proj, 'game.html'))
    chunk_ids = []
    d = os.path.join(proj, 'chunks')
    if os.path.isdir(d):
        for fn in sorted(os.listdir(d)):
            if fn.startswith('v62_') and fn.endswith('.js'):
                chunk_ids += _extract_chunk_nodes(_read(os.path.join(d, fn)))
    if not chunk_ids:
        print('[SKIP] 无 v62 片节点，game_v62_full.html = game.html')
        _write(full, html)
        return 0
    anchor = 'const N = {}; window.N = N;'
    if anchor not in html:
        print('[FAIL] 找不到 N 定义锚点')
        return 1
    inject = '\n'.join(chunk_ids) + '\n'
    html = html.replace(anchor, anchor + '\n' + inject, 1)
    _write(full, html)
    print('game_v62_full.html 已生成（内联 %d 片节点，%d 字节）' % (len(chunk_ids), len(html)))
    return 0


# ---------------- 2. 分片构建（v42） ----------------

def _classify(nid):
    if nid.startswith('origin') or nid.startswith('prologue'):
        return 'story_origin'
    if nid.startswith('academy') or nid.startswith('classmate') or nid.startswith('pol') \
       or nid.startswith('grad') or nid.startswith('orient') or nid.startswith('club'):
        return 'story_academy'
    if nid.startswith('city') or nid.startswith('west') or nid.startswith('north') \
       or nid.startswith('south') or nid.startswith('beijing') or nid.startswith('east') \
       or nid.startswith('green') or nid.startswith('oasis'):
        return 'story_mainland'
    if nid.startswith('travel') or nid.startswith('arrive') or nid.startswith('journey'):
        return 'story_travel'
    if nid.startswith('seal') or nid.startswith('eclipse') or nid.startswith('extinct') \
       or nid.startswith('dun'):
        return 'story_seal'
    if nid.startswith('npc') or nid.startswith('evt') or nid.startswith('item') \
       or nid.startswith('quest') or nid.startswith('board') or nid.startswith('relic') \
       or nid.startswith('fsh') or nid.startswith('shop') or nid.startswith('time'):
        return 'story_system'
    if nid.startswith('fc') or nid.startswith('hub') or nid.startswith('entry') \
       or nid.startswith('common') or nid.startswith('create') or nid.startswith('start'):
        return 'story_core'
    return 'story_misc'


def _extract_node_defs(text, base_off):
    """提取所有 N["id"]= 定义（双/单引号 key，function 或对象式）。"""
    out = []
    pat = re.compile(r'N\[["\']([^"\']+)["\']\]\s*=\s*(?:function\b|\{)')
    for m in pat.finditer(text):
        start = m.start()
        br = text.find('{', start)
        if br < 0 or br - start > 5000:
            print('[WARN] 跳过无法定位：N["%s"]' % m.group(1))
            continue
        depth = 0
        i = br
        in_str = None
        while i < len(text):
            c = text[i]
            if in_str:
                if c == '\\':
                    i += 2
                    continue
                if c == in_str:
                    in_str = None
            else:
                if c == '"' or c == "'":
                    in_str = c
                elif c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        end = i + 1
                        while end < len(text) and text[end] in ' \t\n;':
                            end += 1
                        out.append((base_off + start, base_off + end, m.group(1), text[start:end]))
                        break
            i += 1
        else:
            print('[WARN] 括号未闭合：N["%s"]' % m.group(1))
    return out


def build_chunks(proj, src_path=None):
    """从单文件版（默认 game.html，或 V42_SRC 指定）拆出 chunks 目录 + NODE_MAP.js + game_chunked.html。"""
    os.chdir(proj)
    src = src_path or os.environ.get('V42_SRC', 'game.html')
    html = _read(os.path.join(proj, src) if not os.path.isabs(src) else src)
    opens = [m.start() for m in re.finditer(r'<script>', html)]
    if len(opens) < 3:
        print('[FAIL] script 块不足')
        return 1
    s_open = opens[2]
    s_close = html.find('</script>', s_open)
    block = html[s_open + len('<script>'):s_close]
    defs = _extract_node_defs(block, s_open + len('<script>'))
    print('提取 N 定义:', len(defs))
    chunks = {}
    node_map = {}
    for s, e, nid, body in defs:
        c = _classify(nid)
        chunks.setdefault(c, []).append((s, body))
        node_map[nid] = c
    non_node = []
    cursor = s_open + len('<script>')
    for s, e, nid, body in sorted(defs, key=lambda x: x[0]):
        if s > cursor:
            non_node.append(block[cursor - (s_open + len('<script>')): s - (s_open + len('<script>'))])
        cursor = e
    if cursor < s_close:
        non_node.append(block[cursor - (s_open + len('<script>')): s_close - (s_open + len('<script>'))])
    non_node_text = ''.join(non_node).strip()
    print('非节点代码保留:', len(non_node_text), '字符')

    d = os.path.join(proj, 'chunks')
    os.makedirs(d, exist_ok=True)
    total = 0
    for c, items in chunks.items():
        body_all = ('/* 艾尔达大陆·群雄割据 v42 分片：%s（由 elda chunks 自动生成，勿手改） */\n' % c)
        body_all += '\n'.join(b for _, b in sorted(items, key=lambda x: x[0]))
        body_all += '\n'
        _write(os.path.join(d, c + '.js'), body_all)
        total += len(body_all)
        print('  %-16s %4d 节点 %8d 字符' % (c, len(items), len(body_all)))
    nm_lines = ['/* 节点→分片映射表（自动生成） */', 'const NODE_MAP = {']
    for nid in sorted(node_map):
        nm_lines.append('  "%s":"%s",' % (nid, node_map[nid]))
    nm_lines.append('};')
    _write(os.path.join(d, 'NODE_MAP.js'), '\n'.join(nm_lines))
    print('NODE_MAP.js:', len(node_map), '条映射')

    # 引用全部 8 个 story_* 分片（story_core 最先，其余按名排序，保证分片版节点完整）
    ordered = ['story_core.js'] + sorted(c + '.js' for c in chunks if c != 'story_core')
    src_refs = ''.join('<script src="chunks/%s"></script>\n' % f for f in ordered)
    # N 必须先于分片定义：把 non_node_text 里的 N 定义段拆出提前
    n_head = ''
    n_tail = non_node_text
    m = re.search(r'const\s+N\s*=\s*\{\};\s*window\.N\s*=\s*N;', non_node_text)
    if m:
        n_head = m.group(0) + ';'
        n_tail = non_node_text[:m.start()] + non_node_text[m.end():]
    new_block = ('<script>' + n_head + '</script>\n' if n_head else '') + \
                ('<script src="chunks/NODE_MAP.js"></script>\n' + src_refs) + \
                '<script>\n/* 剧情节点已分片加载（v42） */\n' + \
                (n_tail + '\n' if n_tail else '') + \
                '</script>'
    chunked = html[:s_open] + new_block + html[s_close:]
    _write(os.path.join(proj, 'game_chunked.html'), chunked)
    print('game_chunked.html:', len(chunked), '字符')
    print('分片构建完成')
    return 0


# ---------------- 3. 分片合并验证（v42） ----------------

def verify_chunks(proj):
    os.chdir(proj)
    html = _read(os.path.join(proj, 'game_chunked.html'))
    chunks_text = ''
    for f in sorted(os.listdir(os.path.join(proj, 'chunks'))):
        if f.endswith('.js'):
            chunks_text += _read(os.path.join(proj, 'chunks', f)) + '\n'
    merged = html + '\n' + chunks_text
    node_ids = set(re.findall(r'N\[["\']([^"\']+)["\']\]\s*=\s*(?:function|{)', merged))
    print('合并节点总数:', len(node_ids))

    single = _read(os.path.join(proj, 'game.html'))
    single_ids = set(re.findall(r'N\[["\']([^"\']+)["\']\]\s*=\s*(?:function|{)', single))
    for f in sorted(os.listdir(os.path.join(proj, 'chunks'))):
        if f.startswith('v62_') and f.endswith('.js'):
            single_ids |= set(re.findall(r'nodes\[["\']([^"\']+)["\']\]\s*=\s*function',
                                         _read(os.path.join(proj, 'chunks', f))))
    print('单文件版节点总数(含v62分片):', len(single_ids))
    miss = single_ids - node_ids
    extra = node_ids - single_ids
    print('分片版缺失节点:', len(miss))
    for m in list(miss)[:10]:
        print('  MISS:', m)
    print('分片版多余节点:', len(extra))
    for m in list(extra)[:10]:
        print('  EXTRA:', m)

    go_refs = re.findall(r'go:\s*"([^"]+)"', merged)
    dead = [r for r in go_refs if r not in node_ids]
    print('go引用总数:', len(go_refs), '死链:', len(dead))
    for dd in Counter(dead).most_common(10):
        print('  死链:', dd)

    ph = re.findall(r'【此处剧情尚未展开[^】]*】|【占位[^】]*】', merged)
    print('占位标记:', len(ph), '(writeNext 兜底提示除外:',
          len(re.findall(r'【此处剧情尚未展开。存档编号', merged)), ')')

    opens = [m.start() for m in re.finditer(r'<script', html)]
    print('game_chunked.html <script 标签数:', len(opens))
    print('game_chunked.html 大小:', len(html))
    return 0 if not miss and not dead else 1


# ---------------- 4. 分片语法检查（v42） ----------------

def chk_syntax(proj):
    os.chdir(proj)
    html = _read(os.path.join(proj, 'game_chunked.html'))
    tmp = os.path.join(proj, '_v42_chk')
    os.makedirs(tmp, exist_ok=True)
    fails = []
    count = 0
    for i, m in enumerate(re.finditer(r'<script>(.*?)</script>', html, re.S)):
        count += 1
        p = os.path.join(tmp, 'inline_%d.js' % i)
        _write(p, m.group(1))
        r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
        if r.returncode != 0:
            fails.append('inline_%d.js: %s' % (i, r.stderr.strip()[:300]))
    for f in sorted(os.listdir(os.path.join(proj, 'chunks'))):
        if not f.endswith('.js'):
            continue
        count += 1
        p = os.path.join(proj, 'chunks', f)
        r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
        if r.returncode != 0:
            fails.append('%s: %s' % (p, r.stderr.strip()[:300]))
    print('检查 %d 个 JS 文件' % count)
    if fails:
        print('FAIL:')
        for f in fails:
            print(' ', f)
        return 1
    print('全部 node --check PASS')
    return 0
