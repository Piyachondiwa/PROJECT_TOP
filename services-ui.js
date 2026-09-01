// Shared service actions for NPC facilities.
// Gameplay modules can call these helpers without owning UI state.

const SERVICE_IDS = Object.freeze({
  SEED_SHOP: 'seed-shop',
  HEALER: 'healer',
  QUEST_BOARD: 'quest-board',
  BLACKSMITH: 'blacksmith',
  GARDENER: 'gardener',
});

function canUseService(serviceId) {
  return Object.values(SERVICE_IDS).includes(serviceId);
}

function useNpcService(serviceId) {
  if (!canUseService(serviceId)) return false;
  switch (serviceId) {
    case SERVICE_IDS.SEED_SHOP:
      if (typeof openShop === 'function') openShop();
      return true;
    case SERVICE_IDS.HEALER:
      if (typeof getCurrentSafeZone === 'function' && getCurrentSafeZone()) {
        player.hp = player.maxHp;
        player.mp = player.maxMp;
        if (typeof updateHud === 'function') updateHud();
        if (typeof showMessage === 'function') showMessage('Fully restored.');
        return true;
      }
      return false;
    case SERVICE_IDS.QUEST_BOARD:
      if (typeof renderQuestPanel === 'function') {
        renderQuestPanel();
        return true;
      }
      return false;
    case SERVICE_IDS.BLACKSMITH:
      if (typeof renderEquipmentPanel === 'function') {
        renderEquipmentPanel();
        return true;
      }
      return false;
    case SERVICE_IDS.GARDENER:
      if (typeof renderGardenPanel === 'function') {
        renderGardenPanel();
        return true;
      }
      return false;
    default:
      return false;
  }
}
