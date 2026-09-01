# Critical Runtime Audit

## Findings from source inspection

1. `game.js` directly references several global states/functions (`inventoryState`, `dialogueState`, `shopState`, garden/quest/save helpers). These must exist before `game.js` executes.
2. `index.html` now places `game.js` last, which is correct for those globals, but browser execution is still required to prove every dependency is present.
3. `game.js` currently creates its monster array from `Object.values(MONSTER_DATA)` and only has three spawn coordinates. The modulo reuse is safe for array length, but multiple monsters can share spawn points as content grows.
4. `game.js` uses fixed combat constants instead of `COMBAT_TUNING`, so the tuning module does not yet control live combat.
5. The basic attack uses `ELEMENTS.ARCANE`, which means normal attacks can bypass the intended physical/element interaction model.
6. Monster movement has no world-region boundary check, so chased monsters can leave their intended encounter area.
7. `worldTime` advances locally but is not yet clearly synchronized with world-event systems from the inspected core.
8. A browser runtime pass is still required for uncaught exceptions, missing globals, and UI event collisions.

## Severity

- High: dependency/runtime validation, normal attack element model.
- Medium: combat tuning not wired, monster region bounds.
- Low: spawn distribution as content count grows.

Do not mark the project bug-free until browser execution confirms startup and the core loop.
