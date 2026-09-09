#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v39 补：pol_edmund_mediator + 方向三：伏笔回收系统"""

NODES = [
("pol_edmund_mediator", "学院·西塔楼",
["你没有赴昆特的约。第二天一早，你去找埃德蒙，把昆特的事原原本本告诉了他——包括那封信，和他女儿被圣光扣住的事。",
"埃德蒙听完，沉吟了很久：「昆特的事，我早有所知——他是圣光安插在学院的暗线，但这段日子，他传出去的情报越来越『软』，像是故意在打折扣。」",
"「他女儿的事，是真的？」你问。",
"「是真的。」埃德蒙点头，「昆蒂娜在圣光神学院读神学系，三年前被扣住，成了圣光拿捏昆特的把柄。学院里有几位教授都知道，但没人敢管——圣光的手，伸得太长了。」",
"他站起身：「我去见见他。有些话，我这个副院长出面，比你去说管用。」",
"当天下午，埃德蒙在办公室单独见了昆特。没人知道他们谈了什么——但当晚，昆特托人给你带了一句话：「替我谢谢那位副院长。他让我想起，学院里还有人记得我们这些『暗线』，也是人。」",
"你站在宿舍窗前，看着训练场的方向。夜风里，那个总是凶巴巴的教头，第一次让你觉得，他也不过是个想救女儿的父亲。"],
[{ "t": "继续经营这条关系", "go": "pol_qinte_ally" },
 { "t": "回学生会看看", "go": "pol_hub" }]),

]

def build_js(nodes):
    parts = []
    for nid, place, text, opts in nodes:
        text_lines = ",\n".join('"%s"' % t.replace('"','「') for t in text)
        opt_lines = ",\n".join('{t:"%s", go:"%s"}' % (o["t"].replace('"','「'), o["go"]) for o in opts)
        block = '''N["%s"]=function(){return{
place:"%s",
text:[
%s
],
options:[
%s
]
}};''' % (nid, place, text_lines, opt_lines)
        parts.append(block)
    return "\n\n".join(parts)

if __name__ == '__main__':
    js_code = build_js(NODES)
    header = "\n\n// ============================================================\n// v39 补：pol_edmund_mediator\n// ============================================================\n\n"
    js_code = header + js_code

    with open('game.html','r',encoding='utf-8') as f:
        html = f.read()

    pos = html.rfind('</script>')
    if pos > 0:
        html = html[:pos] + js_code + "\n\n" + html[pos:]
        with open('game.html','w',encoding='utf-8') as f:
            f.write(html)
        print('✓ 已插入 {} 节点'.format(len(NODES)))
    else:
        print('✗ 未找到插入位置')
