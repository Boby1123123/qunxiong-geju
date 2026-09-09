# -*- coding: utf-8 -*-
"""U1-A3 历史脚本归档：_v*.py(354) + 非 active _p*.py(44) -> backup/scripts_archive/"""
import io, os, glob, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ARC = os.path.join(HERE, 'backup', 'scripts_archive')
VDIR = os.path.join(ARC, 'v')
PDIR = os.path.join(ARC, 'p')
os.makedirs(VDIR, exist_ok=True)
os.makedirs(PDIR, exist_ok=True)

KEEP_P = {'_p12_quests.py'}  # active 生成器保留根目录
moved = {'v': [], 'p': []}

for pat, key in [('_v*.py', 'v'), ('_p*.py', 'p')]:
    for f in sorted(glob.glob(os.path.join(HERE, pat))):
        base = os.path.basename(f)
        if key == 'p' and base in KEEP_P:
            continue
        if key == 'p' and base == '_u1_check_refs.py':
            continue
        dst = os.path.join(VDIR if key == 'v' else PDIR, base)
        shutil.move(f, dst)
        moved[key].append(base)

# 清单 README
lines = [
    '# 历史开发脚本归档（U1-A3）',
    '',
    '归档时间：2026-09-09（批 U1 内容外置化 + 构建链收编）',
    '说明：以下脚本均为历史开发/探查/临时工具，经核查不被任何 active 运行链引用',
    '（elda.py / chunks_impl.py / smoke_test.py / _p12_quests.py / _build_authority.py 零引用），',
    '移出根目录以消除构建链混淆与维护噪音。归档即"只读保留"，如需复用可拷回。',
    '',
    '## v/ 目录（_v*.py 历史版本脚本）共 %d 个' % len(moved['v']),
    '```',
]
lines += moved['v']
lines += ['```', '', '## p/ 目录（_p*.py 探查/诊断脚本）共 %d 个' % len(moved['p']), '```']
lines += moved['p']
lines += ['```', '', '## 根目录保留的 active 脚本', '```',
          '- _build_authority.py（权威源构建闭环，elda build 依赖）',
          '- _p12_quests.py（P1-2 支线幂等生成器）',
          '- smoke_test.py（冒烟测试）']
io.open(os.path.join(ARC, 'README.md'), 'w', encoding='utf-8').write('\n'.join(lines))

# 根目录剩余 _*.py
left = sorted(glob.glob(os.path.join(HERE, '_*.py')))
print('归档 v=%d p=%d | 根目录剩余 _*.py=%d:' % (len(moved['v']), len(moved['p']), len(left)))
for f in left:
    print('  ', os.path.basename(f))
