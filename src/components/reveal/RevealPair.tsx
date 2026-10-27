import type { ReactNode } from "react";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { CrewChrome } from "@/components/crew/CrewChrome";
import {
  CrewMessages,
  CrewOverview,
  CrewRoster,
  CrewSchedule,
  CrewSystems,
  CrewTask,
} from "@/components/crew/CrewScreens";
import { ObserverChrome } from "@/components/observer/ObserverChrome";
import {
  ObsAnomalies,
  ObsDetail,
  ObsGantt,
  ObsOverview,
  ObsProtocol,
  ObsRoster,
} from "@/components/observer/ObserverScreens";
import { REVEAL_PAIRS, type ScreenId } from "@/lib/mission";
import { useConsole } from "@/lib/store";

const CREW_MAP: Record<ScreenId, () => ReactNode> = {
  overview: () => <CrewOverview />,
  systems: () => <CrewSystems />,
  schedule: () => <CrewSchedule />,
  roster: () => <CrewRoster />,
  message: () => <CrewMessages />,
  task: () => <CrewTask />,
};

const OBS_MAP: Record<ScreenId, () => ReactNode> = {
  overview: () => <ObsOverview />,
  systems: () => <ObsRoster />,
  schedule: () => <ObsGantt />,
  roster: () => <ObsDetail />,
  message: () => <ObsAnomalies />,
  task: () => <ObsProtocol />,
};

export function RevealPair({ pairId }: { pairId: string }) {
  const pair = REVEAL_PAIRS.find((p) => p.id === pairId) ?? REVEAL_PAIRS[0];
  const setScreen = useConsole((s) => s.setScreen);
  const select = useConsole((s) => s.selectSubject);

  useEffect(() => {
    setScreen(pair.crewScreen);
    if (pair.id === "question") select("S-17");
    if (pair.id === "message") select("S-23");
  }, [pair, setScreen, select]);

  const CrewScreen = CREW_MAP[pair.crewScreen];
  const ObsScreen = OBS_MAP[pair.obsScreen];

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-paper-line bg-paper px-4 py-3 text-paper-ink">
        <div>
          <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
            D3 · {pair.id}
          </p>
          <h1 className="font-crew-serif text-2xl">{pair.title}</h1>
          <p className="max-w-xl text-sm text-paper-muted">{pair.prompt}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          {REVEAL_PAIRS.map((p) => (
            <Link
              key={p.id}
              to="/reveal/$pair"
              params={{ pair: p.id }}
              className={p.id === pair.id ? "text-paper-ink" : "text-paper-muted"}
            >
              {p.id}
            </Link>
          ))}
          <Link to="/console" className="text-paper-muted">
            Console
          </Link>
        </div>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-2" style={{ minHeight: "calc(100dvh - 7.5rem)" }}>
        <div className="min-h-[28rem] overflow-hidden border-b border-paper-line md:border-r md:border-b-0">
          <div className="h-full">
            <CrewChrome embedded>
              <CrewScreen />
            </CrewChrome>
          </div>
        </div>
        <div className="min-h-[28rem] overflow-hidden">
          <div className="h-full">
            <ObserverChrome embedded>
              <ObsScreen />
            </ObserverChrome>
          </div>
        </div>
      </div>
    </div>
  );
}
