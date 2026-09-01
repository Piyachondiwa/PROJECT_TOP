// Gameplay loop integration helpers for Monster Garden.
// Keeps cross-system actions centralized without owning rendering.

const GameplayLoop = window.GameplayLoop || {};
window.GameplayLoop = GameplayLoop;

GameplayLoop.onMonsterDefeated = function onMonsterDefeated(monster, amount = 1) {
  if (!monster) return;
  if (typeof recordMonsterDiscovery === 'function') recordMonsterDiscovery(monster.id, monster.level);
  if (typeof advanceQuest === 'function') advanceQuest('kill', monster.id, amount);
  if (typeof showMessage === 'function') showMessage(`${monster.name} defeated.`);
};

GameplayLoop.onPlantHarvested = function onPlantHarvested(monsterId, amount = 1) {
  if (!monsterId) return;
  if (typeof advanceQuest === 'function') advanceQuest('harvest', null, amount);
  if (typeof recordPlantHarvest === 'function') recordPlantHarvest(monsterId, amount);
};

GameplayLoop.onPlantConsumed = function onPlantConsumed(monsterId) {
  if (!monsterId) return;
  if (typeof recordFoodConsumed === 'function') recordFoodConsumed(monsterId);
};

GameplayLoop.getActiveRegion = function getActiveRegion() {
  if (typeof getCurrentRegion === 'function') return getCurrentRegion();
  return null;
};
