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
  level: 1, gold: 100, seeds: 0,
  facing: 'down',
  attackTimer: 0,
  dodgeTimer: 0,
  dodgeCooldown: 0,
  contactDamageCooldown: 0,
};

const monsters = [
  { id: 'goblin', name: 'Goblin', x: 700, y: 380, spawnX: 700, spawnY: 380, w: 34, h: 38, hp: 45, maxHp: 45, level: 2, element: 'nature', seed: 'Goblin Seed', color: '#778c58', speed: 55, alive: true, hitFlash: 0 },
  { id: 'slime', name: 'Fire Slime', x: 830, y: 520, spawnX: 830, spawnY: 520, w: 38, h: 30, hp: 55, maxHp: 55, level: 3, element: 'fire', seed: 'Fire Slime Seed', color: '#a86d4b', speed: 38, alive: true, hitFlash: 0 },
  { id: 'wolf', name: 'Wolf', x: 560, y: 610, spawnX: 560, spawnY: 610, w: 44, h: 30, hp: 65, maxHp: 65, level: 4, element: 'nature', seed: 'Wolf Seed', color: '#77746f', speed: 75, alive: true, hitFlash: 0 },
];

const particles = [];
let camera = { x: 0, y: 0 };
let worldTime = 8.0;
let lastTime = performance.now();
let messageTimer = 0;

const elementColors = {
  fire: '#b86b4d', ice: '#6e91a7', lightning: '#b0a16a', earth: '#81715c',
  nature: '#6d8758', shadow: '#665a78', light: '#b6a56e', water: '#587c91', arcane: '#806b96'
};

window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)) e.preventDefault();
  keys.add(e.code);
  if ((e.code === 'KeyJ' || e.code === 'KeyZ') && !e.repeat) attack();
  if (e.code === 'Space' && !e.repeat) dodge();
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

function showMessage(text) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.classList.add('show');
  messageTimer = 2.0;
}

function getFacingVector() {
  const vectors = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };
  return vectors[player.facing];
}

function isInAttackArc(monster, range, arcCos = 0.15) {
  const dx = monster.x - player.x;
  const dy = monster.y - player.y;
  const dist = Math.hypot(dx, dy);
  if (dist > range || dist === 0) return false;
  const f = getFacingVector();
  const dot = (dx / dist) * f.x + (dy / dist) * f.y;
  return dot >= arcCos;
}

function attack() {
  if (player.attackTimer > 0 || player.dodgeTimer > 0) return;
  player.attackTimer = 0.28;

  const range = 68;
  for (const monster of monsters) {
    if (!monster.alive || !isInAttackArc(monster, range)) continue;
    const damage = 18 + player.level * 2;
    monster.hp = Math.max(0, monster.hp - damage);
    monster.hitFlash = 0.12;
    burst(monster.x, monster.y, '#ded6b7', 7);
    if (monster.hp <= 0) killMonster(monster);
  }
}

function killMonster(monster) {
  monster.alive = false;
  player.gold += 15 + monster.level * 5;
  player.seeds += 1;
  player.mp = Math.min(player.maxMp, player.mp + 5);
  burst(monster.x, monster.y, elementColors[monster.element] || '#aaa', 18);
  showMessage(`${monster.name} fell → ${monster.seed}`);
  setTimeout(() => respawnMonster(monster), 4500);
}

function respawnMonster(monster) {
  monster.hp = monster.maxHp;
  monster.alive = true;
  monster.x = monster.spawnX;
  monster.y = monster.spawnY;
  monster.hitFlash = 0;
}

function dodge() {
  if (player.dodgeCooldown > 0 || player.dodgeTimer > 0) return;
  player.dodgeTimer = 0.22;
  player.dodgeCooldown = 0.65;
  const distance = 78;
  let dx = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0);
  let dy = (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) - (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0);
  if (dx === 0 && dy === 0) {
    const f = getFacingVector();
    dx = f.x;
    dy = f.y;
  }
  const len = Math.hypot(dx, dy) || 1;
  player.x += (dx / len) * distance;
  player.y += (dy / len) * distance;
  clampPlayer();
  burst(player.x, player.y, '#c5c1a7', 5);
}

function update(dt) {
  worldTime += dt / 70;
  if (worldTime >= 24) worldTime -= 24;
  if (player.attackTimer > 0) player.attackTimer = Math.max(0, player.attackTimer - dt);
  if (player.dodgeTimer > 0) player.dodgeTimer = Math.max(0, player.dodgeTimer - dt);
  if (player.dodgeCooldown > 0) player.dodgeCooldown = Math.max(0, player.dodgeCooldown - dt);
  if (player.contactDamageCooldown > 0) player.contactDamageCooldown = Math.max(0, player.contactDamageCooldown - dt);
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
  if (moving && player.dodgeTimer <= 0) {
    const len = Math.hypot(dx, dy) || 1;
    player.x += (dx / len) * player.speed * dt;
    player.y += (dy / len) * player.speed * dt;
    if (Math.abs(dx) > Math.abs(dy)) player.facing = dx > 0 ? 'right' : 'left';
    else player.facing = dy > 0 ? 'down' : 'up';
  }
  clampPlayer();

  for (const monster of monsters) updateMonster(monster, dt);
  updateParticles(dt);

  camera.x = Math.max(0, Math.min(WORLD.width - canvas.width, player.x - canvas.width / 2));
  camera.y = Math.max(0, Math.min(WORLD.height - canvas.height, player.y - canvas.height / 2));
  updateHud();
}

function updateMonster(m, dt) {
  if (!m.alive) return;
  if (m.hitFlash > 0) m.hitFlash = Math.max(0, m.hitFlash - dt);
  const dx = player.x - m.x, dy = player.y - m.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 260 && dist > 45) {
    m.x += (dx / dist) * m.speed * dt;
    m.y += (dy / dist) * m.speed * dt;
  }
  if (dist < 42 && player.dodgeTimer <= 0 && player.contactDamageCooldown <= 0) {
    player.hp = Math.max(0, player.hp - (6 + m.level));
    player.contactDamageCooldown = 0.65;
    burst(player.x, player.y, '#a86464', 4);
    if (player.hp <= 0) {
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      player.contactDamageCooldown = 1.0;
      showMessage('You collapsed and woke up at the last safe place.');
      player.x = 480;
      player.y = 360;
    }
  }
}

function clampPlayer() {
  player.x = Math.max(30, Math.min(WORLD.width - 30, player.x));
  player.y = Math.max(30, Math.min(WORLD.height - 30, player.y));
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

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  drawPlants();
  for (const m of monsters) if (m.alive) drawMonster(m);
  drawPlayer();
  for (const p of particles) drawParticle(p);
  drawNightOverlay();
}

function drawWorld() {
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  ctx.fillStyle = '#33443b'; ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  for (let y = 0; y < WORLD.height; y += 64) {
    for (let x = 0; x < WORLD.width; x += 64) {
      const n = ((x * 17 + y * 31) % 11);
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
  ctx.fillStyle = '#d0b17a'; ctx.fillRect(548, 274, 5, 5);
  ctx.fillRect(566, 288, 5, 5);
  ctx.restore();
}

function drawPlants() {
  ctx.save(); ctx.translate(-camera.x, -camera.y);
  const plots = [
    [690, 780], [760, 780], [830, 780], [900, 780],
    [690, 850], [760, 850], [830, 850], [900, 850]
  ];
  for (const [x, y] of plots) {
    ctx.fillStyle = '#604f3b'; ctx.fillRect(x, y, 52, 40);
    ctx.fillStyle = '#776047'; ctx.fillRect(x + 4, y + 5, 44, 30);
    ctx.fillStyle = '#536b4d'; ctx.fillRect(x + 23, y + 10, 7, 18);
    ctx.fillStyle = '#668457'; ctx.fillRect(x + 15, y + 7, 14, 8);
    ctx.fillRect(x + 28, y + 13, 12, 8);
  }
  ctx.fillStyle = '#d0c3a1'; ctx.font = '14px monospace'; ctx.fillText('MONSTER GARDEN', 690, 760);
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.translate(Math.round(player.x - camera.x), Math.round(player.y - camera.y));
  const moving = keys.has('KeyW') || keys.has('KeyA') || keys.has('KeyS') || keys.has('KeyD') || keys.has('ArrowUp') || keys.has('ArrowDown') || keys.has('ArrowLeft') || keys.has('ArrowRight');
  const bob = moving && player.dodgeTimer <= 0 ? Math.sin(performance.now() / 90) * 2 : 0;
  ctx.translate(0, bob);
  ctx.fillStyle = '#16191a'; ctx.fillRect(-10, 12, 20, 18);
  ctx.fillStyle = '#314c38'; ctx.fillRect(-14, -2, 28, 22);
  ctx.fillStyle = '#b37d55'; ctx.fillRect(-9, -18, 18, 17);
  ctx.fillStyle = '#493426'; ctx.fillRect(-10, -20, 20, 7);
  ctx.fillStyle = '#2b2e32'; ctx.fillRect(-11, 28, 8, 13); ctx.fillRect(3, 28, 8, 13);
  ctx.fillStyle = '#7a5135'; ctx.fillRect(13, -4, 4, 40);
  if (player.attackTimer > 0) {
    const f = getFacingVector();
    const angle = Math.atan2(f.y, f.x);
    ctx.strokeStyle = '#d9d2b5';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 3, 45, angle - 0.85, angle + 0.85);
    ctx.stroke();
  }
  if (player.dodgeTimer > 0) {
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = '#d8d0b0';
    ctx.fillRect(-22, -25, 44, 65);
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
  ctx.fillStyle = '#ddd6bf'; ctx.font = '10px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${m.name} Lv.${m.level}`, 0, -30);
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
  document.getElementById('gold').textContent = player.gold;
  document.getElementById('seeds').textContent = player.seeds;
}

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

showMessage('Explore the wilds. The garden is waiting.');
updateHud();
requestAnimationFrame(loop);
