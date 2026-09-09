/* /v62inj:chunk-war/ 战争与战斗(v65-v65.5)分片（自动生成，勿手改） */
(function(){
  var nodes = {};
  nodes["v655_map_panel"] = function(){
  var arr=['【战线·军报】'];
  var ws=S.worldState; var wars=(ws&&ws.wars)?ws.wars:[];
  var act=wars.filter(function(w){ return w.phase<4; });
  if(!act.length){ arr.push('地图上没有战火。桌上的茶还热着。'); }
  else{
    for(var i=0;i<act.length;i++){
      var w=act[i];
      if(!w.fronts) w.fronts=[];
      var fs=w.fronts||[];
      var fl=[];
      for(var j=0;j<fs.length;j++){ fl.push(fs[j].cn+((fs[j].control||50)>=60?'【占】':((fs[j].control||50)<=40?'【危】':'【峙】'))); }
      arr.push('—— '+v655_fname(w.a)+' vs '+v655_fname(w.b)+' ——');
      arr.push('战线：'+(fl.join(' / ')||'无')+' ｜ 战况分 '+v655_warscore(w));
    }
    arr.push('（打开战事面板可看地图示意。）');
  }
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'打开地图',go:'v65_warPanel'},{t:'离开',go:'v65_warPanel'}]};
};

  nodes["v655_negotiate_panel"] = function(){
  var arr=['【和谈·帅帐】'];
  var w=v655_curWar();
  if(!w){ arr.push('桌案上空空荡荡。没有战争，也就没有和谈。'); return {place:'帅帐',text:function(){return arr;},options:[{t:'离开',go:'v65_warPanel'}]}; }
  var opts=v655_negotiateOptions(w);
  if(!w.negotiateIdx) w.negotiateIdx=0;
  if(w.negotiateNext){ w.negotiateIdx=(w.negotiateIdx+1)%opts.length; w.negotiateNext=false; }
  if(w.negotiateIdx>=opts.length) w.negotiateIdx=0;
  var cur=opts[w.negotiateIdx];
  w.negotiatePick={id:cur.id,terms:cur.terms,note:cur.note};
  arr.push('('+v655_fname(w.a)+' vs '+v655_fname(w.b)+' · 战况分 '+v655_warscore(w)+')');
  var myArmy=S.militaryCareer?S.militaryCareer.armyId:null;
  var me=(myArmy&&(myArmy===w.a||myArmy===w.b))?myArmy:(S.w64Side===w.id?w.a:null);
  arr.push(me?'你是当事人。对方使者坐在对面，面前摊着一卷空白和约。':'你是说客。两边的使者都在看你——看你站哪边。');
  arr.push('你拟的条件：'+cur.t+'。'+(cur.note||''));
  return {place:'帅帐', text:function(){return arr;}, options:[
    {t:'就按这个谈',go:'v655_negotiate_roll'},
    {t:'换一个组合',go:'v655_negotiate_next'},
    {t:'白和（各退一步）',go:'v655_negotiate_white'},
    {t:'不谈了',go:'v65_warPanel'}
  ]};
};

  nodes["v655_negotiate_next"] = function(){
  var w=v655_curWar(); if(w){ w.negotiateNext=true; }
  var arr=['【和谈·改稿】'];
  arr.push('你换了一张纸，把条件重新拟了一遍。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'继续',go:'v655_negotiate_panel'}]};
};

  nodes["v655_negotiate_roll"] = function(){
  var arr=['【和谈·摊牌】'];
  var w=v655_curWar();
  var pick=w?w.negotiatePick:null;
  if(!w||!pick){ arr.push('桌案空了。'); return {place:'帅帐',text:function(){return arr;},options:[{t:'离开',go:'v65_warPanel'}]}; }
  var r=window.v655_negotiateRoll(w,pick.terms);
  arr.push('你开的条件：'+(pick.note||''));
  arr.push('对方使者沉默了很久，指节在桌沿上敲了'+Math.floor(Math.random()*5+2)+'下。');
  arr.push('掷骰 '+r.roll+' / 需 '+r.target+'（'+r.reason+'）');
  return {place:'和谈席', text:function(){return arr;},
    options: r.pass?[{t:'缔约',go:'v655_negotiate_accept'},{t:'反悔，不谈了',go:'v655_negotiate_break'}]
      :[{t:'接受现实（破裂）',go:'v655_negotiate_break'},{t:'改口重谈',go:'v655_negotiate_panel'}]};
};

  nodes["v655_negotiate_accept"] = function(){
  var arr=['【和约·落笔】'];
  var w=v655_curWar(); var pick=w?w.negotiatePick:null;
  if(!w||!pick){ arr.push('你回头，桌案已经空了。'); return {place:'帅帐',text:function(){return arr;},options:[{t:'离开',go:'v65_warPanel'}]}; }
  var day=(S.time&&S.time.totalDays)||S.day||0;
  var isWhite=(pick.terms||[]).indexOf('white')>=0;
  window.v655_applyTreaty(w,pick.terms,isWhite?'白和':'和约',day);
  arr.push(isWhite?'和约上没有别的条款，只有「各自休兵」。':'笔尖落下去的时候，窗外传来收兵的号角。');
  arr.push('你抬起头，对面使者的脸上，说不清是解脱还是不甘。');
  S.warFame=(S.warFame||0)+(isWhite?2:6);
  if(S.militaryCareer) S.militaryCareer.morale=Math.min(100,(S.militaryCareer.morale||70)+10);
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'收好和约',go:'v65_warPanel'}]};
};

  nodes["v655_negotiate_break"] = function(){
  var arr=['【和谈·破裂】'];
  var w=v655_curWar();
  if(w){
    if(S.worldState&&S.worldState.relations){
      var k=(w.a<w.b)?(w.a+'-'+w.b):(w.b+'-'+w.a);
      if(S.worldState.relations[k]!==undefined){ S.worldState.relations[k]=Math.max(-100,S.worldState.relations[k]-8); }
    }
    if(window.w64_broadcast){ try{ w64_broadcast('和谈破裂', v655_fname(w.a)+'与'+v655_fname(w.b)+'的和谈谈崩了。', (S.time&&S.time.totalDays)||S.day||0); }catch(e){} }
  }
  arr.push('使者拂袖而去。桌上的茶凉透了，谁也没喝一口。');
  arr.push('营帐外，军旗又升了起来。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'备战',go:'v65_warPanel'}]};
};

  nodes["v655_negotiate_white"] = function(){
  var arr=['【和谈·白和】'];
  var w=v655_curWar();
  if(w){ window.v655_applyTreaty(w,['white'],'白和',(S.time&&S.time.totalDays)||S.day||0); }
  arr.push('两边各退一步，不赔不割，只求休兵。');
  arr.push('「来日再战，好聚好散。」使者拱了拱手。');
  S.warFame=(S.warFame||0)+1;
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'收兵',go:'v65_warPanel'}]};
};

  nodes["v655_debt_notice"] = function(){
  var arr=['【账房·传闻】'];
  var ws=S.worldState; var found='';
  if(ws&&ws.wars){
    for(var i=0;i<ws.wars.length;i++){
      var war=ws.wars[i];
      if(war.treaty&&war.treaty.repar>0&&!war.reparDone&&(war.debtDefault||0)>0){
        found=v655_fname(war.result?war.result.loser:war.b)+'拖欠赔款'+(war.debtDefault||0)+'次。账房每天去催一次，门都拍出了掌印。';
        break;
      }
    }
  }
  arr.push(found||'「听说有笔赔款，拖了很久了。账房每天都要去催一次。」');
  arr.push('酒馆里的人压低声音说这话时，眼睛望着城门方向。');
  return {place:'酒馆', text:function(){return arr;}, options:[{t:'离开',go:'v65_warPanel'}]};
};

  nodes["v655_debt_war"] = function(){
  var arr=['【讨债·宣战】'];
  var ws=S.worldState; var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].debtWar&&ws.wars[i].phase<4){ w=ws.wars[i]; break; } } }
  if(w){
    arr.push(v655_fname(w.a)+'以「讨债」为名，向'+v655_fname(w.b)+'宣战。');
    arr.push('账本上的数目，要用刀剑去收。');
    var myArmy=S.militaryCareer?S.militaryCareer.armyId:null;
    var opts=[{t:'旁观',go:'v65_warPanel'}];
    if(myArmy&&(myArmy===w.a||myArmy===w.b)){ opts.unshift({t:'随军出征',go:'v655_debt_join'}); }
    if(!(myArmy&&(myArmy===w.a||myArmy===w.b))&&(S.worldFame&&((S.worldFame.mercy||0)+(S.worldFame.legend||0))>=30)){ opts.push({t:'出面调解',go:'v655_debt_mediator'}); }
    return {place:'告示板', text:function(){return arr;}, options:opts};
  }
  arr.push('告示板上干干净净，没有讨债的檄文。');
  return {place:'告示板', text:function(){return arr;}, options:[{t:'离开',go:'v65_warPanel'}]};
};

  nodes["v655_debt_join"] = function(){
  var ws=S.worldState; var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].debtWar&&ws.wars[i].phase<4){ w=ws.wars[i]; break; } } }
  if(w){ S.w64Side=w.id; }
  var arr=['【讨债·出征】'];
  arr.push('你披甲上马。军旗上绣着账本与刀。');
  arr.push('「欠债还钱，天经地义。」老卒说这话时，摩挲着刀柄。');
  return {place:'行军队列', text:function(){return arr;}, options:[{t:'随军前进',go:'v65_camp'}]};
};

  nodes["v655_debt_mediator"] = function(){
  var arr=['【调解·两边的帐】'];
  var ws=S.worldState; var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].debtWar&&ws.wars[i].phase<4){ w=ws.wars[i]; break; } } }
  if(!w&&ws&&ws.wars){ for(var j=0;j<ws.wars.length;j++){ if(ws.wars[j].phase<4){ w=ws.wars[j]; break; } } }
  var r=window.v655_mediatorRoll(w||{a:'church',b:'north'});
  arr.push('你站在两军阵前，要他们看你的面子。');
  arr.push('「欠的债，还一半，剩下的分期，如何？」你把话递了过去。');
  arr.push('掷骰 '+r.roll+' / 需 '+r.target);
  return {place:'两军阵前', text:function(){return arr;},
    options: r.pass?[{t:'成了',go:'v655_debt_mediator_ok'}]:[{t:'没谈拢',go:'v655_debt_mediator_fail'}]};
};

  nodes["v655_debt_mediator_ok"] = function(){
  var arr=['【调解·成】'];
  var ws=S.worldState; var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].debtWar&&ws.wars[i].phase<4){ w=ws.wars[i]; break; } } }
  if(w){
    if(w.treaty) w.treaty.repar=Math.ceil((w.treaty.repar||0)/2);
    if(S.worldState&&S.worldState.relations){
      var k=(w.a<w.b)?(w.a+'-'+w.b):(w.b+'-'+w.a);
      if(S.worldState.relations[k]!==undefined){ S.worldState.relations[k]=Math.min(100,(S.worldState.relations[k]||0)+25); }
    }
    if(window.w64_broadcast){ try{ w64_broadcast('调解', '在你的斡旋下，'+v655_fname(w.a)+'与'+v655_fname(w.b)+'重订赔款，减半偿付。', (S.time&&S.time.totalDays)||S.day||0); }catch(e){} }
    if(S.worldFame) S.worldFame.mercy=(S.worldFame.mercy||0)+3;
  }
  arr.push('两边都松了口。账本上的数目划掉一半，剩下的分期慢慢还。');
  arr.push('「给你个面子。」两边的使者难得异口同声。');
  return {place:'两军阵前', text:function(){return arr;}, options:[{t:'收兵',go:'v65_warPanel'}]};
};

  nodes["v655_debt_mediator_fail"] = function(){
  var arr=['【调解·败】'];
  var ws=S.worldState; var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].debtWar&&ws.wars[i].phase<4){ w=ws.wars[i]; break; } } }
  if(w&&S.worldState&&S.worldState.relations){
    var k=(w.a<w.b)?(w.a+'-'+w.b):(w.b+'-'+w.a);
    if(S.worldState.relations[k]!==undefined){ S.worldState.relations[k]=Math.max(-100,(S.worldState.relations[k]||0)-10); }
  }
  arr.push('「账上的钱，比你的面子值钱。」左边的人说。');
  arr.push('右边的拔了刀。你后退半步。');
  if(S.worldFame) S.worldFame.terror=(S.worldFame.terror||0)+1;
  return {place:'两军阵前', text:function(){return arr;}, options:[{t:'退开',go:'v65_warPanel'}]};
};

  nodes["v655_debt_done"] = function(){
  var arr=['【账房·结清】'];
  var ws=S.worldState; var found=null;
  if(ws&&ws.wars){
    for(var i=ws.wars.length-1;i>=0;i--){
      var war=ws.wars[i];
      if(war.treaty&&war.treaty.repar>0&&war.reparDone){ found=war; break; }
    }
  }
  if(found){ arr.push(v655_fname(found.result?found.result.loser:found.b)+'的最后一笔赔款到账。账本合上，落了灰。'); }
  else{ arr.push('账房说，最近的赔款都按期到账，无需挂心。'); }
  arr.push('「平了。」老账房敲了敲算盘，声音短促。');
  return {place:'账房', text:function(){return arr;}, options:[{t:'离开',go:'v65_warPanel'}]};
};


  nodes["v654_strategy_panel"] = function(){
  var arr=['【战略地图】'];
  var ws=S.worldState;
  var wars=(ws&&ws.wars)?ws.wars:[];
  var active=wars.filter(function(w){ return w.phase<4; });
  var done=wars.filter(function(w){ return w.phase>=4&&w.result; });
  if(!active.length){ arr.push('目前没有正在进行的战争。桌案上摊着旧地图，折痕已经磨白了。'); }
  else{
    for(var i=0;i<active.length;i++){
      var w=active[i];
      v654_frontsInit(w);
      if(!w.goal) w.goal=v654_goalPick(w);
      var sc=v654_warscore(w);
      var fs=w.fronts||[];
      var fl=[];
      for(var j=0;j<fs.length;j++){ fl.push(fs[j].cn+((fs[j].control||50)>=60?'【占】':((fs[j].control||50)<=40?'【危】':'【峙】'))); }
      arr.push('—— '+(w64_fname?w64_fname(w.a):w.a)+' vs '+(w64_fname?w64_fname(w.b):w.b)+' ——');
      arr.push('战线：'+fl.join(' / '));
      arr.push('战况分 '+sc+'（100 为压胜）｜目标：'+(w.goal?w.goal.cn:'—')+(w.goalDone?'（已达成）':'')+'｜起因：'+(w.cause||'世仇'));
      arr.push('回合 '+w.turns+' ｜胜场 '+(w.winsA||0)+' 比 '+(w.winsB||0)+' ｜士气 '+(w.moraleA||0)+'/'+(w.moraleB||0)+' ｜粮 '+(w.supplyA||0)+'/'+(w.supplyB||0));
    }
  }
  if(done.length){
    arr.push('');
    arr.push('【战后账册】最近结束的战争：');
    for(var k=0;k<done.length;k++){
      var wd=done[k];
      arr.push('· '+(wd.result.text||(w64_fname?w64_fname(wd.result.winner||wd.a):'')+'胜'));
      if(wd.treaty) arr.push('  条约：'+(wd.treaty.mode)+' — '+wd.treaty.terms.join('、')+(wd.treaty.repar>0?('｜赔款 '+wd.treaty.repar):''));
    }
  }
  var opts=[{t:'离开', go:'v65_warPanel'}];
  return {place:'帅帐', text:function(){return arr;}, options:opts};
};

  
  nodes["v654_front_push"] = function(){
  var arr=['【战线·前推】'];
  arr.push('斥候回来报：东边那道岭，昨天还是对方的旗，今早换成了我们的。');
  arr.push('推进的速度比预想快。有人把马拴在界碑上，冲这边喊了一声。');
  return {place:'战线', text:function(){return arr;}, options:[{t:'继续推进', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_stall"] = function(){
  var arr=['【战线·僵持】'];
  arr.push('双方隔着一条河对骂了三天。谁先渡河谁吃亏，谁先退谁认怂。');
  arr.push('营地的火堆连成片，夜里看像一条焦灼的蛇。');
  return {place:'战线', text:function(){return arr;}, options:[{t:'回帅帐', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_fall"] = function(){
  var arr=['【战线·易手】'];
  arr.push('那座前哨堡的旗换了两回。最后一次换旗的时候，守军已经没几个人了。');
  arr.push('战报上写着：易手。战报底下有人用炭笔添了一行小字：堡里找到一坛没喝完的酒。');
  return {place:'战线', text:function(){return arr;}, options:[{t:'看下一处', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_cut"] = function(){
  var arr=['【战线·补给线断】'];
  arr.push('对方的骑兵绕到了后方，把运粮的道截了。');
  arr.push('前线的兵开始数着米下锅。伙夫说，再断三天，就只能杀马了。');
  if(S.worldState&&S.worldState.market&&S.worldState.market.grain) S.worldState.market.grain.demand=Math.min(100,(S.worldState.market.grain.demand||50)+5);
  return {place:'前线', text:function(){return arr;}, options:[{t:'回帅帐', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_reinforce"] = function(){
  var arr=['【战线·增援】'];
  arr.push('援军的旗子出现在山脊线上。先是几面，然后是几十面。');
  arr.push('营地里有人吹了声口哨，接着整条战线都活了过来。');
  return {place:'战线', text:function(){return arr;}, options:[{t:'迎接援军', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_burn"] = function(){
  var arr=['【战线·焚粮】'];
  arr.push('夜里对方烧了自家的粮仓——不是被偷袭，是他们自己点的。');
  arr.push('火光映红了半边天。烧粮的军官站在火前，说：不能留给攻过来的那帮人。');
  return {place:'战线', text:function(){return arr;}, options:[{t:'看火', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_front_city"] = function(){
  var arr=['【战线·城下】'];
  arr.push('战线推到城下了。城头的兵能看清我们脸上的灰。');
  arr.push('城门闭着。有人从城垛上扔下来一只草鞋，算是回应。');
  return {place:'城下', text:function(){return arr;}, options:[{t:'回帅帐', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_conquer"] = function(){
  var arr=['【目标·征服前哨】'];
  arr.push('帅案上摊着作战图，前哨的位置用朱笔圈了三圈。');
  arr.push('「打下来，这条线就算立住了。」参谋拿指节敲了敲地图。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'领命', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_burn"] = function(){
  var arr=['【目标·焚毁粮仓】'];
  arr.push('地图上，对方粮仓的位置画了一簇火。');
  arr.push('「烧了它，比杀一万个人都管用。」传令兵低声说。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'记下位置', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_capital"] = function(){
  var arr=['【目标·攻陷都城】'];
  arr.push('王都的城郭画在舆图正中，旁边写着四个字：兵临城下。');
  arr.push('那是终局。打到这里，谁输谁赢，史官都会写。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'看着那四个字', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_slay"] = function(){
  var arr=['【目标·斩将夺旗】'];
  arr.push('对方的名将最近在阵前晃得厉害。他的旗，是新的，还没沾过土。');
  arr.push('「斩了他，对面三天抬不起头。」老兵说。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'磨刀', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_starve"] = function(){
  var arr=['【目标·粮尽崩溃】'];
  arr.push('打蛇打七寸，对方是条靠粮养着的蛇。');
  arr.push('断它的道，堵它的河，耗到它自己张嘴认输。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'围而不打', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_attrition"] = function(){
  var arr=['【目标·消耗战】'];
  arr.push('这一仗不求快，求他先撑不住。');
  arr.push('参谋在地图上画了条线：「守住这条线，时间站在我们这边。」');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'守线', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_goal_done"] = function(){
  var arr=['【目标·达成】'];
  var ws=S.worldState;
  var w=null;
  if(ws&&ws.wars){ for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].goalDone){ w=ws.wars[i]; break; } } }
  if(w){ arr.push((w.goal?w.goal.cn:'目标')+'达成了：'+(w.goalText||''));
    arr.push('帅帐里传了一圈酒。有人拍了拍你的肩：「有你一份。」');
    if(S.warFame!==undefined) S.warFame+=5;
    if(w64_broadcast){ try{ w64_broadcast('战略目标', (w64_fname?w64_fname(w.a):w.a)+'的战争目标达成。', S.day||0); }catch(e){} }
  } else { arr.push('目标还没达成。地图上的朱笔圈还红着。'); }
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'回战略地图', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_arrive"] = function(){
  var arr=['【援军·抵达】'];
  arr.push('远方扬起烟尘，先是烟，后是旗，再后来是整支军队。');
  arr.push('盟友的将军翻身下马，靴子带起一片土：「来得不算晚吧？」');
  if(S.worldState){ var ws=S.worldState; if(ws.relations){ var f=ws.wars&&ws.wars.length?ws.wars[0]:null; if(f){ var k=(f.a<f.b)?(f.a+'-'+f.b):(f.b+'-'+f.a); if(ws.relations[k]!==undefined) ws.relations[k]=Math.min(100,(ws.relations[k]||0)+5); } } }
  return {place:'营外', text:function(){return arr;}, options:[{t:'接风', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_ambush"] = function(){
  var arr=['【援军·被伏】'];
  arr.push('援军走的是条近道。近道的意思，是对方也知道这条路。');
  arr.push('他们败着回来，旗少了三面。带队的将领脸上挂着彩，半天没说话。');
  return {place:'营外', text:function(){return arr;}, options:[{t:'收拢败兵', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_negotiate"] = function(){
  var arr=['【援军·谈判】'];
  arr.push('盟友的使者来了，不是来增援的，是来谈价钱的。');
  arr.push('「粮草算谁的？战利品怎么分？先说清楚，兵才好出。」使者喝了口茶，不紧不慢。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'谈', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_betray"] = function(){
  var arr=['【援军·反水】'];
  arr.push('半夜，盟友的营盘空了。');
  arr.push('桌案上留着一封信，信上只有一句话：「对不住，那边出的价更高。」');
  if(S.worldState&&S.worldState.relations){ var ws2=S.worldState; var war0=ws2.wars&&ws2.wars.length?ws2.wars[0]:null; if(war0){ var k2=(war0.a<war0.b)?(war0.a+'-'+war0.b):(war0.b+'-'+war0.a); if(ws2.relations[k2]!==undefined) ws2.relations[k2]=Math.max(-100,(ws2.relations[k2]||0)-10); } }
  return {place:'空营', text:function(){return arr;}, options:[{t:'收起那封信', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_march"] = function(){
  var arr=['【援军·开拔】'];
  arr.push('盟友的军队开拔了，马蹄声沿着大道响了一夜。');
  arr.push('走之前，他们的将军在营门口立了片刻，回头说：「守住了，来年请你喝酒。」');
  return {place:'营门', text:function(){return arr;}, options:[{t:'目送', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_ally_done"] = function(){
  var arr=['【援军·役毕】'];
  arr.push('战事歇了，盟友的军队要回去了。');
  arr.push('他们带走了伤亡的名册，留下了几车粮。领头的说：「仗打完了，交情还在。」');
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+1);
  return {place:'营外', text:function(){return arr;}, options:[{t:'送一程', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_treaty_offer"] = function(){
  var arr=['【和谈·提议】'];
  arr.push('对方的使者来了，带了一车礼物，和一纸停战的文书。');
  arr.push('「打下去没意思了。谈吧。」使者说这话时，眼睛一直盯着帅帐里的地图。');
  var opts=[{t:'谈', go:'v654_treaty_negotiate'},{t:'不谈，接着打', go:'v654_strategy_panel'}];
  return {place:'帅帐', text:function(){return arr;}, options:opts};
};

  
  nodes["v654_treaty_negotiate"] = function(){
  var arr=['【和谈·条款】'];
  arr.push('桌子两边，一边坐着武人，一边坐着使节。茶凉了三次。');
  arr.push('筹码摆开了：割地、赔款、联姻、裁军、质子——每一样都有人皱眉。');
  var opts=[
    {t:'割地（前线控制区归胜方）', go:'v654_treaty_cede'},
    {t:'赔款（分期偿付军费）', go:'v654_treaty_rep'},
    {t:'联姻（两家结亲止戈）', go:'v654_treaty_marry'},
    {t:'白和（各退一步，不赔不割）', go:'v654_treaty_white'}
  ];
  return {place:'帅帐', text:function(){return arr;}, options:opts};
};

  
  nodes["v654_treaty_cede"] = function(){
  var arr=['【条约·割地】'];
  arr.push('地图上，一条线划了过去。前线那几个据点，从此归了胜方。');
  arr.push('败方的使节签字的时候，笔尖在纸上顿了顿，洇开一个墨点。');
  if(S.worldState){ var ws=S.worldState; var w=ws.wars&&ws.wars.length?ws.wars[ws.wars.length-1]:null; if(w&&w.result&&w.result.winner){ var lf=w64.fid?w64.fid(w.result.loser):null; if(lf) lf.wealth=Math.max(0,(lf.wealth||0)-8); } }
  if(S.warFame!==undefined) S.warFame+=3;
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'画押', go:'v654_treaty_sign'}]};
};

  
  nodes["v654_treaty_rep"] = function(){
  var arr=['【条约·赔款】'];
  arr.push('赔款的数目写在纸上，双方各自看了一眼，都没有说话。');
  arr.push('「分四期。每期，一文都不能少。」胜方的文书官把算盘拨得噼啪响。');
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'画押', go:'v654_treaty_sign'}]};
};

  
  nodes["v654_treaty_marry"] = function(){
  var arr=['【条约·联姻】'];
  arr.push('两家结了亲。嫁妆是几车粮，聘礼是几面旗。');
  arr.push('成婚那天，两边的兵隔着一条街对饮，谁也没提打仗的事。');
  if(S.worldState){ var ws2=S.worldState; if(ws2.wars&&ws2.wars.length){ var w2=ws2.wars[0]; if(w2&&w2.result){ var k2=(w2.a<w2.b)?(w2.a+'-'+w2.b):(w2.b+'-'+w2.a); if(ws2.relations&&ws2.relations[k2]!==undefined) ws2.relations[k2]=Math.min(100,(ws2.relations[k2]||0)+15); } } }
  return {place:'婚宴', text:function(){return arr;}, options:[{t:'举杯', go:'v654_treaty_sign'}]};
};

  
  nodes["v654_treaty_white"] = function(){
  var arr=['【条约·白和】'];
  arr.push('白和。不赔款，不割地，各回各的营。');
  arr.push('死的人，就白死了。这句话谁也没说出口，但每个人心里都有。');
  if(S.worldState){ var ws3=S.worldState; if(ws3.wars&&ws3.wars.length){ var w3=ws3.wars[0]; if(w3&&w3.result){ var k3=(w3.a<w3.b)?(w3.a+'-'+w3.b):(w3.b+'-'+w3.a); if(ws3.relations&&ws3.relations[k3]!==undefined) ws3.relations[k3]=Math.max(-100,(ws3.relations[k3]||0)+5); } } }
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'各自收兵', go:'v654_treaty_sign'}]};
};

  
  nodes["v654_treaty_sign"] = function(){
  var arr=['【条约·画押】'];
  arr.push('笔落下去，纸上的墨还没干，两边的传令兵已经各自奔向大营。');
  arr.push('停战了。营地里开始有人生火做饭，火是近几年头一回不带烟。');
  return {place:'和谈席', text:function(){return arr;}, options:[{t:'回帅帐', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_treaty_tear"] = function(){
  var arr=['【条约·撕毁】'];
  arr.push('和约签了，但有人不服。');
  arr.push('夜里，那份文书被从帐中扔出来，落在泥地里。第二天早上，它被人捡起来，擦了擦，又放回了案上。');
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'捡起来', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_treaty_done"] = function(){
  var arr=['【条约·落地】'];
  arr.push('条约誊了三份：一份存史馆，一份送都城，一份留在军中。');
  arr.push('史官蘸了墨，抬头问：「这场仗，怎么记？」');
  arr.push('没人答他。');
  return {place:'史馆', text:function(){return arr;}, options:[{t:'由他记', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_defeat_flee"] = function(){
  var arr=['【战败·溃逃】'];
  arr.push('阵线垮了。旗还在手里，人已经四散。');
  arr.push('你随着人流跑。有人在后面喊你的名字，你没回头。');
  if(S.warFame!==undefined) S.warFame=Math.max(0,(S.warFame||0)-3);
  return {place:'野地', text:function(){return arr;}, options:[{t:'跑出去', go:'v654_defeat_done'}]};
};

  
  nodes["v654_defeat_captive"] = function(){
  var arr=['【战败·被俘】'];
  arr.push('你被按在泥地里，脸贴着一片枯草。有人把刀架在你脖子上，问你叫什么。');
  arr.push('你报了名字。那人笑了：「这个名字值多少钱？」');
  return {place:'敌营', text:function(){return arr;}, options:[{t:'沉默', go:'v654_defeat_ransom'}]};
};

  
  nodes["v654_defeat_ransom"] = function(){
  var arr=['【战败·赎回】'];
  arr.push('赎金是家里人凑的。送钱来的人放下钱袋就走，没多看你一眼。');
  arr.push('你走出敌营的时候，天阴着。你数了数自己身上的伤，一共七处。');
  if(S.gold!==undefined) S.gold=Math.max(0,(S.gold||0)-80);
  if(S.warScars){ }
  return {place:'敌营外', text:function(){return arr;}, options:[{t:'回家', go:'v654_defeat_done'}]};
};

  
  nodes["v654_defeat_join"] = function(){
  var arr=['【战败·降军】'];
  arr.push('有人劝你投了那边：「识时务者，不必陪他殉葬。」');
  arr.push('你站在两军之间，脚下的土还是湿的。你问他：「那边，还认人吗？」');
  return {place:'两军之间', text:function(){return arr;}, options:[{t:'降', go:'v654_defeat_done'},{t:'不降', go:'v654_defeat_flee'}]};
};

  
  nodes["v654_defeat_die"] = function(){
  var arr=['【战败·殉国】'];
  arr.push('你走不了了。你靠在半截断墙上，把旗子插在身边。');
  arr.push('对方围上来，但没有动手。有人问：「值吗？」');
  arr.push('你没回答。旗子在风里响了一下。');
  if(S.militaryCareer&&S.militaryCareer.trauma){ S.militaryCareer.trauma.kinds.grief=(S.militaryCareer.trauma.kinds.grief||0)+1; S.militaryCareer.trauma.day=S.day||0; }
  if(S.hp!==undefined) S.hp=Math.max(1,S.hp-25);
  return {place:'断墙', text:function(){return arr;}, options:[{t:'闭眼', go:'v654_defeat_done'}]};
};

  
  nodes["v654_defeat_done"] = function(){
  var arr=['【战败·之后】'];
  arr.push('仗打完了。你活着，这是眼下唯一确定的事。');
  arr.push('活着的人开始收拾东西。有人捡起一面断旗，卷了卷，揣进怀里。');
  return {place:'战后', text:function(){return arr;}, options:[{t:'回帅帐', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_repar_panel"] = function(){
  var arr=['【赔款账册】'];
  var ws=S.worldState, found=false;
  if(ws&&ws.wars){
    for(var i=0;i<ws.wars.length;i++){
      var w=ws.wars[i];
      if(w.treaty&&w.treaty.repar>0&&!w.reparDone){
        found=true;
        arr.push('—— '+(w64_fname?w64_fname(w.result.loser||w.b):'败方')+' 赔款 '+w.treaty.repar+' ——');
        arr.push('已到账 '+(w.reparCount||0)+' 期。'+((w.reparCount||0)>=4?'偿清。':'还在分期。'));
      }
    }
  }
  if(!found) arr.push('账册上干干净净。没有人欠你钱，你也不欠别人。');
  return {place:'账房', text:function(){return arr;}, options:[{t:'合上账册', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_repar_arrive"] = function(){
  var arr=['【赔款·到账】'];
  arr.push('押款的车队到了，车轮在土路上压出深辙。');
  arr.push('文书官点完数目，抬头说了句：「一分不少。」');
  if(S.gold!==undefined){ var w=null; if(S.worldState&&S.worldState.wars){ for(var i=0;i<S.worldState.wars.length;i++){ if(S.worldState.wars[i].treaty&&!S.worldState.wars[i].reparDone){ w=S.worldState.wars[i]; break; } } } if(w&&w.result&&w.result.winner){ var per=Math.max(5,Math.ceil(w.treaty.repar/4)); S.gold+=Math.min(30,Math.floor(per/2)); } }
  return {place:'账房', text:function(){return arr;}, options:[{t:'入库', go:'v654_repar_panel'}]};
};

  
  nodes["v654_repar_delay"] = function(){
  var arr=['【赔款·拖欠】'];
  arr.push('这一期没来。文书官等了一个月，账上还是空的。');
  arr.push('「他们说，今年年成不好，先欠着。」文书官把信纸递过来，纸角卷着。');
  return {place:'账房', text:function(){return arr;}, options:[{t:'压一压', go:'v654_repar_panel'}]};
};

  
  nodes["v654_repar_debt"] = function(){
  var arr=['【赔款·债务】'];
  arr.push('欠的赔款像滚雪球，越滚越大。对方开始拿东西抵：几车皮货，一队工匠，一纸矿脉的文书。');
  arr.push('「拿这些顶账？」文书官看了半天，说：「行吧，总比没有强。」');
  return {place:'账房', text:function(){return arr;}, options:[{t:'收下', go:'v654_repar_panel'}]};
};

  
  nodes["v654_repar_bond"] = function(){
  var arr=['【赔款·债券】'];
  arr.push('军中发了一种债券：押着未来的赔款，先兑现金。');
  arr.push('买的人不少。有老兵把攒的饷银全压了上去，说：「跟着打下来的，亏不了。」');
  if(S.v65Heard&&S.v65Heard.warBond&&S.day){ var b=S.v65Heard.warBond; if(S.day-b.day>=42&&S.gold!==undefined){ var pay=60+Math.floor(Math.random()*60); S.gold+=pay; arr.push('债券到期，你兑了 '+pay+' 金。'); if(w64_broadcast){ try{ w64_broadcast('战争债券', '你押的战争债券到期了，兑回了本息。', S.day||0); }catch(e){} } } }
  return {place:'账房', text:function(){return arr;}, options:[{t:'收好债票', go:'v654_repar_panel'}]};
};

  
  nodes["v654_repar_done"] = function(){
  var arr=['【赔款·偿清】'];
  arr.push('最后一期到了。文书官在账册上划了一道线，把册子合上。');
  arr.push('「清了。」他说，「这笔账，两清了。」');
  arr.push('账清了，仇未必清。这话他没说。');
  return {place:'账房', text:function(){return arr;}, options:[{t:'盖章', go:'v654_repar_panel'}]};
};

  
  nodes["v654_action_burn"] = function(){
  var arr=['【行动·烧粮线】'];
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){
    arr.push('你带着一队人摸到对方粮道，火折子一吹，半边粮车烧了起来。');
    arr.push('对方来救火，你们已经撤了。回营时天刚亮，靴子上全是灰。');
    if(S.warFame!==undefined) S.warFame+=4;
    if(S.worldState&&S.worldState.wars){ var w=S.worldState.wars[0]; if(w) w.supplyB=Math.max(0,(w.supplyB||0)-15); }
  } else {
    arr.push('火折子还没点着，巡夜的兵就来了。你们跑了一夜，什么也没烧着。');
    if(S.hp!==undefined) S.hp=Math.max(1,S.hp-5);
  }
  return {place:'敌后', text:function(){return arr;}, options:[{t:'回营', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_action_raid"] = function(){
  var arr=['【行动·劫粮队】'];
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){
    arr.push('对方押粮的队伍不长。你们从两边的坡上冲下去，赶在援兵到之前抢走了三车粮。');
    arr.push('回营的路上，有人分了你一块干粮，还热着。');
    if(S.gold!==undefined) S.gold+=30;
    if(S.worldState&&S.worldState.wars){ var w=S.worldState.wars[0]; if(w) w.supplyB=Math.max(0,(w.supplyB||0)-10); }
  } else {
    arr.push('押粮的队伍比想象的长。你们没敢动手，远远看着车辙消失在暮色里。');
  }
  return {place:'野地', text:function(){return arr;}, options:[{t:'回营', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_action_duel"] = function(){
  var arr=['【行动·邀战】'];
  var r=window.v652_duelRoll?v652_duelRoll():60;
  if(r>=70){
    arr.push('你在阵前叫阵，对方的名将出来了。三合之内，你挑飞了他的枪。');
    arr.push('他退回去的时候，旗没倒，但人矮了一截。');
    if(S.warFame!==undefined) S.warFame+=6;
    if(S.worldState&&S.worldState.wars){ var w=S.worldState.wars[0]; if(w&&!w.slayDone){ w.slayDone=true; } }
  } else {
    arr.push('对方没应战。城头上的人喊话：「将军说了，阵前斗将，是小孩子的把戏。」');
  }
  return {place:'阵前', text:function(){return arr;}, options:[{t:'回营', go:'v654_strategy_panel'}]};
};

  
  nodes["v654_action_scout"] = function(){
  var arr=['【行动·侦察】'];
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){
    arr.push('你摸清了对方营盘的虚实：帐篷三百顶，粮垛七座，辕门换防的时辰是丑时。');
    arr.push('这份情报递到帅帐，参谋看了半天：「够用。」');
    if(S.warFame!==undefined) S.warFame+=3;
  } else {
    arr.push('你只看到个大概。回来的时候，斥候队长说：「下次别一个人去。」');
    if(S.hp!==undefined) S.hp=Math.max(1,S.hp-3);
  }
  return {place:'帅帐', text:function(){return arr;}, options:[{t:'复命', go:'v654_strategy_panel'}]};
};









  
  nodes["v653_bounty_list"] = function(){
  var arr=['【悬赏榜】'];
  var f=window.v653_fameLevel?v653_fameLevel():{cn:'野路子'};
  arr.push('你是'+f.cn+'。公会里贴满了单子，墨迹有新旧。');
  var opts=[];
  for(var k in W653_BOUNTY){
    var B=W653_BOUNTY[k];
    var locked=(B.minRank&&(S.mercenary.rank||0)<B.minRank);
    opts.push({t:(B.cn+'（'+B.reward+'金/名望'+B.fame+'）'+(locked?'·需名望'+B.minRank:'')), go:locked?'v653_bounty_deny':('v653_bounty_'+B.id)});
  }
  opts.push({t:'回公会', go:'v65_camp'});
  return {place:'佣兵公会', text:function(){return arr;}, options:opts};
};

  
  
  nodes["v653_bounty_deny"] = function(){
  var arr=['那人上下打量你一眼：「这单，你还接不了。」'];
  return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去看别的单', go:'v653_bounty_list'}]};
};

  
  
  nodes["v653_bounty_garrison"] = function(){
  var arr=['【协防城防】某城缺人守垛口，三天。'];
  if(window.v653_bountyTake&&!v653_bountyTake('garrison')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  arr.push('你接了单。城头上风大，垛口被撞松的地方还没来得及修。');
  arr.push('三天后，你活着下来了，手指冻得握不住刀。');
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'城头', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_escort"] = function(){
  var arr=['【护送商队】东境到自由港，路上不太平。'];
  if(window.v653_bountyTake&&!v653_bountyTake('escort')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  arr.push('商队老板话多，一路讲他女儿在自由港开了家布店。');
  if(r>=60){ arr.push('遇上一伙劫道的，你砍翻了两个，剩下的跑了。老板连夜给你加了钱。'); }
  else { arr.push('半夜丢了匹驮货的骡子。老板唉声叹气，没怪你。'); }
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'自由港', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_raid"] = function(){
  var arr=['【攻寨】拔掉山口那座匪寨。'];
  if(window.v653_bountyTake&&!v653_bountyTake('raid')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('寨子里的头目是个老兵，断了一条腿。你攻上去的时候，他坐在桌边没动。'); arr.push('「来得正好，我早不想干这个了。」'); }
  else { arr.push('寨子打下来一半，匪首带着人从后山跑了。你烧了寨子，好歹算是拔了。'); }
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'山口', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_kill"] = function(){
  var arr=['【灭口】有人出一大笔钱，要一个人永远闭嘴。'];
  if(window.v653_bountyTake&&!v653_bountyTake('kill')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('你找到那人的时候，他正在给孩子修秋千。'); arr.push('你站了很久，最后收了刀。单子，你打算回去退掉。'); S.mercenary.contracts[S.mercenary.contracts.length-1].status='失败'; S.mercenary.rank=Math.max(0,(S.mercenary.rank||0)-2); if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+1); }
  else { arr.push('你做了这笔买卖。钱很干净，手不干净。'); if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+3); if(S.corruption!==undefined) S.corruption=Math.min(100,(S.corruption||0)+2); S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成'; }
  return {place:'巷子', text:function(){return arr;}, options:[{t:'回公会', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_ruin"] = function(){
  var arr=['【探索废墟】打完仗的城，总有人惦记城底下的东西。'];
  if(window.v653_bountyTake&&!v653_bountyTake('ruin')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  arr.push('废墟里灰很大。你翻出一箱旧账册，和一坛没开封的酒。');
  arr.push('酒还能喝。你带回来了。');
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'废墟', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_arms"] = function(){
  var arr=['【押运军械】一批军械要送到前线，缺个押运的。'];
  if(window.v653_bountyTake&&!v653_bountyTake('arms')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  arr.push('车辙很深，装的是铁。路上你数了三回，一件没少。');
  arr.push('交接的军需官看了一眼单子，递给你一壶酒：「路上辛苦。」');
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'前线', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_scout"] = function(){
  var arr=['【斥候侦察】摸清敌营的虚实，回来报个数。'];
  if(window.v653_bountyTake&&!v653_bountyTake('scout')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('你数清了：营帐三百顶，粮垛十七座。回来时天刚亮。'); }
  else { arr.push('你被巡夜的发现了，跑了半夜。只数到个大概。'); if(S.hp!==undefined) S.hp=Math.max(1,S.hp-5); }
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'敌营外', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_assassin"] = function(){
  var arr=['【刺杀】有张单子，画像上的将军值一千金。'];
  if(window.v653_bountyTake&&!v653_bountyTake('assassin')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=window.v652_duelRoll?v652_duelRoll():60;
  if(r>=70){ arr.push('你混进军营，等了三天。那一刀很快，他死前没认出你。'); arr.push('你拿着画像去领赏，纸上的脸已经被血洇糊了。'); S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成'; if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+5); if(S.corruption!==undefined) S.corruption=Math.min(100,(S.corruption||0)+3); }
  else { arr.push('失手了。你从窗口翻出去的时候，箭擦着耳朵飞过去。'); arr.push('这单，你打算先放一放。'); if(S.hp!==undefined) S.hp=Math.max(1,S.hp-15); S.mercenary.contracts[S.mercenary.contracts.length-1].status='进行'; }
  return {place:'军营外', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_rescue"] = function(){
  var arr=['【营救】有个被俘的同袍，家属筹了钱，要把他弄出来。'];
  if(window.v653_bountyTake&&!v653_bountyTake('rescue')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('你买通了一个狱卒，把人从墙根送了出去。他走的时候，抓了抓你的手，什么也没说。'); }
  else { arr.push('赎金不够，狱卒不肯放。你只能先把话带回去。'); }
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'牢墙外', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_intel"] = function(){
  var arr=['【窃取军情】有人要一份前线的布防图。'];
  if(window.v653_bountyTake&&!v653_bountyTake('intel')){ arr.push('你已经接了这单。'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回去', go:'v653_bounty_list'}]}; }
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('布防图到手。你抄了一份，原样放了回去。'); arr.push('买家验货时手都在抖——这图能要人命。'); }
  else { arr.push('你只弄到半张。买家付了半价，说：「够用了。」'); }
  S.mercenary.contracts[S.mercenary.contracts.length-1].status='完成';
  return {place:'暗巷', text:function(){return arr;}, options:[{t:'回公会交单', go:'v653_bounty_finish'}]};
};

  
  
  nodes["v653_bounty_finish"] = function(){
  var arr=['【交单结算】'];
  var out=window.v653_bountyFinish?v653_bountyFinish():null;
  if(!out||!out.length){ arr.push('你没有可交的单。公会柜台后的老头掀了掀眼皮：「没事别挡着。」'); return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'回公会', go:'v65_camp'}]}; }
  var gold=0, fame=0;
  for(var i=0;i<out.length;i++){ gold+=out[i].reward||0; fame+=out[i].fame||0; }
  arr.push('你交上单子。老头数了数钱，推过来：'+gold+'金。');
  arr.push('名望 +'+fame+'。公会里有人冲你点了点头。');
  return {place:'佣兵公会', text:function(){return arr;}, options:[{t:'收钱', go:'v65_camp'}]};
};

  
  
  nodes["v653_deal_panel"] = function(){
  var arr=['【倒卖机会】'];
  var deals=S.mercenary.deals||[];
  if(!deals.length){ arr.push('市场上暂时没有好机会。'); return {place:'集市', text:function(){return arr;}, options:[{t:'回去', go:'v65_camp'}]}; }
  var d=deals[0];
  arr.push(d.cn+'：现价 '+d.price+'，目标价 '+d.target+'（'+(d.dir==='up'?'看涨':'看跌')+' '+d.gap+'%）');
  var opts=[];
  if(d.id==='arms'||d.id==='grain') opts.push({t:'低买高卖，吃这波差价', go:'v653_deal_sell_arms'});
  if(d.id==='grain') opts.push({t:'囤粮待涨', go:'v653_deal_hoard'});
  if(d.id==='grain') opts.push({t:'平价赈济，不赚这份钱', go:'v653_deal_relief'});
  if(d.id==='herb'||d.id==='abyssm') opts.push({t:'倒一手', go:'v653_deal_sell_arms'});
  opts.push({t:'不碰', go:'v65_camp'});
  return {place:'集市', text:function(){return arr;}, options:opts};
};

  
  
  nodes["v653_deal_sell_arms"] = function(){
  var arr=[]; window.v653_dealSettle?v653_dealSettle('sell_arms'):null;
  arr.push('你把手里的货倒了出去。钱进袋的时候，称了一下，比想象中沉。');
  arr.push('（恶名+2。市场上少了一批货，价开始往上爬。）');
  return {place:'集市', text:function(){return arr;}, options:[{t:'离市', go:'v65_camp'}]};
};

  
  
  nodes["v653_deal_hoard"] = function(){
  var arr=[]; window.v653_dealSettle?v653_dealSettle('hoard'):null;
  arr.push('你囤了粮，等价涨。');
  arr.push('夜里听见城里有孩子饿哭，你把窗户关上了。');
  return {place:'粮仓', text:function(){return arr;}, options:[{t:'守着粮仓', go:'v65_camp'}]};
};

  
  
  nodes["v653_deal_relief"] = function(){
  var arr=[]; window.v653_dealSettle?v653_dealSettle('relief'):null;
  arr.push('你把粮平价放了出去。队伍排了三条街。');
  arr.push('有个老太太往你手里塞了两个鸡蛋：「家里就剩这个了，拿着。」');
  return {place:'粥棚', text:function(){return arr;}, options:[{t:'收下鸡蛋', go:'v65_camp'}]};
};



  
  
  nodes["v653_pt_ruin1"] = function(){
  var arr=['【废墟】你回到这座城。'];
  arr.push('断墙下压着半截门板，门板上还有没擦干净的名字。');
  arr.push('有人跪在瓦砾里刨东西，刨出来的是一双小孩的鞋。');
  return {place:'废墟', text:function(){return arr;}, options:[
    { t:'帮着挖', go:'v653_pt_ruin2' },
    { t:'绕着走', go:'v65_camp' }
  ]};
};

  
  
  nodes["v653_pt_ruin2"] = function(){
  var arr=['你挖了一下午。'];
  arr.push('挖出来的没几件完好的。有人把一坛酒埋在墙角，说是等找到人再喝。');
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+2);
  if(S.deity!==undefined) S.deity=Math.min(100,(S.deity||0)+1);
  return {place:'废墟', text:function(){return arr;}, options:[{ t:'继续搜', go:'v653_pt_ruin3' }]};
};

  
  
  nodes["v653_pt_ruin3"] = function(){
  var arr=['天快黑了，你听见墙根底下有动静。'];
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('是个孩子，缩在塌了的灶台底下，饿得说不出话。'); arr.push('你把他抱出来。他咬了你胳膊一口，然后哭了。'); if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+3); }
  else { arr.push('是只野狗。它看了你一眼，走了。'); }
  arr.push('城还没死透。');
  return {place:'废墟', text:function(){return arr;}, options:[{ t:'离开', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_refugee1"] = function(){
  var arr=['【难民】城门口挤满了人，拖家带口。'];
  arr.push('有个女人抱着孩子，站在队伍里，孩子的脸烧得通红。');
  return {place:'城门口', text:function(){return arr;}, options:[
    { t:'设粥棚', go:'v653_pt_refugee2' },
    { t:'维持秩序', go:'v653_pt_refugee3' }
  ]};
};

  
  
  nodes["v653_pt_refugee2"] = function(){
  var arr=['你支了一口大锅。'];
  arr.push('米下锅的时候，队伍往前挪了挪。有人小声说了一句「谢谢」，声音很快被嘈杂盖住。');
  if(S.gold!==undefined) S.gold=Math.max(0,S.gold-20);
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+3);
  if(S.deity!==undefined) S.deity=Math.min(100,(S.deity||0)+2);
  return {place:'粥棚', text:function(){return arr;}, options:[{ t:'继续施粥', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_refugee3"] = function(){
  var arr=['几个流民想插队，被守城的兵拦住。'];
  arr.push('你走过去，什么都没说，站在了队伍尾巴上。');
  arr.push('队伍安静下来。');
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+1);
  return {place:'城门口', text:function(){return arr;}, options:[{ t:'排着', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_orphan1"] = function(){
  var arr=['【孤儿】巷子里一群孩子，大的带小的，眼睛都饿得发亮。'];
  arr.push('最大的那个十一二岁，手里攥着一截磨尖的树枝。');
  return {place:'巷子', text:function(){return arr;}, options:[
    { t:'收容他们', go:'v653_pt_orphan2' },
    { t:'送孤儿院', go:'v653_pt_orphan3' }
  ]};
};

  
  
  nodes["v653_pt_orphan2"] = function(){
  var arr=['你把孩子们带到了空出来的营房。'];
  arr.push('他们先是不敢进，后来挤成一团，蹲在墙角。');
  arr.push('最大的那个把磨尖的树枝别在腰上，没松手。');
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+3);
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.supply=Math.max(0,(S.militaryCareer.unit.supply||0)-3);
  return {place:'营房', text:function(){return arr;}, options:[{ t:'给他们留饭', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_orphan3"] = function(){
  var arr=['你把孩子们送去了城里的孤儿院。'];
  arr.push('院长是个瘸腿老兵，数了数人头：「院子小，挤挤能住。」');
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+2);
  return {place:'孤儿院', text:function(){return arr;}, options:[{ t:'留下些钱', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_veteran1"] = function(){
  var arr=['【老兵】街角的墙根下坐着几个老兵，军服洗得发白。'];
  arr.push('其中一个少了一条胳膊，袖管打了个结。他看见你，眯了眯眼。');
  return {place:'街角', text:function(){return arr;}, options:[
    { t:'请他们喝酒', go:'v653_pt_veteran2' },
    { t:'问他们愿不愿意跟我干', go:'v653_pt_veteran3' }
  ]};
};

  
  
  nodes["v653_pt_veteran2"] = function(){
  var arr=['你拎了两坛酒过去。'];
  arr.push('老兵们没推辞。喝到一半，断胳膊的那个说：「打完仗，谁记得我们。」');
  arr.push('你没接话，给他满上。');
  if(S.gold!==undefined) S.gold=Math.max(0,S.gold-10);
  if(S.militaryCareer) S.militaryCareer.morale=Math.min(100,(S.militaryCareer.morale||70)+3);
  return {place:'街角', text:function(){return arr;}, options:[{ t:'干杯', go:'v65_camp' }]};
};

  
  
  nodes["v653_pt_veteran3"] = function(){
  var arr=['你问他们愿不愿意跟着你干。'];
  arr.push('断胳膊的老兵把酒碗放下：「跟着你，还打仗？」');
  arr.push('你点头。他想了想：「那行。反正闲着也是闲着。」');
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.size=(S.militaryCareer.unit.size||0)+8;
  if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+1);
  return {place:'街角', text:function(){return arr;}, options:[{ t:'收下他们', go:'v65_camp' }]};
};

  
  
  nodes["v653_scar_church"] = function(){
  var arr=['你在教堂里跪下来。'];
  var he=window.v653_scarHeal?v653_scarHeal('church'):false;
  var ok=(S.job&&S.job.indexOf('牧师')>=0)||(S.deity||0)>=30;
  if(!ok){ arr.push('神父看了你一眼：「孩子，你心里的事，得先说出来。」你张了张嘴，没说出来。'); return {place:'教堂', text:function(){return arr;}, options:[{ t:'离开', go:'v65_camp' }]}; }
  if(he){ arr.push('神父念了一段经文。你听不懂，但肩膀松了一点。'); arr.push('（创伤减轻。那副担子轻了些。）'); }
  else { arr.push('神父说你心里还算干净。你不太信，但也没反驳。'); }
  return {place:'教堂', text:function(){return arr;}, options:[{ t:'起身', go:'v65_camp' }]};
};

  
  
  nodes["v653_scar_veteran_talk"] = function(){
  var arr=['夜里，你找到那个断胳膊的老兵，坐在墙根下。'];
  arr.push('他听你说完，闷了一口酒：「我打完第一场仗，吐了三天。后来就习惯了——不是习惯了死人，是习惯了不哭。」');
  var he=window.v653_scarHeal?v653_scarHeal('veteran'):false;
  if(he){ arr.push('他拍拍你肩膀：「能说出来，就还没坏透。」'); }
  return {place:'墙根', text:function(){return arr;}, options:[{ t:'沉默地喝酒', go:'v65_camp' }]};
};

  
  
  nodes["v653_scar_face"] = function(){
  var arr=['【记忆】你闭上眼，那张脸还在。'];
  arr.push('是屠城那天，巷子深处一张孩子的脸。他盯着你，像要把你的样子刻进骨头里。');
  arr.push('你醒过来，枕头湿了一片。');
  if(S.san!==undefined) S.san=Math.max(1,(S.san||50)-5);
  return {place:'营帐', text:function(){return arr;}, options:[{ t:'坐等天亮', go:'v65_camp' }]};
};

  
  
  nodes["v653_karma_orphan"] = function(){
  var arr=['酒馆里有人说起你的事。'];
  arr.push('「当年那座城，有个孩子活下来了。如今他长大了，腰里别着一把短刀，到处打听一个名字。」');
  arr.push('那个人没敢说名字。但你知道是谁。');
  if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+2);
  return {place:'酒馆', text:function(){return arr;}, options:[{ t:'把酒喝完', go:'v65_camp' }]};
};

  
  
  nodes["v653_karma_refugee"] = function(){
  var arr=['一个难民找到你，塞给你一张纸条。'];
  arr.push('「当年你放过的那批人里，有个在敌营当伙夫。这是他画的防线图——你拿好。」');
  if(S.mercenary&&S.mercenary.deals){ S.mercenary.deals.push({id:'arms',cn:'军械',dir:'up',gap:30,day:S.day||0,base:22,price:20,target:26}); }
  return {place:'集市', text:function(){return arr;}, options:[{ t:'收下纸条', go:'v65_camp' }]};
};

  
  
  nodes["v653_karma_black"] = function(){
  var arr=['夜里有人敲门，是个黑衣商人。'];
  arr.push('「听说你手上有路数。」他推过来一袋钱：「深渊材料，有多少收多少。」');
  if(S.mercenary&&S.mercenary.deals){ S.mercenary.deals.push({id:'abyssm',cn:'深渊材料',dir:'up',gap:45,day:S.day||0,base:40,price:38,target:55}); }
  return {place:'客栈', text:function(){return arr;}, options:[{ t:'收下钱袋', go:'v65_camp' }]};
};

  
  
  nodes["v653_karma_revenge"] = function(){
  var arr=['【仇家】你被盯上了。'];
  arr.push('夜里回营的路上，背后有人跟了你三条街。你停下，他也停下。');
  var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('你反身截住他。他年轻，手抖：「你……你杀了我爹。」'); arr.push('你看着他。他跑了。你站在原地，很久没动。'); if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+1); }
  else { arr.push('他扑上来，你闪开，他撞在墙上，爬不起来。你走了。'); }
  return {place:'夜路', text:function(){return arr;}, options:[{ t:'回营', go:'v65_camp' }]};
};


  
  
  nodes["v652_general_panel_node"] = function(){
  var arr=['【随军强者】'];
  var mc=S.militaryCareer;
  if(!mc){ arr.push('你还没投军。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  var gs=mc.generals||[];
  if(!gs.length){ arr.push('你帐下还没有强者随军。名将不轻许，先让他们记住你的名字。'); }
  else {
    for(var i=0;i<gs.length;i++){
      var g=gs[i];
      arr.push('· '+v652_strongName(g.strongId)+'（'+g.role+'）忠诚'+g.loyalty+'　'+g.state);
    }
  }
  arr.push('（随军名额：'+gs.length+'/'+(window.v652_generalCap?v652_generalCap():0)+'）');
  var opts=[];
  if((mc.generals?mc.generals.length:0)<(window.v652_generalCap?v652_generalCap():6)) opts.push({ t:'点名出征', go:'v652_general_recruit_node' });
  if(mc.captives&&mc.captives.length) opts.push({ t:'处置俘虏（'+mc.captives.length+'）', go:'v652_captive' });
  opts.push({ t:'回战争面板', go:'v652_war_return2' });
  return {place:'军营', text:function(){return arr;}, options:opts};
};

  
  
  
  nodes["v652_war_return2"] = function(){
  var arr=['你回到军务处。'];
  return {place:'军务处', text:function(){return arr;}, options:[{ t:'继续', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_general_recruit_node"] = function(){
  var arr=['名册摊开，墨迹未干。你一个个想过去——'];
  var cand=window.v652_generalCandidates?v652_generalCandidates():[];
  if(!cand.length){ arr.push('没有人愿意来。要么他们还不认识你，要么你帐下已满。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]}; }
  var roles=['先锋','军师','宿将'];
  var opts=[];
  for(var i=0;i<cand.length&&i<6;i++){
    var f=cand[i], role=roles[Math.floor(Math.random()*roles.length)];
    opts.push({ t:('邀 '+f.cn+'（'+role+'）'), go:'v652_gen_recruit_done' });
  }
  opts.push({ t:'算了', go:'v652_general_panel_node' });
  return {place:'军营', text:function(){return arr;}, options:opts};
};

  
  
  
  nodes["v652_gen_recruit_done"] = function(){
  var arr=['你递了名帖。'];
  var cand=window.v652_generalCandidates?v652_generalCandidates():[];
  if(!cand.length){ arr.push('那人摇了摇头：还是先把你自己的仗打赢再说吧。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]}; }
  var f=cand[0];
  var ok=window.v652_generalRecruit?v652_generalRecruit(f.id, '宿将'):false;
  if(ok){
    arr.push(f.cn+'收下了名帖，扎进你的营帐。他不多话，只是把行囊放在火堆边。');
    arr.push('你多了一个可以托付后背的人。');
  } else {
    arr.push('他婉拒了：「我还有自己的事没做完。」');
  }
  return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]};
};

  
  
  
  nodes["v652_duel_challenge"] = function(){
  var arr=['对面阵前出来一个人，拍马横枪，点名要见你。'];
  var e=window.v652_enemyStrong?v652_enemyStrong():null;
  arr.push(e?('他报了名字：'+e.cn+'。全场都听见了。'):'他报了名字。全场都听见了。');
  var hasGen=(S.militaryCareer&&S.militaryCareer.generals&&S.militaryCareer.generals.length)?true:false;
  var opts=[{ t:'应战', go:'v652_duel_fight' }];
  if(hasGen) opts.push({ t:'遣将替战', go:'v652_duel_sub' });
  opts.push({ t:'避战', go:'v652_duel_avoid' });
  return {place:'阵前', text:function(){return arr;}, options:opts};
};

  
  
  
  nodes["v652_duel_fight"] = function(){
  var r=window.v652_duelRoll?v652_duelRoll():60;
  if(r>=60){ return {place:'阵前', text:function(){return ['你赢了。'];}, options:[{ t:'回阵', go:'v652_duel_win' }]}; }
  return {place:'阵前', text:function(){return ['你输了，只输半招。'];}, options:[{ t:'回阵', go:'v652_duel_lose' }]};
};

  
  
  
  nodes["v652_duel_win"] = function(){
  var arr=['枪尖一沉，你挑飞了他的兵器。他看了你一眼，没说话，退回去了。'];
  arr.push('身后是整片阵的欢呼。');
  S.warFame=(S.warFame||0)+10;
  if(S.militaryCareer&&S.militaryCareer.generals&&S.militaryCareer.generals[0]) S.militaryCareer.generals[0].deeds.duel++;
  var mc=S.militaryCareer; if(mc&&mc.morale!==undefined) mc.morale=Math.min(100,mc.morale+5);
  var r=Math.random();
  if(r<0.4){ arr.push('你斩下了对方的战旗。旗杆断在手里，旗面被风扯走了一半。'); }
  else if(r<0.7){ arr.push('俘虏的口供里，提到对面粮道上的一个缺口。'); }
  else { arr.push('敌阵里有人喊了一声你的名字，声音发颤。'); }
  var opts=[{ t:'收兵回营', go:'v65_battle_clash2' }];
  if(mc&&mc.captives&&Math.random()<0.5){ mc.captives.push({strongId:'enemy_'+Math.floor(Math.random()*900+100),name:'敌将',realm:5}); arr.push('（敌方有一名将领被生擒，押在营中。）'); opts.unshift({ t:'处置俘虏', go:'v652_captive' }); }
  return {place:'阵前', text:function(){return arr;}, options:opts};
};

  
  
  
  nodes["v652_duel_lose"] = function(){
  var arr=['你输了半招。对面的人没有补刀，只是看了你一眼：「回去练练，你还有的学。」'];
  if(S.hp!==undefined) S.hp=Math.max(1,S.hp-20);
  if(S.militaryCareer&&S.militaryCareer.morale!==undefined) S.militaryCareer.morale=Math.max(10,S.militaryCareer.morale-10);
  return {place:'阵前', text:function(){return arr;}, options:[{ t:'回阵', go:'v65_battle_clash2' }]};
};

  
  
  
  nodes["v652_duel_sub"] = function(){
  var arr=['你点了点下巴，帐下一人提刀出阵。'];
  var mc=S.militaryCareer; var g=mc&&mc.generals&&mc.generals[0];
  if(!g){ arr.push('——可你帐下并没有能替你出阵的人。'); return {place:'阵前', text:function(){return arr;}, options:[{ t:'你自己上', go:'v652_duel_fight' }]}; }
  g.loyalty=Math.max(1,g.loyalty-1);
  arr.push(g?('出阵的是 '+v652_strongName(g.strongId)+'。'):'出阵的是你帐下的人。');
  var f=window.v652_strongById?v652_strongById(g.strongId):null;
  var r=(f?((f.realm||4)*10):40)+Math.floor(Math.random()*40);
  if(r>=60){
    arr.push('那人替你赢了。他收刀回鞘时，没看对面，只看了你一眼。');
    g.loyalty=Math.min(10,g.loyalty+2);
    S.warFame=(S.warFame||0)+5;
  } else {
    arr.push('他输了，肩膀挨了一下。他咬牙没吭声。');
    g.state='伤';
  }
  return {place:'阵前', text:function(){return arr;}, options:[{ t:'回阵', go:'v65_battle_clash2' }]};
};

  
  
  
  nodes["v652_duel_avoid"] = function(){
  var arr=['你按兵不动。对面那人耀武扬威绕了半圈，唾了一口，回去了。'];
  arr.push('你听见自己这边的阵里，有人轻轻叹了口气。');
  if(S.militaryCareer&&S.militaryCareer.morale!==undefined) S.militaryCareer.morale=Math.max(10,S.militaryCareer.morale-10);
  if(S.warFame!==undefined) S.warFame=Math.max(0,S.warFame-3);
  return {place:'阵前', text:function(){return arr;}, options:[{ t:'回阵', go:'v65_battle_clash2' }]};
};

  
  
  
  nodes["v652_captive"] = function(){
  var arr=['营帐里，几个俘虏被捆着，垂着头。'];
  var mc=S.militaryCareer;
  var cap=(mc&&mc.captives)?mc.captives:[];
  if(!cap.length){ arr.push('没有俘虏。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]}; }
  var c=cap[0];
  arr.push('一个叫'+c.name+'的人，一直盯着你。');
  var price=(c.realm||5)*50;
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'赎回（'+price+'金）', go:'v652_captive_ransom' },
    { t:'劝降', go:'v652_captive_join' },
    { t:'斩了', go:'v652_captive_kill' },
    { t:'先关着', go:'v652_general_panel_node' }
  ]};
};

  
  
  
  nodes["v652_captive_ransom"] = function(){
  var arr=[]; var mc=S.militaryCareer;
  var c=(mc&&mc.captives)?mc.captives[0]:null;
  var price=c?(c.realm||5)*50:250;
  if((S.gold||0)<price){ arr.push('你付不起这笔钱。对方等着，什么也没说。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_captive' }]}; }
  S.gold-=price;
  arr.push('钱货两清。他站起来，拍了拍土，走了。');
  arr.push('临走时他回头：「这仇，我记下了——但也记你的规矩。」');
  if(mc&&mc.captives) mc.captives.shift();
  return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]};
};

  
  
  
  nodes["v652_captive_join"] = function(){
  var arr=[]; var mc=S.militaryCareer;
  var c=(mc&&mc.captives)?mc.captives[0]:null;
  if(!c){ arr.push('没人。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]}; }
  var r=40+Math.floor(Math.random()*60);
  var faith=(S.corruption||0)>30?-10:0;
  r+=faith;
  if(r>=60){
    arr.push('他沉默了很久，最后说：「给我一匹马，一把刀。」');
    arr.push('他成了你的人。');
    if(mc.generals) mc.generals.push({strongId:c.strongId,role:'降将',loyalty:3,state:'健',deeds:{duel:0,win:0,kill:0}});
    if(mc.captives) mc.captives.shift();
    S.warFame=(S.warFame||0)+5;
  } else {
    arr.push('他偏过头：「宁死，不肯背誓。」');
    if(S.strongBond&&c.strongId&&c.strongId.indexOf('enemy_')!==0){ S.strongBond[c.strongId]=Math.max(0,(S.strongBond[c.strongId]||0)-3); }
    return {place:'军营', text:function(){return arr;}, options:[{ t:'再关几天', go:'v652_general_panel_node' }]};
  }
  return {place:'军营', text:function(){return arr;}, options:[{ t:'收编', go:'v652_general_panel_node' }]};
};

  
  
  
  nodes["v652_captive_kill"] = function(){
  var arr=[]; var mc=S.militaryCareer;
  var c=(mc&&mc.captives)?mc.captives[0]:null;
  arr.push(c?('你亲手送走了'+c.name+'。刀很快，他没受什么罪。'):'你亲手送走了那人。刀很快。');
  arr.push('营帐安静了一瞬。有人把这事记进了军报。');
  S.warFame=(S.warFame||0)+5;
  if(S.worldFame&&S.worldFame.terror!==undefined) S.worldFame.terror=Math.min(100,S.worldFame.terror+3);
  if(S.corruption!==undefined) S.corruption=Math.min(100,(S.corruption||0)+1);
  if(mc&&mc.captives) mc.captives.shift();
  if(S.militaryCareer&&S.militaryCareer.trauma){ S.militaryCareer.trauma.kinds.guilt=(S.militaryCareer.trauma.kinds.guilt||0)+1; S.militaryCareer.trauma.day=S.day||0; }
  if(mc&&mc.armyId) v65_grudgeAdd(mc.armyId,'kill_'+Math.floor(Math.random()*9),'杀',4,c?c.name:'敌将'+(Math.floor(Math.random()*9)));
  return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_general_panel_node' }]};
};

  
  
  
  nodes["v652_legend_rank"] = function(){
  var arr=['【军史榜】'];
  arr.push('你：战功 '+((S.warFame)||0));
  var tiers=[['百战老兵',30],['万人敌',60],['军神',100]];
  var t='无名';
  var wf=S.warFame||0;
  for(var i=0;i<tiers.length;i++){ if(wf>=tiers[i][1]) t=tiers[i][0]; }
  arr.push('军史称你为：「'+t+'」。');
  var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  for(var j=0;j<gs.length;j++){
    var g=gs[j];
    arr.push('· '+v652_strongName(g.strongId)+'　单挑'+g.deeds.duel+' 斩'+g.deeds.kill+'　'+g.state);
  }
  arr.push('（酒馆里传你的名字时，有人会接一句：那一仗，我在场。）');
  return {place:'军史馆', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_jealous"] = function(){
  var arr=['你升得快，有人心里不是滋味。'];
  var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  if(!gs.length){ arr.push('——但你没有随军强者，这话是对着同袍说的。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'记下', go:'v65_camp' }]}; }
  var g=gs[0];
  arr.push(g?('夜里你听见'+v652_strongName(g.strongId)+'在帐外和人说话：凭什么是他。'):'夜里你听见帐外有人说话。');
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'请他喝酒，把话摊开（20金）', go:'v652_stand_jealous_drink' },
    { t:'当没听见', go:'v652_stand_jealous_ignore' }
  ]};
};

  
  
  
  nodes["v652_stand_jealous_drink"] = function(){
  var arr=[]; var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  if((S.gold||0)<20){ arr.push('你摸不出二十金。这话，就咽下去了。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  S.gold-=20;
  if(gs[0]) gs[0].loyalty=Math.min(10,gs[0].loyalty+2);
  arr.push('你把酒壶递过去。他接住，灌了一口：「我爹也是当兵的，一辈子没升过官。」');
  arr.push('你说：「那就替他升一回。」他怔住，眼圈发红。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'干杯', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_jealous_ignore"] = function(){
  var arr=['你放下帐帘，没接话。外面安静下来。'];
  var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  if(gs[0]) gs[0].loyalty=Math.max(1,gs[0].loyalty-3);
  arr.push('此后他练得更狠，但看你的眼神，再没热过。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'睡吧', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_praise"] = function(){
  var arr=['校场上，有人当众提起你上一仗的名字。'];
  arr.push('「那一手，像样。」');
  if(S.warFame!==undefined) S.warFame+=3;
  if(S.militaryCareer&&S.militaryCareer.morale!==undefined) S.militaryCareer.morale=Math.min(100,S.militaryCareer.morale+5);
  return {place:'校场', text:function(){return arr;}, options:[{ t:'别过脸去', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_rival"] = function(){
  var arr=['你看见一张脸，和你的宿敌有七八分像。'];
  arr.push('他也在军中。你们擦肩而过，谁也没让。');
  arr.push('夜里有人传话：他说，战场上见。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'记下', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_mentor"] = function(){
  var arr=['一位同职业的前辈叫住你，看了你半天。'];
  arr.push('「路走对了，火候还差。别急着赢，先把眼前这关过踏实。」');
  arr.push('他拍了拍你的肩，走了。');
  if(S.v65Heard) S.v65Heard.mentorAdvice=(S.day||0);
  return {place:'军营', text:function(){return arr;}, options:[{ t:'点头', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_wound_care"] = function(){
  var arr=[]; var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  var g=gs[0];
  if(!g){ arr.push('军医帐里有人受伤，你帮忙按了一夜的绷带。'); return {place:'军医帐', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  arr.push(g?('你替'+v652_strongName(g.strongId)+'包扎了旧伤。他嘶了一声，没躲。'):'你替人包扎了旧伤。');
  g.loyalty=Math.min(10,g.loyalty+3);
  if(S.item) S.item=S.item.concat(['旧护具']);
  else S.item=['旧护具'];
  arr.push('走时，他塞给你一件旧护具：「带着，挡一刀是一刀。」');
  return {place:'军医帐', text:function(){return arr;}, options:[{ t:'收下', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_stand_desert"] = function(){
  var arr=[]; var gs=(S.militaryCareer&&S.militaryCareer.generals)?S.militaryCareer.generals:[];
  var g=null; var gi=-1;
  for(var i=0;i<gs.length;i++){ if(gs[i].loyalty<3&&gs[i].state==='健'){ g=gs[i]; gi=i; break; } }
  if(!g){ arr.push('营门口那双靴印，第二天被风扫平了。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  arr.push(g?(''+v652_strongName(g.strongId)+'走了。'):'有人走了。');
  arr.push('他走那天，营门口多了一双靴印，朝北。');
  if(gi>=0) gs.splice(gi,1);
  if(S.militaryCareer&&S.militaryCareer.morale!==undefined) S.militaryCareer.morale=Math.max(10,S.militaryCareer.morale-5);
  return {place:'军营', text:function(){return arr;}, options:[{ t:'看着靴印', go:'v65_camp' }]};
};



  
  
  
  nodes["v652_siege_panel"] = function(){
  var arr=['【攻城战况】'];
  var mc=S.militaryCareer;
  var s=(mc&&mc.siege)?mc.siege:null;
  if(!s){ arr.push('没有正在进行的围城。'); return {place:'军帐', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  arr.push('围城：'+s.city);
  arr.push('城防 '+s.wall+'　城内粮 '+s.food+'　水 '+s.water+'　士气 '+s.morale);
  arr.push('器械进度 '+s.prep+'/100　阶段：'+s.phase);
  var opts=[];
  if(s.phase==='围城') opts.push({ t:'筹备攻城器械', go:'v652_siege_prep' });
  if(s.phase==='围城'&&s.prep>=100) opts.push({ t:'发起强攻', go:'v652_siege_storm' });
  opts.push({ t:'回军帐', go:'v65_camp' });
  return {place:'军帐', text:function(){return arr;}, options:opts};
};

  
  
  
  nodes["v652_siege_prep"] = function(){
  var arr=['军械官搬来三张图纸，在灯下铺开。'];
  arr.push('「云梯快，冲车稳，投石狠——你挑一样。」');
  return {place:'军械营', text:function(){return arr;}, options:[
    { t:'造云梯（进度+15/周）', go:'v652_siege_prep_ladder' },
    { t:'造冲车（破墙+20）', go:'v652_siege_prep_ram' },
    { t:'造投石（城防-25）', go:'v652_siege_prep_catapult' }
  ]};
};

  
  
  
  nodes["v652_siege_prep_ladder"] = function(){
  var arr=[]; var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
  if(!s){ arr.push('没有围城。'); return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  s.prep=Math.min(100,(s.prep||0)+15);
  arr.push('云梯架起来了，新木头的味道混着铁锈。');
  arr.push('进度：'+s.prep+'/100');
  return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_siege_panel' }]};
};

  
  
  
  nodes["v652_siege_prep_ram"] = function(){
  var arr=[]; var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
  if(!s){ arr.push('没有围城。'); return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  s.prep=Math.min(100,(s.prep||0)+10);
  s.wall=Math.max(0,(s.wall||100)-20);
  arr.push('冲车的铁头在营火里烤了一夜，泛着暗红。');
  arr.push('城防：'+s.wall+'　进度：'+s.prep+'/100');
  return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_siege_panel' }]};
};

  
  
  
  nodes["v652_siege_prep_catapult"] = function(){
  var arr=[]; var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
  if(!s){ arr.push('没有围城。'); return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  s.prep=Math.min(100,(s.prep||0)+8);
  s.wall=Math.max(0,(s.wall||100)-25);
  arr.push('投石机装好了。试射第一发，砸在城头，尘土里有人叫了一嗓子。');
  arr.push('城防：'+s.wall+'　进度：'+s.prep+'/100');
  return {place:'军械营', text:function(){return arr;}, options:[{ t:'回去', go:'v652_siege_panel' }]};
};

  
  
  
  nodes["v652_siege_storm"] = function(){
  var arr=['号角响了。'];
  var r=window.v652_siegeStorm?v652_siegeStorm():45;
  var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
  if(!s){ arr.push('没有围城。'); return {place:'军帐', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  if(r>=85){
    arr.push('城破了。');
    s.wall=0;
    return {place:'城下', text:function(){return arr;}, options:[
      { t:'屠城', go:'v652_siege_take' },
      { t:'安抚百姓', go:'v652_siege_spare' },
      { t:'掠夺府库', go:'v652_siege_loot' }
    ]};
  }
  if(r>=45){
    arr.push('撞了半个时辰，城头还立着旗。');
    arr.push('伤亡不小，你先撤了下来。');
    if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.hp=Math.max(20,(S.militaryCareer.unit.hp||100)-10);
    return {place:'城下', text:function(){return arr;}, options:[{ t:'回营再议', go:'v652_siege_panel' }]};
  }
  arr.push('这一仗打得窝囊。');
  arr.push('云梯断了，冲车陷在壕沟里。你被人架着退下来，血顺着甲缝流。');
  if(S.hp!==undefined) S.hp=Math.max(1,S.hp-15);
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.hp=Math.max(20,(S.militaryCareer.unit.hp||100)-20);
  return {place:'城下', text:function(){return arr;}, options:[{ t:'休整', go:'v652_siege_panel' }]};
};

  
  
  
  nodes["v652_siege_take"] = function(){
  var arr=['城门被推开，你带兵进去。'];
  arr.push('城里乱成一锅粥。有人跪，有人跑，有人抱着孩子躲进巷子。');
  arr.push('你站在城门口，看着这一切——命令已经下了，收不回来。');
  window.v652_siegeAfter?v652_siegeAfter('take'):null;
  if(S.militaryCareer&&S.militaryCareer.siege) S.militaryCareer.siege.phase='破城';
  return {place:'城门口', text:function(){return arr;}, options:[
    { t:'走进这座城', go:'v652_siege_end_take' },
    { t:'转身离开', go:'v65_camp' }
  ]};
};

  
  
  
  nodes["v652_siege_end_take"] = function(){
  var arr=['三天后，城里的烟才散。'];
  arr.push('账册上记了一笔，军报里也记了一笔。');
  arr.push('（凶名+8，深渊+3，金+100；这座城记住了你。）');
  return {place:'废墟', text:function(){return arr;}, options:[{ t:'离开', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_siege_spare"] = function(){
  var arr=['你下了令：不杀不掠，开仓放粮。'];
  arr.push('兵士们不解，但军令如山。');
  arr.push('一个老人拄着拐杖，在你面前站了很久，最后只是拱了拱手。');
  window.v652_siegeAfter?v652_siegeAfter('spare'):null;
  if(S.militaryCareer&&S.militaryCareer.siege) S.militaryCareer.siege.phase='破城';
  return {place:'城门内', text:function(){return arr;}, options:[{ t:'受他一礼', go:'v652_siege_end_spare' }]};
};

  
  
  
  nodes["v652_siege_end_spare"] = function(){
  var arr=['你走的时候，有人往你队伍里塞了一篮干粮。'];
  arr.push('（仁名+8，神性+3；守军残部有 20 人愿意跟你走。）');
  return {place:'城门外', text:function(){return arr;}, options:[{ t:'收下', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_siege_loot"] = function(){
  var arr=['府库的门被砸开。'];
  arr.push('金银搬了一夜。兵士们眼睛发亮，你数着账，没有抬头。');
  window.v652_siegeAfter?v652_siegeAfter('loot'):null;
  if(S.militaryCareer&&S.militaryCareer.siege) S.militaryCareer.siege.phase='破城';
  return {place:'府库', text:function(){return arr;}, options:[{ t:'分账', go:'v652_siege_end_loot' }]};
};

  
  
  
  nodes["v652_siege_end_loot"] = function(){
  var arr=['天亮时账分完了。城里的铺子关了大半。'];
  arr.push('（金+60，恶名+4；这座城的商人，以后见你会绕道。）');
  return {place:'府库', text:function(){return arr;}, options:[{ t:'离开', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_ambush"] = function(){
  var arr=['夜里，敌军的探子摸到营边。'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'设伏应战', go:'v652_def_ambush_fight' },
    { t:'闭营不出', go:'v652_def_ambush_hold' }
  ]};
};

  
  
  
  nodes["v652_def_ambush_fight"] = function(){
  var arr=[]; var r=45+Math.floor(Math.random()*55);
  if(r>=60){ arr.push('你抓了三个探子，绑在营门口示众。士气涨了一截。'); if(S.militaryCareer) S.militaryCareer.morale=Math.min(100,(S.militaryCareer.morale||70)+5); }
  else { arr.push('探子跑了，你追出去时被流箭擦了一下。'); if(S.hp!==undefined) S.hp=Math.max(1,S.hp-5); }
  return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_ambush_hold"] = function(){
  var arr=['你按兵不动。探子绕了两圈，走了。'];
  arr.push('守夜的人打了个哈欠——这一夜，算是过了。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'换岗', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_traitor"] = function(){
  var arr=['有人递来一封密信：城里有人愿开城门。'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'将计就计，设伏', go:'v652_def_traitor_plan' },
    { t:'怕是诈，烧了它', go:'v652_def_traitor_burn' }
  ]};
};

  
  
  
  nodes["v652_def_traitor_plan"] = function(){
  var arr=[]; var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
  if(s) s.morale=Math.min(100,(s.morale||100)+5);
  arr.push('你换了防。夜里城门开了一条缝，进来的是敌军先锋——被你的伏兵砍翻在门洞里。');
  arr.push('（敌方强攻 -10 修正，城内士气+5）');
  return {place:'城门', text:function(){return arr;}, options:[{ t:'收兵', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_traitor_burn"] = function(){
  var arr=['你把信烧了。火苗蹿起来，纸灰落在靴面上。'];
  arr.push('「守自己的城，别信别人的门。」');
  return {place:'军帐', text:function(){return arr;}, options:[{ t:'熄灯', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_burn"] = function(){
  var arr=['斥候来报：敌军烧粮道。'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'护粮', go:'v652_def_burn_guard' },
    { t:'放弃粮队', go:'v652_def_burn_give' }
  ]};
};

  
  
  
  nodes["v652_def_burn_guard"] = function(){
  var arr=['你带兵赶去，火已经烧起来了。'];
  arr.push('你抢出半数的粮。衣角烧焦了一块，粮保住了。');
  return {place:'粮道', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_burn_give"] = function(){
  var arr=['粮队烧了一夜。'];
  var mc=S.militaryCareer;
  if(mc&&mc.unit) mc.unit.supply=Math.max(0,(mc.unit.supply||0)-5);
  arr.push('军粮少了五石。夜里营里安静得能听见肚子叫。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'省着吃', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_plague"] = function(){
  var arr=['军医压着嗓子：营里开始有人发热。'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'隔离', go:'v652_def_plague_iso' },
    { t:'硬撑', go:'v652_def_plague_tough' }
  ]};
};

  
  
  
  nodes["v652_def_plague_iso"] = function(){
  var arr=['发热的兵被移到营外帐子里。有人怨，有人怕。'];
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.hp=Math.max(20,(S.militaryCareer.unit.hp||100)-10);
  if(S.militaryCareer) S.militaryCareer.morale=Math.max(10,(S.militaryCareer.morale||70)-5);
  arr.push('战力折了些，但疫病没漫开。');
  return {place:'军营', text:function(){return arr;}, options:[{ t:'去看看病号', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_plague_tough"] = function(){
  var arr=['你按下这事，照常操练。'];
  arr.push('三天后，倒下了七个人。军医把药碗摔在地上：「你赌输了。」');
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.hp=Math.max(20,(S.militaryCareer.unit.hp||100)-15);
  return {place:'军营', text:function(){return arr;}, options:[{ t:'沉默', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_sortie"] = function(){
  var arr=['城外援军的旗被围住了。'];
  return {place:'城头', text:function(){return arr;}, options:[
    { t:'率队突围接应', go:'v652_def_sortie_out' },
    { t:'按兵不动', go:'v652_def_sortie_hold' }
  ]};
};

  
  
  
  nodes["v652_def_sortie_out"] = function(){
  var arr=[]; var r=window.v652_duelRoll?v652_duelRoll():60;
  if(r>=60){
    arr.push('你撕开一道口子，援军进来了。');
    arr.push('两面旗汇到一处，城头有人哭了出来。');
    if(S.militaryCareer&&S.militaryCareer.morale!==undefined) S.militaryCareer.morale=Math.min(100,S.militaryCareer.morale+10);
  } else {
    arr.push('口子没撕开。你被顶回来，肩上挨了一下。');
    if(S.hp!==undefined) S.hp=Math.max(1,S.hp-15);
  }
  return {place:'城下', text:function(){return arr;}, options:[{ t:'回城', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_sortie_hold"] = function(){
  var arr=['你看着援军的旗在远处晃，最终被吞没。'];
  arr.push('那天夜里，没人跟你说话。');
  if(S.militaryCareer) S.militaryCareer.morale=Math.max(10,(S.militaryCareer.morale||70)-10);
  return {place:'城头', text:function(){return arr;}, options:[{ t:'下城', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_fall"] = function(){
  var arr=['城墙塌了一段，敌兵从缺口涌进来。'];
  if(S.militaryCareer&&S.militaryCareer.trauma){ S.militaryCareer.trauma.kinds.grief=(S.militaryCareer.trauma.kinds.grief||0)+1; S.militaryCareer.trauma.day=S.day||0; }
  arr.push('你站在缺口前，身后的城还在烧。');
  return {place:'城墙缺口', text:function(){return arr;}, options:[
    { t:'死战', go:'v652_def_fall_fight' },
    { t:'带兵撤退', go:'v652_def_fall_retreat' },
    { t:'投降', go:'v652_def_fall_surrender' }
  ]};
};

  
  
  
  nodes["v652_def_fall_fight"] = function(){
  var arr=['你拔刀站在缺口正中。'];
  arr.push('这一仗打了很久。你活着，城也还站着——至少这一夜，它站着。');
  if(S.warFame!==undefined) S.warFame+=10;
  if(S.hp!==undefined) S.hp=Math.max(1,S.hp-25);
  return {place:'城墙缺口', text:function(){return arr;}, options:[{ t:'靠在墙上', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_fall_retreat"] = function(){
  var arr=['你带兵从西门撤了。'];
  var mc=S.militaryCareer;
  if(mc&&mc.unit) mc.unit.size=Math.max(0,Math.floor((mc.unit.size||0)/2));
  arr.push('城在后头烧。你数了数身边的人，少了一半。');
  return {place:'城外', text:function(){return arr;}, options:[{ t:'继续走', go:'v65_camp' }]};
};

  
  
  
  nodes["v652_def_fall_surrender"] = function(){
  var arr=['你放下刀。'];
  arr.push('敌军主将看了你一眼，没羞辱你，只让人把你带下去。');
  if(S.militaryCareer) S.militaryCareer.morale=Math.max(5,(S.militaryCareer.morale||70)-20);
  return {place:'敌营', text:function(){return arr;}, options:[{ t:'等着被处置', go:'v65_camp' }]};
};











  
  
  
  nodes["v65_unit_panel"] = function(){
  var arr=['【部队管理】'];
  var mc=S.militaryCareer;
  if(!mc||!mc.unit){ arr.push('你还没有部队。先去投军。'); return {place:'军营', text:function(){return arr;}, options:[{ t:'回去', go:'v65_camp' }]}; }
  var u=mc.unit, cap=window.v65_unitCap?v65_unitCap():10;
  arr.push('旗号：'+u.banner+'　军衔：'+((window.v65_rank&&v65_rank())?v65_rank().cn:'新兵')+'　兵员：'+u.size+'/'+cap+'　战力：'+u.hp+'　军粮：'+u.supply);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'招兵（20金/10人）', go:'v65_unit_recruit' },
    { t:'筹粮（10金/5石）', go:'v65_unit_supply' },
    { t:'修整（驻防7日）', go:'v65_unit_rest' },
    { t:'回营', go:'v65_camp' }
  ]};
};

  
  
  
  
  nodes["v65_evt_deserter"] = function(){
  var arr=['巡夜时，你撞见一个逃兵。他背着自己的铺盖，脚上还穿着军营的靴子。'];
  arr.push('他认出你，腿一软跪下，说家里老娘病了，想回去看最后一眼。');
  arr.push('他压着嗓子：」你要告发我，我认。你就当我没求过你。」');
  return {place:'军营外', text:function(){return arr;}, options:[
    { t:'放他走（日后他可能带回消息）', go:'v65_evt_deserter_let' },
    { t:'押回去（军功+5，同袍心寒）', go:'v65_evt_deserter_catch' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_deserter_let"] = function(){
  var arr=['你侧过身。他怔了一下，把靴子脱了，光脚跑进夜色里。'];
  arr.push('你回到营里，谁也没提。那人的铺盖第二天被收走，没人问。');
  arr.push('三天后，营门口多了半袋粗盐，压着一片干了的树叶。');
  if(S.warFame!==undefined) S.warFame=Math.max(0,S.warFame-3);
  S.morale=(S.morale||70)+0;
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'收下盐', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_deserter_catch"] = function(){
  var arr=['你把他押回营。军法官看了你一眼，记了你的名字。'];
  arr.push('逃兵挨了三十棍，趴着没吭声。夜里你路过，听见他咬牙。');
  if(S.warFame!==undefined) S.warFame+=5;
  if(S.militaryCareer&&S.militaryCareer.comrades){
    for(var i=0;i<S.militaryCareer.comrades.length;i++){ S.militaryCareer.comrades[i].loyal=Math.max(1,S.militaryCareer.comrades[i].loyal-2); }
  }
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'回去睡', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_martial"] = function(){
  var arr=['营里失了一袋军粮。查到最后，是新来的伙夫监守自盗。'];
  arr.push('军法官问话时，他抖得话都说不利索：」我娘……饿死在粮仓外头。」');
  arr.push('所有人都看着你。你和他同营，睡过一铺。');
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'替他求情（罚三个月军饷）', go:'v65_evt_martial_plea' },
    { t:'不开口（军纪就是军纪）', go:'v65_evt_martial_silent' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_martial_plea"] = function(){
  var arr=['你开口求了情。军法官盯着你看了很久，说：」你是要替他担着？」'];
  arr.push('你点了头。军法官判他罚三月军饷，记你一笔。');
  arr.push('伙夫跪着给你磕头，你把他扶起来，说：」去把你娘葬了。」');
  if(S.gold!==undefined) S.gold=Math.max(0,S.gold-20);
  if(S.worldFame&&S.worldFame.mercy!==undefined) S.worldFame.mercy=Math.min(100,S.worldFame.mercy+3);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'转身离开', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_martial_silent"] = function(){
  var arr=['你没开口。军法官挥了挥手，伙夫被拖下去，打了三十棍，革了职。'];
  arr.push('夜里你听见他哭。压着嗓子，像怕吵着谁。');
  if(S.worldFame&&S.worldFame.mercy!==undefined) S.worldFame.mercy=Math.max(0,S.worldFame.mercy-2);
  if(S.san!==undefined) S.san=Math.max(1,S.san-5);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'睡吧', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_blackmarket"] = function(){
  var arr=['营外黑市今晚开张。有人倒卖军粮，有人卖缴获的兵器。'];
  arr.push('一个蒙脸人凑过来，压低声音：」军械，半价。你要多少？」');
  arr.push('你知道这是犯军法的。但前线的仗，眼看就要打起来了。');
  return {place:'营外黑市', text:function(){return arr;}, options:[
    { t:'买军粮（30金/10粮，救急）', go:'v65_evt_blackmarket_buy' },
    { t:'记下他们，回头举报（军功+8）', go:'v65_evt_blackmarket_tell' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_blackmarket_buy"] = function(){
  var arr=['你把钱递过去，蒙脸人数了两遍，丢给你一袋粮。'];
  arr.push('粮袋是军营的官袋，封口戳还新鲜。你没问。');
  if(S.gold!==undefined) S.gold=Math.max(0,S.gold-30);
  if(S.militaryCareer&&S.militaryCareer.unit) S.militaryCareer.unit.supply+=10;
  return {place:'营外', text:function(){return arr;}, options:[
    { t:'回营', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_blackmarket_tell"] = function(){
  var arr=['你回到营里，把蒙脸人的长相和暗号报了上去。'];
  arr.push('当晚黑市被端了。缴了半车军械，抓了七个人。');
  arr.push('军法官拍了拍你的肩：」有眼力。」你笑了下，没接话。');
  if(S.warFame!==undefined) S.warFame+=8;
  if(S.worldFame&&S.worldFame.mercy!==undefined) S.worldFame.mercy=Math.max(0,S.worldFame.mercy-1);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'回营', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_pray"] = function(){
  var arr=['夜哨。风把火把吹得歪斜，影子在营墙上拉得老长。'];
  arr.push('老卒蹲在火边，往火里扔了片干姜：」我守过十四年哨。见过的东西，说出来你不信。」');
  arr.push('他示意你坐下：」想听鬼话，还是想听人话？」');
  return {place:'夜哨', text:function(){return arr;}, options:[
    { t:'听鬼话（san-5，开眼界）', go:'v65_evt_pray_ghost' },
    { t:'听人话（军旅见闻，经验+8）', go:'v65_evt_pray_human' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_pray_ghost"] = function(){
  var arr=['老卒讲：三年前雪原上那一仗，战死的人至今还列着队，缺了头的也在。'];
  arr.push('他添了根柴：」他们说，那是走不了的人，等有人替他们收尸。」');
  arr.push('火堆噼啪响了一声。你后颈一凉，什么都没看见。');
  if(S.san!==undefined) S.san=Math.max(1,S.san-5);
  return {place:'夜哨', text:function(){return arr;}, options:[
    { t:'添根柴', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_evt_pray_human"] = function(){
  var arr=['老卒讲的是人话：哪任将军克扣军饷，哪次换防是拿命填的坑。'];
  arr.push('他说：」当兵的有三样东西要认——认命、认粮、认枪。别信别的。」');
  arr.push('天边泛起鱼肚白。他拍拍灰站起来：」换你的岗了。」');
  if(S.xp!==undefined) S.xp+=8;
  return {place:'夜哨', text:function(){return arr;}, options:[
    { t:'换岗', go:'v65_camp' }
  ]};
};

  
  
  
  
  
  nodes["v65_grudge_revenge"] = function(){
  var arr=['你听说有人在找你。'];
  var aid=(typeof S!=='undefined'&&S.militaryCareer&&S.militaryCareer.armyId)?S.militaryCareer.armyId:null;
  var keys=(typeof S!=='undefined'&&S.warGrudges)?Object.keys(S.warGrudges):[];
  var found=null;
  for(var i=0;i<keys.length;i++){
    var parts=keys[i].split('|');
    if(aid&&(parts[0]===aid||parts[1]===aid)){ found=keys[i]; break; }
  }
  if(found){
    var g=S.warGrudges[found];
    var other=found.split('|')[0]===aid?found.split('|')[1]:found.split('|')[0];
    arr.push('「'+other+'提起过你，'+(g.note||'语气不算友善')+'。」');
    arr.push('你心里有数。这笔账，迟早要面对面算。');
  } else {
    arr.push('是酒馆老板，催你结上个月的账。');
    arr.push('虚惊一场。你把刀收回鞘里。');
  }
  return {place:'城镇街头', text:function(){return arr;}, options:[
    { t:'记在心里', go:'w64_war_return' }
  ]};
};


  
  
  
  
  
  nodes["v65_unit_recruit"] = function(){
  var cap=window.v65_unitCap?v65_unitCap():10;
  var u=S.militaryCareer&&S.militaryCareer.unit;
  var now=u?u.size:0;
  var room=cap-now;
  var arr=['征兵官坐在营门口，面前摆一摞名册，墨迹还没干。'];
  if(room<=0){
    arr.push('他把名册一合：」满了。带不了那么多人，粮草也不够。」');
    return {place:'军营', text:function(){return arr;}, options:[
      { t:'回去', go:'v65_myunit_node' }
    ]};
  }
  var n=Math.min(10,room);
  if((S.gold||0)<20){
    arr.push('你摸了摸口袋，不够二十金。征兵官看你的眼神像看个笑话。');
    return {place:'军营', text:function(){return arr;}, options:[
      { t:'改天再来', go:'v65_myunit_node' }
    ]};
  }
  S.gold-=20; u.size+=n;
  if(u.size>cap) u.size=cap;
  arr.push('你交了二十金，名册上多了一行。新兵们背着铺盖站成一排，眼睛还在四处看。');
  arr.push('你数了数人头——'+u.size+' 人了。');
  arr.push('有个半大孩子问你：」将军，仗好打吗？」你没回答。');
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'带他们去领枪', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_unit_supply"] = function(){
  var arr=['军需官拨着算盘，头也不抬：」粮价涨了，十金只够五石。」'];
  var u=S.militaryCareer&&S.militaryCareer.unit;
  if((S.gold||0)<10){
    arr.push('你掏了掏口袋，凑不出十金。他叹了口气，把算盘收起来。');
    return {place:'军需处', text:function(){return arr;}, options:[
      { t:'回去', go:'v65_myunit_node' }
    ]};
  }
  S.gold-=10; u.supply+=5;
  arr.push('粮袋抬进军帐。你拍掉手上的灰，心想：这袋粮，够他们吃三天。');
  return {place:'军需处', text:function(){return arr;}, options:[
    { t:'回营', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_unit_rest"] = function(){
  var arr=['你让部队驻防七日，不操练，不出战，只修整。'];
  var u=S.militaryCareer&&S.militaryCareer.unit;
  u.hp=Math.min(100,(u.hp||100)+15);
  if(S.militaryCareer) S.militaryCareer.morale=Math.min(100,(S.militaryCareer.morale||70)+10);
  arr.push('士兵们总算睡了个整觉。有人把靴子晒在营帐顶，像一排小小的旗。');
  arr.push('战力回升，军心也稳了些。');
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'继续驻防', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_help"] = function(){
  var arr=['战场上，你看见同袍'+ (S.militaryCareer&&S.militaryCareer.comrades&&S.militaryCareer.comrades[0]?S.militaryCareer.comrades[0].name:'那人') +'被流矢射中，倒在泥里。'];
  arr.push('你冲过去把他背起来，箭还扎在他肩上，血顺着你的脖子往下淌。');
  arr.push('回营的路上，他一直在说：」放下我，你自己走……」你没理他。');
  if(S.hp!==undefined) S.hp=Math.max(1,S.hp-10);
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  if(c&&c[0]) c[0].loyal=Math.min(10,(c[0].loyal||5)+3);
  if(S.item) S.item=S.item.concat(['半块干饼']);
  else S.item=['半块干饼'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'把干饼揣进怀里', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_jealous"] = function(){
  var arr=['你升得比同袍快。夜里你听见他在帐外和人说话：」凭什么是他。」'];
  arr.push('你掀开帐帘，他愣住，随即别过脸去。');
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'请他喝酒，把话摊开（20金，忠+2）', go:'v65_comrade_jealous_drink' },
    { t:'当没听见（忠-3，日后战场见）', go:'v65_comrade_jealous_ignore' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_jealous_drink"] = function(){
  var arr=['你把酒壶递过去。他接住，灌了一大口，半晌才说：」我爹也是当兵的，一辈子没升过官。」'];
  arr.push('你说：」那就替他升一回。」他怔住，眼圈发红。');
  if(S.gold!==undefined) S.gold=Math.max(0,S.gold-20);
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  if(c&&c[1]) c[1].loyal=Math.min(10,(c[1].loyal||5)+2);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'干杯', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_jealous_ignore"] = function(){
  var arr=['你放下帐帘，没接话。外面安静下来。'];
  arr.push('此后他在校场上练得更狠，但看你的眼神，再没热过。');
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  if(c&&c[1]) c[1].loyal=Math.max(1,(c[1].loyal||5)-3);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'睡吧', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_share"] = function(){
  var arr=['这一仗，你亲手斩了敌旗。军功簿上，本该只记你一个人的名字。'];
  arr.push('你划掉了自己的名字，填上同袍的。');
  arr.push('军法官抬头看了你一眼，什么也没说。');
  if(S.warFame!==undefined) S.warFame=Math.max(0,S.warFame-5);
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  if(c&&c[2]) c[2].loyal=Math.min(10,(c[2].loyal||5)+5);
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'无言的默契', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_fall"] = function(){
  var arr=['同袍倒下了。他护着你冲过敌阵，自己没能回来。'];
  arr.push('你找到他的时候，他靠在断墙上，手里还攥着半块干饼——他留给你那份。');
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  var nm='他';
  if(c&&c.length){ nm=c[0].name; c[0].state='死'; }
  arr.push('你把他葬在坡上，面朝家乡的方向。墓碑上没有字，只有一把断刀。');
  if(S.item) S.item=S.item.concat(['断刀（'+nm+'的遗物）']);
  else S.item=['断刀（'+nm+'的遗物）'];
  if(c){ for(var i=0;i<c.length;i++){ if(c[i].state==='活') c[i].loyal=Math.min(10,(c[i].loyal||5)+2); } }
  if(S.san!==undefined) S.san=Math.max(1,S.san-5);
  return {place:'山坡', text:function(){return arr;}, options:[
    { t:'把断刀收好', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_comrade_view"] = function(){
  var arr=[];
  var c=S.militaryCareer&&S.militaryCareer.comrades;
  if(!c||!c.length){ arr.push('你还没投军，军营里没有你的名字。'); }
  else {
    for(var i=0;i<c.length;i++){
      var m=c[i];
      arr.push('【'+m.role+'·'+m.name+'】'+m.state+' 战力'+m.valor+' 忠'+m.loyal);
      if(m.note) arr.push('　'+m.note);
    }
  }
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'回营地', go:'v65_myunit_node' }
  ]};
};

  
  
  
  
  
  nodes["v65_myunit_node"] = function(){
  var arr=['你回到营中。'];
  return {place:'军营', text:function(){return arr;}, options:[
    { t:'打开部队面板', go:'v65_unit_panel' }
  ]};
};

  
  
  
  
  
  nodes["v65_legend_hall"] = function(){
  var arr=['营火将熄，老兵往火里添了根柴，火光在每个人脸上跳了一下。'];
  arr.push('「都是过去的事了。可打仗这事，从来不会真正过去。」');
  arr.push('他拍了拍身边的空位，示意你坐下。');
  var wf=S.warFame||0;
  var opts=[];
  if(wf>=30) opts.push({ t:'听雪原之役', go:'v65_legend_snow1' });
  if(wf>=40) opts.push({ t:'听圣辉城攻防', go:'v65_legend_fort1' });
  if(wf>=50&&(S.corruption||0)>=20) opts.push({ t:'听裂隙口血战', go:'v65_legend_rift1' });
  opts.push({ t:'回营', go:'v65_camp' });
  return {place:'军营篝火', text:function(){return arr;}, options:opts};
};


  
  
  
  
  
  nodes["v65_join"] = function(){
  var arr=[];
  arr.push("军营招募处贴着四张告示，墨迹还新。");
  arr.push("「北境招兵——会握刀就来。」「圣辉骑士团——信仰先行。」「学院法师团——认得符文者优先。」「自由港佣兵团——钱货两讫。」");
  return {place:"圣辉城", text:function(){return arr;}, options:[
    { t:"投北境军", go:"v65_join_north" },
    { t:"投教廷骑士团", go:"v65_join_church" },
    { t:"投学院法师团", go:"v65_join_academy" },
    { t:"投自由城邦佣兵团", go:"v65_join_free" },
    { t:"去佣兵公会看看", go:"v65_merc" },
    { t:"去军事学院", go:"v65_acad" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_join_north"] = function(){
  var ok=(typeof v65_joinArmy==='function')&&v65_joinArmy('north');
  return {place:"北境城", text:function(){return ["雪粒子打在脸上。老卒上下打量你，「北境军要的是能挨饿的，你行不行？」","你在一张皱巴巴的名册上按下手印。他往你手里塞了把旧刀：刀柄磨得发亮，握过它的人应该不少。"];}, options:[
    { t:"听令", go:"v65_camp" },
    { t:"回招募处", go:"v65_join" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_join_church"] = function(){
  var ok=(typeof v65_joinArmy==='function')&&v65_joinArmy('church');
  return {place:"圣辉城", text:function(){return ["骑士团执事递来一面小旗，「旗在，人在。」","旗角的圣徽缺了一小块，他没解释。你也没问。"];}, options:[
    { t:"接过旗", go:"v65_camp" },
    { t:"回招募处", go:"v65_join" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_join_academy"] = function(){
  var ok=(typeof v65_joinArmy==='function')&&v65_joinArmy('academy');
  return {place:"学院城", text:function(){return ["法师团校尉在纸上写你的名字，写完又划掉，「太长了。」","他重新写了三个字。你从此在花名册上叫这个名字。"];}, options:[
    { t:"认了", go:"v65_camp" },
    { t:"回招募处", go:"v65_join" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_join_free"] = function(){
  var ok=(typeof v65_joinArmy==='function')&&v65_joinArmy('free');
  return {place:"自由港", text:function(){return ["佣兵团管账的姑娘把合同推过来，「按手印，生死自负。」","你按下去之前，看见她桌角压着一摞没寄出去的信。"];}, options:[
    { t:"按手印", go:"v65_camp" },
    { t:"回招募处", go:"v65_join" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_camp"] = function(){
  var arr=[];
  var mc=(typeof S!=='undefined'&&S.militaryCareer)||null;
  if(!mc){ arr.push("你还没从军。"); return {place:"旅途", text:function(){return arr;}, options:[{ t:"去投军", go:"v65_join" }]}; }
  var r=(typeof v65_rank==='function')?v65_rank():null;
  arr.push("营里的日子按号角走。");
  arr.push(r?("你现在的身份："+r.cn+"。"):"");
  arr.push("训练"+mc.training+" 士气"+mc.morale+" 粮草"+mc.supply+" 军功"+(S.warFame||0));
  return {place:"军营", text:function(){return arr;}, options:[
    { t:"操练", go:"v65_camp_train" },
    { t:"巡逻", go:"v65_camp_patrol" },
    { t:"驻防", go:"v65_camp_guard" },
    { t:"出征", go:"v65_camp_march" },
    { t:"军旅见闻", go:"v65_career" },
    { t:"回营帐", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_camp_train"] = function(){
  var arr=["操场上土被踩实了一层。"];
  if(typeof S!=='undefined'&&S.militaryCareer){
    S.militaryCareer.training=Math.min(100,(S.militaryCareer.training||0)+8);
    S.militaryCareer.morale=Math.min(100,(S.militaryCareer.morale||70)+3);
    if(S.militaryCareer.training>=60){ arr.push("你的动作开始跟旁边老兵一个节奏。他没夸你，只是没再骂你。"); }
    else { arr.push("收操时你握着枪，手抖得像第一次握笔。"); }
  }
  return {place:"练兵场", text:function(){return arr;}, options:[
    { t:"接着练", go:"v65_camp_train" },
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_camp_patrol"] = function(){
  var arr=["沿着防线的土路走，鞋底沾满泥。"];
  var ev=W65_WAR.D.events[Math.floor(Math.random()*W65_WAR.D.events.length)];
  arr.push("路上遇到一件小事："+ev.desc);
  if(ev.id==='duel'){ arr.push("对面的人只是叫阵，你记下了他的名字。"); }
  else if(ev.id==='ambush_ev'){ arr.push("斥候先发现了动静，你带人绕了过去。"); }
  else { arr.push("你把这件小事带回营，写进夜里的报告。"); }
  if(typeof S!=='undefined'&&S.militaryCareer){ S.militaryCareer.fame=(S.militaryCareer.fame||0)+2; }
  return {place:"巡逻路上", text:function(){return arr;}, options:[
    { t:"继续巡逻", go:"v65_camp_patrol" },
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_camp_guard"] = function(){
  var arr=["轮到你守垛口。"];
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  if(wars.length){
    var war=wars[wars.length-1];
    arr.push("远处有战事——"+((typeof w64_fname==='function')?w64_fname(war.a):war.a)+"对"+((typeof w64_fname==='function')?w64_fname(war.b):war.b)+"，前线在"+war.front+"。");
    arr.push("夜里能听见风从那边吹过来，带着烟味。");
  } else {
    arr.push("太平。只有鸽子在城头打架。");
  }
  return {place:"城头", text:function(){return arr;}, options:[
    { t:"换防", go:"v65_camp" },
    { t:"看着远方", go:"v65_camp_guard" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_camp_march"] = function(){
  var arr=[];
  var ws=(typeof S!=='undefined'&&S.worldState)||{};
  var wars=(ws.wars||[]).filter(function(w){return w.phase<4;});
  if(wars.length){
    var war=wars[wars.length-1];
    arr.push("号角吹了三遍。你的部队接到调令，开往"+war.front+"。");
    arr.push("路上没人说话。马蹄声、车辙声，还有谁在低声数着自己的心跳。");
    return {place:"行军中", text:function(){return arr;}, options:[
      { t:"奔赴前线", go:"v65_battle_prep" },
      { t:"中途返回", go:"v65_camp" }
    ]};
  }
  arr.push("没有战事。部队在边境扎营，你对着地图发呆。");
  arr.push("地图边角有人画了只小乌龟，不知道是谁。");
  return {place:"边境营地", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_career"] = function(){
  var arr=["营火边，老兵在磨他的刀。"];
  var mc=(typeof S!=='undefined'&&S.militaryCareer)||null;
  arr.push("「打仗这事，」他说，「最怕的不是死，是忘了自己为什么来。」");
  if(mc&&mc.fame>10){ arr.push("他看你一眼，「你这小子，倒是攒了些军功。往后别只为了钱，记着今天你守的是什么。」"); }
  if(typeof v65_promote==='function'){ var up=v65_promote(); if(up){ var r=v65_rank(); arr.push("传令兵送来文书：你升了"+r.cn+"。"); } }
  return {place:"营火旁", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" },
    { t:"接着听", go:"v65_career" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad"] = function(){
  var arr=["军事学院的门楼挂着褪色的军旗。"];
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  if(heard.academy){ arr.push("你已经是这里的学员了。"); return {place:"军事学院", text:function(){return arr;}, options:[{ t:"上课", go:"v65_acad_courses" },{ t:"离开", go:"w64_war_return" }]}; }
  arr.push("看门的老兵拦你：「入学要五十金，学的是排兵布阵，不是舞刀弄枪。」");
  return {place:"军事学院", text:function(){return arr;}, options:[
    { t:"报名（50金）", go:"v65_acad_apply" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_apply"] = function(){
  var arr=[];
  var g=(typeof S!=='undefined'&&S.gold)||0;
  if(g<50){ arr.push("你掏遍口袋，差得远。看门老兵摆摆手，「攒够了再来。」"); return {place:"军事学院门口", text:function(){return arr;}, options:[{ t:"离开", go:"v65_acad" }]}; }
  S.gold=g-50;
  if(!S.v65Heard) S.v65Heard={};
  S.v65Heard.academy=true;
  arr.push("五十金换了一块木牌，正面刻着你的名字。");
  arr.push("老兵把木牌翻过来，背面刻着一行小字：「阵而后战，兵法之常。」");
  return {place:"军事学院", text:function(){return arr;}, options:[
    { t:"进讲堂", go:"v65_acad_courses" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_courses"] = function(){
  var arr=["讲堂里，沙盘上的城池还留着上一课的推演痕迹。"];
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  arr.push("可选的课："+(heard["v65_art:strategy"]?"谋略（已学）":"谋略")+" / "+(heard["v65_art:logistics"]?"后勤（已学）":"后勤")+" / "+(heard["v65_art:courage"]?"胆气（已学）":"胆气")+" / "+(heard["v65_art:sandtable"]?"沙盘（已学）":"沙盘"));
  return {place:"军事学院讲堂", text:function(){return arr;}, options:[
    { t:"研习谋略", go:"v65_acad_strategy" },
    { t:"研习后勤", go:"v65_acad_logistics" },
    { t:"研习胆气", go:"v65_acad_courage" },
    { t:"沙盘推演", go:"v65_acad_sandtable" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_strategy"] = function(){
  var arr=["教官在沙盘上摆开一队兵，「你说，这支兵该往哪走？」"];
  if(!S.v65Heard) S.v65Heard={};
  if(S.v65Heard["v65_art:strategy"]){ arr.push("你已经学过这一课。教官看着你，「温故知新，去吧。」"); }
  else{
    S.v65Heard["v65_art:strategy"]=true;
    arr.push("你答了。教官没有夸你，只把沙盘上的棋子拨回原位，「记住这个阵位，战场上它救过很多人。」");
    arr.push("你学会「谋略」：布阵判定+2。");
  }
  return {place:"军事学院讲堂", text:function(){return arr;}, options:[
    { t:"继续上课", go:"v65_acad_courses" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_logistics"] = function(){
  var arr=["这一课讲粮道。教官画了一条弯弯曲曲的线，「仗打三个月，胜负其实在运粮的车上。」"];
  if(!S.v65Heard) S.v65Heard={};
  if(S.v65Heard["v65_art:logistics"]){ arr.push("你已经学过。"); }
  else{
    S.v65Heard["v65_art:logistics"]=true;
    arr.push("下课的时候，教官把一个干瘪的粮袋塞给你，「留着，饿过才懂。」");
    arr.push("你学会「后勤」：军队消耗-20%。");
  }
  return {place:"军事学院讲堂", text:function(){return arr;}, options:[
    { t:"继续上课", go:"v65_acad_courses" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_courage"] = function(){
  var arr=["武技课上，教官盯着你的眼睛，「狭路相逢，你怕不怕？」"];
  if(!S.v65Heard) S.v65Heard={};
  if(S.v65Heard["v65_art:courage"]){ arr.push("你已经学过。"); }
  else{
    S.v65Heard["v65_art:courage"]=true;
    arr.push("你没回答。他点点头，「不逞强说大话，这是胆气的第一步。」");
    arr.push("你学会「胆气」：斗将判定+2。");
  }
  return {place:"军事学院演武场", text:function(){return arr;}, options:[
    { t:"继续上课", go:"v65_acad_courses" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_acad_sandtable"] = function(){
  var arr=["沙盘上摆着一场旧战。教官说：「复盘一仗，胜过十场实战。」"];
  if(!S.v65Heard) S.v65Heard={};
  if(S.v65Heard["v65_art:sandtable"]){ arr.push("你已经推演过这一局。棋子边角被你摸得发亮。"); }
  else{
    S.v65Heard["v65_art:sandtable"]=true;
    arr.push("你推了一遍，输在粮道。教官把沙盘抹平，「记住这个教训，比记住胜仗有用。」");
    arr.push("你学会「沙盘」：战场事件先手判定+1。");
  }
  return {place:"军事学院沙盘室", text:function(){return arr;}, options:[
    { t:"离开", go:"v65_acad_courses" }
  ]};
};


  
  
  
  
  
  
  nodes["v65_grudge_tavern"] = function(){
  var arr=["酒馆角落的桌上，有人喝多了在说战事。"];
  var keys=(typeof S!=='undefined'&&S.warGrudges)?Object.keys(S.warGrudges):[];
  if(keys.length){
    var k=keys[0], parts=k.split("|"), g=S.warGrudges[k];
    arr.push("「听说"+parts[0]+"和"+parts[1]+"之间有过节，"+(g.note||"闹得不算小")+"。」");
    arr.push("说话的人压低了声音，「这事没完。」");
  } else {
    arr.push("「这年头连场像样的仗都没有。」他叹口气，继续喝酒。");
  }
  return {place:"酒馆", text:function(){return arr;}, options:[
    { t:"再听一会", go:"v65_grudge_tavern" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_prep"] = function(){
  var arr=["斥候半跪在帐前：「敌军在前方三里，阵列已摆开。」"];
  arr.push("你把地图铺开。风向、地形、还有你手里这点兵。");
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  if(heard["v65_art:strategy"]){ arr.push("军校里那句「阵而后战」在脑子里响了一遍。"); }
  return {place:"前线", text:function(){return arr;}, options:[
    { t:"选择阵型", go:"v65_battle_formation" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_formation"] = function(){
  var arr=["布阵。四选一，错了会死人。"];
  arr.push("方阵：守势+4，骑兵冲锋无效化。散阵：闪避+4。伏击：先手+6，首轮伤害+4。坚守：士气消耗减半。");
  return {place:"阵前", text:function(){return arr;}, options:[
    { t:"摆方阵", go:"v65_battle_clash1" },
    { t:"摆散阵", go:"v65_battle_clash1" },
    { t:"设伏击", go:"v65_battle_clash1" },
    { t:"坚守", go:"v65_battle_clash1" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_clash1"] = function(){
  var arr=["第一轮交锋。"];
  var ev=W65_WAR.D.events[Math.floor(Math.random()*W65_WAR.D.events.length)];
  arr.push(ev.cn+"："+ev.desc);
  if(ev.id==='duel'){ arr.push("对面阵前的人提着刀，点名要见你。"); return {place:"战场", text:function(){return arr;}, options:[{ t:"应战", go:"v652_duel_challenge" },{ t:"不理会，全军压上", go:"v65_battle_clash2" }]}; }
  if(ev.id==='ambush_ev'){ arr.push("你的斥候先发现了动静，绕开了这一刀。"); }
  if(ev.id==='morale_break'){ arr.push("有人开始往后缩，你踹回去一个。"); }
  if(ev.id==='civ'){ arr.push("平民从两军之间跑过，箭雨里有人绊倒了。"); return {place:"战场", text:function(){return arr;}, options:[{ t:"鸣金救人", go:"v65_battle_clash2" },{ t:"战事要紧", go:"v65_battle_clash2" }]}; }
  return {place:"战场", text:function(){return arr;}, options:[
    { t:"继续交锋", go:"v65_battle_clash2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_clash2"] = function(){
  var arr=["第二轮交锋。刀兵相接。"];
  var ev=W65_WAR.D.events[Math.floor(Math.random()*W65_WAR.D.events.length)];
  arr.push(ev.cn+"："+ev.desc);
  if(ev.id==='supply_cut'){ arr.push("粮道被断的消息传来，你听见身后的队伍安静了一瞬。"); }
  if(ev.id==='reinforce'){ arr.push("援军的旗出现在地平线上，你身边的人喊了起来。"); }
  if(ev.id==='treasure'){ arr.push("尸堆里露出一截剑柄，你弯腰捡起来——剑鞘上刻着个名字，不是你认识的。"); }
  return {place:"战场", text:function(){return arr;}, options:[
    { t:"第三轮交锋", go:"v65_battle_clash3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_clash3"] = function(){
  var arr=["第三轮。胜负在这一刻定了。"];
  var r=40+Math.floor(Math.random()*60);
  var b=(typeof v65_armyBonus==='function')?v65_armyBonus():0;
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  if(heard["v65_art:sandtable"]){ r+=1; }
  if(r+b>=65){
    arr.push("敌军阵脚松动。你抓住机会，一鼓作气压了上去。");
    arr.push("「赢了。」传令兵的声音有点抖，不知道是累还是怕。");
    S.warFame=(S.warFame||0)+10;
    if(typeof v65_scar==='function'){ v65_scar('前线城','refugee'); }
  } else if(r+b>=40){
    arr.push("双方胶着，谁也吃不掉谁。");
    arr.push("夜里收兵，你数了数身边少了的人。");
    S.warFame=(S.warFame||0)+3;
  } else {
    arr.push("败了。你带着残兵往后撤，背后是追兵的喊杀声。");
    S.warFame=(S.warFame||0)-2;
  }
  return {place:"战场", text:function(){return arr;}, options:[
    { t:"收兵回营", go:"v65_battle_pursue" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_battle_pursue"] = function(){
  var arr=["仗打完了。"];
  if(typeof v65_promote==='function'){ var up=v65_promote(); if(up){ arr.push("军功文书到了：你晋升"+v65_rank().cn+"。"); } }
  arr.push("战场安静下来，只剩收尸的人和乌鸦。");
  arr.push("有人在翻战死者的口袋，找一封没寄出去的家书。");
  return {place:"战后", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" },
    { t:"去伤城看看", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_snow1"] = function(){
  var arr=["北境雪原。"];
  arr.push("这场仗是秦·长风亲自挂的帅，对面是南境最老的军团。");
  arr.push("雪下了一夜，旗杆上的冰溜子结得有手指长。");
  return {place:"北境雪原", text:function(){return arr;}, options:[
    { t:"随军布阵", go:"v65_legend_snow2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_snow2"] = function(){
  var arr=["布阵时，秦·长风走到你面前，没说话，把一壶酒塞进你怀里。"];
  arr.push("「喝了，别冻死在阵前。」他说完就回到了帅位。");
  return {place:"北境雪原", text:function(){return arr;}, options:[
    { t:"喝一口", go:"v65_legend_snow3" },
    { t:"留着", go:"v65_legend_snow3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_snow3"] = function(){
  var arr=["雪原决战。南境军陷在雪里，骑兵跑不起来。"];
  var r=50+Math.floor(Math.random()*50);
  arr.push(r>=65?"北境的重步像雪墙一样压过去，南境的阵线碎了。":"南境军靠着一座雪丘死守，北境啃了一整天。");
  return {place:"北境雪原", text:function(){return arr;}, options:[
    { t:"乘胜追击", go:"v65_legend_snow4" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_snow4"] = function(){
  var arr=["追击路上，你看见一个南境老兵把自己的刀插进雪里，坐在旁边等死。"];
  arr.push("他抬头看你：「给个痛快。」");
  return {place:"雪原", text:function(){return arr;}, options:[
    { t:"给他痛快", go:"v65_legend_snow5" },
    { t:"放他走", go:"v65_legend_snow5" },
    { t:"不管，继续追", go:"v65_legend_snow5" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_snow5"] = function(){
  var arr=["雪原之战结束。"];
  if(typeof v65_grudgeAdd==='function'){ v65_grudgeAdd('south','north','hurt',3,'雪原之战：南境的旗被北境踏进了雪里'); }
  S.warFame=(S.warFame||0)+20;
  arr.push("你的名字第一次写进北境的战报。");
  arr.push("秦·长风看了你一眼，「没冻死，算条汉子。」");
  return {place:"北境大营", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_fort1"] = function(){
  var arr=["圣辉城攻防战。"];
  arr.push("教廷的圣徽旗插在城头，攻城的是东境的联合军。");
  arr.push("城下堆着撞木和云梯，像一排排等着爬墙的蚂蚁。");
  return {place:"圣辉城", text:function(){return arr;}, options:[
    { t:"上城头", go:"v65_legend_fort2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_fort2"] = function(){
  var arr=["城头上，牧师团的圣光罩着伤兵。有个牧师的手在抖。"];
  arr.push("「不是怕，」她解释，「是昨晚上接了一整夜的伤，手还没缓过来。」");
  return {place:"圣辉城城头", text:function(){return arr;}, options:[
    { t:"守垛口", go:"v65_legend_fort3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_fort3"] = function(){
  var arr=["攻城开始了。云梯架上城墙，有人在你身边倒下去。"];
  var r=40+Math.floor(Math.random()*60);
  arr.push(r>=60?"你把一架云梯掀翻，梯上的人摔下去，没出声。":"城墙被撞出一个口子，你带人去堵，血混着灰浆。");
  return {place:"圣辉城城墙", text:function(){return arr;}, options:[
    { t:"死守", go:"v65_legend_fort4" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_fort4"] = function(){
  var arr=["夜里，攻城军退了。"];
  arr.push("你靠着垛口坐下，手里还攥着半截断矛。");
  arr.push("城下的火把像一条河，慢慢流远了。");
  return {place:"圣辉城城墙", text:function(){return arr;}, options:[
    { t:"天明", go:"v65_legend_fort5" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_fort5"] = function(){
  var arr=["圣辉城守住了。"];
  if(typeof v65_grudgeAdd==='function'){ v65_grudgeAdd('east','church','hurt',2,'圣辉城攻防：东境的联军铩羽而归'); }
  S.warFame=(S.warFame||0)+20;
  arr.push("枢机团的人来城头，念了一段经文，给守军每人发一枚银币。");
  arr.push("银币上铸着圣徽。你捏了捏，是真的。");
  return {place:"圣辉城", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_rift1"] = function(){
  var arr=["裂隙口血战。"];
  arr.push("这场仗的敌人不是人——是裂隙里涌出来的东西。");
  arr.push("深渊教会的人站在裂隙边上，看着这场厮杀，像在看戏。");
  return {place:"裂隙口", text:function(){return arr;}, options:[
    { t:"列阵", go:"v65_legend_rift2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_rift2"] = function(){
  var arr=["法师团的火球把裂隙口烧成白昼。"];
  arr.push("但涌出来的东西没有痛觉，踩着同伴的尸体往前冲。");
  return {place:"裂隙口", text:function(){return arr;}, options:[
    { t:"顶上去", go:"v65_legend_rift3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_rift3"] = function(){
  var arr=["你砍倒一只，又一只。刀钝了。"];
  var r=30+Math.floor(Math.random()*70);
  if(r>=55){
    arr.push("深渊的东西退潮一样缩回裂隙。有人跪在血里哭，有人笑。");
  } else {
    arr.push("你的部队被打散了一角，有人被拖进了裂隙，喊声只响了一半。");
  }
  return {place:"裂隙口", text:function(){return arr;}, options:[
    { t:"清点活人", go:"v65_legend_rift4" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_rift4"] = function(){
  var arr=["战后，你看见裂隙边坐着一个深渊教会的人。"];
  arr.push("他没看你，对着裂隙说：「你们今天填进去的命，明天它还会长回来。」");
  return {place:"裂隙口", text:function(){return arr;}, options:[
    { t:"不答话", go:"v65_legend_rift5" },
    { t:"反驳他", go:"v65_legend_rift5" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_legend_rift5"] = function(){
  var arr=["裂隙口血战结束。"];
  if(typeof v65_grudgeAdd==='function'){ v65_grudgeAdd('abyss','academy','hurt',4,'裂隙口血战：学院法师团填进去一整个联队'); }
  S.warFame=(S.warFame||0)+25;
  arr.push("你的军功簿上多了一行：裂隙口，守住了。");
  arr.push("那晚的营火特别旺，因为要烧掉沾了深渊血的东西。");
  return {place:"裂隙口营地", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};


  
  
  
  
  
  
  nodes["v65_merc"] = function(){
  var arr=["佣兵公会的墙上钉满单子，字迹潦草。"];
  var jobs=(typeof S!=='undefined'&&S.mercenary)?S.mercenary.jobs:[];
  if(jobs.length){ arr.push("你手上有"+jobs.length+"张单子还没结。"); }
  return {place:"佣兵公会", text:function(){return arr;}, options:[
    { t:"守城单（80金）", go:"v65_merc_guard" },
    { t:"护送单（100金）", go:"v65_merc_escort" },
    { t:"攻寨单（200金）", go:"v65_merc_siege" },
    { t:"灭口单（300金）", go:"v65_merc_assassin" },
    { t:"军功兑换", go:"v65_merc_exchange" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_exchange"] = function(){
  var arr=["公会的柜台后摆着一排货架。"];
  arr.push("军功："+(typeof S!=='undefined'?(S.warFame||0):0));
  arr.push("精甲60 战技卷轴80 战功头衔120 敌情情报50");
  return {place:"佣兵公会", text:function(){return arr;}, options:[
    { t:"换精甲", go:"v65_merc_ex_armor" },
    { t:"换卷轴", go:"v65_merc_ex_scroll" },
    { t:"换头衔", go:"v65_merc_ex_title" },
    { t:"换情报", go:"v65_merc_ex_intel" },
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_ex_armor"] = function(){
  var ok=(typeof v65_exchange==='function')&&v65_exchange('armor');
  return {place:"佣兵公会", text:function(){return ["一件军中精甲，护心镜上有一道旧劈痕。", ok?"你换上它，觉得肩头沉了些。":"军功不够。柜台后的姑娘没抬头，「攒够了再来。」"];}, options:[
    { t:"离开", go:"v65_merc_exchange" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_ex_scroll"] = function(){
  var ok=(typeof v65_exchange==='function')&&v65_exchange('scroll');
  return {place:"佣兵公会", text:function(){return ["一卷战技抄本，边角被翻得起了毛。", ok?"你收下抄本，里面记着一招旧时代的阵前技。":"军功不够。"];}, options:[
    { t:"离开", go:"v65_merc_exchange" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_ex_title"] = function(){
  var ok=(typeof v65_exchange==='function')&&v65_exchange('title');
  return {place:"佣兵公会", text:function(){return ["一份盖了章的战功文书。", ok?"从今天起，酒馆里的人开始叫你「百战余生」。":"军功不够。"];}, options:[
    { t:"离开", go:"v65_merc_exchange" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_ex_intel"] = function(){
  var ok=(typeof v65_exchange==='function')&&v65_exchange('intel');
  return {place:"佣兵公会", text:function(){return ["一张叠了四折的纸，字迹是倒着写的。", ok?"你展开看，是某支军队的调动痕迹。纸角写着「阅后即焚」。":"军功不够。"];}, options:[
    { t:"离开", go:"v65_merc_exchange" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_guard"] = function(){
  if(typeof v65_takeJob!=='function'||!v65_takeJob('guard')){ return {place:"佣兵公会", text:function(){return ["这张单你已经接了。"];}, options:[{ t:"离开", go:"v65_merc" }]}; }
  return {place:"城墙上", text:function(){return ["你替某座小城守了三天垛口。", "第三天夜里，城外只有风。风里没带刀兵声，这单算是太平钱。"];}, options:[
    { t:"领赏", go:"v65_merc_done_guard" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_done_guard"] = function(){
  var ok=(typeof v65_finishJob==='function')&&v65_finishJob('guard');
  return {place:"佣兵公会", text:function(){return ["守城单结清了。", "账房点了八十金给你，又补了一句：「城守得住，是因为你。」"];}, options:[
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_escort"] = function(){
  if(typeof v65_takeJob!=='function'||!v65_takeJob('escort')){ return {place:"佣兵公会", text:function(){return ["这张单你已经接了。"];}, options:[{ t:"离开", go:"v65_merc" }]}; }
  return {place:"商路上", text:function(){return ["你护送一队商货从东境到自由港。", "路上有两次林子里有动静，你按着刀柄走了一路，没出事。", "商队头子临别塞给你一小袋钱：「下次还雇你。」"];}, options:[
    { t:"领赏", go:"v65_merc_done_escort" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_done_escort"] = function(){
  var ok=(typeof v65_finishJob==='function')&&v65_finishJob('escort');
  return {place:"佣兵公会", text:function(){return ["护送单结清了。", "钱袋的系绳上打了个商队头子的结，你留着没拆。"];}, options:[
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_siege"] = function(){
  if(typeof v65_takeJob!=='function'||!v65_takeJob('siege')){ return {place:"佣兵公会", text:function(){return ["这张单你已经接了。"];}, options:[{ t:"离开", go:"v65_merc" }]}; }
  return {place:"山口匪寨", text:function(){return ["攻寨那天，你从侧面摸了上去。", "匪首被绑在柱子上时还在骂：「雇你们的人也没干净到哪去。」", "你没接话。寨子里搜出两袋粮食，你分了一袋给山下的村子。"];}, options:[
    { t:"领赏", go:"v65_merc_done_siege" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_done_siege"] = function(){
  var ok=(typeof v65_finishJob==='function')&&v65_finishJob('siege');
  return {place:"佣兵公会", text:function(){return ["攻寨单结清了，二百金，够吃半年。", "柜台上多了一袋山货，不知是谁放的。"];}, options:[
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_assassin"] = function(){
  if(typeof v65_takeJob!=='function'||!v65_takeJob('assassin')){ return {place:"佣兵公会", text:function(){return ["这张单你已经接了。"];}, options:[{ t:"离开", go:"v65_merc" }]}; }
  return {place:"夜巷", text:function(){return ["灭口单。目标是个告密者，住在城西的窄巷。", "你翻进院子的时候，他正在给一盆花浇水。", "月光下他抬头看你，没喊，只说了句：「该来的来了。」", "你把刀收回鞘，说：「有人出一大笔钱，要你永远闭嘴——所以我来了，告诉你，跑吧。」"];}, options:[
    { t:"放他走", go:"v65_merc_done_assassin" },
    { t:"动手", go:"v65_merc_done_assassin_kill" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_done_assassin"] = function(){
  var ok=(typeof v65_finishJob==='function')&&v65_finishJob('assassin');
  return {place:"佣兵公会", text:function(){return ["你回去复命，说人已经处理了。", "雇主付了钱。你数钱的时候想，那个人现在大概已经出了城。", "这三百金，拿得不怎么踏实。"];}, options:[
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_merc_done_assassin_kill"] = function(){
  var ok=(typeof v65_finishJob==='function')&&v65_finishJob('assassin');
  if(typeof v65_grudgeAdd==='function'){ v65_grudgeAdd('你','unknown','death',2,'夜巷里的一桩灭口单'); }
  return {place:"夜巷", text:function(){return ["花盆摔在地上，碎了。", "你把他埋在后院，把水浇在那盆花上——花还活着，人没了。", "回去领了钱。夜里你洗了很久的手。"];}, options:[
    { t:"离开", go:"v65_merc" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_cmd_appoint"] = function(){
  var arr=["军中议事，需要一个能领兵的将领。"];
  var bond=(typeof S!=='undefined'&&S.strongBond)||{};
  var names=Object.keys(bond);
  var found=[];
  for(var i=0;i<names.length;i++){ if(bond[names[i]]>=3){ found.push(names[i]); } }
  if(found.length){
    var n=found[0];
    arr.push("你想到一个人："+n+"。他/她与你有旧，信得过。");
    if(!S.v65Heard) S.v65Heard={};
    if(!S.v65Heard.cmdAppointed){ S.v65Heard.cmdAppointed=n; arr.push("你把将印交了出去。"); }
    else { arr.push("将印已经有人拿了。"); }
  } else {
    arr.push("你翻遍记忆，想不出一个信得过又拿得起刀的名字。");
    arr.push("「再想想。」你对自己说。");
  }
  return {place:"军帐", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_cmd_event1"] = function(){
  var arr=["军中传来风声：有人不服你。"];
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  if(heard.cmdAppointed){ arr.push("你任命的将官在营里替你挡了几句。话传到你耳朵里，字句已经被人改过。"); }
  else { arr.push("你资历尚浅，老卒们在你背后交换眼神。"); }
  arr.push("夜里有人在你帐外放了一双新靴子，没留名。");
  return {place:"军帐", text:function(){return arr;}, options:[
    { t:"穿上", go:"v65_cmd_event2" },
    { t:"放着", go:"v65_cmd_event2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_cmd_event2"] = function(){
  var arr=["战功分配那天，帐里吵起来。"];
  arr.push("「他出的力最少，凭什么拿头一份？」有人拍桌子。");
  return {place:"军帐", text:function(){return arr;}, options:[
    { t:"按功分配", go:"v65_cmd_event3" },
    { t:"按资历分配", go:"v65_cmd_event3" },
    { t:"把功劳推给全军", go:"v65_cmd_event3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_cmd_event3"] = function(){
  var arr=["吵完，帐里安静了。"];
  arr.push("你看见那个拍桌子的老兵，把一碗热汤推到你面前。");
  arr.push("他没说谢，你也没说。这就算翻篇了。");
  return {place:"军帐", text:function(){return arr;}, options:[
    { t:"回营", go:"v65_camp" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_cmd_duel"] = function(){
  var arr=["阵前斗将。对面那人报了自己的名字，全场都听见了。"];
  var r=45+Math.floor(Math.random()*55);
  var heard=(typeof S!=='undefined'&&S.v65Heard)||{};
  if(heard["v65_art:courage"]){ r+=2; }
  if(r>=60){
    arr.push("你赢了。对面的人被拖回去时，人群里有人喝了一声倒彩——不是给你的。");
    S.warFame=(S.warFame||0)+8;
  } else {
    arr.push("你输了。只输半招。");
    arr.push("对面的人没有补刀，只是看了你一眼：「回去练练，你还有的学。」");
    if(typeof S!=='undefined'&&S.militaryCareer){ S.militaryCareer.morale=Math.max(10,(S.militaryCareer.morale||70)-5); }
  }
  return {place:"阵前", text:function(){return arr;}, options:[
    { t:"回阵", go:"v65_battle_clash2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_view"] = function(){
  var arr=["战后的大陆，有些地方还带着伤。"];
  var scars=(typeof S!=='undefined'&&S.warScars)?S.warScars:{};
  var keys=Object.keys(scars);
  if(keys.length){
    for(var i=0;i<keys.length;i++){
      var s=scars[keys[i]];
      arr.push(keys[i]+"："+(s.state==='ruin'?"废墟":s.state==='refugee'?"难民潮":s.state==='orphan'?"孤儿":s.state==='veteran'?"老兵":"伤"));
    }
  } else {
    arr.push("暂时没有记录在册的伤城。");
  }
  return {place:"旅途", text:function(){return arr;}, options:[
    { t:"去一处伤城看看", go:"v65_scar_ruin" },
    { t:"离开", go:"w64_war_return" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_ruin"] = function(){
  var arr=["城墙塌了半边，灰堆里插着半面旗。"];
  arr.push("有个老婆婆在废墟里翻找，翻出一只铁锅，锅底烧穿了。她抱着锅，站在那儿，没哭。");
  return {place:"伤城", text:function(){return arr;}, options:[
    { t:"帮她找", go:"v65_scar_ruin2" },
    { t:"给她钱", go:"v65_scar_ruin2" },
    { t:"走", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_ruin2"] = function(){
  var arr=["你帮她翻了一阵，翻出一把锈钥匙。"];
  arr.push("她攥着钥匙，忽然说：「这是我家的。」说完才哭出来。");
  if(typeof S!=='undefined'){ S.gold=(S.gold||0)-5; }
  arr.push("你留了点钱在锅边，走了。");
  return {place:"伤城", text:function(){return arr;}, options:[
    { t:"离开", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_refugee"] = function(){
  var arr=["城门口的难民排成长队，等着领粥。"];
  arr.push("粥棚的桶见底了。队伍里没有人吵，都安静地等着。");
  return {place:"城门口", text:function(){return arr;}, options:[
    { t:"捐粮", go:"v65_scar_refugee2" },
    { t:"帮忙维持秩序", go:"v65_scar_refugee2" },
    { t:"绕开", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_refugee2"] = function(){
  var arr=["你做了能做的。"];
  if(typeof S!=='undefined'){ S.gold=(S.gold||0)-10; if(!S.worldFame) S.worldFame={}; S.worldFame.mercy=(S.worldFame.mercy||0)+2; }
  arr.push("有人往你手里塞了一小块饼，是刚从自己那份里掰的。");
  arr.push("你收下了。凉了，但是沉的。");
  return {place:"城门口", text:function(){return arr;}, options:[
    { t:"离开", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_orphan"] = function(){
  var arr=["废墟边，一个孩子抱着个布包，不肯松手。"];
  arr.push("布包里是半块干粮和一张画——画上是两个人，线条歪歪扭扭。");
  return {place:"伤城", text:function(){return arr;}, options:[
    { t:"问他名字", go:"v65_scar_orphan2" },
    { t:"给他吃的", go:"v65_scar_orphan2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_orphan2"] = function(){
  var arr=["孩子不肯说名字，只说要等人。"];
  arr.push("「等谁？」你问。");
  arr.push("「等他们回来。」他说。你不知道他说的「他们」还在不在世上。");
  if(typeof S!=='undefined'){ S.gold=(S.gold||0)-3; }
  arr.push("你留下一点吃的，走了。走了很远，还能感觉那道目光在背后。");
  return {place:"伤城", text:function(){return arr;}, options:[
    { t:"离开", go:"v65_scar_view" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_veteran"] = function(){
  var arr=["酒馆角落，一个老兵在擦他的空袖管。"];
  arr.push("他看见你腰间的军牌：「打过仗？」");
  return {place:"酒馆", text:function(){return arr;}, options:[
    { t:"点头", go:"v65_scar_veteran2" },
    { t:"摇头", go:"v65_scar_veteran2" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_veteran2"] = function(){
  var arr=["老兵把酒碗推过来一半：「喝。」"];
  arr.push("他讲了一场你没听过的仗，地名已经在地图上找不到了。");
  arr.push("讲完他问你：「你还记得你为什么打仗吗？」");
  return {place:"酒馆", text:function(){return arr;}, options:[
    { t:"沉默", go:"v65_scar_veteran3" },
    { t:"说一个理由", go:"v65_scar_veteran3" }
  ]};
};

  
  
  
  
  
  
  nodes["v65_scar_veteran3"] = function(){
  var arr=["老兵听完，没评价。"];
  arr.push("他站起来，拍了拍你的肩：「记住你今天说的。人最怕忘了这个。」");
  arr.push("他走了。桌上留着一枚铜钱，正面朝上。");
  return {place:"酒馆", text:function(){return arr;}, options:[
    { t:"收下铜钱", go:"v65_scar_view" }
  ]};
};


  
  
  
  
  
  
  Object.assign(window.N || {}, nodes);
  if (window.v62_chunk_loader) window.v62_chunk_loader.mark("war");
})();
