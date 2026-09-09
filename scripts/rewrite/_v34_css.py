#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v34 第一步：插入CSS样式（场景氛围/文字演出/判定演出/面板质感/地图/音效/图鉴）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v34_css = """
/* ===== v34 UI沉浸感系统 ===== */

/* 方向一：场景氛围动态系统 */
#atmosphere-overlay{
  position:fixed; inset:0; pointer-events:none; z-index:5;
  transition: background .8s ease, filter .8s ease;
}
body.time-morning{ filter:brightness(1.02) saturate(1.05); }
body.time-noon{ filter:brightness(1.05) saturate(1); }
body.time-dusk{ filter:brightness(.95) saturate(1.1) sepia(.1); }
body.time-night{ filter:brightness(.82) saturate(.85) hue-rotate(-10deg); }
body.time-night #atmosphere-overlay{
  background: radial-gradient(ellipse at 50% 100%, rgba(20,30,60,.18), transparent 60%);
}
body.weather-rain #atmosphere-overlay{
  background: linear-gradient(180deg, rgba(100,120,140,.08), rgba(80,100,120,.12));
}
body.weather-snow #atmosphere-overlay{
  background: linear-gradient(180deg, rgba(200,210,220,.1), rgba(180,190,200,.08));
}
body.weather-fog #atmosphere-overlay{
  background: radial-gradient(ellipse at center, rgba(180,180,170,.15), rgba(160,160,150,.25));
}
body.abyss-high #atmosphere-overlay{
  background: radial-gradient(ellipse at center, transparent 40%, rgba(120,20,40,.15) 100%);
  animation: abyssPulse 3s ease-in-out infinite;
}
@keyframes abyssPulse{
  0%,100%{ opacity:.6; }
  50%{ opacity:1; }
}
.particle{
  position:fixed; pointer-events:none; z-index:6;
}
.rain-drop{
  width:1px; height:20px; background:linear-gradient(180deg, transparent, rgba(150,170,190,.6));
  animation: rainFall .4s linear infinite;
}
@keyframes rainFall{
  from{ transform:translateY(-20px); }
  to{ transform:translateY(100vh); }
}
.snow-flake{
  width:4px; height:4px; background:rgba(220,220,230,.8); border-radius:50%;
  animation: snowFall 4s linear infinite;
}
@keyframes snowFall{
  from{ transform:translateY(-10px) translateX(0); }
  to{ transform:translateY(100vh) translateX(30px); }
}

/* 方向二：文字演出与动效 */
.tx-whisper{ color:#5a4a30; font-style:italic; opacity:.85; animation:fadeInSlow .8s ease-out; }
.tx-shout{ color:#7a2a1a; font-weight:900; font-size:19px; animation:shakeText .3s ease-in-out; }
.tx-ancient{ color:#7a5a10; font-family:"Noto Serif SC",serif; font-weight:700; text-shadow:0 0 8px rgba(122,90,16,.3); animation:glowIn 1s ease-out; }
.tx-abyss{ color:#6a2a4a; font-weight:700; animation:glitchText .5s ease-in-out; }
.tx-thought{ color:#5a5a6a; font-style:italic; padding-left:2em; opacity:.8; }
.tx-important{ color:#5a4a10; font-weight:900; border-bottom:2px solid #7a5a10; padding-bottom:1px; }
.tx-fear{ color:#3a4a6a; animation:fearShake .4s ease-in-out; }
.tx-memory{ color:#6a5a40; filter:sepia(.3); opacity:.85; }
@keyframes fadeInSlow{ from{opacity:0; transform:translateY(5px);} to{opacity:.85; transform:translateY(0);} }
@keyframes shakeText{ 0%,100%{transform:translateX(0);} 25%{transform:translateX(-3px);} 75%{transform:translateX(3px);} }
@keyframes glowIn{ from{opacity:0; text-shadow:0 0 20px rgba(122,90,16,.8);} to{opacity:1; text-shadow:0 0 8px rgba(122,90,16,.3);} }
@keyframes glitchText{ 0%{transform:translate(0); filter:hue-rotate(0);} 25%{transform:translate(-2px,1px); filter:hue-rotate(30deg);} 50%{transform:translate(2px,-1px); filter:hue-rotate(-30deg);} 75%{transform:translate(-1px,2px);} 100%{transform:translate(0); filter:hue-rotate(0);} }
@keyframes fearShake{ 0%,100%{transform:translateX(0);} 20%{transform:translateX(-2px) translateY(1px);} 40%{transform:translateX(2px) translateY(-1px);} 60%{transform:translateX(-1px);} 80%{transform:translateX(1px);} }
.typewriter-cursor{
  display:inline-block; width:2px; height:1em; background:#7a5a10;
  animation:cursorBlink .8s step-end infinite; vertical-align:text-bottom; margin-left:2px;
}
@keyframes cursorBlink{ 0%,100%{opacity:1;} 50%{opacity:0;} }
.option-enter{
  animation: optionSlideIn .3s ease-out backwards;
}
@keyframes optionSlideIn{
  from{ opacity:0; transform:translateY(15px); }
  to{ opacity:1; transform:translateY(0); }
}
.option-important{
  animation: importantPulse 2s ease-in-out infinite;
}
@keyframes importantPulse{
  0%,100%{ box-shadow:0 0 0 0 rgba(122,90,16,.3); }
  50%{ box-shadow:0 0 12px 2px rgba(122,90,16,.25); }
}
.option-danger{
  animation: dangerShake 1.5s ease-in-out infinite;
}
@keyframes dangerShake{
  0%,100%{ transform:translateX(0); }
  25%{ transform:translateX(-1px); }
  75%{ transform:translateX(1px); }
}
.option-chosen{
  opacity:.5 !important;
  pointer-events:none;
}
.option-chosen::after{
  content:" ✓"; color:#4a7a3a; font-weight:900;
}
.scene-transition{
  animation: sceneFade .5s ease-in-out;
}
@keyframes sceneFade{
  0%{ opacity:0; transform:translateY(10px); }
  100%{ opacity:1; transform:translateY(0); }
}
.time-skip{
  text-align:center; color:#7a5a10; font-family:"Noto Serif SC",serif;
  font-size:16px; font-weight:700; padding:10px 0; margin:10px 0;
  border-top:1px solid #c0b090; border-bottom:1px solid #c0b090;
  letter-spacing:3px;
}

/* 方向三：判定演出系统 */
.dice-overlay{
  position:fixed; inset:0; background:rgba(20,16,8,.5); backdrop-filter:blur(4px);
  z-index:300; display:flex; align-items:center; justify-content:center;
  animation: fadeIn .2s ease-out;
}
.dice-container{
  text-align:center;
}
.dice-3d{
  width:90px; height:90px; margin:0 auto 20px;
  background:linear-gradient(135deg, #ede4cc, #d4c8a8);
  border:3px solid #7a5a10; border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  font-size:36px; font-weight:900; color:#241a08;
  box-shadow:0 8px 32px rgba(0,0,0,.3), inset 0 2px 0 rgba(255,255,255,.4);
  animation: diceRoll .8s ease-out;
  font-family:"Noto Serif SC",serif;
}
@keyframes diceRoll{
  0%{ transform:rotateX(0) rotateY(0) scale(.8); opacity:0; }
  20%{ opacity:1; }
  50%{ transform:rotateX(360deg) rotateY(180deg) scale(1.15); }
  100%{ transform:rotateX(720deg) rotateY(360deg) scale(1); }
}
.dice-result-banner{
  padding:16px 32px; border-radius:10px; font-size:20px; font-weight:900;
  letter-spacing:2px; margin-bottom:12px;
  animation: bannerSlide .4s ease-out;
  font-family:"Noto Serif SC",serif;
}
.dice-crit{ background:rgba(42,90,42,.15); border:2px solid #4a7a3a; color:#2a5a2a; }
.dice-extreme{ background:rgba(42,74,106,.12); border:2px solid #3a6a8a; color:#2a4a6a; }
.dice-hard{ background:rgba(58,90,74,.1); border:2px solid #4a7a5a; color:#3a5a4a; }
.dice-normal{ background:rgba(90,90,48,.08); border:2px solid #7a7a40; color:#5a5a30; }
.dice-fail{ background:rgba(122,90,16,.1); border:2px solid #8a6a20; color:#6a5a10; }
.dice-critfail{ background:rgba(122,42,26,.12); border:2px solid #8a3a2a; color:#6a2a1a; }
@keyframes bannerSlide{
  from{ opacity:0; transform:translateY(-20px) scale(.9); }
  to{ opacity:1; transform:translateY(0) scale(1); }
}
.dice-numbers{
  font-size:15px; color:#3a2e10; margin:8px 0;
}
.dice-numbers .target{ color:#7a5a10; font-weight:900; }
.dice-numbers .rolled{ font-weight:900; }
.dice-numbers .rolled.success{ color:#2a5a2a; }
.dice-numbers .rolled.fail{ color:#6a2a1a; }
.dice-flavor{
  font-size:14px; color:#5a4a30; font-style:italic; margin-top:8px;
}
.combo-counter{
  position:fixed; top:80px; right:20px; z-index:250;
  background:linear-gradient(135deg, #ede4cc, #d4c8a8);
  border:2px solid #7a5a10; border-radius:8px;
  padding:8px 16px; font-weight:900; color:#5a4a10;
  animation: comboPop .3s ease-out;
  box-shadow:0 4px 12px rgba(0,0,0,.15);
}
@keyframes comboPop{
  0%{ transform:scale(.5); opacity:0; }
  50%{ transform:scale(1.2); }
  100%{ transform:scale(1); opacity:1; }
}
.gain-loss-item{
  animation: gainSlide .3s ease-out backwards;
  padding:4px 0; font-size:14px;
}
@keyframes gainSlide{
  from{ opacity:0; transform:translateX(-10px); }
  to{ opacity:1; transform:translateX(0); }
}
.gain-item{ color:#2a5a2a; font-weight:700; }
.loss-item{ color:#6a2a1a; font-weight:700; }

/* 方向五：面板质感与光影系统 */
.panel-v34{
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E") repeat,
    linear-gradient(180deg, #ede4cc, #e4d8bc);
  border:2px solid #a09070; border-radius:10px;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.35),
    inset 0 -1px 0 rgba(0,0,0,.08),
    0 8px 32px rgba(0,0,0,.18);
  position:relative;
}
.panel-v34::before{
  content:''; position:absolute; top:-3px; left:-3px; right:-3px; bottom:-3px;
  border:1px solid rgba(122,90,16,.25); border-radius:12px; pointer-events:none;
}
.panel-v34-ornate::after{
  content:''; position:absolute; top:4px; left:4px; right:4px; bottom:4px;
  border:1px solid rgba(122,90,16,.15); border-radius:8px; pointer-events:none;
}
.btn-3d{
  background:linear-gradient(180deg, #e8dcc0, #d4c8a8);
  border:1px solid #a09070; border-radius:6px;
  color:#241a08; font-weight:700; cursor:pointer;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.4),
    0 2px 4px rgba(0,0,0,.12);
  transition:all .15s ease;
}
.btn-3d:hover{
  transform:translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.4),
    0 4px 8px rgba(0,0,0,.18);
  border-color:#7a5a10;
}
.btn-3d:active{
  transform:translateY(1px);
  box-shadow:
    inset 0 2px 4px rgba(0,0,0,.12);
}
.btn-3d-gold{
  background:linear-gradient(180deg, #e0c880, #c8a850);
  border-color:#7a5a10; color:#3a2a08;
}
.glass-panel{
  background:rgba(237,228,204,.92);
  backdrop-filter:blur(10px) saturate(1.2);
  -webkit-backdrop-filter:blur(10px) saturate(1.2);
  border:1px solid rgba(160,144,112,.5);
  box-shadow:0 8px 32px rgba(0,0,0,.15);
}
.progress-bar-v34{
  height:12px; background:#c8bca0; border-radius:6px; overflow:hidden;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.15);
  position:relative;
}
.progress-fill-v34{
  height:100%; border-radius:6px; position:relative;
  transition:width .4s ease;
}
.progress-fill-v34::after{
  content:''; position:absolute; top:0; left:0; right:0; height:50%;
  background:linear-gradient(180deg, rgba(255,255,255,.35), transparent);
  border-radius:6px 6px 0 0;
}
.progress-hp{ background:linear-gradient(90deg, #8a3a2a, #c96565); }
.progress-mp{ background:linear-gradient(90deg, #2a5a8a, #5a9aca); }
.progress-san{ background:linear-gradient(90deg, #5a3a7a, #9a6aca); }
.progress-exp{ background:linear-gradient(90deg, #8a6a20, #c9a240); }
.low-hp-warning{
  animation: lowHpPulse 1s ease-in-out infinite;
}
@keyframes lowHpPulse{
  0%,100%{ box-shadow:0 0 0 0 rgba(122,42,26,.4); }
  50%{ box-shadow:0 0 12px 2px rgba(122,42,26,.3); }
}
.scroll-panel{
  position:relative; background:linear-gradient(180deg, #ede4cc, #e4d8bc);
  border-left:3px solid #8a7a50; border-right:3px solid #8a7a50;
  padding:20px 24px;
}
.scroll-panel::before, .scroll-panel::after{
  content:''; position:absolute; left:-8px; right:-8px; height:16px;
  background:linear-gradient(180deg, #6a5a30, #4a3a20);
  border-radius:4px; box-shadow:0 2px 6px rgba(0,0,0,.2);
}
.scroll-panel::before{ top:-8px; }
.scroll-panel::after{ bottom:-8px; }

/* 方向四：交互地图 */
.map-container-v34{
  position:relative; width:100%; height:520px;
  background:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23e0d4b8' width='400' height='300'/%3E%3Cpath d='M0,150 Q100,120 200,140 T400,130' stroke='%23c0b090' fill='none' stroke-width='1' opacity='.5'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23d4c8a0' opacity='.4'/%3E%3Ccircle cx='350' cy='250' r='40' fill='%23d4c8a0' opacity='.3'/%3E%3C/svg%3E") center/cover,
    linear-gradient(135deg, #e8dcc0, #d8ccb0);
  border:3px solid #7a5a10; border-radius:10px; overflow:hidden;
  box-shadow:inset 0 0 60px rgba(100,80,40,.2), 0 8px 32px rgba(0,0,0,.2);
}
.map-location{
  position:absolute; cursor:pointer; transition:all .2s ease;
  transform:translate(-50%, -50%); z-index:5;
}
.map-location:hover{
  transform:translate(-50%, -50%) scale(1.25);
  z-index:10;
}
.map-location-icon{
  width:36px; height:36px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:18px; background:linear-gradient(135deg, #ede4cc, #d4c8a8);
  border:2px solid #7a5a10; box-shadow:0 2px 8px rgba(0,0,0,.2);
}
.map-location.current .map-location-icon{
  animation: locationPulse 1.5s ease-in-out infinite;
  border-color:#c9a227;
}
@keyframes locationPulse{
  0%,100%{ box-shadow:0 0 0 0 rgba(201,162,39,.5); }
  50%{ box-shadow:0 0 0 12px rgba(201,162,39,0); }
}
.map-location.undiscovered{
  filter:grayscale(1) brightness(.7);
}
.map-location-name{
  position:absolute; top:100%; left:50%; transform:translateX(-50%);
  white-space:nowrap; font-size:12px; font-weight:700; color:#3a2e10;
  background:rgba(237,228,204,.9); padding:2px 8px; border-radius:4px;
  margin-top:4px; border:1px solid #a09070;
}
.map-info-card{
  position:absolute; bottom:16px; left:16px; right:16px;
  background:rgba(237,228,204,.95); backdrop-filter:blur(8px);
  border:2px solid #7a5a10; border-radius:8px; padding:14px 18px;
  box-shadow:0 4px 16px rgba(0,0,0,.2);
  animation: cardSlideUp .3s ease-out;
}
@keyframes cardSlideUp{
  from{ opacity:0; transform:translateY(20px); }
  to{ opacity:1; transform:translateY(0); }
}
.map-fog{
  position:absolute; inset:0; pointer-events:none;
  background:radial-gradient(circle at var(--player-x,50%) var(--player-y,50%), transparent 25%, rgba(100,80,50,.5) 60%);
}
.map-route{
  position:absolute; height:3px; background:repeating-linear-gradient(90deg, #7a5a10 0, #7a5a10 8px, transparent 8px, transparent 14px);
  transform-origin:left center; z-index:3;
}
.map-traveler{
  position:absolute; width:24px; height:24px; font-size:16px;
  transform:translate(-50%,-50%); z-index:8;
  transition:left 1s linear, top 1s linear;
}
.map-controls{
  position:absolute; top:12px; right:12px; display:flex; gap:6px; z-index:20;
}
.map-zoom-btn{
  width:32px; height:32px; border-radius:6px; border:1px solid #7a5a10;
  background:rgba(237,228,204,.9); color:#3a2e10; font-size:18px; font-weight:900;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
}
.map-zoom-btn:hover{ background:#ede4cc; }

/* 方向七：存档与图鉴可视化 */
.save-slot-v34{
  display:flex; gap:14px; align-items:center; padding:14px;
  background:linear-gradient(135deg, #ede4cc, #e4d8bc);
  border:2px solid #a09070; border-radius:10px; cursor:pointer;
  transition:all .2s ease; margin-bottom:10px;
}
.save-slot-v34:hover{
  transform:translateY(-2px); border-color:#7a5a10;
  box-shadow:0 6px 16px rgba(0,0,0,.15);
}
.save-slot-thumb{
  width:60px; height:60px; border-radius:8px; flex-shrink:0;
  background:linear-gradient(135deg, #d4c8a8, #c0b090);
  border:1px solid #a09070; display:flex; align-items:center; justify-content:center;
  font-size:28px;
}
.save-slot-info{ flex:1; min-width:0; }
.save-slot-name{ font-size:16px; font-weight:900; color:#241a08; margin-bottom:4px; }
.save-slot-meta{ font-size:12px; color:#5a4a30; display:flex; gap:12px; flex-wrap:wrap; }
.save-slot-progress{ height:6px; background:#c8bca0; border-radius:3px; margin-top:6px; overflow:hidden; }
.save-slot-progress-fill{ height:100%; background:linear-gradient(90deg, #8a6a20, #c9a240); border-radius:3px; }
.achievement-grid{
  display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:10px;
}
.achievement-card{
  background:linear-gradient(135deg, #ede4cc, #e4d8bc);
  border:2px solid #a09070; border-radius:8px; padding:12px 8px;
  text-align:center; transition:all .3s ease; cursor:default;
}
.achievement-card.unlocked{
  border-color:#7a5a10;
  animation: achUnlock .5s ease-out;
}
.achievement-card.locked{
  filter:grayscale(1) brightness(.7);
}
.achievement-icon{ font-size:32px; margin-bottom:6px; }
.achievement-name{ font-size:13px; font-weight:900; color:#241a08; margin-bottom:4px; }
.achievement-desc{ font-size:11px; color:#5a4a30; line-height:1.4; }
.achievement-rarity-common{ border-color:#8a8a7a; }
.achievement-rarity-rare{ border-color:#3a6a8a; }
.achievement-rarity-epic{ border-color:#6a3a8a; }
.achievement-rarity-legendary{ border-color:#c9a227; box-shadow:0 0 12px rgba(201,162,39,.2); }
@keyframes achUnlock{
  0%{ transform:rotateY(180deg) scale(.8); }
  100%{ transform:rotateY(0) scale(1); }
}
.codex-entry{
  display:flex; gap:12px; padding:12px; margin-bottom:8px;
  background:linear-gradient(135deg, #ede4cc, #e4d8bc);
  border:1px solid #a09070; border-radius:8px;
}
.codex-entry.locked{ filter:grayscale(1) brightness(.7); }
.codex-icon{
  width:48px; height:48px; border-radius:6px; flex-shrink:0;
  background:#d4c8a8; border:1px solid #a09070;
  display:flex; align-items:center; justify-content:center; font-size:24px;
}
.codex-info{ flex:1; }
.codex-name{ font-size:15px; font-weight:900; color:#241a08; }
.codex-type{ font-size:11px; color:#7a5a10; font-weight:700; }
.codex-desc{ font-size:13px; color:#3a2e10; margin-top:4px; line-height:1.5; }
.rarity-common{ color:#5a5a5a; }
.rarity-uncommon{ color:#3a7a3a; }
.rarity-rare{ color:#3a6a9a; }
.rarity-epic{ color:#7a3a9a; }
.rarity-legendary{ color:#9a7a20; }

/* 方向六：音效控制 */
.audio-toggle{
  position:fixed; bottom:20px; right:20px; z-index:200;
  width:44px; height:44px; border-radius:50%;
  background:linear-gradient(135deg, #ede4cc, #d4c8a8);
  border:2px solid #7a5a10; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  font-size:20px; box-shadow:0 4px 12px rgba(0,0,0,.2);
  transition:all .2s ease;
}
.audio-toggle:hover{ transform:scale(1.1); }
.audio-toggle.muted{ opacity:.5; }

/* v34 设置面板新增 */
.v34-setting-row{
  display:flex; justify-content:space-between; align-items:center;
  padding:10px 0; border-bottom:1px solid #c0b090;
}
.v34-setting-label{ font-size:14px; font-weight:700; color:#241a08; }
.v34-setting-desc{ font-size:12px; color:#5a4a30; margin-top:2px; }
.v34-slider{
  width:120px; height:6px; -webkit-appearance:none; appearance:none;
  background:#c8bca0; border-radius:3px; outline:none;
}
.v34-slider::-webkit-slider-thumb{
  -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
  background:#7a5a10; cursor:pointer; border:2px solid #ede4cc;
}
.v34-checkbox{
  width:20px; height:20px; accent-color:#7a5a10; cursor:pointer;
}

/* 简洁模式（关闭所有动画） */
body.simple-mode *{
  animation:none !important;
  transition:none !important;
}
body.simple-mode .particle{ display:none !important; }
body.simple-mode #atmosphere-overlay{ display:none !important; }
"""

# 在</style>之前插入
style_end = html.find('</style>')
if style_end > 0:
    html = html[:style_end] + v34_css + '\n' + html[style_end:]
    print("✓ v34 CSS样式插入完成")
else:
    print("✗ 未找到</style>")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
