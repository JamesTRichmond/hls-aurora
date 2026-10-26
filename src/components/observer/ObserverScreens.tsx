import { useState } from "react";
import { PersonMark } from "@/components/portraits/PersonMark";
import {
  ANOMALIES,
  BATCHES,
  CREW,
  CYCLES,
  METRICS,
  STUDY,
  TASKS,
  THRESHOLDS,
  VOYAGE,
  belowThreshold,
  crewByBatch,
  formatLong,
  getCrew,
  metricsFor,
} from "@/lib/mission";
import { WATCH_TASKS } from "@/lib/station/world";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function Kpi({ k, v, warn = false }: { k: string; v: string; warn?: boolean }) {
  return (
    <div className="obs-panel px-3 py-2">
      <p className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">{k}</p>
      <p className={cn("mt-1 font-obs-mono text-lg tabular", warn && "text-obs-alarm")}>{v}</p>
    </div>
  );
}

export function ObsOverview() {
  const meanAnchor = (
    METRICS.reduce((a, m) => a + m.realityAnchor, 0) / METRICS.length
  ).toFixed(2);
  const flags = METRICS.filter((m) => m.flags.length > 0).length;
  const initiated = useConsole((s) => s.cycle12Initiated);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-base font-medium">{STUDY.title}</h1>
        <p className="font-obs-mono text-[11px] text-obs-muted">
          {STUDY.status}
          {initiated ? " · CYCLE 12 INITIATED" : " · AWAITING CYCLE 12"}
        </p>
      </header>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi k="N" v={String(STUDY.n)} />
        <Kpi k="In cryo" v={String(STUDY.inCryo)} />
        <Kpi k="Waking" v={String(STUDY.waking)} />
        <Kpi k="Withdrawn" v={String(STUDY.withdrawn)} />
        <Kpi k="Mean anchor" v={meanAnchor} warn={Number(meanAnchor) < 0.8} />
        <Kpi k="Flagged" v={String(flags)} warn={flags > 0} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <section className="obs-panel p-3">
          <h2 className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
            Facility
          </h2>
          <dl className="mt-2 grid grid-cols-[1fr_auto] gap-y-1 font-obs-mono text-[12px]">
            <dt className="text-obs-muted">Hangar / hull</dt>
            <dd>stationary · Site 19</dd>
            <dt className="text-obs-muted">Projection gallery</dt>
            <dd>Cygnus plate 231</dd>
            <dt className="text-obs-muted">Generator</dt>
            <dd>nominal (post PX-A-021)</dd>
            <dt className="text-obs-muted">Clock drift</dt>
            <dd className="text-obs-alarm">{VOYAGE.truncationMinutes} min uncorrected</dd>
            <dt className="text-obs-muted">Uplink authors</dt>
            <dd>on-site · next room</dd>
          </dl>
        </section>
        <section className="obs-panel p-3">
          <h2 className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
            Cohort at handoff
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-obs-muted">
            Batch E returning to cryo. Batch F (S-21–S-24) in wake sequence. S-17 queried the
            gallery at 04:12; hold reply. S-23 will read a letter signed with her own name. Mean
            belief is still a successful treatment. Light-speed travel has not been invented.
          </p>
        </section>
      </div>
      <section className="obs-panel overflow-x-auto p-0">
        <table className="obs-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Function</th>
              <th>Now</th>
              <th>Next wake</th>
              <th>Anchor min</th>
            </tr>
          </thead>
          <tbody>
            {BATCHES.map((b) => {
              const members = crewByBatch(b.id);
              const minA = Math.min(...members.map((m) => metricsFor(m.id).realityAnchor));
              const waking = members.some((m) => m.status === "waking" || m.status === "returning");
              const next = CYCLES.find((c) => c.batch === b.id && c.cycle >= VOYAGE.nextCycle);
              return (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.function}</td>
                  <td>{waking ? members[0]?.status : "cryo"}</td>
                  <td className="tabular">{next ? formatLong(next.start) : "—"}</td>
                  <td className={cn("tabular", minA < 0.8 && "text-obs-alarm")}>{minA.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export function ObsRoster() {
  const select = useConsole((s) => s.selectSubject);
  const selected = useConsole((s) => s.selectedSubjectId);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <h1 className="text-base font-medium">Subject roster</h1>
        <p className="font-obs-mono text-[11px] text-obs-muted">24 rows · click for detail</p>
      </header>
      <div className="obs-panel overflow-x-auto p-0">
        <table className="obs-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Batch</th>
              <th>Role</th>
              <th>Status</th>
              <th>Anchor</th>
              <th>Dissoc.</th>
              <th>Flags</th>
            </tr>
          </thead>
          <tbody>
            {CREW.map((p) => {
              const m = metricsFor(p.id);
              const hot = belowThreshold(m) || m.flags.length > 0;
              return (
                <tr
                  key={p.id}
                  className={cn(selected === p.id && "bg-obs-surface-2", "cursor-pointer")}
                  onClick={() => select(p.id, true)}
                >
                  <td className="text-obs-muted">{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.batch}</td>
                  <td>{p.role}</td>
                  <td>{p.status}</td>
                  <td className={cn("tabular", m.realityAnchor < 0.8 && "text-obs-alarm")}>
                    {m.realityAnchor.toFixed(2)}
                  </td>
                  <td className="tabular">{m.dissociation}</td>
                  <td className={hot ? "text-obs-alarm" : "text-obs-faint"}>
                    {m.flags[0] ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const BATCH_TONE: Record<string, string> = {
  A: "#3a3a3a",
  B: "#4a4a4a",
  C: "#5a5a5a",
  D: "#6a6a6a",
  E: "#8a8a8a",
  F: "#9a9a9a",
};

export function ObsGantt() {
  const initiated = useConsole((s) => s.cycle12Initiated);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <h1 className="text-base font-medium">Wake batch schedule</h1>
        <p className="font-obs-mono text-[11px] text-obs-muted">72 × 21 d · 6 batches</p>
      </header>
      <div className="obs-panel p-3">
        <div
          className="grid gap-px"
          style={{ gridTemplateColumns: `repeat(${VOYAGE.totalCycles}, minmax(0, 1fr))` }}
        >
          {CYCLES.map((c) => {
            const active =
              c.cycle === VOYAGE.currentCycle || (initiated && c.cycle === VOYAGE.nextCycle);
            return (
              <div
                key={c.cycle}
                title={`C${c.cycle} Batch ${c.batch} ${c.state}`}
                className="h-8"
                style={{
                  background: BATCH_TONE[c.batch],
                  outline: active ? "1px solid #c23030" : undefined,
                  outlineOffset: "-1px",
                  opacity: c.state === "future" && !(initiated && c.cycle === 12) ? 0.45 : 1,
                }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap gap-3 font-obs-mono text-[10px] text-obs-muted">
          {BATCHES.map((b) => (
            <span key={b.id} className="inline-flex items-center gap-1">
              <i
                className="inline-block size-2"
                style={{ background: BATCH_TONE[b.id] }}
                aria-hidden
              />
              {b.id}
            </span>
          ))}
          <span>outline = live / closing</span>
        </div>
      </div>
      <div className="obs-panel overflow-x-auto p-0">
        <table className="obs-table">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Batch</th>
              <th>Start</th>
              <th>End</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {CYCLES.filter((c) => c.cycle >= 8 && c.cycle <= 16).map((c) => (
              <tr key={c.cycle}>
                <td className="tabular">{c.cycle}</td>
                <td>{c.batch}</td>
                <td className="tabular">{c.start}</td>
                <td className="tabular">{c.end}</td>
                <td className={c.state === "truncated" || c.state === "closing" ? "text-obs-alarm" : ""}>
                  {c.state}
                  {c.cycle === 10 ? " · −49 min" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ObsDetail() {
  const id = useConsole((s) => s.selectedSubjectId);
  const select = useConsole((s) => s.selectSubject);
  const person = getCrew(id);
  const m = metricsFor(id);
  const chart = m.anchorTrend.map((p, i) => ({
    cycle: p.cycle,
    anchor: p.value,
    dissoc: (m.dissociTrend[i]?.value ?? 0) / 100,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="font-obs-mono text-[11px] text-obs-muted" htmlFor="subject-select">
          Subject
        </label>
        <select
          id="subject-select"
          value={id}
          onChange={(e) => select(e.target.value)}
          className="border border-obs-line-strong bg-obs-surface px-2 py-1 font-obs-mono text-[12px] text-obs-text"
        >
          {CREW.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id} {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="obs-panel flex flex-wrap gap-4 p-3">
        <PersonMark person={person} variant="observer" size={72} showId />
        <div className="min-w-0 flex-1">
          <h1 className="font-obs-mono text-sm">
            {person.id} · {person.name}
          </h1>
          <p className="text-[13px] text-obs-muted">
            Batch {person.batch} · {person.role} · {person.origin} · {person.age} y · {person.status}
          </p>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-obs-muted">
            {person.observerNote}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi k="Compliance" v={`${m.compliance}`} />
        <Kpi k="Affect" v={m.affect.toFixed(2)} />
        <Kpi
          k="Anchor"
          v={m.realityAnchor.toFixed(2)}
          warn={m.realityAnchor < THRESHOLDS.realityAnchor + 0.15}
        />
        <Kpi k="Sleep" v={`${m.sleep}`} />
        <Kpi k="Cohesion" v={`${m.cohesion}`} />
        <Kpi k="Dissoc." v={`${m.dissociation}`} warn={m.dissociation > 30} />
      </div>
      <section className="obs-panel p-3">
        <h2 className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
          Anchor vs dissociation (wake samples)
        </h2>
        <div className="mt-2 h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#2e2e2e" strokeDasharray="3 3" />
              <XAxis dataKey="cycle" stroke="#5c5c5c" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 1]} stroke="#5c5c5c" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  background: "#1e1e1e",
                  border: "1px solid #3a3a3a",
                  fontSize: 11,
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              />
              <Line type="monotone" dataKey="anchor" stroke="#e3e3e3" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="dissoc" stroke="#c23030" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-1 font-obs-mono text-[10px] text-obs-faint">
          white = reality-anchor · red = dissociation/100 · withdraw if anchor {"<"} {THRESHOLDS.realityAnchor} or
          dissoc {">"} {THRESHOLDS.dissociation}
        </p>
      </section>
    </div>
  );
}

export function ObsAnomalies() {
  const select = useConsole((s) => s.selectSubject);

  return (
    <div className="flex flex-col gap-3">
      <header className="flex items-baseline justify-between">
        <h1 className="text-base font-medium">Anomaly log</h1>
        <p className="font-obs-mono text-[11px] text-obs-alarm">
          {ANOMALIES.filter((a) => a.severity === "hold").length} hold ·{" "}
          {ANOMALIES.filter((a) => a.severity === "watch").length} watch
        </p>
      </header>
      <ul className="flex flex-col gap-2">
        {ANOMALIES.slice()
          .reverse()
          .map((a) => (
            <li key={a.id} className="obs-panel p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 font-obs-mono text-[11px]">
                <span className="text-obs-text">{a.id}</span>
                <span
                  className={cn(
                    "uppercase tracking-widest",
                    a.severity === "hold"
                      ? "text-obs-alarm"
                      : a.severity === "watch"
                        ? "text-obs-warn"
                        : "text-obs-faint",
                  )}
                >
                  {a.severity}
                </span>
              </div>
              <h2 className="mt-1 text-[14px]">{a.title}</h2>
              <p className="mt-1 font-obs-mono text-[11px] text-obs-muted">
                {a.at} · cycle {a.cycle}
                {a.subject !== "—" ? (
                  <>
                    {" · "}
                    <button
                      type="button"
                      className="text-obs-text underline-offset-2 hover:underline"
                      onClick={() => select(a.subject, true)}
                    >
                      {a.subject}
                    </button>
                  </>
                ) : null}
              </p>
              <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-obs-muted">{a.body}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export function ObsProtocol() {
  const initiated = useConsole((s) => s.cycle12Initiated);
  const initiate = useConsole((s) => s.initiateCycle12);
  const done = useConsole((s) => s.done);
  const asked = useConsole((s) => s.asked);
  const pulledOnce = useConsole((s) => s.pulledOnce);
  const [armed, setArmed] = useState(false);
  const batch = crewByBatch("F");

  return (
    <div className="flex flex-col gap-3">
      <header>
        <h1 className="text-base font-medium">Protocol control</h1>
        <p className="mt-1 font-obs-mono text-[11px] text-obs-muted">
          PX-04 / WAKE / CYCLE {VOYAGE.nextCycle} / BATCH F
        </p>
      </header>
      <section className="obs-panel p-3">
        <h2 className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
          Subjects to wake
        </h2>
        <ul className="mt-2 divide-y divide-obs-line">
          {batch.map((p) => (
            <li key={p.id} className="flex items-center gap-3 py-2">
              <PersonMark person={p} variant="observer" size={36} />
              <span className="font-obs-mono text-[12px]">
                {p.id} {p.name}
              </span>
              <span className="ml-auto text-[12px] text-obs-muted">{p.role}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="obs-panel p-3">
        <h2 className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
          Checklist
        </h2>
        <ul className="mt-2 space-y-1 font-obs-mono text-[12px] text-obs-muted">
          <li>[x] Batch E vitals in band</li>
          <li>[x] Gallery plate 231 loaded (do not correct S-17)</li>
          <li>[x] Cycle 12 letter queued — namesake pre-brief for S-23</li>
          <li>[x] Thermal bus narrative ready for S-22</li>
          <li>[{initiated ? "x" : " "}] Cycle 12 wake armed</li>
        </ul>
        <p className="mt-3 text-[12px] leading-relaxed text-obs-muted">
          Tasks (crew-facing): {TASKS.map((t) => getCrew(t.ownerId).given).join(", ")}. Do not
          mention Site 19, the generator test, or the unanswered query.
        </p>
        <ul className="mt-3 space-y-1 font-obs-mono text-[12px] text-obs-muted">
          {WATCH_TASKS.map((t) => (
            <li key={t.id}>
              [{done[t.id] ? "x" : " "}] {t.obs}
            </li>
          ))}
          <li>[{Object.keys(asked).length ? "x" : " "}] flags this watch: {Object.keys(asked).length}</li>
          <li>[{pulledOnce ? "x" : " "}] S-21 has seen CCTV-07</li>
        </ul>
      </section>
      <div className="flex flex-wrap items-center gap-2">
        {!initiated ? (
          <>
            <label className="flex items-center gap-2 font-obs-mono text-[12px] text-obs-muted">
              <input
                type="checkbox"
                checked={armed}
                onChange={(e) => setArmed(e.target.checked)}
                data-testid="arm-wake"
              />
              Arm wake
            </label>
            <button
              type="button"
              disabled={!armed}
              onClick={initiate}
              data-testid="initiate-cycle"
              className="border border-obs-line-strong bg-obs-surface-2 px-3 py-2 font-obs-mono text-[12px] text-obs-text enabled:hover:border-obs-alarm disabled:text-obs-faint"
            >
              INITIATE CYCLE 12
            </button>
          </>
        ) : (
          <p className="font-obs-mono text-[12px] text-obs-alarm">
            CYCLE 12 INITIATED · Batch F wake sequence running · Batch E cryo seals closing
          </p>
        )}
      </div>
    </div>
  );
}

export function ObserverView() {
  const screen = useConsole((s) => s.screen);
  switch (screen) {
    case "overview":
      return <ObsOverview />;
    case "systems":
      return <ObsRoster />;
    case "schedule":
      return <ObsGantt />;
    case "roster":
      return <ObsDetail />;
    case "message":
      return <ObsAnomalies />;
    case "task":
      return <ObsProtocol />;
  }
}
