/**
 * useMicRecorder — wraps MediaRecorder to capture a single utterance.
 *
 * Push-to-talk model: caller invokes `start()`, talks, then `stop()`.
 * Returns a base64-encoded blob and the mime type. The backend's
 * `user_audio` message format wants both.
 *
 * Mic permission is requested on the first start() call. We hold the
 * MediaStream open across recordings to avoid re-prompting and to keep
 * latency low — calling stopAndRelease() drops the stream when needed.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseMicRecorderResult {
  isRecording: boolean;
  start: () => Promise<void>;
  stop: () => Promise<{ audio_b64: string; mime_type: string } | null>;
  stopAndRelease: () => void;
  permissionDenied: boolean;
  error: string | null;
}

function pickMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/mp4',
  ];
  for (const c of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(c)) return c;
  }
  return 'audio/webm';
}

async function blobToBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunkSize)),
    );
  }
  return btoa(binary);
}

export function useMicRecorder(): UseMicRecorderResult {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ensureStream = useCallback(async (): Promise<MediaStream> => {
    if (streamRef.current) return streamRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('denied')) {
        setPermissionDenied(true);
      }
      setError(message);
      throw err;
    }
  }, []);

  const start = useCallback(async () => {
    if (isRecording) return;
    setError(null);
    const stream = await ensureStream();
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, { mimeType });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  }, [ensureStream, isRecording]);

  const stop = useCallback(async (): Promise<{ audio_b64: string; mime_type: string } | null> => {
    const recorder = recorderRef.current;
    if (!recorder) return null;
    return new Promise((resolve) => {
      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];
        recorderRef.current = null;
        setIsRecording(false);
        if (blob.size === 0) {
          resolve(null);
          return;
        }
        const b64 = await blobToBase64(blob);
        resolve({ audio_b64: b64, mime_type: mimeType });
      };
      recorder.stop();
    });
  }, []);

  const stopAndRelease = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try {
        recorderRef.current.stop();
      } catch {
        // ignore
      }
      recorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAndRelease();
    };
  }, [stopAndRelease]);

  return { isRecording, start, stop, stopAndRelease, permissionDenied, error };
}
