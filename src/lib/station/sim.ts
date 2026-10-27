import { crewLetter, obsLetter } from "@/game/letter";
import { seamClocks } from "@/game/seam";
import { VIEWER, VOYAGE } from "@/lib/mission";
import {
  MAP_H,
  MAP_W,
  NPCS,
  SPAWN,
  THINGS,
  TILES,
  crewOf,
  floorWalkable,
  isWall,
  roomAt,
  type Intent,
  type NpcSpec,
  type Thing,
} from "@/lib/station/world";

export type Layer = "crew" | "observer";

export type Focus =
  | { type: "thing"; id: string }
  | { type: "npc"; id: string }
  | null;

export type RadioLine = {
  id: string;
  t: number;
  channel: string;
  speaker: string;
  text: string;
  layer: Layer | "both";
};

export type NpcLive = NpcSpec & {
  px: number;
  py: number;
  facing: number;
  roamI: number;
  wait: number;
};

export type WatchPhaseId = "wake" | "walkdown" | "midwatch" | "quiet";

export type WatchPhase = {
  id: WatchPhaseId;
  crew: string;
  obs: string;
};

export type NearbyItem = {
  type: "thing" | "npc";
  id: string;
  crewName: string;
  obsName: string;
  dist: number;
};

const SPEED = 3.15;
const NPC_SPEED = 0.85;

const PHASES: { id: WatchPhaseId; until: number; crew: string; obs: string }[] = [
  { id: "wake", until: 90, crew: "Wake", obs: "Open-state" },
  { id: "walkdown", until: 240, crew: "Walkdown", obs: "Floor" },
  { id: "midwatch", until: 480, crew: "Midwatch", obs: "Mid-session" },
  { id: "quiet", until: Infinity, crew: "Quiet hours", obs: "Hold" },
];

const keys = new Set<string>();
let touchX = 0;
let touchY = 0;
let qaKeys: string[] | null = null;

export const sim = {
  x: SPAWN.x,
  y: SPAWN.y,
  facing: SPAWN.facing,
  speed: 0,
  path: [] as { x: number; y: number }[],
  npcs: NPCS.map((n) => ({
    ...n,
    px: n.x,
    py: n.y,
    facing: Math.PI,
    roamI: 0,
    wait: 0.6 + Math.random() * 2,
  })) as NpcLive[],
  time: 0,
  last: 0,
  booted: false,
  radioSeq: 0,
  layer: "crew" as Layer,
  phaseId: "wake" as WatchPhaseId,
  phaseShift: null as WatchPhase | null,
  seamSeen: 0,
  seamPulse: 0,
};

/** 8× play time. Ship starts 06:00. Facility starts 49 minutes ahead and gains a minute at each seam. */
export function liveWatch() {
  const cut = seamClocks(sim.time);
  const play = sim.time;
  const phase = PHASES.find((p) => play < p.until) ?? PHASES[PHASES.length - 1]!;
  return {
    ship: cut.ship,
    facility: cut.facility,
    seams: cut.seams,
    gapMin: cut.gapMin,
    seamOpen: cut.open,
    phase: { id: phase.id, crew: phase.crew, obs: phase.obs } as WatchPhase,
  };
}

export function nearbyList(max = 2.15, cap = 5): NearbyItem[] {
  const rows: NearbyItem[] = [];
  for (const t of THINGS) {
    const dist = Math.hypot(t.x + 0.5 - sim.x, t.y + 0.5 - sim.y);
    if (dist > max) continue;
    rows.push({
      type: "thing",
      id: t.id,
      crewName: t.crewName,
      obsName: t.obsName,
      dist,
    });
  }
  for (const n of sim.npcs) {
    const dist = Math.hypot(n.px - sim.x, n.py - sim.y);
    if (dist > max) continue;
    const person = crewOf(n.id);
    rows.push({
      type: "npc",
      id: n.id,
      crewName: person.given,
      obsName: person.id,
      dist,
    });
  }
  rows.sort((a, b) => a.dist - b.dist);
  return rows.slice(0, cap);
}

function solidAt(x: number, y: number): boolean {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (ty < 0 || ty >= MAP_H || tx < 0 || tx >= MAP_W) return true;
  const ch = TILES[ty]![tx]!;
  if (isWall(ch)) return true;
  if (ch === "L" && sim.layer !== "observer") return true;
  const thing = THINGS.find((t) => t.solid && t.x === tx && t.y === ty);
  if (thing) {
    const dx = x - (thing.x + 0.5);
    const dy = y - (thing.y + 0.5);
    if (dx * dx + dy * dy < 0.18) return true;
  }
  return !floorWalkable(ch);
}

function blocked(x: number, y: number, r = 0.22): boolean {
  return (
    solidAt(x - r, y) ||
    solidAt(x + r, y) ||
    solidAt(x, y - r) ||
    solidAt(x, y + r) ||
    solidAt(x - r * 0.7, y - r * 0.7) ||
    solidAt(x + r * 0.7, y + r * 0.7)
  );
}

function tryMove(ent: { x: number; y: number }, dx: number, dy: number) {
  const nx = ent.x + dx;
  const ny = ent.y + dy;
  if (!blocked(nx, ny)) {
    ent.x = nx;
    ent.y = ny;
    return;
  }
  if (!blocked(nx, ent.y)) {
    ent.x = nx;
    return;
  }
  if (!blocked(ent.x, ny)) {
    ent.y = ny;
  }
}

/** Restores the lived watch. A null place stays at spawn. A place inside a wall is refused. */
export function applyWatchPlace(place: {
  simTime: number;
  x: number | null;
  y: number | null;
  facing: number | null;
}) {
  sim.time = place.simTime;
  sim.seamSeen = seamClocks(place.simTime).seams;
  sim.seamPulse = 0;
  sim.last = 0;
  if (place.x == null || place.y == null) return;
  if (blocked(place.x, place.y)) return;
  sim.x = place.x;
  sim.y = place.y;
  if (place.facing != null) sim.facing = place.facing;
}

function neighbors(tx: number, ty: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dx, dy] of dirs) {
    const nx = tx + dx;
    const ny = ty + dy;
    if (ny < 0 || ny >= MAP_H || nx < 0 || nx >= MAP_W) continue;
    const ch = TILES[ny]![nx]!;
    if (isWall(ch) || !floorWalkable(ch)) continue;
    if (ch === "L" && sim.layer !== "observer") continue;
    if (THINGS.some((t) => t.solid && t.x === nx && t.y === ny)) continue;
    out.push({ x: nx + 0.5, y: ny + 0.5 });
  }
  return out;
}

function findPath(sx: number, sy: number, gx: number, gy: number) {
  const start = { x: Math.floor(sx), y: Math.floor(sy) };
  const goal = { x: Math.floor(gx), y: Math.floor(gy) };
  const key = (x: number, y: number) => `${x},${y}`;
  const q = [start];
  const came = new Map<string, { x: number; y: number } | null>();
  came.set(key(start.x, start.y), null);
  while (q.length) {
    const cur = q.shift()!;
    if (cur.x === goal.x && cur.y === goal.y) break;
    for (const n of neighbors(cur.x, cur.y)) {
      const tx = Math.floor(n.x);
      const ty = Math.floor(n.y);
      const k = key(tx, ty);
      if (came.has(k)) continue;
      came.set(k, cur);
      q.push({ x: tx, y: ty });
    }
  }
  if (!came.has(key(goal.x, goal.y))) return [] as { x: number; y: number }[];
  const path: { x: number; y: number }[] = [];
  let c: { x: number; y: number } | null = goal;
  while (c) {
    path.push({ x: c.x + 0.5, y: c.y + 0.5 });
    const parent = came.get(key(c.x, c.y));
    c = parent ?? null;
  }
  path.reverse();
  if (path.length && Math.hypot(path[0]!.x - sx, path[0]!.y - sy) < 0.2) path.shift();
  return path;
}

function held() {
  if (qaKeys) return new Set(qaKeys);
  return keys;
}

function pollGamepad(act: { mx: number; my: number }) {
  const pads = typeof navigator !== "undefined" ? navigator.getGamepads?.() ?? [] : [];
  const g = pads[0];
  if (!g) return;
  const ax = g.axes[0] ?? 0;
  const ay = g.axes[1] ?? 0;
  if (Math.abs(ax) > 0.22) act.mx += ax;
  if (Math.abs(ay) > 0.22) act.my += ay;
}

export function stepSim(now: number) {
  if (!sim.last) sim.last = now;
  let dt = (now - sim.last) / 1000;
  if (dt < 0.0004) return;
  sim.last = now;
  dt = Math.min(dt, 0.1);
  sim.time += dt;

  const watch = liveWatch();
  if (watch.phase.id !== sim.phaseId) {
    sim.phaseId = watch.phase.id;
    sim.phaseShift = watch.phase;
  }
  if (watch.seams > sim.seamSeen) {
    sim.seamSeen = watch.seams;
    sim.seamPulse = watch.seams;
  }

  const k = held();
  const act = { mx: 0, my: 0 };
  if (k.has("KeyA") || k.has("ArrowLeft")) act.mx -= 1;
  if (k.has("KeyD") || k.has("ArrowRight")) act.mx += 1;
  if (k.has("KeyW") || k.has("ArrowUp")) act.my -= 1;
  if (k.has("KeyS") || k.has("ArrowDown")) act.my += 1;
  act.mx += touchX;
  act.my += touchY;
  pollGamepad(act);

  const mag = Math.hypot(act.mx, act.my);
  if (mag > 1) {
    act.mx /= mag;
    act.my /= mag;
  }

  if (mag > 0.08) {
    sim.path = [];
    const dx = act.mx * SPEED * dt;
    const dy = act.my * SPEED * dt;
    tryMove(sim, dx, dy);
    sim.facing = Math.atan2(-act.my, act.mx);
    sim.speed = SPEED * Math.min(1, mag);
  } else if (sim.path.length) {
    const t = sim.path[0]!;
    const dx = t.x - sim.x;
    const dy = t.y - sim.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.12) {
      sim.path.shift();
      sim.speed = 0;
    } else {
      const step = Math.min(dist, SPEED * dt);
      tryMove(sim, (dx / dist) * step, (dy / dist) * step);
      sim.facing = Math.atan2(-dy, dx);
      sim.speed = SPEED;
    }
  } else {
    sim.speed = 0;
  }

  const npcMul =
    watch.phase.id === "midwatch" ? 1.28 : watch.phase.id === "quiet" ? 0.52 : 1;

  for (const n of sim.npcs) {
    const toYou = Math.hypot(n.px - sim.x, n.py - sim.y);
    if (sim.layer === "observer") {
      if (toYou < 1.6) n.facing = Math.atan2(-(sim.y - n.py), sim.x - n.px);
      continue;
    }
    if (toYou < 1.55) {
      n.facing = Math.atan2(-(sim.y - n.py), sim.x - n.px);
      n.wait = Math.max(n.wait, 0.35);
      continue;
    }
    n.wait -= dt;
    const dest = n.roam[n.roamI]!;
    const dx = dest.x - n.px;
    const dy = dest.y - n.py;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.08) {
      if (n.wait <= 0) {
        n.roamI = (n.roamI + 1) % n.roam.length;
        const linger = watch.phase.id === "quiet" ? 3.2 : 1.4;
        n.wait = linger + Math.random() * 3.5;
      }
    } else if (n.wait <= 0) {
      const step = Math.min(dist, NPC_SPEED * npcMul * dt);
      const dummy = { x: n.px, y: n.py };
      tryMove(dummy, (dx / dist) * step, (dy / dist) * step);
      n.px = dummy.x;
      n.py = dummy.y;
      n.facing = Math.atan2(-dy, dx);
    }
  }
}

export function setKey(code: string, down: boolean) {
  if (down) keys.add(code);
  else keys.delete(code);
}

export function clearKeys() {
  keys.clear();
  touchX = 0;
  touchY = 0;
}

export function setTouch(x: number, y: number) {
  const m = Math.hypot(x, y);
  if (m < 0.12) {
    touchX = 0;
    touchY = 0;
    return;
  }
  const s = Math.min(1, m);
  touchX = (x / m) * s;
  touchY = (y / m) * s;
}

export function setQaKeys(codes: string[]) {
  qaKeys = codes.length ? codes : null;
}

export function clickMove(wx: number, wy: number) {
  sim.path = findPath(sim.x, sim.y, wx, wy);
}

/** Walk to a tile beside a thing, not into it. */
export function walkToThing(id: string) {
  const t = thingById(id);
  if (!t) return;
  const offsets = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  let best: { x: number; y: number } | null = null;
  let bestD = 1e9;
  for (const [dx, dy] of offsets) {
    const x = t.x + dx + 0.5;
    const y = t.y + dy + 0.5;
    if (blocked(x, y, 0.18)) continue;
    const d = Math.hypot(x - sim.x, y - sim.y);
    if (d < bestD) {
      bestD = d;
      best = { x, y };
    }
  }
  if (best) clickMove(best.x, best.y);
}

export function nearestFocus(max = 1.45): Focus {
  let best: Focus = null;
  let bestD = max;
  for (const t of THINGS) {
    const d = Math.hypot(t.x + 0.5 - sim.x, t.y + 0.5 - sim.y);
    if (d < bestD) {
      bestD = d;
      best = { type: "thing", id: t.id };
    }
  }
  for (const n of sim.npcs) {
    const d = Math.hypot(n.px - sim.x, n.py - sim.y);
    if (d < bestD) {
      bestD = d;
      best = { type: "npc", id: n.id };
    }
  }
  return best;
}

export function thingById(id: string): Thing | undefined {
  return THINGS.find((t) => t.id === id);
}

export function interactCopy(
  layer: Layer,
  intent: Intent,
  focus: NonNullable<Focus>,
  pulledOnce = false,
  letterTaken = false,
) {
  if (focus.type === "npc") {
    const n = sim.npcs.find((p) => p.id === focus.id)!;
    const person = crewOf(focus.id);
    if (intent === "examine") {
      return {
        title: layer === "crew" ? person.given : person.id,
        body: layer === "crew" ? n.crewTalk : n.obsTalk,
        task: undefined as string | undefined,
        channel: layer === "crew" ? "deck" : "cctv",
        speaker: layer === "crew" ? person.given : person.id,
        radio: layer === "crew" ? n.crewTalk : n.obsTalk,
      };
    }
    if (intent === "use") {
      return {
        title: layer === "crew" ? person.given : person.id,
        body: layer === "crew" ? n.crewUse : n.obsUse,
        task: undefined,
        channel: layer === "crew" ? "deck" : "cctv",
        speaker: layer === "crew" ? VIEWER.given : "S-21",
      };
    }
    return {
      title: layer === "crew" ? person.given : person.id,
      body: layer === "crew" ? n.crewAsk : n.obsAsk,
      task: undefined,
      channel: layer === "crew" ? "deck" : "cctv",
      speaker: layer === "crew" ? person.given : "flag",
      radio: layer === "crew" ? n.crewAsk : n.obsAsk,
    };
  }
  const t = thingById(focus.id)!;
  const title = layer === "crew" ? t.crewName : t.obsName;
  const clocks = liveWatch();
  let body =
    intent === "examine"
      ? layer === "crew"
        ? t.crewExamine
        : t.obsExamine
      : intent === "use"
        ? layer === "crew"
          ? t.crewUse
          : t.obsUse
        : layer === "crew"
          ? t.crewAsk
          : t.obsAsk;
  if (t.id === "letter" && intent === "examine") {
    const taken = letterTaken;
    body = layer === "crew" ? crewLetter(t.crewExamine, taken) : obsLetter(t.obsExamine, taken);
  }
  if (t.kind === "clock" && intent === "examine") {
    body =
      layer === "crew"
        ? clocks.seamOpen
          ? `${clocks.ship}. The face skipped. You did not feel the minute.`
          : `${VOYAGE.nowLabel} · ${clocks.ship}. ${clocks.phase.crew} on day ${VOYAGE.elapsedDays}.`
        : `Crew clock ${clocks.ship}. Facility clock ${clocks.facility}. ${clocks.gapMin} minutes uncorrected from Cycle ${VOYAGE.truncationCycle}.`;
  }
  if (intent === "examine" && layer === "crew" && pulledOnce && t.crewResidue) {
    body = `${body} ${t.crewResidue}`;
  }
  const showItems = intent === "examine" && t.items?.length;
  return {
    title,
    body,
    task: t.task,
    channel: layer === "crew" ? "deck" : "cctv",
    itemsLabel: showItems ? (layer === "crew" ? t.itemsLabel?.crew : t.itemsLabel?.obs) : undefined,
    items: showItems
      ? t.items!.map((it) => ({
          id: it.id,
          name: layer === "crew" ? it.crewName : it.obsName,
          body: layer === "crew" ? it.crewExamine : it.obsExamine,
        }))
      : undefined,
    speaker: layer === "crew" ? VIEWER.given : "S-21",
  };
}

export function currentRoom() {
  return roomAt(sim.x, sim.y);
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
      getX?: () => number;
      getY?: () => number;
      goTo?: (x: number, y: number) => void;
      setPos?: (x: number, y: number) => void;
    };
  }
}

export const WAKE_LINES: RadioLine[] = [
  {
    id: "wake-1",
    t: 0,
    channel: "watch",
    speaker: VIEWER.given,
    text: "Batch F has the ship.",
    layer: "crew",
  },
  {
    id: "wake-2",
    t: 0,
    channel: "PX-04",
    speaker: "ops",
    text: "S-21 motor function confirmed. Cycle 12 arm.",
    layer: "observer",
  },
];
