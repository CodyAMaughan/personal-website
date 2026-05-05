import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";

export function ReadAloudButton({
  text,
  audioSrc,
}: {
  text: string;
  audioSrc?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;
  const supported = Boolean(audioSrc) || speechSupported;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, [speechSupported, text, audioSrc]);

  function stopAudio() {
    audioRef.current?.pause();
    audioRef.current = null;
    if (speechSupported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function speakWithBrowserVoice() {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  function toggleSpeech() {
    if (!supported) return;
    if (speaking) {
      stopAudio();
      return;
    }

    if (!audioSrc) {
      speakWithBrowserVoice();
      return;
    }

    stopAudio();
    const audio = new Audio(audioSrc);
    audioRef.current = audio;
    audio.onended = () => setSpeaking(false);
    audio.onerror = () => {
      audioRef.current = null;
      speakWithBrowserVoice();
    };
    void audio.play().catch(() => {
      audioRef.current = null;
      speakWithBrowserVoice();
    });
    setSpeaking(true);
  }

  return (
    <button
      type="button"
      disabled={!supported}
      onClick={toggleSpeech}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-bold text-white/75 transition hover:border-emerald-300/40 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-45"
    >
      <Volume2 className="h-4 w-4" />
      {speaking ? "Stop Audio" : "Read Aloud"}
    </button>
  );
}
