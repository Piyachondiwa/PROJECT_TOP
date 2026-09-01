// Quest UI adapter. Keeps quest rendering independent from gameplay loop.
(function () {
  function renderQuestPanel() {
    const panel = document.getElementById('quest-panel');
    const content = document.getElementById('quest-content');
    if (!panel || !content) return;
    const quest = typeof getActiveQuest === 'function' ? getActiveQuest() : null;
    if (!quest) {
      content.textContent = 'No active quest.';
      return;
    }
    const progress = typeof questState === 'object' && questState
      ? (questState.progress?.[quest.id] || 0) : 0;
    content.innerHTML = `<h3>${quest.title}</h3><p>${quest.description}</p><p>Progress: ${Math.min(progress, quest.amount)} / ${quest.amount}</p>`;
  }

  function toggleQuestPanel() {
    const panel = document.getElementById('quest-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) renderQuestPanel();
  }

  window.renderQuestPanel = renderQuestPanel;
  window.toggleQuestPanel = toggleQuestPanel;
})();
