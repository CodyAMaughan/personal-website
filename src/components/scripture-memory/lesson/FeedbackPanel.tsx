import { challengePassThreshold, missingWords } from "../learning";
import type { ChallengeFeedback } from "../types";
import { classNames } from "../ui";

export function FeedbackPanel({
  feedback,
  isFinal,
  onNext,
}: {
  feedback: ChallengeFeedback;
  isFinal: boolean;
  onNext: () => void;
}) {
  const percent = Math.round(feedback.score * 100);
  const needed = Math.round(challengePassThreshold(feedback.kind) * 100);
  const passed = feedback.score >= challengePassThreshold(feedback.kind);
  const missing = missingWords(feedback.answer, feedback.expected).slice(0, 16);

  return (
    <article
      className={classNames(
        "grid gap-5 rounded-lg border p-5 sm:p-7",
        passed ? "border-emerald-300/40 bg-emerald-300/10" : "border-amber-300/40 bg-amber-300/10",
      )}
    >
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
          {passed ? "Good" : "Keep going"}
        </p>
        <h2 className="text-3xl font-bold text-white">{percent}% Match</h2>
        <p className="mt-2 text-sm font-bold text-white/55">{needed}% needed for this mode</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Your answer
          </p>
          <p className="text-base leading-7 text-white/75">{feedback.answer || "No answer"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Expected
          </p>
          <p className="text-base leading-7 text-white/85">{feedback.expected}</p>
        </div>
      </div>

      {missing.length > 0 && feedback.target !== "reference" && (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Words to watch
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm font-bold text-white/75"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 text-base font-bold text-black transition hover:bg-emerald-100"
      >
        {isFinal ? "Finish Lesson" : "Next"}
      </button>
    </article>
  );
}
