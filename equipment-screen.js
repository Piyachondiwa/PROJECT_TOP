// Equipment screen foundation for Monster Garden.
// Keeps UI state separate from equipment gameplay data.

const equipmentScreenState = window.equipmentScreenState || {
  open: false,
};
window.equipmentScreenState = equipmentScreenState;

function toggleEquipmentScreen() {
  equipmentScreenState.open = !equipmentScreenState.open;
  renderEquipmentScreen();
}

function closeEquipmentScreen() {
  equipmentScreenState.open = false;
  renderEquipmentScreen();
}

function renderEquipmentScreen(targetId = 'inventory-content') {
  const target = document.getElementById(targetId);
  if (!target) return;

  const equipped = typeof getEquippedItems === 'function' ? getEquippedItems() : [];
  const bySlot = { weapon: null, armor: null, accessory: null };
  for (const item of equipped) bySlot[item.slot] = item;

  const rows = ['weapon', 'armor', 'accessory'].map((slot) => {
    const item = bySlot[slot];
    return `<div class="item-row"><span>${slot}</span><b>${item?.name || 'Empty'}</b></div>`;
  }).join('');

  target.insertAdjacentHTML('beforeend', `
    <div class="inventory-section equipment-section ${equipmentScreenState.open ? '' : 'hidden'}">
      <h3>EQUIPMENT</h3>
      ${rows}
    </div>
  `);
}
