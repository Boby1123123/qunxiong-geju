// ============================================================
// 自动生成自: test_yaml_input.yaml
// 节点数: 2
// 生成时间: 2026-09-06 19:30:46
// ============================================================

N["test_node_001"]=function(){
  return {
    place:"测试地点·广场",
    text:function(){
const arr=[];
arr.push("这是一个测试节点。");
arr.push("第二行文本。");
arr.push("第三行文本。");
arr.push("");
return arr;
},
    options:[
      {t:"选项一（简单）",go:"test_node_002",effect:{gold:10,san:-5},timeCost:"1period"},
      {t:"选项二（带判定）",go:"test_node_003",check:"INT",effect:{xp:20},timeCost:"instant",tier:{crit:function(){return["你大获成功！"]},ok:function(){return["你成功了。"]},fail:function(){return["你失败了。"]},critfail:function(){return["你一败涂地！"]}}}
    ]
  };
};

N["test_node_002"]=function(){
  return {
    place:"测试地点·商店",
    text:function(){
const arr=[];
arr.push("你来到了商店。");
if(S.gold > 100){
  arr.push("你是个有钱人。");
} else {
  arr.push("你手头有点紧。");
}
return arr;
},
    options:[
      {t:"买面包",go:"test_node_001",effect:{gold:-5}},
      {t:"离开",go:"test_node_001"}
    ]
  };
};
