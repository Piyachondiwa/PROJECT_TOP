// Simple quest system. Data-driven so new quests can be added without rewriting the game loop.
const QUEST_DATA = Object.freeze({
  'first-blood': {
    id: 'first-blood',
    name: 'First Harvest',
    description: 'Defeat your first monster and bring its seed back to the garden.',
    type: 'kill', target: 1, targetId: 'any',
    reward: { gold: 60, xp: 40 },
  },
  'garden-start': {
    id: 'garden-start',
    name: 'A Strange Seed',
    description: 'Plant a Monster Seed in the garden.',
    type: 'plant', target: 1, targetId: 'any',
    reward: { gold: 40, xp: 30 },
  },
  'harvest-one': {
    id: 'harvest-one',
    name: 'First Harvest',
    description: 'Harvest a fully grown Monster Plant.',
    type: 'harvest', target: 1, targetId: 'any',
    reward: { gold: 55, xp: 35 },
  },
});

const questState = {
  active: ['first-blood', 'garden-start', 'harvest-one'],
  progress: {},
  completed: [],
};

function getQuest(id) { return QUEST_DATA[id] || null; }
function getQuestProgress(id) { return Math.max(0, Number(questState.progress[id]) || 0); }
function isQuestCompleted(id) { return questState.completed.includes(id); }

function advanceQuest(type, targetId = 'any', amount = 1) {
  let changed = false;
  for (const id of questState.active) {
    const quest = getQuest(id);
    if (!quest || isQuestCompleted(id) || quest.type !== type) continue;
    if (quest.targetId !== 'any' && quest.targetId !== targetId) continue;
    const next = Math.min(quest.target, getQuestProgress(id) + Math.max(0, amount));
    if (next !== getQuestProgress(id)) {
      questState.progress[id] = next;
      changed = true;
      if (next >= quest.target) completeQuest(quest);
    }
  }
  return changed;
}

function completeQuest(quest) {
  if (isQuestCompleted(quest.id)) return;
  questState.completed.push(quest.id);
  player.gold += quest.reward.gold || 0;
  player.xp += quest.reward.xp || 0;
  checkLevelUp();
  showMessage(`Quest complete: ${quest.name}`);
  if (typeof saveGame === 'function') saveGame(false);
}

function getQuestSummary() {
  return questState.active.map((id) => {
    const quest = getQuest(id);
    return quest ? { ...quest, progress: getQuestProgress(id), completed: isQuestCompleted(id) } : null;
  }).filter(Boolean);
}

function serializeQuestState() {
  return {
    active: [...questState.active],
    progress: { ...questState.progress },
    completed: [...questState.completed],
  };
}

function restoreQuestState(raw) {
  if (!raw || typeof raw !== 'object') return;
  questState.active = Array.isArray(raw.active) ? raw.active.filter((id) => QUEST_DATA[id]) : Object.keys(QUEST_DATA);
  questState.progress = raw.progress && typeof raw.progress === 'object' ? { ...raw.progress } : {};
  questState.completed = Array.isArray(raw.completed) ? raw.completed.filter((id) => QUEST_DATA[id]) : [];
}
