// Derived player stats. Keeps growth and bonuses data-driven.
function getPlayerStats() {
  const effects = typeof getTraitEffects === 'function' ? getTraitEffects() : {};
  return {
    attack: 18 + player.level * 2 + (effects.attackPower || 0),
    moveSpeed: player.speed * (1 + (effects.moveSpeed || 0)),
    fireResistance: Math.max(0, Math.min(0.9, effects.fireResistance || 0)),
    dropRate: Math.max(0, Math.min(1, effects.dropRate || 0)),
  };
}

function getPlayerAttackPower() { return getPlayerStats().attack; }
function getPlayerMoveSpeed() { return getPlayerStats().moveSpeed; }
