import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { iconUrls, role } from "../engine/roles";
import type { Alignment, Player } from "../engine/types";

export const cx = (...xs: Array<string | false | null | undefined>) => xs.filter(Boolean).join(" ");

const TEAM_RING: Record<string, string> = {
  townsfolk: "ring-sky-400",
  outsider: "ring-cyan-300",
  minion: "ring-rose-500",
  demon: "ring-red-600",
  traveller: "ring-violet-400",
  fabled: "ring-amber-300",
  loric: "ring-emerald-300",
};

export function teamText(team: string) {
  return team === "minion" || team === "demon" ? "text-rose-300" : team === "traveller" ? "text-violet-300" : team === "outsider" ? "text-cyan-200" : "text-sky-200";
}

/** Character icon with graceful fallback to initials. */
export function RoleIcon({ id, alignment, size = 48, className }: { id?: string; alignment?: Alignment; size?: number; className?: string }) {
  const urls = id ? iconUrls(id, alignment) : [];
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [id, alignment]);
  const r = role(id);
  const evil = alignment ? alignment === "evil" : r.team === "minion" || r.team === "demon";
  return (
    <span
      className={cx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#efe6d2] ring-2",
        evil ? "ring-rose-600" : TEAM_RING[r.team] ?? "ring-zinc-500",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {urls[i] ? (
        <img src={urls[i]} alt="" className="h-[112%] w-[112%] max-w-none object-cover" onError={() => setI((n) => n + 1)} draggable={false} />
      ) : (
        <span className={cx("font-bold", evil ? "text-rose-800" : "text-sky-900")} style={{ fontSize: size * 0.34 }}>
          {r.name
            .split(/\s+/)
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </span>
      )}
    </span>
  );
}

type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "good";

export function Button({
  children,
  onClick,
  variant = "secondary",
  disabled,
  className,
  type = "button",
  ariaLabel,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const styles: Record<BtnVariant, string> = {
    primary: "bg-amber-400 text-black hover:bg-amber-300 font-semibold",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700",
    ghost: "text-zinc-200 hover:bg-zinc-800",
    danger: "bg-rose-700 text-white hover:bg-rose-600 font-semibold",
    good: "bg-sky-600 text-white hover:bg-sky-500 font-semibold",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:cursor-not-allowed disabled:opacity-40",
        styles[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Bottom sheet dialog, sized for one-handed phone use. */
export function Sheet({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="presentation">
      <button className="absolute inset-0 bg-black/70" aria-label="Close" onClick={onClose} tabIndex={-1} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl border border-zinc-800 bg-zinc-900 shadow-2xl outline-none sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-4 py-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-zinc-800" aria-label="Close">
            <X size={22} />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain px-4 py-3">{children}</div>
        {footer && <div className="border-t border-zinc-800 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  );
}

export function Chip({ children, tone = "muted", onClick, ariaLabel }: { children: ReactNode; tone?: "muted" | "good" | "evil" | "warn" | "auto"; onClick?: () => void; ariaLabel?: string }) {
  const t = {
    muted: "bg-zinc-800 text-zinc-200 border-zinc-700",
    good: "bg-sky-950 text-sky-200 border-sky-800",
    evil: "bg-rose-950 text-rose-200 border-rose-800",
    warn: "bg-amber-950 text-amber-200 border-amber-800",
    auto: "bg-violet-950 text-violet-200 border-violet-800 border-dashed",
  }[tone];
  const C = onClick ? "button" : "span";
  return (
    <C onClick={onClick} aria-label={ariaLabel} className={cx("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm leading-tight", t, onClick && "min-h-9 hover:brightness-125")}>
      {children}
    </C>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-400 first:mt-0">{children}</h3>;
}

/** Big tappable player row, used by pickers. */
export function PlayerButton({ p, selected, onClick, disabled, sub }: { p: Player; selected?: boolean; onClick: () => void; disabled?: boolean; sub?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cx(
        "flex min-h-14 w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-35",
        selected ? "border-amber-400 bg-amber-400/15" : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800",
      )}
    >
      <RoleIcon id={p.role} alignment={p.alignment} size={36} className={cx(!p.alive && "grayscale opacity-60")} />
      <span className="min-w-0 flex-1">
        <span className={cx("block truncate font-medium", !p.alive && "line-through decoration-zinc-500")}>{p.name}</span>
        <span className="block truncate text-sm text-zinc-400">{sub ?? role(p.role).name}</span>
      </span>
      {selected && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-black">✓</span>}
    </button>
  );
}
