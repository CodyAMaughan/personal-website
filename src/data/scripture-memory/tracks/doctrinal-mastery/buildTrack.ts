import { SCRIPTURE_PASSAGES, type ScriptureCourseId } from "../../../scriptureMemory";
import type { ScripturePathStep, ScriptureTrack } from "../types";

interface TrackInput {
  id: string;
  courseId: ScriptureCourseId;
  title: string;
  shortTitle: string;
  description: string;
}

export function buildDoctrinalMasteryTrack(input: TrackInput): ScriptureTrack {
  const passages = SCRIPTURE_PASSAGES.filter((passage) => passage.courseId === input.courseId);
  const steps: ScripturePathStep[] = [];

  for (let index = 0; index < passages.length; index += 3) {
    const segment = Math.floor(index / 3) + 1;
    const segmentPassages = passages.slice(index, index + 3);

    segmentPassages.forEach((passage, passageIndex) => {
      steps.push({
        id: `${input.id}:new:${segment}:${passageIndex + 1}`,
        trackId: input.id,
        kind: "new",
        order: steps.length + 1,
        segment,
        title: passage.reference,
        subtitle: "New scripture",
        passageIds: [passage.id],
      });
    });

    const references = segmentPassages.map((passage) => passage.reference).join(", ");
    steps.push({
      id: `${input.id}:review:${segment}`,
      trackId: input.id,
      kind: "review",
      order: steps.length + 1,
      segment,
      title: `Review ${segment}`,
      subtitle: references,
      passageIds: segmentPassages.map((passage) => passage.id),
    });
    steps.push({
      id: `${input.id}:quiz:${segment}`,
      trackId: input.id,
      kind: "quiz",
      order: steps.length + 1,
      segment,
      title: `Quiz ${segment}`,
      subtitle: "Score 80% or higher to unlock the next set",
      passageIds: segmentPassages.map((passage) => passage.id),
    });
  }

  return {
    ...input,
    parentId: "doctrinal-mastery",
    passageIds: passages.map((passage) => passage.id),
    steps,
  };
}
