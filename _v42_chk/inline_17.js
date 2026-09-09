
/* /v67inj:cost/ V67 行为成本器：修炼/探索成本化（时间/行动点/环境/身心/疲劳） */
(function(){
  try{
    function v67_ensureDefaults(){
      try{ if(window.v66_ensureDefaults) v66_ensureDefaults(); }catch(e){}
      try{ if(!S.trainStreak) S.trainStreak = 0; }catch(e){}
      try{ if(!S.v67CostLog) S.v67CostLog = []; }catch(e){}
    }
    function v67_trainSite(){
      var loc = (S.loc||"");
      var s = {mult:0.7, interrupt:0.12, desc:"野外风大，心神难定"};
      try{
        if(loc.indexOf("north_aierda")===0){ s={mult:1.1,interrupt:0,desc:"学院静室，灵气安定"}; }
        else if(["free_jiaohui","free_gonghui","free_jishi","free_huigang","south_huangjin","south_moxie","church_shengcheng","east_chengtian","dwarf_wangdu","elf_wangting","orc_heishi"].indexOf(loc)>=0){ s={mult:1.0,interrupt:0,desc:"城中客栈，安稳"}; }
      }catch(e){}
      return s;
    }
    function v67_costTrain(costed){
      var out = {ok:true, mult:1, interrupt:0, msg:"", envDesc:""};
      try{
        v67_ensureDefaults();
        if(!S.world) S.world = {};
        /* 身心限制 */
        if((S.hp||0) < 30 || (S.san||0) < 20){
          out.ok=false; out.msg="气海虚浮，强练恐伤根基。先歇一歇，处理些俗务再说。"; return out;
        }
        if((S.san||0) < 50) out.mult *= 0.8;
        /* 环境 */
        var site = v67_trainSite();
        out.mult *= site.mult; out.interrupt = site.interrupt; out.envDesc = site.desc;
        /* 疲劳 */
        var st = S.trainStreak||0;
        if(st >= 3){ out.mult *= 0.75; out.envDesc += "（经脉发胀，事倍功半）"; }
        out.mult = Math.max(0.4, Math.min(1.2, out.mult));
        /* 成本（直接调用时） */
        if(!costed){
          var ap = (S.world.actions===undefined) ? (S.world.actionsMax||4) : S.world.actions;
          if(ap < 1){ out.ok=false; out.msg="今日已无余力，明日再来。"; return out; }
          S.world.actions = ap - 1;
          try{ if(window.mechClockAdvance) mechClockAdvance(2); }catch(e){}
        }
      }catch(e){}
      return out;
    }
    function v67_costExplore(costed){
      var out = {ok:true, msg:""};
      try{
        v67_ensureDefaults();
        if(!S.world) S.world = {};
        if(!costed){
          var ap = (S.world.actions===undefined) ? (S.world.actionsMax||4) : S.world.actions;
          if(ap < 1){ out.ok=false; out.msg="今日已无余力，明日再来。"; return out; }
          S.world.actions = ap - 1;
          try{ if(window.mechClockAdvance) mechClockAdvance(2); }catch(e){}
        }
      }catch(e){}
      return out;
    }
    window.v67_ensureDefaults = v67_ensureDefaults;
    window.v67_trainSite = v67_trainSite;
    window.v67_costTrain = v67_costTrain;
    window.v67_costExplore = v67_costExplore;
  }catch(e){ try{ console.error("[v67cost]", e); }catch(_){} }
})();
