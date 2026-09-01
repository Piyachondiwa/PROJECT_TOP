// Data-driven item registry for seeds, food, materials, consumables and quest rewards.
const ITEM_DATA = Object.freeze({
  moonleaf: { id:'moonleaf', name:'Moonleaf', type:'material', tags:['plant','mana'] },
  emberroot: { id:'emberroot', name:'Ember Root', type:'material', tags:['plant','fire'] },
  frostbloom: { id:'frostbloom', name:'Frost Bloom', type:'material', tags:['plant','ice'] },
  manaTonic: { id:'manaTonic', name:'Mana Tonic', type:'consumable', restoreMp:30 },
  emberSalve: { id:'emberSalve', name:'Ember Salve', type:'consumable', restoreHp:30 },
});

function addMaterial(id, amount = 1) {
  player.materials = player.materials || {};
  const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
  if (!ITEM_DATA[id] || safeAmount === 0) return false;
  player.materials[id] = (player.materials[id] || 0) + safeAmount;
  return true;
}

function getMaterialCount(id) {
  return Math.max(0, Math.floor(Number(player.materials?.[id]) || 0));
}
