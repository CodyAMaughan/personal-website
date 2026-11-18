/**
 * App.tsx — root React component for the claude-runner PWA at
 * /projects/claude-runner.
 *
 * Wires together: WebSocket client, mic recorder, audio player, command
 * parser, optional wake word, and Media Session integration.
 *
 * MVP UX:
 *   - Big "Hold to talk" button (push-to-talk)
 *   - Transcript scroll area (your message + Claude's response)
 *   - Transport controls (rewind 10s, play/pause, forward 10s, repeat, faster, slower)
 *   - Settings panel (backend URL, Picovoice access key, wake word toggle)
 *   - Connection status indicator
 *
 * Phase 3 will wrap this same component in Capacitor for background
 * operation. No code changes required there — just a Capacitor build.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServerMessage } from './protocol';
import { parseCommand } from './commandParser';
import { useWebSocket } from './useWebSocket';
import { useMicRecorder } from './useMicRecorder';
import { useAudioPlayer } from './useAudioPlayer';
import { useWakeWord } from './useWakeWord';
import { useMediaSession } from './useMediaSession';

interface Settings {
  backendUrl: string;
  picovoiceAccessKey: string;
  wakeWordEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  backendUrl: 'ws://localhost:8787',
  picovoiceAccessKey: '',
  wakeWordEnabled: false,
};

const SETTINGS_KEY = 'claude-runner:settings';

function loadSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: Settings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

interface TranscriptEntry {
  id: string;
  role: 'you' | 'claude' | 'system';
  text: string;
  timestamp: number;
}

function fmtTime(t: number): string {
  if (!isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function App() {
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [pendingAgentText, setPendingAgentText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const player = useAudioPlayer();
  const mic = useMicRecorder();

  // Append helpers
  const appendTranscript = useCallback((entry: Omit<TranscriptEntry, 'id' | 'timestamp'>) => {
    setTranscript((t) => [
      ...t,
      { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
    ]);
  }, []);

  // ── WebSocket handler ───────────────────────────────────────────────────
  const onMessage = useCallback(
    (msg: ServerMessage) => {
      switch (msg.type) {
        case 'ready':
          // Connected — no need to add to transcript every time
          break;
        case 'transcribed':
          appendTranscript({ role: 'you', text: msg.text });
          break;
        case 'agent_text':
          setPendingAgentText((t) => t + msg.text);
          break;
        case 'agent_audio':
          player.loadFromBase64Mp3(msg.audio_b64);
          break;
        case 'agent_done':
          setPendingAgentText((t) => {
            if (t.trim()) {
              appendTranscript({ role: 'claude', text: t });
            } else if (msg.result) {
              appendTranscript({ role: 'claude', text: msg.result });
            }
            return '';
          });
          setIsThinking(false);
          break;
        case 'agent_error':
          appendTranscript({ role: 'system', text: `error: ${msg.message}` });
          setIsThinking(false);
          break;
        case 'status':
          appendTranscript({ role: 'system', text: msg.text });
          break;
      }
    },
    [appendTranscript, player],
  );

  const ws = useWebSocket({
    url: settings.backendUrl,
    enabled: true,
    onMessage,
  });

  // ── Push-to-talk handler ────────────────────────────────────────────────
  const startTalking = useCallback(async () => {
    try {
      await mic.start();
    } catch {
      // error already captured by hook
    }
  }, [mic]);

  const stopTalking = useCallback(async () => {
    const result = await mic.stop();
    if (!result) return;
    if (ws.status !== 'open') {
      appendTranscript({ role: 'system', text: 'not connected to backend' });
      return;
    }
    setIsThinking(true);
    ws.send({
      type: 'user_audio',
      audio_b64: result.audio_b64,
      mime_type: result.mime_type,
    });
  }, [mic, ws, appendTranscript]);

  // ── Wake-word integration ───────────────────────────────────────────────
  const wakeWordRef = useRef({ stopTalking, startTalking });
  useEffect(() => {
    wakeWordRef.current = { startTalking, stopTalking };
  }, [startTalking, stopTalking]);

  const wakeWord = useWakeWord({
    enabled: settings.wakeWordEnabled && !!settings.picovoiceAccessKey,
    accessKey: settings.picovoiceAccessKey,
    onDetected: () => {
      // For MVP, treat the wake word as "start a recording, capture for ~3s, send".
      // Real "claude X" command parsing would tap into the WebVoiceProcessor
      // ring buffer to capture the audio AROUND the detection. We'll wire that
      // in a follow-up — for now this proves the wake word fires.
      console.log('[wake] hey claude detected');
      wakeWordRef.current.startTalking();
      window.setTimeout(() => {
        wakeWordRef.current.stopTalking();
      }, 3500);
    },
  });

  // ── Voice command handling on transcribed input ─────────────────────────
  useEffect(() => {
    // Whenever a new "you said" entry lands, parse it for commands.
    const last = transcript[transcript.length - 1];
    if (!last || last.role !== 'you') return;
    const cmd = parseCommand(last.text);
    if (cmd.kind === 'chat') return; // chat content already in flight to backend

    // Local commands cancel any backend round-trip we might have started
    // (the backend will get the user_audio anyway, but we don't display it).
    switch (cmd.kind) {
      case 'pause':
        player.pause();
        break;
      case 'play':
        player.play();
        break;
      case 'rewind':
        player.rewind(cmd.seconds);
        break;
      case 'forward':
        player.forward(cmd.seconds);
        break;
      case 'repeat':
        player.repeat();
        break;
      case 'faster':
        player.setRate(Math.min(2, player.state.rate + 0.25));
        break;
      case 'slower':
        player.setRate(Math.max(0.5, player.state.rate - 0.25));
        break;
      case 'normal_speed':
        player.setRate(1);
        break;
      case 'stop':
        player.stop();
        ws.send({ type: 'cancel' });
        break;
      case 'status':
        ws.send({ type: 'status' });
        break;
      case 'next':
      case 'start_dictation':
      case 'send_dictation':
      case 'cancel_dictation':
        // Phase 2.5 — multi-turn dictation mode
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  // ── Media Session for AirPods / lock screen ─────────────────────────────
  useMediaSession({
    enabled: true,
    title: 'Claude is talking',
    artist: 'claude-runner',
    album: 'voice interface to Claude Code',
    onPlay: player.play,
    onPause: player.pause,
    onStop: player.stop,
    onSeekBackward: (offset) => player.rewind(offset),
    onSeekForward: (offset) => player.forward(offset),
    onPreviousTrack: () => player.repeat(),
    playbackState: player.state.status === 'playing' ? 'playing' : 'paused',
    positionState: {
      duration: player.state.duration,
      position: player.state.currentTime,
      playbackRate: player.state.rate,
    },
  });

  // ── Settings handlers ───────────────────────────────────────────────────
  const updateSettings = (patch: Partial<Settings>) => {
    setSettings((s) => {
      const next = { ...s, ...patch };
      saveSettings(next);
      return next;
    });
  };

  // ── PWA manifest + service worker registration ──────────────────────────
  // Done from the component (rather than the Astro page) so we don't have
  // to modify the shared Layout.astro to add a head slot.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Inject manifest link if it isn't already there
    if (!document.querySelector('link[rel="manifest"][href*="claude-runner"]')) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/claude-runner/manifest.webmanifest';
      document.head.appendChild(link);
    }

    // Register service worker (Phase 2 minimal — installable PWA, push later)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/claude-runner/sw.js', { scope: '/projects/claude-runner' })
        .catch((err) => {
          console.warn('[claude-runner] SW registration failed:', err);
        });
    }
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────
  const wsStatusColor =
    ws.status === 'open'
      ? 'bg-emerald-500'
      : ws.status === 'connecting'
        ? 'bg-amber-500'
        : ws.status === 'error'
          ? 'bg-red-500'
          : 'bg-zinc-500';

  return (
    <div className="max-w-2xl mx-auto p-6 text-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full ${wsStatusColor}`} />
          <span className="text-sm text-text-muted">
            {ws.status === 'open' ? 'connected' : ws.status}
            {ws.lastError ? ` — ${ws.lastError}` : ''}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          {showSettings ? 'close' : 'settings'}
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mb-6 p-4 rounded-xl border border-surface-highlight bg-surface/50 space-y-3">
          <label className="block">
            <span className="text-xs text-text-muted">backend URL (WebSocket)</span>
            <input
              type="text"
              value={settings.backendUrl}
              onChange={(e) => updateSettings({ backendUrl: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background rounded-md text-sm font-mono border border-surface-highlight focus:outline-none focus:border-primary"
              placeholder="ws://localhost:8787"
            />
          </label>
          <label className="block">
            <span className="text-xs text-text-muted">Picovoice AccessKey (optional)</span>
            <input
              type="password"
              value={settings.picovoiceAccessKey}
              onChange={(e) => updateSettings({ picovoiceAccessKey: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-background rounded-md text-sm font-mono border border-surface-highlight focus:outline-none focus:border-primary"
              placeholder="paste from console.picovoice.ai"
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.wakeWordEnabled}
              disabled={!settings.picovoiceAccessKey}
              onChange={(e) => updateSettings({ wakeWordEnabled: e.target.checked })}
            />
            <span className="text-sm">
              enable wake word ({settings.picovoiceAccessKey ? `status: ${wakeWord.status}` : 'access key required'})
              {wakeWord.error ? ` — ${wakeWord.error}` : ''}
            </span>
          </label>
        </div>
      )}

      {/* Transcript */}
      <div className="mb-6 min-h-[200px] max-h-[400px] overflow-y-auto p-4 rounded-xl bg-surface/30 border border-surface-highlight space-y-2">
        {transcript.length === 0 && !pendingAgentText && (
          <div className="text-text-muted text-sm italic">
            Hold the button and ask something. The backend on your Mac will respond with voice.
          </div>
        )}
        {transcript.map((entry) => (
          <div key={entry.id} className="text-sm">
            <span
              className={
                entry.role === 'you'
                  ? 'text-primary font-semibold'
                  : entry.role === 'claude'
                    ? 'text-text font-semibold'
                    : 'text-text-muted italic'
              }
            >
              {entry.role === 'you' ? 'you: ' : entry.role === 'claude' ? 'claude: ' : '· '}
            </span>
            <span className={entry.role === 'system' ? 'text-text-muted italic' : ''}>
              {entry.text}
            </span>
          </div>
        ))}
        {pendingAgentText && (
          <div className="text-sm">
            <span className="text-text font-semibold">claude: </span>
            <span>{pendingAgentText}</span>
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
          </div>
        )}
        {isThinking && !pendingAgentText && (
          <div className="text-sm text-text-muted italic">thinking...</div>
        )}
      </div>

      {/* Push-to-talk button */}
      <div className="flex flex-col items-center gap-3 mb-6">
        <button
          type="button"
          onMouseDown={startTalking}
          onMouseUp={stopTalking}
          onMouseLeave={() => mic.isRecording && stopTalking()}
          onTouchStart={(e) => {
            e.preventDefault();
            startTalking();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopTalking();
          }}
          disabled={ws.status !== 'open'}
          className={`w-32 h-32 rounded-full text-sm font-semibold transition-all select-none
            ${
              mic.isRecording
                ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/40'
                : 'bg-primary text-black hover:scale-105'
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {mic.isRecording ? 'release to send' : 'hold to talk'}
        </button>
        {mic.permissionDenied && (
          <p className="text-xs text-red-400">mic permission denied — check browser settings</p>
        )}
        {mic.error && !mic.permissionDenied && (
          <p className="text-xs text-red-400">{mic.error}</p>
        )}
      </div>

      {/* Transport controls */}
      <div className="rounded-xl border border-surface-highlight p-4 bg-surface/30">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>{fmtTime(player.state.currentTime)}</span>
          <span>
            {player.state.status} · {player.state.rate.toFixed(2)}x
          </span>
          <span>{fmtTime(player.state.duration)}</span>
        </div>
        <div className="w-full h-1 bg-surface-highlight rounded mb-3">
          <div
            className="h-1 bg-primary rounded transition-all"
            style={{
              width:
                player.state.duration > 0
                  ? `${(player.state.currentTime / player.state.duration) * 100}%`
                  : '0%',
            }}
          />
        </div>
        <div className="grid grid-cols-7 gap-2">
          <button
            onClick={() => player.rewind(10)}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            -10s
          </button>
          <button
            onClick={() => player.rewind(5)}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            -5s
          </button>
          <button
            onClick={player.state.status === 'playing' ? player.pause : player.play}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-primary text-black hover:scale-105 text-xs font-semibold transition-transform disabled:opacity-30"
          >
            {player.state.status === 'playing' ? 'pause' : 'play'}
          </button>
          <button
            onClick={() => player.forward(5)}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            +5s
          </button>
          <button
            onClick={() => player.forward(10)}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            +10s
          </button>
          <button
            onClick={player.repeat}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            ↺
          </button>
          <button
            onClick={() => player.setRate(player.state.rate >= 2 ? 1 : player.state.rate + 0.25)}
            disabled={player.state.duration === 0}
            className="py-2 rounded bg-surface-highlight hover:bg-primary hover:text-black text-xs font-medium transition-colors disabled:opacity-30"
          >
            {player.state.rate.toFixed(2)}x
          </button>
        </div>
      </div>
    </div>
  );
}
