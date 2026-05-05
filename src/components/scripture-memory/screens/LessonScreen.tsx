import { DOCTRINAL_MASTERY_TRACKS, type ScripturePathStep } from "../../../data/scripture-memory/tracks";
import type { AppSettings, Challenge, ChallengeFeedback, ChallengeKind, PracticeLabel } from "../types";
import { ChallengeCard } from "../lesson/ChallengeCard";
import { FeedbackPanel } from "../lesson/FeedbackPanel";
import { LessonFrame } from "../lesson/LessonFrame";
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
    <LessonFrame
      lessonPercent={lessonPercent}
      lessonSubtitle={lessonSubtitle}
      lessonTitle={lessonTitle}
      progressLabel={`${challengeIndex + 1}/${challenges.length}`}
      onExit={onExit}
    >
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
    </LessonFrame>
  );
}
