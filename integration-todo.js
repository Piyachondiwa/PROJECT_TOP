// Final integration checklist kept as runtime-safe data only.
const INTEGRATION_TODO = Object.freeze({
  core: ['player', 'combat', 'garden', 'inventory', 'save'],
  world: ['town', 'travel', 'regions', 'events'],
  progression: ['quests', 'equipment', 'crafting', 'collection'],
  endgame: ['dungeons', 'bosses', 'plant-mutation'],
  presentation: ['sprite', 'animation', 'audio', 'feedback'],
});
window.MonsterGarden = window.MonsterGarden || {};
window.MonsterGarden.integrationTodo = INTEGRATION_TODO;
