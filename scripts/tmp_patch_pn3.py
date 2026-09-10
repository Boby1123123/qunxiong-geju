# -*- coding: utf-8 -*-
# /pn3inj:patch/ P-N3 叙事线面板（既有线并行化示范 + 卷·线·章 UI）
# 1) script_03.js：v92_expandWeave 后插入 v92_threadNodeName + v92_openThreadPanel
# 2) src\gap_00.html：顶栏 btn-chronicle 后插入"叙事线"按钮
import io, sys

def norm(path):
    with io.open(path, "r", encoding="utf-8", newline="") as f:
        raw = f.read()
    return raw, raw.count("\r\n") > 0

def write_back(path, text, crlf):
    if crlf:
        text = text.replace("\n", "\r\n")
    with io.open(path, "w", encoding="utf-8", newline="") as f:
        f.write(text)

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
src, crlf = norm(P3)
src = src.replace("\r\n", "\n")

anchor = "window.v92_expandWeave = function(txt){"
idx = src.find(anchor)
if idx < 0:
    print("FAIL: v92_expandWeave 未找到"); sys.exit(1)
# 找到该函数结束位置（函数体以 };\n 结尾，找下一个 "\n};" 之后）
end = src.find("\n};", idx)
if end < 0:
    print("FAIL: 函数结束未找到"); sys.exit(1)
end = end + 3  # 包含 }; 和换行

funcs = r'''
/* /pn3inj:panel/ P-N3 叙事线面板：并行叙事线状态总览（卷·线·章 UI）
 * 只读 S.threads + THREADS；"前往"复用既有 v488_go（走 writeNext 正常渲染，零语义改动）。
 */
window.v92_threadNodeName = function(id){
  try{
    if(!id) return "";
    const n = (typeof N!=="undefined" && N) ? N[id] : null;
    if(n){ return (n.sceneTitle || n.place || id); }
    return id;
  }catch(e){ return id || ""; }
};
window.v92_openThreadPanel = function(){
  try{
    if(typeof openModal!=="function") return;
    const box = document.createElement("div");
    box.className = "box";
    const list = (typeof window.v92_threadList==="function") ? window.v92_threadList() : [];
    let h = "<h2>◆ 并行叙事线</h2><p class='sub'>大陆上多条线并行推进，各自记着进度。点击「前往」回到该线最近所在。</p>";
    if(!list.length){ h += "<p style='color:var(--dim)'>尚未涉足任何叙事线——所有故事都从序章开始。</p>"; }
    for(let i=0;i<list.length;i++){
      const t = list[i];
      const posName = t.pos ? window.v92_threadNodeName(t.pos) : "尚未涉足";
      const day = t.updatedDay ? ("第 "+t.updatedDay+" 日") : "—";
      h += "<div class='v92-thread' style='border:1px solid var(--line,#2d4566);border-radius:8px;padding:10px 12px;margin:8px 0'>";
      h += "<div style='display:flex;align-items:center;gap:8px;flex-wrap:wrap'><b style='color:var(--gold,#e8c468)'>"+(t.name||t.id)+"</b><span class='mini' style='color:var(--dim)'>"+day+" · 已读 "+(t.seen||0)+" 节点</span></div>";
      h += "<div class='mini' style='color:var(--dim);margin-top:2px'>"+(t.desc||"")+"</div>";
      h += "<div style='margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap'><span style='color:var(--text)'>最近："+posName+"</span>";
      if(t.pos){ h += "<button class='btn' style='padding:4px 10px;font-size:12px' onclick='try{closeModal();v488_go(\""+t.pos+"\");}catch(e){}'>前往</button>"; }
      h += "</div></div>";
    }
    h += "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>";
    box.innerHTML = h;
    openModal(box);
  }catch(e){ try{ console.log("[pn3:panel:err]",e); }catch(_){} }
};
'''
src = src[:end] + funcs + src[end:]
write_back(P3, src, crlf)
print("OK: script_03.js +叙事线面板函数")

# gap_00.html 顶栏按钮
PG = r"D:\1pao tuan\群雄割据\src\gap_00.html"
g, gcrlf = norm(PG)
g = g.replace("\r\n", "\n")
anchor_g = '<button class="btn" id="btn-chronicle" title="编年史 (C)">📖 编年史</button>'
if anchor_g not in g:
    print("WARN: btn-chronicle 锚点未找到，改用宽松匹配")
    import re
    m = re.search(r'<button class="btn"[^>]*id="btn-chronicle"[^>]*>[^<]*</button>', g)
    if not m:
        print("FAIL: btn-chronicle 未找到"); sys.exit(1)
    anchor_g = m.group(0)
add_g = anchor_g + '\n        <button class="btn" id="btn-threads" title="叙事线 (N)：并行叙事线进度" onclick="v92_openThreadPanel()">☰ 叙事线</button>'
g = g.replace(anchor_g, add_g, 1)
write_back(PG, g, gcrlf)
print("OK: gap_00.html +叙事线按钮")
