import { DOCTRINAL_MASTERY_PLAN, DOCTRINAL_MASTERY_TRACKS, type ScriptureTrack } from "../../../data/scripture-memory/tracks";
import { PlanCard } from "../path/PlanCard";
import { TrackCard } from "../path/TrackCard";
import type { AppProgress } from "../types";

export function PathsScreen({
  progress,
  selectedPlanId,
  selectedTrackId,
  onQuickReview,
  onSelectPlan,
  onSelectTrack,
}: {
  progress: AppProgress;
  selectedPlanId: string;
  selectedTrackId: string;
  onQuickReview: (track: ScriptureTrack) => void;
  onSelectPlan: (planId: string) => void;
  onSelectTrack: (track: ScriptureTrack) => void;
}) {
  return (
    <section className="grid gap-5">
      <header className="rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          Path Selection
        </p>
        <h1 className="text-3xl font-bold text-white">Choose a Plan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
          Pick the curriculum, then choose the scripture-year path you want to work through.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <PlanCard
          active={selectedPlanId === DOCTRINAL_MASTERY_PLAN.id}
          plan={DOCTRINAL_MASTERY_PLAN}
          onSelect={() => onSelectPlan(DOCTRINAL_MASTERY_PLAN.id)}
        />
      </div>

      <section className="grid gap-3">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
            Doctrinal Mastery Paths
          </p>
          <h2 className="text-2xl font-bold text-white">Choose a Path</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DOCTRINAL_MASTERY_TRACKS.map((track) => (
            <TrackCard
              key={track.id}
              active={selectedTrackId === track.id}
              progress={progress}
              track={track}
              onSelect={() => onSelectTrack(track)}
              onQuickReview={() => onQuickReview(track)}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
