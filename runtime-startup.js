// Startup validation for the browser prototype.
// This does not mutate gameplay state.
(() => {
  function startupCheck() {
    const checks = {
      canvas: !!document.getElementById('game'),
      hud: !!document.getElementById('hp-fill') && !!document.getElementById('mp-fill'),
      inventory: !!document.getElementById('inventory'),
      shop: !!document.getElementById('shop'),
      dialogue: !!document.getElementById('dialogue'),
      quest: !!document.getElementById('quest-panel'),
      data: typeof window.MONSTER_DATA !== 'undefined',
    };
    const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
    const result = { ok: failed.length === 0, checks, failed };
    window.MonsterGarden = window.MonsterGarden || {};
    window.MonsterGarden.startupCheck = result;
    if (!result.ok) console.error('[Monster Garden] Startup check failed:', failed);
    return result;
  }

  window.runStartupCheck = startupCheck;
})();
