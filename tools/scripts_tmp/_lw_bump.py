# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
fn = "docs/版本发布记录.md"
t = open(fn, encoding="utf-8").read()
entry = """## v96（2026-09-13）

- 说明：LW-A1B1B2B3 战争引擎与检查器全落地（方向二 A/B 两分支首批）

本版落地的最近批次：
- LW-B3 战争事件入池：8 事件（天灾/人祸/奇遇/商机）战区城市加权抽取，we_<id>_<day> 去重，战报+编年史+journal 三联 —— LW_下一步超大型拓展_回响检查器_战争引擎_编年史_20260913.md
- LW-B2 城市易主动态化：cityControl 优先覆盖静态 cityOwn，10 处城市场景 [[if:world.city]] 双版本标注（铁门关/圣城/学院/沙漠易主叙事）—— LW_下一步超大型拓展_回响检查器_战争引擎_编年史_20260913.md
- LW-B1 战争引擎地基：warfronts×5（铁门关/银穗/封印/狼旗/净化令）+ LW_warShift/LW_conquer 易主（cityControl 写入+战报+商品价×1.25/×0.8+回响唤醒）/ LW_warTick 每日漂移 / LW_warUI 战场总览 —— LW_下一步超大型拓展_回响检查器_战争引擎_编年史_20260913.md
- LW-A1 回响检查器四件套：c_echo/c_worldstate/c_faction/c_warfront（检查器总数 41→45）+ 功罪双轨 merit/guilt clamp[0,1000]（势力界面绿功红罪）—— LW_下一步超大型拓展_回响检查器_战争引擎_编年史_20260913.md

门禁口径：elda ci 45 检查器全绿（含 4 个新 LW 检查器）+ smoke PASS + 四路字节一致（game=19088864B / chunked=8021074B）+ 全量回归 UPG-11 static 死链=0 + 浏览器实测（建号→引擎运行时 5 战场/易主/功罪/事件/UI 全过）+ 预算合法更新（19,088,734 → 19,088,868B）。

## v95（2026-09-12）"""
assert "## v95（2026-09-12）" in t
t = t.replace("## v95（2026-09-12）", entry, 1)
open(fn, "w", encoding="utf-8", newline="").write(t)
print("v96 entry inserted")
