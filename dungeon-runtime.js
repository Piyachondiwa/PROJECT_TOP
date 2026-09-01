// Runtime helpers for entering and progressing through dungeons.
const dungeonRuntimeState = window.dungeonRuntimeState || { enemiesRemaining: 0, bossReady: false };
window.dungeonRuntimeState = dungeonRuntimeState;

function getActiveDungeon() {
  if (typeof dungeonState === 'undefined' || !dungeonState.currentId) return null;
  return typeof getDungeon === 'function' ? getDungeon(dungeonState.currentId) : null;
}

function startDungeonFloor(enemyCount = 3) {
  if (typeof dungeonState === 'undefined' || !dungeonState.currentId) return false;
  dungeonRuntimeState.enemiesRemaining = Math.max(0, Math.floor(enemyCount));
  dungeonRuntimeState.bossReady = dungeonRuntimeState.enemiesRemaining === 0;
  if (typeof showMessage === 'function') showMessage(`Floor ${dungeonState.floor} begins.`);
  return true;
}

function defeatDungeonEnemy() {
  if (dungeonRuntimeState.enemiesRemaining <= 0) return false;
  dungeonRuntimeState.enemiesRemaining -= 1;
  dungeonRuntimeState.bossReady = dungeonRuntimeState.enemiesRemaining === 0;
  return true;
}

function nextDungeonFloor() {
  const dungeon = getActiveDungeon();
  if (!dungeon || !dungeonRuntimeState.bossReady) return false;
  if (dungeonState.floor >= dungeon.floors) {
    if (typeof startBossEncounter === 'function') return startBossEncounter(dungeon.bossId);
    return false;
  }
  dungeonState.floor += 1;
  startDungeonFloor(3 + dungeonState.floor);
  return true;
}
