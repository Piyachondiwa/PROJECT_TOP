// Persistent state registry for systems that are optional at startup.
// Keeps the save layer extensible without coupling every feature to storage.js.

function collectExtendedState() {
  return {
    questState: typeof questState !== 'undefined' ? JSON.parse(JSON.stringify(questState)) : null,
    worldProgress: typeof worldProgress !== 'undefined' ? JSON.parse(JSON.stringify(worldProgress)) : null,
    dungeonState: typeof dungeonState !== 'undefined' ? JSON.parse(JSON.stringify(dungeonState)) : null,
    equipmentState: typeof equipmentState !== 'undefined' ? JSON.parse(JSON.stringify(equipmentState)) : null,
    shopState: typeof shopState !== 'undefined' ? JSON.parse(JSON.stringify(shopState)) : null,
    monsterCollection: typeof monsterCollection !== 'undefined' ? JSON.parse(JSON.stringify(monsterCollection)) : null,
  };
}

function restoreExtendedState(state) {
  if (!state || typeof state !== 'object') return;
  if (state.questState && typeof window.questState === 'object') Object.assign(window.questState, state.questState);
  if (state.worldProgress && typeof window.worldProgress === 'object') Object.assign(window.worldProgress, state.worldProgress);
  if (state.dungeonState && typeof window.dungeonState === 'object') Object.assign(window.dungeonState, state.dungeonState);
  if (state.equipmentState && typeof window.equipmentState === 'object') Object.assign(window.equipmentState, state.equipmentState);
  if (state.shopState && typeof window.shopState === 'object') Object.assign(window.shopState, state.shopState);
  if (state.monsterCollection && typeof window.monsterCollection === 'object') Object.assign(window.monsterCollection, state.monsterCollection);
}
