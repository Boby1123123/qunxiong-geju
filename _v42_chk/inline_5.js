
/* ============ v44 表现层引擎（IIFE 封装，不污染 S） ============ */
(function(){
try{
  /* ---- V44 状态对象 ---- */
  var V44 = {
    lastChapter:{ day:-1, loc:'' },
    atlasTab:'gallery',
    whisperTimer:null
  };

  var LOCATION_PALETTES = { free:'loc-free', north:'loc-north', south:'loc-south', church:'loc-church', elf:'loc-elf', dwarf:'loc-dwarf', orc:'loc-orc', east:'loc-east', abyss:'loc-abyss', academy:'loc-academy' };
  var WEATHER_ICONS = { clear:'☀️ 晴', sunny:'☀️ 晴', rain:'🌧️ 雨', snow:'❄️ 雪', fog:'🌫️ 雾', cloudy:'⛅ 阴', storm:'⛈️ 雷' };
  var WHISPER_POOL = [
    "门在下面。门一直在下面。",
    "第七印没有碎，它只是睡着了。",
    "你听——那不是风声。",
    "三百年前它也是这样醒来的。",
    "饥饿、愤怒、傲慢、贪婪、嫉妒、懒惰、色欲……你在数什么？",
    "原初之物从不撒谎，它们只是不说人话。",
    "月亮是圆的，可你脚下为什么有七个影子？",
    "别回头。回头你就会数清楚它们。",
    "深渊不恨你。深渊只是饿。",
    "圣光底下，也有东西在爬。",
    "你救过的那个人，你记得他长什么样吗？",
    "熔炉深处的心跳，和你的是同一个节拍。",
    "三千年前的人还在路上，而你已经在等他了。",
    "世界树低语的时候，不要翻译。",
    "血雨落地时是暖的。",
    "你身上多了一道印记，从什么时候开始的？",
    "预言有四个版本，你听到的是最不可信的那个。",
    "那封信里写的不止是地址。",
    "守望者看得见你。从序章就在看。",
    "暗蚀会的外围，是你自己走进去的。",
    "时间在某个瞬间倒流过，你只是没抓住。",
    "黄林晶还活着——不，他是死了，但还在写信。",
    "第一印的碎块记得你。",
    "你的影子偶尔比你慢半拍。",
    "教堂的钟声数错了。",
    "黑市里那把锁的钥匙，在死者口袋里。",
    "梦里的低语用的是你的声音。",
    "七印的顺序，和星座的顺序对不上。",
    "深渊进度不是数字，是潮水。",
    "你从未真正离开过那个序章的黄昏。"
  ];
  var RELATION_EDGES = [
    ['old_mentor','rival_child','mentor'],
    ['rival_child','village_child','friend'],
    ['debt_collector','rival_child','enemy'],
    ['tavern_owner','mysterious_traveler','unknown'],
    ['mysterious_traveler','old_mentor','unknown'],
    ['village_child','old_mentor','friend']
  ];
  var NODE_WHITELIST = ['old_mentor','rival_child','mysterious_traveler','tavern_owner','village_child','debt_collector','mercury','cecilia','markus','silvia','edmund','aurelia','gideon','isabel','lucius','vittorio','selene','kieran','rowan','thalia'];

  /* ---- 层容器 ---- */
  function ensureLayers(){
    if(!document.getElementById('v44-float-layer')){
      var f=document.createElement('div'); f.id='v44-float-layer'; document.body.appendChild(f);
    }
    if(!document.getElementById('v44-toast-layer')){
      var t=document.createElement('div'); t.id='v44-toast-layer'; document.body.appendChild(t);
    }
  }
  function isCompact(){
    try{
      if(S&&S.settings&&S.settings.compactMode) return true;
      if(window.V34&&V34.uiSettings&&V34.uiSettings.compactMode) return true;
    }catch(e){}
    return false;
  }

  /* ---- B1 FloatText 飘字 ---- */
  function showFloatText(el, text, type){
    try{
      if(isCompact()) return;
      ensureLayers();
      var layer=document.getElementById('v44-float-layer');
      var r=(el&&el.getBoundingClientRect)?el.getBoundingClientRect():null;
      var d=document.createElement('div');
      d.className='v44-float f-'+(type||'gold');
      d.textContent=text;
      var x=r?(r.left+r.width/2):(window.innerWidth/2);
      var y=r?(r.top-6):(window.innerHeight*0.4);
      d.style.left=Math.max(8,Math.min(window.innerWidth-90,x))+'px';
      d.style.top=Math.max(8,y)+'px';
      layer.appendChild(d);
      setTimeout(function(){ try{ if(d.parentNode) d.parentNode.removeChild(d); }catch(e){} },1300);
    }catch(e){}
  }

  /* ---- B2 ToastCenter 通知 ---- */
  function pushToast(title,msg,type){
    try{
      if(isCompact()) return;
      ensureLayers();
      var layer=document.getElementById('v44-toast-layer');
      while(layer.children.length>=5 && layer.firstChild) layer.removeChild(layer.firstChild);
      var d=document.createElement('div');
      d.className='v44-toast t-'+(type||'info');
      d.innerHTML='<div class="tt">'+String(title).replace(/</g,'&lt;')+'</div>'+(msg?'<div class="mm">'+String(msg).replace(/</g,'&lt;')+'</div>':'');
      d.onclick=function(){ toastOut(d); };
      layer.appendChild(d);
      setTimeout(function(){ toastOut(d); },3500);
    }catch(e){}
  }
  function toastOut(d){
    try{
      if(!d||!d.parentNode) return;
      d.classList.add('out');
      setTimeout(function(){ try{ if(d.parentNode) d.parentNode.removeChild(d); }catch(e){} },300);
    }catch(e){}
  }

  /* ---- B3 SceneFX 演出 ---- */
  function fxFlash(color){
    try{
      if(isCompact()) return;
      ensureLayers();
      var layer=document.getElementById('v44-float-layer');
      var d=document.createElement('div');
      d.className='v44-fx-layer';
      var fl=document.createElement('div');
      fl.className='v44-fx-flash show';
      fl.style.background='radial-gradient(ellipse at center,'+color+' 0%, transparent 70%)';
      d.appendChild(fl);
      layer.appendChild(d);
      setTimeout(function(){ try{ if(d.parentNode) d.parentNode.removeChild(d); }catch(e){} },1100);
    }catch(e){}
  }
  function fxTitle(text){
    try{
      if(isCompact()) return;
      ensureLayers();
      var layer=document.getElementById('v44-float-layer');
      var d=document.createElement('div');
      d.className='v44-fx-layer';
      var t=document.createElement('div');
      t.className='v44-fx-title';
      t.textContent=text;
      d.appendChild(t);
      layer.appendChild(d);
      setTimeout(function(){ try{ if(d.parentNode) d.parentNode.removeChild(d); }catch(e){} },1300);
    }catch(e){}
  }
  function fxShake(){
    try{
      if(isCompact()) return;
      document.body.classList.add('v44-shake');
      setTimeout(function(){ document.body.classList.remove('v44-shake'); },650);
    }catch(e){}
  }
  function fxGray(){ try{ document.body.classList.add('v44-gray'); }catch(e){} }

  /* ---- A4 章回卡 ---- */
  function renderChapterCard(title,subtitle){
    try{
      var story=document.getElementById('story');
      if(!story) return;
      var d=document.createElement('div');
      d.className='v44-chapter-card';
      d.innerHTML='<div class="ln"><div class="t">'+String(title).replace(/</g,'&lt;')+'</div></div>'+(subtitle?'<div class="s">'+String(subtitle).replace(/</g,'&lt;')+'</div>':'');
      story.appendChild(d);
      story.scrollTop=story.scrollHeight;
    }catch(e){}
  }

  /* ---- D1 天气图标 ---- */
  function weatherIcon(){
    try{
      var w=(S&&S.time&&S.time.weather)||'clear';
      return WEATHER_ICONS[w]||WEATHER_ICONS.clear;
    }catch(e){ return '☀️'; }
  }

  /* ---- C 氛围应用 ---- */
  function ambientFor(){
    try{
      var w=(S&&S.time&&S.time.weather)||'clear';
      if(w==='rain'||w==='storm') return 'rain';
      if(w==='snow'||w==='fog') return 'wind';
      var p=(S&&S.time&&S.time.period)||'noon';
      if(p==='night') return 'night';
      var loc=String(S.loc||'').split('_')[0];
      if(loc==='free') return 'tavern';
      if(loc==='church') return 'church';
      return 'silence';
    }catch(e){ return 'silence'; }
  }
  function applyAtmosphere(){
    try{
      if(typeof S==='undefined'||!S) return;
      var p=(S.time&&S.time.period)||'noon';
      if(typeof v34_setTime==='function') v34_setTime(p);
      var w=(S.time&&S.time.weather)||'clear';
      if(typeof v34_setWeather==='function') v34_setWeather(w);
      var reg=S.region||'free';
      var b=document.body;
      for(var k in LOCATION_PALETTES) b.classList.remove(LOCATION_PALETTES[k]);
      b.classList.add(LOCATION_PALETTES[reg]||'loc-free');
      var ap=(S.abyssCountdown&&S.abyssCountdown.progress)||0;
      if(typeof v34_setAbyssCorruption==='function') v34_setAbyssCorruption(ap);
      var san=(typeof S.san==='number')?S.san:0;
      var max=(typeof S.maxSan==='number'&&S.maxSan>0)?S.maxSan:100;
      var ratio=san/max;
      b.classList.remove('san-low','san-critical');
      if(ratio<0.1) b.classList.add('san-critical');
      else if(ratio<0.3) b.classList.add('san-low');
      if(window.V34&&V34.audioSettings&&V34.audioSettings.enabled){
        if(typeof v34_playAmbient==='function') v34_playAmbient(ambientFor());
      }
    }catch(e){}
  }
  function chapterCheck(){
    try{
      if(typeof S==='undefined'||!S) return;
      var day=S.day||1;
      var loc=(typeof curLocName==='function')?curLocName():'';
      if(day!==V44.lastChapter.day){
        V44.lastChapter.day=day;
        renderChapterCard(fmtDate(day),'');
      }
      if(loc!==V44.lastChapter.loc){
        V44.lastChapter.loc=loc;
        var parts=loc.split(' · ');
        renderChapterCard('「'+(parts[parts.length-1]||loc)+'」','');
      }
    }catch(e){}
  }

  /* ---- 钩子：writeNext 后 ---- */
  function afterRender(){
    try{ applyAtmosphere(); chapterCheck(); }catch(e){}
  }

  /* ---- 钩子：判定演出 ---- */
  function diceFX(roll,target,tierLabel){
    try{
      if(tierLabel==='crit'){ fxFlash('rgba(120,160,70,.35)'); if(typeof v34_playSfx==='function') v34_playSfx('crit'); }
      else if(tierLabel==='critfail'){ fxShake(); if(typeof v34_playSfx==='function') v34_playSfx('critfail'); }
      else if(tierLabel==='fail'){ if(typeof v34_playSfx==='function') v34_playSfx('fail'); }
      else { if(typeof v34_playSfx==='function') v34_playSfx('success'); }
    }catch(e){}
  }

  /* ---- 钩子：突破演出 ---- */
  function breakthroughFX(ok){
    try{
      if(ok){ fxFlash('rgba(160,120,40,.35)'); fxTitle('境界突破'); if(typeof v34_playSfx==='function') v34_playSfx('breakthrough'); }
      else { fxShake(); if(typeof v34_playSfx==='function') v34_playSfx('critfail'); pushToast('走火入魔','气血逆行，损失部分生命','danger'); }
    }catch(e){}
  }

  /* ---- 钩子：时间推进 ---- */
  function afterAdvance(days){
    try{
      if(days>0){
        pushToast('时光流转','已过 '+days+' 日 · '+fmtDate(S.day),'info');
        if(typeof v34_playSfx==='function') v34_playSfx('page');
      }
    }catch(e){}
  }

  /* ---- 钩子：交易飘字 ---- */
  function tradeFX(delta,kind){
    try{
      var el=document.querySelector('.trade-info .gold-val')||document.getElementById('tb-gold');
      if(delta<0){ showFloatText(el,'-'+Math.abs(delta)+' 金','red'); if(typeof v34_playSfx==='function') v34_playSfx('coin'); }
      else { showFloatText(el,'+'+delta+' 金','green'); if(typeof v34_playSfx==='function') v34_playSfx('buy'); }
    }catch(e){}
  }

  /* ---- 钩子：关系通知 ---- */
  function relationToast(npcId,delta){
    try{
      var cn=npcId;
      if(typeof NPCS!=='undefined'&&NPCS&&NPCS[npcId]&&NPCS[npcId].cn) cn=NPCS[npcId].cn;
      else if(typeof PROLOGUE_NPCS!=='undefined'&&PROLOGUE_NPCS&&PROLOGUE_NPCS[npcId]&&PROLOGUE_NPCS[npcId].cn) cn=PROLOGUE_NPCS[npcId].cn;
      pushToast(delta>0?'关系提升':'关系下降',cn+' 好感'+(delta>0?'+':'')+delta,'reputation');
    }catch(e){}
  }

  /* ---- 钩子：applyEffects 结果飘字 ---- */
  function parseEffects(r){
    try{
      if(!r||typeof r!=='string') return;
      var m=r.match(/([+-]\d+)\s*(金币|修为|生命|SAN|声望|业力|气质|好感)/);
      if(!m) return;
      var el=document.getElementById('tb-gold');
      var type;
      if(m[2]==='金币') type='gold';
      else if(m[2]==='修为') type='purple';
      else type=(m[1][0]==='-'?'red':'green');
      showFloatText(el, m[1]+' '+m[2], type);
    }catch(e){}
  }

  /* ---- D3 快进行动 ---- */
  function quickRest(){
    try{
      if(typeof closeModal==='function') closeModal();
      if(typeof writePar==='function') writePar("你在落脚处沉沉睡去。醒来时，天光已新。","res");
      if(typeof advanceDays==='function') advanceDays(1);
      if(S&&S.world){ S.world.hour=8; S.world.actions=S.world.actionsMax; }
      if(typeof renderTop==='function') renderTop();
      if(typeof renderStats==='function') renderStats();
      if(typeof v44_afterAdvance==='function') v44_afterAdvance(1);
    }catch(e){}
  }

  /* ---- F1/F2 设置 seg ---- */
  function initSegs(){
    try{
      var fs=document.getElementById('v44-fontsize-seg');
      if(fs){
        var cur=(S.settings&&S.settings.fontSize)||'medium';
        var opts=[['small','小'],['medium','中'],['large','大']];
        var h='';
        for(var i=0;i<opts.length;i++) h+='<button class="'+(opts[i][0]===cur?'on':'')+'" data-v="'+opts[i][0]+'">'+opts[i][1]+'</button>';
        fs.innerHTML=h;
        var bs=fs.querySelectorAll('button');
        for(var j=0;j<bs.length;j++){
          (function(b){ b.onclick=function(){ v44_setFontSize(b.getAttribute('data-v')); initSegs(); }; })(bs[j]);
        }
      }
      var th=document.getElementById('v44-theme-seg');
      if(th){
        var curT=(S.settings&&S.settings.theme)||'parchment';
        var tops=[['parchment','羊皮纸'],['soft','柔光'],['night','暗夜']];
        var h2='';
        for(var m=0;m<tops.length;m++) h2+='<button class="'+(tops[m][0]===curT?'on':'')+'" data-v="'+tops[m][0]+'">'+tops[m][1]+'</button>';
        th.innerHTML=h2;
        var bs2=th.querySelectorAll('button');
        for(var n=0;n<bs2.length;n++){
          (function(b){ b.onclick=function(){ v44_setTheme(b.getAttribute('data-v')); initSegs(); }; })(bs2[n]);
        }
      }
    }catch(e){}
  }
  function setFontSize(v){
    try{
      if(!S.settings) S.settings={};
      S.settings.fontSize=v;
      document.body.classList.remove('fs-small','fs-medium','fs-large');
      document.body.classList.add('fs-'+v);
      if(typeof saveSetting==='function') saveSetting('fontSize',v);
    }catch(e){}
  }
  function setTheme(v){
    try{
      if(!S.settings) S.settings={};
      S.settings.theme=v;
      document.body.classList.remove('theme-parchment','theme-soft','theme-night');
      document.body.classList.add('theme-'+v);
      if(typeof saveSetting==='function') saveSetting('theme',v);
    }catch(e){}
  }

  /* ---- C3 SAN 低语循环 ---- */
  function whisperLoop(){
    try{
      if(V44.whisperTimer) clearTimeout(V44.whisperTimer);
      if(typeof S==='undefined'||!S){ V44.whisperTimer=setTimeout(whisperLoop,15000); return; }
      var b=document.body;
      var san=(typeof S.san==='number')?S.san:0;
      var max=(typeof S.maxSan==='number'&&S.maxSan>0)?S.maxSan:100;
      var ratio=san/max;
      if(b.classList.contains('san-critical')&&ratio<0.12){
        var el=document.createElement('div');
        el.className='v44-whisper-flash';
        el.textContent=WHISPER_POOL[Math.floor(Math.random()*WHISPER_POOL.length)];
        document.body.appendChild(el);
        setTimeout(function(){ try{ if(el.parentNode) el.parentNode.removeChild(el); }catch(e){} },2300);
        V44.whisperTimer=setTimeout(whisperLoop,8000+Math.floor(Math.random()*6000));
      } else if(ratio<0.3){
        V44.whisperTimer=setTimeout(whisperLoop,20000);
      } else {
        V44.whisperTimer=setTimeout(whisperLoop,15000);
      }
    }catch(e){}
  }

  /* ---- E 叙事可视化：图鉴 tab 化 ---- */
  function openAtlas(){
    try{ openModal(elFromHtml(v44_renderAtlas())); }catch(e){}
  }
  function atlasTab(t){
    V44.atlasTab=t;
    var b=document.getElementById('v44-atlas-body');
    if(b){
      b.innerHTML = t==='gallery'?v44_galleryBody():(t==='relation'?v44_relationBody():(t==='timeline'?v44_timelineBody():(t==='readings'?v45_readingsBody():(t==='strong'?v53_strongBody():v44_endingBody()))));
    }
  }
  function galleryBody(){
    var h="<div style='color:var(--gold2);margin-bottom:6px'><b>大陆文物图鉴</b> · "+galleryCount()+"/"+Object.keys(ITEM_GALLERY).length+" 件"
      +"（集齐 "+GALLERY_BONUS.need+" 件获大陆脉络加成）</div>";
    h+="<div class='gallery-grid'>";
    for(var k in ITEM_GALLERY){
      var g=ITEM_GALLERY[k]; var got=!!(S.world.gallery[k]);
      h+="<div class='g-card "+(got?"got":"")+"'><div class='ic'>"+g.ic+"</div><div class='nm'>"+esc(k)+"</div>";
      h+="<div class='d' style='font-size:11px;color:var(--dim)'>"+esc(g.area)+"</div>";
      if(got) h+="<div style='font-size:11px;margin-top:3px'>"+esc(g.desc)+"</div>";
      else h+="<div style='font-size:11px;color:#5a6b8a;margin-top:3px'>线索："+esc(g.how)+"</div>";
      h+="</div>";
    }
    h+="</div>";
    return h;
  }
  function relationBody(){
    try{
      var nodes=[];
      var seen={};
      function addNode(id,cn,role){
        if(seen[id]||!id) return;
        if(NODE_WHITELIST.indexOf(id)<0) return;
        seen[id]=true;
        var rel=(S&&S.npcRelations&&S.npcRelations[id])||0;
        nodes.push({id:id,cn:cn||id,role:role||'',rel:rel});
      }
      if(typeof NPCS!=='undefined'&&NPCS){ for(var k in NPCS){ var n=NPCS[k]; addNode(k,n.cn||k,n.role||''); } }
      if(typeof PROLOGUE_NPCS!=='undefined'&&PROLOGUE_NPCS){ for(var k2 in PROLOGUE_NPCS){ var n2=PROLOGUE_NPCS[k2]; addNode(k2,n2.cn||k2,n2.role||''); } }
      if(S&&S.npcRelations){ for(var k3 in S.npcRelations){ addNode(k3,k3,''); } }
      if(!nodes.length){
        for(var wi=0;wi<NODE_WHITELIST.length;wi++) addNode(NODE_WHITELIST[wi],NODE_WHITELIST[wi],'');
      }
      if(nodes.length>22) nodes=nodes.slice(0,22);
      var W=640,H=420,cx=320,cy=210,R=160;
      var svg='<svg viewBox="0 0 '+W+' '+H+'" class="v44-relation-svg">';
      var pos={};
      for(var i=0;i<nodes.length;i++){
        var ang=2*Math.PI*i/nodes.length - Math.PI/2;
        pos[nodes[i].id]={x:Math.round(cx+R*Math.cos(ang)), y:Math.round(cy+R*Math.sin(ang))};
      }
      for(var e=0;e<RELATION_EDGES.length;e++){
        var eg=RELATION_EDGES[e];
        if(!pos[eg[0]]||!pos[eg[1]]) continue;
        var p1=pos[eg[0]], p2=pos[eg[1]];
        var rel=(S&&S.npcRelations)?((S.npcRelations[eg[0]]||0)+(S.npcRelations[eg[1]]||0))/2:0;
        var cls='e-unknown';
        if(eg[2]==='mentor') cls='e-mentor';
        else if(eg[2]==='love') cls='e-love';
        else if(rel>=30) cls='e-friend';
        else if(rel<=-30) cls='e-enemy';
        svg+='<line class="edge '+cls+'" x1="'+p1.x+'" y1="'+p1.y+'" x2="'+p2.x+'" y2="'+p2.y+'"/>';
      }
      for(var m=0;m<nodes.length;m++){
        var nd=nodes[m], p=pos[nd.id];
        var fill=(nd.rel>=30)?'#4a8a4a':(nd.rel<=-30)?'#a03028':'#8b6f47';
        svg+='<g class="node" onclick="v44_relCard(\''+nd.id+'\')" style="cursor:pointer">';
        svg+='<circle cx="'+p.x+'" cy="'+p.y+'" r="9" fill="'+fill+'"/>';
        svg+='<text x="'+p.x+'" y="'+(p.y-13)+'" text-anchor="middle">'+esc(nd.cn)+'</text>';
        svg+='</g>';
      }
      svg+='</svg>';
      svg+='<div class="v44-rel-card" id="v44-rel-card">点击人物查看关系</div>';
      return svg;
    }catch(e){ return '<div style="color:var(--text-muted);font-size:13px">关系网暂不可用。</div>'; }
  }
  function relCard(id){
    try{
      var box=document.getElementById('v44-rel-card');
      if(!box) return;
      var cn=id, role='', rel=0, desc='';
      var npc=null;
      if(typeof NPCS!=='undefined'&&NPCS&&NPCS[id]) npc=NPCS[id];
      else if(typeof PROLOGUE_NPCS!=='undefined'&&PROLOGUE_NPCS&&PROLOGUE_NPCS[id]) npc=PROLOGUE_NPCS[id];
      if(npc){ cn=npc.cn||id; role=npc.role||npc.future||''; desc=npc.desc||''; }
      rel=(S&&S.npcRelations&&S.npcRelations[id])||0;
      var relTxt = rel>=60?'信任':rel>=30?'友善':rel>=0?'陌生':rel>=-30?'冷淡':'敌意';
      var h='<b>'+esc(cn)+'</b>'+(role?' · <span style="color:var(--text-secondary)">'+esc(role)+'</span>':'');
      h+='<div style="margin-top:4px">关系：<b style="color:'+(rel>=30?'#2a7a2a':(rel<=-30?'#a03028':'var(--text-secondary)'))+'">'+relTxt+'（'+rel+'）</b></div>';
      if(desc) h+='<div style="margin-top:3px;color:var(--text-muted);font-size:12px">'+esc(desc)+'</div>';
      box.innerHTML=h;
    }catch(e){}
  }
  function timelineBody(){
    try{
      var items=[];
      if(S&&S.time&&S.time.dailyLog){
        for(var i=0;i<S.time.dailyLog.length;i++){
          var d=S.time.dailyLog[i];
          var txt=(d.actions&&d.actions.join('、'))||(d.events&&d.events.join('、'))||'';
          if(txt) items.push({day:d.day||'?', text:txt, t:'player'});
        }
      }
      if(S&&S.world&&S.world.worldLogs){
        for(var j=0;j<S.world.worldLogs.length;j++){
          var w=S.world.worldLogs[j];
          if(w&&w.msg) items.push({day:w.day||'?', text:w.msg, t:'world'});
        }
      }
      if(S&&S.gameLog){
        for(var k=Math.max(0,S.gameLog.length-80);k<S.gameLog.length;k++){
          var g=S.gameLog[k];
          if(g&&g.text) items.push({day:g.day||'?', text:g.text, t:(g.type==='combat'||g.type==='danger')?'caus':'player'});
        }
      }
      items.sort(function(a,b){ return (a.day||0)-(b.day||0); });
      var last=items.slice(-45);
      if(!last.length) return '<div style="color:var(--text-muted);font-size:13px">旅途尚未开始，编年史还是空白。</div>';
      var h='<div class="v44-tl">';
      for(var m=0;m<last.length;m++){
        h+='<div class="v44-tl-item '+(last[m].t||'player')+'"><span class="v44-tl-day">第'+last[m].day+'日</span> <span class="v44-tl-text">'+esc(last[m].text)+'</span></div>';
      }
      h+='</div>';
      return h;
    }catch(e){ return '<div style="color:var(--text-muted);font-size:13px">编年史暂不可用。</div>'; }
  }
  function endingBody(){
    try{
      var keys=Object.keys(ENDINGS||{});
      var hist={};
      try{ var lg=JSON.parse(localStorage.getItem("elda-legacy-v2")||"{}"); if(lg&&lg.endings) hist=lg.endings; }catch(e){}
      if(S&&S.ending) hist[S.ending]=1;
      if(!keys.length) return '<div style="color:var(--text-muted);font-size:13px">暂无结局记录。</div>';
      var h='<div class="v44-end-grid">';
      for(var i=0;i<keys.length;i++){
        var k=keys[i], E=ENDINGS[k];
        var got=!!hist[k];
        h+='<div class="v44-end-card '+(got?'got':'')+'"><div class="ec">'+esc(E.cn||k)+'</div>';
        h+='<div class="ed">'+(got?'已达成':'条件未明')+'</div></div>';
      }
      h+='</div>';
      return h;
    }catch(e){ return '<div style="color:var(--text-muted);font-size:13px">结局图谱暂不可用。</div>'; }
  }
  function renderAtlas(){
    var tabs=[['gallery','图鉴'],['relation','关系网'],['timeline','编年史'],['ending','结局'],['chronicle','大陆纪事'],['readings','藏书'],['strong','强者谱']];
    var h='<div style="padding:4px 2px">';
    h+='<div class="v44-atlas-tabs">';
    for(var i=0;i<tabs.length;i++){
      h+='<button class="'+(V44.atlasTab===tabs[i][0]?'on':'')+'" onclick="v44_atlasTab(\''+tabs[i][0]+'\')">'+tabs[i][1]+'</button>';
    }
    h+='</div><div id="v44-atlas-body">';
    if(V44.atlasTab==='gallery') h+=galleryBody();
    else if(V44.atlasTab==='relation') h+=relationBody();
    else if(V44.atlasTab==='timeline') h+=timelineBody();
    else if(V44.atlasTab==='chronicle') h+=v47_chronicleBody();
    else if(V44.atlasTab==='readings') h+=v45_readingsBody();
    else if(V44.atlasTab==='strong') h+=v53_strongBody();
    else h+=endingBody();
    h+='</div></div>';
    return h;
  }

  /* ---- applyEffects 包装（飘字） ---- */
  (function(){
    try{
      if(typeof applyEffects==='function'){
        var _ae=applyEffects;
        applyEffects=function(eff,label){
          var r=_ae(eff,label);
          try{ parseEffects(r); }catch(e){}
          return r;
        };
      }
    }catch(e){}
  })();

  /* ---- 挂载全局 ---- */
  window.V44=V44;
  window.v44_showFloatText=showFloatText;
  window.v44_pushToast=pushToast;
  window.v44_toastOut=toastOut;
  window.v44_weatherIcon=weatherIcon;
  window.v44_afterRender=afterRender;
  window.v44_diceFX=diceFX;
  window.v44_breakthroughFX=breakthroughFX;
  window.v44_afterAdvance=afterAdvance;
  window.v44_tradeFX=tradeFX;
  window.v44_relationToast=relationToast;
  window.v44_parseEffects=parseEffects;
  window.v44_quickRest=quickRest;
  window.v44_initSegs=initSegs;
  window.v44_setFontSize=setFontSize;
  window.v44_setTheme=setTheme;
  window.v44_openAtlas=openAtlas;
  window.v44_atlasTab=atlasTab;
  window.v44_galleryBody=galleryBody;
  window.v44_relationBody=relationBody;
  window.v44_timelineBody=timelineBody;
  window.v44_endingBody=endingBody;
  window.v44_renderAtlas=renderAtlas;
  window.v44_relCard=relCard;

  /* ---- 启动：层 + 主题/字号恢复 + 低语循环 ---- */
  (function boot(){
    try{
      ensureLayers();
      var fs=(S&&S.settings&&S.settings.fontSize)||'medium';
      document.body.classList.add('fs-'+fs);
      var th=(S&&S.settings&&S.settings.theme)||'parchment';
      document.body.classList.add('theme-'+th);
      setTimeout(whisperLoop, 15000);
    }catch(e){}
  })();
}catch(e){ try{ console.log('v44 init:', e); }catch(_){} }
})();


// v65:content1 从军线 + 军校节点
/* /v62inj:chunk-war/ N["v65_join"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_join_north"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_join_church"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_join_academy"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_join_free"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_camp"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_camp_train"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_camp_patrol"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_camp_guard"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_camp_march"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_career"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_apply"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_courses"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_strategy"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_logistics"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_courage"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_acad_sandtable"] 已移入 chunks/v62_war.js */
// v65:content2 恩怨 / 战役 / 传奇战役节点
/* /v62inj:chunk-war/ N["v65_grudge_tavern"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_grudge_revenge"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_prep"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_formation"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_clash1"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_clash2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_clash3"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_battle_pursue"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_snow1"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_snow2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_snow3"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_snow4"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_snow5"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_fort1"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_fort2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_fort3"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_fort4"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_fort5"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_rift1"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_rift2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_rift3"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_rift4"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_legend_rift5"] 已移入 chunks/v62_war.js */
// v65:content3 将领 / 创伤 / 佣兵节点
/* /v62inj:chunk-war/ N["v65_merc"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_exchange"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_ex_armor"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_ex_scroll"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_ex_title"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_ex_intel"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_guard"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_done_guard"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_escort"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_done_escort"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_siege"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_done_siege"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_assassin"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_done_assassin"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_merc_done_assassin_kill"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_cmd_appoint"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_cmd_event1"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_cmd_event2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_cmd_event3"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_cmd_duel"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_view"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_ruin"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_ruin2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_refugee"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_refugee2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_orphan"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_orphan2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_veteran"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_veteran2"] 已移入 chunks/v62_war.js */
/* /v62inj:chunk-war/ N["v65_scar_veteran3"] 已移入 chunks/v62_war.js */
