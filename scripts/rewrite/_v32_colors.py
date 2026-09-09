#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v32 CSS变量色板重构 - 温暖棕褐配色（Disco Elysium风）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 替换:root变量块
old_root = """:root{
  /* v30 高对比度色板 */
  --bg-deep:#080e1a;
  --bg-panel:#0f1a2e;
  --bg-panel2:#152238;
  --bg-input:#1a2a44;
  --border:#2d4566;
  --border-light:#3d5a80;
  --text-primary:#e8eef5;
  --text-secondary:#b8c5d6;
  --text-muted:#97a8bd;
  --text-gold:#f0d68a;
  --text-gold2:#e8c468;
  --success:#7fd68f;
  --success-bg:rgba(127,214,143,.12);
  --warning:#ffc870;
  --warning-bg:rgba(255,200,112,.12);
  --danger:#ff8a8a;
  --danger-bg:rgba(255,138,138,.12);
  --info:#7ab8ff;
  --info-bg:rgba(122,184,255,.12);
  --purple:#c89aff;
  --purple-bg:rgba(200,154,255,.12);
  /* 兼容旧变量名（映射到新高对比度色板） */
  --bg:var(--bg-deep);
  --panel:var(--bg-panel);
  --panel2:var(--bg-panel2);
  --line:var(--border);
  --gold:var(--text-gold2);
  --gold2:var(--text-gold);
  --cyan:var(--info);
  --text:var(--text-primary);
  --dim:var(--text-muted);
  --ok:var(--success);
  --bad:var(--danger);
  --warn:var(--warning);
}"""

new_root = """:root{
  /* v32 温暖棕褐色板（Disco Elysium风） */
  /* 背景elevation系统 - 越靠上越亮 */
  --bg-deep:#14100c;           /* 页面最暗 - 温暖深棕褐 */
  --bg-panel:#1e1812;          /* 面板 - 比背景亮 */
  --bg-panel2:#282018;         /* 面板内嵌套 */
  --bg-input:#2e251c;          /* 按钮/输入 - 最亮 */
  --border:#3d3225;            /* 边框 - 暖棕 */
  --border-light:#5a4a35;      /* 高亮边框 */
  /* 文字 - 暖白系，不用纯白 */
  --text-primary:#e0d8c8;      /* 主文字 - 暖白 */
  --text-secondary:#b0a898;    /* 次级文字 - 暖灰 */
  --text-muted:#8a8275;        /* 辅助文字 - 暗暖灰 */
  /* 金色 - 古铜金，不刺眼 */
  --text-gold:#c9a227;         /* 古铜金（主） */
  --text-gold2:#d4af37;        /* 亮金（hover） */
  --gold-dark:#a8861f;         /* 暗金（active） */
  /* 对调色 - 去饱和青（Disco Elysium冷暖对调） */
  --teal:#5a8a8a;              /* 去饱和青 */
  --teal-light:#7aaaaa;        /* 亮青 */
  --teal-bg:rgba(90,138,138,.1);
  /* 语义色 - 全部降低饱和度 */
  --success:#6bbf7a;           /* 柔和绿 */
  --success-bg:rgba(107,191,122,.12);
  --warning:#d4a855;           /* 琥珀黄 */
  --warning-bg:rgba(212,168,85,.12);
  --danger:#c96565;            /* 暗红 */
  --danger-bg:rgba(201,101,101,.12);
  --info:#6a95c4;              /* 灰蓝 */
  --info-bg:rgba(106,149,196,.12);
  --purple:#a87fc4;            /* 灰紫 */
  --purple-bg:rgba(168,127,196,.12);
  /* 兼容旧变量名 */
  --bg:var(--bg-deep);
  --panel:var(--bg-panel);
  --panel2:var(--bg-panel2);
  --line:var(--border);
  --gold:var(--text-gold2);
  --gold2:var(--text-gold);
  --cyan:var(--teal);
  --text:var(--text-primary);
  --dim:var(--text-muted);
  --ok:var(--success);
  --bad:var(--danger);
  --warn:var(--warning);
}"""

if old_root in html:
    html = html.replace(old_root, new_root)
    print("✓ :root色板重构完成（温暖棕褐配色）")
else:
    print("✗ 未找到旧的:root块，尝试模糊匹配...")
    # 找到:root{到第一个}
    start = html.find(':root{')
    if start >= 0:
        end = html.find('}', start)
        if end > 0:
            old_block = html[start:end+1]
            html = html[:start] + new_root + html[end+1:]
            print(f"✓ 模糊匹配替换成功（{len(old_block)}字符）")

# 2. 修改body背景为多层渐变+噪点纹理
old_body = """body{
  background:radial-gradient(1200px 800px at 70% -10%,#14233d 0%,var(--bg) 55%);
  color:var(--text); font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
  font-size:15px; overflow:hidden;
}"""

new_body = """body{
  background:
    radial-gradient(ellipse at 20% 20%, rgba(201,162,39,.07) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 80%, rgba(90,138,138,.05) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 100%, rgba(201,101,101,.03) 0%, transparent 50%),
    linear-gradient(180deg, #18130e 0%, #14100c 50%, #0f0c08 100%);
  color:var(--text); font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
  font-size:15px; overflow:hidden;
  position:relative;
}
body::before{
  content:'';
  position:fixed; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity:.035;
  pointer-events:none;
  z-index:0;
}"""

if old_body in html:
    html = html.replace(old_body, new_body)
    print("✓ body背景重构完成（多层渐变+噪点纹理）")
else:
    print("✗ 未找到旧的body样式")

# 3. 修改#topbar背景
old_topbar = '#topbar{display:flex;align-items:center;gap:10px;padding:8px 14px;background:linear-gradient(180deg,#0f1c30,#0c1728);border-bottom:1px solid var(--line);flex-wrap:wrap}'
new_topbar = '#topbar{display:flex;align-items:center;gap:10px;padding:8px 14px;background:linear-gradient(180deg,rgba(30,24,18,.95),rgba(20,16,12,.9));border-bottom:1px solid rgba(201,162,39,.2);flex-wrap:wrap;backdrop-filter:blur(10px);position:relative;z-index:10}'

if old_topbar in html:
    html = html.replace(old_topbar, new_topbar)
    print("✓ #topbar背景重构完成")
else:
    print("✗ 未找到旧的#topbar样式")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n完成！文件大小: {len(html)} 字符")
