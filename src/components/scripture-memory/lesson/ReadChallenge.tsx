import type { Challenge } from "../types";
import { getChurchAudioUrl } from "../../../data/scripture-memory/churchAudioManifest";
import { ChallengePanel } from "./ChallengePanel";
import { CheckButton } from "./CheckButton";
import { ChallengeHeader } from "./ChallengeHeader";
import { ReadAloudButton } from "./ReadAloudButton";

export function ReadChallenge({
  challenge,
  readAloudVoice,
  onComplete,
}: {
  challenge: Challenge;
  readAloudVoice: "female" | "male";
  onComplete: (answer: string) => void;
}) {
  const audioUrl = getChurchAudioUrl(challenge.passage.id, readAloudVoice);

  return (
    <ChallengePanel
      actions={
        <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
          <ReadAloudButton text={challenge.answer} audioSrc={audioUrl} />
          <CheckButton disabled={false} onClick={() => onComplete(challenge.answer)}>
            I'm Ready
          </CheckButton>
        </div>
      }
    >
      <ChallengeHeader challenge={challenge} />
      <div className="max-h-[min(42dvh,24rem)] overflow-y-auto rounded-lg border border-white/10 bg-black/25 p-4 text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
        {challenge.passage.chunks.map((chunk) => (
          <p key={chunk.verse} className="mb-4 last:mb-0">
            <span className="mr-2 align-super text-xs font-bold text-emerald-200">
              {chunk.verse}
            </span>
            {chunk.text}
          </p>
        ))}
      </div>
    </ChallengePanel>
  );
}
