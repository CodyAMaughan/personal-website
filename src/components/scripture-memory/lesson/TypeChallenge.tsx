import { useState } from "react";
import type { Challenge } from "../types";
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
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <textarea
        value={typed}
        onChange={(event) => setTyped(event.currentTarget.value)}
        rows={challenge.target === "reference" ? 2 : 8}
        placeholder={challenge.target === "reference" ? "Type the reference" : "Type from memory"}
        className="w-full resize-y rounded-lg border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60"
      />
      <CheckButton disabled={!typed.trim()} onClick={() => onComplete(typed)} />
    </article>
  );
}
