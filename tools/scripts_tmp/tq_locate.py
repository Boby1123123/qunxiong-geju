# -*- coding: utf-8 -*-
"""TQ 深写定位：列出序章/自由城/北上/学院链 <300字节点清单（只读）"""
import os, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = r"D:\1pao tuan\群雄割据"
SRC = os.path.join(ROOT, "src")

def scan_dir(path):
    out = []
    for root, dirs, files in os.walk(path):
        for f in files:
            if f.endswith(".js") and (f.startswith("dn_") or f.startswith("script_") or f == "chunks"):
                p = os.path.join(root, f)
                out.append(p)
    return out

def extract_nodes(txt):
    """提取 N["id"]={...} 对象式节点（粗切：按 N["id"] 定位到下一个 N[" 或文件尾）"""
    nodes = {}
    for m in re.finditer(r'N\s*\[\s*["\']([^"\']+)["\']\s*\]\s*=\s*\{', txt):
        nid = m.group(1)
        start = m.end()
        # 找配对的结束：从 start 起找下一个 N[" 或 function 边界
        nxt = txt.find('N["', start)
        nxt2 = txt.find("N['", start)
        cands = [x for x in (nxt, nxt2) if x != -1]
        end = min(cands) if cands else len(txt)
        nodes[nid] = txt[start:end]
    return nodes

def node_text_len(block):
    # 统计 text 字段中的中文文本长度（粗略：去掉注释与结构后数汉字）
    m = re.search(r'text\s*:\s*(\[.*?\])', block, re.S)
    if not m:
        return 0
    arr = m.group(1)
    # 变体对象
    if arr.startswith("{"):
        arr = arr
    strs = re.findall(r'["\']([^"\']{4,})["\']', arr)
    return sum(len(re.sub(r'\s', '', s)) for s in strs)

def collect():
    files = scan_dir(SRC)
    thin = []
    for p in files:
        txt = io.open(p, encoding="utf-8", errors="replace").read()
        if 'N["' not in txt:
            continue
        nodes = extract_nodes(txt)
        for nid, blk in nodes.items():
            ln = node_text_len(blk)
            if ln < 300:
                thin.append((nid, ln, os.path.basename(p)))
    return thin

thin = collect()
print(f"<300字节点总数: {len(thin)}")
# 分组统计
from collections import Counter, defaultdict
byf = defaultdict(list)
for nid, ln, f in thin:
    byf[f].append((nid, ln))
print("\n=== 按文件分布（Top 15）===")
for f, items in sorted(byf.items(), key=lambda x: -len(x[1]))[:15]:
    print(f"{f:28s} {len(items):4d}  例: {items[0][0]}")

# 主线链筛选：序章 origin_*、自由城 fc_*、北上 frontier_*、学院 academy_/acad_
pats = {
    "序章 origin_": r"^origin_",
    "自由城 fc_": r"^fc_",
    "北上 frontier_": r"^frontier_",
    "学院 acad_": r"^acad_",
    "学院 academy_": r"^academy_",
    "理想线 goal_": r"^goal_",
    "毕业 grad_": r"^grad_",
}
print("\n=== 主线链薄节点 ===")
for label, pat in pats.items():
    sel = [(n, l) for n, l, f in thin if re.match(pat, n)]
    print(f"{label:16s} {len(sel):4d} 个")
    if sel:
        print("    " + ", ".join(f"{n}({l})" for n, l in sel[:18]))
