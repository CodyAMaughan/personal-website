import { useState } from "react";
import type { Challenge } from "../types";
import { classNames } from "../ui";
import { ChallengeHeader } from "./ChallengeHeader";
import { CheckButton } from "./CheckButton";

export function ChoiceChallenge({
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
      <div className="grid gap-3">
        {challenge.options?.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setChoice(option)}
            className={classNames(
              "min-h-14 rounded-lg border p-4 text-left text-base font-bold leading-6 transition",
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
