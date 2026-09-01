// Data-driven monster-derived abilities.
const MONSTER_ABILITY_DATA = Object.freeze({
  goblin: { id:'goblin-rush', name:'Goblin Rush', type:'dash', element:'nature', power:22, cost:8, cooldown:1.1 },
  slime: { id:'ember-burst', name:'Ember Burst', type:'burst', element:'fire', power:28, cost:10, cooldown:1.2 },
  wolf: { id:'predator-dash', name:'Predator Dash', type:'dash-attack', element:'nature', power:34, cost:12, cooldown:1.3 },
  bat: { id:'shadow-bite', name:'Shadow Bite', type:'bite', element:'shadow', power:30, cost:11, cooldown:1.2 },
  rotcap: { id:'spore-cloud', name:'Spore Cloud', type:'area', element:'nature', power:26, cost:13, cooldown:1.5 },
});

function getMonsterAbility(monsterId) { return MONSTER_ABILITY_DATA[monsterId] || null; }
