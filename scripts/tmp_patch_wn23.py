# -*- coding: utf-8 -*-
# /wn23inj:patch/ W-N2 NPC 状态机 + W-N3 NPC 状态回指注入
# 1) script_03.js：v92_worldSnapshot 前插入 v92_npcStatus/v92_npcStatusList/v92_npcWeave
# 2) v92_openWorldPanel 末尾追加人物动态区块
# 3) writeNext memhook 后加 npchook
# 4) applyDefaults 加 S.settings.npcWeave 默认 true
import io, sys

P3 = r"D:\1pao tuan\群雄割据\src\script_03.js"
raw = io.open(P3, "r", encoding="utf-8", newline="").read()
crlf = raw.count("\r\n") > 0
src = raw.replace("\r\n", "\n")

# 1) 插入 NPC 状态函数（在 v92_worldSnapshot 前）
anchor = "window.v92_worldSnapshot = function(){"
idx = src.find(anchor)
if idx < 0:
    print("FAIL: v92_worldSnapshot 未找到"); sys.exit(1)
funcs = r'''
/* /wn2inj:npc/ W-N2 NPC 独立状态机（推导式）：只读 S.day/npcRelations，无状态写入 */
window.v92_npcStatus = function(npcId){
  try{
    var ns = window.NPC_STATE; if(!ns) return null;
    var d = (S && typeof S.day==="number") ? S.day : 0;
    var item = null;
    for(var i=0;i<ns.length;i++){ if(ns[i].id===npcId){ item=ns[i]; break; } }
    if(!item || !item.stages || !item.stages.length) return null;
    var st = item.stages[0];
    for(var j=0;j<item.stages.length;j++){ if(d >= item.stages[j].day){ st = item.stages[j]; } }
    var rel = 0;
    if(S && S.npcRelations){ rel = S.npcRelations[npcId] || 0; }
    var mood = "";
    if(rel>=60) mood="（与你是挚交）";
    else if(rel<=-20) mood="（与你结过梁子）";
    return {id:npcId, name:item.name, where:st.where, doing:st.doing, mood:mood};
  }catch(e){ return null; }
};
window.v92_npcStatusList = function(){
  try{
    var ns = window.NPC_STATE; if(!ns) return [];
    var out = [];
    for(var i=0;i<ns.length;i++){
      var s = window.v92_npcStatus(ns[i].id);
      if(s){ out.push(s); }
    }
    return out;
  }catch(e){ return []; }
};
/* /wn3inj:npcweave/ W-N3 NPC 状态回指注入：正文提及 NPC（好感<30，与 CM-1 互斥）时
 * 注入其此刻动态 1 句；开关 S.settings.npcWeave（默认 true）；前缀 /w3inj:npc/ */
window.v92_npcWeave = function(node, txt){
  try{
    if(!S || !S.settings || S.settings.npcWeave===false) return null;
    var ns = window.NPC_STATE; if(!ns) return null;
    var body = "";
    try{
      if(txt && txt.join){ body = txt.join(""); }
      else if(node && node.text){ body = (typeof node.text==="string") ? node.text : String(node.text); }
    }catch(e){}
    if(!body) return null;
    var out = [];
    for(var i=0;i<ns.length;i++){
      var n = ns[i];
      if(!n || !n.name) continue;
      if(body.indexOf(n.name) < 0) continue;
      var rel = 0;
      if(S && S.npcRelations){ rel = S.npcRelations[n.id] || 0; }
      if(rel>=30) continue;
      var st = window.v92_npcStatus(n.id);
      if(!st || !st.doing) continue;
      out.push("（他此刻在"+st.where+"："+st.doing+"）");
      break;
    }
    return out.length ? out : null;
  }catch(e){ try{ console.log("[wn3:npcweave:err]",e); }catch(_){} return null; }
};
'''
src = src[:idx] + funcs + src[idx:]

# 2) v92_openWorldPanel 末尾追加人物动态区块
anchor_p = "    h += \"<button class='opt' onclick='closeModal()'><span class='od'>✕</span> 关闭</button>\";"
idx_p = src.find(anchor_p)
if idx_p < 0:
    print("FAIL: openWorldPanel 关闭按钮锚点未找到"); sys.exit(1)
block_p = r'''    var npcs = (typeof window.v92_npcStatusList==="function") ? window.v92_npcStatusList() : [];
    if(npcs && npcs.length){
      h += "<div style='margin-top:14px;border-top:1px solid var(--line,#2d4566);padding-top:10px'><b style='color:var(--gold,#e8c468)'>大陆人物动态</b><span class='mini' style='color:var(--dim)'>（共 "+npcs.length+" 位——他们在你视线之外，也在过日子）</span></div>";
      var _n = Math.min(npcs.length, 8);
      for(var _i=0;_i<_n;_i++){
        var _s = npcs[_i];
        h += "<p style='margin:6px 0;line-height:1.7'><b>"+(_s.name||"")+"</b> <span class='mini' style='color:var(--dim)'>"+(_s.mood||"")+"</span><br/><span style='color:var(--text)'>"+(_s.doing||"")+"</span></p>";
      }
    }
'''
src = src[:idx_p] + block_p + src[idx_p:]

# 3) writeNext memhook 后加 npchook
anchor_h = "    /* /A1inj:profhook/ A-1 个性化开局注入（只读钩子；顺序在记忆注入之后，五维开场文本优先展示） */"
idx_h = src.find(anchor_h)
if idx_h < 0:
    print("FAIL: profhook 锚点未找到"); sys.exit(1)
hook = "    /* /wn3inj:npchook/ W-N3 NPC 状态回指注入（只读钩子；顺序在记忆注入之后，好感<30 与 CM-1 互斥） */\n    try{ var _nw = window.v92_npcWeave(node,_txt); if(_nw&&_nw.length){ _txt=_nw.concat(_txt); } }catch(e){}\n"
src = src[:idx_h] + hook + src[idx_h:]

# 4) applyDefaults 加 npcWeave 默认 true（在 memoryInjection 兜底旁）
anchor_d = "settings.memoryInjection"
idx_d = src.find(anchor_d)
if idx_d < 0:
    print("FAIL: settings.memoryInjection 未找到"); sys.exit(1)
# 找到该行结尾 \n
nl = src.find("\n", idx_d)
if nl < 0:
    print("FAIL: 行尾未找到"); sys.exit(1)
add_d = src[idx_d:nl+1] + "    if(!s.settings.npcWeave) s.settings.npcWeave=true; /* W-N3 NPC 状态回指（默认开，旧档兜底） */\n"
src = src[:idx_d] + add_d + src[nl+1:]

if crlf:
    src = src.replace("\n", "\r\n")
io.open(P3, "w", encoding="utf-8", newline="").write(src)
print("OK: W-N2/W-N3 引擎补丁完成")
