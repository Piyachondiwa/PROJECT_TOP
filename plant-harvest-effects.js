// Centralized Monster Plant harvest and food effects.
const PLANT_FOOD_EFFECTS = Object.freeze({
  goblin: { heal: 10, traitId: 'goblin', skillId: 'goblin-rush' },
  slime: { heal: 12, traitId: 'slime', skillId: 'ember-burst' },
  wolf: { heal: 14, traitId: 'wolf', skillId: 'predator-dash' },
  bat: { heal: 16, traitId: 'bat', skillId: 'shadow-bite' },
  rotcap: { heal: 18, traitId: 'rotcap', skillId: 'spore-cloud' },
});

function applyMonsterPlantFood(monsterId) {
  const effect = PLANT_FOOD_EFFECTS[monsterId];
  if (!effect || typeof player === 'undefined') return false;
  player.hp = Math.min(player.maxHp, player.hp + effect.heal);
  player.activeTraits = player.activeTraits || {};
  player.activeTraits[effect.traitId] = true;
  player.unlockedSkillIds = player.unlockedSkillIds instanceof Set ? player.unlockedSkillIds : new Set(['ember-burst']);
  if (effect.skillId) player.unlockedSkillIds.add(effect.skillId);
  if (typeof updateHud === 'function') updateHud();
  return true;
}
