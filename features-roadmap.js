// Monster Garden feature roadmap. Data-only planning layer for upcoming integration.
const GAME_FEATURES = Object.freeze({
  combat: ['basic-attack','dodge','counter','monster-skills','element-matchups','status-effects'],
  progression: ['xp','levels','traits','skills','equipment','crafting'],
  garden: ['monster-seeds','growth-stages','harvest','feeding','mutation','hybrid-plants','garden-upgrades'],
  world: ['five-kingdoms','regions','day-night','safe-zones','travel','dungeons','bosses'],
  town: ['npc-dialogue','shop','quest-board','inn','blacksmith'],
  polish: ['sprite-animation','sound','music','save-slots','settings','mobile-controls'],
});

const DEVELOPMENT_ORDER = Object.freeze([
  'core-integration',
  'town-and-npcs',
  'region-travel',
  'advanced-combat',
  'garden-evolution',
  'dungeons-and-bosses',
  'equipment-and-crafting',
  'assets-and-animation',
  'save-and-settings',
  'balance-and-polish',
]);
