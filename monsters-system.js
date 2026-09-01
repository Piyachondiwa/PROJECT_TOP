// Monster system expansion: runtime helpers for spawning and scaling monsters.
// This file is data-driven and intentionally independent from rendering.

function getRegionLevelRange(regionId) {
  const region = typeof REGION_DEFINITIONS !== 'undefined' ? REGION_DEFINITIONS[regionId] : null;
  return region ? { min: region.levelMin, max: region.levelMax } : { min: 1, max: 4 };
}

function createScaledMonster(monsterId, x, y, regionId = 'eldoria_fields') {
  const base = MONSTER_DATA[monsterId];
  if (!base) return null;

  const range = getRegionLevelRange(regionId);
  const entry = typeof getMonsterSpawnEntries === 'function'
    ? getMonsterSpawnEntries(regionId).find((item) => item.id === monsterId)
    : null;
  const min = Math.max(1, entry?.minLevel ?? range.min ?? base.level ?? 1);
  const max = Math.max(min, entry?.maxLevel ?? range.max ?? min);
  const level = min + Math.floor(Math.random() * (max - min + 1));

  return {
    ...base,
    level,
    regionId,
    x,
    y,
    spawnX: x,
    spawnY: y,
    maxHp: base.baseHp + level * 4,
    hp: base.baseHp + level * 4,
    alive: true,
    hitFlash: 0,
    attackCooldown: 0,
  };
}

function getMonsterReward(monster) {
  const level = Math.max(1, monster?.level || 1);
  return {
    xp: 25 + level * 10,
    gold: 15 + level * 5,
  };
}

function getMonsterElementColor(monster) {
  return typeof elementColors !== 'undefined'
    ? (elementColors[monster?.element] || '#aaa')
    : '#aaa';
}
