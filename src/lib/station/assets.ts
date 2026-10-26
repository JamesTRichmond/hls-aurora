const PROP_KEYS = [
  "cryo",
  "cryo-open",
  "radio",
  "coffee",
  "plant",
  "eva",
  "medkit",
  "bunk",
  "clock",
  "letter",
  "locker",
  "plate",
] as const;

export type PropKey = (typeof PROP_KEYS)[number];

const cache = new Map<string, HTMLImageElement>();
let started = false;

function boot(src: string) {
  if (cache.has(src) || typeof Image === "undefined") return;
  const im = new Image();
  im.crossOrigin = "anonymous";
  im.decoding = "async";
  im.src = src;
  cache.set(src, im);
}

export function beginLoad() {
  if (started || typeof window === "undefined") return;
  started = true;
  boot("/station/floor-crew.png");
  boot("/station/floor-obs.png");
  boot("/station/jules-walk.png?v=walk2");
  boot("/station/crew-walk.png?v=walk2");
  for (const k of PROP_KEYS) {
    boot(`/station/props-crew/${k}.png`);
    boot(`/station/props-obs/${k}.png`);
  }
}

export function asset(src: string): HTMLImageElement | null {
  const im = cache.get(src);
  if (im && im.complete && im.naturalWidth > 0) return im;
  return null;
}

export function floorTex(layer: "crew" | "observer") {
  return asset(layer === "crew" ? "/station/floor-crew.png" : "/station/floor-obs.png");
}

export function walkSheet(you: boolean) {
  return asset(you ? "/station/jules-walk.png" : "/station/crew-walk.png");
}

export function propTex(layer: "crew" | "observer", key: PropKey) {
  return asset(`/station/props-${layer === "crew" ? "crew" : "obs"}/${key}.png`);
}

export function propKeyFor(
  kind: string,
  open = false,
): PropKey | null {
  switch (kind) {
    case "cryo":
      return open ? "cryo-open" : "cryo";
    case "locker":
      return "locker";
    case "plate":
      return "plate";
    case "radio":
      return "radio";
    case "log":
    case "seals":
    case "power":
    case "atmos":
    case "thermal":
    case "integrity":
    case "fold":
      return null;
    case "coffee":
      return "coffee";
    case "plant":
      return "plant";
    case "eva":
      return "eva";
    case "medkit":
      return "medkit";
    case "bunk":
      return "bunk";
    case "clock":
      return "clock";
    case "letter":
      return "letter";
    default:
      return null;
  }
}
