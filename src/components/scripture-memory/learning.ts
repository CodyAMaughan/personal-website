import { SCRIPTURE_PASSAGES, type ScripturePassage } from "../../data/scriptureMemory";
import { DOCTRINAL_MASTERY_TRACKS, type ScripturePathStep, type ScriptureTrack } from "../../data/scripture-memory/tracks";
import type {
  AppProgress,
  Challenge,
  ChallengeKind,
  ChallengeResult,
  MasteryTarget,
  PassageProgress,
  PathStepProgress,
} from "./types";

export const PROGRESS_KEY = "scripture-memory:v1:progress";
export const SETTINGS_KEY = "scripture-memory:v1:settings";

export const emptyProgress: AppProgress = {
  version: 1,
  streak: 0,
  totalSessions: 0,
  passages: {},
  steps: {},
};

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getPassageProgress(passageId: string, progress: AppProgress): PassageProgress {
  return (
    progress.passages[passageId] ?? {
      passageId,
      referenceMastery: 0,
      keyPhraseMastery: 0,
      passageMastery: 0,
      attempts: 0,
      correct: 0,
      intervalDays: 0,
    }
  );
}

export function getStepProgress(stepId: string, progress: AppProgress): PathStepProgress {
  return (
    progress.steps[stepId] ?? {
      stepId,
      bestScore: 0,
      attempts: 0,
      completed: false,
    }
  );
}

export function getPassageById(passageId: string) {
  return SCRIPTURE_PASSAGES.find((passage) => passage.id === passageId);
}

export function combinedMastery(progress: PassageProgress) {
  return Math.round(
    (progress.referenceMastery + progress.keyPhraseMastery + progress.passageMastery) / 3,
  );
}

export function isMastered(progress: PassageProgress) {
  return (
    progress.referenceMastery >= 90 &&
    progress.keyPhraseMastery >= 90 &&
    progress.passageMastery >= 90
  );
}

export function isDue(progress: PassageProgress, now = new Date()) {
  if (!progress.dueAt || progress.attempts === 0) return false;
  return new Date(progress.dueAt).getTime() <= now.getTime();
}

export function unitProgress(unit: number, progress: AppProgress) {
  const passages = SCRIPTURE_PASSAGES.filter((passage) => passage.unit === unit);
  const score = passages.reduce(
    (sum, passage) => sum + combinedMastery(getPassageProgress(passage.id, progress)),
    0,
  );

  return passages.length ? Math.round(score / passages.length) : 0;
}

export function isPathStepComplete(step: ScripturePathStep, progress: AppProgress) {
  const stepProgress = getStepProgress(step.id, progress);
  if (step.kind === "quiz") return stepProgress.bestScore >= 80;
  if (stepProgress.completed && stepProgress.bestScore >= 80) return true;

  if (step.kind === "new") {
    return step.passageIds.every(
      (passageId) => combinedMastery(getPassageProgress(passageId, progress)) >= 80,
    );
  }

  return false;
}

export function isPathStepUnlocked(track: ScriptureTrack, step: ScripturePathStep, progress: AppProgress) {
  const stepIndex = track.steps.findIndex((candidate) => candidate.id === step.id);
  if (stepIndex <= 0) return true;

  return track.steps.slice(0, stepIndex).every((candidate) => isPathStepComplete(candidate, progress));
}

export function getNextTrackStep(track: ScriptureTrack, progress: AppProgress) {
  return (
    track.steps.find(
      (step) => isPathStepUnlocked(track, step, progress) && !isPathStepComplete(step, progress),
    ) ??
    track.steps.find((step) => isPathStepUnlocked(track, step, progress)) ??
    track.steps[0]
  );
}

export function getDefaultTrack(progress: AppProgress) {
  return (
    DOCTRINAL_MASTERY_TRACKS.find((track) => {
      const summary = getTrackProgress(track, progress);
      return summary.completedSteps < summary.totalSteps;
    }) ?? DOCTRINAL_MASTERY_TRACKS[0]
  );
}

export function getTrackProgress(track: ScriptureTrack, progress: AppProgress) {
  const passages = track.passageIds
    .map((passageId) => getPassageById(passageId))
    .filter((passage): passage is ScripturePassage => Boolean(passage));
  const completedSteps = track.steps.filter((step) => isPathStepComplete(step, progress)).length;
  const masteredPassages = passages.filter((passage) =>
    isMastered(getPassageProgress(passage.id, progress)),
  ).length;
  const averageMastery = passages.length
    ? Math.round(
        passages.reduce(
          (sum, passage) => sum + combinedMastery(getPassageProgress(passage.id, progress)),
          0,
        ) / passages.length,
      )
    : 0;

  return {
    completedSteps,
    totalSteps: track.steps.length,
    percent: track.steps.length ? Math.round((completedSteps / track.steps.length) * 100) : 0,
    masteredPassages,
    totalPassages: passages.length,
    averageMastery,
    currentStep: getNextTrackStep(track, progress),
  };
}

export function getPlanProgress(progress: AppProgress) {
  const totals = DOCTRINAL_MASTERY_TRACKS.reduce(
    (summary, track) => {
      const trackProgress = getTrackProgress(track, progress);
      summary.completedSteps += trackProgress.completedSteps;
      summary.totalSteps += trackProgress.totalSteps;
      summary.masteredPassages += trackProgress.masteredPassages;
      summary.totalPassages += trackProgress.totalPassages;
      summary.averageMastery += trackProgress.averageMastery;
      return summary;
    },
    {
      completedSteps: 0,
      totalSteps: 0,
      masteredPassages: 0,
      totalPassages: 0,
      averageMastery: 0,
    },
  );

  return {
    ...totals,
    percent: totals.totalSteps ? Math.round((totals.completedSteps / totals.totalSteps) * 100) : 0,
    averageMastery: Math.round(totals.averageMastery / DOCTRINAL_MASTERY_TRACKS.length),
  };
}

export function nextPassage(progress: AppProgress) {
  const due = SCRIPTURE_PASSAGES.find((passage) =>
    isDue(getPassageProgress(passage.id, progress)),
  );

  if (due) return due;

  return (
    SCRIPTURE_PASSAGES.find((passage) => {
      const passageProgress = getPassageProgress(passage.id, progress);
      return passageProgress.attempts === 0 || combinedMastery(passageProgress) < 80;
    }) ?? SCRIPTURE_PASSAGES[0]
  );
}

export function loadProgress(): AppProgress {
  if (typeof window === "undefined") return emptyProgress;

  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as AppProgress;
    if (parsed.version !== 1 || typeof parsed.passages !== "object") return emptyProgress;

    return {
      ...emptyProgress,
      ...parsed,
      passages: parsed.passages ?? {},
      steps: parsed.steps ?? {},
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: AppProgress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–-]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeMasteryText(value: string) {
  return value
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–-]/g, " ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeReference(value: string) {
  return normalizeText(value)
    .replace(/\bdoctrine and covenants\b/g, "dc")
    .replace(/\bd and c\b/g, "dc")
    .replace(/\bd c\b/g, "dc")
    .replace(/\bjoseph smith history\b/g, "jsh")
    .replace(/\bjs h\b/g, "jsh")
    .replace(/\bfirst\b/g, "1")
    .replace(/\bsecond\b/g, "2")
    .replace(/\bthird\b/g, "3")
    .replace(/\s+/g, "");
}

export function tokenize(value: string) {
  return normalizeText(value).split(" ").filter(Boolean);
}

export function tokenizeMastery(value: string) {
  return normalizeMasteryText(value).split(" ").filter(Boolean);
}

function tokenSimilarity(actualTokens: string[], expectedTokens: string[]) {
  if (expectedTokens.length === 0) return 0;
  if (
    actualTokens.length === expectedTokens.length &&
    actualTokens.every((token, index) => token === expectedTokens[index])
  ) {
    return 1;
  }

  const rows = expectedTokens.length + 1;
  const cols = actualTokens.length + 1;
  const table = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      table[row][col] =
        expectedTokens[row - 1] === actualTokens[col - 1]
          ? table[row - 1][col - 1] + 1
          : Math.max(table[row - 1][col], table[row][col - 1]);
    }
  }

  return table[expectedTokens.length][actualTokens.length] / expectedTokens.length;
}

export function scoreAnswer(answer: string, expected: string, target: MasteryTarget) {
  if (target === "reference") {
    return normalizeReference(answer) === normalizeReference(expected) ? 1 : 0;
  }

  return tokenSimilarity(tokenize(answer), tokenize(expected));
}

export function scoreMasteryAnswer(answer: string, expected: string, target: MasteryTarget) {
  if (target === "reference") {
    return scoreAnswer(answer, expected, target);
  }

  return tokenSimilarity(tokenizeMastery(answer), tokenizeMastery(expected));
}

export function missingWords(answer: string, expected: string) {
  const actualTokens = tokenizeMastery(answer);
  const expectedTokens = tokenizeMastery(expected);
  const rows = expectedTokens.length + 1;
  const cols = actualTokens.length + 1;
  const table = Array.from({ length: rows }, () => Array<number>(cols).fill(0));

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      table[row][col] =
        expectedTokens[row - 1] === actualTokens[col - 1]
          ? table[row - 1][col - 1] + 1
          : Math.max(table[row - 1][col], table[row][col - 1]);
    }
  }

  const matchedExpectedIndexes = new Set<number>();
  let row = expectedTokens.length;
  let col = actualTokens.length;

  while (row > 0 && col > 0) {
    if (expectedTokens[row - 1] === actualTokens[col - 1]) {
      matchedExpectedIndexes.add(row - 1);
      row -= 1;
      col -= 1;
    } else if (table[row - 1][col] >= table[row][col - 1]) {
      row -= 1;
    } else {
      col -= 1;
    }
  }

  return expectedTokens.filter((_, index) => !matchedExpectedIndexes.has(index));
}

function optionSet(correct: string, pool: string[], count = 4) {
  const options = [correct];
  for (const option of pool) {
    if (normalizeText(option) !== normalizeText(correct) && !options.includes(option)) {
      options.push(option);
    }
    if (options.length === count) break;
  }

  return rotate(options, correct.length % options.length);
}

function rotate<T>(items: T[], amount: number) {
  if (items.length === 0) return items;
  const offset = amount % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function randomize<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function nearbyPassages(passage: ScripturePassage) {
  const sameCourse = SCRIPTURE_PASSAGES.filter(
    (candidate) => candidate.courseId === passage.courseId && candidate.id !== passage.id,
  );
  const before = sameCourse.filter((candidate) => candidate.order < passage.order).reverse();
  const after = sameCourse.filter((candidate) => candidate.order > passage.order);

  return [...after, ...before, ...SCRIPTURE_PASSAGES.filter((candidate) => candidate.id !== passage.id)];
}

function buildBlank(text: string) {
  const words = text.split(/\s+/).filter(Boolean);
  const candidates = words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => normalizeText(word).length > 4);
  const chosen = candidates[Math.min(2, candidates.length - 1)] ?? { word: words[0] ?? "", index: 0 };
  const cleanAnswer = chosen.word.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
  const blanked = words
    .map((word, index) => (index === chosen.index ? "_____" : word))
    .join(" ");

  return { answer: cleanAnswer, blanked };
}

export function buildChallenges(passage: ScripturePassage): Challenge[] {
  const nearby = nearbyPassages(passage);
  const firstChunk = passage.chunks[0]?.text ?? passage.text;
  const bankText = passage.text;
  const blank = buildBlank(passage.keyPhrase.length > 25 ? passage.keyPhrase : firstChunk);
  const challenges: Challenge[] = [
    {
      id: `${passage.id}:read`,
      kind: "read",
      target: "passage",
      passage,
      prompt: "Read it once. When it feels familiar, keep moving.",
      answer: passage.text,
      displayText: passage.text,
    },
    {
      id: `${passage.id}:key-choice`,
      kind: "choice",
      target: "keyPhrase",
      passage,
      prompt: `Which key phrase belongs to ${passage.reference}?`,
      answer: passage.keyPhrase,
      options: optionSet(
        passage.keyPhrase,
        nearby.map((candidate) => candidate.keyPhrase),
      ),
    },
    {
      id: `${passage.id}:reference-choice`,
      kind: "choice",
      target: "reference",
      passage,
      prompt: `Which reference matches this phrase?\n${passage.keyPhrase}`,
      answer: passage.reference,
      options: optionSet(
        passage.reference,
        nearby.map((candidate) => candidate.reference),
      ),
    },
    {
      id: `${passage.id}:fill`,
      kind: "fillBlank",
      target: "keyPhrase",
      passage,
      prompt: "Fill in the missing word.",
      answer: blank.answer,
      blankedText: blank.blanked,
      options: optionSet(
        blank.answer,
        [...tokenize(passage.text), ...tokenize(passage.keyPhrase)].filter(
          (word) => word !== normalizeText(blank.answer),
        ),
      ),
    },
    {
      id: `${passage.id}:bank`,
      kind: "wordBank",
      target: "passage",
      passage,
      prompt: "Arrange the whole passage in order.",
      answer: bankText,
    },
    {
      id: `${passage.id}:type-reference`,
      kind: "type",
      target: "reference",
      passage,
      prompt: `Type the reference for:\n${passage.keyPhrase}`,
      answer: passage.reference,
    },
  ];

  for (const chunk of passage.chunks) {
    challenges.push({
      id: `${passage.id}:type-${chunk.verse}`,
      kind: "type",
      target: "passage",
      passage,
      prompt:
        passage.chunks.length > 1
          ? `Type verse ${chunk.verse} from memory.`
          : "Type the passage from memory.",
      answer: chunk.text,
      chunkVerse: chunk.verse,
    });
    challenges.push({
      id: `${passage.id}:voice-${chunk.verse}`,
      kind: "voice",
      target: "passage",
      passage,
      prompt:
        passage.chunks.length > 1
          ? `Recite verse ${chunk.verse}.`
          : "Recite the passage.",
      answer: chunk.text,
      chunkVerse: chunk.verse,
    });
  }

  if (passage.chunks.length > 1) {
    challenges.push({
      id: `${passage.id}:voice-full`,
      kind: "voice",
      target: "passage",
      passage,
      prompt: "Bonus: recite the full passage.",
      answer: passage.text,
    });
  }

  return challenges;
}

function challengesByIds(passage: ScripturePassage, ids: string[]) {
  const challengeMap = new Map(buildChallenges(passage).map((challenge) => [challenge.id, challenge]));
  return ids.map((id) => challengeMap.get(`${passage.id}:${id}`)).filter((challenge): challenge is Challenge => Boolean(challenge));
}

function reviewChallengePool(passages: ScripturePassage[]): Challenge[] {
  return passages.flatMap((passage) => {
    const firstChunk = passage.chunks[0]?.verse;
    return [
      ...challengesByIds(passage, [
        "key-choice",
        "reference-choice",
        "fill",
        "type-reference",
        "bank",
        ...(firstChunk ? [`type-${firstChunk}`, `voice-${firstChunk}`] : []),
      ]),
    ];
  });
}

export function buildReviewChallenges(passages: ScripturePassage[], questionCount = 12): Challenge[] {
  const pool = reviewChallengePool(passages);
  if (pool.length === 0) return [];

  const selected: Challenge[] = [];
  let cycle = 0;

  while (selected.length < questionCount) {
    for (const challenge of randomize(pool)) {
      selected.push({
        ...challenge,
        id: `${challenge.id}:review-${cycle}-${selected.length}`,
      });

      if (selected.length >= questionCount) break;
    }
    cycle += 1;
  }

  return selected;
}

export function buildQuizChallenges(passages: ScripturePassage[]): Challenge[] {
  return passages.flatMap((passage) => {
    const firstChunk = passage.chunks[0]?.verse;
    return challengesByIds(
      passage,
      [
        "reference-choice",
        "type-reference",
        "fill",
        ...(firstChunk ? [`type-${firstChunk}`, `voice-${firstChunk}`] : []),
      ],
    );
  });
}

export function getPracticedPassages(progress: AppProgress, track?: ScriptureTrack) {
  const trackPassageIds = new Set(track?.passageIds ?? SCRIPTURE_PASSAGES.map((passage) => passage.id));
  const completedNewStepPassageIds = new Set(
    DOCTRINAL_MASTERY_TRACKS.flatMap((candidateTrack) =>
      candidateTrack.steps
        .filter((step) => step.kind === "new" && isPathStepComplete(step, progress))
        .flatMap((step) => step.passageIds),
    ),
  );

  return SCRIPTURE_PASSAGES.filter((passage) => {
    if (!trackPassageIds.has(passage.id)) return false;
    const passageProgress = getPassageProgress(passage.id, progress);
    return passageProgress.attempts > 0 || completedNewStepPassageIds.has(passage.id);
  });
}

function getCumulativeReviewPassages(step: ScripturePathStep, progress: AppProgress) {
  const track = DOCTRINAL_MASTERY_TRACKS.find((candidate) => candidate.id === step.trackId);
  if (!track) {
    return step.passageIds
      .map((passageId) => getPassageById(passageId))
      .filter((passage): passage is ScripturePassage => Boolean(passage));
  }

  const candidateIds = new Set<string>();
  for (const candidateStep of track.steps) {
    if (candidateStep.order > step.order) break;
    if (candidateStep.kind === "new" && isPathStepComplete(candidateStep, progress)) {
      candidateStep.passageIds.forEach((passageId) => candidateIds.add(passageId));
    }
  }

  step.passageIds.forEach((passageId) => candidateIds.add(passageId));

  return Array.from(candidateIds)
    .map((passageId) => getPassageById(passageId))
    .filter((passage): passage is ScripturePassage => Boolean(passage));
}

export function buildQuickReviewChallenges(progress: AppProgress, track?: ScriptureTrack) {
  const passages = getPracticedPassages(progress, track);
  const questionCount = 12 + Math.floor(Math.random() * 4);

  return buildReviewChallenges(passages, questionCount);
}

export function buildPathStepChallenges(step: ScripturePathStep, progress?: AppProgress): Challenge[] {
  const passages = step.passageIds
    .map((passageId) => getPassageById(passageId))
    .filter((passage): passage is ScripturePassage => Boolean(passage));

  if (step.kind === "review") {
    return buildReviewChallenges(progress ? getCumulativeReviewPassages(step, progress) : passages, 12);
  }
  if (step.kind === "quiz") return buildQuizChallenges(passages);

  return passages.flatMap((passage) => buildChallenges(passage));
}

export function challengePassThreshold(kind: ChallengeKind) {
  if (kind === "voice") return 0.8;
  if (kind === "type" || kind === "wordBank") return 0.9;
  return 1;
}

export function isChallengePassed(kind: ChallengeKind, score: number) {
  return score >= challengePassThreshold(kind);
}

export function updateAfterChallenge(
  progress: AppProgress,
  passage: ScripturePassage,
  target: MasteryTarget,
  score: number,
  kind: ChallengeKind,
) {
  const current = getPassageProgress(passage.id, progress);
  const targetKey = `${target}Mastery` as const;
  const bump = score >= 0.92 ? 14 : score >= 0.78 ? 9 : score >= 0.55 ? 4 : 1;
  const nextTarget = Math.min(100, Math.max(current[targetKey], current[targetKey] + bump));
  const currentInterval = current.intervalDays || 0.5;
  const intervalDays =
    score < 0.6
      ? 0.25
      : score < 0.82
        ? Math.max(0.5, currentInterval)
        : Math.min(30, Math.max(1, currentInterval * 1.8));
  const dueAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...progress,
    passages: {
      ...progress.passages,
      [passage.id]: {
        ...current,
        [targetKey]: nextTarget,
        attempts: current.attempts + 1,
        correct: current.correct + (isChallengePassed(kind, score) ? 1 : 0),
        intervalDays,
        dueAt,
        lastPracticedAt: new Date().toISOString(),
      },
    },
  };
}

function lessonScoreToMastery(scores: ChallengeResult[]) {
  if (scores.length === 0) return undefined;
  const masteryScores = scores.map((score) => ({
    ...score,
    score: score.masteryScore ?? score.score,
  }));
  if (masteryScores.every((score) => isChallengePassed(score.kind, score.score))) return 100;

  const average = masteryScores.reduce((sum, score) => sum + score.score, 0) / masteryScores.length;
  if (average >= 0.92 && masteryScores.every((score) => score.score >= 0.78)) return 90;

  return Math.round(average * 100);
}

export function finalizeLessonMastery(
  progress: AppProgress,
  passage: ScripturePassage,
  scores: ChallengeResult[],
) {
  const current = getPassageProgress(passage.id, progress);
  const byTarget: Record<MasteryTarget, ChallengeResult[]> = {
    reference: [],
    keyPhrase: [],
    passage: [],
  };

  for (const score of scores.filter((result) => result.passageId === passage.id)) {
    byTarget[score.target].push(score);
  }

  const referenceMastery = lessonScoreToMastery(byTarget.reference);
  const keyPhraseMastery = lessonScoreToMastery(byTarget.keyPhrase);
  const passageMastery = lessonScoreToMastery(byTarget.passage);
  const nextProgress: PassageProgress = {
    ...current,
    referenceMastery:
      referenceMastery === undefined
        ? current.referenceMastery
        : Math.max(current.referenceMastery, referenceMastery),
    keyPhraseMastery:
      keyPhraseMastery === undefined
        ? current.keyPhraseMastery
        : Math.max(current.keyPhraseMastery, keyPhraseMastery),
    passageMastery:
      passageMastery === undefined
        ? current.passageMastery
        : Math.max(current.passageMastery, passageMastery),
    lastPracticedAt: new Date().toISOString(),
  };

  if (isMastered(nextProgress)) {
    const intervalDays = Math.max(nextProgress.intervalDays, 7);
    nextProgress.intervalDays = intervalDays;
    nextProgress.dueAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();
  }

  return {
    ...progress,
    passages: {
      ...progress.passages,
      [passage.id]: nextProgress,
    },
  };
}

export function finalizeStepProgress(
  progress: AppProgress,
  step: ScripturePathStep,
  results: ChallengeResult[],
) {
  const current = getStepProgress(step.id, progress);
  const scoredResults = results.filter((result) => result.score >= 0);
  const score = scoredResults.length
    ? Math.round(
        (scoredResults.reduce((sum, result) => sum + result.score, 0) / scoredResults.length) * 100,
      )
    : 100;
  const completed = score >= 80;

  return {
    ...progress,
    steps: {
      ...progress.steps,
      [step.id]: {
        ...current,
        bestScore: Math.max(current.bestScore, score),
        attempts: current.attempts + 1,
        completed: current.completed || completed,
        lastPracticedAt: new Date().toISOString(),
      },
    },
  };
}

export function recordPracticeSession(progress: AppProgress) {
  const today = getTodayKey();
  const yesterday = getTodayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const streak =
    progress.lastPracticeDate === today
      ? progress.streak
      : progress.lastPracticeDate === yesterday
        ? progress.streak + 1
        : 1;

  return {
    ...progress,
    streak,
    lastPracticeDate: today,
    totalSessions: progress.totalSessions + 1,
  };
}
