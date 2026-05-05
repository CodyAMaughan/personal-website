import { useState } from "react";
import { SCRIPTURE_PASSAGES, type ScripturePassage } from "../../../data/scriptureMemory";
import { type ScripturePathStep, type ScriptureTrack } from "../../../data/scripture-memory/tracks";
import {
  buildChallenges,
  buildPathStepChallenges,
  buildQuickReviewChallenges,
  finalizeLessonMastery,
  finalizeStepProgress,
  getPassageById,
  recordPracticeSession,
  scoreAnswer,
  scoreMasteryAnswer,
  updateAfterChallenge,
} from "../learning";
import type {
  AppProgress,
  Challenge,
  ChallengeFeedback,
  ChallengeKind,
  ChallengeResult,
  PracticeLabel,
} from "../types";

interface UseLessonSessionInput {
  progress: AppProgress;
  persistProgress: (progress: AppProgress) => void;
}

export function useLessonSession({ progress, persistProgress }: UseLessonSessionInput) {
  const [activeStep, setActiveStep] = useState<ScripturePathStep | null>(null);
  const [activePracticeLabel, setActivePracticeLabel] = useState<PracticeLabel | null>(null);
  const [activePassage, setActivePassage] = useState<ScripturePassage>(SCRIPTURE_PASSAGES[0]);
  const [challenges, setChallenges] = useState<Challenge[]>(() => buildChallenges(SCRIPTURE_PASSAGES[0]));
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [lessonResults, setLessonResults] = useState<Record<string, ChallengeResult>>({});
  const [feedback, setFeedback] = useState<ChallengeFeedback | null>(null);

  const currentChallenge = challenges[challengeIndex];
  const lessonPercent = Math.round(((challengeIndex + (feedback ? 1 : 0)) / challenges.length) * 100);

  function startLesson(passage: ScripturePassage) {
    setActiveStep(null);
    setActivePracticeLabel(null);
    setActivePassage(passage);
    setChallenges(buildChallenges(passage));
    setChallengeIndex(0);
    setLessonResults({});
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startPathStep(step: ScripturePathStep) {
    const stepChallenges = buildPathStepChallenges(step, progress);
    const firstPassage = stepChallenges[0]?.passage ?? getPassageById(step.passageIds[0]) ?? SCRIPTURE_PASSAGES[0];

    setActiveStep(step);
    setActivePracticeLabel(null);
    setActivePassage(firstPassage);
    setChallenges(stepChallenges.length > 0 ? stepChallenges : buildChallenges(firstPassage));
    setChallengeIndex(0);
    setLessonResults({});
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuickReview(track?: ScriptureTrack) {
    const reviewChallenges = buildQuickReviewChallenges(progress, track);
    const firstPassage = reviewChallenges[0]?.passage;
    if (!firstPassage || reviewChallenges.length === 0) return false;

    setActiveStep(null);
    setActivePracticeLabel({
      title: track ? `${track.shortTitle} Quick Review` : "Quick Review",
      subtitle: `${reviewChallenges.length} random questions from previously practiced scriptures`,
    });
    setActivePassage(firstPassage);
    setChallenges(reviewChallenges);
    setChallengeIndex(0);
    setLessonResults({});
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  function completeChallenge(score: number, answer: string, resultKind = currentChallenge?.kind) {
    if (!currentChallenge) return;
    const kind = resultKind ?? currentChallenge.kind;

    persistProgress(
      updateAfterChallenge(progress, currentChallenge.passage, currentChallenge.target, score, kind),
    );
    setLessonResults((results) => ({
      ...results,
      [currentChallenge.id]: {
        passageId: currentChallenge.passage.id,
        score,
        masteryScore: scoreMasteryAnswer(answer, currentChallenge.answer, currentChallenge.target),
        answer,
        expected: currentChallenge.answer,
        kind,
        target: currentChallenge.target,
      },
    }));
    setFeedback({
      score,
      answer,
      expected: currentChallenge.answer,
      target: currentChallenge.target,
      kind,
    });
  }

  function scoreAndComplete(answer: string, resultKind?: ChallengeKind) {
    if (!currentChallenge) return;
    completeChallenge(scoreAnswer(answer, currentChallenge.answer, currentChallenge.target), answer, resultKind);
  }

  function nextChallenge() {
    if (challengeIndex < challenges.length - 1) {
      setChallengeIndex((index) => index + 1);
      setFeedback(null);
      return false;
    }

    const results = Object.values(lessonResults);
    const practicedPassageIds = Array.from(new Set(challenges.map((challenge) => challenge.passage.id)));
    let lessonProgress = progress;

    for (const passageId of practicedPassageIds) {
      const passage = getPassageById(passageId);
      if (passage) {
        lessonProgress = finalizeLessonMastery(lessonProgress, passage, results);
      }
    }

    if (activeStep) {
      lessonProgress = finalizeStepProgress(lessonProgress, activeStep, results);
    }

    persistProgress(recordPracticeSession(lessonProgress));
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  }

  return {
    activePassage,
    activePracticeLabel,
    activeStep,
    challenges,
    currentChallenge,
    challengeIndex,
    feedback,
    lessonPercent,
    startLesson,
    startPathStep,
    startQuickReview,
    scoreAndComplete,
    nextChallenge,
  };
}
