import { Sparkles } from "lucide-react";
import { classNames } from "../ui";

interface ScripturePlan {
  id: string;
  title: string;
  description: string;
  trackIds: string[];
}

export function PlanCard({
  active,
  plan,
  onSelect,
}: {
  active: boolean;
  plan: ScripturePlan;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={classNames(
        "rounded-lg border p-4 text-left transition",
        active
          ? "border-emerald-300/50 bg-emerald-300/10"
          : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.06]",
      )}
    >
      <Sparkles className="mb-3 h-5 w-5 text-emerald-200" />
      <p className="text-lg font-bold text-white">{plan.title}</p>
      <p className="mt-2 text-sm leading-6 text-white/60">{plan.description}</p>
    </button>
  );
}
