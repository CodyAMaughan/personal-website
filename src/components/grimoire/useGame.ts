import { useCallback, useEffect, useRef, useState } from "react";
import { clone, newGame } from "./engine/state";
import type { Game } from "./engine/types";

const KEY = "grimoire:game:v1";
const HISTORY = 60;

function load(): Game {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const g = JSON.parse(raw) as Game;
      if (g?.version === 1) return g;
    }
  } catch {
    /* ignore */
  }
  return newGame();
}

export function useGame() {
  const [game, setGame] = useState<Game>(() => (typeof window === "undefined" ? newGame() : load()));
  const past = useRef<Game[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(game));
    } catch {
      /* storage full or unavailable */
    }
  }, [game]);

  /** Replace the game, remembering the previous state for undo. */
  const commit = useCallback((next: Game | ((g: Game) => Game)) => {
    setGame((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      if (value === prev) return prev;
      past.current = [...past.current.slice(-HISTORY + 1), prev];
      setCanUndo(true);
      return value;
    });
  }, []);

  /** Convenience: mutate a clone. */
  const update = useCallback(
    (fn: (g: Game) => void) =>
      commit((prev) => {
        const g = clone(prev);
        fn(g);
        return g;
      }),
    [commit],
  );

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (prev) setGame(prev);
    setCanUndo(past.current.length > 0);
  }, []);

  return { game, commit, update, undo, canUndo };
}

/* ------------------------------------------------------------------ */
/* Share links: the whole game, compressed into the URL hash           */
/* ------------------------------------------------------------------ */

const b64url = (bytes: Uint8Array) => {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream) {
  const out = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export async function encodeGame(g: Game): Promise<string> {
  const json = new TextEncoder().encode(JSON.stringify(g));
  if (typeof CompressionStream !== "undefined") return "z" + b64url(await pipe(json, new CompressionStream("deflate-raw")));
  return "j" + b64url(json);
}

export async function decodeGame(code: string): Promise<Game> {
  const body = fromB64url(code.slice(1));
  const bytes = code[0] === "z" ? await pipe(body, new DecompressionStream("deflate-raw")) : body;
  const g = JSON.parse(new TextDecoder().decode(bytes)) as Game;
  if (g?.version !== 1 || !Array.isArray(g.players)) throw new Error("That doesn't look like a saved game.");
  return g;
}
