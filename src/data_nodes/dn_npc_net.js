/* /g6inj:data/ G-6 NPC 关系网（纯数据；只读回指，不改好感数值）
   v93g6_npcNetLine 读取；键=角色 id（兼容 NPCS/PROLOGUE_NPCS），cn=中文名
   V66 白描；治理词回避；saveVersion=48 不变 */
window.NPC_NET = {
  rock:   {cn:"罗克",   friends:["ata","tie"], rivals:["loka"], desc:"草原上来的同学，性子直。"},
  kain:   {cn:"凯恩",   friends:["rock"],     rivals:[],        desc:"从军升迁的同窗。"},
  alice:  {cn:"艾丽丝", friends:["elena"],    rivals:["cecy"],  desc:"火系法师塔的学徒。"},
  ata:    {cn:"阿塔",   friends:["rock","elena"], rivals:[],    desc:"与狼骨有关的兽人。"},
  loka:   {cn:"洛卡",   friends:["mori"],     rivals:["rock"],  desc:"药剂行会的学徒。"},
  cecy:   {cn:"塞西莉娅", friends:[],          rivals:["alice"], desc:"东境贵族的女儿。"},
  mori:   {cn:"莫里",   friends:["loka"],     rivals:[],        desc:"矮人工坊的学徒。"},
  elena:  {cn:"艾琳娜", friends:["alice","ata"], rivals:[],     desc:"精灵治愈师。"},
  tie:    {cn:"老铁",   friends:["rock"],     rivals:[],        desc:"铁门关的老兵。"},
  ferman: {cn:"费尔曼", friends:[],           rivals:[],        desc:"学院的藏书教授。"},
  li:     {cn:"李管事", friends:["loka"],     rivals:[],        desc:"商会的管事。"},
  tavern_owner: {cn:"客栈老板娘", friends:["li"], rivals:[], desc:"交汇城客栈的老板娘。"}
};
