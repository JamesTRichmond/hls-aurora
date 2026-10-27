import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { readWatchMemory, serializeWatchMemory, writeWatchMemory } from "@/game/memory";
import { WATCH_TASKS } from "@/game/watch";
import { ControlsSheet } from "@/components/deck/ControlsSheet";
import { DeckHud } from "@/components/deck/DeckHud";
import { PdaShell } from "@/components/deck/PdaShell";
import { StationCanvas } from "@/components/deck/StationCanvas";
import { VIEWER, VOYAGE } from "@/lib/mission";
import { performInteract } from "@/lib/station/act";
import { playCurtain, setAmbience, unlockAmbience } from "@/lib/station/audio";
import {
  applyWatchPlace,
  clearKeys,
  clickMove,
  setKey,
  setQaKeys,
  sim,
  WAKE_LINES,
} from "@/lib/station/sim";
import { INTENTS, roomAt } from "@/lib/station/world";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";

const GAME_KEYS = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyE",
]);

export function ConsoleStage() {
  const layer = useConsole((s) => s.layer);
  const toggle = useConsole((s) => s.toggleLayer);
  const hintSeen = useConsole((s) => s.hintSeen);
  const markHint = useConsole((s) => s.markHintSeen);
  const pdaOpen = useConsole((s) => s.pdaOpen);
  const setPdaOpen = useConsole((s) => s.setPdaOpen);
  const helpOpen = useConsole((s) => s.helpOpen);
  const toggleHelp = useConsole((s) => s.toggleHelp);
  const setIntent = useConsole((s) => s.setIntent);
  const setCard = useConsole((s) => s.setCard);
  const woke = useConsole((s) => s.woke);
  const markWoke = useConsole((s) => s.markWoke);
  const pushRadio = useConsole((s) => s.pushRadio);
  useLayoutEffect(() => {
    const m = readWatchMemory();
    applyWatchPlace(m);
    useConsole.setState({
      cycle12Initiated: m.cycle12Initiated,
      done: m.done,
      asked: m.asked,
      woke: m.woke,
      pulledOnce: m.pulledOnce,
      hintSeen: m.hintSeen,
      letterRead: m.letterRead,
      letterTaken: m.letterTaken,
      watchComplete: WATCH_TASKS.every((t) => m.done[t.id]),
    });
    const snapshot = () => {
      const s = useConsole.getState();
      return serializeWatchMemory({
        version: 2,
        cycle12Initiated: s.cycle12Initiated,
        done: s.done,
        asked: s.asked,
        woke: s.woke,
        pulledOnce: s.pulledOnce,
        hintSeen: s.hintSeen,
        simTime: sim.time,
        x: sim.x,
        y: sim.y,
        facing: sim.facing,
        letterRead: s.letterRead,
        letterTaken: s.letterTaken,
      });
    };
    let last = snapshot();
    const write = () => {
      const next = snapshot();
      if (next === last) return;
      last = next;
      writeWatchMemory(JSON.parse(next) as ReturnType<typeof readWatchMemory>);
    };
    const unsub = useConsole.subscribe(write);
    const pulse = window.setInterval(write, 1000);
    return () => {
      unsub();
      window.clearInterval(pulse);
    };
  }, []);
  const pull = () => {
    const next = useConsole.getState().layer === "crew" ? "observer" : "crew";
    toggle();
    markHint();
    playCurtain();
    pushRadio(
      next === "observer"
        ? {
            channel: "PX-04",
            speaker: "ops",
            text: "CCTV-07. S-21 on the floor. Subjects still. Site 19.",
            layer: "observer",
          }
        : {
            channel: "watch",
            speaker: VIEWER.given,
            text: "The corridor is still holding.",
            layer: "crew",
          },
    );
  };
  const crewOnTop = layer === "crew";
  const pullRef = useRef(pull);
  pullRef.current = pull;

  useEffect(() => {
    sim.layer = layer;
    setAmbience(layer, roomAt(sim.x, sim.y)?.id ?? null);
    if (layer === "crew") {
      const room = roomAt(sim.x, sim.y);
      if (room?.id === "command") {
        sim.x = 21.25;
        sim.y = 7.5;
        sim.path = [];
        sim.facing = Math.PI;
      }
    }
  }, [layer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "]" || (e.key === "\\" && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        pullRef.current();
        return;
      }
      if (e.code === "Tab") {
        e.preventDefault();
        setPdaOpen(!useConsole.getState().pdaOpen);
        return;
      }
      if (e.code === "Escape") {
        e.preventDefault();
        const s = useConsole.getState();
        if (s.pdaOpen) {
          setPdaOpen(false);
          return;
        }
        toggleHelp();
        return;
      }
      if (useConsole.getState().pdaOpen || useConsole.getState().helpOpen) return;
      if (!useConsole.getState().woke) return;
      const intentHit = INTENTS.find((it) => e.key === it.key);
      if (intentHit) {
        e.preventDefault();
        setIntent(intentHit.id);
        return;
      }
      if (e.code === "KeyE" || e.code === "Space") {
        e.preventDefault();
        performInteract();
        return;
      }
      if (GAME_KEYS.has(e.code)) {
        e.preventDefault();
        setKey(e.code, true);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (GAME_KEYS.has(e.code)) setKey(e.code, false);
    };
    const onBlur = () => clearKeys();
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onBlur);

    window.__controlsTest = {
      getYaw: () => sim.facing,
      getSpeed: () => sim.speed,
      setKeys: (codes: string[]) => setQaKeys(codes),
      getX: () => sim.x,
      getY: () => sim.y,
      goTo: (x: number, y: number) => clickMove(x, y),
      setPos: (x: number, y: number) => {
        sim.x = x;
        sim.y = y;
        sim.path = [];
      },
    };

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onBlur);
      delete window.__controlsTest;
    };
  }, [setPdaOpen, setIntent, setCard, toggleHelp]);

  return (
    <div className="relative h-dvh overflow-hidden bg-obs-bg">
      <div className="absolute inset-0 z-0 bg-obs-bg" aria-hidden={crewOnTop} inert={crewOnTop}>
        <StationCanvas skin="observer" active={!crewOnTop} />
        {!crewOnTop && woke ? <DeckHud /> : null}
      </div>

      <div
        className={cn(
          "curtain-layer absolute inset-0 z-10 bg-crew-bg",
          crewOnTop ? "translate-x-0" : "-translate-x-full pointer-events-none",
        )}
        style={{
          boxShadow: crewOnTop ? "none" : "40px 0 80px color-mix(in oklab, #000 55%, transparent)",
        }}
        aria-hidden={!crewOnTop}
        inert={!crewOnTop}
        data-layer="crew"
      >
        <StationCanvas skin="crew" active={crewOnTop} />
        {crewOnTop && woke ? <DeckHud /> : null}
      </div>

      {pdaOpen ? <PdaShell /> : null}
      {helpOpen ? <ControlsSheet /> : null}

      <button
        type="button"
        onClick={pull}
        aria-label={crewOnTop ? "Draw back the voyage layer" : "Restore the voyage layer"}
        className={cn(
          "group absolute z-50 flex h-28 w-7 -translate-y-1/2 flex-col items-center justify-center gap-1 transition-colors duration-300",
          crewOnTop
            ? "right-0 top-[36%] rounded-l-[8px] bg-crew-accent text-crew-bg-deep"
            : "left-0 top-1/2 rounded-r-[2px] bg-obs-surface-2 text-obs-muted hover:text-obs-text",
        )}
      >
        <span
          className={cn(
            "block h-10 w-0.5 rounded-full",
            crewOnTop ? "bg-crew-bg-deep/70" : "bg-obs-faint",
          )}
        />
      </button>

      {!hintSeen && crewOnTop ? (
        <p className="pointer-events-none absolute right-9 top-[36%] z-50 -translate-y-1/2 font-crew-serif text-xs text-crew-accent">
          Pull
        </p>
      ) : null}

      <Link
        to="/archive"
        search={{ tab: "spec" }}
        className={cn(
          "absolute left-4 top-[4.25rem] z-40 text-[10px] tracking-[0.16em] uppercase",
          crewOnTop ? "text-crew-muted/70 hover:text-crew-ivory" : "text-obs-faint hover:text-obs-text",
        )}
      >
        Study files
      </Link>

      {!woke ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-crew-bg-deep/92 px-6 text-center text-crew-ivory">
          <p className="text-xs tracking-[0.28em] text-crew-accent uppercase">{VOYAGE.programCrew}</p>
          <h1 className="mt-4 font-crew-serif text-4xl sm:text-6xl">Good morning, {VIEWER.given}.</h1>
          <p className="mt-4 max-w-md text-pretty text-crew-ivory-dim">
            You have the watch. Walk the ship. Look at things. Ask if you must. The brass on the
            right is not part of the voyage.
          </p>
          <button
            type="button"
            className="mt-8 min-h-11 px-8 text-sm tracking-[0.16em] text-crew-accent uppercase"
            onClick={() => {
              markWoke();
              unlockAmbience();
              setAmbience("crew", "cryo");
              for (const line of WAKE_LINES) pushRadio(line);
            }}
          >
            Wake
          </button>
          <button
            type="button"
            className="mt-3 min-h-11 px-6 text-xs tracking-[0.16em] text-crew-muted uppercase"
            onClick={() => toggleHelp()}
          >
            Esc · controls
          </button>
        </div>
      ) : null}
    </div>
  );
}