const SAVE_KEY = 'monster-garden-save-v2';

function sanitizeObject(source) {
  return source && typeof source === 'object' && !Array.isArray(source) ? source : {};
}

function sanitizeSetValues(values, allowed = null) {
  if (!Array.isArray(values)) return [];
  const clean = values.filter((value) => typeof value === 'string');
  return allowed ? clean.filter((value) => allowed.has(value)) : clean;
}

function serializeGameState() {
  const plants = {};
  if (typeof plantInstances !== 'undefined' && plantInstances?.entries) {
    for (const [plotId, plant] of plantInstances.entries()) plants[plotId] = { ...plant };
  }

  return {
    version: typeof SAVE_VERSION === 'number' ? SAVE_VERSION : 2,
    savedAt: Date.now(),
    player: {
      x: player.x, y: player.y,
      hp: player.hp, maxHp: player.maxHp,
      mp: player.mp, maxMp: player.maxMp,
      xp: player.xp, xpToNext: player.xpToNext,
      level: player.level, gold: player.gold,
      seeds: { ...sanitizeObject(player.seeds) },
      foods: { ...sanitizeObject(player.foods) },
      activeTraits: { ...sanitizeObject(player.activeTraits) },
      unlockedSkillIds: [...(player.unlockedSkillIds instanceof Set ? player.unlockedSkillIds : new Set())],
      skillId: player.skillId, facing: player.facing,
      lastSafeX: player.lastSafeX, lastSafeY: player.lastSafeY,
    },
    worldTime,
    plants,
    worldProgress: typeof window.worldProgress === 'object' ? JSON.parse(JSON.stringify(window.worldProgress)) : null,
    questState: typeof window.questState === 'object' ? JSON.parse(JSON.stringify(window.questState)) : null,
    dungeonState: typeof window.dungeonState === 'object' ? JSON.parse(JSON.stringify(window.dungeonState)) : null,
    equipmentState: typeof window.equipmentState === 'object' ? JSON.parse(JSON.stringify(window.equipmentState)) : null,
    monsterCollection: typeof window.monsterCollection === 'object' ? JSON.parse(JSON.stringify(window.monsterCollection)) : null,
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

function restorePlants(savedPlants) {
  if (typeof plantInstances === 'undefined' || !plantInstances?.clear) return;
  plantInstances.clear();
  const source = sanitizeObject(savedPlants);
  const plots = typeof GARDEN_PLOTS !== 'undefined' ? GARDEN_PLOTS : [];
  for (const [plotId, plant] of Object.entries(source)) {
    const numericPlotId = Number(plotId);
    const monster = typeof MONSTER_DATA !== 'undefined' ? MONSTER_DATA[plant?.monsterId] : null;
    const validPlot = plots.some((plot) => plot.id === numericPlotId);
    const plantedAt = Number(plant?.plantedAt);
    const growthSeconds = Number(plant?.growthSeconds);
    if (!validPlot || !monster || !Number.isFinite(plantedAt) || !Number.isFinite(growthSeconds) || growthSeconds <= 0) continue;
    plantInstances.set(numericPlotId, {
      plotId: numericPlotId,
      monsterId: plant.monsterId,
      plantedAt,
      growthSeconds,
      stage: 0,
    });
  }
  if (typeof updateGarden === 'function') updateGarden();
}

function restoreOptionalProgress(save) {
  if (save.worldProgress && typeof window.worldProgress === 'object') {
    window.worldProgress.currentRegionId = typeof save.worldProgress.currentRegionId === 'string'
      ? save.worldProgress.currentRegionId : window.worldProgress.currentRegionId;
    window.worldProgress.unlockedRegions = {
      ...(window.worldProgress.unlockedRegions || {}),
      ...sanitizeObject(save.worldProgress.unlockedRegions),
    };
  }

  if (save.questState && typeof window.questState === 'object') {
    window.questState.activeId = typeof save.questState.activeId === 'string' || save.questState.activeId === null
      ? save.questState.activeId : window.questState.activeId;
    window.questState.progress = sanitizeObject(save.questState.progress);
    window.questState.completed = sanitizeObject(save.questState.completed);
  }

  if (save.dungeonState && typeof window.dungeonState === 'object') {
    window.dungeonState.unlocked = sanitizeObject(save.dungeonState.unlocked);
    window.dungeonState.currentId = typeof save.dungeonState.currentId === 'string' ? save.dungeonState.currentId : null;
    window.dungeonState.floor = Math.max(0, Math.floor(Number(save.dungeonState.floor) || 0));
  }

  if (save.equipmentState && typeof window.equipmentState === 'object') {
    window.equipmentState.equipped = {
      ...(window.equipmentState.equipped || {}),
      ...sanitizeObject(save.equipmentState.equipped),
    };
  }

  if (save.monsterCollection && typeof window.monsterCollection === 'object') {
    Object.assign(window.monsterCollection, sanitizeObject(save.monsterCollection));
  }
}

function loadGame(showFeedback = true) {
  try {
    let raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      const legacy = localStorage.getItem('monster-garden-save-v1');
      if (!legacy) {
        if (showFeedback) showMessage('No save found.');
        return false;
      }
      raw = legacy;
    }

    const parsed = JSON.parse(raw);
    const save = typeof migrateSave === 'function' ? migrateSave(parsed) : parsed;
    if (!save?.player || typeof save.player !== 'object') throw new Error('Invalid save data');

    const p = sanitizeObject(save.player);
    Object.assign(player, {
      x: getSafeNumber(p.x, 480), y: getSafeNumber(p.y, 360),
      hp: Math.max(0, getSafeNumber(p.hp, 100)), maxHp: Math.max(1, getSafeNumber(p.maxHp, 100)),
      mp: Math.max(0, getSafeNumber(p.mp, 50)), maxMp: Math.max(0, getSafeNumber(p.maxMp, 50)),
      xp: Math.max(0, getSafeNumber(p.xp, 0)), xpToNext: Math.max(1, getSafeNumber(p.xpToNext, 100)),
      level: Math.max(1, Math.floor(getSafeNumber(p.level, 1))),
      gold: Math.max(0, Math.floor(getSafeNumber(p.gold, 100))),
      seeds: sanitizeObject(p.seeds), foods: sanitizeObject(p.foods), activeTraits: sanitizeObject(p.activeTraits),
      skillId: typeof p.skillId === 'string' ? p.skillId : 'ember-burst',
      facing: ['up', 'down', 'left', 'right'].includes(p.facing) ? p.facing : 'down',
      lastSafeX: getSafeNumber(p.lastSafeX, 480), lastSafeY: getSafeNumber(p.lastSafeY, 360),
    });

    player.unlockedSkillIds = new Set(sanitizeSetValues(p.unlockedSkillIds));
    player.unlockedSkillIds.add('ember-burst');
    if (!player.unlockedSkillIds.has(player.skillId)) player.skillId = 'ember-burst';

    worldTime = ((getSafeNumber(save.worldTime, 8) % 24) + 24) % 24;
    restorePlants(save.plants);
    restoreOptionalProgress(save);
    clampPlayer();
    updateHud();
    if (typeof renderInventory === 'function') renderInventory();
    if (showFeedback) showMessage('Game loaded.');
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
    localStorage.removeItem('monster-garden-save-v1');
    showMessage('Save deleted.');
    return true;
  } catch (error) {
    console.error('Delete save failed:', error);
    showMessage('Could not delete save.');
    return false;
  }
}
