import { PersonMark } from "@/components/portraits/PersonMark";
import { StarChart } from "@/components/crew/StarChart";
import { CrewScreen, Stat } from "@/components/crew/CrewChrome";
import {
  BATCHES,
  CREW,
  CYCLES,
  MESSAGES,
  SYSTEMS_CREW,
  TASKS,
  VIEWER,
  VOYAGE,
  crewByBatch,
  formatLong,
  getCrew,
} from "@/lib/mission";
import { useConsole } from "@/lib/store";
import { WATCH_TASKS } from "@/lib/station/world";
import { cn } from "@/lib/utils";

export function CrewOverview() {
  const remainingYears = Math.floor(VOYAGE.remainingDays / 365);
  const remainingDays = VOYAGE.remainingDays - remainingYears * 365;

  return (
    <CrewScreen kicker="Voyage overview" title="The corridor is holding.">
      <div className="crew-panel overflow-hidden rounded-[24px] p-2 sm:p-3">
        <div className="aspect-[16/9] w-full">
          <StarChart />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Distance travelled" value={`${VOYAGE.travelledDisplay} ly`} hint="from Sol" glow />
        <Stat label="Elapsed" value={`${VOYAGE.elapsedDays} days`} hint={VOYAGE.nowLabel} />
        <Stat
          label="Remaining"
          value={`${VOYAGE.remainingDisplay} ly`}
          hint={`${remainingYears} y ${remainingDays} d`}
        />
        <Stat label="Arrival" value="4 May 2035" hint={`${VOYAGE.arrivalCrew.split(" · ")[1]} ship`} />
      </div>
      <p className="max-w-2xl text-pretty text-crew-ivory-dim">
        {VOYAGE.shipName} is {VOYAGE.travelledDisplay} light-years along the Cygnus Fold, bound for{" "}
        {VOYAGE.destination} at {VOYAGE.star}. Fold velocity is a steady three times light. Nothing
        on the board asks anything of you this morning except to be here.
      </p>
    </CrewScreen>
  );
}

export function CrewSystems() {
  return (
    <CrewScreen kicker="Systems" title="All systems nominal.">
      <p className="max-w-xl text-crew-ivory-dim">
        Ten boards. Nine quiet. One courtesy note from cryo, well inside spec. You may log and
        leave them.
      </p>
      <ul className="flex flex-col gap-2">
        {SYSTEMS_CREW.map((sys) => (
          <li
            key={sys.id}
            className="crew-panel flex flex-col gap-1 rounded-[16px] px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm text-crew-ivory">{sys.name}</p>
              <p className="text-sm text-crew-muted">{sys.detail}</p>
            </div>
            <span
              className={cn(
                "mt-2 shrink-0 text-xs tracking-[0.14em] uppercase sm:mt-0",
                sys.status === "advisory" ? "text-crew-advisory" : "text-crew-nominal",
              )}
            >
              {sys.status}
            </span>
          </li>
        ))}
      </ul>
    </CrewScreen>
  );
}

export function CrewSchedule() {
  const closing = CYCLES.find((c) => c.cycle === VOYAGE.currentCycle)!;
  const next = CYCLES.find((c) => c.cycle === VOYAGE.nextCycle)!;
  const closingCrew = crewByBatch(closing.batch);
  const nextCrew = crewByBatch(next.batch);
  const upcoming = CYCLES.filter(
    (c) => c.cycle >= VOYAGE.currentCycle && c.cycle <= VOYAGE.currentCycle + 5,
  );

  return (
    <CrewScreen kicker="Wake schedule" title="Four going down. Four coming up.">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="crew-panel rounded-[24px] p-6">
          <p className="text-xs tracking-[0.16em] text-crew-muted uppercase">Returning to sleep</p>
          <p className="mt-2 font-crew-serif text-2xl">Batch {closing.batch}</p>
          <p className="text-sm text-crew-muted">
            Cycle {closing.cycle} · {formatLong(closing.start)} – {formatLong(closing.end)}
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {closingCrew.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <PersonMark person={p} variant="crew" size={44} />
                <div>
                  <p className="text-sm">{p.name}</p>
                  <p className="text-xs text-crew-muted">{p.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="crew-panel rounded-[24px] p-6 ring-1 ring-crew-accent/40">
          <p className="text-xs tracking-[0.16em] text-crew-accent uppercase">Waking now</p>
          <p className="mt-2 font-crew-serif text-2xl">Batch {next.batch}</p>
          <p className="text-sm text-crew-muted">
            Cycle {next.cycle} of {VOYAGE.totalCycles} · {formatLong(next.start)} –{" "}
            {formatLong(next.end)}
          </p>
          <ul className="mt-5 flex flex-col gap-3">
            {nextCrew.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <PersonMark person={p} variant="crew" size={44} />
                <div>
                  <p className="text-sm">
                    {p.name}
                    {p.id === VIEWER.id ? (
                      <span className="ml-2 text-xs text-crew-accent">you</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-crew-muted">{p.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <ol className="crew-panel divide-y divide-crew-line-soft overflow-hidden rounded-[24px]">
        {upcoming.map((c) => (
          <li key={c.cycle} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3">
            <span className="text-sm">
              Cycle {c.cycle}
              <span className="ml-2 text-crew-muted">Batch {c.batch}</span>
            </span>
            <span className="tabular text-sm text-crew-muted">
              {formatLong(c.start)} → {formatLong(c.end)}
            </span>
          </li>
        ))}
      </ol>
    </CrewScreen>
  );
}

export function CrewRoster() {
  return (
    <CrewScreen kicker="Crew roster" title="Twenty-four, in six watches.">
      <p className="max-w-xl text-crew-ivory-dim">
        Complement of {CREW.length}. You are {VIEWER.name}, operations, Batch F. Faces here are the
        people you will hand the ship to, and who will hand it back.
      </p>
      <div className="flex flex-col gap-8">
        {BATCHES.map((b) => (
          <section key={b.id}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-crew-serif text-xl">Batch {b.id}</h2>
              <p className="text-xs tracking-[0.14em] text-crew-muted uppercase">{b.function}</p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {crewByBatch(b.id).map((p) => (
                <li
                  key={p.id}
                  className={cn(
                    "crew-panel flex items-center gap-4 rounded-[16px] p-3",
                    p.id === VIEWER.id && "ring-1 ring-crew-accent/50",
                  )}
                >
                  <PersonMark person={p} variant="crew" size={56} />
                  <div className="min-w-0">
                    <p className="truncate text-sm">
                      {p.name}
                      {p.id === VIEWER.id ? (
                        <span className="ml-2 text-xs text-crew-accent">you</span>
                      ) : null}
                    </p>
                    <p className="text-xs text-crew-muted">
                      {p.role} · {p.origin}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </CrewScreen>
  );
}

export function CrewMessages() {
  const current = MESSAGES.find((m) => m.id === "mc-12")!;
  const outbound = MESSAGES.find((m) => m.id === "anya-q")!;
  const archive = MESSAGES.filter((m) => m.direction === "inbound" && m.id !== "mc-12");

  return (
    <CrewScreen kicker="Mission control" title="A letter from Earth.">
      <article className="crew-panel rounded-[24px] px-6 py-8 sm:px-10">
        <p className="text-xs tracking-[0.16em] text-crew-muted uppercase">
          {current.from} · {current.shipTime}
        </p>
        <p className="mt-1 text-sm text-crew-muted">To {current.to}</p>
        <h2 className="mt-6 font-crew-serif text-2xl">{current.subject}</h2>
        <div className="mt-5 max-w-2xl space-y-4 text-pretty leading-relaxed text-crew-ivory-dim">
          {current.body.split("\n\n").map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </article>

      <section className="crew-panel rounded-[24px] px-6 py-5">
        <p className="text-xs tracking-[0.16em] text-crew-advisory uppercase">Outbound · in transit</p>
        <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-sm">
            {outbound.from} · {outbound.subject}
          </p>
          <p className="tabular text-xs text-crew-muted">
            Earth delay {VOYAGE.commsDelay} · queued {outbound.shipTime}
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-crew-muted">
          {outbound.body.split("\n\n")[0]}
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xs tracking-[0.16em] text-crew-muted uppercase">Earlier letters</h2>
        <ul className="flex flex-col gap-2">
          {archive.map((m) => (
            <li key={m.id} className="crew-panel rounded-[16px] px-5 py-4">
              <p className="text-xs text-crew-muted">
                Cycle {m.cycle} · {m.shipTime}
              </p>
              <p className="mt-1 text-sm">{m.subject}</p>
            </li>
          ))}
        </ul>
      </section>
    </CrewScreen>
  );
}

export function CrewTask() {
  const done = useConsole((s) => s.done);
  const asked = useConsole((s) => s.asked);
  const pulledOnce = useConsole((s) => s.pulledOnce);
  const askedPeople = CREW.filter((c) => asked[c.id]);

  return (
    <CrewScreen kicker="Cycle 12 brief" title="Nothing heroic. That is the point.">
      <p className="max-w-xl text-crew-ivory-dim">
        Twenty-one days. You will cover {VOYAGE.cycleDistanceDisplay} light-years while you work.
        Sleep returns on {formatLong("2031-11-21")} at {VOYAGE.shipClock}.
      </p>
      <section className="crew-panel rounded-[24px] p-5">
        <p className="text-xs tracking-[0.14em] text-crew-accent uppercase">This watch</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-crew-ivory-dim">
          {WATCH_TASKS.map((t) => (
            <li key={t.id} className="flex justify-between gap-3">
              <span>{t.crew}</span>
              <span className="text-crew-accent">{done[t.id] ? "closed" : "open"}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-crew-ivory-dim">
          {askedPeople.length
            ? `Asked: ${askedPeople.map((p) => p.given).join(", ")}.`
            : "You have not asked anyone yet. You do not have to."}
        </p>
        <p className="mt-2 text-sm text-crew-muted">
          {pulledOnce
            ? "You have drawn the brass. The corridor is still holding."
            : "The brass on the right is not part of the voyage."}
        </p>
      </section>
      <ul className="flex flex-col gap-4">
        {TASKS.map((t) => {
          const owner = getCrew(t.ownerId);
          return (
            <li key={t.ownerId} className="crew-panel flex gap-4 rounded-[24px] p-5">
              <PersonMark person={owner} variant="crew" size={56} />
              <div className="min-w-0">
                <p className="text-xs tracking-[0.14em] text-crew-accent uppercase">{owner.name}</p>
                <h2 className="mt-1 font-crew-serif text-xl">{t.title}</h2>
                <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-crew-ivory-dim">
                  {t.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </CrewScreen>
  );
}

export function CrewView() {
  const screen = useConsole((s) => s.screen);
  switch (screen) {
    case "overview":
      return <CrewOverview />;
    case "systems":
      return <CrewSystems />;
    case "schedule":
      return <CrewSchedule />;
    case "roster":
      return <CrewRoster />;
    case "message":
      return <CrewMessages />;
    case "task":
      return <CrewTask />;
  }
}
