
/* /v67inj:lock/ V67 选项交互锁定：防重入 + 视觉反馈 + 看门狗 */
(function(){
  try{
    window.__v67Busy = false;
    window.__v67BusyAt = 0;
    function v67_busySet(){
      window.__v67Busy = true;
      window.__v67BusyAt = Date.now();
      v67_showTip();
      /* 每次置锁重置看门狗：5s 未释放强制解锁（防死锁兜底，同时恢复按钮灰化） */
      try{ if(window.v61_timer) window.v61_timer(function(){
        if(window.__v67Busy && window.__v67BusyAt && (Date.now()-window.__v67BusyAt>5000)){
          window.__v67Busy = false;
          v67_unlockUI();
        }
      }, 5000, "v67-lock-watchdog"); }catch(e){}
    }
    function v67_busyClear(){
      window.__v67Busy = false;
      window.__v67BusyAt = 0;
      v67_clearTip();
    }
    /* /v74ui:lock/ 处理中提示 + 按钮恢复（watchdog 兜底） */
    function v67_showTip(){
      try{
        const box = document.getElementById("options");
        if(!box) return;
        if(box.querySelector(".v67-busy-tip")) return;
        const tip = document.createElement("div");
        tip.className = "v67-busy-tip";
        tip.textContent = "⏳ 正在处理…";
        box.insertBefore(tip, box.firstChild);
      }catch(e){}
    }
    function v67_clearTip(){
      try{
        const box = document.getElementById("options");
        if(!box) return;
        const tip = box.querySelector(".v67-busy-tip");
        if(tip) tip.remove();
      }catch(e){}
    }
    function v67_unlockUI(){
      try{
        const box = document.getElementById("options");
        if(box){
          const btns = box.querySelectorAll("button.opt");
          for(var i=0;i<btns.length;i++){
            btns[i].disabled = false;
            btns[i].style.opacity = "";
            btns[i].style.cursor = "";
          }
        }
      }catch(e){}
      v67_clearTip();
    }
    function v67_busyNow(){ return !!window.__v67Busy; }
    /* 选中反馈：灰化其余 + disabled（保留按钮供 writeNext 自然清空） */
    function v67_uiFeedback(opt){
      try{
        var box = document.getElementById("options");
        if(!box) return;
        var t = (opt && opt.t) ? String(opt.t) : "";
        var btns = box.querySelectorAll("button.opt");
        for(var i=0;i<btns.length;i++){
          try{
            btns[i].disabled = true;
            btns[i].style.opacity = "0.4";
            btns[i].style.cursor = "default";
            if(t && btns[i].getAttribute("data-t") === t){
              btns[i].classList.add("opt-chosen");
              btns[i].style.opacity = "1";
              btns[i].style.borderColor = "var(--gold, #d4a017)";
              btns[i].style.boxShadow = "0 0 10px rgba(212,160,23,.5)";
            }
          }catch(e){}
        }
      }catch(e){}
    }
    /* 看门狗：5s 未释放强制解锁（防死锁） */
    if(typeof window.v61_timer === "function"){
      try{ window.v61_timer(function(){
        if(window.__v67Busy && window.__v67BusyAt && (Date.now() - window.__v67BusyAt > 5000)){
          window.__v67Busy = false;
        }
      }, 5000, "v67-lock-watchdog"); }catch(e){}
    }
    window.v67_busySet = v67_busySet;
    window.v67_busyClear = v67_busyClear;
    window.v67_busyNow = v67_busyNow;
    window.v67_uiFeedback = v67_uiFeedback;
    window.v67_showTip = v67_showTip;
    window.v67_clearTip = v67_clearTip;
    window.v67_unlockUI = v67_unlockUI;
  }catch(e){ try{ console.error("[v67lock]", e); }catch(_){} }
})();
