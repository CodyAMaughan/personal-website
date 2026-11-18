/**
 * Local command parser. Deterministic regex matching on transcribed
 * text — runs on the phone, never round-trips to the backend for
 * transport-control commands.
 *
 * Wake word "hey claude" is the trigger; this parser handles whatever
 * comes after it. Both "hey claude pause" and just "pause" (after wake
 * word fires) are handled — the parser tolerates an optional leading
 * "hey claude" prefix in case the transcription includes it.
 */

export type ParsedCommand =
  | { kind: 'pause' }
  | { kind: 'play' }
  | { kind: 'stop' }
  | { kind: 'rewind'; seconds: number }
  | { kind: 'forward'; seconds: number }
  | { kind: 'repeat' }
  | { kind: 'faster' }
  | { kind: 'slower' }
  | { kind: 'normal_speed' }
  | { kind: 'next' }
  | { kind: 'status' }
  | { kind: 'start_dictation' }
  | { kind: 'send_dictation' }
  | { kind: 'cancel_dictation' }
  | { kind: 'chat'; text: string };

const NUMBER_WORDS: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  fifteen: 15,
  twenty: 20,
  thirty: 30,
  sixty: 60,
};

function extractNumber(text: string): number | null {
  const digit = text.match(/\b(\d+)\b/);
  if (digit && digit[1]) return parseInt(digit[1], 10);
  for (const [word, n] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(text)) return n;
  }
  return null;
}

/**
 * Strip a leading "hey claude" / "claude" / "hey, claude" / etc.
 * Whisper sometimes spells it as "Claude" or "cloud" — handle the
 * common transcription mistakes too.
 */
function stripWakeWord(text: string): string {
  return text
    .replace(/^\s*(hey|hi|yo|ok|okay)?\s*[, ]*\s*(claude|cloud|clyde|clawed)\s*[, ]*\s*/i, '')
    .trim();
}

export function parseCommand(rawText: string): ParsedCommand {
  const text = stripWakeWord(rawText).toLowerCase().trim();

  if (!text) return { kind: 'chat', text: '' };

  // Transport — order matters, check more-specific patterns first
  if (/^(pause|hold on|wait)$/i.test(text)) return { kind: 'pause' };
  if (/^(play|resume|continue|go on|keep going)$/i.test(text)) return { kind: 'play' };
  if (/^(stop|cancel|shut up|never ?mind|forget it)$/i.test(text)) return { kind: 'stop' };
  if (/^(repeat|say (that|it) again|what|come again)$/i.test(text)) return { kind: 'repeat' };
  if (/^(faster|speed up)$/i.test(text)) return { kind: 'faster' };
  if (/^(slower|slow down)$/i.test(text)) return { kind: 'slower' };
  if (/^(normal speed|reset speed|one x)$/i.test(text)) return { kind: 'normal_speed' };
  if (/^(next|skip)$/i.test(text)) return { kind: 'next' };
  if (/^(status|what are you doing|what'?s happening)\??$/i.test(text)) return { kind: 'status' };

  // rewind / forward with optional duration
  if (/^(rewind|back|go back)\b/.test(text)) {
    const n = extractNumber(text);
    return { kind: 'rewind', seconds: n ?? 10 };
  }
  if (/^(forward|skip ahead|ahead)\b/.test(text)) {
    const n = extractNumber(text);
    return { kind: 'forward', seconds: n ?? 10 };
  }

  // Dictation mode
  if (/^(start|begin|new (chat|message)|dictate)\b/.test(text)) {
    return { kind: 'start_dictation' };
  }
  if (/^(send|that'?s it|done|go|that's all)$/i.test(text)) {
    return { kind: 'send_dictation' };
  }

  // Anything else heard inside dictation mode is treated as chat content
  return { kind: 'chat', text: rawText.trim() };
}
