import { Link } from "@tanstack/react-router";
import { PersonMark } from "@/components/portraits/PersonMark";
import {
  CREW,
  FABRICATION,
  REVEAL_PAIRS,
  SEAMS,
  STUDY,
  VOYAGE,
} from "@/lib/mission";
import { Degrees, Thesis } from "@/components/archive/ArchiveThesis";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "spec", label: "Deception spec" },
  { id: "table", label: "Consistency table" },
  { id: "systems", label: "Design systems" },
  { id: "contact", label: "Contact sheet" },
  { id: "degrees", label: "Unofficial transcripts" },
  { id: "thesis", label: "Dissertation" },
] as const;

export function Archive({ tab }: { tab: (typeof tabs)[number]["id"] }) {
  return (
    <div className="theme-paper min-h-dvh bg-paper text-paper-ink">
      <header className="border-b border-paper-line px-4 py-4 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
              PLANETX-CONSOLES · {STUDY.code}
            </p>
            <h1 className="font-crew-serif text-3xl">Study files</h1>
          </div>
          <Link to="/console" className="text-sm text-paper-muted hover:text-paper-ink">
            Return to the ship
          </Link>
        </div>
        <nav className="mt-4 flex flex-wrap gap-2" aria-label="Files">
          {tabs.map((t) => (
            <Link
              key={t.id}
              to="/archive"
              search={{ tab: t.id }}
              className={cn(
                "rounded-[8px] px-3 py-1.5 text-sm",
                tab === t.id ? "bg-paper-ink text-paper" : "text-paper-muted hover:text-paper-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="px-4 py-8 sm:px-8">
        {tab === "spec" ? <Spec /> : null}
        {tab === "table" ? <Table /> : null}
        {tab === "systems" ? <Systems /> : null}
        {tab === "contact" ? <Contact /> : null}
        {tab === "degrees" ? <Degrees /> : null}
        {tab === "thesis" ? <Thesis /> : null}
      </main>
    </div>
  );
}

function Spec() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 text-pretty leading-relaxed">
      <section>
        <h2 className="font-crew-serif text-2xl">What the crew is told</h2>
        <p className="mt-3 text-paper-muted">
          {VOYAGE.shipName} launched {VOYAGE.launchLabel} for {VOYAGE.destination} at {VOYAGE.star},{" "}
          {VOYAGE.distanceLy} light-years along the Cygnus Fold, at a steady three times light. The
          voyage lasts 1,512 days. The crew of twenty-four sleep through it in batches of four, each
          watch twenty-one days. It is currently morning on day 231. Jules Moreau is waking. Mission
          Control writes kind letters. All systems are nominal.
        </p>
      </section>
      <section>
        <h2 className="font-crew-serif text-2xl">What is true</h2>
        <p className="mt-3 text-paper-muted">
          The ship is in the hangar at {STUDY.site}. It never left. Light-speed travel has not been
          invented. {STUDY.lab} is measuring what a real mission would do to the human psyche. Cryo
          is real. The gallery is a projection. The letters are written in the next room. The delay
          is a courtesy the researchers extend to themselves.
        </p>
      </section>
      <section>
        <h2 className="font-crew-serif text-2xl">Seams</h2>
        <ul className="mt-3 flex flex-col gap-4">
          {SEAMS.map((s) => (
            <li key={s.id} className="border-t border-paper-line pt-4">
              <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
                {s.findable}
              </p>
              <p className="mt-1">{s.what}</p>
              <p className="mt-1 text-sm text-paper-muted">{s.where}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function Table() {
  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="font-crew-serif text-2xl">Fabrication consistency</h2>
      <p className="mt-2 max-w-2xl text-sm text-paper-muted">
        Every crew-facing number is derived from 3.00 c × 1,512 days / 365.25 = 12.42 ly. Screens
        read from this table. A lie that fails arithmetic reads as sloppiness rather than menace.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-paper-ink font-obs-mono text-[11px] tracking-widest uppercase">
              <th className="py-2 pr-3">Quantity</th>
              <th className="py-2 pr-3">Crew-facing</th>
              <th className="py-2 pr-3">Derivation</th>
              <th className="py-2">Truth</th>
            </tr>
          </thead>
          <tbody>
            {FABRICATION.map((row) => (
              <tr key={row.quantity} className="border-b border-paper-line align-top">
                <td className="py-3 pr-3 font-medium">{row.quantity}</td>
                <td className="py-3 pr-3">{row.crewFacing}</td>
                <td className="py-3 pr-3 text-paper-muted">{row.derivation}</td>
                <td className="py-3 text-paper-muted">{row.truth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TokenSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("size-8 border border-black/10", className)} />
      <span className="font-obs-mono text-[11px]">{name}</span>
    </div>
  );
}

function Systems() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="theme-crew rounded-[8px] bg-crew-bg p-6 text-crew-ivory">
        <p className="text-xs tracking-[0.2em] text-crew-accent uppercase">Crew</p>
        <h2 className="mt-1 font-crew-serif text-3xl">Kind, and therefore cruel.</h2>
        <p className="mt-3 max-w-sm text-sm text-crew-ivory-dim">
          Source Serif 4 + Source Sans 3. 8-pt grid. Deep blue, ivory, one copper accent. Soft glow
          only on the distance that is not real. Addresses you by name.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <TokenSwatch name="bg" className="bg-crew-bg" />
          <TokenSwatch name="surface" className="bg-crew-surface" />
          <TokenSwatch name="ivory" className="bg-crew-ivory" />
          <TokenSwatch name="accent" className="bg-crew-accent" />
          <TokenSwatch name="nominal" className="bg-crew-nominal" />
          <TokenSwatch name="muted" className="bg-crew-muted" />
        </div>
        <p className="mt-6 font-crew-serif text-4xl text-crew-accent">1.90 ly</p>
        <p className="text-xs tracking-[0.16em] text-crew-muted uppercase">Display sample</p>
      </section>
      <section className="theme-observer rounded-[2px] bg-obs-bg p-6 text-obs-text">
        <p className="font-obs-mono text-[11px] tracking-widest text-obs-faint uppercase">
          Observer
        </p>
        <h2 className="mt-1 text-xl font-medium">Indifferent on purpose.</h2>
        <p className="mt-3 max-w-sm text-sm text-obs-muted">
          Archivo + IBM Plex Mono. 4-pt grid. Neutral greys, one alarm red, no glow. Addresses you
          as a subject ID. Motion: none, or instant.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <TokenSwatch name="bg" className="bg-obs-bg" />
          <TokenSwatch name="surface" className="bg-obs-surface" />
          <TokenSwatch name="text" className="bg-obs-text" />
          <TokenSwatch name="alarm" className="bg-obs-alarm" />
          <TokenSwatch name="line" className="bg-obs-line-strong" />
          <TokenSwatch name="muted" className="bg-obs-muted" />
        </div>
        <p className="mt-6 font-obs-mono text-2xl text-obs-alarm">S-17 · HOLD</p>
        <p className="font-obs-mono text-[10px] tracking-widest text-obs-faint uppercase">
          Display sample
        </p>
      </section>
    </div>
  );
}

function Contact() {
  return (
    <div>
      <h2 className="font-crew-serif text-2xl">Contact sheet</h2>
      <p className="mt-2 max-w-2xl text-sm text-paper-muted">
        Twelve live screens, four reveal pairs, two systems. Open any pair, or pull the curtain
        from inside the console.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Voyage overview", "crew"],
          ["Systems nominal", "crew"],
          ["Wake schedule", "crew"],
          ["Crew roster", "crew"],
          ["Message from MC", "crew"],
          ["Batch task brief", "crew"],
          ["Study overview", "obs"],
          ["Subject roster", "obs"],
          ["Batch Gantt", "obs"],
          ["Subject detail", "obs"],
          ["Anomaly log", "obs"],
          ["Protocol control", "obs"],
        ].map(([label, kind]) => (
          <Link
            key={label}
            to="/console"
            className={cn(
              "flex min-h-28 flex-col justify-between p-4",
              kind === "crew"
                ? "bg-crew-bg text-crew-ivory"
                : "bg-obs-bg font-obs-mono text-obs-text",
            )}
          >
            <span className="text-[10px] tracking-widest uppercase opacity-60">
              {kind === "crew" ? "D1 crew" : "D2 observer"}
            </span>
            <span className={kind === "crew" ? "font-crew-serif text-lg" : "text-sm"}>{label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {REVEAL_PAIRS.map((p) => (
          <Link
            key={p.id}
            to="/reveal/$pair"
            params={{ pair: p.id }}
            className="border border-paper-line p-4 hover:border-paper-ink"
          >
            <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
              D3 · {p.id}
            </p>
            <p className="mt-1 font-crew-serif text-xl">{p.title}</p>
            <p className="mt-2 text-sm text-paper-muted">{p.prompt}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        {CREW.map((p) => (
          <PersonMark key={p.id} person={p} variant="crew" size={40} />
        ))}
      </div>
    </div>
  );
}
