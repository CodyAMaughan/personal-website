import type { Challenge } from "../types";

export function ChallengeHeader({ challenge }: { challenge: Challenge }) {
  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
        {challenge.target === "reference"
          ? "Reference"
          : challenge.target === "keyPhrase"
            ? "Key Phrase"
            : "Passage"}
      </div>
      <h2 className="whitespace-pre-line text-xl font-bold leading-tight text-white sm:text-3xl">
        {challenge.prompt}
      </h2>
    </div>
  );
}
