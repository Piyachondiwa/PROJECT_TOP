// Equipment UI module. Safe when the equipment panel is not present.
function getEquipmentSlotSummary() {
  if (typeof equipmentState === 'undefined') return [];
  return Object.entries(equipmentState.equipped || {}).map(([slot, id]) => ({
    slot,
    item: id && typeof EQUIPMENT_DATA !== 'undefined' ? EQUIPMENT_DATA[id] || null : null,
  }));
}

function renderEquipmentSummary(targetId = 'inventory-content') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const rows = getEquipmentSlotSummary();
  target.insertAdjacentHTML('beforeend', `
    <div class="inventory-section">
      <h3>EQUIPMENT</h3>
      ${rows.map((row) => `<div class="item-row"><span>${row.slot}</span><b>${row.item?.name || 'Empty'}</b></div>`).join('')}
    </div>
  `);
}
