# claude-runner — web frontend

The PWA half of [claude-runner](../../../../../claude-runner). A React island that runs at `/projects/claude-runner`, hosting:

- WebSocket client to your Mac-side backend
- Push-to-talk recording via `MediaRecorder`
- Web Audio playback with full transport control (rewind, pause, faster/slower, repeat)
- Optional Picovoice Porcupine wake-word detection
- Media Session API integration for AirPods + lock-screen controls
- Local deterministic command parser
- PWA manifest + service worker (installable to Android home screen)

## File map

```
src/components/claude-runner/
├── App.tsx              # root component, wires everything together
├── protocol.ts          # mirrors the backend's WebSocket message types
├── commandParser.ts     # deterministic local "pause/rewind/faster/etc." parser
├── useWebSocket.ts      # auto-reconnecting WS client
├── useMicRecorder.ts    # MediaRecorder push-to-talk
├── useAudioPlayer.ts    # Web Audio buffer + transport control
├── useWakeWord.ts       # Picovoice Porcupine (graceful fallback if no key)
├── useMediaSession.ts   # OS-level media controls (AirPods, lock screen)
└── README.md            # this file

src/pages/projects/claude-runner.astro     # Astro page hydrating the React island
public/claude-runner/manifest.webmanifest  # PWA manifest scoped to /projects/claude-runner
public/claude-runner/sw.js                 # service worker (install / push scaffold)
```

Nothing else in the personal-website was touched.

## Run locally

```bash
# 1) Start the backend in another terminal
cd ../../../../../claude-runner
npm start
# → ws://localhost:8787

# 2) Start the Astro dev server
cd -                    # back to personal-website root
npm run dev
# → http://localhost:4321

# 3) Open the page
open http://localhost:4321/projects/claude-runner
```

In the browser:
1. Click **settings** → confirm `backend URL` is `ws://localhost:8787` (default)
2. Hold the big button → talk → release
3. You should see your transcript appear, then Claude's response, then audio plays
4. Try the transport buttons (rewind, faster, etc.) to validate the player works

## Connecting from your Android phone

The dev server runs on your Mac at `localhost:4321`, which your phone can't reach. Use **Tailscale Funnel** to expose both the Astro dev server AND the WebSocket backend over the public internet.

```bash
# One-time: install Tailscale on your Mac
brew install tailscale
sudo tailscale up

# Enable Funnel for the WebSocket backend (port 8787)
tailscale funnel 8787

# In a separate shell, enable Funnel for the Astro dev server (port 4321)
tailscale funnel 4321
```

`tailscale funnel` will print public URLs like `https://your-mac.tail-XXXX.ts.net/`. On your phone:

1. Open the Astro funnel URL (e.g. `https://your-mac.tail-XXXX.ts.net/projects/claude-runner`) in Chrome
2. Open settings → set the backend URL to the WSS funnel URL: `wss://your-mac.tail-XXXX.ts.net` (note `wss://` not `ws://`)
3. Allow mic permission
4. Hold to talk

To install as a PWA: in Chrome's menu, choose "Add to Home screen". The app launches in standalone mode (no browser chrome) from then on.

## Picovoice wake word setup (optional)

Without Picovoice you have push-to-talk only. To add hands-free "hey claude" wake-word detection:

1. Sign up at [console.picovoice.ai](https://console.picovoice.ai/) (free)
2. Copy your **AccessKey**
3. Download the Porcupine params model from
   [github.com/Picovoice/porcupine](https://github.com/Picovoice/porcupine/blob/master/lib/common/porcupine_params.pv)
   and save to `public/claude-runner/porcupine_params.pv`
4. (Optional) Train a custom "hey claude" keyword in the Picovoice console for the **Web (WASM)** platform, download the `.ppn`, and save to `public/claude-runner/hey_claude.ppn`. Without this, the built-in "Computer" keyword is used.
5. In the app's settings panel, paste your AccessKey and toggle **enable wake word**

## Voice command vocabulary

These work locally on the phone — they don't round-trip to the backend.

| Phrase | Action |
|---|---|
| `pause` / `hold on` / `wait` | Pause playback |
| `play` / `resume` / `continue` | Resume playback |
| `stop` / `cancel` / `shut up` / `nevermind` | Cancel agent + stop playback |
| `repeat` / `say that again` | Replay current response from start |
| `rewind 10` / `back five` / `go back twenty` | Seek backward N seconds |
| `forward 5` / `skip ahead 10` | Seek forward N seconds |
| `faster` / `speed up` | +0.25× playback rate |
| `slower` / `slow down` | -0.25× playback rate |
| `normal speed` / `reset speed` | 1.0× playback rate |
| `status` / `what are you doing` | Ask backend for current task status |

If the transcribed text doesn't match any command, it's treated as a chat message and forwarded to the backend. The parser tolerates a leading "hey claude" / "claude" / "hey, cloud" (Whisper occasionally mishears the wake word).

## Known limitations

- **Background operation**: in Chrome, the page suspends when backgrounded. Phase 3 (Capacitor APK with foreground service) fixes this.
- **Music coexistence**: Web Audio playback usually pauses Spotify rather than ducking it. Phase 3 with Capacitor's audio session control fixes this.
- **Wake-word capture timing**: when the wake word fires, the app starts a fresh recording for ~3.5s. If you say "hey claude pause" too fast, the "pause" might be missed. We can fix this by tapping the WebVoiceProcessor ring buffer to capture audio AROUND the detection — Phase 2.5.
- **Streaming TTS**: the backend currently buffers Claude's full response then synthesizes once. Sentence-by-sentence streaming for lower latency is Phase 2.5.

## Test paths

| What | Command / file |
|---|---|
| Type-check | `npx astro check` (clean as of build) |
| Page renders | `curl -I http://localhost:4321/projects/claude-runner` → 200 |
| All hooks compile | All return 200 from `/src/components/claude-runner/*.ts(x)` via Vite |
| Backend smoke test | See `claude-runner/test/test-ws-smoke.ts` — full WebSocket round-trip validated |
| Real API round-trip | See `claude-runner/test/test-pipeline.ts` — Whisper → Claude → TTS validated end-to-end |

The actual browser runtime (mic permission, audio playback, transport controls) needs a human in front of the browser to validate. Everything that can be tested from a CLI has been.
