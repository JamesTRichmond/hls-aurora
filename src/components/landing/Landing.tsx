import { Link } from "@tanstack/react-router";
import { StarChart } from "@/components/crew/StarChart";
import { VOYAGE } from "@/lib/mission";

export function Landing() {
  return (
    <div className="theme-crew relative flex min-h-dvh flex-col bg-crew-bg text-crew-ivory">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <StarChart compact />
      </div>
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-xs tracking-[0.28em] text-crew-accent uppercase">{VOYAGE.programCrew}</p>
        <h1 className="mt-4 font-crew-serif text-5xl tracking-tight sm:text-7xl">{VOYAGE.shipName}</h1>
        <p className="mt-4 max-w-md text-pretty text-crew-ivory-dim">
          Wake. Walk the ship. Look at things. Ask if you must.
        </p>
        <Link
          to="/console"
          className="mt-10 rounded-[16px] bg-crew-accent px-8 py-3 font-medium text-crew-bg-deep transition-transform duration-150 ease-out active:scale-[0.96]"
        >
          Wake aboard
        </Link>
        <p className="mt-16 max-w-sm text-xs leading-relaxed text-crew-muted">
          Two skins for one deception. The ship is kind. The other layer is not.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-crew-muted">
          <Link to="/reveal/$pair" params={{ pair: "wake" }} className="hover:text-crew-ivory">
            Reveal pairs
          </Link>
          <Link to="/archive" search={{ tab: "spec" }} className="hover:text-crew-ivory">
            Study files
          </Link>
        </div>
      </div>
    </div>
  );
}