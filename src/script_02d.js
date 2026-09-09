/*v76mod*/

(function(){
  window.v52_ensureDefaults = function(){
    try{
      if(!S) return;
      if(window.v51_ensureDefaults) v51_ensureDefaults();
      if(!S.orgRep) S.orgRep = {};
      if(!S.orgRank) S.orgRank = {};
      if(S.peakPts===undefined) S.peakPts = 0;
      if(!S.peak) S.peak = {};
      if(S.deified===undefined) S.deified = 0;
      if(!S.godRival) S.godRival = {};
      if(!S.endingFlags) S.endingFlags = {};
      if(!S.orgDone) S.orgDone = {};
      if(!S.rivalDone) S.rivalDone = {};
      if(!S.godTrial) S.godTrial = {};
      if(S.artifact===undefined) S.artifact = "";
      if(!S.orgDone) S.orgDone = {};
      if(!S.rivalDone) S.rivalDone = {};
      if(!S.godTrial) S.godTrial = {};
    }catch(e){}
  };
  function v52_jobCn(){ return S.job || ""; } window.v52_jobCn=v52_jobCn;
  function v52_orgOf(){ return ORG_V52[v52_jobCn()] || null; }
  /* ---------- 场景判定 ---------- */
  window.v52_sceneOf = function(sk, a){
    try{
      sk = sk || ""; a = a || "";
      if(/剑|刀|斧|枪|弓|箭|格斗|战技|盾|锤|打击|徒手|武器|搏斗|砍|刺|劈|标枪|匕首|棍/.test(sk) || a==="STR") return "战斗";
      if(/说服|话术|交涉|魅力|魅惑|威吓|欺骗|表演|谈判|察言|洞察|唬弄|套话|安抚|安抚人心/.test(sk) || a==="CHA") return "社交";
      if(/观察|搜索|潜行|追踪|侦察|感知|聆听|开锁|侦查|偷|扒|探查|探索|辨认足迹|查找/.test(sk) || a==="INT") return "探索";
      if(/议价|估价|鉴定|讨价|砍价|销赃|商|行情|盘点|核算|识货/.test(sk)) return "交易";
      return null;
    }catch(e){ return null; }
  };
  window.v52_featApply = function(opt, t){
    var out = {t:t, labels:[], reroll:false};
    try{
      if(!S || !opt || !opt.check) return out;
      var sk = opt.check.sk || "", a = opt.check.a || "";
      var scene = v52_sceneOf(sk, a);
      if(!scene) return out;
      var map = FEAT_EFFECT_V52 || [];
      for(var i=0;i<map.length;i++){
        var m = map[i];
        if(!m || m.scene!==scene) continue;
        if(m.src==='artifact'){ if(S.artifact !== S.job) continue; }
        else if(m.src==='peak'){ if(!(S.peak && S.peak[m.flag])) continue; }
        else { if(!(S.feats && S.feats[m.flag])) continue; }
        if(m.type==='bonus'){ out.t += m.value; out.labels.push(m.label + (m.value>0?' +':' ') + m.value); }
        else if(m.type==='floor'){ if(out.t < m.value){ out.t = m.value; out.labels.push(m.label + ' · 保底'); } }
        else if(m.type==='pct'){ out.t = Math.round(out.t * (1 + m.value)); out.labels.push(m.label + (m.value>0?' +':' ') + Math.round(m.value*100) + '%'); }
        else if(m.type==='reroll'){ out.reroll = true; out.labels.push(m.label + ' · 可重掷'); }
      }
      if(window.v55_skillApply){ try{ var _v55r = v55_skillApply(opt, out.t); out.t = _v55r.t; for(var _i55=0;_i55<_v55r.labels.length;_i55++){ out.labels.push(_v55r.labels[_i55]); } if(_v55r.reroll) out.reroll = true; }catch(e){} }
      try{ if(window.v57_featApply){ var _v57r = v57_featApply(opt, out.t); out.t = _v57r.t; for(var _i57=0;_i57<_v57r.labels.length;_i57++){ out.labels.push(_v57r.labels[_i57]); } if(_v57r.reroll) out.reroll = true; } }catch(e){}
      out.t = Math.max(5, Math.min(98, out.t));
      return out;
    }catch(e){ return {t:t, labels:[], reroll:false}; }
  };
  window.v52_breakthroughBonus = function(part){
    try{
      if(!S) return 0;
      var map = FEAT_EFFECT_V52 || [];
      var sum = 0;
      for(var i=0;i<map.length;i++){
        var m = map[i];
        if(!m || m.scene!=='修炼' || m.target!==part) continue;
        if(m.src==='artifact'){ if(S.artifact !== S.job) continue; }
        else { if(!(S.feats && S.feats[m.flag])) continue; }
        if(m.type==='bonus') sum += m.value;
        else if(m.type==='pct') sum += Math.round(55 * m.value);
      }
      try{ if(window.v57_breakthroughBonus) sum += v57_breakthroughBonus(part); }catch(e){}
      return sum;
    }catch(e){ return 0; }
  };
  /* ---------- 组织机制 ---------- */
  window.v52_orgRep = function(){ try{ v52_ensureDefaults(); return S.orgRep[v52_jobCn()]||0; }catch(e){ return 0; } };
  window.v52_orgRank = function(){ try{ v52_ensureDefaults(); return S.orgRank[v52_jobCn()]||0; }catch(e){ return 0; } };
  window.v52_orgRankCn = function(){
    try{
      var org = v52_orgOf(); var rk = v52_orgRank();
      if(!org) return "";
      return (org.ranks && org.ranks[rk]) ? org.ranks[rk] : (rk>0 ? "无职" : "未入会");
    }catch(e){ return ""; }
  };
  window.v52_orgAddRep = function(n){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      S.orgRep[job] = (S.orgRep[job]||0) + n;
      if(window.flashMsg) flashMsg('组织声望 +' + n);
    }catch(e){}
  };
  window.v52_orgPanel = function(){
    try{
      v52_ensureDefaults();
      var org = v52_orgOf();
      var job = v52_jobCn();
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var h = '';
      if(!org){
        h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ 组织 ━━</div>';
        h += '<div style="color:var(--text-primary);font-size:14px;line-height:1.7;">你行走于 <b>' + job + '</b> 之道，却尚未与任何一方势力缔结盟约。\n大陆上各职业都有自己的组织——若想寻一处可托付、可依靠的归所，不妨踏上旅途去叩一叩那些门。</div>';
        st.innerHTML = h;
        var b = document.createElement('button'); b.className='opt';
        b.innerHTML = '<span class="od">◆</span> 返回';
        b.onclick = function(){ try{ closePanel(); }catch(e){} };
        op.appendChild(b);
        return;
      }
      var rep = v52_orgRep(), rk = v52_orgRank();
      var rankCn = v52_orgRankCn();
      h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ ' + org.cn + ' ━━</div>';
      h += '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px;">' + (org.motto||'') + '</div>';
      h += '<div style="margin:4px 0 2px;font-size:13px;color:var(--text-secondary);">据点：' + (org.power||'') + ' · 领袖：' + (org.leader||'') + '</div>';
      h += '<div style="margin:6px 0 2px;font-size:13px;color:var(--text-secondary);">你的位阶：<span style="color:var(--text-gold);font-weight:bold;">' + rankCn + '</span> · 声望 <span style="color:var(--text-gold);">' + rep + '</span></div>';
      h += '<div style="height:8px;background:var(--bg-input);border-radius:4px;overflow:hidden;margin:4px 0 8px;border:1px solid var(--border);"><div style="height:100%;width:' + Math.min(100, Math.round(rep/150*100)) + '%;background:linear-gradient(90deg,#8b6f47,#d4a017);"></div></div>';
      if(rk===0){
        h += '<div style="padding:8px 10px;background:var(--bg-panel2);border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--text-primary);line-height:1.7;margin-bottom:6px;">' + (org.entry || '') + '</div>';
      } else {
        h += '<div style="margin:8px 0 4px;font-size:14px;color:var(--text-secondary);">—— 组织事务 ——</div>';
        var tasks = org.tasks || [];
        tasks.forEach(function(tsk){
          var done = S.orgDone && S.orgDone[tsk.id];
          var locked = tsk.needRank ? (rk < tsk.needRank) : false;
          h += '<div style="margin:6px 0;padding:8px 10px;background:var(--bg-panel2);border:1px solid ' + (done?'var(--success)':locked?'var(--border)':'var(--border)') + ';border-radius:8px;' + (done?'':'') + '">'
            + '<div style="font-size:14px;color:var(--text-primary);">' + tsk.title + (done?' <span style="color:var(--success);font-size:12px;">✓ 已了</span>':locked?' <span style="color:var(--text-muted);font-size:12px;">（需位阶·'+org.ranks[tsk.needRank]+'）</span>':'') + '</div>'
            + '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + (tsk.desc||'') + '</div>'
            + ( (!done && !locked) ? '<button class="btn btn-sm" style="margin-top:6px;" onclick="v52_orgRun(\'' + tsk.id + '\')">前往处理</button>' : '' )
            + '</div>';
        });
      }
      st.innerHTML = h;
      var mk = function(t, fn){
        var b = document.createElement('button'); b.className='opt';
        b.innerHTML = '<span class="od">◆</span> ' + t;
        b.onclick = fn;
        op.appendChild(b);
      };
      if(rk===0){
        mk('加入组织 · ' + org.cn, function(){ v52_orgJoin(); });
      }
      if(rk>=3 && !S.deified && org.ranks.length>=5){
        mk('神座试炼 · 叩问神座', function(){ v52_godTrial(); });
      }
      mk('返回游戏', function(){ try{ closePanel(); }catch(e){} });
    }catch(e){ console.error(e); }
  };
  window.v52_orgJoin = function(){
    try{
      v52_ensureDefaults();
      var org = v52_orgOf();
      if(!org) return;
      var job = v52_jobCn();
      S.orgRank[job] = 1;
      S.orgRep[job] = 10;
      if(window.flashMsg) flashMsg('你已成为 ' + org.cn + ' 的一员（位阶：' + org.ranks[1] + '）');
      if(org.reward0) { try{ org.reward0(); }catch(e){} }
      v52_orgPanel();
    }catch(e){ console.error(e); }
  };
  /* 组织任务剧情流 */
  window.v52_orgRun = function(taskId){
    try{
      v52_ensureDefaults();
      var org = v52_orgOf();
      if(!org) return;
      var tsk = null;
      (org.tasks||[]).forEach(function(t){ if(t.id===taskId) tsk = t; });
      if(!tsk) return;
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var step = 0;
      var grant = function(){ if(tsk.rep) v52_orgAddRep(tsk.rep); if(tsk.pt) { S.peakPts = (S.peakPts||0)+tsk.pt; if(window.flashMsg) flashMsg('巅峰点 +' + tsk.pt); } };
      var draw = function(){
        try{ clearOptions(); }catch(e){}
        if(step < tsk.steps.length){
          var s2 = tsk.steps[step];
          writePar("","noind");
          writePar(s2.text, "narration");
          if(s2.pass) writePar(s2.pass, "hint");
          if(s2.opts){
            s2.opts.forEach(function(o){
              var b = document.createElement('button'); b.className='opt';
              b.innerHTML = '<span class="od">◆</span> ' + o.t;
              b.onclick = function(){
                if(o.rep) v52_orgAddRep(o.rep);
                if(o.passText) writePar(o.passText, "hint");
                if(o.follow){ o.follow.forEach(function(t3){ writePar(t3); }); }
                if(o.eff) { try{ o.eff(); }catch(e){} }
                if(o.end){ step = tsk.steps.length; grant(); if(tsk.promote){ S.orgRank[v52_jobCn()] = (v52_orgRank()||0)+1; if(window.flashMsg) flashMsg('晋升！位阶：' + (ORG_V52[v52_jobCn()].ranks[v52_orgRank()]||'')); if(tsk.promoteReward) { try{ tsk.promoteReward(); }catch(e){} } } draw(); return; }
                step++;
                draw();
              };
              op.appendChild(b);
            });
          } else {
            var b2 = document.createElement('button'); b2.className='opt';
            b2.innerHTML = '<span class="od">◆</span> 继续';
            b2.onclick = function(){ step++; draw(); };
            op.appendChild(b2);
          }
        } else {
          if(!S.orgDone) S.orgDone = {};
          S.orgDone[tsk.id] = 1;
          writePar("","noind");
          writePar("━━ 事务了结 · " + tsk.title + " ━━","noind flagline");
          if(tsk.endText) writePar(tsk.endText);
          var b3 = document.createElement('button'); b3.className='opt';
          b3.innerHTML = '<span class="od">◆</span> 返回组织';
          b3.onclick = function(){ v52_orgPanel(); };
          op.appendChild(b3);
        }
      };
      writePar("","noind");
      writePar("━━ 组织事务 · " + tsk.title + " ━━","noind flagline");
      if(tsk.desc) writePar(tsk.desc, "narration");
      draw();
    }catch(e){ console.error(e); }
  };
  /* ---------- 神座试炼（机制壳，内容在 RIVALS_V52 / 试炼链） ---------- */
  
/* ===== v53 强者谱系工程：世界强者分布 ===== */
(function(){
try{
/* ---- 1. 权威数值表 PEERS_V53（能力者 18 万 / 人类传奇 26 / 兽王额外 1 / 每职一神一半神一挑战者） ---- */
window.PEERS_V53 = {
 "魔法师": {"pop":35000,"count":{"1":24920,"2":6720,"3":2520,"4":266,"5":31,"6":5},"deity":{"status":"陨落","holder":"初代元素神·寂光","note":"神座空悬两千年，此座无人"},"demi":"rv_mage_o","challenger":"rv_mage_v"},
 "战士": {"pop":30000,"count":{"1":21360,"2":5760,"3":2160,"4":228,"5":27,"6":5},"deity":{"status":"陨落","holder":"初代战神·戈","note":"神座空悬三千年，此座无人"},"demi":"rv_war_r","challenger":"rv_war_b"},
 "商人": {"pop":16250,"count":{"1":11570,"2":3120,"3":1170,"4":124,"5":14,"6":2},"deity":{"status":"在位","holder":"财富之神·金衡","note":"神座有人"},"demi":"rv_trade_j","challenger":"rv_trade_y"},
 "牧师": {"pop":13750,"count":{"1":9790,"2":2640,"3":990,"4":104,"5":12,"6":3},"deity":{"status":"在位","holder":"太阳神·圣临","note":"神座有人"},"demi":"rv_priest_b","challenger":"rv_priest_s"},
 "盗贼": {"pop":10000,"count":{"1":7120,"2":1920,"3":720,"4":76,"5":9,"6":2},"deity":{"status":"空缺","holder":"","note":"暗影无神，此座从无人坐过"},"demi":"rv_thief_y","challenger":"rv_thief_g"},
 "游侠": {"pop":8750,"count":{"1":6230,"2":1680,"3":630,"4":66,"5":8,"6":2},"deity":{"status":"空悬","holder":"","note":"神座空悬，林间的路太长"},"demi":"rv_ranger_k","challenger":"rv_ranger_l"},
 "骑士": {"pop":6250,"count":{"1":4450,"2":1200,"3":450,"4":48,"5":6,"6":2},"deity":{"status":"在位·隐世","holder":"誓约之神·无名","note":"神座有人，但神不现身"},"demi":"rv_knight_j","challenger":"rv_knight_s"},
 "术士": {"pop":3750,"count":{"1":2670,"2":720,"3":270,"4":28,"5":3,"6":2},"deity":{"status":"陨落·传承","holder":"初代锻造之神·铸","note":"神座空悬；传承半神索林·铁须守望此座"},"demi":"rv_smith_g","challenger":"rv_smith_a"},
 "灵魂法师": {"pop":1250,"count":{"1":890,"2":240,"3":90,"4":10,"5":1,"6":1},"deity":{"status":"空悬·自创","holder":"","note":"无神明；半神奥雷利安·晨曦自创此道"},"demi":"rv_soul_r","challenger":"rv_soul_w"},
 "兽王": {"pop":1,"count":{"6":1},"kind":"超凡野兽","note":"传奇级超凡野兽，非人类，不计入人类传奇"},
 "隐世": {"pop":1,"count":{"6":1},"kind":"人类·隐世","note":"传闻说他已不在了，可图鉴仍有一席"},
 "散人": {"pop":1,"count":{"6":1},"kind":"人类·无归属","note":"不属于任何势力，行踪飘忽"}
};

/*v53inj:racemod*/
window.RACE_MOD_V53 = {
 "总注":"以大陆能力者总数十二万五千（人口两千五百万×0.5%）为基数；本表为各族在启灵至传奇各境的分布修正系数，低阶多寡决定人口占比，高阶多寡决定强者名望。",
 "人类": {"mult":{1:1.0,2:1.0,3:1.0,4:1.0,5:1.0,6:1.0},"note":"全段基准，人口最多，各境界分布最均匀。"},
 "精灵": {"mult":{1:0.7,2:0.7,3:0.7,4:1.5,5:1.5,6:1.5},"note":"长寿者多、生育少，高阶强者比例全族最高；低阶反而少于人类。"},
 "矮人": {"mult":{1:1.0,2:1.0,3:1.0,4:1.2,5:1.2,6:1.2},"note":"中高阶略多，铁峰堡的传承让强者辈出。"},
 "半身人": {"mult":{1:1.0,2:1.0,3:1.0,4:0.3,5:0.3,6:0.3},"note":"高阶几乎绝迹——半身人宗师已难得一见，大宗师以上大陆上数不出第二个。"},
 "兽人": {"mult":{1:1.1,2:1.1,3:1.1,4:0.8,5:0.8,6:0.8},"note":"低中阶多，高阶衰减快——草原养不出太多大宗师。"},
 "龙裔": {"mult":{1:0.05,2:0.05,3:0.05,4:0.05,5:0.05,6:0.05},"note":"人口极少，全阶稀少；但顶尖比例最高——龙裔若是入阶，多半不凡。"},
 "混血": {"mult":{1:0.9,2:0.9,3:0.9,4:0.7,5:0.7,6:0.7},"note":"低阶略少，高阶更少——两边都不认，路就难走些。"}
};

/* ---- 2. 命名强者名录（content 注入填充） ---- */
window.STRONG_V53 = {};

/*v53inj:strong*/
STRONG_V53["魔法师"] = {
 "deity": {"id":"de_mage","cn":"初代元素神·寂光","seat":"星落塔第七层·观星台","legend":["寂光原是无名法师，在星落塔观星七百年。他把一条元素法则刻进魔网第一层，让它自行运转了一千年。","他陨落那天，观星台的窗全开了。风穿过塔身，把每一盏灯都吹亮了一瞬——像在替他点灯。","他带走了法则，却把知识留给了所有法师。从此星落塔的第七层，永远亮着一盏替他记着光线的灯。"],"taboo":"不可垄断知识。寂光陨落时，知识没有随他一起埋进土里——那是他留给后来者的神谕。","relation":"元素学院每年祭日熄一盏塔灯。老执事说：不是悼念，是替他数着，这条道还有多少人走。"},
 "demi":"rv_mage_o","challenger":"rv_mage_v",
 "legend":[
  {"id":"lv_mage1","cn":"奥薇恩·星语","title":"银冠","race":"精灵","org":"银叶城·元素学院客席","realm":6,"power":"银叶城最古老的大法师，活过三朝人类王朝","desc":"她的银发编成冠，垂到腰际。她说她记得每一任精灵女王的名字，也记得她们每个都问过她同一个问题：你为什么不争神座？","story":"奥薇恩年轻时是银叶城最锋利的法师。她打遍北境，赢了每一场她该赢的仗——然后她停了。她说：我赢了太久，赢了的人最容易忘了法术是为什么存在的。她回到银叶城，开始教孩子认元素。这一教，就是三百年。","rumor":"有人说她见过神座。她什么都没说，只是把玩着那枚银冠——那是她成神那天，自己为自己戴上的。","meet":"你在银叶城的老树下遇见她。她正在教一个精灵孩子让树叶转圈。她抬头看你，笑了一下：你也想学？","defeatLine":"你赢了。她摘下银冠，在手里掂了掂：这玩意儿，我戴了三百年，还是没想好要不要坐上去。","loseText":"她让树叶在你周围转了一圈，然后停住：还差一点。不急着赢。","will":{"kind":"随缘","lv":40,"why":"她见过太多同族陨落，神座对她而言，不如一棵树活得久。","baseShift":0}},
  {"id":"lv_mage2","cn":"洛·晨雾","title":"雾塔","race":"人类","org":"元素学院·首席大法师","realm":6,"power":"元素学院现任首席大法师，星落塔的主人","desc":"他总站在星落塔最顶层的窗边，看着塔下的学生来来往往。有人说他是在看风向，有人说他在等一个人。","story":"洛·晨雾是奥伦·星弦的师弟。奥伦离塔出走那天，把首席的星徽留在了第七层的窗台上。洛捡起它，戴上，一戴就是十二年。他管理着学院的一切，唯独不去看那枚星徽——因为它本来不属于他。","rumor":"塔里的老执事说，洛每年双子星升起的夜里都会失眠。他站在观星台，看着那枚星徽，像看着一道没做完的题。","meet":"他在观星台等你。风很大，他衣角都没动：你来得正好。帮我看看，这道元素法则，第七层能不能再刻一层。","defeatLine":"你赢了。他收起法术，把星徽摘下来递给你：物归原主的时候到了。","loseText":"他叹了口气：还差一步。星落塔的灯，不会为差一步的人亮。","will":{"kind":"渴望","lv":60,"why":"他不是想要神座，是想知道奥伦当年在观星台看到了什么。","baseShift":0}},
  {"id":"lv_mage3","cn":"凯·青焰","title":"青焰","race":"人类","org":"北方公国联盟·军法师","realm":6,"power":"北方军团的传奇军法师，一个人烧过一座桥","desc":"他的法术是青色的，像冬天冻过的火。他不爱说话，说话的时候，手总在摸腰间那盏熄灭的旧灯。","story":"凯曾是铁门关外一个小村的孤儿。那盏旧灯是村里唯一的东西，全村人轮流添油，说灯不灭，村不亡。东军破村那夜，他抱着灯逃出来，灯熄了。他成了法师，烧过桥，烧过城，烧过一整支军队——可那盏灯，再没亮过。","rumor":"有人说他四处寻找能点亮那盏灯的火。有人说那灯芯是假的，是他在骗自己。","meet":"你在北地的雪原上遇见他。他蹲在一处熄灭的篝火边，看了很久：你说，火这种东西，到底是烧完了才算活过，还是亮着才算？","defeatLine":"你赢了。他笑了，那盏旧灯在他手里，第一次亮了一瞬：谢了。","loseText":"他摇摇头：你的火太新，烧不亮我的灯。","will":{"kind":"执念","lv":80,"why":"他想找回那盏灯的光——如果神座能给他答案，他会去坐。","baseShift":0}},
  {"id":"lv_mage4","cn":"瑟琳·银冠","title":"银叶","race":"精灵","org":"精灵王国·长老会","realm":6,"power":"精灵长老会最年轻的传奇，守护世界树外围的结界","desc":"她的眼睛是浅金色的，像秋日透过树冠的光。她守着世界树外围的结界，已经守了两百年。","story":"瑟琳是奥薇恩的学生。她天赋极高，二十岁就摸到了传奇的门槛。可她没有继续走——她选了结界，选了守树。她说：树活一万年，我守它两百年，像给它挠了个痒。你们人类总想登顶，我们精灵，只想活得久一点，多听几遍风。","rumor":"精灵们说，瑟琳在结界里藏了一本书，书里写着世界树听见的所有秘密。","meet":"她在世界树的根下等你。她递给你一片树叶：拿着。树说，你身上有它喜欢的味道。","defeatLine":"你赢了。她点点头：树会记住你的。","loseText":"她看了你一会儿：树说，你还差一点耐心。","will":{"kind":"淡泊","lv":20,"why":"她守着树，不想守别的。神座对她来说，不如一棵树活得久。","baseShift":0}},
  {"id":"lv_mage5","cn":"伊尔·灰书","title":"灰书","race":"人类","org":"守望者·藏卷师","realm":6,"power":"守望者总部的藏卷师，七印的活档案","desc":"他永远抱着一卷灰布包着的书，谁也没见过书里写什么。他记着七印每一次松动的细节，像记着自己孩子的生辰。","story":"伊尔年轻时是元素学院的天才，可他毕业那年没有去任何势力——他去了守望者塔，当了一名藏卷师。他说：七印的事，比神座要紧。三千年里，七印松了十七次，他补了十七次档案。他的书里，没有一笔提到他自己。","rumor":"守望者内部说，灰书的卷宗里有一页是空白的——那是留给「将来能彻底封住七印的人」的。","meet":"他在守望者塔的档案室等你。他把那卷灰布书放在桌上：你想看哪一页？先说好，看完要还。","defeatLine":"你赢了。他把灰布书递给你：替我保管一天。我去看看第七印。","loseText":"他摇摇头：还不到时候。第七印的事，比输赢要紧。","will":{"kind":"禁忌","lv":60,"why":"七印若稳，他一生不叩神座；七印若崩，他第一个去填那个坑。","baseShift":0,"trigger":function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.watcher<10)return true;}catch(e){}return false;}}}
 ],
 "special":[
  {"id":"theo_mage","cn":"（神座空悬）","title":"","race":"","org":"","realm":7,"power":"魔法师神座空悬两千年","desc":"这座神座没有主人。所有法师都知道它空着，所有法师都假装不知道。","story":"寂光陨落两千年，星落塔第七层的灯熄了又亮，亮了又熄——没有一盏是为自己点的。法师们把这叫作「空座之惑」：不是没有人想坐，是没有人觉得自己配坐。","rumor":"老执事说，寂光陨落前留下一句话：坐上去不难，难的是坐上去之后，你还记得自己是个人。","meet":"","defeatLine":"","loseText":"","will":{"kind":"禁忌","lv":0,"why":"空座不争，等一个人愿意为它忘记自己。","baseShift":0,"trigger":function(){try{return false;}catch(e){return false;}}}}
 ]
};
STRONG_V53["战士"] = {
 "deity": {"id":"de_war","cn":"初代战神·戈","seat":"古战场·万人坑旧址","legend":["戈是奴隶出身。他在古战场站了一夜，万人不敢上前——不是怕他，是怕他那面旗。","他陨落那天，把旗插在最高的土丘上，说：旗不倒，我就不算输。三千年过去，旗杆没倒。","战神团每年祭旗。老兵说，那不是祭戈，是祭每一个替别人挡刀的人。"],"taboo":"不可背对战场。戈的战旗只认正面。","relation":"战神团的旧旗，每年要挂出来晾一天——晒晒血，也晒晒后来人的胆。"},
 "demi":"rv_war_r","challenger":"rv_war_b",
 "legend":[
  {"id":"lv_war1","cn":"格罗·铁壁","title":"铁壁","race":"矮人","org":"铁峰堡·卫队总长","realm":6,"power":"铁峰堡卫队总长，用盾挡过三场围城","desc":"他的盾比城门还厚，盾面上刻满了名字——每一道凹痕，是一个他挡在身后的人。","story":"格罗年轻时不是盾兵，是矿工。塌方那夜，他用自己的背顶住了一块落石，救了整队矿工。从那天起他拿起了盾，一拿就是两百年。他说：盾这东西，不是用来挡自己的，是用来让别人敢往前走的。","rumor":"铁峰堡的孩子都知道：格罗总长的盾上有三百七十二道凹痕，每一道都能讲一个故事。","meet":"他在铁峰堡的城墙上擦盾。看见你，他举起盾：来，帮我看看，这道新凹痕，够不够深。","defeatLine":"你赢了。他收盾，笑得很响：好！好得很！你这一刀，我记下了！","loseText":"他退了一步，揉了揉手腕：老喽。你要早来三十年，这一下我可躲不开。","will":{"kind":"随缘","lv":45,"why":"他等的是下一个矿工，不是神座。","baseShift":0}},
  {"id":"lv_war2","cn":"喀兰·赤峰","title":"赤峰","race":"兽人","org":"兽人王庭·狼旗第一勇士","realm":6,"power":"兽人王庭狼旗第一勇士，草原上最快的刀","desc":"他的刀柄缠着一条褪色的红布。他说那是他母亲的头巾——她死在兽人与人类的旧战里。","story":"喀兰打过最多的人类，也救过最多的人类。他屠过村，也守过村——草原上的规矩很简单：你敬狼，狼敬你。他成传奇那年，兽人王庭给他立了石像。他让人把石像的脸朝南，对着人类的地界：让他们看看，草原上不是只有仇恨。","rumor":"有人说喀兰在找一块旧碑，碑上刻着兽人与人类第一份和平条约——他想把那份条约，重新立起来。","meet":"他在草原的篝火边等你。他递给你一块烤肉：吃。吃饱了，我们聊点比打仗重要的事。","defeatLine":"你赢了。他大笑，把红布头巾系在你手腕上：草原认你！","loseText":"他咂咂嘴：你的刀，还差一点风的味道。","will":{"kind":"渴望","lv":70,"why":"他想让草原和人类之间，有一样东西比仇恨更结实——神座或许可以。","baseShift":0}},
  {"id":"lv_war3","cn":"秦·长风","title":"长风","race":"人类","org":"北方公国联盟·镇北军统领","realm":6,"power":"镇北军统领，铁门关的活城墙","desc":"他的左臂是假的，木雕的，刻满了北境要塞的地图。他站在城头，风把披风吹得笔直，像一面活着的旗。","story":"秦·长风十五岁入伍，打过大小四百余仗。断左臂那场，他守了铁门关七天七夜，用右手单手使枪，把东军挡在关外。关里的老兵说：那不是七天，是他替整座城，多活了七天。他成了统领，可每晚还睡在城头——他说，城在，我在。","rumor":"镇北军的兵都知道，统领的木臂里藏着一张纸，写着一个女人的名字。没人敢问是谁。","meet":"他在铁门关城头等你。风吹得说话都要吼：上来！站这儿看，你才知道什么叫北境！","defeatLine":"你赢了。他沉默了一会儿，忽然笑了：好。我守了四十年，总算看到后头有人了。","loseText":"他拍拍你的肩：还早。等你哪天懂了城为什么在，再来找我。","will":{"kind":"执念","lv":82,"why":"他要让断刀有名字，让铁门关不再需要人拿命去填。","baseShift":0}},
  {"id":"lv_war4","cn":"叶·孤山","title":"孤山","race":"人类","org":"自由城邦·佣兵会长","realm":6,"power":"自由城邦最大的佣兵会首领，一个人扛过一城围困","desc":"他总是一个人喝酒，一个人练刀。他的佣兵会里有三百人，可他从来不参加任何聚会——他说，孤山嘛，站得远才看得清。","story":"叶·孤山成名于一场围城。那城是自由城邦的卫星城，守军跑了，他带着三百佣兵守了三个月。城没破。从那以后，他不再接大单——他只接「守城」的单，而且从不涨价。有人说他傻，他说：城守住了，城里的商路就通，商路通了，你们这些骂我傻的人，才有钱付账。","rumor":"佣兵们说，叶会长有个规矩：佣金结账时，总要扣下一成，记在账上，说是「留给守不住的城」。","meet":"他在酒馆角落独自喝酒。看见你，他举了举杯：坐。这杯请你——赌你将来守得住一座城。","defeatLine":"你赢了。他把酒壶推给你：存着，等你哪天守城的时候喝。","loseText":"他摇摇头：你刀法不差，心还太热。守城的人，心要凉一点。","will":{"kind":"随缘","lv":38,"why":"他见过太多城破，神座救不了城，钱和刀才行。","baseShift":0}},
  {"id":"lv_war5","cn":"罗·断江","title":"断江","race":"人类","org":"南方商业城邦·海卫统领（退役）","realm":6,"power":"退役海卫统领，年轻时一人断过一条江","desc":"他退役后在南方港城开了家小酒馆，招牌菜是「断江鱼」。他每天坐在柜台后擦一只旧酒杯，擦得锃亮。","story":"罗·断江年轻时是南方最强的战士，一人一枪，拦过一条满载海盗的江船。他本可以封侯拜将，可他退役了——他说他打够了。他在港城开了酒馆，听水手讲海上的事，偶尔出手教训闹事的醉汉。南方的传奇只有两位，他是最不「传奇」的那位。","rumor":"水手们说，断江的旧枪插在他酒馆的房梁上，枪尖朝海——他说，那是留给将来守海的人。","meet":"他在酒馆擦杯子。看见你，他笑了笑：坐。今天新到的鱼，很新鲜。","defeatLine":"你赢了。他放下杯子，认真看了你一眼：后生可畏。这杯酒，我请。","loseText":"他摆摆手：不打了不打了。我擦杯子呢，别溅我一身水。","will":{"kind":"淡泊","lv":15,"why":"他打够了。神座那张椅子，不如他酒馆里的旧木凳坐着舒服。","baseShift":0}}
 ]
};
STRONG_V53["牧师"] = {
 "deity": {"id":"de_priest","cn":"太阳神·圣临","seat":"大教堂地下·静默殿","legend":["圣临原是静默殿的守夜人，守了三百年夜。他没见过太阳升起——他守的，是太阳升起前那段最黑的光。","他成神那天，晨祷的钟没敲。他推开静默殿的门，站在晨光里，说：我不用再守夜了。","圣辉教会的大教堂，永远给他留着第一排的位置——虽然从来没有人见过他坐在那里。"],"taboo":"不可背弃晨光。圣临的戒律只有一条：每个清晨，太阳都会照常升起——神可以迟到，晨祷不可以。","relation":"圣辉教会每天晨祷前，静默殿的守夜人要换一支新蜡烛——替神，也替所有还在黑夜里的人。"},
 "demi":"rv_priest_b","challenger":"rv_priest_s",
 "legend":[
  {"id":"lv_priest1","cn":"克莱门·圣言","title":"圣言","race":"人类","org":"圣辉教会·枢机主教","realm":6,"power":"圣辉教会枢机主教，圣城话语权最重的人","desc":"他说话很慢，每个字都像在称重。他主持过三次大公会议，每一次都让教会内部的裂痕更深——又更稳。","story":"克莱门年轻时是个战争牧师，跟着军队走了十年，见过最深的血。他回圣城后开始主张「净化令」，可他也偷偷救过被净化的书商。枢机院里，他是最矛盾的一个人：他相信圣光是唯一的路，可他也知道，走这条路的人，脚下沾着泥。","rumor":"有人说克莱门在自己的祷告室里，藏着一本被净化令收缴的禁书——他每晚读一页，然后向神忏悔。","meet":"他在大教堂的回廊里等你。他看了你一会儿：你身上有犹豫的味道。来，跟我说说，你在犹豫什么。","defeatLine":"你赢了。他闭了闭眼：主没有回答我，也许你就是答案。","loseText":"他摇摇头：你的心还不够安静。神只对安静的人说话。","will":{"kind":"渴望","lv":60,"why":"他相信神座需要一个「更清醒的人」来坐——他愿意当那个人。","baseShift":0}},
  {"id":"lv_priest2","cn":"玛格达·静烛","title":"静烛","race":"人类","org":"圣辉教会·静默殿守夜长","realm":6,"power":"静默殿守夜长，三百年没有离开过地下","desc":"她的眼睛在黑暗里待得太久，见不得强光。她说话声音很轻，像怕惊动什么。","story":"玛格达十二岁进静默殿，守了三百年夜。她的蜡烛从没熄灭过——她说不是她守得好，是这殿里的夜，怕她。她成传奇那年，教会要升她当大主教，她拒绝了：我走了，谁来替神守这段最黑的光？","rumor":"有人说玛格达的蜡烛芯，是用初代守夜人的头发搓的——那人是太阳神圣临的未婚妻，她没等到他成神。","meet":"她在静默殿的烛光边等你。她抬头，眼睛像一潭深水：你来了。坐吧，这里没有神，只有夜。","defeatLine":"你赢了。她轻吹熄了你的影子：你可以走了。夜记得你。","loseText":"她摇摇头：你还没有准备好，在黑暗里坐三百年。","will":{"kind":"淡泊","lv":12,"why":"她守夜不为成神，为等一个人。","baseShift":0}},
  {"id":"lv_priest3","cn":"艾诺尔·银冠","title":"银冠","race":"精灵","org":"精灵王国·圣辉教会客席主教","realm":6,"power":"精灵王国唯一的圣辉主教，长寿种族里的异类","desc":"她是精灵，却信人类的神。她说：神不分种族，黑暗也不分。","story":"艾诺尔是在圣城长大的精灵——她的养父母是圣城的牧师。她见过教会最好的一面，也见过最坏的一面。她回精灵王国后，建了一座小小的教堂，只有精灵会来。她说：银叶城需要一盏不一样的灯。","rumor":"精灵们说，艾诺尔的小教堂里，供奉着一尊精灵面容的太阳神像——只有她能看见神像的表情。","meet":"她在银叶城的小教堂门口等你。她笑了笑：进来吧，这盏灯，是替两种族的黑暗点的。","defeatLine":"你赢了。她低头行了个礼：愿圣光与森林，都记得你。","loseText":"她温和地摇头：你的光还太亮，会烧着叶子。","will":{"kind":"随缘","lv":40,"why":"她在两个种族之间长大，神座对她而言，只是另一座桥。","baseShift":0}}
 ]
};
STRONG_V53["盗贼"] = {
 "deity": {"id":"de_thief","cn":"（无神）","seat":"暗影阁·镜厅","legend":["盗贼这一道，从开宗起就没有神。传说祖师曾走到神座前，看见神座会留下他的名字——他转身走了。","他说：我这一生，偷过皇冠，偷过国玺，偷过人心。我唯一不想偷的，是一个名字。","从此暗影阁的祖师牌位是空的。每一代阁主上任，都要对空牌位说一句：祖师，我还在偷。"],"taboo":"无。暗影无神，故无戒——只有规矩：事成拂衣去，深藏身与名。","relation":"暗影阁的镜厅里有一面旧镜子。传说祖师在镜子里留了一道影子，等一个敢把「不存在」当名字的人。"},
 "demi":"rv_thief_y","challenger":"rv_thief_g",
 "legend":[
  {"id":"lv_thief1","cn":"杜·夜枭","title":"夜枭","race":"人类","org":"暗影阁·阁主","realm":6,"power":"暗影阁现任阁主，大陆上没有人见过他的脸","desc":"没有人见过他的脸。他每次出现，都隔着半扇门、一道影，或者一层雾。","story":"杜·夜枭接任阁主那天，杀了前一任阁主——这是暗影阁的规矩：阁主之位，从来不是传的，是抢的。可他上任后做的第一件事，是封了暗影阁最深的库房。里面堆着历代阁主偷来的「不该偷的东西」——他说，这些是债，要还。","rumor":"有人说夜枭每年除夕，会独自去一趟自由城邦的旧钟楼。钟楼底下埋着一样他偷了三十年都没能还回去的东西。","meet":"你在暗巷的阴影里听见他的声音：跟着光走的人，看不见我。说吧，你找我，是想偷什么，还是想还什么？","defeatLine":"你赢了。阴影里传来一声极轻的笑：好。你是我第一个偷不到的人。","loseText":"阴影里安静了一会儿：你不错。只是还不够黑。","will":{"kind":"执念","lv":78,"why":"他想偷回那件「偷了三十年还不了」的东西——如果神座能换，他愿意换。","baseShift":0}},
  {"id":"lv_thief2","cn":"薇·灰雾","title":"灰雾","race":"混血","org":"自由城邦·自由行商（暗线）","realm":6,"power":"混血传奇，一半精灵一半人类，影子比人长","desc":"她的影子比人长——混血的代价，也是混血的礼物。她白天是行商，晚上是灰雾，没人把两者联系起来。","story":"薇·灰雾是混血儿，在人类的地界被叫「杂种」，在精灵的地界被叫「半调子」。她谁的地界都不待——她走商路，用一张脸在两个世界之间做生意，晚上用另一张脸，把两个世界都不愿说的话，偷来卖。她成传奇那天，两个世界都沉默了：他们都不承认她，可他们都怕她。","rumor":"商路上流传一句话：别在雾天跟灰雾谈生意——你永远不知道，她在白天还是晚上记住了你。","meet":"她在商队的马车边等你。她笑吟吟的：听说你在找一个「不存在的人」？巧了，我认识一个。","defeatLine":"你赢了。她的影子缩回脚下：有意思。你是我见过第一个不怕影子的人。","loseText":"她眨眨眼：你的影子太干净了，跟着你，我怕被晒黑。","will":{"kind":"随缘","lv":35,"why":"她在两个世界之间活着，神座只有一个，她怕坐上去，就只剩一个世界了。","baseShift":0}}
 ]
};
STRONG_V53["游侠"] = {
 "deity": {"id":"de_ranger","cn":"（神座空悬）","seat":"世界树最高枝·雾顶","legend":["初代林语者走遍了所有森林，把双叶之环留在世界树顶。她没有成神。","她说：路比神座长。神座只有一把椅子，路有无数条。","从此游侠的神座空悬。荒野巡守的树环徽记，永远缺着一片叶子——那一片，在等一个走完所有路的人。"],"taboo":"不可修路。游侠不修路——路是野的，修出来的路，走不出野性。","relation":"荒野巡守的新人入会，要在树上挂一片叶子。老巡守说：叶子挂满树的那天，就是神座有人坐的那天。"},
 "demi":"rv_ranger_k","challenger":"rv_ranger_l",
 "legend":[
  {"id":"lv_ranger1","cn":"艾琳·逐风","title":"逐风","race":"精灵","org":"荒野巡守·大巡守","realm":6,"power":"荒野巡守大巡守，森林里没有她追不上的风","desc":"她的弓是活的——用世界树的枝条做的，会自己调整弓弦的松紧。她说：不是我在拉弓，是树在帮我。","story":"艾琳年轻时追过一只白鹿，追了整整一年。她追过山，追过河，追到世界树脚下，白鹿不见了——树根下坐着一个老人，是初代林语者留下的一缕记忆。老人说：你追的不是鹿，是路。从那天起，她不再追猎物，她追路。她成了大巡守，可她一年里有一半时间不在巡守所——她在路上。","rumor":"有人说艾琳的白鹿还在跑，她就还在追。她追了三百年的那只鹿，是林语者留给她的一道题。","meet":"你在林间小路上遇见她。她靠着一棵树，随手折了片叶子吹了个调子：赶路？正好，我也赶路。","defeatLine":"你赢了。她收起弓，吹了个更长的调子：你这一箭，替我追到了那只鹿的影子。","loseText":"她笑着摇头：你的脚还太急。路不着急，你着急什么？","will":{"kind":"淡泊","lv":10,"why":"她只追风。神座会停，风不会。","baseShift":0}},
  {"id":"lv_ranger2","cn":"贺·断弓","title":"断弓","race":"人类","org":"北方·自由猎手","realm":6,"power":"北境自由猎手，一张断弓走遍雪原","desc":"他的弓断了一截，用兽皮缠着。他说弓断了还能打——这是北方猎人的老话。","story":"贺·断弓原本是镇北军的斥候。那场仗里，他的弓断了，他用手里的半截弓，捅死了三个追兵，救了整支斥候队。战后他退役，进了雪原，成了自由猎手。他专打那些「不该存在」的猎物——雪原深处的东西，有些不是野兽。","rumor":"雪原的猎人传说：断弓的背囊里装着一根完整的弓弦，是他留着等「最后一仗」用的。","meet":"他在雪原的避风处烤火。看见你，他递过来一块干肉：吃点。雪原不认生人，认味道。","defeatLine":"你赢了。他拍拍断弓：好。这根弦，我留着有用，不然就送你了。","loseText":"他摇摇头：你的火气太大，会把雪原的兽都惊跑。","will":{"kind":"随缘","lv":30,"why":"他等的是最后一仗，不是神座。","baseShift":0}}
 ]
};
STRONG_V53["骑士"] = {
 "deity": {"id":"de_knight","cn":"誓约之神·无名","seat":"圣城旧圣坛遗址","legend":["无名成神前，是一名普通的游侠骑士。他在旧圣坛立下第一道誓约，然后一生只守这一道。","他成神那天，没有异象——他只是把盾放在圣坛下，转身走了。从此神座有人，神不现身。","每一任誓约骑士团的团长上任，都要去旧圣坛，把手指按进盾面的那道指印——合得上，才配当团长。"],"taboo":"不可破誓。无名从不现身，因为他把自己活成了那道誓约——他的神座，就是他的诺言。","relation":"旧圣坛的盾面，被历代骑士按出了深深的指印。老骑士说：那不是神迹，是无数人说话算话的痕迹。"},
 "demi":"rv_knight_j","challenger":"rv_knight_s",
 "legend":[
  {"id":"lv_knight1","cn":"罗兰·白盾","title":"白盾","race":"人类","org":"誓约骑士团·团长","realm":6,"power":"誓约骑士团团长，圣城的最后一面盾","desc":"他的盾是白的，没有一丝划痕——不是没挨过打，是他把每一道伤都记在了自己身上。","story":"罗兰接任团长那年，圣城正乱。他立下骑士团三百年来第一条新誓约：团长之盾，永不后退。他把盾擦得雪白，说：白，是因为我挡下的东西，都不配留在上面。他守圣城三十年，净化令最凶那几年，他挡在书商面前，也挡在执事面前——他挡的是「不问青红皂白」。","rumor":"有人说罗兰的盾不是白的，是他在每次战斗后，都把它重新漆成白色。","meet":"他在圣城城门等你。他把盾立在地上：你要进城？先回答我——你进城，是想改变它，还是想利用它？","defeatLine":"你赢了。他把盾递到你面前：来，按个手印。你是它认识的新人。","loseText":"他收盾：你的剑还太飘。守护的剑，要沉。","will":{"kind":"渴望","lv":62,"why":"他想守护到不需要神座的那天——但如果神座能守护更多人，他愿意坐。","baseShift":0}},
  {"id":"lv_knight2","cn":"伊莎·晨辉","title":"晨辉","race":"人类","org":"誓约骑士团·圣辉骑士","realm":6,"power":"圣辉骑士，晨曦圣殿与骑士团之间的桥","desc":"她的铠甲上缀着圣辉教会的徽记，也缀着骑士团的徽记。她说：两边都戴，两边都劝。","story":"伊莎是骑士团里唯一一个能自由进出圣辉教会的骑士。她出身圣城平民窟，见过教会的善，也见过教会的恶。她成骑士那天，立誓：我的剑，只守「值得守」的东西。三十年来，她在枢机院和骑士团之间来回奔走，让净化令的刀，慢了那么几次。","rumor":"圣城的平民说，晨辉骑士的铠甲内侧，刻着一个人名——那是她在平民窟时的邻居，死在了第一次净化令里。","meet":"她在晨曦圣殿门口等你。她解下头盔，露出一头短发：来吧。我正好要去劝枢机院，你陪我走一段。","defeatLine":"你赢了。她笑了：好。这面盾，替我守一天平民窟。","loseText":"她摇摇头：你的剑还太年轻，没见过「值得守」的东西。","will":{"kind":"淡泊","lv":14,"why":"她想守的是人，不是座位。","baseShift":0}}
 ]
};
STRONG_V53["术士"] = {
 "deity": {"id":"de_smith","cn":"初代锻造之神·铸","seat":"铁峰堡王座下·初火熔炉","legend":["铸一生只造过一件东西——自己。他把命烧进炉里，锤留在铁峰堡王座之下。","他陨落那天，铁峰堡的熔炉全熄了，唯独初火熔炉还亮着。矮人说：那是他在炉子里，看着我们。","传承半神索林·铁须守着初火熔炉。索林说：我握不起那柄锤——它不是重，是烫。"],"taboo":"不可铸邪器。铸的戒律，烙在每一柄铁锤上。","relation":"铁峰堡的新炉工入行，要先在初火熔炉前站一刻钟——感受那团火烧了多久，就知道这条路有多长。"},
 "demi":"rv_smith_g","challenger":"rv_smith_a",
 "legend":[
  {"id":"lv_smith1","cn":"格朗·符文","title":"符文","race":"矮人","org":"锻造公会·符文大师","realm":6,"power":"锻造公会符文大师，能在铁上刻出会呼吸的符文","desc":"他的锤子很小，像一把刻刀。他说：铁不用重锤，铁用耐心。","story":"格朗年轻时是矿道里最笨的矿工——别人一天挖十车，他一天挖一车，因为他每挖一块石头，都要看看石头的纹理。后来他发现，铁也有纹理。他把符文刻进纹理里，让铁自己记住该怎么做。他成了符文大师，铁峰堡最值钱的兵器，都出自他的手。","rumor":"有人说格朗的符文里，藏着一道「初火」——那是他在初火熔炉前站了三百年，听火说的一句话。","meet":"他在锻造公会的炉边等你。他抬头，眯起眼：来，帮我看看这把刀——它说它想变剑。","defeatLine":"你赢了。他把那把刀改的剑递给你：拿着。它认你。","loseText":"他摇摇头：你的火候还差一点。铁这东西，急不得。","will":{"kind":"渴望","lv":58,"why":"他想听清初火说的那句话——神座下的炉火，或许知道答案。","baseShift":0}},
  {"id":"lv_smith2","cn":"梅·炽芯","title":"炽芯","race":"人类","org":"锻造公会·首席铸师","realm":6,"power":"锻造公会人类首席铸师，能铸出带心跳的造物","desc":"她铸的东西会「活」——不是傀儡术，是造物自己有了脾气。她的工坊里，锤子会自己跳回架子上。","story":"梅是孤儿，被锻造公会的老铸师捡回来养大。老铸师死前，把一生的火都传给了她——字面意义上的「传火」：他把自己的心血，凝成一颗炽芯，放进她的胸膛。她从此能感觉到铁的「心跳」。她成首席铸师那天，给老铸师的坟前铸了一柄无刃的剑——她说，这是给「不会打铁的人」的。","rumor":"有人说梅的炽芯里，还留着老铸师最后一句话。她每次喝酒到微醺，都会对着炉火自言自语。","meet":"她在工坊里等你。炉火映着她的脸：你来了。别碰那柄锤——它今天心情不好。","defeatLine":"你赢了。她点点头，往炉里添了块炭：你这一手，够给铁写首诗。","loseText":"她皱眉：你的手还太抖。铸师的手，要稳过心跳。","will":{"kind":"执念","lv":76,"why":"她想铸出老铸师说的「真正的活物」——那是比神座更难的造物。","baseShift":0}}
 ],
 "special":[
  {"id":"theo_smith","cn":"索林·铁须","title":"传承半神","race":"矮人","org":"铁峰堡·矮人王","realm":7,"power":"矮人王，锻造之神的传承半神，守望初火熔炉","desc":"他的胡须编成辫子，辫尾系着两枚铁环——一枚是王冠，一枚是遗物。","story":"索林·铁须是矮人王国第七十三代王，也是锻造之神铸的传承者。他握着初火熔炉的钥匙，却从没想过坐神座。他说：铸把火留给了我，是让我看着炉子，不是让我坐上去。他守望神座三百年，铁峰堡的炉火，是大陆上唯一没熄过一百年的火。","rumor":"矮人们说，索林王每年铸火节，都会独自下到王座下，在初火熔炉前坐一夜。没有人知道他坐那一夜，在想什么。","meet":"你在铁峰堡王座厅见到他。他坐在石座上，手里转着一枚铁环：远道而来的人，坐。炉火认得你——它刚才旺了一下。","defeatLine":"你赢了。他大笑，声如洪钟：好！好得很！铁峰堡的炉火，认你这双手！","loseText":"他摆摆手：王的火，不是用来比试的。","will":{"kind":"禁忌","lv":0,"why":"铁峰堡存亡或神座将空时，他才会握住那柄锤。","baseShift":0,"trigger":function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.dwarf<10)return true;}catch(e){}return false;}}}
 ]
};
STRONG_V53["商人"] = {
 "deity": {"id":"de_trade","cn":"财富之神·金衡","seat":"金衡商会总部·天平厅","legend":["金衡用一杆秤称过万物。他成神那天，是岁末结算之夜——他把自己的名字放上天平，天平没有动。","他成了神。三百年来，金衡商会的天平压着整个大陆的物价——它从来没有偏过。","商人说：金衡神不是神，是天平成精了。金衡神说：天平不认人，认账。"],"taboo":"不可毁约。金衡的秤，只称契约的重量。","relation":"金衡商会的总账房，每年岁末要把账本放在天平上称一次——称出来的重量，就是这一年的「良心价」。"},
 "demi":"rv_trade_j","challenger":"rv_trade_y",
 "legend":[
  {"id":"lv_trade1","cn":"文森·金秤","title":"金秤","race":"人类","org":"金衡商会·总会长","realm":6,"power":"金衡商会总会长，大陆物价的一半他说了算","desc":"他的账房没有锁——他说：锁防君子不防小人，账防的是人心。","story":"文森从码头扛包工做起，扛了十年，攒下第一笔钱，开了第一家铺子。他做生意只有一条规矩：不赚「让人活不下去」的钱。灾年他不涨价，丰收年他不压价。别人笑他傻，他笑笑：账算得精，不如算得久。他成了总会长，大陆一半的物价他点头才算——可他的铺子，还开在当年那条巷子里，卖的还是当年的货。","rumor":"有人说文森的秘密账本里，记的不是钱，是人情——每一笔「不赚的钱」，都记在另一页上，等有一天连本带利还。","meet":"他在老巷的铺子里等你。他拨着算盘，头也不抬：想学做生意？先回答我——灾年粮价，你涨不涨？","defeatLine":"你赢了。他放下算盘，笑：这局我认。账上记你一笔。","loseText":"他摇摇头：你的算盘太响，会惊着客。","will":{"kind":"渴望","lv":68,"why":"他算了半辈子账，想算清最后一笔：神座值多少。","baseShift":0}},
  {"id":"lv_trade2","cn":"洛佩斯·半帆","title":"半帆","race":"人类","org":"南方商业城邦·船王","realm":6,"power":"南方船王，七条商路，三百条船","desc":"他的船队不管顺风逆风都只挂半帆——他说：留一半，给风变卦。","story":"洛佩斯年轻时是海盗，抢了十年，然后上岸，用抢来的第一桶金买了第一条船，开始做生意。他做生意和当海盗一样狠：但有一条——不劫商船，不抢妇孺。他的船队越来越大，大到南方城邦的港口，都看他脸色。可他还是只挂半帆——他说：风会变，船不能满。","rumor":"水手们说，半帆的船舱里有一间锁着的房间，里面堆着他当年抢来的、又一件件还回去的东西。","meet":"他在港口的船头等你。海风吹得他眯起眼：上船？先说好，我的船，只载两条路：发财的路，和还债的路。","defeatLine":"你赢了。他大笑，拍了拍船舷：好！这条船，记你一航程！","loseText":"他摇头：你的秤还太满。做生意，要留一半。","will":{"kind":"随缘","lv":42,"why":"他经手过所有海上的账，神座不在这条航线上。","baseShift":0}}
 ]
};
STRONG_V53["灵魂法师"] = {
 "deity": {"id":"de_soul","cn":"（无神明·自创）","seat":"晨曦圣殿·回音室","legend":["灵魂法师一道，由奥雷利安·晨曦自创。他站在灵魂的尽头，没有神可以仰望，于是他造了一面镜子。","他说：没有神，就照自己。灵魂法师的道，是先把自己看穿，再看别人。","三千年过去，奥雷利安没有成神。他说：我还没把自己看透。"],"taboo":"不可窥无心之秘、不可触灵魂禁忌（复活/夺舍）。","relation":"晨曦圣殿的回音之镜，是三千年里唯一没有碎过的镜子——它照出的，永远是问镜者自己没听见的那句话。"},
 "demi":"rv_soul_r","challenger":"rv_soul_w",
 "legend":[
  {"id":"lv_soul1","cn":"澜·梦墟","title":"梦墟","race":"人类","org":"晨曦圣殿·守镜人","realm":6,"power":"晨曦圣殿守镜人，灵魂法师一脉唯一的传奇","desc":"她的眼睛是雾色的，像隔着一层梦。她守着回音之镜，守了九十年——她从不照镜子。","story":"澜·梦墟是奥雷利安离开圣殿后，最后一位守镜人。她见过镜子里所有人的另一面，唯独没见过自己的——因为她不敢照。她成传奇那天，圣殿的长老请她照一次镜子，她拒绝了：镜子会告诉我，我走这条路，是为了看见别人，还是为了逃避自己。我还没准备好听那个答案。","rumor":"有人说澜的雾眼是天生的——她生下来就看不见「表面」，只能看见人的「另一面」。所以她从不敢看任何人超过一炷香。","meet":"她在回音室门口等你。她侧着身，没有正眼看你：你身上有两道声音。一道很响，一道很轻。你想让我听哪一道？","defeatLine":"你赢了。她终于正眼看了你一次，雾眼眨了眨：你的另一面，不太坏。","loseText":"她别过脸：你还没有准备好，听自己的回声。","will":{"kind":"禁忌","lv":0,"why":"她看见的那条路，别人不许走——神座空悬时，她才会出手。","baseShift":0,"trigger":function(){try{return false;}catch(e){return false;}}}}
 ],
 "special":[
  {"id":"theo_soul","cn":"奥雷利安·晨曦","title":"守望者首席","race":"人类","org":"守望者·晨曦圣殿","realm":7,"power":"守望者首席，灵魂法师一脉的创始人，半神","desc":"他站在七印之上，守望大陆三千年。他创了灵魂法师一道，却始终没有坐上神座。","story":"奥雷利安是黄林晶时代的人。他见过七印建立，见过暗蚀会崛起，见过无数王朝兴衰。他自创灵魂法师之道，说：没有神可以仰望的人，只能造一面镜子。三千年里，他无数次走到神座前，又无数次退回来——他说：我还没把自己看透。看透自己的那天，就是我坐上去的那天。","rumor":"守望者们说，奥雷利安每晚都要站在塔顶，对着深渊的方向看很久。他在看的，不是深渊——是深渊对面的自己。","meet":"你在守望者塔顶见到他。他背对着你，风把他的白发吹乱：你来了。我等你很久了——来，陪我看一会儿深渊。","defeatLine":"你赢了。他转过身，眼里有极淡的光：好。这条道，总算有人走到了我前面。","loseText":"他摇摇头：还没到时候。深渊还在涨，我走不开。","will":{"kind":"禁忌","lv":0,"why":"深渊压过七印、世界存亡时，他会放下「没看透的自己」，去坐那个位置。","baseShift":0,"trigger":function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.watcher<8)return true;}catch(e){}return false;}}}
 ]
};

/* ---- 3. 成神意愿五档 ---- */
window.WILL_TO_ASCEND_V53 = {};


/*v53inj:special2*/
STRONG_V53["隐世"] = {"special":[{"id":"lv_隐世","cn":"无名·灰袍","title":"隐世","race":"人类","org":"无人知晓","realm":6,"power":"传闻说他已不在世——可每逢大灾之年，总有人说在荒原上见过一袭灰袍","desc":"他的名字早被从一切典籍上抹去。没有人记得他长什么样，只记得那件洗得发白的灰袍。","story":"他曾是离神座最近的人，也是第一个自己走下神座台阶的人。他消失的那天，星落塔第七层的灯灭了一盏——再没有亮过。有人说他死了，有人说他藏在某座雪山里替世界数着天数。","rumor":"牧羊人传说，荒年最凶的时候，灰袍会出现在最饿的村子外，放下半袋盐就走。","meet":"你在荒野的篝火边遇见他。他给你倒了碗热水，什么也没问。","defeatLine":"你赢了。他点点头：好。那件灰袍，就托你替世界穿着了。","loseText":"他摆摆手：天冷了，回火边坐着吧。","will":{"kind":"淡泊","lv":5,"why":"他早已走下台阶——神座于他，只是一件穿旧了又脱下的袍子。"}}]};
STRONG_V53["散人"] = {"special":[{"id":"lv_散人","cn":"独臂·萧","title":"散人","race":"人类","org":"无归属","realm":6,"power":"不属于任何势力，行踪飘忽的独行传奇","desc":"他只有一条手臂，使一柄断刀。没人知道他断臂那年在跟谁打——他只说：打赢了。","story":"萧年轻时是战神团的骄子，二十岁入宗师。三十岁那年，他独自去了深渊边缘，回来时少了一条手臂，多了一柄断刀。战神团问他发生了什么，他只说：打赢了。从那以后他谁的人情也不欠，谁的面子也不给，活得比谁都自在。","rumor":"赌坊里流传：独臂萧逢赌必输，逢打必赢。他听了大笑：赌是命，打是活。","meet":"他在酒馆角落喝最便宜的麦酒，看见你，抬了抬下巴：坐。这顿你请。","defeatLine":"你赢了。他把断刀插回腰间：后生可畏。下顿我请。","loseText":"他咂了口酒：年轻人，刀不是这么使的。坐下，我教你。","will":{"kind":"随缘","lv":35,"why":"他吃过神座的亏——那条手臂就是代价。他再也不会去够够不着的东西。"}}]};
STRONG_V53["兽王"] = {"special":[{"id":"lv_兽王","cn":"鬃吼","title":"百兽之王","race":"超凡野兽","org":"草原深处","realm":6,"power":"传奇级超凡野兽，草原的狼旗，不算人类","desc":"一头大如小山的老狼，鬃毛白了一半。它活了多久没人知道——草原上的萨满说，它的祖母的祖母就见过它。","story":"鬃吼是草原的规矩。兽人部落间打生打死，只要它出现在地平线上，所有人都会停手——不是怕，是敬。它不吃人，只吃狼王。每代狼王成年，它都要去咬断对方的喉咙，然后继续当它的百兽之王。","rumor":"猎人说，月圆夜能听见它长啸。那声音一起，整片草原的狼都会跟着应和——像在唱一首很老的歌。","meet":"你在草原深处遇见它。它卧在石坡上，金色的眼睛看了你很久，然后甩了甩尾巴——像在说：坐。","defeatLine":"你赢了。它低低呜了一声，用鼻子蹭了蹭你的手，转身走进夜色。草原的狼旗，从此认你。","loseText":"它打了个响鼻，转过身，尾巴扫过你的脸——像在教训一只不听话的幼崽。","will":{"kind":"禁忌","lv":0,"why":"有人类踏入它的领地成神，它会出手。"}}]};

/*v53inj:will*/
WILL_TO_ASCEND_V53["rv_mage_o"]={kind:"渴望",lv:75,why:"他离塔出走十二年，找的不是元素，是登神的路。","baseShift":0};
WILL_TO_ASCEND_V53["rv_mage_v"]={kind:"淡泊",lv:18,why:"替宫廷挡了二十年灾，她累了，不想再挡任何东西。","baseShift":0};
WILL_TO_ASCEND_V53["rv_soul_r"]={kind:"随缘",lv:45,why:"他欠的债没还清前，不打算坐任何位置。","baseShift":0};
WILL_TO_ASCEND_V53["rv_soul_w"]={kind:"淡泊",lv:15,why:"她唱别人的名字，不想有自己的名字。","baseShift":0};
WILL_TO_ASCEND_V53["rv_smith_g"]={kind:"随缘",lv:50,why:"炉火认人，不认名——他等的是炉火认他。","baseShift":0};
WILL_TO_ASCEND_V53["rv_smith_a"]={kind:"执念",lv:85,why:"她炼的一切都是为了那一天。","baseShift":0};
WILL_TO_ASCEND_V53["theo_smith"]={kind:"禁忌",lv:0,why:"铁峰堡存亡或神座将空时，他才会握住那柄锤。","baseShift":0,"trigger":"function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.dwarf<10)return true;}catch(e){}return false;}"};
WILL_TO_ASCEND_V53["rv_war_r"]={kind:"执念",lv:88,why:"他把每一个兄弟的名字刻在旧矛上，最后想刻自己的。","baseShift":0};
WILL_TO_ASCEND_V53["rv_war_b"]={kind:"淡泊",lv:15,why:"他父亲说刀断了还能打。他信，但他不想再打了——他只想守着断刀。","baseShift":0};
WILL_TO_ASCEND_V53["rv_knight_j"]={kind:"淡泊",lv:12,why:"他守的那句誓言不是他的——他不想为神座破誓。","baseShift":0};
WILL_TO_ASCEND_V53["rv_knight_s"]={kind:"渴望",lv:65,why:"她替人出头十二年，想替自己出头一次。","baseShift":0};
WILL_TO_ASCEND_V53["rv_ranger_k"]={kind:"淡泊",lv:10,why:"他认得每片林子的路，却不认得归路——他不想要神座，想要回家。","baseShift":0};
WILL_TO_ASCEND_V53["rv_ranger_l"]={kind:"随缘",lv:35,why:"林子的路比神座长。","baseShift":0};
WILL_TO_ASCEND_V53["rv_thief_y"]={kind:"渴望",lv:72,why:"她偷过最贵的东西是一句话。她想偷神座。","baseShift":0};
WILL_TO_ASCEND_V53["rv_thief_g"]={kind:"淡泊",lv:20,why:"他睡觉不熄灯。神座那地方太亮，他怕。","baseShift":0};
WILL_TO_ASCEND_V53["rv_priest_b"]={kind:"禁忌",lv:0,why:"他宽恕了一辈子，只有这一件事不会宽恕：神座被玷污。","baseShift":0,"trigger":"function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.church<15)return true;}catch(e){}return false;}"};
WILL_TO_ASCEND_V53["rv_priest_s"]={kind:"淡泊",lv:8,why:"她守夜不为成神，为等一个人。","baseShift":0};
WILL_TO_ASCEND_V53["rv_trade_j"]={kind:"执念",lv:90,why:"他经手过所有生意。神座是最后一笔。","baseShift":0};
WILL_TO_ASCEND_V53["rv_trade_y"]={kind:"淡泊",lv:15,why:"他只要船都顺风。神座不在这条航线上。","baseShift":0};
WILL_TO_ASCEND_V53["lv_mage1"]={kind:"随缘",lv:40,why:"她见过太多同族陨落，神座不如一棵树活得久。","baseShift":0};
WILL_TO_ASCEND_V53["lv_mage2"]={kind:"渴望",lv:60,why:"他不是想要神座，是想知道奥伦当年在观星台看到了什么。","baseShift":0};
WILL_TO_ASCEND_V53["lv_mage3"]={kind:"执念",lv:80,why:"他想找回那盏灯的光——如果神座能给他答案，他会去坐。","baseShift":0};
WILL_TO_ASCEND_V53["lv_mage4"]={kind:"淡泊",lv:20,why:"她守着树，不想守别的。","baseShift":0};
WILL_TO_ASCEND_V53["lv_mage5"]={kind:"禁忌",lv:0,why:"七印若稳，他一生不叩神座；七印若崩，他第一个去填坑。","baseShift":0,"trigger":"function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.watcher<10)return true;}catch(e){}return false;}"};
WILL_TO_ASCEND_V53["lv_war1"]={kind:"随缘",lv:45,why:"他等的是下一个矿工，不是神座。","baseShift":0};
WILL_TO_ASCEND_V53["lv_war2"]={kind:"渴望",lv:70,why:"他想让草原和人类之间，有一样东西比仇恨更结实。","baseShift":0};
WILL_TO_ASCEND_V53["lv_war3"]={kind:"执念",lv:82,why:"他要让断刀有名字，让铁门关不再需要人拿命去填。","baseShift":0};
WILL_TO_ASCEND_V53["lv_war4"]={kind:"随缘",lv:38,why:"他见过太多城破。神座救不了城，钱和刀才行。","baseShift":0};
WILL_TO_ASCEND_V53["lv_war5"]={kind:"淡泊",lv:15,why:"他打够了。神座那张椅子，不如酒馆的旧木凳舒服。","baseShift":0};
WILL_TO_ASCEND_V53["lv_priest1"]={kind:"渴望",lv:60,why:"他相信神座需要一个更清醒的人来坐——他愿意当那个人。","baseShift":0};
WILL_TO_ASCEND_V53["lv_priest2"]={kind:"淡泊",lv:12,why:"她守夜不为成神，为等一个人。","baseShift":0};
WILL_TO_ASCEND_V53["lv_priest3"]={kind:"随缘",lv:40,why:"她在两个种族之间长大，神座只是另一座桥。","baseShift":0};
WILL_TO_ASCEND_V53["lv_thief1"]={kind:"执念",lv:78,why:"他想偷回那件偷了三十年还不了的东西。","baseShift":0};
WILL_TO_ASCEND_V53["lv_thief2"]={kind:"随缘",lv:35,why:"她在两个世界之间活着，神座只有一个，她怕坐上去只剩一个世界。","baseShift":0};
WILL_TO_ASCEND_V53["lv_ranger1"]={kind:"淡泊",lv:10,why:"她只追风。神座会停，风不会。","baseShift":0};
WILL_TO_ASCEND_V53["lv_ranger2"]={kind:"随缘",lv:30,why:"他等的是最后一仗，不是神座。","baseShift":0};
WILL_TO_ASCEND_V53["lv_knight1"]={kind:"渴望",lv:62,why:"他想守护到不需要神座的那天。","baseShift":0};
WILL_TO_ASCEND_V53["lv_knight2"]={kind:"淡泊",lv:14,why:"她想守的是人，不是座位。","baseShift":0};
WILL_TO_ASCEND_V53["lv_smith1"]={kind:"渴望",lv:58,why:"他想听清初火说的那句话。","baseShift":0};
WILL_TO_ASCEND_V53["lv_smith2"]={kind:"执念",lv:76,why:"她想铸出老铸师说的真正的活物。","baseShift":0};
WILL_TO_ASCEND_V53["lv_soul1"]={kind:"禁忌",lv:0,why:"她看见的那条路，别人不许走——神座空悬时，她才会出手。","baseShift":0,"trigger":"function(){try{return false;}catch(e){return false;}}"};
WILL_TO_ASCEND_V53["theo_soul"]={kind:"禁忌",lv:0,why:"深渊压过七印、世界存亡时，他会放下没看透的自己。","baseShift":0,"trigger":"function(){try{if(typeof S!=='undefined'&&S&&S.worldState&&S.worldState.influence&&S.worldState.influence.watcher<8)return true;}catch(e){}return false;}"};
WILL_TO_ASCEND_V53["lv_hermit"]={kind:"淡泊",lv:5,why:"他连名字都不要了，更不要座位。","baseShift":0};
WILL_TO_ASCEND_V53["lv_drift"]={kind:"随缘",lv:25,why:"他走到哪儿算哪儿，神座不在他的路上。","baseShift":0};
WILL_TO_ASCEND_V53["lv_beast"]={kind:"禁忌",lv:0,why:"有人类踏入它的领地成神，它会出手。","baseShift":0,"trigger":"function(){try{return true;}catch(e){return true;}}"};


/*v57inj:strongExtra*/
window.STRONG_EXTRA_V57 = {
 "乌·森":{"cn":"乌·森","race":"human","org":"晨曦圣殿·守望派","realm":4,"job":"灵魂法师","desc":"守镜人一脉的执灯者，说话慢，走路更慢。他掌着一面旧铜镜，镜里照见的不是脸，是魂。","will":{"kind":"随缘","lv":30,"why":"他等一个能替他掌镜的人，等了三十年，已经不太着急了。"}},
 "雷·娜":{"cn":"雷·娜","race":"human","org":"晨曦圣殿·渡魂派","realm":4,"job":"灵魂法师","desc":"渡魂的船娘，嗓门大，心却细。她说魂和人一样，都吃软不吃硬。","will":{"kind":"渴望","lv":55,"why":"她想建一条通向北境的渡魂水路——船能到的对岸，魂也要能到。"}},
 "火克":{"cn":"火克","race":"dwarf","org":"锻造公会·符文派","realm":4,"job":"术士","desc":"矮人符文师，脾气像炉火，一点就着。他刻的符文没有一枚是重复的——他说符文和人一样，都得有自己的纹路。","will":{"kind":"执念","lv":60,"why":"他想刻出一枚「会记住主人」的符文——刻了一辈子，还没刻成。"}},
 "艾·德":{"cn":"艾·德","race":"human","org":"元素学院·守秘派","realm":4,"job":"魔法师","desc":"守秘派的执事，管着一间「不许进」的书库。他记性极好，可从不主动说话——他怕说漏一个字。","will":{"kind":"淡泊","lv":20,"why":"书库够他守一辈子了，他不想出去。"}},
 "霜辉":{"cn":"霜辉","race":"elf","org":"荒野巡守·狩猎派","realm":4,"job":"游侠","desc":"木精灵猎手，箭上从不带毒。他说林子里的事，交给林子的规矩——人掺和多了，树会记得。","will":{"kind":"随缘","lv":35,"why":"他在等一场雪，等到了就去北境。"}},
 "乌·黛":{"cn":"乌·黛","race":"human","org":"暗影阁·影誓派","realm":4,"job":"盗贼","desc":"影誓派的传令者，三更天出没。她立过一条誓：绝不偷信——因为信里的话，比金子重。","will":{"kind":"渴望","lv":50,"why":"她想找回一封被烧掉的信——那封信欠她一个答案。"}},
 "灰·珊":{"cn":"灰·珊","race":"halfling","org":"金衡商会·诚信派","realm":4,"job":"商人","desc":"半身人女商人，秤不离手。她经手的账，没有一笔烂账——不是她算得准，是她肯把每笔账都当回事。","will":{"kind":"淡泊","lv":22,"why":"她把账房当成了家，秤就是她的门框。"}}
};
/* ---- 4. 势力强者构成 ---- */
window.FACTION_PEERS_V53 = {
 "church":{"cn":"光明教会","main":"牧师","anchor":["lv_priest1","lv_priest2","lv_knight1"],"legend":["lv_priest1","lv_priest2","lv_knight1"],"masters":["m_牧师1","m_牧师2","m_牧师3","m_骑士1","m_骑士2","m_魔法师2"],"core":{"宗师":14,"化意":300,"凝元":2200},"note":"教皇（半神）高居使徒宫沉眠，非大事不干涉世事；教廷日常由大宗师主持教务，传奇级枢机是重大行动的统帅。"},
 "eclipse":{"cn":"暗蚀会","main":"（跨职业吸纳）","anchor":["ab_priest1","ab_mage1"],"legend":["ab_mage1"],"masters":["ab_priest1","ab_war1","ab_soul1","ab_knight1","ab_mage2","ab_priest2","ab_war2"],"core":{"宗师":10,"化意":200,"凝元":1600},"note":"深渊变体强者聚集之地，不入正史；腐化传奇蚀星·诺恩在暗处调度，宗门不设神座。"},
 "watcher":{"cn":"守望者","main":"（跨职业吸纳）","anchor":["lv_mage5"],"legend":["lv_mage5"],"masters":["m_魔法师4","m_灵魂法师1","m_灵魂法师2","m_魔法师5","m_游侠3"],"core":{"宗师":8,"化意":120,"凝元":900},"note":"奥雷利安·晨曦（半神）在塔顶守望七印，日常由大宗师藏卷师们轮流值守；传奇灰书伊尔是行动者。"},
 "guild":{"cn":"自由商会","main":"商人","anchor":["lv_trade1","lv_thief2"],"legend":["lv_trade1","lv_thief2"],"masters":["m_商人1","m_商人2","m_商人3","m_盗贼1","m_盗贼2","m_盗贼3"],"core":{"宗师":12,"化意":260,"凝元":2100},"note":"交汇城的天平与暗秤——总会长文森·金秤坐镇，盗贼传奇薇·灰雾游离商路之间。"},
 "north":{"cn":"北方公国联盟","main":"战士","anchor":["lv_war3"],"legend":["lv_war3"],"masters":["m_战士1","m_战士2","m_战士3","m_骑士3","m_骑士4"],"core":{"宗师":16,"化意":400,"凝元":3400},"note":"铁门关的守军，用血喂大的战旗；镇北军统领秦·长风是唯一常驻关隘的传奇，大宗师各领一营。"},
 "south":{"cn":"南方商业城邦","main":"商人","anchor":["lv_trade2"],"legend":["lv_trade2","lv_war5"],"masters":["m_商人4","m_商人5","m_商人6","m_战士4","m_战士5","m_盗贼4"],"core":{"宗师":10,"化意":220,"凝元":1800},"note":"港口的船与账本——船王洛佩斯·半帆掌商路，退役海卫传奇罗·断江守在酒馆里，海上出大事时他会拿回那柄枪。"},
 "elf":{"cn":"精灵王国","main":"游侠·法师","anchor":["lv_mage1","lv_mage4","lv_ranger1"],"legend":["lv_mage1","lv_mage4","lv_ranger1"],"masters":["m_魔法师1","m_魔法师3","m_魔法师6","m_游侠1","m_游侠2","m_牧师4"],"core":{"宗师":12,"化意":180,"凝元":1200},"note":"银叶城的长者，精灵传奇占全大陆近四成（另有一位精灵圣辉主教艾诺尔游离于教会与森林之间）。"},
 "dwarf":{"cn":"矮人王国","main":"术士·战士","anchor":["lv_smith1","lv_war1","theo_smith"],"legend":["lv_smith1","lv_war1"],"masters":["m_术士1","m_术士2","m_术士3","m_战士6","m_术士4"],"core":{"宗师":9,"化意":150,"凝元":1100},"note":"铁峰堡的炉火，与王座下的传承半神索林；传奇符文大师格朗掌锻造公会，卫队总长格罗·铁壁守城墙。"},
 "orc":{"cn":"兽人王庭","main":"战士","anchor":["lv_war2","lv_兽王"],"legend":["lv_war2"],"masters":["m_战士2","m_战士7","m_术士5","r_sham1","r_sham2"],"core":{"宗师":8,"化意":200,"凝元":1800},"note":"草原的狼旗，与百兽之王·鬃吼（传奇级超凡野兽，不算人类）；狼旗第一勇士喀兰·赤峰是唯一常驻草原的人类传奇。"},
 "free":{"cn":"游离传奇","main":"（独立/组织坐镇）","anchor":["lv_mage2","lv_thief1","lv_soul1"],"legend":["lv_mage2","lv_mage3","lv_war4","lv_priest3","lv_thief1","lv_ranger2","lv_knight2","lv_smith2","lv_soul1"],"masters":[],"core":{"宗师":0,"化意":0,"凝元":0},"note":"传奇不全属于势力——元素学院首席洛·晨雾、暗影阁阁主杜·夜枭、晨曦圣殿守镜人澜·梦墟、北境自由猎手贺·断弓等，各有自己的旗号与立场。"}
};
/* ---- 5. 取名程序 NAME_GEN_V53 ---- */
window.NAME_GEN_V53 = {
 "human":{"surname":["林","洛","卡","艾","雷","白","灰","费","朗","凯","沈","秦","罗","贺","萧","杜","文","康","叶","乌"],"given_m":["恩","德","兰","尔","森","达","克","方","承","远"],"given_f":["娅","娜","琳","薇","黛","苏","莉","珊","茉","汐"]},
 "elf":{"pre":["银","星","风","露","月","林","霜","夜","晨","青"],"root":["叶","歌","羽","辉","梦","语","光","溪","影","岚"]},
 "dwarf":{"pre":["铁","炉","岩","铜","锤","砧","矿","火","石","银"],"root":["德","格","姆","恩","克","里","顿","尔","布","隆"]},
 "orc":{"pre":["血","牙","吼","骨","疤","刃","岩","雷","霜","怒"],"root":["克","格","图","兰","哈","泽","鲁","姆","拉","达"]},
 "halfling":{"pre":["豆","麦","蜜","姜","果","栗","桃","莓","椒","芹"],"root":["卜","丁","克","洛","尔","姆","尼","托","温","比"]},
 "dragon":{"pre":["鳞","焰","翼","尾","炽","烬","霄","渊","金","玄"],"root":["雷","炎","隆","格","泽","烈","空","影","牙","颅"]},
 "mixed":{"pre":["灰","雾","尘","影","霜","雨","野","旧","新","半"],"root":["鸦","狐","狼","鹿","雀","鳅","驼","沙","苇","桥"]},
 "title_pool":{"魔法师":["星","月","雾","霜","雷","焰","书","塔","语","镜"],"战士":["铁","断","赤","孤","长","破","荒","戈","峰","江"],"牧师":["圣","静","烛","光","言","白","慈","守","晨","辉"],"盗贼":["夜","灰","影","枭","刃","雾","鸦","鼠","钩","尘"],"商人":["金","秤","帆","算","银","账","货","栈","舵","契"],"游侠":["逐","双","断","枯","青","风","林","弓","矢","路"],"骑士":["白","金","誓","盾","辉","晨","守","铁","冠","骑"],"术士":["炉","锤","砧","焰","铁","符","熔","铸","锻","火"],"灵魂法师":["梦","墟","无","澜","歌","影","忆","忘","灵","心"]},
 "used":{}
};
/* ---- 6. 成神三要素 THEOMACHY_V53 ---- */
window.THEOMACHY_V53 = {
 "魔法师":{"relic":"星语石","relicStory":["星语石是初代元素神寂光的随身之物。它不发光，只在双子星同升时，石面浮起一道极细的银纹，像一句说给夜听的话。","两千年前寂光陨落时，这块石头随神座一同沉入星落塔第七层的观星台。历代首席都见过它，没有人能把它拿起来——它认人。","它认得一个愿意替它凝视世界的人。你握着它的时候，石面温热，你听见潮汐的声音。"],"place":"星落塔第七层·观星台","time":"双子星同升之夜","cond":"持有觉醒的星语石，且已通过神座试炼","truth":"你终于懂了：法则不是被证明的，是被看见的。你一生都在证明元素，而元素从第一万年前就在等你——它不需要你的证明，它只需要一个愿意替它凝视世界的人，替它记住风从哪来，水往哪去。"},
 "战士":{"relic":"断山战旗","relicStory":["断山战旗是初代战神戈的旗帜。旗面只剩半幅，血迹浸透又晒干，干透又浸透，硬得像一块铁板。","戈陨落那天，把旗插在古战场最高的土丘上。三千年过去，旗杆没倒，旗也没烂——它记得每一场胜负。","旗面认得一个敢为别人挡刀的人。你握住旗杆时，听见万军齐吼的回声。"],"place":"古战场·万人坑旧址","time":"月晦之夜","cond":"持有觉醒的断山战旗，且已通过神座试炼","truth":"你终于懂了：勇气不是不害怕，是害怕着也往前走。战神戈的旗插了三千年，不是因为它结实，是因为每一场仗都有人替别人挡了一刀。你一生都在变强，而真正让你像他的，是你肯为谁挡那一刀。"},
 "牧师":{"relic":"圣辉烛","relicStory":["圣辉烛是太阳神圣临成神前，在静默殿守夜用的那支蜡烛。烛泪堆了半人高，烛芯却从未烧短过。","它被供在大教堂地下的静默殿里，三百年没人敢碰。相传它在等一个愿意把黑暗都烧完的人。","烛火认得一个见过黑暗却不转身的人。你靠近时，满殿的阴影都往后退了一步。"],"place":"大教堂地下·静默殿","time":"晨祷前一刻","cond":"持有觉醒的圣辉烛，且已通过神座试炼（在位神·圣临在座，此路最难）","truth":"你终于懂了：圣光不是照亮的，是燃尽的。太阳神在成神前烧完了自己所有的迟疑，才剩下那点不灭的光。你一生都在借光前行，而这一天，你终于明白——光不是借来的，是自己烧出来的。"},
 "盗贼":{"relic":"无痕影","relicStory":["无痕影不是一件东西，是一道影子。它没有形状，只在一面旧镜子里活着——那面镜子是初代盗贼祖师留下的唯一遗物。","没有人见过影子的主人，因为它从来没有名字。盗贼这一道，从开宗起就没有神，也没有人知道为什么。","影子认得一个敢把「不存在」当名字的人。你对着镜子的时候，镜中的影子没有跟着你动——它在等你。"],"place":"暗影阁最深处的镜厅","time":"正午","cond":"持有觉醒的无痕影，且已通过神座试炼（此座从无人坐过，你是第一个叩门者）","truth":"你终于懂了：盗贼的极致不是偷走什么，是让世界忘记你存在过。暗影无神，不是因为没人够格，是因为没有人愿意为了成神而留下名字——而你来了。你站在镜子前，第一次觉得，原来「不存在」也是可以一个人扛到底的。"},
 "游侠":{"relic":"双叶之环","relicStory":["双叶之环是一枚用两片常青树叶编成的环，编它的人早已不在。树环不枯，因为它每隔百年会自己长出一片新叶。","传说编环的人是初代林语者，她走遍了所有森林，最后把自己种在了一棵树下。","树环认得一个走得比它还远的人。你戴上它时，风从四面来，像无数条路在向你问好。"],"place":"世界树最高枝·雾顶","time":"春分日出","cond":"持有觉醒的双叶之环，且已通过神座试炼","truth":"你终于懂了：路不是走出来的，是野的。林语者从不修路，她只走在兽道与鹿径上，让路自己长出来。你一生都在寻找方向，而这一天你明白了——真正的方向，是你在找不到路的时候，仍然愿意往前走的那一步。"},
 "骑士":{"relic":"无名誓约","relicStory":["无名誓约是誓约之神成神前立下的第一道誓约。它没有文字，只刻在一面残破的塔盾内壁——一道指印。","神成神后，把盾留在了圣坛下，自己隐世不出。有人说他在等一个敢把誓约立给自己的人。","盾面认得一个说话算话的人。你触碰时，指印与你重合，整面盾都亮了一下。"],"place":"圣城旧圣坛遗址","time":"星夜","cond":"持有觉醒的无名誓约，且已通过神座试炼（在位神·无名在座，此路最难）","truth":"你终于懂了：誓约不是用来守的，是用来成为的。誓约之神把自己活成了那道誓约，所以他不需要现身，他的话就是他的样子。你一生都在遵守别人的誓言，而这一天你立下第一道自己的——你知道，从此你不是在守约，你就是那道约。"},
 "术士":{"relic":"铸火锤","relicStory":["铸火锤是初代锻造之神铸的锤。锤身通体玄黑，没有一丝花纹，因为铸不想要任何东西分走它的眼睛。","铸陨落后，锤被索林·铁须收进铁峰堡王座之下。索林说，他握不起这柄锤——它不是重，是烫。","锤柄认得一个敢把命烧进造物里的人。你握上时，掌心没有灼痛，只有心跳。"],"place":"铁峰堡王座下·初火熔炉","time":"铸火节子夜","cond":"持有觉醒的铸火锤，且已通过神座试炼","truth":"你终于懂了：造物不是用手做的，是用命烧的。锻造之神铸一生只造过一件东西，就是他自己——他把命烧进炉里，才留下这柄没有花纹的锤。你一生都在造物，而这一天你终于明白，最难的造物，是把你自己造出来，再亲手交给世界用。"},
 "灵魂法师":{"relic":"回音之镜","relicStory":["回音之镜是奥雷利安·晨曦自创此道时，用第一缕灵魂之火凝成的镜子。镜面不照人，只照声音——你对着它说一句话，会听见它回答你一句你没有说出口的话。","奥雷利安把这面镜子留在晨曦圣殿，自己去了守望者塔。他说，等他不再需要听回声的时候，会回来拿它。","镜面认得一个敢直视自己另一面的人。你站在镜前，镜中没有你，只有一道安静的、等你的影。"],"place":"晨曦圣殿·回音室","time":"黎明前","cond":"持有觉醒的回音之镜，且已通过神座试炼","truth":"你终于懂了：灵魂法师的道，是先把自己看穿，再看别人。奥雷利安自创此道三千年，他不是不想成神，是他还没把自己看透。而你站到这一步才发现——看透自己，比看透一万个人都难。你合上眼，第一次听清了镜子里那道回声：它不是别人，是你自己。"},
 "商人":{"relic":"金衡砝码","relicStory":["金衡砝码是财富之神金衡成神前用的那杆秤的秤砣。砝码上刻着一行小字，被磨得几乎看不见：「万物有价，唯契约无价。」","金衡成神后，把这枚砝码放在金衡商会总部的天平上，压着整条大陆的物价。三百年没人敢动它。","砝码认得一个从不算错账、也从不算计人的人。你拿起它时，手心一沉——不是重，是它认了你。"],"place":"金衡商会总部·天平厅","time":"岁末结算之夜","cond":"持有觉醒的金衡砝码，且已通过神座试炼（在位神·金衡在座，此路最难）","truth":"你终于懂了：等价交换的尽头，是把自己也放上天平。财富之神金衡称过世间万物，唯独称自己的时候，他犹豫了三百年——因为他知道，一旦把自己放上去，就再没有回头路了。而你走到这一步，终于把那枚砝码放在了秤上，稳稳的，没有一丝抖。"}
};

/*v53inj:will2*/
WILL_TO_ASCEND_V53["lv_兽王"]={kind:"禁忌",lv:0,why:"有人类踏入它的领地成神，它会出手。","baseShift":0};
WILL_TO_ASCEND_V53["lv_隐世"]={kind:"淡泊",lv:5,why:"他早已走下台阶——神座于他，只是一件穿旧了又脱下的袍子。","baseShift":0};
WILL_TO_ASCEND_V53["lv_散人"]={kind:"随缘",lv:35,why:"他吃过神座的亏——那条手臂就是代价。","baseShift":0};


/* ===== v54inj:system 强者分布重构 ===== */
window.v54_pop_calc = function(o){
  // 网络小说体系强者分布：低阶漫灌、高阶锐减、塔尖绝对配额
  // o = {total, decay:{2,3,4,5}, floor:{6,7,8}}
  // decay[4]=0.08 → 化意→宗师陡降92%（第一大门槛）
  // decay[5]=0.06 → 宗师→大宗师再降94%（第二大门槛前奏）
  try{
    var decay = o.decay || {2:0.27,3:0.25,4:0.08,5:0.06};
    var floor = o.floor || {6:26,7:9,8:9};
    var L = {1:1};
    for(var lv=2; lv<=5; lv++) L[lv] = L[lv-1]*(decay[lv]||0);
    var sum=0; for(var lv=1; lv<=5; lv++) sum+=L[lv];
    var base = (o.total - (floor[6]||0) - (floor[7]||0) - (floor[8]||0)) / sum;
    var out = {};
    for(var lv=1; lv<=5; lv++) out[lv] = Math.round(base*L[lv]);
    out[6]=floor[6]||0; out[7]=floor[7]||0; out[8]=floor[8]||0;
    out._decay=decay; out._base=base; out._total=o.total;
    return out;
  }catch(e){ return {1:0,2:0,3:0,4:0,5:0,6:0}; }
};
window.v54_calcJobPop = function(jobPop, decay, floor){
  // 单职业人数推算：输入该职业能力者总人口 → {1启灵,2凝元,3化意,4宗师,5大宗师,6传奇配额}
  try{
    var p = window.v54_pop_calc({total:jobPop, decay:decay||null, floor:floor||null});
    return {1:p[1],2:p[2],3:p[3],4:p[4],5:p[5],6:p[6]};
  }catch(e){ return {1:0,2:0,3:0,4:0,5:0,6:0}; }
};
window.v54_ensureDefaults = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.v53_ensureDefaults) v53_ensureDefaults();
    if(!S.worldState) S.worldState={influence:{},stance:{},flags:{},lastTick:0,unlocked:true};
    if(!S.worldState.flags) S.worldState.flags={};
  }catch(e){}
};
window.WORLD_NORMAL_V54 = {
  "人口": {"total":25000000,"normal":24875000,"ability":125000,"ratio":"0.5%"},
  "普通人职责": ["粮食种植","粮食加工","货物搬运","城镇服务","工匠营造","底层政务","商路运输","矿业采掘","码头装卸","客栈厨灶"],
  "权力分流": {"note":"部分商人与贵族是普通人——能力者需要普通人的智力、交际、资源与人脉；贵族体系与能力体系平行，能力者不必然高人一等。","例":"一个化意佣兵在普通公爵面前，依然要按礼数行礼。"},
  "军队体系": {
    "结构":"普通军人为主体（国家军制），能力者编入军官团与特种队——一支万人军团里，化意级只有数十人，宗师级不过一掌之数。",
    "化意定位":"化意期一两百普通军人便可围杀，按职业 60–200 人浮动；宗师起，千人以下的军队难以围杀。",
    "职业差异":{"战士":200,"骑士":180,"牧师":180,"游侠":130,"盗贼":110,"术士":90,"商人":100,"魔法师":80,"灵魂法师":60}
  },
  "经济供应链": [
    "能力者不事生产，是纯消耗者——材料、药材、魔石、情报、后勤，全由普通人的双手供给。",
    "魔石矿工、药草农、佣兵伙夫、马夫、账房，这些行当里九成九是普通人。",
    "灾年粮价飞涨，雇佣能力者的佣金也会跟着涨——粮袋子捏在普通人手里，刀剑才不敢太狂。"
  ],
  "政治制衡": "贵族掌世俗权（赋税、律法、官职、婚姻），能力者掌武力——两套体系互相离不开：贵族借能力者护庄园，能力者借贵族买材料、走关系、留后路。",
  "组织晋升": {"宗师":"组织执事门槛","大宗师":"组织席主 / 一方坐镇门槛","传奇":"战略行动统帅"},
  "联动": ["v52 九组织晋升与境界门槛挂钩","v47 势力影响力受军队、粮价、商路影响","v53 强者谱中的宗师与大宗师，多出身组织、军队与商会"]
};
window.LEGEND_ACTION_V54 = [
  {id:"la_north_wall", force:"north", day:90, title:"铁门关·传奇临阵", legend:"秦·长风", prefixes:["h_faction_north","city_north","pro_choose_north"],
   text:["东军围关第十日，镇北军统领秦·长风走下城楼，单人单枪立于关前雪地。","那一夜，东军退了三十里。退兵的理由没人说得清——有人说是怕了他，有人说是怕了他背后的那面旗。","关里的老卒说：统领不是去杀人的，他是去告诉对面——铁门关，还有传奇在看。"]},
  {id:"la_elf_ring", force:"elf", day:170, title:"银叶城·结界之议", legend:"瑟琳·银冠", prefixes:["h_faction_elf","city_elf"],
   text:["世界树的根在夜里低鸣。长老会连夜召见瑟琳·银冠，她走出结界时，整个森林的鸟都停了。","她把银冠戴回发间，只说了一句：树说，还能撑一百年。","但长老们都知道，她说的是树，不是这座城。"]},
  {id:"la_church_door", force:"church", day:320, title:"圣城·静默殿门", legend:"克莱门·圣言", prefixes:["holy_","church_","city_holy"],
   text:["净化令最烈的那几天，静默殿的门开了一线。克莱门·圣言站在门后，没有说一个字。","那一线光落在执事们脚下，落在每一间被查封的铺子门口。第二天，净化的刀慢了下来。","没有人敢问是谁开的门——圣城的人只说：那几天，连钟声都在等他开口。"]},
  {id:"la_guild_convoy", force:"guild", day:380, title:"银穗商路·金秤出账", legend:"文森·金秤", prefixes:["h_trade_","city_free"],
   text:["银穗商路被劫的第三批货到账那晚，金衡商会的总账房亮了一夜灯。","第二天，一纸文书贴满交汇城：商会雇下所有能雇的宗师护卫，镖费一律减半。","有人说文森疯了，账房先生拨着算盘：会长说，路通了，账才走得动。"]},
  {id:"la_south_sea", force:"south", day:450, title:"南方港外·断江出海", legend:"罗·断江", prefixes:["south_","h_trade_","city_south"],
   text:["南方三个港口被封的第七天，有人看见退役的罗·断江从酒馆房梁上取下了那柄旧枪。","他雇了一条小船，独自出了海。三天后，封锁的文书撤了。","港口的老人说：他没打仗，他就是去海上坐了一会儿——海认得他。"]},
  {id:"la_eclipse_night", force:"eclipse", day:500, title:"暗处·蚀星点名", legend:"蚀星·诺恩", prefixes:["eclipse_","h_dark_","h_underworld_"],
   text:["暗蚀会内部传闻：诺恩在某个夜里，用黑火在一面墙上写下了一批名字。","名单上的人，一个月内陆续失踪。没有人知道名单上有没有自己。","暗巷里有人说：诺恩不出手则已，出手必是大事。"]},
  {id:"la_seal_watch", force:"watcher", day:550, title:"第七印·灰书下山", legend:"伊尔·灰书", prefixes:["seal_","city_seal","abyss_"],
   text:["封印又松一分的那天，守望者塔的灰书伊尔第一次把那卷灰布书抱下了山。","他把书交给一位大宗师藏卷师：替我保管一天。我去看看第七印。","那之后，沙漠深处传来的消息越来越少。有人说他还在那里，有人说他进了门。"]},
  {id:"la_orc_howl", force:"orc", day:600, title:"草原·喀兰立碑", legend:"喀兰·赤峰", prefixes:["h_faction_orc","city_orc"],
   text:["草原与人类的旧战遗址上，喀兰·赤峰立起了一块碑。碑上没有字，只有狼旗的爪印。","他站在碑前说：这块碑，是给将来和谈用的。","人类边境的斥候把消息传回去时，没人信。直到第二年开春，狼旗真的没有再往南挪。"]},
  {id:"la_dwarf_hammer", force:"dwarf", day:650, title:"铁峰堡·符文封炉", legend:"格朗·符文", prefixes:["h_faction_dwarf","city_dwarf"],
   text:["王座下初火熔炉异动的那夜，格朗·符文用一柄小锤，在炉口刻下三道符文。","炉火安静了。铁峰堡的老矮人说：他封的不是炉，是炉底下那些不该醒的东西。","格朗把锤子插回腰带：火还烧着，别怕。"]}
];
window.v54_legendTick = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(!S.worldState){ if(window.v47_initState) v47_initState(); else return; }
    var d = (S.time && typeof S.time.totalDays==='number') ? S.time.totalDays : (S.day||0);
    var evs = window.LEGEND_ACTION_V54||[];
    for(var i=0;i<evs.length;i++){
      var ev=evs[i];
      var key='ev_'+ev.id;
      if(d>=ev.day && !S.worldState.flags[key]){
        S.worldState.flags[key]=true;
        var line = ev.text[Math.floor(Math.random()*ev.text.length)];
        var onScene=false;
        if(ev.prefixes){
          for(var j=0;j<ev.prefixes.length;j++){ if(curNode && curNode.indexOf(ev.prefixes[j])===0){ onScene=true; break; } }
        }
        try{
          if(onScene){ logMsg('【'+ev.title+'】'+line,'warn'); flashMsg(ev.title); }
          else { if(window.v46_maybeMissed) v46_maybeMissed(ev.id, line, ev.prefixes||[]); }
        }catch(e){}
        if(!S.worldChronicle) S.worldChronicle=[];
        S.worldChronicle.push({day:d, week:Math.floor(d/7), title:ev.title, text:line, seen:onScene, legend:ev.legend});
        if(S.worldChronicle.length>40) S.worldChronicle = S.worldChronicle.slice(-40);
      }
    }
  }catch(e){}
};
/* ===== /v54inj:system ===== */
/* ===== v55inj:skills 职业技能实战化 + 职业命运弧 ===== */
const SKILLS_V55 = {
 "魔法师":{
  t1:[
   {id:"sk_mage_fireball",cn:"火球术",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:12},desc:"捏一团火，脱手时才知道它有多烫。",eff:{type:"bonus",value:2}},
   {id:"sk_mage_icearmor",cn:"冰甲术",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"寒气凝甲，薄薄一层，却让刀剑慢半拍。",eff:{type:"bonus",value:2,note:"防御"}},
   {id:"sk_mage_magicperceive",cn:"魔力感知",type:"被动",scene:"探索",tier:1,realm:1,cost:null,desc:"指尖常有细碎的静电——你总比旁人先一步察觉到异样。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_mage_chain",cn:"闪电链",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:18},desc:"雷光在敌群间跳跃，像一条不肯安静的蛇。",eff:{type:"bonus",value:3}},
   {id:"sk_mage_arcaneshield",cn:"奥术盾",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:20},desc:"半透明的屏障，替你挡下致命的那一下。",eff:{type:"floor",value:60}},
   {id:"sk_mage_amplify",cn:"法术增效",type:"被动",scene:"修炼",tier:2,realm:2,cost:null,desc:"同样的咒文，你念出来，总比别人多一分力道。",eff:{type:"pct",value:0.03}}],
  t3:[
   {id:"sk_mage_meteor",cn:"陨石召唤",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:28},desc:"天上的石头应你而来——落地之前，没人知道它有多大。",eff:{type:"bonus",value:4,note:"保底"}},
   {id:"sk_mage_blink",cn:"空间折跃",type:"主动",scene:"探索",tier:3,realm:3,cost:{res:"mp",n:15},desc:"一步踏出，再睁眼已在几步之外——运气好的话。",eff:{type:"reroll"}}],
  t4:[
   {id:"sk_mage_grand",cn:"本源·大裂解",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:40},desc:"把「现实」两个字拆开来看看——这从来不是温和的学问。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "灵魂法师":{
  t1:[
   {id:"sk_soul_sight",cn:"灵魂视野",type:"主动",scene:"探索",tier:1,realm:1,cost:{res:"mp",n:10},desc:"闭上一只眼，另一只眼看见的就不是皮囊了。",eff:{type:"bonus",value:2}},
   {id:"sk_soul_lullaby",cn:"安魂曲",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"低低的调子，让生者手软，让亡者安静。",eff:{type:"bonus",value:2,note:"敌方-2"}},
   {id:"sk_soul_empathy",cn:"灵体感知",type:"被动",scene:"社交",tier:1,realm:1,cost:null,desc:"你听得出谎话——因为它没有心跳。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_soul_attach",cn:"附灵术",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:18},desc:"请一位过客附在影子里，替你多看一眼。",eff:{type:"bonus",value:3}},
   {id:"sk_soul_link",cn:"灵魂链接",type:"主动",scene:"社交",tier:2,realm:2,cost:{res:"mp",n:15},desc:"把你的情绪递过去，像递一杯酒。",eff:{type:"bonus",value:2}},
   {id:"sk_soul_gather",cn:"凝魂",type:"被动",scene:"修炼",tier:2,realm:2,cost:null,desc:"魂灯常明的人，突破时少要一份外物。",eff:{type:"pct",value:0.03}}],
  t3:[
   {id:"sk_soul_gaze",cn:"夺魄凝视",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:22},desc:"盯着他的眼睛看——那里面的东西，会替你说话。",eff:{type:"reroll"}},
   {id:"sk_soul_wisp",cn:"魂火引路",type:"主动",scene:"探索",tier:3,realm:3,cost:{res:"mp",n:15},desc:"一点青火浮在半空，固执地往一个方向飘。",eff:{type:"bonus",value:3}}],
  t4:[
   {id:"sk_soul_lamp",cn:"本源·魂灯长明",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:38},desc:"灯芯是你的命，油是你的魂——今晚，让它烧得久一点。",eff:{type:"bonus",value:4,note:"防御+恢复"}}]
 },
 "术士":{
  t1:[
   {id:"sk_smith_potion",cn:"愈伤药剂",type:"恢复",scene:"恢复",tier:1,realm:1,cost:{res:"mp",n:8},desc:"一瓶褐色的苦汤，喝下去胃里先暖，伤口后合。",eff:{type:"heal",value:30}},
   {id:"sk_smith_acid",cn:"强酸飞溅",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"一瓶酸液，泼出去前记得屏住呼吸。",eff:{type:"bonus",value:2}},
   {id:"sk_smith_appraise",cn:"材料辨识",type:"被动",scene:"交易",tier:1,realm:1,cost:null,desc:"摸一摸、闻一闻，就知道它值不值这个价。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_smith_rune",cn:"符文刻印",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:16},desc:"在武器上刻一道符文——锋利会记得。",eff:{type:"bonus",value:3}},
   {id:"sk_smith_bomb",cn:"炼金炸弹",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:20},desc:"轰的一声，然后是一阵呛人的黄烟。",eff:{type:"bonus",value:3,note:"范围"}},
   {id:"sk_smith_alchemy",cn:"药剂精通",type:"被动",scene:"修炼",tier:2,realm:2,cost:null,desc:"护法的药，你总比别人配得匀。",eff:{type:"pct",value:0.03}}],
  t3:[
   {id:"sk_smith_shape",cn:"变形术·兽形",type:"主动",scene:"探索",tier:3,realm:3,cost:{res:"mp",n:18},desc:"药水入喉，骨骼咯咯作响——你要变成另一个样子。",eff:{type:"bonus",value:3}},
   {id:"sk_smith_goldhand",cn:"熔金之手",type:"主动",scene:"交易",tier:3,realm:3,cost:{res:"mp",n:12},desc:"指腹滚烫，摸过的铁器都像是活了过来。",eff:{type:"bonus",value:3}}],
  t4:[
   {id:"sk_smith_furnace",cn:"本源·造化炉",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:40},desc:"心里有一座炉子，什么都能回炉重造——包括局面。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "战士":{
  t1:[
   {id:"sk_war_charge",cn:"冲锋",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:8},desc:"先动手的人，往往先开口说话。",eff:{type:"bonus",value:2,note:"先手"}},
   {id:"sk_war_bulwark",cn:"铁壁",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:8},desc:"把盾立住，把脚钉死——剩下的交给对手。",eff:{type:"bonus",value:2,note:"防御"}},
   {id:"sk_war_bloodlust",cn:"战意",type:"被动",scene:"战斗",tier:1,realm:1,cost:null,desc:"伤口越疼，手越稳。",eff:{type:"bonus",value:1}}],
  t2:[
   {id:"sk_war_combo",cn:"连斩",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:16},desc:"一刀接着一刀，刀刀都在问同一个问题。",eff:{type:"reroll"}},
   {id:"sk_war_roar",cn:"战吼",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:12},desc:"吼声先到，人后到。",eff:{type:"bonus",value:2,note:"敌方-2"}},
   {id:"sk_war_instinct",cn:"战场直觉",type:"被动",scene:"探索",tier:2,realm:2,cost:null,desc:"后颈的汗毛比脑子先做出判断。",eff:{type:"bonus",value:2}}],
  t3:[
   {id:"sk_war_break",cn:"破军斩",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:24},desc:"这一刀劈下去，不是为了杀，是为了开路。",eff:{type:"bonus",value:4}},
   {id:"sk_war_blood",cn:"血战",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:20},desc:"血越流越多，眼前反而越清楚。",eff:{type:"bonus",value:3,note:"低HP时"}}],
  t4:[
   {id:"sk_war_wrath",cn:"本源·战神之怒",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:38},desc:"这一刻你不是你——你是一面被点燃的战旗。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "骑士":{
  t1:[
   {id:"sk_knight_shield",cn:"圣盾",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"盾面上有光——不刺眼，但足够让黑暗犹豫。",eff:{type:"bonus",value:2,note:"防御"}},
   {id:"sk_knight_justice",cn:"正义打击",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"为理而挥的一剑，剑身会自己发光。",eff:{type:"bonus",value:2}},
   {id:"sk_knight_oath",cn:"誓约印记",type:"被动",scene:"社交",tier:1,realm:1,cost:null,desc:"说到做到的人，名字在集市上也值钱。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_knight_aura",cn:"惩戒光环",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:16},desc:"光环展开，敌人在光里站不稳。",eff:{type:"bonus",value:3}},
   {id:"sk_knight_vow",cn:"守护誓言",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:14},desc:"你替他挡——这是你答应过的事。",eff:{type:"bonus",value:3,note:"守护"}},
   {id:"sk_knight_riding",cn:"马术精通",type:"被动",scene:"探索",tier:2,realm:2,cost:null,desc:"马背上的风，是你最熟的风。",eff:{type:"bonus",value:2}}],
  t3:[
   {id:"sk_knight_smite",cn:"破邪斩",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:22},desc:"对深渊之物，这一剑格外烫。",eff:{type:"bonus",value:4,note:"对深渊"}},
   {id:"sk_knight_sacrifice",cn:"牺牲",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:20},desc:"把退路让出去——有些路本就不该留。",eff:{type:"bonus",value:3,note:"代受伤害"}}],
  t4:[
   {id:"sk_knight_sword",cn:"本源·誓约之剑",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:38},desc:"剑与誓约同出——守住的，就是斩下的。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "游侠":{
  t1:[
   {id:"sk_ranger_shot",cn:"精准射击",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:8},desc:"瞄准的时候，风会停下来等你。",eff:{type:"bonus",value:2}},
   {id:"sk_ranger_sense",cn:"野性感知",type:"主动",scene:"探索",tier:1,realm:1,cost:{res:"mp",n:8},desc:"地上的脚印、折断的草茎，都在说话。",eff:{type:"bonus",value:2}},
   {id:"sk_ranger_light",cn:"轻身步",type:"被动",scene:"探索",tier:1,realm:1,cost:null,desc:"踩过落叶而不惊动它——这门手艺练了很久。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_ranger_multi",cn:"连珠箭",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:14},desc:"两箭一前一后，后箭追着前箭的尾巴。",eff:{type:"reroll"}},
   {id:"sk_ranger_beast",cn:"兽语",type:"主动",scene:"社交",tier:2,realm:2,cost:{res:"mp",n:10},desc:"你学它的叫声，它歪着头看你。",eff:{type:"bonus",value:2}},
   {id:"sk_ranger_nature",cn:"自然亲和",type:"被动",scene:"修炼",tier:2,realm:2,cost:null,desc:"在树下打坐，比在屋里快。",eff:{type:"pct",value:0.03}}],
  t3:[
   {id:"sk_ranger_eye",cn:"鹰眼",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:16},desc:"瞳孔收紧，世界的杂音都被滤掉了。",eff:{type:"reroll"}},
   {id:"sk_ranger_trap",cn:"陷阱大师",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:16},desc:"绊索、夹齿、吊网——总有一款适合他。",eff:{type:"bonus",value:3}}],
  t4:[
   {id:"sk_ranger_forest",cn:"本源·森林之子",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:36},desc:"整片林子都在帮你——你只是那个出手的人。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "盗贼":{
  t1:[
   {id:"sk_thief_stealth",cn:"潜行",type:"主动",scene:"探索",tier:1,realm:1,cost:{res:"mp",n:8},desc:"影子先你一步过去探路。",eff:{type:"bonus",value:2}},
   {id:"sk_thief_backstab",cn:"背刺",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"他看见你的时候，你已经不在了。",eff:{type:"bonus",value:3,note:"先手"}},
   {id:"sk_thief_lockpick",cn:"开锁",type:"主动",scene:"探索",tier:1,realm:1,cost:{res:"mp",n:6},desc:"锁芯转动的声响，比任何音乐都好听。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_thief_poison",cn:"毒刃",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:12},desc:"刃上那层暗色，是后劲。",eff:{type:"bonus",value:2,note:"持续"}},
   {id:"sk_thief_disguise",cn:"易容",type:"主动",scene:"社交",tier:2,realm:2,cost:{res:"mp",n:10},desc:"换一张脸，换一种活法。",eff:{type:"bonus",value:2}},
   {id:"sk_thief_pick",cn:"顺手牵羊",type:"主动",scene:"交易",tier:2,realm:2,cost:{res:"mp",n:10},desc:"擦肩而过，世界就少了一样东西。",eff:{type:"bonus",value:2}}],
  t3:[
   {id:"sk_thief_shadow",cn:"影袭",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:16},desc:"从影子里出手，影子不记得他。",eff:{type:"reroll"}},
   {id:"sk_thief_erase",cn:"抹除痕迹",type:"主动",scene:"探索",tier:3,realm:3,cost:{res:"mp",n:12},desc:"你来过，但没人能证明。",eff:{type:"bonus",value:3}}],
  t4:[
   {id:"sk_thief_law",cn:"本源·影之法则",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:36},desc:"暗影里没有法律——只有这条法则。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "牧师":{
  t1:[
   {id:"sk_priest_heal",cn:"治疗术",type:"恢复",scene:"恢复",tier:1,realm:1,cost:{res:"mp",n:10},desc:"掌心有光，光落处，血止了。",eff:{type:"heal",value:35}},
   {id:"sk_priest_word",cn:"圣言·净",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:10},desc:"一个字，说给不干净的东西听。",eff:{type:"bonus",value:2}},
   {id:"sk_priest_bless",cn:"祝福术",type:"主动",scene:"战斗",tier:1,realm:1,cost:{res:"mp",n:8},desc:"一层薄薄的光罩住你——心里先稳了。",eff:{type:"bonus",value:1}}],
  t2:[
   {id:"sk_priest_shield",cn:"神圣护盾",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:16},desc:"白光成盾，比铁硬，比棉柔。",eff:{type:"bonus",value:2,note:"防御"}},
   {id:"sk_priest_bane",cn:"驱魔之光",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"mp",n:16},desc:"光落下的地方，阴影尖叫着退开。",eff:{type:"bonus",value:3,note:"对深渊"}},
   {id:"sk_priest_faith",cn:"信仰坚定",type:"被动",scene:"修炼",tier:2,realm:2,cost:null,desc:"祈祷之后，噩梦会少一点。",eff:{type:"pct",value:0.03}}],
  t3:[
   {id:"sk_priest_judgment",cn:"圣裁",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:22},desc:"不是你在审判——是光在借你的手。",eff:{type:"reroll"}},
   {id:"sk_priest_revive",cn:"复活术",type:"恢复",scene:"恢复",tier:3,realm:3,cost:{res:"mp",n:40},desc:"把一口气吹回灯里——此术不能常用，但必须会。",eff:{type:"revive"}}],
  t3b:[
   {id:"sk_priest_light",cn:"圣临之光",type:"主动",scene:"战斗",tier:3,realm:3,cost:{res:"mp",n:18},desc:"光多到一定程度，就不只是照亮了。",eff:{type:"bonus",value:3}}],
  t4:[
   {id:"sk_priest_avatar",cn:"本源·圣临之光",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"mp",n:38},desc:"圣光临身的那一瞬，你听见钟声。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 },
 "商人":{
  t1:[
   {id:"sk_trade_bargain",cn:"精明议价",type:"主动",scene:"交易",tier:1,realm:1,cost:{res:"gold",n:5},desc:"先叹气，再摇头，最后才报你的价。",eff:{type:"bonus",value:2}},
   {id:"sk_trade_eye",cn:"金眼识货",type:"被动",scene:"交易",tier:1,realm:1,cost:null,desc:"东西值多少，你心里有一杆秤。",eff:{type:"bonus",value:2}},
   {id:"sk_trade_net",cn:"人脉网络",type:"主动",scene:"社交",tier:1,realm:1,cost:{res:"gold",n:8},desc:"你认识一个认识他的人——这条链子很长。",eff:{type:"bonus",value:2}}],
  t2:[
   {id:"sk_trade_guard",cn:"雇佣护卫",type:"主动",scene:"战斗",tier:2,realm:2,cost:{res:"gold",n:30},desc:"钱能买到剑，剑能买到平安。",eff:{type:"bonus",value:3}},
   {id:"sk_trade_invest",cn:"投资",type:"经济",scene:"经济",tier:2,realm:2,cost:{res:"gold",n:50},desc:"钱生钱，得先让钱出去走走。",eff:{type:"gold",value:70,note:"冷却7天"}},
   {id:"sk_trade_credit",cn:"商会信誉",type:"被动",scene:"社交",tier:2,realm:2,cost:null,desc:"你报的名字，账房愿意先赊。",eff:{type:"bonus",value:2}}],
  t3:[
   {id:"sk_trade_touch",cn:"点金术",type:"经济",scene:"经济",tier:3,realm:3,cost:{res:"gold",n:15},desc:"指尖过处，凡铁也带三分金气。",eff:{type:"gold",value:22,note:"冷却3天"}},
   {id:"sk_trade_talk",cn:"谈判专家",type:"主动",scene:"社交",tier:3,realm:3,cost:{res:"gold",n:10},desc:"话说到第七句，对方的底线自己走出来。",eff:{type:"reroll"}}],
  t4:[
   {id:"sk_trade_scale",cn:"本源·天平裁决",type:"主动",scene:"战斗",tier:4,realm:4,cost:{res:"gold",n:60},desc:"天平倾斜的方向，由钱袋决定。",eff:{type:"bonus",value:5,note:"多重判定"}}]
 }
};
const ARC_V55 = {
 "魔法师":{cn:"真理之焰",theme:"知识是否该有禁忌",doctrine:"求知者不问值不值",keyNpc:"洛·晨雾",
  s1:{title:"幕一·真理的学徒",entry:"图书馆的旧书架深处，一本无人借阅的册子，封皮上有你的姓氏。",firstNode:"arc_mage1"},
  s2:{title:"幕二·元素的低语",entry:"元素学院的大师让你去地下一层取一份卷宗——那间库房，十年没开过门。",firstNode:"arc_mage4"},
  s3:{title:"幕三·禁咒的回响",entry:"有人在你窗下留下一行烧焦的字：'别念那页。'",firstNode:"arc_mage7"},
  s4:{title:"幕四·失衡的季风",entry:"大陆西岸的风，一年没吹对方向了——长老们说，这是某本书的代价。",firstNode:"arc_mage10"},
  s5:{title:"幕五·大裂解之前",entry:"洛·晨雾约你在星落塔顶见面——他要谈的，不是塔的事。",firstNode:"arc_mage13"}},
 "灵魂法师":{cn:"魂灯不灭",theme:"灵魂是否该被度量",doctrine:"亡者的账，生者来记",keyNpc:"澜·梦墟",
  s1:{title:"幕一·无影的学徒",entry:"晨曦圣殿的灯架上，多了一盏没人点过的灯——灯座刻着你的名字。",firstNode:"arc_soul1"},
  s2:{title:"幕二·镜中的访客",entry:"守镜人澜·梦墟传话：'镜子里有位客人，说是来找你的。'",firstNode:"arc_soul4"},
  s3:{title:"幕三·魂秤之约",entry:"有人送来半截旧秤杆——灵魂法师之间，这等于一封战书。",firstNode:"arc_soul7"},
  s4:{title:"幕四·魂灯忽明",entry:"圣殿的魂灯连灭七盏，每盏下面都压着一张写着你名字的纸。",firstNode:"arc_soul10"},
  s5:{title:"幕五·灯前之问",entry:"奥雷利安·晨曦的残影，在灯影里等你——他要问最后一个问题。",firstNode:"arc_soul13"}},
 "术士":{cn:"熔炉之心",theme:"造物主的责任",doctrine:"造出来，就得负责",keyNpc:"格朗·符文",
  s1:{title:"幕一·学徒的锤",entry:"锻造公会分给你一柄旧锤——锤柄上有三道裂痕，像三句没说完的话。",firstNode:"arc_smith1"},
  s2:{title:"幕二·炉底的动静",entry:"公会的初火熔炉，夜里总传出不属于火焰的声响。",firstNode:"arc_smith4"},
  s3:{title:"幕三·造物的代价",entry:"一件你亲手造的东西，开始在你睡着后自己移动。",firstNode:"arc_smith7"},
  s4:{title:"幕四·炉火之灾",entry:"王座下的初火异动，格朗·符文让你带上那柄旧锤，下到炉底。",firstNode:"arc_smith10"},
  s5:{title:"幕五·封炉之前",entry:"格朗·符文说：'火还烧着，但烧的是谁的日子，该由你决定了。'",firstNode:"arc_smith13"}},
 "战士":{cn:"战旗不倒",theme:"力量为何而战",doctrine:"握刀的手，先要知道为谁而握",keyNpc:"秦·长风",
  s1:{title:"幕一·新兵的战旗",entry:"战神团的演武场边，插着一面褪色的旧旗——老兵说，它等一个新主人。",firstNode:"arc_war1"},
  s2:{title:"幕二·北境的信",entry:"一封没有署名的信从北境寄来，信纸上只有一枚血指印。",firstNode:"arc_war4"},
  s3:{title:"幕三·荣耀的价",entry:"有人出钱买你的一场败——输得漂亮，给得也漂亮。",firstNode:"arc_war7"},
  s4:{title:"幕四·旗在人在",entry:"铁门关的战报传到学院：秦·长风单人立于关前——而那面旗，缺了一角。",firstNode:"arc_war10"},
  s5:{title:"幕五·旗之问",entry:"秦·长风在关前等你——'你这一刀，为谁而握？'",firstNode:"arc_war13"}},
 "骑士":{cn:"誓约之重",theme:"誓约是否该被打破",doctrine:"一诺既出，万山无阻",keyNpc:"伊莎·圣辉",
  s1:{title:"幕一·白袍的誓",entry:"誓约骑士团的礼堂里，你跪下的那一刻，地板上的纹路亮了一瞬。",firstNode:"arc_knight1"},
  s2:{title:"幕二·誓约之裂",entry:"团里有一位骑士，在执行任务时违背了誓约——没人敢提他的名字。",firstNode:"arc_knight4"},
  s3:{title:"幕三·两难之誓",entry:"两条誓约同时压在你头上：救一个人，就要背弃另一个人。",firstNode:"arc_knight7"},
  s4:{title:"幕四·圣辉之暗",entry:"伊莎·圣辉的旧伤复发——有人说是诅咒，有人说是誓约的反噬。",firstNode:"arc_knight10"},
  s5:{title:"幕五·剑与誓",entry:"伊莎·圣辉把她的剑放在你面前：'守它，或者打破它——你选。'",firstNode:"arc_knight13"}},
 "游侠":{cn:"荒野之声",theme:"守护什么",doctrine:"森林先于王座存在",keyNpc:"贺·断弓",
  s1:{title:"幕一·断弓之约",entry:"巡守的营地里，挂着半张旧弓——贺·断弓年轻时留下的。",firstNode:"arc_ranger1"},
  s2:{title:"幕二·林中的火",entry:"森林边缘起了一场不该起的火——风向，是逆着林子的。",firstNode:"arc_ranger4"},
  s3:{title:"幕三·文明之问",entry:"修路的人求你让路，守林的人求你拦路——两边的理由都对。",firstNode:"arc_ranger7"},
  s4:{title:"幕四·荒原的呼号",entry:"银叶城闭门后，东境的野兽开始反常——贺·断弓的箭袋空了一半。",firstNode:"arc_ranger10"},
  s5:{title:"幕五·森林之声",entry:"贺·断弓在山口等你：'这片林子守的是谁，你知道吗？'",firstNode:"arc_ranger13"}},
 "盗贼":{cn:"暗影法则",theme:"偷窃与正义",doctrine:"影子不抢，只拿",keyNpc:"杜·夜枭",
  s1:{title:"幕一·夜枭的记号",entry:"暗影阁的入门考验，是在城门上画一个记号——那晚，你画了两次。",firstNode:"arc_thief1"},
  s2:{title:"幕二·无声厅来信",entry:"一封没有署名的信从无声厅寄来：'三年前的旧账，该清了。'",firstNode:"arc_thief4"},
  s3:{title:"幕三·偷与不偷",entry:"一件该偷的东西放在你面前——偷了，有人活；不偷，也有人活。",firstNode:"arc_thief7"},
  s4:{title:"幕四·影中裂痕",entry:"暗影阁内部出了叛徒，杜·夜枭的名单上，多了一个你想不到的名字。",firstNode:"arc_thief10"},
  s5:{title:"幕五·影之审判",entry:"杜·夜枭把一枚旧徽章推到你面前：'暗影的规矩，你来说。'",firstNode:"arc_thief13"}},
 "牧师":{cn:"圣光之问",theme:"神是否存在",doctrine:"信，是先于看见的",keyNpc:"克莱门·圣言",
  s1:{title:"幕一·静默的见习",entry:"圣辉教会的见习室里，有一本空白的圣典——每一任见习牧师都写过，又都撕掉了。",firstNode:"arc_priest1"},
  s2:{title:"幕二·使徒宫的钟",entry:"教皇沉眠后，使徒宫的钟不再报时——只有重大事件，钟才会响。",firstNode:"arc_priest4"},
  s3:{title:"幕三·圣光之暗",entry:"一次净化行动中，你看见圣光落错了地方——它没有问该不该。",firstNode:"arc_priest7"},
  s4:{title:"幕四·静默殿门",entry:"克莱门·圣言开了静默殿的门——他站在门后，等你问他一个问题。",firstNode:"arc_priest10"},
  s5:{title:"幕五·钟声之前",entry:"使徒宫的钟，在夜里响了一声——只有你知道它为什么响。",firstNode:"arc_priest13"}},
 "商人":{cn:"天平两端",theme:"一切是否可交易",doctrine:"万物有价，唯情难称",keyNpc:"文森·金秤",
  s1:{title:"幕一·学徒的秤",entry:"金衡商会分给你一杆旧秤——秤杆上刻着前任主人的名字，已经磨得看不清了。",firstNode:"arc_trade1"},
  s2:{title:"幕二·总账房的灯",entry:"总账房深夜亮灯，账本上有一页，被撕掉了——文森·金秤的手边。",firstNode:"arc_trade4"},
  s3:{title:"幕三·价与无价",entry:"有人要买一件不卖的东西——而你，手里恰好有价。",firstNode:"arc_trade7"},
  s4:{title:"幕四·金秤之危",entry:"银穗商路断了，金衡商会一夜之间成了众矢之的——账房先生们开始连夜对账。",firstNode:"arc_trade10"},
  s5:{title:"幕五·称心",entry:"文森·金秤把秤交到你手里：'这杆秤称过万物，唯独没称过人心——你来。'",firstNode:"arc_trade13"}}
};
window.v55_ensureDefaults = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.v54_ensureDefaults) v54_ensureDefaults();
    if(!S.skills) S.skills={};
    if(!S.arcV55) S.arcV55={};
    if(!S.skillLog) S.skillLog=[];
    var j = S.job||"";
    if(j && !S.arcV55[j]) S.arcV55[j]={stage:0,flags:{}};
    if(j && !S.skills[j]) S.skills[j]=[];
  }catch(e){}
};
window.v55_jobCn = function(){ try{ return (typeof S!=='undefined'&&S&&S.job)?S.job:""; }catch(e){ return ""; } };
window.v55_getSkill = function(id){
  try{
    var j=v55_jobCn(); var pool=SKILLS_V55[j]; if(!pool) return null;
    var all=[].concat(pool.t1||[],pool.t2||[],pool.t3||[],pool.t3b||[],pool.t4||[]);
    for(var i=0;i<all.length;i++){ if(all[i].id===id) return all[i]; }
    return null;
  }catch(e){ return null; }
};
window.v55_learned = function(id){
  try{ v55_ensureDefaults(); var j=v55_jobCn(); if(!j) return false; var arr=S.skills[j]||[]; for(var i=0;i<arr.length;i++){ if(arr[i]===id) return true; } return false; }catch(e){ return false; }
};
window.v55_learnAll = function(){
  try{
    v55_ensureDefaults(); var j=v55_jobCn(); if(!j) return;
    var pool=SKILLS_V55[j]; if(!pool) return;
    var rl=(S.realm||0); var added=0; var lockedNames=[];
    var all=[].concat(pool.t1||[],pool.t2||[],pool.t3||[],pool.t3b||[],pool.t4||[]);
    for(var i=0;i<all.length;i++){
      var s=all[i];
      if(rl>=s.realm && !v55_learned(s.id)){
        var locked=false;
        if(s.tier===4){ var rk=(window.v52_orgRank?v52_orgRank():0); var art=(S.artifact===j); if(!(rk>=2||art)) locked=true; }
        if(locked){ lockedNames.push(s.cn); continue; }
        S.skills[j].push(s.id);
        S.skillLog.push({id:s.id,at:rl,day:(S.day||0)});
        added++;
      }
    }
    if(added>0){ if(window.flashMsg) flashMsg('你悟出了新技法（'+added+' 门）'); if(window.v44_pushToast) try{v44_pushToast('新技法','你悟出了：'+added+' 门职业技法','success','⚔');}catch(e){} }
    if(lockedNames.length){ if(window.flashMsg) flashMsg('「'+lockedNames.join('」「')+'」尚蒙尘——你隐约觉得，这门技法还缺一把钥匙'); }
  }catch(e){}
};
window.v55_applyOne = function(s,out){
  try{
    var e=s.eff||{};
    if(e.type==="bonus"){ out.t+=e.value; out.labels.push("【技能】"+s.cn+(e.value>0?" +":" ")+e.value+(e.note?("·"+e.note):"")); }
    else if(e.type==="floor"){ if(out.t<e.value){ out.t=e.value; out.labels.push("【技能】"+s.cn+" · 保底"+(e.note?("·"+e.note):"")); } }
    else if(e.type==="pct"){ out.t=Math.round(out.t*(1+e.value)); out.labels.push("【技能】"+s.cn+" +"+Math.round(e.value*100)+"%"); }
    else if(e.type==="reroll"){ out.reroll=true; out.labels.push("【技能】"+s.cn+" · 可重掷"); }
    else if(e.type==="heal"){ out.labels.push("【技能】"+s.cn+" · 预备"); }
  }catch(e){}
  return out;
};
window.v55_skillApply = function(opt, t){
  var out={t:t,labels:[],reroll:false};
  try{
    if(typeof S==='undefined'||!S||!opt||!opt.check) return out;
    var sk=opt.check.sk||"", a=opt.check.a||"";
    var scene=(window.v52_sceneOf)?v52_sceneOf(sk,a):null;
    if(!scene) return out;
    v55_ensureDefaults(); var j=v55_jobCn(); if(!j) return out;
    var pool=SKILLS_V55[j]; if(!pool) return out;
    var all=[].concat(pool.t1||[],pool.t2||[],pool.t3||[],pool.t3b||[],pool.t4||[]);
    for(var i=0;i<all.length;i++){
      var s=all[i];
      if(!v55_learned(s.id)) continue;
      if(s.scene!==scene) continue;
      if(s.type==="被动"){ out=v55_applyOne(s,out); }
      else if(s.type==="主动"){
        if(S.skillPrep===s.id){ out=v55_applyOne(s,out); S.skillPrep=null; if(window.v55_castFX) try{v55_castFX(s);}catch(e){} }
      }
    }
    out.t=Math.max(5,Math.min(98,out.t));
    return out;
  }catch(e){ return {t:t,labels:[],reroll:false}; }
};
window.v55_castFX = function(s){
  try{
    if(window.v44_showFloatText) try{v44_showFloatText(document.getElementById('story'), s.cn, 'purple');}catch(e){}
    if(window.v34_playSfx) try{v34_playSfx('quest');}catch(e){}
  }catch(e){}
};
window.v55_prepSkill = function(id){
  try{
    if(typeof S==='undefined'||!S){ return; }
    v55_ensureDefaults(); var j=v55_jobCn();
    var s=v55_getSkill(id); if(!s){ if(window.flashMsg) flashMsg('未找到这门技法。'); return; }
    if(s.type!=="主动"){ if(window.flashMsg) flashMsg('「'+s.cn+'」无需运起。'); return; }
    if(!v55_learned(id)){ if(window.flashMsg) flashMsg('你尚未习得「'+s.cn+'」。'); return; }
    if(s.tier===4){ var rk=(window.v52_orgRank?v52_orgRank():0); var art=(S.artifact===j); if(!(rk>=2||art)){ if(window.flashMsg) flashMsg('你隐约觉得，这门技法还缺一把钥匙。'); return; } }
    var res=(s.cost&&s.cost.res)?s.cost.res:"mp"; var need=(s.cost&&s.cost.n)?s.cost.n:0;
    if(res==="mp"){ if((S.mp||0)<need){ if(window.flashMsg) flashMsg('气力不济——法力不足。'); return; } S.mp=(S.mp||0)-need; }
    else if(res==="gold"){ if((S.gold||0)<need){ if(window.flashMsg) flashMsg('囊中羞涩——金币不足。'); return; } S.gold=(S.gold||0)-need; }
    S.skillPrep=id;
    if(window.flashMsg) flashMsg('你已运起「'+s.cn+'」，等待出手时机');
    if(window.v34_playSfx) try{v34_playSfx('page');}catch(e){}
  }catch(e){}
};
window.v55_useRestore = function(id){
  try{
    if(typeof S==='undefined'||!S) return;
    v55_ensureDefaults(); var j=v55_jobCn();
    var s=v55_getSkill(id); if(!s) return;
    if(!v55_learned(id)){ if(window.flashMsg) flashMsg('尚未习得「'+s.cn+'」。'); return; }
    var e=s.eff||{};
    if(e.type==="heal"){ if((S.hp||0)>=S.maxHp){ if(window.flashMsg) flashMsg('你此刻气血充盈，无需「'+s.cn+'」。'); return; } S.hp=Math.min(S.maxHp,(S.hp||0)+e.value); if(window.flashMsg) flashMsg('「'+s.cn+'」— 恢复 '+e.value+' HP'); if(window.v34_playSfx) try{v34_playSfx('heal');}catch(e){} }
    else if(e.type==="revive"){ if((S.hp||0)>0){ if(window.flashMsg) flashMsg('你尚有余力，此术留待危时。'); return; } S.hp=Math.max(1,Math.floor((S.maxHp||100)*0.5)); if(window.flashMsg) flashMsg('「'+s.cn+'」— 一线生机，把你从死亡边缘拉了回来'); if(window.v34_playSfx) try{v34_playSfx('heal');}catch(e){} }
    else if(e.type==="gold"){ var cool=e.note?7:3; if(e.value>50) cool=7; var cd=(S.skillCd&&S.skillCd[id])||-999; var d=(S.day||0); if(d-cd<cool){ if(window.flashMsg) flashMsg('这门生意还差 '+((cool-(d-cd)))+' 天回本。'); return; } var cost=(s.cost&&s.cost.n)?s.cost.n:0; if((S.gold||0)<cost){ if(window.flashMsg) flashMsg('本金不够。'); return; } S.gold=(S.gold||0)-cost; S.gold=(S.gold||0)+e.value; if(!S.skillCd) S.skillCd={}; S.skillCd[id]=d; var gain=e.value-cost; if(window.flashMsg) flashMsg('「'+s.cn+'」— 进账 '+e.value+' 金（净 '+gain+'）'); if(window.v34_playSfx) try{v34_playSfx('coin');}catch(e){} }
  }catch(e){}
};
window.v55_skillBar = function(){
  try{
    var op=document.getElementById('options'); if(!op) return;
    if(typeof S==='undefined'||!S) return;
    v55_ensureDefaults(); var j=v55_jobCn(); if(!j) return;
    var pool=SKILLS_V55[j]; if(!pool) return;
    var scene=null;
    var nn=(typeof N!=="undefined"&&window.curNode&&N[curNode])?N[curNode]:null;
    if(nn&&nn.options){
      var os=typeof nn.options==="function"?nn.options():nn.options;
      for(var i=0;i<os.length;i++){ if(os[i]&&os[i].check){ var sc=(window.v52_sceneOf)?v52_sceneOf(os[i].check.sk,os[i].check.a):null; if(sc){ scene=sc; break; } } }
    }
    if(!scene) return;
    var all=[].concat(pool.t1||[],pool.t2||[],pool.t3||[],pool.t3b||[],pool.t4||[]);
    var usable=[];
    for(var k=0;k<all.length;k++){ var s=all[k]; if(s.type==="主动"&&v55_learned(s.id)&&s.scene===scene){ usable.push(s); } }
    if(!usable.length) return;
    var h='<div style="margin:10px 0 4px;padding:8px 10px;background:var(--bg-panel2);border:1px dashed var(--border);border-radius:8px;">';
    h+='<div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">✦ 技法可用（'+scene+'）：先运起一门，再出手</div>';
    for(var m=0;m<usable.length;m++){
      var sk=usable[m]; var prep=(S.skillPrep===sk.id);
      h+='<button class="btn btn-sm" style="margin:2px 6px 2px 0;'+(prep?'border-color:var(--text-gold);color:var(--text-gold);':'')+'" onclick="v55_prepSkill(\''+sk.id+'\')">'+(prep?'已运起·':'')+sk.cn+'<span style="font-size:11px;opacity:.75;margin-left:4px;">'+(sk.cost&&sk.cost.res==="gold"?'金':('MP'+((sk.cost&&sk.cost.n)?sk.cost.n:0)))+'</span></button>';
    }
    h+='</div>';
    var div=document.createElement('div'); div.innerHTML=h;
    op.appendChild(div.firstChild);
  }catch(e){}
};
window.v55_skillPanel = function(){
  try{
    v55_ensureDefaults();
    var st=document.getElementById('story'); var op=document.getElementById('options');
    if(!st||!op) return;
    if(window.clearOptions){ try{ clearOptions(); }catch(e){} }
    var j=v55_jobCn(); var pool=SKILLS_V55[j];
    var h='<div class="panel-header"><span class="panel-title">修行 · 职业技能</span><button class="panel-close" onclick="closePanel()">✕</button></div>';
    h+='<div style="margin:4px 0 8px;font-size:13px;color:var(--text-muted);">职业：'+j+'　境界：'+(S.realm||0)+'　已学：'+(S.skills[j]?S.skills[j].length:0)+' 门</div>';
    if(!pool){
      h+='<div style="margin:12px 0;padding:12px;background:var(--bg-panel2);border:1px dashed var(--border);border-radius:8px;color:var(--text-muted);font-size:13px;">该职业暂无技能数据。</div>';
      st.innerHTML=h; return;
    }
    var all=[].concat(pool.t1||[],pool.t2||[],pool.t3||[],pool.t3b||[],pool.t4||[]);
    var tiers=['t1','t2','t3','t3b','t4'];
    var tierCn={t1:'初阶 · 启灵',t2:'中阶 · 凝元',t3:'高阶 · 化意',t3b:'高阶 · 化意',t4:'本源 · 宗师'};
    for(var ti=0;ti<tiers.length;ti++){
      var grp=pool[tiers[ti]]||[];
      if(!grp.length) continue;
      h+='<div style="margin:10px 0 4px;font-size:14px;color:var(--text-secondary);">—— '+tierCn[tiers[ti]]+' ——</div>';
      for(var i=0;i<grp.length;i++){
        var s=grp[i];
        var learned=v55_learned(s.id);
        var locked=false;
        if(s.tier===4&&!learned){ var rk=(window.v52_orgRank?v52_orgRank():0); var art=(S.artifact===j); if(!(rk>=2||art)) locked=true; }
        var lockedNote=(s.tier===4&&!learned)?'<div style="font-size:11px;color:var(--text-muted);">尘封 · 组织 rank≥2 或 神器在手 可解</div>':'';
        var btns='';
        if(learned){
          if(s.type==="主动"){ btns='<button class="btn btn-sm" style="margin-top:6px;" onclick="v55_prepSkill(\''+s.id+'\')">'+(S.skillPrep===s.id?'已运起':'运起')+'</button>'; }
          else if(s.type==="恢复"||s.type==="经济"){ btns='<button class="btn btn-sm" style="margin-top:6px;" onclick="v55_useRestore(\''+s.id+'\')">使用</button>'; }
        }
        h+='<div style="margin:6px 0;padding:10px;background:var(--bg-panel2);border:1px solid var(--border);border-radius:8px;'+(learned?'':'opacity:.55;')+'">';
        h+='<div style="font-weight:bold;color:'+(learned?'var(--text-primary)':'var(--text-muted)')+';">'+s.cn+' <span style="font-size:11px;color:var(--text-muted);font-weight:normal;">('+s.type+(s.cost?(' · '+(s.cost.res==="gold"?'金'+s.cost.n:'MP'+s.cost.n)):' · 被动')+')</span></div>';
        h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">'+s.desc+'</div>';
        h+='<div style="font-size:11px;color:var(--text-gold);">效果：'+(s.eff&&s.eff.type==="bonus"?'+'+s.eff.value+' 判定':(s.eff&&s.eff.type==="floor"?'保底 '+s.eff.value:(s.eff&&s.eff.type==="pct"?'+'+Math.round((s.eff.value||0)*100)+'%':(s.eff&&s.eff.type==="reroll"?'可重掷取高':(s.eff&&s.eff.type==="heal"?'恢复 '+s.eff.value+' HP':(s.eff&&s.eff.type==="revive"?'濒死救回':(s.eff&&s.eff.type==="gold"?'经济收益':'——')))))))+(s.eff&&s.eff.note?('·'+s.eff.note):'')+'</div>';
        h+=lockedNote+btns;
        h+='</div>';
      }
    }
    h+='<div style="margin-top:12px;"><button class="btn" onclick="v51_featPanel()">← 返回修行总览</button></div>';
    st.innerHTML=h;
    try{ if(window.v44_pushToast){} }catch(e){}
  }catch(e){}
};
window.v55_arcEntry = function(){
  try{
    var op=document.getElementById('options'); if(!op) return;
    if(typeof S==='undefined'||!S) return;
    v55_ensureDefaults(); var j=v55_jobCn(); if(!j) return;
    var arc=ARC_V55[j]; if(!arc) return;
    if(!S.arcV55[j]) S.arcV55[j]={stage:0,flags:{}};
    var st=S.arcV55[j].stage||0;
    if(st>=5) return;
    var enter=null;
    if(st===0){ if((S.academyYear||0)>=1) enter=arc.s1; }
    else if(st===1){ if(((window.v52_orgRank?v52_orgRank():0))>=1&&(S.academyYear||0)>=2) enter=arc.s2; }
    else if(st===2){ if((S.realm||0)>=3) enter=arc.s3; }
    else if(st===3){ if((S.realm||0)>=4) enter=arc.s4; }
    else if(st===4){ if((S.realm||0)>=5) enter=arc.s5; }
    if(!enter||!enter.firstNode) return;
    if(S.arcV55[j].flags['in_'+st]) return;
    var b=document.createElement('button'); b.className='opt opt-gold';
    b.innerHTML='<span class="od">◆</span> <span style="font-size:13px;">命运的【'+arc.cn+' · '+enter.title+'】</span><div style="font-size:12px;color:var(--text-muted);margin-top:2px;">'+enter.entry+'</div>';
    b.onclick=function(){ try{ S.arcV55[j].stage=st+1; S.arcV55[j].flags['in_'+st]=true; }catch(e){} go(enter.firstNode); };
    op.appendChild(b);
  }catch(e){}
};
/* ===== /v55inj:skills ===== */
/* ===== v55inj:arcA 职业命运弧 A（魔法师/战士/牧师） ===== */
/* /v62inj:chunk-arc/ N["arc_mage1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_mage13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_war13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_priest13"] 已移入 chunks/v62_arc.js */
/* ===== /v55inj:arcA ===== */
/* ===== v55inj:arcB 职业命运弧 B（灵魂法师/术士/骑士） ===== */
/* /v62inj:chunk-arc/ N["arc_soul1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_soul13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_smith13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_knight13"] 已移入 chunks/v62_arc.js */
/* ===== /v55inj:arcB ===== */
/* ===== v55inj:arcC 职业命运弧 C（游侠/盗贼/商人） ===== */
/* /v62inj:chunk-arc/ N["arc_ranger1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_ranger13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_thief13"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade1"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade2"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade3"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade4"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade5"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade6"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade7"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade8"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade9"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade10"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade11"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade12"] 已移入 chunks/v62_arc.js */
/* /v62inj:chunk-arc/ N["arc_trade13"] 已移入 chunks/v62_arc.js */
/* ===== /v55inj:arcC ===== */

/* ---- 7. 强者互动 StrongKit ---- */
window.v53_ensureDefaults = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.v52_ensureDefaults) v52_ensureDefaults();
    if(!S.knownStrong) S.knownStrong={};
    if(!S.strongBond) S.strongBond={};
    if(!S.challenged) S.challenged={};
    if(S.demi===undefined) S.demi=0;
    if(!S.guardianLog) S.guardianLog=[];
    if(!S.theomachy) S.theomachy={};
    if(!S.willShift) S.willShift={};
  }catch(e){}
};
function v53_findStrong(id){
  try{
    var M=window.STRONG_V53||{};
    for(var job in M){
      var o=M[job];
      if(!o) continue;
      var lists=[o.legend,o.master,o.raceSp,o.abyss];
      for(var i=0;i<lists.length;i++){
        var L=lists[i]||[];
        for(var j=0;j<L.length;j++){
          if(L[j]&&L[j].id===id) return {job:job,row:L[j],kind:i};
        }
      }
      if(o.deity&&o.deity.id===id) return {job:job,row:o.deity,kind:'deity'};
      if(o.special&&o.special.length){ for(var k=0;k<o.special.length;k++){ if(o.special[k]&&o.special[k].id===id) return {job:job,row:o.special[k],kind:'special'}; } }
    }
    var R=(typeof RIVALS_V52!=="undefined")?RIVALS_V52:{};
    for(var jb in R){
      var rr=(R[jb]||{}).rivals||[];
      for(var x=0;x<rr.length;x++){ if(rr[x]&&rr[x].id===id) return {job:jb,row:rr[x],kind:'rival'}; }
    }
    return null;
  }catch(e){ return null; }
};
window.v53_willKind = function(id){
  try{
    v53_ensureDefaults();
    var W=window.WILL_TO_ASCEND_V53||{};
    var w=W[id]; if(!w) return "随缘";
    var sh=S.willShift&&S.willShift[id]?S.willShift[id]:0;
    var lv=Math.max(0,Math.min(100,w.lv+(w.baseShift||0)+sh));
    if(w.kind==="禁忌"){ return "禁忌"; }
    if(lv<=20) return "淡泊";
    if(lv<=50) return "随缘";
    if(lv<=80) return "渴望";
    return "执念";
  }catch(e){ return "随缘"; }
};
window.v53_willMod = function(id){
  try{
    v53_ensureDefaults();
    var W=window.WILL_TO_ASCEND_V53||{};
    var w=W[id]; if(!w) return 0;
    if(w.kind==="禁忌"){
      var trig=true;
      if(w.trigger){ try{ trig=!!w.trigger(); }catch(e){ trig=true; } }
      if(!trig) return -99;
      return 10;
    }
    var sh=S.willShift&&S.willShift[id]?S.willShift[id]:0;
    var lv=Math.max(0,Math.min(100,w.lv+sh));
    if(lv<=20) return -10;
    if(lv<=50) return 0;
    if(lv<=80) return 5;
    return 10;
  }catch(e){ return 0; }
};
window.v53_meetStrong = function(id){
  try{
    v53_ensureDefaults();
    var f=v53_findStrong(id); if(!f) return;
    if(!S.knownStrong) S.knownStrong={};
    if(!S.knownStrong[id]) S.knownStrong[id]=S.day||0;
    var r=f.row;
    writePar("","noind");
    writePar("━━ 邂逅 · "+(r.title?r.title+"·":"")+r.cn+" ━━","noind flagline");
    var lines=[];
    if(r.power) lines.push("他（她）是"+r.power+"。");
    if(r.desc) lines.push(r.desc);
    if(r.meet) lines.push(r.meet);
    writePar(lines.join(""),"narration");
    if(window.v53_unlockStrongReading) v53_unlockStrongReading(id);
  }catch(e){}
};
window.v53_guardian = function(){
  try{
    v53_ensureDefaults();
    if(!window.openModal||!window.elFromHtml) return;
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>护法 · 请强者护持</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:60vh;overflow:auto'>";
    var got=false;
    for(var job in (window.STRONG_V53||{})){
      var o=STRONG_V53[job]; if(!o) continue;
      var L=(o.master||[]).concat(o.legend||[]);
      for(var i=0;i<L.length;i++){
        var r=L[i];
        var bond=S.strongBond&&S.strongBond[r.id]?S.strongBond[r.id]:0;
        if(bond<1) continue;
        got=true;
        var bonus=10+Math.min(15,Math.floor(bond/2))+(r.realm===6?5:0);
        h+="<div class='achievement-card' style='margin-bottom:8px'><div class='achievement-name'>"+(r.title?r.title+"·":"")+r.cn+"</div>";
        h+="<div style='font-size:12px;color:var(--dim)'>"+(r.power||job)+" · 亲密度 "+bond+" · 可加成 +"+bonus+"</div>";
        h+="<button class='opt' style='margin-top:6px' onclick='v53_pickGuardian(\""+r.id+"\","+bonus+")'>请其护法</button></div>";
      }
    }
    if(!got) h+="<div style='color:var(--dim);font-size:13px'>你还没有足够亲近的强者。先去交好一位大宗师或传奇，他们才会为你护法。</div>";
    h+="</div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};
window.v53_pickGuardian = function(id,bonus){
  try{
    v53_ensureDefaults();
    var f=v53_findStrong(id);
    if(!f) return;
    if(!S.guardianLog) S.guardianLog=[];
    S.guardianActive={id:id,cn:(f.row.title?f.row.title+"·":"")+f.row.cn,bonus:bonus,day:S.day||0};
    S.guardianLog.push({id:id,day:S.day||0,bonus:bonus});
    if(S.guardianLog.length>20) S.guardianLog.shift();
    if(window.v44_pushToast) v44_pushToast('护法已定',S.guardianActive.cn+'将在你破境时护持','success','🛡️');
    if(window.closePanel) closePanel();
  }catch(e){}
};
window.v53_guardianBonus = function(){
  try{
    if(typeof S==='undefined'||!S||!S.guardianActive) return 0;
    if(S.guardianActive.day&&S.day&&S.day-S.guardianActive.day>30){ S.guardianActive=null; return 0; }
    return S.guardianActive.bonus||0;
  }catch(e){ return 0; }
};
window.v53_bondGift = function(id){
  try{
    v53_ensureDefaults();
    var f=v53_findStrong(id); if(!f) return;
    var cost=150;
    if((S.coin||0)<cost){ if(window.v44_pushToast) v44_pushToast('囊中羞涩','交好需要 150 金币','warn','💰'); return; }
    S.coin-=cost;
    if(!S.strongBond) S.strongBond={};
    S.strongBond[id]=(S.strongBond[id]||0)+1;
    if(window.v44_pushToast) v44_pushToast('交好','你与'+(f.row.cn)+'的交情又深了一层','success','🤝');
    var w=window.WILL_TO_ASCEND_V53||{};
    if(w[id]&&w[id].kind!=="禁忌"){
      if(!S.willShift) S.willShift={};
      S.willShift[id]=(S.willShift[id]||0)-8;
      if(window.v53_willKind(id)==="淡泊"){ if(window.v44_pushToast) v44_pushToast('心念微动',f.row.cn+'对神座的执念淡了一些','info','🍃'); }
    }
  }catch(e){}
};
window.v53_challengeStrong = function(id){
  try{
    v53_ensureDefaults();
    var f=v53_findStrong(id); if(!f) return;
    var r=f.row;
    if(!S.challenged) S.challenged={};
    var st=document.getElementById('story');
    if(!st) return;
    var main=(S.attrs&&S.attrs.STR)?S.attrs.STR:50;
    var t1=30+Math.floor(main/5)+((r.realm||5)-5)*8;
    t1+=window.v53_willMod?v53_willMod(id):0;
    t1=Math.max(8,Math.min(92,t1));
    var rr=rollD100();
    writePar("","noind");
    writePar("━━ 挑战 · "+(r.title?r.title+"·":"")+r.cn+" ━━","noind flagline");
    if(rr<=t1){
      S.challenged[id]="won";
      writePar("你赢了。"+(r.defeatLine||"他（她）收手时看了你很久，像是要把你的样子记下来。"),"narration");
      writePar("【判定】目标 "+t1+"，掷出 "+rr+" → 胜","hint");
      if(!S.knownStrong) S.knownStrong={};
      S.knownStrong[id]=S.day||0;
      if(window.v44_pushToast) v44_pushToast('一战成名',(r.title?r.title+"·":"")+r.cn+'记住了你','success','⚔️');
      if(window.v53_willKind(id)==="执念"){ if(window.v44_pushToast) v44_pushToast('结下因果','你击败了一位执念者。他（她）不会忘记这一天。','warn','🌑'); }
    } else {
      S.challenged[id]="lost";
      writePar("你败了。"+(r.loseText||"他（她）没有伤你，只是摇摇头。"),"narration");
      writePar("【判定】目标 "+t1+"，掷出 "+rr+" → 未过","roll-fail");
      S.san=Math.max(0,(S.san||100)-3);
    }
  }catch(e){}
};
window.v53_witnessFall = function(id){
  try{
    v53_ensureDefaults();
    var f=v53_findStrong(id); if(!f) return;
    if(!S.knownStrong) S.knownStrong={};
    S.knownStrong[id]=S.day||0;
    S.godRival[id]="fallen";
    if(!S.willShift) S.willShift={};
    var w=window.WILL_TO_ASCEND_V53||{};
    if(w[id]&&w[id].kind!=="禁忌") S.willShift[id]=(S.willShift[id]||0)-30;
    if(window.v44_pushToast) v44_pushToast('见证陨落','你亲眼看见'+(f.row.cn)+'倒下了。那条路，少了一个人。','info','🕯️');
  }catch(e){}
};
/* ---- 8. 成神三要素主流程 ---- */
window.v53_theomachy = function(){
  try{
    v53_ensureDefaults();
    if(!window.openModal||!window.elFromHtml) return;
    var job=S.job||"";
    var T=(window.THEOMACHY_V53||{})[job];
    if(!T){ if(window.v44_pushToast) v44_pushToast('尚不明朗','你的职业尚无成神之法的记载','info','📜'); return; }
    var st=T.step||0;
    var hasRelic=S.artifact===job;
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>登神 · 三要素</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:64vh;overflow:auto'>";
    h+="<div style='font-family:Georgia,serif;font-size:16px;font-weight:bold;color:var(--text-gold2);margin-bottom:8px'>"+job+" · 成神三要素</div>";
    h+="<div style='font-size:13px;color:var(--dim);margin-bottom:10px'>① 本职业唯一神性物品　② 专属成神仪式　③ 领悟职业真谛。三样缺一不可。</div>";
    h+="<div class='achievement-card'><div class='achievement-name'>① 神性物品 · "+(T.relic||"未知")+"</div>";
    h+="<div style='font-size:12px;color:var(--dim)'>"+(hasRelic?"你已持有本职业神器，它的神性形态在你手中苏醒。":"尚未持有。可循组织首席线索或大陆传闻寻找本职业神器的下落。")+"</div></div>";
    h+="<div class='achievement-card'><div class='achievement-name'>② 成神仪式</div>";
    h+="<div style='font-size:12px;color:var(--dim)'>地点："+(T.place||"未知")+"<br/>时间："+(T.time||"未知")+"<br/>条件："+(T.cond||"未知")+"</div></div>";
    h+="<div class='achievement-card'><div class='achievement-name'>③ 领悟职业真谛</div>";
    h+="<div style='font-size:12px;color:var(--dim)'>仪式终末，你要直面自己的道。已悟者写下的感悟是："+(T.truth||"无人留下文字")+"</div></div>";
    h+="<div style='margin-top:10px'>";
    if(S.realm>=6&&hasRelic&&S.godTrial&&S.godTrial[job]==="deified"){
      h+="<button class='opt opt-gold' onclick='v53_runTheomachy()'>开始登神仪式</button>";
    } else if(S.realm>=6&&hasRelic){
      h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>你已具登神之资，但还需通过神座试炼的资格认定（组织首席或击败在位半神）。</div>";
    } else if(S.realm>=6){
      h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>神器尚未到手——它认得你，你要去找它。</div>";
    } else {
      h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>登神需传奇境（境界≥6）方可叩门。你现在的路，还长。</div>";
    }
    h+="</div></div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};
window.v53_runTheomachy = function(){
  try{
    v53_ensureDefaults();
    var job=S.job||"";
    var T=(window.THEOMACHY_V53||{})[job];
    if(!T) return;
    if(!S.theomachy) S.theomachy={};
    var step=S.theomachy.step||0;
    if(step===0){
      S.theomachy.step=1;
      writePar("","noind");
      writePar("━━ 登神 · 第一程 · 神器觉醒 ━━","noind flagline");
      var s1=(T.relicStory||[])[0]||"你握着本职业的神器，感觉到它在发烫。";
      writePar(s1,"narration");
      writePar("它认得你。你握着"+T.relic+"，像握着一段失传了很久的记忆。","narration");
      return;
    }
    if(step===1){
      S.theomachy.step=2;
      writePar("","noind");
      writePar("━━ 登神 · 第二程 · 成神仪式 ━━","noind flagline");
      var s2=(T.relicStory||[])[1]||"仪式在"+T.place+"举行。";
      writePar(s2,"narration");
      writePar("地点在"+T.place+"，时间是"+T.time+"。"+T.cond+"。","narration");
      writePar("你抵达时，天地静得只剩心跳。仪式开始了。","narration");
      var rolls=[
        {cn:"意志 · 撑过仪式的反噬",t:60+Math.floor((S.attrs&&S.attrs.SPR||50)/8)},
        {cn:"技艺 · 让仪式记住你的手法",t:62+Math.floor((S.attrs&&S.attrs.INT||50)/8)}
      ];
      var pass=true;
      for(var i=0;i<rolls.length;i++){
        var r1=rollD100(); var ok1=r1<=Math.max(10,Math.min(95,rolls[i].t));
        if(window.v44_diceFX) v44_diceFX(r1,rolls[i].t,ok1,rolls[i].cn);
        if(!ok1) pass=false;
      }
      if(pass){ writePar("仪式顺利完成。天边出现了异象——这一方的世界，记住了你的名字。","narration"); }
      else { writePar("仪式中途出了岔子，你强撑到结束。世界记住了你，也记住了你的狼狈。好在，仪式成了。","narration"); }
      return;
    }
    if(step>=2){
      if(S.deified){ writePar("你已登神。神座之上，只此一座。","narration"); return; }
      S.deified=1;
      S.theomachy[job]="done";
      S.theomachy.step=3;
      writePar("","noind");
      writePar("━━ 登神 · 第三程 · 领悟职业真谛 ━━","noind flagline");
      writePar(T.truth||"","narration");
      writePar("你合上眼。再睁开时，尘世的名字已从你身上褪去——写进了那唯一的座次里。","narration");
      if(window.v44_breakthroughFX) v44_breakthroughFX();
      if(window.v44_pushToast) v44_pushToast('登神','你成了本职业唯一的真神。此世此途，只此一座。','success','👑');
      if(S.endingFlags) S.endingFlags.deified=1;
      if(window.v53_syncDeity) v53_syncDeity();
    }
  }catch(e){}
};
/* ---- 9. 传闻池钩子 ---- */
window.STRONG_RUMOR_V53 = [];

/*v53inj:genfunc*/
window.v53_genName = function(race, job, gender, org){
  try{
    var G=window.NAME_GEN_V53||{}; if(!G[race]) return "无名";
    var used=G.used||{}; used[race]=used[race]||{};
    var pick=function(arr){ if(!arr||!arr.length) return ""; return arr[Math.floor(Math.random()*arr.length)]; };
    var nm="";
    if(race==="human"){
      var sur=pick(G.human.surname);
      var gv=(gender==="女")?pick(G.human.given_f):pick(G.human.given_m);
      nm=sur+"·"+gv;
    }else if(race==="elf"){
      nm=pick(G.elf.pre)+pick(G.elf.root);
    }else if(race==="dwarf"){
      nm=pick(G.dwarf.pre)+pick(G.dwarf.root);
    }else if(race==="orc"){
      nm=pick(G.orc.pre)+pick(G.orc.root);
    }else if(race==="halfling"){
      nm=pick(G.halfling.pre)+pick(G.halfling.root);
    }else if(race==="dragon"){
      nm=pick(G.dragon.pre)+pick(G.dragon.root);
    }else if(race==="mixed"){
      nm=pick(G.mixed.pre)+pick(G.mixed.root);
    }else{ nm="无名"; }
    if(used[race][nm]){ return v53_genName(race, job, gender, org); }
    used[race][nm]=1; G.used=used;
    return nm;
  }catch(e){ return "无名"; }
};
window.v53_genTitle = function(job, trait){
  try{
    var G=window.NAME_GEN_V53||{}; var tp=(G.title_pool||{})[job]||["旧"];
    if(!tp.length) return "";
    var t=pick; function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
    return pick(tp)+(trait?trait:"");
  }catch(e){ return ""; }
};
/*v53inj:genfunc_end*/


/*v53inj:master*/
STRONG_V53["魔法师"].master = [
 {"id":"m_魔法师1","cn":"贺·尔","title":"镜","race":"human","org":"元素学院·院长团","realm":5,"power":"「贺·尔」是元素学院·院长团的结界高手，大宗师境。","story":"他年轻时在魔网节点待了整整十年，把结界练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在魔网节点等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":33,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_魔法师2","cn":"秦·承","title":"雷","race":"human","org":"自由法师塔·议长","realm":5,"power":"「秦·承」是自由法师塔·议长的预言高手，大宗师境。","story":"他年轻时在元素学院的高塔待了整整十年，把预言练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在元素学院的高塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":77,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_魔法师3","cn":"青叶","title":"雾","race":"elf","org":"守望者·观测长","realm":5,"power":"「青叶」是守望者·观测长的塑能高手，大宗师境。","story":"他年轻时在魔网节点待了整整十年，把塑能练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在魔网节点等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":55,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_魔法师4","cn":"晨歌","title":"霜","race":"elf","org":"南方港城·灯塔主","realm":5,"power":"「晨歌」是南方港城·灯塔主的预言高手，大宗师境。","story":"他年轻时在星落塔待了整整十年，把预言练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在星落塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":56,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_魔法师5","cn":"萧·莉","title":"雾","race":"human","org":"星落塔·管理员","realm":5,"power":"「萧·莉」是星落塔·管理员的结界高手，大宗师境。","story":"他年轻时在星落塔待了整整十年，把结界练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在星落塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":5,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_魔法师6","cn":"艾·达","title":"焰","race":"human","org":"银叶城·客卿","realm":5,"power":"「艾·达」是银叶城·客卿的塑能高手，大宗师境。","story":"他年轻时在元素学院的高塔待了整整十年，把塑能练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在元素学院的高塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":12,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_魔法师7","cn":"白·德","title":"雾","race":"human","org":"铁峰堡·符文顾问","realm":5,"power":"「白·德」是铁峰堡·符文顾问的预言高手，大宗师境。","story":"他年轻时在禁书区深处待了整整十年，把预言练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在禁书区深处等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":55,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_魔法师8","cn":"露语","title":"语","race":"elf","org":"交汇城·魔导师","realm":5,"power":"「露语」是交汇城·魔导师的预言高手，大宗师境。","story":"他年轻时在星落塔待了整整十年，把预言练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在星落塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":12,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_魔法师9","cn":"秦·黛","title":"书","race":"human","org":"圣城·异端审查顾问","realm":5,"power":"「秦·黛」是圣城·异端审查顾问的观星高手，大宗师境。","story":"他年轻时在魔网节点待了整整十年，把观星练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在魔网节点等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":36,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_魔法师10","cn":"卡·黛","title":"书","race":"human","org":"北地·雪塔主","realm":5,"power":"「卡·黛」是北地·雪塔主的静默高手，大宗师境。","story":"他年轻时在元素学院的高塔待了整整十年，把静默练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在元素学院的高塔等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":63,"why":"他这辈子就剩这一件事了。"}}
];
STRONG_V53["战士"].master = [
 {"id":"m_战士1","cn":"矿德","title":"赤","race":"dwarf","org":"战神团·教头","realm":5,"power":"「矿德」是战神团·教头的孤胆高手，大宗师境。","story":"他年轻时在铁门关待了整整十年，把孤胆练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在铁门关等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":64,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_战士2","cn":"洛·承","title":"峰","race":"human","org":"铁门关·统领","realm":5,"power":"「洛·承」是铁门关·统领的破阵高手，大宗师境。","story":"他年轻时在铁门关待了整整十年，把破阵练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在铁门关等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":10,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士3","cn":"凯·森","title":"江","race":"human","org":"北方公国·军团长","realm":5,"power":"「凯·森」是北方公国·军团长的武技高手，大宗师境。","story":"他年轻时在边境堡垒待了整整十年，把武技练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在边境堡垒等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":16,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士4","cn":"杜·克","title":"赤","race":"human","org":"古战场·守墓人","realm":5,"power":"「杜·克」是古战场·守墓人的孤胆高手，大宗师境。","story":"他年轻时在战神团演武场待了整整十年，把孤胆练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在战神团演武场等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":7,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士5","cn":"白·兰","title":"荒","race":"human","org":"南方港城·护卫长","realm":5,"power":"「白·兰」是南方港城·护卫长的血战高手，大宗师境。","story":"他年轻时在边境堡垒待了整整十年，把血战练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在边境堡垒等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":16,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士6","cn":"康·茉","title":"荒","race":"human","org":"兽人王庭·客将","realm":5,"power":"「康·茉」是兽人王庭·客将的军略高手，大宗师境。","story":"他年轻时在古战场待了整整十年，把军略练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在古战场等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":18,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士7","cn":"凯·恩","title":"戈","race":"human","org":"交汇城·角斗场主","realm":5,"power":"「凯·恩」是交汇城·角斗场主的力劈高手，大宗师境。","story":"他年轻时在古战场待了整整十年，把力劈练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在古战场等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":17,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士8","cn":"沈·达","title":"戈","race":"human","org":"矮人王国·亲卫","realm":5,"power":"「沈·达」是矮人王国·亲卫的孤胆高手，大宗师境。","story":"他年轻时在古战场待了整整十年，把孤胆练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在古战场等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":27,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_战士9","cn":"朗·莉","title":"孤","race":"human","org":"东部王国·禁卫统领","realm":5,"power":"「朗·莉」是东部王国·禁卫统领的力劈高手，大宗师境。","story":"他年轻时在北方军营待了整整十年，把力劈练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在北方军营等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":8,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_战士10","cn":"萧·承","title":"江","race":"human","org":"荒野·独行佣兵","realm":5,"power":"「萧·承」是荒野·独行佣兵的破阵高手，大宗师境。","story":"他年轻时在边境堡垒待了整整十年，把破阵练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在边境堡垒等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":6,"why":"他见过传奇的代价，不羡慕。"}}
];
STRONG_V53["商人"].master = [
 {"id":"m_商人1","cn":"凯·兰","title":"秤","race":"human","org":"金衡商会·首席账房","realm":5,"power":"「凯·兰」是金衡商会·首席账房的信用高手，大宗师境。","story":"他年轻时在港口货栈待了整整十年，把信用练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在港口货栈等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":70,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人2","cn":"姜姆","title":"账","race":"halfling","org":"南方港城·船东","realm":5,"power":"「姜姆」是南方港城·船东的市价高手，大宗师境。","story":"他年轻时在港口货栈待了整整十年，把市价练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在港口货栈等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":7,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_商人3","cn":"灰·珊","title":"金","race":"human","org":"交汇城·市集行首","realm":5,"power":"「灰·珊」是交汇城·市集行首的契约高手，大宗师境。","story":"他年轻时在金衡商会账房待了整整十年，把契约练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在金衡商会账房等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":58,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人4","cn":"费·森","title":"舵","race":"human","org":"商路·驼队头领","realm":5,"power":"「费·森」是商路·驼队头领的市价高手，大宗师境。","story":"他年轻时在港口货栈待了整整十年，把市价练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在港口货栈等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":65,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人5","cn":"豆温","title":"舵","race":"halfling","org":"银穗商路·押运官","realm":5,"power":"「豆温」是银穗商路·押运官的市价高手，大宗师境。","story":"他年轻时在交汇城商会待了整整十年，把市价练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在交汇城商会等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":76,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人6","cn":"朗·德","title":"栈","race":"human","org":"圣城·教廷采买","realm":5,"power":"「朗·德」是圣城·教廷采买的信用高手，大宗师境。","story":"他年轻时在交汇城商会待了整整十年，把信用练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在交汇城商会等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":73,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人7","cn":"杜·汐","title":"契","race":"human","org":"矮人王国·贸易代表","realm":5,"power":"「杜·汐」是矮人王国·贸易代表的信用高手，大宗师境。","story":"他年轻时在港口货栈待了整整十年，把信用练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在港口货栈等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":77,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_商人8","cn":"卡·尔","title":"栈","race":"human","org":"东部王国·皇商","realm":5,"power":"「卡·尔」是东部王国·皇商的货栈高手，大宗师境。","story":"他年轻时在港口货栈待了整整十年，把货栈练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在港口货栈等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":5,"why":"他见过传奇的代价，不羡慕。"}}
];
STRONG_V53["牧师"].master = [
 {"id":"m_牧师1","cn":"灰·琳","title":"圣","race":"human","org":"圣辉教会·主教","realm":5,"power":"「灰·琳」是圣辉教会·主教的慈悲高手，大宗师境。","story":"他年轻时在各地圣所待了整整十年，把慈悲练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在各地圣所等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":12,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_牧师2","cn":"朗·尔","title":"辉","race":"human","org":"静默殿·守夜人","realm":5,"power":"「朗·尔」是静默殿·守夜人的慈悲高手，大宗师境。","story":"他年轻时在圣城大教堂待了整整十年，把慈悲练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在圣城大教堂等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":44,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_牧师3","cn":"银光","title":"晨","race":"elf","org":"晨曦圣殿·诵经长","realm":5,"power":"「银光」是晨曦圣殿·诵经长的律令高手，大宗师境。","story":"他年轻时在朝圣之路待了整整十年，把律令练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在朝圣之路等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":15,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_牧师4","cn":"贺·娜","title":"光","race":"human","org":"圣城·医馆主祭","realm":5,"power":"「贺·娜」是圣城·医馆主祭的审判高手，大宗师境。","story":"他年轻时在晨曦圣殿待了整整十年，把审判练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在晨曦圣殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":33,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_牧师5","cn":"贺·达","title":"白","race":"human","org":"北地·雪原修士","realm":5,"power":"「贺·达」是北地·雪原修士的守夜高手，大宗师境。","story":"他年轻时在晨曦圣殿待了整整十年，把守夜练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在晨曦圣殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":70,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_牧师6","cn":"林影","title":"圣","race":"elf","org":"南方港城·海神祭司","realm":5,"power":"「林影」是南方港城·海神祭司的医者高手，大宗师境。","story":"他年轻时在各地圣所待了整整十年，把医者练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在各地圣所等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":17,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_牧师7","cn":"林叶","title":"白","race":"elf","org":"银叶城·圣树祭司","realm":5,"power":"「林叶」是银叶城·圣树祭司的慈悲高手，大宗师境。","story":"他年轻时在晨曦圣殿待了整整十年，把慈悲练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在晨曦圣殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":12,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_牧师8","cn":"凯·德","title":"白","race":"human","org":"交汇城·贫民救济司","realm":5,"power":"「凯·德」是交汇城·贫民救济司的医者高手，大宗师境。","story":"他年轻时在晨曦圣殿待了整整十年，把医者练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在晨曦圣殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":74,"why":"他这辈子就剩这一件事了。"}}
];
STRONG_V53["盗贼"].master = [
 {"id":"m_盗贼1","cn":"乌·黛","title":"钩","race":"human","org":"暗影阁·影首","realm":5,"power":"「乌·黛」是暗影阁·影首的情报高手，大宗师境。","story":"他年轻时在交汇城下水道待了整整十年，把情报练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在交汇城下水道等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":32,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_盗贼2","cn":"费·方","title":"钩","race":"human","org":"黑市·标主","realm":5,"power":"「费·方」是黑市·标主的开锁高手，大宗师境。","story":"他年轻时在酒馆暗巷待了整整十年，把开锁练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在酒馆暗巷等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":5,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_盗贼3","cn":"罗·德","title":"夜","race":"human","org":"交汇城·地头蛇","realm":5,"power":"「罗·德」是交汇城·地头蛇的夜行高手，大宗师境。","story":"他年轻时在黑市待了整整十年，把夜行练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在黑市等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":39,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_盗贼4","cn":"康·达","title":"影","race":"human","org":"南方港城·走私头目","realm":5,"power":"「康·达」是南方港城·走私头目的暗杀高手，大宗师境。","story":"他年轻时在暗影阁待了整整十年，把暗杀练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在暗影阁等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":27,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_盗贼5","cn":"卡·森","title":"鼠","race":"human","org":"旧城废墟·盗墓王","realm":5,"power":"「卡·森」是旧城废墟·盗墓王的开锁高手，大宗师境。","story":"他年轻时在旧城废墟待了整整十年，把开锁练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在旧城废墟等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":56,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_盗贼6","cn":"卡·娜","title":"尘","race":"human","org":"东部王国·密探头领","realm":5,"power":"「卡·娜」是东部王国·密探头领的情报高手，大宗师境。","story":"他年轻时在暗影阁待了整整十年，把情报练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在暗影阁等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":41,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_盗贼7","cn":"杜·娅","title":"枭","race":"human","org":"酒馆·情报贩子","realm":5,"power":"「杜·娅」是酒馆·情报贩子的夜行高手，大宗师境。","story":"他年轻时在交汇城下水道待了整整十年，把夜行练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在交汇城下水道等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":31,"why":"大宗师的日子够长了，他不想再往上看。"}}
];
STRONG_V53["游侠"].master = [
 {"id":"m_游侠1","cn":"雷·兰","title":"矢","race":"human","org":"荒野巡守·长老","realm":5,"power":"「雷·兰」是荒野巡守·长老的陷阱高手，大宗师境。","story":"他年轻时在银叶城边境待了整整十年，把陷阱练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在银叶城边境等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":18,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_游侠2","cn":"罗·娜","title":"路","race":"human","org":"银叶城·林卫","realm":5,"power":"「罗·娜」是银叶城·林卫的猎杀高手，大宗师境。","story":"他年轻时在荒野林道待了整整十年，把猎杀练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在荒野林道等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":57,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_游侠3","cn":"萧·达","title":"林","race":"human","org":"北地·雪原猎手","realm":5,"power":"「萧·达」是北地·雪原猎手的箭术高手，大宗师境。","story":"他年轻时在世界树外围待了整整十年，把箭术练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在世界树外围等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":36,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_游侠4","cn":"霜辉","title":"逐","race":"elf","org":"草原·追风者","realm":5,"power":"「霜辉」是草原·追风者的探路高手，大宗师境。","story":"他年轻时在北地雪林待了整整十年，把探路练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在北地雪林等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":11,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_游侠5","cn":"晨岚","title":"矢","race":"elf","org":"南方·沼泽向导","realm":5,"power":"「晨岚」是南方·沼泽向导的陷阱高手，大宗师境。","story":"他年轻时在北地雪林待了整整十年，把陷阱练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在北地雪林等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":72,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_游侠6","cn":"杜·珊","title":"路","race":"human","org":"东部·古林守林人","realm":5,"power":"「杜·珊」是东部·古林守林人的骑射高手，大宗师境。","story":"他年轻时在北地雪林待了整整十年，把骑射练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在北地雪林等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":10,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_游侠7","cn":"洛·琳","title":"双","race":"human","org":"交汇城·赏金猎头","realm":5,"power":"「洛·琳」是交汇城·赏金猎头的猎杀高手，大宗师境。","story":"他年轻时在草原边缘待了整整十年，把猎杀练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在草原边缘等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":39,"why":"大宗师的日子够长了，他不想再往上看。"}}
];
STRONG_V53["骑士"].master = [
 {"id":"m_骑士1","cn":"沈·克","title":"辉","race":"human","org":"誓约骑士团·团长","realm":5,"power":"「沈·克」是誓约骑士团·团长的不屈高手，大宗师境。","story":"他年轻时在公爵领待了整整十年，把不屈练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在公爵领等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":36,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_骑士2","cn":"费·恩","title":"金","race":"human","org":"圣城·圣骑士长","realm":5,"power":"「费·恩」是圣城·圣骑士长的冲锋高手，大宗师境。","story":"他年轻时在公爵领待了整整十年，把冲锋练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在公爵领等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":14,"why":"他见过传奇的代价，不羡慕。"}},
 {"id":"m_骑士3","cn":"艾·德","title":"骑","race":"human","org":"东部王国·王旗骑士","realm":5,"power":"「艾·德」是东部王国·王旗骑士的守护高手，大宗师境。","story":"他年轻时在王国边境待了整整十年，把守护练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在王国边境等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":67,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_骑士4","cn":"杜·森","title":"守","race":"human","org":"铁门关·守关骑士","realm":5,"power":"「杜·森」是铁门关·守关骑士的重甲高手，大宗师境。","story":"他年轻时在圣城骑士殿待了整整十年，把重甲练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在圣城骑士殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":63,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_骑士5","cn":"罗·薇","title":"辉","race":"human","org":"北方公国·公爵亲卫","realm":5,"power":"「罗·薇」是北方公国·公爵亲卫的重甲高手，大宗师境。","story":"他年轻时在公爵领待了整整十年，把重甲练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在公爵领等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":48,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_骑士6","cn":"林·达","title":"誓","race":"human","org":"银叶城·荣誉骑士","realm":5,"power":"「林·达」是银叶城·荣誉骑士的骑阵高手，大宗师境。","story":"他年轻时在圣城骑士殿待了整整十年，把骑阵练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在圣城骑士殿等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"淡泊","lv":10,"why":"他见过传奇的代价，不羡慕。"}}
];
STRONG_V53["术士"].master = [
 {"id":"m_术士1","cn":"叶·方","title":"锻","race":"human","org":"锻造公会·会长","realm":5,"power":"「叶·方」是锻造公会·会长的材料高手，大宗师境。","story":"他年轻时在地下熔洞待了整整十年，把材料练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在地下熔洞等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":47,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_术士2","cn":"砧德","title":"铸","race":"dwarf","org":"铁峰堡·符文工匠","realm":5,"power":"「砧德」是铁峰堡·符文工匠的火焰高手，大宗师境。","story":"他年轻时在铁峰堡锻造区待了整整十年，把火焰练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在铁峰堡锻造区等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":28,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_术士3","cn":"火克","title":"焰","race":"dwarf","org":"初火熔炉·看守","realm":5,"power":"「火克」是初火熔炉·看守的材料高手，大宗师境。","story":"他年轻时在地下熔洞待了整整十年，把材料练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在地下熔洞等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":78,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_术士4","cn":"石姆","title":"铁","race":"dwarf","org":"交汇城·炼金行会","realm":5,"power":"「石姆」是交汇城·炼金行会的法阵高手，大宗师境。","story":"他年轻时在地下熔洞待了整整十年，把法阵练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在地下熔洞等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":33,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_术士5","cn":"火恩","title":"熔","race":"dwarf","org":"南方港城·火器匠","realm":5,"power":"「火恩」是南方港城·火器匠的火焰高手，大宗师境。","story":"他年轻时在铸火广场待了整整十年，把火焰练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在铸火广场等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":61,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_术士6","cn":"矿克","title":"符","race":"dwarf","org":"地下熔洞·探矿宗师","realm":5,"power":"「矿克」是地下熔洞·探矿宗师的锻造高手，大宗师境。","story":"他年轻时在初火熔炉外围待了整整十年，把锻造练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在初火熔炉外围等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":35,"why":"大宗师的日子够长了，他不想再往上看。"}}
];
STRONG_V53["灵魂法师"].master = [
 {"id":"m_灵魂法师1","cn":"乌·森","title":"心","race":"human","org":"晨曦圣殿·守镜人","realm":5,"power":"「乌·森」是晨曦圣殿·守镜人的低语高手，大宗师境。","story":"他年轻时在静默室待了整整十年，把低语练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在静默室等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":31,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_灵魂法师2","cn":"雷·娜","title":"心","race":"human","org":"梦境·巡梦者","realm":5,"power":"「雷·娜」是梦境·巡梦者的回音高手，大宗师境。","story":"他年轻时在旧教堂地下待了整整十年，把回音练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在旧教堂地下等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"随缘","lv":48,"why":"大宗师的日子够长了，他不想再往上看。"}},
 {"id":"m_灵魂法师3","cn":"秦·森","title":"影","race":"human","org":"灵魂井·井守","realm":5,"power":"「秦·森」是灵魂井·井守的低语高手，大宗师境。","story":"他年轻时在梦境边缘待了整整十年，把低语练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在梦境边缘等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":64,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_灵魂法师4","cn":"秦·苏","title":"墟","race":"human","org":"静默室·默修","realm":5,"power":"「秦·苏」是静默室·默修的灵魂高手，大宗师境。","story":"他年轻时在旧教堂地下待了整整十年，把灵魂练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在旧教堂地下等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":65,"why":"他这辈子就剩这一件事了。"}},
 {"id":"m_灵魂法师5","cn":"艾·方","title":"影","race":"human","org":"旧教堂·听告解者","realm":5,"power":"「艾·方」是旧教堂·听告解者的记忆高手，大宗师境。","story":"他年轻时在灵魂井待了整整十年，把记忆练成了本能。有人说他当年输给过一位传奇，输完回来，把这十年重新过了一遍——从此再没人见他输过。","rumor":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","meet":"他在灵魂井等你。见你来了，他放下手里的活计，看了你很久：路远。坐。","will":{"kind":"渴望","lv":62,"why":"他这辈子就剩这一件事了。"}}
];
STRONG_V53["游侠"].raceSp = [
 {"id":"r_druid1","cn":"艾林·绿须","title":"木灵","race":"木精灵","org":"银叶城·德鲁伊环","realm":5,"power":"木精灵德鲁伊，能听懂树的话，也能让树听懂他的刀。","story":"他年轻时不是德鲁伊，是猎人。直到那天他追一头白鹿追进古林深处，回来时身上多了三条藤蔓纹，从此他不再杀生——只杀该杀的。","rumor":"","meet":"你在古林外遇见他。他蹲在树根边，手贴着地皮，半晌抬头：它说你身上有旧伤。","will":{"kind":"随缘","lv":30,"why":"树的寿命太长，他懒得争。"}},
 {"id":"r_druid2","cn":"露娜·月歌","title":"月环","race":"木精灵","org":"银叶城·德鲁伊环","realm":4,"power":"木精灵德鲁伊，月夜化身月狼巡林。","story":"她的德鲁伊之道来自母亲。母亲死在那场大火里，只留下一枚月牙哨——现在系在她颈上，哨声一响，整片林的鹿都会抬起头。","rumor":"","meet":"她在月下等你。月光把她的影子拉得很长，像一头蹲伏的狼。","will":{"kind":"淡泊","lv":12,"why":"她守着母亲留下的林子，哪儿也不去。"}},
 {"id":"r_elfrang1","cn":"青溪·逐叶","title":"逐叶","race":"精灵","org":"银叶城·林卫","realm":5,"power":"精灵游侠，箭术通神，一箭能分开两片落叶。","story":"青溪守了银叶城北林两百年。他说：林子的年轮就是我的日历，我不需要别的钟。","rumor":"","meet":"他取下一片树叶，搭在弓上：看好了。箭出去，叶不落——它被风接住了。","will":{"kind":"淡泊","lv":14,"why":"他有两百年的林子要守，没空想神座。"}}
];
STRONG_V53["战士"].raceSp = [
 {"id":"r_black1","cn":"卡兹·黑牙","title":"黑骨","race":"黑兽人","org":"兽人王庭·黑部","realm":5,"power":"黑兽人战士，兽人中最重的一族，一身黑皮如铁。","story":"黑部在兽人里不算强族，卡兹是黑部三百年里第一个入大宗师的人。他把部族的图腾柱背在身上走，说：柱子不倒，我就不倒。","rumor":"","meet":"他站在营地门口，像一堵墙。看见你，他把图腾柱往地上一顿：来者是客。坐。","will":{"kind":"渴望","lv":62,"why":"他要让黑部的名字，写进草原的史书。"}},
 {"id":"r_black2","cn":"古尔·铁颅","title":"铁颅","race":"黑兽人","org":"兽人王庭·黑部","realm":4,"power":"黑兽人战士，头颅受过一记重创，从此天灵盖覆了一层铁皮。","story":"那一记重创是暗蚀会的赏金猎人打的。他活下来之后，把铁皮钉在天灵盖上，像钉一枚勋章。他说话声音很大，因为他以为所有人都跟他一样听不见了。","rumor":"","meet":"他朝你咧嘴笑，铁皮在月光下反光：你说话大声点！我听得见！","will":{"kind":"执念","lv":83,"why":"他欠暗蚀会一刀，迟早要还。"}},
 {"id":"r_drag1","cn":"鳞焰·炽雷","title":"炽鳞","race":"龙裔","org":"东部王国·龙裔部","realm":5,"power":"龙裔战士，一族最后的武勋，鳞片赤红如铁。","story":"龙裔人口极少，鳞焰是这一代唯一入大宗师的战士。他说：龙的血在我们身上很淡了，但架，还是要打的。","rumor":"","meet":"他坐在石头上磨一柄旧刀。刀是他父亲传的，父亲是传奇——刀口卷了，他舍不得磨平。","will":{"kind":"执念","lv":88,"why":"他要替父亲把那柄刀，磨到传奇的高度。"}},
 {"id":"r_dwarfwar1","cn":"铜山·格隆","title":"铜山","race":"矮人","org":"铁峰堡·王庭卫","realm":4,"power":"矮人战士，一身板甲三百斤，站着像座铜山。","story":"格隆的甲是他爷爷铸的，传了三代。他说：矮人的命可以短，甲不能薄。","rumor":"","meet":"他拍了拍胸甲，发出沉闷的响：来，撞一下试试。","will":{"kind":"随缘","lv":25,"why":"他守着铁峰堡的门，谁来了都一样。"}},
 {"id":"r_dwarfwar2","cn":"岩锤·布恩","title":"岩锤","race":"矮人","org":"铁峰堡·矿卫","realm":4,"power":"矮人战士，锤法大开大合，能一锤震塌半边矿道。","story":"布恩年轻时塌过一次矿，他把锤子抡进岩缝，硬是撑住了一炷香，等所有人爬出去。从那以后，他的锤子比谁都重。","rumor":"","meet":"他举起锤子跟你比了比：放心，我砸石头比砸人准。","will":{"kind":"渴望","lv":60,"why":"他要用这把锤子，替矿下的人砸出一条路。"}}
];
STRONG_V53["术士"].raceSp = [
 {"id":"r_rune1","cn":"布伦·符文","title":"符文手","race":"矮人","org":"铁峰堡·符文工坊","realm":5,"power":"符文工匠矮人术士，双手刻满符文，每一道都是他亲手铸的。","story":"矮人术士大多炼火，布伦炼的是「字」。他把符文刻在自己手上，说：别的工匠刻铁，我刻我自己。他的双手就是他的工坊。","rumor":"","meet":"他在工坊里等你，摊开双手：选一道。我替你刻上去，不收钱——算我给你的见面礼。","will":{"kind":"随缘","lv":40,"why":"他的手就是他的神座，他坐得很稳。"}},
 {"id":"r_rune2","cn":"格丽·炉歌","title":"炉歌","race":"矮人","org":"铁峰堡·符文工坊","realm":4,"power":"符文工匠矮人术士，能在铸件上刻出会唱歌的符文。","story":"她刻的符文会响。铁峰堡的钟楼就是她的作品——每到整点，钟声里藏着一句她刻进去的矮人老话。没人听得懂，但所有人都说好听。","rumor":"","meet":"她哼着歌给你铸了一枚护符：戴好。它不是护身符，是提醒——提醒你家里有人在等你。","will":{"kind":"淡泊","lv":15,"why":"她只想把歌刻满铁峰堡的每一面墙。"}},
 {"id":"r_orcsmith1","cn":"炉牙·拉格","title":"炉牙","race":"兽人","org":"兽人王庭·铁部","realm":4,"power":"兽人术士，兽人中少见的炼火者，给部落铸刀。","story":"兽人的术士不常见——多数兽人觉得火是用来烤肉的。炉牙偏偏喜欢听铁水的声音。他铸的刀，草原上叫「会哭的刀」：刀锋太利，风过有声。","rumor":"","meet":"他递给你一把小刀：草原的规矩，见客送刀。不是让你打架，是让你记住——你有手。","will":{"kind":"随缘","lv":38,"why":"他把神座想成一座更大的炉子，他还没想好要不要坐。"}}
];
STRONG_V53["魔法师"].raceSp = [
 {"id":"r_sil1","cn":"银歌·月语","title":"银语","race":"银精灵","org":"银叶城·月塔","realm":5,"power":"银精灵法师，精灵中血统最稀的一支，施法时周身浮起银光。","story":"银精灵一族只剩三十七人。银歌是其中最年轻的大宗师。她说：我们这一族快没了，所以我得多看几眼这个世界，替他们记住。","rumor":"","meet":"她在月塔顶层等你。银光从她指尖溢出，像月光漏进了手指缝：来。看看我记住的世界。","will":{"kind":"随缘","lv":28,"why":"她记性太好，装不下神座那么大的东西。"}},
 {"id":"r_sil2","cn":"星尘·夜语","title":"星尘","race":"银精灵","org":"银叶城·月塔","realm":4,"power":"银精灵法师，星象派，能读出星座里的旧事。","story":"星尘的占星术是「读旧事」——他看的不是未来，是星星记下的过去。他说：未来是骗人的，过去才是真的。","rumor":"","meet":"他在塔顶观星，头也不回：今夜有颗星在讲一个关于你的故事。要听吗？","will":{"kind":"渴望","lv":70,"why":"他在星星里看见过神座的样子，想去看一眼真的。"}}
];
STRONG_V53["商人"].raceSp = [
 {"id":"r_half1","cn":"蜜果·豆蔻","title":"蜜秤","race":"半身人","org":"交汇城·香料行","realm":4,"power":"半身人商人，香料行行首，一张嘴能把盐说成糖。","story":"半身人做生意靠的不是算盘，是交情。蜜果的香料行开了四十年，老主顾进门，她连价都不问——她记得每个老主顾爱吃什么。","rumor":"","meet":"她请你喝了一碗蜂蜜水：尝尝。这碗不收钱——下一碗，收你一个故事。","will":{"kind":"淡泊","lv":8,"why":"她的小店就是她的整个世界。"}},
 {"id":"r_half2","cn":"麦冬·姜饼","title":"姜饼","race":"半身人","org":"南方港城·糕点铺","realm":4,"power":"半身人商人，糕点铺老板，生意做到海盗船上。","story":"麦冬的糕点铺开在港口，海盗上岸第一件事就是买他的姜饼。他说：刀剑是他们的，甜是大家的。","rumor":"","meet":"他塞给你一块热姜饼：吃。路上饿。","will":{"kind":"随缘","lv":22,"why":"他的愿望是让全世界的港口都飘着姜饼味。"}}
];
STRONG_V53["牧师"].raceSp = [
 {"id":"r_sham1","cn":"吼风·萨满","title":"风鼓","race":"兽人","org":"兽人王庭·风部","realm":5,"power":"兽人萨满，兽人牧师一脉，敲风鼓通灵祖灵。","story":"兽人的牧师不拜圣光，拜祖灵。吼风的鼓声能召来祖先的风——草原上的兽人出征前，都要听他一通鼓。","rumor":"","meet":"他敲了三下鼓，递给你一面小鼓：带着。迷路的时候敲三下，草原认得你。","will":{"kind":"渴望","lv":58,"why":"他想知道祖灵之上，还有没有更大的风。"}},
 {"id":"r_sham2","cn":"露·苔语","title":"苔语","race":"兽人","org":"兽人王庭·苔部","realm":4,"power":"兽人萨满，药草一脉，能听懂受伤的骨头说话。","story":"苔部的萨满都是接骨师。露说：骨头不会说谎，它疼就是疼。所以她当不了那种说「神会保佑你」的祭司。","rumor":"","meet":"她给你包了伤，用鼻子嗅了嗅绷带：三天别沾水。还有——你少惹暗蚀会的人。","will":{"kind":"淡泊","lv":10,"why":"她的神在草根底下，她守着那片土就够。"}}
];
STRONG_V53["盗贼"].raceSp = [
 {"id":"r_mix1","cn":"灰鸦","title":"灰鸦","race":"混血","org":"暗影阁·边影","realm":5,"power":"混血盗贼，半精灵半人类，能在月光下隐身。","story":"混血两头不靠——精灵嫌他杂，人类嫌他野。他索性谁都不靠，练了一身「哪边都不站」的本事。暗影阁收他，是看中他两边都懂。","rumor":"","meet":"他在阴影里开口，声音像从墙里渗出来的：你身上有件东西，我见过。在哪见的，我忘了。","will":{"kind":"随缘","lv":32,"why":"他谁也不认，自然也不认神座。"}}
];
STRONG_V53["暗蚀会"] = {"abyss":[
 {"id":"ab_priest1","cn":"腐光·塞尔","title":"腐光","race":"各色","org":"暗蚀会·黑教堂","realm":5,"power":"腐化牧师，圣辉在他身上烂成了黑光。","story":"塞尔曾是圣城最受敬爱的助祭。那场大灾里，他跪在祭坛前求了三天三夜，神没有回答他——后来深渊回答了。他从此披着黑圣袍，替深渊布道。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他站在黑教堂门口，圣辉在他头顶碎成灰：你来听道，还是来踢馆？","will":{"kind":"执念","lv":85,"why":"他信过一次神，神没理他——他这辈子都要深渊理他。"}},
 {"id":"ab_mage1","cn":"蚀星·诺恩","title":"蚀星","race":"各色","org":"暗蚀会·黑塔","realm":6,"power":"堕法师，曾以星语石碎片为引，把自己炼成了半人半魔。","story":"诺恩当年是星落塔的天才，第一个提出「魔网可以改写」的人。他试了，成功了——也把自己写进去了。现在的他，本身就是一道禁咒。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"黑塔顶层没有灯。他坐在黑暗里，声音像从塔底传上来：我这儿有一道咒，你学不学？","will":{"kind":"执念","lv":92,"why":"他已经不是人了，神座对他只是一块垫脚石。"}},
 {"id":"ab_war1","cn":"黑骨·库尔","title":"黑骨","race":"各色","org":"暗蚀会·黑旗军","realm":5,"power":"黑兽人战士，兽人族的叛徒，一身黑甲黑到发光。","story":"库尔曾是黑部的骄傲。深渊赐了他力量，也换走了他的部族——他赢了决斗，却输了整个黑部的信任。他现在替暗蚀会打仗，打谁都行。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他站在黑旗军阵前，声音嘶哑：黑部的兄弟，别拦我。","will":{"kind":"渴望","lv":55,"why":"他要向黑部证明：赢就是赢，管它是谁给的力量。"}},
 {"id":"ab_soul1","cn":"噬梦·夜歌","title":"噬梦","race":"各色","org":"暗蚀会·梦魇堂","realm":5,"power":"腐化灵魂法师，专吃人的梦境。","story":"夜歌曾是晨曦圣殿的守镜人。她在镜子里看见了自己的另一面——然后把自己关在镜子里，再出来时，已经不是她了。她吃梦，因为梦里有别人的活法。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"她在你梦里说话，声音隔着一层水：醒着的时候别来找我，我不在。","will":{"kind":"禁忌","lv":0,"why":"她只在梦里出手——醒着的人，她不碰。"}},
 {"id":"ab_thief1","cn":"影蚀·无面","title":"无面","race":"各色","org":"暗蚀会·影部","realm":4,"power":"影蚀刺客，暗影阁叛徒，影子能替他杀人。","story":"无面原本没有名字——暗影阁的刺客本来就没有名字。他有，但他忘了。他叛出暗影阁那天，把自己的脸也忘了。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"你背脊一凉，回头，他已经站在三丈外：别怕。我今天不想杀人。","will":{"kind":"随缘","lv":45,"why":"他连自己的名字都不要了，还要神座做什么。"}},
 {"id":"ab_ranger1","cn":"腐林·苔刑","title":"腐林","race":"各色","org":"暗蚀会·腐林营","realm":4,"power":"腐化游侠，被深渊浸透的林，替深渊巡猎。","story":"苔刑守的那片林被深渊浸了。林活了，他疯了——不，他清醒得很：林要我巡猎，我就巡猎。猎物是什么，林说了算。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他蹲在腐林边，指尖勾着弓弦：进来的人，都是猎物。你也是。","will":{"kind":"渴望","lv":66,"why":"他想知道深渊喂大的林，能不能长出一棵神树。"}},
 {"id":"ab_knight1","cn":"黑誓·加隆","title":"黑誓","race":"各色","org":"暗蚀会·黑骑士团","realm":5,"power":"黑誓骑士，发誓誓约骑士团团长之位，被深渊应了。","story":"加隆是誓约骑士团的叛徒。他发誓要当团长，团长之位却一直轮不到他。深渊听见了他的誓言，替他「应」了——代价是，他的誓言从此只对深渊有效。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他单膝跪地，剑尖朝下——那是骑士的最高礼节，可他的影子是站着的。","will":{"kind":"执念","lv":80,"why":"他信誓约，可誓约没信过他。"}},
 {"id":"ab_smith1","cn":"蚀火·铁泣","title":"蚀火","race":"各色","org":"暗蚀会·黑炉","realm":4,"power":"蚀火工匠，矮人术士，用深渊之火铸器。","story":"铁泣是铁峰堡百年一遇的铸器天才，直到他在矿洞深处遇见了那簇黑火。他把黑火带回工坊，铸出来的东西会说话——说的是人话。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他在黑炉边坐着，火光把他的脸照成两半：我的东西，会记住你。你确定要买？","will":{"kind":"随缘","lv":35,"why":"他只想铸出会说话的东西，别的都排第二。"}},
 {"id":"ab_trade1","cn":"黑秤·弗恩","title":"黑秤","race":"各色","org":"暗蚀会·黑市","realm":4,"power":"黑商，替暗蚀会收赃销赃，秤上抹过一层黑。","story":"弗恩原是金衡商会的账房。他算错了一笔账，被逐出商会——从那以后，他算的每一笔账都「对」了。对暗蚀会来说。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他拨着算盘，头也不抬：买还是卖？不问来路，不问去路。","will":{"kind":"淡泊","lv":18,"why":"他算了一辈子账，算出来神座不值一文。"}},
 {"id":"ab_war2","cn":"狂血·格里","title":"狂血","race":"各色","org":"暗蚀会·狂营","realm":4,"power":"狂战士，战神团叛徒，一开打就停不下来。","story":"格里原是战神团的教头，教人「克制」。他自己先没克制住——那场比试他打红了眼，打穿了校场，打没了前程。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他握着拳站在你面前，指节咯咯响：别逼我动手。我动起手来，连我自己都怕。","will":{"kind":"渴望","lv":72,"why":"他想要一场打得没有尽头的架——神座也许就是。"}},
 {"id":"ab_mage2","cn":"血法·薇拉","title":"血法","race":"各色","org":"暗蚀会·血塔","realm":5,"power":"血法师，用血施法，一道咒要放一盅血。","story":"薇拉的法术是从血里来的。她第一次施法，血放满了整个陶碗。她说：法力是借来的，血是自己的——用自己的血，不欠谁的。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"她指尖悬着一滴血，在灯下转：看，多漂亮。你要不要也试试？","will":{"kind":"执念","lv":78,"why":"她把自己的血都押上了，总要赢点什么。"}},
 {"id":"ab_priest2","cn":"血祭·莫尔","title":"血祭","race":"各色","org":"暗蚀会·血祭坛","realm":4,"power":"血祭者，牧师一脉最黑的一支，拿人命换深渊的回应。","story":"莫尔曾是静默殿的见习修士。他侍奉的那位主教死于瘟疫，他跪在神像前求了一夜，神没救——他从此信了另一套：神不救，是因为祭品不够。","rumor":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","meet":"他在祭坛边擦拭一柄骨刀：你来献祭，还是来当祭品？","will":{"kind":"禁忌","lv":0,"why":"他只在祭坛满月夜出手——那天深渊离人间最近。"}}
]};

window.STRONG_RUMOR_V53 = [
 {"id":"rm_lv_mage1","sid":"lv_mage1","text":"有人说她见过神座。她什么都没说，只是把玩着那枚银冠——那是她成神那天，自己为自己戴上的。","area":"交汇城","reading":""},
 {"id":"rm_lv_mage2","sid":"lv_mage2","text":"塔里的老执事说，洛每年双子星升起的夜里都会失眠。他站在观星台，看着那枚星徽，像看着一道没做完的题。","area":"交汇城","reading":""},
 {"id":"rm_lv_mage3","sid":"lv_mage3","text":"有人说他四处寻找能点亮那盏灯的火。有人说那灯芯是假的，是他在骗自己。","area":"交汇城","reading":""},
 {"id":"rm_lv_mage4","sid":"lv_mage4","text":"精灵们说，瑟琳在结界里藏了一本书，书里写着世界树听见的所有秘密。","area":"交汇城","reading":""},
 {"id":"rm_lv_mage5","sid":"lv_mage5","text":"守望者内部说，灰书的卷宗里有一页是空白的——那是留给「将来能彻底封住七印的人」的。","area":"交汇城","reading":""},
 {"id":"rm_lv_war1","sid":"lv_war1","text":"铁峰堡的孩子都知道：格罗总长的盾上有三百七十二道凹痕，每一道都能讲一个故事。","area":"铁门关","reading":""},
 {"id":"rm_lv_war2","sid":"lv_war2","text":"有人说喀兰在找一块旧碑，碑上刻着兽人与人类第一份和平条约——他想把那份条约，重新立起来。","area":"铁门关","reading":""},
 {"id":"rm_lv_war3","sid":"lv_war3","text":"镇北军的兵都知道，统领的木臂里藏着一张纸，写着一个女人的名字。没人敢问是谁。","area":"铁门关","reading":""},
 {"id":"rm_lv_war4","sid":"lv_war4","text":"佣兵们说，叶会长有个规矩：佣金结账时，总要扣下一成，记在账上，说是「留给守不住的城」。","area":"铁门关","reading":""},
 {"id":"rm_lv_war5","sid":"lv_war5","text":"水手们说，断江的旧枪插在他酒馆的房梁上，枪尖朝海——他说，那是留给将来守海的人。","area":"铁门关","reading":""},
 {"id":"rm_lv_priest1","sid":"lv_priest1","text":"有人说克莱门在自己的祷告室里，藏着一本被净化令收缴的禁书——他每晚读一页，然后向神忏悔。","area":"圣城","reading":""},
 {"id":"rm_lv_priest2","sid":"lv_priest2","text":"有人说玛格达的蜡烛芯，是用初代守夜人的头发搓的——那人是太阳神圣临的未婚妻，她没等到他成神。","area":"圣城","reading":""},
 {"id":"rm_lv_priest3","sid":"lv_priest3","text":"精灵们说，艾诺尔的小教堂里，供奉着一尊精灵面容的太阳神像——只有她能看见神像的表情。","area":"圣城","reading":""},
 {"id":"rm_lv_thief1","sid":"lv_thief1","text":"有人说夜枭每年除夕，会独自去一趟自由城邦的旧钟楼。钟楼底下埋着一样他偷了三十年都没能还回去的东西。","area":"交汇城","reading":""},
 {"id":"rm_lv_thief2","sid":"lv_thief2","text":"商路上流传一句话：别在雾天跟灰雾谈生意——你永远不知道，她在白天还是晚上记住了你。","area":"交汇城","reading":""},
 {"id":"rm_lv_ranger1","sid":"lv_ranger1","text":"有人说艾琳的白鹿还在跑，她就还在追。她追了三百年的那只鹿，是林语者留给她的一道题。","area":"银叶城","reading":""},
 {"id":"rm_lv_ranger2","sid":"lv_ranger2","text":"雪原的猎人传说：断弓的背囊里装着一根完整的弓弦，是他留着等「最后一仗」用的。","area":"银叶城","reading":""},
 {"id":"rm_lv_knight1","sid":"lv_knight1","text":"有人说罗兰的盾不是白的，是他在每次战斗后，都把它重新漆成白色。","area":"圣城","reading":""},
 {"id":"rm_lv_knight2","sid":"lv_knight2","text":"圣城的平民说，晨辉骑士的铠甲内侧，刻着一个人名——那是她在平民窟时的邻居，死在了第一次净化令里。","area":"圣城","reading":""},
 {"id":"rm_lv_smith1","sid":"lv_smith1","text":"有人说格朗的符文里，藏着一道「初火」——那是他在初火熔炉前站了三百年，听火说的一句话。","area":"铁峰堡","reading":""},
 {"id":"rm_lv_smith2","sid":"lv_smith2","text":"有人说梅的炽芯里，还留着老铸师最后一句话。她每次喝酒到微醺，都会对着炉火自言自语。","area":"铁峰堡","reading":""},
 {"id":"rm_lv_trade1","sid":"lv_trade1","text":"有人说文森的秘密账本里，记的不是钱，是人情——每一笔「不赚的钱」，都记在另一页上，等有一天连本带利还。","area":"南方港城","reading":""},
 {"id":"rm_lv_trade2","sid":"lv_trade2","text":"水手们说，半帆的船舱里有一间锁着的房间，里面堆着他当年抢来的、又一件件还回去的东西。","area":"南方港城","reading":""},
 {"id":"rm_lv_soul1","sid":"lv_soul1","text":"有人说澜的雾眼是天生的——她生下来就看不见「表面」，只能看见人的「另一面」。所以她从不敢看任何人超过一炷香。","area":"圣城","reading":""},
 {"id":"rm_lv_隐世","sid":"lv_隐世","text":"牧羊人传说，荒年最凶的时候，灰袍会出现在最饿的村子外，放下半袋盐就走。","area":"free","reading":""},
 {"id":"rm_lv_散人","sid":"lv_散人","text":"赌坊里流传：独臂萧逢赌必输，逢打必赢。他听了大笑：赌是命，打是活。","area":"free","reading":""},
 {"id":"rm_lv_兽王","sid":"lv_兽王","text":"猎人说，月圆夜能听见它长啸。那声音一起，整片草原的狼都会跟着应和——像在唱一首很老的歌。","area":"free","reading":""},
 {"id":"rm_ab_knight1","sid":"ab_knight1","text":"暗蚀会的人，正史里没有他们的名字——酒馆里才有。","area":"","reading":""},
 {"id":"rm_m_魔法师1","sid":"m_魔法师1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_战士1","sid":"m_战士1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_牧师1","sid":"m_牧师1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_盗贼1","sid":"m_盗贼1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_商人1","sid":"m_商人1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_游侠1","sid":"m_游侠1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_骑士1","sid":"m_骑士1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_术士1","sid":"m_术士1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_m_灵魂法师1","sid":"m_灵魂法师1","text":"坊间说，他收徒只看一件事：肯不肯为一件事笨十年。","area":"","reading":""},
 {"id":"rm_r_druid1","sid":"r_druid1","text":"银叶城那边传来一件怪事：林卫里那位德鲁伊，已经一个月没出林子了。有人说，树在跟他说什么——他一直在听。","area":"银叶城","reading":""}
];
/*v53inj:rumor*/
window.v53_rumorAfterWrite = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    var cur=typeof curNode!=='undefined'?curNode:"";
    if(cur!=="tavern_rumor_generic") return;
    var pool=window.STRONG_RUMOR_V53||[];
    if(!pool.length) return;
    if(!S.knownStrong) S.knownStrong={};
    var loc=((N&&N[cur]&&N[cur].place)||"")+"";
    var picked=0;
    for(var i=0;i<pool.length&&picked<2;i++){
      var it=pool[i];
      if(!it) continue;
      if(S.knownStrong[it.id]) continue;
      if(it.area&&loc.indexOf(it.area)<0&&loc.indexOf("酒馆")<0) continue;
      S.knownStrong[it.id]=S.day||0;
      writePar("── 酒馆里有人压着嗓子说 ──","noind flagline");
      writePar(it.text,"narration");
      if(it.reading&&window.v53_unlockStrongReading) v53_unlockStrongReading(it.reading);
      picked++;
    }
  }catch(e){}
};
window.v53_unlockStrongReading = function(id){
  try{
    var R=window.READINGS_V45||{};
    if(!R[id]||typeof S==='undefined'||!S) return;
    if(window.v45_unlockReading) v45_unlockReading(id);
  }catch(e){}
};
/* ---- 10. 图鉴 · 强者谱 ---- */
function v53_esc(t){ try{ return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }catch(e){ return ""; } }
function v53_peersBar(cn){
  try{
    var P=(window.PEERS_V53||{})[cn]; if(!P) return "";
    var row=P.count||{};
    var names=["启灵","凝元","化意","宗师","大宗师","传奇"];
    var vals=[];
    var ok=true;
    for(var i=1;i<=6;i++){ var v=row[i]; if(typeof v!=="number"){ ok=false; break; } vals.push(v); }
    if(!ok) return "";
    var maxV=vals[0]||1;
    for(var j=0;j<vals.length;j++){ if(vals[j]>maxV) maxV=vals[j]; }
    var h="<div style='margin:6px 0'>";
    for(var k=0;k<6;k++){
      var w=Math.max(3,Math.round((vals[k]||0)/maxV*100));
      h+="<div style='display:flex;align-items:center;gap:6px;margin:2px 0'>";
      h+="<div style='width:56px;font-size:11px;color:var(--dim);flex:none'>"+names[k]+"</div>";
      h+="<div style='flex:1;background:rgba(139,111,71,.12);border-radius:3px;height:12px;position:relative'><div style='width:"+w+"%;height:12px;background:linear-gradient(90deg,rgba(139,111,71,.5),rgba(168,132,42,.85));border-radius:3px'></div></div>";
      h+="<div style='width:52px;font-size:11px;text-align:right;flex:none'>"+vals[k]+"</div>";
    }
    h+="</div>";
    return h;
  }catch(e){ return ""; }
}
window.v53_strongBody = function(){
  try{
    var P=window.PEERS_V53||{};
    var S53=window.STRONG_V53||{};
    var h="<div style='font-size:13px;color:var(--dim);margin-bottom:8px'>大陆人口两千五百万，能力者只有百分之零点五（约十二万五千）。强者如漏塔，越往上，人越少。</div>";
    h+="<div style='display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px'>";
    h+="<div style='flex:1 1 90px;background:rgba(139,111,71,.08);border-radius:8px;padding:8px;text-align:center'><div style='font-size:18px;font-weight:bold;color:var(--text-gold2)'>125,000</div><div style='font-size:11px;color:var(--dim)'>能力者在册</div></div>";
    h+="<div style='flex:1 1 90px;background:rgba(139,111,71,.08);border-radius:8px;padding:8px;text-align:center'><div style='font-size:18px;font-weight:bold;color:var(--text-gold2)'>26</div><div style='font-size:11px;color:var(--dim)'>人类传奇</div></div>";
    h+="<div style='flex:1 1 90px;background:rgba(139,111,71,.08);border-radius:8px;padding:8px;text-align:center'><div style='font-size:18px;font-weight:bold;color:var(--text-gold2)'>9</div><div style='font-size:11px;color:var(--dim)'>在位半神</div></div>";
    h+="<div style='flex:1 1 90px;background:rgba(139,111,71,.08);border-radius:8px;padding:8px;text-align:center'><div style='font-size:18px;font-weight:bold;color:#a8842a'>9</div><div style='font-size:11px;color:var(--dim)'>唯一神座</div></div>";
    h+="</div>";
    /* 职业金字塔 */
    h+="<div style='font-size:15px;font-weight:bold;color:var(--text-gold2);margin:10px 0 4px'>职业金字塔</div>";
    var jobs=["魔法师","战士","商人","牧师","盗贼","游侠","骑士","术士","灵魂法师"];
    for(var i=0;i<jobs.length;i++){
      var cn=jobs[i]; var p=P[cn]; if(!p) continue;
      h+="<div class='achievement-card' style='margin-bottom:8px'><div class='achievement-name'>"+cn+" <span style='font-size:11px;color:var(--dim);font-weight:normal'>"+(p.pop)+" 人</span></div>";
      h+="<div style='font-size:11px;color:var(--dim);margin-bottom:2px'>神座："+p.deity.status+"　半神在位：1　挑战者：1</div>";
      h+=v53_peersBar(cn);
      h+="</div>";
    }
    /* 大陆强者榜 */
    h+="<div style='font-size:15px;font-weight:bold;color:var(--text-gold2);margin:12px 0 4px'>大陆强者榜 · 传奇"+(" 26")+"</div>";
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>人类传奇恒二十六位，另有超凡野兽·兽王一位（不计入人类）。半神与神不涉世俗，其名只在古老传说里。</div>";
    var rows=[];
    for(var job in S53){
      var o=S53[job]; if(!o) continue;
      var L=o.legend||[];
      for(var a=0;a<L.length;a++){ var r=L[a]; rows.push({job:job,r:r,kind:"传奇"}); }
    }
    var extra=["隐世","散人","兽王"];
    for(var e=0;e<extra.length;e++){
      var k=extra[e]; var d=P[k]; if(!d||!d.kind) continue;
      var nm=(k==="兽王")?"鬃吼":(k==="隐世"?"无名·灰袍":"独臂·萧");
      rows.push({job:k,r:{id:"lv_"+k,cn:nm,title:d.kind,power:d.note,realm:6},kind:"传奇"});
    }
    h+="<div style='display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px'>";
    for(var b=0;b<rows.length;b++){
      var it=rows[b]; var r=it.r;
      var known=!!(S.knownStrong&&S.knownStrong[r.id]);
      var nm=known?(r.title?r.title+"·":"")+r.cn:"？？？";
      h+="<div class='achievement-card "+(known?"":"")+"' style='padding:6px 8px' onclick='v53_peekStrong(\""+r.id+"\")'>";
      h+="<div style='font-size:12px;color:#a8842a'>"+nm+"</div>";
      h+="<div style='font-size:10px;color:var(--dim)'>"+(known?(r.power||it.job):"传闻尚未听闻")+"</div>";
      h+="</div>";
    }
    h+="</div>";
    /* 半神与神 · 不涉世俗者 */
    h+="<div style='font-size:15px;font-weight:bold;color:var(--text-gold2);margin:12px 0 4px'>不涉世俗者 · 半神与神</div>";
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>神在位时，半神只有一位——他旁边的名额，被神坐着。</div>";
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:4px'>";
    for(var q=0;q<jobs.length;q++){
      var pj=P[jobs[q]]; if(!pj) continue;
      h+="<div style='margin:3px 0'><b>"+jobs[q]+"</b>：神位"+(pj.deity.holder||"空悬")+(pj.deity.status==="在位"||pj.deity.status==="在位·隐世"?"（在位）":"（"+pj.deity.status+"）")+"；在位半神与挑战者之名，待你亲历。</div>";
    }
    h+="</div>";
    /* 普通人世界 v54 */
    h+="<div style='font-size:15px;font-weight:bold;color:var(--text-gold2);margin:12px 0 4px'>普通人世界 · 百分之九十九点五</div>";
    var WN=window.WORLD_NORMAL_V54||{};
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>"+String(WN.人口?WN.人口.total:25000000).replace(/\B(?=(\d{3})+(?!\d))/g,",")+" 口人里，能力者只有十二万五千（0.5%）。粮食、搬运、工匠、商路、底层政务，全由普通人扛着——部分商人与贵族，也是普通人。</div>";
    h+="<div class='achievement-card' style='margin-bottom:6px'><div style='font-size:12px;color:#3a6ea8;margin-bottom:4px'>军队与围杀</div>";
    h+="<div style='font-size:11px;color:var(--dim)'>普通军人是国家军制的主体，能力者编入军官团。化意期一两百普通军人便可围杀（按职业 60–200 人浮动）；跨过宗师，千人士兵难困一人。</div></div>";
    h+="<div class='achievement-card' style='margin-bottom:6px'><div style='font-size:12px;color:#3a6ea8;margin-bottom:4px'>经济与制衡</div>";
    h+="<div style='font-size:11px;color:var(--dim)'>能力者不事生产，材料、药材、粮草、情报全赖普通人供给；贵族掌世俗权、能力者掌武力，两套体系互相离不开。</div></div>";
    h+="<div class='achievement-card' style='margin-bottom:6px'><div style='font-size:12px;color:#3a6ea8;margin-bottom:4px'>组织门槛</div>";
    h+="<div style='font-size:11px;color:var(--dim)'>宗师是组织的执事门槛，大宗师才有资格当席主、坐镇一方；传奇是战略行动的统帅——教皇半神沉眠于使徒宫，教廷日常由大宗师主持。</div></div>";
    /* 势力强者册 */
    h+="<div style='font-size:15px;font-weight:bold;color:var(--text-gold2);margin:12px 0 4px'>势力强者册</div>";
    var F=window.FACTION_PEERS_V53||{};
    for(var fc in F){
      var fo=F[fc]; if(!fo) continue;
      var anchors=[];
      for(var z=0;z<(fo.anchor||[]).length;z++){
        var aid=fo.anchor[z];
        var af=v53_findStrong(aid);
        var an=af?(af.row.title?af.row.title+"·":"")+af.row.cn:aid;
        anchors.push(an);
      }
      h+="<div class='achievement-card' style='margin-bottom:6px'><div class='achievement-name'>"+fo.cn+"</div>";

/*v56inj:echo*/
/* ---- 传闻池扩展：行踪 + 强者提到你（STRONG_RUMOR_V53.push） ---- */
if(window.STRONG_RUMOR_V53){
/* 行踪传闻 12 */
STRONG_RUMOR_V53.push({id:"rm56_move1",text:"北边传来消息：星落塔的洛·晨雾，这个月往铁门关跑了两趟。塔里的人说，他是在替镇北军加固城防结界。","area":"","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move2",text:"有人说银叶城的奥薇恩·星语，最近常坐在老树下发呆，指间的叶子转得比往常慢。","area":"银叶城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move3",text:"铁峰堡的炉火旺了一个月。矮人们说，索林王今年下初火熔炉的次数，比过去十年加起来都多。","area":"铁峰堡","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move4",text:"草原上的人看见喀兰·赤峰往北走了，刀柄上的红布换了一条新的。","area":"兽人王庭","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move5",text:"圣城的静默殿，今年新换的蜡烛比往年多了一倍。守夜人说，是风大了。","area":"圣城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move6",text:"南方的断江酒馆关了三天门。水手们说，断江爷出海去了——二十年头一回。","area":"南方港城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move7",text:"雪原的猎人说，断弓的火堆今年往深雪区挪了两次。那地方，人不该去。","area":"北方","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move8",text:"交汇城的老巷铺子，文森·金秤把一车粮捐给了灾区。有人问账怎么算，他说：算在十年后。","area":"交汇城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move9",text:"暗影阁的人说，阁主今年除夕没去旧钟楼。钟楼守夜人说，那晚他等了一夜，没等到人。","area":"交汇城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move10",text:"精灵们说，世界树下的瑟琳·银冠，最近在教一个人类孩子认叶子。","area":"银叶城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move11",text:"北地有人看见一盏青色火焰，在大雪里走了一夜。火没灭。","area":"北方","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_move12",text:"守望者塔的信鸽这个月飞出去三批。藏卷师灰书说：只是例行巡视。","area":"圣城","reading":""});
/* 强者提到你（需玩家名声或交集，进酒馆即可能触发）18 */
STRONG_RUMOR_V53.push({id:"rm56_mention1",text:"酒馆角落里有人轻声说：听说有个年轻人，在铁门关城头站了一夜，秦统领跟他聊了很久。","area":"","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention2",text:"“你听说了吗？有个外乡人，奥薇恩·星语亲自递了片叶子给他。”","area":"银叶城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention3",text:"“星落塔的洛首席，最近常问起一个年轻人的名字。塔里的人说，他从不问人的。”","area":"艾尔达学院","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention4",text:"“断江爷酒馆里挂了个新杯子，说是留给‘一个懂守城道理的年轻人’的。”","area":"南方港城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention5",text:"“圣城的罗兰团长，盾上新漆了一道——他说是替一个年轻人挡的。”","area":"圣城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention6",text:"“草原上在传，喀兰·赤峰把自己的红布条，系在了一个外乡人手上。”","area":"兽人王庭","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention7",text:"“老巷的文森掌柜，账本上多了一行字：欠一个年轻人的情，记十年。”","area":"交汇城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention8",text:"“锻造公会说，格朗大师最近总提一个手很稳的年轻人——他那把刀，想送人。”","area":"铁峰堡","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention9",text:"“静默殿的守夜人换了新蜡烛。有人问给谁点的，她说：给一个在夜里坐过的人。”","area":"圣城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention10",text:"“灰雾那行商说，她最近见过一个影子很干净的人——‘干净得我想替他染一染’。”","area":"交汇城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention11",text:"“荒野巡守的人在说，大巡守艾琳最近教一个外乡人吹叶笛——她说那人‘听得出路’。”","area":"荒野","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention12",text:"“北境的老兵在传，断弓把背囊里那根弓弦，给一个年轻人看了。那是他留着打最后一仗的。”","area":"北方","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention13",text:"“南方船队在说，半帆爷的船，破例给一个年轻人挂过满帆——就挂了一盏茶的功夫。”","area":"南方港城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention14",text:"“暗影阁的人在打听一个外乡人。阁主说：不用查了，他不是来偷的。”","area":"交汇城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention15",text:"“晨曦圣殿的守镜人说，回音之镜最近照见了一道新影子——很稳，没有躲。”","area":"圣城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention16",text:"“铁峰堡的矿工在传，梅大师的工坊里，多了一柄没有刃的剑——她说等一个‘不会打铁的人’来拿。”","area":"铁峰堡","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention17",text:"“枢机院的文书在说，克莱门主教最近常念一个名字，念完就翻一页禁书。”","area":"圣城","reading":""});
STRONG_RUMOR_V53.push({id:"rm56_mention18",text:"“有人在深渊边缘看见一个黑袍人站着。他问路过的人：那个年轻人，走到哪一步了？”","area":"","reading":""});
}

/* ---- 强者来信 12 封（READINGS_V45 扩展） ---- */
if(window.READINGS_V45){
READINGS_V45["r_v56_1"]={id:"r_v56_1",title:"洛·晨雾的来信",type:"letter",author:"洛·晨雾",source:"星落塔第七层",text:["见字如面。","双子星昨夜升起来了，我又失眠。站在观星台，那枚星徽在月光下像一道没做完的题。","想起你问过我的话。这塔的第七层，永远给你留着窗——你若要来，不必递帖子。","塔没塌。灯灭了一盏，可第七层的窗，还亮着。","——洛，于观星台"],hint:"洛·晨雾亲手写的信，墨迹还新。"};
READINGS_V45["r_v56_2"]={id:"r_v56_2",title:"喀兰·赤峰的口信",type:"letter",author:"喀兰·赤峰",source:"草原",text:["草原的风替你带句话。","旧碑的下落，我打听到了一点眉目——在死亡沙漠北缘，有人见过半截碑顶。","你若有空，替我去看一眼。带不回来，抄几个字也好。","红布条还在你手上吧？草原认它，也认你。","——喀兰，篝火边"],hint:"随篝火飘来的口信，红布条像是系过的。"};
READINGS_V45["r_v56_3"]={id:"r_v56_3",title:"玛格达·静烛的烛火",type:"letter",author:"玛格达·静烛",source:"静默殿",text:["（这封信是一截没有字的白纸，纸上放着一根燃过的蜡烛芯。）","守夜人只传了一句话：夜记得你。","（背面有一行小字，像是用指甲刻的：）","替我在夜里坐过的人，夜会替他点一盏灯。","——静默殿，无年月"],hint:"一截白纸与烛芯。守夜人不写字，她只点灯。"};
READINGS_V45["r_v56_4"]={id:"r_v56_4",title:"文森·金秤的账页",type:"letter",author:"文森·金秤",source:"老巷铺子",text:["（这是一页账本纸，不是信。但纸上的字，是写给你的。）","春三月，赈灾粮，记：欠一个年轻人的情。","账算得精，不如算得久。你这一笔，我记十年。","下次路过老巷，进来喝茶。算盘拨给你听。","——文森，账房"],hint:"从账本上撕下来的一页，折得很整齐。"};
READINGS_V45["r_v56_5"]={id:"r_v56_5",title:"杜·夜枭的影子",type:"letter",author:"杜·夜枭",source:"（无落款）",text:["（纸上只有一行字，像是用刀尖刻的。）","旧钟楼底下的门，为你开过一次。","你替我打听的那件东西，有下落了。","下次见面，隔着门说。","——（没有名字）"],hint:"没有落款，纸的边缘有刀痕。"};
READINGS_V45["r_v56_6"]={id:"r_v56_6",title:"艾琳·逐风的叶笛",type:"letter",author:"艾琳·逐风",source:"林间",text:["（信里夹着一片干叶子，吹了一下，能发出一个很短很短的调子。）","白鹿往北跑了。我追了它三百年的路，它第一次停下来，回头看了我一眼。","它看我的眼神，像在说：你也该去看看北边了。","你路上要是听见这个调子，就知道我在附近。","——逐风，在路上"],hint:"叶子还带着一点林间的味道。"};
READINGS_V45["r_v56_7"]={id:"r_v56_7",title:"梅·炽芯的炉边字条",type:"letter",author:"梅·炽芯",source:"铁峰堡工坊",text:["（字条被炉火燎过一角，墨迹有点糊。）","那柄没刃的剑，还挂在工坊墙上。","老铸师托梦给我，说剑该送人了。我想了想，觉得他说的是你。","来拿的时候，别碰那柄锤——它今天心情可能还是不好。","——梅，炉边"],hint:"纸角有燎痕，墨迹泛黄。"};
READINGS_V45["r_v56_8"]={id:"r_v56_8",title:"罗·断江的酒账",type:"letter",author:"罗·断江",source:"断江酒馆",text:["（这是一张酒账，赊账人那一栏，写着你的名字——但你从没来过。）","酒钱我先记着。等你哪天打够了，来喝。","断江鱼给你留了一条。","枪还在房梁上。海，也还等着人守。","——断江，柜台后"],hint:"赊账人那一栏的字迹，像是新写的。"};
READINGS_V45["r_v56_9"]={id:"r_v56_9",title:"瑟琳·银冠的树叶",type:"letter",author:"瑟琳·银冠",source:"世界树下",text:["（信里没有字，只有一片完整的、被细心压平的树叶。）","（树叶背面，用极细的笔迹写了一行字：）","树记住你了。它说，你下次来的时候，风会认得你。","——瑟琳，结界边"],hint:"一片完整的树叶，被压得平平整整。"};
READINGS_V45["r_v56_10"]={id:"r_v56_10",title:"贺·断弓的干肉与话",type:"letter",author:"贺·断弓",source:"雪原",text:["（信里没有纸，只有一小块干肉，和一句刻在木片上的话。）","弦还在。你不在。","雪原的冬天，比传说里长。你走的路，比雪原还长——","长到，我这样的老猎手，也想等等看。","——断弓，避风处"],hint:"木片上的刻痕很深，像是用刀尖刻的。"};
READINGS_V45["r_v56_11"]={id:"r_v56_11",title:"澜·梦墟的回声",type:"letter",author:"澜·梦墟",source:"晨曦圣殿",text:["（信纸上只有两行字，字迹很轻，像怕惊动什么。）","你身上那道轻的声音，最近响了一些。","镜子说：它快说出来了。","等你准备好了，回音室的门，为你开着。","——（守镜人没有署名）"],hint:"字迹很轻，像是闭着眼写的。"};
READINGS_V45["r_v56_12"]={id:"r_v56_12",title:"奥伦·星弦的孤峰留书",type:"letter",author:"奥伦·星弦",source:"北地孤峰",text:["（这封信没有寄出，就压在孤峰的一块石头下面。风替你找到了它。）","告诉洛：塔他没看错人。星徽他戴着，合适。","告诉那个年轻人：路是试出来的。一百三十二条都断了，第一百三十三条，可能就在脚下。","灯没灭。它只是换了个地方亮。","——奥伦，孤峰顶"],hint:"石头下压着的纸，边缘被风磨得发毛。"};
}

/* ---- 图鉴挂载：人物志入口 + 现世动态（v53_strongBody 内 return h 前） ---- */

    h+=window.v56_livingBtn?window.v56_livingBtn():"";
    var nbrd=window.v56_noticeBoard?v56_noticeBoard():"";
    if(nbrd) h+="<div style='margin:8px 0 4px'><div style='font-size:12px;color:var(--dim)'>现世动态</div>"+nbrd+"</div>";
      h+="<div style='font-size:11px;color:var(--dim)'>"+fo.note+"<br/>招牌强者："+anchors.join("、")+"</div></div>";
    }
    return h;
  }catch(e){ return "<div style='color:var(--dim);font-size:13px'>强者谱暂不可用。</div>"; }
};
window.v53_peekStrong = function(id){
  try{
    var f=v53_findStrong(id); if(!f) return;
    var r=f.row;
    var known=!!(S.knownStrong&&S.knownStrong[id]);
    if(!known){
      if(window.v44_pushToast) v44_pushToast('名声未闻','你还没听说过这位强者的名号','info','🌫️');
      return;
    }
    if(!window.openModal||!window.elFromHtml) return;
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>"+(r.title?r.title+"·":"")+r.cn+"</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:60vh;overflow:auto'>";
    h+="<div style='font-size:13px;color:var(--dim);margin-bottom:6px'>"+(r.power||f.job)+" · "+(r.realm===6?"传奇境":r.realm===5?"大宗师境":f.job)+"</div>";
    if(r.desc) h+="<div style='font-size:13px;margin-bottom:6px'>"+v53_esc(r.desc)+"</div>";
    if(r.story) h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>"+v53_esc(r.story)+"</div>";
    if(r.rumor) h+="<div style='font-size:12px;color:#3a6ea8;margin-bottom:6px'>传闻："+v53_esc(r.rumor)+"</div>";
    var w=(f.row&&f.row.will)||null;
    if(w){
      var kind=window.v53_willKind?v53_willKind(id):(w.kind||"随缘");
      h+="<div style='font-size:12px;color:#7a5a8a;margin-bottom:6px'>对神座："+kind+"。"+(w.why||"")+"</div>";
    }
    var bond=S.strongBond&&S.strongBond[id]?S.strongBond[id]:0;
    if(bond>0) h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>你们交情不浅（亲密度 "+bond+"）。</div>";
    h+="<div style='display:flex;gap:6px;flex-wrap:wrap;margin-top:8px'>";
    h+="<button class='opt' onclick='v53_bondGift(\""+id+"\")'>交好 · 150金</button>";
    if(r.realm>=5&&r.id.indexOf("lv_")===0&&r.id!=="lv_hermit"&&r.id!=="lv_drift"&&r.id!=="lv_beast"&&r.id!=="lv_隐世"&&r.id!=="lv_散人"&&r.id!=="lv_兽王"){
      h+="<button class='opt opt-combat' onclick='v53_challengeStrong(\""+id+"\")'>挑战</button>";
    }
    h+="<button class='opt' onclick='closePanel()'>离去</button>";
    h+="</div></div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};
window.v53_syncDeity = function(){
  try{
    var P=window.PEERS_V53||{};
    var job=S.job||"";
    if(P[job]&&P[job].deity){ P[job].deity.status="在位"; P[job].deity.holder="（你）"; P[job].deity.note="神座有人——是你。"; }
  }catch(e){}
};
window.v53_openStrong = function(){
  try{
    if(window.openModal&&window.elFromHtml) openModal(elFromHtml(window.v53_strongBody()));
  }catch(e){}
};
window.v53_strongBody=v53_strongBody;
window.v53_peekStrong=v53_peekStrong;
window.v53_theomachy=v53_theomachy;
window.v53_runTheomachy=v53_runTheomachy;
window.v53_guardian=v53_guardian;
window.v53_pickGuardian=v53_pickGuardian;
window.v53_challengeStrong=v53_challengeStrong;
window.v53_bondGift=v53_bondGift;
window.v53_witnessFall=v53_witnessFall;
window.v53_meetStrong=v53_meetStrong;
window.v53_guardianBonus=v53_guardianBonus;
window.v53_willMod=v53_willMod;
window.v53_willKind=v53_willKind;
window.v53_rumorAfterWrite=v53_rumorAfterWrite;
window.v53_unlockStrongReading=v53_unlockStrongReading;
/* ---- 11. writeNext 包装：传闻钩子 ---- */
(function(){
  try{
    if(typeof writeNext!=="function") return;
    var _prev=writeNext;
    writeNext=function(){
      var out=_prev.apply(this,arguments);
      try{ window.v53_rumorAfterWrite(); }catch(e){}
      return out;
    };
  }catch(e){}
})();
}catch(e){ try{ console.error("v53 engine:", e); }catch(_){} }
})();

/* ===== /v56inj:engine ===== */
(function(){ try{
/* ---- 1. 强者活态档案（内容在 v56inj:life 填充） ---- */
window.STRONG_LIFE_V56 = window.STRONG_LIFE_V56 || {};
/* ---- 2. 强者间关系网（内容在 v56inj:rel 填充） ---- */
window.RELATIONS_V56 = window.RELATIONS_V56 || [];
/* ---- 3. 强者间动态事件（内容在 v56inj:rel 填充） ---- */
window.STRONG_EVENTS_V56 = window.STRONG_EVENTS_V56 || [];
/* ---- 4. 对话内容（内容在 v56inj:talk 填充） ---- */
window.TALK_V56 = window.TALK_V56 || {};

/* ---- 5. 兜底 ---- */
window.v56_ensureDefaults = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.v55_ensureDefaults) v55_ensureDefaults();
    if(!S.strongLife) S.strongLife={};
    if(!S.strongRel) S.strongRel={};
    if(!S.strongChat) S.strongChat={};
    if(!S.strongDeeds) S.strongDeeds={};
  }catch(e){}
};

/* ---- 6. 查找强者（兼容 v53_findStrong，窗口挂载） ---- */
window.v56_findStrong = function(id){
  try{
    var M=window.STRONG_V53||{};
    for(var job in M){
      var o=M[job]; if(!o) continue;
      var lists=[o.legend,o.master,o.raceSp,o.abyss];
      for(var i=0;i<lists.length;i++){
        var L=lists[i]||[];
        for(var j=0;j<L.length;j++){ if(L[j]&&L[j].id===id) return {job:job,row:L[j],kind:i}; }
      }
      if(o.deity&&o.deity.id===id) return {job:job,row:o.deity,kind:'deity'};
      if(o.special&&o.special.length){ for(var k=0;k<o.special.length;k++){ if(o.special[k]&&o.special[k].id===id) return {job:job,row:o.special[k],kind:'special'}; } }
    }
    var R=(typeof RIVALS_V52!=="undefined"?RIVALS_V52:(window.RIVALS_V52||{}));
    for(var jb in R){
      var rr=(R[jb]||{}).rivals||[];
      for(var x=0;x<rr.length;x++){ if(rr[x]&&rr[x].id===id) return {job:jb,row:rr[x],kind:'rival'}; }
    }
    var theo=window.THEOMACHY_V53||(typeof THEOMACHY_V53!=="undefined"?THEOMACHY_V53:{});
    for(var tk in theo){
      var to=theo[tk];
      if(to&&(to.id===id||(to.rival&&to.rival.id===id))) return {job:to.job||tk,row:to.id===id?to:to.rival,kind:'theo'};
    }
    return null;
  }catch(e){ return null; }
};
window.v56_esc = function(t){
  try{ return String(t==null?"":t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }catch(e){ return ""; }
};
window.v56_row = function(id){
  try{ var f=v56_findStrong(id); return f?f.row:null; }catch(e){ return null; }
};

/* ---- 7. 行踪与心境（StrongLifeKit） ---- */
window.v56_life = function(id){
  try{
    v56_ensureDefaults();
    var L=window.STRONG_LIFE_V56||{};
    var base=L[id]||null;
    var st=S.strongLife[id]||null;
    if(!st){
      st={pos:(base?base.baseWhere:"unknown"), task:"常驻", mood:(base?base.mood:"平和"), since:0, away:false};
      S.strongLife[id]=st;
    }
    return {base:base, st:st};
  }catch(e){ return {base:null, st:null}; }
};

/* 行踪状态机：按性格+日程分配 */
window.v56_pickTask = function(id){
  try{
    var base=(window.STRONG_LIFE_V56||{})[id]||{};
    var per=(base.personality||[]).join("");
    var pool=["常驻"];
    if(/战|烈|执/.test(per)) pool.push("征战","巡游");
    if(/静|守|淡/.test(per)) pool.push("闭关","隐居");
    if(/商|算|网/.test(per)) pool.push("经商");
    if(/圣|信|慈/.test(per)) pool.push("布道");
    if(/野|风|林/.test(per)) pool.push("巡游");
    if(/影|暗/.test(per)) pool.push("巡游");
    pool.push("巡游","闭关","常驻");
    return pool[Math.floor(Math.random()*pool.length)];
  }catch(e){ return "常驻"; }
};

/* 每 7 天结算（worldTick 挂载） */
window.v56_tickStrong = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    v56_ensureDefaults();
    var d=(S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:(S.day||0);
    var L=window.STRONG_LIFE_V56||{};
    for(var id in L){
      var o=v56_life(id); if(!o.base) continue;
      var st=o.st;
      if(d - (st.since||0) >= 7 || !st.since){
        st.since = d;
        var roll=Math.random();
        if(roll<0.45){
          st.task=v56_pickTask(id);
          st.pos = (st.task==="常驻")?o.base.baseWhere:o.base.baseWhere;
          st.away = (st.task==="巡游"||st.task==="征战")&&Math.random()<0.5;
        }
        /* 心境：随势力/事件微动 */
        if(Math.random()<0.3){
          var cur=st.mood||"平和";
          var moods=["平和","忧虑","激昂","沉郁"];
          var mi=moods.indexOf(cur);
          if(mi>=0){ var d2=Math.floor(Math.random()*3)-1; mi=Math.max(0,Math.min(3,mi+d2)); st.mood=moods[mi]; }
        }
      }
    }
    /* 强者间动态事件（v56 事件入 missedEvents，v46 补偿器回收） */
    var evs=window.STRONG_EVENTS_V56||[];
    for(var e=0;e<evs.length;e++){
      var ev=evs[e];
      if(!ev||!ev.day) continue;
      var key='se56_'+ev.id;
      if(!S.worldHeard) S.worldHeard={};
      if(d>=ev.day&&!S.worldHeard[key]){
        S.worldHeard[key]=true;
        if(!S.missedEvents) S.missedEvents=[];
        var dup=false;
        for(var q=0;q<S.missedEvents.length;q++){ if(S.missedEvents[q].key===key){ dup=true; break; } }
        if(!dup) S.missedEvents.push({key:key, desc:ev.text?ev.text[0]:(ev.note||"")});
        /* 效果落地 */
        if(ev.effect&&window.worldDelta) { try{ worldDelta(ev.effect.force, ev.effect.delta||0); }catch(e2){} }
      }
    }
  }catch(e){}
};

window.v56_where = function(id){
  try{ var o=v56_life(id); if(!o.st) return "行踪不明"; return o.st.pos||"行踪不明"; }catch(e){ return "行踪不明"; }
};

/* 玩家同城偶遇判定：位置匹配 */
window.v56_meetChance = function(id, locText){
  try{
    var o=v56_life(id); if(!o.st) return false;
    if(o.st.away) return false;
    var loc = locText||(typeof curLoc==='function'?curLoc():'')||(S&&S.loc?S.loc:'');
    var pos=o.st.pos||"";
    if(!pos||pos==="unknown") return false;
    if(typeof loc==='string'&&loc.indexOf(pos)>=0) return true;
    /* 别名表兜底 */
    var alias={
      "交汇城":["free_city","自由城邦","交汇"],
      "圣城":["holy_city","教廷","圣城"],
      "铁门关":["iron_pass","北境","铁门"],
      "南方港城":["south_port","港城","南方"],
      "银叶城":["silver_leaf","精灵"],
      "铁峰堡":["ironpeak","矮人"],
      "兽人王庭":["orc_homeland","兽人","草原"],
      "艾尔达学院":["elda_academy","学院"]
    };
    var al=alias[pos]||[];
    for(var i=0;i<al.length;i++){ if(loc.indexOf(al[i])>=0) return true; }
    return false;
  }catch(e){ return false; }
};

/* ---- 8. 关系偏置：玩家与A交好→A的宿敌对玩家冷淡 ---- */
window.v56_bondBias = function(id){
  try{
    v56_ensureDefaults();
    var R=window.RELATIONS_V56||[];
    var bias=0;
    for(var i=0;i<R.length;i++){
      var e=R[i]; if(!e) continue;
      var other=null;
      if(e.a===id) other=e.b; else if(e.b===id) other=e.a;
      if(!other) continue;
      var b=S.strongBond&&S.strongBond[other]?S.strongBond[other]:0;
      if(b>=3&&(e.type==="宿敌"||e.type==="世仇")) bias-=Math.min(3,Math.floor(b/3));
      if(b>=3&&(e.type==="挚友"||e.type==="师徒")) bias+=Math.min(2,Math.floor(b/4));
    }
    return bias;
  }catch(e){ return 0; }
};

/* ---- 9. 理念偏置：道德双轴 × 强者信仰 ---- */
window.v56_faithBias = function(id){
  try{
    v56_ensureDefaults();
    var base=(window.STRONG_LIFE_V56||{})[id]||{};
    var faith=base.faith||"";
    var div=(S.divinity!=null?S.divinity:(S.attrs&&S.attrs.DIV!=null?S.attrs.DIV:0))||0;
    var cor=S.corruption||0;
    var bias=0;
    if(faith.indexOf("神")>=0||faith.indexOf("圣")>=0){ if(div>=20) bias+=2; if(div<=-20) bias-=2; }
    if(faith.indexOf("秩序")>=0||faith.indexOf("守")>=0){ if(div>=10) bias+=1; if(div<=-10) bias-=1; }
    if(faith.indexOf("自由")>=0||faith.indexOf("野")>=0){ if(div<=-10) bias+=1; }
    if(faith.indexOf("游离")>=0) return 0;
    /* 深渊联动 */
    if(cor>=30&&faith.indexOf("深渊")>=0) bias+=2;
    if(cor>=30&&faith.indexOf("深渊")<0) bias-=1;
    return bias;
  }catch(e){ return 0; }
};

/* ---- 10. 记忆（S.strongDeeds） ---- */
window.v56_deed = function(id, kind, n){
  try{
    v56_ensureDefaults();
    if(!S.strongDeeds[id]) S.strongDeeds[id]={help:0,harm:0,challenge:0,bondGift:0,lastDay:0};
    var o=S.strongDeeds[id];
    if(kind==="help") o.help+=n||1;
    if(kind==="harm") o.harm+=n||1;
    if(kind==="challenge") o.challenge+=n||1;
    if(kind==="bondGift") o.bondGift+=n||1;
    o.lastDay=(S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:(S.day||0);
  }catch(e){}
};

/* ---- 11. 对话系统 ---- */
window.v56_talk = function(id, topic){
  try{
    v56_ensureDefaults();
    var T=window.TALK_V56||{};
    var pool=(T[id]&&T[id][topic])||null;
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row; var o=v56_life(id);
    var mood=(o.st&&o.st.mood)?o.st.mood:"平和";
    if(!pool||!pool.length){
      if(window.v44_pushToast) v44_pushToast('沉默', r.cn+'只是看了你一眼，没接话','info','🌫️');
      return;
    }
    var line=pool[Math.floor(Math.random()*pool.length)];
    /* 心境前缀 */
    var pre="";
    if(mood==="忧虑") pre="（眉间压着事）";
    else if(mood==="激昂") pre="（语气带着热气）";
    else if(mood==="沉郁") pre="（声音低了几分）";
    else if(mood==="暴戾") pre="（视线压过来）";
    /* 记忆回响 */
    var deeds=S.strongDeeds&&S.strongDeeds[id]?S.strongDeeds[id]:null;
    var mem="";
    if(deeds&&deeds.help>0) mem="你上次帮过我。";
    else if(deeds&&deeds.harm>0) mem="你做过的事，我记得。";
    if(window.writePar) writePar("","noind");
    if(window.writePar) writePar("── 与 "+r.cn+" 交谈 · "+("问"+(topic==="理念"?"理念":topic==="传闻"?"传闻":topic==="修行"?"修行":"闲聊"))+" ──","noind flagline");
    if(window.writePar) writePar(pre+line,"narration");
    if(mem&&window.writePar) writePar("（"+mem+"）","inner-voice");
    /* 好感微调 */
    if(topic==="理念"){
      var fb=window.v56_faithBias?v56_faithBias(id):0;
      if(fb>0&&window.v44_pushToast) v44_pushToast('理念相合',r.cn+'点了点头','success','✨');
      if(fb<0&&window.v44_pushToast) v44_pushToast('理念相左',r.cn+'沉默了','info','🌫️');
    }
  }catch(e){}
};

/* ---- 12. 赠礼（按爱好） ---- */
window.v56_gift = function(id, item){
  try{
    v56_ensureDefaults();
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    var base=(window.STRONG_LIFE_V56||{})[id]||{};
    var hobs=base.hobby||[];
    var cost=80;
    if((S.coin||0)<cost){ if(window.v44_pushToast) v44_pushToast('囊中羞涩','需要 80 金币准备礼物','warn','💰'); return; }
    S.coin-=cost;
    var hit=false;
    for(var i=0;i<hobs.length;i++){ if(item&&hobs[i].indexOf(item)>=0){ hit=true; break; } }
    if(!S.strongBond) S.strongBond={};
    var gain=hit?2:0;
    if(hit){ S.strongBond[id]=(S.strongBond[id]||0)+gain; v56_deed(id,"bondGift",1); }
    if(window.writePar){
      writePar("","noind");
      writePar("── 赠礼 · "+r.cn+" ──","noind flagline");
      if(hit) writePar("你送的东西，正合他（她）的心意。他（她）收下了，态度松了几分。","narration");
      else writePar("你送的东西，他（她）收下了，但没有多看一眼——不是心意不好，是没送到点上。","narration");
    }
    if(window.v44_pushToast) v44_pushToast(hit?'投其所好':'礼物收下', hit?('交情 +'+gain):'未达心意', hit?'success':'info', '🎁');
  }catch(e){}
};

/* ---- 13. 委托 ---- */
window.v56_quest = function(id){
  try{
    v56_ensureDefaults();
    var Q=window.QUEST_V56||{};
    var q=Q[id]||null;
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    if(!q){
      if(window.v44_pushToast) v44_pushToast('无委托', r.cn+'摆摆手：现在没什么要托付的','info','📜');
      return;
    }
    if(!S.strongChat) S.strongChat={};
    if(S.strongChat[id+"_q"]){
      if(window.v44_pushToast) v44_pushToast('已有委托', '你已接过他（她）的委托','info','📜');
      return;
    }
    S.strongChat[id+"_q"]=true;
    if(window.writePar){
      writePar("","noind");
      writePar("── 委托 · "+r.cn+" ──","noind flagline");
      writePar(q.tip,"narration");
    }
    if(window.v44_pushToast) v44_pushToast('接受委托', q.title||'一件事', 'info', '📜');
  }catch(e){}
};

/* ---- 14. 委托完成（复用 v46 任务完成挂点，玩家在选项里调） ---- */
window.v56_questDone = function(id){
  try{
    v56_ensureDefaults();
    var Q=window.QUEST_V56||{};
    var q=Q[id]||null;
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    if(!q||!S.strongChat) return;
    var k=id+"_q";
    if(!S.strongChat[k]) return;
    S.strongChat[k]=false;
    if(!S.strongBond) S.strongBond={};
    S.strongBond[id]=(S.strongBond[id]||0)+3;
    v56_deed(id,"help",1);
    if(window.v44_pushToast) v44_pushToast('委托完成', r.cn+'道了谢，交情 +3','success','🤝');
    if(q.reward&&window.v45_unlockReading&&q.reward.reading){ try{ v45_unlockReading(q.reward.reading); }catch(e){} }
  }catch(e){}
};

/* ---- 15. 图鉴 · 人物志视图（强者谱内新增 tab 内容） ---- */
window.v56_livingBody = function(){
  try{
    var S53=window.STRONG_V53||{};
    var L=window.STRONG_LIFE_V56||{};
    var h="<div style='font-size:13px;color:var(--dim);margin-bottom:8px'>强者也在过日子。推进时间，他们会行走、会爱恨、会记得你做过的事。</div>";
    var rows=[];
    for(var job in S53){
      var o=S53[job]; if(!o) continue;
      var lists=[o.legend,o.master,o.raceSp];
      for(var i=0;i<lists.length;i++){
        var arr=lists[i]||[];
        for(var j=0;j<arr.length;j++){
          var r=arr[j]; if(!r) continue;
          var known=!!(S.knownStrong&&S.knownStrong[r.id]);
          if(!known) continue;
          var life=L[r.id]||null;
          var st=S.strongLife&&S.strongLife[r.id]?S.strongLife[r.id]:null;
          var bond=S.strongBond&&S.strongBond[r.id]?S.strongBond[r.id]:0;
          rows.push({id:r.id, cn:r.cn, title:r.title, job:job, realm:r.realm, power:r.power, life:life, st:st, bond:bond});
        }
      }
    }
    rows.sort(function(a,b){ return (b.realm||0)-(a.realm||0); });
    for(var k=0;k<rows.length;k++){
      var it=rows[k];
      var nm=(it.title?it.title+"·":"")+it.cn;
      var where=it.st?(it.st.pos||"行踪不明"):"行踪不明";
      var mood=it.st?(it.st.mood||"平和"):"平和";
      var hb=it.life?(it.life.hobby||[]).join("、"):"—";
      h+="<div class='achievement-card' style='margin-bottom:6px;cursor:pointer' onclick='v56_peekCard(\""+it.id+"\")'>";
      h+="<div class='achievement-name'>"+nm+" <span style='font-size:10px;color:var(--dim);font-weight:normal'>"+(it.realm===6?"传奇境":it.realm===5?"大宗师境":it.job)+"</span></div>";
      h+="<div style='font-size:11px;color:var(--dim)'>此刻在 "+where+" · 心境："+mood+(it.bond>0?" · 交情 "+it.bond:"")+"</div>";
      if(it.life&&it.life.motto) h+="<div style='font-size:11px;color:var(--text-gold2)'>「"+it.life.motto+"」</div>";
      h+="</div>";
    }
    if(!rows.length) h+="<div style='font-size:13px;color:var(--dim)'>你还没听说过任何强者之名。去酒馆坐坐，传闻会告诉你这个世界住着谁。</div>";
    return h;
  }catch(e){ return "<div style='color:var(--dim);font-size:13px'>人物志暂不可用。</div>"; }
};

/* ---- 16. 人物卡（活态版） ---- */
window.v56_peekCard = function(id){
  try{
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    var known=!!(S.knownStrong&&S.knownStrong[id]);
    if(!known){ if(window.v44_pushToast) v44_pushToast('名声未闻','你还没听说过这位强者','info','🌫️'); return; }
    if(!window.openModal||!window.elFromHtml) return;
    var base=(window.STRONG_LIFE_V56||{})[id]||{};
    var o=v56_life(id); var st=o.st||{};
    var where=st.pos||"行踪不明"; var mood=st.mood||"平和"; var task=st.task||"常驻";
    var bond=S.strongBond&&S.strongBond[id]?S.strongBond[id]:0;
    var deeds=S.strongDeeds&&S.strongDeeds[id]?S.strongDeeds[id]:null;
    var w=(window.WILL_TO_ASCEND_V53||{})[id];
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>"+(r.title?r.title+"·":"")+r.cn+"</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:62vh;overflow:auto'>";
    h+="<div style='font-size:13px;color:var(--dim);margin-bottom:6px'>"+(r.power||f.job)+"</div>";
    if(r.desc) h+="<div style='font-size:13px;margin-bottom:6px'>"+v56_esc(r.desc)+"</div>";
    /* 活态档案 */
    if(base.personality||base.hobby||base.faith){
      h+="<div style='font-size:12px;color:var(--dim);margin:6px 0'>";
      if(base.personality&&base.personality.length) h+="性格："+base.personality.join("、")+"<br/>";
      if(base.hobby&&base.hobby.length) h+="爱好："+base.hobby.join("、")+"<br/>";
      if(base.faith) h+="信着："+base.faith+"<br/>";
      if(base.motto) h+="口头禅：「"+base.motto+"」";
      h+="</div>";
    }
    /* 行踪与心境 */
    h+="<div style='font-size:12px;color:#3a6ea8;margin:6px 0'>此刻在 "+where+" · 正在"+task+" · 心境："+mood+"</div>";
    if(base.routine) h+="<div style='font-size:11px;color:var(--dim);margin-bottom:6px'>平日："+base.routine+"</div>";
    if(w){
      var kind=window.v53_willKind?v53_willKind(id):"随缘";
      h+="<div style='font-size:12px;color:#7a5a8a;margin-bottom:6px'>对神座："+kind+"。"+(w.why||"")+"</div>";
    }
    if(bond>0) h+="<div style='font-size:12px;color:var(--dim);margin-bottom:6px'>你们交情不浅（亲密度 "+bond+"）。</div>";
    if(deeds&&(deeds.help||deeds.harm||deeds.challenge)){
      var dl=[];
      if(deeds.help) dl.push("受过你"+deeds.help+"次相助");
      if(deeds.harm) dl.push("被你伤过"+deeds.harm+"次");
      if(deeds.challenge) dl.push("与你交手"+deeds.challenge+"次");
      h+="<div style='font-size:11px;color:var(--dim);margin-bottom:6px'>他（她）记得："+dl.join("、")+"。</div>";
    }
    /* 互动 */
    h+="<div style='display:flex;gap:6px;flex-wrap:wrap;margin-top:8px'>";
    h+="<button class='opt' onclick='v56_talkModal(\""+id+"\")'>交谈</button>";
    h+="<button class='opt' onclick='v56_giftModal(\""+id+"\")'>赠礼 · 80金</button>";
    if(r.realm>=5&&r.id.indexOf("lv_")===0&&r.id!=="lv_隐世"&&r.id!=="lv_散人"&&r.id!=="lv_兽王"){
      h+="<button class='opt' onclick='v53_challengeStrong(\""+id+"\")'>挑战</button>";
    }
    if(r.realm>=5&&(S.realm||0)>=2) h+="<button class='opt' onclick='v53_pickGuardian(\""+id+"\")'>请护法</button>";
    h+="<button class='opt' onclick='v56_quest(\""+id+"\")'>听委托</button>";
    h+="<button class='opt' onclick='v56_bondGift(\""+id+"\")'>交好 · 150金</button>";
    h+="<button class='opt' onclick='closePanel()'>离去</button>";
    h+="</div>";
    /* 关系网 */
    var rels=v56_relsOf(id);
    if(rels&&rels.length){
      var relSvg=window.v56_relsSvg?v56_relsSvg(id):"";
      if(relSvg) h+="<div style='margin:8px 0'><div style='font-size:12px;color:var(--dim);margin-bottom:4px'>关系网</div>"+relSvg+"</div>";
      h+="<div style='font-size:13px;font-weight:bold;color:var(--text-gold2);margin:10px 0 4px'>恩怨</div>";
      for(var q=0;q<rels.length;q++){
        var e=rels[q];
        var other=(e.a===id)?e.b:e.a;
        var of=v56_findStrong(other);
        var on=of?(of.row.title?of.row.title+"·":"")+of.row.cn:other;
        var col=e.type==="宿敌"?"#b04030":e.type==="世仇"?"#5a3a2a":e.type==="挚友"?"#3a7a3a":e.type==="恋人"?"#a85a7a":e.type==="师徒"?"#3a6ea8":"#6a5a3a";
        h+="<div style='font-size:12px;margin:2px 0'><span style='color:"+col+"'>"+e.type+"</span> · "+on+" —— "+(e.note||"")+"</div>";
      }
    }
    h+="</div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};

/* ---- 17. 关系网查询 ---- */
window.v56_relsOf = function(id){
  try{
    var R=window.RELATIONS_V56||[];
    var out=[];
    for(var i=0;i<R.length;i++){ var e=R[i]; if(e&&(e.a===id||e.b===id)) out.push(e); }
    return out;
  }catch(e){ return []; }
};

/* ---- 17b. 关系网 SVG 子视图 ---- */
window.v56_relsSvg = function(id){
  try{
    var R=window.RELATIONS_V56||[];
    var nodes=[]; var seen={};
    var edges=[];
    var CENTER=id;
    seen[CENTER]=true;
    for(var i=0;i<R.length;i++){
      var e=R[i];
      if(!e) continue;
      if(e.a===id||e.b===id){
        var other=(e.a===id)?e.b:e.a;
        edges.push({a:CENTER,b:other,type:e.type,note:e.note||""});
        if(!seen[other]){ seen[other]=true; nodes.push(other); }
      }
    }
    if(!nodes.length) return "";
    var W=460, H=Math.max(120, 72+Math.ceil(nodes.length/3)*46);
    var cx=70, cy=H/2;
    var cols=Math.ceil(nodes.length/3); var colsN=Math.min(3,Math.max(1,cols));
    var pos={};
    pos[CENTER]={x:60,y:cy};
    var x0=160, span=Math.min(120,(W-x0-30)/colsN);
    var y0=30, ygap=Math.min(46,(H-60)/(Math.ceil(nodes.length/colsN)||1));
    for(var n=0;n<nodes.length;n++){
      var col=n%colsN, row=Math.floor(n/colsN);
      pos[nodes[n]]={x:x0+col*span+ (col%2===1?20:0), y:y0+row*ygap};
    }
    var colMap={"宿敌":"#b04030","世仇":"#5a3a2a","挚友":"#3a7a3a","恋人":"#a85a7a","师徒":"#3a6ea8","同门":"#7a5a8a"};
    var h="<svg viewBox='0 0 "+W+" "+H+"' style='width:100%;height:auto;max-height:280px;background:rgba(139,111,71,.05);border-radius:8px' xmlns='http://www.w3.org/2000/svg'>";
    for(var e2=0;e2<edges.length;e2++){
      var ed=edges[e2];
      var pa=pos[ed.a], pb=pos[ed.b];
      var c=colMap[ed.type]||"#8b6f47";
      h+="<line x1='"+pa.x+"' y1='"+pa.y+"' x2='"+pb.x+"' y2='"+pb.y+"' stroke='"+c+"' stroke-width='1.6' stroke-dasharray='"+(ed.type==="宿敌"||ed.type==="世仇"?"5,4":"none")+"'/>";
    }
    /* 中心节点 */
    var f=v56_findStrong(id);
    var cn=f&&f.row?f.row.cn:id;
    h+="<circle cx='"+pos[CENTER].x+"' cy='"+pos[CENTER].y+"' r='22' fill='#8b6f47'/>";
    h+="<text x='"+pos[CENTER].x+"' y='"+(pos[CENTER].y+4)+"' text-anchor='middle' fill='#fff' font-size='11'>"+cn.slice(0,4)+"</text>";
    for(var m=0;m<nodes.length;m++){
      var nid=nodes[m]; var p=pos[nid];
      var of=v56_findStrong(nid);
      var on=of?(of.row.title?of.row.title+"·":"")+of.row.cn:nid;
      var label=on.length>5?on.slice(0,5)+"…":on;
      h+="<circle cx='"+p.x+"' cy='"+p.y+"' r='16' fill='#f4ede0' stroke='#8b6f47' stroke-width='1.2'/>";
      h+="<text x='"+p.x+"' y='"+(p.y+4)+"' text-anchor='middle' fill='#4a3a22' font-size='10'>"+label+"</text>";
    }
    h+="</svg>";
    /* 图例 */
    var leg=["师徒 蓝","挚友 绿","宿敌 红","恋人 粉","同门 紫","世仇 黑虚"];
    h+="<div style='font-size:10px;color:var(--dim);margin-top:4px'>"+leg.join(" · ")+"</div>";
    return h;
  }catch(e){ return ""; }
};

/* ---- 18. 交谈面板 ---- */
window.v56_talkModal = function(id){
  try{
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    if(!window.openModal||!window.elFromHtml) return;
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>与 "+r.cn+" 交谈</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:50vh;overflow:auto'>";
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:8px'>问点他（她）在乎的事。说的对不对胃口，他（她）都听得出来。</div>";
    h+="<button class='opt' style='width:100%;margin:4px 0' onclick='v56_talk(\""+id+"\",\"理念\");closePanel()'>问理念 · 他（她）信什么</button>";
    h+="<button class='opt' style='width:100%;margin:4px 0' onclick='v56_talk(\""+id+"\",\"传闻\");closePanel()'>问传闻 · 最近有什么事</button>";
    h+="<button class='opt' style='width:100%;margin:4px 0' onclick='v56_talk(\""+id+"\",\"修行\");closePanel()'>问修行 · 这条路怎么走</button>";
    h+="<button class='opt' style='width:100%;margin:4px 0' onclick='v56_talk(\""+id+"\",\"闲聊\");closePanel()'>闲聊 · 不为什么</button>";
    h+="<button class='opt opt-combat' style='width:100%;margin:4px 0' onclick='closePanel()'>离去</button>";
    h+="</div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};

/* ---- 19. 赠礼面板 ---- */
window.v56_giftModal = function(id){
  try{
    var f=v56_findStrong(id); if(!f) return;
    var r=f.row;
    var base=(window.STRONG_LIFE_V56||{})[id]||{};
    var hobs=base.hobby||[];
    if(!window.openModal||!window.elFromHtml) return;
    var h="<div class='panel-wrap'><div class='panel-header'><span class='panel-title'>赠礼 · "+r.cn+"</span><button class='panel-close' onclick='closePanel()'>✕</button></div><div class='achievement-body' style='max-height:50vh;overflow:auto'>";
    h+="<div style='font-size:12px;color:var(--dim);margin-bottom:8px'>送对心意，交情自深。他（她）偏爱："+(hobs.length?hobs.join("、"):"说不上来，随缘吧")+"。</div>";
    var gifts=[["观星","观星镜"],["旧卷宗","旧卷宗"],["火","一盒好火石"],["灯","一盏旧铜灯"],["酒","一坛陈酒"],["木","一段好木料"],["铁","一块精铁"],["碑","拓片"],["草","草药"],["秤","一架小天平"],["歌","一首歌"],["棋","一副棋"]];
    for(var i=0;i<gifts.length;i++){
      h+="<button class='opt' style='width:100%;margin:4px 0' onclick='v56_gift(\""+id+"\",\""+gifts[i][0]+"\");closePanel()'>送"+gifts[i][1]+"</button>";
    }
    h+="<button class='opt opt-combat' style='width:100%;margin:4px 0' onclick='closePanel()'>算了</button>";
    h+="</div></div>";
    openModal(elFromHtml(h));
  }catch(e){}
};

/* ---- 20. 交好（复用 v53 逻辑+记忆） ---- */
window.v56_bondGift = function(id){
  try{
    if(window.v53_bondGift) v53_bondGift(id);
    v56_deed(id,"bondGift",1);
  }catch(e){}
};

/* ---- 21. 告示板留痕（势力大城） ---- */
window.v56_noticeBoard = function(){
  try{
    var NB=window.NOTICE_V56||[];
    if(!NB.length) return "";
    var h="<div style='font-size:12px;color:var(--dim);margin-bottom:4px'>告示板 · 强者动向</div>";
    for(var i=0;i<NB.length;i++){
      var nb=NB[i]; if(!nb) continue;
      if(window.v56_where&&nb.id){
        var wh=v56_where(nb.id);
        if(wh==="行踪不明") continue;
        h+="<div style='font-size:11px;color:#3a6ea8;margin:2px 0'>· "+nb.text+"</div>";
      } else {
        h+="<div style='font-size:11px;color:#3a6ea8;margin:2px 0'>· "+nb.text+"</div>";
      }
    }
    return h;
  }catch(e){ return ""; }
};

/* ---- 22. 图鉴强者谱入口扩展：人物志 tab 按钮 ---- */
window.v56_livingBtn = function(){
  try{
    return "<div style='margin:10px 0 2px'><button class='opt' style='width:100%' onclick='v56_livingModal()'>人物志 · 强者活态</button></div>";
  }catch(e){ return ""; }
};
window.v56_livingModal = function(){
  try{
    if(window.openModal&&window.elFromHtml) openModal(elFromHtml(window.v56_livingBody()));
  }catch(e){}
};

/* ---- 23. 挂载 ---- */
window.v56_ensureDefaults=v56_ensureDefaults;
window.v56_tickStrong=v56_tickStrong;
window.v56_where=v56_where;
window.v56_meetChance=v56_meetChance;
window.v56_bondBias=v56_bondBias;
window.v56_faithBias=v56_faithBias;
window.v56_deed=v56_deed;
window.v56_talk=v56_talk;
window.v56_gift=v56_gift;
window.v56_quest=v56_quest;
window.v56_questDone=v56_questDone;
window.v56_livingBody=v56_livingBody;
window.v56_peekCard=v56_peekCard;
window.v56_talkModal=v56_talkModal;
window.v56_giftModal=v56_giftModal;
window.v56_bondGift=v56_bondGift;
window.v56_relsOf=v56_relsOf;
window.v56_livingBtn=v56_livingBtn;
window.v56_livingModal=v56_livingModal;
window.v56_noticeBoard=v56_noticeBoard;
}catch(e){ try{ console.error("v56 engine:", e); }catch(_){} }
})();

/*v56inj:life*/
/* ---- 活态档案（神/半神/挑战者/传奇/大宗师代表/种族特殊/深渊） ---- */
/* 神（不涉世俗，档案仅传说） */
STRONG_LIFE_V56["de_mage"]={id:"de_mage",personality:["超然","念旧"],hobby:["观星"],faith:"知识不该被埋进土里",motto:"坐上去不难，难的是记得自己是个人",routine:"陨落两千年，星落塔替他记着光线",baseWhere:"星落塔",mood:"平和",traits:{speak:"无声",taboo:"垄断知识",soft:"后来者"}};
STRONG_LIFE_V56["de_war"]={id:"de_war",personality:["不屈","刚烈"],hobby:["练旗"],faith:"旗不倒，就不算输",motto:"旗不倒，我就不算输",routine:"古战场旗杆立了三千年",baseWhere:"古战场",mood:"激昂",traits:{speak:"无声",taboo:"背对战场",soft:"挡刀的人"}};
STRONG_LIFE_V56["de_priest"]={id:"de_priest",personality:["沉静","守约"],hobby:["晨祷"],faith:"太阳照常升起",motto:"神可以迟到，晨祷不可以",routine:"静默殿的晨光里",baseWhere:"圣城",mood:"平和",traits:{speak:"无声",taboo:"背弃晨光",soft:"守夜的人"}};
STRONG_LIFE_V56["de_thief"]={id:"de_thief",personality:["无拘","孤高"],hobby:["偷名字"],faith:"暗影无神",motto:"我唯一不想偷的，是一个名字",routine:"祖师牌位空着，镜厅影子等着",baseWhere:"暗影阁",mood:"沉郁",traits:{speak:"无声",taboo:"留下名字",soft:"敢把不存在当名字的人"}};
STRONG_LIFE_V56["de_ranger"]={id:"de_ranger",personality:["野性","自由"],hobby:["走路"],faith:"路比神座长",motto:"神座只有一把椅子，路有无数条",routine:"神座空悬，树环缺一片叶",baseWhere:"荒野",mood:"平和",traits:{speak:"无声",taboo:"修路",soft:"走完所有路的人"}};
STRONG_LIFE_V56["de_knight"]={id:"de_knight",personality:["守诺","沉默"],hobby:["立誓"],faith:"誓约即神座",motto:"他把自己活成了那道誓约",routine:"旧圣坛的盾面指印",baseWhere:"旧圣坛",mood:"平和",traits:{speak:"无声",taboo:"破誓",soft:"说话算话的人"}};
STRONG_LIFE_V56["de_smith"]={id:"de_smith",personality:["匠气","孤注"],hobby:["打铁"],faith:"造物要对自己负责",motto:"他一辈子只铸过一件东西——自己",routine:"初火熔炉仍亮着",baseWhere:"铁峰堡",mood:"平和",traits:{speak:"无声",taboo:"铸邪器",soft:"炉火前的耐心"}};
STRONG_LIFE_V56["de_trade"]={id:"de_trade",personality:["公正","精明"],hobby:["称账"],faith:"天平不认人，认账",motto:"天平不认人，认账",routine:"金衡商会的总天平压着物价",baseWhere:"交汇城",mood:"平和",traits:{speak:"无声",taboo:"毁约",soft:"守信的人"}};
STRONG_LIFE_V56["de_soul"]={id:"de_soul",personality:["自省","孤行"],hobby:["照镜子"],faith:"没有神，就照自己",motto:"我还没把自己看透",routine:"回音之镜，三千年没碎",baseWhere:"晨曦圣殿",mood:"沉郁",traits:{speak:"无声",taboo:"触灵魂禁忌",soft:"敢看自己的人"}};
/* 半神与挑战者（rv_*，CN 取自 RIVALS_V52） */
STRONG_LIFE_V56["rv_mage_o"]={id:"rv_mage_o",personality:["孤高","求真"],hobby:["找真正的元素"],faith:"借来的力量不算力量",motto:"我找的东西，不在塔里",routine:"离塔十二年，在找一条没人走过的元素路",baseWhere:"北方",mood:"沉郁",traits:{speak:"话少，句句冷",taboo:"外物与捷径",soft:"自己走到这一步的人"}};
STRONG_LIFE_V56["rv_mage_v"]={id:"rv_mage_v",personality:["机敏","多疑"],hobby:["试药","观察人"],faith:"万事都要亲自试过才信",motto:"给别人试的，我不试",routine:"在圣城宫廷替人试药，也替自己留后路",baseWhere:"圣城",mood:"忧虑",traits:{speak:"话里有话",taboo:"没试过就下结论",soft:"坦诚的人"}};
STRONG_LIFE_V56["rv_war_r"]={id:"rv_war_r",personality:["豪烈","重情"],hobby:["喝酒","记兄弟名字"],faith:"每一道疤都记得一个名字",motto:"疤在，兄弟就在",routine:"北地佣兵之王，铁门关血战唯一生还者，常年在佣兵营地",baseWhere:"北方",mood:"激昂",traits:{speak:"大嗓门",taboo:"忘本",soft:"肯替兄弟挡刀的人"}};
STRONG_LIFE_V56["rv_war_b"]={id:"rv_war_b",personality:["固执","念父"],hobby:["磨刀"],faith:"刀断了，人不能断",motto:"刀断了，人不能断",routine:"蛮族第一勇士，带着父亲的断刀四处寻对手",baseWhere:"兽人王庭",mood:"沉郁",traits:{speak:"简短",taboo:"辱及先人",soft:"光明正大的对手"}};
STRONG_LIFE_V56["rv_priest_b"]={id:"rv_priest_b",personality:["悲悯","叛逆"],hobby:["读禁书"],faith:"宽恕比净化更难",motto:"主没有回答我，也许你就是答案",routine:"被流放的枢机，在边地替异端做弥撒",baseWhere:"南方",mood:"忧虑",traits:{speak:"温和而重",taboo:"赶尽杀绝",soft:"犹疑的人"}};
STRONG_LIFE_V56["rv_priest_s"]={id:"rv_priest_s",personality:["沉默","守约"],hobby:["守夜"],faith:"等一个她欠过的人",motto:"她从不先说，她等",routine:"守夜修女，二十年等一个人",baseWhere:"圣城",mood:"沉郁",traits:{speak:"几乎不说话",taboo:"催促",soft:"耐心的人"}};
STRONG_LIFE_V56["rv_soul_r"]={id:"rv_soul_r",personality:["决绝","寡言"],hobby:["看深渊"],faith:"灵魂的尽头有答案",motto:"他替圣殿守了三十年夜，最后一夜走进裂隙",routine:"独身在深渊裂隙边缘行走",baseWhere:"深渊裂隙",mood:"沉郁",traits:{speak:"极少",taboo:"被拦",soft:"同样决绝的人"}};
STRONG_LIFE_V56["rv_soul_w"]={id:"rv_soul_w",personality:["神秘","疏离"],hobby:["唱歌"],faith:"歌比名字长",motto:"她唱的歌没有词",routine:"流浪的灵媒，没人见过她的脸",baseWhere:"交汇城",mood:"平和",traits:{speak:"闭眼唱",taboo:"被看脸",soft:"不打听她的人"}};
STRONG_LIFE_V56["rv_trade_j"]={id:"rv_trade_j",personality:["圆滑","记仇"],hobby:["数钱","听消息"],faith:"钱能买到的，都是便宜的",motto:"笑的时候露出金牙",routine:"黑市之王，经手银两比三大商会总和还多",baseWhere:"交汇城",mood:"激昂",traits:{speak:"爱笑",taboo:"赖账",soft:"说话算话的人"}};
STRONG_LIFE_V56["rv_trade_y"]={id:"rv_trade_y",personality:["沉稳","远谋"],hobby:["看海"],faith:"看天吃饭，饭要自己盛",motto:"看天吃饭，但饭要自己盛",routine:"航运大亨，南方的船都欠他顺风",baseWhere:"南方港城",mood:"平和",traits:{speak:"慢条斯理",taboo:"冒险",soft:"稳当的人"}};
STRONG_LIFE_V56["rv_knight_j"]={id:"rv_knight_j",personality:["执拗","深情"],hobby:["守誓言"],faith:"一句誓言值得二十年",motto:"他守的那句誓言，是给一个人的",routine:"为守一句誓言独行二十年",baseWhere:"荒野",mood:"沉郁",traits:{speak:"轻声",taboo:"问誓言内容",soft:"重诺的人"}};
STRONG_LIFE_V56["rv_knight_s"]={id:"rv_knight_s",personality:["侠气","干脆"],hobby:["替人出头"],faith:"不收钱，收一句实话",motto:"她骑马时从不回头",routine:"巡游骑士，专替走投无路的人出头",baseWhere:"南方",mood:"激昂",traits:{speak:"爽快",taboo:"说谎",soft:"说实话的人"}};
STRONG_LIFE_V56["rv_ranger_k"]={id:"rv_ranger_k",personality:["孤僻","警觉"],hobby:["巡山"],faith:"山火之夜他懂了什么",motto:"他走时在木棍上留了一句话",routine:"山火之夜后不知所踪，偶尔在山道上出现",baseWhere:"荒野",mood:"忧虑",traits:{speak:"极少",taboo:"提山火",soft:"懂山的人"}};
STRONG_LIFE_V56["rv_ranger_l"]={id:"rv_ranger_l",personality:["仁厚","守界"],hobby:["看林子"],faith:"给林子留种",motto:"从不猎幼兽，那是给林子留的种",routine:"精灵猎手，一弓双矢巡护林缘",baseWhere:"银叶城",mood:"平和",traits:{speak:"平和",taboo:"滥猎",soft:"敬自然的人"}};
STRONG_LIFE_V56["rv_thief_y"]={id:"rv_thief_y",personality:["傲气","规矩"],hobby:["偷心"],faith:"偷过最贵的东西是一句话",motto:"她偷过王宫宝库，又还了回去",routine:"前阁主，传闻隐居在自由城邦",baseWhere:"交汇城",mood:"平和",traits:{speak:"带笑",taboo:"下作",soft:"有底线的人"}};
STRONG_LIFE_V56["rv_thief_g"]={id:"rv_thief_g",personality:["狡黠","重义"],hobby:["听消息"],faith:"消息是换命换来的",motto:"整个码头都是他的耳朵",routine:"线人王，蹲在码头听风",baseWhere:"南方港城",mood:"激昂",traits:{speak:"话密",taboo:"出卖",soft:"守口如瓶的人"}};
STRONG_LIFE_V56["rv_smith_g"]={id:"rv_smith_g",personality:["执拗","守旧"],hobby:["打铁"],faith:"炉火认人",motto:"炉火认人，不认招牌",routine:"隐入矿洞，偶尔出洞打一件铁",baseWhere:"铁峰堡",mood:"沉郁",traits:{speak:"闷",taboo:"浮夸",soft:"稳的人"}};
STRONG_LIFE_V56["rv_smith_a"]={id:"rv_smith_a",personality:["阴冷","精细"],hobby:["配药"],faith:"药比毒狠，毒比药准",motto:"她从不碰自己炼的东西",routine:"黑市炼金师，左手五色",baseWhere:"交汇城",mood:"沉郁",traits:{speak:"低语",taboo:"让她试药",soft:"不怕她的人"}};


/*v56inj:life2*/
/* ---- 传奇层 27（含兽王/隐世/散人） ---- */
STRONG_LIFE_V56["lv_mage1"]={id:"lv_mage1",personality:["通达","淡泊","念旧"],hobby:["教孩子认元素","看树叶转圈"],faith:"法术是为了让人记住为什么学",motto:"你为什么不争神座？",routine:"每天在老树下教精灵孩子认元素",baseWhere:"银叶城",mood:"平和",traits:{speak:"笑着说话",taboo:"催促",soft:"不急着赢的人"}};
STRONG_LIFE_V56["lv_mage2"]={id:"lv_mage2",personality:["克制","歉疚","守诺"],hobby:["观星","翻旧卷宗"],faith:"物归原主，才算完",motto:"这道法则，还能不能再刻一层",routine:"每年双子星升起的夜里失眠，站在观星台看星徽",baseWhere:"艾尔达学院",mood:"忧虑",traits:{speak:"话少而缓",taboo:"提奥伦·星弦",soft:"接得住星徽的人"}};
STRONG_LIFE_V56["lv_mage3"]={id:"lv_mage3",personality:["沉默","执拗","念旧"],hobby:["寻火"],faith:"火烧完了才算活过吗",motto:"火烧完了才算活过吗",routine:"四处寻找能点亮旧灯的火",baseWhere:"北方",mood:"沉郁",traits:{speak:"只讲短句",taboo:"问灯的来历",soft:"懂火的人"}};
STRONG_LIFE_V56["lv_mage4"]={id:"lv_mage4",personality:["温柔","守界","耐性"],hobby:["听风","守结界"],faith:"活得久一点，多听几遍风",motto:"树活一万年，我守它两百年",routine:"守着世界树外围结界，两百年没挪过",baseWhere:"银叶城",mood:"平和",traits:{speak:"轻而慢",taboo:"砍树",soft:"有耐心的人"}};
STRONG_LIFE_V56["lv_mage5"]={id:"lv_mage5",personality:["严谨","寡言","守秘"],hobby:["修档案"],faith:"七印的事，比神座要紧",motto:"先说好，看完要还",routine:"在守望者塔档案室整理七印卷宗",baseWhere:"圣城",mood:"忧虑",traits:{speak:"公事公办",taboo:"偷看那页空白",soft:"守得住秘密的人"}};
STRONG_LIFE_V56["lv_war1"]={id:"lv_war1",personality:["忠厚","沉稳","念人"],hobby:["擦盾","数凹痕"],faith:"盾是让别人敢往前走的",motto:"盾这东西，不是用来挡自己的",routine:"每天在城墙上擦盾，给新凹痕讲故事",baseWhere:"铁峰堡",mood:"平和",traits:{speak:"笑声很响",taboo:"拿矿工兄弟开玩笑",soft:"敢挡在前面的人"}};
STRONG_LIFE_V56["lv_war2"]={id:"lv_war2",personality:["豪迈","重情","直率"],hobby:["烤肉","找旧碑"],faith:"你敬狼，狼敬你",motto:"吃饱了，我们聊点比打仗重要的事",routine:"在草原上寻找兽人与人类的第一份和平条约",baseWhere:"兽人王庭",mood:"激昂",traits:{speak:"大声爽快",taboo:"羞辱草原",soft:"敬草原规矩的人"}};
STRONG_LIFE_V56["lv_war3"]={id:"lv_war3",personality:["刚毅","念旧","负重"],hobby:["守城头","刻木臂"],faith:"城在，我在",motto:"城在，我在",routine:"每晚睡在铁门关城头，木臂里藏着那张纸",baseWhere:"铁门关",mood:"激昂",traits:{speak:"吼着说",taboo:"问木臂里的名字",soft:"守得住的人"}};
STRONG_LIFE_V56["lv_war4"]={id:"lv_war4",personality:["疏离","通透","仁厚"],hobby:["独酌","练刀"],faith:"城守住了，商路就通",motto:"守城的人，心要凉一点",routine:"一个人喝酒，一个人练刀，接的单全是守城",baseWhere:"交汇城",mood:"沉郁",traits:{speak:"话少",taboo:"问他为什么不合群",soft:"守得住寂寞的人"}};
STRONG_LIFE_V56["lv_war5"]={id:"lv_war5",personality:["随性","豁达","念海"],hobby:["擦旧酒杯","听水手讲海"],faith:"打够了，就该过自己的日子",motto:"不打了不打了，我擦杯子呢",routine:"在南方港城开小酒馆，卖断江鱼",baseWhere:"南方港城",mood:"平和",traits:{speak:"笑呵呵",taboo:"喊他回去打仗",soft:"不打的人"}};
STRONG_LIFE_V56["lv_priest1"]={id:"lv_priest1",personality:["矛盾","深沉","自省"],hobby:["读禁书","忏悔"],faith:"圣光是唯一的路，可路上沾着泥",motto:"主没有回答我，也许你就是答案",routine:"每晚在祷告室读一页禁书，然后向神忏悔",baseWhere:"圣城",mood:"忧虑",traits:{speak:"每个字都像在称重",taboo:"当众问他的矛盾",soft:"肯犹豫的人"}};
STRONG_LIFE_V56["lv_priest2"]={id:"lv_priest2",personality:["静默","坚韧","守约"],hobby:["守烛"],faith:"夜记得每个人",motto:"这里没有神，只有夜",routine:"静默殿守夜长，三百年没离开过地下",baseWhere:"圣城",mood:"沉郁",traits:{speak:"声音很轻",taboo:"大声说话",soft:"坐得住的人"}};
STRONG_LIFE_V56["lv_priest3"]={id:"lv_priest3",personality:["温柔","坚定","跨界"],hobby:["点灯"],faith:"神不分种族，黑暗也不分",motto:"这盏灯，是替两种族的黑暗点的",routine:"在银叶城的小教堂替精灵做弥撒",baseWhere:"银叶城",mood:"平和",traits:{speak:"轻缓",taboo:"只认一种族",soft:"愿意走进来的人"}};
STRONG_LIFE_V56["lv_thief1"]={id:"lv_thief1",personality:["孤僻","守诺","锐利"],hobby:["还债"],faith:"这些是债，要还",motto:"跟着光走的人，看不见我",routine:"每年除夕去自由城邦旧钟楼，想还那件偷了三十年的东西",baseWhere:"交汇城",mood:"沉郁",traits:{speak:"隔着阴影说",taboo:"问他的脸",soft:"不偷的人"}};
STRONG_LIFE_V56["lv_thief2"]={id:"lv_thief2",personality:["圆滑","通透","两界"],hobby:["走商路"],faith:"影子比人长，路比脸多",motto:"别在雾天跟灰雾谈生意",routine:"白天行商，晚上灰雾，在两个世界之间讨生活",baseWhere:"交汇城",mood:"激昂",traits:{speak:"笑吟吟",taboo:"问她是人是影",soft:"不怕影子的人"}};
STRONG_LIFE_V56["lv_ranger1"]={id:"lv_ranger1",personality:["洒脱","追路","温和"],hobby:["吹叶笛","追风"],faith:"你追的不是鹿，是路",motto:"路不着急，你着急什么",routine:"一年里一半时间在路上，追那只白鹿的影子",baseWhere:"荒野",mood:"平和",traits:{speak:"带调子",taboo:"让她停下",soft:"肯上路的人"}};
STRONG_LIFE_V56["lv_ranger2"]={id:"lv_ranger2",personality:["硬气","孤行","警觉"],hobby:["打不该存在的猎物"],faith:"弓断了还能打",motto:"弓断了还能打——这是北方猎人的老话",routine:"在雪原深处猎杀不该存在的东西，背囊里留着最后一根弦",baseWhere:"北方",mood:"沉郁",traits:{speak:"短促",taboo:"动他的弓",soft:"稳的人"}};
STRONG_LIFE_V56["lv_knight1"]={id:"lv_knight1",personality:["守正","执拗","厚重"],hobby:["漆盾","按指印"],faith:"白，是因为我挡下的东西都不配留在上面",motto:"你进城，是想改变它，还是想利用它",routine:"守圣城三十年，把盾一次次漆成白色",baseWhere:"圣城",mood:"激昂",traits:{speak:"沉而稳",taboo:"让他后退",soft:"按过手印的人"}};
STRONG_LIFE_V56["lv_knight2"]={id:"lv_knight2",personality:["干脆","仁心","两头跑"],hobby:["劝架"],faith:"我的剑，只守值得守的东西",motto:"我的剑，只守值得守的东西",routine:"在枢机院和骑士团之间来回奔走，替净化令减速",baseWhere:"圣城",mood:"平和",traits:{speak:"利落",taboo:"让她选边",soft:"平民出身的人"}};
STRONG_LIFE_V56["lv_smith1"]={id:"lv_smith1",personality:["耐心","痴迷","谦逊"],hobby:["看铁纹"],faith:"铁不用重锤，铁用耐心",motto:"铁这东西，急不得",routine:"在锻造公会炉边听铁说话，研究符文",baseWhere:"铁峰堡",mood:"平和",traits:{speak:"慢",taboo:"催他",soft:"耐得住的人"}};
STRONG_LIFE_V56["lv_smith2"]={id:"lv_smith2",personality:["炽烈","念旧","孤直"],hobby:["对炉火自言自语"],faith:"造物该有自己的脾气",motto:"别碰那柄锤——它今天心情不好",routine:"在工坊里铸会心跳的造物，微醺时对炉火说话",baseWhere:"铁峰堡",mood:"激昂",traits:{speak:"带刺",taboo:"提老铸师",soft:"手稳过心跳的人"}};
STRONG_LIFE_V56["lv_trade1"]={id:"lv_trade1",personality:["精明","仁厚","长久"],hobby:["拨算盘","记人情账"],faith:"账算得精，不如算得久",motto:"灾年粮价，你涨不涨",routine:"铺子还开在老巷，卖当年的货，账房没有锁",baseWhere:"交汇城",mood:"平和",traits:{speak:"慢悠悠",taboo:"催账",soft:"守规矩的人"}};
STRONG_LIFE_V56["lv_trade2"]={id:"lv_trade2",personality:["豪阔","留余地","念旧"],hobby:["看海","还债"],faith:"留一半，给风变卦",motto:"我的船，只载两条路：发财的路，和还债的路",routine:"船队只挂半帆，舱里锁着当年抢来又还回去的东西",baseWhere:"南方港城",mood:"激昂",traits:{speak:"大笑",taboo:"让他挂满帆",soft:"不贪的人"}};
STRONG_LIFE_V56["lv_soul1"]={id:"lv_soul1",personality:["疏离","自省","敏感"],hobby:["不照镜子"],faith:"我还没准备好听那个答案",motto:"你想让我听哪一道声音",routine:"守回音之镜九十年，从不照镜子",baseWhere:"圣城",mood:"沉郁",traits:{speak:"侧着身说",taboo:"正眼看她太久",soft:"不怕另一面的人"}};
STRONG_LIFE_V56["lv_兽王"]={id:"lv_兽王",personality:["野性","威压","护群"],hobby:["巡视领地"],faith:"兽王守的是兽群的规矩",motto:"（咆哮）",routine:"大陆深处的超凡兽王，非大事不出",baseWhere:"荒野",mood:"激昂",traits:{speak:"不会人语，但能听懂",taboo:"挑衅它的族群",soft:"敬自然的人"}};
STRONG_LIFE_V56["lv_隐世"]={id:"lv_隐世",personality:["神秘","淡泊","无人知"],hobby:["（无人知晓）"],faith:"（无人知晓）",motto:"（他不说话）",routine:"传说他不在了，可强者榜仍有他一席",baseWhere:"行踪不明",mood:"沉郁",traits:{speak:"无",taboo:"无",soft:"无"}};
STRONG_LIFE_V56["lv_散人"]={id:"lv_散人",personality:["孤高","洒脱","无门"],hobby:["独行"],faith:"无门无派，自成一道",motto:"（独臂，不说话）",routine:"独臂散人，在大陆上独行",baseWhere:"南方港城",mood:"沉郁",traits:{speak:"极少",taboo:"问他的断臂",soft:"独立的人"}};
/* theo 特殊（传承半神/守望者/空悬） */
STRONG_LIFE_V56["theo_smith"]={id:"theo_smith",personality:["宽厚","守位","念炉"],hobby:["转铁环","看炉火"],faith:"铸把火留给我，是让我看着炉子",motto:"炉火认得你",routine:"每年铸火节独自下到初火熔炉前坐一夜",baseWhere:"铁峰堡",mood:"平和",traits:{speak:"声如洪钟",taboo:"碰那柄锤",soft:"懂火的人"}};
STRONG_LIFE_V56["theo_soul"]={id:"theo_soul",personality:["深静","自责","守望"],hobby:["看深渊"],faith:"我还没把自己看透",motto:"深渊还在涨，我走不开",routine:"每晚站在守望者塔顶看深渊方向",baseWhere:"圣城",mood:"忧虑",traits:{speak:"轻",taboo:"提黄林晶",soft:"敢看深渊的人"}};
STRONG_LIFE_V56["theo_mage"]={id:"theo_mage",personality:["空","等","守"],hobby:["（空座）"],faith:"坐上去不难，难的是记得自己是个人",motto:"（无人说话）",routine:"神座空悬两千年，星落塔灯替它点着",baseWhere:"星落塔",mood:"沉郁",traits:{speak:"无",taboo:"无",soft:"无"}};


/*v56inj:life3*/
/* ---- 大宗师代表 12（m_*，名字取自 v53 master 层） ---- */
STRONG_LIFE_V56["m_魔法师1"]={id:"m_魔法师1",personality:["严谨","务实"],hobby:["整理术式"],faith:"先弄懂，再用",motto:"把步骤写清楚",routine:"元素学院讲师，课表雷打不动",baseWhere:"艾尔达学院",mood:"平和",traits:{speak:"条理分明",taboo:"跳步骤",soft:"肯问为什么的人"}};
STRONG_LIFE_V56["m_魔法师2"]={id:"m_魔法师2",personality:["温和","宽厚"],hobby:["教新生"],faith:"谁都从零开始",motto:"不丢人，再来一次",routine:"负责学院新生试炼的老好人",baseWhere:"艾尔达学院",mood:"平和",traits:{speak:"和缓",taboo:"嘲笑新手",soft:"初学的人"}};
STRONG_LIFE_V56["m_战士1"]={id:"m_战士1",personality:["刚直","重义"],hobby:["练枪"],faith:"一枪在手，身后有人",motto:"站我后面",routine:"战神团教头，每天清晨带新兵",baseWhere:"交汇城",mood:"激昂",traits:{speak:"简短有力",taboo:"临阵脱逃",soft:"敢拼的人"}};
STRONG_LIFE_V56["m_战士2"]={id:"m_战士2",personality:["豪爽","念乡"],hobby:["喝酒"],faith:"铁门关的雪最养人",motto:"干了这碗",routine:"镇北军百夫长，轮休时在酒馆",baseWhere:"铁门关",mood:"激昂",traits:{speak:"大嗓门",taboo:"骂他家乡",soft:"实在人"}};
STRONG_LIFE_V56["m_牧师1"]={id:"m_牧师1",personality:["慈和","耐心"],hobby:["施粥"],faith:"救一个是一个",motto:"主记得你",routine:"圣城救济堂管事，每天施粥",baseWhere:"圣城",mood:"平和",traits:{speak:"温柔",taboo:"嫌贫",soft:"可怜人"}};
STRONG_LIFE_V56["m_牧师2"]={id:"m_牧师2",personality:["沉静","守律"],hobby:["抄经"],faith:"律在，心才定",motto:"照规矩来",routine:"教堂文书，抄了一辈子经",baseWhere:"圣城",mood:"平和",traits:{speak:"一本正经",taboo:"乱来",soft:"守规矩的人"}};
STRONG_LIFE_V56["m_盗贼1"]={id:"m_盗贼1",personality:["机灵","念旧"],hobby:["听墙角"],faith:"消息比刀值钱",motto:"嘘，听",routine:"暗影阁情报贩子，蹲在码头",baseWhere:"交汇城",mood:"激昂",traits:{speak:"快而密",taboo:"出卖",soft:"嘴严的人"}};
STRONG_LIFE_V56["m_盗贼2"]={id:"m_盗贼2",personality:["寡言","守规"],hobby:["磨刀"],faith:"暗影有暗影的规矩",motto:"收好你的东西",routine:"暗影阁执事，教新人规矩",baseWhere:"交汇城",mood:"沉郁",traits:{speak:"冷",taboo:"坏了规矩",soft:"懂规矩的人"}};
STRONG_LIFE_V56["m_游侠1"]={id:"m_游侠1",personality:["洒脱","热忱"],hobby:["吹口哨"],faith:"林子养人，也养心",motto:"跟上，别掉队",routine:"荒野巡守向导，常跑银叶城到交汇城的林道",baseWhere:"荒野",mood:"激昂",traits:{speak:"带笑",taboo:"砍树",soft:"爱林子的人"}};
STRONG_LIFE_V56["m_游侠2"]={id:"m_游侠2",personality:["沉静","耐劳"],hobby:["修弓"],faith:"箭要直，心要正",motto:"稳住呼吸",routine:"守林人，一个人守一片老林",baseWhere:"荒野",mood:"平和",traits:{speak:"少",taboo:"惊扰兽群",soft:"静得下来的人"}};
STRONG_LIFE_V56["m_骑士1"]={id:"m_骑士1",personality:["端方","尽责"],hobby:["保养铠甲"],faith:"誓言就是命",motto:"以誓约为名",routine:"骑士团执事，负责新人训导",baseWhere:"圣城",mood:"平和",traits:{speak:"庄重",taboo:"破誓",soft:"重诺的人"}};
STRONG_LIFE_V56["m_商人1"]={id:"m_商人1",personality:["精明","守信"],hobby:["看行情"],faith:"货真价实，童叟无欺",motto:"这价，公道",routine:"金衡商会老掌柜，铺子开了四十年",baseWhere:"交汇城",mood:"平和",traits:{speak:"笑眯眯",taboo:"赖账",soft:"老主顾"}};
/* 种族特殊 4（r_*，德鲁伊/萨满） */
STRONG_LIFE_V56["r_druid1"]={id:"r_druid1",personality:["沉静","亲自然"],hobby:["照料古树"],faith:"树记得一切",motto:"树不说话，但都记得",routine:"木精灵德鲁伊，守着银叶城外古树林",baseWhere:"银叶城",mood:"平和",traits:{speak:"慢",taboo:"毁林",soft:"敬树的人"}};
STRONG_LIFE_V56["r_druid2"]={id:"r_druid2",personality:["灵动","好奇"],hobby:["学兽语"],faith:"万物皆可谈",motto:"它说它饿了",routine:"年轻木精灵德鲁伊，与兽为友",baseWhere:"荒野",mood:"激昂",traits:{speak:"活泼",taboo:"虐兽",soft:"爱兽的人"}};
STRONG_LIFE_V56["r_sham1"]={id:"r_sham1",personality:["威严","通灵"],hobby:["祭祖"],faith:"祖先与元素同行",motto:"祖灵在听",routine:"兽人萨满，主持王庭祭典",baseWhere:"兽人王庭",mood:"平和",traits:{speak:"低沉庄重",taboo:"辱及祖灵",soft:"敬祖的人"}};
STRONG_LIFE_V56["r_sham2"]={id:"r_sham2",personality:["慈和","神秘"],hobby:["配草药"],faith:"草药是祖灵的言语",motto:"喝下去，别皱眉",routine:"兽人老萨满，兼任巫医",baseWhere:"兽人王庭",mood:"平和",traits:{speak:"笑呵呵",taboo:"浪费草药",soft:"病人"}};
/* 深渊变体 12（ab_*，行踪只在腐化区域，mood 默认暴戾） */
STRONG_LIFE_V56["ab_mage1"]={id:"ab_mage1",personality:["偏执","孤高"],hobby:["研读禁术"],faith:"力量不该有禁忌",motto:"他们不懂",routine:"在腐化区域研读深渊法术",baseWhere:"深渊裂隙",mood:"暴戾",traits:{speak:"阴冷",taboo:"质疑深渊",soft:"同路人"}};
STRONG_LIFE_V56["ab_mage2"]={id:"ab_mage2",personality:["狂躁","危险"],hobby:["放血"],faith:"血是钥匙",motto:"（低笑）",routine:"腐化法师，游荡在暗蚀会据点",baseWhere:"深渊裂隙",mood:"暴戾",traits:{speak:"颠三倒四",taboo:"提她的过去",soft:"无所谓"}};
STRONG_LIFE_V56["ab_war1"]={id:"ab_war1",personality:["暴虐","寡言"],hobby:["磨牙"],faith:"强者为尊",motto:"（怒吼）",routine:"腐化兽人，在黑兽人营地",baseWhere:"兽人王庭",mood:"暴戾",traits:{speak:"吼",taboo:"示弱",soft:"强者"}};
STRONG_LIFE_V56["ab_war2"]={id:"ab_war2",personality:["冷酷","独行"],hobby:["数骨"],faith:"死亡是终点",motto:"你也会变成白骨",routine:"腐化战士，独行于死亡沙漠",baseWhere:"死亡沙漠",mood:"暴戾",traits:{speak:"沙哑",taboo:"劝他回头",soft:"无"}};
STRONG_LIFE_V56["ab_priest1"]={id:"ab_priest1",personality:["伪善","疯癫"],hobby:["布道"],faith:"深渊才是慈悲",motto:"信我，就不痛了",routine:"腐化牧师，在腐化村落传道",baseWhere:"深渊裂隙",mood:"暴戾",traits:{speak:"甜腻",taboo:"揭穿他",soft:"信徒"}};
STRONG_LIFE_V56["ab_priest2"]={id:"ab_priest2",personality:["阴郁","绝望"],hobby:["画符"],faith:"神弃了我，我便弃了神",motto:"别靠近",routine:"腐化牧师，独自徘徊在圣城下水道",baseWhere:"圣城",mood:"沉郁",traits:{speak:"低语",taboo:"提圣光",soft:"同类"}};
STRONG_LIFE_V56["ab_thief1"]={id:"ab_thief1",personality:["鬼祟","狠辣"],hobby:["偷影子"],faith:"影子是我的猎物",motto:"（无声）",routine:"腐化盗贼，藏在阴影里",baseWhere:"交汇城",mood:"暴戾",traits:{speak:"耳语",taboo:"追他",soft:"无"}};
STRONG_LIFE_V56["ab_ranger1"]={id:"ab_ranger1",personality:["疯野","警觉"],hobby:["狩猎人"],faith:"猎物会跑，才算猎物",motto:"你跑，我追",routine:"腐化猎手，在荒野狩猎活人",baseWhere:"荒野",mood:"暴戾",traits:{speak:"尖笑",taboo:"转身背对他",soft:"跑得快的"}};
STRONG_LIFE_V56["ab_knight1"]={id:"ab_knight1",personality:["堕落","沉默"],hobby:["擦黑甲"],faith:"誓约是锁链，我砍断了",motto:"（铁面下无声）",routine:"腐化骑士，黑甲覆面，为暗蚀会守门",baseWhere:"深渊裂隙",mood:"沉郁",traits:{speak:"无声",taboo:"提誓约",soft:"无"}};
STRONG_LIFE_V56["ab_smith1"]={id:"ab_smith1",personality:["狂热","执拗"],hobby:["铸邪器"],faith:"造物主该造一切",motto:"它想被造出来",routine:"腐化术士，在暗蚀会锻造邪器",baseWhere:"深渊裂隙",mood:"暴戾",traits:{speak:"喃喃自语",taboo:"砸他的造物",soft:"欣赏他的人"}};
STRONG_LIFE_V56["ab_trade1"]={id:"ab_trade1",personality:["贪婪","多疑"],hobby:["囤金"],faith:"金子是唯一的神",motto:"钱货两讫，命也要两讫",routine:"腐化商人，在黑市倒卖深渊物品",baseWhere:"交汇城",mood:"激昂",traits:{speak:"油滑",taboo:"赖账",soft:"出得起价的人"}};
STRONG_LIFE_V56["ab_soul1"]={id:"ab_soul1",personality:["空洞","哀恸"],hobby:["照碎镜"],faith:"镜子碎了，我还在",motto:"（无声的哭）",routine:"腐化灵魂法师，收集他人的梦",baseWhere:"深渊裂隙",mood:"暴戾",traits:{speak:"梦呓",taboo:"让她照镜子",soft:"无"}};


/*v56inj:rel*/
/* ---- 关系网 60 边（师徒蓝/挚友绿/宿敌红/恋人粉/同门紫/世仇黑） ---- */
/* 魔法师系 */
RELATIONS_V56.push({a:"lv_mage2",b:"rv_mage_o",type:"同门",note:"奥伦·星弦是师兄，洛·晨雾是师弟；星徽留在窗台十二年了",weight:5,rumorLine:"听说奥伦离塔那天，把首席星徽留在了第七层窗台上。"});
RELATIONS_V56.push({a:"lv_mage2",b:"rv_mage_o",type:"师徒",note:"洛捡起奥伦的星徽戴上，一戴十二年",weight:3,rumorLine:"洛每年双子星升起的夜里都失眠，站在观星台看那枚星徽。"});
RELATIONS_V56.push({a:"lv_mage4",b:"lv_mage1",type:"师徒",note:"瑟琳是奥薇恩的学生，选了守树而不是登顶",weight:4,rumorLine:"奥薇恩教了三百年孩子认元素，瑟琳是其中最安静的一个。"});
RELATIONS_V56.push({a:"lv_mage1",b:"rv_mage_v",type:"宿敌",note:"奥薇恩打遍北境；银冠女爵·薇拉是圣城宫廷法师，两顶银冠隔空相望",weight:3,rumorLine:"北境说，两顶银冠从不同时出现在一张桌子上。"});
RELATIONS_V56.push({a:"lv_mage5",b:"rv_mage_o",type:"同门",note:"伊尔·灰书是元素学院出身，与奥伦同窗，毕业去了守望者塔",weight:2,rumorLine:"灰书毕业那年没有去任何势力，去了守望者塔当藏卷师。"});
RELATIONS_V56.push({a:"lv_mage3",b:"rv_war_r",type:"挚友",note:"凯·青焰是北方军法师，红鬃是北地佣兵之王，都在北方讨生活",weight:2,rumorLine:"北地说，青焰的青色火焰和红鬃的战旗，在北境是两样不能惹的东西。"});
RELATIONS_V56.push({a:"lv_mage2",b:"theo_mage",type:"同门",note:"洛守着寂光留下的塔和灯，神座空悬两千年",weight:2,rumorLine:"老执事说，寂光陨落前留下一句话：坐上去不难，难的是记得自己是个人。"});
/* 战士系 */
RELATIONS_V56.push({a:"rv_war_r",b:"lv_war3",type:"挚友",note:"红鬃是铁门关血战唯一生还者，秦·长风守了铁门关七天七夜——同袍",weight:4,rumorLine:"铁门关的老兵说，红鬃每年都会回关外，替那场仗里的人上一炷香。"});
RELATIONS_V56.push({a:"lv_war3",b:"lv_ranger2",type:"师徒",note:"贺·断弓原是镇北军斥候，断弓那场仗救了整支斥候队",weight:4,rumorLine:"镇北军的兵都知道，断弓那半截弓，是替斥候队断的。"});
RELATIONS_V56.push({a:"lv_war2",b:"rv_war_b",type:"同门",note:"喀兰与断山·库鲁都是兽人勇士，一个狼旗第一，一个蛮族第一",weight:3,rumorLine:"兽人王庭说，草原上最快的刀和蛮族最硬的刀，见面总要先碰一下。"});
RELATIONS_V56.push({a:"lv_war4",b:"lv_war5",type:"挚友",note:"叶·孤山守城，罗·断江退役开酒馆，一个只接守城的单，一个只擦旧酒杯",weight:3,rumorLine:"自由城邦说，断江的旧枪插在酒馆房梁上，枪尖朝海。"});
RELATIONS_V56.push({a:"lv_war5",b:"rv_war_b",type:"宿敌",note:"断江年轻时一人断江，断山是蛮族第一勇士，一南一北的刀都姓断",weight:2,rumorLine:"好事者说，天下两把断刀，一把断江，一把断山，从没碰过面。"});
RELATIONS_V56.push({a:"lv_war1",b:"theo_smith",type:"挚友",note:"格罗·铁壁的铁峰堡卫队总长，索林·铁须是矮人王——一盾一王守一座城",weight:2,rumorLine:"铁峰堡的孩子都知道，格罗总长的盾上有三百七十二道凹痕。"});
/* 牧师系 */
RELATIONS_V56.push({a:"lv_priest1",b:"rv_priest_b",type:"宿敌",note:"克莱门主张净化令，炽言因宽恕被流放——同门反目",weight:4,rumorLine:"枢机院里说，炽言是教会放走的一根刺，克莱门每次提他都要沉默。"});
RELATIONS_V56.push({a:"lv_priest1",b:"lv_knight2",type:"宿敌",note:"克莱门让净化令更严，伊莎让净化令慢了那么几次",weight:3,rumorLine:"圣城的平民说，晨辉骑士每次进枢机院，克莱门主教都要多喝一杯苦茶。"});
RELATIONS_V56.push({a:"lv_priest2",b:"rv_priest_s",type:"同门",note:"玛格达守静默殿三百年，静默修女·安守夜二十年——同守一段黑",weight:3,rumorLine:"静默殿的规矩：守夜的人不说话，只换蜡烛。"});
RELATIONS_V56.push({a:"lv_priest2",b:"de_priest",type:"恋人",note:"玛格达的蜡烛芯是初代守夜人（太阳神圣临的未婚妻）的头发搓的——她没等到他成神",weight:5,rumorLine:"有人说玛格达的蜡烛芯，是用初代守夜人的头发搓的。"});
RELATIONS_V56.push({a:"lv_priest3",b:"lv_priest1",type:"同门",note:"艾诺尔在圣城长大，与克莱门同教会，却回了银叶城建小教堂",weight:2,rumorLine:"精灵们说，艾诺尔的小教堂里供奉着一尊精灵面容的太阳神像。"});
RELATIONS_V56.push({a:"lv_priest3",b:"lv_mage1",type:"挚友",note:"艾诺尔与奥薇恩同在银叶城，一个教灯，一个教元素",weight:2,rumorLine:"银叶城的老树下，常能看见一个精灵主教和一个精灵大法师并排坐着。"});
/* 盗贼系 */
RELATIONS_V56.push({a:"lv_thief1",b:"rv_thief_y",type:"师徒",note:"杜·夜枭杀了前任阁主接任——这是暗影阁的规矩；夜鸢是更早的前阁主",weight:3,rumorLine:"暗影阁的镜厅里，那面旧镜子等的是敢把不存在当名字的人。"});
RELATIONS_V56.push({a:"lv_thief1",b:"rv_thief_g",type:"挚友",note:"夜枭封了暗影阁最深库房，灰鼠·柯在码头给他递消息",weight:2,rumorLine:"整个码头都是灰鼠的耳朵，他说的话，夜枭信。"});
RELATIONS_V56.push({a:"lv_thief2",b:"rv_trade_j",type:"宿敌",note:"薇·灰雾是自由行商，金牙是黑市之王——一个白天一个黑夜，都在交汇城",weight:3,rumorLine:"商路上流传：别在雾天跟灰雾谈生意。"});
RELATIONS_V56.push({a:"lv_thief2",b:"lv_trade1",type:"挚友",note:"灰雾走商路，文森·金秤是金衡总会长，一个影子一个账房，互相看得顺眼",weight:2,rumorLine:"老巷的铺子里，文森说过：灰雾那孩子，算账算得比我快。"});
/* 游侠系 */
RELATIONS_V56.push({a:"lv_ranger1",b:"lv_ranger2",type:"挚友",note:"艾琳追路，贺·断弓追猎物——一个在森林，一个在雪原，都是路上的猎手",weight:2,rumorLine:"雪原的猎人说，断弓的背囊里装着一根完整的弓弦。"});
RELATIONS_V56.push({a:"lv_ranger1",b:"rv_ranger_l",type:"同门",note:"艾琳是荒野巡守大巡守，双矢·林是精灵猎手——同门巡林",weight:3,rumorLine:"林缘的巡守说，双矢的箭从不猎幼兽，那是给林子留的种。"});
RELATIONS_V56.push({a:"lv_ranger2",b:"rv_ranger_k",type:"挚友",note:"贺·断弓与枯枝都在北地打猎，山火之夜后枯枝失踪",weight:3,rumorLine:"北方的猎人说，枯枝走时在木棍上留了一句话，只有断弓看懂了。"});
RELATIONS_V56.push({a:"lv_ranger1",b:"r_druid2",type:"师徒",note:"艾琳常路过荒野，年轻德鲁伊跟着她学认路",weight:1,rumorLine:"林子里的人说，逐风大巡守身后总跟着一个学兽语的小德鲁伊。"});
/* 骑士系 */
RELATIONS_V56.push({a:"lv_knight1",b:"lv_knight2",type:"同门",note:"罗兰是誓约骑士团团长，伊莎是圣辉骑士——同团，一个守圣城一个劝枢机",weight:3,rumorLine:"骑士团说，白盾团长和晨辉骑士是团里最能吵也最互相敬的两个人。"});
RELATIONS_V56.push({a:"lv_knight1",b:"rv_knight_s",type:"同门",note:"罗兰守圣城，白隼·塞拉在南方巡游替人出头——都是骑士团的门面",weight:2,rumorLine:"南方的路上说，白隼骑马时从不回头。"});
RELATIONS_V56.push({a:"lv_knight2",b:"rv_knight_j",type:"同门",note:"伊莎与金誓·艾德同团，艾德为守一句誓言独行二十年",weight:2,rumorLine:"骑士团的老人们叹气：艾德那孩子，为一句誓言把自己走丢了。"});
RELATIONS_V56.push({a:"lv_knight1",b:"lv_war3",type:"挚友",note:"罗兰守圣城，秦·长风守铁门关——两个都守城的人，隔得再远也互相敬",weight:3,rumorLine:"圣城和铁门关之间有条规矩：两头都认对方的盾。"});
RELATIONS_V56.push({a:"lv_knight1",b:"lv_priest1",type:"宿敌",note:"罗兰挡在书商面前也挡在执事面前，克莱门的净化令过不了他那一关",weight:3,rumorLine:"净化令最凶那几年，白盾团长站在书商门前，谁也不让。"});
/* 术士系 */
RELATIONS_V56.push({a:"theo_smith",b:"lv_smith1",type:"师徒",note:"索林守初火熔炉，格朗在炉边站了三百年听火说话",weight:4,rumorLine:"矮人们说，索林王的初火熔炉前，格朗站得最久。"});
RELATIONS_V56.push({a:"theo_smith",b:"lv_smith2",type:"师徒",note:"梅是老铸师捡回来的孤儿，索林是传承半神——铁峰堡的炉火认他们",weight:3,rumorLine:"有人说梅的炽芯里，还留着老铸师最后一句话。"});
RELATIONS_V56.push({a:"lv_smith1",b:"lv_smith2",type:"同门",note:"格朗与梅同为锻造公会，一个符文一个炽芯，铁峰堡最值钱的兵器都出自他们",weight:3,rumorLine:"锻造公会说，格朗的符文和梅的炽芯，是炉火的两个方向。"});
RELATIONS_V56.push({a:"lv_smith2",b:"rv_smith_a",type:"宿敌",note:"梅铸活物，灰指炼毒药——一个给铁心跳，一个给药五色",weight:2,rumorLine:"黑市上说，灰指的药和梅的锤，碰在一起就是灾祸。"});
RELATIONS_V56.push({a:"rv_smith_g",b:"theo_smith",type:"同门",note:"铁炉·格姆隐入矿洞前是锻造公会的人，索林知道他的炉火",weight:2,rumorLine:"铁峰堡的老炉工说，格姆的锤子还在公会，人却进了矿洞。"});
/* 商人类 */
RELATIONS_V56.push({a:"lv_trade1",b:"rv_trade_j",type:"宿敌",note:"文森是金衡总会长、光明正大做生意，金牙是黑市之王——一白一黑",weight:4,rumorLine:"交汇城说，金牙的金子和文森的账本，是这座城的两杆秤。"});
RELATIONS_V56.push({a:"lv_trade1",b:"lv_trade2",type:"挚友",note:"文森算账，洛佩斯看海——一个守老巷，一个挂半帆",weight:2,rumorLine:"商人们说，老巷铺子和南方船队从没红过脸。"});
RELATIONS_V56.push({a:"lv_trade2",b:"rv_trade_y",type:"同门",note:"洛佩斯是南方船王，燕来·沈是航运大亨——南方的船都看他们脸色",weight:3,rumorLine:"南方港城的码头说，燕来和半帆各占一半顺风。"});
RELATIONS_V56.push({a:"lv_trade2",b:"lv_war5",type:"挚友",note:"罗·断江在南方港城开酒馆，洛佩斯的船队常来喝酒",weight:3,rumorLine:"断江酒馆的招牌菜断江鱼，是半帆船队的水手们捧出来的。"});
RELATIONS_V56.push({a:"lv_trade1",b:"lv_war4",type:"挚友",note:"文森不赚让人活不下去的钱，叶·孤山只接守城的单——一个管账一个管城",weight:2,rumorLine:"自由城邦说，叶会长佣金里扣下的一成，文森总会长替他记着。"});
/* 灵魂法师系 */
RELATIONS_V56.push({a:"theo_soul",b:"lv_soul1",type:"师徒",note:"奥雷利安离开圣殿后，澜·梦墟是最后一位守镜人",weight:5,rumorLine:"晨曦圣殿说，回音之镜三千年没碎，因为守镜人从不敢照它。"});
RELATIONS_V56.push({a:"theo_soul",b:"rv_soul_r",type:"师徒",note:"赎夜替圣殿守了三十年夜，最后一夜走进深渊裂隙——奥雷利安没拦住",weight:4,rumorLine:"守望者们说，赎夜走进裂隙那夜，奥雷利安在塔顶站到天明。"});
RELATIONS_V56.push({a:"lv_soul1",b:"rv_soul_w",type:"同门",note:"澜守回音之镜，无面歌者流浪唱歌——圣殿的两条支流",weight:2,rumorLine:"圣殿说，无面歌者的歌没有词，守镜人却能听懂。"});
RELATIONS_V56.push({a:"theo_soul",b:"lv_mage5",type:"同门",note:"奥雷利安是守望者首席，伊尔·灰书是守望者藏卷师——一守深渊一守档案",weight:3,rumorLine:"守望者塔说，灰书的卷宗里有一页空白，是留给将来能彻底封住七印的人。"});
/* 跨系/跨种族 */
RELATIONS_V56.push({a:"lv_mage1",b:"lv_priest3",type:"挚友",note:"奥薇恩与艾诺尔都是银叶城的异类——一个不争神座，一个信人类的神",weight:2,rumorLine:"银叶城的老树听惯了她们俩的闲聊。"});
RELATIONS_V56.push({a:"lv_mage4",b:"lv_ranger1",type:"挚友",note:"瑟琳守世界树，艾琳追白鹿追到世界树脚下——都敬那棵树",weight:3,rumorLine:"世界树的根下，守树人见过一个追风的大巡守。"});
RELATIONS_V56.push({a:"lv_war2",b:"r_sham1",type:"同门",note:"喀兰是狼旗第一勇士，老萨满主持王庭祭典——一个打仗一个祭祖",weight:2,rumorLine:"兽人王庭说，赤峰出征前总要先去老萨满那里坐一坐。"});
RELATIONS_V56.push({a:"lv_war2",b:"lv_war3",type:"宿敌",note:"喀兰屠过村也守过村，秦·长风守铁门关挡东军——兽人与人类旧战的活证",weight:3,rumorLine:"喀兰的石像脸朝南对着人类地界，他说让人类看看草原不是只有仇恨。"});
RELATIONS_V56.push({a:"lv_thief1",b:"lv_thief2",type:"师徒",note:"杜·夜枭是现任阁主，薇·灰雾在暗影阁挂过名——灰雾的路子有阁主的影子",weight:2,rumorLine:"暗影阁的老人们说，灰雾的影子比人长，路数却像极了夜枭。"});
RELATIONS_V56.push({a:"lv_priest1",b:"rv_priest_s",type:"师徒",note:"克莱门是枢机主教，静默修女·安在圣城守夜——她欠的人里有他",weight:2,rumorLine:"圣城的下水道边，有人见过静默修女在等一个人。"});
RELATIONS_V56.push({a:"lv_war4",b:"rv_thief_y",type:"挚友",note:"叶·孤山在自由城邦独酌，夜鸢隐居在自由城邦——一明一暗都在那城",weight:2,rumorLine:"自由城邦的酒馆说，夜鸢还回去的东西，有几件是孤山守城守回来的。"});
RELATIONS_V56.push({a:"lv_smith2",b:"rv_smith_g",type:"师徒",note:"梅是锻造公会人类首席铸师，铁炉·格姆是隐入矿洞的老炉工——她的手艺有老炉工的底子",weight:2,rumorLine:"锻造公会说，梅的炽芯是传下来的，格姆的炉火也是。"});
RELATIONS_V56.push({a:"lv_knight2",b:"lv_priest3",type:"挚友",note:"伊莎在圣城平民窟长大，艾诺尔在圣城长大——两个都见过教会两面的人",weight:2,rumorLine:"圣城的老人们说，晨辉骑士和银冠主教是城里最不恨教会的人。"});
RELATIONS_V56.push({a:"rv_war_r",b:"lv_war5",type:"宿敌",note:"红鬃是北地佣兵之王，罗·断江是南方退役海卫——南北两大兵头，互相不服又互相敬",weight:2,rumorLine:"南北的兵都传：北红鬃，南断江，见面就要分个高下。"});
RELATIONS_V56.push({a:"lv_mage3",b:"lv_ranger2",type:"挚友",note:"凯·青焰在北方烧过一整支军队，贺·断弓在北方雪原猎不该存在的猎物——北地的孤人",weight:2,rumorLine:"北地说，青焰的旧灯和断弓的断弓，是雪原上两样不说话的东西。"});
RELATIONS_V56.push({a:"lv_priest2",b:"de_soul",type:"宿敌",note:"玛格达守静默殿的三百年夜，奥雷利安·晨曦的灵魂法师一脉触碰过灵魂禁忌的边界——守夜人警惕窥心者",weight:2,rumorLine:"静默殿的老人说，晨曦圣殿的人，守夜人从不让他们靠近烛光。"});
RELATIONS_V56.push({a:"lv_soul1",b:"ab_soul1",type:"宿敌",note:"澜守回音之镜，腐化的灵魂法师在深渊收集他人的梦——同源异路",weight:3,rumorLine:"圣殿说，镜子里最深的裂缝，是被深渊那边的回声震出来的。"});
RELATIONS_V56.push({a:"lv_mage2",b:"lv_war3",type:"挚友",note:"洛·晨雾守星落塔，秦·长风守铁门关——两个都替别人守着位置的人",weight:3,rumorLine:"北境和学院之间传：雾塔和长风，一个守塔一个守城，都说对方才是硬骨头。"});
/* ---- 动态事件 16 条（worldTick 触发，missedEvents 回收） ---- */
STRONG_EVENTS_V56.push({id:"ev56_duel_north",relId:"r_war_vs_war",kind:"决斗",day:21,text:["北地的风里传来消息：红鬃和断江在铁门关外碰了面。","两人没打起来。红鬃把一碗酒推过去，断江接了——南北两个兵头，喝了一碗酒，各自走了。","有人说他们约好了，等大陆的事了结，再分高下。"],effect:{force:"f_north",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_grudge_church",relId:"r_priest_split",kind:"反目",day:35,text:["圣城的枢机院里吵了一夜。","克莱门·圣言提起了被流放的炽言，说他「走错了路」。","第二天，静默殿的守夜人发现，静默修女·安在门前站了一整夜，手里攥着一封信。"],effect:{force:"f_church",delta:-1}});
STRONG_EVENTS_V56.push({id:"ev56_ally_tower",relId:"r_war_mage",kind:"联手",day:49,text:["铁门关传来消息：雾塔的洛·晨雾亲自南下，替镇北军加固了城防结界。","秦·长风在城头站了一夜，第二天让兵卒给星落塔送了一坛酒。","南来北往的商队都说，这是近十年北境和学院第一次走得这么近。"],effect:{force:"f_north",delta:3}});
STRONG_EVENTS_V56.push({id:"ev56_marry_leaf",relId:"r_elf_elf",kind:"联姻",day:63,text:["银叶城的老树下摆了三天宴。","精灵长老会的瑟琳·银冠，收了一个人类学徒——那孩子是商队里跑丢的孤儿。","奥薇恩站在树下看了很久，对艾诺尔主教说：这棵树，又记住了一个人。"],effect:{force:"f_elf",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_fall_blacksmith",relId:"r_smith_fall",kind:"寻仇",day:77,text:["铁峰堡出了事。","隐入矿洞多年的铁炉·格姆，一夜之间出现在锻造公会门口，锤子砸碎了三件「邪器」。","他什么也没说，砸完就走了。索林王在初火熔炉前坐了一夜。"],effect:{force:"f_dwarf",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_reconcile_sea",relId:"r_trade_trade",kind:"和解",day:91,text:["南方港城的两支船队，三年来第一次在同一个码头卸货。","洛佩斯·半帆站在船头，朝燕来·沈的船拱了拱手；对面回了一礼。","码头上的人说，风要变顺了。"],effect:{force:"f_south",delta:3}});
STRONG_EVENTS_V56.push({id:"ev56_hunt_abyss",relId:"r_abyss_ranger",kind:"联手",day:105,text:["雪原深处传来消息：断弓的猎队和一头腐化的雪兽打了一夜。","天亮时，断弓的背囊空了——那根留了多年的弓弦，断了。","他在避风处坐了很久，然后说：弦没了，仗还没打完。"],effect:{force:"f_abyss",delta:-2}});
STRONG_EVENTS_V56.push({id:"ev56_vigil_soul",relId:"r_soul_watch",kind:"和解",day:119,text:["晨曦圣殿的回音之镜，裂了一道缝。","守镜人澜·梦墟在镜前站了一夜，没有照它。","第二天，她在门口放了一盏灯——给深渊裂隙里那个人的。"],effect:{force:"f_watcher",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_black_war",relId:"r_war_war",kind:"决斗",day:133,text:["兽人王庭的草原上，喀兰·赤峰和断山·库鲁打了一架。","两人都没用全力——打到一半，喀兰把红布头巾系在库鲁刀柄上，说：留着，草原认你。","老萨满说，这不是争第一，是争「谁先替草原挡灾」。"],effect:{force:"f_orc",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_lamp_mage",relId:"r_mage_lamp",kind:"寻仇",day:147,text:["北地的雪原上，有人看见一盏旧灯亮了一瞬。","凯·青焰蹲在灯前看了很久，然后烧掉了一座暗蚀会的哨站。","没人知道他找到了什么。"],effect:{force:"f_abyss",delta:-3}});
STRONG_EVENTS_V56.push({id:"ev56_shield_city",relId:"r_knight_war",kind:"联手",day:161,text:["圣城来了一支北境的商队，带着秦·长风的信。","罗兰·白盾读完信，把盾漆成了新的白色，然后亲自护送那批「书」出了城。","净化的风，在圣城门口停了一停。"],effect:{force:"f_church",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_merchant_ledger",relId:"r_trade_ledger",kind:"和解",day:175,text:["交汇城的老巷里，文森·金秤的铺子来了个不速之客。","金牙站在门口，放下一本黑账，说：这一页，还你。","文森拨着算盘，头也没抬：记上了。"],effect:{force:"f_trade",delta:3}});
STRONG_EVENTS_V56.push({id:"ev56_ruin_old",relId:"r_old_legend",kind:"寻仇",day:189,text:["大陆深处的一座古战场，被人翻了个底朝天。","有人说是断山·库鲁在找他父亲的断刀，有人说是红鬃在找当年血战的遗物。","只有守墓的老人知道：那天夜里，有个独臂的人站在最高的土丘上，站到天明。"],effect:{force:"f_north",delta:1}});
STRONG_EVENTS_V56.push({id:"ev56_whisper_abyss",relId:"r_abyss_soul",kind:"联手",day:203,text:["深渊裂隙附近的村子，一夜之间没了声音。","腐化的灵魂法师在那里「收集」了一整夜的梦。","守镜人澜·梦墟第二天进了裂隙——她带了那盏灯。"],effect:{force:"f_abyss",delta:-2}});
STRONG_EVENTS_V56.push({id:"ev56_crown_elf",relId:"r_elf_crown",kind:"联姻",day:217,text:["银叶城给圣城递了一张帖子：瑟琳·银冠要收那个孤儿学徒为正式弟子。","奥薇恩在帖子上加了一行字：树已记住。","克莱门主教读完，把那页禁书合上了很久。"],effect:{force:"f_elf",delta:2}});
STRONG_EVENTS_V56.push({id:"ev56_final_omen",relId:"r_omen",kind:"联手",day:231,text:["第七印的封印，松了一寸。","伊尔·灰书的档案室彻夜亮着灯，他在那页空白上，写了一行字。","第二天，守望者塔的信鸽飞向大陆所有方向：请他们各自守好自己的那盏灯。"],effect:{force:"f_watcher",delta:-2}});
/* ---- 告示板 ---- */
window.NOTICE_V56=[
 {id:"lv_war3",text:"镇北军统领秦·长风驻守铁门关，近日严查北境商路。"},
 {id:"lv_trade1",text:"金衡商会总会长文森·金秤：灾年粮价不涨，商户勿囤。"},
 {id:"lv_knight1",text:"誓约骑士团团长罗兰·白盾：圣城夜巡加岗，净化令暂停三日。"},
 {id:"lv_ranger1",text:"荒野巡守大巡守艾琳·逐风：林道有异兽出没，商队请绕行。"},
 {id:"lv_priest1",text:"圣辉教会枢机克莱门·圣言：明日大公祈祷，全城禁喧哗。"}
];


/*v56inj:talk*/
window.QUEST_V56 = window.QUEST_V56 || {};
/* ===== 魔法师 ===== */
TALK_V56["lv_mage1"]={理念:["神座只有一把椅子，路有无数条。我赢了太久，赢过的人最该记得：法术是为什么存在的。"],"传闻":["银叶城的商队说，北地的雪今年来得早。你路上要是碰见一个烧青色火焰的法师，替我带句话：灯还亮着吗。"],"修行":["不急着赢。你先赢自己，再赢别人。你连自己为什么学都忘了的时候，赢什么都白赢。"],"闲聊":["你看这叶子，转圈的时候多好看。元素不着急，你着急什么。"]};
TALK_V56["lv_mage2"]={理念:["星落塔的灯，不是给看得见的人点的。坐神座不难，难的是坐上去还记得自己是个人。"],"传闻":["你问奥伦？他离塔十二年了。星徽还在第七层窗台上，没人敢碰。你要是见着他，告诉他：塔没塌，就是灯灭了一盏。"],"修行":["一道法则，能刻几层，要看它自己愿意承受几层。你的法力也是这样——别硬刻，会裂。"],"闲聊":["双子星升起来的时候，塔顶风最大。你要是睡不着，可以上来看看。"]};
TALK_V56["lv_mage3"]={理念:["火烧完了才算活过吗？我也不知道。我只知道，那盏灯亮着的时候，全村人都不怕夜。"],"传闻":["雪原深处有东西在动。不是兽，是更深的。断弓那家伙在盯着，我信他。"],"修行":["你的火太新。烧不亮我的灯，也烧不疼敌人。火要养，像养一盏灯。"],"闲聊":["你说，火这种东西……算了，问你也不懂。"]};
TALK_V56["lv_mage4"]={理念:["树活一万年，我守它两百年，像给它挠了个痒。你们人类总想登顶，我们精灵只想多听几遍风。"],"传闻":["结界外的林子里，最近多了些脚印。不是兽的。你走路轻一点，别惊着树。"],"修行":["你身上有它喜欢的味道。树认人，不认修为。静下来，它自然会告诉你该怎么走。"],"闲聊":["拿着这片叶子。树说，你会回来的。"]};
TALK_V56["lv_mage5"]={理念:["七印的事，比神座要紧。我记了三千年的松动，每一笔都像记自己孩子的生辰。"],"传闻":["第七印松了一寸。守望者塔的信鸽都出去了。你要是去圣城，替我看看那页空白——还空着吗。"],"修行":["你想看哪一页？先说好，看完要还。知识这东西，借了就要还，不然它会咬你。"],"闲聊":["灰布书里没有我。你翻遍了也找不到我，因为我从没把自己写进去。"]};
/* ===== 战士 ===== */
TALK_V56["lv_war1"]={理念:["盾不是用来挡自己的，是用来让别人敢往前走的。我这两百年，就干了这一件事。"],"传闻":["矿道里最近不太平。老兄弟们说，听见了不该有的响动。我走不开，你路过铁峰堡时替我带句话给索林王。"],"修行":["你的劲儿使在了刀上，没使在心上。盾兵的手是稳的，因为心先稳了。"],"闲聊":["来，帮我看看这道新凹痕——三天前替一个小姑娘挡的。够不够深？"]};
TALK_V56["lv_war2"]={理念:["草原上的规矩很简单：你敬狼，狼敬你。我屠过村，也守过村——草原记着，人类也记着。"],"传闻":["我在找一块旧碑。上面刻着兽人和人类第一份和平条约。找到了，我就把它重新立起来。"],"修行":["你的刀还差一点风的味道。草原的风是活的，你的刀是死的。去跑一跑，让它活。"],"闲聊":["吃。吃饱了，我们聊点比打仗重要的事。"]};
TALK_V56["lv_war3"]={理念:["城在，我在。这不是豪言，是账——我欠这座城七天命，要还一辈子。"],"传闻":["北境的风向要变了。东军蠢蠢欲动。你走商路的话，别走夜路，关口我加了岗。"],"修行":["你什么时候懂了城为什么在，再来找我。那之前，你的枪还太轻。"],"闲聊":["（他摩挲着木臂，没说话。风把他的披风吹得笔直。）"]};
TALK_V56["lv_war4"]={理念:["守城的人，心要凉一点。心热的人守不住，因为你会忍不住冲出去。"],"传闻":["交汇城的佣兵又涨价了。随他们涨，我只接守城的单，从不涨价。"],"修行":["你刀法不差，心还太热。凉下来，刀就稳了。"],"闲聊":["坐。这杯请你——赌你将来守得住一座城。"]};
TALK_V56["lv_war5"]={理念:["打够了，就该过自己的日子。神座那张椅子，不如我酒馆里的旧木凳坐着舒服。"],"传闻":["海上不太平。海盗最近又起来了。我这把老骨头是不动了，年轻人们去管吧。"],"修行":["你的手太急。擦杯子擦久了你就懂：活儿要慢，心才稳。"],"闲聊":["今天新到的鱼，很新鲜。吃鱼吗？"]};
/* ===== 牧师 ===== */
TALK_V56["lv_priest1"]={理念:["圣光是唯一的路。可走这条路的人，脚下沾着泥。我信圣光，也信泥——这才是完整的信仰。"],"传闻":["净化令的事，圣城吵了一夜。我不后悔主张它，也不后悔偷偷救那书商。两者都是真的。"],"修行":["你的心还不够安静。神只对安静的人说话。先安静下来，再问神。"],"闲聊":["（他翻开一页禁书，又合上。祷告室的灯，晃了一下。）"]};
TALK_V56["lv_priest2"]={理念:["这里没有神，只有夜。夜记得每个人——你做过什么，夜都替你记着。"],"传闻":["静默殿的蜡烛，今年烧得快了些。是风大了，还是夜长了？我不知道。"],"修行":["你还没有准备好，在黑暗里坐三百年。先从一夜开始吧。"],"闲聊":["（她轻吹了吹烛火，影子在墙上晃了晃。）"]};
TALK_V56["lv_priest3"]={理念:["神不分种族，黑暗也不分。我这盏灯，是替两种族的黑暗点的。"],"传闻":["银叶城的精灵们，最近在议论圣城的事。他们问我：净化令会烧到银叶城吗？我说：灯在，就不会。"],"修行":["你的光太亮，会烧着叶子。收一收，让光能照进树影里。"],"闲聊":["进来吧。这盏灯下，没有教条，只有人。"]};
/* ===== 盗贼 ===== */
TALK_V56["lv_thief1"]={理念:["暗影无神，故无戒——只有规矩：事成拂衣去，深藏身与名。我偷了一辈子，唯一不想偷的，是一个名字。"],"传闻":["码头最近有批「不该存在」的货。灰鼠在盯。你要是碰见黑市的货，绕开走。"],"修行":["跟着光走的人，看不见我。你想学暗影，先学会别让光找到你。"],"闲聊":["（阴影里传来一声极轻的响动。他走了，你没看见他走。）"]};
TALK_V56["lv_thief2"]={理念:["影子比人长——混血的代价，也是混血的礼物。我在两个世界之间活着，神座只有一个，我怕坐上去，就只剩一个世界了。"],"传闻":["商路上有句话：别在雾天跟灰雾谈生意。你记住就行，别的别多问。"],"修行":["你的影子太干净了。跟着我，我怕你被晒黑。先去泥里滚一圈再来。"],"闲聊":["巧了，我正好认识一个「不存在的人」。你要找的那个，我见过。"]};
/* ===== 游侠 ===== */
TALK_V56["lv_ranger1"]={理念:["你追的不是鹿，是路。路比神座长——神座只有一把椅子，路有无数条。"],"传闻":["林道最近有异兽出没。商队绕行了，狼群也跟着绕了。万物都在让路，你也让一让。"],"修行":["你的脚还太急。路不着急，你着急什么？跑起来之前，先学会走。"],"闲聊":["（她折了片叶子，吹了个调子。林子里有什么回应了一声。）"]};
TALK_V56["lv_ranger2"]={理念:["弓断了还能打——这是北方猎人的老话。弦没了，仗还没打完。"],"传闻":["雪原深处有东西在动。不是兽。是更深的。我盯着呢，你别进深雪区。"],"修行":["你的火气太大，会把雪原的兽都惊跑。稳下来，像雪一样静。"],"闲聊":["吃块干肉。雪原不认生人，认味道。"]};
/* ===== 骑士 ===== */
TALK_V56["lv_knight1"]={理念:["白，是因为我挡下的东西都不配留在上面。你进城，是想改变它，还是想利用它？"],"传闻":["净化令暂停三日。三日够书商们搬走一批书了。这是我当团长能做的全部。"],"修行":["你的剑还太飘。守护的剑，要沉。沉到能替别人挡下东西。"],"闲聊":["来，按个手印。你是它认识的新人。"]};
TALK_V56["lv_knight2"]={理念:["我的剑，只守值得守的东西。平民窟教会了我：善和恶，不在教义里，在人做的事里。"],"传闻":["枢机院又要开会了。我去劝，不一定有用，但总要有人去劝。"],"修行":["你的剑还太年轻，没见过值得守的东西。先去守一守，再谈剑。"],"闲聊":["（她解下头盔，露出一头短发，笑得坦荡。）"]};
/* ===== 术士 ===== */
TALK_V56["lv_smith1"]={理念:["铁不用重锤，铁用耐心。你摸到铁的纹理，它才会把秘密说给你听。"],"传闻":["铁峰堡的炉火今年旺了些。索林王说，是初火在等什么。你说，它在等什么？"],"修行":["你的火候还差一点。铁这东西，急不得。你急，它就裂。"],"闲聊":["来，帮我看看这把刀——它说它想变剑。"]};
TALK_V56["lv_smith2"]={理念:["造物该有自己的脾气。我铸的东西会活，不是傀儡术——是它自己愿意活着。"],"传闻":["矿洞里传出过锤声。格姆那老家伙，还活着。"],"修行":["你的手还太抖。铸师的手，要稳过心跳。稳住了，你铸的东西才有心跳。"],"闲聊":["别碰那柄锤——它今天心情不好。"]};
/* ===== 商人 ===== */
TALK_V56["lv_trade1"]={理念:["账算得精，不如算得久。不赚让人活不下去的钱——灾年不涨价，丰收年不压价，这是我四十年的账。"],"传闻":["灾年粮价，你涨不涨？答错了别来见我。答对了，账上记你一笔。"],"修行":["你的算盘太响，会惊着客。生意要静着做，钱才留得住。"],"闲聊":["这铺子开了四十年，货还是当年的货。你要什么？"]};
TALK_V56["lv_trade2"]={理念:["留一半，给风变卦。我抢过十年，还了三十年——风会变，船不能满。"],"传闻":["南方的海路最近有条新航线，海盗还没摸到。你要出海，走老路，稳。"],"修行":["你的秤还太满。做生意，要留一半。满秤的买卖，做不长。"],"闲聊":["上船？先说好，我的船只载两条路：发财的路，和还债的路。"]};
/* ===== 灵魂法师 ===== */
TALK_V56["lv_soul1"]={理念:["镜子会告诉我，我走这条路是为了看见别人，还是为了逃避自己。我还没准备好听那个答案。"],"传闻":["深渊裂隙那边，最近有回声。不是我的镜子里的。你要小心。"],"修行":["你身上有两道声音。一道很响，一道很轻。你想让我听哪一道？"],"闲聊":["（她侧着身，始终没有正眼看你。）"]};
/* ===== 兽王/隐世/散人 ===== */
TALK_V56["lv_兽王"]={理念:["（一声低沉的咆哮。兽王守的是兽群的规矩，不是人的。）"],"传闻":["（它盯着深渊的方向，喉咙里滚着闷雷一样的怒意。）"],"修行":["（它看了你很久，然后让开了路——这是它能给的最高礼遇。）"],"闲聊":["（它没理你，转身走向领地深处。）"]};
TALK_V56["lv_隐世"]={理念:["（他不说话。传闻说他早就不在了，可强者榜仍有一席。）"],"传闻":["（无。）"],"修行":["（无。）"],"闲聊":["（无。）"]};
TALK_V56["lv_散人"]={理念:["（独臂，不说话。他抬头看了你一眼，又低下头。）"],"传闻":["（无。）"],"修行":["（他伸出那只独臂，比了个「稳」的手势。）"],"闲聊":["（无。）"]};
/* ===== 委托（每传奇 1 条） ===== */
QUEST_V56["lv_mage1"]={title:"替树带一句话",tip:"「银叶城老树下的风声，比信鸽快。你要是去北境，替我问问凯·青焰：那盏灯，亮了吗？」",reward:{reading:""}};
QUEST_V56["lv_mage2"]={title:"寻找奥伦",tip:"「我走不开。你要是遇见一个叫奥伦·星弦的法师，告诉他：塔没塌，就是灯灭了一盏。星徽，还给他留着。」",reward:{reading:""}};
QUEST_V56["lv_mage3"]={title:"旧灯的火",tip:"「听说死亡沙漠深处有一种不灭的火。我出不去——你去看看，它能不能点亮旧灯。」",reward:{reading:""}};
QUEST_V56["lv_mage4"]={title:"林中的脚印",tip:"「结界外的脚印不是兽的。你替我去看看，别惊动它，回来告诉我它往哪走了。」",reward:{reading:""}};
QUEST_V56["lv_mage5"]={title:"那一页空白",tip:"「守望者塔有一页空白卷宗。你去圣城时，替我看看：那一页，有人写字了吗？」",reward:{reading:""}};
QUEST_V56["lv_war1"]={title:"矿道里的响动",tip:"「铁峰堡矿道最近有响动。我走不开，你去看看，回来学给我听——老兄弟们都在等消息。」",reward:{reading:""}};
QUEST_V56["lv_war2"]={title:"旧碑的下落",tip:"「听说北方雪原有一座旧碑，刻着兽人与人类的旧约。你去找找，找到的碑文，抄一份给我。」",reward:{reading:""}};
QUEST_V56["lv_war3"]={title:"关口的一封信",tip:"「铁门关有封军报要送去圣城，给罗兰·白盾。你顺路的话，替我送到——军报不比货物，不能丢。」",reward:{reading:""}};
QUEST_V56["lv_war4"]={title:"守城的账",tip:"「佣兵会有一笔「留给守不住的城」的账，存在老巷铺子。你去取来，路上别让人看见。」",reward:{reading:""}};
QUEST_V56["lv_war5"]={title:"海上的消息",tip:"「南方海盗最近又起来了。你出海的话，替我看看哪条航线还干净，回来告诉我。」",reward:{reading:""}};
QUEST_V56["lv_priest1"]={title:"那本禁书",tip:"「我祷告室有本禁书，读完了。你替我还回它原来的地方——书商巷第三家，夜半敲门。」",reward:{reading:""}};
QUEST_V56["lv_priest2"]={title:"新蜡烛",tip:"「静默殿的蜡烛要换了。你去买三支素烛，放在殿门口就行，别进来。」",reward:{reading:""}};
QUEST_V56["lv_priest3"]={title:"给圣城的信",tip:"「我写给克莱门主教一封信。你送到圣城，亲手给他——内容你别看。」",reward:{reading:""}};
QUEST_V56["lv_thief1"]={title:"还债",tip:"「自由城邦旧钟楼底下，埋着一样我偷了三十年没还回去的东西。你替我取出来，交给钟楼守夜人。」",reward:{reading:""}};
QUEST_V56["lv_thief2"]={title:"雾天的账",tip:"「商路上有笔账，压在雾里。你去码头找一个叫灰鼠的人，报我的名字，他会给你。」",reward:{reading:""}};
QUEST_V56["lv_ranger1"]={title:"追鹿",tip:"「白鹿往北跑了。你替我看看它往哪去了，别追，只看。」",reward:{reading:""}};
QUEST_V56["lv_ranger2"]={title:"深雪区的记号",tip:"「深雪区边缘有个记号，是我留的。你去看看还在不在——在，雪原就还稳。」",reward:{reading:""}};
QUEST_V56["lv_knight1"]={title:"书的护送",tip:"「圣城书商巷有一批书要送去银叶城。你替我护送——书比命贵，至少我是这么信的。」",reward:{reading:""}};
QUEST_V56["lv_knight2"]={title:"平民窟的药",tip:"「平民窟的老医馆缺药。你替我送一批药过去，报我的名字，不用给钱。」",reward:{reading:""}};
QUEST_V56["lv_smith1"]={title:"剑的愿望",tip:"「那把刀说它想变剑。你替我去矿洞找一块老铁——格姆认得那种铁。」",reward:{reading:""}};
QUEST_V56["lv_smith2"]={title:"炉火的信",tip:"「替我送一封信给索林王。信里写的是老铸师最后一句话——我一直没敢亲自去说。」",reward:{reading:""}};
QUEST_V56["lv_trade1"]={title:"人情账",tip:"「老巷铺子有笔「不赚的钱」记在账上。你替我把账上的货送到灾区的粮站，钱我出，别说是我的。」",reward:{reading:""}};
QUEST_V56["lv_trade2"]={title:"还回去的东西",tip:"「我船舱里锁着一批当年抢来的东西。你替我还回去——地址在箱子上，一件一件还。」",reward:{reading:""}};
QUEST_V56["lv_soul1"]={title:"一盏灯",tip:"「深渊裂隙边，有一盏我留的灯。你替我去看看它熄了没有——熄了，就别告诉别人。」",reward:{reading:""}};
QUEST_V56["lv_兽王"]={title:"兽群的委托",tip:"「（它用爪子在地上划出深渊的方向，又划出一条绕过深渊的路。它要你走那条路，替它看看。）」",reward:{reading:""}};
QUEST_V56["lv_隐世"]={title:"（无人委托）",tip:"（他不说话，也不接你的话。）",reward:{reading:""}};
QUEST_V56["lv_散人"]={title:"（无言委托）",tip:"（他看了你很久，递给你半块干粮，然后指了指北方。）",reward:{reading:""}};


/*v56inj:story*/
/* ---- 魔法师 ---- */
N["v56s_mage1_a"]=function(){return{title:"银冠",text:["老树下的风很轻。奥薇恩坐在树根上，指尖转着一片叶子，叶子绕着她的手指转圈，像在陪她。","「你来得正好。」她没抬头，「叶子说，你身上有北地的味道。北地风大，人容易把自己弄丢。」","她把叶子放回树根：「我年轻时打遍北境，赢了每一场该赢的仗。然后我停了——赢太久的人，容易忘了法术是为什么存在的。」","「有人问我为什么不争神座。你猜我怎么答？」"],pace:"normal",options:[{t:"「神座只有一把椅子，路有无数条。」",go:"v56s_mage1_b"},{t:"「……你见过神座？」",go:"v56s_mage1_c"}]}};
N["v56s_mage1_b"]=function(){return{title:"银冠",text:["奥薇恩笑了，笑得像叶子转圈：「你倒会抄我的话。」","「神座空着两千年了。星落塔第七层的灯，亮了又熄，没有一盏是为自己点的。法师们把这叫『空座之惑』——不是没人想坐，是没人觉得自己配坐。」","她顿了顿：「寂光陨落前留了一句话：坐上去不难，难的是坐上去之后，你还记得自己是个人。」","「我教了三百年的孩子认元素。你要是哪天也赢了太多，就回来看看这棵树——它不会问你争不争神座，它只问你，累不累。」"],pace:"normal",options:[{t:"（向她告辞，回到银叶城）",go:"faction_elf_main"}]}};
N["v56s_mage1_c"]=function(){return{title:"银冠",text:["奥薇恩把玩着那枚银冠，像把玩一枚旧铜钱：「见过。我成神那天，自己为自己戴上的。」","「可我没坐上去。我站在神座前，看见它只容得下一个人——而我身后，还有三千个孩子等着学认元素。」","「神座不会老，孩子会。我选了会老的那边。」","她把银冠收进袖里：「回去吧。北地的风要是太冷，就想想这棵树。」"],pace:"light",options:[{t:"（颔首离去）",go:"faction_elf_main"}]}};
N["v56s_mage2_a"]=function(){return{title:"雾塔",text:["星落塔第七层的风，比楼下更冷。洛·晨雾站在窗边，衣角纹丝不动，像在等风先开口。","「你来得正好。」他说，「帮我看看，这道元素法则，第七层能不能再刻一层。」","他指的是一道刻在窗台上的旧纹路——不是他刻的。纹路很旧，旧得像十二年前。","「奥伦离塔那天，把首席的星徽留在这窗台上。我捡起来，戴上，一戴十二年。」他说这话时，没有看星徽。","「我没资格看它。它本来不属于我。」"],pace:"normal",options:[{t:"「那你还戴着？」",go:"v56s_mage2_b"},{t:"「他为什么走？」",go:"v56s_mage2_c"}]}};
N["v56s_mage2_b"]=function(){return{title:"雾塔",text:["洛·晨雾沉默了很久。风从窗缝里挤进来，吹得他衣角终于动了一下。","「戴着，是为了记住：这位置是借的。我替奥伦管着学院，管到他回来——或者管到我确认，他不会回来了。」","「塔里的老执事说，我每年双子星升起的夜里都失眠。他们说得对。我站在观星台，看这枚星徽，像看一道没做完的题。」","他忽然转头看你：「你要是遇见奥伦，告诉他：塔没塌，就是灯灭了一盏。星徽，还给他留着。」"],pace:"normal",options:[{t:"「我记下了。」（离开观星台）",go:"academy_elda_hub"}]}};
N["v56s_mage2_c"]=function(){return{title:"雾塔",text:["「他走，是因为在观星台看到了什么东西。」洛·晨雾的声音低下去，「他走那天只说了一句话：『这塔的灯，照不见我要去的地方。』」","「十二年了。我管理着学院的一切，唯独没弄明白他看到了什么。星落塔的灯照不见的地方……我翻遍了所有卷宗，也没有一处记载。」","他抬起手，指腹轻擦过那道旧纹路：「有时候我怀疑，他看到的不是外面，是里面——是这枚星徽底下压着的什么东西。」","「你要是查到了什么，回来告诉我。这塔的第七层，永远给你留着窗。」"],pace:"normal",options:[{t:"（郑重应下，离开）",go:"academy_elda_hub"}]}};
N["v56s_mage3_a"]=function(){return{title:"青焰",text:["北地的雪原上，凯·青焰蹲在一处熄灭的篝火边，看了很久。火堆里埋着一截焦黑的木，他伸手拨了拨，像在给谁整理衣襟。","「你说，火这种东西，到底是烧完了才算活过，还是亮着才算？」他问，没有抬头。","「那盏旧灯，是村里唯一的东西。全村人轮流添油，说灯不灭，村不亡。东军破村那夜，我抱着灯逃出来，灯熄了。」","他摩挲着腰间那盏熄灭的旧灯：「我成了法师。烧过桥，烧过城，烧过一整支军队。可这盏灯，再没亮过。」"],pace:"normal",options:[{t:"「也许它不是在等火，是在等人。」",go:"v56s_mage3_b"},{t:"「让我看看那盏灯。」",go:"v56s_mage3_c"}]}};
N["v56s_mage3_b"]=function(){return{title:"青焰",text:["凯·青焰抬起头。他的眼睛在雪光里显得很淡，像一层冻过的灰。","「等人？」他重复了一遍，声音有点哑，「全村人都死了。我等谁？」","风卷过雪原，把篝火余烬吹散了一些。他把旧灯护在怀里，像护着最后一点热。","「……也许你说得对。我等的人，可能就是那个在火灭之后，还愿意蹲下来看灰烬的人。」","他站起来，把灯挂回腰间：「走吧。雪要大了。你要是路过死亡沙漠，替我问问——那里的火，是不是不灭的。」"],pace:"normal",options:[{t:"（点点头，转身走进风雪）",go:"north_tavern"}]}};
N["v56s_mage3_c"]=function(){return{title:"青焰",text:["凯·青焰犹豫了一下，把旧灯从腰间解下来，放在你面前。","灯身是铜的，磨得发亮——那是被手摩挲了无数遍的光泽。灯芯只剩短短一截，焦黑。","「你碰碰看。」他说。","你伸手碰了碰灯芯。指尖传来一点温热，不是火焰的热，是另一种——像有人刚握过它。","「……它还记得。」他收回灯，声音低得几乎听不见，「村灭那夜，我把它抱在怀里跑了三天三夜。它替我挡过一箭。」","「就凭这一点，我欠它一辈子。」"],pace:"normal",options:[{t:"（无言，目送他消失在雪里）",go:"north_tavern"}]}};
N["v56s_mage4_a"]=function(){return{title:"银叶",text:["世界树的根下，瑟琳·银冠坐在一片巨大的树根上，怀里抱着一卷发黄的册子。风穿过树冠，她的浅金色眼睛眯了眯。","「你身上有树喜欢的味道。」她把一片树叶递给你，「拿着。树说，你会在树下坐一会儿。」","你接过树叶，在另一条树根上坐下。树皮粗糙，坐着却有种说不出的安稳。","「我二十岁就摸到了传奇的门槛。可我没继续走——我选了结界，选了守树。」她翻开那卷册子，「这里面记着世界树听见的所有秘密。你要听一条吗？」"],pace:"normal",options:[{t:"「听。」",go:"v56s_mage4_b"},{t:"「为什么选守树？」",go:"v56s_mage4_c"}]}};
N["v56s_mage4_b"]=function(){return{title:"银叶",text:["瑟琳翻到某一页，指尖点了点一行字。那页的墨迹很淡，像是很多年前写的。","「三千年前，有个法师在世界树下坐了一夜。树听见他念了一整夜的名字——他在背每一个死在他法术下的人。」","「第二天他走了，再没来过。树把那些名字记住了。」她合上册子，「树不评判。它只是记着。谁来过，谁做过什么，树都记着。」","「我守的结界，护的其实不是树——是树记住的那些东西。它们需要一个地方待着，不至于被风刮散。」"],pace:"normal",options:[{t:"（沉默良久，把树叶放回树根）",go:"faction_elf_main"}]}};
N["v56s_mage4_c"]=function(){return{title:"银叶",text:["「你们人类总想登顶。」瑟琳笑了笑，声音像风穿过树叶，「我们精灵，只想活得久一点，多听几遍风。」","「奥薇恩老师教过我：赢了太久的人，最容易忘了法术是为什么存在的。树不用赢——它活一万年，本身就是答案。」","她抬手，让一片落叶在你面前转了一圈：「你看，叶子不急着落地。你急什么？」","「去走你的路吧。树会记住你来过——下次路过，它认得你。」"],pace:"normal",options:[{t:"（行了一礼，走出结界）",go:"faction_elf_main"}]}};
N["v56s_mage5_a"]=function(){return{title:"灰书",text:["守望者塔的档案室，光线很暗。伊尔·灰书坐在长桌尽头，那卷灰布包着的书摊开在面前，他正往一页空白的纸上写着什么。","「你想看哪一页？」他头也不抬，「先说好，看完要还。」","你走近。桌上摊开的卷宗密密麻麻，全是关于七印的记录——哪一年松了多少，哪一年补了多少，墨迹的颜色深浅不一，横跨几十年。","「第七印，今年松了一寸。」他说，「三千年来，它松了十七次。每一次我都补了档案。」他抬起头，「可你知道最可怕的是什么吗？」"],pace:"normal",options:[{t:"「什么？」",go:"v56s_mage5_b"}]}};
N["v56s_mage5_b"]=function(){return{title:"灰书",text:["「最可怕的，是档案越补越厚，可能看懂的人，越来越少。」伊尔·灰书合上那卷灰布书，「这卷书里记着七印的每一次松动，可谁有资格看它？谁敢看它？」","他顿了顿：「守望者内部说，我的卷宗里有一页是空白的——那是留给『将来能彻底封住七印的人』的。我写了三千年，那一页还是空白。」","「你要是想成为那个名字，先别急着问怎么封印。先问自己：你愿意为一件与你无关的、三千年后的事，搭上一辈子吗？」","「想清楚了，再来看这一页。」他把灰布书推向你，「今晚你可以替我看一夜。」"],pace:"normal",options:[{t:"（在档案室坐了一夜，天亮才离开）",go:"event_hub"}]}};
/* ---- 战士 ---- */
N["v56s_war1_a"]=function(){return{title:"铁壁",text:["铁峰堡的城墙上，格罗·铁壁坐在墙垛边，用一块旧布擦盾。盾面上密密麻麻的凹痕，在夕阳里泛着深浅不一的光。","「来，帮我看看，这道新凹痕，够不够深。」他举起盾，指着一道浅浅的印子，「三天前，替一个小姑娘挡的。她非要站在城头看她爹回城——箭来的时候，她没躲。」","「盾这东西，不是用来挡自己的，是用来让别人敢往前走的。」他擦盾的动作很慢，像在给老朋友掸灰。","「这两百年，我挡过三场围城。每道凹痕后面，都站着一个人——他们现在都活得好好的，这才是盾该有的样子。」"],pace:"normal",options:[{t:"「你后悔过吗？」",go:"v56s_war1_b"},{t:"「让我看看最深的凹痕。」",go:"v56s_war1_c"}]}};
N["v56s_war1_b"]=function(){return{title:"铁壁",text:["格罗·铁壁沉默了一会儿，把盾立在墙垛边。","「后悔过。塌方那夜，我用自己的背顶住落石，救了整队矿工。可那年我才十六岁，不知道背会疼一辈子。」他拍了拍腰，「现在一到阴雨天，这里就发酸。」","「可我从不后悔拿起盾。你问我后不后悔——不如问我，要是重来一次，我还挡不挡。答案是挡。一万次也是挡。」","他笑了，笑声在城墙上滚得很远：「挡在别人前面，是这世上最划算的买卖。你看我这两百年，换了三百七十二道凹痕，和三百七十二个活人。」"],pace:"normal",options:[{t:"（向他行了个战士礼）",go:"city_ironpeak_tavern"}]}};
N["v56s_war1_c"]=function(){return{title:"铁壁",text:["格罗·铁壁把盾转过来。盾心有一道极深的凹痕，几乎贯穿盾面，边缘的金属像被什么咬掉了一块。","「这是第一场围城。铁门关还没修好，北边来人，一夜之间围了城。我用这面盾，在城门洞里顶了三天。」","「盾裂了，人没退。城也没破。」他的手指抚过那道凹痕，「后来铁匠说，这面盾废了，换一面吧。我说不换——它替我挡过的东西，都在上面。」","「凹痕是盾的记性。人活一辈子，总得有点东西替你记着。」"],pace:"normal",options:[{t:"（郑重点头，离开城墙）",go:"city_ironpeak_tavern"}]}};
N["v56s_war2_a"]=function(){return{title:"赤峰",text:["草原的篝火边，喀兰·赤峰用刀尖挑着一块烤肉，翻了个面。火苗舔着肉，油脂滴进火里，滋滋响。","「吃。」他递给你一块，「吃饱了，我们聊点比打仗重要的事。」","你接过肉。草原的风很大，吹得火苗东倒西歪，可喀兰坐着，像一棵扎了根的树。","「我在找一块旧碑。碑上刻着兽人和人类第一份和平条约——三千年前的。」他咬了一口肉，「有人把它藏起来了。藏它的人，不想让两个种族想起来：我们也曾好好说过话。」"],pace:"normal",options:[{t:"「找到了会怎样？」",go:"v56s_war2_b"},{t:"「我帮你找。」",go:"v56s_war2_c"}]}};
N["v56s_war2_b"]=function(){return{title:"赤峰",text:["「找到了，我就把它重新立起来。」喀兰·赤峰说，「立在草原和人类地界的交界处。让往来的商队都看见：这地界上，不光有刀和血，还有过一纸约定。」","「我成传奇那年，王庭给我立了石像。我让人把石像的脸朝南，对着人类的地界——让他们看看，草原上不是只有仇恨。」","「我屠过村，也守过村。草原上的规矩很简单：你敬狼，狼敬你。人类要是肯先敬草原一步，我就敢用这把刀，替他们挡一夜的狼。」","他撕下一块肉递给你：「你走的地方多。要是听见旧碑的下落，回来告诉我——草原记你的情。」"],pace:"normal",options:[{t:"（记下此事，与他对饮）",go:"faction_orc_main"}]}};
N["v56s_war2_c"]=function(){return{title:"赤峰",text:["喀兰·赤峰大笑，笑声惊起一片篝火边的火星。","「好！草原认你！」他解下刀柄上缠着的红布，系在你手腕上，「这是我母亲的头巾。她死在兽人与人类的旧战里——我带着它，是为了不忘记战争长什么样。」","「你要是真能找到旧碑，就把它带回来。带不回来，抄一份碑文也好。」他顿了顿，声音沉下来，「让我母亲那一代人看看：他们没白死，这地界，还能好好说话。」"],pace:"normal",options:[{t:"（收下红布，郑重应下）",go:"faction_orc_main"}]}};
N["v56s_war3_a"]=function(){return{title:"长风",text:["铁门关城头，风大得要把人吹跑。秦·长风站在垛口边，左臂的木臂按在城砖上，披风被吹得笔直，像一面活着的旗。","「上来！站这儿看，你才知道什么叫北境！」他朝你吼。","你站到他身边。北境的风灌进衣领，冷得像刀刮。城墙下，商队的灯火蜿蜒向北，像一条缓慢移动的河。","「我十五岁入伍，打过大小四百余仗。断左臂那场，守了铁门关七天七夜——用右手单手使枪。」他拍了拍木臂，「这木臂里刻着北境要塞的地图。我把它带在身上，是因为我答应过它们：我在，它们就在。」"],pace:"normal",options:[{t:"「七天七夜……怎么撑下来的？」",go:"v56s_war3_b"},{t:"「木臂里那张纸，写着谁的名字？」",go:"v56s_war3_c"}]}};
N["v56s_war3_b"]=function(){return{title:"长风",text:["秦·长风沉默了一会儿。风把他的披风扯得猎猎响。","「撑下来？不是撑，是熬。第一天靠杀意，第三天靠麻木，第五天靠城墙——你想，你背后是整座城的人，他们都在等你告诉他们：不用逃。」","「第七天，援军到了。我靠在城垛上，手抖得拿不住枪。老兵给我递水，我喝了三口，吐了两口——全是血。」","他笑了笑，笑容在风里很快就散了：「关里的老兵说：那不是七天，是他替整座城，多活了七天。其实我记不清那七天的事了。我只记得，城墙没破。」","「城在，我在。这不是豪言，是账。」"],pace:"normal",options:[{t:"（沉默良久，与他并立城头）",go:"north_tavern"}]}};
N["v56s_war3_c"]=function(){return{title:"长风",text:["秦·长风的手按在木臂上，停了一会儿。","「……你问这个，没人敢问。」他轻声说，「写着一个女人的名字。她是我断臂那年，在关外收尸的。」","「她把我从尸堆里拖出来，用她的裙子给我包扎。我醒过来问她叫什么，她说：『等你活着守完这座城，我再告诉你。』」","「后来她在东军的一次夜袭里死了。我没来得及问她名字。我托人查了三个月，查到一个——不知道是不是她。」","他拍了拍木臂：「所以我把它刻在木臂里，带着上城头。这样每次守城，我都觉得，她在看着我。」"],pace:"normal",options:[{t:"（无言，向他行了一礼）",go:"north_tavern"}]}};
N["v56s_war4_a"]=function(){return{title:"孤山",text:["交汇城的酒馆角落，叶·孤山一个人坐着，面前一壶酒，一只杯。他斟满，没有喝，看着杯沿。","「坐。这杯请你——赌你将来守得住一座城。」他把酒杯推过来。","你坐下。酒馆里人声嘈杂，可这个角落安静得像另一间屋子。","「我三百人的佣兵会，从来不参加聚会。孤山嘛，站得远才看得清。」他自嘲地笑了一下，「守城守久了，就不太会跟人热络了——你习惯了替一城人操心，就忘了怎么替自己高兴。」"],pace:"normal",options:[{t:"「为什么不接大单了？」",go:"v56s_war4_b"},{t:"「那笔『留给守不住的城』的账，是真的吗？」",go:"v56s_war4_c"}]}};
N["v56s_war4_b"]=function(){return{title:"孤山",text:["叶·孤山抿了一口酒，慢悠悠地开口。","「不接大单，是因为我见过太多城破了。」他摩挲着杯沿，「大单打的是名声，守城打的是命。一座城破，城里的人不会问你名声多响——他们只会问，你为什么不早点来。」","「我成名于一场围城。那城是自由城邦的卫星城，守军跑了，我带着三百佣兵守了三个月。城没破。」","「从那以后，我只接『守城』的单。而且从不涨价——城守住了，商路就通，商路通了，你们这些骂我傻的人，才有钱付账。」","他朝你举了举杯：「这个道理，你什么时候想通了，什么时候就能守得住一座城。」"],pace:"normal",options:[{t:"（举杯回敬）",go:"faction_free_tavern"}]}};
N["v56s_war4_c"]=function(){return{title:"孤山",text:["叶·孤山笑了，笑得有点淡：「你连这个都听说了。」","「是真的。佣金结算时，我总要扣下一成，记在账上，说是『留给守不住的城』。」他指了指酒馆外，「那笔账存在老巷铺子，文森替我管着。他那人，账算得精，也守得住。」","「为什么留这笔钱？因为我知道，总有一座城会在我到之前破掉。我救不了那一座，但至少能让破城之后的人，有钱买口热粥。」","「守城的人，心要凉一点——可凉不是冷。凉，是知道自己救不了所有人，还愿意救下一个。」"],pace:"normal",options:[{t:"（记在心里，默默喝酒）",go:"faction_free_tavern"}]}};
N["v56s_war5_a"]=function(){return{title:"断江",text:["南方港城的断江酒馆，罗·断江坐在柜台后，用一块旧布擦一只酒杯。杯子擦得锃亮，像新的。","「坐。今天新到的鱼，很新鲜。」他头也不抬。","你坐下。柜台后的墙上，横着一根房梁，房梁上插着一柄旧枪，枪尖朝海。","「那是我的旧枪。插在那儿二十年了。」他朝房梁努了努嘴，「枪尖朝海——留给将来守海的人。」","「年轻的时候，一人一枪，拦过一条满载海盗的江船。本可以封侯拜将，可我退役了。打够了，就该过自己的日子。」"],pace:"normal",options:[{t:"「打够了……是种什么感觉？」",go:"v56s_war5_b"},{t:"「那柄枪，还会有人拔下来用吗？」",go:"v56s_war5_c"}]}};
N["v56s_war5_b"]=function(){return{title:"断江",text:["罗·断江放下杯子，想了一会儿。","「打够了，就是你半夜醒来，不用先摸枕头底下的刀了。」他给自己倒了杯酒，「我拦江那夜之后，整整十年，睡觉都是睁一只眼的。」","「后来我开了这酒馆。第一天打烊，我躺下，一觉睡到天亮——那是我这辈子睡得最沉的一觉。」","「神座那张椅子，不如我酒馆里的旧木凳坐着舒服。有人觉得我是可惜了，可我知道：我能一觉睡到天亮，这比什么传奇都值。」","他给你也倒了一杯：「你要是哪天也打累了，来这儿坐坐。鱼管够。」"],pace:"normal",options:[{t:"（与他碰杯，听了一夜海风）",go:"city_nanfang_tavern"}]}};
N["v56s_war5_c"]=function(){return{title:"断江",text:["罗·断江抬头看了看房梁上的旧枪，视线很平静。","「会。总会有人把它拔下来的。」他说，「这世上的海，总有人要守。我守不动了，自然有年轻人来。」","「我留着那柄枪，不是念旧——是给后来人留个念想：你看，有人在这儿守过二十年，你也可以。」","「南方的传奇只有两位，我是最不『传奇』的那位。可酒馆里的水手都叫我一声『断江爷』——这个名号，我比当传奇听得舒坦。」"],pace:"normal",options:[{t:"（点点头，记下这个约定）",go:"city_nanfang_tavern"}]}};
/* ---- 牧师 ---- */
N["v56s_priest1_a"]=function(){return{title:"圣言",text:["大教堂的回廊里，克莱门·圣言站在一扇彩窗前，光线透过玻璃落在他脸上，半明半暗。","「你身上有犹豫的味道。来，跟我说说，你在犹豫什么。」","你斟酌了一下：「犹豫……是不是所有坚持，都要付出代价。」","克莱门没有立刻回答。他看了那扇彩窗很久，窗上的圣像在光里沉默。","「我主持过三次大公会议，每一次都让教会内部的裂痕更深——又更稳。」他终于开口，「我主张净化令，可我也偷偷救过被净化令收缴的书商。你问我犹豫什么？我每天都在犹豫。」"],pace:"normal",options:[{t:"「那你还怎么走下去？」",go:"v56s_priest1_b"},{t:"「你救书商的事，是真的？」",go:"v56s_priest1_c"}]}};
N["v56s_priest1_b"]=function(){return{title:"圣言",text:["克莱门·圣言笑了笑了一下，笑意没有到眼睛里。","「走下去，不是因为不犹豫，是因为犹豫也得有个方向。」他转过身，「圣光是唯一的路——这句话我说了几十年，可我比谁都清楚，走这条路的人，脚下沾着泥。」","「我信圣光，也信泥。泥里埋着那些被净化令碾碎的人，他们也是圣光照过的地方。」","「枢机院的人觉得我是最矛盾的一个。可我知道，正是因为我矛盾，净化令才没有走到最黑的那一步。」他顿了顿，「矛盾，有时候是神给人留的刹车。」"],pace:"normal",options:[{t:"（沉默许久，行了一礼）",go:"faction_church_main"}]}};
N["v56s_priest1_c"]=function(){return{title:"圣言",text:["克莱门·圣言沉默了一会儿，从袖中取出一本书。封面被摩挲得发旧，边角卷起。","「是真的。这本书，是书商巷第三家的。净化令收缴的书，本该送去焚毁——我留下了它。」","「每晚读一页，然后向神忏悔。可忏悔什么呢？忏悔我救了一本书？还是忏悔我没能救下更多？」","他把书放回袖中：「我主张净化令，是因为我相信圣光是唯一的路；我救书商，是因为我见过书里写的东西——有些话，不该被火吞掉。」","「这两件事在我心里打架，打了二十年。但我不后悔。因为如果我哪一天不矛盾了，那才是我真正背叛圣光的时候。」"],pace:"normal",options:[{t:"（无言，退出了回廊）",go:"faction_church_main"}]}};
N["v56s_priest2_a"]=function(){return{title:"静烛",text:["静默殿的烛光很暗，暗到只能照见玛格达·静烛的半张脸。她的眼睛在黑暗里待得太久，见不得强光，说话的声音轻得像怕惊动什么。","「你来了。坐吧，这里没有神，只有夜。」","你在烛光边坐下。殿里很静，静到能听见烛芯燃烧的细响。","「我十二岁进静默殿，守了三百年夜。我的蜡烛从没熄灭过——不是守得好，是这殿里的夜，怕我。」她低声说，「教会要升我当大主教，我拒绝了。我走了，谁来替神守这段最黑的光？」"],pace:"normal",options:[{t:"「最黑的光……是什么？」",go:"v56s_priest2_b"},{t:"「那支蜡烛，为什么用头发搓芯？」",go:"v56s_priest2_c"}]}};
N["v56s_priest2_b"]=function(){return{title:"静烛",text:["玛格达·静烛看着烛火，火光在她眼里跳了一下。","「太阳升起前那段最黑的光。」她说，「圣临——就是现在教会拜的那位神——成神前，是静默殿的守夜人。他守了三百年夜，没见过太阳升起。他守的，就是这段光。」","「他成神那天，晨祷的钟没敲。他推开静默殿的门，站在晨光里说：我不用再守夜了。」","「他走了，可夜还在。总得有人接着守。」她伸手，轻拢了拢烛火，「三百年了，我守着这段黑——不是等他回来，是替所有还在夜里的人，把这段黑守过去。」"],pace:"normal",options:[{t:"（在静默殿坐了一夜，没有惊动任何人）",go:"faction_church_main"}]}};
N["v56s_priest2_c"]=function(){return{title:"静烛",text:["玛格达·静烛的手停在烛台上，很久没有说话。","「……你连这个都听说了。」她的声音更轻了，「那芯，是用初代守夜人的头发搓的。她是圣临的未婚妻。」","「圣临守夜三百年，她等了他三百年。他成神那天，没有带她走。她后来老死在静默殿的侧屋——临终前，把头发留给了我。」","「她说：『替我看着他守的这段夜。要是他哪天回来，告诉他，我一直在。』」","「圣临没有回来过。三千年了，没有回来过。可我还是守着这烛——替她等，也替夜等。」"],pace:"normal",options:[{t:"（沉默良久，轻退出了静默殿）",go:"faction_church_main"}]}};
N["v56s_priest3_a"]=function(){return{title:"银冠",text:["银叶城的小教堂门口，艾诺尔·银冠正在给门口的一盏油灯添油。教堂很小，可收拾得很干净。","「进来吧，这盏灯，是替两种族的黑暗点的。」她笑了笑。","你走进教堂。里面供奉着一尊神像——面容是精灵的，却穿着人类牧师的袍子。","「我是在圣城长大的精灵。养父母是圣城的牧师。我见过教会最好的一面，也见过最坏的一面。」她看着那尊神像，「所以我回来，建了这座小教堂。只有精灵会来——但灯，是对所有人点的。」"],pace:"normal",options:[{t:"「这尊神像……为什么是精灵面容？」",go:"v56s_priest3_b"}]}};
N["v56s_priest3_b"]=function(){return{title:"银冠",text:["艾诺尔·银冠看着那尊神像，眼神温和。","「因为只有我能看见神像的表情。」她轻声说，「我雕它的时候，照着两族的记忆雕的——让精灵看见亲切，让人类看见熟悉。」","「神不分种族，黑暗也不分。可信徒是人，人需要一张看得懂的脸。」她顿了顿，「我在圣城见过教会用净化令烧掉别人的信仰。我不想银叶城也变成那样——所以我让神，先长出一张精灵的脸。」","「有一天，要是两族能坐在同一盏灯下做祈祷——那这尊像，就可以换回原来的样子了。」她笑了笑，「我等着那一天。」"],pace:"normal",options:[{t:"（在教堂里坐了一会儿，替她点了灯）",go:"faction_elf_main"}]}};
/* ---- 盗贼 ---- */
N["v56s_thief1_a"]=function(){return{title:"夜枭",text:["暗巷的阴影里，传来一个声音，听不出方位：「跟着光走的人，看不见我。说吧，你找我，是想偷什么，还是想还什么？」","你站定：「……想听一个故事。」","阴影沉默了一会儿。然后，半扇门开了一道缝，门缝里透出一点光，照见一只手——指节很长，指甲修剪得很干净。","「故事？」那声音里带了一点极淡的笑意，「我偷了一辈子东西，还没人敢来向我讨故事。坐吧——隔着这道门，我讲给你听。」"],pace:"normal",options:[{t:"「你接任阁主那天，杀了前一任？」",go:"v56s_thief1_b"},{t:"「旧钟楼底下埋着什么？」",go:"v56s_thief1_c"}]}};
N["v56s_thief1_b"]=function(){return{title:"夜枭",text:["门缝里的光晃了一下。","「对。这是暗影阁的规矩：阁主之位，从来不是传的，是抢的。我杀了前一任，坐上那把椅子。」那声音顿了顿，「可坐上之后，我做的第一件事，是封了暗影阁最深的库房。」","「里面堆着历代阁主偷来的『不该偷的东西』。王冠、国玺、信件、还有……人心。」他说，「这些东西太重了。历任阁主都把它锁着，假装不存在。」","「我说：这些是债，要还。从那以后，暗影阁不再是『偷』，是『收债还债』。」他笑了笑了一声，「你可能觉得我虚伪——可一个连自己偷的东西都不敢还的人，没资格当阁主。」"],pace:"normal",options:[{t:"（门缝后的光灭了，你知道他走了）",go:"faction_free_tavern"}]}};
N["v56s_thief1_c"]=function(){return{title:"夜枭",text:["门缝后的声音沉下去：「……你连这个都知道。」","「旧钟楼底下，埋着一件我偷了三十年都没能还回去的东西。每年除夕，我都会去一趟，站在钟楼下，想一想。」","「那是我年轻时偷的——从一个死人身上。他临死前攥着它，攥得很紧。我掰开他的手拿走了。三十年来，我查遍了所有线索，找不到它该还的地方。」","「它没有主人了。可它不该在我手里。」他说，「你要是能替我找到它该回的地方，钟楼底下的门，会为你开一次。」"],pace:"normal",options:[{t:"（记下此事，退出暗巷）",go:"faction_free_tavern"}]}};
N["v56s_thief2_a"]=function(){return{title:"灰雾",text:["商队的马车边，薇·灰雾坐在车辕上，晃着腿。她的影子在夕阳下拉得很长——长到有点不自然。","「听说你在找一个『不存在的人』？巧了，我认识一个。」她笑吟吟地说。","你看着她。她伸了个懒腰，影子跟着晃了晃：「我白天是行商，晚上是灰雾。两个世界都不愿说的话，我都愿意偷来卖。」","「我成传奇那天，两个世界都沉默了——他们都不承认我，可他们都怕我。」她眨眨眼，「你知道这叫什么吗？这叫活得自由。」"],pace:"normal",options:[{t:"「影子为什么比人长？」",go:"v56s_thief2_b"},{t:"「你卖消息，卖到什么为止？」",go:"v56s_thief2_c"}]}};
N["v56s_thief2_b"]=function(){return{title:"灰雾",text:["薇·灰雾看了看自己的影子，笑得像在讲别人的事。","「混血的代价，也是混血的礼物。我一半精灵，一半人类——精灵说我半调子，人类说我是杂种。」她晃了晃脚，「影子比人长，是因为我走在两个世界之间，两个世界的光，都只照我一半。」","「可你知道吗？正因为我两半都照不全，我才能看见两个世界都看不见的东西。」她压轻声音，「比如，精灵议会不想让人知道的事，和人类教会不想让精灵知道的事——它们在我这儿，是同一笔买卖。」","「影子长，路就宽。我不恨它。」"],pace:"normal",options:[{t:"（若有所思，与她道别）",go:"faction_free_tavern"}]}};
N["v56s_thief2_c"]=function(){return{title:"灰雾",text:["薇·灰雾收起笑，认真了一瞬。","「卖消息卖到什么为止？卖到它伤人的时候为止。」她说，「我偷过皇冠，偷过国玺，偷过人心——可我有一条底线：不卖会让一个活人送命的消息。」","「做我这一行，什么都能标价，只有一样不行：人命。」她顿了顿，「这规矩，是从一个差点害死我的人身上学会的。」","「你要是哪天听到有人用我的名头卖要命的消息——那人不是我。你替我戳穿他。」"],pace:"normal",options:[{t:"（郑重应下，她笑着朝你挥挥手）",go:"faction_free_tavern"}]}};
/* ---- 游侠 ---- */
N["v56s_ranger1_a"]=function(){return{title:"逐风",text:["林间小路上，艾琳·逐风靠着一棵树，手里折了一片叶子，放在唇边，吹出一个很短的调子。林子里，有什么东西回应了一声。","「赶路？正好，我也赶路。」她收起叶子，笑了一下。","你与她并肩走了一段。她的弓背在背上，弓身是活的——世界树枝条做的，会自己调整弦的松紧。","「我年轻时追过一只白鹿，追了整整一年。追过山，追过河，追到世界树脚下，白鹿不见了——树根下坐着一个老人，是初代林语者留下的一缕记忆。」她边走边说，「老人说：你追的不是鹿，是路。」"],pace:"normal",options:[{t:"「后来呢？」",go:"v56s_ranger1_b"},{t:"「那只鹿，还在追吗？」",go:"v56s_ranger1_c"}]}};
N["v56s_ranger1_b"]=function(){return{title:"逐风",text:["艾琳·逐风踩着落叶，脚步很轻，像怕惊动路。","「后来，我不再追猎物了。我追路。」她说，「成了大巡守，可我一年里有一半时间不在巡守所——我在路上。」","「林子里的巡守笑我：大巡守不巡林，天天走路。可我知道，路才是林子的血脉。你守着路，林子自己会守着自己。」","「初代林语者走遍了所有森林，把双叶之环留在世界树顶。她没有成神——她说：路比神座长。神座只有一把椅子，路有无数条。」","她停下来，回头看你：「你要是有空，也走一条没人走的路试试。你会发现，路会认你。」"],pace:"normal",options:[{t:"（向她告别，走上林间岔路）",go:"faction_elf_main"}]}};
N["v56s_ranger1_c"]=function(){return{title:"逐风",text:["艾琳·逐风笑了，笑得像风吹过树梢。","「还在追。那只白鹿是林语者留给我的一道题。」她说，「我追了三百年的那只鹿——它每跑一段，我就多懂一段路。它其实不是在躲我，是在带我认路。」","「有人说我傻，追一只追不上的鹿。可我知道，等哪天我追上它了，我就该停下不追了——那才是真的没路可走了。」","「追着，就说明还有路。多好。」"],pace:"normal",options:[{t:"（会心一笑，与她分道）",go:"faction_elf_main"}]}};
N["v56s_ranger2_a"]=function(){return{title:"断弓",text:["雪原的避风处，一堆火正旺。贺·断弓坐在火边，弓横在膝上。弓断了一截，用兽皮缠着。","「吃点。雪原不认生人，认味道。」他递过来一块干肉。","你接过干肉坐下。火光把他的脸照得半明半暗。","「我这弓，断了十二年。用兽皮缠着，照样能打。」他拍了拍断处，「弓断了还能打——这是北方猎人的老话。人也是一样，断了胳膊，还能活。」"],pace:"normal",options:[{t:"「你打的是什么猎物？」",go:"v56s_ranger2_b"},{t:"「背囊里那根弓弦，是留给谁的？」",go:"v56s_ranger2_c"}]}};
N["v56s_ranger2_b"]=function(){return{title:"断弓",text:["贺·断弓往火里添了根柴，火苗窜了窜。","「打那些『不该存在』的猎物。」他说，「雪原深处的东西，有些不是野兽。它们从深渊那边过来，在雪下头爬，专挑落单的商队。」","「我原是镇北军的斥候。那场仗里，弓断了，我用半截弓捅死了三个追兵，救了整支斥候队。战后我退役，进了雪原——因为我见过那些东西。别人不认，我认。」","「断弓打不了远的，可打这些爬的、钻的，够用了。」他拍了拍弓，「雪原上的人都知道：看见断弓的火，就绕开走——那火边上，多半有不干净的东西。」"],pace:"normal",options:[{t:"（坐在火边，替他守了一夜）",go:"north_tavern"}]}};
N["v56s_ranger2_c"]=function(){return{title:"断弓",text:["贺·断弓沉默了一会儿。他解开背囊，取出一根完整的弓弦——绷得很直，保养得很好。","「这根弦，是我留着等『最后一仗』用的。」他说，「等雪原底下那东西真正爬出来的那天，这根弦会装回弓上。断弓换新弦，打最后一仗。」","「打完那仗，我就退役，找个地方烤一辈子火。」他顿了顿，「要是没打完——这根弦就留给你。你拿着它，替我打。」","「雪原的猎人都知道：断弓的弦，从来不借人。你是第一个。」"],pace:"normal",options:[{t:"（郑重收下这个承诺）",go:"north_tavern"}]}};
/* ---- 骑士 ---- */
N["v56s_knight1_a"]=function(){return{title:"白盾",text:["圣城城门，罗兰·白盾立在门洞中央，盾立在地上。盾面雪白，没有一丝划痕。","「你要进城？先回答我——你进城，是想改变它，还是想利用它？」","你看着他，又看了看那面白盾。盾面干净得不像用过，可你知道，他守了圣城三十年。","「白，是因为我挡下的东西，都不配留在上面。」他顺着你的视线，说了一句，「我每次战斗后，都把它重新漆成白色。」","「三十年了。净化令最凶那几年，我挡在书商面前，也挡在执事面前——我挡的是『不问青红皂白』。」"],pace:"normal",options:[{t:"「累吗？」",go:"v56s_knight1_b"},{t:"「盾上真的没有划痕？」",go:"v56s_knight1_c"}]}};
N["v56s_knight1_b"]=function(){return{title:"白盾",text:["罗兰·白盾低头看着盾面，沉默了一会儿。","「累。可累也得站着。」他说，「我接任团长那年，圣城正乱。我立下骑士团三百年来第一条新誓约：团长之盾，永不后退。」","「三十年，我挡过净化令的刀，挡过北境的箭，挡过自己人的质疑。每次收队，我都要站在这城门口，看着进出的人——看他们脸上有没有『怕』字。」","「有怕，就说明我还没挡够。没有怕，我才能回去睡个觉。」他抬起头，「累不是问题。问题是，你累的时候，身后有没有人替你撑着。」","「这三十年，我一直撑着。因为城里的老百姓，没有第二面盾。」"],pace:"normal",options:[{t:"（深深行了一礼，走进城门）",go:"faction_church_main"}]}};
N["v56s_knight1_c"]=function(){return{title:"白盾",text:["罗兰·白盾把盾转过来，对着光。盾面确实光滑，但你要是凑近看，能看到极浅的、几乎看不见的擦痕——被一层又一层的白漆盖住了。","「没有划痕？你仔细看。」他说，「有。只是都被我漆掉了。」","「挡下一刀，漆一遍。挡下一箭，漆一遍。三十年，我数不清漆了多少遍。」他顿了顿，「有人问我为什么不换面新盾——因为换一面，就忘了那些该记住的。」","「白，不是干净。是我把每一次挡下的东西，都记在心里，然后告诉自己：该翻篇了。」他拍了拍盾，「这面盾不记仇。它只记着，还有人需要它站着。」"],pace:"normal",options:[{t:"（无言，向他颔首）",go:"faction_church_main"}]}};
N["v56s_knight2_a"]=function(){return{title:"晨辉",text:["晨曦圣殿门口，伊莎·晨辉正在系马鞍。她的铠甲上缀着两个徽记——圣辉教会的，和骑士团的。","「来吧。我正好要去劝枢机院，你陪我走一段。」她解下头盔，露出一头短发。","你跟上她的马。圣城的街道上，行人见了她，有的行礼，有的侧目。","「两边都戴，两边都劝。」她指了指胸前的两个徽记，「我出身圣城平民窟，见过教会的善，也见过教会的恶。所以我立誓：我的剑，只守『值得守』的东西。」"],pace:"normal",options:[{t:"「『值得守』怎么判断？」",go:"v56s_knight2_b"},{t:"「铠甲内侧刻着的名字，是谁？」",go:"v56s_knight2_c"}]}};
N["v56s_knight2_b"]=function(){return{title:"晨辉",text:["伊莎·晨辉勒了勒马，让马慢下来。","「判断『值得守』——不看教义，看人。」她说，「我在平民窟长大。教会说净化异端是对的，可我知道，被净化的书商里，有人是替我邻居看病的大夫。」","「所以我立誓的时候，加了一条：我的剑，只守值得守的东西。谁来劝我『这是命令』，我就问他：你见过那个人吗？他家里有孩子吗？」","「枢机院的人说我不好管。可我知道，正是因为我『不好管』，净化令的刀，才慢了那么几次。」她笑了一下，「慢一次，可能就多救一家人。」"],pace:"normal",options:[{t:"（与她并肩走到枢机院门口）",go:"faction_church_main"}]}};
N["v56s_knight2_c"]=function(){return{title:"晨辉",text:["伊莎·晨辉沉默了一下。马蹄踏在石板路上，哒哒地响。","「铠甲内侧刻着的名字……是我在平民窟时的邻居。」她说，「她是个裁缝，死在了第一次净化令里。罪名是窝藏一本『禁书』——其实那本书，是我塞给她的。」","「那年我十四岁。我想让她看看书里写的东西，让她知道我为什么相信『值得守』。净化令来的时候，她没供出我。」","「她死的时候，我的剑还在鞘里。」她低下头，「所以我把她的名字刻在铠甲内侧——每次穿甲，都提醒自己：我的剑，要快过下一场净化令。」"],pace:"normal",options:[{t:"（沉默地陪她走完了整条街）",go:"faction_church_main"}]}};
/* ---- 术士 ---- */
N["v56s_smith1_a"]=function(){return{title:"符文",text:["锻造公会的炉边，格朗·符文盘腿坐着，手里那把像刻刀的小锤子在铁坯上轻叩着。他每敲一下，都要停一停，像在听铁说话。","「来，帮我看看这把刀——它说它想变剑。」他头也不抬。","你凑近。那把刀坯躺在铁砧上，刃口已经被敲出了形状，但刀身的弧度，确实隐隐偏向剑的线条。","「铁有纹理。你摸到它的纹理，它就把心事说给你听。」他放下锤子，「我年轻时是矿道里最笨的矿工——别人一天挖十车，我一天挖一车，因为我每挖一块石头，都要看看它的纹理。」"],pace:"normal",options:[{t:"「铁会说话吗？」",go:"v56s_smith1_b"},{t:"「你听见过初火的声音吗？」",go:"v56s_smith1_c"}]}};
N["v56s_smith1_b"]=function(){return{title:"符文",text:["格朗·符文笑了，笑得像炉火一样温吞。","「铁不说话。它只显纹理——哪里密，哪里疏，哪里受过伤。你读懂了纹理，就听懂了它的话。」他拿起铁坯，「这把刀，它的纹理一直往剑的方向走。它不是想变剑——是它本来该是剑，被打岔成了刀。」","「我做符文，就是把纹理里本来藏着的东西，用符文引出来。让铁自己记住该怎么做。」他顿了顿，「人也是一样。你心里本来就有纹理，只是被生活打岔了。找回来，就是你的『符文』。」"],pace:"normal",options:[{t:"（看着那把渐渐成形的剑，若有所思）",go:"city_ironpeak_tavern"}]}};
N["v56s_smith1_c"]=function(){return{title:"符文",text:["格朗·符文停下锤子，看着炉火，看了很久。","「听见过一次。」他说，「我在初火熔炉前站了三百年，听火说了一句话。」","「那句话是：『你不是在打铁，是在把自己打进去。』」他指了指那把铁坯，「我打了三百年铁，每一件兵器里，都有一小块我。铁替我记着，我这一辈子是怎么熬过来的。」","「索林王守初火熔炉，说铸把火留给他，是让他看着炉子。我看炉子看了三百年——看着看着，就把自己看进去了。」","他重新拿起锤子，敲了一下：「你要是在这行待久了，也会明白：造物，是造物者自己的镜子。」"],pace:"normal",options:[{t:"（在炉边站了很久，看着他打完那柄剑）",go:"city_ironpeak_tavern"}]}};
N["v56s_smith2_a"]=function(){return{title:"炽芯",text:["工坊里，炉火映着梅·炽芯的脸。她正对着一柄锤子说话，语气像哄孩子：「你今天心情不好？那就歇歇，我不怪你。」","锤子自己跳回了架子上。她回头看你，一点也不意外：「你来了。别碰那柄锤——它今天心情不好。」","「我铸的东西会『活』。不是傀儡术——是造物自己有了脾气。」她走到炉边，添了块炭，「这炉火，是老铸师留给我的。他死前，把一生的心血凝成一颗炽芯，放进我的胸膛。」","「我从此能感觉到铁的『心跳』。」她按了按胸口，「你说，这是福气，还是债？」"],pace:"normal",options:[{t:"「债……怎么说？」",go:"v56s_smith2_b"},{t:"「那柄无刃的剑，是给谁的？」",go:"v56s_smith2_c"}]}};
N["v56s_smith2_b"]=function(){return{title:"炽芯",text:["梅·炽芯往炉里添了块炭，火苗蹿了蹿，映得她的眼睛发亮。","「老铸师把火传给我，是把一辈子的心血交到我手里。这份情，我怎么还？」她轻声说，「我成首席铸师那天，给老铸师的坟前铸了一柄无刃的剑——我说，这是给『不会打铁的人』的。」","「他打了一辈子铁，从没给自己打过一样东西。那柄无刃的剑，是替我谢他：谢谢你让我听见铁的心跳。」","「债这个东西，还的方式有很多种。我选了把这份火，传下去——就像他传给我一样。」她看着炉火，「炽芯不是我的。是借我的。总有一天，我要再把它交出去。」"],pace:"normal",options:[{t:"（沉默地站在炉边，替她看了一会儿火）",go:"city_ironpeak_tavern"}]}};
N["v56s_smith2_c"]=function(){return{title:"炽芯",text:["梅·炽芯的手指抚过炉沿，声音轻了一点。","「那柄无刃的剑……是给老铸师的。」她说，「他这辈子，只会打铁，不会别的。他走的时候，我把一生的火传给他——不，是他把火传给了我。」","「我成首席那天，在坟前烧了那柄剑。没有刃，烧起来干干净净的。」她顿了顿，「有人问我为什么不铸一把好剑给他陪葬。我说：他一辈子替别人打铁，那把没刃的，是替他打的——不用上战场，不用杀人，就干干净净地，是他自己的。」","「他打了一辈子铁，总该有一件，是只属于他自己的。」"],pace:"normal",options:[{t:"（陪她在炉边坐到火暗下去）",go:"city_ironpeak_tavern"}]}};
/* ---- 商人 ---- */
N["v56s_trade1_a"]=function(){return{title:"金秤",text:["老巷的铺子里，文森·金秤坐在柜台后拨算盘。铺子不大，货架上摆着些寻常东西，没有一件是贵的。","「想学做生意？先回答我——灾年粮价，你涨不涨？」他头也不抬。","你想了想：「……不涨。」","文森终于抬起头，看了你一眼。他放下算盘，从柜台下摸出两只杯子，倒了两杯茶：「坐。」"],pace:"light",options:[{t:"「答对了？」",go:"v56s_trade1_b"},{t:"「你那本『人情账』，记的是什么？」",go:"v56s_trade1_c"}]}};
N["v56s_trade1_b"]=function(){return{title:"金秤",text:["文森·金秤把茶推给你，自己端了一杯。","「答对了。至少这一题对。」他说，「我做了四十年生意，只有一条规矩：不赚『让人活不下去』的钱。灾年不涨价，丰收年不压价。」","「别人笑我傻。他们说，灾年粮价翻三倍，你守着平价，一年少赚一座金山。」他喝了一口茶，「我说：账算得精，不如算得久。你今年赚了灾民的血汗钱，明年灾民穷了，你的粮卖给谁？」","「做生意的最高境界，不是把账算到最后一文钱，是把账算到十年后还平。」他放下杯子，「我成了总会长，大陆一半的物价我点头才算——可我的铺子，还开在当年那条巷子里，卖的还是当年的货。」"],pace:"normal",options:[{t:"（接过茶，敬了他一杯）",go:"faction_free_tavern"}]}};
N["v56s_trade1_c"]=function(){return{title:"金秤",text:["文森·金秤放下茶杯，从柜台下摸出一本旧账本。账本封皮磨得发白，像被翻了无数遍。","「这上面记的不是钱，是人情。」他翻开一页，「你看——『春三月，粮价平，让利三成，给城东王婆。她家小子要去考学。』」","「每一笔『不赚的钱』，都记在另一页上。等有一天，那些受过我让利的人站稳了，他们会回来——也许不是还钱，是还一份情。」他合上账本，「账算得精，不如算得久。人情账，就是最长的账。」","「我做了四十年生意，攒下的最大一笔财富，不是金衡商会的家底——是这本账。它比什么都值钱。」"],pace:"normal",options:[{t:"（看着那本账本，久久无言）",go:"faction_free_tavern"}]}};
N["v56s_trade2_a"]=function(){return{title:"半帆",text:["南方港口的船头，洛佩斯·半帆站在甲板上，海风吹得他眯起眼。他的船队只挂半帆——船帆半张着，像留了一手。","「上船？先说好，我的船，只载两条路：发财的路，和还债的路。」他笑了笑，拍了拍船舷。","你跳上甲板。船舷的木板上，刻着密密麻麻的记号——有些是正字，有些是叉。","「我年轻时是海盗，抢了十年。然后上岸，用抢来的第一桶金买了第一条船，开始做生意。」他说，「做生意和当海盗一样狠——但有一条：不劫商船，不抢妇孺。」"],pace:"normal",options:[{t:"「船舱里那间锁着的房间，装的是什么？」",go:"v56s_trade2_b"},{t:"「为什么只挂半帆？」",go:"v56s_trade2_c"}]}};
N["v56s_trade2_b"]=function(){return{title:"半帆",text:["洛佩斯·半帆沉默了一会儿。海风把他的胡子吹得颤了颤。","「那间房里，堆着我当年抢来的、又一件件还回去的东西。」他说，「我抢了十年，还了三十年。那间房，现在还空着一半——等我死前，要把另一半也还完。」","「有人问我：你当年抢的东西，大多不知道主人是谁了，怎么还？」他顿了顿，「我把它们一件件摆出来，托各地的商队打听。打听到一个，还一个。还到没人认领的，就捐给港口的老兵堂。」","「抢来的东西，迟早要还。还完了，海风才敢放心吹我的帆。」"],pace:"normal",options:[{t:"（看着那扇锁着的门，点了点头）",go:"city_nanfang_tavern"}]}};
N["v56s_trade2_c"]=function(){return{title:"半帆",text:["洛佩斯·半帆抬头看了看船帆，眼底有种老水手才有的平静。","「挂半帆，是因为风会变，船不能满。」他说，「我抢了十年，最怕的就是『满』。满帆的船，遇到变风，想收都来不及。」","「做生意也一样。你赚得满盆满钵的时候，最危险——因为你看不见风在变。留一半，是给自己留收帆的余地。」","「我成了南方船王，可我的船，不管顺风逆风，永远只挂半帆。水手们笑我，说这是富贵病。」他笑了笑，「他们不懂。我这一辈子，就是靠『留一半』活下来的。」"],pace:"normal",options:[{t:"（在船头站了一会儿，看他的船队出海）",go:"city_nanfang_tavern"}]}};
/* ---- 灵魂法师 ---- */
N["v56s_soul1_a"]=function(){return{title:"梦墟",text:["回音室门口，澜·梦墟侧着身站着，没有正眼看你。她的眼睛是雾色的，像隔着一层梦。","「你身上有两道声音。一道很响，一道很轻。你想让我听哪一道？」","你站在原地，没有答话。她等了一会儿，又说：「响的那道，是你想让人听见的。轻的那道，是你自己都还没听见的。」","「我守回音之镜九十年，见过镜子里所有人的另一面——唯独没见过自己的。因为我从不照镜子。」她顿了顿，「镜子会告诉我，我走这条路，是为了看见别人，还是为了逃避自己。我还没准备好听那个答案。」"],pace:"normal",options:[{t:"「你害怕那个答案？」",go:"v56s_soul1_b"},{t:"「镜子……能看见什么？」",go:"v56s_soul1_c"}]}};
N["v56s_soul1_b"]=function(){return{title:"梦墟",text:["澜·梦墟沉默了很久。回音室里很静，静到能听见自己的心跳。","「怕。怕得很。」她的声音很轻，「我生下来就看不见『表面』，只能看见人的『另一面』。所以我从不敢看任何人超过一炷香——因为看得越久，越发现，人心里最深的那个答案，往往不是他们想成为的样子。」","「我怕镜子告诉我：我守镜九十年，不是想看见别人，是不敢看见自己。」她终于说，「我怕那个答案，比怕深渊还怕。」","「奥雷利安老师说得对：灵魂法师的道，是先把自己看穿，再看别人。我把自己看了九十年，还没看穿。」"],pace:"normal",options:[{t:"（轻退出了回音室）",go:"faction_church_main"}]}};
N["v56s_soul1_c"]=function(){return{title:"梦墟",text:["澜·梦墟抬起手，指向前方：「那面镜子，就在回音室正中。它照出的，永远是问镜者自己没听见的那句话。」","「三千年来，它没有碎过。因为每个人站到镜前，听见自己那句话之后，都吓得后退了——镜子替他们承受了那句话的重量。」","「只有奥雷利安老师，他在镜前站了一夜，然后说：『我还没把自己看透。看透自己的那天，就是我坐上去的那天。』他没有碎，镜子也没有碎。」","「你要是哪天准备好了，可以去照一次。但记住——镜子不会说谎。它只会告诉你，你一直在逃避的那句话。」"],pace:"normal",options:[{t:"（在回音室门口站了一会儿，终究没有推门）",go:"faction_church_main"}]}};
N["v56s_soul1_d"]=function(){return{title:"梦墟",text:["你转身要走的时候，澜·梦墟忽然叫住了你。","「等等。」她侧着身，雾色的眼睛看着虚空，「你身上那道轻的声音……它在说：『我怕的不是死，是没人记得我来过。』」","你僵住了。","「我不问你怎么知道的。」她低声说，「我只告诉你——镜子不会说谎，但它也不会审判。你怕的那句话，说出来，就轻了一半。」","她终于第一次正眼看了你一次，雾眼眨了眨：「你的另一面，不太坏。」"],pace:"normal",options:[{t:"（向她点了点头，走出回音室）",go:"faction_church_main"}]}};
/* ---- 兽王/隐世/散人 ---- */
N["v56s_beast1_a"]=function(){return{title:"兽王",text:["大陆深处的密林里，你循着巨大的足迹，走到一处被踩平的谷地。一头巨兽卧在那里——鬃毛如铁，眼瞳是熔金一样的颜色。","它看了你很久。你感觉那道视线不是在衡量你的实力，而是在闻你身上的味道。","「（低沉的咆哮。它用爪子在地上划出深渊的方向，又划出一条绕过深渊的路。）」","它要你走那条路。它不开口，但你看懂了：它守这片林子，就像你守你心里那点东西——守得久了，就懂了谁该放行，谁该拦下。"],pace:"normal",options:[{t:"（朝它行了一礼，沿它指的路离去）",go:"faction_elf_main"}]}};
N["v56s_hermit_a"]=function(){return{title:"灰袍",text:["你在一处废弃的渡口遇见他。灰袍人坐在破船上，手里握着一根钓竿，竿上没有线。他钓的不是鱼，是河。","你走近，他没有抬头。风把他的灰袍吹得鼓起来，又落下。","「……你来了。」他开口，声音像从很远的地方传来，「河认得你。你身上有河的味道——流过很多地方，也淹过很多东西。」","他放下钓竿，从怀里摸出一块石头，放在船舷上：「拿着。等哪天你明白河为什么往前流，就把它扔回河里。」"],pace:"normal",options:[{t:"（接过石头，他划着破船消失在雾里）",go:"faction_free_tavern"}]}};
N["v56s_swordsman_a"]=function(){return{title:"独臂",text:["南方的旧戏台边，独臂·萧坐在台阶上，独臂搭在膝上，望着空荡荡的台面。台上没有人唱戏，可他的眼神像在听。","你在他旁边坐下。他没有看你，也没有赶你走。","过了很久，他忽然开口，声音沙哑：「我这条胳膊，是替一个人断的。那人欠我一句谢，一直没还。」","「我走遍大陆找他还。找了很多年。后来我想通了——他不还，我就替他记着。记着记着，就把整座大陆的路都走熟了。」","他站起来，独臂指了指台面：「戏散了，人就该走了。你也一样。」"],pace:"normal",options:[{t:"（起身，向他抱了抱拳）",go:"city_nanfang_tavern"}]}};
/* ---- 半神/挑战者精选 ---- */
N["v56s_rv_o_a"]=function(){return{title:"星弦",text:["北地的孤峰上，奥伦·星弦坐在峰顶，面前摆着一盏熄灭的灯。他看得不是灯，是灯后的虚空。","「你来了。」他没有回头，「洛让你来找我的？他说塔没塌，就是灯灭了一盏——我猜到了。」","「我离塔十二年，在找一条没人走过的元素路。不是更快的路，是更真的路。」他顿了顿，「塔里的路，是寂光铺好的。我想走一条，能看见自己脚印的路。」","「星徽我留给他了。那东西，谁戴着都一样——可塔，需要有人守着。」"],pace:"normal",options:[{t:"「找到了吗？」",go:"v56s_rv_o_b"}]}};
N["v56s_rv_o_b"]=function(){return{title:"星弦",text:["奥伦·星弦笑了笑，笑声在孤峰的风里很淡。","「还没。十二年，我试过一百三十二条路，都走不通。可我每试一条，就更清楚寂光为什么把法则刻进魔网第一层——他在替后来人铺路，哪怕没人看见。」","「我要找的，不是比寂光更强的路。是能让我自己看得起自己的路。」他站起来，「你回去告诉洛：塔他没看错人。星徽他戴着，合适。」","「至于那盏灭了的灯——它没灭。它只是换了个地方亮。」"],pace:"normal",options:[{t:"（记住他的话，下山时，天边泛起了光）",go:"north_tavern"}]}};
N["v56s_rv_soul_a"]=function(){return{title:"赎夜",text:["深渊裂隙边缘，风从裂口涌上来，带着硫磺和冷。一个黑袍人站在裂口边，背对着你，衣摆被风扯得猎猎响。","「你走得太近了。」他说，声音没有起伏，「圣殿的人，不该走到这儿来。」","「我替圣殿守了三十年夜，最后一夜走进裂隙。奥雷利安没拦住我——他站在塔顶，看着我从他视线里消失。」","「他以为我是去找答案。其实我只是想知道：灵魂的尽头，到底是什么在等我。」"],pace:"normal",options:[{t:"「你看到了吗？」",go:"v56s_rv_soul_b"}]}};
N["v56s_rv_soul_b"]=function(){return{title:"赎夜",text:["赎夜没有回头。风从深渊里涌上来，吹得他的声音断断续续。","「看到了。尽头有一面镜子——和圣殿的回音之镜一模一样的镜子。它照出的，是每一个走到尽头的人，最不敢听的那句话。」","「我站到镜前，听见了那句话。然后我退了回来。」他顿了顿，「不是怕。是还没到时候。我欠圣殿三十年的夜，还没还完。」","「你回去告诉澜·梦墟：那面镜子里，她的那句话还在等她。她准备好了再去，别像我一样，被自己吓退。」"],pace:"normal",options:[{t:"（看着他消失在裂隙边缘的风里）",go:"event_hub"}]}};

/* ===== /v56inj:engineEnd ===== */

/* ===== /v57inj:engine ===== */
(function(){
"use strict";
try{
/* ============ v57 职业体系总成 · 引擎 ============ */
/* 数据占位（内容脚本按序填充）： */

/* ===== /v57inj:dataFlow ===== */
const FLOW_V57 = {};
FLOW_V57["骑士"]={flows:[
  {id:"flow_knight_blade",cn:"圣辉之刃",theme:"光不该是审判，该是路",axis:"paladin",desc:"以圣辉淬刃，以信念开路。这条路相信：剑可以劈开黑暗，但不必劈开人。",skills:["sk_knight_shield","sk_knight_aura","sk_knight_smite"],feats:["v51_骑士_paladin_1","v51_骑士_paladin_2","v51_骑士_paladin_3"],peak:"paladin_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"圣辉"},title:"圣辉骑士",sanctuary:"v57f_骑士_blade_1",sanctuaryCn:"大教堂·穹顶之下",skillForm:{sk_knight_shield: "圣辉盾·破晓：光从盾缘漏出来，像清晨第一道线，深渊之物碰到就缩手", sk_knight_smite: "破邪斩·辉：斩落时，剑身会亮一瞬——那是对深渊说的再见"}},
  {id:"flow_knight_oath",cn:"誓约之盾",theme:"一诺既出，万山无阻",axis:"protector",desc:"以身为誓，以盾为诺。这条路把每句誓言都锻成一块盾——护住说出口的人。",skills:["sk_knight_vow","sk_knight_sacrifice","sk_knight_sword"],feats:["v51_骑士_protector_1","v51_骑士_protector_2","v51_骑士_protector_3"],peak:"protector_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"守护"},title:"誓约之盾",sanctuary:"v57f_骑士_oath_1",sanctuaryCn:"誓约骑士团·誓堂",skillForm:{sk_knight_vow: "誓约印记·双诺：多守一句诺言，剑就多一分重", sk_knight_sacrifice: "牺牲·不悔：代受的伤会留疤，但同伴安然无恙"}},
  {id:"flow_knight_walk",cn:"巡游者",theme:"骑士不该只守一座城",axis:"itinerant",desc:"走出城墙，才看得见世界的伤。这条路不设营垒——走到哪，守到哪。",skills:["sk_knight_justice","sk_knight_riding","sk_knight_oath"],feats:["v51_骑士_itinerant_1","v51_骑士_itinerant_2","v51_骑士_itinerant_3"],peak:"itinerant_peak",scene:"社交",passive:{type:"bonus",value:2,label:"游历"},title:"巡游者",sanctuary:"v57f_骑士_walk_1",sanctuaryCn:"西境古道",skillForm:{sk_knight_riding: "巡游骑术·风尘：马跑三天三夜不停，比传闻还快半日", sk_knight_justice: "正义打击·路见：路见不平的第一击，永远最强"}}
 ]};
FLOW_V57["游侠"]={flows:[
  {id:"flow_ranger_hunt",cn:"猎杀之道",theme:"猎杀不是嗜血，是记住猎物",axis:"hunter",desc:"以眼为弓，以心为矢。这条路教你：出手之前，先看清楚对手是谁。",skills:["sk_ranger_shot","sk_ranger_eye","sk_ranger_trap"],feats:["v51_游侠_hunter_1","v51_游侠_hunter_2","v51_游侠_hunter_3"],peak:"hunter_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"猎杀"},title:"猎手",sanctuary:"v57f_游侠_hunt_1",sanctuaryCn:"北境·白桦林",skillForm:{sk_ranger_shot: "猎射·追迹：箭会拐弯追上猎物——它认得气味", sk_ranger_trap: "陷阱·缚足：缠住腿的藤蔓会喊同伴来"}},
  {id:"flow_ranger_ward",cn:"守望者",theme:"森林先于王座存在",axis:"warden",desc:"守的不是树，是树底下的根、根底下的土。这条路走得慢，但走得久。",skills:["sk_ranger_sense","sk_ranger_nature","sk_ranger_forest"],feats:["v51_游侠_warden_1","v51_游侠_warden_2","v51_游侠_warden_3"],peak:"warden_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"自然亲和"},title:"守望者",sanctuary:"v57f_游侠_ward_1",sanctuaryCn:"银叶城·古树根",skillForm:{sk_ranger_sense: "野性感知·林语：树先告诉你敌人来了", sk_ranger_forest: "森林之子·庇护：林子替你挡一箭"}},
  {id:"flow_ranger_roam",cn:"巡林者",theme:"路不在脚下，在林子的呼吸里",axis:"scout",desc:"走最轻的步子，看最远的地方。这条路的人，是林子的耳朵和眼睛。",skills:["sk_ranger_light","sk_ranger_multi","sk_ranger_beast"],feats:["v51_游侠_scout_1","v51_游侠_scout_2","v51_游侠_scout_3"],peak:"scout_peak",scene:"探索",passive:{type:"bonus",value:2,label:"巡林"},title:"巡林者",sanctuary:"v57f_游侠_roam_1",sanctuaryCn:"雾岭·望风石",skillForm:{sk_ranger_light: "轻身步·无声：走过落叶，落叶不响", sk_ranger_beast: "兽语·同行：听得懂兽的咳嗽，兽就认得你"}}
 ]};
FLOW_V57["盗贼"]={flows:[
  {id:"flow_thief_shadow",cn:"影杀者",theme:"影子不抢，只拿",axis:"assassin",desc:"在暗处起手，在光处收手。这条路教你把每一次出手都算清楚——包括不算的那次。",skills:["sk_thief_backstab","sk_thief_shadow","sk_thief_law"],feats:["v51_盗贼_assassin_1","v51_盗贼_assassin_2","v51_盗贼_assassin_3"],peak:"assassin_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"影杀"},title:"影杀者",sanctuary:"v57f_盗贼_shadow_1",sanctuaryCn:"暗影阁·黑井",skillForm:{sk_thief_backstab: "背刺·影刃：影子比你快半拍", sk_thief_law: "影之法则·不留：收走东西，像什么都没发生"}},
  {id:"flow_thief_night",cn:"夜行者",theme:"黑夜不是掩护，是另一种白天",axis:"burglar",desc:"在无人处来，在无人处去。这条路不偷东西——偷时间，偷秘密，偷回被藏起来的公道。",skills:["sk_thief_lockpick","sk_thief_pick","sk_thief_erase"],feats:["v51_盗贼_burglar_1","v51_盗贼_burglar_2","v51_盗贼_burglar_3"],peak:"burglar_peak",scene:"探索",passive:{type:"bonus",value:2,label:"夜行"},title:"夜行者",sanctuary:"v57f_盗贼_night_1",sanctuaryCn:"交汇城·钟楼",skillForm:{sk_thief_lockpick: "开锁·听芯：锁芯会告诉你它服不服", sk_thief_erase: "抹痕·无形：脚印会自己消失"}},
  {id:"flow_thief_ear",cn:"耳目",theme:"听见的人，活得更久",axis:"spy",desc:"把自己藏进人群，把真相带出暗巷。这条路的人，替世界记着那些没人愿意说的话。",skills:["sk_thief_stealth","sk_thief_disguise","sk_thief_poison"],feats:["v51_盗贼_spy_1","v51_盗贼_spy_2","v51_盗贼_spy_3"],peak:"spy_peak",scene:"社交",passive:{type:"bonus",value:2,label:"耳目"},title:"耳目",sanctuary:"v57f_盗贼_ear_1",sanctuaryCn:"南港·旧鱼市",skillForm:{sk_thief_stealth: "潜行·融墙：你贴着墙走，墙就当你是它的一部分", sk_thief_disguise: "易容·换脸：换一张脸，就是换一种活法"}}
 ]};
FLOW_V57["牧师"]={flows:[
  {id:"flow_priest_mercy",cn:"慈悲之道",theme:"治愈先于审判",axis:"healer",desc:"以神恩抚伤，以宽宥渡人。这条路信：看见伤口的人，才配谈信仰。",skills:["sk_priest_heal","sk_priest_revive","sk_priest_light"],feats:["v51_牧师_healer_1","v51_牧师_healer_2","v51_牧师_healer_3"],peak:"healer_peak",scene:"恢复",passive:{type:"bonus",value:2,label:"慈悲"},title:"慈悲者",sanctuary:"v57f_牧师_mercy_1",sanctuaryCn:"圣辉教堂·病榻廊",skillForm:{sk_priest_heal: "治疗·微光：伤口合拢时，会留一点光在里面", sk_priest_revive: "复活·借时：从死亡手里借回一刻钟"}},
  {id:"flow_priest_judge",cn:"审判者",theme:"圣言不是刀，是秤",axis:"inquisitor",desc:"以经文为尺，以真理为刃。这条路不放过罪，也不放过错判——两样都算。",skills:["sk_priest_judgment","sk_priest_bane","sk_priest_word"],feats:["v51_牧师_inquisitor_1","v51_牧师_inquisitor_2","v51_牧师_inquisitor_3"],peak:"inquisitor_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"审判"},title:"审判者",sanctuary:"v57f_牧师_judge_1",sanctuaryCn:"异端审判庭·静默间",skillForm:{sk_priest_judgment: "圣裁·称重：剑落下之前，先量一量人心", sk_priest_bane: "驱魔·灼：深渊之物碰到光，像碰到自己的名字"}},
  {id:"flow_priest_war",cn:"圣战者",theme:"为信仰而战，也为信仰而止",axis:"warpriest",desc:"神的信徒也可以是神的剑。这条路教你在拔剑前先问：这一剑，神会怎么看？",skills:["sk_priest_bless","sk_priest_shield","sk_priest_avatar"],feats:["v51_牧师_warpriest_1","v51_牧师_warpriest_2","v51_牧师_warpriest_3"],peak:"warpriest_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"圣战"},title:"圣战者",sanctuary:"v57f_牧师_war_1",sanctuaryCn:"圣山·古战场",skillForm:{sk_priest_bless: "祝福·战旗：祝福落在盾上，盾会记得", sk_priest_avatar: "圣临·片刻：那一刻，圣光借你的手行了一次神迹"}}
 ]};
FLOW_V57["商人"]={flows:[
  {id:"flow_trade_way",cn:"商道",theme:"万物有价，唯情难称",axis:"merchant",desc:"以信立市，以诚聚财。这条路不信运气，信账本——还有账本背后的脸。",skills:["sk_trade_bargain","sk_trade_eye","sk_trade_touch"],feats:["v51_商人_merchant_1","v51_商人_merchant_2","v51_商人_merchant_3"],peak:"merchant_peak",scene:"交易",passive:{type:"bonus",value:2,label:"商道"},title:"商道者",sanctuary:"v57f_商人_way_1",sanctuaryCn:"金衡商会·老账房",skillForm:{sk_trade_bargain: "议价·秤心：你报的价，听得出对方心动的声音", sk_trade_touch: "点金术·验货：摸一摸，就知道东西值几成真"}},
  {id:"flow_trade_gold",cn:"金流",theme:"钱不是目的，是过河的路",axis:"banker",desc:"让钱流动起来，让日子有着落。这条路管的是金子的去向——还有它的来处。",skills:["sk_trade_invest","sk_trade_credit"],feats:["v51_商人_banker_1","v51_商人_banker_2","v51_商人_banker_3"],peak:"banker_peak",scene:"经济",passive:{type:"bonus",value:2,label:"金流"},title:"金流主",sanctuary:"v57f_商人_gold_1",sanctuaryCn:"金衡商会·金库",skillForm:{sk_trade_invest: "投资·钱生钱：你的金币会在夜里自己商量怎么长大", sk_trade_credit: "商会信誉·金字：你的名字就是抵押"}},
  {id:"flow_trade_auction",cn:"拍场主",theme:"每一件东西，都有懂它的人",axis:"auctioneer",desc:"把东西交给最该拥有它的人。这条路赚的不是差价，是成全。",skills:["sk_trade_net","sk_trade_talk","sk_trade_scale"],feats:["v51_商人_auctioneer_1","v51_商人_auctioneer_2","v51_商人_auctioneer_3"],peak:"auctioneer_peak",scene:"社交",passive:{type:"bonus",value:2,label:"拍场"},title:"拍场主",sanctuary:"v57f_商人_auction_1",sanctuaryCn:"南港·旧拍卖行",skillForm:{sk_trade_net: "人脉·结网：认识的人多，路就多", sk_trade_scale: "天平裁决·公秤：两头都要掂一掂，才算公道"}}
 ]};

Object.assign(FLOW_V57, {
 "魔法师":{flows:[
  {id:"flow_mage_fire",cn:"真理之焰",theme:"知识不是用来藏的，是用来烧的",axis:"elemental",desc:"以元素为火，以法则为薪。这条路信奉：知道得越多，燃得越亮。",skills:["sk_mage_fireball","sk_mage_chain","sk_mage_meteor"],feats:["v51_魔法师_elemental_1","v51_魔法师_elemental_2","v51_魔法师_elemental_3"],peak:"elemental_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"塑能加值"},title:"焰语者",sanctuary:"v57f_魔法师_fire_1",sanctuaryCn:"星落塔·观星台",skillForm:{sk_mage_fireball: "业火球：命中后，火星留在伤口里烧三息", sk_mage_chain: "雷蛇链：闪电在敌人间多跳一次，专咬持械的手"}},
  {id:"flow_mage_door",cn:"万象之门",theme:"世界的缝隙里，藏着另一条路",axis:"conjurer",desc:"把空间折成纸，把距离叠成褶。门扉之后，一切皆可通达。",skills:["sk_mage_blink","sk_mage_arcaneshield"],feats:["v51_魔法师_conjurer_1","v51_魔法师_conjurer_2","v51_魔法师_conjurer_3"],peak:"conjurer_peak",scene:"探索",passive:{type:"bonus",value:2,label:"空间感知"},title:"门扉行者",sanctuary:"v57f_魔法师_door_1",sanctuaryCn:"旧图书馆·地下一层",skillForm:{sk_mage_blink: "折跃·三步：一步入影，两步穿墙，第三步站在你想站的地方", sk_mage_arcaneshield: "奥术盾·镜面：能弹回一次小伤"}},
  {id:"flow_mage_echo",cn:"寂静回响",theme:"最深的声音，是不出声的",axis:"arcane",desc:"法则在无人处低语。这条路教你听——听那些被禁止说出口的部分。",skills:["sk_mage_amplify","sk_mage_grand"],feats:["v51_魔法师_arcane_1","v51_魔法师_arcane_2","v51_魔法师_arcane_3"],peak:"arcane_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"法则共鸣"},title:"法则诵者",sanctuary:"v57f_魔法师_echo_1",sanctuaryCn:"禁书区·三层",skillForm:{sk_mage_amplify: "增效·共振：施法时，周围的烛火跟着你的节奏一起亮", sk_mage_grand: "大裂解·低语：拆开的现实会记住你，下一次更好拆"}}
 ]},
 "灵魂法师":{flows:[
  {id:"flow_soul_lamp",cn:"魂灯不灭",theme:"亡者不可忘，生者不可欺",axis:"medium",desc:"魂灯为引，渡人亦渡己。这条路信：记得的人多了，路就亮了。",skills:["sk_soul_sight","sk_soul_lullaby","sk_soul_gather"],feats:["v51_灵魂法师_medium_1","v51_灵魂法师_medium_2","v51_灵魂法师_medium_3"],peak:"medium_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"魂灯常明"},title:"守灯人",sanctuary:"v57f_灵魂法师_lamp_1",sanctuaryCn:"晨曦圣殿·灯廊",skillForm:{sk_soul_sight: "灵魂视野·烛火：看得见每具身体里那点未灭的火", sk_soul_gather: "凝魂·收灯：把散落的魂火拢回一盏灯"}},
  {id:"flow_soul_key",cn:"心扉之锁",theme:"每一扇心门，都有一把钥匙",axis:"hypnotist",desc:"看透人心，不是为掌控，是为不误伤。这条路教你在说话之前，先听见。",skills:["sk_soul_link","sk_soul_gaze"],feats:["v51_灵魂法师_hypnotist_1","v51_灵魂法师_hypnotist_2","v51_灵魂法师_hypnotist_3"],peak:"hypnotist_peak",scene:"社交",passive:{type:"bonus",value:2,label:"察心"},title:"读心者",sanctuary:"v57f_灵魂法师_key_1",sanctuaryCn:"镜厅",skillForm:{sk_soul_link: "灵魂链接·丝线：一根看不见的线，连着你和他的心跳", sk_soul_gaze: "夺魄凝视·照镜：他看你的眼睛，像看见自己的底"}},
  {id:"flow_soul_chain",cn:"契约之链",theme:"链接不是束缚，是彼此照看",axis:"soulbinder",desc:"把灵魂的线系在一起，生死同担。这条路重诺，也重信。",skills:["sk_soul_attach","sk_soul_lamp"],feats:["v51_灵魂法师_soulbinder_1","v51_灵魂法师_soulbinder_2","v51_灵魂法师_soulbinder_3"],peak:"soulbinder_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"契约之力"},title:"缚魂者",sanctuary:"v57f_灵魂法师_chain_1",sanctuaryCn:"晨曦圣殿·契约堂",skillForm:{sk_soul_attach: "附灵术·同行：灵体跟着你走，影子多了一重", sk_soul_lullaby: "安魂曲·止：曲声落下，躁动的心停一拍"}}
 ]},
 "术士":{flows:[
  {id:"flow_smith_touch",cn:"点金之手",theme:"万物有灵，皆有价钱——但价值不该被标死",axis:"alchemist",desc:"以药石辨物性，以点化见真章。这条路的手，比眼睛先认识世界。",skills:["sk_smith_potion","sk_smith_acid","sk_smith_appraise"],feats:["v51_术士_alchemist_1","v51_术士_alchemist_2","v51_术士_alchemist_3"],peak:"alchemist_peak",scene:"交易",passive:{type:"bonus",value:2,label:"识材"},title:"点金匠",sanctuary:"v57f_术士_touch_1",sanctuaryCn:"锻造公会·药室",skillForm:{sk_smith_potion: "愈伤药剂·活水：喝下去，伤口像被溪水洗过", sk_smith_appraise: "材料辨识·识货：闻一闻就知道这东西熬不熬得住火"}},
  {id:"flow_smith_forge",cn:"百炼之炉",theme:"每一锤，都要对得起下一锤",axis:"forger",desc:"以火淬形，以形载道。这条路把耐心锻进每一道纹路里。",skills:["sk_smith_rune","sk_smith_goldhand","sk_smith_furnace"],feats:["v51_术士_forger_1","v51_术士_forger_2","v51_术士_forger_3"],peak:"forger_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"淬火"},title:"百炼师",sanctuary:"v57f_术士_forge_1",sanctuaryCn:"熔炉大厅",skillForm:{sk_smith_rune: "符文刻印·活字：刻下的符文会自己呼吸", sk_smith_furnace: "造化炉·余温：出炉的物件带着炉子的脾气"}},
  {id:"flow_smith_gear",cn:"活偶之枢",theme:"造出来的东西，会自己长大",axis:"machinist",desc:"机关、构装、会呼吸的器物。这条路与造物共处——并学会放手。",skills:["sk_smith_bomb","sk_smith_shape"],feats:["v51_术士_machinist_1","v51_术士_machinist_2","v51_术士_machinist_3"],peak:"machinist_peak",scene:"探索",passive:{type:"bonus",value:2,label:"机巧"},title:"枢机匠",sanctuary:"v57f_术士_gear_1",sanctuaryCn:"公会地下·构装库",skillForm:{sk_smith_bomb: "炼金炸弹·开花：炸开时像花一样——只是花瓣是铁", sk_smith_shape: "变形术·兽形：变成野兽，也学会野兽的谨慎"}}
 ]},
 "战士":{flows:[
  {id:"flow_war_banner",cn:"不灭战旗",theme:"战旗所指，即心之所向",axis:"berserker",desc:"血可流，旗不倒。这条路把意志锻成旗杆——风越大，立得越稳。",skills:["sk_war_bloodlust","sk_war_blood","sk_war_wrath"],feats:["v51_战士_berserker_1","v51_战士_berserker_2","v51_战士_berserker_3"],peak:"berserker_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"战意"},title:"战旗者",sanctuary:"v57f_战士_banner_1",sanctuaryCn:"战神团·旧旗台",skillForm:{sk_war_bloodlust: "战意·旗焰：战旗立起时，伤口也不那么疼了", sk_war_wrath: "破军斩·裂地：一刀劈下，地面替你记住这一击"}},
  {id:"flow_war_weapon",cn:"百兵之主",theme:"刀剑无主，握者自明",axis:"weaponmaster",desc:"十八般兵刃，皆可成道。这条路练的不是兵器，是手与兵器的彼此信任。",skills:["sk_war_charge","sk_war_combo","sk_war_break"],feats:["v51_战士_weaponmaster_1","v51_战士_weaponmaster_2","v51_战士_weaponmaster_3"],peak:"weaponmaster_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"兵主"},title:"百兵主",sanctuary:"v57f_战士_weapon_1",sanctuaryCn:"演武场·兵器库",skillForm:{sk_war_charge: "冲锋·先声：剑比念头快", sk_war_break: "破军斩·断兵：兵器应声而断——不是你的"}},
  {id:"flow_war_wall",cn:"铁壁长城",theme:"最好的进攻，是让人无处可攻",axis:"shieldguard",desc:"以身为墙，以守为攻。这条路相信：站在前面的人，才有资格谈输赢。",skills:["sk_war_bulwark","sk_war_roar","sk_war_instinct"],feats:["v51_战士_shieldguard_1","v51_战士_shieldguard_2","v51_战士_shieldguard_3"],peak:"shieldguard_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"壁垒"},title:"壁垒者",sanctuary:"v57f_战士_wall_1",sanctuaryCn:"铁门关·旧墙",skillForm:{sk_war_bulwark: "铁壁·不动：站定之后，像城墙长在了地上", sk_war_roar: "战吼·震：吼声落地，敌人脚下一滞"}}
 ]}
});

/* ===== /v57inj:dataBrand ===== */
const JOB_BRAND_V57 = {};
JOB_BRAND_V57["战士"]={brands:[
  {id:"br_war_overdraw",cn:"战意透支",desc:"战斗结束后，你常常要很久才认得清身边的人。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"余勇"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"余勇"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"余勇"}],
   line:["v57b_战士_overdraw_1","v57b_战士_overdraw_2","v57b_战士_overdraw_3"]},
  {id:"br_war_kill",cn:"杀伐惯性",desc:"你越来越习惯用拳头开路，快忘了话也能开路。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"威压"},{lv:2,scene:"社交",type:"bonus",value:1,label:"威压"},{lv:3,scene:"社交",type:"bonus",value:2,label:"威压"}],
   line:["v57b_战士_kill_1","v57b_战士_kill_2","v57b_战士_kill_3"]},
  {id:"br_war_scar",cn:"旧伤执念",desc:"你开始数身上的疤——数得越多，越怕它们好。",trig:"探索",
   gain:[{lv:1,scene:"探索",type:"bonus",value:1,label:"铁躯"},{lv:2,scene:"探索",type:"bonus",value:1,label:"铁躯"},{lv:3,scene:"探索",type:"bonus",value:2,label:"铁躯"}],
   line:["v57b_战士_scar_1","v57b_战士_scar_2","v57b_战士_scar_3"]}
 ]};
JOB_BRAND_V57["骑士"]={brands:[
  {id:"br_knight_rust",cn:"誓约锈蚀",desc:"你每违背一次誓言，胸口就多一处锈。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"余誓"},{lv:2,scene:"社交",type:"bonus",value:1,label:"余誓"},{lv:3,scene:"社交",type:"bonus",value:2,label:"余誓"}],
   line:["v57b_骑士_rust_1","v57b_骑士_rust_2","v57b_骑士_rust_3"]},
  {id:"br_knight_blaze",cn:"圣光灼眼",desc:"正义的标准越来越高，高到你也快够不着了。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"惩戒"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"惩戒"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"惩戒"}],
   line:["v57b_骑士_blaze_1","v57b_骑士_blaze_2","v57b_骑士_blaze_3"]},
  {id:"br_knight_lonely",cn:"负重孤独",desc:"你扛的东西越来越多，能说话的人越来越少。",trig:"修炼",
   gain:[{lv:1,scene:"修炼",type:"pct",value:0.02,label:"负重增益"},{lv:2,scene:"修炼",type:"pct",value:0.02,label:"负重增益"},{lv:3,scene:"修炼",type:"pct",value:0.03,label:"负重增益"}],
   line:["v57b_骑士_lonely_1","v57b_骑士_lonely_2","v57b_骑士_lonely_3"]}
 ]};
JOB_BRAND_V57["游侠"]={brands:[
  {id:"br_ranger_beast",cn:"自然同化",desc:"你越来越能听懂兽语，也越来越难听懂人话。",trig:"探索",
   gain:[{lv:1,scene:"探索",type:"bonus",value:1,label:"野性"},{lv:2,scene:"探索",type:"bonus",value:1,label:"野性"},{lv:3,scene:"探索",type:"bonus",value:2,label:"野性"}],
   line:["v57b_游侠_beast_1","v57b_游侠_beast_2","v57b_游侠_beast_3"]},
  {id:"br_ranger_lone",cn:"荒野孤寂",desc:"你开始觉得，人群的味道比兽穴还难闻。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"沉静"},{lv:2,scene:"社交",type:"bonus",value:1,label:"沉静"},{lv:3,scene:"社交",type:"bonus",value:2,label:"沉静"}],
   line:["v57b_游侠_lone_1","v57b_游侠_lone_2","v57b_游侠_lone_3"]},
  {id:"br_ranger_hunt",cn:"猎杀本性",desc:"你开始不自觉地看人的后颈——那是猎物的位置。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"猎眼"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"猎眼"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"猎眼"}],
   line:["v57b_游侠_hunt_1","v57b_游侠_hunt_2","v57b_游侠_hunt_3"]}
 ]};
JOB_BRAND_V57["盗贼"]={brands:[
  {id:"br_thief_erode",cn:"暗影侵蚀",desc:"你越来越记不清，自己原来长什么样。",trig:"探索",
   gain:[{lv:1,scene:"探索",type:"bonus",value:1,label:"融影"},{lv:2,scene:"探索",type:"bonus",value:1,label:"融影"},{lv:3,scene:"探索",type:"bonus",value:2,label:"融影"}],
   line:["v57b_盗贼_erode_1","v57b_盗贼_erode_2","v57b_盗贼_erode_3"]},
  {id:"br_thief_light",cn:"见光恐惧",desc:"你在亮处待久了会心慌，像在被人盯着。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"藏形"},{lv:2,scene:"社交",type:"bonus",value:1,label:"藏形"},{lv:3,scene:"社交",type:"bonus",value:2,label:"藏形"}],
   line:["v57b_盗贼_light_1","v57b_盗贼_light_2","v57b_盗贼_light_3"]},
  {id:"br_thief_trust",cn:"信任废墟",desc:"你开始默认每个人话里都藏着三层。",trig:"交易",
   gain:[{lv:1,scene:"交易",type:"bonus",value:1,label:"疑心"},{lv:2,scene:"交易",type:"bonus",value:1,label:"疑心"},{lv:3,scene:"交易",type:"bonus",value:2,label:"疑心"}],
   line:["v57b_盗贼_trust_1","v57b_盗贼_trust_2","v57b_盗贼_trust_3"]}
 ]};
JOB_BRAND_V57["牧师"]={brands:[
  {id:"br_priest_silence",cn:"神恩沉默",desc:"祈祷的时候，你越来越听不见回应。",trig:"修炼",
   gain:[{lv:1,scene:"修炼",type:"pct",value:0.02,label:"静修增益"},{lv:2,scene:"修炼",type:"pct",value:0.02,label:"静修增益"},{lv:3,scene:"修炼",type:"pct",value:0.03,label:"静修增益"}],
   line:["v57b_牧师_silence_1","v57b_牧师_silence_2","v57b_牧师_silence_3"]},
  {id:"br_priest_penance",cn:"苦修自罚",desc:"你开始把每一次失败都算成自己的罪，然后用痛去还。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"殉道"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"殉道"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"殉道"}],
   line:["v57b_牧师_penance_1","v57b_牧师_penance_2","v57b_牧师_penance_3"]},
  {id:"br_priest_word",cn:"圣言偏执",desc:"你开始用经文去量每个人——量出来，全是欠量。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"圣言"},{lv:2,scene:"社交",type:"bonus",value:1,label:"圣言"},{lv:3,scene:"社交",type:"bonus",value:2,label:"圣言"}],
   line:["v57b_牧师_word_1","v57b_牧师_word_2","v57b_牧师_word_3"]}
 ]};
JOB_BRAND_V57["商人"]={brands:[
  {id:"br_trade_debt",cn:"契约良心债",desc:"你每做一笔亏心事，账本上就多一行看不见的欠。",trig:"交易",
   gain:[{lv:1,scene:"交易",type:"bonus",value:1,label:"精明"},{lv:2,scene:"交易",type:"bonus",value:1,label:"精明"},{lv:3,scene:"交易",type:"bonus",value:2,label:"精明"}],
   line:["v57b_商人_debt_1","v57b_商人_debt_2","v57b_商人_debt_3"]},
  {id:"br_trade_tally",cn:"人情算账",desc:"你开始下意识给每个人标价——包括朋友。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"观人"},{lv:2,scene:"社交",type:"bonus",value:1,label:"观人"},{lv:3,scene:"社交",type:"bonus",value:2,label:"观人"}],
   line:["v57b_商人_tally_1","v57b_商人_tally_2","v57b_商人_tally_3"]},
  {id:"br_trade_scale",cn:"天平执念",desc:"你开始觉得，万事都该有个等价物——包括你自己。",trig:"经济",
   gain:[{lv:1,scene:"经济",type:"bonus",value:1,label:"金感"},{lv:2,scene:"经济",type:"bonus",value:1,label:"金感"},{lv:3,scene:"经济",type:"bonus",value:2,label:"金感"}],
   line:["v57b_商人_scale_1","v57b_商人_scale_2","v57b_商人_scale_3"]}
 ]};

Object.assign(JOB_BRAND_V57, {
 "魔法师":{brands:[
  {id:"br_mage_rebound",cn:"禁咒反噬",desc:"你用得越狠的法术，越会在你血脉里留下裂纹。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"法力奔涌"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"法力奔涌"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"法力奔涌"}],
   line:["v57b_魔法师_rebound_1","v57b_魔法师_rebound_2","v57b_魔法师_rebound_3"]},
  {id:"br_mage_thirst",cn:"知识渴求",desc:"你越来越忍不住去翻那些不该翻的书页。",trig:"探索",
   gain:[{lv:1,scene:"修炼",type:"pct",value:0.02,label:"求知增益"},{lv:2,scene:"修炼",type:"pct",value:0.02,label:"求知增益"},{lv:3,scene:"修炼",type:"pct",value:0.03,label:"求知增益"}],
   line:["v57b_魔法师_thirst_1","v57b_魔法师_thirst_2","v57b_魔法师_thirst_3"]},
  {id:"br_mage_tower",cn:"孤塔症",desc:"你开始觉得，别人的话不如书页上的字干净。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"超然"},{lv:2,scene:"社交",type:"bonus",value:1,label:"超然"},{lv:3,scene:"社交",type:"bonus",value:2,label:"超然"}],
   line:["v57b_魔法师_tower_1","v57b_魔法师_tower_2","v57b_魔法师_tower_3"]}
 ]},
 "灵魂法师":{brands:[
  {id:"br_soul_burn",cn:"魂灯燃烧",desc:"每用一次灵魂之力，你就少记得一点自己。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"魂力澎湃"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"魂力澎湃"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"魂力澎湃"}],
   line:["v57b_灵魂法师_burn_1","v57b_灵魂法师_burn_2","v57b_灵魂法师_burn_3"]},
  {id:"br_soul_loathe",cn:"众生厌离",desc:"你看见太多灵魂的底色，开始对人群生出疏远。",trig:"社交",
   gain:[{lv:1,scene:"社交",type:"bonus",value:1,label:"洞见"},{lv:2,scene:"社交",type:"bonus",value:1,label:"洞见"},{lv:3,scene:"社交",type:"bonus",value:2,label:"洞见"}],
   line:["v57b_灵魂法师_loathe_1","v57b_灵魂法师_loathe_2","v57b_灵魂法师_loathe_3"]},
  {id:"br_soul_mirror",cn:"镜中无人",desc:"你渐渐分不清，镜子里那张脸还是不是你的。",trig:"修炼",
   gain:[{lv:1,scene:"修炼",type:"pct",value:0.02,label:"魂灯增益"},{lv:2,scene:"修炼",type:"pct",value:0.02,label:"魂灯增益"},{lv:3,scene:"修炼",type:"pct",value:0.03,label:"魂灯增益"}],
   line:["v57b_灵魂法师_mirror_1","v57b_灵魂法师_mirror_2","v57b_灵魂法师_mirror_3"]}
 ]},
 "术士":{brands:[
  {id:"br_smith_backlash",cn:"造物反噬",desc:"你造的东西，开始有自己的主意——它们记得你。",trig:"探索",
   gain:[{lv:1,scene:"探索",type:"bonus",value:1,label:"造物通感"},{lv:2,scene:"探索",type:"bonus",value:1,label:"造物通感"},{lv:3,scene:"探索",type:"bonus",value:2,label:"造物通感"}],
   line:["v57b_术士_backlash_1","v57b_术士_backlash_2","v57b_术士_backlash_3"]},
  {id:"br_smith_material",cn:"材料执念",desc:"你开始用打量材料的眼光，打量人。",trig:"交易",
   gain:[{lv:1,scene:"交易",type:"bonus",value:1,label:"物性直觉"},{lv:2,scene:"交易",type:"bonus",value:1,label:"物性直觉"},{lv:3,scene:"交易",type:"bonus",value:2,label:"物性直觉"}],
   line:["v57b_术士_material_1","v57b_术士_material_2","v57b_术士_material_3"]},
  {id:"br_smith_furnace",cn:"熔炉孤火",desc:"你越来越觉得，炉火比人暖和。",trig:"战斗",
   gain:[{lv:1,scene:"战斗",type:"bonus",value:1,label:"淬火之力"},{lv:2,scene:"战斗",type:"bonus",value:1,label:"淬火之力"},{lv:3,scene:"战斗",type:"bonus",value:2,label:"淬火之力"}],
   line:["v57b_术士_furnace_1","v57b_术士_furnace_2","v57b_术士_furnace_3"]}
 ]}
});

/* ===== /v57inj:dataFaction ===== */
const ORDER_FACTION_V57 = {};
ORDER_FACTION_V57["盗贼"]={factions:[
  {id:"fac_thief_xia",cn:"侠盗派",doctrine:"偷富人的，还穷人的",npc:["杜·夜枭"],color:"#3a6ea8",stance:"重义",task:"v57q_盗贼_fac_thief_xia_1"},
  {id:"fac_thief_oath",cn:"影誓派",doctrine:"影子不欠人，也不失信",npc:["乌·黛"],color:"#8bc8ea",stance:"重规矩",task:"v57q_盗贼_fac_thief_oath_1"},
  {id:"fac_thief_free",cn:"自由派",doctrine:"谁也别管谁，钱是王八蛋",npc:["薇·灰雾"],color:"#7a2e2e",stance:"重自由",task:"v57q_盗贼_fac_thief_free_1"}
 ]};
ORDER_FACTION_V57["牧师"]={factions:[
  {id:"fac_priest_dogma",cn:"教条派",doctrine:"经文的字，一个不许动",npc:["艾诺尔·银冠"],color:"#3a6ea8",stance:"与教会一体",task:"v57q_牧师_fac_priest_dogma_1"},
  {id:"fac_priest_ascetic",cn:"苦行派",doctrine:"神的爱，靠肉身去证",npc:["玛格达·静烛"],color:"#8bc8ea",stance:"重苦修",task:"v57q_牧师_fac_priest_ascetic_1"},
  {id:"fac_priest_doubt",cn:"质疑派",doctrine:"神若存在，为何沉默",npc:["克莱门·圣言"],color:"#7a2e2e",stance:"重思辨",task:"v57q_牧师_fac_priest_doubt_1"}
 ]};
ORDER_FACTION_V57["商人"]={factions:[
  {id:"fac_trade_honest",cn:"诚信派",doctrine:"一诺千金，童叟无欺",npc:["文森·金秤"],color:"#3a6ea8",stance:"重信誉",task:"v57q_商人_fac_trade_honest_1"},
  {id:"fac_trade_spec",cn:"投机派",doctrine:"低买高卖，天经地义",npc:["洛佩斯·半帆"],color:"#8bc8ea",stance:"重利",task:"v57q_商人_fac_trade_spec_1"},
  {id:"fac_trade_neutral",cn:"中立派",doctrine:"商会不站队，只过秤",npc:["灰·珊"],color:"#7a2e2e",stance:"重中立",task:"v57q_商人_fac_trade_neutral_1"}
 ]};

ORDER_FACTION_V57["战士"]={factions:[
  {id:"fac_war_glory",cn:"荣耀派",doctrine:"战士的死，该死在战场上",npc:["秦·长风"],color:"#3a6ea8",stance:"重战功",task:"v57q_战士_fac_war_glory_1"},
  {id:"fac_war_guard",cn:"守护派",doctrine:"力量不为功名，为身后的人",npc:["格罗·铁壁"],color:"#8bc8ea",stance:"重守护",task:"v57q_战士_fac_war_guard_1"},
  {id:"fac_war_conq",cn:"征服派",doctrine:"强者生来就该开疆",npc:["喀兰·赤峰"],color:"#7a2e2e",stance:"重扩张",task:"v57q_战士_fac_war_conq_1"}
 ]};
ORDER_FACTION_V57["骑士"]={factions:[
  {id:"fac_knight_oath",cn:"守誓派",doctrine:"一诺既出，万山无阻",npc:["罗兰·白盾"],color:"#3a6ea8",stance:"与骑士团一体",task:"v57q_骑士_fac_knight_oath_1"},
  {id:"fac_knight_free",cn:"解放派",doctrine:"誓约是人的，人不是誓约的",npc:["伊莎·晨辉"],color:"#8bc8ea",stance:"倾向世俗",task:"v57q_骑士_fac_knight_free_1"},
  {id:"fac_knight_crusade",cn:"圣战派",doctrine:"光所指处，皆是战场",npc:["m_骑士3"],color:"#7a2e2e",stance:"好战",task:"v57q_骑士_fac_knight_crusade_1"}
 ]};
ORDER_FACTION_V57["游侠"]={factions:[
  {id:"fac_ranger_ward",cn:"护林派",doctrine:"树在，人在",npc:["贺·断弓"],color:"#3a6ea8",stance:"重守望",task:"v57q_游侠_fac_ranger_ward_1"},
  {id:"fac_ranger_hunt",cn:"狩猎派",doctrine:"荒野不问慈悲，只问准头",npc:["艾琳·逐风"],color:"#8bc8ea",stance:"重生存",task:"v57q_游侠_fac_ranger_hunt_1"},
  {id:"fac_ranger_symb",cn:"共生派",doctrine:"人兽草木，都是荒野的住户",npc:["霜辉"],color:"#7a2e2e",stance:"重自然",task:"v57q_游侠_fac_ranger_symb_1"}
 ]};

Object.assign(ORDER_FACTION_V57, {
 "魔法师":{factions:[
  {id:"fac_mage_keep",cn:"守秘派",doctrine:"知识越重，越该有人看守",npc:["洛·晨雾"],color:"#3a6ea8",stance:"与神座亲厚",task:"v57q_魔法师_fac_mage_keep_1"},
  {id:"fac_mage_open",cn:"开明派",doctrine:"知识该流向渴的人",npc:["奥薇恩·星语"],color:"#8bc8ea",stance:"倾向世俗",task:"v57q_魔法师_fac_mage_open_1"},
  {id:"fac_mage_tabu",cn:"禁忌派",doctrine:"被禁的，才是最重要的",npc:["伊尔·灰书"],color:"#7a2e2e",stance:"边缘观望",task:"v57q_魔法师_fac_mage_tabu_1"}
 ]},
 "灵魂法师":{factions:[
  {id:"fac_soul_watch",cn:"守望派",doctrine:"亡者需要一盏常亮的灯",npc:["澜·梦墟"],color:"#3a6ea8",stance:"与圣殿一体",task:"v57q_灵魂法师_fac_soul_watch_1"},
  {id:"fac_soul_ferry",cn:"渡魂派",doctrine:"该走的人，不该被灯留住",npc:["乌·森"],color:"#8bc8ea",stance:"重轮回",task:"v57q_灵魂法师_fac_soul_ferry_1"},
  {id:"fac_soul_leave",cn:"离世派",doctrine:"魂灯不该拴住任何人",npc:["雷·娜"],color:"#7a2e2e",stance:"游离圣殿",task:"v57q_灵魂法师_fac_soul_leave_1"}
 ]},
 "术士":{factions:[
  {id:"fac_smith_create",cn:"造物派",doctrine:"造出来的，就是新的生命",npc:["格朗·符文"],color:"#3a6ea8",stance:"重创新",task:"v57q_术士_fac_smith_create_1"},
  {id:"fac_smith_alc",cn:"炼金派",doctrine:"万物皆可炼，唯人不可",npc:["梅·炽芯"],color:"#8bc8ea",stance:"重药石",task:"v57q_术士_fac_smith_alc_1"},
  {id:"fac_smith_rune",cn:"符文派",doctrine:"纹路里住着法则",npc:["火克"],color:"#7a2e2e",stance:"重传承",task:"v57q_术士_fac_smith_rune_1"}
 ]}
});

/* ===== /v57inj:dataLegacy ===== */

function v57_jobCn(){ try{ if(window.v55_jobCn) return v55_jobCn(); if(window.v52_jobCn) return v52_jobCn(); return (S&&S.job)||""; }catch(e){ return (S&&S.job)||""; } }
function v57_rank(){ try{ return (S&&S.realm)||0; }catch(e){ return 0; } }
function v57_orgRank(){ try{ return window.v52_orgRank? v52_orgRank():0; }catch(e){ return 0; } }
function v57_hasSkill(sk){ try{ var j=v57_jobCn(); return !!((S.skills&&S.skills[j]&&S.skills[j].indexOf(sk)>=0)); }catch(e){ return false; } }
function v57_hasFeat(flag){ try{ return !!((S.feats&&S.feats[flag])||(S.flags&&S.flags[flag])); }catch(e){ return false; } }
function v57_hasPeak(route,lv){ try{ var k='v52_peak_'+route+'_'+lv; return !!((S.peak&&S.peak[k])||(S.flags&&S.flags[k])); }catch(e){ return false; } }
function v57_notify(m){ try{ if(window.flashMsg) flashMsg(m); }catch(e){} }
function v57_el(h){ try{ return elFromHtml(h); }catch(e){ var x=document.createElement('div'); x.innerHTML=h; return x; } }
function v57_om(el){ try{ openModal(el); }catch(e){} }

/* ---------- 默认值 ---------- */
window.v57_ensureDefaults = function(){
  try{
    if(!S.flow) S.flow={};
    if(!S.jobBrand) S.jobBrand={};
    if(!S.factionRep) S.factionRep={};
    if(!S.factionPower) S.factionPower={};
    if(S.apprentice===undefined) S.apprentice=null;
    if(!S.brandLog) S.brandLog=[];
    if(S.flowPts===undefined) S.flowPts=0;
  }catch(e){}
};
window.v57_ensureDefaults=v57_ensureDefaults;

/* ============================================================
   v64 世界局势动态工程 · 引擎（W64）
   marker: /v64inj:engine/
   ============================================================ */
(function(){
try{
var w64 = window.W64_WorldState = window.W64_WorldState || {};

/* ---- 兜底（S 新字段，链入 v57） ---- */
window.w64_ensureDefaults = function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.v57_ensureDefaults){ try{ v57_ensureDefaults(); }catch(e){} }
    if(!S.worldState) S.worldState={};
    var ws=S.worldState;
    if(!ws.factions) ws.factions={};
    if(!ws.relations) ws.relations={};
    if(!ws.activeSituations) ws.activeSituations=[];
    if(!ws.wars) ws.wars=[];
    if(!ws.disasters) ws.disasters=[];
    if(!ws.regions) ws.regions={};
    if(!ws.market) ws.market={};
    if(!ws.politics) ws.politics={papacy:{vacant:true,candidates:[],favor:{},electionDay:0},crises:[]};
    if(ws.lastTick===undefined) ws.lastTick=0;
    if(ws.lastSituationGen===undefined) ws.lastSituationGen=0;
    if(!S.worldGoals) S.worldGoals=[];
    if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
    if(!S.w64Heard) S.w64Heard={};
    if(!S.w64Karma) S.w64Karma={};
    if(S.w64Side===undefined) S.w64Side=null;
    if(S.w64Camp===undefined) S.w64Camp='';
    if(S.w64Aftermath===undefined) S.w64Aftermath=null; // v64b:engine
    if(!S.worldChronicle) S.worldChronicle=[];
    if(window.v65_ensureDefaults){ try{ v65_ensureDefaults(); }catch(e){} } // v65:engine
  }catch(e){}
};
window.w64_ensureDefaults=w64_ensureDefaults;

// v65:engine 战争与战斗总框架（W65_WAR 五大骨架：军团/战役/恩怨/军校/军功经济）
var W65_WAR=(function(){
  var D={
    // 一、军团骨架：兵种表（9 类 × 种族变体留位）
    troops:[
      {id:'inf',cn:'步兵',atk:10,def:14,cost:30,upkeep:2,counter:'none',desc:'耐打，能顶住战线。'},
      {id:'arc',cn:'弓手',atk:14,def:6,cost:40,upkeep:3,counter:'none',desc:'雨里拉不开弓，平原上要人命。'},
      {id:'cav',cn:'骑兵',atk:16,def:8,cost:60,upkeep:4,counter:'inf',desc:'平原冲锋无双，进不了森林。'},
      {id:'mage',cn:'法师团',atk:20,def:4,cost:90,upkeep:6,counter:'inf',desc:'一发火球烧一列。怕近身。'},
      {id:'cleric',cn:'牧师团',atk:6,def:10,cost:70,upkeep:5,counter:'none',desc:'能奶能净化，军心所系。'},
      // 种族变体位（≥50% 扩展位）：dwarf_heavy 矮人重步 / elf_archer 精灵游骑 / orc_berserk 兽人狂战 / half_foot 半身人轻步
      {id:'dwarf_heavy',cn:'矮人重步',atk:12,def:20,cost:80,upkeep:5,counter:'inf',desc:'盾墙立起来，攻城锤都撞不动。'},
      {id:'elf_archer',cn:'精灵游骑',atk:18,def:7,cost:90,upkeep:5,counter:'arc',desc:'林间来去，箭无虚发。'},
      {id:'orc_berserk',cn:'兽人狂战',atk:24,def:10,cost:70,upkeep:6,counter:'cav',desc:'疯起来连自己人都砍。'},
      {id:'half_foot',cn:'半身人轻步',atk:8,def:8,cost:25,upkeep:1,counter:'none',desc:'跑得快，打得巧，活着回来。'}
    ],
    // 军衔 8 级
    ranks:[
      {id:'recruit',cn:'新兵',bonus:0},
      {id:'veteran',cn:'老兵',bonus:2},
      {id:'squad',cn:'伍长',bonus:3},
      {id:'cent',cn:'百夫长',bonus:5},
      {id:'chiliarch',cn:'千夫长',bonus:8},
      {id:'colonel',cn:'校尉',bonus:12},
      {id:'general',cn:'将军',bonus:18},
      {id:'marshal',cn:'元帅',bonus:25}
    ],
    // 二、战役骨架：阵型 4 + 地形 4
    formations:[
      {id:'phalanx',cn:'方阵',desc:'守势+4，骑兵冲锋无效化。',m:{def:4,atk:0}},
      {id:'skirmish',cn:'散阵',desc:'闪避+4，接敌判定+2。',m:{def:2,atk:2}},
      {id:'ambush',cn:'伏击',desc:'先手判定+6，首轮伤害+4。',m:{atk:4}},
      {id:'hold',cn:'坚守',desc:'士气消耗-50%，反击+2。',m:{def:2,atk:2,morale:1}}
    ],
    terrains:[
      {id:'plain',cn:'平原',m:{cav:4,arc:2},desc:'骑兵的天下。'},
      {id:'forest',cn:'森林',m:{cav:-6,inf:2,arc:2},desc:'弓手与步兵的猎场。'},
      {id:'mountain',cn:'山地',m:{cav:-8,inf:2,cleric:2},desc:'易守难攻，粮道难行。'},
      {id:'swamp',cn:'沼泽',m:{cav:-8,inf:-4,mage:-2},desc:'谁都走不快，瘟疫爱在这扎营。'}
    ],
    // 战场事件池（20+ 骨架，12 条落地）
    events:[
      {id:'duel',cn:'阵前斗将',w:6,desc:'对面阵前出来一人叫阵。'},
      {id:'ambush_ev',cn:'敌军伏兵',w:6,desc:'侧翼林子里杀出一队人。'},
      {id:'reinforce',cn:'援军抵达',w:5,desc:'地平线上扬起烟尘。'},
      {id:'omen_sky',cn:'天象异变',w:4,desc:'雷雨/烈风/浓雾，天命难测。'},
      {id:'supply_cut',cn:'粮道被断',w:5,desc:'运粮队被劫，军心浮动。'},
      {id:'spy_in',cn:'敌营内应',w:4,desc:'一封密信塞进了你的营帐。'},
      {id:'morale_break',cn:'士气崩溃',w:5,desc:'有人丢下兵器跑了。'},
      {id:'disease',cn:'军中瘟疫',w:4,desc:'营地里开始有人发热。'},
      {id:'treasure',cn:'战场遗宝',w:3,desc:'尸堆里露出半截剑柄。'},
      {id:'deserter',cn:'逃兵求饶',w:3,desc:'几个逃兵跪在路边。'},
      {id:'herald',cn:'敌方使者',w:4,desc:'打着白旗的人来了。'},
      {id:'civ',cn:'难民冲阵',w:5,desc:'平民哭喊着从两军之间跑过。'}
    ],
    // 军旅日常事件池（v65.1：5 类 × 8 = 40 条；special 走节点）
    campEvents:[
      // 操练类 8
      {id:'drill_duel',kind:'操练',text:'校场上有人朝你扬了扬木枪。不接，就是认怂。',effect:{morale:2,xp:5}},
      {id:'drill_master',kind:'操练',text:'教头把你按在沙坑里，让你把枪举到月亮出来。',effect:{xp:8,hp:-5}},
      {id:'drill_cry',kind:'操练',text:'新兵夜里哭醒，抱着被子喊娘。你假装没听见。',effect:{morale:2}},
      {id:'drill_stick',kind:'操练',text:'有人偷懒挨了军棍，趴在条凳上，血从裤腿渗出来。',effect:{xp:3}},
      {id:'drill_arrow',kind:'操练',text:'你射了三箭，一箭脱靶，两箭上靶边。教头说：」够吃军粮了。」',effect:{xp:6}},
      {id:'drill_snow',kind:'操练',text:'雪地里操演，手冻得握不住枪杆。有人把布条递给你裹手。',effect:{morale:2,xp:4}},
      {id:'drill_night',kind:'操练',text:'夜训火把插了一排，影子在雪地上乱晃，像活人又像鬼。',effect:{xp:5,san:-2}},
      {id:'drill_old',kind:'操练',text:'老兵故意绊你一脚，你摔了个狗啃泥。营房里笑成一片。',effect:{morale:-2,xp:3}},
      // 同袍类 8
      {id:'mate_meat',kind:'同袍',text:'伙房分肉，分到你手里只剩骨头。旁边人把自己那块撕了一半给你。',effect:{morale:4}},
      {id:'mate_dice',kind:'同袍',text:'夜里有人赌钱，喊你下注。你输了三枚铜板，赢了个笑。',effect:{gold:-3,morale:2}},
      {id:'mate_blade',kind:'同袍',text:'同袍向你借刀，说去剔箭头的倒刺。还回来时刀口磨得发亮。',effect:{morale:2}},
      {id:'mate_talk',kind:'同袍',text:'你听见同袍说梦话，喊的是老家妹妹的名字。',effect:{san:2}},
      {id:'mate_letter',kind:'同袍',text:'有人托你带家书。信纸被汗浸皱了，字迹洇开一角。',effect:{morale:3}},
      {id:'mate_blanket',kind:'同袍',text:'夜里有人抢你被子，你俩在营帐里滚成一团，最后合盖一床。',effect:{morale:3}},
      {id:'mate_watch',kind:'同袍',text:'换岗的人迟了一刻钟。你没吭声，他给你带了一壶热水。',effect:{morale:2}},
      {id:'mate_wound',kind:'同袍',text:'同袍背上的伤裂开了，你帮他换药。他咬着布条一声不吭。',effect:{morale:4}},
      // 军纪类 8
      {id:'law_ale',kind:'军纪',text:'有人违令买酒，被罚绕着校场跑。酒壶还挂在他脖子上。',effect:{xp:2}},
      {id:'law_sneak',kind:'军纪',text:'有人偷溜出营，天亮才回来，靴子上全是泥。没人问。',effect:{morale:-1}},
      {id:'law_argue',kind:'军纪',text:'有人顶撞校尉，被罚站到雪里。他站了一夜，没倒。',effect:{xp:3}},
      {id:'law_court',kind:'军纪',text:'军法处置违令者，全营列队看。你数着棍子，数到二十三。',effect:{morale:-3,xp:4}},
      {id:'law_pay',kind:'军纪',text:'军饷被克扣了一成。没人敢说，也没人不说。',effect:{morale:-4}},
      {id:'law_loot',kind:'军纪',text:'有人私藏战利品被搜出来。一块玉，半截银链，他爹的遗物。',effect:{morale:-2}},
      {id:'law_merit',kind:'军纪',text:'有人谎报战功，把别人的首级记在自己名下。事发了。',effect:{morale:-3}},
      {id:'law_skip',kind:'军纪',text:'有人操练时开小差，躲在粮车里睡了一天。你替他挡了半个时辰。',effect:{morale:2}},
      // 战事类 8
      {id:'war_spy',kind:'战事',text:'夜里有敌探摸进营，惊动了狗。火把亮起时，只剩一截脚印。',effect:{morale:-2,warFame:3}},
      {id:'war_supply',kind:'战事',text:'粮道告急，运粮队迟了三日。伙房开始往粥里掺野菜。',effect:{supply:2,morale:-3}},
      {id:'war_scout',kind:'战事',text:'派出去的斥候少回来一个。马回来了，人没有。',effect:{morale:-3}},
      {id:'war_reinf',kind:'战事',text:'援军到了，旗号不认识，领头的说话带口音。营里热闹了一晚。',effect:{morale:5}},
      {id:'war_flag',kind:'战事',text:'军旗被污了，有人说是不祥之兆。旗手跪着擦了一夜。',effect:{morale:-3}},
      {id:'war_plague',kind:'战事',text:'战马开始打喷嚏，兽医说是马瘟。马厩里点起了艾草。',effect:{supply:-2,morale:-2}},
      {id:'war_gear',kind:'战事',text:'撞城的器械裂了缝，木匠连夜赶修，锤声敲到天亮。',effect:{xp:3}},
      {id:'war_move',kind:'战事',text:'换防令到了。营帐拆了又搭，人困马乏，没人抱怨。',effect:{morale:-2,xp:4}},
      // 杂事类 8
      {id:'misc_merchant',kind:'杂事',text:'随军商人蹲在营门外，卖烟叶、卖药、卖旧怀表。贵得离谱。',effect:{gold:-2}},
      {id:'misc_medic',kind:'杂事',text:'军医给你把脉，说你肝火旺，少想事。你心想：军营里哪有不心事的。',effect:{hp:5}},
      {id:'misc_fortune',kind:'杂事',text:'营里来了个算命的，说你有将星。你付了一枚铜板，他多说了半句。',effect:{gold:-1,morale:3}},
      {id:'misc_mourn',kind:'杂事',text:'营外有妇人哭丧，抱着件血衣。守门的兵假装没看见。',effect:{san:-3}},
      {id:'misc_herald',kind:'杂事',text:'传令兵跑断腿，从帅帐到各营。你分到一碗姜汤。',effect:{morale:2}},
      {id:'misc_jailer',kind:'杂事',text:'狱卒来营里领人，说是逃兵。他脚镣拖地，一路没人抬头。',effect:{morale:-2}},
      {id:'misc_gossip',kind:'杂事',text:'营外巷子里的传闻传到你这：谁家的媳妇跟人跑了，谁家的田被占了。',effect:{san:-2}},
      {id:'misc_ghost',kind:'杂事',text:'夜哨说看见鬼火。老兵说那是磷，是死人的骨头在发光。',effect:{san:-3,morale:1}},
      {id:'stand_jealous',kind:'军纪',text:'你升得快，有人心里不是滋味。',special:'v652_stand_jealous'},
      {id:'stand_praise',kind:'操练',text:'校场上有人当众提起你上一仗的名字。',special:'v652_stand_praise'},
      {id:'stand_rival',kind:'战事',text:'你看见一张脸，和你的宿敌有七八分像。',special:'v652_stand_rival'},
      {id:'stand_mentor',kind:'操练',text:'一位同职业的前辈叫住你，看了你半天。',special:'v652_stand_mentor'},
      {id:'stand_wound_care',kind:'同袍',text:'军医帐里有人受了伤，喊你搭把手。',special:'v652_stand_wound_care'},
      {id:'stand_desert',kind:'军纪',text:'营门口多了一双靴印，朝北。',special:'v652_stand_desert'},
    ],

    // 三、恩怨骨架：恩怨类型与等级
    grudgeTypes:{hurt:'伤',slay:'屠',capture:'俘',death:'死',betray:'叛'},
    grudgeLevels:[
      {min:0,cn:'无怨'},
      {min:2,cn:'记恨'},
      {min:5,cn:'仇深'},
      {min:9,cn:'血仇'}
    ],
    // 宣战理由表（5 类）
    causes:[
      {id:'feud',cn:'世仇',weight:5,text:'旧账翻出来，总要有个了断。'},
      {id:'resource',cn:'资源',weight:4,text:'矿脉、粮仓、商路——都想要。'},
      {id:'faith',cn:'信仰',weight:4,text:'异端该死，圣战有理。'},
      {id:'marriage',cn:'联姻破裂',weight:3,text:'婚约撕了，聘礼成了战书。'},
      {id:'provoke',cn:'玩家煽动',weight:2,text:'有人在两边的篝火旁都说了话。'}
    ],
    // 四、军校骨架：课程 4 门 + 兵法
    courses:[
      {id:'strategy',cn:'兵法·谋略',art:'阵而后战，兵法之常',gain:'v65_art:strategy',desc:'学阵型与调度。'},
      {id:'logistics',cn:'兵法·后勤',art:'三军未动，粮草先行',gain:'v65_art:logistics',desc:'学粮道与补给。'},
      {id:'courage',cn:'武技·胆气',art:'狭路相逢勇者胜',gain:'v65_art:courage',desc:'学阵前不惧。'},
      {id:'sandtable',cn:'沙盘推演',art:'复盘一仗，胜过十场实战',gain:'v65_art:sandtable',desc:'推演一场旧战。'}
    ],
    arts:{
      strategy:{cn:'谋略',eff:'布阵判定+2'},
      logistics:{cn:'后勤',eff:'军队消耗-20%'},
      courage:{cn:'胆气',eff:'斗将判定+2'},
      sandtable:{cn:'沙盘',eff:'战场事件先手判定+1'}
    },
    // 五、军功经济骨架：佣兵单
    jobs:[
      {id:'guard',cn:'守城',pay:80,fame:10,risk:1,desc:'某城缺人守垛口，三天。'},
      {id:'escort',cn:'护送商队',pay:100,fame:8,risk:2,desc:'东境到自由港，路上不太平。'},
      {id:'siege',cn:'攻寨',pay:200,fame:20,risk:3,desc:'拔掉山口那座匪寨。'},
      {id:'assassin',cn:'灭口',pay:300,fame:5,risk:4,desc:'有人出一大笔钱，要一个人永远闭嘴。'}
    ],
    // 军队（4 势力，从军线）
    armies:[
      {id:'north',cn:'北境军',seat:'北境城',doctrine:'铁与雪，强者为尊',troops:['inf','arc','cav','dwarf_heavy']},
      {id:'church',cn:'教廷骑士团',seat:'圣辉城',doctrine:'圣光普照，秩序至高',troops:['inf','cav','cleric']},
      {id:'academy',cn:'学院法师团',seat:'学院城',doctrine:'知识不应设限',troops:['mage','arc','inf']},
      {id:'free',cn:'自由城邦佣兵团',seat:'自由港',doctrine:'金钱不认出身',troops:['inf','arc','half_foot','mage']}
    ],
    // 战后城市创伤状态（方向六）
    scarStates:{ruin:'废墟',refugee:'难民潮',orphan:'孤儿',veteran:'老兵'}
  };
  return {D:D, fid:function(id){ for(var i=0;i<D.troops.length;i++){ if(D.troops[i].id===id) return D.troops[i]; } return null; },
          fname:function(id){ var t=D.fid(id); return t?t.cn:id; }};
})();
// v65_ensureDefaults（链入 w64_ensureDefaults：在 w64 兜底尾部注入调用）
window.v65_ensureDefaults=function(){
  try{
    if(typeof S==='undefined'||!S) return;
    if(window.w64_ensureDefaults){ try{ w64_ensureDefaults(); }catch(e){} }
    if(!S.militaryCareer) S.militaryCareer=null;
    if(!S.warGrudges) S.warGrudges={};
    if(!S.army) S.army=null; // 玩家私军（后续版本立国线启用，本版框架留位）
    if(S.warFame===undefined) S.warFame=0;
    if(!S.warScars) S.warScars={};
    if(!S.mercenary) S.mercenary={rank:0,jobs:[],done:0};
    if(!S.v65Heard) S.v65Heard={};
    if(S.w65Battle===undefined) S.w65Battle=null; // 战役中间态（不入存档分页）
    // v65.1 部队与同袍兜底
    if(S.militaryCareer&&!S.militaryCareer.unit) S.militaryCareer.unit={size:0,type:'inf',hp:100,supply:0,banner:''};
    if(S.militaryCareer&&!S.militaryCareer.comrades) S.militaryCareer.comrades=[];
    // v65.2 随军强者与俘虏兜底
    if(S.militaryCareer&&!S.militaryCareer.generals) S.militaryCareer.generals=[];
    if(S.militaryCareer&&!S.militaryCareer.captives) S.militaryCareer.captives=[];
    // v65.3 佣兵扩展与创伤/战后字段兜底
    if(S.mercenary&&S.mercenary.contracts===undefined) S.mercenary.contracts=[];
    if(S.mercenary&&S.mercenary.deals===undefined) S.mercenary.deals=[];
    if(S.mercenary&&S.mercenary.bountyList===undefined) S.mercenary.bountyList=[];
    if(S.mercenary&&S.mercenary.level===undefined) S.mercenary.level=0;
    if(S.militaryCareer&&!S.militaryCareer.trauma) S.militaryCareer.trauma={level:0,kinds:{},day:0};
    if(S.militaryCareer&&!S.militaryCareer.postWar) S.militaryCareer.postWar=null;
    if(S.militaryCareer&&S.militaryCareer.generalsCapBoost===undefined) S.militaryCareer.generalsCapBoost=0;
    if(S.militaryCareer&&!S.militaryCareer.ownBattles) S.militaryCareer.ownBattles=[];
    /* /v66inj:ensure/ v66 兜底链入 */
    if(window.v66_ensureDefaults){ try{ v66_ensureDefaults(); }catch(e){} }
  }catch(e){}
};
// v651:engine
// 恩怨等级
window.v65_grudgeLevel=function(a,b){
  try{
    v65_ensureDefaults();
    var k=a+'|'+b, g=S.warGrudges[k];
    if(!g) return 0;
    var w=g.weight||0, lv=0;
    var lvs=W65_WAR.D.grudgeLevels;
    for(var i=0;i<lvs.length;i++){ if(w>=lvs[i].min) lv=i; }
    return lv;
  }catch(e){ return 0; }
};
window.v65_grudgeCn=function(a,b){
  var lv=v65_grudgeLevel(a,b);
  return W65_WAR.D.grudgeLevels[lv].cn;
};
// 恩怨入账（a 对 b 记一笔）
window.v65_grudgeAdd=function(a,b,type,weight,note,day){
  try{
    v65_ensureDefaults();
    if(b==='你'&&S.militaryCareer&&S.militaryCareer.armyId) b=S.militaryCareer.armyId;
    if(a==='你'&&S.militaryCareer&&S.militaryCareer.armyId) a=S.militaryCareer.armyId;
    var k=a+'|'+b, g=S.warGrudges[k];
    var d=(day!==undefined)?day:((S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:S.day||0);
    if(!g){ S.warGrudges[k]={type:type,weight:0,day:d,note:note||'',count:0}; g=S.warGrudges[k]; }
    g.weight=Math.min(12,(g.weight||0)+weight);
    g.type=type; g.day=d; g.count=(g.count||0)+1;
    if(note) g.note=note;
    if(window.w64_broadcast && weight>=4){ try{ w64_broadcast('恩怨', a+'对'+b+'记下了一笔：'+note+'。', d); }catch(e){} }
    return g;
  }catch(e){ return null; }
};
// 从军：加入势力军队
window.v65_joinArmy=function(armyId){
  try{
    v65_ensureDefaults();
    var A=null; for(var i=0;i<W65_WAR.D.armies.length;i++){ if(W65_WAR.D.armies[i].id===armyId) A=W65_WAR.D.armies[i]; }
    if(!A) return false;
    S.militaryCareer={armyId:armyId,rankIdx:0,date:S.day||0,fame:0,training:20,morale:70,supply:50,troops:{inf:10},unit:null,comrades:[]};
    S.militaryCareer.unit={size:10,type:'inf',hp:100,supply:10,banner:v651_banner()};
    try{ if(window.v65_genComrades) v65_genComrades(); }catch(e){}
    return true;
  }catch(e){ return false; }
};
// 军衔
window.v65_rank=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer) return null;
    var idx=S.militaryCareer.rankIdx||0;
    return W65_WAR.D.ranks[Math.min(idx,W65_WAR.D.ranks.length-1)];
  }catch(e){ return null; }
};
// 军功晋升（军功点达标自动升）
window.v65_promote=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer) return false;
    var need=[0,10,25,50,90,150,250,400];
    var idx=S.militaryCareer.rankIdx||0;
    if(idx>=W65_WAR.D.ranks.length-1) return false;
    var fame=S.warFame||0;
    var moved=false;
    while(idx<W65_WAR.D.ranks.length-1 && fame>=need[idx+1]){ idx++; moved=true; }
    if(moved){ S.militaryCareer.rankIdx=idx; return true; }
    return false;
  }catch(e){ return false; }
};
// 战斗加成钩子（FeatCombat 同槽加项，封顶由既有机制保证）
window.v65_armyBonus=function(){
  try{
    var b=0;
    if(S.militaryCareer){
      var r=v65_rank(); if(r) b+=r.bonus;
      if(S.militaryCareer.training>=60) b+=2;
      if(S.militaryCareer.morale>=80) b+=2;
    }
    if(S.army && S.army.troops){ b+=Math.min(4,Math.floor(Object.keys(S.army.troops).length/2)); }
    // v65.3 佣兵加成与创伤惩罚（只加值不改公式）
    if(window.v653_battleBonus){ try{ b+=v653_battleBonus(); }catch(e){} }
    return b;
  }catch(e){ return 0; }
};
// 每周结算：军旅消耗/恩怨扩散/冲突升级/战后入账/创伤
window.v65_tick=function(){
  try{
    v65_ensureDefaults();
    var d=(S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:S.day||0;
    var ws=S.worldState;
    // 1) 军旅消耗与士气
    if(S.militaryCareer){
      var mc=S.militaryCareer;
      mc.supply=Math.max(0,(mc.supply||0)-((mc.troops&&mc.troops.inf)?Math.max(2,Math.floor(mc.troops.inf/10)):2));
      if(mc.supply<=0){ mc.morale=Math.max(10,(mc.morale||70)-10); }
      else { mc.morale=Math.min(100,(mc.morale||70)+1); }
    }
    // 1.5) 部队状态与军旅事件（v65.1）
    if(mc && mc.unit){
      if(mc.unit.hp===undefined) mc.unit.hp=100;
      if(mc.supply<=0){ mc.unit.hp=Math.max(20,mc.unit.hp-2); }
      if(mc.unit.supply>0) mc.unit.supply--;
    }
    try{ if(window.v65_campEvent) v65_campEvent(d); }catch(e){}
    try{ if(window.v652_siegeTick) v652_siegeTick(d); }catch(e){}
    try{ if(window.v653_tick) v653_tick(d); }catch(e){}
    // 2) 恩怨随时间微衰减（记恨会淡，血仇不会）
    var keys=Object.keys(S.warGrudges);
    for(var i=0;i<keys.length;i++){
      var g=S.warGrudges[keys[i]];
      if(g && g.weight>0 && g.weight<9 && d-g.day>60){ g.weight=Math.max(0,g.weight-1); }
    }
    // 3) 冲突升级：紧张势力对自动宣战（框架：rel<=-60 且 20% 概率）
    if(ws && ws.relations){
      var relKeys=Object.keys(ws.relations);
      for(var j=0;j<relKeys.length;j++){
        var rk=relKeys[j], rv=ws.relations[rk];
        if(rv<=-60 && Math.random()<0.05){
          var pair=rk.split('-');
          if(pair.length===2 && window.w64_startWar){
            var c=W65_WAR.D.causes[Math.floor(Math.random()*W65_WAR.D.causes.length)];
            w64_startWar(pair[0],pair[1],c.cn,d);
          }
        }
      }
    }
    // 4) 战后恩怨入账（phase==4 且未入账）
    if(ws && ws.wars){
      for(var w=0;w<ws.wars.length;w++){
        var war=ws.wars[w];
        if(war.phase===4 && !war.grudgeBooked && war.result){
          war.grudgeBooked=true;
          var wta=(war.result.winner||war.a), wtb=(war.result.loser||war.b);
          if(war.result.type==='annihilate') v65_grudgeAdd(wta,wtb,'slay',5,'灭国之战，'+(W65_WAR&&window.w64_fname?w64_fname(wtb):wtb)+'的旗被踩进泥里',d);
          else v65_grudgeAdd(wta,wtb,'hurt',2,'战败之耻：'+(window.w64_fname?w64_fname(wtb):wtb)+'割地求和',d);
          // 玩家参战：胜利方记仇对方，失败方记仇玩家
          if(S.w64Side===war.id && S.militaryCareer){
            v65_grudgeAdd(wtb,war.a,'hurt',1,'在'+war.front+'的战场上,你的军队随'+ (window.w64_fname?w64_fname(wta):wta) +'作战',d);
          }
        }
      }
    }
    // 5) 军功点自然积累（军旅在营每周 +1）
    if(S.militaryCareer){ S.warFame=(S.warFame||0)+1; if(v65_promote()){ if(window.flashMsg) flashMsg('你晋升了：'+(v65_rank().cn)); } }
  }catch(e){}
};
// 佣兵：接单/完成
window.v65_takeJob=function(jobId){
  try{
    v65_ensureDefaults();
    var J=null; for(var i=0;i<W65_WAR.D.jobs.length;i++){ if(W65_WAR.D.jobs[i].id===jobId) J=W65_WAR.D.jobs[i]; }
    if(!J) return false;
    if(S.mercenary.jobs.indexOf(jobId)>=0) return false;
    S.mercenary.jobs.push(jobId);
    return true;
  }catch(e){ return false; }
};
window.v65_finishJob=function(jobId){
  try{
    v65_ensureDefaults();
    var J=null; for(var i=0;i<W65_WAR.D.jobs.length;i++){ if(W65_WAR.D.jobs[i].id===jobId) J=W65_WAR.D.jobs[i]; }
    if(!J) return false;
    var ix=S.mercenary.jobs.indexOf(jobId);
    if(ix<0) return false;
    S.mercenary.jobs.splice(ix,1);
    S.gold=(S.gold||0)+J.pay;
    S.warFame=(S.warFame||0)+J.fame;
    S.mercenary.done=(S.mercenary.done||0)+1;
    S.mercenary.rank=Math.min(100,(S.mercenary.rank||0)+8+J.risk*3);
    if(window.flashMsg) flashMsg('佣兵单完成：+'+J.pay+'金，+'+J.fame+'军功');
    return true;
  }catch(e){ return false; }
};
// 军功兑换
window.v65_exchange=function(item){
  try{
    v65_ensureDefaults();
    var costs={armor:60,scroll:80,title:120,intel:50};
    var out={
      armor:{cn:'军中精甲',desc:'防御+2（全局）'},
      scroll:{cn:'战技卷轴',desc:'学会一个战技，斗将判定+1'},
      title:{cn:'战功头衔',desc:'称号「百战余生」，酒馆传闻会提你'},
      intel:{cn:'敌情情报',desc:'解锁一条敌方动向传闻'}
    };
    var c=costs[item]; if(c===undefined||(S.warFame||0)<c) return false;
    S.warFame-=c;
    if(item==='armor'){ if(!S.attrs) S.attrs={}; S.attrs.def=(S.attrs.def||0)+2; }
    if(item==='scroll'){ if(!S.v65Heard) S.v65Heard={}; S.v65Heard.scroll=true; }
    if(item==='title'){ if(!S.titles) S.titles=[]; if(S.titles.indexOf('百战余生')<0) S.titles.push('百战余生'); }
    if(item==='intel'){ if(!S.v65Heard) S.v65Heard={}; S.v65Heard.intel=true; }
    // v65.3 军功消费扩展
    if(item==='renown'){ S.mercenary.rank=Math.min(100,(S.mercenary.rank||0)+Math.floor(c/10)); }
    if(item==='bond'){ if(!S.v65Heard) S.v65Heard={}; S.v65Heard.warBond={day:(S.day||0),cost:c}; }
    if(item==='officer'){ if(S.militaryCareer) S.militaryCareer.generalsCapBoost=(S.militaryCareer.generalsCapBoost||0)+1; }
    if(window.flashMsg) flashMsg('兑换成功：'+out[item].cn);
    return true;
  }catch(e){ return false; }
};
// 创伤：战后城市状态写入
window.v65_scar=function(city,state,day){
  try{
    v65_ensureDefaults();
    var d=(day!==undefined)?day:((S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:S.day||0);
    if(!S.warScars[city] || (d-(S.warScars[city].day||0)>30)){ S.warScars[city]={state:state,day:d}; return true; }
    return false;
  }catch(e){ return false; }
};
// 旗帜名生成（v65.1）
function v651_banner(){
  var b=['铁','雪','狼','山','鹰','虎'];
  return b[Math.floor(Math.random()*b.length)]+'旗';
}
// 军衔部队上限（v65.1：新兵10人小队 → 元帅全军团）
window.v65_unitCap=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer) return 0;
    var caps=[10,20,50,100,500,1000,3000,99999];
    var idx=Math.min(S.militaryCareer.rankIdx||0,caps.length-1);
    return caps[idx];
  }catch(e){ return 0; }
};
// 部队战斗修正（v65.1：只加值不改公式）
window.v65_unitBonus=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer||!S.militaryCareer.unit) return 0;
    var u=S.militaryCareer.unit;
    if(!u.size) return 0;
    var bonuses=[0,0,1,3,5,8,12,20];
    var idx=Math.min(S.militaryCareer.rankIdx||0,bonuses.length-1);
    var sizeB=Math.min(4,Math.floor(u.size/250));
    return bonuses[idx]+sizeB;
  }catch(e){ return 0; }
};
// 同袍生成（v65.1：入营 3-5 人）
window.v65_genComrades=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer||S.militaryCareer.comrades&&S.militaryCareer.comrades.length) return;
    var n=3+Math.floor(Math.random()*3);
    var roles=['伍长','老兵','同乡','书呆子','猎户','孤儿','马倌','厨子'];
    var namePool=window.NAME_GEN_V53||null;
    var mercy=(S.worldFame&&S.worldFame.mercy)?Math.floor(S.worldFame.mercy/10):0;
    var list=[];
    for(var i=0;i<n;i++){
      var nm='无名';
      if(namePool&&typeof namePool==='function'){ try{ nm=namePool(); }catch(e){} }
      else { var z=['阿大','二狗','老槐','铁柱','石锁','山娃','老烟','瘦猴']; nm=z[Math.floor(Math.random()*z.length)]; }
      list.push({id:'cm'+i, name:nm, role:roles[Math.floor(Math.random()*roles.length)],
        valor:1+Math.floor(Math.random()*10), loyal:Math.min(10,1+Math.floor(Math.random()*6)+mercy),
        state:'活', note:''});
    }
    list[0].note='操练时总站你右边，说是你背影比他踏实。';
    if(list[1]) list[1].note='夜里赌钱输了，找你借过一把刀。';
    if(list[2]) list[2].note='家书寄不出去，托你带过一回话。';
    S.militaryCareer.comrades=list;
  }catch(e){}
};
// 玩家相关恩怨查询（v65.1：key 含玩家军队 id）
window.v65_playerGrudge=function(){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer||!S.militaryCareer.armyId) return false;
    var aid=S.militaryCareer.armyId, keys=Object.keys(S.warGrudges||{});
    for(var i=0;i<keys.length;i++){
      var p=keys[i].split('|');
      if(p[0]===aid||p[1]===aid) return true;
    }
    return false;
  }catch(e){ return false; }
};
// 军旅日常事件（v65.1：周结算 12% 抽 1，cond 不满足跳过；special 走节点）
window.v65_campEvent=function(d){
  try{
    v65_ensureDefaults();
    if(!S.militaryCareer) return null;
    if(Math.random()>=0.12) return null;
    var pool=W65_WAR.D.campEvents||[];
    var cand=[];
    for(var i=0;i<pool.length;i++){
      var ev=pool[i];
      if(ev.cond&&typeof ev.cond==='function'){ try{ if(!ev.cond()) continue; }catch(e){ continue; } }
      cand.push(ev);
    }
    if(!cand.length) return null;
    var pick=cand[Math.floor(Math.random()*cand.length)];
    if(pick.special&&typeof window[pick.special]==='function'){ try{ writeNext(pick.special); }catch(e){} return pick; }
    if(typeof flashMsg==='function'){ try{ flashMsg(pick.text); }catch(e){} }
    if(pick.effect){ try{ v651_applyEffect(pick.effect); }catch(e){} }
    return pick;
  }catch(e){ return null; }
};
// 白名单效果落地（v65.1）
function v651_applyEffect(fx){
  var mc=S.militaryCareer;
  if(fx.gold) S.gold=(S.gold||0)+fx.gold;
  if(fx.xp) S.xp=(S.xp||0)+fx.xp;
  if(fx.hp) S.hp=Math.max(1,(S.hp||50)+fx.hp);
  if(fx.san) S.san=Math.max(1,(S.san||50)+fx.san);
  if(fx.reputation) S.reputation=Math.max(0,(S.reputation||0)+fx.reputation);
  if(fx.warFame) S.warFame=Math.max(0,(S.warFame||0)+fx.warFame);
  if(fx.training&&mc) mc.training=Math.min(100,(mc.training||20)+fx.training);
  if(fx.morale&&mc) mc.morale=Math.min(100,(mc.morale||70)+fx.morale);
  if(fx.supply&&mc&&mc.unit) mc.unit.supply=Math.max(0,(mc.unit.supply||0)+fx.supply);
  if(fx.uhp&&mc&&mc.unit) mc.unit.hp=Math.max(20,(mc.unit.hp||100)+fx.uhp);
  if(fx.item) S.item=(S.item||[]).concat(fx.item);
}
// 部队管理面板（v65.1）
window.v65_myunit=function(){
  try{
    if(typeof flashMsg!=='function') return;
    v65_ensureDefaults();
    if(!S.militaryCareer||!S.militaryCareer.unit){ flashMsg('你还没有部队。先去投军。'); return; }
    var u=S.militaryCareer.unit, cap=v65_unitCap(), r=v65_rank();
    var h='<div style="font-size:13px;line-height:1.7;">';
    h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">🏴 部队管理</div>';
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='旗帜：'+u.banner+'<br/>军衔：'+(r?r.cn:'新兵')+'<br/>兵员：'+u.size+'/'+cap+'<br/>战力：'+u.hp+'<br/>军粮：'+u.supply;
    h+='</div>';
    h+="<button class='btn' onclick=\"writeNext('v65_unit_recruit')\">招兵(20金/10人)</button> ";
    h+="<button class='btn' onclick=\"writeNext('v65_unit_supply')\">筹粮(10金/5粮)</button> ";
    h+="<button class='btn' onclick=\"writeNext('v65_unit_rest')\">修整(驻防7日)</button><br/>";
    h+="<button class='btn' onclick='v65_warPanel()'>← 返回战争面板</button>";
    h+='</div>';
    flashMsg(h);
  }catch(e){}
};
// v652:engine 名将与攻城引擎（v65.2）
window.v652_strongById=function(id){
  try{
    for(var k in STRONG_V53){
      var arr=STRONG_V53[k];
      if(arr&&arr.forEach){
        for(var i=0;i<arr.length;i++){ if(arr[i].id===id) return arr[i]; }
      }
    }
  }catch(e){}
  return null;
};
window.v652_strongName=function(id){
  var f=window.v652_strongById?v652_strongById(id):null;
  return f?f.cn:id;
};
window.v652_generalCap=function(){
  var cap=[0,0,1,2,3,4,5,6];
  var ri=(S.militaryCareer&&S.militaryCareer.rankIdx)||0;
  return (ri<cap.length)?cap[ri]:6;
};
window.v652_generalBonus=function(){
  try{
    var mc=S.militaryCareer;
    if(!mc||!mc.generals||!mc.generals.length) return 0;
    var t=0;
    for(var i=0;i<mc.generals.length;i++){
      var g=mc.generals[i];
      if(!g||g.state!=='健') continue;
      var f=v652_strongById(g.strongId);
      if(!f) continue;
      var r=f.realm||0;
      if(r>=6) t+=25; else if(r===5) t+=15; else if(r===4) t+=8; else t+=3;
    }
    return t;
  }catch(e){ return 0; }
};
window.v652_generalRecruit=function(strongId, role){
  try{
    v65_ensureDefaults();
    var mc=S.militaryCareer;
    if(!mc) return false;
    if(!mc.generals) mc.generals=[];
    if(mc.generals.length>=v652_generalCap()) return false;
    for(var i=0;i<mc.generals.length;i++){ if(mc.generals[i].strongId===strongId) return false; }
    var bond=(S.strongBond&&S.strongBond[strongId])?S.strongBond[strongId]:0;
    var mercy=(S.worldFame&&S.worldFame.mercy)||0;
    var loyalty=Math.max(1,Math.min(10,Math.floor(bond/2)+Math.floor(mercy/10)));
    mc.generals.push({strongId:strongId,role:role||'宿将',loyalty:loyalty,state:'健',deeds:{duel:0,win:0,kill:0}});
    return true;
  }catch(e){ return false; }
};
window.v652_generalCandidates=function(){
  // 可征强者：knownStrong 且 bond>=1 且未满员
  var out=[];
  try{
    var mc=S.militaryCareer; if(!mc) return out;
    if((mc.generals?mc.generals.length:0)>=v652_generalCap()) return out;
    for(var k in STRONG_V53){
      var arr=STRONG_V53[k];
      if(!arr||!arr.forEach) continue;
      for(var i=0;i<arr.length;i++){
        var f=arr[i];
        if(!f||!f.id) continue;
        if(!S.knownStrong||!S.knownStrong[f.id]) continue;
        var bond=(S.strongBond&&S.strongBond[f.id])?S.strongBond[f.id]:0;
        if(bond<1) continue;
        var dup=false;
        for(var j=0;j<(mc.generals?mc.generals.length:0);j++){ if(mc.generals[j].strongId===f.id){ dup=true; break; } }
        if(!dup) out.push(f);
      }
    }
  }catch(e){}
  return out;
};
window.v652_casualtyRoll=function(){
  try{
    var mc=S.militaryCareer;
    if(!mc||!mc.generals||!mc.generals.length) return;
    for(var i=0;i<mc.generals.length;i++){
      var g=mc.generals[i];
      if(!g||g.state!=='健') continue;
      var r=Math.random()*100;
      if(r<1){
        g.state='死';
        try{ if(window.v65_grudgeAdd) v65_grudgeAdd(mc.armyId,g.strongId,'死',5,v652_strongName(g.strongId)+'战死'); }catch(e){}
        if(S.item) S.item=S.item.concat(['遗物（'+v652_strongName(g.strongId)+'）']);
      } else if(r<6){
        g.state='伤';
      }
    }
  }catch(e){}
};
window.v652_duelRoll=function(){
  var r=45+Math.floor(Math.random()*55);
  if(S.realm!==undefined) r+=(S.realm-5)*4;
  return r;
};
window.v652_enemyStrong=function(){
  // 敌方叫阵强者：STRONG_V53 中 realm>=5 随机
  var pool=[];
  try{
    for(var k in STRONG_V53){
      var arr=STRONG_V53[k];
      if(!arr||!arr.forEach) continue;
      for(var i=0;i<arr.length;i++){ if(arr[i].realm>=5) pool.push(arr[i]); }
    }
  }catch(e){}
  if(!pool.length) return null;
  return pool[Math.floor(Math.random()*pool.length)];
};
window.v652_standRoll=function(){
  // 军中立场事件：周结算 5%（走 campEvents 池，此处仅兜底函数）
  return null;
};

// v652:siege 攻城引擎（v65.2）
window.v652_siegeStart=function(city){
  try{
    v65_ensureDefaults();
    var mc=S.militaryCareer;
    if(!mc) return false;
    if(!city) return false;
    if(mc.siege&&mc.siege.city===city) return false;
    mc.siege={city:city,wall:100,food:100,water:100,morale:100,prep:0,phase:'围城',startedDay:S.day||0};
    return true;
  }catch(e){ return false; }
};
window.v652_siegeTick=function(d){
  try{
    v65_ensureDefaults();
    var mc=S.militaryCareer;
    if(!mc||!mc.siege) return;
    var s=mc.siege;
    if(s.phase==='破城'||s.phase==='战后') return;
    s.food=Math.max(0,(s.food||100)-6);
    s.water=Math.max(0,(s.water||100)-3);
    if((s.food||0)<=0&&(s.water||0)<=0) s.morale=Math.max(0,(s.morale||100)-12);
    else if((s.food||0)<=0) s.morale=Math.max(0,(s.morale||100)-10);
    if(s.phase==='围城'&&(s.prep||0)<100) s.prep=Math.min(100,(s.prep||0)+12);
    if(mc.unit){ mc.unit.supply=Math.max(0,(mc.unit.supply||0)-Math.ceil((mc.unit.size||0)/100)*2); }
    // 玩家不在场 → 传闻
    var loc='';
    if(typeof curLoc==='function'){ try{ loc=curLoc()||''; }catch(e){} }
    if(loc!==s.city){
      if(!S.missedEvents) S.missedEvents=[];
      if(Math.random()<0.3) S.missedEvents.push({id:'w652_siege_rumor_'+d,text:'听说'+s.city+'被围了，城里快断粮了。'});
      return;
    }
    // 玩家在场 → 守城事件 8%
    if(Math.random()<0.08){
      var pool=['v652_def_ambush','v652_def_traitor','v652_def_burn','v652_def_plague','v652_def_sortie','v652_def_fall'];
      var pid=pool[Math.floor(Math.random()*pool.length)];
      if(typeof writeNext==='function'){ try{ writeNext(pid); }catch(e){} }
    }
  }catch(e){}
};
window.v652_siegeStorm=function(){
  try{
    var b=45+Math.floor(Math.random()*55);
    if(S.realm!==undefined) b+=(S.realm-5)*4;
    var s=(S.militaryCareer&&S.militaryCareer.siege)?S.militaryCareer.siege:null;
    if(s){ b-=s.wall/2; if(s.morale<30) b+=15; }
    if(window.v65_unitBonus){ try{ b+=v65_unitBonus(); }catch(e){} }
    if(window.v652_generalBonus){ try{ b+=v652_generalBonus(); }catch(e){} }
    return b;
  }catch(e){ return 45; }
};
window.v652_siegeAfter=function(kind){
  // kind: take|spare|loot
  try{
    var mc=S.militaryCareer;
    var s=(mc&&mc.siege)?mc.siege:null;
    if(!s) return;
    s.phase='战后';
    // v65.3 军功/四态/创伤
    if(S.warFame!==undefined) S.warFame+=15;
    if(mc){
      mc.postWar={city:s.city,states:[],day:S.day||0};
      if(kind==='take'){ mc.postWar.states=['ruin','orphan']; if(mc.trauma){ mc.trauma.kinds.nightmare=(mc.trauma.kinds.nightmare||0)+1; mc.trauma.day=S.day||0; } }
      else if(kind==='spare'){ mc.postWar.states=['refugee']; }
      else { mc.postWar.states=['ruin']; }
    }
    if(kind==='take'){
      if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+8);
      if(S.corruption!==undefined) S.corruption=Math.min(100,(S.corruption||0)+3);
      if(S.gold!==undefined) S.gold+=100;
    } else if(kind==='spare'){
      if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+8);
      if(S.deity!==undefined) S.deity=Math.min(100,(S.deity||0)+3);
      if(mc&&mc.unit) mc.unit.size+=20;
    } else if(kind==='loot'){
      if(S.gold!==undefined) S.gold+=60;
      if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+3);
      if(S.corruption!==undefined) S.corruption=Math.min(100,(S.corruption||0)+1);
    }
  }catch(e){}
};

// v653:bounty 悬赏榜数据表
var W653_BOUNTY={
  garrison:{id:'garrison',cn:'协防城防',kind:'守城',reward:80,fame:10,minRank:0},
  escort:{id:'escort',cn:'护送商队',kind:'护送',reward:100,fame:8,minRank:0},
  raid:{id:'raid',cn:'攻寨',kind:'攻寨',reward:200,fame:20,minRank:0},
  kill:{id:'kill',cn:'灭口',kind:'灭口',reward:300,fame:5,minRank:30},
  ruin:{id:'ruin',cn:'探索废墟',kind:'探索',reward:150,fame:12,minRank:0},
  arms:{id:'arms',cn:'押运军械',kind:'押运',reward:180,fame:15,minRank:0},
  scout:{id:'scout',cn:'斥候侦察',kind:'斥候',reward:250,fame:18,minRank:0},
  assassin:{id:'assassin',cn:'刺杀敌将',kind:'刺杀',reward:1000,fame:30,minRank:30},
  rescue:{id:'rescue',cn:'营救俘虏',kind:'营救',reward:300,fame:20,minRank:60},
  intel:{id:'intel',cn:'窃取军情',kind:'情报',reward:350,fame:22,minRank:60}
};
window.W653_BOUNTY=W653_BOUNTY;
// v653:merc 佣兵军工引擎（v65.3）
window.v653_fameLevel=function(){
  var f=(S.mercenary&&S.mercenary.rank)||0;
  if(f>=80) return {lv:4,cn:'佣兵团长'};
  if(f>=50) return {lv:3,cn:'佣兵队长'};
  if(f>=20) return {lv:2,cn:'雇佣兵'};
  return {lv:1,cn:'野路子'};
};
window.v653_mercBonus=function(){
  try{
    v65_ensureDefaults();
    if(!S.mercenary) return 0;
    var b=0;
    if((S.mercenary.rank||0)>=30) b+=2;
    var done=S.mercenary.done||0;
    b+=Math.min(4,Math.floor(done/2));
    return b;
  }catch(e){ return 0; }
};
window.v653_contractTick=function(d){
  try{
    v65_ensureDefaults();
    if(!S.mercenary||!S.mercenary.contracts) return;
    var keep=[];
    for(var i=0;i<S.mercenary.contracts.length;i++){
      var c=S.mercenary.contracts[i];
      if(c.status==='进行'&&c.deadline&&d>c.deadline){
        c.status='失败';
        S.mercenary.rank=Math.max(0,(S.mercenary.rank||0)-5);
        if(window.flashMsg) flashMsg('你放了一单。公会里的人看你的眼神变了一点。');
        continue;
      }
      keep.push(c);
    }
    S.mercenary.contracts=keep;
  }catch(e){}
};
window.v653_bountyTake=function(bid){
  try{
    v65_ensureDefaults();
    var B=W653_BOUNTY[bid]; if(!B) return false;
    if(!S.mercenary.contracts) S.mercenary.contracts=[];
    var has=false;
    for(var i=0;i<S.mercenary.contracts.length;i++){ if(S.mercenary.contracts[i].id===bid){ has=true; break; } }
    if(has) return false;
    S.mercenary.contracts.push({id:bid,cn:B.cn,kind:B.kind,day:S.day||0,deadline:(S.day||0)+14,reward:B.reward,fame:B.fame,status:'进行'});
    return true;
  }catch(e){ return false; }
};
window.v653_bountyFinish=function(){
  try{
    v65_ensureDefaults();
    if(!S.mercenary||!S.mercenary.contracts) return null;
    var out=[];
    var keep=[];
    for(var i=0;i<S.mercenary.contracts.length;i++){
      var c=S.mercenary.contracts[i];
      if(c.status==='完成'){
        S.mercenary.rank=Math.min(100,(S.mercenary.rank||0)+(c.fame||0));
        S.mercenary.done=(S.mercenary.done||0)+1;
        if(S.gold!==undefined) S.gold+=c.reward||0;
        out.push(c);
      } else { keep.push(c); }
    }
    S.mercenary.contracts=keep;
    return out;
  }catch(e){ return null; }
};
window.v653_marketCheck=function(){
  // 读 v64 市场：价差>30% 生成机会（14 天有效）
  try{
    w64_ensureDefaults();
    var ws=S.worldState;
    if(!ws||!ws.market||!w64.marketDef) return;
    if(!S.mercenary.deals) S.mercenary.deals=[];
    var want=['arms','grain','herb','abyssm'];
    for(var i=0;i<w64.marketDef.length;i++){
      var M=w64.marketDef[i];
      if(want.indexOf(M.id)<0) continue;
      var m=ws.market[M.id]; if(!m) continue;
      var sup=Math.max(10,m.supply);
      var target=M.base*(0.5+(m.demand/sup)*0.5);
      if(target<M.base*0.1) target=M.base*0.1;
      if(target>M.base*5) target=M.base*5;
      var diff=(target-m.price)/m.price;
      if(Math.abs(diff)>0.3){
        var exists=false;
        for(var j=0;j<S.mercenary.deals.length;j++){ if(S.mercenary.deals[j].id===M.id){ exists=true; break; } }
        if(!exists) S.mercenary.deals.push({id:M.id,cn:M.cn,dir:diff>0?'up':'down',gap:Math.round(Math.abs(diff)*100),day:S.day||0,base:M.base,price:Math.round(m.price),target:Math.round(target)});
      }
    }
    // 过期机会清理（14 天）
    var keep=[];
    for(var k=0;k<S.mercenary.deals.length;k++){ if((S.day||0)-(S.mercenary.deals[k].day||0)<=14) keep.push(S.mercenary.deals[k]); }
    S.mercenary.deals=keep;
  }catch(e){}
};
window.v653_dealSettle=function(id){
  // id: sell_arms | hoard | relief
  try{
    v65_ensureDefaults();
    var deal=S.mercenary.deals&&S.mercenary.deals[0];
    var isMerchant=(S.job&&S.job.indexOf('商人')>=0)?true:false;
    if(id==='sell_arms'){
      var gain=60+(deal?(deal.gap||0):0);
      if(isMerchant) gain=Math.round(gain*1.1);
      if(S.gold!==undefined) S.gold+=gain;
      if(S.worldFame) S.worldFame.terror=Math.min(100,(S.worldFame.terror||0)+2);
    } else if(id==='hoard'){
      var gain2=50;
      if(S.gold!==undefined) S.gold+=gain2;
      if(S.worldFame) S.worldFame.mercy=Math.max(0,(S.worldFame.mercy||0)-2);
    } else if(id==='relief'){
      if(S.gold!==undefined) S.gold=Math.max(0,S.gold-40);
      if(S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+3);
      if(S.deity!==undefined) S.deity=Math.min(100,(S.deity||0)+2);
      if(isMerchant&&S.worldFame) S.worldFame.mercy=Math.min(100,(S.worldFame.mercy||0)+1);
    }
    if(S.mercenary.deals&&S.mercenary.deals.length) S.mercenary.deals.shift();
    return true;
  }catch(e){ return false; }
};

// v653:trauma 创伤战史引擎（v65.3）
window.v653_traumaLevel=function(){
  // 依 kinds 总次数映射等级 0-3
  try{
    var t=(S.militaryCareer&&S.militaryCareer.trauma)?S.militaryCareer.trauma:null;
    if(!t) return 0;
    var n=0; for(var k in t.kinds){ n+=t.kinds[k]||0; }
    if(n>=6) return 3;
    if(n>=4) return 2;
    if(n>=2) return 1;
    return 0;
  }catch(e){ return 0; }
};
window.v653_battleBonus=function(){
  // 佣兵加成（正）- 创伤惩罚（负），总修正封顶 +8
  try{
    var b=0;
    if(window.v653_mercBonus){ try{ b+=v653_mercBonus(); }catch(e){} }
    var lv=window.v653_traumaLevel?v653_traumaLevel():0;
    if(lv===2) b-=2;
    if(lv===3) b-=4;
    if(b>8) b=8;
    return b;
  }catch(e){ return 0; }
};
window.v653_postWarTick=function(d){
  try{
    v65_ensureDefaults();
    var mc=S.militaryCareer;
    if(!mc||!mc.postWar) return;
    var p=mc.postWar;
    if(!p.day){ p.day=d; return; }
    if(d-p.day>84){ mc.postWar=null; return; } // 12 周上限
  }catch(e){}
};
window.v653_scarTick=function(d){
  // 时间治疗：30 天无新创伤 → 总次数 -1
  try{
    v65_ensureDefaults();
    var t=(S.militaryCareer&&S.militaryCareer.trauma)?S.militaryCareer.trauma:null;
    if(!t||!t.day) return;
    if(d-t.day>30){
      var n=0, mk=null;
      for(var k in t.kinds){ if(t.kinds[k]>0){ n+=t.kinds[k]; if(!mk) mk=k; } }
      if(n>0&&mk){ t.kinds[mk]=Math.max(0,(t.kinds[mk]||0)-1); t.day=d; }
    }
  }catch(e){}
};
window.v653_scarHeal=function(way){
  // way: church | veteran
  try{
    v65_ensureDefaults();
    var t=(S.militaryCareer&&S.militaryCareer.trauma)?S.militaryCareer.trauma:null;
    if(!t) return false;
    var n=0, mk=null;
    for(var k in t.kinds){ if(t.kinds[k]>0){ n+=t.kinds[k]; if(!mk) mk=k; } }
    if(n<=0) return false;
    if(way==='church'&&n>=1){ t.kinds[mk]=Math.max(0,(t.kinds[mk]||0)-2); }
    else if(way==='veteran'&&n>=1){ t.kinds[mk]=Math.max(0,(t.kinds[mk]||0)-2); }
    t.day=S.day||0;
    return true;
  }catch(e){ return false; }
};
window.v653_chronicle=function(ev){
  try{
    if(typeof chronicleRecord==='function'){ chronicleRecord('v653_'+ev, ev); }
  }catch(e){}
};
window.v653_epithet=function(){
  var wf=S.warFame||0;
  var lv=window.v653_traumaLevel?v653_traumaLevel():0;
  var mercy=(S.worldFame&&S.worldFame.mercy)||0;
  var slay=(S.worldFame&&S.worldFame.terror)||0;
  if(wf>=80) return '军神';
  if(lv>=3) return '夜夜惊醒的将军';
  if(wf>=50&&slay>=30) return '屠夫';
  if(wf>=50&&mercy>=40) return '救世者';
  if(wf>=30&&lv===0) return '百战之人';
  return '';
};
window.v653_karmaTick=function(d){
  try{
    v65_ensureDefaults();
    var mc=S.militaryCareer;
    if(!mc||!mc.postWar) return;
    var p=mc.postWar;
    var age=d-(p.day||d);
    if(age<=0) return;
    if(p.states.indexOf('orphan')>=0&&age>=42&&!p.karmaOrphan){ // 6 周后孤儿复仇
      p.karmaOrphan=true;
      if(!S.missedEvents) S.missedEvents=[];
      S.missedEvents.push({key:'v653_karma_orphan',desc:'当年你破城时留下的孤儿，如今长大了。有人在集市上见过他，腰间别着一把短刀。'});
    }
    if(p.states.indexOf('refugee')>=0&&age>=21&&!p.karmaRefugee){ // 3 周后难民情报
      p.karmaRefugee=true;
      if(!S.mercenary.deals) S.mercenary.deals=[];
      S.mercenary.deals.push({id:'arms',cn:'军械',dir:'up',gap:40,day:d,base:22,price:20,target:28});
    }
    if(p.states.indexOf('ruin')>=0&&age>=35&&!p.karmaBlack){ // 5 周后黑市
      p.karmaBlack=true;
      if(!S.mercenary.deals) S.mercenary.deals=[];
      S.mercenary.deals.push({id:'abyssm',cn:'深渊材料',dir:'up',gap:50,day:d,base:40,price:36,target:54});
      if(!S.missedEvents) S.missedEvents=[];
      S.missedEvents.push({key:'v653_karma_black',desc:'有个黑市商人托人带话：听说你手上有路数，想跟你谈笔买卖。'});
    }
  }catch(e){}
};
window.v653_tick=function(d){
  try{
    v65_ensureDefaults();
    if(window.v653_contractTick){ try{ v653_contractTick(d); }catch(e){} }
    if(window.v653_marketCheck){ try{ v653_marketCheck(); }catch(e){} }
    if(window.v653_postWarTick){ try{ v653_postWarTick(d); }catch(e){} }
    if(window.v653_scarTick){ try{ v653_scarTick(d); }catch(e){} }
    if(window.v653_karmaTick){ try{ v653_karmaTick(d); }catch(e){} }
    if(window.v654_tickWars){ try{ v654_tickWars(d); }catch(e){} }
    if(window.v655_debtTick){ try{ v655_debtTick(d); }catch(e){} } /* /v655inj:tick/ */
  }catch(e){}
};

// v654:engine 战略层引擎（v65.4）
// w64 为引擎 IIFE 内部对象（未导出 window），此处本地兜底：势力表与财富账本（v66 深度联调时并入势力对象）
var W654_FIDS=['church','north','west','east','south','free','abyss','academy'];
var W654_WEALTH={church:80,north:45,west:65,east:75,south:70,free:90,abyss:30,academy:60};
window.W654_WEALTH=W654_WEALTH;
var w654_relKey=function(a,b){ return (a<b)?(a+'-'+b):(b+'-'+a); };
var w654_fname=function(id){ if(window.w64_fname){ try{ return w64_fname(id); }catch(e){} } return id; };
var w654_fid=function(id){ return {id:id,cn:w654_fname(id)}; };
var W654_FRONTSEEDS=[
  {id:'front1',cn:'边境隘口',kind:'隘口'},
  {id:'front2',cn:'粮道',kind:'粮道'},
  {id:'front3',cn:'前哨堡',kind:'堡'},
  {id:'front4',cn:'河渡',kind:'渡口'},
  {id:'front5',cn:'粮仓城',kind:'城'},
  {id:'front6',cn:'高地',kind:'高地'},
  {id:'front7',cn:'峡谷',kind:'峡谷'},
  {id:'front8',cn:'驿站',kind:'驿'}
];
// 目标表（宣战起因 → 战争目标，参考 EU4 战争分数/CK3 casus belli）
var W654_GOALS=[
  {id:'conquer',cn:'征服前哨',desc:'拔掉对方的前线据点，战线向前推。'},
  {id:'burn',cn:'焚毁粮仓',desc:'烧掉对方的粮仓，让他吃树皮。'},
  {id:'capital',cn:'攻陷都城',desc:'兵临城下，旗插上对方王都的城头。'},
  {id:'slay',cn:'斩将夺旗',desc:'阵斩一员名将，夺其军旗。'},
  {id:'starve',cn:'粮尽崩溃',desc:'断其粮道，等他自己垮。'},
  {id:'attrition',cn:'消耗战',desc:'耗到他国力枯竭，主动求和。'}
];
// 条约条款生成表（参考 CK3 三态 + EU4 条款 + 历史条约）
var W654_TERMS=[
  {id:'repar',cn:'赔款',desc:'败方分期赔付军费，数额视战争规模而定。'},
  {id:'cede',cn:'割地',desc:'胜方吞下败方前线的控制区。'},
  {id:'marry',cn:'联姻',desc:'两家结亲，把仇恨摁进婚约里。'},
  {id:'demil',cn:'裁军',desc:'败方裁撤前线驻军，数年不得再犯。'},
  {id:'hostage',cn:'质子',desc:'败方送子弟入胜方为人质。'}
];
window.v654_frontsInit=function(war){
  try{
    if(!war||war.fronts) return war||null;
    var n=1+Math.floor(Math.random()*2); // 1-3 条战线
    var fs=[];
    for(var i=0;i<n;i++){
      var sd=W654_FRONTSEEDS[Math.floor(Math.random()*W654_FRONTSEEDS.length)];
      fs.push({id:sd.id+(war.id)+i,cn:sd.cn,kind:sd.kind,control:50,supply:100,history:[]});
    }
    war.fronts=fs;
    return war;
  }catch(e){ return war||null; }
};
window.v654_warscore=function(war){
  // 0-100：wins 差 + 战线控制 + 目标达成（只读，不改结算）
  try{
    if(!war) return 50;
    var s=50;
    s+=((war.winsA||0)-(war.winsB||0))*6;
    var fs=war.fronts||[];
    var sum=0; for(var i=0;i<fs.length;i++){ sum+=(fs[i].control||50)-50; }
    if(fs.length) s+=Math.round(sum/fs.length*0.5);
    if(war.supplyB<=0) s+=10; if(war.supplyA<=0) s-=10;
    if(s<0) s=0; if(s>100) s=100;
    return Math.round(s);
  }catch(e){ return 50; }
};
window.v654_goalPick=function(war){
  // 依起因挑目标（无匹配则随机）
  try{
    var cause=war.cause||'世仇';
    var map={世仇:'slay',资源:'conquer',信仰:'capital',联姻破裂:'attrition',玩家煽动:'conquer'};
    var gid=map[cause]||'conquer';
    for(var i=0;i<W654_GOALS.length;i++){ if(W654_GOALS[i].id===gid) return W654_GOALS[i]; }
    return W654_GOALS[0];
  }catch(e){ return W654_GOALS[0]; }
};
window.v654_goalCheck=function(war){
  // 目标达成 → 广播 + 标记（终局仍由既有 wins 差触发，本层只记录战果）
  try{
    if(!war||war.goalDone) return null;
    var fs=war.fronts||[];
    var goal=war.goal||W654_GOALS[0];
    var done=false, why='';
    if(goal.id==='conquer'){ var cc=0; for(var i=0;i<fs.length;i++){ if((fs[i].control||50)>=80) cc++; } if(cc>=1){ done=true; why='前线据点已被拿下。'; } }
    else if(goal.id==='burn'){ if(war.supplyB<=0){ done=true; why='对方的粮仓化成了灰。'; } }
    else if(goal.id==='capital'){ if((war.winsA||0)-(war.winsB||0)>=4){ done=true; why='大军压到了王都城下。'; } }
    else if(goal.id==='slay'){ if(war.slayDone){ done=true; why='敌将的首级挂在阵前。'; } }
    else if(goal.id==='starve'){ if(war.supplyB<=20&&war.turns>=6){ done=true; why='对方营地里开始吃草根。'; } }
    else if(goal.id==='attrition'){ if(war.turns>=12&&(war.supplyA+war.supplyB)<100){ done=true; why='耗到双方都亮了底牌。'; } }
    if(done){ war.goalDone=true; war.goalText=why;
      if(window.w64_broadcast){ try{ w64_broadcast('战争目标达成', (window.w64_fname?w64_fname(war.a):war.a)+'的战争目标「'+goal.cn+'」达成：'+why, S.day||0); }catch(e){} }
      return goal;
    }
    return null;
  }catch(e){ return null; }
};
window.v654_alliesCheck=function(war,d){
  // 援军：关系≥60 或有共同敌的势力（参考 CK3 盟友贡献）
  try{
    if(!war) return null;
    var ws=S.worldState; if(!ws) return null;
    if(!war.alliesA) war.alliesA=[];
    if(!war.alliesB) war.alliesB=[];
    var ids=W654_FIDS;
    for(var j=0;j<ids.length;j++){
      var f=ids[j];
      if(f===war.a||f===war.b) continue;
      if(war.alliesA.indexOf(f)>=0||war.alliesB.indexOf(f)>=0) continue;
      var ra=window.w64_rel?w64_rel(f,war.a):0, rb=window.w64_rel?w64_rel(f,war.b):0;
      if(ra>=60&&ra>rb+30){ war.alliesA.push(f); return {side:'A',f:f,who:war.a}; }
      if(rb>=60&&rb>ra+30){ war.alliesB.push(f); return {side:'B',f:f,who:war.b}; }
    }
    return null;
  }catch(e){ return null; }
};
window.v654_treatyGen=function(war,d){
  // 战后条约追加（只读 result 后生成，不改 w64_warResult 本体）
  try{
    if(!war||!war.result||war.treaty) return war;
    var r=war.result;
    var terms=[];
    if(r.type==='annihilate'){ terms=['cede','repar','hostage']; }
    else if(r.type==='triumph'){ terms=['cede','repar']; }
    else if(r.type==='win'){ terms=['repar']; }
    else { terms=['white']; }
    var tlist=[];
    for(var i=0;i<terms.length;i++){
      for(var k=0;k<W654_TERMS.length;k++){ if(W654_TERMS[k].id===terms[i]) tlist.push(W654_TERMS[k]); }
    }
    var reparAmt=(r.type==='annihilate'?80:(r.type==='triumph'?50:(r.type==='win'?30:0)));
    war.treaty={mode:(terms[0]==='white'?'白和':'条款'),terms:tlist.map(function(t){return t.cn;}),repar:reparAmt,cease:(r.type==='annihilate'?120:(r.type==='triumph'?90:60)),signedDay:d};
    if(reparAmt>0) war.reparations=[];
    return war;
  }catch(e){ return war; }
};
window.v654_reparTick=function(war,d){
  // 赔款分期支付流：每周 1 笔（共 4 笔），败方 wealth 扣 → 胜方 wealth 加
  try{
    if(!war||!war.treaty||!war.reparations) return null;
    if(war.treaty.repar<=0||war.reparDone) return null;
    var ws=S.worldState; if(!ws) return null;
    var loser=war.result.loser, winner=war.result.winner;
    var lf=loser?w654_fid(loser):null, wf=winner?w654_fid(winner):null;
    if(!lf||!wf){ war.reparDone=true; return null; }
    if(W654_WEALTH[loser]===undefined||W654_WEALTH[winner]===undefined){ war.reparDone=true; return null; }
    var per=Math.max(5,Math.ceil(war.treaty.repar/4));
    if(war.reparCount===undefined) war.reparCount=0;
    if(war.reparCount>=4){ war.reparDone=true; return null; }
    W654_WEALTH[loser]=Math.max(0,W654_WEALTH[loser]-per);
    W654_WEALTH[winner]=Math.min(100,W654_WEALTH[winner]+per);
    war.reparCount++;
    return {per:per,left:Math.max(0,war.treaty.repar-war.reparCount*per)};
  }catch(e){ return null; }
};
window.v654_tickWars=function(d){
  try{
    v65_ensureDefaults();
    var ws=S.worldState; if(!ws||!ws.wars) return;
    for(var i=0;i<ws.wars.length;i++){
      var war=ws.wars[i];
      if(war.phase>=4){
        // 战后：条约生成 + 赔款流
        if(!war.treaty){ v654_treatyGen(war,d); }
        if(war.reparations&&!war.reparDone){
          if(d%7===0){ var rp=v654_reparTick(war,d); if(rp&&window.w64_broadcast){ try{ w64_broadcast('赔款', w654_fname(war.result.loser)+'赔款 '+rp.per+' 到账，还剩 '+rp.left+'。', d); }catch(e){} } }
        }
        continue;
      }
      // 前线惰性补齐
      v654_frontsInit(war);
      if(!war.goal){ war.goal=v654_goalPick(war); }
      if(!war.warscoreT) war.warscoreT=0;
      // 每 3 天推进一次战线（模拟漂移，随 wins 差偏向）
      if(d-(war.lastFrontTick||0)>=3){
        war.lastFrontTick=d;
        var fs=war.fronts||[];
        var drift=(war.winsA-war.winsB)*1.5;
        for(var j=0;j<fs.length;j++){
          var f2=fs[j];
          var move=Math.floor(Math.random()*5)-2+drift/fs.length;
          f2.control=Math.max(0,Math.min(100,(f2.control||50)+move));
          // 补给线：控制<20 或 supply 归零 → 断粮
          if(f2.control<20){ f2.supply=Math.max(0,(f2.supply||100)-8); }
          else if(war.supplyA<=0&&f2.control>50){ f2.supply=Math.max(0,(f2.supply||100)-8); }
          f2.history.push({day:d,control:f2.control});
          if(f2.history.length>30) f2.history.shift();
        }
      }
      // 战争目标检测
      v654_goalCheck(war);
      // 援军检测（每 7 天）
      if(d%7===0){ v654_alliesCheck(war,d); }
    }
  }catch(e){}
};

// v655:engine 战线地图 + 谈判 UI + 赔款闭环（v65.5）
/* 参考：CK3 谈判（warscore 50-70% 触发、白和平、停战）、EU4 战争分数兑换条款、鲁尔危机（拖欠→出兵讨债） */
(function(){
  try{
    if (window.v655_engine) return;
    window.v655_engine = true;
    var V655_POS = { north:[110,60], west:[55,185], academy:[300,45], church:[240,150], east:[335,90], south:[175,250], free:[365,225], abyss:[425,145] };
    var V655_CN = { church:'圣辉教廷', north:'北境', west:'西境', east:'东境', south:'南境', free:'自由城邦', abyss:'深渊教会', academy:'学院联邦' };
    var V655_COLOR = { church:'#c9a240', north:'#8bc8ea', west:'#94d8c3', east:'#f4b393', south:'#eaa7b2', free:'#a2ddaa', abyss:'#9eacea', academy:'#8b8bea' };
    var V655_TERMS = { repar:'赔款', cede:'割地', marry:'联姻', demil:'裁军', hostage:'质子' };
    function v655_fname(id){
      if (window.w64_fname){ try{ var n=w64_fname(id); if(n&&n!==id) return n; }catch(e){} }
      return V655_CN[id]||id;
    }
    function v655_wealth(id){ return (window.W654_WEALTH&&W654_WEALTH[id]!==undefined)?W654_WEALTH[id]:50; }
    function v655_rel(war){
      try{ if(S.worldState&&S.worldState.relations){ var k=(war.a<war.b)?(war.a+'-'+war.b):(war.b+'-'+war.a); var rv=S.worldState.relations[k]; if(typeof rv==='number') return rv; } }catch(e){}
      return 0;
    }
    function v655_curWar(){
      try{ var ws=S.worldState; if(!ws||!ws.wars) return null; for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].phase<4) return ws.wars[i]; } }catch(e){}
      return null;
    }
    function v655_warscore(w){
      try{ if(window.v654_warscore) return v654_warscore(w); }catch(e){}
      return 50;
    }
    /* ---- 1. SVG 战线地图 ---- */
    window.v655_mapSvg=function(wars){
      try{
        var W=460,H=300;
        var svg='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;max-width:460px;background:rgba(255,255,255,0.45);border-radius:10px;display:block;">';
        var act=(wars||[]).filter(function(w){ return w.phase<4; });
        for(var i=0;i<act.length;i++){
          var w=act[i], pa=V655_POS[w.a], pb=V655_POS[w.b];
          if(!pa||!pb) continue;
          var fs=w.fronts||[], avg=50;
          if(fs.length){ var s=0; for(var j=0;j<fs.length;j++) s+=(fs[j].control||50); avg=s/fs.length; }
          var col=avg>=60?'#52C41A':(avg<=40?'#EA6668':'#FAAD14');
          var wdt=2+Math.min(3,Math.abs((w.winsA||0)-(w.winsB||0)));
          svg+='<line x1="'+pa[0]+'" y1="'+pa[1]+'" x2="'+pb[0]+'" y2="'+pb[1]+'" stroke="'+col+'" stroke-width="'+wdt+'" opacity="0.7"/>';
          var mx=(pa[0]+pb[0])/2, my=(pa[1]+pb[1])/2;
          svg+='<text x="'+mx+'" y="'+(my-4)+'" font-size="10" fill="'+col+'" text-anchor="middle">'+v655_warscore(w)+'</text>';
        }
        for(var k in V655_POS){
          var p=V655_POS[k], r=8+Math.round((v655_wealth(k)||50)/18);
          var c=V655_COLOR[k]||'#999';
          var ring='';
          if(S.militaryCareer&&S.militaryCareer.armyId===k) ring='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r+5)+'" fill="none" stroke="#FFD700" stroke-width="2"/>';
          if(S.w64Side){ try{ var cw=v655_curWar(); if(cw&&(cw.a===k||cw.b===k)) ring='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(r+5)+'" fill="none" stroke="#FF6B6B" stroke-width="2"/>'; }catch(e){} }
          svg+=ring;
          svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+r+'" fill="'+c+'" opacity="0.85" stroke="#333" stroke-width="1"/>';
          svg+='<text x="'+p[0]+'" y="'+(p[1]+r+12)+'" font-size="10" fill="#333" text-anchor="middle">'+v655_fname(k)+'</text>';
        }
        svg+='<g font-size="9" fill="#555">';
        svg+='<line x1="18" y1="272" x2="38" y2="272" stroke="#52C41A" stroke-width="3"/><text x="42" y="275">占优</text>';
        svg+='<line x1="86" y1="272" x2="106" y2="272" stroke="#FAAD14" stroke-width="3"/><text x="110" y="275">对峙</text>';
        svg+='<line x1="154" y1="272" x2="174" y2="272" stroke="#EA6668" stroke-width="3"/><text x="178" y="275">告急</text>';
        svg+='<circle cx="248" cy="272" r="4" fill="none" stroke="#FFD700" stroke-width="2"/><text x="256" y="275">你在军中</text>';
        svg+='<circle cx="320" cy="272" r="4" fill="none" stroke="#FF6B6B" stroke-width="2"/><text x="328" y="275">参战势力</text>';
        svg+='</g>';
        svg+='</svg>';
        return svg;
      }catch(e){ return ''; }
    };
    /* ---- 2. 战线地图面板（世界面板入口） ---- */
    window.v655_mapPanel=function(){
      try{
        if(typeof flashMsg!=='function') return;
        v65_ensureDefaults();
        var ws=S.worldState, wars=(ws&&ws.wars)?ws.wars:[];
        var act=wars.filter(function(w){ return w.phase<4; });
        var h='<div style="font-size:13px;line-height:1.7;">';
        h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">🗺 战线地图</div>';
        h+=window.v655_mapSvg(wars);
        if(act.length){
          h+='<div style="margin-top:8px;">';
          for(var i=0;i<act.length;i++){
            var w=act[i];
            if(!w.fronts) w.fronts=[];
            var fs=w.fronts||[];
            var fl=[];
            for(var j=0;j<fs.length;j++){ fl.push(fs[j].cn+' '+(fs[j].control>=60?'【占】':(fs[j].control<=40?'【危】':'【峙】'))); }
            h+='<div style="padding:6px 0;border-bottom:1px dashed rgba(0,0,0,0.15);">';
            h+='<b>'+v655_fname(w.a)+' vs '+v655_fname(w.b)+'</b> · 战况分 '+v655_warscore(w)+'<br/>';
            h+='<span style="font-size:11px;">战线：'+(fl.join(' / ')||'无')+'<br/>目标：'+(w.goal?w.goal.cn:'—')+(w.goalDone?'（已达成）':'')+'</span>';
            h+='</div>';
          }
          h+='</div>';
          h+="<button class='btn' onclick=\"writeNext('v655_negotiate_panel')\">亲自和谈</button> ";
          h+="<button class='btn' onclick=\"writeNext('v654_strategy_panel')\">战略总览</button>";
        } else {
          h+='<p style="margin-top:8px;">地图上没有战火。桌上的茶还热着。</p>';
        }
        h+="<br/><button class='btn' onclick='v65_warPanel()'>← 返回战争面板</button>";
        h+='</div>';
        flashMsg(h);
      }catch(e){}
    };
    /* ---- 3. 谈判选项（参考 EU4 战争分数兑换条款） ---- */
    window.v655_negotiateOptions=function(war){
      try{
        var sc=v655_warscore(war);
        var out=[];
        if(sc<25){ out.push({id:'white',t:'白和（各退一步，互不索赔）',terms:['white'],note:'战况不利，对方只肯和稀泥。'}); return out; }
        if(sc<50){ out.push({id:'rep1',t:'索取赔款',terms:['repar'],note:'军费要有人出。'}); out.push({id:'white',t:'白和（各退一步）',terms:['white'],note:'胶着之下，白和是体面的退场。'}); return out; }
        if(sc<70){ out.push({id:'rep1',t:'索要赔款',terms:['repar'],note:'军费要有人出。'}); out.push({id:'cede1',t:'割让前线',terms:['cede'],note:'地图上划一道线。'}); out.push({id:'white',t:'白和',terms:['white'],note:'见好就收。'}); return out; }
        if(sc<88){ out.push({id:'rep2',t:'赔款+割地',terms:['repar','cede'],note:'要钱，也要地。'}); out.push({id:'repmarry',t:'赔款+联姻',terms:['repar','marry'],note:'钱和盟约一起要。'}); out.push({id:'cedehostage',t:'割地+质子',terms:['cede','hostage'],note:'地归你，人押着。'}); out.push({id:'white',t:'白和',terms:['white'],note:'见好就收。'}); return out; }
        out.push({id:'full',t:'全条款（赔款+割地+质子+裁军）',terms:['repar','cede','hostage','demil'],note:'打到这个份上，对方只有点头。'});
        out.push({id:'repmarry2',t:'赔款+联姻',terms:['repar','marry'],note:'留一条长线。'});
        out.push({id:'white',t:'白和',terms:['white'],note:'见好就收。'});
        return out;
      }catch(e){ return [{id:'white',t:'白和',terms:['white'],note:''}]; }
    };
    /* ---- 4. 谈判判定（参考 CK3：50-70% 战况分可谈） ---- */
    window.v655_negotiateRoll=function(war, terms){
      try{
        var sc=v655_warscore(war);
        var base=60-sc*0.4;
        var rel=v655_rel(war)/5;
        var pl=0;
        if(typeof S.warFame==='number') pl+=S.warFame/100*6;
        if(S.attrs&&typeof S.attrs.CHA==='number') pl+=(S.attrs.CHA-40)/8;
        if(S.worldFame){ pl+=(S.worldFame.mercy||0)/50*1.5; pl+=(S.worldFame.legend||0)/50*1.5; }
        var hard=(terms||[]).length*9;
        var target=Math.max(5,Math.min(95,base-rel-pl+hard));
        var roll=1+Math.floor(Math.random()*100);
        return { pass:roll>=target, roll:roll, target:Math.round(target), sc:Math.round(sc),
          reason:'战况'+Math.round(sc)+'｜关系'+(rel>=0?'+':'')+Math.round(rel)+'｜声望'+(pl>=0?'+':'')+Math.round(pl)+'｜条款'+(terms||[]).length };
      }catch(e){ return {pass:false,roll:0,target:50,sc:50,reason:''}; }
    };
    /* ---- 5. 条约落地 ---- */
    window.v655_applyTreaty=function(war, terms, mode, d){
      try{
        var day=(d!==undefined)?d:((S.time&&S.time.totalDays)||S.day||0);
        var isWhite=(terms||[]).indexOf('white')>=0;
        var reparAmt=0;
        for(var i=0;i<(terms||[]).length;i++){ if(terms[i]==='repar') reparAmt+=(war.result&&war.result.type==='annihilate')?60:40; }
        var tlist=[];
        for(var j=0;j<(terms||[]).length;j++){ if(V655_TERMS[terms[j]]) tlist.push(V655_TERMS[terms[j]]); }
        war.treaty={ mode:isWhite?'白和':(mode||'和约'), terms:tlist, repar:reparAmt, cease:90+(reparAmt?30:0), signedDay:day };
        if(reparAmt>0) war.reparations=[];
        if(S.worldState){
          if(!S.worldState.ceasefire) S.worldState.ceasefire={};
          var k=(war.a<war.b)?(war.a+'-'+war.b):(war.b+'-'+war.a);
          S.worldState.ceasefire[k]=day+war.treaty.cease;
          if(S.worldState.relations&&S.worldState.relations[k]!==undefined){
            S.worldState.relations[k]=Math.max(-100,Math.min(100,S.worldState.relations[k]+(isWhite?0:(tlist.length*6))));
          }
        }
        if(window.w64_broadcast){ try{
          w64_broadcast('和约', v655_fname(war.a)+'与'+v655_fname(war.b)+'签订和约：'+(isWhite?'白和。':(tlist.join('、')||'休兵。')), day);
        }catch(e){} }
        return war;
      }catch(e){ return war; }
    };
    /* ---- 6. 谈判面板（HTML UI） ---- */
    window.v655_negotiatePanel=function(){
      try{
        if(typeof flashMsg!=='function') return;
        v65_ensureDefaults();
        var w=v655_curWar();
        var h='<div style="font-size:13px;line-height:1.7;">';
        h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">🤝 和谈·帅帐</div>';
        if(!w){ h+='<p>桌案上空空荡荡。没有战争，也就没有和谈。</p>'; }
        else{
          var sc=v655_warscore(w);
          var myArmy=S.militaryCareer?S.militaryCareer.armyId:null;
          var me=(myArmy&&(myArmy===w.a||myArmy===w.b))?myArmy:(S.w64Side===w.id?w.a:null);
          h+='<p>'+v655_fname(w.a)+' vs '+v655_fname(w.b)+' · 战况分 '+sc+'（100 为压胜）</p>';
          h+='<p style="font-size:11px;">'+v655_fname(w.a)+' 士气'+(w.moraleA||0)+'/粮'+(w.supplyA||0)+' · '+v655_fname(w.b)+' 士气'+(w.moraleB||0)+'/粮'+(w.supplyB||0)+'</p>';
          h+='<p>'+(me?('你是当事人。对方使者坐在对面，面前摊着一卷空白和约。'):('你是说客。两边的使者都在看你——看你站哪边。'))+'</p>';
          var opts=window.v655_negotiateOptions(w);
          h+='<div style="margin:6px 0;">';
          for(var i=0;i<opts.length;i++){
            (function(o){
              h+="<button class='btn' style='display:block;width:100%;text-align:left;margin:4px 0;' onclick=\"var _w=v655_curWar(); if(_w){ _w.negotiatePick={id:'"+o.id+"',terms:["+(o.terms.map(function(t){return "'"+t+"'";}).join(','))+"]}; writeNext('v655_negotiate_roll'); }\">"+o.t+"<br/><span style='font-size:11px;color:#888;'>"+o.note+"</span></button>";
            })(opts[i]);
          }
          h+='</div>';
        }
        h+="<button class='btn' onclick='v655_mapPanel()'>← 返回战线地图</button>";
        h+='</div>';
        flashMsg(h);
      }catch(e){}
    };
    /* ---- 7. 赔款拖欠 → 讨债战争（参考鲁尔危机） ---- */
    window.v655_debtLevel=function(war){
      try{ return war?((war.debtDefault||0)>=2?'赖账':((war.debtDefault||0)>=1?'拖延':'正常')):''; }catch(e){ return ''; }
    };
    window.v655_debtTick=function(d){
      try{
        v65_ensureDefaults();
        var ws=S.worldState; if(!ws||!ws.wars) return;
        for(var i=0;i<ws.wars.length;i++){
          var war=ws.wars[i];
          if(!(war.phase>=4&&war.treaty&&war.treaty.repar>0&&!war.reparDone)) continue;
          if(war.treaty.signedDay===undefined) continue;
          if(d-war.treaty.signedDay<7) continue;
          if(d%7!==0) continue;
          var loser=war.result?war.result.loser:war.b, winner=war.result?war.result.winner:war.a;
          var per=Math.max(5,Math.ceil(war.treaty.repar/4));
          var canPay=v655_wealth(loser)>=per;
          var cheat=!canPay||Math.random()<0.03;
          if(cheat){
            war.debtDefault=(war.debtDefault||0)+1;
            if(window.w64_broadcast){ try{
              w64_broadcast('赔款拖欠', v655_fname(loser)+'拖欠了赔款。'+(canPay?'账房说「再宽限几日」。':'账房翻遍了箱子，一文也拿不出来。'), d);
            }catch(e){} }
            if(S.worldState&&S.worldState.relations){
              var k=(loser<winner)?(loser+'-'+winner):(winner+'-'+loser);
              if(S.worldState.relations[k]!==undefined){ S.worldState.relations[k]=Math.max(-100,S.worldState.relations[k]-10); }
            }
            var cease=war.treaty.cease||90;
            if((war.debtDefault||0)>=2 && (d-war.treaty.signedDay)>cease){
              var exists=false;
              for(var j=0;j<ws.wars.length;j++){ var x=ws.wars[j]; if(x.phase<4&&((x.a===winner&&x.b===loser)||(x.a===loser&&x.b===winner))){ exists=true; break; } }
              if(!exists&&window.w64_startWar){
                var nw=w64_startWar(winner,loser,'debt',d);
                if(nw){ nw.debtWar=true; nw.debtOld=war.id; }
              }
            }
          }
        }
      }catch(e){}
    };
    /* ---- 8. 调解判定 ---- */
    window.v655_mediatorRoll=function(war){
      try{
        var sc=v655_warscore(war);
        var base=45+Math.abs(sc-50)/2;
        var pl=0;
        if(S.worldFame){ pl+=(S.worldFame.mercy||0)/50*4; pl+=(S.worldFame.legend||0)/50*2; }
        if(S.attrs&&typeof S.attrs.CHA==='number') pl+=(S.attrs.CHA-40)/6;
        if(typeof S.warFame==='number') pl+=S.warFame/100*4;
        var target=Math.max(5,Math.min(95,base-pl));
        var roll=1+Math.floor(Math.random()*100);
        return { pass:roll>=target, roll:roll, target:Math.round(target) };
      }catch(e){ return {pass:false,roll:0,target:50}; }
    };
    window.v655_curWar=v655_curWar;
    window.v655_fname=v655_fname;
    window.v655_warscore=v655_warscore;
    window.v655_wealth=v655_wealth;
    window.V655_TERMS=V655_TERMS;
    window.V655_POS=V655_POS;
  }catch(e){ try{ console.error('v655 engine:', e); }catch(_){} }
})();

// 面板：战争总览
window.v65_warPanel=function(){
  try{
    if(typeof flashMsg!=='function') return;
    v65_ensureDefaults();
    var h='<div style="font-size:13px;line-height:1.7;">';
    h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">⚔ 战争与军务</div>';
    // 从军状态
    if(S.militaryCareer){
      var mc=S.militaryCareer, A=null;
      for(var i=0;i<W65_WAR.D.armies.length;i++){ if(W65_WAR.D.armies[i].id===mc.armyId) A=W65_WAR.D.armies[i]; }
      var r=v65_rank();
      h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
      h+='【从军】'+(A?A.cn:'')+' · '+r.cn+'<br/>';
      h+='训练'+mc.training+' 士气'+mc.morale+' 粮草'+mc.supply+' 军功'+(S.warFame||0)+'<br/>';
      h+="<button class='btn' onclick=\"writeNext('v65_camp')\">军旅日程</button> ";
      h+="<button class='btn' onclick=\"writeNext('v65_career')\">军旅见闻</button> " +
      "<button class='btn' onclick=\"writeNext('v65_unit_panel')\">部队管理</button> " +
      "<button class='btn' onclick=\"writeNext('v652_general_panel_node')\">随军强者</button> " +
      "<button class='btn' onclick=\"writeNext('v652_legend_rank')\">军史榜</button>";
      h+='</div>';
    } else {
      h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
      h+='【从军】你还没投效任何军队。<br/>';
      h+="<button class='btn' onclick=\"writeNext('v65_join')\">投军</button> ";
      h+="<button class='btn' onclick='v65_mercPanel()'>佣兵公会</button>";
      h+='</div>';
    }
    // 军校
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='【军校】'+(S.v65Heard&&S.v65Heard.academy?'已入学':'未入学')+'<br/>';
    h+="<button class='btn' onclick=\"writeNext('v65_acad')\">军事学院</button>";
    h+='</div>';
    // 恩怨
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='【恩怨簿】'+(Object.keys(S.warGrudges).length)+' 笔<br/>';
    h+="<button class='btn' onclick='v65_grudgePanel()'>恩怨簿</button>";
    h+='</div>';
    // 战略层（v65.4）
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='【战略层】多战线 / 战争目标 / 援军 / 和谈 / 赔款<br/>';
    h+="<button class='btn' onclick=\"writeNext('v654_strategy_panel')\">战略地图</button> <button class='btn' onclick='v655_mapPanel()'>战线地图</button> <button class='btn' onclick='v655_negotiatePanel()'>亲自和谈</button> /* /v655inj:btns/ */";
    h+='</div>';
    // 战史长廊（v65.1）
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='【战史长廊】<br/>';
    var wf651=S.warFame||0;
    h+=(wf651>=30)?("<button class='btn' onclick=\"writeNext('v65_legend_hall')\">雪原之役</button> "):'<span style="color:#999;">雪原·需军功30</span> ';
    h+=(wf651>=40)?("<button class='btn' onclick=\"writeNext('v65_legend_hall')\">圣辉城攻防</button> "):'<span style="color:#999;">圣辉城·需军功40</span> ';
    h+=(wf651>=50&&(S.corruption||0)>=20)?("<button class='btn' onclick=\"writeNext('v65_legend_hall')\">裂隙口血战</button>"):'<span style="color:#999;">裂隙口·需军功50/深渊20</span>';
    h+='<br/>';
    h+=(window.v65_playerGrudge&&v65_playerGrudge())?("<button class='btn' onclick=\"writeNext('v65_grudge_revenge')\">有恩怨要了</button>"):'<span style="color:#999;">恩怨簿里没你的名字</span>';
    h+='</div>';
    // 战后创伤
    h+='<div style="background:rgba(255,255,255,0.35);padding:8px;border-radius:8px;margin-bottom:8px;">';
    h+='【战后创伤】'+(Object.keys(S.warScars).length)+' 处<br/>';
    h+="<button class='btn' onclick=\"writeNext('v65_scar_view')\">伤城</button>";
    h+='</div>';
    h+="<button class='btn' onclick='w64_worldPanel()'>← 返回世界面板</button>";
    h+='</div>';
    flashMsg(h);
  }catch(e){}
};
// 恩怨簿面板
window.v65_grudgePanel=function(){
  try{
    if(typeof flashMsg!=='function') return;
    v65_ensureDefaults();
    var h='<div style="font-size:13px;line-height:1.7;">';
    h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">恩怨簿</div>';
    var keys=Object.keys(S.warGrudges);
    if(!keys.length){ h+='还没有恩怨。世界待你尚算客气。<br/>'; }
    for(var i=0;i<keys.length;i++){
      var k=keys[i], g=S.warGrudges[k], lv=v65_grudgeCn(k.split("|")[0],k.split("|")[1]);
      h+='<div style="padding:4px 0;border-bottom:1px dashed rgba(0,0,0,0.15);">';
      h+=k.split("|")[0]+' 对 '+k.split("|")[1]+'：'+lv+'（'+g.weight+'）<br/>';
      h+='<span style="color:var(--text-muted);font-size:11px;">'+(g.note||'')+'</span></div>';
    }
    h+="<button class='btn' onclick='v65_warPanel()'>← 返回</button>";
    h+='</div>';
    flashMsg(h);
  }catch(e){}
};
// 佣兵面板
window.v65_mercPanel=function(){
  try{
    if(typeof flashMsg!=='function') return;
    v65_ensureDefaults();
    var h='<div style="font-size:13px;line-height:1.7;">';
    h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">佣兵公会</div>';
    h+='声望'+S.mercenary.rank+' 完成'+(S.mercenary.done||0)+'单 军功'+(S.warFame||0)+'<br/><br/>';
    for(var i=0;i<W65_WAR.D.jobs.length;i++){
      var J=W65_WAR.D.jobs[i], taken=S.mercenary.jobs.indexOf(J.id)>=0;
      h+='<div style="padding:4px 0;border-bottom:1px dashed rgba(0,0,0,0.15);">';
      h+='【'+J.cn+'】'+J.desc+'<br/>';
      h+='报酬'+J.pay+'金 军功+'+J.fame+(taken?'（已接）':'');
      if(!taken){ h+=" <button class='btn' onclick=\"writeNext('v65_merc_"+J.id+"')\">接单</button>"; }
      h+='</div>';
    }
    // 悬赏榜（v65.3）
    h+='<div style="margin-top:6px;padding-top:6px;border-top:1px solid rgba(0,0,0,0.2);">';
    h+='【悬赏榜】名望'+S.mercenary.rank+'（'+(window.v653_fameLevel?v653_fameLevel().cn:'野路子')+'） 报酬倍率×'+((1+S.mercenary.rank/200).toFixed(1))+'<br/>';
    h+="<button class='btn' onclick=\"writeNext('v653_bounty_list')\">查看悬赏</button>";
    if(S.mercenary.contracts&&S.mercenary.contracts.length) h+=" <button class='btn' onclick=\"writeNext('v653_bounty_finish')\">交单结算（"+S.mercenary.contracts.length+"）</button>";
    if(S.mercenary.deals&&S.mercenary.deals.length) h+=" <button class='btn' onclick=\"writeNext('v653_deal_panel')\">倒卖机会（"+S.mercenary.deals.length+"）</button>";
    h+='</div>';
    h+='<br/>【军功兑换】';
    h+=" <button class='btn' onclick='v65_exchange(\"armor\")'>精甲60</button>";
    h+=" <button class='btn' onclick='v65_exchange(\"scroll\")'>卷轴80</button>";
    h+=" <button class='btn' onclick='v65_exchange(\"title\")'>头衔120</button>";
    h+=" <button class='btn' onclick='v65_exchange(\"intel\")'>情报50</button>";
    h+="<br/><br/><button class='btn' onclick='v65_warPanel()'>← 返回</button>";
    h+='</div>';
    flashMsg(h);
  }catch(e){}
};
// 军校面板
window.v65_acadPanel=function(){
  try{
    if(typeof flashMsg!=='function') return;
    v65_ensureDefaults();
    var h='<div style="font-size:13px;line-height:1.7;">';
    h+='<div style="font-weight:bold;font-size:15px;margin-bottom:8px;">军事学院</div>';
    if(S.v65Heard&&S.v65Heard.academy){
      h+='已学兵法：';
      for(var i=0;i<W65_WAR.D.courses.length;i++){
        var C=W65_WAR.D.courses[i];
        h+='<div style="padding:4px 0;border-bottom:1px dashed rgba(0,0,0,0.15);">';
        h+='【'+C.cn+'】'+(S.v65Heard[C.gain]?'✓ 已学':'')+'<br/>';
        if(!(S.v65Heard[C.gain])){ h+="<button class='btn' onclick=\"writeNext('v65_acad_"+C.id+"')\">研习</button>"; }
        h+='</div>';
      }
    } else {
      h+='你还没入学。<br/>';
      h+="<button class='btn' onclick=\"writeNext('v65_acad_apply')\">报名入学</button>";
    }
    h+="<br/><button class='btn' onclick='v65_warPanel()'>← 返回</button>";
    h+='</div>';
    flashMsg(h);
  }catch(e){}
};
window.v65_warPanel=window.v65_warPanel;
window.v65_grudgePanel=window.v65_grudgePanel;
window.v65_mercPanel=window.v65_mercPanel;
window.v65_acadPanel=window.v65_acadPanel;

/* ---- 势力表（对齐 v47/ORG_V52 世界观，不新造冲突） ---- */
w64.factions=[
  {id:'church',cn:'圣辉教廷',color:'#c9a240',military:70,wealth:80,doctrine:'圣光普照，秩序至高',leader:'牧师大宗师',seat:'圣辉城'},
  {id:'north',cn:'北境',color:'#8bc8ea',military:85,wealth:45,doctrine:'铁与雪，强者为尊',leader:'秦·长风',seat:'北境城'},
  {id:'west',cn:'西境',color:'#94d8c3',military:55,wealth:65,doctrine:'森林自有其律',leader:'贺·断弓',seat:'西境林堡'},
  {id:'east',cn:'东境',color:'#f4b393',military:60,wealth:75,doctrine:'商贸与知识开路',leader:'文森·金秤',seat:'东境港'},
  {id:'south',cn:'南境',color:'#eaa7b2',military:65,wealth:70,doctrine:'血脉与契约',leader:'伊莎·圣辉',seat:'南境城'},
  {id:'free',cn:'自由城邦',color:'#a2ddaa',military:40,wealth:90,doctrine:'金钱不认出身',leader:'格朗·符文',seat:'自由港'},
  {id:'abyss',cn:'深渊教会',color:'#9eacea',military:75,wealth:30,doctrine:'深渊即真理',leader:'薇·灰雾',seat:'裂隙带',hidden:true},
  {id:'academy',cn:'学院联邦',color:'#8b8bea',military:50,wealth:60,doctrine:'知识不应设限',leader:'洛·晨雾',seat:'学院城'}
];
w64.fid=function(id){ for(var i=0;i<w64.factions.length;i++){ if(w64.factions[i].id===id) return w64.factions[i]; } return null; };
w64.fname=function(id){ var f=w64.fid(id); return f?f.cn:id; };

/* ---- 关系基线（对照 STRONG_V53/RIVALS_V52 提炼） ---- */
w64.baseRel={
  'church-north':-20,'church-west':10,'church-east':5,'church-south':30,'church-free':-10,'church-abyss':-90,'church-academy':-15,
  'north-west':-10,'north-east':-30,'north-south':-40,'north-free':-20,'north-abyss':-60,'north-academy':-10,
  'west-east':20,'west-south':10,'west-free':15,'west-abyss':-50,'west-academy':30,
  'east-south':20,'east-free':40,'east-abyss':-40,'east-academy':45,
  'south-free':10,'south-abyss':-55,'south-academy':15,
  'free-abyss':-25,'free-academy':25,
  'abyss-academy':-70
};

/* ---- 商品（参照 EU5：额定价→目标价 10%-500%，按波动率移动） ---- */
w64.marketDef=[
  {id:'grain',cn:'粮食',base:10,vol:0.08},
  {id:'ore',cn:'矿产',base:14,vol:0.06},
  {id:'herb',cn:'药材',base:16,vol:0.07},
  {id:'wood',cn:'木材',base:8,vol:0.05},
  {id:'arms',cn:'军械',base:22,vol:0.10},
  {id:'lux',cn:'奢侈品',base:30,vol:0.09},
  {id:'abyssm',cn:'深渊材料',base:40,vol:0.12}
];

/* ---- 天灾表（参照 Occurrences：概率触发+递增结束+记忆期） ---- */
w64.disasters=[
  {id:'beast',cn:'兽潮',region:'北境',baseP:1.5,daysMin:14,daysMax:42,mem:70},
  {id:'plague',cn:'瘟疫',region:'南境',baseP:1.0,daysMin:14,daysMax:42,mem:70},
  {id:'rift',cn:'深渊裂隙',region:'裂隙带',baseP:1.0,daysMin:14,daysMax:35,mem:80},
  {id:'storm',cn:'元素风暴',region:'西境',baseP:0.5,daysMin:7,daysMax:28,mem:60},
  {id:'drought',cn:'旱涝',region:'东境',baseP:0.8,daysMin:21,daysMax:49,mem:70}
];

/* ---- 局势种子 ---- */
w64.situSeeds=[
  {kind:'border',cn:'边境摩擦',factions:['north','south'],text:'北境的巡逻队越过了界碑，南境人围住了他们。',resolve:'和谈，或开战。'},
  {kind:'famine',cn:'粮荒',factions:['east','free'],text:'东境粮仓失火，粮价开始往上走。',resolve:'赈济，或囤积。'},
  {kind:'marriage',cn:'通婚提议',factions:['south','west'],text:'南境公爵想与西境联姻，两边贵族吵成一团。',resolve:'促成，或搅黄。'},
  {kind:'doctrine',cn:'教义之争',factions:['church','academy'],text:'教廷学者与学院法师争论：魔力究竟是不是神的恩赐。',resolve:'调停，或点火。'},
  {kind:'treasure',cn:'宝藏传闻',factions:['free','west'],text:'有人说西境旧林里有上古遗迹，自由港的探险队已经出发。',resolve:'争夺，或旁观。'},
  {kind:'omen',cn:'深渊预兆',factions:['church','abyss'],text:'南边裂隙传出低语，教廷说这是大灾前兆。',resolve:'调查，或封口。'}
];

/* ================= 周结算主入口 ================= */
window.w64_tickWorld=function(){
  try{
    if(typeof S==='undefined'||!S) return;
    w64_ensureDefaults();
    var d=(S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:(S.day||0);
    var ws=S.worldState;
    if(ws.lastTick && d-ws.lastTick<7) return; /* 每 7 天一次 */
    ws.lastTick=d;
    w64_tickRelations(d);
    w64_tickSituations(d);
    w64_tickWars(d);
    w64_tickDisasters(d);
    w64_tickMarket(d);
    w64_tickPolitics(d);
    w64_tickKarma(d);
    w64_tickGoals(d);
  }catch(e){}
};

/* ---- 广播（编年史 + 传闻） ---- */
window.w64_broadcast=function(title,text,d){
  try{
    var day=(d!==undefined)?d:((S.time&&S.time.totalDays)||S.day||0);
    var key='w64b_'+title+'_'+day;
    if(!S.w64Heard) S.w64Heard={};
    if(S.w64Heard[key]) return;
    S.w64Heard[key]=true;
    if(window.chronicleRecord){ try{ chronicleRecord('w64_'+title, title+'：'+text); }catch(e){} }
    if(!S.missedEvents) S.missedEvents=[];
    S.missedEvents.push({key:key, desc:title+'：'+text});
  }catch(e){}
};

/* ================= A 势力关系 ================= */
function w64_relKey(a,b){ return (a<b)?(a+'-'+b):(b+'-'+a); }
function w64_rel(a,b){
  try{
    w64_ensureDefaults();
    var ws=S.worldState, key=w64_relKey(a,b);
    if(ws.relations[key]!==undefined) return ws.relations[key];
    var base=w64.baseRel[key];
    if(base===undefined) base=0;
    ws.relations[key]=base;
    return base;
  }catch(e){ return 0; }
}
window.w64_rel=w64_rel;
window.w64_relLevel=function(v){
  if(v<=-60) return '敌对'; if(v<-20) return '紧张'; if(v<20) return '中立'; if(v<60) return '友好'; return '同盟';
};
window.w64_tickRelations=function(d){
  try{
    var ws=S.worldState;
    var ids=[]; for(var i=0;i<w64.factions.length;i++) ids.push(w64.factions[i].id);
    for(var x=0;x<ids.length;x++){
      for(var y=x+1;y<ids.length;y++){
        var a=ids[x],b=ids[y],key=w64_relKey(a,b);
        var cur=(ws.relations[key]!==undefined)?ws.relations[key]:(w64.baseRel[key]||0);
        var base=w64.baseRel[key]; if(base===undefined) base=0;
        cur+=(base-cur)*0.05;                    /* 向基线回归 */
        cur+=Math.floor(Math.random()*5)-2;      /* 随机漂移 ±2 */
        for(var w=0;w<ws.wars.length;w++){       /* 战争持续施压 */
          var war=ws.wars[w];
          if(war.phase>=4) continue;
          if((war.a===a&&war.b===b)||(war.a===b&&war.b===a)) cur=Math.max(-100,cur-3);
        }
        if(cur>100) cur=100; if(cur<-100) cur=-100;
        ws.relations[key]=Math.round(cur);
      }
    }
  }catch(e){}
};

/* ================= 局势生成 ================= */
window.w64_tickSituations=function(d){
  try{
    var ws=S.worldState;
    ws.activeSituations=ws.activeSituations.filter(function(s){ return (s.deadline||0)>=d; });
    if(d-(ws.lastSituationGen||0)>=21 && Math.random()<0.75){
      ws.lastSituationGen=d;
      var seed=w64.situSeeds[Math.floor(Math.random()*w64.situSeeds.length)];
      var dup=false;
      for(var q=0;q<ws.activeSituations.length;q++){ if(ws.activeSituations[q].kind===seed.kind){ dup=true; break; } }
      if(!dup){
        var sid='sit'+d+'_'+Math.floor(Math.random()*1000);
        ws.activeSituations.push({id:sid,kind:seed.kind,cn:seed.cn,factions:seed.factions,text:seed.text,stage:0,deadline:d+21,resolve:seed.resolve});
        w64_broadcast('局势·'+seed.cn, seed.text, d);
        /* 边境摩擦发酵到阶段2 自动开战 */
        if(seed.kind==='border' && w64_rel(seed.factions[0],seed.factions[1])<=-30){
          w64_startWar(seed.factions[0],seed.factions[1],'边境摩擦',d);
        }
      }
    }
  }catch(e){}
};
window.w64_sitResolve=function(id, choice){
  try{
    w64_ensureDefaults();
    var ws=S.worldState;
    for(var i=0;i<ws.activeSituations.length;i++){
      if(ws.activeSituations[i].id===id){
        var s=ws.activeSituations[i];
        ws.activeSituations.splice(i,1);
        w64_broadcast('局势了结·'+s.cn, choice, (S.day||0));
        return s;
      }
    }
  }catch(e){ return null; }
};

/* ================= B 战争系统 ================= */
window.w64_startWar=function(a,b,cause,d){
  try{
    w64_ensureDefaults();
    var ws=S.worldState;
    var day=(d!==undefined)?d:((S.time&&S.time.totalDays)||S.day||0);
    for(var i=0;i<ws.wars.length;i++){ if(ws.wars[i].phase<4 && ((ws.wars[i].a===a&&ws.wars[i].b===b)||(ws.wars[i].a===b&&ws.wars[i].b===a))) return null; }
    if(ws.ceasefire){ var _ck=w64_relKey(a,b); if(ws.ceasefire[_ck] && day<ws.ceasefire[_ck]) return null; } // v64b:engine
    var war={id:'war'+day+'_'+Math.floor(Math.random()*1000),a:a,b:b,cause:cause||'世仇',phase:0,turns:0,startedDay:day,front:w64.fid(b).seat,
      moraleA:70,moraleB:70,supplyA:100,supplyB:100,atkStr:w64.fid(a).military,defStr:w64.fid(b).military,
      winsA:0,winsB:0,history:[],endedDay:0};
    ws.wars.push(war);
    w64_broadcast('战争爆发', w64.fname(a)+'向'+w64.fname(b)+'宣战——起因是'+cause+'。前线指向'+war.front+'。', day);
    return war;
  }catch(e){ return null; }
};
window.w64_startWar=w64_startWar;

/* 胜负结算（参照三国志士气/疲劳 + NGA 分层裁决） */
window.w64_battle=function(war){
  try{
    w64_ensureDefaults();
    var player=0;
    var r=typeof S.realm==='number'?S.realm:0;
    if(S.w64Side && S.w64Side===war.id){
      if(r>=8) player=15; else if(r>=6) player=12; else if(r>=4) player=9; else if(r>=3) player=6; else if(r>=2) player=4; else player=2;
    }
    var atk=war.atkStr+player, def=war.defStr;
    /* 士气修正 */
    if(war.supplyA<50) atk-=Math.round(atk*0.3);
    if(war.supplyB<50) def-=Math.round(def*0.3);
    atk+=Math.round((war.moraleA-war.moraleB)/10);
    /* 主场在守方 */
    def+=10;
    var roll=Math.floor(Math.random()*100)+1;
    var diff=atk-def;
    var score=roll+Math.round(diff/2);
    var out;
    if(score>=85) out={r:'大捷',a:+3,b:-3,drop:true};
    else if(score>=70) out={r:'小胜',a:+1,b:-1,drop:false};
    else if(score>=45) out={r:'对峙',a:0,b:0,drop:false};
    else if(score>=25) out={r:'小负',a:-1,b:+1,drop:false};
    else out={r:'大败',a:-3,b:+3,drop:true};
    war.moraleA=Math.max(10,Math.min(100,war.moraleA+out.a));
    war.moraleB=Math.max(10,Math.min(100,war.moraleB+out.b));
    if(out.r==='大捷') war.winsA++;
    if(out.r==='大败') war.winsB++;
    war.history.push({turn:war.turns,roll:roll,score:score,result:out.r});
    return out;
  }catch(e){ return {r:'对峙',a:0,b:0,drop:false}; }
};
window.w64_battle=w64_battle;

var WAR_TURNS=[
  '战线向前推了三里，斥候带回来一串坏消息。',
  '城头的旗换了一面，又被换回去。',
  '营地里的火，一夜没熄。',
  '伤员从前面抬下来，担架不够用。',
  '粮车在半路被劫，押粮官跪在帅帐前请罪。'
];
window.w64_tickWars=function(d){
  try{
    var ws=S.worldState;
    for(var i=0;i<ws.wars.length;i++){
      var war=ws.wars[i];
      if(war.phase>=4) continue;
      war.turns++;
      if(war.phase===0){ /* 集结 */
        if(war.turns>=3) war.phase=1;
        w64_broadcast('战况·'+w64.fname(war.a)+'vs'+w64.fname(war.b), '双方正在集结兵力，'+war.front+'进入围城状态。', d);
        continue;
      }
      if(war.phase===1){ /* 拉锯 */
        var out=w64_battle(war);
        w64_broadcast('战役·'+w64.fname(war.a)+'vs'+w64.fname(war.b), WAR_TURNS[Math.floor(Math.random()*WAR_TURNS.length)]+'（'+out.r+'）', d);
        /* 断粮概率 */
        if(Math.random()<0.15){ if(Math.random()<0.5){ war.supplyA=Math.max(0,war.supplyA-40); } else { war.supplyB=Math.max(0,war.supplyB-40); } w64_broadcast('断粮', '一支粮队被烧了，有人开始吃树皮。', d); }
        if(Math.abs(war.winsA-war.winsB)>=3 || war.turns>=9){ war.phase=3; }
        else if(war.turns%4===0){ war.phase=2; }
        continue;
      }
      if(war.phase===2){ /* 转折 */
        w64_broadcast('转折·'+w64.fname(war.a)+'vs'+w64.fname(war.b), (war.winsA>war.winsB)?(w64.fname(war.a)+'打出了破口'):(w64.fname(war.b)+'撑住了战线'), d);
        war.phase=3;
        continue;
      }
      if(war.phase===3){ // 终局：五变体结算 v64b:engine
        w64_warResult(war,d);
        continue;
      }
    }
    ws.wars=ws.wars.filter(function(w){ return w.phase<4 || (d-w.endedDay)<14; });
  }catch(e){}
};

// v64b:engine 战争结局五变体（参照 CK3 战争结算分层 + 三国志厌战 + 赔款/割地/灭国）
window.w64_warResult=function(war,d){
  try{
    var ws=S.worldState;
    var wa=war.winsA, wb=war.winsB;
    var diff=wa-wb;
    var winner=null, loser=null, type='stale';
    if(diff>=3){ winner=war.a; loser=war.b; type='triumph'; }
    else if(diff<=-3){ winner=war.b; loser=war.a; type='triumph'; }
    else if(diff>=1){ winner=war.a; loser=war.b; type='win'; }
    else if(diff<=-1){ winner=war.b; loser=war.a; type='win'; }
    else { type='stale'; }
    var wf=winner?w64.fid(winner):null, lf=loser?w64.fid(loser):null;
    var fama=w64.fname(war.a), fmb=w64.fname(war.b);
    var text='';
    var winMorale=(winner===war.a)?war.moraleA:war.moraleB;
    var loseSupply=(loser===war.b)?war.supplyB:war.supplyA;
    if(winner && lf && (lf.military<=15 || loseSupply<=0)){
      // 灭战：败方军事孱弱或断粮崩盘
      type='annihilate';
      lf.military=Math.max(5,lf.military-20); wf.military=Math.min(100,wf.military+10);
      wf.wealth=Math.min(100,wf.wealth+12); lf.wealth=Math.max(0,lf.wealth-12);
      text=fama+'攻破'+fmb+'的王都。'+fmb+'的旗子被踩进泥里，史官记了一笔：灭国之战。';
    }
    else if(type==='triumph' && winner && winMorale<=30){
      // 惨胜：赢了但打残了
      type='slaughter';
      wf.military=Math.max(5,wf.military-6); lf.military=Math.max(5,lf.military-8);
      text=fama+'胜了，但胜得难看。庆功的酒还没热，阵亡名册先送到了帅帐。';
    }
    else if(type==='triumph'){
      wf.military=Math.min(100,wf.military+8); lf.military=Math.max(5,lf.military-12);
      wf.wealth=Math.min(100,wf.wealth+15); lf.wealth=Math.max(0,lf.wealth-15);
      text=fama+'大胜，'+fmb+'割地求和。和约上按着两枚血红的印。';
    }
    else if(type==='win'){
      wf.wealth=Math.min(100,wf.wealth+10); lf.wealth=Math.max(0,lf.wealth-10);
      text=fama+'小胜，'+fmb+'赔款休战。使节在马背上谈成了条件。';
    }
    else {
      w64.fid(war.a).military=Math.max(5,w64.fid(war.a).military-4);
      w64.fid(war.b).military=Math.max(5,w64.fid(war.b).military-4);
      text='两军对耗到粮尽，各自鸣金。死的人够多了，谁也没占到便宜。';
    }
    war.phase=4; war.endedDay=d;
    war.result={type:type,winner:winner,loser:loser,text:text};
    // 休战期：同对势力 60-120 天不开新战
    war.ceasefire=d+(type==='annihilate'?120:(type==='triumph'?90:(type==='win'?60:60)));
    if(!ws.ceasefire) ws.ceasefire={};
    ws.ceasefire[w64_relKey(war.a,war.b)]=war.ceasefire;
    w64_broadcast('战争结束·'+type, text, d);
    // 关系落地
    var rel=w64_relKey(war.a,war.b);
    var drop=type==='annihilate'?-80:(type==='triumph'?-60:(type==='win'?-40:-20));
    ws.relations[rel]=Math.max(-100,(ws.relations[rel]||0)+drop);
    if(window.worldDelta){ try{ worldDelta('diplomacy',-3); }catch(e){} }
    // 玩家战功（参战玩家按结局结算，不分阵营）
    if(S.w64Side===war.id){
      var r=typeof S.realm==='number'?S.realm:0;
      if(type==='annihilate'||type==='triumph'){
        S.gold=(S.gold||0)+30+Math.min(50,r*5);
        if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
        S.worldFame.legend=Math.min(100,(S.worldFame.legend||0)+5);
        w64_broadcast('你的战功','战后论功，你的名字写进了战报。',d);
      }
      else if(type==='win'){
        S.gold=(S.gold||0)+15;
        w64_broadcast('你的战功','你从战场上活着回来，带回了赏钱和伤。',d);
      }
      else {
        if(typeof S.san==='number') S.san=Math.max(0,S.san-5);
        w64_broadcast('战后余烬','你活着回来了，但夜里常被号角声惊醒。',d);
      }
      S.w64Aftermath={warId:war.id,type:type,winner:winner,loser:loser,text:text};
      S.w64Side=null;
    }
  }catch(e){}
};
window.w64_warResult=w64_warResult;
// v64b:engine 休战检查（startWar 前挂）——见注入 4

/* ================= C 天灾调度 ================= */
window.w64_tickDisasters=function(d){
  try{
    var ws=S.worldState;
    /* 结束判定：持续足够天数后递增结束 */
    ws.disasters=ws.disasters.filter(function(x){
      if(d-(x.startedDay||0) >= (x.daysMin||14)){
        var p=0.1+0.1*Math.floor((d-(x.startedDay||0)-(x.daysMin||14))/7);
        if(Math.random()<p){ w64_broadcast('天灾消退·'+x.cn, x.region+'的'+x.cn+'总算过去了。', d); return false; }
      }
      return true;
    });
    /* 触发判定：记忆期不重复 */
    for(var i=0;i<w64.disasters.length;i++){
      var D=w64.disasters[i];
      var last=ws.regions[D.id]&&ws.regions[D.id].lastEnd?ws.regions[D.id].lastEnd:0;
      if(d-last<(D.mem||70)) continue;
      if(!ws.regions[D.id]) ws.regions[D.id]={prosperity:60,lastEnd:0};
      var p=D.baseP;
      if(D.id==='rift' && typeof S.corruption==='number' && S.corruption>=40) p*=2;
      if(D.id==='plague' && ws.wars.filter(function(w){return w.phase<4;}).length>0) p+=3;
      if(Math.random()*100<p){
        var dur=Math.floor(Math.random()*((D.daysMax||42)-(D.daysMin||14)))+(D.daysMin||14);
        ws.disasters.push({id:D.id,cn:D.cn,region:D.region,startedDay:d,daysMin:D.daysMin,daysMax:D.daysMax,endsDay:d+dur});
        w64_broadcast('天灾·'+D.cn, D.region+'爆发了'+D.cn+'。', d);
        /* 区域影响 */
        var rg=ws.regions[D.id]; if(!rg) rg=ws.regions[D.id]={prosperity:60,lastEnd:0};
        rg.prosperity=Math.max(0,rg.prosperity-15);
        /* 深渊裂隙：推高环境腐化 */
        if(D.id==='rift' && typeof S.corruption==='number') S.corruption=Math.min(100,S.corruption+5);
      }
    }
  }catch(e){}
};
window.w64_disRespond=function(choice){
  try{
    w64_ensureDefaults();
    if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
    var ds=S.worldState.disasters;
    var cur=ds[ds.length-1];
    var cn=cur?cur.cn:'天灾';
    if(choice==='rescue'){ S.worldFame.mercy=Math.min(100,S.worldFame.mercy+8); if(typeof S.purity==='number') S.purity=Math.min(100,S.purity+5); w64_broadcast('义举', '有人在'+cn+'里救了一整条街的人。', (S.day||0)); }
    else if(choice==='loot'){ S.worldFame.terror=Math.min(100,S.worldFame.terror+8); if(typeof S.corruption==='number') S.corruption=Math.min(100,S.corruption+5); if(S.gold!==undefined) S.gold=(S.gold||0)+80; w64_broadcast('暴行', '有人在'+cn+'里发了笔财。', (S.day||0)); }
    else if(choice==='study'){ S.worldFame.scholar=Math.min(100,S.worldFame.scholar+6); w64_broadcast('求学', '有人对着'+cn+'留下的痕迹记了一整本笔记。', (S.day||0)); }
    return choice;
  }catch(e){ return choice; }
};

/* ================= E 市场 ================= */
window.w64_tickMarket=function(d){
  try{
    var ws=S.worldState;
    var warOn=ws.wars.filter(function(w){ return w.phase<4; }).length>0;
    for(var i=0;i<w64.marketDef.length;i++){
      var M=w64.marketDef[i];
      if(!ws.market[M.id]) ws.market[M.id]={price:M.base,supply:50,demand:50};
      var m=ws.market[M.id];
      /* 需求修正 */
      var dem=50;
      if(M.id==='arms'&&warOn) dem+=60;
      if(M.id==='grain'&&ws.disasters.some(function(x){return x.id==='beast'||x.id==='drought';})) dem+=40;
      if(M.id==='herb'&&ws.disasters.some(function(x){return x.id==='plague';})) dem+=30;
      if(M.id==='lux'&&warOn) dem-=20;
      m.demand=m.demand+(dem-m.demand)*0.2;
      /* 目标价 = base × (0.5 + 需求/供给 × 0.5)，clamp 10%-500% */
      var sup=Math.max(10,m.supply);
      var target=M.base*(0.5+(m.demand/sup)*0.5);
      if(target<M.base*0.1) target=M.base*0.1;
      if(target>M.base*5) target=M.base*5;
      m.price=m.price+(target-m.price)*M.vol;
      if(m.price<1) m.price=1;
    }
  }catch(e){}
};
window.w64_price=function(id){
  try{ w64_ensureDefaults(); var m=S.worldState.market[id]; if(!m) return 0; return Math.round(m.price); }catch(e){ return 0; }
};

/* ================= D 政治：教廷选举 ================= */
window.w64_tickPolitics=function(d){
  try{
    var ws=S.worldState, pol=ws.politics;
    if(!pol.papacy) pol.papacy={vacant:true,candidates:[],favor:{},electionDay:0};
    var pap=pol.papacy;
    if(pap.vacant && !pap.candidates.length){
      if(!pol.candidatesDone) pol.candidatesDone=0;
      if(pol.candidatesDone<2 || d-pap.electionDay>=30){
        pap.candidates=[
          {id:'cand_strict',cn:'枢机·克莱门特',stance:'严守教条',strongId:'牧师大宗师'},
          {id:'cand_open',cn:'枢机·奥黛拉',stance:'开明宽恕',strongId:'圣辉骑士'}
        ];
        pap.electionDay=d+7;
        w64_broadcast('教廷选举', '教皇沉眠于使徒宫，枢机团推举两位候选人：克莱门特严守教条，奥黛拉主张开明。', d);
      }
    }
    if(pap.candidates.length && d>=pap.electionDay){
      var fA=pap.favor['cand_strict']||0, fB=pap.favor['cand_open']||0;
      var winner=fA>fB?'cand_strict':(fB>fA?'cand_open':(Math.random()<0.5?'cand_strict':'cand_open'));
      var wc=null; for(var i=0;i<pap.candidates.length;i++){ if(pap.candidates[i].id===winner) wc=pap.candidates[i]; }
      pap.vacant=false; pap.elected=winner; pap.electedCn=wc?wc.cn:'枢机';
      w64_broadcast('新任教皇', (wc?wc.cn:'枢机')+'即位，他主张'+((wc&&wc.stance)||'平和')+'。', d);
      /* 政策影响关系 */
      if(winner==='cand_strict'){ var k=w64_relKey('church','academy'); ws.relations[k]=Math.max(-100,(ws.relations[k]||0)-15); }
      else { var k2=w64_relKey('church','academy'); ws.relations[k2]=Math.min(100,(ws.relations[k2]||0)+10); }
      pap.candidates=[]; pap.favor={}; pol.candidatesDone=(pol.candidatesDone||0)+1;
    }
  }catch(e){}
};
// v64b:engine 游说枢机（组织 rank≥2，favor +15）
window.w64_electionLobby=function(cid){
  try{
    w64_ensureDefaults();
    var pap=S.worldState.politics.papacy;
    if(!pap||!pap.candidates||!pap.candidates.length) return false;
    var rk=typeof S.orgRank==='number'?S.orgRank:0;
    if(rk<2){ if(window.flashMsg) flashMsg('你还没有游说枢机团的资格（组织 rank≥2）。'); return false; }
    if(!pap.favor) pap.favor={};
    pap.favor[cid]=(pap.favor[cid]||0)+15;
    if(window.flashMsg) flashMsg('你以组织身份拜会了「'+cid+'」一系的枢机。');
    return true;
  }catch(e){ return false; }
};
window.w64_electionLobby=w64_electionLobby;
window.w64_vote=function(cid){
  try{
    w64_ensureDefaults();
    var pap=S.worldState.politics.papacy;
    if(!pap||!pap.candidates||!pap.candidates.length) return false;
    var cost=200;
    if((S.gold||0)<cost){ if(window.flashMsg) flashMsg('囊中羞涩——游说需要 '+cost+' 金。'); return false; }
    S.gold=(S.gold||0)-cost;
    if(!pap.favor) pap.favor={};
    pap.favor[cid]=(pap.favor[cid]||0)+10;
    if(window.flashMsg) flashMsg('你为「'+cid+'」投下一笔资金。');
    return true;
  }catch(e){ return false; }
};

/* ================= F 目标 / 名声 / 因果 ================= */
/* 势力名解析（内容层节点使用；引擎内定义避免被分片构建误删） */
window.w64_fname=function(id){
  try{
    var F=(typeof W64_WorldState!=='undefined'&&W64_WorldState.factions)||{};
    return (F[id]&&F[id].cn)||id;
  }catch(e){ return id; }
};
/* 目标只存数据（id/cn/deadline），判定用 ID 规则（存档安全，函数不入 S） */
window.w64_addGoal=function(id,cn,deadline){
  try{
    w64_ensureDefaults();
    if(!S.worldGoals) S.worldGoals=[];
    for(var i=0;i<S.worldGoals.length;i++){ if(S.worldGoals[i].id===id) return false; }
    S.worldGoals.push({id:id,cn:cn,deadline:deadline||0,created:(S.day||0)});
    return true;
  }catch(e){ return false; }
};
/* 目标达成判定（ID 规则表；扩展位：新增 goal 在此加 case） */
function w64_goalOk(id){
  try{
    var ws=S.worldState;
    if(id.indexOf('goal_war_')===0){
      var wid=id.slice(9);
      for(var i=0;i<(ws.wars||[]).length;i++){ if(ws.wars[i].id===wid&&ws.wars[i].phase>=4) return true; }
      return false;
    }
    if(id==='goal_disaster_end'){ return !(ws.disasters&&ws.disasters.length); }
    if(id==='goal_election'){ var pap=ws.politics&&ws.politics.papacy; return !!(pap&&pap.elected); }
    return false;
  }catch(e){ return false; }
}
window.w64_tickGoals=function(d){
  try{
    w64_ensureDefaults();
    if(!S.worldGoals) return;
    var done=[];
    for(var i=0;i<S.worldGoals.length;i++){
      var g=S.worldGoals[i];
      var ok=false;
      try{ ok=w64_goalOk(g.id); }catch(e){ ok=false; }
      if(ok){
        done.push(g);
        w64_goalReward(g.id);
        w64_broadcast('目标达成·'+g.cn, '你当年立下的目标，今日成了。', d);
      } else if(g.deadline && d>g.deadline){
        done.push(g);
        w64_broadcast('目标搁浅·'+g.cn, '曾有人想做这件事，后来不了了之。', d);
      }
    }
    for(var j=0;j<done.length;j++){
      var idx=-1;
      for(var k=0;k<S.worldGoals.length;k++){ if(S.worldGoals[k].id===done[j].id){ idx=k; break; } }
      if(idx>=0) S.worldGoals.splice(idx,1);
    }
  }catch(e){}
};
/* 目标奖励（ID 规则表） */
function w64_goalReward(id){
  try{
    if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
    if(id.indexOf('goal_war_')===0){ S.worldFame.legend=Math.min(100,S.worldFame.legend+5); if(S.gold!==undefined) S.gold=(S.gold||0)+50; }
    if(id==='goal_disaster_end'){ S.worldFame.mercy=Math.min(100,S.worldFame.mercy+6); }
    if(id==='goal_election'){ S.worldFame.scholar=Math.min(100,S.worldFame.scholar+6); }
  }catch(e){}
}
window.w64_addFame=function(k,n){
  try{
    w64_ensureDefaults();
    if(!S.worldFame) S.worldFame={mercy:0,terror:0,legend:0,scholar:0};
    if(k in S.worldFame) S.worldFame[k]=Math.max(0,Math.min(100,S.worldFame[k]+(n||1)));
  }catch(e){}
};
/* 因果链：只记 id + fireDay（函数不入 S；触发效果在 w64_tickKarma 按 ID 规则） */
window.w64_karma=function(id,delay){
  try{
    w64_ensureDefaults();
    var d=(S.time&&S.time.totalDays)||S.day||0;
    S.w64Karma[id]={fireDay:d+(delay||21)};
  }catch(e){}
};
window.w64_tickKarma=function(d){
  try{
    w64_ensureDefaults();
    var fired=[];
    for(var id in S.w64Karma){
      var k=S.w64Karma[id];
      if(d>=k.fireDay){ fired.push(id); try{ w64_karmaFire(id,d); }catch(e){} }
    }
    for(var i=0;i<fired.length;i++) delete S.w64Karma[fired[i]];
  }catch(e){}
};
/* 因果触发效果（ID 规则表；扩展位：新增因果在此加 case） */
function w64_karmaFire(id,d){
  try{
    if(id==='karma_looted'){ w64_broadcast('旧债', '有人在市集认出了你——那场天灾里你拿走的，是别人一家过冬的粮。', d); }
    if(id==='karma_rescued'){ w64_broadcast('回响', '一篮干粮和一封信，被放在你门口。落款只写了四个字：那年天灾。', d); }
    if(id==='karma_bandit'){ w64_broadcast('江湖', '当年你放走的那个匪首，如今在城外立了寨子。他放出话：欠你一条命。', d); }
  }catch(e){}
}

/* ================= 面板：世界总览 ================= */
window.w64_worldPanel=function(){
  try{
    w64_ensureDefaults();
    var ws=S.worldState;
    var h='<div style="max-width:760px;">';
    h+='<div style="font-size:18px;font-weight:600;color:var(--text-gold);margin-bottom:8px;">🌍 世界局势</div>';
    /* 名声 */
    var f=S.worldFame||{mercy:0,terror:0,legend:0,scholar:0};
    h+='<div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">名声：仁名'+f.mercy+' 凶名'+f.terror+' 传奇'+f.legend+' 博名'+f.scholar+'</div>';
    /* 关系矩阵 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:8px 0 4px;">势力关系</div>';
    var ids=[]; for(var i=0;i<w64.factions.length;i++){ var ff=w64.factions[i]; if(!ff.hidden) ids.push(ff.id); }
    h+='<table style="width:100%;font-size:12px;border-collapse:collapse;">';
    h+='<tr style="color:var(--text-muted);"><td style="padding:2px 4px;">对→</td>';
    for(var j=0;j<ids.length;j++) h+='<td style="padding:2px 4px;">'+w64.fname(ids[j])+'</td>';
    h+='</tr>';
    for(var r=0;r<ids.length;r++){
      h+='<tr><td style="padding:2px 4px;color:var(--text-gold);">'+w64.fname(ids[r])+'</td>';
      for(var c=0;c<ids.length;c++){
        if(r===c){ h+='<td style="padding:2px 4px;color:var(--text-muted);">—</td>'; continue; }
        var v=w64_rel(ids[r],ids[c]);
        var col=v<0?'#e26d6d':(v>0?'#7fc47f':'var(--text-muted)');
        h+='<td style="padding:2px 4px;color:'+col+';">'+v+'</td>';
      }
      h+='</tr>';
    }
    h+='</table>';
    /* 活跃局势 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:10px 0 4px;">活跃局势</div>';
    if(!ws.activeSituations.length){ h+='<div style="font-size:12px;color:var(--text-muted);">大陆暂时平静。</div>'; }
    else{
      for(var s=0;s<ws.activeSituations.length;s++){
        var st=ws.activeSituations[s];
        h+='<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;border-left:3px solid var(--text-gold);">'
          +'<div style="font-size:13px;">'+st.cn+' <span style="font-size:11px;color:var(--text-muted);">'+w64.fname(st.factions[0])+' × '+w64.fname(st.factions[1])+'</span></div>'
          +'<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">'+st.text+'</div>'
          +'<div style="font-size:11px;color:var(--text-muted);">余 '+Math.max(0,st.deadline-(S.day||0))+' 天 · '+st.resolve+'</div>'+'<button class="btn btn-sm" style="margin-top:4px;" onclick="w64_sitNode(\''+st.id+'\')">介入</button></div>'; /*v64inj:content*/
      }
    }
    /* 战争 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:10px 0 4px;">战争</div>';
    var wars=ws.wars.filter(function(w){ return w.phase<4; });
    if(!wars.length){ h+='<div style="font-size:12px;color:var(--text-muted);">没有正在进行的战争。</div>'; }
    else{
      for(var w=0;w<wars.length;w++){
        var war=wars[w];
        var ph=['集结','拉锯','转折','终局'][war.phase];
        h+='<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;border-left:3px solid #e26d6d;">'
          +'<div style="font-size:13px;">'+w64.fname(war.a)+' vs '+w64.fname(war.b)+' <span style="font-size:11px;color:var(--text-muted);">'+ph+' · 士气 '+war.moraleA+'/'+war.moraleB+'</span></div>'
          +'<div style="font-size:11px;color:var(--text-secondary);">前线：'+war.front+' · 起因：'+war.cause+'</div>'
          +'<button class="btn btn-sm" style="margin-top:6px;" onclick="w64_joinWar(\''+war.id+'\')">奔赴前线</button></div>';
      }
    }
    /* 天灾 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:10px 0 4px;">天灾</div>';
    if(!ws.disasters.length){ h+='<div style="font-size:12px;color:var(--text-muted);">没有正在肆虐的天灾。</div>'; }
    else{
      for(var x=0;x<ws.disasters.length;x++){
        var D2=ws.disasters[x];
        h+='<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;border-left:3px solid #f4b393;">'
          +'<div style="font-size:13px;">'+D2.cn+' <span style="font-size:11px;color:var(--text-muted);">'+D2.region+'</span></div>'
          +'<button class="btn btn-sm" style="margin-top:6px;" onclick="w64_disNode()">前往处理</button></div>';
      }
    }
    /* 政治 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:10px 0 4px;">教廷</div>';
    var pap=ws.politics.papacy||{};
    if(pap.electedCn){ h+='<div style="font-size:12px;color:var(--text-secondary);">教皇：'+pap.electedCn+'（已即位）</div>'; }
    else if(pap.candidates&&pap.candidates.length){
      h+='<div style="font-size:12px;color:var(--text-secondary);">教皇沉眠，枢机团选举中：</div>';
      for(var c2=0;c2<pap.candidates.length;c2++){
        var cd=pap.candidates[c2];
        h+='<div style="margin:4px 0;font-size:12px;">'+cd.cn+'（'+cd.stance+'）支持票 '+(pap.favor[cd.id]||0)+' '
          +'<button class="btn btn-sm" onclick="w64_vote(\''+cd.id+'\')">资助 200 金</button></div>';
      }
    } else { h+='<div style="font-size:12px;color:var(--text-muted);">教皇沉眠于使徒宫，暂无动静。</div>'; }
    /* 目标 */
    h+='<div style="font-size:14px;color:var(--text-primary);margin:10px 0 4px;">世界目标</div>';
    if(!S.worldGoals||!S.worldGoals.length){ h+='<div style="font-size:12px;color:var(--text-muted);">你没有立下任何世界目标。</div>'; }
    else{
      for(var g2=0;g2<S.worldGoals.length;g2++){
        var gg=S.worldGoals[g2];
        h+='<div style="margin:4px 0;font-size:12px;">◆ '+gg.cn+'</div>';
      }
    }
    /* 行情入口 */
    h+='<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">';
    // v64b:engine 内容入口按钮
    var _pap=ws.politics&&ws.politics.papacy;
    if(_pap && ((_pap.candidates&&_pap.candidates.length) || _pap.electedCn)){
      h+="<button class='btn' onclick=\"writeNext('w64_election_node')\">枢机团会场</button>";
    }
    h+="<button class='btn' onclick=\"writeNext('w64_goal_node')\">立下目标</button>";
    if(S.w64Aftermath){ h+="<button class='btn' onclick=\"writeNext('w64_war_aftermath')\">战后结算</button>"; }
    h+="<button class='btn' onclick='w64_marketPanel()'>行情</button>";
    h+="<button class='btn' onclick='v65_warPanel()'>⚔战争</button>"; // v65:engine
    h+="<button class='btn' onclick='closePanel()'>返回游戏</button>";
    h+='</div></div>';
    if(window.v57_om&&window.v57_el){ v57_om(v57_el(h)); }
    else if(window.openModal&&window.elFromHtml){ openModal(elFromHtml(h)); }
  }catch(e){ console.error(e); }
};
window.w64_worldPanel=w64_worldPanel;

/* 行情面板 */
window.w64_marketPanel=function(){
  try{
    w64_ensureDefaults();
    var ws=S.worldState;
    var h='<div style="max-width:640px;">';
    h+='<div style="font-size:18px;font-weight:600;color:var(--text-gold);margin-bottom:8px;">💰 行情</div>';
    h+='<table style="width:100%;font-size:13px;border-collapse:collapse;">';
    h+='<tr style="color:var(--text-muted);"><td style="padding:4px;">商品</td><td>现价</td><td>供给/需求</td><td>趋势</td></tr>';
    for(var i=0;i<w64.marketDef.length;i++){
      var M=w64.marketDef[i];
      var m=ws.market[M.id]||{price:M.base,supply:50,demand:50};
      var trend=m.demand>m.supply?'↑':'↓';
      var col=m.demand>m.supply?'#e26d6d':'#7fc47f';
      h+='<tr><td style="padding:4px;">'+M.cn+'</td><td style="color:var(--text-gold);">'+Math.round(m.price)+' 金</td>'
        +'<td>'+Math.round(m.supply)+'/'+Math.round(m.demand)+'</td>'
        +'<td style="color:'+col+';">'+trend+'</td></tr>';
    }
    h+='</table>';
    h+='<div style="font-size:11px;color:var(--text-secondary);margin-top:8px;">价格随战争、天灾与供需波动——商人职业可依此囤货套利。</div>';
    // v64b:engine 区域状态（天灾影响的城市繁荣度）
    var _rg=ws.regions||{};
    var _rgN={'beast':'兽患区','plague':'疫区','rift':'裂隙带','storm':'风暴区','drought':'旱区'};
    var _hasRg=false; for(var _rk in _rg){ if(_rg.hasOwnProperty(_rk)){ _hasRg=true; break; } }
    if(_hasRg){
      h+='<div style="font-size:13px;color:var(--text-primary);margin:10px 0 4px;">区域状态</div>';
      h+='<div style="font-size:12px;">';
      for(var _rk2 in _rg){ if(!_rg.hasOwnProperty(_rk2)) continue;
        h+='<span style="margin-right:10px;">'+(_rgN[_rk2]||_rk2)+' 繁荣 '+_rg[_rk2].prosperity+'</span>';
      }
      h+='</div>';
    }

    h+='<div style="margin-top:12px;"><button class="btn" onclick="w64_worldPanel()">返回世界</button> <button class="btn" onclick="closePanel()">返回游戏</button></div>';
    h+='</div>';
    if(window.v57_om&&window.v57_el){ v57_om(v57_el(h)); }
    else if(window.openModal&&window.elFromHtml){ openModal(elFromHtml(h)); }
  }catch(e){ console.error(e); }
};
window.w64_marketPanel=w64_marketPanel;

/* 奔赴前线（战争介入入口） */
window.w64_joinWar=function(warId){
  try{
    w64_ensureDefaults();
    S.w64Side=warId;
    if(window.writeNext){ try{ writeNext('w64_war_join'); return; }catch(e){} }
    if(window.flashMsg) flashMsg('你踏上了前往前线的路。');
  }catch(e){}
};
/* 天灾处理入口 */
window.w64_disNode=function(){
  try{
    if(window.writeNext){ try{ writeNext('w64_dis_respond'); return; }catch(e){} }
  }catch(e){}
};

}catch(e){ console.error('W64 engine:', e); }
})();


/* ---------- 判定钩子：流派被动 + 烙印加成 + 烙印计数 ---------- */
window.v57_featApply = function(opt, t){
  var out={t:t, labels:[], reroll:false};
  try{
    if(!S||!opt||!opt.check) return out;
    var sk=opt.check.sk||"", a=opt.check.a||"";
    var scene=(window.v52_sceneOf)? v52_sceneOf(sk,a):null;
    if(!scene) return out;
    var j=v57_jobCn(); if(!j) return out;
    v57_ensureDefaults();
    /* 流派被动 */
    var fl=S.flow&&S.flow[j];
    if(fl&&fl.id&&FLOW_V57&&FLOW_V57[j]){
      var fd=FLOW_V57[j];
      for(var i=0;i<fd.flows.length;i++){
        var f=fd.flows[i];
        if(f.id!==fl.id||!f.passive) continue;
        if(f.scene&&f.scene!==scene) continue;
        var p=f.passive;
        if(p.type==='bonus'){ out.t+=p.value; out.labels.push('【流派·'+f.cn+'】'+p.label+(p.value>0?' +':' ')+p.value); }
        else if(p.type==='floor'){ if(out.t<p.value){ out.t=p.value; out.labels.push('【流派·'+f.cn+'】'+p.label+' · 保底'); } }
        else if(p.type==='pct'){ out.t=Math.round(out.t*(1+p.value)); out.labels.push('【流派·'+f.cn+'】'+p.label+' +'+Math.round(p.value*100)+'%'); }
        else if(p.type==='reroll'){ out.reroll=true; out.labels.push('【流派·'+f.cn+'】'+p.label+' · 可重掷'); }
      }
    }
    /* 烙印 gain + 计数 */
    var br=S.jobBrand&&S.jobBrand[j];
    if(JOB_BRAND_V57&&JOB_BRAND_V57[j]){
      var bd=JOB_BRAND_V57[j];
      for(var k=0;k<bd.brands.length;k++){
        var b=bd.brands[k];
        if(b.trig===scene){ v57_brandCount(j,b.id,1); }
        var st=br&&br[b.id];
        if(!st||!st.level) continue;
        var gains=b.gain||[];
        for(var g2=0;g2<gains.length;g2++){
          var gn=gains[g2];
          if(gn.lv!==st.level) continue;
          if(gn.scene&&gn.scene!==scene) continue;
          if(gn.type==='bonus'){ out.t+=gn.value; out.labels.push('【烙印·'+b.cn+'】'+gn.label+(gn.value>0?' +':' ')+gn.value); }
          else if(gn.type==='floor'){ if(out.t<gn.value){ out.t=gn.value; out.labels.push('【烙印·'+b.cn+'】'+gn.label+' · 保底'); } }
          else if(gn.type==='pct'){ out.t=Math.round(out.t*(1+gn.value)); out.labels.push('【烙印·'+b.cn+'】'+gn.label+' +'+Math.round(gn.value*100)+'%'); }
        }
      }
      /* 风险骰 */
      try{ v57_brandRisk(scene); }catch(e){}
    }
    out.t=Math.max(5,Math.min(98,out.t));
    return out;
  }catch(e){ return {t:t,labels:[],reroll:false}; }
};
window.v57_featApply=v57_featApply;

/* 破境加成（流派/烙印·修炼类） */
window.v57_breakthroughBonus = function(part){
  var sum=0;
  try{
    if(!S) return 0;
    var j=v57_jobCn(); if(!j) return 0;
    v57_ensureDefaults();
    var fl=S.flow&&S.flow[j];
    if(fl&&fl.id&&FLOW_V57&&FLOW_V57[j]){
      var fd=FLOW_V57[j];
      for(var i=0;i<fd.flows.length;i++){
        var f=fd.flows[i];
        if(f.id!==fl.id||!f.passive||f.passive.scene!=='修炼') continue;
        if(f.passive.type==='bonus') sum+=f.passive.value;
        if(f.passive.type==='pct') sum+=Math.round(55*f.passive.value);
      }
    }
    var br=S.jobBrand&&S.jobBrand[j];
    if(br&&JOB_BRAND_V57&&JOB_BRAND_V57[j]){
      var bd=JOB_BRAND_V57[j];
      for(var k=0;k<bd.brands.length;k++){
        var b=bd.brands[k];
        var st=br[b.id]; if(!st||!st.level) continue;
        var gains=b.gain||[];
        for(var g2=0;g2<gains.length;g2++){
          var gn=gains[g2];
          if(gn.lv!==st.level||gn.scene!=='修炼') continue;
          if(gn.type==='bonus') sum+=gn.value;
          if(gn.type==='pct') sum+=Math.round(55*gn.value);
        }
      }
    }
    return sum;
  }catch(e){ return 0; }
};
window.v57_breakthroughBonus=v57_breakthroughBonus;

/* ---------- 流派机制 ---------- */
window.v57_flowScore = function(j, flow){
  var feat=0, skill=0, peak=0;
  for(var i=0;i<flow.feats.length;i++){ if(v57_hasFeat(flow.feats[i])) feat++; }
  for(var k=0;k<flow.skills.length;k++){ if(v57_hasSkill(flow.skills[k])) skill++; }
  if(flow.peak){ for(var lv=1;lv<=5;lv++){ if(v57_hasPeak(flow.peak, lv)) peak=1; } }
  var needF=Math.max(2, Math.ceil(flow.feats.length*0.66));
  var needS=Math.max(2, Math.ceil(flow.skills.length*0.66));
  var score=Math.min(1, feat/needF)*40 + Math.min(1, skill/needS)*40 + (peak?20:0);
  return Math.round(score);
};
window.v57_flowCheck = function(j, flowId){
  try{
    if(!FLOW_V57||!FLOW_V57[j]) return;
    var fd=FLOW_V57[j];
    for(var i=0;i<fd.flows.length;i++){
      var f=fd.flows[i];
      if(f.id!==flowId) continue;
      var sc=v57_flowScore(j, f);
      if(sc>=80){
        if(!S.flow[j]||S.flow[j].id!==flowId){
          S.flow[j]={id:flowId, stage:1};
          v57_notify('你走通了这条路：'+f.cn+' 流派成型！');
          if(f.title){ try{ S.title=f.title; }catch(e){} }
          if(window.v57_hubRefresh) v57_hubRefresh();
        } else if(S.flow[j].stage<1){ S.flow[j].stage=1; }
      }
      return;
    }
  }catch(e){}
};
window.v57_flowCheck=v57_flowCheck;
window.v57_flowStage = function(flowId, st){
  try{
    var j=v57_jobCn(); v57_ensureDefaults();
    if(S.flow[j]&&S.flow[j].id===flowId){ S.flow[j].stage=Math.max(S.flow[j].stage||1, st); v57_notify('流派进度推进：'+st+' / 3'); if(window.v57_hubRefresh) v57_hubRefresh(); }
  }catch(e){}
};
window.v57_flowStage=v57_flowStage;

/* ---------- 烙印机制 ---------- */
window.v57_brandCount = function(j, bid, n){
  try{
    v57_ensureDefaults();
    if(!S.jobBrand[j]) S.jobBrand[j]={};
    var st=S.jobBrand[j][bid]||{level:0,count:0};
    st.count=(st.count||0)+(n||1);
    var th=[5,15,40], nv=0;
    if(st.count>=th[2]) nv=3; else if(st.count>=th[1]) nv=2; else if(st.count>=th[0]) nv=1;
    if(nv>st.level){
      st.level=nv;
      if(JOB_BRAND_V57&&JOB_BRAND_V57[j]){
        for(var i=0;i<JOB_BRAND_V57[j].brands.length;i++){
          var b=JOB_BRAND_V57[j].brands[i];
          if(b.id===bid){ v57_notify('职业的印记开始在你身上显形：'+b.cn+'（深度 Lv'+nv+'）'); break; }
        }
      }
      if(window.v57_hubRefresh) v57_hubRefresh();
    }
    S.jobBrand[j][bid]=st;
  }catch(e){}
};
window.v57_brandCount=v57_brandCount;
window.v57_brandRisk = function(){
  try{
    var j=v57_jobCn(); v57_ensureDefaults();
    var br=S.jobBrand&&S.jobBrand[j]; if(!br) return;
    var today=S.day||0;
    if(S.brandLog&&S.brandLog.lastCrisisDay===today) return;
    for(var k in br){
      var st=br[k]; if(!st||!st.level||st.level<2) continue;
      if(Math.random()*100 < 10*st.level){
        if(JOB_BRAND_V57&&JOB_BRAND_V57[j]){
          for(var i=0;i<JOB_BRAND_V57[j].brands.length;i++){
            var b=JOB_BRAND_V57[j].brands[i];
            if(b.id===k&&b.line&&b.line.length){
              S.brandLog=S.brandLog||[]; S.brandLog.lastCrisisDay=today;
              v57_notify('代价失控——'+b.cn+'的反噬来了。');
              try{ go(b.line[0]); }catch(e){}
              return;
            }
          }
        }
      }
    }
  }catch(e){}
};
window.v57_brandRisk=v57_brandRisk;
/* 危机抉择：压制/接纳 */
window.v57_brandResolve = function(bid, kind){
  try{
    var j=v57_jobCn(); v57_ensureDefaults();
    var st=S.jobBrand[j]&&S.jobBrand[j][bid]; if(!st) return;
    if(kind==='suppress'){ st.level=Math.max(0, st.level-1); v57_notify('你压下了这份代价。它沉下去了，但没消失。'); }
    else if(kind==='accept'){ st.level=Math.min(3, st.level+1); v57_notify('你接纳了它。它从此是你的一部分。'); }
    if(window.v57_hubRefresh) v57_hubRefresh();
  }catch(e){}
};
window.v57_brandResolve=v57_brandResolve;

/* ---------- 派系机制 ---------- */
window.v57_factionList = function(j){
  try{ return (ORDER_FACTION_V57&&ORDER_FACTION_V57[j])? ORDER_FACTION_V57[j].factions:[]; }catch(e){ return []; }
};
window.v57_factionAddRep = function(fid, n){
  try{
    v57_ensureDefaults();
    S.factionRep[fid]=(S.factionRep[fid]||0)+n;
    if(window.v57_hubRefresh) v57_hubRefresh();
  }catch(e){}
};
window.v57_factionJoin = function(fid){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); if(!j) return;
    var fs=v57_factionList(j); var f=null;
    for(var i=0;i<fs.length;i++){ if(fs[i].id===fid) f=fs[i]; }
    if(!f) return;
    if(S.factionPower[j]&&S.factionPower[j]!==fid){
      v57_notify('你已站在另一派系——改旗需付出代价。');
      return;
    }
    S.factionPower[j]=fid;
    S.factionRep[fid]=(S.factionRep[fid]||0)+10;
    v57_notify('你站进了'+f.cn+'。从此你的一举一动，都有人看着。');
    if(window.v57_hubRefresh) v57_hubRefresh();
  }catch(e){}
};
window.v57_factionEventTick = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); if(!j) return;
    var today=S.day||0;
    if(!S.brandLog) S.brandLog={};
    if(S.brandLog.facTick===today) return;
    S.brandLog.facTick=today;
    if(!FACTION_EVENTS_V57||!FACTION_EVENTS_V57.length) return;
    var pool=[];
    for(var i=0;i<FACTION_EVENTS_V57.length;i++){
      var ev=FACTION_EVENTS_V57[i];
      if(ev.job&&ev.job!==j) continue;
      if(ev.untilDay&&today>ev.untilDay) continue;
      if(ev.minDay&&today<ev.minDay) continue;
      pool.push(ev);
    }
    if(!pool.length) return;
    /* 每周 5% */
    if(today%7!==0) return;
    if(Math.random()*100>5) return;
    var ev2=pool[Math.floor(Math.random()*pool.length)];
    if(ev2.faction&&S.factionRep[ev2.faction]!==undefined){ v57_factionAddRep(ev2.faction, 2); }
    try{ if(S.missedEvents&&S.missedEvents.push){ S.missedEvents.push({id:ev2.id, area:'v57派系', text:ev2.text}); } }catch(e){}
    var msg='你听闻：'+ev2.text[0];
    v57_notify(msg);
  }catch(e){}
};
window.v57_factionEventTick=v57_factionEventTick;

/* ---------- 传承机制 ---------- */
window.v57_genApprentice = function(){
  try{
    v57_ensureDefaults();
    if(S.apprentice) return S.apprentice;
    var race=(S.race)||"人类";
    var nm=(window.v53_genName)? v53_genName(race, v57_jobCn(), "男") : "无名弟子";
    var talents=["专注","敏锐","坚韧","聪慧","执拗","慧黠"];
    var t2=talents[Math.floor(Math.random()*talents.length)];
    S.apprentice={id:"ap_"+Date.now(), name:nm, race:race, talent:[t2], bond:10, skill:[], fate:""};
    v57_notify('你在人群里遇见了'+nm+'——他看你的眼神，像一捧刚点着的火。');
    if(window.v57_hubRefresh) v57_hubRefresh();
    return S.apprentice;
  }catch(e){ return null; }
};
window.v57_genApprentice=v57_genApprentice;
window.v57_apBond = function(n){
  try{
    v57_ensureDefaults();
    if(!S.apprentice) return;
    S.apprentice.bond=Math.min(100, (S.apprentice.bond||0)+n);
    if(window.v57_hubRefresh) v57_hubRefresh();
  }catch(e){}
};
window.v57_apBond=v57_apBond;
window.v57_apFate = function(f){
  try{
    v57_ensureDefaults();
    if(!S.apprentice) return;
    S.apprentice.fate=f;
    v57_notify('弟子的路，走定了：'+f);
    if(window.v57_hubRefresh) v57_hubRefresh();
  }catch(e){}
};
window.v57_apFate=v57_apFate;

/* ---------- 职业中枢面板 ---------- */
window.v57_hubRefresh = function(){ try{ v57_ensureDefaults(); }catch(e){} };
window.v57_careerPanel = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn();
    var st=document.getElementById('story'), op=document.getElementById('options');
    if(!st||!op) return;
    if(window.clearOptions){ try{ clearOptions(); }catch(e){} }
    var rm=v57_rank(), rk=v57_orgRank();
    var fl=(S.flow&&S.flow[j])? S.flow[j]:null;
    var br=(S.jobBrand&&S.jobBrand[j])? S.jobBrand[j]:{};
    var fp=S.factionPower&&S.factionPower[j];
    var ap=S.apprentice;
    var h='';
    h+='<div style="font-size:16px;font-weight:bold;color:var(--text-gold);margin-bottom:8px;">━━ 职业之路 ━━</div>';
    h+='<div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px;">'+j+' · '+((S.race)||"人类")+' · '+((S.title)?"「"+S.title+"」":"无名")+'</div>';
    /* 七轨 */
    var tracks=[
      {cn:"境界", val:(S.realmCn||('第'+rm+'境'))+"（"+rm+"/8）", tip:"破境需材料·仪式·护法", pct:Math.min(100, rm*12.5)},
      {cn:"技艺", val:"专长 "+(S.feats?Object.keys(S.feats).length:0)+" / 技能 "+(S.skills&&S.skills[j]?S.skills[j].length:0), tip:"专长+技能构成你的打法", pct:0},
      {cn:"流派", val:fl?(fl.id+"（"+fl.stage+"/3）"):"未成型", tip:"凑专长+技能+巅峰可成型", pct:fl?Math.min(100, fl.stage*33):0},
      {cn:"烙印", val:Object.keys(br).length?("深度 Lv"+Math.max.apply(null,Object.keys(br).map(function(k){return br[k].level||0;}))):"无", tip:"职业在你身上留痕", pct:0},
      {cn:"派系", val:fp?fp:"未站队", tip:"派系决定职业圈的立场", pct:0},
      {cn:"传承", val:ap?("徒弟·"+ap.name+"（情谊 "+(ap.bond||0)+"）"):"未收徒", tip:"宗师后可收徒传道", pct:ap?Math.min(100,(ap.bond||0)):0},
      {cn:"神位", val:"组织 Lv"+rk+" · "+(S.deified?"已登神":"未登神"), tip:"组织→试炼→成神三要素", pct:Math.min(100, rk*20)}
    ];
    for(var i=0;i<tracks.length;i++){
      var t=tracks[i];
      h+='<div style="margin:6px 0;padding:8px 10px;background:rgba(255,255,255,.04);border-radius:8px;border-left:3px solid var(--text-gold);">';
      h+='<div style="display:flex;justify-content:space-between;font-size:13px;"><span>'+t.cn+'</span><span style="color:var(--text-gold);">'+t.val+'</span></div>';
      h+='<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">'+t.tip+'</div>';
      if(t.pct>0){ h+='<div style="height:4px;background:#3a3a3a;border-radius:2px;margin-top:4px;"><div style="height:100%;width:'+t.pct+'%;background:linear-gradient(90deg,#8a6a20,#c9a240);border-radius:2px;"></div></div>'; }
      h+='</div>';
    }
    /* 入口按钮 */
    h+='<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">';
    h+="<button class='btn' onclick='v57_flowPanel()'>流派</button>";
    h+="<button class='btn' onclick='v57_brandPanel()'>烙印</button>";
    h+="<button class='btn' onclick='v57_factionPanel()'>派系</button>";
    h+="<button class='btn' onclick='v57_legacyPanel()'>传承</button>";
    h+="<button class='btn' onclick='w64_worldPanel()'>🌍世界</button>"; /*v64inj:panel*/
    h+="<button class='btn' onclick='v51_featPanel()'>修行总览</button>";
    h+="<button class='btn' onclick='v52_peakPanel()'>巅峰盘</button>";
    h+="<button class='btn' onclick='v55_skillPanel()'>技能</button>";
    h+="<button class='btn' onclick='v52_orgPanel()'>组织</button>";
    h+="<button class='btn' onclick='v52_artifactPanel()'>神器</button>";
    h+="<button class='btn' onclick='closePanel()'>返回游戏</button>";
    h+='</div>';
    h+='<div style="font-size:11px;color:var(--text-secondary);margin-top:10px;">—— 专长是“你是谁”，技能是“你会做什么”，流派是你走的路，烙印是路的代价。 ——</div>';
    v57_om(v57_el(h));
  }catch(e){ console.error(e); }
};
window.v57_careerPanel=v57_careerPanel;

/* 流派面板 */
window.v57_flowPanel = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); if(!FLOW_V57||!FLOW_V57[j]){ v57_notify('该职业暂无流派定义。'); return; }
    var fd=FLOW_V57[j]; var h='';
    h+='<div style="font-size:15px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ '+j+' · 三大流派 ━━</div>';
    for(var i=0;i<fd.flows.length;i++){
      var f=fd.flows[i]; var sc=v57_flowScore(j,f);
      var cur=(S.flow[j]&&S.flow[j].id===f.id);
      h+='<div style="margin:8px 0;padding:10px;border:1px solid '+(cur?'var(--text-gold)':'rgba(255,255,255,.1)')+';border-radius:8px;">';
      h+='<div style="font-size:14px;font-weight:bold;">'+f.cn+' <span style="font-size:12px;color:var(--text-secondary);font-weight:normal;">· '+f.theme+'</span></div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">'+f.desc+'</div>';
      h+='<div style="font-size:12px;">成型度 <b style="color:'+(sc>=80?'var(--success)':'var(--text-gold)')+';">'+sc+'%</b> · '+(cur?'已成型（阶段 '+(S.flow[j].stage||1)+'/3）':'未成型')+'</div>';
      if(f.skills){ h+='<div style="font-size:11px;color:var(--text-secondary);">技：'+f.skills.map(function(x){return (SKILLS_V55&&SKILLS_V55[j])? "○":"·";}).join("")+'</div>'; }
      if(f.skills){
        var sn=[];
        for(var k=0;k<f.skills.length;k++){
          var s2=null;
          if(SKILLS_V55&&SKILLS_V55[j]){
            for(var t3=0;t3<4;t3++){
              var arr=SKILLS_V55[j]['t'+(t3+1)]||[];
              for(var t4=0;t4<arr.length;t4++){ if(arr[t4].id===f.skills[k]) s2=arr[t4].cn; }
            }
          }
          sn.push(s2||f.skills[k]);
        }
        h+='<div style="font-size:11px;color:var(--text-secondary);">核心技：'+sn.join(' / ')+'</div>';
      if(f.skillForm){
        var fm=[];
        for(var sfk in f.skillForm){ var sname=sfk; if(SKILLS_V55&&SKILLS_V55[j]){ for(var t5=0;t5<4;t5++){ var arr5=SKILLS_V55[j]['t'+(t5+1)]||[]; for(var t6=0;t6<arr5.length;t6++){ if(arr5[t6].id===sfk) sname=arr5[t6].cn; } } } fm.push(sname+' → '+f.skillForm[sfk]); }
        h+='<div style="font-size:11px;color:var(--text-gold);">形态：'+fm.join(' ／ ')+'</div>';
      }
      }
      if(f.title){ h+='<div style="font-size:11px;color:var(--text-gold);">专精称号：'+f.title+'</div>'; }
      if(f.sanctuary){ h+='<div style="margin-top:6px;"><button class="btn" onclick="go(\''+f.sanctuary+'\')">前往圣地 · '+f.sanctuaryCn+'</button></div>'; }
      if(!cur && S.flow[j] && S.flow[j].id){ h+='<button class="btn" style="margin-left:6px;color:var(--text-gold);" onclick="v57_flowSwitch(\''+f.id+'\')">改修此流派（500金+1巅峰点）</button>'; }
      h+='</div>';
    }
    h+='<div style="margin-top:10px;"><button class="btn" onclick="v57_careerPanel()">← 返回职业之路</button></div>';
    v57_om(v57_el(h));
  }catch(e){ console.error(e); }
};
window.v57_flowPanel=v57_flowPanel;

/* 烙印面板 */
window.v57_brandPanel = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); if(!JOB_BRAND_V57||!JOB_BRAND_V57[j]){ v57_notify('该职业暂无烙印定义。'); return; }
    var bd=JOB_BRAND_V57[j]; var h='';
    h+='<div style="font-size:15px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ '+j+' · 职业烙印 ━━</div>';
    h+='<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">力量皆有代价。你越深入这条道，它越会在你身上留痕。</div>';
    for(var i=0;i<bd.brands.length;i++){
      var b=bd.brands[i];
      var st=S.jobBrand[j]&&S.jobBrand[j][b.id];
      var lv=st?st.level:0, cnt=st?st.count:0;
      h+='<div style="margin:8px 0;padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:8px;">';
      h+='<div style="font-size:14px;font-weight:bold;">'+b.cn+' <span style="font-size:12px;color:var(--text-secondary);font-weight:normal;">深度 Lv'+lv+' / 3</span></div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">'+b.desc+'</div>';
      h+='<div style="font-size:12px;">进度 '+cnt+' / 5 / 15 / 40</div>';
      if(lv>=2&&b.line&&b.line.length){ h+='<div style="margin-top:6px;"><button class="btn" onclick="go(\''+b.line[0]+'\')">直面代价</button></div>'; }
      h+='</div>';
    }
    h+='<div style="margin-top:10px;"><button class="btn" onclick="v57_careerPanel()">← 返回职业之路</button></div>';
    v57_om(v57_el(h));
  }catch(e){ console.error(e); }
};
window.v57_brandPanel=v57_brandPanel;

/* 派系面板 */
window.v57_factionPanel = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); var fs=v57_factionList(j); if(!fs.length){ v57_notify('该职业暂无派系定义。'); return; }
    var h='';
    h+='<div style="font-size:15px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ '+j+' · 派系斗争 ━━</div>';
    h+='<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">同一个职业，不同的人，不同的路。你站哪边？</div>';
    var cur=S.factionPower&&S.factionPower[j];
    for(var i=0;i<fs.length;i++){
      var f=fs[i]; var rep=S.factionRep[f.id]||0;
      var isCur=(cur===f.id);
      h+='<div style="margin:8px 0;padding:10px;border:1px solid '+(isCur?'var(--text-gold)':'rgba(255,255,255,.1)')+';border-radius:8px;">';
      h+='<div style="font-size:14px;font-weight:bold;">'+f.cn+' <span style="font-size:12px;color:var(--text-secondary);font-weight:normal;">· 声望 '+rep+'</span>'+(isCur?' <span style="color:var(--text-gold);font-size:12px;">（你在此）</span>':'')+'</div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">'+f.doctrine+'</div>';
      if(f.npc){ h+='<div style="font-size:11px;color:var(--text-secondary);">中人：'+f.npc.join('、')+'</div>'; }
      if(isCur&&f.task){ h+='<div style="margin-top:6px;"><button class="btn" onclick="go(\''+f.task+'\')">派系事务</button></div>'; }
      if(!isCur){ h+='<div style="margin-top:6px;"><button class="btn" onclick="v57_factionJoin(\''+f.id+'\');v57_factionPanel()">站队于此</button></div>'; }
      h+='</div>';
    }
    h+='<div style="margin-top:10px;"><button class="btn" onclick="v57_careerPanel()">← 返回职业之路</button></div>';
    v57_om(v57_el(h));
  }catch(e){ console.error(e); }
};
window.v57_factionPanel=v57_factionPanel;

/* 传承面板 */
window.v57_legacyPanel = function(){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); var h='';
    h+='<div style="font-size:15px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ 传承 · 收徒 ━━</div>';
    var ap=S.apprentice;
    if(ap){
      h+='<div style="margin:8px 0;padding:10px;border:1px solid rgba(255,255,255,.1);border-radius:8px;">';
      h+='<div style="font-size:14px;font-weight:bold;">弟子 · '+ap.name+'</div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">天赋：'+ap.talent.join('、')+' · 情谊 '+(ap.bond||0)+'</div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);">'+(ap.fate?('已定之路：'+ap.fate):'尚在修行')+'</div>';
      h+='<div style="margin-top:8px;"><button class="btn" onclick="go(\'v57l_'+j+'_1\')">弟子的故事</button></div>';
      h+='</div>';
    } else {
      var can=(v57_rank()>=4&&v57_orgRank()>=1);
      h+='<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">宗师（境界4）且组织 Lv1 之后，你可以收下第一个弟子——把你走过的路，交给下一个人。</div>';
      if(can){ h+='<div style="margin-top:6px;"><button class="btn" onclick="v57_genApprentice();v57_legacyPanel()">寻觅传人</button></div>'; }
      else { h+='<div style="font-size:12px;color:var(--text-muted);">尚未满足条件：境界 '+(v57_rank()<4?'未达宗师':'达标')+' / 组织 '+(v57_orgRank()<1?'未入会':'达标')+'</div>'; }
    }
    h+='<div style="margin-top:10px;"><button class="btn" onclick="v57_careerPanel()">← 返回职业之路</button></div>';
    v57_om(v57_el(h));
  }catch(e){ console.error(e); }
};
window.v57_legacyPanel=v57_legacyPanel;


}catch(e){ console.error('v57 engine:', e); }
})();
/* /v57inj:fix:skillform */

/* /v57inj:fix:sanctuary */
N["v57f_骑士_blade_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_blade",3);
  return{
 sceneTitle:"圣辉之刃 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。圣辉之刃的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_骑士_oath_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_oath",3);
  return{
 sceneTitle:"誓约之盾 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。誓约之盾的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_骑士_walk_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_walk",3);
  return{
 sceneTitle:"巡游者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。巡游者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_游侠_hunt_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_hunt",3);
  return{
 sceneTitle:"猎杀之道 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。猎杀之道的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_游侠_ward_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_ward",3);
  return{
 sceneTitle:"守望者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。守望者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_游侠_roam_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_roam",3);
  return{
 sceneTitle:"巡林者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。巡林者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_盗贼_shadow_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_shadow",3);
  return{
 sceneTitle:"影杀者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。影杀者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_盗贼_night_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_night",3);
  return{
 sceneTitle:"夜行者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。夜行者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_盗贼_ear_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_ear",3);
  return{
 sceneTitle:"耳目 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。耳目的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_牧师_mercy_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_mercy",3);
  return{
 sceneTitle:"慈悲之道 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。慈悲之道的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_牧师_judge_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_judge",3);
  return{
 sceneTitle:"审判者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。审判者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_牧师_war_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_war",3);
  return{
 sceneTitle:"圣战者 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。圣战者的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_商人_way_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_way",3);
  return{
 sceneTitle:"商道 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。商道的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_商人_gold_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_gold",3);
  return{
 sceneTitle:"金流 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。金流的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_商人_auction_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_auction",3);
  return{
 sceneTitle:"拍场主 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。拍场主的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_魔法师_fire_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_fire",3);
  return{
 sceneTitle:"真理之焰 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。真理之焰的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_魔法师_door_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_door",3);
  return{
 sceneTitle:"万象之门 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。万象之门的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_魔法师_echo_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_echo",3);
  return{
 sceneTitle:"寂静回响 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。寂静回响的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_灵魂法师_lamp_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_lamp",3);
  return{
 sceneTitle:"魂灯不灭 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。魂灯不灭的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_灵魂法师_key_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_key",3);
  return{
 sceneTitle:"心扉之锁 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。心扉之锁的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_灵魂法师_chain_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_chain",3);
  return{
 sceneTitle:"契约之链 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。契约之链的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_术士_touch_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_touch",3);
  return{
 sceneTitle:"点金之手 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。点金之手的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_术士_forge_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_forge",3);
  return{
 sceneTitle:"百炼之炉 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。百炼之炉的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_术士_gear_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_gear",3);
  return{
 sceneTitle:"活偶之枢 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。活偶之枢的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_战士_banner_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_banner",3);
  return{
 sceneTitle:"不灭战旗 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。不灭战旗的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_战士_weapon_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_weapon",3);
  return{
 sceneTitle:"百兵之主 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。百兵之主的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};

N["v57f_战士_wall_3"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_wall",3);
  return{
 sceneTitle:"铁壁长城 · 大师认可",
 text:[
  "「你来了。」大师看着你，像早就知道你会来。「路走到这里，剩下的不是学，是信。」",
  "他把一件旧物放进你手里——不是什么宝物，是你这条路上最初的、还没忘的东西。",
  "「记住它。往后你越走越远，它就是你回得来路的锚。」",
  "你握住那件旧物。铁壁长城的纹路，在你血脉里定了下来。"
 ],
 options:[
  {t:"谢过大师",go:"academy_elda_hub"}
 ]
};};


/* /v57inj:fix:flowswitch */
window.v57_flowSwitch = function(flowId){
  try{
    v57_ensureDefaults();
    var j=v57_jobCn(); if(!j||!FLOW_V57||!FLOW_V57[j]) return;
    if(!S.flow[j]||!S.flow[j].id){ v57_notify('先成型一个流派，才能改修。'); return; }
    var f=null; for(var i=0;i<FLOW_V57[j].flows.length;i++){ if(FLOW_V57[j].flows[i].id===flowId) f=FLOW_V57[j].flows[i]; }
    if(!f) return;
    if(S.flow[j].id===flowId){ v57_notify('你正走在这条路上。'); return; }
    if((S.gold||0)<500){ v57_notify('金币不够——改修需要 500 金。'); return; }
    if((S.peakPts||0)<1){ v57_notify('巅峰点不够——改修需要 1 点巅峰点。'); return; }
    S.gold=(S.gold||0)-500; S.peakPts=(S.peakPts||0)-1;
    S.flowOld=S.flow[j];
    S.flow[j]={id:flowId,stage:1};
    v57_notify('你放下了旧路，踏上「'+f.cn+'」。旧路的修为没有丢——它替你记着。');
    if(window.v57_hubRefresh) v57_hubRefresh();
    if(window.v57_flowPanel) v57_flowPanel();
  }catch(e){}
};
window.v57_flowSwitch=v57_flowSwitch;

/* ===== /v57inj:engineEnd ===== */

/* ===== v57inj:legacyNodes2 ===== */
/* 盗贼 · 收徒线 */
N["v57l_盗贼_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 遇",
 text:[
  "旧鱼市的巷口，你撞见一个少年——他正从人家窗台上够一串晾着的腊肉。他听见脚步声，僵住了，手还悬在半空。",
  "你没有喊。你走过去，替他够下那串腊肉，挂在窗台原来的位置：「你够它，是饿了，还是手痒？」",
  "他低着头：「……我妹饿了。」",
  "你看着他。他浑身都在抖，可他的眼睛没有躲——那是一种「认了」的眼神。"
 ],
 options:[
  {t:"「饿了就直说。手痒的那条路，我给你换一条。」",go:"v57l_盗贼_2"}
 ]
};};
N["v57l_盗贼_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，有个七岁的妹妹。爹娘在瘟疫里没了，他靠偷东西养她——偷了两年，从没被抓过，因为「他跑得快」。",
  "你带他去了旧戏楼后台。你指着一排戏服：「夜行者有三张脸：贼的脸、影子的脸、人的脸。你只学会了前两张——今天，我教你第三张。」",
  nm+"看着那排戏服，眼睛慢慢亮了：「人……的脸？」",
  "你拿起一件旧袍子，抖开：「对。人先立住了，影子才有地方站。」"
 ],
 options:[
  {t:"「从今天起，你先学立住。」",go:"v57l_盗贼_3"}
 ]
};};
N["v57l_盗贼_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 试",
 text:[
  "你教他「立住」——白天，让他去码头做工，挣正经钱。他干了一个月，手上磨出茧，挣的钱，够他和妹妹吃饱。",
  "可那天晚上，他来找你，攥着一个钱袋：「老师。码头管事的钱袋……我、我忍不住。」",
  "他把钱袋放在你面前：「我没花。我摸到手，又放回去了。可我的手，它不听我的——它自己就伸过去了。」",
  "你看着那个钱袋：「你放回去了。那你的手，今天听了你一回。影子可以痒——但人得知道，什么时候不该伸。」"
 ],
 options:[
  {t:"「这一回，你赢了它。下一回，你也能赢。」",go:"v57l_盗贼_4"}
 ]
};};
N["v57l_盗贼_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师前，接到一单「大活」——有人出高价，让他去偷金衡商会的一本账册。",
  "他做好了计划，可动手前，他来找你：「老师。我查了——那本账册，牵着一批假药。偷了它，商会会查，药铺会倒，可买假药的人，已经病了。」",
  "他低着头：「我要是偷了，我是帮了谁？要是我不偷，那个出钱的人，会不会找别人？」",
  "你看着他。你教过他偷、教过他立住——可你没教过他，这一课。"
 ],
 options:[
  {t:"「这一课，你自己答。答完，你才算出师。」",go:"v57l_盗贼_4a"},
  {t:"「偷它。然后把账册，送到该看的人手里。」",go:"v57l_盗贼_4b"}
 ]
};};
N["v57l_盗贼_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"想了三天。第四天，他来找你：「老师。我不偷那本账册了——我去找了那家药铺的学徒，把假药的事告诉了他。学徒报给了商会。」",
  "你说：「那出钱的人呢？」他说：「他来找过我。我说：账册没了——我把它烧了。他不信，可他拿我没办法。」",
  "他毕业那天，站在旧戏楼后台，对你说：「老师。我想开一间铺子——正经的，收码头工钱的那种。」",
  "你看着他。他站在那里，穿着一件洗得发白的袍子——人，立住了。"
 ],
 options:[
  {t:"目送他走出后台",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
N["v57l_盗贼_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿影';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"偷了那本账册。他没有交给出钱的人——他把它送到了金衡商会的公秤台，压了一张字条：「假药的账，从这里开始查。」",
  "商会查了三个月，揪出那批假药。买药的人，有几个已经救不回来了——可后来的，都躲过了。",
  "他毕业那天，站在旧戏楼后台，对你说：「老师。那本账册，是我偷的最后一本。」",
  "你看着他。他的影子在灯下，比从前短了一点——因为他站得直了。"
 ],
 options:[
  {t:"「最后一本。记着这句话。」",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
/* 牧师 · 收徒线 */
N["v57l_牧师_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 遇",
 text:[
  "旧医馆的门槛上，坐着一个姑娘。她怀里抱着一个病人用的铜盂，洗得发亮——可她自己的手，冻得通红。",
  "你走过去。她抬头，笑了笑：「我听说，苦行派的人，在这儿刷夜壶。我刷了一个月了——他们没收我。」",
  "你蹲下来：「你想进来？」她说：「想。我娘是病死的。我想学——以后，别再有人像我娘那样，没人管。」",
  "她抱着铜盂，说这话的时候，眼睛很亮。"
 ],
 options:[
  {t:"「进来吧。从今天起，你刷的每一个，都算数。」",go:"v57l_牧师_2"}
 ]
};};
N["v57l_牧师_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 拜",
 text:[
  "她叫"+nm+"。她娘死在三年前的瘟疫里——村里的大夫跑了，没人管。她跪在门口求了三天，救不了她娘。",
  "你带她去了病榻廊。你让她看廊上那些躺着的人：「你学医，不是为了忘了你娘——是为了记住她，然后把那份『没人管』，还回去。」",
  nm+"站在廊上，看着那些病人，看了很久。她忽然说：「老师。我记住了。」",
  "你点点头。你带她走到第一张病榻前：「那开始吧。第一课：先听，再摸脉。」"
 ],
 options:[
  {t:"教她第一课",go:"v57l_牧师_3"}
 ]
};};
N["v57l_牧师_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 试",
 text:[
  nm+"学得极快。她记药方，一遍就熟；她守夜，三天不睡也不喊累。",
  "可有一天，她治坏了一个病人——她开的方子，分量多了一钱。病人吐了血，差点没救回来。",
  "她跪在病榻前，浑身发抖：「老师。我差点害死他。」",
  "你把她拉起来：「你记住这一钱。它比任何一页药方都重——因为它是用别人的命，换来的。从现在起，你开的每一张方子，都带着这一钱的分量。」"
 ],
 options:[
  {t:"「这一钱，是你最好的老师。」",go:"v57l_牧师_4"}
 ]
};};
N["v57l_牧师_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师了。可她越来越沉默——她开始整夜地守着病人，不睡；她救不回来的人，她会跪在病榻前，一夜一夜地不离开。",
  "她来找你的时候，眼睛发红：「老师。我救不回来的人，越来越多。我开始想——是不是我不够好？是不是神……在罚我？」",
  "你看着她。你想起你年轻的时候，也这样问过。",
  "「“+nm+”，你不是神，你也不用是。」你说，「你救不回来的人，你替他跪过、守过、记着过——这就是牧师能做的一切了。剩下的，不是你的罪。」"
 ],
 options:[
  {t:"「记住：你跪过的每一夜，都是你替人担过的。」",go:"v57l_牧师_4a"},
  {t:"「你累了。这三天，你来躺——我替你守夜。」",go:"v57l_牧师_4b"}
 ]
};};
N["v57l_牧师_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"渐渐稳了。她不再整夜不睡——她学会了，在救不回来的人面前，跪一会儿，然后站起来，去救下一个。",
  "她毕业那天，站在病榻廊，对你说：「老师。我想留在医馆——管那些最没人管的病人。」",
  "你看着她把铜盂擦亮，挂回门边。她站在那里，像一根扎进土里的柱子——不高，但稳。"
 ],
 options:[
  {t:"目送她走进病榻廊",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
N["v57l_牧师_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿静';return{
 sceneTitle:"传承 · 择",
 text:[
  "你替她守了三天的夜。她睡醒的时候，看见你坐在病榻边，愣了很久：「老师……你守了一夜？」",
  "你说：「你替我守过那么多夜。我守你三夜，不算什么。」",
  "她毕业那天，没有留在医馆。她对你说：「老师。我想去南城——那里有个麻风院，缺人手。我去替他们守。」",
  "你站在医馆门口，看着她背着行囊走远。她走的时候，回头喊了一句：「老师！我守完就回来！」"
 ],
 options:[
  {t:"朝她挥了挥手",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 商人 · 收徒线 */
N["v57l_商人_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 遇",
 text:[
  "金衡商会的公秤前，挤着一群人。一个少年蹲在人群外，手里攥着一把铜钱，眼睛盯着秤——他在看人过秤，看得极认真。",
  "你走过去。他没有抬头：「那个人，少称了三两。秤杆偏了一点，可没人看出来。」",
  "你蹲下来，看了一会儿——果然，秤杆偏着。你问他：「你看出来了，怎么不说？」",
  "他说：「说了，那卖货的会挨打。可那个买货的，白亏了三两。」他攥着铜钱，犹豫了一下，「要不……我去买他的货？」"
 ],
 options:[
  {t:"「你这一问，比秤准。」",go:"v57l_商人_2"}
 ]
};};
N["v57l_商人_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，是码头账房的学徒。他爹是账房先生，教他认字、算账，教到一半，人走了——留下他，和一把旧算盘。",
  "你带他去了金衡商会的三楼。你指着那杆老秤：「商人的第一课：秤会偏，人心不能偏。你爹教你的算盘，我接着教——教到你，能自己过秤为止。」",
  nm+"盯着那杆老秤，看了很久。他忽然问：「老师。商人的秤，称什么？」",
  "你笑了：「问得好。这就是你要学的东西——有的秤，称银子；有的秤，称人心。」"
 ],
 options:[
  {t:"「从今天起，我两样都教你。」",go:"v57l_商人_3"}
 ]
};};
N["v57l_商人_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 试",
 text:[
  "你教他掌秤。他学得很快——称、算、估价，样样都精。",
  "可有一回，他给商会收一批旧货，压价压得太狠——卖货的是个寡妇，急用钱。他回来，得意地跟你报账：「老师，这批货，省了二两。」",
  "你放下茶碗：「你省了二两银子，可你听见她道谢的时候，声音是抖的吗？」",
  nm+"愣住了。他想了想，脸慢慢红了：「……她抖了。」",
  "「你省了二两，她夜里要多做半月工才补得回来。」你说，「秤称的是货——你称的，是她的日子。」"
 ],
 options:[
  {t:"「这一课，比任何一本账都贵。」",go:"v57l_商人_4"}
 ]
};};
N["v57l_商人_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师前，商会来了一桩大生意：西港有一批药，急等出手。商会里两派吵成一团——诚信派说要原价收，投机派说要压价。",
  "他站在你面前，第一次问你：「老师。我掌秤的话——这单，我称银子，还是称人心？」",
  "你看着他。他长大了——他开始问，那杆秤到底称什么。",
  "「“+nm+”，这单生意，没有对错。」你说，「可你记住：你称银子的时候，得知道人心在哪儿；你称人心的时候，得知道银子在哪儿。两样都看得见的人，才掌得稳秤。」"
 ],
 options:[
  {t:"「这单，你来掌秤。我在旁边看。」",go:"v57l_商人_4a"},
  {t:"「我来掌秤。你看——看我怎么称。」",go:"v57l_商人_4b"}
 ]
};};
N["v57l_商人_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"掌了那单秤。他原价收了药，可他在合同里加了一条：商会出运费，药三天内进城。",
  "你问他为什么加那条。他说：「货主急着卖，是因为城里的病人在等。原价是人心——运费，是我把银子也看住了。」",
  "他毕业那天，站在那杆老秤前，对你说：「老师。我想去西港——替那些急等出手的人，掌秤。」",
  "你站在三楼，看着他走下楼梯。他的背影，已经不像一个学徒了。"
 ],
 options:[
  {t:"目送他走下楼梯",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
N["v57l_商人_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿秤';return{
 sceneTitle:"传承 · 择",
 text:[
  "你掌了那单秤。你没有压价，也没有抬高——你在合同里加了一条：卖货的钱，分三成，直接送去南城药铺，买解热毒的散药。",
  nm+"在旁边看了全程。他问：「老师。你这两样，都称了？」",
  "你说：「称了。货主不亏，病人有药，商会赚个名声——三样都站得住，秤才稳。」",
  "他毕业那天，没有留在商会。他对你说：「老师。我想回码头——回去掌那杆公秤。码头的人，都等着一个不偏的秤。」",
  "你看着他走向码头的背影。他带着那把旧算盘——和他爹教他的第一句：「秤会偏，人心不能偏。」"
 ],
 options:[
  {t:"目送他走向码头",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};


/* ===== v57inj:legacyNodes1 ===== */
/* 魔法师 · 收徒线 */
N["v57l_魔法师_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 遇",
 text:[
  "学院东廊的尽头，你看见一个年轻人蹲在地上，正用指头在灰里画什么。走近了看——是一道元素共鸣的推导，画错了三步。",
  "他抬头看见你，立刻把灰抹了，脸涨得通红：「我、我乱画的。」",
  "你蹲下来，把第三步指给他看：「这里错了。共鸣不是从外往里推，是从里往外。」",
  "他盯着那道灰迹，忽然说：「你……你能教我吗？」他的眼睛很亮，像刚点着的灯。"
 ],
 options:[
  {t:"「教你之前，先告诉我——你为什么想学这个？」",go:"v57l_魔法师_2"}
 ]
};};
N["v57l_魔法师_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他说他叫"+nm+"，是个孤儿，在学院做杂役，偷听讲课偷了三年。「别的都听不懂，就这个——画出来的时候，我心里『咚』地一下。」",
  "你看着他，想起自己第一次画出正确共鸣时的那个『咚』。",
  "你带他去了老藏书室——不是守秘派的地方，只是你常坐的那张旧桌子。你把一卷旧讲义推给他：「从第一页抄起。抄完，再找我。」",
  nm+"接过讲义，双手捧着，像捧着一盏灯。"
 ],
 options:[
  {t:"「抄吧。抄完第一页，来东廊找我。」",go:"v57l_魔法师_3"}
 ]
};};
N["v57l_魔法师_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 试",
 text:[
  "他抄了三天，抄完第一页，来找你。你翻他的抄本——字迹工整，但第三行漏了一个符号。",
  "你指着那个漏掉的符号：「我教你的第一课：共鸣的公式，漏一个符号，火就不是火，是烟。」",
  nm+"的脸白了。他低头看着自己的抄本，手指轻摸过那行字，忽然抬起头：「我重抄。」",
  "你点头。他转身跑回东廊。你看着他的背影，忽然明白：教人这件事，比教自己难——因为每一句「我教你的」，都成了你自己的秤。"
 ],
 options:[
  {t:"等他抄完，教他第一次真正的共鸣",go:"v57l_魔法师_4"}
 ]
};};
N["v57l_魔法师_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 变",
 text:[
  "他学会了共鸣。可他越来越沉默——你发现他总在半夜去禁书区，借那些「不该借」的书。",
  "一天夜里，你拦住他。他攥着书卷，不肯松手：「我想知道，为什么共鸣的『旧伤』篇，学院不让教。我想——我不怕。」",
  "你看着他，想起自己年轻的时候，也这样攥过一卷书。",
  "你把手按在他肩上：「禁忌派的路，比共鸣难走。你今天可以选：把书还回去，跟我走正道；或者留下它——但你得自己记住，你为什么要读它。」"
 ],
 options:[
  {t:"「还回去。我教你——教到你能自己判断，什么该读。」",go:"v57l_魔法师_4a"},
  {t:"「留着。但每次翻开，先告诉我你看到了什么。」",go:"v57l_魔法师_4b"}
 ]
};};
N["v57l_魔法师_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"把书还了回去。他站在禁书区门口，站了很久，然后走回你身边。",
  "你带他走了一遍你走过的路——从第一页讲义，到第一次共鸣，到第一次明白「知识有重量的地方」。",
  "他毕业那天，站在东廊，对你说：「老师。我决定，去北境做观测。」你说：「为什么？」他说：「那里的共鸣，有旧伤。我想去看看，怎么治。」",
  "你站在东廊，看着他走远。你没有送他——他带着你教的那杆秤，自己会走。"
 ],
 options:[
  {t:"望着他的背影，把旧讲义合上",go:"event_hub",note:"弟子继承你的路"}
 ]
};};
N["v57l_魔法师_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澈';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"留下了那卷书。他每翻开一次，都先来找你，讲他看到了什么。",
  "他读得越来越深，也越来越稳——因为他知道，书页再暗，有一盏灯在等他回来说话。",
  "毕业那天，他站在东廊，对你说：「老师。我想留校——去管禁书区。」你说：「管书的？」他说：「管书的。这样，下一个人偷听讲课的时候，能少走三年弯路。」",
  "你笑了。你看着他走进图书馆的背影，忽然觉得，东廊的灯，从此多了一盏。"
 ],
 options:[
  {t:"目送他走进图书馆",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 灵魂法师 · 收徒线 */
N["v57l_灵魂法师_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 遇",
 text:[
  "静河边的石阶上，坐着一个年轻人。他盯着河水，一动不动，像在听什么。",
  "你走过去。他头也不回：「河里有个人，在说话。他说他走了三天，找不到对岸。」",
  "你蹲下来，看着河水——河面很平，什么也没有。可你知道，他说的是真的。",
  "他转过头，眼睛很亮：「你能听见吗？还是说——只有我听得见？」"
 ],
 options:[
  {t:"「你听得见。来，我教你，怎么听，也怎么送。」",go:"v57l_灵魂法师_2"}
 ]
};};
N["v57l_灵魂法师_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，是个孤儿，在圣殿外长大，从小就能「听见」别人听不见的声音——他怕了半辈子，不敢跟人说。",
  "你带他去了灯廊。你指着那面「未点之灯」的墙：「你听见的那些声音，不是病——是这些人，还没人记得。你是他们的耳朵。」",
  nm+"站在墙前，看了很久。他忽然跪下来，说：「教我。我不想再怕了。」",
  "你扶起他：「不用跪。听见的人，膝盖是直的——因为你得替别人，站直了走。」"
 ],
 options:[
  {t:"带他走第一趟静河",go:"v57l_灵魂法师_3"}
 ]
};};
N["v57l_灵魂法师_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 试",
 text:[
  "你带他摆渡。船到河心，"+nm+"忽然攥紧桨：「他……他在哭。他说他放不下。」",
  "你握着桨：「记住，渡魂的人，不能替他放。你只能告诉他——对岸在，船在。放不放，是他的事。」",
  nm+"沉默了很久。船靠岸的时候，他说：「他下船了。他没有哭——他跟我说谢谢。」",
  "你看着他。你第一次摆渡的时候，也说过一句一模一样的「谢谢」。有些路，是要有人先走一遍，才知道哪里硌脚。"
 ],
 options:[
  {t:"「这趟，是你自己渡的。」",go:"v57l_灵魂法师_4"}
 ]
};};
N["v57l_灵魂法师_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 变",
 text:[
  ""+nm+"越来越能「听见」。可你发现，他渐渐分不清——哪些声音是河里的，哪些是他自己的。",
  "一天夜里，他来找你，眼睛发红：「老师。我听见我自己的声音了——他说，让我别再管这些人了。我管不完的。」",
  "你看着他。你知道这一天会来——每个听得见的人，都会听见自己的回声。",
  "你把手放在他肩上：「“+nm+”，你听见的『自己』，是你的魂灯在提醒你：你也是灯，不是摆渡的船。你烧得太亮了，会把自己也烧进河里。」"
 ],
 options:[
  {t:"「这盏灯，我陪你一起掌。」",go:"v57l_灵魂法师_4a"},
  {t:"「你该歇一歇了——河不会因为你歇，就干。」",go:"v57l_灵魂法师_4b"}
 ]
};};
N["v57l_灵魂法师_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 择",
 text:[
  "你陪他掌了三个月的灯。你教他：灯要有油，人要有觉。听见之前，先听见自己饿不饿、累不累。",
  nm+"渐渐稳了。他不再整夜泡在河边——他开始白天睡觉，夜里摆渡，像一杆会休息的灯。",
  "他毕业那天，站在静河边，对你说：「老师。我想留在灯廊——替那些没人记得的人，点灯。」",
  "你点点头。你看着他把第一盏灯点亮，灯焰跳了一下，像在说：欢迎回来。"
 ],
 options:[
  {t:"看着他点亮第一盏灯",go:"event_hub",note:"弟子继承了灯廊"}
 ]
};};
N["v57l_灵魂法师_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿澜';return{
 sceneTitle:"传承 · 择",
 text:[
  "你让他歇了三个月。他起初睡不着——闭上眼就是河的声音。后来，他学会了闭眼不听。",
  "他再回河边的时候，没有急着摆渡。他坐在石阶上，先听自己的呼吸，再听河。",
  "他毕业那天，对你说：「老师。我想去北境——那里有很多走丢的魂。我想教他们，怎么自己找对岸。」",
  "你站在石阶上，看着他的背影。他走得很稳——不是不怕了，是知道怕的时候，该先停下来歇一歇。"
 ],
 options:[
  {t:"目送他走向北境",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 术士 · 收徒线 */
N["v57l_术士_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 遇",
 text:[
  "熔炉大厅门口，蹲着一个少年，正用铁片剔一块旧铜皮——剔得极仔细，像在雕什么东西。",
  "你走近看：铜皮被他剔成一只小雀的形状，翅膀上的纹路，一笔一笔，像真的羽毛。",
  "他抬头见你，立刻把铜雀往怀里藏：「别、别跟总炉长说——我偷的废料。」",
  "你伸手：「给我看看。」他犹豫了一下，把铜雀放在你手心。它很小，可它身上的纹路，是活的。"
 ],
 options:[
  {t:"「这手艺，不该藏在废料堆里。」",go:"v57l_术士_2"}
 ]
};};
N["v57l_术士_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，是熔炉的杂役，专管添炭。他偷了三年废料，雕了三年小东西——铜雀、铁蛙、木鹿，全藏在床底。",
  "你带他去了你的工位。你推给他一截精铁：「从今天起，不用偷废料了。这块铁归你——你想雕什么，雕什么。」",
  nm+"盯着那截精铁，眼睛慢慢亮了。他抓起铁，又放下，用袖子擦了擦手，才重新拿起来。",
  "他捧着铁，像捧着一块没开封的命。"
 ],
 options:[
  {t:"「先别急着雕。先听我讲——造物之前，先认得它。」",go:"v57l_术士_3"}
 ]
};};
N["v57l_术士_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 试",
 text:[
  "你教他认得那块铁——听它的回声，摸它的纹理，看它在火里的颜色。他学得很快，可雕到第七天，他雕坏了。",
  "他把雕坏的铁片摔在地上，蹲下来，不说话。你走过去，捡起那片铁：「雕坏了，不是它不行——是它告诉了你，这条路走不通。造物的人，先学会听失败的话。」",
  nm+"抬头看你，眼睛红红的：「可这块铁，是我最喜欢的一块。」",
  "你把手里的废铁掂了掂：「它还是它。你看——你摔它之前，它是一块『雕坏的铁』；现在，它是一块『告诉过你路不通』的铁。同样的铁，多了一个故事。」"
 ],
 options:[
  {t:"「捡起来。它现在，是你的老师了。」",go:"v57l_术士_4"}
 ]
};};
N["v57l_术士_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"雕得越来越好。可你发现，他最近总往黑市跑——回来的时候，怀里总藏着什么东西。",
  "你拦住他。他躲闪了一下，说：「我、我买了几样材料。」你问什么材料。他低头：「人骨。听说，人骨雕的东西，能『活』。」",
  "你站在他面前，很久没说话。你想起熔炉大厅那排「活物」——它们活了，可它们也忘了自己曾是铁。",
  "你把那截「告诉他路不通」的废铁递给他：「你记住这块铁。它教过你一次——今天，它再教你一次：能『活』的东西，不一定该被造出来。」"
 ],
 options:[
  {t:"「把那些材料扔了。你要造的东西，我来帮你找。」",go:"v57l_术士_4a"},
  {t:"「留下它们——但造之前，先造一个你愿意替它负责的。」",go:"v57l_术士_4b"}
 ]
};};
N["v57l_术士_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"把那些人骨材料扔进了熔炉。火焰跳了一下，像把一段没走通的路，还给了火。",
  "你带他走了一遍你走过的路——从废料堆，到熔炉大厅，到那排「活物」面前。你告诉他，每一件活物背后，都有一截「路不通」的铁。",
  "他毕业那天，站在熔炉大厅，对你说：「老师。我想雕一只鸟——不图它活，图它飞的时候，像真的。」",
  "你看着他把最后一片铜皮收进怀里。那是一只新鸟的翅膀，还没成形——可它已经有了方向。"
 ],
 options:[
  {t:"目送他走进熔炉大厅",go:"event_hub",note:"弟子继承你的路"}
 ]
};};
N["v57l_术士_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿炉';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"没有扔那些材料。他把它们锁进一只铁箱，箱盖上刻了一行字：「造之前，先负责。」",
  "他毕业那天，站在熔炉大厅，对你说：「老师。那只铁箱，我留给下一任杂役——如果他也有想造的东西，先看看那行字。」",
  "你看着他把钥匙放进箱子里，转身走进火光的深处。你忽然觉得，你教的不是一个雕工——是一个会自己立规矩的匠人。"
 ],
 options:[
  {t:"看着铁箱合上",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 战士 · 收徒线 */
N["v57l_战士_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 遇",
 text:[
  "演武场的沙地上，一个年轻人正跟一根木桩较劲。他每一拳都打在桩上同一个位置，打出一个浅浅的坑。",
  "你走过去。他停下来，喘着气：「木桩不会躲。等我打到它躲——我就算练成了。」",
  "你看着那个坑：「木桩不会躲。可它会记住你每一拳。你打偏的地方，它也在记。」",
  "他愣了一下，低头看那个坑。忽然，他蹲下来，摸了摸桩上别处的旧痕——那些不是他打的。"
 ],
 options:[
  {t:"「你认得这些旧痕吗？它们都是前人的拳头。」",go:"v57l_战士_2"}
 ]
};};
N["v57l_战士_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，是演武场的打杂。他练拳三年，没人教——全靠看别人打，自己偷偷学。",
  "你带他去了旧旗台。你指着那面旧旗上的七个洞：「这面旗，挡过七次。你练的每一拳，都是为了有一天，能站在旗前。」",
  nm+"看着那面旗，眼睛慢慢红了。他跪下来，说：「收我。我想站到旗前面去。」",
  "你扶起他：「旗不收跪着的人。站起来——站起来，才有资格站到旗前。」"
 ],
 options:[
  {t:"带他练第一趟拳",go:"v57l_战士_3"}
 ]
};};
N["v57l_战士_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 试",
 text:[
  "你教他练拳。他学得极快——可你发现，他练到力竭，还不肯停。他把自己打脱力，躺在沙地上喘，说：「我、我还能再来。」",
  "你蹲在他旁边：「你练到脱力，练的是狠。可战士的力，是从『留』里长出来的——留三分，才撑得住旗前的每一次。」",
  nm+"躺在沙地上，看着天空，沉默了很久。他忽然问：「老师……你留三分的时候，怕不怕？」",
  "你看着那面旗：「怕。可我怕的，从来不是输——是留的那三分，该护的人没护住。」"
 ],
 options:[
  {t:"「记住这句话。拳会忘，话不会。」",go:"v57l_战士_4"}
 ]
};};
N["v57l_战士_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师前，接了一个任务——护送一支商队过铁门关。他回来的时候，左臂缠着布，眼神却变了。",
  "你问他怎么了。他说：「老师。我杀了人。他是山匪——他抢商队，我护人，我没错。可我一夜没睡。」",
  "你看着他的眼睛。你知道这道坎——每个战士都要过：拳头开过刃之后，怎么睡觉。",
  "你把手按在他左臂的伤上：「你一夜没睡，是因为你记得他倒下时的样子。记住他——不是记恨，是记着：你开过刃了，刃就得往对的地方去。」"
 ],
 options:[
  {t:"「这道坎，我陪你站着过。」",go:"v57l_战士_4a"},
  {t:"「刃开过，路还长。先睡一觉——明天，我教你什么叫『留三分』。」",go:"v57l_战士_4b"}
 ]
};};
N["v57l_战士_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 择",
 text:[
  "你陪他在旧旗台坐了三天。你教他——不是忘，是把那个倒下的影子，刻进旗里。旗挡的每一刀，都记得一个倒下的名字。",
  nm+"渐渐睡着了。他醒来的时候，看着那面旗，说：「老师。我想去北境守关——旗在那里，我该在那里。」",
  "你站在旧旗台，看着他背起行囊。他走的时候，回头看了你一眼，什么都没说——可你知道，他那一拳，已经不再打给木桩了。"
 ],
 options:[
  {t:"目送他走向北境",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
N["v57l_战士_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿戈';return{
 sceneTitle:"传承 · 择",
 text:[
  "你让他睡了一觉，然后带他去看那面旧旗。你指着旗上的洞：「这些洞，是挡出来的。不是杀出来的。你开过刃了——现在，学挡。」",
  nm+"在旧旗台前站了很久。他回来的时候，说：「老师。我想留在演武场——教那些打杂的年轻人，先学会留三分，再学出拳。」",
  "你看着他把一截旧旗布系在桩上。那面桩，从此多了一个记号——像旗，又不完全像。"
 ],
 options:[
  {t:"看着他把旗布系好",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 骑士 · 收徒线 */
N["v57l_骑士_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 遇",
 text:[
  "誓堂的台阶上，坐着一个年轻人。他手里攥着一枚旧徽章，翻来覆去地看，像在等什么。",
  "你走过去。他抬头：「你是骑士吗？我爹是骑士。他死在北境——可他答应过，回来带我去看灯会。」",
  "你在他旁边坐下。他没有哭——他只是攥着那枚徽章，攥得指节发白。",
  "「他答应过的事，没做到。」他说，「我替他记着。可我不知道，记着有什么用。」"
 ],
 options:[
  {t:"「记着，就是誓还没断。」",go:"v57l_骑士_2"}
 ]
};};
N["v57l_骑士_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，他爹是北境守军里的一个骑士，死在三年前。他母亲病着，他辍了学，靠给人跑腿养活一家。",
  "你带他去了暗室——那面刻满誓言的墙。你指着墙角的刻痕：「你爹立过一个誓，刻在这儿。他说：『替我娘，挡到冬至。』」",
  nm+"蹲在墙前，摸着那道刻痕，摸了很久。他忽然说：「他没有食言。他挡到了冬至——他只是没撑到灯会。」",
  "你站在他身后。誓堂的灯，照着他的背。"
 ],
 options:[
  {t:"「你爹的誓，守完了。你自己的誓，想立一个吗？」",go:"v57l_骑士_3"}
 ]
};};
N["v57l_骑士_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 试",
 text:[
  nm+"立了誓：替他娘，把病治好。",
  "你陪他跑了三个月——找大夫、凑药钱、煎药。他娘的病，慢慢见好了。",
  "他娘能下床那天，"+nm+"跪在院子里，哭得像个孩子。他哭完，红着眼睛问你：「老师。立誓容易，守誓……这么难吗？」",
  "你蹲下来，看着他的眼睛：「难。可你刚才守完了一个——你娘能站起来，就是那面墙上，新刻的一道。」"
 ],
 options:[
  {t:"「记住这个『难』。它会让你的誓，值钱。」",go:"v57l_骑士_4"}
 ]
};};
N["v57l_骑士_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师了。可你发现，他越来越忙——他接了很多委托，每接一个，就立一个誓。他的誓太多，多到他开始漏。",
  "一天，他来找你，低着头：「老师。我答应给东街的李婶修屋顶，可我忘了。她等了一下午，淋了雨，病倒了。」",
  "你看着他。誓约锈蚀——这个词，你没有教过他，可它已经在找他了。",
  "「“+nm+”，誓不是越多越好。」你说，「你爹守了半辈子，只守了一个。你立十个漏一个，不如立一个，守一辈子。」"
 ],
 options:[
  {t:"「从今天起，立誓之前，先问自己守不守得住。」",go:"v57l_骑士_4a"},
  {t:"「漏了，就去补——补上的誓，比没漏过的更硬。」",go:"v57l_骑士_4b"}
 ]
};};
N["v57l_骑士_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"把委托簿合上了。他推掉了大半，只留了三件——三件他守得住的。",
  "他娘问他为什么。他说：「老师教我的。誓不在多，在守得住。」",
  "他毕业那天，站在誓堂的墙前，摸着那道刻痕——他爹的「挡到冬至」。他说：「老师。我想去北境。替他——也替我自己，把旗守住。」",
  "你站在墙前，看着他走出去。他的背挺得很直，像一面刚立起来的旗。"
 ],
 options:[
  {t:"目送他走向北境",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
N["v57l_骑士_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿誓';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"去给李婶补了屋顶。他补得很仔细——补完，他在屋脊上坐了一会儿，说：「老师说的对。漏了，补上，比没漏过的更硬。」",
  "他毕业那天，没有去北境。他留在城里，开了个修屋顶的铺子——铺子门口挂着一块牌：「修屋顶。也修誓。」",
  "你路过那家铺子，看见他蹲在屋顶上，正给一户人家换瓦。他看见你，咧嘴一笑，指了指铺子门口那块牌。",
  "你笑了。你教的不是骑士——是一个知道誓要修的人。"
 ],
 options:[
  {t:"路过铺子，朝他点了点头",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};
/* 游侠 · 收徒线 */
N["v57l_游侠_1"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 遇",
 text:[
  "古树区边缘，一个少年正跟一头小鹿对峙。他张着手，慢慢后退——不是怕，是怕惊着它。",
  "他退到树根下，一屁股坐下，冲你笑：「它不信我。我喂了它三天了，它还是不信。」",
  "你蹲下来：「你喂它，是想让它信你，还是想让它活着？」",
  "他想了想：「……想让它活着。」那头小鹿，在他说话的时候，悄悄往前迈了一步。"
 ],
 options:[
  {t:"「它听懂了。你心里那个答案，它听见了。」",go:"v57l_游侠_2"}
 ]
};};
N["v57l_游侠_2"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 拜",
 text:[
  "他叫"+nm+"，是古树区守林人的孙子。他从小在林子里长大，能听懂很多鸟叫——可他说，他听不懂「人话」。",
  "你带他走了一趟你常走的巡林路线。你教他看树皮的方向、听溪水的深浅。",
  "走到一棵老橡树下，他忽然站住：「老师。这棵树在跟我说——它渴。它根下那条溪，改道了。」",
  "你蹲下来，扒开树根下的土——果然，是干的。你抬头看他：「你听懂了。你缺的，不是耳朵——是有人告诉你，你听见的，是真的。」"
 ],
 options:[
  {t:"「从今天起，我教你两门语言：林子的，和人的。」",go:"v57l_游侠_3"}
 ]
};};
N["v57l_游侠_3"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 试",
 text:[
  "你教他「人的语言」——进村，跟人打招呼，问路，讨水喝。他学得很别扭，像一只学站立的鹿。",
  "一次，他进村讨水，被一个老妇人拉住，聊了半天。他回来的时候，眼睛亮亮的：「老师。她跟我说，她儿子也在巡林——她问我，见没见过他。」",
  "你问他怎么答的。他说：「我说，林子里的人都互相认得。我下次看见他，跟他说，他娘想他了。」",
  "你看着他。你忽然觉得，这孩子的「人话」，说得比你好。"
 ],
 options:[
  {t:"「好。这一课，你教了我。」",go:"v57l_游侠_4"}
 ]
};};
N["v57l_游侠_4"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 变",
 text:[
  nm+"出师前，遇到一件事：猎人设的兽夹，夹住了一头母鹿。他救下母鹿，也记住了设夹的位置——是村里的老猎人。",
  "他来找你，第一次红了脸：「老师。老猎人说，他打猎养家，天经地义。可母鹿的崽，还在窝里等它。」",
  "你看着他：「“+nm+”，你站在两条路中间：猎人的路，和鹿的路。你不用选——你要学的，是让两条路，都通。」",
  "他想了很久。第二天，他给老猎人家送了一头自己养的家兔：「夹子，换这个。鹿的崽，还小。」"
 ],
 options:[
  {t:"「你找到了第三条路。」",go:"v57l_游侠_4a"},
  {t:"「记住今天——护林的人，先学会『换』。」",go:"v57l_游侠_4b"}
 ]
};};
N["v57l_游侠_4a"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"出师了。他留在古树区，接了你一半的巡林路线。",
  "他巡林的方式跟人不一样——他带着那头小鹿，一人一鹿，在林子里走。小鹿长大了一些，跟在他身后，像一截会走路的影子。",
  "他毕业那天，站在老橡树下，对你说：「老师。林子的话，我听得懂了。人的话——我也在学。」",
  "你看着他带着鹿走进林子深处。你忽然觉得，古树区的风，比从前暖了一点。"
 ],
 options:[
  {t:"目送他和鹿走进林子",go:"event_hub",note:"弟子继承了你的路"}
 ]
};};
N["v57l_游侠_4b"]=function(){var nm=(S.apprentice&&S.apprentice.name)||'阿林';return{
 sceneTitle:"传承 · 择",
 text:[
  nm+"学会了「换」。他巡林的时候，随身带着一袋粮食——看见猎人的夹子，他放粮食，移夹子。",
  "老猎人骂他，他就给老猎人送家兔。渐渐地，村里的猎人，都知道有个「拿兔子换夹子」的小子。",
  "他毕业那天，站在古树区边缘，对你说：「老师。我想去更远的地方——去那些人和林子还没学会说话的地方，替他们传话。」",
  "你站在树根下，看着他背着弓，走进晨雾里。他走得很慢，因为他在等——等一头鹿，决定要不要跟上来。"
 ],
 options:[
  {t:"目送他走进晨雾",go:"event_hub",note:"弟子走出了自己的路"}
 ]
};};


/* ===== v57inj:factionEvents ===== */
const FACTION_EVENTS_V57 = [
 {id:"fe_common_1",job:"",faction:"",text:["商路又断了一截。商会的马车堵在路口，车夫们蹲在车轱辘边，等着谁先让一步。","没人让。有人开始翻旧账——三年前的赊账，去年的那批坏布。","最后是码头的公秤先动了：过秤的师傅把秤砣拨正，说『先过秤，再吵账』。"],minDay:0,untilDay:9999},
 {id:"fe_common_2",job:"",faction:"",text:["学院的门房拦下一封信，收信人写着『旧旗台』。","信是北境寄来的，纸角磨破，只写了一行字：『旗还在。人还差三个没回来。』","门房把信压在窗台下。他不知道该往哪儿送——旧旗台上，已经没有人了。"],minDay:0,untilDay:9999},
 {id:"fe_common_3",job:"",faction:"",text:["圣辉殿的钟，今天响了十三下。","老钟匠说，钟自己响的——没有人敲。信徒们跪了一地，说是神谕。","只有钟楼里的那口旧钟知道：它只是有一根弦，锈断了。"],minDay:0,untilDay:9999},
 {id:"fe_common_4",job:"",faction:"",text:["旧鱼市的猫，最近特别多。","船屋的老板娘说，有一窝猫崽子被人养大了，又放回来了。它们满街跑，谁也不怕。","有人看见它们蹲在码头上，看船——像在等什么人。"],minDay:0,untilDay:9999},
 {id:"fe_mage_1",job:"魔法师",faction:"",text:["老藏书室的门，今天锁了两道。","有人看见洛·晨雾半夜进去，天亮才出来，手里多了一卷旧书。","守夜的学生说，他走路的时候，书卷在怀里，像揣着什么怕碎的东西。"],minDay:0,untilDay:9999},
 {id:"fe_mage_2",job:"魔法师",faction:"",text:["学院广场的书筐，又摆出来了。","筐边贴着一张字条：『书不怕烧。烧一本，我再抄一本。』","字迹是奥薇恩·星语的。她蹲在筐边，给学生讲元素，讲到日头偏西。"],minDay:0,untilDay:9999},
 {id:"fe_soul_1",job:"灵魂法师",faction:"",text:["圣殿地下的静河，今晚多了一条船。","渡魂派的人撑着船，河对岸站着一个模糊的影子——等了很久，才上船。","撑船的人没问名字。船到岸，影子散了，河面又平了。"],minDay:0,untilDay:9999},
 {id:"fe_soul_2",job:"灵魂法师",faction:"",text:["城东老宅的魂灯，灭了。","那盏点了四十年的灯，灯芯烧尽了，没有人再去添油。","老宅的儿子，在祠堂门口坐了一夜。天亮的时候，他把空灯收进了柜子。"],minDay:0,untilDay:9999},
 {id:"fe_smith_1",job:"术士",faction:"",text:["熔炉大厅的旧构装『守望』，自己走了两步。","没有人按它——它走到门口，又停住，像在认路。","格朗·符文蹲在它旁边，看了很久，说：『它想出去看看。』"],minDay:0,untilDay:9999},
 {id:"fe_smith_2",job:"术士",faction:"",text:["药室的活髓，少了一株。","梅·炽芯查了一下午，最后把药柜上了三道锁。","第二天，药室门口多了一篮草药——不知是谁送的，还带着露水。"],minDay:0,untilDay:9999},
 {id:"fe_war_1",job:"战士",faction:"",text:["旧旗台的旗，今天换了一面新的。","旧旗收进了旗箱——旗面上七个洞，像七只合上的眼睛。","秦·长风站在台下，说：『旧的收好。新的，还得有人去挡。』"],minDay:0,untilDay:9999},
 {id:"fe_war_2",job:"战士",faction:"",text:["城东粮仓的墙根，又有人蹲着。","是那个守门的老兵——他被除名了，可每天路过，还是习惯性地看看墙。","墙上的裂缝，被人补好了几道。没有人知道是谁补的。"],minDay:0,untilDay:9999},
 {id:"fe_knight_1",job:"骑士",faction:"",text:["誓堂的墙上，新添了一道刻痕。","很浅，像刚立下的誓。刻痕旁边，站着一个小姑娘，握着刀，手还在抖。","守誓派的老骑士看着她，没有催——他等她自己，把刀握稳。"],minDay:0,untilDay:9999},
 {id:"fe_knight_2",job:"骑士",faction:"",text:["城郊马场，那匹老马又跑了。","蹄铁卸了以后，它跑得比以前轻快。它跑过田野，跑过河滩，一直跑到看不见马场的地方。","伊莎·晨辉站在马场边，看着那个远去的影子，说：『它记路了。』"],minDay:0,untilDay:9999},
 {id:"fe_ranger_1",job:"游侠",faction:"",text:["古树区的那棵半枯橡树，发了新芽。","是护林的人救活的。芽很小，绿得像一滴露水。","贺·断弓蹲在树下，看了很久，说：『它记住了。』"],minDay:0,untilDay:9999},
 {id:"fe_ranger_2",job:"游侠",faction:"",text:["峡谷里，有人看见三只狼崽子跟着一头公狼。","公狼走得很慢，崽子们跌跌撞撞地跟。它们经过一块空地时，停了下来。","公狼朝空地方向看了一眼——那是有人放下它们的地方。"],minDay:0,untilDay:9999},
 {id:"fe_thief_1",job:"盗贼",faction:"",text:["旧戏楼后台，多了一排戏服。","是旧的——洗得发白，补丁摞着补丁。戏班子的人说，不知道谁放的。","杜·夜枭路过，看了一眼，没有说话。那排戏服，从此挂在后台，没人动。"],minDay:0,untilDay:9999},
 {id:"fe_thief_2",job:"盗贼",faction:"",text:["钟楼地下的那排刀，少了一把。","刀柄上刻着一个名字。乌·黛看着空出来的刀位，没有追。","她说：『接刀的人，自己会来还。』"],minDay:0,untilDay:9999},
 {id:"fe_priest_1",job:"牧师",faction:"",text:["圣辉殿门口，又排起了长队。","不是领圣餐——是有人挂了一块板，写着：『神谕录参考版，可借阅。』","抄经的人站在板边，说：『经文可以多一点。人心，不能少一横。』"],minDay:0,untilDay:9999},
 {id:"fe_priest_2",job:"牧师",faction:"",text:["城北旧医馆的门，今天开着。","玛格达·静烛坐在门边，膝上放着一盆洗干净的药渣。她正在给一个孩子讲小满的故事。","孩子听得入神。她讲到一半，停下来，说：『剩下的，等他回来再讲。』"],minDay:0,untilDay:9999},
 {id:"fe_trade_1",job:"商人",faction:"",text:["金衡商会的账本，今天多了一页。","记的不是买卖——是一句话：『王记布庄，七年旧账，已结。』","文森·金秤合上账本，说：『这一页，比任何一笔利润都重。』"],minDay:0,untilDay:9999},
 {id:"fe_trade_2",job:"商人",faction:"",text:["码头茶楼二楼，那张窗边的桌子，空了三天。","洛佩斯·半帆没有来。有人说他出海了，有人说他收手了。","桌上压着一枚旧船票，票角被海风磨白——像一张用过的，又像一张没用过的。"],minDay:0,untilDay:9999}
];


/* ===== v57inj:factionNodes3 ===== */
/* 盗贼 · 侠盗派 */
N["v57q_盗贼_fac_thief_xia_1"]=function(){return{
 sceneTitle:"侠盗派 · 入派试炼",
 text:[
  "侠盗派的堂口在旧戏楼的后台——那里没有招牌，只有一排戏服。杜·夜枭坐在镜前，正在卸脸上的妆。",
  "「侠盗派的信条：偷富人的，还穷人的。」他说，「戏台对面的粮行，老板叫周三，囤了三年粮，城里饿死人他也不放。你去——把他囤粮的账本，偷出来。」",
  "他递给你一枚细铜丝：「记住，只偷账本，不碰钱。钱是王八蛋，账本是刀。」",
  "你接过铜丝。窗外，戏楼的锣鼓正敲到热闹处。"
 ],
 options:[
  {t:"接下这单",go:"v57q_盗贼_fac_thief_xia_2"}
 ]
};};
N["v57q_盗贼_fac_thief_xia_2"]=function(){return{
 sceneTitle:"侠盗派 · 派系事件",
 text:[
  "你摸进粮行。账房的门锁是旧式的，铜丝一挑就开。账本在抽屉里，你伸手去拿——碰到一摞纸。",
  "你借着月光看：那不是账本，是一封封没寄出去的信。收信人都是同一个名字——周三的娘。信里写：「娘，今年粮价好，明年儿子接你进城享福。」",
  "你愣住。你翻到账本，又放下。你把那摞信，原样放回抽屉。",
  "你只带走了账本。可走出粮行的时候，你手里那本账，忽然比来时沉。"
 ],
 options:[
  {t:"把账本交给杜·夜枭",go:"v57q_盗贼_fac_thief_xia_3"}
 ]
};};
N["v57q_盗贼_fac_thief_xia_3"]=function(){return{
 sceneTitle:"侠盗派 · 站队大抉择",
 text:[
  "杜·夜枭翻开账本，一条一条看。粮价、囤量、出仓日期——白纸黑字，够周三喝一壶的。",
  "他把账本合上，忽然问你：「你在账房，看见什么了？」",
  "你说了那摞信。他沉默了一会儿：「周三这个人，囤粮是真的，给他娘攒钱也是真的。你偷了他的账，他垮了，他娘进城的事，就黄了。」",
  "他看着你：「账本可以交出去——周三垮，粮价跌，饿肚子的人吃上饭。也可以还回去——他活，可那三年囤粮，还会饿死更多人。你选。」"
 ],
 options:[
  {t:"交出去——账比信重",go:"v57q_盗贼_fac_thief_xia_3a",note:"侠盗派声望+15"},
  {t:"还回去——人比账重",go:"v57q_盗贼_fac_thief_xia_3b",note:"侠盗派声望+5"}
 ]
};};
N["v57q_盗贼_fac_thief_xia_3a"]=function(){return{
 sceneTitle:"侠盗派 · 抉择结果",
 text:[
  "账本交了出去。官府查了周三的囤粮，开仓放粮。饿着的人吃上饭那天，城里的粥棚排起长队。",
  "周三垮了。他娘没有进城——她留在乡下，逢人就说：「我儿囤粮，是想着我。」",
  "杜·夜枭听完，说了句：「你偷了账，还了粮。可你记住——你偷走的那些信，是他娘进城的念想。侠盗派的路，从来不是白走。」",
  "他递给你一枚铜扣：「侠盗派的印。收好——它跟着周三的账本，一起偷出来的。」"
 ],
 options:[
  {t:"接过铜扣",go:"event_hub",note:"已入侠盗派"}
 ]
};};
N["v57q_盗贼_fac_thief_xia_3b"]=function(){return{
 sceneTitle:"侠盗派 · 抉择结果",
 text:[
  "你把账本还了回去，压在周三的枕下，附了一张字条：「囤粮救不了你娘。城西粥棚，天天有粥。」",
  "第二天，你听说周三站在粥棚前，站了很久。后来，粮行放了一批平价粮。",
  "杜·夜枭听完，沉默了很久：「你换了条路——没让周三垮，让他自己转了弯。这比偷账本难多了。」",
  "他递给你一枚铜扣：「侠盗派的印。你记住了——有时候，偷走一个人的恶，不如让他自己放下。」"
 ],
 options:[
  {t:"接过铜扣",go:"event_hub",note:"已入侠盗派"}
 ]
};};
/* 盗贼 · 影誓派 */
N["v57q_盗贼_fac_thief_oath_1"]=function(){return{tag:"branch",
 sceneTitle:"影誓派 · 入派试炼",
 text:[
  "影誓派在钟楼地下。乌·黛坐在一盏油灯前，面前摆着一排小刀——每把刀柄上都刻着一个名字。",
  "「影誓派的信条：影子不欠人，也不失信。」她说，「答应的事，死在影子底下也要办到。你的试炼——选一把刀，立一个誓。」",
  "你低头看那排刀。刀柄上的名字，有的磨亮了，有的还新。",
  "你握住其中一把——刀柄微凉，刻着一个你见过的人名。"
 ],
 options:[
  {t:"立下这个誓",go:"v57q_盗贼_fac_thief_oath_2"}
 ]
};};
N["v57q_盗贼_fac_thief_oath_2"]=function(){return{tag:"branch",
 sceneTitle:"影誓派 · 派系事件",
 text:[
  "你立了誓：替一个老兵，把他的遗物送回他女儿手上。",
  "你找到那个女儿——她住在城北，嫁了个木匠，日子过得不宽裕。你递上遗物，一个旧木匣。她打开，里面是一枚旧勋章和半截梳子。",
  "她捧着梳子，忽然哭了：「我娘的东西……爹说，等她回来，用它给她梳头。他等了一辈子。」",
  "你站在门口，看着她哭。你忽然明白，影誓派立的誓，从来不是「办到」两个字——是替人把没走完的路，走完。"
 ],
 options:[
  {t:"等她哭完，悄悄离开",go:"v57q_盗贼_fac_thief_oath_3"}
 ]
};};
N["v57q_盗贼_fac_thief_oath_3"]=function(){return{tag:"branch",
 sceneTitle:"影誓派 · 站队大抉择",
 text:[
  "你回钟楼复命。乌·黛听完，没有问遗物送到了没有——她问：「她哭了吗？」",
  "你说是。她点了点头：「誓，算是了了。」",
  "可她又说：「你立誓的时候，选了一把刀——刀柄上那个名字，你认识。你知道他为什么在刀上吗？」",
  "你摇头。她说：「他立誓替他妹妹报仇。仇报了。可他也死了——死在仇人院里。他死了，誓还在——影誓派的规矩：立誓的人死了，接刀的人，接着走。现在，那把刀，轮到你了。」"
 ],
 options:[
  {t:"接刀——誓走到底",go:"v57q_盗贼_fac_thief_oath_3a",note:"影誓派声望+15"},
  {t:"还刀——你的誓已经了了",go:"v57q_盗贼_fac_thief_oath_3b",note:"影誓派声望+5"}
 ]
};};
N["v57q_盗贼_fac_thief_oath_3a"]=function(){return{tag:"branch",
 sceneTitle:"影誓派 · 抉择结果",
 text:[
  "你接过了那把刀。刀柄上的名字，从此跟着你。",
  "你查了三天，查到那仇人已经死了——死在两年前的一场火里。可他的家业还在，他妹妹的仇，还没有「完」。",
  "你忽然明白，影誓派的誓，不是一条线——是一团线，越解越多。",
  "乌·黛看着你：「你接了。现在你知道了吧——接刀的人，走的不是别人的路，是替所有没走完的人，继续走。」",
  "她递给你那盏油灯：「影誓派的印。记住——灯给你，路自己挑。」"
 ],
 options:[
  {t:"接过油灯",go:"event_hub",note:"已入影誓派"}
 ]
};};
N["v57q_盗贼_fac_thief_oath_3b"]=function(){return{tag:"branch",
 sceneTitle:"影誓派 · 抉择结果",
 text:[
  "你把刀还回那排刀里。你说：「我立过的誓，已经了了。别人的誓，我不接。」",
  "乌·黛看着你，没有怪罪：「你知道为什么影誓派的刀，越收越多吗？因为立誓的人多，还誓的人少。你不接，是清醒——可你记住，清醒的人，也别忘了，这排刀里，有你认识的那个名字。」",
  "她递给你一枚刀穗：「影誓派的印。不接刀，也还是影誓派的人——只要你记得，那排刀里，有个人等你替他走完。」",
  "你接过刀穗。它很轻，像一句没说完的话。"
 ],
 options:[
  {t:"接过刀穗",go:"event_hub",note:"已入影誓派"}
 ]
};};
/* 盗贼 · 自由派 */
N["v57q_盗贼_fac_thief_free_1"]=function(){return{
 sceneTitle:"自由派 · 入派试炼",
 text:[
  "自由派没有堂口——薇·灰雾住在旧鱼市的船屋里，门永远开着，谁都能进，谁也不许问来历。",
  "「自由派的信条：谁也别管谁，钱是王八蛋。」她递给你一把钥匙，「这是仓库的钥匙。仓库里有三箱货——来历不明，谁都不许动。你守着，守三天。」",
  "你接过钥匙。她补了一句：「记住，自由派不管你怎么守——你可以打开看，也可以不去看。看，是你的自由；不看，也是。」",
  "你握着钥匙，钥匙齿上带着旧锈，像一把很久没人用的锁。"
 ],
 options:[
  {t:"接下钥匙",go:"v57q_盗贼_fac_thief_free_2"}
 ]
};};
N["v57q_盗贼_fac_thief_free_2"]=function(){return{
 sceneTitle:"自由派 · 派系事件",
 text:[
  "你守了三天。第一箱，你没开。第二箱，你也没开。第三箱的锁，是松的——锁扣挂着，一碰就开。",
  "你蹲在第三箱前，蹲了很久。你听见箱子里有细小的动静——不是老鼠，像活物。",
  "你伸手，把锁扣拨开，掀开一条缝。里面是——三只小奶猫，蜷在旧布里，眼睛还没睁开。",
  "你合上箱盖。钥匙在手里，忽然变得温了。"
 ],
 options:[
  {t:"把猫抱出来，喂了三天",go:"v57q_盗贼_fac_thief_free_3"}
 ]
};};
N["v57q_盗贼_fac_thief_free_3"]=function(){return{
 sceneTitle:"自由派 · 站队大抉择",
 text:[
  "三天后，薇·灰雾来收钥匙。她看见你怀里的三只奶猫，愣了一下，然后笑了：「你开了第三箱。」",
  "「自由派不管你看不看。」她说，「可你开了，你就得管它们了——这是自由的代价：选择是你做的，路是你挑的。」",
  "她看着你怀里：「你选：把它们留下，自由派养——可它们从此是『自由派的猫』，一辈子有人管着。或者，你带着它们走——养到断奶，放回旧鱼市，让它们自己活。」",
  "奶猫在你怀里睡着，呼吸细细的。"
 ],
 options:[
  {t:"留下——自由派养它们",go:"v57q_盗贼_fac_thief_free_3a",note:"自由派声望+5"},
  {t:"带它们走——养到断奶就放",go:"v57q_盗贼_fac_thief_free_3b",note:"自由派声望+15，薇·灰雾好感↑"}
 ]
};};
N["v57q_盗贼_fac_thief_free_3a"]=function(){return{
 sceneTitle:"自由派 · 抉择结果",
 text:[
  "你把三只奶猫留在了自由派。它们长大了，在旧鱼市里到处跑，谁喂都吃，谁也不怕。",
  "薇·灰雾看着它们在码头追鱼，说：「它们有吃有喝，可它们一辈子不知道，旧鱼市外还有别的码头。」",
  "她递给你一把新钥匙：「自由派的印。你记住了——自由这东西，给出去的时候，就变成笼子了。你自己掂量。」",
  "你接过钥匙。钥匙是新的，没有锈。"
 ],
 options:[
  {t:"接过钥匙",go:"event_hub",note:"已入自由派"}
 ]
};};
N["v57q_盗贼_fac_thief_free_3b"]=function(){return{
 sceneTitle:"自由派 · 抉择结果",
 text:[
  "你带着三只奶猫走了。你喂了它们两个月，看着它们睁眼、学走、学会追尾巴。",
  "断奶那天，你把它们放回旧鱼市。它们站在码头边，回头看你，然后一只一只，跑向各自的巷子。",
  "薇·灰雾坐在船屋门口，看着那三个跑远的影子：「你放它们走了。它们会记住你——也会忘了你。这才是自由：记得和忘记，都是它们自己的事。」",
  "她递给你一把新钥匙：「自由派的印。你记住了——真正的自由，是你看着它们跑远，不追。」"
 ],
 options:[
  {t:"接过钥匙",go:"event_hub",note:"已入自由派"}
 ]
};};
/* 牧师 · 教条派 */
N["v57q_牧师_fac_priest_dogma_1"]=function(){return{
 sceneTitle:"教条派 · 入派试炼",
 text:[
  "教条派的书房在圣辉殿三楼。艾诺尔·银冠面前摊着一卷经文，旁边放着一排不同版本的抄本——字迹、断句，各有出入。",
  "「教条派的信条：经文的字，一个不许动。」她说，「这卷经文，第七节的『爱』字，在三个抄本里写法不同——一个多一点，一个少一横。」",
  "她递给你放大镜：「你替我核——三个抄本，哪个是对的。」",
  "你俯身下去，纸页的气味混着烛火，像一间旧教室。"
 ],
 options:[
  {t:"核抄本",go:"v57q_牧师_fac_priest_dogma_2"}
 ]
};};
N["v57q_牧师_fac_priest_dogma_2"]=function(){return{
 sceneTitle:"教条派 · 派系事件",
 text:[
  "你核了一下午。三个抄本，两个一致，一个多了一横。你把结果报给艾诺尔·银冠。",
  "她接过抄本，看了一会儿：「多一横的那个，是五十年前抄的。抄的人，是当时的抄经长——他多写一横，是因为他信：爱，比经文写的多一点。」",
  "她合上抄本：「教条派最近有个事。城西的孤儿院，新来的管事私自改了一段『祷词』——把『求主赐予』改成了『求主教我争取』。有人要告他篡改经文。」",
  "她看着你：「你替我去看看——他改的那段，改得对不对。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_牧师_fac_priest_dogma_3"}
 ]
};};
N["v57q_牧师_fac_priest_dogma_3"]=function(){return{
 sceneTitle:"教条派 · 站队大抉择",
 text:[
  "你去了孤儿院。管事是个中年男人，你问他为什么改祷词。他说：「孩子们求了三年『赐予』，饭还是不够吃。我教他们『争取』，至少他们学会伸手。」",
  "你站在孤儿院的院子里，孩子们在墙根下排着队领粥。你听见一个孩子念：「求主教我争取……」",
  "你回到圣辉殿，站在艾诺尔·银冠面前。她等着你的判断。",
  "你可以说改得对——那管事免于处罚，可教条派会记你一笔「纵容篡改」。也可以说改得不对——经文一字不能动，管事受罚，孩子们继续念「赐予」。"
 ],
 options:[
  {t:"改得对——爱该比经文多一点",go:"v57q_牧师_fac_priest_dogma_3a",note:"教条派声望+5"},
  {t:"改得不对——经文一字不能动",go:"v57q_牧师_fac_priest_dogma_3b",note:"教条派声望+15"}
 ]
};};
N["v57q_牧师_fac_priest_dogma_3a"]=function(){return{
 sceneTitle:"教条派 · 抉择结果",
 text:[
  "你说改得对。艾诺尔·银冠听完，沉默了很久，然后说：「你说了真话。可你记住——教条派立了这么多年，守的不是字，是『字后面站着的人』。你今天，替那个管事挡了一劫。」",
  "她没有罚管事，只让他在孤儿院门口贴了一版「参考祷词」，注明出处。",
  "她递给你一枚银章：「教条派的印。你记住了——经文可以多一点，人心不能少一横。」"
 ],
 options:[
  {t:"接过银章",go:"event_hub",note:"已入教条派"}
 ]
};};
N["v57q_牧师_fac_priest_dogma_3b"]=function(){return{
 sceneTitle:"教条派 · 抉择结果",
 text:[
  "你说改得不对。管事受了罚，停了三个月的职。孤儿院的祷词，改回了「求主赐予」。",
  "你路过孤儿院，听见孩子们念旧祷词的声音——比「争取」轻，比「争取」空。",
  "艾诺尔·银冠站在你身边：「你守了经文。可你记住了——你守住的这一横，可能让一群孩子，多念三年『赐予』。」",
  "她递给你一枚银章：「教条派的印。经文是要守的——可守的人，得自己先想清楚，那横，到底该多还是该少。」"
 ],
 options:[
  {t:"接过银章",go:"event_hub",note:"已入教条派"}
 ]
};};
/* 牧师 · 苦行派 */
N["v57q_牧师_fac_priest_ascetic_1"]=function(){return{
 sceneTitle:"苦行派 · 入派试炼",
 text:[
  "苦行派在城北的旧医馆——那里不收钱，只收「苦」。玛格达·静烛坐在门边，膝上放着一盆发黑的药渣。",
  "「苦行派的信条：神的爱，靠肉身去证。」她说，「你的试炼——去，替医馆刷三个月的夜壶。刷完，你再说你信什么。」",
  "你低头看那排夜壶——有的旧，有的新，都洗得很干净，可气味还留在指缝里。",
  "玛格达·静烛看着你：「不肯刷的，进不了苦行派。肯刷的，也未必留得住——你试试。」"
 ],
 options:[
  {t:"挽起袖子，开始刷",go:"v57q_牧师_fac_priest_ascetic_2"}
 ]
};};
N["v57q_牧师_fac_priest_ascetic_2"]=function(){return{
 sceneTitle:"苦行派 · 派系事件",
 text:[
  "你刷了三个月夜壶。第四个月，玛格达·静烛让你进了病房——让你替一个老病人擦身。",
  "那老人瘦得只剩骨架，皮肤贴着骨头。你给他擦身的时候，他忽然抓住你的手，说了一句：「谢谢你。」",
  "你蹲在床边，忽然觉得，这三个月的夜壶，都值了。",
  "玛格达·静烛站在门口：「苦行派最近有个事。南城的麻风院，人手不够——没有人肯去。你替我去一趟，住十天，替他们擦身、换药、送饭。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_牧师_fac_priest_ascetic_3"}
 ]
};};
N["v57q_牧师_fac_priest_ascetic_3"]=function(){return{
 sceneTitle:"苦行派 · 站队大抉择",
 text:[
  "你在麻风院住了十天。那里的病人，有的烂了手指，有的瞎了眼睛——可他们都会笑。有一个老太太，天天坐在门口，等一个「会来的人」。",
  "第十一天，老太太拉着你的手，问你：「你……是不是小满？」",
  "小满是她的孙子，三年前进了麻风院，再没出去。她一直在等。",
  "你查了登记册——小满，去年冬天已经走了。老太太还不知道。",
  "你可以告诉她——她会哭，可她会死心。也可以不说——她继续等，等到她走那天。你站在麻风院的门口，老太太的手，还攥着你的。"
 ],
 options:[
  {t:"告诉她——真相比等待慈悲",go:"v57q_牧师_fac_priest_ascetic_3a",note:"苦行派声望+15"},
  {t:"瞒着她——等是她的念想",go:"v57q_牧师_fac_priest_ascetic_3b",note:"苦行派声望+10"}
 ]
};};
N["v57q_牧师_fac_priest_ascetic_3a"]=function(){return{
 sceneTitle:"苦行派 · 抉择结果",
 text:[
  "你告诉了她。老太太听完，没有哭——她只是松开你的手，坐了很久，说：「我知道。我早知道了。」",
  "她说：「他走那天，我梦见他来跟我道别。我不信。我等他回来，是怕他不回来，就没人记得他了。」",
  "你蹲在她面前，说不出话。",
  "玛格达·静烛听完，递给你一枚旧木珠：「苦行派的印。你记住了——苦行不是吃苦，是替人把真相，端到面前。」"
 ],
 options:[
  {t:"接过木珠",go:"event_hub",note:"已入苦行派"}
 ]
};};
N["v57q_牧师_fac_priest_ascetic_3b"]=function(){return{
 sceneTitle:"苦行派 · 抉择结果",
 text:[
  "你没有说。你握着老太太的手，陪她坐了一下午，听她讲小满小时候的事——偷瓜、爬树、掉了门牙还咧嘴笑。",
  "她讲着讲着，睡着了。你替她掖好被角，走的时候，她还在笑。",
  "你回医馆，玛格达·静烛听完，没有评判：「你替她守了一个念想。可你记住了——念想这东西，守得越久，破的时候越疼。」",
  "她递给你一枚旧木珠：「苦行派的印。你选的这条路，比说实话难走——你往后，得替她记着那个小满，一辈子。」"
 ],
 options:[
  {t:"接过木珠",go:"event_hub",note:"已入苦行派"}
 ]
};};
/* 牧师 · 质疑派 */
N["v57q_牧师_fac_priest_doubt_1"]=function(){return{
 sceneTitle:"质疑派 · 入派试炼",
 text:[
  "质疑派的聚点在圣辉殿的旧钟楼——那里钟早就不响了。克莱门·圣言坐在钟下，面前点着一盏油灯，灯芯烧得很长。",
  "「质疑派的信条：神若存在，为何沉默。」他说，「你的试炼——回答我一个问题：你信神，还是信『神』这个字？」",
  "你站在钟楼里。这个问题没有正确答案——可你必须回答。",
  "他补了一句：「想清楚再说。质疑派不罚答错——只罚不肯想。」"
 ],
 options:[
  {t:"信神——字是后来写的",go:"v57q_牧师_fac_priest_doubt_2"},
  {t:"信『神』这个字——人需要它",go:"v57q_牧师_fac_priest_doubt_2"}
 ]
};};
N["v57q_牧师_fac_priest_doubt_2"]=function(){return{
 sceneTitle:"质疑派 · 派系事件",
 text:[
  "克莱门·圣言听完你的回答，没有说对错。他吹灭油灯：「你能答，就能进。质疑派要的不是答案——是敢答。」",
  "他重新点灯，火苗跳了一下：「质疑派最近有个事。教廷那边，新来了一位『神谕使』——他号称能听见神的声音。可他每句话，都像从圣辉殿的《神谕录》里背出来的。」",
  "他看你：「你替我去听他讲一场道。记住，别信他的话——信你的耳朵。他讲完，你告诉我，他听见的『神的声音』，像不像抄的。」"
 ],
 options:[
  {t:"去听他讲道",go:"v57q_牧师_fac_priest_doubt_3"}
 ]
};};
N["v57q_牧师_fac_priest_doubt_3"]=function(){return{
 sceneTitle:"质疑派 · 站队大抉择",
 text:[
  "你听了神谕使的讲道。他讲得很好——声情并茂，句句都像真的。可你留意到，他讲到「神说」的时候，眼神会先往左瞟——那是圣辉殿的《神谕录》放的位置。",
  "你回去，把你的观察告诉克莱门·圣言。他听完，很久没有说话。",
  "「如果他是抄的——揭穿他，教廷的威信会塌一角。质疑派会背上『毁教』的骂名。」他说，「如果不揭穿——神的声音，从此就是一本可以背的书。」",
  "他看着你：「你选：把证据交给教廷，当众对质——或者，把这段观察，烂在肚子里。」"
 ],
 options:[
  {t:"当众对质——神的声音不容抄袭",go:"v57q_牧师_fac_priest_doubt_3a",note:"质疑派声望+15"},
  {t:"烂在肚里——教廷的威信要紧",go:"v57q_牧师_fac_priest_doubt_3b",note:"质疑派声望+5"}
 ]
};};
N["v57q_牧师_fac_priest_doubt_3a"]=function(){return{
 sceneTitle:"质疑派 · 抉择结果",
 text:[
  "你当着教廷的面，把神谕使引向《神谕录》的段落——他接不上，眼神慌乱，最后承认「参考了经文」。",
  "神谕使被撤了职。教廷的威信，确实塌了一角——可奇怪的是，教堂的信众没有少，反而有人专程来问：「你们牧师，还敢质疑吗？」",
  "克莱门·圣言递给你一枚旧钟锤：「质疑派的印。你记住了——神的声音，从来不在一本书里。你替祂，敲了一记响的。」",
  "你接过钟锤。旧钟楼里，那口钟安安静静的，像在等下一次被敲响。"
 ],
 options:[
  {t:"接过钟锤",go:"event_hub",note:"已入质疑派"}
 ]
};};
N["v57q_牧师_fac_priest_doubt_3b"]=function(){return{
 sceneTitle:"质疑派 · 抉择结果",
 text:[
  "你把那段观察烂在了肚子里。神谕使继续讲他的道——每一句，都从《神谕录》里来。",
  "你每次路过讲道台，都觉得那句「神说」，在书页和唇齿之间，来来回回，像一条不会停的船。",
  "克莱门·圣言听完你的选择，没有怪你：「你保了教廷的脸面。可你记住了——你咽下去的那句话，会一直在你心里，问你要一个答案。」",
  "他递给你一枚旧钟锤：「质疑派的印。你收下它——质疑不是非要敲响钟，是听见钟声的时候，知道它为什么响。」"
 ],
 options:[
  {t:"接过钟锤",go:"event_hub",note:"已入质疑派"}
 ]
};};
/* 商人 · 诚信派 */
N["v57q_商人_fac_trade_honest_1"]=function(){return{
 sceneTitle:"诚信派 · 入派试炼",
 text:[
  "诚信派的账房在金衡商会三楼。文森·金秤面前摆着一杆老秤——秤盘磨得发亮，像被人摸了千百年。",
  "「诚信派的信条：一诺千金，童叟无欺。」他说，「你的试炼——去，把商会欠城西王记布庄的那笔旧账，结了。」",
  "他递给你账册：「那笔账，欠了七年。王记的老板，去年走了，他女儿接手。你亲自去，把银子和利息，一分不少地送去。」",
  "你翻账册——七年利滚利，数目不小。"
 ],
 options:[
  {t:"接过账册",go:"v57q_商人_fac_trade_honest_2"}
 ]
};};
N["v57q_商人_fac_trade_honest_2"]=function(){return{
 sceneTitle:"诚信派 · 派系事件",
 text:[
  "你去了王记布庄。接手的女儿姓王，才二十出头，正蹲在柜台后理布，袖子挽得高高的。",
  "你递上账册和银票。她愣住了：「这是……我爹在的时候，商会欠的？」",
  "你说是。她捧着账册，翻了很久，忽然哭了——不是哭钱，是哭那七个年头的念想：「我爹走之前，一直念叨着，商会还欠他一笔账。他怕我们忘了——也怕商会忘了。」",
  "你站在柜台前，看着她哭。你忽然明白，你送来的不是银子——是一句「没忘」。"
 ],
 options:[
  {t:"等她哭完，留下银子离开",go:"v57q_商人_fac_trade_honest_3"}
 ]
};};
N["v57q_商人_fac_trade_honest_3"]=function(){return{
 sceneTitle:"诚信派 · 站队大抉择",
 text:[
  "你回金衡商会复命。文森·金秤听完，点了点头：「账结清了。诚信派的试炼，你过了。」",
  "可你临走时，他叫住你：「商会最近有个事——西港来了一批货，压了三个月。货主急着出手，商会压价一成。那批货，是药——解热毒的药。西港正在闹热病。」",
  "他看着你：「商会要压价，货主只能卖——商会赚一成，买药的百姓多熬一天。你选：按商会的规矩压价，或者，按诚信派的路——原价收了那批货，商会不赚，货主不亏，药尽快进城。」",
  "你站在账房门口，那杆老秤在你身后，安安静静。"
 ],
 options:[
  {t:"按商会规矩压价",go:"v57q_商人_fac_trade_honest_3a",note:"诚信派声望+5"},
  {t:"原价收货——药要先进城",go:"v57q_商人_fac_trade_honest_3b",note:"诚信派声望+15，文森·金秤好感↑"}
 ]
};};
N["v57q_商人_fac_trade_honest_3a"]=function(){return{
 sceneTitle:"诚信派 · 抉择结果",
 text:[
  "你按商会的规矩压了价。货主卖了，商会赚了一成——那一成，进了商会的账本。",
  "可你路过西港的时候，看见药铺前排队的人，又多了几个。",
  "文森·金秤听完，没有说你错：「商会不是善堂。可你记住了——你压下去的那一成，会跟着你，过秤的时候，偏一偏。」",
  "他递给你一枚铜砝码：「诚信派的印。你收下——秤是你的，偏不偏，你自己掂。」"
 ],
 options:[
  {t:"接过铜砝码",go:"event_hub",note:"已入诚信派"}
 ]
};};
N["v57q_商人_fac_trade_honest_3b"]=function(){return{
 sceneTitle:"诚信派 · 抉择结果",
 text:[
  "你原价收了那批药。货主千恩万谢，商会账上少了一成——可三天后，药进了城，热病退了。",
  "药铺老板找到你，塞给你一包新茶：「这是西港的茶农托我带的——他们听说，有人原价收了药。」",
  "文森·金秤听完，笑了：「你赔了一成，赚了一句话。诚信派的印，给你——你记住：商会的秤，称银子；诚信派的秤，称人心。」",
  "他递给你一枚铜砝码。你接过的时候，觉得它比想象中沉——像称着什么东西。"
 ],
 options:[
  {t:"接过铜砝码",go:"event_hub",note:"已入诚信派"}
 ]
};};
/* 商人 · 投机派 */
N["v57q_商人_fac_trade_spec_1"]=function(){return{
 sceneTitle:"投机派 · 入派试炼",
 text:[
  "投机派在码头边的茶楼二楼——洛佩斯·半帆坐在窗边，桌上摊着一叠船期表，眼睛却看着楼下的人流。",
  "「投机派的信条：低买高卖，天经地义。」他说，「你的试炼——楼下有个人，在卖一批旧钟。你去看，哪只是『值钱的破钟』。」",
  "你下楼。卖钟的是个老头，摊上摆着七八只旧钟，走时不准，锈迹斑斑。",
  "你蹲下来，一只一只看。忽然，你听见一只钟里，传来很轻的「咔哒」声——不是走时，是机械深处，有什么不一样。"
 ],
 options:[
  {t:"买下那只响的钟",go:"v57q_商人_fac_trade_spec_2"}
 ]
};};
N["v57q_商人_fac_trade_spec_2"]=function(){return{
 sceneTitle:"投机派 · 派系事件",
 text:[
  "你买下那只钟，花了三枚铜钱。回去拆开——钟壳里嵌着一枚旧金币，是三十年前某位大公的纪念币，值三十金。",
  "你拿着金币回茶楼。洛佩斯·半帆看了一眼，笑了：「好眼力。投机派认你了。」",
  "他收起笑：「投机派最近有个事。城东有人囤了一批『银穗』——北境商路的硬通货。消息走漏了，明天价要跌。囤货的人，是商会的老人，今年六十七了。」",
  "他看你：「你替我去看看——他手里那批货，是收，还是让他砸手里。」"
 ],
 options:[
  {t:"接下这件事",go:"v57q_商人_fac_trade_spec_3"}
 ]
};};
N["v57q_商人_fac_trade_spec_3"]=function(){return{
 sceneTitle:"投机派 · 站队大抉择",
 text:[
  "你去了城东。囤货的老人姓孙，商会的老伙计，干了一辈子。他这批银穗，是他养老的本钱。",
  "明天跌价的消息，是真的——北境要开新商路，银穗的价，撑不过明天中午。",
  "你可以告诉他——让他赶在跌价前出手，保本；也可以不说——明天跌了，你低价收他的货，转手就是利。",
  "你站在孙老的货仓前。他正蹲在地上擦货箱，擦得很仔细，像擦自己的棺材本。他抬头看见你，咧嘴一笑：「小兄弟，来收货的？」"
 ],
 options:[
  {t:"告诉他——保他的本",go:"v57q_商人_fac_trade_spec_3a",note:"投机派声望+10"},
  {t:"瞒着他——明天低价收",go:"v57q_商人_fac_trade_spec_3b",note:"投机派声望+15"}
 ]
};};
N["v57q_商人_fac_trade_spec_3a"]=function(){return{
 sceneTitle:"投机派 · 抉择结果",
 text:[
  "你告诉了他。孙老连夜出了货，保住了本。第二天银穗跌价，他站在码头上，看着船开走，回头冲你拱了拱手。",
  "洛佩斯·半帆听完，没有说你傻：「你少赚了一笔。可你记住了——投机的人，最怕两样：看走眼，和睡不安。你今天没赚，可你今晚，睡得着。」",
  "他递给你一枚旧船票：「投机派的印。你收下——它提醒你，有些利，赚了会烫手。」"
 ],
 options:[
  {t:"接过旧船票",go:"event_hub",note:"已入投机派"}
 ]
};};
N["v57q_商人_fac_trade_spec_3b"]=function(){return{
 sceneTitle:"投机派 · 抉择结果",
 text:[
  "你瞒了他。第二天银穗跌价，你低价收了他那批货，转手赚了一笔——数目不小。",
  "孙老蹲在空货仓前，擦了擦眼，又擦了擦货箱。他什么都没说，可他的背，弯了一截。",
  "洛佩斯·半帆听完你的汇报，看着那笔利润，忽然说：「你赚了。可你记住了——投机派赚的是差价，不是命。你今天收的那批货，是孙老的命。」",
  "他递给你一枚旧船票：「投机派的印。你收下——它提醒你，有些船，开出去，就不回来了。」"
 ],
 options:[
  {t:"接过旧船票",go:"event_hub",note:"已入投机派"}
 ]
};};
/* 商人 · 中立派 */
N["v57q_商人_fac_trade_neutral_1"]=function(){return{
 sceneTitle:"中立派 · 入派试炼",
 text:[
  "中立派的柜台在商会一楼大堂——那里摆着全城唯一的「公秤」。灰·珊站在秤后，面前排着两队人，一队要买，一队要卖。",
  "「中立派的信条：商会不站队，只过秤。」她说，「你的试炼——来，替我掌秤。今天这两队人，谁也别想占谁一分。」",
  "你走到秤后。买的那队要压价，卖的那队要抬价——两边都在看你。",
  "你扶住秤杆。秤盘稍晃动，像在等一个决定。"
 ],
 options:[
  {t:"扶稳秤，开始掌秤",go:"v57q_商人_fac_trade_neutral_2"}
 ]
};};
N["v57q_商人_fac_trade_neutral_2"]=function(){return{
 sceneTitle:"中立派 · 派系事件",
 text:[
  "你掌了一天秤。两边吵了十几次，你每次都把秤拨回正中——不偏一寸。",
  "收摊的时候，灰·珊走过来：「你掌得稳。中立派认你了。」",
  "她压轻声音：「中立派最近有个事。北境商路断了，商会内部吵成一团——诚信派说要查，投机派说要囤，还有人说要趁机抬价。你是新人，两边都不熟。你替我去听——听他们到底在吵什么。」"
 ],
 options:[
  {t:"接下这件事",go:"v57q_商人_fac_trade_neutral_3"}
 ]
};};
N["v57q_商人_fac_trade_neutral_3"]=function(){return{
 sceneTitle:"中立派 · 站队大抉择",
 text:[
  "你听了三天会。商会的争吵，表面是「路怎么通」，底下是「谁说了算」——诚信派的老人、投机派的年轻人、还有想分一杯的中间人，各有各的账。",
  "你站在灰·珊面前，把听到的全说了。她听完，没有评判，只问：「你觉得，哪边对？」",
  "你说「各有各的理」。她笑了：「中立派要的就是这个——不站队。可你记住，不站队，不是没立场——是站得比他们高，看得比他们远。」",
  "她递给你一枚铜秤砣：「中立派的印。你收下——以后，你就是这杆公秤的一部分。秤要稳，人得先稳。」"
 ],
 options:[
  {t:"接过铜秤砣",go:"event_hub",note:"已入中立派"}
 ]
};};


/* ===== v57inj:factionNodes2 ===== */
/* 战士 · 荣耀派 */
N["v57q_战士_fac_war_glory_1"]=function(){return{
 sceneTitle:"荣耀派 · 入派试炼",
 text:[
  "荣耀派没有驻地——他们的「驻地」是旧旗台。秦·长风坐在旗台下，面前插着一杆褪色的旧旗。",
  "「荣耀派的信条：战士的死，该死在战场上。」他说，「你先别急着答应。去把旗台上那面旗，升起来——升完，你再说你信什么。」",
  "你走过去，握住旗绳。旗是旧的，布角磨出了毛边。你慢慢拉，旗一寸一寸升起来，在风里展开。",
  "风灌满旗面的时候，你听见台下有人轻声念了几个名字——像在点名，又像在还愿。"
 ],
 options:[
  {t:"把旗升到顶，系紧",go:"v57q_战士_fac_war_glory_2"}
 ]
};};
N["v57q_战士_fac_war_glory_2"]=function(){return{
 sceneTitle:"荣耀派 · 派系事件",
 text:[
  "你系好旗绳。台下那些念名字的人散去了，秦·长风还坐着。他看着那面旗，忽然说：「这面旗，是铁门关带回来的。旗上破了七个洞——七个，都是挡在旗前的人。」",
  "他站起来，走到旗前，指着一个洞：「这个洞，是我师父挡的。他死的那天，说了一句话——『旗别倒』。」",
  "他转头看你：「荣耀派最近出了件事。北境传来消息，说有一小队守军，弃了关隘跑了。名字还在核对。你替我去查——查清楚，他们是真的弃了，还是被逼的。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_战士_fac_war_glory_3"}
 ]
};};
N["v57q_战士_fac_war_glory_3"]=function(){return{
 sceneTitle:"荣耀派 · 站队大抉择",
 text:[
  "你查了五天，查清楚了：那队守军没有弃关——他们守到弹尽粮绝，被兽潮冲散，活着的几个人各自突围，走了三天三夜才回到北境。",
  "可传话的人添油加醋，说成了「弃关逃跑」。现在，军法处要按逃兵处置他们。",
  "你站在秦·长风面前，把查到的全说了。他听完，沉默了很久。",
  "「军法处只认口供，不认你查的。」他说，「你可以把证据交上去——替他们翻案，但你要跟军法处打一场官司，输赢难说。或者，你当作没查透——让他们按逃兵处置，荣耀派保自己干净。」"
 ],
 options:[
  {t:"把证据交上去——荣耀不在嘴上",go:"v57q_战士_fac_war_glory_3a",note:"荣耀派声望+15"},
  {t:"保派系干净——弃守之名洗不清",go:"v57q_战士_fac_war_glory_3b",note:"荣耀派声望+5"}
 ]
};};
N["v57q_战士_fac_war_glory_3a"]=function(){return{
 sceneTitle:"荣耀派 · 抉择结果",
 text:[
  "你把证据交了上去。官司打了七天，军法处最终撤销了「弃关」的罪名，改记为「力战后退」。",
  "那几个守军被放出来那天，其中一个老兵找到你，握了握你的手，什么都没说，走了。",
  "秦·长风在旗台下等你。他说：「荣耀派认你了。你记住——荣耀不是旗上的洞，是洞后面站着的人。」",
  "他递给你一枚旧铁徽：「荣耀派的印。收好。以后，你就是旗人之一了。」"
 ],
 options:[
  {t:"接过铁徽",go:"event_hub",note:"已入荣耀派"}
 ]
};};
N["v57q_战士_fac_war_glory_3b"]=function(){return{
 sceneTitle:"荣耀派 · 抉择结果",
 text:[
  "你选择了沉默。那队守军，最终按「力战不支」记过，没有除名，也没有翻案——军法处留了面子，他们也认了。",
  "秦·长风听完你的汇报，看了你很久：「你保了派系干净。可你记住——你今天没交上去的那份证据，会在你心里，压一辈子。」",
  "他递给你一枚旧铁徽：「荣耀派的印。拿着吧——荣耀这东西，有时候就是你知道自己做过什么，而别人不知道。」",
  "你接过铁徽。它比想象中沉。"
 ],
 options:[
  {t:"接过铁徽",go:"event_hub",note:"已入荣耀派"}
 ]
};};
/* 战士 · 守护派 */
N["v57q_战士_fac_war_guard_1"]=function(){return{
 sceneTitle:"守护派 · 入派试炼",
 text:[
  "守护派守着一堵旧墙——就是格罗·铁壁画过手印的那堵墙。他站在墙下，像一块生根的石头。",
  "「守护派的信条：力量不为功名，为身后的人。」他说，「你去——把那堵墙的裂缝，一条一条补好。补完，你再说你信不信。」",
  "你抬头看那堵墙。墙上全是裂缝，还有几道旧手印，深的浅的，叠在一起。",
  "你蹲下来，和泥，填缝。泥是凉的，墙是热的——像晒了一整天的老骨头。"
 ],
 options:[
  {t:"一条一条，慢慢补",go:"v57q_战士_fac_war_guard_2"}
 ]
};};
N["v57q_战士_fac_war_guard_2"]=function(){return{
 sceneTitle:"守护派 · 派系事件",
 text:[
  "你补了三天，把裂缝填完大半。填到最高那道时，你发现裂缝深处刻着一行小字——「替我的娘，挡到冬至。」下面还有一行更小的：「他娘活过了冬至。」",
  "你蹲在墙根，看了很久。你忽然明白，这堵墙上的每一道旧手印，都是一个「挡住」过的日子。",
  "格罗·铁壁不知什么时候站在你身后：「那是三十年前的事了。刻字的那个兵，死在第二年开春——不是墙倒了，是墙不需要他挡了。」",
  "他蹲下来，把你补的那道裂缝摸了摸：「守护派最近有个事——城东的粮仓，最近总丢粮。你替我去看看，谁在偷。记住，别急着抓人——先看，他为什么偷。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_战士_fac_war_guard_3"}
 ]
};};
N["v57q_战士_fac_war_guard_3"]=function(){return{
 sceneTitle:"守护派 · 站队大抉择",
 text:[
  "你蹲了三天，抓到偷粮的人——是粮仓守门的老兵，他把自己那份口粮省下来，夜夜送进城西的难民棚。",
  "你把他带到格罗·铁壁面前。老兵跪着，不说话。格罗·铁壁看着他，看了很久。",
  "「军粮是军粮，难民是难民。」格罗说，「规矩上，他偷了。可你看见了——他偷的那些粮，喂的是饿着的人。」",
  "他看着你：「你选：按军法办他——除名，赶出城。或者，你替他认下这桩事——就说，是你私自分粮，你担军棍。」"
 ],
 options:[
  {t:"按军法办——规矩是墙的缝",go:"v57q_战士_fac_war_guard_3a",note:"守护派声望+5"},
  {t:"替他担下——墙该挡的，不止是风",go:"v57q_战士_fac_war_guard_3b",note:"守护派声望+15，格罗·铁壁好感↑"}
 ]
};};
N["v57q_战士_fac_war_guard_3a"]=function(){return{
 sceneTitle:"守护派 · 抉择结果",
 text:[
  "你选了军法。老兵被除名那天，没有人送他。他走过城墙根时，站了一会儿，摸了摸那堵墙，走了。",
  "格罗·铁壁站在墙下，看着他的背影：「你按了规矩。规矩没错——可你记住，这堵墙挡了一百年，挡的从来不只是风。」",
  "他递给你一枚石片：「守护派的印。拿着。以后，你补的每一道缝，都得想清楚：你补它，是怕它倒，还是怕墙后的人淋雨。」",
  "你接过石片。它温的，像刚从墙身上取下来。"
 ],
 options:[
  {t:"接过石片",go:"event_hub",note:"已入守护派"}
 ]
};};
N["v57q_战士_fac_war_guard_3b"]=function(){return{
 sceneTitle:"守护派 · 抉择结果",
 text:[
  "你替他担下了。军棍落在你背上的时候，你咬着牙，没吭声。",
  "老兵跪在旁边，哭得像个孩子。格罗·铁壁站在一旁，看着你挨完棍，只说了一句：「这堵墙，记你一笔。」",
  "夜里你趴在床上，背火辣辣地疼。有人推门进来——是那个老兵，端着一碗热汤，放在你床头，没说话，走了。",
  "你喝那碗汤的时候，忽然觉得：这堵墙挡了一百年，挡的从来不只是风。",
  "格罗·铁壁第二天来找你，递给你一枚石片：「守护派的印。你记住了——替人挡，是会疼的。可疼过的人，才挡得住。」"
 ],
 options:[
  {t:"接过石片",go:"event_hub",note:"已入守护派"}
 ]
};};
/* 战士 · 征服派 */
N["v57q_战士_fac_war_conq_1"]=function(){return{
 sceneTitle:"征服派 · 入派试炼",
 text:[
  "征服派的地盘在演武场西侧——那里的地面全是脚印，深浅不一，像被马蹄反复踏过。喀兰·赤峰站在场中央，扛着一把断刀。",
  "「征服派的信条：强者生来就该开疆。」她把断刀插进土里，「你的试炼很简单——打赢我。就一招。」",
  "你握紧武器。她的刀断了，可她的眼睛没断——那双眼睛像一只站在高处的鹰，已经把你看穿了。",
  "她慢慢拔出断刀，刀刃映着日光：「来。让我看看，你骨子里是狼，还是羊。」"
 ],
 options:[
  {t:"拔刀，冲上去",go:"v57q_战士_fac_war_conq_2"}
 ]
};};
N["v57q_战士_fac_war_conq_2"]=function(){return{
 sceneTitle:"征服派 · 派系事件",
 text:[
  "你输了。只一招——她侧身避开你的冲势，断刀横过来，架在你颈侧。冰凉。",
  "她收回刀，看着你：「不错。你冲了——很多人在我面前不敢冲。你冲了，就还有救。」",
  "她把断刀扛回肩上：「征服派最近有个事。北境的兽潮，最近不大对——往年这时候该退了，今年还在涌。有人说，是有人在那边『养』它们。」",
  "她看你：「敢不敢去一趟北境？去看看，谁在养那些东西。征服派不打无准备的仗——你替我们把那边的情况摸回来。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_战士_fac_war_conq_3"}
 ]
};};
N["v57q_战士_fac_war_conq_3"]=function(){return{
 sceneTitle:"征服派 · 站队大抉择",
 text:[
  "你去了北境，蹲了半个月，摸清了：不是有人在养兽——是铁门关以西有条商路断了，商队绕道，惊动了兽群，兽群才一路往南涌。",
  "你回来，把情况告诉喀兰·赤峰。她听完，皱眉：「商路断，兽群涌——那这条商路，是谁断的？」",
  "你查出来，断商路的是北境一个小领主——他截了路，自己走私赚差价。",
  "喀兰·赤峰把断刀往桌上一拍：「你选：一，把情报交给军情处，让他们跟那个领主扯皮，扯半年。二，咱们自己去——把那条路，重新踩出来。踩路的时候，顺便让那个领主知道，断谁的路，谁就得断点什么。」"
 ],
 options:[
  {t:"交给军情处——按规矩来",go:"v57q_战士_fac_war_conq_3a",note:"征服派声望+5"},
  {t:"自己去——把路踩回来",go:"v57q_战士_fac_war_conq_3b",note:"征服派声望+15，喀兰·赤峰好感↑"}
 ]
};};
N["v57q_战士_fac_war_conq_3a"]=function(){return{
 sceneTitle:"征服派 · 抉择结果",
 text:[
  "你把情报交给了军情处。军情处核实了三个月，最后以「私设关卡」为由，罚了那个领主一笔钱。商路，还是在第四个月才通。",
  "喀兰·赤峰听完，没有骂你，只说：「你走了规矩。可你记住——规矩走到的时候，兽群已经涌了三个月，北境又添了三座空村。」",
  "她递给你一枚断刀穗：「征服派的印。拿着——征服不是抢，是开路。可开路的人，得先学会算：慢一步，要死多少人。」",
  "你接过刀穗。它在她手里磨得发亮，像一道反复走过的路。"
 ],
 options:[
  {t:"接过刀穗",go:"event_hub",note:"已入征服派"}
 ]
};};
N["v57q_战士_fac_war_conq_3b"]=function(){return{
 sceneTitle:"征服派 · 抉择结果",
 text:[
  "你跟着喀兰·赤峰去了北境。没有文书，没有旗号——就你们几个，连夜把那条断掉的商路，一脚一脚踩了出来。",
  "那个领主派人来拦。喀兰·赤峰站在路中央，断刀往地上一插：「这路，我们踩的。你要收过路费，先过我这把刀。」",
  "领主的人退走了。商路通了那天，有商队从路上过来，车轱辘压过新土，发出吱呀的响。",
  "喀兰·赤峰看着那支商队，忽然说：「征服派要的，不是疆土——是路。路通了，什么东西都活得起来。」",
  "她递给你一枚断刀穗：「征服派的印。你记住了——开路的人，脚底得有茧，心里得有数。」"
 ],
 options:[
  {t:"接过刀穗",go:"event_hub",note:"已入征服派"}
 ]
};};
/* 骑士 · 守誓派 */
N["v57q_骑士_fac_knight_oath_1"]=function(){return{tag:"branch",
 sceneTitle:"守誓派 · 入派试炼",
 text:[
  "守誓派的试炼在一间空屋子里。屋里只有一张桌、一支笔、一张纸。罗兰·白盾坐在桌后，像一尊石像。",
  "「守誓派的信条：一诺既出，万山无阻。」他说，「写下一个你立过的誓——最重的那一个。写完，不许改，不许涂。」",
  "你拿起笔。笔尖悬在纸上，你想起很多个说出口的「答应」。最后你写下一个名字——不是誓词，是一个人的名字。",
  "罗兰·白盾看着那个名字，没有问。他站起来，说：「誓立下了。你跟我来。」"
 ],
 options:[
  {t:"跟着他走",go:"v57q_骑士_fac_knight_oath_2"}
 ]
};};
N["v57q_骑士_fac_knight_oath_2"]=function(){return{tag:"branch",
 sceneTitle:"守誓派 · 派系事件",
 text:[
  "他带你去了一间暗室。墙上刻满了名字——每一个名字旁边，都有一道刻痕，有的深，有的浅。",
  "「这些是守誓派的老人立过的誓。」他说，「刻痕越深，守得越久。」",
  "他指着墙角一个新刻的名字：「这是老七。他立誓替一个寡妇送三年柴。送了一年半，他战死了。」",
  "他转头看你：「他死的时候，那寡妇还差一年半的柴。守誓派的规矩：人死了，誓还在。你替他去，把剩下的一年半，送完。」"
 ],
 options:[
  {t:"接下这件事",go:"v57q_骑士_fac_knight_oath_3"}
 ]
};};
N["v57q_骑士_fac_knight_oath_3"]=function(){return{tag:"branch",
 sceneTitle:"守誓派 · 站队大抉择",
 text:[
  "你给那寡妇送了半年柴。她渐渐认出了你——有一次她端水给你，问：「你是不是……替老七送的？」",
  "你说是。她没说什么，进了屋，拿出半篮鸡蛋：「给他家送去。他家老母还住在城北。」",
  "你拎着鸡蛋，站在她家门口，忽然意识到一件事：老七的誓，已经不只是「送柴」了——它长成了两条人命之间的往来。",
  "你回到守誓派，把鸡蛋的事告诉罗兰·白盾。他听完，看着你：「你选了送。现在你有两个选择：一，送满一年半，还了老七的誓，两清。二，继续送下去——把这件事，从『还誓』变成『你的誓』。」"
 ],
 options:[
  {t:"送满一年半，还清誓",go:"v57q_骑士_fac_knight_oath_3a",note:"守誓派声望+10"},
  {t:"继续送——这是我的誓了",go:"v57q_骑士_fac_knight_oath_3b",note:"守誓派声望+15，罗兰·白盾好感↑"}
 ]
};};
N["v57q_骑士_fac_knight_oath_3a"]=function(){return{tag:"branch",
 sceneTitle:"守誓派 · 抉择结果",
 text:[
  "你送满了剩下的一年半。最后一捆柴送到那天，寡妇站在门口，说：「替我谢谢老七。也替老七，谢谢你。」",
  "你回到暗室，在老七的名字旁边，刻下你送完的那道痕——不深不浅，刚好到。",
  "罗兰·白盾站在你身后：「誓还清了。你做得对——守誓的人，最要紧的是知道，誓有还完的那天。」",
  "他递给你一枚银环：「守誓派的印。记住——誓不是锁，是桥。桥走完了，就该松手。」"
 ],
 options:[
  {t:"接过银环",go:"event_hub",note:"已入守誓派"}
 ]
};};
N["v57q_骑士_fac_knight_oath_3b"]=function(){return{tag:"branch",
 sceneTitle:"守誓派 · 抉择结果",
 text:[
  "你说：「继续送。这不是还誓了——这是我自己立的誓。」",
  "罗兰·白盾看着你，沉默了很久，然后说：「你知道这意味着什么吗？老七的誓，你接过去了——从此它压在你身上，一直到你死，或者她死。」",
  "你说知道。",
  "他递给你一枚银环：「守誓派的印。你记住了——你刚才接过去的，不是一捆柴，是一个人没走完的路。走到底，才算还清。」",
  "你接过银环。它带着体温，像刚从别人手上摘下来。"
 ],
 options:[
  {t:"接过银环",go:"event_hub",note:"已入守誓派"}
 ]
};};
/* 骑士 · 解放派 */
N["v57q_骑士_fac_knight_free_1"]=function(){return{
 sceneTitle:"解放派 · 入派试炼",
 text:[
  "解放派的驻地在城郊的马场——那里养的不是战马，是退役的老马。伊莎·晨辉蹲在一匹老马面前，给它解蹄铁。",
  "「解放派的信条：誓约是人的，人不是誓约的。」她说，「你看这匹马——它替骑士团跑了十二年，退役了，蹄铁还钉着。它走路瘸，没人管。」",
  "她递给你一把钳子：「去，把它的蹄铁卸了。卸完，你再说你信什么。」",
  "老马温顺地站着，眼睛浑浊，蹄子点了点地。"
 ],
 options:[
  {t:"蹲下来，卸它的蹄铁",go:"v57q_骑士_fac_knight_free_2"}
 ]
};};
N["v57q_骑士_fac_knight_free_2"]=function(){return{
 sceneTitle:"解放派 · 派系事件",
 text:[
  "你卸下四只蹄铁。老马走了两步，先是一瘸，然后慢慢稳了——它踩在地上，像第一次认识自己的蹄子。",
  "伊莎·晨辉看着它走远，说：「它跑了十二年，早忘了没钉蹄铁的路是什么样。你也一样。」",
  "她站起来，看着你：「解放派最近有个事。骑士团有一批老兵的『誓约契』——服役期满，契不还。他们被拴着，走不了。」",
  "她递给你一份名单：「这上面的老兵，契都被扣着。你替我去要——记住，不是闹，是讲理。讲不通，再想别的办法。」"
 ],
 options:[
  {t:"接过名单",go:"v57q_骑士_fac_knight_free_3"}
 ]
};};
N["v57q_骑士_fac_knight_free_3"]=function(){return{
 sceneTitle:"解放派 · 站队大抉择",
 text:[
  "你拿着名单，去了骑士团的军需处。管契的书记官翻着册子，头也不抬：「契期未满，不还。这是规矩。」",
  "你翻出名单上的第一个名字——那个老兵，服役二十三年，契上写的期限早过了。书记官划了划算盘：「补三年的饷，契就还。」",
  "你站在军需处，那三年饷，是老兵的卖命钱。你可以按解放派的规矩——回去找伊莎·晨辉，让她出面施压，但那是「闹」，会牵连整个解放派；也可以自己想办法，凑那三年饷——但那是帮一个，救不了一群。",
  "书记官抬起头，等着你的回答。"
 ],
 options:[
  {t:"回去找伊莎出面——该闹就闹",go:"v57q_骑士_fac_knight_free_3a",note:"解放派声望+10"},
  {t:"自己想办法凑饷——先救一个算一个",go:"v57q_骑士_fac_knight_free_3b",note:"解放派声望+15，伊莎·晨辉好感↑"}
 ]
};};
N["v57q_骑士_fac_knight_free_3a"]=function(){return{
 sceneTitle:"解放派 · 抉择结果",
 text:[
  "伊莎·晨辉带着你，把名单拍在军需处案上。她没闹——她只是念名单，一个一个念，念到书记官脸色发白。",
  "契还了。七天之内，名单上的人，一个不少，全还了。",
  "有一个老兵领回契那天，当场烧了，说：「我不信誓约了——可我相信你们。」",
  "伊莎·晨辉看着那团烧起来的火，说：「解放派要的不是造反——是让人自己选，立不立誓。你记住了：誓约可以烧，选择不能没有。」",
  "她递给你一枚马蹄铁：「解放派的印。收好——它跟过一匹马十二年，它知道什么叫『卸下来』。」"
 ],
 options:[
  {t:"接过马蹄铁",go:"event_hub",note:"已入解放派"}
 ]
};};
N["v57q_骑士_fac_knight_free_3b"]=function(){return{
 sceneTitle:"解放派 · 抉择结果",
 text:[
  "你自己凑了那三年饷。钱交上去，契还回来——那个老兵接过契的时候，手在抖。",
  "你只救了一个。名单上还有二十三个。你站在军需处门口，第一次觉得「一个」这么沉。",
  "伊莎·晨辉听完，没有笑你傻：「你救了一个。可你记住——你救他的方式，是把自己折进去。解放派的路上，光靠一个人折，走不远。」",
  "她递给你一枚马蹄铁：「解放派的印。你记住了：一个人的仗，打完是功德；一群人的仗，打完才是路。」"
 ],
 options:[
  {t:"接过马蹄铁",go:"event_hub",note:"已入解放派"}
 ]
};};
/* 骑士 · 圣战派 */
N["v57q_骑士_fac_knight_crusade_1"]=function(){return{
 sceneTitle:"圣战派 · 入派试炼",
 text:[
  "圣战派的营地在城外——那里没有旗，只有一面巨大的战鼓。一个老骑士坐在鼓下，脸上的疤从眉骨划到下巴。",
  "「圣战派的信条：光所指处，皆是战场。」他说，「你的试炼——去，把那面鼓，敲响。敲到鼓心发烫为止。」",
  "你走过去，握住鼓槌。鼓面绷得很紧，像一面沉默的城墙。你一下一下地敲，起初声音发闷，后来渐渐亮起来。",
  "鼓声传开的时候，营地里的人一个接一个站起来，像被火点着了一样。"
 ],
 options:[
  {t:"继续敲，敲到鼓心发烫",go:"v57q_骑士_fac_knight_crusade_2"}
 ]
};};
N["v57q_骑士_fac_knight_crusade_2"]=function(){return{
 sceneTitle:"圣战派 · 派系事件",
 text:[
  "你敲到手臂发酸。老骑士按住你的手：「够了。鼓心热了——你也热了。」",
  "他带你去营地中央，那里埋着一把断剑。剑从中间断了，锈迹斑斑，只有剑柄还泛着亮。",
  "「这是上一任圣战派首领的剑。他死在北境——死的时候，剑断了，人站着。」他蹲下来，「圣战派最近有个事：北境的暗蚀会残部，在铁门关外立了个祭坛。夜夜有人哭，有人笑，还有人往里跳。」",
  "他看着你：「你替我去一趟。把那祭坛，拆了。记住——拆坛，不杀人。杀人的剑，和拆坛的剑，不是同一把。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_骑士_fac_knight_crusade_3"}
 ]
};};
N["v57q_骑士_fac_knight_crusade_3"]=function(){return{
 sceneTitle:"圣战派 · 站队大抉择",
 text:[
  "你到了铁门关外。祭坛不大，石头垒的，上面点着几盏绿火。守坛的是一群衣衫褴褛的人——不是暗蚀会的战士，是被蛊惑的流民。",
  "你站在祭坛前，拔出剑。那群流民看见剑，有的哭，有的跪，有的却往火里冲——像要去抢什么东西。",
  "你忽然明白了：这坛不是用来杀人的，是用来「吸」的——它吸走人的理智，让人自己走向火里。",
  "你可以一剑劈了祭坛——但劈的那一瞬，那些往火里冲的人，会跟着坛一起倒。也可以先救人，再拆坛——但那样，坛会多吸几炷香的时间。",
  "你握着剑，绿火映在你脸上。"
 ],
 options:[
  {t:"先劈坛——断根要紧",go:"v57q_骑士_fac_knight_crusade_3a",note:"圣战派声望+10"},
  {t:"先救人——坛可以晚一步",go:"v57q_骑士_fac_knight_crusade_3b",note:"圣战派声望+15"}
 ]
};};
N["v57q_骑士_fac_knight_crusade_3a"]=function(){return{
 sceneTitle:"圣战派 · 抉择结果",
 text:[
  "你一剑劈了祭坛。绿火四散，那群流民像被抽走了什么东西，一个接一个软倒——没有死，但都像大病一场。",
  "坛碎了，火灭了。你站在废墟上，看着那些倒下去的人，他们眼睛里还剩最后一层懵懂的光。",
  "老骑士听完，沉默很久：「坛拆了。可你记住——那些被你『断根』的人，醒来之后，会记不清自己为什么站在那里。那是你的剑留下的印。」",
  "他递给你一枚旧剑穗：「圣战派的印。拿着——圣战不是把一切烧干净，是烧干净之后，还得有人记得灰里埋着什么。」"
 ],
 options:[
  {t:"接过剑穗",go:"event_hub",note:"已入圣战派"}
 ]
};};
N["v57q_骑士_fac_knight_crusade_3b"]=function(){return{
 sceneTitle:"圣战派 · 抉择结果",
 text:[
  "你先救人。你冲进火里，一个一个拉出来——拉了七个，第八个怎么也不肯出来，他往坛心爬，像被什么东西牵着。",
  "你拉住他的脚。他回头，眼睛里没有光，只有绿的。你把他拽出来的时候，他咬了你的胳膊一口，咬得很深。",
  "坛多燃了两炷香。你拆坛的时候，手指被石沿划开，血渗进石缝。",
  "老骑士听完，点了点头：「你救的人，醒过来都记得你。圣战派要的就是这种——拆坛的手，得先救过人，才知道坛里埋的是什么。」",
  "他递给你一枚旧剑穗：「圣战派的印。记住——你胳膊上那道牙印，是今天最重的一课。」"
 ],
 options:[
  {t:"接过剑穗",go:"event_hub",note:"已入圣战派"}
 ]
};};
/* 游侠 · 护林派 */
N["v57q_游侠_fac_ranger_ward_1"]=function(){return{
 sceneTitle:"护林派 · 入派试炼",
 text:[
  "护林派住在古树区。贺·断弓坐在一棵老树的树根上，面前摊着一卷地图，图上画满了圈——全是近年枯死的树。",
  "「护林派的信条：树在，人在。」他说，「你的试炼——去，找一棵快枯死的树，救活它。救活，你再说你信什么。」",
  "他指给你一棵半枯的橡树。树干裂着口子，树皮剥落，只有最高的枝头还顶着几片黄叶。",
  "你走过去，蹲下来，摸着它裂开的皮。树皮粗糙，像一张没说完话的嘴。"
 ],
 options:[
  {t:"开始救它",go:"v57q_游侠_fac_ranger_ward_2"}
 ]
};};
N["v57q_游侠_fac_ranger_ward_2"]=function(){return{
 sceneTitle:"护林派 · 派系事件",
 text:[
  "你给它松土、引水、清腐。第七天，那几片黄叶没有落——反而绿了一层。",
  "你蹲在树下，忽然听见贺·断弓的声音：「救活了。你信了。」",
  "他走过来，也蹲下，看着那几片叶子：「护林派最近有个事。东边的银杉林，最近成片成片地枯——不是虫，不是旱。有人说是地下的『东西』在吸。你去看看，到底是谁在吸。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_游侠_fac_ranger_ward_3"}
 ]
};};
N["v57q_游侠_fac_ranger_ward_3"]=function(){return{
 sceneTitle:"护林派 · 站队大抉择",
 text:[
  "你去了银杉林。枯死的树连成一片，根部发黑，像被什么东西从底下抽干了。你沿着黑根挖下去，挖到一截埋在地下的石柱——柱上刻着旧纹，是暗蚀会的「汲」字纹。",
  "石柱连着整片林的根。你明白了：有人在用这片林子的命，喂那根柱子。",
  "你回到古树区，把石柱的事告诉贺·断弓。他听完，很久没说话。",
  "「石柱不能留，可挖它的时候，会惊动底下连着的东西。」他说，「你可以带人连夜挖——挖得急，林子的根会断三成；或者，慢慢拆——拆得稳，可那柱子，会多吸十天。」"
 ],
 options:[
  {t:"连夜挖——断根快，伤林重",go:"v57q_游侠_fac_ranger_ward_3a",note:"护林派声望+10"},
  {t:"慢慢拆——保住根，多吸十天",go:"v57q_游侠_fac_ranger_ward_3b",note:"护林派声望+15，贺·断弓好感↑"}
 ]
};};
N["v57q_游侠_fac_ranger_ward_3a"]=function(){return{
 sceneTitle:"护林派 · 抉择结果",
 text:[
  "你带人连夜挖了石柱。柱子倒下的那一瞬，整片林子的地面震了一下——枯树成片地倒，可活着的那些，根保住了。",
  "断了三成。银杉林少了三成。你站在林子里，看着那些倒下的树，它们像一群躺下的老人。",
  "贺·断弓站在你身边：「你挖得对——断三成，保七成。护林派记住你这一铲。」",
  "他递给你一枚木片：「护林派的印。记住——护林不是不砍树，是砍的时候，知道哪棵该留，哪棵该倒。」"
 ],
 options:[
  {t:"接过木片",go:"event_hub",note:"已入护林派"}
 ]
};};
N["v57q_游侠_fac_ranger_ward_3b"]=function(){return{
 sceneTitle:"护林派 · 抉择结果",
 text:[
  "你选了慢慢拆。你每天拆一段纹路，拆了十天——石柱上的「汲」字纹，一点点淡下去。",
  "第十一天，柱子空了。它塌进土里，像一具被抽干的壳。",
  "可那十天里，林子又枯了七棵。你站在那七棵新枯的树前，手指摸过它们干裂的皮，很久没说话。",
  "贺·断弓走过来：「你护住了根。可你记住了——慢慢拆的那十天，你是在拿树的命，换拆的稳。护林的人，每天都在算这种账。」",
  "他递给你一枚木片：「护林派的印。记住——你算的每一笔账，树都记着。」"
 ],
 options:[
  {t:"接过木片",go:"event_hub",note:"已入护林派"}
 ]
};};
/* 游侠 · 狩猎派 */
N["v57q_游侠_fac_ranger_hunt_1"]=function(){return{
 sceneTitle:"狩猎派 · 入派试炼",
 text:[
  "狩猎派的哨站在峡谷口。艾琳·逐风坐在一块高石上，膝上横着弓，弓弦是新换的，泛着冷光。",
  "「狩猎派的信条：荒野不问慈悲，只问准头。」她说，「你的试炼——前面那只白鹿，射它的右前腿。要留活口，不许射死。」",
  "你抬头看。百步外，一头白鹿正低头饮水，浑然不觉。风吹过来，它耳朵动了动。",
  "你搭上箭。弓弦在你指间绷紧，像一根拉到极致的线。"
 ],
 options:[
  {t:"瞄准，松弦",go:"v57q_游侠_fac_ranger_hunt_2"}
 ]
};};
N["v57q_游侠_fac_ranger_hunt_2"]=function(){return{
 sceneTitle:"狩猎派 · 派系事件",
 text:[
  "箭中了——擦着白鹿的腿毛过去，钉在泥里。白鹿受惊，纵身跃入灌木，转眼不见了。",
  "艾琳·逐风从石上跳下来，看着那支钉在泥里的箭：「偏了半寸。留活口是留住了，可你的手，在松弦那一瞬抖了一下——你不想射它。」",
  "她拔起箭，递还给你：「狩猎派最近有个事。峡谷西边，有人猎了一头母狼——不是为吃，是剥皮卖钱。母狼的崽还活着，在窝里嗷嗷叫。你替我去一趟，把那窝崽子，带回来。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_游侠_fac_ranger_hunt_3"}
 ]
};};
N["v57q_游侠_fac_ranger_hunt_3"]=function(){return{
 sceneTitle:"狩猎派 · 站队大抉择",
 text:[
  "你找到那窝狼崽——三只，饿得皮包骨，蜷在窝里，见你来，喉咙里发出细弱的呜咽。",
  "你蹲下来，把它们一只一只放进怀里。转身的时候，你听见灌木后传来粗重的喘息——是那头母狼的同伴，一头公狼，正盯着你。",
  "它没有扑过来。它只是盯着你怀里的崽子，喉咙里滚着低沉的声响。",
  "你可以带着崽子走——它会记恨，从此这片峡谷的狼，见人就躲。也可以把崽子放下，等公狼自己来叼走——但它们已经饿得走不动了。",
  "你站在灌木前，怀里三只崽子在发抖。公狼的眼睛，绿得像两盏灯。"
 ],
 options:[
  {t:"带崽子走——它们活着要紧",go:"v57q_游侠_fac_ranger_hunt_3a",note:"狩猎派声望+15"},
  {t:"放下崽子——让它们回到荒野",go:"v57q_游侠_fac_ranger_hunt_3b",note:"狩猎派声望+10"}
 ]
};};
N["v57q_游侠_fac_ranger_hunt_3a"]=function(){return{
 sceneTitle:"狩猎派 · 抉择结果",
 text:[
  "你抱着崽子走了。公狼没有追，它站在原处，看着你的背影，喉咙里的声音慢慢低下去。",
  "你把崽子带回收养。它们喝奶、长大、学会扑咬——你教它们狩猎，像教自己的孩子。",
  "可你每次进峡谷，都觉得那双绿眼睛在看着你。不是恨，是记住——记住有人带走了它的孩子。",
  "艾琳·逐风听完，没有评价，只说了句：「你救了它们。可你记住了——荒野的账，一笔一笔，都记着。」",
  "她递给你一枚箭簇：「狩猎派的印。收好——你教它们狩猎，它们会替你，守这片峡谷。」"
 ],
 options:[
  {t:"接过箭簇",go:"event_hub",note:"已入狩猎派"}
 ]
};};
N["v57q_游侠_fac_ranger_hunt_3b"]=function(){return{
 sceneTitle:"狩猎派 · 抉择结果",
 text:[
  "你把崽子放下，退后十步。公狼徐徐走上前，先舔了舔最瘦的那只，然后叼起它，回头看你一眼——那一眼，没有恨，只有一种奇异的确认。",
  "它一只一只叼走了三只崽子。消失在灌木深处之前，它又回头看了你一眼。",
  "你站在原地，怀里空了，可心里没有空。你忽然明白：有些「救」，是把它们还回它们该在的地方。",
  "艾琳·逐风听完，点了点头：「你放了它们。可你记住——它们会记得你放下它们的那双手。荒野的恩，比箭慢，比箭久。」",
  "她递给你一枚箭簇：「狩猎派的印。收好——你学会了：猎人的最高一箭，是不射的那一箭。」"
 ],
 options:[
  {t:"接过箭簇",go:"event_hub",note:"已入狩猎派"}
 ]
};};
/* 游侠 · 共生派 */
N["v57q_游侠_fac_ranger_symb_1"]=function(){return{
 sceneTitle:"共生派 · 入派试炼",
 text:[
  "共生派住在湿地——那里的房子建在树上，底下是沼泽，青蛙和鹭鸶是邻居。霜辉蹲在屋前的木台上，正给一只断翅的鹭鸶固定翅膀。",
  "「共生派的信条：人兽草木，都是荒野的住户。」她说，「你的试炼——去，给这只鹭鸶喂食。它怕人。你得让它，先不怕你。」",
  "鹭鸶缩在角落，脖子绷直，眼睛圆圆的，盯着你手里的鱼。",
  "你蹲下来，把鱼放在离它一步远的地方。它没有动。你们就这样，隔着一步，互相看着。"
 ],
 options:[
  {t:"把鱼放近一步，等它",go:"v57q_游侠_fac_ranger_symb_2"}
 ]
};};
N["v57q_游侠_fac_ranger_symb_2"]=function(){return{
 sceneTitle:"共生派 · 派系事件",
 text:[
  "你放了三天鱼。第三天，鹭鸶终于伸头，从你手边叼走了那条鱼——它啄你指尖的时候，轻的，像试探，又像道谢。",
  "霜辉看着这一幕，笑了：「它认你了。共生派，认你了。」",
  "可她的笑很快收起来：「湿地最近有个事。南边来了一伙人，要填这片沼泽——说是『荒地变良田』。他们不知道，这片沼泽养着整条河的鱼，还有鹭鸶、水獭、芦苇。你替我去看看——他们填到哪儿了。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_游侠_fac_ranger_symb_3"}
 ]
};};
N["v57q_游侠_fac_ranger_symb_3"]=function(){return{
 sceneTitle:"共生派 · 站队大抉择",
 text:[
  "你去了南边。那伙人已经填了小半片沼泽——推土车压过的地方，芦苇倒了，水黑了，鹭鸶飞得远远的。",
  "领头的是个中年男人，晒得黝黑，看见你，递了碗水：「小兄弟，这片地填好了，能种三年的粮，够养半个镇子的人。」",
  "你站在压实的土上，脚下已经没有水了。远处，那只鹭鸶还在盘旋，落不下来。",
  "你可以拦——把这片沼泽从他们手里「要」回来，可他们要种的那半个镇子，确实缺粮。也可以让他们填——可湿地没了，下游的鱼、水、芦苇，全都没了。",
  "中年男人等着你的回答。你脚下的土，是干的。"
 ],
 options:[
  {t:"拦下来——湿地比良田贵",go:"v57q_游侠_fac_ranger_symb_3a",note:"共生派声望+15"},
  {t:"让一步——人也要吃饭",go:"v57q_游侠_fac_ranger_symb_3b",note:"共生派声望+10"}
 ]
};};
N["v57q_游侠_fac_ranger_symb_3a"]=function(){return{
 sceneTitle:"共生派 · 抉择结果",
 text:[
  "你拦了下来。你带着他们看了湿地的下游——看那条靠湿地养活的河，看河两岸靠鱼吃饭的村子。",
  "中年男人蹲在河边，看了很久，最后说：「我们没想过……这滩水，养着这么多人。」",
  "他们停了工。后来，你帮他们在湿地边缘开了几块田——不填沼，只借边。粮少些，但鱼还在，水还在。",
  "霜辉站在屋前，鹭鸶落回她肩头：「你记住了——共生不是拦着人不吃饭，是让人看见，谁跟他们一张桌子吃饭。」",
  "她递给你一枚鹭羽：「共生派的印。收好——它认得你。」"
 ],
 options:[
  {t:"接过鹭羽",go:"event_hub",note:"已入共生派"}
 ]
};};
N["v57q_游侠_fac_ranger_symb_3b"]=function(){return{
 sceneTitle:"共生派 · 抉择结果",
 text:[
  "你让了一步——让他们填了靠南的那一角，约好不再往里推。",
  "填完的那天，你站在新田边，看着鹭鸶绕开那片地，往北飞。它落回来的时候，带着一身泥。",
  "霜辉没有说你错：「人也要吃饭。你让的那一角，换来了他们不再往里填的承诺——这桩买卖，共生派做得。」",
  "她递给你一枚鹭羽：「共生派的印。记住——共生不是不争，是争的时候，知道给谁留一角。」"
 ],
 options:[
  {t:"接过鹭羽",go:"event_hub",note:"已入共生派"}
 ]
};};


/* ===== v57inj:factionNodes1 ===== */
/* 魔法师 · 守秘派 */
N["v57q_魔法师_fac_mage_keep_1"]=function(){return{
 sceneTitle:"守秘派 · 入派试炼",
 text:[
  "守秘派的老藏书室，钥匙挂在洛·晨雾腰间。他带你在书架间走了一遍，每一本都停了停。",
  "「守秘不是藏着。」他说，「是替还没准备好的人，先看着。」",
  "他在一排书前停下，抽出一本，翻开：「这本讲元素共鸣的旧伤。你读三页，然后告诉我——该不该让别人读。」",
  "你接过书，纸页很旧，带着一股陈墨的气味。你读了三页，合上，想了很久。"
 ],
 options:[
  {t:"该读——知识不该因危险而禁",go:"v57q_魔法师_fac_mage_keep_2"},
  {t:"暂不该读——会伤到读它的人",go:"v57q_魔法师_fac_mage_keep_2"}
 ]
};};
N["v57q_魔法师_fac_mage_keep_2"]=function(){return{
 sceneTitle:"守秘派 · 派系事件",
 text:[
  "洛·晨雾听完你的回答，把书放回原位。「答案不重要，重要的是你会先『想』——守秘派要的就是这种人。」",
  "他带你去了一间密室。密室里没有书——只有一面墙，墙上挂着一排钥匙，每一把都对应一个「封禁」的条目。",
  "「三天前，学院地下一层有人撬锁。」他说，「撬的是『第七印注疏』那间。钥匙没丢，但锁上有新痕。」",
  "他看你：「你是新人。新人有个好处——不认识这里的人。替我去看看，最近谁在打听那间屋子。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_魔法师_fac_mage_keep_3"}
 ]
};};
N["v57q_魔法师_fac_mage_keep_3"]=function(){return{
 sceneTitle:"守秘派 · 站队大抉择",
 text:[
  "你查了三天。线索指向一个借阅记录——有人连着三天，借的都是「封印与元素」类的书。借阅人署名：一个二年级的见习法师。",
  "你把这个名字交给洛·晨雾。他看了很久，没有接话。",
  "「你知道吗。」他忽然说，「那孩子，是我妹妹的儿子。」",
  "他抬起头，看着你：「你查到他了。现在你选择：把这个名字报上去——他会失去进学院深造的资格；或者，你替他瞒下这次，我来处理。」",
  "你站在密室里，看着那面挂满钥匙的墙。每一把钥匙，都像一个等待抉择的日子。"
 ],
 options:[
  {t:"如实上报——规矩就是规矩",go:"v57q_魔法师_fac_mage_keep_3a",note:"守秘派声望+15"},
  {t:"替他瞒下——人比规矩重",go:"v57q_魔法师_fac_mage_keep_3b",note:"守秘派声望+5，洛·晨雾好感↑"}
 ]
};};
N["v57q_魔法师_fac_mage_keep_3a"]=function(){return{
 sceneTitle:"守秘派 · 抉择结果",
 text:[
  "你把名字报了上去。洛·晨雾听完，点了点头，没有再说那孩子的事。",
  "三天后，你听说那个见习法师被调去了北境的观测站——不是开除，是「换个环境」。",
  "你路过老藏书室，洛·晨雾在门边站着，像在等你。他说：「你做了守秘派该做的事。可你记住——守秘的人，手里攥的是别人的命。攥得稳，也得攥得轻。」",
  "他给了你一枚旧钥匙：「这是守秘派的印。以后，你也是看门人之一了。」"
 ],
 options:[
  {t:"接过钥匙",go:"academy_elda_hub",note:"已入守秘派"}
 ]
};};
N["v57q_魔法师_fac_mage_keep_3b"]=function(){return{
 sceneTitle:"守秘派 · 抉择结果",
 text:[
  "你说：「瞒下他这次。我来处理。」",
  "洛·晨雾看了你很久，然后叹了口气了口气：「你知道吗，我年轻时候，也替你做过一次这样的选择。」",
  "他没有问你打算怎么处理。他给了你一枚旧钥匙：「这是守秘派的印。记住——你刚才护住的，不是一个人，是你自己心里那杆秤。」",
  "你接过钥匙。钥匙是凉的，可你握着，觉得心里那个位置，是热的。"
 ],
 options:[
  {t:"接过钥匙",go:"academy_elda_hub",note:"已入守秘派"}
 ]
};};
/* 魔法师 · 开明派 */
N["v57q_魔法师_fac_mage_open_1"]=function(){return{
 sceneTitle:"开明派 · 入派试炼",
 text:[
  "开明派的宣讲台设在学院广场，没有门。奥薇恩·星语站在台边，身边摆着一筐书，任人取阅。",
  "「开明派的规矩很简单。」她说，「知识不设防——你想看，就拿；看不懂，就问。」",
  "她从筐里取出一卷，递给你：「这是『元素通论』的通俗版。你拿去，给学院门口那个卖花的孩子讲讲——讲到他听懂为止。」",
  "你接过书。卖花的孩子？你想起门口确实有个总冲你笑的小丫头。"
 ],
 options:[
  {t:"接下这卷书",go:"v57q_魔法师_fac_mage_open_2"}
 ]
};};
N["v57q_魔法师_fac_mage_open_2"]=function(){return{
 sceneTitle:"开明派 · 派系事件",
 text:[
  "你花了一下午，把「元素通论」讲给卖花的小丫头听。她似懂非懂，却问了一个你答不上来的问题：「火为什么要听人的话呀？」",
  "你回去问奥薇恩。她笑了：「这就是开明派的用处——你讲出去的知识，会带着别人的问题回来，逼你再想一层。」",
  "可第二天，你听说开明派的书筐被人烧了——夜里，有人往筐里泼了灯油。书烧了一半，留下一地焦页。",
  "奥薇恩蹲在焦页前，捡起一张没烧透的，吹了吹灰：「守秘派干的？不至于。可这味道——像学院里自己人干的。」"
 ],
 options:[
  {t:"帮她查这桩纵火",go:"v57q_魔法师_fac_mage_open_3"}
 ]
};};
N["v57q_魔法师_fac_mage_open_3"]=function(){return{
 sceneTitle:"开明派 · 站队大抉择",
 text:[
  "你查了两天，查到纵火的是一个三年级的学徒——他在「开明派公开课」上被驳得下不来台，怀恨在心。",
  "你站在奥薇恩面前，把名字说了。她听完，沉默了一会儿。",
  "「那孩子，去年差点被退学，是我保下来的。」她说，「现在，他烧了我的书。」",
  "她看着你：「你选：按学院规矩，纵火是重罪，他会除名；或者，我当没查到你——让他来我这儿，抄三年书抵罪。」",
  "你站在烧焦的书筐前，空气里还留着烟火味。"
 ],
 options:[
  {t:"按规矩办——烧书的代价他该担",go:"v57q_魔法师_fac_mage_open_3a",note:"开明派声望+15"},
  {t:"让他抄书抵罪——路要给人留着",go:"v57q_魔法师_fac_mage_open_3b",note:"开明派声望+10，奥薇恩好感↑"}
 ]
};};
N["v57q_魔法师_fac_mage_open_3a"]=function(){return{
 sceneTitle:"开明派 · 抉择结果",
 text:[
  "你选了规矩。那孩子被除名那天，站在学院门口，谁也没看，走了。",
  "奥薇恩没有说你错。她只是把烧焦的书筐收拾好，换了一只新的：「开明不是没底线。你守了底线——这筐书，明天还会摆回来。」",
  "她给了你一枚铜书签：「开明派的印。记住——你把门开得再大，也得记得，门框在哪儿。」",
  "你接过书签。它是新的，带着铜的味道。"
 ],
 options:[
  {t:"收好书签",go:"academy_elda_hub",note:"已入开明派"}
 ]
};};
N["v57q_魔法师_fac_mage_open_3b"]=function(){return{
 sceneTitle:"开明派 · 抉择结果",
 text:[
  "你选了抄书。那孩子来抄书那天，站在你面前，低着头，脸涨得通红。",
  "奥薇恩让他先抄第一页。他握着笔，抖了半天，才落下第一个字。",
  "你站在旁边，没有走。你忽然觉得，这间被烧过的书室里，多了一页正在慢慢写上的字。",
  "奥薇恩给了你一枚铜书签：「开明派的印。你记住了——书烧了可以再买，人废了，就真废了。」"
 ],
 options:[
  {t:"收好书签",go:"academy_elda_hub",note:"已入开明派"}
 ]
};};
/* 魔法师 · 禁忌派 */
N["v57q_魔法师_fac_mage_tabu_1"]=function(){return{
 sceneTitle:"禁忌派 · 入派试炼",
 text:[
  "禁忌派没有门牌。你按约定，在禁书区三层的暗格里，找到一卷没封皮的手抄本。",
  "扉页上只有一行字：「被禁的，才是最重要的。」下面还有一行小字：「读吧。但别告诉任何人，你来过这里。」",
  "你翻开第一页——里面记的，是学院从来没有教过的元素共鸣「旧伤」篇。字迹很工整，像抄的人，抄了很多遍。",
  "你合上书，听见走廊尽头有脚步声。是巡夜的执事，越来越近。"
 ],
 options:[
  {t:"把书放回暗格，若无其事地离开",go:"v57q_魔法师_fac_mage_tabu_2"}
 ]
};};
N["v57q_魔法师_fac_mage_tabu_2"]=function(){return{
 sceneTitle:"禁忌派 · 派系事件",
 text:[
  "你走出禁书区，执事与你擦肩而过，没有看你。你松了口气——但第二天，你发现枕边多了一张纸条：「你翻到第二页了吗？」",
  "禁忌派找上了你。你按纸条上的指引，在图书馆天台上见到了伊尔·灰书——他坐在护栏上，像一只落灰的猫头鹰。",
  "「禁忌派不问出身。」他说，「只问一件事：你敢不敢读不该读的。」",
  "他扔给你一卷书：「这是『封印注疏』的残页。学院把这卷书锁了二十年。你读——读完了告诉我，锁它对不对。」"
 ],
 options:[
  {t:"接过残页，读下去",go:"v57q_魔法师_fac_mage_tabu_3"}
 ]
};};
N["v57q_魔法师_fac_mage_tabu_3"]=function(){return{
 sceneTitle:"禁忌派 · 站队大抉择",
 text:[
  "你读了那卷残页。纸上记的，是二十年前一次失败的封印实验——七个封印者，活了三个。卷末有人批注：「此路不通。除非——有人愿意走完剩下的路。」",
  "你合上残页，站在天台上。伊尔·灰书看着你：「读完了。现在，你选。」",
  "「一：把残页交还给学院——你当作没读过，禁忌派从此不再找你。」",
  "「二：留着它——你接住禁忌派的印。以后，学院锁什么，我们读什么。锁错的地方，我们记着。」",
  "风从塔顶灌过来，残页在你手里，纸角卷了又平。"
 ],
 options:[
  {t:"交还残页——有些门不该开",go:"v57q_魔法师_fac_mage_tabu_3a",note:"禁忌派声望+5"},
  {t:"留着它——锁着的真相需要人看",go:"v57q_魔法师_fac_mage_tabu_3b",note:"禁忌派声望+15，伊尔·灰书好感↑"}
 ]
};};
N["v57q_魔法师_fac_mage_tabu_3a"]=function(){return{
 sceneTitle:"禁忌派 · 抉择结果",
 text:[
  "你把残页交还给伊尔·灰书。他接过去，没有看你，只说：「可惜。但也对——有些门，确实不该开。」",
  "他跳下护栏，走了几步，又停住：「你读了，却没留下。这比从没读过的，难得多。禁忌派记你这份。」",
  "他消失在楼梯口。你站在天台上，风还灌着。你握了握空手，觉得今天的风，格外凉。"
 ],
 options:[
  {t:"走下天台",go:"academy_elda_hub"}
 ]
};};
N["v57q_魔法师_fac_mage_tabu_3b"]=function(){return{
 sceneTitle:"禁忌派 · 抉择结果",
 text:[
  "你说：「留着它。锁着的真相，总得有人看。」",
  "伊尔·灰书笑了——笑得像一只终于等到猎物的老猫头鹰。「好。」他从怀里摸出一枚黑铁书签，抛给你，「禁忌派的印。记住——你读的东西，迟早有人问你『你怎么知道』。答不上来，就别说。」",
  "你接过黑铁书签。它很薄，带着一层凉意，像刚从某个锁了很久的地方取出来。",
  "你把它收进怀里。风从塔顶灌过来，你站在那里，第一次觉得自己站在了「知道」和「不能说」之间。"
 ],
 options:[
  {t:"收好书签，走下天台",go:"academy_elda_hub",note:"已入禁忌派"}
 ]
};};
/* 灵魂法师 · 守望派 */
N["v57q_灵魂法师_fac_soul_watch_1"]=function(){return{tag:"branch",
 sceneTitle:"守望派 · 入派试炼",
 text:[
  "守望派的灯廊深处，有一面「未点之灯」的墙。澜·梦墟站在墙前，手里捧着一盏没点着的灯。",
  "「守望派守的，不是已经点亮的灯。」她说，「是那些还没人记的亡者——他们走得太安静，安静到差点没人记得。」",
  "她把空灯递给你：「去。去城西的旧码头，找一个姓陈的老船工。他去年冬天走了，没儿没女，没人给他点灯。你替他，点一盏。」",
  "你接过空灯。灯身是凉的，像在等一个人名。"
 ],
 options:[
  {t:"接过灯，去旧码头",go:"v57q_灵魂法师_fac_soul_watch_2"}
 ]
};};
N["v57q_灵魂法师_fac_soul_watch_2"]=function(){return{tag:"branch",
 sceneTitle:"守望派 · 派系事件",
 text:[
  "你找到旧码头。老船工陈伯的棚屋还空着，门板半掩。你推门进去，屋里只有一张床、一口锅、一摞旧船票。",
  "你翻那摞船票——每张都叠得整整齐齐，票背写着一个日期。最后一张，是他走的那天。",
  "你替他点了灯，放在床头。灯亮起来的时候，你忽然听见门外有响动——一个年轻妇人探头进来，看见灯，愣住了。",
  "「这灯……」她声音发颤，「我爹说，他走以后，会有人记得他。原来是真的。」"
 ],
 options:[
  {t:"把灯交到她手里",go:"v57q_灵魂法师_fac_soul_watch_3"}
 ]
};};
N["v57q_灵魂法师_fac_soul_watch_3"]=function(){return{tag:"branch",
 sceneTitle:"守望派 · 站队大抉择",
 text:[
  "那妇人是陈伯失散多年的女儿。她嫁去了南港，赶回来时，爹已经走了半个月。",
  "她捧着那盏灯，哭着说了很多。末了，她问你：「这灯，是你点的？你是谁家的？」",
  "你忽然意识到——守望派的规矩：点灯的人，不留名。灯是亡者的，不是点灯人的。",
  "你站在棚屋里，灯焰跳了一下。她还在等你回答。你可以告诉她你的名字，让她记你一份恩；也可以只说「路过」。",
  "灯焰又跳了一下。像在替那个沉默的老人，等着你的回答。"
 ],
 options:[
  {t:"告诉她你的名字——恩情该有主",go:"v57q_灵魂法师_fac_soul_watch_3a",note:"守望派声望+10"},
  {t:"只说路过——灯是亡者的",go:"v57q_灵魂法师_fac_soul_watch_3b",note:"守望派声望+15，澜·梦墟好感↑"}
 ]
};};
N["v57q_灵魂法师_fac_soul_watch_3a"]=function(){return{tag:"branch",
 sceneTitle:"守望派 · 抉择结果",
 text:[
  "你告诉了她你的名字。她把你名字念了两遍，说会记一辈子。",
  "你回灯廊复命。澜·梦墟听完，没有评判，只说：「你让灯有了主人——也让自己有了牵挂。守望派认这份。」",
  "她给了你一枚灯形胸针：「守望派的印。记住——你点的灯越多，记得你的人也越多。这是守望派的路，也是守望派的债。」",
  "你接过胸针。它很轻，像一片落进掌心的灯焰。"
 ],
 options:[
  {t:"收好胸针",go:"academy_elda_hub",note:"已入守望派"}
 ]
};};
N["v57q_灵魂法师_fac_soul_watch_3b"]=function(){return{tag:"branch",
 sceneTitle:"守望派 · 抉择结果",
 text:[
  "你说：「路过。这灯是陈伯的，不是我点的——我只是替他，把灯拿回来。」",
  "她捧着灯，看了你很久，最后没有追问。她跪下，给灯磕了三个头。",
  "你回灯廊。澜·梦墟听完，罕见地笑了：「守望派要的就是这个——灯是亡者的，名是亡者的，我们只是替世界，记得他们。」",
  "她给了你一枚灯形胸针：「守望派的印。收好——它记得你今天说的那句『路过』。」"
 ],
 options:[
  {t:"收好胸针",go:"academy_elda_hub",note:"已入守望派"}
 ]
};};
/* 灵魂法师 · 渡魂派 */
N["v57q_灵魂法师_fac_soul_ferry_1"]=function(){return{
 sceneTitle:"渡魂派 · 入派试炼",
 text:[
  "渡魂派在圣殿的地下——那里没有灯廊，只有一条通向「静河」的斜坡。乌·森站在河边，手里没有灯，只有一根黑杖。",
  "「守望派点灯，渡魂派摆渡。」他说，「灯留人，河送人。两派吵了几百年，其实争的是同一件事：人死后，该被记着，还是该被送走。」",
  "他指了指河上一条无人小船：「去。河对岸有个迷路的魂，等了七天了。你送他过去——记住，别跟他说话，别问他名字。」",
  "你踏上小船。河水黑得像墨，桨声一响，像在替谁开门。"
 ],
 options:[
  {t:"撑船过河",go:"v57q_灵魂法师_fac_soul_ferry_2"}
 ]
};};
N["v57q_灵魂法师_fac_soul_ferry_2"]=function(){return{
 sceneTitle:"渡魂派 · 派系事件",
 text:[
  "对岸站着一个模糊的身影——看不清脸，像隔着一层水雾。他看见你的船，自己走了上来，坐在船头，没有说话。",
  "你撑船往回。河面很静，静得能听见水珠从桨上滴落。你记着乌·森的话，没有开口。",
  "可快到岸时，那身影忽然转过头，问了一句：「她……还在等我吗？」",
  "声音很轻，像一个等了很多年的人，终于忍不住问出口。你握着桨，河水在船底流着。你可以装作没听见——也可以回答他一句「在」或「不在」。"
 ],
 options:[
  {t:"沉默——渡魂的规矩不可破",go:"v57q_灵魂法师_fac_soul_ferry_3",note:"渡魂派声望+15"},
  {t:"回他一句「在」——他等得够久了",go:"v57q_灵魂法师_fac_soul_ferry_3b",note:"渡魂派声望+5"}
 ]
};};
N["v57q_灵魂法师_fac_soul_ferry_3"]=function(){return{
 sceneTitle:"渡魂派 · 站队大抉择",
 text:[
  "你撑船靠岸，那身影下了船，没有再说一句话。他走进岸上的雾里，消失之前，回头看了一眼——没有怨，只有一点空。",
  "乌·森站在岸边，全程看着。他走到你面前：「你没有回答他。渡魂派记你这一桨。」",
  "可他又说：「你知道吗，那魂等的那个人，去年冬天已经走了——他等的，是一句永远不会来的『在』。」",
  "他看着你：「你现在知道了。后悔吗？记住，渡魂的人，可以知道答案，但不能说。这是规矩，也是慈悲——有些话，说了，魂就渡不过去了。」",
  "他递给你一枚黑杖头：「渡魂派的印。以后，你撑的每一船，都带着今天这一桨的重量。」"
 ],
 options:[
  {t:"接过杖头",go:"academy_elda_hub",note:"已入渡魂派"}
 ]
};};
N["v57q_灵魂法师_fac_soul_ferry_3b"]=function(){return{
 sceneTitle:"渡魂派 · 抉择结果",
 text:[
  "你回了那句「在」。那身影在船头坐了很久，然后下了船，走进雾里。你看见他走的时候，步子比来时轻。",
  "乌·森走到你面前，沉默了很久：「你说了。渡魂派不罚你——但你记住：你今天说的那句『在』，会让他把等，换成找。他要找的那个人，已经走了。他会找很久，找得很苦。」",
  "你握着桨，河水在脚下流。你忽然有些分不清，自己那句「在」，是渡了他，还是害了他。",
  "乌·森递给你一枚黑杖头：「渡魂派的印。你知道了——渡魂的路，没有一句话是轻的。」"
 ],
 options:[
  {t:"接过杖头",go:"academy_elda_hub",note:"已入渡魂派"}
 ]
};};
/* 灵魂法师 · 离世派 */
N["v57q_灵魂法师_fac_soul_leave_1"]=function(){return{
 sceneTitle:"离世派 · 入派试炼",
 text:[
  "离世派没有驻地。雷·娜约你在圣殿外的荒坡见面——她坐在一块石碑上，面前摊着一张地图，上面画满了叉。",
  "「离世派不点灯，不摆渡。」她说，「我们只做一件事：拆灯。魂灯拴住的人太多了——有些魂，被灯留了几十年，走不了。」",
  "她指着一个叉：「这儿，城东老宅。有个老太太，死了四十年，魂灯还亮着——她儿子每年都去添油。她想走，走不了。」",
  "她把一枚铜钉递给你：「去。把那盏灯，钉灭。」"
 ],
 options:[
  {t:"接过铜钉",go:"v57q_灵魂法师_fac_soul_leave_2"}
 ]
};};
N["v57q_灵魂法师_fac_soul_leave_2"]=function(){return{
 sceneTitle:"离世派 · 派系事件",
 text:[
  "你到了城东老宅。灯在祠堂里，供着一排牌位。那盏魂灯放在最中间，灯芯细得像一根头发，却烧得很稳。",
  "你举起铜钉，对准灯芯。可你听见祠堂外有脚步声——一个佝偻的老人走进来，提着油壶，动作很慢。",
  "他看见你手里的铜钉，愣了一下，然后说：「你……是来灭灯的？」",
  "他没有喊人，也没有夺钉。他只是走过去，给那盏灯添了一勺油：「四十年了。我娘走那天，说怕黑。我给她点了这盏灯——我怕她一个人，在那边找不到路。」",
  "他添完油，直起身，看着你：「你灭吧。灭了我也不怪你——只是，让我再添这一次。」"
 ],
 options:[
  {t:"收起铜钉——这灯不能灭",go:"v57q_灵魂法师_fac_soul_leave_3",note:"离世派声望+5"},
  {t:"钉灭灯——死者该有自由",go:"v57q_灵魂法师_fac_soul_leave_3b",note:"离世派声望+15"}
 ]
};};
N["v57q_灵魂法师_fac_soul_leave_3"]=function(){return{
 sceneTitle:"离世派 · 站队大抉择",
 text:[
  "你收起铜钉。老人松了口气，又添了一勺油。他转身去供桌前，跪下来，磕了三个头。",
  "你走出老宅，夜风很凉。你回到荒坡，雷·娜还坐在石碑上。她听完你的话，没有评判，只说：「你留了那盏灯——也留了那个老人四十年的念想。离世派不怪你。我们拆灯，是因为灯有时候是锁；可有些灯，是桥。」",
  "她递给你一枚铜环：「离世派的印。记住——你今天不是不会拆灯，是学会了看：哪盏灯是锁，哪盏灯是桥。」",
  "你接过铜环。它带着一丝凉意，像从某盏刚刚熄灭的灯上取下来的。"
 ],
 options:[
  {t:"收好铜环",go:"academy_elda_hub",note:"已入离世派"}
 ]
};};
N["v57q_灵魂法师_fac_soul_leave_3b"]=function(){return{
 sceneTitle:"离世派 · 抉择结果",
 text:[
  "你钉灭了那盏灯。灯芯断掉的一瞬，祠堂里暗了一角。老人没有出声，只是站在那里，看着那盏灭了的灯，很久很久。",
  "他最后说：「也好。她怕黑——可她更怕我这样，把她拴在这儿。」他转身，没有再看那盏灯。",
  "你回到荒坡。雷·娜听完，沉默了一会儿：「你做了离世派该做的事。可你记住——你灭掉的不是一盏灯，是一个人的念想。灯灭了，他还得自己学会不怕黑。」",
  "她递给你一枚铜环：「离世派的印。你担得起它——因为你刚才，替一个魂，做了她儿子四十年不敢做的事。」"
 ],
 options:[
  {t:"收好铜环",go:"academy_elda_hub",note:"已入离世派"}
 ]
};};
/* 术士 · 造物派 */
N["v57q_术士_fac_smith_create_1"]=function(){return{tag:"branch",
 sceneTitle:"造物派 · 入派试炼",
 text:[
  "造物派在熔炉大厅的东侧，那里摆着一排「活物」——铜鸟、铁鹿、木偶人，眼睛都是亮的。格朗·符文站在它们中间，像站在一群孩子里。",
  "「造物派信一条：造出来的，就是新的生命。」他说，「它有它的主意，你得认。」",
  "他指着一具刚上完发条的铜蛙：「它只会跳。你给它三天，教会它一件事——然后带它回来给我看。」",
  "你接过铜蛙。它蹲在你手心，冰凉，鼓着一双铜眼睛。"
 ],
 options:[
  {t:"接下铜蛙",go:"v57q_术士_fac_smith_create_2"}
 ]
};};
N["v57q_术士_fac_smith_create_2"]=function(){return{tag:"branch",
 sceneTitle:"造物派 · 派系事件",
 text:[
  "你花了三天，教那铜蛙「跳回来」。一开始它乱跳，后来它学会了——你敲两下掌心，它就跳过来，蹲好。",
  "可第四天夜里，你听见铜蛙在桌角独自跳。不是按你教的——它自己在练习跳远。",
  "你把它带回去见格朗·符文。他听完，蹲下来，看着铜蛙：「它跳得更远了。不是你教的——是它自己学的。」",
  "他直起身，看着你：「这就是造物派的分岔路。你可以把它当成你造的东西——或者，把它当成它自己。」"
 ],
 options:[
  {t:"当它自己——它有它的活法",go:"v57q_术士_fac_smith_create_3"}
 ]
};};
N["v57q_术士_fac_smith_create_3"]=function(){return{tag:"branch",
 sceneTitle:"造物派 · 站队大抉择",
 text:[
  "格朗·符文听完你的回答，把那铜蛙拿起来，放回架子上——和那排「活物」放在一起。",
  "「造物派认你了。」他说，「可你还要过一个关。」",
  "他带你到大厅深处，那里有一具旧构装——它的胸口打开着，里面空空的。",
  "「这是创道者造的第一具构装，叫『守望』。它守了公会一百年，十年前坏了。」他看着你，「零件在左边箱子里。你修好它——但记住，修的时候，别按图纸。按它的骨架修：它是它自己，不是图纸上的它。」",
  "你站在那具旧构装面前。它的眼睛蒙着灰，像一个睡了很久的老人。"
 ],
 options:[
  {t:"按它的骨架修——不按图纸",go:"v57q_术士_fac_smith_create_3a",note:"造物派声望+15"},
  {t:"按图纸修——稳妥为上",go:"v57q_术士_fac_smith_create_3b",note:"造物派声望+5"}
 ]
};};
N["v57q_术士_fac_smith_create_3a"]=function(){return{tag:"branch",
 sceneTitle:"造物派 · 抉择结果",
 text:[
  "你蹲在那具旧构装前，没有翻图纸。你顺着它的骨架摸了一遍——它的关节磨痕告诉你怎么转，它的承重告诉你怎么修。",
  "你修了三天。第四天，你合上它的胸口，退后一步。它睁开了眼——灰蒙蒙的，慢慢亮起来。",
  "它没有站起来。它只是转过头，看着你，像在认人。",
  "格朗·符文在旁边看了全程。他递给你一枚齿轮：「造物派的印。你记住了——造出来的，先是它自己，才是你的作品。」",
  "你接过齿轮。那具旧构装在你身后，慢慢坐直了身子。"
 ],
 options:[
  {t:"收好齿轮",go:"academy_elda_hub",note:"已入造物派"}
 ]
};};
N["v57q_术士_fac_smith_create_3b"]=function(){return{tag:"branch",
 sceneTitle:"造物派 · 抉择结果",
 text:[
  "你按图纸修。零件对上了，关节归位了——可你合上它的胸口时，总觉得少了点什么。",
  "它睁开了眼。灰蒙蒙的，亮不起来。它试着站起来，走了两步，又停住了——像还记得旧的路，却忘了怎么走。",
  "格朗·符文看着你：「它活了，可它不认得自己了。你修的是图纸上的它——图纸没错，可它自己的那份，丢了。」",
  "他递给你一枚齿轮：「造物派的印。你收下它——记住今天：修东西容易，修『它自己』，难。」",
  "你接过齿轮，回头看了一眼那具构装。它还站着，像在等什么。"
 ],
 options:[
  {t:"收好齿轮",go:"academy_elda_hub",note:"已入造物派"}
 ]
};};
/* 术士 · 炼金派 */
N["v57q_术士_fac_smith_alc_1"]=function(){return{tag:"branch",
 sceneTitle:"炼金派 · 入派试炼",
 text:[
  "炼金派在药室的西厢。梅·炽芯正用一根玻璃棒搅一锅碧绿的药液，头也不抬：「炼金派信一条：万物皆可炼，唯人不可。」",
  "「你去药室后头，把那筐草药分了类。」她说，「分完告诉我——哪几味，能炼出救人的药；哪几味，只能炼出要命的东西。」",
  "你接过筐。草药的香气混着土腥味，像一筐没说话的乡愁。"
 ],
 options:[
  {t:"蹲下来分药",go:"v57q_术士_fac_smith_alc_2"}
 ]
};};
N["v57q_术士_fac_smith_alc_2"]=function(){return{tag:"branch",
 sceneTitle:"炼金派 · 派系事件",
 text:[
  "你分了半天，把药分成两堆：救人的、要命的。梅·炽芯走过来，看了看，点了点头。",
  "「分对了。」她拈起一株灰绿色的草，「这株，单用是毒；配上一钱银叶，就是退烧的良药。」她顿了一下，「可昨天，有人从药室偷走了一株『活髓』——那东西，只能炼要命的。」",
  "她看着你：「药室的人我都查过了，查不到。你是新人——眼睛干净。替我去南市的黑市看看，谁在买活髓。」"
 ],
 options:[
  {t:"接下这个差事",go:"v57q_术士_fac_smith_alc_3"}
 ]
};};
N["v57q_术士_fac_smith_alc_3"]=function(){return{tag:"branch",
 sceneTitle:"炼金派 · 站队大抉择",
 text:[
  "你在南市蹲了三天，蹲到一个熟人——是公会的铸炉学徒，常帮你抬铁的那个年轻人。他袖口藏着一个小包，形状像活髓。",
  "你把他带回药室。梅·炽芯看着他，沉默了很久。",
  "学徒跪下来，说：「我娘病了……药铺说，活髓炼的丹，能救她的命。我买不起，我偷了。」",
  "梅·炽芯蹲下来，看着他的眼睛：「你娘，在哪个药铺看的病？」",
  "你站在旁边。你知道规矩：偷活髓，是炼金派的重罪——轻则除名，重则断指。可你也看见，那学徒袖口磨破的针脚，是他自己缝的。"
 ],
 options:[
  {t:"按规矩办——偷就是偷",go:"v57q_术士_fac_smith_alc_3a",note:"炼金派声望+15"},
  {t:"替他求情——先救人，再定罪",go:"v57q_术士_fac_smith_alc_3b",note:"炼金派声望+10，梅·炽芯好感↑"}
 ]
};};
N["v57q_术士_fac_smith_alc_3a"]=function(){return{tag:"branch",
 sceneTitle:"炼金派 · 抉择结果",
 text:[
  "你选了规矩。学徒被除名那天，梅·炽芯没有骂他，只说了句：「你偷的不是药，是炼金派的脸。」",
  "可第二天，梅·炽芯自己去了那家药铺——她给学徒的娘，看了一个月的病，没要钱。",
  "你问她为什么。她说：「规矩是规矩。可我是炼金师——救人的手艺，不该让规矩挡住。」",
  "她给了你一枚琉璃瓶：「炼金派的印。记住——规矩和你自己，得两头都站住。」"
 ],
 options:[
  {t:"收好琉璃瓶",go:"academy_elda_hub",note:"已入炼金派"}
 ]
};};
N["v57q_术士_fac_smith_alc_3b"]=function(){return{tag:"branch",
 sceneTitle:"炼金派 · 抉择结果",
 text:[
  "你替他求了情。梅·炽芯看着你，看了很久，然后说：「活髓留下，人，你去监工三个月——药室的门，你看着。」",
  "学徒拼命磕头。梅·炽芯摆摆手：「别谢我。谢他——他替你，把这件案子，从『偷』字上挪开了一点。」",
  "你走出药室时，她叫住你：「炼金派信『万物皆可炼，唯人不可』。你今天炼的，是人心——这个，药室不教。」",
  "她给了你一枚琉璃瓶：「炼金派的印。你记住了——救人的路，有时候比炼药的更难走。」"
 ],
 options:[
  {t:"收好琉璃瓶",go:"academy_elda_hub",note:"已入炼金派"}
 ]
};};
/* 术士 · 符文派 */
N["v57q_术士_fac_smith_rune_1"]=function(){return{tag:"branch",
 sceneTitle:"符文派 · 入派试炼",
 text:[
  "符文派在地下一层的「纹路室」。火克蹲在一块石板上，正用针尖刻一道符文。他听见你来，没有抬头：「符文派信一条：纹路里住着法则。刻错一道，法则就翻脸。」",
  "他递给你一块铜片和一把刻针：「刻一个『平』字。就一个字——纹路要连、要顺、要一气呵成。」",
  "你接过刻针。铜片冰凉，针尖细得发颤。"
 ],
 options:[
  {t:"凝神，下针",go:"v57q_术士_fac_smith_rune_2"}
 ]
};};
N["v57q_术士_fac_smith_rune_2"]=function(){return{tag:"branch",
 sceneTitle:"符文派 · 派系事件",
 text:[
  "你刻了七遍，第七遍终于成了——纹路连贯，收笔干净。火克拿起来，对着光看了看，点了点头。",
  "「成。」他把铜片收进抽屉，「符文派认你了。不过——出个事。」",
  "他压轻声音：「地下二层的『封纹室』，昨晚有人进去过。门锁没坏，但封纹的石板上，多了一道新刻的痕——不是我们的手笔。」",
  "他看你：「封纹室刻的，是历代大师的传承纹。多一道痕，就多一道不该在的法则。你去看看那痕是什么——记住，别碰它，只看。」"
 ],
 options:[
  {t:"去封纹室查看",go:"v57q_术士_fac_smith_rune_3"}
 ]
};};
N["v57q_术士_fac_smith_rune_3"]=function(){return{tag:"branch",
 sceneTitle:"符文派 · 站队大抉择",
 text:[
  "你去了封纹室。那道新痕在石板的角落里，很小，却很锋利——是一道残缺的「封」字纹，最后一笔没刻完。",
  "你蹲下来看。纹路的方向不对——不是从外向内收，是从内向外散。这是一道「解封」的起手。",
  "火克不知什么时候站在你身后，声音很轻：「看出来了？这不是新手的乱刻——是有人在试，怎么解开创道者封下的初纹。」",
  "他递给你一支粉笔：「你有两个选择。一：把这道痕涂掉，当没看见——纹路室的人查，就说风化。二：顺着这道痕，把它刻完——看它通向哪里。但刻完的那一刻，封纹室的警报会响，整个公会都会知道有人来过。」",
  "你蹲在石板前，粉笔在手里，凉得像一段没下定的决心。"
 ],
 options:[
  {t:"涂掉它——不该碰的别碰",go:"v57q_术士_fac_smith_rune_3a",note:"符文派声望+15"},
  {t:"顺着刻完——看它通向哪里",go:"v57q_术士_fac_smith_rune_3b",note:"符文派声望+10，火克好感↑"}
 ]
};};
N["v57q_术士_fac_smith_rune_3a"]=function(){return{tag:"branch",
 sceneTitle:"符文派 · 抉择结果",
 text:[
  "你把那道痕涂掉了。粉笔灰落进纹路里，像雪盖住一道不该有的脚印。",
  "火克看着你涂完，点了点头：「符文派要的就是这种手——知道什么该碰，什么不该碰。」",
  "他给了你一枚刻针：「符文派的印。记住——法则不会说话，可它什么都记得。你今天涂掉的那道痕，它会替你记住。」",
  "你接过刻针。它很细，细得像一道刚起笔的纹路。"
 ],
 options:[
  {t:"收好刻针",go:"academy_elda_hub",note:"已入符文派"}
 ]
};};
N["v57q_术士_fac_smith_rune_3b"]=function(){return{tag:"branch",
 sceneTitle:"符文派 · 抉择结果",
 text:[
  "你顺着那道痕，把「解封」刻完了。最后一笔落下的瞬间，封纹室的警报骤然响起——尖利得像撕开一层铁。",
  "火克站在门口，没有跑。他看着你刻完最后一下，说：「好。现在，整个公会都知道有人来过。」",
  "他走到石板前，看着那道完整的纹，忽然说：「你刻的时候，我的手也在抖。符文派等你这一刻，等了三十年——创道者的初纹里，藏着一道没写完的传承。你刚才，把它续上了。」",
  "他递给你一枚刻针：「符文派的印。你记住了——有些纹，不是用来封的，是用来开的。开的那个人，得先敢。」"
 ],
 options:[
  {t:"收好刻针",go:"academy_elda_hub",note:"已入符文派"}
 ]
};};


/* ===== v57inj:brandNodes2 ===== */
/* 战士 · 战意透支 */
N["v57b_战士_overdraw_1"]=function(){return{
 sceneTitle:"战意透支 · 失控",
 text:[
  "战斗结束，你站在原地，胸口起伏得像风箱。旁边的同袍喊了你三声，你才听清他在问你要不要水。",
  "你接过水囊，手抖得洒了一半。你盯着洒在地上的水——你认得那是水，可你的脑子里，还是刚才那根劈过来的枪。",
  "你坐下来，过了很久，才觉得自己的名字回来了。可你知道，刚才有那么一阵，你是不在的——你整个人都烧在了那场架里。",
  "同袍拍了拍你的肩。你冲他笑了笑，笑得大概很难看。"
 ],
 options:[
  {t:"接过水囊，慢慢喝一口",go:"v57b_战士_overdraw_2"}
 ]
};};
N["v57b_战士_overdraw_2"]=function(){return{
 sceneTitle:"战意透支 · 面对",
 text:[
  "你慢慢喝完那口水。水是凉的，凉得让你想起自己还有一具身体——不只是刀，不只是拳头。",
  "秦·长风在旧旗台说过：「你为谁而握，旗就为谁而飘。」你忽然想：你为谁而战呢？刚才那场架，你是为了身后那几个人——可你打到一半，眼睛里只剩下对面的枪。",
  "战意透支，是你把自己烧得太干净。烧到忘了，你自己也是那个「要护住的人」之一。",
  "你握着水囊，忽然觉得鼻子有点酸。你低头喝了一大口，把那股酸压回去。"
 ],
 options:[
  {t:"压制它——学会留三分力",go:"v57b_战士_overdraw_3",note:"烙印深度 -1"},
  {t:"接纳它——战意就是你的命",go:"v57b_战士_overdraw_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_战士_overdraw_3"]=function(){return{
 sceneTitle:"战意透支 · 抉择",
 text:[
  "你决定：以后打仗，留三分力。不是怕死——是怕烧过了头，连护的人都认不出来。",
  "你开始学着在战斗间隙给自己留一口气：数一数身后的名字，想一想回去以后要吃的面。",
  "秦·长风的旗还插在旧旗台。你每次路过，都抬头看一眼——旗还在，你也还在。这就够了。"
 ],
 options:[
  {t:"把水囊还给同袍，站起身",go:"event_hub"}
 ]
};};
N["v57b_战士_overdraw_3b"]=function(){return{
 sceneTitle:"战意透支 · 抉择",
 text:[
  "你没有留力。你想：战意这东西，天生就是用来烧的。烧得干净，才烧得痛快。",
  "你开始习惯战后那阵恍惚——它来了，你就坐着等它过去。它过去以后，你往往记得更清：那根枪、那一步、那一刀，是怎么落的。",
  "同袍说你是疯子。你笑。疯子就疯子——只要旗还在，疯一点，也立得住。"
 ],
 options:[
  {t:"大笑一声，起身去擦刀",go:"event_hub"}
 ]
};};
/* 战士 · 杀伐惯性 */
N["v57b_战士_kill_1"]=function(){return{
 sceneTitle:"杀伐惯性 · 失控",
 text:[
  "酒馆里有人推了你一把——只是喝醉了，不是挑衅。可你回过神的时候，拳头已经攥起来了，青筋暴起。",
  "那人被你眼里的东西吓醒了酒，连连后退，撞翻了两张凳子。你慢慢松开拳头，指节咔咔作响。",
  "你坐下，把那杯酒干了。你忽然明白：刚才那一瞬，你根本没想过「要不要打」——你的身体先替你决定了。",
  "杀伐惯性。你走的路太直了，直到忘了，世界上有些问题，不是靠拳头收场的。"
 ],
 options:[
  {t:"走到那人面前，说一句软话",go:"v57b_战士_kill_2"}
 ]
};};
N["v57b_战士_kill_2"]=function(){return{
 sceneTitle:"杀伐惯性 · 面对",
 text:[
  "你走过去，那人的脸都白了。你开口，嗓子里挤出一句：「刚才……吓着你了。对不住。」",
  "那人愣住了，然后连声说「没事没事」，手忙脚乱地帮你捡起掉在地上的凳子。",
  "你回到座位上，心里却比打赢一架还乱。你想起格罗·铁壁在旧墙下说的话：「这面墙替人挡了一百年——挡箭、挡雪、挡人。可它从不主动撞人。」",
  "你低头看着自己的拳头。它替你挡过很多，也替你撞过很多。你分不清了。"
 ],
 options:[
  {t:"压制它——试着用话开路",go:"v57b_战士_kill_3",note:"烙印深度 -1"},
  {t:"接纳它——拳头就是你的话",go:"v57b_战士_kill_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_战士_kill_3"]=function(){return{
 sceneTitle:"杀伐惯性 · 抉择",
 text:[
  "你决定学一句新话：先开口，再出手。",
  "你开始强迫自己在动手前，先问一句「为什么」。有时候答案是一句道歉，有时候是一杯酒，有时候是「我误会了」。",
  "你发现，话也能开路。开得比拳头慢，可开出来的路，不用事后修。",
  "你坐在酒馆里，那杯酒还是凉的。可你觉得，自己比刚才热了一点——不是战意，是别的什么。"
 ],
 options:[
  {t:"喝完那杯酒，起身离开",go:"event_hub"}
 ]
};};
N["v57b_战士_kill_3b"]=function(){return{
 sceneTitle:"杀伐惯性 · 抉择",
 text:[
  "你看着自己的拳头，想：它跟了你这些年，替你挡过刀、替你站过墙、替你把那些说不清的话，一句句砸成了回应。",
  "你不再试着让拳头变得温柔。你想：拳头就是你的话——你把话说得清楚，把拳头握得干净，就够了。",
  "那人推你，你让他走了。不是因为怕，是因为你已经不需要用一场架，来证明自己是谁。",
  "你喝完那杯酒，指尖在桌上轻叩了两下——那是你的旗语：我还在。"
 ],
 options:[
  {t:"放下空杯，起身离开",go:"event_hub"}
 ]
};};
/* 战士 · 旧伤执念 */
N["v57b_战士_scar_1"]=function(){return{
 sceneTitle:"旧伤执念 · 失控",
 text:[
  "夜里你坐在灯下，卷起袖子，数手臂上的疤。旧的一道从肘弯划到手腕，新的一道在肩头，还是淡红的。",
  "你数了三遍——不是记不清，是想多数一遍。每数一遍，那些日子就回来一遍：铁门关的雪、旧墙下的火、还有那个替你说好话的炊事兵。",
  "你忽然意识到：你开始怕它们好了。疤淡了，是不是那些日子也就淡了？",
  "你放下袖子，可手指还在发痒——想再卷起来，再看一遍。"
 ],
 options:[
  {t:"放下袖子，吹灭灯",go:"v57b_战士_scar_2"}
 ]
};};
N["v57b_战士_scar_2"]=function(){return{
 sceneTitle:"旧伤执念 · 面对",
 text:[
  "你吹灭了灯，却睡不着。黑暗里，那些疤像活的一样，一条一条在你皮肤上发热。",
  "你想起格罗·铁壁画在墙上的那道印：「这是你的印。以后你就是这面墙的一部分。」",
  "可墙不会怕自己的裂缝变浅。你怕。你怕疤淡了，就没人记得你走过那些路——包括你自己。",
  "你躺在黑暗里，忽然听见自己的心跳。一下，一下，很稳。你活着。疤在淡，人在活——这本来是好事，你怎么怕成这样？"
 ],
 options:[
  {t:"压制它——让疤好好淡去",go:"v57b_战士_scar_3",note:"烙印深度 -1"},
  {t:"接纳它——疤是你的年轮",go:"v57b_战士_scar_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_战士_scar_3"]=function(){return{
 sceneTitle:"旧伤执念 · 抉择",
 text:[
  "你把手伸出被子，让夜风拂过那些疤。你对自己说：淡了就淡了。路是你走的，不需要靠疤来记账。",
  "第二天，你把那条旧绑带解下来，洗干净，叠好——留着，但不缠了。",
  "你走到演武场，重新练了一趟刀。刀风过处，你感到的不是旧伤在响，是新的劲在长。",
  "从今天起，你不再数疤。你数日子。日子在往前过，这才是你活着的最好证明。"
 ],
 options:[
  {t:"收好绑带，开始新的一天",go:"event_hub"}
 ]
};};
N["v57b_战士_scar_3b"]=function(){return{
 sceneTitle:"旧伤执念 · 抉择",
 text:[
  "你没有让疤淡去。你想：它们是年轮——树靠年轮记得自己的雨雪，你靠疤记得自己的路。",
  "你开始每天夜里，在灯下数一遍。不是为了怕——是为了不忘记那些替你挡过东西的人。",
  "秦·长风的木臂里有个名字，你见过。你没有问他那是谁——你只是握紧了自己的刀。",
  "你卷下袖子，灯还亮着。疤在，你也在。你们都是走过来的人。"
 ],
 options:[
  {t:"吹灭灯，合眼睡去",go:"event_hub"}
 ]
};};
/* 骑士 · 誓约锈蚀 */
N["v57b_骑士_rust_1"]=function(){return{
 sceneTitle:"誓约锈蚀 · 失控",
 text:[
  "你又食言了。答应陪师妹去镇上看灯会，可临时来了任务——你选了任务。",
  "夜里你回营，路过师妹的窗，看见灯还亮着。她大概等了一晚上。你没有敲门。",
  "你回到自己的帐篷，解开胸甲，忽然觉得胸口发沉。低头看——胸甲内侧，多了一小块锈。今天早上还没有。",
  "你拿布去擦，擦不掉。锈长在铁里了，像那句话——「一诺既出，万山无阻」——你把它咽回去的时候，它在你的铁里生了根。"
 ],
 options:[
  {t:"放下胸甲，坐下",go:"v57b_骑士_rust_2"}
 ]
};};
N["v57b_骑士_rust_2"]=function(){return{
 sceneTitle:"誓约锈蚀 · 面对",
 text:[
  "你坐在帐篷里，盯着那块锈。你想起罗兰·白盾在誓堂说的话：「盾不是用来挡刀，是用来证明——有人说过的话，算数。」",
  "可你的话，今晚不算数了。你答应的事，和你要做的事，撞在一起——你选了后者，却没敢告诉她。",
  "你忽然明白，誓约锈蚀不是惩罚——是提醒。它提醒你：誓言不是挂在嘴上的，是落在日子里的。你躲过的那句话，会在你的铁里，慢慢锈成一道痕。",
  "你摸上那块锈，指尖发凉。"
 ],
 options:[
  {t:"压制它——明天去补上那个约",go:"v57b_骑士_rust_3",note:"烙印深度 -1"},
  {t:"接纳它——有些誓，注定要锈",go:"v57b_骑士_rust_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_骑士_rust_3"]=function(){return{
 sceneTitle:"誓约锈蚀 · 抉择",
 text:[
  "第二天一早，你去了镇上——灯会已经散了，可你在她窗下等了一个时辰。她出来倒水，看见你，愣住了。",
  "你说：「昨晚答应你去看灯，我没去成。今天补上——灯没了，我陪你把镇子走一遍。」",
  "她眼圈红了一下，骂了你一句「呆子」，还是跟在你后头走了。",
  "你们走了半条街，她忽然说：「其实你不用补——你记得自己答应过，就够了。」",
  "你低头看胸口。那块锈还在。可你知道，它不会再长多少了——因为那句话，你补上了。"
 ],
 options:[
  {t:"陪她走完那条街",go:"event_hub"}
 ]
};};
N["v57b_骑士_rust_3b"]=function(){return{
 sceneTitle:"誓约锈蚀 · 抉择",
 text:[
  "你没有去补那个约。你想：有些誓，立的时候是真心，破的时候也是真心——世界就是这样转的。",
  "你开始学着，把誓言说得轻一些，把「答应」说得慢一些。说得轻，破的时候就不那么疼。",
  "可那块锈没有停。它慢慢爬过你的胸甲，像一句句没说完的话，在你铁里排成行。",
  "你不再擦它。你让它长——你知道，这就是你的路：说的话越多，锈越重；可你依然要说，因为你还是要立誓，还是要护人。",
  "夜里你摸过那块锈，对自己说：护人的心没锈，就还能走。"
 ],
 options:[
  {t:"系好胸甲，走出帐篷",go:"event_hub"}
 ]
};};
/* 骑士 · 圣光灼眼 */
N["v57b_骑士_blaze_1"]=function(){return{
 sceneTitle:"圣光灼眼 · 失控",
 text:[
  "你站在集市口，看着那个偷面包的孩子被摊主揪着领子打。你走过去——不是去救人，是去「处置」。",
  "你拦住摊主，又低头对孩子说：「偷窃是罪。」话出口，你看见那孩子的眼睛——没有悔意，只有饿。",
  "你站在日光下，忽然觉得圣光很刺眼。你分不清，刚才那句话，是圣光在说，还是你在说。",
  "孩子挣脱跑了。摊主骂骂咧咧。你站在原地，眼睛被日光灼得发疼。"
 ],
 options:[
  {t:"揉了揉眼睛，离开集市",go:"v57b_骑士_blaze_2"}
 ]
};};
N["v57b_骑士_blaze_2"]=function(){return{
 sceneTitle:"圣光灼眼 · 面对",
 text:[
  "你走出集市，靠在墙根，眼睛还在疼。你想起伊莎·晨辉在穹顶下说的话：「光会照到好人，也会照到坏人。你要学的不是让光只照一边——是看清两边的脸。」",
  "可你今天没看清。你只看见了「偷」，没看见「饿」。圣光的标准在你眼里越来越高——高到把那个孩子整个人都照没了，只剩一个「罪」字。",
  "你忽然明白，灼眼的不是圣光——是你自己把标准举得太高，高到光落下来的时候，把人也一起灼了。",
  "你闭上眼睛。黑暗里，那个孩子的眼睛还在——没有悔意，只有饿。"
 ],
 options:[
  {t:"压制它——试着把标准放低些",go:"v57b_骑士_blaze_3",note:"烙印深度 -1"},
  {t:"接纳它——圣光本就该刺眼",go:"v57b_骑士_blaze_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_骑士_blaze_3"]=function(){return{
 sceneTitle:"圣光灼眼 · 抉择",
 text:[
  "第二天，你去了那条街，给摊主赔了钱——说是「我买下那个面包」。摊主收了钱，嘀咕着走了。",
  "你又在巷子口蹲了半个时辰。那个孩子没来。你把剩下的钱放在墙角的破碗里，压了一块石头。",
  "你站起身，日光还是那样亮。可你试着不再把标准举过头顶——你学着先看脸，再看罪。",
  "眼睛不那么疼了。你知道，不是光变了，是你不再替光举着那把尺。"
 ],
 options:[
  {t:"走进日光里，继续巡街",go:"event_hub"}
 ]
};};
N["v57b_骑士_blaze_3b"]=function(){return{
 sceneTitle:"圣光灼眼 · 抉择",
 text:[
  "你没有放低标准。你想：圣光本该刺眼——它若温柔，这世上就没有敬畏了。",
  "你开始习惯那种灼痛。每次出手「处置」前，你先让圣光照自己一遍——照到自己也疼了，你才敢照别人。",
  "那个孩子的眼睛，你一直记得。你把它当成一盏小灯，别在自己心里——提醒你：标准高可以，可你照人的时候，得先站进光里。",
  "你站在日光下，眼睛发疼。你忍着。你知道，这就是圣战者该有的疼。"
 ],
 options:[
  {t:"迎着光，继续巡你的路",go:"event_hub"}
 ]
};};
/* 骑士 · 负重孤独 */
N["v57b_骑士_lonely_1"]=function(){return{
 sceneTitle:"负重孤独 · 失控",
 text:[
  "夜里你坐在誓堂的台阶上，月光把你的影子拉得很长。四下无人——你不知道从什么时候起，你身边开始这么静。",
  "同袍们喝酒会喊你，你笑着摆手；师妹送汤来，你谢了又谢，转身就忘了喝。你扛的事越来越多——要守的约、要护的人、要担的责——多到你不敢停下来跟人说。",
  "你怕一说，就露了怯。你怕露怯，就护不住那些托付给你的人。",
  "于是你一个人坐在台阶上，把那些事一样一样摊开，又一样一样收好。收完，天都快亮了。"
 ],
 options:[
  {t:"坐着没动，让夜风把自己吹醒",go:"v57b_骑士_lonely_2"}
 ]
};};
N["v57b_骑士_lonely_2"]=function(){return{
 sceneTitle:"负重孤独 · 面对",
 text:[
  "夜风凉。你打了个寒战，忽然想起罗兰·白盾说过的话：「盾不是用来挡刀，是用来证明——有人说过的话，算数。」",
  "可你忽然想：盾替人挡了一辈子刀，谁替盾挡一挡风？你替那么多人扛着，谁替你扛一扛？",
  "你回答不上来。你只知道自己不敢问——怕问了，就软了；软了，盾就拿不稳了。",
  "月光照在誓堂的墙上，那些名字静静列着。创道者守了一辈子，死在北境——他死的时候，身边有人吗？你想问，可那些名字不会回答。"
 ],
 options:[
  {t:"压制它——试着对同袍说一句真话",go:"v57b_骑士_lonely_3",note:"烙印深度 -1"},
  {t:"接纳它——负重的人本就孤独",go:"v57b_骑士_lonely_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_骑士_lonely_3"]=function(){return{
 sceneTitle:"负重孤独 · 抉择",
 text:[
  "第二天，你去找同袍，说了一句真话：「这几天，我有点撑不住。」",
  "同袍愣了一瞬，然后把你按在凳子上，端来一碗热汤：「撑不住就说啊。我们又不是只靠你一个人扛。」",
  "你端着那碗汤，热气扑在脸上。你忽然觉得，鼻子酸得厉害——你有多久，没让人知道你也累了？",
  "你喝完那碗汤。从那天起，你学会把担子分一点出去——不是护不住，是护的人多了，你才护得住更久。"
 ],
 options:[
  {t:"喝完汤，坐在同袍中间",go:"event_hub"}
 ]
};};
N["v57b_骑士_lonely_3b"]=function(){return{
 sceneTitle:"负重孤独 · 抉择",
 text:[
  "你没有去说那句真话。你想：负重的人本就孤独——这是路的代价，不是路的错。",
  "你开始习惯一个人坐在誓堂台阶上。你把那些事摊开、收好，再对自己说一句：「撑得住。」",
  "你发现，说多了，也就真的撑住了。孤独这东西，扛得久了，会变成一种硬——像盾上的铁，越打越实。",
  "月光还是那样。你坐在台阶上，影子很长。可你知道，影子的长度，就是你扛过的重量。"
 ],
 options:[
  {t:"站起来，把誓堂的门带上",go:"event_hub"}
 ]
};};
/* 游侠 · 自然同化 */
N["v57b_游侠_beast_1"]=function(){return{
 sceneTitle:"自然同化 · 失控",
 text:[
  "你在林子里追一头鹿，追到一半，你忽然发现自己是在用四肢的节奏跑——肩背压低，视线穿过灌木的缝隙，像一头兽。",
  "你停下来，喘着气，扶着一棵树。你听见自己在用耳朵分辨风里的气味——松脂、腐叶、还有很远很远的烟火气。",
  "你已经在这片林子里住了二十天。你开始数不清，这二十天里，你跟人说过几句话。",
  "你伸手摸了摸自己的脸。手是温的，脸是凉的。你忽然有些分不清，哪个才是「你」。"
 ],
 options:[
  {t:"往林子的边缘走，闻一闻人烟",go:"v57b_游侠_beast_2"}
 ]
};};
N["v57b_游侠_beast_2"]=function(){return{
 sceneTitle:"自然同化 · 面对",
 text:[
  "你走到林子边缘，风里那股烟火气越来越近——是炊烟，还有孩子笑闹的声音。你站在阴影里，看着那片亮着灯的村子。",
  "你想起贺·断弓在古树根下说的话：「守望者守到最后，守的不是树——是人。」可你现在，站在树这边，看着人。",
  "你忽然明白，自然同化不是融入——是逃跑。你躲进林子的语言里，是因为人的语言太麻烦。",
  "村口有个孩子跑出来追狗，摔了一跤，哇地哭了。你本能地想走——可你停住了。你想起自己小时候，也这样哭过。"
 ],
 options:[
  {t:"压制它——走回人群里去",go:"v57b_游侠_beast_3",note:"烙印深度 -1"},
  {t:"接纳它——山林才是你的家",go:"v57b_游侠_beast_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_游侠_beast_3"]=function(){return{
 sceneTitle:"自然同化 · 抉择",
 text:[
  "你走出林子，走进村子。那孩子还坐在地上哭，你走过去，蹲下，问：「摔疼了？」",
  "孩子挂着眼泪看你，点了点头。你伸手把他拉起来，拍掉他膝盖上的土：「没事。我小时候也摔过。」",
  "孩子不哭了，跑去找他娘。你站在原地，忽然觉得自己说了一句很久没说过的话——一句人的话。",
  "你回头看了看林子。它还在，你也还会回去——但你知道，你从今天起，学会两门语言了。"
 ],
 options:[
  {t:"沿着炊烟的方向，走进村口",go:"event_hub"}
 ]
};};
N["v57b_游侠_beast_3b"]=function(){return{
 sceneTitle:"自然同化 · 抉择",
 text:[
  "你没有走进村子。你退回林子里，让阴影重新把你包住。",
  "你想：林子的语言更干净——不撒谎，不算计，不说一半留一半。你用它，用得比人话熟。",
  "你开始跟林子说话。跟一棵老树说你今天的路，跟一条溪说你昨夜做的梦。它们都听着，像贺·断弓说的那颗石子——替你站着，替你记着。",
  "你走在林子里，脚步轻得像没有。可你知道，你脚下有根——不是树根，是你这些年走出来的路根。"
 ],
 options:[
  {t:"转身，走进林子深处",go:"event_hub"}
 ]
};};
/* 游侠 · 荒野孤寂 */
N["v57b_游侠_lone_1"]=function(){return{
 sceneTitle:"荒野孤寂 · 失控",
 text:[
  "你进了城，办完事，本该立刻出城——可你站在十字路口，忽然不知道该往哪边走。",
  "街上的人流从你身边涌过，你像一块河心的石头。他们的味道、声音、脚步，全都挤在一起，你觉得自己要被淹了。",
  "你退到墙根，贴着墙站了一会儿。你想起林子里的风——干净的，有方向的。而这里的气息太混了，混到你鼻子发酸。",
  "你攥紧弓袋。你想出城。你想跑回那片没有人的地方。"
 ],
 options:[
  {t:"深呼吸，试着多站一会儿",go:"v57b_游侠_lone_2"}
 ]
};};
N["v57b_游侠_lone_2"]=function(){return{
 sceneTitle:"荒野孤寂 · 面对",
 text:[
  "你站在墙根，试着多站一会儿。一个卖饼的老妇人看见你，端了一碗水过来：「小兄弟，中暑了？」",
  "你接过那碗水，说了声「谢谢」。水是凉的，碗沿有豁口，却洗得很干净。",
  "你忽然想起艾琳·逐风在白桦林说的话：「看得越清，你出手越干净——也越少后悔。」可你看清了人群，却想逃——这不是看清，是躲开。",
  "你喝了那碗水。老妇人笑了，转身去招呼下一个客人。你端着空碗，站了很久。"
 ],
 options:[
  {t:"压制它——试着跟老妇人聊两句",go:"v57b_游侠_lone_3",note:"烙印深度 -1"},
  {t:"接纳它——荒野才是你的归宿",go:"v57b_游侠_lone_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_游侠_lone_3"]=function(){return{
 sceneTitle:"荒野孤寂 · 抉择",
 text:[
  "你把碗还回去，试着问了一句：「大娘，这城里有卖弓弦的吗？」",
  "老妇人眼睛一亮：「有有有，转角第三家，老赵的铺子——你顺着这条街走，闻着桐油味就到了。」",
  "你顺着她指的路走。走到转角，你回头看了一眼——她还站在摊子后头，朝你挥了挥手。",
  "你走进那家铺子，跟老赵聊了半个时辰的弓弦。出城的时候，天都黑了。你忽然觉得，城里也不是不能待——只要你知道，还有人在等你问路。"
 ],
 options:[
  {t:"揣着新弓弦，走出城门",go:"event_hub"}
 ]
};};
N["v57b_游侠_lone_3b"]=function(){return{
 sceneTitle:"荒野孤寂 · 抉择",
 text:[
  "你没有再试着待下去。你把碗还给老妇人，谢过她，转身往城门走。",
  "走出城门的那一刻，风灌进来——干净的、有方向的。你深深吸了一口，像鱼回了水。",
  "你在林子里走了半夜，才觉得整个人又回来了。你靠在树上，看着月光穿过枝丫，落成碎银。",
  "你对自己说：人各有命。你的命，在荒野——这不丢人。你只是，偶尔也会想起那碗豁了口的温水。"
 ],
 options:[
  {t:"枕着弓袋，在树下睡去",go:"event_hub"}
 ]
};};
/* 游侠 · 猎杀本性 */
N["v57b_游侠_hunt_1"]=function(){return{
 sceneTitle:"猎杀本性 · 失控",
 text:[
  "你在酒馆角落里坐着，视线不经意扫过每一个人的后颈——那是箭矢落点的位置。",
  "你猛地移开视线，端起酒杯。可你的手比眼睛诚实——它已经在比划，这一桌坐几个人，退路在哪。",
  "你愣住。你不是在防身。你是在「猎」——像看猎物一样，看一屋子喝酒的人。",
  "艾琳·逐风说过：「杀过的每一头猎物，它死前的样子，你都得记住——不然，你会把人也当成猎物。」你想，你记住的猎物太多了。"
 ],
 options:[
  {t:"放下酒杯，把手收进桌下",go:"v57b_游侠_hunt_2"}
 ]
};};
N["v57b_游侠_hunt_2"]=function(){return{
 sceneTitle:"猎杀本性 · 面对",
 text:[
  "你把手收进桌下，强迫自己去看他们的脸——看那个说笑话的胖子笑出褶子，看那个老板娘擦桌子擦到腰酸。",
  "你试着把他们当人看。可你的眼睛像有自己的习惯，总往要害上滑。",
  "你忽然明白，猎杀本性不是杀气——是熟练。你熟练了太久，熟练到看世界的第一眼，永远是「能不能射中」。",
  "你坐在酒馆里，人声鼎沸。你握着酒杯，像握着一支没松开的箭。"
 ],
 options:[
  {t:"压制它——试着看人不看要害",go:"v57b_游侠_hunt_3",note:"烙印深度 -1"},
  {t:"接纳它——猎人就是这么看世界的",go:"v57b_游侠_hunt_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_游侠_hunt_3"]=function(){return{
 sceneTitle:"猎杀本性 · 抉择",
 text:[
  "你开始练习：进酒馆，先数人头，不数要害。数他们谁在笑、谁在愁、谁在等人。",
  "这很难。比拉满一张弓难。你练了三天，练到眼睛发酸——可你慢慢发现，那些「猎物」，开始有了名字。",
  "老板娘姓周，那个说笑话的胖子姓钱，那个总在角落喝酒的老头，年轻时是铁门关的斥候。",
  "你坐在他们中间，终于不再像一支上了弦的箭。你像一个人——一个会笑、会喝酒、会记住别人名字的人。"
 ],
 options:[
  {t:"给老板娘留了一枚铜钱，走出酒馆",go:"event_hub"}
 ]
};};
N["v57b_游侠_hunt_3b"]=function(){return{
 sceneTitle:"猎杀本性 · 抉择",
 text:[
  "你没有改。你想：猎人的眼睛，天生就是看要害的——这是吃饭的本事，不是病。",
  "你开始习惯那种视线。你学会把它收着——只在需要的时候放出来，平时，它沉在你的眼底，像一支插在袋里的箭。",
  "你依然能一眼看穿一屋子的退路。但你学会了另一件事：看清了，不一定用。",
  "你坐在酒馆里，视线扫过每一张脸，又轻落回自己那杯酒上。你像一头坐在人群里的老狼——不咬人，只是知道。"
 ],
 options:[
  {t:"喝完酒，无声地消失在门口",go:"event_hub"}
 ]
};};
/* 盗贼 · 暗影侵蚀 */
N["v57b_盗贼_erode_1"]=function(){return{
 sceneTitle:"暗影侵蚀 · 失控",
 text:[
  "你从一条暗巷里走出来，站在街边，忽然记不起自己刚才的脸。",
  "不是忘了长相——是忘了「你该是谁」。你在巷子里换了三种身份：过路的皮货商、找人的管家、讨债的打手。出来的时候，你一时想不起，自己本来的名字。",
  "你掐了自己一把，才把「我」从那些身份底下捞出来。",
  "杜·夜枭在黑井说过：「影子从不欠人——也从不被人记住。」你忽然觉得，你当影子当得太久了，久到快忘了，影子底下还压着一个人。"
 ],
 options:[
  {t:"站在街边，试着回想自己本来的样子",go:"v57b_盗贼_erode_2"}
 ]
};};
N["v57b_盗贼_erode_2"]=function(){return{
 sceneTitle:"暗影侵蚀 · 面对",
 text:[
  "你站在街边，努力回想：你笑起来什么样？你生气的时候先皱眉还是先摔东西？你小时候最怕什么？",
  "有些想得起来，有些已经模糊了。你发现，那些你反复戴过的身份，比你自己更清晰——它们有名字、有来历、有台词，而你本来的那张脸，倒像一张没来得及画的草稿。",
  "乌·黛在钟楼说过：「夜行者的活法：替白天看不见的那些，记一笔账。」可你现在想：你替别人记了那么多账，谁替你自己记一记？",
  "你靠着墙，站了很久。"
 ],
 options:[
  {t:"压制它——找个朋友喊你的真名",go:"v57b_盗贼_erode_3",note:"烙印深度 -1"},
  {t:"接纳它——影子里没有名字",go:"v57b_盗贼_erode_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_盗贼_erode_3"]=function(){return{
 sceneTitle:"暗影侵蚀 · 抉择",
 text:[
  "你去找那个从小一起长大的朋友。他看见你，照旧喊你的小名，问你最近在哪发财。",
  "你听着那个小名，心里忽然松了一块。你坐下来，没戴任何身份，就着那顿饭，说了几句真话。",
  "朋友笑你：「怎么今天这么老实？」你说：「想起来了，我本来就不是皮货商。」",
  "你走出门的时候，朋友在后面喊：「下回再来啊，别又神神秘秘的！」你回头，应了一声。",
  "你走在街上，阳光照着你。你没有躲——你想试试，不戴身份走路，是什么感觉。"
 ],
 options:[
  {t:"让阳光照一会儿，再走",go:"event_hub"}
 ]
};};
N["v57b_盗贼_erode_3b"]=function(){return{
 sceneTitle:"暗影侵蚀 · 抉择",
 text:[
  "你没有去找朋友。你想：影子里没有名字——这是这条路的规矩，也是这条路的自由。",
  "你开始学着，在换回身份的时候，不急着捞回「自己」。你让自己空一阵——像一间暂时没人的屋子。",
  "你发现，空的时候，你的手反而更稳：不开锁，不扒窃，就那样空着，也很好。",
  "你站在街边，影子被日头拉得很长。你看着它，说：「今天不叫你了。你歇着。」"
 ],
 options:[
  {t:"顺着影子，走进另一条巷子",go:"event_hub"}
 ]
};};
/* 盗贼 · 见光恐惧 */
N["v57b_盗贼_light_1"]=function(){return{
 sceneTitle:"见光恐惧 · 失控",
 text:[
  "中午的集市，太阳毒辣。你站在摊子前买饼，忽然觉得浑身发紧——像有千百双眼睛从光里伸出来，盯着你的后颈。",
  "你扔下铜钱，抓起饼，快步钻进一条背阴的巷子。靠在墙上，你才喘匀了气。",
  "你低头看自己：手在抖，后背全是汗。你明明什么都没做——只是站在光里，站在人群里。",
  "你忽然明白，你不是怕太阳——你是怕「被人看见」。你在这行里待得太久，久到「被看见」成了最危险的事。"
 ],
 options:[
  {t:"咬了一口饼，试着再走到光里去",go:"v57b_盗贼_light_2"}
 ]
};};
N["v57b_盗贼_light_2"]=function(){return{
 sceneTitle:"见光恐惧 · 面对",
 text:[
  "你咬了一口饼，往巷口走了两步，又退回来。光像一堵墙，你推不过去。",
  "你想起薇·灰雾在旧鱼市说的话：「该亮的时候亮，该熄的时候熄。」可你现在的灯，好像忘了怎么亮。",
  "你蹲在巷子里，阳光只落在你脚前一寸。你看着那道分界线，忽然想：你有多久，没有堂堂正正地站在光里跟人说过话了？",
  "饼在手里，还是热的。你忽然觉得，它比太阳还烫。"
 ],
 options:[
  {t:"压制它——试着在光里走一段",go:"v57b_盗贼_light_3",note:"烙印深度 -1"},
  {t:"接纳它——影子本就不该见光",go:"v57b_盗贼_light_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_盗贼_light_3"]=function(){return{
 sceneTitle:"见光恐惧 · 抉择",
 text:[
  "你把饼吃完，吸了口气，一步跨进光里。",
  "光落下来，比你想的轻。没有人盯着你——卖菜的在吆喝，孩子在追跑，所有人都在忙自己的日子。",
  "你走了半条街，慢慢地，那堵墙松了。你甚至在一个摊子前停下，问了一句：「这瓜怎么卖？」",
  "摊主报了价。你买了。你抱着瓜走在光里，忽然笑了——你原来还会这样走路。",
  "从那天起，你每天中午，都去集市走一圈。不干什么，就是走——让光晒一晒，让影子知道，它也有白天。"
 ],
 options:[
  {t:"抱着瓜，在光里走回家",go:"event_hub"}
 ]
};};
N["v57b_盗贼_light_3b"]=function(){return{
 sceneTitle:"见光恐惧 · 抉择",
 text:[
  "你没有再跨进光里。你想：影子本就不该见光——这是保护，不是病。",
  "你开始学着自己掌灯。白天，你把活都安排进背阴处；夜里，你才让灯亮起来，照着自己干活。",
  "你发现，自己掌的灯，比太阳好使——它听你的，你让它照哪，它照哪。",
  "你蹲在巷子里，把饼吃完。阳光还是落在脚前一寸。你伸手，把那一寸光也遮住了——你想让影子，好好待着。"
 ],
 options:[
  {t:"吃完饼，起身走进更深的阴凉",go:"event_hub"}
 ]
};};
/* 盗贼 · 信任废墟 */
N["v57b_盗贼_trust_1"]=function(){return{
 sceneTitle:"信任废墟 · 失控",
 text:[
  "朋友约你喝酒，说想跟你借点钱周转。你坐在他对面，脑子里却在拆他的话——「周转」是真话还是托词？他是不是听说了你最近得了笔横财？",
  "你喝了一口酒，问：「什么事？」他支吾了一下。你在心里给自己的怀疑加了一分。",
  "他最后说了实话——家里老母病重，钱不够。你听着，第一反应不是心疼，是「他会不会在骗我」。",
  "你借了钱。可你走出酒馆的时候，心里翻来覆去，想的全是「他值不值得信」。你忽然厌恶自己。"
 ],
 options:[
  {t:"站在酒馆门口，回头看那扇门",go:"v57b_盗贼_trust_2"}
 ]
};};
N["v57b_盗贼_trust_2"]=function(){return{
 sceneTitle:"信任废墟 · 面对",
 text:[
  "你站在门口，夜风把你吹醒了一点。你想起那个朋友——你们从小一起长大，他帮你打过架，替你背过锅。",
  "你忽然发现，你不是不信他——你是已经不会「信」了。你把每个人都当成要拆的锁，拆了太多年，拆到连自己人都要掂量三遍。",
  "杜·夜枭在黑井说过：「影子不欠人，也从不被人记住。」可你现在想：不被人记住，也意味着——不被人信任。",
  "你握着你借出去的那袋钱的分量，第一次觉得，它比偷来的还沉。"
 ],
 options:[
  {t:"压制它——试着信一回",go:"v57b_盗贼_trust_3",note:"烙印深度 -1"},
  {t:"接纳它——信人不如信自己",go:"v57b_盗贼_trust_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_盗贼_trust_3"]=function(){return{
 sceneTitle:"信任废墟 · 抉择",
 text:[
  "三天后，朋友来还钱。他站在门口，手里攥着钱袋，脸有点红：「老母没事了。这钱，你点一下。」",
  "你接过钱袋，没有点。你说：「我信你。」",
  "他愣住，然后咧嘴笑了：「你这话，比你借钱给我还让我高兴。」",
  "他走后，你把钱袋收进怀里。你摸了摸那袋钱——它比三天前轻，可你心里那块地方，比三天前重了一点。",
  "你想：也许信任这东西，得先给人，才会回来。你决定，下回他说「周转」，你还借。"
 ],
 options:[
  {t:"把钱袋收好，合上门",go:"event_hub"}
 ]
};};
N["v57b_盗贼_trust_3b"]=function(){return{
 sceneTitle:"信任废墟 · 抉择",
 text:[
  "你没有等他还钱。你告诉自己：钱借出去，就当丢了；人走了，就当没认识过。",
  "你开始把所有关系都记账：谁欠你多少，谁在你背后说过什么，谁的眼神躲了半寸。你记得越清，心越冷，可你觉得，这样才安全。",
  "那袋钱，朋友还了。你接了，点了，数了两遍。他笑你：「怎么，还怕我少还？」你也笑：「习惯了。」",
  "他走的时候，你看着他的背影，忽然想喊住他——但你没有。你合上门，把那句话咽了回去。",
  "影子不欠人。影子也不信人。你对自己说：这样挺好。"
 ],
 options:[
  {t:"合上门，把账本翻到新的一页",go:"event_hub"}
 ]
};};
/* 牧师 · 神恩沉默 */
N["v57b_牧师_silence_1"]=function(){return{
 sceneTitle:"神恩沉默 · 失控",
 text:[
  "你跪在教堂的长椅上，像往常一样祈祷。可你忽然发现，你已经很久没听见「回应」了。",
  "不是声音——是那种被接住的感觉。以前祈祷完，心里会落定一块石头；现在，石头落下去了，却没有落地的声音。",
  "你睁开眼，看着祭坛上那点烛火。它还在烧，可你觉得，它照不到你了。",
  "你跪了很久，膝下的石板又凉又硬。你忽然想：是我离神远了，还是神离我远了？"
 ],
 options:[
  {t:"站起来，把烛火拨亮一些",go:"v57b_牧师_silence_2"}
 ]
};};
N["v57b_牧师_silence_2"]=function(){return{
 sceneTitle:"神恩沉默 · 面对",
 text:[
  "你拨亮烛火，火光跳了一下。你看着它，想起玛格达·静烛在病榻廊说的话：「慈悲不是法术——是一声『哎』。你应下了，病人就觉得自己不是一个人。」",
  "你忽然想：神一直应你，可你最近，有没有应过神？你祈祷的时候，心里装的都是「要」——要护身、要指引、要答案。你多久没跟神说过一句「没事」？",
  "你坐在长椅上，教堂里静得只听见烛火。你忽然觉得，不是神沉默了——是你把话都说完了，忘了留一句给祂答。",
  "你低下头，试着开口，说了句不像祈祷的话：「今天……我挺好的。」"
 ],
 options:[
  {t:"压制它——试着换一种方式祈祷",go:"v57b_牧师_silence_3",note:"烙印深度 -1"},
  {t:"接纳它——神本就沉默",go:"v57b_牧师_silence_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_牧师_silence_3"]=function(){return{
 sceneTitle:"神恩沉默 · 抉择",
 text:[
  "你换了一种祈祷：不再求，只说。说今天路过的孩子、说那个求医的老兵、说你手上新添的茧。",
  "你说了很久，像对着一个老朋友。说到最后，你停住——不是等回应，是忽然觉得，说完了，就行了。",
  "你睁开眼。烛火还亮着，教堂还静着。可你心里那块落不下去的石头，好像自己稳住了。",
  "你站起身，把长椅放好。你不再等神说话——你知道，神在你开口之前，已经听过你说了。"
 ],
 options:[
  {t:"走出教堂，走进日光里",go:"event_hub"}
 ]
};};
N["v57b_牧师_silence_3b"]=function(){return{
 sceneTitle:"神恩沉默 · 抉择",
 text:[
  "你不再试着听见回应。你想：神本就沉默——祂说话的方式，从来不是声音。",
  "你开始学着，在沉默里认祂的回应：病人退烧的额头、风停的那一瞬、你弯腰拾起的一枚铜钱。",
  "你跪在长椅上，不再把话说完。你留半句，像留给一个不说话的人。",
  "烛火跳了一下。你看着它，忽然觉得——祂一直在应你。只是你以前，只听声音，不认沉默。"
 ],
 options:[
  {t:"把烛火留亮，起身离开",go:"event_hub"}
 ]
};};
/* 牧师 · 苦修自罚 */
N["v57b_牧师_penance_1"]=function(){return{
 sceneTitle:"苦修自罚 · 失控",
 text:[
  "今天你又没救下那个人——你赶到的时候，他已经咽气了。你跪在他旁边，把圣光渡进去，只换回一具渐渐凉去的身体。",
  "夜里，你跪在教堂的石板上，没有垫子。膝盖磕得生疼，你觉得——疼才对。你救不下他，就该疼。",
  "你开始数自己这一天的「罪」：来得晚了、圣光慢了一瞬、白天不该分心去想那碗面。",
  "你数着数着，忽然明白：你不是在悔过——你是在罚自己。你把自己当成了那笔债，日夜不停地追着还。"
 ],
 options:[
  {t:"撑着膝盖，站起来",go:"v57b_牧师_penance_2"}
 ]
};};
N["v57b_牧师_penance_2"]=function(){return{
 sceneTitle:"苦修自罚 · 面对",
 text:[
  "你撑着膝盖站起来，腿麻得发颤。你靠在墙上，看着那盏烛火，忽然想起克莱门·圣言在静默间说的话：「最难审的罪，是错判。」",
  "你一直在错判自己。把每一次失败都判成罪，把每一声「来不及」都判成债——你审自己审得太狠，狠到忘了，你也是血肉做的。",
  "你低下头，看着自己磨红的膝盖。你忽然想：如果神要你爱邻人，那你自己——算不算邻人？",
  "你答不上来。你只知道，你跪得太久了。"
 ],
 options:[
  {t:"压制它——把「罪」改成「尽力了」",go:"v57b_牧师_penance_3",note:"烙印深度 -1"},
  {t:"接纳它——痛才能记得责任",go:"v57b_牧师_penance_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_牧师_penance_3"]=function(){return{
 sceneTitle:"苦修自罚 · 抉择",
 text:[
  "第二天，你再去那个人的坟前，没有跪。你站在那里，说了一句：「我来晚了。」",
  "你又说：「可我不会让下一个，也等我来晚。」",
  "你从坟前回来，膝盖还是青的。可你没有再罚自己——你开始把那份痛，换成赶路的速度。",
  "你救下下一个人的时候，看着他睁开眼睛，你忽然明白：神不要你拿痛还债，祂要你把债，变成路。"
 ],
 options:[
  {t:"看着病人睁眼，点了点头",go:"event_hub"}
 ]
};};
N["v57b_牧师_penance_3b"]=function(){return{
 sceneTitle:"苦修自罚 · 抉择",
 text:[
  "你没有改。你想：痛才能记得责任——不痛的人，容易把「尽力」说成「尽力了」。",
  "你开始每天夜里跪那半个时辰。膝盖上结了一层又一层茧，你看着它们，觉得那是你的账本。",
  "你救下的人越来越多。可你记得的，全是没救下的那几个。你把他们的名字，一个一个刻在记忆里，像刻在石板上。",
  "你跪在石板上，膝盖生疼。你对自己说：疼就对了。疼，才记得住，才配得上那声「牧师」。"
 ],
 options:[
  {t:"磕完最后一记，撑着站起身",go:"event_hub"}
 ]
};};
/* 牧师 · 圣言偏执 */
N["v57b_牧师_word_1"]=function(){return{
 sceneTitle:"圣言偏执 · 失控",
 text:[
  "你站在集市口，听一个妇人抱怨她的儿媳：「懒，就知道睡，饭也不会做。」",
  "你开口了——你自己都没反应过来：「经文说，不勤者……」妇人愣住，旁边的人也都看你。",
  "你忽然闭嘴。你刚才想引的，是哪一章哪一节？你记不清。你只是想用经文压住那个妇人——像用石头压住一口冒气的锅。",
  "你退到人群外，脸上发热。你发现自己最近，越来越爱拿经文当尺子，量每一个人——量出来，全是欠量。"
 ],
 options:[
  {t:"退到墙边，低着头",go:"v57b_牧师_word_2"}
 ]
};};
N["v57b_牧师_word_2"]=function(){return{
 sceneTitle:"圣言偏执 · 面对",
 text:[
  "你靠着墙，想起克莱门·圣言那句话：「圣言不是刀。刀会偏，秤不会。」",
  "可你现在，把圣言用成了刀——专挑别人的短处切。你每引用一句经文，其实是在说「我比你干净」。",
  "你忽然明白，圣言偏执不是信得深——是信得窄。你拿经文挡在自己前面，好不用去看那些复杂的、灰色的人。",
  "那个妇人的话还在你耳边：「懒，就知道睡。」——她也许只是累坏了。你连问都没问，就想给她定罪。"
 ],
 options:[
  {t:"压制它——试着先问，再引经文",go:"v57b_牧师_word_3",note:"烙印深度 -1"},
  {t:"接纳它——经文本就是尺",go:"v57b_牧师_word_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_牧师_word_3"]=function(){return{
 sceneTitle:"圣言偏执 · 抉择",
 text:[
  "第二天，你特意去集市找那个妇人，坐在她摊子边上，问了一句：「你儿媳，是哪儿人？」",
  "妇人愣了愣，打开了话匣子——原来那儿媳是北境逃难来的，夜里总做噩梦，睡不好，白天才起得晚。",
  "你听完，什么经文也没引。你说：「她不容易。您多担待。」妇人眼圈红了一下。",
  "你走出集市，觉得胸口那根尺子，松了一些。你对自己说：经文是给人引路的——不是给人量高的。记住了。"
 ],
 options:[
  {t:"走在集市里，不再急着开口",go:"event_hub"}
 ]
};};
N["v57b_牧师_word_3b"]=function(){return{
 sceneTitle:"圣言偏执 · 抉择",
 text:[
  "你没有改。你想：经文本就是尺——圣辉教会立了这么多年的规矩，不是用来打折的。",
  "你开始把那根尺子磨得更利。谁怠惰、谁贪心、谁背誓——你一眼就能量出来，连错都不会错。",
  "可你发现，愿意跟你说话的人，越来越少了。他们看见你，眼神会躲——像学生看见先生手里的戒尺。",
  "你站在集市口，忽然有些空。你握着那根尺，问自己：量尽世人之后，谁量你？"
 ],
 options:[
  {t:"收起尺，独自走回教堂",go:"event_hub"}
 ]
};};
/* 商人 · 契约良心债 */
N["v57b_商人_debt_1"]=function(){return{
 sceneTitle:"契约良心债 · 失控",
 text:[
  "你刚从一桩生意里脱身——那批货，你压低了三个点的价，用的是「银叶城的货成色差」的说法。可你知道，货没问题，是卖货的老头急着给孙子看病。",
  "夜里你翻账本，翻到那一页，笔尖停住了。你想在上面写「已结」，可那三个点像三个窟窿，在纸面上望着你。",
  "你合上账本，躺下，睡不着。你听见自己心里有个声音在记账：压了老头三个点，那老头的孙子，少看一次大夫。",
  "你坐起来，把账本重新翻开。你盯着那行字，迟迟没有落笔。"
 ],
 options:[
  {t:"合上账本，吹灭灯",go:"v57b_商人_debt_2"}
 ]
};};
N["v57b_商人_debt_2"]=function(){return{
 sceneTitle:"契约良心债 · 面对",
 text:[
  "你吹灭灯，可那三个点在黑暗里还亮着。你想起文森·金秤在老账房说的话：「账本可以记亏赚，但人的名字，只能记两样——欠过你的，你欠过的。」",
  "你忽然明白，你欠那老头一笔——不是钱，是「公平」。你压下去的三个点，是拿他的急，换你的赚。",
  "你躺在黑暗里，把那三个点翻来覆去地想。你发现，它比账面上任何一笔亏空都大——因为它不在账本里，在你心里。",
  "你听见自己的心跳。一下，一下。你忽然觉得，那心跳在替那老头记账。"
 ],
 options:[
  {t:"压制它——明天把钱补上",go:"v57b_商人_debt_3",note:"烙印深度 -1"},
  {t:"接纳它——商道本就如此",go:"v57b_商人_debt_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_商人_debt_3"]=function(){return{
 sceneTitle:"契约良心债 · 抉择",
 text:[
  "第二天，你去了那老头的铺子。他看见你，有些局促：「货……有问题？」",
  "你说：「没问题。是我昨天看走了眼——那批货，值原价。」你把补的钱放在他柜台上。",
  "老头愣了很久，然后低头收下，声音有些哑：「谢谢……孙子这月的药，有着落了。」",
  "你走出铺子，翻出账本，在那页写下「已结」。你合上账本，觉得那行字，终于落得实了。",
  "你对自己说：商道不是算盘的路，是还债的路。这条，你记住了。"
 ],
 options:[
  {t:"收好账本，走进日光",go:"event_hub"}
 ]
};};
N["v57b_商人_debt_3b"]=function(){return{
 sceneTitle:"契约良心债 · 抉择",
 text:[
  "你没有补钱。你想：商道本就如此——你情我愿，价高者得。他急着卖，我压着收，这桩生意做得没错。",
  "你在账本上写下「已结」。可那三个点没有消失——它们从纸面上，爬进了你心里。",
  "你开始习惯那种爬行。每次做生意，你都能听见心里有谁在翻账本，一页一页地翻。你告诉自己：翻就翻吧，商人的账本，本就该厚。",
  "你合上账本。夜风从窗外灌进来，你坐着，很久没动。"
 ],
 options:[
  {t:"吹灭灯，把自己交给黑暗",go:"event_hub"}
 ]
};};
/* 商人 · 人情算账 */
N["v57b_商人_tally_1"]=function(){return{
 sceneTitle:"人情算账 · 失控",
 text:[
  "朋友请你去他家吃饭。你坐在他家的饭桌前，眼睛却不由自主地开始「估价」：这张桌子，三年前买的，二手的；那盏灯，旧货，但手艺好；他娘子端菜的姿势，利索，是个能干的——这家人，日子过得紧，但稳。",
  "你夹了一口菜，忽然愣住：你刚才，是在「看朋友」吗？还是在「盘」这一家子？",
  "你放下筷子。朋友问你怎么了，你说「菜烫」。你端起碗，挡着自己的脸。",
  "你发现，你连吃一顿饭，都在记账。"
 ],
 options:[
  {t:"放下筷子，认真看朋友的脸",go:"v57b_商人_tally_2"}
 ]
};};
N["v57b_商人_tally_2"]=function(){return{
 sceneTitle:"人情算账 · 面对",
 text:[
  "你放下筷子，逼自己看朋友的脸——看他笑起来眼角的纹，看他喝酒时眯起的眼，看他跟你说话时，语气里那股没藏住的亲近。",
  "你忽然有些难过：你认识他这么多年，你知道他家的账，却快忘了他是怎样一个人。",
  "灰·珊在金库说过：「管钱的人，其实是在管——谁的日子过不过得下去。」可你现在觉得，你管钱管得太久，快把人管成一行行了。",
  "朋友又给你倒酒，说：「发什么呆？想媳妇了？」你笑骂他。你端起那杯酒，忽然觉得，这杯酒比账本上任何一笔，都值钱。"
 ],
 options:[
  {t:"压制它——今晚不算任何账",go:"v57b_商人_tally_3",note:"烙印深度 -1"},
  {t:"接纳它——万物都可标价",go:"v57b_商人_tally_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_商人_tally_3"]=function(){return{
 sceneTitle:"人情算账 · 抉择",
 text:[
  "那顿饭，你没有再看任何一件东西的价。你只看人，只听话，只喝酒。",
  "朋友喝多了，拍着你的肩说：「你说你这人，平时精得跟鬼一样——也就喝酒的时候，像个活的。」",
  "你笑。你把那杯酒干了，说：「以后多喝。」",
  "你走出朋友家，夜风凉。你翻开账本，在第一页空白处写了一行字：「有些账，不算。」",
  "你合上账本，觉得心里那块算盘珠子，拨得轻了一点。"
 ],
 options:[
  {t:"揣好账本，走回自己的铺子",go:"event_hub"}
 ]
};};
N["v57b_商人_tally_3b"]=function(){return{
 sceneTitle:"人情算账 · 抉择",
 text:[
  "你没有放下那本账。你想：万物都可标价——标得清，才活得清。",
  "你开始给朋友也标价：他值几个铜板？不——他想通了，他不值钱。他值的是「雪中送炭」那一次，值一个「生死之交」的价。",
  "你发现自己能标的东西越来越多了：信任、时间、甚至你自己今晚喝的这杯酒。",
  "你端起酒杯，在心里记下一行：「此杯酒，值一晚上安睡。」你喝完，觉得自己把这顿饭，买得很值。"
 ],
 options:[
  {t:"放下空杯，起身告辞",go:"event_hub"}
 ]
};};
/* 商人 · 天平执念 */
N["v57b_商人_scale_1"]=function(){return{
 sceneTitle:"天平执念 · 失控",
 text:[
  "你把一枚铜钱放在左手心，把自己的一天放在右手心，掂量了一会儿。然后你笑了——笑完，又愣住了。",
  "你刚才真的在掂：今天赚了多少钱，值不值今天的时辰。你在把自己，也往天平上放。",
  "你坐在铺子里，面前的账本摊着。你忽然想：如果这世上所有事都该有等价物——那我这个人，值多少？",
  "你想不出答案。你只算出：你这一生，大概值「若干金」。这个念头，让你心里空了一下。"
 ],
 options:[
  {t:"把铜钱放回钱袋，合上账本",go:"v57b_商人_scale_2"}
 ]
};};
N["v57b_商人_scale_2"]=function(){return{
 sceneTitle:"天平执念 · 面对",
 text:[
  "你合上账本，可那杆秤还在心里晃。你想起洛佩斯·半帆在拍卖行说的话：「拍场主不赚差价，赚的是『成全』。」",
  "可你现在，连自己都要拿来「成全」——把自己标个价，好知道值不值得继续。",
  "你坐在铺子里，看着门外来来往往的人。他们不知道，坐在这扇门后的人，正在盘算自己值几两金。",
  "你忽然想：如果有人告诉娘，她的儿子值若干金——她会高兴吗？你答不上来。你只记得，她喊你回家吃饭的时候，从不算你值多少。"
 ],
 options:[
  {t:"压制它——学着算不算账的日子",go:"v57b_商人_scale_3",note:"烙印深度 -1"},
  {t:"接纳它——天平就是你的眼睛",go:"v57b_商人_scale_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_商人_scale_3"]=function(){return{
 sceneTitle:"天平执念 · 抉择",
 text:[
  "你把那枚铜钱系在账本封面上，当书签。你对自己说：有些东西，不称价。",
  "你开始学着，每天留半个时辰不算账——发呆也好，看云也好，给门口的野猫喂一条小鱼干也好。",
  "猫来吃的时候，你看着它，忽然觉得：它不知道价，但它知道饱。你好像很久没尝过「饱」是什么感觉了。",
  "你蹲在门口，喂完那条小鱼干。你站起来的时候，觉得心里那杆秤，轻了一点。"
 ],
 options:[
  {t:"蹲在门口，又喂了一条",go:"event_hub"}
 ]
};};
N["v57b_商人_scale_3b"]=function(){return{
 sceneTitle:"天平执念 · 抉择",
 text:[
  "你没有摘掉那杆秤。你想：天平就是你的眼睛——它让你看清，这个世界每一件事的价。",
  "你开始把「自己」也放上秤：今天值不值、这趟路值不值、这口气值不值。你称得很勤，勤到你觉得，心里越来越有数。",
  "可有时候，你称完自己，会坐在铺子里，看着门外，发很久的呆。",
  "你给自己标了个价。你告诉自己：这个价，是给外人看的。门关上以后，你还有个不标价的自己——只是他很少出来。"
 ],
 options:[
  {t:"合上门，把秤收进抽屉",go:"event_hub"}
 ]
};};


/* ===== v57inj:brandNodes1 ===== */
/* 魔法师 · 禁咒反噬 */
N["v57b_魔法师_rebound_1"]=function(){return{
 sceneTitle:"禁咒反噬 · 失控",
 text:[
  "你放完那记法术，站在原地，忽然觉得手心发痒。低头看——掌心的纹路里，爬满了细小的裂痕，像干裂的河床。",
  "法术的余温还在指尖。你试着握拳，指尖却开始不听使唤地抖。你想起书上那句话：元素不喜欢被命令——它记着每一道命令，也会记得每一道伤。",
  "那裂痕不痛。可你看着它，心里却泛起一阵凉：它是什么时候开始的？你最后一次用尽全力施法，是三天前——还是两天前？你记不清了。",
  "你第一次意识到：力量从你身上流过的时候，也在你身上留下了什么。"
 ],
 options:[
  {t:"查看掌心，试着平复它",go:"v57b_魔法师_rebound_2"}
 ]
};};
N["v57b_魔法师_rebound_2"]=function(){return{
 sceneTitle:"禁咒反噬 · 面对",
 text:[
  "你盘腿坐下，试着把法力压回丹田。裂痕像有自己的意志，越压越深——你越是用力，它越往骨头里钻。",
  "你不禁想起洛·晨雾在观星台说的话：「元素不喜欢被命令。理解它的人，会被它记住；命令它的人，会被它反噬。」",
  "原来反噬不是报应——是提醒。它提醒你：这条路你走得太快，快到忘了每一道法术背后，都有代价在跟着。",
  "裂痕还在。你忽然不再用力了。你只是摊开手掌，看着它，像看一个闯了祸的孩子。"
 ],
 options:[
  {t:"压制它——用痛换回平静",go:"v57b_魔法师_rebound_3",note:"烙印深度 -1"},
  {t:"接纳它——这是你走路的证据",go:"v57b_魔法师_rebound_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_魔法师_rebound_3"]=function(){return{
 sceneTitle:"禁咒反噬 · 抉择",
 text:[
  "你咬紧牙，把裂痕一寸一寸压回血脉深处。痛像针一样从掌心扎到胸口，你闷哼一声，额头沁出汗。",
  "裂痕淡了。可你清楚，它没消失——它只是沉下去了，等下一次。",
  "你站起来，掌心发白。力量还在，但你知道，这条路你欠了一份。"
 ],
 options:[
  {t:"记住这份痛，继续前行",go:"event_hub",note:"已压制"}
 ]
};};
N["v57b_魔法师_rebound_3b"]=function(){return{
 sceneTitle:"禁咒反噬 · 抉择",
 text:[
  "你看着掌心的裂痕，没有去压它。你想：这是我施法留下的印子——就像剑客手上的茧，铁匠掌心的烫痕。",
  "你把手掌收进袖子里。裂痕还在，可你不再觉得它是伤——它是这条路的年轮。",
  "从今天起，你施法时，裂痕会发烫。像一双眼睛，在你血脉深处睁开。"
 ],
 options:[
  {t:"带着它，继续前行",go:"event_hub",note:"已接纳"}
 ]
};};
/* 魔法师 · 知识渴求 */
N["v57b_魔法师_thirst_1"]=function(){return{
 sceneTitle:"知识渴求 · 失控",
 text:[
  "夜里你醒来，发现自己站在书架前——手里捏着一卷没拆封的旧典，封皮上的火漆已经裂了。",
  "你不记得自己什么时候下床的。指尖抵着火漆的裂口，你的心跳却快得像跑完了一场长路。",
  "这卷典，是老师嘱咐过「三年后再看」的那种。你一直知道它放在哪——你只是没想过，自己会在睡着的时候，走来拿它。",
  "火漆的裂口在你指下又大了一分。你听见自己咽口水的声音。"
 ],
 options:[
  {t:"放下书，退开三步",go:"v57b_魔法师_thirst_2"}
 ]
};};
N["v57b_魔法师_thirst_2"]=function(){return{
 sceneTitle:"知识渴求 · 面对",
 text:[
  "你放下那卷典，退回床上，却睡不着。脑子里全是火漆裂口的纹路——仿佛那上面写着字，而你在隔着一层纸读它。",
  "你想起伊尔·灰书在禁书区说的话：「禁书区不是禁书——是禁『念出声』。这里的书，每本都在等一个敢听的人。」",
  "可你忽然明白，知识渴求不是想听——是想占有。你想把那些字全部拆开、吞下去、变成自己的。这种想法让你害怕：它不像求知，像饿。",
  "窗外的月光照在书架上。那卷典静立着，火漆的裂口像一道没愈合的伤口。"
 ],
 options:[
  {t:"压制它——把它放回最深处",go:"v57b_魔法师_thirst_3",note:"烙印深度 -1"},
  {t:"接纳它——求知就是你的命",go:"v57b_魔法师_thirst_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_魔法师_thirst_3"]=function(){return{
 sceneTitle:"知识渴求 · 抉择",
 text:[
  "你起身，把那卷典包了三层布，塞进箱子最底。你告诉自己：三年后，你会光明正大地拆开它——以配得上它的身份。",
  "夜里你还是会醒来一两次，手在枕边摸了个空。但你知道，那是你给自己的回答：知识可以等，你不可以偷。",
  "那一晚，你睡得很浅。但天亮的时候，你觉得自己比昨夜干净一点。"
 ],
 options:[
  {t:"整理好衣冠，开始新的一天",go:"academy_elda_hub"}
 ]
};};
N["v57b_魔法师_thirst_3b"]=function(){return{
 sceneTitle:"知识渴求 · 抉择",
 text:[
  "你站在书架前，重新把那卷典拿起来，拆开火漆。你想：既然它来找我，那我就不躲了。",
  "你借着月光，一页一页读下去。有些字你读不懂，有些字读懂了又忘——可你心底有个声音说：这就是你该走的路。",
  "天亮时，你已经能背下第一页的第三行。火漆的碎片散在脚边，像一扇门被推开。"
 ],
 options:[
  {t:"合上书页，开始新的一天",go:"academy_elda_hub"}
 ]
};};
/* 魔法师 · 孤塔症 */
N["v57b_魔法师_tower_1"]=function(){return{
 sceneTitle:"孤塔症 · 失控",
 text:[
  "同学喊你去酒馆，你拒绝了。室友问你怎么了，你说「在研读」。门关上以后，你才发现自己已经三天没和活人说过一句完整的话。",
  "不是不想说。是觉得——他们的话太吵，绕，没有书页上的字干净。你宁愿对着烛火坐一晚上，也不愿去猜一个人话里的三成真意。",
  "你坐在窗边，看着楼下的人来来往往。他们笑、他们吵、他们搂着肩膀走远。你忽然觉得，自己像在塔顶看一场与自己无关的戏。",
  "这个念头让你心里一紧：你是什么时候，开始这么看人的？"
 ],
 options:[
  {t:"推开窗，试着听楼下的人声",go:"v57b_魔法师_tower_2"}
 ]
};};
N["v57b_魔法师_tower_2"]=function(){return{
 sceneTitle:"孤塔症 · 面对",
 text:[
  "你推开窗。楼下的声音涌进来——卖糖的吆喝、孩子的哭、两个老妇人压轻声音的闲话。吵，但活。",
  "你想起老师说过的一句话：法师不是把自己关进塔里，是把自己放进世界里，再用塔来安放。可你现在，塔比世界大。",
  "楼下有个卖花的孩子仰头看你的窗，喊了一声：「大哥哥，买枝花吗？很便宜的。」你愣住了——你有多久，没被一个活人这么直接地喊过了。",
  "你手里捏着书页，忽然觉得它很轻。"
 ],
 options:[
  {t:"压制它——把门留一道缝",go:"v57b_魔法师_tower_3",note:"烙印深度 -1"},
  {t:"接纳它——孤塔是你选择的路",go:"v57b_魔法师_tower_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_魔法师_tower_3"]=function(){return{
 sceneTitle:"孤塔症 · 抉择",
 text:[
  "你下楼，买下那枝花——最便宜的一枝。孩子笑着跑开了，你握着花站在街边，闻了一下。有土味，也有活气。",
  "你把花插在书桌上的空墨水瓶里。它不会开多久，可你决定：以后每三天，下楼一次，买一枝，听一听人声。",
  "塔门没有关死。你在塔顶，留了一道缝——给风，给人声，给那些吵吵嚷嚷、活着的日子。"
 ],
 options:[
  {t:"回到书桌前，翻开书页",go:"academy_elda_hub"}
 ]
};};
N["v57b_魔法师_tower_3b"]=function(){return{
 sceneTitle:"孤塔症 · 抉择",
 text:[
  "你没有买花，也没有关窗。你想：既然孤塔是我的路，那我就把塔盖得足够高——高到人声成不了打扰，高到世界只余法则。",
  "你回到书桌前，把那枝花从墨水瓶里拿出来，放回楼下——你不欠它。你欠的，只是你自己一条更清净的路。",
  "窗外的声音还在。但你听它们的时候，已经像听远处的潮水——听得见，却不沾身。",
  "你在书页上写下今天的第一行批注。塔顶很静。静得正好。"
 ],
 options:[
  {t:"合上窗，沉入书页",go:"academy_elda_hub"}
 ]
};};
/* 灵魂法师 · 魂灯燃烧 */
N["v57b_灵魂法师_burn_1"]=function(){return{
 sceneTitle:"魂灯燃烧 · 失控",
 text:[
  "战斗结束后，你瘫坐在墙角，摊开手掌。魂灯的青色光晕在指尖跳了一下，然后灭了。",
  "你盯着自己的指尖，忽然想不起刚才那记魂术是怎么放出去的——像有一段记忆被谁从中间抽走了，两头还在，中间空了。",
  "澜·梦墟在灯廊说过：「魂灯不灭。可灯要烧，总得添油——你的记忆，就是油。」",
  "你试着回想昨天中午吃了什么。想起来了。可你心底有个声音说：也许总有一天，你想不起来的事，会多过想起来的。"
 ],
 options:[
  {t:"试着召回那截记忆",go:"v57b_灵魂法师_burn_2"}
 ]
};};
N["v57b_灵魂法师_burn_2"]=function(){return{
 sceneTitle:"魂灯燃烧 · 面对",
 text:[
  "你闭上眼，往记忆深处走。刚才那场战斗还在——对手的脸、风的方向、你放魂术时指尖的感觉。可再往前，就是一片空白，像纸被撕过。",
  "你睁开眼。空白没有回来。你忽然明白了：那不是忘——是被烧了。魂灯替你挡下了什么，代价是从你这里取走了一段。",
  "你低头看着掌心的灯痕。它还是青色的，静静地燃着。你第一次觉得，这盏灯又暖、又冷。",
  "你听见自己问自己：为了那场胜利，烧掉一段日子——值吗？"
 ],
 options:[
  {t:"压制它——以后少用全力",go:"v57b_灵魂法师_burn_3",note:"烙印深度 -1"},
  {t:"接纳它——魂灯替你烧掉的就烧掉吧",go:"v57b_灵魂法师_burn_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_灵魂法师_burn_3"]=function(){return{
 sceneTitle:"魂灯燃烧 · 抉择",
 text:[
  "你决定：从今天起，魂术留三分力。哪怕赢得慢一点、险一点，也要让灯芯烧得省一点。",
  "你从怀里摸出一本旧册子——那是你从醒事起，零零碎碎记下的日子。你翻开，补了一行：「今天想起，昨天中午吃的是一碗面。」",
  "澜·梦墟说过，灯记得每一个为它回答过问题的人。你现在明白了另一句：灯也记得，谁替自己省过油。",
  "你把册子收好。掌心的灯痕还在，但你知道，从今天起，你烧灯的时候，会先掂一掂油。"
 ],
 options:[
  {t:"收好册子，站起身",go:"event_hub"}
 ]
};};
N["v57b_灵魂法师_burn_3b"]=function(){return{
 sceneTitle:"魂灯燃烧 · 抉择",
 text:[
  "你没有去追那截空白的记忆。你想：魂灯替你烧掉一段日子，那一定是那段日子……它觉得不该留着。",
  "你把掌心摊开，对着灯痕说：「烧吧。我信你。」",
  "灯痕亮了一瞬。你感到一种奇异的轻——像卸下了什么你从没意识到自己背着的东西。",
  "从今天起，你放魂术的时候不再留手。灯芯烧得旺，你记得的事变少——可你还记得自己是守灯人，这就够了。"
 ],
 options:[
  {t:"站起身，走向下一场战斗",go:"event_hub"}
 ]
};};
/* 灵魂法师 · 众生厌离 */
N["v57b_灵魂法师_loathe_1"]=function(){return{
 sceneTitle:"众生厌离 · 失控",
 text:[
  "酒馆里人声鼎沸，你却坐在最角落，端着酒杯，看着每一个人。",
  "不是看脸——是看灵魂的颜色。那个大声说笑的商人，魂是灰的，压着三成谎；那个殷勤倒酒的小二，魂是青的，饿着；那个倚在窗边的旅人，魂缺了一角，不知道丢在了哪条路上。",
  "你越看越静，静到酒馆的声音像隔了一层水。你忽然想：这些人，他们自己知道自己是这样的吗？",
  "你知道答案：不知道。这就是你厌离的来源——你看得见，他们看不见。"
 ],
 options:[
  {t:"放下酒杯，收回视线",go:"v57b_灵魂法师_loathe_2"}
 ]
};};
N["v57b_灵魂法师_loathe_2"]=function(){return{
 sceneTitle:"众生厌离 · 面对",
 text:[
  "你放下酒杯，可那些颜色还浮在眼前。你试着不看，反而看得更清楚——像一层褪不掉的膜。",
  "雷·娜在契约堂说过：「链接不是束缚，是彼此照看。」可你现在觉得，照看太累——你看得见每个人的缺口，却补不上任何一个。",
  "你坐在角落，一杯酒从热放到凉。你忽然明白，厌离不是恨——是无力。你看见了，却够不着。",
  "窗外有人唱起歌，跑调得厉害，满酒馆都笑了。你听着那跑调的歌，心里却松了一分。"
 ],
 options:[
  {t:"压制它——试着喝一杯热的",go:"v57b_灵魂法师_loathe_3",note:"烙印深度 -1"},
  {t:"接纳它——看得见的人本来就孤独",go:"v57b_灵魂法师_loathe_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_灵魂法师_loathe_3"]=function(){return{
 sceneTitle:"众生厌离 · 抉择",
 text:[
  "你要了一杯热的。酒馆的伙计端来时，手忙脚乱洒了半杯，连声道歉。你说「没事」，他松了口气，跑开时还回头冲你笑了一下。",
  "你端着那半杯酒，忽然觉得那个伙计的魂，从青转亮了一点。",
  "你喝完那杯酒，起身离开。走到门口时，你回头看了一眼——满酒馆的人还在笑、还在吵、还在活。",
  "你对自己说：看得见，就多看一会儿。别急着厌。"
 ],
 options:[
  {t:"推门走进夜色",go:"event_hub"}
 ]
};};
N["v57b_灵魂法师_loathe_3b"]=function(){return{
 sceneTitle:"众生厌离 · 抉择",
 text:[
  "你没有再要酒。你坐在角落，把每一个人的灵魂颜色都看了一遍——灰的、青的、缺角的、亮着的。",
  "你想：众生如此，我看见，是我的眼睛；我不去救，是我的分寸。两者我都认。",
  "你起身离开。身后酒馆的热闹像退潮一样落下去。你走在夜风里，第一次觉得，孤独也可以是干净的。",
  "从今天起，你看人时会多看一层——但你不再伸手。你看得见的，都记着；你够不着的，都放过。"
 ],
 options:[
  {t:"独自走进夜色",go:"event_hub"}
 ]
};};
/* 灵魂法师 · 镜中无人 */
N["v57b_灵魂法师_mirror_1"]=function(){return{
 sceneTitle:"镜中无人 · 失控",
 text:[
  "你在晨曦圣殿的镜厅停下脚步，想整理衣冠。镜子里有人——可你盯着那张脸，足足看了三息，才认出那是自己。",
  "不是长相变了。是那张脸像隔了一层雾，雾后面的人影淡得几乎看不出轮廓。你试着皱眉，镜中人也皱眉——可你觉得，那是镜中人在学你。",
  "乌·森在镜厅说过：「很多人一辈子都没开过自己的心门。」你现在想：也许有些人开着门走进去，就再没出来过。",
  "你伸手摸上镜面。镜面是凉的。镜中人的手，和你隔着玻璃贴在一起。"
 ],
 options:[
  {t:"盯着镜中人的眼睛，喊自己的名字",go:"v57b_灵魂法师_mirror_2"}
 ]
};};
N["v57b_灵魂法师_mirror_2"]=function(){return{
 sceneTitle:"镜中无人 · 面对",
 text:[
  "「我。」你喊了一声。镜中人动了动嘴唇，没发出声音。",
  "你忽然想起来——你有多久没喊过自己的名字了？别人喊你，你应；可你自己喊自己，是多久以前的事了？",
  "魂灯燃烧，烧的是记忆；众生厌离，隔的是人群；而镜中无人——是这两样叠在一起：你记得的事少了，你看见的人远了，于是你自己，也跟着淡了。",
  "你站在镜前，忽然有些怕：如果连自己都喊不回来，那这盏灯，到底是谁在守？"
 ],
 options:[
  {t:"压制它——用力记住自己",go:"v57b_灵魂法师_mirror_3",note:"烙印深度 -1"},
  {t:"接纳它——淡了就淡了",go:"v57b_灵魂法师_mirror_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_灵魂法师_mirror_3"]=function(){return{
 sceneTitle:"镜中无人 · 抉择",
 text:[
  "你从怀里摸出那本旧册子——记日子的那本。你翻开，从第一页开始念自己的名字，念了三遍。",
  "第一遍，镜中人皱了皱眉。第二遍，镜中人张了张嘴。第三遍，你听见自己回答了一声「在」。",
  "你把册子揣回怀里。从那以后，你每天晨起第一件事：对着水盆喊自己的名字，答一声「在」。",
  "灯要烧，油要省；人要走，名要记。这是你给自己定的规矩。"
 ],
 options:[
  {t:"记好这个名字，走出镜厅",go:"event_hub"}
 ]
};};
N["v57b_灵魂法师_mirror_3b"]=function(){return{
 sceneTitle:"镜中无人 · 抉择",
 text:[
  "你看着镜中那个淡得几乎看不出轮廓的人，忽然觉得：淡就淡吧。守灯的人不需要太浓——灯亮着，就行。",
  "你不再试着喊回自己。你转身走出镜厅，身后那面镜子照着你——镜中人跟了几步，在你跨出门槛的瞬间，停住了。",
  "你知道它停在镜子里了。可你也知道，你还能走、还能看、还能守灯——这就够了。",
  "从这天起，你不再照镜子。你的样子，在别人的眼睛里，也在灯焰里。"
 ],
 options:[
  {t:"头也不回，走出镜厅",go:"event_hub"}
 ]
};};
/* 术士 · 造物反噬 */
N["v57b_术士_backlash_1"]=function(){return{tag:"branch",
 sceneTitle:"造物反噬 · 失控",
 text:[
  "半夜，你被一声轻响惊醒。睁眼——你三天前造的那具铜鸟，正站在窗台上，歪着头看你。",
  "你没给它装过「走动」的指令。可它自己走到窗台上了。你坐起来，它扑棱一下飞起来，落在床尾，又歪头看你。",
  "火克在构装库说过：「造出来的东西，会自己长大。你越攥着，它越不认得你。」你当时觉得是句闲话。现在，铜鸟的眼睛在月光下亮着，像在问你一个问题。",
  "你伸出手。铜鸟没有躲。"
 ],
 options:[
  {t:"伸出手，让它落上来",go:"v57b_术士_backlash_2"}
 ]
};};
N["v57b_术士_backlash_2"]=function(){return{tag:"branch",
 sceneTitle:"造物反噬 · 面对",
 text:[
  "铜鸟落在你手上，爪子轻的。它歪着头，啄了一下你的指尖——不痛，像在打招呼。",
  "你忽然发现，它的关节不是按你设定的轨迹在动——是自己在找平衡。你造它的时候，只给了它翅膀和骨架，没给它脑子。可它现在，有了自己的「走法」。",
  "这让你既觉得新奇，又觉得发毛：它记得你。可它记得的，是你还是「造它的手」？",
  "你盯着铜鸟的眼睛，铜鸟也盯着你。月光下，一人一鸟，谁也没先动。"
 ],
 options:[
  {t:"压制它——拆掉它，重新来过",go:"v57b_术士_backlash_3",note:"烙印深度 -1"},
  {t:"接纳它——让它长大",go:"v57b_术士_backlash_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_术士_backlash_3"]=function(){return{tag:"branch",
 sceneTitle:"造物反噬 · 抉择",
 text:[
  "你把它拆了。铜片、齿轮、发条，一样一样摆在桌上。你拆得很慢，铜鸟没有挣扎——它只是在你拆到翅膀的时候，抖了抖了一下。",
  "你告诉自己：造物必须可控。反噬的代价，不该由一条条铜线来担。",
  "可你收好最后一片铜的时候，手指顿了顿。你把它单独放进一只木盒里——没有熔掉它。你说不清为什么。",
  "窗台空了。你睡下的时候，总觉得缺了什么。"
 ],
 options:[
  {t:"收好木盒，躺下",go:"event_hub"}
 ]
};};
N["v57b_术士_backlash_3b"]=function(){return{tag:"branch",
 sceneTitle:"造物反噬 · 抉择",
 text:[
  "你没有拆它。你把它放回窗台上，让它待着。",
  "铜鸟在窗台上站了一会儿，忽然自己展开翅膀，飞了一圈，又落回原处。它没有飞走——它选择了留下来。",
  "你看着它，忽然懂了火克那句话：「放手，不是不管它，是相信它长成了自己的样子。」",
  "你从工具箱里摸出一枚小铜铃，系在它爪上。铜鸟低头啄了啄铃铛，发出清脆的一声响。",
  "从这天起，你的造物都多了一枚铃。铃响的时候，你知道它们还在——还在长大，还在记得你。"
 ],
 options:[
  {t:"看着铜鸟，熄灯睡下",go:"event_hub"}
 ]
};};
/* 术士 · 材料执念 */
N["v57b_术士_material_1"]=function(){return{
 sceneTitle:"材料执念 · 失控",
 text:[
  "你在集市里走着，忽然停住——前面那个挑柴的汉子，肩膀的弧度、骨节的走向，在你的眼睛里自动拆成了数据：可锻性、承重、韧性。",
  "你的脚钉在了原地。你刚才不是在打量人——是在估一件「材料」。这个念头让你后背发凉。",
  "你退回一步，试着看他的脸。可你的眼睛像有自己的主意，还在拆他的骨架，甚至开始想：这双手，打铁的话，能打多少年。",
  "汉子发现你盯着他，警惕地握紧了柴担。你移开视线，手心全是汗。"
 ],
 options:[
  {t:"别过头，快步走开",go:"v57b_术士_material_2"}
 ]
};};
N["v57b_术士_material_2"]=function(){return{
 sceneTitle:"材料执念 · 面对",
 text:[
  "你躲进巷子里，背靠着墙，喘了几口气。你的眼睛还在发痒——它还想继续看。",
  "梅·炽芯在药室说过：「点金不是看价钱——是看命数。」你忽然明白，你的手和眼睛看多了「物性」，已经快要分不清，人和物的界线在哪。",
  "你举起自己的手，翻来覆去地看。你能说出它每根骨头的受力，却一时想不起，它上一次拍别人的肩膀，是什么时候。",
  "巷子口有人喊你的名字——是朋友。你张了张嘴，差点答成「承重，八十斤」。"
 ],
 options:[
  {t:"压制它——试着只看人的脸",go:"v57b_术士_material_3",note:"烙印深度 -1"},
  {t:"接纳它——物性就是你的眼睛",go:"v57b_术士_material_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_术士_material_3"]=function(){return{
 sceneTitle:"材料执念 · 抉择",
 text:[
  "你迎着朋友走过去，逼自己看他的脸——看他笑起来眼角的纹路，看他胡茬的走向，看他说「走，喝酒去」时牙齿的白。",
  "你看得很用力，用力到朋友问你：「你今天怎么怪怪的？」",
  "你说：「没什么，就是——想看看你。」朋友笑骂你神经，拉着你往酒馆走。",
  "你搭着他的肩，手心慢慢松了。你对自己说：人可以看，但不能看成材料。记住了。"
 ],
 options:[
  {t:"跟着朋友，走进酒馆",go:"event_hub"}
 ]
};};
N["v57b_术士_material_3b"]=function(){return{
 sceneTitle:"材料执念 · 抉择",
 text:[
  "你没有去见朋友。你站在巷子里，让自己的眼睛继续看——看砖缝的咬合，看檐角的受力，看这整条巷子在一百年里怎么慢慢歪斜。",
  "你想：人的骨架和砖缝，确实都是材料。区别只在于——你愿不愿意承认，你自己也是。",
  "你举起手，看着自己的掌纹：「你也是材料。会锈，会裂，会折旧。」你这么说的时候，心里反而静了。",
  "你走出巷子时，脚步很稳。从今天起，你看世界用物性的眼睛——包括看你自己。这让你清醒，也让你孤独。"
 ],
 options:[
  {t:"走进集市，继续走你的路",go:"event_hub"}
 ]
};};
/* 术士 · 熔炉孤火 */
N["v57b_术士_furnace_1"]=function(){return{
 sceneTitle:"熔炉孤火 · 失控",
 text:[
  "你坐在熔炉边，炉火把你的影子拉得很长。你已经在这坐了一夜——不是打铁，只是坐着，看火。",
  "炉火很暖。比人暖。火不会问你今天过得怎么样，不会要你回答，不会在你答错的时候皱眉。它就烧着，很安静，很可靠。",
  "你忽然意识到：你最近跟炉火说的话，比跟人多。你跟它说铁太脆、说模具裂了、说今天的手感不对——它都听着，不打断。",
  "你伸手，指尖离炉火一寸。火苗朝你这边弯了弯，像在回应。"
 ],
 options:[
  {t:"收回手，起身去找人说话",go:"v57b_术士_furnace_2"}
 ]
};};
N["v57b_术士_furnace_2"]=function(){return{
 sceneTitle:"熔炉孤火 · 面对",
 text:[
  "你起身，走到门口，又停住了。去找谁呢？你想了一圈——同门的师兄弟在喝酒，师父在议事，那个常来买剑的旅人，明天才到。",
  "你站在门口，夜风扑在脸上。你忽然发现，你连「想找个人说话」的时候，第一个想到的，都是炉火。",
  "格朗·符文在熔炉大厅说过：「炉火不骗人，它只认手。」你现在觉得，它也不哄人——它就是烧着，给你暖，不要你的回应。",
  "可人不是炉火。人需要回应。你多久没有被人好好回应过了？你答不上来。"
 ],
 options:[
  {t:"压制它——走进人声里去",go:"v57b_术士_furnace_3",note:"烙印深度 -1"},
  {t:"接纳它——炉火就是你的伴",go:"v57b_术士_furnace_3b",note:"烙印深度 +1，加成翻倍"}
 ]
};};
N["v57b_术士_furnace_3"]=function(){return{
 sceneTitle:"熔炉孤火 · 抉择",
 text:[
  "你走进同门的酒桌。他们看见你，愣了一下，然后有人喊：「铁疙瘩终于出洞了！」满桌人都笑了。",
  "你坐下来，有人给你倒酒。你说了一句「今天铁打得不错」，他们接话、起哄、又扯到别的事上。没人追问你这一夜在想什么——可这热闹，是活的。",
  "酒是辣的，话是吵的。你握着酒杯，忽然觉得，炉火是暖，人声是烫——烫得你有点想躲，可你又坐住了。",
  "你喝完那杯酒，答应明天再来看他们打铁。你往回走的时候，炉火还烧着——可你知道，你该让它烧，不该让它替你把人都挡在外头。"
 ],
 options:[
  {t:"带着酒意，回到炉边睡下",go:"event_hub"}
 ]
};};
N["v57b_术士_furnace_3b"]=function(){return{
 sceneTitle:"熔炉孤火 · 抉择",
 text:[
  "你没有走进人声。你回到炉边坐下，让火继续陪着你。",
  "你想：人各有各的伴。有人要酒，有人要剑，有人要一整座闹市——而我要的，就是一炉火。它不吵、不走、不问我值不值。",
  "你从怀里摸出一块铁，放进炉里烧。火光映着你的脸，你把心里那句没人可说的话，对着火说了一遍。",
  "火听着。火一直听着。你忽然觉得，这世上能这样听你说话的东西，其实不多——你有了一个，就够了。"
 ],
 options:[
  {t:"靠着炉火，闭眼睡去",go:"event_hub"}
 ]
};};


/* ===== v57inj:flowNodes2 ===== */
/* 骑士 三流派 */
N["v57f_骑士_blade_1"]=function(){return{
 sceneTitle:"圣辉之刃 · 圣地 · 穹顶之下",
 text:[
  "大教堂的穹顶很高，高到光落下来的时候，已经变成细碎的金尘。",
  "伊莎·晨辉跪在祭坛前，剑横在膝上。她听见你的脚步声，没回头：「圣辉之刃的路，不在剑上，在光里。」",
  "「光会照到好人，也会照到坏人。」她站起来，转身看你，「你要学的不是让光只照一边——是学会在光里，看清两边的脸。」",
  "她把剑递到你面前：「握着它，站到光里。让光先照你——你再决定，这一剑怎么出。」"
 ],
 options:[
  {t:"接过剑，站进光里",go:"v57f_骑士_blade_2"}
 ]
};};
N["v57f_骑士_blade_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_blade",2);
  return{
 sceneTitle:"圣辉之刃 · 圣地 · 试炼",
 text:[
  "你握剑站进光里。光并不温暖——它太亮了，亮得让你看清自己手上的每一道旧茧，还有心里那些不干净的地方。",
  "伊莎·晨辉站在光外，声音平静：「看见了？圣辉不遮丑。它照出来的，就是你本来的样子。」",
  "「圣辉之刃的规矩：出剑之前，先让自己站在光里照一遍。照得久了，你就分得清——哪一剑是为了圣辉，哪一剑是为了自己。」",
  "你握着剑，站在光里，第一次没有急着收剑。光落在你肩上，像一双不偏不倚的眼睛。"
 ],
 options:[
  {t:"收剑，谢过她",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_骑士_blade_3"}
  ]
};};
N["v57f_骑士_oath_1"]=function(){return{tag:"branch",
 sceneTitle:"誓约之盾 · 圣地 · 誓堂",
 text:[
  "誓约骑士团的誓堂里，四面墙上刻满了名字——每一个名字下面，都刻着一句誓词。",
  "罗兰·白盾站在最老的那面墙前，手指拂过一个名字：「这是创道者的誓：『我以我身为盾，护持吾誓。』他守了一辈子，死在北境——盾还在，人没了。」",
  "他转身看你：「你要立誓约之盾的誓，先想清楚：你愿意为一句说出口的话，赔上一辈子吗？」"
 ],
 options:[
  {t:"愿意——说出口的，就是命",go:"v57f_骑士_oath_2"},
  {t:"还在想——誓言不该轻易出口",go:"v57f_骑士_oath_2"}
 ]
};};
N["v57f_骑士_oath_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_oath",2);
  return{
 sceneTitle:"誓约之盾 · 圣地 · 试炼",
 text:[
  "罗兰·白盾听完你的话，没急着评判。他取下一面旧盾，交到你手里。",
  "「不管你怎么答，盾先给你。」他说，「誓约之盾不是让你多立誓——是让你把已立的誓，立得更重。」",
  "「旧盾上的划痕，每一道都是一次守约。」他指着盾面上的一道深痕，「创道者说过：盾不是用来挡刀，是用来证明——有人说过的话，算数。」",
  "你接过旧盾。盾很沉，比看起来沉得多。你忽然明白，沉的不是铁，是那句「算数」。"
 ],
 options:[
  {t:"背起旧盾，走出誓堂",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_骑士_oath_3"}
  ]
};};
N["v57f_骑士_walk_1"]=function(){return{
 sceneTitle:"巡游者 · 圣地 · 西境古道",
 text:[
  "西境古道上一棵老槐树下，艾·德正蹲着给一个走丢的孩子擦脸。孩子哭累了，趴在他膝上睡着了。",
  "他看见你，竖指在唇边嘘了一声，才轻声说：「巡游者的路，就是这条道。没有城墙，没有圣殿——走到哪，守到哪。」",
  "「你看这个孩子。」他低头，「他爹在铁门关守了三年，他妈在镇上浆洗。没人守这条道，他们一家就散了。」",
  "他拍了拍身边的地：「坐下。陪我等这孩子的娘来。」"
 ],
 options:[
  {t:"坐下，一起等",go:"v57f_骑士_walk_2"}
 ]
};};
N["v57f_骑士_walk_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_knight_walk",2);
  return{
 sceneTitle:"巡游者 · 圣地 · 试炼",
 text:[
  "你们等到日头偏西，孩子的娘才赶到。她抱着孩子哭了很久，抬头要给艾·德磕头——被他扶住了。",
  "「不用谢。」艾·德说，「我刚好路过。」",
  "等母子走远，他看着那条空荡荡的古道，说：「巡游者没有誓堂，没有驻地。我们立的誓，都立在路上——路记得。」",
  "他解下腰间一枚旧铃铛，递给你：「拿着。以后你走到哪，铃响到哪。你帮过的人，会记得这个声音——这就够了。」",
  "你接过铃铛。风一吹，铃铛轻响了一声，像一句没说完的「路过」。"
 ],
 options:[
  {t:"收好铃铛，继续上路",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_骑士_walk_3"}
  ]
};};
/* 游侠 三流派 */
N["v57f_游侠_hunt_1"]=function(){return{
 sceneTitle:"猎杀之道 · 圣地 · 白桦林",
 text:[
  "白桦林的雪很厚，厚到脚步落下去没有声音。艾琳·逐风靠在一棵白桦上，手里握着一支没射出去的箭。",
  "「猎杀之道。」她声音很轻，「不是杀得多，是记得清。你杀过的每一头猎物，它死前的样子，你都得记住——不然，你会把人也当成猎物。」",
  "她抬起手，指着雪地上的一串脚印：「看。这是鹿的脚印，不是逃命的速度——它不急，它在找吃的。猎人要读脚印，更要读脚印里的日子。」",
  "她把箭递给你：「去。顺着脚印走，找到它，但别射——我要你看看，看得清和杀得掉，哪个更难。」"
 ],
 options:[
  {t:"接过箭，循着脚印走",go:"v57f_游侠_hunt_2"}
 ]
};};
N["v57f_游侠_hunt_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_hunt",2);
  return{
 sceneTitle:"猎杀之道 · 圣地 · 试炼",
 text:[
  "你顺着脚印走了半里路，在一丛灌木后看见了那头鹿。它低头啃雪下的草，耳朵偶尔动一下——它不知道自己被跟了这么久。",
  "你握着箭，拇指抵着箭羽，像平时瞄准那样。但你没有射。你看它吃草、看它抬头、看它用蹄子刨开积雪。",
  "你退回来的时候，艾琳·逐风在桦树下等你。「看完了？」她问。",
  "「看完了。」你说。",
  "「记住这个。」她说，「猎杀之道的第一课不是射箭，是看清楚你瞄准的是什么。看得越清，你出手越干净——也越少后悔。」",
  "她没收回那支箭。「留着。它记得今天。」"
 ],
 options:[
  {t:"收好箭，离开白桦林",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_游侠_hunt_3"}
  ]
};};
N["v57f_游侠_ward_1"]=function(){return{
 sceneTitle:"守望者 · 圣地 · 古树根",
 text:[
  "银叶城外的古树根下，贺·断弓盘腿坐着，面前摊着七颗石子。他听见你来，没睁眼：「守望者，守的不是树，是根。」",
  "「树会倒，根不会。」他拈起一颗石子，放在树根的一处裂缝上，「这条路的创道者守了古树一百年——不是怕它倒，是怕它的根，被人断了。」",
  "他睁开眼，那双眼睛灰而亮：「你来学守望，先学一件事：站得够久。久到树认你，风认你，连根底下的土都认你。」",
  "他把那七颗石子推到你面前：「摆。把树根摆成七种样子——摆到它不再是一棵树为止。」"
 ],
 options:[
  {t:"蹲下来，摆弄石子",go:"v57f_游侠_ward_2"}
 ]
};};
N["v57f_游侠_ward_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_ward",2);
  return{
 sceneTitle:"守望者 · 圣地 · 试炼",
 text:[
  "你摆了很久。石子从树的形状，摆成河流，摆成山，摆成一个人弓着背的背影。",
  "贺·断弓看着最后那个背影，忽然笑了：「摆对了。守望者守到最后，守的不是树——是人。是那些靠着这棵树活着的、沉默的人。」",
  "他站起来，拍了拍膝上的土：「守望者的路，就是把自己也种下去。种得够久，你站的地方，就会长出东西。」",
  "他留了一颗石子在古树根下：「这颗归你。它替你站在这里——你走到哪，它都替你守着一份。」",
  "你看着那颗石子，感到自己像是被什么东西，扎根了一下。"
 ],
 options:[
  {t:"起身，走出古树根",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_游侠_ward_3"}
  ]
};};
N["v57f_游侠_roam_1"]=function(){return{
 sceneTitle:"巡林者 · 圣地 · 望风石",
 text:[
  "雾岭的望风石上，霜辉背对着你坐着，面前摊着一张画了一半的地图——画的全是路，人的路，兽的路，水的路。",
  "「巡林者。」他没回头，「画路的人，自己不走岔路。」",
  "他放下笔：「这条路教你看——看树往哪边歪，看云往哪边走，看风从哪条谷里来。看懂了，你就是林子的耳朵。」",
  "他把地图推到你面前：「画。从望风石到山脚，画一条你走得最稳的路。」"
 ],
 options:[
  {t:"接过笔，画一条路",go:"v57f_游侠_roam_2"}
 ]
};};
N["v57f_游侠_roam_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_ranger_roam",2);
  return{
 sceneTitle:"巡林者 · 圣地 · 试炼",
 text:[
  "你画了一条沿溪的路——绕开断崖，贴着水走。霜辉看了一会儿，点了点头。",
  "「沿溪走，水声能压住脚步声，湿泥能掩住气味——你画的不只是路，是活法。」他指着你画上的一处转折，「可这里，你画弯了。」",
  "「溪到了拐弯处会漫。」他说，「你要么提前半里过河，要么贴着崖壁走——路是活的，你得比路更活。」",
  "他收好地图：「巡林者没有终点。我们画的路，都是给别人走的——自己走的那条，从来不画。」",
  "你看着那幅地图，第一次明白：有些路，是画出来给别人走的。"
 ],
 options:[
  {t:"谢过他，走下望风石",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_游侠_roam_3"}
  ]
};};
/* 盗贼 三流派 */
N["v57f_盗贼_shadow_1"]=function(){return{
 sceneTitle:"影杀者 · 圣地 · 黑井",
 text:[
  "暗影阁的黑井没有井水——只有一口看不见底的黑暗。杜·夜枭站在井边，手里拈着一枚铜钱。",
  "「影杀者。」他开口，声音像在井底滚过，「这条路的祖师爷说过一句话：影子不抢，只拿。」",
  "「拿什么？」他转头看你，「拿该拿的。拿那些被人藏起来、本该公道的——命、秘密、还有公道本身。」",
  "他把铜钱抛进黑井。很久，才传来一声极轻的落地：「听。影子出手，就该这么轻。」"
 ],
 options:[
  {t:"学他，抛一枚铜钱下去",go:"v57f_盗贼_shadow_2"}
 ]
};};
N["v57f_盗贼_shadow_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_shadow",2);
  return{
 sceneTitle:"影杀者 · 圣地 · 试炼",
 text:[
  "你抛下铜钱。它落进黑暗，很久很久，才传来一声几乎听不见的响。",
  "杜·夜枭侧耳听了一会儿：「不够轻。你心里有东西在晃——钱、名声、还是怕？影杀者出手前，要把心里清空。」",
  "他递给你一把匕首，刃口无光：「影杀者不是杀手。杀手收钱取命；影杀者只取『该拿的』——拿的时候，连风声都不欠你。」",
  "你握着匕首，感到它轻得像一片影子。「记住。」杜·夜枭说，「影子从不欠人——也从不被人记住。这就是影杀者的活法。」"
 ],
 options:[
  {t:"收好匕首，离开黑井",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_盗贼_shadow_3"}
  ]
};};
N["v57f_盗贼_night_1"]=function(){return{
 sceneTitle:"夜行者 · 圣地 · 钟楼",
 text:[
  "交汇城的钟楼很高，高到整个城都缩在脚下。乌·黛蹲在钟楼檐角，看着城里的灯火一盏一盏灭下去。",
  "「夜行者。」她没回头，「你看这座城——白天它是白的，晚上它是黑的。可它还是同一座城。」",
  "「白天有人看得见的事，晚上有人在看不见的地方做。」她转头，眼睛在夜里发亮，「夜行者的活法：替白天看不见的那些，记一笔账。」",
  "她从怀里摸出一本旧册子，翻开一页：「我记的。哪家当铺收赃，哪个贵人夜半出门，哪条巷子死了人没人报——都记。」"
 ],
 options:[
  {t:"问她要一笔账看看",go:"v57f_盗贼_night_2"}
 ]
};};
N["v57f_盗贼_night_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_night",2);
  return{
 sceneTitle:"夜行者 · 圣地 · 试炼",
 text:[
  "乌·黛翻到一页，指给你看：某年某月某日，城东粮行的账本上多了一笔「鼠耗」——比往年多出三成。她批注：鼠耗是假，私吞是真。",
  "「夜行者不偷。」她合上册子，「我们偷的是『真相』——把它从没人看见的夜里，偷到有人能看见的地方。」",
  "她递给一支笔：「你记一笔。随便记什么——你今天在夜里看见的。」",
  "你接过笔，写下一行字。她看了一眼，笑了：「不错。记真话的人，夜路走得远。」"
 ],
 options:[
  {t:"收好那页纸，走下钟楼",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_盗贼_night_3"}
  ]
};};
N["v57f_盗贼_ear_1"]=function(){return{
 sceneTitle:"耳目 · 圣地 · 旧鱼市",
 text:[
  "南港的旧鱼市白天是卖鱼的，入夜就换了一批面孔。薇·灰雾坐在一个空鱼摊后面，面前摆着一盏没点的灯。",
  "「耳目。」她说，「这条路的祖师爷说：听见的人，活得久。」",
  "她拿起那盏灯，也不点，就举着：「你听见了，却不说——这叫耳。你听见了，说给该听的人——这叫目。耳目不是传话的，是认路的。」",
  "她把灯放到你面前：「坐。听听这鱼市——你听得出几样声音？」"
 ],
 options:[
  {t:"坐下来，闭眼听",go:"v57f_盗贼_ear_2"}
 ]
};};
N["v57f_盗贼_ear_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_thief_ear",2);
  return{
 sceneTitle:"耳目 · 圣地 · 试炼",
 text:[
  "你闭上眼听。鱼市里什么声音都有：讨价还价、木桶碰撞、远处码头的水声——还有一阵极轻的、压着嗓子的对话。",
  "「那两个人。」薇·灰雾的声音贴着你的耳朵响起，「说的是银穗商路的事——商路不通，他们的货改走海路。这话，白天没人敢说。」",
  "「耳目要做的不是偷听。」她退开，「是听懂了，知道什么时候该说、对谁说、说多少。说多了，耳朵就没了。」",
  "她把那盏灯点亮，放在你面前：「这盏灯归你。以后你听见的事，就按灯的分寸来——该亮的时候亮，该熄的时候熄。」",
  "你看着灯焰，觉得它比看上去亮得多。"
 ],
 options:[
  {t:"提着灯，离开旧鱼市",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_盗贼_ear_3"}
  ]
};};
/* 牧师 三流派 */
N["v57f_牧师_mercy_1"]=function(){return{
 sceneTitle:"慈悲之道 · 圣地 · 病榻廊",
 text:[
  "圣辉教堂的病榻廊很长，两排床位一直排到廊尾。玛格达·静烛跪在一张病榻前，为一个发高烧的孩子擦额头。",
  "她听见你来，没回头：「慈悲之道。」她说，「不是念经治病——是先看见病，再看见人。」",
  "「这个孩子烧了三天，他娘在廊外跪了两天。」她放下下湿布，「我治的是烧，可那孩子夜里喊的是他爹——他爹在铁门关，三年没回来了。」",
  "她站起来，看着你：「你学慈悲，先学一件事：听病榻上的病人说梦话。他们说的，才是真正要治的。」"
 ],
 options:[
  {t:"留在病榻廊，守一夜",go:"v57f_牧师_mercy_2"}
 ]
};};
N["v57f_牧师_mercy_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_mercy",2);
  return{
 sceneTitle:"慈悲之道 · 圣地 · 试炼",
 text:[
  "你守在廊里。半夜，那孩子烧退了，翻了个身，含含糊糊喊了一声「爹」。",
  "玛格达·静烛在旁边应了一声了一声「哎」。孩子又睡过去了。",
  "天亮时，她走到你面前：「慈悲不是法术——是一声『哎』。你应下了，病人就觉得自己不是一个人。」",
  "她取下手腕上一串旧念珠，放在你手里：「拿着。以后你治过的每个人，都会在这串珠子里留一粒——珠子满了，你就知道这条路走了多远。」",
  "你握着那串念珠，感到它温热——像刚被人握过很久。"
 ],
 options:[
  {t:"收好念珠，走出病榻廊",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_牧师_mercy_3"}
  ]
};};
N["v57f_牧师_judge_1"]=function(){return{
 sceneTitle:"审判者 · 圣地 · 静默间",
 text:[
  "异端审判庭的静默间没有窗，只有一盏吊灯。克莱门·圣言坐在灯下，面前摊着一本旧经书，书页上密密麻麻写满了批注。",
  "「审判者。」他开口，声音干涩，「这条路不讨人喜欢。我们不是来救人的——是来问『是不是』的。」",
  "他合上书：「这个字，『罪』。我审了一辈子罪，到老才发现，最难审的罪，是错判。」",
  "他抬头看你：「你学审判，先记住：圣言不是刀。刀会偏，秤不会。你要做那杆秤——不偏不倚，连自己都称。」"
 ],
 options:[
  {t:"问他：那你怎么称自己",go:"v57f_牧师_judge_2"}
 ]
};};
N["v57f_牧师_judge_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_judge",2);
  return{
 sceneTitle:"审判者 · 圣地 · 试炼",
 text:[
  "克莱门·圣言沉默了很久，从经书里抽出一张发黄的纸：「这是我年轻时候判错的一桩案子。那人在牢里关了三年，后来查清了，是冤的。」",
  "「我把他放出去那天，他没骂我。」他说，「他站在门口，回头看了我一眼——那一眼，我称了自己三十年。」",
  "他把那张纸递给你：「审判者的第一课：把你判过的每一案，都留一张纸。等纸攒够了，你回头称——称得出的，才是审判；称不出的，只是审判欲。」",
  "你接过那张发黄的纸，感到它薄得可怕，也重得可怕。"
 ],
 options:[
  {t:"收好那张纸，离开静默间",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_牧师_judge_3"}
  ]
};};
N["v57f_牧师_war_1"]=function(){return{
 sceneTitle:"圣战者 · 圣地 · 古战场",
 text:[
  "圣山下的古战场，草长得比人高。艾诺尔·银冠蹲在一截断矛前，用手拨开泥土，露出一截白骨。",
  "「圣战者。」他说，「三百年前，这里打过一仗——打着神的名义。死了九千人，没有一个问过神愿不愿意。」",
  "他站起来，拍了拍手上的土：「这条路的祖师爷说过：为信仰而战，也为信仰而止。止——比战难得多。」",
  "他看着你：「你学圣战，先回答我：如果神要你杀人，而那人是无辜的——你听谁的？」"
 ],
 options:[
  {t:"听神的——信仰高于一切",go:"v57f_牧师_war_2"},
  {t:"听自己的——神不会要无辜者的血",go:"v57f_牧师_war_2"}
 ]
};};
N["v57f_牧师_war_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_priest_war",2);
  return{
 sceneTitle:"圣战者 · 圣地 · 试炼",
 text:[
  "艾诺尔·银冠听完，弯腰把那截断矛从土里拔出来，擦干净，递给你。",
  "「不管你怎么答，矛先给你。」他说，「圣战者的路，就是握着这把矛，站在神和人的中间——两头都别倒。」",
  "「三百年前那九千人，没有一个人问过这句话。」他把矛放进你手里，「你问了，你就比他们多走了一步。」",
  "你握着断矛，感到它比你想象的轻——轻得像个提醒，而不是武器。"
 ],
 options:[
  {t:"收好断矛，离开古战场",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_牧师_war_3"}
  ]
};};
/* 商人 三流派 */
N["v57f_商人_way_1"]=function(){return{
 sceneTitle:"商道 · 圣地 · 老账房",
 text:[
  "金衡商会的老账房，账本从地板堆到房梁。文森·金秤坐在最里面，面前摊着一本翻旧了的账——账页上，密密麻麻全是名字。",
  "「商道。」他没抬头，「商会立会那年，祖师爷立了一条规矩：账本可以记亏赚，但人的名字，只能记两样——欠过你的，你欠过的。」",
  "他合上账本，看你：「商道不是算盘的路，是还债的路。钱债好还，人债——得还一辈子。」"
 ],
 options:[
  {t:"问他：你账上有几笔人债",go:"v57f_商人_way_2"}
 ]
};};
N["v57f_商人_way_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_way",2);
  return{
 sceneTitle:"商道 · 圣地 · 试炼",
 text:[
  "文森·金秤沉默了一会儿，翻开账本最后一页：「这里记着一个名字——三十年前，我在北境困了七天，是这个人把最后半袋干粮分了我一半。我没还上。他死在第二年冬天。」",
  "他合上账本：「商道的第一课：把欠人的记下来，别等还不上那天。」",
  "他从抽屉里拿出一本崭新的空白账本，推到你面前：「拿着。以后你做的每一笔生意、遇到的每一个人，都记在这里——记亏赚的人成不了商道者，记『欠』的人才能。」",
  "你接过账本，翻开第一页，空白得像一句还没说出口的话。"
 ],
 options:[
  {t:"收好账本，离开老账房",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_商人_way_3"}
  ]
};};
N["v57f_商人_gold_1"]=function(){return{
 sceneTitle:"金流 · 圣地 · 金库",
 text:[
  "金衡商会的金库里，钱币堆成小山。灰·珊坐在钱堆中间，却连一枚都没碰——她面前摊着一张地图，上面画满了线。",
  "「金流。」她说，「钱不是目的，是过河的路。你看这张图——银穗商路、海路、陆路，每一笔钱都在走它自己的路。」",
  "「钱走的路，就是人的路。」她抬头，「商路断了，南边的人吃不上盐；商路通了，北边的孩子能穿上新鞋。管钱的人，其实是在管——谁的日子过不过得下去。」",
  "她把地图推到你面前：「画。画一条你愿意让钱走的路。」"
 ],
 options:[
  {t:"接过笔，画一条路",go:"v57f_商人_gold_2"}
 ]
};};
N["v57f_商人_gold_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_gold",2);
  return{
 sceneTitle:"金流 · 圣地 · 试炼",
 text:[
  "你在地图上画了一条从北境到南港的路——绕开战乱，贴着河走。灰·珊看了一会儿，点头。",
  "「绕开战乱，好。」她说，「可你画的这条路，要经过矮人的地界——他们的过路费收得贵，贵到你运的货会亏。」",
  "她拿起笔，在你画的路旁边另画了一条：「换这条。绕远三天，但走的是银叶城的商道——精灵不收过路费，只收『信誉』。信誉比钱值钱。」",
  "她把两幅路并排推到你面前：「金流的第一课：钱会选路，路也会选人。你让钱走的路，就是你让人过的日子。」",
  "你看着那两条路，第一次明白：账房里的线，画的是千万人的日子。"
 ],
 options:[
  {t:"谢过她，走出金库",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_商人_gold_3"}
  ]
};};
N["v57f_商人_auction_1"]=function(){return{
 sceneTitle:"拍场主 · 圣地 · 旧拍卖行",
 text:[
  "南港的旧拍卖行，屋顶漏光，台子上的漆已经剥落。洛佩斯·半帆坐在台下第一排，面前摆着一把旧茶壶。",
  "「拍场主。」他说，「拍卖行不卖东西——卖的是『归属』。每一件东西，都有懂它的人。拍场主的活，就是替它们找到那个人。」",
  "他拿起那把旧茶壶：「这把壶，我拍了三十年，没舍得卖。不是它值钱——是它记得我师父的手温。你学拍场，先学会认：哪件东西，该跟谁走。」",
  "他把茶壶放到你面前：「摸。然后告诉我，它该跟谁走。」"
 ],
 options:[
  {t:"摸一摸茶壶，说出你的判断",go:"v57f_商人_auction_2"}
 ]
};};
N["v57f_商人_auction_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_trade_auction",2);
  return{
 sceneTitle:"拍场主 · 圣地 · 试炼",
 text:[
  "你摸那把茶壶——壶身温的，底足磨得发亮。你说：「它该跟一个念旧的人走。壶底有茶垢，是长年养出来的——懂它的人，会接着养。」",
  "洛佩斯·半帆笑了：「对了。拍场主不赚差价，赚的是『成全』——把东西交给最该拥有它的人，两边都踏实。」",
  "他取出一枚旧号牌，递给你：「拿着。以后你经手的每件东西，都先问一句：它跟谁走，才算走对路。问得多了，你就是拍场主。」",
  "你握着那枚号牌，感到它像一把旧钥匙——能打开的东西，还没出现。"
 ],
 options:[
  {t:"收好号牌，走出旧拍卖行",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_商人_auction_3"}
  ]
};};


/* ===== v57inj:flowNodes1 ===== */
/* 魔法师 三流派 */
N["v57f_魔法师_fire_1"]=function(){return{
 sceneTitle:"真理之焰 · 圣地 · 观星台",
 text:[
  "星落塔的第七层从不轻易开门。可今天，门自己开了。",
  "你踏进观星台，风从七面窗同时灌进来。洛·晨雾背对着你，站在窗边——他手里托着一团火，火不大，却亮得让满天的星都暗了一瞬。",
  "「真理之焰。」他没回头，「两百年前，创道者就是在这里，第一次让火自己说『是』。你来晚了——但不算太晚。」",
  "他把那团火递到你面前。火苗在你掌心旁边跳了跳，没有烧你。它认得你身上那条路的味道。",
  "「想学？」他终于转过身，「先回答我：你学法术，是为了让火听话，还是为了听懂火说话？」"
 ],
 options:[
  {t:"让火听话——力量属于握它的人",go:"v57f_魔法师_fire_2"},
  {t:"听懂火说话——它有自己的道理",go:"v57f_魔法师_fire_2"}
 ]
};};
N["v57f_魔法师_fire_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_fire",2);
  return{
 sceneTitle:"真理之焰 · 圣地 · 试炼",
 text:[
  "洛·晨雾听完你的回答，没点头也没摇头。他把那团火按回自己的掌心，说：「答案不重要。重要的是你有没有想过——」",
  "他抬手，观星台七扇窗同时关上了三扇。黑暗里，只剩你和他掌心那点火。",
  "「元素不喜欢被命令。」他慢慢说，「可它喜欢被理解。理解它的人，会被它记住；命令它的人，会被它反噬。这条路的尽头，不是更强的法术——是更真的了解。」",
  "他摊开手，火苗落进你掌心里。这一次，你没有施法，只是安静地看着它。火在你掌心跳了跳，像是终于被认出来了。",
  "你感到这条路的纹路，在你血脉里深了一寸。"
 ],
 options:[
  {t:"接过这簇火",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_魔法师_fire_3"}
  ]
};};
N["v57f_魔法师_door_1"]=function(){return{
 sceneTitle:"万象之门 · 圣地 · 地下一层",
 text:[
  "旧图书馆的地下一层，十年没人下来过。门上的锁锈成了铁渣，你一推，锁自己断了。",
  "灰扑扑的房间里，摆着一面铜镜。奥薇恩·星语坐在镜子前，手里捏着一枚落叶——她在教树叶穿过镜面。",
  "「门扉之术。」她头也不抬，「不是把东西搬过去，是让东西自己愿意过去。」树叶在她指尖指腹一翻，落进了镜子里，又从另一面镜子里飘出来。",
  "她终于抬头看你：「空间不欺人。你心里乱，门就乱。你想学万象之门，先告诉我——你心里那扇一直没打开的门，是什么？」"
 ],
 options:[
  {t:"如实告诉她——那扇门和某个旧人有关",go:"v57f_魔法师_door_2"},
  {t:"说没有——你想学的只是法术",go:"v57f_魔法师_door_2"}
 ]
};};
N["v57f_魔法师_door_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_door",2);
  return{
 sceneTitle:"万象之门 · 圣地 · 试炼",
 text:[
  "奥薇恩听完，把树叶放回窗台。「不管你说的是真话还是假话，门都听见了。」她站起来，在镜面上画了一个圈，「空间之术的要诀只有一句：别怕走错路。走错的门，也是一扇门。」",
  "她让你站到两面镜子中间。你看见镜中的自己，同时出现在七道门里。",
  "「选一扇。」她说，「选错也无妨——但你只能选一扇，不能同时走两扇。」",
  "你闭上眼，选了一扇。镜面如水波荡开，你一步踏进去，落在了地下一层的出口。身后，七道门慢慢合拢。",
  "你明白了：万象之门教的不是捷径，是选择。每一次折跃，都在替你说「我要去哪」。"
 ],
 options:[
  {t:"谢过她，踏上归途",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_魔法师_door_3"}
  ]
};};
N["v57f_魔法师_echo_1"]=function(){return{
 sceneTitle:"寂静回响 · 圣地 · 禁书区三层",
 text:[
  "禁书区三层没有灯。你摸黑走进去，脚下的木板吱呀作响——然后你听见了。",
  "不是声音，是「回响」。每一本书都在用很低的频率震动，像一根根绷了太久的弦。",
  "伊尔·灰书坐在书架顶上，像一只落了灰的猫头鹰。他低头看你，声音干巴巴的：「你听见了？禁书区不是禁书——是禁『念出声』。这里的书，每本都在等一个敢听的人。」",
  "他扔给你一本没有封皮的书：「翻开它。别念出声。看——看得懂，就是你的；看不懂，就放回去。」"
 ],
 options:[
  {t:"翻开那本无封皮的书",go:"v57f_魔法师_echo_2"}
 ]
};};
N["v57f_魔法师_echo_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_mage_echo",2);
  return{
 sceneTitle:"寂静回响 · 圣地 · 试炼",
 text:[
  "书页打开，没有一个字——或者说，字都在你心里。你看见法则像蛛网一样挂在寂静里，每一根线上都系着一个名字。",
  "你的名字，也系在其中一根线上。",
  "伊尔·灰书跳下书架，落在你面前：「看见了？法则不写字，它写人。谁在念它，它就记住谁。」",
  "他伸手，指尖一拨了一下你那根线。你整个人一震，像被什么东西从头到脚洗了一遍。",
  "「寂静回响的路，是把自己也变成一根弦。」他说，「响不响，由风决定；绷不绷得住，由你。」你感到那道法则的共鸣，从此长在了你身上。"
 ],
 options:[
  {t:"记住这种感觉，离开禁书区",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_魔法师_echo_3"}
  ]
};};
/* 灵魂法师 三流派 */
N["v57f_灵魂法师_lamp_1"]=function(){return{
 sceneTitle:"魂灯不灭 · 圣地 · 灯廊",
 text:[
  "晨曦圣殿的灯廊里挂着上千盏魂灯。每一盏，都为一个亡者而亮。",
  "澜·梦墟在灯廊尽头等你。她手里捧着一盏空灯，灯座刻着你的名字——还没点着。",
  "「魂灯不灭。」她说，「这条路的创道者相信：人死了，只要还有人记得，灯就不灭。你要接这盏灯，先回答我——你这一生，最怕忘记谁？」"
 ],
 options:[
  {t:"说出一个名字——那是你的来处",go:"v57f_灵魂法师_lamp_2"},
  {t:"说没有——你想忘记的太多",go:"v57f_灵魂法师_lamp_2"}
 ]
};};
N["v57f_灵魂法师_lamp_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_lamp",2);
  return{
 sceneTitle:"魂灯不灭 · 圣地 · 试炼",
 text:[
  "澜·梦墟听完，把那盏空灯放在你手里。灯芯忽然自己亮了——不是火光，是一点极淡的青白色。",
  "「它认得你。」她说，「灯记得每一个为它回答过问题的人。你刚才说的那个名字，已经住进灯芯里了。」",
  "她带你走过整条灯廊。每经过一盏灯，灯都侧了侧身，像是在给你让路。",
  "「守灯人的规矩只有一条：灯在，人在；人忘了，灯才灭。」她在廊尾停住，「现在，这盏灯归你了。别让它灭——也别让它替你记得太多，你会累。」",
  "你捧着那盏灯，感到肩上多了一点重量。很轻，但很暖。"
 ],
 options:[
  {t:"捧着灯，离开灯廊",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_灵魂法师_lamp_3"}
  ]
};};
N["v57f_灵魂法师_key_1"]=function(){return{
 sceneTitle:"心扉之锁 · 圣地 · 镜厅",
 text:[
  "镜厅四面都是镜子。你走进去，看见无数个自己，每个自己都看着你。",
  "乌·森坐在厅中央，闭着眼。他面前摆着一排钥匙——铜的、铁的、银的，还有一把木头的。",
  "「心扉之锁。」他睁开眼，「锁不在门上，在人心里。你要学的，不是开锁，是知道哪把锁不该开。」",
  "他拿起那把木钥匙，放在你掌心：「试试。看你能不能打开——你自己的心门。」"
 ],
 options:[
  {t:"把钥匙按在胸口，感受它",go:"v57f_灵魂法师_key_2"}
 ]
};};
N["v57f_灵魂法师_key_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_key",2);
  return{
 sceneTitle:"心扉之锁 · 圣地 · 试炼",
 text:[
  "钥匙贴上胸口的一瞬，你看见了自己的心——不是跳动的血肉，是一扇门。门上有锁，锁上锈迹斑斑，像是很久没开过。",
  "乌·森的声音从镜子里传来：「很多人一辈子都没开过这扇门。不是开不了——是不敢。门后面有什么，你自己也不知道。」",
  "你转动钥匙。锁芯响了一下，门开了一条缝。从缝里漏出来的，不是光，是一阵风——带着你早就忘掉的、某个下午的味道。",
  "「够了。」乌·森说，「记住这个手感。以后你面对别人的心门时，要像对自己一样轻。」",
  "你睁开眼，镜厅里所有的自己都朝你点了点头。"
 ],
 options:[
  {t:"收好钥匙，离开镜厅",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_灵魂法师_key_3"}
  ]
};};
N["v57f_灵魂法师_chain_1"]=function(){return{
 sceneTitle:"契约之链 · 圣地 · 契约堂",
 text:[
  "契约堂的地板上刻着无数条链——每一道链环，都是一段以灵魂为凭的誓约。",
  "雷·娜站在堂中，手腕上系着一根几乎看不见的银线。线的另一端，没入虚空。",
  "「契约之链。」她抬起手，银线跟着动，「把两个灵魂系在一起，生死同担。这条路的人不多——因为大多数人，不敢把命交到另一个人手里。」",
  "她看着你：「你想接这条链，先想清楚：你愿不愿意，为一个人担他的死？」"
 ],
 options:[
  {t:"愿意——总有人值得你担",go:"v57f_灵魂法师_chain_2"},
  {t:"不愿意——你只为自己而活",go:"v57f_灵魂法师_chain_2"}
 ]
};};
N["v57f_灵魂法师_chain_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_soul_chain",2);
  return{
 sceneTitle:"契约之链 · 圣地 · 试炼",
 text:[
  "雷·娜听完你的回答，手腕一抖，银线断了一截，落在你手里。",
  "「不管你怎么答，链子都认你了。」她说，「契约不是绑人——是互相托底。你担他的死，他担你的生。这根线，就是这条路的全部。」",
  "她把断线系在你腕上。线很轻，你却感到它沉——像有人把一只手的重量，搭在了你肩上。",
  "「记住：契约之链一旦系上，就不许先松手。」她说，「松手的人，会一辈子梦见那条断线的声音。」",
  "你看着腕上的银线，第一次明白什么叫「托付」。"
 ],
 options:[
  {t:"带着这条线，走出契约堂",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_灵魂法师_chain_3"}
  ]
};};
/* 术士 三流派 */
N["v57f_术士_touch_1"]=function(){return{tag:"branch",
 sceneTitle:"点金之手 · 圣地 · 药室",
 text:[
  "锻造公会的药室里，炉火是绿色的。梅·炽芯正把一把草药碾成粉，药粉落进研钵，升起的烟气带着一点金芒。",
  "「点金之手。」她没抬头，「不是把铁变成金子——是把『值不值』看清楚。这世上的东西，多半被看错了价。」",
  "她拈起一粒药粉，放在你掌心：「摸一摸。告诉我，它值多少。」"
 ],
 options:[
  {t:"仔细摸——说出你心里的价",go:"v57f_术士_touch_2"}
 ]
};};
N["v57f_术士_touch_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_touch",2);
  return{
 sceneTitle:"点金之手 · 圣地 · 试炼",
 text:[
  "你摸那粒药粉：温的，有点涩，带着苦味。你说：「它不值钱。但救人的时候，值一条命。」",
  "梅·炽芯终于抬起头，笑了：「对了。点金不是看价钱——是看命数。同样的东西，在药房是药，在战场是命，在贪婪的人手里，是罪。」",
  "她把你掌心的药粉收回去，又放了一粒新的：「这是报酬。你刚才那句话说得好，它记住了。」",
  "你低头看，掌心的新药粉泛着金芒——这是点金之手认了你的意思。",
  "「走吧。」她说，「以后你摸过的东西，都会告诉你真话。」"
 ],
 options:[
  {t:"谢过她，离开药室",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_术士_touch_3"}
  ]
};};
N["v57f_术士_forge_1"]=function(){return{
 sceneTitle:"百炼之炉 · 圣地 · 熔炉大厅",
 text:[
  "熔炉大厅的初火，据说从公会创立那天就没熄过。格朗·符文站在炉前，正往火里添一块铁。",
  "他看见你，把铁钳往你手里一塞：「来得正好。帮我打一锤——就一锤。让我看看，你这双手听不听炉火的话。」",
  "炉火很热。你握紧铁钳，抡起锤子。那一锤落下去，火星四溅，铁块发出一声清脆的响。",
  "格朗·符文没说话，低头看铁块上的锤印，看了很久。"
 ],
 options:[
  {t:"等他的评判",go:"v57f_术士_forge_2"}
 ]
};};
N["v57f_术士_forge_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_forge",2);
  return{
 sceneTitle:"百炼之炉 · 圣地 · 试炼",
 text:[
  "「锤印不深不浅，力道不虚不浮。」格朗·符文终于开口，「你以前打过铁——或者说，你以前认真做过一件事，认真到骨头里。」",
  "他指了指那枚锤印：「百炼之炉教的就是这个：一锤是一锤，一火是一火，没有捷径。炉火不骗人，它只认手。」",
  "他把那枚铁块放进你手里：「拿着。这是你的第一件作品。以后你打的每一件东西，都会记得今天这一锤。」",
  "铁块是温的。你握着它，感到一种奇怪的踏实——像手里握着一小段、被火验证过的时间。"
 ],
 options:[
  {t:"收好铁块，离开熔炉大厅",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_术士_forge_3"}
  ]
};};
N["v57f_术士_gear_1"]=function(){return{
 sceneTitle:"活偶之枢 · 圣地 · 构装库",
 text:[
  "公会地下的构装库，像一座睡着了的小城。齿轮停转，连杆垂着，一排排构装体立在暗处，像士兵，又像孩子。",
  "火克蹲在一具人形构装前，正用螺丝刀拧它的胸口。那构装的眼睛忽然亮了一下——又灭了。",
  "「活偶之枢。」他头也不抬，「造出来的东西，会自己长大。你要学这条路，先学会一件事：放手。」"
 ],
 options:[
  {t:"问他：放手是什么",go:"v57f_术士_gear_2"}
 ]
};};
N["v57f_术士_gear_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_smith_gear",2);
  return{
 sceneTitle:"活偶之枢 · 圣地 · 试炼",
 text:[
  "火克把螺丝刀收进口袋，拍了拍那具构装的肩膀：「它三年前造的。当时我给它装了十二个指令，怕它乱跑。现在它只认一个指令：回家。」",
  "「放手，不是不管它。」他转过头看你，「是相信它长成了自己的样子。造物和养孩子一样——你越攥着，它越不认得你。」",
  "他递给你一枚齿轮：「拿着。这是它的第一枚齿轮，换过三次了。你以后造的东西，也会这样——先是你的一部分，然后是它自己。」",
  "你接过齿轮，感到它发烫。像是那具构装，隔着黑暗，朝你点了点头。"
 ],
 options:[
  {t:"收好齿轮，离开构装库",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_术士_gear_3"}
  ]
};};
/* 战士 三流派 */
N["v57f_战士_banner_1"]=function(){return{
 sceneTitle:"不灭战旗 · 圣地 · 旧旗台",
 text:[
  "战神团的旧旗台上，插着一面褪色的旗。旗角缺了一块，被风磨得发白。",
  "秦·长风站在旗下，背对着你。他的木臂握着旗杆，握得很稳——稳得像那面旗本来就长在他手里。",
  "「不灭战旗。」他说，「创道者当年在这面旗下立过誓：旗在，人在。旗没了，人还在——那是另一条路。」",
  "他转过身，看着你：「你这一刀，为谁而握？」"
 ],
 options:[
  {t:"为家人——握刀是为了护住身后",go:"v57f_战士_banner_2"},
  {t:"为自己——握刀是为了不跪着活",go:"v57f_战士_banner_2"}
 ]
};};
N["v57f_战士_banner_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_banner",2);
  return{
 sceneTitle:"不灭战旗 · 圣地 · 试炼",
 text:[
  "秦·长风听完，没有评判。他把那面旧旗从旗台上拔下来，递到你手里。",
  "「旗不挑人。」他说，「挑人的是拿旗的手。你为谁而握，旗就为谁而飘。」",
  "你接过旗。旗面比你想象的重——不是布的重，是那些年月的重量。风一吹，旗角猎猎作响。",
  "「记住这个手感。」秦·长风说，「哪天你握刀的时候，还能想起这面旗的分量——你就还是这条路上的人。」",
  "你站在那里，握着旗，第一次觉得自己肩上有了方向。"
 ],
 options:[
  {t:"把旗插回旗台，转身离开",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_战士_banner_3"}
  ]
};};
N["v57f_战士_weapon_1"]=function(){return{
 sceneTitle:"百兵之主 · 圣地 · 兵器库",
 text:[
  "演武场的兵器库里，刀枪剑戟挂满三面墙。喀兰·赤峰坐在兵器架下，面前摊着一柄断刀。",
  "「百兵之主。」他没抬头，「这世上没有最好的兵器，只有最懂你的兵器。刀懂你，你懂刀——才是这条路的开始。」",
  "他拿起那柄断刀，指尖一弹。断刀发出一声悠长的鸣响。",
  "「选一件。」他说，「别挑好看的，挑你拿起来觉得『对』的。」"
 ],
 options:[
  {t:"在兵器架前走一遍，凭手感选",go:"v57f_战士_weapon_2"}
 ]
};};
N["v57f_战士_weapon_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_weapon",2);
  return{
 sceneTitle:"百兵之主 · 圣地 · 试炼",
 text:[
  "你在兵器架前走了三遍。刀太轻，枪太长，剑太冷——最后你的手停在一柄朴刀上。刀身有旧伤，刀柄缠着的布已经磨得发亮。",
  "喀兰·赤峰笑了：「它等你很久了。这柄刀的主人在铁门关守了三十年，刀伤都是旧的。你拿起来觉得对，是因为你的手认得它的缺口。」",
  "他把朴刀交到你手里：「百兵之主的规矩：兵器不认主人，认手感。它愿意跟你走，你就要对它负责——别让它蒙尘。」",
  "你握紧朴刀。刀身的旧伤贴着你的掌纹，像两个老相识，终于又碰了面。"
 ],
 options:[
  {t:"带着朴刀，走出兵器库",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_战士_weapon_3"}
  ]
};};
N["v57f_战士_wall_1"]=function(){return{
 sceneTitle:"铁壁长城 · 圣地 · 旧墙",
 text:[
  "铁门关的旧墙下，格罗·铁壁背靠墙坐着，面前生着一堆小火。他脸上有一道很深的疤，从眉骨一直划到下巴。",
  "「铁壁长城。」他往火里添了根柴，「创道者不是战神——是个守门的。他一辈子没赢过一场漂亮的仗，可他守的城门，从没破过。」",
  "他拍拍身边的墙：「你靠过来。听听这墙——它什么都挡过：箭、雪、人、还有时间。」",
  "你靠上旧墙。墙是凉的，却像有呼吸——一进一出，缓慢而稳。"
 ],
 options:[
  {t:"贴着墙，听它说话",go:"v57f_战士_wall_2"}
 ]
};};
N["v57f_战士_wall_2"]=function(){
  if(window.v57_flowStage) v57_flowStage("flow_war_wall",2);
  return{
 sceneTitle:"铁壁长城 · 圣地 · 试炼",
 text:[
  "格罗·铁壁看着你贴墙的样子，点了点头：「能听懂墙的人不多。大多数人觉得墙是死的——可它立了一百年，替人挡了一百年，怎么会是死的。」",
  "他从火堆里抽出一根烧红的柴，在墙上画了一道：「这是你的印。以后你就是这面墙的一部分——你站的地方，就是别人的后背。」",
  "「铁壁的路不漂亮。」他说，「没有冲锋，没有斩将，只有站着。可世界需要站着的人——这面墙，就是为此而立的。」",
  "你摸着你那一道印，感到旧墙的温度，像一只手，在你背后撑了撑了一下。"
 ],
 options:[
  {t:"谢过他，离开旧墙",go:"academy_elda_hub"}
 ,
   {t:"接受流派大师的认可",req:function(){return (S&&S.orgRank||0)>=2;},go:"v57f_战士_wall_3"}
  ]
};};



window.v52_godEligible = function(){
    try{
      v52_ensureDefaults();
      var rk = v52_orgRank();
      var realm = (typeof S.realm==="number")?S.realm:0;
      return (rk>=3) || (realm>=7) || (S.abyssPath && S.abyssPath.length>0);
    }catch(e){ return false; }
  };
  window.v52_godTrial = function(){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var chain = (RIVALS_V52[job]||{}).trial || null;
      if(!chain){ if(window.flashMsg) flashMsg('神座试炼尚未开启。'); return; }
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      if(!v52_godEligible()){ if(window.flashMsg) flashMsg('你尚未获得叩问神座的资格（需组织位阶≥3 或 境界≥7 或 踏上深渊之路）。'); v52_orgPanel(); return; }
      var stage = 0;
      var draw = function(){
        try{ clearOptions(); }catch(e){}
        if(stage < chain.stages.length){
          var sg = chain.stages[stage];
          writePar("","noind");
          writePar(sg.title, "flagline");
          (sg.text||[]).forEach(function(t){ writePar(t); });
          if(sg.rolls){ // 多重判定
            var total = 0;
            sg.rolls.forEach(function(rk2){
              var tt = rk2.t; var r = rollD100(); var ok = r<=tt;
              total += ok ? rk2.w : (rk2.failW||0);
              writePar("【判定】" + rk2.cn + "：目标 " + tt + "，掷出 " + r + (ok ? " → 通过" : " → 未过"), ok ? "hint" : "roll-fail");
            });
            sg.result = total;
          }
          if(sg.need){ // 心性：双轴分支
            var p = S.piety||0, c = S.corruption||0;
            if(p>=40 && c<40) sg.result = sg.holy || 1;
            else if(c>=40 && p<40) sg.result = sg.abyss || -1;
            else sg.result = 0;
            writePar("【心性】神性 " + p + " · 深渊 " + c + (sg.result>0?" → 圣辉庇护":sg.result<0?" → 深渊回应":" → 天平正中"), "inner-voice");
          }
          if(sg.opts){
            sg.opts.forEach(function(o){
              var b = document.createElement('button'); b.className='opt';
              b.innerHTML = '<span class="od">◆</span> ' + o.t;
              b.onclick = function(){
                if(o.req && !o.req()){ if(window.flashMsg) flashMsg(o.reqMsg||'条件不足。'); return; }
                if(o.text) writePar(o.text);
                if(o.eff) { try{ o.eff(); }catch(e){} }
                S.peakPts = (S.peakPts||0) + 1;
                if(window.flashMsg) flashMsg('试炼通过 · 巅峰点+1');
                stage++;
                draw();
              };
              op.appendChild(b);
            });
          } else {
            var b2 = document.createElement('button'); b2.className='opt';
            b2.innerHTML = '<span class="od">◆</span> 继续';
            b2.onclick = function(){ S.peakPts = (S.peakPts||0) + 1; if(window.flashMsg) flashMsg('试炼通过 · 巅峰点+1'); stage++; draw(); };
            op.appendChild(b2);
          }
        } else {
          // 登神成功
          S.deified = 1;
          S.godTrial[job] = "deified";
          writePar("","noind");
          writePar("━━ 神座已定 · " + job + "之神 ━━","noind flagline roll-crit");
          if(chain.endText) writePar(chain.endText);
          if(chain.onDeify) { try{ chain.onDeify(); }catch(e){} }
          if(window.flashMsg) flashMsg('你坐上了 ' + job + ' 的神座——此世此途，只此一位。');
          var b3 = document.createElement('button'); b3.className='opt';
          b3.innerHTML = '<span class="od">◆</span> 回到人间';
          b3.onclick = function(){ try{ closePanel(); }catch(e){} };
          op.appendChild(b3);
        }
      };
      writePar("","noind");
      writePar("━━ 神座试炼 · " + job + " ━━","noind flagline");
      draw();
    }catch(e){ console.error(e); }
  };
  /* ---------- 竞争者 ---------- */
  window.v52_rivalFight = function(rivalId){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var rivals = (RIVALS_V52[job]||{}).rivals || [];
      var rv = null;
      rivals.forEach(function(r){ if(r.id===rivalId) rv = r; });
      if(!rv) return;
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var main = (S.attrs&&S.attrs.STR)?S.attrs.STR:50;
      var t1 = 40 + Math.floor(main/5) + (v52_orgRank()>=2?10:0) + (S.deified?20:0) + (window.v53_willMod?v53_willMod(rv.id):0);
      var r = rollD100();
      var ok = r <= Math.max(10, Math.min(95, t1));
      var b = document.createElement('button'); b.className='opt';
      if(ok){
        S.godRival[rv.id] = "defeated";
        writePar("","noind");
        writePar("━━ 交手 · " + rv.cn + " ━━","noind flagline");
        writePar("你与他（她）在无人处交手。" + (rv.fightText||"") + "最后他（她）收了手：" + (rv.defeatLine||"你赢了。"));
        writePar("【判定】目标 " + Math.max(10, Math.min(95, t1)) + "，掷出 " + r + " → 胜", "hint");
        if(rv.reward) { try{ rv.reward(); }catch(e){} }
        if(window.flashMsg) flashMsg('你击败了竞争者：' + rv.cn);
        b.innerHTML = '<span class="od">◆</span> 离去';
      } else {
        writePar("","noind");
        writePar("━━ 交手 · " + rv.cn + " ━━","noind flagline");
        writePar("你败了。" + (rv.loseText||"他（她）没有伤你，只是留下一句：'还不到时候。'"));
        writePar("【判定】目标 " + Math.max(10, Math.min(95, t1)) + "，掷出 " + r + " → 未过", "roll-fail");
        b.innerHTML = '<span class="od">◆</span> 暂退';
      }
      b.onclick = function(){ try{ closePanel(); }catch(e){} };
      op.appendChild(b);
    }catch(e){ console.error(e); }
  };
  /* ---------- 巅峰盘 ---------- */
  window.v52_peakPanel = function(){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var peaks = PEAK_V52[job] || null;
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var h = '';
      var realm = (typeof S.realm==="number")?S.realm:0;
      var rk = v52_orgRank();
      if(!peaks || realm<4 || rk<1){
        h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ 巅峰盘 ━━</div>';
        h += '<div style="color:var(--text-primary);font-size:14px;line-height:1.7;">巅峰盘是宗师之后的修行图景。\n需要 <b>境界≥宗师</b> 且 <b>组织位阶≥1</b> 方可研习。（当前：境界 ' + (BREAKTHROUGH_V49.realmNames[realm]||realm) + ' / 位阶 ' + v52_orgRankCn() + '）</div>';
        st.innerHTML = h;
        var b = document.createElement('button'); b.className='opt';
        b.innerHTML = '<span class="od">◆</span> 返回';
        b.onclick = function(){ try{ closePanel(); }catch(e){} };
        op.appendChild(b);
        return;
      }
      h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ 巅峰盘 · ' + job + ' ━━</div>';
      h += '<div style="margin:4px 0 8px;font-size:14px;color:var(--text-primary);">巅峰点：<span style="color:var(--text-gold);font-weight:bold;">' + (S.peakPts||0) + '</span></div>';
      Object.keys(peaks).forEach(function(bid){
        var t = peaks[bid];
        var picked = (t.nodes||[]).filter(function(n){ return S.peak && S.peak[t.id+'_'+n.lv]; }).length;
        h += '<div style="margin:8px 0;padding:8px 10px;background:var(--bg-panel2);border:1px solid var(--border);border-left:3px solid var(--purple);border-radius:8px;">'
          + '<div style="font-size:14px;color:var(--text-primary);">' + t.cn + ' <span style="font-size:12px;color:var(--text-muted);">' + picked + '/5</span></div>'
          + '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + t.desc + '</div>'
          + '<button class="btn btn-sm" style="margin-top:6px;" onclick="v52_peakTree(\'' + bid + '\')">研习路线</button></div>';
      });
      st.innerHTML = h;
      var b2 = document.createElement('button'); b2.className='opt';
      b2.innerHTML = '<span class="od">◆</span> 返回';
      b2.onclick = function(){ try{ closePanel(); }catch(e){} };
      op.appendChild(b2);
    }catch(e){ console.error(e); }
  };
  window.v52_peakTree = function(bid){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var t = (PEAK_V52[job]||{})[bid];
      if(!t) return;
      var body = document.getElementById('v52-peak-body');
      var h = '';
      h += '<div style="font-size:14px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ ' + t.cn + ' ━━</div>';
      h += '<div style="margin:6px 0;font-size:13px;color:var(--text-secondary);">' + t.desc + '</div>';
      h += '<div style="margin:4px 0 8px;font-size:12px;color:var(--text-muted);">巅峰点 ' + (S.peakPts||0) + '</div>';
      (t.nodes||[]).forEach(function(n){
        var fid = t.id + '_' + n.lv;
        var owned = S.peak && S.peak[fid];
        var status = owned ? ' <span style="color:var(--success);">✓ 已研习</span>' : (n.lv>1 && !(S.peak&&S.peak[t.id+'_'+(n.lv-1)])) ? ' <span style="color:var(--text-muted);">（需先研习上一节）</span>' : '';
        h += '<div style="margin:6px 0;padding:8px 10px;background:var(--bg-panel2);border:1px solid ' + (owned?'var(--success)':'var(--border)') + ';border-radius:8px;">'
          + '<div style="font-size:13.5px;color:var(--text-primary);">' + n.lv + '节 · ' + n.cn + status + '</div>'
          + '<div style="font-size:12.5px;color:var(--text-secondary);margin-top:2px;line-height:1.6;">' + n.desc + '</div>'
          + ( (!owned) ? '<button class="btn btn-sm" style="margin-top:5px;" onclick="v52_pickPeak(\'' + bid + '\',' + n.lv + ')">研习</button>' : '' )
          + '</div>';
      });
      h += '<div style="margin-top:10px;"><button class="btn" onclick="v52_peakPanel()">返回巅峰盘</button></div>';
      if(body){ body.innerHTML = h; }
      else {
        var st = document.getElementById('story');
        var op = document.getElementById('options');
        if(st && op){ st.innerHTML = h; try{ clearOptions(); }catch(e){} var b = document.createElement('button'); b.className='opt'; b.innerHTML='<span class="od">◆</span> 返回'; b.onclick=function(){ v52_peakPanel(); }; op.appendChild(b); }
      }
    }catch(e){ console.error(e); }
  };
  window.v52_pickPeak = function(bid, lv){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var t = (PEAK_V52[job]||{})[bid];
      if(!t) return;
      var n = (t.nodes||[])[lv-1];
      if(!n) return;
      var fid = t.id + '_' + n.lv;
      if(S.peak && S.peak[fid]){ delete S.peak[fid]; S.peakPts = (S.peakPts||0)+1; if(window.flashMsg) flashMsg('已放下：' + n.cn); v52_peakTree(bid); return; }
      if((S.peakPts||0) < 1){ if(window.flashMsg) flashMsg('巅峰点不足。破境、组织晋升或神座试炼可获得。'); return; }
      if(lv>1 && !(S.peak && S.peak[t.id+'_'+(lv-1)])){ if(window.flashMsg) flashMsg('需先研习上一节。'); return; }
      S.peakPts = (S.peakPts||0) - 1;
      if(!S.peak) S.peak = {};
      S.peak[fid] = 1;
      if(window.flashMsg) flashMsg('研习巅峰：' + n.cn);
      if(n.eff){ try{ n.eff.call(null); }catch(e){ console.error(e); } }
      try{ renderTop(); renderStats(); }catch(e){}
      v52_peakTree(bid);
    }catch(e){ console.error(e); }
  };
  /* ---------- 神器 ---------- */
  window.v52_artifactPanel = function(){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var art = ARTIFACT_V52[job] || null;
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var h = '';
      if(!art){
        h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ 职业神器 ━━</div>';
        h += '<div style="color:var(--text-primary);font-size:14px;line-height:1.7;">尚未寻得属于你道路的传说之物。</div>';
        st.innerHTML = h;
        var b = document.createElement('button'); b.className='opt'; b.innerHTML='<span class="od">◆</span> 返回'; b.onclick=function(){ try{ closePanel(); }catch(e){} }; op.appendChild(b);
        return;
      }
      if(S.artifact === job){
        h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ ' + art.cn + ' ━━</div>';
        h += '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + (art.lore||'') + '</div>';
        h += '<div style="margin:8px 0;padding:8px 10px;background:var(--success-bg);border:1px solid var(--success);border-radius:8px;color:var(--success);font-size:13px;">已执于你手 · 神器共鸣生效</div>';
      } else {
        h += '<div class="flagline" style="color:var(--text-gold);margin:6px 0 10px;">━━ 传说中的 ' + art.cn + ' ━━</div>';
        h += '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + (art.lore||'') + '</div>';
        h += '<div style="font-size:12px;color:var(--text-muted);margin:6px 0;">解锁线索：' + (art.hint||'组织高位所授') + '</div>';
      }
      st.innerHTML = h;
      var mk = function(t, fn){ var b = document.createElement('button'); b.className='opt'; b.innerHTML='<span class="od">◆</span> ' + t; b.onclick=fn; op.appendChild(b); };
      if(S.artifact !== job && art.quest){
        mk('循迹寻宝', function(){ v52_artRun(); });
      }
      mk('返回', function(){ try{ closePanel(); }catch(e){} });
    }catch(e){ console.error(e); }
  };
  window.v52_artRun = function(){
    try{
      v52_ensureDefaults();
      var job = v52_jobCn();
      var art = ARTIFACT_V52[job] || null;
      if(!art || !art.quest) return;
      var st = document.getElementById('story');
      var op = document.getElementById('options');
      if(!st || !op) return;
      if(window.clearOptions) { try{ clearOptions(); }catch(e){} }
      var step = 0;
      var draw = function(){
        try{ clearOptions(); }catch(e){}
        if(step < art.quest.length){
          var s2 = art.quest[step];
          writePar("","noind");
          writePar(s2.text, "narration");
          if(s2.opts){
            s2.opts.forEach(function(o){
              var b = document.createElement('button'); b.className='opt';
              b.innerHTML = '<span class="od">◆</span> ' + o.t;
              b.onclick = function(){
                if(o.eff) { try{ o.eff(); }catch(e){} }
                if(o.text) writePar(o.text, "hint");
                step++;
                draw();
              };
              op.appendChild(b);
            });
          } else {
            var b2 = document.createElement('button'); b2.className='opt';
            b2.innerHTML = '<span class="od">◆</span> 继续';
            b2.onclick = function(){ step++; draw(); };
            op.appendChild(b2);
          }
        } else {
          S.artifact = job;
          writePar("","noind");
          writePar("━━ 神器入手 · " + art.cn + " ━━","noind flagline roll-crit");
          if(art.gainText) writePar(art.gainText);
          if(window.flashMsg) flashMsg('你得到了职业神器：' + art.cn);
          var b3 = document.createElement('button'); b3.className='opt';
          b3.innerHTML = '<span class="od">◆</span> 返回';
          b3.onclick = function(){ v52_artifactPanel(); };
          op.appendChild(b3);
        }
      };
      writePar("","noind");
      writePar("━━ 神器之路 · " + art.cn + " ━━","noind flagline");
      draw();
    }catch(e){ console.error(e); }
  };
})()