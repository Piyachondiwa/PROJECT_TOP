// Runtime UI integration helpers for Monster Garden.
// This file is intentionally defensive: every integration is optional.

function isOverlayOpen() {
  return Boolean(
    window.inventoryState?.open ||
    window.dialogueState?.open ||
    window.shopState?.open
  );
}

function closeAllOverlays() {
  if (window.inventoryState) window.inventoryState.open = false;
  if (window.dialogueState) window.dialogueState.open = false;
  if (window.shopState) window.shopState.open = false;
  if (typeof renderInventory === 'function') renderInventory();
  if (typeof renderShop === 'function') renderShop();
  if (typeof renderDialogue === 'function') renderDialogue();
}

function renderRuntimePanels() {
  if (typeof renderInventory === 'function') renderInventory();
  if (typeof renderShop === 'function') renderShop();
  if (typeof renderDialogue === 'function') renderDialogue();
  if (typeof renderQuestPanel === 'function') renderQuestPanel();
  if (typeof renderTravelPanel === 'function') renderTravelPanel();
  if (typeof renderEquipmentPanel === 'function') renderEquipmentPanel();
}

window.MonsterGardenUI = Object.freeze({
  isOverlayOpen,
  closeAllOverlays,
  renderRuntimePanels,
});
