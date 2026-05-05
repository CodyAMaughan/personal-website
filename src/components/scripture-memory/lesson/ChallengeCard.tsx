import type { AppSettings, Challenge, ChallengeKind } from "../types";
import { ChoiceChallenge } from "./ChoiceChallenge";
import { FillBlankChallenge } from "./FillBlankChallenge";
import { ReadChallenge } from "./ReadChallenge";
import { TypeChallenge } from "./TypeChallenge";
import { VoiceChallenge } from "./VoiceChallenge";
import { WordBankChallenge } from "./WordBankChallenge";

export function ChallengeCard({
  challenge,
  settings,
  onComplete,
}: {
  challenge: Challenge;
  settings: AppSettings;
  onComplete: (answer: string, resultKind?: ChallengeKind) => void;
}) {
  if (challenge.kind === "read") {
    return (
      <ReadChallenge
        challenge={challenge}
        readAloudVoice={settings.readAloudVoice}
        onComplete={onComplete}
      />
    );
  }

  if (challenge.kind === "choice") {
    return <ChoiceChallenge challenge={challenge} onComplete={onComplete} />;
  }

  if (challenge.kind === "fillBlank") {
    return <FillBlankChallenge challenge={challenge} onComplete={onComplete} />;
  }

  if (challenge.kind === "wordBank") {
    return <WordBankChallenge challenge={challenge} onComplete={onComplete} />;
  }

  if (challenge.kind === "voice") {
    return <VoiceChallenge challenge={challenge} settings={settings} onComplete={onComplete} />;
  }

  return <TypeChallenge challenge={challenge} onComplete={onComplete} />;
}
