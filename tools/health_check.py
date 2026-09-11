#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
群雄割据 · 地基体检（只读，一键全貌）
=====================================
用法:
    python -X utf8 tools\\health_check.py            # 人类可读体检报告
    python -X utf8 tools\\health_check.py --json     # JSON（供程序消费）
    python -X utf8 tools\\health_check.py --quick    # 只跑 A/B/C 三块（体积/CRLF/预算）

用途：每次开工/收尾前跑一条，即可拿到"发布文件、CRLF、节点覆盖、预算余量、
git 状态、体积分布"全貌，避免重复手工探查。只读，不修改任何文件。

已固化的历史发现（详见 docs\\地基体检报告_v94.md）：
  1. core.autocrlf=true 且无 .gitattributes：git 检出/变基会把发布文件转 CRLF，
     体积虚增（game.html 10070739 -> 10182446B），预算门会误报 FAIL。
     修复：tools\\normalize_lf.py（或加 .gitattributes eol=lf）。
  2. 单文件版 game.html 只含 src 内嵌节点（window.N ~3883），分片版
     game_chunked.html 全量（window.N ~5593）；v62 分片节点（academy_* 等）
     未内嵌进单文件版。四路字节只保证 game=game_check、chunked=index 两两一致，
     不保证"单文件版节点覆盖=全量"。本工具 A 块输出两版节点覆盖差异。
  3. V35 模块系统报错 [V35] Module not found: core 为注册/加载竞态（历史遗留，
     script_00 与 script_04 重复定义 v35_arch_init），运行时 core 实际 loaded=true，
     功能无影响，但控制台刷屏。
"""
import io
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLISH = ["game.html", "game_check.html", "game_chunked.html", "index.html", "game_built.html"]
SRC_DIR = os.path.join(ROOT, "src")
DN_DIR = os.path.join(SRC_DIR, "data_nodes")
CHUNKS_DIR = os.path.join(ROOT, "chunks")
BUDGET = os.path.join(ROOT, "budget.json")


def read_bytes(p):
    try:
        with io.open(p, "rb") as f:
            return f.read()
    except Exception:
        return None


def crlf_stats(b):
    if b is None:
        return None
    crlf = b.count(b"\r\n")
    lf = b.count(b"\n")
    return {"crlf": crlf, "lf": lf, "lone_lf": lf - crlf, "size": len(b)}


def js_node_count(path):
    """启发式统计单个 JS 文件里 N["id"]= 的节点定义数（近似，排除注释行，快速）。"""
    b = read_bytes(path)
    if b is None:
        return None
    try:
        t = b.decode("utf-8", errors="replace")
    except Exception:
        return None
    cnt = 0
    for ln in t.splitlines():
        s = ln.strip()
        if not s or s.startswith("//") or s.startswith("/*") or s.startswith("*"):
            continue
        if re.search(r'(?:window\.)?N\["[A-Za-z0-9_]+"\]\s*=', s):
            cnt += 1
    return cnt


def run(cmd, timeout=120):
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8",
                           errors="replace", timeout=timeout, cwd=ROOT)
        return r.returncode, (r.stdout or "") + ("\n" + r.stderr if r.stderr else "")
    except Exception as e:
        return -1, str(e)


def elda_node_total():
    """elda ci 口径节点数：node_total 统计。快速读取 budget.baseline 并尝试 ci 输出。"""
    try:
        b = json.load(io.open(BUDGET, encoding="utf-8"))
        return b.get("baseline", {}).get("node_total")
    except Exception:
        return None


def main():
    want_json = "--json" in sys.argv
    quick = "--quick" in sys.argv
    out = {}

    # ---------- A 块：发布文件 + CRLF + 节点覆盖 ----------
    a = {"files": [], "pairs": []}
    for f in PUBLISH:
        p = os.path.join(ROOT, f)
        if not os.path.exists(p):
            a["files"].append({"file": f, "exists": False})
            continue
        st = crlf_stats(read_bytes(p))
        nd = js_node_count(p)
        a["files"].append({"file": f, "size": st["size"], "crlf": st["crlf"],
                           "lone_lf": st["lone_lf"], "node_defs_approx": nd})
    # 两两一致性
    pairs = [("game.html", "game_check.html"), ("game_chunked.html", "index.html")]
    for x, y in pairs:
        bx = read_bytes(os.path.join(ROOT, x))
        by = read_bytes(os.path.join(ROOT, y))
        a["pairs"].append({"x": x, "y": y, "match": bx is not None and bx == by,
                           "x_size": None if bx is None else len(bx),
                           "y_size": None if by is None else len(by)})
    # 单文件版 vs 全量节点覆盖（静态近似：全量 = src + chunks 定义数；另调 elda volume 取权威口径）
    all_defs = 0
    for root, _dirs, files in os.walk(SRC_DIR):
        for f in files:
            if f.endswith(".js"):
                n = js_node_count(os.path.join(root, f))
                if n:
                    all_defs += n
    if os.path.isdir(CHUNKS_DIR):
        for f in os.listdir(CHUNKS_DIR):
            if f.endswith(".js"):
                n = js_node_count(os.path.join(CHUNKS_DIR, f))
                if n:
                    all_defs += n
    a["all_defs_src_plus_chunks"] = all_defs
    a["single_file_defs"] = next((x["node_defs_approx"] for x in a["files"]
                                  if x.get("file") == "game.html"), None)
    # 权威口径：elda volume --json（失败则留 None，不阻塞体检）
    rc, so = run(["python", "-X", "utf8", os.path.join("tools", "elda", "elda.py"),
                  "volume", "--json"], timeout=180)
    a["elda_volume"] = None
    if rc == 0 and so.strip():
        try:
            a["elda_volume"] = json.loads(so)
        except Exception:
            a["elda_volume"] = {"parse_error": so[:200]}
    out["A_publish"] = a

    # ---------- B 块：体积分布 ----------
    bsec = {"scripts": [], "scripts_total": 0, "dn_count": 0, "dn_total": 0}
    if os.path.isdir(SRC_DIR):
        scripts = [f for f in os.listdir(SRC_DIR)
                   if f.startswith("script_") and f.endswith(".js")]
        for f in sorted(scripts, key=lambda x: -os.path.getsize(os.path.join(SRC_DIR, x))):
            sz = os.path.getsize(os.path.join(SRC_DIR, f))
            bsec["scripts"].append({"file": f, "size": sz})
            bsec["scripts_total"] += sz
    if os.path.isdir(DN_DIR):
        dns = [f for f in os.listdir(DN_DIR) if f.endswith(".js")]
        bsec["dn_count"] = len(dns)
        bsec["dn_total"] = sum(os.path.getsize(os.path.join(DN_DIR, f)) for f in dns)
    out["B_volume"] = bsec

    # ---------- C 块：预算余量 ----------
    csec = {}
    try:
        b = json.load(io.open(BUDGET, encoding="utf-8"))
        csec["budget"] = b.get("budgets", {})
        csec["baseline"] = b.get("baseline", {})
    except Exception as e:
        csec["error"] = str(e)
    out["C_budget"] = csec

    # ---------- D 块：git ----------
    dsec = {}
    rc, so = run(["git", "log", "--oneline", "-3"])
    dsec["recent"] = so.strip().splitlines() if rc == 0 else []
    rc, so = run(["git", "status", "--short"])
    dsec["dirty"] = [x for x in so.splitlines() if x.strip()][:15]
    rc, so = run(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    dsec["branch"] = so.strip() if rc == 0 else ""
    rc, so = run(["git", "config", "core.autocrlf"])
    dsec["autocrlf"] = so.strip()
    out["D_git"] = dsec

    if want_json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
        return

    # ---------- 人类可读 ----------
    print("=" * 66)
    print("群雄割据 · 地基体检（只读）")
    print("=" * 66)
    print("\n[A] 发布文件")
    for x in a["files"]:
        if x.get("exists") is False:
            print("  [缺失] %s" % x["file"])
            continue
        cr = "CRLF=%d" % x["crlf"] if x["crlf"] else "LF"
        if x.get("lone_lf"):
            cr += " !混合换行!"
        print("  %-18s %10d B  %s  节点定义≈%s" % (x["file"], x["size"], cr, x["node_defs_approx"]))
    for p in a["pairs"]:
        print("  四路 %s==%s -> %s (%dB/%dB)" % (
            p["x"], p["y"], "一致" if p["match"] else "**不一致**", p["x_size"], p["y_size"]))
    print("  [节点覆盖] 单文件版≈%s / src+chunks 全量≈%s  %s" % (
        a["single_file_defs"], a["all_defs_src_plus_chunks"],
        "（单文件版缺分片节点！见体检报告 #2）"
        if a["single_file_defs"] and a["all_defs_src_plus_chunks"]
        and a["single_file_defs"] < a["all_defs_src_plus_chunks"] * 0.8 else ""))
    if a.get("elda_volume"):
        ev = a["elda_volume"]
        if isinstance(ev, dict) and "nodes" in ev:
            print("  [elda 口径] volume.nodes=%s" % ev.get("nodes"))
        elif isinstance(ev, dict) and "node_total" in ev:
            print("  [elda 口径] volume.node_total=%s" % ev.get("node_total"))

    print("\n[B] 体积分布")
    for s in bsec["scripts"][:8]:
        print("  %-16s %10d B" % (s["file"], s["size"]))
    print("  script_* 合计 %d B | data_nodes %d 文件 %d B" % (
        bsec["scripts_total"], bsec["dn_count"], bsec["dn_total"]))

    print("\n[C] 预算余量")
    bg = csec.get("budget", {})
    bl = csec.get("baseline", {})
    game = next((x["size"] for x in a["files"] if x.get("file") == "game.html"), None)
    chunk = next((x["size"] for x in a["files"] if x.get("file") == "game_chunked.html"), None)
    if game is not None and "game_html_bytes_max" in bg:
        print("  game.html  %10d / max %10d  余量 %10d" % (
            game, bg["game_html_bytes_max"], bg["game_html_bytes_max"] - game))
    if chunk is not None and "chunked_html_bytes_max" in bg:
        print("  chunked    %10d / max %10d  余量 %10d" % (
            chunk, bg["chunked_html_bytes_max"], bg["chunked_html_bytes_max"] - chunk))
    print("  node_total_min=%s (基线 %s)  full_seconds_max=%s" % (
        bg.get("node_total_min"), bl.get("node_total"), bg.get("full_seconds_max")))

    print("\n[D] git")
    print("  branch: %s  autocrlf: %s" % (dsec.get("branch"), dsec.get("autocrlf")))
    for r in dsec.get("recent", []):
        print("  %s" % r)
    if dsec.get("dirty"):
        print("  !!! 工作区有 %d 个变更（未提交）" % len(dsec["dirty"]))
        for x in dsec["dirty"][:8]:
            print("     %s" % x)
    else:
        print("  工作区干净")

    print("\n[F] 结论提示")
    warns = []
    if any(x.get("crlf") for x in a["files"] if x.get("exists")):
        warns.append("发布文件为 CRLF（git 检出所致）→ 跑 tools\\normalize_lf.py 或加 .gitattributes")
    if a["single_file_defs"] and a["all_defs_src_plus_chunks"] and \
            a["single_file_defs"] < a["all_defs_src_plus_chunks"] * 0.8:
        warns.append("单文件版缺分片节点 → 建议 build 内嵌 chunks（见报告 #2）")
    if game is not None and "game_html_bytes_max" in bg and game > bg["game_html_bytes_max"]:
        warns.append("game.html 超预算！需 elda budget --reason 更新或还原")
    if not warns:
        warns.append("未发现结构级问题（V35 报错为遗留竞态，运行时无功能影响）")
    for w in warns:
        print("  [!] %s" % w)
    print("=" * 66)


if __name__ == "__main__":
    main()
