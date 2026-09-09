# -*- coding: utf-8 -*-
"""v41 超大型全面核查：代码/框架/结构/故事 四维度审计"""
import re, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

html = open('game.html', encoding='utf-8').read()
L = len(html)
print('='*70)
print('【0】文件基础')
print('  文件大小: %.2f MB, 字符数: %d' % (L/1048576, L))

# ---------- 1. script 结构 ----------
print('\n'+'='*70)
print('【1】script/style 结构完整性')
scripts = re.findall(r'<script[^>]*>', html)
styles  = re.findall(r'<style[^>]*>', html)
print('  script 开标签: %d 个' % len(scripts))
print('  style  开标签: %d 个' % len(styles))
print('  </script> 闭合: %d 个' % html.count('</script>'))
print('  </style>  闭合: %d 个' % html.count('</style>'))
# 每个 script 是否含 src
for i,s in enumerate(scripts):
    print('    script[%d]: %s' % (i, s[:80]))
# script 标签内的内容是否成对（括号粗查由 node 负责）

# ---------- 2. 节点格式统计 ----------
print('\n'+'='*70)
print('【2】节点格式统计')
n_func = re.findall(r'N\["([^"]+)"\]\s*=\s*function\s*\(', html)
n_obj  = re.findall(r'N\["([^"]+)"\]\s*=\s*\{', html)
print('  function 格式节点: %d 个' % len(n_func))
print('  对象格式节点: %d 个' % len(n_obj))
# 重名残留（同一 ID 两种格式同时存在）
set_func, set_obj = set(n_func), set(n_obj)
dup = sorted(set_func & set_obj)
print('  ★重名残留（两格式同ID）: %d 个 %s' % (len(dup), dup[:20]))
# function 内部重复（同 ID 多次 function 定义）
from collections import Counter
cf = Counter(n_func)
rep_func = {k:v for k,v in cf.items() if v>1}
print('  ★function 格式内部重复: %d 个 %s' % (len(rep_func), list(rep_func.items())[:10]))
co = Counter(n_obj)
rep_obj = {k:v for k,v in co.items() if v>1}
print('  对象格式内部重复: %d 个 %s' % (len(rep_obj), list(rep_obj.items())[:10]))

# ---------- 3. 死链 ----------
print('\n'+'='*70)
print('【3】死链检查（go 目标不存在）')
all_ids = set_func | set_obj
# 收集所有 go:"xxx"
gos = re.findall(r'go\s*:\s*"([^"]+)"', html)
missing = sorted(set(g for g in gos if g not in all_ids and not g.startswith('run:')))
print('  go 引用总数: %d, 死链: %d 个' % (len(gos), len(missing)))
for g in missing[:30]:
    print('    ✗', g)

# ---------- 4. 孤立节点（无入边） ----------
print('\n'+'='*70)
print('【4】孤立节点（定义了但无任何入边）')
referenced = set(g for g in gos if g in all_ids)
# 引擎特殊调用（startNode/curNode 赋值、jumpTo 等）
engine_targets = set(re.findall(r'(?:curNode|jumpTo|goTo|startNode)\s*=\s*"([^"]+)"', html))
referenced |= engine_targets
# run: 目标
run_targets = set(re.findall(r'run\s*:\s*"([^"]+)"', html))
referenced |= run_targets
# 动态拼接的 go 目标（go:curNode+xxx 之类）难静态查，先标出
dynamic_go = re.findall(r'go\s*:\s*[^"][^,}]{0,40}', html)
print('  动态 go 表达式（需人工确认）: %d 处' % len(dynamic_go))
for d in dynamic_go[:10]:
    print('    ~', d.strip()[:60])
isolated = sorted(all_ids - referenced)
print('  ★孤立节点: %d 个' % len(isolated))
print('  前40个:', isolated[:40])

# ---------- 5. 占位文本残留 ----------
print('\n'+'='*70)
print('【5】占位/残缺文本检查')
ph_markers = ['此节点为v38自动生成的占位节点','你来到了一个新的地方','占位节点','TODO','待补','占位']
ph_found = {}
for mk in ph_markers:
    c = html.count(mk)
    if c: ph_found[mk] = c
print('  占位标记命中:', ph_found if ph_found else '无 ✓')
# 空文本节点：text:[] 或 text:[""]
empty_text = re.findall(r'text\s*:\s*\[\s*\]', html)
print('  空文本数组节点: %d 处' % len(empty_text))
short_txt = re.findall(r'text\s*:\s*\[\s*"([^"]{0,20})"\s*\]', html)
print('  单段超短文本(≤20字): %d 处' % len(short_txt))
for t in short_txt[:15]:
    print('    ~', t[:40])

# ---------- 6. 引擎关键函数 ----------
print('\n'+'='*70)
print('【6】引擎关键函数定义检查')
core_funcs = ['writeNext','choose','newGame','saveGame','loadGame','askConfirm',
              'advanceTime','startCombat','openModal','closePanel','renderStats',
              'renderTop','writePar','openRealmPanel','initTime','doCultivate',
              'showRollResult','renderInventory','openMap','ensureMechInit','worldTick']
for fn in core_funcs:
    defined = bool(re.search(r'function\s+%s\b' % fn, html)) or bool(re.search(r'(?:const|let|var)\s+%s\s*=' % fn, html))
    called  = len(re.findall(r'\b%s\s*\(' % fn, html))
    print('  %-18s 定义:%s 调用次数:%d' % (fn, '✓' if defined else '✗ 缺失', called))

# ---------- 7. S 对象初始化 ----------
print('\n'+'='*70)
print('【7】S 对象初始化检查')
s_init = re.findall(r'S\s*=\s*\{', html)
print('  S 初始定义: %d 处' % len(s_init))
for key in ['time','parallelEvents','worldTimers','fatigue','npcSchedules','shopStates',
            'originPrologue','foreshadowing','prologueTime','journey','moralChoices',
            'academy','orientation','quest','enemies','inventory','faction','seal']:
    c = len(re.findall(r'\bS\.%s\b' % key, html))
    print('  S.%-18s 引用:%d' % (key, c))

# ---------- 8. 选项格式 ----------
print('\n'+'='*70)
print('【8】选项格式（t: 与 text: 混用检查）')
opt_text = re.findall(r'\{\s*text\s*:', html)
opt_t = re.findall(r'\{\s*t\s*:', html)
print('  选项用 text: 的: %d 处（应为0，统一 t:）' % len(opt_text))
print('  选项用 t: 的: %d 处' % len(opt_t))

# ---------- 9. 故事主线链路 ----------
print('\n'+'='*70)
print('【9】故事主线骨干链路检查（节点存在性）')
chains = {
 '建号→序章': ['start','prologue_origin','origin_choose','pro_arrive'],
 '序章→旅程': ['prologue_hub','journey_choose','journey_caravan','journey_solo'],
 '旅程→学院': ['academy_arrive','academy_main','orientation_day1','orientation_day5'],
 '学院→大陆': ['academy_year5','graduation','graduation_choose','world_map'],
 '大陆→七印': ['world_continue','seal_choose','seal1_intro','seal2_intro','seal3_intro','seal4_intro','seal5_intro','seal6_intro','seal7_intro'],
 '七印→结局': ['seal7_act4_final','ending_check','ending_choose','ending_eclipse'],
}
for name, ids in chains.items():
    miss = [i for i in ids if i not in all_ids]
    print('  %-12s %s' % (name, '✓ 全部存在' if not miss else '✗ 缺失: %s' % miss))

# ---------- 10. 特殊/危险模式 ----------
print('\n'+'='*70)
print('【10】危险模式检查')
# eval / innerHTML 注入 / 外部脚本
print('  eval( 调用: %d 处' % len(re.findall(r'\beval\s*\(', html)))
print('  document.write: %d 处' % len(re.findall(r'document\.write', html)))
print('  <script src= 外部: %d 处' % len(re.findall(r'<script[^>]+src=', html)))
print('  innerHTML 使用: %d 处' % len(re.findall(r'innerHTML', html)))
# localStorage 键
ls = re.findall(r'localStorage\.\w+\s*\(\s*["\']([^"\']+)', html)
print('  localStorage 键: %s' % sorted(set(ls)))
print('\n审计完成')
