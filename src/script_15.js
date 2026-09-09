
/* /v67inj:gate/ V67 通用剧情锁：入口门禁（防空降） */
(function(){
  try{
    var GATES = {
      academy_enter: {
        cn:"艾尔达魔法学院", spot:"艾尔达魔法学院（时空学派）",
        check:function(){ return (S.academyYear||0) >= 1; },
        passNode:"academy_elda_hub", failNode:"academy_entrance",
        failText:"你还没进过学院的门。艾尔达城北的尖塔群立在那里，入学的事，得去门房问。"
      },
      abyss_gate: {
        cn:"深渊神殿", spot:"深渊神殿（节点7·被深渊占据）",
        check:function(){ return (S.corruption||0) >= 20; },
        passNode:"desert_inside", failNode:null,
        failText:"黑沙驿站的骆驼客都不愿往神殿方向去。那地方的黑雾浓得化不开，你还没到能招惹它的时候。"
      },
      faction_visit: {
        cn:"势力驻地", spot:null, placeholder:true,
        check:function(){ return (S.reputation||0) >= 10; },
        passNode:null, failNode:null,
        failText:"你在这些大人物眼里，还是个无名小卒。等你的名声传到这里再说。"
      },
      job_trial: {
        cn:"职业试炼", spot:null, placeholder:true,
        check:function(){ return true; },
        passNode:null, failNode:null,
        failText:""
      }
      /* 扩展位：新门禁在此追加 {id:{cn,spot,check,passNode,failNode,failText}} */
    };
    var SPOT_ROUTES = {
      "艾尔达魔法学院（时空学派）": { gate:"academy_enter" },
      "深渊神殿（节点7·被深渊占据）": { gate:"abyss_gate" },
      "圣痕司总部": { gate:"faction_visit" },
      "圣痕司驻地": { gate:"faction_visit" },
      "圣痕司分院": { gate:"faction_visit" },
      "帝宫外廓": { gate:"faction_visit" },
      "帝宫": { gate:"faction_visit" }
      /* 扩展位：更多 spot → 门禁映射 */
    };
    function v67_gate(id){
      var g = GATES[id];
      if(!g){ return false; }
      var ok = false;
      try{ ok = !!g.check(); }catch(e){ ok = false; }
      if(ok){
        if(g.passNode){ try{ writeNext(g.passNode); }catch(e){ if(window.mechSecret) mechSecret(); } }
        else { try{ if(window.mechSecret) mechSecret(); }catch(e){} }
      } else {
        if(g.failNode){ try{ writeNext(g.failNode); }catch(e){ if(window.mechSecret) mechSecret(); } }
        else if(g.failText){ try{ if(window.writePar) writePar(g.failText, "hint"); }catch(e){} }
      }
      return ok;
    }
    window.V67_GATES = GATES;
    window.V67_SPOT_ROUTES = SPOT_ROUTES;
    window.v67_gate = v67_gate;
  }catch(e){ try{ console.error("[v67gate]", e); }catch(_){} }
})();
