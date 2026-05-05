import { useEffect, useRef, useState } from "react";
import { Mic } from "lucide-react";
import type { AppSettings, Challenge, ChallengeKind } from "../types";
import { classNames } from "../ui";
import { ChallengeHeader } from "./ChallengeHeader";
import { CheckButton } from "./CheckButton";
import { FallbackButton } from "./FallbackButton";
import {
  makeWordTokens,
  shuffleTokens,
  WordBankInput,
  type WordToken,
} from "./WordBankInput";

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      length: number;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function VoiceChallenge({
  challenge,
  settings,
  onComplete,
}: {
  challenge: Challenge;
  settings: AppSettings;
  onComplete: (answer: string, resultKind: ChallengeKind) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [typed, setTyped] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState<"type" | "bank" | null>(settings.voiceEnabled ? null : "type");
  const [selectedWords, setSelectedWords] = useState<WordToken[]>([]);
  const [availableWords, setAvailableWords] = useState<WordToken[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const bankEligible = challenge.answer.split(/\s+/).length <= 28;
  const Recognition =
    typeof window !== "undefined" ? window.SpeechRecognition ?? window.webkitSpeechRecognition : undefined;

  useEffect(() => {
    setTranscript("");
    setTyped("");
    setError("");
    setFallback(settings.voiceEnabled ? null : "type");
    setSelectedWords([]);
    setAvailableWords(shuffleTokens(makeWordTokens(challenge.answer)));

    return () => recognitionRef.current?.abort();
  }, [challenge, settings.voiceEnabled]);

  function startListening() {
    if (!Recognition) {
      setError("Speech recognition is not available in this browser.");
      setFallback("type");
      return;
    }

    setError("");
    setTranscript("");

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let nextTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        nextTranscript += event.results[index][0].transcript;
      }
      setTranscript(nextTranscript.trim());
    };
    recognition.onerror = (event) => {
      setError(event.error ? `Voice error: ${event.error}` : "Voice recognition stopped.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  if (fallback === "type") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={{ ...challenge, prompt: `${challenge.prompt}\nType it instead.` }} />
        <textarea
          value={typed}
          onChange={(event) => setTyped(event.currentTarget.value)}
          rows={8}
          placeholder="Type from memory"
          className="w-full resize-y rounded-lg border border-white/10 bg-black/25 p-4 text-base leading-7 text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/60"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <CheckButton disabled={!typed.trim()} onClick={() => onComplete(typed, "type")} />
          <FallbackButton onClick={() => setFallback(null)}>Try Voice</FallbackButton>
        </div>
      </article>
    );
  }

  if (fallback === "bank") {
    return (
      <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
        <ChallengeHeader challenge={{ ...challenge, prompt: `${challenge.prompt}\nUse the word bank.` }} />
        <WordBankInput
          availableWords={availableWords}
          selectedWords={selectedWords}
          onAvailableWordsChange={setAvailableWords}
          onSelectedWordsChange={setSelectedWords}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <CheckButton
            disabled={selectedWords.length === 0 || availableWords.length > 0}
            onClick={() => onComplete(selectedWords.map((word) => word.text).join(" "), "wordBank")}
          />
          <FallbackButton onClick={() => setFallback(null)}>Try Voice</FallbackButton>
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <ChallengeHeader challenge={challenge} />
      <div className="grid gap-4 rounded-lg border border-white/10 bg-black/25 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            className={classNames(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-base font-bold transition",
              listening
                ? "bg-red-300 text-black hover:bg-red-200"
                : "bg-emerald-300 text-black hover:bg-emerald-200",
            )}
          >
            <Mic className="h-5 w-5" />
            {listening ? "Stop" : "Start Reciting"}
          </button>
          <FallbackButton onClick={() => setFallback("type")}>Type Instead</FallbackButton>
          {bankEligible && <FallbackButton onClick={() => setFallback("bank")}>Word Bank</FallbackButton>}
        </div>

        {!Recognition && (
          <p className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3 text-sm leading-6 text-amber-100">
            Speech recognition is not available here. Use the typing fallback for this challenge.
          </p>
        )}

        {error && (
          <p className="rounded-md border border-red-300/30 bg-red-300/10 p-3 text-sm leading-6 text-red-100">
            {error}
          </p>
        )}

        <div className="min-h-28 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-base leading-7 text-white/75">
          {transcript || "Your transcript will appear here."}
        </div>
      </div>
      <CheckButton disabled={!transcript.trim()} onClick={() => onComplete(transcript, "voice")} />
    </article>
  );
}
