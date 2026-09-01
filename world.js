// World systems: safe areas, sleep, and persistent game clock helpers.

const SAFE_ZONES = Object.freeze([
  { id: 'starter-camp', name: 'Starter Camp', x: 330, y: 220, w: 310, h: 250 },
]);

function isPointInRect(x, y, rect, padding = 0) {
  return x >= rect.x - padding && x <= rect.x + rect.w + padding &&
         y >= rect.y - padding && y <= rect.y + rect.h + padding;
}

function getCurrentSafeZone() {
  return SAFE_ZONES.find((zone) => isPointInRect(player.x, player.y, zone, 24)) || null;
}

function restAtSafeZone() {
  const zone = getCurrentSafeZone();
  if (!zone) {
    showMessage('Find a safe place to rest.');
    return false;
  }
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  player.lastSafeX = player.x;
  player.lastSafeY = player.y;
  worldTime = 6;
  showMessage(`Rested at ${zone.name}. Morning has come.`);
  return true;
}

function formatWorldTime(time) {
  const normalized = ((time % 24) + 24) % 24;
  const hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function isNightTime() {
  return worldTime >= 19 || worldTime < 6;
}
