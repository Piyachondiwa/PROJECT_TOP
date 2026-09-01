// Shared integration helpers. Keep gameplay modules loosely coupled.

function safeCall(name, ...args) {
  const fn = window[name];
  return typeof fn === 'function' ? fn(...args) : undefined;
}

function getPlayerEffectiveStats() {
  const equipment = typeof getEquipmentBonuses === 'function' ? getEquipmentBonuses() : {};
  const traits = typeof getTraitEffects === 'function' ? getTraitEffects() : {};
  return {
    attack: 18 + player.level * 2 + (equipment.attackPower || 0) + (traits.attackPower || 0),
    defense: equipment.defense || 0,
    magicPower: equipment.magicPower || 0,
    maxHp: player.maxHp + (equipment.maxHp || 0),
    maxMp: player.maxMp + (equipment.maxMp || 0),
    moveSpeed: player.speed * (1 + (traits.moveSpeed || 0)),
    fireResistance: traits.fireResistance || 0,
    dropRate: traits.dropRate || 0,
  };
}

function awardQuestProgress(eventType, targetId = null, amount = 1) {
  safeCall('advanceQuest', eventType, targetId, amount);
}

function registerMonsterDiscovery(monsterId, level = 1) {
  safeCall('recordMonsterDiscovery', monsterId, level);
}

function updateWorldProgressAfterEvent(eventType, payload = {}) {
  safeCall('handleWorldEvent', eventType, payload);
}
