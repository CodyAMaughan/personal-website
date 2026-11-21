import { useState } from "react";
import { Gavel, Moon, Swords, Vote } from "lucide-react";
import { role } from "../engine/roles";
import { alive, clone, endDay, execute, hasReminder, name, nominate, slay } from "../engine/state";
import type { Game } from "../engine/types";
import { Button, Chip, cx, PlayerButton, SectionTitle, Sheet } from "./common";

function voteValue(g: Game, id: string) {
  const p = g.players.find((q) => q.id === id);
  if (!p) return 0;
  if (hasReminder(p, "3 Votes")) return 3;
  if (hasReminder(p, "Negative Vote")) return -1;
  return 1;
}

export function tally(g: Game, voters: string[]) {
  return voters.reduce((s, id) => s + voteValue(g, id), 0);
}

export function DayScreen({ game, commit }: { game: Game; commit: (g: Game) => void }) {
  const [nominating, setNominating] = useState<null | { nominator?: string }>(null);
  const [voting, setVoting] = useState<number | null>(null);
  const [slaying, setSlaying] = useState<null | { slayer?: string }>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [confirmExec, setConfirmExec] = useState<string | null>(null);

  // Living Travellers count towards the votes needed (they're left out only of the "2 alive" and Scarlet Woman counts).
  const living = alive(game).length;
  const threshold = Math.ceil(living / 2);
  const results = game.nominations.map((n) => ({ ...n, votes: tally(game, n.voters) }));
  const top = Math.max(0, ...results.map((r) => r.votes));
  const leaders = results.filter((r) => r.votes === top && top >= threshold);
  const onBlock = leaders.length === 1 ? leaders[0].nominee : null;
  const nominatedToday = new Set(game.nominations.map((n) => n.nominee));
  const nominatorsToday = new Set(game.nominations.map((n) => n.nominator));

  const act = (fn: (g: Game) => string[]) => {
    const g = clone(game);
    setNotes(fn(g));
    commit(g);
  };

  return (
    <div className="mx-auto max-w-lg px-3 pb-6">
      {game.diedTonight.length > 0 && (
        <p className="mb-3 rounded-xl bg-zinc-900 p-3 text-zinc-200">
          Died last night: <span className="font-semibold text-rose-300">{game.diedTonight.map((id) => name(game, id)).join(", ")}</span>
        </p>
      )}
      {game.pending.includes("boomdandy") && (
        <div className="mb-3 rounded-xl border border-rose-700 bg-rose-950/60 p-3 text-rose-100">
          <p className="font-semibold">Boomdandy!</p>
          <p className="text-sm">All but 3 players die. Kill players on the Grimoire tab until 3 remain, then count down from 10 — the player with the most fingers pointing at them dies.</p>
          <Button className="mt-2" onClick={() => act((g) => ((g.pending = g.pending.filter((x) => x !== "boomdandy")), []))}>
            Resolved
          </Button>
        </div>
      )}
      {notes.length > 0 && (
        <div role="status" className="mb-3 rounded-xl border border-violet-700 bg-violet-950/60 p-3 text-sm text-violet-100">
          {notes.map((n) => (
            <p key={n}>• {n}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="Alive" value={living} />
        <Stat label="Votes needed" value={threshold} />
        <Stat label="Ghost votes" value={game.players.filter((p) => !p.alive && p.ghostVote).length} />
      </div>

      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3" aria-live="polite">
        <p className="text-sm text-zinc-400">On the block</p>
        {onBlock ? (
          <p className="text-2xl font-bold">
            {name(game, onBlock)} <span className="text-base font-normal text-zinc-400">({top} votes)</span>
          </p>
        ) : (
          <p className="text-lg text-zinc-300">{leaders.length > 1 ? `Tied at ${top} — nobody` : "Nobody yet"}</p>
        )}
        {game.executedToday && <p className="mt-1 text-rose-300">Executed today: {name(game, game.executedToday)}</p>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="primary" onClick={() => setNominating({})} disabled={!!game.executedToday}>
          <Vote size={20} /> Nomination
        </Button>
        <Button variant="danger" onClick={() => setConfirmExec(onBlock ?? "")} disabled={!!game.executedToday}>
          <Gavel size={20} /> Execute
        </Button>
        <Button onClick={() => setSlaying({})}>
          <Swords size={20} /> Slayer shot
        </Button>
        <Button
          variant="good"
          onClick={() => act(endDay)}
        >
          <Moon size={20} /> Night {game.night + 1}
        </Button>
      </div>

      {results.length > 0 && (
        <>
          <SectionTitle>Today’s nominations</SectionTitle>
          <ul className="grid grid-cols-1 gap-1.5">
            {results.map((r, i) => (
              <li key={i}>
                <button onClick={() => setVoting(i)} className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 text-left hover:bg-zinc-800">
                  <span>
                    <span className="font-medium">{name(game, r.nominator)}</span> <span className="text-zinc-400">→</span> <span className="font-semibold">{name(game, r.nominee)}</span>
                  </span>
                  <span className={cx("rounded-full px-3 py-1 text-lg font-bold tabular-nums", r.votes >= threshold ? "bg-rose-700" : "bg-zinc-800")}>{r.votes}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Nomination flow */}
      <Sheet open={!!nominating} onClose={() => setNominating(null)} title={nominating?.nominator ? `${name(game, nominating.nominator)} nominates…` : "Who is nominating?"}>
        <div className="grid grid-cols-2 gap-1.5">
          {(nominating?.nominator ? game.players : alive(game)).map((p) => (
            <PlayerButton
              key={p.id}
              p={p}
              disabled={nominating?.nominator ? nominatedToday.has(p.id) : nominatorsToday.has(p.id)}
              sub={nominating?.nominator ? (nominatedToday.has(p.id) ? "Already nominated" : role(p.role).name) : nominatorsToday.has(p.id) ? "Already nominated today" : role(p.role).name}
              onClick={() => {
                if (!nominating?.nominator) setNominating({ nominator: p.id });
                else {
                  const g = clone(game);
                  const out = nominate(g, nominating.nominator, p.id);
                  setNotes(out);
                  commit(g);
                  setNominating(null);
                  if (!g.executedToday) setVoting(g.nominations.length - 1);
                }
              }}
            />
          ))}
        </div>
      </Sheet>

      {/* Voting */}
      {voting !== null && game.nominations[voting] && (
        <Sheet
          open
          onClose={() => setVoting(null)}
          title={`Votes on ${name(game, game.nominations[voting].nominee)}`}
          footer={
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg">
                <span className="text-3xl font-black tabular-nums">{tally(game, game.nominations[voting].voters)}</span> / {threshold} needed
              </span>
              <Button variant="primary" onClick={() => setVoting(null)}>
                Done
              </Button>
            </div>
          }
        >
          <p className="mb-2 text-sm text-zinc-400">Tap each player whose hand is up. Dead voters spend their ghost vote.</p>
          <div className="grid grid-cols-2 gap-1.5">
            {game.players.map((p) => {
              const nm = game.nominations[voting];
              const on = nm.voters.includes(p.id);
              const can = p.alive || p.ghostVote || on;
              const v = voteValue(game, p.id);
              return (
                <PlayerButton
                  key={p.id}
                  p={p}
                  selected={on}
                  disabled={!can}
                  sub={!p.alive ? (on ? "Ghost vote spent" : p.ghostVote ? "Dead · has ghost vote" : "Dead · no vote") : v === 3 ? "Counts ×3 (Bureaucrat)" : v === -1 ? "Counts −1 (Thief)" : p.role === "butler" ? "Butler: only with master" : "Alive"}
                  onClick={() => {
                    const g = clone(game);
                    const n = g.nominations[voting];
                    const q = g.players.find((x) => x.id === p.id)!;
                    if (n.voters.includes(p.id)) {
                      n.voters = n.voters.filter((x) => x !== p.id);
                      if (!q.alive) q.ghostVote = true;
                    } else {
                      n.voters.push(p.id);
                      if (!q.alive) q.ghostVote = false;
                    }
                    commit(g);
                  }}
                />
              );
            })}
          </div>
        </Sheet>
      )}

      {/* Execution */}
      <Sheet open={confirmExec !== null} onClose={() => setConfirmExec(null)} title="Execute">
        <p className="mb-2 text-sm text-zinc-400">{onBlock ? `${name(game, onBlock)} is on the block.` : "Nobody is on the block — choose anyone to execute (Storyteller call)."}</p>
        <div className="grid grid-cols-2 gap-1.5">
          {game.players.map((p) => (
            <PlayerButton
              key={p.id}
              p={p}
              selected={p.id === confirmExec}
              onClick={() => setConfirmExec(p.id)}
              sub={`${role(p.role).name}${p.alive ? "" : " · dead"}`}
            />
          ))}
        </div>
        <Button
          variant="danger"
          className="mt-3 w-full"
          disabled={!confirmExec}
          onClick={() => {
            act((g) => execute(g, confirmExec!));
            setConfirmExec(null);
          }}
        >
          Execute {confirmExec ? name(game, confirmExec) : ""}
        </Button>
      </Sheet>

      {/* Slayer */}
      <SlayerSheet game={game} state={slaying} setState={setSlaying} onShot={(s, t, recluse) => act((g) => slay(g, s, t, recluse))} />

      {game.log.length > 0 && (
        <>
          <SectionTitle>Game log</SectionTitle>
          <ol className="max-h-64 space-y-1 overflow-y-auto rounded-xl bg-zinc-950 p-3 text-sm text-zinc-300">
            {[...game.log].reverse().map((l, i) => (
              <li key={i}>
                <Chip>{l.phase}</Chip> {l.text}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-zinc-900 p-2">
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-zinc-400">{label}</div>
    </div>
  );
}

function SlayerSheet({ game, state, setState, onShot }: { game: Game; state: null | { slayer?: string }; setState: (s: null | { slayer?: string }) => void; onShot: (s: string, t: string, recluse: boolean) => void }) {
  const [recluse, setRecluse] = useState(false);
  const target = state?.slayer;
  return (
    <Sheet open={!!state} onClose={() => setState(null)} title={target ? `${name(game, target)} shoots…` : "Who claims Slayer?"}>
      {target && game.players.some((p) => p.role === "recluse") && (
        <label className="mb-2 flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={recluse} onChange={(e) => setRecluse(e.target.checked)} className="h-5 w-5" /> The Recluse registers as the Demon
        </label>
      )}
      <div className="grid grid-cols-2 gap-1.5">
        {(target ? game.players : alive(game)).map((p) => (
          <PlayerButton
            key={p.id}
            p={p}
            disabled={target === p.id}
            onClick={() => {
              if (!target) setState({ slayer: p.id });
              else {
                onShot(target, p.id, recluse);
                setState(null);
              }
            }}
          />
        ))}
      </div>
    </Sheet>
  );
}
