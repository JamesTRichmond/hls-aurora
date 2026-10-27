import assert from "node:assert/strict";
import test from "node:test";
import { WATCH_TASKS, phaseTalk } from "./watch.ts";

test("each kindness on the wrist points at a different place", () => {
  const places = WATCH_TASKS.map((task) => task.where);
  assert.equal(new Set(places).size, places.length);
  assert.deepEqual(places, ["seals", "radio", "thermal", "medkit", "integrity"]);
});

test("a nearby person says something else as the watch moves", () => {
  const wake = phaseTalk("S-18", "wake", "crew");
  const quiet = phaseTalk("S-18", "quiet", "crew");
  assert.equal(wake, "The ship is yours.");
  assert.notEqual(wake, quiet);
});

test("the other side of the brass does not use the crew line", () => {
  const crew = phaseTalk("S-17", "wake", "crew");
  const obs = phaseTalk("S-17", "wake", "observer");
  assert.equal(obs, "Do not answer the query.");
  assert.notEqual(crew, obs);
});

test("someone with no line stays quiet", () => {
  assert.equal(phaseTalk("S-21", "wake", "crew"), null);
  assert.equal(phaseTalk("S-21", "midwatch", "observer"), null);
});
