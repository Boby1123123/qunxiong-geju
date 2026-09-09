# -*- coding: utf-8 -*-
"""elda-ci-guard 一键验证门禁（群雄割据）

用法:
  python ci_guard.py --quick   # 快速门禁：node --check(src 26块) -> elda ci -> smoke -> 四路字节校验 -> git 状态
  python ci_guard.py --build   # 完整链：_build_authority.py build -> copy game_built.html->game.html -> elda chunks -> sync -> ci -> smoke -> 字节校验
  python ci_guard.py --report  # 附加：输出 docs\\ci_guard_report_latest.md 报告文件

退出码: 0 = 全绿；非 0 = 有失败项（可接 CI/批处理判断）。
铁律：本脚本只读/只构建产物，绝不修改 src、判定公式、存档语义。
"""
import subprocess, sys, os, shutil, json, datetime

ROOT = r"D:\1pao tuan\群雄割据"
TOOLS_ELDA = os.path.join(ROOT, "tools", "elda", "elda.py")
BUILD_PY = os.path.join(ROOT, "_build_authority.py")
SMOKE_PY = os.path.join(ROOT, "smoke_test.py")
SRC_DIR = os.path.join(ROOT, "src")
DOCS_DIR = os.path.join(ROOT, "docs")

PY = [sys.executable, "-X", "utf8"]


def run(cmd, cwd=ROOT, timeout=900):
    """运行命令，返回 (returncode, stdout, stderr)。PowerShell 无关，直接 subprocess。"""
    try:
        p = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True,
                           encoding="utf-8", errors="replace", timeout=timeout)
        return p.returncode, p.stdout or "", p.stderr or ""
    except subprocess.TimeoutExpired:
        return 124, "", f"TIMEOUT {timeout}s"


def node_check_src():
    """node --check 全部 src/*.js（权威源语法门禁）"""
    if not os.path.isdir(SRC_DIR):
        return {"status": "SKIP", "reason": "src 目录不存在"}
    files = sorted(f for f in os.listdir(SRC_DIR) if f.endswith(".js"))
    ok, errs = 0, []
    for f in files:
        rc, so, se = run(["node", "--check", os.path.join(SRC_DIR, f)], timeout=120)
        if rc == 0:
            ok += 1
        else:
            errs.append(f"{f}: {(se or so).strip()[-200:]}")
    return {"status": "PASS" if ok == len(files) and files else "FAIL",
            "checked": len(files), "ok": ok, "errors": errs}


def byte_quad():
    """四路字节一致：game=game_check、game_chunked=index"""
    pairs = [("game.html", "game_check.html"), ("game_chunked.html", "index.html")]
    rows = []
    for a, b in pairs:
        pa, pb = os.path.join(ROOT, a), os.path.join(ROOT, b)
        sa = os.path.getsize(pa) if os.path.exists(pa) else -1
        sb = os.path.getsize(pb) if os.path.exists(pb) else -1
        rows.append({"a": a, "b": b, "a_bytes": sa, "b_bytes": sb, "match": sa == sb and sa >= 0})
    return {"status": "PASS" if all(r["match"] for r in rows) else "FAIL", "rows": rows}


def git_status():
    rc, so, se = run(["git", "status", "--short"], timeout=60)
    lines = [l for l in (so or "").splitlines() if l.strip()]
    return {"status": "CLEAN" if not lines else "DIRTY", "changed": len(lines),
            "sample": lines[:8]}


def build_full():
    steps = []
    # 1) 重建
    rc, so, se = run(PY + [BUILD_PY, "build"], timeout=900)
    steps.append(("build_authority", rc))
    if rc == 0:
        src_f = os.path.join(ROOT, "game_built.html")
        dst_f = os.path.join(ROOT, "game.html")
        if os.path.exists(src_f):
            shutil.copyfile(src_f, dst_f)
            steps.append(("copy_built_to_game", 0))
        else:
            steps.append(("copy_built_to_game", 1))
    # 2) 分片
    rc, so, se = run(PY + [TOOLS_ELDA, "chunks"], timeout=900)
    steps.append(("elda_chunks", rc))
    # 3) 同步
    rc, so, se = run(PY + [TOOLS_ELDA, "sync"], timeout=300)
    steps.append(("elda_sync", rc))
    return {"status": "PASS" if all(s[1] == 0 for s in steps) else "FAIL", "steps": steps}


def elda_ci():
    rc, so, se = run(PY + [TOOLS_ELDA, "ci"], timeout=1200)
    tail = (so or "").strip().splitlines()[-40:]
    tail_txt = "\n".join(tail)
    return {"status": "PASS" if rc == 0 else "FAIL", "returncode": rc,
            "tail": tail_txt, "err_tail": (se or "").strip()[-300:]}


def smoke():
    rc, so, se = run(PY + [SMOKE_PY], timeout=900)
    tail = (so or "").strip().splitlines()[-25:]
    return {"status": "PASS" if rc == 0 else "FAIL", "returncode": rc,
            "tail": "\n".join(tail), "err_tail": (se or "").strip()[-300:]}


def main():
    argv = sys.argv[1:]
    quick = "--quick" in argv
    full = "--build" in argv
    want_report = "--report" in argv

    report = {"ts": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
              "mode": "build" if full else "quick", "results": {}}

    print("=" * 64)
    print("elda-ci-guard · 群雄割据一键门禁")
    print("mode:", report["mode"], "|", report["ts"])
    print("=" * 64)

    if full:
        r = build_full()
        report["results"]["build_full"] = r
        print("\n[1/5] build+copy+chunks+sync:", r["status"],
              [(s[0], "ok" if s[1] == 0 else f"FAIL({s[1]})") for s in r["steps"]])

    r = node_check_src()
    report["results"]["node_check"] = r
    print(f"\n[{'1' if not full else '2'}/5] node --check src:", r["status"],
          f"({r.get('checked', 0)} 文件, {r.get('ok', 0)} ok)")
    if r.get("errors"):
        for e in r["errors"][:5]:
            print("   !", e)

    r = elda_ci()
    report["results"]["elda_ci"] = r
    print(f"\n[{'2' if not full else '3'}/5] elda ci:", r["status"], f"(rc={r.get('returncode')})")
    print("   --- 输出尾部 ---")
    print("   " + r["tail"].replace("\n", "\n   "))
    if r.get("err_tail"):
        print("   stderr:", r["err_tail"])

    r = smoke()
    report["results"]["smoke"] = r
    print(f"\n[{'3' if not full else '4'}/5] smoke_test:", r["status"], f"(rc={r.get('returncode')})")
    print("   --- 输出尾部 ---")
    print("   " + r["tail"].replace("\n", "\n   "))

    r = byte_quad()
    report["results"]["byte_quad"] = r
    print(f"\n[{'4' if not full else '5'}/5] 四路字节一致:", r["status"])
    for row in r["rows"]:
        print(f"   {row['a']}({row['a_bytes']}) == {row['b']}({row['b_bytes']}) -> {row['match']}")

    r = git_status()
    report["results"]["git_status"] = r
    print(f"\n[git] working tree:", r["status"], f"({r['changed']} 个变更)")
    if r["sample"]:
        for s in r["sample"]:
            print("   ", s)

    overall = all(v.get("status") == "PASS" for k, v in report["results"].items()
                  if k != "git_status")
    report["overall"] = "PASS" if overall else "FAIL"
    print("\n" + "=" * 64)
    print("OVERALL:", report["overall"])
    print("=" * 64)

    if want_report:
        os.makedirs(DOCS_DIR, exist_ok=True)
        out = os.path.join(DOCS_DIR, "ci_guard_report_latest.md")
        with open(out, "w", encoding="utf-8") as fh:
            fh.write("# ci_guard 门禁报告\n\n")
            fh.write(f"- 时间: {report['ts']}\n- 模式: {report['mode']}\n- 结论: **{report['overall']}**\n\n")
            fh.write("## 结果\n\n```json\n" + json.dumps(report, ensure_ascii=False, indent=2) + "\n```\n")
        print("report written:", out)

    sys.exit(0 if overall else 1)


if __name__ == "__main__":
    main()
