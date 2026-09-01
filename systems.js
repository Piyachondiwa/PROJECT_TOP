// Player progression helpers. Kept separate so stats can grow without touching rendering.

function getTraitEffects() {
  const effects = {
    moveSpeed: 0,
    dropRate: 0,
    fireResistance: 0,
    attackPower: 0,
  };

  for (const id of Object.keys(player.activeTraits || {})) {
    const monster = MONSTER_DATA[id];
    if (!monster?.traitEffects) continue;
    for (const [key, value] of Object.entries(monster.traitEffects)) {
      if (typeof effects[key] === 'number' && Number.isFinite(value)) effects[key] += value;
    }
  }
  return effects;
}

function getPlayerMoveSpeed() {
  return player.speed * (1 + getTraitEffects().moveSpeed);
}

function applyIncomingElementDamage(amount, element) {
  const effects = getTraitEffects();
  if (element === ELEMENTS.FIRE) {
    return Math.max(1, Math.round(amount * Math.max(0, 1 - effects.fireResistance)));
  }
  return Math.max(1, Math.round(amount));
}

function getMaterialDropAmount(baseAmount = 1) {
  const chance = Math.max(0, Math.min(1, getTraitEffects().dropRate));
  let amount = Math.max(0, Math.floor(baseAmount));
  if (Math.random() < chance) amount += 1;
  return amount;
}

function getPlayerAttackPower() {
  const effects = getTraitEffects();
  return Math.max(1, 18 + player.level * 2 + effects.attackPower);
}

function hasUnlockedSkill(skillId) {
  return player.unlockedSkillIds instanceof Set && player.unlockedSkillIds.has(skillId);
}

function normalizePlayerCollections() {
  if (!player.seeds || typeof player.seeds !== 'object' || Array.isArray(player.seeds)) player.seeds = {};
  if (!player.foods || typeof player.foods !== 'object' || Array.isArray(player.foods)) player.foods = {};
  if (!player.activeTraits || typeof player.activeTraits !== 'object' || Array.isArray(player.activeTraits)) player.activeTraits = {};
  if (!(player.unlockedSkillIds instanceof Set)) player.unlockedSkillIds = new Set(['ember-burst']);
  player.unlockedSkillIds.add('ember-burst');
  if (!hasUnlockedSkill(player.skillId)) player.skillId = 'ember-burst';
}
