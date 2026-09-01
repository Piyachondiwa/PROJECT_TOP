// Boss encounter state and phase helpers.
const bossEncounterState = window.bossEncounterState || { activeBossId: null, hp: 0, maxHp: 0, phase: 1 };
window.bossEncounterState = bossEncounterState;

function getBossDefinition(id) {
  return (typeof BOSS_DATA !== 'undefined' && BOSS_DATA[id]) || null;
}

function startBossEncounter(id) {
  const boss = getBossDefinition(id);
  if (!boss) return false;
  bossEncounterState.activeBossId = id;
  bossEncounterState.maxHp = Math.max(1, Number(boss.hp) || 1);
  bossEncounterState.hp = bossEncounterState.maxHp;
  bossEncounterState.phase = 1;
  if (typeof showMessage === 'function') showMessage(`${boss.name} awakens.`);
  return true;
}

function getBossPhase() {
  const boss = getBossDefinition(bossEncounterState.activeBossId);
  if (!boss) return 0;
  const hpRatio = bossEncounterState.hp / Math.max(1, bossEncounterState.maxHp);
  const thresholds = Array.isArray(boss.phases) ? boss.phases : [];
  let phase = 1;
  thresholds.forEach((threshold, index) => {
    if (hpRatio <= Number(threshold.hpRatio)) phase = index + 2;
  });
  bossEncounterState.phase = phase;
  return phase;
}

function damageActiveBoss(amount) {
  if (!bossEncounterState.activeBossId) return false;
  bossEncounterState.hp = Math.max(0, bossEncounterState.hp - Math.max(0, Number(amount) || 0));
  getBossPhase();
  if (bossEncounterState.hp <= 0) endBossEncounter(true);
  return true;
}

function endBossEncounter(victory = false) {
  const id = bossEncounterState.activeBossId;
  bossEncounterState.activeBossId = null;
  bossEncounterState.hp = 0;
  bossEncounterState.maxHp = 0;
  bossEncounterState.phase = 1;
  if (victory && typeof showMessage === 'function') showMessage(`Boss defeated.`);
  if (victory && typeof advanceQuest === 'function') advanceQuest('boss', id, 1);
}
