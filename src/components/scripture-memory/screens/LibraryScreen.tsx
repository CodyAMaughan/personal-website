import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { SCRIPTURE_PASSAGES, type ScripturePassage } from "../../../data/scriptureMemory";
import { DOCTRINAL_MASTERY_PLAN, DOCTRINAL_MASTERY_TRACKS } from "../../../data/scripture-memory/tracks";
import { combinedMastery, getPassageProgress, normalizeText } from "../learning";
import type { AppProgress } from "../types";
import { classNames } from "../ui";

export function LibraryScreen({
  progress,
  onPractice,
}: {
  progress: AppProgress;
  onPractice: (passage: ScripturePassage) => void;
}) {
  const [query, setQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const normalizedQuery = normalizeText(query);
  const filtered = SCRIPTURE_PASSAGES.filter((passage) => {
    const haystack = normalizeText(`${passage.reference} ${passage.course} ${passage.keyPhrase} ${passage.text}`);
    const trackMatches =
      trackFilter === "all" ||
      DOCTRINAL_MASTERY_TRACKS.find((track) => track.id === trackFilter)?.passageIds.includes(passage.id);

    return trackMatches && haystack.includes(normalizedQuery);
  });

  return (
    <section className="grid gap-4">
      <header className="rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
          {DOCTRINAL_MASTERY_PLAN.title}
        </p>
        <h1 className="text-3xl font-bold text-white">Library</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
          Search any passage and start a manual practice lesson whenever you want.
        </p>
      </header>

      <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search references, phrases, or passage text"
            className="min-h-12 w-full rounded-lg border border-white/10 bg-black/30 pl-11 pr-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterButton active={trackFilter === "all"} onClick={() => setTrackFilter("all")}>
            All
          </FilterButton>
          {DOCTRINAL_MASTERY_TRACKS.map((track) => (
            <FilterButton
              key={track.id}
              active={trackFilter === track.id}
              onClick={() => setTrackFilter(track.id)}
            >
              {track.shortTitle}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((passage) => {
          const passageProgress = getPassageProgress(passage.id, progress);
          return (
            <button
              key={passage.id}
              type="button"
              onClick={() => onPractice(passage)}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{passage.reference}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                    Unit {passage.unit} - {passage.course}
                  </p>
                </div>
                <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold text-white/70">
                  {combinedMastery(passageProgress)}%
                </span>
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-white/65">{passage.keyPhrase}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "min-h-10 whitespace-nowrap rounded-lg border px-3 text-sm font-bold transition",
        active
          ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-100"
          : "border-white/10 bg-black/20 text-white/65 hover:border-white/25 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}
