import "../styles/result.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate(); // 🔥 ADD THIS

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/interview/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchResult();
  }, [id]);

  if (!data) {
  return (
    <>
      <Navbar />
      <div className="container">
        <div className="skeleton title-skeleton"></div>

        <div className="skeleton score-skeleton"></div>

        <div className="skeleton text-skeleton"></div>
        <div className="skeleton text-skeleton"></div>

        <div className="skeleton card-skeleton"></div>
        <div className="skeleton card-skeleton"></div>
      </div>
    </>
  );
}

  return (
  <>
    <Navbar />

    <div className="result-container">

      {/* 🔥 Header */}
      <div className="result-header">
        <h2>Interview Analysis</h2>
        <p>Your performance breakdown</p>
      </div>

      {/* 🔥 Score Card */}
      <div className="score-card">
        <div className="score-circle">
          {data.feedback ? data.score : "--"}
        </div>
        <p>
          {data.feedback ? "Overall Score" : "Not Evaluated Yet"}
        </p>
      </div>

      {/* 🔥 Feedback Section */}
      <div className="section">
        <h3>AI Feedback</h3>

        <div className="feedback-box">
          {data.feedback ? (
            data.feedback.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))
          ) : (
            <p>Complete interview to see feedback</p>
          )}
        </div>
      </div>

      {/* 🔥 Q&A Section */}
      <div className="section">
        <h3>Questions & Answers</h3>

        <div className="qa-grid">
          {data.questions.map((q, index) => (
            <div key={index} className="qa-card">
              <p className="question">{q.question}</p>
              <p className="answer">
                {q.answer || "Not answered"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 Button */}
      <button
        className="result-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

    </div>
  </>
);
}

export default Result;