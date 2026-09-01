// World progression save schema helpers.
// Keeps long-term progression isolated from renderer/combat code.
(() => {
  const MG = window.MonsterGarden || {};
  const WORLD_SAVE_VERSION = 1;

  function normalizeState(source = {}) {
    const value = source && typeof source === 'object' && !Array.isArray(source) ? source : {};
    return {
      version: WORLD_SAVE_VERSION,
      regionId: typeof value.regionId === 'string' ? value.regionId : 'eldoria_fields',
      unlockedRegions: value.unlockedRegions && typeof value.unlockedRegions === 'object' ? { ...value.unlockedRegions } : { eldoria_fields: true },
      completedQuests: value.completedQuests && typeof value.completedQuests === 'object' ? { ...value.completedQuests } : {},
      unlockedDungeons: value.unlockedDungeons && typeof value.unlockedDungeons === 'object' ? { ...value.unlockedDungeons } : {},
      discoveredMonsters: value.discoveredMonsters && typeof value.discoveredMonsters === 'object' ? { ...value.discoveredMonsters } : {},
    };
  }

  function collect() {
    const progress = window.worldProgress || {};
    const quests = window.questState || {};
    const dungeons = window.dungeonState || {};
    const collection = window.monsterCollection || {};
    return normalizeState({
      regionId: progress.currentRegionId,
      unlockedRegions: progress.unlockedRegions,
      completedQuests: quests.completed,
      unlockedDungeons: dungeons.unlocked,
      discoveredMonsters: collection.discovered,
    });
  }

  MG.worldSave = { VERSION: WORLD_SAVE_VERSION, normalizeState, collect };
  window.MonsterGarden = MG;
})();
