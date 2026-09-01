// Farming content registry for Monster Garden.
// Keeps crop-specific metadata separate from the garden runtime.

const FARMING_CONTENT = Object.freeze({
  goblin: {
    monsterId: 'goblin',
    plantName: 'Goblinroot',
    stages: ['seed', 'sprout', 'young', 'mature'],
    growthSeconds: 45,
    harvest: { foodId: 'goblin', amount: 1 },
  },
  slime: {
    monsterId: 'slime',
    plantName: 'Ember Slime Bloom',
    stages: ['seed', 'sprout', 'young', 'mature'],
    growthSeconds: 55,
    harvest: { foodId: 'slime', amount: 1 },
  },
  wolf: {
    monsterId: 'wolf',
    plantName: 'Wolfthorn',
    stages: ['seed', 'sprout', 'young', 'mature'],
    growthSeconds: 65,
    harvest: { foodId: 'wolf', amount: 1 },
  },
});

function getFarmingContent(monsterId) {
  return FARMING_CONTENT[monsterId] || null;
}

function getPlantGrowthProgress(plant) {
  if (!plant || !Number.isFinite(plant.plantedAt) || !Number.isFinite(plant.growthSeconds) || plant.growthSeconds <= 0) return 0;
  const elapsed = Math.max(0, (Date.now() - plant.plantedAt) / 1000);
  return Math.max(0, Math.min(1, elapsed / plant.growthSeconds));
}
