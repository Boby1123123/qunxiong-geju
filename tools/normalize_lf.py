#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
群雄割据 · 发布文件 LF 规范化（幂等，git 无 diff）
=================================================
背景：core.autocrlf=true 且无 .gitattributes，git 检出/变基会把发布文件与
src/chunks 转成 CRLF，体积虚增（game.html 10070739 -> 10182446B），预算门误报。
git index 中实际存的是 LF，因此把工作区文件转回 LF 后 git 判定无改动。

用法:
    python -X utf8 tools\\normalize_lf.py            # 规范化发布文件+src+chunks
    python -X utf8 tools\\normalize_lf.py --check    # 只报告不改
    python -X utf8 tools\\normalize_lf.py --publish  # 只规范化 5 个发布文件

建议：每次 git pull/rebase/checkout 之后、跑 elda ci 之前执行一次。
"""
import io
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLISH = ["game.html", "game_check.html", "game_chunked.html", "index.html", "game_built.html"]
SRC_DIR = os.path.join(ROOT, "src")
CHUNKS_DIR = os.path.join(ROOT, "chunks")


def targets(publish_only):
    files = [os.path.join(ROOT, f) for f in PUBLISH]
    if publish_only:
        return files
    for base in (SRC_DIR, CHUNKS_DIR):
        if not os.path.isdir(base):
            continue
        for root, _dirs, fs in os.walk(base):
            for f in fs:
                if f.endswith(".js"):
                    files.append(os.path.join(root, f))
    return files


def main():
    check_only = "--check" in sys.argv
    publish_only = "--publish" in sys.argv
    converted, already, failed = [], [], []
    for p in targets(publish_only):
        if not os.path.exists(p):
            continue
        try:
            with io.open(p, "rb") as f:
                b = f.read()
        except Exception as e:
            failed.append((p, str(e)))
            continue
        crlf = b.count(b"\r\n")
        if crlf == 0:
            already.append(p)
            continue
        nb = b.replace(b"\r\n", b"\n")
        if check_only:
            converted.append((p, len(b), len(nb)))
            continue
        try:
            with io.open(p, "wb") as f:
                f.write(nb)
            converted.append((p, len(b), len(nb)))
        except Exception as e:
            failed.append((p, str(e)))

    print("群雄割据 LF 规范化%s" % ("（检查模式）" if check_only else ""))
    if converted:
        for p, old, new in converted[:40]:
            print("  [转LF] %-46s %d -> %d B（-%d）" % (os.path.relpath(p, ROOT), old, new, old - new))
        if len(converted) > 40:
            print("  ... 共 %d 个文件" % len(converted))
    else:
        print("  无需转换（全部已是 LF）")
    print("  已为 LF: %d  |  转换: %d  |  失败: %d" % (len(already), len(converted), len(failed)))
    for p, e in failed:
        print("  [FAIL] %s : %s" % (p, e))
    if not check_only and converted:
        print("完成。git 层面应为无改动（index 存 LF）；跑 git status 确认。")
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(main())
