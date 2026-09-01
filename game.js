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
  seeds: {},
  foods: {},
  activeTraits: {},
  unlockedSkillIds: new Set(['ember-burst']),
  facing: 'down',
  attackTimer: 0,
  dodgeTimer: 0,
  dodgeCooldown: 0,
  contactDamageCooldown: 0,
  skillCooldown: 0,
  skillId: 'ember-burst',
  lastSafeX: 480,
  lastSafeY: 360,
};

function createMonster(data, x, y) {
  return {
    ...data,
    x, y, spawnX: x, spawnY: y,
    maxHp: data.baseHp + data.level * 4,
    hp: data.baseHp + data.level * 4,
    alive: true,
    hitFlash: 0,
    attackCooldown: 0,
  };
}

const monsterSpawns = [[700, 380], [830, 520], [560, 610]];
const monsters = Object.values(MONSTER_DATA).map((data, index) =>
  createMonster(data, ...monsterSpawns[index % monsterSpawns.length])
);

const particles = [];
let camera = { x: 0, y: 0 };
let worldTime = 8.0;
let lastTime = performance.now();
let messageTimer = 0;

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (e.repeat) {
    keys.add(e.code);
    return;
  }
  keys.add(e.code);
  if (e.code === 'KeyJ' || e.code === 'KeyZ') attack();
  if (e.code === 'Space') dodge();
  if (e.code === 'KeyK' || e.code === 'KeyX') useMonsterSkill();
  if (e.code === 'KeyE') interactWithGarden();
  if (e.code === 'KeyI') toggleInventory();
  if (e.code === 'KeyQ') eatSelectedFood();
  if (e.code === 'Digit1') selectSkill(0);
  if (e.code === 'Digit2') selectSkill(1);
  if (e.code === 'Digit3') selectSkill(2);
  if (e.code === 'F5') {
    e.preventDefault();
    saveGame(true);
  }
  if (e.code === 'F9') {
    e.preventDefault();
    loadGame(true);
  }
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

function showMessage(text) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.classList.add('show');
  messageTimer = 2;
}

function getFacingVector() {
  return {
    up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }, right: { x: 1, y: 0 },
  }[player.facing];
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
  const unlocked = player.unlockedSkillIds || new Set(['ember-burst']);
  const skills = [];
  for (const monster of Object.values(MONSTER_DATA)) {
    if (monster.skill && unlocked.has(monster.skill.id)) skills.push(monster.skill);
  }
  return skills;
}

function selectSkill(index) {
  const skills = getAvailableSkills();
  if (!skills[index]) return;
  player.skillId = skills[index].id;
  showMessage(`Skill: ${skills[index].name}`);
  if (typeof renderInventory === 'function') renderInventory();
}

function attack() {
  if (player.attackTimer > 0 || player.dodgeTimer > 0 || inventoryState.open) return;
  player.attackTimer = 0.28;

  let hit = false;
  for (const monster of monsters) {
    if (!monster.alive || !isInAttackArc(monster, 68)) continue;
    const multiplier = getElementMultiplier(ELEMENTS.ARCANE, monster.element);
    const damage = Math.max(1, Math.round((18 + player.level * 2) * multiplier));
    monster.hp = Math.max(0, monster.hp - damage);
    monster.hitFlash = 0.12;
    burst(monster.x, monster.y, '#ded6b7', 7);
    hit = true;
    if (monster.hp <= 0) killMonster(monster);
  }
  if (hit) showMessage('Attack hit!');
}

function useMonsterSkill() {
  if (player.skillCooldown > 0 || player.dodgeTimer > 0 || inventoryState.open) return;
  const skills = getAvailableSkills();
  const skill = skills.find((item) => item.id === player.skillId) || skills[0];
  if (!skill) return;
  if (player.mp < skill.cost) {
    showMessage('Not enough MP.');
    return;
  }

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
  const element = skillElement(skill);
  for (const monster of monsters) {
    if (!monster.alive || !isInAttackArc(monster, range, 0)) continue;
    const multiplier = getElementMultiplier(element, monster.element);
    const damage = Math.max(1, Math.round(skill.power * multiplier));
    monster.hp = Math.max(0, monster.hp - damage);
    monster.hitFlash = 0.18;
    burst(monster.x, monster.y, elementColors[element] || '#ddd', 10);
    hit = true;
    if (monster.hp <= 0) killMonster(monster);
  }
  showMessage(`${skill.name}${hit ? ' • Hit!' : ''}`);
}

function skillElement(skill) {
  if (skill.id === 'ember-burst') return ELEMENTS.FIRE;
  if (skill.id === 'goblin-rush') return ELEMENTS.NATURE;
  if (skill.id === 'predator-dash') return ELEMENTS.NATURE;
  return ELEMENTS.ARCANE;
}

function addSeed(monster) {
  player.seeds[monster.id] = (player.seeds[monster.id] || 0) + 1;
}

function killMonster(monster) {
  if (!monster.alive) return;
  monster.alive = false;
  player.gold += 15 + monster.level * 5;
  addSeed(monster);
  player.xp += 25 + monster.level * 10;
  player.mp = Math.min(player.maxMp, player.mp + 5);
  burst(monster.x, monster.y, elementColors[monster.element] || '#aaa', 18);
  showMessage(`${monster.name} fell → ${monster.seedName} • +XP`);
  checkLevelUp();
  window.setTimeout(() => respawnMonster(monster), 4500);
}

function checkLevelUp() {
  let leveled = false;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
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
  if (player.dodgeCooldown > 0 || player.dodgeTimer > 0 || inventoryState.open) return;
  player.dodgeTimer = 0.22;
  player.dodgeCooldown = 0.65;
  let dx = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  let dy = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0);
  if (dx === 0 && dy === 0) {
    const f = getFacingVector();
    dx = f.x;
    dy = f.y;
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
  player.contactDamageCooldown = Math.max(0, player.contactDamageCooldown - dt);
  player.skillCooldown = Math.max(0, player.skillCooldown - dt);

  if (messageTimer > 0) {
    messageTimer -= dt;
    if (messageTimer <= 0) document.getElementById('message').classList.remove('show');
  }

  let dx = 0, dy = 0;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) dx -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) dx += 1;
  if (keys.has('KeyW') || keys.has('ArrowUp')) dy -= 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) dy += 1;

  const moving = dx !== 0 || dy !== 0;
  if (moving && player.dodgeTimer <= 0 && !inventoryState.open) {
    const len = Math.hypot(dx, dy) || 1;
    player.x += (dx / len) * player.speed * dt;
    player.y += (dy / len) * player.speed * dt;
    if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
    else player.facing = dy > 0 ? 'down' : 'up';
  }
  clampPlayer();

  updateGarden();
  for (const monster of monsters) updateMonster(monster, dt);
  updateParticles(dt);

  camera.x = Math.max(0, Math.min(WORLD.width - canvas.width, player.x - canvas.width / 2));
  camera.y = Math.max(0, Math.min(WORLD.height - canvas.height, player.y - canvas.height / 2));
  updateHud();
}

function updateMonster(m, dt) {
  if (!m.alive) return;
  m.hitFlash = Math.max(0, m.hitFlash - dt);
  m.attackCooldown = Math.max(0, m.attackCooldown - dt);
  const dx = player.x - m.x;
  const dy = player.y - m.y;
  const dist = Math.hypot(dx, dy);

  if (!inventoryState.open && dist < 260 && dist > 45) {
    m.x += (dx / dist) * m.speed * dt;
    m.y += (dy / dist) * m.speed * dt;
  }

  if (!inventoryState.open && dist < 42 && player.dodgeTimer <= 0 && m.attackCooldown <= 0) {
    const before = player.hp;
    player.hp = Math.max(0, player.hp - (6 + m.level));
    m.attackCooldown = 0.65;
    if (player.hp < before) burst(player.x, player.y, '#a86464', 4);
    if (player.hp <= 0) collapsePlayer();
  }
}

function collapsePlayer() {
  player.hp = player.maxHp;
  player.mp = player.maxMp;
  player.x = player.lastSafeX;
  player.y = player.lastSafeY;
  player.contactDamageCooldown = 1;
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
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 100,
      vy: (Math.random() - 0.5) * 100,
      life: 0.35 + Math.random() * 0.35,
      color,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawPlants();
  drawGardenPlants();
  for (const m of monsters) if (m.alive) drawMonster(m);
  drawPlayer();
  for (const p of particles) drawParticle(p);
  drawGardenHint();
  drawNightOverlay();
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
  for (const plot of GARDEN_PLOTS) {
    ctx.fillStyle = '#604f3b';
    ctx.fillRect(plot.x, plot.y, plot.w, plot.h);
    ctx.fillStyle = '#776047';
    ctx.fillRect(plot.x + 4, plot.y + 5, plot.w - 8, plot.h - 10);
  }
  ctx.fillStyle = '#d0c3a1';
  ctx.font = '14px monospace';
  ctx.fillText('MONSTER GARDEN', 690, 760);
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(Math.round(player.x - camera.x), Math.round(player.y - camera.y));
  const moving = ['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].some((k) => keys.has(k));
  const bob = moving && player.dodgeTimer <= 0 ? Math.sin(performance.now() / 90) * 2 : 0;
  ctx.translate(0, bob);
  ctx.fillStyle = '#16191a'; ctx.fillRect(-10, 12, 20, 18);
  ctx.fillStyle = '#314c38'; ctx.fillRect(-14, -2, 28, 22);
  ctx.fillStyle = '#b37d55'; ctx.fillRect(-9, -18, 18, 17);
  ctx.fillStyle = '#493426'; ctx.fillRect(-10, -20, 20, 7);
  ctx.fillStyle = '#2b2e32'; ctx.fillRect(-11, 28, 8, 13); ctx.fillRect(3, 28, 8, 13);
  ctx.fillStyle = '#7a5135'; ctx.fillRect(13, -4, 4, 40);
  if (player.attackTimer > 0) {
    const f = getFacingVector(); const angle = Math.atan2(f.y, f.x);
    ctx.strokeStyle = '#d9d2b5'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 3, 45, angle - 0.85, angle + 0.85); ctx.stroke();
  }
  if (player.dodgeTimer > 0) {
    ctx.globalAlpha = 0.45; ctx.fillStyle = '#d8d0b0'; ctx.fillRect(-22, -25, 44, 65);
  }
  ctx.restore();
}

function drawMonster(m) {
  ctx.save();
  ctx.translate(Math.round(m.x - camera.x), Math.round(m.y - camera.y));
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-m.w / 2, m.h / 2, m.w, 6);
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
  const width = 48;
  ctx.fillStyle = '#17191a'; ctx.fillRect(-width / 2, -42, width, 6);
  ctx.fillStyle = '#9b5656'; ctx.fillRect(-width / 2 + 1, -41, (width - 2) * (m.hp / m.maxHp), 4);
}

function drawParticle(p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
  ctx.fillStyle = p.color;
  ctx.fillRect(Math.round(p.x - camera.x), Math.round(p.y - camera.y), 4, 4);
  ctx.restore();
}

function drawGardenHint() {
  const hint = getGardenHint();
  if (!hint) return;
  const plot = getNearbyPlot();
  if (!plot) return;
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = '#eee4c9';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(hint, plot.x + plot.w / 2, plot.y - 10);
  ctx.restore();
}

function drawNightOverlay() {
  const night = worldTime >= 19 || worldTime < 6;
  if (!night) return;
  const darkness = worldTime >= 21 || worldTime < 4 ? 0.42 : 0.24;
  ctx.fillStyle = `rgba(10, 15, 28, ${darkness})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateHud() {
  const hp = Math.round(player.hp), mp = Math.round(player.mp);
  document.getElementById('hp-fill').style.width = `${(hp / player.maxHp) * 100}%`;
  document.getElementById('mp-fill').style.width = `${(mp / player.maxMp) * 100}%`;
  document.getElementById('hp-text').textContent = `${hp} / ${player.maxHp}`;
  document.getElementById('mp-text').textContent = `${mp} / ${player.maxMp}`;
  document.getElementById('level').textContent = player.level;
  document.getElementById('xp').textContent = `${player.xp} / ${player.xpToNext}`;
  document.getElementById('gold').textContent = player.gold;
  document.getElementById('seeds').textContent = Object.values(player.seeds).reduce((sum, count) => sum + Math.max(0, count || 0), 0);
  document.getElementById('time').textContent = formatWorldTime(worldTime);
  document.getElementById('foods').textContent = getTotalFoodCount();
  document.getElementById('power').textContent = Object.keys(player.activeTraits || {}).length;
}

function formatWorldTime(time) {
  const hours = Math.floor(time) % 24;
  const minutes = Math.floor((time - Math.floor(time)) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

if (!player.foods) player.foods = {};
if (!player.activeTraits) player.activeTraits = {};
if (!(player.unlockedSkillIds instanceof Set)) player.unlockedSkillIds = new Set(['ember-burst']);
if (typeof renderInventory === 'function') renderInventory();
loadGame(false);
showMessage('Explore the wilds. The garden is waiting.');
updateHud();
requestAnimationFrame(loop);
