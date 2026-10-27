/** Ship seconds advanced per wall second. The watch is 8× so a kindness fits a sitting. */
export const SHIP_RATE = 8;

/** One minute is taken from the facility face every twelve ship-minutes. */
export const SEAM_EVERY_SHIP_SEC = 12 * 60;

/** How long the cut stays open, in ship seconds. About a second and a half of wall time. */
export const SEAM_OPEN_SHIP_SEC = 12;

/** Cycle 10, never written back. Later cuts add to this. */
export const BASE_GAP_MIN = 49;

const SHIP_EPOCH = 6 * 3600;

export type SeamClocks = {
  ship: string;
  facility: string;
  seams: number;
  gapMin: number;
  open: boolean;
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function hms(total: number) {
  const s = ((Math.floor(total) % 86400) + 86400) % 86400;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(sec)}`;
}

/**
 * Crew time runs straight. Facility time keeps the Cycle 10 gap and gains
 * one unlived minute at each seam. The cut is open for a short beat after.
 */
export function seamClocks(playSec: number): SeamClocks {
  const raw = Math.max(0, Math.floor(playSec * SHIP_RATE));
  const seams = Math.floor(raw / SEAM_EVERY_SHIP_SEC);
  const into = raw % SEAM_EVERY_SHIP_SEC;
  const open = seams > 0 && into < SEAM_OPEN_SHIP_SEC;
  const shipSec = SHIP_EPOCH + raw;
  const facilitySec = shipSec + (BASE_GAP_MIN + seams) * 60;
  return {
    ship: hms(shipSec),
    facility: hms(facilitySec),
    seams,
    gapMin: BASE_GAP_MIN + seams,
    open,
  };
}
