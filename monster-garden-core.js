/*
 * Monster Garden Core Integration Layer
 * Keeps newer systems loosely coupled to the existing prototype.
 */

(() => {
  const state = window.monsterGardenCore || {
    initialized: false,
    discovered: {},
    harvested: {},
    mealsConsumed: {},
    counters: { kills: 0, plantsHarvested: 0, mealsConsumed: 0 },
  };
  window.monsterGardenCore = state;

  function markDiscovered(id) {
    if (!id) return;
    state.discovered[id] = true;
  }

  function recordKill(monster) {
    if (!monster?.id) return;
    markDiscovered(monster.id);
    state.counters.kills += 1;
    if (typeof advanceQuest === 'function') advanceQuest('kill', monster.id, 1);
  }

  function recordHarvest(monsterId) {
    if (!monsterId) return;
    markDiscovered(monsterId);
    state.harvested[monsterId] = (state.harvested[monsterId] || 0) + 1;
    state.counters.plantsHarvested += 1;
    if (typeof advanceQuest === 'function') advanceQuest('harvest', monsterId, 1);
  }

  function recordMeal(monsterId) {
    if (!monsterId) return;
    markDiscovered(monsterId);
    state.mealsConsumed += 1;
    state.mealsConsumed[monsterId] = (state.mealsConsumed[monsterId] || 0) + 1;
  }

  function getCollectionProgress() {
    const total = Object.keys(window.MONSTER_DATA || {}).length;
    const found = Object.keys(state.discovered).filter((id) => window.MONSTER_DATA?.[id]).length;
    return { found, total };
  }

  window.MonsterGardenCore = {
    markDiscovered,
    recordKill,
    recordHarvest,
    recordMeal,
    getCollectionProgress,
    state,
  };

  state.initialized = true;
})();
