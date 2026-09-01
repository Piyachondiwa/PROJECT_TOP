// Progression UI helpers: player stats, equipment, crafting and quest summary.
// This module is intentionally DOM-only and does not own gameplay state.

function getDisplayedPlayerStats() {
  const equipment = typeof getEquipmentBonuses === 'function' ? getEquipmentBonuses() : {};
  const traits = typeof getTraitEffects === 'function' ? getTraitEffects() : {};
  return {
    attack: 18 + player.level * 2 + (equipment.attackPower || 0) + (traits.attackPower || 0),
    maxHp: player.maxHp + (equipment.maxHp || 0),
    maxMp: player.maxMp + (equipment.maxMp || 0),
    defense: equipment.defense || 0,
    magicPower: equipment.magicPower || 0,
    moveSpeed: typeof getPlayerMoveSpeed === 'function' ? getPlayerMoveSpeed() : player.speed,
    fireResistance: traits.fireResistance || 0,
    dropRate: traits.dropRate || 0,
  };
}

function renderProgressionSummary(targetId = 'inventory-content') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const stats = getDisplayedPlayerStats();
  target.insertAdjacentHTML('beforeend', `
    <div class="inventory-section">
      <h3>PLAYER STATS</h3>
      <div class="item-row"><span>Attack</span><b>${Math.round(stats.attack)}</b></div>
      <div class="item-row"><span>Max HP</span><b>${Math.round(stats.maxHp)}</b></div>
      <div class="item-row"><span>Max MP</span><b>${Math.round(stats.maxMp)}</b></div>
      <div class="item-row"><span>Defense</span><b>${Math.round(stats.defense)}</b></div>
      <div class="item-row"><span>Magic Power</span><b>${Math.round(stats.magicPower)}</b></div>
      <div class="item-row"><span>Move Speed</span><b>${Math.round(stats.moveSpeed)}</b></div>
    </div>
  `);
}
