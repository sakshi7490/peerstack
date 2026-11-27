import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_SPEECH_LANG,
  joinTranscriptParts,
  normalizeInterviewTranscript,
  readSpeechResults,
  snapshotSessionTranscript,
} from "../utils/speechTranscript";

export function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function isSpeechRecognitionSupported() {
  return Boolean(getSpeechRecognitionConstructor());
}

export function getSpeechErrorMessage(code) {
  switch (code) {
    case "unsupported":
      return "Voice input is not supported in this browser. Please type your answer, or try Chrome or Edge.";
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone access was denied. Allow microphone permission in your browser settings, then try again.";
    case "audio-capture":
      return "No microphone was found. Connect a microphone and try again.";
    case "no-speech":
      return "No speech was detected. Click the microphone and try speaking again.";
    case "network":
      return "Speech recognition could not reach the service. Check your connection and try again.";
    case "start-failed":
      return "Could not start voice input. Stop any other recording and try again.";
    case "aborted":
      return null;
    default:
      return "Voice input ran into a problem. You can retry speaking or type your answer instead.";
  }
}

const FATAL_ERRORS = new Set([
  "not-allowed",
  "service-not-allowed",
  "audio-capture",
  "network",
]);

function useSpeechRecognition({
  onTranscriptChange,
  lang = DEFAULT_SPEECH_LANG,
} = {}) {
  const [isSupported] = useState(() => isSpeechRecognitionSupported());
  const [isListening, setIsListening] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);
  const startingRef = useRef(false);
  const baseTranscriptRef = useRef("");
  const finalizedRef = useRef("");
  const sessionFinalRef = useRef("");
  const interimRef = useRef("");
  const elapsedIntervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const generationRef = useRef(0);
  const langRef = useRef(lang);
  const onTranscriptChangeRef = useRef(onTranscriptChange);

  langRef.current = lang;
  onTranscriptChangeRef.current = onTranscriptChange;

  const stopTimer = useCallback(() => {
    if (elapsedIntervalRef.current) {
      clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = null;
    }
  }, []);

  const clearRestartTimeout = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const emitCommitted = useCallback(() => {
    const committed = normalizeInterviewTranscript(
      joinTranscriptParts(
        baseTranscriptRef.current,
        finalizedRef.current,
        sessionFinalRef.current
      )
    );
    onTranscriptChangeRef.current?.(committed);
    return committed;
  }, []);

  const flushInterimIntoFinal = useCallback(() => {
    finalizedRef.current = snapshotSessionTranscript(
      finalizedRef.current,
      joinTranscriptParts(sessionFinalRef.current, interimRef.current)
    );
    sessionFinalRef.current = "";
    interimRef.current = "";
    setInterimTranscript("");
  }, []);

  const detachRecognition = useCallback((abort = true) => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    recognition.onstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;

    if (abort) {
      try {
        recognition.abort();
      } catch {
        // Recognition may already be stopped.
      }
    }

    recognitionRef.current = null;
  }, []);

  const attachAndStart = useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionConstructor();
    if (!SpeechRecognitionCtor || !shouldListenRef.current) {
      return false;
    }

    const generation = generationRef.current;
    detachRecognition(false);

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.lang = langRef.current || DEFAULT_SPEECH_LANG;

    recognition.onstart = () => {
      if (generation !== generationRef.current || !shouldListenRef.current) return;
      startingRef.current = false;
      setIsStarting(false);
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      if (generation !== generationRef.current || !shouldListenRef.current) return;

      const { finalText, interimText } = readSpeechResults(event.results);
      sessionFinalRef.current = finalText;
      interimRef.current = interimText;
      setInterimTranscript(interimText);
      setError(null);
      emitCommitted();
    };

    recognition.onerror = (event) => {
      if (generation !== generationRef.current) return;

      const code = event.error;

      if (code === "aborted") {
        return;
      }

      if (code === "no-speech") {
        return;
      }

      if (FATAL_ERRORS.has(code)) {
        shouldListenRef.current = false;
        startingRef.current = false;
        generationRef.current += 1;
        clearRestartTimeout();
        stopTimer();
        flushInterimIntoFinal();
        emitCommitted();
        setIsListening(false);
        setIsStarting(false);
        setError(code);
        return;
      }

      setError(code || "unknown");
    };

    recognition.onend = () => {
      if (generation !== generationRef.current) {
        return;
      }

      finalizedRef.current = snapshotSessionTranscript(
        finalizedRef.current,
        sessionFinalRef.current
      );
      sessionFinalRef.current = "";

      if (shouldListenRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          if (generationRef.current !== generation || !shouldListenRef.current) {
            return;
          }
          attachAndStart();
        }, 120);
        return;
      }

      flushInterimIntoFinal();
      emitCommitted();
      stopTimer();
      startingRef.current = false;
      setIsListening(false);
      setIsStarting(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch {
      shouldListenRef.current = false;
      startingRef.current = false;
      setIsListening(false);
      setIsStarting(false);
      stopTimer();
      setError("start-failed");
      recognitionRef.current = null;
      return false;
    }
  }, [
    clearRestartTimeout,
    detachRecognition,
    emitCommitted,
    flushInterimIntoFinal,
    stopTimer,
  ]);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    startingRef.current = false;
    generationRef.current += 1;
    clearRestartTimeout();

    flushInterimIntoFinal();
    emitCommitted();
    stopTimer();
    setIsListening(false);
    setIsStarting(false);

    const recognition = recognitionRef.current;
    if (recognition) {
      try {
        recognition.stop();
      } catch {
        // Already stopped.
      }
    }
  }, [clearRestartTimeout, emitCommitted, flushInterimIntoFinal, stopTimer]);

  const start = useCallback(
    async (existingText = "") => {
      const SpeechRecognitionCtor = getSpeechRecognitionConstructor();

      if (!SpeechRecognitionCtor) {
        setError("unsupported");
        return false;
      }

      if (shouldListenRef.current || startingRef.current) {
        return false;
      }

      setError(null);
      startingRef.current = true;
      setIsStarting(true);
      setElapsedSeconds(0);
      setInterimTranscript("");

      baseTranscriptRef.current = (existingText || "").trim();
      finalizedRef.current = "";
      sessionFinalRef.current = "";
      interimRef.current = "";

      clearRestartTimeout();
      generationRef.current += 1;
      shouldListenRef.current = true;
      detachRecognition(true);

      stopTimer();
      elapsedIntervalRef.current = setInterval(() => {
        setElapsedSeconds((seconds) => seconds + 1);
      }, 1000);

      const started = attachAndStart();
      if (!started) {
        startingRef.current = false;
        setIsStarting(false);
        return false;
      }

      return true;
    },
    [attachAndStart, clearRestartTimeout, detachRecognition, stopTimer]
  );

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      startingRef.current = false;
      generationRef.current += 1;
      clearRestartTimeout();
      stopTimer();
      detachRecognition(true);
    };
  }, [clearRestartTimeout, detachRecognition, stopTimer]);

  return {
    isSupported,
    isListening,
    isStarting,
    interimTranscript,
    error,
    elapsedSeconds,
    lang: langRef.current,
    start,
    stop,
    clearError: () => setError(null),
  };
}

export default useSpeechRecognition;
