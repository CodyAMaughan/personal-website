import { useState } from "react";
import { CircleDot, List, Plus, UserPlus } from "lucide-react";
import { role, TEAM_LABEL } from "../engine/roles";
import { bluffClashes, changeBelieves, changeRole, marionetteWarnings } from "../engine/setup";
import { addReminder, alive, clone, derivedReminders, kill, log, malfunction, uid } from "../engine/state";
import type { Game, Player, Reminder } from "../engine/types";
import { Button, Chip, cx, RoleIcon, SectionTitle, Sheet } from "./common";
import { RolePicker } from "./RolePicker";

export function reminderText(r: Reminder) {
  if (r.about) return `${r.label}: ${role(r.about).name}`;
  return r.label;
}

function reminderTone(r: Reminder): "evil" | "warn" | "good" | "auto" | "muted" {
  if (/poison|drunk/i.test(r.label)) return "warn";
  if (/dead|died/i.test(r.label)) return "evil";
  if (/safe|has ability/i.test(r.label)) return "good";
  return r.auto ? "auto" : "muted";
}

export function GrimoireScreen({ game, update }: { game: Game; update: (fn: (g: Game) => void) => void }) {
  const [view, setView] = useState<"circle" | "list">("circle");
  const [sel, setSel] = useState<string | null>(null);
  const [bluffSlot, setBluffSlot] = useState<number | null>(null);
  const [addingTraveller, setAddingTraveller] = useState(false);
  const selected = game.players.find((p) => p.id === sel) ?? null;
  const living = alive(game).length;

  const inPlay = new Set(game.players.flatMap((p) => [p.role, p.believes ?? ""]));
  const clashes = bluffClashes(game);
  const bluffOptions = game.scriptRoles.filter((id) => ["townsfolk", "outsider"].includes(role(id).team) && !inPlay.has(id));

  return (
    <div className="mx-auto max-w-lg px-3 pb-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm text-zinc-300">
          <span className="font-semibold text-white">{living}</span> alive · <span className="font-semibold text-white">{Math.ceil(living / 2)}</span> votes to execute
        </div>
        <div className="flex rounded-xl bg-zinc-900 p-1" role="group" aria-label="Grimoire layout">
          <button aria-pressed={view === "circle"} onClick={() => setView("circle")} className={cx("flex h-10 w-12 items-center justify-center rounded-lg", view === "circle" && "bg-zinc-700")} aria-label="Circle view">
            <CircleDot size={20} />
          </button>
          <button aria-pressed={view === "list"} onClick={() => setView("list")} className={cx("flex h-10 w-12 items-center justify-center rounded-lg", view === "list" && "bg-zinc-700")} aria-label="List view">
            <List size={20} />
          </button>
        </div>
      </div>

      {view === "circle" ? <Circle game={game} onSelect={setSel} /> : <PlayerList game={game} onSelect={setSel} />}

      <SectionTitle>Demon bluffs</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => {
          const id = game.bluffs[i];
          const clash = !!id && clashes.includes(id);
          return (
            <button key={i} onClick={() => setBluffSlot(i)} className={cx("flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border p-2 text-sm hover:bg-zinc-800", clash ? "border-rose-600 bg-rose-950/50" : "border-zinc-800 bg-zinc-900")} aria-label={id ? `Bluff ${i + 1}: ${role(id).name}${clash ? ", in play" : ""}. Change.` : `Choose bluff ${i + 1}`}>
              {id ? <RoleIcon id={id} size={44} /> : <Plus />}
              <span>{id ? role(id).name : "Choose"}</span>
              {clash && <span className="text-xs font-semibold text-rose-300">In play!</span>}
            </button>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => setAddingTraveller(true)}>
        <UserPlus size={20} /> Add a traveller
      </Button>

      <RolePicker
        open={bluffSlot !== null}
        title="Choose a bluff"
        roles={bluffOptions}
        onClose={() => setBluffSlot(null)}
        onPick={(id) =>
          update((g) => {
            g.bluffs[bluffSlot!] = id;
          })
        }
      />
      <RolePicker
        open={addingTraveller}
        title="Traveller joining"
        roles={game.scriptRoles.filter((id) => role(id).team === "traveller")}
        allowAll
        onClose={() => setAddingTraveller(false)}
        onPick={(id) =>
          update((g) => {
            const p: Player = { id: uid(), name: `Traveller ${g.players.length + 1}`, role: id, alignment: "good", alive: true, ghostVote: true, reminders: [] };
            g.players.push(p);
            log(g, `${role(id).name} joined.`);
            setTimeout(() => setSel(p.id));
          })
        }
      />
      {selected && <PlayerSheet game={game} p={selected} update={update} onClose={() => setSel(null)} />}
    </div>
  );
}

function statusChips(game: Game, p: Player) {
  const chips = [...p.reminders, ...derivedReminders(game, p)];
  return chips;
}

function Circle({ game, onSelect }: { game: Game; onSelect: (id: string) => void }) {
  const n = game.players.length;
  const size = n > 12 ? 50 : n > 9 ? 56 : 64;
  const R = 41; // % of container
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]" role="list" aria-label="Grimoire seats, clockwise from the top">
      <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border border-zinc-800/70 text-center">
        <span className="text-xs uppercase tracking-widest text-zinc-500">{game.scriptName}</span>
        <span className="text-sm text-zinc-400">Tap a player to edit</span>
      </div>
      {game.players.map((p, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 50 + R * Math.cos(a);
        const y = 50 + R * Math.sin(a);
        const rem = statusChips(game, p);
        const mal = malfunction(game, p).length > 0;
        return (
          <button
            key={p.id}
            role="listitem"
            onClick={() => onSelect(p.id)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            style={{ left: `${x}%`, top: `${y}%`, width: size + 28 }}
            aria-label={`${p.name}, ${role(p.role).name}${p.believes ? `, thinks ${role(p.believes).name}` : ""}, ${p.alignment}, ${p.alive ? "alive" : `dead${p.ghostVote ? ", has ghost vote" : ", no ghost vote"}`}${rem.length ? `. Reminders: ${rem.map(reminderText).join(", ")}` : ""}`}
          >
            <span className="relative">
              <RoleIcon id={p.role} alignment={p.alignment} size={size} className={cx(!p.alive && "opacity-45 grayscale")} />
              {!p.alive && (
                <span className={cx("absolute -right-1 -top-1 rounded-full px-1.5 text-[10px] font-bold", p.ghostVote ? "bg-zinc-200 text-black" : "bg-zinc-700 text-zinc-300")} title={p.ghostVote ? "Ghost vote" : "Vote used"}>
                  {p.ghostVote ? "👻" : "✕"}
                </span>
              )}
              {mal && <span className="absolute -left-1 -top-1 h-4 w-4 rounded-full border-2 border-zinc-950 bg-amber-400" title="Drunk / poisoned" />}
              {rem.length > 0 && <span className="absolute -bottom-1 -right-1 rounded-full bg-violet-600 px-1.5 text-[11px] font-bold text-white">{rem.length}</span>}
            </span>
            <span className={cx("mt-0.5 w-full truncate text-center text-[13px] font-medium leading-tight", !p.alive && "text-zinc-500 line-through")}>{p.name}</span>
            {p.believes && <span className="w-full truncate text-center text-[10px] leading-tight text-amber-300">“{role(p.believes).name}”</span>}
          </button>
        );
      })}
    </div>
  );
}

function PlayerList({ game, onSelect }: { game: Game; onSelect: (id: string) => void }) {
  return (
    <ol className="grid grid-cols-1 gap-1.5" aria-label="Players in seat order">
      {game.players.map((p, i) => {
        const rem = statusChips(game, p);
        return (
          <li key={p.id}>
            <button onClick={() => onSelect(p.id)} className="flex w-full items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-left hover:bg-zinc-800">
              <span className="w-5 pt-2 text-right text-sm tabular-nums text-zinc-500">{i + 1}</span>
              <RoleIcon id={p.role} alignment={p.alignment} size={44} className={cx(!p.alive && "opacity-45 grayscale")} />
              <span className="min-w-0 flex-1">
                <span className={cx("block font-semibold", !p.alive && "text-zinc-500 line-through")}>{p.name}</span>
                <span className={cx("block text-sm", p.alignment === "evil" ? "text-rose-300" : "text-sky-300")}>
                  {role(p.role).name}
                  {p.believes && <span className="text-amber-300"> · thinks {role(p.believes).name}</span>}
                </span>
                {(rem.length > 0 || !p.alive) && (
                  <span className="mt-1 flex flex-wrap gap-1">
                    {!p.alive && <Chip tone={p.ghostVote ? "muted" : "evil"}>{p.ghostVote ? "Dead · ghost vote" : "Dead · vote used"}</Chip>}
                    {rem.map((r) => (
                      <Chip key={r.id} tone={reminderTone(r)}>
                        {reminderText(r)}
                      </Chip>
                    ))}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

const GENERIC = ["Drunk", "Poisoned", "Safe", "Mad", "No Ability", "Dead", "Is The Demon"];

function PlayerSheet({ game, p, update, onClose }: { game: Game; p: Player; update: (fn: (g: Game) => void) => void; onClose: () => void }) {
  const [picking, setPicking] = useState<null | "role" | "believes">(null);
  const [custom, setCustom] = useState("");
  const [changeNotes, setChangeNotes] = useState<string[]>([]);
  const idx = game.players.findIndex((q) => q.id === p.id);
  const mut = (fn: (q: Player, g: Game) => void) =>
    update((g) => {
      const q = g.players.find((x) => x.id === p.id)!;
      fn(q, g);
    });
  const r = role(p.role);
  const mal = malfunction(game, p);
  const derived = derivedReminders(game, p);

  // Reminder suggestions: tokens of characters in play.
  const inPlay = [...new Set(game.players.flatMap((q) => [q.role, q.believes ?? ""]).filter(Boolean))];
  const suggestions: { role: string; label: string }[] = [];
  for (const id of inPlay) for (const label of new Set(role(id).reminders ?? [])) suggestions.push({ role: id, label });

  const move = (d: -1 | 1) =>
    update((g) => {
      const i = g.players.findIndex((x) => x.id === p.id);
      const j = (i + d + g.players.length) % g.players.length;
      [g.players[i], g.players[j]] = [g.players[j], g.players[i]];
    });

  return (
    <Sheet open title={p.name} onClose={onClose}>
      <div className="flex items-center gap-3">
        <button onClick={() => setPicking("role")} aria-label="Change character" className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300">
          <RoleIcon id={p.role} alignment={p.alignment} size={72} />
        </button>
        <div className="min-w-0 flex-1">
          <input
            value={p.name}
            onChange={(e) => mut((q) => (q.name = e.target.value))}
            aria-label="Player name"
            className="w-full rounded-lg border border-transparent bg-transparent px-1 text-xl font-semibold hover:border-zinc-700 focus:border-zinc-600"
          />
          <p className={cx("px-1 text-sm", p.alignment === "evil" ? "text-rose-300" : "text-sky-300")}>
            {r.name} · {TEAM_LABEL[r.team]} · {p.alignment === "evil" ? "Evil" : "Good"}
          </p>
        </div>
      </div>
      <p className="mt-2 text-sm text-zinc-300">{r.ability}</p>
      {mal.length > 0 && (
        <p className="mt-2 rounded-lg bg-amber-950/60 p-2 text-sm text-amber-100">
          ⚠ {p.name} {mal.join(" and ")}.
        </p>
      )}
      {[...changeNotes, ...(p.role === "marionette" ? marionetteWarnings(game) : [])].length > 0 && (
        <ul role="status" className="mt-2 space-y-0.5 rounded-lg border border-violet-700 bg-violet-950/60 p-2 text-sm text-violet-100">
          {[...new Set([...changeNotes, ...(p.role === "marionette" ? marionetteWarnings(game) : [])])].map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button onClick={() => setPicking("role")}>Change character</Button>
        <Button
          onClick={() => mut((q) => (q.alignment = q.alignment === "good" ? "evil" : "good"))}
          className={p.alignment === "evil" ? "border-rose-800 text-rose-200" : "border-sky-800 text-sky-200"}
        >
          Make {p.alignment === "good" ? "evil" : "good"}
        </Button>
        {(p.role === "drunk" || p.role === "marionette" || p.role === "lunatic" || p.believes) && (
          <Button className="col-span-2" onClick={() => setPicking("believes")}>
            Thinks they are: {p.believes ? role(p.believes).name : "—"}
          </Button>
        )}
        {p.alive ? (
          <Button
            variant="danger"
            onClick={() =>
              mut((q, g) => {
                kill(g, q.id, "storyteller", "Storyteller");
              })
            }
          >
            Kill
          </Button>
        ) : (
          <Button
            variant="good"
            onClick={() =>
              mut((q, g) => {
                q.alive = true;
                q.ghostVote = true;
                delete q.death;
                g.winner = null;
                log(g, `${q.name} revived.`);
              })
            }
          >
            Revive
          </Button>
        )}
        <Button disabled={p.alive} onClick={() => mut((q) => (q.ghostVote = !q.ghostVote))}>
          {p.ghostVote ? "Use ghost vote" : "Restore ghost vote"}
        </Button>
        <Button onClick={() => move(-1)} ariaLabel="Move one seat anticlockwise">
          ◀ Seat {idx + 1}
        </Button>
        <Button onClick={() => move(1)} ariaLabel="Move one seat clockwise">
          Seat {idx + 1} ▶
        </Button>
      </div>

      <SectionTitle>Reminder tokens</SectionTitle>
      <div className="flex flex-wrap gap-1.5">
        {p.reminders.length === 0 && derived.length === 0 && <span className="text-sm text-zinc-500">None</span>}
        {p.reminders.map((rm) => (
          <Chip key={rm.id} tone={reminderTone(rm)} onClick={() => mut((q) => (q.reminders = q.reminders.filter((x) => x.id !== rm.id)))} ariaLabel={`Remove reminder ${reminderText(rm)}`}>
            {role(rm.role).id !== "unknown" && rm.role !== "generic" && <RoleIcon id={rm.role} size={18} />}
            {reminderText(rm)} <span aria-hidden>✕</span>
          </Chip>
        ))}
        {derived.map((rm) => (
          <Chip key={rm.id} tone="auto">
            {reminderText(rm)} (auto)
          </Chip>
        ))}
      </div>
      <p className="mt-1 text-xs text-zinc-500">Tap a token to remove it. Auto tokens update themselves.</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {suggestions.map((s) => (
          <Chip key={`${s.role}-${s.label}`} onClick={() => mut((q) => addReminder(q, s.role, s.label, "never", game.night, false))} ariaLabel={`Add ${role(s.role).name} reminder ${s.label}`}>
            <RoleIcon id={s.role} size={18} /> + {s.label}
          </Chip>
        ))}
        {GENERIC.map((label) => (
          <Chip key={label} onClick={() => mut((q) => addReminder(q, "generic", label, "never", game.night, false))} ariaLabel={`Add reminder ${label}`}>
            + {label}
          </Chip>
        ))}
      </div>
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!custom.trim()) return;
          mut((q) => addReminder(q, "generic", custom.trim(), "never", game.night, false));
          setCustom("");
        }}
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Custom reminder" aria-label="Custom reminder" className="min-h-12 min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-base" />
        <Button type="submit">Add</Button>
      </form>

      <SectionTitle>Notes</SectionTitle>
      <textarea value={p.note ?? ""} onChange={(e) => mut((q) => (q.note = e.target.value))} rows={2} aria-label="Notes" placeholder="Claims, bluffs, anything…" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-base" />

      {r.team === "traveller" && (
        <Button
          variant="ghost"
          className="mt-3 w-full text-rose-300"
          onClick={() => {
            update((g) => {
              g.players = g.players.filter((x) => x.id !== p.id);
            });
            onClose();
          }}
        >
          Remove traveller from the game
        </Button>
      )}

      <RolePicker
        open={picking !== null}
        title={picking === "believes" ? "They think they are…" : "Change character"}
        roles={game.scriptRoles}
        allowAll
        onClose={() => setPicking(null)}
        onPick={(id) => {
          // Worked out on a copy so the notes can be shown without setting state inside an updater.
          const next = clone(game);
          const notes = picking === "believes" ? changeBelieves(next, p.id, id) : changeRole(next, p.id, id);
          log(next, picking === "believes" ? `${p.name} now thinks they are the ${role(id).name}.` : `${p.name} is now the ${role(id).name}.`);
          update((g) => Object.assign(g, next));
          setChangeNotes(notes);
        }}
      />
    </Sheet>
  );
}
