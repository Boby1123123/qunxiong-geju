# ci_guard 门禁报告

- 时间: 2026-09-13 23:14:02
- 模式: quick
- 结论: **PASS**

## 结果

```json
{
  "ts": "2026-09-13 23:14:02",
  "mode": "quick",
  "results": {
    "node_check": {
      "status": "PASS",
      "checked": 28,
      "ok": 28,
      "errors": []
    },
    "elda_ci": {
      "status": "PASS",
      "returncode": 0,
      "tail": "      [PASS] 持久化 覆盖=13 — 全部通过\n  ✓ 九域地图\n      [PASS] 地图可视化 覆盖=10 — 全部通过\n  ✓ V66风格锁\n      [PASS] V66风格锁 防回潮 — 全部通过\n  ✓ 事件全局钩子\n      [PASS] 全局钩子 表/condition/去重/数值/引擎 — 全部通过\n  ✓ 编年史系统\n      [PASS] 编年史 规则/API/钩子/兜底/面板 — 全部通过\n  ✓ 西幻体系深化\n      [PASS] 西幻体系 种族/法术/职业事件/阵营/引擎 — 全部通过\n  ✓ 节点物理分区\n      [PASS] 节点分区 九域注册表/命名规范/覆盖率 — 覆盖率 97.41%（5537/5684）\n  ✓ CRLF行尾门\n      [PASS] CRLF行尾门（5 发布文件） — 全部 LF（game.html=0 / game_check.html=0 / game_built.html=0 / game_chunked.html=0 / index.html=0）\n  ✓ 节点覆盖门\n      [PASS] 节点覆盖（单文件=6088 / 分片=6088） — 覆盖一致（差 0）\n  ✓ LW回响健康\n      [PASS] 回响锚点 30 条·悬空 0·队列上限 有 — 全部通过\n  ✓ LW世界状态\n      [PASS] S.lw 白名单·写点 16·未知 0 — 全部通过\n  ✓ LW势力矩阵\n      [PASS] 势力 9 家·基线漂移 0·非法状态 0 — 全部通过\n  ✓ LW战争引擎\n      [PASS] 战场 5 条·表合法 是·红线 守 — 全部通过\n  ✓ LW世界编年史\n      [PASS] 世界编年史·规则6条·触发6类·上限有·隔离OK — 全部通过\n  ✓ 性能计时\n      [PASS] 总耗时 17.04s（46 个检查器） — 总耗时 17.04s；因果/伏笔账本 5.22s；结构健康 3.45s；引用健康 2.72s；marker台账 1.62s；分片健康 0.66s\n      [PASS] 超阈值慢检查器=0（>10s） — 无\n      [PASS] 性能预算门（budget.json 6 项） — [PASS] game.html=20490471B ≤ 上限 32000000B；[PASS] game.html=20490471B ≤ baseline 20490471B（合法增长请更新 budget.json）；[PASS] game_chunked=9418897B ≤ 上限 15000000B；[PASS] 节点=5992 ≥ 下限 5869（内容零损失红线）；[PASS] 静态 go 死链=0 ≤ 0；[PASS] 总耗…\n────────────────────────────────────────────────────────────\n  全部通过 (17s)\n--------------------------------------------------------------\n  [PASS] src 语法 node --check（28 块）\n  [PASS] 权威源幂等 verify（src→game.html 闭环）\n  [PASS] 四路字节一致（game=20490471B game_check=20490471B / chunked=9418897B index=9418897B）\n  [PASS] elda full 25 检查器\n==============================================================\n  门禁结果：全部通过（可发布）",
      "err_tail": ""
    },
    "smoke": {
      "status": "PASS",
      "returncode": 0,
      "tail": "      anchor_chen_1          无选项（终端/纯文本）\n    [anchor]\n      anchor_tower_1         无选项（终端/纯文本）\n      anchor_mine_1          无选项（终端/纯文本）\n      anchor_grave_1         无选项（终端/纯文本）\n      anchor_vault_1         无选项（终端/纯文本）\n      anchor_finale_1        无选项（终端/纯文本）\n      anchor_finale_5        无选项（终端/纯文本）\n    [goldscale]\n      goldscale_1            无选项（终端/纯文本）\n      goldscale_5            无选项（终端/纯文本）\n      goldscale_10           无选项（终端/纯文本）\n    [faction]\n      warphase_1             推进→ war_deep_01（1 选项）\n      warphase_7             无选项（终端/纯文本）\n      faction_free_1         无选项（终端/纯文本）\n      faction_north_1        无选项（终端/纯文本）\n    [events]\n      fc_tavern              推进→ combo_hunt_01（4 选项）\n      world_f6_battle        无选项（终端/纯文本）\n  运行时推进       : 30 步，到达 ['fc_tavern', 'fc_tavern', 'fc_tavern']\n  面板开合         : 5 面板\n  存/读档          : 通过\n  结局触发         : 通过\nRESULT: PASS（节点完整性 + 状态机推进；结局可达性以入边 66 条 + 浏览器实测为准）",
      "err_tail": ""
    },
    "byte_quad": {
      "status": "PASS",
      "rows": [
        {
          "a": "game.html",
          "b": "game_check.html",
          "a_bytes": 20490471,
          "b_bytes": 20490471,
          "match": true
        },
        {
          "a": "game_chunked.html",
          "b": "index.html",
          "a_bytes": 9418897,
          "b_bytes": 9418897,
          "match": true
        }
      ]
    },
    "volume": {
      "status": "PASS",
      "returncode": 0,
      "data": {
        "status": "PASS",
        "game_bytes": 20490471,
        "chunked_bytes": 9418897,
        "avg5": 19563041,
        "growth_pct": 4.7,
        "cap": 32000000,
        "warns": [],
        "samples": 284
      }
    },
    "git_status": {
      "status": "DIRTY",
      "changed": 14,
      "sample": [
        " M budget.json",
        " D chunks/story_travel.154b8ec1.js",
        " M game.html",
        " M game_built.html",
        " M game_check.html",
        " M game_chunked.html",
        " M index.html",
        " M src/data_nodes/dn_causality.js"
      ]
    }
  },
  "overall": "PASS"
}
```
