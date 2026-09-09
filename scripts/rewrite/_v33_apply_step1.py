#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v33 应用方案D配色 + 思源黑体Black + 清理多余配色"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# ========== 1. 替换:root色板为方案D ==========
old_root = """:root{
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

new_root = """:root{
  /* v33 方案D - 微暗羊皮纸配色（西幻文学风） */
  /* 背景elevation系统 - 越靠上越亮 */
  --bg-deep:#d4c8a8;           /* 页面背景 - 微暗羊皮纸 */
  --bg-panel:#e0d4b8;          /* 面板 - 比背景亮 */
  --bg-panel2:#e8dcc0;         /* 面板内嵌套 */
  --bg-input:#ede4cc;          /* 按钮/输入 - 最亮 */
  --border:#b0a080;            /* 边框 - 暖棕 */
  --border-light:#c0b090;      /* 高亮边框 */
  /* 文字 - 深棕系（深色文字在浅色背景上护眼） */
  --text-primary:#241a08;      /* 主文字 - 深棕 */
  --text-secondary:#3a2e10;    /* 次级文字 - 中棕 */
  --text-muted:#5a4a30;        /* 辅助文字 - 浅棕 */
  /* 金色 - 深金，在浅色背景上清晰 */
  --text-gold:#7a5a10;         /* 深金（主） */
  --text-gold2:#8a6a20;        /* 亮金（hover） */
  --gold-dark:#5a4a08;         /* 暗金（active） */
  /* 对调色 - 苔藓绿 */
  --teal:#3a5a3a;              /* 苔藓绿 */
  --teal-light:#4a7a4a;        /* 亮绿 */
  --teal-bg:rgba(58,90,58,.1);
  /* 语义色 - 深色版（在浅色背景上） */
  --success:#2a5a2a;           /* 深绿 */
  --success-bg:rgba(42,90,42,.12);
  --warning:#7a5a10;           /* 深金 */
  --warning-bg:rgba(122,90,16,.12);
  --danger:#7a2a1a;            /* 深红 */
  --danger-bg:rgba(122,42,26,.12);
  --info:#2a4a6a;              /* 深蓝 */
  --info-bg:rgba(42,74,106,.12);
  --purple:#4a2a6a;            /* 深紫 */
  --purple-bg:rgba(74,42,106,.12);
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
    print("✓ :root色板替换为方案D")
else:
    print("✗ 未找到旧的:root，尝试模糊匹配...")
    start = html.find(':root{')
    if start >= 0:
        end = html.find('}', start)
        if end > 0:
            html = html[:start] + new_root + html[end+1:]
            print("✓ 模糊匹配替换成功")

# ========== 2. 修改body背景和字体 ==========
old_body = """body{
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

new_body = """body{
  background:
    radial-gradient(ellipse at 20% 10%, rgba(180,150,80,.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 90%, rgba(100,130,90,.08) 0%, transparent 50%),
    linear-gradient(180deg, #e0d4b8 0%, #d4c8a8 50%, #c8bca0 100%);
  color:var(--text);
  font-family:"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif;
  font-size:16px; overflow:hidden;
  position:relative;
  font-weight:500;
}
body::before{
  content:'';
  position:fixed; inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
  opacity:.025;
  pointer-events:none;
  z-index:0;
}"""

if old_body in html:
    html = html.replace(old_body, new_body)
    print("✓ body背景和字体替换完成")
else:
    print("✗ 未找到旧的body样式")

# ========== 3. 在head中添加Google Fonts ==========
old_head = '<title>艾尔达大陆 · 群雄割据</title>'
new_head = '<title>艾尔达大陆 · 群雄割据</title>\n<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@700;900&display=swap" rel="stylesheet">'

if old_head in html:
    html = html.replace(old_head, new_head, 1)
    print("✓ Google Fonts添加完成")

# ========== 4. 修改#topbar ==========
old_topbar = '#topbar{display:flex;align-items:center;gap:10px;padding:8px 14px;background:linear-gradient(180deg,rgba(30,24,18,.95),rgba(20,16,12,.9));border-bottom:1px solid rgba(201,162,39,.2);flex-wrap:wrap;backdrop-filter:blur(10px);position:relative;z-index:10}'
new_topbar = '#topbar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:linear-gradient(180deg,rgba(200,184,144,.95),rgba(184,168,128,.9));border-bottom:1px solid #a09070;flex-wrap:wrap;backdrop-filter:blur(10px);position:relative;z-index:10;box-shadow:0 2px 12px rgba(0,0,0,.1)}'

if old_topbar in html:
    html = html.replace(old_topbar, new_topbar)
    print("✓ #topbar替换完成")
else:
    print("✗ 未找到旧的#topbar")

# ========== 5. 修改标题字体 ==========
old_title = '#topbar .title{font-family:Georgia,"Songti SC","SimSun",serif;color:var(--gold2);font-size:19px;letter-spacing:3px;font-weight:700}'
new_title = '#topbar .title{font-family:"Noto Serif SC",Georgia,"Songti SC","SimSun",serif;color:var(--gold2);font-size:20px;letter-spacing:3px;font-weight:900;text-shadow:0 1px 0 rgba(255,255,255,.3)}'

if old_title in html:
    html = html.replace(old_title, new_title)
    print("✓ 标题字体替换完成")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n第一步完成！文件大小: {len(html)} 字符")
