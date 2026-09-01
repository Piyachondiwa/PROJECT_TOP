// Combat HUD and feedback bridge. Safe to load even before advanced combat is fully wired.
const combatUiState = window.combatUiState || {
  lastEvent: null,
  lastEventAt: 0,
};
window.combatUiState = combatUiState;

function announceCombatEvent(type, value = null) {
  combatUiState.lastEvent = { type, value };
  combatUiState.lastEventAt = Date.now();
  if (typeof showCombatFeedback === 'function') showCombatFeedback(type, value);
}

function getCombatHint() {
  if (typeof player === 'undefined') return '';
  if (typeof player.attackTimer === 'number' && player.attackTimer > 0) return 'ATTACK';
  if (typeof player.dodgeCooldown === 'number' && player.dodgeCooldown > 0) return 'DODGE COOLDOWN';
  return 'READY';
}
