# -*- coding: utf-8 -*-
"""TQ-2 第一批：goal_intro 8 节点扩写（每节点在末段前插入 2 段）"""
import os, re, io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

ROOT = r"D:\1pao tuan\群雄割据"
FILE = os.path.join(ROOT, r"src\data_nodes\dn_ideal_goals.js")
txt = io.open(FILE, encoding="utf-8", errors="replace").read()

EXP = {
"goal_intro_wealth":[
"你翻了个身，木板床吱呀响。楼下酒馆的门开了一下，一阵笑声和麦酒味涌上来，又合上了。你把那些人的脸一张张在脑子里过了一遍——码头管事的、账房先生、那个卸货时偷懒被呵斥的苦力。",
"外面有马蹄声由远及近，在客栈门口停了一歇，又走了。你不知道那是谁，就像不知道明天会遇到什么。可你知道一件事：在这座城里，钱就是路。你闭上眼，把这句老话又默念了一遍。"
],
"goal_intro_might":[
"那支战歌的调子，你只听过一回，却在喉咙里滚了一晚上。你坐起来，把拳头攥紧又松开，指节的旧伤隐隐发胀——那是去年在铁门关帮人搬石头时磨的。",
"你想起村里那个总把“拳头大才是硬道理”挂在嘴边的老铁匠。他打了一辈子铁，也教过你：刀要快，先要稳。你摸了摸枕边的短刀，刀柄上缠着的布条，是你出发那天自己缠的。"
],
"goal_intro_guard":[
"夜里你翻来覆去，总想起那个老汉蹲在路边捡炭的背影。他的手指粗黑，指甲缝里嵌着煤灰，一颗一颗往筐里放，动作慢得像怕碰碎什么。",
"你当时只替他捡了几颗，他就连声道谢，弯着腰，像是欠了你多大的情。你闭上眼，那声“多谢”还在耳边。你忽然明白，这世上大多数人都活得不易，可他们连一声谢都说得小心翼翼。"
],
"goal_intro_truth":[
"那半卷残本你还夹在包袱里。白天你翻过最后一页，缺的地方正好是封印的结果——到底成没成，谁也不知道。你盯着房梁，把白天读到的句子在心里拼了又拼。",
"楼下有人在争论什么，声音忽高忽低。你听了一会儿，没听清，也懒得听。你只想知道，三百年前那次封印，到底发生了什么。这个问题像一根刺，扎得你睡不着。"
],
"goal_intro_free":[
"城外的风从窗缝钻进来，带着草原和雪原混合的气味。你坐起来，把窗推开一条缝，风一下子涌进来，吹得桌上的油灯晃了晃。远处有灯火，一明一灭，不知是哪家的夜灯。",
"你想起小时候爬过的那些山。山没有路，可你想去哪儿，就往哪儿走。你心里那根弦松了下来——这座城再热闹，也拴不住你。天一亮，你就走。"
],
"goal_intro_god":[
"星子确实很亮，亮得像假的。你看了很久，脖子酸了也不肯低头。教堂的钟敲过一响，沉沉的，在夜里滚出去很远。你想起白天那些信徒的眼神——低垂的，温顺的，像被驯服的火。",
"你把手伸出窗外，风从指缝穿过。你攥了攥拳，什么也没抓住。可你反而踏实了：神不给你答案，那你就自己走到够得着答案的地方去。"
],
"goal_intro_fame":[
"那个吟游诗人的调子你还记得一半，断断续续的，在脑子里哼了一夜。他唱的英雄叫什么名字，你忘了，可他唱到那句“后来的人说起他，像说起一个传说”时，你心里忽然动了一下。",
"你坐起来，摸黑找到自己的名字，在桌上用手指一笔一划写了一遍。笔画在木纹里，很快就看不出痕迹。可你知道，字写在心里，是擦不掉的。"
],
"goal_intro_revenge":[
"旧伤在夜里比白天疼得清楚。你隔着衣裳按了按，那道疤横在肋下，像一道没写完的句子。你记得那年冬天的冷，记得火把照亮的那几张脸，记得自己跪在雪地里被人踩住手背的滋味。",
"后来你走了很远的路，把那座村子远远甩在身后。可有些东西甩不掉。你睁开眼，望着黑漆漆的房梁，一字一字地对自己说：欠我的，我亲手讨回来。"
],
}

def js_str(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

def expand(txt, nid, segs):
    m = re.search(r'N\["' + re.escape(nid) + r'"\]=[^;]+;', txt, re.S)
    if not m:
        print(f"{nid}: NOT FOUND"); return txt
    blk = m.group(0)
    tm = re.search(r'text\s*:\s*\[', blk)
    if not tm:
        print(f"{nid}: no text array"); return txt
    t0 = tm.end()
    tail = re.search(r'\](?=\s*,?\s*options)', blk[t0:])
    if not tail:
        print(f"{nid}: no array end"); return txt
    t1 = t0 + tail.start()
    arr = blk[t0:t1]
    strs = list(re.finditer(r'"(?:[^"\\]|\\.)*"', arr))
    if not strs:
        print(f"{nid}: no string elems"); return txt
    last = strs[-1]
    ins = "".join(js_str(s) + ",\n" for s in segs)
    newarr = arr[:last.start()] + ins + arr[last.start():]
    newblk = blk.replace(arr, newarr, 1)
    txt = txt.replace(blk, newblk, 1)
    print(f"{nid}: +{sum(len(s) for s in segs)} 字 (→ {len(strs)+len(segs)} 段)")
    return txt

for nid, segs in EXP.items():
    txt = expand(txt, nid, segs)

io.open(FILE, "w", encoding="utf-8", newline="\n").write(txt)
print("== done ==")
