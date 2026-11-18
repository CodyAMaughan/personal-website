/**
 * useWakeWord — Picovoice Porcupine wake-word hook with graceful fallback.
 *
 * If no Picovoice AccessKey is configured (or anything else fails), this
 * hook becomes a no-op and the app falls back to push-to-talk. The user
 * can sign up for Picovoice (free) and add the AccessKey + downloaded
 * params file at any time to enable hands-free wake-word detection.
 *
 * Setup steps for the user:
 *   1. Sign up at https://console.picovoice.ai (free)
 *   2. Copy your AccessKey, paste it into the in-app Settings panel
 *   3. Download porcupine_params.pv from Picovoice's GitHub repo
 *      and save to public/claude-runner/porcupine_params.pv
 *   4. (Optional) Train a custom "hey claude" keyword in the console
 *      and save the .ppn to public/claude-runner/hey_claude.ppn
 *
 * Without step 4, the hook uses the built-in "Computer" keyword.
 */

import { useEffect, useRef, useState } from 'react';

export type WakeWordStatus =
  | 'disabled'      // No AccessKey configured — wake word is off, push-to-talk only
  | 'loading'       // Downloading model + initializing worker
  | 'listening'     // Active and listening for the wake word
  | 'detected'      // Briefly enters this state immediately after detection
  | 'error';        // Setup failed for some reason

interface UseWakeWordOptions {
  enabled: boolean;
  accessKey: string;
  /**
   * Path (relative to public/) to the Porcupine params model.
   * Defaults to /claude-runner/porcupine_params.pv.
   */
  modelPath?: string;
  /**
   * Path to a custom keyword .ppn file. If not provided, uses the
   * built-in "Computer" keyword.
   */
  customKeywordPath?: string;
  /** Label to assign to the custom keyword (used for the detection callback). */
  customKeywordLabel?: string;
  /** Called when the wake word is detected. */
  onDetected: () => void;
}

export function useWakeWord({
  enabled,
  accessKey,
  modelPath = '/claude-runner/porcupine_params.pv',
  customKeywordPath,
  customKeywordLabel = 'hey claude',
  onDetected,
}: UseWakeWordOptions) {
  const [status, setStatus] = useState<WakeWordStatus>('disabled');
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<{ release: () => Promise<void>; terminate: () => void } | null>(null);
  const onDetectedRef = useRef(onDetected);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    if (!enabled || !accessKey) {
      setStatus('disabled');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setError(null);

    (async () => {
      try {
        // Lazy-import the SDK so we don't pull WASM into the bundle until needed.
        const [{ PorcupineWorker, BuiltInKeyword }, { WebVoiceProcessor }] =
          await Promise.all([
            import('@picovoice/porcupine-web'),
            import('@picovoice/web-voice-processor'),
          ]);

        if (cancelled) return;

        const keyword = customKeywordPath
          ? { label: customKeywordLabel, publicPath: customKeywordPath }
          : BuiltInKeyword.Computer;

        const porcupine = await PorcupineWorker.create(
          accessKey,
          keyword,
          () => {
            setStatus('detected');
            onDetectedRef.current();
            // Brief flash of the "detected" state, then back to listening
            setTimeout(() => {
              setStatus((s) => (s === 'detected' ? 'listening' : s));
            }, 500);
          },
          { publicPath: modelPath },
        );

        if (cancelled) {
          porcupine.terminate();
          return;
        }

        await WebVoiceProcessor.subscribe(porcupine);
        workerRef.current = {
          release: async () => {
            await WebVoiceProcessor.unsubscribe(porcupine);
            await porcupine.release();
          },
          terminate: () => porcupine.terminate(),
        };
        setStatus('listening');
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setStatus('error');
        setError(message);
      }
    })();

    return () => {
      cancelled = true;
      const ref = workerRef.current;
      workerRef.current = null;
      if (ref) {
        ref
          .release()
          .catch(() => {
            // ignore release errors during teardown
          })
          .finally(() => ref.terminate());
      }
    };
  }, [enabled, accessKey, modelPath, customKeywordPath, customKeywordLabel]);

  return { status, error };
}
