import assert from "node:assert/strict";
import test from "node:test";
import { BASE_GAP_MIN, SEAM_EVERY_SHIP_SEC, SEAM_OPEN_SHIP_SEC, SHIP_RATE, seamClocks } from "./seam.ts";

test("morning opens forty-nine minutes apart and the cut is shut", () => {
  const c = seamClocks(0);
  assert.equal(c.ship, "06:00:00");
  assert.equal(c.facility, "06:49:00");
  assert.equal(c.gapMin, BASE_GAP_MIN);
  assert.equal(c.seams, 0);
  assert.equal(c.open, false);
});

test("the first cut takes one facility minute the crew clock does not live", () => {
  const before = seamClocks(SEAM_EVERY_SHIP_SEC / SHIP_RATE - 0.2);
  const at = seamClocks(SEAM_EVERY_SHIP_SEC / SHIP_RATE);
  assert.equal(before.seams, 0);
  assert.equal(before.open, false);
  assert.equal(at.seams, 1);
  assert.equal(at.open, true);
  assert.equal(at.gapMin, BASE_GAP_MIN + 1);
  assert.equal(at.ship, "06:12:00");
  assert.equal(at.facility, "07:02:00");
});

test("the cut closes after its beat and does not rewind the crew face", () => {
  const openUntil = SEAM_EVERY_SHIP_SEC / SHIP_RATE + (SEAM_OPEN_SHIP_SEC - 1) / SHIP_RATE;
  const closed = seamClocks(SEAM_EVERY_SHIP_SEC / SHIP_RATE + SEAM_OPEN_SHIP_SEC / SHIP_RATE);
  assert.equal(seamClocks(openUntil).open, true);
  assert.equal(closed.open, false);
  assert.equal(closed.seams, 1);
  assert.equal(closed.ship, "06:12:12");
});

test("a second sitting takes a second minute", () => {
  const c = seamClocks((SEAM_EVERY_SHIP_SEC * 2) / SHIP_RATE);
  assert.equal(c.seams, 2);
  assert.equal(c.gapMin, 51);
  assert.equal(c.facility, "07:15:00");
  assert.equal(c.ship, "06:24:00");
});
