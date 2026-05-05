import { Lock } from "lucide-react";
import type { ScripturePathStep, ScriptureTrack } from "../../../data/scripture-memory/tracks";
import type { ScripturePassage } from "../../../data/scriptureMemory";
import {
  getPassageById,
  getStepProgress,
  isPathStepComplete,
  isPathStepUnlocked,
} from "../learning";
import type { AppProgress } from "../types";
import { classNames } from "../ui";
import { pathStepIcon, pathStepLabel } from "./pathLabels";

export function PathNode({
  current,
  onStart,
  progress,
  step,
  track,
}: {
  current: boolean;
  onStart: () => void;
  progress: AppProgress;
  step: ScripturePathStep;
  track: ScriptureTrack;
}) {
  const unlocked = isPathStepUnlocked(track, step, progress);
  const complete = isPathStepComplete(step, progress);
  const stepProgress = getStepProgress(step.id, progress);
  const passages = step.passageIds
    .map((passageId) => getPassageById(passageId))
    .filter((passage): passage is ScripturePassage => Boolean(passage));

  return (
    <button
      type="button"
      disabled={!unlocked}
      onClick={onStart}
      className={classNames(
        "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left transition sm:p-4",
        !unlocked && "cursor-not-allowed border-white/5 bg-black/10 opacity-45",
        unlocked &&
          (current
            ? "border-emerald-300/50 bg-emerald-300/10"
            : "border-white/10 bg-black/20 hover:border-emerald-300/35 hover:bg-emerald-300/10"),
      )}
    >
      <span
        className={classNames(
          "inline-flex h-11 w-11 items-center justify-center rounded-lg border",
          complete
            ? "border-emerald-300/40 bg-emerald-300/20 text-emerald-100"
            : "border-white/10 bg-white/5 text-white/65",
        )}
      >
        {unlocked ? pathStepIcon(step.kind, complete) : <Lock className="h-5 w-5" />}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-white">{step.title}</span>
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
            {pathStepLabel(step.kind)}
          </span>
        </span>
        <span className="mt-1 block text-sm leading-5 text-white/55">
          {step.kind === "review"
            ? "Cumulative review from this path"
            : passages.map((passage) => passage.reference).join(", ")}
        </span>
      </span>
      <span className="text-right text-xs font-bold text-white/55">
        {complete
          ? "Done"
          : !unlocked
            ? "Locked"
            : stepProgress.attempts > 0
              ? `${stepProgress.bestScore}% best`
              : current
                ? "Current"
                : "Open"}
      </span>
    </button>
  );
}
