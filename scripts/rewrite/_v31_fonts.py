#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v31 字体与排版系统CSS"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

font_css = '''
/* ============ v31 字体与排版系统 ============ */

/* 引入Google Fonts（衬线标题+无衬线正文） */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root{
  --font-title: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  --font-body: 'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', sans-serif;
  --font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 全局字体 */
body{
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 标题用衬线字体 */
h1, h2, h3, h4, h5, h6{
  font-family: var(--font-title);
  font-weight: 700;
  letter-spacing: 2px;
}

/* 模态框/面板标题用衬线 */
.modal-title, .panel-title, .v31-modal-container > div:first-child{
  font-family: var(--font-title);
}

/* 剧情正文排版 */
#story{
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 2;
  letter-spacing: 0.5px;
  color: var(--text-primary);
}
#story p{
  margin-bottom: 16px;
  text-indent: 2em;
}
#story p.noind{
  text-indent: 0;
}
#story p.flagline{
  text-indent: 0;
  text-align: center;
  color: var(--text-gold);
  font-family: var(--font-title);
  font-size: 15px;
  letter-spacing: 3px;
  margin: 20px 0;
  padding: 8px 0;
  border-top: 1px solid rgba(240,214,138,.2);
  border-bottom: 1px solid rgba(240,214,138,.2);
}
#story p.place{
  text-indent: 0;
  text-align: center;
  color: var(--text-gold);
  font-family: var(--font-title);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  margin: 16px 0;
}
#story p.where{
  text-indent: 0;
  color: var(--text-secondary);
  font-style: italic;
  font-size: 14px;
  margin-bottom: 12px;
}

/* NPC对话用衬线斜体+金色左边框 */
#story .npc-dialog, #story p.dialog{
  font-family: var(--font-title);
  font-size: 17px;
  font-style: italic;
  color: var(--text-gold);
  border-left: 3px solid var(--text-gold);
  padding: 10px 16px;
  margin: 16px 0;
  background: linear-gradient(90deg, rgba(240,214,138,.06), transparent);
  text-indent: 0;
  line-height: 1.9;
}

/* 结果/得失文本 */
#story p.res{
  text-indent: 0;
  color: var(--success);
  font-size: 14px;
  padding: 6px 12px;
  background: rgba(127,214,143,.06);
  border-radius: 4px;
  margin: 8px 0;
}
#story p.warn{
  text-indent: 0;
  color: var(--warning);
  font-size: 14px;
  padding: 6px 12px;
  background: rgba(255,200,112,.06);
  border-radius: 4px;
  margin: 8px 0;
}
#story p.hint{
  text-indent: 0;
  color: var(--info);
  font-size: 14px;
  padding: 6px 12px;
  background: rgba(122,184,255,.06);
  border-radius: 4px;
  margin: 8px 0;
}

/* 判定结果横幅 */
.roll-result{
  font-family: var(--font-title);
  font-weight: 700;
  letter-spacing: 2px;
}

/* 按钮文字 */
.btn, .btn-primary, .btn-secondary, .btn-back, .choice-btn, .top-btn{
  font-family: var(--font-body);
}

/* 模态框标题 */
.v31-modal-container > div > div:first-child{
  font-family: var(--font-title);
}

/* 属性面板标题 */
#stats .stat-title, .stat-label{
  font-family: var(--font-body);
  font-weight: 500;
}

/* 顶部状态栏 */
#topbar{
  font-family: var(--font-body);
}
#topbar .game-title{
  font-family: var(--font-title);
  font-weight: 700;
  letter-spacing: 3px;
}
'''

# 在</style>前插入
html = html.replace('</style>', font_css + '\n</style>')

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("v31 字体与排版系统CSS添加完成")
print(f"文件大小: {len(html)} 字符")
