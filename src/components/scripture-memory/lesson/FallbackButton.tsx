import type { ReactNode } from "react";

export function FallbackButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100"
    >
      {children}
    </button>
  );
}
