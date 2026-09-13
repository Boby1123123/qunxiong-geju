/* =========================================================================
 * script_20.js · v99 沉浸表现层（方向五：序章→学院表现层贯通）
 * 功能：段落浮现动画 / 梦境沉浸模式 / 章节转场遮罩 / 平滑自动滚动 / 记忆碎片题头
 * 性质：纯表现层。全部钩子 try/catch 只读包裹，不触碰判定公式 / writeNext
 *       核心语义 / choose / 存档结构；saveVersion 不变；仅桌面端。
 * 挂载方式：DOMContentLoaded 自初始化 + MutationObserver 观察 #story。
 * ========================================================================= */
(function () {
  "use strict";
  if (window.V99_UI) return;
  var UI = (window.V99_UI = {});

  var TITLE_MARK = "v99-memory-title";   // 记忆碎片题头
  var CURTAIN = "v99-curtain";           // 章节转场遮罩
  var DREAM = "v99-dream";               // 梦境沉浸模式 body 类
  var PAR = "v99-par";                   // 段落浮现动画类

  /* ---------- CSS 注入（桌面端，不改变既有布局宽度） ---------- */
  function injectCSS() {
    var style = document.createElement("style");
    style.id = "v99-immersive-css";
    style.textContent =
      /* 段落浮现 */
      "#story p.v99-par{animation:v99FadeUp .55s ease-out both}" +
      "@keyframes v99FadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}" +
      /* 记忆碎片题头 */
      ".v99-memory-title{display:block;margin:18px 0 6px;padding:6px 0;border-top:1px solid rgba(190,165,120,.35);border-bottom:1px solid rgba(190,165,120,.35);color:#b6a377;font-size:13px;letter-spacing:.3em;text-align:center}" +
      /* 梦境沉浸模式（仅 .v99-dream 生效） */
      "body.v99-dream #story{background:rgba(8,10,18,.55);box-shadow:inset 0 0 120px rgba(0,0,0,.5);border-radius:6px}" +
      "body.v99-dream #story p{color:#d8d4c8}" +
      "body.v99-dream #story p:first-child{color:#b6a377}" +
      /* 章节转场遮罩 */
      ".v99-curtain{position:fixed;left:0;right:0;top:0;z-index:9999;padding:10px 0;background:linear-gradient(180deg,rgba(6,8,14,.92),rgba(6,8,14,.55));color:#cfc4a8;font-size:15px;letter-spacing:.35em;text-align:center;pointer-events:none;opacity:0;transform:translateY(-100%);transition:opacity .5s ease,transform .5s ease}" +
      ".v99-curtain.on{opacity:1;transform:none}" +
      ".v99-curtain.out{opacity:0;transform:translateY(-100%)}";
    (document.head || document.documentElement).appendChild(style);
  }

  /* ---------- 章节转场遮罩 ---------- */
  function showCurtain(text) {
    var bar = document.getElementById("v99-curtain-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "v99-curtain-bar";
      bar.className = CURTAIN;
      document.body.appendChild(bar);
    }
    bar.textContent = text || "";
    /* 重启动画 */
    bar.classList.remove("on", "out");
    void bar.offsetWidth;
    bar.classList.add("on");
    setTimeout(function () {
      bar.classList.remove("on");
      bar.classList.add("out");
    }, 1400);
  }

  /* ---------- 已选选项清扫：v67 保留 opt-chosen 供 writeNext 自然清空；
     分页（v45）模式下 showOptions 未到前会残留「旧选项 + 继续阅读」两行 →
     表现层隐藏已 disabled 的已选按钮（纯展示，不触碰引擎语义） ---------- */
  function sweepChosen() {
    try {
      var o = document.getElementById("options");
      if (!o) return;
      var c = o.querySelectorAll("button.opt-chosen");
      for (var i = 0; i < c.length; i++) {
        if (c[i].disabled) c[i].style.display = "none";
      }
    } catch (e) { /* 表现层容错 */ }
  }

  /* ---------- 文本追加后的表现处理（观察 #story） ---------- */
  function onStoryChanged(mutations) {
    try {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i];
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType !== 1) continue;
          if (n.tagName === "P") {
            n.classList.add(PAR);
          } else if (n.tagName === "DIV" || n.tagName === "SECTION") {
            var ps = n.querySelectorAll("p");
            for (var k = 0; k < ps.length; k++) ps[k].classList.add(PAR);
          }
        }
      }
      sweepChosen();
    } catch (e) { /* 表现层容错 */ }
  }

  /* ---------- 平滑滚动到底（增强 RenderBatch 的瞬移滚动） ---------- */
  var lastHeight = -1;
  function smoothScrollToBottom() {
    try {
      var story = document.getElementById("story");
      if (!story) return;
      var h = story.scrollHeight;
      if (h === lastHeight) return;
      lastHeight = h;
      var scroller = story;
      while (scroller && scroller.scrollHeight <= scroller.clientHeight && scroller.parentElement) {
        scroller = scroller.parentElement;
      }
      if (scroller && scroller.scrollHeight > scroller.clientHeight) {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      }
    } catch (e) { /* 容错 */ }
  }

  /* ---------- 梦境沉浸模式切换（文本窗口检测，v45_sceneTitle 已负责标题） ---------- */
  function updateDreamMode() {
    try {
      var story = document.getElementById("story");
      if (!story) return;
      var els = story.querySelectorAll("p,div,section,h1,h2,h3,h4");
      if (!els.length) return;
      var tail = "";
      for (var i = Math.max(0, els.length - 4); i < els.length; i++) {
        tail += (els[i].textContent || "") + "\n";
      }
      var isDream = /记忆的渡口|梦境|回忆 \u00b7/.test(tail);
      var body = document.body;
      if (isDream && !body.classList.contains(DREAM)) {
        body.classList.add(DREAM);
      } else if (!isDream && body.classList.contains(DREAM)) {
        body.classList.remove(DREAM);
      }
    } catch (e) { /* 容错 */ }
  }

  /* ---------- 章节转场：S.day 变化时出遮罩 ---------- */
  var lastDay = null;
  function watchDay() {
    try {
      if (typeof window.S === "undefined" || !window.S) return;
      var d = window.S.day;
      if (d === undefined || d === null) return;
      if (lastDay === null) { lastDay = d; return; }
      if (d !== lastDay) {
        var label = "第 " + d + " 天";
        if (window.S.curCity) label += " · " + (typeof window.S.curCity === "string" ? window.S.curCity : "");
        showCurtain(label);
        lastDay = d;
      }
    } catch (e) { /* 容错 */ }
  }

  /* ---------- 初始化 ---------- */
  UI.init = function () {
    try {
      injectCSS();
      var story = document.getElementById("story");
      if (story) {
        var mo = new MutationObserver(onStoryChanged);
        mo.observe(story, { childList: true, subtree: true });
      }
      /* 平滑滚动 + 梦境模式 + 日变化：文本变化后 rAF 节流处理 */
      var ticking = false;
      var observer = new MutationObserver(function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          smoothScrollToBottom();
          updateDreamMode();
          watchDay();
        });
      });
      if (story) observer.observe(story, { childList: true, subtree: true, characterData: true });
      /* 选项容器：v67 已选反馈（opt-chosen）与选项追加 → 清扫已选残留 */
      var opts = document.getElementById("options");
      if (opts) {
        var oobs = new MutationObserver(function () {
          try { sweepChosen(); } catch (e) {}
        });
        oobs.observe(opts, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "disabled"] });
      }
    } catch (e) { /* 容错 */ }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", UI.init);
  } else {
    UI.init();
  }
})();
