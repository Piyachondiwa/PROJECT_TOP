// Extensible plant mutation recipes. Pure data; runtime can consume this later.
const PLANT_MUTATION_RULES = Object.freeze([
  { id:'shadow-bloom', parents:['wolf','bat'], result:'shadow-bloom', chance:0.35 },
  { id:'ember-spore', parents:['slime','rotcap'], result:'ember-spore', chance:0.30 },
  { id:'verdant-hunter', parents:['goblin','wolf'], result:'verdant-hunter', chance:0.25 },
]);

function getMutationRule(parentA, parentB) {
  const parents = [parentA, parentB].sort();
  return PLANT_MUTATION_RULES.find((rule) => {
    const pair = [...rule.parents].sort();
    return pair[0] === parents[0] && pair[1] === parents[1];
  }) || null;
}
