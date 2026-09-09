# -*- coding: utf-8 -*-
"""V58-ENG 收尾·任务一 批4：其余高频节点 AI 味去味（块内分组替换模式）
幂等 marker: /v58eng:aifresh/misc/"""
import io
import re

SRC = 'game.html'
MARK = 'v58eng:aifresh:misc'

REPL = {
    'relic_hourglass': [
        ('你看了一眼自己的手，发现手指的影子在微微晃动，像是有两个时间在同时流动。',
         '你看了一眼自己的手，发现手指的影子在晃动，像是有两个时间在同时流动。'),
        ('密室中央，一个金色的沙漏在缓缓流动——但沙子是往上流的。',
         '密室中央，一个金色的沙漏在流动——但沙子是往上流的。'),
        ('但沙漏本身似乎被人取走了。线索+2。',
         '但沙漏本身被人取走了。线索+2。'),
    ],
    'eclipse_intro': [
        ('地下室的天花板很低，你不得不微微弯腰。',
         '地下室的天花板很低，你不得不弯着腰。'),
        ('地下室里的温度似乎降了几度。',
         '地下室里的温度降了几度。'),
        ('「当然，」他的嘴角微微上扬，露出一个没有温度的笑容，',
         '「当然，」他的嘴角一翘，露出一个没有温度的笑容，'),
    ],
    'relic_grail_boss': [
        ('是一种你从未见过的、微微发光的金属。杯壁上刻着细密的符文，在你的手心里微微发热。',
         '是一种你从未见过的、发着光的金属。杯壁上刻着细密的符文，在你手心里发热。'),
        ('圣杯在你的怀里，微微发烫——像是在抗议，又像是在哭泣。',
         '圣杯在你怀里发烫——像是在抗议，又像是在哭泣。'),
    ],
    'pol_guardian': [
        ('冰凉的金属贴上掌心，一瞬间，你仿佛听见封印后面传来一声极轻的叹息',
         '冰凉的金属贴上掌心，一瞬间，你听见封印后面传来一声极轻的叹息'),
        ('埃德蒙看着你把徽章收好，微微颔首：「从今天起，你是守望者在学院的第二联络人。',
         '埃德蒙看着你把徽章收好，点了一下头：「从今天起，你是守望者在学院的第二联络人。'),
        ('你们走出密室，青铜门在身后缓缓合拢。',
         '你们走出密室，青铜门在身后合拢。'),
    ],
    'dun_ruins_treasure': [
        ('一卷泛黄的帛书漂浮起来，缓缓落进你手心。',
         '一卷泛黄的帛书漂浮起来，落进你手心。'),
        ('你握着帛书，指节微微用力。',
         '你握着帛书，指节用力。'),
        ('你转身离开时，石台中央的石匣，缓缓合上了盖子，像一场仪式结束。',
         '你转身离开时，石台中央的石匣，合上了盖子，像一场仪式结束。'),
    ],
    'dun_tower_treasure': [
        ('你的战斗，似乎为封印注入了力量。',
         '你的战斗，为封印注入了力量。'),
        ('你仿佛看见塔顶的窗口，那个半张脸的看守，正朝你微微颔首。',
         '你看见塔顶的窗口，那个半张脸的看守，正朝你点了点头。'),
    ],
    'dun_arena_1': [
        ('你踩上去，脚下微微发滑。',
         '你踩上去，脚下发滑。'),
        ('战魂守卫缓缓起身，拔出插在石板里的断刃长枪',
         '战魂守卫站起身，拔出插在石板里的断刃长枪'),
        ('照亮那些空荡荡的座位——仿佛有无数观众在注视着这场试炼。',
         '照亮那些空荡荡的座位——像有无数观众在注视着这场试炼。'),
    ],
}


def extract_block(html, nid):
    m = re.search(r'N\["' + re.escape(nid) + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        return None, None
    start = m.start()
    depth = 0
    in_str = None
    i = start
    n = len(html)
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
        if c in ('"', "'"):
            in_str = c
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                break
        i += 1
    return start, i + 1


def main():
    with io.open(SRC, 'r', encoding='utf-8') as f:
        html = f.read()
    touched = []
    total = 0
    for nid, items in REPL.items():
        start, end = extract_block(html, nid)
        if start is None:
            raise SystemExit('节点不存在 @ %s' % nid)
        blk = html[start:end]
        if MARK in blk:
            continue
        cnt = 0
        for old, new in items:
            c = blk.count(old)
            if c == 0:
                continue  # 已在前次执行中替换（marker被剥离后重跑）
            if c > 1:
                raise SystemExit('块内锚点不唯一 (%d处) @ %s: %s' % (c, nid, old[:40]))
            blk = blk.replace(old, new, 1)
            cnt += 1
        if cnt == 0:
            continue
        m2 = re.search(r'(N\["' + re.escape(nid) + r'"\]\s*=\s*function\s*\()', blk)
        if not m2:
            raise SystemExit('marker 定位失败 @ %s' % nid)
        blk = blk[:m2.end()] + ' /*' + MARK + '*/' + blk[m2.end():]
        html = html[:start] + blk + html[end:]
        touched.append(nid)
        total += cnt
    with io.open(SRC, 'w', encoding='utf-8') as f:
        f.write(html)
    print('批4 完成：替换 %d 项，触及节点 %s' % (total, sorted(touched)))


if __name__ == '__main__':
    main()
