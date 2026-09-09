#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具2：增强构建脚本
功能：
1. 构建时记录每个数据卷在最终HTML中的行号偏移
2. 保存行号映射到 _build_map.json
3. 提供 locate_error(html_line) 函数，根据HTML行号反推源文件和行号
4. 构建后自动运行 node --check，报错时自动定位源文件
用法：
  python tools/build_enhanced.py          # 构建+检查
  python tools/build_enhanced.py --check  # 只检查语法（不重新构建）
  python tools/build_enhanced.py --locate 41346  # 定位HTML第41346行的源文件
"""
import io, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, HERE)

# 颜色输出
class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

# 所有数据卷列表（按构建顺序）
VOLUMES = [
    ('b', 'story_elda_b.py'), ('c', 'story_elda_c.py'), ('d', 'story_elda_d.py'),
    ('e', 'story_elda_e.py'), ('f', 'story_elda_f.py'), ('g', 'story_elda_g.py'),
    ('h', 'story_elda_h.py'), ('i', 'story_elda_i.py'), ('j', 'story_elda_j.py'),
    ('k', 'story_elda_k.py'), ('l', 'story_elda_l.py'), ('m', 'story_elda_m.py'),
    ('n', 'story_elda_n.py'), ('o', 'story_elda_o.py'), ('p', 'story_elda_p.py'),
    ('q', 'story_elda_q.py'), ('r', 'story_elda_r.py'), ('s', 'story_elda_s.py'),
    ('t', 'story_elda_t.py'), ('u', 'story_elda_u.py'), ('v', 'story_elda_v.py'),
    ('w', 'story_elda_w.py'), ('y', 'story_elda_y.py'), ('x', 'story_elda_x.py'),
    ('y2', 'story_elda_y2.py'), ('z', 'story_elda_z.py'),
    ('aa', 'story_elda_aa.py'), ('ab', 'story_elda_ab.py'), ('ac', 'story_elda_ac.py'),
    ('ad', 'story_elda_ad.py'), ('ae', 'story_elda_ae.py'), ('af', 'story_elda_af.py'),
    ('ag', 'story_elda_ag.py'), ('ah', 'story_elda_ah.py'), ('ai', 'story_elda_ai.py'),
    ('aj', 'story_elda_aj.py'), ('ak', 'story_elda_ak.py'), ('al', 'story_elda_al.py'),
    ('am', 'story_elda_am.py'), ('an', 'story_elda_an.py'), ('ao', 'story_elda_ao.py'),
    ('ap', 'story_elda_ap.py'), ('aq', 'story_elda_aq.py'), ('ar', 'story_elda_ar.py'),
    ('as', 'story_elda_as.py'), ('at', 'story_elda_at.py'), ('au', 'story_elda_au.py'),
    ('av', 'story_elda_av.py'), ('aw', 'story_elda_aw.py'), ('ax', 'story_elda_ax.py'),
    ('ay', 'story_elda_ay.py'), ('az', 'story_elda_az.py'),
    ('ba', 'story_elda_ba.py'), ('bb', 'story_elda_bb.py'), ('bc', 'story_elda_bc.py'),
    ('bd', 'story_elda_bd.py'), ('be', 'story_elda_be.py'), ('bf', 'story_elda_bf.py'),
    ('bg', 'story_elda_bg.py'), ('bh', 'story_elda_bh.py'), ('bi', 'story_elda_bi.py'),
    ('bj', 'story_elda_bj.py'), ('bk', 'story_elda_bk.py'),
]

def extract_js_from_py(filepath):
    """从Python数据卷中提取JS代码（NODES_XX = r'''...'''）"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # 匹配 NODES_XX = r'''...''' 或 JS_BLOCK = r'''...'''
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if match:
        return match.group(1)
    return None

def build_with_mapping():
    """构建game.html，并记录行号映射"""
    cprint("=" * 60, Color.BOLD)
    cprint("v29 增强构建工具", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    # 1. 提取每个数据卷的JS代码并记录行号
    cprint("\n[1/4] 提取数据卷JS代码...", Color.CYAN)
    volume_js = {}
    line_map = {}  # {volume_key: {start_line, end_line, filename}}
    current_line = 1  # nodes_js script块从第1行开始
    
    for vol_key, filename in VOLUMES:
        filepath = os.path.join(HERE, filename)
        if not os.path.exists(filepath):
            continue
        js = extract_js_from_py(filepath)
        if js is None:
            continue
        volume_js[vol_key] = js
        line_count = js.count('\n') + 1
        line_map[vol_key] = {
            'start_line': current_line,
            'end_line': current_line + line_count - 1,
            'filename': filename,
            'line_count': line_count
        }
        current_line += line_count + 1  # +1 for join newline
    
    cprint(f"  已提取 {len(volume_js)} 个数据卷", Color.GREEN)
    cprint(f"  nodes_js 总行数: {current_line - 1}", Color.GREEN)
    
    # 2. 调用现有构建
    cprint("\n[2/4] 执行构建...", Color.CYAN)
    try:
        from build_elda import build
        build()
    except Exception as e:
        cprint(f"  构建失败: {e}", Color.RED)
        return False
    
    # 3. 保存行号映射
    cprint("\n[3/4] 保存行号映射...", Color.CYAN)
    map_path = os.path.join(HERE, '_build_map.json')
    with open(map_path, 'w', encoding='utf-8') as f:
        json.dump({
            'volume_map': line_map,
            'total_nodes_lines': current_line - 1,
            'build_time': __import__('datetime').datetime.now().isoformat()
        }, f, ensure_ascii=False, indent=2)
    cprint(f"  映射已保存: {map_path}", Color.GREEN)
    
    # 4. 自动语法检查
    cprint("\n[4/4] 语法检查 (node --check)...", Color.CYAN)
    return check_syntax()

def check_syntax():
    """从game.html抽取script块，运行node --check"""
    html_path = os.path.join(HERE, 'game.html')
    if not os.path.exists(html_path):
        cprint("  game.html 不存在，请先构建", Color.RED)
        return False
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
    cprint(f"  发现 {len(scripts)} 个script块", Color.CYAN)
    
    all_pass = True
    for i, js in enumerate(scripts):
        tmp_path = os.path.join(HERE, f'_chk{i}.js')
        with open(tmp_path, 'w', encoding='utf-8') as f:
            f.write(js)
        
        try:
            result = subprocess.run(
                ['node', '--check', tmp_path],
                capture_output=True, text=True, timeout=30
            )
            if result.returncode == 0:
                cprint(f"  script[{i}]: PASS", Color.GREEN)
            else:
                cprint(f"  script[{i}]: FAIL", Color.RED)
                all_pass = False
                # 解析错误并定位源文件
                parse_and_locate_error(result.stderr, i)
        except Exception as e:
            cprint(f"  script[{i}]: 检查失败 - {e}", Color.RED)
            all_pass = False
        finally:
            # 清理临时文件
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    if all_pass:
        cprint("\n✓ 全部语法检查通过！", Color.GREEN + Color.BOLD)
    else:
        cprint("\n✗ 存在语法错误，请根据上方定位修复", Color.RED + Color.BOLD)
    
    return all_pass

def parse_and_locate_error(stderr, script_index):
    """解析node --check的错误输出，定位到源文件"""
    # 错误格式：_chk1.js:41346\n        relation:"mercury:-10,\n                  ^\n\nSyntaxError: ...
    lines = stderr.strip().split('\n')
    error_line = None
    error_msg = None
    
    for line in lines:
        # 匹配 _chkN.js:行号
        m = re.match(r'_chk\d+\.js:(\d+)', line)
        if m:
            error_line = int(m.group(1))
        # 匹配 SyntaxError
        if 'SyntaxError' in line:
            error_msg = line.strip()
    
    if error_line and script_index == 1:  # nodes_js在第2个script块（index=1）
        source = locate_error(error_line)
        if source:
            cprint(f"    → 源文件定位: {source['filename']} 第{source['local_line']}行", Color.YELLOW)
            cprint(f"    → 错误信息: {error_msg or '未知'}", Color.RED)
            # 显示源文件对应行
            show_source_line(source['filename'], source['local_line'])
    elif error_line:
        cprint(f"    → HTML script[{script_index}] 第{error_line}行", Color.YELLOW)
        cprint(f"    → 错误信息: {error_msg or '未知'}", Color.RED)

def locate_error(html_line):
    """根据HTML中nodes_js的行号，反推源文件和行号"""
    map_path = os.path.join(HERE, '_build_map.json')
    if not os.path.exists(map_path):
        cprint("  未找到_build_map.json，请先运行构建", Color.YELLOW)
        return None
    
    with open(map_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for vol_key, info in data['volume_map'].items():
        if info['start_line'] <= html_line <= info['end_line']:
            local_line = html_line - info['start_line'] + 1
            return {
                'volume': vol_key,
                'filename': info['filename'],
                'local_line': local_line,
                'html_line': html_line
            }
    
    return None

def show_source_line(filename, local_line, context=3):
    """显示源文件指定行的上下文"""
    filepath = os.path.join(HERE, filename)
    if not os.path.exists(filepath):
        return
    
    # 需要从Python文件的JS代码块中定位行
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r"(?:NODES_\w+|JS_BLOCK)\s*=\s*r'''(.*?)'''", content, re.DOTALL)
    if not match:
        return
    
    js_code = match.group(1)
    js_lines = js_code.split('\n')
    
    start = max(0, local_line - 1 - context)
    end = min(len(js_lines), local_line - 1 + context + 1)
    
    cprint(f"    ┌─ 源文件上下文（{filename} JS代码块）:", Color.CYAN)
    for i in range(start, end):
        line_num = i + 1
        prefix = "→ " if line_num == local_line else "  "
        color = Color.YELLOW if line_num == local_line else ''
        cprint(f"    │ {prefix}{line_num:4d}: {js_lines[i][:100]}", color)
    cprint(f"    └──────────────────────────────────────", Color.CYAN)

def main():
    if len(sys.argv) < 2:
        # 默认：构建+检查
        success = build_with_mapping()
        sys.exit(0 if success else 1)
    
    cmd = sys.argv[1]
    
    if cmd == '--check':
        success = check_syntax()
        sys.exit(0 if success else 1)
    
    elif cmd == '--locate':
        if len(sys.argv) < 3:
            cprint("用法: python tools/build_enhanced.py --locate <行号>", Color.RED)
            sys.exit(1)
        line = int(sys.argv[2])
        source = locate_error(line)
        if source:
            cprint(f"HTML第{line}行 → {source['filename']} 第{source['local_line']}行", Color.GREEN)
            show_source_line(source['filename'], source['local_line'])
        else:
            cprint(f"无法定位HTML第{line}行", Color.RED)
        sys.exit(0)
    
    elif cmd == '--map':
        # 显示行号映射表
        map_path = os.path.join(HERE, '_build_map.json')
        if not os.path.exists(map_path):
            cprint("未找到_build_map.json，请先构建", Color.RED)
            sys.exit(1)
        with open(map_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        cprint(f"{'数据卷':<10} {'起始行':<8} {'结束行':<8} {'行数':<8} {'文件名'}", Color.BOLD)
        cprint("-" * 70, Color.CYAN)
        for vol_key, info in sorted(data['volume_map'].items(), key=lambda x: x[1]['start_line']):
            cprint(f"{vol_key:<10} {info['start_line']:<8} {info['end_line']:<8} {info['line_count']:<8} {info['filename']}")
        sys.exit(0)
    
    else:
        cprint(f"未知命令: {cmd}", Color.RED)
        cprint("可用命令: --check / --locate <行号> / --map", Color.YELLOW)
        sys.exit(1)

if __name__ == '__main__':
    main()
