// Shared runtime contracts and safe helpers.
// Keeps optional systems interoperable without making game.js depend on every module.
(() => {
  const MG = window.MonsterGarden || {};
  MG.version = MG.version || '0.1.0-prototype';
  MG.safeNumber = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  MG.clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  MG.isOpen = (name) => {
    const state = window[`${name}State`];
    return !!state?.open;
  };
  MG.anyOverlayOpen = () => ['inventory','shop','dialogue','quest','travel'].some(MG.isOpen);
  MG.refreshHud = () => {
    if (typeof window.updateHud === 'function') window.updateHud();
  };
  MG.notify = (text) => {
    if (typeof window.showMessage === 'function') window.showMessage(text);
  };
  window.MonsterGarden = MG;
})();
