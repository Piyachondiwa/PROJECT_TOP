// Combat feedback registry. Keeps punchy feedback separate from damage logic.
const COMBAT_FEEDBACK = Object.freeze({
  normalHit: { shake: 1.5, hitStop: 0.02, particles: 5 },
  heavyHit: { shake: 3, hitStop: 0.05, particles: 10 },
  critical: { shake: 5, hitStop: 0.08, particles: 14 },
  dodge: { shake: 0, hitStop: 0, particles: 4 },
  counter: { shake: 6, hitStop: 0.1, particles: 16 },
  harvest: { shake: 0, hitStop: 0.02, particles: 8 },
});

function playCombatFeedback(type, x, y) {
  const fx = COMBAT_FEEDBACK[type] || COMBAT_FEEDBACK.normalHit;
  if (typeof triggerScreenShake === 'function' && fx.shake > 0) triggerScreenShake(fx.shake);
  if (typeof triggerHitStop === 'function' && fx.hitStop > 0) triggerHitStop(fx.hitStop);
  if (typeof burst === 'function' && fx.particles > 0 && Number.isFinite(x) && Number.isFinite(y)) {
    burst(x, y, '#d9d2b5', fx.particles);
  }
}
