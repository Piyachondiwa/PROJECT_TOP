# Runtime Guard Order

The browser loads classic scripts synchronously, so runtime guards must execute before `game.js` and before any module that can invoke guarded helpers during initialization.

## Current rule
- Data/config first
- Core state and utility guards next
- Gameplay systems
- UI/presentation
- `game.js` last

## Required safeguards
- Optional systems must be checked with `typeof fn === 'function'` before calling.
- Shared state should use `window.MonsterGarden` or a single canonical state object instead of duplicate globals.
- Non-JavaScript planning documents must never be loaded with `<script src>`.
- A module that is only a data registry should not depend on `player` unless it is explicitly loaded after player state exists.

## Verification note
This file documents the runtime contract used during the bug-fix pass; it does not itself execute gameplay logic.
