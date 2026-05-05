import type { ReactNode } from "react";

export function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-emerald-200">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-1 break-words text-base font-bold leading-tight text-white sm:text-lg">{value}</p>
    </div>
  );
}
