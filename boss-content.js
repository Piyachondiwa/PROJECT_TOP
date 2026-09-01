// Boss content registry for Monster Garden.
const BOSS_DATA = Object.freeze({
  cinder_wyrm: {
    id: 'cinder_wyrm', name: 'Cinder Wyrm', regionId: 'dravaryn_ash',
    level: 12, maxHp: 900, element: 'fire',
    phases: 2, rewardGold: 500, rewardXp: 650, seedId: 'cinder-wyrm',
  },
  grave_lord: {
    id: 'grave_lord', name: 'Grave Lord', regionId: 'nythrheim_moor',
    level: 20, maxHp: 1500, element: 'shadow',
    phases: 3, rewardGold: 900, rewardXp: 1200, seedId: 'grave-lord',
  },
  frost_colossus: {
    id: 'frost_colossus', name: 'Frost Colossus', regionId: 'aureval_wastes',
    level: 28, maxHp: 2600, element: 'ice',
    phases: 3, rewardGold: 1600, rewardXp: 2100, seedId: 'frost-colossus',
  },
});

function getBoss(id) { return BOSS_DATA[id] || null; }
function getBossForDungeon(dungeonId) {
  const dungeon = typeof getDungeon === 'function' ? getDungeon(dungeonId) : null;
  return dungeon ? getBoss(dungeon.bossId) : null;
}
