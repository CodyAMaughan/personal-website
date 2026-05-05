import { useEffect, useState } from "react";
import { emptyProgress, loadProgress, saveProgress } from "../learning";
import type { AppProgress } from "../types";

export function useScriptureProgress() {
  const [progress, setProgress] = useState<AppProgress>(emptyProgress);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function persistProgress(next: AppProgress) {
    setProgress(next);
    saveProgress(next);
  }

  function resetProgress() {
    persistProgress(emptyProgress);
  }

  return {
    progress,
    persistProgress,
    resetProgress,
  };
}
