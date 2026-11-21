import { useState } from "react";
import { role, ROLES, TEAM_LABEL, TEAM_ORDER } from "../engine/roles";
import { Sheet, cx, RoleIcon } from "./common";

export function RolePicker({
  open,
  title,
  roles,
  onPick,
  onClose,
  allowAll,
  disabled = [],
}: {
  open: boolean;
  title: string;
  roles: string[];
  onPick: (id: string) => void;
  onClose: () => void;
  allowAll?: boolean;
  disabled?: string[];
}) {
  const [all, setAll] = useState(false);
  const [q, setQ] = useState("");
  const list = (all ? Object.keys(ROLES) : roles).filter((id) => !q || role(id).name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search characters"
        aria-label="Search characters"
        className="mb-2 min-h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-base"
      />
      {allowAll && (
        <label className="mb-2 flex min-h-11 items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="h-5 w-5" /> Show every character (not just this script)
        </label>
      )}
      {TEAM_ORDER.map((t) => {
        const ids = list.filter((id) => role(id).team === t);
        if (!ids.length) return null;
        return (
          <div key={t} className="mb-3">
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">{TEAM_LABEL[t]}</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {ids.map((id) => (
                <button
                  key={id}
                  disabled={disabled.includes(id)}
                  onClick={() => {
                    onPick(id);
                    onClose();
                  }}
                  className={cx("flex flex-col items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-center text-xs hover:bg-zinc-800 disabled:opacity-30")}
                >
                  <RoleIcon id={id} size={44} />
                  <span className="leading-tight">{role(id).name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}
