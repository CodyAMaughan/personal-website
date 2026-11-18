/**
 * WebSocket message protocol — must match claude-runner-server's
 * src/protocol.ts. Hand-mirrored here so the personal-website doesn't
 * need a workspace dependency on the server repo.
 */

export type ClientMessage =
  | { type: 'user_text'; text: string }
  | { type: 'user_audio'; audio_b64: string; mime_type: string }
  | { type: 'cancel' }
  | { type: 'status' }
  | {
      type: 'subscribe_push';
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

export type ServerMessage =
  | { type: 'transcribed'; text: string }
  | { type: 'agent_text'; text: string }
  | { type: 'agent_audio'; chunk_id: number; audio_b64: string }
  | { type: 'agent_done'; result?: string }
  | { type: 'agent_error'; message: string }
  | { type: 'status'; text: string }
  | { type: 'ready'; version: string };
