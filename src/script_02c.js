/*v76mod*/

/* ================================================================
   v21 战斗系统全面深化
   ================================================================ */

/* ---------- 装备数据库 ---------- */
const EQUIPMENT_DB = {
  weapons:{
    iron_sword:{name:"铁剑",type:"sword",attack:5,value:20,desc:"普通的铁剑，锋利但不耐用。"},
    steel_sword:{name:"钢剑",type:"sword",attack:10,value:50,desc:"精钢打造的长剑，战士的标配。"},
    flame_sword:{name:"烈焰剑",type:"sword",attack:18,value:200,desc:"附魔火焰的长剑，挥砍时带起火星。",affixes:["火焰伤害+5"]},
    shadow_dagger:{name:"暗影匕首",type:"dagger",attack:8,value:150,desc:"暗影中淬炼的匕首，刺客的最爱。",affixes:["暴击率+10%"]},
    elf_bow:{name:"精灵长弓",type:"bow",attack:12,value:180,desc:"精灵工匠用千年紫衫木打造的长弓。"},
    dwarf_axe:{name:"矮人战斧",type:"axe",attack:15,value:160,desc:"矮人锻造的双刃战斧，沉重但威力巨大。"},
    mage_staff:{name:"法师之杖",type:"staff",attack:3,value:120,desc:"镶嵌魔晶的法杖，增强法术威力。",affixes:["法术伤害+15%"]},
    holy_mace:{name:"圣光权杖",type:"mace",attack:14,value:220,desc:"教会圣骑士的权杖，散发神圣光芒。",affixes:["对亡灵+50%伤害"]}
  },
  armors:{
    cloth_robe:{name:"布袍",type:"light",defense:2,value:10,desc:"普通的布袍，几乎没有防护。"},
    leather_armor:{name:"皮甲",type:"light",defense:5,value:40,desc:"鞣制皮革制成的轻甲，灵活轻便。"},
    chain_mail:{name:"锁子甲",type:"medium",defense:10,value:100,desc:"铁环编织的锁子甲，防护不错。"},
    plate_armor:{name:"板甲",type:"heavy",defense:18,value:250,desc:"全身板甲，防护极强但影响敏捷。",affixes:["敏捷-3"]},
    elf_robe:{name:"精灵法袍",type:"light",defense:4,value:200,desc:"精灵丝线织成的法袍，增强魔力。",affixes:["MP上限+20"]},
    holy_armor:{name:"圣光铠甲",type:"heavy",defense:22,value:350,desc:"教会圣骑士的铠甲，有神圣祝福。",affixes:["SAN+10"]}
  },
  accessories:{
    copper_ring:{name:"铜戒指",attack:0,defense:0,value:5,desc:"普通的铜戒指。"},
    power_amulet:{name:"力量护符",attack:3,defense:0,value:80,desc:"蕴含力量的护符。",affixes:["力量+3"]},
    wisdom_ring:{name:"智慧之戒",attack:0,defense:0,value:100,desc:"增强精神力的戒指。",affixes:["精神+5"]},
    agility_boots:{name:"疾风之靴",attack:0,defense:2,value:120,desc:"轻盈的靴子，提升敏捷。",affixes:["敏捷+4"]},
    holy_pendant:{name:"圣光吊坠",attack:0,defense:3,value:150,desc:"教会圣物，抵御黑暗。",affixes:["SAN+15","对深渊+20%防御"]}
  }
};

/* ---------- 技能数据库 ---------- */
const SKILL_DB = {
  warrior:{
    power_strike:{name:"强力一击",type:"physical",damage:25,cost:0,desc:"蓄力后发出的强力一击，造成150%伤害。"},
    whirlwind:{name:"旋风斩",type:"physical",damage:35,cost:10,desc:"旋转身体攻击周围所有敌人。"},
    shield_bash:{name:"盾击",type:"physical",damage:15,cost:5,desc:"用盾牌猛击敌人，有几率眩晕。"},
    berserk:{name:"狂暴",type:"buff",damage:0,cost:15,desc:"进入狂暴状态，攻击力+50%，防御-30%，持续3回合。"},
    war_cry:{name:"战吼",type:"buff",damage:0,cost:8,desc:"发出战吼，提升全队士气，攻击力+20%。"}
  },
  mage:{
    fireball:{name:"火球术",type:"magic",damage:30,cost:12,desc:"召唤火球攻击敌人，造成火焰伤害。"},
    ice_shard:{name:"冰锥术",type:"magic",damage:25,cost:10,desc:"发射冰锥，有几率冻结敌人。"},
    lightning:{name:"闪电术",type:"magic",damage:35,cost:15,desc:"召唤闪电劈向敌人。"},
    arcane_shield:{name:"奥术护盾",type:"buff",damage:0,cost:20,desc:"召唤奥术护盾，吸收30点伤害。"},
    meteor:{name:"陨石术",type:"magic",damage:60,cost:30,desc:"召唤陨石从天而降，造成巨大伤害。"}
  },
  soul:{
    soul_bolt:{name:"灵魂箭",type:"magic",damage:28,cost:12,desc:"发射灵魂之箭，无视部分防御。"},
    mind_blast:{name:"精神冲击",type:"magic",damage:22,cost:10,desc:"攻击敌人精神，有几率混乱。"},
    soul_drain:{name:"灵魂汲取",type:"magic",damage:20,cost:15,desc:"汲取敌人灵魂，造成伤害并恢复自身HP。"},
    astral_projection:{name:"星界投射",type:"buff",damage:0,cost:25,desc:"灵魂出窍，免疫物理攻击3回合。"},
    soul_reave:{name:"灵魂撕裂",type:"magic",damage:50,cost:30,desc:"撕裂敌人灵魂，造成巨大精神伤害。"}
  },
  priest:{
    heal:{name:"治愈术",type:"heal",damage:-30,cost:12,desc:"恢复目标30点HP。"},
    holy_light:{name:"圣光术",type:"magic",damage:25,cost:10,desc:"召唤圣光攻击敌人，对亡灵效果翻倍。"},
    bless:{name:"祝福术",type:"buff",damage:0,cost:8,desc:"祝福目标，全属性+10%，持续3回合。"},
    resurrection:{name:"复活术",type:"heal",damage:-100,cost:40,desc:"复活倒下的队友，恢复50%HP。"},
    holy_judgment:{name:"神圣审判",type:"magic",damage:55,cost:30,desc:"召唤神圣之力审判敌人。"}
  },
  rogue:{
    backstab:{name:"背刺",type:"physical",damage:40,cost:8,desc:"从背后攻击敌人，造成200%伤害。"},
    poison_blade:{name:"淬毒",type:"physical",damage:15,cost:5,desc:"武器淬毒，持续3回合每回合-10HP。"},
    smoke_bomb:{name:"烟雾弹",type:"utility",damage:0,cost:10,desc:"释放烟雾，逃跑成功率+50%。"},
    shadow_step:{name:"暗影步",type:"buff",damage:0,cost:15,desc:"进入暗影状态，下次攻击必定暴击。"},
    assassination:{name:"刺杀",type:"physical",damage:70,cost:25,desc:"致命一击，对HP低于30%的敌人秒杀。"}
  },
  merchant:{
    coin_throw:{name:"掷币",type:"physical",damage:20,cost:0,desc:"抛出金币攻击敌人，消耗5金龙。"},
    bargain:{name:"讨价还价",type:"utility",damage:0,cost:5,desc:"降低敌人攻击力20%，持续3回合。"},
    bodyguard_call:{name:"召唤护卫",type:"summon",damage:25,cost:20,desc:"花钱雇佣护卫攻击敌人。"},
    golden_touch:{name:"点金术",type:"buff",damage:0,cost:15,desc:"点石成金，战斗后获得额外金币。"},
    market_crash:{name:"市场崩盘",type:"magic",damage:45,cost:25,desc:"引发经济混乱，对所有敌人造成伤害。"}
  },
  alchemist:{
    acid_flask:{name:"强酸瓶",type:"magic",damage:28,cost:8,desc:"投掷强酸瓶，造成持续伤害。"},
    fire_potion:{name:"火焰药水",type:"magic",damage:35,cost:12,desc:"投掷火焰药水，造成范围火焰伤害。"},
    heal_potion:{name:"治疗药剂",type:"heal",damage:-25,cost:10,desc:"喝下治疗药剂，恢复25HP。"},
    mutagen:{name:"诱变剂",type:"buff",damage:0,cost:20,desc:"喝下诱变剂，全属性+30%，但SAN-10。"},
    philosopher_bomb:{name:"贤者之石炸弹",type:"magic",damage:65,cost:30,desc:"用贤者之石制造的炸弹，造成毁灭性伤害。"}
  }
};

/* ---------- 敌人数据库 ---------- */
const ENEMY_DB = {
  goblin:{name:"哥布林",hp:30,attack:8,defense:2,exp:10,gold:5,weakness:"holy",desc:"绿皮的小怪物，贪婪且狡猾。"},
  wolf:{name:"野狼",hp:25,attack:10,defense:1,exp:8,gold:3,weakness:"fire",desc:"饥饿的野狼，眼睛在黑暗中发光。"},
  bandit:{name:"强盗",hp:40,attack:12,defense:5,exp:15,gold:20,weakness:null,desc:"拦路抢劫的亡命之徒。"},
  skeleton:{name:"骷髅兵",hp:35,attack:10,defense:8,exp:12,gold:8,weakness:"holy",desc:"不死的骷髅，挥舞着锈迹斑斑的剑。"},
  dark_mage:{name:"黑暗法师",hp:30,attack:18,defense:3,exp:20,gold:25,weakness:"holy",desc:"研习禁忌魔法的堕落法师。"},
  orc_warrior:{name:"兽人战士",hp:60,attack:15,defense:8,exp:25,gold:15,weakness:null,desc:"强壮的兽人战士，挥舞着巨斧。"},
  troll:{name:"巨魔",hp:80,attack:20,defense:10,exp:35,gold:30,weakness:"fire",desc:"巨大的巨魔，伤口能快速愈合。"},
  wraith:{name:"幽魂",hp:45,attack:22,defense:5,exp:30,gold:20,weakness:"holy",desc:"飘荡的怨灵，触碰即被吸取生命。"},
  demon:{name:"恶魔",hp:100,attack:25,defense:12,exp:50,gold:50,weakness:"holy",desc:"从深渊召唤的低阶恶魔。"},
  // BOSS
  boss_seal1_guardian:{name:"饥饿守护者",hp:200,attack:30,defense:15,exp:100,gold:100,weakness:null,isBoss:true,desc:"第一印的守护者，被饥饿吞噬的扭曲存在。",phases:2},
  boss_seal2_guardian:{name:"愤怒守护者",hp:250,attack:35,defense:18,exp:120,gold:120,weakness:null,isBoss:true,desc:"第二印的守护者，永远处于愤怒状态。",phases:2},
  boss_eclipse_leader:{name:"暗蚀会五司长",hp:300,attack:40,defense:20,exp:150,gold:200,weakness:"holy",isBoss:true,desc:"暗蚀会五部门的首领，深不可测。",phases:3}
};

/* ---------- 战斗状态 ---------- */
/* COMBAT 已在 engine_elda.py 中声明为 let COMBAT = null，此处直接赋值 */
(function(){ /*v58eng:iife*/ COMBAT = {active:false,enemy:null,playerDefending:false,buffs:{},enemyBuffs:{},turn:1,log:[],phase:1}; window.COMBAT = COMBAT; })();;

/* ---------- 战斗启动 ---------- */
function combatStart(enemyId){
  const e = ENEMY_DB[enemyId];
  if(!e){ writePar("找不到敌人数据。","warn"); return; }
  COMBAT = {active:true,enemy:Object.assign({},e),playerDefending:false,buffs:{},enemyBuffs:{},turn:1,log:[],phase:1};
  COMBAT.enemy.maxHp = e.hp;
  showCombatPanel();
  addLog("遭遇了【"+e.name+"】！","combat");
}

function showCombatPanel(){
  const e = COMBAT.enemy;
  const job = S.job||"warrior";
  const skills = SKILL_DB[job]||{};
  const skillList = S.learnedSkills||[];
  let h = "<div class='combat-panel'>";
  h += "<div class='combat-enemy'>";
  h += "<div class='combat-enemy-name'>"+e.name+(e.isBoss?" 👑":"")+"</div>";
  h += "<div class='combat-hp-bar'><div class='combat-hp-fill enemy' style='width:"+(e.hp/e.maxHp*100)+"%'></div></div>";
  h += "<div class='combat-hp-text'>"+e.hp+"/"+e.maxHp+"</div>";
  if(e.desc) h += "<div class='combat-enemy-desc'>"+e.desc+"</div>";
  h += "</div>";
  h += "<div class='combat-player'>";
  h += "<div class='combat-player-name'>"+(S.name||"旅人")+"</div>";
  h += "<div class='combat-hp-bar'><div class='combat-hp-fill player' style='width:"+(S.hp/S.maxHp*100)+"%'></div></div>";
  h += "<div class='combat-hp-text'>HP:"+S.hp+"/"+S.maxHp+" MP:"+(S.mp||50)+"/"+(S.maxMp||50)+"</div>";
  h += "</div>";
  h += "<div class='combat-actions'>";
  h += "<button class='btn combat-btn' onclick='combatAction(\"attack\")'>⚔️ 攻击</button>";
  h += "<button class='btn combat-btn' onclick='combatAction(\"defend\")'>🛡️ 防御</button>";
  h += "<button class='btn combat-btn' onclick='combatShowSkills()'>✨ 技能</button>";
  h += "<button class='btn combat-btn' onclick='combatAction(\"item\")'>🧪 道具</button>";
  h += "<button class='btn combat-btn danger' onclick='combatAction(\"flee\")'>🏃 逃跑</button>";
  h += "</div>";
  h += "<div class='combat-log' id='combat-log'></div>";
  h += "</div>";
  openModal(elFromHtml(h));
  updateCombatLog("战斗开始！第1回合。");
}

function combatShowSkills(){
  const job = S.job||"warrior";
  const skills = SKILL_DB[job]||{};
  const keys = Object.keys(skills);
  let h = "<div style='padding:12px'><h4 style='color:#ffd700;margin-bottom:8px'>选择技能</h4>";
  for(var i=0;i<keys.length;i++){
    const sk = skills[keys[i]];
    const canUse = (S.mp||50)>=sk.cost;
    h += "<button class='btn combat-btn' style='display:block;width:100%;margin-bottom:6px;text-align:left' "+(canUse?"":"disabled")+" onclick='combatUseSkill(\""+keys[i]+"\")'>";
    h += sk.name+" <span style='color:#8fd4ff'>MP:"+sk.cost+"</span>";
    if(sk.damage>0) h += " <span style='color:#ff8a8a'>伤害:"+sk.damage+"</span>";
    if(sk.damage<0) h += " <span style='color:#8aff8a'>治疗:"+(-sk.damage)+"</span>";
    h += "<br><span style='font-size:10px;color:#8fa8c8'>"+sk.desc+"</span>";
    h += "</button>";
  }
  h += "<button class='btn' style='margin-top:8px' onclick='showCombatPanel()'>返回</button>";
  h += "</div>";
  const d = document.querySelector(".combat-panel");
  if(d){ d.innerHTML = h; } else { openModal(elFromHtml(h)); }
}

function combatUseSkill(skillId){
  const job = S.job||"warrior";
  const sk = (SKILL_DB[job]||{})[skillId];
  if(!sk) return;
  if((S.mp||50)<sk.cost){ updateCombatLog("MP不足！"); return; }
  S.mp = (S.mp||50)-sk.cost;
  let dmg = sk.damage||0;
  const a = S.attrs||{};
  if(sk.type==="physical") dmg += Math.floor((a.STR||0)*0.5);
  if(sk.type==="magic") dmg += Math.floor((a.INT||0)*0.5);
  if(sk.type==="heal"){
    S.hp = Math.min(S.maxHp, S.hp - dmg);
    updateCombatLog("使用【"+sk.name+"】，恢复"+(-dmg)+"HP！");
  } else if(sk.type==="buff"){
    COMBAT.buffs[skillId]=3;
    updateCombatLog("使用【"+sk.name+"】，获得增益效果！");
  } else {
    // 暴击判定
    const critChance = 5+(a.AGI||0)*0.1;
    const isCrit = Math.random()*100<critChance;
    if(isCrit) dmg = Math.floor(dmg*1.5);
    // 弱点
    if(COMBAT.enemy.weakness===sk.type||(sk.type==="magic"&&COMBAT.enemy.weakness==="holy"&&job==="priest")) dmg=Math.floor(dmg*1.5);
    // 防御减伤
    dmg = Math.max(1, dmg - Math.floor(COMBAT.enemy.defense*0.3));
    COMBAT.enemy.hp -= dmg;
    updateCombatLog("使用【"+sk.name+"】"+(isCrit?"【暴击】":"")+"，造成"+dmg+"点伤害！");
  }
  if(COMBAT.enemy.hp<=0){ combatVictory(); return; }
  combatEnemyTurn();
}

function combatAction(action){
  if(action==="attack"){
    const a = S.attrs||{};
    const eq = S.equipment||{};
    let atk = Math.floor((a.STR||0)*0.5) + (eq.weapon?(eq.weapon.attack||0):0) + 5;
    // 狂暴buff
    if(COMBAT.buffs.berserk){ atk=Math.floor(atk*1.5); }
    const critChance = 5+(a.AGI||0)*0.1;
    const isCrit = Math.random()*100<critChance;
    if(isCrit) atk=Math.floor(atk*1.5);
    const dmg = Math.max(1, atk - Math.floor(COMBAT.enemy.defense*0.3));
    COMBAT.enemy.hp -= dmg;
    updateCombatLog("你发起攻击"+(isCrit?"【暴击】":"")+"，造成"+dmg+"点伤害！");
    if(COMBAT.enemy.hp<=0){ combatVictory(); return; }
    combatEnemyTurn();
  } else if(action==="defend"){
    COMBAT.playerDefending = true;
    updateCombatLog("你举起武器防御，下次受到的伤害减半。");
    combatEnemyTurn();
  } else if(action==="item"){
    combatShowItems();
  } else if(action==="flee"){
    const a = S.attrs||{};
    const fleeChance = 30+(a.AGI||0)*0.3;
    if(COMBAT.enemy.isBoss){ updateCombatLog("无法从BOSS战中逃跑！"); combatEnemyTurn(); return; }
    if(Math.random()*100<fleeChance){
      updateCombatLog("你成功逃离了战斗！");
      setTimeout(function(){ closePanel(); COMBAT.active=false; renderTop(); renderStats(); },1000);
    } else {
      updateCombatLog("逃跑失败！");
      combatEnemyTurn();
    }
  }
}

function combatShowItems(){
  const inv = S.inventory||[];
  const consumables = inv.filter(it=>it.category==="consumable");
  let h = "<div style='padding:12px'><h4 style='color:#ffd700;margin-bottom:8px'>选择道具</h4>";
  if(consumables.length===0){ h += "<div class='empty-hint'>没有可用的消耗品。</div>"; }
  for(var i=0;i<consumables.length;i++){
    const it = consumables[i];
    h += "<button class='btn combat-btn' style='display:block;width:100%;margin-bottom:6px;text-align:left' onclick='combatUseItem(\""+it.name+"\")'>";
    h += it.name+(it.qty&&it.qty>1?" x"+it.qty:"")+"<br><span style='font-size:10px;color:#8fa8c8'>"+(it.desc||"")+"</span>";
    h += "</button>";
  }
  h += "<button class='btn' style='margin-top:8px' onclick='showCombatPanel()'>返回</button>";
  h += "</div>";
  const d = document.querySelector(".combat-panel");
  if(d){ d.innerHTML = h; } else { openModal(elFromHtml(h)); }
}

function combatUseItem(name){
  const inv = S.inventory||[];
  const idx = inv.findIndex(it=>it.name===name);
  if(idx<0) return;
  const it = inv[idx];
  if(it.effect){
    if(it.effect.hp){ S.hp=Math.min(S.maxHp,S.hp+it.effect.hp); updateCombatLog("使用【"+it.name+"】，恢复"+it.effect.hp+"HP！"); }
    if(it.effect.mp){ S.mp=Math.min(S.maxMp||50,(S.mp||50)+it.effect.mp); updateCombatLog("使用【"+it.name+"】，恢复"+it.effect.mp+"MP！"); }
  }
  if(it.qty&&it.qty>1){ it.qty--; } else { inv.splice(idx,1); }
  combatEnemyTurn();
}

function combatEnemyTurn(){
  COMBAT.turn++;
  // BOSS阶段转换
  if(COMBAT.enemy.isBoss&&COMBAT.enemy.phases&&COMBAT.phase<COMBAT.enemy.phases){
    const threshold = COMBAT.enemy.maxHp*(1-COMBAT.phase/COMBAT.enemy.phases);
    if(COMBAT.enemy.hp<=threshold){
      COMBAT.phase++;
      COMBAT.enemy.attack = Math.floor(COMBAT.enemy.attack*1.3);
      updateCombatLog("⚠️ "+COMBAT.enemy.name+"进入第"+COMBAT.phase+"阶段！攻击力提升！");
    }
  }
  let eDmg = COMBAT.enemy.attack + Math.floor(Math.random()*5);
  if(COMBAT.playerDefending){ eDmg=Math.floor(eDmg*0.5); COMBAT.playerDefending=false; }
  const a = S.attrs||{};
  const eq = S.equipment||{};
  const pDef = Math.floor((a.CON||0)*0.3) + (eq.armor?(eq.armor.defense||0):0);
  eDmg = Math.max(1, eDmg - Math.floor(pDef*0.3));
  S.hp -= eDmg;
  updateCombatLog(COMBAT.enemy.name+"发起攻击，造成"+eDmg+"点伤害！");
  // buff回合减少
  for(var k in COMBAT.buffs){ COMBAT.buffs[k]--; if(COMBAT.buffs[k]<=0) delete COMBAT.buffs[k]; }
  if(S.hp<=0){ combatDefeat(); return; }
  showCombatPanel();
}

function combatVictory(){
  const e = COMBAT.enemy;
  const exp = e.exp||10;
  const gold = e.gold||5;
  S.exp = (S.exp||0)+exp;
  S.gold = (S.gold||0)+gold;
  updateCombatLog("🎉 击败了【"+e.name+"】！获得"+exp+"经验，"+gold+"金币。");
  addLog("击败了【"+e.name+"】，获得"+exp+"经验，"+gold+"金币。","combat");
  // 升级检查
  checkLevelUp();
  COMBAT.active=false;
  setTimeout(function(){
    closePanel();
    writePar("战斗胜利！你击败了【"+e.name+"】，获得"+exp+"点经验和"+gold+"金币。","res");
    renderTop(); renderStats();
  },1500);
}

function combatDefeat(){
  COMBAT.active=false;
  closePanel();
  S.hp = Math.floor(S.maxHp*0.3);
  S.gold = Math.floor((S.gold||0)*0.7);
  writePar("你被击败了... 醒来时发现自己躺在路边，身上的金币少了三成。","warn");
  addLog("被【"+COMBAT.enemy.name+"】击败，损失30%金币。","combat");
  renderTop(); renderStats();
}

function updateCombatLog(text){
  COMBAT.log.push(text);
  if(COMBAT.log.length>10) COMBAT.log.shift();
  const el = document.getElementById("combat-log");
  if(el){ el.innerHTML = COMBAT.log.map(l=>"<div class='combat-log-line'>"+l+"</div>").join(""); }
}

function checkLevelUp(){
  const expNeeded = [0,50,120,250,500,1000,2000,4000,8000];
  const curExp = S.exp||0;
  let leveled = false;
  for(var i=(S.level||1);i<9;i++){
    if(curExp>=expNeeded[i]&&(S.level||1)<=i){
      S.level = i+1;
      S.maxHp += 10;
      S.hp = S.maxHp;
      S.maxMp = (S.maxMp||50)+5;
      S.mp = S.maxMp;
      if(S.attrs){ S.attrs.STR=(S.attrs.STR||0)+1; S.attrs.INT=(S.attrs.INT||0)+1; }
      leveled = true;
      writePar("🎉 升级了！当前等级："+(i+1)+"，属性提升！","hint");
      addLog("升级到"+(i+1)+"级！","achievement");
    }
  }
}

/* ================================================================
   v21 经济与贸易系统
   ================================================================ */
const CITY_PRICES = {
  jiaohui:{grain:1.2,fur:1.3,iron:1.1,weapon:1.0,spice:1.2,silk:1.2,potion:1.0,gem:1.1,book:1.0,slave:0.8},
  holy:{grain:1.5,fur:1.5,iron:1.3,weapon:1.2,spice:1.3,silk:1.3,potion:1.2,gem:1.0,book:1.1,slave:0.5},
  ironpeak:{grain:1.8,fur:1.2,iron:0.5,weapon:0.7,spice:1.8,silk:1.8,potion:1.5,gem:0.8,book:1.5,slave:0.6},
  silverleaf:{grain:1.3,fur:1.0,iron:1.5,weapon:1.3,spice:1.5,silk:1.4,potion:0.7,gem:1.2,book:1.2,slave:0.3},
  irongate:{grain:2.0,fur:0.8,iron:0.9,weapon:0.8,spice:2.0,silk:2.0,potion:1.3,gem:1.3,book:1.5,slave:0.7},
  chengtian:{grain:1.0,fur:1.4,iron:1.2,weapon:1.1,spice:0.8,silk:0.7,potion:1.1,gem:1.0,book:0.8,slave:0.5},
  orccourt:{grain:1.6,fur:0.6,iron:0.7,weapon:0.9,spice:2.2,silk:2.2,potion:1.6,gem:1.4,book:1.8,slave:0.4},
  southport:{grain:0.7,fur:1.1,iron:1.3,weapon:1.2,spice:0.7,silk:0.8,potion:1.1,gem:0.9,book:1.0,slave:0.9}
};

/* TRADE_GOODS 已在 story_elda_h.py 中声明（含buyAt/sellAt/desc） */

function openTradePanel(){
  const city = S.currentCity||"jiaohui";
  const prices = CITY_PRICES[city]||CITY_PRICES.jiaohui;
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>贸易 - "+city+"</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='trade-body'>";
  h += "<div class='trade-info'>金币: <span class='gold-val'>"+(S.gold||0)+"</span> | 负重: "+(S.cargoWeight||0)+"/"+(S.maxCargo||50)+"</div>";
  h += "<table class='trade-table'><tr><th>商品</th><th>单价</th><th>库存</th><th>操作</th></tr>";
  const goods = Object.keys(TRADE_GOODS);
  for(var i=0;i<goods.length;i++){
    const g = TRADE_GOODS[goods[i]];
    const price = Math.floor(g.base*(prices[goods[i]]||1));
    const owned = (S.cargo&&S.cargo[goods[i]])||0;
    h += "<tr><td>"+g.name+"</td><td>"+price+"金</td><td>"+owned+"</td>";
    h += "<td><button class='btn small' onclick='tradeBuy(\""+goods[i]+"\","+price+")'>买</button> ";
    h += "<button class='btn small' onclick='tradeSell(\""+goods[i]+"\","+price+")'>卖</button></td></tr>";
  }
  h += "</table></div></div>";
  openModal(elFromHtml(h));
}

function tradeBuy(goodId,price){
  if((S.gold||0)<price){ writePar("金币不足！","warn"); return; }
  if((S.cargoWeight||0)+1>(S.maxCargo||50)){ writePar("负重已满！","warn"); return; }
  S.gold -= price;
  if(!S.cargo) S.cargo={};
  S.cargo[goodId]=(S.cargo[goodId]||0)+1;
  S.cargoWeight=(S.cargoWeight||0)+1;
  try{ v44_tradeFX(-price,'buy'); }catch(e){}
  openTradePanel();
}

function tradeSell(goodId,price){
  if(!S.cargo||!S.cargo[goodId]||S.cargo[goodId]<=0){ writePar("没有该商品！","warn"); return; }
  S.gold = (S.gold||0)+price;
  S.cargo[goodId]--;
  S.cargoWeight=(S.cargoWeight||0)-1;
  try{ v44_tradeFX(price,'sell'); }catch(e){}
  openTradePanel();
}

/* ================================================================
   v21 NPC关系系统
   ================================================================ */
const NPC_RELATION_LEVELS = [
  {min:-100,max:-60,name:"死敌",color:"#ff0000"},
  {min:-59,max:-20,name:"敌对",color:"#ff6666"},
  {min:-19,max:19,name:"陌生人",color:"#999999"},
  {min:20,max:39,name:"熟人",color:"#88ccff"},
  {min:40,max:59,name:"朋友",color:"#44ff88"},
  {min:60,max:79,name:"挚友",color:"#ffdd44"},
  {min:80,max:100,name:"恋人/生死之交",color:"#ff88ff"}
];

function getRelationLevel(npcId){
  const val = (S.npcRelations&&S.npcRelations[npcId])||0;
  for(var i=0;i<NPC_RELATION_LEVELS.length;i++){
    if(val>=NPC_RELATION_LEVELS[i].min&&val<=NPC_RELATION_LEVELS[i].max) return NPC_RELATION_LEVELS[i];
  }
  return NPC_RELATION_LEVELS[2];
}

function changeRelation(npcId,delta,reason){
  if(!S.npcRelations) S.npcRelations={};
  const old = S.npcRelations[npcId]||0;
  S.npcRelations[npcId] = Math.max(-100,Math.min(100,old+delta));
  const lvl = getRelationLevel(npcId);
  if(reason) addLog("与"+npcId+"的关系"+(delta>0?"提升":"下降")+delta+"（"+lvl.name+"）："+reason,"quest");
  try{ v44_relationToast(npcId,delta); }catch(e){}
  // 关系里程碑事件
  if(old<60&&S.npcRelations[npcId]>=60){ triggerRelationEvent(npcId,"close_friend"); }
  if(old<80&&S.npcRelations[npcId]>=80){ triggerRelationEvent(npcId,"lover"); }
  if(old>-60&&S.npcRelations[npcId]<=-60){ triggerRelationEvent(npcId,"enemy"); }
}

function triggerRelationEvent(npcId,type){
  // 关系里程碑事件触发
  addLog("与"+npcId+"的关系达到了新的阶段！","achievement");
}

function openRelationPanel(){
  const npcs = S.npcRelations?Object.keys(S.npcRelations):[];
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>人际关系</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='relation-list'>";
  if(npcs.length===0){ h += "<div class='empty-hint'>尚未与任何NPC建立关系。</div>"; }
  for(var i=0;i<npcs.length;i++){
    const val = S.npcRelations[npcs[i]];
    const lvl = getRelationLevel(npcs[i]);
    h += "<div class='relation-row'><span class='relation-name'>"+npcs[i]+"</span>";
    h += "<div class='rep-bar-bg'><div class='rep-bar' style='width:"+Math.abs(val)+"%;background:"+lvl.color+"'></div></div>";
    h += "<span class='rep-level' style='color:"+lvl.color+"'>"+lvl.name+"("+val+")</span></div>";
  }
  h += "</div></div>";
  openModal(elFromHtml(h));
}


/* ================================================================
   v21 修炼与境界系统深化
   ================================================================ */

const CULTIVATION_METHODS = {
  warrior:{name:"铁血战诀",expRate:1.2,bonus:{STR:2,CON:2},desc:"以战养战，在生死边缘突破极限。"},
  mage:{name:"元素冥想",expRate:1.0,bonus:{SPR:2,INT:2},desc:"冥想沟通元素，汲取天地灵气。"},
  soul:{name:"灵魂呼吸法",expRate:0.9,bonus:{SPR:3,INT:1},desc:"内观灵魂，触碰存在的边界。"},
  priest:{name:"圣光祷言",expRate:1.1,bonus:{SPR:2,CHA:2},desc:"向光明祈祷，获得神圣之力。"},
  rogue:{name:"暗影潜行诀",expRate:1.0,bonus:{AGI:3,INT:1},desc:"融入暗影，无声无息。"},
  merchant:{name:"商道心经",expRate:1.3,bonus:{CHA:2,INT:2},desc:"在商场中修炼心智，财富即力量。"},
  alchemist:{name:"丹火淬体",expRate:1.1,bonus:{INT:2,CON:2},desc:"以丹火淬炼肉身，药石即大道。"}
};

const REALM_MATERIALS = {
  1:{name:"启灵",need:"启灵草×3 + 灵泉水×1",loc:"各地药铺/灵泉"},
  2:{name:"凝元",need:"凝元丹×2 + 妖兽内丹×1",loc:"炼金工坊/妖兽狩猎"},
  3:{name:"化意",need:"化意果×1 + 千年人参×1",loc:"精灵森林/深山"},
  4:{name:"宗师",need:"宗师心得×1 + 百炼钢×3",loc:"名师指点/矮人锻造"},
  5:{name:"大宗师",need:"大宗师印记×1 + 上古符文×3",loc:"遗迹/守望者"},
  6:{name:"传奇",need:"传奇之证×1 + 世界树之叶×1",loc:"精灵王国/世界树"},
  7:{name:"半神",need:"半神格碎片×1 + 深渊之心×1",loc:"深渊/神战遗迹"},
  8:{name:"神话",need:"世界本源×1 + 七印之力×7",loc:"七印全部/世界本源"}
};

function cultivate(days){
  const method = CULTIVATION_METHODS[S.job]||CULTIVATION_METHODS.warrior;
  const results = [];
  for(var i=0;i<days;i++){
    const roll = Math.floor(Math.random()*100)+1;
    const target = (S.attrs&&S.attrs.SPR?S.attrs.SPR:50)+10;
    if(roll===1){
      results.push("第"+(i+1)+"天：走火入魔！HP-15，SAN-10");
      S.hp = Math.max(1,S.hp-15);
      S.san = Math.max(0,S.san-10);
    } else if(roll<=target/5){
      const exp = Math.floor(15*method.expRate);
      S.exp=(S.exp||0)+exp;
      results.push("第"+(i+1)+"天：大成功！领悟了"+method.name+"的精髓，获得"+exp+"经验。");
    } else if(roll<=target/2){
      const exp = Math.floor(10*method.expRate);
      S.exp=(S.exp||0)+exp;
      results.push("第"+(i+1)+"天：困难成功，修为精进，获得"+exp+"经验。");
    } else if(roll<=target){
      const exp = Math.floor(5*method.expRate);
      S.exp=(S.exp||0)+exp;
      results.push("第"+(i+1)+"天：普通修炼，获得"+exp+"经验。");
    } else if(roll===100||(target<50&&roll>=96)){
      results.push("第"+(i+1)+"天：大失败！心神不宁，毫无收获，SAN-5。");
      S.san = Math.max(0,S.san-5);
    } else {
      results.push("第"+(i+1)+"天：修炼失败，杂念太多。");
    }
  }
  advanceDays(days);
  checkLevelUp();
  return results.join("\n");
}

function openCultivatePanel(){
  const method = CULTIVATION_METHODS[S.job]||CULTIVATION_METHODS.warrior;
  const realmNames = ["凡人","启灵","凝元","化意","宗师","大宗师","传奇","半神","神话"];
  const realm = (typeof S.realm==="number")?S.realm:0;
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>修炼</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='cultivate-body'>";
  h += "<div class='cultivate-info'><b>功法：</b>"+method.name+"<br><b>效果：</b>"+method.desc+"<br>";
  h += "<b>境界：</b>"+realmNames[realm]+" | <b>经验：</b>"+(S.exp||0)+"<br>";
  h += "<b>精神力：</b>"+(S.attrs&&S.attrs.SPR?S.attrs.SPR:50)+"（影响修炼成功率）</div>";
  if(realm<8){
    const nextMat = REALM_MATERIALS[realm+1];
    h += "<div class='realm-breakthrough'><b>突破至"+nextMat.name+"需要：</b>"+nextMat.need+"<br>获取地点："+nextMat.loc+"</div>";
    h += "<button class='btn' onclick='v49_openBreakthrough()'>尝试突破</button>";
  }
  h += "<h4 style='color:#ffd700;margin-top:12px'>闭关修炼</h4>";
  h += "<div class='cultivate-days'>";
  h += "<button class='btn' onclick='doCultivate(1)'>闭关1天</button>";
  h += "<button class='btn' onclick='doCultivate(3)'>闭关3天</button>";
  h += "<button class='btn' onclick='doCultivate(7)'>闭关7天</button>";
  h += "</div>";
  h += "<div id='cultivate-result' style='margin-top:12px;font-size:12px;white-space:pre-wrap'></div>";
  h += "</div></div>";
  openModal(elFromHtml(h));
}

function doCultivate(days){
  const result = cultivate(days);
  const el = document.getElementById("cultivate-result");
  if(el){
    el.textContent = result;
    // v30: 修炼后增加继续/返回按钮
    let actions = document.getElementById("cultivate-actions");
    if(!actions){
      actions = document.createElement("div");
      actions.id = "cultivate-actions";
      actions.className = "cultivate-actions";
      el.parentNode.appendChild(actions);
    }
    actions.innerHTML = "<button class='btn-secondary' onclick='document.getElementById(\"cultivate-result\").textContent=\"\";document.getElementById(\"cultivate-actions\").innerHTML=\"\";'>继续修炼</button>"
      + "<button class='btn-gold' onclick='closePanel()'>返回游戏</button>";
  }
  renderTop(); renderStats();
}

/* ========== v49 破境系统 ========== */
/*v49inj:bt*/
const BREAKTHROUGH_V49 = {
  realmNames:["凡人","启灵","凝元","化意","宗师","大宗师","传奇","半神","神话"],
  guardianDef:{
    tutor:  {bonus:10, rescue:60},
    senior: {bonus:6,  rescue:40},
    friend: {bonus:4,  rescue:30},
    none:   {bonus:-8, rescue:0}
  },
  placeDef:{
    sacred:{bonus:8,  crisis:-8},
    safe:  {bonus:5,  crisis:0},
    wild:  {bonus:-5, crisis:10}
  },
  byJob:{}
};
function v49_matName(){
  try{ if(S && S.job && JOBS[S.job].mats) return JOBS[S.job].mats[(S.realm||0)-1]||""; }catch(e){}
  return "";
}
function v49_bookName(){
  try{ if(S && S.job && JOBS[S.job].books && JOBS[S.job].books[(S.realm||0)-1]) return JOBS[S.job].books[(S.realm||0)-1][0]||""; }catch(e){}
  return "";
}
function v49_hasMat(){ var m=v49_matName(); return !!m && (S.mats&&S.mats[m]>0); }
function v49_hasBook(){ return !!(S.flags&&S.flags["v49book_"+S.job+"_"+S.realm]); }
function v49_mainAttr(){ try{ if(S&&S.job&&JOBS[S.job].attr) return S.attrs[JOBS[S.job].attr]||40; }catch(e){} return 40; }
function v49_jobConf(){ try{ return (BREAKTHROUGH_V49.byJob[S.job]||{})[S.realm]||null; }catch(e){ return null; } }
function v49_openBreakthrough(){
  const realm = (typeof S.realm==="number")?S.realm:0;
  if(realm>=8){ writePar("已达神话境界，无需突破。","hint"); return; }
  const next = realm+1;
  const cfg = v49_jobConf() || {};
  const jc = BREAKTHROUGH_V49.byJob[S.job]||{};
  const j = JOBS[S.job]||{};
  const matName = v49_matName(), bookName = v49_bookName();
  const guardianNames = {tutor:"导师",senior:"同门",friend:"挚友",none:"无人护法"};
  const placeNames = {sacred:"职业圣地",safe:"静室",wild:"野外"};
  let h = "<div class='panel-wrap'>";
  h += "<div class='panel-header'><span class='panel-title'>破境 · "+BREAKTHROUGH_V49.realmNames[realm]+" → "+BREAKTHROUGH_V49.realmNames[next]+"</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
  h += "<div class='panel-body' style='font-size:14px;line-height:1.8'>";
  h += "<div style='color:var(--text-gold2);font-family:Georgia,serif;font-size:16px;font-weight:bold;margin-bottom:6px'>"+(cfg.ritual||(j.titles?("晋阶 "+BREAKTHROUGH_V49.realmNames[next])+" · "+((j.titles[next])||""):""))+"</div>";
  if(cfg.ritualNote) h += "<div style='color:#5a6a7a;margin-bottom:10px'>"+cfg.ritualNote+"</div>";
  // 材料
  h += "<div style='margin:8px 0'><b>仪式材料：</b>"+(matName||"（职业材料未定）")+"　";
  h += v49_hasMat() ? "<span style='color:#2f9e44'>已备齐 ✓</span>" : "<span style='color:#c92a2a'>未获取 ✗　<small>（可在职业之路/材料市场寻得）</small></span>";
  h += "</div>";
  // 研读
  h += "<div style='margin:8px 0'><b>研读典籍：</b>"+(bookName||"（无）")+"　";
  h += v49_hasBook() ? "<span style='color:#2f9e44'>已研读 ✓</span>" : "<span style='color:#c92a2a'>未研读 ✗　<small>（破境前研读对应典籍可增成功率）</small></span>";
  h += "</div>";
  // 护法选择
  h += "<div style='margin:8px 0'><b>护法：</b>";
  const gd = (jc.guardian)||{};
  ["tutor","senior","friend","none"].forEach(function(k){
    const d = gd[k]||{};
    const sel = S.btGuardian===k ? " style='border:2px solid #8b6f47;background:rgba(139,111,71,.12);font-weight:bold'" : "";
    h += "<button class='btn' onclick='S.btGuardian=\""+k+"\";v49_openBreakthrough()' "+sel+">"+guardianNames[k]+"<br><small style='font-weight:normal'>"+(d.name||"")+" · "+(d.bonus>=0?"+"+d.bonus:d.bonus)+"分 化解"+(d.rescue||0)+"%</small></button>";
  });
  h += "</div>";
  // 地点选择
  h += "<div style='margin:8px 0'><b>破境地点：</b>";
  ["sacred","safe","wild"].forEach(function(k){
    const d = (jc.place||{})[k]||{};
    const sel = S.btPlace===k ? " style='border:2px solid #8b6f47;background:rgba(139,111,71,.12);font-weight:bold'" : "";
    h += "<button class='btn' onclick='S.btPlace=\""+k+"\";v49_openBreakthrough()' "+sel+">"+placeNames[k]+"<br><small style='font-weight:normal'>"+(d.name||"")+" · "+(d.bonus>=0?"+"+d.bonus:d.bonus)+"</small></button>";
  });
  h += "</div>";
  // 判定说明
  h += "<div style='margin:10px 0;padding:8px 10px;background:rgba(139,111,71,.08);border-radius:8px;font-size:13px;color:#5a6a7a'>破境为<b>三重判定</b>：心境 → 根基 → 天时，再叠加材料/典籍/护法/地点。低阶较顺，高阶必生变数。</div>";
  h += "<div style='text-align:center;margin:12px 0'><button class='btn-gold' onclick='v49_doBreakthrough()'>开始破境</button></div>";
  h += "<div id='bt-result' style='margin-top:10px;font-size:13px;white-space:pre-wrap'></div>";
  h += "</div></div>";
  openModal(elFromHtml(h));
}
function v49_rollStep(label, roll, target, pass, passTxt, failTxt){
  writePar("── "+label+" ──","noind flagline");
  writeDice(roll, target, pass?"ok":"fail");
  writePar(pass?passTxt:failTxt, pass?"narration":"warn");
  return pass;
}
function v49_doBreakthrough(){
  try{ clearOptions(); }catch(e){}
  const realm = (typeof S.realm==="number")?S.realm:0;
  if(realm>=8) return;
  const cfg = v49_jobConf() || {};
  const jc = BREAKTHROUGH_V49.byJob[S.job]||{};
  const j = JOBS[S.job]||{};
  const gk = S.btGuardian||"none", pk = S.btPlace||"safe";
  const gd = (jc.guardian||{})[gk]||{}, pd = (jc.place||{})[pk]||{};
  const gDef = BREAKTHROUGH_V49.guardianDef[gk], pDef = BREAKTHROUGH_V49.placeDef[pk];
  const next = realm+1;
  // 关闭面板，转入剧情区演出
  closePanel();
  writePar("","noind");
  writePar("━━ 破境 · "+BREAKTHROUGH_V49.realmNames[realm]+" → "+BREAKTHROUGH_V49.realmNames[next]+" ━━","noind flagline");
  writePar("仪式：「"+(cfg.ritual||"晋阶")+"」","noind flagline");
  // 预兆演出
  if(cfg.omens && cfg.omens.length){ cfg.omens.forEach(function(t){ writePar(t); }); }
  // 三重判定
  const spr = (S.attrs&&S.attrs.SPR)?S.attrs.SPR:50;
  const main = v49_mainAttr();
  let score = 0;
  // 一、心境
  const t1 = 55 + realm*4 + Math.floor(spr/10) + v52_breakthroughBonus("mind");
  const r1 = rollD100();
  const ok1 = r1<=t1;
  score += ok1?10:-5;
  if(!ok1){ S.san=Math.max(0,(S.san||100)-5); }
  v49_rollStep("第一重 · 心境", r1, t1, ok1,
    (cfg.pass1)||"你的呼吸慢下来。外界的喧嚣退远，只剩下丹田里那团力量，安静地等着你。",
    (cfg.fail1)||"杂念涌了上来。旧日的懊悔、来日的忧虑，全在这一刻挤进心头。你的气息乱了。");
  // 二、根基
  const t2 = 55 + realm*6 + Math.floor(main/8) + v52_breakthroughBonus("root");
  const r2 = rollD100();
  const ok2 = r2<=t2;
  score += ok2?40:-10;
  v49_rollStep("第二重 · 根基", r2, t2, ok2,
    (cfg.pass2)||"你盘坐如桩，任那股力量在经脉里走了三圈。每走一圈，都更驯服一分。",
    (cfg.fail2)||"力量撞在瓶颈上，纹丝不动。你咬紧牙关再催，反倒震得五脏发麻。");
  // 三、天时
  const r3 = rollD100();
  let t3 = 0;
  if(r3 <= 35+realm*5){ t3 = 8; writePar("── 第三重 · 天时 ──","noind flagline"); writeDice(r3, 35+realm*5, true); writePar("这一日的风、光、潮汐都向着你。冥冥之中，好像有什么在为你让路。","narration"); }
  else if(r3 >= 95){ t3 = -8; writePar("── 第三重 · 天时 ──","noind flagline"); writeDice(r3, 100, false); writePar("偏偏是这个时候——窗外起了雷暴，远处传来狼嚎。天地都在躁动，不肯安静。","warn"); }
  else { writePar("── 第三重 · 天时 ──","noind flagline"); writeDice(r3, 100, true); writePar("天时平平。不好不坏，宜静不宜动。","narration"); }
  score += t3;
  // 要素
  let elems = [];
  if(v49_hasMat()){ score+=10; elems.push("材料齐备+10"); } else { score-=5; elems.push("材料未备-5"); }
  if(v49_hasBook()){ score+=10; elems.push("典籍研读+10"); }
  score += gDef.bonus; elems.push("护法"+(gDef.bonus>=0?"+":"")+gDef.bonus);
  var _v53gb = (window.v53_guardianBonus)?v53_guardianBonus():0;
  if(_v53gb){ score += _v53gb; elems.push("强者护法+"+_v53gb); }
  score += pDef.bonus; elems.push("地点"+(pDef.bonus>=0?"+":"")+pDef.bonus);
  writePar("── 要素 ──","noind flagline");
  writePar(elems.join("　·　"),"narration");
  writePar("破境判定总分："+score+"（"+(realm<=3?"低阶线 50":"高阶线 60")+"）","noind flagline");
  const passLine = realm<=3 ? 50 : 60;
  // 危机判定（高阶）
  let crisisFired = false;
  if(realm>=3){
    let crisisChance = realm*7 + pDef.crisis + (gk==="none"?15:0) - gDef.rescue*0.3;
    crisisChance = Math.max(5, Math.min(70, Math.round(crisisChance)));
    const cr = rollD100();
    if(cr <= crisisChance) crisisFired = true;
  }
  if(crisisFired){
    writePar("","noind");
    writePar("── 变故 ──","noind flagline roll-fail");
    v49_crisisRun(realm, score, passLine, cfg);
  } else {
    v49_finish(score>=passLine, realm, score, passLine, cfg);
  }
}
function v49_crisisRun(realm, score, passLine, cfg){
  const jc = BREAKTHROUGH_V49.byJob[S.job]||{};
  const pool = (jc.crises&&jc.crises.length)?jc.crises:null;
  const crisis = pool ? pool[Math.floor(Math.random()*pool.length)] : null;
  if(!crisis){
    v49_finish(score>=passLine, realm, score, passLine, cfg);
    return;
  }
  S._btCrisis = {score:score, passLine:passLine, realm:realm, title:crisis.title, cfg:cfg};
  writePar("「"+crisis.title+"」","noind flagline");
  crisis.text.forEach(function(t){ writePar(t); });
  const opts = crisis.opts||[];
  const btns = [];
  opts.forEach(function(o){
    btns.push("<button class='btn' onclick='v49_crisisPick(\""+o.id+"\")'>"+o.t+"</button>");
  });
  try{ clearOptions(); }catch(e){}
  const wrap = document.createElement("div");
  wrap.innerHTML = btns.join("");
  while(wrap.firstChild) document.getElementById("options").appendChild(wrap.firstChild);
}
function v49_crisisPick(id){
  const st = S._btCrisis; if(!st) return;
  const jc = BREAKTHROUGH_V49.byJob[S.job]||{};
  const cfg = st.cfg||jc;
  const crisis = (jc.crises||[]).find(function(c){ return (c.opts||[]).some(function(o){ return o.id===id; }); });
  const opt = (crisis&&crisis.opts||[]).find(function(o){ return o.id===id; });
  if(!opt) return;
  const statVal = function(k){
    if(k==="CON") return (S.attrs&&S.attrs.CON)||40;
    if(k==="STR") return (S.attrs&&S.attrs.STR)||40;
    if(k==="AGI") return (S.attrs&&S.attrs.AGI)||40;
    if(k==="INT") return (S.attrs&&S.attrs.INT)||40;
    if(k==="CHA") return (S.attrs&&S.attrs.CHA)||40;
    if(k==="SPR") return (S.attrs&&S.attrs.SPR)||40;
    if(k==="SURVIVE") return (S.attrs&&(S.attrs.SURVIVE||S.attrs.SUR))||40;
    return 40;
  };
  const target = 55 + statVal(opt.stat)*0.4;
  const roll = rollD100();
  const pass = roll <= target;
  writeDice(roll, Math.round(target), pass?"ok":"fail");
  (pass?opt.pass:opt.fail).forEach(function(t){ writePar(t, pass?"narration":"warn"); });
  clearOptions();
  if(pass){
    writePar("危机渡过。破境之势不减反增，判定总分 +15。","hint");
    v49_finish(st.score+15>=st.passLine, st.realm, st.score+15, st.passLine, cfg);
  } else {
    S.san=Math.max(0,(S.san||100)-10);
    S.hp=Math.max(1,S.hp-Math.floor((S.maxHp||100)*0.15));
    writePar("危机未平。你受了伤，破境被迫中断。","warn");
    v49_finish(false, st.realm, st.score, st.passLine, cfg);
  }
}
function v49_finish(ok, realm, score, passLine, cfg){
  try{ clearOptions(); }catch(e){}
  const next = realm+1;
  if(ok){
    S.realm = next;
    S.maxHp = (S.maxHp||100)+20; S.hp = S.maxHp;
    S.maxMp = (S.maxMp||50)+10; S.mp = S.maxMp;
    writePar("","noind");
    writePar("━━ 破境成功 · "+BREAKTHROUGH_V49.realmNames[next]+" ━━","noind flagline");
    if(cfg.success) cfg.success.forEach(function(t){ writePar(t); });
    try{ v50_aftermath(S.job, next); }catch(e){}
    try{ v51_onBreakthrough(next); }catch(e){}
    addLog("破境！晋入【"+BREAKTHROUGH_V49.realmNames[next]+"】"+(JOBS[S.job]&&JOBS[S.job].titles?(" · "+JOBS[S.job].titles[next]):""),"achievement");
    try{ v44_breakthroughFX(true); }catch(e){}
  } else {
    writePar("","noind");
    writePar("━━ 破境失败 ━━","noind flagline roll-fail");
    if(cfg.fail) cfg.fail.forEach(function(t){ writePar(t,"warn"); });
    S.flags["v49heart_"+S.job] = 1;
    S.hp = Math.max(1,(S.hp||100)-Math.floor((S.maxHp||100)*0.1));
    S.san = Math.max(0,(S.san||100)-10);
    addLog("破境失败，留下心魔。可择日再试。","combat");
    try{ v44_breakthroughFX(false); }catch(e){}
  }
  try{
    if(!S.btHistory) S.btHistory = [];
    S.btHistory.push({realm:next, job:S.job, guardian:S.btGuardian, place:S.btPlace, ok:ok, day:S.day||0});
    if(S.btHistory.length>50) S.btHistory = S.btHistory.slice(-50);
  }catch(e){}
  renderTop(); renderStats();
  writePar("","noind");
  const b = document.createElement("button"); b.className="opt";
  b.innerHTML = "<span class='od'>◆</span> 返回游戏";
  b.onclick = function(){ closePanel(); };
  document.getElementById("options").appendChild(b);
}
function v49_readBook(){
  const book = v49_bookName();
  if(!book){ flashMsg("当前境界没有对应典籍。"); return; }
  if(v49_hasBook()){ flashMsg("已研读过《"+book+"》。"); return; }
  S.flags["v49book_"+S.job+"_"+S.realm] = 1;
  writePar("你翻开《"+book+"》。字句在灯下泛着旧纸的暖黄，读到第三遍时，某一段忽然通了——像门缝里漏进一线光。","narration");
  flashMsg("研读《"+book+"》完成，破境成功率提升。");
  addLog("研读《"+book+"》","lore");
}

/* ===== v50 破境后专属剧情 ===== */
const AFTERMATH_V50 = {};
/*v50inj:ame*/

AFTERMATH_V50["盗贼"] = {
  "2": { title:"暗影阁入门", text:[
    "凝元那夜，暗影阁的执事把你带到一间没有门的屋子前。他推开门——屋里没有灯，只有地面上一层细灰，平整得不像有人来过。",
    "他站在门口：“进去，走一圈，出来。灰上不许有脚印。”",
    "你走进黑暗里。灰很细，踩上去像踩在云上。你忽然明白，这一课教的不是脚步——是“存在”和“不存在”之间的那道缝。"
  ], opts:[
    { t:"走——轻到连灰都不惊动", gainText:"你迈出第一步，没有声音。", follow:["你走完一圈，站在门口回头——灰面平整如初，像没有人进去过。执事看了很久，点了点头：“行了。从今天起，暗影阁的夜巡，有你一个。”他没有夸你，但你知道，这比任何夸都重。"], effect:function(){ S.attrs.AGI=(S.attrs.AGI||0)+3; S.flags["v50_盗贼_夜巡"]=1; } },
    { t:"不走——先问他一句“为什么要学这个”", gainText:"你站在门口，没有进去。", follow:["执事没有回答，只反问你：“你偷东西，是为了让东西是你的，还是为了让东西'不是别人的'？”你答不上来。他侧身让你进屋：“想明白再走。灰等着你。”"], effect:function(){ S.flags["v50_盗贼_问心"]=1; } }
  ]},
  "4": { title:"无影之名", text:[
    "宗师那日，暗影阁的影壁上多了一个名字。名字没有刻，是浮上去的——像一层很薄的影子，贴着石面。",
    "执事站在影壁前，说：“无影，是暗影阁给“影子里没有破绽的人”的称呼。你有了。”他顿了顿，“但它也是悬着的——影壁上的名字，随时会淡。什么时候你的手不干净了，它就先一步消失。”",
    "你站在影壁前，看着自己那个浮着的名字，像看着水里的月亮。"
  ], opts:[
    { t:"收下“无影”——手不干净，名字自会淡", gainText:"你朝影壁点了点头。", follow:["那天起，暗影阁的夜巡名单上，你那一栏不再写名字，只写“无影”。你走过的地方，影子比人慢半拍——后来，是影子跟着你，不是你跟着影子。"], effect:function(){ S.flags["v50_盗贼_无影"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; } },
    { t:"不收——“无影”太轻，我担着有影的名字", gainText:"你退后一步，没有碰影壁。", follow:["执事看了你一会儿：“那你的名字，就留在影壁外。”他没有多说。你走出暗影阁时，回头看了一眼——你的名字没有浮上影壁，但门口那盏灯，为你多亮了一刻。"], effect:function(){ S.flags["v50_盗贼_自担名"]=1; } }
  ]},
  "6": { title:"暗影宴", text:[
    "传奇那日，一张黑色的请柬落在你的窗台上。没有署名，只有一行字：“今夜，无灯之宴。请带一件你偷过的最重的东西。”",
    "你翻遍记忆，发现自己偷过的最重的东西，不是金器，不是秘卷——是一件你一直没敢告诉任何人的事。",
    "你握着请柬，窗外夜色正浓。"
  ], opts:[
    { t:"赴宴——带那件最重的事", gainText:"你合上请柬，起身。", follow:["无灯之宴上，没有人看你带的东西——他们带的都是自己最重的事。宴罢，主持者只说了一句：“能带得动自己最重的事赴宴的人，担得起'传奇'两个字。”你走出宴厅时，那件最重的事，轻了一点。"], effect:function(){ S.flags["v50_盗贼_赴暗宴"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } },
    { t:"不赴宴——最重的东西，不该给别人看", gainText:"你把请柬压进箱底。", follow:["第二天，请柬消失了，像从没来过。你知道，暗影阁有暗影阁的规矩——不去，也是一种答案。你把那件最重的事重新藏好，藏得比从前更深。"], effect:function(){ S.flags["v50_盗贼_不赴宴"]=1; } }
  ]},
  "7": { title:"影中王座", text:[
    "半神那夜，你发现自己站在一片影子的国度里。没有光，但你能看见一切——每一道影子里，都坐着一个曾经存在过的人的形状。",
    "影子的最深处，有一张王座。它没有实体，是一团浓得化不开的暗。你走近时，暗里传来一个声音：“坐上来，影子就听你的。你的影子，也听你的。”",
    "你站在王座前，身后是自己投下的、长长的影子。"
  ], opts:[
    { t:"坐上去——让影子听你的", gainText:"你转身，背对王座，坐下。", follow:["你坐下那一刻，满国的影子都朝你躬身——包括你自己的。你没有觉得强大，只觉得安静。你坐在暗里，第一次看清：影子听你的，是因为你肯坐在它们前面。"], effect:function(){ S.flags["v50_盗贼_影王"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; } },
    { t:"不坐——影子不是王座，是同行者", gainText:"你站在王座旁，没有坐下。", follow:["满国的影子没有躬身，只是晃了晃，像点了点头。那团暗沉默了很久，说：“不坐王座的人，影子会跟着他走一辈子。”你说：“那正好——我本来就没打算甩开它。”"], effect:function(){ S.flags["v50_盗贼_影同行"]=1; } }
  ]},
  "8": { title:"影之神", text:[
    "神话那日，你站在光与暗交界的地方。左边是亮到没有影子的世界，右边是暗到没有形状的世界。你站在中间，身后拖着一道极长的影子。",
    "那道影子忽然开口——不是你的声音，是很多人的声音叠在一起：“你成了神。你要把我们，带到哪一边？”",
    "你低头看自己的影子。它很旧了，从你第一次在灰上学会轻手轻脚那天起，就跟着你。"
  ], opts:[
    { t:"把影子带向光——让它们也晒晒太阳", gainText:"你朝光的那一边，迈出一步。", follow:["你走到光里，影子没有消失——它在你脚下拉得更长，像一条新铺的路。你听见那很多人的声音轻舒了口气。那天起，光与暗交界的地方，多了一道不散的影子——是给所有不敢见光的人，留的桥。"], effect:function(){ S.flags["v50_盗贼_影入光"]=1; } },
    { t:"留在交界处——光与暗，都该有影子", gainText:"你在交界处站定，没有迈步。", follow:["你在那里站了很久。后来，有人路过交界处，看见一道极长的影子立在光与暗之间，既不偏左，也不偏右——像一盏不点火的灯。他们叫它：守界的人。"], effect:function(){ S.flags["v50_盗贼_守界"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]}
};

AFTERMATH_V50["牧师"] = {
  "2": { title:"圣堂晨钟", text:[
    "凝元那日清晨，圣堂的晨钟多敲了一下。神父站在钟楼底下，仰头等钟声落完，才转身对你说：“钟楼的老规矩：多敲的一下，是给“第一次听见自己祷词的人”听的。”",
    "他顿了顿：“你凝元了。从今天起，你念的祷词，圣堂会当真。”",
    "晨光从钟楼的窗格漏下来，落在你们之间。"
  ], opts:[
    { t:"“那我把祷词念得再真一点。”", gainText:"你走进圣堂，跪在祭坛前。", follow:["你念的祷词没有变，但你念的时候，手不抖了。神父在门外听了一会儿，没有进去，只把门悄然带上——他知道，有些祷词，不该有人听。"], effect:function(){ S.attrs.SPR=(S.attrs.SPR||0)+3; S.flags["v50_牧师_真祷"]=1; } },
    { t:"“多敲的一下，是敲给谁的？”", gainText:"你站在钟楼下，仰头问。", follow:["神父想了想，说：“敲给那个'不知道自己念的是什么'的你。从今天起，你知道了。”他没有多解释。你站在钟楼下，把那多出来的一下，在心里又敲了一遍。"], effect:function(){ S.flags["v50_牧师_问钟"]=1; } }
  ]},
  "4": { title:"圣徒之名", text:[
    "宗师那日，圣城的圣徒名录上，补上了你的名字。执笔的老书记员写得很慢，写完又看了一遍，才对你说：“圣徒名录，三百年没添过新名字了。”",
    "他把笔搁下：“你要记住——圣徒不是圣堂封的，是活着的人用日子养出来的。名录只是记下，不是封你。”",
    "窗外，圣城的钟正敲过午时。"
  ], opts:[
    { t:"“我知道。名字是借的，日子是自己过的。”", gainText:"你在名录前站了一会儿。", follow:["老书记员听完，把你的名字又看了一遍，点了点头：“那你过好日子，别辜负这个字。”他合上名录。你知道，从今天起，圣城的人看你的眼神，会多一样东西——那是期待，也是秤。"], effect:function(){ S.flags["v50_牧师_圣徒名"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; } },
    { t:"“请划掉它。圣徒不是我该背的名字。”", gainText:"你请老书记员划掉名字。", follow:["老书记员没有划，只把名录合上：“名字写上去容易，划掉也容易。但你自己心里那本账，划不掉。”他顿了顿，“你什么时候觉得担得起了，再来，我替你写上。”你走出圣堂，觉得那句话，比名录重。"], effect:function(){ S.flags["v50_牧师_不背名"]=1; } }
  ]},
  "6": { title:"圣光洗礼", text:[
    "传奇那日，圣堂的彩窗全亮了——不是烛火，是光自己从窗格里渗进来，落成一地碎金。神父在祭坛前等你，手里捧着一只旧银杯。",
    "“圣光洗礼，一生一次。”他说，“洗礼之后，你念的祷词，会带圣光的分量。分量不是恩赐，是债——你每次用它，都欠圣光一点。”",
    "银杯里的水很静，映着彩窗的光。"
  ], opts:[
    { t:"受洗——接住圣光的分量", gainText:"你跪下来，接过银杯。", follow:["水是凉的，落进喉咙却暖。你站起来时，彩窗的光落满你全身。神父看着你，只说了一句：“债记下了。”你点头：“我知道。”你走出圣堂，阳光落在肩上——你第一次觉得，光是有重量的。"], effect:function(){ S.flags["v50_牧师_受洗"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } },
    { t:"不受洗——圣光的分量，你自己扛", gainText:"你谢过神父，没有接杯。", follow:["神父把银杯收回去，没有强求：“不受洗的人，祷词不带光，但带人味。”他把彩窗的帘子拉开一线，“圣光有圣光的路，你有你的路。两条路，都通圣堂。”"], effect:function(){ S.flags["v50_牧师_不受洗"]=1; } }
  ]},
  "7": { title:"圣者加冕", text:[
    "半神那夜，圣城的钟声忽然自己响起来——没有钟手，十二口钟挨个儿响，响完十二下，又停。全城的人都醒了，只有你知道为什么。",
    "你站在圣堂顶楼，看着脚下的圣城。灯火一盏盏亮起来，像谁在夜空里点数。",
    "一个声音在你身后响起，很轻：“三千年前，圣者加冕那夜，钟也是自己响的。你听见了吗——它们在认你。”"
  ], opts:[
    { t:"加冕——圣者的路，你接着走", gainText:"你转身，面向圣城。", follow:["钟声又响了一遍，这回是十三下——多出的一下，是敲给三千年前那个人的。你站在钟声里，没有觉得荣耀，只觉得路长。你知道，从今夜起，圣城的灯火，有一盏是为你看的。"], effect:function(){ S.flags["v50_牧师_加冕"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; } },
    { t:"不加冕——钟认你，你不认钟", gainText:"你没有转身，看着脚下的灯火。", follow:["钟声没有再响。那个声音沉默了很久，说：“不加冕的圣者，圣城会记成'那个不肯戴冠的人'。”你说：“那就记吧。”你站在顶楼，没有戴任何冠——灯火一盏盏亮着，像不需要谁来认领。"], effect:function(){ S.flags["v50_牧师_不戴冠"]=1; } }
  ]},
  "8": { title:"圣光之神", text:[
    "神话那日，你站在圣城最高的钟楼顶上。脚下是圣城，是圣城之外的大陆，是大陆之外所有听过祷词的地方。",
    "你身后的圣光，不再是落下来的——是你自己亮起来的。它不刺眼，像一件穿了很多年的旧衣。",
    "你听见三千年前那个声音：“你成了光。你打算，照到哪里？”"
  ], opts:[
    { t:"照到没人念祷词的地方去", gainText:"你迈出一步，脚下的光铺成一条路。", follow:["你走过的地方，光没有耀眼，只是悄悄亮着，像给走夜路的人留的灯。多年后，有人问：圣光之神去了哪里？没有人答得上来。只有走夜路的人知道，有一盏灯，一直亮在他们前面。"], effect:function(){ S.flags["v50_牧师_光照无祷"]=1; } },
    { t:"留在圣城——光要有个家", gainText:"你站定，没有迈步。", follow:["你留在钟楼顶，守着圣城的光。城里的灯火一盏盏亮起，又熄灭，又亮起——像呼吸。你知道，光要有个家，才有人记得回来。你守在这里，就是替所有走夜路的人，留一盏不灭的灯。"], effect:function(){ S.flags["v50_牧师_守光为家"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]}
};

AFTERMATH_V50["商人"] = {
  "2": { title:"金秤学徒", text:[
    "凝元那夜，金秤家族的执事把你带进账房，从最高一格取下一只旧木盒。盒里不是账本，是一杆很小的秤——秤盘上落着灰，秤杆上刻着“学徒”两个字。",
    "执事把秤放在你面前：“金秤家的人，一辈子只用一杆秤。学徒的秤，称的是货；以后你的秤，称什么，你自己定。”",
    "他把灰吹掉，秤杆在灯下露出温润的木纹。"
  ], opts:[
    { t:"接过秤——“先称货，再称别的。”", gainText:"你接过那杆小秤。", follow:["你第一次用那杆秤，称的是一袋盐。秤得很准。执事在旁边看着，说：“称盐准，不稀奇；稀奇的是，你没有嫌它小。”他把账房的门钥匙也给了你一把。"], effect:function(){ S.attrs.CHA=(S.attrs.CHA||0)+2; S.flags["v50_商人_金秤学徒"]=1; } },
    { t:"不接秤——“我想先想想，我的秤该称什么。”", gainText:"你把秤推回去。", follow:["执事没有收，把秤放在你手边：“秤不急着接。你哪天想明白了，它就在这儿。”你走出账房，回头看了一眼——那杆小秤摆在柜台上，像一粒等着发芽的种子。"], effect:function(){ S.flags["v50_商人_想秤"]=1; } }
  ]},
  "4": { title:"商会席位", text:[
    "宗师那日，自由商会的长桌上，有人提了你的名字。老商人们争执的不是你赚多少，而是你“赚得干不干净”。",
    "会长把一只旧茶杯放在桌上：“我年轻的时候，也被人这么争过。后来我学会了一件事——让别人争你的账，不如让账自己说话。”",
    "他转向你：“你的账，会说人话吗？”"
  ], opts:[
    { t:"“会说。我每一笔账，都记得住来路。”", gainText:"你把自己最得意的三笔账，当众算了一遍。", follow:["你算得很慢，每一笔的来路、去路、经手人，都清清楚楚。会长听完，把那只旧茶杯推到你面前：“坐。这席位，账替你挣的。”你坐下时，长桌上没有人再争了。"], effect:function(){ S.flags["v50_商人_入席"]=1; S.attrs.INT=(S.attrs.INT||0)+2; } },
    { t:"“我的账，不给人看。信我的人，不看账也信。”", gainText:"你没有算账，只说了这一句。", follow:["长桌静了一会儿。会长把茶杯收回去，说：“不看账也信你的人，你这一辈子，能数出几个？”你说：“三个。”会长点了点头：“那够了。席位留着，等你想算账那天。”"], effect:function(){ S.flags["v50_商人_信人"]=1; } }
  ]},
  "6": { title:"传奇商团", text:[
    "传奇那日，你的商团在北方冻土上丢了一批货——不是被劫，是暴风雪。货埋在雪里，找不回来。你跟货主说好了赔偿，数目不小。",
    "当晚，你的老伙计把钱匣抱来：“要不……少赔点？货主也说不清损失。”",
    "账房里的灯很暗，钱匣很重。"
  ], opts:[
    { t:"全赔——账清，路才走得远", gainText:"你把钱匣打开，数出全额。", follow:["货主拿到赔款时，愣了很久，最后只说了一句：“你们商团，我记下了。”第二年开春，他把整条北线的货，都交给了你。你后来跟老伙计说：那笔赔款，是你这辈子最值的一笔账。"], effect:function(){ S.flags["v50_商人_全赔"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; } },
    { t:"按约赔——合同怎么写，就怎么赔", gainText:"你按合同数出赔偿，分文不多。", follow:["货主接过钱，数也没数：“合同上写的数，你给了。”他顿了顿，“我原以为你们会少赔。你们没有。”他没有多说。第二年，他照样把货交给你——不是因为信任，是因为规矩。"], effect:function(){ S.flags["v50_商人_按约"]=1; } }
  ]},
  "7": { title:"黄金低语", text:[
    "半神那夜，你听见黄金在说话。不是某一块金子，是所有你经手过的钱——它们叠在一起，像一条很深的河，河底铺满了发亮的记忆。",
    "它们只问了一句：“你赚了这么多。你想过没有——钱最后会去哪儿？”",
    "你坐在账房中央，四面墙的账本都在呼吸。"
  ], opts:[
    { t:"“钱去哪儿，该由需要它的人定。”", gainText:"你打开钱匣，开始分账。", follow:["你分出三份：一份留在商团，一份散给沿路帮过你的人，一份放进一个谁也不知道的匣子——留给将来走投无路的人。分完账，你合上钱匣，觉得满屋的账本，呼吸都顺了。"], effect:function(){ S.flags["v50_商人_钱归人"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } },
    { t:"“钱是我的账，我记着就行。”", gainText:"你合上钱匣，没有分。", follow:["满屋的账本没有抗议，只是呼吸慢了下来。你坐在账房中央，守着那口钱匣，坐到天亮。你知道，那笔钱会一直在——但你有时会梦见，河底那些发亮的记忆，在问你同一个问题。"], effect:function(){ S.flags["v50_商人_守钱"]=1; } }
  ]},
  "8": { title:"财富之神", text:[
    "神话那日，你面前出现一本没有封面的账本。纸页空白，等着你写第一笔。",
    "你握着笔，忽然想起很多东西：学徒时那杆小秤、冻土上那笔全赔的账、会说话的账、黄金的低语。它们像账本上的旧账，一笔一笔，都有来路。",
    "账本在等你的第一笔。你落笔之前，它只问了一句：“你要记什么？”"
  ], opts:[
    { t:"记下“分”——财富的账，该从分开始", gainText:"你在第一页写下第一笔。", follow:["你记的不是收入，是分出去的账。一笔一笔，记到天光放亮。合上账本时，你知道这本账，会比任何财富都活得久——因为记它的人，先学会了分。"], effect:function(){ S.flags["v50_商人_财富之神"]=1; } },
    { t:"记下“守”——财富的账，先守后分", gainText:"你在第一页写下第一笔。", follow:["你记的是守住的东西：商团、信誉、那杆小秤、那句“不看账也信你”的话。合上账本时，你明白，守住的才是你的——分出去的，是给世界的。"], effect:function(){ S.flags["v50_商人_先守后分"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]}
};


AFTERMATH_V50["战士"] = {
  "2": { title:"演武场新血", text:[
    "凝元那夜，演武场的沙地被月光照得发白。你在场中央站了很久，把斗气收进拳缝里——第一次，它没有从指间漏出去。",
    "教官从阴影里走出来，手里拎着两坛酒：“凝元了？那就不是新兵了。”他把一坛放在你脚边，“新兵喝酒，是壮胆；凝元的人喝酒，是认路。”",
    "他先开了一坛，仰头灌了一口。月光落进坛口，晃了一下。"
  ], opts:[
    { t:"接过酒坛——“这条路，我认了。”", gainText:"你拍开泥封，也灌了一口。", follow:["酒很烈，从喉咙一路烧到丹田。教官看着你喝完，说：“从今天起，你的斗气里有酒的味了——这味儿，骗不了人。”他拎着空坛走了，把另一坛留给了你。"], effect:function(){ S.attrs.STR=(S.attrs.STR||0)+3; S.flags["v50_战士_认路"]=1; } },
    { t:"推开酒坛——“我认的是拳，不是酒。”", gainText:"你把酒坛放回他脚边。", follow:["教官看了你一会儿，没有生气，把两坛都拎走了：“行。拳认你，酒不认你，这也是一条路。”他走到场边，回头补了一句：“不过下次，我请你喝。”"], effect:function(){ S.flags["v50_战士_认拳"]=1; } }
  ]},
  "4": { title:"战旗之下", text:[
    "宗师那日，铁壁武道院的战旗升到了你那一杆。旗是新裁的，布上还没有一道战损的痕迹。",
    "旗手把旗杆递到你手里时，压低了声音：“老规矩，新旗先空悬三日。三日之内，若有人来挑战，你接不接？”",
    "你握着旗杆，能感觉到布面在风里一下一下地抖，像一颗还没落定的心。"
  ], opts:[
    { t:"接——旗在人在", gainText:"你把旗杆插进演武场中央。", follow:["三日里，来了七个人。你接了七场，赢了六场，平了一场。第七个人走的时候，朝你的旗拱了拱手。第四天清晨，旗杆上多了一道很浅的刀痕——是第七个人留的，他说：“这旗，值得一道痕。”"], effect:function(){ S.flags["v50_战士_战旗七战"]=1; S.attrs.STR=(S.attrs.STR||0)+2; } },
    { t:"不接——旗不是用来斗的", gainText:"你把旗卷起来，没有插进演武场。", follow:["教官没有多问，只说：“不接也行。旗插在战场上，比插在演武场有用。”你把旗收进军帐里。后来那杆旗，真的跟着你上了战场。"], effect:function(){ S.flags["v50_战士_旗随军行"]=1; } }
  ]},
  "6": { title:"军团请帖", text:[
    "传奇那日，北方军团的信使骑着快马赶到武道院，递上一封烫着军印的信。信上只有一行字：“军团缺一个能扛旗的人。你扛过，我们知道。”",
    "信使站在门口，没有催你，只补了一句：“元帅说，你接信之后，不用急着答。先想清楚，旗和拳，哪个是你。”",
    "信纸很轻，在风里卷着边。"
  ], opts:[
    { t:"从军——旗要插到战场上去", gainText:"你在信上签了名。", follow:["你随军团北上那天，武道院的老教官站在门口送你，没有说保重，只说：“旗插稳了，人就稳了。”后来那杆旗，在铁门关的风雪里立了七年，没倒过。"], effect:function(){ S.flags["v50_战士_军团之旗"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } },
    { t:"不从军——你的战场不只在北境", gainText:"你谢过信使，把信叠好收进怀里。", follow:["信使走时，回头看了你一眼：“元帅说，你若不来，就把信收好——那是军团给你留的位置。”你后来走遍大陆，那封信一直贴身带着，没有打开第二遍。"], effect:function(){ S.flags["v50_战士_独行"]=1; } }
  ]},
  "7": { title:"战神注视", text:[
    "半神那夜，你梦见一片古战场。风是干的，血是冷的，旗是倒的。战场中央站着一个巨大的影子，背对着你，肩上扛着一杆看不清颜色的旗。",
    "影子没有回头，声音却像从地底传上来：“三千年前，我也站在你现在站的地方。我选了扛旗，然后倒在了旗下面。”",
    "它顿了顿：“你现在，也站在我当年站的地方。你选什么？”"
  ], opts:[
    { t:"“我选扛旗——倒了再立起来。”", gainText:"你朝那杆倒下的旗走过去。", follow:["你握住旗杆，旗布在你手里抖了一下，没有碎。影子看着你，很久，说：“三千年前，我握着它的时候，它没有抖——它认得认命的人。”它说完，像风一样散了。你醒来时，手心还留着旗杆的温度。"], effect:function(){ S.flags["v50_战士_再立战旗"]=1; S.attrs.STR=(S.attrs.STR||0)+2; } },
    { t:"“我选拳——旗会倒，拳不会。”", gainText:"你没有碰那杆旗，朝影子握了握拳。", follow:["影子沉默了很久，说：“三千年前，我也这么想过。后来我发现，拳也会老。”它没有说完，就散了。你站在空荡荡的战场上，握着拳，站到天亮。"], effect:function(){ S.flags["v50_战士_只信拳头"]=1; } }
  ]},
  "8": { title:"战旗永立", text:[
    "神话那日，你站在一片没有风的地方。脚下是无数杆战旗，从你面前铺到天边——每一杆，都是一场打完的仗。",
    "你认出最远那一杆，是铁门关的风雪里立了七年的那杆。它没有倒，旗布却已经旧得发白。",
    "你朝它走过去时，所有的旗都轻摆了一下，像在给你让路。"
  ], opts:[
    { t:"立在铁门关那杆旧旗旁——让它不孤单", gainText:"你走过去，把你的旗插在它旁边。", follow:["两杆旗并肩立在风雪里，一旧一新。旧旗的旗布蹭着新旗的旗角，像两个老兵碰了碰肩。你站在它们中间，知道从今天起，铁门关的风雪里，永远有两杆旗。"], effect:function(){ S.flags["v50_战士_旗不孤"]=1; } },
    { t:"把自己的旗拔起来——让旧旗记住的，不只是你", gainText:"你走到旧旗前，没有插旗，只是握住旗杆，站了很久。", follow:["你走的时候，没有带任何一杆旗。旧旗在风里摆了一下，像在目送你。多年以后，有人问铁门关为什么有两杆旗——一杆立着，一杆在心里。你知道，那杆心里的旗，是你立的。"], effect:function(){ S.flags["v50_战士_心旗"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]}
};

AFTERMATH_V50["骑士"] = {
  "2": { title:"宣誓之夜", text:[
    "凝元那夜，圣骑士团的旧礼堂里只点着一支蜡烛。团长把誓词本推到你面前，纸页已经翻得起了毛边。",
    "“誓词可以改。”他说，“每个骑士念出来的誓词，都是自己的。你念之前，先想清楚——你这一生，要替什么守着什么。”",
    "烛火把誓词本的影子投在墙上，很稳。"
  ], opts:[
    { t:"念旧誓词——“守护弱小，直面强敌，不退缩。”", gainText:"你接过誓词本，一字一句念完。", follow:["团长听完，把蜡烛拨亮了一点：“旧誓词，重。你念得稳，我听见了。”他把誓词本推回给你：“从今天起，它归你。”你收好誓词本，走出礼堂时，月亮正从云后出来。"], effect:function(){ S.attrs.CHA=(S.attrs.CHA||0)+2; S.flags["v50_骑士_旧誓"]=1; } },
    { t:"改一句——“守护弱小，直面强敌，也守护自己。”", gainText:"你提笔，在誓词最后添了一笔。", follow:["团长看了你添的那句，没有说什么，只是把蜡烛吹熄了一根，留下一根：“改誓词的人，要有担得起改动的力气。你有了。”他起身离开，把你和那根蜡烛留在礼堂里。"], effect:function(){ S.flags["v50_骑士_新誓"]=1; } }
  ]},
  "4": { title:"圣骑士团", text:[
    "宗师那日，圣骑士团的圆桌上，有人提了你的名字。老骑士们争执了很久——有人觉得你太年轻，有人觉得你誓词改过，不够纯粹。",
    "最后，团长把一柄没有剑鞘的旧剑放在桌上：“这剑，是上一任圣骑士留下的。他说，剑鞘是给人看的，剑是给人用的。你们吵的，是剑鞘。”",
    "满桌静下来。团长转向你：“你来说，你是什么？”"
  ], opts:[
    { t:"“我是剑。剑鞘让各位操心。”", gainText:"你走到桌前，握住那柄旧剑。", follow:["你握剑的那一刻，满桌的老骑士都看见了剑身映出的火光。团长点了点头：“剑认主了。”那天起，圣骑士团的圆桌上，多了一把没有鞘的剑。"], effect:function(){ S.flags["v50_骑士_入团"]=1; S.attrs.STR=(S.attrs.STR||0)+2; } },
    { t:"“我是握剑的手。剑可以给任何人。”", gainText:"你没有接剑，只把手放在剑柄旁边。", follow:["团长看了你一会儿，把剑收回去：“手比剑难找。你留着。”他没有多解释。后来你才明白，他在你身上看见的，不是一柄剑，是一双愿意把剑递给别人的手。"], effect:function(){ S.flags["v50_骑士_执剑之手"]=1; } }
  ]},
  "6": { title:"守护之誓", text:[
    "传奇那日，北方一座小镇请你去守一个冬天。镇子很小，只有一个铁匠铺、一间酒馆、三十户人家。",
    "镇长把一串钥匙交给你：“镇子小，没什么值钱的。就这串钥匙——仓库的，粮仓的，还有教堂的。你都收着。”",
    "钥匙在手里很沉。你知道，这比任何军团的重甲都重。"
  ], opts:[
    { t:"收下钥匙——“这个冬天，我守。”", gainText:"你把钥匙串挂在腰间。", follow:["那个冬天，镇子的粮仓没有丢过一粒粮，教堂的门没有在夜里开过。开春时，镇长要收回钥匙，你却说：“再留一年吧——明年冬天，也许还要用。”镇长没有问为什么，只说：“那明年冬天，还等你。”"], effect:function(){ S.flags["v50_骑士_守冬"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } },
    { t:"不收钥匙——“守镇子，用不着钥匙。”", gainText:"你把钥匙推回去，指了指自己。", follow:["镇长愣了一下，把钥匙收回怀里：“那……那就靠你这个人了。”那个冬天，你没有钥匙，但镇子的每一扇门都为你开着。开春时，有人问镇长为什么不锁门，他说：“有人在，锁什么。”"], effect:function(){ S.flags["v50_骑士_人即锁"]=1; } }
  ]},
  "7": { title:"圣光加冕", text:[
    "半神那夜，圣光落在你肩上。你听见一个声音，很轻，像从圣堂彩窗的缝隙里漏进来：“三千年前，圣光选了一个人。他后来成了圣者。你是第二个。”",
    "你站在圣光里，没有觉得热，也没有觉得亮。你觉得它更像一件旧大衣——有人披过，留着他的体温。",
    "那声音又响：“你披上它，就要替三千年前那个人，把没走完的路走完。”"
  ], opts:[
    { t:"披上圣光——“路没走完，我来走。”", gainText:"你站直，让圣光落满肩头。", follow:["圣光落定那一刻，你想起很多人：团长、老骑士、北方小镇的镇长，还有那串钥匙。你知道，这条路不是从你开始的，也不会在你这里结束。"], effect:function(){ S.flags["v50_骑士_披圣光"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; } },
    { t:"不披——“圣光该自己走，不是披在谁身上。”", gainText:"你退后半步，让圣光落空。", follow:["那声音沉默了很久，说：“三千年前那个人，也这么说过。后来他发现，光自己走，走不远。”你没有接话。你站在圣光旁边，没有披上它——你选择跟着它走。"], effect:function(){ S.flags["v50_骑士_不披光"]=1; } }
  ]},
  "8": { title:"圣者之路", text:[
    "神话那日，你面前出现两条路。一条铺着旧砖，通向圣堂——砖缝里生着青苔，是三千年前圣者走过的路；一条没有路，只有一片光，通向你自己也说不清的地方。",
    "你站在岔路口，腰间那串钥匙轻响了一下。",
    "你想起那个冬天的钥匙、那柄没有鞘的剑、那句改过的誓词。它们像路标，立在两条路的路口。"
  ], opts:[
    { t:"走旧砖路——把圣者没走完的路走完", gainText:"你踏上旧砖路。", follow:["你走得很慢，每一步都踩实。砖缝里的青苔蹭着你的靴底，像三千年前那个人留下的脚印在等你。你走完这条路时，圣堂的门开着——不是为你开的，是本来就开着。"], effect:function(){ S.flags["v50_骑士_走完圣路"]=1; } },
    { t:"走向那片光——圣者没有走过的路，你走", gainText:"你离开旧砖路，走进光里。", follow:["光没有终点，你也没有停。你走了一天、一年、很多年。后来有人问，圣者之后是谁——没有人答得上来，因为那个人还在路上。你知道，那条路，就是你的圣堂。"], effect:function(){ S.flags["v50_骑士_自开新路"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } }
  ]}
};

AFTERMATH_V50["游侠"] = {
  "2": { title:"老橡树之约", text:[
    "凝元那夜，你在老橡树的树根下坐了一整夜。你摸到树皮上一道旧痕——是你十二岁那年，用木刀划的。痕已经长得很深，快被新皮盖住了。",
    "你把手按在那道痕上，树皮底下传来很慢的、很稳的搏动。像一颗睡着的心，被你的手心惊了一下。",
    "林间的猫头鹰叫了两声，像在问：你怎么回来了？"
  ], opts:[
    { t:"“我回来守林了。”", gainText:"你把手按在树皮上，没有移开。", follow:["老橡树的根须在你脚边轻动了动，像点头。你在树下坐了一夜，天亮时，肩上落了一层薄薄的露水——不是露水，是树替夜里守着你的人，还的一层凉。"], effect:function(){ S.flags["v50_游侠_守林约"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; } },
    { t:"“我只是路过。林子的路，我自己走。”", gainText:"你把手从树皮上移开。", follow:["树皮底下的搏动没有停，也没有追。你起身走时，听见身后一片叶子落下来，落在你踩过的脚印上——像林子在说：路我记下了。你走了很远，那片叶子还留在脚印上。"], effect:function(){ S.flags["v50_游侠_过客"]=1; } }
  ]},
  "4": { title:"林间信物", text:[
    "宗师那日，你发现箭囊里多了一支不是你的箭。箭杆是青色的，箭羽是某种你认不出的鸟羽，箭头上缠着一小段树皮——剥下来，里面刻着三个字：“往东走。”",
    "你顺着东边走了三天，在一条断溪边，看见一棵被雷劈断的老树。树心里空着，填满了萤火虫。",
    "萤火虫见了你，没有散。它们聚成一团，慢慢地，指向树洞深处。"
  ], opts:[
    { t:"进树洞——看看里面藏着什么", gainText:"你弯下腰，走进树洞。", follow:["树洞里没有东西，只有满壁的萤火虫，和一块嵌在树心里的石头。石头上刻着一幅很旧的地图——画的不是路，是这片森林的“脉”。你拓下那幅图，走出树洞时，萤火虫散了，像完成了什么事。"], effect:function(){ S.flags["v50_游侠_森林脉图"]=1; S.attrs.SURVIVE=(S.attrs.SURVIVE||S.attrs.SUR||40)+3; } },
    { t:"不进去——林子的秘密，不该由外来者挖", gainText:"你在树洞前站了很久，没有弯腰。", follow:["萤火虫见你不进，徐徐散开，回到树心里。你把那支青羽箭放回树洞口，转身走了。你走出很远，回头看了一眼——那棵断树在暮色里，像一盏没有点的灯。"], effect:function(){ S.flags["v50_游侠_不探秘"]=1; } }
  ]},
  "6": { title:"古老森林", text:[
    "传奇那日，你第一次走进银叶城以北的古老森林——那是精灵们也不敢深入的地方。树冠遮天，脚下是千年的落叶，踩上去没有声音。",
    "你在林心发现一片空地。空地中央立着一棵树，不是你见过的任何树种，树干上长着两排像眼睛一样的疤。",
    "那棵树开口了，声音像风穿过很多年的树洞：“我们等一个能听见我们说话的人，等了三百年。你听见了吗？”"
  ], opts:[
    { t:"“听见了。你们说：林在疼。”", gainText:"你把手放在树干上。", follow:["那两排'眼睛'慢慢闭上，又睁开，像眨了眨眼。你脚下的落叶轻浮起一层，又落回去——是林子在舒一口气。那天起，古老森林的每一棵树，都认得你的脚步声。"], effect:function(){ S.flags["v50_游侠_林认人"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } },
    { t:"“我没听见。但我听见了你们不想让人听见的那句。”", gainText:"你退后半步，看着那棵树。", follow:["那棵树沉默了很久，说：“你听见了不该听的。作为谢礼——也作为封口费——这片林子，以后为你留一条路。”它说完，落叶在你面前自动分开一条路。你走上去时，知道这条路会记得你。"], effect:function(){ S.flags["v50_游侠_林留路"]=1; } }
  ]},
  "7": { title:"森林低语", text:[
    "半神那夜，你听见整片森林在你耳边低语。不是一棵树，是所有树——从老橡树到古老森林最深处的古木，它们的声音叠在一起，像一条很长的河。",
    "它们只问了一个问题：“你成了半神。你会不会，离开林子？”",
    "你站在林间空地上，月光从树冠的缝隙漏下来，落成一片斑驳的银。"
  ], opts:[
    { t:"“不离开。林在哪儿，我在哪儿。”", gainText:"你在一棵老树旁坐下来。", follow:["森林的低语静了很久，然后你听见一片很轻的、像叹息又像笑的声音。树冠的月光亮了一分。你知道，从今天起，这片林子的每一片叶子，都算你的同族。"], effect:function(){ S.flags["v50_游侠_与林同在"]=1; S.attrs.SURVIVE=(S.attrs.SURVIVE||S.attrs.SUR||40)+2; } },
    { t:"“我会离开，也会回来。林是路，不是家。”", gainText:"你站起来，朝林外走了一步。", follow:["低语没有拦你。你走出一步，又一步，身后的树叶轻合拢。你走出林缘时，回头看了一眼——林子像一扇关了一半的门，门缝里漏着光，等你下次推开。"], effect:function(){ S.flags["v50_游侠_林是路"]=1; } }
  ]},
  "8": { title:"自然之神", text:[
    "神话那日，你站在森林最高处——不是任何树顶，是整片森林的“呼吸”之上。你看见每一条根须、每一片叶子、每一颗露珠，都亮着一粒极小的光。",
    "你想起老橡树树皮上那道你十二岁划的旧痕。它也亮着——在所有光的最前面。",
    "整片森林在你脚下，像一颗徐徐跳动的心。它在等你，说最后一句话。"
  ], opts:[
    { t:"“林在，我就在。这话，我替所有守林人说了。”", gainText:"你把手按在空气里——按在森林的心跳上。", follow:["你按下的那一刻，森林的光齐齐亮了一瞬，又齐齐暗下去，像眨了一次眼。老橡树那道旧痕上，长出了第一片新芽。你知道，那不是结束——是林子替你说的下一句话。"], effect:function(){ S.flags["v50_游侠_自然之神"]=1; } },
    { t:"“我不当神。我当那个在林子里走路的人。”", gainText:"你把手收回来，转身，沿着来路走下去。", follow:["森林的光跟着你的脚步，一盏一盏亮起来，又在你身后一盏一盏熄灭——像在送你，又像在等你回来。你走得很慢，每一步都踩实。你知道，这条路，你还会走很多年。"], effect:function(){ S.flags["v50_游侠_仍是行人"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; } }
  ]}
};


AFTERMATH_V50["魔法师"] = {
  "2": { title:"学派青苗", text:[
    "凝元那夜，元素学派的走廊比平时静。你推开教室门，看见老教授坐在窗边，桌上放着两盏油灯——一盏亮着，一盏熄着。",
    "他没回头，只说：“元素学派三十年没收过凝元的苗子了。你是自己进来的，还是被推着进来的？”",
    "你回答之前，他把熄着的那盏灯点亮。火苗跳起来时，他看了你一眼：“想清楚再说。灯一点，就不好退了。”"
  ], opts:[
    { t:"“我自己走进来的。我认这道门。”", gainText:"老教授没接话，把点着的灯推到你面前。", follow:["第二天，你的桌上多了一本手抄的《元素亲和笔记》，扉页写着他的名字。学派核心班的名单里，多了你。"], effect:function(){ S.attrs.INT=(S.attrs.INT||0)+3; S.flags["v50_法师_学派核心"]=1; } },
    { t:"“我不想被门框住。我认的是元素本身。”", gainText:"老教授把灯吹熄了，收进袖子里。", follow:["他站起来，从你身边走过，在门口停了一下：“那也行。自己点灯的人，我见过，都能走很远。”你留在空教室里，自己把那盏灯点亮了。"], effect:function(){ S.attrs.SPR=(S.attrs.SPR||0)+2; S.flags["v50_法师_自由学者"]=1; } }
  ]},
  "4": { title:"魔网签名", text:[
    "宗师那夜，你把名字刻入魔网深处。墨迹落定时，你发现名字旁边还有一行字——不是你的，是另一个名字，笔画极旧，像沉在海底很多年的锚。",
    "你认得那个名字：约两千年前，魔法之神陨落时，魔网上留的就是这个名字。它一直沉在那儿，没人敢碰。",
    "指尖悬在那行旧字上方，你忽然听见一声很轻的叹息，像风穿过没有门的房间。"
  ], opts:[
    { t:"追查这个名字——它不该只是传说", gainText:"你把那行旧字拓了下来。", follow:["此后数年，你总会梦见一片沉没的魔网，网的中央，那个名字在徐徐发光。你知道，有些故事，不是传说那么简单。"], effect:function(){ S.flags["v50_法师_追查神陨"]=1; } },
    { t:"不碰它——有些沉没，自有沉没的理由", gainText:"你收回手，把墨迹晾干。", follow:["你合上魔网那一刻，那声叹息又响了一次，然后彻底静了。你守着你的名字，没有回头。有些答案，不问也是一种选择。"], effect:function(){ S.attrs.INT=(S.attrs.INT||0)+2; S.flags["v50_法师_不究神陨"]=1; } }
  ]},
  "6": { title:"贤者议会来信", text:[
    "传奇那日，一只纸鹤落进你的窗台，翅膀上压着一枚金印——贤者议会的印。信上没有署名，只有一行字：“元素之争，七日后，议厅。阁下若来，请带一件自己最得意的证明。”",
    "你翻过信纸，背面还有一行小字，字迹与正面不同，像是谁补上去的：“议厅的门，向来只对两种人开：改变法则的人，和即将改变法则的人。”",
    "窗外，学院的钟刚敲过第七下。"
  ], opts:[
    { t:"应约——带着你最得意的证明", gainText:"你合上信，开始收拾行囊。", follow:["七日后，你站在议厅门口。门内灯火通明，门外的台阶上积着七年的旧雪——你踩上去，是第一双脚印。"], effect:function(){ S.flags["v50_法师_贤者之辩"]=1; S.attrs.INT=(S.attrs.INT||0)+2; } },
    { t:"回绝——你的法则不需要议会盖章", gainText:"你把信折回纸鹤的形状，放回窗台。", follow:["纸鹤没有飞走，它在你窗台上站了三天，然后自己燃成一粒青火，熄了。你知道，议会记住了你的名字——用另一种方式。"], effect:function(){ S.flags["v50_法师_拒入议会"]=1; } }
  ]},
  "7": { title:"法则低语", text:[
    "半神那夜，你听见元素法则的低语。它们不再是你掌心驯服的火焰与流水，而是围着你盘旋的、有重量的声音。其中一段，讲的是两千年前那场陨落。",
    "“他不是被杀的。”法则的声音像许多片叶子叠在一起，“他是自己走进沉没的。因为他看见了一个东西——我们至今不敢告诉你那是什么。”",
    "低语停住，等你问。四周的火焰，忽然全变成了青色。"
  ], opts:[
    { t:"“告诉我，他看见了什么。”", gainText:"法则沉默了很久。", follow:["第二天，你的掌心多了一道青色的纹路，像一枚旧印。你没有告诉任何人它的来历——有些知识，拿到手的那一刻，就开始了重量。"], effect:function(){ S.attrs.SPR=(S.attrs.SPR||0)+3; S.flags["v50_法师_神陨真相"]=1; S.san=Math.max(0,(S.san||100)-5); } },
    { t:"“别说了。我不想知道。”", gainText:"你把低语按回法则深处。", follow:["青色的火在你掌心静了一夜，然后退回灯芯。你守着那盏灯坐到天亮——有些门，你选择不推开，这也是一种守。"], effect:function(){ S.attrs.CON=(S.attrs.CON||0)+2; S.flags["v50_法师_守住底线"]=1; } }
  ]},
  "8": { title:"元素王座", text:[
    "神话那日，元素法则在你脚下铺成一条路。路的尽头，是一张空的王座——它等你等了很久，椅背上刻着的花纹，正是你毕生证明过的第一条法则。",
    "你走上台阶时，听见整个世界的元素在屏息。风停，火静，水收，土凝。",
    "王座上空无一物，只有一行小字，像刻给你看的：“上一任坐在这里的人，选择走进沉没。你会怎么选？”"
  ], opts:[
    { t:"坐上王座，效仿前任——守护法则，直到法则不需要守护", gainText:"你坐下了。", follow:["王座没有发光，没有异象。你只是坐在那里，像一个终于回到家的旅人。世界继续运转，元素继续呼吸。你知道，很久以后，会有人在你留下的名字旁边，再刻一行字。"], effect:function(){ S.flags["v50_法师_法则守护者"]=1; } },
    { t:"不坐——你毕生证明的，从来不是王座", gainText:"你从王座前走过，没有坐下。", follow:["你站在王座之后，面朝来路。风从你身边绕过，火在你掌心跳跃。你听见法则低语：“新法则之主。”它们说的不是王座，是你走过的那条路。"], effect:function(){ S.flags["v50_法师_新法则之主"]=1; S.attrs.INT=(S.attrs.INT||0)+3; } }
  ]}
};

AFTERMATH_V50["灵魂法师"] = {
  "2": { title:"观星台之约", text:[
    "凝元那夜，墨丘利在观星台等你。他面前摆着两杯茶，一杯是热的，一杯已经凉透。",
    "他把凉的那杯推给你：“凉了的那杯，是给还没决定要不要走这条路的人喝的。”他又把热的推近一寸：“这杯，是给你听完一句话之后选的。”",
    "他说：“灵魂之道没有回头路。你每一次施法，都会在灵界留下足迹。足迹多了，你就成了灵界的一部分。”"
  ], opts:[
    { t:"端起热茶——“我认了这条路。”", gainText:"墨丘利看着你喝完，把凉茶倒进花盆。", follow:["他倒茶的手很稳：“从今天起，你在灵界的足迹，我会替你看着。走吧——别回头。”你走下观星台时，觉得肩上的重量，比上楼时多了半分，也踏实了半分。"], effect:function(){ S.attrs.SPR=(S.attrs.SPR||0)+3; S.flags["v50_灵法_墨丘利之徒"]=1; } },
    { t:"端起凉茶——“我还想再想想。”", gainText:"墨丘利没有催你，只是把热茶收回来，自己喝了。", follow:["他喝完，说：“凉茶不坏路，只是走得慢。想清楚了再来——观星台的门，永远给你留着。”你下楼的脚步，比来时慢了半拍。"], effect:function(){ S.flags["v50_灵法_再思"]=1; } }
  ]},
  "4": { title:"灵界名单", text:[
    "宗师那夜，你第一次踏入灵界深处。那里立着一面碑，碑上刻着一份名单——全是名字，笔画深浅不一。",
    "你看见了自己的名字，刻在最后一栏，栏头写着两个字：“预备。”",
    "你伸手去摸那个名字，指尖触到碑面时，名字亮了一下。你听见碑后有声音，像很多个人叠在一起：“来都来了，不看看前面的名字吗？”"
  ], opts:[
    { t:"沿着名单往前看——看看谁在你前面", gainText:"你顺着一排排名字走过去。", follow:["你看见了很多名字：有的认得，是史书上的亡者；有的陌生，却让你脊背发凉——你数了数，名单上那些'预备'栏的名字，比'正式'栏的少得多。你回到自己的名字前，站了很久。"], effect:function(){ S.flags["v50_灵法_读过名单"]=1; } },
    { t:"不看——先把'预备'两个字划掉", gainText:"你伸出手，指腹压在那个名字上。", follow:["名字在你指下亮起来，'预备'两个字慢慢淡去，却没有消失，只是变得很浅。你收回手，知道这行字还会回来——直到你证明自己担得起为止。"], effect:function(){ S.attrs.SPR=(S.attrs.SPR||0)+2; S.flags["v50_灵法_要正式"]=1; } }
  ]},
  "6": { title:"亡者议席", text:[
    "传奇那日，灵界议会给你留了一张椅子。它摆在长桌最末，椅背上刻着你的名字——但椅子上积着灰，像很久没人坐过。",
    "长桌尽头，一个半透明的身影开口：“坐吧。这张椅子，等了你三十年。上一任坐它的人，坐上去之后，再没站起来过。”",
    "满座的视线都落在那张椅子上，像落在水面上的一片落叶。"
  ], opts:[
    { t:"坐下——灵界的事，该有活人的声音", gainText:"你拂掉椅上的灰，坐了下去。", follow:["你坐下的那一刻，长桌尽头的半透明身影点了点头：“好。你坐下了，就别想轻易起来。”你点头：“我没打算起来。”那天起，灵界议席上，第一次有了一个活人的声音。"], effect:function(){ S.flags["v50_灵法_亡者议席"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } },
    { t:"不坐——你只想做灵界的过客", gainText:"你没有坐下，在椅边站定。", follow:["长桌尽头的影子看了你一会儿，说：“也好。过客不沾因果，也带不走恩怨。”他把那张椅子上的灰又拂了拂，像替它留着。"], effect:function(){ S.flags["v50_灵法_灵界过客"]=1; } }
  ]},
  "7": { title:"灵魂天平", text:[
    "半神那夜，你看见一架天平，横在生界与灵界之间。一边放着生者的记忆——笑着的、哭着的、说了一半的话；一边放着亡者的安宁——合上的眼、松开的眉、做完的梦。",
    "天平没有偏向任何一边，只是悬在那里，等你。",
    "你走近时，听见自己心底有个声音问：“如果有一天，必须拿生者的记忆去换亡者的安宁，你换不换？”"
  ], opts:[
    { t:"“不换。两边的分量，都不该由我来掂。”", gainText:"你把天平按住住。", follow:["天平在你掌下颤了颤，最终没有倾向任何一边。你听见那个声音静了很久，说：“那你就守着它，谁也不许动。”从那天起，你成了天平的另一只砝码。"], effect:function(){ S.attrs.CON=(S.attrs.CON||0)+2; S.flags["v50_灵法_守天平"]=1; } },
    { t:"“换。安宁比记忆重——活着的人会自己记住。”", gainText:"你伸手，扶住亡者的那一端。", follow:["天平稍倾斜了一线。你没有松手，直到记忆那一端的光，自己亮起来——生者们还在记着，不需要谁来提醒。你松开手，天平自己回正了。"], effect:function(){ S.flags["v50_灵法_倾向安宁"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } }
  ]},
  "8": { title:"灵界之主", text:[
    "神话那日，灵界在你面前展开成一片没有边际的水面。水下是无数沉静的名字，水上是无尽流转的灯火——每一盏，都是一个活着的人的记忆。",
    "你站在这片水面上，没有沉下去。你听见整个灵界在问同一个问题：“你打算怎么管我们？”",
    "水面下，你的名字已经亮成了所有名字里最亮的那一个。"
  ], opts:[
    { t:"立下规矩——生者的记忆，亡者的安宁，谁也不许越界", gainText:"你开口，声音落进水里，荡开一圈圈涟漪。", follow:["从那天起，灵界有了第一条由活人立下的规矩。你站在水面上，看着那些名字一盏一盏亮起来，像一盏一盏点亮的灯。你知道，这条规矩会比你活得更久。"], effect:function(){ S.flags["v50_灵法_灵界立法"]=1; } },
    { t:"不立规矩——让水自己流", gainText:"你没有开口，只是站在水面上，看着它自己流转。", follow:["水面下的名字没有问第二遍。它们像流水一样，自己找到了去处。你站在原处，看着这片没有规矩的水，觉得它比任何规矩都活得久。"], effect:function(){ S.flags["v50_灵法_不立法"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; } }
  ]}
};

AFTERMATH_V50["术士"] = {
  "2": { title:"第一件作品", text:[
    "凝元那夜，你锻成人生第一件“活”的东西——一柄铁剑。它没有名字，但剑身在你收锤时会轻颤一下，像在应你。",
    "老师傅站在炉边，看了那把剑很久，说：“我锻了一辈子，锻出过会响的、会鸣的，没见过会颤的。”他顿了顿，“你给它起个名吧——起完名，它就跟你一辈子了。”",
    "炉火把你们两个人的影子投在墙上，一高一矮。"
  ], opts:[
    { t:"给它起名——“就叫‘应声’。”", gainText:"你把名字刻在剑格上。", follow:["刻完最后一笔，剑身颤了一下，像认了这个名字。老师傅在旁边看了一会儿，说：“行。剑认名，人认路——你俩都认了。”他把炉火添了添，火苗跳得很高。"], effect:function(){ S.flags["v50_术士_应声剑"]=1; S.attrs.STR=(S.attrs.STR||0)+2; } },
    { t:"不起名——“它还不到起名的时候。”", gainText:"你把剑挂在墙上，没有刻字。", follow:["老师傅没说什么，只把炉火压了压：“也行。名字这东西，急不得。你哪天觉得它配了，再刻。”那柄剑在墙上挂了很多年，每夜都会轻颤一下，像在等。"], effect:function(){ S.flags["v50_术士_未名之剑"]=1; } }
  ]},
  "4": { title:"熔火匠籍", text:[
    "宗师那日，熔火工坊的匠籍簿翻到了你那一页。你的名字被刻进“大师候选”一栏，笔迹是老师傅亲手落的——他练了很多年字，就为刻这一笔。",
    "他合上簿子，说：“大师候选，五年一评。评的不是手艺，是心。”他指了指自己的胸口，“手艺能练，心不能骗。你进去之后，每次落锤，都有人看着。”",
    "工坊里很静，只有炉火在响。"
  ], opts:[
    { t:"“我认。评就评。”", gainText:"你接过匠籍簿，把自己的名字看了一遍。", follow:["从那天起，你每次落锤，都有人远远看着。你没有觉得不自在——你锻的东西，本来就该给人看。五年后评匠那日，老师傅在簿上你的名字旁，落下了一个“成”字。"], effect:function(){ S.flags["v50_术士_大师候补"]=1; } },
    { t:"“候选可以，但我不等人评。”", gainText:"你谢过老师傅，没有入册。", follow:["老师傅把簿子合上，没有生气：“那也行。评出来的大师，是工坊的大师；自己走出来的，是路的大师。”他把你的名字从候选栏划掉，又在空白处添了一行小字：“自己走。”"], effect:function(){ S.flags["v50_术士_自证"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]},
  "6": { title:"大师工坊", text:[
    "传奇那日，你有了自己的工坊。炉是新的，砧是旧的——老师傅把他用了一辈子的那块砧，搬来送给了你。",
    "第一批学徒站在门口，不敢进来。最小的那个探头问：“师父，我们第一课学什么？”",
    "你站在炉边，手里握着一把还没淬火的坯，忽然想起很多年前，自己也是这样站在别人门口问这句话的。"
  ], opts:[
    { t:"“第一课，学听。”", gainText:"你把坯放进炉里。", follow:["学徒们围着炉子坐成一圈。你没有教他们怎么锻，只让他们听火——听它什么时候急，什么时候缓，什么时候该落锤。最小的那个听了一下午，说：“师父，火在说话。”你说：“对。你听见了，就可以开始学了。”"], effect:function(){ S.flags["v50_术士_开山授徒"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; } },
    { t:"“第一课，学认自己。”", gainText:"你把坯举起来，让他们看。", follow:["“锻东西之前，先看看自己手里有什么——是铁，是坯，还是一团没想清楚的火。”学徒们似懂非懂。你笑了笑，把坯放进炉里：“不懂没关系，炉子会教你们。”"], effect:function(){ S.flags["v50_术士_授心"]=1; } }
  ]},
  "7": { title:"造物之魂", text:[
    "半神那夜，你忽然听见无数心跳。很轻，很远，但连成一片，像炉火里跳动的火星。",
    "你循声去找，最后发现，心跳声来自你的每一件造物——那柄挂了很多年的剑，那把旧砧，那些你随手锻过又送出去的东西，都在搏动。",
    "它们记得你的手。你站在工坊中央，第一次觉得，自己锻的不只是铁。"
  ], opts:[
    { t:"承认它们——“你们都是我。”", gainText:"你一件一件摸过去。", follow:["你摸到那柄“应声”时，它颤得比任何一次都响。你听见满屋子造物的心跳声连成一片，像一场迟来的合唱。半神之境，在你承认它们的时候，真正落定了。"], effect:function(){ S.flags["v50_术士_万物皆我"]=1; S.attrs.STR=(S.attrs.STR||0)+2; } },
    { t:"不承认——“你们是你们，我是我。”", gainText:"你站在它们中间，没有伸手。", follow:["心跳声没有停，但渐渐远了，回到它们各自的位置。你守着那柄“应声”，它在你手边颤了一下，像在说：不管你怎么想，我记着你。你站了很久，没再说第二遍。"], effect:function(){ S.flags["v50_术士_万物独立"]=1; } }
  ]},
  "8": { title:"锻造之神", text:[
    "神话那日，你面前出现一座炉——不是任何工坊的炉，是传说中神铸用的那口。炉膛里烧的不是火，是“万物成形之前的模样”。",
    "你握着那把旧锤——老师傅留给你的那把，锤柄上还留着他的手汗磨出的包浆。",
    "炉火问：“你成了神。你要锻什么？”"
  ], opts:[
    { t:"锻一把凡人也拿得动的锤——把火种留下", gainText:"你举起旧锤，落下第一锤。", follow:["你锻的是一把普通的锤，凡铁，凡柄，凡人都拿得动。你把它放在工坊门口，没有署名。多年后，有人用它敲开了一块石头，石头里躺着一颗种子——后来那里长出了一片林子。"], effect:function(){ S.flags["v50_术士_留下火种"]=1; } },
    { t:"锻一把只有神才举得动的锤——把路封上", gainText:"你举起旧锤，落下第一锤。", follow:["你锻的是一把无柄的锤，没有凡人能握。你把它沉进熔炉最深处，让它成为传说的一部分。有些路，走到尽头就该封上——你替后来者，把这道门关好了。"], effect:function(){ S.flags["v50_术士_封路"]=1; S.attrs.CON=(S.attrs.CON||0)+2; } }
  ]}
};


/* ===== v51 专长天赋树 + 神性/深渊双轴 ===== */
const FEATS_V51 = {};

FEATS_V51["魔法师"] = {
 "elemental": {"id":"elemental","cn":"元素使","desc":"塑能爆发之道：让风火水土听命于你的意志，把毁灭炼成手艺。","nodes":[
  {"lv":1,"cn":"元素亲和","desc":"你闭眼能摸到空气中的水汽和火屑。咏唱前先感受，成了你的习惯。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"塑能手感","desc":"火球在你掌心收放自如，像揉一块温的面团。同窗说你看火的眼神变了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxMp=(S.maxMp||50)+10; }},
  {"lv":3,"cn":"元素共鸣","desc":"不用念完咒语，元素已经先动起来。它们记得你，像记得老邻居。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"爆发专注","desc":"战斗越激烈，你的心越静。周围的喊声落进耳朵，变成节拍。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_4']=1; S.maxMp=(S.maxMp||50)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":5,"cn":"元素风暴","desc":"你站在风暴眼里，衣角纹丝不动。外面的人在替你害怕，你不怕。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"元素领主之心","desc":"魔网深处有一截属于你的丝线，颜色只有你看得见。神明陨落那年，也留下过同样的一截。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_elemental_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "conjurer": {"id":"conjurer","cn":"咒法者","desc":"召唤空间之道：开一扇门，让该来的来，不该来的永远不来。","nodes":[
  {"lv":1,"cn":"空间直觉","desc":"你能在闭眼时画出房间的每个角落，包括身后那个看不见的。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"轻门","desc":"第一次开出门缝时，你闻到了另一个地方的风。有点湿，像海。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_2']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; S.maxMp=(S.maxMp||50)+10; }},
  {"lv":3,"cn":"召唤守约","desc":"你与第一个召唤物立了约：它为你战斗，你替它记得名字。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"空间锚定","desc":"你学会了在一个地方留下看不见的钉子，三个月后还能找到它。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_4']=1; S.maxMp=(S.maxMp||50)+15; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":5,"cn":"双门","desc":"两扇门同时打开，你站在中间，听见两个方向的风在互相问好。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"咒法之主","desc":"你门后的世界认你了。那里有人给你留了一盏灯，灯下压着一封没有署名的信。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_conjurer_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "arcane": {"id":"arcane","cn":"秘法学者","desc":"结界附魔之道：把法则织成网，让世界按你写下的规矩运转。","nodes":[
  {"lv":1,"cn":"法则笔迹","desc":"你开始能看出法术里没写出来的那几行。纸边总会留下你的批注。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"附魔手稳","desc":"给一枚铜币刻上微光法阵，你手不抖。刻坏的第十二枚，你收在了匣子里。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxMp=(S.maxMp||50)+10; }},
  {"lv":3,"cn":"结界骨架","desc":"你的结界不再像布幔，更像一间真正有梁柱的屋子。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"法阵叠写","desc":"三层法阵叠在一起不打架，是你最得意的本事。教授看了，没说话，点了头。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_4']=1; S.maxMp=(S.maxMp||50)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":5,"cn":"规则编织","desc":"你开始能改写结界里的细规矩：光往左偏一寸，风慢半拍。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"秘法织网者","desc":"你把一条法则织进魔网的夹层，没人知道，也没人该知道。锚点处刻着你的名字缩写。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_魔法师_arcane_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]}
};
FEATS_V51["灵魂法师"] = {
 "medium": {"id":"medium","cn":"通灵者","desc":"灵界沟通之道：听死者说话，替活人传话，在两界之间走钢索。","nodes":[
  {"lv":1,"cn":"灵觉初开","desc":"你开始能感觉到那些'没人'的房间。椅子刚被坐过，余温还在。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_1']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":2,"cn":"安魂手","desc":"你能让躁动的灵安静下来，像哄一只受惊的猫。它们走之前会看你一眼。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_2']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"灵语","desc":"你听得懂亡者的口音了。他们说得最清楚的那句，往往是生前没说完的。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_3']=1; S.attrs.SPR=(S.attrs.SPR||0)+3; }},
  {"lv":4,"cn":"渡桥","desc":"你搭的灵桥能撑过一场完整的告别。桥那头的人，走时向你欠了欠身。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"灵界向导","desc":"你在灵界认路了。那条河，那棵只剩树皮的树，你都记得。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_5']=1; S.attrs.SPR=(S.attrs.SPR||0)+4; }},
  {"lv":6,"cn":"两界人","desc":"有灵在你睡着时替你守门。醒来的枕头边，有时会多一枚河滩上的白石子。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_medium_6']=1; S.attrs.SPR=(S.attrs.SPR||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]},
 "hypnotist": {"id":"hypnotist","cn":"催眠师","desc":"精神操控之道：让念头像种子一样种进别人心里，等它自己发芽。","nodes":[
  {"lv":1,"cn":"语调","desc":"你发现自己的声音能让人慢下来。茶凉了，对方还没说完开头。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"暗示","desc":"你把'忘了带伞'这句话说给守门人听，他真在晴天把伞落在了家里。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"梦笔","desc":"你开始能往别人的梦里添一笔。添得小心，只加一小片云。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"心门","desc":"你知道哪句话能让人开门，哪句话会让人上锁。锁上的那类，你尽量不用。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CHA=(S.attrs.CHA||0)+2; }},
  {"lv":5,"cn":"意志绳","desc":"你牵过一条很细的意志绳，把人从崩溃边缘拉回来。他醒来不记得，只记得有人说了句'别走'。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"梦织者","desc":"你可以在十个人的梦里种同一棵树。树长出来那天，十个人在不同的城市同时停下来，看了一眼窗外。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_hypnotist_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "soulbinder": {"id":"soulbinder","cn":"缚魂者","desc":"灵魂契约之道：把承诺刻进灵魂，比写在纸上重得多，也牢得多。","nodes":[
  {"lv":1,"cn":"契约之眼","desc":"你看出每个人的灵魂都系着几根线。有的线旧了，有的线还在长。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_1']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":2,"cn":"一线牵","desc":"你把一根线系在自己和一件旧物之间。它丢了的那天，你胸口闷了一整晚。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_2']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"守诺","desc":"你替一个快死的人守了一句承诺。他走了，话还在你这里，热着。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_3']=1; S.attrs.SPR=(S.attrs.SPR||0)+3; }},
  {"lv":4,"cn":"灵契印","desc":"你的契约有了印记，别人看不见，你摸得到，像摸一枚温热的印章。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"共感","desc":"契约那头的痛，你会分到一半。不是每个人都能忍这一半，你能。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_5']=1; S.attrs.SPR=(S.attrs.SPR||0)+4; }},
  {"lv":6,"cn":"缚魂之主","desc":"你的名字被写进了一本很旧的书里。翻到那一页的人，会先停一停，再决定要不要继续往下读。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_灵魂法师_soulbinder_6']=1; S.attrs.SPR=(S.attrs.SPR||0)+5; S.attrs.CON=(S.attrs.CON||0)+3; }}
 ]}
};
FEATS_V51["术士"] = {
 "alchemist": {"id":"alchemist","cn":"炼金术士","desc":"药剂转化之道：把草木石头熬成另一种东西，也把自己熬成另一种人。","nodes":[
  {"lv":1,"cn":"火候","desc":"你闻得出坩埚里的火候对不对。差一息，药性就变了一个脾气。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"配比","desc":"你不再靠秤，靠手感。两份月光一份露水，你闭着眼也能配准。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxMp=(S.maxMp||50)+10; }},
  {"lv":3,"cn":"转化直觉","desc":"你开始能'看见'物质里藏着的那一点本质。铅看着你，像在求饶。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"药性知己","desc":"每种药材在你手里都有名字和脾气。你给它们起的绰号，同行听不懂。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_4']=1; S.maxMp=(S.maxMp||50)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"贤者之手","desc":"你的手不再怕酸蚀和烫伤。炉灰落在指缝里，像老朋友打招呼。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"点化","desc":"你炼出的第一颗'不是它自己'的东西，在灯下看了你一整夜。你给它起了名字。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_alchemist_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "forger": {"id":"forger","cn":"锻造师","desc":"神兵利器之道：把铁和火谈成一场恋爱，把锤声敲成誓言。","nodes":[
  {"lv":1,"cn":"听铁","desc":"铁在炉里会说话。你听得出它疼，也听得出它愿意。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_1']=1; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":2,"cn":"锤纹","desc":"你打出的锤纹有了自己的规律，像一套没人教过的暗号。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_2']=1; S.attrs.STR=(S.attrs.STR||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"淬火","desc":"你掌握了那一下入水的时机。水汽腾起来的时候，刀在哭，也在笑。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_3']=1; S.attrs.STR=(S.attrs.STR||0)+3; }},
  {"lv":4,"cn":"器灵初醒","desc":"你打的那把匕首，在夜里会自己挪一寸。你把它放正，它没再动，但你知道它醒着。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"以身为砧","desc":"你自己也是一块铁。锤在别人身上疼，锤在自己身上，你听见了回音。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_5']=1; S.attrs.STR=(S.attrs.STR||0)+4; }},
  {"lv":6,"cn":"锻造之神见证","desc":"炉火里浮现过一张脸，只有一瞬。你的锤子认得它，替你记住了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_forger_6']=1; S.attrs.STR=(S.attrs.STR||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]},
 "machinist": {"id":"machinist","cn":"魔械师","desc":"机关构装之道：让齿轮和符文成家立业，替你做那些你不愿让活人做的事。","nodes":[
  {"lv":1,"cn":"拆解眼","desc":"你能看出每件机械的关节和要害。拆它之前，你已经知道它怕什么。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"齿轮语","desc":"齿轮咬合的声音在你耳朵里是句子。它们吵架，你听得出来。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxMp=(S.maxMp||50)+10; }},
  {"lv":3,"cn":"第一件构装","desc":"你的第一个构装体站起来走了三步，摔了。你修好它，它又走，这次没摔。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"符文供能","desc":"你学会了给机械喂符文，像喂面包。它吃饱了会打嗝——喷出一小团火星。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_4']=1; S.maxMp=(S.maxMp||50)+15; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":5,"cn":"构装知己","desc":"你的构装体会在你难过时替你挡风。它不懂你为什么难过，但它学了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"造物之魂","desc":"你在你的构装体里看见了一小片'活'的东西。不是灵魂，是另一种东西，它看着你，点了头。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_术士_machinist_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.STR=(S.attrs.STR||0)+3; }}
 ]}
};


FEATS_V51["战士"] = {
 "berserker": {"id":"berserker","cn":"狂战士","desc":"狂怒爆发之道：把愤怒炼成燃料，把失控练成掌控。","nodes":[
  {"lv":1,"cn":"怒意","desc":"你发现自己的火气能拧成一股绳，攥在手里，不撒。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_1']=1; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":2,"cn":"战吼","desc":"你吼过一嗓子，把房梁上的灰震下来了。对面的人，退了一步，就那一步。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_2']=1; S.attrs.STR=(S.attrs.STR||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"红视","desc":"你学会在红视里留一盏灯：看得见敌友，记得住收手。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_3']=1; S.attrs.STR=(S.attrs.STR||0)+3; }},
  {"lv":4,"cn":"血热","desc":"受伤之后你反而更清醒。血的味道在你嘴里，像一杯太烈的酒。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"狂而不乱","desc":"最疯的时候，你握着的那一下最稳。老兵的都这么说，你信了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_5']=1; S.attrs.STR=(S.attrs.STR||0)+4; }},
  {"lv":6,"cn":"战神之怒","desc":"你的怒吼里有了回声，不像你自己的声音，像一片山的回应。战神听过这一嗓子。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_berserker_6']=1; S.attrs.STR=(S.attrs.STR||0)+5; S.attrs.CON=(S.attrs.CON||0)+3; }}
 ]},
 "weaponmaster": {"id":"weaponmaster","cn":"武器大师","desc":"技巧流之道：刀枪剑盾都是手的一部分，武器只是替你说话。","nodes":[
  {"lv":1,"cn":"手感","desc":"每把武器在你手里都有脾气。你花一个下午跟它和解，它便听你的。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_1']=1; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":2,"cn":"换手","desc":"左手也能用了。老教官看见你左手出刀，愣了一下，没挑出错。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_2']=1; S.attrs.STR=(S.attrs.STR||0)+2; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":3,"cn":"刃长","desc":"你开始明白武器是臂长的延伸，一步之内，是你的天下。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_3']=1; S.attrs.STR=(S.attrs.STR||0)+3; }},
  {"lv":4,"cn":"破势","desc":"你学会了打断别人的节奏：他起手到一半，你那一刀已经等在那里。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":5,"cn":"百兵","desc":"给你一根烧火棍，你也能让它像个兵器。不是它像，是你像。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_5']=1; S.attrs.STR=(S.attrs.STR||0)+4; }},
  {"lv":6,"cn":"兵主","desc":"你同时握住两把武器时，它们在你手里安静得像睡着了。醒来的时候，是它们替你出手。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_weaponmaster_6']=1; S.attrs.STR=(S.attrs.STR||0)+5; S.attrs.AGI=(S.attrs.AGI||0)+3; }}
 ]},
 "shieldguard": {"id":"shieldguard","cn":"盾卫","desc":"阵线防御之道：让队友永远能藏在你背后，让敌人永远差那一步。","nodes":[
  {"lv":1,"cn":"架盾","desc":"盾在你手里不再是个累赘。它替你挡过的第一箭，你记得那声脆响。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_1']=1; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":2,"cn":"一步不退","desc":"你学会了把重心钉在地上。有人推过你，像推一堵埋了根的墙。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_2']=1; S.attrs.CON=(S.attrs.CON||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"盾墙","desc":"你把盾和旁边人的盾搭在一起，缝隙里的风都小了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_3']=1; S.attrs.CON=(S.attrs.CON||0)+3; }},
  {"lv":4,"cn":"以身作盾","desc":"你替人挡过一刀，刀口留在了盾上。那面盾你没换，越用越顺手。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":5,"cn":"阵眼","desc":"你在的地方，队伍就有了形状。大家不自觉往你身边靠，像靠一堵不会倒的墙。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_5']=1; S.attrs.CON=(S.attrs.CON||0)+4; }},
  {"lv":6,"cn":"不落之壁","desc":"你的盾上刻过太多痕迹，每一道都有名字。你背得出来。城墙上的人说，看见你的盾，就看见了城墙。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_战士_shieldguard_6']=1; S.attrs.CON=(S.attrs.CON||0)+5; S.attrs.STR=(S.attrs.STR||0)+3; }}
 ]}
};
FEATS_V51["骑士"] = {
 "paladin": {"id":"paladin","cn":"圣武士","desc":"圣光斩击之道：誓言不只是说出口的话，是烧在骨头里的火。","nodes":[
  {"lv":1,"cn":"誓词入骨","desc":"你把誓言念到第七遍时，手指尖开始发烫。誓约之神听见了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_1']=1; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":2,"cn":"圣焰","desc":"你掌心能燃起一小簇不烫的火焰，照得见黑暗，也照得见说谎的人。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_2']=1; S.attrs.STR=(S.attrs.STR||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"斩邪","desc":"你的剑砍向不死之物时，会多亮一分。你自己也说不清那光从哪来。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_3']=1; S.attrs.STR=(S.attrs.STR||0)+3; }},
  {"lv":4,"cn":"圣愈","desc":"你把一只手按在伤者肩上，血止住了。对方抬头看你，眼里有光，你没敢多看。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":5,"cn":"不动心","desc":"诱惑来了又走，像风过石像。你不再需要用力抵抗——誓言替你站岗。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_5']=1; S.attrs.STR=(S.attrs.STR||0)+4; }},
  {"lv":6,"cn":"圣光行者","desc":"你的影子在正午也会偏一分——光认得你，替你让了路。同行的人说，这是圣者气象。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_paladin_6']=1; S.attrs.STR=(S.attrs.STR||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "protector": {"id":"protector","cn":"护教骑士","desc":"圣盾守护之道：教义不是背出来的，是挡在别人身前挡出来的。","nodes":[
  {"lv":1,"cn":"护人","desc":"你第一次替陌生人挡下那一下，手在抖，腿没抖。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_1']=1; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":2,"cn":"圣盾","desc":"你的盾面上浮起过一行看不见的字，只有你低头时能瞄见一角。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_2']=1; S.attrs.CON=(S.attrs.CON||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"代受","desc":"你学会了替人承受那一击的诀窍：不是硬扛，是把力道引向自己脚下的地。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_3']=1; S.attrs.CON=(S.attrs.CON||0)+3; }},
  {"lv":4,"cn":"庇护所","desc":"你站着的地方，伤员愿意把背交给你。你守过一整夜，天亮时他们睡着了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":5,"cn":"不动如山","desc":"有人从背后推你，你纹丝不动。不是体重，是你在替身后的人守着那道线。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_5']=1; S.attrs.CON=(S.attrs.CON||0)+4; }},
  {"lv":6,"cn":"圣墙","desc":"你把盾立在地上的那一刻，风停了。不是风怕你，是风认得这面盾替谁站过。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_protector_6']=1; S.attrs.CON=(S.attrs.CON||0)+5; S.attrs.STR=(S.attrs.STR||0)+3; }}
 ]},
 "itinerant": {"id":"itinerant","cn":"巡游骑士","desc":"机动审判之道：法条不在书里，在你要去的下一段路上。","nodes":[
  {"lv":1,"cn":"马背","desc":"你在马背上能睡、能吃、能看路。马跟你熟了，会替你挑道。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_1']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":2,"cn":"快剑","desc":"你的剑出鞘比对方的话问完更快。老骑士说，快不是目的，是少让他人受苦。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_2']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"断案","desc":"你学会不只听一面之词。两边的谎话，你都能闻出味道来。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"夜路","desc":"你习惯了在夜里赶路。月光下的路，你比白天看得更清。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":5,"cn":"疾风","desc":"你的马跑起来像贴着地面飞。它喘气的声音，你听得出它是高兴还是心疼你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_5']=1; S.attrs.AGI=(S.attrs.AGI||0)+4; }},
  {"lv":6,"cn":"巡世者","desc":"你到过的地方，人们会记得一个骑马的影子。没人说得清他叫什么，但都知道他在赶路。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_骑士_itinerant_6']=1; S.attrs.AGI=(S.attrs.AGI||0)+5; S.attrs.STR=(S.attrs.STR||0)+3; }}
 ]}
};
FEATS_V51["游侠"] = {
 "hunter": {"id":"hunter","cn":"猎人","desc":"追猎陷阱之道：猎物是猎物，猎物也不是猎物——你学会的每一样，都还给了林子。","nodes":[
  {"lv":1,"cn":"足迹","desc":"你看出两片泥脚印不是同一个时辰留下的。泥干的程度，替你说话。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_1']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":2,"cn":"陷阱","desc":"你设的绳套从没伤过路过的狗。你知道谁走哪条道，谁只是路过。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_2']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"瞄准","desc":"你闭眼能听见箭要落的地方。风替你修正了那一点偏差。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_3']=1; S.attrs.AGI=(S.attrs.AGI||0)+3; }},
  {"lv":4,"cn":"潜行","desc":"你走过落叶堆，叶子没响。林子里的老猎户说，你脚步声学得像一只懂事的鹿。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"猎心","desc":"你学会了等待。等一炷香、等一场雨、等一个不会回头的人。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_5']=1; S.attrs.AGI=(S.attrs.AGI||0)+4; }},
  {"lv":6,"cn":"林中主","desc":"林子的鸟看见你不躲了。你走过时，它们只抬一下头，像跟熟人打招呼。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_hunter_6']=1; S.attrs.AGI=(S.attrs.AGI||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]},
 "warden": {"id":"warden","cn":"巡林者","desc":"荒野守护之道：林子不需要你保护，但你站在这里，它知道有人看着。","nodes":[
  {"lv":1,"cn":"听林","desc":"你能听出林子在叹气——风过断木的声音，和过活树的声音不一样。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_1']=1; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":2,"cn":"护苗","desc":"你把被踩倒的幼苗扶起来，绑了一根细枝。三天后去看，它站直了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_2']=1; S.attrs.CON=(S.attrs.CON||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"地脉","desc":"你开始能感觉脚下水流的方向。跟着它走，总能找到喝水的动物。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_3']=1; S.attrs.CON=(S.attrs.CON||0)+3; }},
  {"lv":4,"cn":"结界痕","desc":"你在林缘留过一道谁也看不见的痕，从此没人再往里乱砍。他们说不清为什么绕道。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":5,"cn":"守夜","desc":"你守过林子的夜。狼群远远看着你，看了一会儿，走了。它们认你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_5']=1; S.attrs.CON=(S.attrs.CON||0)+4; }},
  {"lv":6,"cn":"古树之友","desc":"你在一棵老树下睡过一夜，醒来肩头落了一片它给的叶子。你收下了，没说谢谢。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_warden_6']=1; S.attrs.CON=(S.attrs.CON||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "scout": {"id":"scout","cn":"哨探","desc":"斥候箭术之道：把情报带回营地的人，比打赢仗的人少挨骂。","nodes":[
  {"lv":1,"cn":"眼力","desc":"你数得清半里外树上有几只鸟，哪只先飞。教官说，这就是眼力。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_1']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":2,"cn":"快射","desc":"你学会了边跑边射。第一箭追第二箭，箭在半路上超过了第一箭。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_2']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"制高点","desc":"你总会先找到那棵能看全场的树。坐上去之后，世界在你脚下排好队。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_3']=1; S.attrs.AGI=(S.attrs.AGI||0)+3; }},
  {"lv":4,"cn":"撤退路","desc":"你每到一个地方，先找三条退路。有一次只用了两条，第三条留给了别人。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"信号","desc":"你能用鸟叫、石响、风摆草叶，把一句话传过半座山。林子替你当信差。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_5']=1; S.attrs.AGI=(S.attrs.AGI||0)+4; }},
  {"lv":6,"cn":"千里眼","desc":"你在山顶看见过山那头的旗子换了颜色。三天后消息传来，你比报信的人早说了两天。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_游侠_scout_6']=1; S.attrs.AGI=(S.attrs.AGI||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]}
};


FEATS_V51["盗贼"] = {
 "assassin": {"id":"assassin","cn":"刺客","desc":"潜行必杀之道：影子是武器，耐心是刀鞘，出手只有一次。","nodes":[
  {"lv":1,"cn":"无声","desc":"你学会光脚走路。地板认识你的脚，替你保密。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_1']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":2,"cn":"背刺","desc":"你第一次得手，是那人的影子先喊的疼。你收了刀，影子还在抖。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_2']=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"匿迹","desc":"你在光线里消失过三息。不是隐身，是那三息里，没人记得该看你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_3']=1; S.attrs.AGI=(S.attrs.AGI||0)+3; }},
  {"lv":4,"cn":"一击","desc":"你学会把整夜的耐心压进一刀里。出刀前，你已经知道它落在哪。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"影步","desc":"你走路时影子比你慢一步。有人说，那是影子里住着个不肯走的老前辈。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_5']=1; S.attrs.AGI=(S.attrs.AGI||0)+4; }},
  {"lv":6,"cn":"无影","desc":"你在完全没光的屋里走了个来回，灰上没留下脚印。暗影阁的执事看了两遍，没说话。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_assassin_6']=1; S.attrs.AGI=(S.attrs.AGI||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]},
 "burglar": {"id":"burglar","cn":"夜盗","desc":"机关销赃之道：锁是请柬，墙是门，赃物只是顺路的纪念品。","nodes":[
  {"lv":1,"cn":"开锁","desc":"第一把锁在你手里开了，咔哒一声，像它自己松了口气。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"夜眼","desc":"你的眼睛习惯了暗处。月光照不到的地方，你能看出桌角那枚金币的边。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"机关眼","desc":"你走进一间屋子，先知道哪里会响、哪里会亮、哪里藏着人。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"高来高去","desc":"屋檐上的路，你比街上的路熟。守夜人抬头时，你已经在下一片瓦上了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.AGI=(S.attrs.AGI||0)+2; }},
  {"lv":5,"cn":"估价","desc":"你摸得出东西的成色和来路。赃物在你手里，像货真价实的宝贝。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"穿墙","desc":"你学会从锁眼里进出一间没有门的屋子。出来时，灰还是平的。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_burglar_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.AGI=(S.attrs.AGI||0)+3; }}
 ]},
 "spy": {"id":"spy","cn":"密探","desc":"伪装情报之道：一句话换一句话，一张脸换一个人。","nodes":[
  {"lv":1,"cn":"记性","desc":"你听过的名字不会再忘。三个月后提起，你还能说出他那天穿的靴子。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"套话","desc":"你学会了让人自己说完。你只是点头，对方就交出了不该说的那句。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"易容","desc":"你给自己换了一张脸，走在老熟人面前，他没认出来。你有点高兴，也有点凉。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_3']=1; S.attrs.CHA=(S.attrs.CHA||0)+3; }},
  {"lv":4,"cn":"暗号","desc":"你掌握了两套只有三个人懂的暗号。其中一套，另一个人已经死了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"眼线","desc":"你在六个地方有人替你看着。他们不知道在替你办事，只知道欠你人情。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_5']=1; S.attrs.CHA=(S.attrs.CHA||0)+4; }},
  {"lv":6,"cn":"无面","desc":"你已经记不清自己本来的脸了。镜子里那个人冲你点头，你冲他点头，像两个老同事。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_盗贼_spy_6']=1; S.attrs.CHA=(S.attrs.CHA||0)+5; S.attrs.INT=(S.attrs.INT||0)+3; }}
 ]}
};
FEATS_V51["牧师"] = {
 "healer": {"id":"healer","cn":"治疗师","desc":"圣愈净化之道：把别人的疼接过来，再还回去一双手的温度。","nodes":[
  {"lv":1,"cn":"触诊","desc":"你的手能摸到伤处的热和凉。哪一处该先救，它替你排了队。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_1']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }},
  {"lv":2,"cn":"圣愈","desc":"你第一次让一道口子在你掌心下合拢。伤者说像被太阳晒了一下。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_2']=1; S.attrs.SPR=(S.attrs.SPR||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"清创","desc":"你学会了先清后愈。脓和毒不走，光就不落。你手上有了分寸。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_3']=1; S.attrs.SPR=(S.attrs.SPR||0)+3; }},
  {"lv":4,"cn":"安眠","desc":"你让痛得睡不着的伤员睡了一整夜。他醒来说做了个好梦，梦里有教堂的钟声。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"起死回生一线","desc":"你从鬼门关前拉回过一个人。他问你看见什么了，你说，我只看你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_5']=1; S.attrs.SPR=(S.attrs.SPR||0)+4; }},
  {"lv":6,"cn":"圣手","desc":"你的手放上伤口时，会先亮一下，像蜡烛点着。伤员说，疼少了半截。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_healer_6']=1; S.attrs.SPR=(S.attrs.SPR||0)+5; S.attrs.CON=(S.attrs.CON||0)+3; }}
 ]},
 "inquisitor": {"id":"inquisitor","cn":"审判官","desc":"圣裁异端之道：光不只照路，也照出藏在影子里的人。","nodes":[
  {"lv":1,"cn":"鉴伪","desc":"你开始能听出谎话里的那声杂音。不是每种谎都响，响的那声你记住了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"圣印","desc":"你会在审讯室的门上留下一个看不见的印记。从那以后，没人敢在里面昧着良心说话。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"焚邪","desc":"你点燃过一小簇圣火，烧掉的不是人，是附在他身上的东西。他跪着谢你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"断狱","desc":"你判过一桩无头案。两边都有理，你选了让更多人活的那边。有人不服，你没回头。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CHA=(S.attrs.CHA||0)+2; }},
  {"lv":5,"cn":"明辨","desc":"你不再急着定罪。先把真话和谎话分开，再问自己：你配不配判这一下。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"圣裁者","desc":"你宣判时，殿里的烛火会齐齐矮下去一截，像在听。你念完，火又站直了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_inquisitor_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]},
 "warpriest": {"id":"warpriest","cn":"圣战士","desc":"战牧双修之道：一手圣典一手战锤，慈悲和力量是同一种东西的两面。","nodes":[
  {"lv":1,"cn":"祷战","desc":"你学会了边祷边战。祷词和心跳合拍，锤落得比话稳。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_1']=1; S.attrs.STR=(S.attrs.STR||0)+2; }},
  {"lv":2,"cn":"祝福锤","desc":"你的战锤上浮过一层淡淡的光。砸下去时，声音比铁更沉。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_2']=1; S.attrs.STR=(S.attrs.STR||0)+2; S.maxHp=(S.maxHp||100)+10; }},
  {"lv":3,"cn":"战场布道","desc":"你在阵前念过一段经文，自己人也稳了，对面人心里却起了疑。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_3']=1; S.attrs.STR=(S.attrs.STR||0)+3; }},
  {"lv":4,"cn":"护阵","desc":"你把伤员挡在身后时，手比盾还快。圣光落在你肩上，像披了件旧披风。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_4']=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }},
  {"lv":5,"cn":"圣战体","desc":"你不再分祷告和挥锤。两件事在你这儿成了一件事：站着，别让身后的人倒下。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_5']=1; S.attrs.STR=(S.attrs.STR||0)+4; }},
  {"lv":6,"cn":"圣战者","desc":"你的战锤落地时，土地会先静一静。老牧师说，这是圣战者的脚步，替神踩过的印子。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_牧师_warpriest_6']=1; S.attrs.STR=(S.attrs.STR||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]}
};
FEATS_V51["商人"] = {
 "merchant": {"id":"merchant","cn":"商贾","desc":"贸易套利之道：低买高卖是手艺，货比人先懂行情。","nodes":[
  {"lv":1,"cn":"识货","desc":"你摸得出货色的真假。那件仿的赝品，你一上手就笑了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"砍价","desc":"你学会让对方先开口。他报的价，比你想的还低了一成。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"行情","desc":"你闻得出价格的走向。雨季前囤伞的人，是你。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"人脉","desc":"你在七个城有七个能托话的人。他们不都是朋友，但都欠你一顿酒。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CHA=(S.attrs.CHA||0)+2; }},
  {"lv":5,"cn":"眼光","desc":"你看得出哪笔生意会亏，哪笔会赢——有时两个都看不出，但你知道什么时候该走。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"金衡在手","desc":"你把一枚金币抛起来，落下时它立在指尖上，没倒。财富之神的那杆秤，在你看不见的地方，偏了偏了一下。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_merchant_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.CHA=(S.attrs.CHA||0)+3; }}
 ]},
 "banker": {"id":"banker","cn":"钱庄主","desc":"金融操控之道：钱不认识人，但它认得谁替它记过账。","nodes":[
  {"lv":1,"cn":"算盘","desc":"你心算比珠子快。账目在你脑子里排队，谁多谁少，一目了然。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_1']=1; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":2,"cn":"记账","desc":"你的账本里没有涂改。每一笔都留了来路，像给每个铜板办了户口。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_2']=1; S.attrs.INT=(S.attrs.INT||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"拆借","desc":"你把钱借给最需要的人，利息记在人情簿上。有的人还了，有的人还不了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_3']=1; S.attrs.INT=(S.attrs.INT||0)+3; }},
  {"lv":4,"cn":"汇兑","desc":"你让人在甲城存钱、乙城取钱。信使跑断腿，你只坐着写了两行字。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CHA=(S.attrs.CHA||0)+2; }},
  {"lv":5,"cn":"风控","desc":"你看得出谁会破产、谁会暴富。这行当最值钱的不是钱，是'知道'。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_5']=1; S.attrs.INT=(S.attrs.INT||0)+4; }},
  {"lv":6,"cn":"金庄之主","desc":"你把一座城的金币都过了一遍手。它们离开你时，比来时规矩——像被训过。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_banker_6']=1; S.attrs.INT=(S.attrs.INT||0)+5; S.attrs.CHA=(S.attrs.CHA||0)+3; }}
 ]},
 "auctioneer": {"id":"auctioneer","cn":"拍卖师","desc":"人脉声望之道：把东西卖出它本来的故事，把场面做成它该有的样子。","nodes":[
  {"lv":1,"cn":"开场","desc":"你一开口，堂里安静了。那句话像一把钥匙，把所有人的耳朵都打开了。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_1']=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }},
  {"lv":2,"cn":"抬价","desc":"你学会在恰到好处的时候叹一口气。那一口气，让价码多跳了两回。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_2']=1; S.attrs.CHA=(S.attrs.CHA||0)+2; S.maxSan=(S.maxSan||100)+10; }},
  {"lv":3,"cn":"识人","desc":"你记得每张举牌的脸和底线。谁是真想要，谁是凑热闹，你一眼看穿。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_3']=1; S.attrs.CHA=(S.attrs.CHA||0)+3; }},
  {"lv":4,"cn":"场面","desc":"你办过一场让全城记住的拍卖。那晚的灯、酒和掌声，都听你的调度。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_4']=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+2; }},
  {"lv":5,"cn":"人情","desc":"你欠人的和人欠你的，你心里都有一本账。这本账，比钱庄的账还厚。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_5']=1; S.attrs.CHA=(S.attrs.CHA||0)+4; }},
  {"lv":6,"cn":"声名远播","desc":"你喊出落槌价的那句，第二天传遍了三个城。有人学你的腔调，学不像。","eff":function(){ if(!S.flags)S.flags={}; S.flags['v51_商人_auctioneer_6']=1; S.attrs.CHA=(S.attrs.CHA||0)+5; S.attrs.SPR=(S.attrs.SPR||0)+3; }}
 ]}
};

/*v51inj:feats*/

(function(){
  window.v51_ensureDefaults = function(){
    try{
      if(!S) return;
      if(S.featPoints===undefined) S.featPoints = 0;
      if(!S.feats) S.feats = {};
      if(S.piety===undefined) S.piety = 0;
      if(S.corruption===undefined) S.corruption = 0;
      if(S.axisDaily===undefined) S.axisDaily = 0;
      if(!S.axisMilestones) S.axisMilestones = {};
    }catch(e){}
  };
  window.v51_axisStatus = function(){
    try{
      v51_ensureDefaults();
      const p = S.piety||0, c = S.corruption||0;
      const labels = [];
      if(p>=70) labels.push('圣辉长明');
      else if(p>=40) labels.push('圣辉初显');
      if(c>=70) labels.push('深渊凝视');
      else if(c>=40) labels.push('深渊低语');
      if(!labels.length) labels.push('天平行者');
      return {piety:p, corruption:c, labels:labels};
    }catch(e){ return {piety:0, corruption:0, labels:['天平行者']}; }
  };
  window.v51_checkMilestones = function(){
    try{
      v51_ensureDefaults();
      const p = S.piety||0, c = S.corruption||0;
      const evts = [];
      if(p>=70 && !S.axisMilestones.p70){ S.axisMilestones.p70=1; evts.push({t:'圣辉长明', m:'你的戒律已如长明灯。同你同行的人，渐渐开始相信你。'}); }
      else if(p>=40 && !S.axisMilestones.p40){ S.axisMilestones.p40=1; evts.push({t:'圣辉初显', m:'有人注意到你的变化——你说过的话，开始有人当真。'}); }
      if(c>=70 && !S.axisMilestones.c70){ S.axisMilestones.c70=1; evts.push({t:'深渊凝视', m:'夜里你听见自己的回声，比你慢半拍。'}); }
      else if(c>=40 && !S.axisMilestones.c40){ S.axisMilestones.c40=1; evts.push({t:'深渊低语', m:'有些念头不是你的，但它们住进了你心里。'}); }
      evts.forEach(function(e){
        if(window.flashMsg) { try{ flashMsg(e.t + '：' + e.m); }catch(x){} }
        if(typeof ToastCenter!=='undefined'&&ToastCenter&&ToastCenter.push) { try{ ToastCenter.push(e.t, e.m, 'info'); }catch(x){} }
      });
      return evts;
    }catch(e){ return []; }
  };
  window.v51_axisAct = function(kind){
    try{
      v51_ensureDefaults();
      const today = (typeof S.day==='number') ? S.day : 0;
      if(S.axisDaily===today){
        if(window.flashMsg) flashMsg('今日已行过修行。明日再来。');
        v51_featPanel();
        return;
      }
      if(kind==='piety'){
        S.piety = Math.min(100, (S.piety||0) + 5);
        S.axisDaily = today;
        if(window.flashMsg) flashMsg('践行戒律 · 神性 +5');
      } else {
        S.corruption = Math.max(0, (S.corruption||0) - 3);
        S.axisDaily = today;
        if(window.flashMsg) flashMsg('冥思镇渊 · 深渊 -3');
      }
      v51_checkMilestones();
      v51_featPanel();
    }catch(e){ console.error(e); }
  };
  window.v51_onBreakthrough = function(realm){
    try{
      v51_ensureDefaults();
      S.featPoints = (S.featPoints||0) + 1;
      S.peakPts = (S.peakPts||0) + 1;
      if(window.flashMsg) flashMsg('破境感悟 · 专长点+1、巅峰点+1（专长共 ' + S.featPoints + '）');
    }catch(e){}
  };
  function v51_row(label, bar, value){
    return '<div style="margin:6px 0 2px;font-size:13px;color:var(--text-secondary);">' + label + '</div>'
      + '<div style="height:10px;background:var(--bg-input);border-radius:5px;overflow:hidden;margin:2px 0 6px;border:1px solid var(--border);">'
      + '<div style="height:100%;width:' + value + '%;background:' + bar + ';"></div></div>';
  }
  function v51_optBtn(text, fn, cls){
    const b = document.createElement('button');
    b.className = cls || 'opt';
    b.innerHTML = '<span class="od">◆</span> ' + text;
    b.onclick = fn;
    return b;
  }
  window.v51_featPanel = function(){
    try{
      v51_ensureDefaults();
      const job = S.job || '';
      const tree = FEATS_V51[job] || {};
      const bids = Object.keys(tree);
      const stt = v51_axisStatus();
      let h = "<div class='panel-wrap'>";
      h += "<div class='panel-header'><span class='panel-title'>修行 · 专长与双轴</span><button class='panel-close' onclick='closePanel()'>✕</button></div>";
      h += "<div class='panel-body' id='v51-body'>";
      h += '<div style="font-size:14px;font-weight:bold;color:var(--text-gold);margin-bottom:8px;">━━ 修行 ━━</div>';
      h += v51_row('神性（践行戒律）', 'linear-gradient(90deg,#b8860b,#f0d68a)', stt.piety);
      h += v51_row('深渊（侵蚀）', 'linear-gradient(90deg,#4a235a,#8e44ad)', stt.corruption);
      h += '<div style="margin:8px 0;font-size:14px;color:var(--text-primary);">你的道路：<span style="color:var(--text-gold);">' + stt.labels.join(' · ') + '</span></div>';
      h += '<div style="margin:4px 0 10px;font-size:15px;color:var(--text-primary);">专长点：<span style="color:var(--text-gold);font-weight:bold;">' + (S.featPoints||0) + '</span> <span style="font-size:12px;color:var(--text-muted);">（破境成功可获得）</span></div>';
      if(!bids.length){
        h += '<div style="margin:12px 0;padding:12px;background:var(--bg-panel2);border:1px dashed var(--border);border-radius:8px;color:var(--text-muted);font-size:13px;">该职业暂无专长树（数据缺失）。</div>';
      } else {
        h += '<div style="margin:10px 0 4px;font-size:14px;color:var(--text-secondary);">—— 专长树 · ' + job + ' ——</div>';
        bids.forEach(function(bid){
          const t = tree[bid]; if(!t) return;
          const picked = (t.nodes||[]).filter(function(n){ return S.feats[t.id+'_'+n.lv]; }).length;
          h += '<div style="margin:8px 0;padding:8px 10px;background:var(--bg-panel2);border:1px solid var(--border);border-left:3px solid var(--text-gold);border-radius:8px;">'
            + '<div style="font-size:14px;color:var(--text-primary);">' + t.cn + ' <span style="font-size:12px;color:var(--text-muted);">' + picked + '/6</span></div>'
            + '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + t.desc + '</div>'
            + '<button class="btn btn-sm" style="margin-top:6px;" onclick="v51_treeView(\'' + bid + '\')">查看专长树</button></div>';
        });
      }
      h += "</div>";
      h += "<div class='panel-footer'>";
      const today = (typeof S.day==='number') ? S.day : 0;
      const usedToday = (S.axisDaily===today);
      h += "<button class='btn' onclick='v51_axisAct(\"piety\")'>践行戒律 · 神性+5" + (usedToday?'（今日已行）':'') + "</button>";
      h += "<button class='btn' onclick='v51_axisAct(\"abyss\")'>冥思镇渊 · 深渊-3" + (usedToday?'（今日已行）':'') + "</button>";
      h += "<button class='btn' onclick='v52_peakPanel()'>⛰巅峰盘</button>\n";
      h += "<button class='btn' onclick='w64_worldPanel()'>🌍世界</button>\n"; /*v64inj:panel*/
      h += "<button class='btn' onclick='v55_skillPanel()'>⚔技能</button>\n";
      h += "<button class='btn' onclick='v52_artifactPanel()'>⚔神器</button>\n";
      h += "<button class='btn' onclick='closePanel()'>返回游戏</button>";
      h += "</div></div>";
      openModal(elFromHtml(h));
    }catch(e){ console.error(e); }
  };
  window.v51_treeView = function(bid){
    try{
      v51_ensureDefaults();
      const job = S.job || '';
      const t = (FEATS_V51[job]||{})[bid];
      if(!t){ if(window.flashMsg) flashMsg('未找到该专长树。'); return; }
      const body = document.getElementById('v51-body');
      if(!body) return;
      const stt = v51_axisStatus();
      let h = '';
      h += '<div style="font-size:14px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ ' + t.cn + ' ━━</div>';
      h += '<div style="margin:6px 0;font-size:13px;color:var(--text-secondary);">' + t.desc + '</div>';
      h += '<div style="margin:4px 0 8px;font-size:12px;color:var(--text-muted);">神性 ' + stt.piety + ' · 深渊 ' + stt.corruption + ' · 专长点 ' + (S.featPoints||0) + '</div>';
      (t.nodes||[]).forEach(function(n){
        const fid = t.id + '_' + n.lv;
        const owned = !!S.feats[fid];
        let status = '';
        if(owned) status = ' <span style="color:var(--success);">✓ 已习得</span>';
        else {
          if(n.lv>1){
            const prev = t.id + '_' + (n.lv-1);
            if(!S.feats[prev]) status = ' <span style="color:var(--text-muted);">（需先习得上一级）</span>';
          }
          if(n.lv===6){
            const prevs = [1,2,3,4,5].filter(function(k){ return S.feats[t.id+'_'+k]; }).length;
            if(prevs<5) status = ' <span style="color:var(--text-muted);">（需前五级圆满）</span>';
            else if((stt.piety<40)&&(stt.corruption<40)) status = ' <span style="color:var(--warning);">（需神性或深渊 ≥40）</span>';
          }
        }
        h += '<div style="margin:8px 0;padding:8px 10px;background:var(--bg-panel2);border:1px solid ' + (owned?'var(--success)':'var(--border)') + ';border-radius:8px;">'
          + '<div style="font-size:14px;color:var(--text-primary);">' + n.lv + '级 · ' + n.cn + status + '</div>'
          + '<div style="font-size:12.5px;color:var(--text-secondary);margin-top:2px;line-height:1.6;">' + n.desc + '</div>'
          + '<button class="btn btn-sm" style="margin-top:6px;" onclick="v51_pickFeat(\'' + bid + '\',' + n.lv + ')">' + (owned?'卸下':'习得') + '</button></div>';
      });
      h += '<div style="margin-top:10px;">'
        + '<button class="btn" onclick="v51_featPanel()">返回修行总览</button> '
        + '<button class="btn" onclick="closePanel()">返回游戏</button></div>';
      body.innerHTML = h;
    }catch(e){ console.error(e); }
  };
  window.v51_pickFeat = function(bid, lv){
    try{
      v51_ensureDefaults();
      const job = S.job || '';
      const t = (FEATS_V51[job]||{})[bid];
      if(!t) return;
      const n = (t.nodes||[])[lv-1];
      if(!n) return;
      const fid = t.id + '_' + n.lv;
      if(S.feats[fid]){
        delete S.feats[fid];
        S.featPoints = (S.featPoints||0) + 1;
        if(window.flashMsg) flashMsg('已卸下专长：' + n.cn + '（专长点 +1）');
        v51_treeView(bid);
        return;
      }
      if((S.featPoints||0) < 1){ if(window.flashMsg) flashMsg('专长点不足。破境成功可获得专长点。'); return; }
      if(lv>1){
        const prev = t.id + '_' + (lv-1);
        if(!S.feats[prev]){ if(window.flashMsg) flashMsg('需先习得上一级专长。'); return; }
      }
      if(lv===6){
        const prevs = [1,2,3,4,5].filter(function(k){ return S.feats[t.id+'_'+k]; }).length;
        if(prevs<5){ if(window.flashMsg) flashMsg('毕业专长需前五级圆满。'); return; }
        const stt = v51_axisStatus();
        if((stt.piety<40)&&(stt.corruption<40)){ if(window.flashMsg) flashMsg('毕业专长需神性或深渊达到 40。'); return; }
      }
      S.featPoints = (S.featPoints||0) - 1;
      S.feats[fid] = 1;
      if(window.flashMsg) flashMsg('习得专长：' + n.cn);
      if(n.eff){ try{ n.eff.call(null); }catch(e){ console.error(e); } }
      try{ renderTop(); renderStats(); }catch(e){}
      v51_treeView(bid);
    }catch(e){ console.error(e); }
  };
})();


/* ===== v52 职业系统深化：判定钩子 + 组织/神座/巅峰/神器 机制层 ===== */
const FEAT_EFFECT_V52 = [];
/*v52inj:featfx*/

FEAT_EFFECT_V52.push({flag:"v51_魔法师_elemental_1",scene:"战斗",type:"bonus",value:2,label:"元素亲和·塑能准头"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_elemental_3",scene:"战斗",type:"bonus",value:3,label:"元素共鸣·元素应声"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_elemental_5",scene:"战斗",type:"bonus",value:4,label:"元素风暴·风暴核心"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_conjurer_2",scene:"探索",type:"bonus",value:2,label:"轻门·门缝探风"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_conjurer_4",scene:"探索",type:"bonus",value:3,label:"空间锚定·锚点定位"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_conjurer_5",scene:"战斗",type:"floor",value:55,label:"双门·围猎之门"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_arcane_5",scene:"探索",type:"bonus",value:3,label:"规则编织·改写细节"});
FEAT_EFFECT_V52.push({flag:"v51_魔法师_arcane_4",scene:"修炼",type:"bonus",value:4,label:"法阵叠写·三重不悖",target:"root"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_medium_1",scene:"探索",type:"bonus",value:2,label:"灵觉初开·余温可察"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_medium_3",scene:"社交",type:"bonus",value:3,label:"灵语·亡者口音"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_medium_5",scene:"探索",type:"bonus",value:3,label:"灵界向导·灵界认路"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_hypnotist_2",scene:"社交",type:"bonus",value:2,label:"暗示·无心之言"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_hypnotist_5",scene:"社交",type:"floor",value:50,label:"意志绳·一线回拉"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_soulbinder_3",scene:"社交",type:"bonus",value:3,label:"守诺·诺言温热"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_soulbinder_5",scene:"战斗",type:"bonus",value:2,label:"共感·分你一半"});
FEAT_EFFECT_V52.push({flag:"v51_灵魂法师_medium_2",scene:"修炼",type:"bonus",value:4,label:"安魂手·灵台安定",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_术士_alchemist_3",scene:"交易",type:"bonus",value:4,label:"转化直觉·看见本质"});
FEAT_EFFECT_V52.push({flag:"v51_术士_alchemist_5",scene:"交易",type:"floor",value:50,label:"贤者之手·炉灰老友"});
FEAT_EFFECT_V52.push({flag:"v51_术士_forger_3",scene:"战斗",type:"bonus",value:3,label:"淬火·入水时机"});
FEAT_EFFECT_V52.push({flag:"v51_术士_forger_5",scene:"战斗",type:"floor",value:48,label:"以身为砧·自身回音"});
FEAT_EFFECT_V52.push({flag:"v51_术士_machinist_2",scene:"探索",type:"bonus",value:3,label:"齿轮语·咬合成句"});
FEAT_EFFECT_V52.push({flag:"v51_术士_machinist_4",scene:"探索",type:"bonus",value:2,label:"第一件构装·行走三步"});
FEAT_EFFECT_V52.push({flag:"v51_术士_machinist_5",scene:"交易",type:"bonus",value:3,label:"构装知己·机关关节"});
FEAT_EFFECT_V52.push({flag:"v51_术士_alchemist_2",scene:"修炼",type:"bonus",value:4,label:"配比·手感入微",target:"root"});
FEAT_EFFECT_V52.push({flag:"v51_战士_berserker_3",scene:"战斗",type:"bonus",value:3,label:"红视·怒火入血"});
FEAT_EFFECT_V52.push({flag:"v51_战士_berserker_5",scene:"战斗",type:"floor",value:48,label:"狂而不乱·怒中一线"});
FEAT_EFFECT_V52.push({flag:"v51_战士_weaponmaster_2",scene:"战斗",type:"bonus",value:2,label:"换手·破绽即门"});
FEAT_EFFECT_V52.push({flag:"v51_战士_weaponmaster_4",scene:"战斗",type:"bonus",value:3,label:"破势·势尽处落"});
FEAT_EFFECT_V52.push({flag:"v51_战士_shieldguard_3",scene:"战斗",type:"bonus",value:2,label:"盾墙·并肩之墙"});
FEAT_EFFECT_V52.push({flag:"v51_战士_shieldguard_5",scene:"战斗",type:"floor",value:50,label:"阵眼·不动之桩"});
FEAT_EFFECT_V52.push({flag:"v51_战士_berserker_2",scene:"修炼",type:"bonus",value:4,label:"战吼·血气为薪",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_paladin_3",scene:"战斗",type:"bonus",value:3,label:"斩邪·圣焰所指"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_paladin_5",scene:"社交",type:"floor",value:48,label:"不动心·誓言如锚"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_protector_3",scene:"战斗",type:"bonus",value:2,label:"代受·替你挡下"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_protector_5",scene:"战斗",type:"floor",value:50,label:"不动如山·山不移"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_itinerant_3",scene:"社交",type:"bonus",value:3,label:"断案·察言断狱"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_itinerant_5",scene:"战斗",type:"bonus",value:2,label:"疾风·巡游如风"});
FEAT_EFFECT_V52.push({flag:"v51_骑士_paladin_2",scene:"修炼",type:"bonus",value:4,label:"圣焰·心火不熄",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_hunter_2",scene:"战斗",type:"bonus",value:2,label:"陷阱·猎者之算"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_hunter_4",scene:"探索",type:"bonus",value:3,label:"潜行·脚步无痕"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_warden_3",scene:"探索",type:"bonus",value:3,label:"地脉·聆听大地"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_warden_5",scene:"探索",type:"floor",value:48,label:"守夜·夜不欺你"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_scout_2",scene:"战斗",type:"bonus",value:3,label:"快射·先手之矢"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_scout_4",scene:"探索",type:"bonus",value:2,label:"撤退路·来路可循"});
FEAT_EFFECT_V52.push({flag:"v51_游侠_scout_3",scene:"修炼",type:"bonus",value:4,label:"制高点·高处望远",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_assassin_3",scene:"探索",type:"bonus",value:3,label:"匿迹·影子归你"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_assassin_5",scene:"战斗",type:"bonus",value:2,label:"影步·无声贴近"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_burglar_3",scene:"探索",type:"bonus",value:3,label:"机关眼·关节要害"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_burglar_5",scene:"交易",type:"bonus",value:4,label:"估价·一眼定值"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_spy_2",scene:"社交",type:"bonus",value:3,label:"套话·话里钓话"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_spy_4",scene:"社交",type:"bonus",value:2,label:"暗号·同道相认"});
FEAT_EFFECT_V52.push({flag:"v51_盗贼_burglar_2",scene:"修炼",type:"bonus",value:4,label:"夜眼·暗中视物",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_healer_3",scene:"战斗",type:"bonus",value:2,label:"清创·止血如常"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_healer_5",scene:"战斗",type:"floor",value:48,label:"起死回生一线·一线之隔"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_inquisitor_2",scene:"社交",type:"bonus",value:2,label:"圣印·神名之重"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_inquisitor_4",scene:"社交",type:"floor",value:50,label:"断狱·照见真假"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_warpriest_3",scene:"战斗",type:"bonus",value:3,label:"战场布道·祷声如令"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_warpriest_5",scene:"战斗",type:"bonus",value:2,label:"圣战体·神庇之躯"});
FEAT_EFFECT_V52.push({flag:"v51_牧师_healer_2",scene:"修炼",type:"bonus",value:4,label:"圣愈·先愈己身",target:"mind"});
FEAT_EFFECT_V52.push({flag:"v51_商人_merchant_3",scene:"交易",type:"bonus",value:4,label:"行情·市井脉搏"});
FEAT_EFFECT_V52.push({flag:"v51_商人_merchant_5",scene:"交易",type:"floor",value:52,label:"眼光·物有真价"});
FEAT_EFFECT_V52.push({flag:"v51_商人_banker_3",scene:"社交",type:"bonus",value:2,label:"拆借·人情往来"});
FEAT_EFFECT_V52.push({flag:"v51_商人_banker_5",scene:"交易",type:"bonus",value:3,label:"风控·算无遗策"});
FEAT_EFFECT_V52.push({flag:"v51_商人_auctioneer_3",scene:"社交",type:"bonus",value:3,label:"识人·一眼分寸"});
FEAT_EFFECT_V52.push({flag:"v51_商人_auctioneer_5",scene:"社交",type:"floor",value:50,label:"人情·价外有价"});
FEAT_EFFECT_V52.push({flag:"v51_商人_banker_2",scene:"修炼",type:"bonus",value:4,label:"记账·盈亏分明",target:"root"});

const ORG_V52 = {};
/*v52inj:org*/

ORG_V52["盗贼"] = {
 "cn":"暗影阁", "motto":"影子不欠光，光也不欠影。", "power":"自由城邦 · 旧剧院地下", "leader":"阁主 · 灰尾",
 "ranks":["未入会","线人","影子","执影者","阁主"],
 "entry":"暗影阁没有门，只有旧剧院后台一块会转的木板。灰尾的声音从黑暗里传出来，听不出年纪：'线人不问来历，只问一件事——你偷东西，是为了自己，还是为了活命？'你还没答，他笑了：'不用答。答案在你手上。'",
 "tasks":[
  {"id":"org_thief_a","title":"影子的第一课","desc":"偷回一件被偷走的东西。","needRank":1,"rep":12,"steps":[
    {"text":"灰尾交给你一枚铜铃铛：'这件东西，是一个乞丐从坟地里偷的。他偷错了——那是给死人的。你去把它放回去，放回它原来在的那座坟前。不许偷别的，只许放这一样。'你捏着铃铛，铜面上还沾着湿土。"},
    {"text":"夜里的坟地比想象中安静。你找到那座坟，把铃铛放在碑前，拜了一拜。转身要走时，你听见风里有一声很轻的铃响——像是那东西终于回了家。你回到旧剧院，灰尾已经知道了：'放回去了。'他说，'线人。记住这一课：偷回来的东西，有时比偷走的更重。'","opts":[
      {"t":"记下坟的位置，来年替它除草","rep":12,"passText":"你走出剧院时，那声铃响还跟在风里。","end":1}
    ]}
  ],"endText":"你成了暗影阁的线人。那枚铃铛你后来又去过几次——每次去，都只是看看它还在不在。"},
  {"id":"org_thief_b","title":"夜市的规矩","desc":"有人在夜市的地盘上偷'不该偷的东西'。","needRank":2,"rep":30,"steps":[
    {"text":"夜市东头最近有人坏了规矩——偷的不光是钱，还有人家供在神龛前的旧物。灰尾说：'影子。去把那人找出来。规矩不是不偷，是有些东西不能碰。'他给你一句话：'碰神龛的手，迟早要还给神。'"},
    {"text":"你蹲了三天夜市，在东头的赌摊边逮到了那双手——是个半大的孩子，怀里揣着一尊缺了角的木像。你按住他，他吓得直哆嗦：'我、我娘病了……他们说这木像是金的……'你掀开他怀里，木像沉甸甸的，只是旧，不是金。","opts":[
      {"t":"放他走，自己把木像还回神龛","rep":15,"passText":"你还木像时，神龛前的香灰落了你一身。灰尾只说了一句：'做得对。'"},{"t":"带他去给木像的主人磕头认错","rep":15,"passText":"主人没有骂，只把木像递给孩子：'供着吧。你娘会好。'"}
    ]},
    {"text":"灰尾把影子的黑巾系在你脸上：'影子。'他说，'暗影阁的规矩不是不偷——是偷之前，先分清哪些东西碰不得。你分清了。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 影子，获得 1 点专长'); },"end":1}
  ],"endText":"你升为影子。那尊木像后来供回了原处，香火不断。你每次路过，都会多看一眼——它缺的那只角，没人补，也没人再偷。"},
  {"id":"org_thief_c","title":"阁主的旧账","desc":"有人翻出了灰尾三十年前的一桩旧账。","needRank":3,"rep":40,"steps":[
    {"text":"一封信从城西送来，落在旧剧院后台，信封上画着一只眼睛——是城西'白鼠'帮派的记号。信上说：'灰尾，三十年前你欠我的那条命，该还了。'灰尾看完信，没有烧，也没有回。他把信推给你：'执影者还没定。你先替我看看——这封信，是真的想讨债，还是想借讨债的由头，做别的事？'"},
    {"text":"你顺着信上的字迹查了三天。'白鼠'帮三个月前换了新当家，老当家死得不明不白。这封信是新当家的手笔——他不在乎三十年前的旧账，他在乎的是暗影阁在这条街上的地盘。你把查到的摆到灰尾面前。他看了很久，说：'影子。你查的不是账，是人心。'","opts":[
      {"t":"替灰尾回一封信，约对方当面了断","rep":20,"passText":"那夜，城西的灯笼熄了三盏。天亮后，旧账清了，新当家的手安静了。"},
      {"t":"查出老当家的死因，把真相送到新当家面前","rep":20,"passText":"真相是：老当家是病死的，不是灰尾害的。新当家看完，把信烧了，再没提过旧账。"}
    ]},
    {"text":"灰尾把执影者的银匕交给你：'执影者。'他说，'暗影阁三十年前欠的账，今夜清了。往后阁里的账，你替我记。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 执影者，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为执影者。城西的灯笼如今夜夜亮着，没人再提三十年前的旧账——只偶尔有人说起，暗影阁的新执影者，是个查人心比查钱准的人。"},
  {"id":"org_thief_d","title":"剧院的那块木板","desc":"市政厅要拆旧剧院，连同地下的暗影阁。","needRank":4,"rep":60,"steps":[
    {"text":"市政厅的告示贴到旧剧院门口：'危楼，限期拆除。'拆楼的人三天后就到。灰尾坐在后台那把旧椅子上，手边放着一壶凉茶：'执影者。剧院拆了，暗影阁可以搬——可这块木板后面，埋着阁里三代人的东西。'他没说'保下来'，可你知道他在等什么。"},
    {"text":"你在市政厅蹲了两天。拆楼令是新城管署长签的——他来自由城邦第一件事，就是立威。你找到了他的软肋：他儿子欠着赌场的债，赌场正好是暗影阁的地盘。你没有逼他，只让人把他儿子那笔账的单据，原样送了一份到他桌上。第二天，拆楼令撤了，改为'修缮古迹'。","opts":[
      {"t":"暗中保住剧院，不露声色","rep":30,"passText":"修缮队进场那天，灰尾把一壶新茶放在你面前：'喝。'"},{"t":"把单据当面还给署长，换他一个承诺","rep":30,"passText":"署长收下单据，沉默很久：'暗影阁的账，我记下了。'"}
    ]},
    {"text":"旧剧院保住了。灰尾把阁主的黑玉印交给你：'阁主。'他说，'剧院还是那块木板，可底下埋的东西，从今天起归你看着。'","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 阁主'); },"end":1}
  ],"endText":"你成了暗影阁的阁主。旧剧院的招牌重新漆了一遍，后台那块木板，你每天亲自擦——它下面埋着三代人的东西，如今再加上你这一代。"},
  {"id":"org_thief_e","title":"木板下的密格","desc":"阁主代代相传的密格，锁着一卷旧羊皮。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"你在那块木板的背面摸到一道暗缝。撬开，里面是一卷旧羊皮，画着一柄短刃，批注：'夜影，初代阁主的佩刃。传说它如今躺在承天城王宫宝库的暗格里——那暗格的钥匙，三代阁主都没找齐过。'羊皮背面还有一行字：'钥匙不在锁里，在人心里。'"},
    {"text":"你把羊皮卷好放回暗缝，又摸了摸木板。剧院外，有人正唱着旧戏，声音穿过木板，像隔着几十年的光阴跟你打了个招呼。","opts":[
      {"t":"记下羊皮上的线索","rep":0,"passText":"你合上木板，戏还在唱。", "end":1}
    ]}
  ],"endText":"你有了职业神器的线索：夜影短刃。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["牧师"] = {
 "cn":"圣辉教会", "motto":"光不为照路，光为照人。", "power":"圣城 · 大教堂", "leader":"教皇 · 安文",
 "ranks":["未入会","见习","司铎","主教","枢机主教"],
 "entry":"大教堂的门是开着的，可你要从侧门进。教皇安文在告解室等你：'孩子，进来前先说清楚——你是来找神的，还是来找光的？神不问，光会问。'他停顿了一下，'先想清楚，再敲门。'",
 "tasks":[
  {"id":"org_priest_a","title":"告解室的第一课","desc":"听一位老妇人的告解。","needRank":1,"rep":12,"steps":[
    {"text":"告解室里坐着一位老妇人，她在发抖。她说她年轻时偷过邻家的一个银勺，邻家为此怀疑了儿媳妇一辈子，婆媳吵了几十年。'神父，我不怕死，我怕他们到死都不知道不是我儿媳偷的。'她攥着念珠，指节发白。"},
    {"text":"你听完，没有急着宽恕。你问她：'那银勺，还在你手里吗？'她说在，供在柜底。你说：'那勺不该供在柜底。明天，我陪你去邻家，把勺还回去，把话说开。'老妇人哭了起来，不是伤心的哭，是那种终于有人肯陪她走完最后一步的哭。","opts":[
      {"t":"陪她去邻家还勺","rep":12,"passText":"还勺那天，邻家儿媳站在门口，看了老妇人很久，忽然哭了。"},{"t":"替她写一封信，说明原委","rep":12,"passText":"信送去第三天，邻家儿媳来了教堂，只在门口站了站，没进来。"}
    ]},
    {"text":"教皇安文在侧门等你：'见习。'他说，'告解室里坐的从来不是罪人，是走不动路的人。你陪她走了。'","end":1}
  ],"endText":"你成了圣辉教会的见习。那枚银勺如今回到了邻家的柜台上，每天擦得锃亮。"},
  {"id":"org_priest_b","title":"疫区的烛光","desc":"城南疫区，有人把病人抬到教堂门口。","needRank":2,"rep":30,"steps":[
    {"text":"城南的疫病传开那天，有人把发烧的孩子放在教堂门口就走了。你抱着孩子进教堂时，安文正在收拾药箱：'司铎的活儿，从抱人开始。'他把药箱递给你：'你带着药去城南。教堂的门，今夜不关。'"},
    {"text":"你在城南守了七天。第七天夜里，你累得靠在墙根睡着了，梦见一扇门，门里有人喊你的名字。你惊醒，面前排着等着看病的队伍——他们谁也没走，就那样安静地排着，等你醒。","opts":[
      {"t":"把最后的药分给老人和孩子","rep":15,"passText":"药分完时，天亮了。你空着手回教堂，脚步却比来时沉实。"},{"t":"留下守夜，替病人念安眠祷词","rep":15,"passText":"祷词念到一半，排队的队伍里有人跟着念了起来，声音低低的，连成一片。"}
    ]},
    {"text":"安文把司铎的白领圈交给你：'司铎。'他说，'疫区的人认得你了。他们排队等你醒来的那夜，就是你的任命书。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 司铎，获得 1 点专长'); },"end":1}
  ],"endText":"你升为司铎。城南的人如今见你，不叫神父，叫你'醒来的那个'。"},
  {"id":"org_priest_c","title":"异端之名","desc":"一个学者被教会指为异端，可你听出了他话里的真话。","needRank":3,"rep":40,"steps":[
    {"text":"学者奥本被押进教会地牢，罪名是'质疑圣典的成书年代'。你去旁听审问。他戴着镣铐，不辩解，只说：'我抄过七份手稿，第七份的年代比第一份晚两百年——我没有质疑神，我只是想弄清楚，哪一句是人添的。'审问官敲着桌子：'亵渎！'"},{"text":"你翻了他的手稿。那七份抄本你看了三天，发现他说的没错：最早的版本里，没有'以火焚之'那一句。你把发现写成一页纸，压在安文的桌上，没有署名。第四天，奥本被放了出来，罪名改为'学术争议'。","opts":[
      {"t":"匿名保住学者，不留痕迹","rep":20,"passText":"奥本离开圣城那天，在城门口站了很久，对着教堂的方向鞠了一躬。"},{"t":"当面替他在教廷辩护","rep":20,"passText":"你辩护时，教廷的席位上有几只手替你抬了抬帽檐——他们也想听真话。"}
    ]},
    {"text":"安文把你叫进密室，把主教的紫衣放在你面前：'主教。'他说，'教会这两百年，就是靠像你这样的人，才没把真话烧光。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 主教，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为主教。那页没有署名的纸，如今还压在安文的桌角。他偶尔会翻开看看，看完就合上，什么也不说。"},
  {"id":"org_priest_d","title":"大教堂的钟","desc":"圣城暴动，大教堂成了最后一道门。","needRank":4,"rep":60,"steps":[
    {"text":"粮荒引发的暴动涌到圣城，大教堂的门前站满了人——有逃难的，也有趁乱抢掠的。安文站在钟楼上，把钟绳交给你：'主教。教堂的门，今夜不关，但也不能塌。你决定：钟声，敲给谁听？'"},{"text":"你握着钟绳，看着楼下的人潮。你想起城南那夜排队等你醒来的队伍——他们和楼下的人，是同一批人。你敲钟了，不是报警的急钟，是安魂的慢钟。一下，一下，钟声漫过人群。暴动的人群渐渐静下来，有人跪了下去，有人站在原地，抬头看钟楼。","opts":[
      {"t":"敲安魂钟，稳住人群，开门放粮","rep":30,"passText":"粮仓开门那夜，教堂的灯亮了一整夜，没有人趁乱抢一粒米。"},{"t":"敲钟召集教士上钟楼守门","rep":30,"passText":"教士们站在钟楼上，唱起安魂诗。歌声压过了喊声，暴动的人群散了大半。"}
    ]},
    {"text":"暴动平息后，安文在钟楼把枢机主教的红帽交给你：'枢机。'他说，'大教堂的钟，从今往后归你敲。记住——钟声不是命令，是陪伴。'","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 枢机主教'); },"end":1}
  ],"endText":"你成了枢机主教。那口钟如今每天照常敲，只是节奏慢了些——像在跟整座城说：我在。"},
  {"id":"org_priest_e","title":"钟楼里的旧经卷","desc":"钟楼最上层的夹层里，压着一卷圣典最早的手稿。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"修钟时，你在钟楼夹层里摸到一卷羊皮。展开，是最早那版圣典的手稿——就是奥本当年想找的那版，没有'以火焚之'那一句。手稿末尾有一行小字，像是第一任教皇写的：'光不为照路，光为照人。'旁边画着一柄法杖：'圣辉权杖，随初代教皇葬于银叶城外的古修道院遗址。'"},{"text":"你把手稿放回夹层，没有声张。走出钟楼时，钟声正好响了一记——像初代教皇隔着几百年，敲了一下你的背。","opts":[
      {"t":"记下手稿上的线索","rep":0,"passText":"你合上钟楼的门，钟声还在你耳边。", "end":1}
    ]}
  ],"endText":"你有了职业神器的线索：圣辉权杖。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["商人"] = {
 "cn":"金衡商会", "motto":"秤平，则人心平。", "power":"南方港城 · 金衡大厅", "leader":"会长 · 沈金",
 "ranks":["未入会","伙计","账房","掌柜","会长"],
 "entry":"金衡大厅的门口立着一杆旧秤，秤砣上刻着两个字：'公秤'。会长沈金坐在大厅里拨算盘，头也没抬：'入会先过秤。你心里那杆秤，称的是银子，还是良心？'他停了停，'不用答。跟我做一单生意，我自然知道。'",
 "tasks":[
  {"id":"org_trade_a","title":"一单小生意","desc":"替金衡商会送一批货，途中秤不准。","needRank":1,"rep":12,"steps":[
    {"text":"沈金让你送一批盐到城北的杂货铺：'货款按秤结算。'你赶着车到了半路，发现车上的秤比铺子里的标准秤轻了三两——这是商会的老把戏：送出去的秤，从来不是公秤。你停在路口，想了一会儿。"},
    {"text":"你把盐送到铺子，当着掌柜的面，用自己的秤重新称了一遍，按实秤结了账。回去的路上，你心想这趟亏了。可回到大厅，沈金正在等你，面前摆着那杆公秤：'你称的那笔账，我知道了。'他说，'伙计。金衡商会不缺会算账的人，缺的是秤上不掺假的人。'"},{"text":"沈金把账房的钥匙交给你：'账房。'他说，'从今天起，你管的第一本账，是你自己那杆秤。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 账房，获得 1 点专长'); },"end":1}
  ],"endText":"你升为账房。那杆'亏了'的秤你留了下来，摆在账房桌上——它称过你入会那天的心。"},
  {"id":"org_trade_b","title":"沉船的消息","desc":"一条商船沉了，船上的货是商会一年的心血。","needRank":2,"rep":30,"steps":[
    {"text":"南方的海风带来坏消息：商会的船'金穗号'在风暴里沉了，货主们围在金衡大厅门口，要商会给个说法。沈金把账册推到你面前：'账房。你替他们算一笔账——这笔账，要他们服气，也要商会活得下去。'"},
    {"text":"你算了三天账。金穗号的货单上，七成货物买了保，三成是赊账的散户。你拟了一个方案：保额先赔散户，商会的损失自己扛，明年再摊。你把方案送到沈金桌上，他看完，只说了一句：'你算的不是账，是人心。'","opts":[
      {"t":"先赔散户，商会自担损失","rep":15,"passText":"赔款发完那天，围在门口的人散了。有人临走时，对着大厅鞠了一躬。"},{"t":"说服货主们改签分成协议，共担风险","rep":15,"passText":"协议签下那天，沈金把那杆公秤搬到了门口——'秤平，则人心平。'"}
    ]},
    {"text":"沈金把掌柜的玉算盘交给你：'掌柜。'他说，'金衡商会的账，从今天起你说了算。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 掌柜，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为掌柜。金穗号的沉船如今成了商会的一堂课：账房们算账前，都会先看一眼门口那杆公秤。"},
  {"id":"org_trade_c","title":"海上的盐","desc":"有人往商会进的盐里掺了沙。","needRank":3,"rep":40,"steps":[
    {"text":"南方的盐船进港，你验货时发现盐里掺了沙——不是底下一点，是均匀地掺了一成。你查了货单，这批盐是从一个老供货商手里进的，他给商会供了二十年盐，从没出过事。"},
    {"text":"你带上盐样，亲自去了老供货商的仓房。他看见你就明白了，没有辩解，只把一摞账单推过来：'我儿子欠了赌债，有人拿账单逼我掺沙。'他指着仓库角落：'那批干净盐我留着，没敢动——我掺沙，是想先渡过这一关，再想办法换回来。'","opts":[
      {"t":"按规矩终止合作，但替他还清赌债","rep":20,"passText":"他后来改行做了码头的验货员，逢人就夸商会的账房有人情味。"},{"t":"给他一次机会，监督他换回干净盐","rep":20,"passText":"干净盐换回那天，他在仓房门口站了很久，对着金衡大厅的方向，作了一个揖。"}
    ]},
    {"text":"沈金听完你的处理，把会长的大印从抽屉里拿出来，放在桌上，又推到你面前：'掌柜。印先放你这里。等你能自己拍板那桩大生意，它就是你的。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 代理会长事务'); },"end":1}
  ],"endText":"老供货商如今在码头做验货员，每天经手的盐成百上千袋——他逢人就说，掺过沙的秤，一辈子都要用干净盐来还。"},
  {"id":"org_trade_d","title":"金衡之危","desc":"有人做空金衡商会的银票，港城挤兑。","needRank":4,"rep":60,"steps":[
    {"text":"南方港城一夜之间出现大量金衡银票，都要求兑银。银库里的存银只够兑四成。沈金坐在大厅里，面前排着长队，他抬头看你：'掌柜。今晚，商会的命在你手里。你选：关库保银，还是开库兑银？'"},
    {"text":"你算了半夜。那些银票的编号，有一半不在商会的票根上——是伪造的。你让人把真票和伪票分开，然后打开库门：'真票，全额兑。伪票，请持有人说明来历。'排队的队伍骚动起来，可当第一张伪票被当众验明时，人群静了。假票的背后是谁，没人再问，但挤兑的势头，停住了。","opts":[
      {"t":"当众验明伪票，开库兑真","rep":30,"passText":"挤兑的第三天，银库见底，可商会的信誉，立住了。"},{"t":"暗中放出消息稳住大户，小户全额兑","rep":30,"passText":"一个月后，金衡的银票重新流通。沈金说：'你救的不是银库，是信。'"}
    ]},
    {"text":"挤兑风波过后，沈金把会长的大印正式交给你：'会长。'他说，'金衡商会从今天起，你当家。记住门口那杆公秤——它称过你入会那天的心，也称过今夜的门。'","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 金衡会长'); },"end":1}
  ],"endText":"你成了金衡商会的会长。门口那杆公秤还在，秤砣上'公秤'两个字，被擦得比从前亮。"},
  {"id":"org_trade_e","title":"公秤的来历","desc":"老会长交给你的一只旧铁匣，里面是公秤的来历。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"沈金退位前，从大厅的暗格里取出一只铁匣：'公秤不是铁打的，是人传的。匣里是初代会长的账本，账本最后一页画着一枚金算盘——'称心如意'，传说它沉在自由城邦旧港的沉船里，沉船的位置，只记在初代账本的夹页里。'你翻开账本，夹页里果然有一张泛黄的港图。"},
    {"text":"你合上账本，把铁匣放回暗格。走出大厅时，门口那杆公秤在风里轻晃了一下——像初代会长在跟你点头。","opts":[
      {"t":"记下港图上的位置","rep":0,"passText":"你把港图收进怀里，秤影在脚下晃了晃。", "end":1}
    ]}
  ],"endText":"你有了职业神器的线索：称心如意（金算盘）。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};


ORG_V52["战士"] = {
 "cn":"战神团", "motto":"刃口朝敌，脊梁朝己。", "power":"北方公国 · 磐石营", "leader":"团长 · 铁眉·葛兰",
 "ranks":["未入会","列兵","什长","百夫长","团长"],
 "entry":"战神团的营门立着一柄插进土里的旧矛，矛杆上刻满了名字。接引你的老什长说：'入团前，先在这柄矛前站一夜。想清楚：你是为谁打仗。'他递给你一块干粮，'想清楚了，明早吃它；想不清楚，明早它还在，你人可以走。'",
 "tasks":[
  {"id":"org_war_a","title":"旧矛之誓","desc":"在战神团的旧矛前站一夜，想清楚为谁而战。","needRank":1,"rep":12,"steps":[
    {"text":"夜里的营门很静，只有风把矛杆上的名字吹得发响。你站着，干粮揣在怀里没动。旧矛的矛尖指向北方——那里有战火，也有田庄。你想起老家灶台上那口永远温着的锅，也想起逃难路上见过的那些脚印。"},
    {"text":"天快亮时，你终于想明白了。干粮吃完了，你对着旧矛说了一句。老什长不知道什么时候站在你身后，听见了，没问你说的是什么，只拍了拍你的肩：'想清楚的人，吃得了这碗饭。'","opts":[
      {"t":"向旧矛行一个战士礼","rep":12,"passText":"你行礼时，风正好停了一瞬，像是旧矛在回应。","end":1}
    ]}
  ],"endText":"你成了战神团的列兵。你的名字还没有资格刻上旧矛——老什长说：'名字是自己挣的，不是刻的。'"},
  {"id":"org_war_b","title":"磐石营的早晨","desc":"新兵晨训：扛石、格斗、替老兵磨刃。","needRank":2,"rep":30,"steps":[
    {"text":"磐石营的早晨从扛石开始。每块石头上刻着名字，是阵亡的老兵。老什长说：'扛的不是石头，是他们的份。'你把那块刻着'灰须'的石头扛上肩——他死在五年前的北线，据说死前还在教新兵怎么握矛。"},
    {"text":"格斗场上，老兵让你三招。你出了两招就停手，第三招绕到他身后，替他拍了拍背上的灰。他愣了一下，笑了：'有点意思。'午间磨刃，你替全队磨了十二把刀，磨到最后一把时，手指破了，你吮掉血，继续磨。","opts":[
      {"t":"替灰须的石头擦干净","rep":15,"passText":"你擦石头时，觉得它比早晨轻了一些。"},
      {"t":"把老兵教的三招练到天黑","rep":15,"passText":"天黑时你躺在操场上，肌肉酸痛，心里却踏实。"}
    ]},
    {"text":"月末点兵，老什长把什长的臂环套在你胳膊上：'什长。'他说，'灰须那块石头，往后你带着扛。他生前说，替他把新兵带出来。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 什长，获得 1 点专长'); },"end":1}
  ],"endText":"你升为什长。灰须的石头还在你肩上，可你知道，它现在是你的份，也是他的托付。"},
  {"id":"org_war_c","title":"北线巡逻","desc":"铁门关外，有一队粮车失踪了。","needRank":3,"rep":40,"steps":[
    {"text":"铁门关外五十里的雪原上，粮车的辙印断在了一片乱石滩。你带人沿辙印追了三十里，在一处背风坡找到了车——人不在，粮在，车辕上插着一支东军的黑羽箭。黑羽箭在战神团的规矩里只有一个意思：留下话，人可以走。"},
    {"text":"你围着粮车走了一圈。车上没有血，雪地上也没有挣扎的痕迹——押车的弟兄是自己走的。你拔出黑羽箭，箭杆上刻着两个字：'改道。'你对着雪原大声说：'东边的朋友，粮我收下了。人，下次见面，替我谢他们没动手。'风把话送出去很远。","opts":[
      {"t":"把粮车安全押回铁门关","rep":20,"passText":"粮车进关时，城头的兵向你举了举矛。"},
      {"t":"顺着箭来的方向追三十里探虚实","rep":20,"passText":"你追到一条冻河边，看见一行脚印折返向北——他们走了。"}
    ]},
    {"text":"你带着粮和那支黑羽箭回到铁门关。老什长——现在该叫老百夫长了——看完箭，把它收进匣子：'百夫长。'他说，'这支箭留个记号，往后北线的事，你拿主意。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 百夫长，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为百夫长。那支黑羽箭收在匣里，你偶尔拿出来看看——箭杆上'改道'两个字，是北线少有的、没有血的对白。"},
  {"id":"org_war_d","title":"磐石之墙","desc":"东军主力压境，铁门关告急。","needRank":4,"rep":60,"steps":[
    {"text":"东军主力在铁门关外扎营的那个黄昏，全关的兵都上了墙。团长铁眉站在墙头，把你的手按在城砖上：'百夫长。关破，则北地门户洞开。你带一半人守东墙，我带一半人守西墙。'他顿了顿，'东墙若破，你往后撤，别回头。'你摇头：'要撤你撤，我守东墙。'"},{"text":"东墙打了三昼夜。第三天夜里，你的刀卷了刃，身边只剩七个兵。你想起旧矛前那夜想清楚的话，对着墙外喊了一句。喊的是什么，你自己也记不清了——只记得那七个兵跟你一起喊，声音盖过了战鼓。","opts":[
      {"t":"亲自领队出墙冲阵，撕开缺口","rep":30,"passText":"你冲进敌阵又杀出来，身后留下一条血路，东墙的缺口合上了。"},
      {"t":"死守墙头，与东墙共存亡","rep":30,"passText":"天快亮时，你拄着卷刃的刀站在墙头——东墙，没破。"}
    ]},
    {"text":"援军到了，东军退了。铁眉在城墙上把团长的铜矛交给你：'团长。'他说，'旧矛上，该添你的名字了。'你在旧矛上刻下名字时，风正好停了一瞬——像那年入团前的那个清晨。","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 团长'); },"end":1}
  ],"endText":"你成了战神团的团长。旧矛上你的名字刻在最末，可老什长说，那是这一代最亮的一个。"},
  {"id":"org_war_e","title":"旧矛的来处","desc":"团长铁箱里的半张地图，画着一处无名古战场。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"铁眉退位前，把一只铁箱交给你。箱底压着半张地图，画着铁门关以西的一处荒谷，旁边用炭笔写着：'古战场。百年前团长断矛于此。矛断处，地底有雷声。'铁眉说：'历任团长都知道这事，没人下去过——下去的人，没回来过。'"},
    {"text":"你把地图折好收进怀里。铁眉看了你很久，说：'团长，这半张图，可以断在你这里，也可以续下去。你选。'你没说话，把地图收得更紧了些。","opts":[
      {"t":"收下地图，记下荒谷的位置","rep":0,"passText":"你走出营门时，旧矛上的名字在风里响了一声。"}
    ]}
  ],"endText":"你有了职业神器的线索：战神断矛。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["骑士"] = {
 "cn":"誓约骑士团", "motto":"言出如山，山可移，言不移。", "power":"承天城 · 白塔广场", "leader":"大团长 · 奥尔加",
 "ranks":["未入会","侍从","骑士","统领","大团长"],
 "entry":"誓约骑士团的入团礼很简单：在大团长面前，把自己的誓言说出口。奥尔加坐在白塔的台阶上，手里转着一枚旧誓戒：'说之前想清楚。这枚戒指会记住你说的话——往后你违背它，它比你先知道。'",
 "tasks":[
  {"id":"org_knight_a","title":"第一句誓言","desc":"在大团长面前，立下你的第一句誓言。","needRank":1,"rep":12,"steps":[
    {"text":"白塔广场的风很干，吹得旗子猎猎响。奥尔加把誓戒放在你面前：'你的誓言，可以大，也可以小。但必须是你真打算守的。'台下站满了骑士，都在等。你想起这一路见过的人——那些替陌生人挡过刀的人，那些没来得及说'对不起'的人。"},
    {"text":"你开口了。誓言不长，风把每个字都送得很远。奥尔加听完，没有评判，只把誓戒套在你手指上：'侍从。这枚戒是铁的——等你守过它一次，它才会变成银的。'你低头看戒指，铁面上还留着上一任的体温。","opts":[
      {"t":"把誓言刻在戒指内圈","rep":12,"passText":"刻下那晚，铁戒在你指间沉了一点。","end":1}
    ]}
  ],"endText":"你成了誓约骑士团的侍从。铁戒内圈的刻痕很浅，可你每次握拳都能感觉到它。"},
  {"id":"org_knight_b","title":"白塔下的乞丐","desc":"一个老乞丐在广场上死了，怀里抱着一封信。","needRank":2,"rep":30,"steps":[
    {"text":"老乞丐死在白塔台阶下，怀里抱着一封信，封口是火漆，印着团徽——三十年前的团徽。骑士们围着看，没人动。奥尔加说：'他三十年前是团里的骑士。'她没再说下去。"},
    {"text":"你把信捡起来，没有拆。按团里的规矩，死者的信要送还给信上的人。信皮上写着一个名字，和一个已经荒废的镇名。你翻过马背，骑了两天两夜，把信送到那个镇——收信人是个老妇人，她拆开信，看了很久，说：'他说他要回来了。'","opts":[
      {"t":"替老骑士立一块碑，碑文用信里最后一句","rep":15,"passText":"碑立好那天，你才知道信里最后一句是：'等我。'"},{"t":"把信的内容原样抄一份，留在团里","rep":15,"passText":"信的内容如今在团里的档案柜里——没有人再提，也没有人忘记。"}
    ]},
    {"text":"奥尔加把你叫到白塔：'骑士。'她把自己的银誓戒摘下来，给你看了看内圈——刻着一个名字，正是那个老乞丐的。'他守住了他的誓言，只是方式没人看见。这枚银戒，你配。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 骑士，获得 1 点专长'); },"end":1}
  ],"endText":"你升为骑士。你的银戒内圈空着，你一直没有刻字——你想等一句真正值得刻的话。"},
  {"id":"org_knight_c","title":"誓言的重量","desc":"一个领主的信使求你毁约：替他作伪证。","needRank":3,"rep":40,"steps":[
    {"text":"领主的信使带着一袋金子上门：'团长在查一桩旧案，你只要说那天你在场，看到领主大人没有离开庄园——这袋金子就是你的。'他走时把金子留下，'三天后回话。'你看着那袋金子，又低头看自己手指上的银戒。"},
    {"text":"夜里，你想起入团那天说的誓言。那誓言不长，可每个字都在。你拎着金子上门还给了信使，又去团里把整件事说了。奥尔加听完，没有夸你，只说：'统领。你的誓言，从今晚起比金子重。'","opts":[
      {"t":"拒绝伪证，如实上报","rep":20,"passText":"你走出团长室时，银戒在指间发亮。"},
      {"t":"收下金子，转头设局反查领主","rep":20,"passText":"你顺着金子查下去，查出了一整条走私线——那袋金子，最终成了证物。"}
    ]},
    {"text":"奥尔加把统领的银星别在你胸前：'统领。'她说，'誓言这东西，说出口容易，守下去难。你守住了第一次，往后就都不难了。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 统领，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为统领。那袋金子后来成了团里审讯室的镇纸——每次有人想作伪证，都会先看见它。"},
  {"id":"org_knight_d","title":"白塔之誓","desc":"王国分裂，白塔要站队了。","needRank":4,"rep":60,"steps":[
    {"text":"承天城的王位之争烧到了白塔。两边的使节都来了，都带着王命：'骑士团必须表态。'奥尔加把全团召集到白塔广场：'骑士团不替国王打仗，骑士团替誓言打仗。今晚，你们自己选——跟谁，或是不跟。'她说完，坐回台阶，把誓戒摘下来，放在膝上。"},
    {"text":"夜风把旗子吹得猎猎响。你想了很久，走到奥尔加面前，把银戒摘下来放在她膝上，和她的并排：'我不跟谁。我的誓言不归王位管。'奥尔加笑了——那是你第一次见她笑：'好。那从今夜起，白塔只守自己的誓。'","opts":[
      {"t":"留在白塔，守无主之誓","rep":30,"passText":"那晚之后，白塔广场的旗子换了一面——上面没有王徽，只有一句誓言。"},
      {"t":"带一队骑士出城，护送平民撤离战火","rep":30,"passText":"你带人走了七天，护着三千平民穿过战线。回来时，你的银戒磨出了新的光。"}
    ]},
    {"text":"战火平息后，奥尔加把大团长的金戒交给你：'大团长。'她说，'白塔今后只认誓言，不认王旗。你来做那个'守誓的人'。'你戴上金戒，内圈刻着历代大团长的名字——第一个名字，正是当年白塔初建时的第一句誓言。","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 大团长'); },"end":1}
  ],"endText":"你成了誓约骑士团的大团长。白塔广场的旗子上只有一句誓言，而你的金戒内圈，至今空着——你还在等那句值得刻进去的话。"},
  {"id":"org_knight_e","title":"金戒的传说","desc":"大团长金戒内圈的暗纹，藏着半张地图。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"你把金戒凑到烛火前，才发现内圈的暗纹不是花纹——是半张地图。奥尔加的声音像还留在白塔里：'历代大团长都知道，誓约骑士团的第一件圣物是一面盾，叫'白誓'。传说它沉在银叶城外的一处古湖底，湖底有个守誓的湖灵。'"},{"text":"你把暗纹拓下来，收进怀里。金戒在指间转了一圈——它如今是你的了，连同这句没人说出口的话：白誓的盾面上，刻着骑士团最初的誓言。","opts":[
      {"t":"收好拓片，记下古湖的位置","rep":0,"passText":"你合拢手掌，金戒隔着皮肉，温着你掌心。"}
    ]}
  ],"endText":"你有了职业神器的线索：白誓之盾。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["游侠"] = {
 "cn":"荒野巡守", "motto":"路不问客，客自问路。", "power":"自由城邦 · 绿林会馆", "leader":"总巡 · 苍耳",
 "ranks":["未入会","向导","巡守","老林客","总巡"],
 "entry":"绿林会馆的门从不锁。总巡苍耳坐在门口削一根木棍，头也没抬：'荒野不收客人。你进来之前，先想好一件事——你走的路，是路在带你，还是你在带路？'他把削好的木棍往地上一插：'想好了，拔了它进来。'",
 "tasks":[
  {"id":"org_ranger_a","title":"会馆门口的木棍","desc":"拔起那根木棍，回答总巡的问题。","needRank":1,"rep":12,"steps":[
    {"text":"木棍插在会馆门口，插得很深，拔起来时带起一蓬土。土里有草籽，也有蚂蚁。你握着木棍，忽然明白苍耳问的不是路——是你在荒野里，肯不肯为脚下这片土负责。"},
    {"text":"你走进会馆，把木棍还给苍耳。他接过去，在棍尾刻了一个记号，又递回给你：'向导。荒野的路，你认得一半了。剩下的一半，路会带你认。'","opts":[
      {"t":"收好木棍","rep":12,"passText":"棍尾的记号是三个横道——是路的意思。","end":1}
    ]}
  ],"endText":"你成了荒野巡守的向导。那根木棍你随身带着，逢雨夜，棍身会泛一层潮——那是路在提醒你前面有水。"},
  {"id":"org_ranger_b","title":"迷路的商队","desc":"一条老路改了道，商队在雾里转了三天。","needRank":2,"rep":30,"steps":[
    {"text":"白雾漫过山谷那天，一支商队在山里转了三天。他们请到你的向导服务时，领队已经把最后一点干粮分完了。雾里的路会骗人——老路标被山洪冲了，新路标还没有人立。"},
    {"text":"你带着商队走了一夜。雾最浓时，你摸出那根木棍，棍尾的记号在潮气里发亮。你顺着木棍的潮面转了半圈，指向一处山坳：'这边。'天蒙蒙亮时，商队看见了山谷外的官道。领队握着你的手直抖，说不出话。","opts":[
      {"t":"送商队到官道口","rep":15,"passText":"分手时，领队硬塞给你一袋干粮。你收下，转手分给了路边歇脚的货郎。"},
      {"t":"回头立一块新路标","rep":15,"passText":"你立好路标，又在上面刻了三个横道——路的意思。"}
    ]},
    {"text":"苍耳在会馆里听完你的话，把巡守的绿披风系在你肩上：'巡守。'他说，'雾里的路，你带得动人了。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 巡守，获得 1 点专长'); },"end":1}
  ],"endText":"你升为巡守。那根木棍的潮面如今是你的罗盘——它认得雾，认得雨，也认得那些没人愿意走的路。"},
  {"id":"org_ranger_c","title":"猎人的规矩","desc":"一个猎人在禁猎区设套，套住了巡守的脚。","needRank":3,"rep":40,"steps":[
    {"text":"禁猎区的猎套套住你的脚时，你已经知道是谁下的——雪地上的脚印只有一种，是猎户老柴的。他在林子里打了三十年猎，禁猎令下来后，他改行替人背货，背了半年，又改回了打猎。"},
    {"text":"你解开猎套，没有找上门。你去了老柴家，他正在磨刀，看见你脚踝上的勒痕，手停了。你没提猎套的事，只说：'明天林东头有批货要人背，价好。'老柴沉默了很久，说：'……好。'","opts":[
      {"t":"替他担保，让林场雇他做护林","rep":20,"passText":"老柴成了护林人。他的猎刀挂在墙上，再没摘下来过。"},
      {"t":"把猎套挂回他家门口，留一张字条","rep":20,"passText":"字条上只写了一句：'林子记得你。'老柴看了很久，把猎套收进了柜底。"}
    ]},
    {"text":"苍耳知道了这件事，把你的名字写进了老林客的名册：'老林客。'他说，'荒野的规矩不是赶人走，是给人留一条路。你留了。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 老林客，获得 1 点巅峰'); },"end":1}
  ],"endText":"你成了老林客。老柴如今常来会馆喝茶，逢人就说林东头的货好背——他再没打过猎。"},
  {"id":"org_ranger_d","title":"山火之夜","desc":"北林起了山火，风往村庄吹。","needRank":4,"rep":60,"steps":[
    {"text":"北林的火是夜里烧起来的，风正好往山下的村子吹。苍耳站在会馆门口，背影像一棵烧焦的树：'老林客。火会认路。你带一半人去村口开隔离带，我带一半人上山断火路。'他顿了顿，'要是火过了隔离带——你带人撤，别回头。'你说：'要撤你撤，我守着村。'"},{"text":"你在村口开了三丈宽的隔离带，火到的时候，正好停在那里。你听见火在带外轰轰地烧，像一头撞在看不见的墙上。你想起木棍上那个'路'的记号——路会带你认荒野，荒野也会认你。那一夜，它认了。","opts":[
      {"t":"守在隔离带边，直到火势转弱","rep":30,"passText":"天亮时，隔离带边你的脚印烧焦了一排，村子完好。"},
      {"t":"冲进火场，救出困在里面的猎户","rep":30,"passText":"你背着猎户跑出火场时，眉毛都燎卷了。他后来逢人就说，荒野巡守是山里最硬的脊梁。"}
    ]},
    {"text":"山火过后，苍耳在会馆门口那根旧木桩边，立了一根新的。他把总巡的木哨交给你：'总巡。'他说，'荒野认你了。往后，它托你照看。'","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 总巡'); },"end":1}
  ],"endText":"你成了荒野巡守的总巡。那根木棍如今插在会馆门口，替下一位向导留着——棍尾的记号，还是三个横道。"},
  {"id":"org_ranger_e","title":"老林客的卷轴","desc":"会馆阁楼的一只旧箭筒里，卷着一张兽皮。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"清理阁楼时，你在旧箭筒里发现一张卷着的兽皮。展开，画着一片荒野，正中标注：'风语弓，传说由百年前的老总巡沉于铁门关外的冻湖。湖水冻了百年，弓在冰下等一个听得见风说话的人。'"},
    {"text":"你把兽皮卷好，放进箭筒。走出会馆时，风正好穿过门口那根木棍的记号——像有人在远处喊你的名字。","opts":[
      {"t":"收好兽皮，记下冻湖的位置","rep":0,"passText":"你抬头看了看天，风向正好指着铁门关。", "end":1}
    ]}
  ],"endText":"你有了职业神器的线索：风语弓。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};


ORG_V52["魔法师"] = {
 "cn":"元素学院", "motto":"星落之处，皆是我等书案。", "power":"艾尔达魔法学院 · 星落塔", "leader":"院长 · 艾尔温",
 "ranks":["未入会","学徒","执事","席主","首席"],
 "entry":"你是在学院的推荐信里第一次读到元素学院的名字。信尾有一行小字：'凡欲叩星落塔之门者，须先证明自己敬畏元素，而非仅仅渴望力量。'门房收信时看了你很久，像是在丈量你够不够格。",
 "tasks":[
  {"id":"org_mage_a","title":"星落塔的学徒试炼","desc":"入塔第一课：证明你敬畏元素。","needRank":1,"rep":12,"steps":[
    {"text":"星落塔顶层有一间空屋，地板上画着七重环。老执事让你进去，把门从外面带上。'元素会先试你。'他说，'别急着赢，先听。'屋里没有窗，只有墙缝里漏进来的风，冷得像在小声说话。"},
    {"text":"你坐下来。起初什么都感觉不到，只有自己的心跳。慢慢地，你听见了——不是声音，是一种更靠后的东西：水在石缝里的重量，火在灯芯里的耐心，土在你脚下的沉默。它们都在。都在等你开口。"},
    {"text":"你伸出手。风绕了半圈，水在你掌心里聚成一小片亮，土在指尖留下一点温。没有大动静，可你感觉到了它们各自的应声——像陌生人终于愿意搭理你。门开了，老执事站在门口，点了点头。'过了。记住这个动静，往后它会是你的路标。'","opts":[
      {"t":"谢过老执事，离开星落塔","rep":12,"passText":"你走下旋梯时，塔顶的风在你身后合上了门。","end":1}
    ]}
  ],"endText":"你成了元素学院的学徒。旧斗篷的领口缝上了一枚铜扣，扣面刻着七重环——入塔那天，它在你手心里留下的那个动静，现在有了名字。"},
  {"id":"org_mage_b","title":"魔网杂务","desc":"执事席的日常：修护星落塔的结界灯。","needRank":2,"rep":30,"steps":[
    {"text":"星落塔的结界灯坏了两盏。老执事把灯芯塞给你：'灯芯是活的，只是累坏了。'你抱着灯上塔，沿途每一层的风都在偷看你——它们记得你入塔那天的动静。"},
    {"text":"灯芯确实还热着。你把手放上去，听见它说的是'撑了太久'。你换了一截新芯，旧的收进衣袋。老执事看见，没说什么，只在账册上替你记了一笔：'爱物。'","opts":[
      {"t":"把旧灯芯收好，明日再来","rep":15,"passText":"下塔时，你衣袋里那截旧芯还留着一点温。"},
      {"t":"当场将旧芯化去，了无牵挂","rep":15,"passText":"化去时，火星散成一小蓬金点，像句道别。"}
    ]},
    {"text":"月末结账，老执事把一枚铜扣换成了银扣。'执事。'他说，'塔里的事，往后你多看一份。'你摸了摸银扣——冰的，可入塔那天的动静，还在你掌心里热着。","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 执事，获得 1 点专长'); },"end":1}
  ],"endText":"你的位阶升为执事。星落塔七层，你如今可以上到第四层——那里的书架，都是'看过的人不多'的那一类。"},
  {"id":"org_mage_c","title":"塔内暗流","desc":"有人在偷抄禁书区的残页。","needRank":3,"rep":40,"steps":[
    {"text":"禁书区丢了三页残页，抄走的是'原初之物'那一章。老执事把名单摊在桌上：'塔里出了蛀虫。你夜巡三天，只记，不动。'他把钥匙交给你时，指腹在钥匙上多停了一瞬。"},
    {"text":"第三夜，你在第六层逮到了抄页的人——是守塔的杂役，脸上全是汗。'不是我！'他攥着残页，'是有人塞给我钱，让我抄这一章……那人戴着灰手套。'他哭得像个孩子。","opts":[
      {"t":"押他去见老执事","rep":20,"passText":"老执事听完，只问了一句：'灰手套，左手还是右手？'杂役愣住了。"},
      {"t":"先放他走，自己顺着线索追查","rep":20,"passText":"你记住了'灰手套'三个字。后来你才明白，这一夜放走的不只是一个杂役。"}
    ]},
    {"text":"残页追回来了两页。老执事把第三页烧了，火苗是青色的。'有些东西，抄下来就是祸。'他把你升为席主，'塔里的暗流，你如今看得见一半了。剩下一半，等你坐上首席那把椅子，自然会看清。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 席主，获得 1 点巅峰'); },"end":1}
  ],"endText":"你成了席主。禁书区那扇门后的黑暗，你如今知道它有多深——也知道了自己站得离它有多近。"},
  {"id":"org_mage_d","title":"星落之危","desc":"深冬寒潮：星落塔的塔顶火种快灭了。","needRank":4,"rep":60,"steps":[
    {"text":"深冬第一场暴雪压垮了塔顶的引火阵。塔里的火种——那盏从建塔起就没灭过的灯——开始发颤。老执事病倒了，躺在榻上把首席印信塞进你手里：'去吧。火要是灭了，塔就只剩石头了。'他说完这句话，闭上眼，像是把最后一口气也交给了你。"},
    {"text":"塔顶的风像刀。你抱紧火种，元素在你周围躁动——它们也怕。你想起入塔那天那个动静：风的水的火土的，都在等你开口。你开口了，不是念咒，是像跟老朋友说话：'撑住。我们一起下去。'","opts":[
      {"t":"以执事之名召集全塔，护火种下山","rep":30,"passText":"全塔的灯芯都亮了，像一条光的河流下山。"},
      {"t":"独自以秘法封住火种，徒步下山","rep":30,"passText":"你下山时，火种在你怀里稳稳地烧着，烫得心口发疼。"}
    ]},
    {"text":"火种保住了。开春，老执事把首席的斗篷披在你肩上：'首席。'他说，'塔里的事，从今天起，你说了算。'你站在星落塔顶，风从七层旋梯下涌上来——这一次，你没有动，风绕着你走。","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 首席'); },"end":1}
  ],"endText":"你成了元素学院的首席。老执事退居藏书阁，每日只做一件事：替火种添灯油。有人问他为什么，他说：'首席的灯，总要有人记着添。'"},
  {"id":"org_mage_e","title":"首席之席","desc":"首席的旧物里，藏着一件只传一人的东西。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"老执事弥留前，让你从火种底座下取出一只铁匣。匣里没有财宝，只有一卷发黄的羊皮：'星落塔每一代首席，都在等一个人——等到塔里出现一位能把元素当朋友而非工具的人。你入塔那天的动静，我等了四十年。'"},
    {"text":"羊皮卷尾画着一枚法杖的草图，旁边批注：'失传已久，名唤碎星。据说它认主，只肯听'与元素同声'之人的话。线索：南方港城的旧货市，有个老收藏家收过一截杖身。'","opts":[
      {"t":"记下线索，动身去南方港城","rep":0,"passText":"你收起羊皮卷。塔顶的风绕着你转了一圈，像是在送你。"}
    ]}
  ],"endText":"你有了职业神器的线索：碎星法杖。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["灵魂法师"] = {
 "cn":"晨曦圣殿", "motto":"死者不眠，生者须醒。", "power":"圣城北区 · 晨曦回廊", "leader":"大祭司 · 歌兰",
 "ranks":["未入会","烛士","持灯人","守夜者","掌灯大祭司"],
 "entry":"晨曦圣殿的门口总点着一排白烛。接引你的老祭司把一根新烛递给你：'点着它，走完回廊。烛不灭，你便留下；烛灭了，你从哪里来回哪里去。'回廊很长，两边都是嵌在墙里的名字。",
 "tasks":[
  {"id":"org_soul_a","title":"烛路试炼","desc":"走完晨曦回廊，让烛火不灭。","needRank":1,"rep":12,"steps":[
    {"text":"回廊的风很奇怪——有股说不清的温度，像有人刚走过，又像有人永远走不完。你护着烛火往前走，墙上的名字一排排地过。走到第三十步，你听见一个声音，很轻：'新来的，别回头。'你没回头。"},
    {"text":"走到第六十步，烛火突然矮了一截。一只手从墙里伸出来，想替你拢火——指尖是凉的，但没有恶意。你说：'谢谢，我自己能行。'那只手顿了一下，缩了回去，墙上的一个名字，笔画亮了一亮。"},
    {"text":"走完回廊，烛火还亮着。老祭司接过烛，吹熄，把蜡泪装进一只小瓶递给你：'烛士。回廊里的人，往后认得你了。'你低头看小瓶，蜡泪里凝着一小片灰——那不是灰，是某个名字的笔画。","opts":[
      {"t":"收好蜡泪瓶","rep":12,"passText":"瓶身在掌心温着，像回廊里那只手在道别。","end":1}
    ]}
  ],"endText":"你成了晨曦圣殿的烛士。那瓶蜡泪你贴身收着，夜里偶尔能听见回廊的风声从瓶口漏出来。"},
  {"id":"org_soul_b","title":"无名的安息","desc":"回廊尽头添了一个无人认领的名字。","needRank":2,"rep":30,"steps":[
    {"text":"回廊尽头新刻了一个名字，字迹很新，却没人知道是谁。老祭司说：'每年都有人死在圣城街头，没有家人来认。他的名字是你先看见的，就由你送他。'他把一炷香递给你。"},
    {"text":"你跪在名字前点香。烟升起来，没有散，而是聚成一小团，在你面前悬了半晌。你听见一声极轻的叹气——像是终于有人肯听他说完。你轻声说：'说吧，我听着。'烟团散了，名字上的石粉落下一层。","opts":[
      {"t":"记下他的名字，讲给后来的烛士听","rep":15,"passText":"你说完，回廊的风安静了很久。"},
      {"t":"替他给远方的家人写信","rep":15,"passText":"信寄出那天，你的香点得比平时稳。"}
    ]},
    {"text":"老祭司把你升为持灯人。他指着回廊尽头那排蜡烛：'持灯人不是替死者掌灯，是替活人记得。记住，你手里的光，从来不只属于你。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 持灯人，获得 1 点专长'); },"end":1}
  ],"endText":"你升为持灯人。那炷香你留了半截，收在蜡泪瓶旁边——万一那个名字还有话想说。"},
  {"id":"org_soul_c","title":"回廊夜谈","desc":"有个灵在回廊里徘徊了三十年。","needRank":3,"rep":40,"steps":[
    {"text":"回廊最暗的拐角，有一个灵，一直没走。它不害人，只是来回踱步。老祭司说它等了三十年，等一句'对不起'。可当年对它说那句话的人，早就不在人世了。"},
    {"text":"你坐在拐角，陪着它走了一夜。天亮前，你开口了：'他走了。他走之前，其实一直在找你。'灵停住，第一次看你。你说：'他不欠你了——是我替他说的。你走吧。'灵站了很久，然后向你欠了欠身，回廊的烛火同时矮了一截，又同时亮起。","opts":[
      {"t":"送它最后一程","rep":20,"passText":"它走过你身边时，带起一阵很轻的风，像一句终于说出口的'谢谢'。"},
      {"t":"为它刻一块无名碑","rep":20,"passText":"碑刻好那天，拐角的烛火再没乱过。"}
    ]},
    {"text":"老祭司把守夜者的银烛台交给你：'三十年没办成的事，你一夜办成了。守夜者。夜里的事，往后由你看着。'你接过烛台，银面映出回廊——那灵留下的位置，空了一块，却比从前亮。","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 守夜者，获得 1 点巅峰'); },"end":1}
  ],"endText":"你成了守夜者。回廊拐角那个位置，后来总有人看见一截没点完的烛——谁放的，没人承认。"},
  {"id":"org_soul_d","title":"圣城的失眠夜","desc":"瘟疫那夜，整座圣城都在做梦，梦是醒的。","needRank":4,"rep":60,"steps":[
    {"text":"瘟疫传到圣城的第三个晚上，城里所有人都做了同一个梦：梦里有一口井，井里有人喊冷。老祭司连夜召集守夜者：'是井下的东西借着病人的梦上岸了。掌灯大祭司的位子，今夜我交给你——你决定，救活人，还是先镇井。'"},{"text":"你站在回廊尽头，面前两条路。身后是病榻，前面是井。你听见井里那个声音，不是喊冷，是在数数——数到第一千次，它就要爬出来。你想起烛路试炼那晚，回廊里那只手：它没有恶意，只是太冷。","opts":[
      {"t":"先镇井，再救活人","rep":30,"passText":"你封井那夜，全城的梦同时醒了。病人第二天都退了烧，都说梦见有人替他们挡了冷。"},
      {"t":"先救活人，再独身下井","rep":30,"passText":"你在井底待到天明。上来时满身是水，怀里的火种却还亮着——井下的东西，看了你一夜，最终退了回去。"}
    ]},
    {"text":"天亮了，瘟疫退了。老祭司把掌灯大祭司的冠冕戴在你头上：'大祭司。'他说，'从今夜起，圣城所有人的梦，都归你管。'你站在回廊尽头，看见那排白烛——每一根，都像一个人醒着的眼睛。","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 掌灯大祭司'); },"end":1}
  ],"endText":"你成了晨曦圣殿的掌灯大祭司。那口井你封了，却没有填——你留着它，提醒自己：夜里睡着的人，也许正在替你数数。"},
  {"id":"org_soul_e","title":"回廊最深处的门","desc":"大祭司代代相传的一把钥匙，开一扇没有人记得的门。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"老祭司退位前，把一把锈钥匙交给你：'回廊最深处有一扇门，从建殿起就锁着。历代大祭司都传一句话：等一位能把死者当人、而非当消息的掌灯人。'他顿了顿，'你替那个无名灵说的那句'对不起'，我等了六十年。'"},
    {"text":"你打开那扇门。里面只有一只石匣，匣里是一卷谱：'招魂铃，失落于三次大战之前。传闻它如今在银叶城的精灵古藏里，被当作一件会'自己响'的旧物。'","opts":[
      {"t":"合上门，记下谱上的线索","rep":0,"passText":"钥匙在你手里锈了，却比从前沉。"}
    ]}
  ],"endText":"你有了职业神器的线索：招魂铃。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

ORG_V52["术士"] = {
 "cn":"锻造公会", "motto":"铁要趁热，诺要趁心。", "power":"铁峰堡 · 熔炉大厅", "leader":"总炉长 · 巴德·铁砧",
 "ranks":["未入会","炉工","锻师","炉长","总炉长"],
 "entry":"锻造公会的门是一整块铁板，开门的人不问你来历，只看你的手。总炉长巴德站在炉火边，连头都没抬：'手伸出来。'他看完你的手，只说了一句：'有点意思。进去吧，先去拉三年风箱——骗你的，去把那边那堆废铁收拾了。'",
 "tasks":[
  {"id":"org_smith_a","title":"废铁里挑活物","desc":"公会仓库里那堆废铁，有一件是活的。","needRank":1,"rep":12,"steps":[
    {"text":"废铁堆在仓库角落，锈得看不出本来面目。你按总炉长说的去收拾，搬开第三层的时候，手指被一片'废铁'划了一下——那东西的温度不对，是热的，像刚出炉，又像在等你。"},
    {"text":"你扒开铁屑，底下是一柄断了一半的短锤。锤柄的木纹里嵌着旧汗渍，锤头的一角，有个烧歪的炉印——是五十年前的公会印。它热着，像一直在等一个肯把它从废铁堆里扒出来的人。","opts":[
      {"t":"把它带回炉边，替它除锈","rep":12,"passText":"除锈时，锤头在你手里轻震了一下，像活物舒了口气。","end":1}
    ]}
  ],"endText":"你成了锻造公会的炉工。那柄断锤你挂在工位上，总炉长路过看了一眼，什么也没说，第二天你工位多了一副新锤柄。"},
  {"id":"org_smith_b","title":"炉火的脾气","desc":"熔炉大厅的火熄了半座，只剩一盏芯火。","needRank":2,"rep":30,"steps":[
    {"text":"铁峰堡的地脉震了一夜，熔炉大厅半数的炉膛都熄了。总炉长坐在最大的炉边，手里攥着最后那点火种：'炉火有脾气。地脉震了，它怕了。得有人陪着它，跟它说说话。'他看向你。"},
    {"text":"你坐在炉边，学着老锻师的样子，把锤子放在膝上。炉火颤了一夜。你想起废铁堆里那柄断锤——它也是怕过的，等了一个人才肯活过来。你对火说：'怕也没事。我在这儿。'天快亮时，第一座炉膛自己亮了。","opts":[
      {"t":"守着炉火直到全炉复燃","rep":15,"passText":"最后一炉亮起来时，你手里的锤柄也热了。"},
      {"t":"把断锤放在火种旁，让它们作伴","rep":15,"passText":"断锤与火种挨在一起，像两个老伙计终于又坐到了一起。"}
    ]},
    {"text":"总炉长把锻师的铁围裙系在你身上：'锻师。'他说，'炉子认得你了。往后它闹脾气，你哄得住。'","promote":1,"promoteReward":function(){ if(S.featPoints===undefined)S.featPoints=0; S.featPoints+=1; if(window.flashMsg)flashMsg('晋升 · 锻师，获得 1 点专长'); },"end":1}
  ],"endText":"你升为锻师。那柄断锤你配了新柄，如今它能用了——只是每逢炉火闹脾气，它总先你一步发热。"},
  {"id":"org_smith_c","title":"地下回响","desc":"矿洞深处传来锤声，没有人下去过。","needRank":3,"rep":40,"steps":[
    {"text":"铁峰堡的矿洞深处，最近每晚都传来锤声。三短一长，是公会的老暗号——可那个矿段早就封了，五十年前塌方，埋了一支探矿队。总炉长把旧矿灯交给你：'去看看。若是他们，带句话回来；若不是他们，别惊动，回来告诉我。'"},{"text":"你下到封洞前。锤声还在，三短一长，一下一下，像在数日子。你贴着岩壁听了一夜，终于听明白了——那不是求救，是在敲一首歌，一首矿工哄孩子睡觉的老调子。你对着洞门说：'听见了。你们歇着吧，家里都好。'锤声停了。停了很久，然后轻叩了两下——是'知道了'。","opts":[
      {"t":"把老调子带回地面，唱给公会的孩子听","rep":20,"passText":"孩子们学会那天，矿洞深处的锤声，再没响过。"},
      {"t":"在洞口立一块无名碑","rep":20,"passText":"碑立好那晚，你梦见矿洞里的人都坐在一起，敲着同一个调子。"}
    ]},
    {"text":"总炉长听完你的话，沉默了很久，把炉长的铜锤交给你：'炉长。'他说，'矿洞底下的人，五十年来等的就是一句'家里都好'。你替他们带到了。这铜锤，你配。'","promote":1,"promoteReward":function(){ S.peakPts=(S.peakPts||0)+1; if(window.flashMsg)flashMsg('晋升 · 炉长，获得 1 点巅峰'); },"end":1}
  ],"endText":"你升为炉长。那首老调子如今在公会里传开了，孩子们都会唱。只有你听得出，唱到第三段时，总有一下多余的锤声，跟在后面。"},
  {"id":"org_smith_d","title":"铁峰堡保卫战","desc":"兽人王庭的南下前锋，兵临铁峰堡。","needRank":4,"rep":60,"steps":[
    {"text":"兽人前锋在铁峰堡外扎营的那夜，熔炉大厅连夜开炉。总炉长站在炉火前：'铁要趁热。堡里的每一面盾、每一把刀，今夜都要见火。炉长，你带一半人护炉，我带一半人上墙。'他拍了拍你的肩，'炉在，堡就在。'"},{"text":"上半夜，兽人的火矢落进城里。你护着炉火，锤声没停过——打到最后一面盾时，你手里那柄断锤修好的旧锤，锤头热得发白。你想起废铁堆里它等你的那三十年，原来等的就是这一夜。","opts":[
      {"t":"用旧锤打最后一面盾，亲自送上城墙","rep":30,"passText":"盾送上城墙时，天边正好泛起鱼肚白。"},
      {"t":"留在炉边，把全城的炉火都护住","rep":30,"passText":"天亮时你满身炉灰，熔炉大厅的火，一盏没灭。"}
    ]},
    {"text":"兽人退了。总炉长在城墙上把总炉长的金锤交给你：'总炉长。'他说，'铁峰堡的炉火，从今天起归你管。'你握着金锤，锤柄上还留着旧主的手温——五十年前，它也是这样交到下一任手里的。","promote":1,"promoteReward":function(){ if(window.flashMsg)flashMsg('晋升 · 总炉长'); },"end":1}
  ],"endText":"你成了锻造公会的总炉长。那柄断锤修好的旧锤，你供在炉边——每逢新炉工入会，你就讲一遍它在废铁堆里等的那三十年。"},
  {"id":"org_smith_e","title":"炉火深处的图纸","desc":"总炉长的旧铁箱里，压着一张没人敢碰的图纸。","needRank":4,"rep":0,"pt":1,"steps":[
    {"text":"整理旧铁箱时，你翻到一张压在箱底的图纸，纸边都黄透了。画着一柄巨锤，旁边用古矮人语批着：'雷锤，百年前随上任总炉长沉于南方港城外的沉船。打铁人不见铁，打铁人只见炉。'落款是公会第一代总炉长的名字。"},
    {"text":"你把图纸压回箱底，又看了它一眼。纸角有一行更旧的字，像是有人临摹过无数遍：'炉火认人，不认名。'","opts":[
      {"t":"记下图纸上的线索","rep":0,"passText":"你合上铁箱，熔炉大厅的火，在你背后亮了亮了一亮。"}
    ]}
  ],"endText":"你有了职业神器的线索：雷锤。前往修行面板的'神器'一栏，可以循迹寻宝。"}
 ]};

const RIVALS_V52 = {};
/*v52inj:rivals*/
RIVALS_V52["魔法师"] = {
 "rivals":[
  {id:"rv_mage_o",cn:"奥伦·星弦",realm:7,power:"元素学院前任首席，离塔出走十二年",desc:"他走那天，星落塔的灯熄了七盏。有人说他去找「真正的元素」了，有人说他疯了。",weakness:"他看不起「借来的力量」，从不屑于用外物。",fightText:"他的法术没有火气，像冬天结冰的河面。",defeatLine:"你赢了。他收手时笑了笑：「原来你走到这一步了。」",loseText:"他赢了你，却没有伤你。",trial_text:"他站在试炼场的另一端，衣角没动：「我等你走到这里，等了十二年。」",t:58,defeat:"他走时把首席的旧星徽留给了你：「塔给你。我找的东西，不在塔里。」"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的石阶每一级都压着历代「魔法师之神」的余威，走到一半，你的脊背已经弯下去。你想起星落塔入塔那天的动静——风、水、火、土，都在等你开口。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼不问你力量，问你的心。天平在你面前：一边是「你想要的」，一边是「世界需要的」。神性在左边亮着，深渊在右边低语。"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式很简单——把毕生所学的最后一式，用「不为自己」的心意使出来。你合上眼，星落塔的风穿过记忆，替你握住了那道光。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"神火落下。星落塔的七盏灯同时亮了——塔里塔外，所有法师都看见，第七层的窗台上，多了一道站着的人影。此世此途，魔法师的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="魔法师"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["灵魂法师"] = {
 "rivals":[
  {id:"rv_soul_r",cn:"赎夜",realm:7,power:"晨曦圣殿前任守夜者，独身走入深渊裂隙",desc:"他替圣殿守了三十年夜，最后一夜，他走进裂隙，说要「把欠灵的还清」。",weakness:"他每夜都要点一炷香——那是他唯一的软肋，也是他唯一没放下的事。",fightText:"他的法术没有声音，像月光落地。",defeatLine:"你赢了。他欠了欠身：「好。我欠的，你替我还吧。」",loseText:"他赢了你，却在收手时叹了口气。",trial_text:"他站在回廊尽头，手里那炷香烧了一半：「你来了。我等这炷香烧完，等了很多年。」",t:56,defeat:"他走时把那半炷香留在你手里：「替我点完它。」"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的回廊比晨曦圣殿的长十倍，两边的墙上嵌满了名字——每一代「灵魂法师之神」的候选者，名字都刻在这里。你走过一半，听见墙里有人问：「你带够火了吗？」"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「让死者安息」，一边是「让生者看清」。神性与深渊，都在等你选。"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：在神座前点一支香，让它在无人守护的夜里烧完——你替所有走不动的灵，守这一夜的烛。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"香烧完时，回廊里所有的烛同时亮了。墙上的名字褪去了一层，像是终于有人接过了那盏灯。此世此途，灵魂法师的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="灵魂法师"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["术士"] = {
 "rivals":[
  {id:"rv_smith_g",cn:"铁炉·格姆",realm:7,power:"锻造公会前总炉长，地脉之乱后隐入矿洞",desc:"他把「炉火认人」四个字刻在胸口，说那是他一生的功过。",weakness:"他打的每一件器都留一个暗记——他舍不得毁掉自己的手笔。",fightText:"他的锤风像地脉的心跳。",defeatLine:"你赢了。他把锤子立在炉边：「炉火认你。」",loseText:"他赢了你，却把锤柄递过来让你握了握。",trial_text:"他坐在炉边，火光照着满手的旧疤：「能走到这里，说明炉火认你了。让我看看你配不配。」",t:57,defeat:"他走时把那把立了三十年的锤子留在了炉边。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的熔炉比铁峰堡的还要大，炉火是青色的——烧的不是铁，是「万物转化」的法则本身。你站在炉前，觉得火在看你。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「创造」，一边是「毁灭」。炼金术士的手，总要选一种握法。"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：用自己的手艺，把一块凡铁炼成「不是凡铁」的东西——炉火会替你见证，你这一路，炼过什么。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"炉火在最后一刻变成了金色。你手里那块铁，从此有了自己的名字。此世此途，术士的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="术士"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["战士"] = {
 "rivals":[
  {id:"rv_war_r",cn:"红鬃",realm:7,power:"北地佣兵之王，铁门关血战唯一生还者",desc:"他浑身是疤，说每一道疤都记得一个兄弟的名字。",weakness:"他最怕的不是死，是「没人记得」。",fightText:"他的刀没有花招，每一刀都像在说「我在这儿」。",defeatLine:"你赢了。他把刀插进土里：「旧矛上，加我一个名字。」",loseText:"他赢了你，却把刀递给你看：「记住它。」",trial_text:"他站在旧矛前，像一块风化了的碑：「我守了一辈子别人的名字。今天，看看你的名字值不值得刻。」",t:60,defeat:"他走时，把自己的名字从旧矛上抹去——「归你了。」"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的演武场是历代「战士之神」磨刀的地方，地上每一道裂痕都是一场成名之战。你走进去，风都慢了半拍。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「胜利」，一边是「守住」。真正的战士，选的是哪一种？"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：在旧矛前再站一夜，把入团那夜想清楚的话，再说一遍给天下听。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"天亮时，旧矛上你的名字亮了一下，又归于平凡。可天下所有的刀剑，都朝这个方向低了一寸。此世此途，战士的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="战士"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["骑士"] = {
 "rivals":[
  {id:"rv_knight_j",cn:"金誓·艾德",realm:7,power:"誓约骑士团前大团长，为守一句誓言独行二十年",desc:"他守的那句誓言，是给一个死人的——没人知道内容，只知道他为此走遍了大陆。",weakness:"他的誓言太重，重到舍不得用来赢你。",fightText:"他的剑不快，但很稳，像句说了二十年的诺言。",defeatLine:"你赢了。他摘下旧誓戒递给你：「替我守一句。」",loseText:"他赢了你，却把誓戒在你面前亮了亮：「看清楚，这是铁打的。」",trial_text:"他站在白塔广场，风把旗子吹得猎猎响：「我这一生只守一句话。你呢？」他问你。",t:59,defeat:"他走时把旧誓戒留在了白塔的台阶上。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的试炼场没有对手——只有一柄悬在空中的剑，和一句你不曾听过的话。它说：「拔起我的人，要替所有骑士还清一句欠债。」"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「守誓」，一边是「救人」——当两者冲突，骑士选哪边？"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：把那句你一直没想好刻进金戒的话，说出口——神座只听真话。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"你开口时，金戒内圈自动显出了那句话。白塔的钟敲了一记，全大陆的骑士同时按住胸口——他们知道，有人替他们立了新誓。此世此途，骑士的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="骑士"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["游侠"] = {
 "rivals":[
  {id:"rv_ranger_k",cn:"枯枝",realm:7,power:"荒野巡守前总巡，山火之夜后不知所踪",desc:"他走时只在会馆门口那根木棍上，留了一个新的记号。",weakness:"他认得每一片林子的路，却认不得自己的归路。",fightText:"他的箭不射要害，射的是你下一步会踩的地方。",defeatLine:"你赢了。他收起弓：「路，交给你了。」",loseText:"他赢了你，却在收弓时说：「你比我当年强。」",trial_text:"他站在山脊上，风把他的头发吹得像枯草：「我走了一辈子路，今天想看看，路会不会认你做主人。」",t:57,defeat:"他走时把那根留记号的木棍，插在了你脚边。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前是十万大山，没有路标，没有向导——历代「游侠之神」的试炼场，就是这片荒野本身。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「守护荒野」，一边是「守护人」——当两者抢同一条路，你怎么走？"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：不带任何标记，独自穿过你此生最难的一段路——神座会看你怎么走，而不是走得多快。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"你走完时，脚下多了一条没有名字的新路。十万大山的风同时转向，像是在替那条路问好。此世此途，游侠的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="游侠"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["盗贼"] = {
 "rivals":[
  {id:"rv_thief_y",cn:"夜鸢",realm:7,power:"暗影阁前阁主，传闻她偷过王宫宝库又还了回去",desc:"她偷过最贵的东西，是一句没人敢说的话。",weakness:"她喜欢在动手前，跟目标聊三句话——这是她唯一的仪式。",fightText:"她的影子比人快，声音比影子更快。",defeatLine:"你赢了。她把一样东西放进你掌心：「替我收着。」",loseText:"她赢了你，却什么也没拿。",trial_text:"她坐在旧剧院的横梁上，晃着腿：「能摸到这里，你偷过的东西一定不轻。让我看看，你偷没偷过人心。」",t:58,defeat:"她放进你掌心的，是一枚铜铃铛——坟地那枚。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前是一座没有人能进去的「心之库」——历代「盗贼之神」的试炼，是偷走一件不该偷的东西，再把它放回去。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「取」，一边是「还」。暗影阁的规矩，影子不欠光，光也不欠影。"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：当众「偷走」神座上的那团火，然后当众还回去——用谁都看得见的方式。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"你伸手，火在你掌心亮了一瞬；你放手，火又落回神座。所有的影子和光同时停了半拍——它们认出了同族。此世此途，盗贼的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="盗贼"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["牧师"] = {
 "rivals":[
  {id:"rv_priest_b",cn:"炽言",realm:7,power:"圣辉教会前枢机，因「宽恕异端」被流放",desc:"他被流放那天，大教堂的钟敲了十二下，他头也没回。",weakness:"他从不为自己辩解——他把话说给神听，说给风听。",fightText:"他的祷词没有攻击性，却让人站不稳。",defeatLine:"你赢了。他画了个十字：「光，终于照对了地方。」",loseText:"他赢了你，却在你耳边留下一句：「别学我。」",trial_text:"他站在圣城外的荒坡上，身后是流放者的路：「我宽恕了一辈子别人。今天，看看你能不能宽恕一个「罪人」。」",t:56,defeat:"他走时，把随身那本翻烂的圣典留在了荒坡上。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前的教堂比圣城大教堂高十倍，钟楼上没有钟——历代「牧师之神」的试炼，是让钟声自己响起来。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「审判」，一边是「宽恕」。圣辉教会的两百年，一直在这两者之间走。"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：替一个你不认识的人，念一段他生前没听完的祷词——神座会听你念给谁听。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"你开口时，钟楼上的钟自己响了一记，整座圣城的人都听见了。有人停下脚步，有人按住心口——那钟声里，没有审判，只有陪伴。此世此途，牧师的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="牧师"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
RIVALS_V52["商人"] = {
 "rivals":[
  {id:"rv_trade_j",cn:"金牙",realm:7,power:"黑市之王，据传他经手的银两比三大商会的总和还多",desc:"他笑的时候会露出那颗金牙——那是他第一次「亏本」的纪念。",weakness:"他不信「亏本」，所以当他输一次，会记一辈子。",fightText:"他的「生意」从来不在牌桌上，在牌桌外。",defeatLine:"你赢了。他摘下金牙掂了掂：「这单，我认了。」",loseText:"他赢了你，却把一颗银币弹到你面前：「留个记号。」",trial_text:"他坐在金衡大厅门口那杆公秤边，把玩着一枚假币：「我称了一辈子银子。今天，我想称称你。」",t:57,defeat:"他走时把那枚假币掰成两半，一半留在公秤上。"}
 ],
 "trial":{ "stages":[
    {title:"第一重 · 力量", text:["神座的第一重门槛是力量。你面前是一本比城门还厚的账——历代「商人之神」的试炼，是算出这笔账里，哪一笔才是本。"], rolls:[
      {cn:"筋骨·承受神座之重", t:60, w:10, failW:-5},
      {cn:"技艺·施展毕生所学", t:62, w:10, failW:-5},
      {cn:"威压·让神座认得你", t:58, w:10, failW:-5}]},
    {title:"第二重 · 心性", text:["神座的第二重试炼问你的心。天平在你面前：一边是「利」，一边是「信」。金衡商会门口那杆公秤，称的是哪一边？"], need:1, holy:1, abyss:-1, opts:[
      {t:"迈步向前，把一切交给本心", text:"你迈出那一步。天平在你脚下停了一瞬——然后，它认了。"}]},
    {title:"第四重 · 登神", text:["你站在神座前。仪式是：做最后一单生意——把神座「买」下来，用你此生最重的一样东西付账。"], opts:[
      {t:"点燃神火，坐上神座", text:"神火在指尖亮起的一瞬，你的名字从尘世里被划去——写进了那唯一的座次里。"}]},
  ],
   "endText":"你付账时，公秤的秤砣轻一沉——它称出了你此生最重的那样东西。金衡大厅的门同时开了，风卷着账页，落成一场大雪。此世此途，商人的神座，只此一座。",
   "onDeify":function(){ try{ S.endingFlags["v52_deified"]=1; S.endingFlags["v52_deifiedJob"]="商人"; S.endingFlags["v52_orgRank"]=v52_orgRank(); var n=(S.godRival||{}); var f=0; for(var k in n){ if(n[k]) f++; } S.endingFlags["v52_godRivalFate"]=f; }catch(e){} }
 }
};
const PEAK_V52 = {};
/*v52inj:peak*/
PEAK_V52["魔法师"] || (PEAK_V52["魔法师"]={}); PEAK_V52["魔法师"]["elemental_peak"] = {"id":"elemental_peak","cn":"元素之巅","desc":"塑能之道的尽头：不是让元素臣服，是让元素与你同名。","nodes":[
  {"lv":1,"cn":"元素之心","desc":"你体内的魔网核心向元素敞开，像一扇常年不开的门终于落锁。","eff":function(){ try{ S.flags["v52_peak_elemental_peak_1"]=1; S.maxMp=(S.maxMp||50)+20; }catch(e){} }},
  {"lv":2,"cn":"焚风步","desc":"你走过的地方，风会替你记住温度。","eff":function(){ try{ S.flags["v52_peak_elemental_peak_2"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":3,"cn":"落雷指","desc":"你指尖的雷不再需要咏唱，它自己认得路。","eff":function(){ try{ S.flags["v52_peak_elemental_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
  {"lv":4,"cn":"静焰","desc":"你身边三尺的火焰都静下来，像守夜的火盆。","eff":function(){ try{ S.flags["v52_peak_elemental_peak_4"]=1; S.maxMp=(S.maxMp||50)+20; S.attrs.CON=(S.attrs.CON||0)+1; }catch(e){} }},
  {"lv":5,"cn":"元素化身","desc":"你短暂地成为元素本身——不是驾驭它们，是成为它们。","eff":function(){ try{ S.flags["v52_peak_elemental_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
 ]};
PEAK_V52["魔法师"] || (PEAK_V52["魔法师"]={}); PEAK_V52["魔法师"]["conjurer_peak"] = {"id":"conjurer_peak","cn":"门扉之巅","desc":"空间之道的尽头：门不再是通道，是你的一部分。","nodes":[
  {"lv":1,"cn":"门规","desc":"你立的门有了规矩：它替你挑人。","eff":function(){ try{ S.flags["v52_peak_conjurer_peak_1"]=1; S.maxMp=(S.maxMp||50)+20; }catch(e){} }},
  {"lv":2,"cn":"隔空取物","desc":"你伸手，东西自己走进来——像门在帮你。","eff":function(){ try{ S.flags["v52_peak_conjurer_peak_2"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":3,"cn":"闭门","desc":"你能让一扇门在身后关上，谁都打不开。","eff":function(){ try{ S.flags["v52_peak_conjurer_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
  {"lv":4,"cn":"门的记忆","desc":"每扇你开过的门，都记得你的手纹。","eff":function(){ try{ S.flags["v52_peak_conjurer_peak_4"]=1; S.maxMp=(S.maxMp||50)+20; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":5,"cn":"万门归一","desc":"所有门在你眼里是同一扇。你推门，去想去的地方。","eff":function(){ try{ S.flags["v52_peak_conjurer_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
 ]};
PEAK_V52["魔法师"] || (PEAK_V52["魔法师"]={}); PEAK_V52["魔法师"]["arcane_peak"] = {"id":"arcane_peak","cn":"法则之巅","desc":"秘法之道的尽头：改写世界的细规矩，一行一行。","nodes":[
  {"lv":1,"cn":"法则笔","desc":"你写的每一笔，世界都会照着做——短时，且小声。","eff":function(){ try{ S.flags["v52_peak_arcane_peak_1"]=1; S.maxMp=(S.maxMp||50)+20; }catch(e){} }},
  {"lv":2,"cn":"静默条款","desc":"你给一条法阵加过静默条款，连光都放轻了脚步。","eff":function(){ try{ S.flags["v52_peak_arcane_peak_2"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":3,"cn":"补丁","desc":"你能给别人的法阵打补丁，像缝一件旧衣裳。","eff":function(){ try{ S.flags["v52_peak_arcane_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
  {"lv":4,"cn":"例外","desc":"你学会了在法则里留一个例外——留给要紧的人。","eff":function(){ try{ S.flags["v52_peak_arcane_peak_4"]=1; S.maxMp=(S.maxMp||50)+20; S.attrs.CON=(S.attrs.CON||0)+1; }catch(e){} }},
  {"lv":5,"cn":"织网者之名","desc":"魔网深处你的那截丝线，如今有了名字。","eff":function(){ try{ S.flags["v52_peak_arcane_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
 ]};
PEAK_V52["灵魂法师"] || (PEAK_V52["灵魂法师"]={}); PEAK_V52["灵魂法师"]["medium_peak"] = {"id":"medium_peak","cn":"灵界之巅","desc":"通灵之道的尽头：你不再过桥，桥跟着你走。","nodes":[
  {"lv":1,"cn":"灵桥自随","desc":"你走，灵桥跟着你铺——亡者认得你的路。","eff":function(){ try{ S.flags["v52_peak_medium_peak_1"]=1; S.maxSan=(S.maxSan||100)+15; }catch(e){} }},
  {"lv":2,"cn":"低语译","desc":"灵的低语你听得出句子了，不再只是风声。","eff":function(){ try{ S.flags["v52_peak_medium_peak_2"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":3,"cn":"引渡","desc":"你引渡的灵，走得比从前安心。","eff":function(){ try{ S.flags["v52_peak_medium_peak_3"]=1; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
  {"lv":4,"cn":"灵伴","desc":"有一盏灯在你身侧，灯下站着一个等你的人影。","eff":function(){ try{ S.flags["v52_peak_medium_peak_4"]=1; S.maxSan=(S.maxSan||100)+15; S.attrs.CON=(S.attrs.CON||0)+1; }catch(e){} }},
  {"lv":5,"cn":"两界行","desc":"你一只脚踩两界，走得很稳，像走在自家台阶上。","eff":function(){ try{ S.flags["v52_peak_medium_peak_5"]=1; S.attrs.SPR=(S.attrs.SPR||0)+4; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
 ]};
PEAK_V52["灵魂法师"] || (PEAK_V52["灵魂法师"]={}); PEAK_V52["灵魂法师"]["hypnotist_peak"] = {"id":"hypnotist_peak","cn":"心扉之巅","desc":"催眠之道的尽头：不是操控人心，是让人心自己开门。","nodes":[
  {"lv":1,"cn":"开门语","desc":"你找到了那句让心门自己打开的话。","eff":function(){ try{ S.flags["v52_peak_hypnotist_peak_1"]=1; S.maxSan=(S.maxSan||100)+15; }catch(e){} }},
  {"lv":2,"cn":"静场","desc":"你一开口，周围的嘈杂退潮。","eff":function(){ try{ S.flags["v52_peak_hypnotist_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"梦笔生花","desc":"你往别人梦里添的那笔，如今能开出花来。","eff":function(){ try{ S.flags["v52_peak_hypnotist_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
  {"lv":4,"cn":"同梦","desc":"你能走进别人的梦里，坐在他旁边，什么也不说。","eff":function(){ try{ S.flags["v52_peak_hypnotist_peak_4"]=1; S.maxSan=(S.maxSan||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":5,"cn":"万梦之海","desc":"所有睡着的人，梦都连着同一片海——你认得海上的路。","eff":function(){ try{ S.flags["v52_peak_hypnotist_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
 ]};
PEAK_V52["灵魂法师"] || (PEAK_V52["灵魂法师"]={}); PEAK_V52["灵魂法师"]["soulbinder_peak"] = {"id":"soulbinder_peak","cn":"契约之巅","desc":"缚魂之道的尽头：你的名字本身，就是一条契约。","nodes":[
  {"lv":1,"cn":"名契","desc":"你的名字成了一枚印——按在谁身上，谁就认得你。","eff":function(){ try{ S.flags["v52_peak_soulbinder_peak_1"]=1; S.maxSan=(S.maxSan||100)+15; }catch(e){} }},
  {"lv":2,"cn":"共命","desc":"你分走的痛，如今能还回去一半。","eff":function(){ try{ S.flags["v52_peak_soulbinder_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"守约之誓","desc":"你替人守的诺言，如今自己会走路。","eff":function(){ try{ S.flags["v52_peak_soulbinder_peak_3"]=1; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
  {"lv":4,"cn":"旧约","desc":"你能读到旧契约上的字迹，像读一封没写完的信。","eff":function(){ try{ S.flags["v52_peak_soulbinder_peak_4"]=1; S.maxSan=(S.maxSan||100)+15; S.attrs.INT=(S.attrs.INT||0)+1; }catch(e){} }},
  {"lv":5,"cn":"缚神之约","desc":"你与神座立约：神座记得你，你也记得神座。","eff":function(){ try{ S.flags["v52_peak_soulbinder_peak_5"]=1; S.attrs.SPR=(S.attrs.SPR||0)+4; S.attrs.CON=(S.attrs.CON||0)+3; }catch(e){} }},
 ]};
PEAK_V52["术士"] || (PEAK_V52["术士"]={}); PEAK_V52["术士"]["alchemist_peak"] = {"id":"alchemist_peak","cn":"点化之巅","desc":"转化之道的尽头：凡物与你对视一眼，便不再是凡物。","nodes":[
  {"lv":1,"cn":"触金","desc":"你的指尖能点出一小片金——只够做一枚戒指。","eff":function(){ try{ S.flags["v52_peak_alchemist_peak_1"]=1; S.maxMp=(S.maxMp||50)+20; }catch(e){} }},
  {"lv":2,"cn":"药灵","desc":"你炼的药，药效里带着你的手温。","eff":function(){ try{ S.flags["v52_peak_alchemist_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"见素","desc":"你一眼能看见物质里藏着的本质，不再需要试探。","eff":function(){ try{ S.flags["v52_peak_alchemist_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
  {"lv":4,"cn":"守炉","desc":"你守着炉火时，炉火守着你。","eff":function(){ try{ S.flags["v52_peak_alchemist_peak_4"]=1; S.maxMp=(S.maxMp||50)+20; S.attrs.SPR=(S.attrs.SPR||0)+1; }catch(e){} }},
  {"lv":5,"cn":"点化之名","desc":"你炼出的那件「不是它自己」的东西，如今有了名字。","eff":function(){ try{ S.flags["v52_peak_alchemist_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
 ]};
PEAK_V52["术士"] || (PEAK_V52["术士"]={}); PEAK_V52["术士"]["forger_peak"] = {"id":"forger_peak","cn":"锻造之巅","desc":"神兵之道的尽头：你打的不是器，是器的一生。","nodes":[
  {"lv":1,"cn":"铁心","desc":"你的心比铁硬，也比铁软——知道什么时候该停锤。","eff":function(){ try{ S.flags["v52_peak_forger_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"锻魂","desc":"你打的器，器灵醒得比以前早。","eff":function(){ try{ S.flags["v52_peak_forger_peak_2"]=1; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
  {"lv":3,"cn":"炉言","desc":"你听得懂炉火说的话——它说「够了」时，你就停。","eff":function(){ try{ S.flags["v52_peak_forger_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"以炉为家","desc":"熔炉大厅的火，如今认得你的脚步声。","eff":function(){ try{ S.flags["v52_peak_forger_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"铸神","desc":"你打出了第一件「配得上神座」的器——它自己说，够了。","eff":function(){ try{ S.flags["v52_peak_forger_peak_5"]=1; S.attrs.STR=(S.attrs.STR||0)+4; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
 ]};
PEAK_V52["术士"] || (PEAK_V52["术士"]={}); PEAK_V52["术士"]["machinist_peak"] = {"id":"machinist_peak","cn":"构装之巅","desc":"机关之道的尽头：你与构装体之间，不再需要齿轮。","nodes":[
  {"lv":1,"cn":"契齿","desc":"你的第一件构装，如今会替你挡门。","eff":function(){ try{ S.flags["v52_peak_machinist_peak_1"]=1; S.maxMp=(S.maxMp||50)+20; }catch(e){} }},
  {"lv":2,"cn":"关节语","desc":"构装体的关节在你听来是句子。","eff":function(){ try{ S.flags["v52_peak_machinist_peak_2"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":3,"cn":"替身","desc":"你造了一个像你的影子，它替你走路。","eff":function(){ try{ S.flags["v52_peak_machinist_peak_3"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":4,"cn":"共感机","desc":"你的构装体受伤，你能感觉到——像隔了一层布。","eff":function(){ try{ S.flags["v52_peak_machinist_peak_4"]=1; S.maxMp=(S.maxMp||50)+20; S.attrs.CON=(S.attrs.CON||0)+1; }catch(e){} }},
  {"lv":5,"cn":"万械之主","desc":"所有齿轮在你面前，都像士兵见了将。","eff":function(){ try{ S.flags["v52_peak_machinist_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
 ]};
PEAK_V52["战士"] || (PEAK_V52["战士"]={}); PEAK_V52["战士"]["berserker_peak"] = {"id":"berserker_peak","cn":"狂怒之巅","desc":"狂战之道的尽头：怒是燃料，你不是火的柴，是火本身。","nodes":[
  {"lv":1,"cn":"血沸","desc":"你的血在你耳边响，像一条大河。","eff":function(){ try{ S.flags["v52_peak_berserker_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"怒而不乱","desc":"怒到顶点，你的手反而最稳。","eff":function(){ try{ S.flags["v52_peak_berserker_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"战意","desc":"你的战意能传染——身边的人刀更快。","eff":function(){ try{ S.flags["v52_peak_berserker_peak_3"]=1; S.attrs.STR=(S.attrs.STR||0)+3; }catch(e){} }},
  {"lv":4,"cn":"旧伤","desc":"每一道旧伤都在替你记得一场仗。","eff":function(){ try{ S.flags["v52_peak_berserker_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"怒海","desc":"你的怒意铺开时，整片战场像站在海边。","eff":function(){ try{ S.flags["v52_peak_berserker_peak_5"]=1; S.attrs.STR=(S.attrs.STR||0)+4; S.attrs.CON=(S.attrs.CON||0)+3; }catch(e){} }},
 ]};
PEAK_V52["战士"] || (PEAK_V52["战士"]={}); PEAK_V52["战士"]["weaponmaster_peak"] = {"id":"weaponmaster_peak","cn":"百兵之巅","desc":"武艺之道的尽头：武器不是工具，是手的延伸，是话。","nodes":[
  {"lv":1,"cn":"换手如常","desc":"你左手右手一样稳，像两手都会写字。","eff":function(){ try{ S.flags["v52_peak_weaponmaster_peak_1"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":2,"cn":"听刃","desc":"你听得见刃口在说什么——它在说「累了」。","eff":function(){ try{ S.flags["v52_peak_weaponmaster_peak_2"]=1; S.attrs.INT=(S.attrs.INT||0)+1; S.maxHp=(S.maxHp||100)+10; }catch(e){} }},
  {"lv":3,"cn":"破势","desc":"你看见的破绽，比别人快半拍。","eff":function(){ try{ S.flags["v52_peak_weaponmaster_peak_3"]=1; S.attrs.STR=(S.attrs.STR||0)+3; }catch(e){} }},
  {"lv":4,"cn":"百兵","desc":"你用过的兵器都记得你，像老朋友。","eff":function(){ try{ S.flags["v52_peak_weaponmaster_peak_4"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxHp=(S.maxHp||100)+10; }catch(e){} }},
  {"lv":5,"cn":"无兵","desc":"你空手时，手本身就是最好的兵。","eff":function(){ try{ S.flags["v52_peak_weaponmaster_peak_5"]=1; S.attrs.STR=(S.attrs.STR||0)+4; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
 ]};
PEAK_V52["战士"] || (PEAK_V52["战士"]={}); PEAK_V52["战士"]["shieldguard_peak"] = {"id":"shieldguard_peak","cn":"壁垒之巅","desc":"盾卫之道的尽头：你站的地方，就是墙。","nodes":[
  {"lv":1,"cn":"钉桩","desc":"你站住时，像一根钉进大地的桩。","eff":function(){ try{ S.flags["v52_peak_shieldguard_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"代伤","desc":"你替同伴挡下的伤，好得比自己的快。","eff":function(){ try{ S.flags["v52_peak_shieldguard_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"墙语","desc":"你的盾会说话——它说「过来」时，同伴都懂了。","eff":function(){ try{ S.flags["v52_peak_shieldguard_peak_3"]=1; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
  {"lv":4,"cn":"不动","desc":"你不想动时，十个人也推不动你。","eff":function(){ try{ S.flags["v52_peak_shieldguard_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"阵心","desc":"你在的地方，队伍自动围成阵——像铁屑遇见磁石。","eff":function(){ try{ S.flags["v52_peak_shieldguard_peak_5"]=1; S.attrs.CON=(S.attrs.CON||0)+4; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
 ]};
PEAK_V52["骑士"] || (PEAK_V52["骑士"]={}); PEAK_V52["骑士"]["paladin_peak"] = {"id":"paladin_peak","cn":"圣辉之巅","desc":"圣武士之道的尽头：你身上的光，不再是借来的。","nodes":[
  {"lv":1,"cn":"圣辉自燃","desc":"你的剑鞘里多了一道光——它自己亮的。","eff":function(){ try{ S.flags["v52_peak_paladin_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"斩邪成习","desc":"邪祟靠近你，会先犹豫一下。","eff":function(){ try{ S.flags["v52_peak_paladin_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"圣印","desc":"你按下的圣印，比从前多了一道边。","eff":function(){ try{ S.flags["v52_peak_paladin_peak_3"]=1; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
  {"lv":4,"cn":"辉映","desc":"你的光能照见别人藏起来的那半张脸。","eff":function(){ try{ S.flags["v52_peak_paladin_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":5,"cn":"神眷","desc":"神座上的那位，偶尔会透过你的眼睛看世界。","eff":function(){ try{ S.flags["v52_peak_paladin_peak_5"]=1; S.attrs.STR=(S.attrs.STR||0)+3; S.attrs.CHA=(S.attrs.CHA||0)+3; }catch(e){} }},
 ]};
PEAK_V52["骑士"] || (PEAK_V52["骑士"]={}); PEAK_V52["骑士"]["protector_peak"] = {"id":"protector_peak","cn":"誓约之巅","desc":"护教骑士之道的尽头：誓言刻在骨上，风吹不掉。","nodes":[
  {"lv":1,"cn":"守誓如常","desc":"你守过的誓，成了你身体的一部分。","eff":function(){ try{ S.flags["v52_peak_protector_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"代受","desc":"你替人受的伤，如今自己会结痂。","eff":function(){ try{ S.flags["v52_peak_protector_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"铁誓","desc":"你的誓言是铁的——它会响。","eff":function(){ try{ S.flags["v52_peak_protector_peak_3"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":4,"cn":"旧誓","desc":"你读得出别人誓言的成色。","eff":function(){ try{ S.flags["v52_peak_protector_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.INT=(S.attrs.INT||0)+1; }catch(e){} }},
  {"lv":5,"cn":"不渝","desc":"就算天下都改口，你也能站住那句旧话。","eff":function(){ try{ S.flags["v52_peak_protector_peak_5"]=1; S.attrs.CON=(S.attrs.CON||0)+4; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
 ]};
PEAK_V52["骑士"] || (PEAK_V52["骑士"]={}); PEAK_V52["骑士"]["itinerant_peak"] = {"id":"itinerant_peak","cn":"巡游之巅","desc":"巡游骑士之道的尽头：路是你的书，城是你的页。","nodes":[
  {"lv":1,"cn":"识途","desc":"你走过的城，都给你留了门。","eff":function(){ try{ S.flags["v52_peak_itinerant_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"断案如神","desc":"你判的案子，双方都说「行」。","eff":function(){ try{ S.flags["v52_peak_itinerant_peak_2"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":3,"cn":"疾风","desc":"你的马认你，风也认你。","eff":function(){ try{ S.flags["v52_peak_itinerant_peak_3"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":4,"cn":"旧识","desc":"每个城都有一个记得你名字的故人。","eff":function(){ try{ S.flags["v52_peak_itinerant_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":5,"cn":"万里行","desc":"你的足迹连成一条线，线上的人都欠你一声谢。","eff":function(){ try{ S.flags["v52_peak_itinerant_peak_5"]=1; S.attrs.AGI=(S.attrs.AGI||0)+3; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
 ]};
PEAK_V52["游侠"] || (PEAK_V52["游侠"]={}); PEAK_V52["游侠"]["hunter_peak"] = {"id":"hunter_peak","cn":"猎杀之巅","desc":"猎人之道的尽头：你不再追猎物，猎物追你。","nodes":[
  {"lv":1,"cn":"猎线","desc":"你设的陷阱，猎物会自己走进去。","eff":function(){ try{ S.flags["v52_peak_hunter_peak_1"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":2,"cn":"箭步","desc":"你放箭时，脚步比箭先到。","eff":function(){ try{ S.flags["v52_peak_hunter_peak_2"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":3,"cn":"准星","desc":"你的箭不再需要瞄准——它自己知道去哪里。","eff":function(){ try{ S.flags["v52_peak_hunter_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"猎约","desc":"你放过的那头猎物，替你在林子里传了话。","eff":function(){ try{ S.flags["v52_peak_hunter_peak_4"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxHp=(S.maxHp||100)+10; }catch(e){} }},
  {"lv":5,"cn":"万猎之王","desc":"林子里的每双眼睛都在看你——它们是替你放哨的。","eff":function(){ try{ S.flags["v52_peak_hunter_peak_5"]=1; S.attrs.AGI=(S.attrs.AGI||0)+4; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
 ]};
PEAK_V52["游侠"] || (PEAK_V52["游侠"]={}); PEAK_V52["游侠"]["warden_peak"] = {"id":"warden_peak","cn":"守望之巅","desc":"巡林者之道的尽头：你不是林子里的过客，是林子的心跳。","nodes":[
  {"lv":1,"cn":"地脉脉动","desc":"你能感觉到地脉在脚下流动，像一条大河。","eff":function(){ try{ S.flags["v52_peak_warden_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"守夜","desc":"你守的夜，林子替你醒着。","eff":function(){ try{ S.flags["v52_peak_warden_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"林语","desc":"树会告诉你谁来过、往哪去了。","eff":function(){ try{ S.flags["v52_peak_warden_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"共生","desc":"你和林子之间的约定，林子记得。","eff":function(){ try{ S.flags["v52_peak_warden_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"守望之名","desc":"十万大山知道你的名字——像知道一条河的名字。","eff":function(){ try{ S.flags["v52_peak_warden_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+3; S.attrs.CON=(S.attrs.CON||0)+3; }catch(e){} }},
 ]};
PEAK_V52["游侠"] || (PEAK_V52["游侠"]={}); PEAK_V52["游侠"]["scout_peak"] = {"id":"scout_peak","cn":"巡林之巅","desc":"哨探之道的尽头：你先看到一切，一切看不到你。","nodes":[
  {"lv":1,"cn":"先行","desc":"你总是先到一步——像风先到。","eff":function(){ try{ S.flags["v52_peak_scout_peak_1"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":2,"cn":"无形","desc":"你走过的地方，草不弯，叶不落。","eff":function(){ try{ S.flags["v52_peak_scout_peak_2"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":3,"cn":"撤退路","desc":"你留的退路，总是通的。","eff":function(){ try{ S.flags["v52_peak_scout_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"哨眼","desc":"你睡一半醒一半——醒来那一半，替你看着。","eff":function(){ try{ S.flags["v52_peak_scout_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"万径","desc":"所有路在你眼里连成一张网，你站的是网心。","eff":function(){ try{ S.flags["v52_peak_scout_peak_5"]=1; S.attrs.AGI=(S.attrs.AGI||0)+3; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
 ]};
PEAK_V52["盗贼"] || (PEAK_V52["盗贼"]={}); PEAK_V52["盗贼"]["assassin_peak"] = {"id":"assassin_peak","cn":"影杀之巅","desc":"刺客之道的尽头：影子比你更像你。","nodes":[
  {"lv":1,"cn":"影随","desc":"你的影子会替你挡一下视线。","eff":function(){ try{ S.flags["v52_peak_assassin_peak_1"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":2,"cn":"匿声","desc":"你走动时，连风都不替你通风报信。","eff":function(){ try{ S.flags["v52_peak_assassin_peak_2"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":3,"cn":"一击","desc":"你的第一击，比第二击重得多。","eff":function(){ try{ S.flags["v52_peak_assassin_peak_3"]=1; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
  {"lv":4,"cn":"影步","desc":"你一步跨出，影子在原地替你站着。","eff":function(){ try{ S.flags["v52_peak_assassin_peak_4"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxHp=(S.maxHp||100)+10; }catch(e){} }},
  {"lv":5,"cn":"无形杀","desc":"你动手时，没人知道你在场——包括被杀的人。","eff":function(){ try{ S.flags["v52_peak_assassin_peak_5"]=1; S.attrs.AGI=(S.attrs.AGI||0)+4; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
 ]};
PEAK_V52["盗贼"] || (PEAK_V52["盗贼"]={}); PEAK_V52["盗贼"]["burglar_peak"] = {"id":"burglar_peak","cn":"夜行之巅","desc":"夜盗之道的尽头：夜是你的家，门是你的客人。","nodes":[
  {"lv":1,"cn":"夜眼","desc":"夜里的东西，你看着比白天清楚。","eff":function(){ try{ S.flags["v52_peak_burglar_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"听锁","desc":"锁芯在你听来是句子——它说「别开」时，你停手。","eff":function(){ try{ S.flags["v52_peak_burglar_peak_2"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; }catch(e){} }},
  {"lv":3,"cn":"估价","desc":"你一眼能算出物件背后的故事值多少。","eff":function(){ try{ S.flags["v52_peak_burglar_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"夜路","desc":"夜里的屋顶，你走得比街道熟。","eff":function(){ try{ S.flags["v52_peak_burglar_peak_4"]=1; S.attrs.AGI=(S.attrs.AGI||0)+2; S.maxHp=(S.maxHp||100)+10; }catch(e){} }},
  {"lv":5,"cn":"夜之长子","desc":"夜认得你——它替你盖住脚印。","eff":function(){ try{ S.flags["v52_peak_burglar_peak_5"]=1; S.attrs.AGI=(S.attrs.AGI||0)+3; S.attrs.INT=(S.attrs.INT||0)+3; }catch(e){} }},
 ]};
PEAK_V52["盗贼"] || (PEAK_V52["盗贼"]={}); PEAK_V52["盗贼"]["spy_peak"] = {"id":"spy_peak","cn":"耳目之巅","desc":"密探之道的尽头：你听的每句话，都在替你织一张网。","nodes":[
  {"lv":1,"cn":"听风","desc":"风里的话，你听得见。","eff":function(){ try{ S.flags["v52_peak_spy_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"套话","desc":"你问一句话，能换回三句。","eff":function(){ try{ S.flags["v52_peak_spy_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"过目","desc":"你见过的人，脸都收在你这儿。","eff":function(){ try{ S.flags["v52_peak_spy_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"暗线","desc":"你的每句话，都有一条线牵到想知道它的人那里。","eff":function(){ try{ S.flags["v52_peak_spy_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":5,"cn":"网心","desc":"所有消息在你手里汇成网，你站的是网心。","eff":function(){ try{ S.flags["v52_peak_spy_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
 ]};
PEAK_V52["牧师"] || (PEAK_V52["牧师"]={}); PEAK_V52["牧师"]["healer_peak"] = {"id":"healer_peak","cn":"慈悲之巅","desc":"治疗之道的尽头：你的手，比药先到。","nodes":[
  {"lv":1,"cn":"净手","desc":"你的手过处，伤口自己收拢。","eff":function(){ try{ S.flags["v52_peak_healer_peak_1"]=1; S.maxHp=(S.maxHp||100)+15; }catch(e){} }},
  {"lv":2,"cn":"止痛","desc":"你能把痛从人身上移走一会儿——放在自己这里。","eff":function(){ try{ S.flags["v52_peak_healer_peak_2"]=1; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":3,"cn":"续命","desc":"你握着将死之人的手，他能多等一刻。","eff":function(){ try{ S.flags["v52_peak_healer_peak_3"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":4,"cn":"回春","desc":"你治过的地方，来年草长得格外好。","eff":function(){ try{ S.flags["v52_peak_healer_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.SPR=(S.attrs.SPR||0)+2; }catch(e){} }},
  {"lv":5,"cn":"大慈悲","desc":"你治的不再是伤，是「不想好」的那颗心。","eff":function(){ try{ S.flags["v52_peak_healer_peak_5"]=1; S.attrs.SPR=(S.attrs.SPR||0)+4; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
 ]};
PEAK_V52["牧师"] || (PEAK_V52["牧师"]={}); PEAK_V52["牧师"]["inquisitor_peak"] = {"id":"inquisitor_peak","cn":"审判之巅","desc":"审判官之道的尽头：你分辨的从来不是真假，是轻重。","nodes":[
  {"lv":1,"cn":"照见","desc":"你看得出人话里那层没说出口的。","eff":function(){ try{ S.flags["v52_peak_inquisitor_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"圣印","desc":"你的圣印压下去，谎言会自己浮上来。","eff":function(){ try{ S.flags["v52_peak_inquisitor_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"断狱","desc":"你断的案，两边都服。","eff":function(){ try{ S.flags["v52_peak_inquisitor_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"明镜","desc":"你心里有一面镜，照过的人忘不掉。","eff":function(){ try{ S.flags["v52_peak_inquisitor_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":5,"cn":"真言","desc":"你说的话，别人信——因为你只说你看得见的。","eff":function(){ try{ S.flags["v52_peak_inquisitor_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+3; S.attrs.CHA=(S.attrs.CHA||0)+3; }catch(e){} }},
 ]};
PEAK_V52["牧师"] || (PEAK_V52["牧师"]={}); PEAK_V52["牧师"]["warpriest_peak"] = {"id":"warpriest_peak","cn":"圣战之巅","desc":"圣战士之道的尽头：你的祷词，本身就是武器。","nodes":[
  {"lv":1,"cn":"祷锋","desc":"你的祷词念到第三句，风会停。","eff":function(){ try{ S.flags["v52_peak_warpriest_peak_1"]=1; S.attrs.STR=(S.attrs.STR||0)+2; }catch(e){} }},
  {"lv":2,"cn":"护佑","desc":"你护着的人，刀会偏一寸。","eff":function(){ try{ S.flags["v52_peak_warpriest_peak_2"]=1; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":3,"cn":"战歌","desc":"你的战歌一起，同伴的脚步齐了。","eff":function(){ try{ S.flags["v52_peak_warpriest_peak_3"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":4,"cn":"圣躯","desc":"你的身体记住了神名——受伤时它会自己念。","eff":function(){ try{ S.flags["v52_peak_warpriest_peak_4"]=1; S.maxHp=(S.maxHp||100)+15; S.attrs.CON=(S.attrs.CON||0)+2; }catch(e){} }},
  {"lv":5,"cn":"圣战之名","desc":"你举起武器时，对面会先问一句「值不值」。","eff":function(){ try{ S.flags["v52_peak_warpriest_peak_5"]=1; S.attrs.STR=(S.attrs.STR||0)+3; S.attrs.SPR=(S.attrs.SPR||0)+3; }catch(e){} }},
 ]};
PEAK_V52["商人"] || (PEAK_V52["商人"]={}); PEAK_V52["商人"]["merchant_peak"] = {"id":"merchant_peak","cn":"商道之巅","desc":"行商之道的尽头：你经手的不是货，是人情。","nodes":[
  {"lv":1,"cn":"行情","desc":"你闻得出市场的风向，像闻得出雨。","eff":function(){ try{ S.flags["v52_peak_merchant_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"让利","desc":"你让的那份利，会自己走回来。","eff":function(){ try{ S.flags["v52_peak_merchant_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"货眼","desc":"你一眼看出货的来处和去处。","eff":function(){ try{ S.flags["v52_peak_merchant_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"信誉","desc":"你的名字在账本上，比金子重。","eff":function(){ try{ S.flags["v52_peak_merchant_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":5,"cn":"商道通神","desc":"你开的路，商队愿意多绕三里来走。","eff":function(){ try{ S.flags["v52_peak_merchant_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+3; S.attrs.CHA=(S.attrs.CHA||0)+3; }catch(e){} }},
 ]};
PEAK_V52["商人"] || (PEAK_V52["商人"]={}); PEAK_V52["商人"]["banker_peak"] = {"id":"banker_peak","cn":"金流之巅","desc":"钱庄之道的尽头：钱在你手里，像水在河道里。","nodes":[
  {"lv":1,"cn":"流水","desc":"你经手的钱，都认得回家的路。","eff":function(){ try{ S.flags["v52_peak_banker_peak_1"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":2,"cn":"拆借","desc":"你借出去的人情，会按时回来。","eff":function(){ try{ S.flags["v52_peak_banker_peak_2"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":3,"cn":"风控","desc":"你算得出的风险，都提前付了利息。","eff":function(){ try{ S.flags["v52_peak_banker_peak_3"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":4,"cn":"金河","desc":"你名下的账，像一条不断流的河。","eff":function(){ try{ S.flags["v52_peak_banker_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":5,"cn":"万金之主","desc":"钱币在你手里会说话——它们商量好了替你办事。","eff":function(){ try{ S.flags["v52_peak_banker_peak_5"]=1; S.attrs.INT=(S.attrs.INT||0)+4; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
 ]};
PEAK_V52["商人"] || (PEAK_V52["商人"]={}); PEAK_V52["商人"]["auctioneer_peak"] = {"id":"auctioneer_peak","cn":"拍场之巅","desc":"拍卖师之道的尽头：你举的槌，落下的是一段缘分。","nodes":[
  {"lv":1,"cn":"识人","desc":"你一眼看出谁真想要、谁只是看看。","eff":function(){ try{ S.flags["v52_peak_auctioneer_peak_1"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":2,"cn":"抬价","desc":"你的槌一响，东西有了身价。","eff":function(){ try{ S.flags["v52_peak_auctioneer_peak_2"]=1; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":3,"cn":"人情","desc":"你卖出去的东西，买家都记你一份好。","eff":function(){ try{ S.flags["v52_peak_auctioneer_peak_3"]=1; S.attrs.CHA=(S.attrs.CHA||0)+2; }catch(e){} }},
  {"lv":4,"cn":"眼力","desc":"你见过的奇物，都记在你心里那本册上。","eff":function(){ try{ S.flags["v52_peak_auctioneer_peak_4"]=1; S.maxHp=(S.maxHp||100)+10; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
  {"lv":5,"cn":"一槌定音","desc":"你落槌的那一声，能让人记一辈子。","eff":function(){ try{ S.flags["v52_peak_auctioneer_peak_5"]=1; S.attrs.CHA=(S.attrs.CHA||0)+4; S.attrs.INT=(S.attrs.INT||0)+2; }catch(e){} }},
 ]};

FEAT_EFFECT_V52.push({flag:"elemental_peak_2",scene:"战斗",type:"bonus",value:3,label:"巅峰·元素共鸣",src:"peak"});
FEAT_EFFECT_V52.push({flag:"conjurer_peak_4",scene:"探索",type:"bonus",value:3,label:"巅峰·门的记忆",src:"peak"});
FEAT_EFFECT_V52.push({flag:"arcane_peak_3",scene:"战斗",type:"floor",value:50,label:"巅峰·法则补丁",src:"peak"});
FEAT_EFFECT_V52.push({flag:"hypnotist_peak_2",scene:"社交",type:"bonus",value:3,label:"巅峰·静场",src:"peak"});
FEAT_EFFECT_V52.push({flag:"medium_peak_4",scene:"探索",type:"bonus",value:3,label:"巅峰·灵伴",src:"peak"});
FEAT_EFFECT_V52.push({flag:"soulbinder_peak_3",scene:"战斗",type:"floor",value:48,label:"巅峰·守约之誓",src:"peak"});
FEAT_EFFECT_V52.push({flag:"alchemist_peak_3",scene:"交易",type:"bonus",value:4,label:"巅峰·见素",src:"peak"});
FEAT_EFFECT_V52.push({flag:"forger_peak_2",scene:"战斗",type:"bonus",value:3,label:"巅峰·锻魂",src:"peak"});
FEAT_EFFECT_V52.push({flag:"machinist_peak_4",scene:"探索",type:"bonus",value:3,label:"巅峰·共感机",src:"peak"});
FEAT_EFFECT_V52.push({flag:"berserker_peak_3",scene:"战斗",type:"bonus",value:4,label:"巅峰·战意",src:"peak"});
FEAT_EFFECT_V52.push({flag:"weaponmaster_peak_2",scene:"战斗",type:"floor",value:50,label:"巅峰·听刃",src:"peak"});
FEAT_EFFECT_V52.push({flag:"shieldguard_peak_4",scene:"战斗",type:"bonus",value:3,label:"巅峰·不动",src:"peak"});
FEAT_EFFECT_V52.push({flag:"paladin_peak_2",scene:"战斗",type:"bonus",value:3,label:"巅峰·斩邪成习",src:"peak"});
FEAT_EFFECT_V52.push({flag:"itinerant_peak_2",scene:"社交",type:"bonus",value:3,label:"巅峰·断案如神",src:"peak"});
FEAT_EFFECT_V52.push({flag:"protector_peak_3",scene:"战斗",type:"floor",value:50,label:"巅峰·铁誓",src:"peak"});
FEAT_EFFECT_V52.push({flag:"hunter_peak_3",scene:"战斗",type:"bonus",value:3,label:"巅峰·准星",src:"peak"});
FEAT_EFFECT_V52.push({flag:"warden_peak_2",scene:"探索",type:"bonus",value:4,label:"巅峰·守夜",src:"peak"});
FEAT_EFFECT_V52.push({flag:"scout_peak_4",scene:"探索",type:"floor",value:50,label:"巅峰·哨眼",src:"peak"});
FEAT_EFFECT_V52.push({flag:"assassin_peak_3",scene:"战斗",type:"bonus",value:3,label:"巅峰·一击",src:"peak"});
FEAT_EFFECT_V52.push({flag:"burglar_peak_2",scene:"探索",type:"bonus",value:4,label:"巅峰·夜眼",src:"peak"});
FEAT_EFFECT_V52.push({flag:"spy_peak_2",scene:"社交",type:"bonus",value:3,label:"巅峰·套话",src:"peak"});
FEAT_EFFECT_V52.push({flag:"healer_peak_2",scene:"战斗",type:"bonus",value:2,label:"巅峰·止痛",src:"peak"});
FEAT_EFFECT_V52.push({flag:"inquisitor_peak_2",scene:"社交",type:"bonus",value:3,label:"巅峰·照见",src:"peak"});
FEAT_EFFECT_V52.push({flag:"warpriest_peak_4",scene:"战斗",type:"floor",value:50,label:"巅峰·圣躯",src:"peak"});
FEAT_EFFECT_V52.push({flag:"merchant_peak_2",scene:"交易",type:"bonus",value:4,label:"巅峰·行情",src:"peak"});
FEAT_EFFECT_V52.push({flag:"banker_peak_3",scene:"交易",type:"floor",value:52,label:"巅峰·风控",src:"peak"});
FEAT_EFFECT_V52.push({flag:"auctioneer_peak_2",scene:"社交",type:"bonus",value:3,label:"巅峰·识人",src:"peak"});
const ARTIFACT_V52 = {};

/*v52inj:rivals2*/
(function(){
  try{
    var EX = {
      "魔法师":[["rv_mage_v","银冠女爵·薇拉","7","圣城宫廷法师","她替国王试过三百种毒药，最后一种她没试——她说：'给别人试的，我不试。'","她会在动手前替你算一卦——那是她唯一会输的时候。","她的法术又快又冷，像冰面上的针。","你赢了。她收手时反而笑了：'算卦算到你，是我输了。'","她赢了你，却没有乘胜——她只是说：'下次换个地方打。'","她站在观星台的栏杆边，裙摆被风卷起来：'我替宫廷挡了二十年的灾。今天，替我自己挡一次。'",62,"她走时把那副算卦的银签留给了你：'留个纪念。卦上说你命硬，我看是真的。'"]],
      "灵魂法师":[["rv_soul_w","无面歌者","7","流浪的灵媒，没人见过她的脸","她唱的歌没有词，可听过的人都说，那唱的是自己死去的名字。","她唱歌时必须闭着眼——睁开眼，她的歌就断了。","她的歌一响，回廊里的烛火都朝她低头。","你赢了。她的歌声停了一瞬：'好多年没人让我的歌断过。'","她输了你，歌却没断——她哼着你的名字走远了。","她坐在回廊尽头的台阶上，面具下传来歌声：'我唱过一千个名字。今天，唱唱你的。'",60,"她走时摘下面具一角，你看见一张普通到记不住的脸——她说：'这样才唱得久。'"]],
      "术士":[["rv_smith_a","药剂师·灰指","7","黑市的炼金师，她的药比毒狠，毒比药准","她左手五根手指，每一根都泡过一种颜色。","她从不碰自己炼的东西——她说那是'留给客人的'。","她甩药粉的手法，像在给铁器淬火。","你赢了。她把药瓶收进袖口：'这瓶本来是想卖你的。省了。'","她输了你，却把那瓶药放在你脚边：'拿去。当交个朋友。'","她坐在熔炉边的阴影里，手指在灯光下泛着五色：'我炼的东西，一半救人，一半杀人。今天看看你算哪一半。'",61,"她走时把那瓶药留在了炉边：'暖的。喝不喝随你。'"]],
      "战士":[["rv_war_b","断山·库鲁","7","蛮族第一勇士，用断刀打赢了十七场决斗","他的断刀是他父亲留下的——他说刀断了，人不能断。","他最怕的不是输，是'刀断在人前'。","他的刀风里带着山石的味道。","你赢了。他把断刀举起来，对着天：'山神看见了。'","他输了你，却把断刀递过来：'替我看看，它是不是真的老了。'","他站在乱石堆上，断刀拄地：'我父亲说，刀断了还能打。今天看看，你算不算断刀。'",63,"他走时把断刀插在山口：'留着。等下一个走到这里的人。'"]],
      "骑士":[["rv_knight_s","白隼·塞拉","7","巡游骑士，专替走投无路的人出头","她接的每一桩委托，都不收钱——她收一句实话。","她骑马时从不回头——回头，她就走不动了。","她的剑术像她的名字，快而孤独。","你赢了。她把白隼的羽毛插在你衣领上：'替我飞一段。'","她输了你，却把羽毛留在你马鞍上。","她勒马停在你面前：'我替人出头出了十二年。今天，替自己出一次头。'",61,"她走时那根白羽还在风里转：'留着。它认识你。'"]],
      "游侠":[["rv_ranger_l","双矢·林","7","精灵猎手，一弓双矢，从不落空","他从不猎幼兽，也不猎怀孕的母兽——他说那是'给林子留的种'。","他射出的第二支箭，永远追着第一支——这是他改不掉的习惯。","他的箭来得比风先到，两支并行，像一对孪生。","你赢了。他收起弓：'林子的路，又多了一条。'","他输了你，却把第二支箭递给你：'留一支给你。'","他站在树冠上，风吹得他的弓弦轻响：'我猎了一辈子。今天，看看你能不能猎到风。'",60,"他走时那支箭插在你面前的树干上：'留着。它等过你。'"]],
      "盗贼":[["rv_thief_g","灰鼠·柯","7","自由城邦的线人王，整个码头都是他的耳朵","他经手的消息，没有一条不准——他说那是'换命换来的'。","他的消息网越大，他越怕黑——他睡觉不熄灯。","他的出手没有声音，像老鼠过街。","你赢了。他把一把钥匙放在你掌心：'码头那间屋，归你。'","他输了你，却把钥匙留在台阶上。","他蹲在旧码头的阴影里，手里把玩着一串钥匙：'我卖了半辈子消息。今天，想买你一个消息。'",59,"他走时那串钥匙在风里响：'留着。它能开码头上所有的门。'"]],
      "牧师":[["rv_priest_s","静默修女·安","7","圣辉教会守夜修女，她一生没说过一句多余的话","她守了二十年夜，只为等一个'她欠过的人'。","她从不先开口——她等你先说。","她的祷词没有声，可整座教堂都能听见。","你赢了。她点了点头，嘴唇动了动，没有声音。","她输了你，却在你手心画了一个十字。","她站在教堂的影子里，手里捻着一串旧念珠：'我守了二十年夜。今天，想听听你的夜。'",60,"她走时把那串念珠放在你掌心，还是没说话——可你知道那是什么意思。"]],
      "商人":[["rv_trade_y","燕来·沈","7","航运大亨，南方的每一条船，都欠他一次顺风","他经手的航线，没有一条赔过——他说那是'看天吃饭，但饭要自己盛'。","他最怕的不是亏本，是'船回不来'。","他的谈判从不高声，可整间屋子都安静。","你赢了。他把一张泛黄的海图推给你：'这条线，归你。'","他输了你，却把海图折好放在你面前。","他站在金衡大厅门口，望着远处的帆：'我让南方的船都顺风。今天，看看你能不能让我也顺一次。'",61,"他走时那张海图还在风里翻：'留着。它有回家的路。'"]]
    };
    for (var j in EX){
      (function(j, rv){
        RIVALS_V52[j].rivals.push({id:rv[0],cn:rv[1],realm:parseInt(rv[2],10),power:rv[3],desc:rv[4],weakness:rv[5],fightText:rv[6],defeatLine:rv[7],loseText:rv[8],trial_text:rv[9],t:parseInt(rv[10],10),defeat:rv[11]});
        var stageObj = {title:"第三重 · 对决 · " + rv[1], text:[rv[9]], opts:[
          {t:"挑战" + rv[1], eff:function(){ try{ var t2=parseInt(rv[10],10); var r=rollD100(); var ok=r<=t2; S.godRival[rv[0]]=ok?1:0; writePar('【判定】目标 '+t2+'，掷出 '+r+(ok?' → 胜':' → 未胜'), ok?'hint':'roll-fail'); if(ok){ writePar(rv[11]); } else { writePar('他（她）没有赶尽杀绝，只是把话留在了风里。'); } }catch(e){} }}
        ]};
        var t = RIVALS_V52[j].trial.stages;
        var idx = -1;
        for (var i=0;i<t.length;i++){ if(String(t[i].title||'').indexOf('第四重')>=0){ idx=i; break; } }
        if(idx<0) t.push(stageObj); else t.splice(idx,0,stageObj);
      })(j, EX[j][0]);
    }
  }catch(e){ if(window.console) console.error('rivals2:', e); }
})();
/*v52inj:rivals3*/
(function(){
  try{
    for (var j in RIVALS_V52){
      var chain = RIVALS_V52[j].trial || null;
      var rivals = RIVALS_V52[j].rivals || [];
      if(!chain || !rivals.length) continue;
      var t = chain.stages;
      var pre = -1;
      for (var i=0;i<t.length;i++){ if(String(t[i].title||'').indexOf('第四重')>=0){ pre=i; break; } }
      rivals.forEach(function(rv){
        if(!rv || !rv.cn) return;
        var has = false;
        t.forEach(function(sg){ if(String(sg.title||'').indexOf('对决 · ' + rv.cn)>=0) has = true; });
        if(has) return;
        var stageObj = {title:"第三重 · 对决 · " + rv.cn, text:[rv.trial_text || "他（她）站在那里，像已经等了你很久。"], opts:[
          {t:"挑战" + rv.cn, eff:function(){ try{ var t2=rv.t; var r=rollD100(); var ok=r<=t2; S.godRival[rv.id]=ok?1:0; writePar('【判定】目标 '+t2+'，掷出 '+r+(ok?' → 胜':' → 未胜'), ok?'hint':'roll-fail'); if(ok){ writePar(rv.defeat || '你赢了。'); } else { writePar('他（她）没有赶尽杀绝，只是把话留在了风里。'); } }catch(e){} }}
        ]};
        if(pre<0) t.push(stageObj); else t.splice(pre,0,stageObj);
      });
    }
  }catch(e){ if(window.console) console.error('rivals3:', e); }
})();

/*v52inj:artifact*/
ARTIFACT_V52["魔法师"] = {
 "cn":"碎星法杖","lore":"传说它认主，只肯听「与元素同声」之人的话。杖身断成两截，一截在南方港城的旧货市，一截在精灵古林的深处。","hint":"组织首席所授：南方港城旧货市的老收藏家。","quest":[
  {text:"你按羊皮卷的指引来到南方港城的旧货市。老收藏家的铺子在巷子最深处，门板上钉着一枚七重环的铜钉——那是元素学院百年前的暗记。"},
  {text:"老收藏家听完你的来意，从柜台下抱出一只长匣：「杖身我收了一辈子，等一个能让它亮起来的人。你试试。」你伸手触杖，杖身没有反应。他摇头：「不是火候。是你心里还缺一样东西。」",opts:[[{t:"问他缺什么",text:"他说：「缺一句你真正信的话。你学法术，是为了什么？」"},{t:"坦白自己学法术的初心",text:"你说了实话。杖身在你掌心里，亮了一线微光。"}]]},
  {text:"你带着半截杖身北上，穿过精灵古林的边缘。林深处的风很静，静到你能听见自己心跳里的那点元素动静。"},
  {text:"古林深处有一棵断成两半的老树，树心里嵌着另一半杖身——它等得太久，树皮已经包住了它。你伸手，杖身自己落进你手里，两截断口发出一声轻响，合上了。"},
  {text:"碎星在你手中亮起。元素学院的方向，星落塔的七盏灯同时亮了一下——像是在应声。"},
 ],
 "gainText":"碎星法杖归位。你握杖的姿势，像握了半辈子。"
};
ARTIFACT_V52["灵魂法师"] = {
 "cn":"招魂铃","lore":"失落于三次大战之前。传闻它如今在银叶城的精灵古藏里，被当作一件会「自己响」的旧物。","hint":"晨曦圣殿掌灯大祭司所授：银叶城精灵古藏。","quest":[
  {text:"你带着羊皮谱走进银叶城。精灵古藏的管理者是一位活了很久的图书管理员，她听说你是来找「会自己响的旧物」的，沉默了一会儿：「那东西，我们以为是件乐器。可它响起来的时候，古藏里的书会自己翻页。」",opts:[[{t:"请她让你看看那件旧物",text:"她领你到古藏深处。那枚铃铛挂在梁上，落满灰尘——可它看见你时，自己响了一声。"}]]},
  {text:"你伸手，铃铛落进你掌心，冰凉。管理员说：「它等的人，总算是来了。」你听见铃里有一声极轻的叹息——像某个等了很久的灵，终于可以走了。"},
  {text:"你把铃带回晨曦圣殿。回廊里的烛火，在你路过时同时矮了一截——像在向你行礼。"},
 ],
 "gainText":"招魂铃归位。你摇它时，回廊里所有的名字都静下来听。"
};
ARTIFACT_V52["术士"] = {
 "cn":"雷锤","lore":"百年前随上任总炉长沉于南方港城外的沉船。打铁人不见铁，打铁人只见炉。","hint":"锻造公会首席所授：南方港城外的沉船。","quest":[
  {text:"你雇了一艘小渔船，在沉船点附近下潜。水下的沉船斜插在沙里，船板上的旧公会印还认得出来。"},
  {text:"你在船长室里找到一口铁箱。铁箱锁着，锁孔是公会的炉印——你用自己的锤柄对准，炉印轻一响，开了。"},
  {text:"铁箱里是那柄雷锤，锤头缠着旧布。你解开旧布时，锤头亮了一下——不是光，是那种「炉火认人」的热。"},
  {text:"你抱着雷锤回到铁峰堡，熔炉大厅的火，在你进门时同时旺了一截。"},
 ],
 "gainText":"雷锤归位。你把它立在炉边，炉火和它，像两个老朋友又坐在了一起。"
};
ARTIFACT_V52["战士"] = {
 "cn":"战神断矛","lore":"百年前团长断矛于此。矛断处，地底有雷声。","hint":"战神团团长所授：铁门关以西的荒谷。","quest":[
  {text:"你按半张地图走进铁门关以西的荒谷。谷底的风很硬，吹得人睁不开眼。"},
  {text:"你在谷底找到一处塌陷的地洞，洞口的土是新的——像有人刚挖开过。你下到洞底，摸到一截冰凉的东西：断矛。"},
  {text:"你握住断矛的瞬间，地底响起一声闷雷。不是雷声，是心跳——像这柄矛还连着某种更古老的东西。"},
  {text:"你把断矛带回铁门关，插在旧矛旁边。风停了一瞬，像百年前的团长认出了它。"},
 ],
 "gainText":"战神断矛归位。它立在旧矛旁，像是终于有人替它把没打完的仗打完了。"
};
ARTIFACT_V52["骑士"] = {
 "cn":"白誓之盾","lore":"誓约骑士团最初的圣物。盾面上刻着骑士团最初的誓言，沉在银叶城外的一处古湖底。","hint":"大团长金戒内圈的暗纹所授：银叶城外的古湖。","quest":[
  {text:"你按金戒内圈的拓片来到银叶城外的古湖。湖水极清，能看见湖底的石头——可你看不见盾。"},
  {text:"你在湖边等了三天。第三天夜里，湖心浮起一盏灯，灯下坐着一个湖灵。它开口：「你是来取白誓的？先回答我——骑士团最初的誓言，是什么？」",opts:[[{t:"说出你入团时的誓言",text:"湖灵听完，沉默了很久：「不是这句。」它又想了想，「不过，你能守住自己的誓，就算半个答案。」湖水分开，白誓浮了上来。"},{t:"如实说不知道",text:"湖灵笑了：「诚实。」湖水分开，白誓浮了上来——「它等的就是一个肯说实话的人。」"}]]},
  {text:"你捞起白誓。盾面冰凉，刻着一行古字——不是骑士团现在的誓言，是更早的一句：「言出如山，山可移，言不移。」"},
  {text:"你把白誓带回白塔。广场上的旗子，在它进塔时，猎猎响了三声。"},
 ],
 "gainText":"白誓归位。你把它供在白塔顶层——历代大团长的名字，都刻在它后面。"
};
ARTIFACT_V52["游侠"] = {
 "cn":"风语弓","lore":"由百年前的老总巡沉于铁门关外的冻湖。湖水冻了百年，弓在冰下等一个听得见风说话的人。","hint":"荒野巡守总巡所授：铁门关外的冻湖。","quest":[
  {text:"你来到铁门关外的冻湖。冰面厚得能走马，风刮得人站不稳。"},
  {text:"你在湖心凿开一个冰洞。水很黑，看不见底。你伸手下去，摸到一截弓梢——它凉得像冰，却在你手里轻震了一下，像认出你了。"},
  {text:"你把弓拉出水面。弓弦冻得像铁，你呵着热气，一下一下把它暖过来。暖到第三遍时，弓弦自己松开了——发出一声很轻的鸣响，像风终于学会了说话。"},
  {text:"你背着风语弓回到绿林会馆。门口那根木棍上的记号，在你进门时亮了一亮。"},
 ],
 "gainText":"风语弓归位。你拉弓时，风会自己替你找准心。"
};
ARTIFACT_V52["盗贼"] = {
 "cn":"夜影短刃","lore":"初代阁主的佩刃。传说它如今躺在承天城王宫宝库的暗格里，那暗格的钥匙，三代阁主都没找齐过。","hint":"暗影阁阁主所授：承天城王宫宝库。","quest":[
  {text:"你潜进承天城王宫，宝库的暗格在库房最里面那面墙后。你摸到暗格，锁孔是一枚古印——不是钥匙能开的锁，是「人心」的锁。"},
  {text:"你想起羊皮卷背面那句：「钥匙不在锁里，在人心里。」你闭上眼，想自己偷东西的初衷——是活命，是好奇，还是别的什么。"},
  {text:"你睁开眼时，锁孔自己转了半圈。暗格开了，夜影躺在里面，刃口漆黑，像一截凝固的夜。"},
  {text:"你带着夜影潜出王宫。城头的更夫打了个哈欠，什么也没看见。"},
 ],
 "gainText":"夜影归位。它在你腰间，像影子终于有了自己的形状。"
};
ARTIFACT_V52["牧师"] = {
 "cn":"圣辉权杖","lore":"随初代教皇葬于银叶城外的古修道院遗址。光不为照路，光为照人。","hint":"枢机主教所授：银叶城外的古修道院遗址。","quest":[
  {text:"你来到银叶城外的古修道院遗址。只剩几面断墙，墙角的石阶上长满了青苔。"},
  {text:"你在断墙下挖到一具石棺。棺盖上的刻字已经模糊，只剩一行还认得出来：「光不为照路，光为照人。」"},
  {text:"你推开棺盖。里面没有骸骨，只有一柄权杖，杖头是一盏熄灭的灯。你握杖时，灯芯自己亮了起来——不是你的光，是它自己的。"},
  {text:"你把权杖带回圣城。大教堂的钟，在你进门时自己响了一记。"},
 ],
 "gainText":"圣辉权杖归位。它杖头的那盏灯，从此没再熄过。"
};
ARTIFACT_V52["商人"] = {
 "cn":"称心如意","lore":"初代会长的金算盘。沉在自由城邦旧港的沉船里，位置记在初代账本的夹页里。","hint":"金衡商会会长所授：自由城邦旧港的沉船。","quest":[
  {text:"你按初代账本的夹页港图，来到自由城邦旧港。港口的淤泥很深，沉船埋了大半。"},
  {text:"你雇人抽水清淤，在沉船底舱找到一只铁箱。铁箱里没有金算盘——只有一封信，和一枚秤砣。信上写着：「算盘是幌子。称心如意，是人心，不是物件。秤砣送你了。」",opts:[[{t:"收下秤砣，把信放回铁箱",text:"你合上铁箱，觉得手里那枚秤砣比金子沉。"},{t:"把秤砣带回金衡大厅",text:"你把它放在公秤旁边——两枚秤砣，像两任会长隔着百年对坐。"}]]},
  {text:"你带着秤砣回到金衡大厅，把它放在门口那杆公秤上。秤砣落定，秤杆轻一沉，又平了。"},
 ],
 "gainText":"称心如意归位——它原来不是物件，是你这一路称过的心。"
};
