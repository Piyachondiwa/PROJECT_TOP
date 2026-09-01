# Runtime Bug Audit

Static audit of the current browser-game source.

## Confirmed risk areas

- `game.js` references global runtime states such as `inventoryState`, `dialogueState`, and `shopState`. These must exist before input handlers run.
- The project has many optional modules loaded before `game.js`; missing or renamed files can stop page execution before the main loop starts.
- `data.js` is the canonical source for element relationships and monster data. Other content modules should not redefine the same globals.
- Save/load crosses multiple systems and must tolerate missing optional state.

## Audit limitation

GitHub source inspection cannot prove browser runtime correctness. A final validation still requires running the page and checking the browser console.

## Current action

Keep the codebase modular, avoid duplicate global declarations, and verify runtime dependencies before declaring a release build.
