/* ============ u7 多周目系统（C2）============
 * 接通 v76 预留字段：ngPlus / runHistory / endingsCollected
 * 原则：不改变结局判定 / 存档结构 / saveVersion=48；旧档 applyDefaults 兜底链不变
 * - u7_ngRecord : 结局触发时记录（结局图鉴 + 周目快照）
 * - u7_ngInherit: newGame 时继承跨周目资产（仅图鉴/历史，属性物品不继承）
 * - u7_ngPanel  : 周目回顾弹窗（结局图鉴 + 周目统计 + 本局摘要）
 */
(function(){
  var MAX_HISTORY = 12; /* 周目快照上限，防存档膨胀 */

  function snapRun(){
    /* 本局摘要（只存小字段，不存大对象） */
    var s = (typeof S !== 'undefined' && S) ? S : null;
    if(!s) return null;
    var snap = {
      name: s.name || '无名旅者',
      job: s.job || null,
      ending: s.ending || null,
      day: s.day || 0,
      gold: s.gold || 0,
      rep: s.rep || 0,
      realm: s.realm || 0,
      ideal: s.ideal || null,
      at: Date.now()
    };
    return snap;
  }

  function u7_ngRecord(id){
    try{
      if(typeof S === 'undefined' || !S) return;
      /* 结局图鉴（去重） */
      S.endingsCollected = S.endingsCollected || [];
      if(id && S.endingsCollected.indexOf(id) < 0) S.endingsCollected.push(id);
      /* 周目快照（只在本局有实质内容时记录；去重同一局重复触发） */
      if(!S._endingRecorded){
        S._endingRecorded = true;
        var snap = snapRun();
        if(snap && snap.ending){
          S.runHistory = S.runHistory || [];
          S.runHistory.push(snap);
          if(S.runHistory.length > MAX_HISTORY) S.runHistory = S.runHistory.slice(-MAX_HISTORY);
        }
      }
      /* 持久化跨周目档案（结局时写盘，供 newGame 继承） */
      try{
        var _ng = S.ngPlus || 1;
        localStorage.setItem('elda-ngplus-v2', JSON.stringify({collected: S.endingsCollected || [], history: S.runHistory || [], ng: _ng}));
      }catch(e){}
      /* 兼容 v47 legacy 记录（不替代，只补充） */
      try{
        if(window.v47_endingRecord) v47_endingRecord(id);
      }catch(e){}
    }catch(e){}
  }
  window.u7_ngRecord = u7_ngRecord;

  function u7_ngInherit(){
    try{
      if(typeof S === 'undefined' || !S) return;
      /* 跨周目继承：只保留 图鉴 / 周目历史 / 周目号（v76 预留字段） */
      var keep = {};
      try{
        if(localStorage.getItem('elda-ngplus-v2')){
          var pre = JSON.parse(localStorage.getItem('elda-ngplus-v2') || '{}');
          keep = pre || {};
        }
      }catch(e){}
      /* 从跨周目档案恢复（结局时已写盘；emptyState 后旧 S 对象已不可用，档案为权威源） */
      var old = null;
      try{ old = S; }catch(e){}
      var collected = (keep.collected && keep.collected.length) ? keep.collected.slice() : ((old && old.endingsCollected) ? old.endingsCollected.slice() : []);
      var history   = (keep.history && keep.history.length)   ? keep.history.slice()   : ((old && old.runHistory)   ? old.runHistory.slice()   : []);
      var ng        = ((old && old.ngPlus && old.ngPlus > (keep.ng || 0)) ? old.ngPlus : (keep.ng || 0)) + 1;
      /* 写入新 S（emptyState 之后调用） */
      S.ngPlus = ng;
      S.endingsCollected = collected;
      S.runHistory = history;
      /* 持久化跨周目档案（防未保存清档丢失） */
      try{
        localStorage.setItem('elda-ngplus-v2', JSON.stringify({collected: collected, history: history, ng: ng}));
      }catch(e){}
    }catch(e){}
  }
  window.u7_ngInherit = u7_ngInherit;

  function u7_ngPanel(){
    try{
      var s = (typeof S !== 'undefined' && S) ? S : null;
      if(!s) return;
      var ng = s.ngPlus || 1;
      var collected = s.endingsCollected || [];
      var history = s.runHistory || [];
      var box = document.createElement('div');
      box.className = 'box';
      var h = '<h2>周目回顾 · 第 ' + ng + ' 世</h2>';
      h += '<p class="sub">每一段旅程都算数。走过的路，见过的人，都留在图鉴里。</p>';
      h += '<div style="margin:10px 0;font-size:14px;">';
      h += '已收集结局 <b style="color:#a8842a;">' + collected.length + '</b> 个';
      if(history.length) h += ' · 完整旅程 <b style="color:#a8842a;">' + history.length + '</b> 世';
      h += '</div>';
      if(collected.length){
        h += '<div style="margin:8px 0;"><b>结局图鉴</b></div><div style="display:flex;flex-wrap:wrap;gap:6px;">';
        for(var i = 0; i < collected.length; i++){
          var eid = collected[i];
          var E = (typeof ENDINGS !== 'undefined' && ENDINGS[eid]) ? ENDINGS[eid] : null;
          h += '<span style="border:1px solid rgba(168,132,42,.4);border-radius:8px;padding:4px 10px;font-size:13px;background:rgba(168,132,42,.08);">' +
               (E && E.cn ? E.cn : eid) + '</span>';
        }
        h += '</div>';
      }
      if(history.length){
        h += '<div style="margin:10px 0 6px;"><b>往世足迹</b></div>';
        for(var k = history.length - 1; k >= 0; k--){
          var r = history[k];
          var E2 = (typeof ENDINGS !== 'undefined' && ENDINGS[r.ending]) ? ENDINGS[r.ending] : null;
          h += '<div style="font-size:13px;margin:3px 0;color:#6b7280;">第 ' + (k + 1) + ' 世 · ' +
               (r.name || '无名旅者') + ' · ' + (r.job || '旅人') +
               (E2 && E2.cn ? ' · ' + E2.cn : '') +
               ' · 第' + (r.day || 0) + '日</div>';
        }
      }
      h += '<button class="opt" onclick="closeModal()"><span class="od">✕</span> 合上回忆</button>';
      box.innerHTML = h;
      if(typeof openModal === 'function') openModal(box);
    }catch(e){}
  }
  window.u7_ngPanel = u7_ngPanel;
})();
/* /u7inj:ng-system/ */
