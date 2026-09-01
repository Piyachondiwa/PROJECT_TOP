// Expanded kingdom content layer for Monster Garden.
// Data only: towns, landmarks, region flavor and recommended progression.
const KINGDOM_CONTENT = Object.freeze({
  eldoria: {
    capital: 'Dawnreach',
    regions: ['eldoria_fields'],
    landmarks: [
      { id:'dawnreach-market', name:'Dawnreach Market', type:'shop', x:500, y:290 },
      { id:'old-watchtower', name:'Old Watchtower', type:'landmark', x:900, y:420 },
    ],
  },
  veylthorn: {
    capital: 'Thornmere',
    regions: ['veylthorn_forest'],
    landmarks: [
      { id:'root-chapel', name:'Root Chapel', type:'shrine', x:620, y:460 },
      { id:'whispering-grove', name:'Whispering Grove', type:'landmark', x:960, y:520 },
    ],
  },
  dravaryn: {
    capital: 'Cinderhold',
    regions: ['dravaryn_ash'],
    landmarks: [
      { id:'black-forge', name:'Black Forge', type:'craft', x:720, y:420 },
      { id:'ash-lift', name:'Ashen Lift', type:'travel', x:1040, y:660 },
    ],
  },
  nythrheim: {
    capital: 'Noct Vale',
    regions: ['nythrheim_moor'],
    landmarks: [
      { id:'mooncrypt', name:'Mooncrypt', type:'dungeon', x:760, y:500 },
      { id:'silent-bell', name:'Silent Bell', type:'landmark', x:1120, y:380 },
    ],
  },
  aureval: {
    capital: 'Frostcrown',
    regions: ['aureval_wastes'],
    landmarks: [
      { id:'frozen-gate', name:'Frozen Gate', type:'travel', x:680, y:420 },
      { id:'white-ruins', name:'White Ruins', type:'dungeon', x:980, y:560 },
    ],
  },
});

function getKingdomContent(id){ return KINGDOM_CONTENT[id] || null; }
function getKingdomForRegion(regionId){
  const entry = Object.values(KINGDOM_CONTENT).find(k => k.regions.includes(regionId));
  return entry || null;
}
