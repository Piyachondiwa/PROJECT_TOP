// Audio registry placeholder. Keeps game logic independent from actual audio assets.
const AUDIO_REGISTRY = Object.freeze({
  attack: null,
  dodge: null,
  hit: null,
  monsterDeath: null,
  plant: null,
  harvest: null,
  uiOpen: null,
  uiSelect: null,
  questComplete: null,
});
function playSfx(id){
  const source = AUDIO_REGISTRY[id];
  if(!source) return false;
  const audio = new Audio(source);
  audio.volume = 0.6;
  audio.play().catch(()=>{});
  return true;
}
