const KINGDOMS = Object.freeze([
  { id:'eldoria', name:'Eldoria', subtitle:'Kingdom of Dawn', element:'light', color:'#8f8060' },
  { id:'veylthorn', name:'Veylthorn', subtitle:'Cursed Verdant Realm', element:'nature', color:'#405945' },
  { id:'dravaryn', name:'Dravaryn', subtitle:'Kingdom of Ash', element:'fire', color:'#704236' },
  { id:'nythrheim', name:'Nythrheim', subtitle:'Kingdom of Night', element:'shadow', color:'#34334c' },
  { id:'aureval', name:'Aureval', subtitle:'Frozen Crown', element:'ice', color:'#596f78' },
]);

const REGION_DEFINITIONS = Object.freeze({
  eldoria_fields:{ id:'eldoria_fields', kingdomId:'eldoria', name:'Dawn Fields', levelMin:1, levelMax:6 },
  veylthorn_forest:{ id:'veylthorn_forest', kingdomId:'veylthorn', name:'Whispering Forest', levelMin:4, levelMax:10 },
  dravaryn_ash:{ id:'dravaryn_ash', kingdomId:'dravaryn', name:'Ashen Valley', levelMin:8, levelMax:16 },
  nythrheim_moor:{ id:'nythrheim_moor', kingdomId:'nythrheim', name:'Black Moor', levelMin:14, levelMax:24 },
  aureval_wastes:{ id:'aureval_wastes', kingdomId:'aureval', name:'Frost Wastes', levelMin:22, levelMax:32 },
});

const worldProgress = window.worldProgress || {
  currentRegionId:'eldoria_fields', unlockedRegions:{ eldoria_fields:true },
};
window.worldProgress = worldProgress;

function getCurrentRegion(){ return REGION_DEFINITIONS[worldProgress.currentRegionId] || REGION_DEFINITIONS.eldoria_fields; }
function isRegionUnlocked(id){ return !!worldProgress.unlockedRegions[id]; }
function unlockRegion(id){
  if(!REGION_DEFINITIONS[id]) return false;
  worldProgress.unlockedRegions[id]=true;
  return true;
}
function travelToRegion(id){
  const region=REGION_DEFINITIONS[id];
  if(!region || !isRegionUnlocked(id)) return false;
  worldProgress.currentRegionId=id;
  showMessage(`Travelled to ${region.name}.`);
  return true;
}
