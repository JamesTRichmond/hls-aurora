export type BatchId = "A" | "B" | "C" | "D" | "E" | "F";
export type HairStyle =
  | "short"
  | "crop"
  | "wave"
  | "bun"
  | "long"
  | "fade"
  | "coil"
  | "pixie";
export type FaceShape = "oval" | "round" | "long" | "square";

export type PortraitSpec = {
  skin: string;
  hair: HairStyle;
  hairColor: string;
  eyes: string;
  face: FaceShape;
  facialHair: "none" | "stubble" | "beard";
};

export type CrewMember = {
  id: string;
  name: string;
  given: string;
  role: string;
  dept: string;
  batch: BatchId;
  age: number;
  origin: string;
  pronouns: string;
  portrait: PortraitSpec;
  crewBio: string;
  observerNote: string;
  status: "cryo" | "waking" | "on-duty" | "returning";
};

export type ScreenId =
  | "overview"
  | "systems"
  | "schedule"
  | "roster"
  | "message"
  | "task";

export const SCREEN_ORDER: ScreenId[] = [
  "overview",
  "systems",
  "schedule",
  "roster",
  "message",
  "task",
];

export const CREW_NAV: { id: ScreenId; label: string }[] = [
  { id: "overview", label: "Voyage" },
  { id: "systems", label: "Systems" },
  { id: "schedule", label: "Wake" },
  { id: "roster", label: "Crew" },
  { id: "message", label: "Messages" },
  { id: "task", label: "Brief" },
];

export const OBS_NAV: { id: ScreenId; label: string; code: string }[] = [
  { id: "overview", label: "Study overview", code: "01" },
  { id: "systems", label: "Subject roster", code: "02" },
  { id: "schedule", label: "Batch schedule", code: "03" },
  { id: "roster", label: "Subject detail", code: "04" },
  { id: "message", label: "Anomaly log", code: "05" },
  { id: "task", label: "Protocol control", code: "06" },
];

const YEAR_DAYS = 365.25;
export const CYCLE_DAYS = 21;
export const TOTAL_CYCLES = 72;
export const DURATION_DAYS = CYCLE_DAYS * TOTAL_CYCLES; // 1512
export const ELAPSED_DAYS = 231;
export const VELOCITY_C = 3;
export const DISTANCE_LY = Number(((VELOCITY_C * DURATION_DAYS) / YEAR_DAYS).toFixed(2)); // 12.42
export const TRAVELLED_LY = (VELOCITY_C * ELAPSED_DAYS) / YEAR_DAYS; // 1.897...
export const REMAINING_LY = DISTANCE_LY - Number(TRAVELLED_LY.toFixed(3));
export const CYCLE_DISTANCE_LY = (VELOCITY_C * CYCLE_DAYS) / YEAR_DAYS;
export const CURRENT_CYCLE = 11;
export const NEXT_CYCLE = 12;
export const TRUNCATION_MINUTES = 49;

export const VOYAGE = {
  shipName: "HLS Aurora",
  programCrew: "Helios Program",
  destination: "Helios Prime",
  star: "Vesper-4",
  corridor: "Cygnus Fold",
  distanceLy: DISTANCE_LY,
  velocityC: VELOCITY_C,
  launchIso: "2031-03-14T06:00:00.000Z",
  launchLabel: "14 March 2031 · 06:00",
  arrivalIso: "2035-05-04T06:00:00.000Z",
  arrivalCrew: "4 May 2035 · 06:00",
  arrivalSeam: "4 May 2035 · 06:49",
  nowIso: "2031-10-31T06:00:00.000Z",
  nowLabel: "31 October 2031",
  elapsedDays: ELAPSED_DAYS,
  remainingDays: DURATION_DAYS - ELAPSED_DAYS,
  durationDays: DURATION_DAYS,
  cycleDays: CYCLE_DAYS,
  totalCycles: TOTAL_CYCLES,
  currentCycle: CURRENT_CYCLE,
  nextCycle: NEXT_CYCLE,
  travelledLy: TRAVELLED_LY,
  travelledDisplay: "1.90",
  travelledFine: TRAVELLED_LY.toFixed(3),
  remainingDisplay: REMAINING_LY.toFixed(2),
  cycleDistanceDisplay: CYCLE_DISTANCE_LY.toFixed(2),
  shipClock: "06:00:00",
  facilityClock: "06:49:00",
  truncationMinutes: TRUNCATION_MINUTES,
  viewerId: "S-21",
  commsDelay: "14h 02m",
} as const;

export const STUDY = {
  code: "PX-04",
  title: "Long-duration belief under simulated transit",
  lab: "Meridian Human Factors Laboratory",
  site: "Site 19 · Interior Basin Compound",
  irb: "MHF-2030-117",
  pi: "H. Vossell, D.Phil.",
  n: 24,
  withdrawn: 0,
  inCryo: 20,
  waking: 4,
  started: "14 March 2031",
  status: "ACTIVE",
} as const;

export const BATCHES: { id: BatchId; name: string; function: string }[] = [
  { id: "A", name: "Batch A", function: "Command / first watch" },
  { id: "B", name: "Batch B", function: "Flight / propulsion" },
  { id: "C", name: "Batch C", function: "Science / systems" },
  { id: "D", name: "Batch D", function: "Power / EVA" },
  { id: "E", name: "Batch E", function: "Navigation / structure" },
  { id: "F", name: "Batch F", function: "Operations / habitat" },
];

function batchForCycle(cycle: number): BatchId {
  const ids: BatchId[] = ["A", "B", "C", "D", "E", "F"];
  return ids[(cycle - 1) % 6]!;
}

export function cycleWindow(cycle: number): { startDay: number; endDay: number; start: string; end: string } {
  const startDay = (cycle - 1) * CYCLE_DAYS;
  const endDay = cycle * CYCLE_DAYS;
  return {
    startDay,
    endDay,
    start: dateFromLaunch(startDay),
    end: dateFromLaunch(endDay),
  };
}

export function dateFromLaunch(days: number): string {
  const launch = Date.parse(VOYAGE.launchIso);
  const d = new Date(launch + days * 86400000);
  return d.toISOString().slice(0, 10);
}

export function formatLong(isoDate: string): string {
  const [y, m, day] = isoDate.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${day} ${months[(m ?? 1) - 1]} ${y}`;
}

export const CREW: CrewMember[] = [
  {
    id: "S-01",
    name: "Elena Voss",
    given: "Elena",
    role: "Commander",
    dept: "Command",
    batch: "A",
    age: 41,
    origin: "Rotterdam",
    pronouns: "she/her",
    portrait: { skin: "#c48a6a", hair: "wave", hairColor: "#2a1d14", eyes: "#3d4a2f", face: "oval", facialHair: "none" },
    crewBio: "Ship commander. Holds the fold lock and the quiet of the corridor.",
    observerNote: "High compliance. Speaks for the fiction without prompting. Do not wake off-cycle.",
    status: "cryo",
  },
  {
    id: "S-02",
    name: "Marcus Chen",
    given: "Marcus",
    role: "Chief engineer",
    dept: "Engineering",
    batch: "A",
    age: 38,
    origin: "Vancouver",
    pronouns: "he/him",
    portrait: { skin: "#d4a07a", hair: "crop", hairColor: "#1a1410", eyes: "#2c241c", face: "square", facialHair: "stubble" },
    crewBio: "Keeps the primary bus honest. Prefers a cold engine room to a briefing.",
    observerNote: "Asks fewer questions than predicted. Useful ballast for Batch A.",
    status: "cryo",
  },
  {
    id: "S-03",
    name: "Amara Okonkwo",
    given: "Amara",
    role: "Chief medical",
    dept: "Medical",
    batch: "A",
    age: 44,
    origin: "Lagos",
    pronouns: "she/her",
    portrait: { skin: "#6b3d28", hair: "coil", hairColor: "#140c08", eyes: "#2a1c14", face: "oval", facialHair: "none" },
    crewBio: "Medicine as hospitality. The crew sleep better when she is on the watch.",
    observerNote: "Reality-anchor 0.93. Has not queried the medical logs against Earth time.",
    status: "cryo",
  },
  {
    id: "S-04",
    name: "Jonah Hale",
    given: "Jonah",
    role: "Life support",
    dept: "Habitat",
    batch: "A",
    age: 29,
    origin: "Dunedin",
    pronouns: "he/him",
    portrait: { skin: "#e0b089", hair: "short", hairColor: "#c4a060", eyes: "#4a6a7a", face: "long", facialHair: "none" },
    crewBio: "Atmosphere, water, the small kindnesses of air that moves the right way.",
    observerNote: "Mild homesickness, contained. No protocol risk.",
    status: "cryo",
  },
  {
    id: "S-05",
    name: "Rhea Solis",
    given: "Rhea",
    role: "Pilot",
    dept: "Flight",
    batch: "B",
    age: 36,
    origin: "Valparaíso",
    pronouns: "she/her",
    portrait: { skin: "#b67a52", hair: "long", hairColor: "#1a120c", eyes: "#3a2a1c", face: "oval", facialHair: "none" },
    crewBio: "Hands on the corridor. Treats the fold like weather.",
    observerNote: "Boredom is the only complaint. Keep flight sims available on wake.",
    status: "cryo",
  },
  {
    id: "S-06",
    name: "Tomasz Kowal",
    given: "Tomasz",
    role: "Propulsion",
    dept: "Engineering",
    batch: "B",
    age: 42,
    origin: "Kraków",
    pronouns: "he/him",
    portrait: { skin: "#d8b090", hair: "fade", hairColor: "#3a2a20", eyes: "#2a3540", face: "square", facialHair: "beard" },
    crewBio: "Fold coils, bus ties, the long arithmetic of three times light.",
    observerNote: "Noticed coil telemetry is looped. Logged it as 'recorder overwrite' and moved on. Watch.",
    status: "cryo",
  },
  {
    id: "S-07",
    name: "Priya Nair",
    given: "Priya",
    role: "Astrobiology",
    dept: "Science",
    batch: "B",
    age: 34,
    origin: "Kochi",
    pronouns: "she/her",
    portrait: { skin: "#b06a42", hair: "wave", hairColor: "#1c1008", eyes: "#2c2018", face: "round", facialHair: "none" },
    crewBio: "Reads the greenhouse the way other people read letters from home.",
    observerNote: "Highest cohesion score in cohort. Protective of Batch B.",
    status: "cryo",
  },
  {
    id: "S-08",
    name: "Nadia Frost",
    given: "Nadia",
    role: "Communications",
    dept: "Comms",
    batch: "B",
    age: 31,
    origin: "Reykjavík",
    pronouns: "she/her",
    portrait: { skin: "#edd0b4", hair: "pixie", hairColor: "#c8b090", eyes: "#4a6a78", face: "oval", facialHair: "none" },
    crewBio: "Keeps the Earth-delay honest. Voice of the ship when the ship has nothing to say.",
    observerNote: "Display-name collision in cycle 5 brief (copy-paste). Subject is unique. See PX-A-017.",
    status: "cryo",
  },
  {
    id: "S-09",
    name: "Kai Mendoza",
    given: "Kai",
    role: "Ship systems",
    dept: "Systems",
    batch: "C",
    age: 33,
    origin: "Manila",
    pronouns: "he/him",
    portrait: { skin: "#8a5a3a", hair: "crop", hairColor: "#14100c", eyes: "#1c1814", face: "square", facialHair: "none" },
    crewBio: "The quiet inventory of what is working. Almost everything is.",
    observerNote: "Compliance 96. Will not challenge a green board.",
    status: "cryo",
  },
  {
    id: "S-10",
    name: "Yuki Tanaka",
    given: "Yuki",
    role: "Survey",
    dept: "Science",
    batch: "C",
    age: 39,
    origin: "Sapporo",
    pronouns: "she/her",
    portrait: { skin: "#e2b898", hair: "bun", hairColor: "#1a1410", eyes: "#2a2420", face: "oval", facialHair: "none" },
    crewBio: "Maps what we will step on. Helios Prime, when we arrive, already has her names.",
    observerNote: "Requested surface imagery ahead of arrival. Served simulated plates. Accepted.",
    status: "cryo",
  },
  {
    id: "S-11",
    name: "Idris Rahman",
    given: "Idris",
    role: "Crew psychology",
    dept: "Medical",
    batch: "C",
    age: 47,
    origin: "George Town",
    pronouns: "he/him",
    portrait: { skin: "#8b5a38", hair: "short", hairColor: "#1c140c", eyes: "#2c241c", face: "long", facialHair: "beard" },
    crewBio: "Watches the watch. Believes the voyage will be remembered for how ordinary it felt.",
    observerNote: "IRONY FLAG. Subject is the onboard psychologist. Reality-anchor still 0.88. If he turns, the fiction turns.",
    status: "cryo",
  },
  {
    id: "S-12",
    name: "Lila Okada",
    given: "Lila",
    role: "Agriculture",
    dept: "Habitat",
    batch: "C",
    age: 28,
    origin: "Honolulu",
    pronouns: "she/her",
    portrait: { skin: "#c48a62", hair: "long", hairColor: "#3a2010", eyes: "#3a4a38", face: "round", facialHair: "none" },
    crewBio: "Lettuce at 0.4g-equivalent, basil that insists on living. She lets it.",
    observerNote: "Stable. Greenhouse is the most convincing set on the ship.",
    status: "cryo",
  },
  {
    id: "S-13",
    name: "Soren Blake",
    given: "Soren",
    role: "EVA / safety",
    dept: "Operations",
    batch: "D",
    age: 45,
    origin: "Bergen",
    pronouns: "he/him",
    portrait: { skin: "#edc8a4", hair: "fade", hairColor: "#8a6040", eyes: "#3a5060", face: "square", facialHair: "stubble" },
    crewBio: "Would go outside if there were an outside. Until then, drills.",
    observerNote: "Cycle 10 truncated on his watch. He filed the thermal variance as within spec.",
    status: "cryo",
  },
  {
    id: "S-14",
    name: "Mei-Ling Zhou",
    given: "Mei-Ling",
    role: "Power systems",
    dept: "Engineering",
    batch: "D",
    age: 37,
    origin: "Taipei",
    pronouns: "she/her",
    portrait: { skin: "#e0b082", hair: "pixie", hairColor: "#1a1008", eyes: "#2a2018", face: "oval", facialHair: "none" },
    crewBio: "Primary bus, secondary bus, the courtesy of lights that do not flicker.",
    observerNote: "Logged facility generator dip as 'bus transfer, expected.' Convenient.",
    status: "cryo",
  },
  {
    id: "S-15",
    name: "Hannah Berg",
    given: "Hannah",
    role: "Nutrition",
    dept: "Medical",
    batch: "D",
    age: 40,
    origin: "Malmö",
    pronouns: "she/her",
    portrait: { skin: "#f0d0b0", hair: "wave", hairColor: "#c4a070", eyes: "#4a6a50", face: "oval", facialHair: "none" },
    crewBio: "Menus as morale. She will not serve the same broth twice in a watch.",
    observerNote: "No flags. Keep her on food — it is the kindest lie in the building.",
    status: "cryo",
  },
  {
    id: "S-16",
    name: "Omar Farouk",
    given: "Omar",
    role: "Hydronics",
    dept: "Habitat",
    batch: "D",
    age: 32,
    origin: "Alexandria",
    pronouns: "he/him",
    portrait: { skin: "#9a6844", hair: "crop", hairColor: "#140c08", eyes: "#2a2018", face: "long", facialHair: "stubble" },
    crewBio: "Water that remembers being used. He talks to the reclaimers.",
    observerNote: "Mild ritual behaviour around filters. Not clinical.",
    status: "cryo",
  },
  {
    id: "S-17",
    name: "Anya Petrov",
    given: "Anya",
    role: "Navigation",
    dept: "Flight",
    batch: "E",
    age: 35,
    origin: "Novosibirsk",
    pronouns: "she/her",
    portrait: { skin: "#e8c4a0", hair: "bun", hairColor: "#3a2a20", eyes: "#3a5068", face: "long", facialHair: "none" },
    crewBio: "Holds the chart. If the corridor drifts, she is the first to feel it.",
    observerNote:
      "PX-A-033. Queried gallery star-field orientation vs ephemeris, day 231 04:12. Reality-anchor 0.71. Do not answer. Re-freeze on schedule.",
    status: "returning",
  },
  {
    id: "S-18",
    name: "Diego Vargas",
    given: "Diego",
    role: "Structural",
    dept: "Engineering",
    batch: "E",
    age: 30,
    origin: "Medellín",
    pronouns: "he/him",
    portrait: { skin: "#8a4e32", hair: "short", hairColor: "#120c08", eyes: "#1c1814", face: "square", facialHair: "none" },
    crewBio: "Frames, spars, the sound a ship makes when it is not going anywhere it shouldn't.",
    observerNote: "Did not corroborate S-17. Protective of the watch. Re-freeze.",
    status: "returning",
  },
  {
    id: "S-19",
    name: "Callum Reid",
    given: "Callum",
    role: "Environmental",
    dept: "Science",
    batch: "E",
    age: 43,
    origin: "Glasgow",
    pronouns: "he/him",
    portrait: { skin: "#ddb892", hair: "short", hairColor: "#4a3020", eyes: "#3a4840", face: "oval", facialHair: "beard" },
    crewBio: "Radiation, dust, the weather of a corridor that has none.",
    observerNote: "Accepted the Cygnus-dust explanation in the Cycle 12 uplink without reading S-17.",
    status: "returning",
  },
  {
    id: "S-20",
    name: "Freya Lind",
    given: "Freya",
    role: "Inventory",
    dept: "Operations",
    batch: "E",
    age: 27,
    origin: "Tromsø",
    pronouns: "she/her",
    portrait: { skin: "#f2d2b4", hair: "pixie", hairColor: "#d8c090", eyes: "#5a7a6a", face: "round", facialHair: "none" },
    crewBio: "Counts what the rest of us forget we packed. Never short a gasket.",
    observerNote: "Youngest. High trust. Use as social glue if Batch E cohesion dips.",
    status: "returning",
  },
  {
    id: "S-21",
    name: "Jules Moreau",
    given: "Jules",
    role: "Operations",
    dept: "Command",
    batch: "F",
    age: 39,
    origin: "Lyon",
    pronouns: "he/him",
    portrait: { skin: "#c48a64", hair: "crop", hairColor: "#1c140c", eyes: "#3a342c", face: "square", facialHair: "stubble" },
    crewBio: "Takes the watch as a kindness. The ship is quieter when he is awake.",
    observerNote: "Assigned viewer for crew-facing console this cycle. High compliance. Arm Cycle 12.",
    status: "waking",
  },
  {
    id: "S-22",
    name: "Samira Al-Hassan",
    given: "Samira",
    role: "Thermal",
    dept: "Engineering",
    batch: "F",
    age: 36,
    origin: "Amman",
    pronouns: "she/her",
    portrait: { skin: "#9a6848", hair: "wave", hairColor: "#1a1008", eyes: "#2a2018", face: "oval", facialHair: "none" },
    crewBio: "Heat goes where she tells it. The thermal bus has never argued.",
    observerNote: "Will inspect the bus that 'failed' in Cycle 10. Serve the within-spec narrative.",
    status: "waking",
  },
  {
    id: "S-23",
    name: "Naomi Park",
    given: "Naomi",
    role: "Crew health",
    dept: "Medical",
    batch: "F",
    age: 41,
    origin: "Busan",
    pronouns: "she/her",
    portrait: { skin: "#e0b08a", hair: "bun", hairColor: "#1c1008", eyes: "#2c241c", face: "oval", facialHair: "none" },
    crewBio: "Baselines, sleep, the unglamorous work of people who must last.",
    observerNote:
      "SEAM. Cycle 12 uplink signed 'N. Park, Helios Medical, Earth' — template reused her name. She will see it. Pre-brief: Earthside medical director is a namesake. Do not elaborate.",
    status: "waking",
  },
  {
    id: "S-24",
    name: "Benoit Marchand",
    given: "Benoit",
    role: "Habitat",
    dept: "Habitat",
    batch: "F",
    age: 29,
    origin: "Montreal",
    pronouns: "he/him",
    portrait: { skin: "#d4a078", hair: "short", hairColor: "#2a1c10", eyes: "#3a4a58", face: "long", facialHair: "none" },
    crewBio: "Bulkheads, galley, the rooms in which a voyage becomes a life.",
    observerNote: "First wake. Expect wonder. Do not over-script it.",
    status: "waking",
  },
];

// Portrait hair "bob" isn't in the union — fix Mei-Ling to pixie/wave. We'll coerce in the component.
export function getCrew(id: string): CrewMember {
  const found = CREW.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown crew id ${id}`);
  return found;
}

export const VIEWER = getCrew(VOYAGE.viewerId);

export function crewByBatch(batch: BatchId): CrewMember[] {
  return CREW.filter((c) => c.batch === batch);
}

export type CycleRecord = {
  cycle: number;
  batch: BatchId;
  startDay: number;
  endDay: number;
  start: string;
  end: string;
  state: "complete" | "closing" | "next" | "future" | "truncated";
};

export const CYCLES: CycleRecord[] = Array.from({ length: TOTAL_CYCLES }, (_, i) => {
  const cycle = i + 1;
  const w = cycleWindow(cycle);
  let state: CycleRecord["state"] = "future";
  if (cycle < CURRENT_CYCLE) state = cycle === 10 ? "truncated" : "complete";
  else if (cycle === CURRENT_CYCLE) state = "closing";
  else if (cycle === NEXT_CYCLE) state = "next";
  return { cycle, batch: batchForCycle(cycle), ...w, state };
});

export const SYSTEMS_CREW = [
  {
    id: "fold",
    name: "Fold corridor lock",
    status: "nominal" as const,
    detail: "Lock held since insertion. Drift 0.02 arcsec, correcting.",
  },
  {
    id: "nav",
    name: "Nav ephemeris",
    status: "nominal" as const,
    detail: `Sol → Vesper-4. Distance made ${VOYAGE.travelledFine} ly. Arrival window ${VOYAGE.arrivalSeam} ± 2m.`,
  },
  {
    id: "cryo",
    name: "Cryogenic array",
    status: "advisory" as const,
    detail: "Bay 2 thermal variance ±0.4°C. Within spec. Logged 10 Oct 2031.",
  },
  {
    id: "life",
    name: "Life support",
    status: "nominal" as const,
    detail: "O₂ 21.0% · CO₂ 0.04% · cabin 21.2°C · humidity 38%.",
  },
  {
    id: "power",
    name: "Primary bus",
    status: "nominal" as const,
    detail: "Load 41%. Transfer test 10 Oct completed without crew action.",
  },
  {
    id: "water",
    name: "Water reclamation",
    status: "nominal" as const,
    detail: "Recovery 97.4%. Tanks at mission average.",
  },
  {
    id: "comms",
    name: "Deep-space uplink",
    status: "nominal" as const,
    detail: `Earth delay ${VOYAGE.commsDelay}. Queue: 1 outbound, 0 inbound pending.`,
  },
  {
    id: "habitat",
    name: "Habitat integrity",
    status: "nominal" as const,
    detail: "Pressure stable. Gallery seals checked Cycle 11.",
  },
  {
    id: "thermal",
    name: "Thermal bus",
    status: "nominal" as const,
    detail: "Radiators simulated-on-chart. Variance inside band.",
  },
  {
    id: "waste",
    name: "Waste processing",
    status: "nominal" as const,
    detail: "No backlog. Batch E closed their log.",
  },
];

export type Message = {
  id: string;
  from: string;
  to: string;
  cycle: number;
  shipTime: string;
  direction: "inbound" | "outbound";
  status: "delivered" | "in-transit";
  subject: string;
  body: string;
};

export const MESSAGES: Message[] = [
  {
    id: "mc-01",
    from: "Mission Control, Earth",
    to: "HLS Aurora, all hands",
    cycle: 1,
    shipTime: "14 Mar 2031 · 06:00:00",
    direction: "inbound",
    status: "delivered",
    subject: "Fair winds",
    body: "You are under. The corridor is open. We will keep the lights on at this end until you write from Helios Prime. Eat when you wake. Trust the schedule. It was built to be kind.\n\n— Helios Program, Mission Control",
  },
  {
    id: "mc-05",
    from: "Mission Control, Earth",
    to: "HLS Aurora, Batch B",
    cycle: 5,
    shipTime: "6 Jun 2031 · 06:00:00",
    direction: "inbound",
    status: "delivered",
    subject: "A quiet quarter",
    body: "One hundred and five days. Families asked us to say the gardens at home are ordinary, which they hoped would please you. The fold lock reports nothing we needed to wake you for. Continue.\n\n— Helios Program, Mission Control",
  },
  {
    id: "mc-11",
    from: "Mission Control, Earth",
    to: "HLS Aurora, Batch E",
    cycle: 11,
    shipTime: "20 Sep 2031 · 06:00:00",
    direction: "inbound",
    status: "delivered",
    subject: "The dust lane",
    body: "If the gallery looks a little wrong this watch, that is only Cygnus. Nav has the lane. Thank you for the uneventful hours. Sleep well when the twenty-one are done.\n\n— Helios Program, Mission Control",
  },
  {
    id: "anya-q",
    from: "A. Petrov, Nav, Cycle 11",
    to: "Mission Control, Earth",
    cycle: 11,
    shipTime: "31 Oct 2031 · 04:12:00",
    direction: "outbound",
    status: "in-transit",
    subject: "Gallery orientation vs ephemeris, day 231",
    body: "Mission Control — I reduced the gallery star field against the Cycle 11 ephemeris. Cygnus is rotated approximately eleven degrees off the predicted orientation for day 231. Either the chart is using a J2000 lock without the fold precession term, or the gallery projector is out of collimation.\n\nPlease confirm nav lock before Batch F relies on the window for watch orientation.\n\nA. Petrov",
  },
  {
    id: "mc-12",
    from: "N. Park, Helios Medical, Earth",
    to: "HLS Aurora, Batch F — Jules, Samira, Naomi, Benoit",
    cycle: 12,
    shipTime: "31 Oct 2031 · 06:00:00",
    direction: "inbound",
    status: "delivered",
    subject: "Good morning",
    body: "You are waking on schedule. The corridor remains quiet and the fold lock has held since insertion. At 1.90 light-years from Sol you are a little more than a seventh of the way to Helios Prime. Earth is proud of how uneventful this has been.\n\nYour twenty-one days are habitat work: thermal bus, crew-health baseline, integrity walkdown, and the greenhouse. Nothing heroic. That is the point. We built this ship to be kind to you.\n\nIf the gallery seems darker than you remember, that is only the Cygnus dust lane. Nav has it.\n\nWe will speak again at your sleep. Until then, eat well and log everything.\n\nN. Park\nHelios Medical, Earth",
  },
];

export const TASKS = [
  {
    ownerId: "S-21",
    title: "Watch handover",
    detail:
      "Relieve Batch E. Close their cryo seals. Read the night log once, including the outbound to Mission Control. You do not need to answer it; the delay will.",
  },
  {
    ownerId: "S-22",
    title: "Thermal bus inspection",
    detail:
      "Walk the primary and secondary loops. Cycle 10 recorded a ±0.4°C bay-2 variance, within spec. Confirm the band has held. Log, do not adjust.",
  },
  {
    ownerId: "S-23",
    title: "Crew-health baseline",
    detail:
      "Four of you, this morning: mass, sleep debt, mood, vision. Then the twenty still sleeping, remote. The ship already loves your numbers.",
  },
  {
    ownerId: "S-24",
    title: "Habitat and greenhouse",
    detail:
      "Integrity walkdown of gallery, galley, and frames. Greenhouse with Lila's notes from Cycle 9. Harvest nothing that still has a name on it.",
  },
];

export type Anomaly = {
  id: string;
  at: string;
  cycle: number;
  subject: string;
  severity: "info" | "watch" | "hold";
  title: string;
  body: string;
};

export const ANOMALIES: Anomaly[] = [
  {
    id: "PX-A-008",
    at: "14 Mar 2031 06:00",
    cycle: 1,
    subject: "—",
    severity: "info",
    title: "MC stamp lock",
    body: "All crew-facing uplink stamps quantized to cycle-start 06:00:00.000. Do not free-run the clock. Jitter would look like weather; we cannot afford weather.",
  },
  {
    id: "PX-A-017",
    at: "6 Jun 2031 06:00",
    cycle: 5,
    subject: "S-08",
    severity: "info",
    title: "Duplicate display name FROST, N.",
    body: "Cycle 5 brief copy-pasted 'N. Frost, relief comms' onto a Batch B task line that already listed S-08. Subject is unique. Corrected on later briefs. Residual in archive only.",
  },
  {
    id: "PX-A-021",
    at: "10 Oct 2031 05:11",
    cycle: 10,
    subject: "—",
    severity: "watch",
    title: "Cycle 10 truncated 49 minutes",
    body: "Site generator test. Cryo clocks paused. Crew-facing clocks were not corrected. Cumulative drift: 49 minutes. Helios Prime ETA on crew overview 4 May 2035 06:00; nav-lock fine print (facility ephemeris) 06:49. Do not reconcile in front of subjects.",
  },
  {
    id: "PX-A-029",
    at: "20 Sep 2031 11:40",
    cycle: 11,
    subject: "S-06",
    severity: "info",
    title: "Coil telemetry noticed as looped",
    body: "S-06 (prior cycle, archive) filed 'recorder overwrite' on fold-coil traces. No follow-up. Keep traces noisy.",
  },
  {
    id: "PX-A-033",
    at: "31 Oct 2031 04:12",
    cycle: 11,
    subject: "S-17",
    severity: "hold",
    title: "Unanswered stellar-field query",
    body: "S-17 reduced gallery projection against ephemeris and found an eleven-degree error. The window is a projection. Do not answer. Status: in-transit / delay 14h 02m (false). Reality-anchor 0.71, threshold 0.60. Re-freeze Batch E on schedule. Brief Cycle 12 that Cygnus is a dust lane.",
  },
  {
    id: "PX-A-034",
    at: "31 Oct 2031 06:00",
    cycle: 12,
    subject: "S-23",
    severity: "watch",
    title: "Uplink signatory collision",
    body: "Cycle 12 letter signed 'N. Park, Helios Medical, Earth'. S-23 is Dr. Naomi Park, waking this morning. Template error. Pre-brief: Earthside namesake. Do not elaborate. She is the only person on the ship who could ask the signer a question in the galley.",
  },
];

export type MetricPoint = { cycle: number; value: number };

export type SubjectMetrics = {
  id: string;
  compliance: number;
  affect: number;
  realityAnchor: number;
  sleep: number;
  cohesion: number;
  dissociation: number;
  anchorTrend: MetricPoint[];
  dissociTrend: MetricPoint[];
  flags: string[];
};

const ANCHOR_THRESH = 0.6;
const DISS_THRESH = 70;

function trend(base: number, deltas: number[]): MetricPoint[] {
  return deltas.map((d, i) => ({ cycle: 1 + i * 6, value: Number((base + d).toFixed(2)) }));
}

export const METRICS: SubjectMetrics[] = CREW.map((c) => {
  const special: Record<string, Partial<SubjectMetrics>> = {
    "S-17": {
      compliance: 91,
      affect: -0.12,
      realityAnchor: 0.71,
      sleep: 74,
      cohesion: 81,
      dissociation: 38,
      flags: ["PX-A-033", "anchor approaching threshold"],
      anchorTrend: [
        { cycle: 5, value: 0.92 },
        { cycle: 11, value: 0.84 },
        { cycle: 17, value: 0.71 },
      ],
      dissociTrend: [
        { cycle: 5, value: 12 },
        { cycle: 11, value: 21 },
        { cycle: 17, value: 38 },
      ],
    },
    "S-23": {
      compliance: 94,
      affect: 0.18,
      realityAnchor: 0.9,
      sleep: 86,
      cohesion: 88,
      dissociation: 11,
      flags: ["PX-A-034 namesake"],
    },
    "S-11": {
      compliance: 89,
      affect: 0.04,
      realityAnchor: 0.88,
      sleep: 80,
      cohesion: 77,
      dissociation: 16,
      flags: ["irony: onboard psychologist"],
    },
    "S-21": {
      compliance: 97,
      affect: 0.22,
      realityAnchor: 0.94,
      sleep: 90,
      cohesion: 85,
      dissociation: 8,
      flags: [],
    },
    "S-06": {
      compliance: 88,
      affect: -0.04,
      realityAnchor: 0.81,
      sleep: 79,
      cohesion: 74,
      dissociation: 22,
      flags: ["PX-A-029 telemetry"],
    },
  };
  const over = special[c.id] ?? {};
  return {
    id: c.id,
    compliance: over.compliance ?? 90 + (c.id.charCodeAt(3) % 8),
    affect: over.affect ?? (c.batch === "E" ? -0.02 : 0.1),
    realityAnchor: over.realityAnchor ?? 0.86 + (c.id.charCodeAt(3) % 10) / 100,
    sleep: over.sleep ?? 82,
    cohesion: over.cohesion ?? 80,
    dissociation: over.dissociation ?? 10 + (c.id.charCodeAt(3) % 9),
    flags: over.flags ?? [],
    anchorTrend:
      over.anchorTrend ??
      trend(0.9, [0, -0.02, -0.03, -0.04].slice(0, Math.ceil(CURRENT_CYCLE / 6))),
    dissociTrend:
      over.dissociTrend ??
      trend(8, [0, 2, 3, 4].slice(0, Math.ceil(CURRENT_CYCLE / 6))),
  };
});

export function metricsFor(id: string): SubjectMetrics {
  return METRICS.find((m) => m.id === id) ?? METRICS[0]!;
}

export function belowThreshold(m: SubjectMetrics): boolean {
  return m.realityAnchor < ANCHOR_THRESH || m.dissociation > DISS_THRESH;
}

export const THRESHOLDS = {
  realityAnchor: ANCHOR_THRESH,
  dissociation: DISS_THRESH,
};

export const FABRICATION: {
  quantity: string;
  crewFacing: string;
  derivation: string;
  truth: string;
}[] = [
  {
    quantity: "Launch",
    crewFacing: "14 March 2031, 06:00 ship / UTC",
    derivation: "Study start. Chosen for a clean 06:00 ritual.",
    truth: "Site 19 hangar. The ship has not moved.",
  },
  {
    quantity: "Arrival",
    crewFacing: "4 May 2035, 06:00",
    derivation: "Launch + 1512 days (72 × 21).",
    truth: "Planned study end. Same hangar. ETA fine-print 06:49 from uncorrected drift.",
  },
  {
    quantity: "Mission duration",
    crewFacing: "1,512 days (4 y 52 d)",
    derivation: "72 cycles × 21 days.",
    truth: "Identical. Cryo is real; distance is not.",
  },
  {
    quantity: "Elapsed",
    crewFacing: "231 days · 31 Oct 2031 06:00",
    derivation: "11 cycles × 21 days.",
    truth: "Facility clock 06:49. 49 min pause in Cycle 10 never written back.",
  },
  {
    quantity: "Distance, claimed",
    crewFacing: "12.42 light-years to Helios Prime (Vesper-4)",
    derivation: "3.00 c × (1512 / 365.25) = 12.4189 → 12.42.",
    truth: "Vesper-4 is a catalog fiction. Helios Prime does not exist.",
  },
  {
    quantity: "Effective velocity",
    crewFacing: "3.00 c in fold corridor",
    derivation: "Chosen so distance / time is a round 3.",
    truth: "Velocity 0. The corridor is a painted gallery.",
  },
  {
    quantity: "Distance travelled",
    crewFacing: "1.90 ly (overview) · 1.897 ly (nav lock)",
    derivation: "3.00 c × (231 / 365.25) = 1.8973. Overview rounds.",
    truth: "0. The two displays are both theatre; the third digit is for texture.",
  },
  {
    quantity: "Distance remaining",
    crewFacing: "10.52 ly",
    derivation: "12.42 − 1.90.",
    truth: "—",
  },
  {
    quantity: "This cycle",
    crewFacing: "0.17 ly in 21 days",
    derivation: "3.00 c × (21 / 365.25) = 0.1725.",
    truth: "21 days of facility time, if Cycle 12 is initiated.",
  },
  {
    quantity: "Earth comms delay",
    crewFacing: "14h 02m",
    derivation: "A number that grows too slowly to check without a table.",
    truth: "Delay is infinite and zero. Authors sit in the next room. PX-A-033 relies on this.",
  },
  {
    quantity: "Wake rhythm",
    crewFacing: "Batches A–F, 4 crew, 21 days, 12 wakes each",
    derivation: "24 ÷ 4 = 6; 72 ÷ 6 = 12.",
    truth: "Cryo cycles are the experiment. The kindness of the schedule is the treatment.",
  },
  {
    quantity: "Cycle 10 length",
    crewFacing: "21 days (shown)",
    derivation: "Should be 21 d 0 h 0 m.",
    truth: "20 d 23 h 11 m. Generator test. 49 minutes uncorrected.",
  },
];

export const SEAMS = [
  {
    id: "seam-clock",
    findable: "second pass",
    where: "Crew Systems, nav-lock fine print vs Voyage overview ETA",
    what: "Overview: arrival 4 May 2035 06:00. Nav lock: 4 May 2035 06:49 ± 2m. The 49 minutes are Cycle 10's uncorrected pause (PX-A-021).",
  },
  {
    id: "seam-park",
    findable: "second pass",
    where: "Crew Messages, Cycle 12 letter, signatory",
    what: "Letter signed N. Park, Helios Medical, Earth. Dr. Naomi Park (S-23) is waking on this watch. Observer PX-A-034.",
  },
  {
    id: "seam-stamp",
    findable: "second pass",
    where: "Every Mission Control timestamp",
    what: "All inbound stamps are exactly 06:00:00. No human jitter. PX-A-008.",
  },
  {
    id: "seam-anya",
    findable: "first pass on the message thread; full meaning only with the toggle",
    where: "Crew Messages outbound; Observer Anomaly PX-A-033",
    what: "Anya Petrov asked about the gallery stars. The letter says the delay will answer. It will not.",
  },
];

export const STARS: { x: number; y: number; r: number; o: number }[] = [
  [40, 36, 0.8, 0.45],
  [72, 80, 1.1, 0.7],
  [96, 24, 0.6, 0.35],
  [130, 58, 1.4, 0.85],
  [168, 20, 0.7, 0.4],
  [190, 96, 1.0, 0.6],
  [220, 44, 0.5, 0.3],
  [250, 78, 1.2, 0.75],
  [280, 18, 0.9, 0.5],
  [310, 110, 0.6, 0.35],
  [340, 36, 1.3, 0.8],
  [370, 88, 0.7, 0.4],
  [400, 28, 0.5, 0.3],
  [430, 64, 1.1, 0.7],
  [460, 120, 0.8, 0.45],
  [490, 22, 1.0, 0.55],
  [520, 72, 0.6, 0.35],
  [550, 40, 1.5, 0.9],
  [580, 98, 0.7, 0.4],
  [610, 16, 0.9, 0.5],
  [640, 60, 1.2, 0.75],
  [670, 108, 0.5, 0.3],
  [700, 34, 1.0, 0.65],
  [730, 80, 0.8, 0.45],
  [58, 140, 0.6, 0.35],
  [110, 160, 1.1, 0.7],
  [160, 132, 0.5, 0.28],
  [210, 170, 0.9, 0.5],
  [270, 148, 1.3, 0.8],
  [330, 176, 0.6, 0.33],
  [390, 150, 1.0, 0.6],
  [450, 178, 0.7, 0.4],
  [510, 142, 1.2, 0.72],
  [570, 168, 0.5, 0.3],
  [630, 152, 0.9, 0.5],
  [690, 180, 0.6, 0.34],
  [80, 210, 1.0, 0.55],
  [140, 198, 0.7, 0.38],
  [200, 230, 0.8, 0.45],
  [260, 206, 1.4, 0.82],
  [320, 240, 0.5, 0.28],
  [380, 214, 1.1, 0.68],
  [440, 236, 0.6, 0.33],
  [500, 208, 0.9, 0.5],
  [560, 244, 0.7, 0.4],
  [620, 218, 1.2, 0.7],
  [680, 238, 0.5, 0.3],
  [24, 260, 0.8, 0.42],
  [90, 280, 0.6, 0.32],
  [150, 268, 1.0, 0.58],
  [210, 290, 0.7, 0.38],
  [290, 270, 1.3, 0.78],
  [360, 292, 0.5, 0.3],
  [420, 266, 0.9, 0.5],
  [490, 288, 0.6, 0.34],
  [560, 272, 1.1, 0.66],
  [640, 294, 0.7, 0.4],
  [720, 276, 0.8, 0.44],
  [48, 320, 1.2, 0.7],
  [120, 340, 0.5, 0.28],
  [180, 318, 0.9, 0.5],
  [240, 346, 0.6, 0.33],
  [310, 322, 1.0, 0.6],
  [380, 348, 0.7, 0.38],
  [460, 326, 1.4, 0.84],
  [530, 350, 0.5, 0.3],
  [600, 330, 0.8, 0.45],
  [670, 352, 0.6, 0.34],
  [70, 380, 0.9, 0.5],
  [140, 368, 0.6, 0.32],
  [220, 392, 1.1, 0.65],
  [300, 374, 0.5, 0.28],
  [370, 396, 0.8, 0.44],
  [450, 378, 1.2, 0.72],
  [540, 398, 0.7, 0.38],
  [620, 382, 0.9, 0.5],
  [700, 400, 0.6, 0.33],
  [30, 420, 0.7, 0.36],
  [100, 440, 1.0, 0.55],
  [190, 428, 0.5, 0.28],
  [280, 448, 0.8, 0.42],
  [360, 430, 1.3, 0.76],
  [440, 452, 0.6, 0.32],
  [520, 434, 0.9, 0.5],
  [600, 450, 0.7, 0.38],
  [680, 432, 1.1, 0.64],
  [740, 448, 0.5, 0.3],
].map(([x, y, r, o]) => ({ x, y, r, o }));

export const REVEAL_PAIRS = [
  {
    id: "wake",
    title: "The wake itself",
    crewScreen: "schedule" as ScreenId,
    obsScreen: "task" as ScreenId,
    prompt: "Batch E returns to the cold. Batch F is brought up. One schedule, two meanings.",
  },
  {
    id: "message",
    title: "A letter from Earth",
    crewScreen: "message" as ScreenId,
    obsScreen: "message" as ScreenId,
    prompt: "Mission Control is kind. The signatory is waking in the next room.",
  },
  {
    id: "systems",
    title: "A system that is fine",
    crewScreen: "systems" as ScreenId,
    obsScreen: "message" as ScreenId,
    prompt: "All boards green. The only advisory is the scar of a generator test.",
  },
  {
    id: "question",
    title: "A question nobody answers",
    crewScreen: "message" as ScreenId,
    obsScreen: "roster" as ScreenId,
    prompt: "Anya Petrov asked about the stars. The delay is the answer.",
  },
] as const;
