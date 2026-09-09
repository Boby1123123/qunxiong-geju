/*v76mod*/

/* ================================================================
   v21 魔法学派与法术系统
   ================================================================ */
const MAGIC_SCHOOLS_DATA = {
  elemental:{name:"元素学派",cn:"操控地水火风四大元素",stat:"INT"},
  soul:{name:"灵魂学派",cn:"触碰灵魂边界，禁忌之学",stat:"SPR",forbidden:true},
  alchemy:{name:"炼金学派",cn:"物质转化与药剂炼制",stat:"INT"},
  holy:{name:"神圣学派",cn:"光明与治愈之力",stat:"SPR"},
  shadow:{name:"暗影学派",cn:"隐匿与幻象",stat:"AGI"},
  space:{name:"空间学派",cn:"传送与空间操控",stat:"INT"},
  time:{name:"时间学派",cn:"操控时间流速，极难掌握",stat:"SPR",forbidden:true},
  abyss:{name:"深渊学派",cn:"深渊之力，极度危险",stat:"SPR",forbidden:true}
};

const SPELLS_DATA = [
  {id:"fireball",name:"火球术",school:"elemental",level:1,mp:12,damage:30,desc:"召唤火球攻击敌人。"},
  {id:"ice_shard",name:"冰锥术",school:"elemental",level:1,mp:10,damage:25,desc:"发射冰锥，有几率冻结。"},
  {id:"lightning",name:"闪电术",school:"elemental",level:3,mp:15,damage:35,desc:"召唤闪电劈向敌人。"},
  {id:"earthquake",name:"地震术",school:"elemental",level:5,mp:25,damage:45,desc:"引发地震，范围伤害。"},
  {id:"soul_bolt",name:"灵魂箭",school:"soul",level:1,mp:12,damage:28,desc:"发射灵魂之箭，无视防御。"},
  {id:"mind_blast",name:"精神冲击",school:"soul",level:2,mp:10,damage:22,desc:"攻击敌人精神。"},
  {id:"heal",name:"治愈术",school:"holy",level:1,mp:12,heal:30,desc:"恢复30点HP。"},
  {id:"holy_light",name:"圣光术",school:"holy",level:2,mp:10,damage:25,desc:"圣光攻击，对亡灵翻倍。"},
  {id:"bless",name:"祝福术",school:"holy",level:1,mp:8,buff:true,desc:"全属性+10%，持续3回合。"},
  {id:"shadow_step",name:"暗影步",school:"shadow",level:1,mp:15,buff:true,desc:"下次攻击必定暴击。"},
  {id:"invisibility",name:"隐身术",school:"shadow",level:3,mp:20,buff:true,desc:"隐身3回合。"},
  {id:"teleport",name:"传送术",school:"space",level:5,mp:30,utility:true,desc:"传送到已探索的城市。"},
  {id:"time_slow",name:"时间减缓",school:"time",level:5,mp:35,buff:true,desc:"敌人速度减半，3回合。"},
  {id:"abyss_bolt",name:"深渊之箭",school:"abyss",level:1,mp:15,damage:35,desc:"深渊之力，SAN-5。"},
  {id:"acid_flask",name:"强酸瓶",school:"alchemy",level:1,mp:8,damage:28,desc:"投掷强酸瓶。"}
];

function getSchoolLevel(school){
  if(!S.schoolLevels) S.schoolLevels={};
  return S.schoolLevels[school]||0;
}

function addSchoolExp(school,exp){
  if(!S.schoolExp) S.schoolExp={};
  S.schoolExp[school]=(S.schoolExp[school]||0)+exp;
  const cur = getSchoolLevel(school);
  const needed = (cur+1)*50;
  if(S.schoolExp[school]>=needed&&cur<10){
    S.schoolLevels[school]=cur+1;
    S.schoolExp[school]-=needed;
    writePar("【"+MAGIC_SCHOOLS_DATA[school].name+"】等级提升至"+(cur+1)+"级！","hint");
  }
}

function openMagicPanel(){
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>魔法学派</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='magic-body'>";
  const schools = Object.keys(MAGIC_SCHOOLS_DATA);
  for(var i=0;i<schools.length;i++){
    const sc = MAGIC_SCHOOLS_DATA[schools[i]];
    const lvl = getSchoolLevel(schools[i]);
    h += "<div class='school-card'>";
    h += "<div class='school-name'>"+sc.name+(sc.forbidden?" ⚠️禁忌":"")+" Lv."+lvl+"</div>";
    h += "<div class='school-desc'>"+sc.cn+"</div>";
    h += "<div class='school-spells'>";
    const spells = SPELLS_DATA.filter(s=>s.school===schools[i]&&s.level<=lvl);
    for(var j=0;j<spells.length;j++){
      h += "<span class='spell-tag'>"+spells[j].name+"</span>";
    }
    if(spells.length===0) h += "<span style='color:#5a6a7a;font-size:11px'>尚未习得法术</span>";
    h += "</div></div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

/* ================================================================
   v21 锻造炼金与物品系统
   ================================================================ */
const FORGE_RECIPES_V2 = [
  {id:"iron_sword",name:"铁剑",category:"weapon",materials:{iron:3},result:{name:"铁剑",category:"weapon",attack:5,value:20,icon:"⚔️",desc:"普通的铁剑。"},difficulty:30},
  {id:"steel_sword",name:"钢剑",category:"weapon",materials:{iron:5,coal:2},result:{name:"钢剑",category:"weapon",attack:10,value:50,icon:"⚔️",desc:"精钢长剑。"},difficulty:50},
  {id:"leather_armor",name:"皮甲",category:"armor",materials:{leather:3},result:{name:"皮甲",category:"armor",defense:5,value:40,icon:"🛡️",desc:"鞣制皮革轻甲。"},difficulty:35},
  {id:"chain_mail",name:"锁子甲",category:"armor",materials:{iron:8},result:{name:"锁子甲",category:"armor",defense:10,value:100,icon:"🛡️",desc:"铁环编织锁子甲。"},difficulty:60},
  {id:"power_amulet",name:"力量护符",category:"accessory",materials:{gem:1,iron:2},result:{name:"力量护符",category:"accessory",attack:3,value:80,icon:"📿",desc:"蕴含力量的护符。",affixes:["力量+3"]},difficulty:70}
];

const ALCHEMY_RECIPES = [
  {id:"health_potion",name:"治疗药剂",materials:{herb:2},result:{name:"治疗药剂",category:"consumable",value:15,icon:"🧪",desc:"恢复25HP。",effect:{hp:25}},difficulty:30},
  {id:"mana_potion",name:"法力药剂",materials:{herb:3,gem:1},result:{name:"法力药剂",category:"consumable",value:25,icon:"🧪",desc:"恢复20MP。",effect:{mp:20}},difficulty:45},
  {id:"fire_resist",name:"防火药剂",materials:{herb:2,iron:1},result:{name:"防火药剂",category:"consumable",value:30,icon:"🧪",desc:"火焰抗性+50%，10回合。"},difficulty:55},
  {id:"strength_potion",name:"力量药剂",materials:{herb:3,leather:1},result:{name:"力量药剂",category:"consumable",value:35,icon:"🧪",desc:"力量+5，10回合。"},difficulty:50}
];

const MATERIALS_DATA = {
  iron:{name:"铁矿",icon:"🪨"},
  coal:{name:"煤炭",icon:"⚫"},
  leather:{name:"皮革",icon:"🟤"},
  herb:{name:"草药",icon:"🌿"},
  gem:{name:"宝石",icon:"💎"},
  gold_ore:{name:"金矿石",icon:"🟡"}
};

function openForgePanel(){
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>锻造工坊</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='forge-body'>";
  h += "<div class='forge-materials'><b>材料：</b>";
  const mats = S.materials||{};
  const matKeys = Object.keys(MATERIALS_DATA);
  for(var i=0;i<matKeys.length;i++){
    h += MATERIALS_DATA[matKeys[i]].icon+MATERIALS_DATA[matKeys[i]].name+":"+(mats[matKeys[i]]||0)+" ";
  }
  h += "</div>";
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>锻造配方</h4>";
  for(var j=0;j<FORGE_RECIPES_V2.length;j++){
    const r = FORGE_RECIPES_V2[j];
    const canForge = checkMaterials(r.materials);
    h += "<div class='recipe-card'>";
    h += "<div class='recipe-name'>"+r.result.icon+" "+r.name+" <span style='color:#8fa8c8;font-size:11px'>难度:"+r.difficulty+"</span></div>";
    h += "<div class='recipe-mats'>需要："+formatMaterials(r.materials)+"</div>";
    h += "<button class='btn small' "+(canForge?"":"disabled")+" onclick='doForge(\""+r.id+"\")'>锻造</button>";
    h += "</div>";
  }
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>炼金配方</h4>";
  for(var k=0;k<ALCHEMY_RECIPES.length;k++){
    const a = ALCHEMY_RECIPES[k];
    const canAlch = checkMaterials(a.materials);
    h += "<div class='recipe-card'>";
    h += "<div class='recipe-name'>"+a.result.icon+" "+a.name+" <span style='color:#8fa8c8;font-size:11px'>难度:"+a.difficulty+"</span></div>";
    h += "<div class='recipe-mats'>需要："+formatMaterials(a.materials)+"</div>";
    h += "<button class='btn small' "+(canAlch?"":"disabled")+" onclick='doAlchemy(\""+a.id+"\")'>炼制</button>";
    h += "</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function checkMaterials(mats){
  const have = S.materials||{};
  for(var k in mats){ if((have[k]||0)<mats[k]) return false; }
  return true;
}

function formatMaterials(mats){
  let s=[];
  for(var k in mats){ s.push(MATERIALS_DATA[k]?MATERIALS_DATA[k].name:k+"×"+mats[k]); }
  return s.join("、");
}

function consumeMaterials(mats){
  if(!S.materials) S.materials={};
  for(var k in mats){ S.materials[k]=(S.materials[k]||0)-mats[k]; }
}

function doForge(recipeId){
  const r = FORGE_RECIPES_V2.find(x=>x.id===recipeId);
  if(!r||!checkMaterials(r.materials)) return;
  consumeMaterials(r.materials);
  const target = r.difficulty + (S.attrs&&S.attrs.INT?Math.floor(S.attrs.INT*0.3):0);
  const roll = Math.floor(Math.random()*100)+1;
  if(roll<=target){
    const item = Object.assign({},r.result);
    // 品质随机
    const qRoll = Math.random();
    if(qRoll<0.1){ item.quality="传说"; item.attack=(item.attack||0)*1.5; item.defense=(item.defense||0)*1.5; }
    else if(qRoll<0.3){ item.quality="稀有"; item.attack=(item.attack||0)*1.2; item.defense=(item.defense||0)*1.2; }
    else { item.quality="普通"; }
    if(!S.inventory) S.inventory=[];
    S.inventory.push(item);
    writePar("锻造成功！获得【"+item.quality+"·"+item.name+"】。","hint");
    addLog("锻造获得"+item.quality+"·"+item.name,"achievement");
  } else {
    writePar("锻造失败！材料损毁。","warn");
  }
  closePanel();
  renderTop(); renderStats();
}

function doAlchemy(recipeId){
  const r = ALCHEMY_RECIPES.find(x=>x.id===recipeId);
  if(!r||!checkMaterials(r.materials)) return;
  consumeMaterials(r.materials);
  const target = r.difficulty + (S.attrs&&S.attrs.INT?Math.floor(S.attrs.INT*0.4):0);
  const roll = Math.floor(Math.random()*100)+1;
  if(roll<=target){
    const item = Object.assign({},r.result);
    item.qty = 1+Math.floor(Math.random()*2);
    if(!S.inventory) S.inventory=[];
    S.inventory.push(item);
    writePar("炼制成功！获得【"+item.name+"】×"+item.qty+"。","hint");
  } else if(roll>=96){
    S.hp = Math.max(1,S.hp-10);
    writePar("炼制失败！药剂爆炸，HP-10。","warn");
  } else {
    writePar("炼制失败！材料损毁。","warn");
  }
  closePanel();
  renderTop(); renderStats();
}

/* ================================================================
   v21 声望与势力系统
   ================================================================ */
const FACTION_REP_LEVELS = [
  {min:-100,max:-60,name:"仇恨",color:"#ff0000"},
  {min:-59,max:-20,name:"敌对",color:"#ff6666"},
  {min:-19,max:19,name:"中立",color:"#999999"},
  {min:20,max:49,name:"友好",color:"#88ccff"},
  {min:50,max:79,name:"尊敬",color:"#44ff88"},
  {min:80,max:100,name:"崇拜",color:"#ffdd44"}
];

function getFactionLevel(faction){
  const val = (S.reputation&&S.reputation[faction])||0;
  for(var i=0;i<FACTION_REP_LEVELS.length;i++){
    if(val>=FACTION_REP_LEVELS[i].min&&val<=FACTION_REP_LEVELS[i].max) return FACTION_REP_LEVELS[i];
  }
  return FACTION_REP_LEVELS[2];
}

function changeFactionRep(faction,delta,reason){
  if(!S.reputation) S.reputation={};
  const old = S.reputation[faction]||0;
  S.reputation[faction] = Math.max(-100,Math.min(100,old+delta));
  if(reason) addLog(faction+"声望"+(delta>0?"+":"")+delta+"："+reason,"quest");
}

function getFactionDiscount(faction){
  const val = (S.reputation&&S.reputation[faction])||0;
  if(val>=80) return 0.7;
  if(val>=50) return 0.85;
  if(val>=20) return 0.95;
  if(val<=-60) return 1.5;
  if(val<=-20) return 1.2;
  return 1.0;
}


/* ================================================================
   v21 日历节日与季节系统（09号艾尔达历）
   ================================================================ */
const ELDA_CALENDAR = {
  months:[
    {name:"春醒月",days:30,season:"spring"},
    {name:"繁花月",days:30,season:"spring"},
    {name:"盛夏日",days:31,season:"summer"},
    {name:"烈焰月",days:30,season:"summer"},
    {name:"丰收月",days:31,season:"autumn"},
    {name:"落叶月",days:30,season:"autumn"},
    {name:"寒霜月",days:30,season:"winter"},
    {name:"暴风雪月",days:31,season:"winter"},
    {name:"融雪月",days:30,season:"winter"},
    {name:"新绿月",days:30,season:"spring"},
    {name:"长昼月",days:31,season:"summer"},
    {name:"岁末月",days:30,season:"autumn"}
  ],
  festivals:{
    "1-15":{name:"春醒节",desc:"万物复苏的节日，各地举行春耕仪式。",buff:{hp:20}},
    "3-1":{name:"圣光纪念日",desc:"教会纪念光明神降临的日子，圣城有盛大弥撒。",buff:{san:10}},
    "5-10":{name:"丰收祭",desc:"庆祝丰收的节日，南方城邦举行商贸大会。",buff:{gold:50}},
    "7-20":{name:"勇士节",desc:"北方公国的战士节日，举行比武大会。",buff:{str:3}},
    "9-1":{name:"追思日",desc:"纪念逝者的日子，精灵王国最为重视。",buff:{spr:3}},
    "12-30":{name:"岁末庆典",desc:"一年的最后一天，全城欢庆，迎接新年。",buff:{all:5}}
  }
};

const SEASON_EFFECTS = {
  spring:{name:"春",travelMod:1.0,desc:"春暖花开，旅行顺畅。"},
  summer:{name:"夏",travelMod:1.0,desertSan:-5,desc:"炎热，沙漠地区SAN消耗增加。"},
  autumn:{name:"秋",travelMod:1.1,desc:"秋高气爽，旅行速度+10%。"},
  winter:{name:"冬",travelMod:0.8,desc:"严寒，旅行速度-20%，北方地区更慢。"}
};

function getCurrentDate(){
  if(!S.world) S.world={};
  const totalDays = S.world.totalDay||1;
  let dayOfYear = totalDays;
  let month=0, day=0;
  for(var i=0;i<12;i++){
    if(dayOfYear<=ELDA_CALENDAR.months[i].days){ month=i; day=dayOfYear; break; }
    dayOfYear -= ELDA_CALENDAR.months[i].days;
  }
  return {year:S.world.year||1,month:month,day:day,season:ELDA_CALENDAR.months[month].season};
}

function getFestival(){
  const d = getCurrentDate();
  const key = (d.month+1)+"-"+d.day;
  return ELDA_CALENDAR.festivals[key];
}

function openCalendarPanel(){
  const d = getCurrentDate();
  const fest = getFestival();
  const season = SEASON_EFFECTS[d.season];
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>艾尔达历</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='calendar-body'>";
  h += "<div class='calendar-date'>艾尔达历第"+d.year+"年 "+ELDA_CALENDAR.months[d.month].name+" "+d.day+"日</div>";
  h += "<div class='calendar-season'>季节："+season.name+" | "+season.desc+"</div>";
  if(fest){
    h += "<div class='festival-alert'>🎉 今日节日："+fest.name+"<br>"+fest.desc+"</div>";
  }
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>大陆节日一览</h4>";
  const festKeys = Object.keys(ELDA_CALENDAR.festivals);
  for(var i=0;i<festKeys.length;i++){
    const f = ELDA_CALENDAR.festivals[festKeys[i]];
    h += "<div class='festival-item'><b>"+festKeys[i]+"</b> "+f.name+" — "+f.desc+"</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

/* ================================================================
   v21 犯罪与地下世界系统
   ================================================================ */
const CRIME_ACTIONS = {
  steal:{name:"偷窃",baseChance:50,stat:"AGI",wanted:1,gold:"1d20",desc:"从目标身上偷窃财物。"},
  rob:{name:"抢劫",baseChance:40,stat:"STR",wanted:3,gold:"2d50",desc:"暴力抢劫目标，高风险高回报。"},
  pickpocket:{name:"扒窃",baseChance:60,stat:"AGI",wanted:1,gold:"1d10",desc:"在人群中扒窃，不易被发现。"},
  smuggle:{name:"走私",baseChance:45,stat:"CHA",wanted:2,gold:"3d30",desc:"走私违禁品，需要渠道。"}
};

const UNDERWORLD_FACTIONS = {
  thieves_guild:{name:"盗贼公会",desc:"大陆最大的盗贼组织，遍布各城地下。",rep:0},
  black_market:{name:"黑市",desc:"什么都能买到的地下市场，包括违禁品。",rep:0},
  arena:{name:"地下角斗场",desc:"非法的角斗比赛，胜者获得重金。",rep:0}
};

function openCrimePanel(){
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>地下世界</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='crime-body'>";
  h += "<div class='wanted-level'>通缉等级："+"★".repeat(S.wantedLevel||0)+"☆".repeat(5-(S.wantedLevel||0))+"</div>";
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>犯罪行为</h4>";
  const crimes = Object.keys(CRIME_ACTIONS);
  for(var i=0;i<crimes.length;i++){
    const c = CRIME_ACTIONS[crimes[i]];
    const chance = c.baseChance + (S.attrs&&S.attrs[c.stat]?Math.floor(S.attrs[c.stat]*0.3):0);
    h += "<div class='crime-card'>";
    h += "<div class='crime-name'>"+c.name+" <span style='color:#8fa8c8;font-size:11px'>成功率:"+Math.min(95,chance)+"%</span></div>";
    h += "<div class='crime-desc'>"+c.desc+"</div>";
    h += "<button class='btn small danger' onclick='doCrime(\""+crimes[i]+"\")'>执行</button>";
    h += "</div>";
  }
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>地下势力</h4>";
  const factions = Object.keys(UNDERWORLD_FACTIONS);
  for(var j=0;j<factions.length;j++){
    const f = UNDERWORLD_FACTIONS[factions[j]];
    h += "<div class='crime-card'><b>"+f.name+"</b><br>"+f.desc+"</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function doCrime(crimeId){
  const c = CRIME_ACTIONS[crimeId];
  if(!c) return;
  const chance = c.baseChance + (S.attrs&&S.attrs[c.stat]?Math.floor(S.attrs[c.stat]*0.3):0);
  const roll = Math.floor(Math.random()*100)+1;
  if(roll<=chance){
    const gold = Math.floor(Math.random()*20)+10;
    S.gold = (S.gold||0)+gold;
    writePar(c.name+"成功！获得"+gold+"金币。","hint");
    addLog(c.name+"成功，获得"+gold+"金币。","combat");
  } else {
    S.wantedLevel = Math.min(5,(S.wantedLevel||0)+c.wanted);
    writePar(c.name+"失败！被人发现了，通缉等级+" +c.wanted+"。","warn");
    addLog(c.name+"失败，通缉等级提升。","combat");
    if(S.wantedLevel>=3){
      writePar("审判骑士开始注意你了...","warn");
    }
  }
  closePanel();
  renderTop(); renderStats();
}

/* ================================================================
   v21 坐骑宠物与收集系统
   ================================================================ */
const MOUNTS_DATA = {
  horse:{name:"骏马",speed:80,capacity:50,price:100,icon:"🐴",desc:"普通的骏马，大陆最常见的坐骑。"},
  camel:{name:"骆驼",speed:40,capacity:80,price:80,icon:"🐫",desc:"沙漠之舟，在沙漠中速度不减。",desertBonus:true},
  warhorse:{name:"战马",speed:90,capacity:60,price:300,icon:"🐎",desc:"训练有素的战马，战斗中+5攻击力。",combatBonus:5},
  griffin:{name:"狮鹫",speed:150,capacity:30,price:1000,icon:"🦅",desc:"稀有的飞行坐骑，可翻山越岭。",flying:true},
  dragon:{name:"幼龙",speed:200,capacity:100,price:5000,icon:"🐉",desc:"传说中的龙族坐骑，极度稀有。",flying:true,combatBonus:20}
};

const PETS_DATA = {
  wolf_pup:{name:"狼崽",icon:"🐺",desc:"养大后可辅助战斗，+10攻击力。",combatBonus:10},
  cat:{name:"灵猫",icon:"🐱",desc:"灵敏的猫，+5敏捷，可发现隐藏物品。",agiBonus:5},
  owl:{name:"猫头鹰",icon:"🦉",desc:"夜间视野+，+3智力。",intBonus:3},
  fairy:{name:"小精灵",icon:"🧚",desc:"稀有的精灵宠物，每回合恢复5HP。",hpRegen:5},
  slime:{name:"史莱姆",icon:"🟢",desc:"可爱的史莱姆，可吞噬物品。"}
};

const ACHIEVEMENTS_DATA = [
  {id:"first_blood",name:"初战告捷",desc:"赢得第一场战斗。",check:function(){return (S.battlesWon||0)>=1;}},
  {id:"slayer_10",name:"百人斩",desc:"击败10个敌人。",check:function(){return (S.battlesWon||0)>=10;}},
  {id:"rich_1000",name:"小富翁",desc:"拥有1000金币。",check:function(){return (S.gold||0)>=1000;}},
  {id:"rich_10000",name:"大富翁",desc:"拥有10000金币。",check:function(){return (S.gold||0)>=10000;}},
  {id:"realm_master",name:"宗师",desc:"达到宗师境界。",check:function(){return (typeof S.realm==="number")&&S.realm>=4;}},
  {id:"realm_legend",name:"传奇",desc:"达到传奇境界。",check:function(){return (typeof S.realm==="number")&&S.realm>=6;}},
  {id:"seal_1",name:"第一印",desc:"探索第一印。",check:function(){return S.flags&&S.flags.seal1_visited;}},
  {id:"all_seals",name:"七印探索者",desc:"探索全部七印。",check:function(){return S.flags&&S.flags.seal1_visited&&S.flags.seal7_visited;}},
  {id:"scholar",name:"学者",desc:"学会10个法术。",check:function(){return (S.learnedSpells&&S.learnedSpells.length>=10);}},
  {id:"collector",name:"收藏家",desc:"图鉴收集20件。",check:function(){return (S.codex&&Object.keys(S.codex).length>=20);}},
  {id:"explorer",name:"探险家",desc:"访问全部8大城市。",check:function(){return S.visited&&Object.keys(S.visited).length>=8;}},
  {id:"friend_maker",name:"交际花",desc:"与5名NPC达到挚友关系。",check:function(){if(!S.npcRelations)return false;var c=0;for(var k in S.npcRelations){if(S.npcRelations[k]>=60)c++;}return c>=5;}},
  {id:"criminal",name:"亡命之徒",desc:"通缉等级达到5星。",check:function(){return (S.wantedLevel||0)>=5;}},
  {id:"hero",name:"大陆英雄",desc:"声望总和达到200。",check:function(){if(!S.reputation)return false;var t=0;for(var k in S.reputation){t+=S.reputation[k];}return t>=200;}},
  {id:"abyss_survivor",name:"深渊幸存者",desc:"从深渊归来。",check:function(){return S.flags&&S.flags.abyss_visited;}},
  /* v76 P2-2 多周目成就扩展 */
  {id:"ending_1",name:"走向终点",desc:"抵达任意结局。",check:function(){return (S.endingsCollected||[]).length>=1;}},
  {id:"ending_3",name:"命运多舛",desc:"收集3种不同结局。",check:function(){return (S.endingsCollected||[]).length>=3;}},
  {id:"ending_seal",name:"封印者之途",desc:"达成封印者结局。",check:function(){return (S.endingsCollected||[]).indexOf(TRUE_ENDINGS.seal_all.name)>=0;}},
  {id:"ng_2",name:"轮回者",desc:"进入二周目。",check:function(){return (S.runHistory||[]).length>=2||(S.ngPlus||1)>=2;}},
  {id:"ng_5",name:"百世轮回",desc:"进入五周目终极挑战。",check:function(){return (S.ngPlus||1)>=5;}}
];

function openMountPanel(){
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>坐骑与宠物</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='mount-body'>";
  h += "<h4 style='color:#ffd700'>我的坐骑</h4>";
  if(S.mount){
    const m = MOUNTS_DATA[S.mount];
    h += "<div class='mount-card'>"+m.icon+" "+m.name+" | 速度:"+m.speed+" | 负重:"+m.capacity+"<br>"+m.desc+"</div>";
  } else {
    h += "<div class='empty-hint'>尚未拥有坐骑。</div>";
  }
  h += "<h4 style='color:#ffd700;margin-top:12px'>坐骑商店</h4>";
  const mounts = Object.keys(MOUNTS_DATA);
  for(var i=0;i<mounts.length;i++){
    const m = MOUNTS_DATA[mounts[i]];
    const canBuy = (S.gold||0)>=m.price;
    h += "<div class='mount-card'>"+m.icon+" "+m.name+" | "+m.price+"金 | 速度:"+m.speed+"<br>"+m.desc;
    h += " <button class='btn small' "+(canBuy?"":"disabled")+" onclick='buyMount(\""+mounts[i]+"\")'>购买</button></div>";
  }
  h += "<h4 style='color:#ffd700;margin-top:12px'>我的宠物</h4>";
  if(S.pets&&S.pets.length){
    for(var j=0;j<S.pets.length;j++){
      const p = PETS_DATA[S.pets[j]];
      if(p) h += "<div class='mount-card'>"+p.icon+" "+p.name+" — "+p.desc+"</div>";
    }
  } else {
    h += "<div class='empty-hint'>尚未拥有宠物。</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function buyMount(mountId){
  const m = MOUNTS_DATA[mountId];
  if(!m||(S.gold||0)<m.price) return;
  S.gold -= m.price;
  S.mount = mountId;
  S.maxCargo = m.capacity;
  writePar("购买了【"+m.name+"】！旅行速度提升。","hint");
  addLog("获得坐骑："+m.name,"achievement");
  closePanel();
  renderTop(); renderStats();
}

function openAchievementPanel(){
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>成就与图鉴</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='achievement-body'>";
  h += "<h4 style='color:#ffd700'>成就 ("+(S.achievements?S.achievements.length:0)+"/"+ACHIEVEMENTS_DATA.length+")</h4>";
  for(var i=0;i<ACHIEVEMENTS_DATA.length;i++){
    const a = ACHIEVEMENTS_DATA[i];
    const unlocked = S.achievements&&S.achievements.indexOf(a.id)>=0;
    h += "<div class='achievement-card "+(unlocked?"unlocked":"locked")+"'>";
    h += "<div class='achievement-name'>"+(unlocked?"🏆":"🔒")+" "+a.name+"</div>";
    h += "<div class='achievement-desc'>"+a.desc+"</div>";
    h += "</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function checkAchievements(){
  if(!S.achievements) S.achievements=[];
  for(var i=0;i<ACHIEVEMENTS_DATA.length;i++){
    const a = ACHIEVEMENTS_DATA[i];
    if(S.achievements.indexOf(a.id)<0&&a.check()){
      S.achievements.push(a.id);
      writePar("🏆 成就解锁："+a.name+"！","hint");
      addLog("成就解锁："+a.name,"achievement");
    }
  }
}

/* ================================================================
   v21 多周目与真结局系统
   ================================================================ */
const NG_PLUS_CONFIG = {
  inheritOptions:["realm","skills","items","reputation","gold"],
  enemyScaling:[1,1.3,1.6,2.0,2.5],
  unlocks:{
    2:{name:"二周目",desc:"敌人+30%，解锁隐藏事件。"},
    3:{name:"三周目",desc:"敌人+60%，解锁真结局条件。"},
    4:{name:"四周目",desc:"敌人+100%，解锁隐藏角色。"},
    5:{name:"五周目",desc:"敌人+150%，终极挑战。"}
  }
};

const TRUE_ENDINGS = {
  seal_all:{name:"封印者",cond:"修复全部七印",desc:"你修复了七印，深渊被封印，大陆迎来和平。但你知道，这只是暂时的。"},
  liberator:{name:"解放者",cond:"解放原初之物",desc:"你解放了原初之物，宇宙情感回归，世界变得完整而危险。"},
  coexist:{name:"共存者",cond:"万族共存+解放",desc:"你复兴了所有灭族，解放了原初之物，万族与宇宙情感共存。这是真正的完美结局。"},
  abyss_lord:{name:"深渊之主",cond:"成为新深渊之主",desc:"你击败了深渊之主，取而代之。大陆在你的阴影下颤抖。"},
  martyr:{name:"殉道者",cond:"牺牲自己封印深渊",desc:"你牺牲了自己，永远封印了深渊。大陆会记住你的名字。"},
  wanderer:{name:"流浪者",cond:"未完成主线",desc:"你没有选择任何道路，继续在大陆上游荡。也许这也是一种结局。"}
};

function getNGPlus(){
  return S.ngPlus||1;
}

function startNGPlus(inherit1,inherit2){
  const ng = getNGPlus()+1;
  const inherited = {};
  if(inherit1==="realm") inherited.realm = S.realm;
  if(inherit1==="gold") inherited.gold = Math.floor((S.gold||0)*0.5);
  if(inherit1==="skills") inherited.skills = S.learnedSkills||[];
  if(inherit2==="realm"&&inherit1!=="realm") inherited.realm = S.realm;
  if(inherit2==="gold"&&inherit1!=="gold") inherited.gold = Math.floor((S.gold||0)*0.5);
  if(inherit2==="skills"&&inherit1!=="skills") inherited.skills = S.learnedSkills||[];
  localStorage.setItem("elda-ngplus-"+ng, JSON.stringify(inherited));
  S.ngPlus = ng;
  location.reload();
}

function openNGPlusPanel(){
  const ng = getNGPlus();
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>多周目</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='ngplus-body'>";
  h += "<div class='ngplus-info'>当前周目：第"+ng+"周目<br>敌人强度：x"+NG_PLUS_CONFIG.enemyScaling[Math.min(ng-1,4)]+"</div>";
  if(ng<5){
    const next = NG_PLUS_CONFIG.unlocks[ng+1];
    h += "<div class='ngplus-next'>下一周目解锁："+next.name+" — "+next.desc+"</div>";
  }
  /* v76 P2-2 结局图鉴 */
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>结局图鉴（已收集 "+((S.endingsCollected||[]).length)+" / "+(Object.keys(TRUE_ENDINGS).length+ENDINGS_ABYSS.length)+"）</h4>";
  var _col = S.endingsCollected||[];
  var _all = {};
  for(var _i=0;_i<ENDINGS_ABYSS.length;_i++){ var _e=ENDINGS_ABYSS[_i]; _all[_e.name]={got:(_col.indexOf(_e.name)>=0), cond:_e.cond||"深渊线结局", desc:_e.desc}; }
  for(var _k in TRUE_ENDINGS){ _all[_k]={got:(_col.indexOf(TRUE_ENDINGS[_k].name)>=0), cond:TRUE_ENDINGS[_k].cond, desc:TRUE_ENDINGS[_k].desc}; }
  h += "<div class='ngplus-body' style='font-size:13px;line-height:1.7'>";
  for(var _kk in _all){ var _it=_all[_kk];
    h += "<div style='padding:6px 8px;margin:4px 0;border:1px solid "+(_it.got?'#4a8f4a':'rgba(255,255,255,0.15)')+";border-radius:8px;background:"+(_it.got?'rgba(74,143,74,0.12)':'rgba(255,255,255,0.03)')+"'>";
    h += (_it.got?'✅':'🔒')+" <b>"+_kk+"</b> "+(_it.got?'<span style=\'color:#9fe09f\'>已达成</span>':'<span style=\'color:#c98a8a\'>未达成</span>')+"<br>条件："+_it.cond+"<br><span style='color:#aaa'>"+_it.desc+"</span></div>";
  }
  h += "</div>";
  h += "<h4 style='color:#ffd700;margin:12px 0 8px'>真结局条件</h4>";
  const endings = Object.keys(TRUE_ENDINGS);
  for(var i=0;i<endings.length;i++){
    const e = TRUE_ENDINGS[endings[i]];
    h += "<div class='ending-card'><b>"+e.name+"</b><br>条件："+e.cond+"<br>"+e.desc+"</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

/* ================================================================
   v21 全局初始化与接入
   ================================================================ */
function v21_initDefaults(){
  if(!S.inventory) S.inventory=[];
  if(!S.equipment) S.equipment={};
  if(!S.skills) S.skills=[];
  if(!S.reputation) S.reputation={};
  if(!S.npcRelations) S.npcRelations={};
  if(!S.materials) S.materials={};
  if(!S.schoolLevels) S.schoolLevels={};
  if(!S.schoolExp) S.schoolExp={};
  if(!S.gameLog) S.gameLog=[];
  if(!S.visited) S.visited={};
  if(!S.quickSlots) S.quickSlots=[null,null,null,null];
  if(!S.settings) S.settings={};
  if(S.settings.transition===undefined) S.settings.transition=true;
  if(!S.missedEvents) S.missedEvents=[];
  if(!S.entryHits) S.entryHits={};
  if(!S.worldHeard) S.worldHeard={};
  if(!S.mp) S.mp=50;
  if(!S.maxMp) S.maxMp=50;
  if(!S.exp) S.exp=0;
  if(!S.level) S.level=1;
  if(!S.wantedLevel) S.wantedLevel=0;
  if(!S.battlesWon) S.battlesWon=0;
  if(!S.achievements) S.achievements=[];
  if(!S.ngPlus) S.ngPlus=1;
  if(!S.maxCargo) S.maxCargo=50;
  if(!S.cargoWeight) S.cargoWeight=0;
  if(!S.cargo) S.cargo={};
  if(!S.world) S.world={};
  if(!S.world.totalDay) S.world.totalDay=1;
  if(!S.world.year) S.world.year=1;
}

// 在游戏启动时初始化（等待S就绪）
function v21_waitAndInit(){
  if(typeof S!=="undefined"&&S){
    v21_initDefaults();
    if(typeof renderTopBar==="function") renderTopBar();
    if(typeof checkAchievements==="function") checkAchievements();
  } else {
    setTimeout(v21_waitAndInit, 300);
  }
}
if(typeof window!=="undefined"){
  if(document.readyState==="complete"){ v21_waitAndInit(); }
  else { window.addEventListener("load",v21_waitAndInit); }
}

// 战斗胜利计数（防御式覆写）
if(typeof combatVictory==="function"){
  const _orig_combatVictory_v21 = combatVictory;
  combatVictory = function(){ if(typeof S!=="undefined"){S.battlesWon=(S.battlesWon||0)+1;} _orig_combatVictory_v21(); if(typeof checkAchievements==="function")checkAchievements(); };
}


/* ================================================================
   v21 UI/UX 全面升级 — 角色面板/背包/大地图/快捷栏/日志/设置
   依赖：ENGINE_JS（S/renderTop/renderStats/saveGame/loadGame）
   ================================================================ */

/* ---------- UI 状态 ---------- */
let UI_STATE = {panel:null, tab:"stats", logFilter:"all", mapZoom:1};
/* /u2inj:winx-bare/ */ window.UI_STATE = UI_STATE;

/* ---------- 角色面板 ---------- */
function openCharacterPanel(){
  UI_STATE.panel = "character";
  const a = S.attrs||{};
  const realmNames = ["凡人","启灵","凝元","化意","宗师","大宗师","传奇","半神","神话"];
  const realm = (typeof S.realm==="number")?realmNames[S.realm]:"凡人";
  const jobNames = {mage:"魔法师",warrior:"战士",soul:"灵魂法师",priest:"牧师",rogue:"盗贼",merchant:"商人",alchemist:"炼金术师"};
  const job = jobNames[S.job]||S.job||"未知";
  const power = calcPower();
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>角色面板</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='panel-tabs'>";
  h += "<button class='tab-btn"+(UI_STATE.tab==="stats"?" active":"")+"' onclick='switchTab(\"stats\")'>属性</button>";
  h += "<button class='tab-btn"+(UI_STATE.tab==="combat"?" active":"")+"' onclick='switchTab(\"combat\")'>战斗</button>";
  h += "<button class='tab-btn"+(UI_STATE.tab==="reputation"?" active":"")+"' onclick='switchTab(\"reputation\")'>声望</button>";
  h += "<button class='tab-btn"+(UI_STATE.tab==="skills"?" active":"")+"' onclick='switchTab(\"skills\")'>技能</button>";
  h += "</div>";
  h += "<div class='panel-body' id='char-body'>";
  if(UI_STATE.tab==="stats"){
    h += "<div class='char-info-row'><span class='char-label'>姓名</span><span class='char-value'>"+(S.name||"旅人")+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>种族</span><span class='char-value'>"+(S.race||"人类")+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>职业</span><span class='char-value'>"+job+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>境界</span><span class='char-value realm-val'>"+realm+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>战力</span><span class='char-value power-val'>"+power+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>HP</span><span class='char-value'>"+(S.hp||100)+"/"+(S.maxHp||100)+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>MP</span><span class='char-value'>"+(S.mp||50)+"/"+(S.maxMp||50)+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>SAN</span><span class='char-value'>"+(S.san||100)+"/100</span></div>";
    h += "<div class='attr-grid'>";
    const attrs = [["SPR","精神"],["STR","力量"],["AGI","敏捷"],["INT","智力"],["CHA","魅力"],["CON","体质"]];
    for(var i=0;i<attrs.length;i++){
      h += "<div class='attr-cell'><div class='attr-name'>"+attrs[i][1]+"</div><div class='attr-num'>"+(a[attrs[i][0]]||0)+"</div></div>";
    }
    h += "</div>";
    h += "<div class='char-info-row'><span class='char-label'>金币</span><span class='char-value gold-val'>"+(S.gold||0)+"</span></div>";
    h += "<div class='char-info-row'><span class='char-label'>业力</span><span class='char-value'>"+(S.karma||0)+"</span></div>";
  } else if(UI_STATE.tab==="combat"){
    h += renderCombatStats();
  } else if(UI_STATE.tab==="reputation"){
    h += renderReputation();
  } else if(UI_STATE.tab==="skills"){
    h += renderSkills();
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function renderCombatStats(){
  const a = S.attrs||{};
  const eq = S.equipment||{};
  let atk = (a.STR||0)*0.5 + (eq.weapon?(eq.weapon.attack||0):0);
  let def = (a.CON||0)*0.3 + (eq.armor?(eq.armor.defense||0):0);
  let h = "<div class='combat-stats'>";
  h += "<div class='char-info-row'><span class='char-label'>攻击力</span><span class='char-value'>"+Math.floor(atk)+"</span></div>";
  h += "<div class='char-info-row'><span class='char-label'>防御力</span><span class='char-value'>"+Math.floor(def)+"</span></div>";
  h += "<div class='char-info-row'><span class='char-label'>暴击率</span><span class='char-value'>"+(5+(a.AGI||0)*0.1).toFixed(1)+"%</span></div>";
  h += "<div class='char-info-row'><span class='char-label'>闪避率</span><span class='char-value'>"+(3+(a.AGI||0)*0.15).toFixed(1)+"%</span></div>";
  h += "<div class='equip-section'><h4>装备</h4>";
  h += "<div class='equip-slot'><span>武器</span><span>"+(eq.weapon?eq.weapon.name:"无")+"</span></div>";
  h += "<div class='equip-slot'><span>护甲</span><span>"+(eq.armor?eq.armor.name:"无")+"</span></div>";
  h += "<div class='equip-slot'><span>饰品</span><span>"+(eq.accessory?eq.accessory.name:"无")+"</span></div>";
  h += "</div>";
  h += "</div>";
  return h;
}

function renderReputation(){
  const reps = S.reputation||{};
  const factions = [["free","自由城邦"],["north","北方公国"],["south","南方城邦"],["church","光明教会"],["elf","精灵王国"],["dwarf","矮人王国"],["orc","兽人草原"],["east","东部王国"]];
  let h = "<div class='rep-list'>";
  for(var i=0;i<factions.length;i++){
    const val = reps[factions[i][0]]||0;
    const level = val>=80?"崇拜":val>=50?"尊敬":val>=20?"友好":val>=-20?"中立":val>=-50?"敌对":"仇恨";
    const color = val>=50?"#4caf50":val>=0?"#9e9e9e":"#f44336";
    h += "<div class='rep-row'><span class='rep-name'>"+factions[i][1]+"</span>";
    h += "<div class='rep-bar-bg'><div class='rep-bar' style='width:"+Math.min(100,Math.abs(val))+"%;background:"+color+"'></div></div>";
    h += "<span class='rep-level' style='color:"+color+"'>"+level+"("+val+")</span></div>";
  }
  h += "</div>";
  return h;
}

function renderSkills(){
  const skills = S.skills||[];
  let h = "<div class='skill-list'>";
  if(skills.length===0){ h += "<div class='empty-hint'>尚未习得任何技能。通过修炼、导师或古籍学习技能。</div>"; }
  for(var i=0;i<skills.length;i++){
    const sk = skills[i];
    h += "<div class='skill-card'>";
    h += "<div class='skill-name'>"+sk.name+"</div>";
    h += "<div class='skill-desc'>"+sk.desc+"</div>";
    h += "<div class='skill-meta'>消耗:"+sk.cost+" 类型:"+sk.type+" 等级:"+(sk.level||1)+"</div>";
    h += "</div>";
  }
  h += "</div>";
  return h;
}

function calcPower(){
  const a = S.attrs||{};
  const realmMult = [1,1.5,2,3,5,8,12,20,50];
  const rm = realmMult[(typeof S.realm==="number")?S.realm:0]||1;
  const base = (a.SPR||0)+(a.STR||0)+(a.AGI||0)+(a.INT||0)+(a.CHA||0)+(a.CON||0);
  return Math.floor(base * rm * 1.2);
}

function switchTab(tab){ UI_STATE.tab=tab; closePanel(); openCharacterPanel(); }

/* ---------- 背包界面 ---------- */
function openInventoryPanel(){
  UI_STATE.panel = "inventory";
  const inv = S.inventory||[];
  const categories = {weapon:"武器",armor:"护甲",consumable:"消耗品",material:"材料",quest:"任务物品",misc:"其他"};
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>背包</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='inv-cats'>";
  const cats = Object.keys(categories);
  for(var i=0;i<cats.length;i++){
    const count = inv.filter(it=>it.category===cats[i]).length;
    h += "<button class='cat-btn' onclick='filterInv(\""+cats[i]+"\")'>"+categories[cats[i]]+"("+count+")</button>";
  }
  h += "</div>";
  h += "<div class='inv-grid' id='inv-grid'>";
  if(inv.length===0){ h += "<div class='empty-hint'>背包空空如也。</div>"; }
  for(var j=0;j<Math.min(inv.length,30);j++){
    const it = inv[j];
    h += "<div class='inv-item' onclick='showItemDetail("+j+")' title='"+it.name+"'>";
    h += "<div class='item-icon'>"+(it.icon||"📦")+"</div>";
    h += "<div class='item-name'>"+it.name+"</div>";
    if(it.qty&&it.qty>1) h += "<div class='item-qty'>x"+it.qty+"</div>";
    h += "</div>";
  }
  h += "</div>";
  h += "<div class='inv-detail' id='inv-detail'><span class='empty-hint'>点击物品查看详情</span></div>";
  h += "</div>";
  openModal(elFromHtml(h));
}

function showItemDetail(idx){
  const inv = S.inventory||[];
  const it = inv[idx];
  if(!it) return;
  let h = "<div class='item-detail'>";
  h += "<h4>"+it.name+"</h4>";
  h += "<p class='item-desc'>"+(it.desc||"")+"</p>";
  if(it.attack) h += "<p>攻击力: +"+it.attack+"</p>";
  if(it.defense) h += "<p>防御力: +"+it.defense+"</p>";
  if(it.value) h += "<p>价值: "+it.value+" 金龙</p>";
  if(it.affixes&&it.affixes.length){ h += "<p class='affix-list'>词缀:"; for(var i=0;i<it.affixes.length;i++) h += "<span class='affix-tag'>"+it.affixes[i]+"</span>"; h += "</p>"; }
  h += "<div class='item-actions'>";
  if(it.category==="weapon"||it.category==="armor"||it.category==="accessory") h += "<button class='btn small' onclick='equipItem("+idx+")'>装备</button>";
  if(it.category==="consumable") h += "<button class='btn small' onclick='useItem("+idx+")'>使用</button>";
  h += "<button class='btn small danger' onclick='dropItem("+idx+")'>丢弃</button>";
  h += "</div></div>";
  const d = document.getElementById("inv-detail");
  if(d) d.innerHTML = h;
}

function equipItem(idx){
  const inv = S.inventory||[];
  const it = inv[idx];
  if(!it) return;
  if(!S.equipment) S.equipment={};
  const slot = it.category==="weapon"?"weapon":it.category==="armor"?"armor":"accessory";
  const old = S.equipment[slot];
  S.equipment[slot] = it;
  inv.splice(idx,1);
  if(old) inv.push(old);
  renderTop(); renderStats();
  showItemDetail(-1);
  writePar("装备了【"+it.name+"】。","hint");
}

function useItem(idx){
  const inv = S.inventory||[];
  const it = inv[idx];
  if(!it) return;
  if(it.effect) applyEffects(it.effect,null);
  if(it.qty&&it.qty>1){ it.qty--; } else { inv.splice(idx,1); }
  renderTop(); renderStats();
  writePar("使用了【"+it.name+"】。","hint");
  openInventoryPanel();
}

function dropItem(idx){
  const inv = S.inventory||[];
  const it = inv[idx];
  if(!it) return;
  inv.splice(idx,1);
  writePar("丢弃了【"+it.name+"】。","warn");
  openInventoryPanel();
}

function filterInv(cat){ /* 简化：显示全部，可后续扩展 */ openInventoryPanel(); }

/* ---------- 大地图 ---------- */
function openWorldMap(){
  /* V67 已统一：底部地图入口走 v67_map 模态 */
  try{ if(window.v67_map){ v67_map.open(); return; } }catch(e){}
  UI_STATE.panel = "map";
  const cities = [
    {id:"jiaohui",name:"交汇城",x:50,y:50,region:"free"},
    {id:"holy",name:"圣城",x:50,y:25,region:"church"},
    {id:"ironpeak",name:"铁峰堡",x:25,y:40,region:"dwarf"},
    {id:"silverleaf",name:"银叶城",x:75,y:35,region:"elf"},
    {id:"irongate",name:"铁门关",x:30,y:15,region:"north"},
    {id:"chengtian",name:"承天山",x:75,y:60,region:"east"},
    {id:"orccourt",name:"兽人王庭",x:20,y:70,region:"orc"},
    {id:"southport",name:"南方港城",x:60,y:85,region:"south"}
  ];
  let h = "<div class='panel-wrap wide'>";
  h += "<div class='panel-header'><span class='panel-title'>艾尔达大陆地图</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='map-container'>";
  h += "<svg viewBox='0 0 100 100' class='world-map-svg'>";
  h += "<rect width='100' height='100' fill='#1a2a3a'/>";
  h += "<text x='50' y='8' text-anchor='middle' fill='#8fa8c8' font-size='3'>艾尔达大陆</text>";
  for(var i=0;i<cities.length;i++){
    const c = cities[i];
    const visited = (S.visited&&S.visited[c.id])?true:false;
    const color = visited?"#ffd700":"#5a7a9a";
    h += "<circle cx='"+c.x+"' cy='"+c.y+"' r='2' fill='"+color+"' stroke='#fff' stroke-width='0.3' class='map-city' onclick='travelTo(\""+c.id+"\")'/>";
    h += "<text x='"+c.x+"' y='"+(c.y+4)+"' text-anchor='middle' fill='"+color+"' font-size='2.5'>"+c.name+"</text>";
  }
  h += "</svg>";
  h += "</div>";
  h += "<div class='map-legend'><span>● 已探索</span><span>○ 未探索</span><span class='hint'>点击城市可旅行</span></div>";
  h += "</div>";
  openModal(elFromHtml(h));
}

function travelTo(cityId){
  closePanel();
  const cityNames = {jiaohui:"交汇城",holy:"圣城",ironpeak:"铁峰堡",silverleaf:"银叶城",irongate:"铁门关",chengtian:"承天山",orccourt:"兽人王庭",southport:"南方港城"};
  writePar("你决定前往"+(cityNames[cityId]||cityId)+"。","res");
  if(!S.visited) S.visited={};
  S.visited[cityId]=true;
  advanceDays(2);
  renderTop(); renderStats();
}

/* ---------- 游戏日志 ---------- */
function openGameLog(){
  UI_STATE.panel = "log";
  const log = S.gameLog||[];
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>冒险日志</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='log-list'>";
  if(log.length===0){ h += "<div class='empty-hint'>暂无日志记录。</div>"; }
  for(var i=log.length-1;i>=Math.max(0,log.length-50);i--){
    const entry = log[i];
    h += "<div class='log-entry log-"+(entry.type||"info")+"'>";
    h += "<span class='log-time'>"+(entry.day?"第"+entry.day+"天 ":"")+"</span>";
    h += "<span class='log-text'>"+entry.text+"</span>";
    h += "</div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function addLog(text,type){
  if(!S.gameLog) S.gameLog=[];
  S.gameLog.push({text:text,type:type||"info",day:S.world?(S.world.day||1):1});
  if(S.gameLog.length>200) S.gameLog.shift();
}

/* ---------- 设置面板 ---------- */
function openSettingsPanel(){
  UI_STATE.panel = "settings";
  const cfg = (typeof getLLMConfig==="function")?getLLMConfig():{endpoint:"",apikey:"",model:""};
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>设置</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='settings-body'>";
  h += "<h4>游戏设置</h4>";
  h += "<div class='setting-row'><label>文字速度</label><select id='set-textspeed' onchange='saveSetting(\"textSpeed\",this.value)'><option value='fast'>快</option><option value='normal' selected>正常</option><option value='slow'>慢</option></select></div>";
  h += "<div class='setting-row'><label>音效</label><select id='set-sfx' onchange='saveSetting(\"sfx\",this.value)'><option value='on' selected>开启</option><option value='off'>关闭</option></select></div>";
  h += "<div class='setting-row'><label>难度</label><select id='set-difficulty' onchange='saveSetting(\"difficulty\",this.value)'><option value='easy'>简单</option><option value='normal' selected>普通</option><option value='hard'>困难</option><option value='nightmare'>噩梦</option></select></div>";
  h += "<h4>AI 文笔增强</h4>";
  h += "<div class='setting-row'><label>API Endpoint</label><input type='text' id='llm-endpoint' value='"+(cfg.endpoint||"")+"' placeholder='https://ark.cn-beijing.volces.com/api/v3/chat/completions'/></div>";
  h += "<div class='setting-row'><label>API Key</label><input type='password' id='llm-apikey' value='"+(cfg.apikey||"")+"' placeholder='sk-...'/></div>";
  h += "<div class='setting-row'><label>模型</label><input type='text' id='llm-model' value='"+(cfg.model||"")+"' placeholder='ep-xxxx'/></div>";
  h += "<button class='btn' onclick='saveLLMConfig()'>保存AI设置</button>";
  h += "<h4>存档管理</h4>";
  h += "<div class='setting-row'><button class='btn' onclick='saveGame()'>手动存档</button>";
  h += "<button class='btn' onclick='loadGame()'>读取存档</button>";
  h += "<button class='btn danger' onclick='confirmNewGame()'>新游戏（清档）</button></div>";
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function saveSetting(key,val){
  if(!S.settings) S.settings={};
  S.settings[key]=val;
  if(typeof saveGame==="function") saveGame();
}

/* LLM配置保存fallback */
if(typeof saveLLMConfig!=="function"){
  window.saveLLMConfig = function(){
    const ep = document.getElementById("llm-endpoint");
    const key = document.getElementById("llm-apikey");
    const model = document.getElementById("llm-model");
    const cfg = {
      endpoint: ep?ep.value:"",
      apikey: key?key.value:"",
      model: model?model.value:""
    };
    try{ localStorage.setItem("elda-qunxiong-v3-llm-config", JSON.stringify(cfg)); }catch(e){}
    if(typeof writePar==="function") writePar("AI设置已保存。","hint");
  };
}

async function confirmNewGame(){
  if(await askConfirm("确定要开始新游戏吗？当前存档将被清除。")){
    localStorage.removeItem("elda-qunxiong-v3-save");
    try{ if(typeof v61_clearAll === 'function') v61_clearAll(); }catch(e){} /* /v61inj:perf-clear-ng/ */
    location.reload();
  }
}

/* ---------- 快捷栏 ---------- */
function renderQuickBar(){
  const qb = document.getElementById("quick-bar");
  if(!qb) return;
  const slots = S.quickSlots||[null,null,null,null];
  let h = "<div class='quick-bar-inner'>";
  for(var i=0;i<4;i++){
    const it = slots[i];
    h += "<div class='quick-slot' onclick='useQuickSlot("+i+")' title='"+(it?it.name:"空")+"'>";
    h += (it?("<span class='quick-icon'>"+(it.icon||"📦")+"</span>"):"<span class='quick-empty'>"+(i+1)+"</span>");
    h += "</div>";
  }
  h += "</div>";
  qb.innerHTML = h;
}

function useQuickSlot(i){
  const slots = S.quickSlots||[];
  const it = slots[i];
  if(it&&it.category==="consumable"){ useItemByName(it.name); }
}

function useItemByName(name){
  const inv = S.inventory||[];
  const idx = inv.findIndex(it=>it.name===name);
  if(idx>=0) useItem(idx);
}

/* ---------- 面板通用 ---------- */
function closePanel(){
  try{ if(window.v67_ui) window.v67_ui.close(); }catch(e){}
  UI_STATE.panel=null;
}

function openModal(el){
  try{ if(window.v67_ui) window.v67_ui.open(el); }catch(e){}
}

/* v30.1: ESC键关闭面板（同时支持.modal-overlay和#modal） */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){
    const overlay=document.querySelector('.modal-overlay');
    if(overlay){ closePanel(); return; }
    const modal=document.getElementById('modal');
    if(modal && modal.classList.contains('show')){ closeModal(); }
  }
});

/* ---------- 顶部按钮栏增强 ---------- */
function renderTopBar(){
  /* /v68ui:cleanup/ V68：右下角 top-bar-extra 整组退役（8 键功能全部并入顶部双排导航） */
  try{
    var _old = document.getElementById("top-bar-extra");
    if(_old && _old.parentNode) _old.parentNode.removeChild(_old);
    if(window.V68_UI && V68_UI.bindNav) V68_UI.bindNav();
  }catch(e){}
}

/* ---------- v21 CSS 注入 ---------- */
const V21_CSS = `
.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(20,16,8,.6);z-index:1000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);}
.panel-wrap{background:linear-gradient(180deg,#1e2d3d 0%,#16202e 100%);border:1px solid #3a5a7a;border-radius:8px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;color:#c8d8e8;box-shadow:0 0 40px rgba(0,0,0,0.5);}
.panel-wrap.wide{max-width:800px;}
.panel-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #a09070;background:rgba(184,168,128,.3);}
.panel-title{font-size:16px;font-weight:bold;color:#ffd700;}
.panel-close{background:none;border:none;color:#8fa8c8;font-size:18px;cursor:pointer;}
.panel-close:hover{color:#fff;}
.panel-tabs{display:flex;padding:8px 16px;gap:4px;border-bottom:1px solid #2a3a4a;}
.tab-btn{flex:1;padding:8px;background:#d4c8a8;border:1px solid #a09070;color:var(--text-secondary);cursor:pointer;border-radius:4px;font-size:13px;font-weight:600;}
.tab-btn.active{background:#2a4a6a;color:#ffd700;border-color:#ffd700;}
.panel-body{padding:16px;}
.char-info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #c0b090;}
.char-label{color:#8fa8c8;}
.char-value{color:#e0e8f0;font-weight:bold;}
.realm-val{color:#ffd700;}
.power-val{color:#ff6b6b;}
.gold-val{color:#ffd700;}
.attr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0;}
.attr-cell{background:#ede4cc;border:1px solid #b0a080;border-radius:4px;padding:10px;text-align:center;color:var(--text-primary);font-weight:600;}
.attr-name{font-size:11px;color:#8fa8c8;}
.attr-num{font-size:20px;font-weight:bold;color:#e0e8f0;}
.inv-cats{display:flex;flex-wrap:wrap;gap:4px;padding:8px 16px;}
.cat-btn{padding:6px 12px;background:#d4c8a8;border:1px solid #a09070;color:var(--text-secondary);cursor:pointer;border-radius:4px;font-size:12px;font-weight:600;}
.inv-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:8px 16px;}
.inv-item{background:#ede4cc;border:1px solid #b0a080;border-radius:4px;padding:8px;text-align:center;cursor:pointer;position:relative;color:var(--text-primary);}
.inv-item:hover{border-color:#ffd700;}
.item-icon{font-size:24px;}
.item-name{font-size:10px;color:#c8d8e8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.item-qty{position:absolute;top:2px;right:4px;font-size:10px;color:#ffd700;}
.inv-detail{padding:12px 16px;border-top:1px solid #2a3a4a;min-height:80px;}
.item-detail h4{color:#ffd700;margin:0 0 8px 0;}
.item-desc{font-size:12px;color:#a0b0c0;margin-bottom:8px;}
.affix-tag{display:inline-block;background:#2a4a6a;color:#8fd4ff;padding:2px 6px;border-radius:3px;font-size:10px;margin-right:4px;}
.item-actions{display:flex;gap:8px;margin-top:8px;}
.btn.small{padding:4px 12px;font-size:12px;}
.btn.danger{background:#5a2a2a;border-color:#8a3a3a;color:#ff8a8a;}
.map-container{padding:16px;}
.world-map-svg{width:100%;height:400px;border:1px solid #3a5a7a;border-radius:4px;}
.map-city{cursor:pointer;}
.map-legend{display:flex;gap:16px;padding:8px 16px;font-size:12px;color:#8fa8c8;}
.log-list{padding:8px 16px;max-height:400px;overflow-y:auto;}
.log-entry{padding:6px 0;border-bottom:1px solid #2a3a4a;font-size:12px;}
.log-time{color:#6a7a8a;margin-right:8px;}
.log-text{color:#c8d8e8;}
.log-combat{color:#ff8a8a;}
.log-quest{color:#8fd4ff;}
.log-achievement{color:#ffd700;}
.settings-body{padding:16px;}
.settings-body h4{color:#ffd700;margin:16px 0 8px 0;}
.setting-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
.setting-row label{min-width:100px;color:#8fa8c8;font-size:13px;}
.setting-row input,.setting-row select{flex:1;padding:8px;background:#ede4cc;border:1px solid #b0a080;color:var(--text-primary);border-radius:4px;font-size:14px;font-weight:600;}
.quick-bar-inner{display:flex;gap:4px;}
.quick-slot{width:44px;height:44px;background:#ede4cc;border:1px solid #b0a080;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.quick-slot:hover{border-color:#ffd700;}
.quick-icon{font-size:20px;}
.quick-empty{color:#4a5a6a;font-size:14px;}
.empty-hint{color:#5a6a7a;font-style:italic;text-align:center;padding:20px;}
.rep-list{padding:4px 0;}
.rep-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #2a3a4a;}
.rep-name{min-width:80px;font-size:12px;color:#c8d8e8;}
.rep-bar-bg{flex:1;height:10px;background:#c8bca0;border-radius:5px;overflow:hidden;}
.rep-bar{height:100%;transition:width 0.3s;}
.rep-level{min-width:60px;font-size:11px;text-align:right;}
.skill-card{background:#ede4cc;border:1px solid #b0a080;border-radius:6px;padding:12px;margin-bottom:10px;color:var(--text-primary);}
.skill-name{color:#ffd700;font-weight:bold;font-size:13px;}
.skill-desc{font-size:11px;color:#a0b0c0;margin:4px 0;}
.skill-meta{font-size:10px;color:#6a7a8a;}
.equip-section{margin-top:16px;}
.equip-section h4{color:#ffd700;margin-bottom:8px;}
.equip-slot{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px solid #2a3a4a;}
`;

/* 注入CSS */
(function(){
  const s = document.createElement("style");
  s.textContent = V21_CSS;
  document.head.appendChild(s);
  // 渲染顶部按钮栏
  if(document.readyState==="complete"){ renderTopBar(); }
  else { window.addEventListener("load",renderTopBar); }
})();

/* 覆写renderStats以包含快捷栏（使用唯一变量名避免冲突） */
const _v21_orig_renderStats = typeof renderStats==="function"?renderStats:null;
(function(){ /*v58eng:iife*/ renderStats = function(){
  if(_v21_orig_renderStats) _v21_orig_renderStats();
  renderQuickBar();
}; window.renderStats = renderStats; })();;

/* addLog 接入 writePar（使用唯一变量名） */
const _v21_orig_writePar = typeof writePar==="function"?writePar:null;
(function(){ /*v58eng:iife*/ writePar = function(text,cls){
  if(_v21_orig_writePar) _v21_orig_writePar(text,cls);
  if(text&&text.length>2) addLog(text.replace(/<[^>]+>/g,""),cls||"info");
}; window.writePar = writePar; })();;


/* ============================================================
   v22 方向一：感官沉浸系统（五感叙事层）
   ============================================================ */
const SENSE_SYSTEM = {
  timePeriods: ["清晨","正午","黄昏","深夜"],
  seasons: ["春","夏","秋","冬"],
  // 通用感官模板库 - 按城市/时段/季节组合
  templates: {
    jiaohui: { // 交汇城
      morning: {
        spring: ["晨雾从银穗河上漫上来，裹着湿冷的水汽钻进衣领。","集市的第一声吆喝响起，混着面包房飘出的麦香。","石板路上还留着昨夜的雨迹，倒映着灰蓝色的天。"],
        summer: ["天刚亮就已经热了，蝉在梧桐树上叫得有气无力。","河面反射着刺眼的白光，船夫的号子声远远传来。","空气中飘着栀子花的甜香，混着马粪和汗水的味道。"],
        autumn: ["清晨的风已经凉了，卷起街角的落叶打着旋。","面包房的烟囱冒着白烟，肉桂的香气飘过半条街。","河面上升起薄雾，远处的尖顶教堂像浸在牛奶里。"],
        winter: ["呼出的气立刻变成白雾，手指冻得发僵。","石板路上结了薄冰，每一步都要小心。","集市上人少了很多，只有卖热汤的摊子冒着热气。"]
      },
      noon: {
        spring: ["太阳升到头顶，街上的人多了起来，各种声音汇成一片嗡嗡的白噪音。","酒馆里已经坐满了人，烤肉的油脂滴在炭火上滋滋作响。","春风从街道尽头吹过来，带着泥土和青草的气息。"],
        summer: ["热浪从石板路上蒸腾起来，眼前的景象都有些扭曲。","人们躲在屋檐下的阴影里，摇着扇子昏昏欲睡。","只有卖冰饮的摊子前排着队，冰块融化的水声格外清晰。"],
        autumn: ["阳光是金色的，照在每一片叶子上都像在燃烧。","集市上堆满了秋收的粮食，空气里全是干燥的麦香。","远处传来铁匠铺的锤击声，一下一下，像心跳。"],
        winter: ["太阳虽然挂在天上，却没有一丝暖意。","街上的人都裹着厚厚的斗篷，脚步匆匆。","酒馆的窗户上蒙着一层水汽，里面传出模糊的笑闹声。"]
      },
      dusk: {
        spring: ["夕阳把整条街染成橘红色，影子拉得很长很长。","归巢的乌鸦从头顶飞过，叫声在渐暗的天空里格外清晰。","酒馆的灯一盏盏亮起来，暖黄色的光洒在石板路上。"],
        summer: ["黄昏终于凉快了一些，人们从屋子里走出来透气。","河面被夕阳染成血色，渔船的剪影在水面上晃动。","空气中飘着晚饭的香味，谁家在炖肉，谁家在煎鱼。"],
        autumn: ["天黑得早了，街灯在暮色中一盏盏亮起。","风卷着落叶从脚边滚过，发出沙沙的声响。","远处教堂的钟声响了，沉闷而悠远，在建筑群间回荡。"],
        winter: ["天几乎是立刻就黑了，寒风从街角灌过来。","每一扇亮着灯的窗户都像一个温暖的承诺。","雪开始下了，先是零星的几片，然后越来越密。"]
      },
      night: {
        spring: ["街上安静下来，只有巡夜人的脚步声和更夫的梆子声。","酒馆里还亮着灯，传出模糊的歌声和碰杯声。","月光照在河面上，碎成一片银色的涟漪。"],
        summer: ["夜晚终于凉了，蟋蟀在墙角叫个不停。","有人在阳台上乘凉，轻声说着话，声音被夜风揉碎了。","远处传来狗吠，然后又是一片寂静。"],
        autumn: ["夜风吹得窗户哐哐作响，枯叶在街道上翻滚。","酒馆已经打烊了，只有几盏路灯在风中摇晃。","月亮很圆，照在空无一人的街道上，像铺了一层霜。"],
        winter: ["雪把一切声音都吸走了，世界安静得像被捂住了耳朵。","路灯在雪中昏黄地亮着，光晕里全是飞舞的雪花。","偶尔有一扇窗户透出灯光，里面的人影在晃动，然后灭了。"]
      }
    },
    holy: { // 圣城
      morning: {
        spring: ["晨祷的钟声从大教堂传来，连绵不绝，震得胸腔发颤。","信徒们已经聚集在广场上，轻声吟诵着经文。","空气中飘着熏香的味道，甜腻而庄重。"],
        summer: ["太阳照在白色的大理石建筑上，反射出刺眼的光。","广场上的喷泉哗哗地响着，溅起的水雾带来一丝凉意。","神学院的学生们捧着书走过，长袍的下摆扫过石板。"],
        autumn: ["晨雾中大教堂的尖顶若隐若现，像一把插入天空的剑。","落叶铺满了广场的台阶，踩上去发出脆响。","风吹动教堂的旗帜，猎猎作响。"],
        winter: ["雪落在大教堂的穹顶上，像给神的居所披了一件白袍。","信徒们冒着严寒来做晨祷，鼻尖冻得通红。","钟声在冷空气中传得格外远。"]
      },
      noon: {
        spring: ["广场上挤满了朝圣者和商贩，叫卖声和祈祷声混在一起。","大教堂的门敞开着，里面飘出熏香和圣歌的声音。","阳光透过彩色玻璃窗，在地上投下斑斓的光影。"],
        summer: ["热浪在大理石广场上蒸腾，朝圣者们躲在柱廊的阴影里。","喷泉边围满了人，争抢着清凉的圣水。","审判骑士的铠甲在阳光下闪着冷光。"],
        autumn: ["丰收节的装饰还没拆掉，广场上挂满了金色的麦穗。","小贩在卖烤栗子，香气飘遍了整个广场。","大教堂的钟声在午后响起，庄严而肃穆。"],
        winter: ["广场上人少了很多，只有最虔诚的信徒还在寒风中祈祷。","大教堂里点满了蜡烛，暖黄色的光从门缝里透出来。","审判骑士的脚步在空荡的广场上回响。"]
      },
      dusk: {
        spring: ["夕阳把大教堂的穹顶染成金色，像神的王冠。","晚祷的歌声从教堂里飘出来，在渐暗的天空中回荡。","信徒们陆续散去，广场上渐渐安静下来。"],
        summer: ["黄昏的光是橘红色的，照在白色大理石上像着了火。","朝圣者们点起蜡烛，星星点点的火光在广场上移动。","晚风吹来，带着玫瑰和熏香的味道。"],
        autumn: ["暮色降临，大教堂的轮廓在天空中显得格外庄严。","广场上的灯一盏盏亮起，照在飘落的叶子上。","晚祷的钟声响起，一声比一声沉重。"],
        winter: ["天黑得很快，大教堂的剪影在雪幕中若隐若现。","窗户里透出温暖的烛光，像黑夜里的一颗颗星。","风卷着雪粒打在脸上，生疼。"]
      },
      night: {
        spring: ["广场上空无一人，只有大教堂的剪影在月光下矗立。","守夜人的脚步声在空旷的广场上回响。","偶尔有晚归的修士匆匆走过，黑袍在夜风中飘动。"],
        summer: ["夜晚凉爽了一些，蟋蟀在教堂的墙角里鸣叫。","大教堂的穹顶上有蝙蝠在飞，黑影在月光下掠过。","远处传来守夜人的咳嗽声。"],
        autumn: ["夜风很冷，卷着落叶在广场上打转。","大教堂的窗户里还有几盏灯亮着，有修士在熬夜抄写经文。","月亮被云遮住了，广场上一片昏暗。"],
        winter: ["雪覆盖了一切，广场像一张白色的纸，没有一个脚印。","大教堂的钟声在雪夜中显得格外沉闷。","只有几盏路灯在风雪中顽强地亮着。"]
      }
    },
    ironpeak: { // 铁峰堡
      morning: {
        spring: ["铁锤的敲击声从天不亮就开始了，一下一下，震得脚下的地面发麻。","熔炉的火光从烟囱里冒出来，映红了半边天。","空气中全是煤烟和铁水的味道，呛得人咳嗽。"],
        summer: ["天还没亮就已经热了，熔炉边更是像地狱一样。","矮人们光着膀子在打铁，汗水在肌肉上反光。","矿洞里吹出的风带着一股潮湿的硫磺味。"],
        autumn: ["晨雾从山谷里升起来，铁峰堡的轮廓像一头伏着的巨兽。","铁锤声比平时更密了，据说冬天之前要赶完一批订单。","落叶被热风卷起来，在熔炉边瞬间焦黑。"],
        winter: ["外面天寒地冻，堡垒里却热得像夏天。","矮人们裹着皮袄从住处走向工坊，呼出的气变成白雾。","熔炉的火光在雪夜中格外耀眼。"]
      },
      noon: {
        spring: ["工坊里热火朝天，铁锤声、风箱声、淬火的嘶嘶声汇成一片。","矮人们在大口喝酒，麦酒的泡沫溅在胡子上。","空气中全是铁锈和煤烟的味道，衣服上永远洗不掉。"],
        summer: ["正午的太阳加上熔炉的热量，让人喘不过气。","矮人们轮流在工坊门口的石槽里泡水降温。","矿车从深处推出来，装满了矿石，矿工们满脸乌黑。"],
        autumn: ["秋收的粮食运进了堡垒，矮人商队在广场上讨价还价。","铁锤声比平时慢了一些，矮人们在为冬储做准备。","风从山谷里吹过来，带着松脂和矿石的味道。"],
        winter: ["外面大雪封山，堡垒里却比任何时候都热闹。","矮人们围在熔炉边喝酒唱歌，声音震得天花板掉灰。","只有最勇敢的矿工还在深处作业，火把在黑暗中晃动。"]
      },
      dusk: {
        spring: ["夕阳照在铁峰上，把裸露的岩壁染成铁锈色。","工坊的烟囱冒着黑烟，在暮色中像一条条黑龙。","矮人们收工了，扛着锤子走向酒馆，大声说笑着。"],
        summer: ["黄昏终于凉快了一些，矮人们从工坊里走出来透气。","熔炉的火光在暮色中格外明亮，映红了每一张脸。","远处传来矮人矿工的歌声，低沉而粗犷。"],
        autumn: ["天黑得早了，工坊里的灯一盏盏亮起来。","矮人们在加紧赶工，铁锤声响到深夜。","风从山谷里灌进来，带着冬天的味道。"],
        winter: ["天几乎立刻就黑了，雪在堡垒的墙壁上堆积。","只有熔炉的火光从窗户里透出来，在雪幕中一闪一闪。","矮人们的歌声从酒馆里传出来，在风雪中模糊不清。"]
      },
      night: {
        spring: ["工坊都熄了火，只有守夜人的火把在走廊里移动。","远处的矿洞里还传来敲击声，有人在赶工。","山风在堡垒的墙壁间呼啸，像某种巨兽的呼吸。"],
        summer: ["夜晚凉快了一些，矮人们在屋顶上喝酒乘凉。","远处的山谷里有狼嚎，在群山中回荡。","熔炉的余烬还在发红，在黑暗中像一只眼睛。"],
        autumn: ["夜风很冷，卷着落叶在走廊里打转。","守夜人的脚步声在空旷的大厅里回响。","远处的矿洞里有灯光在移动，有人在值夜班。"],
        winter: ["暴风雪在外面咆哮，堡垒的墙壁在风中发颤。","只有熔炉边还有人，围着余烬喝酒。","雪把一切声音都吸走了，世界安静得可怕。"]
      }
    },
    silverleaf: { // 银叶城
      morning: {
        spring: ["世界树的叶子在晨风中沙沙作响，像一千个精灵在低语。","阳光被树叶切碎了，在地面上投下斑驳的光影。","空气中全是花香和青草的味道，深深吸了一口，肺里都是绿的。"],
        summer: ["天刚亮就已经能听到精灵的歌声，从世界树的枝头飘下来。","露珠在巨大的叶片上滚动，像一颗颗绿宝石。","空气湿润而温暖，带着古老森林的气息。"],
        autumn: ["世界树的叶子开始变黄，金红色的叶片在晨风中飘落。","精灵们在树下收集落叶，动作轻柔得像在跳舞。","空气中有果实成熟的甜香和落叶的微苦。"],
        winter: ["世界树的叶子掉光了，裸露的枝丫在晨雾中像黑色的珊瑚。","精灵们穿着白色的斗篷，在雪地里悄无声息地走过。","空气清冷而干净，像被洗过一样。"]
      },
      noon: {
        spring: ["阳光透过世界树的树冠，在地面上投下流动的光斑。","精灵们在树下练习弓术，箭矢穿过树叶的声音像鸟鸣。","空气中飘着精灵酿的花蜜酒的甜香。"],
        summer: ["世界树的树冠像一把巨大的绿伞，挡住了酷热的阳光。","精灵们在树荫下唱歌、弹琴、编织，时间在这里好像变慢了。","远处有瀑布的声音，水雾在阳光下形成彩虹。"],
        autumn: ["金红色的叶子在风中飞舞，像一场永恒的雨。","精灵们在树下举行丰收祭，歌声在林间回荡。","空气中全是烤坚果和蜂蜜酒的味道。"],
        winter: ["世界树的枝丫上积满了雪，像一件白色的长袍。","精灵们在树洞里围着火堆，轻声讲述古老的故事。","外面寂静无声，只有雪落在叶子上的微响。"]
      },
      dusk: {
        spring: ["夕阳把世界树的叶子染成金绿色，整棵树像在发光。","精灵们开始点亮树屋里的灯，暖黄色的光从树叶间透出来。","晚风吹来，带着花朵合拢的微香。"],
        summer: ["黄昏的光是琥珀色的，照在世界树上像镀了一层蜜。","精灵的歌声在暮色中响起，悠长而悲伤，像是在怀念什么。","萤火虫开始在林间飞舞，星星点点的绿光。"],
        autumn: ["落叶在夕阳中飞舞，像无数金色的蝴蝶。","精灵们沉默地站在树下，看着最后一片叶子落下。","风里有离别的味道。"],
        winter: ["暮色很快降临，世界树的剪影在雪幕中庄严而肃穆。","树屋里的灯一盏盏亮起来，像挂在树上的星星。","雪落在叶子上的声音，是这个世界唯一的声响。"]
      },
      night: {
        spring: ["世界树在月光下泛着柔和的绿光，像在呼吸。","精灵的夜巡队悄无声息地走过，弓弦在月光下闪着冷光。","远处有夜鸟的叫声，在林间回荡。"],
        summer: ["夜晚温暖而湿润，萤火虫在世界树周围飞舞，像一片流动的星河。","精灵们在树顶上观星，小声讨论着星象的变化。","树叶在夜风中沙沙作响，像在说梦话。"],
        autumn: ["夜风很冷，卷着落叶在林间打转。","世界树的叶子几乎掉光了，枝丫在月光下像一只巨大的手。","远处有狼嚎，精灵们握紧了手中的弓。"],
        winter: ["雪覆盖了一切，世界树像一座白色的塔。","树屋里透出温暖的光，里面有歌声和笑声。","外面安静得能听到雪落的声音。"]
      }
    },
    ironpass: { // 铁门关
      morning: {
        spring: ["晨雾从废墟上升起来，像无数亡魂在游荡。","风穿过破损的城墙，发出呜咽的声音，像在哭。","空气中全是焦土和铁锈的味道，还有一丝若有若无的腐臭。"],
        summer: ["太阳照在废墟上，热浪从焦黑的地面蒸腾起来。","乌鸦在断壁残垣上叫着，声音嘶哑而刺耳。","空气中有一股东西腐烂的味道，苍蝇在废墟上盘旋。"],
        autumn: ["秋风吹过废墟，卷起焦黑的木屑和碎布。","野狗在废墟里翻找着什么，骨头在它们的嘴里咔咔作响。","天灰蒙蒙的，像从来没有晴过。"],
        winter: ["雪覆盖了废墟，把战争的痕迹暂时藏了起来。","但有些地方雪是黑的，那是血浸透了土地。","风穿过城墙的缺口，发出尖利的呼啸。"]
      },
      noon: {
        spring: ["太阳照在废墟上，能看到墙上密密麻麻的箭痕和刀痕。","半埋在土里的铠甲上已经长了青苔。","远处有野狗在争抢什么，发出低沉的咆哮。"],
        summer: ["正午的阳光毒辣，废墟里没有任何遮阴的地方。","烧焦的木梁在高温下发出噼啪的声响。","空气扭曲着，远处的废墟像在水中晃动。"],
        autumn: ["风吹过空旷的战场，卷起漫天的尘土。","断墙上的旗帜已经烂得只剩几根布条，在风中无力地飘动。","乌鸦落在断头的雕像上，歪着头看人。"],
        winter: ["雪把一切都盖住了，只有最高的断墙还露在外面。","风在废墟间呼啸，卷起雪粒打在脸上。","没有任何声音，连乌鸦都不来了。"]
      },
      dusk: {
        spring: ["夕阳把废墟染成血红色，像战争又回来了。","影子拉得很长，断墙的影子像一只只伸向天空的手。","风突然冷了，废墟里的温度降得很快。"],
        summer: ["黄昏的光是橘红色的，照在焦黑的废墟上像着了火。","乌鸦归巢了，叫声在暮色中格外刺耳。","远处的山影黑沉沉的，像一排沉默的巨人。"],
        autumn: ["暮色很快降临，废墟在黑暗中变得狰狞。","风穿过破损的城墙，发出像人哭一样的声音。","远处有磷火在闪烁，那是腐烂的尸体在发光。"],
        winter: ["天几乎立刻就黑了，雪在暮色中变成灰蓝色。","废墟的剪影在雪幕中格外凄凉。","风在墙缝里尖叫，像无数亡魂在喊冤。"]
      },
      night: {
        spring: ["废墟里一片漆黑，只有远处的磷火在闪烁。","风穿过断墙，发出各种奇怪的声音，像有人在低语。","偶尔有什么东西在废墟里跑动，可能是野狗，也可能不是。"],
        summer: ["夜晚稍微凉快了一些，但腐臭的味道更浓了。","磷火在废墟里飘来飘去，忽明忽暗。","远处有狼嚎，在空旷的战场上回荡。"],
        autumn: ["夜风很冷，卷着尘土和碎骨在地上滚动。","废墟里黑得伸手不见五指，只有磷火在照路。","能听到自己的心跳声，在寂静中格外响亮。"],
        winter: ["雪夜中的废墟安静得可怕，连风都停了。","月光照在雪上，反射出冷冽的光。","废墟像一座巨大的坟墓，埋葬着无数无名的死者。"]
      }
    },
    desert: { // 死亡沙漠
      morning: {
        spring: ["太阳从沙丘后面升起来，把沙漠染成金色。","晨风还带着夜里的凉意，吹过沙丘发出沙沙的声响。","空气干燥得嘴唇开裂，每一口呼吸都像在吞沙子。"],
        summer: ["天刚亮温度就已经很高了，沙粒在阳光下闪闪发光。","远处有海市蜃楼，一座城市在热浪中若隐若现。","风开始刮起来，卷起细小的沙粒打在脸上。"],
        autumn: ["清晨的沙漠是橘红色的，沙丘的曲线像女人的身体。","风停了，沙漠安静得能听到自己的心跳。","远处有骆驼的铃声，若有若无，可能是幻觉。"],
        winter: ["清晨的沙漠冷得像冰，沙粒上结了一层白霜。","呼出的气变成白雾，在干燥的空气中瞬间消散。","太阳升起来了，但没有一丝暖意。"]
      },
      noon: {
        spring: ["太阳升到头顶，沙漠像一个巨大的烤箱。","沙粒烫得能煎蛋，脚踩上去鞋底都在融化。","远处的海市蜃楼更清晰了，能看到宫殿的尖顶。"],
        summer: ["正午的沙漠是地狱，温度高得让人窒息。","所有的影子都缩到了脚下，世界白得刺眼。","风刮起来了，黄沙漫天，能见度不到三步。"],
        autumn: ["阳光依然毒辣，但已经有了一丝秋天的凉意。","沙丘在阳光下呈现出不同层次的金色和橙色。","远处有沙暴在形成，一堵黄色的墙在缓慢移动。"],
        winter: ["太阳虽然在天上，但沙漠里依然很冷。","沙粒上的霜在阳光下慢慢融化，变成细小的水珠。","远处的沙丘在冷空气中显得格外清晰。"]
      },
      dusk: {
        spring: ["夕阳把沙漠染成血红色，沙丘的影子拉得很长。","温度降得很快，从酷热到寒冷只需要几分钟。","远处的海市蜃楼消失了，只留下空荡荡的沙丘。"],
        summer: ["黄昏的光是橘红色的，沙漠像一片燃烧的海。","风停了，沙漠安静下来，只有沙子滑落的声音。","星星开始出现了，在渐暗的天空中一颗接一颗地亮。"],
        autumn: ["暮色降临，沙漠变成了深紫色。","沙丘的轮廓在暮色中像凝固的波浪。","远处有什么东西在叫，声音嘶哑而悠长。"],
        winter: ["天很快就黑了，沙漠的温度骤降到冰点以下。","夕阳的最后一丝光消失在沙丘后面，世界陷入黑暗。","星星格外明亮，在没有光污染的沙漠里像一条银河。"]
      },
      night: {
        spring: ["沙漠的夜晚冷得刺骨，和白天的酷热形成残酷的对比。","星星密得像撒了一把碎钻，银河横跨整个天空。","远处有沙狐的叫声，在空旷的沙漠里回荡。"],
        summer: ["夜晚终于凉快了，但沙子还在散发着白天储存的热量。","蝎子从沙子里钻出来，在月光下爬行。","远处有沙暴的声音，像远方的雷声。"],
        autumn: ["夜风很冷，卷着沙粒在沙丘间流动。","星星亮得刺眼，能看到自己呼出的白气。","远处有磷火在沙丘间移动，那是沙漠在消化什么东西。"],
        winter: ["沙漠的冬夜是致命的，温度可以降到零下二十度。","星星在冰冷的空气中格外清晰，像被擦过一样。","只有最坚韧的生物还在活动，大多数都躲在沙子下面。"]
      }
    },
    orc: { // 兽人王庭
      morning: {
        spring: ["草原的清晨是绿色的，露水在草叶上闪闪发光。","远处传来兽人的战吼，那是他们在晨练。","空气中有青草和马奶酒的味道，还有篝火的烟。"],
        summer: ["天刚亮就已经热了，草原上没有任何遮阴的地方。","马群在远处奔跑，马蹄声像闷雷一样滚过草原。","空气中有烤肉的香味，兽人在准备一天的食物。"],
        autumn: ["草原变成了金黄色，风吹过，草浪像大海一样起伏。","兽人在准备过冬的物资，帐篷周围堆满了肉干和皮毛。","远处有大雁飞过，叫声在空旷的草原上回荡。"],
        winter: ["草原被雪覆盖了，白茫茫一片，看不到尽头。","兽人的帐篷里冒着烟，牛粪火在里面噼啪作响。","风在草原上呼啸，卷起雪粒打在帐篷上。"]
      },
      noon: {
        spring: ["太阳照在草原上，绿色一直延伸到天边。","兽人们在比武场上角力，欢呼声震耳欲聋。","空气中有马奶酒和烤肉的味道，还有兽人特有的膻气。"],
        summer: ["正午的草原热得像蒸笼，兽人们躲在帐篷里避暑。","只有孩子们还在外面跑，追逐着草原上的土拨鼠。","远处的地平线上有热浪在扭曲，像有水在流动。"],
        autumn: ["草原是金色的，风吹过，草浪翻滚。","兽人们在宰杀牲畜，为冬天做准备，血腥味混在风里。","萨满在帐篷前击鼓，低沉的鼓声在草原上回荡。"],
        winter: ["外面大雪纷飞，帐篷里却很暖和。","兽人们围在火边喝酒吃肉，大声说笑着。","只有最勇猛的战士还在外面巡逻，呼出的气变成白雾。"]
      },
      dusk: {
        spring: ["夕阳把草原染成橘红色，帐篷的影子拉得很长。","兽人们围着篝火唱歌，歌声粗犷而豪迈。","远处的马群在暮色中变成一片黑色的剪影。"],
        summer: ["黄昏的光是金色的，草原像一片金色的海。","篝火点起来了，兽人们围着火堆烤肉、喝酒、讲故事。","风吹过，带着草的清香和肉的香味。"],
        autumn: ["暮色降临，草原变成了深金色。","篝火的光在暮色中格外明亮，映红了每一张脸。","远处有狼嚎，兽人们握紧了手中的武器。"],
        winter: ["天很快就黑了，雪在暮色中变成灰蓝色。","帐篷里透出温暖的光，里面有歌声和笑声。","风在草原上呼啸，像无数野兽在咆哮。"]
      },
      night: {
        spring: ["草原的夜晚很安静，只有虫鸣和远处的马嘶。","篝火的光在黑暗中跳动，映照着兽人粗犷的脸。","星星在没有光污染的草原上格外明亮。"],
        summer: ["夜晚凉快了一些，兽人们在篝火边继续喝酒。","远处有狼嚎，在空旷的草原上回荡。","萤火虫在草丛中飞舞，星星点点的绿光。"],
        autumn: ["夜风很冷，卷着枯草在草原上滚动。","篝火的光在黑暗中摇曳，像一只眼睛。","远处有什么东西在叫，可能是狼，也可能是别的。"],
        winter: ["雪夜中的草原安静得可怕，只有风在呼啸。","帐篷里的光在雪幕中若隐若现。","能听到雪落在帐篷上的声音，沙沙的，像有人在偷听。"]
      }
    },
    east: { // 承天山/东部王国
      morning: {
        spring: ["晨雾从山涧升起来，把承天山裹得严严实实。","书院的钟声从雾中传来，悠远而清越。","空气中有松脂和墨香的味道，还有雨后泥土的气息。"],
        summer: ["天刚亮就已经能听到学生们的读书声，从书院里飘出来。","阳光照在竹叶上，露珠在叶尖闪闪发光。","山涧的水声哗哗地响，在寂静的山中格外清晰。"],
        autumn: ["晨雾中，承天山的轮廓像一幅水墨画。","落叶铺满了山路，踩上去发出沙沙的声响。","书院的钟声在冷空气中传得格外远。"],
        winter: ["雪覆盖了山路，承天山像一头白色的巨兽伏在那里。","书院的屋顶上积满了雪，只有烟囱在冒着烟。","空气清冷而干净，能闻到松脂和炭火的味道。"]
      },
      noon: {
        spring: ["阳光照在书院的飞檐上，琉璃瓦反射出七彩的光。","学生们在课堂上读书，声音整齐而洪亮。","山涧边有学生在洗笔，墨汁在水中散开，像一朵黑色的花。"],
        summer: ["正午的阳光毒辣，学生们躲在书院的阴凉处读书。","竹林里有风，吹得叶子沙沙作响，像在小声讨论。","山涧的水冰凉，有人在里面冰着西瓜和酒。"],
        autumn: ["书院的枫叶红了，像一团火在山间燃烧。","学生们在亭子里赋诗，酒杯在曲水中漂流。","空气中有桂花的甜香，混着墨香和纸的味道。"],
        winter: ["外面大雪纷飞，书院里却很暖和。","学生们围在火边读书，先生在讲解经文。","窗外的雪无声地落着，世界安静得像一幅画。"]
      },
      dusk: {
        spring: ["夕阳照在书院的飞檐上，把琉璃瓦染成金色。","学生们下课了，三三两两地走在山路上，说笑着。","山涧的水声在暮色中显得格外清晰。"],
        summer: ["黄昏的光是橘红色的，照在竹林里像镀了一层蜜。","学生们在山涧边乘凉，有人弹琴，有人吟诗。","萤火虫开始在草丛中飞舞，星星点点的绿光。"],
        autumn: ["暮色降临，书院的灯一盏盏亮起来。","枫叶在夕阳中飞舞，像无数红色的蝴蝶。","远处传来钟声，在山间回荡，一声比一声悠远。"],
        winter: ["天很快就黑了，雪在暮色中变成灰蓝色。","书院的窗户里透出温暖的光，能看到学生们的剪影。","雪落在瓦片上的声音，沙沙的，像时间在流逝。"]
      },
      night: {
        spring: ["书院的灯一盏盏灭了，只有少数还亮着，那是有人在熬夜苦读。","山涧的水声在夜里格外清晰，像在轻声讲述古老的故事。","远处有夜鸟的叫声，在山间回荡。"],
        summer: ["夜晚凉快了一些，有学生在屋顶上观星。","萤火虫在竹林间飞舞，像一片流动的星河。","山风穿过竹林，发出沙沙的声响，像在翻书。"],
        autumn: ["夜风很冷，卷着落叶在山路上打转。","书院的灯大多灭了，只有先生的房间还亮着。","月亮照在枫叶上，反射出暗红色的光。"],
        winter: ["雪夜中的承天山安静得像一幅水墨画。","书院的灯全灭了，只有守夜人的灯笼在走廊里移动。","雪落在瓦片上的声音，是这个世界唯一的声响。"]
      }
    }
  },
  // 属性感知加成 - 高属性角色注意到额外细节
  attributePerception: {
    INT: { threshold: 60, details: ["你注意到墙上有一道新鲜的抓痕。","酒杯上有指纹，说明不久前有人用过。","书页的折角表明有人反复读到这一页。","地上的灰尘有被擦拭过的痕迹。","这个人的鞋底沾着红色的泥，只有北边的山上才有。"] },
    SPR: { threshold: 60, details: ["你感到房间里有一股淡淡的杀意。","空气在轻震，好像有什么东西在地下。","这个人的情绪不对，他在害怕。","你预感到接下来会有不好的事发生。","这里的灵气很紊乱，有人在这里施过法。"] },
    AGI: { threshold: 60, details: ["你注意到窗帘在稍晃动，窗户可能没关严。","脚步声有两个人，一个在前一个在后。","这个人的重心偏左，他的右腿可能有伤。","门轴刚上过油，说明有人经常从这里进出。","风是从北边吹过来的，带着一股铁锈味。"] },
    CON: { threshold: 40, lowDetails: ["气味让你有些反胃。","温度变化让你打了个寒颤。","长时间的行走让你的腿有些发酸。","空气很稀薄，你开始大口喘气。","你感到一阵眩晕，可能是太累了。"] }
  },
  // 伤势叙事
  injuryNarrative: {
    light: ["伤口偶尔抽痛一下，不影响行动。","血迹已经干了，变成暗褐色。","你下意识地避开使用受伤的那只手。","疼痛像一只小兽，在你不注意的时候咬你一口。"],
    heavy: ["视野边缘有些模糊，世界的声音好像变远了。","每走一步，伤口都像被火烧一样。","你不得不扶着墙才能站稳。","冷汗从额头流下来，滴在地上。","周围的人看你的眼神带着担忧——或者是算计。"],
    critical: ["意识在模糊和清醒之间摇摆，像一盏快要熄灭的灯。","你看到了一些不该看到的东西——也许是回忆，也许是幻觉。","疼痛已经消失了，取而代之的是一种奇怪的麻木。","你听到有人在叫你的名字，但声音好像从很远的地方传来。","世界在旋转，然后变成一片黑暗。"]
  }
};

// 感官渲染函数 - 在writeNext中被调用
function renderSenses(){
  try{
    if(!S || !S.loc) return;
    const loc = S.loc;
    const dayPhase = getDayPhase();
    const season = getSeason();
    const cityKey = senseCityKey(loc);
    if(!cityKey || !SENSE_SYSTEM.templates[cityKey]) return;
    const tpl = SENSE_SYSTEM.templates[cityKey][dayPhase] && SENSE_SYSTEM.templates[cityKey][dayPhase][season];
    if(!tpl) return;
    const sense = pickV(tpl, "sense_"+cityKey+"_"+dayPhase+"_"+season);
    if(sense){
      const d = document.createElement("p");
      d.className = "sense";
      d.innerHTML = rich(sense);
      storyEl.appendChild(d);
    }
    // 属性感知细节
    renderAttributePerception();
    // 伤势叙事
    renderInjuryNarrative();
  }catch(e){}
}

function senseCityKey(loc){
  const map = { "交汇城":"jiaohui","圣城":"holy","铁峰堡":"ironpeak","银叶城":"silverleaf","铁门关":"ironpass","死亡沙漠":"desert","兽人王庭":"orc","承天山":"east" };
  return map[loc] || null;
}

function getDayPhase(){
  try{
    const hour = (S.world && S.world.hour) || 12;
    if(hour>=5 && hour<11) return "morning";
    if(hour>=11 && hour<16) return "noon";
    if(hour>=16 && hour<20) return "dusk";
    return "night";
  }catch(e){ return "noon"; }
}

function getSeason(){
  try{
    const month = (S.world && S.world.month) || 1;
    if(month>=3 && month<=5) return "spring";
    if(month>=6 && month<=8) return "summer";
    if(month>=9 && month<=11) return "autumn";
    return "winter";
  }catch(e){ return "spring"; }
}

function renderAttributePerception(){
  try{
    const attrs = ["INT","SPR","AGI"];
    for(const a of attrs){
      const val = S.attrs[a] || 0;
      const per = SENSE_SYSTEM.attributePerception[a];
      if(per && val >= per.threshold && Math.random() < 0.3){
        const detail = pickV(per.details, "perception_"+a);
        if(detail){
          const d = document.createElement("p");
          d.className = "perception";
          d.innerHTML = rich("【"+ATTR_CN[a]+"感知】"+detail);
          storyEl.appendChild(d);
        }
        break;
      }
    }
    // 低CON负面感知
    const con = S.attrs.CON || 50;
    if(con < 40 && Math.random() < 0.2){
      const detail = pickV(SENSE_SYSTEM.attributePerception.CON.lowDetails, "perception_con_low");
      if(detail){
        const d = document.createElement("p");
        d.className = "perception low";
        d.innerHTML = rich("【体质影响】"+detail);
        storyEl.appendChild(d);
      }
    }
  }catch(e){}
}

function renderInjuryNarrative(){
  try{
    const hpPct = S.hp / maxHp();
    if(hpPct > 0.7) return;
    let level = "light";
    if(hpPct <= 0.3) level = "critical";
    else if(hpPct <= 0.5) level = "heavy";
    if(Math.random() < 0.25){
      const narr = pickV(SENSE_SYSTEM.injuryNarrative[level], "injury_"+level);
      if(narr){
        const d = document.createElement("p");
        d.className = "injury-narr";
        d.innerHTML = rich(narr);
        storyEl.appendChild(d);
      }
    }
  }catch(e){}
}

/* ============================================================
   v22 方向三：思想内阁（角色内心 voices）
   ============================================================ */
const INNER_VOICES = {
  // 职业声音
  job: {
    "魔法师": { name:"元素低语", color:"#7b68ee", lines: ["空气中的元素在躁动，你感觉到了吗？","这里的魔法流动很奇怪，像是被什么干扰了。","元素在向你低语，它们在害怕什么。","你的指尖在发麻，附近有强大的魔法物品。","火元素在欢呼，水元素在哭泣——这里发生过什么。"] },
    "战士": { name:"战意", color:"#dc143c", lines: ["你的手在发痒，想找点什么打一架。","这个人的站姿有破绽，你可以在三招内放倒他。","战斗的血液在你体内沸腾，逃避是不可能的。","你评估了一下形势，胜算不大，但不是没有。","武器在手中轻震，它也渴望战斗。"] },
    "灵魂法师": { name:"亡者呢喃", color:"#9370db", lines: ["你听到了——死者的残响在这个房间里回荡。","有什么东西在看着你，从生者看不到的角度。","灵魂的味道在这里很浓，有人死得不瞑目。","你的后颈发凉，有灵魂从你身边经过。","你能感觉到它们的痛苦，像冰冷的针扎进脑子里。"] },
    "牧师": { name:"神启", color:"#ffd700", lines: ["神明在注视着这里，你能感觉到那道视线。","这个人的灵魂有污点，神不会原谅他。","祈祷吧，在行动之前先问问神的旨意。","你感到一股温暖的力量在体内流动，那是神的祝福。","这里有亵渎的气息，神会惩罚这些罪人。"] },
    "盗贼": { name:"暗影直觉", color:"#2f4f4f", lines: ["后门没锁，你可以从那里溜出去。","那个人的钱袋鼓鼓的，而且他完全没注意到你。","窗户离地面不高，跳下去不会受伤。","守卫的视线有盲区，三秒钟后就是机会。","这个房间里最值钱的东西在那个暗格里。"] },
    "商人": { name:"利益计算", color:"#daa520", lines: ["这笔交易不划算，你至少可以再压价三成。","这个人急需用钱，你可以用很低的价格买下他的东西。","这里的物价比交汇城高了两成，有套利空间。","投资这个人，他将来会给你带来十倍的回报。","时间就是金钱，别在无关紧要的事上浪费。"] },
    "骑士": { name:"圣光低语", color:"#ffd700", lines: ["你的誓约在胸腔里灼烧，像一面被火烤过的战旗。","这具尸体上的伤口——是亡灵留下的。你闻到了深渊的味道。","你握剑的手比任何时候都稳。守护的意义，不需要神明来提醒。","圣光不是用来照耀自己的。你低头看了一眼盾上的划痕。","誓约在背，战旗在肩。你的神从不开口，但从未缺席。"] },
    "游侠": { name:"荒野低语", color:"#228b22", lines: ["风把气味带给你：三只鹿，一头狼，还有更远处的一队人马。","这片林子的平衡被打破了——有人砍了不该砍的树。","你的弓弦在轻震，它比你更早察觉危险。","脚印不是用来追踪的，是用来读懂一个故事的。","荒野从不说谎，它只是不急着开口。"] },
    "术士": { name:"造物低语", color:"#ff8c00", lines: ["这个杯子的材质不纯，里面掺了铅。","空气中有硫磺的味道，有人在这里炼过强酸。","这块矿石的品相很好，至少能炼出六成的纯金属。","你的血脉在回应炉火——本源认得你。","万物皆可被理解，理解之后，皆可被重塑。"] }
  },
  // 属性声音
  attr: {
    SPR: { name:"预感", color:"#ba55d3", lines: ["你突然感到一阵不安，说不上来为什么。","有什么事要发生了，你的直觉在尖叫。","这个人不对劲，虽然他看起来很正常。","你预感到这条路有危险，但另一条路也不安全。","空气中有一股山雨欲来的味道。"] },
    STR: { name:"蛮力", color:"#b22222", lines: ["直接打进去不就行了？哪那么多废话。","这扇门看起来不结实，你一脚就能踹开。","别跟他讲道理，用拳头让他闭嘴。","你的肌肉在渴望行动，坐着不动让你烦躁。","就算打不过，至少可以打一顿出气。"] },
    AGI: { name:"机变", color:"#00ced1", lines: ["等等，还有另一个办法——从侧面绕过去。","如果现在跑，应该还来得及。","你可以假装答应，然后在最后一刻反悔。","注意他的左手，他在摸什么东西。","随机应变，计划永远赶不上变化。"] },
    INT: { name:"逻辑", color:"#4169e1", lines: ["等等，这不合逻辑。他为什么要这么做？","根据现有信息推断，真相只有一个。","你注意到了一个矛盾——他说的和事实不符。","让我们分析一下：如果A是真的，那么B就不可能。","这是一个陷阱，太明显了，明显到反而可能是真的。"] },
    CHA: { name:"魅力", color:"#ff69b4", lines: ["笑一笑，没有什么是一顿酒解决不了的。","他看起来很孤独，也许你可以和他交个朋友。","用你的口才说服他，比用拳头有效得多。","人们总是愿意相信长得好看的人。","先建立感情，再谈事情——这是处世之道。"] },
    CON: { name:"坚韧", color:"#228b22", lines: ["这点伤算什么，你受过更重的。","坚持住，再走一步就到了。","你的身体像铁打的一样，不会轻易倒下。","疼痛只是暂时的，荣耀才是永恒的。","别人都倒下了，你还站着——这就是你的优势。"] }
  }
};

// 渲染思想内阁插话
function renderVoices(){
  try{
    if(!S) return;
    const voices = [];
    // 职业声音
    const jobVoice = INNER_VOICES.job[S.job];
    if(jobVoice && Math.random() < 0.35){
      const line = pickV(jobVoice.lines, "voice_job_"+S.job);
      if(line) voices.push({name:jobVoice.name, color:jobVoice.color, text:line});
    }
    // 属性声音 - 根据当前场景选择1-2个
    const attrKeys = Object.keys(INNER_VOICES.attr);
    const shuffled = attrKeys.sort(()=>Math.random()-0.5);
    for(let i=0;i<Math.min(2,shuffled.length);i++){
      const key = shuffled[i];
      const av = INNER_VOICES.attr[key];
      const val = S.attrs[key] || 0;
      const chance = 0.15 + (val/100)*0.2; // 属性越高越常出现
      if(Math.random() < chance){
        const line = pickV(av.lines, "voice_attr_"+key);
        if(line) voices.push({name:av.name, color:av.color, text:line});
      }
    }
    // SAN低时幻听
    if(S.san < 40 && Math.random() < 0.3){
      const hallucinations = ["你听到了一个声音，但它不是你的任何一个人格。","有什么东西在你脑子里低语，你听不懂它在说什么。","你的思想开始混乱，不同的声音在争吵。","你不确定这是你的想法，还是别的什么东西塞进来的。","一个冰冷的声音在你耳边说：放弃吧。"];
      const line = pickV(hallucinations, "voice_hallucination");
      if(line) voices.push({name:"???", color:"#8b0000", text:line});
    }
    // 渲染
    for(const v of voices){
      const d = document.createElement("p");
      d.className = "inner-voice";
      d.innerHTML = "<span style='color:"+v.color+"' class='voice-name'>【"+v.name+"】</span> "+rich(v.text);
      storyEl.appendChild(d);
    }
  }catch(e){}
}

/* ============================================================
   v22 方向四：慢旅行系统（路上即故事）
   ============================================================ */
const SLOW_TRAVEL = {
  stages: ["morning","noon","dusk","night"],
  stageNames: { morning:"晨间出发", noon:"午间休息", dusk:"傍晚扎营", night:"夜间守夜" },
  // 旅伴
  companions: [
    { id:"merchant_caravan", name:"美第奇商队", desc:"一支从交汇城出发的商队，护卫森严，货物满车。", stories:["老商人给你讲了他年轻时在南方城邦被骗光所有钱的故事。","商队的护卫长是个退役的北方公国士兵，他给你看了他身上的旧伤。","晚上扎营时，商人的学徒偷偷问你，外面的世界是不是真的像书上说的那样大。","商队在一个小镇停了一天，老商人去和当地的商会会长密谈了很久。","你注意到商队的货物里有几箱没有标签的东西，老商人对此讳莫如深。"] },
    { id:"refugees", name:"逃难的农夫", desc:"一群从铁门关方向逃来的难民，扶老携幼，衣衫褴褛。", stories:["一个老妇人给你看了她儿子的遗物——一把生锈的小刀。","难民中的一个孩子问你，战争是不是永远不会结束。你不知道怎么回答。","晚上，一个男人在角落里偷偷哭泣，他的妻子在逃难中死了。","难民们分享了他们仅剩的食物，虽然你知道他们自己也吃不饱。","一个老兵告诉你，铁门关破城那天的事，他说的时候眼睛一直看着地面。"] },
    { id:"bard", name:"游吟诗人", desc:"一个背着琴的游吟诗人，据说他走过整个大陆。", stories:["他唱了一首关于黄林晶的歌，歌词里藏着一些你从未听过的细节。","他给你讲了他在矮人王国喝醉后和矮人比酒量的故事。","他说他曾经在精灵王国住过三年，精灵的时间感和人类完全不同。","晚上他弹了一首悲伤的曲子，说是为了纪念一个死去的爱人。","他告诉你，大陆上流传的故事有一半是假的，但假的故事往往比真的更真实。"] },
    { id:"priest", name:"朝圣的牧师", desc:"一个前往圣城的牧师，背着沉重的圣典。", stories:["他给你讲了光明教会的历史，以及净化令的真正起因。","他说他见过神迹，也见过教会内部的腐败。","晚上他做祷告，你在旁边听着，感到一种奇怪的平静。","他告诉你，他正在去圣城举报一个红衣主教，但他不确定自己能不能活着到那里。","他的圣典里夹着一封信，他从不给任何人看。"] },
    { id:"scout", name:"独行的斥候", desc:"一个沉默寡言的斥候，据说他在为某个势力工作。", stories:["他教你怎么在野外找到干净的水源和可食用的植物。","他告诉你，他曾经在兽人草原生活了三年，兽人和人类没有那么不同。","晚上他守夜的时候，你注意到他的手一直放在刀柄上。","他说他见过深渊的生物，那是他这辈子最不想回忆的事。","在分别的时候，他给了你一个小物件，说关键时刻可能有用。"] },
    { id:"alone", name:"独自上路", desc:"你选择一个人旅行，只有风和影子作伴。", stories:["你一个人走了很久，久到开始和自己说话。","晚上你围着篝火坐着，听着远处的狼嚎，感到一种奇怪的自由。","你在路边发现了一具白骨，不知道是谁，也不知道他为什么死在这里。","你开始注意到以前忽略的细节——鸟的叫声、风的方向、云的形状。","孤独是一种奇怪的东西，它让你想得更多，也让你忘得更多。"] }
  ],
  // 路上遇到的人
  roadEncounters: [
    { type:"refugee_oldman", text:"一个老人坐在路边，怀里抱着一个布包。他看到你，浑浊的眼睛里闪过一丝光。「年轻人，你要去哪里？」他的声音像枯叶在风中摩擦。", trigger:"always" },
    { type:"merchant_stuck", text:"一辆马车陷在泥里，商人在旁边急得团团转。「帮帮忙！」他冲你喊，「我给你钱！」马在泥里挣扎，车轮越陷越深。", trigger:"always" },
    { type:"dead_soldier", text:"路边有一具士兵的尸体，已经开始腐烂了。他的手里还攥着一封信，信封上写着「给我的妻子」。", trigger:"always" },
    { type:"child_lost", text:"一个孩子在路边哭，说他和家人走散了。他的脸很脏，眼睛却很亮，像两颗星星落在了泥里。", trigger:"always" },
    { type:"hermit", text:"一个隐士住在路边的小屋里，他邀请你进去喝茶。「我在这里住了三十年了，」他说，「外面的世界变成什么样了？」", trigger:"always" },
    { type:"broken_cart", text:"一辆翻倒的马车，货物散了一地。没有人在附近，但地上有拖拽的痕迹——指向旁边的树林。", trigger:"always" },
    { type:"sick_traveler", text:"一个旅行者躺在路边，发着高烧。他喃喃地说着胡话，你听不清他在说什么，但能听到他反复提到一个名字。", trigger:"always" },
    { type:"wedding_procession", text:"一支迎亲的队伍从对面走来，吹吹打打，好不热闹。新娘坐在轿子里，你看不到她的脸，但能看到她在哭。", trigger:"always" },
    { type:"funeral", text:"一支送葬的队伍沉默地走过，白色的纸钱在风中飞舞。死者是一个年轻人，棺材上放着他还没来得及穿的新衣。", trigger:"always" },
    { type:"fugitive", text:"一个人从路边的草丛里冲出来，拦住你的去路。「别出声！」他压轻声音，脸上有血，「他们在追我。」", trigger:"always" }
  ]
};

// 慢旅行状态
function startSlowTravel(dest, companionId){
  S.slowTravel = {
    dest: dest,
    companion: companionId || "alone",
    day: 1,
    stage: "morning",
    totalDays: calcTravelDays(dest),
    storyIndex: 0
  };
  curNode = "slow_travel_start";
  writeNext();
}

function calcTravelDays(dest){
  try{
    const from = S.loc || "交汇城";
    const coords = TRAVEL.cities;
    if(!coords[from] || !coords[dest]) return 3;
    const dx = coords[dest].x - coords[from].x;
    const dy = coords[dest].y - coords[from].y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    return Math.max(1, Math.ceil(dist / 50)); // 默认步行约50公里/天
  }catch(e){ return 3; }
}

// 慢旅行节点
N["slow_travel_start"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  return {
    place: "旅途 · 第"+st.day+"天 · "+SLOW_TRAVEL.stageNames[st.stage],
    text: function(){
      const arr = [];
      arr.push("你从"+(S.loc||"交汇城")+"出发，前往"+st.dest+"。预计需要"+st.totalDays+"天。");
      arr.push("你的旅伴是："+comp.name+"——"+comp.desc);
      arr.push("路在脚下延伸，两边的风景在慢慢变化。");
      return arr;
    },
    options: [
      { t:"继续前进", go:"slow_travel_morning" },
      { t:"和旅伴聊聊", go:"slow_travel_companion_talk" }
    ]
  };
};

N["slow_travel_morning"] = function(){
  const st = S.slowTravel;
  return {
    place: "旅途 · 第"+st.day+"天 · 晨间出发",
    text: function(){
      const arr = [];
      const season = getSeason();
      const morningTexts = {
        spring:["天刚亮，露水打湿了你的裤脚。空气里有青草和泥土的味道。","晨雾还没散，远处的树像浸在牛奶里。你吸了口气，肺里都是凉的。","鸟儿在枝头叫着，像是在讨论今天的天气。"],
        summer:["天刚亮就已经热了，你擦了擦额头的汗。远处的地平线上有热浪在扭曲。","蝉已经开始叫了，一声接一声，像在给这一天倒计时。","你喝了一口水，水已经有点温了。"],
        autumn:["清晨的风已经凉了，你裹紧了斗篷。落叶在脚下发出脆响。","天灰蒙蒙的，好像要下雨。远处的山影模糊不清。","你呼出的气变成了白雾，秋天真的来了。"],
        winter:["天刚亮，雪还在下。你的睫毛上结了霜，每一次眨眼都能感觉到细碎的冰。","路已经被雪盖住了，你只能凭着感觉往前走。脚踩在雪里，发出咯吱咯吱的声音。","太冷了。你把双手揣在袖子里，缩着脖子往前走。"]
      };
      arr.push(pickV(morningTexts[season]||morningTexts.spring, "st_morning_"+season));
      if(comp && comp.id!=="alone"){
        arr.push(comp.name+"已经准备好了，正在等你。");
      }
      return arr;
    },
    options: [
      { t:"出发赶路", go:"slow_travel_noon" },
      { t:"观察周围环境", check:{a:"INT", label:"观察"}, go:"slow_travel_noon", fail:"slow_travel_noon",
        tier:{ crit:["你的视线扫过路边的细节——车辙的深度、被踩断的树枝、地上残留的血迹。不久前有一队人马经过这里，而且有人受伤了。"], ok:["你注意到路边的草有被压过的痕迹，似乎不久前有人在这里扎过营。"], fail:["你看了一圈，什么特别的都没发现。也许是你多心了。"], critfail:["你只顾着看风景，差点踩到一坨马粪。旅伴在旁边笑出了声。"] } },
      { t:"和旅伴聊天", go:"slow_travel_companion_talk" }
    ]
  };
};

N["slow_travel_noon"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  return {
    place: "旅途 · 第"+st.day+"天 · 午间休息",
    text: function(){
      const arr = [];
      arr.push("太阳升到了头顶，你找了个阴凉的地方休息。");
      arr.push("你拿出干粮，就着水壶里的水慢慢吃着。");
      if(comp && comp.id!=="alone"){
        arr.push(comp.name+"坐在你旁边，也在吃着东西。");
      }
      // 随机路上遭遇
      if(Math.random() < 0.4){
        const enc = pickV(SLOW_TRAVEL.roadEncounters, "st_encounter_"+st.day);
        if(enc) arr.push(enc.text);
      }
      return arr;
    },
    options: [
      { t:"吃完继续赶路", go:"slow_travel_dusk" },
      { t:"和旅伴分享食物", effect:{time:0}, go:"slow_travel_companion_talk" },
      { t:"小睡一会儿", effect:{time:0, hp:5}, go:"slow_travel_dusk",
        tier:{ ok:["你靠着树打了个盹，醒来后精神好了一些。恢复了5点HP。"] } },
      { t:"练习技能", check:{a:"INT", label:"修炼"}, go:"slow_travel_dusk", fail:"slow_travel_dusk",
        tier:{ crit:["你在休息时参悟了技能的精髓，获得了额外的经验。"], ok:["你练习了一会儿，感觉对技能的理解又深了一层。"], fail:["天气太热了，你练了一会儿就满头大汗，效果不大。"], critfail:["你练习的时候扭到了手腕，疼了好一会儿。损失了3点HP。"] } }
    ]
  };
};

N["slow_travel_dusk"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  return {
    place: "旅途 · 第"+st.day+"天 · 傍晚扎营",
    text: function(){
      const arr = [];
      const season = getSeason();
      const duskTexts = {
        spring:["夕阳把天空染成了橘红色，影子拉得很长。你找了个背风的地方准备扎营。","天慢慢暗下来，远处的山变成了深紫色。你开始收集柴火。","晚风凉了，你裹紧斗篷。今天走了不少路，腿有些酸。"],
        summer:["黄昏终于凉快了一些，你在一条小溪边扎营。溪水冰凉，洗把脸很舒服。","夕阳把云染成了火烧云，像着了火一样。你生起了篝火。","蚊子开始出来了，你在身上涂了一些驱虫的草药。"],
        autumn:["天黑得早了，你在太阳完全落山前生起了篝火。落叶在火中噼啪作响。","晚风很冷，你往篝火边凑了凑。今天的路比想象中难走。","星星一颗接一颗地亮了，在没有光污染的野外格外清晰。"],
        winter:["天几乎立刻就黑了，你赶紧生起篝火。雪在火边融化，发出嘶嘶的声音。","你把冻僵的手伸到火边，感觉手指慢慢恢复了知觉。","今晚很冷，你需要多烧一些柴火才能撑到天亮。"]
      };
      arr.push(pickV(duskTexts[season]||duskTexts.spring, "st_dusk_"+season));
      if(comp && comp.id!=="alone"){
        arr.push(comp.name+"在帮忙搭帐篷，动作很熟练。");
      }
      return arr;
    },
    options: [
      { t:"准备守夜", go:"slow_travel_night" },
      { t:"听旅伴讲故事", go:"slow_travel_campfire" },
      { t:"独自思考今天的经历", go:"slow_travel_reflect" }
    ]
  };
};

N["slow_travel_night"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  const isLastDay = st.day >= st.totalDays;
  return {
    place: "旅途 · 第"+st.day+"天 · 夜间守夜",
    text: function(){
      const arr = [];
      arr.push("夜很深了，篝火的光在黑暗中像一只眼睛。");
      arr.push("你坐在火边，听着夜里的各种声音——虫鸣、风声、远处的什么东西在叫。");
      if(comp && comp.id!=="alone"){
        arr.push(comp.name+"已经睡了，呼吸声很平稳。你负责上半夜的守夜。");
      }
      const nightEvents = [
        "你听到远处有狼嚎，在空旷的野外回荡。篝火噼啪作响，你往火里添了根柴。",
        "有什么东西在草丛里动了一下，你握紧了武器。过了一会儿，一只兔子跑了出来。",
        "夜空中有流星划过，你许了个愿——虽然你也不知道神会不会听。",
        "你开始想一些平时不会想的事——你的过去、你的未来、你为什么要走这条路。",
        "篝火快灭了，你起来添柴。星星在头顶旋转，像一个巨大的钟表。",
        "你听到了脚步声，从很远的地方传来，然后消失了。也许是野兽，也许是别的。"
      ];
      arr.push(pickV(nightEvents, "st_night_"+st.day));
      return arr;
    },
    options: [
      { t:"安心守到天亮", check:{a:"CON", label:"守夜"}, go: isLastDay?"slow_travel_arrive":"slow_travel_next_day", fail: isLastDay?"slow_travel_arrive":"slow_travel_next_day",
        tier:{ crit:["你精神抖擞地守了一整夜，没有任何异常。天亮时你感到前所未有的清醒。"], ok:["你守了大半夜，后来实在太困打了个盹。好在没出什么事。"], fail:["你守着守着就睡着了，醒来时天已经亮了。好在什么都没发生——也许。"], critfail:["你睡着了，而且做了个噩梦。醒来时发现背包被翻过，少了一些食物。"] } },
      { t:"叫醒旅伴换班", effect:{time:0}, go: isLastDay?"slow_travel_arrive":"slow_travel_next_day",
        tier:{ ok:["你叫醒了旅伴，他揉着眼睛起来接岗。你钻进帐篷，很快就睡着了。"] } },
      { t:"在夜里四处看看", check:{a:"AGI", label:"夜探"}, go: isLastDay?"slow_travel_arrive":"slow_travel_next_day", fail: isLastDay?"slow_travel_arrive":"slow_travel_next_day",
        tier:{ crit:["你在附近转了一圈，发现了一个被遗弃的营地，里面还有一些有用的物资。"], ok:["你在附近走了走，确认了周围没有危险。回来时天已经快亮了。"], fail:["你在黑暗中差点迷路，转了半天才找回营地。"], critfail:["你踩到了什么东西，低头一看是一具白骨。你吓得跑回营地，一整夜没睡着。"] } }
    ]
  };
};

N["slow_travel_next_day"] = function(){
  S.slowTravel.day++;
  S.slowTravel.stage = "morning";
  advanceDays(1);
  curNode = "slow_travel_morning";
  writeNext();
  return { text:["新的一天开始了。"],pace:"light" };
};

N["slow_travel_arrive"] = function(){
  const st = S.slowTravel;
  S.loc = st.dest;
  if(!S.visited) S.visited = [];
  if(S.visited.indexOf(st.dest)===-1) S.visited.push(st.dest);
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  return {
    place: st.dest,
    text: function(){
      const arr = [];
      arr.push("经过"+st.totalDays+"天的跋涉，你终于到达了"+st.dest+"。");
      arr.push("城市的轮廓在眼前越来越清晰，你的心情有些复杂——旅途结束了，但新的故事才刚刚开始。");
      if(comp && comp.id!=="alone"){
        arr.push("你和"+comp.name+"在城门口道别。「后会有期。」他说，然后转身走进了人群。");
      }
      arr.push("你回头看了一眼来时的路，那些日子已经变成了回忆。");
      return arr;
    },
    options: [
      { t:"进入城市", go:"fc_jiaohui_entry" }
    ]
  };
};

N["slow_travel_companion_talk"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  const idx = st.storyIndex % comp.stories.length;
  st.storyIndex++;
  return {
    place: "旅途 · "+comp.name,
    text: function(){
      return [comp.stories[idx]];
    },
    options: [
      { t:"继续听", go:"slow_travel_"+st.stage },
      { t:"问他一个问题", check:{a:"CHA", label:"询问"}, go:"slow_travel_"+st.stage, fail:"slow_travel_"+st.stage,
        tier:{ crit:["你问了一个巧妙的问题，"+comp.name+"犹豫了一下，然后告诉了你一些他从未对别人说过的事。你对他的了解更深了。"], ok:[comp.name+"想了想，给了你一个中肯的回答。你觉得有些收获。"], fail:[comp.name+"笑了笑，回避了你的问题。「有些事，还是不知道的好。」"], critfail:["你问了一个不该问的问题，"+comp.name+"的脸色变了。接下来的路，他都没怎么和你说话。"] } },
      { t:"分享你自己的故事", effect:{time:0}, go:"slow_travel_"+st.stage,
        tier:{ ok:["你讲了自己的一些经历，"+comp.name+"认真地听着。讲完之后，你觉得心里轻松了一些。"] } }
    ]
  };
};

N["slow_travel_campfire"] = function(){
  const st = S.slowTravel;
  const comp = SLOW_TRAVEL.companions.find(c=>c.id===st.companion) || SLOW_TRAVEL.companions[5];
  const idx = st.storyIndex % comp.stories.length;
  st.storyIndex++;
  return {
    place: "旅途 · 营火旁",
    text: function(){
      const arr = [];
      arr.push("篝火噼啪作响，火星在夜空中飞舞，像一群小小的萤火虫。");
      arr.push(comp.name+"往火里添了根柴，然后开始讲故事。");
      arr.push(comp.stories[idx]);
      arr.push("故事讲完了，你们都沉默了一会儿。篝火的光映在脸上，明明灭灭。");
      return arr;
    },
    options: [
      { t:"准备守夜", go:"slow_travel_night" },
      { t:"也讲一个你的故事", effect:{time:0}, go:"slow_travel_night",
        tier:{ ok:["你讲了一个自己的故事，"+comp.name+"听完后拍了拍你的肩膀。「我们都是有故事的人。」他说。"] } },
      { t:"在篝火边冥想", check:{a:"SPR", label:"冥想"}, go:"slow_travel_night", fail:"slow_travel_night",
        tier:{ crit:["你在篝火旁入定，感到周围的元素在向你聚集。你的精神力得到了提升。"], ok:["你静坐了一会儿，感到内心平静了许多。"], fail:["你试着冥想，但蚊子和寒冷让你无法集中精神。"], critfail:["你冥想的时候睡着了，头差点栽进篝火里。"] } }
    ]
  };
};

N["slow_travel_reflect"] = function(){
  const st = S.slowTravel;
  return {
    place: "旅途 · 独处",
    text: function(){
      const arr = [];
      arr.push("你一个人坐在篝火边，旅伴已经睡了。");
      arr.push("你开始回想这一路的经历——遇到的人、看到的事、做过的选择。");
      const reflections = [
        "你想起了出发前的那个清晨，那时候你还不知道这趟旅程会把你带到哪里。现在你依然不知道，但你已经不再害怕了。",
        "你想起了一个在路上遇到的人，他的脸已经模糊了，但他说的一句话你还记得。那句话是什么来着？你想了很久，终于想起来了，然后笑了。",
        "你问自己：我为什么要走这条路？答案有很多，但没有一个是完全正确的。也许这就是答案——不是所有问题都需要答案。",
        "你看着自己的手，这双手做过很多事——帮助过别人，也伤害过别人。你不知道它们最终会变成什么样，但你知道，每一个选择都在塑造你。",
        "夜很深了，你感到一种奇怪的平静。不管明天会遇到什么，至少此刻，你是自由的。"
      ];
      arr.push(pickV(reflections, "st_reflect_"+st.day));
      return arr;
    },
    options: [
      { t:"准备守夜", go:"slow_travel_night" },
      { t:"写日记", effect:{time:0}, go:"slow_travel_night",
        tier:{ ok:["你拿出本子，把今天的经历写了下来。笔尖在纸上沙沙作响，像是在和另一个自己对话。"] } }
    ]
  };
};

// 延迟初始化 - 等待引擎函数加载后再覆写
function _v22_ae_init(){
  if(typeof writeNext === 'undefined' || typeof showOptions === 'undefined'){
    setTimeout(_v22_ae_init, 50);
    return;
  }
  // 覆写showOptions - 在显示选项前渲染感官和内心声音
  const _v22_orig_showOptions = showOptions;
  showOptions = function(node){
    try{
      if(node && node.senses !== false){
        renderSenses();
        if(Math.random() < 0.35) renderVoices();
      }
    }catch(e){}
    _v22_orig_showOptions(node);
  };
  console.log("[v22 ae] 感官+思想内阁钩子已接入引擎");
}
_v22_ae_init();

// v22 CSS注入
const v22_css = document.createElement("style");
v22_css.textContent = `
.sense { color: #8b9dc3; font-style: italic; border-left: 2px solid #4a5568; padding-left: 10px; margin: 8px 0; font-size: 0.92em; }
.perception { color: #6b8e23; font-size: 0.88em; margin: 6px 0; padding-left: 8px; border-left: 2px solid #6b8e23; }
.perception.low { color: #cd853f; border-left-color: #cd853f; }
.injury-narr { color: #b22222; font-style: italic; font-size: 0.9em; margin: 8px 0; }
.inner-voice { color: #9370db; font-size: 0.9em; margin: 6px 0; padding: 4px 8px; background: rgba(147,112,219,0.06); border-radius: 4px; }
.inner-voice .voice-name { font-weight: bold; font-style: normal; }
`;
document.head.appendChild(v22_css);

console.log("[v22 ae] 感官沉浸+思想内阁+慢旅行系统已加载");


/* ============================================================
   v22 方向二：NPC内心世界（思想与秘密层）
   ============================================================ */
const NPC_INNER_WORLD = {
  // 墨丘利
  mercury: {
    name: "墨丘利",
    surface: "艾尔达魔法学院灵魂魔法教授，前守望者执灯人。温和、睿智、偶尔走神。",
    hidden: "他在寻找塞拉芬被封印的真正原因，以及守望者内部那场大分裂的真相。",
    secret: "塞拉芬的封印有他的一份责任——他当年选择了沉默，而这个选择折磨了他三百年。",
    mood: "melancholy",
    lies: ["塞拉芬是自愿被封印的。","守望者从来没有分裂过。","我只是个普通的教授。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的眼神在提到守望者时会闪烁一下，很快恢复正常。" },
      observe: { attr:"INT", unlock:"你注意到他的办公室里有一面墙全是关于黄林晶时代的书，而且有几本被翻得卷了边。" },
      pressure: { attr:"CHA", unlock:"如果你直接问塞拉芬的事，他会沉默很久，然后说：「有些事，知道了反而痛苦。」" },
      empathy: { attr:"CHA", unlock:"如果你表达对他的理解，他会给你讲一个关于三百年前的故事——关于一个选择，和一个永远无法弥补的遗憾。" }
    }
  },
  // 奥雷利安
  aurelian: {
    name: "奥雷利安",
    surface: "守望者首席，半神级强者，看起来像个普通的老人。",
    hidden: "他知道七印的真相——七印不是封印深渊，是在喂养原初之物。他选择了沉默，因为真相会摧毁所有人的信仰。",
    secret: "他就是黄林晶本人——或者说，是黄林晶留下的一缕意识，承载着三千年的记忆和悔恨。",
    mood: "weary",
    lies: ["黄林晶已经死了。","七印是用来封印深渊的。","我只是个活了很久的老人。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的存在本身就让你感到一种古老的气息，像一本翻了三千年的书。" },
      observe: { attr:"INT", unlock:"你注意到他的手指上有一个古老的戒指，上面的符文和七印上的一模一样。" },
      pressure: { attr:"CHA", unlock:"如果你逼问七印的真相，他会看着你，眼神里有悲伤：「你确定要知道吗？知道了就再也回不去了。」" },
      empathy: { attr:"CHA", unlock:"如果你表达对孤独的理解，他会给你讲三千年的故事——关于一个人如何看着所有他认识的人死去，然后继续活着。" }
    }
  },
  // 塞西莉亚（同学）
  cecilia: {
    name: "塞西莉亚",
    surface: "艾尔达魔法学院的天才学生，贵族出身，骄傲但善良。",
    hidden: "她的家族是暗蚀会的秘密资助者，她发现了真相但不知道该怎么办。",
    secret: "她的哥哥已经加入了暗蚀会，而她可能是唯一能把他拉回来的人。",
    mood: "conflicted",
    lies: ["我家只是普通的商人家庭。","我不认识什么暗蚀会的人。","我哥哥在南方做生意。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"她在提到家人时会不自觉地握紧拳头，然后很快松开。" },
      observe: { attr:"INT", unlock:"你注意到她的随身物品里有一枚徽章，上面的图案和暗蚀会的标志很像——但她总是把它藏在衣服里面。" },
      pressure: { attr:"CHA", unlock:"如果你直接问她家族的事，她会生气地走开，但第二天会偷偷塞给你一张纸条——上面写着一个地址。" },
      empathy: { attr:"CHA", unlock:"如果你让她知道你可以信任，她会哭着告诉你一切——关于她的家族、她的哥哥、和她不知道该站在哪一边的痛苦。" }
    }
  },
  // 亚历山大
  alexander: {
    name: "亚历山大",
    surface: "金秤家族的养子，精明的商人，美第奇家族的商业对手。",
    hidden: "他知道主角的真实身份（如果是美第奇线），并且一直在暗中保护——或者监视。",
    secret: "他爱上了主角的母亲，但她选择了洛伦佐。这份感情他藏了二十年。",
    mood: "ambivalent",
    lies: ["我只是个商人。","我不认识什么美第奇家族。","一切都是为了利益。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他看你的眼神很复杂，不像看一个陌生人，倒像看一个等待了很久的人。" },
      observe: { attr:"INT", unlock:"他的办公室里有一幅画，画的是一个女人——如果你是美第奇线，你会认出那是你的母亲。" },
      pressure: { attr:"CHA", unlock:"如果你逼问他的真实目的，他会冷笑：「你以为你知道的就是全部？年轻人，你什么都不知道。」" },
      empathy: { attr:"CHA", unlock:"如果你和他聊起失去的人，他会沉默很久，然后说：「有些感情，藏了二十年，就变成了习惯。」" }
    }
  },
  // 精灵女王艾萨拉
  aisara: {
    name: "艾萨拉",
    surface: "精灵王国的女王，半神级强者，美丽而威严。",
    hidden: "她知道第三印的真相——世界树的根须正在枯萎，因为七印在吸食世界的生命力。",
    secret: "她和黄林晶有过一个约定——如果七印的真相被揭露，精灵王国将第一个站出来支持解放原初之物。但她还没有准备好。",
    mood: "pensive",
    lies: ["世界树很健康。","第三印很稳固。","黄林晶只是一个传说中的人物。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"她的身上有一种古老的悲伤，像秋天的第一片落叶。" },
      observe: { attr:"INT", unlock:"你注意到世界树的叶子比正常的黄得早，而且女王的视线总是不自觉地飘向树根的方向。" },
      pressure: { attr:"CHA", unlock:"如果你问她世界树的状况，她会用一种你看不透的眼神看着你：「精灵的寿命很长，长到可以看着一棵树死去，然后假装它还活着。」" },
      empathy: { attr:"CHA", unlock:"如果你表达对漫长生命的理解，她会给你讲她和黄林晶的故事——关于一个承诺，和三千年的等待。" }
    }
  },
  // 矮人王索林
  thorin: {
    name: "索林",
    surface: "矮人王国的国王，传奇战士，豪爽但固执。",
    hidden: "第四印的熔炉心正在冷却，因为矮人的开采已经接近了印的核心。他知道但不能停——停了矮人就完了。",
    secret: "他的父亲就是因为试图封闭深层矿脉而被自己的弟弟推翻的。他不想重蹈覆辙，但也知道继续开采的后果。",
    mood: "tormented",
    lies: ["熔炉心很稳定。","矮人的矿脉还能挖一千年。","我父亲是病逝的。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的笑声很响亮，但你能听出里面的疲惫——像一座快要撑不住的山。" },
      observe: { attr:"INT", unlock:"你注意到他的王座后面有一扇紧锁的门，门上的符文和七印的一样。而且他从不允许任何人靠近那扇门。" },
      pressure: { attr:"CHA", unlock:"如果你问他深层矿脉的事，他会猛地拍桌子：「矮人有矮人的难处！你们这些地面上的人懂什么！」然后他会道歉，给自己倒一杯酒。" },
      empathy: { attr:"CHA", unlock:"如果你和他聊起父亲和责任，他会喝很多酒，然后给你讲他父亲的故事——关于一个选择，和一个永远无法原谅自己的儿子。" }
    }
  },
  // 兽人萨满
  shaman: {
    name: "古骨",
    surface: "兽人部落的大萨满，年迈而神秘，能与祖先对话。",
    hidden: "第二印正在松动，因为兽人的萨满一代代地用生命维持它，而现在已经没有足够的萨满了。",
    secret: "他知道兽人打碎第一印的真相——不是侵略，是因为第一印的守护者已经疯了，在吸食兽人部落的生命力。",
    mood: "resigned",
    lies: ["第一印是兽人打碎的，因为我们好战。","第二印很稳固。","祖先的灵魂很安宁。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的身上有一股死亡的气息——不是腐朽，是一种和死者共处了太久的平静。" },
      observe: { attr:"INT", unlock:"你注意到他的帐篷里挂满了头骨，每个头骨上都刻着符文。而且他的手在发抖——不是因为老，是因为维持第二印的消耗。" },
      pressure: { attr:"CHA", unlock:"如果你问他第一印的真相，他会沉默很久，然后说：「历史是胜利者写的。兽人是胜利者吗？不是。所以你听到的版本，是别人想让你听到的。」" },
      empathy: { attr:"CHA", unlock:"如果你表达对牺牲的理解，他会给你讲兽人世代守护第二印的故事——关于一代代萨满用生命换来的和平，和一个正在到来的终结。" }
    }
  },
  // 红衣主教本尼迪克特
  benedict: {
    name: "本尼迪克特",
    surface: "光明教会的红衣主教，圣光神学院的实际掌控者，威严而虔诚。",
    hidden: "他知道净化令的真相——不是为了清除异端，是为了找到黄林晶留下的某样东西。",
    secret: "他年轻的时候曾经接触过深渊，并且被它诱惑过。他花了五十年用虔诚来掩盖那个秘密，但它还在。",
    mood: "conflicted",
    lies: ["净化令是神的旨意。","教会从来没有秘密。","我一生都在侍奉光明。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的虔诚很真实，但你能感觉到那层虔诚下面有东西——像冰山下的暗流。" },
      observe: { attr:"INT", unlock:"你注意到他的卧室里有一个上了锁的箱子，箱子上的封印是教会的高级封印。而且他每天都会在箱子前站一会儿。" },
      pressure: { attr:"CHA", unlock:"如果你问他净化令的真正目的，他会用一种冰冷的眼神看着你：「年轻人，有些事不是你该问的。教会的决定不需要向你解释。」" },
      empathy: { attr:"CHA", unlock:"如果你和他聊起信仰和怀疑，他会给你讲他年轻时候的故事——关于一次接触，和五十年的自我惩罚。" }
    }
  },
  // 暗蚀会接触人
  eclipse_contact: {
    name: "「乌鸦」",
    surface: "一个在自由城邦活动的神秘商人，据说什么都能买到。",
    hidden: "他是暗蚀会情报司的外围成员，负责在交汇城收集信息和招募新人。",
    secret: "他加入暗蚀会是为了给被教会害死的妹妹报仇。但他已经开始怀疑，暗蚀会是不是另一个教会。",
    mood: "cynical",
    lies: ["我只是个商人。","暗蚀会？那是教会编出来吓唬人的。","我没有妹妹。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的笑容很职业，但你能感觉到那不是真正的快乐——是一种用了太久的面具。" },
      observe: { attr:"INT", unlock:"你注意到他的商品里有一些不该出现在普通商店的东西——教会的禁书、深渊的物品、守望者的密信副本。" },
      pressure: { attr:"CHA", unlock:"如果你直接问他暗蚀会的事，他会收起笑容：「你知道得太多了。不过——也许这正是我想找你的原因。」" },
      empathy: { attr:"CHA", unlock:"如果你和他聊起失去的亲人，他会沉默很久，然后给你看一枚小女孩的发夹：「这是我妹妹的。她死的时候才十二岁。」" }
    }
  },
  // 承天书院玄机子
  xuanji: {
    name: "玄机子",
    surface: "承天书院的山长，半神级强者，东方隐士团的领袖，仙风道骨。",
    hidden: "他知道第六印时光裂隙的真相——那不是封印，是黄林晶留下的后门，用来在必要时回到过去修正错误。",
    secret: "他是黄林晶的隔代传人，知道黄林晶还活着（以奥雷利安的形式），并且一直在等待黄林晶做出最终的选择。",
    mood: "enigmatic",
    lies: ["我只是个教书先生。","时光裂隙是自然形成的。","黄林晶是三千年前的人了。"],
    dialogueApproaches: {
      probe: { attr:"SPR", unlock:"他的存在让你感到一种时间的错乱——好像他同时存在于过去、现在和未来。" },
      observe: { attr:"INT", unlock:"你注意到他的书房里有一些不可能存在的东西——还没发生的事件的记录、还没出生的人的名字、以及一面能看到其他时间线的镜子。" },
      pressure: { attr:"CHA", unlock:"如果你问他时光裂隙的事，他会笑：「时间是一条河，但有人在河里建了水坝。你想知道水坝后面是什么吗？」" },
      empathy: { attr:"CHA", unlock:"如果你表达对命运的困惑，他会给你讲黄林晶的故事——关于一个人如何试图修正所有错误，却发现每一个修正都制造了新的错误。" }
    }
  }
};

// NPC对话四方式系统
function npcDialogue(npcId, approach){
  try{
    const npc = NPC_INNER_WORLD[npcId];
    if(!npc) return null;
    const app = npc.dialogueApproaches[approach];
    if(!app) return null;
    return { attr: app.attr, unlock: app.unlock, npc: npc };
  }catch(e){ return null; }
}

// NPC情绪状态影响对话
function npcMoodModifier(npcId){
  try{
    const npc = NPC_INNER_WORLD[npcId];
    if(!npc) return 0;
    const moods = { melancholy:-5, weary:-3, conflicted:-8, ambivalent:0, pensive:-2, tormented:-10, resigned:-5, cynical:-5, enigmatic:0 };
    return moods[npc.mood] || 0;
  }catch(e){ return 0; }
}

/* ============================================================
   v22 方向六：传闻与谣言系统（信息生态层）
   ============================================================ */
const RUMOR_SYSTEM = {
  cities: {
    jiaohui: [
      { id:"rumor_medici_1", text:"听说美第奇家族的继承人失踪了，家族内部正在秘密寻找。", truth:0.7, source:"酒馆低语", related:"medici" },
      { id:"rumor_eclipse_1", text:"最近城里多了很多生面孔，有人说是暗蚀会在招人。", truth:0.6, source:"市场传闻", related:"eclipse" },
      { id:"rumor_war_1", text:"铁门关那边又打起来了，听说死了很多人。", truth:0.9, source:"路人对话", related:"war" },
      { id:"rumor_seal_1", text:"你知道吗？七印其实不是封印深渊的，是别的什么东西。", truth:0.3, source:"疯子的胡言乱语", related:"seal" },
      { id:"rumor_mercury_1", text:"墨丘利教授最近总是一个人待在研究室里，不知道在研究什么。", truth:0.8, source:"学生八卦", related:"mercury" },
      { id:"rumor_church_1", text:"教会的净化令越来越严了，昨天又有人被抓走了。", truth:0.9, source:"告示板", related:"church" },
      { id:"rumor_trade_1", text:"银穗商路不太平，最近有好几支商队被劫了。", truth:0.7, source:"商人抱怨", related:"trade" },
      { id:"rumor_hlj_1", text:"黄林晶其实没死，有人说在承天山见过他。", truth:0.2, source:"游吟诗人的歌", related:"hlj" },
      { id:"rumor_abyss_1", text:"最近城里有人做噩梦，一模一样的噩梦——你说邪门不邪门？", truth:0.6, source:"酒馆传闻", related:"abyss" },
      { id:"rumor_academy_1", text:"魔法学院有学生失踪了，学校压着不让说。", truth:0.8, source:"学生窃窃私语", related:"academy" }
    ],
    holy: [
      { id:"rumor_pope_1", text:"教皇的身体越来越差了，红衣主教们已经在暗中站队了。", truth:0.7, source:"神职人员八卦", related:"church" },
      { id:"rumor_purge_1", text:"净化令是假的，教会只是想找某样东西。", truth:0.4, source:"异端的话", related:"church" },
      { id:"rumor_knight_1", text:"审判骑士团最近在招募新人，待遇很好，但没人知道他们真正在做什么。", truth:0.8, source:"招募告示", related:"church" },
      { id:"rumor_saint_1", text:"有人说在圣城见过神迹——一个盲人重见光明了。", truth:0.3, source:"朝圣者的话", related:"church" },
      { id:"rumor_heretic_1", text:"城里藏着一个异端组织，专门营救被教会追捕的人。", truth:0.6, source:"地下传闻", related:"church" }
    ],
    ironpeak: [
      { id:"rumor_dwarf_1", text:"深层矿脉出事了，有矿工说在下面看到了不该看到的东西。", truth:0.7, source:"矿工酒后吐真言", related:"dwarf" },
      { id:"rumor_forge_1", text:"永恒熔炉的火比以前小了，矮人们都很担心。", truth:0.8, source:"铁匠的观察", related:"dwarf" },
      { id:"rumor_king_1", text:"矮人王最近脾气很差，有人说他在和议会吵架。", truth:0.9, source:"矮人平民", related:"dwarf" },
      { id:"rumor_gold_1", text:"矮人发现了一条新的金矿脉，但国王封锁了消息。", truth:0.5, source:"商人猜测", related:"dwarf" }
    ],
    silverleaf: [
      { id:"rumor_elf_1", text:"世界树的叶子黄得比往年早，精灵们都很不安。", truth:0.9, source:"旅行者的观察", related:"elf" },
      { id:"rumor_queen_1", text:"精灵女王最近很少露面，有人说她在世界树根部待了好几天。", truth:0.8, source:"精灵守卫", related:"elf" },
      { id:"rumor_elf_human_1", text:"精灵对人类越来越不友好了，边境上已经发生了几起冲突。", truth:0.6, source:"商人传闻", related:"elf" }
    ],
    ironpass: [
      { id:"rumor_battle_1", text:"铁门关的废墟里闹鬼，晚上能听到死人在说话。", truth:0.4, source:"逃难者的话", related:"war" },
      { id:"rumor_orc_1", text:"兽人没有撤远，他们在草原上集结，可能还要打。", truth:0.7, source:"斥候报告", related:"orc" },
      { id:"rumor_seal_1", text:"第一印碎了之后，附近的庄稼都长不好了，你说邪门不邪门？", truth:0.8, source:"农夫抱怨", related:"seal" }
    ],
    desert: [
      { id:"rumor_desert_1", text:"沙漠深处有一座城市，进去的人没有一个出来的。", truth:0.6, source:"旅者传说", related:"abyss" },
      { id:"rumor_oasis_1", text:"沙漠里的绿洲会移动，今天在这里，明天就没了。", truth:0.3, source:"骆驼商队", related:"desert" },
      { id:"rumor_temple_1", text:"深渊神殿不是传说，有人说亲眼见过——在沙漠最深处。", truth:0.5, source:"疯子的话", related:"abyss" }
    ],
    orc: [
      { id:"rumor_orc_1", text:"大萨满的身体越来越差了，部落里的年轻人在争论要不要继续守着第二印。", truth:0.8, source:"兽人内部", related:"orc" },
      { id:"rumor_orc_war_1", text:"兽人部落要统一了，一个新的战神正在崛起。", truth:0.6, source:"草原传闻", related:"orc" },
      { id:"rumor_orc_human_1", text:"兽人不是天生好战，是第一印的守护者疯了，他们不得不打碎它。", truth:0.7, source:"萨满的话", related:"orc" }
    ],
    east: [
      { id:"rumor_time_1", text:"承天山的时光裂隙又扩大了，书院的学生说能看到过去的影像。", truth:0.7, source:"学生八卦", related:"time" },
      { id:"rumor_xuanji_1", text:"玄机子山长知道一些没人知道的事，他活了多久没人说得清。", truth:0.8, source:"书院传闻", related:"hlj" },
      { id:"rumor_east_politics_1", text:"东部王国的党争越来越激烈了，承天书院也被卷进去了。", truth:0.9, source:"官场消息", related:"east" }
    ]
  },
  // 传闻演变 - 同一个传闻在不同城市有不同版本
  evolution: {
    "rumor_medici_1": {
      jiaohui: "美第奇家族的继承人失踪了。",
      holy: "自由城邦有个大贵族的儿子丢了，据说是被暗蚀会绑了。",
      ironpeak: "人类的贵族真乱，儿子丢了都不敢声张。",
      silverleaf: "短命种的家族纷争，和我们没有关系。"
    }
  },
  // 玩家传说 - 玩家的行为会被编成故事流传
  playerLegends: [
    { trigger:"saved_city", text:"听说有个{job}一个人救了一整座城，真的假的？", exaggeration:2.0 },
    { trigger:"failed_mission", text:"那个{job}搞砸了一件大事，现在躲起来了。", exaggeration:1.5 },
    { trigger:"killed_boss", text:"有个{job}杀了一个传奇级的怪物，现在到处都在说他的名字。", exaggeration:1.8 }
  ]
};

// 传闻系统函数
function hearRumor(cityKey){
  try{
    const rumors = RUMOR_SYSTEM.cities[cityKey];
    if(!rumors) return null;
    const unheard = rumors.filter(r => !S.heardRumors || S.heardRumors.indexOf(r.id)===-1);
    const pool = unheard.length > 0 ? unheard : rumors;
    const rumor = pickV(pool, "rumor_"+cityKey);
    if(!S.heardRumors) S.heardRumors = [];
    if(S.heardRumors.indexOf(rumor.id)===-1) S.heardRumors.push(rumor.id);
    return rumor;
  }catch(e){ return null; }
}

// 拼凑真相 - 收集3+相关传闻解锁线索
function checkRumorClue(related){
  try{
    if(!S.heardRumors) return false;
    let count = 0;
    for(const cityKey in RUMOR_SYSTEM.cities){
      for(const r of RUMOR_SYSTEM.cities[cityKey]){
        if(r.related===related && S.heardRumors.indexOf(r.id)!==-1) count++;
      }
    }
    return count >= 3;
  }catch(e){ return false; }
}

/* ============================================================
   v22 方向七：信件与文献系统（文本考古层）
   ============================================================ */
const DOCUMENT_SYSTEM = {
  types: ["信件","日记","笔记","公文","诗歌","族谱","实验记录","军令","传单","告示"],
  documents: [
    {
      id:"doc_mercury_letter_1",
      type:"信件",
      title:"一封没有寄出的信",
      author:"墨丘利",
      date:"艾尔达历2987年·秋",
      content:"塞拉芬：\n\n我不知道你能不能看到这封信，也许永远不能。但我必须写下来，否则我会疯掉。\n\n三百年了。我每天都在想那天的事——你被带走的时候，我站在人群里，什么都没做。\n\n奥雷利安说这是必要的牺牲。我说不出话。\n\n如果有一天你能出来，请不要原谅我。\n\n墨丘利",
      related:"mercury",
      clue:"守望者大分裂的真相",
      location:"墨丘利的研究室"
    },
    {
      id:"doc_general_order_1",
      type:"军令",
      title:"铁门关守备军军令·第七号",
      author:"铁门关守将·霍夫曼",
      date:"艾尔达历2990年·春",
      content:"命令：\n\n一、即日起，铁门关守军进入一级战备。\n二、所有士兵不得擅自离开岗位。\n三、关于第一印附近的异常现象，所有士兵不得讨论、不得记录、不得传播。\n四、如有违反，以通敌论处。\n\n——霍夫曼\n\n（信纸边缘有被水浸过的痕迹，可能是眼泪。）",
      related:"seal",
      clue:"第一印碎之前的异常",
      location:"铁门关废墟"
    },
    {
      id:"doc_alchemy_notes_1",
      type:"实验记录",
      title:"炼金术实验笔记·贤者之石",
      author:"佚名",
      date:"艾尔达历2950年",
      content:"第三百七十二次实验。\n\n材料：启灵草×3、凝元丹×1、化意果×1、宗师心得×1。\n结果：失败。爆炸。损失了一间实验室和三根眉毛。\n\n问题出在哪里？贤者之石需要的不是材料，是某种……意志？或者说，是修炼者对「转化」的理解？\n\n黄林晶当年是怎么做到的？他的笔记里只写了四个字：「等价交换」。\n\n什么是等价？用什么交换什么？\n\n也许我需要去一趟承天山，看看玄机子知道些什么。",
      related:"alchemy",
      clue:"贤者之石的真正条件",
      location:"自由城邦·某废弃炼金工坊"
    },
    {
      id:"doc_family_letter_1",
      type:"信件",
      title:"给儿子的信",
      author:"伊莎贝拉·金秤",
      date:"艾尔达历2980年",
      content:"我的孩子：\n\n当你读到这封信的时候，我可能已经不在了。\n\n有些事我必须告诉你。你的父亲不是普通人，他做了一个选择，一个我们都付出了代价的选择。\n\n不要去找他。不要相信任何自称是你父亲朋友的人。\n\n但如果你遇到了一个叫亚历山大的人——听他说完，然后自己做决定。\n\n妈妈爱你。永远。\n\n伊莎贝拉",
      related:"medici",
      clue:"主角身世线索",
      location:"需要特定条件获得"
    },
    {
      id:"doc_church_decree_1",
      type:"公文",
      title:"光明教会·净化令第七号修正案",
      author:"红衣主教团",
      date:"艾尔达历2995年",
      content:"鉴于近期异端活动日益猖獗，红衣主教团一致通过以下修正案：\n\n一、灵魂魔法使用者视为潜在异端，可不经审判直接逮捕。\n二、任何持有深渊相关文献者，以同谋论处。\n三、各教区须每月上报异端清查情况。\n四、本修正案自发布之日起生效。\n\n（文件底部有一个手写的批注，字迹潦草：「他们在找的不是异端，是那样东西。——B」）",
      related:"church",
      clue:"净化令的真正目的",
      location:"圣城·教会档案室"
    },
    {
      id:"doc_dwarf_journal_1",
      type:"日记",
      title:"矿工日记·深层矿脉的最后一天",
      author:"矮人矿工·铁掌",
      date:"艾尔达历2993年·冬",
      content:"第一百二十天。\n\n我们挖到了。那扇门。\n\n门上的符文和熔炉心上的一模一样。工头说不许靠近，但我看到了——门在发光，从里面。\n\n晚上我做了个梦。梦里有个声音在说话，它说它很饿。\n\n明天我要请假。我不想再下去了。\n\n（日记到这里就断了，最后一页有干涸的血迹。）",
      related:"dwarf",
      clue:"第四印的真相",
      location:"铁峰堡·矿工宿舍"
    },
    {
      id:"doc_elf_poem_1",
      type:"诗歌",
      title:"世界树的哀歌",
      author:"佚名精灵诗人",
      date:"不详",
      content:"世界树啊世界树，\n你的根须伸向何方？\n三千年的沉默，\n三千年的喂养。\n\n我们用歌声安抚你，\n用生命浇灌你，\n但你在枯萎，\n我们都知道。\n\n那个约定还作数吗？\n那个背着光的人，\n还会回来吗？\n\n——写于世界树第一次落叶的那天",
      related:"elf",
      clue:"第三印与黄林晶的约定",
      location:"银叶学院·图书馆"
    },
    {
      id:"doc_orc_shaman_1",
      type:"笔记",
      title:"萨满传承笔记·第二印",
      author:"历代大萨满",
      date:"代代相传",
      content:"第二印。愤怒。\n\n我们的祖先用生命把它封住，一代又一代。\n\n每一代大萨满在死前，都会把印的力量传给下一代。这个过程很痛苦——你能感觉到它在你体内挣扎，像一头被困住的野兽。\n\n但我们必须这么做。因为如果第二印碎了，愤怒会吞噬整个草原。\n\n第一印碎了。我们都感觉到了。那股饥饿的气息。\n\n我们还能撑多久？我不知道。\n\n但我知道，第一印不是兽人打碎的——是它自己碎的。守护者疯了，在吸食我们的生命力。我们只是……帮了它一把。\n\n不要告诉人类。他们不会理解的。",
      related:"orc",
      clue:"第二印和第一印的真相",
      location:"兽人王庭·萨满帐篷"
    },
    {
      id:"doc_eclipse_note_1",
      type:"笔记",
      title:"暗蚀会·情报司密档",
      author:"「乌鸦」",
      date:"艾尔达历2998年",
      content:"目标：交汇城。\n\n任务：收集关于七印的一切信息。\n\n进展：\n1. 墨丘利在研究守望者的历史，可能知道些什么。\n2. 魔法学院地下有异常的魔法波动，需要进一步调查。\n3. 美第奇家族的继承人失踪案，可能和某样东西有关。\n4. 教会的净化令比表面看起来复杂，他们在找某样特定的东西。\n\n备注：教主对七印的兴趣越来越大了。他说「时候快到了」。\n我不知道这意味着什么，但我不喜欢。\n\n——乌鸦",
      related:"eclipse",
      clue:"暗蚀会的真正目标",
      location:"需要暗蚀会线获得"
    },
    {
      id:"doc_hlj_research_1",
      type:"笔记",
      title:"黄林晶研究笔记·第七印",
      author:"黄林晶（疑似）",
      date:"三千年前",
      content:"第七印。色欲。\n\n这是最危险的一个。不是因为它最强，而是因为它最容易被误解。\n\n人们以为色欲是欲望、是享乐、是堕落。不是的。\n\n色欲是「渴望」。对生命的渴望、对力量的渴望、对爱的渴望、对存在的渴望。\n\n它不是恶。它是生命本身。\n\n七印不是在封印邪恶。七印是在分割生命。\n\n我知道这一点，但我还是做了。因为如果不分割，原初之物会吞噬一切。\n\n但三千年了。我开始怀疑，分割本身是不是另一种恶。\n\n如果有一天有人读到这些——请替我做出选择。\n\n黄林晶",
      related:"seal",
      clue:"七印的终极真相",
      location:"需要集齐线索后获得"
    }
  ]
};

// 文献收集函数
function collectDocument(docId){
  try{
    if(!S.collectedDocuments) S.collectedDocuments = [];
    if(S.collectedDocuments.indexOf(docId)===-1){
      S.collectedDocuments.push(docId);
      return true;
    }
    return false;
  }catch(e){ return false; }
}

// 文献关联分析
function analyzeDocumentRelations(){
  try{
    if(!S.collectedDocuments) return [];
    const relations = [];
    const docs = DOCUMENT_SYSTEM.documents.filter(d => S.collectedDocuments.indexOf(d.id)!==-1);
    // 按related字段分组
    const groups = {};
    for(const d of docs){
      if(!groups[d.related]) groups[d.related] = [];
      groups[d.related].push(d);
    }
    for(const key in groups){
      if(groups[key].length >= 2){
        relations.push({ topic:key, docs:groups[key].map(d=>d.title), insight:"你拼凑出了关于「"+key+"」的更多线索。" });
      }
    }
    return relations;
  }catch(e){ return []; }
}

/* ============================================================
   v22 方向十二：认知与知识系统
   ============================================================ */
const KNOWLEDGE_SYSTEM = {
  domains: {
    history: { name:"历史", desc:"艾尔达大陆的历史知识", sources:["书籍","老人讲述","遗迹"] },
    geography: { name:"地理", desc:"大陆的地理和城市知识", sources:["旅行","地图","当地人"] },
    magic: { name:"魔法", desc:"魔法理论和学派知识", sources:["学院","书籍","实践"] },
    religion: { name:"宗教", desc:"各大神系和教会知识", sources:["教会","神殿","信徒"] },
    politics: { name:"政治", desc:"八大势力的政治格局", sources:["官场","商人","密探"] },
    race: { name:"种族", desc:"各民族的文化和习俗", sources:["旅行","交流","观察"] },
    abyss: { name:"深渊", desc:"深渊和邪神的知识（危险）", sources:["禁书","遗迹","接触"] },
    hlj: { name:"黄林晶", desc:"关于黄林晶的一切（稀有）", sources:["遗迹","文献","知情人"] }
  },
  // 认知盲区 - 不同种族/职业的知识盲区
  blindspots: {
    "人类": ["精灵时间感","矮人地底文化","兽人祖先崇拜"],
    "精灵": ["人类政治","矮人锻造技术","兽人战争文化"],
    "矮人": ["精灵自然魔法","人类宗教","兽人萨满传统"],
    "兽人": ["人类学术","精灵艺术","矮人工程学"]
  },
  // 知识层级 - 普通人版本 vs 学者版本 vs 真相
  knowledgeLevels: {
    "七印": {
      common: "七印是黄林晶用来封印深渊的七道封印，保护着大陆的安全。",
      scholar: "七印分别位于大陆的七个关键点，每一道封印都对应一种原初之物。维持封印需要持续的力量输入。",
      truth: "七印不是封印深渊，是分割并喂养原初之物。黄林晶用符文让它们沉睡，但它们正在醒来。七印在慢慢杀死世界。"
    },
    "黄林晶": {
      common: "黄林晶是三千年前的大英雄，他加固了七印，拯救了大陆，然后消失了。",
      scholar: "黄林晶是一个强大的魔法师和学者，他留下了十二件神器和大量研究笔记。他的死因成谜。",
      truth: "黄林晶没有死。他以奥雷利安的身份活着，承载着三千年的记忆和悔恨。他知道七印的真相，但选择了沉默。"
    },
    "暗蚀会": {
      common: "暗蚀会是一个崇拜深渊的邪恶组织，到处搞破坏。",
      scholar: "暗蚀会分为五个部门，有严密的组织架构。他们的目标似乎和七印有关。",
      truth: "暗蚀会的最终目标不是毁灭世界，是解放原初之物。他们中的一些人知道七印的真相，认为解放是唯一的出路。"
    }
  }
};

// 知识获取函数
function gainKnowledge(domain, amount){
  try{
    if(!S.knowledge) S.knowledge = {};
    if(!S.knowledge[domain]) S.knowledge[domain] = 0;
    S.knowledge[domain] = Math.min(100, S.knowledge[domain] + amount);
    return S.knowledge[domain];
  }catch(e){ return 0; }
}

// 知识检查 - 影响场景描述和对话选项
function knowledgeCheck(domain, threshold){
  try{
    if(!S.knowledge) return false;
    return (S.knowledge[domain]||0) >= threshold;
  }catch(e){ return false; }
}

// 获取知识层级描述
function getKnowledgeLevel(topic){
  try{
    const kl = KNOWLEDGE_SYSTEM.knowledgeLevels[topic];
    if(!kl) return null;
    // 根据相关知识领域的等级决定返回哪个层级
    let level = "common";
    if(knowledgeCheck("history",60) || knowledgeCheck("hlj",40)) level = "scholar";
    if(knowledgeCheck("hlj",80) || knowledgeCheck("abyss",60)) level = "truth";
    return kl[level];
  }catch(e){ return null; }
}

// 危险知识 - 了解深渊真相降SAN
function dangerousKnowledge(domain, amount, sanLoss){
  try{
    gainKnowledge(domain, amount);
    if(sanLoss){ S.san = Math.max(0, S.san - sanLoss); }
  }catch(e){}
}

/* ============================================================
   v22 af卷节点 - 传闻打听 + 文献阅读 + NPC深度对话
   ============================================================ */
N["rumor_mill"] = function(){
  const cityKey = senseCityKey(S.loc) || "jiaohui";
  const rumor = hearRumor(cityKey);
  return {
    place: S.loc + " · 传闻",
    text: function(){
      const arr = [];
      if(rumor){
        arr.push("你在"+rumor.source+"中听到了一段传闻：");
        arr.push("「"+rumor.text+"」");
        arr.push("你不确定这是不是真的。但每一个传闻都有它的来源——也许是真相的碎片，也许是恐惧的投射，也许是有人故意散布的。");
      } else {
        arr.push("你打听了一圈，但没有听到什么新鲜事。该知道的你都知道了。");
      }
      return arr;
    },
    options: [
      { t:"继续打听", go:"rumor_mill" },
      { t:"记录在日志里", effect:{time:0}, go:"fc_jiaohui_entry",
        tier:{ ok:["你把这段传闻记在了心里。也许以后会有用。"] } },
      { t:"离开", go:"fc_jiaohui_entry" }
    ]
  };
};

N["document_read"] = function(){
  return {
    place: "文献阅读",
    text: function(){
      if(!S.collectedDocuments || S.collectedDocuments.length===0){
        return ["你还没有收集到任何文献。去探索这个世界吧，每一封信、每一本日记、每一份公文，都是某个人留下的声音。"];
      }
      const docs = DOCUMENT_SYSTEM.documents.filter(d => S.collectedDocuments.indexOf(d.id)!==-1);
      const arr = ["你整理了一下收集到的文献："];
      for(const d of docs){
        arr.push("【"+d.type+"】"+d.title+" —— "+d.author+"，"+d.date);
      }
      const relations = analyzeDocumentRelations();
      if(relations.length > 0){
        arr.push("");
        arr.push("你注意到一些文献之间有关联：");
        for(const r of relations){
          arr.push("· "+r.insight+"（涉及："+r.docs.join("、")+"）");
        }
      }
      return arr;
    },
    options: [
      { t:"返回", go:"fc_jiaohui_entry" }
    ]
  };
};

/* /v62inj:chunk-npc/ N["npc_deep_talk"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_deep_result"] 已移入 chunks/v62_npc.js */
// 知识面板
N["knowledge_panel"] = function(){
  return {
    place: "知识与认知",
    text: function(){
      const arr = ["你整理了一下自己对这个世界的认知："];
      for(const key in KNOWLEDGE_SYSTEM.domains){
        const d = KNOWLEDGE_SYSTEM.domains[key];
        const val = (S.knowledge && S.knowledge[key]) || 0;
        const level = val>=80?"精通":val>=50?"了解":val>=20?"略知":"无知";
        arr.push("· "+d.name+"："+level+"（"+val+"/100）—— "+d.desc);
      }
      arr.push("");
      arr.push("认知盲区：");
      const race = S.race || "人类";
      const bs = KNOWLEDGE_SYSTEM.blindspots[race] || [];
      for(const b of bs) arr.push("· "+b);
      arr.push("");
      arr.push("你知道得越多，就越意识到自己不知道的更多。");
      return arr;
    },
    options: [
      { t:"返回", go:"fc_jiaohui_entry" }
    ]
  };
};

console.log("[v22 af] NPC内心+传闻+文献+认知系统已加载");


/* ============================================================
   v22 方向五：地点记忆与重访变化
   ============================================================ */
const LOCATION_MEMORY = {
  // 每个地点的记忆和变化
  locations: {
    jiaohui: {
      name: "交汇城",
      firstVisit: "你第一次来到交汇城。这是一座建在银穗河交汇处的城市，嘈杂、繁忙、充满了各种气味和声音。自由城邦的心脏，大陆的十字路口。",
      revisit: ["你再次来到交汇城。和上次相比，{change}。", "交汇城还是老样子——但你知道，有些东西已经不一样了。{change}", "你站在城门口，想起上次离开时的心情。{change}"],
      changes: {
        war: "城门的守卫多了一倍，盘查也更严了。据说铁门关的战事吃紧。",
        purge: "街上多了很多审判骑士，人们走路都低着头，不敢大声说话。",
        trade_crisis: "集市上的摊位少了很多，物价涨了三成。商人们都在抱怨银穗商路不太平。",
        abyss: "城里的气氛很压抑，很多人说晚上做噩梦。教堂的忏悔室前排起了长队。"
      }
    },
    holy: {
      name: "圣城",
      firstVisit: "你第一次来到圣城。白色的大理石建筑在阳光下闪闪发光，大教堂的穹顶像要插入天空。空气中全是熏香的味道，信徒们默祷着。",
      revisit: ["圣城还是那样庄严。但你注意到{change}。", "你再次站在大教堂前，想起上次在这里的经历。{change}"],
      changes: {
        purge_intense: "净化令升级了，火刑柱上还留着灰烬。人们的眼神里有恐惧。",
        pope_ill: "听说教皇病重，红衣主教们都在暗中活动。大教堂的门比平时关得早了。",
        heresy: "城里出现了异端的涂鸦，教会正在大肆搜捕。"
      }
    },
    ironpeak: {
      name: "铁峰堡",
      firstVisit: "你第一次来到铁峰堡。巨大的堡垒嵌在山体里，铁锤声从早响到晚，空气中全是煤烟和铁水的味道。矮人的王国，坚固而炽热。",
      revisit: ["铁峰堡的铁锤声还是那样震耳欲聋。但{change}。", "你再次走进矮人要塞，熔炉的热气扑面而来。{change}"],
      changes: {
        mine_crisis: "深层矿脉被封了，矮人们议论纷纷。熔炉的火比以前小了。",
        king_conflict: "矮人王和议会吵得很厉害，街上的守卫都带着紧张的神情。",
        forge_cooling: "永恒熔炉的温度降了，矮人们都很担心，但没人敢公开说。"
      }
    },
    silverleaf: {
      name: "银叶城",
      firstVisit: "你第一次来到银叶城。巨大的世界树矗立在城市中央，阳光被树叶切碎了，在地面上投下流动的光斑。精灵们在树枝间穿梭，像一只只彩色的鸟。",
      revisit: ["世界树还是那样壮美。但你注意到{change}。", "你再次站在世界树下，精灵的歌声从枝头飘下来。{change}"],
      changes: {
        tree_withering: "世界树的叶子黄得比往年早，风一吹就掉一片。精灵们的眼神里有忧虑。",
        queen_gone: "精灵女王很久没公开露面了，长老会的人比平时多了很多。",
        human_tension: "精灵对人类的态度冷淡了很多，边境上据说发生了冲突。"
      }
    },
    ironpass: {
      name: "铁门关",
      firstVisit: "你第一次来到铁门关。废墟。到处都是废墟。烧焦的旗帜、半埋的铠甲、无人认领的鞋。风穿过破损的城墙，发出呜咽的声音，像在哭。",
      revisit: ["铁门关还是那样——废墟。但{change}。", "你再次站在这片废墟上，风中依然有焦土的味道。{change}"],
      changes: {
        snow: "下雪了。雪把废墟盖了起来，像一张白色的裹尸布。但有些地方雪是黑的——那是血浸透了土地。",
        looters: "有盗墓者在废墟里翻找，野狗在旁边等着。战争结束了，但掠夺还在继续。",
        ghosts: "当地人说晚上能听到废墟里有声音。没人敢在天黑后靠近。"
      }
    },
    desert: {
      name: "死亡沙漠",
      firstVisit: "你第一次踏入死亡沙漠。一望无际的金色沙丘，没有树，没有水，没有生命。太阳像一个巨大的熔炉，要把一切都融化。",
      revisit: ["沙漠还是那样——无情、广阔、沉默。{change}。", "你再次站在沙丘上，热风扑面而来。{change}"],
      changes: {
        sandstorm: "远处有沙暴在形成，一堵黄色的墙在缓慢移动。要抓紧时间。",
        mirage: "海市蜃楼比平时更清晰了，能看到一座城市的轮廓——也许那不是幻觉。",
        bones: "沙暴过后，露出了更多的白骨。有骆驼的，也有人的。"
      }
    }
  }
};

// 地点记忆函数
function visitLocation(locKey){
  try{
    if(!S.locationMemory) S.locationMemory = {};
    if(!S.locationMemory[locKey]){
      S.locationMemory[locKey] = { visitCount:1, firstVisitDate: (S.world&&S.world.totalDay)||0, events:[] };
      return "first";
    } else {
      S.locationMemory[locKey].visitCount++;
      return "revisit";
    }
  }catch(e){ return "first"; }
}

// 获取地点变化描述
function getLocationChange(locKey){
  try{
    const loc = LOCATION_MEMORY.locations[locKey];
    if(!loc) return "";
    // 根据世界状态选择变化
    const changes = [];
    if(S.flags && S.flags.war_intensified) changes.push(loc.changes.war);
    if(S.flags && S.flags.purge_intensified) changes.push(loc.changes.purge||loc.changes.purge_intense);
    if(S.flags && S.flags.trade_crisis) changes.push(loc.changes.trade_crisis);
    if(S.flags && S.flags.abyss_spread) changes.push(loc.changes.abyss);
    if(changes.length===0){
      // 默认变化
      const defaultChanges = ["街上多了一些新面孔。","天气和上次不一样了。","时间过去了，你也不一样了。"];
      return pickV(defaultChanges, "loc_change_default_"+locKey);
    }
    return pickV(changes, "loc_change_"+locKey);
  }catch(e){ return ""; }
}

// 渲染地点记忆
function renderLocationMemory(locKey){
  try{
    const loc = LOCATION_MEMORY.locations[locKey];
    if(!loc) return;
    const mem = S.locationMemory && S.locationMemory[locKey];
    if(!mem || mem.visitCount===1){
      // 首次访问
      const d = document.createElement("p");
      d.className = "location-memory first";
      d.innerHTML = rich(loc.firstVisit);
      storyEl.appendChild(d);
    } else {
      // 重访
      const template = pickV(loc.revisit, "loc_revisit_"+locKey+"_"+mem.visitCount);
      const change = getLocationChange(locKey);
      const text = template.replace("{change}", change);
      const d = document.createElement("p");
      d.className = "location-memory revisit";
      d.innerHTML = rich(text);
      storyEl.appendChild(d);
    }
  }catch(e){}
}

/* ============================================================
   v22 方向八：道德灰色地带（无善无恶叙事）
   ============================================================ */
const MORAL_SYSTEM = {
  // 灰色选择库
  grayChoices: [
    {
      id:"moral_refugee",
      title:"难民的请求",
      situation:"一个难民家庭拦住了你，他们饿了好几天了。但你身上的食物也只够自己吃到下一个城镇。",
      choices: [
        { text:"把食物分给他们一半", consequence:"你饿着肚子走了两天，但那个母亲看你的眼神，让你觉得值得。", karma:"compassion" },
        { text:"假装没看见，绕过去", consequence:"你听到身后孩子的哭声，但你没有回头。也许这就是生存。", karma:"selfpreserve" },
        { text:"给他们食物，但拿走他们身上值钱的东西", consequence:"你得到了一枚旧戒指，但那个父亲的眼神里有恨。你不确定自己做了什么。", karma:"exploit" },
        { text:"带他们去下一个城镇，但路上让他们干活", consequence:"他们感激你，但你知道这不是善意——这是交易。", karma:"transaction" }
      ]
    },
    {
      id:"moral_heretic",
      title:"被追捕的异端",
      situation:"审判骑士在追捕一个「异端」——一个会灵魂魔法的老人。他躲在你的住处，求你不要告发他。他说他只是想治好孙女的病。",
      choices: [
        { text:"把他藏起来，等风头过去", consequence:"你冒着被教会发现的风险保护了他。他的孙女活了下来。但你从此上了教会的观察名单。", karma:"protect" },
        { text:"告发他，领取赏金", consequence:"你得到了五十金龙。那天晚上，你听到远处火刑的声音。你没有去看。", karma:"betray" },
        { text:"告诉他赶紧走，但不提供帮助", consequence:"他连夜逃走了。你不知道他有没有被抓住。你睡得不太安稳。", karma:"neutral" },
        { text:"和他谈条件——教你灵魂魔法，你就帮他", consequence:"你学到了一些东西，但你知道这是勒索。他看你的眼神里有恐惧，也有恨。", karma:"exploit" }
      ]
    },
    {
      id:"moral_war_prisoner",
      title:"战俘",
      situation:"战争中你抓住了一个敌人士兵。他很年轻，可能还不到十八岁。他在哭，说他想回家。你的长官说「处理掉」。",
      choices: [
        { text:"放他走", consequence:"你违反了军令。那个年轻人跑了，边跑边哭。你的长官很生气，但你觉得你做了对的事——也许吧。", karma:"mercy" },
        { text:"执行命令", consequence:"你做了。他的眼睛到死都在看着你。那天晚上你没睡着。你告诉自己这是战争。", karma:"duty" },
        { text:"把他当奴隶卖掉", consequence:"你得到了一笔钱。但你偶尔会想起他被带走时的眼神。", karma:"exploit" },
        { text:"让他跑，但朝他的方向开一枪以示尽职", consequence:"他跑了，你的长官以为你尽力了。你觉得自己很聪明——也很肮脏。", karma:"coward" }
      ]
    },
    {
      id:"moral_family_secret",
      title:"家族的秘密",
      situation:"你发现了一个家族的秘密——这个家族一直在暗中资助暗蚀会。但这个家族也是你的恩人，他们在你最困难的时候帮过你。",
      choices: [
        { text:"揭发他们", consequence:"你报答了他们的恩情，用毁灭。他们被教会清洗了。你不知道这是正义还是背叛。", karma:"justice" },
        { text:"保持沉默", consequence:"你什么都没说。但你知道，他们资助的每一枚金币，都可能变成某个人的死亡。", karma:"silence" },
        { text:"私下找他们谈，劝他们收手", consequence:"他们很惊讶你知道了。族长沉默了很久，说「我们有我们的苦衷」。你不知道该不该信。", karma:"mediate" },
        { text:"用这个秘密勒索他们", consequence:"你得到了钱和权力。但你变成了你曾经最不齿的那种人。", karma:"blackmail" }
      ]
    },
    {
      id:"moral_cure",
      title:"治愈的代价",
      situation:"你找到了一种能治愈绝症的方法——但它需要牺牲一个无辜者的生命。你的亲人（或挚友）得了这种病，时日无多。",
      choices: [
        { text:"牺牲那个无辜者，救活亲人", consequence:"你的亲人活了下来。但你每天晚上都能听到那个无辜者的声音。你告诉自己这是值得的。是吗？", karma:"utilitarian" },
        { text:"放弃治疗，陪亲人走完最后一程", consequence:"你的亲人死了。你握着他的手，直到最后。你知道你做了「对」的事——但「对」不等于「不痛苦」。", karma:"principle" },
        { text:"寻找另一种方法，哪怕希望渺茫", consequence:"你花了三年时间，试了无数种方法。你的亲人在第二年去世了。你不知道如果当初选择牺牲，结果会不会不同。", karma:"search" },
        { text:"让亲人自己选择", consequence:"他选择了不牺牲别人。他走的时候很平静。你呢？你不知道自己是平静还是空虚。", karma:"respect" }
      ]
    }
  ],
  // 业力不是善恶值，是因果记录
  karmaTypes: {
    compassion: "慈悲", selfpreserve: "自保", exploit: "利用", transaction: "交易",
    protect: "守护", betray: "背叛", neutral: "中立", mercy: "仁慈",
    duty: "责任", justice: "正义", silence: "沉默", mediate: "调解",
    blackmail: "勒索", utilitarian: "功利", principle: "原则", search: "求索",
    respect: "尊重", coward: "怯懦"
  }
};

// 道德选择记录
function recordMoralChoice(choiceId, chosenIndex){
  try{
    if(!S.moralChoices) S.moralChoices = {};
    if(!S.karma) S.karma = {};
    const choice = MORAL_SYSTEM.grayChoices.find(c=>c.id===choiceId);
    if(!choice) return;
    const chosen = choice.choices[chosenIndex];
    S.moralChoices[choiceId] = chosenIndex;
    if(!S.karma[chosen.karma]) S.karma[chosen.karma] = 0;
    S.karma[chosen.karma]++;
  }catch(e){}
}

// 事后反思
function moralReflection(choiceId){
  try{
    const choice = MORAL_SYSTEM.grayChoices.find(c=>c.id===choiceId);
    if(!choice) return "";
    const reflections = [
      "你偶尔会想起那天的事。你做了选择，然后继续生活。但那个选择还在那里，像一根刺。",
      "你告诉自己你做了对的事。但在深夜里，你不确定「对」到底是什么意思。",
      "时间过去了，伤口结了疤。但你知道，有些选择是不会愈合的。",
      "你遇到了类似的情况，这次你做了不同的选择。人是会变的——或者说，人一直在变。"
    ];
    return pickV(reflections, "moral_reflect_"+choiceId);
  }catch(e){ return ""; }
}

/* ============================================================
   v22 方向九：日常与史诗交织（普通人视角看大陆）
   ============================================================ */
const DAILY_LIFE = {
  // 每个城市的日常节奏
  cities: {
    jiaohui: {
      morning: ["集市开了，小贩的叫卖声此起彼伏。面包房飘出麦香，鱼贩在大声吆喝着今天的 catch。","清晨的交汇城是忙碌的。人们匆匆走过，手里拿着早餐，脑子里想着今天的活计。","银穗河上的船开始了一天的工作，船夫的号子声远远传来。"],
      noon: ["正午的交汇城是最热的时候。人们躲进酒馆和茶馆，吃饭、喝酒、谈论八卦。","集市上人最多的时候。讨价还价的声音、孩子的哭声、狗叫声，汇成一片白噪音。","铁匠铺的锤声响了一上午，现在终于停了。铁匠们在吃午饭，大口喝酒，大声说笑。"],
      dusk: ["黄昏的交汇城是金色的。归巢的乌鸦从头顶飞过，酒馆的灯一盏盏亮起来。","人们结束了一天的工作，涌向酒馆和剧院。交汇城的夜生活开始了。","夕阳把银穗河染成橘红色，渔船陆续归港，码头又热闹起来。"],
      night: ["深夜的交汇城安静了下来。只有巡夜人的脚步声和偶尔的狗吠。","酒馆里还有人，但声音低了很多。有人在轻声哼歌，有人在独自喝酒。","月亮照在河面上，碎成一片银色的涟漪。交汇城睡着了。"]
    },
    holy: {
      morning: ["晨祷的钟声从大教堂传来，连绵不绝。信徒们聚集在广场上，轻声吟诵。","圣城的清晨是庄严的。修士们列队走向教堂，白袍在晨风中飘动。","熏香的味道从教堂里飘出来，甜腻而庄重。"],
      noon: ["正午的圣城是安静的。人们在午休，或者在教堂里祈祷。","广场上的朝圣者在吃干粮，喝水，然后继续祈祷。","神学院的学生们捧着书走过，讨论着经文的含义。"],
      dusk: ["晚祷的歌声响起，在渐暗的天空中回荡。信徒们陆续散去。","大教堂的灯亮了，暖黄色的光从彩色玻璃窗透出来。","圣城的黄昏是肃穆的，像一首缓慢的安魂曲。"],
      night: ["圣城的夜晚很安静。只有守夜人的脚步声和教堂的钟声。","偶尔有晚归的修士匆匆走过，黑袍在夜风中飘动。","月光照在白色的大理石上，像一层薄霜。"]
    },
    ironpeak: {
      morning: ["天不亮铁锤声就开始了。矮人的一天从锻造开始。","熔炉的火光映红了半边天，煤烟的味道弥漫在整个堡垒里。","矮人们扛着工具走向工坊，大声说笑着，声音在石壁间回荡。"],
      noon: ["正午的铁峰堡是最热的。熔炉边的温度高得让人窒息，但矮人们毫不在意。","矮人们在工坊门口喝酒吃饭，麦酒的泡沫溅在胡子上。","矿车从深处推出来，装满了矿石。矿工们满脸乌黑，只有眼睛是亮的。"],
      dusk: ["黄昏的铁峰堡是橙红色的。熔炉的火光在暮色中格外明亮。","矮人们收工了，涌向酒馆。铁峰堡的夜晚是从喝酒开始的。","烟囱冒着黑烟，在暮色中像一条条黑龙。"],
      night: ["深夜的铁峰堡安静了一些，但熔炉还在烧。守夜的矮人在添柴。","酒馆里还有人在唱歌，声音震得天花板掉灰。","只有最勇敢的矿工还在深处作业，火把在黑暗中晃动。"]
    }
  },
  // 史诗事件对日常的影响
  epicEffects: {
    purge: {
      jiaohui: "审判骑士在街上巡逻，人们走路都低着头。酒馆里没人敢大声说话。昨天又有人被抓走了。",
      holy: "火刑柱上还留着灰烬。教堂的忏悔室前排起了长队。人们在恐惧中祈祷。",
      ironpeak: "矮人不太在乎人类的教会，但来做生意的人类商人少了很多。",
      silverleaf: "精灵们在议论人类的疯狂。「短命种总是在恐惧中做出最残忍的事。」"
    },
    war: {
      jiaohui: "城门的守卫多了一倍。征兵告示贴满了城墙。物价涨了，因为粮食都运去了前线。",
      holy: "教会在招募圣战志愿者。大教堂前挤满了人，有人是为了信仰，有人是为了军饷。",
      ironpeak: "矮人在加紧锻造武器。铁峰堡的铁锤声响到深夜。",
      silverleaf: "精灵们在讨论要不要介入。长老会开了三天三夜，还没有结论。"
    },
    trade_crisis: {
      jiaohui: "集市上的摊位少了三成。物价涨了。商人们都在抱怨银穗商路不太平。",
      holy: "朝圣者少了很多，因为路不太平。教堂的收入减少了，修士们在节衣缩食。",
      ironpeak: "矮人发现矿石卖不出去了。商队来得少了，铁峰堡的仓库堆满了货物。",
      silverleaf: "精灵的手工艺品卖不出去了。人类商人不来，精灵的经济受到了打击。"
    },
    abyss: {
      jiaohui: "很多人说晚上做噩梦。教堂的忏悔室前排起了长队。空气中有一种说不清的压抑感。",
      holy: "教会说这是末日的征兆，呼吁人们更加虔诚。但有些人开始怀疑。",
      ironpeak: "深层矿脉的矿工说听到了奇怪的声音。矮人王封锁了消息，但纸包不住火。",
      silverleaf: "世界树的叶子掉得更多了。精灵们能感觉到——有什么东西在地下苏醒。"
    }
  }
};

// 渲染日常
function renderDailyLife(cityKey, phase){
  try{
    const city = DAILY_LIFE.cities[cityKey];
    if(!city) return;
    const texts = city[phase] || city.noon;
    const text = pickV(texts, "daily_"+cityKey+"_"+phase);
    if(text){
      const d = document.createElement("p");
      d.className = "daily-life";
      d.innerHTML = rich(text);
      storyEl.appendChild(d);
    }
    // 史诗事件影响
    if(S.flags){
      const effects = [];
      if(S.flags.purge_intensified) effects.push("purge");
      if(S.flags.war_intensified) effects.push("war");
      if(S.flags.trade_crisis) effects.push("trade_crisis");
      if(S.flags.abyss_spread) effects.push("abyss");
      if(effects.length > 0){
        const effect = effects[Math.floor(Math.random()*effects.length)];
        const epicText = DAILY_LIFE.epicEffects[effect] && DAILY_LIFE.epicEffects[effect][cityKey];
        if(epicText){
          const d = document.createElement("p");
          d.className = "epic-daily";
          d.innerHTML = rich(epicText);
          storyEl.appendChild(d);
        }
      }
    }
  }catch(e){}
}

/* ============================================================
   v22 方向十：多视角叙事（罗生门层）
   ============================================================ */
const POV_SYSTEM = {
  // 重要事件的多视角叙述
  events: {
    ironpass_battle: {
      title: "铁门关之战",
      human_pov: "人类的史书上说：兽人野蛮入侵，铁门关守军英勇抵抗，最终寡不敌众，全军覆没。这是一场悲壮的牺牲。",
      orc_pov: "兽人的传说里说：第一印的守护者疯了，他在吸食兽人的生命力。部落别无选择，只能打碎封印。那不是侵略，是求生。",
      survivor_pov: "一个幸存的人类士兵说：那天的事……我不想回忆。我们接到的命令不是防守，是「守住封印，不惜一切代价」。我到现在都不知道那是什么意思。",
      truth: "真相是：第一印的守护者被深渊污染了，他在同时吸食人类和兽人的生命力。兽人打碎了封印，人类军队试图阻止——双方都不知道自己在为什么而战。"
    },
    mercury_incident: {
      title: "墨丘利的「背叛」",
      official_pov: "守望者的官方记录：墨丘利因研究禁忌灵魂魔法被开除，后加入艾尔达魔法学院任教。这是一次纪律处分。",
      mercury_pov: "墨丘利自己说：我没有背叛。我只是问了一个不该问的问题——塞拉芬为什么被封印。然后我就「被开除」了。",
      aurelian_pov: "奥雷利安说：墨丘利是对的。但那个时候，我们不能让他说出来。三百年了，我一直在想，当初的选择是不是错的。",
      truth: "真相是：墨丘利发现了守望者大分裂的真相——塞拉芬不是被封印，是被牺牲了。奥雷利安选择了沉默，墨丘利选择了离开。两个人都用自己的方式背负了三百年。"
    },
    first_seal: {
      title: "第一印的破碎",
      church_pov: "教会的说法：兽人异教徒破坏了神圣的第一印，释放了深渊的力量。这是对光明的亵渎。",
      orc_pov: "兽人萨满说：第一印的守护者疯了。他在吸食我们的生命力。我们打碎它，是为了活下去。",
      scholar_pov: "学者的研究：第一印的破碎似乎不是外力造成的——封印本身在崩溃。兽人只是加速了这个过程。",
      truth: "真相是：七印都在崩溃，因为它们在喂养原初之物，而原初之物在苏醒。第一印只是第一个撑不住的。兽人的攻击是导火索，但不是根本原因。"
    }
  }
};

// 渲染多视角
function renderPOV(eventId, unlockedPovs){
  try{
    const event = POV_SYSTEM.events[eventId];
    if(!event) return;
    const arr = ["【"+event.title+"——多视角叙述】"];
    for(const pov of unlockedPovs){
      if(event[pov]) arr.push("["+povCn(pov)+"] "+event[pov]);
    }
    arr.push("你听了这么多版本。哪一个是真的？也许都是真的，也许都不是。真相从来不是一个点，是一片区域。");
    return arr;
  }catch(e){ return []; }
}

function povCn(pov){
  const map = { human_pov:"人类视角", orc_pov:"兽人视角", survivor_pov:"幸存者视角", truth:"真相",
    official_pov:"官方说法", mercury_pov:"墨丘利的说法", aurelian_pov:"奥雷利安的回忆",
    church_pov:"教会说法", scholar_pov:"学者研究" };
  return map[pov] || pov;
}

/* ============================================================
   v22 方向十一：沉默与留白（不说出来的故事）
   ============================================================ */
const SILENCE_SYSTEM = {
  // 沉默时刻
  silenceMoments: [
    { trigger:"reunion_old_friend", text:"你们对视了很久。谁都没有说话。有些话，不需要说出口。你们坐了一下午，喝了一壶茶。然后他说：「走吧。」你说：「好。」" },
    { trigger:"death_of_friend", text:"你站在墓前，很久很久。你想说点什么，但话到嘴边又咽了回去。风把草吹得沙沙响。你放下一束花，转身走了。你没有哭。也许以后会。" },
    { trigger:"hard_choice", text:"你做了选择。然后你坐在那里，很久很久。你不知道自己做的是对还是错。但你知道，你已经做了。时间不会倒流。你站起来，继续往前走。" },
    { trigger:"unspoken_love", text:"你们之间有一种东西，像一根看不见的线。你们都知道它在那里，但谁都没有说破。也许不说破更好。有些东西，说出来就碎了。" },
    { trigger:"return_home", text:"你回到了出发的地方。一切都还是老样子——但你知道，你已经不是当初离开的那个人了。你站在门口，很久没有进去。" }
  ],
  // 未解释的细节 - 环境叙事
  unexplainedDetails: [
    "门上有一道新鲜的抓痕。你不知道是什么造成的。",
    "桌上放着两杯茶，一杯还冒着热气。另一个人刚走。",
    "窗外的雪地上有一串脚印，通向树林深处。你不知道是谁的。",
    "墙上的画歪了，好像有人匆忙中碰过。",
    "抽屉里有一封信，信封上写着你的名字，但你不认识寄件人的笔迹。",
    "镜子上有一个模糊的手印，不是你的。",
    "书架上的书被人动过——有一本被抽出来了一半。",
    "地板上有一道暗色的痕迹，像是什么东西被拖过。"
  ],
  // 未完成的伏笔 - 永远不回收
  unresolvedMysteries: [
    "那个在沙漠里遇到的陌生人，你再也没有见过。他说的那句话是什么意思？你永远不会知道了。",
    "墨丘利办公室里的那面墙，后面到底有什么？他从来不让你靠近。",
    "你在铁门关捡到的那枚徽章，上面的图案你从未在任何地方见过。",
    "那个给你送信的孩子，你问他是谁派来的，他只是笑了笑，然后跑了。",
    "你做过一个反复出现的梦。梦里有一扇门，门后面有光。你从来没有打开过它。"
  ]
};

// 渲染沉默时刻
function renderSilence(trigger){
  try{
    const moments = SILENCE_SYSTEM.silenceMoments.filter(m=>m.trigger===trigger);
    if(moments.length===0) return;
    const m = moments[0];
    const d = document.createElement("p");
    d.className = "silence-moment";
    d.innerHTML = rich(m.text);
    storyEl.appendChild(d);
  }catch(e){}
}

// 渲染未解释细节
function renderUnexplainedDetail(){
  try{
    if(Math.random() < 0.15){
      const detail = pickV(SILENCE_SYSTEM.unexplainedDetails, "unexplained_detail");
      if(detail){
        const d = document.createElement("p");
        d.className = "unexplained";
        d.innerHTML = rich(detail);
        storyEl.appendChild(d);
      }
    }
  }catch(e){}
}
