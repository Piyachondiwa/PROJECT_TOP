// Region-facing content registry. Safe to expand without changing the map runtime.

const REGION_CONTENT = Object.freeze({
  eldoria_fields: {
    title: 'Dawn Fields',
    ambience: 'quiet frontier',
    safe: true,
    recommendedLevel: [1, 6],
    encounters: ['goblin', 'wolf', 'slime'],
    resources: ['moonleaf'],
  },
  veylthorn_forest: {
    title: 'Whispering Forest',
    ambience: 'cursed woodland',
    safe: false,
    recommendedLevel: [4, 10],
    encounters: ['bat', 'rotcap'],
    resources: ['cursed-root'],
  },
  dravaryn_ash: {
    title: 'Ashen Valley',
    ambience: 'volcanic wasteland',
    safe: false,
    recommendedLevel: [8, 16],
    encounters: [],
    resources: ['ash-crystal'],
  },
  nythrheim_moor: {
    title: 'Black Moor',
    ambience: 'night-soaked marsh',
    safe: false,
    recommendedLevel: [14, 24],
    encounters: [],
    resources: ['grave-bloom'],
  },
  aureval_wastes: {
    title: 'Frost Wastes',
    ambience: 'frozen ruins',
    safe: false,
    recommendedLevel: [22, 32],
    encounters: [],
    resources: ['frost-herb'],
  },
});

function getRegionContent(regionId) {
  return REGION_CONTENT[regionId] || null;
}

function getRegionRecommendedLevel(regionId) {
  const region = REGION_CONTENT[regionId];
  return region?.recommendedLevel || [1, 1];
}
