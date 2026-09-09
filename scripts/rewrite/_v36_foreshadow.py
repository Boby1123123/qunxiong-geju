#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向六：序章伏笔回收节点（学院线回收）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

v36_foreshadow = r"""
/* ============================================================
   v36 序章伏笔回收节点（学院线）
   ============================================================ */

// ===== 黄林晶的信·学院线回收 =====
N["foreshadow_hlj_letter_academy"] = function(){ return {
  text:function(){return [
    "你在学院图书馆的禁书区翻阅时，一本古老的书籍从书架上掉落。",
    "你捡起来，发现书页中夹着一张泛黄的信纸。信纸上的字迹潦草而急切——和你序章中捡到的那半张残页，是同一个人的笔迹。",
    "信上写着：",
    "「……七印不是封印，是枷锁。原初之物不是恶魔，是被囚禁的神。墨丘利，如果你看到这封信，说明我已经失败了。但你必须继续——找到第七印，找到真相……」",
    "署名是：黄林晶。",
    "你想起了序章中那个从沙漠走出的人，他死前交给你的那封信。原来，这一切早就开始了。"
  ];},
  options:[
    {t:"把信交给墨丘利", go:"foreshadow_hlj_to_mercury", effect:{time:1}},
    {t:"自己藏起来继续调查", go:"foreshadow_hlj_investigate", effect:{time:1, san:-5}},
    {t:"烧掉这封信", go:"foreshadow_hlj_burn", effect:{time:1}}
  ]
};}

N["foreshadow_hlj_to_mercury"] = function(){ return {
  text:function(){return [
    "你找到墨丘利，把信交给他。",
    "他看完信后，沉默了很久。他的手在微微颤抖。",
    "「黄林晶……是我的老师。」他终于开口，「三十年前，他去调查第七印，然后就消失了。所有人都说他死了。」",
    "他抬起头看着你，眼神复杂：「谢谢你把这封信交给我。有些真相……我需要时间来消化。」",
    "「但你要小心。知道这件事的人，都会被盯上。」",
    "◆墨丘利好感+15，获得线索：黄林晶的调查笔记位置"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_hlj_investigate"] = function(){ return {
  text:function(){return [
    "你把信藏好，开始在图书馆中搜索关于黄林晶的记录。",
    "你发现，三十年前，黄林晶是学院最天才的学生。他在毕业前突然退学，然后就消失了。",
    "他的研究笔记被列为禁书，存放在禁书区的最深处。",
    "你决定找机会去看看那些笔记。",
    "◆获得线索：黄林晶的研究笔记在禁书区第三层"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_hlj_burn"] = function(){ return {
  text:function(){return [
    "你点燃了信纸。火焰吞噬了那些文字。",
    "但在信被完全烧掉之前，你看到了最后一行字：",
    "「……不要相信墨丘利……」",
    "信烧成了灰烬。你不知道这句话是什么意思，但它让你脊背发凉。",
    "◆SAN-5，获得线索：不要相信墨丘利？"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 守望者密探·学院线回收 =====
N["foreshadow_watcher_academy"] = function(){ return {
  text:function(){return [
    "你总觉得有人在看你。",
    "今天，那种感觉特别强烈。你回头，看到一个穿灰袍的人站在林荫大道的尽头。",
    "你走过去。他没有逃。",
    "「我们又见面了。」他的声音很平静，「序章时，我就在观察你。现在，我有一个问题要问你。」",
    "「你在序章中做的那些选择——你后悔吗？」"
  ];},
  options:[
    {t:"我不后悔", go:"foreshadow_watcher_proud", effect:{}},
    {t:"有些选择我确实后悔了", go:"foreshadow_watcher_regret", effect:{}},
    {t:"你是谁？为什么一直在观察我？", go:"foreshadow_watcher_identity", effect:{}}
  ]
};}

N["foreshadow_watcher_proud"] = function(){ return {
  text:function(){return [
    "灰袍人点了点头。",
    "「不后悔的人，要么是真正的英雄，要么是真正的恶魔。」他说，「我还不确定你是哪一种。」",
    "「但守望者会继续观察你。做出更多选择吧——你的每一个选择，都在书写历史。」",
    "他转身消失在人群中。你摸了摸胸口，那里有一枚你序章时获得的、不知道什么材质的徽章。",
    "◆守望者声望+10"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_watcher_regret"] = function(){ return {
  text:function(){return [
    "灰袍人沉默了片刻。",
    "「后悔是人之常情。」他说，「但后悔也是一种力量——它让你在未来做出更好的选择。」",
    "「守望者记录历史，但我们也相信，人可以改变历史。你的过去已经无法改变，但你的未来还在你手中。」",
    "他递给你一枚小小的银色眼睛徽章：「如果你想了解更多关于守望者的事，拿着这个去交汇城的老书店。」",
    "◆获得守望者徽章，守望者声望+15"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

N["foreshadow_watcher_identity"] = function(){ return {
  text:function(){return [
    "灰袍人微微一笑。",
    "「我是守望者。我们观察、记录、维护平衡。我们已经观察这个世界三千年了。」",
    "「至于为什么观察你——因为你是特殊的。你的命运线，和七印、和原初之物、和这个世界的未来，都交织在一起。」",
    "「你序章中做的每一个选择，都在影响这个世界的走向。我们需要知道，你会把世界带向何方。」",
    "他转身离开：「想加入我们的话，去交汇城找老书店的店主。」",
    "◆获得线索：守望者招募地点"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 序章道德选择·学院线回收 =====
N["foreshadow_moral_academy"] = function(){ return {
  text:function(){return [
    "学院的食堂里，你听到旁边的学生在议论什么。",
    "「听说了吗？交汇城有个面包店老板，最近在找一个人。他说几年前有人偷了他的面包，但他不恨那个人——他说那个人一定是饿坏了。」",
    "另一个学生说：「还有个难民，说是被一个好心人救过，现在发达了，到处找那个恩人报恩。」",
    "你心里一动。这些事……似乎和你序章中的某些选择有关。"
  ];},
  options:[
    {t:"去打听更多", go:"foreshadow_moral_investigate", effect:{time:1}},
    {t:"装作没听见", go:"academy_elda_hub", effect:{time:1}}
  ]
};}

N["foreshadow_moral_investigate"] = function(){ return {
  text:function(){
    var moral = S.moralChoices ? S.moralChoices : {};
    var text = ["你开始打听这些事的细节。"];
    if(moral.bread_steal === true){
      text.push("面包店老板确实在找你。他说：「那个偷面包的孩子，如果他现在还饿，我愿意再给他一个。」");
      text.push("你没有承认。但你心里有种说不出的滋味。");
    }
    if(moral.refugee_help === true){
      text.push("那个难民真的发达了。他现在是一个小商会的会长，在到处找当年给他钱的人。");
      text.push("他说：「没有那个人，我早就死了。我要报答他。」");
    }
    if(moral.bread_steal !== true && moral.refugee_help !== true){
      text.push("你打听了一圈，但这些事似乎和你没有直接关系。也许只是巧合。");
    }
    text.push("◆序章的选择，正在以你意想不到的方式影响着现在。");
    return text;
  },
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

// ===== 第一印碎块·学院线回收 =====
N["foreshadow_seal_fragment_academy"] = function(){ return {
  text:function(){return [
    "你在学院的灵魂魔法塔中修炼时，胸口突然传来一阵灼热。",
    "你序章中接触第一印碎片时获得的那个印记，正在发光。",
    "一段不属于你的记忆涌入你的脑海：",
    "「……第一印不是封印，是门。门的后面，是原初之物的沉睡之地。不要打开门——至少，不要在你准备好之前……」",
    "记忆消失了。你发现自己出了一身冷汗。",
    "墨丘利不知何时站在你身后，他看着你胸口的印记，脸色凝重。",
    "「你……接触过第一印的碎片？」"
  ];},
  options:[
    {t:"如实告诉他", go:"foreshadow_seal_tell", effect:{}},
    {t:"否认", go:"foreshadow_seal_deny", effect:{}}
  ]
};}

N["foreshadow_seal_tell"] = function(){ return {
  text:function(){return [
    "你如实告诉了墨丘利序章中发生的事。",
    "他听完后，沉默了很久。",
    "「第一印的碎片……已经有三百年没有人接触过了。」他说，「你能活下来，说明你和七印有某种特殊的联系。」",
    "「这种联系，可能是你的幸运，也可能是你的诅咒。」",
    "「跟我来。我有一些东西要给你看。」",
    "◆墨丘利好感+10，获得线索：第一印的真相"
  ];},
  options:[{t:"跟他走", go:"academy_elda_soul_tower", effect:{time:1}}]
};}

N["foreshadow_seal_deny"] = function(){ return {
  text:function(){return [
    "你摇了摇头：「没有，我不知道你在说什么。」",
    "墨丘利看了你很久，然后叹了口气。",
    "「每个人都有自己的秘密。」他说，「但记住——七印的秘密，不是你一个人能承担的。当你准备好的时候，来找我。」",
    "他转身离开。你摸了摸胸口的印记，它还在微微发热。",
    "◆墨丘利好感-5，但你保守了自己的秘密"
  ];},
  options:[{t:"离开", go:"academy_elda_hub", effect:{time:1}}]
};}

console.log('[V36] 序章伏笔回收节点已加载（黄林晶信/守望者/道德选择/第一印碎块）');
"""

# 插入JS到最后一个</script>之前
script_end = html.rfind('</script>')
if script_end > 0:
    html = html[:script_end] + v36_foreshadow + '\n' + html[script_end:]
    print("✓ v36序章伏笔回收节点已插入（4条伏笔×3-4节点=14节点）")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"文件大小: {len(html)} 字符")
