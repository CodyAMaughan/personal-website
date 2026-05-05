import { SCRIPTURE_PASSAGES } from "../../../data/scriptureMemory";
import {
  combinedMastery,
  getPassageProgress,
  isMastered,
} from "../learning";
import type { AppProgress } from "../types";

export function MasteryBreakdown({ progress }: { progress: AppProgress }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <h2 className="mb-4 text-lg font-bold text-white">Passage Mastery</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {SCRIPTURE_PASSAGES.map((passage) => {
          const passageProgress = getPassageProgress(passage.id, progress);
          return (
            <div key={passage.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{passage.reference}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                    {passage.course}
                  </p>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-white/70">
                  {isMastered(passageProgress) ? "Mastered" : `${combinedMastery(passageProgress)}%`}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-white/55">
                <span>Ref {passageProgress.referenceMastery}%</span>
                <span>Phrase {passageProgress.keyPhraseMastery}%</span>
                <span>Passage {passageProgress.passageMastery}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
