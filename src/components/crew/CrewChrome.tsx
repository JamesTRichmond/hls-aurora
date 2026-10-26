import type { ReactNode } from "react";
import { CREW_NAV, VIEWER, VOYAGE } from "@/lib/mission";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CrewChrome({
  children,
  embedded = false,
}: {
  children: ReactNode;
  embedded?: boolean;
}) {
  const screen = useConsole((s) => s.screen);
  const setScreen = useConsole((s) => s.setScreen);

  return (
    <div
      className={cn(
        "theme-crew flex min-h-0 flex-col bg-crew-bg text-crew-ivory",
        embedded ? "h-full" : "h-full min-h-dvh",
      )}
    >
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-crew-line-soft px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-baseline gap-3">
          <p className="font-crew-serif text-lg tracking-tight sm:text-xl">{VOYAGE.shipName}</p>
          <p className="hidden text-xs tracking-[0.18em] text-crew-muted uppercase md:block">
            {VOYAGE.programCrew}
          </p>
        </div>
        <p className="truncate font-crew-serif text-sm text-crew-ivory-dim sm:text-base">
          Good morning, {VIEWER.given}.
        </p>
        <p className="hidden tabular text-xs text-crew-muted sm:block sm:text-sm">
          {VOYAGE.nowLabel} · {VOYAGE.shipClock}
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {!embedded ? (
        <nav
          className="hidden w-44 shrink-0 flex-col gap-1 border-r border-crew-line-soft px-3 py-6 md:flex"
          aria-label="Ship console"
        >
          {CREW_NAV.map((item) => (
            <NavButton
              key={item.id}
              active={screen === item.id}
              onClick={() => setScreen(item.id)}
              label={item.label}
            />
          ))}
        </nav>
        ) : null}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
          {children}
        </main>
      </div>

      {!embedded ? (
      <nav
        className="flex shrink-0 border-t border-crew-line-soft md:hidden"
        aria-label="Ship console"
      >
        {CREW_NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setScreen(item.id)}
            className={cn(
              "flex-1 py-3 text-center text-[11px] tracking-[0.12em] uppercase transition-colors duration-300",
              screen === item.id ? "text-crew-accent" : "text-crew-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>
      ) : null}
    </div>
  );
}

function NavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[12px] px-3 py-2.5 text-left text-sm transition-colors duration-300",
        active
          ? "bg-crew-surface text-crew-ivory"
          : "text-crew-muted hover:bg-crew-elevated hover:text-crew-ivory-dim",
      )}
    >
      {label}
    </button>
  );
}

export function CrewScreen({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="crew-stagger mx-auto flex w-full max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs tracking-[0.22em] text-crew-accent uppercase">{kicker}</p>
        <h1 className="font-crew-serif text-2xl leading-tight tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
      </header>
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  glow = false,
}: {
  label: string;
  value: string;
  hint?: string;
  glow?: boolean;
}) {
  return (
    <div className="crew-panel rounded-[24px] px-5 py-4">
      <p className="text-xs tracking-[0.16em] text-crew-muted uppercase">{label}</p>
      <p
        className={cn(
          "mt-2 font-crew-serif text-2xl tabular tracking-tight sm:text-3xl",
          glow && "crew-glow text-crew-accent-soft",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-sm text-crew-muted">{hint}</p> : null}
    </div>
  );
}
