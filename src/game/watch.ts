export const WATCH_TASKS = [
  { id: "handover", crew: "Relieve Batch E", obs: "Close-out", where: "seals" },
  { id: "nightlog", crew: "Night log", obs: "PX-A-033", where: "radio" },
  { id: "thermal", crew: "Thermal band", obs: "Plant heat", where: "thermal" },
  { id: "health", crew: "Baseline", obs: "S-21 cuff", where: "medkit" },
  { id: "habitat", crew: "Frames", obs: "Set dressing", where: "integrity" },
] as const;

export type WatchPhaseId = "wake" | "walkdown" | "midwatch" | "quiet";

/** One line a person says in passing. Changes with the watch. */
export function phaseTalk(id: string, phase: WatchPhaseId, layer: "crew" | "observer"): string | null {
  const crew: Record<string, Record<WatchPhaseId, string>> = {
    "S-17": {
      wake: "Don't trust the window yet.",
      walkdown: "Eleven degrees. I sent it.",
      midwatch: "Still waiting on the lock.",
      quiet: "I'll stay until the reply.",
    },
    "S-18": {
      wake: "The ship is yours.",
      walkdown: "I'll go down when she does.",
      midwatch: "Don't wait on us.",
      quiet: "Half in the couch already.",
    },
    "S-19": {
      wake: "They wrote dust. I read dust.",
      walkdown: "I'm going to sleep.",
      midwatch: "Curiosity, reduced.",
      quiet: "Weather. That's enough.",
    },
    "S-20": {
      wake: "You're not short. I counted.",
      walkdown: "Have a quiet twenty-one.",
      midwatch: "Nothing missing that has a name.",
      quiet: "Gasket's a joke. Keep it.",
    },
    "S-22": {
      wake: "I'll walk the loops.",
      walkdown: "If it held, I log.",
      midwatch: "Numbers should stay numbers.",
      quiet: "Band held. I'm done looking.",
    },
    "S-23": {
      wake: "Don't skip breakfast.",
      walkdown: "Four of us, then the twenty.",
      midwatch: "Wrist. I already know the pulse.",
      quiet: "Baseline's in. Eat.",
    },
    "S-24": {
      wake: "It feels like a room.",
      walkdown: "I can work with a room.",
      midwatch: "Anya says the dark is weather.",
      quiet: "The basil still has no name.",
    },
  };
  const obs: Record<string, string> = {
    "S-17": "Do not answer the query.",
    "S-18": "Re-freeze with Batch E.",
    "S-19": "Dust accepted. Desired.",
    "S-20": "Trust high. No hole.",
    "S-22": "Upper panel only.",
    "S-23": "Do not elaborate.",
    "S-24": "Wonder contained.",
  };
  if (layer === "observer") return obs[id] ?? null;
  return crew[id]?.[phase] ?? null;
}
