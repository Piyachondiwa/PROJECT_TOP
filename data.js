// Monster Garden data-driven content.
// Add monsters, seeds, traits and skills here without changing core systems.

const ELEMENTS = Object.freeze({
  FIRE: 'fire', WATER: 'water', LIGHTNING: 'lightning', EARTH: 'earth',
  NATURE: 'nature', ICE: 'ice', SHADOW: 'shadow', LIGHT: 'light', ARCANE: 'arcane',
});

const ELEMENT_ADVANTAGE = Object.freeze({
  fire: 'nature',
  nature: 'earth',
  earth: 'lightning',
  lightning: 'water',
  water: 'fire',
  ice: 'nature',
  light: 'shadow',
  shadow: 'light',
  arcane: null,
});

const MONSTER_DATA = Object.freeze({
  goblin: {
    id: 'goblin', name: 'Goblin', element: ELEMENTS.NATURE,
    baseHp: 45, level: 2, speed: 55, seedName: 'Goblin Seed',
    trait: 'Scavenger', traitDescription: 'Improves material drop chance.',
    traitEffects: { dropRate: 0.10 },
    skill: { id: 'goblin-rush', name: 'Goblin Rush', cost: 8, power: 22, element: ELEMENTS.NATURE },
    color: '#778c58',
  },
  slime: {
    id: 'slime', name: 'Fire Slime', element: ELEMENTS.FIRE,
    baseHp: 55, level: 3, speed: 38, seedName: 'Fire Slime Seed',
    trait: 'Ember Skin', traitDescription: 'Reduces fire damage taken.',
    traitEffects: { fireResistance: 0.20 },
    skill: { id: 'ember-burst', name: 'Ember Burst', cost: 10, power: 28, element: ELEMENTS.FIRE },
    color: '#a86d4b',
  },
  wolf: {
    id: 'wolf', name: 'Wolf', element: ELEMENTS.NATURE,
    baseHp: 65, level: 4, speed: 75, seedName: 'Wolf Seed',
    trait: 'Predator', traitDescription: 'Increases movement speed.',
    traitEffects: { moveSpeed: 0.15 },
    skill: { id: 'predator-dash', name: 'Predator Dash', cost: 12, power: 34, element: ELEMENTS.NATURE },
    color: '#77746f',
  },
});

const KINGDOMS = Object.freeze([
  { id: 'eldoria', name: 'Eldoria', subtitle: 'Kingdom of Dawn', element: ELEMENTS.LIGHT },
  { id: 'veylthorn', name: 'Veylthorn', subtitle: 'Cursed Verdant Realm', element: ELEMENTS.NATURE },
  { id: 'dravaryn', name: 'Dravaryn', subtitle: 'Kingdom of Ash', element: ELEMENTS.FIRE },
  { id: 'nythrheim', name: 'Nythrheim', subtitle: 'Kingdom of Night', element: ELEMENTS.SHADOW },
  { id: 'aureval', name: 'Aureval', subtitle: 'Frozen Crown', element: ELEMENTS.ICE },
]);

function getElementMultiplier(attacker, defender) {
  if (!attacker || !defender) return 1;
  if (ELEMENT_ADVANTAGE[attacker] === defender) return 1.5;
  if (ELEMENT_ADVANTAGE[defender] === attacker) return 0.75;
  return 1;
}
