import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { role } from "../engine/roles";
import { malfunction, uid } from "../engine/state";
import type { Game, Player, ToldEntry } from "../engine/types";
import { Button, Chip, cx, RoleIcon } from "./common";

const when = (e: ToldEntry) => (e.night > 0 ? `N${e.night}` : `D${e.day ?? 0}`);

/** Record of what each player has been told, plus Storyteller notes. */
export function InfoScreen({ game, update }: { game: Game; update: (fn: (g: Game) => void) => void }) {
  const told = game.told ?? [];
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-lg px-3 pb-6">
      <p className="mb-3 text-sm text-zinc-400">What each player has been shown, newest last. Night steps are recorded when you tap Done; add anything else by hand.</p>
      <ol className="grid gap-2">
        {game.players.map((p) => (
          <PlayerInfo key={p.id} game={game} p={p} entries={told.filter((e) => e.playerIds.includes(p.id))} update={update} expanded={open === p.id} onToggle={() => setOpen(open === p.id ? null : p.id)} />
        ))}
      </ol>
    </div>
  );
}

function PlayerInfo({ game, p, entries, update, expanded, onToggle }: { game: Game; p: Player; entries: ToldEntry[]; update: (fn: (g: Game) => void) => void; expanded: boolean; onToggle: () => void }) {
  const [text, setText] = useState("");
  const [truthful, setTruthful] = useState(true);
  const mal = malfunction(game, p);
  const falseCount = entries.filter((e) => !e.truthful).length;

  const editEntry = (id: string, fn: (e: ToldEntry) => void) =>
    update((g) => {
      const e = g.told?.find((x) => x.id === id);
      if (e) fn(e);
    });

  const add = () => {
    if (!text.trim()) return;
    update((g) => {
      const e: ToldEntry = { id: uid(), night: g.phase === "night" ? g.night : 0, day: g.day, playerIds: [p.id], role: "generic", text: text.trim(), truthful };
      g.told = [...(g.told ?? []), e];
    });
    setText("");
    setTruthful(true);
  };

  return (
    <li className="rounded-xl border border-zinc-800 bg-zinc-900">
      <button onClick={onToggle} aria-expanded={expanded} className="flex w-full items-center gap-3 p-2.5 text-left">
        <RoleIcon id={p.role} alignment={p.alignment} size={40} className={cx(!p.alive && "opacity-45 grayscale")} />
        <span className="min-w-0 flex-1">
          <span className={cx("block font-semibold", !p.alive && "text-zinc-500 line-through")}>{p.name}</span>
          <span className={cx("block truncate text-sm", p.alignment === "evil" ? "text-rose-300" : "text-sky-300")}>
            {role(p.role).name}
            {p.believes && <span className="text-amber-300"> · thinks {role(p.believes).name}</span>}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-0.5 text-xs">
          <span className="text-zinc-300">{entries.length} told</span>
          {falseCount > 0 && <span className="text-amber-300">{falseCount} false</span>}
        </span>
      </button>

      {!expanded && entries.length > 0 && (
        <p className="truncate px-3 pb-2 text-xs text-zinc-400">
          Last: {when(entries[entries.length - 1])} · {entries[entries.length - 1].text}
        </p>
      )}

      {expanded && (
        <div className="border-t border-zinc-800 p-3">
          {mal.length > 0 && <p className="mb-2 rounded-lg bg-amber-950/60 p-2 text-sm text-amber-100">⚠ {p.name} {mal.join(" and ")}.</p>}
          {entries.length === 0 && <p className="text-sm text-zinc-500">Nothing told yet.</p>}
          <ul className="grid gap-2">
            {entries.map((e) => (
              <li key={e.id} className="rounded-lg bg-zinc-950 p-2">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 w-7 shrink-0 text-xs font-semibold tabular-nums text-zinc-400">{when(e)}</span>
                  {e.role !== "generic" && role(e.role).id !== "unknown" && <RoleIcon id={e.role} size={22} />}
                  <span className="min-w-0 flex-1 text-sm">{e.text}</span>
                  <button aria-label={`Delete: ${e.text}`} onClick={() => update((g) => (g.told = (g.told ?? []).filter((x) => x.id !== e.id)))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 pl-9">
                  <Chip tone={e.truthful ? "good" : "warn"} onClick={() => editEntry(e.id, (x) => (x.truthful = !x.truthful))} ariaLabel={`Marked ${e.truthful ? "true" : "false"}. Tap to switch.`}>
                    {e.truthful ? "True" : "False"}
                  </Chip>
                  {e.malfunctioning && <Chip tone="warn">Drunk/poisoned</Chip>}
                  {e.playerIds.length > 1 && <span className="text-xs text-zinc-500">shown to {e.playerIds.length} players</span>}
                </div>
                <input
                  value={e.note ?? ""}
                  onChange={(ev) => editEntry(e.id, (x) => (x.note = ev.target.value))}
                  placeholder="Note (why, what they claimed…)"
                  aria-label="Note for this info"
                  className="mt-1.5 min-h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-base"
                />
              </li>
            ))}
          </ul>

          <form
            className="mt-3 grid gap-2"
            onSubmit={(ev) => {
              ev.preventDefault();
              add();
            }}
          >
            <input value={text} onChange={(ev) => setText(ev.target.value)} placeholder="Add info you told them" aria-label={`Add info told to ${p.name}`} className="min-h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-base" />
            <div className="grid grid-cols-3 gap-2">
              <button type="button" aria-pressed={truthful} onClick={() => setTruthful(true)} className={cx("min-h-12 rounded-xl border text-sm", truthful ? "border-sky-400 bg-sky-500/20" : "border-zinc-700")}>
                True
              </button>
              <button type="button" aria-pressed={!truthful} onClick={() => setTruthful(false)} className={cx("min-h-12 rounded-xl border text-sm", !truthful ? "border-amber-400 bg-amber-400/20" : "border-zinc-700")}>
                False
              </button>
              <Button type="submit" disabled={!text.trim()}>
                <Plus size={18} /> Add
              </Button>
            </div>
          </form>

          <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-zinc-400" htmlFor={`note-${p.id}`}>
            Notes on {p.name}
          </label>
          <textarea id={`note-${p.id}`} value={p.note ?? ""} onChange={(ev) => update((g) => (g.players.find((q) => q.id === p.id)!.note = ev.target.value))} rows={3} placeholder="Claims, bluffs, anything…" className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-base" />
        </div>
      )}
    </li>
  );
}
