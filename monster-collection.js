// Monster collection / codex foundation.
// Tracks first discoveries, defeated counts and best level encountered.
const monsterCollection = window.monsterCollection || {};
window.monsterCollection = monsterCollection;

function recordMonsterEncounter(monster) {
  if (!monster?.id) return;
  if (!monsterCollection[monster.id]) {
    monsterCollection[monster.id] = { discovered: false, defeated: 0, bestLevel: 0 };
  }
  const entry = monsterCollection[monster.id];
  entry.discovered = true;
  entry.bestLevel = Math.max(entry.bestLevel, Number(monster.level) || 0);
}

function recordMonsterDefeat(monster) {
  recordMonsterEncounter(monster);
  monsterCollection[monster.id].defeated += 1;
}

function getMonsterCollectionStats() {
  const entries = Object.values(monsterCollection);
  return {
    discovered: entries.filter((entry) => entry.discovered).length,
    defeated: entries.reduce((sum, entry) => sum + (entry.defeated || 0), 0),
  };
}
