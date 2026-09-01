const inventoryState = window.inventoryState || { open: false, selectedFoodId: null };
window.inventoryState = inventoryState;

function countItems(items) {
  return Object.values(items || {}).reduce((sum, count) => sum + Math.max(0, Number(count) || 0), 0);
}

function getFoodIds() {
  return Object.entries(player.foods || {}).filter(([, count]) => Number(count) > 0).map(([id]) => id);
}

function getSelectedFoodId() {
  const foods = getFoodIds();
  if (!foods.length) { inventoryState.selectedFoodId = null; return null; }
  if (!inventoryState.selectedFoodId || !foods.includes(inventoryState.selectedFoodId)) inventoryState.selectedFoodId = foods[0];
  return inventoryState.selectedFoodId;
}

function getTraitIds() {
  return Object.keys(player.activeTraits || {}).filter((id) => Boolean(MONSTER_DATA[id]));
}

function eatSelectedFood() {
  const foodId = getSelectedFoodId();
  if (!foodId) { showMessage('No Monster Food.'); return false; }
  const monster = MONSTER_DATA[foodId];
  if (!monster) {
    delete player.foods[foodId];
    inventoryState.selectedFoodId = null;
    renderInventory();
    return false;
  }

  player.foods[foodId] -= 1;
  if (player.foods[foodId] <= 0) delete player.foods[foodId];

  const heal = Math.max(1, monster.level * 7);
  player.hp = Math.min(player.maxHp, player.hp + heal);
  player.activeTraits = player.activeTraits || {};
  player.activeTraits[foodId] = { name: monster.trait, description: monster.traitDescription };
  player.unlockedSkillIds = player.unlockedSkillIds instanceof Set ? player.unlockedSkillIds : new Set(['ember-burst']);
  if (monster.skill) player.unlockedSkillIds.add(monster.skill.id);

  showMessage(`Ate ${monster.name} Plant • ${monster.trait}`);
  inventoryState.selectedFoodId = getFoodIds()[0] || null;
  renderInventory();
  updateHud();
  return true;
}

function cycleFoodSelection(direction = 1) {
  const foods = getFoodIds();
  if (!foods.length) { inventoryState.selectedFoodId = null; renderInventory(); return; }
  const current = Math.max(0, foods.indexOf(getSelectedFoodId()));
  inventoryState.selectedFoodId = foods[(current + direction + foods.length) % foods.length];
  renderInventory();
}

function renderInventory() {
  const panel = document.getElementById('inventory');
  const content = document.getElementById('inventory-content');
  if (!panel || !content) return;

  const seeds = Object.entries(player.seeds || {}).filter(([, count]) => Number(count) > 0);
  const foods = getFoodIds();
  const selected = getSelectedFoodId();
  const traitIds = getTraitIds();

  const seedHtml = seeds.length
    ? seeds.map(([id, count]) => `<div class="item-row"><span>${MONSTER_DATA[id]?.seedName || id}</span><b>x${count}</b></div>`).join('')
    : '<div class="empty">No Monster Seeds</div>';

  const foodHtml = foods.length
    ? foods.map((id) => {
        const monster = MONSTER_DATA[id];
        const cls = id === selected ? ' selected' : '';
        return `<button class="item-row food-item${cls}" data-food-id="${id}" type="button"><span>${monster?.name || id}</span><b>x${player.foods[id]}</b></button>`;
      }).join('')
    : '<div class="empty">No Monster Food</div>';

  const traitHtml = traitIds.length
    ? traitIds.map((id) => `<div class="trait-card"><b>${MONSTER_DATA[id].trait}</b><span>${MONSTER_DATA[id].traitDescription}</span></div>`).join('')
    : '<div class="empty">No active monster traits</div>';

  content.innerHTML = `
    <div class="inventory-section"><h3>MONSTER SEEDS</h3>${seedHtml}</div>
    <div class="inventory-section"><h3>MONSTER FOOD</h3>${foodHtml}</div>
    <div class="inventory-section"><h3>ACTIVE TRAITS</h3>${traitHtml}</div>
  `;

  content.querySelectorAll('[data-food-id]').forEach((button) => {
    button.addEventListener('click', () => {
      inventoryState.selectedFoodId = button.dataset.foodId;
      renderInventory();
    });
  });

  panel.classList.toggle('hidden', !inventoryState.open);
}

function toggleInventory() {
  inventoryState.open = !inventoryState.open;
  renderInventory();
}

function getTotalFoodCount() {
  return countItems(player.foods);
}
