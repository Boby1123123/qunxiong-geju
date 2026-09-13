# -*- coding: utf-8 -*-
"""群雄割据 chunk 清单生成器（SW 预缓存用）
扫描 chunks/ 目录生成 chunks.json（含哈希名分片清单），供 sw.js install 时预缓存。
用法: python -X utf8 tools\\gen_chunk_manifest.py [--check]
  --check: 只校验现有 chunks.json 与磁盘一致，不写文件（返回 0=一致）
铁律: 每次 elda chunks 重新生成分片后必须重跑本脚本（哈希名每次构建变化）。
"""
import os, sys, json, hashlib, datetime

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHUNKS_DIR = os.path.join(PROJ, "chunks")
MANIFEST = os.path.join(PROJ, "chunks.json")

COMPRESSIBLE = (".js", ".json", ".html", ".css", ".webmanifest", ".txt")


def list_chunk_files():
    if not os.path.isdir(CHUNKS_DIR):
        return []
    files = []
    for fn in sorted(os.listdir(CHUNKS_DIR)):
        p = os.path.join(CHUNKS_DIR, fn)
        if os.path.isfile(p) and fn.lower().endswith(COMPRESSIBLE):
            files.append("chunks/" + fn)
    return files


def read_version():
    try:
        with open(os.path.join(PROJ, "version.json"), "r", encoding="utf-8") as f:
            return json.load(f).get("version", 0)
    except Exception:
        return 0


def build_manifest():
    files = list_chunk_files()
    return {
        "version": read_version(),
        "count": len(files),
        "generated": datetime.date.today().isoformat(),
        "files": files,
    }


def main():
    check_only = "--check" in sys.argv
    m = build_manifest()
    if check_only:
        if not os.path.exists(MANIFEST):
            print("chunks.json 不存在")
            return 1
        with open(MANIFEST, "r", encoding="utf-8") as f:
            old = json.load(f)
        ok = old.get("files") == m["files"] and old.get("version") == m["version"]
        print("一致" if ok else "不一致（需要重跑 gen_chunk_manifest.py）")
        return 0 if ok else 1
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(m, f, ensure_ascii=False, indent=1)
    print("chunks.json 已生成: %d 个分片, 版本 v%d" % (m["count"], m["version"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
