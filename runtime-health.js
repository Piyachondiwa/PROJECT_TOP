// Lightweight runtime diagnostics for development builds.
(() => {
  const MG = window.MonsterGarden || {};
  MG.health = MG.health || {};

  MG.health.check = () => {
    const requiredGlobals = ['MONSTER_DATA', 'GARDEN_PLOTS', 'player'];
    const missing = requiredGlobals.filter((name) => typeof window[name] === 'undefined');
    const report = {
      ok: missing.length === 0,
      missing,
      hasCanvas: !!document.getElementById('game'),
      hasHud: !!document.getElementById('hud'),
      timestamp: Date.now(),
    };
    if (!report.ok) console.warn('MonsterGarden health check:', report);
    return report;
  };

  window.MonsterGarden = MG;
  window.addEventListener('load', () => MG.health.check());
})();
