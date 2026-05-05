import { Shuffle } from "lucide-react";
import { getPracticedPassages, getTrackProgress } from "../learning";
import type { AppProgress } from "../types";
import { classNames } from "../ui";
import type { ScriptureTrack } from "../../../data/scripture-memory/tracks";

export function TrackCard({
  active,
  progress,
  track,
  onSelect,
  onQuickReview,
}: {
  active: boolean;
  progress: AppProgress;
  track: ScriptureTrack;
  onSelect: () => void;
  onQuickReview?: () => void;
}) {
  const trackProgress = getTrackProgress(track, progress);
  const reviewCount = getPracticedPassages(progress, track).length;

  return (
    <article
      className={classNames(
        "grid gap-3 rounded-lg border p-4 transition",
        active ? "border-emerald-300/50 bg-emerald-300/10" : "border-white/10 bg-black/20",
      )}
    >
      <button type="button" onClick={onSelect} className="text-left">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-bold text-white">{track.shortTitle}</span>
          <span className="text-xs font-bold text-emerald-200">{trackProgress.percent}%</span>
        </div>
        <p className="text-xs leading-5 text-white/55">
          {trackProgress.masteredPassages}/{trackProgress.totalPassages} mastered •{" "}
          {trackProgress.completedSteps}/{trackProgress.totalSteps} steps
        </p>
      </button>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={onSelect}
          className={classNames(
            "inline-flex min-h-10 items-center justify-center rounded-lg px-3 text-sm font-bold transition",
            active
              ? "bg-emerald-300 text-black hover:bg-emerald-200"
              : "border border-white/10 bg-white/5 text-white/75 hover:border-emerald-300/40 hover:text-emerald-100",
          )}
        >
          {active ? "Active Path" : "Choose Path"}
        </button>
        {onQuickReview && (
          <button
            type="button"
            disabled={reviewCount === 0}
            onClick={onQuickReview}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-bold text-white/65 transition hover:border-emerald-300/40 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Shuffle className="h-4 w-4" />
            Quick Review
          </button>
        )}
      </div>
    </article>
  );
}
