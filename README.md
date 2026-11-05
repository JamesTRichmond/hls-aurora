# HLS Aurora

<!-- portfolio summary -->
> **Portfolio summary.** A walkable space-station prototype with two complete layers over one floor: the crew's comforting fiction, and the observer's truth. Interactive design fiction built on a production-grade full-stack scaffold.
>
> **Stack:** TypeScript · React · TanStack Start / Router / Query · Tailwind + Radix UI · Zod · Kysely with Postgres (PGlite locally) · better-auth · node:test · Playwright · ESLint/Prettier
>
> **Notable engineering:** all mission numbers derive from one module so the fiction's arithmetic stays consistent (24 crew, 21-day watches, 72 cycles); the design note in [SPEC.md](SPEC.md) records every decision with its reason; typecheck, lint, test and build gates.

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
