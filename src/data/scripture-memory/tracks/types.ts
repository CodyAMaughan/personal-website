import type { ScriptureCourseId } from "../../scriptureMemory";

export type PathStepKind = "new" | "review" | "quiz";

export interface ScripturePathStep {
  id: string;
  trackId: string;
  kind: PathStepKind;
  order: number;
  segment: number;
  title: string;
  subtitle: string;
  passageIds: string[];
}

export interface ScriptureTrack {
  id: string;
  parentId: "doctrinal-mastery";
  courseId: ScriptureCourseId;
  title: string;
  shortTitle: string;
  description: string;
  passageIds: string[];
  steps: ScripturePathStep[];
}
