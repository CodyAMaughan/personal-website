/**
 * useAudioPlayer — Web Audio playback with full transport control.
 *
 * Holds the agent's most recent response as a decoded AudioBuffer
 * (concatenation of TTS chunks). Exposes play/pause/seek/rewind/forward/
 * setRate so voice commands and UI buttons both manipulate the same
 * underlying buffer.
 *
 * Why Web Audio instead of <audio>: Web Audio gives us precise seek to
 * any sample, instant rate changes, and the ability to feed the audio
 * graph through additional nodes later (volume ducking, filters, etc.).
 *
 * Single-buffer model: each new agent response REPLACES the buffer.
 * If we ever stream sentence-by-sentence in Phase 2.5, we'll concat
 * incoming chunks into the buffer instead.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AudioPlayerState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
  duration: number;
  currentTime: number;
  rate: number;
  error: string | null;
}

export function useAudioPlayer() {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);    // ctx.currentTime when source started
  const startOffsetRef = useRef<number>(0);  // where in the buffer we started
  const rafRef = useRef<number | null>(null);
  const rateRef = useRef<number>(1);

  const [state, setState] = useState<AudioPlayerState>({
    status: 'idle',
    duration: 0,
    currentTime: 0,
    rate: 1,
    error: null,
  });

  const ensureContext = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      const Ctx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) throw new Error('Web Audio API not supported');
      ctxRef.current = new Ctx();
    }
    return ctxRef.current;
  }, []);

  const updateCurrentTime = useCallback(() => {
    if (!ctxRef.current || !sourceRef.current || !bufferRef.current) {
      rafRef.current = null;
      return;
    }
    const elapsed = (ctxRef.current.currentTime - startTimeRef.current) * rateRef.current;
    const t = startOffsetRef.current + elapsed;
    setState((s) => ({ ...s, currentTime: Math.min(t, s.duration) }));
    if (t >= bufferRef.current.duration) {
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(updateCurrentTime);
  }, []);

  const stopSource = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.onended = null;
        sourceRef.current.stop();
      } catch {
        // already stopped
      }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const playFromOffset = useCallback(
    (offset: number) => {
      const ctx = ctxRef.current;
      const buffer = bufferRef.current;
      if (!ctx || !buffer) return;

      stopSource();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = rateRef.current;
      source.connect(ctx.destination);
      const safeOffset = Math.max(0, Math.min(offset, buffer.duration - 0.05));
      source.start(0, safeOffset);
      startTimeRef.current = ctx.currentTime;
      startOffsetRef.current = safeOffset;
      sourceRef.current = source;

      source.onended = () => {
        // Only mark ended if this is still the current source (not interrupted by seek/pause)
        if (sourceRef.current === source) {
          sourceRef.current = null;
          setState((s) =>
            s.currentTime >= s.duration - 0.1
              ? { ...s, status: 'ended', currentTime: s.duration }
              : s,
          );
        }
      };

      setState((s) => ({ ...s, status: 'playing', currentTime: safeOffset }));
      updateCurrentTime();
    },
    [stopSource, updateCurrentTime],
  );

  /** Load a fresh response (replaces any current buffer). */
  const loadFromBase64Mp3 = useCallback(
    async (b64: string) => {
      const ctx = ensureContext();
      if (ctx.state === 'suspended') await ctx.resume();
      setState((s) => ({ ...s, status: 'loading', error: null }));
      try {
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        const buffer = await ctx.decodeAudioData(bytes.buffer);
        bufferRef.current = buffer;
        setState({
          status: 'paused',
          duration: buffer.duration,
          currentTime: 0,
          rate: rateRef.current,
          error: null,
        });
        playFromOffset(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setState((s) => ({ ...s, status: 'error', error: message }));
      }
    },
    [ensureContext, playFromOffset],
  );

  const play = useCallback(() => {
    if (!bufferRef.current) return;
    if (sourceRef.current) return; // already playing
    playFromOffset(state.currentTime);
  }, [playFromOffset, state.currentTime]);

  const pause = useCallback(() => {
    if (!sourceRef.current || !ctxRef.current) return;
    const elapsed = (ctxRef.current.currentTime - startTimeRef.current) * rateRef.current;
    const t = startOffsetRef.current + elapsed;
    stopSource();
    setState((s) => ({ ...s, status: 'paused', currentTime: t }));
  }, [stopSource]);

  const seek = useCallback(
    (time: number) => {
      const buffer = bufferRef.current;
      if (!buffer) return;
      const target = Math.max(0, Math.min(time, buffer.duration));
      const wasPlaying = sourceRef.current !== null;
      stopSource();
      setState((s) => ({ ...s, currentTime: target }));
      if (wasPlaying) playFromOffset(target);
      else startOffsetRef.current = target;
    },
    [playFromOffset, stopSource],
  );

  const rewind = useCallback(
    (seconds: number) => {
      seek(state.currentTime - seconds);
    },
    [seek, state.currentTime],
  );

  const forward = useCallback(
    (seconds: number) => {
      seek(state.currentTime + seconds);
    },
    [seek, state.currentTime],
  );

  const repeat = useCallback(() => {
    seek(0);
    if (sourceRef.current === null) play();
  }, [play, seek]);

  const setRate = useCallback((rate: number) => {
    rateRef.current = rate;
    if (sourceRef.current) {
      sourceRef.current.playbackRate.value = rate;
    }
    setState((s) => ({ ...s, rate }));
  }, []);

  const stop = useCallback(() => {
    stopSource();
    setState((s) => ({ ...s, status: 'idle', currentTime: 0 }));
    bufferRef.current = null;
  }, [stopSource]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSource();
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
    };
  }, [stopSource]);

  return {
    state,
    loadFromBase64Mp3,
    play,
    pause,
    seek,
    rewind,
    forward,
    repeat,
    setRate,
    stop,
  };
}
