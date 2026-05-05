import { useEffect, type CSSProperties, type ReactNode } from "react";
import { X } from "lucide-react";
import { useLessonViewport } from "../hooks/useLessonViewport";

export function LessonFrame({
  children,
  lessonPercent,
  lessonSubtitle,
  lessonTitle,
  progressLabel,
  onExit,
}: {
  children: ReactNode;
  lessonPercent: number;
  lessonSubtitle: string;
  lessonTitle: string;
  progressLabel: string;
  onExit: () => void;
}) {
  const viewportHeight = useLessonViewport();
  const style = {
    "--lesson-viewport-height": viewportHeight ? `${viewportHeight}px` : "100dvh",
  } as CSSProperties;

  useEffect(() => {
    document.body.classList.add("scripture-memory-lesson-active");

    return () => document.body.classList.remove("scripture-memory-lesson-active");
  }, []);

  return (
    <main
      data-testid="lesson-frame"
      style={style}
      className="fixed inset-0 z-50 flex h-[var(--lesson-viewport-height)] flex-col overflow-hidden bg-[#07100d] text-white"
    >
      <LessonTopBar
        lessonPercent={lessonPercent}
        lessonSubtitle={lessonSubtitle}
        lessonTitle={lessonTitle}
        progressLabel={progressLabel}
        onExit={onExit}
      />
      <section className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        {children}
      </section>
    </main>
  );
}

function LessonTopBar({
  lessonPercent,
  lessonSubtitle,
  lessonTitle,
  progressLabel,
  onExit,
}: {
  lessonPercent: number;
  lessonSubtitle: string;
  lessonTitle: string;
  progressLabel: string;
  onExit: () => void;
}) {
  return (
    <header
      data-testid="lesson-top-bar"
      className="shrink-0 border-b border-white/10 bg-[#07100d]/95 px-3 pb-2 pt-[calc(env(safe-area-inset-top)+0.5rem)] backdrop-blur sm:px-6"
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:border-emerald-300/50 hover:text-emerald-200"
          aria-label="Exit lesson"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="truncate text-sm font-bold text-white">{lessonTitle}</p>
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-white/45 sm:text-xs">
            {lessonSubtitle}
          </p>
        </div>
        <div className="inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-2 text-xs font-bold text-emerald-200 sm:px-3 sm:text-sm">
          {progressLabel}
        </div>
      </div>
      <div className="mx-auto mt-2 h-2 max-w-4xl overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-300 transition-all duration-300"
          style={{ width: `${lessonPercent}%` }}
        />
      </div>
    </header>
  );
}
