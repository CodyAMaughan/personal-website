import type { ReactNode } from "react";

export function ChallengePanel({
  actions,
  children,
}: {
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="flex min-h-0 flex-1 flex-col">
      <div
        data-testid="lesson-content"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-6"
      >
        <div className="mx-auto grid max-w-3xl gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:gap-5 sm:p-6">
          {children}
        </div>
      </div>
      <div
        data-testid="lesson-action-bar"
        className="shrink-0 border-t border-white/10 bg-[#07100d]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur sm:px-6 sm:pb-4"
      >
        <div className="mx-auto w-full max-w-3xl">
          {actions}
        </div>
      </div>
    </article>
  );
}
