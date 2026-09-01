// World progression controller. Keeps region/dungeon unlock rules separate from rendering.

const REGION_ORDER = Object.freeze([
  'eldoria_fields',
  'veylthorn_forest',
  'dravaryn_ash',
  'nythrheim_moor',
  'aureval_wastes',
]);

function getNextRegionId(currentId = worldProgress.currentRegionId) {
  const index = REGION_ORDER.indexOf(currentId);
  return index >= 0 && index < REGION_ORDER.length - 1 ? REGION_ORDER[index + 1] : null;
}

function canUnlockNextRegion() {
  const nextId = getNextRegionId();
  if (!nextId) return false;
  const region = REGION_DEFINITIONS[nextId];
  return player.level >= region.levelMin;
}

function unlockNextRegion() {
  const nextId = getNextRegionId();
  if (!nextId || !canUnlockNextRegion()) return false;
  unlockRegion(nextId);
  showMessage(`New region unlocked: ${REGION_DEFINITIONS[nextId].name}`);
  return true;
}

function getUnlockedRegionList() {
  return REGION_ORDER.filter((id) => isRegionUnlocked(id)).map((id) => REGION_DEFINITIONS[id]);
}
