import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";

const ROWS_CREW = [
  { key: "W A S D", act: "Walk the deck" },
  { key: "Click", act: "Path to a tile" },
  { key: "1 · 2 · 3", act: "Examine · Use · Ask" },
  { key: "E · Space", act: "Act on what is in reach" },
  { key: "Tab", act: "Open the PDA" },
  { key: "]", act: "Pull the curtain" },
  { key: "Esc", act: "This sheet" },
];

const ROWS_OBS = [
  { key: "W A S D", act: "Move S-21 on the floor" },
  { key: "Click", act: "Path to a tile" },
  { key: "1 · 2 · 3", act: "Inspect · Operate · Flag" },
  { key: "E · Space", act: "Act on the focused target" },
  { key: "Tab", act: "Open the workstation" },
  { key: "]", act: "Restore the voyage layer" },
  { key: "Esc", act: "This sheet" },
];

export function ControlsSheet() {
  const layer = useConsole((s) => s.layer);
  const close = useConsole((s) => s.setHelpOpen);
  const crew = layer === "crew";
  const rows = crew ? ROWS_CREW : ROWS_OBS;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className={cn(
          "absolute inset-0",
          crew ? "bg-crew-bg-deep/72" : "bg-obs-bg/80",
        )}
        aria-label="Close controls"
        onClick={() => close(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="controls-title"
        className={cn(
          "controls-sheet relative w-full max-w-md p-5 sm:p-6",
          crew
            ? "crew-panel rounded-crew-lg text-crew-ivory"
            : "obs-panel text-obs-text",
        )}
      >
        <p
          className={cn(
            "text-[10px] tracking-[0.22em] uppercase",
            crew ? "text-crew-accent" : "font-obs-mono text-obs-faint",
          )}
        >
          {crew ? "Watch" : "PX-04 / input"}
        </p>
        <h2
          id="controls-title"
          className={cn(
            "mt-1",
            crew ? "font-crew-serif text-2xl" : "font-obs-sans text-lg tracking-wide",
          )}
        >
          {crew ? "Controls" : "Operator keys"}
        </h2>
        <p className={cn("mt-1 text-sm", crew ? "text-crew-muted" : "font-obs-mono text-obs-muted")}>
          {crew
            ? "The ship is yours. Stick on a phone. Keys at a desk."
            : "Subject motor is live. Do not leave this sheet up on a monitored shift."}
        </p>
        <ul className="mt-4 space-y-2">
          {rows.map((row) => (
            <li
              key={row.key}
              className={cn(
                "flex items-baseline justify-between gap-4 border-b py-2 text-sm last:border-b-0",
                crew ? "border-crew-line-soft" : "border-obs-line",
              )}
            >
              <span
                className={cn(
                  "shrink-0 tracking-[0.08em]",
                  crew ? "font-crew-serif text-crew-accent" : "font-obs-mono text-obs-text",
                )}
              >
                {row.key}
              </span>
              <span className={cn("text-right", crew ? "text-crew-ivory-dim" : "text-obs-muted")}>
                {row.act}
              </span>
            </li>
          ))}
        </ul>
        <p className={cn("mt-4 text-xs", crew ? "text-crew-muted" : "font-obs-mono text-obs-faint")}>
          {crew
            ? "Phone: drag the disc to walk. The round button acts. Esc is on the watch strip."
            : "Touch: stick left, act right. Esc sits on the status strip."}
        </p>
        <button
          type="button"
          onClick={() => close(false)}
          className={cn(
            "mt-5 min-h-11 w-full text-sm tracking-[0.14em] uppercase",
            crew
              ? "rounded-crew-sm bg-crew-accent text-crew-bg-deep"
              : "rounded-obs bg-obs-surface-2 text-obs-text",
          )}
        >
          {crew ? "Resume watch" : "Close"}
        </button>
      </div>
    </div>
  );
}
