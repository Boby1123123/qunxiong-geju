# -*- coding: utf-8 -*-
"""用括号配对法精确删除被覆盖的旧版 academy_year5_intro 定义"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
html = open('game.html', encoding='utf-8').read()

start_anchor = 'N["academy_year5_intro"] = function(){ return {'
pos = html.find(start_anchor)
print('旧版起点 @%d' % pos)
if pos < 0:
    print('未找到，退出'); sys.exit(0)

# 从起点后开始括号配对
# start_anchor 含 function(){ 与 return { 两个 '{'，深度从 2 起
depth = 2
i = pos + len(start_anchor) - 1  # 停在 'return {' 的最后一个 '{' 上
j = i + 1
n = len(html)
while j < n and depth > 0:
    c = html[j]
    if c == '{':
        depth += 1
    elif c == '}':
        depth -= 1
        if depth == 0:
            # 需要匹配到 '};' 的 ';'
            break
    j += 1
# 向后吃 ';'（可能紧跟）
end = j + 1
while end < n and html[end] in ' \t\r\n;':
    end += 1

seg = html[pos:end]
print('删除块长度 %d，尾缀: %r' % (len(seg), seg[-30:]))
# 校验：块内不含另一处 academy_year5_intro 定义（生效版）
if '毕业礼堂' in seg:
    print('★警告：块内含毕业礼堂内容，中止'); sys.exit(1)

html = html[:pos] + html[end:]
open('game.html','w',encoding='utf-8').write(html)
print('已删除旧版，剩余 academy_year5_intro 定义数: %d' % html.count('N["academy_year5_intro"]'))
