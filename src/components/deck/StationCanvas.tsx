import { useEffect, useRef } from "react";
import { takeLetterOnSeam } from "@/game/letter";
import { performInteract } from "@/lib/station/act";
import { tickWorldAudio } from "@/lib/station/audio";
import { beginLoad } from "@/lib/station/assets";
import { cameraFor, drawStation } from "@/lib/station/draw";
import { clickMove, currentRoom, liveWatch, nearestFocus, sim, stepSim, type Layer } from "@/lib/station/sim";
import { THINGS, TILE } from "@/lib/station/world";
import { useConsole } from "@/lib/store";

export function StationCanvas({
  skin,
  active,
}: {
  skin: Layer;
  active: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pdaOpen = useConsole((s) => s.pdaOpen);
  const helpOpen = useConsole((s) => s.helpOpen);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = true;

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth ?? 1280;
      const h = parent?.clientHeight ?? 800;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const loop = (now: number) => {
      if (!running) return;
      if (active) {
        if (!pdaOpen && !helpOpen && useConsole.getState().woke) {
          const before = sim.last || now;
          stepSim(now);
          const dt = Math.min(0.1, (now - before) / 1000);
          tickWorldAudio(skin, sim.speed, dt, currentRoom()?.id ?? null);
          if (sim.phaseShift) {
            const p = sim.phaseShift;
            sim.phaseShift = null;
            if (p.id !== "wake") {
              useConsole.getState().pushRadio(
                skin === "crew"
                  ? {
                      channel: "watch",
                      speaker: "deck",
                      text:
                        p.id === "walkdown"
                          ? "Walkdown. Gallery, galley, frames."
                          : p.id === "midwatch"
                            ? "Midwatch. The corridor is still holding."
                            : "Quiet hours. Batch E should be down.",
                      layer: "crew",
                    }
                  : {
                      channel: "PX-04",
                      speaker: "ops",
                      text:
                        p.id === "walkdown"
                          ? "Floor. Do not cue S-21."
                          : p.id === "midwatch"
                            ? "Mid-session. Subjects still."
                            : "Hold. Cycle 12 window closing.",
                      layer: "observer",
                    },
              );
            }
          }
          if (sim.seamPulse) {
            const gap = liveWatch().gapMin;
            sim.seamPulse = 0;
            const watch = useConsole.getState();
            if (takeLetterOnSeam(watch.letterRead, watch.letterTaken)) watch.markLetterTaken();
            useConsole.getState().pushRadio(
              skin === "crew"
                ? {
                    channel: "watch",
                    speaker: "deck",
                    text: "The lights dipped. The clock did not.",
                    layer: "crew",
                  }
                : {
                    channel: "PX-04",
                    speaker: "ops",
                    text: `Cut. Facility ahead ${gap} min. Do not reconcile.`,
                    layer: "observer",
                  },
            );
          }
        } else sim.last = now;
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cur = useConsole.getState().focus;
      const hi = cur?.type === "thing" || cur?.type === "npc" ? cur.id : null;
      drawStation(ctx, skin, w, h, now, hi, useConsole.getState().done);
      if (active) {
        const n = nearestFocus();
        const same = (!n && !cur) || (n && cur && n.type === cur.type && n.id === cur.id);
        if (!same) useConsole.getState().setFocus(n);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, skin, pdaOpen, helpOpen]);

  return (
    <canvas
      ref={ref}
      className="deck-canvas block h-full w-full touch-none"
      aria-label={skin === "crew" ? "HLS Aurora deck" : "Site 19 floor plan"}
      onPointerDown={(e) => {
        if (pdaOpen || helpOpen || !active || !useConsole.getState().woke) return;
        const canvas = ref.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const cam = cameraFor(rect.width, rect.height);
        const wx = ((e.clientX - rect.left) / cam.z + cam.x) / TILE;
        const wy = ((e.clientY - rect.top) / cam.z + cam.y) / TILE;
        const tx = Math.floor(wx);
        const ty = Math.floor(wy);
        const hitThing = THINGS.find((t) => t.x === tx && t.y === ty);
        const hitNpc = sim.npcs.find((n) => Math.floor(n.px) === tx && Math.floor(n.py) === ty);
        const d = Math.hypot(wx - sim.x, wy - sim.y);
        if ((hitThing || hitNpc) && d < 1.6) {
          performInteract();
          return;
        }
        clickMove(wx, wy);
      }}
    />
  );
}
