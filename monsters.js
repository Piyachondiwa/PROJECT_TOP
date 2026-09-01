const MONSTER_SPAWN_TABLE = Object.freeze([
  { id:'goblin', regionId:'eldoria_fields', minLevel:1, maxLevel:4, weight:50 },
  { id:'wolf', regionId:'eldoria_fields', minLevel:2, maxLevel:6, weight:30 },
  { id:'slime', regionId:'eldoria_fields', minLevel:2, maxLevel:5, weight:20 },
  { id:'bat', regionId:'veylthorn_forest', minLevel:5, maxLevel:10, weight:40 },
  { id:'rotcap', regionId:'veylthorn_forest', minLevel:6, maxLevel:11, weight:25 },
]);

function getMonsterSpawnEntries(regionId){
  return MONSTER_SPAWN_TABLE.filter((entry)=>entry.regionId===regionId && MONSTER_DATA[entry.id]);
}

function pickMonsterId(regionId){
  const entries=getMonsterSpawnEntries(regionId);
  if(!entries.length) return null;
  const total=entries.reduce((sum,e)=>sum+Math.max(0,e.weight||0),0);
  if(total<=0) return entries[0].id;
  let roll=Math.random()*total;
  for(const entry of entries){
    roll-=Math.max(0,entry.weight||0);
    if(roll<=0) return entry.id;
  }
  return entries[entries.length-1].id;
}

function createMonsterForRegion(regionId,x,y){
  const id=pickMonsterId(regionId);
  if(!id) return null;
  const data=MONSTER_DATA[id];
  const entry=MONSTER_SPAWN_TABLE.find((item)=>item.regionId===regionId&&item.id===id);
  const min=entry?.minLevel||data.level||1;
  const max=Math.max(min,entry?.maxLevel||min);
  const level=min+Math.floor(Math.random()*(max-min+1));
  return {
    ...data,
    level,
    x,y,spawnX:x,spawnY:y,
    maxHp:data.baseHp+level*4,
    hp:data.baseHp+level*4,
    alive:true,
    hitFlash:0,
    attackCooldown:0,
    regionId,
  };
}
