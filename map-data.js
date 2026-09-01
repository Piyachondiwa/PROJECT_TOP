// World map layout data. Rendering can consume this without embedding map design in game.js.

const MAP_DATA = Object.freeze({
  eldoria_fields: {
    id: 'eldoria_fields',
    name: 'Dawn Fields',
    width: 2400,
    height: 1600,
    spawn: { x: 480, y: 360 },
    safeZones: ['starter-camp'],
    exits: [
      { id: 'to-veylthorn', x: 2250, y: 300, w: 100, h: 220, target: 'veylthorn_forest', requiredLevel: 4 },
    ],
  },
  veylthorn_forest: {
    id: 'veylthorn_forest',
    name: 'Whispering Forest',
    width: 2400,
    height: 1600,
    spawn: { x: 180, y: 800 },
    safeZones: [],
    exits: [
      { id: 'to-dravaryn', x: 2240, y: 1120, w: 120, h: 220, target: 'dravaryn_ash', requiredLevel: 8 },
    ],
  },
  dravaryn_ash: {
    id: 'dravaryn_ash',
    name: 'Ashen Valley',
    width: 2400,
    height: 1600,
    spawn: { x: 180, y: 800 },
    safeZones: [],
    exits: [
      { id: 'to-nythrheim', x: 2240, y: 180, w: 120, h: 220, target: 'nythrheim_moor', requiredLevel: 14 },
    ],
  },
  nythrheim_moor: {
    id: 'nythrheim_moor',
    name: 'Black Moor',
    width: 2400,
    height: 1600,
    spawn: { x: 180, y: 780 },
    safeZones: [],
    exits: [
      { id: 'to-aureval', x: 2200, y: 700, w: 160, h: 180, target: 'aureval_wastes', requiredLevel: 22 },
    ],
  },
  aureval_wastes: {
    id: 'aureval_wastes',
    name: 'Frost Wastes',
    width: 2400,
    height: 1600,
    spawn: { x: 180, y: 780 },
    safeZones: [],
    exits: [],
  },
});

function getMapData(regionId) {
  return MAP_DATA[regionId] || MAP_DATA.eldoria_fields;
}

function getRegionExit(regionId, exitId) {
  return getMapData(regionId).exits.find((exit) => exit.id === exitId) || null;
}
