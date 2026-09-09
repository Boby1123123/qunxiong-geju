
/* /v62inj:loader/ v62 内容分片运行时 */
(function(){
  try{
    window.v62_manifest = window.v62_manifest || { "abyss": { file: "chunks/v62_abyss.js", prefix: "abyss", prefixes: ["abyss"] }, "academy": { file: "chunks/v62_academy.js", prefix: "academy", prefixes: ["academy"] }, "arc": { file: "chunks/v62_arc.js", prefix: "arc", prefixes: ["arc"] }, "city": { file: "chunks/v62_city.js", prefix: "city", prefixes: ["city", "cityev"] }, "dun": { file: "chunks/v62_dun.js", prefix: "dun", prefixes: ["dun"] }, "evt": { file: "chunks/v62_evt.js", prefix: "evt", prefixes: ["evt"] }, "narr": { file: "chunks/v62_narr.js", prefix: "v66", prefixes: ["v66"] }, "npc": { file: "chunks/v62_npc.js", prefix: "npc", prefixes: ["npc", "classmate"] }, "origin": { file: "chunks/v62_origin.js", prefix: "origin", prefixes: ["origin"] }, "relic": { file: "chunks/v62_relic.js", prefix: "relic", prefixes: ["relic"] }, "seal": { file: "chunks/v62_seal.js", prefix: "seal", prefixes: ["seal"] }, "war": { file: "chunks/v62_war.js", prefix: "v65", prefixes: ["v65", "v652", "v653", "v654", "v655"] }, "west": { file: "chunks/v62_west.js", prefix: "west", prefixes: ["west"] }, "world": { file: "chunks/v62_world.js", prefix: "w64", prefixes: ["w64"] } };
    if (window.v62_chunk_loader) return;
    var loaded = {}, loading = {}, queues = {};
    function loadChunk(name, cb){
      if (loaded[name]) { if (cb) cb(); return; }
      (queues[name] = queues[name] || []).push(cb || null);
      if (loading[name]) return;
      loading[name] = true;
      var s = document.createElement("script");
      s.src = window.v62_manifest[name].file;
      s.onload = function(){ loading[name] = false; };
      s.onerror = function(){ loading[name] = false; var q = queues[name] || []; queues[name] = [];
        try{ var st = document.getElementById("story"); if (st) st.innerHTML += '<p style="color:#c33">章节内容加载失败，请刷新重试</p>'; }catch(e){}
        try{ console.warn("v62 chunk 加载失败: " + name); }catch(e){} };
      document.head.appendChild(s);
    }
    function mark(name){ loaded[name] = true; var q = queues[name] || []; queues[name] = [];
      for (var i = 0; i < q.length; i++){ try{ q[i] && q[i](); }catch(e){} } }
    function owner(id){
      for (var k in window.v62_manifest){
        var m = window.v62_manifest[k];
        var ps = m.prefixes || [m.prefix];
        for (var i = 0; i < ps.length; i++){ if (id.indexOf(ps[i]) === 0) return k; }
      }
      return null;
    }
    window.v62_chunk_loader = { loadChunk: loadChunk, mark: mark, owner: owner,
      isLoaded: function(n){ return !!loaded[n]; } };
  }catch(e){}
})();
(function(){
  try{
    if (typeof window.writeNext !== "function" || !window.v62_chunk_loader) return;
    var __v62_wn = window.writeNext;
    window.writeNext = function(){
      try{
        var t = (typeof curNode !== "undefined") ? curNode : null;
        if (t && typeof N[t] !== "function" && window.v62_chunk_loader){
          var nm = window.v62_chunk_loader.owner(t);
          if (nm){
            window.v62_chunk_loader.loadChunk(nm, function(){ try{ __v62_wn.apply(window, arguments); }catch(e){} });
            return;
          }
        }
      }catch(e){}
      return __v62_wn.apply(this, arguments);
    };
    window.writeNext = writeNext;
  }catch(e){}
})();
