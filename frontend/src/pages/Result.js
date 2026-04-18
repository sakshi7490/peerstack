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

    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <div className="container">
        <h2 className="title">Interview Result</h2>

        <div className="score-card">
          <h3>
            Score: {data.feedback && data.score !== undefined
            ? `${data.score}/10`
            : "Not evaluated"}
          </h3>
        </div>

        <h4>Feedback</h4>
        <div className="feedback-box">
          {data.feedback ? (
          data.feedback.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
            ))
          ) : (
                <p>No feedback available</p>
          )}
        </div>

        <h4>Questions & Answers</h4>
        {data.questions.map((q, index) => (
          <div key={index} className="qa-card">
            <p><b>Q:</b> {q.question}</p>
            <p><b>A:</b> {q.answer || "Not answered"}</p>
          </div>
        ))}

        <button
          className="button"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </>
);
}

export default Result;