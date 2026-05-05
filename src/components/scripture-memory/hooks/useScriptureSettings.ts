import { useEffect, useState } from "react";
import { DOCTRINAL_MASTERY_PLAN, DOCTRINAL_MASTERY_TRACKS } from "../../../data/scripture-memory/tracks";
import { SETTINGS_KEY } from "../learning";
import type { AppSettings } from "../types";

export const defaultSettings: AppSettings = {
  voiceEnabled: true,
  readAloudVoice: "female",
  selectedPlanId: DOCTRINAL_MASTERY_PLAN.id,
  selectedTrackId: DOCTRINAL_MASTERY_TRACKS[0].id,
};

function loadSettings(): AppSettings {
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

function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function useScriptureSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function updateSettings(next: Partial<AppSettings> | ((current: AppSettings) => AppSettings)) {
    const resolved = typeof next === "function" ? next(settings) : { ...settings, ...next };
    setSettings(resolved);
    saveSettings(resolved);
  }

  return {
    settings,
    updateSettings,
  };
}
