"use client";

import { Play, Pause, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** When set, the button plays this URL as an HTMLAudioElement. */
  audioUrl?: string;
  /** Plain-text version of the article — used when audioUrl is absent (Web Speech). */
  text?: string;
  className?: string;
};

/**
 * "Ouvir matéria" — dual mode.
 *  • audioUrl present → standard <audio> element (server-generated TTS).
 *  • otherwise → browser's SpeechSynthesis API, pt-BR voice when available.
 *
 * Web Speech support varies by browser; we gracefully hide the controls if
 * unsupported. Respects prefers-reduced-motion: the playback itself still
 * works (audio isn't motion), only animated transitions are toned down.
 */
export function TTSButton({ audioUrl, text, className = "" }: Props) {
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [rate, setRate] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (audioUrl) {
      setSupported(true);
      return;
    }
    setSupported(
      typeof window !== "undefined" && "speechSynthesis" in window,
    );
  }, [audioUrl]);

  // Pick a pt-BR voice when available.
  const ptVoice = useMemo(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window))
      return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang?.toLowerCase().startsWith("pt-br")) ??
      voices.find((v) => v.lang?.toLowerCase().startsWith("pt")) ??
      null
    );
  }, [state]); // re-evaluate after voiceschanged fires (rough heuristic)

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  }, []);

  const play = useCallback(() => {
    if (state === "paused") {
      if (audioRef.current) audioRef.current.play();
      else if (typeof window !== "undefined") window.speechSynthesis.resume();
      setState("playing");
      return;
    }

    if (audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setState("idle");
      }
      audioRef.current.playbackRate = rate;
      audioRef.current.play();
      setState("playing");
      return;
    }

    if (!text || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = ptVoice?.lang ?? "pt-BR";
    if (ptVoice) utter.voice = ptVoice;
    utter.rate = rate;
    utter.onend = () => setState("idle");
    utter.onerror = () => setState("idle");
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
    setState("playing");
  }, [audioUrl, text, rate, state, ptVoice]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    } else if (typeof window !== "undefined") {
      window.speechSynthesis.pause();
    }
    setState("paused");
  }, []);

  if (!supported) return null;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1.5 ${className}`}
    >
      <Volume2 className="ml-1.5 h-4 w-4 text-brand-600 dark:text-brand-300" />
      <span className="text-xs font-medium text-[var(--content-soft)]">
        Ouvir matéria
      </span>

      {state === "playing" ? (
        <button
          type="button"
          onClick={pause}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
          aria-label="Pausar leitura"
        >
          <Pause className="h-3.5 w-3.5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={play}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700"
          aria-label="Iniciar leitura"
        >
          <Play className="h-3.5 w-3.5" />
        </button>
      )}

      {state !== "idle" && (
        <button
          type="button"
          onClick={stop}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-[var(--content-soft)] transition hover:text-[var(--content)]"
          aria-label="Parar leitura"
        >
          <Square className="h-3 w-3" />
        </button>
      )}

      <select
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="rounded-full bg-transparent px-1.5 py-0.5 text-xs text-[var(--content-soft)] outline-none transition hover:text-[var(--content)]"
        aria-label="Velocidade da leitura"
      >
        <option value={0.85}>0.85×</option>
        <option value={1}>1×</option>
        <option value={1.15}>1.15×</option>
        <option value={1.3}>1.3×</option>
        <option value={1.5}>1.5×</option>
      </select>
    </div>
  );
}
