// Expanded Monster Plant framework: stages, traits, harvested effects and mutations.
const PLANT_RULES = Object.freeze({ stages: 4, mutationChance: 0.18 });

const PLANT_DATA = Object.freeze({
  goblin: { id:'goblin', baseName:'Goblin Plant', growthTime:22, traitSource:'goblin' },
  slime: { id:'slime', baseName:'Fire Slime Plant', growthTime:26, traitSource:'slime' },
  wolf: { id:'wolf', baseName:'Wolf Plant', growthTime:30, traitSource:'wolf' },
  bat: { id:'bat', baseName:'Dusk Bat Plant', growthTime:34, traitSource:'bat' },
  mushroom: { id:'mushroom', baseName:'Rotcap Plant', growthTime:38, traitSource:'mushroom' },
});

const PLANT_MUTATIONS = Object.freeze([
  { parents:['wolf','bat'], result:'shadow_bloom', name:'Shadow Bloom' },
  { parents:['slime','goblin'], result:'ember_goblin', name:'Ember Goblin Vine' },
]);

function getPlantDefinition(monsterId) {
  return PLANT_DATA[monsterId] || null;
}

function getMutationResult(a, b) {
  const pair = [a,b].sort();
  const mutation = PLANT_MUTATIONS.find(m => JSON.stringify([...m.parents].sort()) === JSON.stringify(pair));
  return mutation || null;
}
