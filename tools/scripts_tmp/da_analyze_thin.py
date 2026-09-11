# -*- coding: utf-8 -*-
"""方向A探查：节点级字数分布 + 薄节点清单（<200 字）+ 理想线/线索现状。"""
import io, os, re, glob

ROOT = r'D:\1pao tuan\群雄割据'

def load_js(path):
    with io.open(path, encoding='utf-8') as f:
        return f.read()

# 1) 对象式节点：N["id"] = {...} 文本提取
pat = re.compile(r'N\["([^"]+)"\]\s*=\s*\{', re.S)
# text 提取：text:[...] 或 text:{...} 或 text:"..."
def extract_text(block):
    m = re.search(r'text\s*:\s*(\[.*?\]|\{.*?\}|".*?"|\'.*?\')', block, re.S)
    if not m:
        return []
    raw = m.group(1)
    if raw.startswith('['):
        return re.findall(r'"((?:[^"\\]|\\.)*)"', raw)
    if raw.startswith('"') or raw.startswith("'"):
        return [raw[1:-1]]
    # 变体对象：取 default 数组 + 所有分支数组
    return re.findall(r'"((?:[^"\\]|\\.)*)"', raw)

files = []
for p in glob.glob(os.path.join(ROOT, 'src', 'data_nodes', 'dn_*.js')):
    files.append(p)
for p in glob.glob(os.path.join(ROOT, 'src', 'script_02*.js')):
    files.append(p)
for p in glob.glob(os.path.join(ROOT, 'src', 'script_0[34].js')):
    files.append(p)

node_chars = {}  # id -> (chars, vol)
for p in files:
    vol = os.path.basename(p)[:-3]
    src = load_js(p)
    for m in pat.finditer(src):
        nid = m.group(1)
        # 找该定义到下一个 N[" 或文件尾
        nxt = pat.search(src, m.end())
        block = src[m.end():nxt.start()] if nxt else src[m.end():]
        texts = extract_text(block)
        chars = sum(len(t) for t in texts)
        node_chars[nid] = (chars, vol)

print('节点总数:', len(node_chars))

# 2) 薄节点 <200 字，按卷聚合
thin = {k: v for k, v in node_chars.items() if v[0] < 200}
from collections import Counter
vol_cnt = Counter(v[1] for v in thin.values())
print('\n<200 字节点:', len(thin), '个')
print('按卷分布（前 15）:')
for vol, c in vol_cnt.most_common(15):
    print('  %-24s %d' % (vol, c))

# 3) 理想线节点统计
print('\n=== dn_ideal_goals 节点 ===')
for nid in sorted(k for k in node_chars if k.startswith('ideal') or 'ideal' in k):
    c, v = node_chars[nid]
    print('  %-24s %4d 字  %s' % (nid, c, v))

# 4) 线索节点
print('\n=== dn_clue / clue 节点 ===')
for nid in sorted(k for k in node_chars if 'clue' in k or 'probe' in k):
    c, v = node_chars[nid]
    print('  %-24s %4d 字  %s' % (nid, c, v))
