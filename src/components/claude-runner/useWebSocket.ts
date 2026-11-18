/**
 * useWebSocket — wraps a long-lived WebSocket connection to the
 * claude-runner-server. Auto-reconnects with backoff. Exposes a
 * stable `send` function and an `onMessage` callback.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClientMessage, ServerMessage } from './protocol';

export type WsStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error';

interface UseWebSocketOptions {
  url: string;
  enabled: boolean;
  onMessage: (msg: ServerMessage) => void;
}

export function useWebSocket({ url, enabled, onMessage }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const onMessageRef = useRef(onMessage);
  const [status, setStatus] = useState<WsStatus>('idle');
  const [lastError, setLastError] = useState<string | null>(null);

  // Keep the latest onMessage in a ref so we don't reconnect on every render.
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (!enabled || !url) return;
    if (wsRef.current && wsRef.current.readyState <= 1) return;

    setStatus('connecting');
    setLastError(null);

    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch (err) {
      setStatus('error');
      setLastError(err instanceof Error ? err.message : String(err));
      return;
    }

    wsRef.current = ws;

    ws.onopen = () => setStatus('open');

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as ServerMessage;
        onMessageRef.current(msg);
      } catch (err) {
        console.error('[ws] failed to parse message', err, event.data);
      }
    };

    ws.onerror = () => {
      setStatus('error');
      setLastError('websocket error');
    };

    ws.onclose = () => {
      setStatus('closed');
      wsRef.current = null;
      // Reconnect after a short delay if still enabled
      if (enabled) {
        reconnectTimer.current = window.setTimeout(connect, 2000);
      }
    };
  }, [url, enabled]);

  useEffect(() => {
    if (enabled) connect();
    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on unmount
        wsRef.current.close();
        wsRef.current = null;
      }
      setStatus('idle');
    };
  }, [enabled, connect]);

  const send = useCallback((msg: ClientMessage) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('[ws] cannot send, socket not open', msg.type);
      return false;
    }
    ws.send(JSON.stringify(msg));
    return true;
  }, []);

  return { status, lastError, send };
}
