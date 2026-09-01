const GARDEN_PLOTS = Object.freeze([
  { id: 0, x: 690, y: 780, w: 52, h: 40 }, { id: 1, x: 760, y: 780, w: 52, h: 40 },
  { id: 2, x: 830, y: 780, w: 52, h: 40 }, { id: 3, x: 900, y: 780, w: 52, h: 40 },
  { id: 4, x: 690, y: 850, w: 52, h: 40 }, { id: 5, x: 760, y: 850, w: 52, h: 40 },
  { id: 6, x: 830, y: 850, w: 52, h: 40 }, { id: 7, x: 900, y: 850, w: 52, h: 40 },
]);

const plantInstances = new Map();
const GARDEN_INTERACT_RANGE = 70;
const DEFAULT_GROWTH_SECONDS = 22;

function getNearbyPlot() {
  let best = null;
  let bestDistance = Infinity;
  for (const plot of GARDEN_PLOTS) {
    const dx = plot.x + plot.w / 2 - player.x;
    const dy = plot.y + plot.h / 2 - player.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= GARDEN_INTERACT_RANGE && distance < bestDistance) {
      best = plot;
      bestDistance = distance;
    }
  }
  return best;
}

function getSelectedSeedId() {
  const entries = Object.entries(player.seeds).filter(([, count]) => count > 0);
  return entries.length ? entries[0][0] : null;
}

function plantSeed(plotId, monsterId) {
  const plot = GARDEN_PLOTS.find((item) => item.id === plotId);
  const monster = MONSTER_DATA[monsterId];
  if (!plot || !monster || plantInstances.has(plotId) || (player.seeds[monsterId] || 0) <= 0) return false;

  player.seeds[monsterId] -= 1;
  if (player.seeds[monsterId] <= 0) delete player.seeds[monsterId];
  plantInstances.set(plotId, {
    plotId,
    monsterId,
    plantedAt: performance.now() / 1000,
    growthSeconds: DEFAULT_GROWTH_SECONDS,
    stage: 0,
  });
  showMessage(`Planted ${monster.seedName}.`);
  return true;
}

function harvestPlant(plotId) {
  const plant = plantInstances.get(plotId);
  if (!plant) return false;
  const monster = MONSTER_DATA[plant.monsterId];
  if (!monster) return false;

  const elapsed = performance.now() / 1000 - plant.plantedAt;
  if (elapsed < plant.growthSeconds) {
    showMessage(`Still growing... ${Math.ceil(plant.growthSeconds - elapsed)}s`);
    return false;
  }

  player.foods[plant.monsterId] = (player.foods[plant.monsterId] || 0) + 1;
  plantInstances.delete(plotId);
  showMessage(`Harvested ${monster.name} Plant!`);
  return true;
}

function interactWithGarden() {
  const plot = getNearbyPlot();
  if (!plot) return false;

  if (plantInstances.has(plot.id)) return harvestPlant(plot.id);

  const seedId = getSelectedSeedId();
  if (!seedId) {
    showMessage('You need a Monster Seed.');
    return true;
  }
  return plantSeed(plot.id, seedId);
}

function updateGarden() {
  const now = performance.now() / 1000;
  for (const plant of plantInstances.values()) {
    const progress = Math.max(0, Math.min(1, (now - plant.plantedAt) / plant.growthSeconds));
    plant.stage = progress >= 1 ? 3 : progress >= 0.66 ? 2 : progress >= 0.33 ? 1 : 0;
  }
}

function drawGardenPlants() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  for (const plot of GARDEN_PLOTS) {
    const plant = plantInstances.get(plot.id);
    if (!plant) continue;
    const monster = MONSTER_DATA[plant.monsterId];
    if (!monster) continue;

    const scale = [0.35, 0.55, 0.8, 1][plant.stage];
    const cx = plot.x + plot.w / 2;
    const groundY = plot.y + plot.h - 4;
    ctx.save();
    ctx.translate(cx, groundY);
    ctx.scale(scale, scale);
    ctx.fillStyle = '#41603e';
    ctx.fillRect(-4, -15, 8, 15);
    ctx.fillStyle = monster.color;

    if (monster.id === 'goblin') {
      ctx.fillRect(-10, -38, 20, 23);
      ctx.fillRect(-14, -42, 7, 7);
      ctx.fillRect(7, -42, 7, 7);
      ctx.fillRect(-14, -12, 6, 12);
      ctx.fillRect(8, -12, 6, 12);
    } else if (monster.id === 'slime') {
      ctx.beginPath();
      ctx.arc(0, -20, 15, Math.PI, 0);
      ctx.lineTo(15, -8);
      ctx.lineTo(-15, -8);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#17191a';
      ctx.fillRect(-6, -23, 3, 3);
      ctx.fillRect(3, -23, 3, 3);
    } else if (monster.id === 'wolf') {
      ctx.beginPath();
      ctx.moveTo(-17, -11);
      ctx.lineTo(-7, -30);
      ctx.lineTo(8, -32);
      ctx.lineTo(18, -17);
      ctx.lineTo(10, -4);
      ctx.lineTo(-12, -4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
}

function getGardenHint() {
  const plot = getNearbyPlot();
  if (!plot) return null;
  if (plantInstances.has(plot.id)) return 'E: Harvest';
  if (Object.values(player.seeds).some((count) => count > 0)) return 'E: Plant Seed';
  return 'Need Monster Seed';
}
