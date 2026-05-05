import { BarChart3, Check, Flame, GitBranch, RotateCcw, Settings, Shuffle, Target, Trophy, Volume2 } from "lucide-react";
import { SCRIPTURE_PASSAGES, type ScripturePassage } from "../../../data/scriptureMemory";
import type { ScripturePathStep, ScriptureTrack } from "../../../data/scripture-memory/tracks";
import {
  combinedMastery,
  getPassageProgress,
  getPlanProgress,
  getTrackProgress,
  isDue,
  isMastered,
} from "../learning";
import { ProgressMeter } from "../stats/ProgressMeter";
import { StatCard } from "../stats/StatCard";
import type { AppProgress, AppSettings } from "../types";

export function HomeScreen({
  globalReviewCount,
  progress,
  selectedStep,
  selectedTrack,
  settings,
  onContinueLesson,
  onContinuePath,
  onOpenPaths,
  onOpenStats,
  onPractice,
  onQuickReview,
  onReset,
  onSettingsChange,
}: {
  globalReviewCount: number;
  progress: AppProgress;
  selectedStep?: ScripturePathStep;
  selectedTrack: ScriptureTrack;
  settings: AppSettings;
  onContinueLesson: () => void;
  onContinuePath: () => void;
  onOpenPaths: () => void;
  onOpenStats: () => void;
  onPractice: (passage: ScripturePassage) => void;
  onQuickReview: () => void;
  onReset: () => void;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
}) {
  const planProgress = getPlanProgress(progress);
  const selectedTrackProgress = getTrackProgress(selectedTrack, progress);
  const duePassages = SCRIPTURE_PASSAGES.filter((passage) =>
    isDue(getPassageProgress(passage.id, progress)),
  );
  const masteredCount = SCRIPTURE_PASSAGES.filter((passage) =>
    isMastered(getPassageProgress(passage.id, progress)),
  ).length;
  const recentPassages = SCRIPTURE_PASSAGES.map((passage) => ({
    passage,
    passageProgress: getPassageProgress(passage.id, progress),
  }))
    .filter(({ passageProgress }) => Boolean(passageProgress.lastPracticedAt))
    .sort(
      (left, right) =>
        new Date(right.passageProgress.lastPracticedAt ?? 0).getTime() -
        new Date(left.passageProgress.lastPracticedAt ?? 0).getTime(),
    )
    .slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="grid gap-4">
        <div className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
              Doctrinal Mastery
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Scripture Memory
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
              Memorize references, key phrases, and full passages through quick tests,
              typing, word banks, and voice recitation.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={onContinuePath}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/80 transition hover:border-emerald-300/40 hover:text-emerald-100"
            >
              <GitBranch className="h-4 w-4" />
              Continue Path
            </button>
            <button
              type="button"
              disabled={!selectedStep}
              onClick={onContinueLesson}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-4 text-sm font-bold text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
            >
              <Check className="h-4 w-4" />
              Continue Lesson
            </button>
            <button
              type="button"
              disabled={globalReviewCount === 0}
              onClick={onQuickReview}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/80 transition hover:border-emerald-300/40 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Shuffle className="h-4 w-4" />
              Quick Review
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              icon={<Flame className="h-5 w-5" />}
              label="Streak"
              value={`${progress.streak} day${progress.streak === 1 ? "" : "s"}`}
            />
            <StatCard icon={<RotateCcw className="h-5 w-5" />} label="Due" value={`${duePassages.length}`} />
            <StatCard icon={<Trophy className="h-5 w-5" />} label="Mastered" value={`${masteredCount}/96`} />
            <StatCard icon={<Target className="h-5 w-5" />} label="Current" value={selectedTrack.shortTitle} />
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                Active Path
              </p>
              <h2 className="text-2xl font-bold text-white">{selectedTrack.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
                {selectedStep
                  ? `Next: ${selectedStep.title} - ${selectedStep.subtitle}`
                  : "Everything in this path is unlocked for review."}
              </p>
            </div>
            <div className="grid gap-2 sm:min-w-44">
              <button
                type="button"
                onClick={onOpenPaths}
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100"
              >
                Choose Path
              </button>
              <button
                type="button"
                onClick={onOpenStats}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <ProgressMeter label="Doctrinal Mastery" value={planProgress.percent} />
            <ProgressMeter label="Current Path" value={selectedTrackProgress.percent} />
            <ProgressMeter label="Average Mastery" value={selectedTrackProgress.averageMastery} />
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-3 text-lg font-bold text-white">Due Reviews</h2>
          <div className="grid gap-2">
            {duePassages.slice(0, 5).map((passage) => (
              <button
                key={passage.id}
                type="button"
                onClick={() => onPractice(passage)}
                className="rounded-lg border border-white/10 bg-black/20 p-3 text-left transition hover:border-emerald-300/35 hover:bg-emerald-300/10"
              >
                <span className="block text-sm font-bold text-white">{passage.reference}</span>
                <span className="line-clamp-1 text-xs leading-5 text-white/55">{passage.keyPhrase}</span>
              </button>
            ))}
            {duePassages.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white/55">
                No reviews due right now.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-white">
            <Settings className="h-5 w-5 text-emerald-200" />
            Settings
          </h2>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
            <span>
              <span className="block text-sm font-bold text-white">Voice challenges</span>
              <span className="block text-xs leading-5 text-white/55">Fallbacks stay available.</span>
            </span>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(event) => onSettingsChange({ voiceEnabled: event.currentTarget.checked })}
              className="h-5 w-5 accent-emerald-300"
            />
          </label>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="mb-3 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-emerald-200" />
              <span>
                <span className="block text-sm font-bold text-white">Reader voice</span>
                <span className="block text-xs leading-5 text-white/55">Church narration for read-aloud.</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Reader voice">
              {(["female", "male"] as const).map((voice) => (
                <button
                  key={voice}
                  type="button"
                  aria-pressed={settings.readAloudVoice === voice}
                  onClick={() => onSettingsChange({ readAloudVoice: voice })}
                  className={`min-h-10 rounded-lg border px-3 text-sm font-bold capitalize transition ${
                    settings.readAloudVoice === voice
                      ? "border-emerald-300 bg-emerald-300 text-black"
                      : "border-white/10 bg-white/5 text-white/70 hover:border-emerald-300/40 hover:text-emerald-100"
                  }`}
                >
                  {voice}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 text-sm font-bold text-white/65 transition hover:border-red-300/40 hover:text-red-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </button>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-3 text-lg font-bold text-white">Recent Practice</h2>
          <div className="grid gap-3">
            {recentPassages.map(({ passage, passageProgress }) => {
              return (
                <div key={passage.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-white">{passage.reference}</span>
                    <span className="text-white/55">{combinedMastery(passageProgress)}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-300"
                      style={{ width: `${combinedMastery(passageProgress)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {recentPassages.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white/55">
                No recent practice yet.
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
