// Data-driven food effects from Monster Plants.
const MONSTER_FOOD_EFFECTS = Object.freeze({
  goblin: { heal: 10, trait: 'Scavenger', skillId: 'goblin-rush' },
  slime: { heal: 14, trait: 'Ember Skin', skillId: 'ember-burst' },
  wolf: { heal: 16, trait: 'Predator', skillId: 'predator-dash' },
  bat: { heal: 18, trait: 'Night Sight', skillId: 'shadow-bite' },
  rotcap: { heal: 20, trait: 'Sporebody', skillId: 'spore-cloud' },
});

function getFoodEffect(monsterId) {
  return MONSTER_FOOD_EFFECTS[monsterId] || { heal: 8, trait: null, skillId: null };
}

function consumeMonsterFood(monsterId) {
  const count = Number(player.foods?.[monsterId] || 0);
  if (count <= 0) return false;
  player.foods[monsterId] = count - 1;
  if (player.foods[monsterId] <= 0) delete player.foods[monsterId];

  const effect = getFoodEffect(monsterId);
  player.hp = Math.min(player.maxHp, player.hp + effect.heal);
  if (effect.trait) player.activeTraits[monsterId] = true;
  if (effect.skillId instanceof String || typeof effect.skillId === 'string') {
    if (!(player.unlockedSkillIds instanceof Set)) player.unlockedSkillIds = new Set();
    player.unlockedSkillIds.add(effect.skillId);
  }
  if (typeof updateHud === 'function') updateHud();
  if (typeof renderInventory === 'function') renderInventory();
  return true;
}
