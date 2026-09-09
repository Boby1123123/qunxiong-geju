
/* /v66inj:narr/ /v66inj:imm/ /v66inj:cast/ /v66inj:lore/ /v66inj:dens/ V66 叙事质量引擎 */
(function(){
  try{
    var V66_VER='v66.0';
    /* ===== v66_ensureDefaults（S 新字段兜底，链入 v65_ensureDefaults） ===== */
    window.v66_ensureDefaults=function(){
      try{
        if(typeof S==='undefined'||!S) return;
        if(!S.memories) S.memories=[];
        if(!S.npcLedger) S.npcLedger={};
        if(!S.loreDiscovered) S.loreDiscovered={};
        if(!S.v66Flags) S.v66Flags={};
        if(!S.v66Flags.objects) S.v66Flags.objects={};
        if(!S.v66Flags.heardRumor) S.v66Flags.heardRumor={};
        if(!S.v66Flags.ripples) S.v66Flags.ripples=[];
      }catch(e){}
    };
    function v66_day(){ try{ return (S.time&&typeof S.time.totalDays==='number')?S.time.totalDays:(S.day||0); }catch(e){ return 0; } }
    window.v66_day=v66_day;

    /* ===== 记忆锚点（S.memories，≤50 条） ===== */
    window.v66_memAdd=function(kind, who, note){
      try{
        v66_ensureDefaults();
        S.memories.push({kind:kind, who:who, note:note, day:v66_day()});
        if(S.memories.length>50) S.memories=S.memories.slice(-50);
      }catch(e){}
    };
    window.v66_memRecall=function(who){
      try{
        v66_ensureDefaults();
        if(!who) return '';
        var arr=S.memories.filter(function(m){ return m.who===who; });
        if(!arr.length) return '';
        return arr[arr.length-1].note||'';
      }catch(e){ return ''; }
    };

    /* ===== NPC 互动账本（S.npcLedger） ===== */
    window.v66_ledgerAdd=function(pid, kind, note){
      try{
        v66_ensureDefaults();
        if(!S.npcLedger[pid]) S.npcLedger[pid]=[];
        S.npcLedger[pid].push({kind:kind, note:note||'', day:v66_day()});
        if(S.npcLedger[pid].length>8) S.npcLedger[pid].shift();
      }catch(e){}
    };
    window.v66_ledgerRecall=function(pid){
      try{
        v66_ensureDefaults();
        var a=S.npcLedger[pid]||[];
        if(!a.length) return '';
        var m=a[a.length-1];
        if(m.kind==='帮') return '上回你替他挡过一遭，他还记得。';
        if(m.kind==='坑') return '上回的事他还没忘，看你的眼神里夹着刺。';
        if(m.kind==='送') return '你送的东西，他一直留着。';
        if(m.kind==='欠') return '他还欠你一个人情。';
        if(m.kind==='救') return '他记得那条命是谁给的。';
        return '你们见过，不止一次。';
      }catch(e){ return ''; }
    };

    /* ===== 物件记忆（S.v66Flags.objects） ===== */
    window.v66_objectMemory=function(oid, holder, note){
      try{
        v66_ensureDefaults();
        S.v66Flags.objects[oid]={holder:holder, note:note, day:v66_day()};
      }catch(e){}
    };
    window.v66_objectRecall=function(oid){
      try{
        v66_ensureDefaults();
        var o=(S.v66Flags&&S.v66Flags.objects)?S.v66Flags.objects[oid]:null;
        return o?o.note:'';
      }catch(e){ return ''; }
    };

    /* ===== 接续句（V66_ENTRY_CONT 入口映射 + 过渡模板） ===== */
    var V66_BRIDGES=[
      {key:'time', t:['三日后的清晨，露水还没干，你踩过的脚印已经看不见了。','七天过去，镇口的告示换了一张。','这一觉睡得很沉。醒来时，窗外的雪已经停了。','转眼又是五日。日子像磨盘，转着转着就过去了。']},
      {key:'travel', t:['出城十里，官道上的车辙深了两寸。','马蹄声碎，尘土落在你的靴面上。','沿途的村子比上次更静了。炊烟细得像一根线。','你走了一整天。天黑透时，远处亮起几点灯火。']},
      {key:'scene', t:['推门的时候，门轴响了一声。','你跨进门槛，屋里的炭盆还燃着。','风从门缝里灌进来，卷起桌上的纸。','人声隔着墙传过来，忽远忽近。']}
    ];
    window.v66_bridgeText=function(kind){
      try{
        var g=null;
        for(var i=0;i<V66_BRIDGES.length;i++){ if(V66_BRIDGES[i].key===kind){ g=V66_BRIDGES[i]; break; } }
        if(!g) return '';
        return g.t[Math.floor(Math.random()*g.t.length)];
      }catch(e){ return ''; }
    };
    var V66_ENTRY_CONT={
      'fc_jiaohui_entry':'教堂的钟声穿过晨雾，一下，又一下。',
      'arrive_generic':'你停在城门口，先掸了掸靴上的泥。',
      'v65_career':'军中的日子按钟点过。操练的号声一响，连梦都跟着醒。',
      'v65_warPanel':'帅帐里的沙盘还摆着昨日的样子，几面小旗换了位置。',
      'v65_camp':'营地的火堆还没熄，灰烬里埋着烤焦的土豆。',
      'v65_joinArmy':'招兵旗在风里抖。队伍排得比想象中长。',
      'v65_acad':'军校的石阶被磨得发亮。正厅的沙盘边围着几个新兵。',
      'fc_tavern':'酒馆的门帘掀开，暖气和嘈杂一起涌出来。'
    };
    window.v66_contFor=function(nid){
      try{
        if(V66_ENTRY_CONT[nid]) return V66_ENTRY_CONT[nid];
        if(nid&&nid.indexOf('arrive_')===0) return v66_bridgeText('scene');
        if(nid&&nid.indexOf('travel')===0) return v66_bridgeText('travel');
        return '';
      }catch(e){ return ''; }
    };

    /* ===== 尾钩（V66_HOOKS 入口映射） ===== */
    var V66_HOOKS={
      'fc_jiaohui_entry':'没人知道，这扇门推开之后，城里的钟声还会不会再响。',
      'arrive_generic':'城里的人照常过日子。只有你知道，有些东西已经不一样了。'
    };
    window.v66_tailFor=function(nid){
      try{
        if(V66_HOOKS[nid]) return V66_HOOKS[nid];
        return '';
      }catch(e){ return ''; }
    };

    /* ===== 氛围注入（区域状态联动） ===== */
    var V66_ATMOS={
      'war':['城外的硝烟味还没散尽，风一吹，混着土腥气扑过来。','远处的烽火台还冒着烟，灰蒙蒙一片。'],
      'plague':['街上行人绕开彼此走，连咳嗽都压着声音。','药铺的门板关了大半，门缝里透出熬药的气味。'],
      'ruin':['瓦砾堆里长出草来，绿得扎眼。','断墙上还留着火烧过的黑印。'],
      'festival':['灯笼挂了一整条街，光晃得人眯眼。','酒香从各家门口飘出来，混着铜钱叮当的声响。'],
      'normal':['日头正好，晒得墙根下的猫都懒得睁眼。','风不大，卷着几片叶子在街面上打转。']
    };
    window.v66_atmosphere=function(){
      try{
        var st='normal';
        if(S&&S.worldState){
          var ws=S.worldState;
          if(ws.wars&&ws.wars.length) st='war';
          if(ws.regions){ for(var k in ws.regions){ if(ws.regions[k]&&ws.regions[k].disaster==='plague') st='plague'; } }
        }
        var arr=V66_ATMOS[st]||V66_ATMOS.normal;
        return arr[Math.floor(Math.random()*arr.length)];
      }catch(e){ return ''; }
    };

    /* ===== 世界事件入叙：传闻队列（读 missedEvents 未读） ===== */
    window.v66_rumorQueue=function(){
      try{
        v66_ensureDefaults();
        var out=[];
        if(S.missedEvents&&S.missedEvents.length){
          var arr=S.missedEvents.slice(-6);
          for(var i=0;i<arr.length;i++){
            var k=arr[i].key||('m'+i);
            if(S.v66Flags.heardRumor[k]) continue;
            out.push(arr[i]);
          }
        }
        return out;
      }catch(e){ return []; }
    };
    window.v66_rumorMark=function(key){
      try{ v66_ensureDefaults(); S.v66Flags.heardRumor[key]=true; }catch(e){}
    };

    /* ===== 传说发现（S.loreDiscovered 防重复） ===== */
    window.v66_loreFlash=function(lid){
      try{
        v66_ensureDefaults();
        if(Object.prototype.hasOwnProperty.call(S.loreDiscovered,lid)) return false;
        S.loreDiscovered[lid]=v66_day();
        return true;
      }catch(e){ return false; }
    };

    /* ===== 世界涟漪（S.v66Flags.ripples 记录） ===== */
    window.v66_ripple=function(kind, cn){
      try{
        v66_ensureDefaults();
        S.v66Flags.ripples.push({kind:kind, cn:cn, day:v66_day()});
        if(S.v66Flags.ripples.length>10) S.v66Flags.ripples.shift();
      }catch(e){}
    };

    /* ===== 战斗叙事化：战况一句（读 w64 战争状态生成，零公式改动） ===== */
    window.v66_battleFlavor=function(){
      try{
        if(!S||!S.worldState) return '';
        var ws=S.worldState;
        if(!ws.wars||!ws.wars.length) return '';
        var w=ws.wars[0];
        var a=(typeof v655_fname==='function')?v655_fname(w.a):(w.a||'');
        var b=(typeof v655_fname==='function')?v655_fname(w.b):(w.b||'');
        var fl='';
        if(w.fronts&&w.fronts.length){ var fs=w.fronts; fl=fs[0].cn+(fs[0].cn?'：':''); }
        return '战况：'+a+'与'+b+'在'+(fl||'边境')+'相持不下。火药的气味顺着风钻进城里。';
      }catch(e){ return ''; }
    };

    /* ===== 群像档案（W66_PROFILES，数据在 v66inj:cast 段填充） ===== */
    window.W66_PROFILES = window.W66_PROFILES || {};

/* /u7inj:cast/ 群像档案（16 条，四件套，数据来自 STRONG_V53 真实强者名录） */
window.W66_PROFILES['lv_trade1']={ habit:'把账本翻到卷边的第一页，反复摩挲', tagline:'不赚让人活不下去的钱。', desire:'让自由城邦的路畅通十年', goal:'在清算日前结清每一笔人情账' };
window.W66_PROFILES['lv_war3']={ habit:'战时也在袖口藏着半截炭笔，随时记伤亡', tagline:'铁门关的墙，是用人名砌的。', desire:'让北境少死一些人', goal:'守住铁门关，把弟兄们活着带回家' };
window.W66_PROFILES['lv_war5']={ habit:'每天清晨擦那支插在房梁上的旧枪', tagline:'枪尖朝海，海就不敢上来。', desire:'守海', goal:'让港口城的船都平安回港' };
window.W66_PROFILES['lv_mage1']={ habit:'指尖总捻着一枚星屑，说话前先看天上', tagline:'星辰从不说谎，只是说得太慢。', desire:'听懂星语', goal:'在星落海找到那颗被藏起的星' };
window.W66_PROFILES['lv_mage3']={ habit:'青焰烧水沏茶，从不假手旁人', tagline:'火候到了，味道自然就对了。', desire:'炼出一味不熄的焰', goal:'把青焰一脉传下去' };
window.W66_PROFILES['lv_war1']={ habit:'每天卯时独自校场挥刀三千下', tagline:'铁壁不是砌出来的，是一刀一刀砍出来的。', desire:'让北境再无可破之壁', goal:'守护长城一线的千家灯火' };
window.W66_PROFILES['lv_war2']={ habit:'赤峰山脚下捡石子，垒在案头', tagline:'山会记得每一个走过它的人。', desire:'守住赤峰矿脉', goal:'让矿工的命比矿石值钱' };
window.W66_PROFILES['lv_priest1']={ habit:'拂晓前第一个进圣堂，点亮所有烛火', tagline:'神不说的话，由我们来说。', desire:'让圣城的钟声传到每个角落', goal:'弥合教会与诸邦的裂隙' };
window.W66_PROFILES['lv_thief1']={ habit:'从不留下脚印，却总留下一枚铜夜枭', tagline:'影子里的规矩，比阳光下的更严。', desire:'让偷窃也讲道义', goal:'在帝京地下立起自己的规矩' };
window.W66_PROFILES['lv_ranger1']={ habit:'逐风而行，随身带一袋断弓的旧弦', tagline:'风不等人，弓也不等。', desire:'追上那阵没追上的风', goal:'找到断弓一脉失落的猎场' };
window.W66_PROFILES['lv_knight1']={ habit:'白盾擦得能照人，才肯出门', tagline:'誓言比盾更硬。', desire:'让骑士的誓言不再被辜负', goal:'在帝京证明白盾的清白' };
window.W66_PROFILES['lv_smith1']={ habit:'锻打时哼北方古调，锤点合着节拍', tagline:'铁有铁的记忆，匠人只是唤醒它。', desire:'铸出一件百世不锈的器', goal:'在熔炉大厅留下格朗的印记' };
window.W66_PROFILES['lv_trade2']={ habit:'账房里的沙漏永远在走，他也永远在算', tagline:'半帆也敢出海，全看风向。', desire:'把生意做到帝国东岸', goal:'攒够买下那艘大商船的金币' };
window.W66_PROFILES['lv_soul1']={ habit:'午夜在梦墟边缘踱步，与亡魂交谈', tagline:'魂灯不灭，路就还在。', desire:'找到灵魂最初的形状', goal:'走完梦墟的第七重门' };
window.W66_PROFILES['de_mage']={ habit:'让元素自行流动，从不强求', tagline:'万物有灵，灵有初火。', desire:'看遍元素演化的终局', goal:'在星落海重燃初火' };
window.W66_PROFILES['de_war']={ habit:'戈声起处，百战不殆', tagline:'战神不佑怯者。', desire:'见证最强的战士诞生', goal:'寻一握可承神力的兵刃' };
/* /u7inj:cast-end/ */

    window.v66_castProfile=function(id){
      try{ return W66_PROFILES[id]||null; }catch(e){ return null; }
    };

    /* ===== 城市动作入口：打听见闻 ===== */
    try{
      if(typeof CITY_ACTIONS!=='undefined'&&CITY_ACTIONS&&CITY_ACTIONS.push){
        var hasNews=false;
        for(var i=0;i<CITY_ACTIONS.length;i++){ if(CITY_ACTIONS[i].k==='v66news'){ hasNews=true; break; } }
        if(!hasNews){ CITY_ACTIONS.push({k:'v66news', cn:'打听见闻', ic:'\u25C8', fn:"writeNext('v66_news_panel')"}); }
      }
    }catch(e){}

    /* ===== writeNext 叙事包装（不改判定；仅注入接续句/尾钩/氛围展示层） ===== */
    if(typeof window.writeNext==='function'){
      var __v66_wn=window.writeNext;
      window.writeNext=function(){
        try{
          var t=(typeof curNode!=='undefined')?curNode:null;
          if(t&&typeof N[t]==='function'){
            var cont=v66_contFor(t);
            if(cont&&typeof writePar==='function'){ try{ writePar(cont,'noind'); }catch(e){} }
            if(t&&t.indexOf('arrive_')===0){
              var at=v66_atmosphere();
              if(at&&typeof writePar==='function'){ try{ writePar(at,'noind'); }catch(e){} }
            }
          }
          var out=__v66_wn.apply(this,arguments);
          try{
            if(t&&typeof N[t]==='function'){
              var tail=v66_tailFor(t);
              if(tail){
                var st=document.getElementById('story');
                var opts=document.getElementById('options');
                var p=document.createElement('p');
                p.className='v66-tail';
                p.style.color='#887';
                p.style.margin='10px 0 4px';
                p.style.fontSize='13px';
                p.textContent=tail;
                if(st){ if(opts&&opts.parentNode===st){ st.insertBefore(p,opts); } else { st.appendChild(p); } }
              }
            }
          }catch(e){}
          return out;
        }catch(e){ return __v66_wn.apply(this,arguments); }
      };
      window.writeNext = window.writeNext;
    }
  }catch(e){ try{ console.error('v66 engine:',e); }catch(_){} }
})();
