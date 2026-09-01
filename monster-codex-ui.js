// Monster Codex UI foundation.
// Reads collection data without owning collection state.

function getMonsterCollectionRows(collection = window.monsterCollectionState || {}) {
  return Object.entries(collection).map(([monsterId, entry]) => ({
    monsterId,
    discovered: !!entry?.discovered,
    defeated: Math.max(0, Number(entry?.defeated) || 0),
    maxLevel: Math.max(0, Number(entry?.maxLevel) || 0),
  }));
}

function renderMonsterCodex(targetId = 'inventory-content') {
  const target = document.getElementById(targetId);
  if (!target) return;
  const rows = getMonsterCollectionRows();
  const content = rows.length
    ? rows.map((row) => `<div class="item-row"><span>${row.monsterId}</span><b>${row.discovered ? `Defeated ${row.defeated} • Lv.${row.maxLevel}` : 'Undiscovered'}</b></div>`).join('')
    : '<div class="item-row"><span>Codex</span><b>No discoveries yet.</b></div>';
  target.insertAdjacentHTML('beforeend', `
    <div class="inventory-section codex-section">
      <h3>MONSTER CODEX</h3>
      ${content}
    </div>
  `);
}
