import { BEFORE_AFTER, DISSERTATION } from "@/lib/study/dissertation";
import { NYU_RECORD, USC_TRANSCRIPT, UTAH_TRANSCRIPT, type CourseRow } from "@/lib/study/degrees";

function Transcript({
  school,
  degree,
  conferred,
  gpa,
  honors,
  disclaimer,
  courses,
  applied,
}: {
  school: string;
  degree: string;
  conferred: string;
  gpa: string;
  honors: string;
  disclaimer: string;
  courses: CourseRow[];
  applied: string[];
}) {
  const credits = courses.reduce((n, c) => n + c.credits, 0);
  return (
    <article className="mx-auto max-w-3xl">
      <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">{disclaimer}</p>
      <h2 className="mt-3 font-crew-serif text-3xl">{school}</h2>
      <p className="mt-2 text-paper-muted">
        {degree} · {conferred} · GPA {gpa}
      </p>
      <p className="mt-1 text-sm text-paper-muted">{honors}</p>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-paper-line text-[11px] tracking-widest text-paper-muted uppercase">
            <th className="py-2 pr-3 font-normal">Course</th>
            <th className="py-2 pr-3 font-normal">Title</th>
            <th className="py-2 pr-3 font-normal">Term</th>
            <th className="py-2 pr-3 font-normal">Cr</th>
            <th className="py-2 font-normal">Gr</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.code + c.term} className="border-b border-paper-line/70">
              <td className="py-2 pr-3 font-obs-mono text-[12px]">{c.code}</td>
              <td className="py-2 pr-3">{c.title}</td>
              <td className="py-2 pr-3 text-paper-muted">{c.term}</td>
              <td className="py-2 pr-3 tabular">{c.credits}</td>
              <td className="py-2 tabular">{c.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-sm text-paper-muted">{credits} credits recorded · unofficial</p>
      <h3 className="mt-8 font-crew-serif text-xl">Applied to the ship</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {applied.map((line) => (
          <li key={line} className="text-pretty text-paper-muted">
            {line}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Degrees() {
  return (
    <div className="flex flex-col gap-16">
      <Transcript {...UTAH_TRANSCRIPT} />
      <Transcript {...USC_TRANSCRIPT} />
      <article className="mx-auto max-w-3xl">
        <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
          {NYU_RECORD.disclaimer}
        </p>
        <h2 className="mt-3 font-crew-serif text-3xl">{NYU_RECORD.school}</h2>
        <p className="mt-2 text-paper-muted">
          {NYU_RECORD.degree} · {NYU_RECORD.conferred}
        </p>
        <p className="mt-4 font-crew-serif text-xl">{NYU_RECORD.title}</p>
        <h3 className="mt-6 font-crew-serif text-lg">Committee (cited)</h3>
        <ul className="mt-2 flex flex-col gap-1 text-paper-muted">
          {NYU_RECORD.committee.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}

export function Thesis() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-10 text-pretty leading-relaxed">
      <header>
        <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
          {DISSERTATION.school}
        </p>
        <h2 className="mt-3 font-crew-serif text-3xl sm:text-4xl">{DISSERTATION.title}</h2>
        <p className="mt-2 text-paper-muted">{DISSERTATION.subtitle}</p>
        <p className="mt-1 text-sm text-paper-muted">
          {DISSERTATION.author} · {DISSERTATION.date}
        </p>
      </header>
      <section>
        <h3 className="font-crew-serif text-2xl">Abstract</h3>
        <p className="mt-3 text-paper-muted">{DISSERTATION.abstract}</p>
      </section>
      {DISSERTATION.chapters.map((ch) => (
        <section key={ch.kicker}>
          <p className="font-obs-mono text-[11px] tracking-widest text-paper-muted uppercase">
            Chapter {ch.kicker}
          </p>
          <h3 className="mt-2 font-crew-serif text-2xl">{ch.title}</h3>
          {ch.body.split("\n\n").map((p) => (
            <p key={p.slice(0, 40)} className="mt-3 text-paper-muted">
              {p}
            </p>
          ))}
        </section>
      ))}
      <section>
        <h3 className="font-crew-serif text-2xl">What changed in the work</h3>
        <p className="mt-3 text-paper-muted">
          Same ship. Same soul. The verbs mean something the second time.
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {BEFORE_AFTER.map((row) => (
            <li key={row.was} className="border-t border-paper-line pt-4">
              <p className="text-sm text-paper-muted">Was. {row.was}</p>
              <p className="mt-1">Now. {row.now}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
