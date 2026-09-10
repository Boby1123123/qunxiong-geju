# -*- coding: utf-8 -*-
# 修复：npc 动态区块误插到 v92_openThreadPanel（两个面板关闭按钮锚点相同，find 取到第一个）
# 从第一个关闭按钮前移除，插入第二个（v92_openWorldPanel）关闭按钮前
import io

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P3, "r", encoding="utf-8", newline="").read()
crlf = raw.count("\r\n") > 0
src = raw.replace("\r\n", "\n")

close_btn = """    h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>";"""
block_start = "    var npcs = (typeof window.v92_npcStatusList===\"function\") ? window.v92_npcStatusList() : [];"

# 找到 npc 区块出现位置（只应出现一次）
bi = src.find(block_start)
if bi < 0:
    print("FAIL: npc 区块未找到"); raise SystemExit(1)
# 区块结束 = 该段代码块结束（找到后面第一个 "}\n" 前的空行——按结构找 "    }\n" 结尾）
block_end_marker = """    }
"""
be = src.find(block_end_marker, bi)
if be < 0:
    print("FAIL: 区块结尾未找到"); raise SystemExit(1)
block = src[bi:be+len(block_end_marker)]

# 确认区块当前在 v92_openThreadPanel 内（在第一个 close_btn 前）
first_close = src.find(close_btn)
if first_close < 0 or not (bi < first_close):
    print("FAIL: 区块位置异常"); raise SystemExit(1)

# 1) 从原位置移除
src = src[:bi] + src[be+len(block_end_marker):]

# 2) 重新找关闭按钮（现在是两个，第一个是 v92_openThreadPanel，第二个是 v92_openWorldPanel）
first_close2 = src.find(close_btn)
second_close2 = src.find(close_btn, first_close2+1)
if second_close2 < 0:
    print("FAIL: 第二个关闭按钮未找到"); raise SystemExit(1)
src = src[:second_close2] + block + src[second_close2:]

if crlf:
    src = src.replace("\n", "\r\n")
io.open(P3, "w", encoding="utf-8", newline="").write(src)
print("OK: npc 动态区块已移至 v92_openWorldPanel")
