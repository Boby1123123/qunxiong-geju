#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v32 多主题切换系统"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 在</style>前添加4套主题CSS
themes_css = '''
/* ============ v32 多主题系统 ============ */

/* 主题2：经典深蓝（原配色） */
body.theme-classic{
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
  background:
    radial-gradient(ellipse at 20% 20%, rgba(122,184,255,.06) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 80%, rgba(200,154,255,.04) 0%, transparent 45%),
    linear-gradient(180deg, #0a1220 0%, #080e1a 50%, #060a14 100%);
}

/* 主题3：深蓝紫（JRPG风） */
body.theme-purple{
  --bg-deep:#0a0a1e;
  --bg-panel:#141432;
  --bg-panel2:#1e1e45;
  --bg-input:#282858;
  --border:#3d3d66;
  --border-light:#5a5a80;
  --text-primary:#e0e0f0;
  --text-secondary:#b0b0d0;
  --text-muted:#8a8ab0;
  --text-gold:#d4af37;
  --text-gold2:#e8c468;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(168,127,196,.08) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 80%, rgba(106,149,196,.06) 0%, transparent 45%),
    linear-gradient(180deg, #0e0e28 0%, #0a0a1e 50%, #060614 100%);
}

/* 主题4：羊皮纸（暗黑奇幻） */
body.theme-parchment{
  --bg-deep:#1a1612;
  --bg-panel:#252018;
  --bg-panel2:#302a20;
  --bg-input:#3b3428;
  --border:#4a4030;
  --border-light:#6a5a40;
  --text-primary:#e8dcc8;
  --text-secondary:#b8a890;
  --text-muted:#8a7a60;
  --text-gold:#c9a227;
  --text-gold2:#d4af37;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(201,162,39,.08) 0%, transparent 45%),
    radial-gradient(ellipse at 80% 80%, rgba(139,90,43,.06) 0%, transparent 45%),
    linear-gradient(180deg, #1e1a14 0%, #1a1612 50%, #14100c 100%);
}

/* 主题切换按钮 */
.theme-btn{
  padding:6px 12px;
  margin:2px;
  border:1px solid var(--border);
  border-radius:6px;
  background:var(--bg-input);
  color:var(--text-secondary);
  cursor:pointer;
  font-size:12px;
  transition:all .15s;
}
.theme-btn:hover{
  border-color:var(--text-gold);
  color:var(--text-gold);
}
.theme-btn.active{
  background:var(--text-gold);
  color:#1a1208;
  border-color:var(--text-gold);
  font-weight:600;
}
'''

html = html.replace('</style>', themes_css + '\n</style>')
print("✓ 4套主题CSS添加完成")

# 2. 在</body>前添加主题切换JS
theme_js = '''
<script>
/* v32 多主题切换系统 */
(function(){
  const themes = ['warm', 'classic', 'purple', 'parchment'];
  const themeNames = {warm:'温暖棕褐', classic:'经典深蓝', purple:'深蓝紫', parchment:'羊皮纸'};
  
  function setTheme(theme){
    if(!themes.includes(theme)) theme = 'warm';
    document.body.className = document.body.className.replace(/theme-\\w+/g, '').trim();
    if(theme !== 'warm'){
      document.body.classList.add('theme-' + theme);
    }
    try{ localStorage.setItem('elda-theme', theme); }catch(e){}
    // 更新主题按钮状态
    document.querySelectorAll('.theme-btn').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }
  
  function getTheme(){
    try{ return localStorage.getItem('elda-theme') || 'warm'; }catch(e){ return 'warm'; }
  }
  
  // 初始化主题
  document.addEventListener('DOMContentLoaded', function(){
    setTheme(getTheme());
  });
  
  // 暴露全局函数
  window.setTheme = setTheme;
  window.getTheme = getTheme;
  window.themes = themes;
  window.themeNames = themeNames;
})();
</script>
'''

html = html.replace('</body>', theme_js + '\n</body>')
print("✓ 主题切换JS添加完成")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n完成！文件大小: {len(html)} 字符")
