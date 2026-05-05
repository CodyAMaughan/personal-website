import { useEffect, useState } from "react";
import type { Challenge } from "../types";
import { ChallengePanel } from "./ChallengePanel";
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
    <ChallengePanel
      actions={
        <CheckButton
          disabled={selectedWords.length === 0 || availableWords.length > 0}
          onClick={() => onComplete(selectedWords.map((word) => word.text).join(" "))}
        />
      }
    >
      <ChallengeHeader challenge={challenge} />
      <WordBankInput
        availableWords={availableWords}
        selectedWords={selectedWords}
        onAvailableWordsChange={setAvailableWords}
        onSelectedWordsChange={setSelectedWords}
      />
    </ChallengePanel>
  );
}
