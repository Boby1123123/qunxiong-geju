
/* /v67inj:modal/ V67 模态栈单例：统一出口 + 焦点管理 + 弹窗栈 */
(function(){
  try{
    var ui = {
      stack: [],
      openDepth: 0,
      _lastFocus: null,
      open: function(el){
        var m = document.getElementById("modal");
        if(!m) return;
        try{ ui._lastFocus = document.activeElement; }catch(e){}
        m.innerHTML = "";
        var container = document.createElement("div");
        container.className = "v31-modal-container";
        try{
          if(el && el.querySelector && !el.querySelector(".panel-footer") && !el.querySelector(".modal-actions")){
            if(!el.style.padding) el.style.padding = "8px 4px 4px";
            var footer = document.createElement("div");
            footer.className = "panel-footer v31-modal-footer";
            footer.innerHTML = "<button class='btn-back' onclick='v67_ui.close()'>返回游戏</button>";
            el.appendChild(footer);
          }
        }catch(e){}
        try{ container.appendChild(el); }catch(e){}
        m.appendChild(container);
        try{ m.setAttribute('role','dialog'); m.setAttribute('aria-modal','true'); m.setAttribute('aria-label','游戏弹窗'); }catch(e){}
        m.classList.add("show");
        ui.stack.push(container);
        ui.openDepth++;
        try{ var f = m.querySelector("button, a, input, select, [tabindex]"); if(f && f.focus) f.focus(); }catch(e){}
        try{ if(window.UI_STATE) UI_STATE.panel = null; }catch(e){}
      },
      close: function(){
        ui.openDepth = Math.max(0, ui.openDepth - 1);
        if(ui.stack.length) ui.stack.pop();
        if(ui.openDepth === 0){
          var m = document.getElementById("modal");
          if(m){ m.classList.remove("show"); m.innerHTML = ""; }
          try{ document.body.classList.remove("modal-open"); }catch(e){}
        }
        try{
          var fb = ui._lastFocus;
          if(fb && document.contains(fb) && fb.focus) fb.focus();
          ui._lastFocus = null;
        }catch(e){}
        try{ if(window.UI_STATE) UI_STATE.panel = null; }catch(e){}
      },
      toggle: function(name){
        try{ if(window.togglePanel) window.togglePanel(name); }catch(e){}
      }
    };
    window.v67_ui = ui;
  }catch(e){ try{ console.error("[v67modal]", e); }catch(_){} }
})();

/* /v74ui:key/ V74 全局快捷键 + 提示条（M/B/T/L 保留，补齐 Q/G/C/F） */
(function(){
  try{
    /* V74：只处理 v68 导航之外的键（z魔法/a成就/s存档）；
       m/b/t/l/q/g/c/f 沿用 v68 既有导航（避免键位语义冲突与双触发） */
    var KEY_MAP = {
      z:function(){ try{ if(window.v35_openMagicPanel) v35_openMagicPanel(); }catch(e){} },
      a:function(){ try{ if(window.v34_openAchievements) v34_openAchievements(); }catch(e){} },
      s:function(){ try{ if(window.v34_openSavePanel) v34_openSavePanel(); }catch(e){} }
    };
    function v74_onKey(e){
      if(e.ctrlKey||e.altKey||e.metaKey) return;
      var t = e.target;
      if(t && (t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable)) return;
      var k = (e.key||'').toLowerCase();
      var fn = KEY_MAP[k];
      if(!fn) return;
      e.preventDefault();
      try{ fn(); }catch(err){ console.error('[v74key]', err); }
    }
    document.addEventListener('keydown', v74_onKey, false);
    window.v74_keyHelp = function(){
      return 'M 地图 · B 行囊 · T 修炼 · L 日志 · F 势力 · Q 任务 · G 强者 · C 编年史 · Z 魔法 · A 成就 · S 存档 · Esc 返回';
    };
    function v74_mountHint(){
      try{
        if(document.getElementById('v74-key-hint')) return;
        var hint = document.createElement('div');
        hint.id = 'v74-key-hint';
        hint.className = 'v74-key-hint';
        hint.title = v74_keyHelp();
        hint.textContent = '\u2328 M地图  B行囊  T修炼  L日志  F势力  Q任务  G强者  C编年史  Z魔法  A成就  S存档';
        var anchor = document.getElementById('v68-announce');
        if(anchor && anchor.parentNode) anchor.parentNode.insertBefore(hint, anchor.nextSibling);
        else document.body.insertBefore(hint, document.body.firstChild);
      }catch(e){}
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', v74_mountHint);
    else v74_mountHint();
  }catch(e){}
})();
