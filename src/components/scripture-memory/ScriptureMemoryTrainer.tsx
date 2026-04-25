import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BookOpen,
  Check,
  Flame,
  Library,
  Mic,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { COURSE_ORDER, SCRIPTURE_PASSAGES, type ScripturePassage } from "../../data/scriptureMemory";
import {
  SETTINGS_KEY,
  buildChallenges,
  combinedMastery,
  emptyProgress,
  getPassageProgress,
  isDue,
  isMastered,
  loadProgress,
  missingWords,
  nextPassage,
  normalizeText,
  recordPracticeSession,
  saveProgress,
  scoreAnswer,
  updateAfterChallenge,
} from "./learning";
import type { AppProgress, AppSettings, Challenge, MasteryTarget } from "./types";

type Screen = "home" | "lesson" | "library";
type Feedback = {
  score: number;
  answer: string;
  expected: string;
  target: MasteryTarget;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const defaultSettings: AppSettings = {
  voiceEnabled: true,
};

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function masteryLabel(score: number) {
  if (score >= 90) return "Mastered";
  if (score >= 65) return "Reviewing";
  if (score > 0) return "Learning";
  return "New";
}

function getCourseName(courseId: string) {
  return SCRIPTURE_PASSAGES.find((passage) => passage.courseId === courseId)?.course ?? courseId;
}

function getStoredSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "{}"),
    };
  } catch {
    return defaultSettings;
  }
}

function storeSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export default function ScriptureMemoryTrainer() {
  const [progress, setProgress] = useState<AppProgress>(emptyProgress);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [screen, setScreen] = useState<Screen>("home");
  const [activePassage, setActivePassage] = useState<ScripturePassage>(SCRIPTURE_PASSAGES[0]);
  const [challenges, setChallenges] = useState<Challenge[]>(() => buildChallenges(SCRIPTURE_PASSAGES[0]));
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
    setSettings(getStoredSettings());
  }, []);

  const selectedPassage = nextPassage(progress);
  const selectedProgress = getPassageProgress(selectedPassage.id, progress);
  const dueCount = SCRIPTURE_PASSAGES.filter((passage) =>
    isDue(getPassageProgress(passage.id, progress)),
  ).length;
  const masteredCount = SCRIPTURE_PASSAGES.filter((passage) =>
    isMastered(getPassageProgress(passage.id, progress)),
  ).length;
  const currentChallenge = challenges[challengeIndex];
  const lessonPercent = Math.round(((challengeIndex + (feedback ? 1 : 0)) / challenges.length) * 100);

  function persistProgress(next: AppProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function updateSettings(next: AppSettings) {
    setSettings(next);
    storeSettings(next);
  }

  function startLesson(passage: ScripturePassage) {
    setActivePassage(passage);
    setChallenges(buildChallenges(passage));
    setChallengeIndex(0);
    setFeedback(null);
    setScreen("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeChallenge(score: number, answer: string) {
    if (!currentChallenge) return;

    const next = updateAfterChallenge(
      progress,
      currentChallenge.passage,
      currentChallenge.target,
      score,
    );
    persistProgress(next);
    setFeedback({
      score,
      answer,
      expected: currentChallenge.answer,
      target: currentChallenge.target,
    });
  }

  function nextChallenge() {
    if (challengeIndex >= challenges.length - 1) {
      persistProgress(recordPracticeSession(progress));
      setFeedback(null);
      setScreen("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setChallengeIndex((index) => index + 1);
    setFeedback(null);
  }

  function resetProgress() {
    if (!window.confirm("Reset all scripture memory progress on this browser?")) return;
    persistProgress(emptyProgress);
  }

  if (screen === "lesson" && currentChallenge) {
    return (
      <main className="min-h-screen bg-[#07100d] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
          <header className="sticky top-16 z-20 -mx-4 border-b border-white/10 bg-[#07100d]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setScreen("home")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-emerald-300/50 hover:text-emerald-200"
                aria-label="Exit lesson"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="min-w-0 text-center">
                <p className="truncate text-sm font-bold text-white">{activePassage.reference}</p>
                <p className="text-xs text-white/55">Unit {activePassage.unit} • {activePassage.course}</p>
              </div>
              <div className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 text-sm font-bold text-emerald-200">
                {challengeIndex + 1}/{challenges.length}
              </div>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-300 transition-all duration-300"
                style={{ width: `${lessonPercent}%` }}
              />
            </div>
          </header>

          <section className="flex flex-1 items-stretch py-6">
            <div className="grid w-full content-start gap-5">
              {feedback ? (
                <FeedbackPanel feedback={feedback} onNext={nextChallenge} isFinal={challengeIndex >= challenges.length - 1} />
              ) : (
                <ChallengeCard
                  key={currentChallenge.id}
                  challenge={currentChallenge}
                  settings={settings}
                  onComplete={completeChallenge}
                />
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main data-pagefind-body className="min-h-screen bg-[#07100d] text-white">
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <header className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Doctrinal Mastery
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Scripture Memory
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
                Memorize references, key phrases, and full passages through quick tests,
                typing, word banks, and voice recitation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startLesson(selectedPassage)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-300 px-5 py-3 text-base font-bold text-black transition hover:bg-emerald-200"
            >
              Continue
              <Check className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat icon={<Flame className="h-5 w-5" />} label="Streak" value={`${progress.streak} day${progress.streak === 1 ? "" : "s"}`} />
            <Stat icon={<RotateCcw className="h-5 w-5" />} label="Due" value={`${dueCount} reviews`} />
            <Stat icon={<Trophy className="h-5 w-5" />} label="Mastered" value={`${masteredCount}/96`} />
            <Stat icon={<Target className="h-5 w-5" />} label="Current" value={`Unit ${selectedPassage.unit}`} />
          </div>
        </header>

        <nav className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-black/20 p-1">
          <button
            type="button"
            onClick={() => setScreen("home")}
            className={classNames(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition",
              screen === "home" ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <BookOpen className="h-4 w-4" />
            Learn
          </button>
          <button
            type="button"
            onClick={() => setScreen("library")}
            className={classNames(
              "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition",
              screen === "library" ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Library className="h-4 w-4" />
            Library
          </button>
        </nav>

        {screen === "library" ? (
          <LibraryView progress={progress} onPractice={startLesson} />
        ) : (
          <HomeView
            progress={progress}
            selectedPassage={selectedPassage}
            selectedProgress={selectedProgress}
            settings={settings}
            onPractice={startLesson}
            onSettingsChange={updateSettings}
            onReset={resetProgress}
          />
        )}
      </section>
    </main>
  );
}

function HomeView({
  progress,
  selectedPassage,
  selectedProgress,
  settings,
  onPractice,
  onSettingsChange,
  onReset,
}: {
  progress: AppProgress;
  selectedPassage: ScripturePassage;
  selectedProgress: ReturnType<typeof getPassageProgress>;
  settings: AppSettings;
  onPractice: (passage: ScripturePassage) => void;
  onSettingsChange: (settings: AppSettings) => void;
  onReset: () => void;
}) {
  const unitPassages = SCRIPTURE_PASSAGES.filter((passage) => passage.unit === selectedPassage.unit);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <section className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-bold uppercase tracking-[0.18em] text-emerald-200">
              Up Next
            </p>
            <h2 className="text-2xl font-bold text-white">{selectedPassage.reference}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              {selectedPassage.keyPhrase}
            </p>
          </div>
          <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm font-bold text-emerald-100">
            {masteryLabel(combinedMastery(selectedProgress))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <MasteryMeter label="Reference" value={selectedProgress.referenceMastery} />
          <MasteryMeter label="Key Phrase" value={selectedProgress.keyPhraseMastery} />
          <MasteryMeter label="Passage" value={selectedProgress.passageMastery} />
        </div>

        <div className="grid gap-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/55">
            Unit {selectedPassage.unit}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {unitPassages.map((passage) => {
              const passageProgress = getPassageProgress(passage.id, progress);
              return (
                <button
                  key={passage.id}
                  type="button"
                  onClick={() => onPractice(passage)}
                  className={classNames(
                    "rounded-lg border p-4 text-left transition",
                    passage.id === selectedPassage.id
                      ? "border-emerald-300/50 bg-emerald-300/10"
                      : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[0.06]",
                  )}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-bold text-white">{passage.reference}</span>
                    <span className="text-xs font-bold text-emerald-200">
                      {combinedMastery(passageProgress)}%
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm leading-5 text-white/65">{passage.keyPhrase}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <aside className="grid content-start gap-4">
        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-4 text-lg font-bold text-white">Course Progress</h2>
          <div className="grid gap-4">
            {COURSE_ORDER.map((courseId) => {
              const coursePassages = SCRIPTURE_PASSAGES.filter((passage) => passage.courseId === courseId);
              const mastered = coursePassages.filter((passage) =>
                isMastered(getPassageProgress(passage.id, progress)),
              ).length;
              const average = Math.round(
                coursePassages.reduce(
                  (sum, passage) => sum + combinedMastery(getPassageProgress(passage.id, progress)),
                  0,
                ) / coursePassages.length,
              );

              return (
                <div key={courseId}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-white">{getCourseName(courseId)}</span>
                    <span className="text-white/55">{mastered}/24</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-emerald-300" style={{ width: `${average}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <h2 className="mb-3 text-lg font-bold text-white">Settings</h2>
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
            <span>
              <span className="block text-sm font-bold text-white">Voice challenges</span>
              <span className="block text-xs leading-5 text-white/55">Fallbacks stay available.</span>
            </span>
            <input
              type="checkbox"
              checked={settings.voiceEnabled}
              onChange={(event) => onSettingsChange({ voiceEnabled: event.currentTarget.checked })}
              className="h-5 w-5 accent-emerald-300"
            />
          </label>
          <button
            type="button"
            onClick={onReset}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent px-3 text-sm font-bold text-white/65 transition hover:border-red-300/40 hover:text-red-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
          </button>
        </section>
      </aside>
    </div>
  );
}

function LibraryView({
  progress,
  onPractice,
}: {
  progress: AppProgress;
  onPractice: (passage: ScripturePassage) => void;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeText(query);
  const filtered = SCRIPTURE_PASSAGES.filter((passage) => {
    const haystack = normalizeText(`${passage.reference} ${passage.course} ${passage.keyPhrase} ${passage.text}`);
    return haystack.includes(normalizedQuery);
  });

  return (
    <section className="grid gap-4">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search references, phrases, or passage text"
            className="min-h-12 w-full rounded-lg border border-white/10 bg-black/30 pl-11 pr-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60"
          />
        </label>
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
                    Unit {passage.unit} • {passage.course}
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

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 text-emerald-200">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}

function MasteryMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-white">{label}</span>
        <span className="text-sm font-bold text-emerald-200">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-emerald-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ChallengeCard({
  challenge,
  settings,
  onComplete,
}: {
  challenge: Challenge;
  settings: AppSettings;
  onComplete: (score: number, answer: string) => void;
}) {
  const [choice, setChoice] = useState("");
  const [typed, setTyped] = useState("");
  const [selectedWords, setSelectedWords] = useState<WordToken[]>([]);
  const [availableWords, setAvailableWords] = useState<WordToken[]>([]);

  useEffect(() => {
    const words = makeWordTokens(challenge.answer);
    setChoice("");
    setTyped("");
    setSelectedWords([]);
    setAvailableWords(shuffleTokens(words));
  }, [challenge]);

  function completeWith(answer: string) {
    onComplete(scoreAnswer(answer, challenge.answer, challenge.target), answer);
  }

  if (challenge.kind === "read") {
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
        <button
          type="button"
          onClick={() => onComplete(1, challenge.answer)}
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-300 px-5 text-base font-bold text-black transition hover:bg-emerald-200"
        >
          I’m Ready
        </button>
      </article>
    );
  }

  if (challenge.kind === "choice") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={challenge} />
        <div className="grid gap-3">
          {challenge.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setChoice(option)}
              className={classNames(
                "min-h-14 rounded-lg border p-4 text-left text-base font-bold leading-6 transition",
                choice === option
                  ? "border-emerald-300 bg-emerald-300/15 text-white"
                  : "border-white/10 bg-black/20 text-white/75 hover:border-white/30 hover:bg-white/[0.06]",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <CheckButton disabled={!choice} onClick={() => completeWith(choice)} />
      </article>
    );
  }

  if (challenge.kind === "fillBlank") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={challenge} />
        <p className="rounded-lg border border-white/10 bg-black/25 p-4 text-lg leading-8 text-white/85">
          {challenge.blankedText}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {challenge.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setChoice(option)}
              className={classNames(
                "min-h-12 rounded-lg border px-3 text-sm font-bold transition",
                choice === option
                  ? "border-emerald-300 bg-emerald-300/15 text-white"
                  : "border-white/10 bg-black/20 text-white/75 hover:border-white/30 hover:bg-white/[0.06]",
              )}
            >
              {option}
            </button>
          ))}
        </div>
        <CheckButton disabled={!choice} onClick={() => completeWith(choice)} />
      </article>
    );
  }

  if (challenge.kind === "wordBank") {
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
          disabled={selectedWords.length === 0}
          onClick={() => completeWith(selectedWords.map((word) => word.text).join(" "))}
        />
      </article>
    );
  }

  if (challenge.kind === "voice") {
    return (
      <VoiceChallenge
        challenge={challenge}
        settings={settings}
        onComplete={(answer) => completeWith(answer)}
      />
    );
  }

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
      <CheckButton disabled={!typed.trim()} onClick={() => completeWith(typed)} />
    </article>
  );
}

function ChallengeHeader({ challenge }: { challenge: Challenge }) {
  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white/50">
        {challenge.target === "reference" ? "Reference" : challenge.target === "keyPhrase" ? "Key Phrase" : "Passage"}
      </div>
      <h2 className="whitespace-pre-line text-2xl font-bold leading-tight text-white sm:text-3xl">
        {challenge.prompt}
      </h2>
    </div>
  );
}

function CheckButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-300 px-5 text-base font-bold text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
    >
      Check
    </button>
  );
}

type WordToken = {
  id: string;
  text: string;
};

function makeWordTokens(answer: string) {
  return answer
    .split(/\s+/)
    .filter(Boolean)
    .map((text, index) => ({ id: `${index}:${text}`, text }));
}

function shuffleTokens(tokens: WordToken[]) {
  if (tokens.length === 0) return [];
  const offset = tokens.length % 5;
  return [...tokens.slice(offset), ...tokens.slice(0, offset)];
}

function WordBankInput({
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
      <div className="min-h-24 rounded-lg border border-emerald-300/25 bg-emerald-300/10 p-3">
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
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/20 p-3">
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
  );
}

function VoiceChallenge({
  challenge,
  settings,
  onComplete,
}: {
  challenge: Challenge;
  settings: AppSettings;
  onComplete: (answer: string) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [typed, setTyped] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState<"type" | "bank" | null>(settings.voiceEnabled ? null : "type");
  const [selectedWords, setSelectedWords] = useState<WordToken[]>([]);
  const [availableWords, setAvailableWords] = useState<WordToken[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const bankEligible = challenge.answer.split(/\s+/).length <= 28;
  const Recognition =
    typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;

  useEffect(() => {
    setTranscript("");
    setTyped("");
    setError("");
    setFallback(settings.voiceEnabled ? null : "type");
    setSelectedWords([]);
    setAvailableWords(shuffleTokens(makeWordTokens(challenge.answer)));

    return () => recognitionRef.current?.abort();
  }, [challenge, settings.voiceEnabled]);

  function startListening() {
    if (!Recognition) {
      setError("Speech recognition is not available in this browser.");
      setFallback("type");
      return;
    }

    setError("");
    setTranscript("");

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let nextTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        nextTranscript += event.results[index][0].transcript;
      }
      setTranscript(nextTranscript.trim());
    };
    recognition.onerror = (event) => {
      setError(event.error ? `Voice error: ${event.error}` : "Voice recognition stopped.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (fallback === "type") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={{ ...challenge, prompt: `${challenge.prompt}\nType it instead.` }} />
        <textarea
          value={typed}
          onChange={(event) => setTyped(event.currentTarget.value)}
          rows={8}
          placeholder="Type from memory"
          className="w-full resize-y rounded-lg border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <CheckButton disabled={!typed.trim()} onClick={() => onComplete(typed)} />
          <FallbackButton onClick={() => setFallback(null)}>Try Voice</FallbackButton>
        </div>
      </article>
    );
  }

  if (fallback === "bank") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={{ ...challenge, prompt: `${challenge.prompt}\nUse the word bank.` }} />
        <WordBankInput
          availableWords={availableWords}
          selectedWords={selectedWords}
          onAvailableWordsChange={setAvailableWords}
          onSelectedWordsChange={setSelectedWords}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <CheckButton
            disabled={selectedWords.length === 0}
            onClick={() => onComplete(selectedWords.map((word) => word.text).join(" "))}
          />
          <FallbackButton onClick={() => setFallback(null)}>Try Voice</FallbackButton>
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <div className="grid gap-4 rounded-lg border border-white/10 bg-black/25 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={classNames(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-bold transition",
              listening
                ? "bg-red-300 text-black hover:bg-red-200"
                : "bg-emerald-300 text-black hover:bg-emerald-200",
            )}
          >
            <Mic className="h-5 w-5" />
            {listening ? "Stop" : "Start Reciting"}
          </button>
          <FallbackButton onClick={() => setFallback("type")}>Type Instead</FallbackButton>
          {bankEligible && <FallbackButton onClick={() => setFallback("bank")}>Word Bank</FallbackButton>}
        </div>

        {!Recognition && (
          <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
            Speech recognition is not available here. Use the typing fallback for this challenge.
          </p>
        )}

        {error && (
          <p className="rounded-md border border-red-300/30 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
            {error}
          </p>
        )}

        <div className="min-h-28 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-base leading-7 text-white/75">
          {transcript || "Your transcript will appear here."}
        </div>
      </div>
      <CheckButton disabled={!transcript.trim()} onClick={() => onComplete(transcript)} />
    </article>
  );
}

function FallbackButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100"
    >
      {children}
    </button>
  );
}

function FeedbackPanel({
  feedback,
  onNext,
  isFinal,
}: {
  feedback: Feedback;
  onNext: () => void;
  isFinal: boolean;
}) {
  const percent = Math.round(feedback.score * 100);
  const passed = feedback.score >= (feedback.target === "reference" ? 1 : 0.78);
  const missing = missingWords(feedback.answer, feedback.expected).slice(0, 16);

  return (
    <article
      className={classNames(
        "grid gap-5 rounded-lg border p-5 sm:p-7",
        passed ? "border-emerald-300/40 bg-emerald-300/10" : "border-amber-300/40 bg-amber-300/10",
      )}
    >
      <div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-white/50">
          {passed ? "Good" : "Keep going"}
        </p>
        <h2 className="text-3xl font-bold text-white">{percent}% Match</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Your answer
          </p>
          <p className="text-base leading-7 text-white/75">{feedback.answer || "No answer"}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Expected
          </p>
          <p className="text-base leading-7 text-white/85">{feedback.expected}</p>
        </div>
      </div>

      {missing.length > 0 && feedback.target !== "reference" && (
        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/40">
            Words to watch
          </p>
          <div className="flex flex-wrap gap-2">
            {missing.map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-sm font-bold text-white/75"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onNext}
        className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-5 text-base font-bold text-black transition hover:bg-emerald-100"
      >
        {isFinal ? "Finish Lesson" : "Next"}
      </button>
    </article>
  );
}
