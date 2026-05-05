import { BookOpen, Check, RotateCcw, Trophy } from "lucide-react";
import type { ScripturePathStep } from "../../../data/scripture-memory/tracks";

export function pathStepLabel(kind: ScripturePathStep["kind"]) {
  if (kind === "review") return "Review";
  if (kind === "quiz") return "Quiz";
  return "New";
}

export function pathStepIcon(kind: ScripturePathStep["kind"], complete: boolean) {
  if (complete) return <Check className="h-5 w-5" />;
  if (kind === "review") return <RotateCcw className="h-5 w-5" />;
  if (kind === "quiz") return <Trophy className="h-5 w-5" />;
  return <BookOpen className="h-5 w-5" />;
}
