import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Dices, Eye, EyeOff, Minus, Plus, Trash2 } from "lucide-react";
import { role, TEAM_LABEL } from "../engine/roles";
import { BUILT_IN_SCRIPTS, parseScript, type Script } from "../engine/scripts";
import { byTeam, changeBelieves, distribution, outsiderModifier, randomBag, seatPlayers, validateBag } from "../engine/setup";
import { clone, log, startNight } from "../engine/state";
import type { Game, Team } from "../engine/types";
import { Button, Chip, cx, RoleIcon, SectionTitle } from "./common";
import { RolePicker } from "./RolePicker";

const NAMES_KEY = "grimoire:names";
const CUSTOM_KEY = "grimoire:custom-scripts";

function loadNames(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(NAMES_KEY) ?? "[]");
    if (Array.isArray(v) && v.length) return v;
  } catch {
    /* ignore */
  }
  return Array.from({ length: 8 }, () => "");
}

function loadCustom(): Script[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]");
  } catch {
    return [];
  }
}

type Stage = "script" | "players" | "bag" | "reveal";

export function SetupScreen({ game, commit }: { game: Game; commit: (g: Game) => void }) {
  const [stage, setStage] = useState<Stage>(game.players.length ? "reveal" : game.scriptRoles.length ? "players" : "script");
  const [custom, setCustom] = useState<Script[]>(loadCustom);
  const [paste, setPaste] = useState("");
  const [pasteMsg, setPasteMsg] = useState<string | null>(null);
  const [names, setNames] = useState<string[]>(() => (game.players.length ? game.players.map((p) => p.name) : loadNames()));
  const [bag, setBag] = useState<string[]>(() => game.players.map((p) => p.role));
  const [bagNotes, setBagNotes] = useState<string[]>([]);

  const n = names.length;
  const scripts = [...BUILT_IN_SCRIPTS, ...custom];

  const chooseScript = (s: Script) => {
    const g = clone(game);
    g.scriptName = s.name;
    g.scriptRoles = s.roles;
    g.players = [];
    commit(g);
    setBag([]);
    setStage("players");
  };

  const addCustom = () => {
    try {
      const { script, unknown } = parseScript(paste);
      const next = [script, ...custom.filter((c) => c.name !== script.name)];
      setCustom(next);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      setPaste("");
      setPasteMsg(unknown.length ? `Loaded “${script.name}”. Skipped unknown: ${unknown.join(", ")}` : `Loaded “${script.name}” (${script.roles.length} characters).`);
    } catch (e) {
      setPasteMsg((e as Error).message);
    }
  };

  const savePlayers = () => {
    localStorage.setItem(NAMES_KEY, JSON.stringify(names));
    if (bag.length !== n) roll();
    setStage("bag");
  };

  const roll = () => {
    try {
      const r = randomBag(game.scriptRoles, n);
      setBag(r.bag);
      setBagNotes(r.notes);
    } catch (e) {
      setBagNotes([(e as Error).message]);
    }
  };

  const toggle = (id: string) => setBag((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  const warnings = useMemo(() => validateBag(bag, n), [bag, n]);

  const deal = () => {
    const g = seatPlayers(game, names, bag, true);
    commit(g);
    setStage("reveal");
  };

  const setBelieves = (playerId: string, id: string): string[] => {
    const g = clone(game);
    const notes = changeBelieves(g, playerId, id);
    const p = g.players.find((q) => q.id === playerId)!;
    log(g, `${p.name} now thinks they are the ${role(id).name}.`);
    commit(g);
    return notes;
  };

  const begin = () => {
    const g = clone(game);
    startNight(g);
    log(g, `Game started: ${g.scriptName}, ${g.players.length} players.`);
    commit(g);
  };

  const steps: { id: Stage; label: string }[] = [
    { id: "script", label: "Script" },
    { id: "players", label: "Players" },
    { id: "bag", label: "Characters" },
    { id: "reveal", label: "Deal" },
  ];

  return (
    <div className="mx-auto max-w-lg px-4 pb-8">
      <ol className="mb-4 flex gap-1" aria-label="Setup steps">
        {steps.map((s, i) => (
          <li key={s.id} className="flex-1">
            <button
              onClick={() => (s.id === "script" || game.scriptRoles.length) && setStage(s.id)}
              aria-current={stage === s.id ? "step" : undefined}
              className={cx("w-full rounded-lg py-2 text-sm", stage === s.id ? "bg-amber-400 font-semibold text-black" : "bg-zinc-900 text-zinc-300")}
            >
              {i + 1}. {s.label}
            </button>
          </li>
        ))}
      </ol>

      {stage === "script" && (
        <section aria-label="Choose a script">
          <SectionTitle>Choose a script</SectionTitle>
          <div className="grid gap-2">
            {scripts.map((s) => (
              <button
                key={s.id}
                onClick={() => chooseScript(s)}
                className={cx("flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left hover:bg-zinc-800", game.scriptName === s.name ? "border-amber-400 bg-amber-400/10" : "border-zinc-800 bg-zinc-900")}
              >
                <RoleIcon id={s.roles.find((r) => role(r).team === "demon")} size={44} />
                <span>
                  <span className="block font-semibold">{s.name}</span>
                  <span className="block text-sm text-zinc-400">
                    {s.author ? `${s.author} · ` : ""}
                    {s.roles.length} characters
                  </span>
                </span>
              </button>
            ))}
          </div>
          <SectionTitle>Custom script</SectionTitle>
          <label className="block text-sm text-zinc-300" htmlFor="paste">
            Paste JSON from the official Script Tool
          </label>
          <textarea
            id="paste"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={4}
            placeholder='[{"id":"_meta","name":"My Script"},"washerwoman","chef",...]'
            className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 font-mono text-base"
          />
          <Button onClick={addCustom} disabled={!paste.trim()} className="mt-2 w-full">
            Load script
          </Button>
          {pasteMsg && (
            <p role="status" className="mt-2 text-sm text-zinc-300">
              {pasteMsg}
            </p>
          )}
        </section>
      )}

      {stage === "players" && (
        <section aria-label="Players">
          <div className="flex items-center justify-between">
            <SectionTitle>Players in seat order (clockwise)</SectionTitle>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-xl bg-zinc-900 p-2">
            <Button variant="ghost" ariaLabel="Remove a player" onClick={() => setNames((xs) => (xs.length > 5 ? xs.slice(0, -1) : xs))}>
              <Minus />
            </Button>
            <div className="text-center" aria-live="polite">
              <div className="text-3xl font-bold tabular-nums">{n}</div>
              <div className="text-xs text-zinc-400">
                {(() => {
                  const d = distribution(n);
                  return `${d.townsfolk} TF · ${d.outsider} Out · ${d.minion} Min · ${d.demon} Dem`;
                })()}
              </div>
            </div>
            <Button variant="ghost" ariaLabel="Add a player" onClick={() => setNames((xs) => (xs.length < 15 ? [...xs, ""] : xs))}>
              <Plus />
            </Button>
          </div>
          <ol className="grid grid-cols-1 gap-2">
            {names.map((nm, i) => (
              <li key={i} className="flex items-center gap-1">
                <span className="w-7 text-right text-sm tabular-nums text-zinc-500">{i + 1}</span>
                <input
                  value={nm}
                  onChange={(e) => setNames((xs) => xs.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder={`Player ${i + 1}`}
                  aria-label={`Seat ${i + 1} name`}
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-base"
                  enterKeyHint="next"
                  autoComplete="off"
                />
                <button aria-label={`Move ${nm || `seat ${i + 1}`} up`} disabled={i === 0} onClick={() => setNames((xs) => swap(xs, i, i - 1))} className="flex h-12 w-10 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-20">
                  <ArrowUp size={18} />
                </button>
                <button aria-label={`Move ${nm || `seat ${i + 1}`} down`} disabled={i === n - 1} onClick={() => setNames((xs) => swap(xs, i, i + 1))} className="flex h-12 w-10 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-20">
                  <ArrowDown size={18} />
                </button>
                <button aria-label={`Remove ${nm || `seat ${i + 1}`}`} disabled={n <= 5} onClick={() => setNames((xs) => xs.filter((_, j) => j !== i))} className="flex h-12 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 disabled:opacity-20">
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ol>
          <Button variant="primary" className="mt-4 w-full" onClick={savePlayers}>
            Next: characters
          </Button>
        </section>
      )}

      {stage === "bag" && (
        <section aria-label="Characters">
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={roll} className="flex-1">
              <Dices size={20} /> Random legal bag
            </Button>
          </div>
          <BagCounts bag={bag} n={n} />
          {bagNotes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {bagNotes.map((x) => (
                <Chip key={x} tone="warn">
                  {x}
                </Chip>
              ))}
            </div>
          )}
          {warnings.length > 0 && (
            <ul className="mt-2 space-y-1 rounded-xl border border-amber-700 bg-amber-950/50 p-3 text-sm text-amber-100" role="alert">
              {warnings.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm text-zinc-400">Tap characters to add or remove them.</p>
          {(["townsfolk", "outsider", "minion", "demon"] as Team[]).map((t) => (
            <div key={t}>
              <SectionTitle>{TEAM_LABEL[t]}</SectionTitle>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {byTeam(game.scriptRoles, t).map((id) => {
                  const on = bag.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggle(id)}
                      aria-pressed={on}
                      className={cx("flex flex-col items-center gap-1 rounded-xl border p-2 text-center text-xs", on ? "border-amber-400 bg-amber-400/15 text-white" : "border-zinc-800 bg-zinc-900 text-zinc-400")}
                    >
                      <RoleIcon id={id} size={44} className={cx(!on && "opacity-50 grayscale")} />
                      <span className="leading-tight">{role(id).name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <Button variant="primary" className="mt-5 w-full" onClick={deal} disabled={bag.length !== n}>
            Deal to seats ({bag.length}/{n})
          </Button>
        </section>
      )}

      {stage === "reveal" && <Reveal game={game} onBegin={begin} onRedeal={deal} onBelieves={setBelieves} />}
    </div>
  );
}

function swap<T>(xs: T[], i: number, j: number): T[] {
  const a = [...xs];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}

function BagCounts({ bag, n }: { bag: string[]; n: number }) {
  const d = distribution(n);
  const { delta } = outsiderModifier(bag);
  const count = (t: Team) => bag.filter((id) => role(id).team === t).length;
  const items: [Team, number][] = [
    ["townsfolk", d.townsfolk - delta],
    ["outsider", d.outsider + delta],
    ["minion", d.minion],
    ["demon", d.demon],
  ];
  return (
    <div className="mt-3 grid grid-cols-4 gap-2 text-center" aria-label="Character counts">
      {items.map(([t, want]) => (
        <div key={t} className={cx("rounded-xl p-2", count(t) === want ? "bg-zinc-900" : "bg-amber-950/60")}>
          <div className="text-xl font-bold tabular-nums">
            {count(t)}
            <span className="text-sm font-normal text-zinc-500">/{Math.max(0, want)}</span>
          </div>
          <div className="text-[11px] text-zinc-400">{TEAM_LABEL[t]}</div>
        </div>
      ))}
    </div>
  );
}

/** Pass-the-phone character reveal. */
function Reveal({ game, onBegin, onRedeal, onBelieves }: { game: Game; onBegin: () => void; onRedeal: () => void; onBelieves: (playerId: string, id: string) => string[] }) {
  const [i, setI] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [picking, setPicking] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const pickFor = game.players.find((q) => q.id === picking);
  // Characters someone else holds or believes they hold can't be chosen.
  const taken = game.players.filter((q) => q.id !== picking).flatMap((q) => [q.role, q.believes ?? ""]);
  const p = i === null ? null : game.players[i];

  if (p) {
    const shownRole = p.believes ?? p.role;
    const r = role(shownRole);
    const shownAlign = p.role === "marionette" || p.role === "drunk" ? "good" : p.role === "lunatic" ? "evil" : p.alignment;
    return (
      // Covers the whole screen, tab bar included, so the player holding the phone can't open the Grimoire.
      <section role="dialog" aria-modal="true" aria-label="Character reveal" className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 overflow-y-auto bg-[#0f0f12] px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-center" aria-live="polite">
        <p className="text-sm uppercase tracking-widest text-zinc-400">
          Seat {i! + 1} of {game.players.length}
        </p>
        <p className="text-4xl font-bold">{p.name}</p>
        {!shown ? (
          <Button variant="primary" className="w-full max-w-xs py-6 text-xl" onClick={() => setShown(true)}>
            <Eye /> Tap to see your character
          </Button>
        ) : (
          <>
            <RoleIcon id={shownRole} alignment={shownAlign} size={160} />
            <div>
              <p className="text-3xl font-bold">{r.name}</p>
              <p className={cx("mt-1 text-lg", shownAlign === "evil" ? "text-rose-300" : "text-sky-300")}>
                {TEAM_LABEL[r.team]} · {shownAlign === "evil" ? "Evil" : "Good"}
              </p>
              <p className="mx-auto mt-3 max-w-sm text-lg text-zinc-200">{r.ability}</p>
            </div>
            <Button
              className="w-full max-w-xs py-5 text-lg"
              onClick={() => {
                setShown(false);
                setI(i! + 1 < game.players.length ? i! + 1 : null);
              }}
            >
              <EyeOff /> Hide & pass to {game.players[i! + 1]?.name ?? "the Storyteller"}
            </Button>
          </>
        )}
        <button className="text-sm text-zinc-500 underline" onClick={() => (setI(null), setShown(false))}>
          Storyteller: stop reveal
        </button>
      </section>
    );
  }

  return (
    <section aria-label="Deal">
      <SectionTitle>Seats</SectionTitle>
      <ul className="grid grid-cols-1 gap-1.5">
        {game.players.map((pl, k) => (
          <li key={pl.id} className="flex items-center gap-3 rounded-xl bg-zinc-900 px-3 py-2">
            <span className="w-5 text-right text-sm tabular-nums text-zinc-500">{k + 1}</span>
            <RoleIcon id={pl.role} alignment={pl.alignment} size={36} />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{pl.name}</span>
              <span className="block text-sm text-zinc-400">
                {role(pl.role).name}
                {pl.believes && <span className="text-amber-300"> · thinks {role(pl.believes).name}</span>}
              </span>
            </span>
            {(pl.role === "drunk" || pl.role === "marionette" || pl.role === "lunatic") && (
              <Button variant="ghost" className="shrink-0 border border-amber-700 text-sm text-amber-200" onClick={() => setPicking(pl.id)} ariaLabel={`Change who ${pl.name} thinks they are`}>
                Change
              </Button>
            )}
          </li>
        ))}
      </ul>
      {notes.length > 0 && (
        <ul role="status" className="mt-2 space-y-0.5 rounded-lg border border-violet-700 bg-violet-950/60 p-2 text-sm text-violet-100">
          {notes.map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      )}
      <RolePicker
        open={!!pickFor}
        title={pickFor ? `${pickFor.name} (${role(pickFor.role).name}) thinks they are…` : ""}
        roles={byTeam(game.scriptRoles, pickFor?.role === "lunatic" ? "demon" : "townsfolk")}
        disabled={pickFor?.role === "lunatic" ? [] : taken}
        onClose={() => setPicking(null)}
        onPick={(id) => setNotes(onBelieves(picking!, id))}
      />
      <div className="mt-4 grid gap-2">
        <Button variant="good" onClick={() => (setI(0), setShown(false))}>
          <Eye size={20} /> Pass the phone: reveal characters
        </Button>
        <Button onClick={onRedeal}>
          <Dices size={20} /> Re-deal seats
        </Button>
        <Button variant="primary" onClick={onBegin}>
          Start the first night
        </Button>
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        {game.players.some((q) => q.role === "drunk" || q.role === "marionette" || q.role === "lunatic") && "Tap Change to pick who the Drunk (or Marionette / Lunatic) thinks they are. "}
        You can still change anything on the Grimoire tab after the game starts.
      </p>
    </section>
  );
}
