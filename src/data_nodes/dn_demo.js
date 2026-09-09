// U1 内容外置化 · 数据节点文件 dn_demo.js
// 铁律：本文件只含节点数据（N["id"]=对象），不含引擎逻辑。
// 约定：节点本体存放于 src/data_nodes/，与引擎文件分离；构建时自动内联进 game.html 最后 script 块。
N["u1_demo"]={place:"交汇城 · 外置数据演示点",where:"白昼",text:[
"（U1 内容外置化验证节点——本节点本体存放在 src/data_nodes/dn_demo.js，与引擎文件完全分离。）",
"这条走廊是后来搭的。石墙上嵌着一块新铭牌，刻着三行字：",
"“内容与引擎分离。新增剧情只写数据，不改引擎。一切从此开始。”"
],pace:"light",options:[
{t:"返回市井",go:"fc_streets"}
]};
