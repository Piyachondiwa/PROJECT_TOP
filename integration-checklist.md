# Monster Garden Integration Checklist

Use this checklist when connecting the modular systems into the playable runtime.

## Runtime
- [ ] All runtime scripts are loaded in dependency order.
- [ ] Documentation files are never loaded as scripts.
- [ ] Duplicate runtime scripts are avoided.

## Gameplay
- [ ] Town and NPC interactions block combat while open.
- [ ] Shop purchases update gold and inventory.
- [ ] Quest progress updates from real gameplay events.
- [ ] Region travel updates the active region and spawn rules.
- [ ] Garden harvest feeds Monster Food and Trait/Skill effects.
- [ ] Equipment bonuses affect player stats.
- [ ] Crafting consumes real materials and grants real items.
- [ ] Dungeon entry and boss states are playable.

## Persistence
- [ ] Save/load includes player progression.
- [ ] Save/load includes garden growth.
- [ ] Save/load includes quest progress.
- [ ] Save/load includes unlocked regions and dungeons.
- [ ] Save/load includes equipment and collection state.

## Assets
- [ ] Player sprite sheet is wired to the animation controller.
- [ ] Monster sprites replace placeholder shapes.
- [ ] Garden sprites replace placeholder shapes.
- [ ] World tiles and town art are wired into the renderer.

## Polish
- [ ] Dodge has clear invulnerability timing.
- [ ] Counter has a readable timing window.
- [ ] Elemental damage numbers and feedback are clear.
- [ ] UI handles keyboard and mouse safely.
- [ ] Runtime error checks report failures without stopping the whole game.
