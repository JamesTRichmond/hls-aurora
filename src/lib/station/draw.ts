import type { CrewMember } from "@/lib/mission";
import { CREW, VIEWER } from "@/lib/mission";
import { beginLoad, floorTex, propKeyFor, propTex, walkSheet } from "@/lib/station/assets";
import { liveWatch, sim, type Layer } from "@/lib/station/sim";
import {
  MAP_H,
  MAP_W,
  ROOMS,
  THINGS,
  TILE,
  TILES,
  crewOf,
  phaseTalk,
  roomAt,
  type Thing,
  type TileCh,
} from "@/lib/station/world";
import { useConsole } from "@/lib/store";

const CREW_PAL = {
  bg: "#07101c",
  floorA: "#102036",
  floorB: "#0d1b30",
  spine: "#0c2238",
  gallery: "#071422",
  cryo: "#0d1e32",
  systems: "#102436",
  greenhouse: "#10281f",
  eva: "#101828",
  command: "#182028",
  wall: "#152a45",
  wallTop: "#1d3a5c",
  wallFace: "#0c1828",
  rail: "#c9a27c",
  ivory: "#ede6da",
  muted: "#8b9bb0",
  accent: "#c9a27c",
  nominal: "#7d9b76",
  advisory: "#c4a46a",
  line: "#2a4a6e",
  glow: "rgba(201,162,124,0.16)",
};

const OBS_PAL = {
  bg: "#0c0c0c",
  floorA: "#1a1a1a",
  floorB: "#161616",
  spine: "#191919",
  gallery: "#141414",
  cryo: "#171717",
  systems: "#1c1c1c",
  greenhouse: "#151815",
  eva: "#181818",
  command: "#1a1515",
  wall: "#2a2a2a",
  wallTop: "#333333",
  wallFace: "#121212",
  rail: "#5c5c5c",
  ivory: "#e3e3e3",
  muted: "#8a8a8a",
  accent: "#8a8a8a",
  nominal: "#7a7a7a",
  advisory: "#a15c4a",
  line: "#2e2e2e",
  glow: "rgba(194,48,48,0.08)",
};

function pal(layer: Layer) {
  return layer === "crew" ? CREW_PAL : OBS_PAL;
}

function floorTint(ch: TileCh, layer: Layer): string {
  if (layer === "crew") {
    switch (ch) {
      case "~":
        return "rgba(40,70,120,0.42)";
      case "c":
        return "rgba(80,140,180,0.28)";
      case "s":
        return "rgba(40,80,90,0.35)";
      case "g":
        return "rgba(40,90,55,0.4)";
      case "e":
        return "rgba(20,30,50,0.45)";
      case "m":
        return "rgba(40,30,25,0.4)";
      case "o":
        return "rgba(30,50,80,0.28)";
      case ".":
        return "rgba(201,162,124,0.08)";
      default:
        return "rgba(10,22,40,0.18)";
    }
  }
  switch (ch) {
    case "g":
      return "rgba(40,50,40,0.35)";
    case "m":
      return "rgba(60,20,20,0.35)";
    case "~":
      return "rgba(20,20,20,0.45)";
    case "c":
      return "rgba(30,30,35,0.3)";
    default:
      return "rgba(0,0,0,0.12)";
  }
}

function floorColor(ch: TileCh, layer: Layer): string {
  const p = pal(layer);
  switch (ch) {
    case ",":
      return p.spine;
    case "~":
      return p.gallery;
    case "c":
      return p.cryo;
    case "s":
      return p.systems;
    case "g":
      return p.greenhouse;
    case "e":
      return p.eva;
    case "m":
      return p.command;
    case "o":
      return p.floorA;
    case ".":
      return p.floorB;
    case "+":
    case "L":
      return p.spine;
    default:
      return p.floorA;
  }
}

let noiseTile: HTMLCanvasElement | null = null;
let stars: HTMLCanvasElement | null = null;
let leds: HTMLCanvasElement | null = null;

function noiseTileCanvas() {
  if (noiseTile) return noiseTile;
  noiseTile = document.createElement("canvas");
  noiseTile.width = 64;
  noiseTile.height = 64;
  const n = noiseTile.getContext("2d")!;
  const img = n.createImageData(64, 64);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 128 + ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 40;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 22;
  }
  n.putImageData(img, 0, 0);
  return noiseTile;
}

function starCanvas() {
  if (stars) return stars;
  stars = document.createElement("canvas");
  stars.width = 480;
  stars.height = 220;
  const s = stars.getContext("2d")!;
  s.fillStyle = "#050a14";
  s.fillRect(0, 0, 480, 220);
  for (let i = 0; i < 90; i++) {
    const x = (i * 97) % 480;
    const y = (i * 53) % 220;
    const a = 0.35 + (i % 5) * 0.12;
    s.fillStyle = `rgba(237,230,218,${a})`;
    s.fillRect(x, y, i % 7 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1);
  }
  s.fillStyle = "rgba(201,162,124,0.9)";
  s.fillRect(310, 88, 2, 2);
  return stars;
}

function ledCanvas() {
  if (leds) return leds;
  leds = document.createElement("canvas");
  leds.width = 240;
  leds.height = 120;
  const s = leds.getContext("2d")!;
  s.fillStyle = "#101010";
  s.fillRect(0, 0, 240, 120);
  for (let y = 8; y < 120; y += 10) {
    for (let x = 8; x < 240; x += 10) {
      s.fillStyle = x === 128 && y === 58 ? "#c8c8c8" : "#2a2a2a";
      s.fillRect(x, y, 3, 3);
    }
  }
  return leds;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

export type Cam = { x: number; y: number; z: number };

let camSX = 0;
let camSY = 0;
let camReady = false;

export function cameraFor(viewW: number, viewH: number): Cam {
  const z = Math.min(1.45, Math.max(0.78, viewW / (20 * TILE)));
  const worldW = MAP_W * TILE;
  const worldH = MAP_H * TILE;
  const look = Math.min(34, 8 + sim.speed * 7);
  const lx = Math.cos(sim.facing) * look;
  const ly = -Math.sin(sim.facing) * look;
  let x = sim.x * TILE + lx - viewW / (2 * z);
  let y = sim.y * TILE + ly - viewH / (2 * z);
  const maxX = Math.max(0, worldW - viewW / z);
  const maxY = Math.max(0, worldH - viewH / z);
  x = Math.max(0, Math.min(maxX, x));
  y = Math.max(0, Math.min(maxY, y));
  if (!camReady) {
    camSX = x;
    camSY = y;
    camReady = true;
  }
  camSX += (x - camSX) * 0.14;
  camSY += (y - camSY) * 0.14;
  return { x: camSX, y: camSY, z };
}

function stampFloor(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  px: number,
  py: number,
) {
  const sx = ((px % img.width) + img.width) % img.width;
  const sy = ((py % img.height) + img.height) % img.height;
  const w1 = Math.min(TILE, img.width - sx);
  const h1 = Math.min(TILE, img.height - sy);
  ctx.drawImage(img, sx, sy, w1, h1, px, py, w1, h1);
  if (w1 < TILE) ctx.drawImage(img, 0, sy, TILE - w1, h1, px + w1, py, TILE - w1, h1);
  if (h1 < TILE) ctx.drawImage(img, sx, 0, w1, TILE - h1, px, py + h1, w1, TILE - h1);
  if (w1 < TILE && h1 < TILE) {
    ctx.drawImage(img, 0, 0, TILE - w1, TILE - h1, px + w1, py + h1, TILE - w1, TILE - h1);
  }
}

function drawFloor(ctx: CanvasRenderingContext2D, layer: Layer, t: number) {
  const tex = floorTex(layer);
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const ch = TILES[y]![x]!;
      if (ch === "#") continue;
      const px = x * TILE;
      const py = y * TILE;
      ctx.fillStyle = floorColor(ch, layer);
      ctx.fillRect(px, py, TILE, TILE);
      const room = roomAt(x + 0.5, y + 0.5);
      if (room?.id === "cryo") {
        ctx.fillStyle = layer === "crew" ? "rgba(80,140,180,0.16)" : "rgba(30,30,35,0.22)";
        ctx.fillRect(px, py, TILE, TILE);
      } else if (room?.id === "greenhouse") {
        ctx.fillStyle = layer === "crew" ? "rgba(36,88,52,0.2)" : "rgba(20,32,20,0.22)";
        ctx.fillRect(px, py, TILE, TILE);
        if (x % 2 === 0) {
          ctx.fillStyle = layer === "crew" ? "rgba(180,220,140,0.08)" : "rgba(80,90,70,0.12)";
          ctx.fillRect(px + 10, py, 4, TILE);
        }
      } else if (room?.id === "gallery") {
        ctx.fillStyle = layer === "crew" ? "rgba(40,70,140,0.1)" : "rgba(24,24,24,0.18)";
        ctx.fillRect(px, py, TILE, TILE);
      } else if (room?.id === "eva") {
        ctx.fillStyle = layer === "crew" ? "rgba(20,28,40,0.2)" : "rgba(12,12,12,0.25)";
        ctx.fillRect(px, py, TILE, TILE);
        ctx.strokeStyle = layer === "crew" ? "rgba(201,162,124,0.12)" : "rgba(80,80,80,0.2)";
        ctx.strokeRect(px + 6, py + 6, TILE - 12, TILE - 12);
      } else if (room?.id === "systems") {
        ctx.fillStyle = layer === "crew" ? "rgba(20,50,70,0.14)" : "rgba(16,16,16,0.2)";
        ctx.fillRect(px, py, TILE, TILE);
      }
      if (tex) {
        ctx.save();
        stampFloor(ctx, tex, px, py);
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = floorTint(ch, layer);
        ctx.fillRect(px, py, TILE, TILE);
        ctx.restore();
      }
      if (ch === "~") {
        const g = ctx.createLinearGradient(0, py, 0, py + TILE);
        if (layer === "crew") {
          g.addColorStop(0, "rgba(80,120,180,0.18)");
          g.addColorStop(1, "rgba(201,162,124,0.05)");
        } else {
          g.addColorStop(0, "rgba(40,40,40,0.45)");
          g.addColorStop(1, "rgba(20,20,20,0.1)");
        }
        ctx.fillStyle = g;
        ctx.fillRect(px, py, TILE, TILE);
        if (layer === "crew") {
          for (let i = 0; i < 4; i++) {
            const sx = px + ((i * 19 + x * 13) % (TILE - 8)) + 4;
            const sy = py + ((i * 11 + y * 7) % (TILE - 8)) + 4;
            const tw = 0.5 + 0.5 * Math.sin(t * 2 + i + x);
            ctx.fillStyle = `rgba(237,230,218,${0.25 + tw * 0.4})`;
            ctx.fillRect(sx, sy, 2, 2);
          }
        }
      }
    }
  }
  const phase = liveWatch().phase.id;
  const wash =
    layer === "crew"
      ? phase === "wake"
        ? "rgba(70,110,170,0.07)"
        : phase === "quiet"
          ? "rgba(6,10,18,0.16)"
          : null
      : phase === "quiet"
        ? "rgba(0,0,0,0.14)"
        : null;
  if (wash) {
    ctx.save();
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE);
    ctx.restore();
  }
  const grain = noiseTileCanvas();
  ctx.save();
  ctx.globalAlpha = layer === "crew" ? 0.1 : 0.2;
  for (let y = 0; y < MAP_H * TILE; y += 64) {
    for (let x = 0; x < MAP_W * TILE; x += 64) {
      ctx.drawImage(grain, x, y);
    }
  }
  ctx.restore();
}

function wallHere(x: number, y: number): boolean {
  if (y < 0 || y >= MAP_H || x < 0 || x >= MAP_W) return true;
  return TILES[y]![x] === "#";
}

function drawWallTile(ctx: CanvasRenderingContext2D, x: number, y: number, layer: Layer) {
  const p = pal(layer);
  const px = x * TILE;
  const py = y * TILE;
  ctx.fillStyle = p.wall;
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = p.wallTop;
  ctx.fillRect(px, py, TILE, 12);
  if (!wallHere(x, y + 1)) {
    ctx.fillStyle = p.wallFace;
    ctx.fillRect(px, py + TILE - 18, TILE, 18);
    ctx.fillStyle = p.rail;
    ctx.fillRect(px, py + TILE - 20, TILE, 2);
    if (layer === "crew") {
      ctx.fillStyle = "rgba(201,162,124,0.35)";
      ctx.fillRect(px + TILE / 2 - 1, py + TILE - 16, 2, 8);
    }
  }
  if (layer === "crew") {
    ctx.fillStyle = "rgba(201,162,124,0.22)";
    ctx.fillRect(px + 4, py + 4, 3, 3);
    ctx.fillRect(px + TILE - 7, py + 4, 3, 3);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(px + 2, py + 2, TILE - 4, 2);
    ctx.fillStyle = "rgba(194,48,48,0.25)";
    if ((x + y) % 7 === 0) ctx.fillRect(px + 6, py + 6, TILE - 12, 2);
  }
}

function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number, locked: boolean, layer: Layer, t: number) {
  const p = pal(layer);
  const px = x * TILE;
  const py = y * TILE;
  ctx.fillStyle = floorColor(",", layer);
  ctx.fillRect(px, py, TILE, TILE);
  const vert = wallHere(x, y - 1) && wallHere(x, y + 1);
  const staffOpen = locked && layer === "observer";
  ctx.fillStyle = locked && !staffOpen ? (layer === "crew" ? p.advisory : "#8a2222") : p.rail;
  if (vert) {
    ctx.fillRect(px + 6, py, 4, TILE);
    ctx.fillRect(px + TILE - 10, py, 4, TILE);
    ctx.fillStyle = locked && !staffOpen ? "rgba(194,48,48,0.35)" : "rgba(237,230,218,0.12)";
    ctx.fillRect(px + 12, py + 4, TILE - 24, TILE - 8);
  } else {
    ctx.fillRect(px, py + 6, TILE, 4);
    ctx.fillRect(px, py + TILE - 10, TILE, 4);
    ctx.fillStyle = locked && !staffOpen ? "rgba(194,48,48,0.35)" : "rgba(237,230,218,0.12)";
    ctx.fillRect(px + 4, py + 12, TILE - 8, TILE - 24);
  }
  if ((!locked || staffOpen) && layer === "crew") {
    ctx.fillStyle = `rgba(125,155,118,${0.35 + 0.2 * Math.sin(t * 2)})`;
    ctx.fillRect(px + TILE / 2 - 3, py + TILE / 2 - 3, 6, 6);
  }
  if (staffOpen) {
    ctx.fillStyle = "#c23030";
    ctx.fillRect(px + TILE / 2 - 4, py + TILE / 2 - 4, 8, 8);
  }
}

function drawViewport(ctx: CanvasRenderingContext2D, layer: Layer, t: number) {
  const p = pal(layer);
  roundRect(ctx, -22, -18, 44, 32, 5);
  ctx.fillStyle = layer === "crew" ? "#050a14" : "#101010";
  ctx.fill();
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, -20, -16, 40, 28, 3);
  ctx.clip();
  if (layer === "crew") {
    ctx.save();
    ctx.transform(1, 0, 0.12, 1, -2, 0);
    const sc = starCanvas();
    const ox = (t * 8) % sc.width;
    ctx.drawImage(sc, -20 - ox, -16, sc.width, 28);
    ctx.drawImage(sc, -20 - ox + sc.width, -16, sc.width, 28);
    ctx.restore();
    const lg = ctx.createLinearGradient(-18, -8, 16, 10);
    lg.addColorStop(0, "rgba(201,162,124,0)");
    lg.addColorStop(0.5, "rgba(201,162,124,0.28)");
    lg.addColorStop(1, "rgba(201,162,124,0)");
    ctx.fillStyle = lg;
    ctx.fillRect(-18, -6, 36, 8);
  } else {
    ctx.drawImage(ledCanvas(), -20, -16, 40, 28);
    if (Math.sin(t * 3) > 0.82) {
      ctx.fillStyle = "rgba(200,200,200,0.45)";
      ctx.fillRect(-2, -2, 3, 3);
    }
  }
  ctx.restore();
  ctx.strokeStyle = p.rail;
  ctx.lineWidth = 2;
  roundRect(ctx, -22, -18, 44, 32, 5);
  ctx.stroke();
}

function drawThing(
  ctx: CanvasRenderingContext2D,
  th: Thing,
  layer: Layer,
  t: number,
  hi: boolean,
  pending: boolean,
) {
  const p = pal(layer);
  const cx = (th.x + 0.5) * TILE;
  const cy = (th.y + 0.5) * TILE;
  ctx.save();
  ctx.translate(cx, cy);
  if (pending) {
    ctx.strokeStyle = layer === "crew" ? `rgba(201,162,124,${0.35 + 0.25 * Math.sin(t * 3)})` : `rgba(194,48,48,${0.4 + 0.2 * Math.sin(t * 3)})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-TILE * 0.46, -TILE * 0.46, TILE * 0.92, TILE * 0.92);
  }
  if (hi) {
    ctx.strokeStyle = layer === "crew" ? p.accent : "#c23030";
    ctx.lineWidth = 2;
    ctx.strokeRect(-TILE * 0.44, -TILE * 0.44, TILE * 0.88, TILE * 0.88);
  }
  if (th.kind === "viewport") {
    drawViewport(ctx, layer, t);
    ctx.restore();
    return;
  }
  if (th.kind === "water") {
    ctx.fillStyle = p.wall;
    ctx.fillRect(-10, -16, 20, 32);
    ctx.fillStyle = layer === "crew" ? "#3a6a78" : "#3a3a3a";
    ctx.fillRect(-6, -8, 12, 18);
    ctx.restore();
    return;
  }
  const key = propKeyFor(th.kind, Boolean(th.open));
  const spr = key ? propTex(layer, key) : null;
  if (spr) {
    const big = th.kind === "cryo" || th.kind === "bunk" || th.kind === "eva";
    const small = th.kind === "letter" || th.kind === "medkit" || th.kind === "plate" || th.kind === "clock";
    const dw = TILE * (big ? 1.28 : small ? 0.82 : 1.08);
    const dh = TILE * (big ? 1.28 : small ? 0.82 : 1.08);
    ctx.drawImage(spr, -dw / 2, -dh / 2, dw, dh);
    if (th.kind === "plate") {
      ctx.fillStyle = layer === "crew" ? p.ivory : "#c8c8c8";
      ctx.font = layer === "crew" ? "600 11px 'Source Serif 4', serif" : "600 10px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(layer === "crew" ? "12" : "12", 0, 1);
    }
    if (th.kind === "cryo" && th.open) {
      for (let i = 0; i < 5; i++) {
        const a = t * 1.4 + i * 1.1;
        ctx.fillStyle = layer === "crew" ? `rgba(220,230,240,${0.18 + 0.12 * Math.sin(a)})` : `rgba(200,200,200,${0.12 + 0.08 * Math.sin(a)})`;
        ctx.beginPath();
        ctx.arc(-6 + (i % 3) * 5, -4 - (a % 8), 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
    return;
  }
  if (th.kind === "plate") {
    ctx.fillStyle = p.rail;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = layer === "crew" ? "#1a2433" : "#1a1a1a";
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = layer === "crew" ? p.ivory : "#c8c8c8";
    ctx.font = "600 11px 'Source Serif 4', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("12", 0, 1);
    ctx.restore();
    return;
  }
  if (th.kind === "locker") {
    ctx.fillStyle = layer === "crew" ? "#3a2a18" : "#2a2a2a";
    roundRect(ctx, -14, -16, 28, 30, 3);
    ctx.fill();
    ctx.fillStyle = p.rail;
    ctx.fillRect(-10, -4, 20, 2);
    ctx.restore();
    return;
  }
  if (th.kind === "seals") {
    roundRect(ctx, -16, -12, 32, 24, 3);
    ctx.fillStyle = layer === "crew" ? "#1a2e24" : "#1a1a1a";
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = pending
        ? `rgba(196,164,106,${0.45 + 0.25 * Math.sin(t * 3 + i)})`
        : layer === "crew"
          ? "#7d9b76"
          : "#5a5a5a";
      ctx.beginPath();
      ctx.arc(-10 + i * 7, 0, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }
  if (th.kind === "thermal") {
    ctx.fillStyle = layer === "crew" ? "#243848" : "#222";
    roundRect(ctx, -16, -14, 32, 28, 3);
    ctx.fill();
    ctx.fillStyle = pending ? p.advisory : p.rail;
    ctx.fillRect(-12, -2, 24, 4);
    ctx.fillStyle = "rgba(194,72,48,0.45)";
    ctx.fillRect(-12, 6, 24, 2);
    ctx.restore();
    return;
  }
  if (th.kind === "power") {
    ctx.fillStyle = layer === "crew" ? "#2a2418" : "#1c1c1c";
    roundRect(ctx, -15, -13, 30, 26, 2);
    ctx.fill();
    ctx.fillStyle = p.advisory;
    ctx.fillRect(-3, -8, 6, 16);
    ctx.restore();
    return;
  }
  if (th.kind === "fold") {
    ctx.fillStyle = layer === "crew" ? "#1a2838" : "#2a1818";
    roundRect(ctx, -16, -14, 32, 28, 2);
    ctx.fill();
    ctx.strokeStyle = p.rail;
    ctx.lineWidth = 2;
    ctx.strokeRect(-8, -6, 16, 12);
    ctx.fillStyle = layer === "crew" ? p.advisory : "#c23030";
    ctx.fillRect(-2, -2, 4, 4);
    ctx.restore();
    return;
  }
  if (th.kind === "atmos" || th.kind === "integrity") {
    ctx.fillStyle = layer === "crew" ? "#1c3040" : "#1a1a1a";
    roundRect(ctx, -16, -12, 32, 24, 3);
    ctx.fill();
    ctx.fillStyle = p.nominal;
    ctx.fillRect(-10, -2, 20, 3);
    ctx.restore();
    return;
  }
  if (th.kind === "log") {
    ctx.fillStyle = layer === "crew" ? "#2a2218" : "#242424";
    roundRect(ctx, -13, -10, 26, 20, 2);
    ctx.fill();
    ctx.fillStyle = p.ivory;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(-8, -5, 16, 2);
    ctx.fillRect(-8, -1, 12, 2);
    ctx.globalAlpha = 1;
    ctx.restore();
    return;
  }
  ctx.fillStyle = p.wallTop;
  roundRect(ctx, -14, -12, 28, 24, 4);
  ctx.fill();
  ctx.restore();
}

function dirRow(facing: number): number {
  const deg = (Math.atan2(Math.sin(facing), Math.cos(facing)) * 180) / Math.PI;
  const ad = Math.abs(deg);
  if (ad < 45) return 2;
  if (ad > 135) return 1;
  if (deg > 0) return 3;
  return 0;
}

function drawPerson(
  ctx: CanvasRenderingContext2D,
  person: CrewMember,
  x: number,
  y: number,
  facing: number,
  layer: Layer,
  you: boolean,
  t: number,
  moving: boolean,
) {
  const p = pal(layer);
  const px = x * TILE;
  const py = y * TILE;
  ctx.save();
  ctx.translate(px, py);
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(0, 16, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  const sheet = walkSheet(you);
  if (sheet) {
    const cw = sheet.width / 4;
    const ch = sheet.height / 4;
    const row = dirRow(facing);
    const col = moving ? Math.floor(t * 10) % 4 : 0;
    const size = TILE * 2.05;
    const bob = moving ? Math.abs(Math.sin(t * 14)) * 4 : 0;
    ctx.translate(0, -bob);
    if (layer === "observer") ctx.filter = "grayscale(1) contrast(1.08) brightness(0.92)";
    else if (!you) {
      const h = (person.id.charCodeAt(person.id.length - 1) * 23) % 50 - 25;
      ctx.filter = `hue-rotate(${h}deg) saturate(0.92)`;
    }
    ctx.drawImage(sheet, col * cw, row * ch, cw, ch, -size / 2, -size * 0.82, size, size);
    ctx.filter = "none";
  } else {
    const bob = Math.sin(t * 6 + x) * (you ? 1.2 : 0.6);
    const skin = layer === "observer" ? grey(person.portrait.skin) : person.portrait.skin;
    const hair = layer === "observer" ? grey(person.portrait.hairColor) : person.portrait.hairColor;
    const suit = layer === "crew" ? (you ? "#c9a27c" : "#1b3554") : "#2a2a2a";
    ctx.translate(0, bob);
    ctx.fillStyle = suit;
    roundRect(ctx, -8, -6, 16, 20, 6);
    ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(0, -12, 7.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hair;
    ctx.beginPath();
    ctx.arc(0, -14, 7.2, Math.PI, Math.PI * 2);
    ctx.fill();
  }
  if (you) {
    ctx.strokeStyle = layer === "crew" ? p.accent : "#c23030";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, 6, 22, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.translate(px, py);
  ctx.fillStyle = p.ivory;
  ctx.font = you
    ? "600 10px 'Source Sans 3', sans-serif"
    : "500 9px 'Source Sans 3', sans-serif";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.7)";
  ctx.shadowBlur = 4;
  ctx.fillText(layer === "crew" ? person.given : person.id, 0, 28);
  if (!you) {
    const line = phaseTalk(person.id, liveWatch().phase.id, layer);
    if (line && Math.hypot(x - sim.x, y - sim.y) < 2.4) {
      ctx.font =
        layer === "crew"
          ? "500 11px 'Source Sans 3', sans-serif"
          : "500 10px 'IBM Plex Mono', monospace";
      const shown = line.length > 32 ? `${line.slice(0, 31)}…` : line;
      const w = Math.min(168, ctx.measureText(shown).width + 16);
      ctx.shadowBlur = 0;
      ctx.fillStyle = layer === "crew" ? "rgba(7,16,28,0.86)" : "rgba(10,10,10,0.9)";
      roundRect(ctx, -w / 2, -62, w, 20, 5);
      ctx.fill();
      ctx.fillStyle = layer === "crew" ? "#ede6da" : "#d8d8d8";
      ctx.fillText(shown, 0, -48);
    }
  }
  ctx.restore();
}

function grey(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const l = Math.round(0.3 * r + 0.5 * g + 0.2 * b);
  return `rgb(${l},${l},${l})`;
}

function drawRoomLabels(ctx: CanvasRenderingContext2D, layer: Layer) {
  const p = pal(layer);
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = p.muted;
  ctx.font =
    layer === "crew"
      ? "500 11px 'Source Serif 4', serif"
      : "500 10px 'IBM Plex Mono', monospace";
  ctx.textAlign = "left";
  for (const r of ROOMS) {
    ctx.fillText(
      layer === "crew" ? r.crewName.toUpperCase() : r.obsName.toUpperCase(),
      r.x * TILE + 8,
      r.y * TILE + 16,
    );
  }
  ctx.restore();
}

function drawLighting(ctx: CanvasRenderingContext2D, layer: Layer, t: number) {
  const room = roomAt(sim.x, sim.y);
  if (room) {
    const cx = (room.x + room.w / 2) * TILE;
    const cy = (room.y + room.h / 2) * TILE;
    const g = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(room.w, room.h) * TILE * 0.9);
    if (room.id === "cryo") {
      g.addColorStop(0, layer === "crew" ? "rgba(90,160,200,0.16)" : "rgba(40,50,60,0.12)");
      g.addColorStop(1, "rgba(0,0,0,0)");
    } else if (room.id === "gallery") {
      g.addColorStop(0, layer === "crew" ? "rgba(80,110,180,0.14)" : "rgba(30,30,30,0.1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
    } else if (room.id === "systems") {
      g.addColorStop(0, layer === "crew" ? `rgba(201,162,124,${0.06 + 0.04 * Math.sin(t * 4)})` : "rgba(60,40,30,0.1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
    } else if (room.id === "greenhouse") {
      g.addColorStop(0, layer === "crew" ? "rgba(90,160,80,0.12)" : "rgba(30,40,30,0.1)");
      g.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0)");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE);
  }
  if (layer === "observer") {
    const g = ctx.createRadialGradient(
      sim.x * TILE,
      sim.y * TILE,
      40,
      sim.x * TILE,
      sim.y * TILE,
      420,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.58)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let y = 0; y < MAP_H * TILE; y += 4) {
      ctx.fillRect(0, y, MAP_W * TILE, 1);
    }
  } else {
    const g = ctx.createRadialGradient(
      sim.x * TILE,
      sim.y * TILE,
      80,
      sim.x * TILE,
      sim.y * TILE,
      520,
    );
    g.addColorStop(0, "rgba(7,16,28,0)");
    g.addColorStop(1, "rgba(7,16,28,0.42)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, MAP_W * TILE, MAP_H * TILE);
  }
}

function drawMinimap(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  viewW: number,
  viewH: number,
) {
  const scale = 4.2;
  const w = MAP_W * scale;
  const h = MAP_H * scale;
  const x = viewW - w - 12;
  const y = 58;
  ctx.save();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = layer === "crew" ? "rgba(7,16,28,0.78)" : "rgba(12,12,12,0.86)";
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  for (let ty = 0; ty < MAP_H; ty++) {
    for (let tx = 0; tx < MAP_W; tx++) {
      const ch = TILES[ty]![tx]!;
      if (ch === "#") ctx.fillStyle = layer === "crew" ? "#1d3a5c" : "#2a2a2a";
      else if (ch === "L") ctx.fillStyle = layer === "crew" ? "#c4a46a" : "#c23030";
      else ctx.fillStyle = layer === "crew" ? "#152a45" : "#1a1a1a";
      ctx.fillRect(x + tx * scale, y + ty * scale, scale, scale);
    }
  }
  ctx.fillStyle = layer === "crew" ? "#c9a27c" : "#c23030";
  ctx.fillRect(x + sim.x * scale - 2, y + sim.y * scale - 2, 4, 4);
  ctx.restore();
}

export function drawStation(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  viewW: number,
  viewH: number,
  now: number,
  highlightId: string | null,
  done: Record<string, boolean> = {},
) {
  beginLoad();
  const p = pal(layer);
  const cam = cameraFor(viewW, viewH);
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, viewW, viewH);
  ctx.save();
  ctx.scale(cam.z, cam.z);
  ctx.translate(-cam.x, -cam.y);
  const t = now / 1000;
  drawFloor(ctx, layer, t);
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const ch = TILES[y]![x]!;
      if (ch === "+" || ch === "L") drawDoor(ctx, x, y, ch === "L", layer, t);
    }
  }
  drawRoomLabels(ctx, layer);

  const sprites: { y: number; row: number; draw: () => void }[] = [];
  sprites.push({
    y: sim.y,
    row: Math.floor(sim.y),
    draw: () => drawPerson(ctx, VIEWER, sim.x, sim.y, sim.facing, layer, true, t, sim.speed > 0.15),
  });
  for (const n of sim.npcs) {
    const person = CREW.find((c) => c.id === n.id) ?? crewOf(n.id);
    const dest = n.roam[n.roamI]!;
    const moving =
      sim.layer !== "observer" && n.wait <= 0 && Math.hypot(dest.x - n.px, dest.y - n.py) > 0.08;
    sprites.push({
      y: n.py,
      row: Math.floor(n.py),
      draw: () => drawPerson(ctx, person, n.px, n.py, n.facing, layer, false, t, moving),
    });
  }

  for (let y = 0; y < MAP_H; y++) {
    for (const th of THINGS) {
      if (th.kind === "door") continue;
      if (th.y !== y) continue;
      drawThing(ctx, th, layer, t, highlightId === th.id, Boolean(th.task && !done[th.task]));
    }
    for (const s of sprites) {
      if (s.row === y) s.draw();
    }
    for (let x = 0; x < MAP_W; x++) {
      if (TILES[y]![x] === "#") drawWallTile(ctx, x, y, layer);
    }
  }
  drawLighting(ctx, layer, t);
  ctx.restore();
  if (useConsole.getState().woke) drawMinimap(ctx, layer, viewW, viewH);
}

export { CREW_PAL, OBS_PAL };
