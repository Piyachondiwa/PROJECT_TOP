const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const WORLD = { width: 2400, height: 1600 };
const keys = new Set();

const player = {
  x: 480, y: 360, w: 34, h: 46,
  speed: 170,
  hp: 100, maxHp: 100,
  mp: 50, maxMp: 50,
  xp: 0, xpToNext: 100, level: 1,
  gold: 100,
  seeds: {}, foods: {}, activeTraits: {},
  unlockedSkillIds: new Set(['ember-burst']),
  facing: 'down', attackTimer: 0, dodgeTimer: 0,
  dodgeCooldown: 0, skillCooldown: 0, skillId: 'ember-burst',
  lastSafeX: 480, lastSafeY: 360,
};

function createMonster(data, x, y) {
  return { ...data, x, y, spawnX:x, spawnY:y,
    maxHp:data.baseHp + data.level * 4,
    hp:data.baseHp + data.level * 4,
    alive:true, hitFlash:0, attackCooldown:0,
  };
}

const monsterSpawns = [[700,380],[830,520],[560,610]];
const monsters = Object.values(MONSTER_DATA).map((data,index)=>createMonster(data, ...monsterSpawns[index % monsterSpawns.length]));
const particles = [];
let camera = { x: 0, y: 0 };
let worldTime = 8.0;
let lastTime = performance.now();
let messageTimer = 0;

const safeBool = (name, fallback = false) => typeof window[name] !== 'undefined' ? !!window[name] : fallback;
const isOverlayOpen = () => ['inventoryState','dialogueState','shopState','questState','travelState'].some((name)=>window[name]?.open);

window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  keys.add(e.code);
  if (e.repeat) return;
  if (e.code === 'KeyJ' || e.code === 'KeyZ') attack();
  else if (e.code === 'Space') dodge();
  else if (e.code === 'KeyK' || e.code === 'KeyX') useMonsterSkill();
  else if (e.code === 'KeyE') {
    if (typeof getNearbyNpc === 'function' && getNearbyNpc()) interactWithNpc();
    else if (typeof interactWithGarden === 'function') interactWithGarden();
  }
  else if (e.code === 'KeyI' && typeof toggleInventory === 'function') toggleInventory();
  else if (e.code === 'KeyQ' && typeof eatSelectedFood === 'function') eatSelectedFood();
  else if (e.code === 'Digit1') selectSkill(0);
  else if (e.code === 'Digit2') selectSkill(1);
  else if (e.code === 'Digit3') selectSkill(2);
  else if (e.code === 'KeyR' && typeof restAtSafeZone === 'function') restAtSafeZone();
  else if ((e.code === 'KeyF' && (e.ctrlKey || e.metaKey)) || e.code === 'F5') {
    e.preventDefault();
    if (typeof saveGame === 'function') saveGame(true);
  }
  else if (e.code === 'F9' && typeof loadGame === 'function') {
    e.preventDefault();
    loadGame(true);
  }
  else if (e.code === 'Escape') {
    if (typeof closeAllOverlays === 'function') closeAllOverlays();
    else {
      if (window.dialogueState) window.dialogueState.open = false;
      if (window.inventoryState) window.inventoryState.open = false;
      if (window.shopState) window.shopState.open = false;
      if (window.questState) window.questState.open = false;
    }
  }
  else if (e.code === 'Enter' && window.dialogueState?.open && typeof advanceDialogue === 'function') advanceDialogue();
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

function showMessage(text) {
  const el = document.getElementById('message');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  messageTimer = 2;
}

function getFacingVector() {
  return { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} }[player.facing] || {x:0,y:1};
}

function isInAttackArc(monster, range, arcCos = 0.15) {
  const dx = monster.x - player.x;
  const dy = monster.y - player.y;
  const dist = Math.hypot(dx, dy);
  if (dist > range || dist === 0) return false;
  const f = getFacingVector();
  return ((dx / dist) * f.x + (dy / dist) * f.y) >= arcCos;
}

function getAvailableSkills() {
  const unlocked = player.unlockedSkillIds instanceof Set ? player.unlockedSkillIds : new Set(['ember-burst']);
  return Object.values(MONSTER_DATA).filter((m) => m.skill && unlocked.has(m.skill.id)).map((m) => m.skill);
}

function selectSkill(index) {
  const skills = getAvailableSkills();
  if (!skills[index]) return;
  player.skillId = skills[index].id;
  showMessage(`Skill: ${skills[index].name}`);
  if (typeof renderInventory === 'function') renderInventory();
}

function getPlayerAttackPower() {
  const effects = typeof getTraitEffects === 'function' ? getTraitEffects() : {};
  return 18 + player.level * 2 + (effects.attackPower || 0);
}

function getBasicAttackElement() {
  // Basic attacks are physical/arcane-neutral unless equipment supplies an element.
  const bonus = typeof getEquipmentBonuses === 'function' ? getEquipmentBonuses() : {};
  return bonus.element || ELEMENTS.ARCANE;
}

function attack() {
  if (player.attackTimer > 0 || player.dodgeTimer > 0 || isOverlayOpen()) return;
  player.attackTimer = 0.28;
  let hit = false;
  for (const m of monsters) {
    if (!m.alive || !isInAttackArc(m, 68)) continue;
    const mult = getElementMultiplier(getBasicAttackElement(), m.element);
    const dmg = Math.max(1, Math.round(getPlayerAttackPower() * mult));
    m.hp = Math.max(0, m.hp - dmg);
    m.hitFlash = 0.12;
    burst(m.x, m.y, '#ded6b7', 7);
    hit = true;
    if (m.hp <= 0) killMonster(m);
  }
  if (hit) {
    showMessage('Attack hit!');
    if (typeof combatFeedback === 'function') combatFeedback('hit');
  }
}

function useMonsterSkill() {
  if (player.skillCooldown > 0 || player.dodgeTimer > 0 || isOverlayOpen()) return;
  const skills = getAvailableSkills();
  const skill = skills.find((s) => s.id === player.skillId) || skills[0];
  if (!skill) return;
  if (player.mp < skill.cost) { showMessage('Not enough MP.'); return; }

  player.mp -= skill.cost;
  player.skillCooldown = 1.1;
  const range = skill.id === 'predator-dash' ? 96 : 82;
  const f = getFacingVector();
  if (skill.id === 'predator-dash') {
    player.x += f.x * 70;
    player.y += f.y * 70;
    clampPlayer();
  }

  let hit = false;
  const element = skill.element || ELEMENTS.ARCANE;
  for (const m of monsters) {
    if (!m.alive || !isInAttackArc(m, range, 0)) continue;
    const mult = getElementMultiplier(element, m.element);
    const dmg = Math.max(1, Math.round(skill.power * mult));
    m.hp = Math.max(0, m.hp - dmg);
    m.hitFlash = 0.18;
    burst(m.x, m.y, elementColors[element] || '#ddd', 10);
    hit = true;
    if (m.hp <= 0) killMonster(m);
  }
  showMessage(`${skill.name}${hit ? ' • Hit!' : ''}`);
}

function addSeed(monster) {
  player.seeds[monster.id] = (player.seeds[monster.id] || 0) + 1;
}

function killMonster(monster) {
  if (!monster.alive) return;
  monster.alive = false;
  const drops = typeof getMaterialDropAmount === 'function' ? getMaterialDropAmount(1) : 1;
  player.gold += (15 + monster.level * 5) * drops;
  for (let i = 0; i < drops; i++) addSeed(monster);
  player.xp += 25 + monster.level * 10;
  player.mp = Math.min(player.maxMp, player.mp + 5);
  burst(monster.x, monster.y, elementColors[monster.element] || '#aaa', 18);
  if (typeof advanceQuest === 'function') advanceQuest('kill', monster.id, 1);
  if (typeof recordMonsterDefeat === 'function') recordMonsterDefeat(monster.id, monster.level);
  checkLevelUp();
  showMessage(`${monster.name} fell → ${monster.seedName} ×${drops} • +XP`);
  setTimeout(() => respawnMonster(monster), 4500);
}

function checkLevelUp() {
  let leveled = false;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level++;
    player.xpToNext = Math.floor(player.xpToNext * 1.35);
    player.maxHp += 12;
    player.maxMp += 6;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    leveled = true;
  }
  if (leveled) showMessage(`Level Up! You are now Lv.${player.level}`);
}

function respawnMonster(monster) {
  monster.hp = monster.maxHp;
  monster.alive = true;
  monster.x = monster.spawnX;
  monster.y = monster.spawnY;
  monster.hitFlash = 0;
  monster.attackCooldown = 0;
}

function dodge() {
  if (player.dodgeCooldown > 0 || player.dodgeTimer > 0 || isOverlayOpen()) return;
  player.dodgeTimer = 0.22;
  player.dodgeCooldown = 0.65;
  let dx = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  let dy = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0);
  if (dx === 0 && dy === 0) {
    const f = getFacingVector();
    dx = f.x; dy = f.y;
  }
  const len = Math.hypot(dx, dy) || 1;
  player.x += (dx / len) * 78;
  player.y += (dy / len) * 78;
  clampPlayer();
  burst(player.x, player.y, '#c5c1a7', 5);
}

function update(dt) {
  worldTime = (worldTime + dt / 70) % 24;
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.dodgeTimer = Math.max(0, player.dodgeTimer - dt);
  player.dodgeCooldown = Math.max(0, player.dodgeCooldown - dt);
  player.skillCooldown = Math.max(0, player.skillCooldown - dt);

  if (messageTimer > 0) {
    messageTimer -= dt;
    if (messageTimer <= 0) {
      const el = document.getElementById('message');
      if (el) el.classList.remove('show');
    }
  }

  let dx = 0, dy = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) dx--;
  if (keys.has('KeyD') || keys.has('ArrowRight')) dx++;
  if (keys.has('KeyW') || keys.has('ArrowUp')) dy--;
  if (keys.has('KeyS') || keys.has('ArrowDown')) dy++;

  const moving = dx !== 0 || dy !== 0;
  if (moving && player.dodgeTimer <= 0 && !isOverlayOpen()) {
    const len = Math.hypot(dx, dy) || 1;
    const speed = typeof getPlayerMoveSpeed === 'function' ? getPlayerMoveSpeed() : player.speed;
    player.x += (dx / len) * speed * dt;
    player.y += (dy / len) * speed * dt;
    if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
    else player.facing = dy > 0 ? 'down' : 'up';
  }

  clampPlayer();
  if (typeof updateGarden === 'function') updateGarden();
  for (const m of monsters) updateMonster(m, dt);
  updateParticles(dt);
  if (typeof updateWorldEvents === 'function') updateWorldEvents(dt);
  if (typeof updateWorldEncounters === 'function') updateWorldEncounters(dt);

  camera.x = Math.max(0, Math.min(WORLD.width - canvas.width, player.x - canvas.width / 2));
  camera.y = Math.max(0, Math.min(WORLD.height - canvas.height, player.y - canvas.height / 2));
  updateHud();
}

function updateMonster(m, dt) {
  if (!m.alive || isOverlayOpen()) return;
  m.hitFlash = Math.max(0, m.hitFlash - dt);
  m.attackCooldown = Math.max(0, m.attackCooldown - dt);
  const dx = player.x - m.x;
  const dy = player.y - m.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 260 && dist > 45) {
    m.x += (dx / dist) * m.speed * dt;
    m.y += (dy / dist) * m.speed * dt;
  }
  if (dist < 42 && player.dodgeTimer <= 0 && m.attackCooldown <= 0) {
    const raw = 6 + m.level;
    const damage = typeof applyIncomingElementDamage === 'function' ? applyIncomingElementDamage(raw, m.element) : raw;
    player.hp = Math.max(0, player.hp - damage);
    m.attackCooldown = 0.65;
    if (player.hp <= 0) collapsePlayer();
  }
}

function collapsePlayer() {
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  player.x = player.lastSafeX;
  player.y = player.lastSafeY;
  player.skillCooldown = 0.5;
  showMessage('You collapsed and woke up at the last safe place.');
}

function clampPlayer() {
  player.x = Math.max(30, Math.min(WORLD.width - 30, player.x));
  player.y = Math.max(30, Math.min(WORLD.height - 30, player.y));
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push({ x, y, vx:(Math.random()-.5)*100, vy:(Math.random()-.5)*100, life:.35+Math.random()*.35, color });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawPlants();
  if (typeof drawGardenPlants === 'function') drawGardenPlants();
  if (typeof drawNpcs === 'function') drawNpcs(ctx, camera);
  for (const m of monsters) if (m.alive) drawMonster(m);
  drawPlayer();
  for (const p of particles) drawParticle(p);
  if (typeof drawGardenHint === 'function') drawGardenHint();
  drawNightOverlay();
  if (typeof drawWorldEncounterOverlay === 'function') drawWorldEncounterOverlay(ctx, camera);
}

function drawWorld() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = '#33443b';
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  for (let y = 0; y < WORLD.height; y += 64) {
    for (let x = 0; x < WORLD.width; x += 64) {
      const n = (x * 17 + y * 31) % 11;
      ctx.fillStyle = n < 2 ? '#3a4b3e' : '#3f5142';
      ctx.fillRect(x, y, 62, 62);
    }
  }
  ctx.fillStyle = '#806e54'; ctx.fillRect(0, 300, WORLD.width, 150);
  ctx.fillStyle = '#8e7a5b'; ctx.fillRect(0, 320, WORLD.width, 110);
  ctx.fillStyle = '#4e5c4c'; ctx.fillRect(330, 220, 310, 250);
  ctx.fillStyle = '#62533f'; ctx.fillRect(390, 255, 190, 125);
  ctx.fillStyle = '#775e48'; ctx.fillRect(375, 240, 220, 24);
  ctx.fillStyle = '#a58a61'; ctx.fillRect(455, 330, 60, 50);
  ctx.fillStyle = '#9b774d'; ctx.fillRect(520, 270, 18, 55);
  ctx.fillStyle = '#c5a36d'; ctx.fillRect(518, 258, 22, 16);
  ctx.fillStyle = '#d0b17a'; ctx.fillRect(548, 274, 5, 5); ctx.fillRect(566, 288, 5, 5);
  ctx.restore();
}

function drawPlants() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  if (Array.isArray(window.GARDEN_PLOTS)) {
    for (const plot of GARDEN_PLOTS) {
      ctx.fillStyle = '#604f3b'; ctx.fillRect(plot.x, plot.y, plot.w, plot.h);
      ctx.fillStyle = '#776047'; ctx.fillRect(plot.x + 4, plot.y + 5, plot.w - 8, plot.h - 10);
    }
  }
  ctx.fillStyle = '#d0c3a1';
  ctx.font = '14px monospace';
  ctx.fillText('MONSTER GARDEN', 690, 760);
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(Math.round(player.x - camera.x), Math.round(player.y - camera.y));
  const moving = ['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].some(k => keys.has(k));
  const bob = moving && player.dodgeTimer <= 0 ? Math.sin(performance.now() / 90) * 2 : 0;
  ctx.translate(0, bob);
  ctx.fillStyle = '#16191a'; ctx.fillRect(-10, 12, 20, 18);
  ctx.fillStyle = '#314c38'; ctx.fillRect(-14, -2, 28, 22);
  ctx.fillStyle = '#b37d55'; ctx.fillRect(-9, -18, 18, 17);
  ctx.fillStyle = '#493426'; ctx.fillRect(-10, -20, 20, 7);
  ctx.fillStyle = '#2b2e32'; ctx.fillRect(-11, 28, 8, 13); ctx.fillRect(3, 28, 8, 13);
  ctx.fillStyle = '#7a5135'; ctx.fillRect(13, -4, 4, 40);
  if (player.attackTimer > 0) {
    const f = getFacingVector(), a = Math.atan2(f.y, f.x);
    ctx.strokeStyle = '#d9d2b5'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 3, 45, a - 0.85, a + 0.85); ctx.stroke();
  }
  if (player.dodgeTimer > 0) {
    ctx.globalAlpha = 0.45; ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-22, -25, 44, 65);
  }
  ctx.restore();
}

function drawMonster(m) {
  ctx.save();
  ctx.translate(Math.round(m.x - camera.x), Math.round(m.y - camera.y));
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-m.w/2, m.h/2, m.w, 6);
  ctx.fillStyle = m.hitFlash > 0 ? '#f2d9c5' : m.color;
  if (m.id === 'slime') {
    ctx.beginPath(); ctx.arc(0, 0, 18, Math.PI, 0); ctx.lineTo(18, 13); ctx.lineTo(-18, 13); ctx.closePath(); ctx.fill();
  } else if (m.id === 'wolf') {
    ctx.beginPath(); ctx.moveTo(-23, 10); ctx.lineTo(-8, -10); ctx.lineTo(10, -12); ctx.lineTo(24, 4); ctx.lineTo(12, 14); ctx.lineTo(-15, 14); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillRect(-15, -17, 30, 34); ctx.fillRect(-19, -21, 8, 8); ctx.fillRect(11, -21, 8, 8);
  }
  ctx.fillStyle = '#17191a'; ctx.fillRect(-7, -7, 4, 4); ctx.fillRect(4, -7, 4, 4);
  drawHpBar(m);
  ctx.fillStyle = '#ddd6bf'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
  ctx.fillText(`${m.name} Lv.${m.level} • ${m.element}`, 0, -30);
  ctx.restore();
}

function drawHpBar(m) {
  const w = 48;
  ctx.fillStyle = '#17191a'; ctx.fillRect(-w/2, -42, w, 6);
  ctx.fillStyle = '#9b5656'; ctx.fillRect(-w/2 + 1, -41, (w - 2) * (m.hp / Math.max(1, m.maxHp)), 4);
}

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
  ctx.fillStyle = p.color;
  ctx.fillRect(Math.round(p.x - camera.x), Math.round(p.y - camera.y), 4, 4);
  ctx.restore();
}

function drawNightOverlay() {
  const night = typeof isNightTime === 'function' ? isNightTime() : (worldTime >= 19 || worldTime < 6);
  if (!night) return;
  const darkness = worldTime >= 21 || worldTime < 4 ? 0.42 : 0.24;
  ctx.fillStyle = `rgba(10,15,28,${darkness})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateHud() {
  const hp = Math.round(player.hp), mp = Math.round(player.mp);
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const setWidth = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = `${Math.max(0, Math.min(100, pct))}%`; };
  setWidth('hp-fill', hp / Math.max(1, player.maxHp) * 100);
  setWidth('mp-fill', mp / Math.max(1, player.maxMp) * 100);
  set('hp-text', `${hp} / ${player.maxHp}`);
  set('mp-text', `${mp} / ${player.maxMp}`);
  set('level', player.level);
  set('xp', `${player.xp} / ${player.xpToNext}`);
  set('gold', player.gold);
  set('seeds', Object.values(player.seeds).reduce((s, n) => s + Math.max(0, Number(n) || 0), 0));
  set('time', typeof formatWorldTime === 'function' ? formatWorldTime(worldTime) : `${String(Math.floor(worldTime)).padStart(2,'0')}:00`);
  set('foods', typeof getTotalFoodCount === 'function' ? getTotalFoodCount() : Object.values(player.foods).reduce((s,n) => s + Math.max(0, Number(n)||0), 0));
  set('power', Object.keys(player.activeTraits || {}).length);
}

if (typeof loadGame === 'function') loadGame(false);
else if (typeof renderInventory === 'function') renderInventory();
if (typeof renderShop === 'function') renderShop();
if (typeof renderDialogue === 'function') renderDialogue();
updateHud();
showMessage('Explore the wilds. The garden is waiting.');
requestAnimationFrame(function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
});
