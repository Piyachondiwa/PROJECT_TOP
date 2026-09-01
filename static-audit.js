// Static audit helper for Monster Garden.
// Run in a browser console after loading index.html to report missing globals.
(() => {
  const required = [
    'MONSTER_DATA', 'ELEMENTS', 'GARDEN_PLOTS', 'player',
    'attack', 'dodge', 'useMonsterSkill', 'update', 'draw',
    'saveGame', 'loadGame', 'updateHud'
  ];

  window.MonsterGarden = window.MonsterGarden || {};
  window.MonsterGarden.runStaticAudit = () => {
    const missing = required.filter((name) => typeof window[name] === 'undefined');
    const result = { ok: missing.length === 0, missing };
    console.table(result.missing);
    console.info(result.ok ? 'Monster Garden audit: OK' : `Monster Garden audit: missing ${missing.length} globals`);
    return result;
  };
})();
