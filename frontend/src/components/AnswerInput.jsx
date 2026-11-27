import React from "react";
import { getSpeechErrorMessage } from "../hooks/useSpeechRecognition";

function formatElapsed(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function AnswerInput({
  value,
  onChange,
  disabled,
  mode,
  isSupported,
  isRecording,
  isStarting,
  elapsedSeconds,
  error,
  interimTranscript = "",
  onStartRecording,
  onStopRecording,
  onRetryRecording,
  onClear,
}) {
  const locked = disabled || isStarting;
  const errorMessage = error ? getSpeechErrorMessage(error) : "";

  if (mode === "text") {
    return (
      <textarea
        className="input-box answer-textarea"
        placeholder="Your answer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        rows={4}
      />
    );
  }

  return (
    <div className="voice-answer">
      {isSupported && (
        <div className="voice-toolbar">
          <button
            type="button"
            className={`mic-btn${isRecording ? " is-recording" : ""}`}
            onClick={isRecording ? onStopRecording : onStartRecording}
            disabled={locked || (!isRecording && !isSupported)}
            aria-pressed={isRecording}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            <span className="mic-icon" aria-hidden="true">
              {isRecording ? "■" : "🎤"}
            </span>
          </button>

          <div className="voice-status">
            {isRecording ? (
              <>
                <span className="rec-dot" aria-hidden="true" />
                <span>Microphone active</span>
                <span className="rec-timer">{formatElapsed(elapsedSeconds)}</span>
              </>
            ) : isStarting ? (
              <span>Starting microphone…</span>
            ) : value.trim() ? (
              <span>
                Transcript saved — edit it, retry to replace it, or record again
                to add more.
              </span>
            ) : (
              <span>Click the microphone and speak your answer in English.</span>
            )}
          </div>
        </div>
      )}

      {isRecording && (
        <div className="voice-live" aria-live="polite">
          <div className="voice-live-label">Live transcription</div>
          {interimTranscript ? (
            <p className="voice-interim">{interimTranscript}</p>
          ) : (
            <p className="voice-live-wait">Listening… pause anytime; earlier sentences stay saved.</p>
          )}
        </div>
      )}

      <div className="voice-final-label">
        {isRecording ? "Finalized transcript (updates as phrases lock in)" : "Editable transcript"}
      </div>
      <textarea
        className="input-box answer-textarea"
        placeholder={
          isRecording
            ? "Finalized sentences appear here as you speak."
            : "Your transcribed answer will appear here. You can edit it before submitting."
        }
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled || isRecording}
        rows={5}
      />

      {errorMessage && (
        <div className="voice-alert voice-alert-error" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="voice-actions">
        {isRecording ? (
          <button
            type="button"
            className="voice-action-btn stop"
            onClick={onStopRecording}
            disabled={disabled}
          >
            Stop recording
          </button>
        ) : (
          <>
            <button
              type="button"
              className="voice-action-btn"
              onClick={onRetryRecording}
              disabled={locked || !isSupported}
            >
              {value.trim() ? "Retry recording" : "Start recording"}
            </button>
            <button
              type="button"
              className="voice-action-btn ghost"
              onClick={onClear}
              disabled={disabled || !value}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AnswerInput;
