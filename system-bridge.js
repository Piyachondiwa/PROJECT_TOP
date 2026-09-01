// Shared runtime bridge. Keeps optional modules from crashing the main loop.
(function(){
  const safe = (name, fn) => {
    if (typeof window[name] !== 'function') window[name] = fn;
  };

  safe('getNearbyNpc', () => null);
  safe('interactWithNpc', () => false);
  safe('drawNpcs', () => {});
  safe('advanceQuest', () => false);
  safe('renderShop', () => {});
  safe('renderQuestPanel', () => {});
  safe('renderInventory', () => {});
  safe('getTotalFoodCount', () => 0);
  safe('updateGarden', () => {});
  safe('drawGardenPlants', () => {});
  safe('drawGardenHint', () => {});
  safe('getPlayerMoveSpeed', () => player.speed);
  safe('getTraitEffects', () => ({ moveSpeed:0, dropRate:0, fireResistance:0, attackPower:0 }));
  safe('getMaterialDropAmount', (base=1) => Math.max(1, Math.floor(base)));
  safe('applyIncomingElementDamage', (amount) => Math.max(1, Math.round(amount)));
  safe('toggleInventory', () => false);
  safe('eatSelectedFood', () => false);
  safe('selectSkill', () => false);
  safe('restAtSafeZone', () => false);
  safe('saveGame', () => false);
  safe('loadGame', () => false);
  safe('formatWorldTime', (t) => {
    const n = ((t % 24) + 24) % 24;
    const h = Math.floor(n);
    const m = Math.floor((n-h)*60);
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  });
  safe('isNightTime', (t) => t >= 19 || t < 6);
})();
