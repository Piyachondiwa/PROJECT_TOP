// Runtime guards for optional modules.
// Keeps the main loop from crashing when an auxiliary system is unavailable.
(() => {
  const noop = () => {};
  const state = (name) => {
    const value = window[name];
    return value && typeof value === 'object' ? value : { open: false };
  };

  if (!window.inventoryState) window.inventoryState = state('inventoryState');
  if (!window.dialogueState) window.dialogueState = state('dialogueState');
  if (!window.shopState) window.shopState = state('shopState');

  if (typeof window.advanceQuest !== 'function') window.advanceQuest = noop;
  if (typeof window.interactWithGarden !== 'function') window.interactWithGarden = noop;
  if (typeof window.interactWithNpc !== 'function') window.interactWithNpc = noop;
  if (typeof window.getNearbyNpc !== 'function') window.getNearbyNpc = () => null;
  if (typeof window.toggleInventory !== 'function') window.toggleInventory = noop;
  if (typeof window.eatSelectedFood !== 'function') window.eatSelectedFood = noop;
  if (typeof window.selectSkill !== 'function') window.selectSkill = noop;
  if (typeof window.restAtSafeZone !== 'function') window.restAtSafeZone = noop;
  if (typeof window.saveGame !== 'function') window.saveGame = noop;
  if (typeof window.loadGame !== 'function') window.loadGame = noop;
  if (typeof window.updateGarden !== 'function') window.updateGarden = noop;
  if (typeof window.drawGardenPlants !== 'function') window.drawGardenPlants = noop;
  if (typeof window.drawGardenHint !== 'function') window.drawGardenHint = noop;
  if (typeof window.drawNpcs !== 'function') window.drawNpcs = noop;
  if (typeof window.renderInventory !== 'function') window.renderInventory = noop;
  if (typeof window.applyIncomingElementDamage !== 'function') window.applyIncomingElementDamage = (amount) => amount;
  if (typeof window.getPlayerMoveSpeed !== 'function') window.getPlayerMoveSpeed = () => window.player?.speed || 0;
})();
