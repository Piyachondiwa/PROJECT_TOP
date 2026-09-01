/* Central registry for expandable content. */
(() => {
  const registry = window.contentRegistry || {
    monsters: new Set(),
    plants: new Set(),
    npcs: new Set(),
    items: new Set(),
    dungeons: new Set(),
    regions: new Set(),
  };
  window.contentRegistry = registry;

  function sync() {
    for (const id of Object.keys(window.MONSTER_DATA || {})) registry.monsters.add(id);
    for (const id of Object.keys(window.EQUIPMENT_DATA || {})) registry.items.add(id);
    for (const dungeon of window.DUNGEONS || []) registry.dungeons.add(dungeon.id);
    for (const id of Object.keys(window.REGION_DEFINITIONS || {})) registry.regions.add(id);
    for (const npc of window.NPCS || []) registry.npcs.add(npc.id);
    for (const plant of window.PLANT_MUTATIONS || []) registry.plants.add(plant.id);
    return registry;
  }

  window.ContentRegistry = { registry, sync };
})();
