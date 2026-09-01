// Lightweight runtime smoke checks for Monster Garden.
// Safe to load after core modules. It reports missing required functions without
// changing gameplay state.
(() => {
  const required = [
    'showMessage', 'update', 'draw', 'attack', 'dodge',
    'saveGame', 'loadGame', 'updateHud',
  ];
  const optional = [
    'updateGarden', 'interactWithGarden', 'toggleInventory',
    'eatSelectedFood', 'interactWithNpc', 'restAtSafeZone',
  ];

  function runRuntimeSmokeCheck() {
    const missing = required.filter((name) => typeof window[name] !== 'function');
    const missingOptional = optional.filter((name) => typeof window[name] !== 'function');
    const result = {
      ok: missing.length === 0,
      missing,
      missingOptional,
      checkedAt: Date.now(),
    };

    window.MonsterGarden = window.MonsterGarden || {};
    window.MonsterGarden.runtimeSmokeCheck = result;

    if (!result.ok) {
      console.error('[Monster Garden] Runtime smoke check failed:', missing);
    }
    return result;
  }

  window.runRuntimeSmokeCheck = runRuntimeSmokeCheck;
})();
