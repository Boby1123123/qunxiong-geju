# -*- coding: utf-8 -*-
"""补修：seal_3_queen / city_jiaohui_slum 残余 AI 味词"""
import io

REPL = [
    ('seal_3_queen', '洞穴里的水晶似乎也暗了一些', '洞穴里的水晶也暗了一些'),
    ('city_jiaohui_slum', '你注意到贫民窟里有一个隐秘的入口，似乎通向地下。',
     '你注意到贫民窟里有一个隐秘的入口，通向地下。'),
]


def main():
    html = io.open('game.html', encoding='utf-8').read()
    for nid, old, new in REPL:
        c = html.count(old)
        if c != 1:
            raise SystemExit('锚点 %d 处 @ %s: %s' % (c, nid, old[:40]))
        html = html.replace(old, new, 1)
    io.open('game.html', 'w', encoding='utf-8').write(html)
    print('补修完成')


if __name__ == '__main__':
    main()
