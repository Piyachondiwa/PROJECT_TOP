// Status effect registry for combat and future monsters.
const STATUS_EFFECTS = Object.freeze({
  burn: { id: 'burn', name: 'Burn', duration: 3, tick: 1, damage: 4 },
  freeze: { id: 'freeze', name: 'Freeze', duration: 1.5, slow: 0.5 },
  poison: { id: 'poison', name: 'Poison', duration: 5, tick: 1, damage: 3 },
  shadow: { id: 'shadow', name: 'Shadow', duration: 4, defenseMultiplier: 0.9 },
});

function getStatusEffect(id) { return STATUS_EFFECTS[id] || null; }
function createStatus(id) {
  const effect = getStatusEffect(id);
  return effect ? { ...effect, remaining: effect.duration } : null;
}
