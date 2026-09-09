# -*- coding: utf-8 -*-
"""V58-ENG 收尾·任务一 批1：序章 prologue_* 节点 AI 味去味
幂等 marker: /v58eng:aifresh/prologue/
只改腔调不改语义；锚点必须唯一，不唯一即报错。"""
import io
import re

SRC = 'game.html'
MARK = 'v58eng:aifresh:prologue'

# (节点id, 旧句, 新句)
REPL = [
    # prologue_market
    ('prologue_market', '它们搅在一起，并不好闻，却莫名让人安心。这味道，是你从小闻到大的。',
     '它们搅在一起，并不好闻，却让人安心。这味道，是你从小闻到大的。'),
    ('prologue_market', '他不像别的路人那样忙着买卖，只是站着，微微侧着身，似乎在看你。',
     '他不像别的路人那样忙着买卖，只是站着，侧过身，朝你这边偏了偏头。'),
    ('prologue_market', '你听到了一些关于物价上涨和商路断供的抱怨。银穗商路似乎出了问题。',
     '你听到了一些关于物价上涨和商路断供的抱怨。银穗商路出了问题。'),
    # prologue_tavern
    ('prologue_tavern', '他看了你一眼，嘴角微微上扬：「你比我想象的要敏锐。」',
     '他看了你一眼，嘴角一翘：「你比我想象的要敏锐。」'),
    ('prologue_tavern', '灰袍人似乎早就注意到你了。他不等你开口就说：「我观察你三天了。',
     '灰袍人早就注意到你了。他不等你开口就说：「我观察你三天了。'),
    ('prologue_tavern', '你靠近了灰袍人，但他似乎不想说话。他只是看了你一眼，放下一枚金币就走了。',
     '你靠近了灰袍人，但他没说话。他只是看了你一眼，放下一枚金币就走了。'),
    ('prologue_tavern', '灰袍人似乎察觉到了你的意图，他提前离开了。',
     '灰袍人察觉了你的意图，他提前离开了。'),
    # prologue_mentor
    ('prologue_mentor', '今天他/她似乎有话要对你说。',
     '今天他/她有事要对你说。'),
    ('prologue_mentor', '导师似乎有心事，教得心不在焉。',
     '导师有心事，教得心不在焉。'),
    ('prologue_mentor', '导师转移了话题，似乎不想讨论学院的事。',
     '导师转移了话题，不想讨论学院的事。'),
    ('prologue_mentor', '导师似乎被你的问题触动了什么，他/她突然变得很冷淡，让你离开。',
     '导师被你的问题触动了什么，他/她突然变得很冷淡，让你离开。'),
]


def node_has_mark(html, nid):
    m = re.search(r'N\["' + nid + r'"\]\s*=\s*function\s*\(', html)
    if not m:
        return True  # 节点不存在视为已完成，避免误报
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
    # 注入 marker（对触及过的节点）
    for nid in set(touched):
        pat = re.compile(r'(N\["' + nid + r'"\]\s*=\s*function\s*\()')
        html, n = pat.subn(r'\1 /*' + MARK + '*/', html, count=1)
        if n != 1:
            raise SystemExit('marker 注入失败 @ %s' % nid)
    with io.open(SRC, 'w', encoding='utf-8') as f:
        f.write(html)
    print('批1 完成：替换 %d 处，触及节点 %s' % (len(touched), sorted(set(touched))))


if __name__ == '__main__':
    main()
