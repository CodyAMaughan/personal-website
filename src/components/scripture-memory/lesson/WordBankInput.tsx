export type WordToken = {
  id: string;
  text: string;
};

export function makeWordTokens(answer: string) {
  return answer
    .split(/\s+/)
    .filter(Boolean)
    .map((text, index) => ({ id: `${index}:${text}`, text }));
}

export function shuffleTokens(tokens: WordToken[]) {
  if (tokens.length === 0) return [];
  const shuffled = [...tokens];
  let seed = tokens.reduce((hash, token) => {
    for (let index = 0; index < token.id.length; index += 1) {
      hash = (hash * 31 + token.id.charCodeAt(index)) >>> 0;
    }

    return hash;
  }, 2166136261);

  function nextRandom() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(nextRandom() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  const samePositionCount = shuffled.filter((token, index) => token.id === tokens[index]?.id).length;
  if (shuffled.length > 3 && samePositionCount > shuffled.length / 3) {
    const midpoint = Math.ceil(shuffled.length / 2);
    return [...shuffled.slice(midpoint), ...shuffled.slice(0, midpoint)];
  }

  return shuffled;
}

export function WordBankInput({
  availableWords,
  selectedWords,
  onAvailableWordsChange,
  onSelectedWordsChange,
}: {
  availableWords: WordToken[];
  selectedWords: WordToken[];
  onAvailableWordsChange: (tokens: WordToken[]) => void;
  onSelectedWordsChange: (tokens: WordToken[]) => void;
}) {
  function selectWord(token: WordToken) {
    onSelectedWordsChange([...selectedWords, token]);
    onAvailableWordsChange(availableWords.filter((word) => word.id !== token.id));
  }

  function removeWord(token: WordToken) {
    onSelectedWordsChange(selectedWords.filter((word) => word.id !== token.id));
    onAvailableWordsChange([...availableWords, token]);
  }

  return (
    <div className="grid gap-4">
      <div
        data-testid="word-bank-answer"
        className="min-h-20 max-h-[min(22dvh,11rem)] overflow-y-auto rounded-lg border border-emerald-300/25 bg-emerald-300/10 p-3"
      >
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-emerald-100/70">
          <span>Answer</span>
          <span>
            {selectedWords.length}/{selectedWords.length + availableWords.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedWords.length === 0 ? (
            <span className="p-2 text-sm text-white/45">Build your answer here.</span>
          ) : (
            selectedWords.map((token) => (
              <button
                key={token.id}
                type="button"
                onClick={() => removeWord(token)}
                className="min-h-10 rounded-md bg-white px-3 text-sm font-bold text-black"
              >
                {token.text}
              </button>
            ))
          )}
        </div>
      </div>
      <div
        data-testid="word-bank-available"
        className="max-h-[min(34dvh,18rem)] overflow-y-auto rounded-lg border border-white/10 bg-black/20 p-3"
      >
        <div className="mb-3 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.14em] text-white/40">
          <span>Word Bank</span>
          <span>{availableWords.length} left</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {availableWords.map((token) => (
            <button
              key={token.id}
              type="button"
              onClick={() => selectWord(token)}
              className="min-h-10 rounded-md border border-white/10 bg-white/10 px-3 text-sm font-bold text-white transition hover:border-emerald-300/50 hover:bg-emerald-300/15"
            >
              {token.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
