// Data-driven NPC foundation for the first town.
const TOWN_NPC_DATA = Object.freeze({
  mira: { id:'mira', name:'Mira', role:'Seed Merchant', x:500, y:310, color:'#c78f6e', dialogue:['The forest changes every night.','Bring me strange seeds and I will find a use for them.'], shopId:'starter-seeds' },
  elian: { id:'elian', name:'Elian', role:'Adventurer', x:570, y:320, color:'#8094ad', dialogue:['Monsters do not always leave corpses behind.','Sometimes they leave seeds. That is why the old gardeners fear them.'] },
  nera: { id:'nera', name:'Nera', role:'Quest Keeper', x:430, y:320, color:'#8f7ba5', dialogue:['The road east has become dangerous.','If you can survive the fields, there may be work waiting beyond them.'], questBoard:true },
});

const TOWN_DATA = Object.freeze({
  'eldoria-town': { id:'eldoria-town', name:'Dawnreach', kingdomId:'eldoria', safe:true, bounds:{x:330,y:220,w:310,h:250}, npcs:['mira','elian','nera'] },
});
window.TOWN_NPC_DATA = TOWN_NPC_DATA;
window.TOWN_DATA = TOWN_DATA;
const npcState = window.npcState || { dialogueNpcId:null };
window.npcState = npcState;

function getTownData(id='eldoria-town'){ return TOWN_DATA[id] || null; }
function getNpcsForTown(id='eldoria-town'){ const town=getTownData(id); return town ? town.npcs.map((id)=>TOWN_NPC_DATA[id]).filter(Boolean) : []; }
function getNearbyNpc(){
  if (typeof player === 'undefined') return null;
  let best=null,bestDistance=Infinity;
  for(const npc of Object.values(TOWN_NPC_DATA)){
    const distance=Math.hypot(player.x-npc.x,player.y-npc.y);
    if(distance<70 && distance<bestDistance){ best=npc; bestDistance=distance; }
  }
  return best;
}
function interactWithNpc(){
  const npc=getNearbyNpc();
  if(!npc) return false;
  if(npc.shopId && typeof openShop==='function') { openShop(); return true; }
  if(typeof openDialogue==='function') { openDialogue(npc.id); return true; }
  return false;
}
function drawNpcs(ctxRef,cameraRef){
  if(!ctxRef||!cameraRef) return;
  ctxRef.save();
  for(const npc of Object.values(TOWN_NPC_DATA)){
    const sx=Math.round(npc.x-cameraRef.x), sy=Math.round(npc.y-cameraRef.y);
    ctxRef.fillStyle='#241e1d'; ctxRef.fillRect(sx-8,sy+8,16,20);
    ctxRef.fillStyle=npc.color||'#c18b68'; ctxRef.fillRect(sx-7,sy-10,14,14);
    ctxRef.fillStyle='#3c2f2b'; ctxRef.fillRect(sx-8,sy-12,16,5);
    ctxRef.fillStyle='#dfd5b8'; ctxRef.font='10px monospace'; ctxRef.textAlign='center'; ctxRef.fillText(npc.name,sx,sy-18);
  }
  ctxRef.restore();
}
