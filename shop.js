// Minimal shop system. The shop is intentionally data-driven.
const SHOP_DATA = Object.freeze({
  moonleaf: { id: 'moonleaf', name: 'Moonleaf Seed', type: 'seed', price: 18 },
  emberroot: { id: 'emberroot', name: 'Ember Root Seed', type: 'seed', price: 28 },
  frostbloom: { id: 'frostbloom', name: 'Frost Bloom Seed', type: 'seed', price: 35 },
});

const shopState = { open: false };

function openShop() { shopState.open = true; renderShop(); }
function closeShop() { shopState.open = false; renderShop(); }
function toggleShop() { shopState.open ? closeShop() : openShop(); }

function buyShopItem(id) {
  const item = SHOP_DATA[id];
  if (!item) return false;
  if (player.gold < item.price) { showMessage('Not enough Gold.'); return false; }
  player.gold -= item.price;
  if (item.type === 'seed') player.seeds[item.seedId || id] = (player.seeds[item.seedId || id] || 0) + 1;
  renderShop();
  updateHud();
  showMessage(`Bought ${item.name}.`);
  return true;
}

function renderShop() {
  const panel = document.getElementById('shop');
  const content = document.getElementById('shop-content');
  if (!panel || !content) return;
  content.innerHTML = Object.values(SHOP_DATA).map((item) => `
    <button class="shop-item" data-shop-id="${item.id}" type="button">
      <span>${item.name}</span><b>${item.price} G</b>
    </button>
  `).join('');
  content.querySelectorAll('[data-shop-id]').forEach((button) => {
    button.addEventListener('click', () => buyShopItem(button.dataset.shopId));
  });
  panel.classList.toggle('hidden', !shopState.open);
}
