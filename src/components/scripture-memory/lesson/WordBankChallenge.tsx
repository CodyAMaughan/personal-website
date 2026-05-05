import { useEffect, useState } from "react";
import type { Challenge } from "../types";
import { ChallengeHeader } from "./ChallengeHeader";
import { CheckButton } from "./CheckButton";
import {
  makeWordTokens,
  shuffleTokens,
  WordBankInput,
  type WordToken,
} from "./WordBankInput";

export function WordBankChallenge({
  challenge,
  onComplete,
}: {
  challenge: Challenge;
  onComplete: (answer: string) => void;
}) {
  const [selectedWords, setSelectedWords] = useState<WordToken[]>([]);
  const [availableWords, setAvailableWords] = useState<WordToken[]>([]);

  useEffect(() => {
    setSelectedWords([]);
    setAvailableWords(shuffleTokens(makeWordTokens(challenge.answer)));
  }, [challenge]);

  return (
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <WordBankInput
        availableWords={availableWords}
        selectedWords={selectedWords}
        onAvailableWordsChange={setAvailableWords}
        onSelectedWordsChange={setSelectedWords}
      />
      <CheckButton
        disabled={selectedWords.length === 0 || availableWords.length > 0}
        onClick={() => onComplete(selectedWords.map((word) => word.text).join(" "))}
      />
    </article>
  );
}
