// Runtime smoke-test manifest for Monster Garden.
// Kept data-driven so future systems can register checks without changing the core loop.

const RUNTIME_CHECKS = Object.freeze([
  { id: 'canvas', label: 'Canvas', check: () => !!document.getElementById('game') },
  { id: 'player', label: 'Player state', check: () => !!window.player },
  { id: 'monster-data', label: 'Monster data', check: () => !!window.MONSTER_DATA || typeof MONSTER_DATA !== 'undefined' },
  { id: 'garden', label: 'Garden plots', check: () => Array.isArray(window.GARDEN_PLOTS) || typeof GARDEN_PLOTS !== 'undefined' },
  { id: 'save', label: 'Save system', check: () => typeof window.saveGame === 'function' },
  { id: 'load', label: 'Load system', check: () => typeof window.loadGame === 'function' },
]);

function runRuntimeSmokeChecks() {
  return RUNTIME_CHECKS.map((item) => {
    try {
      return { id: item.id, label: item.label, ok: !!item.check() };
    } catch (error) {
      return { id: item.id, label: item.label, ok: false, error: String(error?.message || error) };
    }
  });
}

window.MonsterGarden = window.MonsterGarden || {};
window.MonsterGarden.runRuntimeSmokeChecks = runRuntimeSmokeChecks;
