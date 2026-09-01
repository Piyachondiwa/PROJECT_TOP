// Large world map definition for Monster Garden.
// Keeps region layout separate from the runtime loop.
const WORLD_MAP = Object.freeze({
  width: 4800,
  height: 3200,
  regions: {
    eldoria_fields: { x: 0, y: 0, w: 1600, h: 1500, color: '#4a5a47' },
    veylthorn_forest: { x: 1600, y: 0, w: 1400, h: 1600, color: '#33453a' },
    dravaryn_ash: { x: 3000, y: 0, w: 1800, h: 1500, color: '#57443e' },
    nythrheim_moor: { x: 1200, y: 1500, w: 1800, h: 1700, color: '#303243' },
    aureval_wastes: { x: 3000, y: 1500, w: 1800, h: 1700, color: '#4a5960' },
  },
  gates: [
    { from: 'eldoria_fields', to: 'veylthorn_forest', x: 1580, y: 700, w: 40, h: 140 },
    { from: 'veylthorn_forest', to: 'dravaryn_ash', x: 2980, y: 700, w: 40, h: 140 },
    { from: 'eldoria_fields', to: 'nythrheim_moor', x: 900, y: 1480, w: 140, h: 40 },
    { from: 'dravaryn_ash', to: 'aureval_wastes', x: 3900, y: 1480, w: 140, h: 40 },
  ],
});

function getMapRegion(id) { return WORLD_MAP.regions[id] || null; }
function getRegionCenter(id) {
  const region = getMapRegion(id);
  if (!region) return { x: 0, y: 0 };
  return { x: region.x + region.w / 2, y: region.y + region.h / 2 };
}
