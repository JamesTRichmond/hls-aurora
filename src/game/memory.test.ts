import assert from "node:assert/strict";
import test from "node:test";
import { emptyWatchMemory, parseWatchMemory, serializeWatchMemory } from "./memory.ts";

test("a missing save is an unstarted watch", () => {
  assert.deepEqual(parseWatchMemory(null), emptyWatchMemory());
  assert.deepEqual(parseWatchMemory("not json"), emptyWatchMemory());
});

test("an unknown version is refused rather than guessed", () => {
  const raw = JSON.stringify({ version: 99, cycle12Initiated: true, woke: true, simTime: 90 });
  assert.deepEqual(parseWatchMemory(raw), emptyWatchMemory());
});

test("a version 1 save keeps the vows and does not invent a place", () => {
  const back = parseWatchMemory(
    JSON.stringify({
      version: 1,
      cycle12Initiated: true,
      done: { handover: true },
      woke: true,
      simTime: 400,
      x: 10,
      y: 8,
    }),
  );
  assert.equal(back.version, 2);
  assert.equal(back.cycle12Initiated, true);
  assert.equal(back.woke, true);
  assert.equal(back.done.handover, true);
  assert.equal(back.simTime, 0);
  assert.equal(back.x, null);
  assert.equal(back.y, null);
  assert.equal(back.letterTaken, false);
});

test("the clock, the deck, and the letter survive a round trip", () => {
  const saved = serializeWatchMemory({
    version: 2,
    cycle12Initiated: true,
    done: { handover: true, thermal: true, forged: true },
    asked: { "S-17": true, "<script>": true, "": true },
    woke: true,
    pulledOnce: true,
    hintSeen: true,
    simTime: 90,
    x: 4.5,
    y: 6.2,
    facing: 1.2,
    letterRead: true,
    letterTaken: false,
  });
  const back = parseWatchMemory(saved);
  assert.equal(back.cycle12Initiated, true);
  assert.equal(back.simTime, 90);
  assert.equal(back.x, 4.5);
  assert.equal(back.y, 6.2);
  assert.equal(back.facing, 1.2);
  assert.equal(back.letterRead, true);
  assert.equal(back.letterTaken, false);
  assert.deepEqual(back.done, { handover: true, thermal: true });
  assert.deepEqual(back.asked, { "S-17": true });
});

test("a false initiate does not become a true one", () => {
  const back = parseWatchMemory(JSON.stringify({ version: 1, cycle12Initiated: "yes" }));
  assert.equal(back.cycle12Initiated, false);
});

test("a position off the deck is dropped and the clock is kept", () => {
  const back = parseWatchMemory(JSON.stringify({ version: 2, simTime: 12, x: 400, y: 6 }));
  assert.equal(back.simTime, 12);
  assert.equal(back.x, null);
  assert.equal(back.y, null);
});
