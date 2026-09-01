// Monster Plant evolution system.
// Plants keep their monster identity while gaining growth stages and mutations.

const PLANT_MUTATIONS = Object.freeze([
  { id: 'shadow-bloom', parents: ['wolf', 'bat'], result: 'shadow-bloom', trait: 'Night Prowler' },
  { id: 'ember-cap', parents: ['slime', 'mushroom'], result: 'ember-cap', trait: 'Scorch Spores' },
  { id: 'thorn-goblin', parents: ['goblin', 'mushroom'], result: 'thorn-goblin', trait: 'Bramble Skin' },
]);

const PLANT_SPECIES = Object.freeze({
  goblin: { id: 'goblin', name: 'Goblin Plant', baseGrowth: 22 },
  slime: { id: 'slime', name: 'Fire Slime Plant', baseGrowth: 24 },
  wolf: { id: 'wolf', name: 'Wolf Plant', baseGrowth: 28 },
  bat: { id: 'bat', name: 'Dusk Bat Plant', baseGrowth: 30 },
  mushroom: { id: 'mushroom', name: 'Rotcap Plant', baseGrowth: 32 },
  'shadow-bloom': { id: 'shadow-bloom', name: 'Shadow Bloom', baseGrowth: 36 },
  'ember-cap': { id: 'ember-cap', name: 'Ember Cap', baseGrowth: 38 },
  'thorn-goblin': { id: 'thorn-goblin', name: 'Thorn Goblin Plant', baseGrowth: 34 },
});

function getPlantSpecies(id) {
  return PLANT_SPECIES[id] || null;
}

function getPlantMutation(a, b) {
  const pair = [a, b].sort();
  return PLANT_MUTATIONS.find((mutation) => {
    const parents = [...mutation.parents].sort();
    return parents[0] === pair[0] && parents[1] === pair[1];
  }) || null;
}

function getPlantGrowthStage(progress) {
  if (progress >= 1) return 3;
  if (progress >= 0.66) return 2;
  if (progress >= 0.33) return 1;
  return 0;
}
