/* Player profile and progression data. */
(() => {
  const profile = window.playerProfile || {
    title: 'Wanderer',
    discoveredKingdoms: { eldoria: true },
    completedDungeons: {},
    achievements: {},
  };
  window.playerProfile = profile;

  const ACHIEVEMENTS = Object.freeze([
    { id: 'first-seed', name: 'Seed of the Wild', description: 'Obtain your first Monster Seed.', test: () => Object.values(window.player?.seeds || {}).some((n) => n > 0) },
    { id: 'first-harvest', name: 'Dark Gardener', description: 'Harvest a Monster Plant.', test: () => (window.monsterGardenCore?.state?.counters?.plantsHarvested || 0) >= 1 },
    { id: 'first-boss', name: 'Fell the Beast', description: 'Defeat a dungeon boss.', test: () => Object.keys(profile.completedDungeons).length > 0 },
  ]);

  function updateAchievements() {
    for (const achievement of ACHIEVEMENTS) {
      if (!profile.achievements[achievement.id] && achievement.test()) {
        profile.achievements[achievement.id] = { unlockedAt: Date.now(), name: achievement.name };
        if (typeof window.showMessage === 'function') window.showMessage(`Achievement: ${achievement.name}`);
      }
    }
  }

  function getAchievements() {
    return { unlocked: { ...profile.achievements }, total: ACHIEVEMENTS.length };
  }

  window.PlayerProfile = { profile, updateAchievements, getAchievements };
})();
