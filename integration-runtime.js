// Runtime integration coordinator.
// Safe, optional calls into the modular systems already present in Monster Garden.
(() => {
  const MG = window.MonsterGarden || {};
  MG.runtime = MG.runtime || {};

  MG.runtime.refreshAll = () => {
    const calls = [
      ['renderInventory'],
      ['renderShop'],
      ['renderQuestPanel'],
      ['renderEquipmentScreen'],
      ['renderCraftingScreen'],
      ['renderTravelUI'],
      ['renderMonsterCodex'],
    ];
    for (const [name] of calls) {
      try {
        if (typeof window[name] === 'function') window[name]();
      } catch (error) {
        console.warn(`MonsterGarden: ${name} refresh failed`, error);
      }
    }
  };

  MG.runtime.isBlocked = () => {
    if (typeof MG.anyOverlayOpen === 'function') return MG.anyOverlayOpen();
    return false;
  };

  MG.runtime.onMonsterDefeated = (monster) => {
    try {
      if (typeof window.recordMonsterDiscovery === 'function') window.recordMonsterDiscovery(monster?.id);
      if (typeof window.advanceQuest === 'function') window.advanceQuest('kill', monster?.id, 1);
      if (typeof window.updatePlayerProfile === 'function') window.updatePlayerProfile();
    } catch (error) {
      console.warn('MonsterGarden: defeat integration failed', error);
    }
  };

  MG.runtime.onPlantHarvested = (plant) => {
    try {
      if (typeof window.advanceQuest === 'function') window.advanceQuest('harvest', plant?.monsterId || null, 1);
      if (typeof window.updatePlayerProfile === 'function') window.updatePlayerProfile();
    } catch (error) {
      console.warn('MonsterGarden: harvest integration failed', error);
    }
  };

  window.MonsterGarden = MG;
})();
