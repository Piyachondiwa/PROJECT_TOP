// Shared runtime state helpers. Keeps cross-system state names predictable.
(function () {
  window.MG = window.MG || {};

  function ensureObject(owner, key) {
    if (!owner[key] || typeof owner[key] !== 'object' || Array.isArray(owner[key])) owner[key] = {};
    return owner[key];
  }

  function ensureCoreState() {
    if (typeof player === 'undefined') return false;
    ensureObject(player, 'seeds');
    ensureObject(player, 'foods');
    ensureObject(player, 'activeTraits');
    ensureObject(player, 'materials');
    if (!(player.unlockedSkillIds instanceof Set)) player.unlockedSkillIds = new Set(['ember-burst']);
    if (!Number.isFinite(player.gold)) player.gold = 0;
    return true;
  }

  window.MG.ensureCoreState = ensureCoreState;
  window.MG.ensureObject = ensureObject;
})();
