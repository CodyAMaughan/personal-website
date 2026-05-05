import type { ScripturePassage } from "../../data/scriptureMemory";

export type MasteryTarget = "reference" | "keyPhrase" | "passage";

export type ChallengeKind =
  | "read"
  | "choice"
  | "fillBlank"
  | "wordBank"
  | "type"
  | "voice";

export interface Challenge {
  id: string;
  kind: ChallengeKind;
  target: MasteryTarget;
  passage: ScripturePassage;
  prompt: string;
  answer: string;
  options?: string[];
  displayText?: string;
  blankedText?: string;
  chunkVerse?: string;
}

export interface ChallengeResult {
  passageId: string;
  target: MasteryTarget;
  kind: ChallengeKind;
  score: number;
  masteryScore?: number;
  answer?: string;
  expected?: string;
}

export type AppScreen = "home" | "paths" | "path" | "stats" | "library" | "lesson";

export interface ChallengeFeedback {
  score: number;
  answer: string;
  expected: string;
  target: MasteryTarget;
  kind: ChallengeKind;
}

export interface PracticeLabel {
  title: string;
  subtitle: string;
}

export interface PassageProgress {
  passageId: string;
  referenceMastery: number;
  keyPhraseMastery: number;
  passageMastery: number;
  attempts: number;
  correct: number;
  intervalDays: number;
  dueAt?: string;
  lastPracticedAt?: string;
}

export interface PathStepProgress {
  stepId: string;
  bestScore: number;
  attempts: number;
  completed: boolean;
  lastPracticedAt?: string;
}

export interface AppProgress {
  version: 1;
  streak: number;
  lastPracticeDate?: string;
  totalSessions: number;
  passages: Record<string, PassageProgress>;
  steps: Record<string, PathStepProgress>;
}

export interface VoiceAttempt {
  transcript: string;
  score: number;
  supported: boolean;
  error?: string;
}

export type ReadAloudVoice = "female" | "male";

export interface AppSettings {
  voiceEnabled: boolean;
  readAloudVoice: ReadAloudVoice;
  selectedPlanId?: string;
  selectedTrackId?: string;
}
