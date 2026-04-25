import { SCRIPTURE_PASSAGES, type ScripturePassage } from "../../data/scriptureMemory";
import type { AppProgress, Challenge, MasteryTarget, PassageProgress } from "./types";

export const PROGRESS_KEY = "scripture-memory:v1:progress";
export const SETTINGS_KEY = "scripture-memory:v1:settings";

export const emptyProgress: AppProgress = {
  version: 1,
  streak: 0,
  totalSessions: 0,
  passages: {},
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
    .replace(/[^a-z0-9'\\s]/g, " ")
    .replace(/\b(the|a|an)\b/g, " ")
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

export function scoreAnswer(answer: string, expected: string, target: MasteryTarget) {
  if (target === "reference") {
    return normalizeReference(answer) === normalizeReference(expected) ? 1 : 0;
  }

  const actualTokens = tokenize(answer);
  const expectedTokens = tokenize(expected);
  if (expectedTokens.length === 0) return 0;
  if (normalizeText(answer) === normalizeText(expected)) return 1;

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

export function missingWords(answer: string, expected: string) {
  const actual = new Set(tokenize(answer));
  return tokenize(expected).filter((word) => !actual.has(word));
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

function nearbyPassages(passage: ScripturePassage) {
  const sameCourse = SCRIPTURE_PASSAGES.filter(
    (candidate) => candidate.courseId === passage.courseId && candidate.id !== passage.id,
  );
  const before = sameCourse.filter((candidate) => candidate.order < passage.order).reverse();
  const after = sameCourse.filter((candidate) => candidate.order > passage.order);

  return [...after, ...before, ...SCRIPTURE_PASSAGES.filter((candidate) => candidate.id !== passage.id)];
}

function excerpt(text: string, maxWords: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ");
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
  const bankText = excerpt(firstChunk, 18);
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
      prompt: "Arrange the opening words in order.",
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

export function updateAfterChallenge(
  progress: AppProgress,
  passage: ScripturePassage,
  target: MasteryTarget,
  score: number,
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
        correct: current.correct + (score >= 0.78 ? 1 : 0),
        intervalDays,
        dueAt,
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
