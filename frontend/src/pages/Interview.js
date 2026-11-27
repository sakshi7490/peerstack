import React, { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/interview.css";
import Navbar from "../components/Navbar";
import AnswerInput from "../components/AnswerInput";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { DEFAULT_SPEECH_LANG } from "../utils/speechTranscript";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [time, setTime] = useState(1000);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerMode, setAnswerMode] = useState("text");
  const [recordingIndex, setRecordingIndex] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitRef = useRef(null);
  const recordingIndexRef = useRef(null);
  const answersRef = useRef([]);

  const handleTranscriptChange = useCallback((committed) => {
    const index = recordingIndexRef.current;
    if (index === null || index === undefined) return;

    const updated = [...answersRef.current];
    updated[index] = committed;
    answersRef.current = updated;
    setAnswers(updated);
  }, []);

  const {
    isSupported,
    isListening,
    isStarting,
    interimTranscript,
    elapsedSeconds,
    error,
    start,
    stop,
    clearError,
  } = useSpeechRecognition({
    onTranscriptChange: handleTranscriptChange,
    lang: DEFAULT_SPEECH_LANG,
  });

  const answeredCount = answers.filter((ans) => ans.trim() !== "").length;

  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        const data = res.data.data.questions;

        const emptyAnswers = new Array(data.length).fill("");
        setQuestions(data);
        answersRef.current = emptyAnswers;
        setAnswers(emptyAnswers);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load interview");
      }
    };

    fetchInterview();
  }, [id]);

  const handleChange = (index, value) => {
    if (isSubmitting || isSubmitted) return;

    const updated = [...answersRef.current];
    updated[index] = value;
    answersRef.current = updated;
    setAnswers(updated);
  };

  const stopRecording = useCallback(() => {
    stop();
    recordingIndexRef.current = null;
    setRecordingIndex(null);
  }, [stop]);

  const startRecording = async (index) => {
    if (isSubmitting || isSubmitted) return;
    if (!isSupported) return;

    if (isListening) {
      stop();
    }

    clearError();
    setRecordingIndex(index);
    recordingIndexRef.current = index;

    const existing = answersRef.current[index] || "";
    await start(existing);
  };

  const retryRecording = async (index) => {
    if (isSubmitting || isSubmitted) return;

    recordingIndexRef.current = null;
    stop();
    handleChange(index, "");
    clearError();
    setRecordingIndex(index);
    recordingIndexRef.current = index;

    await start("");
  };

  const clearAnswer = (index) => {
    if (isSubmitting || isSubmitted) return;
    if (recordingIndex === index) {
      stopRecording();
    }
    handleChange(index, "");
  };

  const switchMode = (mode) => {
    if (isSubmitting || isSubmitted) return;
    if (mode === answerMode) return;

    if (isListening || recordingIndex !== null) {
      stopRecording();
    }

    setAnswerMode(mode);
    if (mode === "voice") {
      clearError();
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || isSubmitted) {
      return;
    }

    try {
      if (isListening || recordingIndex !== null) {
        stop();
        recordingIndexRef.current = null;
        setRecordingIndex(null);
      }

      setIsSubmitting(true);

      await API.post("/interview/submit", {
        interviewId: id,
        answers: answersRef.current,
      });

      setIsSubmitted(true);

      toast.success("Interview submitted successfully!");

      navigate(`/result/${id}`);
    } catch (err) {
      console.log(err);
      toast.error("Error submitting answers. Please try again.");

      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    submitRef.current = handleSubmit;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (submitRef.current) {
            submitRef.current();
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const controlsLocked = isSubmitting || isSubmitted;

  return (
    <>
      <Navbar />

      <div className="container">
        <h3
          className="timer"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: time <= 10 ? "red" : "black",
          }}
        >
          ⏱ Time Left: {time}s
        </h3>

        <div className="progress-container">
          <p style={{ textAlign: "center" }}>Progress: {progress}%</p>

          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <h2 className="title">Interview</h2>

        <div className="answer-mode-toggle" role="tablist" aria-label="Answer mode">
          <button
            type="button"
            role="tab"
            aria-selected={answerMode === "text"}
            className={`mode-btn${answerMode === "text" ? " active" : ""}`}
            onClick={() => switchMode("text")}
            disabled={controlsLocked}
          >
            Type Answer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={answerMode === "voice"}
            className={`mode-btn${answerMode === "voice" ? " active" : ""}`}
            onClick={() => switchMode("voice")}
            disabled={controlsLocked}
          >
            Speak Answer
          </button>
        </div>

        <p className="mode-hint">
          {answerMode === "text"
            ? "Type your answers below. You can switch to voice at any time without losing what you wrote."
            : "Speak your answers in Indian English. Finalized sentences stay saved if you pause. Edit the transcript before submitting."}
        </p>

        {answerMode === "voice" && !isSupported && (
          <div className="voice-alert" role="status">
            Voice input is not supported in this browser. You can keep typing
            your answers, or try Chrome or Edge for speech-to-text.
          </div>
        )}

        {questions.map((q, index) => {
          const isRecordingThis = recordingIndex === index && (isListening || isStarting);

          return (
            <div key={index} className="question-card">
              <p>
                <b>{q.question}</b>
              </p>

              <AnswerInput
                mode={answerMode}
                value={answers[index] || ""}
                onChange={(value) => handleChange(index, value)}
                disabled={controlsLocked}
                isSupported={isSupported}
                isRecording={isRecordingThis && isListening}
                isStarting={isRecordingThis && isStarting}
                elapsedSeconds={isRecordingThis ? elapsedSeconds : 0}
                interimTranscript={isRecordingThis ? interimTranscript : ""}
                error={recordingIndex === index ? error : null}
                onStartRecording={() => startRecording(index)}
                onStopRecording={stopRecording}
                onRetryRecording={() => retryRecording(index)}
                onClear={() => clearAnswer(index)}
              />
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          className="submit-btn"
          disabled={controlsLocked}
        >
          {isSubmitting
            ? "AI is evaluating your answers..."
            : isSubmitted
            ? "Submitted"
            : "Submit"}
        </button>
      </div>
    </>
  );
}

export default Interview;
