// Shared UI panel helpers. Safe no-op when a panel is not present.
const PANEL_IDS = Object.freeze(['inventory','shop','dialogue','quest-panel']);

function setPanelVisible(id, visible) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.classList.toggle('hidden', !visible);
  return true;
}

function closeAllPanels() {
  PANEL_IDS.forEach((id) => setPanelVisible(id, false));
  if (typeof inventoryState === 'object' && inventoryState) inventoryState.open = false;
  if (typeof shopState === 'object' && shopState) shopState.open = false;
  if (typeof dialogueState === 'object' && dialogueState) dialogueState.open = false;
  return true;
}

function hasBlockingPanelOpen() {
  return PANEL_IDS.some((id) => {
    const el = document.getElementById(id);
    return el && !el.classList.contains('hidden');
  });
}
