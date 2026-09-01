// Runtime boss encounter definitions and lightweight state helpers.
const BOSS_RUNTIME_DATA = Object.freeze({
  cinder_wyrm:{id:'cinder_wyrm',name:'Cinder Wyrm',element:'fire',level:10,maxHp:1200,phases:[{at:.70,power:1.15},{at:.35,power:1.45}]},
  grave_lord:{id:'grave_lord',name:'Grave Lord',element:'shadow',level:18,maxHp:2200,phases:[{at:.70,power:1.2},{at:.35,power:1.55}]},
  frost_colossus:{id:'frost_colossus',name:'Frost Colossus',element:'ice',level:26,maxHp:3600,phases:[{at:.66,power:1.2},{at:.33,power:1.6}]},
});
function getBossRuntime(id){return BOSS_RUNTIME_DATA[id]||null;}
function getBossPhase(boss){
  const data=getBossRuntime(boss?.id);
  if(!data||!Number.isFinite(boss?.hp)||boss.maxHp<=0)return null;
  const ratio=boss.hp/boss.maxHp;
  let phase=0;
  for(const step of data.phases) if(ratio<=step.at) phase+=1;
  return {index:phase,power:data.phases[Math.min(phase,data.phases.length-1)]?.power||1};
}
window.MonsterGarden=window.MonsterGarden||{};
window.MonsterGarden.bosses={data:BOSS_RUNTIME_DATA,get:getBossRuntime,getPhase:getBossPhase};
