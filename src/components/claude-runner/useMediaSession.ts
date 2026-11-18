/**
 * useMediaSession — register the audio playback as a Media Session so
 * Bluetooth controls (AirPods, lock screen, notification panel) work
 * natively. Without this, hardware play/pause buttons do nothing while
 * we're playing Web Audio.
 *
 * The Media Session API is supported in Chrome on Android (and Safari,
 * with caveats). It also helps Android grant audio focus to our app
 * with sensible defaults.
 */

import { useEffect } from 'react';

interface UseMediaSessionOptions {
  /** Whether to register handlers (false unloads them). */
  enabled: boolean;
  title?: string;
  artist?: string;
  album?: string;
  artwork?: { src: string; sizes: string; type: string }[];
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSeekBackward?: (offset: number) => void;
  onSeekForward?: (offset: number) => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
  /** Current playback state — set to 'playing' or 'paused' to update UI. */
  playbackState?: MediaSessionPlaybackState;
  /** Current position info for the OS scrubber. */
  positionState?: { duration: number; position: number; playbackRate: number };
}

export function useMediaSession({
  enabled,
  title = 'Claude Runner',
  artist = 'Voice interface to Claude Code',
  album,
  artwork,
  onPlay,
  onPause,
  onStop,
  onSeekBackward,
  onSeekForward,
  onPreviousTrack,
  onNextTrack,
  playbackState,
  positionState,
}: UseMediaSessionOptions) {
  // Set metadata + handlers
  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }
    const ms = navigator.mediaSession;

    ms.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: artwork ?? [],
    });

    const setHandler = (
      action: MediaSessionAction,
      handler: MediaSessionActionHandler | null,
    ) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        // Some actions are not supported on all browsers — ignore
      }
    };

    setHandler('play', onPlay ? () => onPlay() : null);
    setHandler('pause', onPause ? () => onPause() : null);
    setHandler('stop', onStop ? () => onStop() : null);
    setHandler('seekbackward', onSeekBackward ? (d) => onSeekBackward(d.seekOffset ?? 10) : null);
    setHandler('seekforward', onSeekForward ? (d) => onSeekForward(d.seekOffset ?? 10) : null);
    setHandler('previoustrack', onPreviousTrack ? () => onPreviousTrack() : null);
    setHandler('nexttrack', onNextTrack ? () => onNextTrack() : null);

    return () => {
      // Clear all handlers
      for (const action of [
        'play',
        'pause',
        'stop',
        'seekbackward',
        'seekforward',
        'previoustrack',
        'nexttrack',
      ] as MediaSessionAction[]) {
        try {
          ms.setActionHandler(action, null);
        } catch {
          // ignore
        }
      }
    };
  }, [
    enabled,
    title,
    artist,
    album,
    artwork,
    onPlay,
    onPause,
    onStop,
    onSeekBackward,
    onSeekForward,
    onPreviousTrack,
    onNextTrack,
  ]);

  // Update playback state
  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (playbackState) {
      navigator.mediaSession.playbackState = playbackState;
    }
  }, [enabled, playbackState]);

  // Update position state for the OS scrubber
  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    if (!positionState) return;
    if (typeof navigator.mediaSession.setPositionState !== 'function') return;
    try {
      navigator.mediaSession.setPositionState({
        duration: Math.max(0, positionState.duration),
        position: Math.max(0, Math.min(positionState.position, positionState.duration)),
        playbackRate: positionState.playbackRate,
      });
    } catch {
      // Some browsers throw on invalid state — ignore
    }
  }, [enabled, positionState]);
}
