import { useMemo, useState } from "react";
import { BarChart3, BookOpen, Library, Map, Sparkles } from "lucide-react";
import { type ScripturePassage } from "../../data/scriptureMemory";
import {
  DOCTRINAL_MASTERY_PLAN,
  DOCTRINAL_MASTERY_TRACKS,
  type ScripturePathStep,
  type ScriptureTrack,
} from "../../data/scripture-memory/tracks";
import { useLessonSession } from "./hooks/useLessonSession";
import { useScriptureProgress } from "./hooks/useScriptureProgress";
import { useScriptureSettings } from "./hooks/useScriptureSettings";
import { getDefaultTrack, getPracticedPassages, getTrackProgress } from "./learning";
import { HomeScreen } from "./screens/HomeScreen";
import { LessonScreen } from "./screens/LessonScreen";
import { LibraryScreen } from "./screens/LibraryScreen";
import { PathScreen } from "./screens/PathScreen";
import { PathsScreen } from "./screens/PathsScreen";
import { StatsScreen } from "./screens/StatsScreen";
import type { AppScreen } from "./types";
import { classNames } from "./ui";

const appNav: Array<{
  id: Exclude<AppScreen, "lesson">;
  label: string;
  Icon: typeof BookOpen;
}> = [
  { id: "home", label: "Home", Icon: BookOpen },
  { id: "paths", label: "Paths", Icon: Map },
  { id: "stats", label: "Stats", Icon: BarChart3 },
  { id: "library", label: "Library", Icon: Library },
];

export default function ScriptureMemoryTrainer() {
  const { progress, persistProgress, resetProgress } = useScriptureProgress();
  const { settings, updateSettings } = useScriptureSettings();
  const [screen, setScreen] = useState<AppScreen>("home");
  const [returnScreen, setReturnScreen] = useState<Exclude<AppScreen, "lesson">>("home");
  const lesson = useLessonSession({ progress, persistProgress });

  const selectedTrack = useMemo(() => {
    return (
      DOCTRINAL_MASTERY_TRACKS.find((track) => track.id === settings.selectedTrackId) ??
      getDefaultTrack(progress)
    );
  }, [progress, settings.selectedTrackId]);
  const selectedPlanId = settings.selectedPlanId ?? DOCTRINAL_MASTERY_PLAN.id;
  const selectedStep = getTrackProgress(selectedTrack, progress).currentStep;
  const globalReviewCount = getPracticedPassages(progress).length;

  function openScreen(nextScreen: Exclude<AppScreen, "lesson">) {
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function beginLesson(backTo: Exclude<AppScreen, "lesson">) {
    setReturnScreen(backTo);
    setScreen("lesson");
  }

  function startManualLesson(passage: ScripturePassage) {
    lesson.startLesson(passage);
    beginLesson(screen === "lesson" ? "home" : screen);
  }

  function startPathStep(step: ScripturePathStep) {
    lesson.startPathStep(step);
    beginLesson("path");
  }

  function continueLesson() {
    if (!selectedStep) return;
    startPathStep(selectedStep);
  }

  function startGlobalQuickReview() {
    if (lesson.startQuickReview()) {
      beginLesson(screen === "lesson" ? "home" : screen);
    }
  }

  function startTrackQuickReview(track: ScriptureTrack) {
    if (lesson.startQuickReview(track)) {
      updateSettings({
        selectedPlanId: track.parentId,
        selectedTrackId: track.id,
      });
      beginLesson(screen === "paths" ? "paths" : "path");
    }
  }

  function selectPlan(planId: string) {
    updateSettings({ selectedPlanId: planId });
  }

  function selectTrack(track: ScriptureTrack) {
    updateSettings({
      selectedPlanId: track.parentId,
      selectedTrackId: track.id,
    });
    openScreen("path");
  }

  function finishOrAdvanceLesson() {
    const finished = lesson.nextChallenge();
    if (finished) {
      openScreen(returnScreen);
    }
  }

  function exitLesson() {
    openScreen(returnScreen);
  }

  function confirmResetProgress() {
    if (!window.confirm("Reset all scripture memory progress on this browser?")) return;
    resetProgress();
  }

  if (screen === "lesson" && lesson.currentChallenge) {
    return (
      <LessonScreen
        activePracticeLabel={lesson.activePracticeLabel}
        activeStep={lesson.activeStep}
        challengeIndex={lesson.challengeIndex}
        challenges={lesson.challenges}
        currentChallenge={lesson.currentChallenge}
        feedback={lesson.feedback}
        lessonPercent={lesson.lessonPercent}
        settings={settings}
        onComplete={lesson.scoreAndComplete}
        onExit={exitLesson}
        onNext={finishOrAdvanceLesson}
      />
    );
  }

  return (
    <main data-pagefind-body className="min-h-screen bg-[#07100d] text-white">
      <section className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <header className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[1fr_auto] sm:items-center sm:p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-300/25 bg-emerald-300/10 text-emerald-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-white">Scripture Memory</p>
              <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-white/45">
                {selectedTrack.shortTitle} - {progress.streak} day streak
              </p>
            </div>
          </div>

          <nav className="grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
            {appNav.map(({ Icon, id, label }) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                title={label}
                onClick={() => openScreen(id)}
                className={classNames(
                  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold transition",
                  screen === id ? "bg-white text-black" : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </header>

        {screen === "home" && (
          <HomeScreen
            globalReviewCount={globalReviewCount}
            progress={progress}
            selectedStep={selectedStep}
            selectedTrack={selectedTrack}
            settings={settings}
            onContinueLesson={continueLesson}
            onContinuePath={() => openScreen("path")}
            onOpenPaths={() => openScreen("paths")}
            onOpenStats={() => openScreen("stats")}
            onPractice={startManualLesson}
            onQuickReview={startGlobalQuickReview}
            onReset={confirmResetProgress}
            onSettingsChange={updateSettings}
          />
        )}

        {screen === "paths" && (
          <PathsScreen
            progress={progress}
            selectedPlanId={selectedPlanId}
            selectedTrackId={selectedTrack.id}
            onQuickReview={startTrackQuickReview}
            onSelectPlan={selectPlan}
            onSelectTrack={selectTrack}
          />
        )}

        {screen === "path" && (
          <PathScreen
            progress={progress}
            selectedStep={selectedStep}
            track={selectedTrack}
            onChangePath={() => openScreen("paths")}
            onContinueLesson={continueLesson}
            onQuickReview={() => startTrackQuickReview(selectedTrack)}
            onStartStep={startPathStep}
          />
        )}

        {screen === "stats" && <StatsScreen progress={progress} />}

        {screen === "library" && <LibraryScreen progress={progress} onPractice={startManualLesson} />}
      </section>
    </main>
  );
}
