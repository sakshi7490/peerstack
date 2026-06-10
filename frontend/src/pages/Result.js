import "../styles/result.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Result() {
  const { id } = useParams();
  const navigate = useNavigate(); // 🔥 ADD THIS

  const [data, setData] = useState(null);

  const parseFeedback = (feedback) => {
  if (!feedback) return {};

  const sections = {
    strengths: [],
    weaknesses: [],
    suggestions: [],
    learningPath: [],
  };

  const lines = feedback.split("\n");

  let currentSection = "";

  lines.forEach((line) => {
    line = line.trim();

    if (line.startsWith("Strengths:")) {
      currentSection = "strengths";
    } else if (line.startsWith("Weaknesses:")) {
      currentSection = "weaknesses";
    } else if (line.startsWith("Suggestions:")) {
      currentSection = "suggestions";
    } else if (line.startsWith("Recommended Learning Path:")) {
      currentSection = "learningPath";
    } else if (
      line.startsWith("-") ||
      /^\d+\./.test(line)
    ) {
      sections[currentSection]?.push(
        line.replace(/^-\s*/, "")
      );
    }
  });

  return sections;
};

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

const feedbackData = parseFeedback(
  data?.feedback || ""
);

  return (
  <>
    <Navbar />

    <div className="result-container">
      <div className="result-header">
        <span className="result-badge">
          {data.role === "resume-based"
            ? "📄 Resume-Based Interview"
            : "Standard Interview"}
        </span>

        <h2>Interview Analysis</h2>
        <p>Your performance breakdown and improvement roadmap</p>
      </div>

      <div className="score-card">
        <div className="score-left">
          <div className={`score-circle ${data.score <= 3 ? "low" : data.score <= 6 ? "medium" : "high"}`}>
            {data.feedback ? data.score : "--"}
          </div>

          <div>
            <h3>
              {data.score <= 3
                ? "Needs Improvement"
                : data.score <= 6
                ? "Average Performance"
                : "Strong Performance"}
            </h3>
            <p>Overall Score</p>
          </div>
        </div>

        <div className="score-meta">
          <p><b>Questions:</b> {data.questions.length}</p>
          <p>
            <b>Answered:</b>{" "}
            {data.questions.filter((q) => q.answer && q.answer.trim() !== "").length}
          </p>
        </div>
      </div>

      <div className="section">
        <h3>🤖 AI Assessment</h3>

        <div className="feedback-grid">

  <div className="feedback-card strengths">
    <h4>✅ Strengths</h4>

    {feedbackData.strengths.map((item, i) => (
      <p key={i}>{item}</p>
    ))}
  </div>

  <div className="feedback-card weaknesses">
    <h4>⚠ Weaknesses</h4>

    {feedbackData.weaknesses.map((item, i) => (
      <p key={i}>{item}</p>
    ))}
  </div>

  <div className="feedback-card suggestions">
    <h4>💡 Suggestions</h4>

    {feedbackData.suggestions.map((item, i) => (
      <p key={i}>{item}</p>
    ))}
  </div>

  <div className="feedback-card roadmap">
    <h4>🚀 Learning Path</h4>

    {feedbackData.learningPath.map((item, i) => (
      <p key={i}>{item}</p>
    ))}
  </div>

</div>
      </div>

      <div className="section">
        <h3>Questions & Answers</h3>

        <div className="qa-grid">
          {data.questions.map((q, index) => (
            <div key={index} className="qa-card">
              <span className="question-label">Question {index + 1}</span>
              <p className="question">{q.question}</p>

              <div className="answer-box">
                <span>Your Answer</span>
                <p>{q.answer || "Not answered"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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