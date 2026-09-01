# Monster Garden Integration Notes

Target: connect the existing modular systems into one playable loop without replacing the current prototype unexpectedly.

Priority order:
1. Runtime loading and dependency validation.
2. Town/NPC/shop/quest interactions.
3. Region travel and monster spawning.
4. Garden growth, harvest, food, trait and skill effects.
5. Equipment and crafting state.
6. Dungeon and boss flow.
7. Save all progression state.
8. Pixel sprite and animation pipeline.
9. Final balancing and bug pass.

Implementation rule: prefer small adapter modules over rewriting the core loop. Existing files remain the source of truth until a replacement has been verified.
