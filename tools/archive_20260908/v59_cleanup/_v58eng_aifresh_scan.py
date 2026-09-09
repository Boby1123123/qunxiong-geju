# -*- coding: utf-8 -*-
"""_v58eng_aifresh_scan.py — 任务一：AI 味去味扫描（v2：全节点覆盖，按批分组）
扫描全部 N["id"] 节点，按 AI_WORDS_STRONG 词表统计命中，按批次前缀分组输出对照表。
只读，不改文件。输出 docs\替换对照表_v58.md
"""
import io, re, os, datetime

BASE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(BASE, 'game.html')
OUT = os.path.join(BASE, 'docs', '替换对照表_v58.md')

AI_WORDS_STRONG = ['仿佛', '似乎', '然而', '悄然', '缓缓', '微微', '目光一凝', '眼眸',
                   '不知不觉', '莫名', '隐隐', '微微一愣', '心头一紧', '望向远方']

# 批分组（按节点 id 前缀）
BATCHES = [
    ('批1_序章', ['prologue_']),
    ('批2_封印线', ['seal_']),
    ('批3_圣辉城', ['city_jiaohui_']),
    ('批4_其余高频', None),  # None = 除前三批外的全部命中节点
]

PAT_NODE = re.compile(r'N\["([^"]+)"\]\s*=\s*function\s*\([^)]*\)\s*\{')


def read_html():
    with io.open(HTML, 'r', encoding='utf-8') as f:
        return f.read()


def line_of(html, pos):
    return html.count('\n', 0, pos) + 1


def node_body(html, m):
    """返回节点函数体（含开头 N["id"]=function()），括号配平。"""
    start = m.start()
    depth = 0
    i = m.end()
    n = len(html)
    in_str = None
    while i < n:
        c = html[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == in_str:
                in_str = None
            i += 1
            continue
        if c in ('"', "'", '`'):
            in_str = c
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return start, i + 1, html[start:i + 1]
        i += 1
    return None


def scan():
    html = read_html()
    # 收集全部节点命中
    all_hits = []  # (nid, ln, word, count, block, snippet)
    for m in PAT_NODE.finditer(html):
        nid = m.group(1)
        r = node_body(html, m)
        if not r:
            continue
        start, end, block = r
        ln = line_of(html, start)
        for w in AI_WORDS_STRONG:
            c = block.count(w)
            if c:
                # 取首个命中的原句片段
                pos = block.find(w)
                snip = block[max(0, pos - 50):pos + 50].replace('\n', ' ')
                all_hits.append((nid, ln, w, c, snip))
    # 按节点聚合
    by_node = {}
    for nid, ln, w, c, snip in all_hits:
        by_node.setdefault(nid, {'ln': ln, 'hits': []})
        by_node[nid]['hits'].append((w, c, snip))
    # 分组输出
    lines = []
    lines.append('# AI 味替换对照表 v58（任务一扫描·全节点）\n')
    lines.append('> 生成：%s · 命中节点 %d / 命中处 %d\n' % (
        datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
        len(by_node), len(all_hits)))
    processed = set()
    for bname, prefixes in BATCHES:
        lines.append('\n## %s\n' % bname)
        lines.append('| 节点 | 行 | 命中 | 原句片段 |')
        lines.append('|---|---|---|---|')
        if prefixes is None:
            # 其余：未被任何前缀匹配的
            nodes = sorted(n for n in by_node
                           if not any(n.startswith(p) for _, ps in BATCHES if ps for p in ps))
        else:
            nodes = sorted(n for n in by_node if any(n.startswith(p) for p in prefixes))
        cnt = 0
        for nid in nodes:
            processed.add(nid)
            d = by_node[nid]
            cnt += 1
            wl = '，'.join('%s×%d' % (w, c) for w, c, _ in d['hits'])
            for w, c, snip in d['hits']:
                lines.append('| %s | %d | %s | …%s… |' % (nid, d['ln'], wl, snip[:100]))
        lines.append('— 本批节点 %d 个 —' % cnt)
        lines.append('')
    lines.append('\n## 汇总\n')
    lines.append('| 批次 | 节点数 |')
    lines.append('|---|---|')
    for bname, prefixes in BATCHES:
        if prefixes is None:
            nodes = [n for n in by_node
                     if not any(n.startswith(p) for _, ps in BATCHES if ps for p in ps)]
        else:
            nodes = [n for n in by_node if any(n.startswith(p) for p in prefixes)]
        lines.append('| %s | %d |' % (bname, len(nodes)))
    with io.open(OUT, 'w', encoding='utf-8') as f:
        f.write(''.join(lines))
    print('扫描完成：命中节点=%d 命中处=%d -> %s' % (len(by_node), len(all_hits), OUT))


if __name__ == '__main__':
    scan()
