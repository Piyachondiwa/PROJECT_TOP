# Runtime Debug Report

Known source-level checks for Monster Garden.

## Checks
- Runtime script order must load dependencies before `game.js`.
- Planning/document files must not be loaded as `<script>`.
- Player save state must validate numeric values and object collections.
- Runtime modules should tolerate missing optional functions.
- Overlay states should block gameplay input consistently.
- Element calculations should return deterministic multipliers for unknown values.

## Current limitation
GitHub source inspection cannot prove end-to-end browser execution. Browser console/runtime testing is still required for final validation.
