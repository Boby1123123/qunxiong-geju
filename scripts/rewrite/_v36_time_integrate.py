#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v36 方向四：时间系统联动（战斗消耗时间+任务截止日期）"""

with open('game.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 修改v35_closeBattleResult，战斗结束后推进时间
old_close = """function v35_closeBattleResult() {
  const overlay = document.getElementById('v35-battle-result');
  if (overlay) overlay.classList.remove('active');
  v35_hideBattleUI();
  // 跳转到战后节点
  var nextNode = V35_BATTLE.nextVictory;
  if (V35_BATTLE.result === "defeat") nextNode = V35_BATTLE.nextDefeat;
  if (V35_BATTLE.result === "flee") nextNode = V35_BATTLE.nextFlee;
  if (nextNode && N[nextNode]) {
    curNode = nextNode;
    document.getElementById('story').innerHTML = '';
    writeNext();
  }
}"""

new_close = """function v35_closeBattleResult() {
  const overlay = document.getElementById('v35-battle-result');
  if (overlay) overlay.classList.remove('active');
  v35_hideBattleUI();
  // 战斗消耗时间：普通战斗1时段，BOSS战1天
  if (V35_BATTLE.enemy && (V35_BATTLE.enemy.hp > 150 || V35_BATTLE.enemy.id.indexOf('boss') >= 0 || V35_BATTLE.enemy.id.indexOf('seal') >= 0)) {
    if (typeof advanceTime === 'function') advanceTime(4); // BOSS战消耗1天（4时段）
  } else {
    if (typeof advanceTime === 'function') advanceTime(1); // 普通战斗消耗1时段
  }
  // 跳转到战后节点
  var nextNode = V35_BATTLE.nextVictory;
  if (V35_BATTLE.result === "defeat") nextNode = V35_BATTLE.nextDefeat;
  if (V35_BATTLE.result === "flee") nextNode = V35_BATTLE.nextFlee;
  if (nextNode && N[nextNode]) {
    curNode = nextNode;
    document.getElementById('story').innerHTML = '';
    writeNext();
  }
}"""

if old_close in html:
    html = html.replace(old_close, new_close)
    print("✓ 战斗结束后自动推进时间")
else:
    print("⚠ 未找到v35_closeBattleResult函数")

# 2. 修改v35_acceptQuest，设置截止日期
old_accept = """function v35_acceptQuest(questId) {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  const quests = V35_FACTION_QUESTS[factionId] || [];
  const quest = quests.find(q => q.id === questId);
  if (!quest) return false;
  if (quest.rankReq > V35_FACTION_STATE.rank) return false;
  
  V35_FACTION_STATE.quests.push(questId);
  S.faction.quests = [...V35_FACTION_STATE.quests];
  
  V35_EventBus.emit('faction:quest_accept', { questId });
  return true;
}"""

new_accept = """function v35_acceptQuest(questId) {
  const factionId = V35_FACTION_STATE.joined;
  if (!factionId) return false;
  
  const quests = V35_FACTION_QUESTS[factionId] || [];
  const quest = quests.find(q => q.id === questId);
  if (!quest) return false;
  if (quest.rankReq > V35_FACTION_STATE.rank) return false;
  
  V35_FACTION_STATE.quests.push(questId);
  S.faction.quests = [...V35_FACTION_STATE.quests];
  
  // 设置任务截止日期（7-30天，根据任务类型）
  if (!S.questDeadlines) S.questDeadlines = {};
  var deadline = 7 + Math.floor(Math.random() * 23); // 7-30天
  if (quest.type === 'combat') deadline = 10 + Math.floor(Math.random() * 10);
  if (quest.type === 'diplomacy') deadline = 15 + Math.floor(Math.random() * 15);
  S.questDeadlines[questId] = { acceptedDay: S.time ? S.time.totalDays : 0, deadlineDays: deadline };
  
  V35_EventBus.emit('faction:quest_accept', { questId, deadline });
  return true;
}"""

if old_accept in html:
    html = html.replace(old_accept, new_accept)
    print("✓ 势力任务接受时设置截止日期")
else:
    print("⚠ 未找到v35_acceptQuest函数")

# 3. 在势力面板显示任务截止日期
old_quest_active = """${active.length > 0 ? active.map(qid => {
          const faction = V35_FACTIONS[V35_FACTION_STATE.joined];
          const quest = (V35_FACTION_QUESTS[V35_FACTION_STATE.joined]||[]).find(q=>q.id===qid);
          return quest ? `
            <div class="faction-quest-item">
              <div class="faction-quest-title">${quest.name}</div>
              <div class="faction-quest-desc">${quest.desc}</div>
              <button class="battle-btn" style="margin-top:6px;padding:4px 12px;font-size:12px;" onclick="if(v35_completeQuest('${qid}')){v35_renderFactionPanel('quests')}">完成任务</button>
            </div>
          ` : '';
        }).join('') : '<div style="color:#8a9bb0;">暂无进行中的任务</div>'}"""

new_quest_active = """${active.length > 0 ? active.map(qid => {
          const faction = V35_FACTIONS[V35_FACTION_STATE.joined];
          const quest = (V35_FACTION_QUESTS[V35_FACTION_STATE.joined]||[]).find(q=>q.id===qid);
          var deadlineText = '';
          if (S.questDeadlines && S.questDeadlines[qid]) {
            var d = S.questDeadlines[qid];
            var passed = (S.time ? S.time.totalDays : 0) - d.acceptedDay;
            var remaining = d.deadlineDays - passed;
            if (remaining > 0) deadlineText = '<span style="color:#7fd68f;">剩余' + remaining + '天</span>';
            else deadlineText = '<span style="color:#ff8a8a;">已过期！</span>';
          }
          return quest ? `
            <div class="faction-quest-item">
              <div class="faction-quest-title">${quest.name} ${deadlineText}</div>
              <div class="faction-quest-desc">${quest.desc}</div>
              <button class="battle-btn" style="margin-top:6px;padding:4px 12px;font-size:12px;" onclick="if(v35_completeQuest('${qid}')){v35_renderFactionPanel('quests')}">完成任务</button>
            </div>
          ` : '';
        }).join('') : '<div style="color:#8a9bb0;">暂无进行中的任务</div>'}"""

if old_quest_active in html:
    html = html.replace(old_quest_active, new_quest_active)
    print("✓ 势力面板显示任务截止日期")
else:
    print("⚠ 未找到任务列表代码")

with open('game.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n文件大小: {len(html)} 字符")
