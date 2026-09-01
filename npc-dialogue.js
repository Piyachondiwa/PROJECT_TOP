// Data-driven NPC dialogue and interaction hooks.
const NPC_DATA = Object.freeze({
  mira: { id:'mira', name:'Mira', role:'Seed Merchant', x:500, y:265,
    lines:['The wild gives us seeds. The right seed can change everything.','Bring me gold and I will show you what can grow.'] },
  elian: { id:'elian', name:'Elian', role:'Adventurer', x:555, y:265,
    lines:['Night creatures are stranger than the ones you see by day.','Dodge late. Counter fast. Stay alive.'] },
  nera: { id:'nera', name:'Nera', role:'Quest Keeper', x:610, y:265,
    lines:['Every monster leaves something behind.','The garden is not a farm. It is a record of what you have conquered.'] },
});

const dialogueState = window.dialogueState || { open:false, npcId:null, lineIndex:0 };
window.dialogueState = dialogueState;

function openDialogue(npcId){
  const npc=NPC_DATA[npcId];
  if(!npc) return false;
  dialogueState.open=true;
  dialogueState.npcId=npcId;
  dialogueState.lineIndex=0;
  showMessage(`${npc.name}: ${npc.lines[0]}`);
  return true;
}
function nextDialogue(){
  const npc=NPC_DATA[dialogueState.npcId];
  if(!dialogueState.open||!npc) return false;
  dialogueState.lineIndex += 1;
  if(dialogueState.lineIndex >= npc.lines.length){ dialogueState.open=false; dialogueState.npcId=null; return false; }
  showMessage(`${npc.name}: ${npc.lines[dialogueState.lineIndex]}`);
  return true;
}
function closeDialogue(){ dialogueState.open=false; dialogueState.npcId=null; dialogueState.lineIndex=0; }
function getNearbyNpc(){
  let best=null, bestDistance=Infinity;
  for(const npc of Object.values(NPC_DATA)){
    const d=Math.hypot(player.x-npc.x,player.y-npc.y);
    if(d<70&&d<bestDistance){best=npc;bestDistance=d;}
  }
  return best;
}
