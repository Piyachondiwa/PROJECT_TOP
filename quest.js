const QUEST_DATA = Object.freeze([
  { id: 'first-blood', title: 'A Seed from the Wild', description: 'Defeat a monster and bring back its seed.', type: 'kill', targetId: null, amount: 1, rewardGold: 40, rewardXp: 30 },
  { id: 'green-thumb', title: 'Strange New Growth', description: 'Plant and harvest one Monster Plant.', type: 'harvest', targetId: null, amount: 1, rewardGold: 60, rewardXp: 45 },
]);

const questState = window.questState || { activeId: 'first-blood', progress: {}, completed: {} };
window.questState = questState;

function getActiveQuest() { return QUEST_DATA.find((quest) => quest.id === questState.activeId) || null; }
function advanceQuest(type, targetId = null, amount = 1) {
  const quest = getActiveQuest();
  if (!quest || questState.completed[quest.id] || quest.type !== type) return;
  if (quest.targetId && quest.targetId !== targetId) return;
  questState.progress[quest.id] = (questState.progress[quest.id] || 0) + amount;
  if (questState.progress[quest.id] >= quest.amount) completeQuest(quest);
}
function completeQuest(quest) {
  if (questState.completed[quest.id]) return;
  questState.completed[quest.id] = true;
  player.gold += quest.rewardGold;
  player.xp += quest.rewardXp;
  checkLevelUp();
  showMessage(`Quest Complete: ${quest.title} • +${quest.rewardGold} Gold • +${quest.rewardXp} XP`);
  const nextIndex = QUEST_DATA.findIndex((q) => q.id === quest.id) + 1;
  questState.activeId = QUEST_DATA[nextIndex]?.id || null;
}
function getQuestProgressText() {
  const quest = getActiveQuest();
  if (!quest) return 'No active quest';
  return `${quest.title} — ${questState.progress[quest.id] || 0}/${quest.amount}`;
}
