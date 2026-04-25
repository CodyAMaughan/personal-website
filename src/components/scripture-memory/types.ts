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

export interface AppProgress {
  version: 1;
  streak: number;
  lastPracticeDate?: string;
  totalSessions: number;
  passages: Record<string, PassageProgress>;
}

export interface VoiceAttempt {
  transcript: string;
  score: number;
  supported: boolean;
  error?: string;
}

export interface AppSettings {
  voiceEnabled: boolean;
}
