const SAVE_KEY = 'monster-garden-save-v1';

function serializeGameState() {
  const plants = {};
  for (const [plotId, plant] of plantInstances.entries()) {
    plants[plotId] = { ...plant };
  }

  return {
    version: 1,
    player: {
      x: player.x,
      y: player.y,
      hp: player.hp,
      maxHp: player.maxHp,
      mp: player.mp,
      maxMp: player.maxMp,
      xp: player.xp,
      xpToNext: player.xpToNext,
      level: player.level,
      gold: player.gold,
      seeds: { ...player.seeds },
      foods: { ...player.foods },
      activeTraits: { ...player.activeTraits },
      unlockedSkillIds: [...player.unlockedSkillIds],
      skillId: player.skillId,
      facing: player.facing,
      lastSafeX: player.lastSafeX,
      lastSafeY: player.lastSafeY,
    },
    worldTime,
    plants,
  };
}

function saveGame(showFeedback = true) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeGameState()));
    if (showFeedback) showMessage('Game saved.');
    return true;
  } catch (error) {
    console.error('Save failed:', error);
    if (showFeedback) showMessage('Could not save the game.');
    return false;
  }
}

function loadGame(showFeedback = true) {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      if (showFeedback) showMessage('No save found.');
      return false;
    }

    const save = JSON.parse(raw);
    if (!save || save.version !== 1 || !save.player) throw new Error('Invalid save data');

    Object.assign(player, {
      x: Number.isFinite(save.player.x) ? save.player.x : 480,
      y: Number.isFinite(save.player.y) ? save.player.y : 360,
      hp: Number.isFinite(save.player.hp) ? save.player.hp : 100,
      maxHp: Number.isFinite(save.player.maxHp) ? save.player.maxHp : 100,
      mp: Number.isFinite(save.player.mp) ? save.player.mp : 50,
      maxMp: Number.isFinite(save.player.maxMp) ? save.player.maxMp : 50,
      xp: Number.isFinite(save.player.xp) ? save.player.xp : 0,
      xpToNext: Number.isFinite(save.player.xpToNext) ? save.player.xpToNext : 100,
      level: Number.isFinite(save.player.level) ? save.player.level : 1,
      gold: Number.isFinite(save.player.gold) ? save.player.gold : 100,
      seeds: save.player.seeds && typeof save.player.seeds === 'object' ? { ...save.player.seeds } : {},
      foods: save.player.foods && typeof save.player.foods === 'object' ? { ...save.player.foods } : {},
      activeTraits: save.player.activeTraits && typeof save.player.activeTraits === 'object' ? { ...save.player.activeTraits } : {},
      skillId: typeof save.player.skillId === 'string' ? save.player.skillId : 'ember-burst',
      facing: ['up', 'down', 'left', 'right'].includes(save.player.facing) ? save.player.facing : 'down',
      lastSafeX: Number.isFinite(save.player.lastSafeX) ? save.player.lastSafeX : 480,
      lastSafeY: Number.isFinite(save.player.lastSafeY) ? save.player.lastSafeY : 360,
    });

    player.unlockedSkillIds = new Set(Array.isArray(save.player.unlockedSkillIds) ? save.player.unlockedSkillIds : ['ember-burst']);
    if (!player.unlockedSkillIds.has('ember-burst')) player.unlockedSkillIds.add('ember-burst');
    worldTime = Number.isFinite(save.worldTime) ? ((save.worldTime % 24) + 24) % 24 : 8;

    plantInstances.clear();
    if (save.plants && typeof save.plants === 'object') {
      for (const [plotId, plant] of Object.entries(save.plants)) {
        const numericPlotId = Number(plotId);
        const monster = MONSTER_DATA[plant?.monsterId];
        const validPlot = GARDEN_PLOTS.some((plot) => plot.id === numericPlotId);
        if (!validPlot || !monster) continue;
        const plantedAt = Number(plant.plantedAt);
        const growthSeconds = Number(plant.growthSeconds);
        if (!Number.isFinite(plantedAt) || !Number.isFinite(growthSeconds) || growthSeconds <= 0) continue;
        plantInstances.set(numericPlotId, {
          plotId: numericPlotId,
          monsterId: plant.monsterId,
          plantedAt,
          growthSeconds,
          stage: 0,
        });
      }
    }

    clampPlayer();
    if (showFeedback) showMessage('Game loaded.');
    updateGarden();
    updateHud();
    return true;
  } catch (error) {
    console.error('Load failed:', error);
    if (showFeedback) showMessage('Save data is corrupted.');
    return false;
  }
}

function deleteSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    showMessage('Save deleted.');
    return true;
  } catch (error) {
    console.error('Delete save failed:', error);
    showMessage('Could not delete save.');
    return false;
  }
}
