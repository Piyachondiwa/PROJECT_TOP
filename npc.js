// Data-driven NPC foundation for the first town.
const NPC_DATA = Object.freeze({
  mira: {
    id: 'mira', name: 'Mira', role: 'Seed Merchant',
    x: 500, y: 310, color: '#c78f6e',
    dialogue: [
      'The forest changes every night.',
      'Bring me strange seeds and I will find a use for them.'
    ],
    shopId: 'starter-seeds',
  },
  elian: {
    id: 'elian', name: 'Elian', role: 'Adventurer',
    x: 570, y: 320, color: '#8094ad',
    dialogue: [
      'Monsters do not always leave corpses behind.',
      'Sometimes they leave seeds. That is why the old gardeners fear them.'
    ],
  },
  nera: {
    id: 'nera', name: 'Nera', role: 'Quest Keeper',
    x: 430, y: 320, color: '#8f7ba5',
    dialogue: [
      'The road east has become dangerous.',
      'If you can survive the fields, there may be work waiting beyond them.'
    ],
    questBoard: true,
  },
});

const TOWN_DATA = Object.freeze({
  eldoria-town: {
    id: 'eldoria-town', name: 'Dawnreach', kingdomId: 'eldoria',
    safe: true,
    bounds: { x: 330, y: 220, w: 310, h: 250 },
    npcs: ['mira', 'elian', 'nera'],
  },
});

const npcState = window.npcState || { dialogueNpcId: null };
window.npcState = npcState;

function getTownData(id = 'eldoria-town') { return TOWN_DATA[id] || null; }
function getNpcsForTown(id = 'eldoria-town') {
  const town = getTownData(id);
  return town ? town.npcs.map((npcId) => NPC_DATA[npcId]).filter(Boolean) : [];
}
