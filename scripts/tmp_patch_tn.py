# -*- coding: utf-8 -*-
# /tninj:patch/ T-N1~3 作者工具：游戏内节点编辑器（只读浏览 + 会话级编辑 + 脚手架 + 导出补丁）
# - 零持久化（刷新还原，安全）；编辑只影响当前会话 N（即时预览）
# - 导出补丁 JSON → 回写 src\data_nodes\dn_patch.js 完成内容生产闭环
# - 不触碰 writeNext/choose/存档结构/S 状态
import io, sys

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P3, "r", encoding="utf-8", newline="").read()
crlf = raw.count("\r\n") > 0
src = raw.replace("\r\n", "\n")

anchor = "window.v92_openThreadPanel = function(){"
idx = src.find(anchor)
if idx < 0:
    print("FAIL: v92_openThreadPanel 未找到"); sys.exit(1)

funcs = r'''
/* ===== /tninj:editor/ T-N 作者工具：游戏内节点编辑器 =====
 * 只读搜索 + 会话级编辑（N[id] 覆盖，刷新还原）+ 脚手架 + 导出补丁 JSON。
 * 导出格式：{kind:"elda-node-patch-v1", nodes:{id:{tag,place,pace,text}}, created:[...]}
 * 回写方式：把 nodes 合并进 src\data_nodes\dn_patch.js（见工具手册）。
 */
window.v92_nodeEdit = window.v92_nodeEdit || {dirty:{}, created:{}};
window.v92_nodeSearch = function(kw){
  try{
    if(!window.N) return [];
    kw = String(kw||"").toLowerCase();
    var out = []; var cnt = 0;
    for(var id in N){
      try{
        var n = N[id];
        if(!n || typeof n!=="object") continue;
        if(kw){
          if(id.toLowerCase().indexOf(kw) >= 0){ /* 命中 */ }
          else{
            var t = "";
            try{
              if(typeof n.text==="string") t = n.text;
              else if(Array.isArray(n.text)) t = n.text.join("");
              else if(n.text && typeof n.text==="object") t = JSON.stringify(n.text);
            }catch(e){}
            if(t.toLowerCase().indexOf(kw) < 0) continue;
          }
        }
        var len = 0;
        try{
          if(typeof n.text==="string") len = n.text.length;
          else if(Array.isArray(n.text)) len = n.text.join("").length;
        }catch(e){}
        out.push({id:id, tag:n.tag||"", place:(n.place||""), pace:n.pace||"normal", len:len});
        cnt++;
        if(cnt>=60) break;
      }catch(e){}
    }
    return out;
  }catch(e){ return []; }
};
window.v92_nodeEditOpen = function(id){
  try{
    if(!id || !window.N || !N[id]) return;
    var n = N[id];
    var box = document.createElement("div");
    box.className = "box";
    var textVal = "";
    try{
      if(typeof n.text==="string") textVal = n.text;
      else if(Array.isArray(n.text)) textVal = n.text.join("\n<<<>>>\n");
      else if(n.text && typeof n.text==="object") textVal = JSON.stringify(n.text);
    }catch(e){}
    var tag = n.tag||""; var place = (typeof n.place==="string"?n.place:""); var pace = n.pace||"normal";
    box.innerHTML =
      "<h2>✎ 节点编辑 · "+id+"</h2>"+
      "<p class='sub'>tag: "+tag+" ｜ pace: "+pace+" ｜ 字符数: "+textVal.length+"</p>"+
      "<div style='margin:6px 0'><b class='mini'>place（地点）</b><input id='v92ne-place' class='in' value=\""+place.replace(/"/g,"&quot;")+"\" style='width:100%;padding:6px'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>text（段落用空行分隔，数组元素用 &lt;&lt;&lt;&gt;&gt;&gt; 分隔）</b></div>"+
      "<textarea id='v92ne-text' rows='10' style='width:100%;box-sizing:border-box;padding:8px;font-size:13px;line-height:1.6;background:var(--bg,#f4efe4);color:var(--text,#222);border:1px solid var(--line,#2d4566);border-radius:6px'>"+textVal.replace(/</g,"&lt;")+"</textarea>"+
      "<div style='margin:8px 0'><b class='mini'>pace</b> <select id='v92ne-pace' style='padding:4px'><option value='light'>light</option><option value='normal'>normal</option><option value='deep'>deep</option><option value='epic'>epic</option></select></div>"+
      "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px'>"+
      "<button class='btn' onclick='v92_nodeSave(\""+id+"\")'>保存（即时生效）</button>"+
      "<button class='btn' onclick='v92_nodePreview(\""+id+"\")'>预览正文</button>"+
      "<button class='btn' onclick='v92_nodeExport()'>导出补丁 JSON</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>";
    openModal(box);
    try{ var psel = document.getElementById("v92ne-pace"); if(psel){ psel.value = pace; } }catch(e){}
  }catch(e){ try{ console.log("[tn:open:err]",e); }catch(_){} }
};
window.v92_nodeSave = function(id){
  try{
    if(!id || !window.N || !N[id]) return;
    var t = document.getElementById("v92ne-text");
    var pl = document.getElementById("v92ne-place");
    var pc = document.getElementById("v92ne-pace");
    if(!t) return;
    var txt = t.value;
    var arr = txt.split("\n<<<>>>\n");
    var cleaned = [];
    for(var i=0;i<arr.length;i++){ if(arr[i].trim().length>0){ cleaned.push(arr[i]); } }
    if(cleaned.length===1){ N[id].text = cleaned[0]; }
    else{ N[id].text = cleaned; }
    if(pl && pl.value){ N[id].place = pl.value; }
    if(pc && pc.value){ N[id].pace = pc.value; }
    window.v92_nodeEdit.dirty[id] = {tag:N[id].tag||"", place:N[id].place||"", pace:N[id].pace||"normal", text:N[id].text};
    try{ var st=document.getElementById("v92ne-status"); if(st){ st.innerHTML="<b style='color:#2e7d32'>已保存到当前会话（刷新还原）。导出补丁后可回写源码。</b>"; } }catch(e){}
    var cur = (typeof curNode!=="undefined" && curNode===id);
    if(cur){ try{ writeNext(id); }catch(e){} }
    alert("已保存到当前会话（即时生效）。点「导出补丁 JSON」可回写源码。");
  }catch(e){ try{ console.log("[tn:save:err]",e); }catch(_){} }
};
window.v92_nodePreview = function(id){
  try{ if(id && typeof writeNext==="function"){ writeNext(id); } }catch(e){}
};
window.v92_nodeExport = function(){
  try{
    var d = window.v92_nodeEdit.dirty||{};
    var c = window.v92_nodeEdit.created||{};
    if(!Object.keys(d).length && !Object.keys(c).length){ alert("当前没有修改。"); return; }
    var patch = {kind:"elda-node-patch-v1", nodes:{}, created:{}};
    for(var id in d){ patch.nodes[id] = d[id]; }
    for(var cid in c){ patch.created[cid] = c[cid]; }
    var blob = new Blob([JSON.stringify(patch,null,2)], {type:"application/json"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "elda_node_patch_"+Date.now()+".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    alert("已导出补丁 JSON（"+Object.keys(d).length+" 改 + "+Object.keys(c).length+" 增）。回写方式见 docs\\工具手册.md。");
  }catch(e){ try{ console.log("[tn:export:err]",e); }catch(_){} }
};
window.v92_nodeScaffold = function(){
  try{
    var box = document.createElement("div");
    box.className = "box";
    box.innerHTML =
      "<h2>🛠 新建节点脚手架</h2><p class='sub'>生成合规节点骨架（tag/place/pace/text）。保存后即加入当前会话，导出可回写源码。</p>"+
      "<div style='margin:6px 0'><b class='mini'>id（英文/拼音前缀，如 west_xxx）</b><input id='v92ns-id' class='in' style='width:100%;padding:6px'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>place</b><input id='v92ns-place' class='in' style='width:100%;padding:6px' value='自由城邦 · 交汇城'/></div>"+
      "<div style='margin:6px 0'><b class='mini'>pace</b> <select id='v92ns-pace' style='padding:4px'><option>normal</option><option>light</option><option>deep</option><option>epic</option></select></div>"+
      "<div style='margin:6px 0'><b class='mini'>text</b></div>"+
      "<textarea id='v92ns-text' rows='6' style='width:100%;box-sizing:border-box;padding:8px;font-size:13px;line-height:1.6;background:var(--bg,#f4efe4);color:var(--text,#222);border:1px solid var(--line,#2d4566);border-radius:6px'></textarea>"+
      "<div style='display:flex;gap:8px;flex-wrap:wrap;margin-top:8px'>"+
      "<button class='btn' onclick='v92_nodeCreate()'>创建并保存</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>";
    openModal(box);
  }catch(e){ try{ console.log("[tn:scaffold:err]",e); }catch(_){} }
};
window.v92_nodeCreate = function(){
  try{
    var idEl = document.getElementById("v92ns-id");
    var plEl = document.getElementById("v92ns-place");
    var pcEl = document.getElementById("v92ns-pace");
    var txEl = document.getElementById("v92ns-text");
    if(!idEl || !txEl) return;
    var id = String(idEl.value||"").trim();
    if(!id || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(id)){ alert("id 需以字母开头，仅字母/数字/下划线。"); return; }
    if(window.N && N[id]){ alert("节点已存在："+id); return; }
    var txt = txEl.value;
    var arr = txt.split("\n<<<>>>\n");
    var cleaned = [];
    for(var i=0;i<arr.length;i++){ if(arr[i].trim().length>0){ cleaned.push(arr[i]); } }
    var node = {tag:"main", place:(plEl?plEl.value:"自由城邦 · 交汇城"), pace:(pcEl?pcEl.value:"normal"), text:(cleaned.length===1?cleaned[0]:cleaned)};
    if(!window.N){ window.N = {}; }
    N[id] = node;
    window.v92_nodeEdit.created[id] = node;
    alert("已创建并加入当前会话："+id+"。点「导出补丁 JSON」回写源码。");
    try{ v92_nodeEditOpen(id); }catch(e){}
  }catch(e){ try{ console.log("[tn:create:err]",e); }catch(_){} }
};
window.v92_openNodeEditor = function(){
  try{
    if(typeof openModal!=="function") return;
    var box = document.createElement("div");
    box.className = "box";
    box.innerHTML =
      "<h2>✎ 节点编辑器（作者工具）</h2>"+
      "<p class='sub'>搜索/浏览全部节点（id 或正文关键词）；点条目打开编辑器。编辑保存即时生效（当前会话，刷新还原），导出补丁 JSON 可回写源码。</p>"+
      "<div style='display:flex;gap:6px;margin:8px 0;flex-wrap:wrap'>"+
      "<input id='v92ne-q' class='in' placeholder='输入节点 id 或正文关键词…' style='flex:1 1 200px;padding:6px'/>"+
      "<button class='btn' onclick='v92_nodeDoSearch()'>搜索</button>"+
      "<button class='btn' onclick='v92_nodeScaffold()'>新建节点</button>"+
      "<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button></div>"+
      "<div id='v92ne-results' style='max-height:340px;overflow-y:auto;border-top:1px solid var(--line,#2d4566);padding-top:8px'></div>";
    openModal(box);
    v92_nodeDoSearch();
  }catch(e){ try{ console.log("[tn:panel:err]",e); }catch(_){} }
};
window.v92_nodeDoSearch = function(){
  try{
    var qEl = document.getElementById("v92ne-q");
    var resEl = document.getElementById("v92ne-results");
    if(!resEl) return;
    var kw = qEl ? qEl.value : "";
    var list = window.v92_nodeSearch(kw);
    var h = "";
    if(!list.length){ h = "<p style='color:var(--dim)'>没有匹配节点。</p>"; }
    for(var i=0;i<list.length;i++){
      var it = list[i];
      var mark = "";
      try{ if(window.v92_nodeEdit.dirty && window.v92_nodeEdit.dirty[it.id]){ mark = " <b style='color:#2e7d32'>已改</b>"; } }catch(e){}
      h += "<div class='v92ne-row' style='padding:6px 8px;margin:3px 0;border:1px solid var(--line,#2d4566);border-radius:6px;cursor:pointer;display:flex;gap:8px;align-items:center;flex-wrap:wrap' onclick='v92_nodeEditOpen(\""+it.id+"\")'>"+
           "<b style='color:var(--gold,#e8c468)'>"+it.id+"</b><span class='mini' style='color:var(--dim)'>"+it.tag+" · "+it.pace+" · "+it.len+"字</span><span style='font-size:12px;color:var(--text)'>"+it.place+"</span>"+mark+"</div>";
    }
    resEl.innerHTML = h;
  }catch(e){ try{ console.log("[tn:search:err]",e); }catch(_){} }
};
'''
src = src[:idx] + funcs + src[idx:]

if crlf:
    src = src.replace("\n", "\r\n")
io.open(P3, "w", encoding="utf-8", newline="").write(src)
print("OK: script_03.js +T-N 节点编辑器")

PG = r"D:\1pao tuan\群雄割据\src\gap_00.html"
rawg = io.open(PG, "r", encoding="utf-8", newline="").read()
gcrlf = rawg.count("\r\n") > 0
g = rawg.replace("\r\n", "\n")
anchor_g = '<button class="btn" id="btn-world" title="世界局势 (W)：九域现状与主线走向" onclick="v92_openWorldPanel()">🌍 局势</button>'
if anchor_g not in g:
    print("FAIL: btn-world 未找到"); sys.exit(1)
add_g = anchor_g + '\n        <button class="btn" id="btn-nodeedit" title="✎ 节点编辑器（作者工具）：搜索/编辑/脚手架/导出补丁" onclick="v92_openNodeEditor()">✎ 编辑</button>'
g = g.replace(anchor_g, add_g, 1)
if gcrlf:
    g = g.replace("\n", "\r\n")
io.open(PG, "w", encoding="utf-8", newline="").write(g)
print("OK: gap_00.html +✎ 编辑按钮")
