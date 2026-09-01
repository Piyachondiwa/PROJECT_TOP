# Monster Garden Systems Completion Plan

This file tracks the remaining integration work for the prototype.

## Runtime
- Keep game.js as the current gameplay loop.
- Optional modules must fail safely when absent.
- Data files remain the source of truth for content.

## Player
- Stats = level + traits + equipment.
- Equipment slots: weapon, armor, accessory.
- Monster food grants traits and unlocks monster skills.

## Garden
- Monster Seed -> Monster Plant -> growth -> harvest -> food.
- Mutation data must be optional and data-driven.
- Growth state must survive save/load.

## World
- Five kingdoms with regional level bands.
- Region travel should be gated by progression.
- Safe zones provide rest and recovery.
- Encounters and resource nodes should use cooldowns.

## Combat
- Basic attack, dodge, skill, elemental advantage.
- Advanced combat supports perfect dodge and counter.
- Future balance values should live outside game.js.

## Content
- Town/NPC/dialogue.
- Shop and quest board.
- Equipment/crafting.
- Dungeon/floor/boss flow.
- Monster collection.

## Assets
- Player sprite sheet will replace the placeholder renderer.
- Monster and plant sprites can be added independently.
- Keep canvas nearest-neighbor rendering for pixel art.

## Final integration pass
1. Wire runtime modules into the actual loop.
2. Verify no duplicate script loading.
3. Verify every keyboard action is blocked by active overlays where appropriate.
4. Verify Save/Load preserves all progression.
5. Run browser smoke tests and fix runtime errors.
6. Tune combat, economy and growth timings.
