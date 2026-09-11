# -*- coding: utf-8 -*-
import io
cp = r"D:\1pao tuan\群雄割据\src\data_nodes\dn_causality.js"
c = io.open(cp, encoding="utf-8").read()
leds = [
    '\n  {\n    "id": "led_w1_goldstamp",\n    "desc": "承天城金库失窃（金库失窃官银，守夜人投井——金库线索呼应）",\n    "plant": "event:w1_goldstamp",\n    "reap": "flag:anchor_4",\n    "status": "open",\n    "world": "vol_east",\n    "importance": 2,\n    "keywords": ["金库", "承天城", "失窃"],\n    "irreversible": false\n  },',
    '\n  {\n    "id": "led_w2_bell2",\n    "desc": "第三哨铁牌再现（铜钟被敲三下，钟下留铁牌）",\n    "plant": "event:w2_g_bell2",\n    "reap": "flag:anchor_1",\n    "status": "open",\n    "world": "vol_north",\n    "importance": 2,\n    "keywords": ["铁牌", "第三哨", "铜钟"],\n    "irreversible": false\n  },',
    '\n  {\n    "id": "led_w2_finaliron",\n    "desc": "老铁战后打造七枚铁牌（终局伏笔）",\n    "plant": "event:w2_final_iron",\n    "reap": "flag:anchor_7",\n    "status": "open",\n    "world": "vol_north",\n    "importance": 2,\n    "keywords": ["老铁", "铁牌", "终局"],\n    "irreversible": false\n  },',
    '\n  {\n    "id": "led_w1_sealwax",\n    "desc": "圣辉城封蜡印七枚铁牌纹样（教会与七锚暗连）",\n    "plant": "event:w1_sealwax",\n    "reap": "flag:anchor_6",\n    "status": "open",\n    "world": "vol_church",\n    "importance": 2,\n    "keywords": ["圣辉城", "封蜡", "铁牌"],\n    "irreversible": false\n  }'
]
if "led_w1_goldstamp" not in c:
    idx = c.rfind("\n];")
    tail = c[idx:]
    before = c[:idx].rstrip()
    if not before.endswith(","):
        before += ","
    c = before + "".join(leds) + tail
    io.open(cp, "w", encoding="utf-8", newline="").write(c)
    print("ledger +4")
else:
    print("ledger already")
