# -*- coding: utf-8 -*-
"""V58-ENG 收尾·任务一 批2：封印线 seal_* 节点 AI 味去味
幂等 marker: /v58eng:aifresh/seal/"""
import io
import re

SRC = 'game.html'
MARK = 'v58eng:aifresh:seal'

REPL = [
    # seal_3_intro
    ('seal_3_intro', '守卫似乎看出了你的疑惑，嘴角微微上扬：「在世界树下，没有什么事能瞒过女王陛下。跟我来吧。」',
     '守卫看出你的疑惑，嘴角一挑：「在世界树下，没有什么事能瞒过女王陛下。跟我来吧。」'),
    ('seal_3_intro', '你感觉到世界树的力量很强大，但似乎有什么东西在影响它。第三印线索+1。',
     '你感觉到世界树的力量很强大，但有什么东西在影响它。第三印线索+1。'),
    # seal_3_queen
    ('seal_3_queen', '艾萨拉似乎看出了你的疑惑，微微一笑。那笑容很美，但你总觉得里面藏着什么。',
     '艾萨拉看出了你的疑惑，笑了一下。那笑容很美，但你总觉得里面藏着什么。'),
    # seal_3_contract
    ('seal_3_contract', '洞穴里的水晶光映在她脸上，银白色的长发像是有了生命一样，在微微发光。',
     '洞穴里的水晶光映在她脸上，银白色的长发像是有了生命一样，发着光。'),
    ('seal_3_contract', '洞穴里的水晶似乎也暗了几分',
     '洞穴里的水晶也暗了几分'),
    ('seal_3_contract', '她收回手，指尖微微发抖，「它是深渊之主的一个面相。',
     '她收回手，指尖在抖，「它是深渊之主的一个面相。'),
    # seal7_exp_coexist_method
    ('seal7_exp_coexist_method', '你感到脚下的沙地，似乎有什么东西正缓缓流动，像一条苏醒的地下水脉。',
     '你感到脚下的沙地，有什么东西正流动起来，像一条苏醒的地下水脉。'),
    ('seal7_exp_coexist_method', '你收回手。封印的纹路，缓缓地流动着。你站在那里，看着它。',
     '你收回手。封印的纹路，还在流动。你站在那里，看着它。'),
]


def node_has_mark(html, nid):
    m = re.search(r'N\["' + nid + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        return True
    blk_end = html.find('\n', m.end())
    seg = html[m.end():blk_end if blk_end != -1 else m.end() + 200]
    return MARK in seg


def main():
    with io.open(SRC, 'r', encoding='utf-8') as f:
        html = f.read()
    touched = []
    for nid, old, new in REPL:
        if node_has_mark(html, nid):
            continue
        c = html.count(old)
        if c != 1:
            raise SystemExit('锚点不唯一或缺失 (%d处) @ %s: %s' % (c, nid, old[:40]))
        html = html.replace(old, new, 1)
        touched.append(nid)
    for nid in set(touched):
        pat = re.compile(r'(N\["' + nid + r'"\]\s*=\s*function\s*\()')
        html, n = pat.subn(r'\1 /*' + MARK + '*/', html, count=1)
        if n != 1:
            raise SystemExit('marker 注入失败 @ %s' % nid)
    with io.open(SRC, 'w', encoding='utf-8') as f:
        f.write(html)
    print('批2 完成：替换 %d 处，触及节点 %s' % (len(touched), sorted(set(touched))))


if __name__ == '__main__':
    main()
