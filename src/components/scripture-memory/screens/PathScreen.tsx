import type { ScripturePathStep, ScriptureTrack } from "../../../data/scripture-memory/tracks";
import { getPracticedPassages, getTrackProgress } from "../learning";
import { PathNode } from "../path/PathNode";
import { PathProgressHeader } from "../path/PathProgressHeader";
import type { AppProgress } from "../types";

export function PathScreen({
  progress,
  selectedStep,
  track,
  onChangePath,
  onContinueLesson,
  onQuickReview,
  onStartStep,
}: {
  progress: AppProgress;
  selectedStep?: ScripturePathStep;
  track: ScriptureTrack;
  onChangePath: () => void;
  onContinueLesson: () => void;
  onQuickReview: () => void;
  onStartStep: (step: ScripturePathStep) => void;
}) {
  const trackProgress = getTrackProgress(track, progress);
  const reviewCount = getPracticedPassages(progress, track).length;

  return (
    <section className="grid gap-5">
      <PathProgressHeader
        progress={progress}
        reviewCount={reviewCount}
        track={track}
        onChangePath={onChangePath}
        onContinueLesson={onContinueLesson}
        onQuickReview={onQuickReview}
      />

      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">{track.shortTitle} Path</h2>
          <span className="text-sm font-bold text-white/55">
            {trackProgress.completedSteps}/{trackProgress.totalSteps}
          </span>
        </div>

        <div className="grid gap-3">
          {track.steps.map((step) => (
            <PathNode
              key={step.id}
              current={selectedStep?.id === step.id}
              progress={progress}
              step={step}
              track={track}
              onStart={() => onStartStep(step)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
