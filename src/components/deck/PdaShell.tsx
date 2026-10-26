import { CrewChrome } from "@/components/crew/CrewChrome";
import { CrewView } from "@/components/crew/CrewScreens";
import { ObserverChrome } from "@/components/observer/ObserverChrome";
import { ObserverView } from "@/components/observer/ObserverScreens";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PdaShell() {
  const layer = useConsole((s) => s.layer);
  const close = useConsole((s) => s.setPdaOpen);
  const crew = layer === "crew";

  return (
    <div className="pointer-events-none absolute inset-0 z-40 flex justify-end">
      <button
        type="button"
        className="pointer-events-auto hidden flex-1 bg-crew-bg-deep/20 sm:block"
        aria-label="Close handheld"
        onClick={() => close(false)}
      />
      <div
        className={cn(
          "pointer-events-auto flex h-full w-full max-w-3xl flex-col overflow-hidden shadow-2xl",
          crew
            ? "bg-crew-bg ring-1 ring-crew-accent/30"
            : "bg-obs-bg ring-1 ring-obs-line-strong",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-between px-4 py-2",
            crew ? "bg-crew-elevated text-crew-ivory" : "bg-obs-elevated font-obs-mono text-obs-text",
          )}
        >
          <p className={cn("text-xs tracking-[0.18em] uppercase", crew ? "text-crew-accent" : "text-obs-faint")}>
            {crew ? "Helios PDA · Jules Moreau" : "PX-04 / workstation"}
          </p>
          <button
            type="button"
            onClick={() => close(false)}
            className={cn(
              "rounded-crew-sm px-3 py-1.5 text-sm",
              crew ? "text-crew-ivory-dim hover:text-crew-ivory" : "text-obs-muted hover:text-obs-text",
            )}
          >
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          {crew ? (
            <CrewChrome embedded>
              <CrewView />
            </CrewChrome>
          ) : (
            <ObserverChrome embedded>
              <ObserverView />
            </ObserverChrome>
          )}
        </div>
      </div>
    </div>
  );
}
