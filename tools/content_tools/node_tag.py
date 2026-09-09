# -*- coding: utf-8 -*-
"""node_tag.py — 内容标签系统（P2-1）：按规则为节点打 tag 字段。

tag 分类: main(主线) / branch(支线) / event(事件) / ending(结局) / easter(彩蛋)
规则（可配置，自动判定；不改节点正文，仅在节点体追加 tag 字段——引擎忽略未知字段，安全）。
用法:
  python tools/content_tools/node_tag.py --scan     # 只统计不写
  python tools/content_tools/node_tag.py --apply    # 应用 tag 到 src 节点（写前备份）
"""
import io, os, re, sys, glob, shutil, time, json

PROJ = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'))
SRC = os.path.join(PROJ, 'src')

# 规则：id 前缀 → 标签
PREFIX_RULES = [
    ('main', ['pro_', 'main_', 'fc_', 'city_', 'arrive_']),     # 主线/城市场景
    ('branch', ['arc_', 'quest_', 'npc_', 'side_', 'h_', 'combat_']),  # 支线/任务/战斗
    ('event', ['event', 'rand_', 'daily_']),                     # 事件
    ('ending', ['ending', 'epilogue', 'aftermath']),             # 结局/后日谈
    ('easter', ['easter', 'hidden', 'secret', '彩蛋']),          # 彩蛋/隐藏
]

def classify(nid):
    for tag, prefs in PREFIX_RULES:
        for pre in prefs:
            if nid.startswith(pre) or pre in nid:
                return tag
    return None

def scan():
    stats = {}
    total = 0
    for p in sorted(glob.glob(os.path.join(SRC, '*.js'))):
        t = io.open(p, encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'N\["([^"]+)"\]\s*=\s*(?:function\s*\([^)]*\)\s*\{\s*return\s*)?(\{)', t):
            nid = m.group(1)
            total += 1
            tag = classify(nid)
            if tag:
                stats[tag] = stats.get(tag, 0) + 1
    print('可自动打标节点: %d / %d' % (sum(stats.values()), total))
    for k, v in sorted(stats.items(), key=lambda x: -x[1]):
        print('  %-8s %d' % (k, v))
    return stats, total

def apply():
    stamp = time.strftime('%Y%m%d_%H%M%S')
    added = 0
    for p in sorted(glob.glob(os.path.join(SRC, '*.js'))):
        t = io.open(p, encoding='utf-8', errors='replace').read()
        new_t = t
        edits = []
        for m in re.finditer(r'N\["([^"]+)"\]\s*=\s*(?:function\s*\([^)]*\)\s*\{\s*return\s*)?(\{)', t):
            nid = m.group(1)
            if 'tag' in t[m.start():m.end() + 60]:  # 已有 tag
                continue
            tag = classify(nid)
            if not tag:
                continue
            ins = m.end()  # '{' 之后
            # 在 { 后插入 "tag":"xx",
            edits.append((ins, 'tag:%s,' % json.dumps(tag, ensure_ascii=False)))
        if edits:
            shutil.copyfile(p, os.path.join(PROJ, 'backup', 'tags_%s_%s' % (stamp, os.path.basename(p))))
            for off, ins in sorted(edits, key=lambda x: -x[0]):
                new_t = new_t[:off] + ins + new_t[off:]
            io.open(p, 'w', encoding='utf-8', newline='').write(new_t)
            added += len(edits)
            print('  %s: +%d tag' % (os.path.basename(p), len(edits)))
    print('共打标 %d 节点（备份已生成）。请跑 elda ci + 浏览器回归。' % added)

if __name__ == '__main__':
    if '--apply' in sys.argv:
        apply()
    else:
        scan()
