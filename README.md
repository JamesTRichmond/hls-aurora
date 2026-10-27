# HLS Aurora

A walkable station in the grammar of [Space Station 13](https://spacestation13.com/): rooms, intents, a pocket computer, a radio, an ID lock. Not a clone. No combat.

Jules Moreau wakes into the kind fiction of the ship. The brass on the right draws that layer aside and shows the same floor as the study. Both layers are complete. Neither wins.

## This watch

The kindnesses of the watch sit on the wrist. Tap one and Jules walks to it. Stand near someone and they say one line. That line changes as the morning moves: Wake, Walkdown, Midwatch, Quiet hours. The other clock stays forty-nine minutes ahead.

## Rules

- No accounts. No database. Nothing here is a real lab, a real person, or a real measurement.
- The watch is a session. It is not saved. If a save is added later, it stays in `localStorage`.
- Numbers live in `src/lib/mission.ts`. The deck lives in `src/lib/station/`.
- The full design note is `SPEC.md`.

## Check

```
npm run typecheck
npm run lint
npm test
npm run build
```
