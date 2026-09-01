// Shared quest-board helpers for town NPCs.
const QUEST_BOARD = Object.freeze({
  id: 'dawnreach-board',
  name: 'Dawnreach Quest Board',
  questIds: ['first-blood', 'green-thumb'],
});

function getBoardQuests() {
  if (typeof QUEST_DATA === 'undefined') return [];
  return QUEST_DATA.filter((quest) => QUEST_BOARD.questIds.includes(quest.id));
}

function getQuestBoardSummary() {
  const quests = getBoardQuests();
  return quests.map((quest) => ({
    id: quest.id,
    title: quest.title,
    description: quest.description,
    progress: questState?.progress?.[quest.id] || 0,
    amount: quest.amount,
    completed: !!questState?.completed?.[quest.id],
  }));
}
