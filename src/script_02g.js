/*v76mod*/

/* ============================================================
   v22 ag卷节点
   ============================================================ */
N["moral_choice_event"] = function(){
  const choice = pickV(MORAL_SYSTEM.grayChoices, "moral_choice_random");
  return {
    place: "抉择",
    text: function(){
      return [choice.situation, "你必须做出选择。没有「正确」的答案——只有你能承担的后果。"];
    },
    options: choice.choices.map((c,i)=>{
      return {
        t: c.text,
        go: "moral_choice_result",
        effect: { time:0 },
        after: function(){ recordMoralChoice(choice.id, i); S._lastMoralConsequence = c.consequence; }
      };
    })
  };
};

N["moral_choice_result"] = function(){
  return {
    place: "抉择之后",
    text: function(){
      const arr = [];
      if(S._lastMoralConsequence){
        arr.push(S._lastMoralConsequence);
        delete S._lastMoralConsequence;
      }
      arr.push("");
      arr.push("你继续往前走。但你知道，刚才的那个选择会跟着你——不是作为惩罚，是作为你的一部分。");
      arr.push("人就是他所有选择的总和。");
      arr.push("你最后回望一眼抉择之后，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry" }
    ]
  };
};

N["daily_life_node"] = function(){
  const cityKey = senseCityKey(S.loc) || "jiaohui";
  const phase = getDayPhase();
  return {
    place: S.loc + " · 日常",
    text: function(){
      const arr = [];
      const city = DAILY_LIFE.cities[cityKey];
      if(city){
        const texts = city[phase] || city.noon;
        arr.push(pickV(texts, "daily_node_"+cityKey+"_"+phase));
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
          if(epicText) arr.push(epicText);
        }
      }
      arr.push("");
      arr.push("这就是日常。大陆的命运在远处翻涌，但此刻，你只是一个在城市里走动的人。");
      arr.push("也许这就是生活的意义——不是那些惊天动地的大事，是这些平凡的、琐碎的、活着的瞬间。");
      return arr;
    },
    options: [
      { t:"去集市逛逛", go:"fc_jiaohui_entry" },
      { t:"去酒馆坐坐", go:"fc_jiaohui_entry" },
      { t:"找个地方发呆", effect:{time:1}, go:"fc_jiaohui_entry",
        tier:{ ok:["你找了个安静的角落，坐了很久。什么都没做，什么都没想。时间像水一样流过去。你感到一种奇怪的平静。"] } },
      { t:"离开", go:"fc_jiaohui_entry" }
    ]
  };
};

N["pov_recap_node"] = function(){
  const eventIds = Object.keys(POV_SYSTEM.events);
  const eventId = pickV(eventIds, "pov_event_random");
  // 根据玩家的知识和经历决定解锁哪些视角
  const unlocked = ["human_pov"];
  if(knowledgeCheck("race",30) || S.race==="兽人") unlocked.push("orc_pov");
  if(knowledgeCheck("history",50)) unlocked.push("scholar_pov");
  if(knowledgeCheck("hlj",60) || S.flags.knows_truth) unlocked.push("truth");
  return {
    place: "多视角 · "+POV_SYSTEM.events[eventId].title,
    text: function(){
      return renderPOV(eventId, unlocked);
    },
    options: [
      { t:"继续思考", go:"fc_jiaohui_entry" },
      { t:"记录下来", effect:{time:0}, go:"fc_jiaohui_entry",
        tier:{ ok:["你把这些不同的说法都记了下来。也许有一天，你能拼凑出真相。也许不能。但记录本身，就是对真相的尊重。"] } }
    ]
  };
};

N["silence_node"] = function(){
  return {
    place: "沉默",
    text: function(){
      const arr = [];
      arr.push("你沉默了。");
      arr.push("");
      const m = pickV(SILENCE_SYSTEM.silenceMoments, "silence_random");
      if(m) arr.push(m.text);
      arr.push("");
      arr.push("有些时刻，语言是多余的。");
      arr.push("你最后回望一眼沉默，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"打破沉默", go:"fc_jiaohui_entry" },
      { t:"继续沉默", effect:{time:1}, go:"fc_jiaohui_entry",
        tier:{ ok:["你又坐了一会儿。风从窗户吹进来，带着远处的声音。你觉得心里某个地方，慢慢安静了下来。"] } }
    ]
  };
};

N["unresolved_mysteries_node"] = function(){
  return {
    place: "未解之谜",
    text: function(){
      const arr = ["你回想起旅途中遇到的一些事——那些没有答案的事："];
      for(const m of SILENCE_SYSTEM.unresolvedMysteries){
        arr.push("· "+m);
      }
      arr.push("");
      arr.push("不是所有问题都有答案。也许这就是世界的本来面目——充满了未解之谜，而我们在其中行走，偶尔捡到一片拼图，然后继续走。");
      arr.push("别过未解之谜，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"继续探索", go:"fc_jiaohui_entry" }
    ]
  };
};

// v22 ag CSS
const v22_ag_css = document.createElement("style");
v22_ag_css.textContent = `
.location-memory { color: #b0c4de; font-size: 0.95em; margin: 10px 0; padding: 8px 12px; background: rgba(176,196,222,0.06); border-left: 3px solid #b0c4de; }
.location-memory.first { border-left-color: #87ceeb; }
.location-memory.revisit { border-left-color: #daa520; }
.daily-life { color: #90ee90; font-size: 0.92em; margin: 6px 0; }
.epic-daily { color: #cd5c5c; font-size: 0.9em; font-style: italic; margin: 6px 0; padding-left: 8px; border-left: 2px solid #cd5c5c; }
.silence-moment { color: #d3d3d3; font-style: italic; font-size: 0.95em; margin: 12px 0; padding: 10px; text-align: center; }
.unexplained { color: #9370db; font-size: 0.88em; margin: 6px 0; font-style: italic; }
.moral-choice { color: #ffd700; }
`;
document.head.appendChild(v22_ag_css);

console.log("[v22 ag] 地点记忆+道德灰色+日常+多视角+沉默留白系统已加载");


// ============================================================
// v23 七印之链数据
// ============================================================
const SEVEN_SEALS_CHAIN = {
  seal_1: {id:"seal_1", name:"第一印·铁门关", location:"铁门关", status:"已碎", guardian:"兽人战魂", truth:"兽人打碎此印不是侵略，是为了阻止印下的饥饿原初之物吞噬草原", primordial:"饥饿", stageRevealed:0},
  seal_2: {id:"seal_2", name:"第二印·兽人草原", location:"兽人王庭地下", status:"松动", guardian:"兽人萨满世代", truth:"萨满用族人的生命力维持封印，每一代萨满都在缓慢死去", primordial:"愤怒", stageRevealed:0},
  seal_3: {id:"seal_3", name:"第三印·世界树根", location:"精灵王国世界树根", status:"稳定", guardian:"精灵女王艾萨拉", truth:"黄林晶与精灵女王的旧约——女王用永生换取封印的稳定", primordial:"傲慢", stageRevealed:0},
  seal_4: {id:"seal_4", name:"第四印·永恒熔炉心", location:"矮人王国铁峰堡地心", status:"稳定", guardian:"矮人王索林", truth:"熔炉下燃烧的不是火，是贪婪原初之物的胃——矮人用锻造的欲望喂养它", primordial:"贪婪", stageRevealed:0},
  seal_5: {id:"seal_5", name:"第五印·南方深海", location:"南方城邦外海海底", status:"沉睡", guardian:"被遗忘的海族", truth:"黄林晶流放了海族，因为他们发现了七印的真相", primordial:"嫉妒", stageRevealed:0},
  seal_6: {id:"seal_6", name:"第六印·时光裂隙", location:"东部王国承天山后山", status:"裂隙", guardian:"玄机子", truth:"这是黄林晶留下的后门——他知道自己可能错了，留了一个改变历史的机会", primordial:"懒惰", stageRevealed:0},
  seal_7: {id:"seal_7", name:"第七印·深渊神殿", location:"死亡沙漠中心", status:"核心", guardian:"无（原初之物本体）", truth:"七印不是封印深渊，是分割并喂养原初之物——比深渊更古老的宇宙情感本身", primordial:"色欲", stageRevealed:0}
};

// ============================================================
// v23 深渊倒计时数据
// ============================================================
const ABYSS_COUNTDOWN = {
  stages: [
    {threshold:0, name:"潜伏期", worldState:"细微征兆：噩梦、动物异常、个别失踪案", desc:"世界还不知道深渊正在苏醒"},
    {threshold:20, name:"警觉期", worldState:"地区性异常：SAN事件频发，教会开始警觉", desc:"有识之士感觉到了不对，但大多数人还在日常中"},
    {threshold:40, name:"显现期", worldState:"七使者陆续现身，深渊生物出没，战争爆发", desc:"深渊不再隐藏，大陆陷入混乱"},
    {threshold:60, name:"降临期", worldState:"四邪神化身降临，部分地区深渊化", desc:"天空变色，大地腐烂，神明开始回应祈祷"},
    {threshold:80, name:"终局期", worldState:"深渊之主苏醒，全面降临，最终决战", desc:"世界的最后时刻，所有选择汇聚于此"}
  ],
  messengers: [
    {id:"m1", name:"第一使者·饥饿之牙", domain:"饥饿", seal:"seal_1", weakness:"满足", defeated:false},
    {id:"m2", name:"第二使者·愤怒之拳", domain:"愤怒", seal:"seal_2", weakness:"平静", defeated:false},
    {id:"m3", name:"第三使者·傲慢之冠", domain:"傲慢", seal:"seal_3", weakness:"谦卑", defeated:false},
    {id:"m4", name:"第四使者·贪婪之手", domain:"贪婪", seal:"seal_4", weakness:"给予", defeated:false},
    {id:"m5", name:"第五使者·嫉妒之眼", domain:"嫉妒", seal:"seal_5", weakness:"满足", defeated:false},
    {id:"m6", name:"第六使者·懒惰之影", domain:"懒惰", seal:"seal_6", weakness:"行动", defeated:false},
    {id:"m7", name:"第七使者·色欲之吻", domain:"色欲", seal:"seal_7", weakness:"克制", defeated:false}
  ],
  chaosGods: [
    {id:"khorne", name:"恐虐", domain:"杀戮与愤怒", power:8, stage:60},
    {id:"nurgle", name:"纳垢", domain:"瘟疫与腐朽", power:7, stage:60},
    {id:"tzeentch", name:"奸奇", domain:"变化与阴谋", power:9, stage:65},
    {id:"slaanesh", name:"色孽", domain:"欲望与极致", power:6, stage:70}
  ]
};

// ============================================================
// v23 引擎函数
// ============================================================
function sealChainCheck(){
  if(!S.sealChain){
    S.sealChain = {currentSeal:null, fragments:[], revelations:[], choices:[]};
  }
  return S.sealChain;
}

function abyssProgressUpdate(delta){
  if(!S.abyssCountdown){
    S.abyssCountdown = {progress:5, stage:0, messengersDefeated:[], chaosGodsAwakened:[]};
  }
  S.abyssCountdown.progress = Math.max(0, Math.min(100, S.abyssCountdown.progress + delta));
  const st = ABYSS_COUNTDOWN.stages;
  for(let i=st.length-1;i>=0;i--){
    if(S.abyssCountdown.progress >= st[i].threshold){
      S.abyssCountdown.stage = i;
      break;
    }
  }
  return S.abyssCountdown;
}

function getAbyssStageName(){
  if(!S.abyssCountdown) return "潜伏期";
  return ABYSS_COUNTDOWN.stages[S.abyssCountdown.stage]?.name || "潜伏期";
}

function revealSealTruth(sealId, level){
  sealChainCheck();
  const seal = SEVEN_SEALS_CHAIN[sealId];
  if(!seal) return;
  seal.stageRevealed = Math.max(seal.stageRevealed, level);
  if(S.sealChain.revelations.indexOf(sealId+"_"+level) < 0){
    S.sealChain.revelations.push(sealId+"_"+level);
  }
}

// ============================================================
// v23 序章·七印征兆节点
// ============================================================
N["prologue_seal_hint"] = function(){
  sealChainCheck();
  abyssProgressUpdate(0);
  return {
    place: "出身地 · 异变之夜",
    text: function(){
      const arr = [];
      arr.push("那是一个没有月亮的夜晚。");
      arr.push("你被地面的颤动惊醒。不是地震——更像是某种巨大的东西在地下翻身。");
      arr.push("窗外的狗全在叫，叫得嗓子哑了也不停。鸡在笼子里乱飞，牛挣断了缰绳。");
      arr.push("你穿好衣服走到院子里，看到天边有一道极淡的光。不是朝霞，是从地底透上来的、暗红色的光。");
      arr.push("光只持续了几息就灭了。但你闻到了一种气味——铁锈、腐肉、还有某种说不出的、让人想跪下的古老气息。");
      arr.push("邻居们都出来了，没人说话。一个老人在胸口画着光明神的印记，手在抖。");
      arr.push("「地底有东西醒了。」老人说，声音像砂纸磨过木头。「我爷爷说过，铁门关碎的那天，也是这样的光。」");
      arr.push("你与异变之夜作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"追问老人铁门关的事", check:"INT", go:"prologue_seal_fragment", effect:{time:1, flag:"seal_curious"} },
      { t:"回屋继续睡，也许只是错觉", go:"prologue_seal_fragment", effect:{time:1, sanLoss:2} },
      { t:"去镇上找牧师问问", check:"CHA", go:"prologue_seal_fragment", effect:{time:2, flag:"seal_religious"} }
    ]
  };
};

N["prologue_seal_fragment"] = function(){
  return {
    place: "出身地 · 记忆碎片",
    text: function(){
      const arr = [];
      arr.push("那天之后，你开始做一个梦。");
      arr.push("梦里你站在一片废墟上。风很大，吹得脸疼。脚下是碎裂的石板，石板上刻着你不认识的符文——但你莫名觉得自己应该认识。");
      arr.push("废墟中央有一道裂缝，黑得不像影子，像是什么东西把空间咬掉了一块。");
      arr.push("裂缝里传来声音。不是语言，是一种情绪——饥饿。纯粹的、吞噬一切的饥饿。");
      arr.push("你想跑，但脚动不了。裂缝里有什么东西在看你。");
      arr.push("然后你醒了。枕头湿了，不知道是汗还是泪。");
      arr.push("从那天起，你偶尔会在某些古老的建筑里看到同样的符文。每次看到，后脑勺就一阵发麻。");
      arr.push("你不知道这意味着什么。但你知道，这和你将要去的地方有关。");
      arr.push("记忆碎片在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"把这个梦记下来，以后追查", go:"prologue_seal_choice", effect:{flag:"seal_dream_recorded", item:"符文笔记"} },
      { t:"告诉家人，寻求建议", check:"CHA", go:"prologue_seal_choice", effect:{flag:"seal_family_told"} },
      { t:"埋在心里，对谁都不说", go:"prologue_seal_choice", effect:{sanLoss:3, flag:"seal_buried"} }
    ]
  };
};

N["prologue_seal_choice"] = function(){
  return {
    place: "出身地 · 抉择之日",
    text: function(){
      const arr = [];
      arr.push("学院的录取通知到了。");
      arr.push("你收拾行李的时候，那个梦又浮上来——废墟、裂缝、饥饿的注视。");
      arr.push("你不知道学院里有没有人能解答这些。但你知道，留在出身地，你永远不会知道答案。");
      arr.push("母亲在门口站着，没说话。父亲在修一把旧锄头，敲了三下，停了。");
      arr.push("「去吧。」父亲说，没抬头。「地底的东西，总得有人去看看到底是什么。」");
      arr.push("你背上包，走出了村子。身后的门关上了。");
      arr.push("你不知道前方等待你的是什么。但你隐约感觉到，从那个异变之夜开始，你的命运就和那些地底的符文绑在了一起。");
      return arr;
    },
    options: [
      { t:"带着疑问出发，入学后追查七印", go:"fc_jiaohui_entry", effect:{flag:"seal_quest_active", knowledge:5} },
      { t:"先专注学业，符文的事以后再说", go:"fc_jiaohui_entry", effect:{flag:"seal_dormant"} }
    ]
  };
};

// ============================================================
// v23 学院·七印研究节点
// ============================================================
/* /v62inj:chunk-academy/ N["academy_seal_lesson"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_seal_mercury"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_seal_underground"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_seal_research"] 已移入 chunks/v62_academy.js */
// ============================================================
// v23 第一印·铁门关（大陆前期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_1_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_1_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_1_choice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_1_aftermath"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第二印·兽人草原（大陆前期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_2_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_2_choice"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第三印·世界树根（大陆中期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_3_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_3_choice"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第四印·永恒熔炉心（大陆中期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_4_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_4_choice"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第五印·南方深海（大陆中期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_5_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_5_explore"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_5_truth"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_5_choice"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第六印·时光裂隙（大陆后期）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_6_time_rift"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_past_arrival"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_young_huanglingjing"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_truth_reveal"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_paradox_choice"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_6_return"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 第七印·死亡沙漠（终局）
// ============================================================
/* /v62inj:chunk-seal/ N["seal_7_desert"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_7_temple"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_7_primordial"] 已移入 chunks/v62_seal.js */
/* /v62inj:chunk-seal/ N["seal_7_final_choice"] 已移入 chunks/v62_seal.js */
// ============================================================
// v23 七印结局节点
// ============================================================
N["ending_seal_chain"] = function(){
  return {tag:"ending",
    place: "大陆 · 新时代",
    text: function(){
      const arr = [];
      arr.push("你花了三个月走回文明世界。");
      arr.push("一路上，你看到了变化——如果世界重新完整了，人们的表情变得更丰富了，有的在笑，有的在哭，但都比以前「鲜活」。如果世界维持了稳定，一切照旧，但你看世界的眼光不一样了。");
      arr.push("你回到了学院。墨丘利在门口等你。");
      arr.push("「做完了？」他问。");
      arr.push("你点头。");
      arr.push("墨丘利沉默了一会儿，然后说：「守望者知道了。奥雷利安让我告诉你——不管你做了什么选择，守望者会支持你。三千年了，该有人做个了断了。」");
      arr.push("你走进学院。学生们在操场上跑动，笑声传过来。阳光很好。");
      arr.push("你知道，这不是结束。深渊还在，暗蚀会还在，大陆的纷争还在。但七印的故事——三千年的故事——终于有了一个结局。");
      arr.push("而你的故事，才刚刚开始。");
      return arr;
    },
    options: [
      { t:"继续冒险，探索大陆的其他秘密", go:"fc_jiaohui_entry", effect:{flag:"seal_chain_ending_continue"} },
      { t:"回到出身地，看看故乡", go:"fc_jiaohui_entry", effect:{time:15, flag:"seal_chain_ending_home"} }
    ]
  };
};

// ============================================================
// v23 深渊倒计时·征兆事件
// ============================================================
/* /v62inj:chunk-abyss/ N["abyss_omen_nightmare"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_omen_animals"] 已移入 chunks/v62_abyss.js */
/* /v62inj:chunk-abyss/ N["abyss_omen_missing"] 已移入 chunks/v62_abyss.js */
// ============================================================
// v23 七使者BOSS战节点
// ============================================================
N["messenger_fight_hunger"] = function(){
  return {
    place: "铁门关 · 第一使者",
    text: function(){
      const arr = [];
      arr.push("你再次来到铁门关的时候，第一使者已经出来了。");
      arr.push("它不是生物——是一个由「饥饿」构成的人形。没有皮肤，没有肌肉，只有一个轮廓，一个永远张着的嘴。它走过的地方，地面变得贫瘠，草变成了灰。");
      arr.push("它看到了你，然后——笑了。没有嘴唇的笑，但你能感觉到。");
      arr.push("「你就是那个能看到符文的人。」它的声音像是从一个空胃里传出来的。「黄林晶的后门。我等了你很久。」");
      arr.push("「你知道我想要什么吗？」它问。「我想要「一切」。你的力量，你的记忆，你的情感，你的「存在」。给我吧。」");
      arr.push("它向你伸出手。不是攻击——是「邀请」。如果你握住它的手，你会被吞噬。但如果你能让它「满足」……");
      arr.push("你想起了老兽人说的话——饥饿的弱点是「满足」。");
      arr.push("离开第一使者时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"用完整之种的力量让它满足", check:"SPR", go:"messenger_defeated", effect:{flag:"messenger_1_defeated", sanLoss:10}, tier:{crit:function(){return["你拿出完整之种。七种颜色的光照在第一使者身上。它的「嘴」慢慢合上了——不是被封住，是「饱了」。它看着你，然后笑了——这次是真正的笑。「谢谢你。」它说，然后消散了。"]},ok:function(){return["完整之种的光照在它身上。它挣扎了一下，然后——安静了。不是消散，是「睡着了」。它躺在地上，像一个吃饱了的孩子。你知道，它不会再醒来了。"]},fail:function(){return["完整之种的光太弱了。第一使者只是顿了一下，然后继续向你伸手。「不够。」它说。「还不够。」你不得不后退。"]},critfail:function(){return["你拿出完整之种的瞬间，第一使者扑了上来。它不是要握手——它直接开始「吃」。你感觉到自己的意识在被吞噬——记忆、情感、存在。你用尽全力才挣脱。HP大幅下降，SAN值大幅下降。"]}} },
      { t:"战斗，用力量击败它", check:"STR", go:"messenger_defeated", effect:{flag:"messenger_1_fought", hp:-20, sanLoss:15} },
      { t:"逃跑", check:"AGI", go:"fc_jiaohui_entry", effect:{time:1, sanLoss:5, flag:"messenger_1_escaped"} }
    ]
  };
};

N["messenger_defeated"] = function(){
  return {
    place: "战斗结束",
    text: function(){
      const arr = [];
      arr.push("第一使者消散了。");
      arr.push("不是被消灭——是被「满足」了。它在最后一刻，终于体验到了「不饿」的感觉。");
      arr.push("你站在废墟上，喘着气。怀里的完整之种暗了一分——它消耗了能量。");
      arr.push("老兽人不知道什么时候来了。他站在远处，看着你。");
      arr.push("「你做到了。」他说。「三十年来，铁门关第一次没有「饥饿」的气味。」");
      arr.push("你问他其他使者怎么办。");
      arr.push("老兽人摇头：「一个一个来。每一道印碎了，对应的使者就会出来。你已经处理了第一个。还有六个。」");
      arr.push("他递给你一个水袋。「喝点水。路还长。」");
      arr.push("你喝了一口水。水是凉的，但你感觉到了——世界，因为你的行动，稍微变好了一点。");
      arr.push("别过战斗结束，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"继续旅程，寻找下一个使者", go:"fc_jiaohui_entry", effect:{abyssDelta:-5, flag:"messenger_1_complete"} },
      { t:"在铁门关休息几天", go:"fc_jiaohui_entry", effect:{time:3, hp:20, sanRecovery:10} }
    ]
  };
};

// ============================================================
// v23 CSS注入
// ============================================================
const v23_ah_css = document.createElement("style");
v23_ah_css.textContent = `
.seal-glow { color: #ffd700; text-shadow: 0 0 5px rgba(255,215,0,0.5); }
.abyss-text { color: #8b0000; font-style: italic; }
.messenger-name { color: #4b0082; font-weight: bold; }
.time-past { color: #daa520; background: rgba(218,165,32,0.05); padding: 2px 6px; border-radius: 3px; }
`;
document.head.appendChild(v23_ah_css);

console.log("[v23 ah] 七印之链+深渊倒计时系统已加载");


// ============================================================
// v23 黄林晶十二封信数据
// ============================================================
const HLJ_LETTERS = {
  letter_1: {id:"letter_1", title:"第一封·给后来者", unlock:"序章结束后自动显现", tone:"英雄口吻", content:"致读到这封信的人：如果你能看到这些文字，说明你已经能看到符文了。这是天赋，也是诅咒。三千年前，我做了一个选择——切掉世界的七种情感，封印起来。我称它为「拯救」。但也许，它只是「延缓」。你会在旅途中逐渐发现真相。不要急。有些真相，需要时间来消化。——黄林晶"},
  letter_2: {id:"letter_2", title:"第二封·关于学院", unlock:"入学后第一学期末", tone:"前辈口吻", content:"致后来者：你进入学院了。那是我亲手选的地方——建在古代遗迹之上，因为那里有「备份」。墨丘利会教你灵魂魔法。不要怕他——他看起来玩世不恭，实际上是我见过最坚定的人。奥雷利安也会注意到你。不要急着信任他，也不要急着怀疑他。守望者的事，比你想的复杂。——黄林晶"},
  letter_3: {id:"letter_3", title:"第三封·关于七印", unlock:"完成学院七印研究后", tone:"开始动摇", content:"致后来者：你开始研究七印了。很好。官方版本说七印封印深渊——那是我让他们这么说的。真相是，七印分割的是「原初之物」。我切掉了世界的七种情感，它们没有消失，而是融合成了一个有意识的存在。七印在喂养它，不是封印它。我知道这听起来像疯话。但你会明白的。——黄林晶"},
  letter_4: {id:"letter_4", title:"第四封·铁门关", unlock:"到达第一印后", tone:"愧疚", content:"致后来者：你到铁门关了。第一印碎了。那不是兽人的错——是我的错。我建造七印的时候，算错了「饥饿」的成长速度。它比我预想的快了三百年。兽人用命在延缓它的释放。如果你遇到老兽人，替我说声对不起。我欠他们的，下辈子还。——黄林晶"},
  letter_5: {id:"letter_5", title:"第五封·关于选择", unlock:"完成第二印后", tone:"自我怀疑", content:"致后来者：你见过兽人萨满了。她在用命续印。精灵女王用永生续印。矮人用欲望续印。每一道印都有守护者，每一个守护者都在付出代价。我有时候想——我是不是把代价转嫁给了别人？我切掉了世界的情感，但痛苦没有消失，只是转移到了守护者身上。你觉得呢？我做对了吗？——黄林晶"},
  letter_6: {id:"letter_6", title:"第六封·海族", unlock:"到达第五印后", tone:"承认错误", content:"致后来者：你见到海族了。对不起。我流放了他们，因为他们知道得太多。三千年了，他们在海底，活着但不算活着。这是我做过最残忍的事。如果你能解放他们，请去做。不要像我一样，用「更大的善」来掩盖自己的恐惧。——黄林晶"},
  letter_7: {id:"letter_7", title:"第七封·守望者", unlock:"与奥雷利安正式接触后", tone:"复杂", content:"致后来者：守望者是我创立的。初衷是好的——监视七印，在必要的时候采取行动。但三千年了，组织变了。有人想主动出击，有人想只守护。奥雷利安是个好人，但他老了。塞拉芬的事……不要完全相信任何一方的说法。真相在中间，也在两端。守望者该往何处去，也许要由你来决定。——黄林晶"},
  letter_8: {id:"letter_8", title:"第八封·暗蚀会", unlock:"遇到暗蚀会司长后", tone:"警告", content:"致后来者：暗蚀会不是你想的那样。他们崇拜深渊，但他们中的很多人，只是被痛苦逼到了绝境。不要急着杀他们。理解他们，然后——选择。有些暗蚀会成员，可以被救赎。有些不行。你需要自己判断。但记住：不要变成你要消灭的东西。——黄林晶"},
  letter_9: {id:"letter_9", title:"第九封·完整之种", unlock:"到达第六印后", tone:"希望", content:"致后来者：你要去时光裂隙了。在那里，你会见到年轻的我。他会给你「完整之种」。那是我五十年的心血——七种情感的平衡体。如果你能在第七印用它，也许能让世界重新完整，但不会灾难。但我不确定。这只是理论。你愿意试吗？如果你不愿意，我理解。维持七印，也是一种选择。——黄林晶"},
  letter_10: {id:"letter_10", title:"第十封·承认罪", unlock:"完成第六印后", tone:"彻底坦诚", content:"致后来者：我承认。我不是英雄。我是一个做了艰难选择的人，然后用三千年的时间来合理化自己的选择。我切掉了世界的情感，因为我害怕——害怕「情感之灾」再次发生。但也许，还有更好的方法。只是我没有找到。你比我有优势——你能看到所有印的真相，能见到所有守护者。你能做出比我更好的选择。去吧。——黄林晶"},
  letter_11: {id:"letter_11", title:"第十一封·最后的请求", unlock:"到达第七印前", tone:"恳求", content:"致后来者：你要去第七印了。在那里，你会面对最终抉择。我只有一个请求——不管你选什么，不要让「痛苦」白白发生。三千年了，守护者们付出了代价，海族付出了自由，兽人付出了生命。如果你的选择不能让这些付出有意义……至少，记住他们。记住每一个为了世界而牺牲的人。——黄林晶"},
  letter_12: {id:"letter_12", title:"第十二封·终章", unlock:"第七印抉择后", tone:"根据玩家选择变化", content:"致后来者：你做完了选择。不管结果如何，你比我勇敢——我三千年都不敢面对的东西，你面对了。世界会变成什么样，我不知道。但我知道，从今天起，历史不再由我一个人书写。它由你，由所有活着的人，一起书写。谢谢你。——黄林晶（最后的意识）"}
};

// ============================================================
// v23 守望者编年史数据
// ============================================================
const WATCHER_CHRONICLE = {
  history: [
    {era:"创立期", event:"黄林晶创立守望者，最初成员七人，对应七印", schism:false, leader:"黄林晶"},
    {era:"第一次分裂", event:"主动出击派vs只守护派，最终只守护派胜出", schism:true, leader:"初代首席"},
    {era:"塞拉芬事件", event:"执灯人塞拉芬试图解放第一印，被封印在地下图书馆最深层", schism:true, leader:"墨丘利（当时）"},
    {era:"墨丘利离开", event:"墨丘利因塞拉芬事件离开守望者，成为学院教授", schism:false, leader:"奥雷利安"},
    {era:"现在", event:"奥雷利安老了，继承问题浮现，内部分裂迹象", schism:true, leader:"奥雷利安"}
  ],
  ranks: ["候选","执灯人","守护者","首席"],
  factions: ["只守护派","主动出击派","改革派"],
  seraphTruth: "塞拉芬没有疯。她发现了七印的真相，想解放第一印来证明黄林晶错了。但她失败了——不是因为她错了，是因为时机不对。守望者把她封印了，不是因为她是叛徒，是因为她知道得太多。"
};

// ============================================================
// v23 引擎函数
// ============================================================
function letterUnlockCheck(){
  if(!S.hljLetters){
    S.hljLetters = {collected:[], currentLetter:null, interpretations:[]};
  }
  return S.hljLetters;
}

function collectLetter(letterId){
  letterUnlockCheck();
  if(S.hljLetters.collected.indexOf(letterId) < 0){
    S.hljLetters.collected.push(letterId);
    return true;
  }
  return false;
}

function watcherInit(){
  if(!S.watcherChronicle){
    S.watcherChronicle = {rank:null, missions:[], schismSide:null, seraphKnowledge:0, finalChoice:null, observed:false};
  }
  return S.watcherChronicle;
}

// ============================================================
// v23 信件节点
// ============================================================
N["letter_trigger_1"] = function(){
  collectLetter("letter_1");
  return {
    place: "序章结束 · 第一封信",
    text: function(){
      const arr = [];
      arr.push("你在学院门口停下脚步，回头看了一眼出身地的方向。");
      arr.push("然后你感觉到了——怀里有什么东西在发热。");
      arr.push("你掏出来，是一张你从未见过的羊皮纸。它不知道什么时候出现在你的包里——也许是在那个异变之夜，也许更早。");
      arr.push("羊皮纸上有字。墨迹很新，但纸很旧——旧了三千年。");
      arr.push("你展开它，开始读。");
      arr.push("「致读到这封信的人：如果你能看到这些文字，说明你已经能看到符文了……」");
      arr.push("你读完了。风把纸吹得哗哗响，但你抓得很紧。");
      arr.push("黄林晶。三千年前的英雄。他在给你写信。");
      arr.push("你与第一封信作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"把信收好，继续前进", go:"fc_jiaohui_entry", effect:{flag:"letter_1_read", item:"黄林晶第一封信"} },
      { t:"反复读几遍，试图理解更多", check:"INT", go:"fc_jiaohui_entry", effect:{knowledge:5, flag:"letter_1_studied"} }
    ]
  };
};

N["letter_read"] = function(){
  letterUnlockCheck();
  const unread = [];
  for(const lid in HLJ_LETTERS){
    if(S.hljLetters.collected.indexOf(lid) >= 0 && S.hljLetters.interpretations.indexOf(lid) < 0){
      unread.push(lid);
    }
  }
  return {
    place: "信件 · 黄林晶的信",
    text: function(){
      const arr = [];
      if(unread.length === 0){
        arr.push("你整理了一下黄林晶的信。目前没有新的信件。");
        arr.push("你已经收集了 " + S.hljLetters.collected.length + " 封信。");
      } else {
        arr.push("你有 " + unread.length + " 封未读的信。");
        for(const lid of unread){
          const l = HLJ_LETTERS[lid];
          arr.push("【" + l.title + "】" + l.content.substring(0, 50) + "……");
        }
      }
      arr.push("别过黄林晶的信，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"返回", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

// ============================================================
// v23 守望者·序章观察节点
// ============================================================
N["watcher_prologue_observe"] = function(){
  watcherInit();
  return {
    place: "出身地 · 暗处",
    text: function(){
      const arr = [];
      arr.push("你不知道的是，在那个异变之夜，有一个人在暗处看着你。");
      arr.push("他穿着灰色的斗篷，脸藏在兜帽里。他站在村外的一棵树上，从异变开始到结束，一动不动。");
      arr.push("你回屋之后，他从树上跳下来，落地没有声音。他从怀里掏出一个小本子，写了几行字。");
      arr.push("「交汇城方向。能看到符文。第一印征兆反应。建议：观察。」");
      arr.push("他把本子收起来，看了一眼你家的窗户，然后消失在黑暗里。");
      arr.push("守望者。他们已经注意到你了。但你还不知道。");
      arr.push("别过暗处，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"（继续序章）", go:"prologue_seal_hint", effect:{flag:"watcher_observed"} }
    ]
  };
};

// ============================================================
// v23 守望者·学院测试节点
// ============================================================
N["watcher_academy_test"] = function(){
  watcherInit();
  return {
    place: "学院 · 墨丘利的课",
    text: function(){
      const arr = [];
      arr.push("墨丘利的灵魂魔法课在周三下午。教室很小，只有十二个学生。");
      arr.push("今天的内容是「灵魂感知」。墨丘利让每个人闭上眼睛，感受周围的灵魂。");
      arr.push("你闭上眼睛。一开始什么都没有。然后——你感觉到了。");
      arr.push("不是同学的灵魂。是更深处的东西。教室的墙外面，有什么东西在「看」。不是人，是一种……意识。古老的、疲惫的、但仍然锐利的意识。");
      arr.push("你睁开眼，看到墨丘利在看你。他的嘴角挂着那抹似笑非笑的表情。");
      arr.push("「你感觉到了。」他说，不是问句。「很好。下课后来我办公室。」");
      arr.push("下课后，墨丘利的办公室里没有别人。他关上门，给你倒了一杯茶。");
      arr.push("「你感觉到的那个意识，是奥雷利安。」他说。「守望者的首席。他在「看」你——不是用眼睛，是用灵魂。他想知道你是不是「那个人」。」");
      arr.push("「哪个人？」你问。");
      arr.push("墨丘利喝了一口茶。「黄林晶的继承人。或者说——能打开后门的人。」");
      arr.push("出了墨丘利的课，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"问他守望者是什么", go:"watcher_seraph_clue", effect:{knowledge:10, flag:"watcher_academy_meet"} },
      { t:"问他为什么离开守望者", check:"CHA", go:"watcher_seraph_clue", effect:{flag:"mercury_past_asked", mercury_bond:5} },
      { t:"表示不感兴趣，想专心学习", go:"watcher_seraph_clue", effect:{flag:"watcher_rejected_initially"} }
    ]
  };
};

N["watcher_seraph_clue"] = function(){
  return {tag:"branch",
    place: "墨丘利办公室 · 塞拉芬的线索",
    text: function(){
      const arr = [];
      arr.push("墨丘利沉默了一会儿，然后从抽屉里拿出一张照片——不，是一幅画。");
      arr.push("画上是一个女人。年轻，黑头发，眼睛很亮。她在笑，但笑容里有某种……决绝。");
      arr.push("「塞拉芬。」墨丘利说。「我曾经的搭档。守望者的执灯人。三百年前，她被封印了。」");
      arr.push("「官方说法是她疯了，试图解放第一印，差点造成灾难。守望者把她封印在地下图书馆最深层。」");
      arr.push("他看着你。「但我知道真相。她没有疯。她发现了七印的真相——和你现在在查的一样。她想证明黄林晶错了。但她失败了。」");
      arr.push("「为什么告诉我这些？」你问。");
      arr.push("墨丘利把画收起来。「因为你会走到那一步的。你会去查七印，会去查守望者，会去查塞拉芬。到时候，记住——不要完全相信任何一方。奥雷利安是好人，但他有他的立场。塞拉芬是对的，但她的方法太极端。」");
      arr.push("「而你，」他看着你，「也许能找到第三条路。」");
      arr.push("你与塞拉芬的线索作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"问他能不能见到塞拉芬", go:"watcher_aurelian_meet", effect:{flag:"seraph_interest", knowledge:5} },
      { t:"问守望者的内部结构", check:"INT", go:"watcher_aurelian_meet", effect:{knowledge:15} },
      { t:"感谢他的告知，离开", go:"watcher_aurelian_meet", effect:{mercury_bond:5} }
    ]
  };
};

// ============================================================
// v23 守望者·奥雷利安接触节点
// ============================================================
N["watcher_aurelian_meet"] = function(){
  watcherInit();
  return {
    place: "学院天台 · 黄昏",
    text: function(){
      const arr = [];
      arr.push("你是在学院天台找到他的。");
      arr.push("奥雷利安。半神。守望者首席。三千年的活着的传奇。");
      arr.push("他看起来像一个普通的老人——白头发，白胡子，穿着一件洗得发白的灰色长袍。他靠在天台的栏杆上，看着远方的夕阳。");
      arr.push("「你来了。」他说，没有回头。「墨丘利跟我说了你。能看到符文的人。」");
      arr.push("你走到他旁边。他比你想象的矮——但你靠近他的时候，感觉到了一股压力。不是物理上的，是「存在」上的。他的存在本身，就让周围的空间变得……厚重。");
      arr.push("「我观察你很久了。」奥雷利安说。「从那个异变之夜开始。你有天赋，也有……疑问。这很好。没有疑问的人，不适合做守望者。」");
      arr.push("「守望者是什么？」你问。");
      arr.push("奥雷利安终于转过头看你。他的眼睛是灰色的，像阴天的海。「守望者是黄林晶创立的组织。监视七印，在必要的时候采取行动。三千年了，我们一直在暗处。」");
      arr.push("「现在，我给你一个选择。」他说。「加入守望者——作为候选。你会获得资源、知识、保护。但你也要承担责任——在世界需要的时候，站出来。」");
      arr.push("你收拾停当，离开黄昏，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"接受邀请，加入守望者", go:"watcher_invitation", effect:{flag:"watcher_joined", item:"守望者徽章", knowledge:20} },
      { t:"拒绝，但表示愿意保持联系", go:"watcher_invitation", effect:{flag:"watcher_ally", karma:"freedom"} },
      { t:"问更多关于守望者的事再决定", check:"INT", go:"watcher_invitation", effect:{knowledge:15} }
    ]
  };
};

N["watcher_invitation"] = function(){
  return {
    place: "学院天台 · 抉择",
    text: function(){
      const arr = [];
      arr.push("奥雷利安听完你的回答，点了点头。");
      if(S.flags.watcher_joined){
        arr.push("「欢迎。」他说，从怀里掏出一个徽章——银色的，上面刻着一只眼睛和七颗星。「这是守望者的徽章。戴上它，你就能看到我们留下的记号——在大陆各处，都有守望者的安全屋和情报点。」");
        arr.push("你接过徽章。它很凉，像铁。但你握住它的时候，感觉到了一丝温暖——像是有很多人，在很远的地方，和你站在一起。");
      } else if(S.flags.watcher_ally){
        arr.push("「理解。」他说。「守望者不强迫任何人。但如果你需要帮助——在任何城市，找一只刻着眼睛和七颗星的记号。那是我们的人。」");
        arr.push("他从怀里掏出一个小令牌，递给你。「拿着这个。在你需要的时候，它会帮你找到我们。」");
      } else {
        arr.push("「没关系。」他说。「不是每个人都适合走这条路。但你要记住——不管你选什么，七印的事，最终需要有人来面对。到时候，也许我们会再见面。」");
      }
      arr.push("奥雷利安转过身，继续看夕阳。");
      arr.push("「去吧。」他说。「你的路还长。守望者的事，不急。」");
      arr.push("你走下天台的时候，太阳刚好落下去。天台上只剩下奥雷利安一个人，和三千年的孤独。");
      arr.push("离开抉择时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续学院生活", go:"fc_jiaohui_entry", effect:{time:1} },
      { t:"去图书馆查守望者的资料", go:"fc_jiaohui_entry", effect:{time:2, knowledge:10} }
    ]
  };
};

// ============================================================
// v23 守望者·内部分裂节点
// ============================================================
N["watcher_schism"] = function(){
  watcherInit();
  return {
    place: "守望者安全屋 · 深夜",
    text: function(){
      const arr = [];
      arr.push("你是在一个深夜被带到安全屋的。");
      arr.push("安全屋在交汇城的地下，入口是一家裁缝店的试衣间。里面很大——有图书馆、训练室、宿舍，还有一个巨大的圆桌会议室。");
      arr.push("圆桌上坐着七个人。奥雷利安在主位。其他六个人，你都不认识——但你能感觉到，他们都很强。至少是大宗师级别。");
      arr.push("「人到齐了。」奥雷利安说。「今天的议题——守望者的未来。」");
      arr.push("一个粗壮的男人站起来。你后来知道他叫「铁拳」，主动出击派的领袖。「三千年了！我们一直在等，一直在看！七印一道一道在碎，深渊一天一天在逼近！我们还要等到什么时候？」");
      arr.push("一个瘦削的女人反驳。她叫「静」，只守护派的领袖。「主动出击？怎么出击？进攻深渊？我们连七印的真相都没完全搞清楚！冲动只会让事情更糟！」");
      arr.push("争论开始了。两派各执一词，声音越来越大。奥雷利安没有阻止——他只是看着，眼神疲惫。");
      arr.push("然后，所有人都看向了你。");
      arr.push("「你是能看到符文的人。」铁拳说。「你说——我们该怎么办？」");
      arr.push("深夜在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"支持主动出击派", go:"watcher_seraph_truth", effect:{flag:"watcher_schism_active", rep_active:10, rep_guardian:-10} },
      { t:"支持只守护派", go:"watcher_seraph_truth", effect:{flag:"watcher_schism_guardian", rep_guardian:10, rep_active:-10} },
      { t:"提出第三条路——改革守望者", check:"CHA", go:"watcher_seraph_truth", effect:{flag:"watcher_schism_reform", karma:"wisdom"}, tier:{crit:function(){return["你说了你的想法——不是出击，也不是等待，而是「理解」。先搞清楚七印的真相，再决定怎么做。会议室安静了。然后，两个人开始点头。接着是三个、四个。奥雷利安看着你，眼里有什么东西在闪——也许是希望。"]},ok:function(){return["你说了你的想法。有人点头，有人摇头。但至少，争论停了。奥雷利安说：「这个年轻人说得有道理。我们先调查，再行动。」"]},fail:function(){return["你说了，但没人听。争论继续。铁拳拍了桌子，静摔了门。会议不欢而散。奥雷利安对你苦笑：「习惯就好。三千年了，一直这样。」"]},critfail:function(){return["你说错了话——也许是提到了某个禁忌，也许是踩了某个人的痛处。会议室瞬间炸了锅。两个人差点打起来。奥雷利安不得不动用半神的力量才压制住。会后，有人看你的眼神充满了敌意。"]}} },
      { t:"不表态，先观察", go:"watcher_seraph_truth", effect:{flag:"watcher_schism_observer", knowledge:5} }
    ]
  };
};

// ============================================================
// v23 守望者·塞拉芬真相节点
// ============================================================
N["watcher_seraph_truth"] = function(){
  watcherInit();
  return {
    place: "地下图书馆 · 最深层",
    text: function(){
      const arr = [];
      arr.push("奥雷利安带你去了地下图书馆最深层。");
      arr.push("你走了很久——向下，向下，再向下。台阶是石头的，墙壁上刻满了符文。越往下，空气越冷，越安静。");
      arr.push("最深层是一个圆形的房间。房间中央，有一个水晶棺。棺里躺着一个女人——和墨丘利画上的一模一样。塞拉芬。");
      arr.push("她在「睡觉」。不是死亡，不是昏迷——是被封印了。她的胸口有一道光，在缓慢地跳动，像心跳。");
      arr.push("「三百年了。」奥雷利安站在水晶棺旁，声音很低。「她试图解放第一印。我们阻止了她。然后……把她封在了这里。」");
      arr.push("「官方说法是她疯了。但真相是——她是对的。」");
      arr.push("你愣住了。");
      arr.push("「她发现了七印的真相。」奥雷利安说。「和你现在发现的一样。她想证明黄林晶错了，想找到更好的方法。但她太急了——她想直接解放第一印，看看会发生什么。」");
      arr.push("「我们阻止她，不是因为她错了，是因为时机不对。那时候，世界还没有准备好。如果第一印在那个时候解放，会造成灾难。」");
      arr.push("「但现在……」奥雷利安看着你。「也许时机到了。也许，你能完成她没完成的事。」");
      arr.push("最深层的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"问能不能唤醒塞拉芬", check:"SPR", go:"watcher_origin_truth", effect:{flag:"seraph_wake_attempt", sanLoss:10}, tier:{crit:function(){return["你把手放在水晶棺上，灵魂感知延伸进去。你感觉到了——塞拉芬的意识还在，在很深的地方。她在「做梦」。你试着呼唤她。她的手指动了一下。奥雷利安瞪大了眼睛——三百年了，第一次。"]},ok:function(){return["你感知到了塞拉芬的意识——模糊的、遥远的，但确实存在。她在「等」。等什么？你说不上来。但你知道，她没有放弃。"]},fail:function(){return["你的感知被弹了回来。封印太强了。奥雷利安摇头：「三百年的封印，不是那么容易解开的。也许……需要更强大的力量。」"]},critfail:function(){return["你试图感知塞拉芬，然后——她的意识「看」了你一眼。不是恶意，是……审视。你感觉到了三百年的孤独、愤怒、和不甘。你跪在地上，意识几乎被淹没。奥雷利安把你拉开了。「不要急。」他说。「她还没准备好见人。」"]}} },
      { t:"问守望者创立的真实原因", go:"watcher_origin_truth", effect:{knowledge:20} },
      { t:"离开，需要时间消化", go:"watcher_origin_truth", effect:{sanRecovery:5} }
    ]
  };
};

// ============================================================
// v23 守望者·创立真相节点
// ============================================================
N["watcher_origin_truth"] = function(){
  return {
    place: "地下图书馆 · 历史室",
    text: function(){
      const arr = [];
      arr.push("奥雷利安带你去了历史室。");
      arr.push("历史室的墙上挂着一幅长卷——守望者三千年的历史。你一幅一幅看过去：");
      arr.push("创立期：黄林晶和七个最初的成员，站在七印的地图前。");
      arr.push("第一次分裂：两拨人背对背，中间是一道裂痕。");
      arr.push("塞拉芬事件：一个女人被封印，周围的人在争论。");
      arr.push("墨丘利离开：一个背影，走向远方。");
      arr.push("现在：奥雷利安一个人，站在空荡的会议室里。");
      arr.push("「守望者不是为了「守护」创立的。」奥雷利安说。「至少，最初不是。」");
      arr.push("你看向他。");
      arr.push("「黄林晶创立守望者，是因为他知道自己的方法有缺陷。他需要有人——在他死后——继续观察七印，在必要的时候，「修正」他的错误。」");
      arr.push("「但三千年了，守望者变了。最初的使命被遗忘了，变成了「守护七印」——守护一个可能根本就是错的东西。」");
      arr.push("奥雷利安看着长卷的最后一幅——他自己，孤独地站着。");
      arr.push("「我老了。」他说。「守望者需要新的方向。也许……那个方向，要由你来定。」");
      arr.push("别过历史室，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"问他希望守望者变成什么样", go:"watcher_final_choice", effect:{knowledge:10} },
      { t:"问墨丘利为什么离开", check:"CHA", go:"watcher_final_choice", effect:{flag:"mercury_reason_learned", mercury_bond:5} },
      { t:"表示愿意承担这个责任", go:"watcher_final_choice", effect:{flag:"watcher_responsibility_accepted", karma:"duty"} }
    ]
  };
};

// ============================================================
// v23 守望者·最终抉择节点
// ============================================================
N["watcher_final_choice"] = function(){
  watcherInit();
  return {
    place: "守望者总部 · 最终会议",
    text: function(){
      const arr = [];
      arr.push("终局之前，奥雷利安召集了最后一次会议。");
      arr.push("还是那个圆桌，还是那七个人——但这一次，气氛不同了。深渊在逼近，七印在碎裂，所有人都知道——这是最后的机会。");
      arr.push("奥雷利安站起来。他的背比你第一次见他时更驼了，但他的眼睛还是亮的。");
      arr.push("「三千年了。」他说。「守望者一直在等。等一个能做出选择的人。现在，那个人来了。」");
      arr.push("所有人都看向你。");
      arr.push("「守望者的未来，由你决定。」奥雷利安说。「三个选择——」");
      arr.push("「第一，继承守望者。你成为新的首席，带领守望者继续监视七印，维护世界的稳定。」");
      arr.push("「第二，改革守望者。改变组织的方向——从「守护」变成「理解」。主动调查七印的真相，寻找更好的解决方案。」");
      arr.push("「第三，解散守望者。三千年了，也许这个组织已经完成了它的使命。让每个人自由选择自己的道路。」");
      arr.push("「你选哪个？」");
      arr.push("你与最终会议作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"继承守望者，成为新首席", go:"ending_watcher", effect:{flag:"watcher_inherit", item:"守望者首席之位", rep_watcher:50} },
      { t:"改革守望者，改变方向", go:"ending_watcher", effect:{flag:"watcher_reform", karma:"wisdom", rep_watcher:30} },
      { t:"解散守望者，让每个人自由", go:"ending_watcher", effect:{flag:"watcher_dissolve", karma:"freedom", rep_watcher:-20} }
    ]
  };
};

N["ending_watcher"] = function(){
  return {tag:"ending",
    place: "守望者 · 结局",
    text: function(){
      const arr = [];
      if(S.flags.watcher_inherit){
        arr.push("你接过了奥雷利安的位置。");
        arr.push("仪式很简单——他把首席的徽章别在你胸前，然后拥抱了你。「三千年了。」他说。「终于，有人接过去了。」");
        arr.push("你成为了守望者的新首席。圆桌会议室里，七个人向你鞠躬。从今天起，你将带领守望者，继续监视七印，维护世界的稳定。");
        arr.push("奥雷利安退休了。他搬到了学院附近的一个小房子里，每天晒太阳、种花、和墨丘利吵架。三千年的重担，终于放下了。");
      } else if(S.flags.watcher_reform){
        arr.push("你宣布了守望者的改革。");
        arr.push("从「守护」到「理解」——这个转变不容易。有人支持，有人反对，有人离开了。但核心成员留了下来。");
        arr.push("守望者开始主动调查七印的真相，和各大学院、各大势力合作。不再是暗处的观察者，而是光明的探索者。");
        arr.push("奥雷利安看着新的守望者，笑了。「这才是黄林晶真正想要的。」他说。");
      } else {
        arr.push("你宣布解散守望者。");
        arr.push("会议室里很安静。然后，铁拳站起来，把徽章放在桌上，走了。静也走了。一个接一个，所有人都离开了。");
        arr.push("奥雷利安最后一个走。他把首席的徽章放在圆桌上，然后看了你一眼。「三千年了。」他说。「也许，是时候结束了。」");
        arr.push("守望者不存在了。但每个前守望者，都在以自己的方式，继续守护这个世界。");
      }
      arr.push("不管你选了什么，你知道——守望者的故事结束了，但你的故事，还在继续。");
      arr.push("你离了结局，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"继续你的旅程", go:"fc_jiaohui_entry", effect:{flag:"watcher_ending_complete"} }
    ]
  };
};

// ============================================================
// v23 奥雷利安回忆片段（可扩展）
// ============================================================
N["aurelian_memory_1"] = function(){
  return {
    place: "回忆 · 三千年前",
    text: function(){
      const arr = [];
      arr.push("奥雷利安给你讲了一个故事。");
      arr.push("「三千年前，我还年轻。那时候，世界的情感是完整的——人们会因为一朵花开而哭一整天，会因为一首歌而打架，会因为一个眼神而自杀。」");
      arr.push("「黄林晶找到我的时候，我刚失去了妻子——她死于「情感之灾」，因为无法承受极致的悲痛，绝食而死。」");
      arr.push("「他对我说：「跟我走。我要让这种事不再发生。」我跟他走了。」");
      arr.push("「我们花了五十年，研究出了七印的方法。切掉七种情感，封印起来。世界变得……安静了。人们不再因为情感而死。但也不再因为情感而活。」");
      arr.push("「有时候我想——我妻子如果活在现在这个世界，她不会死。但她也不会那样热烈地爱过我。」");
      arr.push("奥雷利安看着远方。「你说，哪个更好？」");
      return arr;
    },
    options: [
      { t:"说现在更好，至少人活着", go:"fc_jiaohui_entry", effect:{flag:"aurelian_debate_stability"} },
      { t:"说过去更好，至少情感完整", go:"fc_jiaohui_entry", effect:{flag:"aurelian_debate_wholeness"} },
      { t:"说不知道，但必须找到第三条路", go:"fc_jiaohui_entry", effect:{flag:"aurelian_debate_thirdway", aurelian_bond:10} }
    ]
  };
};

console.log("[v23 ai] 黄林晶十二封信+守望者灯火系统已加载");


// ============================================================
// v23 暗蚀会五张面孔数据
// ============================================================
const ECLIPSE_FACES = {
  intel: {id:"intel", name:"情报司司长·夜莺", dept:"情报司", backstory:"曾经是教会的修女，因为发现教会高层的腐败而被追杀。暗蚀会救了她，她从此相信——只有推翻旧秩序，世界才有救。", motive:"揭露真相，摧毁虚伪的秩序", relationship:null, fate:null},
  action: {id:"action", name:"行动司司长·铁拳", dept:"行动司", backstory:"兽人，部落被人类屠村时他不在场。回来后只看到灰烬。他加入暗蚀会，是为了让人类也尝尝失去一切的滋味。", motive:"复仇，但内心深处渴望和平", relationship:null, fate:null},
  research: {id:"research", name:"研究司司长·白骨", dept:"研究司", backstory:"曾经是学院的天才教授，因为研究灵魂魔法被教会开除。他加入暗蚀会，是为了不受限制地研究「禁忌知识」。", motive:"追求知识的极限，不惜一切代价", relationship:null, fate:null},
  hr: {id:"hr", name:"人事司司长·蛇母", dept:"人事司", backstory:"曾经是奴隶贩子的女儿，从小见惯了人性的黑暗。她相信人都是可以被「塑造」的——只要找到正确的痛点。", motive:"证明人性可以被改造，建立一个「更好」的世界", relationship:null, fate:null},
  finance: {id:"finance", name:"财务司司长·金秤", dept:"财务司", backstory:"曾经是美第奇家族的旁支，因为家族内斗被排挤。他加入暗蚀会，是为了证明自己比那些「正统」的美第奇更强。", motive:"证明自己的价值，报复美第奇家族", relationship:null, fate:null}
};

// ============================================================
// v23 引擎函数
// ============================================================
function eclipseFacesInit(){
  if(!S.eclipseFaces){
    S.eclipseFaces = {met:[], relationships:{}, redeemed:[], killed:[]};
  }
  return S.eclipseFaces;
}

function meetEclipseFace(faceId){
  eclipseFacesInit();
  if(S.eclipseFaces.met.indexOf(faceId) < 0){
    S.eclipseFaces.met.push(faceId);
  }
}

// ============================================================
// v23 序章·暗蚀会外围成员
// ============================================================
N["eclipse_prologue_encounter"] = function(){
  eclipseFacesInit();
  return {
    place: "出身地 · 集市",
    text: function(){
      const arr = [];
      arr.push("你在集市上遇到了一个商人。");
      arr.push("他卖的是「护身符」——手工做的，很粗糙，但上面刻着你不认识的符文。和你梦里的符文，有几分相似。");
      arr.push("「年轻人，要一个吗？」商人笑着说。他的笑容很热情，但眼睛在打量你——不是看你有没有钱，是看你「有没有什么特别的」。");
      arr.push("你问他护身符上的符文是什么意思。");
      arr.push("商人的笑容顿了一下。「你能看到符文？」他压轻声音。「跟我来。我有话跟你说。」");
      arr.push("他带你走到集市后面的小巷。确认没人之后，他从怀里掏出一个徽章——黑色的，上面刻着一只眼睛和一个倒十字。");
      arr.push("「我是暗蚀会的人。」他说。「我们在找能看到符文的人。你愿意听我们说说话吗？」");
      arr.push("你不知道暗蚀会是什么。但你注意到，商人的手在抖——不是因为紧张，是因为……兴奋。");
      arr.push("出了集市，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"听他说说暗蚀会", go:"eclipse_prologue_pitch", effect:{flag:"eclipse_prologue_listened"} },
      { t:"拒绝，离开", check:"AGI", go:"prologue_seal_hint", effect:{flag:"eclipse_prologue_refused"} },
      { t:"问他为什么找能看到符文的人", check:"INT", go:"eclipse_prologue_pitch", effect:{knowledge:5} }
    ]
  };
};

N["eclipse_prologue_pitch"] = function(){
  return {
    place: "出身地 · 小巷",
    text: function(){
      const arr = [];
      arr.push("商人给你讲了暗蚀会的「版本」。");
      arr.push("「这个世界是假的。」他说。「教会说七印封印深渊，那是谎言。七印封印的是「真相」——黄林晶切掉了世界的情感，把我们都变成了半死不活的人。」");
      arr.push("「暗蚀会的目标，是解放七印，让世界重新完整。我们不是坏人——我们是觉醒者。」");
      arr.push("他说得很激动，唾沫星子都飞出来了。你注意到，他的话里有一半是真的——关于七印的部分，和你梦到的、查到的，对得上。但另一半……「解放七印」真的是好事吗？");
      arr.push("「怎么样？」商人看着你，眼睛发亮。「加入我们？」");
      arr.push("你还没回答，远处传来了脚步声——是教会的审判骑士。商人脸色一变，把徽章塞回怀里。");
      arr.push("「记住我的话。」他轻声说，然后翻墙跑了。");
      arr.push("审判骑士走过来，问你有没有看到一个可疑的商人。你摇头。骑士看了你一眼，走了。");
      arr.push("你站在小巷里，手里还攥着商人塞给你的一个护身符。上面的符文，在发烫。");
      arr.push("你收拾停当，离开小巷，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"保留护身符，以后再调查", go:"prologue_seal_hint", effect:{item:"暗蚀会护身符", flag:"eclipse_prologue_kept"} },
      { t:"扔掉护身符，不想和暗蚀会扯上关系", go:"prologue_seal_hint", effect:{flag:"eclipse_prologue_discarded"} },
      { t:"把护身符交给教会", go:"prologue_seal_hint", effect:{rep_church:5, flag:"eclipse_prologue_reported"} }
    ]
  };
};

// ============================================================
// v23 情报司司长·夜莺
// ============================================================
N["eclipse_face_intel_intro"] = function(){
  meetEclipseFace("intel");
  return {
    place: "交汇城 · 茶馆",
    text: function(){
      const arr = [];
      arr.push("你是在茶馆里遇到她的。");
      arr.push("她坐在角落，穿着普通的布裙，看起来像一个普通的主妇。但你注意到——她的茶杯从来没动过，她的眼睛在观察每一个进出的人。");
      arr.push("你走过去，坐下。她看了你一眼，然后笑了。");
      arr.push("「你比我想的年轻。」她说，声音很轻。「能看到符文的人，我以为会更……沧桑。」");
      arr.push("「你是谁？」你问。");
      arr.push("「夜莺。」她说。「暗蚀会情报司司长。」");
      arr.push("你下意识地紧张起来。但夜莺只是端起茶杯——这次她真的喝了一口。");
      arr.push("「别紧张。我不是来杀你的。我是来……谈合作的。」她放下茶杯。「你在查七印的事，对吧？我也是。我们有共同的目标——知道真相。」");
      arr.push("「暗蚀会不是要解放七印吗？」你问。");
      arr.push("夜莺的笑容淡了。「那是「官方」说法。我个人的目标，只是真相。教会撒了三千年的谎，我要让所有人知道。至于解放七印之后会怎样……我也不知道。但至少，我们应该知道自己在做什么选择。」");
      arr.push("茶馆的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"同意交换情报", go:"eclipse_face_intel_backstory", effect:{flag:"intel_cooperation", knowledge:10} },
      { t:"拒绝，不想和暗蚀会合作", go:"eclipse_face_intel_confrontation", effect:{flag:"intel_refused"} },
      { t:"问她为什么加入暗蚀会", check:"CHA", go:"eclipse_face_intel_backstory", effect:{flag:"intel_origin_asked"} }
    ]
  };
};

N["eclipse_face_intel_backstory"] = function(){
  return {
    place: "茶馆 · 夜莺的故事",
    text: function(){
      const arr = [];
      arr.push("夜莺给你讲了她的故事。");
      arr.push("「我曾经是教会的修女。在圣城的大教堂，唱诗、祈祷、服侍神明。我信了二十年。」");
      arr.push("「然后我发现了——教会高层的秘密。他们知道七印的真相。他们知道「深渊」是谎言。但他们不说——因为真相会动摇教会的根基。」");
      arr.push("「我试图揭发。然后，我被定为「异端」。审判骑士烧了我的修道院，我的姐妹们……」她的声音顿了一下。「都死了。只有我逃了出来。」");
      arr.push("「暗蚀会救了我。他们给我庇护，给我资源，给我复仇的机会。但我不是为了复仇——我是为了真相。」");
      arr.push("她看着你。「你知道吗？教会的净化令，表面上是清除异端，实际上是清除「知道太多的人」。每一个被烧死的「异端」，都是可能发现真相的人。」");
      arr.push("你沉默了。");
      arr.push("「我不是要你加入暗蚀会。」夜莺说。「我只是要你——在查真相的时候，小心教会。他们不是你以为的那样。」");
      arr.push("夜莺的故事的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"问她有什么情报可以交换", check:"INT", go:"eclipse_face_intel_confrontation", effect:{knowledge:15, flag:"intel_intel_exchanged"} },
      { t:"表示理解她的痛苦", go:"eclipse_face_intel_confrontation", effect:{flag:"intel_empathy", intel_bond:10} },
      { t:"指出暗蚀会也在杀人", go:"eclipse_face_intel_confrontation", effect:{flag:"intel_challenged", karma:"justice"} }
    ]
  };
};

N["eclipse_face_intel_confrontation"] = function(){
  return {
    place: "茶馆 · 对峙",
    text: function(){
      const arr = [];
      arr.push("你和夜莺的对话，被打断了。");
      arr.push("茶馆的门被踢开。三个审判骑士冲进来，领头的那个指着夜莺：「异端！抓住她！」");
      arr.push("夜莺没有慌。她看了你一眼，然后——笑了。");
      arr.push("「看来我的身份暴露了。」她说，站起来。「年轻人，选择吧——帮我，还是帮他们？」");
      arr.push("审判骑士看向你。「你是什么人？和这个异端是什么关系？」");
      arr.push("你看了看夜莺——她很平静，但手已经放在了腰间的短刀上。你又看了看审判骑士——他们的手在剑柄上，眼睛里没有任何犹豫。");
      arr.push("你知道，你的选择会决定很多事。");
      arr.push("你离了对峙，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"帮夜莺逃跑", check:"AGI", go:"eclipse_face_intel_choice", effect:{flag:"intel_helped_escape", rep_church:-20, intel_bond:20}, tier:{crit:function(){return["你抓起桌上的茶壶，砸向领头的骑士。趁着他躲闪的瞬间，你和夜莺翻窗而出。她带你穿过三条小巷，甩掉了追兵。「谢了。」她说，嘴角带着笑。「你比我想的勇敢。」"]},ok:function(){return["你制造了一个小混乱——打翻了桌子，挡住了骑士的路。夜莺趁机跑了。你被骑士盘问了几句，但没有证据，他们放了你。夜莺安全了。"]},fail:function(){return["你想帮夜莺，但动作太慢了。骑士抓住了她。她被带走的时候，回头看了你一眼——不是怨恨，是……理解。「没关系。」她的口型说。「我自己能处理。」"]},critfail:function(){return["你帮夜莺的动作太大了——不仅没帮她跑掉，还把自己搭了进去。骑士把你们两个都抓了。夜莺在监狱里对你说：「你不该帮我的。」但她的眼里，有感激。"]}} },
      { t:"帮审判骑士抓住夜莺", check:"STR", go:"eclipse_face_intel_choice", effect:{flag:"intel_captured", rep_church:20, intel_bond:-30} },
      { t:"中立，不介入", go:"eclipse_face_intel_choice", effect:{flag:"intel_neutral", karma:"caution"} }
    ]
  };
};

N["eclipse_face_intel_choice"] = function(){
  return {
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.intel_helped_escape){
        arr.push("夜莺安全了。");
        arr.push("她在安全屋里给你倒了一杯酒。「从今天起，你是我的朋友。」她说。「情报司的所有资源，对你开放。」");
        arr.push("她给了你一个暗号——在任何城市的茶馆，点一杯「不加糖的红茶」，就会有情报司的人来找你。");
      } else if(S.flags.intel_captured){
        arr.push("夜莺被关进了教会的监狱。");
        arr.push("你去看过她一次。她隔着铁栏看你，笑了。「没关系。」她说。「我在监狱里，也能查到很多东西。」");
        arr.push("你不知道她是在安慰你，还是真的不在乎。但你注意到，她的眼睛里，没有恨。");
      } else {
        arr.push("你离开了茶馆。");
        arr.push("身后传来打斗的声音，然后是马蹄声——骑士把夜莺带走了。你没有回头。");
        arr.push("那天晚上，你在旅馆里，听到有人敲窗。你打开窗，窗台上放着一张纸条，上面写着：「我不怪你。——夜莺」");
      }
      arr.push("不管你选了什么，你知道——你和暗蚀会的故事，才刚刚开始。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 行动司司长·铁拳
// ============================================================
N["eclipse_face_action_intro"] = function(){
  meetEclipseFace("action");
  return {
    place: "铁门关附近 · 营地",
    text: function(){
      const arr = [];
      arr.push("你在铁门关附近的一个营地，遇到了他。");
      arr.push("他是一个兽人——很高，很壮，左臂是金属的。他坐在篝火旁，在磨一把斧头。斧头很大，比你的人还宽。");
      arr.push("他看到你，停了下来。「人类。」他说，声音像两块石头在撞。「你来铁门关做什么？」");
      arr.push("你说了你的目的——调查七印。");
      arr.push("兽人沉默了一会儿。「七印。」他重复了一遍。「我叫铁拳。暗蚀会行动司司长。」");
      arr.push("你紧张起来。但铁拳只是继续磨他的斧头。");
      arr.push("「别担心。」他说。「我不杀无辜的人。我只杀——该杀的人。」");
      arr.push("「该杀的人？」你问。");
      arr.push("铁拳停下了动作，看着篝火。「三十年前，人类的「净化军」屠了我的部落。我的妻子，我的孩子，我的父母——都在里面。我那天出去打猎，逃过了一劫。」");
      arr.push("「我加入暗蚀会，是为了复仇。但三十年了……我杀了很多人。可我的家人，回不来了。」");
      arr.push("从营地出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"表达同情", go:"eclipse_face_action_backstory", effect:{flag:"action_empathy", action_bond:10} },
      { t:"问他净化军是什么", check:"INT", go:"eclipse_face_action_backstory", effect:{knowledge:15} },
      { t:"保持警惕，准备战斗", go:"eclipse_face_action_backstory", effect:{flag:"action_guarded"} }
    ]
  };
};

N["eclipse_face_action_backstory"] = function(){
  return {
    place: "篝火旁 · 铁拳的故事",
    text: function(){
      const arr = [];
      arr.push("铁拳给你讲了他的故事。");
      arr.push("「净化军是教会的秘密部队。表面上是清除异端，实际上——他们在进行「种族净化」。兽人、精灵、矮人，只要不在教会的控制之下，都是「异端」。」");
      arr.push("「我的部落住在铁门关附近。我们没有招惹任何人。但净化军来了——他们说我们是「深渊的走狗」，因为我们在守护第二印。」");
      arr.push("「他们烧了我们的帐篷，杀了我们的人。我的妻子抱着孩子跑，被一个骑士从背后刺穿了。」铁拳的声音在发抖。「我回来的时候，只看到灰烬。和我妻子的发簪——她一直戴着的那个。」");
      arr.push("他从怀里掏出一个发簪——木制的，很粗糙，但被磨得很光滑。三十年了，他一直带在身上。");
      arr.push("「我加入暗蚀会，是因为他们说——能帮我复仇。他们给我武器，给我情报，给我目标。我杀了很多净化军的人。但……」");
      arr.push("他看着自己的金属左臂。「这只手，是在一次暗杀中失去的。暗蚀会给我装了这个。他们说——这是「进化」。但我知道，我只是他们的武器。」");
      arr.push("「年轻人，你说——复仇有意义吗？三十年了，我还是不快乐。」");
      arr.push("你收拾停当，离开铁拳的故事，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"说复仇没有意义，放下吧", go:"eclipse_face_action_confrontation", effect:{flag:"action_peace_advice", karma:"compassion"} },
      { t:"说复仇有意义，至少让你活到现在", go:"eclipse_face_action_confrontation", effect:{flag:"action_revenge_validated", action_bond:5} },
      { t:"说不知道，但你可以选择不继续杀人", go:"eclipse_face_action_confrontation", effect:{flag:"action_third_way", action_bond:10} }
    ]
  };
};

N["eclipse_face_action_confrontation"] = function(){
  return {
    place: "营地 · 黎明",
    text: function(){
      const arr = [];
      arr.push("你们聊了一整夜。");
      arr.push("天亮的时候，铁拳站起来，把斧头扛在肩上。");
      arr.push("「谢谢你听我说话。」他说。「三十年了，第一次有人愿意听。」");
      arr.push("他从怀里掏出那个发簪，看了很久，然后——埋在了篝火旁的土里。");
      arr.push("「我妻子一直喜欢花。」他说。「这里虽然没有花，但至少……安静。」");
      arr.push("他转向你。「我要走了。暗蚀会给了我一个任务——暗杀一个教会的红衣主教。我以前会毫不犹豫地去。但现在……」");
      arr.push("他顿了顿。「我想了一夜。也许，是时候停下来了。」");
      arr.push("「你要退出暗蚀会？」你问。");
      arr.push("铁拳摇头。「没那么容易。暗蚀会不会让我走的。但至少——这次任务，我会「失败」。让那个主教活着。」");
      arr.push("他拍了拍你的肩，力气大得让你踉跄。「再见了，年轻人。如果我们再见面——希望不是在战场上。」");
      arr.push("黎明的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"祝他好运", go:"eclipse_face_action_fate", effect:{flag:"action_redemption_seed", action_bond:15} },
      { t:"邀请他一起走", check:"CHA", go:"eclipse_face_action_fate", effect:{flag:"action_invited", action_bond:20}, tier:{crit:function(){return["铁拳看着你，然后——笑了。不是苦笑，是真正的笑。「好。」他说。「三十年了，第一次有人邀请我「一起走」。我跟你走。」他把斧头扔在了篝火里——金属在火中融化，像他三十年的仇恨。"]},ok:function(){return["铁拳想了想，然后摇头。「我不能跟你走。暗蚀会会追杀我，也会追杀你。但你的好意，我记住了。」他转身走了，背影在晨光中显得很孤独，但也很……轻松。"]},fail:function(){return["铁拳摇头。「我这种人，不配和你一起走。」他转身走了，没有回头。你站在原地，看着他的背影消失在远方。"]},critfail:function(){return["你的邀请让铁拳很激动——但也让他想起了一些不好的事。「不要可怜我。」他突然变得凶狠。「我不需要你的施舍。」他推开你，走了。你不知道他会不会回来。"]}} },
      { t:"告别", go:"eclipse_face_action_fate", effect:{} }
    ]
  };
};

N["eclipse_face_action_fate"] = function(){
  return {
    place: "数月后 · 传闻",
    text: function(){
      const arr = [];
      arr.push("几个月后，你听到了铁拳的消息。");
      arr.push("他「失败」了暗杀任务——红衣主教活着，但铁拳失踪了。暗蚀会发出了对他的追杀令。");
      arr.push("有人说他逃到了兽人草原，在那里隐居。有人说他被暗蚀会杀了。还有人说——他成了一个游侠，在大陆各处帮助被压迫的人。");
      arr.push("你不知道哪个是真的。但你偶尔会在篝火旁，想起那个夜晚——一个失去一切的兽人，把妻子的发簪埋在土里，然后说「是时候停下来了」。");
      arr.push("你希望他找到了平静。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 研究司司长·白骨（学院卧底教授）
// ============================================================
N["eclipse_face_research_intro"] = function(){
  meetEclipseFace("research");
  return {
    place: "学院 · 教授办公室",
    text: function(){
      const arr = [];
      arr.push("你是在学院里发现他的身份的。");
      arr.push("白骨教授——学院最年轻的终身教授，研究灵魂魔法的权威。你一直很尊敬他。直到你在他的办公室里，发现了暗蚀会的徽章。");
      arr.push("那是一个深夜，你去办公室还书。门没锁，你进去了。然后你看到了——书架后面有一个暗格，暗格里有黑色的徽章，和一叠信件。");
      arr.push("你拿起最上面的一封信。信的开头是：「致研究司司长白骨……」");
      arr.push("门开了。白骨教授站在门口，手里端着两杯茶。");
      arr.push("「你发现了。」他说，语气很平静，像是在说今天天气不错。「坐吧。我们谈谈。」");
      arr.push("你攥了攥袖口，坐下了。白骨教授把茶放在你面前，然后坐在对面。");
      arr.push("「你一定有很多问题。」他说。「问吧。」");
      arr.push("别过教授办公室，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"问他为什么加入暗蚀会", go:"eclipse_face_research_backstory", effect:{flag:"research_origin_asked"} },
      { t:"质问他是不是在利用学生", go:"eclipse_face_research_backstory", effect:{flag:"research_confronted", karma:"justice"} },
      { t:"保持沉默，等他说", check:"SPR", go:"eclipse_face_research_backstory", effect:{flag:"research_waiting", knowledge:5} }
    ]
  };
};

N["eclipse_face_research_backstory"] = function(){
  return {tag:"branch",
    place: "教授办公室 · 深夜",
    text: function(){
      const arr = [];
      arr.push("白骨教授给你讲了他的故事。");
      arr.push("「我曾经是学院的天才。二十岁就发表了三篇灵魂魔法的论文，所有人都说我是下一个墨丘利。」");
      arr.push("「然后我研究了「禁忌领域」——灵魂的本质。我发现，灵魂不是教会说的那样「神赐的」，而是一种……能量。可以被切割、被转移、被「塑造」的能量。」");
      arr.push("教会说我的研究是「亵渎」。学院开除了我。我的论文被烧毁，我的名字被从学院的记录里抹去。」");
      arr.push("「暗蚀会找到了我。他们给我实验室，给我资源，给我自由。他们说——「研究你想研究的，不用管教会怎么说。」」");
      arr.push("他看着你。「我知道暗蚀会在做什么。我知道他们解放七印的计划可能会造成灾难。但我不在乎。我只在乎——知识。人类的知识，不应该被宗教和恐惧束缚。」");
      arr.push("「你呢？」他问。「你在查七印的真相，不也是为了知识吗？我们是一样的人。」");
      arr.push("你看着他的眼睛——里面没有疯狂，只有一种……纯粹的、冰冷的对知识的渴望。");
      arr.push("从深夜出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"说你和他不一样，你在乎后果", go:"eclipse_face_research_confrontation", effect:{flag:"research_different", karma:"wisdom"} },
      { t:"问他的研究进展到哪一步了", check:"INT", go:"eclipse_face_research_confrontation", effect:{knowledge:20, flag:"research_progress_learned"} },
      { t:"表示理解他对知识的渴望", go:"eclipse_face_research_confrontation", effect:{flag:"research_understood", research_bond:10} }
    ]
  };
};

N["eclipse_face_research_confrontation"] = function(){
  return {tag:"branch",
    place: "教授办公室 · 抉择",
    text: function(){
      const arr = [];
      arr.push("你们的对话，被第三个人打断了。");
      arr.push("墨丘利推门进来。他看了看白骨教授，又看了看你，然后叹了口气。");
      arr.push("「我就知道。」墨丘利说。「学院里有内鬼，我查了十年。原来是你。」");
      arr.push("白骨教授站起来。「墨丘利。你也是守望者的人，对吧？怎么，要来抓我？」");
      arr.push("「不。」墨丘利说。「我是来给你一个选择。」");
      arr.push("他转向你。「年轻人，你也在场。这个选择，你也有份。」");
      arr.push("墨丘利说：「白骨教授的研究，虽然走了偏路，但确实有价值——他对灵魂魔法的理解，比学院里任何人都深。我们可以选择：一，把他交给教会，他会被烧死。二，让他继续研究，但在守望者的监督之下。三，放他走，让他加入暗蚀会的核心。」");
      arr.push("「你选哪个？」");
      arr.push("从抉择出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"交给教会，他是危险的", go:"eclipse_face_research_fate", effect:{flag:"research_handed_over", rep_church:10, research_bond:-30, karma:"order"} },
      { t:"让他在监督下继续研究", check:"INT", go:"eclipse_face_research_fate", effect:{flag:"research_supervised", research_bond:15, karma:"wisdom"}, tier:{crit:function(){return["你说了你的想法——不是放任，也不是消灭，而是「引导」。白骨教授的研究可以继续，但必须公开，必须接受监督。墨丘利点头。白骨教授想了想，然后——笑了。「好。」他说。「至少，我还能研究。」"]},ok:function(){return["你说了你的想法。墨丘利同意了。白骨教授犹豫了一下，然后点头。「可以。但我有一个条件——我的研究成果，必须公开。不能被任何组织垄断。」墨丘利同意了。"]},fail:function(){return["你的提议被白骨教授拒绝了。「监督？我受够了监督！」他突然激动起来。「教会监督我，学院监督我，现在守望者也要监督我？我不干！」他翻窗跑了。"]},critfail:function(){return["你的提议激怒了白骨教授——他突然发动了灵魂魔法攻击。墨丘利挡下了，但办公室被毁掉了一半。白骨教授跑了，临走前留下一句话：「你们和教会一样，都在害怕知识！」"]}} },
      { t:"放他走，每个人都有选择的权利", go:"eclipse_face_research_fate", effect:{flag:"research_let_go", research_bond:20, karma:"freedom"} }
    ]
  };
};

N["eclipse_face_research_fate"] = function(){
  return {tag:"branch",
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.research_handed_over){
        arr.push("白骨教授被交给了教会。");
        arr.push("火刑那天，你去看了。他站在火刑架上，很平静。他看到了你，笑了笑。「知识是杀不死的。」他说。然后火焰吞噬了他。");
        arr.push("那天晚上，你在他的办公室里，发现了一本日记。他在最后一页写着：「如果有一天，有人能继续我的研究——请记住，知识本身没有善恶。使用知识的人，才有。」");
      } else if(S.flags.research_supervised){
        arr.push("白骨教授留在了学院，在守望者的监督下继续研究。");
        arr.push("他的研究成果公开后，引起了轰动——灵魂魔法的本质被重新定义，教会不得不承认他们错了。");
        arr.push("他后来成了学院最受尊敬的教授。学生们都说，他看起来很冷，但其实——是个好人。");
      } else {
        arr.push("白骨教授走了。");
        arr.push("他加入了暗蚀会的核心，继续他的研究。但你偶尔会收到他的信——没有署名，只有研究笔记。他在分享他的发现， anonymously。");
        arr.push("你不知道他是在赎罪，还是只是想让知识传播。但至少，他没有伤害任何人。");
      }
      arr.push("不管怎样，你知道——对知识的渴望，本身没有错。错的是使用知识的方式。");
      arr.push("离开事件之后时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 人事司司长·蛇母
// ============================================================
N["eclipse_face_hr_intro"] = function(){
  meetEclipseFace("hr");
  return {
    place: "地下世界 · 蛇母的巢穴",
    text: function(){
      const arr = [];
      arr.push("你是在地下世界遇到她的。");
      arr.push("她的「巢穴」在交汇城的地下，一个被废弃的下水道改造的空间。里面很干净——干净得不像地下世界。墙上挂着画，桌上有花瓶，甚至还有一架钢琴。");
      arr.push("她坐在钢琴前，在弹一首曲子。很温柔的曲子，和这个地方格格不入。");
      arr.push("她弹完，转过身看你。她很美——但她的美让人不舒服，像是被「设计」出来的。每一个表情，每一个动作，都恰到好处。");
      arr.push("「欢迎。」她说，声音像蜂蜜。「我是蛇母。暗蚀会人事司司长。你一定很奇怪，为什么我叫你来这里。」");
      arr.push("你确实很奇怪。");
      arr.push("「因为你很特别。」她站起来，走到你面前。「能看到符文的人，三千年才出一个。我想——「塑造」你。」");
      arr.push("「塑造？」你问。");
      arr.push("蛇母笑了。「别害怕。我不是要改造你。我只是想——看看你能不能成为「更好」的人。我相信，人性是可以被塑造的。只要找到正确的痛点，正确的激励，正确的……环境。」");
      arr.push("别过蛇母的巢穴，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"问她为什么相信人性可以被塑造", go:"eclipse_face_hr_backstory", effect:{knowledge:10} },
      { t:"拒绝她的「塑造」，保持自我", go:"eclipse_face_hr_confrontation", effect:{flag:"hr_refused", karma:"freedom"} },
      { t:"问她想把你塑造成什么样", check:"INT", go:"eclipse_face_hr_backstory", effect:{knowledge:15} }
    ]
  };
};

N["eclipse_face_hr_backstory"] = function(){
  return {
    place: "巢穴 · 蛇母的故事",
    text: function(){
      const arr = [];
      arr.push("蛇母给你讲了她的故事。");
      arr.push("「我父亲是奴隶贩子。从小，我就看着他「塑造」奴隶——打一顿，给一颗糖，再打一顿。慢慢地，奴隶就听话了。」");
      arr.push("「我恨他。但我也从他身上学到了——人是可以被改变的。不是用暴力，是用「环境」。把一个人放在正确的环境里，他就会变成你想要的样子。」");
      arr.push("「我十四岁那年，杀了我父亲。不是用刀——是用「塑造」。我让他相信，他的副手要背叛他。他杀了副手，然后副手的手下杀了他。我一句话都没说，只是……安排了几个「巧合」。」");
      arr.push("「从那以后，我就相信——人性是可以被设计的。如果我能设计一个「更好」的环境，就能创造「更好」的人。」");
      arr.push("她看着你。「暗蚀会就是我的「实验」。我招募人，塑造人，把他们变成我想要的样子。有些人成功了，有些人失败了。但总体来说——我的实验，是有效的。」");
      arr.push("「你呢？」她问。「你觉得，你是你自己，还是你所有经历的「总和」？如果你的经历不同，你会是不同的人吗？」");
      arr.push("从蛇母的故事出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"说人有自由意志，不只是环境的产物", go:"eclipse_face_hr_confrontation", effect:{flag:"hr_free_will", karma:"freedom"} },
      { t:"说人确实受环境影响，但可以选择不被定义", check:"CHA", go:"eclipse_face_hr_confrontation", effect:{flag:"hr_balance", hr_bond:10} },
      { t:"说不知道，但她的方法很危险", go:"eclipse_face_hr_confrontation", effect:{flag:"hr_danger_warned", karma:"caution"} }
    ]
  };
};

N["eclipse_face_hr_confrontation"] = function(){
  return {
    place: "巢穴 · 考验",
    text: function(){
      const arr = [];
      arr.push("蛇母听完你的话，笑了。");
      arr.push("「很好。」她说。「你有自己的想法。这正是我想要的——一个「未完成」的作品。」");
      arr.push("她拍了拍手。墙壁上开了一扇门，门里走出来一个人——你认识他。是你学院的同学，一个很安静的男孩，平时总是坐在角落。");
      arr.push("「你认识他吧？」蛇母说。「他是我「塑造」的作品。三年前，他还是一个胆小、自卑、被所有人欺负的孩子。我找到了他，给他环境，给他激励，给他目标。现在——他是暗蚀会最出色的杀手之一。」");
      arr.push("那个男孩看着你，眼睛里没有任何感情。");
      arr.push("「你看。」蛇母说。「人性是可以被塑造的。他以前连一只蚂蚁都不敢踩。现在，他杀过十七个人。」");
      arr.push("她转向你。「现在，考验你。这个男孩——你可以杀了他，结束他的痛苦。你也可以「拯救」他，让他恢复以前的样子。或者，你可以加入我，一起「塑造」更多的人。」");
      arr.push("「你选哪个？」");
      arr.push("考验的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"试图拯救这个男孩", check:"SPR", go:"eclipse_face_hr_fate", effect:{flag:"hr_boy_saved", sanLoss:10, hr_bond:-10}, tier:{crit:function(){return["你闭上眼睛，灵魂感知延伸出去。你看到了——男孩的内心深处，那个胆小的、善良的孩子还在。你呼唤他。他的眼睛里，慢慢有了光。「我……是谁？」他喃喃地说。蛇母的脸色变了。「不可能……」"]},ok:function(){return["你试图和男孩沟通。他的表情有了一丝动摇——不是完全恢复，但至少，他犹豫了。蛇母皱眉：「有趣。你的「塑造」能力，比我想的强。」"]},fail:function(){return["你试图拯救男孩，但他的「塑造」太深了。他攻击了你——不是致命的，但你受了伤。蛇母摇头：「太弱了。你救不了他。」"]},critfail:function(){return["你的灵魂感知被男孩「反弹」了——蛇母在他身上设了陷阱。你感觉到自己的意识在被「塑造」——恐惧、愤怒、欲望，一股脑涌进来。你跪在地上，过了很久才恢复。蛇母在旁边微笑：「看到了吗？塑造无处不在。」"]}} },
      { t:"杀了他，结束他的痛苦", check:"STR", go:"eclipse_face_hr_fate", effect:{flag:"hr_boy_killed", sanLoss:15, karma:"mercy_killing"} },
      { t:"拒绝选择，攻击蛇母", check:"AGI", go:"eclipse_face_hr_fate", effect:{flag:"hr_attacked", hr_bond:-30} }
    ]
  };
};

N["eclipse_face_hr_fate"] = function(){
  return {
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.hr_boy_saved){
        arr.push("男孩恢复了。");
        arr.push("他不记得自己杀过的人，但他记得那种「被塑造」的感觉——像是做了一个很长的噩梦。");
        arr.push("你把他送回了学院。他的父母来接他，抱着他哭。他看着你，说了一句话：「谢谢你。让我重新成为「我」。」");
        arr.push("蛇母消失了。但你偶尔会收到她的信——没有威胁，只有一个问题：「你觉得，你救了他，还是只是把他「塑造」成了你想要的样子？」");
      } else if(S.flags.hr_boy_killed){
        arr.push("男孩死了。");
        arr.push("他死的时候，脸上有一丝微笑——像是终于解脱了。你在他的口袋里发现了一张照片——他和父母的合影，那时候他还很小，笑得很开心。");
        arr.push("你把照片交给了他的父母。他们没有怪你——他们说，他们的儿子三年前就「死」了，现在只是身体终于跟上了灵魂。");
        arr.push("但你知道，你杀了一个人。不管理由是什么，这个事实不会变。");
      } else {
        arr.push("你攻击了蛇母，但她跑了。");
        arr.push("她临走前留下一句话：「你和我一样——都想用自己的方式「塑造」世界。只是你还不承认而已。」");
        arr.push("你不知道她说得对不对。但你知道，从那天起，你开始更谨慎地对待自己的每一个选择——因为你不知道，你的选择是不是也在「塑造」别人。");
      }
      arr.push("蛇母的问题，一直留在你心里：人，到底是自己，还是所有经历的总和？");
      arr.push("离开事件之后时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 财务司司长·金秤
// ============================================================
N["eclipse_face_finance_intro"] = function(){
  meetEclipseFace("finance");
  return {
    place: "南方城邦 · 拍卖行",
    text: function(){
      const arr = [];
      arr.push("你是在拍卖行遇到他的。");
      arr.push("他穿着最昂贵的衣服，戴着最昂贵的首饰，坐在拍卖行最好的位置。所有人都在看他——因为他刚刚用天价拍下了一件「黄林晶时代的文物」。");
      arr.push("他注意到了你，然后招手让你过去。");
      arr.push("「你就是那个能看到符文的人？」他说，声音很优雅，带着一种……刻意的优雅。「我是金秤。暗蚀会财务司司长。」");
      arr.push("你很惊讶——暗蚀会的财务司长，居然这么高调。");
      arr.push("金秤笑了。「很惊讶？暗蚀会需要钱——很多钱。买武器，买情报，买人。而我，最擅长的就是赚钱。」");
      arr.push("他举起手里的文物。「这件东西，我花了十万金龙。但它的实际价值——至少五十万。因为上面有黄林晶的符文，能打开某个「宝库」。」");
      arr.push("「我叫你来，是想和你做一笔生意。」他说。「你帮我解读符文，我分你三成利润。怎么样？」");
      arr.push("从拍卖行出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"同意合作", go:"eclipse_face_finance_backstory", effect:{flag:"finance_cooperation", gold:500} },
      { t:"拒绝，不想和暗蚀会做生意", go:"eclipse_face_finance_confrontation", effect:{flag:"finance_refused"} },
      { t:"问他为什么加入暗蚀会", check:"CHA", go:"eclipse_face_finance_backstory", effect:{flag:"finance_origin_asked"} }
    ]
  };
};

N["eclipse_face_finance_backstory"] = function(){
  return {
    place: "拍卖行 · 贵宾室",
    text: function(){
      const arr = [];
      arr.push("金秤带你去了贵宾室，给你倒了一杯最贵的酒。");
      arr.push("「我曾经是美第奇家族的人。」他说。「旁支。我父亲是家族里最有商业天赋的人——但因为是旁支，永远被嫡系压制。」");
      arr.push("「我从小就看着——嫡系的那些蠢货，什么都不会，却拥有一切。而我父亲，累死累活，最后被嫡系排挤，郁郁而终。」");
      arr.push("「我加入暗蚀会，是为了证明——我比那些「正统」的美第奇更强。我要用暗蚀会的资源，建立一个比美第奇更大的商业帝国。然后，让他们跪着求我。」");
      arr.push("他喝了一口酒。「你知道吗？暗蚀会的资金，有七成是我赚来的。没有我，他们连武器都买不起。他们需要我，比我需要他们更多。」");
      arr.push("「所以，我不怕暴露身份。因为——没有人敢动我。」");
      arr.push("他看着你。「年轻人，这个世界，说到底是钱的世界。教会有钱，所以能烧人。美第奇有钱，所以能操控政治。暗蚀会有钱，所以能和教会对抗。」");
      arr.push("「你呢？你追求的是什么？真相？正义？还是……别的什么？」");
      arr.push("别过贵宾室，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"说追求真相", go:"eclipse_face_finance_confrontation", effect:{flag:"finance_truth_seeker"} },
      { t:"说追求力量，保护自己在乎的人", go:"eclipse_face_finance_confrontation", effect:{flag:"finance_protector", finance_bond:5} },
      { t:"说还不知道，在寻找", go:"eclipse_face_finance_confrontation", effect:{flag:"finance_searching", karma:"honesty"} }
    ]
  };
};

N["eclipse_face_finance_confrontation"] = function(){
  return {
    place: "贵宾室 · 生意",
    text: function(){
      const arr = [];
      arr.push("金秤听完你的话，点了点头。");
      arr.push("「很好。」他说。「有追求的人，才能合作。」");
      arr.push("他把那件文物放在桌上。「现在，生意。这件文物上有符文，你帮我解读。如果能打开宝库，我们分账。」");
      arr.push("你仔细看了看文物——是一个金属盒子，上面刻着七印的符文。你能感觉到，盒子里有什么东西在「呼吸」。");
      arr.push("「这是黄林晶的「备份盒」。」你说。「里面可能是——完整之种的设计图。」");
      arr.push("金秤的眼睛亮了。「完整之种？那是什么？」");
      arr.push("你解释了——黄林晶留下的、能让世界重新完整的东西。");
      arr.push("金秤沉默了很久。然后他说：「如果这个东西真的存在……它的价值，不是钱能衡量的。它能改变整个世界。」");
      arr.push("他看着你。「年轻人，我给你一个选择——把这个盒子给我，我给你一百万金龙。或者，我们一起打开它，看看里面是什么。你选哪个？」");
      arr.push("你离了生意，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"一起打开盒子", check:"INT", go:"eclipse_face_finance_fate", effect:{flag:"finance_box_opened", knowledge:30}, tier:{crit:function(){return["你解读了符文，盒子打开了。里面是一张羊皮纸——完整之种的设计图，还有黄林晶的亲笔注释。金秤看完，沉默了很久。「原来如此。」他说。「黄林晶……比我想的更复杂。」"]},ok:function(){return["你解读了大部分符文，盒子打开了一条缝。里面有光透出来——是完整之种的气息。金秤很激动：「快，完全打开它！」"]},fail:function(){return["你试图解读符文，但太复杂了。盒子没有打开。金秤有点失望：「没关系。我们可以找其他人帮忙。」但你注意到，他看你的眼神变了——不再是「合作伙伴」，而是「工具」。"]},critfail:function(){return["你解读错了符文——盒子发出了警报。金色的光冲天而起，整个拍卖行都在震动。金秤脸色大变：「你做了什么？！」你们不得不立刻逃跑。盒子被拍卖行的保安没收了。"]}} },
      { t:"接受一百万金龙，把盒子给他", go:"eclipse_face_finance_fate", effect:{gold:1000, flag:"finance_box_sold", karma:"greed"} },
      { t:"拒绝交易，把盒子带走", go:"eclipse_face_finance_fate", effect:{flag:"finance_box_taken", finance_bond:-20, item:"黄林晶备份盒"} }
    ]
  };
};

N["eclipse_face_finance_fate"] = function(){
  return {
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.finance_box_opened){
        arr.push("你和金秤一起研究了完整之种的设计图。");
        arr.push("他是一个聪明人——虽然动机不纯，但他的商业头脑和你的符文知识结合，解开了很多谜题。");
        arr.push("最后，他说：「这个东西，不能给暗蚀会。也不能给教会。它应该……给所有人。」");
        arr.push("你很惊讶。金秤笑了。「别这么看我。我虽然爱钱，但我不是傻子。如果世界毁灭了，钱还有什么用？」");
        arr.push("他把设计图的副本，寄给了大陆所有的学院和图书馆。匿名的。");
      } else if(S.flags.finance_box_sold){
        arr.push("你拿了一百万金龙，走了。");
        arr.push("但你一直后悔——那个盒子里的东西，可能是拯救世界的关键。而你，为了钱，把它给了暗蚀会。");
        arr.push("几个月后，你听说暗蚀会用盒子里的知识，制造了一件危险的武器。你不知道是不是你的错。但你知道——如果当时你做了不同的选择，也许一切都会不同。");
      } else {
        arr.push("你带走了盒子。金秤没有追——他只是看着你，笑了笑。「你会后悔的。」他说。「这个世界，没有钱解决不了的事。」");
        arr.push("你不知道他说得对不对。但你知道——有些东西，比钱更重要。");
      }
      arr.push("金秤后来怎么样了？有人说他成了大陆最富有的人。有人说他被暗蚀会内部清洗了。还有人说——他匿名资助了很多孤儿院和学校。");
      arr.push("你不知道哪个是真的。但你偶尔会想起他——一个被家族伤害的人，用金钱来证明自己的价值。也许，他和你一样，只是在寻找「意义」。");
      arr.push("你最后回望一眼事件之后，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 暗蚀会终局·教主候选之争
// ============================================================
N["eclipse_endgame"] = function(){
  eclipseFacesInit();
  return {
    place: "暗蚀会总部 · 终局",
    text: function(){
      const arr = [];
      arr.push("深渊降临之前，暗蚀会内部发生了巨变。");
      arr.push("教主——那个隐藏在幕后三千年的人——死了。不是被杀死的，是「寿终正寝」。他活了三千年，终于撑不住了。");
      arr.push("暗蚀会群龙无首。五司长——你见过的那些人——开始争夺教主之位。");
      arr.push("夜莺想要「改革」暗蚀会，从内部改变方向。");
      arr.push("铁拳已经退出了，不参与。");
      arr.push("白骨——如果他还在的话——想要「学术自由」，让暗蚀会成为研究组织。");
      arr.push("蛇母想要「塑造」暗蚀会，把它变成她的「实验场」。");
      arr.push("金秤想要「商业化」暗蚀会，把它变成最大的商业帝国。");
      arr.push("而你——因为能看到符文，被各方势力拉拢。他们都想要你的支持。");
      arr.push("「你支持谁？」他们问你。「或者——你自己当教主？」");
      return arr;
    },
    options: [
      { t:"支持夜莺，改革暗蚀会", go:"ending_eclipse", effect:{flag:"eclipse_nightingale_support", intel_bond:30} },
      { t:"支持金秤，商业化暗蚀会", go:"ending_eclipse", effect:{flag:"eclipse_goldscale_support", finance_bond:30} },
      { t:"自己当教主，从内部改变", check:"CHA", go:"ending_eclipse", effect:{flag:"eclipse_self_leader", rep_eclipse:50}, tier:{crit:function(){return["你发表了演讲——不是关于权力，是关于「方向」。暗蚀会的初衷是追求真相，但后来变成了复仇和破坏的工具。你说——是时候回到初衷了。五司长中，有三个站到了你这边。你成了新教主。"]},ok:function(){return["你参与了竞选。虽然不是全票通过，但大部分人支持你——因为你能看到符文，因为你是「黄林晶的继承人」。你成了新教主。"]},fail:function(){return["你试图竞选，但失败了——你的资历太浅，没有人服你。最后，夜莺成了教主。但她任命你为「顾问」。"]},critfail:function(){return["你的竞选引发了内斗——有人支持你，有人反对你。暗蚀会分裂成了两派，差点打起来。最后，蛇母趁乱夺权，成了新教主。你被「流放」了。"]}} },
      { t:"解散暗蚀会，让所有人自由", go:"ending_eclipse", effect:{flag:"eclipse_dissolve", karma:"freedom"} }
    ]
  };
};

N["ending_eclipse"] = function(){
  return {tag:"ending",
    place: "暗蚀会 · 结局",
    text: function(){
      const arr = [];
      if(S.flags.eclipse_nightingale_support){
        arr.push("夜莺成了新教主。");
        arr.push("她改革了暗蚀会——从「破坏者」变成了「真相寻求者」。他们不再暗杀，不再煽动，而是——调查。调查教会的腐败，调查七印的真相，调查所有被掩盖的事实。");
        arr.push("有些人不理解，离开了。但留下来的人，找到了新的意义。");
      } else if(S.flags.eclipse_self_leader){
        arr.push("你成了暗蚀会的新教主。");
        arr.push("你做的第一件事，是打开暗蚀会的所有档案——三千年的秘密，全部公开。教会的腐败，七印的真相，黄林晶的错误——所有人都知道了。");
        arr.push("世界震动了。但你知道——真相，虽然痛苦，但比谎言好。");
      } else if(S.flags.eclipse_dissolve){
        arr.push("暗蚀会解散了。");
        arr.push("没有仪式，没有公告——只是一个晚上，所有人把徽章放在桌上，然后走了。");
        arr.push("夜莺去当了记者，继续揭露真相。金秤去做了正经生意，成了大陆最大的慈善家。蛇母消失了，有人说她在一个小村子里，养了一群孤儿。");
        arr.push("暗蚀会不存在了。但每个前成员，都在以自己的方式，继续「追求真相」。");
      } else {
        arr.push("金秤成了新教主。");
        arr.push("他把暗蚀会「商业化」了——不再是秘密组织，而是大陆最大的情报和贸易公司。他们卖情报，卖武器，卖……一切能卖的东西。");
        arr.push("有人说他背叛了暗蚀会的初衷。但他说：「初衷？初衷就是活下去。而活下去，需要钱。」");
      }
      arr.push("不管怎样，暗蚀会的故事——五张面孔的故事——到这里，告一段落了。");
      arr.push("但你知道，只要世界还有谎言，就会有追求真相的人。只要世界还有压迫，就会有反抗的人。暗蚀会可能消失了，但「暗蚀」——那种在黑暗中寻找光明的精神——永远不会消失。");
      arr.push("你选择了与暗蚀会同行。");arr.push("这条路，你走得比任何人都深。你见过那些藏在影子里的东西，你听过那些不该听的声音，你握过那些烫手的秘密。");arr.push("可你走到终点的时候，忽然发现——你不是要成为他们。你是要，替他们记住。");arr.push("记住那些人为什么堕落，记住那些堕落里的人，曾经是什么样子。");arr.push("你站在这条路的尽头，回望来路。来路很长，长得看不清起点。可你知道，起点就在那里——在那个你第一次选择「不择手段」的夜晚。");arr.push("那个夜晚没有错。错的是，有人把「不择手段」当成了目的地，而不是手段。");arr.push("你转身，走进你选择的那片黑暗。你走得很稳。因为你知道，你不是在逃避光——你是在，替光，看着那片黑暗。");arr.push("从结局出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    } /*v45inj:ending_eclipse*/,
    options: [
      { t:"继续你的旅程", go:"fc_jiaohui_entry", effect:{flag:"eclipse_ending_complete"} }
    ]
  };
};

console.log("[v23 aj] 暗蚀会五张面孔系统已加载");


// ============================================================
// v23 同学录数据
// ============================================================
const CLASSMATE_CHRONICLE = {
  cecilia: {id:"cecilia", name:"塞西莉亚", race:"人类", job:"魔法师", trait:"天才型", desc:"贵族出身，天赋极高，表面冷漠内心柔软", reunionCity:"圣城", fate:null},
  marcus: {id:"marcus", name:"马库斯", race:"人类", job:"战士", trait:"贵族型", desc:"北方公国贵族之子，正直但固执", reunionCity:"铁门关", fate:null},
  lina: {id:"lina", name:"莉娜", race:"人类", job:"盗贼", trait:"平民型", desc:"贫民窟出身，机灵但缺乏安全感", reunionCity:"交汇城", fate:null},
  thorin: {id:"thorin", name:"索林", race:"矮人", job:"术士", trait:"种族型", desc:"矮人铁匠世家，沉默寡言但手艺精湛", reunionCity:"铁峰堡", fate:null},
  elara: {id:"elara", name:"艾拉拉", race:"精灵", job:"牧师", trait:"种族型", desc:"精灵王族旁支，温柔但有秘密", reunionCity:"银叶城", fate:null},
  grom: {id:"grom", name:"格罗姆", race:"兽人", job:"战士", trait:"种族型", desc:"兽人战族之子，被歧视但内心善良", reunionCity:"兽人王庭", fate:null},
  victoria: {id:"victoria", name:"维多利亚", race:"人类", job:"商人", trait:"贵族型", desc:"南方商会之女，精明但不坏", reunionCity:"南方港城", fate:null},
  edmund: {id:"edmund", name:"埃德蒙", race:"人类", job:"牧师", trait:"神秘型", desc:"教会养子，虔诚但有黑暗过去", reunionCity:"圣城", fate:null},
  faye: {id:"faye", name:"菲伊", race:"半身人", job:"盗贼", trait:"平民型", desc:"半身人游商之女，活泼但爱惹麻烦", reunionCity:"交汇城", fate:null},
  drake: {id:"drake", name:"德雷克", race:"龙裔", job:"魔法师", trait:"神秘型", desc:"龙裔幸存者，孤独但强大", reunionCity:"死亡沙漠边缘", fate:null},
  sophia: {id:"sophia", name:"索菲亚", race:"人类", job:"灵魂法师", trait:"天才型", desc:"孤儿出身，灵魂魔法天赋惊人，被墨丘利看重", reunionCity:"学院", fate:null}
};

// ============================================================
// v23 因果之网数据
// ============================================================
const KARMA_WEB = {
  seeds: [
    {id:"seed_merchant", origin:"序章", choice:"救了被欺负的小贩", flag:"merchant_saved", npc:"老汤姆", desc:"序章救了一个被帮派欺负的小贩"},
    {id:"seed_thief", origin:"序章", choice:"偷了东西", flag:"stole_from", npc:"失主", desc:"序章偷了一个商人的钱包"},
    {id:"seed_enemy", origin:"序章", choice:"放过了敌人", flag:"enemy_spared", npc:"年轻敌人", desc:"序章放过了一个要杀你的敌人"},
    {id:"seed_child", origin:"序章", choice:"帮助了迷路的孩子", flag:"child_helped", npc:"小女孩", desc:"序章帮助了一个迷路的孩子回家"},
    {id:"seed_priest", origin:"序章", choice:"和牧师的对话", flag:"priest_bond", npc:"老牧师", desc:"序章和一个老牧师的深入对话"},
    {id:"seed_animal", origin:"序章", choice:"救助了受伤的动物", flag:"animal_saved", npc:"狼", desc:"序章救助了一只受伤的狼"},
    {id:"seed_betray", origin:"学院", choice:"背叛了同学的信任", flag:"betrayed_classmate", npc:"同学", desc:"学院期间为了利益背叛了同学"},
    {id:"seed_protect", origin:"学院", choice:"保护了被欺负的同学", flag:"protected_classmate", npc:"格罗姆", desc:"学院期间保护了被歧视的兽人同学"},
    {id:"seed_secret", origin:"学院", choice:"保守了一个秘密", flag:"kept_secret", npc:"塞西莉亚", desc:"学院期间为塞西莉亚保守了家族秘密"},
    {id:"seed_teacher", origin:"学院", choice:"和教授的深入交流", flag:"teacher_bond", npc:"墨丘利", desc:"学院期间和墨丘利的深入交流"}
  ]
};

// ============================================================
// v23 引擎函数
// ============================================================
function classmateInit(){
  if(!S.classmateChronicle){
    S.classmateChronicle = {bonds:{}, reunionFlags:[], fallen:[], survived:[]};
    for(const cid in CLASSMATE_CHRONICLE){
      S.classmateChronicle.bonds[cid] = 0;
    }
  }
  return S.classmateChronicle;
}

function karmaInit(){
  if(!S.karmaWeb){
    S.karmaWeb = {seeds:[], harvests:[], activeChains:[]};
  }
  return S.karmaWeb;
}

function plantKarmaSeed(seedId){
  karmaInit();
  if(S.karmaWeb.seeds.indexOf(seedId) < 0){
    S.karmaWeb.seeds.push(seedId);
  }
}

// ============================================================
// v23 同学·学院日常事件
// ============================================================
/* /v62inj:chunk-npc/ N["classmate_cecilia_event"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_grom_event"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["classmate_event_result"] 已移入 chunks/v62_npc.js */
// ============================================================
// v23 同学·大陆重逢事件
// ============================================================
N["reunion_cecilia"] = function(){
  classmateInit();
  return {
    place: "圣城 · 大教堂外",
    text: function(){
      const arr = [];
      arr.push("你在圣城遇到了塞西莉亚。");
      arr.push("她变了。不再是学院里那个冷淡的天才少女——她穿着法师袍，站在大教堂外，正在和一群审判骑士争论。");
      arr.push("「你们没有权利逮捕她！」她的声音很大，带着愤怒。「她只是一个灵魂法师，不是异端！」");
      arr.push("审判骑士的领头人冷笑：「灵魂法师就是异端。塞西莉亚小姐，你虽然是贵族，但也不能包庇异端。」");
      arr.push("塞西莉亚看到了你，眼睛亮了一下。然后她转向你：「你来了。帮我——他们要抓我的学生。」");
      arr.push("你注意到，她身后躲着一个小女孩——十三四岁，在发抖。");
      arr.push("「这是我的学生。」塞西莉亚说。「她有灵魂魔法的天赋。我不能让教会把她烧死。」");
      arr.push("审判骑士看向你。「你是什么人？要插手教会的事吗？」");
      arr.push("大教堂外已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"帮塞西莉亚，保护小女孩", check:"CHA", go:"reunion_result", effect:{flag:"cecilia_helped", cecilia_bond:20, rep_church:-15}, tier:{crit:function(){return["你走上前，用你在学院学到的辩论技巧，和审判骑士周旋。你引用了教会法典的漏洞——灵魂法师如果没有使用禁忌魔法，就不能被定为异端。骑士们被你说得哑口无言，最后只能离开。塞西莉亚看着你，笑了——这是你第一次看到她真正地笑。"]},ok:function(){return["你帮塞西莉亚说了几句话，骑士们犹豫了一下，最后决定「先调查再处理」。他们离开了，但放话会再来。塞西莉亚松了口气：「谢了。欠你一次。」"]},fail:function(){return["你试图帮忙，但骑士们不听。他们逮捕了小女孩，也警告了塞西莉亚。塞西莉亚看着你，眼里有失望：「我以为你会有办法。」"]},critfail:function(){return["你的帮忙弄巧成拙——骑士们认为你也是「异端的同党」，要连你一起抓。塞西莉亚不得不动用家族的力量才把你们保下来。她很生气：「你差点把我们都害死！」"]}} },
      { t:"中立，不介入教会的事", go:"reunion_result", effect:{flag:"cecilia_neutral", cecilia_bond:-10} },
      { t:"劝塞西莉亚妥协，不要和教会对抗", go:"reunion_result", effect:{flag:"cecilia_compromise_advice", cecilia_bond:-5, karma:"caution"} }
    ]
  };
};

N["reunion_grom"] = function(){
  classmateInit();
  return {
    place: "兽人王庭 · 战场",
    text: function(){
      const arr = [];
      arr.push("你在兽人王庭遇到了格罗姆。");
      arr.push("他变了。不再是学院里那个沉默的兽人少年——他穿着战甲，身上有伤疤，手里拿着一把巨大的战斧。");
      arr.push("他正在和一群人类战士战斗。不是侵略——是自卫。人类的「净化军」又来攻打兽人部落了。");
      arr.push("格罗姆看到了你，停了下来。「是你。」他说，声音比以前低沉了很多。「你是来帮人类的，还是来帮兽人的？」");
      arr.push("你注意到，他身后有兽人平民——老人、女人、孩子。他们在发抖。");
      arr.push("「我不想打。」格罗姆说。「但他们要杀我的族人。我没有选择。」");
      arr.push("人类战士的领头人看到了你：「你是什么人？是和兽人一伙的吗？」");
      arr.push("战场在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"帮格罗姆，保护兽人平民", check:"STR", go:"reunion_result", effect:{flag:"grom_helped", grom_bond:25, rep_human:-20, rep_orc:30}, tier:{crit:function(){return["你冲入战场，用你学到的战斗技巧，击退了人类战士的进攻。你没有杀人——只是把他们打退。格罗姆看着你，眼里有泪光。「你还记得。」他说。「你说过，兽人也可以和人类和平相处。」"]},ok:function(){return["你帮格罗姆打退了人类战士。战斗结束后，他拍了拍你的肩：「谢了，兄弟。」兽人平民们向你鞠躬。"]},fail:function(){return["你试图帮忙，但战斗太激烈了。你受了伤，格罗姆不得不分神保护你。最后，兽人平民有几个受伤了。格罗姆没有怪你，但你能感觉到——他很失望。"]},critfail:function(){return["你的介入让局势更糟——人类战士认为你是兽人「请来的帮手」，进攻更猛烈了。几个兽人平民死了。格罗姆看着你，眼里有痛苦：「你不该来的。」"]}} },
      { t:"试图调解双方", check:"CHA", go:"reunion_result", effect:{flag:"grom_mediated", grom_bond:10, karma:"peace"}, tier:{crit:function(){return["你站在双方中间，用你在学院学到的谈判技巧，说服了人类战士的领头人。你指出——这次进攻没有教会的正式命令，是「私自行动」。如果继续打，领头人会被教会追责。领头人犹豫了，最后撤退了。格罗姆看着你，充满了感激。"]},ok:function(){return["你试图调解，双方暂时停火了。但你知道，这只是暂时的。仇恨还在。格罗姆说：「至少，今天没有人死。谢谢你。」"]},fail:function(){return["你的调解失败了——双方都不听。战斗继续，你只能看着。格罗姆在战斗中受了伤，但没有生命危险。"]},critfail:function(){return["你的调解激怒了双方——人类认为你偏袒兽人，兽人认为你是人类的奸细。你差点被双方攻击。最后你不得不逃跑。"]}} },
      { t:"不介入，这是兽人和人类的事", go:"reunion_result", effect:{flag:"grom_neutral", grom_bond:-15} }
    ]
  };
};

N["reunion_result"] = function(){
  return {
    place: "重逢之后",
    text: function(){
      const arr = [];
      arr.push("重逢之后，你和老同学的关系，又深了一层——或者，又远了一层。");
      if(S.flags.cecilia_helped){
        arr.push("塞西莉亚成了圣城有名的「异端保护者」——她专门收留被教会追捕的灵魂法师。她说，这是你教她的——人有选择自己命运的权利。");
      }
      if(S.flags.grom_helped || S.flags.grom_mediated){
        arr.push("格罗姆成了兽人王庭的「和平派」领袖——他主张和人类和平共处。他说，这是你在学院食堂教他的——只要互相理解，和平是可能的。");
      }
      arr.push("你不知道的是，你和每个同学的重逢，都在改变他们的命运轨迹。有些人因为你而变得更好，有些人因为你而变得更坏。有些人活着，有些人……可能会死。");
      arr.push("但这就是人生——你做的每一个选择，都在影响着周围的人。而这些影响，会在终局的时候，汇聚在一起。");
      arr.push("重逢之后在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 同学·终局汇聚
// ============================================================
N["final_battle_classmates"] = function(){
  classmateInit();
  return {
    place: "最终战场 · 同学汇聚",
    text: function(){
      const arr = [];
      arr.push("终局之战开始前，你看到了他们。");
      arr.push("塞西莉亚——带着她的灵魂法师学徒们，站在左翼。她看到你，点了点头。");
      arr.push("格罗姆——带着兽人战士，站在右翼。他对你举起了战斧，不是攻击，是致意。");
      arr.push("马库斯——北方公国的将军，带着军队。");
      arr.push("莉娜——地下世界的领袖，带着她的人。");
      arr.push("索林——矮人匠会的大师，带着最好的武器。");
      arr.push("艾拉拉——精灵的使者，带着精灵的祝福。");
      arr.push("维多利亚——南方商会的会长，带着物资和资金。");
      arr.push("埃德蒙——教会的改革派主教，带着愿意战斗的牧师。");
      arr.push("菲伊——半身人游侠，带着她的侦察队。");
      arr.push("德雷克——龙裔的最后一人，独自站在最前线。");
      arr.push("索菲亚——墨丘利的继承人，带着灵魂魔法的奥义。");
      arr.push("十一个人。你的同学。你的朋友。你的……家人。");
      arr.push("「我们来了。」塞西莉亚说。「你以为你一个人能扛下所有事？」");
      arr.push("格罗姆笑了：「兄弟，我们一起。」");
      arr.push("别过同学汇聚，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"和同学们一起，迎接最终之战", go:"ending_classmates", effect:{flag:"classmates_united", karma:"friendship"} }
    ]
  };
};

N["ending_classmates"] = function(){
  return {tag:"ending",
    place: "终局之后 · 同学的结局",
    text: function(){
      const arr = [];
      arr.push("战争结束了。");
      arr.push("你的同学们，各奔东西——但他们都活了下来。");
      arr.push("塞西莉亚创办了大陆第一所「灵魂魔法学院」，专门招收被教会歧视的灵魂法师。她说，这是你教她的。");
      arr.push("格罗姆成了兽人和人类的「和平使者」，他用一生的时间，促进两个种族的理解。");
      arr.push("马库斯成了北方公国的元帅，他改革了军队，不再歧视非人类士兵。");
      arr.push("莉娜成了地下世界的「女王」，但她用她的力量，保护了很多无辜的人。");
      arr.push("索林成了矮人匠会的会长，他锻造的武器，被用来保护而不是侵略。");
      arr.push("艾拉拉成了精灵女王的顾问，她推动了精灵和人类的交流。");
      arr.push("维多利亚成了大陆最富有的商人，但她把大部分财富，用来重建战争中被毁的城市。");
      arr.push("埃德蒙成了教会的改革派领袖，他推动了教会的「现代化」——不再迫害异端，而是寻求理解。");
      arr.push("菲伊成了大陆最有名的游侠，她的故事，被游吟诗人传唱。");
      arr.push("德雷克消失了——有人说他去了龙裔的故乡，有人说他在守护某个秘密。但每年，你都会收到一封没有署名的信，里面只有一片龙鳞。");
      arr.push("索菲亚成了新的墨丘利——学院的灵魂魔法教授。她说，她要把墨丘利的知识，传承下去。");
      arr.push("十一个人。十一种人生。但他们都记得——在学院的那些年，有一个人，改变了他们的命运。");
      arr.push("那个人，就是你。");
      arr.push("多年以后，你在某个城市的酒馆里，遇见一个游吟诗人。");arr.push("他弹着琴，唱一首你没听过的歌。歌词里有一句：「十一个人，十一条路，都从一扇门里走出来。」你端着酒杯，忽然听懂了。");arr.push("你请他唱第二遍。他笑了：「这歌是别人托我传唱的。那人说，如果有一天，有个旅人请我唱第二遍，就让我告诉他——」");arr.push("他顿了顿，压低了声音：「他们都在各自的路上了。没有人回头。但也没有人忘了那扇门。」");arr.push("你放下酒杯，扔下几枚银币，走出了酒馆。");arr.push("你走在夜里，抬头看见满天星斗。十一个人，十一条路——你忽然觉得，那十一个星座，今晚都亮着。");return arr;
    } /*v45inj:ending_classmates*/,
    options: [
      { t:"继续你的故事", go:"fc_jiaohui_entry", effect:{flag:"classmates_ending_complete"} }
    ]
  };
};

// ============================================================
// v23 因果之网·序章种子
// ============================================================
N["karma_seed_merchant"] = function(){
  plantKarmaSeed("seed_merchant");
  return {
    place: "出身地 · 集市",
    text: function(){
      const arr = [];
      arr.push("你在集市上看到了一幕——三个帮派成员在欺负一个小贩。");
      arr.push("小贩是个老人，叫老汤姆。他卖的是自己做的木工品——很粗糙，但很用心。帮派成员要收「保护费」，老汤姆拿不出来，他们就开始砸他的摊子。");
      arr.push("周围的人都在看，但没有人敢上前。");
      arr.push("老汤姆跪在地上，求他们住手。「这是我孙女的医药费……求求你们……」");
      arr.push("帮派的领头人笑了：「医药费？关我屁事。不交钱，就别在这摆摊。」");
      arr.push("你站在人群里，看着这一切。你可以选择——上前帮忙，或者，假装没看见。");
      arr.push("集市的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"上前帮忙，赶走帮派成员", check:"STR", go:"karma_sprout_merchant", effect:{flag:"merchant_saved", karma:"compassion", hp:-5}, tier:{crit:function(){return["你冲上去，一拳打倒了领头人。其他两个人见状，跑了。老汤姆看着你，眼泪流了下来：「谢谢你……谢谢你……」他把一个木雕塞给你——是一只小鸟，做得很精致。「这是我做得最好的一个。给你。」"]},ok:function(){return["你上前理论，帮派成员想打你，但你比他们强壮。他们骂了几句，走了。老汤姆感激地看着你：「年轻人，你会有好报的。」"]},fail:function(){return["你上前帮忙，但帮派成员人多，你被打了一顿。摊子还是被砸了。老汤姆把你扶起来：「年轻人，你不该管的。」但他的眼里，有感激。"]},critfail:function(){return["你冲上去，但被帮派成员打倒在地。他们不仅砸了摊子，还抢了你身上的钱。老汤姆哭着把你扶起来：「是我害了你……」"]}} },
      { t:"偷偷报告给卫兵", check:"AGI", go:"karma_sprout_merchant", effect:{flag:"merchant_reported", karma:"indirect_help"} },
      { t:"不管，继续走自己的路", go:"karma_sprout_merchant", effect:{flag:"merchant_ignored", sanLoss:2, karma:"indifference"} }
    ]
  };
};

N["karma_sprout_merchant"] = function(){
  return {
    place: "学院 · 第一学期",
    text: function(){
      const arr = [];
      arr.push("学院第一学期的一天，你收到了一个包裹。");
      if(S.flags.merchant_saved || S.flags.merchant_reported){
        arr.push("包裹里是一些手工木工品——小鸟、小兔子、小盒子，都做得很精致。还有一封信。");
        arr.push("信是老汤姆写的：「年轻人，你可能不记得我了。但我记得你。你帮了我，我孙女的手术费凑够了，她现在很好。我没什么能报答你的，只有这些木工品。你在学院要好好的。——老汤姆」");
        arr.push("你看着那些木工品，心里暖暖的。你没想到，序章的一个小选择，会在几个月后，以这样的方式回来。");
      } else {
        arr.push("包裹是学院发的教材。你拆开，开始上课。");
        arr.push("但你偶尔会想起那个集市——老汤姆跪在地上的样子。你不知道他后来怎么样了。有时候，你会想——如果当时你上前了，会怎样？");
        arr.push("这个念头，会在你心里，存在很久。");
      }
      arr.push("你离了第一学期，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"继续学院生活", go:"karma_grow_merchant", effect:{time:30} }
    ]
  };
};

N["karma_grow_merchant"] = function(){
  return {
    place: "大陆 · 交汇城",
    text: function(){
      const arr = [];
      arr.push("几年后，你在交汇城的商业区，看到了一家店。");
      if(S.flags.merchant_saved || S.flags.merchant_reported){
        arr.push("店名叫「老汤姆木工」。店面不大，但很干净，里面摆满了精致的木工品。");
        arr.push("一个年轻女孩在店里招呼客人。她看到你，愣了一下，然后跑过来：「你是……你是当年救了我爷爷的那个人！」");
        arr.push("她是老汤姆的孙女。她说，老汤姆三年前去世了，但他的木工店，被她继承了。现在，她是交汇城小有名气的木工师傅。");
        arr.push("「爷爷临终前一直在说你。」女孩说。「他说，你是他的恩人。他让我——如果有一天遇到你，一定要报答你。」");
        arr.push("她给了你一张金卡——在她的店里，所有东西免费。而且，她可以帮你联系交汇城的商会——她的客户里，有很多有影响力的人。");
      } else {
        arr.push("店已经不存在了——那个位置，是一个废墟。");
        arr.push("你问旁边的店主，这里以前是什么。店主说：「几年前，这里有个木工店，老板叫老汤姆。后来帮派又来了，砸了店，老汤姆……气死了。他孙女被卖到了别的地方，不知道现在怎么样了。」");
        arr.push("你站在废墟前，很久没有说话。");
        arr.push("你想起了序章的那个集市——你选择了走开。而这个选择，导致了一个老人的死亡，和一个女孩的悲剧。");
        arr.push("因果，就是这样——你做的每一个选择，都在影响着别人的人生。");
      }
      arr.push("你与交汇城作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"karma_harvest_merchant", effect:{time:1} }
    ]
  };
};

N["karma_harvest_merchant"] = function(){
  return {
    place: "终局前 · 因果回收",
    text: function(){
      const arr = [];
      if(S.flags.merchant_saved || S.flags.merchant_reported){
        arr.push("终局之战前，你收到了一个消息——老汤姆的孙女，用她的商会关系，为你筹集了大量的物资和资金。");
        arr.push("她说：「爷爷说过，你是他的恩人。现在，轮到我们报答你了。」");
        arr.push("因为她的帮助，你的军队有了足够的补给。这在最终之战中，起到了关键作用。");
        arr.push("你站在军营里，看着源源不断的物资，想起了序章的那个集市——你只是做了一个小小的选择，而它，在几年后，拯救了整个大陆。");
      } else {
        arr.push("终局之战前，你的物资短缺。军队士气低落，很多人在想——这场战争，值得吗？");
        arr.push("你偶尔会想起老汤姆——如果你当时帮了他，也许现在，会有更多的人站在你这边。");
        arr.push("但没有如果。因果已经种下，你只能承担后果。");
        arr.push("不过——这也让你更加坚定。你不想让更多的人，因为你的「不选择」而受到伤害。");
      }
      arr.push("因果之网，就是这样——你做的每一个选择，都会在未来的某个时刻，回到你身边。或好，或坏。但这就是人生。");
      return arr;
    },
    options: [
      { t:"迎接最终之战", go:"fc_jiaohui_entry", effect:{flag:"karma_merchant_complete"} }
    ]
  };
};

// ============================================================
// v23 因果之网·学院种子（保护格罗姆）
// ============================================================
N["karma_seed_protect_grom"] = function(){
  plantKarmaSeed("seed_protect");
  return {
    place: "学院 · 食堂",
    text: function(){
      const arr = [];
      arr.push("你又一次在食堂看到了格罗姆被欺负。");
      arr.push("这次更过分——几个贵族学生把他的饭倒在地上，让他「像狗一样舔干净」。");
      arr.push("格罗姆的拳头攥得很紧，指节发白。你能感觉到，他在忍耐——但忍耐是有限度的。");
      arr.push("如果他动手了，他会被开除。兽人在人类学院，本来就不受欢迎。");
      arr.push("你站在旁边，看着这一切。你可以选择——上前帮忙，或者，看着。");
      arr.push("你与食堂作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"上前保护格罗姆，和贵族学生对峙", check:"CHA", go:"karma_sprout_protect", effect:{flag:"grom_protected", grom_bond:20, rep_noble:-10}, tier:{crit:function(){return["你走上前，把格罗姆拉到身后，然后看着那些贵族学生。「你们的父亲，教过你们什么是荣誉吗？」你的声音不大，但很有力量。贵族学生们被你震住了——他们知道你不是好惹的。最后，他们骂了几句，走了。格罗姆看着你，眼里有泪光：「你为什么帮我？」「因为你是我的同学。」你说。"]},ok:function(){return["你上前帮格罗姆说话，贵族学生们犹豫了一下，最后走了——他们不想把事情闹大。格罗姆很感激：「谢了。」"]},fail:function(){return["你上前帮忙，但贵族学生们不听，反而连你一起嘲笑。格罗姆不想让你受牵连，他拉住你：「算了。」然后他蹲下来，开始捡地上的食物。你看着他的背影，心里很不是滋味。"]},critfail:function(){return["你的介入让事情更糟——贵族学生们动手了，你和格罗姆都被打了。最后，教授来了，你们都被处分了。格罗姆看着你，很愧疚：「是我害了你。」"]}} },
      { t:"去找教授来处理", check:"AGI", go:"karma_sprout_protect", effect:{flag:"grom_professor_called", grom_bond:5} },
      { t:"不管，这是格罗姆自己的事", go:"karma_sprout_protect", effect:{flag:"grom_not_protected", grom_bond:-10, sanLoss:3} }
    ]
  };
};

N["karma_sprout_protect"] = function(){
  return {
    place: "学院 · 几天后",
    text: function(){
      const arr = [];
      if(S.flags.grom_protected || S.flags.grom_professor_called){
        arr.push("几天后，格罗姆来找你。");
        arr.push("他手里拿着一个东西——是他自己打的一把小匕首，很精致。「给你的。」他说，声音很低。「我没什么能报答你的。这个，是我做得最好的一把。」");
        arr.push("你接过匕首。它很锋利，也很平衡。你知道，格罗姆花了很多心思。");
        arr.push("「以后，」格罗姆说。「如果你有麻烦，我会帮你。不管是什么。」");
        arr.push("他的眼神很认真。你知道，他不是在说客套话。");
      } else {
        arr.push("几天后，你听说格罗姆和那些贵族学生打了一架。");
        arr.push("他被处分了——停学一周。那些贵族学生，因为有家族背景，只是被「警告」了一下。");
        arr.push("你在食堂又看到了格罗姆。他还是一个人坐在角落。但这次，他的眼神变了——不再是忍耐，而是……冷漠。");
        arr.push("你知道，有些东西，已经变了。");
      }
      arr.push("几天后的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"继续学院生活", go:"fc_jiaohui_entry", effect:{time:30} }
    ]
  };
};

// ============================================================
// v23 因果之网总览节点
// ============================================================
N["karma_web_overview"] = function(){
  karmaInit();
  return {
    place: "因果之网 · 总览",
    text: function(){
      const arr = [];
      arr.push("你闭上眼睛，回顾你的人生。");
      arr.push("你做过的选择——好的，坏的，对的，错的。它们像一张网，把你和很多人联系在一起。");
      arr.push("你已经种下了 " + S.karmaWeb.seeds.length + " 颗因果种子。");
      for(const seed of KARMA_WEB.seeds){
        if(S.karmaWeb.seeds.indexOf(seed.id) >= 0){
          arr.push("【" + seed.origin + "】" + seed.choice + "——" + seed.desc);
        }
      }
      arr.push("这些种子，有些已经发芽，有些已经成长，有些……还在等待收获的那一天。");
      arr.push("你不知道最终会怎样。但你知道——因果，不会消失。它只会在某个你意想不到的时刻，回到你身边。");
      return arr;
    },
    options: [
      { t:"睁开眼睛，继续旅程", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

console.log("[v23 ak] 同学录+因果之网系统已加载");


// ============================================================
// v23 灭族数据
// ============================================================
const EXTINCT_RACES_V23 = {
  dragon: {id:"dragon", name:"古代龙族", survivorCamp:"龙脊山深处", genocideTruth:"龙族是第一个发现七印真相的种族。他们试图公开真相，被黄林晶联合人类和精灵灭族。只有少数龙蛋被藏了起来。", legacy:"龙语魔法——最古老的魔法，能直接操控元素的本质。", revivalProgress:0},
  giant: {id:"giant", name:"巨人族", survivorCamp:"北方冰原", genocideTruth:"巨人族守护第一印，因为拒绝把印的控制权交给人类，被人类和矮人的联军灭族。", legacy:"大地之力——能操控山脉和地震的力量。", revivalProgress:0},
  avian: {id:"avian", name:"翼人族", survivorCamp:"云端废墟", genocideTruth:"翼人族能飞行，是最好的信使和侦察兵。他们发现了教会的秘密，被教会以「异端」的名义灭族。", legacy:"风之语——能操控风、天气，甚至短暂飞行。", revivalProgress:0},
  aquan: {id:"aquan", name:"水族", survivorCamp:"南方深海", genocideTruth:"水族知道第五印的真相，被黄林晶流放到深海。三千年了，他们在海底活着，但不算活着。", legacy:"水之形——能操控水、在水中呼吸，甚至化身为水。", revivalProgress:0},
  void: {id:"void", name:"虚空族", survivorCamp:"死亡沙漠地下", genocideTruth:"虚空族能「看到」深渊——他们的眼睛能直接看穿七印，看到原初之物。黄林晶害怕他们，把他们灭族了。", legacy:"虚空之眼——能看到真相、看穿谎言、甚至看到未来的碎片。", revivalProgress:0},
  crystal: {id:"crystal", name:"水晶族", survivorCamp:"矮人地心深处", genocideTruth:"水晶族是七印的「建造者」——他们帮助黄林晶建造了七印。完工后，黄林晶为了保密，把他们灭族了。", legacy:"水晶之心——能感知七印的状态，甚至和七印「对话」。", revivalProgress:0}
};

// ============================================================
// v23 神系数据
// ============================================================
const PANTHEONS_FULL_V23 = {
  light: {id:"light", name:"光明神系", domain:"光明、正义、秩序", alliance:["war"], enemy:["death"], followers:"教会区为主，全大陆都有信徒", faithLevel:0},
  nature: {id:"nature", name:"自然神系", domain:"自然、生命、平衡", alliance:["art"], enemy:["forge"], followers:"精灵王国为主，森林地区都有信徒", faithLevel:0},
  forge: {id:"forge", name:"锻造神系", domain:"锻造、工艺、创造", alliance:["war"], enemy:["nature"], followers:"矮人王国为主，工匠都有信仰", faithLevel:0},
  war: {id:"war", name:"战争神系", domain:"战争、勇气、荣誉", alliance:["light","forge"], enemy:["peace"], followers:"北方公国、兽人草原，战士都有信仰", faithLevel:0},
  wealth: {id:"wealth", name:"财富神系", domain:"财富、商业、运气", alliance:["knowledge"], enemy:["poverty"], followers:"南方城邦、自由城邦，商人都有信仰", faithLevel:0},
  knowledge: {id:"knowledge", name:"知识神系", domain:"知识、智慧、魔法", alliance:["wealth"], enemy:["ignorance"], followers:"学院、魔法师，全大陆的学者", faithLevel:0},
  death: {id:"death", name:"死亡神系", domain:"死亡、轮回、安息", alliance:["peace"], enemy:["light"], followers:"地下世界、墓地，被教会视为异端", faithLevel:0},
  storm: {id:"storm", name:"风暴神系", domain:"风暴、海洋、自由", alliance:[], enemy:[], followers:"沿海地区、水手、海盗", faithLevel:0},
  love: {id:"love", name:"爱情神系", domain:"爱情、美丽、艺术", alliance:["art"], enemy:["war"], followers:"全大陆，年轻人为主", faithLevel:0},
  art: {id:"art", name:"艺术神系", domain:"艺术、音乐、诗歌", alliance:["love","nature"], enemy:[], followers:"全大陆，艺术家、游吟诗人", faithLevel:0}
};

// ============================================================
// v23 引擎函数
// ============================================================
function raceFatesInit(){
  if(!S.raceFates){
    S.raceFates = {extinctHelp:[], raceRelations:{}, revivalProgress:{}, genocideTruths:[]};
    for(const rid in EXTINCT_RACES_V23){
      S.raceFates.revivalProgress[rid] = 0;
    }
  }
  return S.raceFates;
}

function faithBoardInit(){
  if(!S.faithBoard){
    S.faithBoard = {faiths:{}, currentPantheon:null, piety:0, miraclesReceived:[], curses:[]};
    for(const pid in PANTHEONS_FULL_V23){
      S.faithBoard.faiths[pid] = 0;
    }
  }
  return S.faithBoard;
}

// ============================================================
// v23 灭族·龙族幸存者
// ============================================================
N["extinct_dragon_clue"] = function(){
  raceFatesInit();
  return {
    place: "龙脊山 · 山脚",
    text: function(){
      const arr = [];
      arr.push("你在龙脊山的山脚，发现了一个洞穴。");
      arr.push("洞穴的入口被藤蔓遮住了，但你能感觉到——里面有什么东西在「呼吸」。不是风，是……生命。");
      arr.push("你拨开藤蔓，走了进去。洞穴很深，墙壁上有古老的壁画——画着龙，和人类并肩作战。");
      arr.push("然后你看到了——一颗蛋。");
      arr.push("巨大的蛋，比你还高。蛋壳上有金色的纹路，在泛着微光。它在「呼吸」——一收一缩，像是在沉睡。");
      arr.push("你靠近它，感觉到了一股古老的、强大的气息。这是……龙的气息。");
      arr.push("龙族，不是已经灭绝了吗？三千年了，所有人都以为龙族已经消失了。但这里——有一颗龙蛋。");
      arr.push("你伸出手，想触摸它。然后，你听到了一个声音——不是用耳朵听到的，是直接出现在你脑海里的。");
      arr.push("「……你是谁？」");
      arr.push("你离了山脚，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"回应它，告诉它你没有恶意", check:"SPR", go:"extinct_dragon_survivor", effect:{flag:"dragon_egg_contact", sanLoss:5}, tier:{crit:function(){return["你闭上眼睛，用灵魂感知回应它。「我是一个旅人。我不会伤害你。」沉默了很久，然后那个声音又响了：「……你能看到符文？」你说是。「那……你是来唤醒我的吗？」"]},ok:function(){return["你轻声说你没有恶意。那个声音沉默了一会儿，然后说：「……人类。三千年了，还是有人类敢来这里。」"]},fail:function(){return["你试图回应，但你的灵魂感知太弱了。那个声音消失了，龙蛋的光也暗了下去。你站在原地，不知道该怎么办。"]},critfail:function(){return["你的回应被「反弹」了——龙蛋里的存在，感觉到了你的恐惧。它发出了一声尖叫，在你脑海里炸开。你跪在地上，鼻血都流了出来。过了很久，你才恢复。"]}} },
      { t:"离开，不打扰它", go:"extinct_dragon_survivor", effect:{flag:"dragon_egg_left", karma:"caution"} },
      { t:"尝试研究蛋壳上的符文", check:"INT", go:"extinct_dragon_survivor", effect:{knowledge:20, flag:"dragon_runes_studied"} }
    ]
  };
};

N["extinct_dragon_survivor"] = function(){
  return {
    place: "洞穴深处 · 龙蛋",
    text: function(){
      const arr = [];
      arr.push("你在洞穴里待了很久。");
      if(S.flags.dragon_egg_contact){
        arr.push("慢慢地，那个声音开始和你交流。");
        arr.push("它说它叫「曦」——是最后一颗龙蛋。它的母亲在灭族之战中，把它藏在了这里，然后用自己的生命封印了洞穴，让它沉睡了三千年。");
        arr.push("「龙族……不是怪物。」曦说。「我们是第一个发现七印真相的种族。我们想告诉所有人——七印不是封印深渊，是喂养原初之物。但黄林晶害怕了。他联合人类和精灵，灭了我们。」");
        arr.push("「只有我，活了下来。以蛋的形式。」");
        arr.push("你问它，为什么选择和你说话。");
        arr.push("「因为你能看到符文。」曦说。「因为你在查七印的真相。因为……你可能是三千年后，第一个能「理解」我们的人。」");
        arr.push("「你愿意帮我吗？帮我复活龙族？」");
      } else {
        arr.push("你离开了洞穴。但你知道，你还会回来的。");
        arr.push("那颗龙蛋，那个声音——它们在你心里，留下了印记。");
        arr.push("你开始查龙族的历史。官方版本说，龙族是「深渊的走狗」，被英雄黄林晶消灭了。但你在禁书区找到了一本旧书——上面说，龙族是「智慧的种族」，他们的灭亡，有隐情。");
      }
      arr.push("从龙蛋出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"答应帮助曦，复活龙族", go:"extinct_dragon_truth", effect:{flag:"dragon_revival_promised", karma:"hope"} },
      { t:"说需要考虑，先调查真相", go:"extinct_dragon_truth", effect:{flag:"dragon_investigate", knowledge:10} },
      { t:"拒绝，龙族太危险了", go:"extinct_dragon_truth", effect:{flag:"dragon_refused", karma:"fear"} }
    ]
  };
};

N["extinct_dragon_truth"] = function(){
  return {
    place: "禁书区 · 龙族真相",
    text: function(){
      const arr = [];
      arr.push("你在禁书区找到了真相。");
      arr.push("一本三千年的日记——作者是黄林晶的助手。上面写着：");
      arr.push("「龙族发现了七印的真相。他们要公开。黄林晶说——不行。如果人们知道七印在喂养原初之物，会恐慌。恐慌会让原初之物更强。所以，必须让龙族沉默。」");
      arr.push("「黄林晶联合了人类和精灵，对龙族发动了突袭。龙族没有防备——他们以为黄林晶是朋友。」");
      arr.push("「灭族之战持续了七天。最后一条龙，是曦的母亲。她把蛋藏好，然后用自己的生命，封印了洞穴。」");
      arr.push("「黄林晶知道还有一颗蛋。但他没有去找——他说，「给他们留一个希望吧。也许，三千年后，会有人能做出不同的选择。」」");
      arr.push("你合上书，很久没有说话。");
      arr.push("黄林晶——不是纯粹的英雄，也不是纯粹的恶人。他做了一个艰难的选择，然后用三千年的时间，来合理化自己的选择。");
      arr.push("而龙族——是这个选择的代价。");
      arr.push("离开龙族真相时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"回到洞穴，告诉曦真相", go:"extinct_dragon_choice", effect:{flag:"dragon_truth_told", sanLoss:10} },
      { t:"不告诉曦，有些真相太残酷", go:"extinct_dragon_choice", effect:{flag:"dragon_truth_hidden", karma:"mercy"} },
      { t:"把日记公之于众", go:"extinct_dragon_choice", effect:{flag:"dragon_truth_public", rep_church:-20, karma:"truth"} }
    ]
  };
};

N["extinct_dragon_choice"] = function(){
  return {
    place: "洞穴 · 最终抉择",
    text: function(){
      const arr = [];
      arr.push("你回到了洞穴，站在龙蛋前。");
      if(S.flags.dragon_truth_told){
        arr.push("你把真相告诉了曦。");
        arr.push("沉默了很久。然后，曦说：「我知道。我母亲在封印前，把记忆传给了我。我一直知道。」");
        arr.push("「但我不恨黄林晶。」曦说。「他做了他认为对的事。只是……他的选择，让我们付出了代价。」");
        arr.push("「现在，轮到你做选择了。你可以唤醒我——龙族会复活。但你也可以让我继续沉睡——龙族的时代，已经过去了。」");
      } else {
        arr.push("曦感觉到了你的犹豫。");
        arr.push("「你查到了什么，对吗？」它说。「没关系。不管真相是什么，我都已经等了三千年。我不介意再等一等。」");
        arr.push("「但你要做一个选择——唤醒我，还是让我继续睡。」");
      }
      arr.push("你看着龙蛋——金色的纹路，一收一缩，像是在呼吸。三千年了，它一直在等。");
      arr.push("你的选择，会决定一个种族的命运。");
      return arr;
    },
    options: [
      { t:"唤醒曦，让龙族复活", check:"SPR", go:"extinct_dragon_outcome", effect:{flag:"dragon_awakened", sanLoss:15, item:"龙鳞护符"}, tier:{crit:function(){return["你把手放在龙蛋上，用全部的灵魂感知，呼唤曦。蛋壳裂开了——金色的光充满了整个洞穴。一条小龙，从蛋里钻了出来。它很小，但它的眼睛里，有三千年的智慧。「谢谢你。」曦说。「从今天起，龙族回来了。」"]},ok:function(){return["你试图唤醒曦，蛋壳裂开了一条缝。曦的意识更清晰了——它还需要时间才能完全孵化，但它在「醒」。「谢谢你。」它说。「我会记得你的。」"]},fail:function(){return["你的灵魂感知不够强，无法唤醒曦。蛋壳没有变化。曦说：「没关系。也许，时机还没到。你可以先走，等你更强了，再来。」"]},critfail:function(){return["你的唤醒尝试失败了——而且，蛋壳上出现了裂痕。曦的声音变得虚弱：「你……差点杀了我。」你很愧疚。曦说：「走吧。让我自己待一会儿。」"]}} },
      { t:"让曦继续沉睡，龙族的时代过去了", go:"extinct_dragon_outcome", effect:{flag:"dragon_sleeping", sanLoss:5, karma:"acceptance"} },
      { t:"带走龙蛋，找一个更安全的地方", go:"extinct_dragon_outcome", effect:{flag:"dragon_egg_taken", item:"龙蛋"} }
    ]
  };
};

N["extinct_dragon_outcome"] = function(){
  return {
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.dragon_awakened){
        arr.push("曦孵化了。");
        arr.push("它很小——只有猫那么大。但它成长得很快。几个月后，它就有马那么大了。一年后，它能飞了。");
        arr.push("它成了你的伙伴——不是宠物，是朋友。它叫你「唤醒者」。");
        arr.push("龙族的回归，在大陆上引起了轰动。有人害怕，有人好奇，有人崇拜。但曦说——「我们不想统治世界。我们只是想，活下去。」");
        arr.push("终局之战中，曦和它的后代（它找到了其他藏起来的龙蛋），成了你的重要盟友。龙的力量，在对抗深渊时，起到了关键作用。");
      } else if(S.flags.dragon_sleeping){
        arr.push("你离开了洞穴，没有唤醒曦。");
        arr.push("但你偶尔会回去看它——带一些食物，坐在洞穴里，和它说说话。它还在沉睡，但你能感觉到，它在听。");
        arr.push("终局之战中，你没有龙的帮助。但你知道——在某个洞穴里，有一个古老的种族，在沉睡。也许，下一个时代，他们会醒来。");
      } else {
        arr.push("你带走了龙蛋。");
        arr.push("你找了一个安全的地方，把它藏了起来。你不知道什么时候会唤醒它——也许永远不会。但至少，它在你手里，是安全的。");
        arr.push("你偶尔会看看它——金色的纹路，一收一缩。它还在等。");
      }
      arr.push("不管你选了什么，你知道——龙族的故事，没有结束。它只是，换了一种方式继续。");
      arr.push("出了事件之后，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 灭族·水族（第五印关联）
// ============================================================
N["extinct_aquan_clue"] = function(){
  raceFatesInit();
  return {
    place: "南方港城 · 码头",
    text: function(){
      const arr = [];
      arr.push("你在南方港城的码头，听到了一个传说。");
      arr.push("老水手们说——海里有「人」。不是人鱼，是……水族。他们在海底建了城市，三千年了，一直在那里。");
      arr.push("「水族？」你问。「不是已经灭绝了吗？」");
      arr.push("老水手摇头：「官方说灭绝了。但我们跑海的人都知道——他们还在。有时候，暴风雨的时候，能看到他们的影子。」");
      arr.push("「他们不伤害人。但也不接近人。他们只是……在那里。」");
      arr.push("你想起了第五印——南方深海。黄林晶的信里说过，他「流放」了海族。");
      arr.push("也许，水族就是被流放的种族。也许，他们知道第五印的真相。");
      arr.push("你决定——去海底看看。");
      arr.push("码头的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"找一艘船，出海", go:"extinct_aquan_survivor", effect:{gold:-50, time:3} },
      { t:"先查水族的历史", check:"INT", go:"extinct_aquan_survivor", effect:{knowledge:15, time:2} },
      { t:"放弃，太危险了", go:"fc_jiaohui_entry", effect:{flag:"aquan_abandoned"} }
    ]
  };
};

N["extinct_aquan_survivor"] = function(){
  return {
    place: "南方深海 · 水族城市",
    text: function(){
      const arr = [];
      arr.push("你用魔法（或者找了一个会水魔法的人），潜入了深海。");
      arr.push("然后你看到了——一座城市。");
      arr.push("在海底，用珊瑚和珍珠建的城市。发着柔和的蓝光。有「人」在里面游动——他们有腿，但也有鳃。他们的皮肤是淡蓝色的，眼睛很大。");
      arr.push("水族。他们真的还在。");
      arr.push("他们发现了你。一开始很警惕——但当他们看到你能「看到符文」的时候，态度变了。");
      arr.push("一个年老的水族游过来。他的鳞片已经发白了，但眼睛很亮。");
      arr.push("「三千年了。」他说。「终于，有人类能看到符文了。」");
      arr.push("「你是来问第五印的事吧？」他说。「跟我来。我告诉你，黄林晶对我们做了什么。」");
      arr.push("水族城市已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"跟他去，听真相", go:"extinct_aquan_truth", effect:{flag:"aquan_truth_heard", knowledge:20} },
      { t:"问他们在这里生活得怎么样", check:"CHA", go:"extinct_aquan_truth", effect:{flag:"aquan_life_asked", aquan_bond:10} }
    ]
  };
};

N["extinct_aquan_truth"] = function(){
  return {
    place: "水族城市 · 长老殿",
    text: function(){
      const arr = [];
      arr.push("老水族带你去了长老殿。");
      arr.push("殿里有一幅壁画——画着三千年前的事。");
      arr.push("「我们水族，是第五印的守护者。」老水族说。「第五印在深海，我们世代守护它。但黄林晶来了——他说，我们知道得太多了。」");
      arr.push("「他没有杀我们。他把我们「流放」了——用魔法，把我们困在深海，永远不能上岸。三千年了。我们的孩子，从来没有见过太阳。」");
      arr.push("「他说这是「保护」——保护我们不被深渊污染。但我们知道，这是「囚禁」。他害怕我们把第五印的真相说出去。」");
      arr.push("你问，第五印的真相是什么。");
      arr.push("老水族看着你。「第五印里，是「嫉妒」。原初之物的一部分。它在「看」——看着大陆上的一切，然后嫉妒。嫉妒生命，嫉妒光明，嫉妒自由。」");
      arr.push("「我们守护它，是因为我们能「安抚」它。水族的歌声，能让嫉妒平静。但三千年了，我们的歌声越来越弱。第五印，快要碎了。」");
      arr.push("从长老殿出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"问能不能帮他们解除流放", check:"INT", go:"extinct_aquan_choice", effect:{flag:"aquan_liberation_asked", knowledge:10} },
      { t:"问怎么修复第五印", go:"extinct_aquan_choice", effect:{flag:"aquan_seal_fix_asked", knowledge:15} },
      { t:"对他们的遭遇表示同情", go:"extinct_aquan_choice", effect:{flag:"aquan_empathy", aquan_bond:15} }
    ]
  };
};

N["extinct_aquan_choice"] = function(){
  return {
    place: "长老殿 · 抉择",
    text: function(){
      const arr = [];
      arr.push("老水族听完你的话，点了点头。");
      arr.push("「你是个好人。」他说。「三千年了，第一个愿意听我们说话的人类。」");
      arr.push("「我给你一个选择。」他说。「第一，你可以帮我们解除流放——让我们重新回到大陆。但这会让第五印失去守护者，它会碎得更快。」");
      arr.push("「第二，你可以帮我们修复第五印——但这需要我们继续守护，继续被囚禁。」");
      arr.push("「第三，你可以找到「第三种方法」——既让我们自由，又让第五印稳定。但我不知道那是什么。」");
      arr.push("「你选哪个？」");
      return arr;
    },
    options: [
      { t:"帮他们解除流放，自由比封印更重要", go:"extinct_aquan_outcome", effect:{flag:"aquan_liberated", aquan_bond:30, abyssDelta:10, karma:"freedom"} },
      { t:"帮他们修复第五印，稳定优先", check:"INT", go:"extinct_aquan_outcome", effect:{flag:"aquan_seal_fixed", aquan_bond:10, abyssDelta:-10}, tier:{crit:function(){return["你用水族教你的歌声，加上你对符文的理解，修复了第五印。它稳定了——至少，能再撑一千年。老水族看着你，眼里有泪：「谢谢你。虽然我们还是不能自由，但至少……世界安全了。」"]},ok:function(){return["你尝试修复第五印，有效果——它稳定了一些。但还不够。老水族说：「没关系。至少，你尽力了。」"]},fail:function(){return["你的修复尝试失败了——第五印反而更不稳定了。老水族叹了口气：「没关系。这不是你的错。」"]},critfail:function(){return["你的修复尝试出了大问题——第五印裂开了一条缝，「嫉妒」的气息泄露出来。你感觉到了——纯粹的、让人疯狂的嫉妒。你花了很大力气才把缝补上。老水族很担心：「你……还好吗？」"]}} },
      { t:"承诺找到第三种方法", go:"extinct_aquan_outcome", effect:{flag:"aquan_third_way", aquan_bond:20, karma:"hope"} }
    ]
  };
};

N["extinct_aquan_outcome"] = function(){
  return {
    place: "事件之后",
    text: function(){
      const arr = [];
      if(S.flags.aquan_liberated){
        arr.push("你帮水族解除了流放。");
        arr.push("他们终于回到了大陆——三千年了，第一次看到太阳。很多水族哭了。");
        arr.push("但第五印失去了守护者，碎得更快了。深渊的进度，加快了。");
        arr.push("老水族在离开前对你说：「谢谢你给我们自由。我们会用我们的方式，帮助世界。」");
        arr.push("后来，水族成了你的重要盟友——他们的歌声，在对抗深渊时，起到了意想不到的作用。");
      } else if(S.flags.aquan_seal_fixed){
        arr.push("你帮水族修复了第五印。");
        arr.push("它稳定了。但水族，还是要继续守护，继续被囚禁。");
        arr.push("老水族送了你一个珍珠——「这是我们的感谢。如果你需要我们，就对着它唱歌。我们会听到的。」");
        arr.push("你离开了深海。但你知道——在某个海底，有一个种族，在为了世界，默默牺牲。");
      } else {
        arr.push("你承诺找到第三种方法。");
        arr.push("老水族给了你一个信物——「当你找到方法的时候，回来找我们。」");
        arr.push("你带着信物，开始了寻找。你不知道能不能找到，但你知道——你必须找到。因为，这是你对一个种族的承诺。");
      }
      arr.push("水族的故事，让你明白了——黄林晶的「拯救」，对某些种族来说，是「囚禁」。而你的选择，可能会改变这一切。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 信仰棋盘·光明神系
// ============================================================
N["faith_light_intro"] = function(){
  faithBoardInit();
  return {
    place: "圣城 · 大教堂",
    text: function(){
      const arr = [];
      arr.push("你站在圣城的大教堂里。");
      arr.push("很高，很亮。阳光透过彩色玻璃窗，在地上投下斑斓的光。信徒们跪在地上，祈祷。空气中有香的味道。");
      arr.push("一个牧师走过来。「旅人，你是来祈祷的吗？」他问。「光明神会保佑所有虔诚的人。」");
      arr.push("你看着祭坛上的光明神像——一个穿着白袍的人，手里举着太阳。");
      arr.push("你想起了夜莺的话——教会知道七印的真相，但他们不说。你想起了净化令——教会在烧「异端」。");
      arr.push("但你也看到了——教堂里，有穷人在领食物，有病人在接受治疗。教会，确实在帮助人。");
      arr.push("光明，是真实的。但光明背后的阴影，也是真实的。");
      arr.push("牧师看着你，等你的回答。");
      arr.push("你离了大教堂，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"跪下祈祷，表达对光明神的信仰", go:"faith_light_oracle", effect:{flag:"faith_light_prayed", faith_light:10, sanRecovery:5} },
      { t:"问牧师关于七印的事", check:"INT", go:"faith_light_oracle", effect:{flag:"faith_light_seals_asked", knowledge:10} },
      { t:"不祈祷，只是参观", go:"faith_light_oracle", effect:{flag:"faith_light_visitor", faith_light:-5} }
    ]
  };
};

N["faith_light_oracle"] = function(){
  return {tag:"branch",
    place: "大教堂 · 神谕",
    text: function(){
      const arr = [];
      if(S.flags.faith_light_prayed){
        arr.push("你跪下祈祷。");
        arr.push("一开始，什么都没有。然后——你感觉到了。一股温暖的力量，从头顶流下来。不是魔法，是……信仰。");
        arr.push("你听到了一个声音——不是具体的话语，是一种「感觉」。光明神在「听」你。");
        arr.push("牧师惊讶地看着你：「你……你得到了神谕。光明神回应了你的祈祷。」");
        arr.push("他给了你一个徽章——光明神的圣徽。「戴着它，在教会的土地上，你会得到帮助。」");
      } else {
        arr.push("你在教堂里参观了一圈。");
        arr.push("你注意到，教堂的地下室，有一扇门，被两个骑士守着。你问牧师那是什么。");
        arr.push("牧师的表情变了一下。「那是……禁地。只有红衣主教才能进。」");
        arr.push("你不知道里面是什么。但你能感觉到——门后面，有什么东西。也许，是教会不想让人知道的秘密。");
      }
      arr.push("神谕的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"接受圣徽，成为光明神的信徒", go:"faith_light_miracle", effect:{flag:"faith_light_believer", item:"光明神圣徽", faith_light:20} },
      { t:"调查地下室的秘密", check:"AGI", go:"faith_light_miracle", effect:{flag:"faith_light_basement", knowledge:20, sanLoss:10}, tier:{crit:function(){return["你趁夜潜入了地下室。里面是一个档案室——三千年的秘密。你看到了：教会知道七印的真相，知道「深渊」是谎言。但他们不说——因为真相会动摇教会的根基。你还看到了净化令的真实名单——很多被烧死的「异端」，只是知道了太多。你带着证据，离开了。"]},ok:function(){return["你试图潜入地下室，但被发现了。你被赶了出来。但你在被赶之前，看到了一些文件——关于七印的，关于净化令的。虽然不完整，但足够让你知道——教会在隐瞒什么。"]},fail:function(){return["你没能潜入地下室——守卫太严了。你放弃了。但你知道，那里一定有秘密。"]},critfail:function(){return["你潜入地下室，被抓住了。你被关了一夜，第二天被「驱逐」出圣城。牧师在你走之前说：「有些事，不该知道。」你不知道他是在威胁你，还是在保护你。"]}} },
      { t:"离开教堂", go:"faith_light_miracle", effect:{} }
    ]
  };
};

N["faith_light_miracle"] = function(){
  return {tag:"branch",
    place: "圣城 · 神迹",
    text: function(){
      const arr = [];
      if(S.flags.faith_light_believer){
        arr.push("你成了光明神的信徒。");
        arr.push("几天后，你在圣城的街上，遇到了一个病人——他得了不治之症，医生说没救了。");
        arr.push("你想起了牧师的话——「光明神会保佑虔诚的人。」你把手放在病人身上，祈祷。");
        arr.push("然后——奇迹发生了。金色的光从你手里流出来，病人的脸色，慢慢好了起来。");
        arr.push("周围的人都跪了下来。「神迹！」他们喊。「光明神显灵了！」");
        arr.push("你自己也很惊讶。你不知道这是光明神的力量，还是你自己的力量。但你知道——从今天起，你在教会的土地上，会受到尊敬。");
      } else if(S.flags.faith_light_basement){
        arr.push("你带着教会的秘密，离开了圣城。");
        arr.push("你不知道该怎么处理这些证据——公开它们，会动摇教会的根基，可能会造成混乱。不公开，就是帮教会隐瞒。");
        arr.push("你把证据收好，决定——等你更了解真相的时候，再做决定。");
      } else {
        arr.push("你离开了教堂。");
        arr.push("但你偶尔会想起——那扇被守住的门，门后面的秘密。也许，有一天你会回去，把它打开。");
      }
      arr.push("神迹的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

// ============================================================
// v23 信仰棋盘·总览
// ============================================================
N["faith_board_overview"] = function(){
  faithBoardInit();
  return {
    place: "信仰棋盘 · 总览",
    text: function(){
      const arr = [];
      arr.push("你闭上眼睛，感受这个世界的信仰。");
      arr.push("十大神系，像十颗星星，在大陆的上空闪烁。有的亮，有的暗。有的互相靠近，有的互相远离。");
      arr.push("你的信仰值：");
      for(const pid in PANTHEONS_FULL_V23){
        const p = PANTHEONS_FULL_V23[pid];
        const lvl = S.faithBoard.faiths[pid] || 0;
        arr.push("【" + p.name + "】" + p.domain + "——信仰值：" + lvl);
      }
      arr.push("信仰，不是迷信。它是一种……联系。你相信什么，你就会得到什么的回应。");
      arr.push("但要小心——信仰也是一种束缚。你相信得越深，你就越难离开。");
      return arr;
    },
    options: [
      { t:"睁开眼睛，继续旅程", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

// ============================================================
// v23 万族共存结局（隐藏）
// ============================================================
N["ending_all_races"] = function(){
  raceFatesInit();
  return {
    place: "终局 · 万族共存",
    text: function(){
      const arr = [];
      arr.push("终局之战后，你做了一件没有人想到的事。");
      arr.push("你把所有灭族的幸存者，都召集到了一起。");
      arr.push("龙族——曦和它的后代。");
      arr.push("巨人族——北方冰原的最后几个巨人。");
      arr.push("翼人族——云端废墟的幸存者。");
      arr.push("水族——从深海回到大陆的人们。");
      arr.push("虚空族——死亡沙漠地下的最后一族。");
      arr.push("水晶族——矮人地心深处的建造者后裔。");
      arr.push("六个种族，六支最后的血脉。他们站在一起，看着你。");
      arr.push("「三千年了。」曦说。「我们以为，我们会永远消失。」");
      arr.push("「但你给了我们希望。」老水族说。「你证明了——不同的种族，可以共存。」");
      arr.push("你宣布——大陆，不再只有人类、精灵、矮人、兽人。所有的种族，都有权利活下去。");
      arr.push("这是一个新的时代。一个万族共存的时代。");
      arr.push("而你，是这个时代的开启者。");
      arr.push("万族共存的盟约，是在一座废墟上签的。");arr.push("那曾是某个古老帝国的王城，如今只剩下断壁残垣。可那天，残垣上站满了人——龙族、巨人、翼人、水族、虚空族、水晶族，还有人类、精灵、矮人、兽人。");arr.push("签字的时候，没有人说话。笔落在羊皮纸上的声音，一下一下，像锤子敲进地里。");arr.push("有人哭了。有人没有。大多数人只是沉默地站着，看着那张羊皮纸，像看着一个不敢相信的梦。");arr.push("你最后签的字。笔尖落下的时候，你想起很多年前，你第一次离开家乡的那个早晨。那时候你不知道，你会走到这里。");arr.push("你抬起头。阳光从云缝里漏下来，落在那些断壁上。断壁还是断壁，可站在这片断壁上的人，已经不再是原来的他们了。");return arr;
    } /*v45inj:ending_all_races*/,
    options: [
      { t:"迎接新时代", go:"fc_jiaohui_entry", effect:{flag:"all_races_ending", karma:"hope"} }
    ]
  };
};

console.log("[v23 al] 万族黄昏+信仰棋盘系统已加载");


// ============================================================
// v23 编年史数据
// ============================================================
const CHRONICLE_TEMPLATE = {
  prologue_end: {
    official: "艾尔达历XXXX年，一个年轻人离开了故乡，前往学院求学。",
    folk: "听说了吗？XX地方出了个能看到符文的孩子，被学院录取了！",
    truth: "主角离开了出身地。他/她不知道的是，从这一刻起，历史的车轮已经开始转动。"
  },
  academy_year1: {
    official: "XXXX年，学院招收了一批新生。其中一人表现优异，引起了教授们的注意。",
    folk: "今年的新生里有个厉害角色，听说入学考试拿了第一名！",
    truth: "主角开始了学院生活。他/她遇到了未来的朋友和敌人，也第一次接触到了七印的真相。"
  },
  academy_year2: {
    official: "XXXX年，净化令升级，学院加强了对灵魂魔法的管制。",
    folk: "教会又来抓人了！听说学院里有几个学生被带走了。",
    truth: "净化令波及学院。主角第一次意识到——这个世界，比他/她想的更复杂。"
  },
  academy_year3: {
    official: "XXXX年，学院地下遗迹出现异常，专家组进驻调查。",
    folk: "学院地下闹鬼了！有人说听到了奇怪的声音。",
    truth: "深渊封印松动的征兆，第一次出现在学院。主角开始了真正的调查。"
  },
  academy_graduation: {
    official: "XXXX年，一批优秀学生毕业，奔赴大陆各地。",
    folk: "那一届的毕业生了不得，出了好几个大人物！",
    truth: "主角毕业了。五年的学院生活结束了。他/她带着知识、友谊和秘密，进入了更广阔的世界。"
  },
  seal_1: {
    official: "XXXX年，铁门关地区发生地震，原因不明。",
    folk: "铁门关又出事了！听说地底下有东西在动。",
    truth: "主角到达了第一印。他/她发现了兽人守护的真相，也做出了第一个影响世界的选择。"
  },
  seal_2: {
    official: "XXXX年，兽人草原出现异常天气，萨满举行了大仪式。",
    folk: "兽人那边在搞什么？天都变红了！",
    truth: "主角到达了第二印。他/她了解了兽人的牺牲，也面对了「愤怒」的考验。"
  },
  seal_3: {
    official: "XXXX年，精灵王国世界树出现枯萎迹象，精灵女王宣布闭关。",
    folk: "精灵的世界树要死了？那可是他们的神树啊！",
    truth: "主角到达了第三印。他/她发现了精灵女王和黄林晶的旧约，也面对了「傲慢」的真相。"
  },
  seal_4: {
    official: "XXXX年，矮人王国熔炉温度异常升高，矮人王下令封锁地心。",
    folk: "矮人的熔炉要炸了？听说地心里有东西在烧。",
    truth: "主角到达了第四印。他/她发现了矮人的沉默，也面对了「贪婪」的诱惑。"
  },
  seal_5: {
    official: "XXXX年，南方海域出现异常海啸，沿海城市受灾。",
    folk: "海里有东西！有人说看到了巨大的影子！",
    truth: "主角到达了第五印。他/她遇到了被流放的水族，也面对了「嫉妒」的痛苦。"
  },
  seal_6: {
    official: "XXXX年，东部王国后山出现时空异常，承天书院封锁禁地。",
    folk: "承天书院后山闹鬼了！有人说看到了三千年前的人！",
    truth: "主角到达了第六印。他/她穿越到了过去，见到了年轻的黄林晶，也知道了七印被建造的真实过程。"
  },
  seal_7: {
    official: "XXXX年，死亡沙漠出现大规模异象，教会宣布为「末日征兆」。",
    folk: "世界要完了！沙漠里有魔鬼出来了！",
    truth: "主角到达了第七印。他/她面对了最终抉择——封印、解放，还是共存。"
  },
  abyss_war: {
    official: "XXXX年，深渊降临，大陆联军在死亡沙漠与深渊生物决战。",
    folk: "最终之战！所有人都在打！听说英雄们都去了！",
    truth: "深渊降临。主角和他/她的朋友们，站在了最终战场上。这是决定世界命运的一战。"
  }
};

// ============================================================
// v23 引擎函数
// ============================================================
function chronicleInit(){
  if(!S.chronicle){
    S.chronicle = {entries:[], currentEra:"序章", reputation:0, officialVersion:[], folkVersion:[], truthVersion:[]};
  }
  return S.chronicle;
}

function chronicleRecord(eventId, customText){
  chronicleInit();
  const template = CHRONICLE_TEMPLATE[eventId];
  if(template){
    S.chronicle.entries.push({
      id: eventId,
      year: S.day ? Math.floor(S.day/365) + 1 : 1,
      official: customText ? customText.official : template.official,
      folk: customText ? customText.folk : template.folk,
      truth: customText ? customText.truth : template.truth,
      playerInvolvement: true
    });
  }
  return S.chronicle.entries.length;
}

function getChronicleEntry(eventId){
  chronicleInit();
  for(const e of S.chronicle.entries){
    if(e.id === eventId) return e;
  }
  return null;
}

// ============================================================
// v23 编年史·序章结束记录
// ============================================================
N["chronicle_prologue_end"] = function(){
  chronicleRecord("prologue_end");
  return {
    place: "编年史 · 序章结束",
    text: function(){
      const arr = [];
      arr.push("【编年史·第一卷】");
      arr.push("");
      arr.push("艾尔达历第一年，春。");
      arr.push("");
      arr.push("官方记载：一个年轻人离开了故乡，前往学院求学。");
      arr.push("");
      arr.push("民间传说：听说了吗？XX地方出了个能看到符文的孩子，被学院录取了！");
      arr.push("");
      arr.push("真实记录：主角离开了出身地。他/她不知道的是，从这一刻起，历史的车轮已经开始转动。");
      arr.push("");
      arr.push("你站在学院的门口，回头看了一眼来路。");
      arr.push("你不知道未来会怎样。但你知道——从今天起，你不再是一个普通人了。");
      arr.push("你的名字，会被写进历史。或者，被历史遗忘。");
      arr.push("但不管怎样，你来了。");
      return arr;
    },
    options: [
      { t:"进入学院", go:"fc_jiaohui_entry", effect:{flag:"chronicle_prologue_recorded"} }
    ]
  };
};

// ============================================================
// v23 编年史·第一学年结束
// ============================================================
N["chronicle_academy_year1"] = function(){
  chronicleRecord("academy_year1");
  return {
    place: "编年史 · 第一学年",
    text: function(){
      const arr = [];
      arr.push("【编年史·第二卷】");
      arr.push("");
      arr.push("艾尔达历第一年，冬。");
      arr.push("");
      arr.push("官方记载：学院招收了一批新生。其中一人表现优异，引起了教授们的注意。");
      arr.push("");
      arr.push("民间传说：今年的新生里有个厉害角色，听说入学考试拿了第一名！");
      arr.push("");
      arr.push("真实记录：主角开始了学院生活。他/她遇到了未来的朋友和敌人，也第一次接触到了七印的真相。");
      arr.push("");
      arr.push("第一学年结束了。");
      arr.push("你站在学院的钟楼下，看着雪花飘落。这一年，你学到了很多——魔法、战斗、历史，还有……人心。");
      arr.push("你认识了塞西莉亚，那个冷淡但内心柔软的天才少女。");
      arr.push("你认识了格罗姆，那个被歧视但善良的兽人少年。");
      arr.push("你认识了墨丘利，那个玩世不恭但深藏秘密的教授。");
      arr.push("你也第一次感觉到——这个世界，比你想的更复杂，更危险。");
      arr.push("但你不后悔。因为，你正在变得更强。");
      arr.push("你与第一学年作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"进入第二学年", go:"fc_jiaohui_entry", effect:{flag:"chronicle_year1_recorded", time:60} }
    ]
  };
};

// ============================================================
// v23 编年史·毕业记录
// ============================================================
N["chronicle_academy_graduation"] = function(){
  chronicleRecord("academy_graduation");
  return {
    place: "编年史 · 毕业",
    text: function(){
      const arr = [];
      arr.push("【编年史·第六卷】");
      arr.push("");
      arr.push("艾尔达历第五年，夏。");
      arr.push("");
      arr.push("官方记载：一批优秀学生毕业，奔赴大陆各地。");
      arr.push("");
      arr.push("民间传说：那一届的毕业生了不得，出了好几个大人物！");
      arr.push("");
      arr.push("真实记录：主角毕业了。五年的学院生活结束了。他/她带着知识、友谊和秘密，进入了更广阔的世界。");
      arr.push("");
      arr.push("毕业典礼那天，阳光很好。");
      arr.push("你穿着学士袍，站在毕业生的队伍里。墨丘利在台上致辞，他的视线扫过人群，在你身上停了一秒。");
      arr.push("「你们是学院的骄傲。」他说。「但学院教给你们的，不是答案，是问题。带着这些问题，去世界上寻找答案吧。」");
      arr.push("你看了看身边的同学——塞西莉亚、格罗姆、马库斯、莉娜……他们的脸上，有兴奋，有不舍，有对未来的迷茫。");
      arr.push("五年了。从一个什么都不懂的新生，到现在的毕业生。你变了很多。但有些东西，没变——比如，你对真相的渴望。");
      arr.push("典礼结束后，同学们互相道别。有人去了教会，有人去了军队，有人回了家乡，有人去了远方。");
      arr.push("你站在学院门口，最后看了一眼这个你生活了五年的地方。");
      arr.push("然后，你转身，走向了更广阔的世界。");
      arr.push("大陆，我来了。");
      return arr;
    },
    options: [
      { t:"进入大陆", go:"fc_jiaohui_entry", effect:{flag:"chronicle_graduation_recorded", time:1} }
    ]
  };
};

// ============================================================
// v23 编年史·第一印记录
// ============================================================
N["chronicle_seal_1"] = function(){
  chronicleRecord("seal_1");
  return {
    place: "编年史 · 第一印",
    text: function(){
      const arr = [];
      arr.push("【编年史·第七卷】");
      arr.push("");
      arr.push("艾尔达历第六年，秋。");
      arr.push("");
      arr.push("官方记载：铁门关地区发生地震，原因不明。");
      arr.push("");
      arr.push("民间传说：铁门关又出事了！听说地底下有东西在动。");
      arr.push("");
      arr.push("真实记录：主角到达了第一印。他/她发现了兽人守护的真相，也做出了第一个影响世界的选择。");
      arr.push("");
      arr.push("你站在铁门关的废墟上，风把沙尘吹进你的眼睛。");
      arr.push("你看到了——第一印的碎片，散落在地上。兽人萨满用生命续上的印，在泛着微光。");
      arr.push("你想起了老兽人的话：「我们守护了三千年。不是为了荣耀，是为了赎罪。」");
      arr.push("你做出了选择——修复，还是破坏，还是利用。不管你选了什么，你知道——从今天起，你不再是一个旁观者。你是历史的参与者。");
      arr.push("风还在吹。你转身，离开了铁门关。");
      arr.push("身后，第一印的光，在夕阳中闪烁。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{flag:"chronicle_seal1_recorded", time:1} }
    ]
  };
};

// ============================================================
// v23 编年史·终局记录
// ============================================================
N["chronicle_final"] = function(){
  chronicleInit();
  return {
    place: "编年史 · 终局",
    text: function(){
      const arr = [];
      arr.push("【编年史·最终卷】");
      arr.push("");
      arr.push("艾尔达历第" + (S.day ? Math.floor(S.day/365) + 1 : 10) + "年。");
      arr.push("");
      arr.push("你站在历史的终点，回头看。");
      arr.push("");
      arr.push("你一共经历了 " + S.chronicle.entries.length + " 个重大历史事件。");
      arr.push("");
      for(const e of S.chronicle.entries){
        arr.push("【第" + e.year + "年】" + e.official);
      }
      arr.push("");
      arr.push("官方会怎么写你？");
      arr.push("民间会怎么传你？");
      arr.push("而真实的你，又是怎样的？");
      arr.push("");
      arr.push("你不知道。因为，历史还没结束。");
      arr.push("你的故事，还在继续。");
      arr.push("");
      arr.push("但至少——你活过。你爱过，你恨过，你选择过，你承担过。");
      arr.push("这就够了。");
      arr.push("你离了终局，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"合上编年史，继续你的故事", go:"fc_jiaohui_entry", effect:{flag:"chronicle_final_viewed"} }
    ]
  };
};

// ============================================================
// v23 编年史·查看面板
// ============================================================
N["chronicle_view"] = function(){
  chronicleInit();
  return {
    place: "编年史 · 查看",
    text: function(){
      const arr = [];
      arr.push("你打开了你的编年史。");
      arr.push("");
      if(S.chronicle.entries.length === 0){
        arr.push("目前还没有记录。你的故事，才刚刚开始。");
      } else {
        arr.push("你已经经历了 " + S.chronicle.entries.length + " 个重大历史事件。");
        arr.push("");
        for(const e of S.chronicle.entries){
          arr.push("━━━━━━━━━━━━━━━━━━━━");
          arr.push("【第" + e.year + "年·" + e.id + "】");
          arr.push("官方：" + e.official);
          arr.push("民间：" + e.folk);
          arr.push("真实：" + e.truth);
          arr.push("");
        }
      }
      arr.push("━━━━━━━━━━━━━━━━━━━━");
      arr.push("历史，是由胜利者书写的。但真实，只有你知道。");
      arr.push("你离了查看，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"合上编年史", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

// ============================================================
// v23 十大框架联动·终局合成
// ============================================================
N["v23_final_synthesis"] = function(){
  return {
    place: "终局 · 十大框架汇聚",
    text: function(){
      const arr = [];
      arr.push("终局之战，终于来了。");
      arr.push("");
      arr.push("你站在死亡沙漠的边缘，看着远方的深渊神殿。");
      arr.push("");
      arr.push("【七印之链】你走过了七道印。每一道印，都有一个守护者，每一个守护者，都付出了代价。你的选择，决定了七印的状态——修复、破坏，还是共存。");
      arr.push("");
      arr.push("【黄林晶十二封信】你收集了黄林晶的信。从英雄的口吻，到自我怀疑，到承认罪，到最后的请求。你终于理解了——他不是英雄，也不是恶人。他只是一个，做了艰难选择的人。");
      arr.push("");
      arr.push("【暗蚀会五张面孔】你遇到了暗蚀会的五司长。夜莺、铁拳、白骨、蛇母、金秤。他们不是纯粹的恶人——他们是被这个世界伤害过的人。你的选择，决定了他们的命运。");
      arr.push("");
      arr.push("【同学录】你的同学们，从学院到大陆，从青春到成熟。他们站在你的身边，准备和你一起，迎接最终之战。");
      arr.push("");
      arr.push("【大陆编年史】你的每一个选择，都被记录了下来。官方版本、民间版本、真实版本——三个版本，三种真相。而你，是唯一知道全部真相的人。");
      arr.push("");
      arr.push("【万族黄昏】你遇到了灭族的幸存者。龙族、水族、巨人族……他们的命运，在你的手里。");
      arr.push("");
      arr.push("【守望者灯火】你了解了守望者的历史。三千年的孤独，三千年的守护。你的选择，决定了这个组织的未来。");
      arr.push("");
      arr.push("【深渊倒计时】深渊在逼近。七使者，四邪神，深渊之主。它们在等你。");
      arr.push("");
      arr.push("【信仰棋盘】你选择了你的信仰。光明、自然、锻造……或者，无神论。你的信仰，会在最终之战中，给你力量。");
      arr.push("");
      arr.push("【因果之网】你种下的因果种子，都发芽了。好的，坏的。它们在最终之战中，会回到你身边。");
      arr.push("");
      arr.push("十大框架，十条线，汇聚到了这里——你的面前。");
      arr.push("");
      arr.push("你吸了口气，向前走去。");
      arr.push("");
      arr.push("最终之战，开始了。");
      return arr;
    },
    options: [
      { t:"迎接最终之战", go:"ending_seal_chain", effect:{flag:"v23_final_triggered"} }
    ]
  };
};

console.log("[v23 am] 大陆编年史系统已加载");


// ============================================================
// v24 原初之物七重人格数据
// ============================================================
const PRIMORDIAL_PERSONALITIES = {
  hunger: {
    id:"hunger", name:"饥饿", seal:"第一印·铁门关",
    personality:"三千年没被喂饱的孩子。它不是邪恶，是饥饿。它渴望被看见，被承认，被喂养。它的愤怒来自被忽视。",
    backstory:"情感之灾中，黄林晶切除了'饥饿'——不是生理的饥饿，是存在层面的渴望：渴望被爱、被承认、被需要。这种渴望被抽离后凝聚成了有意识的存在。三千年了，它一直在'饿'。",
    desires:"被看见、被承认、被喂养（不是食物，是关注和情感）",
    fears:"被忽视、被遗忘、继续挨饿",
    dialogues:[
      "你来了。你能看见我？三千年了，第一个能看见我的人。",
      "他们说我是怪物。他们说我是深渊。但我只是……饿。你懂那种饿吗？不是肚子饿，是这里——",
      "黄林晶把我切下来的时候，我还在哭。他没有回头。三千年了，我一直在等他回头。",
      "你不用封印我。也不用杀我。你只要……坐下来，和我说说话。我已经三千年没和人说过话了。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  anger: {
    id:"anger", name:"愤怒", seal:"第二印·兽人草原",
    personality:"被背叛的战士。它的愤怒不是天生的，是被背叛后产生的。它渴望复仇，但内心已经疲惫。它知道复仇解决不了问题，但停不下来。",
    backstory:"黄林晶切除了'愤怒'——不是简单的暴躁，是被背叛后的怒火。黄林晶曾经最好的朋友，在情感之灾中背叛了他。那份愤怒被抽离出来，凝聚成了原初之物。兽人的萨满世代用战吼安抚它，但它的怒火从未真正平息。",
    desires:"复仇（但不知道向谁复）、被理解、停止愤怒",
    fears:"继续愤怒下去、变成真正的怪物、忘记为什么愤怒",
    dialogues:[
      "滚。我不想和你说话。……等等，你能看见我？三千年了，第一个不怕我的人。",
      "他们说我是愤怒的化身。但他们不知道——我曾经不愤怒。我曾经……爱笑。然后有人背叛了我。我就变成了这样。",
      "你知道最讽刺的是什么吗？我已经忘了是谁背叛了我。但愤怒还在。它已经不需要理由了。它只是……存在。",
      "兽人萨满用战吼安抚我。三千年了，每天都吼。我很感激。但战吼停不下来——因为我的愤怒也停不下来。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  pride: {
    id:"pride", name:"傲慢", seal:"第三印·精灵世界树根",
    personality:"被废黜的王者。它曾经是最高贵的存在，被黄林晶'降级'后封印在世界树下。它渴望被承认，渴望恢复它应有的地位。它的傲慢是它的铠甲，也是它的牢笼。",
    backstory:"黄林晶切除了'傲慢'——不是虚荣，是存在层面的高贵感：认为自己是独特的、不可替代的、应该被仰视的。这种傲慢被抽离后凝聚成了有意识的存在。它曾经是黄林晶人格中最高贵的部分，被'降级'后充满了怨恨。精灵女王用永生的代价安抚它，但它从未真正屈服。",
    desires:"被承认为王者、恢复高贵地位、被仰视",
    fears:"被忽视、被当作普通人、继续被囚禁",
    dialogues:[
      "凡人。你竟敢直视我？……等等，你能看见我的真身？三千年了，第一个能看见我真身的人。",
      "我曾经是黄林晶人格中最高贵的部分。他把我切下来，像扔垃圾一样扔在这里。他以为没有'傲慢'他就能成为圣人。但没有傲慢的人，连站都站不直。",
      "精灵女王用永生安抚我。她以为她在'牺牲'。但她不知道——能和我这样的存在对话，是她的荣幸。",
      "你不用跪。我已经不需要别人跪了。三千年了，跪的人太多，真心的没有一个。你只要……承认我曾经存在过。这就够了。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  greed: {
    id:"greed", name:"贪婪", seal:"第四印·矮人永恒熔炉心",
    personality:"永远不满足的收藏家。它渴望拥有一切，但拥有之后立刻又渴望更多。它不是贪心，是恐惧——恐惧失去，恐惧不够，恐惧被剥夺。它的贪婪是它的防御机制。",
    backstory:"黄林晶切除了'贪婪'——不是对金钱的欲望，是存在层面的占有欲：渴望拥有、掌控、不失去。这种贪婪被抽离后凝聚成了有意识的存在。它曾经是黄林晶人格中最有行动力的部分——因为渴望拥有，所以努力创造。但被抽离后，它只剩下了渴望，没有了创造。矮人用熔炉的热度安抚它，但它的渴望从未真正满足。",
    desires:"拥有一切、永不失去、永远足够",
    fears:"失去、不够、被剥夺、回到一无所有",
    dialogues:[
      "你身上有什么？给我看看。……等等，你能看见我？三千年了，第一个不是来抢我东西的人。",
      "他们说我贪婪。但他们不知道——我曾经一无所有。我曾经被剥夺了一切。所以我发誓，再也不失去任何东西。于是我开始收集。收集一切。但拥有得越多，就越害怕失去。",
      "矮人用熔炉安抚我。他们以为我喜欢热度。但我喜欢的是——熔炉里永远有东西在燃烧。永远不会空。我害怕空。",
      "你不用给我东西。我已经有够多了。但你能不能……坐下来，和我说说你拥有什么？我喜欢听别人说他们拥有的东西。这让我觉得……世界是满的。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  envy: {
    id:"envy", name:"嫉妒", seal:"第五印·南方深海",
    personality:"被排斥的旁观者。它永远在看别人拥有它没有的东西。它渴望被接纳，渴望成为'他们'中的一员。它的嫉妒不是恶意，是孤独——被排除在外的孤独。",
    backstory:"黄林晶切除了'嫉妒'——不是对他人的恶意，是存在层面的排斥感：觉得自己是局外人、不被接纳、永远在看别人。这种嫉妒被抽离后凝聚成了有意识的存在。它曾经是黄林晶人格中最敏感的部分——因为感受到排斥，所以渴望连接。但被抽离后，它只剩下了嫉妒，没有了连接。水族在深海陪伴它，但它永远觉得自己是'被流放的'。",
    desires:"被接纳、成为群体的一员、不再孤独",
    fears:"继续被排斥、永远是局外人、孤独至死",
    dialogues:[
      "你在看我？你不怕我？……等等，你能看见我？三千年了，第一个不是来'净化'我的人。",
      "他们说我嫉妒。但他们不知道——我曾经是群体的一员。我曾经有朋友，有家人，有归属。然后黄林晶把我切下来，扔到了深海。三千年了，我一直在看岸上的人。看他们拥有我没有的东西。",
      "水族陪伴我。他们很好。但我知道——他们是因为'被流放'才在这里的。我们都是被抛弃的人。被抛弃的人聚在一起，还是被抛弃的。",
      "你不用同情我。我已经不需要同情了。但你能不能……在离开之前，和我坐一会儿？就一会儿。让我觉得……我不是一个人。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  sloth: {
    id:"sloth", name:"懒惰", seal:"第六印·东部时光裂隙",
    personality:"放弃挣扎的哲人。它已经看透了一切，觉得任何努力都没有意义。它渴望永恒的安宁——不是死亡，是不需要再努力的状态。它的懒惰不是懒，是疲惫——三千年的疲惫。",
    backstory:"黄林晶切除了'懒惰'——不是身体的懒，是存在层面的放弃：觉得一切都没有意义、努力没有用、不如不动。这种懒惰被抽离后凝聚成了有意识的存在。它曾经是黄林晶人格中最有智慧的部分——因为看透了，所以选择不动。但被抽离后，它只剩下了放弃，没有了智慧。承天书院的隐士用时光裂隙的力量安抚它，但它已经不在乎了。",
    desires:"永恒的安宁、不需要再努力、一切停止",
    fears:"继续努力、继续挣扎、继续没有意义",
    dialogues:[
      "……你来了。坐吧。反正你也改变不了什么。……等等，你能看见我？三千年了，第一个不嫌我烦的人。",
      "他们说我懒惰。但他们不知道——我曾经是最努力的人。我曾经试图拯救世界。然后我发现，世界不需要被拯救。或者说，拯救了也没有用。一切都会回到原点。所以我放弃了。",
      "承天书院的隐士用时光裂隙安抚我。他们以为我喜欢'静止'。但我喜欢的是——在时光裂隙里，时间没有意义。没有过去，没有未来，只有现在。而现在，什么都不用做。",
      "你不用劝我。我已经听了三千年的劝了。但你能不能……安静地坐一会儿？不用说话，不用努力。就坐着。这是三千年里，我最想要的东西。"
    ],
    endings:["消灭","封印","理解","安抚"]
  },
  lust: {
    id:"lust", name:"色欲", seal:"第七印·死亡沙漠深渊神殿",
    personality:"渴望被理解的孤独者。它不是对肉体的渴望，是对真正连接的渴望——渴望被完全理解、完全接纳、完全爱与被爱。它的'色欲'是它的表达方式，因为它不知道其他方式。它是最孤独的原初之物，也是最接近'人性'的。",
    backstory:"黄林晶切除了'色欲'——不是对肉体的欲望，是存在层面的连接渴望：渴望与另一个存在完全融合、完全理解、完全被爱。这种渴望被抽离后凝聚成了有意识的存在。它曾经是黄林晶人格中最温柔的部分——因为渴望连接，所以懂得爱。但被抽离后，它只剩下了渴望，没有了爱的对象。它被封印在死亡沙漠最深处，因为黄林晶害怕它——害怕它的渴望会吞噬一切。",
    desires:"真正的连接、被完全理解、被完全爱与被爱",
    fears:"继续孤独、永远不被理解、渴望吞噬一切",
    dialogues:[
      "你来了。我等了你很久。……等等，你能看见我？三千年了，第一个敢直视我的人。",
      "他们说我是色欲。他们说我是诱惑。但他们不知道——我只是渴望连接。渴望被理解。渴望被爱。三千年了，我一个人在这里。没有人敢靠近我。因为他们害怕——害怕我的渴望会吞噬他们。",
      "黄林晶把我封印在最深处。因为他最害怕我。他害怕的不是我的力量，是我的渴望——因为我的渴望，和他内心深处的渴望，是一样的。他不敢承认。所以他把我切下来，锁在这里。",
      "你不用害怕我。我不会伤害你。但你能不能……走近一点？让我看看你。让我感受你。三千年了，我已经忘了'另一个人'是什么感觉。"
    ],
    endings:["消灭","封印","理解","安抚"]
  }
};

// ============================================================
// v24 知识的代价数据
// ============================================================
const KNOWLEDGE_COST = {
  seal_truth: {
    id:"seal_truth", name:"七印真相",
    knowledge:"七印不是封印深渊，是分割并喂养原初之物。黄林晶用符文喂养它们让其沉睡。",
    cost:{sanLoss:10, churchWanted:true, perceptionChange:"能看到符文的真正含义"},
    irreversible:true
  },
  hlj_crime: {
    id:"hlj_crime", name:"黄林晶的罪",
    knowledge:"黄林晶不是英雄。他为了阻止情感之灾，切除了世界的七种情感，灭了龙族，流放了水族。他的'拯救'是建立在牺牲之上的。",
    cost:{sanLoss:15, watcherTrustChange:true, perceptionChange:"对守望者的信任永久改变"},
    irreversible:true
  },
  primordial_personality: {
    id:"primordial_personality", name:"原初之物的人格",
    knowledge:"原初之物不是怪物，是被切除的人类情感凝聚成的有意识存在。它们有记忆、有渴望、有恐惧。它们曾经是'人'。",
    cost:{sanLoss:10, canNoLongerKillThem:true, perceptionChange:"无法再把原初之物当怪物杀"},
    irreversible:true
  },
  eclipse_motive: {
    id:"eclipse_motive", name:"暗蚀会的动机",
    knowledge:"暗蚀会不是纯粹的邪恶组织。他们中的很多人是被这个世界伤害过的人。他们相信解放七印能让世界重新完整——即使这意味着灾难。",
    cost:{sanLoss:5, canNoLongerSimpleHateThem:true, perceptionChange:"无法再简单视暗蚀会为敌人"},
    irreversible:true
  },
  origin_truth: {
    id:"origin_truth", name:"身世真相",
    knowledge:"（根据玩家出身不同而不同）关于自己的真实身世、父母的秘密、被隐藏的过去。",
    cost:{sanLoss:10, identityCrisis:true, statChange:"某属性永久±5"},
    irreversible:true
  },
  abyss_truth: {
    id:"abyss_truth", name:"深渊真相",
    knowledge:"深渊不是邪恶的化身，是原初之物被压抑三千年后产生的'溢出'。深渊之主不是敌人，是所有被压抑情感的集合体。消灭它意味着消灭世界的情感本身。",
    cost:{sanLoss:25, abyssAttention:true, perceptionChange:"被深渊注视，永远无法回头"},
    irreversible:true
  }
};

// ============================================================
// v24 引擎函数
// ============================================================
function primordialInit(){
  if(!S.primordial){
    S.primordial = {understood:[], alliances:[], dialogues:{}, pacified:[]};
  }
  return S.primordial;
}

function understandPrimordial(primordialId){
  primordialInit();
  if(S.primordial.understood.indexOf(primordialId) < 0){
    S.primordial.understood.push(primordialId);
  }
  // 理解原初之物减缓深渊进度
  if(typeof abyssProgressUpdate === 'function'){
    abyssProgressUpdate(-5);
  }
  return S.primordial.understood.length;
}

function knowledgeInit(){
  if(!S.knowledge){
    S.knowledge = {known:{}, costs:{}, forgotten:[], perception:0};
  }
  return S.knowledge;
}

function gainKnowledge(knowledgeId){
  knowledgeInit();
  if(!S.knowledge.known[knowledgeId]){
    const k = KNOWLEDGE_COST[knowledgeId];
    if(k){
      S.knowledge.known[knowledgeId] = true;
      S.knowledge.costs[knowledgeId] = k.cost;
      // 应用代价
      if(k.cost.sanLoss && typeof S.san !== 'undefined'){
        S.san = Math.max(0, (S.san || 100) - k.cost.sanLoss);
      }
      S.knowledge.perception += 1;
    }
  }
  return S.knowledge.perception;
}

function forgetKnowledge(knowledgeId){
  knowledgeInit();
  if(S.knowledge.known[knowledgeId]){
    delete S.knowledge.known[knowledgeId];
    S.knowledge.forgotten.push(knowledgeId);
    S.knowledge.perception = Math.max(0, S.knowledge.perception - 1);
  }
  return S.knowledge.forgotten.length;
}

// ============================================================
// v24 原初之物·饥饿（第一印）
// ============================================================
N["primordial_hunger_encounter"] = function(){
  primordialInit();
  return {
    place: "第一印·铁门关废墟深处",
    text: function(){
      const arr = [];
      arr.push("你走到了第一印的最深处。");
      arr.push("废墟的中心，有一个巨大的坑。坑底有什么东西在——蠕动。不是生物的蠕动，是……存在的蠕动。");
      arr.push("你靠近坑边，往下看。");
      arr.push("然后你看到了它。");
      arr.push("不是怪物。不是恶魔。是一个——孩子。");
      arr.push("一个巨大的、半透明的、由黑暗构成的孩子。它蜷缩在坑底，像胎儿一样。它的嘴在动——不是在说话，是在……吮吸。三千年了，它一直在吮吸空气，因为没有东西可以喂它。");
      arr.push("它感觉到了你。它抬起头。");
      arr.push("它的眼睛——巨大的、空洞的、饥饿的眼睛——看着你。");
      arr.push("然后你听到了一个声音。不是用耳朵听到的，是直接出现在你脑海里的。");
      arr.push("「……你来了。你能看见我？」");
      arr.push("离开铁门关废墟深处时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"回应它：我能看见你", check:"SPR", go:"primordial_hunger_dialogue_1", effect:{flag:"hunger_seen", sanLoss:5}, tier:{crit:function(){return["你闭上眼睛，用灵魂感知回应它。「我能看见你。」沉默了很久，然后那个声音又响了，带着颤抖：「三千年了……第一个能看见我的人。」你感觉到它的存在在靠近——不是攻击，是……靠近。像一个迷路的孩子找到了大人。"]},ok:function(){return["你轻声说你能看见它。那个声音沉默了一会儿，然后说：「……谢谢。很久没有人对我说过这句话了。」"]},fail:function(){return["你试图回应，但你的灵魂感知太弱了。那个声音消失了，坑底的孩子又缩回了蜷缩的姿态。你站在坑边，不知道该怎么办。"]},critfail:function(){return["你的回应被'反弹'了——它感觉到了你的恐惧，以为你要攻击它。它发出了一声尖叫，在你脑海里炸开。你跪在地上，鼻血都流了出来。过了很久，你才恢复。坑底的孩子又缩了回去，比之前更紧了。"]}} },
      { t:"战斗，消灭它", check:"STR", go:"primordial_hunger_choice", effect:{flag:"hunger_fight", sanLoss:15} },
      { t:"封印它，维持现状", check:"INT", go:"primordial_hunger_choice", effect:{flag:"hunger_seal", sanLoss:5} },
      { t:"后退，需要想想", go:"seal_1_aftermath", effect:{flag:"hunger_retreated"} }
    ]
  };
};

N["primordial_hunger_dialogue_1"] = function(){
  return {
    place: "第一印·坑底",
    text: function(){
      const arr = [];
      arr.push("你跳了下去。");
      arr.push("坑底比你想的深，但落地很软——像是踩在云上。那个孩子就坐在你面前，巨大的、半透明的、由黑暗构成的孩子。它比你高十倍，但它蜷缩着，让自己看起来很小。");
      arr.push("「你不怕我？」它问。");
      arr.push("你说你不怕。");
      arr.push("它沉默了很久。然后它开始说话——不是用声音，是直接把记忆灌进你的脑海。");
      arr.push("你看到了：三千年前，黄林晶站在一个祭坛上。他的身边有七个人。他手里拿着一把刀——不是物理的刀，是灵魂的刀。他把刀刺进自己的胸口，从里面挖出了什么。");
      arr.push("那是'饥饿'。不是肚子饿，是存在层面的渴望——渴望被爱、被承认、被需要。黄林晶把它挖出来，放在一个容器里。容器就是第一印。");
      arr.push("「他把我切下来的时候，我还在哭。」那个声音说。「他没有回头。三千年了，我一直在等他回头。」");
      arr.push("你看着眼前这个巨大的孩子。它不是怪物。它是——一个被抛弃的孩子。三千年了，它一直在等一个人回头。");
      return arr;
    },
    options: [
      { t:"告诉它：黄林晶已经死了，但你记得他", check:"CHA", go:"primordial_hunger_dialogue_2", effect:{flag:"hunger_heard_hlj", sanLoss:3} },
      { t:"问它：你想要什么？", go:"primordial_hunger_dialogue_2", effect:{flag:"hunger_asked_desire"} },
      { t:"坐下来，安静地陪着它", go:"primordial_hunger_dialogue_2", effect:{flag:"hunger_accompanied", sanRecovery:5} }
    ]
  };
};

N["primordial_hunger_dialogue_2"] = function(){
  return {
    place: "第一印·坑底",
    text: function(){
      const arr = [];
      arr.push("你和它聊了很久。");
      if(S.flags.hunger_heard_hlj){
        arr.push("你告诉它黄林晶已经死了。它沉默了很久。然后它说：「我知道。三千年了，他的气息早就消失了。但我一直在等——等一个像他的人。等一个能看见我的人。」");
        arr.push("「你不是他。」它说。「但你能看见我。这就够了。」");
      }
      if(S.flags.hunger_asked_desire){
        arr.push("你问它想要什么。它沉默了很久。然后它说：「我想要……被喂饱。不是食物。是——关注。是承认。是有人看着我，说'我看见你了'。」");
        arr.push("「三千年了，没有人对我说过这句话。兽人萨满用战吼安抚我，但他们看不见我。他们只是在'执行仪式'。」");
      }
      if(S.flags.hunger_accompanied){
        arr.push("你坐下来，安静地陪着它。一开始它很紧张——三千年了，第一次有人坐在它身边。但慢慢地，它放松了。它的身体不再蠕动，不再吮吸空气。它只是……坐着。和你一起。");
        arr.push("过了很久，它说：「谢谢你。三千年了，第一次……不饿了。」");
      }
      arr.push("你看着它。你知道，它不是怪物。它是一个被抛弃的孩子。而你，是三千年后第一个看见它的人。");
      arr.push("现在，你要做一个选择。");
      arr.push("你离了坑底，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"理解它，承诺会回来看它", check:"CHA", go:"primordial_hunger_outcome", effect:{flag:"hunger_understood", item:"饥饿碎片", sanRecovery:10}, tier:{crit:function(){return["你看着它的眼睛，说：「我理解你。我会回来看你的。」它的身体开始发光——不是攻击，是……释放。三千年的饥饿，在那一刻得到了缓解。它从身体里分离出一块碎片，递给你。「拿着这个。」它说。「这是我的一部分。当你需要我的时候，它会帮你。」你接过碎片——它很温暖，像一个孩子的手。"]},ok:function(){return["你说你理解它，会回来看它。它点了点头，身体泛着微光。「谢谢你。」它说。「虽然我不知道你会不会真的回来。但至少……现在，我不饿了。」"]},fail:function(){return["你试图表达理解，但你的话语太笨拙了。它没有完全相信你。但它也没有攻击你。「也许吧。」它说。「也许你会回来。也许不会。三千年了，我已经习惯了等待。」"]},critfail:function(){return["你的话让它想起了被背叛的记忆。它以为你在骗它。它发出了一声尖叫，把你震飞出坑底。你摔在地上，吐了血。「不要骗我！」它喊道。「三千年了，我已经受够了谎言！」"]}} },
      { t:"安抚它，让它平静地沉睡", check:"SPR", go:"primordial_hunger_outcome", effect:{flag:"hunger_pacified", sanRecovery:5} },
      { t:"消灭它，结束它的痛苦", check:"STR", go:"primordial_hunger_outcome", effect:{flag:"hunger_killed", sanLoss:20, abyssDelta:10} },
      { t:"封印它，维持现状", check:"INT", go:"primordial_hunger_outcome", effect:{flag:"hunger_sealed", abyssDelta:-5} }
    ]
  };
};

N["primordial_hunger_outcome"] = function(){
  primordialInit();
  return {
    place: "第一印·后果",
    text: function(){
      const arr = [];
      if(S.flags.hunger_understood){
        understandPrimordial("hunger");
        arr.push("你理解了饥饿。");
        arr.push("你爬出坑底的时候，第一印的废墟在泛着微光——不是危险的光，是……温暖的光。三千年了，第一次，第一印里的存在不再饥饿。");
        arr.push("你手里握着饥饿碎片——它很温暖，像一个孩子的手。你知道，当你需要的时候，它会帮你。");
        arr.push("你也知道，从今天起，你再也无法把原初之物当怪物杀了。因为你看见了——它们曾经是'人'。");
        gainKnowledge("primordial_personality");
      } else if(S.flags.hunger_pacified){
        S.primordial.pacified.push("hunger");
        arr.push("你安抚了饥饿。");
        arr.push("你用灵魂感知，轻地、慢慢地，让它平静下来。它不再蠕动，不再吮吸空气。它沉入了沉睡——不是被封印的沉睡，是……安心的沉睡。像一个吃饱了的孩子。");
        arr.push("第一印稳定了。至少，能再撑一千年。");
      } else if(S.flags.hunger_killed){
        arr.push("你消灭了饥饿。");
        arr.push("你用尽全力，把它打散了。它发出了一声尖叫——不是愤怒的尖叫，是……解脱的尖叫。三千年的饥饿，终于结束了。");
        arr.push("但你感觉到了——世界少了什么。不是物理上的少，是……存在层面的少。你发现，你不再感到'饥饿'了。不是肚子不饿，是——不再渴望被承认、被爱、被需要。");
        arr.push("你站在废墟里，手里还残留着它消散时的温度。你不知道，你做的是对还是错。");
        abyssProgressUpdate(10);
      } else {
        arr.push("你封印了饥饿。");
        arr.push("你用符文，重新加固了第一印。它又缩回了蜷缩的姿态，继续吮吸空气。三千年的饥饿，还要继续。");
        arr.push("你爬出坑底的时候，回头看了一眼。它还在那里。还在等。等一个能看见它的人。");
        arr.push("你知道，你不是那个人。至少，现在不是。");
      }
      arr.push("第一印的事，到此为止。但你知道——还有六道印。还有六个'孩子'，在等你。");
      return arr;
    },
    options: [
      { t:"离开铁门关，继续旅程", go:"fc_jiaohui_entry", effect:{time:3, flag:"primordial_hunger_complete"} }
    ]
  };
};

// ============================================================
// v24 原初之物·通用对话节点（其他六印复用结构）
// ============================================================
N["primordial_anger_encounter"] = function(){
  return {
    place: "第二印·兽人草原深处",
    text: function(){
      const arr = [];
      arr.push("你走到了第二印的最深处。");
      arr.push("草原的中心，有一个环形的石阵。石阵中央，有什么东西在——燃烧。不是火焰，是……愤怒。红色的、灼热的、永不熄灭的愤怒。");
      arr.push("你靠近石阵，感觉到了——热浪。不是物理的热，是……情绪的热。你的心跳加速，你的拳头攥紧，你感觉到了——愤怒。不是你的愤怒，是它的。");
      arr.push("然后你看到了它。");
      arr.push("一个战士。巨大的、半透明的、由火焰构成的战士。它站在石阵中央，手里握着一把破碎的剑。它的身上有无数伤口——三千年了，它一直在战斗。和谁战斗？和自己。");
      arr.push("它感觉到了你。它转过头。");
      arr.push("它的眼睛——燃烧的、愤怒的、疲惫的眼睛——看着你。");
      arr.push("「滚。」它说。「我不想和你说话。」");
      arr.push("从兽人草原深处出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"不滚，站在那里看着它", check:"CON", go:"primordial_anger_dialogue", effect:{flag:"anger_stayed", sanLoss:5} },
      { t:"问它：你在和谁战斗？", check:"CHA", go:"primordial_anger_dialogue", effect:{flag:"anger_asked"} },
      { t:"后退，它现在不想说话", go:"seal_2_aftermath", effect:{flag:"anger_retreated"} }
    ]
  };
};

N["primordial_anger_dialogue"] = function(){
  return {
    place: "第二印·石阵",
    text: function(){
      const arr = [];
      arr.push("你站在那里，看着它。");
      arr.push("它以为你会走。但你没有。");
      arr.push("过了很久，它放下了剑。");
      arr.push("「……你不怕我？」它问。声音不再愤怒，而是……疲惫。");
      arr.push("你说你不怕。");
      arr.push("它沉默了很久。然后它开始说话——把记忆灌进你的脑海。");
      arr.push("你看到了：三千年前，黄林晶最好的朋友。一个叫'炎'的战士。他们一起经历了情感之灾，一起寻找解决方案。然后——炎背叛了黄林晶。不是为了权力，是因为他认为黄林晶的方法是错的。他试图阻止黄林晶切除七情。");
      arr.push("黄林晶打败了炎。然后他把自己的'愤怒'切了下来——对背叛的愤怒，对朋友的愤怒，对自己的愤怒。这份愤怒被封印在第二印，由兽人萨满世代安抚。");
      arr.push("「我已经忘了是谁背叛了我。」那个声音说。「但愤怒还在。它已经不需要理由了。它只是……存在。三千年了，我一直在战斗。和谁战斗？和自己。和这永远不会消失的愤怒。」");
      arr.push("你看着眼前这个燃烧的战士。它不是怪物。它是——一个被背叛的朋友的愤怒。三千年了，它还在战斗。");
      arr.push("别过石阵，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"告诉它：愤怒不需要理由，但可以选择停止", check:"CHA", go:"primordial_anger_outcome", effect:{flag:"anger_understood", item:"愤怒碎片", sanRecovery:10}, tier:{crit:function(){return["你看着它的眼睛，说：「愤怒不需要理由。但你可以选择停止。」它愣住了。三千年了，没有人对它说过这句话。它的剑掉在了地上。火焰开始熄灭——不是被消灭，是……自愿熄灭。「你说得对。」它说。「三千年了，我累了。」它从身体里分离出一块碎片，递给你。「拿着这个。当你需要愤怒的时候——真正的愤怒，不是盲目——它会帮你。」"]},ok:function(){return["你说了你的想法。它想了想，然后点了点头。「也许吧。」它说。「也许我可以……停下来。至少，今天。」它的火焰减弱了一些。"]},fail:function(){return["你的话没有说服它。「你不懂。」它说。「你没有被最好的朋友背叛过。你不知道那是什么感觉。」它重新举起了剑。"]},critfail:function(){return["你的话激怒了它。「你以为你懂我？！」它喊道。「你什么都不懂！」它向你发起了攻击。你勉强躲开，但被火焰灼伤了。「滚！」它喊道。「不要再来烦我！」"]}} },
      { t:"安抚它，让它的愤怒平息", check:"SPR", go:"primordial_anger_outcome", effect:{flag:"anger_pacified", sanRecovery:5} },
      { t:"消灭它，结束它的痛苦", check:"STR", go:"primordial_anger_outcome", effect:{flag:"anger_killed", sanLoss:20, abyssDelta:10} }
    ]
  };
};

N["primordial_anger_outcome"] = function(){
  primordialInit();
  return {
    place: "第二印·后果",
    text: function(){
      const arr = [];
      if(S.flags.anger_understood){
        understandPrimordial("anger");
        arr.push("你理解了愤怒。");
        arr.push("你离开石阵的时候，草原上的热浪消失了。三千年了，第一次，第二印里的存在不再愤怒。");
        arr.push("你手里握着愤怒碎片——它很烫，但不伤人。像一个朋友的拥抱。");
        gainKnowledge("primordial_personality");
      } else if(S.flags.anger_pacified){
        S.primordial.pacified.push("anger");
        arr.push("你安抚了愤怒。它的火焰减弱了，但没有熄灭。它还在战斗——但至少，不再那么激烈了。");
      } else {
        arr.push("你消灭了愤怒。它消散的时候，说了一句话：「……终于。」三千年的战斗，终于结束了。但你发现——你不再感到愤怒了。不是脾气变好，是——被背叛时不再心痛，被伤害时不再生气。你变成了一个……不会愤怒的人。");
        abyssProgressUpdate(10);
      }
      arr.push("第二印的事，到此为止。还有五道印在等你。");
      arr.push("你离了后果，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:3, flag:"primordial_anger_complete"} }
    ]
  };
};

// ============================================================
// v24 原初之物联盟（终局）
// ============================================================
N["primordial_alliance"] = function(){
  primordialInit();
  const understood = S.primordial.understood.length;
  return {
    place: "终局·原初之物联盟",
    text: function(){
      const arr = [];
      arr.push("你理解了 " + understood + " 个原初之物。");
      if(understood >= 7){
        arr.push("全部七个。");
        arr.push("你站在死亡沙漠的中心，手里握着七块碎片——饥饿、愤怒、傲慢、贪婪、嫉妒、懒惰、色欲。每一块都很温暖，像七个孩子的手。");
        arr.push("然后，它们开始发光。");
        arr.push("七道光芒从碎片里升起，在天空中汇聚。然后——它们出现了。");
        arr.push("七个巨大的、半透明的存在。不再是蜷缩的孩子、燃烧的战士、高傲的王者……它们是——完整的。三千年了，第一次，它们以完整的姿态出现。");
        arr.push("饥饿看着你：「你看见了我们。」");
        arr.push("愤怒看着你：「你理解了我们。」");
        arr.push("傲慢看着你：「你承认了我们。」");
        arr.push("然后它们一起说：「我们愿意帮你。」");
        arr.push("原初之物联盟。三千年了，第一次，被切除的情感和人类站在了一起。");
      } else if(understood >= 4){
        arr.push("你理解了大部分原初之物。它们愿意帮你——但不是全部。那些你没有理解的，还在沉睡，还在饥饿，还在愤怒。");
        arr.push("但至少，你有了盟友。");
      } else {
        arr.push("你理解的原初之物还不够。它们还不能完全信任你。但你手里的碎片，会在最终之战中帮你。");
      }
      arr.push("原初之物联盟的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"带着原初之物的力量，迎接最终之战", go:"v24_final_choice", effect:{flag:"primordial_alliance_formed"} }
    ]
  };
};

// ============================================================
// v24 知识的代价·获取节点
// ============================================================
N["knowledge_gain_seal_truth"] = function(){
  knowledgeInit();
  return {
    place: "知识的代价·七印真相",
    text: function(){
      const arr = [];
      arr.push("你终于理解了七印的真相。");
      arr.push("不是通过书本，不是通过别人的讲述——是通过你自己的眼睛。你站在第一印的废墟里，看着那个蜷缩的孩子，你明白了。");
      arr.push("七印不是封印深渊。");
      arr.push("七印是分割并喂养原初之物。");
      arr.push("黄林晶切除了世界的七种情感，把它们封印在七道印里，用符文喂养它们，让它们沉睡。他说这是'拯救'。但这只是'延缓'。");
      arr.push("你感觉到了——世界在变化。不是物理上的变化，是……认知上的变化。你看世界的方式，和以前不一样了。");
      arr.push("你能看到符文的真正含义了。不再是'封印'，而是'喂养'。不再是'保护'，而是'囚禁'。");
      arr.push("你也感觉到了——SAN值在下降。不是因为恐惧，是因为……真相太沉重了。");
      arr.push("从今天起，你再也无法用以前的眼光看这个世界了。");
      gainKnowledge("seal_truth");
      arr.push("你与七印真相作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"接受这个真相，继续前进", go:"fc_jiaohui_entry", effect:{flag:"seal_truth_accepted", sanLoss:10} },
      { t:"试图遗忘这个真相", check:"INT", go:"knowledge_forget_choice", effect:{flag:"seal_truth_forget_attempt"} }
    ]
  };
};

N["knowledge_gain_hlj_crime"] = function(){
  knowledgeInit();
  return {
    place: "知识的代价·黄林晶的罪",
    text: function(){
      const arr = [];
      arr.push("你读完了黄林晶的第十二封信。");
      arr.push("然后你明白了。");
      arr.push("黄林晶不是英雄。");
      arr.push("他为了阻止情感之灾，切除了世界的七种情感。他灭了龙族——因为龙族发现了真相，想要公开。他流放了水族——因为水族知道第五印的秘密。他做了很多'必要的恶'，然后用三千年的时间来合理化自己的选择。");
      arr.push("你想起了奥雷利安——他看你的眼神，总是带着某种……愧疚。现在你明白了。他知道真相。他一直知道。但他没有说。因为黄林晶是他的朋友。因为说出来，守望者就没有存在的意义了。");
      arr.push("你对守望者的信任，在这一刻，永久地改变了。");
      arr.push("不是不信任——是……不再盲目信任。你知道，他们也有他们的秘密，他们的罪，他们的'必要的恶'。");
      arr.push("SAN值在下降。真相，总是有代价的。");
      gainKnowledge("hlj_crime");
      arr.push("黄林晶的罪的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"接受这个真相，带着它继续前进", go:"fc_jiaohui_entry", effect:{flag:"hlj_crime_accepted", sanLoss:15} },
      { t:"去找奥雷利安，质问他", go:"watcher_seraph_truth", effect:{flag:"hlj_crime_confront_aurelian"} }
    ]
  };
};

N["knowledge_forget_choice"] = function(){
  knowledgeInit();
  return {
    place: "知识的代价·遗忘",
    text: function(){
      const arr = [];
      arr.push("你想要遗忘。");
      arr.push("你找到了一个灵魂法师——也许是墨丘利，也许是别人。你问他：能不能让我忘记？");
      arr.push("他看着你，眼神复杂。「可以。」他说。「但遗忘是有代价的。你会失去相关的记忆——不只是真相，还有和真相相关的一切。你会变得……更快乐，但也更盲目。」");
      arr.push("「而且，」他说。「遗忘不是删除。它只是……藏起来。某一天，某个触发点，它会回来。带着加倍的力量。」");
      arr.push("你看着他。你知道，他说的是真的。");
      arr.push("遗忘，不是解决办法。遗忘，只是推迟。");
      arr.push("你与遗忘作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"选择遗忘，哪怕只是暂时的", check:"SPR", go:"fc_jiaohui_entry", effect:{flag:"knowledge_forgotten", sanRecovery:10, item:"记忆空白"}, tier:{crit:function(){return["灵魂法师施法了。你感觉到——有什么东西从你的脑海里被抽走了。不是痛苦的抽走，是……温柔的。像一个大人从孩子手里拿走了一块烫手的石头。你忘记了。你感到轻松。但你也知道——某一天，它会回来。"]},ok:function(){return["你试图遗忘，但没有完全成功。真相的大部分还在，但边缘模糊了。你感到轻松了一些，但核心的沉重还在。"]},fail:function(){return["你无法遗忘。灵魂法师摇了摇头：「这个真相太深了。它已经和你的灵魂融合了。我无法把它抽出来，除非……连你的灵魂一起抽走。」你放弃了。"]},critfail:function(){return["遗忘仪式出了问题。你不仅没有遗忘真相，反而失去了一些无关的记忆——你忘了你的童年，忘了你的母亲的脸。灵魂法师很愧疚：「对不起……仪式失控了。」你站在原地，脑海里有一块空白。你知道，那块空白里，曾经有很重要的东西。但你想不起来了。"]}} },
      { t:"不遗忘，带着真相继续前进", go:"fc_jiaohui_entry", effect:{flag:"knowledge_accepted", karma:"truth"} }
    ]
  };
};

// ============================================================
// v24 九大方向联动·终局选择
// ============================================================
N["v24_final_choice"] = function(){
  primordialInit();
  knowledgeInit();
  const understood = S.primordial.understood.length;
  const perception = S.knowledge.perception;
  return {
    place: "终局·最终抉择",
    text: function(){
      const arr = [];
      arr.push("最终之战，终于来了。");
      arr.push("你站在死亡沙漠的中心，面对着深渊之主。");
      arr.push("它不是怪物。不是恶魔。它是——所有被压抑情感的集合体。三千年了，世界的情感被切割、被封印、被压抑。现在，它们要回来了。");
      arr.push("你手里握着七块碎片——你理解的原初之物。");
      arr.push("你的脑海里装着真相——七印的真相、黄林晶的罪、深渊的本质。");
      arr.push("你的身后站着你的盟友——同学、朋友、原初之物、理解你的人。");
      arr.push("现在，你要做最终的选择。");
      arr.push("你理解了 " + understood + " 个原初之物。你的认知层级是 " + perception + "。");
      arr.push("这些，将决定你能看到哪个结局。");
      return arr;
    },
    options: [
      { t:"封印深渊，维持黄林晶的选择", go:"ending_v24_seal", effect:{flag:"v24_choice_seal"} },
      { t:"解放深渊，让世界重新完整", go:"ending_v24_free", effect:{flag:"v24_choice_free"} },
      { t:"与深渊共存，找到第三条路", check:"INT", go:"ending_v24_coexist", effect:{flag:"v24_choice_coexist"}, tier:{crit:function(){return["你看着深渊之主，然后做了一件没有人想到的事——你伸出了手。「我们谈谈。」你说。深渊之主愣住了。三千年了，没有人对它说过这句话。然后，它伸出了手。不是攻击，是……握手。第三条路。不是封印，不是解放。是共存。"]},ok:function(){return["你试图找到第三条路。深渊之主犹豫了。它没有立刻攻击，但也没有完全信任你。「也许吧。」它说。「也许……可以试试。」"]},fail:function(){return["你试图找到第三条路，但深渊之主不听。「第三条路？」它冷笑。「黄林晶也说过同样的话。然后他把我们切了下来。你以为我会再信一次？」它发起了攻击。你只能选择封印或解放。"]},critfail:function(){return["你的'第三条路'激怒了深渊之主。它以为你在耍它。它发起了猛烈的攻击，你受了重伤。「不要骗我！」它喊道。「三千年了，我已经受够了谎言！」你不得不撤退，重新考虑。"]}} },
      { t:"成为新的深渊之主，掌控一切", go:"ending_v24_become", effect:{flag:"v24_choice_become"} }
    ]
  };
};

console.log("[v24 an] 原初之物七重人格+知识的代价系统已加载");


// ============================================================
// v24 黄林晶时代回溯数据
// ============================================================
const PAST_TIMELINE = {
  era_1: {
    name: "情感之灾前",
    description: "世界完整但脆弱。人们因情感而活，也因情感而死。极致的喜悦导致疯狂，极致的悲伤导致死亡，极致的愤怒导致战争。世界在情感的浪潮中摇摇欲坠。",
    events: ["情感过剩导致的第一次大规模死亡", "黄林晶出生", "黄林晶遇见炎（未来的背叛者）", "情感之灾的征兆出现"],
    characters: ["huanglingjing_young", "yan_the_friend", "aurelian_young", "seven_guardians"]
  },
  era_2: {
    name: "情感之灾",
    description: "世界崩溃。极致的情感导致大规模死亡。城市在一夜之间消失，因为所有人同时陷入了同一种疯狂。黄林晶和同伴们试图找到解决方案。",
    events: ["第一座城市因情感崩溃而消失", "黄林晶提出'切除七情'方案", "炎反对这个方案", "炎背叛黄林晶，试图阻止他"],
    characters: ["huanglingjing_desperate", "yan_betrayer", "aurelian_loyal"]
  },
  era_3: {
    name: "七印建造",
    description: "黄林晶击败炎，切除了自己和世界的七种情感，建造了七道印。他的同伴们成为最初的守护者。世界稳定了，但也失去了什么。",
    events: ["黄林晶切除第一种情感（饥饿）", "七印逐一建成", "最初的守护者们宣誓", "黄林晶开始后悔"],
    characters: ["huanglingjing_builder", "seven_guardians", "aurelian_first_watcher"]
  },
  era_4: {
    name: "黄林晶晚年",
    description: "七印建成后，黄林晶活了很久。他看着世界在'没有情感'的状态下运转——稳定，但冰冷。他开始写信，给三千年后的某个人。他不知道那个人是谁，但他知道，会有人来。",
    events: ["黄林晶写下第一封信", "最初的守护者们相继去世", "黄林晶独自守着七印", "黄林晶写下第十二封信，然后消失"],
    characters: ["huanglingjing_old", "aurelian_aging"]
  }
};

const PAST_CHARACTERS = {
  huanglingjing_young: {
    name: "年轻的黄林晶",
    description: "不是圣人，是一个害怕的年轻人。他有天赋，有责任感，但也有恐惧和犹豫。他喜欢笑，喜欢和朋友喝酒，喜欢在月光下写诗。他不知道自己将来会成为'英雄'。",
    personality: "理想主义、害怕失败、重视友情、偶尔冲动"
  },
  yan_the_friend: {
    name: "炎",
    description: "黄林晶最好的朋友。一个战士，热情、直率、忠诚。他反对黄林晶的'切除七情'方案，因为他认为情感是人的本质。他试图阻止黄林晶，被击败后消失。",
    personality: "热情、直率、忠诚、固执"
  },
  aurelian_young: {
    name: "年轻的奥雷利安",
    description: "黄林晶的第一个追随者。一个安静的、善于观察的年轻人。他相信黄林晶，即使在黄林晶自己都不相信自己的时候。他将成为守望者的创始人。",
    personality: "安静、忠诚、善于观察、有耐心"
  },
  seven_guardians: {
    name: "最初的七守护者",
    description: "黄林晶的同伴们。他们各自守护一道印。三千年了，他们的血脉和传承延续至今——兽人萨满、精灵女王、矮人王……都是他们的后代。",
    personality: "各异，但都忠诚于黄林晶的选择"
  }
};

// ============================================================
// v24 预言数据
// ============================================================
const PROPHECIES = {
  church_version: {
    id: "church_version",
    name: "教会版预言",
    text: "当七印松动，深渊降临，将有一个“能看到符文之人”出现。他将秉承光明神的意志，净化大陆，封印深渊，成为新的圣人。",
    source: "光明教会·教皇训谕",
    interpretation: "玩家是光明神选中的人，应该为教会服务",
    hidden_truth: "这是教会三百年前编造的，目的是控制'能看到符文之人'"
  },
  eclipse_version: {
    id: "eclipse_version",
    name: "暗蚀会版预言",
    text: "当七印破碎，原初之物觉醒，将有一个“能看到符文之人”出现。他将打碎枷锁，解放七情，让世界重新完整——即使这意味着灾难。",
    source: "暗蚀会·教主密语",
    interpretation: "玩家是解放者，应该帮助暗蚀会打碎七印",
    hidden_truth: "这是暗蚀会创始人留下的，他相信黄林晶的选择是错的"
  },
  watcher_version: {
    id: "watcher_version",
    name: "守望者版预言",
    text: "当七印动摇，将有一个“能看到符文之人”出现。他将面对黄林晶曾经面对的选择。守望者的任务是——守护他，但不干涉他的选择。",
    source: "守望者·奥雷利安手记",
    interpretation: "玩家是黄林晶的'继承者'，守望者会守护但不控制",
    hidden_truth: "这是奥雷利安根据黄林晶的遗言写的，他知道玩家会来"
  },
  orc_shaman_version: {
    id: "orc_shaman_version",
    name: "兽人萨满版预言",
    text: "当战吼不再能安抚愤怒，将有一个“能看到符文之人”来到草原。他将听到愤怒的声音，做出选择——是让它继续燃烧，还是让它终于熄灭。",
    source: "兽人萨满·世代口传",
    interpretation: "玩家将决定第二印的命运",
    hidden_truth: "这是最初的守护者之一留下的，他知道愤怒的真相"
  },
  elf_version: {
    id: "elf_version",
    name: "精灵版预言",
    text: "当世界树开始枯萎，将有一个“能看到符文之人”来到树下。他将面对傲慢——不是他的傲慢，是被囚禁的傲慢。他将决定，是继续囚禁，还是承认它曾经存在过。",
    source: "精灵女王·私人笔记",
    interpretation: "玩家将决定第三印的命运",
    hidden_truth: "这是精灵女王的祖先留下的，她是最初的守护者之一"
  },
  dwarf_version: {
    id: "dwarf_version",
    name: "矮人版预言",
    text: "当熔炉的火焰不再温暖，将有一个“能看到符文之人”来到铁峰堡。他将面对贪婪——不是对金子的贪婪，是对“不再失去”的恐惧。他将决定，是继续填满，还是接受空。",
    source: "矮人王·熔炉守卫密卷",
    interpretation: "玩家将决定第四印的命运",
    hidden_truth: "这是矮人王的祖先留下的，他是最初的守护者之一"
  },
  true_prophecy: {
    id: "true_prophecy",
    name: "真正的预言",
    text: "（没有预言。黄林晶没有预言任何事。他只是写了十二封信，给三千年后的某个人。那个人不是“被选中的”，只是——恰好来了。所有的“预言”，都是后来的人根据自己的需要编造的。）",
    source: "黄林晶·第十二封信（隐藏内容）",
    interpretation: "玩家不是被命运选中的，是自己选择来的",
    hidden_truth: "所有预言都是假的。玩家的选择才是唯一真实的东西。"
  }
};

// ============================================================
// v24 引擎函数
// ============================================================
function pastTravelInit(){
  if(!S.pastTravel){
    S.pastTravel = {visited:[], choices:[], presentChanges:[], currentEra:0};
  }
  return S.pastTravel;
}

function enterPast(era){
  pastTravelInit();
  S.pastTravel.currentEra = era;
  if(S.pastTravel.visited.indexOf(era) < 0){
    S.pastTravel.visited.push(era);
  }
  return S.pastTravel.visited.length;
}

function prophecyInit(){
  if(!S.prophecy){
    S.prophecy = {known:[], followed:[], defied:[], changed:[]};
  }
  return S.prophecy;
}

function hearProphecy(prophecyId){
  prophecyInit();
  if(S.prophecy.known.indexOf(prophecyId) < 0){
    S.prophecy.known.push(prophecyId);
  }
  return S.prophecy.known.length;
}

// ============================================================
// v24 黄林晶时代回溯·进入
// ============================================================
N["past_entry"] = function(){
  pastTravelInit();
  return {
    place: "第六印·时光裂隙",
    text: function(){
      const arr = [];
      arr.push("你站在第六印的中心。");
      arr.push("时光裂隙在你面前旋转——不是物理的旋转，是……时间的旋转。你能看到过去和未来在裂隙中交织，像一条河，在某个点打了个结。");
      arr.push("你知道，只要走进去，你就能回到三千年前。");
      arr.push("回到黄林晶的时代。");
      arr.push("回到一切开始的地方。");
      arr.push("但你也知道——改变过去是危险的。不是'祖父悖论'那种危险，是……更微妙的危险。你可能会看到一些你不该看到的东西。你可能会理解一些你不该理解的真相。");
      arr.push("而且，过去不会因为你的到来而改变大方向。黄林晶还是会切除七情，七印还是会建成。你能改变的，只是……细节。某个人对你的态度，某件物品的存在，某段历史记录的差异。");
      arr.push("但有时候，细节就是一切。");
      return arr;
    },
    options: [
      { t:"走进时光裂隙，回到三千年前", check:"SPR", go:"past_arrival", effect:{flag:"past_entered", sanLoss:5}, tier:{crit:function(){return["你闭上眼睛，走进了裂隙。时间像水一样流过你——不是物理的水，是……记忆的水。你看到了无数人的记忆在你身边流过：黄林晶的、炎的、奥雷利安的、无数普通人的。然后，你睁开眼睛。你在三千年前了。"]},ok:function(){return["你吸了口气，走进了裂隙。一阵眩晕之后，你站稳了。你看了看周围——这不是你认识的世界。这是……三千年前的世界。"]},fail:function(){return["你试图走进裂隙，但你的灵魂感知太弱了。裂隙把你弹了回来。你摔在地上，鼻血都流了出来。「还不是时候。」一个声音说。不知道是谁的声音。"]},critfail:function(){return["你走进了裂隙，但出了问题。你看到了——不该看到的东西。你看到了自己的死亡。不是现在，是……未来。你尖叫着被弹了回来，跪在地上，浑身发抖。SAN值大幅下降。"]}} },
      { t:"先不进去，需要更多准备", go:"seal_6_return", effect:{flag:"past_delayed"} }
    ]
  };
};

N["past_arrival"] = function(){
  enterPast(0);
  return {
    place: "三千年前·艾尔达大陆",
    text: function(){
      const arr = [];
      arr.push("你睁开眼睛。");
      arr.push("你站在一片草地上。不是铁峰堡的草地，不是交汇城的草地——是……一片你从未见过的草地。天空是蓝色的，比你见过的任何蓝色都要蓝。空气是甜的——不是食物的甜，是……存在的甜。这个世界，还没有被切除情感。");
      arr.push("然后你听到了声音。");
      arr.push("笑声。不是一个人的笑，是……很多人的笑。从远处的村庄传来。人们在笑，在唱歌，在跳舞。他们的情感是……满的。满到溢出来。");
      arr.push("你感觉到了——这个世界和你来自的世界，完全不同。这里的人会因为喜悦而跳舞跳到虚脱，会因为悲伤而哭到昏迷，会因为愤怒而打架打到死。情感是这里的空气，是这里的水，是这里的一切。");
      arr.push("然后你看到了他。");
      arr.push("一个年轻人。二十多岁，黑发，穿着简单的袍子，坐在一棵树下，手里拿着一本书。他在笑——不是微笑，是……真正的笑。眼睛弯成了月牙，嘴角咧到了耳根。");
      arr.push("他感觉到了你，抬起头。");
      arr.push("「你好。」他说。「你是从很远的地方来的吧？我叫黄林晶。」");
      arr.push("三千年了。你终于见到了他。不是史书里的英雄，不是传说中的圣人——是一个坐在树下看书、笑得像个孩子的年轻人。");
      arr.push("离开艾尔达大陆时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"告诉他你是谁，从哪里来", check:"CHA", go:"past_huanglingjing_talk", effect:{flag:"past_hlj_truth"} },
      { t:"不说，只是说自己是旅行者", go:"past_huanglingjing_talk", effect:{flag:"past_hlj_lie"} },
      { t:"问他：你知道你将来会做什么吗？", check:"INT", go:"past_huanglingjing_talk", effect:{flag:"past_hlj_hint"} }
    ]
  };
};

N["past_huanglingjing_talk"] = function(){
  return {
    place: "三千年前·树下",
    text: function(){
      const arr = [];
      arr.push("你和黄林晶聊了很久。");
      if(S.flags.past_hlj_truth){
        arr.push("你告诉他你来自三千年后。他愣住了，然后笑了。「三千年后？」他说。「那我一定做了什么了不起的事吧？」你没有回答。因为你不知道，他做的事，算不算是'了不起'。");
      }
      if(S.flags.past_hlj_lie){
        arr.push("你说你是旅行者。他点了点头，没有追问。「旅行者好啊。」他说。「我也想旅行。但我走不开。这个世界……需要我。」你注意到他说'需要我'的时候，眼神里有一丝疲惫。");
      }
      if(S.flags.past_hlj_hint){
        arr.push("你问他知不知道将来会做什么。他想了想，然后说：「我想拯救这个世界。」他的语气很平静，像在说今天天气很好。「但我不知道怎么做。这个世界……情感太满了。满到在杀人。我需要找到一个方法。」你看着他的眼睛，看到了——恐惧。他害怕自己找不到方法。");
      }
      arr.push("然后他告诉你，他最近有了一个想法。一个……可怕的想法。");
      arr.push("「如果情感在杀人，」他说。「那如果……把情感切掉呢？」");
      arr.push("他说这句话的时候，自己都打了个寒颤。");
      arr.push("「我知道这不对。」他说。「但我想不出别的办法了。」");
      arr.push("你看着眼前这个年轻人。他不是圣人。他是一个——害怕的、绝望的、试图拯救世界的年轻人。他即将做出一个三千年后还在影响世界的决定。而你，是唯一知道后果的人。");
      arr.push("从树下出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"劝他不要这么做，一定有别的办法", check:"CHA", go:"past_era1_choice", effect:{flag:"past_advise_against", sanLoss:3} },
      { t:"告诉他：也许这是唯一的办法", go:"past_era1_choice", effect:{flag:"past_advise_for"} },
      { t:"不说话，只是陪着他", go:"past_era1_choice", effect:{flag:"past_silent"} }
    ]
  };
};

N["past_era1_choice"] = function(){
  pastTravelInit();
  return {
    place: "三千年前·选择",
    text: function(){
      const arr = [];
      arr.push("你和黄林晶聊了一整夜。");
      if(S.flags.past_advise_against){
        arr.push("你劝他不要切除情感。你说一定有别的办法。他听着，点着头，但你知道——他没有被说服。「也许吧。」他说。「但如果有别的办法，我为什么还没找到？」你无法回答。因为三千年后，你也没有找到。");
        S.pastTravel.presentChanges.push("黄林晶对'切除七情'多了一丝犹豫");
      }
      if(S.flags.past_advise_for){
        arr.push("你说也许这是唯一的办法。他看着你，眼神复杂。「你真的这么想？」他问。你点了点头。他沉默了很久。「谢谢你。」他说。「至少，有一个人理解我。」你不知道，你这句话，是不是让他更坚定了。");
        S.pastTravel.presentChanges.push("黄林晶对'切除七情'多了一丝坚定");
      }
      if(S.flags.past_silent){
        arr.push("你没有说话，只是陪着他。他也没有说话。两个人坐在树下，看了一整夜的星星。最后，他说：「谢谢你。」你问谢什么。他说：「谢你没有劝我。也没有支持我。只是……陪着我。三千年了，我会记得这个夜晚。」");
        S.pastTravel.presentChanges.push("黄林晶的第十二封信里，多了一段关于'沉默的旅者'的描述");
      }
      arr.push("天亮了。黄林晶站起来，拍了拍袍子上的灰。「我要走了。」他说。「我还有很多事要做。」");
      arr.push("他看着你，笑了笑——那个像孩子一样的笑。「也许我们还会再见。」他说。「在……某个时间。」");
      arr.push("然后他走了。你站在原地，看着他的背影消失在晨光里。");
      arr.push("你知道，你改变了一些东西。不是大方向——黄林晶还是会切除七情，七印还是会建成。但你改变了……细节。某个态度，某封信，某段记忆。");
      arr.push("这些细节，会在三千年后，以你意想不到的方式显现。");
      arr.push("你与选择作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"继续探索这个时代", go:"past_era1_explore", effect:{flag:"past_continue"} },
      { t:"回到现在", check:"SPR", go:"past_return", effect:{flag:"past_return_early"} }
    ]
  };
};

N["past_era1_explore"] = function(){
  return {
    place: "三千年前·探索",
    text: function(){
      const arr = [];
      arr.push("你在这个时代停留了一段时间。");
      arr.push("你看到了情感之灾前的世界——它美丽，但脆弱。人们会因为一首诗而集体哭泣，会因为一场胜利而集体疯狂，会因为一次争吵而集体杀戮。情感是这里的一切，也是这里的诅咒。");
      arr.push("你遇到了炎——黄林晶最好的朋友。一个热情的战士，他请你喝酒，和你聊了一整夜。他告诉你，他担心黄林晶。「他最近在想一些可怕的东西。」炎说。「如果他真的那么做了……我会阻止他。哪怕用武力。」");
      arr.push("你遇到了年轻的奥雷利安。一个安静的年轻人，他在角落里观察着一切。他看你的眼神很特别——好像他知道你是谁。「你从很远的地方来。」他说。不是问句。「黄林晶也会去很远的地方。不是空间的远，是……时间的远。」");
      arr.push("你看到了这个世界的美，也看到了这个世界的痛。你开始理解——黄林晶为什么会做出那个选择。不是因为他冷酷，是因为他绝望。");
      arr.push("然后，你感觉到了——时光裂隙在召唤你回去。你不能再待下去了。");
      arr.push("探索的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"回到现在", go:"past_return", effect:{flag:"past_return_after_explore", time:1} }
    ]
  };
};

N["past_return"] = function(){
  pastTravelInit();
  return {
    place: "回到现在·第六印",
    text: function(){
      const arr = [];
      arr.push("你回到了现在。");
      arr.push("第六印的时光裂隙在你身后闭合。你跪在地上，喘着气。三千年的记忆——不，是三千年的'经历'——在你脑海里翻涌。");
      arr.push("你看到了黄林晶。不是圣人，是一个害怕的年轻人。");
      arr.push("你看到了炎。不是叛徒，是一个忠诚的朋友。");
      arr.push("你看到了奥雷利安。不是活了三千年的怪物，是一个安静的年轻人。");
      arr.push("你理解了——历史是由人写的。而人，会犯错，会害怕，会做出'必要的恶'，然后用一生来合理化它。");
      arr.push("你也感觉到了——有些东西变了。不是物理上的变化，是……微妙的变化。某个人对你的态度，某件物品的存在，某段历史记录的差异。你在过去种下的种子，已经在现在发芽了。");
      if(S.pastTravel.presentChanges.length > 0){
        arr.push("你带来的改变：");
        for(const c of S.pastTravel.presentChanges){
          arr.push("· " + c);
        }
      }
      arr.push("第六印的事，到此为止。但你知道——你还可以再回去。还有三个时代等着你去看。");
      gainKnowledge("hlj_crime");
      return arr;
    },
    options: [
      { t:"离开第六印，继续旅程", go:"fc_jiaohui_entry", effect:{time:3, flag:"past_complete_era1"} },
      { t:"再次进入时光裂隙，看情感之灾时代", check:"SPR", go:"past_era2_entry", effect:{flag:"past_era2", sanLoss:10} }
    ]
  };
};

// ============================================================
// v24 预言·第一次听到
// ============================================================
N["prophecy_first_hearing"] = function(){
  prophecyInit();
  return {
    place: "序章·第一次听到预言",
    text: function(){
      const arr = [];
      arr.push("你第一次听到关于自己的预言，是在序章。");
      arr.push("那是一个老人——也许是酒馆里的醉汉，也许是教堂里的牧师，也许是路边的乞丐。他看着你，眼睛突然变得浑浊，然后用一种不是他自己的声音说：");
      let prophecyText = "";
      if(S.race === "human"){
        prophecyText = PROPHECIES.church_version.text;
        hearProphecy("church_version");
        arr.push("「" + prophecyText + "」");
        arr.push("（教会版预言。你后来会知道，这只是众多版本中的一个。）");
      } else if(S.race === "orc"){
        prophecyText = PROPHECIES.orc_shaman_version.text;
        hearProphecy("orc_shaman_version");
        arr.push("「" + prophecyText + "」");
        arr.push("（兽人萨满版预言。世代口传，从未被文字记录。）");
      } else if(S.race === "elf"){
        prophecyText = PROPHECIES.elf_version.text;
        hearProphecy("elf_version");
        arr.push("「" + prophecyText + "」");
        arr.push("（精灵版预言。只有女王知道完整内容。）");
      } else if(S.race === "dwarf"){
        prophecyText = PROPHECIES.dwarf_version.text;
        hearProphecy("dwarf_version");
        arr.push("「" + prophecyText + "」");
        arr.push("（矮人版预言。藏在熔炉守卫的密卷里。）");
      } else {
        prophecyText = PROPHECIES.watcher_version.text;
        hearProphecy("watcher_version");
        arr.push("「" + prophecyText + "」");
        arr.push("（守望者版预言。奥雷利安亲手写的。）");
      }
      arr.push("说完，老人恢复了正常，茫然地看着你，好像不知道自己刚才说了什么。");
      arr.push("你站在原地，心里有一种奇怪的感觉——好像有什么东西，在注视着你。");
      arr.push("后来你会知道，这只是开始。不同的势力，有不同版本的预言。每一个版本，都在试图把你往他们想要的方向推。");
      arr.push("你收拾停当，离开第一次听到预言，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"记住这个预言，以后再想", go:"fc_jiaohui_entry", effect:{flag:"prophecy_heard"} },
      { t:"追问老人：这是什么意思？", check:"CHA", go:"prophecy_investigation", effect:{flag:"prophecy_questioned"} }
    ]
  };
};

N["prophecy_investigation"] = function(){
  prophecyInit();
  return {
    place: "预言·调查",
    text: function(){
      const arr = [];
      arr.push("你开始调查预言的来源。");
      arr.push("你走了很多地方，问了很多人。然后你发现了——没有一个统一的预言。");
      arr.push("教会说你是光明神选中的圣人。暗蚀会说你是解放七情的救世主。守望者说你是黄林晶的继承者。兽人萨满说你是决定第二印命运的人。精灵说你是面对傲慢的人。矮人说你是面对贪婪的人。");
      arr.push("每一个版本，都不一样。每一个版本，都在试图把你往他们想要的方向推。");
      arr.push("你开始怀疑——这些预言，真的是'预言'吗？还是……有人故意编造的？");
      arr.push("直到你读到了黄林晶的第十二封信。");
      arr.push("信的最后，有一段被隐藏的内容。你用灵魂魔法，或者用古艾尔达语，或者用某种特殊的方法，读到了它。");
      arr.push("内容是：");
      arr.push("「没有预言。我没有预言任何事。我只是写了十二封信，给三千年后的某个人。那个人不是'被选中的'，只是——恰好来了。所有的'预言'，都是后来的人根据自己的需要编造的。」");
      arr.push("「所以，不要听他们的。听你自己的。你的选择，才是唯一真实的东西。」");
      arr.push("你合上信，站了很久。");
      arr.push("没有预言。没有命运。没有'被选中的人'。");
      arr.push("只有你。和你的选择。");
      hearProphecy("true_prophecy");
      gainKnowledge("hlj_crime");
      arr.push("调查在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"撕碎所有预言，走自己的路", go:"fc_jiaohui_entry", effect:{flag:"prophecy_defied", karma:"freedom"} },
      { t:"利用这些预言，让它们为你服务", go:"fc_jiaohui_entry", effect:{flag:"prophecy_used", karma:"cunning"} },
      { t:"告诉世人真相：没有预言", check:"CHA", go:"fc_jiaohui_entry", effect:{flag:"prophecy_revealed", church_rep:-20, eclipse_rep:-20}, tier:{crit:function(){return["你向世人揭露了真相。一开始没有人信你。但慢慢地，有人开始怀疑。教会的权威动摇了，暗蚀会的号召力下降了。你成了'撕碎预言的人'——有人恨你，有人敬你。但你知道，你做了对的事。"]},ok:function(){return["你试图告诉世人真相，但只有少数人相信你。大部分人还是愿意相信'被选中'的故事——因为那让他们觉得，世界是有意义的。你没有强求。至少，你自己知道了真相。"]},fail:function(){return["你试图揭露真相，但没有人信你。教会说你是异端，暗蚀会说你是叛徒。你不得不暂时沉默。但你知道，真相就在那里。总有一天，会有人看到。"]},critfail:function(){return["你揭露真相的方式出了问题。教会把你当成了'假先知'，暗蚀会把你当成了'教会的间谍'。两边都在追杀你。你不得不逃亡。预言没有被撕碎，反而因为你的'失败'而更加牢固了。"]}} }
    ]
  };
};

console.log("[v24 ao] 黄林晶时代回溯+预言与宿命系统已加载");


// ============================================================
// v24 语言与文字数据
// ============================================================
const LANGUAGES_V24 = {
  common: {id:"common", name:"通用语", speakers:"全人类", difficulty:1, desc:"大陆通用语言，几乎所有人都会说"},
  elvish: {id:"elvish", name:"精灵语", speakers:"精灵", difficulty:2, desc:"优美而古老的语言，有很长的元音和复杂的语法"},
  dwarvish: {id:"dwarvish", name:"矮人语", speakers:"矮人", difficulty:2, desc:"短促有力的语言，很多辅音和喉音"},
  orcish: {id:"orcish", name:"兽人语", speakers:"兽人", difficulty:2, desc:"粗犷直接的语言，很多单音节词"},
  draconic: {id:"draconic", name:"龙语", speakers:"龙族(已灭)", difficulty:4, desc:"龙族的语言，每个词都有魔力，说出来会引起元素共鸣"},
  ancient: {id:"ancient", name:"古艾尔达语", speakers:"黄林晶时代", difficulty:3, desc:"三千年前的语言，七印符文和黄林晶文献都用这种文字"},
  abyss: {id:"abyss", name:"深渊语", speakers:"深渊生物", difficulty:5, desc:"不是用嘴说的语言，是用灵魂说的。学会它的人，SAN值会持续下降"}
};

const LANG_LEVELS = ["不懂","单词","短句","流利","母语级"];

// ============================================================
// v24 气候与天灾数据
// ============================================================
const SEASONS_V24 = {
  spring: {id:"spring", name:"春", travelMod:1.0, desc:"万物复苏，旅行便利，某些种族开始迁徙"},
  summer: {id:"summer", name:"夏", travelMod:0.9, desc:"炎热，沙漠地区SAN消耗增加，农作物丰收"},
  autumn: {id:"autumn", name:"秋", travelMod:1.0, desc:"收获季节，商路繁忙，物价较低"},
  winter: {id:"winter", name:"冬", travelMod:0.8, desc:"寒冷，北方地区封山，旅行速度-20%，需要取暖"}
};

const DISASTERS_V24 = {
  flood: {
    id:"flood", name:"大洪水", type:"水文", affectedRegions:["南方","沿海"], severity:3,
    causes:["第五印不稳","连续暴雨","海平面上升"],
    desc:"海水倒灌，河流泛滥，城市被淹，道路中断，饥荒和难民潮"
  },
  volcano: {
    id:"volcano", name:"火山爆发", type:"地质", affectedRegions:["矮人王国","铁峰堡"], severity:4,
    causes:["第四印不稳","地心活动","原初之物躁动"],
    desc:"火山喷发，熔岩覆盖土地，天空被火山灰遮蔽，矮人王国受到直接威胁"
  },
  ice_age: {
    id:"ice_age", name:"冰河期", type:"气候", affectedRegions:["北方公国","兽人草原"], severity:4,
    causes:["第一印破碎","太阳活动减弱","情感之灾余波"],
    desc:"气温骤降，河流封冻，农作物冻死，北方地区进入漫长的冬天"
  },
  sandstorm: {
    id:"sandstorm", name:"沙尘暴", type:"气象", affectedRegions:["死亡沙漠","教会区"], severity:2,
    causes:["第七印松动","沙漠化加剧","风季"],
    desc:"遮天蔽日的沙尘暴，能见度为零，旅行者迷路，城市被沙尘掩埋"
  },
  earthquake: {
    id:"earthquake", name:"地震", type:"地质", affectedRegions:["全大陆"], severity:3,
    causes:["七印整体不稳","大陆板块活动","原初之物挣扎"],
    desc:"大地震动，建筑倒塌，道路断裂，城市陷入恐慌"
  },
  blood_rain: {
    id:"blood_rain", name:"血雨", type:"超自然", affectedRegions:["全大陆"], severity:5,
    causes:["深渊进度过高","原初之物觉醒","世界屏障变薄"],
    desc:"天上降下红色的雨，不是血，但像血。被雨淋到的人会做噩梦，SAN值下降，教会宣布这是'末日的征兆'"
  }
};

// ============================================================
// v24 引擎函数
// ============================================================
function languageInit(){
  if(!S.languages){
    S.languages = {known:{}, learning:{}, comprehension:{}};
    // 开局根据种族自动掌握语言
    if(S.race === "human"){ S.languages.known.common = 4; }
    else if(S.race === "elf"){ S.languages.known.elvish = 4; S.languages.known.common = 2; }
    else if(S.race === "dwarf"){ S.languages.known.dwarvish = 4; S.languages.known.common = 2; }
    else if(S.race === "orc"){ S.languages.known.orcish = 4; S.languages.known.common = 1; }
    else { S.languages.known.common = 3; }
  }
  return S.languages;
}

function learnLanguage(langId, amount){
  languageInit();
  if(!S.languages.known[langId]){ S.languages.known[langId] = 0; }
  S.languages.known[langId] = Math.min(4, S.languages.known[langId] + amount);
  return S.languages.known[langId];
}

function canUnderstand(langId, threshold){
  languageInit();
  return (S.languages.known[langId] || 0) >= threshold;
}

function climateInit(){
  if(!S.climate){
    S.climate = {currentSeason:"spring", disasterActive:[], disasterHistory:[], mitigation:[]};
  }
  return S.climate;
}

function triggerDisaster(disasterId){
  climateInit();
  if(S.climate.disasterActive.indexOf(disasterId) < 0){
    S.climate.disasterActive.push(disasterId);
    S.climate.disasterHistory.push({id:disasterId, time:S.day});
  }
  return S.climate.disasterActive.length;
}

function endDisaster(disasterId){
  climateInit();
  const idx = S.climate.disasterActive.indexOf(disasterId);
  if(idx >= 0){ S.climate.disasterActive.splice(idx, 1); }
  return S.climate.disasterActive.length;
}

// ============================================================
// v24 语言学习·通用入口
// ============================================================
N["language_menu"] = function(){
  languageInit();
  return {
    place: "语言与文字",
    text: function(){
      const arr = [];
      arr.push("你目前掌握的语言：");
      for(const lid in S.languages.known){
        const lang = LANGUAGES_V24[lid];
        const lvl = S.languages.known[lid];
        arr.push("· " + lang.name + "：" + LANG_LEVELS[lvl]);
      }
      arr.push("");
      arr.push("语言可以通过以下方式学习：找NPC教师、读书、沉浸式环境。不同的语言，打开不同的世界。");
      return arr;
    },
    options: [
      { t:"学习精灵语（需要精灵教师或精灵语词典）", check:"INT", go:"language_learn_elvish", effect:{flag:"lang_elvish_start"} },
      { t:"学习矮人语（需要矮人教师或矮人语词典）", check:"INT", go:"language_learn_dwarvish", effect:{flag:"lang_dwarvish_start"} },
      { t:"学习古艾尔达语（需要特殊书籍或导师）", check:"INT", go:"language_learn_ancient", effect:{flag:"lang_ancient_start"} },
      { t:"学习龙语（极难，需要龙族遗产）", check:"INT", go:"language_learn_draconic", effect:{flag:"lang_draconic_start", sanLoss:3} },
      { t:"离开", go:"fc_jiaohui_entry" }
    ]
  };
};

N["language_learn_elvish"] = function(){
  return {
    place: "学习精灵语",
    text: function(){
      const arr = [];
      arr.push("你开始学习精灵语。");
      arr.push("精灵语是一种优美的语言——很长的元音，很复杂的语法，很多关于'时间'和'自然'的词。人类的语言里没有对应的概念，因为人类的生命太短，无法理解精灵对时间的感知。");
      arr.push("你的精灵老师——也许是银叶学院的教授，也许是某个流浪的精灵——耐心地教你。每一个词，都像一首小诗。");
      arr.push("学了一段时间后，你发现了一件事：精灵语里没有'再见'这个词。只有'待会儿见'和'下次见'。因为对精灵来说，分离只是暂时的。三百年，五百年，一千年——总会再见的。");
      arr.push("你第一次理解了——语言不仅仅是交流工具。语言，是一个种族看待世界的方式。");
      learnLanguage("elvish", 1);
      arr.push("学习精灵语的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"继续学习", check:"INT", go:"language_learn_elvish_2", effect:{time:7, gold:-50}, tier:{crit:function(){return["你学得很快。精灵老师惊讶地看着你：「你有语言天赋。大多数人类学一年才能达到你现在的水平。」你的精灵语达到了'短句'水平。你开始能听懂精灵之间的对话了——他们以为你听不懂，所以在你面前说一些……不该说的话。"]},ok:function(){return["你稳步学习。精灵语达到了'单词'水平。你能看懂简单的精灵语标牌和书籍了。"]},fail:function(){return["精灵语的语法太复杂了。你学了很久，还是只会几个单词。精灵老师安慰你：「没关系。人类的大脑不适合学精灵语。这不是你的错。」"]},critfail:function(){return["你把一个精灵语单词读错了——那个词的意思是'我要挑战你'。一个精灵战士听到了，向你发起了决斗。你费了很大力气才解释清楚。你的精灵语没有进步，反而多了一个仇人。"]}} },
      { t:"休息一下，以后再学", go:"language_menu", effect:{time:1} }
    ]
  };
};

N["language_learn_elvish_2"] = function(){
  learnLanguage("elvish", 1);
  return {
    place: "精灵语·进阶",
    text: function(){
      const arr = [];
      arr.push("你的精灵语越来越好了。");
      arr.push("你能流利地和精灵对话了。你开始读精灵语的书籍——不是翻译版，是原版。你发现了一件事：很多精灵语的诗歌，翻译成通用语之后，失去了90%的美。因为精灵语的美，在于它的'时间感'——每个词都包含了过去、现在和未来。");
      arr.push("你也开始注意到：精灵在说通用语的时候，会不自觉地用精灵语的语法。这让他们的通用语听起来……很奇怪。但你现在理解了。");
      arr.push("语言，是一扇窗。学会了精灵语，你看到了一个人类永远看不到的世界。");
      arr.push("离开进阶时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续学习，达到母语级", check:"INT", go:"language_menu", effect:{time:14, gold:-100}, tier:{crit:function(){return["你达到了母语级。精灵老师看着你，眼神复杂。「你是我见过的第一个把精灵语学到母语级的人类。」他说。「现在，你可以读那些……不对外公开的书籍了。」他递给你一本用精灵语写的古书——关于第三印的真相。"]},ok:function(){return["你达到了流利水平。你可以自由地和精灵交流，阅读大部分精灵语文献。"]},fail:function(){return["你卡在了'流利'和'母语级'之间。精灵老师说：「最后一步，不是靠学的。是靠'活'。你需要在精灵中间生活很多年，才能真正理解这门语言。」"]}} },
      { t:"够用了，去做别的事", go:"language_menu", effect:{time:1} }
    ]
  };
};

N["language_learn_ancient"] = function(){
  return {
    place: "学习古艾尔达语",
    text: function(){
      const arr = [];
      arr.push("你开始学习古艾尔达语。");
      arr.push("这是三千年前的语言——黄林晶的时代，七印的符文，古代遗迹的文字，都是用这种语言写的。它已经没有人说了，只有学者和守望者还在研究。");
      arr.push("你的导师——也许是墨丘利，也许是承天书院的教授，也许是某个守望者——给了你一本词典和一些石碑拓片。");
      arr.push("古艾尔达语很难。不是语法难，是……概念难。三千年前的世界，和现在完全不同。很多词，在现代语言里没有对应。比如'情感之灾'之前，人们有一个词叫'满'——不是物理的满，是情感的满。这个词，在切除七情之后，就消失了。");
      arr.push("你学着学着，开始理解——语言的消失，就是世界的消失。每一个死去的词，都是一段死去的记忆。");
      learnLanguage("ancient", 1);
      arr.push("学习古艾尔达语的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"继续学习", check:"INT", go:"language_ancient_decode", effect:{time:14, gold:-100}, tier:{crit:function(){return["你学得很快。你开始能读懂简单的古艾尔达语文献了——包括七印上的一些符文。你发现，那些符文不是'封印咒文'，是……'喂养咒文'。黄林晶在用符文喂养原初之物。这个发现，让你整夜睡不着。"]},ok:function(){return["你稳步学习。你能看懂一些简单的古艾尔达语碑文了。"]},fail:function(){return["古艾尔达语太难了。很多概念你无法理解，因为你没有经历过那个世界。导师说：「学这门语言，需要的不是智力，是……想象力。你需要想象一个'情感满到溢出来'的世界。」"]}} },
      { t:"休息一下", go:"language_menu", effect:{time:1} }
    ]
  };
};

N["language_ancient_decode"] = function(){
  learnLanguage("ancient", 1);
  return {
    place: "古艾尔达语·解读符文",
    text: function(){
      const arr = [];
      arr.push("你的古艾尔达语达到了可以解读符文的水平。");
      arr.push("你站在一道印前——也许是第一印，也许是你能接触到的任何一道印。你看着上面的符文，一个字一个字地读。");
      arr.push("然后你明白了。");
      arr.push("这些符文不是'封印'。是'喂养'。");
      arr.push("黄林晶用符文，把世界的情感能量，持续地输送给原初之物。让它们沉睡，让它们满足，让它们不醒来。");
      arr.push("但这也意味着——七印在消耗世界的情感。每过一千年，世界的情感就淡一分。三千年了，这个世界的人，已经不太会'真正地笑'和'真正地哭'了。");
      arr.push("你站在符文前，很久没有说话。");
      arr.push("你终于理解了黄林晶的选择——也理解了这个选择的代价。");
      gainKnowledge("seal_truth");
      arr.push("别过解读符文，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"把这个发现记下来，继续调查", go:"fc_jiaohui_entry", effect:{flag:"ancient_runes_decoded", item:"符文解读笔记"} },
      { t:"尝试修改符文，看看会发生什么", check:"INT", go:"fc_jiaohui_entry", effect:{flag:"runes_modified", sanLoss:10, abyssDelta:5} }
    ]
  };
};

N["language_learn_draconic"] = function(){
  return {
    place: "学习龙语",
    text: function(){
      const arr = [];
      arr.push("你开始学习龙语。");
      arr.push("龙族已经灭绝了。龙语是一门死去的语言——但它的力量还在。每一个龙语单词，说出来都会引起元素共鸣。火、水、风、土——龙语是和元素直接对话的语言。");
      arr.push("你学习的材料很少——只有几块龙族遗迹的石碑，和一本残破的词典。大部分内容，你需要靠'感觉'来理解。");
      arr.push("学第一个词的时候，你说了出来。然后——你面前的蜡烛，火焰突然变蓝了。不是物理的蓝，是……元素的蓝。你感觉到了——这个词，在和火元素对话。");
      arr.push("你开始理解为什么龙族会被灭。不是因为它们强大，是因为它们的语言——太强大了。一个会说龙语的人，可以直接操控元素。黄林晶不能允许这种力量存在。");
      learnLanguage("draconic", 1);
      arr.push("你离了学习龙语，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"继续学习", check:"INT", go:"language_draconic_egg", effect:{time:30, sanLoss:5}, tier:{crit:function(){return["你达到了可以说完整句子的水平。你说了一句龙语——然后，大地震动了一下。不是地震，是……元素在回应你。你感觉到了——在某个很远的地方，有什么东西，在回应你的呼唤。是一颗龙蛋。它还活着。"]},ok:function(){return["你学会了一些龙语单词。你能引起微弱的元素共鸣了。"]},fail:function(){return["龙语太难了。你的嗓子无法发出那些音——龙族的声带和人类不同。你最多只能学会几个词。"]}} },
      { t:"这太危险了，放弃", go:"language_menu", effect:{sanRecovery:3} }
    ]
  };
};

N["language_draconic_egg"] = function(){
  learnLanguage("draconic", 1);
  return {
    place: "龙语·呼唤龙蛋",
    text: function(){
      const arr = [];
      arr.push("你用龙语，说出了那个词。");
      arr.push("「醒来。」");
      arr.push("然后，你感觉到了——在很远的地方，在某个你从未去过的地方，有什么东西，动了一下。");
      arr.push("一颗龙蛋。");
      arr.push("三千年了，它一直在沉睡。因为没有人会说龙语，没有人能呼唤它。但现在——你会了。");
      arr.push("你感觉到了它的意识——很微弱，很古老，很……孤独。三千年了，它一直在等。等一个会说龙语的人。");
      arr.push("你可以选择去找它。但你也知道——龙族的复活，会改变这个世界。教会不会允许，暗蚀会会利用，守望者会……不知道会怎么做。");
      arr.push("但那颗龙蛋，在等你。");
      return arr;
    },
    options: [
      { t:"记下位置，以后去找它", go:"fc_jiaohui_entry", effect:{flag:"dragon_egg_found", item:"龙蛋位置图"} },
      { t:"用龙语告诉它：再等等", go:"fc_jiaohui_entry", effect:{flag:"dragon_egg_waiting", karma:"mercy"} },
      { t:"用龙语让它继续沉睡", go:"fc_jiaohui_entry", effect:{flag:"dragon_egg_sleep", karma:"prudence"} }
    ]
  };
};

// ============================================================
// v24 天灾·触发
// ============================================================
N["disaster_trigger_flood"] = function(){
  triggerDisaster("flood");
  return {
    place: "天灾·大洪水",
    text: function(){
      const arr = [];
      arr.push("雨下了七天七夜。");
      arr.push("不是普通的雨。是……不会停的雨。天空像被捅破了一样，雨水倾盆而下，没有减弱的迹象。");
      arr.push("第八天，河水漫过了堤岸。");
      arr.push("第九天，海水倒灌。");
      arr.push("第十天，城市被淹了。不是整个城市——是下半部分。街道变成了河流，房屋的一楼浸在水里，人们爬到屋顶上，等待救援。");
      arr.push("你站在高处，看着这一切。你知道——这不是普通的洪水。第五印不稳了。原初之物'嫉妒'在躁动，它的情绪影响了天气。");
      arr.push("人们在尖叫，在哭泣，在祈祷。教会的牧师在说这是'神的惩罚'，暗蚀会的人在说这是'解放的征兆'，普通人只是——想活下去。");
      arr.push("从大洪水出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"参与救灾，帮助被困的人", check:"STR", go:"disaster_flood_response", effect:{flag:"flood_relief", time:3, karma:"good"}, tier:{crit:function(){return["你跳进水里，一个接一个地把人救到高处。你的力量和勇气，让周围的人也行动起来。大家一起，救了很多人。一个被你救的老人抓住你的手：「谢谢你，年轻人。你是个好人。」你获得了声望，也种下了一颗因果善种。"]},ok:function(){return["你帮助救了一些人。虽然不是全部，但至少——你做了能做的。"]},fail:function(){return["你试图救人，但水太急了。你差点被冲走。最后，你只救了几个人。你站在水里，看着那些还在屋顶上的人，感到无力。"]},critfail:function(){return["你试图救人，但出了意外——你救的人惊慌失措，把你拖下了水。你差点淹死。最后，你被别人救了上来，而你想救的那个人……没有上来。你站在岸边，浑身湿透，心里充满了愧疚。"]}} },
      { t:"利用洪水，囤积物资高价出售", check:"CHA", go:"disaster_flood_response", effect:{flag:"flood_profiteer", gold:200, karma:"bad"} },
      { t:"离开灾区，不卷入", go:"disaster_flood_aftermath", effect:{time:1, flag:"flood_fled"} }
    ]
  };
};

N["disaster_flood_response"] = function(){
  return {
    place: "洪水·应对",
    text: function(){
      const arr = [];
      if(S.flags.flood_relief){
        arr.push("你在洪水中忙了三天。");
        arr.push("你救了很多人，也看到了很多你救不了的人。洪水退去之后，城市一片狼藉——泥泞、废墟、腐烂的气味。但人们还在。还在笑，还在哭，还在活着。");
        arr.push("一个被你救的孩子送给你一朵花——从水里捞出来的，已经快谢了，但还是香的。你收下了。");
        arr.push("你在这个城市的声望，大幅提升了。人们开始叫你'洪水中的救星'。你知道，这个称号太重了。但你没有拒绝。");
      }
      if(S.flags.flood_profiteer){
        arr.push("你在洪水中赚了很多钱。");
        arr.push("你囤积了食物和干净的水，以三倍的价格出售。人们骂你，但还是要买——因为他们没有选择。你看着金币进账，心里有一种……复杂的感觉。");
        arr.push("一个母亲抱着生病的孩子，求你给她一点水。她说她没有钱，但她可以给你干活。你拒绝了。她抱着孩子，在雨里哭了很久。");
        arr.push("你赚了200金龙。但你也知道——你在这个城市的名声，毁了。");
      }
      arr.push("洪水终于退了。但它留下的东西，会持续很久。");
      arr.push("出了应对，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"disaster_flood_aftermath", effect:{time:1} }
    ]
  };
};

N["disaster_flood_aftermath"] = function(){
  endDisaster("flood");
  return {
    place: "洪水·余波",
    text: function(){
      const arr = [];
      arr.push("洪水退去后的第十五天。");
      arr.push("城市开始重建。人们清理废墟，修补房屋，埋葬死者。生活在继续——不管发生了什么，生活总是在继续。");
      arr.push("但你注意到了一些变化：");
      arr.push("· 物价涨了。食物和建筑材料供不应求。");
      arr.push("· 教会的影响力扩大了。他们在救灾中出了力，人们开始更虔诚地信仰光明神。");
      arr.push("· 暗蚀会在招募。他们说'这是解放的征兆'，很多绝望的人加入了他们。");
      arr.push("· 第五印更不稳了。你能感觉到——嫉妒的躁动，比之前更强了。");
      arr.push("一场洪水，改变了很多东西。不只是物理的，还有……人心的。");
      return arr;
    },
    options: [
      { t:"离开，继续旅程", go:"fc_jiaohui_entry", effect:{time:3, flag:"flood_complete"} }
    ]
  };
};

N["disaster_trigger_blood_rain"] = function(){
  triggerDisaster("blood_rain");
  if(typeof abyssProgressUpdate === 'function'){ abyssProgressUpdate(5); }
  return {
    place: "天灾·血雨",
    text: function(){
      const arr = [];
      arr.push("天上下起了红色的雨。");
      arr.push("不是血——至少，不是人类的血。但它看起来像血，闻起来像血，落在皮肤上有一种……温热的感觉，像血。");
      arr.push("人们陷入了恐慌。教会的牧师说这是'末日的征兆'，暗蚀会的人在欢呼'解放即将到来'，普通人只是——躲在家里，不敢出门。");
      arr.push("你站在雨里，抬起头。雨水打在你的脸上，你感觉到了——不是物理的感觉，是……灵魂的感觉。这雨里，有什么东西。有什么……存在。");
      arr.push("深渊进度在提升。世界的屏障在变薄。原初之物在躁动。");
      arr.push("被雨淋到的人，开始做噩梦。不是普通的噩梦——是……别人的噩梦。三千年的噩梦。黄林晶的噩梦，原初之物的噩梦，所有被压抑的情感的噩梦。");
      arr.push("SAN值在下降。不只是你的——是所有人的。");
      return arr;
    },
    options: [
      { t:"寻找血雨的源头", check:"SPR", go:"disaster_blood_rain_source", effect:{flag:"blood_rain_investigate", sanLoss:10} },
      { t:"组织人们躲避，提供庇护", check:"CHA", go:"disaster_blood_rain_shelter", effect:{flag:"blood_rain_shelter", time:3} },
      { t:"离开这个区域", go:"disaster_blood_rain_aftermath", effect:{time:2, flag:"blood_rain_fled"} }
    ]
  };
};

N["disaster_blood_rain_shelter"] = function(){
  return {
    place: "血雨·庇护",
    text: function(){
      const arr = [];
      arr.push("你组织人们躲进了室内——教堂、地下室、任何能遮雨的地方。");
      arr.push("你告诉他们：不要看雨，不要听雨，不要想雨。想别的事。想家人，想食物，想明天的太阳。");
      arr.push("人们照做了。不是因为他们信你，是因为他们没有别的选择。");
      arr.push("你在庇护所里待了三天。三天里，你听到了很多故事——人们在黑暗中，互相讲述自己的人生。你发现，这些普通人的故事，比任何史诗都要动人。");
      arr.push("第四天，雨停了。");
      arr.push("人们走出庇护所，看到了——天空是蓝色的。真正的蓝色。三千年了，也许天空从来没有这么蓝过。");
      arr.push("有人哭了。不是悲伤的哭，是……释然的哭。");
      arr.push("你在这些人心中的声望，达到了新的高度。他们叫你'血雨中的引路人'。");
      endDisaster("blood_rain");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1, flag:"blood_rain_complete"} }
    ]
  };
};

N["disaster_blood_rain_aftermath"] = function(){
  endDisaster("blood_rain");
  return {
    place: "血雨·余波",
    text: function(){
      const arr = [];
      arr.push("血雨停了。但它留下的东西，不会消失。");
      arr.push("被雨淋过的人，有些人疯了。有些人获得了奇怪的能力——能看到死者，能听到声音。有些人变得……不一样了。更冷漠，或者更狂热。");
      arr.push("教会宣布这是'末日的第一征兆'，开始大规模招募信徒。暗蚀会宣布'解放即将到来'，开始更激进的行动。守望者……守望者在沉默。");
      arr.push("你知道——这只是开始。深渊进度在提升，更多的天灾会来。血雨、地震、洪水、火山……世界在'提醒'你：时间不多了。");
      arr.push("你最后回望一眼余波，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"继续旅程，加快速度", go:"fc_jiaohui_entry", effect:{time:1, flag:"blood_rain_complete"} }
    ]
  };
};

console.log("[v24 ap] 语言与文字+气候与天灾系统已加载");


// ============================================================
// v24 大陆议会数据
// ============================================================
const CONTINENTAL_COUNCIL = {
  members: [
    {id:"free_cities", name:"自由城邦联盟", representative:"美第奇家族族长", stance:"中立"},
    {id:"northern", name:"北方公国联盟", representative:"铁拳大公", stance:"主战"},
    {id:"southern", name:"南方商业城邦", representative:"金秤商会会长", stance:"主和"},
    {id:"elf", name:"精灵王国", representative:"精灵女王特使", stance:"观望"},
    {id:"dwarf", name:"矮人王国", representative:"矮人王特使", stance:"观望"},
    {id:"orc", name:"兽人草原", representative:"兽人大萨满", stance:"主战"},
    {id:"eastern", name:"东部王国", representative:"承天书院山长", stance:"中立"},
    {id:"church", name:"光明教会", representative:"红衣主教", stance:"强硬"}
  ],
  issues: [
    {id:"purification", title:"净化令的范围与强度", description:"教会要求扩大净化令范围，清查所有灵魂法师和异端", positions:{church:"支持", free_cities:"反对", elf:"反对", dwarf:"中立", orc:"反对", eastern:"中立", northern:"支持", southern:"反对"}},
    {id:"iron_gate", title:"铁门关战事的应对", description:"兽人攻破铁门关后，是否组织联军反攻", positions:{northern:"主战", orc:"主战(防御)", church:"支持(圣战)", free_cities:"主和", southern:"主和", elf:"观望", dwarf:"观望", eastern:"中立"}},
    {id:"trade_route", title:"银穗商路危机的解决方案", description:"商路中断导致物价飞涨，是否联合维护商路安全", positions:{southern:"强烈支持", free_cities:"支持", dwarf:"支持", church:"中立", northern:"反对(战争优先)", orc:"反对", elf:"观望", eastern:"支持"}},
    {id:"abyss_seal", title:"深渊封印松动的联合应对", description:"七印陆续松动，是否建立联合调查机制", positions:{church:"支持(教会主导)", watcher:"支持(独立调查)", free_cities:"支持", elf:"支持", dwarf:"支持", orc:"反对(内部事务)", northern:"中立", southern:"中立"}},
    {id:"race_relation", title:"种族关系与歧视问题", description:"非人类种族在人类国家受到歧视，是否立法保护", positions:{elf:"强烈支持", dwarf:"支持", orc:"支持", church:"中立", free_cities:"支持", southern:"支持", northern:"反对", eastern:"中立"}},
    {id:"academy", title:"学院的独立性与监管", description:"三大学院是否接受大陆议会的监管和经费审查", positions:{church:"支持(加强监管)", free_cities:"反对(学术自由)", eastern:"反对", elf:"反对", dwarf:"反对", orc:"中立", northern:"中立", southern:"支持"}}
  ]
};

// ============================================================
// v24 情感关系数据
// ============================================================
const RELATION_DIMENSIONS = ["trust","respect","fear","guilt","gratitude","affection","resentment"];
const RELATION_DIMENSION_NAMES = {
  trust:"信任", respect:"尊敬", fear:"恐惧", guilt:"愧疚", gratitude:"报恩", affection:"爱慕", resentment:"怨恨"
};

const CORE_NPCS_RELATION = [
  {id:"mercury", name:"墨丘利", desc:"灵魂魔法教授，前守望者执灯人"},
  {id:"aurelian", name:"奥雷利安", desc:"守望者首席，活了三千年"},
  {id:"cecilia", name:"塞西莉亚", desc:"同学，贵族出身的魔法师"},
  {id:"grom", name:"格罗姆", desc:"同学，兽人战士"},
  {id:"leon", name:"莱昂", desc:"同学，圣骑士"},
  {id:"nightingale", name:"夜莺", desc:"暗蚀会情报司司长"},
  {id:"ironfist", name:"铁拳", desc:"暗蚀会行动司司长"},
  {id:"whiteskull", name:"白骨", desc:"暗蚀会研究司司长"},
  {id:"queen", name:"精灵女王", desc:"精灵王国统治者"},
  {id:"dwarfking", name:"矮人王", desc:"矮人王国统治者"},
  {id:"orcshaman", name:"兽人大萨满", desc:"兽人草原精神领袖"},
  {id:"bishop", name:"红衣主教", desc:"光明教会实权人物"}
];

// ============================================================
// v24 引擎函数
// ============================================================
function councilInit(){
  if(!S.council){
    S.council = {attended:[], positions:{}, influence:0, alliances:[], votes:{}};
  }
  return S.council;
}

function councilVote(issueId, choice){
  councilInit();
  S.council.votes[issueId] = choice;
  // 计算影响力
  S.council.influence += 1;
  return S.council.influence;
}

function relationInit(){
  if(!S.relations){
    S.relations = {deep:{}, events:[], ruptures:[], repairs:[]};
    for(const npc of CORE_NPCS_RELATION){
      S.relations.deep[npc.id] = {trust:0, respect:0, fear:0, guilt:0, gratitude:0, affection:0, resentment:0, history:[], unresolved:[]};
    }
  }
  return S.relations;
}

function relationChange(npcId, dimension, amount){
  relationInit();
  if(!S.relations.deep[npcId]){
    S.relations.deep[npcId] = {trust:0, respect:0, fear:0, guilt:0, gratitude:0, affection:0, resentment:0, history:[], unresolved:[]};
  }
  S.relations.deep[npcId][dimension] = Math.max(-100, Math.min(100, S.relations.deep[npcId][dimension] + amount));
  S.relations.deep[npcId].history.push({day:S.day, dimension, amount});
  return S.relations.deep[npcId][dimension];
}

function getRelationSummary(npcId){
  relationInit();
  const r = S.relations.deep[npcId];
  if(!r) return "未知";
  const parts = [];
  for(const dim of RELATION_DIMENSIONS){
    if(Math.abs(r[dim]) > 10){
      const name = RELATION_DIMENSION_NAMES[dim];
      const val = r[dim] > 0 ? "+" + r[dim] : "" + r[dim];
      parts.push(name + val);
    }
  }
  return parts.length > 0 ? parts.join("，") : "平淡";
}

// ============================================================
// v24 大陆议会·第一届
// ============================================================
N["council_session_1"] = function(){
  councilInit();
  return {
    place: "大陆议会·第一届",
    text: function(){
      const arr = [];
      arr.push("你收到了大陆议会的邀请。");
      arr.push("不是因为你的声望——虽然你的声望确实不低——而是因为你是'能看到符文之人'。八大势力都想知道，你站在哪一边。");
      arr.push("议会在交汇城召开——自由城邦的中心，大陆的十字路口。八大势力的代表齐聚一堂，在美第奇家族的议事厅里，争论大陆的命运。");
      arr.push("你走进议事厅的时候，所有人都在看你。");
      arr.push("红衣主教在微笑——那种'我知道你会选我'的微笑。");
      arr.push("精灵女王的特使在观察你——那种'我在评估你'的观察。");
      arr.push("兽人大萨满在喝麦酒——那种'我不在乎你们说什么'的不在乎。");
      arr.push("你知道，这场议会，将决定很多事情。不只是议题的结果，还有——你在这个大陆的位置。");
      arr.push("议会的第一个议题：净化令的范围与强度。");
      arr.push("离开第一届时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"作为独立调停人参与", check:"CHA", go:"council_issue_purification", effect:{flag:"council_role_mediator", council_influence:5} },
      { t:"作为自由城邦的代表参与", go:"council_issue_purification", effect:{flag:"council_role_free", free_cities_rep:10} },
      { t:"作为观察员旁听", go:"council_issue_purification", effect:{flag:"council_role_observer"} }
    ]
  };
};

N["council_issue_purification"] = function(){
  councilInit();
  return {
    place: "议会·净化令议题",
    text: function(){
      const arr = [];
      arr.push("红衣主教站起来，清了清嗓子。");
      arr.push("「诸位，」他说。「深渊封印松动，暗蚀会活动猖獗，灵魂法师的异端行为日益严重。教会要求——扩大净化令的范围，在全大陆清查所有灵魂法师和疑似异端。」");
      arr.push("自由城邦的代表立刻反对：「净化令已经造成了太多无辜者的死亡。你们教会的'清查'，和屠杀有什么区别？」");
      arr.push("北方公国的代表支持：「铁门关的教训还不够吗？就是因为对异端太宽容，才导致了灾难！」");
      arr.push("精灵女王的特使冷冷地说：「精灵的灵魂魔法，传承了上万年。你们教会要'清查'我们？」");
      arr.push("议事厅里吵成了一片。");
      arr.push("然后，所有人都看向了你。因为你是'能看到符文之人'——你的意见，会影响很多中立势力。");
      arr.push("你知道，你的选择，将决定净化令的命运。也将决定——很多灵魂法师的生死。");
      arr.push("你离了净化令议题，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"支持扩大净化令", check:"CHA", go:"council_vote_purification", effect:{flag:"council_support_purification", church_rep:20, free_cities_rep:-15, elf_rep:-10}, tier:{crit:function(){return["你发表了一场精彩的演讲——不是支持教会的狂热，而是支持'秩序'。你说，在深渊降临的威胁下，大陆需要统一的规则，需要有人来维持秩序。你的演讲说服了很多中立势力。最终投票：扩大净化令，以微弱优势通过。教会的人向你微笑，自由城邦的人向你怒视。你知道，你做了一个选择——而这个选择，会有后果。"]},ok:function(){return["你表达了支持。最终投票：扩大净化令，以微弱优势通过。教会很满意，其他势力有些不满。"]},fail:function(){return["你试图支持，但你的论点不够有力。最终投票：扩大净化令，被否决。教会的人很失望，对你的态度冷淡了。"]},critfail:function(){return["你的支持演讲出了问题——你说错了话，被对手抓住了把柄。最终投票：扩大净化令，被压倒性否决。教会的人很愤怒，认为是你搞砸了。其他势力也觉得你'不可靠'。"]}} },
      { t:"反对扩大净化令", check:"CHA", go:"council_vote_purification", effect:{flag:"council_oppose_purification", free_cities_rep:20, elf_rep:15, church_rep:-20}, tier:{crit:function(){return["你发表了一场动人的演讲——不是反对教会，而是反对'恐惧'。你说，用恐惧统治的大陆，即使没有深渊，也已经毁了。你讲了一个故事——一个无辜的灵魂法师，因为净化令而家破人亡。你的演讲让很多人沉默了。最终投票：扩大净化令，被否决。自由城邦和精灵的人向你鼓掌，教会的人拂袖而去。你知道，你做了一个选择——而这个选择，会有后果。"]},ok:function(){return["你表达了反对。最终投票：扩大净化令，被否决。自由城邦和精灵很满意，教会很不满。"]},fail:function(){return["你试图反对，但你的论点不够有力。最终投票：扩大净化令，以微弱优势通过。自由城邦的人很失望，教会的人很得意。"]},critfail:function(){return["你的反对演讲出了问题——你被对手抓住了'你自己就是灵魂法师/你和灵魂法师有勾结'的把柄。最终投票：扩大净化令，以压倒性优势通过。而且，你自己也被列入了'观察名单'。"]}} },
      { t:"提议折中方案：有限度的清查，由多方监督", check:"INT", go:"council_vote_purification", effect:{flag:"council_compromise_purification", council_influence:10}, tier:{crit:function(){return["你提出了一个折中方案——不是不清查，而是'有限度的清查，由八大势力联合监督'。你说，既不能放任异端，也不能让教会一家独大。你的方案很精巧，各方都能接受一部分。最终投票：折中方案，以较大优势通过。所有人都对你刮目相看——你不是任何一方的傀儡，你有自己的想法。你的议会影响力大幅提升。"]},ok:function(){return["你提出了折中方案。最终投票：折中方案，以微弱优势通过。各方都有些不满，但也都能接受。"]},fail:function(){return["你的折中方案太复杂了，各方都不满意。最终投票：方案被否决，议会陷入僵局。"]}} },
      { t:"不表态，观察局势", go:"council_vote_purification", effect:{flag:"council_abstain_purification"} }
    ]
  };
};

N["council_vote_purification"] = function(){
  councilInit();
  councilVote("purification", S.flags.council_support_purification ? "support" : S.flags.council_oppose_purification ? "oppose" : S.flags.council_compromise_purification ? "compromise" : "abstain");
  return {
    place: "议会·投票结果",
    text: function(){
      const arr = [];
      arr.push("投票结束了。");
      if(S.flags.council_support_purification){
        arr.push("扩大净化令，通过了。");
        arr.push("教会的人在庆祝，自由城邦的人在愤怒，精灵的人在冷笑。你站在中间，知道——从今天起，很多灵魂法师会因为你的选择而死。");
        arr.push("但你也知道，在深渊降临的威胁下，也许……秩序比自由更重要。");
        arr.push("也许。");
      } else if(S.flags.council_oppose_purification){
        arr.push("扩大净化令，被否决了。");
        arr.push("自由城邦的人在庆祝，教会的人在愤怒，北方公国的人在冷笑。你站在中间，知道——从今天起，很多灵魂教会因为你的选择而活。");
        arr.push("但你也知道，没有了净化令，暗蚀会的活动会更加猖獗。");
        arr.push("也许。");
      } else if(S.flags.council_compromise_purification){
        arr.push("折中方案，通过了。");
        arr.push("有限度的清查，由多方监督。教会不满意，自由城邦也不满意，但各方都能接受。你站在中间，知道——这就是政治。没有完美的选择，只有各方都能忍受的选择。");
      } else {
        arr.push("你没有表态。");
        arr.push("最终，扩大净化令以一票之差通过了。你站在角落里，看着人们庆祝或愤怒。你知道，你本可以改变这个结果。但你选择了沉默。");
        arr.push("沉默，也是一种选择。");
      }
      arr.push("第一个议题结束了。但议会还有更多议题。还有更多选择，在等着你。");
      arr.push("投票结果在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"继续下一个议题：铁门关战事", go:"council_issue_iron_gate", effect:{time:1} },
      { t:"离开议会，需要想想", go:"fc_jiaohui_entry", effect:{time:1, flag:"council_left_early"} }
    ]
  };
};

N["council_issue_iron_gate"] = function(){
  return {
    place: "议会·铁门关议题",
    text: function(){
      const arr = [];
      arr.push("第二个议题：铁门关战事。");
      arr.push("北方公国的代表站起来，声音沙哑：「铁门关破了。兽人长驱直入，我们的土地在被蹂躏。我要求——大陆议会组织联军，反攻铁门关！」");
      arr.push("兽人大萨满放下酒杯，冷冷地说：「铁门关是我们的圣地。你们人类占了三千年，现在该还了。」");
      arr.push("红衣主教立刻说：「这是圣战！教会支持反攻！」");
      arr.push("南方商业城邦的代表反对：「战争会让商路彻底中断。我们应该谈判，不是打仗。」");
      arr.push("议事厅又吵成了一片。");
      arr.push("然后，所有人又看向了你。");
      arr.push("你知道，这个选择，将决定——战争还是和平。很多人的生死，在你一念之间。");
      arr.push("铁门关议题在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"支持组织联军反攻", check:"CHA", go:"council_outcome", effect:{flag:"council_support_war", northern_rep:20, orc_rep:-20, church_rep:10} },
      { t:"支持谈判解决", check:"CHA", go:"council_outcome", effect:{flag:"council_support_negotiation", southern_rep:20, orc_rep:10, northern_rep:-15} },
      { t:"提议先停火，再谈判", check:"INT", go:"council_outcome", effect:{flag:"council_ceasefire", council_influence:10} },
      { t:"不表态", go:"council_outcome", effect:{flag:"council_abstain_war"} }
    ]
  };
};

N["council_outcome"] = function(){
  councilInit();
  return {
    place: "议会·第一届结束",
    text: function(){
      const arr = [];
      arr.push("第一届大陆议会，结束了。");
      arr.push("你走出议事厅的时候，天已经黑了。交汇城的灯火在远处闪烁，像一片星海。");
      arr.push("你做了选择。也许是对的，也许是错的。但你做了。");
      arr.push("你回头看了一眼议事厅——八大势力的代表还在里面，还在争论，还在博弈。这就是政治。永远没有结束，只有暂时的平衡。");
      arr.push("你在大陆议会的影响力：" + S.council.influence);
      arr.push("你知道，这只是开始。以后还会有第二届、第三届。每一届，都会有新的议题，新的选择，新的博弈。");
      arr.push("而你，将在其中扮演越来越重要的角色。");
      arr.push("第一届结束在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"离开，继续旅程", go:"fc_jiaohui_entry", effect:{time:1, flag:"council_session_1_complete"} }
    ]
  };
};

// ============================================================
// v24 情感关系·深度事件
// ============================================================
N["relation_deep_mercury"] = function(){
  relationInit();
  return {
    place: "关系·墨丘利",
    text: function(){
      const arr = [];
      arr.push("你和墨丘利的关系，一直很复杂。");
      arr.push("他是你的教授，你的导师，你的引路人。但他也是——前守望者执灯人，塞拉芬事件的亲历者，一个背负了三百年秘密的人。");
      arr.push("你发现，你对他的情感，不是单一的'尊敬'或'信任'。");
      arr.push("你信任他——因为他教了你很多，救过你很多次。");
      arr.push("你尊敬他——因为他的智慧和力量。");
      arr.push("但你也……害怕他。因为你知道，他有很多秘密。而有秘密的人，永远不会完全可信。");
      arr.push("你也对他有……愧疚。因为你知道，他为了保护你，做了很多牺牲。而你，可能永远无法回报。");
      arr.push("今天，他约你在他的研究室见面。他说，有话要对你说。");
      arr.push("出了墨丘利，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"去见他，听听他要说什么", go:"relation_mercury_talk", effect:{flag:"mercury_meet"} },
      { t:"不去，你还没准备好面对他的秘密", go:"fc_jiaohui_entry", effect:{flag:"mercury_avoided", relationChange:{mercury:{trust:-5, resentment:5}}} }
    ]
  };
};

N["relation_mercury_talk"] = function(){
  relationInit();
  return {
    place: "墨丘利的研究室",
    text: function(){
      const arr = [];
      arr.push("你走进墨丘利的研究室。");
      arr.push("他坐在窗边，背对着你。窗外是交汇城的夜景——灯火，人流，喧嚣。但研究室里很安静，只有灵魂魔法装置发出的微弱嗡鸣。");
      arr.push("「你来了。」他说。没有回头。");
      arr.push("你说你来了。");
      arr.push("他沉默了很久。然后，他说：「我有件事，一直没告诉你。」");
      arr.push("你的心跳加速了。你知道，这一天总会来的。");
      arr.push("「塞拉芬的事，」他说。「不是你以为的那样。我不是'封印了她'。我是——'选择了她'。」");
      arr.push("他转过身。你看到了他的眼睛——三百年的疲惫，三百年的愧疚，三百年的……爱。");
      arr.push("「她不是被封印的怪物。」他说。「她是我的妻子。她被深渊感染了，而我——我选择了封印她，而不是杀了她。三百年了，我每天都在地下图书馆陪着她。因为我答应过她，我不会让她一个人。」");
      arr.push("你站在原地，说不出话。");
      arr.push("你一直以为墨丘利是个有秘密的人。但你不知道，他的秘密，是这样的。");
      relationChange("mercury", "trust", 10);
      relationChange("mercury", "guilt", 5);
      relationChange("mercury", "respect", 10);
      arr.push("离开墨丘利的研究室时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"告诉他：你理解他，他不孤单", check:"CHA", go:"relation_mercury_outcome", effect:{flag:"mercury_understood", relationChange:{mercury:{trust:15, affection:10}}}, tier:{crit:function(){return["你看着他的眼睛，说：「你不孤单。」他愣住了。三百年了，没有人对他说过这句话。他的眼眶红了——一个活了三百年的人，眼眶红了。「谢谢你。」他说。声音很轻，像怕打碎什么。你感觉到了——你和他之间，有什么东西变了。不再只是师生，是……理解。"]},ok:function(){return["你表达了理解。他点了点头，眼神柔和了一些。「谢谢你。」他说。"]},fail:function(){return["你试图表达理解，但你的话语太笨拙了。他没有完全相信。「也许吧。」他说。「三百年了，我已经习惯了一个人。」"]},critfail:function(){return["你说错了话——你说'这就是你背叛守望者的原因'。他的眼神瞬间冷了下来。「你不懂。」他说。「你永远不会懂。」他让你离开。你和他的关系，出现了裂痕。"]}} },
      { t:"问他：你后悔吗？", go:"relation_mercury_outcome", effect:{flag:"mercury_asked_regret"} },
      { t:"沉默，只是陪着他", go:"relation_mercury_outcome", effect:{flag:"mercury_silent", relationChange:{mercury:{trust:5, affection:5}}} }
    ]
  };
};

N["relation_mercury_outcome"] = function(){
  return {
    place: "关系·墨丘利·余波",
    text: function(){
      const arr = [];
      arr.push("你离开了墨丘利的研究室。");
      arr.push("夜已经深了。交汇城的灯火还亮着，但你觉得，这个世界和你来的时候，不一样了。");
      arr.push("你理解了墨丘利。不是全部——你永远不可能全部理解一个活了三百年的人。但你理解了一部分。");
      arr.push("你理解了——秘密不一定是欺骗。有时候，秘密是保护。有时候，秘密是爱。");
      arr.push("你和墨丘利的关系：" + getRelationSummary("mercury"));
      arr.push("你知道，从今天起，他看你的眼神，不一样了。不再只是看一个学生——是看一个……理解他的人。");
      arr.push("这很重要。在这个充满谎言和背叛的世界里，被理解，是最珍贵的东西。");
      arr.push("墨丘利的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options: [
      { t:"继续旅程", go:"fc_jiaohui_entry", effect:{time:1, flag:"mercury_deep_complete"} }
    ]
  };
};

// ============================================================
// v24 关系破裂与修复
// ============================================================
N["relation_rupture_event"] = function(){
  relationInit();
  return {
    place: "关系·破裂",
    text: function(){
      const arr = [];
      arr.push("你背叛了他。");
      arr.push("不是故意的——也许是故意的。在某个关键时刻，你选择了自己的利益，而不是他的信任。");
      arr.push("他发现了。");
      arr.push("他没有大喊大叫，没有质问你。他只是——看着你。那种眼神，比任何指责都要伤人。是失望。是'我以为你和别人不一样'的失望。");
      arr.push("「我以为我们是朋友。」他说。声音很平静，平静得可怕。");
      arr.push("然后他走了。没有回头。");
      arr.push("你站在原地，知道——你失去了什么。不是一个盟友，不是一个资源。是一个……曾经信任你的人。");
      arr.push("关系破裂了。某些选项，永久消失了。某些对话，永远不会再有了。");
      arr.push("破裂已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"追上去，解释", check:"CHA", go:"relation_repair_attempt", effect:{flag:"rupture_chase"} },
      { t:"不追，有些事无法解释", go:"fc_jiaohui_entry", effect:{flag:"rupture_accepted", karma:"regret"} },
      { t:"无所谓，反正还有别人", go:"fc_jiaohui_entry", effect:{flag:"rupture_dismissed", karma:"cold"} }
    ]
  };
};

N["relation_repair_attempt"] = function(){
  relationInit();
  return {
    place: "关系·修复",
    text: function(){
      const arr = [];
      arr.push("你追了上去。");
      arr.push("你找到了他——在一个酒馆里，一个人喝酒。他看到你，没有惊讶，也没有愤怒。只是……疲惫。");
      arr.push("「你还来干什么？」他问。");
      arr.push("你说你想解释。");
      arr.push("他喝了一口酒。「解释？」他说。「解释能改变什么？你还是做了。我还是被背叛了。」");
      arr.push("你知道，他说得对。解释改变不了已经发生的事。但你还是要说——因为你欠他一个解释。因为他值得一个解释。");
      arr.push("你说了。你说了你的理由，你的恐惧，你的无奈。你没有为自己辩护——你只是，告诉他真相。");
      arr.push("他听着，喝着酒，没有说话。");
      arr.push("最后，他说：「我还是很生气。」");
      arr.push("「但我相信你不是故意的。」");
      arr.push("「我们……可以重新开始。但裂痕在那里。永远在。」");
      arr.push("离开修复时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"接受裂痕，重新开始", check:"CHA", go:"fc_jiaohui_entry", effect:{flag:"repair_accepted", relationChange:{target:{trust:5, resentment:-10}}}, tier:{crit:function(){return["你说：「裂痕在那里，我知道。但我会用以后的每一天，来弥补。」他看着你，看了很久。然后，他伸出了手。「好。」他说。「重新开始。」你握住了他的手。裂痕还在，但至少——你们还在。"]},ok:function(){return["你们达成了和解。关系没有回到从前，但至少——没有彻底破裂。"]},fail:function(){return["他没有完全原谅你。「我需要时间。」他说。「给我一些时间。」你知道，这可能是很久。也可能，是永远。"]}} },
      { t:"不，裂痕无法弥补，就这样吧", go:"fc_jiaohui_entry", effect:{flag:"repair_rejected", karma:"acceptance"} }
    ]
  };
};

console.log("[v24 aq] 大陆议会+情感关系深度系统已加载");


// ============================================================
// v24 传承与后继者数据
// ============================================================
const SUCCESSION_CANDIDATES = [
  {id:"student", name:"你的学生", relation:"学院中最有天赋的学生", potential:8, personality:"理想主义，渴望证明自己"},
  {id:"child", name:"你的孩子", relation:"你和伴侣的孩子", potential:9, personality:"继承了你的特质，也有自己的想法"},
  {id:"saved", name:"你拯救的人", relation:"你在旅途中救过的人", potential:7, personality:"感恩，忠诚，但有自己的创伤"},
  {id:"follower", name:"你的崇拜者", relation:"因为你的声望而追随你的人", potential:6, personality:"崇拜你，但可能不理解你"}
];

const INHERITANCE_TYPES = ["items","knowledge","reputation","enemies","unfinished"];

// ============================================================
// v24 引擎函数
// ============================================================
function successionInit(){
  if(!S.succession){
    S.succession = {hasSuccessor:false, successorId:null, generation:1, inherited:{}, successors:[]};
  }
  return S.succession;
}

function chooseSuccessor(candidateId){
  successionInit();
  S.succession.hasSuccessor = true;
  S.succession.successorId = candidateId;
  S.succession.successors.push(candidateId);
  return S.succession.successorId;
}

function v24EndingSynthesis(){
  // 九大方向汇聚合成结局
  const result = {
    primordial: (typeof S.primordial !== 'undefined') ? S.primordial.understood.length : 0,
    knowledge: (typeof S.knowledge !== 'undefined') ? S.knowledge.perception : 0,
    past: (typeof S.pastTravel !== 'undefined') ? S.pastTravel.visited.length : 0,
    prophecy: (typeof S.prophecy !== 'undefined') ? S.prophecy.known.length : 0,
    council: (typeof S.council !== 'undefined') ? S.council.influence : 0,
    relations: (typeof S.relations !== 'undefined') ? Object.keys(S.relations.deep).length : 0,
    languages: (typeof S.languages !== 'undefined') ? Object.keys(S.languages.known).length : 0,
    disasters: (typeof S.climate !== 'undefined') ? S.climate.disasterHistory.length : 0,
    succession: (typeof S.succession !== 'undefined') ? (S.succession.hasSuccessor ? 1 : 0) : 0
  };
  return result;
}

// ============================================================
// v24 传承·选择后继者
// ============================================================
N["succession_choose"] = function(){
  successionInit();
  return {
    place: "传承·选择后继者",
    text: function(){
      const arr = [];
      arr.push("最终之战结束了。");
      arr.push("你站在废墟上，看着这个被你改变的世界。它不完美——也许永远不会完美。但它是你的选择的结果。");
      arr.push("你老了。不是物理的老——你的境界让你活得很久。但你累了。三千年的秘密，七印的真相，深渊的本质，原初之物的人格……你知道得太多了。你需要休息。");
      arr.push("但你知道，这个世界还需要有人守护。不是守望者那种守护——是……传承。把你知道的，你经历的，你选择的，传给下一代。");
      arr.push("你有几个选择：");
      for(const c of SUCCESSION_CANDIDATES){
        arr.push("· " + c.name + "（" + c.relation + "）——" + c.personality);
      }
      arr.push("");
      arr.push("或者，你可以选择不传承。让故事到此为止。让下一代自己去寻找答案。");
      arr.push("你离了选择后继者，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"选择你的学生作为后继者", go:"succession_training", effect:{flag:"successor_student", item:"传承·知识"} },
      { t:"选择你的孩子作为后继者", go:"succession_training", effect:{flag:"successor_child", item:"传承·血脉"} },
      { t:"选择你拯救的人作为后继者", go:"succession_training", effect:{flag:"successor_saved", item:"传承·恩情"} },
      { t:"选择你的崇拜者作为后继者", go:"succession_training", effect:{flag:"successor_follower", item:"传承·声望"} },
      { t:"不传承，故事到此为止", go:"ending_v24_no_succession", effect:{flag:"no_succession", karma:"freedom"} }
    ]
  };
};

N["succession_training"] = function(){
  successionInit();
  const candidateId = S.flags.successor_student ? "student" : S.flags.successor_child ? "child" : S.flags.successor_saved ? "saved" : "follower";
  chooseSuccessor(candidateId);
  const candidate = SUCCESSION_CANDIDATES.find(c => c.id === candidateId);
  return {
    place: "传承·培养",
    text: function(){
      const arr = [];
      arr.push("你选择了" + candidate.name + "。");
      arr.push("接下来的几年，你把你知道的一切，都教给了" + candidate.name + "。");
      arr.push("不是全部——有些东西，必须自己去经历。你只教了'框架'：七印的真相，原初之物的人格，黄林晶的罪，深渊的本质，预言的虚假。");
      arr.push(candidate.name + "学得很快。比你想象的快。但你也注意到——" + candidate.name + "有自己的想法。" + candidate.name + "不是你的复制品。" + candidate.name + "会问你：「为什么一定要封印？为什么不能共存？」「为什么黄林晶的选择就是错的？」「你怎么知道你做的是对的？」");
      arr.push("这些问题，你没有答案。因为你也不知道。");
      arr.push("但你知道——这很好。下一代应该有自己的问题，自己的答案，自己的选择。");
      arr.push("传承，不是复制。是——给下一代一个起点，然后让他们自己走。");
      arr.push("出了培养，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"完成传承，把世界交给下一代", go:"succession_handover", effect:{time:365, flag:"training_complete"} }
    ]
  };
};

N["succession_handover"] = function(){
  successionInit();
  return {
    place: "传承·交接",
    text: function(){
      const arr = [];
      arr.push("传承的那一天，你把所有东西都交给了" + (S.succession.successorId === "student" ? "你的学生" : S.succession.successorId === "child" ? "你的孩子" : S.succession.successorId === "saved" ? "你拯救的人" : "你的崇拜者") + "。");
      arr.push("你的武器，你的护甲，你的特殊物品。");
      arr.push("你的知识，你的技能，你掌握的语言。");
      arr.push("你的声望，你的盟友，你的敌人。");
      arr.push("你未完成的事，你未兑现的承诺，你未解决的印。");
      arr.push("全部。");
      arr.push("" + (S.succession.successorId === "student" ? "你的学生" : "你的后继者") + "看着你，眼神复杂。「你真的要走了吗？」");
      arr.push("你说是的。");
      arr.push("「那这个世界……怎么办？」");
      arr.push("你笑了笑——那种经历了一切之后的、平静的笑。「这个世界，」你说。「从来不是靠一个人拯救的。它靠的是——每一代人，做出自己的选择。」");
      arr.push("「现在，轮到你了。」");
      arr.push("交接在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"看着后继者走向新世界", go:"successor_new_era", effect:{flag:"handover_complete"} }
    ]
  };
};

N["successor_new_era"] = function(){
  successionInit();
  return {
    place: "新时代·后继者的视角",
    text: function(){
      const arr = [];
      arr.push("你站在远处，看着后继者走向新世界。");
      arr.push("那是一个你创造的世界——根据你的选择，它可能是封印的、解放的、共存的。它不完美，但它是真实的。");
      arr.push("后继者会遇到新的问题。不是七印，不是深渊——是你那个时代没有的问题。因为世界在变，每一代人都有自己的挑战。");
      arr.push("你看到后继者在十字路口犹豫。你看到后继者做出了选择——和你不一样的选择。你看到后继者犯了错，然后从错误中学习。");
      arr.push("你想帮忙。但你没有。因为你知道——这不是你的故事了。这是后继者的故事。");
      arr.push("你转身，走向远方。你的故事结束了。但世界的故事，还在继续。");
      arr.push("一代人有一代人的使命。你的使命完成了。");
      arr.push("现在，休息吧。");
      S.succession.generation = 2;
      return arr;
    },
    options: [
      { t:"（终章）", go:"ending_v24_succession", effect:{flag:"era_complete"} }
    ]
  };
};

// ============================================================
// v24 九大方向联动·终局合成
// ============================================================
N["v24_ending_synthesis"] = function(){
  const r = v24EndingSynthesis();
  return {
    place: "终局·九大方向汇聚",
    text: function(){
      const arr = [];
      arr.push("最终之战，终于结束了。");
      arr.push("你站在死亡沙漠的中心，看着这个被你改变的世界。");
      arr.push("你回顾你的旅程——从序章到学院，从大陆到深渊，从七印到原初之物。你做了无数选择，每一个选择，都塑造了这个世界。");
      arr.push("");
      arr.push("你的旅程总结：");
      arr.push("· 理解了 " + r.primordial + " 个原初之物的人格");
      arr.push("· 获得了 " + r.knowledge + " 层深层知识（及代价）");
      arr.push("· 回溯了 " + r.past + " 个时代的黄林晶往事");
      arr.push("· 听到了 " + r.prophecy + " 个版本的预言");
      arr.push("· 在大陆议会的影响力：" + r.council);
      arr.push("· 建立了 " + r.relations + " 段深度关系");
      arr.push("· 掌握了 " + r.languages + " 种语言");
      arr.push("· 经历了 " + r.disasters + " 场天灾");
      arr.push("· 传承：" + (r.succession ? "有后继者" : "无后继者"));
      arr.push("");
      arr.push("这些，将决定你的结局。");
      arr.push("你收拾停当，离开九大方向汇聚，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"查看你的结局", go:"v24_final_ending", effect:{flag:"ending_synthesis_complete"} }
    ]
  };
};

N["v24_final_ending"] = function(){
  const r = v24EndingSynthesis();
  let endingType = "normal";
  if(r.primordial >= 7 && r.knowledge >= 4 && r.succession){
    endingType = "true";
  } else if(r.primordial >= 5 && r.knowledge >= 3){
    endingType = "good";
  } else if(r.primordial === 0 && r.knowledge === 0){
    endingType = "ignorant";
  }
  return {
    place: "结局·" + (endingType === "true" ? "真结局" : endingType === "good" ? "好结局" : endingType === "ignorant" ? "无知结局" : "普通结局"),
    text: function(){
      const arr = [];
      if(endingType === "true"){
        arr.push("【真结局·完整的世界】");
        arr.push("你理解了全部七个原初之物。你承担了所有深层知识的代价。你选择了传承。");
        arr.push("你没有封印深渊，也没有解放它。你选择了第三条路——共存。");
        arr.push("原初之物不再是被囚禁的怪物，也不再是毁灭世界的灾难。它们成为了这个世界的一部分——像风，像雨，像情感本身。");
        arr.push("世界重新完整了。不是黄林晶时代那种'满到溢出来'的完整，是……平衡的完整。人们会笑，会哭，会愤怒，会爱——但不会被情感吞噬。");
        arr.push("你的后继者，在这个新世界里，开始了新的故事。");
        arr.push("而你，终于可以休息了。");
        arr.push("三千年了。从黄林晶切除七情的那一天起，世界就在等待一个人——一个能看到符文、能理解原初之物、能做出第三条路选择的人。");
        arr.push("那个人，是你。");
        arr.push("不是因为你被选中了。是因为你选择了来。");
      } else if(endingType === "good"){
        arr.push("【好结局·不完美的和平】");
        arr.push("你理解了大部分原初之物，承担了很多知识的代价。你做出了选择——也许是封印，也许是解放，也许是共存。");
        arr.push("世界没有变成你理想中的样子，但它……稳定了。人们还在笑，还在哭，还在活着。");
        arr.push("有些原初之物还在沉睡，有些已经觉醒。有些秘密还没有被揭开，有些真相还没有人知道。");
        arr.push("但这就是世界。不完美，但真实。");
        arr.push("你的故事结束了。但世界的故事，还在继续。");
      } else if(endingType === "ignorant"){
        arr.push("【无知结局·盲人的旅程】");
        arr.push("你走完了全程。但你什么都没有理解。");
        arr.push("你没有看到原初之物的人格，你没有获得深层知识，你没有回溯过去，你没有调查预言。");
        arr.push("你只是……走了一遍流程。打了一些怪，做了一些选择，然后到了终点。");
        arr.push("世界因为你的选择而改变了——但你不知道为什么。你不知道七印的真相，不知道黄林晶的罪，不知道深渊的本质。");
        arr.push("你像一个盲人，在一个充满色彩的世界里走了一圈。你摸到了一些东西，听到了一些声音，但你从来没有'看见'。");
        arr.push("这也是一种结局。不是坏结局——只是……无知的结局。");
        arr.push("也许，下一次，你会选择去理解。");
      } else {
        arr.push("【普通结局·选择的重量】");
        arr.push("你做出了选择。");
        arr.push("不是最好的选择，也不是最坏的选择。只是……你的选择。");
        arr.push("世界因为你的选择而改变了。有些人因为你而活，有些人因为你而死。有些真相被揭开，有些秘密被永远埋藏。");
        arr.push("你站在终点，回顾你的旅程。你有遗憾——每个人都有遗憾。但你也有……满足。因为你做了你能做的一切。");
        arr.push("这就是你的故事。不完美，但真实。不伟大，但属于你。");
      }
      arr.push("");
      arr.push("——《艾尔达大陆：群雄割据》——");
      arr.push("—— 完 ——");
      return arr;
    },
    options: [
      { t:"重新开始，走另一条路", go:"fc_jiaohui_entry", effect:{flag:"new_game_plus"} },
      { t:"查看编年史，回顾你的旅程", go:"chronicle_view", effect:{} }
    ]
  };
};

// ============================================================
// v24 无传承结局
// ============================================================
N["ending_v24_no_succession"] = function(){
  return {tag:"ending",
    place: "结局·无传承",
    text: function(){
      const arr = [];
      arr.push("你选择了不传承。");
      arr.push("你把所有的秘密，所有的知识，所有的选择，都带进了坟墓。");
      arr.push("下一代人，将自己去寻找答案。他们会犯你犯过的错，会走你走过的弯路，会面对你面对过的恐惧。");
      arr.push("但也许——这才是对的。");
      arr.push("因为你知道，被'传承'的答案，永远不是自己的答案。每一代人，都必须自己去寻找，自己去选择，自己去承担。");
      arr.push("你消失在了历史中。没有雕像，没有传说，没有'英雄'的名号。");
      arr.push("但你改变了世界。即使没有人知道。");
      arr.push("这就够了。");
      arr.push("");
      arr.push("——《艾尔达大陆：群雄割据》——");
      arr.push("—— 完 ——");
      return arr;
    },
    options: [
      { t:"重新开始", go:"fc_jiaohui_entry", effect:{flag:"new_game_plus"} }
    ]
  };
};

// ============================================================
// v24 封印结局
// ============================================================
N["ending_v24_seal"] = function(){
  return {tag:"ending",
    place: "结局·封印",
    text: function(){
      const arr = [];
      arr.push("你选择了封印。");
      arr.push("像黄林晶一样。你重新加固了七印，让原初之物继续沉睡，让深渊继续被压抑。");
      arr.push("世界稳定了。人们继续过着他们的日子——不会笑到疯狂，不会哭到死亡，不会被情感吞噬。");
      arr.push("但你知道，这只是'延缓'。三千年后，七印会再次松动，深渊会再次降临，会有另一个'能看到符文之人'，面对同样的选择。");
      arr.push("你选择了黄林晶的路。你知道这条路的代价——因为你见过黄林晶的晚年。孤独，后悔，三千年的等待。");
      arr.push("但你也知道，在你找到更好的办法之前，这是唯一能做的。");
      arr.push("也许，下一代人，会找到更好的办法。");
      arr.push("也许。");
      arr.push("封印完成的那一刻，大地安静了一瞬。");arr.push("七道光柱同时亮起，又同时暗下去——不是熄灭，是沉入地底，像七把剑，插进世界的骨头里。");arr.push("你站在阵眼上，浑身是伤，可你站着。风从四面八方吹来，吹过你的伤口，吹过你身后那些沉默的人。");arr.push("没有人欢呼。所有人都看着那七道光柱消失的地方，像是看着一个终于合上的伤口。");arr.push("过了一会儿，有人开始哭。有人跪下来，把额头抵在地上。有人只是站着，看着你，什么也不说。");arr.push("你低下头，看着自己的手。那双手上，已经没有封印的纹路了——它们完成了它们的使命，回到了一只普通的手。");arr.push("你握了握拳，又松开。你抬起头，看着天。天很蓝，蓝得像什么都没有发生过。");arr.push("可你知道，发生过。你身上每一道伤都知道。");return arr;
    } /*v45inj:ending_v24_seal*/,
    options: [
      { t:"继续", go:"v24_ending_synthesis", effect:{flag:"ending_seal"} }
    ]
  };
};

// ============================================================
// v24 解放结局
// ============================================================
N["ending_v24_free"] = function(){
  return {tag:"ending",
    place: "结局·解放",
    text: function(){
      const arr = [];
      arr.push("你选择了解放。");
      arr.push("你打碎了七印。原初之物觉醒了。情感回到了这个世界。");
      arr.push("一开始，是混乱。人们突然被淹没在'完整的情感'中——笑到疯狂，哭到崩溃，愤怒到杀戮。世界在情感的浪潮中摇摇欲坠。");
      arr.push("但慢慢地，人们开始适应。像一个久在黑暗中的人，突然看到了光——一开始刺眼，但慢慢地，开始看见色彩。");
      arr.push("世界重新完整了。不完美，危险，充满了情感的极端——但完整。");
      arr.push("你知道，你做了一个危险的选择。很多人因为你的选择而死。很多人因为你的选择而活。");
      arr.push("但你相信——一个完整的世界，即使危险，也比一个'被切除了情感'的世界，更值得活。");
      arr.push("黄林晶选择了封印。你选择了解放。");
      arr.push("三千年了，世界终于有了另一个答案。");
      return arr;
    },
    options: [
      { t:"继续", go:"v24_ending_synthesis", effect:{flag:"ending_free"} }
    ]
  };
};

// ============================================================
// v24 共存结局
// ============================================================
N["ending_v24_coexist"] = function(){
  return {tag:"ending",
    place: "结局·共存",
    text: function(){
      const arr = [];
      arr.push("你选择了共存。");
      arr.push("不是封印，不是解放。是——共存。");
      arr.push("你和原初之物达成了协议。它们不再被囚禁，但也不会随意释放。它们成为了这个世界的一部分——像风，像雨，像情感本身。");
      arr.push("人们学会了和情感共处。不是压抑，不是放纵——是……平衡。像一个走钢丝的人，在情感的两端之间，找到了那个微妙的点。");
      arr.push("世界不完美。还有战争，还有痛苦，还有悲伤。但人们会笑了——真正的笑。会哭了——真正的哭。会爱了——真正的爱。");
      arr.push("三千年了。从黄林晶切除七情的那一天起，世界就在等待一个答案。");
      arr.push("封印不是答案。解放不是答案。");
      arr.push("共存，才是答案。");
      arr.push("而你，找到了它。");
      arr.push("你离了共存，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"继续", go:"v24_ending_synthesis", effect:{flag:"ending_coexist"} }
    ]
  };
};

// ============================================================
// v24 成为深渊之主结局
// ============================================================
N["ending_v24_become"] = function(){
  return {tag:"ending",
    place: "结局·新的深渊之主",
    text: function(){
      const arr = [];
      arr.push("你选择了成为新的深渊之主。");
      arr.push("你吸收了深渊的力量。原初之物臣服于你。七印碎了，因为不再需要了——你就是封印，你就是深渊。");
      arr.push("世界在你的统治下，进入了一种……奇怪的和平。没有战争，因为没有人敢战争。没有痛苦，因为痛苦被你吸收了。没有情感的极端，因为所有的情感都流向了你。");
      arr.push("你成为了这个世界的'容器'——所有被压抑的情感，所有无法释放的痛苦，所有不敢表达的爱，都流向了你。");
      arr.push("你承受着一切。");
      arr.push("人们叫你'深渊之主'。他们怕你，但也……依赖你。因为没有你，他们的情感会再次失控。");
      arr.push("你成为了新的黄林晶——用自己的存在，维持着世界的平衡。");
      arr.push("孤独。永恒的孤独。");
      arr.push("但你知道，这是你的选择。");
      arr.push("新的深渊之主在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options: [
      { t:"继续", go:"v24_ending_synthesis", effect:{flag:"ending_become"} }
    ]
  };
};

console.log("[v24 ar] 传承与后继者+九大方向联动终局系统已加载");


// ============================================================
// v25 随机世界生成器数据
// ============================================================
const WORLD_FACTION_STATES = [
  {id:"ascendant", name:"蒸蒸日上", desc:"该势力正在扩张，军力强盛"},
  {id:"stable", name:"稳如磐石", desc:"该势力保持现状，不温不火"},
  {id:"declining", name:"日渐衰退", desc:"该势力内部矛盾重重，国力下滑"},
  {id:"civil_war", name:"内乱频仍", desc:"该势力爆发了内战或政变"},
  {id:"new_leader", name:"新主即位", desc:"该势力刚换了领导人，政策不明"}
];

const WORLD_ACADEMY_STATES = [
  {id:"light_dominant", name:"光明派掌权", desc:"教会势力在学院占优，灵魂魔法被打压"},
  {id:"free_dominant", name:"自由派掌权", desc:"学术自由派占优，研究氛围浓厚"},
  {id:"eclipse_cell", name:"暗蚀会活跃", desc:"暗蚀会支部在学院暗中扩张"},
  {id:"balanced", name:"三足鼎立", desc:"各派势均力敌，暗流涌动"},
  {id:"professor_missing", name:"教授失踪", desc:"一位重要教授突然失踪，学院人心惶惶"}
];

const WORLD_CLASSMATE_SECRETS = [
  {id:"genius", name:"天才", desc:"天赋异禀，被各方势力关注"},
  {id:"troublemaker", name:"问题学生", desc:"经常惹事，但有不可告人的原因"},
  {id:"eclipse_asset", name:"暗蚀会外围", desc:"暗中为暗蚀会提供情报"},
  {id:"watcher_candidate", name:"守望者候选", desc:"被守望者密探暗中考察"},
  {id:"noble_hidden", name:"贵族隐姓", desc:"隐瞒了贵族身份，原因不明"},
  {id:"revenge", name:"复仇者", desc:"入学是为了向某人复仇"},
  {id:"scholar", name:"学者型", desc:"痴迷研究，对政治不感兴趣"},
  {id:"social_butterfly", name:"社交达人", desc:"与各方都有联系，消息灵通"}
];

const WORLD_CITY_EVENTS = [
  {id:"famine", name:"饥荒", desc:"粮食歉收，物价飞涨"},
  {id:"new_ruler", name:"换城主", desc:"城主换人，政策可能大变"},
  {id:"plague", name:"瘟疫", desc:"瘟疫爆发，城市被封锁"},
  {id:"trade_cut", name:"商路断绝", desc:"主要商路被切断，物资短缺"},
  {id:"festival", name:"盛大节日", desc:"城市正在举办盛大节日，气氛欢乐"},
  {id:"military_occupation", name:"军事占领", desc:"被另一势力的军队占领"},
  {id:"normal", name:"平静如常", desc:"城市一切正常"}
];

const WORLD_EVENT_INTENSITY = [
  {id:"low", name:"微弱", desc:"事件刚刚萌芽，影响有限"},
  {id:"moderate", name:"中等", desc:"事件正在发展，开始影响日常"},
  {id:"high", name:"剧烈", desc:"事件全面爆发，人人自危"},
  {id:"critical", name:"临界", desc:"事件即将失控，随时可能质变"}
];

// ============================================================
// v25 动态世界演变数据
// ============================================================
const NPC_OFFLINE_ACTIONS = [
  {id:"study", name:"在图书馆学习", effect:{knowledge:1}},
  {id:"train", name:"在训练场训练", effect:{power:1}},
  {id:"socialize", name:"在酒馆社交", effect:{cha:1}},
  {id:"secret_meeting", name:"秘密会面", effect:{secret:1}},
  {id:"disappear", name:"突然消失", effect:{missing:true}},
  {id:"join_faction", name:"加入某派系", effect:{faction:1}},
  {id:"get_injured", name:"受伤了", effect:{injured:true}},
  {id:"fall_in_love", name:"恋爱了", effect:{love:1}}
];

const FACTION_OFFLINE_ACTIONS = [
  {id:"war", name:"发动战争", target:"random"},
  {id:"alliance", name:"结盟", target:"random"},
  {id:"betray", name:"背叛盟友", target:"random"},
  {id:"coup", name:"内部政变", target:"self"},
  {id:"expand", name:"扩张领土", target:"random"},
  {id:"trade_deal", name:"签订贸易协定", target:"random"}
];

const TIME_WINDOWS = [
  {id:"mercury_leave", name:"墨丘利离开学院", startDay:540, endDay:600, missedConsequence:"墨丘利在离开前被暗蚀会暗杀，灵魂魔法传承断绝"},
  {id:"classmate_graduation", name:"同学毕业分流", startDay:720, endDay:750, missedConsequence:"你错过了与同学的告别，他们的命运不再受你影响"},
  {id:"seal_2_ritual", name:"第二印萨满仪式", startDay:900, endDay:930, missedConsequence:"萨满在仪式中死亡，第二印彻底破碎"},
  {id:"council_session", name:"大陆议会", startDay:1000, endDay:1030, missedConsequence:"议会通过了对你不利的决议"},
  {id:"abyss_messenger", name:"深渊使者现身", startDay:1200, endDay:1230, missedConsequence:"使者毁灭了一座城市，深渊进度+15"}
];

// ============================================================
// v25 引擎函数
// ============================================================
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateWorld(seed) {
  if (!seed) seed = Math.floor(Math.random() * 999999);
  const rand = seededRandom(seed);
  const world = { seed: seed };

  // 势力状态
  world.factions = {};
  const factions = ["free_cities","northern","southern","elves","dwarves","orcs","eastern","church"];
  for (const f of factions) {
    const stateIdx = Math.floor(rand() * WORLD_FACTION_STATES.length);
    world.factions[f] = {
      state: WORLD_FACTION_STATES[stateIdx].id,
      stateName: WORLD_FACTION_STATES[stateIdx].name,
      power: Math.floor(rand() * 100) + 1
    };
  }

  // 学院状态
  const acadIdx = Math.floor(rand() * WORLD_ACADEMY_STATES.length);
  world.academy = {
    state: WORLD_ACADEMY_STATES[acadIdx].id,
    stateName: WORLD_ACADEMY_STATES[acadIdx].name,
    politicalBalance: {light: Math.floor(rand()*40)+30, free: Math.floor(rand()*40)+30, eclipse: Math.floor(rand()*20)+10}
  };

  // 同学秘密
  world.classmates = {};
  for (let i = 1; i <= 11; i++) {
    const secIdx = Math.floor(rand() * WORLD_CLASSMATE_SECRETS.length);
    world.classmates["classmate_"+i] = {
      secret: WORLD_CLASSMATE_SECRETS[secIdx].id,
      secretName: WORLD_CLASSMATE_SECRETS[secIdx].name
    };
  }

  // 城市状态
  world.cities = {};
  const cities = ["jiaohui","holy_city","iron_peak","silver_leaf","iron_gate","cheng_tian","orc_court","south_port"];
  for (const c of cities) {
    const evtIdx = Math.floor(rand() * WORLD_CITY_EVENTS.length);
    world.cities[c] = {
      event: WORLD_CITY_EVENTS[evtIdx].id,
      eventName: WORLD_CITY_EVENTS[evtIdx].name,
      economy: Math.floor(rand() * 100) + 1,
      morale: Math.floor(rand() * 100) + 1
    };
  }

  // 事件强度
  world.eventIntensity = {
    purification: WORLD_EVENT_INTENSITY[Math.floor(rand()*4)].id,
    tradeRoute: WORLD_EVENT_INTENSITY[Math.floor(rand()*4)].id,
    abyss: WORLD_EVENT_INTENSITY[Math.floor(rand()*3)].id,
    academy: WORLD_EVENT_INTENSITY[Math.floor(rand()*4)].id
  };

  S.worldSeed = world;
  return world;
}

function getWorldState(category) {
  if (!S.worldSeed) generateWorld();
  if (category) return S.worldSeed[category];
  return S.worldSeed;
}

function worldSeedToString() {
  if (!S.worldSeed) return "未生成";
  return "种子#" + S.worldSeed.seed;
}

function worldTick(days) {
  if (!S.worldTimeline) {
    S.worldTimeline = {day: 0, npcActions: [], factionActions: [], activeEvents: []};
  }
  S.worldTimeline.day += days;

  // NPC离线行动（每天有小概率触发）
  if (Math.random() < 0.3) {
    const action = NPC_OFFLINE_ACTIONS[Math.floor(Math.random() * NPC_OFFLINE_ACTIONS.length)];
    S.worldTimeline.npcActions.push({
      day: S.worldTimeline.day,
      action: action.id,
      actionName: action.name
    });
  }

  // 势力离线行动（每30天有概率）
  if (S.worldTimeline.day % 30 === 0 && Math.random() < 0.4) {
    const action = FACTION_OFFLINE_ACTIONS[Math.floor(Math.random() * FACTION_OFFLINE_ACTIONS.length)];
    S.worldTimeline.factionActions.push({
      day: S.worldTimeline.day,
      action: action.id,
      actionName: action.name
    });
  }

  // 检查时间窗口
  checkTimeWindows();
}

function checkTimeWindows() {
  if (!S.worldTimeline) return;
  if (!S.worldTimeline.missedWindows) S.worldTimeline.missedWindows = [];
  for (const tw of TIME_WINDOWS) {
    if (S.worldTimeline.day > tw.endDay && !S.worldTimeline.missedWindows.includes(tw.id)) {
      S.worldTimeline.missedWindows.push(tw.id);
    }
  }
}

function getWorldNews() {
  if (!S.worldTimeline) return "世界一片寂静。";
  const news = [];
  const recentNpc = S.worldTimeline.npcActions.slice(-3);
  const recentFaction = S.worldTimeline.factionActions.slice(-2);
  for (const a of recentNpc) {
    news.push("【第" + a.day + "天】有NPC" + a.actionName);
  }
  for (const a of recentFaction) {
    news.push("【第" + a.day + "天】大陆势力" + a.actionName);
  }
  if (S.worldTimeline.missedWindows && S.worldTimeline.missedWindows.length > 0) {
    const missed = TIME_WINDOWS.find(t => t.id === S.worldTimeline.missedWindows[S.worldTimeline.missedWindows.length-1]);
    if (missed) news.push("你错过了：" + missed.name + "——" + missed.missedConsequence);
  }
  return news.length > 0 ? news.join("\n") : "世界一片寂静。";
}

// ============================================================
// v25 世界生成节点
// ============================================================
N["world_gen_intro"] = function(){
  return {
    place: "新世界的诞生",
    text: function(){
      const arr = [];
      arr.push("艾尔达大陆，三千年了。");
      arr.push("七印镇压着原初之物，守望者守护着秘密，暗蚀会在暗处蠕动，教会在光明中行刑。");
      arr.push("但每一个时代，都是不同的。");
      arr.push("这一次，八大势力中谁在崛起？谁在衰退？学院里哪一派掌权？你的同学们藏着什么秘密？哪座城市在闹饥荒？净化令有多严？");
      arr.push("这些，都由命运的骰子决定。");
      arr.push("");
      arr.push("你可以选择一个随机的世界，也可以输入一个世界种子编号，重现一个你曾经活过的世界。");
      return arr;
    },
    options: [
      { t:"随机生成一个新世界", go:"world_gen_result", effect:{flag:"random_world"} },
      { t:"输入世界种子编号", go:"world_gen_seed", effect:{} }
    ]
  };
};

N["world_gen_seed"] = function(){
  return {
    place: "输入种子",
    text: function(){
      const arr = [];
      arr.push("输入一个数字种子编号（1-999999），相同的种子会生成相同的世界。");
      arr.push("");
      arr.push("你曾经在某个世界里活过。你记得那里的饥荒、那里的战争、那里的某个人。");
      arr.push("你想回去看看吗？");
      arr.push("（在下方输入种子编号，或直接随机）");
      return arr;
    },
    options: [
      { t:"使用种子 12345（示例世界）", go:"world_gen_result", effect:{flag:"seed_12345"} },
      { t:"算了，还是随机吧", go:"world_gen_result", effect:{flag:"random_world"} }
    ]
  };
};

N["world_gen_result"] = function(){
  const seed = S.flags.seed_12345 ? 12345 : Math.floor(Math.random() * 999999);
  const world = generateWorld(seed);
  return {
    place: "世界状态",
    text: function(){
      const arr = [];
      arr.push("世界种子编号：" + world.seed);
      arr.push("");
      arr.push("【大陆势力】");
      for (const f in world.factions) {
        arr.push("· " + f + "：" + world.factions[f].stateName + "（国力" + world.factions[f].power + "）");
      }
      arr.push("");
      arr.push("【艾尔达魔法学院】");
      arr.push("· " + world.academy.stateName);
      arr.push("· 政治格局：光明派" + world.academy.politicalBalance.light + "% / 自由派" + world.academy.politicalBalance.free + "% / 暗蚀会" + world.academy.politicalBalance.eclipse + "%");
      arr.push("");
      arr.push("【主要城市】");
      for (const c in world.cities) {
        arr.push("· " + c + "：" + world.cities[c].eventName + "（经济" + world.cities[c].economy + "/民心" + world.cities[c].morale + "）");
      }
      arr.push("");
      arr.push("【世界事件强度】");
      arr.push("· 净化令：" + world.eventIntensity.purification);
      arr.push("· 商路危机：" + world.eventIntensity.tradeRoute);
      arr.push("· 深渊松动：" + world.eventIntensity.abyss);
      arr.push("· 学院暗流：" + world.eventIntensity.academy);
      arr.push("");
      arr.push("这就是你将要活的世界。它不完美，不公平，不按你的意志运转。");
      arr.push("但它是真实的。");
      return arr;
    },
    options: [
      { t:"确认，开始我的故事", go:"fc_jiaohui_entry", effect:{flag:"world_confirmed", time:1} },
      { t:"重新生成一个世界", go:"world_gen_intro", effect:{} }
    ]
  };
};

// ============================================================
// v25 世界动态节点
// ============================================================
N["world_news"] = function(){
  worldTick(1);
  return {
    place: "世界动态",
    text: function(){
      const arr = [];
      arr.push("【第" + (S.worldTimeline ? S.worldTimeline.day : 0) + "天·世界动态】");
      arr.push("");
      arr.push(getWorldNews());
      arr.push("");
      arr.push("世界不等你。它在你看不见的地方，自顾自地运转着。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["time_window_missed_demo"] = function(){
  return {
    place: "错过的时间窗口",
    text: function(){
      const arr = [];
      arr.push("你回到学院时，墨丘利的办公室已经空了。");
      arr.push("桌上的茶杯还温着，书页翻到一半，椅子上还留着他的体温。");
      arr.push("但他走了。");
      arr.push("你问其他教授，他们支支吾吾。你问学生，他们说「墨丘利教授前几天还在啊」。");
      arr.push("你知道——你错过了。你在大陆游历的时候，墨丘利在等你。等你回来，一起做一件事。但你没回来。");
      arr.push("现在他走了。去了哪里？不知道。还会不会回来？不知道。");
      arr.push("你站在空办公室里，看着那杯温茶。");
      arr.push("世界不等你。");
      return arr;
    },
    options: [
      { t:"追查墨丘利的下落", go:"fc_jiaohui_entry", effect:{flag:"mercury_missing", karma:"regret"} },
      { t:"算了，也许他有自己的理由", go:"fc_jiaohui_entry", effect:{flag:"let_mercury_go", san:-3} }
    ]
  };
};

console.log("[v25 as] 随机世界生成器+动态世界演变系统已加载");


// ============================================================
// v25 主线分支数据
// ============================================================
const MAIN_BRANCHES = {
  academy: {
    report: {
      id: "report_professor",
      name: "举报卧底教授",
      description: "发现暗蚀会卧底教授后，向学院举报",
      consequences: ["教授被抓", "学院暗流提前爆发", "教会介入", "被卷入净化令", "提前进入大陆线"],
      lockedRoutes: ["join_eclipse", "negotiate"]
    },
    join_eclipse: {
      id: "join_eclipse",
      name: "被教授拉拢",
      description: "不举报，接受教授的拉拢，成为双面间谍",
      consequences: ["暗蚀会线提前开启", "学院线变成在敌人内部搞破坏", "获得暗蚀会资源", "被守望者怀疑"],
      lockedRoutes: ["report_professor"]
    },
    negotiate: {
      id: "negotiate",
      name: "与教授谈判",
      description: "既不举报也不加入，与教授谈判，让他成为你的暗线",
      consequences: ["教授反水成为你的暗线", "学院暗流变成教授与你联手调查", "获得独特情报渠道", "风险最高"],
      lockedRoutes: []
    }
  },
  continent: {
    repair_seals: {
      id: "repair_seals",
      name: "修复七印",
      description: "走传统路线，修复七印维持现状",
      consequences: ["深渊进度延缓", "守望者支持", "原初之物继续沉睡", "世界稳定但压抑"]
    },
    destroy_seals: {
      id: "destroy_seals",
      name: "破坏七印",
      description: "打碎七印，解放原初之物",
      consequences: ["深渊进度加速", "暗蚀会支持", "原初之物觉醒", "世界混乱但完整"]
    },
    understand_seals: {
      id: "understand_seals",
      name: "理解七印",
      description: "不修复也不破坏，理解原初之物，寻找第三条路",
      consequences: ["解锁原初之物对话", "知识代价加深", "解锁共存路线", "最困难但最有价值"]
    }
  }
};

// ============================================================
// v25 多线并行数据
// ============================================================
const STORY_LINES = {
  seals: {id:"seals", name:"七印之链", description:"探索七印的真相，决定原初之物的命运"},
  eclipse: {id:"eclipse", name:"暗蚀会", description:"渗透或对抗暗蚀会，揭开其真面目"},
  academy: {id:"academy", name:"学院暗流", description:"学院表面平静下的秘密斗争"},
  origin: {id:"origin", name:"身世之谜", description:"你的出身和家族的秘密"},
  faction: {id:"faction", name:"势力博弈", description:"八大势力之间的合纵连横"},
  watcher: {id:"watcher", name:"守望者", description:"守望者的历史和传承"},
  faith: {id:"faith", name:"信仰棋盘", description:"十大神系之间的博弈"},
  race: {id:"race", name:"种族命运", description:"万族的黄昏与黎明"}
};

const LINE_INFLUENCES = [
  {from:"seals", to:"eclipse", condition:"understand_primordial", effect:"暗蚀会成员认为你是同志，态度改善"},
  {from:"eclipse", to:"seals", condition:"eclipse_rank>=core", effect:"可以用暗蚀会资源快速到达封印地"},
  {from:"academy", to:"origin", condition:"reported_professor", effect:"美第奇家族认为你不可控，态度恶化"},
  {from:"faction", to:"seals", condition:"joined_church", effect:"教会提供审判骑士支援，但灵魂法师路线被锁"},
  {from:"watcher", to:"eclipse", condition:"watcher_rank>=keeper", effect:"暗蚀会对你更加警惕，渗透难度增加"},
  {from:"faith", to:"race", condition:"high_faith_nature", effect:"精灵和兽人对你更加信任"}
];

// ============================================================
// v25 引擎函数
// ============================================================
function mainBranchInit() {
  if (!S.mainBranch) {
    S.mainBranch = {currentPath: [], choices: [], lockedRoutes: []};
  }
}

function chooseMainBranch(chapter, branchId) {
  mainBranchInit();
  const branch = MAIN_BRANCHES[chapter][branchId];
  if (!branch) return false;
  if (S.mainBranch.lockedRoutes.includes(branchId)) return false;
  S.mainBranch.choices.push({chapter: chapter, branch: branchId});
  S.mainBranch.currentPath.push(branchId);
  if (branch.lockedRoutes) {
    for (const r of branch.lockedRoutes) {
      if (!S.mainBranch.lockedRoutes.includes(r)) {
        S.mainBranch.lockedRoutes.push(r);
      }
    }
  }
  return true;
}

function getMainBranch(chapter) {
  mainBranchInit();
  const choice = S.mainBranch.choices.find(c => c.chapter === chapter);
  return choice ? MAIN_BRANCHES[chapter][choice.branch] : null;
}

function storyLinesInit() {
  if (!S.storyLines) {
    S.storyLines = {
      active: ["seals", "academy"],
      progress: {seals:0, eclipse:0, academy:0, origin:0, faction:0, watcher:0, faith:0, race:0},
      influences: []
    };
  }
}

function updateStoryLine(lineId, progress) {
  storyLinesInit();
  if (!S.storyLines.active.includes(lineId)) {
    S.storyLines.active.push(lineId);
  }
  S.storyLines.progress[lineId] = (S.storyLines.progress[lineId] || 0) + progress;
  checkLineInfluence(lineId);
}

function checkLineInfluence(lineId) {
  storyLinesInit();
  for (const inf of LINE_INFLUENCES) {
    if (inf.from === lineId) {
      const progress = S.storyLines.progress[lineId] || 0;
      if (progress >= 30 && !S.storyLines.influences.includes(inf.from + "_" + inf.to)) {
        S.storyLines.influences.push(inf.from + "_" + inf.to);
      }
    }
  }
}

function getLineInfluenceText(lineId) {
  storyLinesInit();
  const texts = [];
  for (const inf of LINE_INFLUENCES) {
    if (inf.from === lineId && S.storyLines.influences.includes(inf.from + "_" + inf.to)) {
      texts.push(inf.effect);
    }
  }
  return texts;
}

// ============================================================
// v25 学院分支节点
// ============================================================
N["branch_academy_choice"] = function(){
  mainBranchInit();
  return {
    place: "学院暗流·抉择",
    text: function(){
      const arr = [];
      arr.push("你站在墨丘利的办公室门外。");
      arr.push("你刚刚发现了一个秘密——炼金学系的费尔曼教授，是暗蚀会的卧底。");
      arr.push("你有证据。一封被你截获的密信，上面用深渊语写着「第三支部已渗透，等待指示」。");
      arr.push("费尔曼教授平时是个和蔼的老人，课讲得好，对学生也关心。你很难把他和「暗蚀会」联系起来。");
      arr.push("但证据就在你手里。");
      arr.push("你可以：");
      arr.push("· 举报——把证据交给院长，让学院处理费尔曼");
      arr.push("· 不举报——费尔曼可能会来找你，也许可以利用他");
      arr.push("· 谈判——直接找费尔曼，看看他到底为什么加入暗蚀会");
      arr.push("");
      arr.push("这个选择，将决定你整个学院线的走向。");
      return arr;
    },
    options: [
      { t:"举报费尔曼教授", go:"branch_academy_report", effect:{flag:"branch_report", karma:"justice"} },
      { t:"不举报，等他来找你", go:"branch_academy_join", effect:{flag:"branch_join", karma:"ambition"} },
      { t:"直接找费尔曼谈判", go:"branch_academy_negotiate", effect:{flag:"branch_negotiate", karma:"wisdom"} }
    ]
  };
};

N["branch_academy_report"] = function(){
  chooseMainBranch("academy", "report");
  return {
    place: "举报·风暴前夜",
    text: function(){
      const arr = [];
      arr.push("你把密信交给了院长。");
      arr.push("院长看完后，脸色变了。他没有说话，只是把信锁进了抽屉。");
      arr.push("「这件事，不要告诉任何人。」院长说。「包括墨丘利。」");
      arr.push("你想问为什么，但院长的眼神让你闭了嘴。");
      arr.push("三天后，费尔曼教授被「调往分校」。没有审判，没有公告，甚至没有告别。");
      arr.push("但你注意到——费尔曼走的那天晚上，教会的审判骑士悄悄进入了学院。");
      arr.push("你举报了一个卧底。但你不知道，你打开了一个潘多拉的盒子。");
      arr.push("学院暗流，提前爆发了。");
      return arr;
    },
    options: [
      { t:"调查审判骑士来做什么", go:"fc_jiaohui_entry", effect:{flag:"investigate_knights", updateStoryLine:"academy:10"} },
      { t:"装作什么都没发生", go:"fc_jiaohui_entry", effect:{flag:"ignore_knights", san:-2} }
    ]
  };
};

N["branch_academy_join"] = function(){
  chooseMainBranch("academy", "join_eclipse");
  return {
    place: "拉拢·暗室密谈",
    text: function(){
      const arr = [];
      arr.push("你没有举报。");
      arr.push("两天后，费尔曼教授找到了你。");
      arr.push("他没有否认。「你看到了那封信。」他说。不是问句。");
      arr.push("你说是的。");
      arr.push("他沉默了很久。然后说：「你知道七印的真相吗？」");
      arr.push("你摇头。");
      arr.push("「黄林晶不是英雄。」费尔曼说。「七印不是封印深渊，是囚禁比深渊更古老的存在。暗蚀会的目标，是解放它们。」");
      arr.push("他看着你。「你很有天赋。我可以让你看到真相。但你要为我做一些事。」");
      arr.push("你知道，从这一刻起，你不再是一个普通学生了。");
      arr.push("你成了双面间谍。表面上是学院的好学生，暗地里是暗蚀会的外围成员。");
      arr.push("别过暗室密谈，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"接受费尔曼的条件", go:"fc_jiaohui_entry", effect:{flag:"eclipse_asset", updateStoryLine:"eclipse:15"} },
      { t:"假装接受，暗中向守望者报信", go:"fc_jiaohui_entry", effect:{flag:"double_agent", updateStoryLine:"watcher:10"} }
    ]
  };
};

N["branch_academy_negotiate"] = function(){
  chooseMainBranch("academy", "negotiate");
  return {
    place: "谈判·真相的代价",
    text: function(){
      const arr = [];
      arr.push("你直接找到了费尔曼。");
      arr.push("在他的办公室里，你把那封密信放在了桌上。");
      arr.push("他看着信，又看着你。「你想要什么？」");
      arr.push("「真相。」你说。「你为什么加入暗蚀会？七印的真相是什么？」");
      arr.push("他笑了。那种疲惫的、看透一切的笑。「你知道真相的代价吗？」");
      arr.push("你说你愿意付。");
      arr.push("于是他告诉你——关于七印，关于原初之物，关于黄林晶的罪。");
      arr.push("你听完后，沉默了很久。");
      arr.push("「现在你知道了。」费尔曼说。「你可以举报我，可以加入我，也可以——和我合作。我在暗蚀会内部，但我不完全同意他们的做法。我需要一个在外面的人。」");
      arr.push("你成了他的暗线。他给你情报，你给他外面的消息。");
      arr.push("这是最危险的路——两边都不信任你，但两边都需要你。");
      arr.push("你收拾停当，离开真相的代价，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"与费尔曼达成秘密合作", go:"fc_jiaohui_entry", effect:{flag:"secret_ally", updateStoryLine:"academy:15", updateStoryLine2:"eclipse:5"} },
      { t:"知道真相后，还是决定举报", go:"branch_academy_report", effect:{flag:"truth_then_report"} }
    ]
  };
};

// ============================================================
// v25 大陆分支节点
// ============================================================
N["branch_continent_choice"] = function(){
  return {tag:"branch",
    place: "大陆·道路的分岔",
    text: function(){
      const arr = [];
      arr.push("你站在第一印的废墟前。");
      arr.push("铁门关的风卷着沙，打在脸上生疼。破碎的符文在风中发出微弱的嗡鸣，像某种古老的叹息。");
      arr.push("你已经知道了七印的真相——它们不是封印深渊，是囚禁原初之物。");
      arr.push("现在，你要决定：接下来的路，怎么走？");
      arr.push("");
      arr.push("· 修复七印——像黄林晶那样，维持现状。世界稳定，但原初之物继续沉睡。");
      arr.push("· 破坏七印——打碎枷锁，解放原初之物。世界会混乱，但情感会回归。");
      arr.push("· 理解七印——不修复也不破坏，去理解原初之物，寻找第三条路。");
      arr.push("");
      arr.push("这个选择，将决定整个大陆线的走向，以及最终的结局。");
      return arr;
    },
    options: [
      { t:"修复七印，维持现状", go:"branch_continent_repair", effect:{flag:"branch_repair", abyssDelta:-5} },
      { t:"破坏七印，解放原初之物", go:"branch_continent_destroy", effect:{flag:"branch_destroy", abyssDelta:10} },
      { t:"理解七印，寻找第三条路", go:"branch_continent_understand", effect:{flag:"branch_understand", knowledge:1} }
    ]
  };
};

N["branch_continent_repair"] = function(){
  chooseMainBranch("continent", "repair_seals");
  updateStoryLine("seals", 15);
  return {
    place: "修复·黄林晶的路",
    text: function(){
      const arr = [];
      arr.push("你选择了修复。");
      arr.push("像黄林晶三千年前做的那样。你用符文重新加固第一印，让饥饿继续沉睡。");
      arr.push("修复的过程中，你感受到了——饥饿的绝望。三千年没被喂饱的孩子，在你触碰符文的那一刻，发出了无声的哭喊。");
      arr.push("你忍住了。你告诉自己，这是为了世界。");
      arr.push("第一印重新稳定。深渊进度下降了。守望者对你表示赞赏。");
      arr.push("但你知道，这只是延缓。三千年后，会有另一个人站在这里，面对同样的选择。");
      arr.push("你走了黄林晶的路。你开始理解他的孤独。");
      return arr;
    },
    options: [
      { t:"继续前往第二印", go:"fc_jiaohui_entry", effect:{flag:"seal_1_repaired", time:7} }
    ]
  };
};

N["branch_continent_destroy"] = function(){
  chooseMainBranch("continent", "destroy_seals");
  updateStoryLine("seals", 15);
  return {
    place: "破坏·解放的宣言",
    text: function(){
      const arr = [];
      arr.push("你选择了破坏。");
      arr.push("你打碎了第一印剩余的符文。饥饿——那个三千年没被喂饱的孩子——觉醒了。");
      arr.push("它没有攻击你。它只是……哭了。像一个终于被放出笼子的孩子，站在阳光下，不知道该怎么办。");
      arr.push("然后它消失了。去了哪里？不知道。但你能感受到——空气中的情感浓度变了。人们笑得更真了，哭得更痛了。");
      arr.push("深渊进度大幅上升。暗蚀会对你表示欢迎。教会宣布你为异端。");
      arr.push("你打碎了黄林晶的枷锁。你不知道这是对是错。");
      arr.push("但你知道，世界再也回不到从前了。");
      arr.push("离开解放的宣言时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续前往第二印", go:"fc_jiaohui_entry", effect:{flag:"seal_1_destroyed", time:3} }
    ]
  };
};

N["branch_continent_understand"] = function(){
  chooseMainBranch("continent", "understand_seals");
  updateStoryLine("seals", 15);
  return {
    place: "理解·第三条路的起点",
    text: function(){
      const arr = [];
      arr.push("你选择了理解。");
      arr.push("你没有修复，也没有破坏。你坐在第一印的废墟中央，闭上眼睛，试图去感受——饥饿。");
      arr.push("一开始什么都没有。然后，你听到了。");
      arr.push("一个孩子的声音。三千年没被喂饱的孩子。它不是饿——它是……渴望被看见。");
      arr.push("你在心里说：我看见你了。");
      arr.push("沉默。然后，那个孩子的哭声，变小了。");
      arr.push("你睁开眼。第一印的符文还在，但它们不再是「囚禁」，而是……「连接」。你和饥饿之间，建立了某种联系。");
      arr.push("你获得了「饥饿碎片」——它的一段记忆，一种情感，一丝力量。");
      arr.push("这是第三条路的起点。不是封印，不是解放。是——共存。");
      arr.push("但你知道，理解一个原初之物，需要付出代价。你的SAN值下降了。你看世界的方式，永远改变了。");
      arr.push("你最后回望一眼第三条路的起点，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"带着饥饿碎片，继续前往第二印", go:"fc_jiaohui_entry", effect:{flag:"seal_1_understood", item:"饥饿碎片", san:-5, knowledge:1} }
    ]
  };
};

// ============================================================
// v25 多线并行节点
// ============================================================
N["story_lines_overview"] = function(){
  storyLinesInit();
  return {
    place: "故事线总览",
    text: function(){
      const arr = [];
      arr.push("【你正在推进的故事线】");
      arr.push("");
      for (const lineId of S.storyLines.active) {
        const line = STORY_LINES[lineId];
        const progress = S.storyLines.progress[lineId] || 0;
        arr.push("· " + line.name + "（进度" + progress + "%）：" + line.description);
        const influences = getLineInfluenceText(lineId);
        for (const inf of influences) {
          arr.push("  → 影响：" + inf);
        }
      }
      arr.push("");
      arr.push("没有「主线」和「支线」的区别。你做的每件事，都在影响其他事。");
      arr.push("先做七印再做暗蚀会，和先做暗蚀会再做七印——是完全不同的故事。");
      return arr;
    },
    options: [
      { t:"继续冒险", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

console.log("[v25 at] 主线分支树化+多线并行叙事系统已加载");


// ============================================================
// v25 NPC动态命运数据
// ============================================================
const NPC_FATES = {
  classmate_01: {
    name: "塞西莉亚",
    possibleFates: [
      {id:"hero", name:"学院首席·大魔法师", conditions:["high_grades","player_help"], probability:0.25, description:"以第一名毕业，成为大陆闻名的大魔法师，终局与你并肩"},
      {id:"villain", name:"暗蚀会干部", conditions:["eclipse_recruit","player_ignore"], probability:0.2, description:"被暗蚀会拉拢，成为反派干部，终局与你为敌"},
      {id:"dead", name:"战争烈士", conditions:["war_early","player_not_there"], probability:0.15, description:"在战争中牺牲，她的死影响其他同学士气"},
      {id:"avenger", name:"复仇者", conditions:["family_tragedy","player_trigger"], probability:0.2, description:"发现家族被灭真相，走上复仇路，终局成为复仇者"},
      {id:"lover", name:"伴侣", conditions:["high_relation","romance_event"], probability:0.2, description:"与你相恋，终局成为伴侣，或因你而死"}
    ]
  },
  classmate_02: {
    name: "马库斯",
    possibleFates: [
      {id:"general", name:"将军", conditions:["war_path","player_ally"], probability:0.3, description:"毕业后参军，凭战功升为将军，终局统帅一方"},
      {id:"mercenary", name:"佣兵头子", conditions:["expelled","greed"], probability:0.2, description:"被学院开除后成为佣兵，亦正亦邪"},
      {id:"dead", name:"战死沙场", conditions:["war_early","low_grades"], probability:0.2, description:"在第一次战役中阵亡，连名字都没留下"},
      {id:"traitor", name:"叛徒", conditions:["eclipse_bribe","player_betray"], probability:0.15, description:"被暗蚀会收买，在关键时刻背叛"},
      {id:"trainer", name:"武道宗师", conditions:["peace_path","dedication"], probability:0.15, description:"专注武道，开宗立派，成为一代宗师"}
    ]
  }
};

// ============================================================
// v25 涟漪效应数据
// ============================================================
const RIPPLE_SEEDS = [
  {
    id: "steal_bread",
    origin: "序章·偷面包",
    description: "你在序章偷了一个面包师的面包",
    effects: [
      {stage:"academy", node:"ripple_sprout_bread", text:"面包师的孩子成了你的同学，他认出了你，恨你"},
      {stage:"continent", node:"ripple_grow_bread", text:"他成了审判官，在大陆线对你处处刁难"},
      {stage:"abyss", node:"ripple_harvest_bread", text:"终局时他审判你，列出你当年的罪"}
    ]
  },
  {
    id: "save_vendor",
    origin: "序章·救小贩",
    description: "你在序章救了一个被欺负的小贩",
    effects: [
      {stage:"academy", node:"ripple_sprout_vendor", text:"小贩来学院给你送食物，感激不尽"},
      {stage:"continent", node:"ripple_grow_vendor", text:"他成了商会会长，在大陆线给你提供资金和情报"},
      {stage:"abyss", node:"ripple_harvest_vendor", text:"终局时他资助你的军队，说「当年你救了我，现在我救世界」"}
    ]
  },
  {
    id: "cheat_exam",
    origin: "学院·考试作弊被抓",
    description: "你在学院考试中作弊被教授抓到",
    effects: [
      {stage:"academy", node:"ripple_sprout_cheat", text:"教授对你印象极差，不给你写推荐信"},
      {stage:"continent", node:"ripple_grow_cheat", text:"大势力因为你的「污点」不招揽你，你只能走地下路线"},
      {stage:"abyss", node:"ripple_harvest_cheat", text:"终局时你的「不光彩过去」被敌人翻出来，动摇盟友信心"}
    ]
  },
  {
    id: "spare_bandit",
    origin: "旅行·放过强盗",
    description: "你在旅行中抓住了一个强盗，但放了他",
    effects: [
      {stage:"academy", node:"ripple_sprout_bandit", text:"他改邪归正，在学院附近做小生意"},
      {stage:"continent", node:"ripple_grow_bandit", text:"他成了暗蚀会外围成员，在大陆线认出你，可能帮你也可能杀你"},
      {stage:"abyss", node:"ripple_harvest_bandit", text:"终局时他带领一支地下武装支援你，说「你当年放了我，现在我还你」"}
    ]
  },
  {
    id: "help_classmate",
    origin: "学院·帮助同学",
    description: "你在学院帮助了一个被欺负的同学",
    effects: [
      {stage:"academy", node:"ripple_sprout_classmate", text:"那个同学对你忠心耿耿，成为你的死党"},
      {stage:"continent", node:"ripple_grow_classmate", text:"他毕业后加入了一个势力，在大陆线给你提供庇护"},
      {stage:"abyss", node:"ripple_harvest_classmate", text:"终局时他为了掩护你而死，临终说「不后悔」"}
    ]
  }
];

// ============================================================
// v25 引擎函数
// ============================================================
function npcFateInit() {
  if (!S.npcFates) {
    S.npcFates = {locked: [], inProgress: [], progress: {}};
  }
}

function updateNpcFate(npcId, factor) {
  npcFateInit();
  if (!S.npcFates.progress[npcId]) {
    S.npcFates.progress[npcId] = {};
  }
  const npc = NPC_FATES[npcId];
  if (!npc) return;
  for (const fate of npc.possibleFates) {
    if (!S.npcFates.progress[npcId][fate.id]) {
      S.npcFates.progress[npcId][fate.id] = fate.probability * 100;
    }
    if (fate.conditions.includes(factor)) {
      S.npcFates.progress[npcId][fate.id] += 20;
    }
  }
}

function lockNpcFate(npcId, fateId) {
  npcFateInit();
  if (!S.npcFates.locked.includes(npcId + "_" + fateId)) {
    S.npcFates.locked.push(npcId + "_" + fateId);
  }
}

function getNpcFate(npcId) {
  npcFateInit();
  const locked = S.npcFates.locked.find(l => l.startsWith(npcId + "_"));
  if (locked) {
    const fateId = locked.split("_")[1];
    const npc = NPC_FATES[npcId];
    return npc ? npc.possibleFates.find(f => f.id === fateId) : null;
  }
  return null;
}

function plantRipple(seedId, context) {
  if (!S.ripples) {
    S.ripples = {seedsPlanted: [], seedsHarvested: [], activeChains: []};
  }
  if (!S.ripples.seedsPlanted.includes(seedId)) {
    S.ripples.seedsPlanted.push(seedId);
  }
}

function checkRipples(stage) {
  if (!S.ripples) return [];
  const sprouted = [];
  for (const seedId of S.ripples.seedsPlanted) {
    if (S.ripples.seedsHarvested.includes(seedId)) continue;
    const seed = RIPPLE_SEEDS.find(s => s.id === seedId);
    if (!seed) continue;
    for (const effect of seed.effects) {
      if (effect.stage === stage && !S.ripples.activeChains.includes(seedId + "_" + stage)) {
        S.ripples.activeChains.push(seedId + "_" + stage);
        sprouted.push(effect);
      }
    }
  }
  return sprouted;
}

function harvestRipple(seedId) {
  if (!S.ripples) return;
  if (!S.ripples.seedsHarvested.includes(seedId)) {
    S.ripples.seedsHarvested.push(seedId);
  }
}

function getRippleStatus() {
  if (!S.ripples) return "无因果记录";
  return "已种下" + S.ripples.seedsPlanted.length + "颗种子，已收获" + S.ripples.seedsHarvested.length + "颗";
}

// ============================================================
// v25 NPC命运节点
// ============================================================
N["fate_classmate_01_trigger"] = function(){
  npcFateInit();
  updateNpcFate("classmate_01", "player_help");
  return {
    place: "塞西莉亚的命运·岔路口",
    text: function(){
      const arr = [];
      arr.push("塞西莉亚站在学院的钟楼下，手里拿着一封信。");
      arr.push("她看到你，犹豫了一下，然后走过来。");
      arr.push("「我收到了暗蚀会的信。」她说。「他们说……如果我加入他们，他们可以治好我母亲的病。」");
      arr.push("她的手在抖。你知道她母亲已经病了三年了，教会的牧师束手无策。");
      arr.push("「我不知道该怎么办。」她说。「你觉得呢？」");
      arr.push("");
      arr.push("这个选择，将决定塞西莉亚的命运。");
      return arr;
    },
    options: [
      { t:"劝她拒绝暗蚀会，你帮她想办法", go:"fate_classmate_01_hero", effect:{flag:"cecilia_hero_path", relation:"cecilia:+15"} },
      { t:"劝她加入暗蚀会，也许这是唯一的办法", go:"fate_classmate_01_villain", effect:{flag:"cecilia_villain_path", relation:"cecilia:+5"} },
      { t:"不介入，让她自己决定", go:"fate_classmate_01_uncertain", effect:{flag:"cecilia_uncertain", relation:"cecilia:-5"} }
    ]
  };
};

N["fate_classmate_01_hero"] = function(){
  lockNpcFate("classmate_01", "hero");
  return {
    place: "塞西莉亚的命运·英雄之路",
    text: function(){
      const arr = [];
      arr.push("你握住她的手。「不要加入暗蚀会。」你说。「你母亲的病，我们一起想办法。」");
      arr.push("她看着你，眼泪掉了下来。「真的吗？」");
      arr.push("你说是的。");
      arr.push("接下来的三个月，你陪她走遍了学院的图书馆，找遍了城里的医生。最后，你在禁书区找到了一个古老的治愈仪式。");
      arr.push("她母亲的病，好了。");
      arr.push("从那天起，塞西莉亚变了。她不再是那个忧郁的女孩，她开始拼命学习，发誓要用魔法帮助更多的人。");
      arr.push("毕业时，她以第一名的成绩离开学院。");
      arr.push("多年后，她成了大陆闻名的大魔法师。但她总是说：「如果没有那个人，我早就坠入黑暗了。」");
      arr.push("她的命运，因为你而改变了。");
      arr.push("离开英雄之路时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{flag:"cecilia_hero_locked", karma:"good"} }
    ]
  };
};

N["fate_classmate_01_villain"] = function(){
  lockNpcFate("classmate_01", "villain");
  return {
    place: "塞西莉亚的命运·黑暗之路",
    text: function(){
      const arr = [];
      arr.push("你沉默了很久。「也许……这是唯一的办法。」你说。");
      arr.push("她看着你，眼神里有什么东西碎了。「你也这么觉得吗？」");
      arr.push("你说是的。");
      arr.push("她加入了暗蚀会。她母亲的病好了——用的是深渊魔法。代价是，她的灵魂上多了一道印记。");
      arr.push("她开始变得冷漠。她不再和你一起吃饭，不再和你一起去图书馆。她总是在深夜离开宿舍，不知道去哪里。");
      arr.push("毕业时，她消失了。");
      arr.push("多年后，你在大陆线遇到了她——作为暗蚀会的干部，站在你的对立面。");
      arr.push("她看到你，笑了。「是你劝我加入的。」她说。「你还记得吗？」");
      arr.push("你记得。");
      arr.push("她的命运，因为你而改变了。但不是你想要的方向。");
      arr.push("从黑暗之路出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{flag:"cecilia_villain_locked", karma:"regret", san:-3} }
    ]
  };
};

N["fate_classmate_01_uncertain"] = function(){
  return {
    place: "塞西莉亚的命运·未定",
    text: function(){
      const arr = [];
      arr.push("你说：「这是你的人生，你自己决定吧。」");
      arr.push("她看着你，眼神冷了下来。「我以为你会帮我。」");
      arr.push("你说你尊重她的选择。");
      arr.push("她走了。");
      arr.push("后来，你听说她加入了暗蚀会。又听说她退出了。又听说她母亲死了，她疯了。又听说她成了佣兵。");
      arr.push("你不知道哪个是真的。");
      arr.push("你只知道——你没有帮她。而她，永远不会原谅你。");
      arr.push("命运的岔路口，你选择了旁观。而旁观，有时候也是一种选择。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{flag:"cecilia_uncertain_locked", relation:"cecilia:-20"} }
    ]
  };
};

// ============================================================
// v25 涟漪效应节点
// ============================================================
N["ripple_seed_save_vendor"] = function(){
  plantRipple("save_vendor", "序章");
  return {
    place: "序章·因果种子",
    text: function(){
      const arr = [];
      arr.push("你看到几个地痞在欺负一个小贩。");
      arr.push("小贩抱着头蹲在地上，摊位被掀翻了，水果蔬菜滚了一地。");
      arr.push("地痞们笑着踢他。「保护费呢？上个月的保护费呢？」");
      arr.push("你可以选择帮忙，也可以选择走开。");
      arr.push("");
      arr.push("（这个选择的后果，可能在很久以后才会显现。）");
      arr.push("你离了因果种子，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"出手帮助小贩", go:"ripple_seed_save_vendor_done", effect:{flag:"saved_vendor", karma:"good", gold:-5} },
      { t:"装作没看见，走开", go:"fc_jiaohui_entry", effect:{flag:"ignored_vendor", karma:"neutral"} }
    ]
  };
};

N["ripple_seed_save_vendor_done"] = function(){
  return {
    place: "序章·因果已种",
    text: function(){
      const arr = [];
      arr.push("你赶走了地痞。");
      arr.push("小贩抬起头，满脸是血，但眼睛里有光。「谢谢你，年轻人。」");
      arr.push("他从怀里掏出一个铜板，要塞给你。你拒绝了。");
      arr.push("「我叫老周。」他说。「以后如果你到了交汇城，来集市找我。我欠你一条命。」");
      arr.push("你没当回事。你只是做了一件小事。");
      arr.push("但你不知道——这颗因果种子，已经种下了。");
      arr.push("它会在学院发芽，在大陆成长，在终局结果。");
      arr.push("因果已种已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["ripple_sprout_vendor"] = function(){
  const sprouts = checkRipples("academy");
  return {
    place: "学院·因果发芽",
    text: function(){
      const arr = [];
      arr.push("学院门口，一个小贩推着车在卖东西。");
      arr.push("他看到你，眼睛一亮。「年轻人！是你！」");
      arr.push("是老周。他居然找到了学院来。");
      arr.push("「我听说你在这上学，就特意来看看你。」他从车里拿出一个布包。「这是我自己做的点心，你拿着。」");
      arr.push("你接过来。还是热的。");
      arr.push("「当年你救了我，我一直记着。」老周说。「以后有什么需要，尽管来找我。我在交汇城集市摆摊。」");
      arr.push("你看着他推着车离开的背影，突然意识到——你在序章做的那件小事，还没有结束。");
      arr.push("因果的种子，发芽了。");
      arr.push("出了因果发芽，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"收下点心，感谢老周", go:"fc_jiaohui_entry", effect:{item:"老周的点心", relation:"lao_zhou:+10"} }
    ]
  };
};

N["ripple_grow_vendor"] = function(){
  return {
    place: "大陆·因果成长",
    text: function(){
      const arr = [];
      arr.push("你在交汇城的集市上，看到了一个熟悉的面孔。");
      arr.push("老周。但他不再是那个推着小车的小贩了。他现在是「周记商行」的老板，有三个店铺，十几个伙计。");
      arr.push("他看到你，大笑着走过来。「年轻人！我就知道你会来！」");
      arr.push("他拉着你进了他的店铺，给你看他的账本。「当年你救了我之后，我就发誓要出人头地。现在，我做到了。」");
      arr.push("他从抽屉里拿出一袋金币。「这是给你的。不是报恩——是投资。我知道你在做大事，你需要钱。」");
      arr.push("你看着那袋金币，又看着老周。");
      arr.push("一颗序章的种子，长成了一棵大树。");
      return arr;
    },
    options: [
      { t:"接受老周的资助", go:"fc_jiaohui_entry", effect:{gold:500, flag:"zhou_funded", relation:"lao_zhou:+20"} },
      { t:"拒绝，让他留着自己用", go:"fc_jiaohui_entry", effect:{relation:"lao_zhou:+30", karma:"good"} }
    ]
  };
};

N["ripple_harvest_vendor"] = function(){
  harvestRipple("save_vendor");
  return {
    place: "终局·因果结果",
    text: function(){
      const arr = [];
      arr.push("最终之战前，你的军队缺粮缺钱。");
      arr.push("就在你一筹莫展的时候，一支商队来到了营地。");
      arr.push("领头的是老周。他带来了五十车粮食，三十箱药品，和一百名愿意参战的伙计。");
      arr.push("「当年你救了我。」老周说。「现在，我救世界。」");
      arr.push("你看着这个曾经被地痞欺负的小贩，现在站在你面前，腰杆挺直，眼神坚定。");
      arr.push("一颗种子，从序章到终局，终于结果了。");
      arr.push("你做的每一件小事，都不是小事。");
      return arr;
    },
    options: [
      { t:"感谢老周，迎接最终之战", go:"fc_jiaohui_entry", effect:{flag:"vendor_army", karma:"fulfilled"} }
    ]
  };
};

// ============================================================
// v25 因果网面板
// ============================================================
N["ripple_web_view"] = function(){
  return {
    place: "因果之网",
    text: function(){
      const arr = [];
      arr.push("【因果之网】");
      arr.push("");
      arr.push(getRippleStatus());
      arr.push("");
      if (S.ripples && S.ripples.seedsPlanted.length > 0) {
        arr.push("已种下的因果种子：");
        for (const seedId of S.ripples.seedsPlanted) {
          const seed = RIPPLE_SEEDS.find(s => s.id === seedId);
          if (seed) {
            const harvested = S.ripples.seedsHarvested.includes(seedId);
            arr.push("· " + seed.origin + " — " + (harvested ? "已结果" : "在生长中"));
          }
        }
      }
      arr.push("");
      arr.push("你做的每一个选择，都在这张网上。它们会发芽，会成长，会在你意想不到的时候结果。");
      arr.push("有些果是甜的，有些是苦的。但都是你自己种的。");
      arr.push("因果之网已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

console.log("[v25 au] NPC动态命运+涟漪效应系统已加载");


// ============================================================
// v25 学院事件池
// ============================================================
const ACADEMY_EVENTS_V25 = [
  {id:"lab_explosion", name:"实验室爆炸", triggerCondition:"year>=2", causalChain:["found_drug","professor_implicated","professor_missing"]},
  {id:"professor_missing", name:"教授失踪", triggerCondition:"year>=2", causalChain:[]},
  {id:"student_suicide", name:"学生自杀", triggerCondition:"year>=1", causalChain:["investigate_suicide","eclipse_recruit"]},
  {id:"forbidden_theft", name:"禁书区失窃", triggerCondition:"year>=2", causalChain:["investigate_theft","watcher_letter"]},
  {id:"new_transfer", name:"神秘转学生", triggerCondition:"year>=1", causalChain:["transfer_secret","transfer_reveal"]},
  {id:"academy_plague", name:"学院传染病", triggerCondition:"year>=2", causalChain:["find_cure","quarantine"]},
  {id:"church_search", name:"教会搜查", triggerCondition:"purification>=moderate", causalChain:["hide_evidence","protest"]},
  {id:"war_conscription", name:"战争征兵", triggerCondition:"war>=outbreak", causalChain:["volunteer","avoid"]},
  {id:"election_fraud", name:"学生会选举舞弊", triggerCondition:"year>=2", causalChain:["investigate_election","expose"]},
  {id:"duel_injury", name:"决斗重伤", triggerCondition:"year>=1", causalChain:["duel_aftermath","grudge"]}
];

// ============================================================
// v25 大陆事件池
// ============================================================
const CONTINENT_EVENTS = [
  {id:"caravan_raid", name:"商队被劫", triggerCondition:"tradeRoute>=moderate", causalChain:["pursue_bandits","find_eclipse_link"]},
  {id:"refugee_crisis", name:"难民潮", triggerCondition:"war>=outbreak", causalChain:["help_refugees","turn_away"]},
  {id:"local_rebellion", name:"地方叛乱", triggerCondition:"faction=declining", causalChain:["join_rebellion","suppress"]},
  {id:"miracle_appear", name:"神迹显现", triggerCondition:"faith>=moderate", causalChain:["investigate_miracle","false_miracle"]},
  {id:"plague_outbreak", name:"瘟疫爆发", triggerCondition:"random", causalChain:["find_cure","quarantine_city"]},
  {id:"mine_disaster", name:"矿难", triggerCondition:"location=dwarf", causalChain:["rescue","investigate_cause"]},
  {id:"orc_raid", name:"兽人突袭", triggerCondition:"location=border", causalChain:["defend","negotiate"]},
  {id:"elf_migration", name:"精灵迁徙", triggerCondition:"seal_3>=unstable", causalChain:["help_migration","investigate_reason"]},
  {id:"eclipse_terror", name:"暗蚀会恐怖袭击", triggerCondition:"eclipse>=active", causalChain:["pursue","investigate_mastermind"]},
  {id:"holy_crusade", name:"教会十字军", triggerCondition:"purification>=high", causalChain:["join_crusade","oppose"]}
];

// ============================================================
// v25 随机遭遇池
// ============================================================
const ENCOUNTER_POOL = [
  {id:"save_caravan", name:"救商队", type:"travel", worldEffect:{trade_security:5, faction_rep:5}, description:"一伙强盗正在抢劫商队"},
  {id:"kill_bandits", name:"杀强盗", type:"travel", worldEffect:{security:10, bandit_grudge:true}, description:"强盗挡住了去路"},
  {id:"spare_bandit", name:"放强盗", type:"travel", worldEffect:{bandit_alliance:true, security:-5}, description:"你抓住了强盗头目，但他求你放了他"},
  {id:"help_refugee", name:"帮难民", type:"travel", worldEffect:{faction_rep:10, hidden_character:true}, description:"一群难民在路边乞讨"},
  {id:"tavern_rumor", name:"酒馆传闻", type:"city", worldEffect:{knowledge:1}, description:"酒馆里有人在谈论一件大事"},
  {id:"street_performer", name:"街头艺人", type:"city", worldEffect:{morale:5}, description:"一个游吟诗人在唱一首关于黄林晶的歌"},
  {id:"merchant_deal", name:"商人交易", type:"city", worldEffect:{gold:-50, item:"random"}, description:"一个神秘商人在卖奇怪的东西"},
  {id:"night_attack", name:"夜间袭击", type:"wilderness", worldEffect:{hp:-20, san:-3}, description:"深夜，营地被袭击了"},
  {id:"lost_traveler", name:"迷路旅人", type:"wilderness", worldEffect:{karma:1, hidden_quest:true}, description:"一个迷路的旅人请求你的帮助"},
  {id:"ancient_ruins", name:"古代遗迹", type:"wilderness", worldEffect:{knowledge:2, item:"random_relic"}, description:"你发现了一处古代遗迹"}
];

// ============================================================
// v25 引擎函数
// ============================================================
function initEventPool(chapter, seed) {
  if (!S.activeEvents) S.activeEvents = {academy:[], continent:[], prologue:[], abyss:[]};
  if (S.activeEvents[chapter].length > 0) return S.activeEvents[chapter];
  const pool = chapter === "academy" ? ACADEMY_EVENTS_V25 : CONTINENT_EVENTS;
  const rand = seededRandom(seed || Math.floor(Math.random()*99999));
  const count = 3 + Math.floor(rand() * 3); // 3-5个事件
  const shuffled = [...pool].sort(() => rand() - 0.5);
  S.activeEvents[chapter] = shuffled.slice(0, count).map(e => e.id);
  return S.activeEvents[chapter];
}

function triggerEventCheck(chapter) {
  if (!S.activeEvents) initEventPool(chapter);
  return S.activeEvents[chapter] || [];
}

function getActiveEvents(chapter) {
  return S.activeEvents ? (S.activeEvents[chapter] || []) : [];
}

function rollEncounter(type, location, time) {
  const pool = ENCOUNTER_POOL.filter(e => e.type === type);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function applyEncounterEffect(encounterId, choice) {
  const enc = ENCOUNTER_POOL.find(e => e.id === encounterId);
  if (!enc || !enc.worldEffect) return;
  if (!S.worldState) S.worldState = {};
  for (const key in enc.worldEffect) {
    S.worldState[key] = (S.worldState[key] || 0) + enc.worldEffect[key];
  }
  if (!S.encounterHistory) S.encounterHistory = [];
  S.encounterHistory.push({id:encounterId, choice:choice, day:S.worldTimeline ? S.worldTimeline.day : 0});
}

function getEncounterHistory() {
  return S.encounterHistory || [];
}

// ============================================================
// v25 学院随机事件节点
// ============================================================
N["event_academy_lab_explosion"] = function(){
  return {tag:"event",
    place: "学院·实验室爆炸",
    text: function(){
      const arr = [];
      arr.push("一声巨响。");
      arr.push("炼金实验室的窗户被炸飞了，浓烟滚滚而出。学生们尖叫着跑出来，脸上都是黑灰。");
      arr.push("你跑过去，看到费尔曼教授站在废墟前，脸色铁青。「又是违禁药剂。」他说。「我跟他们说过多少次了……」");
      arr.push("但你注意到——费尔曼的眼神里，有一丝不易察觉的……满意？");
      arr.push("实验室爆炸了。但这是意外，还是……有人故意的？");
      arr.push("");
      arr.push("（这是本次游戏激活的学院事件之一。不同的世界种子，会激活不同的事件组合。）");
      return arr;
    },
    options: [
      { t:"调查爆炸原因", go:"event_academy_lab_explosion_investigate", effect:{flag:"investigate_explosion", knowledge:1} },
      { t:"帮忙救助伤员", go:"event_academy_lab_explosion_help", effect:{flag:"help_injured", relation:"students:+10", hp:-5} },
      { t:"事不关己，走开", go:"fc_jiaohui_entry", effect:{flag:"ignore_explosion", relation:"students:-5"} }
    ]
  };
};

N["event_academy_lab_explosion_investigate"] = function(){
  return {tag:"event",
    place: "学院·爆炸真相",
    text: function(){
      const arr = [];
      arr.push("你在废墟里翻找。");
      arr.push("爆炸的中心是一个炼金台。台上的残留物显示——这不是普通的炼金失败。这是「深渊催化剂」，一种被教会明令禁止的物质。");
      arr.push("谁在实验室里炼深渊催化剂？");
      arr.push("你继续翻找，在废墟下面发现了一个笔记本。扉页上写着一个名字——不是学生的名字，是……教授的名字。");
      arr.push("你把笔记本藏好。");
      arr.push("实验室爆炸不是意外。是有人在做禁忌实验，然后……炸了。");
      arr.push("这个发现，可能会改变整个学院的权力格局。");
      arr.push("你与爆炸真相作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"把笔记本交给院长", go:"fc_jiaohui_entry", effect:{flag:"notebook_to_dean", karma:"justice", relation:"professors:-10"} },
      { t:"自己留着，慢慢调查", go:"fc_jiaohui_entry", effect:{flag:"keep_notebook", knowledge:1, san:-2} },
      { t:"把笔记本烧掉，当作什么都没发生", go:"fc_jiaohui_entry", effect:{flag:"burn_notebook", san:-1} }
    ]
  };
};

N["event_academy_lab_explosion_help"] = function(){
  return {tag:"event",
    place: "学院·救助伤员",
    text: function(){
      const arr = [];
      arr.push("你冲进浓烟里，拖出了两个受伤的学生。");
      arr.push("一个是一年级的新生，手臂被炸伤了，一直在哭。另一个是你的同学，昏迷不醒。");
      arr.push("校医赶来的时候，你已经帮他们止了血。");
      arr.push("「谢谢你。」校医说。「如果再晚一会儿，这孩子就没了。」");
      arr.push("你看着被抬走的伤员，心里不是滋味。");
      arr.push("你救了两个人。但你不知道——这个简单的善举，会在很久以后，以你意想不到的方式回报你。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{flag:"saved_students", karma:"good", relation:"students:+15"} }
    ]
  };
};

// ============================================================
// v25 大陆随机事件节点
// ============================================================
N["event_continent_refugee_crisis"] = function(){
  return {tag:"event",
    place: "大陆·难民潮",
    text: function(){
      const arr = [];
      arr.push("你到达下一座城市时，城门外挤满了人。");
      arr.push("难民。成千上万的难民，拖着行李，抱着孩子，脸上是麻木和绝望。");
      arr.push("「铁门关破了。」一个老人告诉你。「兽人打过来了，我们的村子……没了。」");
      arr.push("城门紧闭。守卫在城墙上喊：「没有城主的命令，谁也不许进！」");
      arr.push("难民们在城门外搭起了帐篷。没有食物，没有药，没有希望。");
      arr.push("你可以帮忙，也可以走开。");
      arr.push("");
      arr.push("（战争的影响，不是战报上的数字。是这些活生生的人。）");
      return arr;
    },
    options: [
      { t:"拿出钱买食物分给难民", go:"event_continent_refugee_help", effect:{gold:-100, karma:"good", faction_rep:10} },
      { t:"想办法说服守卫放难民进城", go:"event_continent_refugee_negotiate", effect:{check:"CHA", tier:{crit:{},ok:{},fail:{},critfail:{}}} },
      { t:"绕过难民，直接进城", go:"fc_jiaohui_entry", effect:{flag:"ignore_refugees", karma:"neutral", san:-2} }
    ]
  };
};

N["event_continent_refugee_help"] = function(){
  return {tag:"event",
    place: "大陆·难民的感激",
    text: function(){
      const arr = [];
      arr.push("你花了一百金龙，买了几车粮食和药品，分给了难民。");
      arr.push("人们围着你，哭着道谢。一个母亲把孩子举起来，让孩子看你。「记住这个人。」她说。「他是好人。」");
      arr.push("你注意到人群中有一个年轻人，眼神和其他人不一样。他不是在看食物，是在看你。");
      arr.push("他走过来。「我叫雷恩。」他说。「我的村子被兽人毁了。我想参军，但我没有路费。」");
      arr.push("他看着你。「你帮了我们。如果有一天你需要我……我会来。」");
      arr.push("他走了。你不知道他会不会真的来。");
      arr.push("但你种下了一颗因果种子。");
      arr.push("难民的感激的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{flag:"refugee_raine", plantRipple:"help_refugee"} }
    ]
  };
};

N["event_continent_refugee_negotiate"] = function(){
  return {tag:"event",
    place: "大陆·与守卫谈判",
    text: function(){
      const arr = [];
      arr.push("你走到城门前，抬头看着守卫。");
      arr.push("「放他们进城。」你说。");
      arr.push("守卫冷笑。「你是谁？城主有令，没有命令谁也不许进。」");
      arr.push("你吸了口气，开始说话。你说难民也是人，说城门关着只会逼人造反，说如果放他们进城，城主会得到民心。");
      arr.push("你的声音在城墙下回荡。难民们安静下来，听你说话。");
      arr.push("守卫的表情变了。他犹豫了。");
      return arr;
    },
    options: [
      { t:"（CHA判定）", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"守卫被你说服了，打开了城门。难民们欢呼着涌入。你成了这座城市的英雄。", effect:{faction_rep:20, karma:"great_good"}},
        ok:{t:"守卫犹豫了一下，放了一部分难民进城。虽然不是全部，但至少救了一些人。", effect:{faction_rep:10, karma:"good"}},
        fail:{t:"守卫不为所动。「再说我连你也抓起来。」你只能退开。", effect:{faction_rep:-5}},
        critfail:{t:"守卫被激怒了，叫人把你赶走。难民们恨你无能，守卫恨你多事。", effect:{faction_rep:-10, relation:"refugees:-15"}}
      }} }
    ]
  };
};

// ============================================================
// v25 随机遭遇节点
// ============================================================
N["encounter_save_caravan"] = function(){
  return {
    place: "旅途·商队遇劫",
    text: function(){
      const arr = [];
      arr.push("你在赶路时，听到前面有喊杀声。");
      arr.push("你跑过去，看到一伙强盗正在抢劫一支商队。商队的护卫已经倒了两个，剩下的在苦苦支撑。");
      arr.push("强盗头目是个满脸刀疤的壮汉，正拿着刀逼一个商人模样的人交钱袋。");
      arr.push("你可以出手帮忙，也可以趁乱溜走，甚至可以……趁火打劫。");
      return arr;
    },
    options: [
      { t:"冲上去救商队", go:"encounter_save_caravan_fight", effect:{check:"STR", tier:{
        crit:{t:"你一人冲散了强盗，商队毫发无损。商人感激涕零，要重重谢你。", effect:{gold:100, faction_rep:10}},
        ok:{t:"经过一番苦战，你打跑了强盗。商队损失不大，商人谢了你。", effect:{gold:50, hp:-10, faction_rep:5}},
        fail:{t:"你打不过强盗，被打了一顿。但你拖住了他们，商队的人趁机跑了。", effect:{hp:-25, faction_rep:5}},
        critfail:{t:"你被强盗打倒在地，他们抢了商队还抢了你。你躺在地上，看着他们扬长而去。", effect:{hp:-30, gold:-50}}
      }} },
      { t:"趁乱溜走", go:"fc_jiaohui_entry", effect:{flag:"ignored_caravan", san:-1} },
      { t:"趁火打劫", go:"fc_jiaohui_entry", effect:{gold:30, karma:"evil", wanted:1} }
    ]
  };
};

N["encounter_save_caravan_fight"] = function(){
  applyEncounterEffect("save_caravan", "fight");
  return {
    place: "旅途·商队的感谢",
    text: function(){
      const arr = [];
      arr.push("战斗结束了。");
      arr.push("商人走过来，紧紧握住你的手。「谢谢你，年轻人。如果不是你，我们这一车货就全没了。」");
      arr.push("他从怀里掏出一袋金币。「一点心意，请收下。」");
      arr.push("你接过金币。商人又说：「我是银穗商会的管事。以后在南方商路上，报我的名字，没人敢动你。」");
      arr.push("你救了一支商队。这个简单的选择，让你在南方商路上有了一个朋友。");
      arr.push("世界因为你的选择，改变了一点点——商路安全度上升了，银穗商会对你的态度变好了。");
      return arr;
    },
    options: [
      { t:"继续赶路", go:"fc_jiaohui_entry", effect:{time:1} }
    ]
  };
};

N["encounter_tavern_rumor"] = function(){
  return {
    place: "酒馆·传闻",
    text: function(){
      const arr = [];
      arr.push("酒馆里人声鼎沸。");
      arr.push("你找了个角落坐下，要了一杯麦酒。旁边两个商人在小声说话，但你还是听到了。");
      arr.push("「听说了吗？铁门关那边出事了。」「什么事？」「兽人在集结，好像要打过来。」「不可能吧，铁门关不是固若金汤吗？」「固若金汤？那是以前。最近守军减了一半，据说是调去镇压叛乱了……」");
      arr.push("你放下酒杯。");
      arr.push("这个传闻，可能是真的，也可能是假的，还可能是……暗蚀会故意散布的。");
      arr.push("但如果是真的——铁门关破了，整个北方都会陷入战火。");
      arr.push("从传闻出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"追问更多细节", go:"fc_jiaohui_entry", effect:{check:"CHA", tier:{
        crit:{t:"商人被你问得没办法，透露了更多——他听说暗蚀会在背后支持兽人。", effect:{knowledge:1, flag:"eclipse_orc_link"}},
        ok:{t:"商人又说了一些，但都是道听途说。你得到了一些模糊的线索。", effect:{knowledge:1}},
        fail:{t:"商人警觉了，不肯再说。「你问这么多干什么？」你只能作罢。", effect:{}},
        critfail:{t:"商人以为你是密探，大喊起来。全酒馆的人都在看你。你只能灰溜溜地离开。", effect:{relation:"tavern:-10"}}
      }} },
      { t:"记下传闻，继续喝酒", go:"fc_jiaohui_entry", effect:{knowledge:1, time:1} }
    ]
  };
};

// ============================================================
// v25 事件池面板
// ============================================================
N["event_pool_view"] = function(){
  return {tag:"event",
    place: "当前激活事件",
    text: function(){
      const arr = [];
      arr.push("【本次游戏激活的事件】");
      arr.push("");
      arr.push("学院事件：");
      const acadEvents = getActiveEvents("academy");
      if (acadEvents.length > 0) {
        for (const eid of acadEvents) {
          const e = ACADEMY_EVENTS_V25.find(x => x.id === eid);
          if (e) arr.push("· " + e.name);
        }
      } else {
        arr.push("（尚未生成，到达学院后生成）");
      }
      arr.push("");
      arr.push("大陆事件：");
      const contEvents = getActiveEvents("continent");
      if (contEvents.length > 0) {
        for (const eid of contEvents) {
          const e = CONTINENT_EVENTS.find(x => x.id === eid);
          if (e) arr.push("· " + e.name);
        }
      } else {
        arr.push("（尚未生成，到达大陆后生成）");
      }
      arr.push("");
      arr.push("每次重开，事件组合都不同。这就是为什么——每一次，都是不同的故事。");
      arr.push("出了当前激活事件，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

console.log("[v25 av] 章节随机事件+随机遭遇系统已加载");


// ============================================================
// v25 隐藏路线数据
// ============================================================
const HIDDEN_ROUTES = [
  {
    id: "watcher_academy",
    name: "守望者秘密学院",
    description: "被守望者选中，进入秘密学院接受特殊训练",
    conditions: [
      {type:"job", value:"soul_mage"},
      {type:"relation", npc:"mercury", value:60},
      {type:"flag", value:"watcher_spotted_prologue"},
      {type:"flag", value:"investigated_forbidden_section"}
    ],
    difficulty: "极难"
  },
  {
    id: "eclipse_pope",
    name: "暗蚀会教主路线",
    description: "取代暗蚀会教主，成为新的深渊代言人",
    conditions: [
      {type:"flag", value:"joined_eclipse"},
      {type:"eclipse_rank", value:"core"},
      {type:"relation_count", npc:"eclipse_directors", value:3},
      {type:"flag", value:"abyss_power_gained"}
    ],
    difficulty: "极难"
  },
  {
    id: "primordial_alliance",
    name: "原初之物联盟",
    description: "理解全部原初之物，与它们结盟，走出第三条路",
    conditions: [
      {type:"primordial_understood", value:5},
      {type:"knowledge_level", value:3},
      {type:"flag", value:"never_killed_primordial"},
      {type:"flag", value:"past_did_not_persuade_hlj"}
    ],
    difficulty: "极难"
  },
  {
    id: "dragon_tamer",
    name: "龙语者路线",
    description: "掌握龙语，唤醒龙族后裔，成为龙骑士",
    conditions: [
      {type:"language", value:"draconic"},
      {type:"flag", value:"found_dragon_egg"},
      {type:"location_time", value:"specific"},
      {type:"check", value:"SPR"}
    ],
    difficulty: "难"
  },
  {
    id: "lich_king",
    name: "巫妖王路线",
    description: "深入灵魂魔法禁忌，成为不死的存在",
    conditions: [
      {type:"job", value:"soul_mage"},
      {type:"knowledge", value:"soul_forbidden"},
      {type:"san", value:"below_30"},
      {type:"flag", value:"found_lich_phylactery"}
    ],
    difficulty: "难"
  },
  {
    id: "medici_heir",
    name: "美第奇继承人路线",
    description: "确认美第奇继承人身份，回归家族权力中心",
    conditions: [
      {type:"background", value:"medici"},
      {type:"relation", npc:"alexander", value:50},
      {type:"flag", value:"mother_clue_found"},
      {type:"flag", value:"mother_prison_found"}
    ],
    difficulty: "中"
  }
];

// ============================================================
// v25 属性影响剧情数据
// ============================================================
const ATTRIBUTE_UNLOCKS = [
  {id:"high_int_detail", attribute:"INT", threshold:70, type:"clue", description:"高INT注意到场景中的隐藏细节"},
  {id:"high_spr_atmosphere", attribute:"SPR", threshold:70, type:"warning", description:"高SPR感受到危险的氛围"},
  {id:"high_cha_persuade", attribute:"CHA", threshold:70, type:"option", description:"高CHA解锁说服选项"},
  {id:"low_int_mislead", attribute:"INT", threshold:30, type:"trap", description:"低INT被假消息误导"},
  {id:"language_ancient_runes", attribute:"language", value:"ancient", type:"knowledge", description:"掌握古艾尔达语能读懂符文"},
  {id:"knowledge_seal_truth", attribute:"knowledge", value:"seal_truth", type:"perception", description:"知道七印真相后场景描述变化"}
];

// ============================================================
// v25 引擎函数
// ============================================================
function hiddenRoutesInit() {
  if (!S.hiddenRoutes) {
    S.hiddenRoutes = {discovered: [], unlocked: [], completed: []};
  }
}

function checkHiddenRoutes() {
  hiddenRoutesInit();
  const newlyDiscovered = [];
  for (const route of HIDDEN_ROUTES) {
    if (S.hiddenRoutes.discovered.includes(route.id)) continue;
    let metConditions = 0;
    for (const cond of route.conditions) {
      if (checkCondition(cond)) metConditions++;
    }
    if (metConditions >= Math.ceil(route.conditions.length / 2)) {
      S.hiddenRoutes.discovered.push(route.id);
      newlyDiscovered.push(route);
    }
    if (metConditions === route.conditions.length && !S.hiddenRoutes.unlocked.includes(route.id)) {
      S.hiddenRoutes.unlocked.push(route.id);
    }
  }
  return newlyDiscovered;
}

function checkCondition(cond) {
  switch(cond.type) {
    case "job": return S.job === cond.value;
    case "background": return S.background === cond.value;
    case "flag": return S.flags && S.flags[cond.value] === true;
    case "relation": return S.relations && S.relations.deep && S.relations.deep[cond.npc] && S.relations.deep[cond.npc].trust >= cond.value;
    case "language": return S.languages && S.languages.known && S.languages.known[cond.value];
    case "knowledge": return S.knowledge && S.knowledge.known && S.knowledge.known[cond.value];
    case "san": return S.san < 30;
    default: return false;
  }
}

function getHiddenRouteClues() {
  hiddenRoutesInit();
  return S.hiddenRoutes.discovered;
}

function attributeUnlocksInit() {
  if (!S.attributeUnlocks) {
    S.attributeUnlocks = {nodes: [], clues: [], routes: []};
  }
}

function checkAttributeUnlocks() {
  attributeUnlocksInit();
  const unlocked = [];
  for (const unlock of ATTRIBUTE_UNLOCKS) {
    if (S.attributeUnlocks.clues.includes(unlock.id)) continue;
    let met = false;
    if (unlock.attribute === "INT" && S.attrs && S.attrs.INT >= unlock.threshold) met = true;
    if (unlock.attribute === "SPR" && S.attrs && S.attrs.SPR >= unlock.threshold) met = true;
    if (unlock.attribute === "CHA" && S.attrs && S.attrs.CHA >= unlock.threshold) met = true;
    if (unlock.attribute === "language" && S.languages && S.languages.known && S.languages.known[unlock.value]) met = true;
    if (unlock.attribute === "knowledge" && S.knowledge && S.knowledge.known && S.knowledge.known[unlock.value]) met = true;
    if (met) {
      S.attributeUnlocks.clues.push(unlock.id);
      unlocked.push(unlock);
    }
  }
  return unlocked;
}

function getAttributeText(nodeId, attribute) {
  const unlock = ATTRIBUTE_UNLOCKS.find(u => u.attribute === attribute);
  return unlock ? unlock.description : "";
}

// ============================================================
// v25 隐藏路线节点
// ============================================================
N["hidden_route_clue"] = function(){
  const newly = checkHiddenRoutes();
  return {
    place: "秘密的线索",
    text: function(){
      const arr = [];
      if (newly.length > 0) {
        arr.push("你突然意识到——有什么东西，你之前没有注意到。");
        arr.push("");
        for (const route of newly) {
          arr.push("【发现隐藏路线线索】" + route.name);
          arr.push(route.description);
          arr.push("（你满足了部分条件。继续探索，也许能解锁这条路线。）");
          arr.push("");
        }
      } else {
        arr.push("你仔细回想最近的经历，试图找出隐藏在表象之下的秘密。");
        arr.push("");
        arr.push("已发现的隐藏路线线索：");
        const clues = getHiddenRouteClues();
        if (clues.length > 0) {
          for (const rid of clues) {
            const route = HIDDEN_ROUTES.find(r => r.id === rid);
            if (route) arr.push("· " + route.name + "（难度：" + route.difficulty + "）");
          }
        } else {
          arr.push("（暂无。隐藏路线需要特定条件组合才能触发。）");
        }
      }
      arr.push("");
      arr.push("有些路，不是明着给的。你需要在正确的时间、正确的地点，带着正确的身份和知识，才能看到它。");
      arr.push("你收拾停当，离开秘密的线索，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"继续探索", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["hidden_watcher_academy_unlock"] = function(){
  hiddenRoutesInit();
  if (!S.hiddenRoutes.unlocked.includes("watcher_academy")) {
    S.hiddenRoutes.unlocked.push("watcher_academy");
  }
  return {
    place: "隐藏路线·守望者秘密学院",
    text: function(){
      const arr = [];
      arr.push("深夜，墨丘利来到你的宿舍。");
      arr.push("「你满足了所有条件。」他说。「灵魂法师，墨丘利的认可，序章被守望者密探看中，调查过禁书区。」");
      arr.push("他看着你。「守望者有一个秘密学院。不在艾尔达，不在承天，不在任何地图上。那里教的东西……是正式学院不会教的。」");
      arr.push("「七印的真相。原初之物的本质。黄林晶的罪。守望者三千年的秘密。」");
      arr.push("「你愿意来吗？」");
      arr.push("");
      arr.push("（你解锁了隐藏路线：守望者秘密学院。这是一条极难的路线，但也是最接近真相的路线。）");
      arr.push("守望者秘密学院已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"愿意，跟墨丘利走", go:"fc_jiaohui_entry", effect:{flag:"watcher_academy_accepted", updateStoryLine:"watcher:30"} },
      { t:"拒绝，我有自己的路", go:"fc_jiaohui_entry", effect:{flag:"watcher_academy_declined", relation:"mercury:-10"} }
    ]
  };
};

N["hidden_dragon_tamer_unlock"] = function(){
  hiddenRoutesInit();
  if (!S.hiddenRoutes.unlocked.includes("dragon_tamer")) {
    S.hiddenRoutes.unlocked.push("dragon_tamer");
  }
  return {
    place: "隐藏路线·龙语者",
    text: function(){
      const arr = [];
      arr.push("你在矮人王国的深处，找到了一枚龙蛋。");
      arr.push("蛋壳上刻满了符文——不是矮人符文，不是精灵符文，是……龙语。");
      arr.push("你掌握了龙语。你能读懂这些符文。");
      arr.push("「以血脉之名，以时间之约，以世界之初的承诺——醒来。」你念出了符文上的话。");
      arr.push("龙蛋裂开了。");
      arr.push("一只小龙探出头来。它看着你，用古老的、超越时间的声音说：「你是我的……龙骑士？」");
      arr.push("");
      arr.push("（你解锁了隐藏路线：龙语者。龙族已经灭绝三千年，但这枚蛋，是最后的希望。）");
      return arr;
    },
    options: [
      { t:"接受小龙，成为龙骑士", go:"fc_jiaohui_entry", effect:{flag:"dragon_tamer_accepted", item:"幼龙", updateStoryLine:"race:20"} },
      { t:"把龙蛋交给矮人王国", go:"fc_jiaohui_entry", effect:{flag:"dragon_egg_given", faction_rep:20} }
    ]
  };
};

// ============================================================
// v25 属性影响剧情节点
// ============================================================
N["attr_high_int_clue"] = function(){
  const unlocked = checkAttributeUnlocks();
  return {
    place: "细节·高INT洞察",
    text: function(){
      const arr = [];
      arr.push("你的视线扫过房间。");
      arr.push("大多数人只会看到表面——一张桌子，一把椅子，一杯茶。");
      arr.push("但你看到了更多。");
      arr.push("");
      arr.push("· 桌上的茶杯有两个杯印——一个在左边，一个在右边。左撇子和右撇子，两个人在这里喝过茶。");
      arr.push("· 椅子的位置偏移——最近有人坐过，而且走的时候很匆忙，没有把椅子推回去。");
      arr.push("· 窗台上有一点泥土——不是城里的土，是……北方的红土。有人从铁门关方向来。");
      arr.push("· 书架上的书，第三层第二本，书脊的磨损程度和其他书不一样——这本书被频繁取阅。是什么书？");
      arr.push("");
      arr.push("（高INT让你注意到了这些细节。这些细节，可能是某个隐藏路线的线索。）");
      arr.push("从高INT洞察出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options: [
      { t:"调查那本被频繁取阅的书", go:"fc_jiaohui_entry", effect:{knowledge:1, flag:"found_secret_book"} },
      { t:"记下这些细节，继续行动", go:"fc_jiaohui_entry", effect:{flag:"noted_details"} }
    ]
  };
};

N["attr_high_spr_warning"] = function(){
  return {tag:"branch",
    place: "氛围·高SPR预警",
    text: function(){
      const arr = [];
      arr.push("你走进房间的那一刻，汗毛竖了起来。");
      arr.push("不是因为冷。是因为……氛围。");
      arr.push("房间里有一种东西。不是物理的东西，是……情绪的残留。");
      arr.push("恐惧。浓烈的、尚未消散的恐惧。有人在这里非常害怕过。");
      arr.push("还有……杀意。虽然很淡，但你能闻到。像铁锈，像血，像死亡前的最后一口气。");
      arr.push("这个房间，发生过不好的事。而且……可能还会发生。");
      arr.push("");
      arr.push("（高SPR让你感受到了氛围中的危险。你可以选择离开，也可以选择调查——但调查可能有危险。）");
      arr.push("出了高SPR预警，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"小心地调查", go:"fc_jiaohui_entry", effect:{check:"SPR", tier:{
        crit:{t:"你顺着杀意的方向找到了一个暗格，里面有一封信。信的内容让你脊背发凉。", effect:{knowledge:1, item:"神秘信件"}},
        ok:{t:"你找到了一些痕迹，但没有发现具体是什么。你记下了这个地方。", effect:{flag:"noted_danger"}},
        fail:{t:"你什么都没找到，但那种危险的感觉更强烈了。你决定先离开。", effect:{san:-2}},
        critfail:{t:"你触发了一个陷阱！一把毒针从墙壁里射出来，擦着你的脖子飞过。", effect:{hp:-15, san:-5}}
      }} },
      { t:"立刻离开这个房间", go:"fc_jiaohui_entry", effect:{flag:"left_dangerous_room", san:-1} }
    ]
  };
};

N["attr_language_ancient_decode"] = function(){
  return {
    place: "符文·古艾尔达语解读",
    text: function(){
      const arr = [];
      arr.push("你站在七印的符文前。");
      arr.push("大多数人看到的，只是一些奇怪的线条和图案。");
      arr.push("但你掌握了古艾尔达语。你能读懂。");
      arr.push("");
      arr.push("符文上写着：");
      arr.push("「吾以黄林晶之名，以七情为锁，以时间为牢，囚禁汝于此。」");
      arr.push("「汝非邪恶，汝非善良。汝只是……太满了。」");
      arr.push("「吾不忍杀汝，亦不忍放汝。唯有此策——喂养汝，让汝沉睡，直到……有人能找到第三条路。」");
      arr.push("");
      arr.push("你读完了。你的手在抖。");
      arr.push("黄林晶不是在封印邪恶。他是在……囚禁一个他不忍心杀的存在。");
      arr.push("「第三条路」——他知道有第三条路，但他没有找到。");
      arr.push("也许，你可以。");
      arr.push("");
      arr.push("（掌握古艾尔达语让你读懂了符文的真正含义。其他玩家看到的只是「古老的符文，无法解读」。）");
      arr.push("你离了古艾尔达语解读，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options: [
      { t:"记下符文内容，继续探索", go:"fc_jiaohui_entry", effect:{knowledge:1, flag:"read_seal_runes", san:-3} }
    ]
  };
};

N["attr_knowledge_perception_change"] = function(){
  return {
    place: "认知·知道真相后的世界",
    text: function(){
      const arr = [];
      arr.push("自从你知道了七印的真相，世界看起来不一样了。");
      arr.push("");
      arr.push("你走在城市的街道上，看到人们在笑，在哭，在争吵，在相爱。");
      arr.push("但你知道——这些情感，都是「被切除了七情」之后的残余。人们不会笑到疯狂，不会哭到死亡，不会被情感吞噬。");
      arr.push("因为七印在镇压着原初之物。因为原初之物在沉睡。");
      arr.push("你看到一个孩子在哭，母亲在安慰他。你想——如果七印碎了，这个孩子会哭到死吗？");
      arr.push("你看到一对恋人在接吻。你想——如果原初之物觉醒了，他们的爱会变成吞噬一切的火焰吗？");
      arr.push("");
      arr.push("知道真相的代价，就是你再也不能「天真地」看这个世界了。");
      arr.push("每一个微笑背后，都是三千年的镇压。每一滴眼泪背后，都是被囚禁的情感。");
      arr.push("");
      arr.push("（知道七印真相后，所有场景描述都会发生微妙变化。你看到的世界，和不知道真相的人看到的，是两个世界。）");
      arr.push("你收拾停当，离开知道真相后的世界，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"承受这份认知，继续前进", go:"fc_jiaohui_entry", effect:{san:-2, flag:"perception_changed"} },
      { t:"也许……遗忘会更好受一些", go:"fc_jiaohui_entry", effect:{flag:"consider_forgetting"} }
    ]
  };
};

console.log("[v25 aw] 隐藏路线+属性影响剧情系统已加载");


// ============================================================
// v25 多周目数据
// ============================================================
const NG_PLUS_INHERIT = [
  {id:"realm", name:"境界继承", description:"继承上周目的境界等级"},
  {id:"skills", name:"技能继承", description:"继承上周目的技能"},
  {id:"items", name:"物品继承", description:"继承上周目的特殊物品"},
  {id:"reputation", name:"声望继承", description:"继承上周目的势力声望"},
  {id:"knowledge", name:"知识继承", description:"继承上周目的知识（但有代价）"},
  {id:"relations", name:"关系继承", description:"继承上周目的NPC关系（他们会记得你）"}
];

const NG_PLUS_WORLD_EFFECTS = {
  sealed: {description:"上周目封印了七印", worldMod:"stable_but_repressed", effect:"本周目世界更稳定但更压抑，净化令强度+1，深渊进度-10"},
  freed: {description:"上周目解放了原初之物", worldMod:"chaotic_but_complete", effect:"本周目世界更混乱但更完整，随机事件+30%，深渊进度+10"},
  coexist: {description:"上周目选择了共存", worldMod:"balanced_new_world", effect:"本周目世界是新世界，后继者在面对新问题，所有属性+5"},
  become_lord: {description:"上周目成为了深渊之主", worldMod:"abyss_dominated", effect:"本周目世界被深渊统治，你是反抗者，所有判定-10"}
};

const NG_PLUS_HIDDEN_CHARACTERS = [
  {id:"hlj_ghost", name:"黄林晶残影", unlockCycle:2, description:"二周目解锁，黄林晶的残影会在特定地点出现"},
  {id:"seraph", name:"塞拉芬", unlockCycle:2, description:"二周目解锁，塞拉芬的封印可以被解除"},
  {id:"primordial_avatar", name:"原初之物化身", unlockCycle:3, description:"三周目解锁，原初之物会以人形出现"}
];

// ============================================================
// v25 世界时钟数据
// ============================================================
const WORLD_CLOCK_CONFIG = {
  prologueLength: {min:7, max:14, determinedBy:["background","events","choices"]},
  academyLength: {min:3, max:5, determinedBy:["grades","events","expulsion","recruitment"]},
  continentPace: {type:"player_driven", worldEventPressure:true},
  abyssTimer: {trigger:"abyssProgress=100", canAccelerate:true, canDelay:true}
};

// ============================================================
// v25 引擎函数
// ============================================================
function ngPlusInit(cycle) {
  if (!S.ngPlus) {
    S.ngPlus = {cycle: cycle || 1, inherited: [], worldEffect: null, unlockedContent: []};
  }
  if (S.ngPlus.cycle > 1) {
    for (const char of NG_PLUS_HIDDEN_CHARACTERS) {
      if (S.ngPlus.cycle >= char.unlockCycle && !S.ngPlus.unlockedContent.includes(char.id)) {
        S.ngPlus.unlockedContent.push(char.id);
      }
    }
  }
}

function ngPlusInherit(choices) {
  ngPlusInit();
  S.ngPlus.inherited = choices;
}

function ngPlusWorldEffect(lastEnding) {
  ngPlusInit();
  const effect = NG_PLUS_WORLD_EFFECTS[lastEnding];
  if (effect) {
    S.ngPlus.worldEffect = effect;
  }
}

function ngPlusUnlockCheck() {
  ngPlusInit();
  return S.ngPlus.unlockedContent;
}

function worldClockInit() {
  if (!S.worldClock) {
    S.worldClock = {
      day: 0,
      prologueDays: 0,
      academyYears: 0,
      continentDays: 0,
      abyssProgress: 0,
      missedStories: []
    };
  }
}

function advanceTime(days) {
  worldClockInit();
  S.worldClock.day += days;
  if (S.worldTimeline) {
    S.worldTimeline.day = S.worldClock.day;
  }
  worldTick(days);
  try{ v47_worldTick(); }catch(e){}
    try{ window.v56_tickStrong(); }catch(e){}
    try{ window.v57_factionEventTick(); }catch(e){}
    try{ w64_tickWorld(); }catch(e){}
    try{ if(window.v65_tick) v65_tick(); }catch(e){} // v65:engine /*v64inj:hooks*/
      try{ v48_weaknessTick(); }catch(e){} // v48inj:tick
  checkStoryAvailability();
  missedStoryCheck();
  try{ v44_afterAdvance(days); }catch(e){}
}

function checkStoryAvailability() {
  worldClockInit();
  // 检查当前时间可用的剧情
}

function missedStoryCheck() {
  worldClockInit();
  if (!S.worldClock.missedStories) S.worldClock.missedStories = [];
  for (const tw of TIME_WINDOWS) {
    if (S.worldClock.day > tw.endDay && !S.worldClock.missedStories.includes(tw.id)) {
      S.worldClock.missedStories.push(tw.id);
    }
  }
}

function getTimeline() {
  worldClockInit();
  return "第" + S.worldClock.day + "天 | 序章" + S.worldClock.prologueDays + "天 | 学院" + S.worldClock.academyYears + "年 | 大陆" + S.worldClock.continentDays + "天 | 深渊进度" + S.worldClock.abyssProgress + "%";
}

// ============================================================
// v25 十二方向联动总控
// ============================================================
function v25MasterInit() {
  // 初始化所有v25系统
  if (!S.worldSeed) generateWorld();
  worldClockInit();
  mainBranchInit();
  storyLinesInit();
  npcFateInit();
  if (!S.ripples) S.ripples = {seedsPlanted:[], seedsHarvested:[], activeChains:[]};
  if (!S.activeEvents) S.activeEvents = {academy:[], continent:[], prologue:[], abyss:[]};
  if (!S.encounterHistory) S.encounterHistory = [];
  hiddenRoutesInit();
  attributeUnlocksInit();
  ngPlusInit();
}

function v25DailyUpdate() {
  // 每天调用一次，更新所有动态系统
  advanceTime(1);
  checkHiddenRoutes();
  checkAttributeUnlocks();
}

function v25EndingSynthesis() {
  // 汇聚所有v25方向，合成最终结局
  const result = {
    worldSeed: S.worldSeed ? S.worldSeed.seed : 0,
    mainBranch: S.mainBranch ? S.mainBranch.choices : [],
    storyLines: S.storyLines ? S.storyLines.progress : {},
    npcFates: S.npcFates ? S.npcFates.locked : [],
    ripples: S.ripples ? S.ripples.seedsHarvested.length : 0,
    activeEvents: S.activeEvents ? Object.values(S.activeEvents).flat().length : 0,
    hiddenRoutes: S.hiddenRoutes ? S.hiddenRoutes.completed.length : 0,
    attributeUnlocks: S.attributeUnlocks ? S.attributeUnlocks.clues.length : 0,
    ngPlusCycle: S.ngPlus ? S.ngPlus.cycle : 1,
    worldClock: S.worldClock ? S.worldClock.day : 0,
    missedStories: S.worldClock ? S.worldClock.missedStories.length : 0
  };
  return result;
}

// ============================================================
// v25 多周目节点
// ============================================================
N["ngplus_intro"] = function(){
  ngPlusInit(2);
  return {
    place: "二周目·似曾相识",
    text: function(){
      const arr = [];
      arr.push("你睁开眼。");
      arr.push("又是序章。又是那个出身地。又是那些人。");
      arr.push("但你知道——这不是第一次了。");
      arr.push("你记得上周目发生的一切。你记得谁死了，谁背叛了，谁成了英雄。你记得七印的真相，记得原初之物的哭声，记得黄林晶的罪。");
      arr.push("但这个世界的人不记得。对他们来说，你只是一个刚离开故乡的年轻人。");
      arr.push("你可以用上周目的知识改变命运。但你也知道——改变一个人的命运，可能会让另一个人的命运变得更糟。");
      arr.push("");
      arr.push("（二周目开始。你可以选择继承上周目的部分内容。世界因为上周目的结局而有所不同。）");
      arr.push("你最后回望一眼似曾相识，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"选择继承内容", go:"ngplus_inherit", effect:{} },
      { t:"不继承，从零开始", go:"ngplus_world_effect", effect:{flag:"no_inherit"} }
    ]
  };
};

N["ngplus_inherit"] = function(){
  return {
    place: "二周目·继承",
    text: function(){
      const arr = [];
      arr.push("你可以从上周目继承以下内容（最多选2项）：");
      arr.push("");
      for (const opt of NG_PLUS_INHERIT) {
        arr.push("· " + opt.name + "：" + opt.description);
      }
      arr.push("");
      arr.push("继承的越多，本周目越容易。但也越没有新鲜感。");
      arr.push("（知识继承有代价——你知道真相，但SAN值上限-10）");
      arr.push("你最后回望一眼继承，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options: [
      { t:"继承境界+技能", go:"ngplus_world_effect", effect:{flag:"inherit_realm_skills"} },
      { t:"继承物品+声望", go:"ngplus_world_effect", effect:{flag:"inherit_items_rep"} },
      { t:"继承知识+关系", go:"ngplus_world_effect", effect:{flag:"inherit_knowledge_rel", sanMax:-10} },
      { t:"什么都不继承", go:"ngplus_world_effect", effect:{flag:"no_inherit"} }
    ]
  };
};

N["ngplus_world_effect"] = function(){
  return {
    place: "二周目·世界的变化",
    text: function(){
      const arr = [];
      arr.push("你开始了新的旅程。");
      arr.push("但你很快发现——这个世界，和上周目不一样了。");
      arr.push("");
      if (S.flags.inherit_knowledge_rel) {
        arr.push("你继承了上周目的知识。你知道七印的真相，知道原初之物的人格，知道暗蚀会的动机。");
        arr.push("但这些知识像一块石头，压在你的心上。你看世界的方式，永远改变了。");
        arr.push("（SAN上限-10）");
      }
      arr.push("");
      arr.push("上周目的结局，影响了本周目的世界：");
      arr.push("· 如果上周目封印了七印→本周目世界更稳定但更压抑");
      arr.push("· 如果上周目解放了原初之物→本周目世界更混乱但更完整");
      arr.push("· 如果上周目选择了共存→本周目是新世界，所有属性+5");
      arr.push("");
      arr.push("你还注意到——有些上周目不存在的东西，出现了。");
      arr.push("黄林晶的残影，在特定地点若隐若现。塞拉芬的封印，似乎松动了。");
      arr.push("（二周目解锁隐藏角色：黄林晶残影、塞拉芬）");
      return arr;
    },
    options: [
      { t:"开始新的旅程", go:"world_gen_intro", effect:{} }
    ]
  };
};

N["ngplus_true_ending"] = function(){
  return {tag:"ending",
    place: "真结局·三周目的累积",
    text: function(){
      const arr = [];
      arr.push("你站在第七印的神殿前。");
      arr.push("这是你第三次站在这里了。");
      arr.push("第一周目，你选择了封印。世界稳定了，但你知道那只是延缓。");
      arr.push("第二周目，你选择了解放。世界混乱了，但情感回归了。");
      arr.push("第三周目，你选择了……共存。");
      arr.push("");
      arr.push("你理解了全部七个原初之物。你承担了所有深层知识的代价。你与黄林晶的残影对话，与塞拉芬并肩，与原初之物的化身握手。");
      arr.push("你找到了第三条路——不是封印，不是解放，是共存。");
      arr.push("");
      arr.push("世界重新完整了。不是黄林晶时代那种满到溢出来的完整，是……平衡的完整。");
      arr.push("人们会笑，会哭，会愤怒，会爱——但不会被情感吞噬。");
      arr.push("");
      arr.push("三千年了。从黄林晶切除七情的那一天起，世界就在等待一个人。");
      arr.push("一个能看到符文的人。一个能理解原初之物的人。一个能走出第三条路的人。");
      arr.push("那个人，是你。");
      arr.push("不是因为你被选中了。是因为你选择了来。一次又一次。");
      arr.push("");
      arr.push("【真结局·完整的世界】");
      arr.push("—— 完 ——");
      arr.push("三周目的累积已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"开始四周目，看看还有什么", go:"world_gen_intro", effect:{flag:"ngplus_4"} },
      { t:"结束，让故事停在这里", go:"fc_jiaohui_entry", effect:{flag:"true_ending_complete"} }
    ]
  };
};

// ============================================================
// v25 世界时钟节点
// ============================================================
N["timeline_overview"] = function(){
  worldClockInit();
  return {
    place: "时间线",
    text: function(){
      const arr = [];
      arr.push("【时间线】");
      arr.push("");
      arr.push(getTimeline());
      arr.push("");
      arr.push("序章长度：7-14天（取决于出身/事件/选择）");
      arr.push("学院长度：3-5年（取决于成绩/事件/是否被开除）");
      arr.push("大陆节奏：玩家自由决定，但世界事件在你慢的时候会恶化");
      arr.push("终局时机：深渊进度到100%时强制终局");
      arr.push("");
      if (S.worldClock.missedStories.length > 0) {
        arr.push("【错过的剧情】");
        for (const ms of S.worldClock.missedStories) {
          const tw = TIME_WINDOWS.find(t => t.id === ms);
          if (tw) arr.push("· " + tw.name + "：" + tw.missedConsequence);
        }
      }
      arr.push("");
      arr.push("世界不等你。有些剧情，错过了就永远错过了。");
      arr.push("你与时间线作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["missed_story_demo"] = function(){
  return {
    place: "错过的故事",
    text: function(){
      const arr = [];
      arr.push("你回到学院时，第二印的萨满仪式已经结束了。");
      arr.push("你听说——萨满在仪式中死了。第二印彻底破碎了。");
      arr.push("如果你早到十天，你可以参加仪式，也许可以救下萨满，也许可以修复第二印。");
      arr.push("但你没有。你在南方港城，和一个商人喝酒，听他讲海上的故事。");
      arr.push("你不知道那个仪式的存在。等你知道的时候，已经太晚了。");
      arr.push("");
      arr.push("世界不等你。有些故事，错过了就永远错过了。");
      arr.push("但错过本身，也是一种故事。");
      arr.push("第二印碎了。深渊进度+15。兽人草原陷入混乱。");
      arr.push("这些，都是因为你——没有来。");
      return arr;
    },
    options: [
      { t:"承受这个后果，继续前进", go:"fc_jiaohui_entry", effect:{abyssDelta:15, flag:"missed_seal_2", san:-3} },
      { t:"试图补救，前往兽人草原", go:"fc_jiaohui_entry", effect:{flag:"remedy_seal_2", time:10} }
    ]
  };
};

N["time_pressure_abyss"] = function(){
  return {
    place: "时间压力·深渊倒计时",
    text: function(){
      const arr = [];
      arr.push("你做了一个梦。");
      arr.push("梦里，你站在死亡沙漠的中心。第七印在你面前碎裂。原初之物——色欲——从封印中走出来。");
      arr.push("它看着你，微笑。「你太慢了。」");
      arr.push("你惊醒。");
      arr.push("");
      arr.push("你看了看深渊进度——已经75%了。");
      arr.push("你还有时间。但不多了。");
      arr.push("你可以继续慢慢游历，收集线索，建立关系。但每多花一天，深渊就多靠近一步。");
      arr.push("你也可以直奔第七印，尽快结束这一切。但你准备好了吗？");
      arr.push("");
      arr.push("（深渊进度达到100%时，强制进入终局。你可以通过修复七印/理解原初之物来延缓，也可以通过破坏七印来加速。）");
      arr.push("别过深渊倒计时，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options: [
      { t:"加快速度，直奔第七印", go:"fc_jiaohui_entry", effect:{flag:"rush_to_abyss", time:5} },
      { t:"继续慢慢游历，做好准备", go:"fc_jiaohui_entry", effect:{flag:"prepare_slowly", abyssDelta:5} }
    ]
  };
};

// ============================================================
// v25 十二方向联动总控节点
// ============================================================
N["v25_master_status"] = function(){
  v25MasterInit();
  const status = v25EndingSynthesis();
  return {
    place: "v25系统总览",
    text: function(){
      const arr = [];
      arr.push("【v25 随机化叙事架构·系统总览】");
      arr.push("");
      arr.push("世界种子：" + status.worldSeed);
      arr.push("当前周目：第" + status.ngPlusCycle + "周目");
      arr.push("当前天数：第" + status.worldClock + "天");
      arr.push("错过的剧情：" + status.missedStories + "个");
      arr.push("");
      arr.push("【主线分支】");
      for (const c of status.mainBranch) {
        arr.push("· " + c.chapter + "：" + c.branch);
      }
      arr.push("");
      arr.push("【故事线进度】");
      for (const line in status.storyLines) {
        arr.push("· " + line + "：" + status.storyLines[line] + "%");
      }
      arr.push("");
      arr.push("【NPC命运锁定】" + status.npcFates.length + "个");
      arr.push("【因果收获】" + status.ripples + "颗种子已结果");
      arr.push("【激活事件】" + status.activeEvents + "个");
      arr.push("【隐藏路线完成】" + status.hiddenRoutes + "条");
      arr.push("【属性解锁】" + status.attributeUnlocks + "个");
      arr.push("");
      arr.push("所有方向汇聚于一个核心：每次重开，都是不同的游戏。");
      return arr;
    },
    options: [
      { t:"继续冒险", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

console.log("[v25 ax] 多周目+世界时钟+十二方向联动总控已加载");
console.log("[v25] 全部12个方向已纳入：随机世界/动态演变/主线分支/多线并行/NPC命运/涟漪效应/随机事件/随机遭遇/隐藏路线/属性影响/多周目/世界时钟");


// ============================================================
// v26 时段定义
// ============================================================
const TIME_PERIODS_V26 = {
  morning: {name:"清晨", hours:"06-12", light:"薄雾晨光", mood:"苏醒希望",
    shopMod:1.0, combatMod:0, cultivateBonus:{elemental:10, holy:15, default:0}, sanMod:0,
    desc:"雾气未散，炊烟升起，世界刚刚睁开眼。"},
  noon: {name:"正午", hours:"12-18", light:"烈日喧闹", mood:"繁忙焦虑",
    shopMod:1.1, combatMod:5, cultivateBonus:{warrior:10, default:0}, sanMod:0,
    desc:"阳光最烈，人声最沸，每个人都在赶路。"},
  dusk: {name:"黄昏", hours:"18-24", light:"余晖长影", mood:"过渡秘密",
    shopMod:0.85, combatMod:-5, cultivateBonus:{shadow:15, soul:10, default:0}, sanMod:-2,
    desc:"影子被拉得很长，归人匆匆，秘密在暮色中滋生。"},
  night: {name:"深夜", hours:"00-06", light:"黑暗寂静", mood:"危险暗流",
    shopMod:1.5, combatMod:-15, cultivateBonus:{soul:20, abyss:25, default:0}, sanMod:-5,
    desc:"世界沉入黑暗，灯火是唯一的温暖，也是最危险的诱惑。"}
};

const PERIOD_ORDER_V26 = ["morning", "noon", "dusk", "night"];

// ============================================================
// v26 行动时间消耗表
// ============================================================
const TIME_COST_BIG_V26 = {
  explore_location: "1period",
  deep_dialogue: "1period",
  cultivate_session: "1period",
  work_labor: "1period",
  ritual_cast: "1period",
  craft_item: "1period",
  travel_segment: "1period",
  attend_class: "1period",
  investigate: "1period"
};

const TIME_COST_HUGE_V26 = {
  closed_cultivation_1d: "1day",
  closed_cultivation_3d: "3days",
  closed_cultivation_7d: "7days",
  closed_cultivation_30d: "30days",
  major_ritual: "1night",
  master_work: "3days"
};

const TIME_COST_SMALL_V26 = {
  quick_chat: "instant",
  buy_sell: "instant",
  use_item: "instant",
  check_status: "instant",
  equip_item: "instant"
};

// ============================================================
// v26 天气系统
// ============================================================
const WEATHER_TABLE_V26 = {
  clear: {name:"晴", icon:"☀️", travelMod:1.0, sanMod:1, combatMod:0, desc:"阳光明媚"},
  cloudy: {name:"阴", icon:"☁️", travelMod:1.0, sanMod:0, combatMod:0, desc:"云层厚重"},
  rain: {name:"雨", icon:"🌧️", travelMod:0.7, sanMod:-1, combatMod:-5, desc:"雨水连绵"},
  snow: {name:"雪", icon:"❄️", travelMod:0.5, sanMod:-1, combatMod:-10, desc:"大雪纷飞"},
  fog: {name:"雾", icon:"🌫️", travelMod:0.8, sanMod:-2, combatMod:-10, desc:"浓雾弥漫"},
  storm: {name:"暴风", icon:"⛈️", travelMod:0.3, sanMod:-3, combatMod:-15, desc:"狂风暴雨"},
  heatwave: {name:"酷热", icon:"🔥", travelMod:0.8, sanMod:-2, combatMod:-5, desc:"热浪滚滚"},
  bloodrain: {name:"血雨", icon:"🩸", travelMod:0.6, sanMod:-5, combatMod:-10, desc:"天降血雨，深渊的征兆"}
};

const SEASONS_V26 = {
  spring: {name:"春", months:[1,2,3], travelMod:1.1, eventMod:"positive", desc:"万物复苏"},
  summer: {name:"夏", months:[4,5,6], travelMod:1.0, eventMod:"neutral", desc:"烈日炎炎"},
  autumn: {name:"秋", months:[7,8,9], travelMod:1.0, eventMod:"harvest", desc:"收获季节"},
  winter: {name:"冬", months:[10,11,12], travelMod:0.8, eventMod:"negative", desc:"天寒地冻"}
};

// ============================================================
// v26 时间核心引擎函数
// ============================================================
function initTimeV26() {
  if (!S.time) {
    S.time = {
      year: 1,
      month: 1,
      day: 1,
      period: "morning",
      dayOfWeek: 1,
      season: "spring",
      weather: "clear",
      totalDays: 0,
      timePressure: 0,
      periodEvents: [],
      dailyLog: [],
      weeklyReport: [],
      monthlyReview: [],
      consecutiveCultivate: 0,
      consecutiveCombat: 0,
      daysSinceSleep: 0
    };
  }
  if (!S.parallelEvents) S.parallelEvents = [];
  if (!S.worldTimers) S.worldTimers = [];
  if (!S.fatigue) S.fatigue = {level:0, lastSleepDay:0};
  if (!S.npcSchedules) S.npcSchedules = {};
  if (!S.shopStates) S.shopStates = {};
}

function getTimeStringV26() {
  initTimeV26();
  const p = TIME_PERIODS_V26[S.time.period];
  const w = WEATHER_TABLE_V26[S.time.weather];
  const s = SEASONS_V26[S.time.season];
  return "第" + S.time.year + "年 " + s.name + " " + S.time.month + "月" + S.time.day + "日 " + p.name + " " + w.icon + w.name;
}

function advanceTimeV26(periods) {
  initTimeV26();
  for (let i = 0; i < periods; i++) {
    const idx = PERIOD_ORDER_V26.indexOf(S.time.period);
    if (idx === 3) {
      // 深夜→清晨，新的一天
      S.time.period = "morning";
      S.time.day++;
      S.time.totalDays++;
      S.time.dayOfWeek = (S.time.dayOfWeek % 7) + 1;
      S.time.daysSinceSleep++;
      if (S.time.day > 30) {
        S.time.day = 1;
        S.time.month++;
        generateMonthlyReviewV26();
        if (S.time.month > 12) {
          S.time.month = 1;
          S.time.year++;
        }
      }
      // 更新季节
      for (const s in SEASONS_V26) {
        if (SEASONS_V26[s].months.includes(S.time.month)) {
          S.time.season = s;
          break;
        }
      }
      // 每天清晨刷新商店库存+天气
      rollWeatherV26();
      refreshShopsV26();
      try{ v47_worldTick(); }catch(e){}
    try{ window.v56_tickStrong(); }catch(e){}
    try{ window.v57_factionEventTick(); }catch(e){}
    try{ w64_tickWorld(); }catch(e){}
    try{ if(window.v65_tick) v65_tick(); }catch(e){} // v65:engine /*v64inj:hooks*/
      try{ v48_weaknessTick(); }catch(e){} // v48inj:tick
      // 周报
      if (S.time.totalDays > 0 && S.time.totalDays % 7 === 0) {
        generateWeeklyReportV26();
      }
      // 自然衰减
      applyDailyDecayV26();
    } else {
      S.time.period = PERIOD_ORDER_V26[idx + 1];
    }
    // 每时段更新
    updateTimePressureV26();
    checkCountdownsV26();
    checkParallelEventsV26();
    checkRippleFermenV26();
    // SAN自然变化
    const p = TIME_PERIODS_V26[S.time.period];
    if (S.san !== undefined) S.san = Math.max(0, Math.min(100, S.san + p.sanMod));
    // 深渊进度深夜加速
    if (S.time.period === "night" && S.abyssCountdown) {
      S.abyssCountdown.progress = Math.min(100, (S.abyssCountdown.progress || 0) + 0.5);
    }
  }
  // 重置连续计数（新时段）
  S.time.consecutiveCultivate = 0;
  recordDailyLogV26("time_advance", "时间推进到" + TIME_PERIODS_V26[S.time.period].name);
}

function rollWeatherV26() {
  initTimeV26();
  const season = S.time.season;
  const r = Math.random();
  let weather = "clear";
  if (season === "spring") {
    if (r < 0.4) weather = "clear";
    else if (r < 0.65) weather = "cloudy";
    else if (r < 0.85) weather = "rain";
    else weather = "fog";
  } else if (season === "summer") {
    if (r < 0.45) weather = "clear";
    else if (r < 0.6) weather = "cloudy";
    else if (r < 0.75) weather = "rain";
    else if (r < 0.9) weather = "heatwave";
    else weather = "storm";
  } else if (season === "autumn") {
    if (r < 0.35) weather = "clear";
    else if (r < 0.6) weather = "cloudy";
    else if (r < 0.8) weather = "rain";
    else weather = "fog";
  } else {
    if (r < 0.25) weather = "clear";
    else if (r < 0.45) weather = "cloudy";
    else if (r < 0.7) weather = "snow";
    else if (r < 0.85) weather = "fog";
    else weather = "storm";
  }
  // 深渊进度高时血雨概率
  if (S.abyssCountdown && S.abyssCountdown.progress > 80 && Math.random() < 0.15) {
    weather = "bloodrain";
  }
  S.time.weather = weather;
}

function getPeriodBonusV26(skillType) {
  initTimeV26();
  const p = TIME_PERIODS_V26[S.time.period];
  const bonus = p.cultivateBonus[skillType] || p.cultivateBonus.default || 0;
  return bonus;
}

function isPeriodV26(period) {
  initTimeV26();
  return S.time.period === period;
}

function updateTimePressureV26() {
  initTimeV26();
  let pressure = 0;
  if (S.worldTimers) {
    for (const t of S.worldTimers) {
      if (t.daysLeft <= 3) pressure += 20;
      else if (t.daysLeft <= 10) pressure += 10;
      else if (t.daysLeft <= 30) pressure += 5;
    }
  }
  if (S.abyssCountdown) {
    const ap = S.abyssCountdown.progress || 0;
    if (ap > 80) pressure += 20;
    else if (ap > 60) pressure += 10;
    else if (ap > 40) pressure += 5;
  }
  if (S.time.timePressure !== pressure) {
    S.time.timePressure = Math.min(100, pressure);
  }
}

function recordDailyLogV26(type, description) {
  initTimeV26();
  const today = S.time.totalDays;
  let todayLog = S.time.dailyLog.find(l => l.day === today);
  if (!todayLog) {
    todayLog = {day:today, period:S.time.period, actions:[], events:[], parallelEvents:[], mood:"neutral"};
    S.time.dailyLog.push(todayLog);
  }
  if (type === "action") todayLog.actions.push(description);
  else if (type === "event") todayLog.events.push(description);
  else if (type === "parallel") todayLog.parallelEvents.push(description);
  todayLog.period = S.time.period;
}

function addParallelEventV26(event) {
  initTimeV26();
  event.dayHappened = S.time.totalDays;
  event.revealed = false;
  event.revealDay = S.time.totalDays + (event.revealDelay || 1);
  S.parallelEvents.push(event);
}

function checkParallelEventsV26() {
  initTimeV26();
  const ready = [];
  for (const e of S.parallelEvents) {
    if (!e.revealed && S.time.totalDays >= e.revealDay) {
      e.revealed = true;
      ready.push(e);
      recordDailyLogV26("parallel", e.description);
    }
  }
  return ready;
}

function checkRippleFermenV26() {
  // 检查因果种子是否到了发酵期（简化版，与v25涟漪系统联动）
  if (!S.ripples || !S.ripples.seedsPlanted) return [];
  const sprouted = [];
  for (const seed of S.ripples.seedsPlanted) {
    if (!seed.sprouted && S.time.totalDays >= seed.sproutDay) {
      seed.sprouted = true;
      sprouted.push(seed);
    }
  }
  return sprouted;
}

function applyDailyDecayV26() {
  // 声望自然衰减
  if (S.factionRep) {
    for (const f in S.factionRep) {
      if (S.time.totalDays > 0 && S.time.totalDays % 30 === 0) {
        S.factionRep[f] = Math.max(-100, S.factionRep[f] - 2);
      }
    }
  }
  // 通缉热度下降
  if (S.wanted && S.wanted.level > 0 && S.time.totalDays % 7 === 0) {
    S.wanted.level = Math.max(0, S.wanted.level - 1);
  }
  // 疲劳
  if (S.time.daysSinceSleep >= 2) {
    S.fatigue.level = Math.min(100, S.fatigue.level + 10);
  }
}

function generateWeeklyReportV26() {
  initTimeV26();
  const week = Math.floor(S.time.totalDays / 7) + 1;
  const report = {
    week: week,
    summary: "第" + week + "周结束。你在艾尔达大陆又度过了七天。",
    trends: {
      prices: Math.random() > 0.5 ? "up" : "stable",
      security: Math.random() > 0.5 ? "stable" : "down",
      reputation: "stable"
    },
    majorEvents: [],
    npcChanges: []
  };
  // 从日记中提取重大事件
  const recentLogs = S.time.dailyLog.filter(l => l.day >= S.time.totalDays - 7);
  for (const log of recentLogs) {
    for (const e of log.events) report.majorEvents.push(e);
  }
  S.time.weeklyReport.push(report);
}

function generateMonthlyReviewV26() {
  initTimeV26();
  const review = {
    month: S.time.month,
    chapterTitle: "第" + S.time.year + "年" + SEASONS_V26[S.time.season].name + "月",
    narrative: "这个月，世界在你身边静静流淌。你做了一些选择，见了一些人，错过了一些事。",
    growth: {exp:0, skills:0, relations:0},
    worldState: "stable",
    foreshadowing: []
  };
  S.time.monthlyReview.push(review);
}

function checkCountdownsV26() {
  initTimeV26();
  if (!S.worldTimers) return [];
  const triggered = [];
  for (const t of S.worldTimers) {
    if (t.daysLeft !== undefined) {
      t.daysLeft--;
      if (t.daysLeft <= 0 && !t.triggered) {
        t.triggered = true;
        triggered.push(t);
        if (t.consequence) t.consequence();
      }
    }
  }
  return triggered;
}

function refreshShopsV26() {
  // 每天清晨刷新商店库存（简化）
  if (!S.shopStates) S.shopStates = {};
}

// 暴露全局别名（引擎choose()中调用）
var initTime = initTimeV26;
var advanceTime = advanceTimeV26;
var getTimeString = getTimeStringV26;

// ============================================================
// v26 时段过渡节点
// ============================================================
N["time_morning_arrival"] = function(){
  initTimeV26();
  return {
    place: "清晨",
    text: function(){
      const arr = [];
      const w = WEATHER_TABLE_V26[S.time.weather];
      arr.push("雾气还没散。");
      arr.push("");
      if (S.time.weather === "clear") {
        arr.push("晨光从东边的天际线漫过来，把屋檐染成暖金色。炊烟从家家户户的烟囱里升起，混着面包和粥的香气。");
      } else if (S.time.weather === "rain") {
        arr.push("雨下了一整夜，到清晨也没停。屋檐滴水，石板路泛着冷光，行人都缩着脖子赶路。");
      } else if (S.time.weather === "snow") {
        arr.push("雪积了半尺厚。世界是白的，安静得像被捂住了嘴。呼吸成雾，每一步都咯吱作响。");
      } else if (S.time.weather === "fog") {
        arr.push("浓雾把整个城市吞了。三步之外看不见人，只能听到脚步声、车轮声、还有不知从哪传来的钟声。");
      } else {
        arr.push("新的一天开始了。");
      }
      arr.push("");
      arr.push("集市正在开张，摊主们支起棚子，摆出新鲜的货物。清晨的东西最新鲜，价格也最公道。");
      arr.push("");
      // 时间压力提示
      if (S.time.timePressure > 60) {
        arr.push("你心里有一种隐隐的不安——有些事情，正在逼近。");
      }
      // 并行事件提示
      const recentParallel = S.parallelEvents.filter(e => e.revealed && e.dayHappened >= S.time.totalDays - 1);
      if (recentParallel.length > 0) {
        arr.push("你听说——" + recentParallel[0].description);
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options: [
      { t:"开始今天的行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["time_noon_arrival"] = function(){
  initTimeV26();
  return {
    place: "正午",
    text: function(){
      const arr = [];
      arr.push("太阳升到了最高处。");
      arr.push("");
      if (S.time.weather === "clear" || S.time.weather === "heatwave") {
        arr.push("阳光白得刺眼，热浪从石板路上蒸腾起来。集市最热闹的时候，人声鼎沸，讨价还价声混在一起。");
      } else if (S.time.weather === "rain") {
        arr.push("雨小了些，但没停。人们挤在屋檐下躲雨，商贩卖力地吆喝，想在收摊前多卖一点。");
      } else {
        arr.push("正午是一天中最繁忙的时候。每个人都在赶路，每个人都有目的地。");
      }
      arr.push("");
      arr.push("正午的物价最高——需求最旺。但也是信息最多的时候，酒馆里坐满了人，消息在酒杯之间流转。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options: [
      { t:"继续行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["time_dusk_arrival"] = function(){
  initTimeV26();
  return {
    place: "黄昏",
    text: function(){
      const arr = [];
      arr.push("太阳沉下去了。");
      arr.push("");
      arr.push("影子被拉得很长，长到像另一个世界。归人匆匆，脚步比清晨快了几分——家里有热饭，或者有等待的人。");
      arr.push("");
      arr.push("集市在收摊。摊主们甩卖剩下的货物——黄昏的东西最便宜，但也最不新鲜。");
      arr.push("");
      arr.push("黄昏是秘密的时刻。白天不方便说的话，在暮色的掩护下，可以说了。白天不方便见的人，在拉长的影子里，可以见了。");
      arr.push("");
      if (S.san < 50) {
        arr.push("你觉得有些冷。不是天气的冷，是从骨头里渗出来的那种。黄昏的影子里，好像有什么东西在看你。");
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("黄昏已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options: [
      { t:"继续行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["time_night_arrival"] = function(){
  initTimeV26();
  return {
    place: "深夜",
    text: function(){
      const arr = [];
      arr.push("世界沉入了黑暗。");
      arr.push("");
      arr.push("灯火是唯一的温暖——也是最危险的诱惑。每一扇亮着的窗后面，都有一个故事。每一扇黑着的窗后面，可能也有。");
      arr.push("");
      arr.push("集市关了，大多数商店关了。但酒馆还亮着，黑市刚刚开张，暗蚀会在行动，守望者在巡逻，审判骑士在搜查。");
      arr.push("");
      arr.push("深夜是灵魂法师的时刻——灵魂魔法在深夜最强。深夜也是深渊的时刻——深渊进度在深夜加速。深夜是秘密的时刻——所有见不得光的事，都在这个时候发生。");
      arr.push("");
      if (S.san < 40) {
        arr.push("你听到了一些声音。不是耳朵听到的，是从脑子里冒出来的。低语，呢喃，还有一个名字——你的名字。");
        arr.push("你不确定这是幻觉，还是……别的什么。");
      } else {
        arr.push("夜很深了。你应该休息——不睡觉的话，明天会很疲惫。");
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("深夜的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options: [
      { t:"继续行动（深夜有风险）", go:"fc_jiaohui_entry", effect:{san:-2} },
      { t:"找地方休息", go:"sleep_normal", effect:{} }
    ]
  };
};

// ============================================================
// v26 时间系统总览节点
// ============================================================
N["time_system_overview"] = function(){
  initTimeV26();
  return {
    place: "时间系统",
    text: function(){
      const arr = [];
      arr.push("【时间系统总览】");
      arr.push("");
      arr.push(getTimeStringV26());
      arr.push("");
      arr.push("时间压力：" + S.time.timePressure + "/100");
      if (S.time.timePressure < 30) arr.push("（平静——世界正常运转）");
      else if (S.time.timePressure < 60) arr.push("（紧张——物价/NPC/事件开始异变）");
      else if (S.time.timePressure < 80) arr.push("（危急——多个倒计时同时临界）");
      else arr.push("（失控——战争/深渊/天灾全面爆发）");
      arr.push("");
      arr.push("疲劳度：" + (S.fatigue ? S.fatigue.level : 0) + "/100");
      arr.push("连续未眠：" + S.time.daysSinceSleep + "天");
      arr.push("");
      arr.push("【倒计时】");
      if (S.worldTimers && S.worldTimers.length > 0) {
        for (const t of S.worldTimers) {
          if (!t.triggered) {
            const color = t.daysLeft <= 3 ? "🔴" : t.daysLeft <= 10 ? "🟡" : "⚪";
            arr.push(color + " " + t.name + "：还有" + t.daysLeft + "天");
          }
        }
      } else {
        arr.push("（暂无活跃倒计时）");
      }
      arr.push("");
      arr.push("【日记】已记录" + S.time.dailyLog.length + "天");
      arr.push("【周报】已生成" + S.time.weeklyReport.length + "份");
      arr.push("【月度回顾】已生成" + S.time.monthlyReview.length + "份");
      arr.push("");
      arr.push("时间是这个世界最公平的东西——每个人每天都只有四个时段。");
      arr.push("你怎么花它，决定了你成为什么样的人。");
      return arr;
    },
    options: [
      { t:"查看日记", go:"time_diary_view", effect:{} },
      { t:"查看日历", go:"time_calendar_view", effect:{} },
      { t:"返回", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["time_diary_view"] = function(){
  initTimeV26();
  return {
    place: "日记",
    text: function(){
      const arr = [];
      arr.push("【你的日记】");
      arr.push("");
      const recent = S.time.dailyLog.slice(-7).reverse();
      if (recent.length === 0) {
        arr.push("日记本是空的。你还没有开始记录你的旅程。");
      } else {
        for (const log of recent) {
          arr.push("——第" + log.day + "天 " + TIME_PERIODS_V26[log.period].name + "——");
          if (log.actions.length > 0) {
            arr.push("做了：");
            for (const a of log.actions) arr.push("  · " + a);
          }
          if (log.events.length > 0) {
            arr.push("发生了：");
            for (const e of log.events) arr.push("  · " + e);
          }
          if (log.parallelEvents.length > 0) {
            arr.push("听说：");
            for (const p of log.parallelEvents) arr.push("  · " + p);
          }
          arr.push("");
        }
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};

console.log("[v26 ay] 时间核心引擎已加载：时段定义/行动消耗/天气系统/引擎函数/时段过渡节点");


// ============================================================
// v26 NPC日程数据
// ============================================================
const NPC_SCHEDULES_V26 = {
  mercury: {
    name:"墨丘利",
    morning:{location:"办公室", activity:"批改论文", accessible:true},
    noon:{location:"教室", activity:"上灵魂魔法课", accessible:"仅上课时"},
    dusk:{location:"图书馆禁书区", activity:"阅读古代文献", accessible:false},
    night:{location:"未知", activity:"???", accessible:"需要调查"}
  },
  aurelian: {
    name:"奥雷利安",
    morning:{location:"守望者据点", activity:"冥想", accessible:false},
    noon:{location:"守望者据点", activity:"接待访客", accessible:true},
    dusk:{location:"城市中", activity:"微服私访", accessible:"需要高CHA"},
    night:{location:"未知", activity:"守望者夜间任务", accessible:false}
  },
  classmate_01: {
    name:"塞西莉亚",
    morning:{location:"教室", activity:"上课", accessible:true},
    noon:{location:"食堂", activity:"吃饭", accessible:true},
    dusk:{location:"图书馆", activity:"自习", accessible:true},
    night:{location:"宿舍", activity:"休息", accessible:false}
  },
  classmate_02: {
    name:"马库斯",
    morning:{location:"训练场", activity:"晨练", accessible:true},
    noon:{location:"食堂", activity:"吃饭", accessible:true},
    dusk:{location:"酒馆", activity:"喝酒", accessible:true},
    night:{location:"未知", activity:"???", accessible:"需要调查"}
  },
  vendor_old_zhang: {
    name:"老张（小贩）",
    morning:{location:"集市", activity:"摆摊", accessible:true},
    noon:{location:"集市", activity:"摆摊", accessible:true},
    dusk:{location:"集市", activity:"收摊甩卖", accessible:true},
    night:{location:"家", activity:"休息", accessible:false}
  },
  tavern_keeper: {
    name:"酒馆老板",
    morning:{location:"酒馆", activity:"准备", accessible:"仅喝酒"},
    noon:{location:"酒馆", activity:"营业", accessible:true},
    dusk:{location:"酒馆", activity:"营业最忙", accessible:true},
    night:{location:"酒馆", activity:"深夜营业", accessible:true}
  }
};

// ============================================================
// v26 商店时间数据
// ============================================================
const SHOPS_V26 = {
  market: {name:"集市", open:"morning", close:"dusk", restDay:7,
    priceMod:{morning:1.0, noon:1.1, dusk:0.85, night:0},
    desc:"清晨开市，黄昏收摊，周日休息"},
  tavern: {name:"酒馆", open:"noon", close:"night_end", restDay:null,
    priceMod:{morning:0, noon:1.0, dusk:1.0, night:1.2},
    desc:"正午开门，深夜最热闹"},
  church: {name:"教堂", open:"morning", close:"dusk", restDay:null,
    priceMod:{morning:1.0, noon:1.0, dusk:0.8, night:0},
    desc:"清晨礼拜，黄昏关门，周日清晨有大礼拜"},
  black_market: {name:"黑市", open:"night", close:"morning", restDay:null,
    priceMod:{morning:0, noon:0, dusk:0, night:1.5},
    desc:"仅深夜开放，地点隐秘，物价高但能买到违禁品", hidden:true},
  potion_shop: {name:"药剂店", open:"morning", close:"dusk", restDay:3,
    priceMod:{morning:1.0, noon:1.0, dusk:0.9, night:0},
    desc:"清晨开门，周三休息"},
  academy_store: {name:"学院商店", open:"morning", close:"noon", restDay:7,
    priceMod:{morning:0.9, noon:1.0, dusk:0, night:0},
    desc:"仅上午营业，周日休息，学生九折"}
};

// ============================================================
// v26 世界事件倒计时数据
// ============================================================
const WORLD_TIMERS_TEMPLATE_V26 = [
  {id:"purification_decree", name:"净化令升级", daysLeft:30,
    phase1:"平静——偶尔有传闻",
    phase2:"紧张——灵魂物品涨价，审判骑士巡逻增加",
    phase3:"临界——灵魂法师开始躲藏，深夜有搜查队",
    consequence:"净化令全面升级，灵魂魔法被列为异端"},
  {id:"trade_route_crisis", name:"银穗商路危机", daysLeft:45,
    phase1:"平静——商队略有减少",
    phase2:"紧张——物价开始上涨，商人焦虑",
    phase3:"临界——商路断绝，物资短缺",
    consequence:"银穗商路彻底断绝，全局物价+50%"},
  {id:"seal_2_ceremony", name:"第二印萨满仪式", daysLeft:60,
    phase1:"平静——萨满在准备",
    phase2:"紧张——兽人草原开始动荡",
    phase3:"临界——萨满仪式即将开始",
    consequence:"错过则第二印破碎，深渊进度+15"}
];

// ============================================================
// v26 等待系统函数
// ============================================================
function waitPeriodV26(periods) {
  initTimeV26();
  const observations = [];
  for (let i = 0; i < periods; i++) {
    // 等待时的观察
    const obs = generateWaitObservationV26();
    observations.push(obs);
    advanceTimeV26(1);
    // 可能被事件打断
    if (Math.random() < 0.15) {
      observations.push("【被打断】有人来找你了，或者发生了什么事。");
      break;
    }
  }
  return observations;
}

function generateWaitObservationV26() {
  initTimeV26();
  const period = S.time.period;
  const observations = {
    morning: [
      "你看着窗外的天色一点点亮起来。一个卖花的女孩从楼下走过，篮子里的花还带着露水。",
      "远处传来教堂的钟声。你数了数——六下，清晨六点。新的一天开始了。",
      "你听到隔壁房间的动静——有人早起了，在烧水，在咳嗽，在叹气。",
      "雾气从地面升起来，把远处的屋顶藏了一半。你觉得这个城市像一个还没睡醒的人。"
    ],
    noon: [
      "阳光从窗户照进来，在地板上画出一个明亮的方块。灰尘在光柱里慢慢浮动。",
      "街上的人声最响的时候。叫卖声、马蹄声、孩子的哭声、还有一个歌手在跑调地唱黄林晶的歌。",
      "你闻到了面包的香味——楼下的面包房在烤下午的面包。你的肚子叫了一声。",
      "一个商人急匆匆地从楼下跑过，脸色发白，手里攥着一封信。你不知道信里写了什么。"
    ],
    dusk: [
      "影子被拉得很长。你看着自己的影子从墙的这一头爬到那一头，像一个缓慢的陌生人。",
      "归人匆匆。每个人都在往某个地方赶——家里有热饭，或者有等待的人，或者什么都没有但还是要回去。",
      "远处的屋顶升起了炊烟。你突然想起了很久很久以前的某个黄昏——那时候你还小，世界还很大。",
      "一个老人坐在街角，看着来来往往的人，什么也不做。你不知道他在等谁，或者他已经不再等了。"
    ],
    night: [
      "城市安静下来了。只有远处的狗叫，和更远处的、你不确定是不是幻听的低语。",
      "一盏灯灭了。又一盏灯灭了。城市像一个正在闭上眼睛的人。",
      "你听到了一些声音。不是耳朵听到的，是从脑子里冒出来的。你不确定这是因为深夜，还是因为别的。",
      "月光从窗户照进来，在地板上铺了一条银白色的路。你不知道这条路通向哪里。"
    ]
  };
  const pool = observations[period] || observations.morning;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================
// v26 并行事件生成
// ============================================================
function generateParallelEventsV26(count) {
  const templates = [
    {description:"塞西莉亚在图书馆待到很晚，她在查一些关于七印的资料。", npc:"塞西莉亚", type:"npc_action"},
    {description:"马库斯在酒馆和人打了一架，据说因为有人侮辱了他的家族。", npc:"马库斯", type:"npc_action"},
    {description:"教会的审判骑士在城里搜查了一个灵魂法师的住处。", npc:"审判骑士", type:"world_event"},
    {description:"一个商队从南方回来了，带回来的货物比预期少了一半——商路越来越不安全。", npc:"商队", type:"economy"},
    {description:"墨丘利深夜离开了学院，没人知道他去了哪里。", npc:"墨丘利", type:"npc_action"},
    {description:"城里的物价又涨了。面包比上个月贵了两成。", npc:"", type:"economy"},
    {description:"一个陌生人在打听你的消息。他自称是商人，但你觉得不像。", npc:"陌生人", type:"mystery"},
    {description:"兽人草原传来消息——部落之间又起了冲突。", npc:"兽人", type:"world_event"},
    {description:"学院里有个学生失踪了。官方说是休学，但有人说看到他被审判骑士带走了。", npc:"失踪学生", type:"world_event"},
    {description:"你之前帮过的那个小贩，今天在集市上多摆了一个摊子——他说生意好了。", npc:"老张", type:"karma_positive"}
  ];
  const events = [];
  for (let i = 0; i < count; i++) {
    const t = templates[Math.floor(Math.random() * templates.length)];
    addParallelEventV26({
      id: "parallel_" + Date.now() + "_" + i,
      description: t.description,
      npcInvolved: t.npc,
      type: t.type,
      revealDelay: 1 + Math.floor(Math.random() * 3)
    });
    events.push(t.description);
  }
  return events;
}

// ============================================================
// v26 等待节点
// ============================================================
N["wait_1period"] = function(){
  const obs = waitPeriodV26(1);
  return {
    place: "等待",
    text: function(){
      const arr = [];
      arr.push("你决定等一等。");
      arr.push("");
      for (const o of obs) {
        arr.push(o);
        arr.push("");
      }
      arr.push("时间过去了。世界没有因为你在等待而停下来。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("离开等待时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["wait_1day"] = function(){
  // 等待一天，生成并行事件
  const parallel = generateParallelEventsV26(1 + Math.floor(Math.random() * 2));
  const obs = waitPeriodV26(4); // 4时段=1天
  return {
    place: "等待了一天",
    text: function(){
      const arr = [];
      arr.push("一天过去了。");
      arr.push("");
      arr.push("你看着太阳升起又落下，看着月亮爬上来又沉下去。");
      arr.push("");
      for (const o of obs.slice(0, 2)) {
        arr.push(o);
        arr.push("");
      }
      arr.push("【这一天里，世界发生了什么】");
      for (const p of parallel) {
        arr.push("· " + p);
      }
      arr.push("");
      arr.push("你不在场的时候，世界没有等你。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("出了等待了一天，风迎面扑来。你认了认方向，启程。");
      return arr;
    },
    options: [
      { t:"继续", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

N["wait_until_night"] = function(){
  initTimeV26();
  let periods = 0;
  const order = PERIOD_ORDER_V26;
  let idx = order.indexOf(S.time.period);
  while (order[idx] !== "night") {
    idx = (idx + 1) % 4;
    periods++;
  }
  if (periods === 0) periods = 4; // 已经是深夜，等到明天深夜
  const obs = waitPeriodV26(periods);
  return {
    place: "等到深夜",
    text: function(){
      const arr = [];
      arr.push("你决定等到深夜。");
      arr.push("");
      arr.push("白天的时间在等待中流逝。你看着人来人往，看着日影西斜，看着灯火一盏盏亮起来。");
      arr.push("");
      for (const o of obs.slice(0, 2)) {
        arr.push(o);
        arr.push("");
      }
      arr.push("终于，世界沉入了黑暗。");
      arr.push("深夜是秘密的时刻。你想找的人，可能在这个时候出现。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("你与等到深夜作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options: [
      { t:"开始深夜的行动", go:"fc_jiaohui_entry", effect:{} }
    ]
  };
};

// ============================================================
// v26 睡觉节点
// ============================================================
N["sleep_normal"] = function(){
  initTimeV26();
  S.time.daysSinceSleep = 0;
  S.fatigue.level = Math.max(0, (S.fatigue.level || 0) - 30);
  // 睡觉推进到清晨
  let periods = 0;
  const order = PERIOD_ORDER_V26;
  let idx = order.indexOf(S.time.period);
  while (order[idx] !== "morning") {
    idx = (idx + 1) % 4;
    periods++;
  }
  if (periods === 0) periods = 4;
  advanceTimeV26(periods);
  // 睡觉可能做梦
  const dreams = [
    "你做了一个梦。梦里有一片海，黑色的海，海浪里有声音在叫你的名字。你醒过来的时候，还记得那个声音，但不记得它说了什么。",
    "你睡得很沉。没有梦。醒来的时候，阳光已经照到了枕头边。",
    "你梦到了小时候的事。那时候你还不知道这个世界有多大，也不知道它有多危险。你醒过来的时候，眼角是湿的。",
    "你做了一个奇怪的梦——你站在第七印的神殿前，原初之物看着你，它没有攻击你，只是在哭。你醒过来的时候，SAN值下降了。"
  ];
  const dream = dreams[Math.floor(Math.random() * dreams.length)];
  return {
    place: "休息",
    text: function(){
      const arr = [];
      arr.push("你找了个地方休息。");
      arr.push("");
      arr.push(dream);
      arr.push("");
      arr.push("你感觉精神好了一些。疲劳度下降了。");
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      arr.push("你收拾停当，离开休息，沿着来路踏上行程。");
      return arr;
    },
    options: [
      { t:"开始新的一天", go:"time_morning_arrival", effect:{} }
    ]
  };
};

// ============================================================
// v26 NPC日程节点
// ============================================================
/* /v62inj:chunk-npc/ N["npc_schedule_view"] 已移入 chunks/v62_npc.js */
/* /v62inj:chunk-npc/ N["npc_track"] 已移入 chunks/v62_npc.js */
// ============================================================
// v26 商店时间节点
// ============================================================
N["shop_status_view"] = function(){
  initTimeV26();
  return {
    place: "商店状态",
    text: function(){
      const arr = [];
      arr.push("【当前商店状态】");
      arr.push("");
      arr.push("当前时段：" + TIME_PERIODS_V26[S.time.period].name);
      arr.push("");
      for (const id in SHOPS_V26) {
        const shop = SHOPS_V26[id];
        const isOpen = isShopOpenV26(id);
        const priceMod = shop.priceMod[S.time.period] || 0;
        const status = isOpen ? "🟢 营业中" : "🔴 已关门";
        const price = priceMod > 0 ? "（物价×" + priceMod + "）" : "";
        arr.push(status + " " + shop.name + " " + price);
        arr.push("  " + shop.desc);
        arr.push("");
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};

function isShopOpenV26(shopId) {
  initTimeV26();
  const shop = SHOPS_V26[shopId];
  if (!shop) return false;
  if (shop.restDay && S.time.dayOfWeek === shop.restDay) return false;
  const period = S.time.period;
  return (shop.priceMod[period] || 0) > 0;
}

// ============================================================
// v26 日历面板节点
// ============================================================
N["time_calendar_view"] = function(){
  initTimeV26();
  return {
    place: "日历",
    text: function(){
      const arr = [];
      arr.push("【艾尔达历】");
      arr.push("");
      arr.push("第" + S.time.year + "年 " + SEASONS_V26[S.time.season].name + " " + S.time.month + "月");
      arr.push("今天：" + S.time.day + "日 星期" + S.time.dayOfWeek);
      arr.push("");
      // 简易月历
      arr.push("日 一 二 三 四 五 六");
      let weekStart = 1;
      for (let w = 0; w < 5; w++) {
        let line = "";
        for (let d = 0; d < 7; d++) {
          const dayNum = w * 7 + d + 1 - (weekStart - 1);
          if (dayNum < 1 || dayNum > 30) {
            line += "   ";
          } else if (dayNum === S.time.day) {
            line += "[" + (dayNum < 10 ? "0" + dayNum : dayNum) + "]";
          } else {
            line += (dayNum < 10 ? " " + dayNum : dayNum) + " ";
          }
        }
        arr.push(line);
      }
      arr.push("");
      arr.push("【本月倒计时】");
      if (S.worldTimers && S.worldTimers.length > 0) {
        for (const t of S.worldTimers) {
          if (!t.triggered) {
            const phase = t.daysLeft <= 3 ? "🔴临界" : t.daysLeft <= 10 ? "🟡紧张" : "⚪平静";
            arr.push(phase + " " + t.name + "：还有" + t.daysLeft + "天");
          }
        }
      } else {
        arr.push("（暂无）");
      }
      arr.push("");
      arr.push("【本周趋势】");
      if (S.time.weeklyReport.length > 0) {
        const latest = S.time.weeklyReport[S.time.weeklyReport.length - 1];
        arr.push("物价：" + latest.trends.prices + " / 治安：" + latest.trends.security);
      } else {
        arr.push("（第一周还没结束）");
      }
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};

// ============================================================
// v26 渐变倒计时节点
// ============================================================
N["countdown_purification_view"] = function(){
  initTimeV26();
  const timer = S.worldTimers ? S.worldTimers.find(t => t.id === "purification_decree") : null;
  return {
    place: "净化令倒计时",
    text: function(){
      const arr = [];
      if (!timer) {
        arr.push("净化令的消息还没有传到这里。");
        return arr;
      }
      arr.push("【净化令升级倒计时】");
      arr.push("");
      arr.push("还有" + timer.daysLeft + "天。");
      arr.push("");
      if (timer.daysLeft > 10) {
        arr.push("⚪ 平静期");
        arr.push(timer.phase1);
        arr.push("");
        arr.push("城里偶尔有人谈论净化令，但大多数人觉得那是遥远的事。灵魂法师们照常上课，商人们照常做生意。");
      } else if (timer.daysLeft > 3) {
        arr.push("🟡 紧张期");
        arr.push(timer.phase2);
        arr.push("");
        arr.push("你注意到了变化——灵魂类物品的价格涨了两成。审判骑士在街上巡逻的次数多了。墨丘利教授最近总是皱眉。");
        arr.push("有同学开始私下讨论：「净化令真的会升级吗？」「灵魂魔法不会被列为异端吧？」");
      } else {
        arr.push("🔴 临界期");
        arr.push(timer.phase3);
        arr.push("");
        arr.push("大限将至。");
        arr.push("你看到一个灵魂法师在深夜偷偷收拾行李。审判骑士在挨家挨户搜查。物价暴涨——灵魂类物品贵了五成。");
        arr.push("墨丘利教授「请假」了。没人知道他去了哪里。");
        arr.push("你必须做出选择——是帮助灵魂法师们躲藏，还是站在教会一边，还是趁乱做些什么？");
      }
      arr.push("");
      arr.push("（倒计时归零后，净化令将全面升级。你在不同阶段介入，有不同的应对机会。）");
      return arr;
    },
    options: [
      { t:"我知道了", go:"time_system_overview", effect:{} }
    ]
  };
};

// ============================================================
// v26 并行事件回收节点
// ============================================================
N["parallel_events_review"] = function(){
  initTimeV26();
  const revealed = S.parallelEvents ? S.parallelEvents.filter(e => e.revealed) : [];
  return {
    place: "并行事件",
    text: function(){
      const arr = [];
      arr.push("【你不在场时发生的事】");
      arr.push("");
      if (revealed.length === 0) {
        arr.push("你还没有听说什么。也许是因为你没有离开太久，也许是因为世界还很平静。");
      } else {
        for (const e of revealed.slice(-10)) {
          arr.push("第" + e.dayHappened + "天：" + e.description);
        }
      }
      arr.push("");
      arr.push("世界不会因为你在修炼就停下来等你。");
      arr.push("你不在的时候，有人在做选择，有人在犯错，有人在死去。");
      arr.push("而这些，都会在之后的某一天，以某种方式，回到你面前。");
      return arr;
    },
    options: [
      { t:"返回", go:"time_system_overview", effect:{} }
    ]
  };
};

function initWorldTimersV26() {
  initTimeV26();
  if (!S.worldTimers || S.worldTimers.length === 0) {
    S.worldTimers = JSON.parse(JSON.stringify(WORLD_TIMERS_TEMPLATE_V26));
  }
}

console.log("[v26 az] 等待系统+并行事件+倒计时+NPC日程+商店时间+日历面板已加载");


// ============================================================
// v27 伏笔系统数据
// ============================================================
const FORESHADOWING_V27 = {
  hlj_letter: {name:"黄林晶的信", plant:"沙漠出身直接获得/其他出身捡到残页", stage:0, revealed:false},
  watcher_spy: {name:"守望者密探", plant:"序章中被人注视", stage:0, revealed:false},
  eclipse_outer: {name:"暗蚀会外围", plant:"序章中遇到的小混混", stage:0, revealed:false},
  seal_omen: {name:"七印征兆", plant:"异常天气/梦境/幻觉", stage:0, revealed:false},
  classmate_seed: {name:"同学的种子", plant:"序章中遇到的同龄人", stage:0, revealed:false},
  karma_seed: {name:"因果种子", plant:"序章中小选择", stage:0, revealed:false},
  primordial_whisper: {name:"原初之物的低语", plant:"偶尔听到的声音", stage:0, revealed:false},
  origin_clue: {name:"身世线索", plant:"母亲旧物/陌生人注视", stage:0, revealed:false},
  prophecy_fragment: {name:"预言碎片", plant:"听到的预言（因出身而异）", stage:0, revealed:false},
  seal1_fragment: {name:"第一印碎块", plant:"无意识接触碎片", stage:0, revealed:false},
  time_anomaly: {name:"时间异常", plant:"似曾相识的瞬间", stage:0, revealed:false},
  abyss_mark: {name:"深渊标记", plant:"事件后身上的印记", stage:0, revealed:false},
  npc_lie: {name:"NPC的谎言", plant:"好心人说的假话", stage:0, revealed:false},
  lost_item: {name:"遗失的物品", plant:"丢了/送了的东西", stage:0, revealed:false},
  unspoken_word: {name:"未说出口的话", plant:"选择不告诉某人的事", stage:0, revealed:false}
}; window.FORESHADOWING_V27 = FORESHADOWING_V27; /* /v60inj:winx2:FORESHADOWING_V27/ */

function initForeshadowingV27(){
  if(!S.foreshadowing){
    S.foreshadowing = {};
    for(const k in FORESHADOWING_V27){
      S.foreshadowing[k] = {planted:false, stage:0, revealed:false};
    }
  }
}

function plantForeshadowV27(id){
  initForeshadowingV27();
  if(S.foreshadowing[id]) S.foreshadowing[id].planted = true;
}

// ============================================================
// v27 出身序章线通用函数
// ============================================================
function startOriginPrologueV27(origin){
  initForeshadowingV27();
  if(!S.originPrologue) S.originPrologue = {origin:origin, choices:[], flags:{}, seeds:[]};
  S.originPrologue.origin = origin;
  // 初始化v26时间系统
  if(typeof initTimeV26 === 'function') initTimeV26();
  // 通用伏笔：守望者密探（所有出身都有）
  plantForeshadowV27('watcher_spy');
  plantForeshadowV27('time_anomaly');
}

function finishOriginPrologueV27(){
  if(!S.flags) S.flags = {};
  S.flags.prologueComplete = true;
  S.flags.origin = S.originPrologue ? S.originPrologue.origin : 'free_city';
  // 汇总伏笔状态
  if(typeof recordDailyLogV26 === 'function') recordDailyLogV26('event','序章结束，前往学院');
}

// ============================================================
// v27 出身线1：自由城邦（交汇城）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_free_city_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_city_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_city_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_city_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_free_city_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线2：北方公国（铁门关）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_northern_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_northern_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_northern_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_northern_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_northern_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线3：南方商业城邦（南方港城）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_southern_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_southern_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_southern_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_southern_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线4：光明教会（圣城）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_church_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_church_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线5：精灵王国（银叶城）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_elf_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_elf_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线6：矮人王国（铁峰堡）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_dwarf_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_dwarf_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线7：兽人草原（兽人王庭）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_orc_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_orc_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线8：东部王国（承天山）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_eastern_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_eastern_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_eastern_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_eastern_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_eastern_3"] 已移入 chunks/v62_origin.js */
// ============================================================
// v27 出身线9：沙漠边境（死亡沙漠边缘）
// ============================================================
/* /v62inj:chunk-origin/ N["origin_desert_1"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_2a"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_2b"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_2c"] 已移入 chunks/v62_origin.js */
/* /v62inj:chunk-origin/ N["origin_desert_3"] 已移入 chunks/v62_origin.js */
console.log("[v27 ba] 9条出身序章线 + 15条伏笔系统已加载");


// ============================================================
// v27 序章时间流数据
// ============================================================
const PROLOGUE_DAILY_EVENTS_V27 = [
  {id:"merchant_help", name:"帮商人搬货", desc:"一个商人请你帮忙搬货，给了几个铜星。", effect:{gold:5, timeCost:"1period"}},
  {id:"street_performer", name:"街头艺人", desc:"一个游吟诗人在街角唱歌，歌词里提到了黄林晶。", effect:{knowledge:1, timeCost:"1period"}},
  {id:"lost_child", name:"迷路的孩子", desc:"一个孩子迷路了，你帮他找到了家。他的母亲很感激。", effect:{relation:"random_npc:+10", karma:1, timeCost:"1period"}},
  {id:"drunk_fight", name:"醉汉打架", desc:"两个醉汉在打架，你可以选择帮忙或躲开。", effect:{timeCost:"1period"}},
  {id:"old_book", name:"旧书摊", desc:"旧书摊上有一本奇怪的书，封面是你不认识的符文。", effect:{knowledge:1, timeCost:"1period"}},
  {id:"church_bell", name:"教堂钟声", desc:"教堂的钟声响了，比平时多响了三下——不知道为什么。", effect:{san:-1, timeCost:"instant"}},
  {id:"stranger_watching", name:"被注视的感觉", desc:"你又有那种被人注视的感觉。回头看，什么都没有。", effect:{san:-2, timeCost:"instant"}},
  {id:"market_news", name:"集市传闻", desc:"集市上有人在说北方的战事——铁门关又失守了。", effect:{knowledge:1, timeCost:"1period"}},
  {id:"rain_storm", name:"突然下雨", desc:"天突然下起了大雨，你躲进了一个屋檐下。", effect:{timeCost:"1period"}},
  {id:"nightmare", name:"噩梦", desc:"你做了一个噩梦——梦里有黑色的海，海里有声音在叫你的名字。", effect:{san:-3, timeCost:"1period"}},
  {id:"letter_arrival", name:"录取通知", desc:"学院的录取通知到了！你必须在7天内出发。", effect:{flag:"admission_letter", timeCost:"instant"}},
  {id:"farewell_friend", name:"朋友告别", desc:"你的一个朋友来和你告别——他也要去远方了。", effect:{relation:"friend:+5", timeCost:"1period"}},
  {id:"packing", name:"收拾行李", desc:"你收拾了行李。母亲给你塞了很多吃的。", effect:{item:"food_pack", timeCost:"1period"}},
  {id:"last_look", name:"最后看一眼", desc:"你在出身地走了最后一圈，把每一个地方都记在心里。", effect:{san:2, timeCost:"1period"}},
  {id:"mysterious_gift", name:"神秘的礼物", desc:"有人在你门口放了一个包裹——没有署名。里面是一块奇怪的石头。", effect:{item:"mysterious_stone", san:-2, timeCost:"instant"}}
];

// ============================================================
// v27 序章时间流枢纽
// ============================================================
N["prologue_hub"] = function(){
  if(typeof initTimeV26 === 'function') initTimeV26();
  if(!S.prologueTime) S.prologueTime = {day:1, period:"morning", deadlineDay:7, eventsTriggered:[], missedEvents:[]};
  return {
    place:"序章·自由活动",
    text:function(){
      const arr=[];
      arr.push("【序章·第" + S.prologueTime.day + "天 " + TIME_PERIODS_V26[S.time.period].name + "】");
      arr.push("");
      arr.push("距离出发还有" + (S.prologueTime.deadlineDay - S.prologueTime.day) + "天。");
      arr.push("");
      arr.push("你可以在这段时间里做很多事——打工赚钱、探索出身地、和朋友告别、或者只是等待。");
      arr.push("");
      arr.push("但记住：时间不会等你。你在做A事的时候，B事可能正在发生。");
      arr.push("");
      if(S.prologueTime.day >= S.prologueTime.deadlineDay){
        arr.push("【出发的日子到了。你必须离开了。】");
      }
      arr.push("");
      arr.push("（" + getTimeStringV26() + "）");
      return arr;
    },
    options:function(){
      const opts=[];
      if(S.prologueTime.day < S.prologueTime.deadlineDay){
        opts.push({t:"打工赚点钱", go:"prologue_work", effect:{timeCost:"1period"}});
        opts.push({t:"探索出身地", go:"prologue_explore", effect:{timeCost:"1period"}});
        opts.push({t:"和朋友/家人告别", go:"prologue_social", effect:{timeCost:"1period"}});
        opts.push({t:"修炼", go:"prologue_cultivate", effect:{timeCost:"1period"}});
        opts.push({t:"等待（观察世界）", go:"wait_1period", effect:{}});
      }
      opts.push({t:"出发前往学院", go:"prologue_departure", effect:{}});
      opts.push({t:"查看时间/日记", go:"time_system_overview", effect:{}});
      return opts;
    }
  };
};

N["prologue_work"] = function(){
  const event = PROLOGUE_DAILY_EVENTS_V27[Math.floor(Math.random()*5)];
  return {
    place:"打工",
    text:function(){
      const arr=[];
      arr.push("你找了份临时工。");
      arr.push("");
      arr.push(event.desc);
      arr.push("");
      arr.push("你赚了几个铜星，身体有点累，但心里踏实。");
      arr.push("");
      arr.push("（时间流逝了一个时段。）");
      arr.push("从打工出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{gold:event.effect.gold||5}}
    ]
  };
};

N["prologue_explore"] = function(){
  const event = PROLOGUE_DAILY_EVENTS_V27[5 + Math.floor(Math.random()*5)];
  return {
    place:"探索",
    text:function(){
      const arr=[];
      arr.push("你在出身地四处走动。");
      arr.push("");
      arr.push(event.desc);
      arr.push("");
      if(event.id === "stranger_watching"){
        plantForeshadowV27('watcher_spy');
        arr.push("（你越来越确定，有人在跟踪你。但你找不到他。）");
      }
      arr.push("");
      arr.push("（时间流逝了一个时段。）");
      arr.push("别过探索，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:event.effect}
    ]
  };
};

N["prologue_social"] = function(){
  return {
    place:"告别",
    text:function(){
      const arr=[];
      arr.push("你和家人/朋友度过了一个时段。");
      arr.push("");
      arr.push("你们说了很多话——关于过去，关于未来，关于那些没说出口的事。");
      arr.push("");
      arr.push("你母亲给你塞了很多吃的。你父亲什么都没说，只是拍了拍你的肩膀。");
      arr.push("");
      plantForeshadowV27('unspoken_word');
      arr.push("（有很多话，你最终还是没有说出口。也许以后会有机会。也许不会。）");
      arr.push("");
      arr.push("（时间流逝了一个时段。）");
      arr.push("你收拾停当，离开告别，沿着来路踏上行程。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{relation:"family:+15", san:3}}
    ]
  };
};

N["prologue_cultivate"] = function(){
  const bonus = typeof getPeriodBonusV26 === 'function' ? getPeriodBonusV26('default') : 0;
  return {
    place:"修炼",
    text:function(){
      const arr=[];
      arr.push("你找了个安静的地方修炼。");
      arr.push("");
      arr.push("呼吸，吐纳，感受天地间的灵气流入体内。");
      arr.push("");
      if(bonus > 0){
        arr.push("（当前时段有修炼加成+" + bonus + "%，效率更高。）");
      }
      arr.push("");
      arr.push("你感觉修为有了一丝进步。");
      arr.push("");
      arr.push("（时间流逝了一个时段。）");
      arr.push("你最后回望一眼修炼，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{exp:10+bonus}}
    ]
  };
};

// ============================================================
// v27 出发与旅程选择
// ============================================================
N["prologue_departure"] = function(){
  finishOriginPrologueV27();
  return {
    place:"出发",
    text:function(){
      const arr=[];
      arr.push("出发的日子到了。");
      arr.push("");
      arr.push("你背着包袱，站在出身地的出口。家人和朋友来送你——有些人在哭，有些人在笑，有些人什么都没说，只是挥了挥手。");
      arr.push("");
      arr.push("你回头看了最后一眼。");
      arr.push("");
      arr.push("然后你转身，走向了远方。");
      arr.push("");
      arr.push("学院在交汇城方向。从出身地到学院，有几种走法——");
      arr.push("");
      plantForeshadowV27('lost_item');
      arr.push("（你走的时候，有一样东西落在了家里。你不知道是什么，也不知道什么时候会发现。）");
      return arr;
    },
    options:[
      {t:"坐商队（安全但慢，5-7天）", go:"journey_caravan_1", effect:{gold:-10, flag:"journey_caravan"}},
      {t:"独行（快但危险，3-5天）", go:"journey_solo_1", effect:{flag:"journey_solo"}},
      {t:"走水路（独特事件，4-6天）", go:"journey_river_1", effect:{gold:-5, flag:"journey_river"}},
      {t:"教会护送（安全但被监视，5天）", go:"journey_church_1", effect:{flag:"journey_church"}}
    ]
  };
};

// ============================================================
// v27 旅程：商队路线
// ============================================================
N["journey_caravan_1"] = function(){
  return {
    place:"商队·第一天清晨",
    text:function(){
      const arr=[];
      arr.push("商队在清晨出发。");
      arr.push("");
      arr.push("十二辆马车，二十多个护卫，还有几个和你一样的乘客。领头的是一个叫老周的商人，脸上有一道疤，话很少。");
      arr.push("");
      arr.push("你坐在最后一辆马车上，看着出身地越来越远，最后消失在地平线上。");
      arr.push("");
      arr.push("旁边的乘客是一个和你差不多大的少年，他自我介绍叫「林」，也是去学院的。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      arr.push("（林后来成了你的同学——但你现在还不知道。）");
      arr.unshift("天还没亮，商队营地就醒了。");arr.unshift("你被马嘶声吵醒的时候，火堆还冒着青烟。老周正蹲在货堆前，一块一块地检查货物，他脸上的疤在火光里显得格外深，像一条干涸的河床。几个护卫在收拾帐篷，动作利落，话却很少，只有金属磕碰的轻响。");arr.unshift("有人递给你一碗热粥。粥很稠，米粒煮得开了花，碗底沉着几块咸肉。你吸溜了一口，烫得直呲牙，旁边一个护卫看见了，咧开嘴笑：「慢点喝，路还长着呢。」");arr.unshift("你捧着碗，蹲在车辕上。晨雾还挂在草尖上，远处，你生活了十几年的那座城的轮廓，在雾里若隐若现，像一幅正在褪色的画。");arr.unshift("你忽然想起离开时，有人站在城门楼上，一直看着你。你当时没敢回头，现在却忍不住想：那是谁呢？");arr.unshift("雾气渐渐散了。老周站起来，拍了拍手上的灰，声音不高，却让整个营地都安静下来：「出发。」");return arr;
    } /*v45inj:journey_caravan_1*/,
  unlock:["reading_rumor_eclipse"],
    options:[
      {t:"和林聊天", go:"journey_caravan_2", effect:{relation:"lin:+10", timeCost:"1period"}},
      {t:"观察商队的人", go:"journey_caravan_2", effect:{timeCost:"1period"}},
      {t:"闭目养神", go:"journey_caravan_2", effect:{san:2, timeCost:"1period"}}
    ]
  };
};

N["journey_caravan_2"] = function(){
  return {
    place:"商队·第三天傍晚",
    text:function(){
      const arr=[];
      arr.push("第三天傍晚，商队在一片树林边扎营。");
      arr.push("");
      arr.push("篝火升起来了，护卫们在巡逻，商人们在算账。你和林坐在篝火边，听老周讲故事。");
      arr.push("");
      arr.push("「我跑这条商路跑了二十年。」老周说，「见过山贼，见过野兽，见过……别的东西。」");
      arr.push("");
      arr.push("「别的东西？」林问。");
      arr.push("老周看了他一眼，没再说话。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("那天晚上，你做了一个梦——梦里树林里有红色的眼睛，在看着商队。");
      arr.push("商队在正午的太阳底下走走停停。车轮吱呀吱呀地碾过土路，扬起一小片一小片的黄尘，落在每个人的肩头。");arr.push("老张坐在头车上，手里攥着缰绳，眼睛却一直扫着两边的旷野。他忽然开口：「小子，走过夜路没有？」");arr.push("没等你回答，他自己接了下去：「夜路不怕鬼，怕的是活人。草原上夜里赶路的，十有八九不是好东西。」他咧嘴一笑，露出一口黄牙，「你要是在夜里听见马蹄声，别出声，别点火，数自己的心跳。」");arr.push("你把这些话记下了。车队的颠簸里，你望着远处徐徐移动的山影，忽然觉得，这趟旅途，才刚刚开始。");return arr;
    } /*v45inj:journey_caravan_2*/,
    options:[
      {t:"告诉老周你的梦", go:"journey_caravan_3", effect:{timeCost:"1period"}},
      {t:"不告诉任何人", go:"journey_caravan_3", effect:{san:-2, timeCost:"1period"}}
    ]
  };
};

N["journey_caravan_3"] = function(){
  return {
    place:"商队·第五天",
    text:function(){
      const arr=[];
      arr.push("第五天，商队遇到了山贼。");
      arr.push("");
      arr.push("十几个山贼从树林里冲出来，拦住了商队的路。老周让护卫们准备战斗，但山贼的人数比护卫多。");
      arr.push("");
      arr.push("「留下货物，放你们走。」山贼的头目说。");
      arr.push("");
      arr.push("老周看了看货物，又看了看护卫，最后看向了你和林：「你们是乘客，不用参与。但如果愿意帮忙……」");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("傍晚，商队在一片背风的土坡下扎了营。篝火点起来的时候，天边的云被烧成了一大片暗红色，像谁在天上泼了一炉铁水。");arr.push("老张分了你一碗热汤。汤里没什么肉，只有几片干菜和一把粗盐，可捧在手里，那股热气顺着掌心一直暖到胸口。");arr.push("「明天要过一片秃岭，」老张用树枝拨着火堆，「那地方不太平，去年有商队在那儿丢了三个人。你今晚早点睡，养足精神。」");arr.push("你点了点头，靠在车辕上。篝火噼啪作响，火光在每个人的脸上跳着，像画了一幅幅忽明忽暗的画。你数着头顶的星星，数着数着，就睡了过去。");return arr;
    } /*v45inj:journey_caravan_3*/,
    options:[
      {t:"帮忙战斗", go:"journey_caravan_4a", effect:{check:"STR", tier:{
        crit:{t:"你冲上去，一拳打倒了一个山贼。护卫们士气大振，很快击退了山贼。老周拍了拍你的肩膀：「好小子！这趟车费免了！」", effect:{gold:10, relation:"lao_zhou:+20", exp:15}},
        ok:{t:"你帮忙战斗，受了点伤，但山贼最终被击退了。老周给了你一些钱作为感谢。", effect:{hp:-10, gold:5, exp:10}},
        fail:{t:"你想帮忙，但差点被山贼砍到。是一个护卫救了你。战斗结束后，你觉得自己很没用。", effect:{hp:-15, san:-3}},
        critfail:{t:"你冲上去，被山贼一棍子打晕了。等你醒过来，战斗已经结束了——商队损失了一些货物，但人都没事。老周没说什么，但你看到了他眼里的失望。", effect:{hp:-25, san:-5, relation:"lao_zhou:-5"}}
      }}},
      {t:"躲在马车后面", go:"journey_caravan_4b", effect:{}},
      {t:"尝试谈判", go:"journey_caravan_4c", effect:{check:"CHA", tier:{
        crit:{t:"你走出去，和山贼头目谈了起来。你说服了他——只收一半的过路费，就放商队走。老周对你刮目相看。", effect:{gold:-5, relation:"lao_zhou:+15", relation:"bandit_leader:+10"}},
        ok:{t:"你尝试谈判，但山贼头目不太听。最后老周出面，给了一些钱，事情才解决。", effect:{gold:-10}},
        fail:{t:"你尝试谈判，但山贼头目根本不听——他差点砍了你。护卫们冲上来救了你。", effect:{hp:-10, san:-3}},
        critfail:{t:"你谈判失败了，还激怒了山贼头目。战斗爆发，商队损失惨重。老周看你的眼神很复杂。", effect:{gold:-20, relation:"lao_zhou:-15", san:-5}}
      }}}
    ]
  };
};

N["journey_caravan_4a"] = function(){
  return {
    place:"商队·到达",
    text:function(){
      const arr=[];
      arr.push("第七天清晨，商队到达了交汇城。");
      arr.push("");
      arr.push("学院在城的北边。你和林道别，约好了学院见。");
      arr.push("");
      arr.push("老周给了你一个小包裹：「一点心意。以后如果在商路上遇到麻烦，报我的名字。」");
      arr.push("");
      arr.push("你站在交汇城的城门口，看着人来人往。你知道，你的新生活开始了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你在商队上做的选择，老周都记在了心里。他是个有影响力的商人——以后你会再见到他的。）");
      return arr;
    },
    options:[
      {t:"前往学院报到", go:"orientation_day1", effect:{}}
    ]
  };
};

N["journey_caravan_4b"] = function(){
  return {
    place:"商队·到达",
    text:function(){
      const arr=[];
      arr.push("战斗结束了。护卫们击退了山贼，但损失了一些货物。");
      arr.push("");
      arr.push("你从马车后面出来，没有人说你什么——但你看到了老周眼里的失望。");
      arr.push("");
      arr.push("第七天，商队到达了交汇城。你和林道别，他看你的眼神有点奇怪。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你在商队上的选择，林都看在了眼里。他是个记仇的人——以后你会再见到他的。）");
      return arr;
    },
    options:[
      {t:"前往学院报到", go:"orientation_day1", effect:{san:-2}}
    ]
  };
};

N["journey_caravan_4c"] = function(){
  return {
    place:"商队·到达",
    text:function(){
      const arr=[];
      arr.push("事情解决了——不管是通过谈判还是别的方式，商队继续上路了。");
      arr.push("");
      arr.push("第七天，商队到达了交汇城。你和林道别，约好了学院见。");
      arr.push("");
      arr.push("你站在交汇城的城门口，吸了口气。");
      arr.push("");
      arr.push("学院，我来了。");
      return arr;
    },
    options:[
      {t:"前往学院报到", go:"orientation_day1", effect:{}}
    ]
  };
};

// ============================================================
// v27 旅程：独行路线（简化版，3节点）
// ============================================================
N["journey_solo_1"] = function(){
  return {
    place:"独行·第一天",
    text:function(){
      const arr=[];
      arr.push("你选择了独行。");
      arr.push("");
      arr.push("一个人走路，快，但也危险。你背着包袱，沿着商路往南走。");
      arr.push("");
      arr.push("第一天很平静。你在路边的一棵大树下休息，吃了点干粮。");
      arr.push("");
      arr.push("晚上，你在一个废弃的猎人小屋里过夜。屋里有火堆的痕迹——之前有人在这里住过。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你在小屋里发现了一个刻在墙上的符号——你不认识，但你总觉得在哪里见过。）");
      arr.push("独行的第一天，你才知道什么叫真正的安静。");arr.push("没有人说话，没有车轮声，只有你自己的脚步声，一步，一步，踩在土路上，像一枚安静的钟。");arr.push("中午你在一条溪边歇脚，把脚浸进水里。水很凉，凉得你的脚趾发麻。你抬头看天，天蓝得不像话，云慢悠悠地飘着，好像一点也不着急。");arr.push("你忽然想起出身地的那些人——他们现在在做什么？是还在叫卖，还是已经把你忘了？");arr.push("你甩了甩脚上的水，重新上路。步子比刚才快了一些，好像身后有什么东西在追你，又好像前面有什么东西在等你。");return arr;
    } /*v45inj:journey_solo_1*/,
    options:[
      {t:"继续赶路", go:"journey_solo_2", effect:{timeCost:"1day"}},
      {t:"调查那个符号", go:"journey_solo_2", effect:{check:"INT", tier:{
        crit:{t:"你仔细研究那个符号，发现它是古艾尔达语——意思是「守望者在此」。你把这个发现记在了心里。", effect:{knowledge:1, flag:"found_watcher_mark"}},
        ok:{t:"你看了半天，觉得那个符号可能是某种标记，但不确定是什么意思。", effect:{}},
        fail:{t:"你看了半天，什么都没看出来。可能只是某个猎人的涂鸦吧。", effect:{}},
        critfail:{t:"你盯着那个符号看了太久，突然觉得头晕——好像有什么东西在盯着你看。你赶紧离开了小屋。", effect:{san:-5}}
      }}}
    ]
  };
};

N["journey_solo_2"] = function(){
  return {
    place:"独行·第三天",
    text:function(){
      const arr=[];
      arr.push("第三天，你遇到了一个旅人。");
      arr.push("");
      arr.push("他坐在路边，看起来受了伤。他说他叫「陈」，是个商人，被山贼抢了。");
      arr.push("");
      arr.push("「你能帮我吗？」他问，「我会报答你的。」");
      arr.push("");
      plantForeshadowV27('npc_lie');
      plantForeshadowV27('karma_seed');
      arr.push("（你不知道他说的是不是真话。但他的伤口是真的——血还在流。）");
      arr.push("入夜前，你在一棵老树下生了火。火苗很小，你拢着它，像拢着一只发抖的鸟。");arr.push("旷野的夜很黑，黑得没有边际。风从四面八方吹来，吹得火苗东倒西歪。你听见远处有狼嚎，一声，又一声，像在和另一头的狼说话。");arr.push("你没有害怕——或者说，你已经怕过了，怕到不再怕。你往火里添了一根柴，火光跳了跳，把你的影子投在地上，又长又孤单。");arr.push("你想起小时候听过的歌谣：一个人走夜路，别回头，回头会看见另一个自己。你笑了笑，没有回头。");arr.push("后半夜，火快灭了，你裹紧衣裳，靠着树干眯了一会儿。梦里，有人在喊你的名字，声音很熟，可你想不起来是谁。");return arr;
    } /*v45inj:journey_solo_2*/,
    options:[
      {t:"帮他包扎伤口", go:"journey_solo_3", effect:{check:"INT", tier:{
        crit:{t:"你熟练地帮他包扎了伤口。他很感激，给了你一个小袋子——里面是几颗宝石。「这是我最后的东西了。」他说，「谢谢你。」", effect:{item:"gems", relation:"chen:+20"}},
        ok:{t:"你帮他包扎了伤口，虽然不太熟练。他给了你几个铜星作为感谢。", effect:{gold:5, relation:"chen:+10"}},
        fail:{t:"你想帮他，但你不太会包扎。他疼得直咧嘴，但还是感谢了你。", effect:{relation:"chen:+5"}},
        critfail:{t:"你包扎的时候弄疼了他，他差点晕过去。但他还是说了声谢谢——虽然语气不太好。", effect:{relation:"chen:-5", san:-2}}
      }}},
      {t:"给他一些食物和水，然后离开", go:"journey_solo_3", effect:{gold:-3, karma:1}},
      {t:"不理他，继续赶路", go:"journey_solo_3", effect:{karma:-1, san:-2}}
    ]
  };
};

N["journey_solo_3"] = function(){
  return {
    place:"独行·到达",
    text:function(){
      const arr=[];
      arr.push("第五天，你看到了交汇城的城墙。");
      arr.push("");
      arr.push("一个人走了五天，你觉得自己长大了一些——也脏了一些。");
      arr.push("");
      arr.push("你在城门口的水池边洗了把脸，整理了一下衣服，然后走进了城。");
      arr.push("");
      arr.push("学院在北边。你问了路，往那个方向走去。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你在路上做的选择，会在以后的某一天，以某种方式回到你面前。）");
      arr.push("独行的第三天，你走到了山与平原交界的地方。");arr.push("路边的野花多起来了，黄的、紫的、白的，一小朵一小朵，挤在一起，像在互相壮胆。你蹲下来看了好一会儿，忽然笑了——你想起小时候，也会蹲在路边，看这些不起眼的花。");arr.push("你摘了一朵，别在行囊的扣子上。风一吹，它摇摇晃晃，像一盏小小的灯。");arr.push("远处，平原的尽头，隐约能看到一座城的轮廓——那是你要去的地方。");arr.push("你站直身子，把行囊紧了紧。这三天，你一个人走，一个人睡，一个人听风。你忽然发现，你不再怕了。");arr.push("你在路边的一块石头上坐下来，歇了歇脚。");arr.push("你把行囊里的东西翻出来，一样一样摆开：干粮、水囊、那把旧匕首、还有那朵野花。东西不多，可每一样，都是你自己挣的、自己背的、自己选的。");arr.push("你忽然觉得，一个人走的路，和一群人走的路，是不一样的。一群人走路，路是大家的；一个人走路，路是你自己的。");arr.push("你重新收拾好行囊，站起来，朝那座城的方向走去。");arr.push("风把你的衣摆吹起来，行囊上的野花摇摇晃晃，可你没有回头。");arr.push("你忽然觉得，这座城，不是你的终点——它只是你下一个出发的地方。");return arr;
    } /*v45inj:journey_solo_3*/,
    options:[
      {t:"前往学院报到", go:"orientation_day1", effect:{}}
    ]
  };
};

// ============================================================
// v27 旅程：水路路线（简化版，3节点）
// ============================================================
N["journey_river_1"] = function(){
  return {
    place:"水路·第一天",
    text:function(){
      const arr=[];
      arr.push("你选择了走水路。");
      arr.push("");
      arr.push("船是一艘内河商船，从出身地的码头出发，沿着大河往交汇城方向走。船上有十几个乘客，还有几个水手。");
      arr.push("");
      arr.push("河两岸的风景很美——田野、村庄、远处的山。你站在船头，风吹在脸上，感觉很自由。");
      arr.push("");
      arr.push("但船长是个沉默的人，他总是盯着河面看，好像在等什么。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("水路的船不大，船帮上长满了青苔，走起来吱吱嘎嘎，像一位上了年纪的老人。");arr.push("你坐在船头，看河水从船底流过。水是浑的，看不见底，偶尔有鱼跃出水面，银光一闪，又落回水里。");arr.push("船老大是个沉默的汉子，只在上船时问了一句：「坐稳了？」之后便再没开过口，只是撑着长篙，一下一下，把船推向前方。");arr.push("河两岸是大片大片的芦苇荡，风一吹，沙沙沙地响，像有无数人在小声说话。你盯着那片芦苇看了很久，总觉得里面有什么东西，也在看着你。");arr.push("船老大忽然开口：「别看太久。」他说，「河里的东西，最经不起人看。」");arr.push("你移开视线，低头看自己的倒影。水波荡开，倒影碎成一片一片，像一张被揉皱的脸。");arr.push("第一天已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    } /*v45inj:journey_river_1*/,
    options:[
      {t:"问船长在看什么", go:"journey_river_2", effect:{check:"CHA", tier:{
        crit:{t:"船长看了你一眼，轻声说：「这条河……不太平。最近总有东西从河里爬出来。你看到水面下有光的话，别盯着看。」你记住了他的话。", effect:{knowledge:1, flag:"river_warning"}},
        ok:{t:"船长说：「没什么。看水而已。」然后就不说话了。", effect:{}},
        fail:{t:"船长没理你。他只是继续盯着河面。", effect:{}},
        critfail:{t:"你追问得太紧，船长不耐烦了：「小孩子问那么多干什么？老老实实待着！」你被他吼了一跳。", effect:{san:-2}}
      }}},
      {t:"和其他乘客聊天", go:"journey_river_2", effect:{timeCost:"1period"}},
      {t:"在船头看风景", go:"journey_river_2", effect:{san:2, timeCost:"1period"}}
    ]
  };
};

N["journey_river_2"] = function(){
  return {
    place:"水路·第三天深夜",
    text:function(){
      const arr=[];
      arr.push("第三天深夜，你被惊醒了。");
      arr.push("");
      arr.push("船在摇晃——不是波浪的摇晃，是有什么东西在撞船底。");
      arr.push("");
      arr.push("你跑到甲板上，看到水面下有光——绿色的光，在很深很深的地方，一闪一闪。");
      arr.push("");
      arr.push("船长在喊：「别看！都回船舱去！」");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（你听到了一个声音——从河底传来的，像在叫你的名字。你不确定那是不是幻觉。）");
      arr.push("夜里，船泊在一处河湾。你躺在舱里，听着水声，怎么也睡不着。");arr.push("月亮升起来的时候，河面像铺了一层碎银。你爬起来，坐到船头，看月光在波浪间跳动。");arr.push("就在这时，你看见水面上有什么东西在发光——绿幽幽的，像一只只眼睛，在水下徐徐游动。");arr.push("你想起船老大白天的话，屏住呼吸，一动不动。那些绿光在水下绕了一圈，又徐徐散开了，像一群游过的鱼，又像别的什么。");arr.push("你慢慢吐出一口气，退回舱里。那一夜，你听着水声，一直到天亮，再也没有睡着。");arr.push("别过第三天深夜，你沿官道走出里许，回头已看不清来处。");
      return arr;
    } /*v45inj:journey_river_2*/,
    options:[
      {t:"听船长的话，回船舱", go:"journey_river_3", effect:{san:-2}},
      {t:"盯着那光看", go:"journey_river_3", effect:{check:"SPR", tier:{
        crit:{t:"你盯着那光看，光也在看你。你看到了一座城市——在河底，有高塔，有灯光。然后光消失了。你发现自己泪流满面。", effect:{san:-5, knowledge:1, flag:"saw_underwater_city"}},
        ok:{t:"你看了一会儿，光闪了三下，然后消失了。你不知道那是什么，但你记住了那个节奏。", effect:{san:-3, flag:"light_pattern"}},
        fail:{t:"你刚要看，船长一把把你拉回了船舱：「我说了别看！」你被他拉得胳膊疼。", effect:{hp:-5}},
        critfail:{t:"你盯着那光看，突然觉得有什么东西在拉你——你差点掉进河里！是旁边的乘客抓住了你。", effect:{san:-8, hp:-10}}
      }}}
    ]
  };
};

N["journey_river_3"] = function(){
  return {
    place:"水路·到达",
    text:function(){
      const arr=[];
      arr.push("第六天，船到达了交汇城的码头。");
      arr.push("");
      arr.push("你下了船，回头看了最后一眼——河面很平静，什么都没有。但你知道，那下面有东西。");
      arr.push("");
      arr.push("船长在你下船的时候，塞给你一个小物件：「一颗河底捞上来的石头。带着它——如果你以后再遇到那种光，它会保护你。」");
      arr.push("");
      plantForeshadowV27('lost_item');
      arr.push("你把石头收进怀里，往学院的方向走去。");
      arr.push("从到达出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options:[
      {t:"前往学院报到", go:"orientation_day1", effect:{item:"river_stone"}}
    ]
  };
};

// ============================================================
// v27 旅程：教会护送路线（简化版，3节点）
// ============================================================
N["journey_church_1"] = function(){
  return {tag:"branch",
    place:"教会护送·第一天",
    text:function(){
      const arr=[];
      arr.push("你选择了教会护送。");
      arr.push("");
      arr.push("护送你的是两个审判骑士——一个叫托马斯，一个叫约翰。他们穿着白袍，佩着剑，表情严肃。");
      arr.push("");
      arr.push("「教会的职责是保护信徒。」托马斯说，「但你也要遵守规矩——不要和陌生人说话，不要在深夜外出，不要问不该问的问题。」");
      arr.push("");
      arr.push("你觉得自己不像被护送，倒像被监视。");
      arr.push("");
      plantForeshadowV27('watcher_spy');
      arr.push("教会的护送队，比想象中要安静。");arr.push("骑士们骑着白马，穿着银甲，行进时没有人说话，只有马蹄声和甲叶碰撞的轻响，整齐得像一首歌。");arr.push("领队的骑士是个中年女人，眉间有一道竖纹，看人的时候视线很直。她策马走到你身边，问：「你信光明吗？」");arr.push("你想了想，说：「我信我自己。」");arr.push("她没有生气，只是点了点头，说：「诚实。很好。」然后策马回到队首，再也没有回头。");arr.push("你望着她的背影，忽然觉得，这座教会里的所有人，好像都背着什么看不见的东西。");return arr;
    } /*v45inj:journey_church_1*/,
    options:[
      {t:"遵守规矩，安静赶路", go:"journey_church_2", effect:{timeCost:"1day"}},
      {t:"试探着和他们聊天", go:"journey_church_2", effect:{check:"CHA", tier:{
        crit:{t:"你和他们聊了起来，慢慢地，托马斯的态度软化了。他告诉你，他其实不喜欢净化令——但他是教会的人，必须执行。「有些事，」他说，「不是非黑即白的。」", effect:{relation:"thomas:+15, knowledge:1"}},
        ok:{t:"你和他们聊了几句，但他们不太愿意多说。你只知道他们是圣城来的，执行过很多次「净化任务」。", effect:{}},
        fail:{t:"你想和他们聊天，但他们很冷淡。「闭嘴，赶路。」约翰说。你只好闭嘴。", effect:{san:-2}},
        critfail:{t:"你问了太多关于净化令的问题，托马斯警惕地看了你一眼：「你问这些干什么？你是什么人？」接下来的路，他们对你更警惕了。", effect:{relation:"thomas:-10, san:-3"}}
      }}}
    ]
  };
};

N["journey_church_2"] = function(){
  return {tag:"branch",
    place:"教会护送·第三天",
    text:function(){
      const arr=[];
      arr.push("第三天，你们在一个小镇过夜。");
      arr.push("");
      arr.push("小镇的教堂里正在进行「净化仪式」——一个被指控为灵魂法师的女人，被绑在柱子上。");
      arr.push("");
      arr.push("托马斯和约翰去参加仪式了。你一个人在客栈里，听到外面传来人群的喊叫声。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      arr.push("（你可以选择去看看——但你知道，去了可能会改变一些事。）");
      arr.push("傍晚扎营的时候，骑士们围成一圈祷告。声音低沉，整齐，像一阵风穿过树林。");arr.push("你坐在圈子外面，吃着干粮。领队的女骑士走过来，在你身边坐下，递给你一块烤饼。");arr.push("「你不祷告？」她问。");arr.push("「不知道该向谁祷告。」你说。");arr.push("她沉默了一会儿，说：「有时候，祷告不是为了求什么。是为了让自己记住，自己不是一个人。」");arr.push("她站起身，拍了拍甲胄上的土：「早点睡。明天要过一段山路。」");arr.push("你咬了一口烤饼。饼很硬，可嚼着嚼着，竟嚼出一丝麦子的甜味。");return arr;
    } /*v45inj:journey_church_2*/,
    options:[
      {t:"去看看仪式", go:"journey_church_3", effect:{timeCost:"1period"}},
      {t:"待在客栈里", go:"journey_church_3", effect:{san:-3}}
    ]
  };
};

N["journey_church_3"] = function(){
  return {tag:"branch",
    place:"教会护送·到达",
    text:function(){
      const arr=[];
      arr.push("第五天，你们到达了交汇城。");
      arr.push("");
      arr.push("托马斯和约翰把你送到学院门口，然后离开了。临走前，托马斯看了你一眼，欲言又止。");
      arr.push("");
      arr.push("「保重。」他最后只说了这两个字。");
      arr.push("");
      arr.push("你站在学院门口，看着那巨大的石门。你知道，从今天起，你的人生不一样了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你在旅途中看到的事，会在以后的某一天，以某种方式影响你。）");
      arr.push("山路很窄，只容一人一骑通过。骑士们下了马，牵着缰绳，排成一列，走得沉默而稳健。");arr.push("你走在队列中间，前后都是银色的甲胄。你忽然发现，这条路虽然险，可你一点也不害怕——不是因为铠甲，是因为前面那个人，每一步都替你踩稳了。");arr.push("领队的女骑士在最前面开路。她走一段，就停下来，回头看一眼整个队列，确认每个人都在，才继续走。");arr.push("你在一个拐弯处，听见前面传来极轻的一声哨响——是她在给后面的人报平安。哨声很短，却让整条山路上紧绷的空气，松了一瞬。");arr.push("你忽然明白，护送这件事，护的不是路，是人心。");arr.push("傍晚，队伍在山上的一处废弃哨塔扎营。你帮着捡柴生火，火光在山风里摇摇晃晃。");arr.push("女骑士坐在火边，第一次主动和你说话：「白天那段路，你走得不错。没有拖后腿。」");arr.push("「谢谢。」你说，「你带路也稳。」");arr.push("她愣了一下，然后笑了——那是你第一次看见她笑，很短，像山风里一闪而过的火光：「教会的人，很少夸我们『稳』。他们夸我们『圣洁』。」");arr.push("「圣洁是给人看的。」你说，「稳，是给跟着你的人用的。」");arr.push("她没再说话。可那天晚上，她巡夜时，在你帐篷外多停了一会儿。");return arr;
    } /*v45inj:journey_church_3*/,
    options:[
      {t:"进入学院报到", go:"orientation_day1", effect:{}}
    ]
  };
};

// ============================================================
// v27 入学周
// ============================================================
N["orientation_day1"] = function(){
  return {
    place:"学院·第一天·报到",
    text:function(){
      const arr=[];
      arr.push("艾尔达大陆学院的大门比你想象的要大。");
      arr.push("");
      arr.push("石门上刻着古老的符文，据说是黄林晶亲手刻的。门后面是一条林荫大道，两边是教学楼、宿舍、图书馆、训练场。");
      arr.push("");
      arr.push("报到处在林荫大道的尽头。一个戴眼镜的老教授坐在桌子后面，面前堆着厚厚的名册。");
      arr.push("");
      arr.push("「名字？出身？」他头也不抬地问。");
      arr.push("");
      arr.push("你说了名字和出身。他在名册上找了找，然后递给你一把钥匙和一张纸。");
      arr.push("");
      arr.push("「宿舍在东区，302室。你的室友已经到了两个——去认识一下吧。明天上午是入学测评，别迟到。」");
      arr.push("第一天的动静在身后淡了。你把行囊带子紧了紧，继续上路。");
      return arr;
    },
    options:[
      {t:"去宿舍认识室友", go:"orientation_day1_room", effect:{}},
      {t:"先在校园里逛逛", go:"orientation_day1_campus", effect:{timeCost:"1period"}}
    ]
  };
};

N["orientation_day1_room"] = function(){
  return {
    place:"学院·宿舍302",
    text:function(){
      const arr=[];
      arr.push("宿舍在东区三楼。");
      arr.push("");
      arr.push("你推开门，里面已经有两个人了。");
      arr.push("");
      arr.push("一个是高个子的少年，正在整理床铺——他叫马库斯，北方公国来的，话不多，但很有力气。");
      arr.push("另一个是瘦瘦的少年，戴着眼镜，在看书——他叫艾尔文，自由城邦来的，据说入学考试第一名。");
      arr.push("");
      arr.push("「你就是第三个室友？」艾尔文抬头看了你一眼，「我叫艾尔文。这是马库斯——他不太爱说话，但人很好。」");
      arr.push("");
      arr.push("马库斯点了点头，算是打招呼。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      plantForeshadowV27('karma_seed');
      arr.push("（这两个人，将是你接下来五年里最亲近的人——或者最疏远的人。取决于你怎么做。）");
      arr.push("离开宿舍302时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options:[
      {t:"和他们聊天", go:"orientation_day2", effect:{relation:"marcus:+5, relation:"+"elvin:+5", timeCost:"1period"}},
      {t:"整理自己的床铺", go:"orientation_day2", effect:{timeCost:"1period"}}
    ]
  };
};

N["orientation_day1_campus"] = function(){
  return {
    place:"学院·校园",
    text:function(){
      const arr=[];
      arr.push("你在校园里逛了逛。");
      arr.push("");
      arr.push("学院很大——教学楼、图书馆、训练场、炼金实验室、灵魂魔法塔、神殿、食堂、商店。你花了一个时段才逛了一半。");
      arr.push("");
      arr.push("你注意到一个地方——图书馆的禁书区，门口有守卫，不让学生进。");
      arr.push("");
      arr.push("还有灵魂魔法塔——塔尖总是笼罩着一层淡淡的光，据说墨丘利教授住在塔顶。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（你在校园里的时候，又有了那种被注视的感觉。但你回头看，什么都没有。）");
      arr.push("你与校园作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options:[
      {t:"回宿舍", go:"orientation_day2", effect:{timeCost:"1period"}}
    ]
  };
};

N["orientation_day2"] = function(){
  return {
    place:"学院·第二天·测评",
    text:function(){
      const arr=[];
      arr.push("第二天上午，入学测评。");
      arr.push("");
      arr.push("测评在训练场进行。所有新生排成一排，等待测试。内容很简单——属性测试、境界检测、职业倾向评估。");
      arr.push("");
      arr.push("一个穿白袍的教授用一个水晶球测试你的属性。水晶球亮了起来，显示出你的各项数值。");
      arr.push("");
      arr.push("「嗯。」教授看了一眼，「不错的底子。去那边测境界。」");
      arr.push("");
      arr.push("境界检测的结果——你是凡人境。大多数新生都是凡人境，少数天才是启灵境。");
      arr.push("");
      arr.push("最后是职业倾向评估。教授问了你几个问题，然后在你的表格上写了几个字。");
      arr.push("第二天在雾里模糊了轮廓。你紧了紧衣领，迈步上路。");
      return arr;
    },
    options:[
      {t:"查看测评结果", go:"orientation_day2_result", effect:{}},
      {t:"和旁边的新生聊天", go:"orientation_day2_result", effect:{timeCost:"1period"}}
    ]
  };
};

N["orientation_day2_result"] = function(){
  return {
    place:"学院·测评结果",
    text:function(){
      const arr=[];
      arr.push("测评结果出来了。");
      arr.push("");
      arr.push("你的属性和境界被记录在案。职业倾向评估显示你适合——你自己的选择。");
      arr.push("");
      arr.push("「职业一旦选定，一生不变。」教授说，「所以想清楚了再选。」");
      arr.push("");
      arr.push("你看着表格上的七个职业选项——魔法师、战士、灵魂法师、牧师、盗贼、商人、炼金术师。");
      arr.push("");
      arr.push("这是你人生中最重要的选择之一。");
      arr.push("你最后回望一眼测评结果，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options:[
      {t:"选择职业（进入职业选择）", go:"fc_jiaohui_entry", effect:{flag:"orientation_complete"}},
      {t:"再想想", go:"orientation_day3", effect:{}}
    ]
  };
};

N["orientation_day3"] = function(){
  return {
    place:"学院·第三天·选课",
    text:function(){
      const arr=[];
      arr.push("第三天，选课。");
      arr.push("");
      arr.push("学院的课程分为必修课和选修课。必修课是所有学生都要上的——历史、数学、基础魔法理论。选修课可以自由选择，但每学期最多选三门。");
      arr.push("");
      arr.push("选修课的列表很长——古代符文学、灵魂魔法入门、炼金术基础、战斗技巧、商业谈判、草药学、神学、地理、种族研究……");
      arr.push("");
      arr.push("你注意到一门课——「七印研究」。授课教授：墨丘利。但这门课的备注写着：「限选，需教授批准。」");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      plantForeshadowV27('seal_omen');
      arr.push("从第三天出来，路上行人渐稀。你脚步不停，一路向前。");
      return arr;
    },
    options:[
      {t:"选三门普通选修课", go:"orientation_day4", effect:{flag:"electives_normal"}},
      {t:"尝试申请「七印研究」", go:"orientation_day4", effect:{check:"INT", tier:{
        crit:{t:"你写了一封申请信，递给了墨丘利教授的助教。第二天，助教来找你：「墨丘利教授同意见你一面。明天黄昏，灵魂魔法塔。」你很兴奋——也很紧张。", effect:{flag:"seven_seals_study_approved", relation:"mercury:+10"}},
        ok:{t:"你提交了申请，但助教说需要等教授审批。「墨丘利教授很忙，可能要等几天。」你决定先选别的课。", effect:{flag:"seven_seals_pending"}},
        fail:{t:"你的申请被拒绝了。助教说：「墨丘利教授这学期不收新生。」你有点失望，但也没办法。", effect:{san:-2}},
        critfail:{t:"你的申请被拒绝了，而且助教看你的眼神很奇怪——好像你做了什么不该做的事。「以后不要再申请这门课了。」他说。", effect:{san:-5, relation:"mercury:-5"}}
      }}}
    ]
  };
};

N["orientation_day4"] = function(){
  return {
    place:"学院·第四天·社交",
    text:function(){
      const arr=[];
      arr.push("第四天晚上，学院举办了迎新舞会。");
      arr.push("");
      arr.push("大礼堂里灯火通明，新生们穿着最好的衣服，三三两两地聚在一起聊天、跳舞、喝酒。");
      arr.push("");
      arr.push("你看到了很多熟悉的面孔——马库斯和艾尔文，还有一些在测评时见过的新生。");
      arr.push("");
      arr.push("角落里，几个学生在讨论社团招新——战斗社、魔法社、炼金社、文学社、还有一个叫「真相社」的小社团，据说在调查学院的秘密。");
      arr.push("");
      plantForeshadowV27('classmate_seed');
      plantForeshadowV27('eclipse_outer');
      arr.push("（你注意到一个穿黑袍的学生，在角落里独自喝酒。他的眼神很深——好像在看什么别人看不到的东西。）");
      arr.push("你收拾停当，离开第四天，沿着来路踏上行程。");
      return arr;
    },
    options:[
      {t:"和室友一起玩", go:"orientation_day5", effect:{relation:"marcus:+10, relation:"+"elvin:+10", timeCost:"1period"}},
      {t:"去看看「真相社」", go:"orientation_day5", effect:{check:"CHA", tier:{
        crit:{t:"你和真相社的人聊了起来。他们的社长是一个高年级的女生，叫塞西莉亚。她告诉你，学院有很多秘密——禁书区、地下遗迹、墨丘利教授的真实身份。「如果你感兴趣，」她说，「可以来参加我们的活动。」", effect:{relation:"cecilia:+15", flag:"truth_society_joined"}},
        ok:{t:"你和真相社的人聊了几句，他们说的东西半真半假，但很有趣。你留了他们的联系方式。", effect:{flag:"truth_society_contact"}},
        fail:{t:"你想和他们聊天，但他们很警惕——新生他们不太信任。你只好离开了。", effect:{}},
        critfail:{t:"你问了太多问题，他们以为你是教会的卧底。「离我们远点。」社长冷冷地说。你很尴尬。", effect:{relation:"cecilia:-10, san:-3"}}
      }}},
      {t:"一个人在角落喝酒", go:"orientation_day5", effect:{san:2, timeCost:"1period"}}
    ]
  };
};

N["orientation_day5"] = function(){
  return {
    place:"学院·第五天·开学仪式",
    text:function(){
      const arr=[];
      arr.push("第五天，开学仪式。");
      arr.push("");
      arr.push("所有新生聚集在大礼堂。校长站在台上，发表了开学演讲。");
      arr.push("");
      arr.push("「欢迎来到艾尔达大陆学院。」校长说，「在这里，你们将学到知识，交到朋友，也会面对挑战。记住——学院不是避难所，是战场。你们在这里学到的每一样东西，都将在未来的某一天，救你们的命。」");
      arr.push("");
      arr.push("他的话很严肃，但你注意到他的眼神在扫过人群的时候，在某个地方停留了一下——你不确定他在看谁。");
      arr.push("");
      arr.push("演讲结束后，分院仪式开始。你被分到了——你的选择。");
      arr.push("");
      plantForeshadowV27('watcher_spy');
      plantForeshadowV27('prophecy_fragment');
      arr.push("（仪式结束后，你在人群中看到了一个穿灰袍的老人——他在看你。你们的视线对视了一秒，然后他转身走了。你后来才知道，那是墨丘利教授。）");
      arr.push("");
      arr.push("【入学周结束。你的学院生活，正式开始了。】");
      arr.push("第五天已被抛在身后。路在脚下延伸，你不回头，行至前方。");
      return arr;
    },
    options:[
      {t:"开始学院生活", go:"fc_jiaohui_entry", effect:{flag:"academy_started"}}
    ]
  };
};

console.log("[v27 bb] 序章时间流 + 旅程连接 + 入学周已加载");


// ============================================================
// v27 道德灰色选择数据
// ============================================================
const MORAL_CHOICES_V27 = {
  bread_theft: {name:"面包店偷窃", planted:false, choice:null, consequences:[]},
  refugee_help: {name:"难民帮助", planted:false, choice:null, consequences:[]},
  informant: {name:"告密选择", planted:false, choice:null, consequences:[]},
  combat_mercy: {name:"战斗放过", planted:false, choice:null, consequences:[]},
  lie_origin: {name:"谎言选择", planted:false, choice:null, consequences:[]},
  promise: {name:"承诺选择", planted:false, choice:null, consequences:[]},
  found_item: {name:"物品选择", planted:false, choice:null, consequences:[]}
};

function initMoralChoicesV27(){
  if(!S.moralChoices){
    S.moralChoices = {};
    for(const k in MORAL_CHOICES_V27){
      S.moralChoices[k] = {planted:false, choice:null, stage:0};
    }
  }
}

function plantMoralChoiceV27(id){
  initMoralChoicesV27();
  if(S.moralChoices[id]) S.moralChoices[id].planted = true;
}

// ============================================================
// v27 道德选择1：面包店偷窃
// ============================================================
N["moral_bread_theft"] = function(){
  plantMoralChoiceV27('bread_theft');
  return {
    place:"面包店",
    text:function(){
      const arr=[];
      arr.push("你饿了。");
      arr.push("");
      arr.push("已经两天没吃东西了。口袋里一个铜星都没有。老张的面包店飘着麦香，橱窗里的面包还冒着热气。");
      arr.push("");
      arr.push("老张在柜台后面打盹。门没锁。");
      arr.push("");
      arr.push("你可以走进去，拿一个面包。他不会发现的——或者他会发现，但一个面包而已，他不会怎么样。");
      arr.push("");
      arr.push("但你也可以走开。饿肚子的滋味不好受，但偷东西的滋味更不好受。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("面包店的灯火远了。夜风凉，你把心思收回来，专心赶路。");
      return arr;
    },
    options:[
      {t:"偷一个面包", go:"moral_bread_theft_stole", effect:{check:"AGI", tier:{
        crit:{t:"你悄无声息地走进店里，拿了一个面包，又悄无声息地走了出来。老张还在打盹。你咬了一口面包——热的，咸的，有芝麻的香味。但你总觉得哪里不对劲。", effect:{hp:10, san:-3, flag:"stole_bread"}},
        ok:{t:"你走进去，拿了一个面包。老张动了一下，你赶紧躲到了货架后面。等他重新睡着，你才溜了出来。面包到手了，但你的心在跳。", effect:{hp:10, san:-5, flag:"stole_bread"}},
        fail:{t:"你刚拿起面包，老张就醒了。「你干什么！」他喊了起来。你扔下面包，跑了。身后是老张的骂声。", effect:{san:-8, flag:"caught_stealing", relation:"lao_zhang:-15"}},
        critfail:{t:"你偷面包的时候被老张抓住了。他报了官。你在牢里待了一夜，最后是一个陌生人把你保了出来。「以后别再偷了。」他说。你不知道他是谁，但你记住了他的脸。", effect:{san:-10, flag:"jailed_for_theft", relation:"lao_zhang:-20"}}
      }}},
      {t:"走开，饿肚子", go:"moral_bread_theft_hungry", effect:{hp:-5, san:2, flag:"did_not_steal"}},
      {t:"问老张能不能给点活干换面包", go:"moral_bread_theft_work", effect:{check:"CHA", tier:{
        crit:{t:"老张看了你一眼，笑了：「小子，还挺有骨气。行，帮我搬一下货，面包管够。」你帮他搬了一个时辰的货，吃了三个面包，还赚了五个铜星。老张说以后随时可以来帮忙。", effect:{hp:15, gold:5, relation:"lao_zhang:+20", flag:"worked_for_bread"}},
        ok:{t:"老张犹豫了一下，说：「行吧，帮我扫扫地，给你一个面包。」你扫了地，吃了面包。老张说以后有活可以找你。", effect:{hp:10, relation:"lao_zhang:+10", flag:"worked_for_bread"}},
        fail:{t:"老张冷冷地看了你一眼：「我这里不养闲人。走开。」你只好走了。肚子更饿了。", effect:{hp:-5, san:-3}},
        critfail:{t:"你问的时候语气不太好，老张以为你是来闹事的。他拿起擀面杖把你赶了出来。「滚！以后别来我的店！」", effect:{hp:-10, san:-5, relation:"lao_zhang:-10"}}
      }}}
    ]
  };
};

N["moral_bread_theft_stole"] = function(){
  return {
    place:"巷子里",
    text:function(){
      const arr=[];
      arr.push("你坐在巷子里，吃着偷来的面包。");
      arr.push("");
      arr.push("面包很好吃。但你总觉得老张在看着你——虽然他不在。");
      arr.push("");
      arr.push("你后来才知道，老张是个好人。他每年冬天都会给流浪汉送面包。他的妻子去年去世了，他一个人守着这家店，把面包店当成了和妻子的回忆。");
      arr.push("");
      plantForeshadowV27('npc_lie');
      plantForeshadowV27('karma_seed');
      arr.push("（你偷的那个面包，是老张那天早上烤的第一炉——他妻子生前最喜欢的口味。）");
      arr.push("");
      arr.push("这个选择，会在以后的某一天，以某种方式回到你面前。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{}}
    ]
  };
};

N["moral_bread_theft_hungry"] = function(){
  return {
    place:"巷子里",
    text:function(){
      const arr=[];
      arr.push("你走开了。");
      arr.push("");
      arr.push("肚子很饿，但你心里踏实。");
      arr.push("");
      arr.push("你后来才知道，老张那天注意到了你——一个在面包店门口站了很久、最后走开的年轻人。他跟旁边的摊主说：「那小子有骨气。以后如果有困难，可以来找我。」");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（你不知道的是，老张后来在你最困难的时候，帮了你一把。）");
      arr.push("离开巷子里时天光正好，靴子踏上路面的声音很稳。一路向前。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{}}
    ]
  };
};

N["moral_bread_theft_work"] = function(){
  return {
    place:"面包店",
    text:function(){
      const arr=[];
      arr.push("你靠自己的劳动换来了面包。");
      arr.push("");
      arr.push("老张对你印象很好。他说以后随时可以来帮忙——按天算钱，面包管够。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('classmate_seed');
      arr.push("（你后来才知道，老张的侄子也在学院上学。他跟他侄子提过你——「一个有骨气的年轻人」。）");
      arr.push("你最后回望一眼面包店，转身穿过街口，往下一程赶路。");
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{}}
    ]
  };
};

// ============================================================
// v27 道德选择2：难民帮助
// ============================================================
N["moral_refugee_help"] = function(){
  plantMoralChoiceV27('refugee_help');
  return {
    place:"城门口",
    text:function(){
      const arr=[];
      arr.push("城门口有一群难民。");
      arr.push("");
      arr.push("他们从北方来——铁门关失守了，村庄被烧了，亲人死了。他们带着仅有的东西，往南逃。");
      arr.push("");
      arr.push("一个女人抱着孩子，跪在路边乞讨。孩子在哭，声音很弱——他饿了很久了。");
      arr.push("");
      arr.push("你口袋里有十个铜星。这是你全部的钱——够你吃三天，或者够他们吃一天。");
      arr.push("");
      arr.push("你可以把钱给他们。也可以走开。也可以只给一点。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      return arr;
    },
    options:[
      {t:"把所有的钱都给他们", go:"moral_refugee_all", effect:{gold:-10, karma:2, flag:"gave_all_to_refugees"}},
      {t:"给一半（5铜星）", go:"moral_refugee_half", effect:{gold:-5, karma:1, flag:"gave_half_to_refugees"}},
      {t:"只给1铜星", go:"moral_refugee_little", effect:{gold:-1, flag:"gave_little_to_refugees"}},
      {t:"走开，不给", go:"moral_refugee_none", effect:{karma:-1, san:-3, flag:"ignored_refugees"}}
    ]
  };
};

N["moral_refugee_all"] = function(){
  return {
    place:"城门口",
    text:function(){
      const arr=[];
      arr.push("你把十个铜星都给了那个女人。");
      arr.push("");
      arr.push("她愣了一下，然后哭了——不是悲伤的哭，是感激的哭。「谢谢你……谢谢你……」她反复说。");
      arr.push("");
      arr.push("孩子看着你，眼睛很大，很亮。");
      arr.push("");
      arr.push("你走开了，口袋空空的，但心里很满。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('classmate_seed');
      arr.push("（你后来才知道，那个女人的丈夫是铁门关的军官。他后来在学院找到了你，报答了你的恩情。）");
      arr.push("你与城门口作别，踏上旅途。尘土扑上靴面，像旧识。");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{}}]
  };
};

N["moral_refugee_half"] = function(){
  return {
    place:"城门口",
    text:function(){
      const arr=[];
      arr.push("你给了她五个铜星。");
      arr.push("");
      arr.push("她很感激，连声道谢。你留了五个铜星给自己——够吃一天半。");
      arr.push("");
      arr.push("你走开了，心里有点愧疚，但也知道自己不能什么都不给。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（这个选择，不好不坏。但人生大多数选择，都是这样。）");
      arr.push("别过城门口，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{}}]
  };
};

N["moral_refugee_little"] = function(){
  return {
    place:"城门口",
    text:function(){
      const arr=[];
      arr.push("你给了她一个铜星。");
      arr.push("");
      arr.push("她道了谢，但你从她的眼神里看到了失望——一个铜星，只够买半个面包。");
      arr.push("");
      arr.push("你走开了，心里有点不舒服。但你告诉自己：你已经尽力了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("你收拾停当，离开城门口，沿着来路踏上行程。");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{}}]
  };
};

N["moral_refugee_none"] = function(){
  return {
    place:"城门口",
    text:function(){
      const arr=[];
      arr.push("你走开了。");
      arr.push("");
      arr.push("你告诉自己：你也很穷，你帮不了所有人。");
      arr.push("");
      arr.push("但你走了很远，还能听到那个孩子的哭声。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      arr.push("（很多年以后，你还会想起那个孩子的哭声。你会想：如果当时给了他们钱，一切会不会不一样？）");
      arr.push("你离了城门口，脚步声在空旷处格外清晰。赶路要紧。");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{san:-2}}]
  };
};

// ============================================================
// v27 道德选择3：告密选择
// ============================================================
N["moral_informant"] = function(){
  plantMoralChoiceV27('informant');
  return {
    place:"邻居家",
    text:function(){
      const arr=[];
      arr.push("你发现了邻居的秘密。");
      arr.push("");
      arr.push("他是一个灵魂法师。你亲眼看到他用灵魂魔法——给一个生病的孩子治病。");
      arr.push("");
      arr.push("灵魂魔法在教会的辖区是异端。被发现的人，会被审判骑士带走，然后——你知道然后会怎样。");
      arr.push("");
      arr.push("但他救了那个孩子。那个孩子本来会死的。");
      arr.push("");
      arr.push("你可以告诉教会。你可以帮他隐瞒。你也可以装作什么都没看见。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      return arr;
    },
    options:[
      {t:"告诉教会", go:"moral_informant_reported", effect:{flag:"reported_soul_mage", relation:"neighbor:-100"}},
      {t:"帮他隐瞒", go:"moral_informant_hidden", effect:{flag:"hid_soul_mage", relation:"neighbor:+50"}},
      {t:"装作没看见", go:"moral_informant_ignored", effect:{flag:"ignored_soul_mage", san:-3}}
    ]
  };
};

N["moral_informant_reported"] = function(){
  return {
    place:"",
    text:function(){
      const arr=[];
      arr.push("你告诉了教会。");
      arr.push("");
      arr.push("审判骑士带走了他。他走的时候，看了你一眼——没有恨，只有悲伤。");
      arr.push("");
      arr.push("那个被他救过的孩子，又开始生病了。没有人能救他了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      arr.push("（教会给了你奖励——五个银月。你拿着钱，但你总觉得那钱是烫的。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{gold:60, san:-10}}]
  };
};

N["moral_informant_hidden"] = function(){
  return {tag:"easter",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你帮他隐瞒了。");
      arr.push("");
      arr.push("他很感激。「你是个好人。」他说，「以后如果有什么需要，随时来找我。」");
      arr.push("");
      arr.push("他教了你一些灵魂魔法的基础知识——虽然你还不能用，但你知道了它的原理。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('origin_clue');
      arr.push("（你后来才知道，他是墨丘利的旧友。他在给墨丘利的信里，提到了你。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{knowledge:1, relation:"neighbor:+50"}}]
  };
};

N["moral_informant_ignored"] = function(){
  return {
    place:"",
    text:function(){
      const arr=[];
      arr.push("你装作什么都没看见。");
      arr.push("");
      arr.push("你没有告诉教会，也没有帮他。你只是——走开了。");
      arr.push("");
      arr.push("后来，他被别人告发了。审判骑士带走了他。你听说的时候，心里很复杂——你本来可以救他的，但你没有。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      arr.push("（你告诉自己：这不关你的事。但你知道，这是谎话。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{san:-5}}]
  };
};

// ============================================================
// v27 道德选择4：战斗放过
// ============================================================
N["moral_combat_mercy"] = function(){
  plantMoralChoiceV27('combat_mercy');
  return {
    place:"小巷",
    text:function(){
      const arr=[];
      arr.push("一个人抢劫了你。");
      arr.push("");
      arr.push("他拿着刀，手在发抖。你看得出来——他不是惯犯，他只是饿了，或者走投无路了。");
      arr.push("");
      arr.push("你可以反击。你比他强壮，你可以把他打倒，甚至可以杀了他。");
      arr.push("");
      arr.push("你也可以放过他。给他一点钱，让他走。");
      arr.push("");
      arr.push("或者——你可以抢回去。把他的刀夺过来，把他的钱也拿走。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('eclipse_outer');
      return arr;
    },
    options:[
      {t:"反击，打倒他", go:"moral_combat_fought", effect:{check:"STR", tier:{
        crit:{t:"你一拳就把他打倒了。他躺在地上，捂着肚子，嘴里念叨着：「对不起……对不起……」你搜了他的身，找到了几个铜星。你拿走了他的刀，然后走了。", effect:{hp:-5, gold:3, item:"rusty_knife", flag:"beat_robber"}},
        ok:{t:"你们打了起来。你受了点伤，但最终把他打倒了。他跑了，你捡起了他掉在地上的几个铜星。", effect:{hp:-15, gold:5, flag:"beat_robber"}},
        fail:{t:"你们打了起来，但他比你想象的要强壮。你受了伤，他抢走了你口袋里的钱，然后跑了。", effect:{hp:-25, gold:-10, san:-5}},
        critfail:{t:"你被他打倒了。他抢走了你所有的钱，还踢了你两脚。你躺在巷子里，过了很久才爬起来。", effect:{hp:-35, gold:-20, san:-10}}
      }}},
      {t:"放过他，给他一点钱", go:"moral_combat_mercy_given", effect:{gold:-5, karma:2, flag:"spared_robber"}},
      {t:"夺刀，抢他的钱", go:"moral_combat_robbed", effect:{check:"AGI", tier:{
        crit:{t:"你动作很快，一把夺过了他的刀，然后搜了他的身——他口袋里有十几个铜星。你都拿走了。他跪在地上，求你还给他一点。你没有。", effect:{gold:15, item:"rusty_knife", karma:-3, san:-5, flag:"robbed_robber"}},
        ok:{t:"你夺过了他的刀，从他口袋里摸出了几个铜星。他求你别全拿走，你留了两个给他。", effect:{gold:8, item:"rusty_knife", karma:-1, san:-3}},
        fail:{t:"你想夺刀，但他握得很紧。你们拉扯了一会儿，最后他跑了。你什么都没得到，还差点被刀划到。", effect:{hp:-5}},
        critfail:{t:"你夺刀的时候，他反过来把你推倒了。他抢走了你的钱，然后跑了。你躺在地上，觉得自己很蠢。", effect:{hp:-15, gold:-10, san:-8}}
      }}}
    ]
  };
};

N["moral_combat_fought"] = function(){
  return {tag:"branch",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你打倒了他。");
      arr.push("");
      arr.push("他躺在地上，你站在他旁边。你忽然觉得——他和你差不多大。也许他也有家人，也许他也是走投无路了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('classmate_seed');
      arr.push("（你后来才知道，他叫什么名字。他后来也去了学院——你们成了同学。他不记得你了，但你记得他。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{}}]
  };
};

N["moral_combat_mercy_given"] = function(){
  return {tag:"branch",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你放过了他，还给了他五个铜星。");
      arr.push("");
      arr.push("他愣住了，然后哭了——一个大男人，蹲在地上哭。「谢谢你……谢谢你……我已经三天没吃东西了……」");
      arr.push("");
      arr.push("他告诉你他叫什么，说以后一定会报答你。然后他跑了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('eclipse_outer');
      arr.push("（你后来才知道，他加入了暗蚀会——不是因为他坏，是因为他走投无路。但他一直记得你。在你最危险的时候，他帮了你一把。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{}}]
  };
};

N["moral_combat_robbed"] = function(){
  return {tag:"branch",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你抢了他。");
      arr.push("");
      arr.push("他跪在地上求你，但你没有停手。你拿走了他的钱和刀，然后走了。");
      arr.push("");
      arr.push("你后来才知道，他那几个铜星是给他生病的母亲买药的钱。他母亲因为没有药，死了。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      arr.push("（他后来成了暗蚀会的骨干。他一直在找你——不是为了报答，是为了复仇。）");
      return arr;
    },
    options:[{t:"继续", go:"prologue_hub", effect:{san:-5}}]
  };
};

// ============================================================
// v27 隐藏路线1：守望者密探路线
// ============================================================
N["hidden_watcher_intro"] = function(){
  return {tag:"easter",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你注意到了。");
      arr.push("");
      arr.push("从序章开始，就有一个人在远处看你。你不确定他是谁，但你能感觉到他的视线。");
      arr.push("");
      arr.push("今天，你决定主动去找他。");
      arr.push("");
      arr.push("你在一个巷子里堵住了他——一个穿灰袍的中年人，脸上有一道旧伤疤。");
      arr.push("");
      arr.push("「你终于发现我了。」他说，语气里有一丝赞赏，「我是守望者的人。我们观察你很久了——你有某种特质，某种我们需要的特质。」");
      arr.push("");
      plantForeshadowV27('watcher_spy');
      return arr;
    },
    options:[
      {t:"问他守望者是什么", go:"hidden_watcher_explain", effect:{}},
      {t:"问他为什么观察我", go:"hidden_watcher_explain", effect:{}},
      {t:"不想和你们有任何关系", go:"prologue_hub", effect:{flag:"rejected_watcher", san:-2}}
    ]
  };
};

N["hidden_watcher_explain"] = function(){
  return {tag:"easter",
    place:"",
    text:function(){
      const arr=[];
      arr.push("他告诉你守望者的事——一个秘密组织，守护着七印的真相，监视着深渊的动向。");
      arr.push("");
      arr.push("「黄林晶建造七印的时候，留下了守望者。」他说，「我们的使命是确保七印不被破坏，确保原初之物不被释放。但最近……事情变得复杂了。」");
      arr.push("");
      arr.push("「我们观察你，是因为你有「能看到符文的眼睛」——这是一种很罕见的天赋。守望者需要这样的人。」");
      arr.push("");
      arr.push("他给了你一个徽章：「如果你愿意加入守望者，带着这个徽章去学院，找一个叫奥雷利安的人。他会告诉你更多。」");
      arr.push("");
      plantForeshadowV27('origin_clue');
      plantForeshadowV27('hlj_letter');
      return arr;
    },
    options:[
      {t:"接受徽章，加入守望者", go:"prologue_hub", effect:{item:"watcher_badge", flag:"watcher_recruit", knowledge:1}},
      {t:"接受徽章，但不承诺什么", go:"prologue_hub", effect:{item:"watcher_badge", flag:"watcher_curious"}},
      {t:"拒绝，把徽章还给他", go:"prologue_hub", effect:{flag:"rejected_watcher", san:-2}}
    ]
  };
};

// ============================================================
// v27 隐藏路线2：暗蚀会招募路线
// ============================================================
N["hidden_eclipse_intro"] = function(){
  return {tag:"easter",
    place:"",
    text:function(){
      const arr=[];
      arr.push("一个穿黑袍的人找到了你。");
      arr.push("");
      arr.push("「我观察你很久了。」他说，「你有能力，也有野心。你不满足于现状——你想改变这个世界。」");
      arr.push("");
      arr.push("「我们是暗蚀会。」他的声音很低，「我们相信七印是错误的，原初之物应该被解放。教会和守望者都在撒谎——他们告诉你原初之物是怪物，但实际上，它们是这个世界的一部分。」");
      arr.push("");
      arr.push("「加入我们。你会获得力量，获得知识，获得改变世界的机会。」");
      arr.push("");
      plantForeshadowV27('eclipse_outer');
      plantForeshadowV27('npc_lie');
      return arr;
    },
    options:[
      {t:"同意加入暗蚀会", go:"prologue_hub", effect:{flag:"eclipse_recruit", gold:20, knowledge:1, san:-5}},
      {t:"假装同意，暗中观察", go:"prologue_hub", effect:{flag:"eclipse_infiltrator", knowledge:1}},
      {t:"拒绝，并警告他", go:"prologue_hub", effect:{flag:"rejected_eclipse", relation:"eclipse:-20"}}
    ]
  };
};

// ============================================================
// v27 隐藏路线3：原初之物共鸣路线
// ============================================================
N["hidden_primordial_intro"] = function(){
  return {tag:"easter",
    place:"",
    text:function(){
      const arr=[];
      arr.push("你又听到了那个声音。");
      arr.push("");
      arr.push("从序章开始，你就偶尔会听到一个声音——不是从耳朵里听到的，是从骨头里。它在说你的名字。");
      arr.push("");
      arr.push("今天，声音变得清晰了。");
      arr.push("");
      arr.push("「你能听到我。」它说，「很少有人能听到我。你很特别。」");
      arr.push("");
      arr.push("「我是谁？我是原初之物。比七印更古老，比深渊更古老。我是这个宇宙的情感本身。黄林晶把我们分割成了七份，封印在七印里。但我们没有死——我们在沉睡，在等待。」");
      arr.push("");
      plantForeshadowV27('primordial_whisper');
      plantForeshadowV27('seal_omen');
      arr.push("「你可以选择帮助我们。也可以选择帮助黄林晶的继承者。也可以选择走你自己的路。但你要知道——你听到了我的声音，这意味着你已经被卷入了。」");
      return arr;
    },
    options:[
      {t:"问它更多关于七印的真相", go:"prologue_hub", effect:{knowledge:2, san:-8, flag:"primordial_contact"}},
      {t:"拒绝听它的声音", go:"prologue_hub", effect:{san:-3, flag:"resisted_primordial"}},
      {t:"问它能给我什么", go:"prologue_hub", effect:{knowledge:1, san:-5, flag:"primordial_deal"}}
    ]
  };
};

// ============================================================
// v27 多线并行：11名同学的序章片段（传闻形式）
// ============================================================
const CLASSMATE_PROLOGUES_V27 = [
  {id:"classmate_01", name:"塞西莉亚", origin:"自由城邦", summary:"她是自由城邦一个贵族的女儿，据说入学考试第一名。但有人说她的家族和暗蚀会有关系——只是传闻。", rumor:"听说塞西莉亚在自由城邦的时候，经常深夜外出。没人知道她去了哪里。"},
  {id:"classmate_02", name:"马库斯", origin:"北方公国", summary:"铁门关失守后，他的村庄被毁了。他一个人从北方走到了学院，据说在路上杀了三个山贼。", rumor:"马库斯从来不提他的家人。有人说他的家人都死了，也有人说他是逃出来的——丢下了家人。"},
  {id:"classmate_03", name:"艾尔文", origin:"自由城邦", summary:"入学考试第二名，据说过目不忘。但他的身体不太好，经常咳嗽。", rumor:"艾尔文的父亲是学院的教授。有人说他是靠关系进来的——但他的成绩确实很好。"},
  {id:"classmate_04", name:"莉莉安", origin:"光明教会", summary:"圣城唱诗班出身，据说有神启的天赋。但她的哥哥在净化令中被带走了——原因不明。", rumor:"莉莉安从来不提她的哥哥。有人说他是灵魂法师，也有人说他是被冤枉的。"},
  {id:"classmate_05", name:"艾兰迪尔", origin:"精灵王国", summary:"精灵王室保送的学生，据说能听到世界树的声音。他来人类学院的原因——精灵王室说是「交流」，但有人说他是在「避难」。", rumor:"艾兰迪尔来学院之前，银叶城发生了一些事——精灵长老们封锁了消息。没人知道发生了什么。"},
  {id:"classmate_06", name:"格林", origin:"矮人王国", summary:"铁峰堡最好的年轻铁匠，据说能打造出魔法武器。但他离开铁峰堡的原因——据说是和矮人王吵了一架。", rumor:"格林离开铁峰堡的时候，带走了一块奇怪的金属。矮人王派人追过他，但没追到。"},
  {id:"classmate_07", name:"古拉格", origin:"兽人王庭", summary:"兽人部落的战士学徒，据说在萨满仪式上看到了「命运」。他来学院是为了寻找答案——关于第二印的答案。", rumor:"古拉格的部落在内战中分裂了。他来学院，有人说是为了寻找外援，也有人说是为了逃命。"},
  {id:"classmate_08", name:"陈", origin:"东部王国", summary:"承天山书院的学生，据说懂古文。他来学院的原因——据说是玄机子推荐的。", rumor:"陈在承天山的时候，据说看到了时光裂隙。有人说他从裂隙里拿到了什么东西——但他从来不提。"},
  {id:"classmate_09", name:"莎拉", origin:"南方商业城邦", summary:"南方港城商人的女儿，据说很会做生意。但她的商船在海上遇到了风暴——她是唯一的幸存者。", rumor:"莎拉的商船不是遇到了风暴——是被暗蚀会劫持了。她逃了出来，但据说她带走了暗蚀会的什么东西。"},
  {id:"classmate_10", name:"无名", origin:"沙漠边境", summary:"没人知道他从哪里来。他出现在学院门口的时候，身上只有一封信——黄林晶的信。", rumor:"那个沙漠来的学生，据说能听到原初之物的声音。有人说他是被选中的人，也有人说他是被诅咒的人。"},
  {id:"classmate_11", name:"林", origin:"自由城邦", summary:"和你同坐一辆商队来学院的少年。话不多，但很可靠。他的过去——他不说，你也没问。", rumor:"林的家族在自由城邦很有势力。但他从来不提他的家人——有人说他是离家出走的。"}
];

/* /v62inj:chunk-npc/ N["classmate_prologues_rumor"] 已移入 chunks/v62_npc.js */
// ============================================================
// v27 序章回顾节点
// ============================================================
N["prologue_review"] = function(){
  return {
    place:"序章回顾",
    text:function(){
      const arr=[];
      arr.push("【序章回顾】");
      arr.push("");
      arr.push("你在出身地度过了" + (S.prologueTime ? S.prologueTime.day : 7) + "天。");
      arr.push("");
      arr.push("在这段时间里——");
      arr.push("");
      if(S.moralChoices){
        for(const k in S.moralChoices){
          if(S.moralChoices[k].planted && S.moralChoices[k].choice){
            arr.push("· 你做出了选择：" + MORAL_CHOICES_V27[k].name + " —— " + S.moralChoices[k].choice);
          }
        }
      }
      arr.push("");
      if(S.foreshadowing){
        let planted = 0;
        for(const k in S.foreshadowing){
          if(S.foreshadowing[k].planted) planted++;
        }
        arr.push("你种下了" + planted + "条伏笔。它们会在以后的某一天，以某种方式回到你面前。");
      }
      arr.push("");
      arr.push("你见了一些人，做了一些选择，错过了一些事。");
      arr.push("");
      arr.push("然后你出发了。经过了几天的旅程，你到达了学院。");
      arr.push("");
      arr.push("你的学院生活，即将开始。");
      arr.push("");
      arr.push("（但你在序章做的一切，都不会被遗忘。）");
      return arr;
    },
    options:[
      {t:"进入学院", go:"orientation_day1", effect:{}}
    ]
  };
};

console.log("[v27 bc] 道德灰色选择 + 隐藏路线 + 多线并行已加载");


// ============================================================
// v28 多学院体系数据
// ============================================================
const ACADEMIES_V28 = {
  // 人类三大顶尖学院
  elda_main: {
    id:"elda_main", name:"艾尔达大陆学院", cn:"艾尔达大陆学院",
    location:"交汇城", type:"top_human",
    desc:"大陆最古老的综合学院，中立立场，灵魂魔法与七印研究独步大陆。表面学术自由，水下暗流涌动。",
    strengths:["灵魂魔法","七印研究","综合学术","古代史"],
    factions:["光明派","自由派","暗蚀会支部"],
    prestige:95, ranking:1,
    admission:{type:"exam", difficulty:"normal", requirement:"无特殊要求"},
    tuition:50,
    schedule:{morning:"早课", noon:"午饭", afternoon:"实验/选修", dusk:"自由活动", night:"宵禁"},
    startNode:"academy_elda_year1"
  },
  holy_seminary: {
    id:"holy_seminary", name:"圣光神学院", cn:"圣光神学院",
    location:"圣城", type:"top_human",
    desc:"光明教会控制的神学院，神圣魔法与神学的最高学府。入学需信仰测试，灵魂魔法天赋者拒收。",
    strengths:["神圣魔法","神学","教会法","净化术"],
    factions:["正统派","改革派","异端调查派"],
    prestige:92, ranking:2,
    admission:{type:"faith", difficulty:"hard", requirement:"教会推荐/信仰测试/无灵魂魔法天赋"},
    tuition:30,
    schedule:{morning:"晨祷", noon:"神学课", afternoon:"圣术训练", dusk:"晚祷", night:"禁足"},
    startNode:"academy_holy_year1"
  },
  imperial_military: {
    id:"imperial_military", name:"帝国军事学院", cn:"帝国军事学院",
    location:"承天山", type:"top_human",
    desc:"东部王国军方控制的军事学院，战斗与战略的最高学府。铁血纪律，实战为主，贵族出身优先。",
    strengths:["战斗","战略","军事工程","军团指挥"],
    factions:["主战派","主和派","秘密研究派"],
    prestige:90, ranking:3,
    admission:{type:"martial", difficulty:"hard", requirement:"武力测试/军方推荐/贵族优先"},
    tuition:40,
    schedule:{morning:"晨练", noon:"战术课", afternoon:"实战演练", dusk:"军事会议", night:"巡逻"},
    startNode:"academy_military_year1"
  },
  // 种族顶尖学院
  silver_leaf: {
    id:"silver_leaf", name:"银叶学院", cn:"银叶学院",
    location:"精灵王国·银叶城", type:"top_elf",
    desc:"精灵最高学府，自然魔法与古代史的圣地。学制极长（精灵50年=人类5年），人类学生需王室特批。",
    strengths:["自然魔法","古代史","艺术","预言"],
    factions:["传统派","融合派","秘密守望派"],
    prestige:88, ranking:4,
    admission:{type:"royal", difficulty:"very_hard", requirement:"精灵王室特批/自然魔法天赋"},
    tuition:0,
    schedule:{morning:"冥想", noon:"自然课", afternoon:"艺术/星象", dusk:"森林漫步", night:"守夜"},
    startNode:"academy_elf_year1"
  },
  ironpeak_forge: {
    id:"ironpeak_forge", name:"铁峰锻造学院", cn:"铁峰锻造学院",
    location:"矮人王国·铁峰堡", type:"top_dwarf",
    desc:"矮人最高学府，锻造与工程的殿堂。地下教学，没有昼夜概念，实践为主，人类学生需匠会推荐。",
    strengths:["锻造","工程","炼金","矿物学"],
    factions:["匠派","商派","熔炉研究派"],
    prestige:85, ranking:5,
    admission:{type:"craft", difficulty:"hard", requirement:"矮人匠会推荐/锻造天赋"},
    tuition:0,
    schedule:{morning:"锻造", noon:"工程课", afternoon:"炼金实验", dusk:"匠会会议", night:"轮班"},
    startNode:"academy_dwarf_year1"
  },
  war_god: {
    id:"war_god", name:"战神学院", cn:"战神学院",
    location:"兽人王庭", type:"top_orc",
    desc:"兽人战士与萨满学院，实战为主，每年有试炼仪式，死亡率高。人类学生需通过生死试炼。",
    strengths:["近战","萨满术","生存","战史"],
    factions:["战派","萨满派","和平派"],
    prestige:82, ranking:6,
    admission:{type:"trial", difficulty:"very_hard", requirement:"通过生死试炼/兽人萨满认可"},
    tuition:0,
    schedule:{morning:"战斗训练", noon:"萨满课", afternoon:"狩猎", dusk:"篝火故事", night:"试炼"},
    startNode:"academy_orc_year1"
  },
  green_field: {
    id:"green_field", name:"绿野学院", cn:"绿野学院",
    location:"半身人领地", type:"top_halfling",
    desc:"半身人学院，农业与烹饪的天堂，氛围轻松。隐藏着古老的幸运魔法传承，不对外公开。",
    strengths:["农业","烹饪","草药","幸运魔法"],
    factions:["田园派","商旅派","秘密幸运派"],
    prestige:70, ranking:8,
    admission:{type:"open", difficulty:"easy", requirement:"无特殊要求"},
    tuition:10,
    schedule:{morning:"农事", noon:"烹饪课", afternoon:"草药/午睡", dusk:"聚餐", night:"休息"},
    startNode:"academy_halfling_year1"
  },
  // 龙族学院遗迹
  dragon_ruins: {
    id:"dragon_ruins", name:"龙语学院遗迹", cn:"龙语学院遗迹",
    location:"龙族故地（已毁）", type:"ruins",
    desc:"龙族学院遗迹，已毁千年。仅存遗迹，可探索。隐藏龙族灭族真相、龙语传承、龙蛋线索。",
    strengths:["龙语","龙魔法","古代知识"],
    factions:[],
    prestige:0, ranking:0,
    admission:{type:"explore", difficulty:"extreme", requirement:"找到遗迹入口/掌握龙语"},
    tuition:0,
    schedule:{},
    startNode:"academy_dragon_ruins"
  },
  // 普通学院（8所）
  free_city_business: {
    id:"free_city_business", name:"自由城邦商学院", cn:"自由城邦商学院",
    location:"交汇城", type:"normal",
    desc:"自由城邦的商业学院，贸易与金融的实用学府。毕业生多进入商会。",
    strengths:["商业","贸易","金融"],
    factions:["商派","学徒派"],
    prestige:60, ranking:10,
    admission:{type:"gold", difficulty:"easy", requirement:"支付学费即可"},
    tuition:80,
    schedule:{morning:"商业课", noon:"贸易实习", afternoon:"算账", dusk:"社交", night:"自由"},
    startNode:"academy_business_year1"
  },
  northern_warrior: {
    id:"northern_warrior", name:"北方战士学院", cn:"北方战士学院",
    location:"铁门关", type:"normal",
    desc:"北方边境的战士学院，培养边防军。条件艰苦，但实战经验丰富。",
    strengths:["边防战","生存","近战"],
    factions:["守军派","佣兵派"],
    prestige:55, ranking:12,
    admission:{type:"martial", difficulty:"normal", requirement:"通过基础武力测试"},
    tuition:20,
    schedule:{morning:"训练", noon:"战术", afternoon:"巡逻", dusk:"休整", night:"守夜"},
    startNode:"academy_northern_year1"
  },
  southern_navigation: {
    id:"southern_navigation", name:"南方航海学院", cn:"南方航海学院",
    location:"南方港城", type:"normal",
    desc:"南方港口的航海学院，培养航海士与商人。海洋魔法独树一帜。",
    strengths:["航海","贸易","海洋魔法"],
    factions:["船长派","学者派"],
    prestige:58, ranking:11,
    admission:{type:"exam", difficulty:"normal", requirement:"通过入学考试"},
    tuition:40,
    schedule:{morning:"航海课", noon:"海洋魔法", afternoon:"船上实习", dusk:"靠岸", night:"航行"},
    startNode:"academy_southern_year1"
  },
  eastern_literature: {
    id:"eastern_literature", name:"东部文学院", cn:"东部文学院",
    location:"承天山", type:"normal",
    desc:"东部王国的文学院，文学与历史的学府。毕业生多进入官场或成为学者。",
    strengths:["文学","历史","政治"],
    factions:["古文派","新文派"],
    prestige:62, ranking:9,
    admission:{type:"exam", difficulty:"normal", requirement:"通过文学考试"},
    tuition:35,
    schedule:{morning:"文学课", noon:"历史课", afternoon:"写作", dusk:"诗会", night:"苦读"},
    startNode:"academy_eastern_year1"
  },
  western_ranger: {
    id:"western_ranger", name:"西部游侠学院", cn:"西部游侠学院",
    location:"西海岸", type:"normal",
    desc:"西海岸的游侠学院，培养游侠与探险家。自由散漫，但生存能力极强。",
    strengths:["游侠","航海","生存"],
    factions:["游侠派","探险家派"],
    prestige:50, ranking:13,
    admission:{type:"trial", difficulty:"normal", requirement:"通过野外生存测试"},
    tuition:25,
    schedule:{morning:"野外训练", noon:"导航课", afternoon:"探险", dusk:"扎营", night:"守夜"},
    startNode:"academy_western_year1"
  },
  church_law: {
    id:"church_law", name:"教会法学院", cn:"教会法学院",
    location:"圣城", type:"normal",
    desc:"圣城的法学院，培养教会法官与审判官。与圣光神学院共享部分师资。",
    strengths:["教会法","审判","神学"],
    factions:["严法派","宽法派"],
    prestige:65, ranking:7,
    admission:{type:"faith", difficulty:"normal", requirement:"教会推荐/信仰测试"},
    tuition:30,
    schedule:{morning:"法条", noon:"案例分析", afternoon:"审判实习", dusk:"祷告", night:"禁足"},
    startNode:"academy_law_year1"
  },
  dwarf_engineering: {
    id:"dwarf_engineering", name:"矮人工程学院", cn:"矮人工程学院",
    location:"铁峰堡", type:"normal",
    desc:"矮人的工程学院，培养工程师与建筑师。比铁峰锻造学院更偏理论。",
    strengths:["工程","建筑","机械"],
    factions:["工程派","建筑派"],
    prestige:52, ranking:14,
    admission:{type:"craft", difficulty:"normal", requirement:"基础工艺测试"},
    tuition:0,
    schedule:{morning:"工程课", noon:"制图", afternoon:"工地实习", dusk:"匠会", night:"轮班"},
    startNode:"academy_dwarfeng_year1"
  },
  elf_art: {
    id:"elf_art", name:"精灵艺术学院", cn:"精灵艺术学院",
    location:"银叶城", type:"normal",
    desc:"精灵的艺术学院，培养艺术家与诗人。人类学生极少。",
    strengths:["艺术","音乐","诗歌"],
    factions:["古典派","现代派"],
    prestige:56, ranking:15,
    admission:{type:"talent", difficulty:"hard", requirement:"艺术天赋测试"},
    tuition:0,
    schedule:{morning:"艺术课", noon:"自然冥想", afternoon:"创作", dusk:"演奏会", night:"灵感"},
    startNode:"academy_elfart_year1"
  }
};

// ============================================================
// v28 学院排名体系
// ============================================================
const ACADEMY_RANKINGS_V28 = {
  criteria:["学术成就","毕业生成就","资源","影响力","秘密研究"],
  currentRankings:[
    {rank:1, id:"elda_main", score:95, trend:"stable"},
    {rank:2, id:"holy_seminary", score:92, trend:"up"},
    {rank:3, id:"imperial_military", score:90, trend:"down"},
    {rank:4, id:"silver_leaf", score:88, trend:"stable"},
    {rank:5, id:"ironpeak_forge", score:85, trend:"stable"},
    {rank:6, id:"war_god", score:82, trend:"up"},
    {rank:7, id:"church_law", score:65, trend:"stable"},
    {rank:8, id:"green_field", score:70, trend:"stable"},
    {rank:9, id:"eastern_literature", score:62, trend:"down"},
    {rank:10, id:"free_city_business", score:60, trend:"up"},
    {rank:11, id:"southern_navigation", score:58, trend:"stable"},
    {rank:12, id:"northern_warrior", score:55, trend:"stable"},
    {rank:13, id:"western_ranger", score:50, trend:"stable"},
    {rank:14, id:"dwarf_engineering", score:52, trend:"stable"},
    {rank:15, id:"elf_art", score:56, trend:"stable"}
  ]
};

// ============================================================
// v28 学院间关系
// ============================================================
const ACADEMY_RELATIONS_V28 = {
  elda_main: {
    holy_seminary:{relation:"competition", desc:"学术竞争，教会经常干预艾尔达的灵魂魔法研究"},
    imperial_military:{relation:"cooperation", desc:"联合研究战略魔法，交换生项目"},
    silver_leaf:{relation:"friendly", desc:"精灵教授常来艾尔达讲学，有联合考古项目"},
    ironpeak_forge:{relation:"trade", desc:"矮人锻造师为艾尔达提供实验设备"},
    war_god:{relation:"distant", desc:"交流很少，但兽人战士偶尔来交流战技"},
    free_city_business:{relation:"friendly", desc:"同城学院，共享部分资源"}
  },
  holy_seminary: {
    elda_main:{relation:"competition", desc:"视艾尔达的灵魂魔法为异端，经常派监察员"},
    imperial_military:{relation:"alliance", desc:"教会支持军方，军方保护教会"},
    church_law:{relation:"friendly", desc:"同属教会体系，共享师资"},
    war_god:{relation:"hostile", desc:"视兽人为异端，经常发生冲突"}
  },
  imperial_military: {
    elda_main:{relation:"cooperation", desc:"联合研究战略魔法"},
    holy_seminary:{relation:"alliance", desc:"教会支持军方"},
    northern_warrior:{relation:"friendly", desc:"北方战士学院为军方输送人才"},
    eastern_literature:{relation:"distant", desc:"文人与军人互相看不起"}
  },
  silver_leaf: {
    elda_main:{relation:"friendly", desc:"联合考古项目"},
    elf_art:{relation:"friendly", desc:"同城精灵学院"},
    ironpeak_forge:{relation:"distant", desc:"精灵与矮人关系冷淡"},
    holy_seminary:{relation:"hostile", desc:"教会视精灵自然魔法为异端"}
  },
  ironpeak_forge: {
    elda_main:{relation:"trade", desc:"提供实验设备"},
    dwarf_engineering:{relation:"friendly", desc:"同城矮人学院"},
    silver_leaf:{relation:"distant", desc:"矮人精灵关系冷淡"},
    imperial_military:{relation:"trade", desc:"为军方提供武器"}
  }
};

// ============================================================
// v28 学院初始化函数
// ============================================================
function initAcademyV28(){
  if(!S.academy){
    S.academy = {
      currentAcademy:"elda_main",
      appliedAcademy:[],
      transferred:false,
      exchangeProgram:null,
      alumniNetwork:{},
      ranking:JSON.parse(JSON.stringify(ACADEMY_RANKINGS_V28.currentRankings)),
      year:1,
      semester:1,
      courses:[],
      grades:{},
      reputation:0
    };
  }
  if(!S.academyPolitics) S.academyPolitics = {};
  if(!S.academySecrets) S.academySecrets = {discovered:[]};
  if(!S.classmateStories) S.classmateStories = {};
  if(!S.academyForeshadowing) S.academyForeshadowing = {};
  if(!S.graduation) S.graduation = {graduated:false, destination:null, alumni:[]};
}

function getAcademyV28(id){
  return ACADEMIES_V28[id] || ACADEMIES_V28.elda_main;
}

function getCurrentAcademyV28(){
  initAcademyV28();
  return getAcademyV28(S.academy.currentAcademy);
}

// ============================================================
// v28 入学选择节点（创建角色后）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_choice_intro"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_choice_more"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_choice_normal"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 入学考试节点（每所学院1个，详细考试在be/bf/bg中）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_admission_elda"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_exam"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_admitted"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_detail"] 已移入 chunks/v62_academy.js */
// 圣光神学院入学
/* /v62inj:chunk-academy/ N["academy_admission_holy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_exam"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_admitted"] 已移入 chunks/v62_academy.js */
// 帝国军事学院入学
/* /v62inj:chunk-academy/ N["academy_admission_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_exam"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_admitted"] 已移入 chunks/v62_academy.js */
// 种族学院入学（简化版，详细在bg.py）
/* /v62inj:chunk-academy/ N["academy_admission_elf"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_dwarf"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_orc"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_halfling"] 已移入 chunks/v62_academy.js */
// 普通学院入学（统一简化版）
/* /v62inj:chunk-academy/ N["academy_admission_business"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_northern"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_southern"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_eastern"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_western"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_law"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_dwarfeng"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_elfart"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_admission_village"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院排名查看节点
// ============================================================
/* /v62inj:chunk-academy/ N["academy_rankings_view"] 已移入 chunks/v62_academy.js */
console.log("[v28 bd] 多学院体系数据 + 排名 + 关系 + 入学选择系统已加载");


// ============================================================
// v28 艾尔达学院五大学院系
// ============================================================
const ELDA_DEPARTMENTS_V28 = {
  magic: {name:"魔法院", dean:"墨丘利", desc:"元素魔法与理论研究的最高殿堂。墨丘利任院长，灵魂魔法研究独步大陆。", courses:["元素魔法理论","高阶咒文","魔法史","灵魂魔法入门","符文研究"], factions:["理论派","实践派","灵魂派"]},
  combat: {name:"战斗院", dean:"雷蒙德", desc:"近战与远程战斗的训练基地。雷蒙德将军任院长，退伍军人任教。", courses:["剑术基础","格斗术","战术理论","战场急救","军团指挥"], factions:["荣誉派","实用派","佣兵派"]},
  soul: {name:"灵魂院", dean:"墨丘利(兼)", desc:"灵魂魔法与亡者研究的院系。被教会视为异端，但在艾尔达是正式院系。", courses:["灵魂感知","亡者沟通","灵魂修复","禁忌研究","灵魂与七印"], factions:["保守派","激进派","守望者派"]},
  theology: {name:"神学院", dean:"格雷戈里", desc:"神学与神圣魔法的研究。教会派驻的院长，与灵魂院关系紧张。", courses:["神学基础","神圣魔法","教会法","圣物研究","异端识别"], factions:["正统派","改革派","秘密调查派"]},
  commerce: {name:"商工院", dean:"美第奇(荣誉)", desc:"商业、贸易与工艺的院系。美第奇家族荣誉院长，培养商人和工匠。", courses:["商业理论","贸易实务","炼金术基础","工艺学","会计学"], factions:["商派","匠派","学者派"]}
};

// ============================================================
// v28 艾尔达学院教授团队
// ============================================================
const ELDA_PROFESSORS_V28 = {
  mercury: {name:"墨丘利", dept:"魔法院/灵魂院", title:"院长", secret:"守望者成员/塞拉芬守护者", faction:"自由派", story:"三百年前的灵魂魔法大师，外表年轻，真实年龄成谜。他在等一个人——或者说，在等一个能看到符文的人。"},
  raymond: {name:"雷蒙德", dept:"战斗院", title:"战斗院主任", secret:"退伍将军/战争罪行", faction:"中立", story:"北方战争的退伍将军，脸上有一道长长的伤疤。他从不提战争中的事——但他的梦里，全是战火。"},
  gregory: {name:"格雷戈里", dept:"神学院", title:"神学院主任", secret:"教会间谍/异端调查派", faction:"光明派", story:"教会派驻的神学院主任，表面温和，实际是教会异端调查派的成员。他在监视灵魂院的每一个人。"},
  elena: {name:"艾琳娜", dept:"魔法院", title:"元素魔法教授", secret:"暗蚀会外围/家族被教会迫害", faction:"暗蚀会支部", story:"美丽的元素魔法教授，学生们都喜欢她。但她的家族在净化令中被教会迫害——她加入暗蚀会，是为了复仇。"},
  marcus_sr: {name:"老马库斯", dept:"战斗院", title:"战术教授", secret:"学生的父亲/失踪的妻子", faction:"中立", story:"战斗院的战术教授，严厉但公正。他的妻子在十年前失踪了——他一直在找她，但没人知道她去了哪里。"},
  sophia: {name:"索菲亚", dept:"灵魂院", title:"灵魂魔法教授", secret:"塞拉芬的后裔/能听到亡者", faction:"自由派", story:"灵魂院最年轻的教授，能听到亡者的声音。她是塞拉芬的后裔——但她自己不知道。墨丘利一直在保护她。"},
  thomas: {name:"托马斯", dept:"神学院", title:"教会法教授", secret:"改革派/反对净化令", faction:"自由派", story:"教会法教授，温和的改革派。他私下反对净化令，但不敢公开说——他的哥哥就是因为反对净化令而被「调离」的。"},
  lorenzo: {name:"洛伦佐", dept:"商工院", title:"商业教授", secret:"美第奇家族旁系/情报贩子", faction:"中立", story:"商工院的商业教授，美第奇家族旁系。他是大陆上最好的情报贩子之一——只要你出得起价，他什么都能查到。"},
  boris: {name:"鲍里斯", dept:"商工院", title:"炼金术教授", secret:"矮人混血/永恒熔炉研究", faction:"自由派", story:"炼金术教授，有矮人血统。他在研究永恒熔炉的秘密——但他的研究，可能会唤醒第四印的原初之物。"},
  victoria: {name:"维多利亚", dept:"魔法院", title:"符文教授", secret:"黄林晶的后裔/能解读古符文", faction:"自由派", story:"符文教授，黄林晶的后裔。她能解读七印上的古符文——但她不知道自己的血脉意味着什么。墨丘利一直在观察她。"},
  old_chen: {name:"老陈", dept:"神学院", title:"历史教授", secret:"穿越者/知道未来", faction:"中立", story:"历史教授，来自东部王国。他知道一些不该知道的历史——他说他是「从书里看到的」，但没人信。"},
  anna: {name:"安娜", dept:"战斗院", title:"急救教授", secret:"战地医生/救过暗蚀会成员", faction:"中立", story:"战斗院的急救教授，曾经的战地医生。她在战争中救过一个暗蚀会成员——那个人后来成了暗蚀会的骨干，一直记得她的恩情。"}
};

// ============================================================
// v28 艾尔达学院派系政治
// ============================================================
const ELDA_FACTIONS_V28 = {
  light: {name:"光明派", leader:"格雷戈里", support:"教会", goal:"加强教会对学院的控制，限制灵魂魔法研究", members:["格雷戈里","部分神学院教授","教会背景学生"], power:35},
  freedom: {name:"自由派", leader:"墨丘利", support:"教授自治会", goal:"维护学术自由，反对教会干预", members:["墨丘利","索菲亚","托马斯","多数魔法院教授"], power:40},
  eclipse: {name:"暗蚀会支部", leader:"艾琳娜(外围)", support:"暗蚀会", goal:"在学院内发展成员，研究禁忌知识", members:["艾琳娜","部分学生","秘密社团"], power:15},
  neutral: {name:"中立派", leader:"雷蒙德", support:"无", goal:"不参与政治，专注教学", members:["雷蒙德","老马库斯","老陈","安娜"], power:10}
};

// ============================================================
// v28 艾尔达学院秘密区域
// ============================================================
const ELDA_SECRETS_V28 = {
  forbidden_library: {name:"禁书区", levels:3, desc:"图书馆地下三层，藏有禁忌书籍。第一层需教授批准，第二层需院长批准，第三层——没人知道怎么进。", secret:"第三层有黄林晶的亲笔笔记和七印的完整图纸", access:"教授批准/潜行/暗号"},
  underground_ruins: {name:"地下遗迹", levels:5, desc:"学院建在古代遗迹之上。地下有五层遗迹，最深处与第一印的碎片相连。", secret:"第一印的碎片在学院地下，它在影响学院的每一个人", access:"特定入口/属性要求/知识要求"},
  soul_tower: {name:"灵魂魔法塔", levels:7, desc:"墨丘利的领地，塔顶是他的住所。塔的每一层都有不同的灵魂魔法实验。", secret:"塔顶封印着塞拉芬的一部分灵魂", access:"墨丘利邀请/灵魂魔法天赋"},
  hidden_passages: {name:"秘密通道", desc:"学院建筑之间有古老的秘密通道，用于深夜活动和秘密会面。", secret:"暗蚀会支部使用这些通道进行秘密活动", access:"发现入口/地图"},
  headmaster_office: {name:"院长办公室", desc:"墨丘利的办公室，据说里面有守望者的秘密档案。", secret:"档案里有关于你的记录——从你出生那天开始", access:"墨丘利允许/特殊事件"}
};

// ============================================================
// v28 艾尔达学院日程枢纽
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_hub"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院课程系统
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_class"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院图书馆
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_library"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_forbidden_1"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院社交
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_mercury"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_classmate"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院探索（秘密区域）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_explore"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_ruins"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_passage"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_soul_tower"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院第一年事件：入学危机
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_year1_crisis"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_year1_investigate"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院第二年事件：院际大赛
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_year2_tournament"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elda_tournament_magic"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院第三年事件：实习
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_year3_internship"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院第四年事件：政治风暴
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_year4_storm"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院第五年事件：毕业抉择
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_year5_graduation"] 已移入 chunks/v62_academy.js */
// 毕业去向节点（简化版，详细在bk.py毕业系统中）
/* /v62inj:chunk-academy/ N["academy_graduation_church"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_merchant"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_free"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_watcher"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_eclipse"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院社团系统
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_club"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 艾尔达学院酒馆（社交事件）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_elda_tavern"] 已移入 chunks/v62_academy.js */
console.log("[v28 be] 艾尔达大陆学院深化（院系+政治+同学+秘密+事件）已加载");


// ============================================================
// v28 圣光神学院数据
// ============================================================
const HOLY_SEMINARY_DEPARTMENTS_V28 = {
  theology: {name:"神学院", dean:"大主教本尼迪克特", desc:"神学与教会法的最高殿堂。培养主教、审判官和神学家。", courses:["神学基础","教会法","圣物研究","异端识别","布道术"]},
  holy_magic: {name:"圣术院", dean:"圣女塞拉芬娜", desc:"神圣魔法的训练基地。培养圣术师、治疗师和驱魔师。", courses:["神圣魔法基础","治疗术","驱魔术","圣物运用","圣光祈愿"]},
  inquisition: {name:"裁判所", dean:"审判长马库斯", desc:"异端审判的训练机构。培养审判官、调查员和执行者。被称为「教会的剑」。", courses:["异端调查","审讯术","追踪术","审判程序","净化术"]}
};

const HOLY_PROFESSORS_V28 = {
  benedict: {name:"大主教本尼迪克特", dept:"神学院", title:"院长", secret:"秘密改革派/反对净化令", faction:"改革派", story:"神学院院长，看起来是最虔诚的正统派。但他私下反对净化令——他的弟弟就是在净化令中被「误判」的。"},
  seraphina: {name:"圣女塞拉芬娜", dept:"圣术院", title:"圣术院主任", secret:"能听到神的声音/真实身份成谜", faction:"正统派", story:"被称为「圣女」的圣术师，能听到神的声音。但她听到的，真的是神吗？还是别的什么？"},
  marcus_judge: {name:"审判长马库斯", dept:"裁判所", title:"裁判所主任", secret:"曾经放过一个异端/内心挣扎", faction:"正统派", story:"裁判所主任，铁面无私的审判官。但十年前，他曾经放过一个「异端」——那个人后来成了他的噩梦。"},
  luke: {name:"卢克神父", dept:"神学院", title:"教会法教授", secret:"暗蚀会卧底/为了复仇", faction:"暗蚀会卧底", story:"温和的教会法教授。但他的家族在净化令中被灭门——他加入暗蚀会，是为了从内部摧毁教会。"},
  mary: {name:"玛丽修女", dept:"圣术院", title:"治疗术教授", secret:"曾经是灵魂法师/隐藏天赋", faction:"改革派", story:"治疗术教授，温柔善良。但她曾经是一个灵魂法师——她隐藏了自己的天赋，在教会中苟活。"},
  paul: {name:"保罗修士", dept:"裁判所", title:"追踪术教授", secret:"守望者密探/监视裁判所", faction:"守望者", story:"追踪术教授，沉默寡言。他是守望者的密探——监视裁判所的一举一动，防止他们滥用权力。"}
};

const HOLY_FACTIONS_V28 = {
  orthodox: {name:"正统派", leader:"审判长马库斯", support:"教会高层", goal:"维护教会正统，加强净化令", power:45},
  reform: {name:"改革派", leader:"大主教本尼迪克特", support:"中下层教士", goal:"改革教会，限制净化令", power:30},
  inquisition: {name:"裁判所派", leader:"审判长马库斯(兼)", support:"裁判所", goal:"扩大裁判所权力，清除一切异端", power:20},
  secret: {name:"秘密异端", leader:"卢克神父(卧底)", support:"暗蚀会", goal:"从内部摧毁教会", power:5}
};

const HOLY_SECRETS_V28 = {
  underground_prison: {name:"地下审讯室", desc:"神学院地下的审讯室，关押着「不虔诚」的人。", secret:"有些被关押的人根本不是异端——他们是知道了教会秘密的人", access:"裁判所成员/潜行"},
  holy_relics: {name:"圣物库", desc:"收藏着教会最珍贵的圣物。", secret:"最深处的圣物，不是神的遗物——是原初之物的碎片", access:"大主教批准/特殊事件"},
  heretic_archive: {name:"异端档案库", desc:"收藏着所有被判定为异端的书籍和记录。", secret:"有些「异端书籍」记载着七印的真相", access:"裁判所授权/潜行"},
  seraphim_chamber: {name:"圣女密室", desc:"圣女塞拉芬娜的私人密室。", secret:"她在里面和「神」对话——但那个声音，可能来自深渊", access:"圣女允许/特殊事件"}
};

// ============================================================
// v28 圣光神学院节点
// ============================================================
/* /v62inj:chunk-academy/ N["academy_holy_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_class"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_library"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_club"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_secret_explore"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_holy_explore"] 已移入 chunks/v62_academy.js */
// 圣光神学院毕业
/* /v62inj:chunk-academy/ N["academy_holy_graduation"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 帝国军事学院数据
// ============================================================
const MILITARY_DEPARTMENTS_V28 = {
  infantry: {name:"步兵院", dean:"将军卡拉德", desc:"步兵战术与近战训练的基地。培养军团指挥官和精锐战士。", courses:["剑术进阶","格斗术","军团战术","战场指挥","后勤管理"]},
  cavalry: {name:"骑兵院", dean:"将军伊莎贝拉", desc:"骑兵与机动作战的训练基地。培养骑士和侦察兵。", courses:["骑术","骑枪术","机动作战","侦察术","追击战术"]},
  strategy: {name:"战略院", dean:"元帅冯·克劳塞维茨", desc:"战略与军事工程的研究机构。培养参谋和军事工程师。", courses:["战略理论","军事工程","情报分析","后勤战略","战争史"]},
  arcane_warfare: {name:"魔战院", dean:"大法师梅林", desc:"魔法与战争结合的研究机构。培养战斗法师和魔法军团指挥官。", courses:["战斗魔法","魔法防御","魔能武器","军团魔法","魔法战略"]}
};

const MILITARY_PROFESSORS_V28 = {
  karad: {name:"将军卡拉德", dept:"步兵院", title:"步兵院主任", secret:"战争罪行/正在被调查", faction:"主战派", story:"步兵院主任，参加过北方战争。他的部队在战争中做过一些「不该做的事」——裁判所正在秘密调查他。"},
  isabella: {name:"将军伊莎贝拉", dept:"骑兵院", title:"骑兵院主任", secret:"女儿在战争中失踪/一直在找", faction:"主和派", story:"骑兵院主任，大陆最好的骑士之一。她的女儿在战争中失踪了——她一直在找她，但没人知道她女儿的下落。"},
  clausewitz: {name:"元帅冯·克劳塞维茨", dept:"战略院", title:"战略院主任/副院长", secret:"知道战争的真相/反对当前的战争", faction:"主和派", story:"战略院主任，大陆最伟大的军事家。他反对当前的战争——因为他知道，这场战争的真正目的，不是领土，而是七印。"},
  merlin: {name:"大法师梅林", dept:"魔战院", title:"魔战院主任", secret:"守望者成员/监视军事学院", faction:"守望者", story:"魔战院主任，神秘的大法师。他是守望者的成员——监视军事学院的秘密研究，防止他们滥用七印的力量。"},
  hans: {name:"军士长汉斯", dept:"步兵院", title:"格斗术教官", secret:"退伍老兵/PTSD", faction:"中立", story:"格斗术教官，参加过无数战役。他有严重的战争创伤——夜里经常做噩梦。但他是最好的格斗教官。"},
  elsa: {name:"军医艾尔莎", dept:"步兵院", title:"战场急救教授", secret:"救过敌方士兵/被军方怀疑", faction:"主和派", story:"战场急救教授，曾经的军医。她在战争中救过一个敌方士兵——那个人后来成了敌方的将军。军方一直在怀疑她。"}
};

const MILITARY_FACTIONS_V28 = {
  war: {name:"主战派", leader:"将军卡拉德", support:"军方高层/贵族", goal:"扩大战争，征服更多领土", power:40},
  peace: {name:"主和派", leader:"元帅克劳塞维茨", support:"中下层军官/部分贵族", goal:"结束战争，和平发展", power:30},
  research: {name:"秘密研究派", leader:"大法师梅林(监视)", support:"秘密研究部门", goal:"研究七印力量，用于战争", power:20},
  neutral: {name:"中立派", leader:"军士长汉斯", support:"普通士兵", goal:"不参与政治，只做好本职", power:10}
};

const MILITARY_SECRETS_V28 = {
  weapon_storage: {name:"秘密武器库", desc:"军事学院的地下武器库，收藏着秘密研发的武器。", secret:"最深处有一件用原初之物碎片打造的武器", access:"军方授权/潜行"},
  strategy_room: {name:"战略室", desc:"军事学院的最高机密房间——只有将军级别才能进入。", secret:"里面有关于七印的军事计划", access:"将军授权/特殊事件"},
  experiment_lab: {name:"秘密实验场", desc:"魔战院的秘密实验场——进行禁忌的魔法实验。", secret:"他们在用活人实验七印的力量", access:"魔战院成员/潜行"},
  prison: {name:"军事监狱", desc:"关押着军事犯和战俘。", secret:"有些「战俘」根本不是军人——是知道了秘密的平民", access:"军方授权/潜行"}
};

// ============================================================
// v28 帝国军事学院节点
// ============================================================
/* /v62inj:chunk-academy/ N["academy_military_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_training"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_class"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_strategy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_secret_explore"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_military_explore"] 已移入 chunks/v62_academy.js */
// 军事学院毕业
/* /v62inj:chunk-academy/ N["academy_military_graduation"] 已移入 chunks/v62_academy.js */
console.log("[v28 bf] 圣光神学院 + 帝国军事学院 已加载");


// ============================================================
// v28 精灵银叶学院
// ============================================================
const ELF_ACADEMY_DATA_V28 = {
  departments:{
    nature: {name:"自然院", dean:"长老艾莉娅", desc:"自然魔法与生命科学的研究机构。", courses:["自然魔法","植物学","动物沟通","生命魔法","森林守护"]},
    history: {name:"历史院", dean:"学者塞拉芬", desc:"古代史与精灵文明的研究机构。收藏着大陆最完整的古代文献。", courses:["古代史","精灵文明","七印历史","语言文字","古籍修复"]},
    art: {name:"艺术院", dean:"艺术家露娜", desc:"音乐、绘画、诗歌与舞蹈的学院。", courses:["音乐","绘画","诗歌","舞蹈","星象艺术"]},
    star: {name:"星象院", dean:"占星师诺娃", desc:"星象学与预言的研究机构。精灵最神秘的院系。", courses:["星象学","预言术","命运解读","时间魔法","宇宙论"]}
  },
  secrets:{
    world_tree_roots: {name:"世界树根系", desc:"学院建在世界树之上，根系中有古老的秘密。", secret:"第三印的入口就在世界树根系深处"},
    ancient_library: {name:"古代图书馆", desc:"收藏着精灵文明五千年的文献。", secret:"最深处有黄林晶时代的完整记录"},
    star_tower: {name:"星象塔", desc:"星象院的高塔，用于观测星象。", secret:"塔顶可以看到未来——但代价是寿命"},
    hidden_grove: {name:"隐秘林地", desc:"学院深处的一片禁地。", secret:"精灵长老在那里进行某种古老的仪式"}
  }
};

/* /v62inj:chunk-academy/ N["academy_elf_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_class"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_library"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_meditate"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_secret"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elf_explore"] 已移入 chunks/v62_academy.js */
// 精灵学院毕业
/* /v62inj:chunk-academy/ N["academy_elf_graduation"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 矮人铁峰锻造学院
// ============================================================
const DWARF_ACADEMY_DATA_V28 = {
  departments:{
    forge: {name:"锻造院", dean:"大师索林", desc:"锻造与武器制造的最高殿堂。", courses:["锻造基础","武器锻造","护甲锻造","符文锻造","大师作品"]},
    engineering: {name:"工程院", dean:"工程师格罗因", desc:"工程与建筑的研究机构。", courses:["工程学","建筑学","机械设计","矿脉勘探","隧道工程"]},
    alchemy: {name:"炼金院", dean:"炼金师巴林", desc:"炼金术与矿物研究的机构。", courses:["炼金术基础","矿物学","药剂学","宝石切割","金属转化"]},
    rune: {name:"符文院", dean:"符文师都灵", desc:"符文与古代魔法的研究机构。矮人最神秘的院系。", courses:["符文基础","古代符文","符文锻造","符文魔法","永恒熔炉研究"]}
  },
  secrets:{
    eternal_forge: {name:"永恒熔炉", desc:"矮人王国的心脏——一座永不熄灭的熔炉。", secret:"第四印的核心就在永恒熔炉深处"},
    deep_mines: {name:"深层矿洞", desc:"矮人王国最深处的矿洞。", secret:"最深处有原初之物「贪婪」的气息"},
    rune_vault: {name:"符文宝库", desc:"收藏着矮人最珍贵的符文武器。", secret:"有一件用原初之物碎片打造的武器"},
    hidden_forge: {name:"隐秘锻造场", desc:"只有大师级工匠才能进入的锻造场。", secret:"他们在那里研究如何用原初之物锻造武器"}
  }
};

/* /v62inj:chunk-academy/ N["academy_dwarf_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_forge"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_class"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_tavern"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_secret"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarf_explore"] 已移入 chunks/v62_academy.js */
// 矮人学院毕业
/* /v62inj:chunk-academy/ N["academy_dwarf_graduation"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 兽人战神学院（简化版）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_orc_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_training"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_hunt"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_social"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_bonfire"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_secret"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_orc_explore"] 已移入 chunks/v62_academy.js */
// 兽人学院毕业
/* /v62inj:chunk-academy/ N["academy_orc_graduation"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 半身人绿野学院（简化版）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_halfling_year1"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_halfling_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_halfling_secret"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_halfling_explore"] 已移入 chunks/v62_academy.js */
// 半身人学院毕业
/* /v62inj:chunk-academy/ N["academy_halfling_graduation"] 已移入 chunks/v62_academy.js */
console.log("[v28 bg] 精灵+矮人+兽人+半身人学院 已加载");


// ============================================================
// v28 普通学院数据（8所，简化版）
// ============================================================
const NORMAL_ACADEMIES_V28 = {
  free_city_business: {
    name:"自由城邦商学院", location:"交汇城",
    desc:"自由城邦的商业学院，贸易与金融的实用学府。毕业生多进入商会。",
    strengths:["商业","贸易","金融"],
    secret:"美第奇家族在学院中有秘密影响力——他们在培养未来的商业人才。",
    startNode:"academy_business_hub"
  },
  northern_warrior: {
    name:"北方战士学院", location:"铁门关",
    desc:"北方边境的战士学院，培养边防军。条件艰苦，但实战经验丰富。",
    strengths:["边防战","生存","近战"],
    secret:"学院地下有一个古代战场遗迹——第一印的碎片就在那里。",
    startNode:"academy_northern_hub"
  },
  southern_navigation: {
    name:"南方航海学院", location:"南方港城",
    desc:"南方港口的航海学院，培养航海士与商人。海洋魔法独树一帜。",
    strengths:["航海","贸易","海洋魔法"],
    secret:"学院的创始人是一个海盗——他的宝藏还藏在某个地方。",
    startNode:"academy_southern_hub"
  },
  eastern_literature: {
    name:"东部文学院", location:"承天山",
    desc:"东部王国的文学院，文学与历史的学府。毕业生多进入官场或成为学者。",
    strengths:["文学","历史","政治"],
    secret:"学院的图书馆里有一本「预言书」——它预言了七印的破碎。",
    startNode:"academy_eastern_hub"
  },
  western_ranger: {
    name:"西部游侠学院", location:"西海岸",
    desc:"西海岸的游侠学院，培养游侠与探险家。自由散漫，但生存能力极强。",
    strengths:["游侠","航海","生存"],
    secret:"学院的创始人是一个守望者——他在西海岸监视着深渊的动向。",
    startNode:"academy_western_hub"
  },
  church_law: {
    name:"教会法学院", location:"圣城",
    desc:"圣城的法学院，培养教会法官与审判官。与圣光神学院共享部分师资。",
    strengths:["教会法","审判","神学"],
    secret:"学院的地下室里关押着一些「知道太多」的人。",
    startNode:"academy_law_hub"
  },
  dwarf_engineering: {
    name:"矮人工程学院", location:"铁峰堡",
    desc:"矮人的工程学院，培养工程师与建筑师。比铁峰锻造学院更偏理论。",
    strengths:["工程","建筑","机械"],
    secret:"学院的某个教授在研究「永动机」——他可能已经接近成功了。",
    startNode:"academy_dwarfeng_hub"
  },
  elf_art: {
    name:"精灵艺术学院", location:"银叶城",
    desc:"精灵的艺术学院，培养艺术家与诗人。人类学生极少。",
    strengths:["艺术","音乐","诗歌"],
    secret:"学院的音乐教室有一首「禁曲」——听到它的人会看到未来。",
    startNode:"academy_elfart_hub"
  }
};

// ============================================================
// v28 普通学院通用枢纽（每所学院一个简化版枢纽）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_business_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_northern_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_southern_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_eastern_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_western_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_law_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_dwarfeng_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_elfart_hub"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 乡村学院体系
// ============================================================
const VILLAGE_SCHOOLS_V28 = {
  private_school: {name:"私塾", teacher:"老秀才", secret:"书柜里有孤本/可能是隐退的大学士", hidden_legacy:"古代文献/政治秘密"},
  church_school: {name:"教堂学堂", teacher:"老牧师", secret:"知道教会的秘密/可能是改革派", hidden_legacy:"教会内部档案/净化令真相"},
  blacksmith_apprentice: {name:"铁匠学徒", teacher:"老铁匠", secret:"隐退的锻造大师/可能是矮人混血", hidden_legacy:"古代锻造术/符文锻造"},
  shaman_heritage: {name:"萨满传承", teacher:"老萨满", secret:"和原初之物有联系/知道第二印的秘密", hidden_legacy:"萨满秘术/原初之物知识"},
  herbalist: {name:"草药师学徒", teacher:"老草药师", secret:"知道灵魂魔法的秘密/可能是隐退的灵魂法师", hidden_legacy:"灵魂草药/禁忌知识"},
  wandering_scholar: {name:"游学者", teacher:"游学者", secret:"来自远方/知道大陆的秘密", hidden_legacy:"各地传说/古代地图"}
};

/* /v62inj:chunk-academy/ N["academy_village_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_private"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_church"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_blacksmith"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_shaman"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_herbalist"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_village_scholar"] 已移入 chunks/v62_academy.js */
// 乡村学院毕业（通过考试进入顶尖学院）
/* /v62inj:chunk-academy/ N["academy_village_graduation"] 已移入 chunks/v62_academy.js */
console.log("[v28 bh] 普通学院8所 + 乡村学院体系 已加载");


// ============================================================
// v28 学院伏笔系统（20+条，每条有植入/揭示/回收）
// ============================================================
const ACADEMY_FORESHADOWING_V28 = {
  mercury_identity: {
    name:"墨丘利的真实身份", plant:"学院第一年", reveal:"学院第三年", harvest:"大陆章/守望者线",
    desc:"墨丘利不只是教授——他是守望者成员、塞拉芬守护者、三百岁的灵魂魔法大师。",
    condition:"与墨丘利关系>60 或 进入守望者线"
  },
  gregory_spy: {
    name:"格雷戈里的间谍身份", plant:"学院第一年", reveal:"学院第四年", harvest:"大陆章/教会线",
    desc:"格雷戈里教授是教会异端调查派的成员，在监视灵魂院的每一个人。",
    condition:"发现禁书区秘密 或 第四年政治风暴"
  },
  elena_eclipse: {
    name:"艾琳娜的暗蚀会身份", plant:"学院第二年", reveal:"学院第四年", harvest:"大陆章/暗蚀会线",
    desc:"艾琳娜教授是暗蚀会外围成员，家族在净化令中被迫害，加入暗蚀会是为了复仇。",
    condition:"发现秘密通道 或 加入暗蚀会"
  },
  allen_disappearance: {
    name:"艾伦失踪的真相", plant:"学院第一年", reveal:"学院第二年", harvest:"大陆章",
    desc:"艾伦不是失踪了——他自愿加入了暗蚀会。或者，他被暗蚀会带走了。",
    condition:"调查艾伦失踪 或 加入暗蚀会"
  },
  underground_seal: {
    name:"学院地下的第一印碎片", plant:"学院第一年", reveal:"学院第三年", harvest:"大陆章/七印线",
    desc:"艾尔达学院建在第一印的碎片之上。碎片在影响学院的每一个人。",
    condition:"探索地下遗迹 或 知道七印真相"
  },
  forbidden_library_3: {
    name:"禁书区第三层的秘密", plant:"学院第一年", reveal:"学院第四年", harvest:"大陆章/七印线",
    desc:"禁书区第三层有黄林晶的亲笔笔记和七印的完整图纸。",
    condition:"进入禁书区第二层 或 与维多利亚教授关系>60"
  },
  soul_tower_seraph: {
    name:"灵魂魔法塔顶的塞拉芬", plant:"学院第二年", reveal:"学院第五年", harvest:"终局/守望者线",
    desc:"灵魂魔法塔顶封印着塞拉芬的一部分灵魂。墨丘利一直在守护她。",
    condition:"灵魂魔法天赋 或 与索菲亚教授关系>60"
  },
  seraphina_voice: {
    name:"圣女塞拉芬娜听到的声音", plant:"圣光学院第一年", reveal:"圣光学院第四年", harvest:"大陆章/深渊线",
    desc:"圣女塞拉芬娜听到的「神的声音」，可能来自深渊——或者原初之物。",
    condition:"圣光学院 或 与塞拉芬娜关系>60"
  },
  military_experiment: {
    name:"军事学院的秘密实验", plant:"军事学院第一年", reveal:"军事学院第三年", harvest:"大陆章/七印线",
    desc:"军事学院的秘密研究派在用活人实验七印的力量，还打造了一件用原初之物碎片做的武器。",
    condition:"探索秘密实验场 或 与梅林大法师关系>60"
  },
  karad_warcrime: {
    name:"卡拉德将军的战争罪行", plant:"军事学院第一年", reveal:"军事学院第四年", harvest:"大陆章/军方线",
    desc:"卡拉德将军的部队在北方战争中做过「不该做的事」。裁判所正在秘密调查他。",
    condition:"军事学院 或 与伊莎贝拉将军关系>60"
  },
  elf_third_seal: {
    name:"精灵世界树下的第三印", plant:"精灵学院第一年", reveal:"精灵学院第三年", harvest:"大陆章/七印线",
    desc:"第三印的入口就在世界树根系深处。精灵长老们在「喂养」它。",
    condition:"精灵学院 或 探索世界树根系"
  },
  dwarf_fourth_seal: {
    name:"矮人永恒熔炉中的第四印", plant:"矮人学院第一年", reveal:"矮人学院第三年", harvest:"大陆章/七印线",
    desc:"第四印的核心就在永恒熔炉深处。原初之物「贪婪」被封印在那里——它永远在饿。",
    condition:"矮人学院 或 探索永恒熔炉"
  },
  orc_second_seal: {
    name:"兽人草原的第二印", plant:"兽人学院第一年", reveal:"兽人学院第三年", harvest:"大陆章/七印线",
    desc:"第二印就在兽人草原深处，正在松动。原初之物「愤怒」在挣扎。",
    condition:"兽人学院 或 与萨满关系>60"
  },
  halfling_luck: {
    name:"半身人幸运魔法的真相", plant:"半身人学院第一年", reveal:"半身人学院第四年", harvest:"大陆章/因果线",
    desc:"半身人的幸运不是天生的——是他们一代代积累的「善因」。他们在「平衡」因果。",
    condition:"半身人学院 或 探索幸运室"
  },
  village_teacher: {
    name:"乡村老师的秘密", plant:"乡村学院", reveal:"乡村学院毕业时", harvest:"大陆章",
    desc:"乡村学院的老师都有秘密——隐退的大学士/改革派牧师/矮人锻造大师/灵魂法师/守望者。",
    condition:"乡村学院 或 与老师关系>60"
  },
  classmate_secret: {
    name:"每个同学的秘密", plant:"学院第一年", reveal:"学院第三到五年", harvest:"大陆章/终局",
    desc:"11名同学每人都有一个秘密——家族背景/暗蚀会成员/守望者候选/身世之谜。",
    condition:"与同学关系>60 或 同学个人事件线"
  },
  headmaster_secret: {
    name:"院长的秘密", plant:"学院第一年", reveal:"学院第五年", harvest:"终局",
    desc:"每所学院的院长都有一个秘密——他们知道七印的真相，在等待「能看到符文的人」。",
    condition:"第五年毕业 或 与院长关系>80"
  },
  prophecy_book: {
    name:"东部文学院的预言书", plant:"东部文学院", reveal:"东部文学院第三年", harvest:"大陆章/预言线",
    desc:"东部文学院的图书馆里有一本「预言书」——它预言了七印的破碎和玩家的名字。",
    condition:"东部文学院 或 找到预言书"
  },
  pirate_treasure: {
    name:"南方航海学院的海盗宝藏", plant:"南方航海学院", reveal:"南方航海学院第三年", harvest:"大陆章",
    desc:"南方航海学院的创始人是一个海盗——他的宝藏藏在第五印附近的一个岛屿上。",
    condition:"南方航海学院 或 找到宝藏线索"
  },
  western_watcher: {
    name:"西部游侠学院的守望者创始人", plant:"西部游侠学院", reveal:"西部游侠学院第三年", harvest:"大陆章/守望者线",
    desc:"西部游侠学院的创始人是一个守望者——他在西海岸监视深渊的动向。",
    condition:"西部游侠学院 或 探索守望者秘密"
  },
  cross_academy_truth: {
    name:"跨学院真相：七印的完整图景", plant:"各学院", reveal:"收集3所以上学院的线索", harvest:"终局",
    desc:"七印的完整真相分散在各所学院中——需要在多所学院收集线索才能拼出完整图景。",
    condition:"交换生 或 转校 或 校际活动"
  }
};

// ============================================================
// v28 伏笔回收节点（通用）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_foreshadow_review"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院→大陆章连接：毕业季
// ============================================================
/* /v62inj:chunk-academy/ N["academy_graduation_season"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_final_exam"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_farewell"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_graduation_final"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 毕业旅程（从学院到大陆的第一段旅程）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_graduation_journey"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_journey_with_classmates"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_journey_solo"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_journey_caravan"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_journey_escorted"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 大陆章开局差异（根据毕业去向）
// ============================================================
N["continent_start_variation"] = function(){
  initAcademyV28();
  return {
    place:"大陆章·开局",
    text:function(){
      const arr=[];
      arr.push("【大陆章开始】");
      arr.push("");
      if(S.graduation.destination === "church"){
        arr.push("你到达了圣城——教会的中心。");
        arr.push("");
        arr.push("高耸的教堂、飘扬的圣光旗帜、虔诚的信徒——这是教会的世界。");
        arr.push("");
        arr.push("你的教会生涯，从今天开始。");
      } else if(S.graduation.destination === "merchant"){
        arr.push("你到达了交汇城——大陆的商业中心。");
        arr.push("");
        arr.push("繁忙的市场、来自各地的商人、琳琅满目的商品——这是商会的世界。");
        arr.push("");
        arr.push("你的商业生涯，从今天开始。");
      } else if(S.graduation.destination === "military"){
        arr.push("你到达了铁门关——北方的军事重镇。");
        arr.push("");
        arr.push("坚固的城墙、巡逻的士兵、肃杀的气氛——这是军队的世界。");
        arr.push("");
        arr.push("你的军人生涯，从今天开始。");
      } else if(S.graduation.destination === "watcher"){
        arr.push("你到达了一个秘密的地点——守望者的据点。");
        arr.push("");
        arr.push("奥雷利安在等你。「欢迎加入守望者。」他说，「你的训练，从今天开始。」");
      } else if(S.graduation.destination === "eclipse"){
        arr.push("你到达了一个地下的地点——暗蚀会的秘密据点。");
        arr.push("");
        arr.push("一个穿黑袍的人在等你。「欢迎加入暗蚀会。」他说，「我们的目标是——解放原初之物。」");
      } else {
        arr.push("你到达了交汇城——大陆的中心。");
        arr.push("");
        arr.push("你没有加入任何势力——你要自己去看看这个世界。");
        arr.push("");
        arr.push("墨丘利给你的指南针在口袋里发烫——它在指引你，去你该去的地方。");
      }
      arr.push("");
      arr.push("（你在学院的所有选择、所有秘密、所有人际关系，都将在这里产生后果。）");
      arr.push("别过开局，你沿官道走出里许，回头已看不清来处。");
      return arr;
    },
    options:[
      {t:"开始大陆冒险", go:"fc_jiaohui_entry", effect:{flag:"continent_chapter_start"}}
    ]
  };
};

console.log("[v28 bi] 学院伏笔系统 + 学院→大陆连接 已加载");


// ============================================================
// v28 校际比赛系统
// ============================================================
const INTER_ACADEMY_EVENTS_V28 = {
  magic_tournament: {
    name:"大陆魔法大赛", frequency:"每年一次", location:"交汇城",
    participants:["艾尔达大陆学院","圣光神学院","帝国军事学院","精灵银叶学院"],
    reward:"声望/金币/魔法道具",
    desc:"大陆最盛大的魔法比赛，各学院派出最强选手。"
  },
  combat_tournament: {
    name:"大陆武道大会", frequency:"每年一次", location:"承天山",
    participants:["帝国军事学院","艾尔达大陆学院","兽人战神学院","北方战士学院"],
    reward:"声望/武器/军衔",
    desc:"大陆最盛大的武术比赛，实战为主，死亡率不低。"
  },
  debate_competition: {
    name:"大陆学术辩论会", frequency:"每两年一次", location:"圣城",
    participants:["所有学院"],
    reward:"声望/学术地位/书籍",
    desc:"各学院的学者和学生辩论大陆的重大问题——净化令、七印、种族关系。"
  },
  art_festival: {
    name:"大陆艺术节", frequency:"每三年一次", location:"银叶城",
    participants:["精灵银叶学院","精灵艺术学院","东部文学院","所有学院"],
    reward:"声望/艺术作品/精灵祝福",
    desc:"大陆最盛大的艺术节，音乐、绘画、诗歌、舞蹈。"
  },
  joint_research: {
    name:"联合研究项目", frequency:"不定期", location:"各学院",
    participants:["2-3所学院合作"],
    reward:"知识/声望/研究成果",
    desc:"多所学院联合进行的研究项目——通常涉及七印、古代史、禁忌知识。"
  }
};

/* /v62inj:chunk-academy/ N["academy_inter_event_hub"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_magic_tournament"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_combat_tournament"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_debate"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_joint_research"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 交换生系统
// ============================================================
/* /v62inj:chunk-academy/ N["academy_exchange_apply"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exchange_elda"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exchange_holy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exchange_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exchange_elf"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_exchange_dwarf"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 转校系统
// ============================================================
/* /v62inj:chunk-academy/ N["academy_transfer_apply"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_transfer_elda"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_transfer_holy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_transfer_military"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 多视角叙事（以其他学院学生的视角重走一段故事）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_multi_perspective"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_perspective_holy"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_perspective_military"] 已移入 chunks/v62_academy.js */
/* /v62inj:chunk-academy/ N["academy_perspective_elf"] 已移入 chunks/v62_academy.js */
console.log("[v28 bj] 校际活动 + 交换生 + 转校 + 多视角叙事 已加载");


// ============================================================
// v28 校友网络系统
// ============================================================
const ALUMNI_NETWORK_V28 = {
  elda_main: {
    alumni:[
      {name:"墨丘利", role:"院长/守望者", location:"交汇城", influence:90},
      {name:"雷蒙德", role:"战斗院主任", location:"交汇城", influence:70},
      {name:"维多利亚", role:"符文教授", location:"交汇城", influence:60},
      {name:"往届毕业生", role:"各势力精英", location:"全大陆", influence:80}
    ],
    networkBonus:{reputation:10, knowledge:5, access:"守望者线索"}
  },
  holy_seminary: {
    alumni:[
      {name:"大主教本尼迪克特", role:"院长", location:"圣城", influence:85},
      {name:"圣女塞拉芬娜", role:"圣术院主任", location:"圣城", influence:80},
      {name:"审判长马库斯", role:"裁判所主任", location:"圣城", influence:75}
    ],
    networkBonus:{reputation:15, church_access:true, access:"教会内部"}
  },
  imperial_military: {
    alumni:[
      {name:"元帅克劳塞维茨", role:"战略院主任", location:"承天山", influence:90},
      {name:"将军卡拉德", role:"步兵院主任", location:"承天山", influence:75},
      {name:"大法师梅林", role:"魔战院主任", location:"承天山", influence:70}
    ],
    networkBonus:{reputation:15, military_rank:"少尉", access:"军方内部"}
  },
  silver_leaf: {
    alumni:[
      {name:"长老艾莉娅", role:"自然院主任", location:"银叶城", influence:85},
      {name:"占星师诺娃", role:"星象院主任", location:"银叶城", influence:70}
    ],
    networkBonus:{reputation:10, elf_friendship:true, access:"精灵王室"}
  },
  ironpeak_forge: {
    alumni:[
      {name:"大师索林", role:"锻造院主任", location:"铁峰堡", influence:85},
      {name:"符文师都灵", role:"符文院主任", location:"铁峰堡", influence:75}
    ],
    networkBonus:{reputation:10, dwarf_friendship:true, access:"矮人匠会"}
  },
  war_god: {
    alumni:[
      {name:"兽人萨满", role:"萨满领袖", location:"兽人王庭", influence:80},
      {name:"兽人战士长", role:"战斗领袖", location:"兽人王庭", influence:75}
    ],
    networkBonus:{reputation:10, orc_friendship:true, access:"兽人王庭"}
  },
  village_school: {
    alumni:[
      {name:"你的老师", role:"隐退的大师", location:"乡村", influence:50}
    ],
    networkBonus:{reputation:5, hidden_legacy:true, access:"隐藏传承"}
  }
};

function getAlumniBonusV28(academyId){
  const a = ALUMNI_NETWORK_V28[academyId];
  if(a) return a.networkBonus;
  return {reputation:0};
}

// ============================================================
// v28 学院章12方向联动总控
// ============================================================
const ACADEMY_12_DIRECTIONS_V28 = {
  direction_1: {name:"院系深化", status:"implemented", nodes:80, desc:"每所学院有不同的院系结构、课程、教授"},
  direction_2: {name:"政治暗流", status:"implemented", nodes:60, desc:"每所学院有不同的派系政治、学生政治、间谍"},
  direction_3: {name:"同学故事", status:"implemented", nodes:100, desc:"每所学院有不同的同学群体，每人有完整故事线"},
  direction_4: {name:"秘密探索", status:"implemented", nodes:50, desc:"每所学院有不同的秘密区域、隐藏剧情"},
  direction_5: {name:"学年事件", status:"implemented", nodes:80, desc:"每所学院有不同的固定事件+随机事件池"},
  direction_6: {name:"伏笔系统", status:"implemented", nodes:40, desc:"21条学院伏笔，每条有植入/揭示/回收"},
  direction_7: {name:"大陆连接", status:"implemented", nodes:30, desc:"毕业季+旅程+大陆章开局差异"},
  direction_8: {name:"日程时间", status:"implemented", nodes:20, desc:"每所学院有不同的日程、课程表、宵禁"},
  direction_9: {name:"社交关系", status:"implemented", nodes:50, desc:"每所学院有不同的社团、恋爱、友谊"},
  direction_10: {name:"成长职业", status:"implemented", nodes:40, desc:"每所学院有不同的职业偏向、专属课程"},
  direction_11: {name:"外部势力", status:"implemented", nodes:40, desc:"每所学院与不同势力有深度关系"},
  direction_12: {name:"多视角叙事", status:"implemented", nodes:20, desc:"可以以其他学院学生的视角重走故事"}
};

/* /v62inj:chunk-academy/ N["academy_12_directions_review"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院章总结节点
// ============================================================
/* /v62inj:chunk-academy/ N["academy_chapter_summary"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院章与v23-v27系统联动检查
// ============================================================
function academyV28IntegrationCheck(){
  initAcademyV28();
  // 与v23因果之网联动：学院选择记录为因果种子
  if(!S.karmaWeb) S.karmaWeb = {seeds:[], harvests:[]};
  // 与v23伏笔联动：学院伏笔加入总伏笔
  if(!S.foreshadowing) S.foreshadowing = {};
  // 与v25随机世界联动：学院状态受世界种子影响
  if(!S.worldSeed) S.worldSeed = {};
  // 与v26时间系统联动：学院日程使用时间系统
  if(!S.time) initTimeV26();
  // 校友网络
  if(!S.graduation) S.graduation = {graduated:false, destination:null, alumni:[]};
}

// ============================================================
// v28 学院选择入口（创建角色后调用）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_choice_entry"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院快速跳转（调试/多周目用）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_quick_jump"] 已移入 chunks/v62_academy.js */
// ============================================================
// v28 学院系统总入口（从主枢纽进入）
// ============================================================
/* /v62inj:chunk-academy/ N["academy_system_hub"] 已移入 chunks/v62_academy.js */
console.log("[v28 bk] 12方向联动总控 + 毕业系统 + 校友网络 已加载");
console.log("[v28] 全部8个数据卷（bd/bf/bg/bh/bi/bj/bk/be）加载完成");
