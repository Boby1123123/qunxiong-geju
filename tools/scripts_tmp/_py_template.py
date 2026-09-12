# -*- coding: utf-8 -*-
"""<任务名>：<一句话说明>（写 .py 执行，禁止 -c 内联中文）"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ── 使用铁律 ──────────────────────────────────────────
# 1. 执行方式：.\tools\runpy.ps1 tools\scripts_tmp\<本文件>
# 2. 读写文件一律显式 encoding="utf-8", newline="\n"（防 CRLF 污染发布文件）
# 3. 代码内出现任何中文字面量都安全（UTF-8 文件 + -X utf8 执行）
# 4. 跑完归档：Move-Item 到 backup\scripts_archive\tmp\
# ─────────────────────────────────────────────────────

def main():
    pass

if __name__ == "__main__":
    main()
