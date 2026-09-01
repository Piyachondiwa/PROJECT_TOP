// Data-driven exploration encounters.
const WORLD_ENCOUNTERS = Object.freeze([
  { id:'herb-patch', type:'gather', name:'Wild Herb Patch', regionId:'eldoria_fields', reward:{material:'moonleaf', amount:1}, cooldown:20 },
  { id:'cursed-root', type:'gather', name:'Cursed Root', regionId:'veylthorn_forest', reward:{material:'dreadroot', amount:1}, cooldown:35 },
  { id:'ash-crystal', type:'gather', name:'Ash Crystal', regionId:'dravaryn_ash', reward:{material:'ash-crystal', amount:1}, cooldown:40 },
  { id:'grave-bloom', type:'gather', name:'Grave Bloom', regionId:'nythrheim_moor', reward:{material:'grave-bloom', amount:1}, cooldown:45 },
  { id:'frost-herb', type:'gather', name:'Frost Herb', regionId:'aureval_wastes', reward:{material:'frost-bloom', amount:1}, cooldown:50 },
]);

const encounterState = window.encounterState || {};
window.encounterState = encounterState;
function canUseEncounter(id, now=Date.now()) {
  return now >= (encounterState[id]?.nextAvailableAt || 0);
}
function useGatherEncounter(encounterId) {
  const e = WORLD_ENCOUNTERS.find(x=>x.id===encounterId);
  if (!e || !canUseEncounter(encounterId)) return false;
  player.materials = player.materials || {};
  const key=e.reward.material;
  player.materials[key]=(player.materials[key]||0)+e.reward.amount;
  encounterState[encounterId]={nextAvailableAt:Date.now()+e.cooldown*1000};
  if(typeof showMessage==='function') showMessage(`Gathered ${e.name}.`);
  return true;
}
