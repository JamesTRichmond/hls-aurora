# HLS Aurora

A walkable two-layer narrative prototype. Crew member Jules Moreau wakes aboard a kind, orderly starship. A brass pull on the right draws that layer aside and shows the same floor plan as the research site that is actually running the voyage. Both layers are complete, and neither wins.

It borrows the grammar of [Space Station 13](https://spacestation13.com/) (rooms, intent verbs, a pocket computer, radio as a log, ID-locked doors) without the combat. The antagonist is the experiment. Everything in it is fiction: no real lab, person, or measurement.

## What a player can do

- Walk the deck with WASD, a stick, or click-to-path. Examine, Use, or Ask anything nearby.
- Tap a kindness on the wrist watch and Jules walks to it. People nearby say one line, and the line changes as the watch moves through Wake, Walkdown, Midwatch and Quiet hours.
- Pull the curtain (or press `]`) to swap the whole layer, including the materials underfoot, between the crew console and the observer dashboard.
- Watch the seam: every twelve ship-minutes the facility clock takes a minute the crew never lives. If a letter hasn't been read by then, its last line is cut, and the study records the cut.
- Leave and come back. Progress, position and the clocks are kept in a versioned `localStorage` save, and an unknown save version is refused.

## How it's built

| Area | Choice |
| --- | --- |
| App | TanStack Start (React 19, file-based routing, server functions) on Vite, TypeScript throughout |
| Game | Plain TypeScript modules for the watch, seam, letter and save (`src/game/`), plus a canvas tile renderer and simulation (`src/lib/station/`) |
| UI | Tailwind 4 and Radix primitives. Original geometric portraits and tiles, no borrowed sprites |
| Server stack | Ships with better-auth, Kysely, and Postgres (PGlite locally) with SQL migrations. **Auth and database are switched off for this prototype on purpose.** The flag is checked so dev and build can't disagree (`npm run check:auth`) |
| Tests | Node's built-in test runner for game logic, auth gating, migrations and build scripts, plus a Playwright browser smoke test |

The design reasoning, numbers and assumptions are in [SPEC.md](SPEC.md). Mission constants live in `src/lib/mission.ts`.

## Run it

```sh
npm ci
npm run dev        # http://localhost:8080
```

Checks:

```sh
npm run typecheck
npm run lint
node --experimental-strip-types --test src/game/*.test.ts   # game logic
npm test           # everything, including host-template checks
npm run build
```

`npm test` also runs checks from the hosting template that expect that platform's environment file. Outside that host, a handful of those template checks fail. The game tests don't depend on it.
