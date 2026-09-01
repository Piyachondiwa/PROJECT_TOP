// Runtime-safe accessibility helpers.
(() => {
  const MG = window.MonsterGarden = window.MonsterGarden || {};
  MG.setPanelHidden = (id, hidden) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !!hidden);
  };
  MG.focusPanel = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
})();
