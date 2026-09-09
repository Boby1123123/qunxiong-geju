/* ===== /v57inj:engine ===== */
(function(){
"use strict";
try{
/* ============ v57 职业体系总成 · 引擎 ============ */
/* 数据占位（内容脚本按序填充）： */

/* ===== /v57inj:dataFlow ===== */
FLOW_V57["骑士"]={flows:[
  {id:"flow_knight_blade",cn:"圣辉之刃",theme:"光不该是审判，该是路",axis:"paladin",desc:"以圣辉淬刃，以信念开路。这条路相信：剑可以劈开黑暗，但不必劈开人。",skills:["sk_knight_shield","sk_knight_aura","sk_knight_smite"],feats:["v51_骑士_paladin_1","v51_骑士_paladin_2","v51_骑士_paladin_3"],peak:"paladin_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"圣辉"},title:"圣辉骑士",sanctuary:"v57f_骑士_blade_1",sanctuaryCn:"大教堂·穹顶之下"},
  {id:"flow_knight_oath",cn:"誓约之盾",theme:"一诺既出，万山无阻",axis:"protector",desc:"以身为誓，以盾为诺。这条路把每句誓言都锻成一块盾——护住说出口的人。",skills:["sk_knight_vow","sk_knight_sacrifice","sk_knight_sword"],feats:["v51_骑士_protector_1","v51_骑士_protector_2","v51_骑士_protector_3"],peak:"protector_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"守护"},title:"誓约之盾",sanctuary:"v57f_骑士_oath_1",sanctuaryCn:"誓约骑士团·誓堂"},
  {id:"flow_knight_walk",cn:"巡游者",theme:"骑士不该只守一座城",axis:"itinerant",desc:"走出城墙，才看得见世界的伤。这条路不设营垒——走到哪，守到哪。",skills:["sk_knight_justice","sk_knight_riding","sk_knight_oath"],feats:["v51_骑士_itinerant_1","v51_骑士_itinerant_2","v51_骑士_itinerant_3"],peak:"itinerant_peak",scene:"社交",passive:{type:"bonus",value:2,label:"游历"},title:"巡游者",sanctuary:"v57f_骑士_walk_1",sanctuaryCn:"西境古道"}
 ]};
FLOW_V57["游侠"]={flows:[
  {id:"flow_ranger_hunt",cn:"猎杀之道",theme:"猎杀不是嗜血，是记住猎物",axis:"hunter",desc:"以眼为弓，以心为矢。这条路教你：出手之前，先看清楚对手是谁。",skills:["sk_ranger_shot","sk_ranger_eye","sk_ranger_trap"],feats:["v51_游侠_hunter_1","v51_游侠_hunter_2","v51_游侠_hunter_3"],peak:"hunter_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"猎杀"},title:"猎手",sanctuary:"v57f_游侠_hunt_1",sanctuaryCn:"北境·白桦林"},
  {id:"flow_ranger_ward",cn:"守望者",theme:"森林先于王座存在",axis:"warden",desc:"守的不是树，是树底下的根、根底下的土。这条路走得慢，但走得久。",skills:["sk_ranger_sense","sk_ranger_nature","sk_ranger_forest"],feats:["v51_游侠_warden_1","v51_游侠_warden_2","v51_游侠_warden_3"],peak:"warden_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"自然亲和"},title:"守望者",sanctuary:"v57f_游侠_ward_1",sanctuaryCn:"银叶城·古树根"},
  {id:"flow_ranger_roam",cn:"巡林者",theme:"路不在脚下，在林子的呼吸里",axis:"scout",desc:"走最轻的步子，看最远的地方。这条路的人，是林子的耳朵和眼睛。",skills:["sk_ranger_light","sk_ranger_multi","sk_ranger_beast"],feats:["v51_游侠_scout_1","v51_游侠_scout_2","v51_游侠_scout_3"],peak:"scout_peak",scene:"探索",passive:{type:"bonus",value:2,label:"巡林"},title:"巡林者",sanctuary:"v57f_游侠_roam_1",sanctuaryCn:"雾岭·望风石"}
 ]};
FLOW_V57["盗贼"]={flows:[
  {id:"flow_thief_shadow",cn:"影杀者",theme:"影子不抢，只拿",axis:"assassin",desc:"在暗处起手，在光处收手。这条路教你把每一次出手都算清楚——包括不算的那次。",skills:["sk_thief_backstab","sk_thief_shadow","sk_thief_law"],feats:["v51_盗贼_assassin_1","v51_盗贼_assassin_2","v51_盗贼_assassin_3"],peak:"assassin_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"影杀"},title:"影杀者",sanctuary:"v57f_盗贼_shadow_1",sanctuaryCn:"暗影阁·黑井"},
  {id:"flow_thief_night",cn:"夜行者",theme:"黑夜不是掩护，是另一种白天",axis:"burglar",desc:"在无人处来，在无人处去。这条路不偷东西——偷时间，偷秘密，偷回被藏起来的公道。",skills:["sk_thief_lockpick","sk_thief_pick","sk_thief_erase"],feats:["v51_盗贼_burglar_1","v51_盗贼_burglar_2","v51_盗贼_burglar_3"],peak:"burglar_peak",scene:"探索",passive:{type:"bonus",value:2,label:"夜行"},title:"夜行者",sanctuary:"v57f_盗贼_night_1",sanctuaryCn:"交汇城·钟楼"},
  {id:"flow_thief_ear",cn:"耳目",theme:"听见的人，活得更久",axis:"spy",desc:"把自己藏进人群，把真相带出暗巷。这条路的人，替世界记着那些没人愿意说的话。",skills:["sk_thief_stealth","sk_thief_disguise","sk_thief_poison"],feats:["v51_盗贼_spy_1","v51_盗贼_spy_2","v51_盗贼_spy_3"],peak:"spy_peak",scene:"社交",passive:{type:"bonus",value:2,label:"耳目"},title:"耳目",sanctuary:"v57f_盗贼_ear_1",sanctuaryCn:"南港·旧鱼市"}
 ]};
FLOW_V57["牧师"]={flows:[
  {id:"flow_priest_mercy",cn:"慈悲之道",theme:"治愈先于审判",axis:"healer",desc:"以神恩抚伤，以宽宥渡人。这条路信：看见伤口的人，才配谈信仰。",skills:["sk_priest_heal","sk_priest_revive","sk_priest_light"],feats:["v51_牧师_healer_1","v51_牧师_healer_2","v51_牧师_healer_3"],peak:"healer_peak",scene:"恢复",passive:{type:"bonus",value:2,label:"慈悲"},title:"慈悲者",sanctuary:"v57f_牧师_mercy_1",sanctuaryCn:"圣辉教堂·病榻廊"},
  {id:"flow_priest_judge",cn:"审判者",theme:"圣言不是刀，是秤",axis:"inquisitor",desc:"以经文为尺，以真理为刃。这条路不放过罪，也不放过错判——两样都算。",skills:["sk_priest_judgment","sk_priest_bane","sk_priest_word"],feats:["v51_牧师_inquisitor_1","v51_牧师_inquisitor_2","v51_牧师_inquisitor_3"],peak:"inquisitor_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"审判"},title:"审判者",sanctuary:"v57f_牧师_judge_1",sanctuaryCn:"异端审判庭·静默间"},
  {id:"flow_priest_war",cn:"圣战者",theme:"为信仰而战，也为信仰而止",axis:"warpriest",desc:"神的信徒也可以是神的剑。这条路教你在拔剑前先问：这一剑，神会怎么看？",skills:["sk_priest_bless","sk_priest_shield","sk_priest_avatar"],feats:["v51_牧师_warpriest_1","v51_牧师_warpriest_2","v51_牧师_warpriest_3"],peak:"warpriest_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"圣战"},title:"圣战者",sanctuary:"v57f_牧师_war_1",sanctuaryCn:"圣山·古战场"}
 ]};
FLOW_V57["商人"]={flows:[
  {id:"flow_trade_way",cn:"商道",theme:"万物有价，唯情难称",axis:"merchant",desc:"以信立市，以诚聚财。这条路不信运气，信账本——还有账本背后的脸。",skills:["sk_trade_bargain","sk_trade_eye","sk_trade_touch"],feats:["v51_商人_merchant_1","v51_商人_merchant_2","v51_商人_merchant_3"],peak:"merchant_peak",scene:"交易",passive:{type:"bonus",value:2,label:"商道"},title:"商道者",sanctuary:"v57f_商人_way_1",sanctuaryCn:"金衡商会·老账房"},
  {id:"flow_trade_gold",cn:"金流",theme:"钱不是目的，是过河的路",axis:"banker",desc:"让钱流动起来，让日子有着落。这条路管的是金子的去向——还有它的来处。",skills:["sk_trade_invest","sk_trade_credit"],feats:["v51_商人_banker_1","v51_商人_banker_2","v51_商人_banker_3"],peak:"banker_peak",scene:"经济",passive:{type:"bonus",value:2,label:"金流"},title:"金流主",sanctuary:"v57f_商人_gold_1",sanctuaryCn:"金衡商会·金库"},
  {id:"flow_trade_auction",cn:"拍场主",theme:"每一件东西，都有懂它的人",axis:"auctioneer",desc:"把东西交给最该拥有它的人。这条路赚的不是差价，是成全。",skills:["sk_trade_net","sk_trade_talk","sk_trade_scale"],feats:["v51_商人_auctioneer_1","v51_商人_auctioneer_2","v51_商人_auctioneer_3"],peak:"auctioneer_peak",scene:"社交",passive:{type:"bonus",value:2,label:"拍场"},title:"拍场主",sanctuary:"v57f_商人_auction_1",sanctuaryCn:"南港·旧拍卖行"}
 ]};

const FLOW_V57 = {
 "魔法师":{flows:[
  {id:"flow_mage_fire",cn:"真理之焰",theme:"知识不是用来藏的，是用来烧的",axis:"elemental",desc:"以元素为火，以法则为薪。这条路信奉：知道得越多，燃得越亮。",skills:["sk_mage_fireball","sk_mage_chain","sk_mage_meteor"],feats:["v51_魔法师_elemental_1","v51_魔法师_elemental_2","v51_魔法师_elemental_3"],peak:"elemental_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"塑能加值"},title:"焰语者",sanctuary:"v57f_魔法师_fire_1",sanctuaryCn:"星落塔·观星台"},
  {id:"flow_mage_door",cn:"万象之门",theme:"世界的缝隙里，藏着另一条路",axis:"conjurer",desc:"把空间折成纸，把距离叠成褶。门扉之后，一切皆可通达。",skills:["sk_mage_blink","sk_mage_arcaneshield"],feats:["v51_魔法师_conjurer_1","v51_魔法师_conjurer_2","v51_魔法师_conjurer_3"],peak:"conjurer_peak",scene:"探索",passive:{type:"bonus",value:2,label:"空间感知"},title:"门扉行者",sanctuary:"v57f_魔法师_door_1",sanctuaryCn:"旧图书馆·地下一层"},
  {id:"flow_mage_echo",cn:"寂静回响",theme:"最深的声音，是不出声的",axis:"arcane",desc:"法则在无人处低语。这条路教你听——听那些被禁止说出口的部分。",skills:["sk_mage_amplify","sk_mage_grand"],feats:["v51_魔法师_arcane_1","v51_魔法师_arcane_2","v51_魔法师_arcane_3"],peak:"arcane_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"法则共鸣"},title:"法则诵者",sanctuary:"v57f_魔法师_echo_1",sanctuaryCn:"禁书区·三层"}
 ]},
 "灵魂法师":{flows:[
  {id:"flow_soul_lamp",cn:"魂灯不灭",theme:"亡者不可忘，生者不可欺",axis:"medium",desc:"魂灯为引，渡人亦渡己。这条路信：记得的人多了，路就亮了。",skills:["sk_soul_sight","sk_soul_lullaby","sk_soul_gather"],feats:["v51_灵魂法师_medium_1","v51_灵魂法师_medium_2","v51_灵魂法师_medium_3"],peak:"medium_peak",scene:"修炼",passive:{type:"pct",value:0.03,label:"魂灯常明"},title:"守灯人",sanctuary:"v57f_灵魂法师_lamp_1",sanctuaryCn:"晨曦圣殿·灯廊"},
  {id:"flow_soul_key",cn:"心扉之锁",theme:"每一扇心门，都有一把钥匙",axis:"hypnotist",desc:"看透人心，不是为掌控，是为不误伤。这条路教你在说话之前，先听见。",skills:["sk_soul_link","sk_soul_gaze"],feats:["v51_灵魂法师_hypnotist_1","v51_灵魂法师_hypnotist_2","v51_灵魂法师_hypnotist_3"],peak:"hypnotist_peak",scene:"社交",passive:{type:"bonus",value:2,label:"察心"},title:"读心者",sanctuary:"v57f_灵魂法师_key_1",sanctuaryCn:"镜厅"},
  {id:"flow_soul_chain",cn:"契约之链",theme:"链接不是束缚，是彼此照看",axis:"soulbinder",desc:"把灵魂的线系在一起，生死同担。这条路重诺，也重信。",skills:["sk_soul_attach","sk_soul_lamp"],feats:["v51_灵魂法师_soulbinder_1","v51_灵魂法师_soulbinder_2","v51_灵魂法师_soulbinder_3"],peak:"soulbinder_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"契约之力"},title:"缚魂者",sanctuary:"v57f_灵魂法师_chain_1",sanctuaryCn:"晨曦圣殿·契约堂"}
 ]},
 "术士":{flows:[
  {id:"flow_smith_touch",cn:"点金之手",theme:"万物有灵，皆有价钱——但价值不该被标死",axis:"alchemist",desc:"以药石辨物性，以点化见真章。这条路的手，比眼睛先认识世界。",skills:["sk_smith_potion","sk_smith_acid","sk_smith_appraise"],feats:["v51_术士_alchemist_1","v51_术士_alchemist_2","v51_术士_alchemist_3"],peak:"alchemist_peak",scene:"交易",passive:{type:"bonus",value:2,label:"识材"},title:"点金匠",sanctuary:"v57f_术士_touch_1",sanctuaryCn:"锻造公会·药室"},
  {id:"flow_smith_forge",cn:"百炼之炉",theme:"每一锤，都要对得起下一锤",axis:"forger",desc:"以火淬形，以形载道。这条路把耐心锻进每一道纹路里。",skills:["sk_smith_rune","sk_smith_goldhand","sk_smith_furnace"],feats:["v51_术士_forger_1","v51_术士_forger_2","v51_术士_forger_3"],peak:"forger_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"淬火"},title:"百炼师",sanctuary:"v57f_术士_forge_1",sanctuaryCn:"熔炉大厅"},
  {id:"flow_smith_gear",cn:"活偶之枢",theme:"造出来的东西，会自己长大",axis:"machinist",desc:"机关、构装、会呼吸的器物。这条路与造物共处——并学会放手。",skills:["sk_smith_bomb","sk_smith_shape"],feats:["v51_术士_machinist_1","v51_术士_machinist_2","v51_术士_machinist_3"],peak:"machinist_peak",scene:"探索",passive:{type:"bonus",value:2,label:"机巧"},title:"枢机匠",sanctuary:"v57f_术士_gear_1",sanctuaryCn:"公会地下·构装库"}
 ]},
 "战士":{flows:[
  {id:"flow_war_banner",cn:"不灭战旗",theme:"战旗所指，即心之所向",axis:"berserker",desc:"血可流，旗不倒。这条路把意志锻成旗杆——风越大，立得越稳。",skills:["sk_war_bloodlust","sk_war_blood","sk_war_wrath"],feats:["v51_战士_berserker_1","v51_战士_berserker_2","v51_战士_berserker_3"],peak:"berserker_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"战意"},title:"战旗者",sanctuary:"v57f_战士_banner_1",sanctuaryCn:"战神团·旧旗台"},
  {id:"flow_war_weapon",cn:"百兵之主",theme:"刀剑无主，握者自明",axis:"weaponmaster",desc:"十八般兵刃，皆可成道。这条路练的不是兵器，是手与兵器的彼此信任。",skills:["sk_war_charge","sk_war_combo","sk_war_break"],feats:["v51_战士_weaponmaster_1","v51_战士_weaponmaster_2","v51_战士_weaponmaster_3"],peak:"weaponmaster_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"兵主"},title:"百兵主",sanctuary:"v57f_战士_weapon_1",sanctuaryCn:"演武场·兵器库"},
  {id:"flow_war_wall",cn:"铁壁长城",theme:"最好的进攻，是让人无处可攻",axis:"shieldguard",desc:"以身为墙，以守为攻。这条路相信：站在前面的人，才有资格谈输赢。",skills:["sk_war_bulwark","sk_war_roar","sk_war_instinct"],feats:["v51_战士_shieldguard_1","v51_战士_shieldguard_2","v51_战士_shieldguard_3"],peak:"shieldguard_peak",scene:"战斗",passive:{type:"bonus",value:2,label:"壁垒"},title:"壁垒者",sanctuary:"v57f_战士_wall_1",sanctuaryCn:"铁门关·旧墙"}
 ]}
};

/* ===== /v57inj:dataBrand ===== */
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

const JOB_BRAND_V57 = {
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
};

/* ===== /v57inj:dataFaction ===== */
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

const ORDER_FACTION_V57 = {
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
};

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
    if(fl&&fl.id&&window.FLOW_V57&&FLOW_V57[j]){
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
    if(window.JOB_BRAND_V57&&JOB_BRAND_V57[j]){
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
    if(fl&&fl.id&&window.FLOW_V57&&FLOW_V57[j]){
      var fd=FLOW_V57[j];
      for(var i=0;i<fd.flows.length;i++){
        var f=fd.flows[i];
        if(f.id!==fl.id||!f.passive||f.passive.scene!=='修炼') continue;
        if(f.passive.type==='bonus') sum+=f.passive.value;
        if(f.passive.type==='pct') sum+=Math.round(55*f.passive.value);
      }
    }
    var br=S.jobBrand&&S.jobBrand[j];
    if(br&&window.JOB_BRAND_V57&&JOB_BRAND_V57[j]){
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
    if(!window.FLOW_V57||!FLOW_V57[j]) return;
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
      if(window.JOB_BRAND_V57&&JOB_BRAND_V57[j]){
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
        if(window.JOB_BRAND_V57&&JOB_BRAND_V57[j]){
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
  try{ return (window.ORDER_FACTION_V57&&ORDER_FACTION_V57[j])? ORDER_FACTION_V57[j].factions:[]; }catch(e){ return []; }
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
    if(!window.FACTION_EVENTS_V57||!FACTION_EVENTS_V57.length) return;
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
    var j=v57_jobCn(); if(!window.FLOW_V57||!FLOW_V57[j]){ v57_notify('该职业暂无流派定义。'); return; }
    var fd=FLOW_V57[j]; var h='';
    h+='<div style="font-size:15px;font-weight:bold;color:var(--text-gold);margin-bottom:6px;">━━ '+j+' · 三大流派 ━━</div>';
    for(var i=0;i<fd.flows.length;i++){
      var f=fd.flows[i]; var sc=v57_flowScore(j,f);
      var cur=(S.flow[j]&&S.flow[j].id===f.id);
      h+='<div style="margin:8px 0;padding:10px;border:1px solid '+(cur?'var(--text-gold)':'rgba(255,255,255,.1)')+';border-radius:8px;">';
      h+='<div style="font-size:14px;font-weight:bold;">'+f.cn+' <span style="font-size:12px;color:var(--text-secondary);font-weight:normal;">· '+f.theme+'</span></div>';
      h+='<div style="font-size:12px;color:var(--text-secondary);margin:4px 0;">'+f.desc+'</div>';
      h+='<div style="font-size:12px;">成型度 <b style="color:'+(sc>=80?'var(--success)':'var(--text-gold)')+';">'+sc+'%</b> · '+(cur?'已成型（阶段 '+(S.flow[j].stage||1)+'/3）':'未成型')+'</div>';
      if(f.skills){ h+='<div style="font-size:11px;color:var(--text-secondary);">技：'+f.skills.map(function(x){return (window.SKILLS_V55&&SKILLS_V55[j])? "○":"·";}).join("")+'</div>'; }
      if(f.skills){
        var sn=[];
        for(var k=0;k<f.skills.length;k++){
          var s2=null;
          if(window.SKILLS_V55&&SKILLS_V55[j]){
            for(var t3=0;t3<4;t3++){
              var arr=SKILLS_V55[j]['t'+(t3+1)]||[];
              for(var t4=0;t4<arr.length;t4++){ if(arr[t4].id===f.skills[k]) s2=arr[t4].cn; }
            }
          }
          sn.push(s2||f.skills[k]);
        }
        h+='<div style="font-size:11px;color:var(--text-secondary);">核心技：'+sn.join(' / ')+'</div>';
      }
      if(f.title){ h+='<div style="font-size:11px;color:var(--text-gold);">专精称号：'+f.title+'</div>'; }
      if(f.sanctuary){ h+='<div style="margin-top:6px;"><button class="btn" onclick="go(\''+f.sanctuary+'\')">前往圣地 · '+f.sanctuaryCn+'</button></div>'; }
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
    var j=v57_jobCn(); if(!window.JOB_BRAND_V57||!JOB_BRAND_V57[j]){ v57_notify('该职业暂无烙印定义。'); return; }
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
