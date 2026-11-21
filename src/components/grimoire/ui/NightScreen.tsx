import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, ChevronRight, Eye, SkipForward } from "lucide-react";
import { buildQueue, completeStep, viewStep, type Step, type StepView } from "../engine/night";
import { role } from "../engine/roles";
import { malfunction, player } from "../engine/state";
import type { Game } from "../engine/types";
import { Button, Chip, cx, PlayerButton, RoleIcon, SectionTitle } from "./common";
import { ShowCard } from "./ShowCard";

export function NightScreen({ game, commit, update, openGrimoire }: { game: Game; commit: (g: Game) => void; update: (fn: (g: Game) => void) => void; openGrimoire: () => void }) {
  const queue = useMemo(() => buildQueue(game), [game]);
  const views = useMemo(() => queue.map((s) => viewStep(game, s)), [queue, game]);
  const firstOpen = queue.findIndex((s, i) => !game.done.includes(s.key) && !views[i].skip);
  const [current, setCurrent] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [showSkipped, setShowSkipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const curIdx = current ? queue.findIndex((s) => s.key === current) : firstOpen;
  const step = queue[curIdx];
  const view = views[curIdx];

  useEffect(() => {
    // When the queue changes underneath us (e.g. undo), fall back to the first open step.
    if (current && !queue.some((s) => s.key === current)) setCurrent(null);
  }, [queue, current]);

  const finish = (s: Step, skipped = false) => {
    const r = completeStep(game, s, { skipped });
    commit(r.game);
    setNotes(r.notes);
    setCurrent(null);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const doneCount = queue.filter((s, i) => game.done.includes(s.key) || views[i].skip).length;

  return (
    <div className="mx-auto max-w-lg px-3 pb-6">
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <span>
            Step {Math.min(doneCount + 1, queue.length)} of {queue.length}
          </span>
          <label className="flex min-h-10 items-center gap-2">
            <input type="checkbox" checked={showSkipped} onChange={(e) => setShowSkipped(e.target.checked)} className="h-5 w-5" /> Show skipped
          </label>
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-800" role="progressbar" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={doneCount}>
          <div className="h-full bg-amber-400 transition-all" style={{ width: `${(doneCount / Math.max(1, queue.length)) * 100}%` }} />
        </div>
      </div>

      {notes.length > 0 && (
        <div role="status" className="mb-3 rounded-xl border border-violet-700 bg-violet-950/60 p-3 text-sm text-violet-100">
          {notes.map((n) => (
            <p key={n}>• {n}</p>
          ))}
          <button className="mt-1 text-xs text-violet-300 underline" onClick={() => setNotes([])}>
            Dismiss
          </button>
        </div>
      )}

      <div ref={cardRef} />
      {step && view && !game.done.includes(step.key) && <StepCard key={step.key} game={game} step={step} view={view} update={update} onDone={() => finish(step)} onSkip={() => finish(step, true)} openGrimoire={openGrimoire} />}

      <SectionTitle>Tonight’s order</SectionTitle>
      <ol className="grid gap-1">
        {queue.map((s, i) => {
          const v = views[i];
          const done = game.done.includes(s.key);
          if (v.skip && !showSkipped && i !== curIdx) return null;
          const p = player(game, s.playerId);
          return (
            <li key={s.key}>
              <button
                onClick={() => {
                  setCurrent(s.key);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                aria-current={i === curIdx ? "step" : undefined}
                className={cx(
                  "flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left",
                  i === curIdx ? "bg-amber-400/15 ring-1 ring-amber-400" : "hover:bg-zinc-900",
                  (done || v.skip) && "opacity-50",
                )}
              >
                {s.roleId ? <RoleIcon id={s.roleId} alignment={p?.alignment} size={32} /> : <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs">{s.kind === "dusk" ? "🌙" : s.kind === "dawn" ? "☀️" : "👁"}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    {v.title}
                    {p && <span className="font-normal text-zinc-400"> · {p.name}</span>}
                  </span>
                  {v.skip && <span className="block truncate text-xs text-zinc-500">{v.skip}</span>}
                </span>
                {done ? <Check size={18} className="text-emerald-400" aria-label="Done" /> : v.skip ? <span className="text-xs text-zinc-500">skip</span> : <ChevronRight size={18} className="text-zinc-500" />}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StepCard({ game, step, view, update, onDone, onSkip, openGrimoire }: { game: Game; step: Step; view: StepView; update: (fn: (g: Game) => void) => void; onDone: () => void; onSkip: () => void; openGrimoire: () => void }) {
  const [showing, setShowing] = useState(false);
  const p = player(game, step.playerId);
  const choice = game.choices[step.key] ?? { targets: [] };
  const mal = p && step.kind === "role" ? malfunction(game, p) : [];

  const setChoice = (fn: (c: { targets: string[]; option?: string; roles?: string[] }) => void) =>
    update((g) => {
      const c = g.choices[step.key] ?? { targets: [] };
      fn(c);
      g.choices[step.key] = c;
    });

  const togglePlayer = (id: string) =>
    setChoice((c) => {
      const max = view.pick!.count;
      if (c.targets.includes(id)) c.targets = c.targets.filter((x) => x !== id);
      else c.targets = max === 1 ? [id] : [...c.targets, id].slice(-max);
    });

  const needs = view.pick && !view.pick.optional && !view.skip ? view.pick.count - choice.targets.length : 0;

  return (
    <article className="mb-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 shadow-lg" aria-label={`Current step: ${view.title}`}>
      <header className="flex items-center gap-3">
        {step.roleId ? <RoleIcon id={step.roleId} alignment={p?.alignment} size={56} /> : <span className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-2xl">{step.kind === "dusk" ? "🌙" : step.kind === "dawn" ? "☀️" : "👁"}</span>}
        <div className="min-w-0">
          <h2 className="text-xl font-bold leading-tight">{view.title}</h2>
          {p && (
            <p className="text-zinc-300">
              Wake <span className="font-semibold text-white">{p.name}</span>
              {p.role !== step.roleId && step.roleId !== "marionette" && <span className="text-amber-300"> (really the {role(p.role).name})</span>}
            </p>
          )}
        </div>
      </header>

      {mal.length > 0 && !view.skip && (
        <div className="mt-2 flex flex-wrap gap-1">
          {mal.map((m) => (
            <Chip key={m} tone="warn">
              {m}
            </Chip>
          ))}
        </div>
      )}

      {view.skip && <p className="mt-3 rounded-lg bg-zinc-800 p-3 text-zinc-300">Skip: {view.skip}</p>}
      {view.official && <p className="mt-3 text-sm italic text-zinc-400">{view.official}</p>}
      {view.instructions.map((t) => (
        <p key={t} className="mt-2 text-zinc-200">
          {t}
        </p>
      ))}

      {view.pick && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-semibold text-zinc-300">
            {view.pick.label}
            {view.pick.count > 1 && ` (${choice.targets.length}/${view.pick.count})`}
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {game.players.map((q) => {
              const self = q.id === p?.id;
              const blocked = (self && !view.pick!.allowSelf) || (view.pick!.filter && !view.pick!.filter(q));
              return <PlayerButton key={q.id} p={q} selected={choice.targets.includes(q.id)} disabled={!!blocked} onClick={() => togglePlayer(q.id)} sub={`${role(q.role).name}${q.alive ? "" : " · dead"}`} />;
            })}
          </div>
        </div>
      )}

      {view.rolePick && view.rolePick.from.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-sm font-semibold text-zinc-300">{view.rolePick.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {view.rolePick.from.map((id) => (
              <button key={id} onClick={() => setChoice((c) => (c.roles = [id]))} aria-pressed={choice.roles?.[0] === id} className={cx("flex min-h-11 items-center gap-2 rounded-full border px-2 pr-3", choice.roles?.[0] === id ? "border-amber-400 bg-amber-400/15" : "border-zinc-700")}>
                <RoleIcon id={id} size={28} /> {role(id).name}
              </button>
            ))}
          </div>
        </div>
      )}

      {view.lines.length > 0 && (
        <dl className="mt-3 grid gap-1.5 rounded-xl bg-zinc-950 p-3">
          {view.lines.map((l) => (
            <div key={l.label} className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-zinc-400">{l.label}</dt>
              <dd className={cx("text-right font-semibold", l.tone === "good" && "text-sky-300", l.tone === "evil" && "text-rose-300", l.tone === "warn" && "text-amber-300", l.tone === "muted" && "text-zinc-400")}>{l.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {view.caveats.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-amber-200">
          {view.caveats.map((c) => (
            <li key={c}>⚠ {c}</li>
          ))}
        </ul>
      )}

      {view.options && view.options.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {view.options.map((o) => (
            <Chip key={o.id} tone={choice.option === o.id ? "warn" : "muted"} onClick={() => setChoice((c) => (c.option = c.option === o.id ? undefined : o.id))}>
              {o.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {view.show && !view.skip && (
          <Button variant="good" className="col-span-2" onClick={() => setShowing(true)}>
            <Eye size={20} /> Show to player
          </Button>
        )}
        {view.grimoire && (
          <Button className="col-span-2" onClick={openGrimoire}>
            <BookOpen size={20} /> Open the Grimoire for them
          </Button>
        )}
        {!view.skip && step.kind !== "dawn" && (
          <Button variant="ghost" onClick={onSkip}>
            <SkipForward size={18} /> Skip
          </Button>
        )}
        <Button variant="primary" className={cx((view.skip || step.kind === "dawn") && "col-span-2")} onClick={onDone} disabled={needs > 0}>
          <Check size={20} /> {step.kind === "dawn" ? "Start the day" : view.skip ? "Next" : needs > 0 ? `Choose ${needs} more` : "Done"}
        </Button>
      </div>

      {showing && view.show && <ShowCard card={view.show} game={game} onClose={() => setShowing(false)} />}
    </article>
  );
}
