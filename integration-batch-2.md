# Integration Batch 2

This batch prepares the next playable integration pass for Monster Garden.

## Targets
- Town interaction state
- Shop / Quest panel coordination
- Region travel gating
- Garden harvest and food flow
- Dungeon and boss state
- Save-state ownership

## Rule
Existing runtime modules remain the source of truth. New adapters must be optional and defensive.

## Done in this batch
- Defined shared interaction-state ownership.
- Defined travel transition payloads.
- Defined dungeon result payloads.
- Defined harvest result payloads.
- Defined save-state sections.

## Next
Wire these contracts into runtime after the current module dependencies are verified.
