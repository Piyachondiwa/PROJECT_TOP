const SAVE_KEY = 'monster-garden-save-v2';

function sanitizeObject(source) {
  return source && typeof source === 'object' && !Array.isArray(source) ? source : {};
}

function serializeGameState() {
  const plants = {};
  for (const [plotId, plant] of plantInstances.entries()) {
    plants[plotId] = { ...plant };
  }

  return {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    player: {
      x: player.x, y: player.y,
      hp: player.hp, maxHp: player.maxHp,
      mp: player.mp, maxMp: player.maxMp,
      xp: player.xp, xpToNext: player.xpToNext,
      level: player.level, gold: player.gold,
      seeds: { ...player.seeds },
      foods: { ...player.foods },
      activeTraits: { ...player.activeTraits },
      unlockedSkillIds: [...player.unlockedSkillIds],
      skillId: player.skillId, facing: player.facing,
      lastSafeX: player.lastSafeX, lastSafeY: player.lastSafeY,
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

function restorePlants(savedPlants) {
  plantInstances.clear();
  const source = sanitizeObject(savedPlants);
  for (const [plotId, plant] of Object.entries(source)) {
    const numericPlotId = Number(plotId);
    const monster = MONSTER_DATA[plant?.monsterId];
    const validPlot = GARDEN_PLOTS.some((plot) => plot.id === numericPlotId);
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
  updateGarden();
}

function loadGame(showFeedback = true) {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      // Backward compatibility with the earlier prototype save key.
      const legacy = localStorage.getItem('monster-garden-save-v1');
      if (!legacy) {
        if (showFeedback) showMessage('No save found.');
        return false;
      }
      localStorage.setItem(SAVE_KEY, legacy);
    }

    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    const save = migrateSave(parsed);
    if (!save?.player) throw new Error('Invalid save data');

    const p = sanitizeObject(save.player);
    Object.assign(player, {
      x: getSafeNumber(p.x, 480), y: getSafeNumber(p.y, 360),
      hp: getSafeNumber(p.hp, 100), maxHp: Math.max(1, getSafeNumber(p.maxHp, 100)),
      mp: getSafeNumber(p.mp, 50), maxMp: Math.max(0, getSafeNumber(p.maxMp, 50)),
      xp: Math.max(0, getSafeNumber(p.xp, 0)), xpToNext: Math.max(1, getSafeNumber(p.xpToNext, 100)),
      level: Math.max(1, Math.floor(getSafeNumber(p.level, 1))),
      gold: Math.max(0, Math.floor(getSafeNumber(p.gold, 100))),
      seeds: sanitizeObject(p.seeds), foods: sanitizeObject(p.foods), activeTraits: sanitizeObject(p.activeTraits),
      skillId: typeof p.skillId === 'string' ? p.skillId : 'ember-burst',
      facing: ['up','down','left','right'].includes(p.facing) ? p.facing : 'down',
      lastSafeX: getSafeNumber(p.lastSafeX, 480), lastSafeY: getSafeNumber(p.lastSafeY, 360),
    });

    player.unlockedSkillIds = new Set(Array.isArray(p.unlockedSkillIds) ? p.unlockedSkillIds : ['ember-burst']);
    player.unlockedSkillIds.add('ember-burst');
    if (!player.unlockedSkillIds.has(player.skillId)) player.skillId = 'ember-burst';

    worldTime = ((getSafeNumber(save.worldTime, 8) % 24) + 24) % 24;
    restorePlants(save.plants);
    clampPlayer();
    updateHud();
    renderInventory();
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
