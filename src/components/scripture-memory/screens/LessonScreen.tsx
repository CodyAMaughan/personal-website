import { X } from "lucide-react";
import { DOCTRINAL_MASTERY_TRACKS, type ScripturePathStep } from "../../../data/scripture-memory/tracks";
import type { AppSettings, Challenge, ChallengeFeedback, ChallengeKind, PracticeLabel } from "../types";
import { ChallengeCard } from "../lesson/ChallengeCard";
import { FeedbackPanel } from "../lesson/FeedbackPanel";
import { pathStepLabel } from "../path/pathLabels";

export function LessonScreen({
  activePracticeLabel,
  activeStep,
  challengeIndex,
  challenges,
  currentChallenge,
  feedback,
  lessonPercent,
  settings,
  onComplete,
  onExit,
  onNext,
}: {
  activePracticeLabel: PracticeLabel | null;
  activeStep: ScripturePathStep | null;
  challengeIndex: number;
  challenges: Challenge[];
  currentChallenge: Challenge;
  feedback: ChallengeFeedback | null;
  lessonPercent: number;
  settings: AppSettings;
  onComplete: (answer: string, resultKind?: ChallengeKind) => void;
  onExit: () => void;
  onNext: () => void;
}) {
  const activeTrack = activeStep
    ? DOCTRINAL_MASTERY_TRACKS.find((track) => track.id === activeStep.trackId)
    : undefined;
  const lessonTitle = activePracticeLabel?.title ?? (activeStep ? activeStep.title : currentChallenge.passage.reference);
  const lessonSubtitle =
    activePracticeLabel?.subtitle ??
    (activeStep
      ? `${activeTrack?.shortTitle ?? "Practice"} - ${pathStepLabel(activeStep.kind)} - ${activeStep.subtitle}`
      : `Unit ${currentChallenge.passage.unit} - ${currentChallenge.passage.course}`);

  return (
    <main className="min-h-screen bg-[#07100d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="sticky top-16 z-20 -mx-4 border-b border-white/10 bg-[#07100d]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onExit}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-emerald-300/50 hover:text-emerald-200"
              aria-label="Exit lesson"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-bold text-white">{lessonTitle}</p>
              <p className="truncate text-xs text-white/55">{lessonSubtitle}</p>
            </div>
            <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 text-sm font-bold text-emerald-200">
              {challengeIndex + 1}/{challenges.length}
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-300 transition-all duration-300"
              style={{ width: `${lessonPercent}%` }}
            />
          </div>
        </header>

        <section className="flex flex-1 items-stretch py-6">
          <div className="grid w-full content-start gap-5">
            {feedback ? (
              <FeedbackPanel
                feedback={feedback}
                isFinal={challengeIndex >= challenges.length - 1}
                onNext={onNext}
              />
            ) : (
              <ChallengeCard
                key={currentChallenge.id}
                challenge={currentChallenge}
                settings={settings}
                onComplete={onComplete}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
