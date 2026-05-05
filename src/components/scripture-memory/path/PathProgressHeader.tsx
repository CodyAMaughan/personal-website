import { Check, GitBranch, Shuffle } from "lucide-react";
import type { ScriptureTrack } from "../../../data/scripture-memory/tracks";
import { getTrackProgress } from "../learning";
import { ProgressMeter } from "../stats/ProgressMeter";
import type { AppProgress } from "../types";

export function PathProgressHeader({
  progress,
  reviewCount,
  track,
  onChangePath,
  onContinueLesson,
  onQuickReview,
}: {
  progress: AppProgress;
  reviewCount: number;
  track: ScriptureTrack;
  onChangePath: () => void;
  onContinueLesson: () => void;
  onQuickReview: () => void;
}) {
  const trackProgress = getTrackProgress(track, progress);

  return (
    <header className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
            Current Path
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{track.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">{track.description}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
          <button
            type="button"
            onClick={onChangePath}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100"
          >
            <GitBranch className="h-4 w-4" />
            Change Path
          </button>
          <button
            type="button"
            disabled={reviewCount === 0}
            onClick={onQuickReview}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Shuffle className="h-4 w-4" />
            Quick Review
          </button>
          <button
            type="button"
            onClick={onContinueLesson}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-bold text-black transition hover:bg-emerald-200"
          >
            <Check className="h-4 w-4" />
            Continue
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <ProgressMeter label="Path Steps" value={trackProgress.percent} />
        <ProgressMeter label="Average Mastery" value={trackProgress.averageMastery} />
        <ProgressMeter
          label="Passages Mastered"
          value={
            trackProgress.totalPassages
              ? Math.round((trackProgress.masteredPassages / trackProgress.totalPassages) * 100)
              : 0
          }
        />
      </div>
    </header>
  );
}
