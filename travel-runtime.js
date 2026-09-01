// Runtime travel helpers for region gates. Keeps travel rules independent from rendering.
function getTravelGate(id){
  if(typeof TRAVEL_GATES==='undefined') return null;
  return TRAVEL_GATES.find((gate)=>gate.id===id)||null;
}
function canUseTravelGate(id){
  const gate=getTravelGate(id);
  if(!gate) return false;
  if(typeof isRegionUnlocked==='function' && !isRegionUnlocked(gate.toRegionId)) return false;
  return player.level >= (gate.minLevel||1);
}
function useTravelGate(id){
  const gate=getTravelGate(id);
  if(!gate || !canUseTravelGate(id)){
    if(typeof showMessage==='function')showMessage('The path is not available yet.');
    return false;
  }
  if(typeof travelToRegion==='function' && !travelToRegion(gate.toRegionId)) return false;
  if(typeof showMessage==='function')showMessage(`Travelled through ${gate.name}.`);
  return true;
}
window.MonsterGarden=window.MonsterGarden||{};
window.MonsterGarden.travel={getGate:getTravelGate,canUse:canUseTravelGate,use:useTravelGate};
