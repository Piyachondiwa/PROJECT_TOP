const QUEST_STATE = window.questState || { activeId: 'first-blood', progress: {}, completed: {} };
window.questState = QUEST_STATE;

function getActiveQuest() {
  const list = Array.isArray(window.QUEST_CONTENT) ? window.QUEST_CONTENT : [];
  return list.find((quest) => quest.id === QUEST_STATE.activeId) || null;
}

function advanceQuest(type, targetId = null, amount = 1) {
  const quest = getActiveQuest();
  if (!quest || QUEST_STATE.completed[quest.id] || quest.type !== type) return false;
  if (quest.targetId && quest.targetId !== targetId) return false;
  const increment = Math.max(0, Number(amount) || 0);
  const current = Math.max(0, Number(QUEST_STATE.progress[quest.id]) || 0);
  QUEST_STATE.progress[quest.id] = Math.min(quest.amount, current + increment);
  if (QUEST_STATE.progress[quest.id] >= quest.amount) completeQuest(quest);
  return true;
}

function completeQuest(quest) {
  if (!quest || QUEST_STATE.completed[quest.id]) return;
  QUEST_STATE.completed[quest.id] = true;
  if (window.player) {
    player.gold += Math.max(0, Number(quest.rewardGold) || 0);
    player.xp += Math.max(0, Number(quest.rewardXp) || 0);
  }
  if (typeof window.checkLevelUp === 'function') window.checkLevelUp();
  if (typeof window.showMessage === 'function') showMessage(`Quest Complete: ${quest.title}`);
  const list = Array.isArray(window.QUEST_CONTENT) ? window.QUEST_CONTENT : [];
  const index = list.findIndex((item) => item.id === quest.id);
  window.questState.activeId = list[index + 1]?.id || null;
}

function getQuestProgressText() {
  const quest = getActiveQuest();
  if (!quest) return 'No active quest';
  return `${quest.title} — ${QUEST_STATE.progress[quest.id] || 0}/${quest.amount}`;
}
