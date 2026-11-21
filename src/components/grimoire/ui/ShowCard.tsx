import { useEffect } from "react";
import type { ShowCard as Card } from "../engine/night";
import { role } from "../engine/roles";
import type { Game } from "../engine/types";
import { RoleIcon } from "./common";

/** Full-screen, player-facing card. Shows nothing secret beyond what's on it. */
export function ShowCard({ card, game, onClose }: { card: Card; game: Game; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const names = (card.players ?? []).map((id) => game.players.find((p) => p.id === id)?.name ?? "?");
  return (
    <button
      onClick={onClose}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white"
      aria-label="Player card. Tap to close."
    >
      <p className="font-serif text-3xl leading-tight text-amber-200">{card.heading}</p>
      {names.length > 0 && <p className="text-4xl font-bold leading-tight">{names.join("  ·  ")}</p>}
      {card.big && <p className="text-[7rem] font-black leading-none tabular-nums">{card.big}</p>}
      {card.roles && card.roles.length > 0 && (
        <div className="flex flex-wrap items-start justify-center gap-5">
          {card.roles.map((id) => (
            <div key={id} className="flex w-32 flex-col items-center gap-2">
              <RoleIcon id={id} size={card.roles!.length > 2 ? 96 : 128} />
              <span className="text-xl font-semibold">{role(id).name}</span>
            </div>
          ))}
        </div>
      )}
      {card.text && <p className="text-2xl text-zinc-300">{card.text}</p>}
      <span className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-sm text-zinc-500">Tap anywhere to close</span>
    </button>
  );
}
