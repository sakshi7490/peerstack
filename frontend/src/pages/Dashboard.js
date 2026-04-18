import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "../styles/dashboard.css";
import "../styles/result.css";


function Dashboard() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("backend");
  const [interviews, setInterviews] = useState([]);

  // Fetch past interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await API.get("/interview");
        setInterviews(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchInterviews();
  }, []);

  
  const startInterview = async () => {
  try {
    setLoading(true); // 🔥 START loading

    const res = await API.post("/interview/start", { role });

    // success
    toast.success("Interview Started 🚀");

    // redirect
    navigate(`/interview/${res.data.data._id}`);

  } catch (err) {
    toast.error("Failed to start interview ❌");
  } finally {
    setLoading(false); // 🔥 STOP loading
  }
};

  return (
  <>
    <Navbar />

    <div className="container">
      <h2 className="title">Dashboard</h2>

      {/* 🔥 Start Section */}
      <div className="top-section">
        <select
          className="select"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="aiml">AI/ML</option>
          <option value="hr">HR</option>
        </select>

        <button onClick={startInterview} disabled={loading}>
          {loading ? "Starting..." : "Start Interview"}
        </button>
      </div>

      {/* 🔥 History */}
      <h3 className="history-title">Past Interviews</h3>

      {interviews.length === 0 ? (
        <p>No interviews yet</p>
      ) : (
        interviews.map((item) => (
          <div
            key={item._id}
            className="card"
            style={{
              cursor:
                item.status === "completed" ? "pointer" : "not-allowed",
              opacity: item.status === "completed" ? 1 : 0.7,
            }}
            onClick={() => {
              if (item.status === "completed") {
                navigate(`/result/${item._id}`);
              }
            }}
          >
            <p><b>Role:</b> {item.role}</p>

            <p>
              <b>Status:</b>{" "}
              <span
                style={{
                  color:
                    item.status === "completed" ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                {item.status === "completed"
                  ? "Completed"
                  : "Pending"}
              </span>
            </p>

            <p>
              <b>Score:</b>{" "}
              {item.status === "completed"
                ? `${item.score}/10`
                : "Not evaluated"}
            </p>
          </div>
        ))
      )}
    </div>
  </>
);
}

export default Dashboard;