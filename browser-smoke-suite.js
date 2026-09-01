// Browser-side smoke suite for Monster Garden.
// Run after index.html has loaded: MonsterGarden.runBrowserSmokeSuite()
(() => {
  const MG = window.MonsterGarden = window.MonsterGarden || {};

  MG.runBrowserSmokeSuite = () => {
    const checks = [];
    const test = (name, fn) => {
      try {
        const value = fn();
        checks.push({ name, ok: value !== false });
      } catch (error) {
        checks.push({ name, ok: false, error: String(error?.message || error) });
      }
    };

    test('canvas', () => !!document.getElementById('game')?.getContext('2d'));
    test('monster data', () => !!window.MONSTER_DATA && Object.keys(window.MONSTER_DATA).length > 0);
    test('player', () => !!window.player && Number.isFinite(window.player.x) && Number.isFinite(window.player.y));
    test('movement functions', () => typeof window.update === 'function' && typeof window.draw === 'function');
    test('combat functions', () => typeof window.attack === 'function' && typeof window.dodge === 'function');
    test('garden', () => typeof window.interactWithGarden === 'function' && typeof window.updateGarden === 'function');
    test('save/load', () => typeof window.saveGame === 'function' && typeof window.loadGame === 'function');
    test('quest state', () => !!window.questState && typeof window.advanceQuest === 'function');
    test('npc', () => typeof window.getNearbyNpc === 'function' && typeof window.interactWithNpc === 'function');
    test('hud', () => typeof window.updateHud === 'function');

    const failed = checks.filter((c) => !c.ok);
    const result = { ok: failed.length === 0, checks, failedCount: failed.length };
    console.table(checks);
    console.info(result.ok ? 'Monster Garden browser smoke: PASS' : `Monster Garden browser smoke: FAIL (${failed.length})`);
    return result;
  };
})();
