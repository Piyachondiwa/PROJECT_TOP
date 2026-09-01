// Data-driven world events for Monster Garden.
const WORLD_EVENTS = Object.freeze([
  { id:'blood-moon', name:'Blood Moon', startHour:21, endHour:3, monsterMultiplier:1.35, seedMultiplier:1.15 },
  { id:'verdant-rain', name:'Verdant Rain', startHour:6, endHour:10, monsterMultiplier:0.9, seedMultiplier:1.25 },
  { id:'ashen-night', name:'Ashen Night', startHour:18, endHour:23, monsterMultiplier:1.2, seedMultiplier:1.1 },
]);
function getActiveWorldEvent(){
  const h = worldTime;
  return WORLD_EVENTS.find((event)=>{
    if(event.startHour < event.endHour) return h >= event.startHour && h < event.endHour;
    return h >= event.startHour || h < event.endHour;
  }) || null;
}
