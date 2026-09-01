// Discovery layer for Monster Seeds and the Monster Codex.
const seedDiscoveryState = window.seedDiscoveryState || { discovered:{}, kills:{} };
window.seedDiscoveryState = seedDiscoveryState;

function discoverMonster(monsterId){
  if(!monsterId) return;
  seedDiscoveryState.discovered[monsterId]=true;
  seedDiscoveryState.kills[monsterId]=(seedDiscoveryState.kills[monsterId]||0)+1;
  window.MonsterGarden?.emit?.('monsterDiscovered',{monsterId});
}
function isMonsterDiscovered(monsterId){ return !!seedDiscoveryState.discovered[monsterId]; }
function getMonsterDiscoveryCount(){ return Object.keys(seedDiscoveryState.discovered).length; }
