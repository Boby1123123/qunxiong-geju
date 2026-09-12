# -*- coding: utf-8 -*-
import io, re, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

OBJ_HELPER = '''
def _extract_js_object(html, var_name):
    """提取 window.VAR = { ... };（括号配平，兼容数组/对象）"""
    m = re.search(r'window\\.%s\\s*=\\s*(\\[|\\{)' % re.escape(var_name), html)
    if not m:
        return None
    opener = m.group(1)
    closer = ']' if opener == '[' else '}'
    depth = 0
    in_str = False
    esc = False
    j = m.end() - 1
    while j < len(html):
        c = html[j]
        if in_str:
            if esc:
                esc = False
            elif c == '\\\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == opener:
                depth += 1
            elif c == closer:
                depth -= 1
                if depth == 0:
                    return html[m.end() - 1:j + 1]
        j += 1
    return None
'''

for fn, importline in [
    ("tools/eldacheck/checks/c_echo.py", None),
    ("tools/eldacheck/checks/c_faction.py", None),
    ("tools/eldacheck/checks/c_warfront.py", None),
]:
    t = open(fn, encoding="utf-8").read()
    # 注入 helper
    if "_extract_js_object" not in t:
        t = t.replace("def _extract_js_array", OBJ_HELPER + "\ndef _extract_js_array", 1)
    open(fn, "w", encoding="utf-8", newline="").write(t)
    print("helper injected ->", fn)

# c_echo: 城市集合改用对象提取；悬空引用排除文档泛词
t = open("tools/eldacheck/checks/c_echo.py", encoding="utf-8").read()
t = t.replace(
    'def _city_set(html):\n    """从 LW_DATA.cityOwn 提取城市集合（含 special 键）"""\n    seg = _extract_js_array(html, \'LW_DATA\')',
    'def _city_set(html):\n    """从 LW_DATA.cityOwn 提取城市集合（含 special 键）"""\n    seg = _extract_js_object(html, \'LW_DATA\')'
)
t = t.replace(
    "    seg = _extract_js_array(html, 'LW_DATA')\n    data = _js_to_json(seg) if seg else None\n    echo_map = (data or {}).get('echoMap') or []",
    "    seg = _extract_js_object(html, 'LW_DATA')\n    data = _js_to_json(seg) if seg else None\n    echo_map = (data or {}).get('echoMap') or []"
)
t = t.replace(
    "    dangling = sorted(set(r for r in refs if r not in known))",
    "    dangling = sorted(set(r for r in refs if r not in known and r != 'id'))"
)
open("tools/eldacheck/checks/c_echo.py", "w", encoding="utf-8", newline="").write(t)
print("c_echo updated")

# c_faction: 对象提取
t = open("tools/eldacheck/checks/c_faction.py", encoding="utf-8").read()
t = t.replace(
    "    seg = _extract_js_array(html, 'LW_DATA')",
    "    seg = _extract_js_object(html, 'LW_DATA')"
)
open("tools/eldacheck/checks/c_faction.py", "w", encoding="utf-8", newline="").write(t)
print("c_faction updated")

# c_warfront: 对象提取
t = open("tools/eldacheck/checks/c_warfront.py", encoding="utf-8").read()
t = t.replace(
    "    seg = _extract_js_array(html, 'LW_DATA')",
    "    seg = _extract_js_object(html, 'LW_DATA')"
)
open("tools/eldacheck/checks/c_warfront.py", "w", encoding="utf-8", newline="").write(t)
print("c_warfront updated")
