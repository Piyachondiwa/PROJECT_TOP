// Runtime audit helper for Monster Garden.
// Run in the browser console after index.html finishes loading.
(() => {
  window.MonsterGarden = window.MonsterGarden || {};
  window.MonsterGarden.runStaticAudit = () => {
    const checks = {
      canvas: typeof document !== 'undefined' && !!document.getElementById('game'),
      monsterData: typeof MONSTER_DATA !== 'undefined',
      elements: typeof ELEMENTS !== 'undefined',
      gardenPlots: typeof GARDEN_PLOTS !== 'undefined',
      player: typeof player !== 'undefined',
      attack: typeof attack === 'function',
      dodge: typeof dodge === 'function',
      skill: typeof useMonsterSkill === 'function',
      update: typeof update === 'function',
      draw: typeof draw === 'function',
      saveGame: typeof saveGame === 'function',
      loadGame: typeof loadGame === 'function',
      updateHud: typeof updateHud === 'function',
    };

    const missing = Object.entries(checks).filter(([, ok]) => !ok).map(([name]) => name);
    const result = { ok: missing.length === 0, missing, checks };
    console.table(checks);
    console.info(result.ok ? 'Monster Garden audit: OK' : `Monster Garden audit: missing ${missing.length} checks`);
    return result;
  };
})();
