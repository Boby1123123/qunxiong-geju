# -*- coding: utf-8 -*-
# /pn1inj:patch/ P-N1 线程状态机 + P-N2 编织引用 引擎补丁（script_03.js）
# 用法：python -X utf8 patch_pn.py ；每步锚点唯一，失败即停。
# 行尾处理：script_03.js 为 CRLF；读入归一化为 LF 打补丁，写回还原 CRLF。
import io, sys

P = r"D:\1pao tuan\群雄割据\src\script_03.js"
with io.open(P, "r", encoding="utf-8", newline="") as f:
    raw = f.read()
crlf = raw.count("\r\n") > 0
src = raw.replace("\r\n", "\n")

orig = src
steps = []

# 1) applyDefaults：threads 兜底
anchor1 = '  if(!s.faction) s.faction="";\n  return s;'
add1 = ('  if(!s.faction) s.faction="";\n'
        '  /* /pn1inj:defaults/ P-N1 并行叙事线程状态兜底（旧档兼容；独立键空对象） */\n'
        '  if(!s.threads) s.threads={};\n'
        '  return s;')
if anchor1 in src:
    src = src.replace(anchor1, add1, 1); steps.append("applyDefaults threads")
else:
    print("FAIL step1: applyDefaults 锚点未找到"); sys.exit(1)

# 2) 新函数块：插在 weatherLine 结束、A1inj:proffn 注释之前
anchor2 = '/* ===== /A1inj:proffn/ A-1 个性化开局注入'
funcs = r'''/* ===== /pn1inj:engine/ P-N1 并行叙事线程状态机 + P-N2 编织引用（学习 inkle/ink threads & weave）
 * 纯只读/独立键钩子：不触碰判定公式/writeNext 核心语义/choose/存档结构语义。
 * v92_threadTick：按节点 id 前缀登记所属线程（S.threads 独立键，applyDefaults 兜底）。
 * v92_threadList：按最近活跃日排序返回线程状态（供世界状态牌/手记展示）。
 * v92_expandWeave：text 元素以 "§节点id" 开头时展开为被引用节点正文（递归≤3、防环、缺失原样提示）。
 */
window.v92_threadTick = function(node){
  try{
    if(!S||!S.threads) return null;
    const id = (node && node.id) ? node.id : (typeof curNode!=='undefined' ? curNode : '');
    if(!id) return null;
    const TH = window.THREADS; if(!TH) return null;
    let tId = (node && node.thread) ? node.thread : null;
    if(!tId){
      for(const k in TH){
        const pf = TH[k].prefix;
        if(!pf || !pf.length) continue;
        for(let i=0;i<pf.length;i++){ if(String(id).indexOf(pf[i])===0){ tId=k; break; } }
        if(tId) break;
      }
    }
    if(!tId) return null;
    if(!S.threads[tId]) S.threads[tId]={id:tId, pos:null, updatedDay:0, seen:0};
    const t=S.threads[tId];
    t.pos = id; t.updatedDay = (S.day||0); t.seen = (t.seen||0)+1;
    return t;
  }catch(e){ try{ console.log("[pn1:thr:err]",e); }catch(_){} return null; }
};
window.v92_threadList = function(){
  try{
    if(!S||!S.threads) return [];
    const TH = window.THREADS || {};
    const out = [];
    for(const k in S.threads){
      const t = S.threads[k] || {};
      out.push({id:k, name:(TH[k]&&TH[k].name)||k, desc:(TH[k]&&TH[k].desc)||"", pos:t.pos||null, updatedDay:t.updatedDay||0, seen:t.seen||0});
    }
    out.sort(function(a,b){ return (b.updatedDay||0)-(a.updatedDay||0); });
    return out;
  }catch(e){ return []; }
};
window.v92_expandWeave = function(txt){
  try{
    if(!Array.isArray(txt)) return txt;
    const out = [];
    const seen = {};
    function expand(arr, depth){
      for(let i=0;i<arr.length;i++){
        const el = arr[i];
        if(typeof el==="string" && el.charAt(0)==="\u00a7"){
          const ref = el.slice(1).trim();
          if(!ref || depth>=3 || seen[ref]) continue;
          seen[ref] = true;
          const tn = (typeof N!=="undefined" && N) ? N[ref] : null;
          if(tn){
            let sub = null;
            try{ sub = (typeof window.v91_resolveText==="function") ? window.v91_resolveText(tn) : (typeof tn.text==="function"?tn.text():tn.text); }catch(e){}
            if(Array.isArray(sub) && sub.length){ expand(sub, depth+1); continue; }
          }
          out.push("（引用段落未找到："+ref+"）");
        } else { out.push(el); }
      }
    }
    expand(txt, 0);
    return out;
  }catch(e){ return txt; }
};
'''
if anchor2 in src:
    src = src.replace(anchor2, funcs + anchor2, 1); steps.append("线程/编织函数块")
else:
    print("FAIL step2: A1inj:proffn 锚点未找到"); sys.exit(1)

# 3) writeNext：_txt 解析后加 weave 展开
anchor3 = '    try{ window.v91_sessCount(_txt); }catch(e){}'
add3 = ('    try{ window.v91_sessCount(_txt); }catch(e){}\n'
        '    /* /pn2inj:weavehook/ P-N2 编织引用展开（§node_id 复用段落；递归≤3、防环、缺失原样提示） */\n'
        '    try{ _txt = window.v92_expandWeave(_txt); }catch(e){}')
if anchor3 in src:
    src = src.replace(anchor3, add3, 1); steps.append("weave 展开钩子")
else:
    print("FAIL step3: sessCount 锚点未找到"); sys.exit(1)

# 4) writeNext：arcAdvance 后加 threadTick
anchor4 = '    try{ window.v91_arcAdvance(node); }catch(e){} /* /sp3inj:archook/ SP-3 弧线推进（只读注入点） */'
add4 = (anchor4 + '\n'
        '    /* /pn1inj:threadhook/ P-N1 线程状态机登记（只读钩子：记录当前节点所属叙事线程的进度/日/次数） */\n'
        '    try{ window.v92_threadTick(node); }catch(e){}')
if anchor4 in src:
    src = src.replace(anchor4, add4, 1); steps.append("线程登记钩子")
else:
    print("FAIL step4: arcAdvance 锚点未找到"); sys.exit(1)

# 5) sceneTitle：章节卡副标题补线程名（卷·线·章 三级）
anchor5 = '          }catch(e){ _arcName=\'\'; }\n          if(ck !== window.__v45lastChapter){'
add5 = ('          }catch(e){ _arcName=\'\'; }\n'
        '          /* /pn1inj:scenethread/ P-N1 卷·线·章：副标题追加线程名（按节点前缀查 THREADS；未命中零变化） */\n'
        '          var _thrName = \'\';\n'
        '          try{\n'
        '            var _TH = window.THREADS;\n'
        '            if(_TH){ for(var _tk in _TH){ var _pf=_TH[_tk].prefix; if(!_pf) continue; for(var _pi=0;_pi<_pf.length;_pi++){ if(_id.indexOf(_pf[_pi])===0){ _thrName=_TH[_tk].name||\'\'; break; } } if(_thrName) break; } }\n'
        '          }catch(e){ _thrName=\'\'; }\n'
        '          if(ck !== window.__v45lastChapter){')
if anchor5 in src:
    src = src.replace(anchor5, add5, 1); steps.append("章节卡线程名")
else:
    print("FAIL step5: sceneTitle 锚点未找到"); sys.exit(1)

# 5b) 副标题拼接线程名：chapterCard 调用处（_arcName 已有；再拼 _thrName）
anchor6 = '            chapterCard((c.vol ? c.vol + \' · \' : \'\') + c.title, _arcName ? (_arcName + \'\u3000\' + (c.sub||\'\')) : (c.sub||\'\'));'
add6 = ('            var _sub = _arcName ? (_arcName + \'\u3000\' + (c.sub||\'\')) : (c.sub||\'\');\n'
        '            if(_thrName){ _sub = _sub ? (_thrName + \' · \' + _sub) : _thrName; }\n'
        '            chapterCard((c.vol ? c.vol + \' · \' : \'\') + c.title, _sub);')
if anchor6 in src:
    src = src.replace(anchor6, add6, 1); steps.append("章节卡副标题线程名")
else:
    print("FAIL step6: chapterCard 锚点未找到"); sys.exit(1)

if crlf:
    src = src.replace("\n", "\r\n")
with io.open(P, "w", encoding="utf-8", newline="") as f:
    f.write(src)

print("OK patch applied:", len(steps), "steps ->", ", ".join(steps))
print("size:", len(orig), "->", len(src), "bytes")
