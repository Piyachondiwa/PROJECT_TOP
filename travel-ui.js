// Lightweight world travel UI. Requires kingdoms.js and a DOM container with id="travel".
const travelState = window.travelState || { open: false };
window.travelState = travelState;

function getTravelRegions() {
  return Object.values(REGION_DEFINITIONS || {});
}

function openTravel() {
  travelState.open = true;
  renderTravel();
}

function closeTravel() {
  travelState.open = false;
  renderTravel();
}

function renderTravel() {
  const panel = document.getElementById('travel');
  const content = document.getElementById('travel-content');
  if (!panel || !content) return;
  const current = getCurrentRegion();
  content.innerHTML = getTravelRegions().map((region) => {
    const unlocked = isRegionUnlocked(region.id);
    const active = region.id === current.id;
    const label = active ? 'Current' : unlocked ? 'Travel' : `Lv.${region.levelMin}`;
    return `<button class="shop-item${active ? ' selected' : ''}" data-region-id="${region.id}" ${!unlocked || active ? 'disabled' : ''} type="button"><span>${region.name}</span><b>${label}</b></button>`;
  }).join('');
  content.querySelectorAll('[data-region-id]').forEach((button) => {
    button.addEventListener('click', () => {
      if (travelToRegion(button.dataset.regionId)) renderTravel();
    });
  });
  panel.classList.toggle('hidden', !travelState.open);
}

function toggleTravel() {
  travelState.open ? closeTravel() : openTravel();
}
