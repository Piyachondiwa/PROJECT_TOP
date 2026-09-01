// Advanced combat helpers: critical hits, perfect dodge, counter window, and cooldowns.
const COMBAT = Object.freeze({
  attackCooldown: 0.28,
  dodgeDuration: 0.22,
  dodgeCooldown: 0.65,
  perfectDodgeWindow: 0.14,
  counterWindow: 0.55,
  counterMultiplier: 1.8,
});

function rollCritical(baseDamage, chance = 0.08, multiplier = 1.5) {
  const critical = Math.random() < chance;
  return { damage: critical ? Math.round(baseDamage * multiplier) : baseDamage, critical };
}

function beginCounterWindow() {
  player.counterTimer = COMBAT.counterWindow;
}

function canCounter() {
  return Number(player.counterTimer) > 0;
}

function doCounterAttack(monster) {
  if (!monster?.alive || !canCounter()) return false;
  const base = getPlayerAttackPower() * COMBAT.counterMultiplier;
  const result = rollCritical(base, 0.12, 1.5);
  monster.hp = Math.max(0, monster.hp - result.damage);
  monster.hitFlash = 0.2;
  burst(monster.x, monster.y, '#e8d6a2', 14);
  player.counterTimer = 0;
  if (monster.hp <= 0) killMonster(monster);
  showMessage(`Counter! ${result.damage}${result.critical ? ' • Critical!' : ''}`);
  return true;
}
