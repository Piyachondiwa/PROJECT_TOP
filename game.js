const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const WORLD = { width: 2400, height: 1600 };
const keys = new Set();
const elementColors = Object.freeze({
  fire: '#d85c45', water: '#4e8fd5', lightning: '#e2c85b', earth: '#a17a4f',
  nature: '#65a85d', ice: '#82c7d9', shadow: '#765b9b', light: '#f0d987', arcane: '#a27bd1'
});

const player = {
  x: 480, y: 360, w: 34, h: 46, speed: 170,
  hp: 100, maxHp: 100, mp: 50, maxMp: 50, xp: 0, xpToNext: 100, level: 1, gold: 100,
  seeds: {}, foods: {}, activeTraits: {}, unlockedSkillIds: new Set(['ember-burst']),
  facing: 'down', attackTimer: 0, dodgeTimer: 0, dodgeCooldown: 0, skillCooldown: 0, skillId: 'ember-burst',
  lastSafeX: 480, lastSafeY: 360,
};
window.player = player;

function createMonster(data, x, y) {
  return { ...data, x, y, spawnX:x, spawnY:y, maxHp:data.baseHp + data.level * 4, hp:data.baseHp + data.level * 4, alive:true, hitFlash:0, attackCooldown:0 };
}
const monsterSpawns = [[700,380],[830,520],[560,610]];
const monsters = Object.values(MONSTER_DATA).map((data,index)=>createMonster(data, ...monsterSpawns[index % monsterSpawns.length]));
const particles = [];
let camera = { x: 0, y: 0 };
let worldTime = 8.0;
let lastTime = performance.now();
let messageTimer = 0;

function isOverlayOpen() {
  return ['inventoryState','dialogueState','shopState','questState','travelState'].some((name) => window[name]?.open);
}
window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  keys.add(e.code); if (e.repeat) return;
  if (e.code === 'KeyJ' || e.code === 'KeyZ') attack();
  else if (e.code === 'Space') dodge();
  else if (e.code === 'KeyK' || e.code === 'KeyX') useMonsterSkill();
  else if (e.code === 'KeyE') {
    if (typeof getNearbyNpc === 'function' && getNearbyNpc()) interactWithNpc();
    else if (typeof interactWithGarden === 'function') interactWithGarden();
  } else if (e.code === 'KeyI' && typeof toggleInventory === 'function') toggleInventory();
  else if (e.code === 'KeyQ' && typeof eatSelectedFood === 'function') eatSelectedFood();
  else if (e.code === 'Digit1') selectSkill(0);
  else if (e.code === 'Digit2') selectSkill(1);
  else if (e.code === 'Digit3') selectSkill(2);
  else if (e.code === 'KeyR' && typeof restAtSafeZone === 'function') restAtSafeZone();
  else if (e.code === 'F5') { e.preventDefault(); if (typeof saveGame === 'function') saveGame(true); }
  else if (e.code === 'F9') { e.preventDefault(); if (typeof loadGame === 'function') loadGame(true); }
  else if (e.code === 'Escape' && typeof closeAllOverlays === 'function') closeAllOverlays();
  else if (e.code === 'Enter' && window.dialogueState?.open) {
    if (typeof nextDialogue === 'function') nextDialogue();
    else if (typeof advanceDialogue === 'function') advanceDialogue();
  }
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());
function showMessage(text) { const el=document.getElementById('message'); if(!el)return; el.textContent=text; el.classList.add('show'); messageTimer=2; }
function getFacingVector() { return {up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}[player.facing] || {x:0,y:1}; }
function isInAttackArc(monster, range, arcCos=0.15) { const dx=monster.x-player.x,dy=monster.y-player.y,dist=Math.hypot(dx,dy); if(dist>range||dist===0)return false; const f=getFacingVector(); return ((dx/dist)*f.x+(dy/dist)*f.y)>=arcCos; }
function getAvailableSkills() { const unlocked=player.unlockedSkillIds instanceof Set?player.unlockedSkillIds:new Set(['ember-burst']); return Object.values(MONSTER_DATA).filter(m=>m.skill&&unlocked.has(m.skill.id)).map(m=>m.skill); }
function selectSkill(index) { const skills=getAvailableSkills(); if(!skills[index])return; player.skillId=skills[index].id; showMessage(`Skill: ${skills[index].name}`); if(typeof renderInventory==='function')renderInventory(); }
function getPlayerAttackPower() { const effects=typeof getTraitEffects==='function'?getTraitEffects():{}; return 18+player.level*2+(effects.attackPower||0); }
function getBasicAttackElement() { const bonus=typeof getEquipmentBonuses==='function'?getEquipmentBonuses():{}; return bonus.element||ELEMENTS.ARCANE; }
function attack() { if(player.attackTimer>0||player.dodgeTimer>0||isOverlayOpen())return; player.attackTimer=.28; let hit=false; for(const m of monsters){if(!m.alive||!isInAttackArc(m,68))continue; const mult=getElementMultiplier(getBasicAttackElement(),m.element),dmg=Math.max(1,Math.round(getPlayerAttackPower()*mult));m.hp=Math.max(0,m.hp-dmg);m.hitFlash=.12;burst(m.x,m.y,'#ded6b7',7);hit=true;if(m.hp<=0)killMonster(m);}if(hit)showMessage('Attack hit!'); }
function useMonsterSkill() { if(player.skillCooldown>0||player.dodgeTimer>0||isOverlayOpen())return;const skills=getAvailableSkills(),skill=skills.find(s=>s.id===player.skillId)||skills[0];if(!skill)return;if(player.mp<skill.cost){showMessage('Not enough MP.');return;}player.mp-=skill.cost;player.skillCooldown=1.1;const range=skill.id==='predator-dash'?96:82,f=getFacingVector();if(skill.id==='predator-dash'){player.x+=f.x*70;player.y+=f.y*70;clampPlayer();}let hit=false;const element=skill.element||ELEMENTS.ARCANE;for(const m of monsters){if(!m.alive||!isInAttackArc(m,range,0))continue;const mult=getElementMultiplier(element,m.element),dmg=Math.max(1,Math.round(skill.power*mult));m.hp=Math.max(0,m.hp-dmg);m.hitFlash=.18;burst(m.x,m.y,elementColors[element]||'#ddd',10);hit=true;if(m.hp<=0)killMonster(m);}showMessage(`${skill.name}${hit?' • Hit!':''}`); }
function addSeed(monster){player.seeds[monster.id]=(player.seeds[monster.id]||0)+1;}
function killMonster(monster){if(!monster.alive)return;monster.alive=false;const drops=typeof getMaterialDropAmount==='function'?getMaterialDropAmount(1):1;player.gold+=(15+monster.level*5)*drops;for(let i=0;i<drops;i++)addSeed(monster);player.xp+=25+monster.level*10;player.mp=Math.min(player.maxMp,player.mp+5);burst(monster.x,monster.y,elementColors[monster.element]||'#aaa',18);if(typeof advanceQuest==='function')advanceQuest('kill',monster.id,1);if(typeof recordMonsterDefeat==='function')recordMonsterDefeat(monster.id,monster.level);checkLevelUp();showMessage(`${monster.name} fell → ${monster.seedName} ×${drops} • +XP`);setTimeout(()=>respawnMonster(monster),4500);}
function checkLevelUp(){let leveled=false;while(player.xp>=player.xpToNext){player.xp-=player.xpToNext;player.level++;player.xpToNext=Math.floor(player.xpToNext*1.35);player.maxHp+=12;player.maxMp+=6;player.hp=player.maxHp;player.mp=player.maxMp;leveled=true;}if(leveled)showMessage(`Level Up! You are now Lv.${player.level}`);}
function respawnMonster(monster){monster.hp=monster.maxHp;monster.alive=true;monster.x=monster.spawnX;monster.y=monster.spawnY;monster.hitFlash=0;monster.attackCooldown=0;}
function dodge(){if(player.dodgeCooldown>0||player.dodgeTimer>0||isOverlayOpen())return;player.dodgeTimer=.22;player.dodgeCooldown=.65;let dx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),dy=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);if(dx===0&&dy===0){const f=getFacingVector();dx=f.x;dy=f.y;}const len=Math.hypot(dx,dy)||1;player.x+=(dx/len)*78;player.y+=(dy/len)*78;clampPlayer();burst(player.x,player.y,'#c5c1a7',5);}
function update(dt){worldTime=(worldTime+dt/70)%24;player.attackTimer=Math.max(0,player.attackTimer-dt);player.dodgeTimer=Math.max(0,player.dodgeTimer-dt);player.dodgeCooldown=Math.max(0,player.dodgeCooldown-dt);player.skillCooldown=Math.max(0,player.skillCooldown-dt);if(messageTimer>0){messageTimer-=dt;if(messageTimer<=0){const el=document.getElementById('message');if(el)el.classList.remove('show');}}let dx=0,dy=0;if(keys.has('KeyA')||keys.has('ArrowLeft'))dx--;if(keys.has('KeyD')||keys.has('ArrowRight'))dx++;if(keys.has('KeyW')||keys.has('ArrowUp'))dy--;if(keys.has('KeyS')||keys.has('ArrowDown'))dy++;const moving=dx!==0||dy!==0;if(moving&&!isOverlayOpen()){const len=Math.hypot(dx,dy)||1;player.x+=(dx/len)*player.speed*dt;player.y+=(dy/len)*player.speed*dt;if(Math.abs(dx)>Math.abs(dy))player.facing=dx>0?'right':'left';else player.facing=dy>0?'down':'up';clampPlayer();}for(const m of monsters){if(!m.alive)continue;m.attackCooldown=Math.max(0,m.attackCooldown-dt);m.hitFlash=Math.max(0,m.hitFlash-dt);const dxm=player.x-m.x,dym=player.y-m.y,d=Math.hypot(dxm,dym);if(d<260&&d>44){m.x+=(dxm/d)*m.speed*dt;m.y+=(dym/d)*m.speed*dt;}else if(d<=44&&m.attackCooldown<=0&&!player.dodgeTimer&&!isOverlayOpen()){player.hp=Math.max(0,player.hp-Math.max(1,Math.round(m.baseDamage||8)));m.attackCooldown=1.2;if(player.hp<=0){player.hp=player.maxHp;player.x=player.lastSafeX;player.y=player.lastSafeY;showMessage('You were defeated. Returned to safety.');}}}for(const p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}for(let i=particles.length-1;i>=0;i--)if(particles[i].life<=0)particles.splice(i,1);camera.x=Math.max(0,Math.min(WORLD.width-canvas.width,player.x-canvas.width/2));camera.y=Math.max(0,Math.min(WORLD.height-canvas.height,player.y-canvas.height/2));if(typeof updateHud==='function')updateHud();}
function clampPlayer(){player.x=Math.max(20,Math.min(WORLD.width-20,player.x));player.y=Math.max(20,Math.min(WORLD.height-20,player.y));}
function burst(x,y,color,count){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=20+Math.random()*70;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.4+Math.random()*.5,color});}}

function pixelRect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function drawPixelPlayer(){
  const x=Math.round(player.x), y=Math.round(player.y);
  const walk=((performance.now()/110)|0)%2;
  ctx.fillStyle=player.dodgeTimer>0?'#fff':'#eadfc9';
  pixelRect(x-10,y-16,20,20,ctx.fillStyle);
  pixelRect(x-14,y-5,28,18,ctx.fillStyle);
  pixelRect(x-12,y+13,8,7,walk?'#b8a98d':'#9d9079');
  pixelRect(x+4,y+13,8,7,walk?'#9d9079':'#b8a98d');
  pixelRect(x-7,y-10,4,4,'#171717'); pixelRect(x+3,y-10,4,4,'#171717');
  const dir=getFacingVector();
  pixelRect(x+dir.x*14-2,y+dir.y*14-2,5,5,'#d9bd72');
}
function drawPixelMonster(m){
  const x=Math.round(m.x), y=Math.round(m.y), c=m.hitFlash>0?'#fff':(elementColors[m.element]||'#d66');
  pixelRect(x-15,y-13,30,26,c);
  pixelRect(x-11,y-18,22,6,c);
  pixelRect(x-17,y-8,5,12,c); pixelRect(x+12,y-8,5,12,c);
  pixelRect(x-9,y-5,5,5,'#171717'); pixelRect(x+4,y-5,5,5,'#171717');
  pixelRect(x-13,y-24,26,4,'#171717');
  pixelRect(x-13,y-24,26*Math.max(0,m.hp/m.maxHp),4,'#69bd6b');
}
function drawWorld(){
  ctx.fillStyle='#101b19'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.translate(-Math.floor(camera.x),-Math.floor(camera.y));
  ctx.fillStyle='#1f382d'; ctx.fillRect(0,0,WORLD.width,WORLD.height);
  // Pixel-art tile pattern instead of a plain debug grid.
  for(let y=0;y<WORLD.height;y+=32){
    for(let x=0;x<WORLD.width;x+=32){
      const n=((x/32)*13+(y/32)*7)%5;
      if(n===0) pixelRect(x+5,y+7,3,3,'#294738');
      if(n===1) pixelRect(x+21,y+19,2,2,'#173025');
      if(n===2) pixelRect(x+11,y+25,4,2,'#294738');
    }
  }
  // Town courtyard.
  pixelRect(320,220,340,270,'#5b4a32');
  pixelRect(336,236,308,238,'#7b8865');
  pixelRect(350,250,280,190,'#707f5d');
  // Simple pixel houses/NPC stalls.
  pixelRect(405,285,52,45,'#9b684e'); pixelRect(399,276,64,12,'#493a2a');
  pixelRect(485,275,52,55,'#8b7654'); pixelRect(479,266,64,12,'#4a3c2c');
  pixelRect(555,285,52,45,'#6d6686'); pixelRect(549,276,64,12,'#40364e');
  for(const m of monsters){if(m.alive)drawPixelMonster(m);}
  drawPixelPlayer();
  for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.8);pixelRect(p.x-2,p.y-2,4,4,p.color);}
  ctx.globalAlpha=1; ctx.restore();
}
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);drawWorld();}
function gameLoop(now){const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;update(dt);draw();requestAnimationFrame(gameLoop);}
if(typeof updateHud==='function')updateHud();
requestAnimationFrame(gameLoop);
