/* 艾尔达大陆·群雄割据 v42 分片：story_origin（由 elda chunks 自动生成，勿手改） */
N["origin_free_city_1"] = function(){
  startOriginPrologueV27('free_city');
  return {
    place:"交汇城·市井",
    text:function(){
      const arr=[];
      arr.push("交汇城的清晨是从叫卖声开始的。");
      arr.push("");
      arr.push("你在这条街上长大。每一块石板你都踩过，每一个摊主你都叫得出名字。老张的面包店在巷子口，王婆的裁缝铺在拐角，再往前是商会的仓库——你在那里当跑腿，每天五个铜星。");
      arr.push("");
      arr.push("今天商会的李管事叫住了你。他给了你一个木盒，让你送到城西的密语客栈。");
      arr.push("「别打开，别问，送到就走。」他说这话的时候，眼睛没有看你。");
      arr.push("");
      arr.push("你注意到木盒很轻，但里面有东西在微微震动——像是心跳。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（你有种被人注视的感觉。回头看，街上人来人往，谁都在忙自己的事。）");
      return arr;
    },
    options:[
      {t:"乖乖送去（不打开）", go:"origin_free_city_2a", effect:{}},
      {t:"偷偷打开看看", go:"origin_free_city_2b", effect:{check:"AGI", tier:{
        crit:{t:"你找了个没人的巷子，用发簪挑开了盒扣。里面是一块黑色的石头，上面刻着你不认识的符文——它在你手里发烫，你赶紧放了回去。", effect:{flag:"saw_soul_relic", san:-3}},
        ok:{t:"你小心翼翼地打开一条缝，看到里面是一块黑色的石头，刻着奇怪的符文。你没敢多看，赶紧合上了。", effect:{flag:"glimpsed_soul_relic", san:-1}},
        fail:{t:"你刚要打开，李管事的声音从背后传来：「我不是说了别问吗？」他没发火，但你看到了他眼里的警告。", effect:{relation:"li_guanshi:-5"}},
        critfail:{t:"盒子从你手里滑了出去，摔在地上。黑色的石头滚了出来，发出一声低沉的嗡鸣——街上的人都看了过来。李管事的脸白了。", effect:{flag:"relic_exposed", san:-5, relation:"li_guanshi:-15"}}
      }}},
      {t:"先去面包店买个面包再说", go:"origin_free_city_2c", effect:{gold:-2, timeCost:"1period"}}
    ]
  };
};


  

N["origin_northern_1"] = function(){
  startOriginPrologueV27('northern');
  return {
    place:"铁门关·边境村庄",
    text:function(){
      const arr=[];
      arr.push("北方的风像刀子。");
      arr.push("");
      arr.push("你的村庄在铁门关外三十里，只有二十几户人家。冬天长，夏天短，每年都有人冻死。但这里是你的家——你知道每一条田埂，每一口井，每一座坟。");
      arr.push("");
      arr.push("今天晚上不对劲。");
      arr.push("狗一直在叫，叫得撕心裂肺。你披衣出门，看到北边的天空是红色的——不是火光，是一种更深的、像伤口一样的红。");
      arr.push("");
      arr.push("然后你听到了声音。不是人的声音，是某种……更古老的东西。地面在震动。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（你听到了一个声音，不是从耳朵里听到的，是从骨头里。它在说：「饿……」）");
      arr.push("风灌进领口，像有只手在拽你。你站在院门口，脚像生了根，看着北边那片红——它在扩大，一点一点，像伤口在渗血。");arr.push("村里的狗叫得更凶了，一只接一只，最后连成一片，可又忽然全停了。狗停叫声的那一瞬间，世界安静得可怕，只有风声，还有你自己心跳的声音。");arr.push("你想起了去年冬天，村东头的老猎户在酒桌上说过的话。他说北边的废墟里，有些东西不是靠眼睛看的，是靠鼻子闻的——闻血腥味，闻恐惧味。他说这话的时候，没人信，都当他喝多了。");arr.push("现在你信了。因为风里真的有一丝味道，说不清是什么，但你的胃在翻，你的腿在软。那不是土腥味，不是铁锈味，是某种更古老的、属于「饿」的味道。");arr.push("地面又震了一下。你听见隔壁的窗户纸哗啦哗啦地响，像有无数只手在拍。");return arr;
    } /*v45inj:origin_northern_1*/,
    options:[
      {t:"（序章扩充）北境·灰烬村：离乡前的日子",req:function(){return !S.flags.origin_expand_northern_done;},go:"origin_expand_north_1",effect:{flag:"origin_expand_northern_start"}},
      {t:"叫醒家人，赶紧跑", go:"origin_northern_2a", effect:{}},
      {t:"去村口看看发生了什么", go:"origin_northern_2b", effect:{check:"STR", tier:{
        crit:{t:"你跑到村口，看到了——深渊生物。不是一只，是一群。它们从北边的废墟里爬出来，皮肤是灰色的，眼睛是空洞的。你转身就跑，比谁都快。", effect:{san:-5, flag:"saw_abyss_creatures"}},
        ok:{t:"你跑到村口，看到远处有黑影在移动。你不知道那是什么，但你的身体在发抖——本能告诉你，跑。", effect:{san:-3}},
        fail:{t:"你刚跑到村口，就被什么东西撞飞了。你躺在地上，看到一个灰色的影子从你头顶掠过——然后是你父亲的声音：「跑！」", effect:{hp:-15, san:-5}},
        critfail:{t:"你跑到村口，和那东西面对面了。它没有脸，但你知道它在看你。你尿了裤子，连滚带爬地往回跑。", effect:{san:-10, hp:-5}}
      }}},
      {t:"躲在地窖里", go:"origin_northern_2c", effect:{}}
    ]
  };
};


  

N["origin_southern_1"] = function(){
  startOriginPrologueV27('southern');
  return {
    place:"南方港城·码头",
    text:function(){
      const arr=[];
      arr.push("南方港城的空气是咸的。");
      arr.push("");
      arr.push("你在商船上当学徒，船叫「银穗号」，跑南方港到交汇城的航线。你十六岁，已经在海上漂了两年。");
      arr.push("");
      arr.push("今天的航程不太平。出港第三天，风暴来了。");
      arr.push("");
      arr.push("浪有三层楼那么高。桅杆在呻吟，缆绳在尖叫。你死死抱着桅杆，看着天空变成黑色——不是乌云的黑，是某种更深的、像深渊一样的黑。");
      arr.push("");
      arr.push("然后你看到了。海面下有光。绿色的光，在很深很深的地方，一闪一闪，像呼吸。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（你后来才知道，那是第五印的征兆——南方深海的嫉妒之印。）");
      arr.push("风暴过后，海面平静得不像话。");arr.push("甲板上的人都在忙碌——收缆绳、补帆布、清点货物。只有你站在船舷边，盯着那片海。");arr.push("你看见绿光的地方，现在只剩一片深蓝。可你知道，你看见了。不是错觉——那种光，像呼吸一样，有节奏地一闪一闪。");arr.push("船老大走过来，顺着你的目光看了一眼海面，脸色变了：「别看那边。干活去。」");arr.push("你没动。他叹了口气，压低声音：「那东西，我们老一辈都见过。有人说是鱼，有人说是灯，还有人说是……眼睛。反正，别盯着看。」");arr.push("你收回目光，可那一晚，你梦里全是绿色的光，在一片很深很深的黑暗里，一明，一灭。");return arr;
    } /*v45inj:origin_southern_1*/,
    options:[
      {t:"（序章扩充）南方·商船学徒：离乡前的日子",req:function(){return !S.flags.origin_expand_southern_done;},go:"origin_expand_south_1",effect:{flag:"origin_expand_southern_start"}},
      {t:"告诉船长你看到了光", go:"origin_southern_2a", effect:{}},
      {t:"自己盯着那光看", go:"origin_southern_2b", effect:{check:"SPR", tier:{
        crit:{t:"你盯着那光看，光也在看你。你看到了一座城市——在海底，有高塔，有灯光，有人影在游动。然后光消失了，你发现自己泪流满面。", effect:{san:-5, knowledge:1, flag:"saw_underwater_city"}},
        ok:{t:"你盯着那光看了一会儿，它似乎在回应你——闪了三下，然后消失了。你不知道那是什么，但你记住了那个节奏。", effect:{san:-2, flag:"light_pattern"}},
        fail:{t:"你盯着那光看，但浪太大了，你什么都没看清。等你再看的时候，光已经消失了。", effect:{}},
        critfail:{t:"你盯着那光看，突然觉得有什么东西也在看你。你尖叫一声，松开了桅杆——是旁边的水手抓住了你。", effect:{san:-8, hp:-5}}
      }}},
      {t:"帮忙收帆，别分心", go:"origin_southern_2a", effect:{timeCost:"1period"}}
    ]
  };
};


  

N["origin_church_1"] = function(){
  startOriginPrologueV27('church');
  return {
    place:"圣城·唱诗班",
    text:function(){
      const arr=[];
      arr.push("圣城的钟声每天响六次。");
      arr.push("");
      arr.push("你在唱诗班长大。从六岁起，每天清晨和黄昏都在教堂里唱歌。你记得每一首圣歌的歌词，记得每一扇彩窗上的圣徒故事，记得主教的法袍上有几颗扣子。");
      arr.push("");
      arr.push("今天的黄昏祷告不太平。");
      arr.push("");
      arr.push("祷告进行到一半的时候，审判骑士冲了进来。他们带走了你的邻居——老托马斯，那个每天给你送苹果的面包师。");
      arr.push("");
      arr.push("「托马斯·格雷，涉嫌修习灵魂魔法，跟我们走一趟。」");
      arr.push("老托马斯没有反抗。他看了你一眼，眼神里有恐惧，也有某种你看不懂的东西——像是恳求。");
      arr.push("");
      plantForeshadowV27('karma_seed');
      plantForeshadowV27('unspoken_word');
      arr.push("（你知道老托马斯不是坏人。你知道他有一个生病的孙女，他说灵魂魔法是唯一能救她的办法。但你什么都没说。）");
      arr.push("审判骑士带走老托马斯之后，祷告没有再继续。");arr.push("人们陆续散去，脚步匆匆，没有人说话。你站在原地，看着唱诗班的指挥把乐谱一本一本收好，动作很慢，像在给谁举行什么仪式。");arr.push("你走出教堂，天已经全黑了。圣城的夜很安静，安静得像一块石头。你路过老托马斯的家——门半掩着，门缝里透出一丝昏暗的灯光。");arr.push("你没有进去。可你在门口站了很久。你想起每天早上，老托马斯推着他的面包车，笑着把热面包递给你：「今天加了一勺蜂蜜，甜得很。」");arr.push("你攥紧拳头，又松开。你忽然觉得，圣城这座城的钟声，今晚敲得特别慢，慢得像在等什么回答。");return arr;
    } /*v45inj:origin_church_1*/,
    options:[
      {t:"（序章扩充）圣城·圣堂孤儿：离乡前的日子",req:function(){return !S.flags.origin_expand_church_done;},go:"origin_expand_church_1",effect:{flag:"origin_expand_church_start"}},
      {t:"站出来为老托马斯说话", go:"origin_church_2a", effect:{check:"CHA", tier:{
        crit:{t:"你站了出来，声音在发抖但很坚定：「他不是坏人！他只是想救他的孙女！」审判骑士冷冷地看着你：「小孩子懂什么？灵魂魔法就是异端。」但人群开始骚动，有人在小声附和。最后他们只带走了托马斯，没有牵连其他人。", effect:{flag:"defended_thomas", relation:"thomas:+20", relation:"church:-10"}},
        ok:{t:"你站了出来，但你的声音太小了，被唱诗班的歌声淹没了。审判骑士带走了托马斯，没有人注意到你。", effect:{san:-2, relation:"thomas:+5"}},
        fail:{t:"你想站出来，但你的腿在发抖，你张了张嘴，什么都没说出来。审判骑士带走了托马斯，他回头看了你一眼——你永远忘不了那个眼神。", effect:{san:-5, flag:"did_nothing_thomas"}},
        critfail:{t:"你不小心碰倒了烛台，所有人都看向你。审判骑士问你有什么事，你脑子一片空白，说：「没……没什么。」托马斯被带走了，你觉得自己像个懦夫。", effect:{san:-8, relation:"thomas:-5"}}
      }}},
      {t:"事后去看望托马斯的孙女", go:"origin_church_2b", effect:{timeCost:"1period"}},
      {t:"装作什么都没发生", go:"origin_church_2c", effect:{}}
    ]
  };
};


  

N["origin_elf_1"] = function(){
  startOriginPrologueV27('elf');
  return {
    place:"银叶城·世界树边缘",
    text:function(){
      const arr=[];
      arr.push("精灵的时间和人类不一样。");
      arr.push("");
      arr.push("人类的一天是一天，精灵的一天可能是一年。你在世界树边缘长大，看着树叶绿了又黄，黄了又绿——对人类来说那是几十年，对你来说只是几个季节。");
      arr.push("");
      arr.push("但最近，世界树不对劲。");
      arr.push("");
      arr.push("树叶在不该落的时候落了。树根在夜里发出低沉的声音——像是呻吟。长老们说这是「自然的循环」，但你知道不是。");
      arr.push("");
      arr.push("你能听到世界树在说话。不是用语言，是用感觉——它在害怕。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('primordial_whisper');
      arr.push("（你听到了一个词，从世界树的根脉里传来：「傲慢……它醒了……」）");
      arr.push("那天夜里，你没有睡。");arr.push("你躺在世界树边缘的木屋里，听着树根传来的声音。它很轻，轻得像叹息，可你听得清清楚楚——它在害怕。");arr.push("精灵不知道什么叫害怕。我们活得太久，久到把所有恐惧都活成了耐心。可今夜，你从世界树身上，尝到了那种味道——一种古老的、快要藏不住的恐惧。");arr.push("你翻身坐起来，透过窗看着那棵巨树。月光下，它的树冠像一片沉默的海。可你知道，海底下有东西在动。");arr.push("你想起祖母说过的话：世界树不是我们的家，是我们在替它看家。那时你不懂。今夜你忽然懂了——我们不是主人，我们是守门人。");arr.push("而你，正站在一扇正在松动的门前。");return arr;
    } /*v45inj:origin_elf_1*/,
    options:[
      {t:"（序章扩充）精灵·世界树：离乡前的日子",req:function(){return !S.flags.origin_expand_elf_done;},go:"origin_expand_elf_1",effect:{flag:"origin_expand_elf_start"}},
      {t:"告诉长老你听到了什么", go:"origin_elf_2a", effect:{}},
      {t:"自己去世界树根部查看", go:"origin_elf_2b", effect:{check:"SPR", tier:{
        crit:{t:"你在深夜悄悄来到世界树根部。树根之间有一道裂缝，裂缝里有光——金色的，古老的。你把手伸进去，看到了一幅画面：一座神殿，一个被封印的存在，它在笑。你缩回手，发现手指上多了一个金色的印记。", effect:{san:-5, knowledge:1, flag:"saw_third_seal", item:"golden_mark"}},
        ok:{t:"你来到世界树根部，发现树根之间有一道新的裂缝。你往里看了一眼，看到了光——然后裂缝合上了。你不知道那是什么，但你记住了那个位置。", effect:{san:-2, flag:"found_tree_crack"}},
        fail:{t:"你刚到世界树根部，就被守卫发现了。「这里是禁地。」他们说，把你赶了回去。", effect:{relation:"elf_guard:-5"}},
        critfail:{t:"你在世界树根部迷路了。等你找到路出来的时候，已经是三天后了。你不记得这三天里发生了什么，但你的SAN值下降了。", effect:{san:-10, timeCost:"3days"}}
      }}},
      {t:"去找你的精灵朋友商量", go:"origin_elf_2c", effect:{timeCost:"1period"}}
    ]
  };
};


  

N["origin_dwarf_1"] = function(){
  startOriginPrologueV27('dwarf');
  return {
    place:"铁峰堡·锻造坊",
    text:function(){
      const arr=[];
      arr.push("矮人的锻造坊是世界上最热的地方。");
      arr.push("");
      arr.push("你在铁峰堡的锻造坊当学徒，师从你父亲——铁峰堡最好的铁匠。你十二岁开始拉风箱，十四岁开始打坯，十六岁的时候，你已经能独立打造一把合格的战斧了。");
      arr.push("");
      arr.push("但今天的锻造不一样。");
      arr.push("");
      arr.push("你父亲让你打造一把特殊的锤子——用的是一种你从没见过的金属。黑色的，比铁重，比钢硬，放在火里会发出低沉的嗡鸣。");
      arr.push("");
      arr.push("「这是什么金属？」你问。");
      arr.push("你父亲没回答。他只是说：「用心打。这把锤子，关系到铁峰堡的命运。」");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（你在打铁的时候，听到了一个声音——从熔炉深处传来的，像心跳，又像某种古老的语言。）");
      arr.push("那块金属的名字，你父亲没有说。");arr.push("可你有自己的名字——你叫它「黑铁」。因为它黑得不像铁，黑得像一口吞光的井。你把它放进炉火里，火苗舔着它，它却不红、不化，只是发出那种低沉的嗡鸣。");arr.push("「父亲，这铁是从哪来的？」你问过三次。父亲三次都没有回答。第三次他放下锤子，看着你，说了句很奇怪的话：「有些东西，不是找来的，是它自己来的。」");arr.push("你听不懂。可你记住了那种嗡鸣——它不像普通的铁，倒像……一颗心。一颗被敲了很久很久的心。");arr.push("你继续拉风箱。火光在你脸上跳动，汗水滴进炉火，滋滋作响。你忽然觉得，这把锤子，锤的不是铁，是别的什么。");arr.push("你听见熔炉深处那声心跳，又响了一下。咚。");return arr;
    } /*v45inj:origin_dwarf_1*/,
    options:[
      {t:"（序章扩充）矮人·永恒锻炉：离乡前的日子",req:function(){return !S.flags.origin_expand_dwarf_done;},go:"origin_expand_dwarf_1",effect:{flag:"origin_expand_dwarf_start"}},
      {t:"用心打造这把锤子", go:"origin_dwarf_2a", effect:{check:"STR", tier:{
        crit:{t:"你挥锤三千次，汗水滴在熔炉里滋滋作响。锤子成型的时候，整个锻造坊都在震动——你父亲看着锤子，眼里有泪光：「好。好小子。这把锤子，配得上第四印的守护者。」", effect:{item:"special_hammer", relation:"father:+20", flag:"forged_seal_hammer"}},
        ok:{t:"你花了整整一天，终于把锤子打了出来。它不算完美，但很结实。你父亲点了点头：「还行。继续练。」", effect:{exp:10}},
        fail:{t:"你打到一半，锤子裂了。你父亲叹了口气：「你还需要更多练习。」他把废铁扔进了熔炉。", effect:{exp:5}},
        critfail:{t:"你失手了，锤子砸在了自己手上。你父亲赶紧给你包扎，那把特殊的锤子也被你打坏了。你父亲什么都没说，但你看到他眼里的失望。", effect:{hp:-10, relation:"father:-10"}}
      }}},
      {t:"偷偷藏一块那种金属", go:"origin_dwarf_2b", effect:{check:"AGI", tier:{
        crit:{t:"你趁父亲不注意，藏了一小块那种金属在口袋里。它在你口袋里微微发热，你总觉得它在对你说话。", effect:{item:"mysterious_metal", flag:"stole_metal"}},
        ok:{t:"你藏了一小块金属，但被你父亲看到了。他没说什么，只是看了你一眼——那眼神很复杂。", effect:{item:"mysterious_metal", relation:"father:-5"}},
        fail:{t:"你刚伸手，就被你父亲发现了。「那东西不能碰。」他说，语气很严厉。你缩回了手。", effect:{relation:"father:-10"}},
        critfail:{t:"你偷金属的时候，不小心碰倒了熔炉的坩埚——金属液洒了一地，差点引发事故。你父亲大怒，罚你一个月不许碰锻造台。", effect:{relation:"father:-20", flag:"forge_accident"}}
      }}},
      {t:"追问父亲那是什么金属", go:"origin_dwarf_2c", effect:{}}
    ]
  };
};


  

N["origin_orc_1"] = function(){
  startOriginPrologueV27('orc');
  return {
    place:"兽人王庭·草原",
    text:function(){
      const arr=[];
      arr.push("草原的风是自由的。");
      arr.push("");
      arr.push("你在兽人王庭长大，是战士学徒。你的父亲是部落的勇士，你的母亲是萨满的学徒。你从小就知道，兽人不是野兽——我们是祖先的孩子，是草原的守护者。");
      arr.push("");
      arr.push("但最近，草原不太平。");
      arr.push("");
      arr.push("部落之间开始冲突。为了水源，为了牧场，为了一些你说不清的东西。大萨满说这是「愤怒之印的影响」——第二印在松动，它的力量在影响兽人的情绪。");
      arr.push("");
      arr.push("今晚是月圆之夜。大萨满要举行仪式，为你「看命运」。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      arr.push("（兽人相信，月圆之夜，祖先的灵魂会回来。大萨满可以通过仪式，看到一个年轻人的命运。）");
      arr.push("草原的夜风很野，带着干草和烟灰的味道。你跪在篝火边，火光把你的影子拉得很长，长到像另一个人的影子。");arr.push("萨满的鼓声停了。他枯瘦的手按在你的额头上，掌心的老茧像树皮，烫得惊人。他闭着眼，嘴里念着什么，忽然，他的手一抖。");arr.push("他睁开眼。火光在他眼里跳动着，他看着你，看了很久，久到你开始发毛。");arr.push("「我看见你了。」他说，声音低得像从地底下冒出来，「在很远的地方，站在一群白皮肤的人中间。你的刀上，沾着不是血的东西。」");arr.push("你听不懂。你想问，可他已经把手收了回去，重新闭上了眼。鼓声又响了起来，一下，一下，像心跳。");arr.push("你望着头顶的星空，忽然觉得，这片你从小跑大的草原，今晚陌生得像别人的土地。");return arr;
    } /*v45inj:origin_orc_1*/,
    options:[
      {t:"（序章扩充）兽人·草原：离乡前的日子",req:function(){return !S.flags.origin_expand_orc_done;},go:"origin_expand_orc_1",effect:{flag:"origin_expand_orc_start"}},
      {t:"参加仪式", go:"origin_orc_2a", effect:{}},
      {t:"偷偷溜出去看草原", go:"origin_orc_2b", effect:{timeCost:"1period"}}
    ]
  };
};


  

N["origin_eastern_1"] = function(){
  startOriginPrologueV27('eastern');
  return {
    place:"承天山·山脚",
    text:function(){
      const arr=[];
      arr.push("承天山的云是有形状的。");
      arr.push("");
      arr.push("你在承天山下长大。你的父亲是书院的杂役，你从小就在书院里跑腿、偷听、看书。你没正式入学，但你比很多正式学生读的书都多。");
      arr.push("");
      arr.push("今天，承天山出现了异象。");
      arr.push("");
      arr.push("山顶的云变成了漩涡状，中间有光在闪——不是闪电，是某种更柔和、更古老的光。书院的先生们说那是「时光裂隙」，是第六印的征兆。");
      arr.push("");
      arr.push("你偷偷爬上了山，想看看那道光。");
      arr.push("");
      plantForeshadowV27('seal_omen');
      plantForeshadowV27('time_anomaly');
      arr.push("（你在爬山的时候，有一瞬间觉得眼前的场景很熟悉——好像你以前来过这里，在很久很久以前。）");
      arr.push("你站在半山腰，仰头看着那道光。");arr.push("它像一只眼睛——不是比喻，是真的像。一道竖着的裂缝，边缘泛着柔和的光，一开一合，像谁在眨眼睛。");arr.push("你想起书院先生说过的话：第六印是「时间之印」，它松动的时候，时间会打结。你当时在打瞌睡，没听进去。现在你忽然希望，当时没有打瞌睡。");arr.push("风从山顶吹下来，带着一种奇怪的味道——不像山里的松脂，倒像……旧书。像书院藏经阁里，那些很久没人翻过的书。");arr.push("你往山上又爬了几步。就在那一瞬间，你脚下的石阶，忽然变成了另一条你从没见过的路——然后，又变回来了。");arr.push("你站在原地，心跳得厉害。你刚才，真的看到了。时间，打了一个结。");return arr;
    } /*v45inj:origin_eastern_1*/,
    options:[
      {t:"（序章扩充）东境·承天城：离乡前的日子",req:function(){return !S.flags.origin_expand_eastern_done;},go:"origin_expand_eastern_1",effect:{flag:"origin_expand_eastern_start"}},
      {t:"继续往上爬", go:"origin_eastern_2a", effect:{check:"AGI", tier:{
        crit:{t:"你爬到了山顶，看到了那道光——它是一个裂缝，空间的裂缝。裂缝里，你看到了另一个世界：有高楼，有飞车，有你看不懂的东西。然后裂缝合上了，你发现自己手里多了一块奇怪的金属片。", effect:{san:-5, knowledge:1, item:"strange_metal", flag:"saw_time_rift"}},
        ok:{t:"你爬到了半山腰，看到了那道光——它在山顶，你上不去了。但你记住了它的样子：像一只眼睛，在看着你。", effect:{san:-2}},
        fail:{t:"你爬了一半，路太陡了，你滑了下来。幸好抓住了一棵树，没有受伤。", effect:{hp:-5}},
        critfail:{t:"你爬山的时候失足了，滚了下来。等你醒过来的时候，已经是第二天了。你不记得自己看到了什么，但你的头很疼。", effect:{hp:-15, san:-3}}
      }}},
      {t:"去找书院的玄机子先生", go:"origin_eastern_2b", effect:{timeCost:"1period"}},
      {t:"在山脚观察就好", go:"origin_eastern_2c", effect:{}}
    ]
  };
};


  

N["origin_desert_1"] = function(){
  startOriginPrologueV27('desert');
  return {
    place:"死亡沙漠边缘·绿洲",
    text:function(){
      const arr=[];
      arr.push("沙漠的风是热的。");
      arr.push("");
      arr.push("你在死亡沙漠边缘的一个绿洲长大。你的父母是商人，在沙漠和南方港城之间跑货。你从小就知道，沙漠是危险的——它会吞掉一切不小心的人。");
      arr.push("");
      arr.push("但今天，沙漠吐出来了一个人。");
      arr.push("");
      arr.push("你在绿洲边缘打水的时候，看到一个人从沙漠里走了出来。他的衣服破成了布条，嘴唇干裂，眼睛是瞎的——但他还在走。");
      arr.push("");
      arr.push("你跑过去扶住他。他抓住你的手，力气大得不像一个快死的人。");
      arr.push("");
      arr.push("「信……」他说，「给墨丘利……学院……」");
      arr.push("");
      plantForeshadowV27('hlj_letter');
      plantForeshadowV27('origin_clue');
      arr.push("他从怀里掏出一封信，塞进你手里。然后他的手垂了下去——他死了。");
      arr.push("那个人死在你的怀里。");arr.push("他的手还攥着你的手腕，死都没有松开。他的眼睛是瞎的——可你总觉得，他最后看你的那一眼，是从很深很深的地方看过来的。");arr.push("你把他安葬在绿洲边缘的沙丘下。没有墓碑，你只用石块堆了一个小小的记号。风很快就会把它们吹散，就像吹散他留下的足迹。");arr.push("你坐在坟前，手里攥着那封信。信封很旧，边角被磨得发白，上面写着几个字——「墨丘利 亲启」。");arr.push("你不知道墨丘利是谁，不知道信里写了什么。可你知道，一个人走到快死了，还要把这封信送到——它一定很重要。");arr.push("你抬头看天。沙漠的星空，亮得不像话。你忽然觉得，那个盲眼的人，走了一辈子，也许就是在找一双能替他看信的眼睛。");return arr;
    } /*v45inj:origin_desert_1*/,
    options:[
      {t:"拆开信看看", go:"origin_desert_2a", effect:{check:"INT", tier:{
        crit:{t:"你拆开信。信是用古艾尔达语写的，但你在商队的图书馆里学过。信的内容让你浑身发冷——这是黄林晶的亲笔信，写于三千年前。信里说，七印不是封印，是「喂养」。原初之物不是怪物，是「宇宙的情感本身」。你赶紧把信重新封好。", effect:{knowledge:2, san:-8, flag:"read_hlj_letter_full"}},
        ok:{t:"你拆开信，但大部分内容你看不懂。你只看懂了几个词：「黄林晶」「七印」「原初之物」「墨丘利」。你把信重新封好。", effect:{knowledge:1, san:-3}},
        fail:{t:"你想拆开信，但信封上有某种封印——你一碰到，手指就被灼伤了。你不敢再试。", effect:{hp:-5}},
        critfail:{t:"你拆开了信，信的内容让你SAN值暴跌——你看到了一些你不该看到的东西。你差点把信烧掉，但最后还是忍住了。", effect:{san:-12}}
      }}},
      {t:"不拆，直接去找墨丘利", go:"origin_desert_2b", effect:{}},
      {t:"把信交给当地的教会", go:"origin_desert_2c", effect:{}}
    ]
  };
};


  

N["prologue_opportunity"] = function(){ return {
  text:function(){var base=["日子一天天过去。直到那一天——机遇降临了。"];
  var p=PROLOGUES[S.race+"_"+S.subrace]||PROLOGUES["human_mid"];
  if(p.id=="human_north") base.push("铁门关的军队来村里征兵了。同时，一个艾尔达魔法学院的招生使也来到了这里。");
  if(p.id=="human_mid") base.push("交汇城的学院招生开始了。你的父母拿出积蓄，希望你能去考一考。");
  if(p.id=="human_south") base.push("一艘商船带来了学院招生的消息。你的父亲说：「去试试，我们家需要一个有学问的人。」");
  if(p.id=="human_east") base.push("承天书院的山长路过你的家乡，看中了你的手艺。");
  if(p.id=="human_west") base.push("一艘远洋船带来了大陆各地学院的招生简章。");
  if(p.id=="elf") base.push("精灵女王宣布，今年将选派三名精灵去人类学院做交换生。");
  if(p.id=="dwarf") base.push("熔炉学院的招生官来到了你的锻造坊，看中了你的作品。");
  if(p.id=="orc") base.push("一个人类商人说，熔炉学院正在招收有战斗天赋的兽人学生。");
  if(p.id=="halfbreed") base.push("你收到了一封没有署名的信，信里是一张艾尔达魔法学院的报名表。");
  if(p.id=="halfling") base.push("一个旅行商人说，艾尔达魔法学院有半身人旁听生的名额。");
  if(p.id=="dragon") base.push("你的龙裔血脉引起了学院的注意，他们主动发来特招邀请。");
  return base;},
  options:[
    {t:"接受机遇，准备入学考试", go:"prologue_exam_prep", effect:{time:5}},
    {t:"拒绝，选择另一条路", go:"prologue_alternate", effect:{time:1}}
  ]
};}


N["prologue_exam_prep"] = function(){ return {
  text:["你开始为入学考试做准备。白天干活，晚上读书。日子辛苦但充实。考试的日子越来越近了。"],pace:"light",
  options:[
    {t:"拼命复习（智力）", check:{attr:"INT", label:"智力·备考", target:55},
      tier:{ok:function(){return[pickV(["你准备得很充分，心中有底。◆入学考试目标-10","你不仅复习了考试内容，还自学了一些超纲知识。◆入学考试目标-15，获得教授关注"],"prep_ok")]},
      fail:function(){return[pickV(["你努力了，但基础太差，很多东西看不懂。◆入学考试目标+5","你复习效率不高，时间都花在了不考的内容上。◆入学考试目标+10"],"prep_fail")]}},
      go:"prologue_exam", effect:{time:14}},
    {t:"找关系/走后门（魅力）", check:{attr:"CHA", label:"魅力·游说", target:60},
      go:"prologue_exam", effect:{time:7}},
    {t:"随便考考，听天由命", go:"prologue_exam", effect:{time:7}}
  ]
};}


N["prologue_exam"] = function(){ return {
  text:function(){var p=PROLOGUES[S.race+"_"+S.subrace]||PROLOGUES["human_mid"];
  return ["入学考试的日子到了。你站在"+(p.tag=="贫困生"?"破旧的":"整洁的")+"考场前，吸了口气。这是改变命运的一天。"];},
  options:[
    {t:"参加考试（综合判定）", check:{attr:"INT", label:"智力·入学考", target:50},
      tier:{crit:function(){return[pickV(["你以第一名的成绩通过了考试。招生官当场宣布：你获得了全额奖学金！◆入学标签：天才，金币+50，声望+10","你的表现太过出色，引起了多位教授的争抢。最后你选择了最适合自己的学院。◆入学标签：天才，获得教授推荐"],"exam_crit")]},
      ok:function(){return[pickV(["你顺利通过了考试。虽然不是第一名，但足够入学了。◆入学标签：普通生","你压线通过。好险——差点就落榜了。◆入学标签：压线生"],"exam_ok")]},
      fail:function(){return[pickV(["你落榜了。但招生官看你资质尚可，给了你一个旁听生名额。◆入学标签：旁听生，金币-10","你考试失败了。但一个教授看中了你的某项特长，特招你入学。◆入学标签：特招生"],"exam_fail")]},
      critfail:function(){return[pickV(["你不仅没考过，还在考场上出了丑。所有人都在嘲笑你。但——一个戴兜帽的人向你走来：「跟我来，也许还有别的路。」◆落榜，但触发守望者隐藏路线","你考试时发生了意外（魔法失控/打架/作弊被抓），被禁止入学。但你发现了另一条进入学院的路。◆入学标签：问题学生，走秘密入学路线"],"exam_cf")]}},
      go:"prologue_admission", effect:{time:3}},
    {t:"展示特殊天赋（灵性/力量）", check:{attr:"SPR", label:"灵性·天赋展示", target:55},
      go:"prologue_admission", effect:{time:1}}
  ]
};}






N["prologue_alternate"]={
  text:["你拒绝了学院的邀请。也许你觉得自己不是读书的料，也许你有别的打算。但命运有时候会绕个弯，再把你带回原点。"],pace:"light",
  options:[
    {t:"当冒险者（直接进入大陆线）", go:"city_free", effect:{flag:"skip_academy", time:1}},
    {t:"当学徒（学习一门手艺）", go:"prologue_apprentice", effect:{time:30}},
    {t:" reconsider（重新考虑入学）", go:"prologue_opportunity", effect:{time:1}}
  ]
}


N["prologue_start"] = function(){ return {
  place:function(){var bg=BACKGROUNDS_FULL[S.background]; return bg?bg.startLoc:"自由城邦";},
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var day = S.day || 1;
    return ["艾尔达历4037年，春。",
      "你十六岁。或者十七。或者十八。在这个年纪，很多人已经死了，很多人已经改变了世界。",
      "而你，只是"+bg.cn+"。",
      bg.desc,
      "这是你的故事开始的地方。",
      "（序章共"+bg.prologueDays+"天，你可以自由探索，触发天赋觉醒、机遇事件和危机事件。第"+Math.floor(bg.prologueDays*0.6)+"天左右会触发危机事件。）"];
  },
  options:[
    {t:"回家休息", effect:{time:1}, go:"prologue_home"},
    {t:"去集市看看", effect:{time:1}, go:"prologue_market"},
    {t:"去酒馆听听消息", effect:{time:1}, go:"prologue_tavern"},
    {t:"去郊外走走", effect:{time:1}, go:"prologue_wild"},
    {t:"去找导师", effect:{time:1}, go:"prologue_mentor"},
    {t:"查看状态和目标", effect:{time:0}, go:"prologue_status"}
  ]
};}


N["prologue_home"] = function(){ return {
  place:"住处",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var locs = PROLOGUE_LOCATIONS[bg.startLoc] || PROLOGUE_LOCATIONS.free_jiaohui;
    var home = locs.home || {cn:"住处", desc:""};
    return["推开门，屋里光线昏暗，空气里浮着陈年的霉味和旧木头的潮气。", "炉膛里的灰是冷的。你蹲下身，扒开灰烬，露出几根没烧透的柴头，摸了摸——冰凉。灶台上的铁锅蒙着一层薄灰，已经好几天没人动过了。", "你放下背上的东西，走到墙边，指尖划过那些刻痕。每年生日，你都会在墙上刻一道。刻痕从矮到高，歪歪扭扭，像一列沉默的脚印。最上面那道，还是去年秋天刻的，那时候天已经凉了，木头里泛着霜。", "这里是你长大的地方。每一道划痕、每一片污渍，都有一段故事。", "你从墙角摸出火石，一下、两下，火星溅起来，落在干草上，窜起一小簇火苗。火光跳动着，把你的影子投在墙上，忽长忽短。", "就在这时，窗外传来一阵脚步声。很轻，像是刻意压着步子，走到窗前，停住了。", "你猛地转头。窗外什么都没有——巷子空荡荡的，只有风卷着一片枯叶，在地上打了两个旋。", "你盯着那片枯叶看了好一会儿，才慢慢移开视线。大概是错觉吧。你把窗栓插上，又往火堆里添了根柴。", "火苗舔着柴头，发出细碎的噼啪声。你抱着膝盖坐在火边，忽然想起许多年前，也是这样的炉火边，有人教你辨认每一颗星星的名字。那人的面容已经模糊了，只记得声音很轻，像怕惊扰了什么。", "你回到了"+home.cn+"。",
      home.desc,
      "这里是你长大的地方。每一道划痕、每一片污渍，都有一段故事。",
      "你可以在这里休息，恢复体力，也可能触发童年回忆。"];
  } /*v45inj:prologue_home*/,
  unlock:["reading_mother_letter"],
  options:[
    {t:"休息（恢复体力，推进1天）", effect:{time:1,sanRecovery:2}, go:"prologue_daily_check"},
    {t:"翻找旧物（可能触发回忆）", check:{a:"INT",sk:"调查",label:"智力·翻找",target:50},
      tier:{
        crit:function(){return[pickV(["你在箱底找到了一件被遗忘的旧物。上面的图案让你心头一震——你在哪里见过它？童年记忆碎片+1。","你找到了一封泛黄的信，字迹已经模糊，但你认出了那个签名。那是一个你以为已经忘记的人。童年记忆碎片+1。"],"home_search_crit")]},
        ok:function(){return[pickV(["你找到了一些没用的旧东西，但其中一件让你隐约觉得不简单。童年记忆碎片+1。","你翻到了一本旧日记，是你小时候写的。里面提到了一个你现在完全不记得的地方。"],"home_search_ok")]},
        fail:function(){return[pickV(["什么都没找到，只有灰尘和旧衣服。","你翻了半天，除了一身灰什么都没有。"],"home_search_fail")]},
        critfail:function(){return[pickV(["你打翻了一个旧箱子，里面的东西撒了一地。你在慌乱中踩到了什么东西，脚疼了半天。HP-5。","你找到了一个奇怪的盒子，打开的时候被里面的机关划伤了手。HP-5，但你记住了那个图案。童年记忆碎片+1。"],"home_search_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_market"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"集市",
  text:["天刚蒙蒙亮，集市就已经醒了。", "第一缕晨光从东边的屋檐缝里漏下来，照在湿漉漉的石板路上——昨夜下过雨，积水还没干透，被早起的人踩得噼啪作响。摊贩们一边打着哈欠，一边支起木架，油布哗啦一声抖开，遮住头顶还泛着青色的天。", "集市永远是最热闹的地方。", "叫卖声、讨价还价声、牲畜的叫声，混在一起，像一锅煮沸的粥。", "你挤过人群，鼻子里闯进各种气味——烤面包的焦香、咸鱼的腥味、新鞣皮革的涩、还有不知从哪个角落飘来的香料，辛辣又甜腻。它们搅在一起，并不好闻，却让人安心。这味道，是你从小闻到大的。", "你可以在这里交易、打听消息，或者只是看看。", "不过今天有点不一样。你蹲在一个卖菜的摊子前，听老妇人和旁边的菜农小声抱怨：", "「麦子又涨了三成。粮铺的老赵说，北边的商路断了，运粮的车队半个月没到。」", "「听说铁门关那边，深渊里的东西又出来闹了。军队封了路，商队进不去。」", "你心里一动。深渊……这两个字，最近总在耳边打转，像一只赶不走的苍蝇。", "你抬起头，视线扫过集市——就在这时，你注意到一个人。", "那人站在人群边缘，披着一件洗得发白的兜帽斗篷，脸藏在阴影里，看不清长相。他不像别的路人那样忙着买卖，只是站着，侧过身，朝你这边偏了偏头。", "见你抬头，那人顿了顿，转身走进了巷子，很快消失在晨雾里。", "你盯着他消失的方向看了很久，直到一个商贩不耐烦地喊：「买不买？不买别挡道！」", "你回过神，摇摇头。大概是错觉吧。", "但不知为什么，今天集市上那股熟悉的、让人安心的味道，忽然淡了一些。"],pace:"normal" /*v45inj:prologue_market*/,
  unlock:["reading_watcher_diary"],
  options:[
    {t:"打听消息（可能触发机遇事件）", check:{a:"CHA",sk:"口才",label:"魅力·打听",target:55},
      tier:{
        crit:function(){return[pickV(["你从一个商队队长嘴里套出了重要消息：艾尔达魔法学院的教授正在这一带物色有天赋的年轻人。机遇事件触发！","你听到了一个惊人的消息：承天书院的人在暗中调查本地的异常事件。如果你能引起他们的注意……机遇事件触发！"],"market_gossip_crit")]},
        ok:function(){return[pickV(["你听说最近有学院的人在附近活动，但不确定具体在哪。也许再打听打听会有更多线索。","你听到了一些关于物价上涨和商路断供的抱怨。银穗商路出了问题。"],"market_gossip_ok")]},
        fail:function(){return[pickV(["没人愿意跟你多说。一个小贩甚至对你翻了个白眼。","你问了几个人，他们都只是摇头，说不知道。"],"market_gossip_fail")]},
        critfail:function(){return[pickV(["你问错了人，被一个地痞盯上了。他敲诈了你几个铜币才放你走。金币-5。","你太大声了，引来了城卫的注意。他们警告你不要在集市上乱问。声望-2。"],"market_gossip_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"做点小生意/打零工（赚点钱）", check:{a:"CHA",sk:"交易",label:"魅力·交易",target:50},
      tier:{
        crit:function(){return[pickV(["你低买高卖，一笔就赚了20金龙。商人的直觉在你血液里流淌。金币+20。","你帮一个商队搬货，队长看你能干，多给了一倍工钱。金币+15，还获得了商队的好感。"],"market_work_crit")]},
        ok:function(){return[pickV(["你赚了10金龙，够吃几天了。金币+10。","你打了一天零工，赚了8金龙。虽然不多，但至少是自己挣的。金币+8。"],"market_work_ok")]},
        fail:function(){return[pickV(["你忙活了一天，只赚了3金龙。物价这么贵，这点钱什么都不够。金币+3。","你试图倒卖货物，结果亏了。金币-5。"],"market_work_fail")]},
        critfail:function(){return[pickV(["你被骗了，花高价买了假货。金币-10，但你记住了那个骗子的脸。","你和摊主发生了争执，被城卫赶走了。金币-3，声望-2。"],"market_work_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_tavern"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"酒馆",
  text:["酒馆里烟雾缭绕，酒味和汗味混在一起。","角落里有人在小声交谈，吧台前有人在喝醉了唱歌。","酒馆老板是个消息灵通的人，但他的消息不便宜。","你注意到角落里坐着一个穿灰袍的人，一直在喝麦酒，眼睛却在观察每一个人。"],pace:"light",
  options:[
    {t:"和酒馆老板聊天（花钱买消息）", check:{a:"CHA",sk:"口才",label:"魅力·套话",target:60},
      tier:{
        crit:function(){return[pickV(["老板压轻声音告诉你：最近有学院的人在秘密寻找有特殊天赋的年轻人。如果你够格，也许能被选中。机遇事件触发！","老板告诉你一个秘密：暗蚀会在这一带有活动，他们在招募年轻人。如果你不小心，可能会被盯上。但如果你主动接触……机遇事件触发！"],"tavern_owner_crit")]},
        ok:function(){return[pickV(["老板告诉你一些本地的八卦，虽然不是什么大秘密，但也挺有意思。你了解了本地的势力分布。","老板说最近不太平，让你晚上少出门。他提到了几个失踪者的名字。"],"tavern_owner_ok")]},
        fail:function(){return[pickV(["老板只是笑笑，说他什么都不知道。你花了钱却什么都没打听到。金币-3。","老板对你很冷淡，说他这里不欢迎问东问西的人。"],"tavern_owner_fail")]},
        critfail:function(){return[pickV(["你问了不该问的问题，老板叫人把你赶了出去。你在门口摔了一跤，HP-3。声望-3。","你喝醉了，在酒馆里大闹了一场。第二天醒来，金币少了一半，头很疼。金币-10，HP-5。"],"tavern_owner_critfail")]}
      },
      effect:{time:1,gold:-3}, go:"prologue_daily_check"},
    {t:"接近那个灰袍人", check:{a:"AGI",sk:"潜行",label:"敏捷·接近",target:55},
      tier:{
        crit:function(){return[pickV(["你悄无声息地坐到了灰袍人旁边。他看了你一眼，嘴角一翘：「你比我想象的要敏锐。」然后他递给你一张纸条，上面画着一只闭合的眼睛。守望者密探事件触发！","灰袍人早就注意到你了。他不等你开口就说：「我观察你三天了。你有一些……不寻常的特质。跟我来。」守望者密探事件触发！"],"tavern_gray_crit")]},
        ok:function(){return[pickV(["你靠近了灰袍人，但他没说话。他只是看了你一眼，放下一枚金币就走了。你注意到他的袖口有一个奇怪的标记。金币+1，线索+1。","灰袍人对你点了点头，然后离开了。你没来得及说上话，但你感觉他是故意让你看到他的。"],"tavern_gray_ok")]},
        fail:function(){return[pickV(["你还没靠近，灰袍人就消失在人群里了。你只看到他的背影。","灰袍人察觉了你的意图，他提前离开了。"],"tavern_gray_fail")]},
        critfail:function(){return[pickV(["你撞到了一个醉汉，引起了骚动。等你平息下来，灰袍人已经不见了。而且醉汉的朋友还想找你麻烦。HP-3。","你太紧张了，打翻了一个酒杯，酒洒了旁边的人一身。你不得不赔钱道歉。金币-5。"],"tavern_gray_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"喝一杯，听听周围人说什么", effect:{time:1,gold:-2,sanRecovery:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_wild"] = function(){ return {
  place:"郊外",
  text:["郊外的空气比城里清新。","风吹过田野，带来泥土和青草的气息。","远处有树林，更远处是山脉。","你可以在这里采集草药、练习技能，或者只是发呆。","但你总觉得有什么东西在树林深处看着你。"],pace:"light",
  options:[
    {t:"采集草药/材料", check:{a:"INT",sk:"草药",label:"智力·采集",target:50},
      tier:{
        crit:function(){return[pickV(["你找到了一株罕见的草药，这种草药在市场上能卖不少钱。获得：稀有草药×1。","你发现了一个隐藏的矿脉，虽然不大，但足够你挖几块好矿石。获得：铁矿石×3。"],"wild_gather_crit")]},
        ok:function(){return[pickV(["你采到了一些普通草药，够用了。获得：草药×2。","你找到了一些可食用的野菜和蘑菇。获得：食物×3。"],"wild_gather_ok")]},
        fail:function(){return[pickV(["你找了半天，什么都没找到。","你采到了一些草药，但好像认错了，可能有毒。获得：可疑草药×1。"],"wild_gather_fail")]},
        critfail:function(){return[pickV(["你被毒蛇咬了一口！HP-10，你需要尽快处理伤口。","你迷路了，在郊外转了好几个小时才找到回来的路。疲劳+2，HP-3。"],"wild_gather_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"练习技能/修炼", check:{a:"SPR",sk:"修炼",label:"灵性·修炼",target:55},
      tier:{
        crit:function(){return[pickV(["你在修炼中感受到了某种共鸣——元素在你周围流动，灵魂在你体内苏醒。天赋觉醒事件触发！属性+2！","你进入了一种前所未有的状态，感觉自己的力量在增长。天赋觉醒事件触发！技能+1！"],"wild_train_crit")]},
        ok:function(){return[pickV(["你修炼了一会儿，感觉有所收获。属性+1。","你练习了基本技能，熟练度有所提升。技能+1。"],"wild_train_ok")]},
        fail:function(){return[pickV(["你心浮气躁，什么都没练成。","你试图修炼，但总是无法集中注意力。"],"wild_train_fail")]},
        critfail:function(){return[pickV(["你修炼出了偏差，灵力逆行！HP-8，SAN-3。需要休息。","你被自己的力量反噬了，受了点内伤。HP-5。"],"wild_train_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"探索树林深处（危险）", check:{a:"AGI",sk:"潜行",label:"敏捷·探索",target:60},
      tier:{
        crit:function(){return[pickV(["你在树林深处发现了一个古老的遗迹，里面有一件奇怪的物品。获得：神秘物品×1，线索+1。","你遇到了一个隐居的老者，他教了你一些东西。技能+2，还获得了他的推荐信。"],"wild_explore_crit")]},
        ok:function(){return[pickV(["你发现了一些有趣的痕迹，像是某种大型动物留下的。线索+1。","你找到了一个安静的修炼场所，以后可以常来。获得：秘密修炼点。"],"wild_explore_ok")]},
        fail:function(){return[pickV(["树林深处太暗了，你不敢再往里走。","你听到了奇怪的声音，决定先撤退。"],"wild_explore_fail")]},
        critfail:function(){return[pickV(["你遇到了野兽！在搏斗中受了伤。HP-12，但你成功逃脱了。","你掉进了一个陷阱！花了好几个小时才爬出来。HP-8，疲劳+3。"],"wild_explore_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_mentor"] = function( /*v58eng:aifresh:prologue*/){ return {
  place:"导师家",
  text:["你的导师是个沉默寡言的人。","他/她教了你第一样本事，从不问你的过去，也不说自己的过去。","但你知道，他/她不是普通人。一个普通人不会有那样的眼神——看过太多生死的眼神。","今天他/她有事要对你说。"],pace:"light",
  options:[
    {t:"请求指导（提升技能）", check:{a:"INT",sk:"学习",label:"智力·学习",target:55},
      tier:{
        crit:function(){return[pickV(["导师今天格外有耐心，教了你很多真本事。技能+2，属性+1。","你领悟了导师一直以来想教你的东西。技能+2，导师好感+10。"],"mentor_train_crit")]},
        ok:function(){return[pickV(["你学到了一些东西。技能+1。","导师给你讲了一些道理，虽然不完全懂，但感觉有所收获。属性+1。"],"mentor_train_ok")]},
        fail:function(){return[pickV(["你今天状态不好，什么都没学进去。","导师有心事，教得心不在焉。"],"mentor_train_fail")]},
        critfail:function(){return[pickV(["你练习时出了差错，伤到了自己。HP-5。导师叹了口气，让你休息。","你和导师发生了争执，他/她很生气。导师好感-5。"],"mentor_train_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"询问关于学院的事", check:{a:"CHA",sk:"口才",label:"魅力·询问",target:50},
      tier:{
        crit:function(){return[pickV(["导师沉默了很久，然后从抽屉里拿出一封信：「我本来想等你再大一点给你。但现在看来，时候到了。」这是一封写给艾尔达魔法学院的推荐信。获得：导师推荐信！机遇事件触发！","导师告诉你，他/她曾经是学院的学生。他/她可以写推荐信，但你必须证明自己值得。获得：导师的考验任务。"],"mentor_academy_crit")]},
        ok:function(){return[pickV(["导师给你讲了一些学院的情况，包括五大学院的区别和入学条件。你对未来有了更清晰的认识。","导师建议你去艾尔达魔法学院，说那里最适合你。但他/她没有写推荐信，说要靠你自己。"],"mentor_academy_ok")]},
        fail:function(){return[pickV(["导师不愿多谈，只是说：「到时候你自然会知道。」","导师转移了话题，不想讨论学院的事。"],"mentor_academy_fail")]},
        critfail:function(){return[pickV(["你问得太急了，导师皱起了眉头：「有些事，不该问的时候不要问。」导师好感-3。","导师被你的问题触动了什么，他/她突然变得很冷淡，让你离开。"],"mentor_academy_critfail")]}
      },
      effect:{time:1}, go:"prologue_daily_check"},
    {t:"询问导师的过去", effect:{time:1}, go:"prologue_mentor_past"},
    {t:"离开", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_mentor_past"]={
  place:"导师家",
  text:["导师看了你很久。","「我的过去？」他/她笑了笑，那笑容里有太多东西。","「我曾经是个很有天赋的人。比你现在还有天赋。」","「后来发生了一些事。我失去了一些人，也失去了一些信念。」","「然后我就来到了这里，当了一个普通人的老师。」","他/她看着你：「你比我幸运。你还有选择的机会。」","「不要像我一样，等到失去了才知道珍惜。」"],pace:"normal",
  options:[
    {t:"「老师，你失去了谁？」", effect:{time:1,mentor_bond:5}, go:"prologue_daily_check"},
    {t:"「我不会让你失望的。」", effect:{time:1,mentor_bond:10,flag:"mentor_promise"}, go:"prologue_daily_check"},
    {t:"默默离开", effect:{time:1}, go:"prologue_start"}
  ]
}


N["prologue_daily_check"] = function(){ return {tag:"event",
  place:function(){return S.loc||"序章";},
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var crisisDay = Math.floor(bg.prologueDays * 0.6);
    var msg = [];
    msg.push("第"+S.day+"天。");
    if(S.day >= crisisDay && !S.flags.crisis_triggered){
      S.flags.crisis_triggered = true;
      msg.push("今天，你感觉到了空气中的异样。");
      msg.push("有什么事情要发生了。");
    }
    if(S.day >= bg.prologueDays && !S.flags.admission_time){
      S.flags.admission_time = true;
      msg.push("你收到了几封信。是学院的录取通知。");
    }
    if(S.day > bg.prologueDays + 3){
      msg.push("不能再拖了。你必须做出选择。");
    }
    return msg;
  },
  options:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var opts = [];
    if(S.flags.crisis_triggered && !S.flags.crisis_done){
      opts.push({t:"⚠ 面对危机事件", effect:{time:0}, go:"prologue_crisis"});
    }
    if(S.flags.admission_time && !S.flags.admission_done){
      opts.push({t:"📜 查看录取通知并选择学院", effect:{time:0}, go:"prologue_admission"});
    }
    if(S.flags.awakening_ready && !S.flags.awakening_done){
      opts.push({t:"✨ 天赋觉醒", effect:{time:0}, go:"prologue_awakening"});
    }
    if(S.day > bg.prologueDays + 3){
      opts.push({t:"做出最终选择", effect:{time:0}, go:"prologue_final"});
    }
    opts.push({t:"继续探索", effect:{time:0}, go:"prologue_start"});
    return opts;
  }
};}


N["prologue_awakening"] = function(){ return {
  place:"觉醒之地",
  text:function(){
    var job = S.job || "魔法师";
    var jobNames = {mage:"魔法师",warrior:"战士",soulmage:"灵魂法师",priest:"牧师",rogue:"盗贼",merchant:"商人",alchemist:"炼金术师"};
    return ["你感觉到了。","那种感觉从体内涌上来，像一条沉睡的河流突然苏醒。","你是一个"+(jobNames[job]||job)+"。","不——你即将成为一个"+(jobNames[job]||job)+"。","天赋觉醒的时刻到了。"];
  },
  options:[
    {t:"主动拥抱这份力量", check:{a:"SPR",sk:"修炼",label:"灵性·觉醒",target:60},
      tier:{
        crit:function(){return[pickV(["你主动拥抱了那股力量。它在你体内流淌，你感觉到了前所未有的强大。觉醒完美！属性+3，技能+2，教授关注+高。","你引导着力量在体内运转，每一个经脉都被照亮。觉醒完美！你甚至隐约看到了未来的道路。属性+3，技能+2。"],"awaken_crit")]},
        ok:function(){return[pickV(["你接受了这份力量。虽然过程有些痛苦，但你成功了。属性+2，技能+1。","力量在你体内安顿下来。你感觉自己和以前不一样了。属性+2，技能+1。"],"awaken_ok")]},
        fail:function(){return[pickV(["你试图控制力量，但它太强大了。你只能勉强接纳一部分。属性+1。","力量在你体内横冲直撞，你花了很大力气才压制住。属性+1，HP-5。"],"awaken_fail")]},
        critfail:function(){return[pickV(["力量失控了！你被反噬，倒在地上。HP-15，SAN-5。但你至少活了下来，力量也勉强觉醒了。属性+1。","你拒绝了力量，但它强行涌入你的身体。你感觉自己被撕裂了。HP-20，SAN-8，属性+1。"],"awaken_critfail")]}
      },
      effect:{time:2,flag:"awakening_done"}, go:"prologue_after_awakening"},
    {t:"被动接受，顺其自然", check:{a:"CON",sk:"生存",label:"体质·承受",target:55},
      tier:{
        crit:function(){return[pickV(["你放松身心，让力量自然流淌。出乎意料地顺利。属性+2，技能+1，SAN+3。","你像一个容器，任由力量填满。过程平静而安详。属性+2，技能+1。"],"awaken_passive_crit")]},
        ok:function(){return[pickV(["你顺其自然，力量逐渐融入你的身体。属性+2。","你没有抗拒，也没有主动追求。力量就这样安顿了下来。属性+1，技能+1。"],"awaken_passive_ok")]},
        fail:function(){return[pickV(["你太被动了，力量只觉醒了一部分。属性+1。","力量在你体内徘徊，似乎不太愿意留下。属性+1。"],"awaken_passive_fail")]},
        critfail:function(){return[pickV(["你太放松了，力量差点溜走！你勉强抓住了一部分。属性+1，HP-8。","你在觉醒过程中睡着了，醒来时力量已经消散了大半。属性+1。"],"awaken_passive_critfail")]}
      },
      effect:{time:2,flag:"awakening_done"}, go:"prologue_after_awakening"},
    {t:"拒绝这份力量", effect:{time:1,sanLoss:3}, go:"prologue_refuse_awakening"}
  ]
};}


N["prologue_after_awakening"]={
  place:"觉醒之地",
  text:["觉醒之后，你感觉整个世界都不一样了。","颜色更鲜艳了，声音更清晰了，你甚至能感觉到空气中流动的某种东西。","你的导师听到消息后赶来了。他/她看着你，眼中有欣慰，也有忧虑。","「你觉醒了。」他/她说，「从今天起，你的人生会不一样。」","「学院会注意到你的。也许已经注意到了。」","他/她递给你一些东西：「拿着这些。你会需要的。」"],pace:"normal",
  options:[
    {t:"感谢导师，继续准备", effect:{time:1,mentor_bond:5,item:"觉醒礼包"}, go:"prologue_daily_check"},
    {t:"询问觉醒的真相", effect:{time:1}, go:"prologue_awakening_truth"}
  ]
}


N["prologue_awakening_truth"]={
  place:"导师家",
  text:["导师沉默了很久。","「觉醒的真相？」他/她叹了口气，「这个世界上，大多数人终其一生都不会觉醒。」","「觉醒意味着你被某种更高的存在注意到了。可能是神明，可能是深渊，也可能是……别的什么。」","「每一个觉醒者，都是被命运选中的人。」","「但被选中不一定是好事。」他/她的声音低了下来，「很多觉醒者，最后都消失了。」","「所以你要小心。不要轻易暴露自己的力量。」","「尤其是——不要让教会的人知道你觉醒了什么。」"],pace:"normal",
  options:[
    {t:"「我明白了。」", effect:{time:1,flag:"awakening_truth_known"}, go:"prologue_daily_check"},
    {t:"「老师，你也是觉醒者吗？」", effect:{time:1,mentor_bond:3}, go:"prologue_daily_check"}
  ]
}


N["prologue_refuse_awakening"]={
  place:"觉醒之地",
  text:["你拒绝了。","你不想成为什么觉醒者，不想被命运选中，不想过那种危险的生活。","你只想做一个普通人。","但力量不会因为你的拒绝而消失。它退到了你灵魂的深处，沉睡着，等待着某一天再次涌上来。","「你拒绝了。」导师的声音从身后传来，「但命运不会因为你的拒绝而改变。」","「它只会换一种方式到来。」"],pace:"light",
  options:[
    {t:"「我不在乎。」", effect:{time:1,flag:"awakening_refused",sanRecovery:2}, go:"prologue_daily_check"},
    {t:"……也许我该重新考虑", effect:{time:1}, go:"prologue_awakening"}
  ]
}


N["prologue_crisis"] = function(){ return {
  place:"危机现场",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var crisis = CRISIS_EVENTS[bg.id] || CRISIS_EVENTS.default;
    return ["危机来了。",crisis.desc,"你必须做出选择。"];
  },
  options:[
    {t:"正面面对（战斗/对抗）", check:{a:"STR",sk:"格斗",label:"力量·对抗",target:55},
      tier:{
        crit:function(){return[pickV(["你挺身而出，以一己之力化解了危机！所有人都用敬佩的眼光看着你。声望+15，获得：危机英雄称号。","你不仅解决了危机，还揪出了幕后黑手。声望+20，获得：关键线索。"],"crisis_fight_crit")]},
        ok:function(){return[pickV(["你付出了一些代价，但最终解决了危机。声望+10，HP-5。","你勉强控制住了局面。声望+8，获得：当地人的感激。"],"crisis_fight_ok")]},
        fail:function(){return[pickV(["你尽力了，但危机没有完全解决。声望+3，HP-10。","你被击退了。虽然没有大碍，但危机还在继续。HP-8。"],"crisis_fight_fail")]},
        critfail:function(){return[pickV(["你惨败！不仅没解决危机，还把自己搭进去了。HP-20，声望-5，被当地人指责。","你犯了严重的错误，让情况变得更糟了。HP-15，声望-10，SAN-5。"],"crisis_fight_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"},
    {t:"用智慧/谈判解决", check:{a:"INT",sk:"口才",label:"智力·谈判",target:55},
      tier:{
        crit:function(){return[pickV(["你用智慧和口才完美解决了危机，没有人受伤。声望+12，获得：关键人物的友谊。","你找到了危机的根源，从根本上解决了问题。声望+15，获得：重要线索。"],"crisis_talk_crit")]},
        ok:function(){return[pickV(["你通过谈判达成了妥协，危机暂时解除。声望+8。","你说服了关键人物，危机得到缓解。声望+6。"],"crisis_talk_ok")]},
        fail:function(){return[pickV(["谈判破裂了。对方不听你的。声望+2，你需要想别的办法。","你的话没有说服力。对方只是冷笑。"],"crisis_talk_fail")]},
        critfail:function(){return[pickV(["你说错了话，激怒了对方，情况变得更糟！声望-8，HP-5。","你在谈判中暴露了自己的底牌，被对方利用了。声望-5，损失金币-10。"],"crisis_talk_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"},
    {t:"逃跑/躲避", check:{a:"AGI",sk:"潜行",label:"敏捷·逃跑",target:50},
      tier:{
        crit:function(){return[pickV(["你巧妙地避开了危机，没有受到任何影响。但你也知道，有些事躲得过初一躲不过十五。","你在危机中全身而退，还顺便带走了一些有用的东西。获得：意外收获。"],"crisis_run_crit")]},
        ok:function(){return[pickV(["你躲开了危机的主要冲击。虽然有些内疚，但至少你安全了。","你找到了一个安全的地方躲了起来，等危机过去。"],"crisis_run_ok")]},
        fail:function(){return[pickV(["你没能完全躲开，被波及了。HP-8。","你逃跑时被人看到了，有人说你是懦夫。声望-3。"],"crisis_run_fail")]},
        critfail:function(){return[pickV(["你逃跑时摔倒了，被危机追上。HP-15，还丢了一些东西。金币-10。","你不仅没跑掉，还把自己困在了更危险的境地。HP-12，SAN-3。"],"crisis_run_critfail")]}
      },
      effect:{time:2,flag:"crisis_done",flag2:"crisis_ran"}, go:"prologue_after_crisis"},
    {t:"求助他人", check:{a:"CHA",sk:"口才",label:"魅力·求助",target:50},
      tier:{
        crit:function(){return[pickV(["你找到了正确的人求助，危机被专业地解决了。你还因此结识了一个重要人物。获得：重要人脉。","你的求助感动了有能力的人，他/她出手帮你解决了危机。声望+10，获得：贵人相助。"],"crisis_help_crit")]},
        ok:function(){return[pickV(["有人愿意帮你，危机得到了缓解。声望+5。","你找到了帮手，虽然过程有些波折，但危机过去了。"],"crisis_help_ok")]},
        fail:function(){return[pickV(["你求助的人帮不上忙，或者不愿意帮。你只能自己想办法。","没有人愿意插手这件事。你被拒绝了。"],"crisis_help_fail")]},
        critfail:function(){return[pickV(["你求助的人反而利用了你的困境，趁火打劫。金币-15，声望-5。","你找错了人，被引向了更危险的处境。HP-10，SAN-5。"],"crisis_help_critfail")]}
      },
      effect:{time:2,flag:"crisis_done"}, go:"prologue_after_crisis"}
  ]
};}


N["prologue_after_crisis"]={
  place:"危机之后",
  text:["危机过去了。","不管你用什么方式度过的，它都在你身上留下了印记。","镇上的人看你的眼神变了。有人敬佩，有人畏惧，有人感激，有人怨恨。","你的导师找到你，说了一句话：「经此一事，你已经不是以前的你了。」","「学院会听到消息的。准备好迎接录取通知吧。」"],pace:"light",
  options:[
    {t:"继续准备入学", effect:{time:1}, go:"prologue_daily_check"},
    {t:"查看危机带来的影响", effect:{time:0}, go:"prologue_status"}
  ]
}


N["prologue_admission"] = function(){ return {
  place:"住处",
  text:["你收到了几封信。","信封上印着不同的徽章——那是各大学院的标志。","你拆开信，一封一封地读。","每一封信都在邀请你加入他们的学院。","这是你人生中最重要的选择之一。"],pace:"light",
  options:function(){
    var opts = [];
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    // 根据出身和属性显示可用学院
    opts.push({t:"🏛 艾尔达魔法学院（自由城邦）—— 多元包容，七职业可入", effect:{time:1,flag:"admission_elda",school_rep:10}, go:"prologue_choose_elda"});
    if(S.attrs.INT >= 45 || S.job==="mage" || S.job==="alchemist"){
      opts.push({t:"📚 承天书院（东部王国）—— 东方儒道，魔法师/炼金术师", effect:{time:1,flag:"admission_chengtian",school_rep:10}, go:"prologue_choose_chengtian"});
    }
    if(S.attrs.SPR >= 40 || S.job==="priest" || S.background==="human_church_adopted"){
      opts.push({t:"✝ 圣光神学院（教会区）—— 教会正统，牧师/神圣学派", effect:{time:1,flag:"admission_holy",school_rep:10}, go:"prologue_choose_holy"});
    }
    if(S.race==="精灵" || (S.attrs.CHA >= 50 && S.attrs.SPR >= 40)){
      opts.push({t:"🌿 银叶学院（精灵王国）—— 自然魔法，世界树下", effect:{time:1,flag:"admission_silverleaf",school_rep:10}, go:"prologue_choose_silverleaf"});
    }
    if(S.race==="矮人" || S.attrs.STR >= 40 || S.skills && S.skills.锻造){
      opts.push({t:"🔥 熔炉学院（矮人王国）—— 锻造工程，永恒熔炉旁", effect:{time:1,flag:"admission_forge",school_rep:10}, go:"prologue_choose_forge"});
    }
    if(S.flags.watcher_invited){
      opts.push({t:"👁 守望者秘密学院（隐藏路线）—— 不公开招生", effect:{time:1,flag:"admission_watcher",school_rep:5}, go:"prologue_choose_watcher"});
    }
    opts.push({t:"再想想，暂时不决定", effect:{time:1}, go:"prologue_daily_check"});
    return opts;
  }
};}


N["prologue_choose_elda"]={
  place:"住处",
  text:["你选择了艾尔达魔法学院。","信上说，开学日在一个月后。你需要自行前往交汇城报到。","随信附上了一张地图和一份入学须知。","还有一张纸条，上面写着：「墨丘利教授期待见到你。」","墨丘利？你好像在哪里听过这个名字。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_elda"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_choose_chengtian"]={
  place:"住处",
  text:["你选择了承天书院。","信是用毛笔写的，字迹飘逸，带着一股墨香。","信上说，承天书院在东部王国的后山，需要通过一道特殊的阵法才能进入。","随信附上了一枚玉佩，说是入门的信物。","还有一句话：「后山有时光裂隙，望汝慎之。」"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_chengtian"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_choose_holy"]={
  place:"住处",
  text:["你选择了圣光神学院。","信上印着教会的徽章，散发着淡淡的圣光气息。","信上说，神学院在教会区的圣城，入学前需要接受一次信仰检验。","随信附上了一枚圣徽和一本圣经。","信的末尾写着：「愿光明指引你的道路。」"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_holy"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_choose_silverleaf"]={
  place:"住处",
  text:["你选择了银叶学院。","信是用某种树叶做的，上面的文字像是自然生长出来的。","信上说，银叶学院在精灵王国的世界树下，人类学生需要由精灵向导带领才能进入。","随信附上了一片银色的树叶，说是联络的信物。","信的末尾用精灵语写了一句话，你看不懂，但感觉很温暖。"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_silverleaf"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_choose_forge"]={
  place:"住处",
  text:["你选择了熔炉学院。","信是刻在一块薄铁片上的，字里行间都带着炉火的气息。","信上说，熔炉学院在矮人王国的铁峰堡地下，入学需要通过锻造考验。","随信附上了一把小型锻造锤和一张铁峰堡的通行证。","信的末尾写着：「熔炉不熄，战士不死。」"],pace:"light",
  options:[
    {t:"确认选择，准备出发", effect:{time:1,flag:"admission_done",flag2:"school_forge"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_choose_watcher"]={
  place:"住处",
  text:["你选择了守望者秘密学院。","这封信没有徽章，没有署名，只有一个符号——一只闭合的眼睛。","信上只有一句话：「午夜时分，到城北的废弃教堂来。一个人。」","你不知道等待你的是什么。","但你知道，这是一条与众不同的路。"],pace:"light",
  options:[
    {t:"确认选择，午夜赴约", effect:{time:1,flag:"admission_done",flag2:"school_watcher"}, go:"prologue_final"},
    {t:"再看看其他学院", effect:{time:0}, go:"prologue_admission"}
  ]
}


N["prologue_final"]={
  place:"出发前",
  text:["出发的日子到了。","你收拾好行囊，站在门口，最后看了一眼这个你生活了十六七年的地方。","有很多人来送你——或者没有人来送你。","不管怎样，从今天起，你要离开这里了。","在出发之前，你还有最后一个选择。"],pace:"light",
  options:[
    {t:"正常出发，前往学院", effect:{time:1}, go:"prologue_enroll_normal"},
    {t:"推迟入学，先处理未完之事", effect:{time:3,rep:-10,item:"prologue_special_item"}, go:"prologue_enroll_delay"},
    {t:"与重要的人告别/约定", effect:{time:1,npc_bond:10}, go:"prologue_enroll_companion"},
    {t:"放弃入学，走自由冒险者路线", effect:{time:1,flag:"skip_academy"}, go:"city_free"}
  ]
}


N["prologue_enroll_normal"]={
  place:"前往学院的路上",
  text:["你出发了。","路很长，你有足够的时间思考未来。","你会在学院遇到什么人？学到什么本事？面临什么危险？","一切都是未知。","但你知道，从今天起，你不再是那个出身地的孩子了。","你是艾尔达大陆的一个新变量。","序章结束。学院线开始。"],pace:"light",
  options:[
    {t:"踏入学院", effect:{time:0,flag:"prologue_complete"}, go:"academy_start"}
  ]
}


N["prologue_enroll_delay"]={
  place:"未完之事",
  text:["你推迟了入学。","因为还有一件事你必须做——可能是为了某个人，可能是为了某个承诺，也可能是为了某个秘密。","你花了三天时间处理这件事。","最终，你得到了一件特殊的物品，也错过了学院的新生欢迎仪式。","但你不后悔。","有些事，比入学更重要。"],pace:"light",
  options:[
    {t:"带着收获前往学院", effect:{time:0,flag:"prologue_complete",flag2:"delayed_enrollment"}, go:"academy_start"}
  ]
}


N["prologue_enroll_companion"]={
  place:"告别",
  text:["你找到了那个对你重要的人。","可能是你的导师，可能是你的发小，可能是你在危机中认识的朋友。","你们说了很多话。关于过去，关于未来，关于重逢的约定。","「到了学院，别忘了写信。」他/她说。","「如果遇到麻烦，就回来找我。」","你点点头，把这份情谊记在心里。","然后你出发了。"],pace:"light",
  options:[
    {t:"带着祝福前往学院", effect:{time:0,flag:"prologue_complete",flag2:"companion_bond"}, go:"academy_start"}
  ]
}


N["prologue_status"] = function(){ return {
  place:"状态",
  text:function(){
    var bg = BACKGROUNDS_FULL[S.background] || BACKGROUNDS_FULL.human_orphan;
    var msg = [];
    msg.push("=== 序章状态 ===");
    msg.push("出身："+bg.cn);
    msg.push("第"+S.day+"天 / 共"+bg.prologueDays+"天");
    msg.push("金币："+S.gold);
    msg.push("HP："+S.hp+"/"+S.maxHp);
    msg.push("SAN："+S.san);
    msg.push("天赋觉醒："+(S.flags.awakening_done?"已完成":"未触发"));
    msg.push("危机事件："+(S.flags.crisis_done?"已度过":"未触发"));
    msg.push("录取通知："+(S.flags.admission_time?"已收到":"未收到"));
    msg.push("已选学院："+(S.flags.admission_done?"已选择":"未选择"));
    msg.push("");
    msg.push("目标：触发天赋觉醒 → 度过危机事件 → 收到录取通知 → 选择学院 → 出发");
    return msg;
  },
  options:[
    {t:"返回", effect:{time:0}, go:"prologue_start"}
  ]
};}


N["prologue_apprentice"]=function(){return{
place:"序章·学徒",
text:["你在出身地的一家铺子里，当过一阵子学徒。师傅的手艺很好，脾气也大，教东西全靠骂——骂完了，再手把手教你一遍。", "「记住了，」师傅把一块料子拍在你面前，「活儿不是给人看的，是给日子用的。你糊弄它，它就糊弄你。」", "你在铺子里学了不少东西：怎么挑料子，怎么看火候，怎么在别人看不见的地方下功夫。这些手艺，后来都用上了——只是用的地方，和师傅想的不太一样。", "离开那天，师傅没有送你，只在门口扔下一句话：「走了就别回头。回头，就不像样了。」你走出很远，还是忍不住回了一次头——铺子的门已经关上了，但灯还亮着。", "你当了一段时间的学徒。那段日子，你现在想起来，还是觉得很远。", "你的师父，是个话少的人。他教你的时候，说得最多的一句是：「看。」你看着，他做。你看不懂，他也不解释。等你做错了，他才开口。", "你学得很慢。你打坏过东西，弄砸过活。师父没有骂过你。他只是，让你把弄坏的东西，自己，重新做出来。", "你后来，做出了一件，像样的东西。你拿去给师父看。他接过来，翻来覆去，看了很久。他说：「还行。」他顿了顿，「下次，做快一点。」", "你到现在，还留着那件东西。它不贵重。但每次看到它，你都会想起，那个话少的人，说的那句「还行」。"],pace:"normal" /*v45inj:prologue_apprentice*/,
options:[
{t:"记下师傅的话", go:"quest_hub"},
{t:"继续旅程", go:"world_continue"}
]
}};


N["prologue_enroll_secret"]=function(){return{tag:"easter",
place:"序章·录取的真相",
text:["多年后你才明白，那份录取通知书的到来，从来不是偶然。", "你曾以为，是你出众的天赋引来了学院的注意。后来你发现，在你被注意到之前，就已经有人在暗中观察你——你帮过的某个人、你做过的一件小事、你随口说过的一句话，都成了他们判断你的依据。", "你甚至怀疑过，那些「偶然」的相遇——那个在你落难时出手相助的陌生人、那封恰好在关键时刻送达的信——是否都是安排好的。", "你把这份怀疑压在心里，没有告诉任何人。因为你知道，无论录取的真相是什么，你已经走出了那条路，也收不回脚了。", "你发现了一件，关于录取通知的怪事。这件怪事，你谁也没告诉。", "你的录取通知，是有人，悄悄放在你门口的。你没有看见，是谁放的。你问了邻居，都说，没注意。", "通知的信封上，没有邮戳，没有寄件人。你拆开，里面，除了录取文书，还夹着一张小纸条——「到学院后，去图书馆，第三排书架，最下面一层。」", "你看着那张纸条，想了很久。你最终，没有告诉任何人。你把纸条，小心地收好。", "你出发去学院的那天，把那张纸条，贴身带着。你摸着它，心里，隐隐觉得，这趟旅程，可能，不止是去上学。"],pace:"normal" /*v45inj:prologue_enroll_secret*/,
options:[
{t:"接受这份真相", go:"quest_hub"},
{t:"继续追查录取背后的安排", go:"quest_hub"}
]
}};


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
      return arr;
    },
    options:[
      {t:"继续", go:"prologue_hub", effect:{exp:10+bonus}}
    ]
  };
};


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


