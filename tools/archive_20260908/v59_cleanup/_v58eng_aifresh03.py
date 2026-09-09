# -*- coding: utf-8 -*-
"""V58-ENG 收尾·任务一 批3：圣辉城 city_jiaohui_* 节点 AI 味去味（块内分组替换模式）
幂等 marker: /v58eng:aifresh/city/"""
import io
import re

SRC = 'game.html'
MARK = 'v58eng:aifresh:city'

# 按节点分组：{nid: [(old, new), ...]}
REPL = {
    'city_jiaohui_medici': [
        ('他说『半个管事』的时候，嘴角微微上扬，像是在说一个只有自己知道的笑话。',
         '他说『半个管事』的时候，嘴角一翘，像是说一个只有自己知道的笑话。'),
        ('「你是来谈生意的，还是来找人的？」他微微歪头，看着你，浅褐色的眼睛里闪过一丝好奇。',
         '「你是来谈生意的，还是来找人的？」他歪了歪头，看着你，浅褐色的眼睛里闪过一丝好奇。'),
        ('亚历山大似乎对你很感兴趣，他告诉了你一些商会内部的消息。',
         '亚历山大对你很感兴趣，他告诉了你一些商会内部的消息。'),
    ],
    'city_jiaohui_medici_secret': [
        ('亚历山大的表情微微一变。',
         '亚历山大的表情一变。'),
        ('大厅里的喧闹声似乎离你们很远了。你能听到自己的心跳声，还有亚历山大微微急促的呼吸声。',
         '大厅里的喧闹声离你们远了。你能听到自己的心跳声，还有亚历山大急促的呼吸声。'),
    ],
    'city_jiaohui_slum': [
        ('你忍不住皱了皱眉，但周围的人似乎早就习惯了',
         '你忍不住皱了皱眉，但周围的人早就习惯了'),
        ('你注意到贫民窟里的人似乎在害怕什么，他们总是看向同一个方向。',
         '你注意到贫民窟里的人总往同一个方向看，像是怕什么从那边过来。'),
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
    print('批3 完成：替换 %d 项，触及节点 %s' % (total, sorted(touched)))


if __name__ == '__main__':
    main()
