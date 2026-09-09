#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
v29 工具11：内容创作辅助面板（开发者模式）
功能：
1. 生成一个独立的开发者面板HTML文件
2. 可以注入到game.html中，按F12或输入密码激活
3. 功能：节点跳转、属性修改、标记管理、时间控制、节点信息
用法：
  python tools/dev_panel.py              # 生成开发者面板
  python tools/dev_panel.py --inject     # 注入到game.html
  python tools/dev_panel.py --remove     # 从game.html移除
"""
import os, re, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Color:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    CYAN = '\033[96m'
    BOLD = '\033[1m'
    END = '\033[0m'

def cprint(text, color=''):
    print(color + text + Color.END)

DEV_PANEL_HTML = '''
<!-- v29 开发者面板 -->
<div id="devPanel" style="display:none;position:fixed;top:0;right:0;width:400px;height:100vh;background:rgba(10,18,32,.98);border-left:1px solid #c9a15a;z-index:9999;overflow-y:auto;padding:16px;font-family:'Microsoft YaHei',sans-serif;color:#d7e0ea;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid #243a5a;">
    <h3 style="margin:0;color:#e8cf9a;font-size:16px;">🛠 开发者面板 v29</h3>
    <button onclick="document.getElementById('devPanel').style.display='none'" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:4px 10px;border-radius:4px;cursor:pointer;">✕</button>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:4px;">节点跳转</label>
    <div style="display:flex;gap:6px;">
      <input id="devNodeInput" type="text" placeholder="输入节点ID..." style="flex:1;padding:6px 8px;background:#152642;border:1px solid #243a5a;color:#d7e0ea;border-radius:4px;font-size:12px;">
      <button onclick="devJumpNode()" style="background:#2a4a7a;border:1px solid #c9a15a;color:#e8cf9a;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;">跳转</button>
    </div>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:4px;">当前节点</label>
    <div id="devCurrentNode" style="background:#152642;border:1px solid #243a5a;border-radius:4px;padding:8px;font-size:12px;word-break:break-all;">-</div>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:6px;">属性修改</label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <button onclick="devModAttr('gold',100)" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">+100金币</button>
      <button onclick="devModAttr('hp',50)" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">+50生命</button>
      <button onclick="devModAttr('san',20)" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">+20理智</button>
      <button onclick="devModAttr('xp',100)" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">+100经验</button>
    </div>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:6px;">快速跳转</label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <button onclick="devJump('title_screen')" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">标题画面</button>
      <button onclick="devJump('fc_jiaohui_entry')" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">学院枢纽</button>
      <button onclick="devJump('academy_quick_jump')" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">学院选择</button>
      <button onclick="devJump('seal1_intro')" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">第一印</button>
    </div>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:6px;">标记管理</label>
    <button onclick="devShowFlags()" style="width:100%;background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;margin-bottom:6px;">显示所有标记</button>
    <div id="devFlags" style="background:#0d1830;border:1px solid #243a5a;border-radius:4px;padding:8px;font-size:11px;max-height:150px;overflow-y:auto;display:none;"></div>
  </div>
  
  <div style="margin-bottom:16px;">
    <label style="display:block;font-size:12px;color:#8fa3b8;margin-bottom:6px;">存档管理</label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
      <button onclick="devSaveGame()" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">快速存档</button>
      <button onclick="devLoadGame()" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">快速读档</button>
      <button onclick="devResetGame()" style="background:#3a1a1a;border:1px solid #7a3a3a;color:#d98a8a;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">重置游戏</button>
      <button onclick="devExportSave()" style="background:#1a2540;border:1px solid #3b6ea5;color:#c8d6e8;padding:6px;border-radius:4px;cursor:pointer;font-size:11px;">导出存档</button>
    </div>
  </div>
  
  <div style="margin-top:20px;padding-top:12px;border-top:1px solid #243a5a;font-size:11px;color:#5a6a7a;">
    <div>按 <b style="color:#c9a15a;">F12</b> 或输入 <b style="color:#c9a15a;">devmode</b> 切换面板</div>
    <div style="margin-top:4px;">v29 高效开发工具链</div>
  </div>
</div>

<script>
// v29 开发者面板功能
function devJump(nodeId) {
  if (typeof N !== 'undefined' && N[nodeId]) {
    curNode = nodeId;
    document.getElementById('story').innerHTML = '';
    writeNext();
    devUpdateCurrent();
  } else {
    alert('节点不存在: ' + nodeId);
  }
}
function devJumpNode() {
  var id = document.getElementById('devNodeInput').value.trim();
  if (id) devJump(id);
}
function devUpdateCurrent() {
  document.getElementById('devCurrentNode').textContent = curNode || '-';
}
function devModAttr(attr, val) {
  if (typeof S !== 'undefined') {
    S[attr] = (S[attr] || 0) + val;
    alert(attr + ' += ' + val + '，当前: ' + S[attr]);
  }
}
function devShowFlags() {
  var div = document.getElementById('devFlags');
  if (div.style.display === 'none') {
    div.style.display = 'block';
    var flags = [];
    if (typeof S !== 'undefined' && S.flags) {
      for (var k in S.flags) {
        if (S.flags[k]) flags.push(k + ': ' + S.flags[k]);
      }
    }
    div.innerHTML = flags.length ? flags.join('<br>') : '（无标记）';
  } else {
    div.style.display = 'none';
  }
}
function devSaveGame() {
  if (typeof saveGame === 'function') { saveGame(); alert('已快速存档'); }
  else alert('saveGame函数不存在');
}
function devLoadGame() {
  if (typeof loadGame === 'function') { loadGame(); alert('已快速读档'); }
  else alert('loadGame函数不存在');
}
function devResetGame() {
  if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
    localStorage.removeItem('elda-qunxiong-v3');
    location.reload();
  }
}
function devExportSave() {
  var save = localStorage.getItem('elda-qunxiong-v3');
  if (save) {
    var blob = new Blob([save], {type:'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'elda_save_' + Date.now() + '.json';
    a.click();
  } else alert('无存档');
}
// 快捷键
document.addEventListener('keydown', function(e) {
  if (e.key === 'F12') {
    e.preventDefault();
    var panel = document.getElementById('devPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    if (panel.style.display === 'block') devUpdateCurrent();
  }
});
// 输入密码激活
var devPassword = '';
document.addEventListener('keypress', function(e) {
  devPassword += e.key;
  if (devPassword.length > 10) devPassword = devPassword.slice(-10);
  if (devPassword.indexOf('devmode') >= 0) {
    document.getElementById('devPanel').style.display = 'block';
    devUpdateCurrent();
    devPassword = '';
  }
});
</script>
'''

def generate_panel(output_path=None):
    cprint("=" * 60, Color.BOLD)
    cprint("v29 内容创作辅助面板（开发者模式）", Color.CYAN + Color.BOLD)
    cprint("=" * 60, Color.BOLD)
    
    if output_path is None:
        output_path = os.path.join(HERE, 'tools', 'dev_panel.html')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<title>开发者面板</title>\n</head>\n<body>\n')
        f.write(DEV_PANEL_HTML)
        f.write('\n</body>\n</html>\n')
    
    cprint(f"\n✓ 开发者面板已生成: {output_path}", Color.GREEN)
    cprint(f"  文件大小: {os.path.getsize(output_path):,} 字节", Color.GREEN)
    return output_path

def inject_to_game():
    cprint("\n注入开发者面板到 game.html...", Color.CYAN)
    
    game_path = os.path.join(HERE, 'game.html')
    if not os.path.exists(game_path):
        cprint("✗ game.html 不存在", Color.RED)
        return False
    
    # 备份
    backup_path = game_path + '.backup_devpanel'
    import shutil
    shutil.copy2(game_path, backup_path)
    cprint(f"  ✓ 已备份: {backup_path}", Color.GREEN)
    
    with open(game_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 检查是否已注入
    if 'id="devPanel"' in html:
        cprint("  ⚠ 开发者面板已存在，跳过注入", Color.YELLOW)
        return True
    
    # 在</body>前注入
    html = html.replace('</body>', DEV_PANEL_HTML + '\n</body>')
    
    with open(game_path, 'w', encoding='utf-8') as f:
        f.write(html)
    
    cprint(f"  ✓ 已注入到 game.html ({os.path.getsize(game_path):,} 字节)", Color.GREEN)
    cprint(f"\n  激活方式：按 F12 或在游戏中输入 devmode", Color.CYAN)
    return True

def remove_from_game():
    cprint("\n从 game.html 移除开发者面板...", Color.CYAN)
    
    game_path = os.path.join(HERE, 'game.html')
    backup_path = game_path + '.backup_devpanel'
    
    if os.path.exists(backup_path):
        import shutil
        shutil.copy2(backup_path, game_path)
        cprint("  ✓ 已从备份恢复", Color.GREEN)
        return True
    else:
        cprint("  ⚠ 未找到备份文件，请重新构建 game.html", Color.YELLOW)
        return False

def main():
    if '--inject' in sys.argv:
        inject_to_game()
    elif '--remove' in sys.argv:
        remove_from_game()
    else:
        generate_panel()
        cprint(f"\n使用方法：", Color.BOLD)
        cprint(f"  python tools/dev_panel.py --inject   # 注入到game.html", Color.CYAN)
        cprint(f"  python tools/dev_panel.py --remove   # 从game.html移除", Color.CYAN)

if __name__ == '__main__':
    main()
