import type { ReactNode } from "react";

export function CheckButton({
  children = "Check",
  disabled,
  onClick,
}: {
  children?: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      data-testid="lesson-primary-action"
      className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-emerald-300 px-5 text-base font-bold text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
    >
      {children}
    </button>
  );
}
