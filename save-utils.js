// Save helpers for versioned game state.
const SAVE_VERSION = 2;

function getSafeNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function migrateSave(save) {
  if (!save || typeof save !== 'object') return null;
  if (save.version === SAVE_VERSION) return save;
  if (save.version === 1) {
    return { ...save, version: SAVE_VERSION, migratedAt: Date.now() };
  }
  return null;
}
