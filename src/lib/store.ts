import { create } from "zustand";
import { SCREEN_ORDER, type ScreenId, VOYAGE } from "@/lib/mission";
import type { Focus, RadioLine } from "@/lib/station/sim";
import type { Intent } from "@/lib/station/world";

export type Layer = "crew" | "observer";

export type CardItem = {
  id: string;
  name: string;
  body: string;
};

export type ExamineCard = {
  title: string;
  body: string;
  personId?: string;
  itemsLabel?: string;
  items?: CardItem[];
  parent?: ExamineCard;
};

type ConsoleState = {
  layer: Layer;
  screen: ScreenId;
  selectedSubjectId: string;
  cycle12Initiated: boolean;
  curtainAnimating: boolean;
  hintSeen: boolean;
  intent: Intent;
  pdaOpen: boolean;
  helpOpen: boolean;
  focus: Focus;
  card: ExamineCard | null;
  radio: RadioLine[];
  done: Record<string, boolean>;
  asked: Record<string, boolean>;
  woke: boolean;
  watchComplete: boolean;
  pulledOnce: boolean;
  setLayer: (layer: Layer) => void;
  setScreen: (screen: ScreenId) => void;
  toggleLayer: () => void;
  selectSubject: (id: string, openDetail?: boolean) => void;
  initiateCycle12: () => void;
  markHintSeen: () => void;
  setAnimating: (v: boolean) => void;
  setIntent: (intent: Intent) => void;
  setPdaOpen: (v: boolean) => void;
  setHelpOpen: (v: boolean) => void;
  toggleHelp: () => void;
  setFocus: (f: Focus) => void;
  setCard: (card: ExamineCard | null) => void;
  pushRadio: (line: Omit<RadioLine, "id" | "t"> & { id?: string }) => void;
  markDone: (task: string) => void;
  markAsked: (id: string) => void;
  markWoke: () => void;
  markPulled: () => void;
};

let radioN = 0;

export const useConsole = create<ConsoleState>((set, get) => ({
  layer: "crew",
  screen: "overview",
  selectedSubjectId: "S-17",
  cycle12Initiated: false,
  curtainAnimating: false,
  hintSeen: false,
  intent: "examine",
  pdaOpen: false,
  helpOpen: false,
  focus: null,
  card: null,
  radio: [],
  done: {},
  asked: {},
  woke: false,
  watchComplete: false,
  pulledOnce: false,
  setLayer: (layer) => {
    if (get().layer === layer) return;
    set({
      curtainAnimating: true,
      layer,
      card: null,
      pulledOnce: layer === "observer" ? true : get().pulledOnce,
    });
    window.setTimeout(() => set({ curtainAnimating: false }), 1100);
  },
  setScreen: (screen) => set({ screen }),
  toggleLayer: () => {
    const next: Layer = get().layer === "crew" ? "observer" : "crew";
    get().setLayer(next);
  },
  selectSubject: (id, openDetail) =>
    set(openDetail ? { selectedSubjectId: id, screen: "roster", pdaOpen: true } : { selectedSubjectId: id }),
  initiateCycle12: () => set({ cycle12Initiated: true }),
  markHintSeen: () => set({ hintSeen: true }),
  setAnimating: (v) => set({ curtainAnimating: v }),
  setIntent: (intent) => set({ intent }),
  setPdaOpen: (v) => set({ pdaOpen: v, helpOpen: v ? false : get().helpOpen }),
  setHelpOpen: (v) => set({ helpOpen: v, pdaOpen: v ? false : get().pdaOpen }),
  toggleHelp: () => {
    const open = !get().helpOpen;
    set({ helpOpen: open, pdaOpen: false, card: open ? null : get().card });
  },
  setFocus: (focus) => set({ focus }),
  setCard: (card) => set({ card }),
  pushRadio: (line) =>
    set((s) => ({
      radio: [
        ...s.radio.slice(-24),
        {
          id: line.id ?? `r${radioN++}`,
          t: Date.now(),
          channel: line.channel,
          speaker: line.speaker,
          text: line.text,
          layer: line.layer,
        },
      ],
    })),
  markDone: (task) =>
    set((s) => {
      const done = { ...s.done, [task]: true };
      const keys = ["handover", "nightlog", "thermal", "health", "habitat"];
      const watchComplete = keys.every((k) => done[k]);
      return { done, watchComplete };
    }),
  markAsked: (id) => set((s) => ({ asked: { ...s.asked, [id]: true } })),
  markWoke: () => set({ woke: true }),
  markPulled: () => set({ pulledOnce: true }),
}));

export function screenIndex(id: ScreenId): number {
  return SCREEN_ORDER.indexOf(id);
}

export { SCREEN_ORDER, type ScreenId, VOYAGE };
