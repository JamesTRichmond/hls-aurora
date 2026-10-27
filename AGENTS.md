# HLS Aurora

SS13 is the grammar, not the game. Rooms, intents, a PDA, radio, ID. No combat.

- Do not add accounts or a database.
- If play is saved, keep it in localStorage and migrate old saves. Do not invent a server store.
- Do not type voyage numbers into screens. Read `src/lib/mission.ts`.
- Crew and observer stay two skins of the same tiles. Do not share their components.
- The wrist lists this watch. A tap walks to the thing. People nearby speak a line that changes with the phase.
- Verify with `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
