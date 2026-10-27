export const WATCH_MEMORY_VERSION = 2;
/** Slot name stays. Version 1 saves already live in this key; the version inside the JSON is what migrates. */
export const WATCH_MEMORY_KEY = "hls-aurora-watch-v1";

const TASKS = ["handover", "nightlog", "thermal", "health", "habitat"] as const;

export type WatchMemory = {
  version: 2;
  cycle12Initiated: boolean;
  done: Record<string, boolean>;
  asked: Record<string, boolean>;
  woke: boolean;
  pulledOnce: boolean;
  hintSeen: boolean;
  simTime: number;
  x: number | null;
  y: number | null;
  facing: number | null;
  letterRead: boolean;
  letterTaken: boolean;
};

export function emptyWatchMemory(): WatchMemory {
  return {
    version: 2,
    cycle12Initiated: false,
    done: {},
    asked: {},
    woke: false,
    pulledOnce: false,
    hintSeen: false,
    simTime: 0,
    x: null,
    y: null,
    facing: null,
    letterRead: false,
    letterTaken: false,
  };
}

function pickTasks(src: unknown): Record<string, boolean> {
  if (!src || typeof src !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const id of TASKS) {
    if ((src as Record<string, unknown>)[id] === true) out[id] = true;
  }
  return out;
}

function pickAsked(src: unknown): Record<string, boolean> {
  if (!src || typeof src !== "object") return {};
  const out: Record<string, boolean> = {};
  for (const [key, val] of Object.entries(src as Record<string, unknown>)) {
    if (val !== true) continue;
    if (!/^[A-Za-z0-9-]{1,16}$/.test(key)) continue;
    out[key] = true;
  }
  return out;
}

function inRange(n: unknown, min: number, max: number): number | null {
  if (typeof n !== "number" || !Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

function flagsOf(v: Record<string, unknown>): Omit<WatchMemory, "version" | "simTime" | "x" | "y" | "facing" | "letterRead" | "letterTaken"> {
  return {
    cycle12Initiated: v.cycle12Initiated === true,
    done: pickTasks(v.done),
    asked: pickAsked(v.asked),
    woke: v.woke === true,
    pulledOnce: v.pulledOnce === true,
    hintSeen: v.hintSeen === true,
  };
}

function placeOf(v: Record<string, unknown>): Pick<WatchMemory, "simTime" | "x" | "y" | "facing"> {
  const simTime = inRange(v.simTime, 0, 86_400) ?? 0;
  const x = inRange(v.x, 0, 32);
  const y = inRange(v.y, 0, 20);
  const facing = inRange(v.facing, -7, 7);
  if (x == null || y == null) return { simTime, x: null, y: null, facing: null };
  return { simTime, x, y, facing };
}

/** Unknown versions are refused. A version 1 save keeps its flags and forgets a position it never had. */
export function parseWatchMemory(raw: string | null): WatchMemory {
  if (!raw) return emptyWatchMemory();
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return emptyWatchMemory();
  }
  if (!value || typeof value !== "object") return emptyWatchMemory();
  const v = value as Record<string, unknown>;
  if (v.version === 1) {
    return {
      ...emptyWatchMemory(),
      ...flagsOf(v),
    };
  }
  if (v.version !== WATCH_MEMORY_VERSION) return emptyWatchMemory();
  return {
    version: 2,
    ...flagsOf(v),
    ...placeOf(v),
    letterRead: v.letterRead === true,
    letterTaken: v.letterTaken === true,
  };
}

export function serializeWatchMemory(m: WatchMemory): string {
  return JSON.stringify({ ...m, version: WATCH_MEMORY_VERSION });
}

export function readWatchMemory(): WatchMemory {
  try {
    if (typeof localStorage === "undefined") return emptyWatchMemory();
    return parseWatchMemory(localStorage.getItem(WATCH_MEMORY_KEY));
  } catch {
    return emptyWatchMemory();
  }
}

export function writeWatchMemory(m: WatchMemory) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(WATCH_MEMORY_KEY, serializeWatchMemory(m));
  } catch {
    /* private mode, or a full disk. The watch still runs. */
  }
}
