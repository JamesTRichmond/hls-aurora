import assert from "node:assert/strict";
import test from "node:test";
import { LETTER_KEPT, crewLetter, obsLetter, takeLetterOnSeam } from "./letter.ts";

const CREW = `Signed N. Park, Helios Medical, Earth. Good morning. Nothing heroic. ${LETTER_KEPT}`;
const OBS = "Template error. S-23 is Dr. Naomi Park.";

test("an unread letter keeps its last line", () => {
  assert.equal(crewLetter(CREW, false), CREW);
  assert.equal(obsLetter(OBS, false), OBS);
});

test("the cut removes the crew's last line and the study records why", () => {
  const crew = crewLetter(CREW, true);
  assert.equal(crew.includes(LETTER_KEPT), false);
  assert.equal(crew.endsWith("The last line is gone."), true);
  assert.equal(obsLetter(OBS, true).includes("Do not restore it."), true);
});

test("reading before the seam keeps the line; reading after does not return it", () => {
  assert.equal(takeLetterOnSeam(true, false), false);
  assert.equal(takeLetterOnSeam(false, false), true);
  assert.equal(takeLetterOnSeam(true, true), true);
});
