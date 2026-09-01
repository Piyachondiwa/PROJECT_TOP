// NPC service registry. Keeps town services data-driven.
const NPC_SERVICES = Object.freeze({
  seed_merchant: { id:'seed_merchant', name:'Seed Merchant', action:'shop', shopId:'default-seeds' },
  healer: { id:'healer', name:'Healer', action:'heal', cost:20 },
  quest_keeper: { id:'quest_keeper', name:'Quest Keeper', action:'quest' },
  blacksmith: { id:'blacksmith', name:'Blacksmith', action:'equipment' },
  gardener: { id:'gardener', name:'Garden Keeper', action:'garden' },
});

function getNpcService(id){ return NPC_SERVICES[id] || null; }
function useNpcService(id){
  const service=getNpcService(id);
  if(!service) return false;
  if(service.action==='heal'){
    if(player.gold<service.cost){ showMessage('Not enough Gold.'); return false; }
    player.gold-=service.cost; player.hp=player.maxHp; player.mp=player.maxMp;
    showMessage('Fully restored.');
    if(typeof updateHud==='function') updateHud();
    return true;
  }
  if(service.action==='shop' && typeof openShop==='function'){ openShop(); return true; }
  if(service.action==='quest' && typeof renderQuestPanel==='function'){ renderQuestPanel(); return true; }
  if(service.action==='equipment' && typeof renderEquipmentUI==='function'){ renderEquipmentUI(); return true; }
  if(service.action==='garden' && typeof showGardenOverview==='function'){ showGardenOverview(); return true; }
  return false;
}
