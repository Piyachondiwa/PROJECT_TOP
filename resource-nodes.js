// Gatherable world resources for exploration.
const RESOURCE_NODES = Object.freeze([
  { id:'herb_patch', name:'Herb Patch', type:'plant', regionId:'eldoria_fields', value:1, cooldown:25 },
  { id:'cursed_root', name:'Cursed Root', type:'material', regionId:'veylthorn_forest', value:1, cooldown:40 },
  { id:'ash_crystal', name:'Ash Crystal', type:'material', regionId:'dravaryn_ash', value:1, cooldown:45 },
  { id:'grave_bloom', name:'Grave Bloom', type:'plant', regionId:'nythrheim_moor', value:1, cooldown:50 },
  { id:'frost_herb', name:'Frost Herb', type:'plant', regionId:'aureval_wastes', value:1, cooldown:55 },
]);

const resourceState = window.resourceState || {};
window.resourceState = resourceState;

function getResourceDefinition(id){ return RESOURCE_NODES.find(r=>r.id===id)||null; }
function canGatherResource(id, now = Date.now()){
  const def=getResourceDefinition(id); if(!def) return false;
  return !resourceState[id] || now-resourceState[id] >= def.cooldown*1000;
}
function gatherResource(id, now = Date.now()){
  const def=getResourceDefinition(id); if(!def || !canGatherResource(id,now)) return false;
  resourceState[id]=now;
  window.MonsterGarden?.emit?.('resourceGathered',{id,def});
  return true;
}
