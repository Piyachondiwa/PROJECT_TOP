# Monster Garden Systems Roadmap

Large-system implementation plan. Keep core gameplay modular and data-driven.

## Current direction
- Action RPG combat
- Dark fantasy exploration
- Monster -> Seed -> Monster Plant -> Food -> Trait/Skill
- Five kingdoms and regional progression
- Farming is the central progression loop

## Next integration blocks
1. Town/NPC/dialogue integration
2. Shop/Quest board integration
3. Travel gates and region transitions
4. Equipment and crafting UI
5. Dungeon entrance and boss encounter framework
6. Monster trait/evolution and plant mutation
7. Player sprite/animation pipeline
8. Save all world progression
9. Balance pass and bug pass

## Architecture rule
New content should prefer data files and isolated systems. Core combat, garden, inventory, save, and rendering should not require per-monster hardcoded branches whenever possible.
