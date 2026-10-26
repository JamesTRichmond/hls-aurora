import { PersonMark } from "@/components/portraits/PersonMark";
import { getCrew, VIEWER, VOYAGE } from "@/lib/mission";
import { performInteract } from "@/lib/station/act";
import { currentRoom, liveWatch, nearbyList, setTouch, walkToThing } from "@/lib/station/sim";
import { INTENTS, WATCH_TASKS } from "@/lib/station/world";
import { useConsole } from "@/lib/store";
import { cn } from "@/lib/utils";
import { usePointerDrag } from "@/components/deck/usePointerDrag";
import { useEffect, useState } from "react";

export function DeckHud() {
  const layer = useConsole((s) => s.layer);
  const intent = useConsole((s) => s.intent);
  const setIntent = useConsole((s) => s.setIntent);
  const setPdaOpen = useConsole((s) => s.setPdaOpen);
  const toggleHelp = useConsole((s) => s.toggleHelp);
  const open = useConsole((s) => s.pdaOpen);
  const card = useConsole((s) => s.card);
  const setCard = useConsole((s) => s.setCard);
  const radio = useConsole((s) => s.radio);
  const done = useConsole((s) => s.done);
  const focus = useConsole((s) => s.focus);
  const woke = useConsole((s) => s.woke);
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setBeat((n) => n + 1), 280);
    return () => window.clearInterval(id);
  }, []);
  const crew = layer === "crew";
  const room = currentRoom();
  const watch = liveWatch();
  const near = woke ? nearbyList() : [];
  void beat;
  const visibleRadio = radio.filter((l) => l.layer === layer || l.layer === "both").slice(-4);
  const tasksDone = WATCH_TASKS.filter((k) => done[k.id]).length;
  const nextTask = WATCH_TASKS.find((t) => !done[t.id]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col">
      <header
        className={cn(
          "pointer-events-auto flex shrink-0 items-center justify-between gap-3 px-3 py-2 sm:px-5",
          crew
            ? "border-b border-crew-line-soft bg-crew-bg/80 text-crew-ivory backdrop-blur-sm"
            : "border-b border-obs-line bg-obs-bg/90 font-obs-mono text-[12px] text-obs-text",
        )}
      >
        <div className="min-w-0">
          <p className={cn("truncate", crew ? "font-crew-serif text-base sm:text-lg" : "text-obs-text")}>
            {crew ? VOYAGE.shipName : "PX-04 · CCTV-07"}
          </p>
          <p className={cn("truncate text-xs", crew ? "text-crew-muted" : "text-obs-faint")}>
            {crew
              ? `${room?.crewName ?? "Deck"} · ${watch.phase.crew}${nextTask ? ` · ${nextTask.crew}` : " · Watch quiet"}`
              : `${room?.obsName ?? "Floor"} · ${watch.phase.obs}${nextTask ? ` · ${nextTask.obs}` : " · done"}`}
          </p>
        </div>
        <p className={cn("hidden tabular sm:block", crew ? "font-crew-serif text-crew-ivory-dim" : "text-obs-muted")}>
          {crew ? watch.ship : watch.facility}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => toggleHelp()}
            className={cn(
              "min-h-11 px-3 py-2 text-xs tracking-[0.14em] uppercase",
              crew
                ? "rounded-crew-sm bg-crew-elevated text-crew-ivory ring-1 ring-crew-line-soft"
                : "rounded-obs bg-obs-surface-2 font-obs-mono text-obs-text",
            )}
          >
            Esc
          </button>
          <button
            type="button"
            onClick={() => setPdaOpen(!open)}
            className={cn(
              "min-h-11 px-3 py-2 text-xs tracking-[0.14em] uppercase",
              crew
                ? "rounded-crew-sm bg-crew-accent text-crew-bg-deep"
                : "rounded-obs bg-obs-surface-2 text-obs-text",
            )}
          >
            {crew ? "PDA" : "Station"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <div className="flex w-full min-w-0 flex-col justify-between p-3 sm:p-4">
          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            {INTENTS.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIntent(it.id)}
                className={cn(
                  "min-h-11 px-3 text-xs tracking-[0.12em] uppercase",
                  crew ? "rounded-crew-sm" : "rounded-obs font-obs-mono",
                  intent === it.id
                    ? crew
                      ? "bg-crew-accent text-crew-bg-deep"
                      : "bg-obs-alarm text-obs-text"
                    : crew
                      ? "bg-crew-elevated/80 text-crew-muted"
                      : "bg-obs-surface text-obs-muted",
                )}
              >
                {crew ? it.crew : it.obs}
                <span className="ml-2 hidden opacity-60 sm:inline">{it.key}</span>
              </button>
            ))}
          </div>
          <div className="pointer-events-auto mt-2 flex max-w-xl flex-wrap gap-1.5">
            {near.length ? (
              near.map((row) => {
                const on = focus?.type === row.type && focus.id === row.id;
                const label = crew ? row.crewName : row.obsName;
                return (
                  <button
                    key={`${row.type}-${row.id}`}
                    type="button"
                    onClick={() => performInteract({ type: row.type, id: row.id })}
                    className={cn(
                      "min-h-11 max-w-[11rem] truncate px-3 text-left text-xs",
                      crew ? "rounded-crew-sm" : "rounded-obs font-obs-mono",
                      on
                        ? crew
                          ? "bg-crew-ivory text-crew-bg-deep"
                          : "bg-obs-text text-obs-bg"
                        : crew
                          ? "bg-crew-elevated/90 text-crew-ivory ring-1 ring-crew-line-soft"
                          : "bg-obs-surface-2 text-obs-text",
                    )}
                  >
                    {label}
                  </button>
                );
              })
            ) : woke ? (
              <p className={cn("min-h-11 px-1 py-2 text-xs", crew ? "text-crew-muted" : "font-obs-mono text-obs-faint")}>
                {crew ? "Nothing in reach." : "No subject on this tile."}
              </p>
            ) : null}
          </div>
          <div className="pointer-events-auto mt-2 flex max-w-xl gap-1.5 overflow-x-auto">
            {WATCH_TASKS.map((task) => {
              const closed = Boolean(done[task.id]);
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => {
                    setIntent("use");
                    walkToThing(task.where);
                  }}
                  className={cn(
                    "min-h-11 shrink-0 px-3 text-left text-[11px] tracking-[0.06em] uppercase",
                    crew ? "rounded-crew-sm" : "rounded-obs font-obs-mono",
                    closed
                      ? crew
                        ? "bg-crew-elevated/50 text-crew-nominal"
                        : "bg-obs-surface text-obs-ok"
                      : crew
                        ? "bg-crew-bg/80 text-crew-ivory ring-1 ring-crew-line-soft"
                        : "bg-obs-surface-2 text-obs-text",
                  )}
                >
                  {closed ? "●" : "○"} {crew ? task.crew : task.obs}
                </button>
              );
            })}
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div
              className={cn(
                "pointer-events-none max-w-md space-y-1 text-[11px] leading-snug",
                crew ? "font-crew-sans text-crew-ivory-dim" : "font-obs-mono text-obs-muted",
              )}
            >
              {visibleRadio.map((l) => (
                <p key={l.id} className="line-clamp-2">
                  <span className={crew ? "text-crew-accent" : "text-obs-faint"}>
                    [{l.channel}] {l.speaker}:
                  </span>{" "}
                  {l.text}
                </p>
              ))}
            </div>
            <div
              className={cn(
                "pointer-events-auto hidden shrink-0 items-center gap-2 sm:flex",
                crew ? "text-crew-muted" : "font-obs-mono text-obs-faint",
              )}
            >
              <div
                className={cn(
                  "flex h-14 w-20 flex-col justify-center px-2",
                  crew ? "crew-panel rounded-crew-sm" : "obs-panel",
                )}
              >
                <p className="text-[9px] tracking-widest uppercase">{crew ? "ID" : "S-21"}</p>
                <p className={cn("text-xs", crew ? "text-crew-ivory" : "text-obs-text")}>
                  {crew ? VIEWER.name.split(" ")[1] : "live"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPdaOpen(true)}
                className={cn(
                  "flex h-14 w-24 flex-col justify-center px-2 text-left",
                  crew ? "crew-panel rounded-crew-sm" : "obs-panel",
                )}
              >
                <p className="text-[9px] tracking-widest uppercase">{crew ? "PDA" : "WS"}</p>
                <p className={cn("text-xs", crew ? "text-crew-ivory" : "text-obs-text")}>
                  {tasksDone}/5
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {card ? (
        <article
          className={cn(
            "pointer-events-auto mx-3 mb-3 max-w-xl sm:mx-5",
            crew ? "crew-panel rounded-crew-lg p-4" : "obs-panel p-3",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={cn(
                  "text-[10px] tracking-[0.16em] uppercase",
                  crew ? "text-crew-accent" : "font-obs-mono text-obs-faint",
                )}
              >
                {card.parent
                  ? crew
                    ? "Look closer"
                    : "detail"
                  : crew
                    ? intent
                    : intent === "examine"
                      ? "inspect"
                      : intent === "use"
                        ? "operate"
                        : "flag"}
              </p>
              <h2 className={cn("mt-1", crew ? "font-crew-serif text-xl" : "text-sm font-medium")}>{card.title}</h2>
            </div>
            {card.personId ? (
              <PersonMark
                person={getCrew(card.personId)}
                variant={crew ? "crew" : "observer"}
                size={40}
              />
            ) : null}
            <button
              type="button"
              className={cn("min-h-11 shrink-0 px-2 text-xs", crew ? "text-crew-muted" : "text-obs-faint")}
              onClick={() => setCard(card.parent ?? null)}
            >
              {card.parent ? "Back" : "Dismiss"}
            </button>
          </div>
          <p className={cn("mt-2 text-pretty text-sm leading-relaxed", crew ? "text-crew-ivory-dim" : "text-obs-muted")}>
            {card.body}
          </p>
          {card.items?.length ? (
            <div className="mt-3">
              <p
                className={cn(
                  "text-[10px] tracking-[0.16em] uppercase",
                  crew ? "text-crew-accent" : "font-obs-mono text-obs-faint",
                )}
              >
                {card.itemsLabel ?? (crew ? "Contents" : "Inventory")}
              </p>
              <ul className="mt-1">
                {card.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setCard({
                          title: item.name,
                          body: item.body,
                          parent: {
                            title: card.title,
                            body: card.body,
                            items: card.items,
                            itemsLabel: card.itemsLabel,
                            personId: card.personId,
                          },
                        })
                      }
                      className={cn(
                        "flex min-h-11 w-full items-center justify-between gap-3 border-b py-2 text-left text-sm last:border-b-0",
                        crew
                          ? "border-crew-line-soft text-crew-ivory hover:text-crew-accent"
                          : "border-obs-line font-obs-mono text-obs-text hover:text-obs-muted",
                      )}
                    >
                      <span>{item.name}</span>
                      <span className={crew ? "text-crew-muted" : "text-obs-faint"} aria-hidden>
                        ›
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      ) : null}

      <TouchControls />
    </div>
  );
}

function TouchControls() {
  const pdaOpen = useConsole((s) => s.pdaOpen);
  const helpOpen = useConsole((s) => s.helpOpen);
  const intent = useConsole((s) => s.intent);
  const layer = useConsole((s) => s.layer);
  const crew = layer === "crew";
  const act = performInteract;
  const stick = usePointerDrag((nx, ny) => setTouch(nx, ny), () => setTouch(0, 0));
  if (pdaOpen || helpOpen) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between p-3 md:hidden">
      <div
        ref={stick.ref}
        className={cn(
          "pointer-events-auto relative h-28 w-28 rounded-full ring-1",
          crew ? "bg-crew-elevated/70 ring-crew-line" : "bg-obs-surface/80 ring-obs-line",
        )}
        onPointerDown={stick.onDown}
        onPointerMove={stick.onMove}
        onPointerUp={stick.onUp}
        onPointerCancel={stick.onUp}
      >
        <span
          className={cn(
            "absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full",
            crew ? "bg-crew-accent/80" : "bg-obs-alarm/80",
          )}
        />
      </div>
      <button
        type="button"
        onClick={() => act()}
        className={cn(
          "pointer-events-auto min-h-14 min-w-14 rounded-full px-5 text-sm font-medium",
          crew ? "bg-crew-accent text-crew-bg-deep" : "bg-obs-alarm text-obs-text",
        )}
      >
        {intent === "examine" ? (crew ? "Look" : "Inspect") : intent === "use" ? (crew ? "Use" : "Operate") : crew ? "Ask" : "Flag"}
      </button>
    </div>
  );
}