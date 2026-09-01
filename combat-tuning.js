// Central combat tuning values. Keep balance numbers out of game.js.
const COMBAT_TUNING = Object.freeze({
  basicAttack: { cooldown: 0.28, range: 68, arcCos: 0.15 },
  dodge: { duration: 0.22, cooldown: 0.65, distance: 78 },
  enemyHit: { cooldown: 0.65, range: 42 },
  perfectDodgeWindow: 0.12,
  counterWindow: 0.28,
  counterMultiplier: 1.75,
});

window.MonsterGarden = window.MonsterGarden || {};
window.MonsterGarden.combatTuning = COMBAT_TUNING;
