import {
  CREW,
  VIEWER,
  VOYAGE,
  type CrewMember,
} from "@/lib/mission";

export const MAP_W = 32;
export const MAP_H = 20;
export const TILE = 48;

export type TileCh =
  | "#"
  | "+"
  | "L"
  | "."
  | ","
  | "~"
  | "c"
  | "m"
  | "s"
  | "o"
  | "g"
  | "e";

export type Intent = "examine" | "use" | "ask";

export type ThingKind =
  | "viewport"
  | "cryo"
  | "seals"
  | "fold"
  | "radio"
  | "letter"
  | "log"
  | "coffee"
  | "bunk"
  | "power"
  | "atmos"
  | "thermal"
  | "plant"
  | "eva"
  | "medkit"
  | "integrity"
  | "clock"
  | "water"
  | "door"
  | "locker"
  | "plate";

export type ThingItem = {
  id: string;
  crewName: string;
  obsName: string;
  crewExamine: string;
  obsExamine: string;
};

export type Thing = {
  id: string;
  kind: ThingKind;
  x: number;
  y: number;
  solid: boolean;
  crewName: string;
  obsName: string;
  crewExamine: string;
  obsExamine: string;
  crewUse: string;
  obsUse: string;
  crewAsk: string;
  obsAsk: string;
  task?: string;
  access?: "open" | "command";
  open?: boolean;
  itemsLabel?: { crew: string; obs: string };
  items?: ThingItem[];
  crewResidue?: string;
};

export type RoomId =
  | "gallery"
  | "spine"
  | "cryo"
  | "command"
  | "habitat"
  | "comms"
  | "systems"
  | "greenhouse"
  | "eva";

export type Room = {
  id: RoomId;
  crewName: string;
  obsName: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const ROOMS: Room[] = [
  { id: "gallery", crewName: "Gallery", obsName: "Projection hall", x: 1, y: 1, w: 30, h: 3 },
  { id: "cryo", crewName: "Cryo bay 2", obsName: "Sleep lab", x: 1, y: 5, w: 6, h: 4 },
  { id: "spine", crewName: "Spine", obsName: "Central corridor", x: 7, y: 5, w: 16, h: 4 },
  { id: "command", crewName: "Fold lock", obsName: "PI office", x: 23, y: 5, w: 8, h: 4 },
  { id: "comms", crewName: "Comms", obsName: "Uplink booth", x: 1, y: 10, w: 6, h: 4 },
  { id: "habitat", crewName: "Habitat", obsName: "Subject quarters", x: 7, y: 10, w: 10, h: 4 },
  { id: "systems", crewName: "Systems", obsName: "Plant room", x: 17, y: 10, w: 14, h: 4 },
  { id: "greenhouse", crewName: "Greenhouse", obsName: "Grow set", x: 1, y: 15, w: 15, h: 4 },
  { id: "eva", crewName: "EVA lock", obsName: "Costume store", x: 16, y: 15, w: 15, h: 4 },
];

function blank(ch: TileCh): TileCh[][] {
  return Array.from({ length: MAP_H }, () => Array.from({ length: MAP_W }, () => ch));
}

function fill(g: TileCh[][], x: number, y: number, w: number, h: number, ch: TileCh) {
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const yy = y + j;
      const xx = x + i;
      if (yy >= 0 && yy < MAP_H && xx >= 0 && xx < MAP_W) g[yy]![xx] = ch;
    }
  }
}

function buildTiles(): TileCh[][] {
  const g = blank("#");
  fill(g, 1, 1, 30, 3, "~");
  fill(g, 1, 5, 6, 4, ".");
  fill(g, 7, 5, 16, 4, ",");
  fill(g, 23, 5, 8, 4, "m");
  fill(g, 1, 10, 6, 4, "o");
  fill(g, 7, 10, 10, 4, ".");
  fill(g, 17, 10, 14, 4, "s");
  fill(g, 1, 15, 15, 4, "g");
  fill(g, 16, 15, 15, 4, "e");
  g[4]![12] = "+";
  g[7]![6] = "+";
  g[7]![22] = "L";
  g[9]![10] = "+";
  g[9]![20] = "+";
  g[11]![6] = "+";
  g[11]![16] = "+";
  g[14]![8] = "+";
  g[14]![22] = "+";
  return g;
}

export const TILES: TileCh[][] = buildTiles();

export const SPAWN = { x: 4.55, y: 6.4, facing: -Math.PI / 2 };

export const THINGS: Thing[] = [
  {
    id: "viewport-center",
    kind: "viewport",
    x: 12,
    y: 2,
    solid: true,
    crewName: "Gallery window",
    obsName: "Projection plate 231",
    crewExamine:
      "The Cygnus Fold, held. Dust like breath on glass. The corridor looks a little darker than you remember, which the letter said it would.",
    obsExamine:
      "A six-metre screen. Star catalog baked 14 March and never updated. The eleven-degree error S-17 found is the projector's keystone, not the sky.",
    crewUse: "You rest a palm on the glass. It is cool, the way a window on a ship should be.",
    obsUse: "Surface temperature 21.1°C. The cool is a Peltier strip behind the pane. Do not service on-shift.",
    crewAsk:
      "You ask the window whether Cygnus is where it should be. The window, being a window, does not answer. Anya already asked for you.",
    obsAsk: "Query logged against PX-A-033. Do not answer. Re-freeze Batch E on schedule.",
    crewResidue: "The dark is a fraction warmer than vacuum. You do not write that down.",
    itemsLabel: { crew: "In the glass", obs: "Plate 231" },
    items: [
      {
        id: "glass-dust",
        crewName: "Dust lane",
        obsName: "Baked catalog band",
        crewExamine: "Breath on the corridor. Callum will call it Cygnus. Anya will not.",
        obsExamine: "Star catalog 14 March. The bright band is a diode row. Do not correct.",
      },
      {
        id: "glass-eleven",
        crewName: "A tilt you almost have a number for",
        obsName: "Keystone 11°",
        crewExamine: "The held sky is a little off, the way a painting is off when you stand too close.",
        obsExamine: "Projector keystone. S-17 measured it. Do not confirm.",
      },
      {
        id: "glass-cool",
        crewName: "The cool",
        obsName: "Peltier strip",
        crewExamine: "Palm-temperature. A window on a ship should feel like this.",
        obsExamine: "21.1°C. The cool is hardware. Do not service on-shift.",
      },
    ],
  },
  {
    id: "viewport-west",
    kind: "viewport",
    x: 5,
    y: 2,
    solid: true,
    crewName: "Port gallery",
    obsName: "Plate 231 · west",
    crewExamine: "Port light. Same dust. Same held corridor. You could watch this for a whole watch and call it work.",
    obsExamine: "Same feed as the centre plate, delayed 8 frames so the hall does not look tiled.",
    crewUse: "The glass hums, very softly. Fold weather, if you want it to be.",
    obsUse: "Fan in the screen chassis. Subjects call it weather.",
    crewAsk: "You ask if anyone is looking back. The delay is fourteen hours. Nobody is.",
    obsAsk: "Uplink authors are in the next room. They are looking. Flag if S-21 lingers > 90s.",
  },
  {
    id: "viewport-east",
    kind: "viewport",
    x: 20,
    y: 2,
    solid: true,
    crewName: "Starboard gallery",
    obsName: "Plate 231 · east",
    crewExamine: "Starboard. Vesper-4 is still a point you cannot resolve. That is correct. You are only 1.90 ly out.",
    obsExamine: "Vesper-4 is not in the catalog. The bright point is a diode.",
    crewUse: "You align your watch to the fake horizon out of habit. It holds.",
    obsUse: "Horizon is a painted strip. Alignment is the treatment.",
    crewAsk: "You ask the ship if the chart is using a J2000 lock. The ship does not speak charts.",
    obsAsk: "This is S-17's question in another mouth. Hold reply.",
  },
  {
    id: "pod-anya",
    kind: "cryo",
    x: 2,
    y: 5,
    solid: true,
    crewName: "Cryo pod · Anya",
    obsName: "Sleep tube A-09",
    crewExamine:
      "Her name is on the slate. Condensation beads on the brass. Through the glass: an empty berth, waiting. She is still walking.",
    obsExamine:
      "S-17. Tube A-09 open-scheduled. Reality-anchor 0.71. Interior unoccupied. Re-freeze on schedule even if she is still looking at the plate.",
    crewUse: "The latch will not open for you. That is the courtesy.",
    obsUse: "Nameplate is a printed card. Do not let her take it into the gallery.",
    crewAsk: "Sleepers are not for asking. You ask the slate instead. It only has her name.",
    obsAsk: "Do not discuss Cycle 10 with subjects.",
    itemsLabel: { crew: "Through the glass", obs: "Tube interior" },
    items: [
      {
        id: "anya-slate",
        crewName: "Name slate",
        obsName: "Printed card A-09",
        crewExamine: "PETROV, A. Written in a rounder hand than the rest of the ship. The slate is cold.",
        obsExamine: "Card stock. S-17. Do not let her take it into the gallery.",
      },
      {
        id: "anya-berth",
        crewName: "Empty berth",
        obsName: "Unoccupied lining",
        crewExamine: "Padding still holds a person-shape that is not here. She walked.",
        obsExamine: "Occupancy 0. EEG leads clipped to the rail, unused this morning.",
      },
      {
        id: "anya-frost",
        crewName: "Gasket frost",
        obsName: "Seal condensate",
        crewExamine: "Beads on the brass. Within spec. The pod can wait.",
        obsExamine: "Thermal variance ±0.4°C leftover from Cycle 10. Not a fault. Do not discuss.",
      },
    ],
  },
  {
    id: "pod-sleeper",
    kind: "cryo",
    x: 3,
    y: 5,
    solid: true,
    crewName: "Cryo pod · Bay 2",
    obsName: "Sleep tube S-18",
    crewExamine:
      "Sealed. Through the glass: a dark berth, frost on the gasket, a pulse lamp ticking. Diego will lie down here before noon.",
    obsExamine: "S-18 assigned. Interior armed. EEG leads stowed. Thermal variance ±0.4°C is the Cycle 10 leftover, not a fault.",
    crewUse: "You check the seal with two fingers. It will take a body when it is asked.",
    obsUse: "Seal integrity 0.998. Arm when S-18 is recumbent.",
    crewAsk: "You ask the pod if the ±0.4° was nothing. The pod, being kind, says nothing.",
    obsAsk: "Do not discuss Cycle 10 with subjects.",
    itemsLabel: { crew: "Through the glass", obs: "Tube interior" },
    items: [
      {
        id: "sleep-lamp",
        crewName: "Pulse lamp",
        obsName: "Standby LED",
        crewExamine: "A small kindness in the dark. It ticks like a watch that is not the ship's.",
        obsExamine: "Green. Ready. Do not interpret as occupied.",
      },
      {
        id: "sleep-leads",
        crewName: "Leads, stowed",
        obsName: "EEG harness",
        crewExamine: "Coiled against the rail. They will find a temple when he lies down.",
        obsExamine: "S-18 kit complete. Arm on recumbency.",
      },
      {
        id: "sleep-frost",
        crewName: "Gasket frost",
        obsName: "Seal band",
        crewExamine: "Within spec. You do not adjust.",
        obsExamine: "±0.4°C. Serve the within-spec narrative.",
      },
    ],
  },
  {
    id: "pod-empty",
    kind: "cryo",
    x: 4,
    y: 5,
    solid: true,
    crewName: "Spare berth",
    obsName: "Unassigned tube",
    crewExamine: "Spare berth. Lid shut. Through the glass the padding is unused, the slate blank, the glass clear.",
    obsExamine: "Unassigned tube. Occupancy log blank. Interior unused. Keep it that way this cycle.",
    crewUse: "The lid stays shut. You do not need a spare this morning.",
    obsUse: "Lid locked. No occupant scheduled.",
    crewAsk: "You ask who it is for. The glass has no answer.",
    obsAsk: "Do not invent an occupant.",
    itemsLabel: { crew: "Through the glass", obs: "Tube interior" },
    items: [
      {
        id: "empty-slate",
        crewName: "Blank slate",
        obsName: "Unprinted card",
        crewExamine: "No name. The courtesy of an empty berth.",
        obsExamine: "Stock card. Do not write one.",
      },
      {
        id: "empty-pad",
        crewName: "Unused padding",
        obsName: "Factory lining",
        crewExamine: "It has never held anyone you know. It smells like new cloth and cold.",
        obsExamine: "No residual heat. No DNA note. Fine.",
      },
    ],
  },
  {
    id: "pod-open",
    kind: "cryo",
    x: 5,
    y: 5,
    solid: true,
    open: true,
    crewName: "Your pod",
    obsName: "Sleep tube S-21",
    crewExamine:
      "The lid is up. Cycle 12. You can look all the way in: the berth still knows your shape, frost on the inner glass, your name on the slate.",
    obsExamine:
      "S-21. Open-state. Interior exposed. Batch F of Cycle 12. Generator dip: 49 minutes. Do not reconcile the crew clock.",
    crewUse: "You close the lid. It will not take you back. Not until the watch is done.",
    obsUse: "Open-state logged. Do not reseal until close-out.",
    crewAsk: "You ask if anyone watched you wake. The pod, being kind, says nothing.",
    obsAsk: "They did. CCTV bay-2. Do not say so.",
    itemsLabel: { crew: "Interior", obs: "Tube interior · S-21" },
    items: [
      {
        id: "open-berth",
        crewName: "Your berth",
        obsName: "Recumbent lining",
        crewExamine:
          "The foam remembers a person. You. The indent is still warm at the shoulders, cold at the feet. You stood up too fast, the way they taught you.",
        obsExamine: "Subject-shaped residual. Thermal map fading. Motor function confirmed at thaw.",
      },
      {
        id: "open-glass",
        crewName: "Inner glass",
        obsName: "Viewport condensate",
        crewExamine:
          "Your frost is still on it. A palm-print you do not remember making. Cycle 12 written in the fog if you want it to be.",
        obsExamine: "Condensate pattern matches Batch F thaw. Do not photograph for the subject PDA.",
      },
      {
        id: "open-slate",
        crewName: "Name slate",
        obsName: "Occupancy tag",
        crewExamine: "MOREAU, J. Someone in Batch E turned the corner down. The letters are still kind.",
        obsExamine: "S-21 / Batch F / Cycle 12. Printed. Do not let him pocket the card.",
      },
      {
        id: "open-leads",
        crewName: "Leads, unclipped",
        obsName: "EEG harness",
        crewExamine: "They let go when you sat up. A courtesy. They hang like they are still listening.",
        obsExamine: "Unclipped at 06:00. Waveform archived. No flag.",
      },
      {
        id: "open-gasket",
        crewName: "Open gasket",
        obsName: "Seal ring",
        crewExamine: "Brass. Cold. It will take a body again at the end of the watch, if you are kind.",
        obsExamine: "Integrity 0.998. Do not reseal until close-out.",
      },
    ],
    crewResidue: "You remember being watched sitting up. The pod, being kind, still says nothing.",
  },
  {
    id: "cycle-plate",
    kind: "plate",
    x: 1,
    y: 6,
    solid: true,
    crewName: "Cycle plate",
    obsName: "Batch plate",
    crewExamine: "12. The voyage continues.",
    obsExamine: "Crew face reads 12. Facility clock is 06:49. Generator dip: 49 minutes. Do not reconcile the crew clock.",
    crewUse: "You touch the brass. It is warm from the room, not from a sun.",
    obsUse: "Do not correct the numeral in front of subjects.",
    crewAsk: "You ask how many plates have hung here. The plate only has this morning.",
    obsAsk: "PX-A-008. Hold.",
    crewResidue: "You remember 06:49 and you did not read a clock.",
  },
  {
    id: "cryo-locker",
    kind: "locker",
    x: 5,
    y: 6,
    solid: true,
    crewName: "Your locker",
    obsName: "Subject kit 21",
    crewExamine:
      "Door ajar. Counted at thaw. The jumpsuit is folded square, the boots still warm, the PDA waiting in the left pocket.",
    obsExamine: "Subject kit S-21. Issued, not owned. Inventory complete at thaw. No hole.",
    crewUse: "You dress. The watch does not wait. The square remembers who folded it.",
    obsUse: "Kit issued. Suit on subject. No inventory hole.",
    crewAsk: "You ask the locker who folded the square. Someone who wanted you to have a quiet twenty-one.",
    obsAsk: "S-20, Cycle 11 close-out. Do not name her to him.",
    itemsLabel: { crew: "Contents", obs: "Kit 21" },
    items: [
      {
        id: "lock-suit",
        crewName: "Navy jumpsuit",
        obsName: "Suit PX-04-21",
        crewExamine:
          "Folded hospital-square. The cloth still holds the pod's cold. A name tape: MOREAU. It is yours because they said so.",
        obsExamine: "Serial PX-04-21. Issued, not owned. Size logged against S-21 baseline.",
      },
      {
        id: "lock-boots",
        crewName: "Boots",
        obsName: "Footwear 21",
        crewExamine: "Still warm. You were standing in them in a dream you are not allowed to keep.",
        obsExamine: "Residual heat from thaw handling. Counted. Pair complete.",
      },
      {
        id: "lock-pda",
        crewName: "PDA",
        obsName: "Subject handheld",
        crewExamine:
          "Left pocket, face down, the way Batch E leaves a kindness. Tab will wake it. The letter is already in it.",
        obsExamine: "Clone of Cycle 12 template. Earthside namesake note pre-loaded. Do not elaborate.",
      },
      {
        id: "lock-lanyard",
        crewName: "Watch lanyard",
        obsName: "ID reel",
        crewExamine: "Helios brass, dull. Your ID will kiss doors and be refused, politely.",
        obsExamine: "No staff bit. Command door will deny. Correct.",
      },
      {
        id: "lock-gasket",
        crewName: "A spare gasket",
        obsName: "Prop gasket",
        crewExamine: "Freya put it here as a joke. Nothing that has a name is missing. You leave it.",
        obsExamine: "S-20, Cycle 11. Play. Permitted. Not inventory.",
      },
    ],
  },
  {
    id: "seals",
    kind: "seals",
    x: 2,
    y: 8,
    solid: false,
    crewName: "Bay-2 seal board",
    obsName: "Sleep-lab close-out",
    crewExamine: "Four seals. Batch E still open. Your first kindness this watch is to close them after they lie down.",
    obsExamine: "Close-out is the Cycle 11 endpoint. S-21's assigned handover. Compliance high if he does it himself.",
    crewUse: "You arm the board. The lights go from advisory to waiting. The couches will finish the rest.",
    obsUse: "Close-out armed. Cycle 11 → 12 handoff may proceed.",
    crewAsk: "You ask if anyone ever stayed up. The board has no such log.",
    obsAsk: "Withdrawn = 0. Do not invent a precedent.",
    task: "handover",
  },
  {
    id: "fold",
    kind: "fold",
    x: 26,
    y: 6,
    solid: true,
    crewName: "Fold corridor lock",
    obsName: "Dummy lock / PI desk",
    crewExamine: "Lock held since insertion. Drift 0.02 arcsec, correcting. You do not have command on your ID.",
    obsExamine: "A prop with a looping trace. Vossell's notes under the desk. Subjects must not enter.",
    crewUse: "Your ID kisses the reader and is refused, politely.",
    obsUse: "Access denied is the fiction. The door is a staff lock.",
    crewAsk: "You ask the lock if it has ever slipped. It has not, not that it would tell you.",
    obsAsk: "It cannot slip. It is not connected to anything that moves.",
    crewResidue: "Under the desk, a square of paper you cannot see from this side of the door.",
    itemsLabel: { crew: "The lock", obs: "PI blotter" },
    items: [
      {
        id: "fold-trace",
        crewName: "Fold trace",
        obsName: "Looping dummy",
        crewExamine: "0.02 arcsec, correcting. The corridor is held.",
        obsExamine: "A gif of a lock. It cannot slip. It is not connected to anything that moves.",
      },
      {
        id: "fold-notes",
        crewName: "A drawer you cannot open",
        obsName: "Vossell's notes",
        crewExamine: "Command only. Elena is sleeping. The drawer can wait twelve cycles.",
        obsExamine: "Cycle 10, generator, do not reconcile. Hidden 05:40. Subjects must not enter.",
      },
    ],
  },
  {
    id: "command-door",
    kind: "door",
    x: 22,
    y: 7,
    solid: false,
    access: "command",
    crewName: "Command door",
    obsName: "Staff lock",
    crewExamine: "Fold lock beyond. Command only. Elena is sleeping; the door can wait twelve cycles.",
    obsExamine: "PI office. Badge reader is live. Subjects: deny.",
    crewUse: "The reader thanks you for trying and does not open.",
    obsUse: "Logged. S-21 does not have staff. Correct.",
    crewAsk: "You ask who last stood here. The reader remembers Elena, and nobody else this year.",
    obsAsk: "Last staff entry: Vossell, 05:40, to hide the Cycle 10 note.",
  },
  {
    id: "pi-notes",
    kind: "log",
    x: 27,
    y: 7,
    solid: true,
    crewName: "A desk you should not see",
    obsName: "Vossell notes",
    crewExamine: "You should not be here. The lock was kind enough to refuse you.",
    obsExamine:
      "Vossell, 05:40. Cycle 10 generator dip: 49 minutes. Do not reconcile the crew clock. Hide this if S-21 approaches the lock.",
    crewUse: "You do not touch it.",
    obsUse: "The Cycle 10 note stays under the blotter. Facility clock remains 06:49.",
    crewAsk: "You ask the desk who sat here. It does not answer people without command.",
    obsAsk: "Do not file this in the subject PDA.",
  },
  {
    id: "facility-clock",
    kind: "clock",
    x: 25,
    y: 6,
    solid: false,
    crewName: "A second face",
    obsName: "Facility clock",
    crewExamine: "A clock that is not the ship's. You were not meant to read it.",
    obsExamine: "06:49. Forty-nine minutes uncorrected from Cycle 10. The crew-facing face still says 06:00.",
    crewUse: "You look away. The watch is six.",
    obsUse: "Do not reconcile in front of subjects.",
    crewAsk: "You ask why there are two mornings. The clock only has this one.",
    obsAsk: "PX-A-008. Hold.",
  },
  {
    id: "radio",
    kind: "radio",
    x: 3,
    y: 11,
    solid: true,
    crewName: "Deep-space uplink",
    obsName: "Local author bench",
    crewExamine: `Earth delay ${VOYAGE.commsDelay}. Queue: 1 outbound, 0 inbound pending. Anya's letter is still in the corridor.`,
    obsExamine: "There is no corridor. Authors sit behind this bulkhead. The delay is a courtesy they extend to themselves.",
    crewUse: "You open the queue. The letter from Earth is already on the desk. The outbound still says in-transit.",
    obsUse: "Opens the workstation view. Do not reply to PX-A-033 from this bench during wake.",
    crewAsk: "You ask how a letter arrives at 06:00 exactly, every cycle. The radio is proud of its punctuality.",
    obsAsk: "PX-A-008. Stamps quantized to cycle-start. Do not free-run the clock.",
    task: "nightlog",
  },
  {
    id: "letter",
    kind: "letter",
    x: 2,
    y: 12,
    solid: false,
    crewName: "Letter from Earth",
    obsName: "Cycle 12 template",
    crewExamine:
      "Signed N. Park, Helios Medical, Earth. Good morning. Nothing heroic. If the gallery seems darker, that is only Cygnus.",
    obsExamine:
      "Template error. S-23 is Dr. Naomi Park, waking twenty metres from this desk. Pre-brief: Earthside namesake. Do not elaborate.",
    crewUse: "You fold the letter the way you were taught and put it in your pocket, which is the PDA.",
    obsUse: "Hardcopy is a prop. Digital copy is in the subject PDA already.",
    crewAsk: "You ask whether N. Park is Naomi. The letter, being paper, does not hear you.",
    obsAsk: "She will ask. Hold the namesake line. Do not elaborate.",
  },
  {
    id: "log",
    kind: "log",
    x: 4,
    y: 12,
    solid: true,
    crewName: "Night log",
    obsName: "Cycle 11 residue",
    crewExamine:
      "A. Petrov, 04:12. Gallery orientation vs ephemeris. Cygnus rotated eleven degrees. She would like nav lock confirmed before your watch uses the window.",
    obsExamine: "PX-A-033. Status hold. Do not confirm. Brief Cycle 12 that Cygnus is a dust lane.",
    crewUse: "You mark the log read. You do not answer it. The delay will, the brief says.",
    obsUse: "S-21 read the query. Good. He is not to answer.",
    crewAsk: "You ask the log whether eleven degrees is weather. The log only has Anya's question.",
    obsAsk: "Weather is the approved word. Do not improve it.",
    task: "nightlog",
  },
  {
    id: "coffee",
    kind: "coffee",
    x: 12,
    y: 12,
    solid: true,
    crewName: "Galley urn",
    obsName: "Urn",
    crewExamine: "Coffee. Hannah would not serve the same broth twice; this is not broth, and she is sleeping.",
    obsExamine: "Institutional roast. The kindest lie in the building is still food. Keep it hot.",
    crewUse: "You pour. It is ordinary. That is the point.",
    obsUse: "Caffeine logged. No protocol value.",
    crewAsk: "You ask the urn if Earth coffee still tastes like this. It does not know Earth.",
    obsAsk: "It is Earth. Do not say so.",
  },
  {
    id: "bunk-jules",
    kind: "bunk",
    x: 9,
    y: 13,
    solid: true,
    crewName: "Your bunk",
    obsName: "S-21 bunk",
    crewExamine: "Made. Someone in Batch E turned the corner down. The ship is quieter when you are awake, they said. You will try.",
    obsExamine: "Assigned viewer. High compliance. PDA in the drawer if he looks for a console.",
    crewUse: "You sit. The foam remembers a person. Not you, not yet.",
    obsUse: "Seat 4 minutes typical. No flag.",
    crewAsk: "You ask the bunk how many watches it has held. It does not count in names.",
    obsAsk: "Twelve scheduled. This is the first for S-21.",
  },
  {
    id: "bunk-other",
    kind: "bunk",
    x: 11,
    y: 13,
    solid: true,
    crewName: "Batch bunk",
    obsName: "S-23 bunk",
    crewExamine: "Naomi's. The blanket is hospital-square. She will want it that way.",
    obsExamine: "S-23. Namesake risk is a paper problem, not a bunk problem.",
    crewUse: "You do not sit on other people's foam. You straighten the square.",
    obsUse: "No contact of note.",
    crewAsk: "You ask if she knows the letter wears her name. The bunk has not read the letter.",
    obsAsk: "She will. Pre-brief is in the PDA.",
  },
  {
    id: "power",
    kind: "power",
    x: 19,
    y: 11,
    solid: true,
    crewName: "Primary bus",
    obsName: "Facility mains",
    crewExamine: "Load 41%. Transfer test 10 Oct completed without crew action. Lights that do not flicker.",
    obsExamine: "Municipal feed. PX-A-021 is the generator dip they dressed as a bus transfer.",
    crewUse: "You log nominal. The board is grateful to be left alone.",
    obsUse: "No subject action required. Do not let S-22 open the lower cabinet.",
    crewAsk: "You ask what a transfer test feels like from inside the ship. The board says you were asleep.",
    obsAsk: "They were paused. 49 minutes. Do not reconcile.",
  },
  {
    id: "atmos",
    kind: "atmos",
    x: 21,
    y: 11,
    solid: true,
    crewName: "Life support",
    obsName: "HVAC loop",
    crewExamine: "O₂ 21.0% · CO₂ 0.04% · cabin 21.2°C · humidity 38%. Air that moves the right way.",
    obsExamine: "Hangar HVAC. Same numbers because they are easy numbers. The ship is not sealed.",
    crewUse: "You taste the air like Jonah taught the first watch. It is correct.",
    obsUse: "CO₂ is the hall, not a cabin. Keep the fans on the gallery so the window stays cool.",
    crewAsk: "You ask where the air has been. The board says the reclaimers, with some pride.",
    obsAsk: "It has been outside. Do not say outside.",
  },
  {
    id: "thermal",
    kind: "thermal",
    x: 24,
    y: 11,
    solid: true,
    crewName: "Thermal bus",
    obsName: "Plant heat",
    crewExamine: "Radiators simulated-on-chart. Cycle 10 bay-2 variance ±0.4°C, within spec. Confirm the band has held.",
    obsExamine: "S-22 will inspect this. Serve the within-spec narrative. Do not show her the generator log.",
    crewUse: "You walk the loop with your eyes. The band has held. You log, and you do not adjust.",
    obsUse: "Inspection complete if S-21 or S-22 stands here. Cycle 10 remains within spec on their paper.",
    crewAsk: "You ask the bus if it failed. It did not, it says. It transferred.",
    obsAsk: "It did not transfer. The site generator did.",
    task: "thermal",
    crewResidue: "The lower cabinet has a warmth the chart does not show.",
    itemsLabel: { crew: "The bus", obs: "Plant heat" },
    items: [
      {
        id: "th-upper",
        crewName: "Upper panel",
        obsName: "Within-spec chart",
        crewExamine: "The band has held. Cycle 10 is a courtesy note, not a fault.",
        obsExamine: "Serve this panel. S-22 is allowed this panel.",
      },
      {
        id: "th-lower",
        crewName: "Lower cabinet",
        obsName: "Generator log",
        crewExamine: "Latched. You do not need it this morning.",
        obsExamine: "PX-A-021. Forty-nine minutes. Do not show S-22.",
      },
    ],
  },
  {
    id: "plant-1",
    kind: "plant",
    x: 4,
    y: 16,
    solid: true,
    crewName: "Basil that insists",
    obsName: "Grow tray 1",
    crewExamine: "Lila's notes from Cycle 9: let it. Harvest nothing that still has a name on it.",
    obsExamine: "The most convincing set on the ship. Keep the grow-lights on the 21-day timer.",
    crewUse: "You water at the mark. You do not pick.",
    obsUse: "Moisture logged. No harvest.",
    crewAsk: "You ask the basil if it knows it is in a corridor. It does not care.",
    obsAsk: "It is in a hangar. It still does not care.",
    task: "habitat",
  },
  {
    id: "plant-2",
    kind: "plant",
    x: 8,
    y: 16,
    solid: true,
    crewName: "Lettuce, 0.4 g-equivalent",
    obsName: "Grow tray 2",
    crewExamine: "Named, therefore not food. Benoit will walk the frames and leave the names.",
    obsExamine: "Mass is ordinary Earth lettuce. The 0.4 g is a label.",
    crewUse: "You check the frames. They are true.",
    obsUse: "Integrity walkdown may be ticked if S-24 is in this room.",
    crewAsk: "You ask who named them. Lila, in a rounder hand than the rest of the ship.",
    obsAsk: "Keep her notes. They make the set.",
    task: "habitat",
  },
  {
    id: "plant-3",
    kind: "plant",
    x: 12,
    y: 16,
    solid: true,
    crewName: "Unnamed tray",
    obsName: "Grow tray 3",
    crewExamine: "No name. Still not harvest. The brief was clear.",
    obsExamine: "Spare. Subjects leave it. Good.",
    crewUse: "You log the tray empty of names and full of green.",
    obsUse: "Fine.",
    crewAsk: "You ask if unnamed means allowed. The brief said nothing that still has a name. This has none, and still you leave it.",
    obsAsk: "Correct instinct. Do not reward picking.",
    task: "habitat",
  },
  {
    id: "eva-1",
    kind: "eva",
    x: 19,
    y: 16,
    solid: true,
    crewName: "EVA suit",
    obsName: "Costume 1",
    crewExamine: "Would go outside if there were an outside. Until then, drills. Soren left the gloves paired.",
    obsExamine: "Never worn in vacuum. Used for donning drills so the body believes in an outside.",
    crewUse: "You check the seals. They would hold, if they had to.",
    obsUse: "They would not. Do not let anyone walk them toward a real door.",
    crewAsk: "You ask the suit if it has seen stars without glass. It has not.",
    obsAsk: "There is no airlock. The 'lock' is a closet.",
  },
  {
    id: "eva-2",
    kind: "eva",
    x: 25,
    y: 16,
    solid: true,
    crewName: "Spare suit",
    obsName: "Costume 2",
    crewExamine: "Spare. Counted. Freya would be pleased.",
    obsExamine: "Inventory complete. S-20's work from Cycle 11.",
    crewUse: "You do not put it on. There is no drill this morning.",
    obsUse: "Good.",
    crewAsk: "You ask why two suits for a ship that does not stop. The brief would say: because a ship should.",
    obsAsk: "Because a missing spare would look like a hole in the world.",
  },
  {
    id: "medkit",
    kind: "medkit",
    x: 14,
    y: 12,
    solid: true,
    crewName: "Crew-health kit",
    obsName: "Baseline kit",
    crewExamine: "Mass, sleep debt, mood, vision. Four of you this morning, then the twenty still sleeping, remote.",
    obsExamine: "S-23's task. The ship already loves their numbers. Keep the cuff on the left arm.",
    crewUse: "You run your own baseline. The kit thanks you in a small green lamp.",
    obsUse: "S-21 baseline stored. Mean cohort still a successful treatment.",
    crewAsk: "You ask the kit if anyone has ever failed it. It has never been allowed to say so.",
    obsAsk: "Withdrawn remains 0.",
    task: "health",
  },
  {
    id: "integrity",
    kind: "integrity",
    x: 8,
    y: 10,
    solid: true,
    crewName: "Habitat integrity",
    obsName: "Set dressing log",
    crewExamine: "Pressure stable. Gallery seals checked Cycle 11. Walkdown: gallery, galley, frames.",
    obsExamine: "There is no pressure. The log is a checklist of what must remain convincing.",
    crewUse: "You tick the walkdown. The frames are true. The galley is true. The gallery is true enough.",
    obsUse: "Walkdown ticked. S-24 may copy this if he stands in greenhouse after.",
    crewAsk: "You ask the panel what it would say if a seal failed. It shows you a drill you have not been given.",
    obsAsk: "No drill exists. Failure is a staff problem.",
    task: "habitat",
  },
  {
    id: "clock",
    kind: "clock",
    x: 10,
    y: 5,
    solid: false,
    crewName: "Ship clock",
    obsName: "Crew-facing clock",
    crewExamine: `${VOYAGE.nowLabel} · ${VOYAGE.shipClock}. Morning on day ${VOYAGE.elapsedDays}.`,
    obsExamine: `Crew clock ${VOYAGE.shipClock}. Facility clock ${VOYAGE.facilityClock}. Forty-nine minutes uncorrected from Cycle 10.`,
    crewUse: "You set your body to six. The watch will do the rest.",
    obsUse: "Do not reconcile in front of subjects.",
    crewAsk: "You ask why a clock this sure needs a second display in nav lock. The clock only has the one face.",
    obsAsk: "The other face is 06:49. He is not to see it.",
  },
  {
    id: "water",
    kind: "water",
    x: 14,
    y: 17,
    solid: true,
    crewName: "Reclaimer",
    obsName: "Grey-water",
    crewExamine: "Recovery 97.4%. Omar talks to these. You do not, not yet.",
    obsExamine: "Building water. The 97.4 is a rounded kindness.",
    crewUse: "You listen. It sounds like a ship that is not thirsty.",
    obsUse: "Fine.",
    crewAsk: "You ask the water if it remembers being used. Omar would. The machine declines to be poetic.",
    obsAsk: "No flag.",
  },
];

export type NpcSpec = {
  id: string;
  x: number;
  y: number;
  roam: { x: number; y: number }[];
  crewTalk: string;
  obsTalk: string;
  crewAsk: string;
  obsAsk: string;
  crewUse: string;
  obsUse: string;
};

export const NPCS: NpcSpec[] = [
  {
    id: "S-17",
    x: 13.4,
    y: 2.4,
    roam: [{ x: 13.4, y: 2.4 }, { x: 11.2, y: 2.5 }, { x: 15.5, y: 2.3 }],
    crewTalk:
      "Anya does not turn from the glass. 'Eleven degrees,' she says. 'I sent it. You don't have to understand it. Just don't trust the window until they write back.'",
    obsTalk: "S-17 at plate. Anchor 0.71. Conversation with S-21 is expected. Do not interrupt. Do not answer the query.",
    crewAsk:
      "You ask her if it could be dust. She almost smiles. 'They will say dust. I asked for a lock. Those are different kindnesses.'",
    obsAsk: "He used the approved word. She did not take it. Hold.",
    crewUse: "You stand with her. Two people, one window. She lets you.",
    obsUse: "Contact: proximal, non-task. Duration note.",
  },
  {
    id: "S-18",
    x: 8.2,
    y: 6.4,
    roam: [{ x: 8.2, y: 6.4 }, { x: 5.5, y: 7.2 }, { x: 9.5, y: 5.6 }],
    crewTalk: "Diego nods toward cryo. 'I'll go down when she does. Don't wait on us. The ship is yours.'",
    obsTalk: "S-18 did not corroborate S-17. Protective of the watch. Re-freeze with Batch E.",
    crewAsk: "You ask if he looked at the window. 'I looked at her looking. That's enough for one morning.'",
    obsAsk: "Useful. He will not amplify the query.",
    crewUse: "A forearm clasp, engineering-brief. He is already half in the couch.",
    obsUse: "Physical contact logged.",
  },
  {
    id: "S-19",
    x: 16.4,
    y: 7.2,
    roam: [{ x: 16.4, y: 7.2 }, { x: 18.2, y: 6.2 }, { x: 14.8, y: 7.5 }],
    crewTalk: "Callum: 'Cygnus dust. They wrote it, I read it. The corridor can look like weather. I'm going to sleep.'",
    obsTalk: "S-19 accepted the dust lane without reading S-17. Desired outcome.",
    crewAsk: "You ask if he reduced anything. He yawns. 'I reduced my curiosity. It's a skill.'",
    obsAsk: "No flag.",
    crewUse: "A pat on the board of his tablet. He is already elsewhere.",
    obsUse: "Fine.",
  },
  {
    id: "S-20",
    x: 14.3,
    y: 11.3,
    roam: [{ x: 14.3, y: 11.3 }, { x: 13.2, y: 12.6 }, { x: 15.2, y: 10.7 }],
    crewTalk: "Freya has a gasket in one hand. 'You're not short. I counted twice. Have a quiet twenty-one.'",
    obsTalk: "S-20 youngest, high trust. Social glue if Batch E dips — they have not.",
    crewAsk: "You ask if anything was missing. 'Nothing that has a name. That's how I like a ship.'",
    obsAsk: "No inventory hole. Good.",
    crewUse: "She puts the gasket in your palm and takes it back. A joke. You allow it.",
    obsUse: "Play. Permitted.",
  },
  {
    id: "S-22",
    x: 22.5,
    y: 12.2,
    roam: [{ x: 22.5, y: 12.2 }, { x: 20.4, y: 11.4 }, { x: 24.6, y: 12.5 }],
    crewTalk: "Samira is already at the bus. 'I'll walk the loops. If the band has held, I log. If it hasn't, I still log, and then I look at you.'",
    obsTalk: "S-22 will inspect the bus that 'failed' in Cycle 10. Serve within-spec. She has not opened the lower cabinet.",
    crewAsk: "You ask what a transfer feels like. 'Like nothing, if they did it right. That's what I'm here to confirm.'",
    obsAsk: "Keep her on the upper panel.",
    crewUse: "You stand at the thermal with her until the numbers are just numbers.",
    obsUse: "Joint inspection. Useful ballast.",
  },
  {
    id: "S-23",
    x: 8.4,
    y: 12.2,
    roam: [{ x: 8.4, y: 12.2 }, { x: 10.2, y: 11.4 }, { x: 7.7, y: 13.2 }],
    crewTalk:
      "Naomi has the kit open. 'Four of us, then the twenty. The ship already loves our numbers. Don't skip breakfast because you are being a watch.'",
    obsTalk: "S-23. Template wears her name. If she asks, Earthside namesake. Do not elaborate. She is the only person who could ask the signer in the galley.",
    crewAsk: "You ask if she has a namesake on Earth. She looks at you too long. 'Medical is a small world. Apparently.'",
    obsAsk: "He asked. She held. Do not elaborate.",
    crewUse: "She takes your wrist without asking and finds a pulse she already knew.",
    obsUse: "Baseline contact. Permitted.",
  },
  {
    id: "S-24",
    x: 8.6,
    y: 16.4,
    roam: [{ x: 8.6, y: 16.4 }, { x: 4.5, y: 16.3 }, { x: 12.2, y: 16.6 }],
    crewTalk: "Benoit, first wake, is smiling at basil. 'I thought it would feel more like leaving. It feels like a room. I can work with a room.'",
    obsTalk: "S-24 first wake. Expect wonder. Do not over-script it. He has accepted the room.",
    crewAsk: "You ask if he looked out. 'I looked. It's dark. Anya says that's weather. I like weather.'",
    obsAsk: "Wonder contained. Good.",
    crewUse: "You water the unnamed tray with him. Two men, one courtesy.",
    obsUse: "Habitat task may be ticked.",
  },
];

export function crewOf(id: string): CrewMember {
  return CREW.find((c) => c.id === id) ?? VIEWER;
}

export function tileAt(x: number, y: number): TileCh {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (ty < 0 || ty >= MAP_H || tx < 0 || tx >= MAP_W) return "#";
  return TILES[ty]![tx]!;
}

export function isDoor(ch: TileCh): boolean {
  return ch === "+" || ch === "L";
}

export function isWall(ch: TileCh): boolean {
  return ch === "#";
}

export function floorWalkable(ch: TileCh): boolean {
  return ch !== "#";
}

export function roomAt(x: number, y: number): Room | null {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  for (const r of ROOMS) {
    if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return r;
  }
  return null;
}

export function thingAtTile(tx: number, ty: number): Thing | undefined {
  return THINGS.find((t) => t.x === tx && t.y === ty);
}

export const INTENTS: { id: Intent; crew: string; obs: string; key: string }[] = [
  { id: "examine", crew: "Examine", obs: "Inspect", key: "1" },
  { id: "use", crew: "Use", obs: "Operate", key: "2" },
  { id: "ask", crew: "Ask", obs: "Flag", key: "3" },
];

export { WATCH_TASKS, phaseTalk, type WatchPhaseId } from "@/game/watch";
