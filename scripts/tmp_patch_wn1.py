# -*- coding: utf-8 -*-
# /wn1inj:patch/ W-N1 世界局势快照：引擎函数 + 顶栏按钮
import io, sys

def norm(path):
    raw = io.open(path, "r", encoding="utf-8", newline="").read()
    return raw, raw.count("\r\n") > 0

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
src, crlf = norm(P3)
src = src.replace("\r\n", "\n")

anchor = "window.v92_openThreadPanel = function(){"
idx = src.find(anchor)
if idx < 0:
    print("FAIL: v92_openThreadPanel 未找到"); sys.exit(1)
end = src.find("\n};", idx)
if end < 0:
    print("FAIL: 函数结束未找到"); sys.exit(1)
end = end + 3

funcs = r'''
/* /wn1inj:snap/ W-N1 世界局势快照（活的世界）：只读 S.day/REGIONS/flags 生成九域局势
 * 与既有 v92 worldBanner（顶栏"世界暂无大事"）并存：banner 是短句，本面板是完整快照。
 */
window.v92_worldSnapshot = function(){
  try{
    var out = [];
    var d = (S && typeof S.day==="number") ? S.day : 0;
    var ph = window.WORLD_PHASE ? window.WORLD_PHASE(d) : "early";
    var ws = window.WORLD_SNAPSHOT;
    if(!ws || !ws.regions || !ws.regions.length) return out;
    out.push("第 "+d+" 日 · 大陆九域局势");
    for(var i=0;i<ws.regions.length;i++){
      var r = ws.regions[i];
      var t = (r && (r[ph] || r.early)) ? (r[ph] || r.early) : "";
      if(t){ out.push("· " + (r.name||"") + "：" + t); }
    }
    if(ws.majors){
      for(var j=0;j<ws.majors.length;j++){
        var m = ws.majors[j];
        if(m && d >= m.day){ out.push("◆ " + (m.name||"") + "：" + (m.text||"")); }
      }
    }
    return out;
  }catch(e){ try{ console.log("[wn1:snap:err]",e); }catch(_){} return []; }
};
window.v92_openWorldPanel = function(){
  try{
    if(typeof openModal!=="function") return;
    var box = document.createElement("div");
    box.className = "box";
    var lines = window.v92_worldSnapshot();
    var h = "<h2>🌍 世界局势</h2><p class='sub'>大陆上发生的事，不因你是否在场而停步。九域各有各的走向。</p>";
    for(var i=0;i<lines.length;i++){
      var cls = (lines[i].indexOf("◆")===0) ? "v92-ws-major" : "v92-ws-region";
      h += "<p style='margin:6px 0;line-height:1.7' class='"+cls+"'>"+lines[i]+"</p>";
    }
    h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>";
    box.innerHTML = h;
    openModal(box);
  }catch(e){ try{ console.log("[wn1:panel:err]",e); }catch(_){} }
};
'''
src = src[:end] + funcs + src[end:]
if crlf:
    src = src.replace("\n", "\r\n")
io.open(P3, "w", encoding="utf-8", newline="").write(src)
print("OK: script_03.js +v92_worldSnapshot +v92_openWorldPanel")

PG = r"D:\1pao tuan\群雄割据\src\gap_00.html"
g, gcrlf = norm(PG)
g = g.replace("\r\n", "\n")
anchor_g = '<button class="btn" id="btn-threads" title="叙事线 (N)：并行叙事线进度" onclick="v92_openThreadPanel()">☰ 叙事线</button>'
if anchor_g not in g:
    print("FAIL: btn-threads 未找到"); sys.exit(1)
add_g = anchor_g + '\n        <button class="btn" id="btn-world" title="世界局势 (W)：九域现状与主线走向" onclick="v92_openWorldPanel()">🌍 局势</button>'
g = g.replace(anchor_g, add_g, 1)
if gcrlf:
    g = g.replace("\n", "\r\n")
io.open(PG, "w", encoding="utf-8", newline="").write(g)
print("OK: gap_00.html +🌍 局势按钮")
