#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""c_tags: 节点 tag 元数据通道检查（elda ci 第 26 检查器，UPG-04 新增）。

1. tags 格式合法：每个 tag 为单词（^[a-z][a-z0-9]*$）或 命名空间:值（^[a-z]+:[a-z0-9]+$）
2. 关键节点 tags 非空：
   - ending_* 结局节点必须含 ending:* 标签
   - tag:"combat" 节点必须含 combat 标签
   - anchor_* 七锚节点必须含 anchor 标签
3. 事件池：EVENT_POOL_EXT 事件若带 tags 字段，必须为合法数组且元素合法
"""
import io, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
GAME = os.path.join(ROOT, 'game.html')

_TAG_RE = re.compile(r'^([a-z][a-z0-9]*)(:[a-z0-9]+)?$')


def _all_src_text():
    """合并 src 全部 js（权威源）"""
    parts = []
    src = os.path.join(ROOT, 'src')
    for root, _, fs in os.walk(src):
        for f in sorted(fs):
            if f.endswith('.js'):
                parts.append(io.open(os.path.join(root, f), encoding='utf-8').read())
    return '\n'.join(parts)


def _node_objects(text):
    """返回 [(id, 对象文本段)]，覆盖 N["id"] = { ... } 形式"""
    pat = re.compile(r'N\[\s*["\']([^"\']+)["\']\s*\]\s*=\s*\{')
    out = []
    for m in pat.finditer(text):
        nid = m.group(1)
        brace = text.find('{', m.end() - 1)
        if brace < 0 or brace > m.start() + 300:
            continue
        depth = 0; in_str = esc = False; j = brace
        while j < len(text):
            c = text[j]
            if in_str:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': in_str = False
                elif c == "'" and text[j-1] != '\\': in_str = False
            else:
                if c == '"' or c == "'": in_str = True
                elif c == '{': depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        out.append((nid, text[brace:j + 1]))
                        break
            j += 1
    return out


def run(html=None):
    if html is None:
        try:
            html = io.open(GAME, encoding='utf-8').read()
        except Exception:
            html = _all_src_text()
    text = html
    nodes = _node_objects(text)
    bad = []
    checked = 0

    def get_tags(body):
        m = re.search(r'tags\s*:\s*\[([^\]]*)\]', body, re.S)
        if not m:
            return None
        return re.findall(r'"([^"]+)"', m.group(1))

    for nid, body in nodes:
        tags = get_tags(body)
        # 1) 格式校验（存在 tags 时）
        if tags is not None:
            checked += 1
            for tg in tags:
                if not _TAG_RE.match(tg):
                    bad.append('%s 非法 tag 格式: %s' % (nid, tg))
        # 2) 关键节点 tags 非空
        if nid.startswith('ending_'):
            if not tags or not any(t.startswith('ending:') for t in tags):
                bad.append('%s 结局节点缺 ending:* tag' % nid)
        if re.search(r'tag\s*:\s*["\']combat["\']', body):
            if not tags or 'combat' not in tags:
                bad.append('%s 战斗节点缺 combat tag' % nid)
        if nid.startswith('anchor_'):
            if not tags or 'anchor' not in tags:
                bad.append('%s 七锚节点缺 anchor tag' % nid)

    # 3) 事件池 tags 合法性
    m = re.search(r'window\.EVENT_POOL_EXT\s*=\s*\[', text)
    if m:
        i = m.end() - 1
        depth = 0; in_str = esc = False; j = i
        while j < len(text):
            c = text[j]
            if in_str:
                if esc: esc = False
                elif c == '\\': esc = True
                elif c == '"': in_str = False
            else:
                if c == '"': in_str = True
                elif c == '[': depth += 1
                elif c == ']':
                    depth -= 1
                    if depth == 0:
                        seg = text[i:j + 1]
                        break
            j += 1
        for em in re.finditer(r'tags\s*:\s*\[([^\]]*)\]', seg):
            for tg in re.findall(r'"([^"]+)"', em.group(1)):
                if not _TAG_RE.match(tg):
                    bad.append('事件池非法 tag: %s' % tg)

    if bad:
        results = [{
            'name': '节点tag通道 %d 问题' % len(bad),
            'ok': False,
            'msg': '; '.join(b[:100] for b in bad[:6]),
        }]
        return {'name': '节点tag通道', 'ok': False, 'results': results, 'details': {'bad': bad[:25]}}
    results = [{
        'name': '节点tag通道 %d 节点含 tags、格式合法、关键节点全覆盖' % checked,
        'ok': True,
        'msg': '全部通过',
    }]
    return {'name': '节点tag通道', 'ok': True, 'results': results, 'details': {'checked': checked}}
