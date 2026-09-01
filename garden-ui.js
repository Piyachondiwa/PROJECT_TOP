// Garden UI bridge. Keeps interaction/presentation separate from growth logic.
const gardenUiState = window.gardenUiState || {
  selectedPlotId: null,
  selectedMonsterId: null,
};
window.gardenUiState = gardenUiState;

function selectGardenPlot(plotId) {
  gardenUiState.selectedPlotId = Number.isFinite(Number(plotId)) ? Number(plotId) : null;
  if (typeof renderGardenPanel === 'function') renderGardenPanel();
}

function getGardenInteractionText(plot) {
  if (!plot) return 'No plot selected';
  const plant = typeof plantInstances !== 'undefined' ? plantInstances.get(plot.id) : null;
  if (!plant) return 'Plant Monster Seed';
  return plant.stage >= 3 ? 'Harvest Monster Plant' : 'Growing...';
}
