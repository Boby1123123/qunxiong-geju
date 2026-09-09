#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v34 第二步：插入JS函数（场景氛围/文字演出/判定演出/面板质感/地图/音效/图鉴）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v34_js = r"""
/* ===== v34 UI沉浸感系统 ===== */

// 全局状态
var V34 = {
  sceneAtmosphere: {theme:"city", time:"noon", weather:"clear", abyssCorruption:0, particlesEnabled:true},
  textSettings: {typewriterEnabled:true, typewriterSpeed:25, autoScroll:true, textEffects:true},
  diceSettings: {animationEnabled:true, showNumbers:true, sfxEnabled:false},
  uiSettings: {panelStyle:"parchment", glassEffect:true, animations:true, compactMode:false},
  audioSettings: {enabled:false, bgmVolume:0.3, sfxVolume:0.3, ambientVolume:0.2, currentBgm:null, currentAmbient:null},
  codex: {achievements:{}, bestiary:{}, items:{}, locations:{}, characters:{}},
  combo: {success:0, fail:0},
  typewriter: {active:false, currentEl:null, fullText:"", timer:null}
};

// ========== 方向一：场景氛围动态系统 ==========
function v34_initAtmosphere(){
  // 创建氛围叠加层
  if(!document.getElementById('atmosphere-overlay')){
    var overlay = document.createElement('div');
    overlay.id = 'atmosphere-overlay';
    document.body.appendChild(overlay);
  }
  v34_applyAtmosphere();
}

function v34_setTheme(theme){
  V34.sceneAtmosphere.theme = theme;
  v34_applyAtmosphere();
}

function v34_setTime(time){
  V34.sceneAtmosphere.time = time;
  document.body.classList.remove('time-morning','time-noon','time-dusk','time-night');
  document.body.classList.add('time-' + time);
}

function v34_setWeather(weather){
  V34.sceneAtmosphere.weather = weather;
  document.body.classList.remove('weather-rain','weather-snow','weather-fog','weather-clear');
  document.body.classList.add('weather-' + weather);
  v34_updateParticles();
}

function v34_setAbyssCorruption(level){
  V34.sceneAtmosphere.abyssCorruption = level;
  document.body.classList.remove('abyss-high','abyss-critical');
  if(level >= 60) document.body.classList.add('abyss-high');
  if(level >= 90) document.body.classList.add('abyss-critical');
}

function v34_applyAtmosphere(){
  document.body.classList.remove('time-morning','time-noon','time-dusk','time-night');
  document.body.classList.add('time-' + V34.sceneAtmosphere.time);
  document.body.classList.remove('weather-rain','weather-snow','weather-fog','weather-clear');
  document.body.classList.add('weather-' + V34.sceneAtmosphere.weather);
  v34_updateParticles();
}

function v34_updateParticles(){
  // 清除旧粒子
  var old = document.querySelectorAll('.v34-particle');
  for(var i=0;i<old.length;i++) old[i].remove();
  if(!V34.sceneAtmosphere.particlesEnabled) return;
  var weather = V34.sceneAtmosphere.weather;
  var count = 0;
  if(weather === 'rain') count = 40;
  else if(weather === 'snow') count = 25;
  else if(weather === 'fog') count = 8;
  for(var j=0;j<count;j++){
    var p = document.createElement('div');
    p.className = 'v34-particle particle ' + (weather==='rain'?'rain-drop':'snow-flake');
    p.style.left = Math.random()*100 + '%';
    p.style.animationDelay = (Math.random()*3) + 's';
    p.style.animationDuration = (weather==='rain'?(0.3+Math.random()*0.3):(3+Math.random()*3)) + 's';
    if(weather==='snow'){ p.style.width = (3+Math.random()*4)+'px'; p.style.height = p.style.width; }
    document.body.appendChild(p);
  }
}

function v34_toggleParticles(enabled){
  V34.sceneAtmosphere.particlesEnabled = enabled;
  v34_updateParticles();
}

// ========== 方向二：文字演出与动效升级 ==========
function v34_typewriter(element, text, speed){
  if(!V34.textSettings.typewriterEnabled){
    element.innerHTML = text;
    return;
  }
  speed = speed || V34.textSettings.typewriterSpeed;
  V34.typewriter.active = true;
  V34.typewriter.currentEl = element;
  V34.typewriter.fullText = text;
  element.innerHTML = '';
  var cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  element.appendChild(cursor);
  var i = 0;
  function typeNext(){
    if(i < text.length){
      cursor.insertAdjacentText('beforebegin', text[i]);
      i++;
      V34.typewriter.timer = setTimeout(typeNext, speed);
    } else {
      cursor.remove();
      V34.typewriter.active = false;
    }
  }
  typeNext();
}

function v34_skipTypewriter(){
  if(V34.typewriter.active && V34.typewriter.currentEl){
    clearTimeout(V34.typewriter.timer);
    V34.typewriter.currentEl.innerHTML = V34.typewriter.fullText;
    V34.typewriter.active = false;
  }
}

function v34_applyTextEffect(text, effect){
  var effects = {
    whisper:'tx-whisper', shout:'tx-shout', ancient:'tx-ancient',
    abyss:'tx-abyss', thought:'tx-thought', important:'tx-important',
    fear:'tx-fear', memory:'tx-memory'
  };
  var cls = effects[effect] || '';
  if(cls) return '<span class="' + cls + '">' + text + '</span>';
  return text;
}

function v34_animateOptions(){
  var opts = document.querySelectorAll('#options .opt');
  for(var i=0;i<opts.length;i++){
    opts[i].classList.add('option-enter');
    opts[i].style.animationDelay = (i*0.08) + 's';
  }
}

function v34_markOptionChosen(optEl){
  optEl.classList.add('option-chosen');
}

function v34_sceneTransition(callback){
  var story = document.getElementById('story');
  if(story){
    story.classList.add('scene-transition');
    setTimeout(function(){
      if(callback) callback();
      story.classList.remove('scene-transition');
    }, 300);
  } else if(callback){ callback(); }
}

function v34_autoScroll(){
  if(V34.textSettings.autoScroll){
    var story = document.getElementById('story');
    if(story) story.scrollTop = story.scrollHeight;
  }
}

// ========== 方向三：判定演出系统 ==========
var V34_DICE_TIERS = {
  crit:{name:"大成功", cls:"dice-crit", texts:["完美！","神来之笔！","天助我也！","不可思议！","有如神助！"]},
  extreme:{name:"极难成功", cls:"dice-extreme", texts:["险胜！","勉强成功！","差一点！","好险！"]},
  hard:{name:"困难成功", cls:"dice-hard", texts:["成功。","还好。","勉强通过。"]},
  normal:{name:"成功", cls:"dice-normal", texts:["成功。","通过。","没问题。"]},
  fail:{name:"失败", cls:"dice-fail", texts:["失败……","差一点……","可惜……","没能成功……"]},
  critfail:{name:"大失败", cls:"dice-critfail", texts:["糟糕！","完蛋了！","大祸临头！","怎会如此！"]}
};

function v34_rollDice(target, rolled, tier, callback){
  if(!V34.diceSettings.animationEnabled){
    if(callback) callback();
    return;
  }
  var tierData = V34_DICE_TIERS[tier] || V34_DICE_TIERS.normal;
  var flavor = tierData.texts[Math.floor(Math.random()*tierData.texts.length)];
  
  // 创建遮罩
  var overlay = document.createElement('div');
  overlay.className = 'dice-overlay';
  overlay.id = 'v34-dice-overlay';
  overlay.innerHTML = 
    '<div class="dice-container">' +
    '<div class="dice-3d" id="v34-dice-num">?</div>' +
    '<div class="dice-result-banner ' + tierData.cls + '" id="v34-dice-banner" style="display:none">' + tierData.name + '</div>' +
    '<div class="dice-numbers" id="v34-dice-nums" style="display:none">' +
    '目标值：<span class="target">' + target + '</span> | 掷出：<span class="rolled ' + (tier==='fail'||tier==='critfail'?'fail':'success') + '">' + rolled + '</span>' +
    '</div>' +
    '<div class="dice-flavor" id="v34-dice-flavor" style="display:none">' + flavor + '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  
  // 骰子旋转后显示结果
  setTimeout(function(){
    document.getElementById('v34-dice-num').textContent = rolled;
  }, 600);
  setTimeout(function(){
    document.getElementById('v34-dice-banner').style.display = 'block';
    document.getElementById('v34-dice-nums').style.display = 'block';
    document.getElementById('v34-dice-flavor').style.display = 'block';
  }, 800);
  
  // 点击或1.8s后关闭
  var closed = false;
  function closeDice(){
    if(closed) return;
    closed = true;
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .3s';
    setTimeout(function(){ overlay.remove(); }, 300);
    if(callback) callback();
  }
  overlay.addEventListener('click', closeDice);
  setTimeout(closeDice, 2000);
  
  // 更新连击
  if(tier === 'crit' || tier === 'extreme' || tier === 'hard' || tier === 'normal'){
    V34.combo.success++;
    V34.combo.fail = 0;
    if(V34.combo.success >= 2) v34_showCombo(V34.combo.success, 'success');
  } else {
    V34.combo.fail++;
    V34.combo.success = 0;
    if(V34.combo.fail >= 2) v34_showCombo(V34.combo.fail, 'fail');
  }
}

function v34_showCombo(count, type){
  var old = document.getElementById('v34-combo');
  if(old) old.remove();
  var combo = document.createElement('div');
  combo.className = 'combo-counter';
  combo.id = 'v34-combo';
  combo.textContent = (type==='success'?'连击 ':'厄运累积 ') + 'x' + count;
  combo.style.color = type==='success' ? '#2a5a2a' : '#6a2a1a';
  document.body.appendChild(combo);
  setTimeout(function(){ combo.remove(); }, 2000);
}

function v34_showGainLoss(gains, losses){
  var html = '<div style="margin:10px 0;padding:10px 14px;background:rgba(180,160,120,.1);border-radius:6px;border-left:3px solid #7a5a10">';
  if(gains){
    for(var i=0;i<gains.length;i++){
      html += '<div class="gain-loss-item gain-item" style="animation-delay:' + (i*0.1) + 's">+ ' + gains[i] + '</div>';
    }
  }
  if(losses){
    for(var j=0;j<losses.length;j++){
      html += '<div class="gain-loss-item loss-item" style="animation-delay:' + ((gains?gains.length:0)+j)*0.1 + 's">- ' + losses[j] + '</div>';
    }
  }
  html += '</div>';
  return html;
}

// ========== 方向五：面板质感与光影 ==========
function v34_applyPanelStyle(el, style){
  if(!el) return;
  el.classList.add('panel-v34');
  if(style === 'ornate') el.classList.add('panel-v34-ornate');
}

function v34_numberPop(el){
  if(!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // 触发重排
  el.style.animation = 'comboPop .3s ease-out';
}

function v34_animateProgressBar(bar, newValue){
  if(!bar) return;
  bar.style.width = newValue + '%';
}

function v34_setCompactMode(enabled){
  V34.uiSettings.compactMode = enabled;
  document.body.classList.toggle('simple-mode', enabled);
}

// ========== 方向四：交互地图 ==========
var V34_MAP_LOCATIONS = {
  free_city:{id:"free_city",name:"交汇城",type:"city",x:45,y:55,icon:"🏰",explored:true,danger:1,desc:"自由城邦的中心，大陆最繁华的贸易城市。"},
  iron_pass:{id:"iron_pass",name:"铁门关",type:"fortress",x:20,y:30,icon:"⚔️",explored:true,danger:3,desc:"北方公国的边境要塞，抵御深渊生物的前线。"},
  south_port:{id:"south_port",name:"南方港城",type:"city",x:60,y:75,icon:"⚓",explored:true,danger:2,desc:"南方商业城邦的港口，海上贸易的枢纽。"},
  holy_city:{id:"holy_city",name:"圣城",type:"holy",x:75,y:40,icon:"✨",explored:false,danger:2,desc:"光明教会的中心，朝圣者的圣地。"},
  silver_leaf:{id:"silver_leaf",name:"银叶城",type:"elf",x:30,y:65,icon:"🌿",explored:false,danger:1,desc:"精灵王国的都城，世界树的所在地。"},
  ironpeak:{id:"ironpeak",name:"铁峰堡",type:"dwarf",x:15,y:50,icon:"⛏️",explored:false,danger:2,desc:"矮人王国的首都，永恒熔炉所在。"},
  orc_homeland:{id:"orc_homeland",name:"兽人王庭",type:"orc",x:85,y:25,icon:"🗡️",explored:false,danger:3,desc:"兽人草原的王庭，战士的故乡。"},
  death_desert:{id:"death_desert",name:"死亡沙漠",type:"danger",x:50,y:85,icon:"🏜️",explored:false,danger:5,desc:"大陆南部的死亡沙漠，传说中有古国遗迹。"},
  elda_academy:{id:"elda_academy",name:"艾尔达学院",type:"academy",x:42,y:48,icon:"📚",explored:true,danger:1,desc:"大陆最古老的魔法学院，七印研究的中心。"}
};

function v34_openMap(){
  var modal = document.getElementById('modal');
  if(!modal) return;
  var box = modal.querySelector('.box');
  if(!box) return;
  
  var html = '<h2>大陆地图</h2>';
  html += '<div class="map-container-v34" id="v34-map">';
  html += '<div class="map-controls"><button class="map-zoom-btn" onclick="v34_zoomMap(1)">+</button><button class="map-zoom-btn" onclick="v34_zoomMap(-1)">−</button></div>';
  html += '<div class="map-fog"></div>';
  
  // 渲染地点
  for(var id in V34_MAP_LOCATIONS){
    var loc = V34_MAP_LOCATIONS[id];
    var current = (S && S.loc === id) ? ' current' : '';
    var undiscovered = !loc.explored ? ' undiscovered' : '';
    html += '<div class="map-location' + current + undiscovered + '" style="left:' + loc.x + '%;top:' + loc.y + '%" onclick="v34_selectLocation(\'' + id + '\')">';
    html += '<div class="map-location-icon">' + (loc.explored ? loc.icon : '❓') + '</div>';
    if(loc.explored) html += '<div class="map-location-name">' + loc.name + '</div>';
    html += '</div>';
  }
  
  html += '<div class="map-info-card" id="v34-map-info" style="display:none">';
  html += '<div id="v34-map-info-content"></div>';
  html += '</div>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  
  box.innerHTML = html;
  modal.classList.add('show');
}

function v34_selectLocation(id){
  var loc = V34_MAP_LOCATIONS[id];
  if(!loc) return;
  var info = document.getElementById('v34-map-info');
  var content = document.getElementById('v34-map-info-content');
  if(!info || !content) return;
  
  var dangerStars = '';
  for(var i=0;i<loc.danger;i++) dangerStars += '⚠️';
  
  content.innerHTML = 
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
    '<span style="font-size:18px;font-weight:900;color:#241a08">' + loc.icon + ' ' + loc.name + '</span>' +
    '<span style="font-size:12px;color:#6a2a1a">' + dangerStars + '</span>' +
    '</div>' +
    '<div style="font-size:13px;color:#3a2e10;line-height:1.6;margin-bottom:10px">' + loc.desc + '</div>' +
    '<div style="display:flex;gap:8px">' +
    '<button class="btn btn-3d btn-3d-gold" onclick="v34_travelTo(\'' + id + '\')">前往</button>' +
    '<button class="btn btn-3d" onclick="document.getElementById(\'v34-map-info\').style.display=\'none\'">关闭</button>' +
    '</div>';
  info.style.display = 'block';
}

function v34_travelTo(id){
  var loc = V34_MAP_LOCATIONS[id];
  if(!loc) return;
  closeModal();
  if(typeof writePar === 'function'){
    writePar('你决定前往' + loc.name + '。');
  }
  // 这里可以接入实际的旅行系统
}

function v34_zoomMap(dir){
  var map = document.getElementById('v34-map');
  if(!map) return;
  var current = parseFloat(map.dataset.zoom) || 1;
  var next = Math.max(0.8, Math.min(2, current + dir*0.2));
  map.dataset.zoom = next;
  map.style.transform = 'scale(' + next + ')';
  map.style.transformOrigin = 'center center';
}

// ========== 方向六：音效与音乐系统 ==========
var V34_AUDIO = {
  ctx: null,
  bgmAudio: null,
  ambientAudio: null
};

function v34_initAudio(){
  try{
    V34_AUDIO.ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e){
    console.log('Audio not supported');
  }
}

function v34_toggleAudio(){
  V34.audioSettings.enabled = !V34.audioSettings.enabled;
  var btn = document.querySelector('.audio-toggle');
  if(btn){
    btn.textContent = V34.audioSettings.enabled ? '🔊' : '🔇';
    btn.classList.toggle('muted', !V34.audioSettings.enabled);
  }
  if(V34.audioSettings.enabled){
    v34_initAudio();
    v34_playSfx('click');
  } else {
    v34_stopBgm();
    v34_stopAmbient();
  }
}

function v34_playSfx(type){
  if(!V34.audioSettings.enabled || !V34_AUDIO.ctx) return;
  // 用Web Audio生成简单音效
  var ctx = V34_AUDIO.ctx;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  var freq = 440, duration = 0.1, vol = V34.audioSettings.sfxVolume;
  switch(type){
    case 'click': freq=800; duration=0.05; break;
    case 'hover': freq=600; duration=0.03; break;
    case 'success': freq=880; duration=0.15; break;
    case 'fail': freq=220; duration=0.2; break;
    case 'crit': freq=1047; duration=0.3; break;
    case 'critfail': freq=150; duration=0.4; break;
    case 'item': freq=1200; duration=0.1; break;
    case 'levelup': freq=523; duration=0.4; break;
  }
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function v34_playBgm(type){
  if(!V34.audioSettings.enabled) return;
  // BGM需要音频文件，这里预留接口
  V34.audioSettings.currentBgm = type;
}

function v34_stopBgm(){
  V34.audioSettings.currentBgm = null;
}

function v34_playAmbient(type){
  if(!V34.audioSettings.enabled) return;
  V34.audioSettings.currentAmbient = type;
}

function v34_stopAmbient(){
  V34.audioSettings.currentAmbient = null;
}

function v34_setVolume(type, value){
  if(type === 'bgm') V34.audioSettings.bgmVolume = value;
  else if(type === 'sfx') V34.audioSettings.sfxVolume = value;
  else if(type === 'ambient') V34.audioSettings.ambientVolume = value;
}

// ========== 方向七：存档与图鉴可视化 ==========
function v34_renderSaveSlots(){
  var html = '<h2>读取存档</h2>';
  // 自动存档
  html += v34_saveSlotHtml('auto', '自动存档', '交汇城', '第1天', 15);
  // 手动存档槽位
  for(var i=1;i<=5;i++){
    var saved = localStorage.getItem('elda-save-' + i);
    if(saved){
      try{
        var data = JSON.parse(saved);
        html += v34_saveSlotHtml(i, data.name || '存档' + i, data.loc || '未知', '第' + (data.day||1) + '天', data.progress || 0);
      } catch(e){
        html += v34_saveSlotHtml(i, '存档' + i, '未知', '未知', 0);
      }
    } else {
      html += v34_saveSlotHtml(i, '空存档槽', '-', '-', 0, true);
    }
  }
  html += '<div style="text-align:center;margin-top:14px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_saveSlotHtml(id, name, loc, day, progress, empty){
  var icon = empty ? '📁' : '⚔️';
  return '<div class="save-slot-v34" onclick="' + (empty ? '' : "v34_loadSave('" + id + "')") + '" style="' + (empty?'opacity:.5;cursor:default':'') + '">' +
    '<div class="save-slot-thumb">' + icon + '</div>' +
    '<div class="save-slot-info">' +
    '<div class="save-slot-name">' + name + '</div>' +
    '<div class="save-slot-meta"><span>📍 ' + loc + '</span><span>📅 ' + day + '</span></div>' +
    '<div class="save-slot-progress"><div class="save-slot-progress-fill" style="width:' + progress + '%"></div></div>' +
    '</div></div>';
}

function v34_loadSave(id){
  // 接入实际的读档逻辑
  closeModal();
  if(typeof writePar === 'function') writePar('读取存档：' + id);
}

var V34_ACHIEVEMENTS = {
  first_step:{id:"first_step",name:"第一步",desc:"完成序章",icon:"👣",rarity:"common"},
  academy_grad:{id:"academy_grad",name:"毕业",desc:"从学院毕业",icon:"🎓",rarity:"rare"},
  seal_master:{id:"seal_master",name:"七印之主",desc:"修复全部七印",icon:"🔮",rarity:"legendary"},
  abyss_lord:{id:"abyss_lord",name:"深渊之主",desc:"解放深渊",icon:"👁️",rarity:"legendary"},
  peacemaker:{id:"peacemaker",name:"和平使者",desc:"阻止大陆战争",icon:"🕊️",rarity:"epic"},
  rich:{id:"rich",name:"富甲一方",desc:"拥有1000金币",icon:"💰",rarity:"rare"},
  warrior:{id:"warrior",name:"百战百胜",desc:"赢得50场战斗",icon:"⚔️",rarity:"epic"},
  scholar:{id:"scholar",name:"博学者",desc:"阅读50本书籍",icon:"📖",rarity:"rare"},
  loved:{id:"loved",name:"万人迷",desc:"与5人达成挚友关系",icon:"❤️",rarity:"epic"},
  survivor:{id:"survivor",name:"幸存者",desc:"从大失败中恢复",icon:"🛡️",rarity:"common"}
};

function v34_renderAchievements(){
  var html = '<h2>成就墙</h2>';
  var unlocked = 0, total = 0;
  html += '<div class="achievement-grid">';
  for(var id in V34_ACHIEVEMENTS){
    var ach = V34_ACHIEVEMENTS[id];
    total++;
    var isUnlocked = V34.codex.achievements[id] || false;
    if(isUnlocked) unlocked++;
    html += '<div class="achievement-card ' + (isUnlocked?'unlocked':'locked') + ' achievement-rarity-' + ach.rarity + '">';
    html += '<div class="achievement-icon">' + (isUnlocked ? ach.icon : '❓') + '</div>';
    html += '<div class="achievement-name">' + (isUnlocked ? ach.name : '???') + '</div>';
    html += '<div class="achievement-desc">' + (isUnlocked ? ach.desc : '未解锁') + '</div>';
    html += '</div>';
  }
  html += '</div>';
  html += '<div style="text-align:center;margin:14px 0;font-size:14px;color:#5a4a30">已解锁：' + unlocked + ' / ' + total + '</div>';
  html += '<div style="text-align:center"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_unlockAchievement(id){
  if(V34.codex.achievements[id]) return;
  V34.codex.achievements[id] = true;
  v34_playSfx('levelup');
  // 可以添加成就解锁通知
}

function v34_addToCodex(type, id){
  if(!V34.codex[type]) V34.codex[type] = {};
  V34.codex[type][id] = true;
}

// ========== v34 设置面板 ==========
function v34_renderSettings(){
  var html = '<h2>游戏设置</h2>';
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">文字演出</h4>';
  html += v34_settingRow('打字机效果', '剧情文字逐字显示', 'typewriterEnabled', 'checkbox');
  html += v34_settingRow('打字机速度', '文字显示速度', 'typewriterSpeed', 'slider', 10, 80);
  html += v34_settingRow('文字特效', '低语/呐喊/古老等特效', 'textEffects', 'checkbox');
  html += v34_settingRow('自动滚动', '新内容自动滚动到底部', 'autoScroll', 'checkbox');
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">场景氛围</h4>';
  html += v34_settingRow('粒子效果', '雨/雪/雾等天气粒子', 'particlesEnabled', 'checkbox');
  html += v34_settingRow('判定动画', '掷骰子动画演出', 'diceAnimation', 'checkbox');
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">音效</h4>';
  html += v34_settingRow('启用音效', '开启游戏音效', 'audioEnabled', 'checkbox');
  html += v34_settingRow('音效音量', 'UI/判定音效', 'sfxVolume', 'slider', 0, 100);
  
  html += '<h4 style="color:#5a4a10;margin:16px 0 8px">界面</h4>';
  html += v34_settingRow('简洁模式', '关闭所有动画效果', 'compactMode', 'checkbox');
  
  html += '<div style="text-align:center;margin-top:20px"><button class="btn btn-back" onclick="closeModal()">返回游戏</button></div>';
  return html;
}

function v34_settingRow(label, desc, key, type, min, max){
  var val = V34.textSettings[key] !== undefined ? V34.textSettings[key] :
            V34.sceneAtmosphere[key] !== undefined ? V34.sceneAtmosphere[key] :
            V34.diceSettings[key] !== undefined ? V34.diceSettings[key] :
            V34.audioSettings[key] !== undefined ? V34.audioSettings[key] :
            V34.uiSettings[key] !== undefined ? V34.uiSettings[key] : false;
  
  var control = '';
  if(type === 'checkbox'){
    control = '<input type="checkbox" class="v34-checkbox" ' + (val?'checked':'') + ' onchange="v34_toggleSetting(\'' + key + '\', this.checked)">';
  } else if(type === 'slider'){
    var pct = type==='slider' && key==='typewriterSpeed' ? val : (val*100);
    control = '<input type="range" class="v34-slider" min="' + (min||0) + '" max="' + (max||100) + '" value="' + val + '" onchange="v34_setSettingValue(\'' + key + '\', this.value)">';
  }
  
  return '<div class="v34-setting-row">' +
    '<div><div class="v34-setting-label">' + label + '</div>' +
    '<div class="v34-setting-desc">' + desc + '</div></div>' +
    control + '</div>';
}

function v34_toggleSetting(key, value){
  if(key === 'typewriterEnabled') V34.textSettings.typewriterEnabled = value;
  else if(key === 'textEffects') V34.textSettings.textEffects = value;
  else if(key === 'autoScroll') V34.textSettings.autoScroll = value;
  else if(key === 'particlesEnabled') v34_toggleParticles(value);
  else if(key === 'diceAnimation') V34.diceSettings.animationEnabled = value;
  else if(key === 'audioEnabled') v34_toggleAudio();
  else if(key === 'compactMode') v34_setCompactMode(value);
}

function v34_setSettingValue(key, value){
  if(key === 'typewriterSpeed') V34.textSettings.typewriterSpeed = parseInt(value);
  else if(key === 'sfxVolume') V34.audioSettings.sfxVolume = value/100;
}

// ========== v34 初始化 ==========
function v34_init(){
  v34_initAtmosphere();
  // 添加音效切换按钮
  if(!document.querySelector('.audio-toggle')){
    var audioBtn = document.createElement('div');
    audioBtn.className = 'audio-toggle muted';
    audioBtn.textContent = '🔇';
    audioBtn.onclick = v34_toggleAudio;
    document.body.appendChild(audioBtn);
  }
  console.log('v34 UI沉浸感系统已初始化');
}

// 页面加载完成后初始化
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', v34_init);
} else {
  v34_init();
}
"""

# 在最后一个</script>之前插入
last_script = html.rfind('</script>')
if last_script > 0:
    html = html[:last_script] + v34_js + '\n' + html[last_script:]
    print("✓ v34 JS函数插入完成")
else:
    print("✗ 未找到</script>")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
