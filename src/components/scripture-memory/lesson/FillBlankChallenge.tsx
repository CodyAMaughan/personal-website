import { useState } from "react";
import type { Challenge } from "../types";
import { classNames } from "../ui";
import { ChallengeHeader } from "./ChallengeHeader";
import { CheckButton } from "./CheckButton";

export function FillBlankChallenge({
  challenge,
  onComplete,
}: {
  challenge: Challenge;
  onComplete: (answer: string) => void;
}) {
  const [choice, setChoice] = useState("");

  return (
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <p className="rounded-lg border border-white/10 bg-black/25 p-4 text-lg leading-8 text-white/85">
        {challenge.blankedText}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {challenge.options?.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setChoice(option)}
            className={classNames(
              "min-h-12 rounded-lg border px-3 text-sm font-bold transition",
              choice === option
                ? "border-emerald-300 bg-emerald-300/15 text-white"
                : "border-white/10 bg-black/20 text-white/75 hover:border-white/30 hover:bg-white/[0.06]",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      <CheckButton disabled={!choice} onClick={() => onComplete(choice)} />
    </article>
  );
}
