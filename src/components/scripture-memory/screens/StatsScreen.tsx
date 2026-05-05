import { Flame, RotateCcw, Target, Trophy } from "lucide-react";
import { SCRIPTURE_PASSAGES } from "../../../data/scriptureMemory";
import { DOCTRINAL_MASTERY_TRACKS } from "../../../data/scripture-memory/tracks";
import {
  getPassageProgress,
  getPlanProgress,
  getTrackProgress,
  isDue,
  isMastered,
} from "../learning";
import { MasteryBreakdown } from "../stats/MasteryBreakdown";
import { ProgressMeter } from "../stats/ProgressMeter";
import { StatCard } from "../stats/StatCard";
import type { AppProgress } from "../types";

export function StatsScreen({ progress }: { progress: AppProgress }) {
  const planProgress = getPlanProgress(progress);
  const dueCount = SCRIPTURE_PASSAGES.filter((passage) =>
    isDue(getPassageProgress(passage.id, progress)),
  ).length;
  const masteredCount = SCRIPTURE_PASSAGES.filter((passage) =>
    isMastered(getPassageProgress(passage.id, progress)),
  ).length;
  const referenceMastered = SCRIPTURE_PASSAGES.filter(
    (passage) => getPassageProgress(passage.id, progress).referenceMastery >= 90,
  ).length;
  const keyPhraseMastered = SCRIPTURE_PASSAGES.filter(
    (passage) => getPassageProgress(passage.id, progress).keyPhraseMastery >= 90,
  ).length;
  const passageMastered = SCRIPTURE_PASSAGES.filter(
    (passage) => getPassageProgress(passage.id, progress).passageMastery >= 90,
  ).length;

  return (
    <section className="grid gap-5">
      <header className="rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          Statistics
        </p>
        <h1 className="text-3xl font-bold text-white">Overall Progress</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
          Track path completion, mastery by target, streaks, due reviews, and total sessions.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="Streak"
          value={`${progress.streak} day${progress.streak === 1 ? "" : "s"}`}
        />
        <StatCard icon={<Trophy className="h-5 w-5" />} label="Mastered" value={`${masteredCount}/96`} />
        <StatCard icon={<RotateCcw className="h-5 w-5" />} label="Due" value={`${dueCount}`} />
        <StatCard icon={<Target className="h-5 w-5" />} label="Sessions" value={`${progress.totalSessions}`} />
      </div>

      <section className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <h2 className="text-xl font-bold text-white">Mastery Targets</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <ProgressMeter label="References" value={Math.round((referenceMastered / 96) * 100)} />
          <ProgressMeter label="Key Phrases" value={Math.round((keyPhraseMastered / 96) * 100)} />
          <ProgressMeter label="Full Passages" value={Math.round((passageMastered / 96) * 100)} />
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-white">Doctrinal Mastery</h2>
          <span className="text-sm font-bold text-emerald-200">{planProgress.percent}%</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {DOCTRINAL_MASTERY_TRACKS.map((track) => {
            const trackProgress = getTrackProgress(track, progress);
            return (
              <div key={track.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-white">{track.shortTitle}</h3>
                  <span className="text-sm font-bold text-emerald-200">{trackProgress.percent}%</span>
                </div>
                <p className="mb-3 text-xs leading-5 text-white/50">
                  {trackProgress.masteredPassages}/{trackProgress.totalPassages} mastered,{" "}
                  {trackProgress.completedSteps}/{trackProgress.totalSteps} steps
                </p>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-300" style={{ width: `${trackProgress.percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <MasteryBreakdown progress={progress} />
    </section>
  );
}
