import { useEffect, useState } from "react";
import { BookOpen, Menu, Moon, ScrollText, Settings2, Sun, Undo2 } from "lucide-react";
import { newGame, phaseLabel } from "./engine/state";
import type { Game } from "./engine/types";
import { decodeGame, encodeGame, useGame } from "./useGame";
import { Button, cx, Sheet } from "./ui/common";
import { DayScreen } from "./ui/DayScreen";
import { GrimoireScreen } from "./ui/GrimoireScreen";
import { NightScreen } from "./ui/NightScreen";
import { ScriptScreen } from "./ui/ScriptScreen";
import { SetupScreen } from "./ui/SetupScreen";

type Tab = "phase" | "grimoire" | "script";

export default function GrimoireApp() {
  const { game, commit, update, undo, canUndo } = useGame();
  const [tab, setTab] = useState<Tab>("phase");
  const [menu, setMenu] = useState(false);
  const [incoming, setIncoming] = useState<Game | null>(null);

  // Load a game shared via link (#g=...).
  useEffect(() => {
    const m = location.hash.match(/[#&]g=([\w-]+)/);
    if (!m) return;
    decodeGame(m[1])
      .then(setIncoming)
      .catch(() => alert("That share link couldn't be read."))
      .finally(() => history.replaceState(null, "", location.pathname));
  }, []);

  // Jump to the phase screen whenever the phase changes.
  useEffect(() => setTab("phase"), [game.phase]);

  const PhaseIcon = game.phase === "day" ? Sun : game.phase === "night" ? Moon : Settings2;
  const tabs: { id: Tab; label: string; Icon: typeof Sun }[] = [
    { id: "phase", label: game.phase === "setup" ? "Setup" : game.phase === "night" ? "Night" : "Day", Icon: PhaseIcon },
    { id: "grimoire", label: "Grimoire", Icon: BookOpen },
    { id: "script", label: "Script", Icon: ScrollText },
  ];

  return (
    <div className={cx("min-h-dvh text-zinc-100", game.phase === "night" ? "bg-[#07070c]" : "bg-[#0f0f12]")}>
      <header className={cx("sticky top-0 z-30 border-b border-zinc-800 pt-[env(safe-area-inset-top)] backdrop-blur", game.phase === "night" ? "bg-[#07070c]/95" : "bg-[#0f0f12]/95")}>
        <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-2">
          <button onClick={() => setMenu(true)} className="flex h-12 w-12 items-center justify-center rounded-xl hover:bg-zinc-800" aria-label="Menu">
            <Menu />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold leading-tight">{phaseLabel(game)}</h1>
            <p className="truncate text-xs text-zinc-400">{game.scriptName || "Storyteller’s Grimoire"}</p>
          </div>
          <button onClick={undo} disabled={!canUndo} className="flex h-12 items-center gap-1 rounded-xl px-3 hover:bg-zinc-800 disabled:opacity-30" aria-label="Undo last change">
            <Undo2 size={20} /> <span className="text-sm">Undo</span>
          </button>
        </div>
      </header>

      {game.winner && (
        <div role="alert" className={cx("mx-auto mt-3 max-w-lg rounded-xl px-4 py-3 text-center text-lg font-bold", game.winner === "good" ? "bg-sky-700" : "bg-rose-800")}>
          {game.winner === "good" ? "Good wins!" : "Evil wins!"}
          <span className="block text-sm font-normal opacity-80">Undo if that was a mistake, or start a new game from the menu.</span>
        </div>
      )}

      <main className="pb-28 pt-3">
        {tab === "phase" && game.phase === "setup" && <SetupScreen game={game} commit={commit} />}
        {tab === "phase" && game.phase === "night" && <NightScreen game={game} commit={commit} update={update} openGrimoire={() => setTab("grimoire")} />}
        {tab === "phase" && game.phase === "day" && <DayScreen game={game} commit={commit} />}
        {tab === "grimoire" && (game.players.length ? <GrimoireScreen game={game} update={update} /> : <Empty />)}
        {tab === "script" && (game.scriptRoles.length ? <ScriptScreen game={game} /> : <Empty />)}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Main">
        <div className="mx-auto grid max-w-lg grid-cols-3">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={cx("flex min-h-16 flex-col items-center justify-center gap-0.5 text-sm", tab === id ? "text-amber-300" : "text-zinc-400")}>
              <Icon size={24} />
              {label}
            </button>
          ))}
        </div>
      </nav>

      <GameMenu open={menu} onClose={() => setMenu(false)} game={game} commit={commit} />

      <Sheet open={!!incoming} onClose={() => setIncoming(null)} title="Load shared game?">
        <p className="text-zinc-300">
          {incoming?.scriptName} · {incoming?.players.length} players · {incoming ? phaseLabel(incoming) : ""}
        </p>
        <p className="mt-1 text-sm text-zinc-400">This replaces the game on this device (you can undo).</p>
        <Button
          variant="primary"
          className="mt-3 w-full"
          onClick={() => {
            commit(incoming!);
            setIncoming(null);
          }}
        >
          Load it
        </Button>
      </Sheet>
    </div>
  );
}

function Empty() {
  return <p className="px-6 py-16 text-center text-zinc-400">Finish setup first.</p>;
}

function GameMenu({ open, onClose, game, commit }: { open: boolean; onClose: () => void; game: Game; commit: (g: Game) => void }) {
  const [link, setLink] = useState("");
  const [msg, setMsg] = useState("");
  const [paste, setPaste] = useState("");

  const share = async () => {
    const code = await encodeGame(game);
    const url = `${location.origin}${location.pathname}#g=${code}`;
    setLink(url);
    try {
      if (navigator.share) await navigator.share({ title: "Grimoire", url });
      else {
        await navigator.clipboard.writeText(url);
        setMsg("Link copied.");
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Menu">
      <div className="grid gap-2">
        <Button onClick={share} disabled={!game.players.length && !game.scriptRoles.length}>
          Send this game to another device
        </Button>
        {link && (
          <>
            <textarea readOnly value={link} rows={3} aria-label="Share link" className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-2 font-mono text-xs" onFocus={(e) => e.target.select()} />
            <p className="text-xs text-zinc-400">Open this link on your phone to load the game there. {msg}</p>
          </>
        )}
        <label className="mt-2 text-sm text-zinc-300" htmlFor="loadlink">
          Or paste a share link here
        </label>
        <div className="flex gap-2">
          <input id="loadlink" value={paste} onChange={(e) => setPaste(e.target.value)} className="min-h-12 min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-base" />
          <Button
            onClick={async () => {
              const m = paste.match(/g=([\w-]+)/);
              try {
                commit(await decodeGame(m ? m[1] : paste.trim()));
                setPaste("");
                onClose();
              } catch (e) {
                setMsg((e as Error).message);
              }
            }}
          >
            Load
          </Button>
        </div>
        <hr className="my-2 border-zinc-800" />
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Start a new game? (You can undo.)")) {
              const g = newGame();
              g.scriptName = game.scriptName;
              g.scriptRoles = game.scriptRoles;
              commit(g);
              onClose();
            }
          }}
        >
          New game
        </Button>
        <p className="mt-2 text-xs text-zinc-500">The game saves automatically on this device. Unofficial fan-made tool — not affiliated with The Pandemonium Institute.</p>
      </div>
    </Sheet>
  );
}
