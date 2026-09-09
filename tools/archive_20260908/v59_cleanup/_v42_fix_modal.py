# -*- coding: utf-8 -*-
"""v42 修复：modal 面板统一改用 openModal()（closeModal 会清空 #modal，querySelector('.box') 失效）"""
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

html = open('game.html', encoding='utf-8').read()
orig = len(html)

def rep(old, new, tag):
    global html
    if old not in html:
        print('[FAIL] 未找到：' + tag); sys.exit(1)
    if html.count(old) != 1:
        print('[WARN] %s 出现 %d 次' % (tag, html.count(old)))
    html = html.replace(old, new, 1)
    print('[OK] ' + tag)

# 1. v34_openSavePanel
rep('''function v34_openSavePanel(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderSaveSlots();
  modal.classList.add('show');
}''',
'''function v34_openSavePanel(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSaveSlots();
  openModal(box);
}''', 'v34_openSavePanel → openModal')

# 2. v34_openSettings
rep('''function v34_openSettings(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  box.innerHTML = v34_renderSettings();
  modal.classList.add('show');
}''',
'''function v34_openSettings(){
  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = v34_renderSettings();
  openModal(box);
}''', 'v34_openSettings → openModal')

# 3. v34_openErrorLog（v42 新增）
rep('''function v34_openErrorLog(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  var logs = ErrorLog.text();''',
'''function v34_openErrorLog(){
  var logs = ErrorLog.text();''', 'v34_openErrorLog 去掉modal依赖')

rep('''  box.innerHTML = html;
  modal.classList.add('show');
}

function v42_copyErrorLog(){''',
'''  var box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = html;
  openModal(box);
}

function v42_copyErrorLog(){''', 'v34_openErrorLog 结尾 → openModal')

# 4. DebugPanel.openPanel
rep('''  function openPanel(){
    open = true;
    const modal = document.getElementById('modal');
    if(!modal) return;
    const box = modal.querySelector('.box');
    if(!box) return;
    box.innerHTML = build();
    modal.classList.add('show');
  }''',
'''  function openPanel(){
    open = true;
    const box = document.createElement("div");
    box.className = "box";
    box.innerHTML = build();
    openModal(box);
  }''', 'DebugPanel.openPanel → openModal')

io.open('game.html', 'w', encoding='utf-8', newline='\n').write(html)
print('写回：%d → %d' % (orig, len(html)))
