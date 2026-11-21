import { useState } from "react";
import { cleanNightText, NIGHT_ORDER, role, TEAM_LABEL, TEAM_ORDER } from "../engine/roles";
import type { Game } from "../engine/types";
import { cx, RoleIcon, SectionTitle } from "./common";

export function ScriptScreen({ game }: { game: Game }) {
  const [tab, setTab] = useState<"chars" | "first" | "other">("chars");
  const inPlay = new Set(game.players.map((p) => p.role));
  const nightList = (order: string[], first: boolean) =>
    order.filter((id) => game.scriptRoles.includes(id) || ["dusk", "dawn", "minioninfo", "demoninfo"].includes(id));

  return (
    <div className="mx-auto max-w-lg px-3 pb-6">
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-zinc-900 p-1" role="tablist">
        {(
          [
            ["chars", "Characters"],
            ["first", "First night"],
            ["other", "Other nights"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cx("min-h-11 rounded-lg text-sm", tab === id ? "bg-zinc-700 font-semibold" : "text-zinc-300")}>
            {label}
          </button>
        ))}
      </div>
      {tab === "chars" &&
        TEAM_ORDER.map((t) => {
          const ids = game.scriptRoles.filter((id) => role(id).team === t);
          if (!ids.length) return null;
          return (
            <section key={t}>
              <SectionTitle>{TEAM_LABEL[t]}</SectionTitle>
              <ul className="grid gap-2">
                {ids.map((id) => (
                  <li key={id} className={cx("flex gap-3 rounded-xl p-2", inPlay.has(id) ? "bg-zinc-900" : "bg-zinc-950")}>
                    <RoleIcon id={id} size={44} />
                    <div>
                      <p className="font-semibold">
                        {role(id).name} {inPlay.has(id) && <span className="ml-1 rounded bg-amber-400/20 px-1.5 text-xs text-amber-200">in play</span>}
                      </p>
                      <p className="text-sm text-zinc-300">{role(id).ability}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      {tab !== "chars" && (
        <ol className="grid gap-2">
          {nightList(tab === "first" ? NIGHT_ORDER.firstNight : NIGHT_ORDER.otherNight, tab === "first").map((id) => {
            const special: Record<string, string> = { dusk: "Dusk", dawn: "Dawn", minioninfo: "Minion info", demoninfo: "Demon info" };
            const text = special[id] ? "" : cleanNightText(tab === "first" ? role(id).firstNightReminder : role(id).otherNightReminder);
            return (
              <li key={id} className="flex gap-3 rounded-xl bg-zinc-900 p-2">
                {special[id] ? <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800">{id === "dusk" ? "🌙" : id === "dawn" ? "☀️" : "👁"}</span> : <RoleIcon id={id} size={40} />}
                <div>
                  <p className="font-semibold">{special[id] ?? role(id).name}</p>
                  {text && <p className="text-sm text-zinc-300">{text}</p>}
                </div>
              </li>
            );
          })}
        </ol>
      )}
      <p className="mt-6 text-center text-xs text-zinc-500">Character text, night order and icons © The Pandemonium Institute, used under their Community Created Content Policy. Unofficial fan tool.</p>
    </div>
  );
}
