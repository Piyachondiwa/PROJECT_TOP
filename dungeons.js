// Dungeon definitions for future exploration and bosses.
const DUNGEONS = Object.freeze([
  { id:'ashen_mine', name:'Ashen Mine', regionId:'dravaryn_ash', minLevel:8, floors:3, bossId:'cinder_wyrm' },
  { id:'black_catacombs', name:'Black Catacombs', regionId:'nythrheim_moor', minLevel:14, floors:4, bossId:'grave_lord' },
  { id:'frost_ruins', name:'Frost Ruins', regionId:'aureval_wastes', minLevel:22, floors:5, bossId:'frost_colossus' },
]);

const dungeonState = window.dungeonState || { unlocked:{}, currentId:null, floor:0 };
window.dungeonState = dungeonState;

function getDungeon(id){ return DUNGEONS.find(d=>d.id===id)||null; }
function unlockDungeon(id){ if(!getDungeon(id)) return false; dungeonState.unlocked[id]=true; return true; }
function isDungeonUnlocked(id){ return !!dungeonState.unlocked[id]; }
function enterDungeon(id){
  const dungeon=getDungeon(id);
  if(!dungeon || !isDungeonUnlocked(id) || player.level<dungeon.minLevel) return false;
  dungeonState.currentId=id; dungeonState.floor=1; showMessage(`Entered ${dungeon.name}.`); return true;
}
function leaveDungeon(){ dungeonState.currentId=null; dungeonState.floor=0; }
