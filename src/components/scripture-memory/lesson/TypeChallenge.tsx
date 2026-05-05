import { useState } from "react";
import type { Challenge } from "../types";
import { classNames } from "../ui";
import { ChallengePanel } from "./ChallengePanel";
import { ChallengeHeader } from "./ChallengeHeader";
import { CheckButton } from "./CheckButton";

export function TypeChallenge({
  challenge,
  onComplete,
}: {
  challenge: Challenge;
  onComplete: (answer: string) => void;
}) {
  const [typed, setTyped] = useState("");

  return (
    <ChallengePanel actions={<CheckButton disabled={!typed.trim()} onClick={() => onComplete(typed)} />}>
      <ChallengeHeader challenge={challenge} />
      <textarea
        value={typed}
        onChange={(event) => setTyped(event.currentTarget.value)}
        placeholder={challenge.target === "reference" ? "Type the reference" : "Type from memory"}
        className={classNames(
          "w-full resize-none rounded-lg border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60",
          challenge.target === "reference" ? "h-24" : "h-[min(34dvh,16rem)]",
        )}
      />
    </ChallengePanel>
  );
}
