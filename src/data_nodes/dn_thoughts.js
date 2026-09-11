/* =========================================================================
 * dn_thoughts.js — T 工程 心念殿（超大型剧情八工程 · 工程 T）
 * 20-30 个可内化概念：接触（flag/visited 解锁）→ 内化（cost 天）→ 完成（buff/debuff + 专属正文）
 * 机制：S.thoughts 独立键（applyDefaults 兜底）；v93t_thoughtTick 每节点推进；只读注入零判定改动
 * 铁律：saveVersion=48 不变；不触碰判定公式/choose/存档语义；V66 白描；禁 30 治理词
 * ========================================================================= */

window.THOUGHTS_V93T = {
"t_anchor_true":{concept:"七锚真相",source:"七锚之约",cost:4,
  buff:{SPR:2},debuff:{},done:"你终于想通：七锚不是锁，是门闩。守着它的不是神，是人。",
  unlock:{flags:["anchor_1"],visited:["第三哨"]},
  line:{match:["锚","封印","地脉"],tpl:["念头在你心里落定：七锚之下压着的东西，比你想象的大——也比你想象的旧。"]}},
"t_goldscale_guard":{concept:"金秤守门人",source:"金秤家族",cost:5,
  buff:{INT:2},debuff:{},done:"金秤不是姓氏，是担子。一代人没等到开门，就传给下一代继续等。",
  unlock:{flags:["goldscale_seen"],visited:["承天城"]},
  line:{match:["金秤","无字碑","守门"],tpl:["你想起金先生擦碟子的手——那双守了三代人的手。你现在懂那沉默的分量了。"]}},
"t_oracle_meaning":{concept:"神谕的解法",source:"兽人神谕",cost:5,
  buff:{SPR:2,INT:1},debuff:{},done:"神谕不是预言，是提醒。它告诉你该往哪看，路还得自己走。",
  unlock:{flags:[],visited:["兽人草原","圣山"]},
  line:{match:["神谕","预言","狼骨"],tpl:["神谕的话在你心里过了第三遍：它不是答案，是让你别停下追问的那根刺。"]}},
"t_war_view":{concept:"战争的账本",source:"七阶段战争",cost:4,
  buff:{CON:2},debuff:{},done:"战争从来没有赢家，只有活下来的和没活下来的。账要算，但别把命算进去。",
  unlock:{flags:["i_war_army"],visited:["北境王都","铁门关"]},
  line:{match:["战争","战线","烽火"],tpl:["你见过战线一寸一寸往前拱的样子，也见过它退起来有多快。账本在心里，别丢。"]}},
"t_church_logic":{concept:"审判的纹路",source:"光明教会",cost:4,
  buff:{INT:2},debuff:{},done:"圣城的审判不是对错，是秩序。想活着走进去，得先读懂它的纹路。",
  unlock:{flags:["church_wanted","judge_waiting"],visited:["圣辉城"]},
  line:{match:["审判","异端","圣城"],tpl:["圣城钟声敲响时，你不再只听声——你听得出它底下那套秩序的脚步。"]}},
"t_chen_old":{concept:"晨天故都的灰",source:"晨天城",cost:5,
  buff:{INT:2},debuff:{},done:"晨天故都的灰里埋着王朝的账。旧墙根下的低语，比史书写得真。",
  unlock:{flags:["led_b5_07"],visited:["承天城"]},
  line:{match:["晨天","故都","王朝"],tpl:["承天城老墙根下的低语又响起来——你现在能听懂那些压低嗓子的名字了。"]}},
"t_failrep_view":{concept:"蒙羞者的镜子",source:"失败与污名",cost:3,
  buff:{CHA:2},debuff:{},done:"被记过名的人，反而看得清谁真谁假。污点擦不掉，但它能当镜子。",
  unlock:{flags:["f_failrep_cove_done","f_failpath_warwall_liu"],visited:[]},
  line:{match:["牢房","名册","污点","逃兵"],tpl:["你顶着那个污点走了这么远——它压过你，也教会你看人先看落难时。"]}},
"t_silver_crisis":{concept:"商路与命脉",source:"银穗商路",cost:3,
  buff:{INT:2},debuff:{},done:"商路断了，城就饿了。银穗不是钱的事，是千万张嘴的事。",
  unlock:{flags:["merchant_saved"],visited:["承天城","自由城邦"]},
  line:{match:["商路","银穗","粮价"],tpl:["你算了算粮价，又想了想商路——钱的事背后，都是人的事。"]}},
"t_purge_view":{concept:"净化的代价",source:"净化令",cost:4,
  buff:{SPR:2},debuff:{},done:"净化令烧掉的不只是异端，还有半座城的影子。圣火照得亮广场，照不亮人心。",
  unlock:{flags:["church_wanted"],visited:["圣辉城"]},
  line:{match:["净化","圣火","异端"],tpl:["圣火还在记忆里烧。你终于分清：烧掉的东西，有些本该烧，有些只是影子的替身。"]}},
"t_seal_danger":{concept:"深渊的呼吸",source:"深渊封印",cost:5,
  buff:{SPR:2,CON:1},debuff:{},done:"封印不是铁墙，是绷带。你能感觉到下面那东西的呼吸——它不急，它有的是时间。",
  unlock:{flags:["anchor_2"],visited:["第三哨","铁门关"]},
  line:{match:["深渊","封印","裂隙"],tpl:["你下过矿洞，见过裂隙的边。那底下有呼吸声，慢而稳——你记住它的节拍了。"]}},
"t_academy_bound":{concept:"知识的边界",source:"艾尔达学院",cost:4,
  buff:{INT:2},debuff:{},done:"学院教得了咒语，教不了人心。知识有边界，边界外靠你自己趟。",
  unlock:{flags:[],visited:["北境王都"]},
  line:{match:["学院","禁书","课程"],tpl:["禁书区那扇门在你心里留了个影——你知道，有些书不是不让读，是读了就得自己负责。"]}},
"t_free_city":{concept:"自由城的规矩",source:"自由城邦",cost:3,
  buff:{CHA:2},debuff:{},done:"自由城的自由是有价的：你的钱袋、你的刀、你的嘴，都得自己看好。",
  unlock:{flags:["fc_arrived"],visited:["自由城邦"]},
  line:{match:["自由城","酒馆","商队"],tpl:["你站在自由城的街口——这里没人替你拿主意，也没人替你扛。这就是它的规矩。"]}},
"t_desert_water":{concept:"一滴水的王座",source:"死亡沙漠",cost:4,
  buff:{CON:2},debuff:{},done:"在沙漠，谁手里有井，谁就是王。水比金贵，命比水贵。",
  unlock:{flags:[],visited:["死亡沙漠","绿洲"]},
  line:{match:["沙漠","绿洲","水"],tpl:["你记得绿洲水位线比去年低了一掌。在沙漠待过的人，看水是看命的。"]}},
"t_west_storm":{concept:"元素风暴的语法",source:"西境元素荒原",cost:4,
  buff:{SPR:2},debuff:{},done:"风暴有它的脾气和路数。看懂风的人，能走在风暴的指缝里。",
  unlock:{flags:[],visited:["西境","元素荒原"]},
  line:{match:["风暴","元素","荒原"],tpl:["你捻过西境的沙，看过风暴的走向——现在你听风声，像听人说话。"]}},
"t_church_saint":{concept:"圣痕的重量",source:"圣痕司",cost:4,
  buff:{SPR:2},debuff:{},done:"圣痕是荣耀，也是锁。替你挡刀的人，未必想当圣人。",
  unlock:{flags:[],visited:["圣辉城"]},
  line:{match:["圣痕","牺牲","圣物"],tpl:["你见过圣痕司那面墙——每一道痕都有人扛过。荣耀的分量，是拿命称的。"]}},
"t_dwarf_iron":{concept:"铁的分量",source:"矮人山国",cost:3,
  buff:{CON:2},debuff:{},done:"矮人信铁不信话。铁会弯，会断，但不会说谎。",
  unlock:{flags:[],visited:["铁砧议会","矮人山国"]},
  line:{match:["矮人","铁砧","锻造"],tpl:["你想起那把锤子落下的声音——矮人的道理都在铁里，掂一掂就明白。"]}},
"t_elf_balance":{concept:"林的平衡",source:"精灵林邦",cost:4,
  buff:{SPR:2},debuff:{},done:"精灵不砍树，也不让树长进屋里。万物有位，越界就乱。",
  unlock:{flags:[],visited:["精灵林"]},
  line:{match:["精灵","林","圣树"],tpl:["你在林子里学会的：别急，别贪，别越界。林会记住每个越界的人。"]}},
"t_north_frost":{concept:"冰雪的法则",source:"北境",cost:3,
  buff:{CON:2},debuff:{},done:"北境的雪不跟人讲道理：走错一步，它就不客气。诚实、忍耐、留后手。",
  unlock:{flags:[],visited:["北境王都","铁门关","第三哨"]},
  line:{match:["雪","北境","烽火"],tpl:["北境的冷教会你的：雪地里留后路，比留面子有用。"]}},
"t_east_order":{concept:"官场的台阶",source:"东境承天",cost:4,
  buff:{INT:2},debuff:{},done:"承天城的台阶一级一级数不清。爬上去的人，先学会了弯腰。",
  unlock:{flags:[],visited:["承天城"]},
  line:{match:["承天","官署","科举"],tpl:["你数过承天城官署的石阶——每一级都有人跪过、争过、退过。"]}},
"t_orc_blood":{concept:"血脉的荣耀",source:"兽人诸部",cost:3,
  buff:{STR:2},debuff:{},done:"兽人不问你出身，问你能不能扛。荣耀是扛出来的，不是祖上传的。",
  unlock:{flags:[],visited:["兽人草原","黑石营"]},
  line:{match:["兽人","狼旗","草原"],tpl:["你学会兽人的回礼：握拳，捶胸，看对方的眼睛。这一下，比十句话都重。"]}}
};

/* ===== T-1 心念殿引擎（只读判定 + 独立键写入；不触碰判定公式） ===== */
window.v93t_checkUnlock = function(tid){
  try{
    var t = window.THOUGHTS_V93T[tid];
    if(!t || !t.unlock) return false;
    var f = t.unlock.flags || [];
    for(var i=0;i<f.length;i++){ if(S.flags && S.flags[f[i]]) return true; }
    var v = t.unlock.visited || [];
    for(var j=0;j<v.length;j++){ if(S.visited && S.visited[v[j]]) return true; }
    return false;
  }catch(e){ return false; }
};

window.v93t_knownThoughts = function(){
  var out = [];
  for(var k in window.THOUGHTS_V93T){ if(window.v93t_checkUnlock(k)) out.push(k); }
  return out;
};

window.v93t_startThought = function(tid){
  try{
    if(!S.thoughts) S.thoughts = {};
    var t = window.THOUGHTS_V93T[tid];
    if(!t || S.thoughts[tid] || !window.v93t_checkUnlock(tid)) return false;
    S.thoughts[tid] = {stage:"internalizing", progress:0};
    return true;
  }catch(e){ return false; }
};

/* 每节点推进（注入链 t1inj；写 S.thoughts 属系统状态，非判定） */
window.v93t_thoughtTick = function(){
  try{
    if(!S || !S.thoughts) return;
    for(var k in S.thoughts){
      var st = S.thoughts[k];
      if(!st || st.stage !== "internalizing") continue;
      var t = window.THOUGHTS_V93T[k];
      if(!t) continue;
      st.progress = (st.progress||0) + 1;
      if(st.progress >= t.cost){
        st.stage = "internalized";
        if(!S.flags) S.flags = {};
        S.flags["t_" + k + "_done"] = true;
        /* 结算 buff/debuff（独立键 attrs 微调，属心念殿系统效果） */
        var b = t.buff||{}; var d = t.debuff||{};
        for(var bk in b){ if(S.attrs && b[bk]) S.attrs[bk] = Math.min(80, (S.attrs[bk]||20) + b[bk]); }
        for(var dk in d){ if(S.attrs && d[dk]) S.attrs[dk] = Math.max(5, (S.attrs[dk]||20) + d[dk]); }
      }
    }
  }catch(e){}
};

/* 内化后专属正文注入（只读；匹配 place 关键词；同日一次） */
window.v93t_thoughtLine = function(node){
  try{
    if(!S || !S.thoughts) return null;
    if(!window.__t1done) window.__t1done = {};
    var pl = (node && node.place) ? String(node.place) : "";
    var out = [];
    for(var k in window.THOUGHTS_V93T){
      var st = S.thoughts[k];
      if(!st || st.stage !== "internalized") continue;
      var key = "t_" + k + "_done";
      if(!S.flags || !S.flags[key]) continue;
      var t = window.THOUGHTS_V93T[k];
      if(!t || !t.line) continue;
      var matched = false;
      for(var i=0;i<(t.line.match||[]).length;i++){ if(pl.indexOf(t.line.match[i]) >= 0){ matched = true; break; } }
      if(!matched) continue;
      var dk = "line::" + pl;
      if(window.__t1done[dk]) continue;
      window.__t1done[dk] = 1;
      var tp = t.line.tpl || [];
      if(tp.length){ out.push("〔心念·" + t.concept + "〕" + tp[0]); }
      if(out.length >= 2) break;
    }
    return out.length ? out : null;
  }catch(e){ return null; }
};

/* 心念殿面板（设置弹窗内渲染；T-1 UI） */
window.v93t_renderThoughts = function(){
  var known = window.v93t_knownThoughts();
  var html = '<h4 style="color:#5a4a10;margin:16px 0 8px">心念殿</h4>';
  html += '<div style="font-size:11px;color:var(--dim);margin:4px 0 8px">路上听见的道理，想通了就是你的。内化需要数日，完成后获得永久加成与专属心念。</div>';
  if(!known.length){
    html += '<div style="font-size:12px;color:var(--dim)">尚未触及任何可内化的心念——多去走一走，见一见，听一听。</div>';
  } else {
    for(var i=0;i<known.length;i++){
      var k = known[i]; var t = window.THOUGHTS_V93T[k]; var st = S.thoughts && S.thoughts[k];
      var stateTxt, btn;
      if(!st){ stateTxt = '<span style="color:#7a6a20">待内化</span>'; btn = '<button class="btn" style="font-size:11px;padding:2px 8px" onclick="v93t_startThought(\'' + k + '\');v34_openSettings()">开始内化</button>'; }
      else if(st.stage==="internalizing"){ stateTxt = '<span style="color:#a05020">内化中 ' + (st.progress||0) + '/' + t.cost + ' 日</span>'; btn = ''; }
      else { stateTxt = '<span style="color:#206020">已内化</span>'; btn = ''; }
      html += '<div style="border-bottom:1px solid rgba(90,74,16,0.15);padding:6px 0">';
      html += '<div style="font-weight:600;font-size:13px">' + t.concept + ' <span style="font-weight:400;color:var(--dim);font-size:11px">（' + t.source + '）</span> ' + stateTxt + '</div>';
      html += '<div style="font-size:11px;color:var(--dim)">' + (t.done || "") + '</div>' + btn + '</div>';
    }
  }
  return html;
};
