import type { Challenge } from "../types";
import { getChurchAudioUrl } from "../../../data/scripture-memory/churchAudioManifest";
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
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <div className="rounded-lg border border-white/10 bg-black/25 p-4 text-lg leading-8 text-white/85">
        {challenge.passage.chunks.map((chunk) => (
          <p key={chunk.verse} className="mb-4 last:mb-0">
            <span className="mr-2 align-super text-xs font-bold text-emerald-200">
              {chunk.verse}
            </span>
            {chunk.text}
          </p>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-[auto_1fr]">
        <ReadAloudButton text={challenge.answer} audioSrc={audioUrl} />
        <button
          type="button"
          onClick={() => onComplete(challenge.answer)}
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-300 px-5 text-base font-bold text-black transition hover:bg-emerald-200"
        >
          I'm Ready
        </button>
      </div>
    </article>
  );
}
