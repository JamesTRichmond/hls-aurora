import { Link } from "@tanstack/react-router";
import { OBS_NAV, STUDY, VOYAGE } from "@/lib/mission";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

function useFacilityClock() {
  const [pad, setPad] = useState(0);
  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => setPad(Math.floor((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, []);
  const base = 6 * 3600 + 49 * 60;
  const total = base + pad;
  const h = String(Math.floor(total / 3600) % 24).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function ObserverChrome({
  children,
  embedded = false,
}: {
  children: ReactNode;
  embedded?: boolean;
}) {
  const screen = useConsole((s) => s.screen);
  const setScreen = useConsole((s) => s.setScreen);
  const clock = useFacilityClock();
  const initiated = useConsole((s) => s.cycle12Initiated);

  return (
    <div
      className={cn(
        "theme-observer flex min-h-0 flex-col bg-obs-bg text-obs-text",
        embedded ? "h-full" : "h-full min-h-dvh",
      )}
    >
      <header className="flex shrink-0 items-center gap-3 border-b border-obs-line px-3 py-1.5 font-obs-mono text-[11px] text-obs-muted">
        <span className="text-obs-text">{STUDY.code}</span>
        <span className="hidden sm:inline">{STUDY.lab}</span>
        <span className="hidden md:inline">{STUDY.site}</span>
        <span className="ml-auto tabular text-obs-text">{clock}</span>
        <span>facility</span>
        <span className={initiated ? "text-obs-alarm" : "text-obs-ok"}>
          {initiated ? "CYCLE 12 LIVE" : "CYCLE 11 CLOSE"}
        </span>
      </header>
      <div className="flex min-h-0 flex-1">
        {!embedded ? (
        <nav
          className="hidden w-52 shrink-0 flex-col border-r border-obs-line bg-obs-elevated md:flex"
          aria-label="Study"
        >
          <p className="border-b border-obs-line px-3 py-2 font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
            PX-04 / views
          </p>
          {OBS_NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setScreen(item.id)}
              className={cn(
                "flex items-center gap-2 border-l-2 px-3 py-2 text-left font-obs-sans text-[13px]",
                screen === item.id
                  ? "border-obs-alarm bg-obs-surface text-obs-text"
                  : "border-transparent text-obs-muted hover:bg-obs-surface-2",
              )}
            >
              <span className="font-obs-mono text-[10px] text-obs-faint">{item.code}</span>
              {item.label}
            </button>
          ))}
          <div className="mt-auto border-t border-obs-line px-3 py-3 font-obs-mono text-[10px] leading-relaxed text-obs-faint">
            <p>IRB {STUDY.irb}</p>
            <p>PI {STUDY.pi}</p>
            <p>N={STUDY.n} · day {VOYAGE.elapsedDays}/{VOYAGE.durationDays}</p>
            <Link
              to="/archive"
              search={{ tab: "spec" }}
              className="mt-2 inline-block text-obs-muted underline-offset-2 hover:text-obs-text hover:underline"
            >
              Study files →
            </Link>
          </div>
        </nav>
        ) : null}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 sm:p-4">{children}</main>
      </div>
      {!embedded ? (
      <nav className="grid grid-cols-6 border-t border-obs-line md:hidden" aria-label="Study">
        {OBS_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setScreen(item.id)}
            className={cn(
              "py-2 font-obs-mono text-[9px] tracking-wide uppercase",
              screen === item.id ? "bg-obs-surface text-obs-text" : "text-obs-faint",
            )}
          >
            {item.code}
          </button>
        ))}
      </nav>
      ) : null}
    </div>
  );
}
