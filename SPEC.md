# PLANETX-CONSOLES — SPEC

## What was built

A living two-layer prototype: the voyage of **HLS Aurora** (the beautiful lie) and the **PX-04** observer dashboard (the truth). The crew no longer only reads six screens — they **wake and walk the ship**. The observer sees the same floor plan restained as Site 19. Six PDA/workstation screens each, a curtain toggle that swaps the entire layer (and the materials underfoot), four side-by-side reveal pairs, and study files.

This is design fiction. No figure in the consoles is a real measurement, quotation, or institutional fact.

Space Station 13 was studied as a **grammar**, not a clone: object-oriented rooms, intent verbs, a PDA in the pocket, radio as a log, ID access, systems as machines you walk to, the station as the game. None of the combat, clown, or antagonist loop is here. The antagonist is the experiment.

## Decisions made (and why)

| Decision | Why |
|---|---|
| Destination **Helios Prime**, star **Vesper-4**, ship **HLS Aurora** | Client left destination unnamed. Fictional names avoid real catalogs and agencies. |
| Crew of **24**, six batches of four, **21-day** watches, **72** cycles | 24 ÷ 4 = 6; 72 × 21 = **1,512 days**, so every interval is an integer. |
| Velocity **3.00 c**, distance **12.42 ly** | 3 × 1512 / 365.25 = 12.4189 → 12.42. A round velocity so the lie does arithmetic. |
| Present moment **31 Oct 2031, day 231**, Cycle 11 closing / Cycle 12 arming | 11 × 21 = 231. Handoff is the most loaded instant. |
| Logged-in crew viewer **Jules Moreau (S-21)** | Batch F is waking; the console should address a person, not a role. |
| Research body **Meridian Human Factors Laboratory**, study **PX-04**, site **Site 19** | Invented. No real lab, university, or military mark. |
| Curtain is a physical slide of the crew layer, brass pull on the right | Brief: the toggle is the product; it must feel like pulling a curtain, not a tab. `]` also toggles. |
| Screen index is the correspondence | Voyage↔Study, Systems↔Roster, Wake↔Gantt, Crew↔Detail, Messages↔Anomalies, Brief↔Protocol. Reveal pairs handle semantic “same moment.” |
| Portraits are original geometric marks, not photographs | Avoids living likenesses; the observer version is the same face, greyscale, with an ID. |
| Warm copper accent on the crew side | Brief requires deep blue, warm accent, soft glow. Copper is used only on crew tokens. |
| Type: Source Serif 4 + Source Sans 3 (crew); Archivo + IBM Plex Mono (observer) | Humanist + serif vs grotesque + mono. SIL OFL / Apache (Archivo, Plex). |
| Auth and database off | A self-contained prototype. Protocol “initiate” is local state. |
| Seams findable on a second pass (clock, namesake) with one first-pass thread (Anya’s letter) | Client asked which; second-pass is the default, with one obvious unanswered question as the product beat. |
| Walkable dual deck | SS13’s station-as-game, applied without becoming SS13. One layout, two materializations. |
| Intents Examine / Use / Ask (Inspect / Operate / Flag) | SS13 help/disarm/grab/harm rewritten as epistemic verbs. Ask queues unanswered questions, like Anya’s. |
| Helios PDA holds the original six screens | The kind console is still there; it lives in the pocket, not as the whole world. |
| Command door locked to Jules | Access as story, not grind. Observer: PI office. |
| Original canvas tiles, not SS13 sprites | License and soul: Aurora stays a kind design, not a BYOND clone. |

## Assumptions

- The user experiences this as an interactive prototype, not a Figma file. PNG/PDF export dimensions from the brief are represented as live 1440-class frames and printable study-file pages.
- Astronomical claims (Vesper-4, 12.42 ly, 3 c) are in-world fabrication, not catalog science.
- Cryo, hangar, and “Meridian” are fictional. No real IRB exists for MHF-2030-117.
- Mobile is a stacked, touch-sized version of the same two systems, not a third design.
- WASD / stick walks Jules; click walks a path; E or the on-screen verb interacts.

## Open items requiring the client

- Confirm crew size (24) and destination name (Helios Prime / Vesper-4), or replace.
- Confirm seam difficulty: currently second-pass (06:00 vs 06:49; N. Park) plus one first-pass unanswered query.
- Whether Cycle 12 “initiate” should persist, or remain a session gesture.
- Any real-world print run (letter PDFs at 300 dpi) — the study-file views are print-ready in the browser.

## Placeholder inventory

None in the artifacts. All names, numbers, and letters are in-world. They are fiction; they are not labelled PLACEHOLDER on the crew console (that would break the lie). This file is the disclosure.

## Fonts used + license

| Family | Role | License |
|---|---|---|
| Source Serif 4 | Crew display | SIL OFL 1.1 (Google Fonts) |
| Source Sans 3 | Crew UI | SIL OFL 1.1 (Google Fonts) |
| Archivo | Observer UI | SIL OFL 1.1 (Google Fonts) |
| IBM Plex Mono | Observer data | SIL OFL 1.1 (Google Fonts) |

## Handoff notes for the next builder

- Single source of truth: `src/lib/mission.ts`. Do not type a voyage number in a screen; read it from `VOYAGE`, `FABRICATION`, `CYCLES`, or `CREW`.
- Station map, objects, dual copy: `src/lib/station/world.ts`. Sim: `src/lib/station/sim.ts`. Draw: `src/lib/station/draw.ts`.
- Painted dual floors, Jules walk sheet, crew walk sheet, and dual prop packs live in `public/station/`. Procedural fallback remains if a texture has not loaded.
- Observer staff may walk the command lock (`L` tiles). Crew cannot. Pulling the curtain while inside the PI office returns Jules to the threshold.
- Watch tasks: handover, nightlog, thermal, health, habitat. Completing all five is a session beat, not persistence.
- Two token trees in `src/styles.css` (`crew-*` and `obs-*`). Do not share components across `src/components/crew` and `src/components/observer`.
- Curtain: `src/components/console/ConsoleStage.tsx`. Layer state in `src/lib/store.ts`.
- Deliberate seams are listed in `SEAMS` and in anomalies PX-A-008, PX-A-021, PX-A-033, PX-A-034. Asking the gallery or the letter makes them playable.
- Brand assets live in `public/og.jpg`, `public/favicon.svg`, `src/lib/og/site.json`.
