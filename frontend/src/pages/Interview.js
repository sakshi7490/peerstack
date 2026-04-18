import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import API from "../services/api";
import "../styles/interview.css";
import Navbar from "../components/Navbar";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  

  const [time, setTime] = useState(300);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // ✅ Progress calculation
  const answeredCount = answers.filter((ans) => ans.trim() !== "").length;
  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  // ✅ Fetch interview
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        const data = res.data.data.questions;

        setQuestions(data);
        setAnswers(new Array(data.length).fill(""));
      } catch (err) {
        console.log(err);
        toast.error("Failed to load interview");
      }
    };

    fetchInterview();
  }, [id]);

  

  // ✅ Timer
  useEffect(() => {
  const timer = setInterval(() => {
    setTime((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        submitRef.current(); // ✅ use ref
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, []);

  // ✅ Handle input
  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  // ✅ Submit
  const handleSubmit = async () => {
    try {
      await API.post("/interview/submit", {
        interviewId: id,
        answers,
      });

      navigate(`/result/${id}`);
    } catch (err) {
      console.log(err);
      toast.error("Error submitting answers");
    }
  };

  const submitRef = useRef(handleSubmit);
  

  return (
    <>
      <Navbar />

      <div className="container">

        {/* 🔥 TIMER */}
        <h3
          className="timer"
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: time <= 10 ? "red" : "black"
          }}
        >
          ⏱ Time Left: {time}s
        </h3>

        {/* 🔥 PROGRESS */}
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

        {/* 🔥 QUESTIONS */}
        {questions.map((q, index) => (
          <div key={index} className="question-card">
            <p><b>{q.question}</b></p>

            <input
              type="text"
              placeholder="Your answer"
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              className="input-box"
            />
          </div>
        ))}

        {/* 🔥 SUBMIT */}
        <button onClick={handleSubmit} className="submit-btn">
          Submit
        </button>
      </div>
    </>
  );
}

export default Interview;